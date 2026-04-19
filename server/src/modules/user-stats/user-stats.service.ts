import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { AccountStatus, AppRole, Prisma } from '@prisma/client';
import { Request } from 'express';
import { AuditLogService } from '../../common/services/audit-log.service';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import {
  addXpToStats,
  createEmptyUserStats,
  ensureUserStatsStructure,
  getXpMetaFromCategoryStats,
  toJsonObject,
  USER_STATS_XP_META_KEY,
  UserStatsShape
} from './user-stats.util';

const QUIZ_WIN_XP = 40;

const userStatsSelect = {
  userId: true,
  wins: true,
  losses: true,
  draws: true,
  categoryStats: true,
  opponents: true,
  winStreak: true,
  bestWinStreak: true
} satisfies Prisma.UserStatsSelect;

type UserStatsRecord = Prisma.UserStatsGetPayload<{ select: typeof userStatsSelect }>;
type RepairLocalStats = {
  userId: string;
  displayName: string;
  wins: number;
  losses: number;
  draws: number;
  opponents: Record<string, { wins: number; losses: number; draws: number }>;
  currentWinStreak: number;
  bestWinStreak: number;
};

@Injectable()
export class UserStatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService
  ) {}

  async getMine(actor: AuthenticatedUser) {
    const stats = await this.getOrCreateStatsRow(actor.id);
    return this.toPayload(stats);
  }

  async listSummary(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }

    const targetUsers = await this.prisma.user.findMany({
      where: this.isStaff(actor.role)
        ? {
            organizationId: actor.organizationId,
            status: AccountStatus.APPROVED,
            isDeleted: false
          }
        : {
            id: actor.id,
            organizationId: actor.organizationId,
            status: AccountStatus.APPROVED,
            isDeleted: false
          },
      select: {
        id: true,
        stats: {
          select: userStatsSelect
        }
      }
    });

    return targetUsers.map((entry) => {
      const normalized = this.normalizeStats(entry.stats);
      const xpMeta = getXpMetaFromCategoryStats(normalized.categoryStats);
      return {
        userId: entry.id,
        wins: normalized.wins,
        losses: normalized.losses,
        draws: normalized.draws,
        total: normalized.wins + normalized.losses + normalized.draws,
        totalXp: xpMeta.totalXp,
        xpBreakdown: xpMeta.breakdown
      };
    });
  }

  async awardXp(input: {
    organizationId: string;
    targetUserId: string;
    sourceKey: string;
    amount: number;
    eventKey?: string | null;
    reason?: string | null;
    metadata?: Record<string, unknown> | null;
  }) {
    if (!input.organizationId || !input.targetUserId) {
      throw new BadRequestException('Award target is incomplete.');
    }

    const targetUser = await this.prisma.user.findFirst({
      where: {
        id: input.targetUserId,
        organizationId: input.organizationId,
        isDeleted: false
      },
      select: {
        id: true,
        displayName: true
      }
    });

    if (!targetUser) {
      throw new ForbiddenException('Target user is invalid for this organization.');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      if (input.eventKey) {
        const existingEvent = await tx.userXpEvent.findUnique({
          where: {
            eventKey: input.eventKey
          }
        });

        if (existingEvent) {
          const existingStats = await tx.userStats.findUnique({
            where: { userId: targetUser.id },
            select: userStatsSelect
          });

          return {
            addedXp: 0,
            stats: this.normalizeStats(existingStats)
          };
        }
      }

      const current = await tx.userStats.upsert({
        where: { userId: targetUser.id },
        update: {},
        create: {
          userId: targetUser.id,
          wins: 0,
          losses: 0,
          draws: 0,
          categoryStats: toJsonObject({}),
          opponents: toJsonObject({}),
          winStreak: 0,
          bestWinStreak: 0
        },
        select: userStatsSelect
      });

      const { stats, addedXp } = addXpToStats(
        this.normalizeStats(current),
        input.sourceKey,
        input.amount,
        input.eventKey ?? null
      );

      if (addedXp <= 0) {
        return {
          addedXp: 0,
          stats
        };
      }

      const updated = await tx.userStats.update({
        where: { userId: targetUser.id },
        data: {
          wins: stats.wins,
          losses: stats.losses,
          draws: stats.draws,
          categoryStats: toJsonObject(stats.categoryStats),
          opponents: toJsonObject(stats.opponents),
          winStreak: stats.winStreak,
          bestWinStreak: stats.bestWinStreak
        },
        select: userStatsSelect
      });

      await tx.userXpEvent.create({
        data: {
          organizationId: input.organizationId,
          userId: targetUser.id,
          sourceKey: String(input.sourceKey || '').trim(),
          eventKey: input.eventKey ?? null,
          amount: addedXp,
          reason: input.reason?.trim() || null,
          metadata: input.metadata ? toJsonObject(input.metadata) : undefined
        }
      });

      return {
        addedXp,
        stats: this.normalizeStats(updated)
      };
    });

    return {
      userId: targetUser.id,
      displayName: targetUser.displayName,
      addedXp: result.addedXp,
      stats: this.toSerializableStats(result.stats)
    };
  }

  async repairQuizStats(actor: AuthenticatedUser, request?: Request) {
    if (actor.role !== AppRole.ADMIN) {
      throw new ForbiddenException('Only admins may repair quiz statistics.');
    }

    const [users, existingStatsRows, completedDuels] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          isDeleted: false
        },
        select: {
          id: true,
          displayName: true
        }
      }),
      this.prisma.userStats.findMany({
        select: userStatsSelect
      }),
      this.prisma.duel.findMany({
        where: {
          status: 'COMPLETED'
        },
        orderBy: [
          { completedAt: 'asc' },
          { createdAt: 'asc' }
        ],
        select: {
          id: true,
          challengerId: true,
          opponentId: true,
          winnerUserId: true,
          challenger: {
            select: {
              displayName: true
            }
          },
          opponent: {
            select: {
              displayName: true
            }
          }
        }
      })
    ]);

    const userNameById = new Map(users.map((user) => [user.id, user.displayName]));
    const existingStatsByUserId = new Map(existingStatsRows.map((row) => [row.userId, row]));
    const computedStatsByUserId = new Map<string, RepairLocalStats>();
    const winningDuelIdsByUser = new Map<string, string[]>();
    let skippedDuelsMissingUsers = 0;

    const recordWinningDuel = (userId: string, duelId: string) => {
      const list = winningDuelIdsByUser.get(userId) ?? [];
      list.push(duelId);
      winningDuelIdsByUser.set(userId, list);
    };

    const ensureStats = (userId: string, displayName: string) => {
      const existing = computedStatsByUserId.get(userId);
      if (existing) {
        return existing;
      }

      const created: RepairLocalStats = {
        userId,
        displayName,
        wins: 0,
        losses: 0,
        draws: 0,
        opponents: {},
        currentWinStreak: 0,
        bestWinStreak: 0
      };
      computedStatsByUserId.set(userId, created);
      return created;
    };

    const ensureOpponentBucket = (stats: RepairLocalStats, opponentName: string) => {
      if (!stats.opponents[opponentName]) {
        stats.opponents[opponentName] = {
          wins: 0,
          losses: 0,
          draws: 0
        };
      }

      return stats.opponents[opponentName];
    };

    for (const duel of completedDuels) {
      const challengerName = userNameById.get(duel.challengerId) ?? duel.challenger.displayName;
      const opponentName = userNameById.get(duel.opponentId) ?? duel.opponent.displayName;
      if (!challengerName || !opponentName) {
        skippedDuelsMissingUsers += 1;
        continue;
      }

      const challengerStats = ensureStats(duel.challengerId, challengerName);
      const opponentStats = ensureStats(duel.opponentId, opponentName);
      const challengerVsOpponent = ensureOpponentBucket(challengerStats, opponentName);
      const opponentVsChallenger = ensureOpponentBucket(opponentStats, challengerName);

      if (!duel.winnerUserId) {
        challengerStats.draws += 1;
        opponentStats.draws += 1;
        challengerVsOpponent.draws += 1;
        opponentVsChallenger.draws += 1;
        continue;
      }

      if (duel.winnerUserId === duel.challengerId) {
        challengerStats.wins += 1;
        opponentStats.losses += 1;
        challengerVsOpponent.wins += 1;
        opponentVsChallenger.losses += 1;
        challengerStats.currentWinStreak += 1;
        challengerStats.bestWinStreak = Math.max(
          challengerStats.bestWinStreak,
          challengerStats.currentWinStreak
        );
        opponentStats.currentWinStreak = 0;
        recordWinningDuel(duel.challengerId, duel.id);
        continue;
      }

      if (duel.winnerUserId === duel.opponentId) {
        opponentStats.wins += 1;
        challengerStats.losses += 1;
        opponentVsChallenger.wins += 1;
        challengerVsOpponent.losses += 1;
        opponentStats.currentWinStreak += 1;
        opponentStats.bestWinStreak = Math.max(
          opponentStats.bestWinStreak,
          opponentStats.currentWinStreak
        );
        challengerStats.currentWinStreak = 0;
        recordWinningDuel(duel.opponentId, duel.id);
      }
    }

    const updates: Array<{
      userId: string;
      wins: number;
      losses: number;
      draws: number;
      categoryStats: Record<string, unknown>;
      opponents: Record<string, unknown>;
      winStreak: number;
      bestWinStreak: number;
    }> = [];
    const updatedPreview: Array<{ name: string; wins: number; losses: number; draws: number }> = [];

    for (const user of users) {
      const existing = existingStatsByUserId.get(user.id);
      const computed = computedStatsByUserId.get(user.id);

      const existingWins = Number(existing?.wins ?? 0);
      const existingLosses = Number(existing?.losses ?? 0);
      const existingDraws = Number(existing?.draws ?? 0);
      const existingWinStreak = Number(existing?.winStreak ?? 0);
      const existingBestWinStreak = Number(existing?.bestWinStreak ?? 0);

      const nextWins = Math.max(existingWins, computed?.wins ?? 0);
      const nextLosses = Math.max(existingLosses, computed?.losses ?? 0);
      const nextDraws = Math.max(existingDraws, computed?.draws ?? 0);
      const nextWinStreak = Math.max(existingWinStreak, computed?.currentWinStreak ?? 0);
      const nextBestWinStreak = Math.max(existingBestWinStreak, computed?.bestWinStreak ?? 0);
      const nextOpponents = this.mergeOpponentStatsByMax(existing?.opponents, computed?.opponents ?? {});
      const nextCategoryStats = this.asObject(existing?.categoryStats);

      // Sync quizWins XP to reflect repaired win count — quizWins XP is
      // always (wins × QUIZ_WIN_XP) by construction, so if wins went up
      // from the repair, XP must follow. Also mark all winning duels in
      // awardedEvents so live duel completions can't double-award.
      const winningDuelIds = winningDuelIdsByUser.get(user.id) ?? [];
      const existingMeta = getXpMetaFromCategoryStats(nextCategoryStats);
      const targetQuizWinsXp = nextWins * QUIZ_WIN_XP;
      const xpNeedsUpdate = (existingMeta.breakdown.quizWins || 0) !== targetQuizWinsXp
        || winningDuelIds.some((duelId) => !existingMeta.awardedEvents[`quiz_win_${duelId}_${user.id}`]);

      if (xpNeedsUpdate) {
        const nextBreakdown = { ...existingMeta.breakdown, quizWins: targetQuizWinsXp };
        const nextAwardedEvents = { ...existingMeta.awardedEvents };
        const now = Date.now();
        winningDuelIds.forEach((duelId) => {
          const key = `quiz_win_${duelId}_${user.id}`;
          if (!nextAwardedEvents[key]) {
            nextAwardedEvents[key] = now;
          }
        });
        const nextTotalXp = Object.values(nextBreakdown).reduce((sum, v) => sum + (Number(v) || 0), 0);
        nextCategoryStats[USER_STATS_XP_META_KEY] = {
          totalXp: nextTotalXp,
          breakdown: nextBreakdown,
          awardedEvents: nextAwardedEvents
        };
      }

      const totalsChanged = (
        nextWins !== existingWins
        || nextLosses !== existingLosses
        || nextDraws !== existingDraws
        || nextWinStreak !== existingWinStreak
        || nextBestWinStreak !== existingBestWinStreak
      );
      const opponentsChanged = JSON.stringify(this.asObject(existing?.opponents)) !== JSON.stringify(nextOpponents);

      if (!existing && nextWins === 0 && nextLosses === 0 && nextDraws === 0 && nextWinStreak === 0
        && nextBestWinStreak === 0 && Object.keys(nextOpponents).length === 0) {
        continue;
      }

      if (existing && !totalsChanged && !opponentsChanged && !xpNeedsUpdate) {
        continue;
      }

      updates.push({
        userId: user.id,
        wins: nextWins,
        losses: nextLosses,
        draws: nextDraws,
        categoryStats: nextCategoryStats,
        opponents: nextOpponents,
        winStreak: nextWinStreak,
        bestWinStreak: nextBestWinStreak
      });

      if (updatedPreview.length < 10) {
        updatedPreview.push({
          name: user.displayName,
          wins: nextWins,
          losses: nextLosses,
          draws: nextDraws
        });
      }
    }

    for (let index = 0; index < updates.length; index += 100) {
      const chunk = updates.slice(index, index + 100);
      await this.prisma.$transaction(
        chunk.map((entry) => this.prisma.userStats.upsert({
          where: {
            userId: entry.userId
          },
          update: {
            wins: entry.wins,
            losses: entry.losses,
            draws: entry.draws,
            categoryStats: toJsonObject(entry.categoryStats),
            opponents: toJsonObject(entry.opponents),
            winStreak: entry.winStreak,
            bestWinStreak: entry.bestWinStreak
          },
          create: {
            userId: entry.userId,
            wins: entry.wins,
            losses: entry.losses,
            draws: entry.draws,
            categoryStats: toJsonObject(entry.categoryStats),
            opponents: toJsonObject(entry.opponents),
            winStreak: entry.winStreak,
            bestWinStreak: entry.bestWinStreak
          }
        }))
      );
    }

    await this.auditLogService.write({
      action: 'user-stats.quiz_repaired',
      entityType: 'UserStats',
      entityId: null,
      actorUserId: actor.id,
      metadata: {
        scannedUsers: users.length,
        scannedCompletedDuels: completedDuels.length,
        updatedUsers: updates.length,
        unchangedUsers: Math.max(0, users.length - updates.length),
        skippedDuelsMissingUsers,
        updatedPreview
      },
      request
    });

    return {
      ok: true,
      scannedUsers: users.length,
      scannedCompletedDuels: completedDuels.length,
      updatedUsers: updates.length,
      unchangedUsers: Math.max(0, users.length - updates.length),
      skippedDuelsMissingUsers,
      updatedPreview
    };
  }

  private async getOrCreateStatsRow(userId: string) {
    return this.prisma.userStats.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        wins: 0,
        losses: 0,
        draws: 0,
        categoryStats: toJsonObject({}),
        opponents: toJsonObject({}),
        winStreak: 0,
        bestWinStreak: 0
      },
      select: userStatsSelect
    });
  }

  private normalizeStats(record: UserStatsRecord | null | undefined): UserStatsShape {
    return ensureUserStatsStructure(record ? {
      wins: record.wins,
      losses: record.losses,
      draws: record.draws,
      categoryStats: this.asObject(record.categoryStats),
      opponents: this.asObject(record.opponents),
      winStreak: record.winStreak,
      bestWinStreak: record.bestWinStreak
    } : createEmptyUserStats());
  }

  private toPayload(record: UserStatsRecord | null | undefined) {
    return this.toSerializableStats(this.normalizeStats(record));
  }

  private toSerializableStats(stats: UserStatsShape) {
    const xpMeta = getXpMetaFromCategoryStats(stats.categoryStats);
    return {
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      categoryStats: stats.categoryStats,
      opponents: stats.opponents,
      winStreak: stats.winStreak,
      bestWinStreak: stats.bestWinStreak,
      totalXp: xpMeta.totalXp,
      xpBreakdown: xpMeta.breakdown
    };
  }

  private asObject(value: unknown) {
    return value && typeof value === 'object' && !Array.isArray(value)
      ? { ...(value as Record<string, unknown>) }
      : {};
  }

  private mergeOpponentStatsByMax(existingInput: unknown, computedInput: Record<string, unknown>) {
    const merged = this.asObject(existingInput);

    for (const [opponentName, computedValue] of Object.entries(this.asObject(computedInput))) {
      const existingValue = this.asObject(merged[opponentName]);
      const nextValue = this.asObject(computedValue);

      merged[opponentName] = {
        wins: Math.max(Number(existingValue.wins ?? 0), Number(nextValue.wins ?? 0)),
        losses: Math.max(Number(existingValue.losses ?? 0), Number(nextValue.losses ?? 0)),
        draws: Math.max(Number(existingValue.draws ?? 0), Number(nextValue.draws ?? 0))
      };
    }

    return merged;
  }

  private isStaff(role: AppRole) {
    return role === AppRole.ADMIN || role === AppRole.AUSBILDER;
  }
}
