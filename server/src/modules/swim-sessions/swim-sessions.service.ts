import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AccountStatus, AppRole, NotificationType, Prisma, SwimSessionStatus } from '@prisma/client';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { doesSessionFulfillTrainingPlan } from '../swim-training-plans/swim-training-plan-catalog';
import { SwimTrainingPlansService } from '../swim-training-plans/swim-training-plans.service';
import { UserStatsService } from '../user-stats/user-stats.service';
import { CreateSwimSessionDto } from './dto/create-swim-session.dto';

const swimSessionSelect = {
  id: true,
  userId: true,
  date: true,
  distanceMeters: true,
  timeMinutes: true,
  styleId: true,
  notes: true,
  challengeId: true,
  status: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      displayName: true,
      role: true
    }
  },
  reviewedBy: {
    select: {
      id: true,
      displayName: true
    }
  }
} satisfies Prisma.SwimSessionSelect;

type SwimSessionPayload = Prisma.SwimSessionGetPayload<{ select: typeof swimSessionSelect }>;

@Injectable()
export class SwimSessionsService {
  private static readonly SWIM_PLAN_NOTE_TAG_REGEX = /\[SWIM_PLAN:([a-z0-9_-]+)\]/i;
  private static readonly SWIM_PLAN_NOTE_UNIT_TAG_REGEX = /\[SWIM_PLAN_UNIT:([a-z0-9_-]+)\]/i;

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService,
    private readonly swimTrainingPlansService: SwimTrainingPlansService,
    private readonly userStatsService: UserStatsService
  ) {}

  async list(actor: AuthenticatedUser) {
    this.assertOrganization(actor);

    const where: Prisma.SwimSessionWhereInput = {
      organizationId: actor.organizationId!,
      OR: this.isStaff(actor.role)
        ? [
            { status: SwimSessionStatus.CONFIRMED },
            { status: SwimSessionStatus.PENDING }
          ]
        : [
            { status: SwimSessionStatus.CONFIRMED },
            {
              userId: actor.id,
              status: SwimSessionStatus.PENDING
            }
          ]
    };

    const sessions = await this.prisma.swimSession.findMany({
      where,
      orderBy: [
        {
          date: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ],
      select: swimSessionSelect
    });

    return sessions.map((session) => this.toPayload(session));
  }

  async listPending(actor: AuthenticatedUser) {
    this.assertOrganization(actor);
    if (!this.isStaff(actor.role)) {
      throw new ForbiddenException('Only staff may review swim sessions.');
    }

    const sessions = await this.prisma.swimSession.findMany({
      where: {
        organizationId: actor.organizationId!,
        status: SwimSessionStatus.PENDING
      },
      orderBy: [
        {
          date: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ],
      select: swimSessionSelect
    });

    return sessions.map((session) => this.toPayload(session));
  }

  async create(actor: AuthenticatedUser, dto: CreateSwimSessionDto, request: Request) {
    this.assertOrganization(actor);

    const created = await this.prisma.swimSession.create({
      data: {
        organizationId: actor.organizationId!,
        userId: actor.id,
        date: new Date(dto.date),
        distanceMeters: dto.distanceMeters,
        timeMinutes: dto.timeMinutes,
        styleId: dto.styleId.trim(),
        notes: dto.notes?.trim() || null,
        challengeId: dto.challengeId?.trim() || null,
        status: SwimSessionStatus.PENDING
      },
      select: swimSessionSelect
    });

    await this.notifyStaffAboutPendingSession(actor, created);
    await this.auditLogService.writeForUser(
      actor,
      'swim_session.created',
      'SwimSession',
      created.id,
      {
        date: created.date.toISOString(),
        distanceMeters: created.distanceMeters,
        timeMinutes: created.timeMinutes,
        styleId: created.styleId,
        challengeId: created.challengeId
      },
      request
    );

    return this.toPayload(created);
  }

  async confirm(actor: AuthenticatedUser, sessionId: string, request: Request) {
    this.assertOrganization(actor);
    if (!this.isStaff(actor.role)) {
      throw new ForbiddenException('Only staff may confirm swim sessions.');
    }

    const session = await this.getPendingSession(sessionId, actor.organizationId!);
    if (session.userId === actor.id) {
      throw new ForbiddenException('Self-approval of swim sessions is not allowed.');
    }

    const updated = await this.prisma.swimSession.update({
      where: { id: session.id },
      data: {
        status: SwimSessionStatus.CONFIRMED,
        reviewedById: actor.id,
        reviewedAt: new Date()
      },
      select: swimSessionSelect
    });

    const xpAward = await this.awardTrainingPlanXpIfEligible(updated, actor.organizationId!);

    if (updated.userId !== actor.id) {
      await this.notificationsService.createForUser(updated.userId, {
        title: 'Schwimmeinheit bestaetigt',
        message: `Deine Schwimmeinheit vom ${this.formatDateLabel(updated.date)} (${updated.distanceMeters}m, ${updated.styleId}) wurde von ${actor.displayName} bestaetigt.${xpAward.addedXp > 0 && xpAward.planName ? ` Trainingsplan-XP: +${xpAward.addedXp} fuer "${xpAward.planName}".` : ''}`,
        type: NotificationType.SUCCESS,
        metadata: {
          eventType: 'SWIM_SESSION_CONFIRMED',
          swimSessionId: updated.id,
          awardedXp: xpAward.addedXp
        }
      });
    }

    await this.auditLogService.writeForUser(
      actor,
      'swim_session.confirmed',
      'SwimSession',
      updated.id,
      {
        ownerUserId: updated.userId,
        awardedXp: xpAward.addedXp,
        awardedPlanId: xpAward.planId
      },
      request
    );

    return {
      ...this.toPayload(updated),
      xpAward: {
        addedXp: xpAward.addedXp,
        planId: xpAward.planId,
        planName: xpAward.planName
      }
    };
  }

  async reject(actor: AuthenticatedUser, sessionId: string, request: Request) {
    this.assertOrganization(actor);
    if (!this.isStaff(actor.role)) {
      throw new ForbiddenException('Only staff may reject swim sessions.');
    }

    const session = await this.getPendingSession(sessionId, actor.organizationId!);
    if (session.userId === actor.id) {
      throw new ForbiddenException('Self-review of swim sessions is not allowed.');
    }

    const updated = await this.prisma.swimSession.update({
      where: { id: session.id },
      data: {
        status: SwimSessionStatus.REJECTED,
        reviewedById: actor.id,
        reviewedAt: new Date()
      },
      select: swimSessionSelect
    });

    if (updated.userId !== actor.id) {
      await this.notificationsService.createForUser(updated.userId, {
        title: 'Schwimmeinheit abgelehnt',
        message: `Deine Schwimmeinheit vom ${this.formatDateLabel(updated.date)} (${updated.distanceMeters}m, ${updated.styleId}) wurde von ${actor.displayName} abgelehnt.`,
        type: NotificationType.WARNING,
        metadata: {
          eventType: 'SWIM_SESSION_REJECTED',
          swimSessionId: updated.id
        }
      });
    }

    await this.auditLogService.writeForUser(
      actor,
      'swim_session.rejected',
      'SwimSession',
      updated.id,
      {
        ownerUserId: updated.userId
      },
      request
    );

    return this.toPayload(updated);
  }

  async withdraw(actor: AuthenticatedUser, sessionId: string, request: Request) {
    this.assertOrganization(actor);

    const session = await this.getPendingSession(sessionId, actor.organizationId!);
    if (session.userId !== actor.id) {
      throw new ForbiddenException('You may only withdraw your own pending swim sessions.');
    }

    const updated = await this.prisma.swimSession.update({
      where: { id: session.id },
      data: {
        status: SwimSessionStatus.REJECTED,
        reviewedById: null,
        reviewedAt: null
      },
      select: swimSessionSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'swim_session.withdrawn',
      'SwimSession',
      updated.id,
      {
        date: updated.date.toISOString(),
        distanceMeters: updated.distanceMeters,
        timeMinutes: updated.timeMinutes,
        styleId: updated.styleId
      },
      request
    );

    return this.toPayload(updated);
  }

  private async getPendingSession(sessionId: string, organizationId: string) {
    const session = await this.prisma.swimSession.findFirst({
      where: {
        id: sessionId,
        organizationId,
        status: SwimSessionStatus.PENDING
      },
      select: swimSessionSelect
    });

    if (!session) {
      throw new NotFoundException('Pending swim session not found.');
    }

    return session;
  }

  private async notifyStaffAboutPendingSession(actor: AuthenticatedUser, session: SwimSessionPayload) {
    const recipients = await this.prisma.user.findMany({
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

    if (!recipients.length) {
      return;
    }

    await this.notificationsService.createForUsers(
      recipients.map((recipient) => recipient.id),
      {
        title: 'Neue Schwimmeinheit wartet auf Freigabe',
        message: `${actor.displayName} hat eine Schwimmeinheit eingetragen (${this.formatDateLabel(session.date)}, ${session.distanceMeters}m, ${session.styleId}) und wartet auf Bestaetigung.`,
        type: NotificationType.INFO,
        metadata: {
          eventType: 'SWIM_SESSION_PENDING',
          swimSessionId: session.id
        }
      }
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

  private formatDateLabel(value: Date) {
    return new Intl.DateTimeFormat('de-DE').format(value);
  }

  private async awardTrainingPlanXpIfEligible(session: SwimSessionPayload, organizationId: string) {
    const { trainingPlanId, trainingPlanUnitId } = this.extractTrainingPlanSelectionFromNotes(session.notes);
    if (!trainingPlanId) {
      return {
        addedXp: 0,
        planId: null,
        planName: null
      };
    }

    const plan = await this.swimTrainingPlansService.resolvePlanForUser(
      organizationId,
      session.userId,
      trainingPlanId
    );

    if (!plan) {
      return {
        addedXp: 0,
        planId: null,
        planName: null
      };
    }

    const isEligible = doesSessionFulfillTrainingPlan(
      {
        distanceMeters: session.distanceMeters,
        timeMinutes: session.timeMinutes,
        styleId: session.styleId
      },
      plan,
      trainingPlanUnitId || ''
    );

    if (!isEligible) {
      return {
        addedXp: 0,
        planId: plan.id,
        planName: plan.name
      };
    }

    const xpResult = await this.userStatsService.awardXp({
      organizationId,
      targetUserId: session.userId,
      sourceKey: 'swimTrainingPlans',
      amount: plan.xpReward,
      eventKey: `swim_training_plan_${plan.id}_${session.id}`,
      reason: `Trainingsplan erfuellt: ${plan.name}`,
      metadata: {
        swimSessionId: session.id,
        swimTrainingPlanId: plan.id,
        swimTrainingPlanUnitId: trainingPlanUnitId || null
      }
    });

    return {
      addedXp: xpResult.addedXp,
      planId: plan.id,
      planName: plan.name
    };
  }

  private extractTrainingPlanSelectionFromNotes(notesInput: string | null | undefined) {
    const notes = String(notesInput || '');
    return {
      trainingPlanId: notes.match(SwimSessionsService.SWIM_PLAN_NOTE_TAG_REGEX)?.[1] || null,
      trainingPlanUnitId: notes.match(SwimSessionsService.SWIM_PLAN_NOTE_UNIT_TAG_REGEX)?.[1] || null
    };
  }

  private toPayload(session: SwimSessionPayload) {
    const role = String(session.user.role || '').trim().toLowerCase();
    const normalizedRole = role === 'rettungsschwimmer_azubi' ? 'azubi' : role;
    const reviewerName = session.reviewedBy?.displayName || null;

    return {
      id: session.id,
      user_id: session.userId,
      user_name: session.user.displayName,
      user_role: normalizedRole,
      date: session.date.toISOString().slice(0, 10),
      distance: session.distanceMeters,
      time_minutes: session.timeMinutes,
      style: session.styleId,
      notes: session.notes || '',
      challenge_id: session.challengeId || null,
      status: String(session.status || 'PENDING').toLowerCase(),
      confirmed: session.status === SwimSessionStatus.CONFIRMED,
      confirmed_by: session.status === SwimSessionStatus.CONFIRMED ? reviewerName : null,
      confirmed_at: session.status === SwimSessionStatus.CONFIRMED ? session.reviewedAt?.toISOString() ?? null : null,
      reviewed_by: reviewerName,
      reviewed_at: session.reviewedAt?.toISOString() ?? null,
      created_at: session.createdAt.toISOString(),
      updated_at: session.updatedAt.toISOString()
    };
  }
}
