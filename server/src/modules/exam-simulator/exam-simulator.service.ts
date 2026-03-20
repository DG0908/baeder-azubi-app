import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AppRole, NotificationType, Prisma } from '@prisma/client';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserStatsService } from '../user-stats/user-stats.service';
import { CreatePracticalExamAttemptDto } from './dto/create-practical-exam-attempt.dto';
import { ListPracticalExamAttemptsQueryDto } from './dto/list-practical-exam-attempts-query.dto';
import { ListTheoryExamAttemptsQueryDto } from './dto/list-theory-exam-attempts-query.dto';
import { StartTheoryExamSessionDto } from './dto/start-theory-exam-session.dto';
import { SubmitTheoryExamSessionDto } from './dto/submit-theory-exam-session.dto';
import { evaluatePracticalAttempt, getPracticalPassXpReward } from './practical-exam.util';
import {
  buildTheoryExamQuestions,
  evaluateTheoryExamSubmission,
  parseTheorySessionQuestions
} from './theory-exam.util';

const THEORY_EXAM_SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const THEORY_EXAM_COMPLETION_XP = 20;
const THEORY_EXAM_CORRECT_ANSWER_XP = 1;
const THEORY_EXAM_PASS_BONUS_XP = 15;

const practicalAttemptSelect = {
  id: true,
  userId: true,
  createdById: true,
  examType: true,
  averageGrade: true,
  gradedCount: true,
  passed: true,
  missingTables: true,
  resultRows: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      displayName: true,
      role: true
    }
  },
  createdBy: {
    select: {
      id: true,
      displayName: true
    }
  }
} as const;

const theoryAttemptSelect = {
  id: true,
  userId: true,
  correct: true,
  total: true,
  percentage: true,
  passed: true,
  timeMs: true,
  keywordMode: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      displayName: true,
      role: true
    }
  }
} as const;

type PracticalAttemptPayload = {
  id: string;
  userId: string;
  createdById: string;
  examType: string;
  averageGrade: number | null;
  gradedCount: number;
  passed: boolean | null;
  missingTables: number;
  resultRows: unknown;
  createdAt: Date;
  user: {
    id: string;
    displayName: string;
    role: AppRole;
  };
  createdBy: {
    id: string;
    displayName: string;
  };
};

type TheoryAttemptPayload = {
  id: string;
  userId: string;
  correct: number;
  total: number;
  percentage: number;
  passed: boolean;
  timeMs: number;
  keywordMode: boolean;
  createdAt: Date;
  user: {
    id: string;
    displayName: string;
    role: AppRole;
  };
};

@Injectable()
export class ExamSimulatorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService,
    private readonly userStatsService: UserStatsService
  ) {}

  async startTheorySession(actor: AuthenticatedUser, dto: StartTheoryExamSessionDto, request: Request) {
    this.assertOrganization(actor);

    const questions = buildTheoryExamQuestions();
    const session = await this.prisma.theoryExamSession.create({
      data: {
        organizationId: actor.organizationId!,
        userId: actor.id,
        keywordMode: Boolean(dto.keywordMode),
        questions: questions as unknown as Prisma.InputJsonValue,
        totalQuestions: questions.length,
        expiresAt: new Date(Date.now() + THEORY_EXAM_SESSION_TTL_MS)
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'theory_exam.session_started',
      'TheoryExamSession',
      session.id,
      {
        keywordMode: session.keywordMode,
        totalQuestions: session.totalQuestions
      },
      request
    );

    return {
      sessionId: session.id,
      keywordMode: session.keywordMode,
      totalQuestions: session.totalQuestions,
      expiresAt: session.expiresAt.toISOString(),
      questions
    };
  }

  async submitTheorySession(
    actor: AuthenticatedUser,
    sessionId: string,
    dto: SubmitTheoryExamSessionDto,
    request: Request
  ) {
    this.assertOrganization(actor);

    const session = await this.prisma.theoryExamSession.findFirst({
      where: {
        id: sessionId,
        organizationId: actor.organizationId!
      }
    });

    if (!session) {
      throw new NotFoundException('Theory exam session not found.');
    }
    if (session.userId !== actor.id) {
      throw new ForbiddenException('You may only submit your own theory exam session.');
    }
    if (session.completedAt) {
      throw new ConflictException('This theory exam session has already been submitted.');
    }
    if (session.expiresAt.getTime() <= Date.now()) {
      throw new ConflictException('This theory exam session has expired.');
    }

    const storedQuestions = parseTheorySessionQuestions(session.questions);
    if (storedQuestions.length === 0) {
      throw new ConflictException('Theory exam session payload is invalid.');
    }

    const evaluation = evaluateTheoryExamSubmission(storedQuestions, dto.answers, session.keywordMode);
    const safeTimeMs = Math.max(0, Math.min(43_200_000, Number(dto.timeMs) || 0));
    const earnedXp =
      THEORY_EXAM_COMPLETION_XP
      + (evaluation.correctCount * THEORY_EXAM_CORRECT_ANSWER_XP)
      + (evaluation.passed ? THEORY_EXAM_PASS_BONUS_XP : 0);

    const attempt = await this.prisma.$transaction(async (tx) => {
      const created = await tx.theoryExamAttempt.create({
        data: {
          organizationId: actor.organizationId!,
          userId: actor.id,
          sessionId: session.id,
          correct: evaluation.correctCount,
          total: evaluation.total,
          percentage: evaluation.percentage,
          passed: evaluation.passed,
          timeMs: safeTimeMs,
          keywordMode: session.keywordMode
        },
        select: theoryAttemptSelect
      });

      await tx.theoryExamSession.update({
        where: { id: session.id },
        data: {
          completedAt: new Date()
        }
      });

      return created;
    });

    const xpAwardResult = earnedXp > 0
      ? await this.userStatsService.awardXp({
          organizationId: actor.organizationId!,
          targetUserId: actor.id,
          sourceKey: 'examSimulator',
          amount: earnedXp,
          eventKey: `theory_exam_${session.id}`,
          reason: 'Pruefungssimulator'
        })
      : null;
    const addedXp = Number(xpAwardResult?.addedXp || 0);

    await this.auditLogService.writeForUser(
      actor,
      'theory_exam.submitted',
      'TheoryExamAttempt',
      attempt.id,
      {
        sessionId: session.id,
        correct: attempt.correct,
        total: attempt.total,
        percentage: attempt.percentage,
        keywordMode: attempt.keywordMode,
        awardedXp: addedXp
      },
      request
    );

    return {
      ...this.toTheoryAttemptPayload(attempt),
      xpAward: {
        addedXp
      }
    };
  }

  async listTheoryAttempts(actor: AuthenticatedUser, query: ListTheoryExamAttemptsQueryDto) {
    this.assertOrganization(actor);
    const targetUserId = this.resolveRequestedUserId(actor, query.userId);

    const attempts = await this.prisma.theoryExamAttempt.findMany({
      where: {
        organizationId: actor.organizationId!,
        ...(targetUserId ? { userId: targetUserId } : {})
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: theoryAttemptSelect
    });

    return attempts.map((attempt: TheoryAttemptPayload) => this.toTheoryAttemptPayload(attempt));
  }

  async listPracticalAttempts(actor: AuthenticatedUser, query: ListPracticalExamAttemptsQueryDto) {
    this.assertOrganization(actor);
    const targetUserId = this.resolveRequestedUserId(actor, query.userId);

    const attempts = await this.prisma.practicalExamAttempt.findMany({
      where: {
        organizationId: actor.organizationId!,
        ...(targetUserId ? { userId: targetUserId } : {}),
        ...(query.examType ? { examType: query.examType } : {})
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: practicalAttemptSelect
    });

    return attempts.map((attempt: PracticalAttemptPayload) => this.toPracticalAttemptPayload(attempt));
  }

  async createPracticalAttempt(
    actor: AuthenticatedUser,
    dto: CreatePracticalExamAttemptDto,
    request: Request
  ) {
    this.assertOrganization(actor);
    const targetUser = await this.resolvePracticalTargetUser(actor, dto.userId);
    const evaluation = evaluatePracticalAttempt(dto.examType, this.normalizeInputValues(dto.inputValues));

    if (evaluation.missingRequiredInputs.length > 0) {
      throw new BadRequestException(`Bitte gueltige Eingaben ergaenzen: ${evaluation.missingRequiredInputs.join(', ')}`);
    }

    const created = await this.prisma.practicalExamAttempt.create({
      data: {
        organizationId: actor.organizationId!,
        userId: targetUser.id,
        createdById: actor.id,
        examType: dto.examType,
        averageGrade: evaluation.averageGrade,
        gradedCount: evaluation.gradedCount,
        passed: evaluation.passed,
        missingTables: evaluation.missingTables,
        resultRows: evaluation.rows as unknown as Prisma.InputJsonValue
      },
      select: practicalAttemptSelect
    });

    const xpReward = evaluation.passed ? getPracticalPassXpReward(evaluation.averageGrade) : { gradeBucket: null, xp: 0 };
    const xpAwardResult = xpReward.xp > 0
      ? await this.userStatsService.awardXp({
          organizationId: actor.organizationId!,
          targetUserId: targetUser.id,
          sourceKey: 'practicalExam',
          amount: xpReward.xp,
          eventKey: `practical_exam_${created.id}`,
          reason: xpReward.gradeBucket ? `Praxis bestanden - Note ${xpReward.gradeBucket}` : 'Praxis bestanden'
        })
      : null;
    const addedXp = Number(xpAwardResult?.addedXp || 0);

    if (targetUser.id !== actor.id) {
      await this.notificationsService.createForUser(targetUser.id, {
        title: 'Praktische Pruefung ausgewertet',
        message: `${actor.displayName} hat deine praktische ${dto.examType === 'zwischen' ? 'Zwischenpruefung' : 'Abschlusspruefung'} ausgewertet.${addedXp > 0 ? ` XP: +${addedXp}.` : ''}`,
        type: NotificationType.INFO,
        metadata: {
          eventType: 'PRACTICAL_EXAM_CREATED',
          practicalExamAttemptId: created.id,
          awardedXp: addedXp
        }
      });
    }

    await this.auditLogService.writeForUser(
      actor,
      'practical_exam.created',
      'PracticalExamAttempt',
      created.id,
      {
        ownerUserId: targetUser.id,
        examType: dto.examType,
        averageGrade: evaluation.averageGrade,
        passed: evaluation.passed,
        awardedXp: addedXp
      },
      request
    );

    return {
      ...this.toPracticalAttemptPayload(created),
      xpAward: {
        addedXp,
        gradeBucket: xpReward.gradeBucket
      }
    };
  }

  async deletePracticalAttempt(actor: AuthenticatedUser, attemptId: string, request: Request) {
    this.assertOrganization(actor);

    const attempt = await this.prisma.practicalExamAttempt.findFirst({
      where: {
        id: attemptId,
        organizationId: actor.organizationId!
      },
      select: {
        id: true,
        userId: true
      }
    });

    if (!attempt) {
      throw new NotFoundException('Practical exam attempt not found.');
    }

    if (!this.isStaff(actor.role) && attempt.userId !== actor.id) {
      throw new ForbiddenException('You may only delete your own practical exam attempts.');
    }

    const xpEvent = await this.prisma.userXpEvent.findFirst({
      where: {
        eventKey: `practical_exam_${attempt.id}`
      },
      select: {
        id: true
      }
    });

    if (xpEvent) {
      throw new ConflictException('Practical exam attempts with awarded XP may not be deleted.');
    }

    await this.prisma.practicalExamAttempt.delete({
      where: {
        id: attempt.id
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'practical_exam.deleted',
      'PracticalExamAttempt',
      attempt.id,
      {
        ownerUserId: attempt.userId
      },
      request
    );

    return {
      success: true
    };
  }

  private async resolvePracticalTargetUser(actor: AuthenticatedUser, requestedUserId?: string) {
    const targetUserId = requestedUserId?.trim() || actor.id;
    if (!this.isStaff(actor.role) && targetUserId !== actor.id) {
      throw new ForbiddenException('You may only evaluate your own practical exam.');
    }

    const targetUser = await this.prisma.user.findFirst({
      where: {
        id: targetUserId,
        organizationId: actor.organizationId!,
        isDeleted: false
      },
      select: {
        id: true,
        displayName: true,
        role: true
      }
    });

    if (!targetUser) {
      throw new NotFoundException('Selected practical exam participant was not found.');
    }

    return targetUser;
  }

  private resolveRequestedUserId(actor: AuthenticatedUser, requestedUserId?: string) {
    const normalizedUserId = requestedUserId?.trim();
    if (!normalizedUserId) {
      return this.isStaff(actor.role) ? undefined : actor.id;
    }
    if (!this.isStaff(actor.role) && normalizedUserId !== actor.id) {
      throw new ForbiddenException('You may only access your own exam history.');
    }
    return normalizedUserId;
  }

  private normalizeInputValues(inputValues: Record<string, string>) {
    return Object.fromEntries(
      Object.entries(inputValues || {}).map(([key, value]) => [String(key), String(value ?? '').trim()])
    );
  }

  private isStaff(role: AppRole) {
    return role === AppRole.ADMIN || role === AppRole.AUSBILDER;
  }

  private assertOrganization(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }
  }

  private toTheoryAttemptPayload(attempt: TheoryAttemptPayload) {
    return {
      id: attempt.id,
      userId: attempt.userId,
      userName: attempt.user.displayName,
      correct: attempt.correct,
      total: attempt.total,
      percentage: attempt.percentage,
      passed: attempt.passed,
      timeMs: attempt.timeMs,
      keywordMode: attempt.keywordMode,
      createdAt: attempt.createdAt.toISOString()
    };
  }

  private toPracticalAttemptPayload(attempt: PracticalAttemptPayload) {
    return {
      id: attempt.id,
      userId: attempt.userId,
      userName: attempt.user.displayName,
      examType: attempt.examType,
      averageGrade: attempt.averageGrade,
      gradedCount: attempt.gradedCount,
      passed: attempt.passed,
      missingTables: attempt.missingTables,
      rows: Array.isArray(attempt.resultRows) ? attempt.resultRows : [],
      createdAt: attempt.createdAt.toISOString(),
      createdById: attempt.createdById,
      createdByName: attempt.createdBy.displayName,
      source: 'secure-backend'
    };
  }
}
