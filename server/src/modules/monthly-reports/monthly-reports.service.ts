import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {
  AccountStatus,
  AppRole,
  MonthlyReportStatus,
  NotificationType,
  Prisma
} from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AssignMonthlyReportDto } from './dto/assign-monthly-report.dto';
import { ListMonthlyReportsQueryDto } from './dto/list-monthly-reports.query.dto';
import { SignMonthlyReportDto } from './dto/sign-monthly-report.dto';
import { SubmitMonthlyReportDto } from './dto/submit-monthly-report.dto';

const monthlyReportSelect = {
  id: true,
  organizationId: true,
  azubiId: true,
  assignedById: true,
  year: true,
  month: true,
  activity: true,
  activityDescription: true,
  content: true,
  status: true,
  submittedAt: true,
  signedById: true,
  signedAt: true,
  trainerFeedback: true,
  createdAt: true,
  updatedAt: true,
  azubi: {
    select: { id: true, displayName: true }
  },
  assignedBy: {
    select: { id: true, displayName: true }
  },
  signedBy: {
    select: { id: true, displayName: true }
  }
} satisfies Prisma.MonthlyReportSelect;

type MonthlyReportRecord = Prisma.MonthlyReportGetPayload<{ select: typeof monthlyReportSelect }>;

@Injectable()
export class MonthlyReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService
  ) {}

  async list(actor: AuthenticatedUser, query: ListMonthlyReportsQueryDto) {
    this.assertOrganization(actor);

    const where: Prisma.MonthlyReportWhereInput = {
      organizationId: actor.organizationId!
    };

    if (this.canManageReview(actor)) {
      if (query.azubiId) {
        where.azubiId = query.azubiId;
      }
    } else {
      where.azubiId = actor.id;
    }

    if (query.status) {
      where.status = query.status;
    }
    if (query.year !== undefined) {
      where.year = query.year;
    }

    const reports = await this.prisma.monthlyReport.findMany({
      where,
      orderBy: [{ year: 'desc' }, { month: 'desc' }, { updatedAt: 'desc' }],
      select: monthlyReportSelect
    });

    return reports.map((entry) => this.toPayload(entry));
  }

  async assign(actor: AuthenticatedUser, dto: AssignMonthlyReportDto, request: Request) {
    this.assertOrganization(actor);
    if (!this.canManageReview(actor)) {
      throw new ForbiddenException('Only trainers may assign monthly reports.');
    }

    const azubi = await this.prisma.user.findFirst({
      where: {
        id: dto.azubiId,
        organizationId: actor.organizationId!,
        status: AccountStatus.APPROVED,
        isDeleted: false
      },
      select: { id: true, displayName: true }
    });

    if (!azubi) {
      throw new BadRequestException('Azubi nicht in deiner Organisation gefunden.');
    }

    const activity = this.sanitizeText(dto.activity, 'activity', 200, 2);
    const activityDescription = dto.activityDescription
      ? this.sanitizeText(dto.activityDescription, 'activityDescription', 2000, 0)
      : null;

    const existing = await this.prisma.monthlyReport.findUnique({
      where: {
        organizationId_azubiId_year_month: {
          organizationId: actor.organizationId!,
          azubiId: azubi.id,
          year: dto.year,
          month: dto.month
        }
      },
      select: monthlyReportSelect
    });

    if (existing) {
      throw new ConflictException('Fuer diesen Monat wurde bereits ein Monatsbericht angelegt.');
    }

    const created = await this.prisma.monthlyReport.create({
      data: {
        organizationId: actor.organizationId!,
        azubiId: azubi.id,
        assignedById: actor.id,
        year: dto.year,
        month: dto.month,
        activity,
        activityDescription,
        status: MonthlyReportStatus.ASSIGNED
      },
      select: monthlyReportSelect
    });

    await this.notificationsService.createForUser(azubi.id, {
      title: 'Neuer Monatsbericht zugewiesen',
      message: `${actor.displayName} hat dir einen Monatsbericht fuer ${this.formatMonthLabel(created.year, created.month)} zur Taetigkeit "${created.activity}" zugewiesen.`,
      type: NotificationType.INFO,
      metadata: {
        eventType: 'MONTHLY_REPORT_ASSIGNED',
        monthlyReportId: created.id
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'monthly_report.assigned',
      'MonthlyReport',
      created.id,
      {
        azubiId: azubi.id,
        year: created.year,
        month: created.month,
        activity
      },
      request
    );

    return this.toPayload(created);
  }

  async submit(actor: AuthenticatedUser, reportId: string, dto: SubmitMonthlyReportDto, request: Request) {
    this.assertOrganization(actor);

    const report = await this.prisma.monthlyReport.findFirst({
      where: { id: reportId, organizationId: actor.organizationId! },
      select: monthlyReportSelect
    });

    if (!report) {
      throw new NotFoundException('Monatsbericht nicht gefunden.');
    }

    if (report.azubiId !== actor.id) {
      throw new ForbiddenException('Du kannst nur deine eigenen Monatsberichte einreichen.');
    }

    if (report.status === MonthlyReportStatus.SIGNED) {
      throw new BadRequestException('Dieser Monatsbericht wurde bereits gegengezeichnet.');
    }

    const content = this.sanitizeText(dto.content, 'content', 8000, 20);

    const updated = await this.prisma.monthlyReport.update({
      where: { id: report.id },
      data: {
        content,
        status: MonthlyReportStatus.SUBMITTED,
        submittedAt: report.submittedAt ?? new Date()
      },
      select: monthlyReportSelect
    });

    await this.notifyReviewers(updated, actor);

    await this.auditLogService.writeForUser(
      actor,
      'monthly_report.submitted',
      'MonthlyReport',
      updated.id,
      {
        year: updated.year,
        month: updated.month
      },
      request
    );

    return this.toPayload(updated);
  }

  async sign(actor: AuthenticatedUser, reportId: string, dto: SignMonthlyReportDto, request: Request) {
    this.assertOrganization(actor);
    if (!this.canManageReview(actor)) {
      throw new ForbiddenException('Nur Ausbilder oder Admins duerfen Monatsberichte gegenzeichnen.');
    }

    const report = await this.prisma.monthlyReport.findFirst({
      where: { id: reportId, organizationId: actor.organizationId! },
      select: monthlyReportSelect
    });

    if (!report) {
      throw new NotFoundException('Monatsbericht nicht gefunden.');
    }

    if (report.status !== MonthlyReportStatus.SUBMITTED) {
      throw new BadRequestException('Nur eingereichte Monatsberichte koennen gegengezeichnet werden.');
    }

    const trainerFeedback = dto.trainerFeedback
      ? this.sanitizeText(dto.trainerFeedback, 'trainerFeedback', 2000, 0)
      : null;

    const updated = await this.prisma.monthlyReport.update({
      where: { id: report.id },
      data: {
        status: MonthlyReportStatus.SIGNED,
        signedById: actor.id,
        signedAt: new Date(),
        trainerFeedback
      },
      select: monthlyReportSelect
    });

    if (report.azubiId !== actor.id) {
      await this.notificationsService.createForUser(report.azubiId, {
        title: 'Monatsbericht gegengezeichnet',
        message: `${actor.displayName} hat deinen Monatsbericht fuer ${this.formatMonthLabel(updated.year, updated.month)} gegengezeichnet.`,
        type: NotificationType.INFO,
        metadata: {
          eventType: 'MONTHLY_REPORT_SIGNED',
          monthlyReportId: updated.id
        }
      });
    }

    await this.auditLogService.writeForUser(
      actor,
      'monthly_report.signed',
      'MonthlyReport',
      updated.id,
      {
        azubiId: updated.azubiId,
        year: updated.year,
        month: updated.month
      },
      request
    );

    return this.toPayload(updated);
  }

  async remove(actor: AuthenticatedUser, reportId: string, request: Request) {
    this.assertOrganization(actor);
    if (actor.role !== AppRole.ADMIN) {
      throw new ForbiddenException('Nur Admins duerfen Monatsberichte loeschen.');
    }

    const report = await this.prisma.monthlyReport.findFirst({
      where: { id: reportId, organizationId: actor.organizationId! },
      select: { id: true, azubiId: true, year: true, month: true }
    });

    if (!report) {
      throw new NotFoundException('Monatsbericht nicht gefunden.');
    }

    await this.prisma.monthlyReport.delete({ where: { id: report.id } });

    await this.auditLogService.writeForUser(
      actor,
      'monthly_report.deleted',
      'MonthlyReport',
      report.id,
      {
        azubiId: report.azubiId,
        year: report.year,
        month: report.month
      },
      request
    );

    return { id: report.id, deleted: true };
  }

  private async notifyReviewers(report: MonthlyReportRecord, actor: AuthenticatedUser) {
    const reviewers = await this.prisma.user.findMany({
      where: {
        organizationId: actor.organizationId!,
        status: AccountStatus.APPROVED,
        isDeleted: false,
        NOT: { id: actor.id },
        OR: [
          { role: { in: [AppRole.ADMIN, AppRole.AUSBILDER] } },
          { canSignReports: true }
        ]
      },
      select: { id: true }
    });

    if (!reviewers.length) {
      return;
    }

    await this.notificationsService.createForUsers(
      reviewers.map((entry) => entry.id),
      {
        title: 'Monatsbericht wartet auf Freigabe',
        message: `${report.azubi.displayName} hat den Monatsbericht fuer ${this.formatMonthLabel(report.year, report.month)} eingereicht.`,
        type: NotificationType.INFO,
        metadata: {
          eventType: 'MONTHLY_REPORT_READY_FOR_REVIEW',
          monthlyReportId: report.id
        }
      }
    );
  }

  private canManageReview(actor: AuthenticatedUser) {
    return actor.role === AppRole.ADMIN
      || actor.role === AppRole.AUSBILDER
      || Boolean(actor.canSignReports);
  }

  private assertOrganization(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      throw new BadRequestException('Dein Account ist keiner Organisation zugeordnet.');
    }
  }

  private sanitizeText(value: string, field: string, maxLength: number, minLength: number) {
    const sanitized = sanitizeHtml(String(value || ''), {
      allowedTags: [],
      allowedAttributes: {}
    })
      .replace(/\r\n/g, '\n')
      .trim();

    if (minLength > 0 && sanitized.length < minLength) {
      throw new BadRequestException(`${field} ist zu kurz.`);
    }
    if (sanitized.length > maxLength) {
      throw new BadRequestException(`${field} ueberschreitet die maximale Laenge.`);
    }

    return sanitized;
  }

  private formatMonthLabel(year: number, month: number) {
    const names = [
      'Januar', 'Februar', 'Maerz', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    const name = names[Math.max(0, Math.min(11, month - 1))];
    return `${name} ${year}`;
  }

  private toPayload(entry: MonthlyReportRecord) {
    return {
      id: entry.id,
      azubiId: entry.azubiId,
      azubiName: entry.azubi.displayName,
      assignedById: entry.assignedById,
      assignedByName: entry.assignedBy?.displayName ?? null,
      year: entry.year,
      month: entry.month,
      activity: entry.activity,
      activityDescription: entry.activityDescription ?? '',
      content: entry.content ?? '',
      status: entry.status,
      submittedAt: entry.submittedAt?.toISOString() ?? null,
      signedById: entry.signedById,
      signedByName: entry.signedBy?.displayName ?? null,
      signedAt: entry.signedAt?.toISOString() ?? null,
      trainerFeedback: entry.trainerFeedback ?? '',
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString()
    };
  }
}
