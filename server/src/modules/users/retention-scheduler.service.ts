import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AccountStatus } from '@prisma/client';
import { AuditLogService } from '../../common/services/audit-log.service';
import { MailerService } from '../../common/services/mailer.service';
import { PrismaService } from '../../prisma/prisma.service';

/** Warn users after 22 months of inactivity, delete after 24 months. */
const RETENTION_WARN_MONTHS = 22;
const RETENTION_DELETE_MONTHS = 24;

@Injectable()
export class RetentionSchedulerService {
  private readonly logger = new Logger(RetentionSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly auditLogService: AuditLogService,
    private readonly configService: ConfigService
  ) {}

  /** Runs daily at 03:00 UTC. */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async processRetention() {
    try {
      const warned = await this.warnInactiveUsers();
      const deleted = await this.deleteExpiredUsers();

      if (warned > 0 || deleted > 0) {
        this.logger.log(
          `Retention run complete: ${warned} warned, ${deleted} soft-deleted.`
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown retention error.';
      this.logger.error(`Retention scheduler failed: ${message}`);
    }
  }

  /** Sends warning email to users inactive for ≥ 22 months but < 24 months. */
  async warnInactiveUsers(): Promise<number> {
    const warnCutoff = this.monthsAgo(RETENTION_WARN_MONTHS);
    const deleteCutoff = this.monthsAgo(RETENTION_DELETE_MONTHS);

    const candidates = await this.prisma.user.findMany({
      where: {
        isDeleted: false,
        status: AccountStatus.APPROVED,
        lastLoginAt: {
          lt: warnCutoff,
          gte: deleteCutoff
        },
        retentionWarnedAt: null
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        lastLoginAt: true
      }
    });

    if (candidates.length === 0) return 0;

    const loginUrl = this.getLoginUrl();

    for (const user of candidates) {
      const daysUntilDeletion = this.daysUntilDeletion(user.lastLoginAt!);

      await this.mailerService.sendRetentionWarningEmail({
        email: user.email,
        displayName: user.displayName,
        daysUntilDeletion,
        loginUrl
      });

      await this.prisma.user.update({
        where: { id: user.id },
        data: { retentionWarnedAt: new Date() }
      });

      await this.auditLogService.write({
        action: 'user.retention_warning_sent',
        entityType: 'user',
        entityId: user.id,
        metadata: {
          email: user.email,
          lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
          daysUntilDeletion
        }
      });
    }

    return candidates.length;
  }

  /** Soft-deletes users inactive for ≥ 24 months. */
  async deleteExpiredUsers(): Promise<number> {
    const deleteCutoff = this.monthsAgo(RETENTION_DELETE_MONTHS);

    const expired = await this.prisma.user.findMany({
      where: {
        isDeleted: false,
        status: AccountStatus.APPROVED,
        lastLoginAt: {
          lt: deleteCutoff
        }
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        lastLoginAt: true
      }
    });

    if (expired.length === 0) return 0;

    for (const user of expired) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isDeleted: true,
          status: AccountStatus.DISABLED,
          refreshTokenHash: null
        }
      });

      await this.auditLogService.write({
        action: 'user.retention_deleted',
        entityType: 'user',
        entityId: user.id,
        metadata: {
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          lastLoginAt: user.lastLoginAt?.toISOString() ?? null
        }
      });
    }

    return expired.length;
  }

  private monthsAgo(months: number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date;
  }

  private daysUntilDeletion(lastLoginAt: Date): number {
    const deleteAt = new Date(lastLoginAt);
    deleteAt.setMonth(deleteAt.getMonth() + RETENTION_DELETE_MONTHS);
    const diff = deleteAt.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  private getLoginUrl(): string {
    const appPublicUrl = String(
      this.configService.get<string>('APP_PUBLIC_URL', '')
    ).trim();
    return appPublicUrl || 'https://azubi.smartbaden.de';
  }
}
