import { Prisma } from '@prisma/client';

export const USER_STATS_XP_META_KEY = '__meta';
export const USER_STATS_XP_BREAKDOWN_DEFAULT = {
  examSimulator: 0,
  practicalExam: 0,
  flashcardLearning: 0,
  flashcardCreation: 0,
  quizWins: 0,
  swimTrainingPlans: 0
} as const;

type XpBreakdownKey = keyof typeof USER_STATS_XP_BREAKDOWN_DEFAULT;
type XpBreakdown = Record<XpBreakdownKey, number>;

export type UserStatsShape = {
  wins: number;
  losses: number;
  draws: number;
  categoryStats: Record<string, unknown>;
  opponents: Record<string, unknown>;
  winStreak: number;
  bestWinStreak: number;
};

type XpMeta = {
  totalXp: number;
  breakdown: XpBreakdown;
  awardedEvents: Record<string, number>;
};

export const createEmptyUserStats = (): UserStatsShape => ({
  wins: 0,
  losses: 0,
  draws: 0,
  categoryStats: {},
  opponents: {},
  winStreak: 0,
  bestWinStreak: 0
});

export const toSafeInt = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
};

const getFirstSafeInt = (...values: unknown[]) => {
  for (const value of values) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.round(parsed));
    }
  }

  return null;
};

const asObject = (value: unknown): Record<string, unknown> => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? { ...(value as Record<string, unknown>) }
    : {}
);

export const getXpMetaFromCategoryStats = (categoryStatsInput: unknown): XpMeta => {
  const safeCategoryStats = asObject(categoryStatsInput);
  const rawMeta = asObject(safeCategoryStats[USER_STATS_XP_META_KEY]);
  const rawBreakdown = asObject(rawMeta.breakdown);
  const rawAwardedEvents = asObject(rawMeta.awardedEvents);

  const normalizedBreakdown: XpBreakdown = {
    examSimulator: getFirstSafeInt(rawBreakdown.examSimulator, rawMeta.examSimulator) ?? 0,
    practicalExam: getFirstSafeInt(rawBreakdown.practicalExam, rawMeta.practicalExam) ?? 0,
    flashcardLearning: getFirstSafeInt(rawBreakdown.flashcardLearning, rawMeta.flashcardLearning) ?? 0,
    flashcardCreation: getFirstSafeInt(rawBreakdown.flashcardCreation, rawMeta.flashcardCreation) ?? 0,
    quizWins: getFirstSafeInt(rawBreakdown.quizWins, rawMeta.quizWins) ?? 0,
    swimTrainingPlans: getFirstSafeInt(rawBreakdown.swimTrainingPlans, rawMeta.swimTrainingPlans) ?? 0
  };

  const breakdownTotal = Object.values(normalizedBreakdown).reduce((sum, value) => sum + toSafeInt(value), 0);
  const explicitTotalXp = getFirstSafeInt(
    rawMeta.totalXp,
    rawMeta.total_xp,
    rawMeta.xp,
    rawMeta.total,
    safeCategoryStats.totalXp,
    safeCategoryStats.total_xp,
    safeCategoryStats.xp
  );

  const awardedEvents: Record<string, number> = {};
  Object.entries(rawAwardedEvents).forEach(([key, value]) => {
    const normalized = getFirstSafeInt(value);
    if (!key || normalized === null) {
      return;
    }

    awardedEvents[key] = normalized;
  });

  return {
    totalXp: explicitTotalXp === null
      ? breakdownTotal
      : (explicitTotalXp === 0 && breakdownTotal > 0 ? breakdownTotal : explicitTotalXp),
    breakdown: normalizedBreakdown,
    awardedEvents
  };
};

export const ensureUserStatsStructure = (statsInput: Partial<UserStatsShape> | null | undefined): UserStatsShape => {
  const base = {
    ...createEmptyUserStats(),
    ...(statsInput || {})
  };

  const categoryStats = asObject(base.categoryStats);
  const opponents = asObject(base.opponents);
  categoryStats[USER_STATS_XP_META_KEY] = getXpMetaFromCategoryStats(categoryStats);

  return {
    wins: toSafeInt(base.wins),
    losses: toSafeInt(base.losses),
    draws: toSafeInt(base.draws),
    categoryStats,
    opponents,
    winStreak: toSafeInt(base.winStreak),
    bestWinStreak: toSafeInt(base.bestWinStreak)
  };
};

export const addXpToStats = (
  statsInput: Partial<UserStatsShape> | null | undefined,
  sourceKeyInput: string,
  amount: number,
  eventKey: string | null = null
) => {
  const safeStats = ensureUserStatsStructure(statsInput);
  const sourceKey = String(sourceKeyInput || '').trim() as XpBreakdownKey;
  const xpToAdd = toSafeInt(amount);

  if (!sourceKey || !(sourceKey in USER_STATS_XP_BREAKDOWN_DEFAULT) || xpToAdd <= 0) {
    return { stats: safeStats, addedXp: 0 };
  }

  const categoryStats = asObject(safeStats.categoryStats);
  const xpMeta = getXpMetaFromCategoryStats(categoryStats);
  if (eventKey && xpMeta.awardedEvents[eventKey]) {
    return { stats: safeStats, addedXp: 0 };
  }

  xpMeta.totalXp += xpToAdd;
  xpMeta.breakdown[sourceKey] = toSafeInt(xpMeta.breakdown[sourceKey]) + xpToAdd;
  if (eventKey) {
    xpMeta.awardedEvents[eventKey] = Date.now();
  }

  categoryStats[USER_STATS_XP_META_KEY] = xpMeta;

  return {
    stats: {
      ...safeStats,
      categoryStats
    },
    addedXp: xpToAdd
  };
};

export const toJsonObject = (value: Record<string, unknown>): Prisma.InputJsonValue => (
  value as unknown as Prisma.InputJsonValue
);
