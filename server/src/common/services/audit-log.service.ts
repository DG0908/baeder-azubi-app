import { Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

type AuditLogInput = {
  action: string;
  entityType: string;
  entityId?: string | null;
  actorUserId?: string | null;
  metadata?: Prisma.InputJsonValue;
  request?: Request;
};

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async write(input: AuditLogInput): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId ?? null,
          actorUserId: input.actorUserId ?? null,
          metadata: input.metadata ?? {},
          ipAddress: this.extractIpAddress(input.request),
          userAgent: input.request?.headers['user-agent'] ?? null
        }
      });
    } catch (error) {
      this.logger.warn(
        `Audit log write failed for ${input.action}: ${error instanceof Error ? error.message : 'unknown error'}`
      );
    }
  }

  async writeForUser(
    actor: Pick<User, 'id'> | null | undefined,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Prisma.InputJsonValue,
    request?: Request
  ): Promise<void> {
    await this.write({
      action,
      entityType,
      entityId,
      actorUserId: actor?.id ?? null,
      metadata,
      request
    });
  }

  private extractIpAddress(request?: Request): string | null {
    if (!request) {
      return null;
    }

    const forwardedFor = request.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
      return forwardedFor.split(',')[0]?.trim() ?? null;
    }

    return request.ip ?? null;
  }
}
