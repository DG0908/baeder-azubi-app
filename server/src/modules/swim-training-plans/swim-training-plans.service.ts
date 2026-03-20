import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, AppRole, NotificationType, Prisma } from '@prisma/client';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateSwimTrainingPlanDto } from './dto/create-swim-training-plan.dto';
import {
  getDefaultSwimTrainingPlanById,
  normalizeSwimTrainingPlanCategory,
  normalizeSwimTrainingPlanDifficulty,
  normalizeSwimTrainingPlanUnits,
  ResolvedSwimTrainingPlan
} from './swim-training-plan-catalog';

const swimTrainingPlanSelect = {
  id: true,
  organizationId: true,
  createdById: true,
  assignedUserId: true,
  name: true,
  category: true,
  difficulty: true,
  units: true,
  xpReward: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  createdBy: {
    select: {
      id: true,
      displayName: true,
      role: true
    }
  },
  assignedUser: {
    select: {
      id: true,
      displayName: true,
      role: true,
      status: true,
      isDeleted: true
    }
  }
} satisfies Prisma.SwimTrainingPlanSelect;

type SwimTrainingPlanRecord = Prisma.SwimTrainingPlanGetPayload<{ select: typeof swimTrainingPlanSelect }>;

@Injectable()
export class SwimTrainingPlansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService
  ) {}

  async list(actor: AuthenticatedUser) {
    this.assertOrganization(actor);

    const plans = await this.prisma.swimTrainingPlan.findMany({
      where: {
        organizationId: actor.organizationId!,
        isActive: true,
        ...(this.isStaff(actor.role)
          ? {}
          : {
              OR: [
                { assignedUserId: actor.id },
                { createdById: actor.id }
              ]
            })
      },
      orderBy: [
        { createdAt: 'desc' },
        { name: 'asc' }
      ],
      select: swimTrainingPlanSelect
    });

    return plans.map((plan) => this.toPayload(plan));
  }

  async create(actor: AuthenticatedUser, dto: CreateSwimTrainingPlanDto, request: Request) {
    this.assertOrganization(actor);

    const normalizedUnits = normalizeSwimTrainingPlanUnits(dto.units, dto);
    if (normalizedUnits.length === 0) {
      throw new BadRequestException('At least one training unit is required.');
    }

    const assignedUserId = this.resolveAssignedUserId(actor, dto.assignedUserId);
    const assignedUser = await this.prisma.user.findFirst({
      where: {
        id: assignedUserId,
        organizationId: actor.organizationId!,
        status: AccountStatus.APPROVED,
        isDeleted: false
      },
      select: {
        id: true,
        displayName: true,
        role: true
      }
    });

    if (!assignedUser) {
      throw new NotFoundException('Assigned user not found in your organization.');
    }

    if (!this.isApprentice(assignedUser.role) && assignedUser.id !== actor.id) {
      throw new ForbiddenException('Training plans may only be assigned to apprentices.');
    }

    const created = await this.prisma.swimTrainingPlan.create({
      data: {
        organizationId: actor.organizationId!,
        createdById: actor.id,
        assignedUserId: assignedUser.id,
        name: dto.name.trim(),
        category: normalizeSwimTrainingPlanCategory(dto.category),
        difficulty: normalizeSwimTrainingPlanDifficulty(dto.difficulty),
        units: normalizedUnits as unknown as Prisma.InputJsonValue,
        xpReward: Math.max(1, Math.round(dto.xpReward)),
        description: dto.description?.trim() || null,
        isActive: true
      },
      select: swimTrainingPlanSelect
    });

    if (assignedUser.id !== actor.id) {
      const firstUnit = normalizedUnits[0];
      const unitLabel = normalizedUnits.length > 1
        ? `${normalizedUnits.length} Einheiten (Start: ${firstUnit.targetDistance}m in ${firstUnit.targetTime} Min)`
        : `${firstUnit.targetDistance}m in ${firstUnit.targetTime} Min`;

      await this.notificationsService.createForUser(assignedUser.id, {
        title: 'Neuer Trainingsplan',
        message: `${actor.displayName} hat dir den Plan "${created.name}" zugewiesen (${unitLabel}).`,
        type: NotificationType.INFO,
        metadata: {
          eventType: 'SWIM_PLAN_ASSIGNED',
          swimTrainingPlanId: created.id
        }
      });
    }

    await this.auditLogService.writeForUser(
      actor,
      'swim_training_plan.created',
      'SwimTrainingPlan',
      created.id,
      {
        assignedUserId: assignedUser.id,
        unitCount: normalizedUnits.length,
        xpReward: created.xpReward
      },
      request
    );

    return this.toPayload(created);
  }

  async resolvePlanForUser(organizationId: string, targetUserId: string, planIdInput: string) {
    const defaultPlan = getDefaultSwimTrainingPlanById(planIdInput);
    if (defaultPlan) {
      return defaultPlan;
    }

    const planId = String(planIdInput || '').trim();
    if (!planId) {
      return null;
    }

    const customPlan = await this.prisma.swimTrainingPlan.findFirst({
      where: {
        id: planId,
        organizationId,
        isActive: true,
        OR: [
          { assignedUserId: targetUserId },
          { createdById: targetUserId }
        ]
      },
      select: swimTrainingPlanSelect
    });

    return customPlan ? this.toResolvedPlan(customPlan) : null;
  }

  private resolveAssignedUserId(actor: AuthenticatedUser, requestedAssignedUserId?: string) {
    const requested = String(requestedAssignedUserId || '').trim();
    if (!requested) {
      return actor.id;
    }

    if (!this.isStaff(actor.role) && requested !== actor.id) {
      throw new ForbiddenException('You may only create personal training plans for yourself.');
    }

    return requested;
  }

  private toPayload(plan: SwimTrainingPlanRecord) {
    const resolved = this.toResolvedPlan(plan);
    const primaryUnit = resolved.units[0];

    return {
      id: resolved.id,
      name: resolved.name,
      category: resolved.category,
      difficulty: resolved.difficulty,
      style_id: primaryUnit?.styleId || 'kraul',
      target_distance: primaryUnit?.targetDistance || 1000,
      target_time: primaryUnit?.targetTime || 30,
      units_json: resolved.units.map((unit) => ({
        id: unit.id,
        style_id: unit.styleId,
        target_distance: unit.targetDistance,
        target_time: unit.targetTime
      })),
      xp_reward: resolved.xpReward,
      description: resolved.description,
      created_by_user_id: resolved.createdByUserId,
      created_by_name: resolved.createdByName,
      created_by_role: resolved.createdByRole,
      assigned_user_id: resolved.assignedUserId,
      assigned_user_name: resolved.assignedUserName,
      assigned_user_role: resolved.assignedUserRole,
      created_at: resolved.createdAt
    };
  }

  private toResolvedPlan(plan: SwimTrainingPlanRecord): ResolvedSwimTrainingPlan {
    return {
      id: plan.id,
      name: plan.name,
      category: normalizeSwimTrainingPlanCategory(plan.category),
      difficulty: normalizeSwimTrainingPlanDifficulty(plan.difficulty),
      units: normalizeSwimTrainingPlanUnits(plan.units, {}),
      xpReward: Math.max(1, Math.round(plan.xpReward)),
      description: plan.description || '',
      source: 'custom',
      isCustom: true,
      createdByUserId: plan.createdById,
      createdByName: plan.createdBy.displayName,
      createdByRole: this.toFrontendRole(plan.createdBy.role),
      assignedUserId: plan.assignedUserId,
      assignedUserName: plan.assignedUser.displayName,
      assignedUserRole: this.toFrontendRole(plan.assignedUser.role),
      createdAt: plan.createdAt.toISOString()
    };
  }

  private isStaff(role: AppRole) {
    return role === AppRole.ADMIN || role === AppRole.AUSBILDER;
  }

  private isApprentice(role: AppRole) {
    return role === AppRole.AZUBI || role === AppRole.RETTUNGSSCHWIMMER_AZUBI;
  }

  private toFrontendRole(role: AppRole) {
    if (role === AppRole.ADMIN) {
      return 'admin';
    }

    if (role === AppRole.AUSBILDER) {
      return 'trainer';
    }

    if (role === AppRole.RETTUNGSSCHWIMMER_AZUBI) {
      return 'rettungsschwimmer_azubi';
    }

    return 'azubi';
  }

  private assertOrganization(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }
  }
}
