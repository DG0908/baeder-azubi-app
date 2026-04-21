import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {
  AccountStatus,
  AppRole,
  NotificationType,
  Prisma
} from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateQuestionReportDto } from './dto/create-question-report.dto';
import { CreateSubmittedQuestionDto } from './dto/create-submitted-question.dto';
import { UpdateQuestionReportStatusDto } from './dto/update-question-report-status.dto';

const submittedQuestionSelect = {
  id: true,
  category: true,
  question: true,
  answers: true,
  correct: true,
  correctIndices: true,
  multi: true,
  type: true,
  clues: true,
  approved: true,
  approvedAt: true,
  createdAt: true,
  userId: true,
  user: {
    select: {
      id: true,
      displayName: true
    }
  },
  approvedBy: {
    select: {
      id: true,
      displayName: true
    }
  }
};

const questionReportSelect = {
  id: true,
  questionKey: true,
  questionText: true,
  category: true,
  source: true,
  note: true,
  answers: true,
  status: true,
  resolvedAt: true,
  createdAt: true,
  reportedById: true,
  reportedBy: {
    select: {
      id: true,
      displayName: true
    }
  },
  resolvedBy: {
    select: {
      id: true,
      displayName: true
    }
  }
};

type SubmittedQuestionRecord = {
  id: string;
  category: string;
  question: string;
  answers: Prisma.JsonValue;
  correct: number;
  correctIndices: Prisma.JsonValue | null;
  multi: boolean;
  type: string;
  clues: Prisma.JsonValue | null;
  approved: boolean;
  approvedAt: Date | null;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    displayName: string;
  };
  approvedBy: {
    id: string;
    displayName: string;
  } | null;
};

type QuestionReportRecord = {
  id: string;
  questionKey: string;
  questionText: string;
  category: string;
  source: string;
  note: string | null;
  answers: Prisma.JsonValue;
  status: 'OPEN' | 'RESOLVED';
  resolvedAt: Date | null;
  createdAt: Date;
  reportedById: string;
  reportedBy: {
    id: string;
    displayName: string;
  };
  resolvedBy: {
    id: string;
    displayName: string;
  } | null;
};

@Injectable()
export class QuestionWorkflowsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService
  ) {}

  async listSubmittedQuestions(actor: AuthenticatedUser) {
    this.assertOrganization(actor);

    const where = this.isStaff(actor.role)
      ? {
          organizationId: actor.organizationId!
        }
      : {
          organizationId: actor.organizationId!,
          OR: [
            { approved: true },
            { userId: actor.id }
          ]
        };

    const questions = await this.prisma.submittedQuestion.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: 300,
      select: submittedQuestionSelect
    });

    return questions.map((entry) => this.toSubmittedQuestionPayload(entry));
  }

  async createSubmittedQuestion(
    actor: AuthenticatedUser,
    dto: CreateSubmittedQuestionDto,
    request: Request
  ) {
    this.assertOrganization(actor);

    const category = this.sanitizeIdentifier(dto.category, 'category');
    const question = this.sanitizeText(dto.question, 'question', 2000);
    const type = dto.type === 'whoami' ? 'whoami' : 'multiple';

    let answers: string[];
    let correct: number;
    let correctIndices: number[] | null = null;
    let multi: boolean;
    let clues: string[] | null = null;

    if (type === 'whoami') {
      answers = this.sanitizeWhoAmIAnswer(dto.answers);
      clues = this.sanitizeClueList(dto.clues);
      correct = 0;
      multi = false;
    } else {
      answers = this.sanitizeAnswerList(dto.answers);
      multi = Boolean(dto.multi);

      if (multi) {
        const rawIndices = Array.isArray(dto.correctIndices) ? dto.correctIndices.map(Number) : [];
        const normalized = Array.from(new Set(rawIndices))
          .filter((value) => Number.isInteger(value) && value >= 0 && value < answers.length)
          .sort((a, b) => a - b);

        if (normalized.length !== rawIndices.length || normalized.length < 1) {
          throw new BadRequestException('Correct indices are invalid.');
        }

        correctIndices = normalized;
        correct = normalized[0];
      } else {
        correct = Number(dto.correct);
        if (!Number.isInteger(correct) || correct < 0 || correct >= answers.length) {
          throw new BadRequestException('Correct answer index is invalid.');
        }
      }
    }

    const autoApprove = this.isStaff(actor.role);

    const created = await this.prisma.submittedQuestion.create({
      data: {
        organizationId: actor.organizationId!,
        userId: actor.id,
        category,
        question,
        answers,
        correct,
        correctIndices: correctIndices ?? undefined,
        multi,
        type,
        clues: clues ?? undefined,
        approved: autoApprove,
        approvedById: autoApprove ? actor.id : null,
        approvedAt: autoApprove ? new Date() : null
      },
      select: submittedQuestionSelect
    });

    if (!autoApprove) {
      await this.notifyStaffAboutPendingSubmission(actor, created.id, category);
    }

    await this.auditLogService.writeForUser(
      actor,
      'submitted_question.created',
      'SubmittedQuestion',
      created.id,
      {
        category,
        approved: autoApprove
      },
      request
    );

    return this.toSubmittedQuestionPayload(created);
  }

  async approveSubmittedQuestion(actor: AuthenticatedUser, questionId: string, request: Request) {
    this.assertOrganization(actor);
    this.assertStaff(actor);

    const existing = await this.prisma.submittedQuestion.findFirst({
      where: {
        id: questionId,
        organizationId: actor.organizationId!
      },
      select: submittedQuestionSelect
    });

    if (!existing) {
      throw new NotFoundException('Submitted question not found.');
    }

    const approved = existing.approved
      ? existing
      : await this.prisma.submittedQuestion.update({
          where: { id: existing.id },
          data: {
            approved: true,
            approvedById: actor.id,
            approvedAt: new Date()
          },
          select: submittedQuestionSelect
        });

    if (approved.userId !== actor.id) {
      await this.notificationsService.createForUser(approved.userId, {
        title: 'Frage freigegeben',
        message: 'Deine eingereichte Frage wurde freigegeben.',
        type: NotificationType.SUCCESS,
        metadata: {
          submittedQuestionId: approved.id,
          eventType: 'SUBMITTED_QUESTION_APPROVED'
        }
      });
    }

    await this.auditLogService.writeForUser(
      actor,
      'submitted_question.approved',
      'SubmittedQuestion',
      approved.id,
      {
        ownerUserId: approved.userId
      },
      request
    );

    return this.toSubmittedQuestionPayload(approved);
  }

  async listQuestionReports(actor: AuthenticatedUser) {
    this.assertOrganization(actor);
    this.assertStaff(actor);

    const reports = await this.prisma.questionReport.findMany({
      where: {
        organizationId: actor.organizationId!
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 300,
      select: questionReportSelect
    });

    return reports.map((entry) => this.toQuestionReportPayload(entry));
  }

  async createQuestionReport(
    actor: AuthenticatedUser,
    dto: CreateQuestionReportDto,
    request: Request
  ) {
    this.assertOrganization(actor);

    const questionKey = this.sanitizeKey(dto.questionKey, 'questionKey');
    const questionText = this.sanitizeText(dto.questionText, 'questionText', 2000);
    const category = this.sanitizeIdentifier(dto.category, 'category');
    const source = this.sanitizeIdentifier(dto.source, 'source');
    const note = dto.note ? this.sanitizeText(dto.note, 'note', 1000) : null;
    const answers = this.sanitizeOptionalAnswerList(dto.answers);

    const duplicate = await this.prisma.questionReport.findFirst({
      where: {
        organizationId: actor.organizationId!,
        reportedById: actor.id,
        questionKey,
        status: 'OPEN'
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: questionReportSelect
    });

    if (duplicate) {
      return this.toQuestionReportPayload(duplicate);
    }

    const created = await this.prisma.questionReport.create({
      data: {
        organizationId: actor.organizationId!,
        reportedById: actor.id,
        questionKey,
        questionText,
        category,
        source,
        note,
        answers
      },
      select: questionReportSelect
    });

    await this.notifyStaffAboutQuestionReport(actor, created.id, category, source);
    await this.auditLogService.writeForUser(
      actor,
      'question_report.created',
      'QuestionReport',
      created.id,
      {
        category,
        source,
        questionKey
      },
      request
    );

    return this.toQuestionReportPayload(created);
  }

  async updateQuestionReportStatus(
    actor: AuthenticatedUser,
    reportId: string,
    dto: UpdateQuestionReportStatusDto,
    request: Request
  ) {
    this.assertOrganization(actor);
    this.assertStaff(actor);

    const existing = await this.prisma.questionReport.findFirst({
      where: {
        id: reportId,
        organizationId: actor.organizationId!
      },
      select: questionReportSelect
    });

    if (!existing) {
      throw new NotFoundException('Question report not found.');
    }

    const nextStatus = dto.status === 'resolved' ? 'RESOLVED' : 'OPEN';

    const updated = await this.prisma.questionReport.update({
      where: { id: existing.id },
      data: {
        status: nextStatus,
        resolvedAt: nextStatus === 'RESOLVED' ? new Date() : null,
        resolvedById: nextStatus === 'RESOLVED' ? actor.id : null
      },
      select: questionReportSelect
    });

    if (
      nextStatus === 'RESOLVED'
      && updated.reportedById !== actor.id
    ) {
      await this.notificationsService.createForUser(updated.reportedById, {
        title: 'Fragenmeldung bearbeitet',
        message: 'Deine gemeldete Frage wurde von einem Ausbilder bearbeitet.',
        type: NotificationType.INFO,
        metadata: {
          questionReportId: updated.id,
          eventType: 'QUESTION_REPORT_RESOLVED'
        }
      });
    }

    await this.auditLogService.writeForUser(
      actor,
      'question_report.status_updated',
      'QuestionReport',
      updated.id,
      {
        status: dto.status
      },
      request
    );

    return this.toQuestionReportPayload(updated);
  }

  async deleteQuestionReport(actor: AuthenticatedUser, reportId: string, request: Request) {
    this.assertOrganization(actor);
    this.assertStaff(actor);

    const existing = await this.prisma.questionReport.findFirst({
      where: {
        id: reportId,
        organizationId: actor.organizationId!
      },
      select: { id: true, status: true }
    });

    if (!existing) {
      throw new NotFoundException('Question report not found.');
    }

    await this.prisma.questionReport.delete({
      where: { id: existing.id }
    });

    await this.auditLogService.writeForUser(
      actor,
      'question_report.deleted',
      'QuestionReport',
      existing.id,
      { status: existing.status },
      request
    );

    return { id: existing.id, deleted: true };
  }

  async deleteResolvedQuestionReports(actor: AuthenticatedUser, request: Request) {
    this.assertOrganization(actor);
    this.assertStaff(actor);

    const result = await this.prisma.questionReport.deleteMany({
      where: {
        organizationId: actor.organizationId!,
        status: 'RESOLVED'
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'question_report.deleted_resolved_bulk',
      'QuestionReport',
      'bulk',
      { count: result.count },
      request
    );

    return { deletedCount: result.count };
  }

  private async notifyStaffAboutPendingSubmission(actor: AuthenticatedUser, questionId: string, category: string) {
    const recipients = await this.getStaffRecipients(actor);
    if (!recipients.length) {
      return;
    }

    await this.notificationsService.createForUsers(
      recipients.map((recipient) => recipient.id),
      {
        title: 'Neue Frage wartet auf Freigabe',
        message: `${actor.displayName} hat eine neue Frage in ${category} eingereicht.`,
        type: NotificationType.INFO,
        metadata: {
          submittedQuestionId: questionId,
          eventType: 'SUBMITTED_QUESTION_PENDING'
        }
      }
    );
  }

  private async notifyStaffAboutQuestionReport(
    actor: AuthenticatedUser,
    reportId: string,
    category: string,
    source: string
  ) {
    const recipients = await this.getStaffRecipients(actor);
    if (!recipients.length) {
      return;
    }

    await this.notificationsService.createForUsers(
      recipients.map((recipient) => recipient.id),
      {
        title: 'Neue Fragenmeldung',
        message: `${actor.displayName} hat eine Frage aus ${category} (${source}) gemeldet.`,
        type: NotificationType.WARNING,
        metadata: {
          questionReportId: reportId,
          eventType: 'QUESTION_REPORT_CREATED'
        }
      }
    );
  }

  private async getStaffRecipients(actor: AuthenticatedUser) {
    return this.prisma.user.findMany({
      where: {
        organizationId: actor.organizationId!,
        status: AccountStatus.APPROVED,
        isDeleted: false,
        role: {
          in: [AppRole.ADMIN, AppRole.AUSBILDER]
        },
        NOT: {
          id: actor.id
        }
      },
      select: {
        id: true
      }
    });
  }

  private toSubmittedQuestionPayload(entry: SubmittedQuestionRecord) {
    const indices = this.toIndexArray(entry.correctIndices);
    const correctValue = entry.multi && indices.length > 0 ? indices : entry.correct;

    return {
      id: entry.id,
      category: entry.category,
      question: entry.question,
      answers: this.toStringArray(entry.answers),
      correct: correctValue,
      multi: entry.multi,
      type: entry.type,
      clues: this.toStringArray(entry.clues),
      created_by: entry.user.displayName,
      created_by_id: entry.userId,
      approved: entry.approved,
      approved_at: entry.approvedAt?.toISOString() ?? null,
      approved_by: entry.approvedBy?.displayName ?? null,
      created_at: entry.createdAt.toISOString()
    };
  }

  private toIndexArray(value: Prisma.JsonValue | null) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value
      .map((entry) => Number(entry))
      .filter((entry) => Number.isInteger(entry) && entry >= 0);
  }

  private toQuestionReportPayload(entry: QuestionReportRecord) {
    return {
      id: entry.id,
      question_key: entry.questionKey,
      question_text: entry.questionText,
      category: entry.category,
      source: entry.source,
      note: entry.note ?? '',
      answers: this.toStringArray(entry.answers),
      reported_by: entry.reportedBy.displayName,
      reported_by_id: entry.reportedById,
      status: entry.status === 'RESOLVED' ? 'resolved' : 'open',
      resolved_at: entry.resolvedAt?.toISOString() ?? null,
      resolved_by: entry.resolvedBy?.displayName ?? null,
      created_at: entry.createdAt.toISOString()
    };
  }

  private sanitizeText(value: string, fieldName: string, maxLength: number) {
    const sanitized = sanitizeHtml(String(value || ''), {
      allowedTags: [],
      allowedAttributes: {}
    })
      .replace(/\r\n/g, '\n')
      .trim();

    if (!sanitized) {
      throw new BadRequestException(`${fieldName} is empty after sanitization.`);
    }

    if (sanitized.length > maxLength) {
      throw new BadRequestException(`${fieldName} is too long.`);
    }

    return sanitized;
  }

  private sanitizeIdentifier(value: string, fieldName: string) {
    const sanitized = String(value || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!sanitized) {
      throw new BadRequestException(`${fieldName} is invalid.`);
    }
    return sanitized;
  }

  private sanitizeKey(value: string, fieldName: string) {
    const sanitized = String(value || '').trim().slice(0, 191);
    if (!sanitized) {
      throw new BadRequestException(`${fieldName} is invalid.`);
    }
    return sanitized;
  }

  private sanitizeAnswerList(values: string[]) {
    const normalized = (Array.isArray(values) ? values : []).map((entry, index) => (
      this.sanitizeText(entry, `answers[${index}]`, 500)
    ));

    if (normalized.length !== 4) {
      throw new BadRequestException('Exactly four answers are required.');
    }

    return normalized;
  }

  private sanitizeWhoAmIAnswer(values: string[] | undefined) {
    const list = Array.isArray(values) ? values : [];
    if (list.length < 1) {
      throw new BadRequestException('A solution is required for whoami submissions.');
    }
    const solution = this.sanitizeText(list[0], 'answers[0]', 500);
    return [solution];
  }

  private sanitizeClueList(values: string[] | undefined) {
    const list = Array.isArray(values) ? values : [];
    if (list.length !== 5) {
      throw new BadRequestException('Exactly five clues are required.');
    }
    return list.map((entry, index) => this.sanitizeText(entry, `clues[${index}]`, 300));
  }

  private sanitizeOptionalAnswerList(values: string[] | undefined) {
    if (!Array.isArray(values) || values.length === 0) {
      return [];
    }

    return values.slice(0, 8).map((entry, index) => this.sanitizeText(entry, `answers[${index}]`, 500));
  }

  private toStringArray(value: Prisma.JsonValue) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((entry) => String(entry || ''));
  }

  private assertOrganization(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }
  }

  private assertStaff(actor: AuthenticatedUser) {
    if (!this.isStaff(actor.role)) {
      throw new ForbiddenException('Only staff may manage question workflows.');
    }
  }

  private isStaff(role: AppRole) {
    return role === AppRole.ADMIN || role === AppRole.AUSBILDER;
  }
}
