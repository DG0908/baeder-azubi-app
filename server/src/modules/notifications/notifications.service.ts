import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, AppRole, NotificationType, Prisma } from '@prisma/client';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { EmitNotificationEventDto, NotificationEventType } from './dto/emit-notification-event.dto';
import { PushNotificationsService } from './push-notifications.service';

type CreateNotificationInput = {
  title: string;
  message: string;
  type?: NotificationType;
  metadata?: Record<string, unknown> | null;
};

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pushNotificationsService: PushNotificationsService
  ) {}

  async emitEvent(actor: AuthenticatedUser, dto: EmitNotificationEventDto) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }

    switch (dto.eventType) {
      case NotificationEventType.SCHOOL_ATTENDANCE_CREATED: {
        const recipients = await this.getValidatedRecipients(actor, dto.targetUserIds, 'staff');
        return this.dispatchEvent(actor, dto.eventType, recipients, {
          title: 'Neuer Kontrollkarten-Eintrag',
          message: `${actor.displayName} hat einen neuen Berufsschul-Eintrag vom ${this.formatDateLabel(dto.schoolDate)} hinzugefuegt.`
        });
      }

      case NotificationEventType.EXAM_GRADE_CREATED: {
        const recipients = await this.getValidatedRecipients(actor, dto.targetUserIds, 'staff');
        const subject = this.requireText(dto.subject, 'subject');
        const gradeLabel = this.requireText(dto.gradeLabel, 'gradeLabel');
        return this.dispatchEvent(actor, dto.eventType, recipients, {
          title: 'Neue Klasur eingetragen',
          message: `${actor.displayName} hat eine ${subject}-Klasur vom ${this.formatDateLabel(dto.examDate)} eingetragen: Note ${gradeLabel}`
        });
      }

      case NotificationEventType.BERICHTSHEFT_READY_FOR_REVIEW: {
        const recipients = await this.getValidatedRecipients(actor, dto.targetUserIds, 'staff');
        return this.dispatchEvent(actor, dto.eventType, recipients, {
          title: 'Berichtsheft wartet auf Freigabe',
          message: `${actor.displayName} hat das Berichtsheft fuer die Woche ab ${this.formatDateLabel(dto.weekStart)} abgeschlossen und zur Freigabe eingereicht.`
        });
      }

      case NotificationEventType.SWIM_SESSION_PENDING: {
        const recipients = await this.getValidatedRecipients(actor, dto.targetUserIds, 'staff');
        const distance = this.requireText(dto.sessionDistanceMeters, 'sessionDistanceMeters');
        const styleName = this.requireText(dto.sessionStyleName, 'sessionStyleName');
        return this.dispatchEvent(actor, dto.eventType, recipients, {
          title: 'Neue Schwimmeinheit wartet auf Freigabe',
          message: `${actor.displayName} hat eine Schwimmeinheit eingetragen (${this.formatDateLabel(dto.sessionDate)}, ${distance}m, ${styleName}) und wartet auf Bestaetigung.`
        });
      }

      case NotificationEventType.SWIM_PLAN_ASSIGNED: {
        this.assertStaff(actor);
        const recipients = await this.getValidatedRecipients(actor, dto.targetUserIds, 'apprentice');
        const planName = this.requireText(dto.planName, 'planName');
        const planUnitLabel = this.requireText(dto.planUnitLabel, 'planUnitLabel');
        return this.dispatchEvent(actor, dto.eventType, recipients, {
          title: 'Neuer Trainingsplan',
          message: `${actor.displayName} hat dir den Plan "${planName}" zugewiesen (${planUnitLabel}).`
        });
      }

      case NotificationEventType.NEWS_PUBLISHED: {
        this.assertStaff(actor);
        const recipients = await this.getBroadcastRecipients(actor, dto.excludeUserIds);
        const newsTitle = this.requireText(dto.newsTitle, 'newsTitle');
        return this.dispatchEvent(actor, dto.eventType, recipients, {
          title: 'Neue News',
          message: `${actor.displayName} hat eine neue News veroeffentlicht: "${newsTitle}"`
        });
      }

      case NotificationEventType.EXAM_CREATED: {
        this.assertStaff(actor);
        const recipients = await this.getBroadcastRecipients(actor, dto.excludeUserIds);
        const examTitle = this.requireText(dto.examTitle, 'examTitle');
        return this.dispatchEvent(actor, dto.eventType, recipients, {
          title: 'Neue Klausur',
          message: `${actor.displayName} hat eine neue Klausur eingetragen: "${examTitle}" (${this.formatDateLabel(dto.examDate)}).`
        });
      }

      default:
        throw new BadRequestException('Unsupported notification event type.');
    }
  }

  async listMine(actor: AuthenticatedUser) {
    const notifications = await this.prisma.appNotification.findMany({
      where: {
        userId: actor.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });

    return notifications.map((notification) => this.toPayload(notification));
  }

  async markRead(actor: AuthenticatedUser, notificationId: string) {
    const existing = await this.prisma.appNotification.findFirst({
      where: {
        id: notificationId,
        userId: actor.id
      }
    });

    if (!existing) {
      throw new NotFoundException('Notification not found.');
    }

    const updated = existing.isRead
      ? existing
      : await this.prisma.appNotification.update({
          where: { id: existing.id },
          data: {
            isRead: true,
            readAt: new Date()
          }
        });

    return this.toPayload(updated);
  }

  async clearMine(actor: AuthenticatedUser) {
    const result = await this.prisma.appNotification.deleteMany({
      where: {
        userId: actor.id
      }
    });

    return {
      deleted: result.count
    };
  }

  async createForUser(userId: string, input: CreateNotificationInput) {
    const created = await this.prisma.appNotification.create({
      data: {
        userId,
        title: input.title.trim(),
        message: input.message.trim(),
        type: input.type ?? NotificationType.INFO,
        metadata: this.sanitizeMetadata(input.metadata ?? null) ?? undefined
      }
    });

    await this.pushNotificationsService.dispatchAppNotifications([created]);
    return created;
  }

  async createForUsers(userIds: string[], input: CreateNotificationInput) {
    const distinctUserIds = [...new Set((userIds || []).map((value) => String(value || '').trim()).filter(Boolean))];
    if (distinctUserIds.length === 0) {
      return [];
    }

    const created = await this.prisma.$transaction(
      distinctUserIds.map((userId) => this.prisma.appNotification.create({
        data: {
          userId,
          title: input.title.trim(),
          message: input.message.trim(),
          type: input.type ?? NotificationType.INFO,
          metadata: this.sanitizeMetadata(input.metadata ?? null) ?? undefined
        }
      }))
    );

    await this.pushNotificationsService.dispatchAppNotifications(created);
    return created;
  }

  private async dispatchEvent(
    actor: AuthenticatedUser,
    eventType: NotificationEventType,
    recipients: Array<{ id: string }>,
    input: CreateNotificationInput
  ) {
    const notifications = await this.createForUsers(
      recipients.map((recipient) => recipient.id),
      {
        ...input,
        type: NotificationType.INFO,
        metadata: {
          ...(input.metadata || {}),
          eventType,
          organizationId: actor.organizationId
        }
      }
    );

    return {
      created: notifications.length
    };
  }

  private async getValidatedRecipients(
    actor: AuthenticatedUser,
    targetUserIds: string[] | undefined,
    expectedGroup: 'staff' | 'apprentice' | 'any'
  ) {
    const normalizedIds = [...new Set((targetUserIds || []).map((value) => String(value || '').trim()).filter(Boolean))];
    if (normalizedIds.length === 0) {
      return [];
    }

    const recipients = await this.prisma.user.findMany({
      where: {
        id: { in: normalizedIds },
        organizationId: actor.organizationId,
        status: AccountStatus.APPROVED,
        isDeleted: false
      },
      select: {
        id: true,
        role: true
      }
    });

    if (recipients.length !== normalizedIds.length) {
      throw new BadRequestException('One or more notification recipients are invalid for your organization.');
    }

    if (expectedGroup === 'staff' && recipients.some((recipient) => !this.isStaff(recipient.role))) {
      throw new ForbiddenException('This notification event may only target staff recipients.');
    }

    if (expectedGroup === 'apprentice' && recipients.some((recipient) => !this.isApprentice(recipient.role))) {
      throw new ForbiddenException('This notification event may only target apprentice recipients.');
    }

    return recipients;
  }

  private async getBroadcastRecipients(actor: AuthenticatedUser, excludeUserIds: string[] | undefined) {
    const excludedIds = new Set(
      [actor.id, ...(excludeUserIds || [])]
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    );

    return this.prisma.user.findMany({
      where: {
        organizationId: actor.organizationId,
        status: AccountStatus.APPROVED,
        isDeleted: false,
        id: {
          notIn: [...excludedIds]
        }
      },
      select: {
        id: true
      }
    });
  }

  private assertStaff(actor: AuthenticatedUser) {
    if (!this.isStaff(actor.role)) {
      throw new ForbiddenException('Only staff may emit this notification event.');
    }
  }

  private isStaff(role: AppRole) {
    return role === AppRole.ADMIN || role === AppRole.AUSBILDER;
  }

  private isApprentice(role: AppRole) {
    return role === AppRole.AZUBI || role === AppRole.RETTUNGSSCHWIMMER_AZUBI;
  }

  private requireText(value: string | undefined, field: string) {
    const normalized = String(value || '').trim();
    if (!normalized) {
      throw new BadRequestException(`Missing notification event field: ${field}.`);
    }
    return normalized;
  }

  private formatDateLabel(value: string | undefined) {
    const normalized = String(value || '').trim();
    if (!normalized) {
      return 'ohne Datum';
    }

    const parsed = new Date(normalized);
    if (Number.isNaN(parsed.getTime())) {
      return normalized;
    }

    return new Intl.DateTimeFormat('de-DE').format(parsed);
  }

  private sanitizeMetadata(value: unknown): Prisma.JsonValue | null {
    if (value === null || value === undefined) {
      return null;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value.map((entry) => this.sanitizeMetadata(entry)) as Prisma.JsonArray;
    }

    if (typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const output: Prisma.JsonObject = {};
      for (const [key, entry] of Object.entries(record)) {
        output[key] = this.sanitizeMetadata(entry);
      }
      return output;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    return String(value);
  }

  private toPayload(notification: {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    readAt: Date | null;
    metadata: unknown;
    createdAt: Date;
  }) {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: String(notification.type || NotificationType.INFO).toLowerCase(),
      read: notification.isRead,
      readAt: notification.readAt,
      metadata: notification.metadata,
      createdAt: notification.createdAt
    };
  }
}
