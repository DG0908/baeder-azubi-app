import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  ServiceUnavailableException
} from '@nestjs/common';
import { AccountStatus, AppRole, NotificationType, Prisma } from '@prisma/client';
import { Request } from 'express';
import webpush from 'web-push';
import { ConfigService } from '@nestjs/config';
import { AuditLogService } from '../../common/services/audit-log.service';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { RemovePushSubscriptionDto } from './dto/remove-push-subscription.dto';
import { PushTestTargetScope, SendTestPushDto } from './dto/send-test-push.dto';
import { UpsertPushSubscriptionDto } from './dto/upsert-push-subscription.dto';

type NotificationPushInput = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  metadata: Prisma.JsonValue | null;
};

type PushDispatchSummary = {
  sent: number;
  failed: number;
  removed: number;
  targetUsersWithSubscription: number;
};

@Injectable()
export class PushNotificationsService {
  private readonly logger = new Logger(PushNotificationsService.name);
  private readonly defaultIcon = '/icons/icon-192x192.png';

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService
  ) {}

  isConfigured(): boolean {
    return Boolean(this.getPublicKey() && this.getPrivateKey() && this.getSubject());
  }

  async upsertSubscription(
    actor: AuthenticatedUser,
    dto: UpsertPushSubscriptionDto,
    request?: Request
  ) {
    this.assertConfigured();

    const subscription = await this.prisma.pushSubscription.upsert({
      where: {
        endpoint: dto.endpoint.trim()
      },
      update: {
        userId: actor.id,
        p256dh: dto.p256dh.trim(),
        auth: dto.auth.trim(),
        userAgent: this.normalizeOptionalText(dto.userAgent, 512),
        deviceLabel: this.normalizeOptionalText(dto.deviceLabel, 120),
        lastSeenAt: new Date()
      },
      create: {
        userId: actor.id,
        endpoint: dto.endpoint.trim(),
        p256dh: dto.p256dh.trim(),
        auth: dto.auth.trim(),
        userAgent: this.normalizeOptionalText(dto.userAgent, 512),
        deviceLabel: this.normalizeOptionalText(dto.deviceLabel, 120),
        lastSeenAt: new Date()
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'push.subscription_upserted',
      'PushSubscription',
      subscription.id,
      {
        endpoint: subscription.endpoint,
        deviceLabel: subscription.deviceLabel ?? null
      },
      request
    );

    return {
      configured: true,
      endpoint: subscription.endpoint,
      lastSeenAt: subscription.lastSeenAt,
      deviceLabel: subscription.deviceLabel ?? null
    };
  }

  async removeSubscription(
    actor: AuthenticatedUser,
    dto: RemovePushSubscriptionDto,
    request?: Request
  ) {
    const endpoint = dto.endpoint.trim();
    const result = await this.prisma.pushSubscription.deleteMany({
      where: {
        userId: actor.id,
        endpoint
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'push.subscription_removed',
      'PushSubscription',
      endpoint,
      {
        endpoint,
        removed: result.count
      },
      request
    );

    return {
      removed: result.count,
      hadSubscription: result.count > 0,
      endpoint
    };
  }

  async sendTestPush(
    actor: AuthenticatedUser,
    dto: SendTestPushDto,
    request?: Request
  ) {
    this.assertConfigured();

    const targetScope = dto.targetScope ?? PushTestTargetScope.SELF;
    const targetUserIds = await this.resolveTestRecipients(actor, targetScope);
    const targetUsersWithSubscription = await this.countUsersWithSubscription(targetUserIds);

    const summary = await this.dispatchPayloadToUsers(
      targetUserIds,
      {
        title: targetScope === PushTestTargetScope.ORGANIZATION
          ? 'Azubi-App Organisationstest'
          : 'Azubi-App Test-Push',
        message: targetScope === PushTestTargetScope.ORGANIZATION
          ? `${actor.displayName} hat einen Test-Push fuer den gesamten Betrieb ausgelost.`
          : 'Dieses Geraet empfaengt Web-Push aus der sicheren Backend-API.',
        type: NotificationType.INFO,
        tag: targetScope === PushTestTargetScope.ORGANIZATION ? 'test-push-org' : 'test-push-self',
        data: {
          url: '/',
          targetScope
        }
      }
    );

    await this.auditLogService.writeForUser(
      actor,
      'push.test_sent',
      'PushSubscription',
      actor.id,
      {
        targetScope,
        targetUserCount: targetUserIds.length,
        ...summary
      },
      request
    );

    return {
      ok: true,
      configured: true,
      scheduled: false,
      delaySeconds: 0,
      targetScope,
      requestedUsers: targetUserIds.length,
      targetUsersWithSubscription,
      sent: summary.sent,
      failed: summary.failed,
      removed: summary.removed
    };
  }

  async dispatchAppNotifications(notifications: NotificationPushInput[]): Promise<void> {
    if (!this.isConfigured() || notifications.length === 0) {
      return;
    }

    try {
      const subscriptions = await this.prisma.pushSubscription.findMany({
        where: {
          userId: {
            in: [...new Set(notifications.map((notification) => notification.userId))]
          }
        },
        select: {
          id: true,
          userId: true,
          endpoint: true,
          p256dh: true,
          auth: true
        }
      });

      if (subscriptions.length === 0) {
        return;
      }

      const byUserId = new Map<string, typeof subscriptions>();
      for (const subscription of subscriptions) {
        const bucket = byUserId.get(subscription.userId) ?? [];
        bucket.push(subscription);
        byUserId.set(subscription.userId, bucket);
      }

      this.configureWebPush();
      const staleIds = new Set<string>();

      for (const notification of notifications) {
        const userSubscriptions = byUserId.get(notification.userId) ?? [];
        if (userSubscriptions.length === 0) {
          continue;
        }

        const payload = JSON.stringify(this.buildNotificationPayload(notification));
        for (const subscription of userSubscriptions) {
          const result = await this.sendToSubscription(subscription, payload);
          if (result === 'stale') {
            staleIds.add(subscription.id);
          }
        }
      }

      await this.deleteStaleSubscriptions(staleIds);
    } catch (error) {
      this.logger.warn(
        `Automatic push dispatch skipped: ${error instanceof Error ? error.message : 'unknown error'}`
      );
    }
  }

  private async resolveTestRecipients(actor: AuthenticatedUser, scope: PushTestTargetScope) {
    if (scope === PushTestTargetScope.SELF) {
      return [actor.id];
    }

    if (!this.isStaff(actor.role)) {
      throw new ForbiddenException('Only staff may trigger organization-wide test pushes.');
    }

    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }

    const users = await this.prisma.user.findMany({
      where: {
        organizationId: actor.organizationId,
        status: AccountStatus.APPROVED,
        isDeleted: false
      },
      select: {
        id: true
      }
    });

    return users.map((user) => user.id);
  }

  private async countUsersWithSubscription(userIds: string[]) {
    if (userIds.length === 0) {
      return 0;
    }

    const distinct = await this.prisma.pushSubscription.findMany({
      where: {
        userId: {
          in: userIds
        }
      },
      select: {
        userId: true
      },
      distinct: ['userId']
    });

    return distinct.length;
  }

  private async dispatchPayloadToUsers(
    userIds: string[],
    payloadInput: {
      title: string;
      message: string;
      type?: NotificationType;
      tag?: string;
      data?: Record<string, unknown>;
    }
  ): Promise<PushDispatchSummary> {
    if (userIds.length === 0) {
      return {
        sent: 0,
        failed: 0,
        removed: 0,
        targetUsersWithSubscription: 0
      };
    }

    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: {
        userId: {
          in: [...new Set(userIds)]
        }
      },
      select: {
        id: true,
        userId: true,
        endpoint: true,
        p256dh: true,
        auth: true
      }
    });

    if (subscriptions.length === 0) {
      return {
        sent: 0,
        failed: 0,
        removed: 0,
        targetUsersWithSubscription: 0
      };
    }

    this.configureWebPush();
    const payload = JSON.stringify({
      title: payloadInput.title,
      message: payloadInput.message,
      type: String(payloadInput.type ?? NotificationType.INFO).toLowerCase(),
      icon: this.defaultIcon,
      badge: this.defaultIcon,
      tag: payloadInput.tag ?? `push-${Date.now()}`,
      data: {
        url: '/',
        ...(payloadInput.data ?? {})
      },
      timestamp: new Date().toISOString()
    });

    let sent = 0;
    let failed = 0;
    const staleIds = new Set<string>();

    for (const subscription of subscriptions) {
      const result = await this.sendToSubscription(subscription, payload);
      if (result === 'sent') {
        sent += 1;
      } else if (result === 'stale') {
        staleIds.add(subscription.id);
      } else {
        failed += 1;
      }
    }

    const removed = await this.deleteStaleSubscriptions(staleIds);

    return {
      sent,
      failed,
      removed,
      targetUsersWithSubscription: new Set(subscriptions.map((subscription) => subscription.userId)).size
    };
  }

  private async sendToSubscription(
    subscription: {
      id: string;
      endpoint: string;
      p256dh: string;
      auth: string;
    },
    payload: string
  ): Promise<'sent' | 'stale' | 'failed'> {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        },
        payload
      );

      return 'sent';
    } catch (error) {
      const statusCode = Number((error as { statusCode?: number; status?: number } | undefined)?.statusCode
        ?? (error as { statusCode?: number; status?: number } | undefined)?.status
        ?? 0);

      if (statusCode === 404 || statusCode === 410) {
        return 'stale';
      }

      this.logger.warn(
        `Push send failed for subscription ${subscription.id}: ${error instanceof Error ? error.message : 'unknown error'}`
      );
      return 'failed';
    }
  }

  private async deleteStaleSubscriptions(staleIds: Set<string>) {
    if (staleIds.size === 0) {
      return 0;
    }

    const result = await this.prisma.pushSubscription.deleteMany({
      where: {
        id: {
          in: [...staleIds]
        }
      }
    });

    return result.count;
  }

  private buildNotificationPayload(notification: NotificationPushInput) {
    const metadata = this.toMetadataObject(notification.metadata);

    return {
      title: notification.title,
      message: notification.message,
      type: String(notification.type || NotificationType.INFO).toLowerCase(),
      notificationId: notification.id,
      icon: this.defaultIcon,
      badge: this.defaultIcon,
      tag: `notif-${notification.id}`,
      data: {
        notificationId: notification.id,
        url: this.resolveTargetUrl(metadata),
        metadata
      },
      timestamp: new Date().toISOString()
    };
  }

  private resolveTargetUrl(_metadata: Record<string, unknown>) {
    return '/';
  }

  private toMetadataObject(metadata: Prisma.JsonValue | null): Record<string, unknown> {
    if (!metadata || Array.isArray(metadata) || typeof metadata !== 'object') {
      return {};
    }

    return metadata as Record<string, unknown>;
  }

  private configureWebPush() {
    webpush.setVapidDetails(this.getSubject(), this.getPublicKey(), this.getPrivateKey());
  }

  private assertConfigured() {
    if (!this.isConfigured()) {
      throw new ServiceUnavailableException('Web-Push ist serverseitig nicht konfiguriert.');
    }
  }

  private getPublicKey() {
    return String(this.configService.get<string>('WEB_PUSH_PUBLIC_KEY', '')).trim();
  }

  private getPrivateKey() {
    return String(this.configService.get<string>('WEB_PUSH_PRIVATE_KEY', '')).trim();
  }

  private getSubject() {
    return String(this.configService.get<string>('WEB_PUSH_SUBJECT', 'mailto:admin@example.com')).trim();
  }

  private normalizeOptionalText(value: string | undefined, maxLength: number) {
    const normalized = String(value || '').trim();
    if (!normalized) {
      return null;
    }

    return normalized.slice(0, maxLength);
  }

  private isStaff(role: AppRole) {
    return role === AppRole.ADMIN || role === AppRole.AUSBILDER;
  }
}
