import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AccountStatus, AppRole, NotificationType, Prisma } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserStatsService } from '../user-stats/user-stats.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';

const flashcardSelect = {
  id: true,
  category: true,
  question: true,
  answer: true,
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
} satisfies Prisma.FlashcardSelect;

type FlashcardRecord = Prisma.FlashcardGetPayload<{ select: typeof flashcardSelect }>;

@Injectable()
export class FlashcardsService {
  private static readonly FLASHCARD_CREATE_XP = 15;

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService,
    private readonly userStatsService: UserStatsService
  ) {}

  async listApproved(actor: AuthenticatedUser) {
    this.assertOrganization(actor);

    const cards = await this.prisma.flashcard.findMany({
      where: {
        organizationId: actor.organizationId!,
        approved: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 500,
      select: flashcardSelect
    });

    return cards.map((card) => this.toPayload(card));
  }

  async listPending(actor: AuthenticatedUser) {
    this.assertOrganization(actor);
    this.assertStaff(actor);

    const cards = await this.prisma.flashcard.findMany({
      where: {
        organizationId: actor.organizationId!,
        approved: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 200,
      select: flashcardSelect
    });

    return cards.map((card) => this.toPayload(card));
  }

  async create(actor: AuthenticatedUser, dto: CreateFlashcardDto, request: Request) {
    this.assertOrganization(actor);

    const question = this.sanitizeText(dto.question, 'question');
    const answer = this.sanitizeText(dto.answer, 'answer');
    const category = this.sanitizeIdentifier(dto.category, 'category');
    const autoApprove = this.isStaff(actor.role);

    const created = await this.prisma.flashcard.create({
      data: {
        organizationId: actor.organizationId!,
        userId: actor.id,
        category,
        question,
        answer,
        approved: autoApprove,
        approvedById: autoApprove ? actor.id : null,
        approvedAt: autoApprove ? new Date() : null
      },
      select: flashcardSelect
    });

    let xpAward = { addedXp: 0 };
    if (autoApprove) {
      xpAward = await this.userStatsService.awardXp({
        organizationId: actor.organizationId!,
        targetUserId: actor.id,
        sourceKey: 'flashcardCreation',
        amount: FlashcardsService.FLASHCARD_CREATE_XP,
        eventKey: `flashcard_create_${created.id}`,
        reason: 'Karteikarte erstellt',
        metadata: {
          flashcardId: created.id
        }
      });
    } else {
      await this.notifyStaffAboutPendingFlashcard(actor, created.id, category);
    }

    await this.auditLogService.writeForUser(
      actor,
      'flashcard.created',
      'Flashcard',
      created.id,
      {
        approved: autoApprove,
        category
      },
      request
    );

    return {
      flashcard: this.toPayload(created),
      xpAward
    };
  }

  async approve(actor: AuthenticatedUser, flashcardId: string, request: Request) {
    this.assertOrganization(actor);
    this.assertStaff(actor);

    const existing = await this.prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        organizationId: actor.organizationId!
      },
      select: flashcardSelect
    });

    if (!existing) {
      throw new NotFoundException('Flashcard not found.');
    }

    const approved = existing.approved
      ? existing
      : await this.prisma.flashcard.update({
          where: { id: existing.id },
          data: {
            approved: true,
            approvedById: actor.id,
            approvedAt: new Date()
          },
          select: flashcardSelect
        });

    const xpAward = await this.userStatsService.awardXp({
      organizationId: actor.organizationId!,
      targetUserId: approved.userId,
      sourceKey: 'flashcardCreation',
      amount: FlashcardsService.FLASHCARD_CREATE_XP,
      eventKey: `flashcard_create_${approved.id}`,
      reason: 'Karteikarte freigegeben',
      metadata: {
        flashcardId: approved.id
      }
    });

    if (approved.userId !== actor.id) {
      await this.notificationsService.createForUser(approved.userId, {
        title: 'Karteikarte freigegeben',
        message: `Deine Karteikarte wurde freigegeben.${xpAward.addedXp > 0 ? ` +${xpAward.addedXp} XP wurden gutgeschrieben.` : ''}`,
        type: NotificationType.SUCCESS,
        metadata: {
          flashcardId: approved.id,
          eventType: 'FLASHCARD_APPROVED'
        }
      });
    }

    await this.auditLogService.writeForUser(
      actor,
      'flashcard.approved',
      'Flashcard',
      approved.id,
      {
        ownerUserId: approved.userId,
        awardedXp: xpAward.addedXp
      },
      request
    );

    return {
      flashcard: this.toPayload(approved),
      xpAward
    };
  }

  async remove(actor: AuthenticatedUser, flashcardId: string, request: Request) {
    this.assertOrganization(actor);

    const existing = await this.prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        organizationId: actor.organizationId!
      },
      select: flashcardSelect
    });

    if (!existing) {
      throw new NotFoundException('Flashcard not found.');
    }

    const isOwner = existing.userId === actor.id;
    if (!this.isStaff(actor.role)) {
      if (!isOwner || existing.approved) {
        throw new ForbiddenException('You may only remove your own pending flashcards.');
      }
    }

    await this.prisma.flashcard.delete({
      where: { id: existing.id }
    });

    if (this.isStaff(actor.role) && !existing.approved && existing.userId !== actor.id) {
      await this.notificationsService.createForUser(existing.userId, {
        title: 'Karteikarte abgelehnt',
        message: 'Deine eingereichte Karteikarte wurde abgelehnt.',
        type: NotificationType.WARNING,
        metadata: {
          flashcardId: existing.id,
          eventType: 'FLASHCARD_REJECTED'
        }
      });
    }

    await this.auditLogService.writeForUser(
      actor,
      'flashcard.deleted',
      'Flashcard',
      existing.id,
      {
        ownerUserId: existing.userId,
        approved: existing.approved
      },
      request
    );

    return {
      id: existing.id
    };
  }

  private async notifyStaffAboutPendingFlashcard(actor: AuthenticatedUser, flashcardId: string, category: string) {
    const staffRecipients = await this.prisma.user.findMany({
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

    if (!staffRecipients.length) {
      return;
    }

    await this.notificationsService.createForUsers(
      staffRecipients.map((recipient) => recipient.id),
      {
        title: 'Neue Karteikarte wartet auf Freigabe',
        message: `${actor.displayName} hat eine neue Karteikarte in ${category} eingereicht.`,
        type: NotificationType.INFO,
        metadata: {
          flashcardId,
          eventType: 'FLASHCARD_PENDING'
        }
      }
    );
  }

  private toPayload(card: FlashcardRecord) {
    return {
      id: card.id,
      category: card.category,
      question: card.question,
      answer: card.answer,
      approved: card.approved,
      user_id: card.userId,
      created_at: card.createdAt.toISOString(),
      created_by: card.user.displayName,
      approved_at: card.approvedAt?.toISOString() ?? null,
      approved_by: card.approvedBy?.displayName ?? null
    };
  }

  private sanitizeText(value: string, fieldName: string) {
    const sanitized = sanitizeHtml(String(value || ''), {
      allowedTags: [],
      allowedAttributes: {}
    })
      .replace(/\r\n/g, '\n')
      .trim();

    if (!sanitized) {
      throw new BadRequestException(`${fieldName} is empty after sanitization.`);
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

  private isStaff(role: AppRole) {
    return role === AppRole.ADMIN || role === AppRole.AUSBILDER;
  }

  private assertOrganization(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }
  }

  private assertStaff(actor: AuthenticatedUser) {
    if (!this.isStaff(actor.role)) {
      throw new ForbiddenException('Only staff may manage flashcards.');
    }
  }
}
