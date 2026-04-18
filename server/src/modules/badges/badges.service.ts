import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';

export interface BadgePayload {
  id: string;
  badgeId: string;
  earnedAt: string;
}

@Injectable()
export class BadgesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string): Promise<BadgePayload[]> {
    const rows = await this.prisma.userBadge.findMany({
      where: { userId },
      orderBy: { earnedAt: 'asc' }
    });
    return rows.map((row) => ({
      id: row.id,
      badgeId: row.badgeId,
      earnedAt: row.earnedAt.toISOString()
    }));
  }

  async getMine(actor: AuthenticatedUser): Promise<BadgePayload[]> {
    return this.listForUser(actor.id);
  }

  async grantMany(actor: AuthenticatedUser, badgeIds: string[]): Promise<BadgePayload[]> {
    const uniqueIds = Array.from(new Set(badgeIds));
    if (uniqueIds.length === 0) {
      return this.listForUser(actor.id);
    }

    await this.prisma.userBadge.createMany({
      data: uniqueIds.map((badgeId) => ({ userId: actor.id, badgeId })),
      skipDuplicates: true
    });

    return this.listForUser(actor.id);
  }
}
