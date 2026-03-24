import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountStatus, DuelStatus, NotificationType, Prisma } from '@prisma/client';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateDuelDto } from './dto/create-duel.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

const REMINDER_LEAD_MIN_MS = 15 * 60 * 1000;
const REMINDER_LEAD_MAX_MS = 24 * 60 * 60 * 1000;

const duelParticipantSelect = {
  id: true,
  displayName: true,
  role: true
} satisfies Prisma.UserSelect;

const duelInclude = {
  challenger: { select: duelParticipantSelect },
  opponent: { select: duelParticipantSelect },
  winnerUser: { select: duelParticipantSelect },
  duelQuestions: {
    include: {
      question: {
        select: {
          id: true,
          category: true,
          prompt: true,
          options: true,
          explanation: true,
          correctOptionIndex: true
        }
      }
    },
    orderBy: {
      orderIndex: 'asc'
    }
  },
  answers: {
    select: {
      duelQuestionId: true,
      userId: true,
      selectedOptionIndex: true,
      isCorrect: true,
      durationMs: true,
      answeredAt: true
    }
  }
} satisfies Prisma.DuelInclude;

type DuelWithRelations = Prisma.DuelGetPayload<{ include: typeof duelInclude }>;

@Injectable()
export class DuelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService
  ) {}

  async create(actor: AuthenticatedUser, dto: CreateDuelDto, request: Request) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }

    if (actor.id === dto.opponentId) {
      throw new BadRequestException('You cannot duel yourself.');
    }

    await this.reconcileDueDuelsAndReminders({
      participantUserId: actor.id,
      includeReminders: false
    });

    const existingOpenDuel = await this.prisma.duel.findFirst({
      where: {
        organizationId: actor.organizationId,
        status: {
          in: [DuelStatus.PENDING, DuelStatus.ACTIVE]
        },
        expiresAt: {
          gt: new Date()
        },
        OR: [
          {
            challengerId: actor.id,
            opponentId: dto.opponentId
          },
          {
            challengerId: dto.opponentId,
            opponentId: actor.id
          }
        ]
      },
      select: {
        id: true
      }
    });

    if (existingOpenDuel) {
      throw new ConflictException('A duel with this opponent is already active or awaiting acceptance.');
    }

    const opponent = await this.prisma.user.findFirst({
      where: {
        id: dto.opponentId,
        organizationId: actor.organizationId,
        status: AccountStatus.APPROVED,
        isDeleted: false
      },
      select: duelParticipantSelect
    });

    if (!opponent) {
      throw new NotFoundException('Opponent is not available in your organization.');
    }

    const questionCount =
      dto.questionCount ?? Number(this.configService.get<number>('DUEL_DEFAULT_QUESTION_COUNT', 10));
    const requestTimeoutMinutes = this.normalizeRequestTimeoutMinutes(dto.requestTimeoutMinutes);
    const availableQuestions = await this.prisma.question.findMany({
      where: {
        isActive: true,
        ...(dto.category ? { category: dto.category.trim() } : {})
      },
      select: {
        id: true
      },
      take: questionCount * 3
    });

    if (availableQuestions.length < questionCount) {
      throw new BadRequestException('Not enough active questions are available for this duel.');
    }

    const selectedQuestions = this.shuffle(availableQuestions)
      .slice(0, questionCount)
      .map((question) => question.id);

    const duel = await this.prisma.$transaction(async (tx) => {
      const created = await tx.duel.create({
        data: {
          organizationId: actor.organizationId!,
          challengerId: actor.id,
          opponentId: dto.opponentId,
          status: DuelStatus.PENDING,
          questionCount,
          expiresAt: this.buildPendingExpiryDate(requestTimeoutMinutes),
          reminderSentAt: null
        }
      });

      await tx.duelQuestion.createMany({
        data: selectedQuestions.map((questionId, index) => ({
          duelId: created.id,
          questionId,
          orderIndex: index
        }))
      });

      return tx.duel.findUniqueOrThrow({
        where: { id: created.id },
        include: duelInclude
      });
    });

    await this.notificationsService.createForUser(opponent.id, {
      title: 'Neue Quizduell-Herausforderung',
      message: `${actor.displayName} hat dich zu einem Quizduell herausgefordert.`,
      type: NotificationType.INFO,
      metadata: {
        duelId: duel.id,
        status: duel.status
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'duel.created',
      'duel',
      duel.id,
      {
        opponentId: dto.opponentId,
        questionCount,
        requestTimeoutMinutes
      },
      request
    );

    return this.toDuelPayload(duel, actor.id);
  }

  async accept(actor: AuthenticatedUser, duelId: string, request: Request) {
    const duel = await this.prisma.duel.findUnique({
      where: { id: duelId },
      include: duelInclude
    });

    if (!duel) {
      throw new NotFoundException('Duel not found.');
    }

    if (duel.opponentId !== actor.id) {
      throw new ForbiddenException('Only the challenged user may accept this duel.');
    }

    if (duel.status !== DuelStatus.PENDING) {
      throw new ConflictException('This duel is not awaiting acceptance.');
    }

    if (this.isDuelExpired(duel)) {
      await this.expireDuelAndNotify(duel);
      throw new ConflictException('This duel request has expired.');
    }

    const updated = await this.prisma.duel.update({
      where: { id: duel.id },
      data: {
        status: DuelStatus.ACTIVE,
        startedAt: new Date(),
        expiresAt: this.buildTurnExpiryDate(),
        reminderSentAt: null
      },
      include: duelInclude
    });

    await this.notificationsService.createForUser(duel.challenger.id, {
      title: 'Quizduell angenommen',
      message: `${actor.displayName} hat deine Herausforderung angenommen.`,
      type: NotificationType.SUCCESS,
      metadata: {
        duelId: duel.id,
        status: updated.status
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'duel.accepted',
      'duel',
      duel.id,
      {},
      request
    );

    return this.toDuelPayload(updated, actor.id);
  }

  async listMine(actor: AuthenticatedUser) {
    await this.reconcileDueDuelsAndReminders({
      participantUserId: actor.id
    });

    const duels = await this.prisma.duel.findMany({
      where: {
        OR: [{ challengerId: actor.id }, { opponentId: actor.id }]
      },
      include: duelInclude,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return duels.map((duel) => this.toDuelSummary(duel, actor.id));
  }

  async getOne(actor: AuthenticatedUser, duelId: string) {
    await this.reconcileDueDuelsAndReminders({
      participantUserId: actor.id
    });

    const duel = await this.prisma.duel.findUnique({
      where: { id: duelId },
      include: duelInclude
    });

    if (!duel) {
      throw new NotFoundException('Duel not found.');
    }

    this.assertDuelParticipant(actor, duel);
    return this.toDuelPayload(duel, actor.id);
  }

  async submitAnswer(actor: AuthenticatedUser, duelId: string, dto: SubmitAnswerDto, request: Request) {
    const result = await this.prisma.$transaction(async (tx) => {
      const duel = await tx.duel.findUnique({
        where: { id: duelId },
        include: duelInclude
      });

      if (!duel) {
        throw new NotFoundException('Duel not found.');
      }

      this.assertDuelParticipant(actor, duel);

      if (duel.status !== DuelStatus.ACTIVE) {
        throw new ConflictException('Duel is not active.');
      }

      if (this.isDuelExpired(duel)) {
        await tx.duel.update({
          where: { id: duel.id },
          data: {
            status: DuelStatus.EXPIRED,
            reminderSentAt: null
          }
        });
        throw new ConflictException('Duel has expired.');
      }

      const duelQuestion = duel.duelQuestions.find((entry) => entry.id === dto.duelQuestionId);
      if (!duelQuestion) {
        throw new NotFoundException('Assigned duel question not found.');
      }

      const existingAnswer = await tx.duelAnswer.findUnique({
        where: {
          duelQuestionId_userId: {
            duelQuestionId: duelQuestion.id,
            userId: actor.id
          }
        }
      });

      if (existingAnswer) {
        throw new ConflictException('This question has already been answered.');
      }

      const optionCount = this.extractOptions(duelQuestion.question.options).length;
      if (dto.selectedOptionIndex >= optionCount) {
        throw new BadRequestException('selectedOptionIndex is outside the question option range.');
      }

      await tx.duelAnswer.create({
        data: {
          duelId: duel.id,
          duelQuestionId: duelQuestion.id,
          userId: actor.id,
          selectedOptionIndex: dto.selectedOptionIndex,
          isCorrect: dto.selectedOptionIndex === duelQuestion.question.correctOptionIndex,
          durationMs: dto.durationMs
        }
      });

      const withLatestAnswers = await tx.duel.findUniqueOrThrow({
        where: { id: duel.id },
        include: duelInclude
      });

      if (withLatestAnswers.answers.length >= withLatestAnswers.questionCount * 2) {
        const finalized = await tx.duel.update({
          where: { id: duel.id },
          data: this.buildFinalizationUpdate(withLatestAnswers),
          include: duelInclude
        });

        return {
          duel: finalized,
          finalized: true
        };
      }

      const continued = await tx.duel.update({
        where: { id: duel.id },
        data: {
          expiresAt: this.buildTurnExpiryDate(),
          reminderSentAt: null
        },
        include: duelInclude
      });

      return {
        duel: continued,
        finalized: false
      };
    });

    if (result.finalized) {
      await this.notifyDuelCompleted(result.duel);
      await this.auditLogService.writeForUser(
        actor,
        'duel.completed',
        'duel',
        duelId,
        this.toDuelSummary(result.duel, actor.id),
        request
      );
    }

    return this.toDuelPayload(result.duel, actor.id);
  }

  async leaderboard(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      return [];
    }

    const duels = await this.prisma.duel.findMany({
      where: {
        organizationId: actor.organizationId,
        status: DuelStatus.COMPLETED
      },
      select: {
        challengerId: true,
        opponentId: true,
        winnerUserId: true,
        challenger: {
          select: duelParticipantSelect
        },
        opponent: {
          select: duelParticipantSelect
        }
      }
    });

    const table = new Map<
      string,
      { userId: string; displayName: string; role: string; wins: number; losses: number; draws: number }
    >();

    for (const duel of duels) {
      for (const participant of [duel.challenger, duel.opponent]) {
        if (!table.has(participant.id)) {
          table.set(participant.id, {
            userId: participant.id,
            displayName: participant.displayName,
            role: participant.role,
            wins: 0,
            losses: 0,
            draws: 0
          });
        }
      }

      if (!duel.winnerUserId) {
        table.get(duel.challengerId)!.draws += 1;
        table.get(duel.opponentId)!.draws += 1;
        continue;
      }

      const loserId = duel.winnerUserId === duel.challengerId ? duel.opponentId : duel.challengerId;
      table.get(duel.winnerUserId)!.wins += 1;
      table.get(loserId)!.losses += 1;
    }

    return [...table.values()].sort((left, right) => {
      if (right.wins !== left.wins) {
        return right.wins - left.wins;
      }
      if (right.draws !== left.draws) {
        return right.draws - left.draws;
      }
      return left.losses - right.losses;
    });
  }

  async reconcileDueDuelsAndReminders(options: { participantUserId?: string; includeReminders?: boolean } = {}) {
    const includeReminders = options.includeReminders ?? true;
    const now = new Date();
    let expiredCount = 0;
    let remindedCount = 0;

    const dueWhere = this.buildLifecycleScopeWhere(options.participantUserId);
    const expiredDuels = await this.prisma.duel.findMany({
      where: {
        ...dueWhere,
        status: {
          in: [DuelStatus.PENDING, DuelStatus.ACTIVE]
        },
        expiresAt: {
          lte: now
        }
      },
      include: duelInclude
    });

    for (const duel of expiredDuels) {
      await this.expireDuelAndNotify(duel);
      expiredCount += 1;
    }

    if (!includeReminders) {
      return { expiredCount, remindedCount };
    }

    const reminderCandidates = await this.prisma.duel.findMany({
      where: {
        ...dueWhere,
        status: {
          in: [DuelStatus.PENDING, DuelStatus.ACTIVE]
        },
        expiresAt: {
          gt: now
        },
        reminderSentAt: null
      },
      include: duelInclude
    });

    for (const duel of reminderCandidates) {
      if (!this.shouldSendReminder(duel, now)) {
        continue;
      }

      const recipientIds = this.getReminderRecipientIds(duel);
      if (recipientIds.length === 0) {
        continue;
      }

      for (const recipientId of recipientIds) {
        await this.notificationsService.createForUser(recipientId, {
          title: duel.status === DuelStatus.PENDING ? 'Quizduell wartet auf Annahme' : 'Quizduell-Erinnerung',
          message: duel.status === DuelStatus.PENDING
            ? `Die Herausforderung von ${duel.challenger.displayName} läuft bald ab.`
            : `Dein Quizduell gegen ${this.getDisplayOpponentNameForReminder(duel, recipientId)} läuft bald ab.`,
          type: NotificationType.WARNING,
          metadata: {
            duelId: duel.id,
            status: duel.status,
            expiresAt: duel.expiresAt
          }
        });
      }

      await this.prisma.duel.update({
        where: { id: duel.id },
        data: {
          reminderSentAt: now
        }
      });
      remindedCount += recipientIds.length;
    }

    return { expiredCount, remindedCount };
  }

  private buildFinalizationUpdate(duel: DuelWithRelations) {
    const challengerScore = duel.answers.filter(
      (answer) => answer.userId === duel.challengerId && answer.isCorrect
    ).length;
    const opponentScore = duel.answers.filter(
      (answer) => answer.userId === duel.opponentId && answer.isCorrect
    ).length;

    let winnerUserId: string | null = null;
    if (challengerScore > opponentScore) {
      winnerUserId = duel.challengerId;
    } else if (opponentScore > challengerScore) {
      winnerUserId = duel.opponentId;
    }

    return {
      status: DuelStatus.COMPLETED,
      completedAt: new Date(),
      winnerUserId,
      expiresAt: null,
      reminderSentAt: null
    };
  }

  private async notifyDuelCompleted(duel: DuelWithRelations) {
    const winnerName = duel.winnerUser?.displayName || null;
    const title = winnerName ? 'Quizduell beendet' : 'Quizduell unentschieden';

    await this.notificationsService.createForUsers([duel.challengerId, duel.opponentId], {
      title,
      message: winnerName
        ? `Das Quizduell ist abgeschlossen. ${winnerName} hat gewonnen.`
        : 'Das Quizduell ist abgeschlossen und endete unentschieden.',
      type: winnerName ? NotificationType.SUCCESS : NotificationType.INFO,
      metadata: {
        duelId: duel.id,
        status: duel.status,
        winnerUserId: duel.winnerUser?.id ?? null
      }
    });
  }

  private async expireDuelAndNotify(duel: DuelWithRelations) {
    const updated = await this.prisma.duel.update({
      where: { id: duel.id },
      data: {
        status: DuelStatus.EXPIRED,
        reminderSentAt: null
      },
      include: duelInclude
    });

    const message = duel.status === DuelStatus.PENDING
      ? `Die Herausforderung zwischen ${duel.challenger.displayName} und ${duel.opponent.displayName} ist abgelaufen.`
      : `Das aktive Quizduell zwischen ${duel.challenger.displayName} und ${duel.opponent.displayName} ist wegen Fristablauf beendet worden.`;

    await this.notificationsService.createForUsers([duel.challengerId, duel.opponentId], {
      title: 'Quizduell abgelaufen',
      message,
      type: NotificationType.WARNING,
      metadata: {
        duelId: updated.id,
        status: updated.status
      }
    });

    return updated;
  }

  private shouldSendReminder(duel: DuelWithRelations, now: Date) {
    const expiresAtMs = duel.expiresAt?.getTime();
    if (!expiresAtMs) {
      return false;
    }

    const baseTimestamp = duel.status === DuelStatus.PENDING
      ? duel.createdAt.getTime()
      : duel.updatedAt.getTime();
    const ttlMs = Math.max(REMINDER_LEAD_MIN_MS, expiresAtMs - baseTimestamp);
    const reminderLeadMs = Math.min(
      REMINDER_LEAD_MAX_MS,
      Math.max(REMINDER_LEAD_MIN_MS, Math.floor(ttlMs / 2))
    );

    return now.getTime() >= expiresAtMs - reminderLeadMs;
  }

  private getReminderRecipientIds(duel: DuelWithRelations) {
    if (duel.status === DuelStatus.PENDING) {
      return [duel.opponentId];
    }

    if (duel.status !== DuelStatus.ACTIVE) {
      return [];
    }

    const answeredByUser = new Map<string, number>();
    for (const answer of duel.answers) {
      answeredByUser.set(answer.userId, (answeredByUser.get(answer.userId) ?? 0) + 1);
    }

    return [duel.challengerId, duel.opponentId].filter((userId) => (
      (answeredByUser.get(userId) ?? 0) < duel.questionCount
    ));
  }

  private getDisplayOpponentNameForReminder(duel: DuelWithRelations, recipientUserId: string) {
    return duel.challengerId === recipientUserId
      ? duel.opponent.displayName
      : duel.challenger.displayName;
  }

  private buildLifecycleScopeWhere(participantUserId?: string): Prisma.DuelWhereInput {
    if (!participantUserId) {
      return {};
    }

    return {
      OR: [
        {
          challengerId: participantUserId
        },
        {
          opponentId: participantUserId
        }
      ]
    };
  }

  private buildPendingExpiryDate(requestTimeoutMinutes?: number) {
    const timeoutMinutes = this.normalizeRequestTimeoutMinutes(requestTimeoutMinutes);
    return new Date(Date.now() + timeoutMinutes * 60 * 1000);
  }

  private buildTurnExpiryDate() {
    const timeoutMinutes = this.normalizeTurnTimeoutMinutes();
    return new Date(Date.now() + timeoutMinutes * 60 * 1000);
  }

  private normalizeRequestTimeoutMinutes(value?: number) {
    const configured = Number(
      value ?? this.configService.get<number>('DUEL_REQUEST_TTL_MINUTES', 2880)
    );
    if (!Number.isFinite(configured)) {
      return 2880;
    }

    return Math.min(10080, Math.max(15, Math.round(configured)));
  }

  private normalizeTurnTimeoutMinutes() {
    const configured = Number(this.configService.get<number>('DUEL_TURN_TTL_MINUTES', 2880));
    if (!Number.isFinite(configured)) {
      return 2880;
    }

    return Math.min(10080, Math.max(15, Math.round(configured)));
  }

  private isDuelExpired(duel: Pick<DuelWithRelations, 'expiresAt'>) {
    return Boolean(duel.expiresAt && duel.expiresAt.getTime() <= Date.now());
  }

  private toDuelPayload(duel: DuelWithRelations, actorId: string) {
    const score = this.computeScore(duel);
    const answersByQuestion = new Map(
      duel.answers
        .filter((answer) => answer.userId === actorId)
        .map((answer) => [answer.duelQuestionId, answer])
    );

    return {
      ...this.toDuelSummary(duel, actorId),
      questions: duel.duelQuestions.map((assignment) => ({
        id: assignment.id,
        orderIndex: assignment.orderIndex,
        question: {
          id: assignment.question.id,
          category: assignment.question.category,
          prompt: assignment.question.prompt,
          options: this.extractOptions(assignment.question.options),
          correctOptionIndex: assignment.question.correctOptionIndex,
          explanation: duel.status === DuelStatus.COMPLETED ? assignment.question.explanation : null
        },
        myAnswer: answersByQuestion.get(assignment.id) ?? null
      })),
      score
    };
  }

  private toDuelSummary(duel: DuelWithRelations, actorId: string) {
    const score = this.computeScore(duel);
    const myUserId = actorId;
    const opponentUserId = duel.challengerId === actorId ? duel.opponentId : duel.challengerId;

    return {
      id: duel.id,
      status: duel.status,
      questionCount: duel.questionCount,
      expiresAt: duel.expiresAt,
      startedAt: duel.startedAt,
      completedAt: duel.completedAt,
      createdAt: duel.createdAt,
      updatedAt: duel.updatedAt,
      challenger: duel.challenger,
      opponent: duel.opponent,
      winnerUser: duel.winnerUser,
      myScore: score[myUserId] ?? 0,
      opponentScore: score[opponentUserId] ?? 0,
      myAnsweredCount: duel.answers.filter((answer) => answer.userId === myUserId).length
    };
  }

  private computeScore(duel: DuelWithRelations) {
    const scoreboard: Record<string, number> = {};
    for (const answer of duel.answers) {
      if (!scoreboard[answer.userId]) {
        scoreboard[answer.userId] = 0;
      }
      if (answer.isCorrect) {
        scoreboard[answer.userId] += 1;
      }
    }
    return scoreboard;
  }

  private extractOptions(options: Prisma.JsonValue): string[] {
    return Array.isArray(options) ? options.map((entry) => String(entry)) : [];
  }

  private assertDuelParticipant(
    actor: AuthenticatedUser,
    duel: Pick<DuelWithRelations, 'challengerId' | 'opponentId'>
  ) {
    if (duel.challengerId !== actor.id && duel.opponentId !== actor.id) {
      throw new ForbiddenException('You are not a participant in this duel.');
    }
  }

  private shuffle<T>(values: T[]): T[] {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }
}
