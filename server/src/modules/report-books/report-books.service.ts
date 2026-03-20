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
  NotificationType,
  Prisma,
  ReportBookStatus
} from '@prisma/client';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AssignReportBookTrainerDto } from './dto/assign-report-book-trainer.dto';
import { ListReportBooksQueryDto } from './dto/list-report-books.query.dto';
import { SaveReportBookDto } from './dto/save-report-book.dto';
import { UpdateReportBookProfileDto } from './dto/update-report-book-profile.dto';

const REPORT_BOOK_DAY_KEYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const;
const EMPTY_REPORT_BOOK_PROFILE = {
  vorname: '',
  nachname: '',
  ausbildungsbetrieb: '',
  ausbildungsberuf: 'Fachangestellte/r fuer Baederbetriebe',
  ausbilder: '',
  ausbildungsbeginn: '',
  ausbildungsende: ''
};

const reportBookSelect = {
  id: true,
  organizationId: true,
  userId: true,
  assignedTrainerId: true,
  assignedById: true,
  weekStart: true,
  weekEnd: true,
  trainingYear: true,
  evidenceNumber: true,
  entries: true,
  apprenticeNote: true,
  trainerNote: true,
  apprenticeSignature: true,
  trainerSignature: true,
  apprenticeSignedAt: true,
  trainerSignedAt: true,
  totalHours: true,
  status: true,
  submittedAt: true,
  assignedAt: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      displayName: true
    }
  },
  assignedTrainer: {
    select: {
      id: true,
      displayName: true
    }
  },
  assignedBy: {
    select: {
      id: true,
      displayName: true
    }
  }
} satisfies Prisma.ReportBookEntrySelect;

type ReportBookEntryPayload = Prisma.ReportBookEntryGetPayload<{ select: typeof reportBookSelect }>;
type NormalizedDayEntry = {
  taetigkeit: string;
  stunden: string;
  bereich: string;
};
type NormalizedEntries = Record<(typeof REPORT_BOOK_DAY_KEYS)[number], NormalizedDayEntry[]>;
type ReportBookProfile = {
  vorname: string;
  nachname: string;
  ausbildungsbetrieb: string;
  ausbildungsberuf: string;
  ausbilder: string;
  ausbildungsbeginn: string;
  ausbildungsende: string;
};

@Injectable()
export class ReportBooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService
  ) {}

  async getProfile(actor: AuthenticatedUser) {
    const user = await this.prisma.user.findUnique({
      where: { id: actor.id },
      select: {
        reportBookProfile: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.normalizeProfile(user.reportBookProfile);
  }

  async updateProfile(actor: AuthenticatedUser, dto: UpdateReportBookProfileDto, request: Request) {
    const profile = this.normalizeProfile(dto);

    await this.prisma.user.update({
      where: { id: actor.id },
      data: {
        reportBookProfile: profile as Prisma.InputJsonValue
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'report_book.profile_updated',
      'User',
      actor.id,
      {
        fields: Object.keys(profile)
      },
      request
    );

    return profile;
  }

  async list(actor: AuthenticatedUser, query: ListReportBooksQueryDto) {
    this.assertOrganization(actor);

    const targetUser = await this.resolveAccessibleTargetUser(actor, query.userId ?? actor.id);
    const where: Prisma.ReportBookEntryWhereInput = {
      organizationId: actor.organizationId!,
      userId: targetUser.id,
      status: query.status ?? ReportBookStatus.SUBMITTED
    };

    if (query.weekStart) {
      where.weekStart = this.parseDateOnly(query.weekStart, 'weekStart');
    }

    const entries = await this.prisma.reportBookEntry.findMany({
      where,
      orderBy: [
        {
          weekStart: 'desc'
        },
        {
          updatedAt: 'desc'
        }
      ],
      select: reportBookSelect
    });

    return entries.map((entry) => this.toPayload(entry));
  }

  async listPendingReview(actor: AuthenticatedUser) {
    this.assertOrganization(actor);
    if (!this.canManageReview(actor)) {
      throw new ForbiddenException('You are not allowed to review report books.');
    }

    const where: Prisma.ReportBookEntryWhereInput = {
      organizationId: actor.organizationId!,
      status: ReportBookStatus.SUBMITTED,
      apprenticeSignature: {
        not: null
      },
      trainerSignature: null
    };

    if (!this.isAdmin(actor.role)) {
      where.OR = [
        {
          assignedTrainerId: null
        },
        {
          assignedTrainerId: actor.id
        }
      ];
    }

    const entries = await this.prisma.reportBookEntry.findMany({
      where,
      orderBy: [
        {
          weekStart: 'desc'
        },
        {
          updatedAt: 'desc'
        }
      ],
      select: reportBookSelect
    });

    return entries.map((entry) => this.toPayload(entry));
  }

  async upsertDraft(actor: AuthenticatedUser, dto: SaveReportBookDto, request: Request) {
    this.assertOrganization(actor);

    const weekStart = this.parseDateOnly(dto.weekStart, 'weekStart');
    const existing = await this.prisma.reportBookEntry.findUnique({
      where: {
        organizationId_userId_weekStart: {
          organizationId: actor.organizationId!,
          userId: actor.id,
          weekStart
        }
      },
      select: reportBookSelect
    });

    if (existing?.status === ReportBookStatus.SUBMITTED) {
      throw new ConflictException('A submitted report book already exists for this week.');
    }

    const entries = this.normalizeEntries(dto.entries);
    const apprenticeNote = this.normalizeLongText(dto.apprenticeNote);
    const apprenticeSignature = this.normalizeSignature(dto.apprenticeSignature, 'apprenticeSignature');
    const apprenticeSignedAt = this.parseOptionalDateOnly(dto.apprenticeSignatureDate, 'apprenticeSignatureDate');

    if (!this.hasDraftContent(entries, apprenticeNote, apprenticeSignature, apprenticeSignedAt)) {
      if (existing) {
        await this.prisma.reportBookEntry.delete({
          where: { id: existing.id }
        });

        await this.auditLogService.writeForUser(
          actor,
          'report_book.draft_deleted',
          'ReportBookEntry',
          existing.id,
          {
            weekStart: this.serializeDateOnly(weekStart)
          },
          request
        );

        return {
          deleted: true
        };
      }

      return {
        deleted: false
      };
    }

    const payload = {
      organizationId: actor.organizationId!,
      userId: actor.id,
      weekStart,
      weekEnd: this.toWeekEnd(weekStart),
      trainingYear: dto.trainingYear,
      evidenceNumber: dto.evidenceNumber,
      entries: entries as Prisma.InputJsonValue,
      apprenticeNote,
      trainerNote: null,
      apprenticeSignature,
      trainerSignature: null,
      apprenticeSignedAt,
      trainerSignedAt: null,
      totalHours: this.calculateTotalHours(entries),
      status: ReportBookStatus.DRAFT,
      submittedAt: null,
      assignedTrainerId: null,
      assignedById: null,
      assignedAt: null
    } satisfies Prisma.ReportBookEntryUncheckedCreateInput;

    const saved = existing
      ? await this.prisma.reportBookEntry.update({
          where: { id: existing.id },
          data: payload,
          select: reportBookSelect
        })
      : await this.prisma.reportBookEntry.create({
          data: payload,
          select: reportBookSelect
        });

    await this.auditLogService.writeForUser(
      actor,
      existing ? 'report_book.draft_updated' : 'report_book.draft_created',
      'ReportBookEntry',
      saved.id,
      {
        weekStart: this.serializeDateOnly(weekStart)
      },
      request
    );

    return {
      deleted: false,
      entry: this.toPayload(saved)
    };
  }

  async deleteDraftByWeek(actor: AuthenticatedUser, weekStartInput: string, request: Request) {
    this.assertOrganization(actor);
    const weekStart = this.parseDateOnly(weekStartInput, 'weekStart');

    const existing = await this.prisma.reportBookEntry.findUnique({
      where: {
        organizationId_userId_weekStart: {
          organizationId: actor.organizationId!,
          userId: actor.id,
          weekStart
        }
      },
      select: {
        id: true,
        status: true
      }
    });

    if (!existing) {
      return {
        deleted: false
      };
    }

    if (existing.status !== ReportBookStatus.DRAFT) {
      throw new BadRequestException('Only draft report books may be deleted by week.');
    }

    await this.prisma.reportBookEntry.delete({
      where: { id: existing.id }
    });

    await this.auditLogService.writeForUser(
      actor,
      'report_book.draft_deleted',
      'ReportBookEntry',
      existing.id,
      {
        weekStart: this.serializeDateOnly(weekStart)
      },
      request
    );

    return {
      deleted: true
    };
  }

  async submit(actor: AuthenticatedUser, dto: SaveReportBookDto, request: Request) {
    this.assertOrganization(actor);

    const existing = dto.entryId
      ? await this.prisma.reportBookEntry.findFirst({
          where: {
            id: dto.entryId,
            organizationId: actor.organizationId!
          },
          select: reportBookSelect
        })
      : null;

    if (dto.entryId && !existing) {
      throw new NotFoundException('Report book entry not found.');
    }

    const ownerUserId = existing?.userId ?? actor.id;
    const actorOwnsEntry = ownerUserId === actor.id;
    const actorCanReviewEntry = existing ? this.canAccessReviewEntry(actor, existing) : false;

    if (!actorOwnsEntry && !actorCanReviewEntry) {
      throw new ForbiddenException('You may not update this report book entry.');
    }

    if (!existing && !actorOwnsEntry) {
      throw new ForbiddenException('Reviewers may only update existing report book entries.');
    }

    if (existing?.trainerSignature && actorOwnsEntry && !this.isStaff(actor.role)) {
      throw new ForbiddenException('Signed report books may no longer be changed by the apprentice.');
    }

    const weekStart = existing?.weekStart ?? this.parseDateOnly(dto.weekStart, 'weekStart');
    const previousReadyForReview = existing
      ? this.isReadyForReview(existing.entries, existing.apprenticeSignature, existing.trainerSignature)
      : false;

    const entries = actorOwnsEntry
      ? this.normalizeEntries(dto.entries)
      : this.normalizeEntries(existing?.entries);
    const totalHours = this.calculateTotalHours(entries);

    const apprenticeNote = actorOwnsEntry
      ? this.normalizeLongText(dto.apprenticeNote)
      : (existing?.apprenticeNote ?? null);
    const trainerNote = actorCanReviewEntry
      ? this.normalizeLongText(dto.trainerNote)
      : (existing?.trainerNote ?? null);
    const apprenticeSignature = actorOwnsEntry
      ? this.normalizeSignature(dto.apprenticeSignature, 'apprenticeSignature')
      : (existing?.apprenticeSignature ?? null);
    const trainerSignature = actorCanReviewEntry
      ? this.normalizeSignature(dto.trainerSignature, 'trainerSignature')
      : (existing?.trainerSignature ?? null);
    const apprenticeSignedAt = actorOwnsEntry
      ? this.parseOptionalDateOnly(dto.apprenticeSignatureDate, 'apprenticeSignatureDate')
      : (existing?.apprenticeSignedAt ?? null);
    const trainerSignedAt = actorCanReviewEntry
      ? this.parseOptionalDateOnly(dto.trainerSignatureDate, 'trainerSignatureDate')
      : (existing?.trainerSignedAt ?? null);
    const trainingYear = actorOwnsEntry
      ? dto.trainingYear
      : (existing?.trainingYear ?? 1);
    const evidenceNumber = actorOwnsEntry
      ? dto.evidenceNumber
      : (existing?.evidenceNumber ?? 1);

    if (!this.hasSubmittedContent(entries)) {
      throw new BadRequestException('At least one activity is required before submission.');
    }

    if (!apprenticeSignature) {
      throw new BadRequestException('The apprentice signature is required before submission.');
    }

    const payload = {
      organizationId: actor.organizationId!,
      userId: ownerUserId,
      weekStart,
      weekEnd: this.toWeekEnd(weekStart),
      trainingYear,
      evidenceNumber,
      entries: entries as Prisma.InputJsonValue,
      apprenticeNote,
      trainerNote,
      apprenticeSignature,
      trainerSignature,
      apprenticeSignedAt,
      trainerSignedAt,
      totalHours,
      status: ReportBookStatus.SUBMITTED,
      submittedAt: existing?.submittedAt ?? new Date(),
      assignedTrainerId: existing?.assignedTrainerId ?? null,
      assignedById: existing?.assignedById ?? null,
      assignedAt: existing?.assignedAt ?? null
    } satisfies Prisma.ReportBookEntryUncheckedCreateInput;

    const saved = existing
      ? await this.prisma.reportBookEntry.update({
          where: { id: existing.id },
          data: payload,
          select: reportBookSelect
        })
      : await this.prisma.reportBookEntry.create({
          data: payload,
          select: reportBookSelect
        });

    const readyForReviewNow = this.isReadyForReview(
      saved.entries,
      saved.apprenticeSignature,
      saved.trainerSignature
    );

    if (actorOwnsEntry && readyForReviewNow && !previousReadyForReview) {
      await this.notifyReviewers(saved, actor);
    }

    await this.auditLogService.writeForUser(
      actor,
      existing ? 'report_book.submitted_updated' : 'report_book.submitted_created',
      'ReportBookEntry',
      saved.id,
      {
        ownerUserId,
        weekStart: this.serializeDateOnly(saved.weekStart),
        reviewerUpdated: actorCanReviewEntry && !actorOwnsEntry,
        trainerSigned: Boolean(saved.trainerSignature)
      },
      request
    );

    return this.toPayload(saved);
  }

  async assignTrainer(
    actor: AuthenticatedUser,
    entryId: string,
    dto: AssignReportBookTrainerDto,
    request: Request
  ) {
    this.assertOrganization(actor);
    if (!this.isStaff(actor.role)) {
      throw new ForbiddenException('Only staff may assign report book reviewers.');
    }

    const entry = await this.prisma.reportBookEntry.findFirst({
      where: {
        id: entryId,
        organizationId: actor.organizationId!
      },
      select: reportBookSelect
    });

    if (!entry) {
      throw new NotFoundException('Report book entry not found.');
    }

    if (entry.status !== ReportBookStatus.SUBMITTED) {
      throw new BadRequestException('Only submitted report books may be assigned.');
    }

    const trainer = await this.prisma.user.findFirst({
      where: {
        id: dto.trainerId,
        organizationId: actor.organizationId!,
        status: AccountStatus.APPROVED,
        isDeleted: false,
        OR: [
          {
            role: {
              in: [AppRole.ADMIN, AppRole.AUSBILDER]
            }
          },
          {
            canSignReports: true
          }
        ]
      },
      select: {
        id: true,
        displayName: true
      }
    });

    if (!trainer) {
      throw new BadRequestException('Assigned reviewer is not valid for your organization.');
    }

    const updated = await this.prisma.reportBookEntry.update({
      where: { id: entry.id },
      data: {
        assignedTrainerId: trainer.id,
        assignedById: actor.id,
        assignedAt: new Date()
      },
      select: reportBookSelect
    });

    if (trainer.id !== actor.id) {
      await this.notificationsService.createForUser(trainer.id, {
        title: 'Berichtsheft zugewiesen',
        message: `${actor.displayName} hat dir das Berichtsheft von ${updated.user.displayName} fuer die Woche ab ${this.formatDateLabel(updated.weekStart)} zugewiesen.`,
        type: NotificationType.INFO,
        metadata: {
          eventType: 'REPORT_BOOK_ASSIGNED',
          reportBookEntryId: updated.id
        }
      });
    }

    await this.auditLogService.writeForUser(
      actor,
      'report_book.reviewer_assigned',
      'ReportBookEntry',
      updated.id,
      {
        trainerId: trainer.id,
        trainerName: trainer.displayName
      },
      request
    );

    return this.toPayload(updated);
  }

  async remove(actor: AuthenticatedUser, entryId: string, request: Request) {
    this.assertOrganization(actor);

    const entry = await this.prisma.reportBookEntry.findFirst({
      where: {
        id: entryId,
        organizationId: actor.organizationId!
      },
      select: {
        id: true,
        userId: true,
        trainerSignature: true,
        weekStart: true
      }
    });

    if (!entry) {
      throw new NotFoundException('Report book entry not found.');
    }

    if (!this.isStaff(actor.role) && actor.id !== entry.userId) {
      throw new ForbiddenException('You may only delete your own report books.');
    }

    if (!this.isStaff(actor.role) && Boolean(entry.trainerSignature)) {
      throw new ForbiddenException('Signed report books may only be deleted by staff.');
    }

    await this.prisma.reportBookEntry.delete({
      where: { id: entry.id }
    });

    await this.auditLogService.writeForUser(
      actor,
      'report_book.deleted',
      'ReportBookEntry',
      entry.id,
      {
        ownerUserId: entry.userId,
        weekStart: this.serializeDateOnly(entry.weekStart),
        signed: Boolean(entry.trainerSignature)
      },
      request
    );

    return {
      deleted: true
    };
  }

  private async notifyReviewers(entry: ReportBookEntryPayload, actor: AuthenticatedUser) {
    const recipients = entry.assignedTrainerId
      ? [{ id: entry.assignedTrainerId }]
      : await this.prisma.user.findMany({
          where: {
            organizationId: actor.organizationId!,
            status: AccountStatus.APPROVED,
            isDeleted: false,
            NOT: {
              id: actor.id
            },
            OR: [
              {
                role: {
                  in: [AppRole.ADMIN, AppRole.AUSBILDER]
                }
              },
              {
                canSignReports: true
              }
            ]
          },
          select: {
            id: true
          }
        });

    if (!recipients.length) {
      return;
    }

    await this.notificationsService.createForUsers(
      recipients.map((recipient) => recipient.id),
      {
        title: 'Berichtsheft wartet auf Freigabe',
        message: `${entry.user.displayName} hat das Berichtsheft fuer die Woche ab ${this.formatDateLabel(entry.weekStart)} abgeschlossen und zur Freigabe eingereicht.`,
        type: NotificationType.INFO,
        metadata: {
          eventType: 'BERICHTSHEFT_READY_FOR_REVIEW',
          reportBookEntryId: entry.id
        }
      }
    );
  }

  private async resolveAccessibleTargetUser(actor: AuthenticatedUser, requestedUserId: string) {
    if (!requestedUserId || requestedUserId === actor.id) {
      return {
        id: actor.id
      };
    }

    if (!this.isStaff(actor.role)) {
      throw new ForbiddenException('You may only view your own report books.');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: requestedUserId,
        organizationId: actor.organizationId!,
        status: AccountStatus.APPROVED,
        isDeleted: false
      },
      select: {
        id: true
      }
    });

    if (!user) {
      throw new NotFoundException('Requested user not found in your organization.');
    }

    return user;
  }

  private canManageReview(actor: AuthenticatedUser) {
    return this.isStaff(actor.role) || actor.canSignReports;
  }

  private canAccessReviewEntry(actor: AuthenticatedUser, entry: ReportBookEntryPayload) {
    if (!this.canManageReview(actor)) {
      return false;
    }

    if (this.isAdmin(actor.role)) {
      return true;
    }

    return !entry.assignedTrainerId || entry.assignedTrainerId === actor.id;
  }

  private isStaff(role: AppRole) {
    return role === AppRole.ADMIN || role === AppRole.AUSBILDER;
  }

  private isAdmin(role: AppRole) {
    return role === AppRole.ADMIN;
  }

  private assertOrganization(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }
  }

  private normalizeEntries(entriesInput: unknown): NormalizedEntries {
    const source = (entriesInput && typeof entriesInput === 'object' && !Array.isArray(entriesInput))
      ? (entriesInput as Record<string, unknown>)
      : {};

    return Object.fromEntries(
      REPORT_BOOK_DAY_KEYS.map((day) => {
        const rows = Array.isArray(source[day]) ? source[day] : [];
        const normalizedRows = rows.slice(0, 12).map((row) => {
          const value = (row && typeof row === 'object' && !Array.isArray(row))
            ? (row as Record<string, unknown>)
            : {};

          return {
            taetigkeit: this.normalizeText(value.taetigkeit, 500),
            stunden: this.normalizeHours(value.stunden),
            bereich: this.normalizeBereich(value.bereich)
          };
        });

        return [day, normalizedRows];
      })
    ) as NormalizedEntries;
  }

  private normalizeProfile(input: unknown): ReportBookProfile {
    const value = (input && typeof input === 'object' && !Array.isArray(input))
      ? (input as Record<string, unknown>)
      : {};

    return {
      vorname: this.normalizeText(value.vorname, 120),
      nachname: this.normalizeText(value.nachname, 120),
      ausbildungsbetrieb: this.normalizeText(value.ausbildungsbetrieb, 200),
      ausbildungsberuf: this.normalizeText(value.ausbildungsberuf, 200) || EMPTY_REPORT_BOOK_PROFILE.ausbildungsberuf,
      ausbilder: this.normalizeText(value.ausbilder, 200),
      ausbildungsbeginn: this.normalizeProfileDate(value.ausbildungsbeginn),
      ausbildungsende: this.normalizeProfileDate(value.ausbildungsende)
    };
  }

  private normalizeText(value: unknown, maxLength: number) {
    return String(value || '').trim().slice(0, maxLength);
  }

  private normalizeLongText(value: unknown) {
    const normalized = this.normalizeText(value, 4000);
    return normalized || null;
  }

  private normalizeBereich(value: unknown) {
    const normalized = String(value || '').trim();
    if (!normalized) {
      return '';
    }

    if (!/^\d{1,2}$/.test(normalized)) {
      throw new BadRequestException('Invalid report book area.');
    }

    return normalized;
  }

  private normalizeHours(value: unknown) {
    const normalized = String(value ?? '').trim();
    if (!normalized) {
      return '';
    }

    const parsed = Number(normalized.replace(',', '.'));
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 12) {
      throw new BadRequestException('Invalid report book hours.');
    }

    return String(Math.round(parsed * 10) / 10);
  }

  private normalizeSignature(value: unknown, fieldName: string) {
    const normalized = String(value || '').trim();
    if (!normalized) {
      return null;
    }

    if (!/^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(normalized)) {
      throw new BadRequestException(`Invalid signature payload for ${fieldName}.`);
    }

    return normalized;
  }

  private normalizeProfileDate(value: unknown) {
    const normalized = String(value || '').trim();
    if (!normalized) {
      return '';
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      throw new BadRequestException('Invalid profile date format.');
    }

    return normalized;
  }

  private parseDateOnly(value: string, fieldName: string) {
    const normalized = String(value || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      throw new BadRequestException(`Invalid ${fieldName} date.`);
    }

    const parsed = new Date(`${normalized}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`Invalid ${fieldName} date.`);
    }

    return parsed;
  }

  private parseOptionalDateOnly(value: unknown, fieldName: string) {
    const normalized = String(value || '').trim();
    if (!normalized) {
      return null;
    }

    return this.parseDateOnly(normalized, fieldName);
  }

  private toWeekEnd(weekStart: Date) {
    const weekEnd = new Date(weekStart.getTime());
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
    return weekEnd;
  }

  private calculateTotalHours(entries: NormalizedEntries) {
    return REPORT_BOOK_DAY_KEYS.reduce((sum, day) => (
      sum + entries[day].reduce((innerSum, row) => {
        const parsed = Number.parseFloat(String(row.stunden || '0').replace(',', '.'));
        return innerSum + (Number.isFinite(parsed) ? parsed : 0);
      }, 0)
    ), 0);
  }

  private hasDraftContent(
    entries: NormalizedEntries,
    apprenticeNote: string | null,
    apprenticeSignature: string | null,
    apprenticeSignedAt: Date | null
  ) {
    return this.hasSubmittedContent(entries)
      || Boolean(apprenticeNote || apprenticeSignature || apprenticeSignedAt);
  }

  private hasSubmittedContent(entries: NormalizedEntries) {
    return Object.values(entries).some((rows) => rows.some((row) => row.taetigkeit !== ''));
  }

  private isReadyForReview(entries: unknown, apprenticeSignature: string | null, trainerSignature: string | null) {
    return this.hasSubmittedContent(this.normalizeEntries(entries))
      && Boolean(apprenticeSignature)
      && !trainerSignature;
  }

  private serializeDateOnly(value: Date | null) {
    if (!value) {
      return null;
    }

    return value.toISOString().slice(0, 10);
  }

  private formatDateLabel(value: Date | null) {
    if (!value) {
      return 'ohne Datum';
    }

    return new Intl.DateTimeFormat('de-DE').format(value);
  }

  private toPayload(entry: ReportBookEntryPayload) {
    return {
      id: entry.id,
      userId: entry.userId,
      userName: entry.user.displayName,
      assignedTrainerId: entry.assignedTrainerId,
      assignedTrainerName: entry.assignedTrainer?.displayName ?? null,
      assignedById: entry.assignedById,
      assignedByName: entry.assignedBy?.displayName ?? null,
      weekStart: this.serializeDateOnly(entry.weekStart),
      weekEnd: this.serializeDateOnly(entry.weekEnd),
      trainingYear: entry.trainingYear,
      evidenceNumber: entry.evidenceNumber,
      entries: this.normalizeEntries(entry.entries),
      apprenticeNote: entry.apprenticeNote ?? '',
      trainerNote: entry.trainerNote ?? '',
      apprenticeSignature: entry.apprenticeSignature ?? '',
      trainerSignature: entry.trainerSignature ?? '',
      apprenticeSignatureDate: this.serializeDateOnly(entry.apprenticeSignedAt),
      trainerSignatureDate: this.serializeDateOnly(entry.trainerSignedAt),
      totalHours: entry.totalHours,
      status: entry.status,
      submittedAt: entry.submittedAt?.toISOString() ?? null,
      assignedAt: entry.assignedAt?.toISOString() ?? null,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString()
    };
  }
}
