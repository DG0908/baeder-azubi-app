// ========== Numeric helpers ==========
export const toSafeInt = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
};

export const getFirstSafeInt = (...values) => {
  for (const value of values) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.round(parsed));
    }
  }
  return null;
};

// ========== Name / text normalization ==========
export const normalizePlayerName = (name) => {
  const base = String(name || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return base;
};

export const namesMatch = (a, b) => {
  const na = normalizePlayerName(a);
  const nb = normalizePlayerName(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
};

export const isFinishedGameStatus = (status) => {
  const normalized = String(status || '').trim().toLowerCase();
  return normalized === 'finished' || normalized === 'completed' || normalized === 'done';
};

// ========== Shuffle ==========
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ========== Challenge timeout helpers ==========
export const DIFFICULTY_SETTINGS = {
  anfaenger: { time: 45, label: 'Anfänger', icon: '🟢', color: 'bg-green-500' },
  profi: { time: 30, label: 'Profi', icon: '🟡', color: 'bg-yellow-500' },
  experte: { time: 15, label: 'Experte', icon: '🔴', color: 'bg-red-500' },
  extra: { time: 75, label: 'Extra schwer', icon: '🧠', color: 'bg-indigo-700' }
};

export const DEFAULT_CHALLENGE_TIMEOUT_MINUTES = 48 * 60;
export const CHALLENGE_TIMEOUT_BOUNDS = { min: 15, max: 7 * 24 * 60 };

export const normalizeChallengeTimeoutMinutes = (value) => {
  const parsed = toSafeInt(value);
  if (!parsed) return DEFAULT_CHALLENGE_TIMEOUT_MINUTES;
  return Math.min(
    CHALLENGE_TIMEOUT_BOUNDS.max,
    Math.max(CHALLENGE_TIMEOUT_BOUNDS.min, parsed)
  );
};

export const parseTimestampSafe = (value) => {
  if (!value) return null;
  const date = new Date(value);
  const timestamp = date.getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
};

export const getChallengeTimeoutMs = (gameInput) => {
  const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
  const timeoutMinutes = normalizeChallengeTimeoutMinutes(game.challengeTimeoutMinutes);
  return timeoutMinutes * 60 * 1000;
};

export const getChallengeExpiryTimestamp = (gameInput) => {
  const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
  const explicitExpiry = parseTimestampSafe(game.challengeExpiresAt);
  if (explicitExpiry !== null) return explicitExpiry;

  const createdAt = parseTimestampSafe(game.createdAt);
  if (createdAt !== null) return createdAt + getChallengeTimeoutMs(game);

  const updatedAt = parseTimestampSafe(game.updatedAt);
  if (updatedAt !== null) return updatedAt + getChallengeTimeoutMs(game);

  return null;
};

export const getWaitingChallengeRemainingMs = (gameInput, nowInput = Date.now()) => {
  const expiryTs = getChallengeExpiryTimestamp(gameInput);
  if (expiryTs === null) return Number.POSITIVE_INFINITY;
  return expiryTs - nowInput;
};

export const isWaitingChallengeExpired = (gameInput, nowInput = Date.now()) => {
  const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
  if (String(game.status || '').toLowerCase() !== 'waiting') return false;
  return getWaitingChallengeRemainingMs(game, nowInput) <= 0;
};

export const formatDurationMinutesCompact = (minutesInput) => {
  const minutes = Math.max(1, toSafeInt(minutesInput));
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  if (days > 0) {
    if (hours > 0) return `${days}d ${hours}h`;
    return `${days}d`;
  }
  if (hours > 0) {
    if (mins > 0) return `${hours}h ${mins}m`;
    return `${hours}h`;
  }
  return `${mins}m`;
};

export const parseDateSafe = (value) => {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getSwimMonthKey = (dateInput = new Date()) => {
  const date = parseDateSafe(dateInput);
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const isDateInSwimMonth = (dateInput, monthKey) => {
  const date = parseDateSafe(dateInput);
  if (!date) return false;
  return getSwimMonthKey(date) === String(monthKey || '');
};

// ========== XP constants + helpers ==========
export const XP_META_KEY = '__meta';
export const XP_BREAKDOWN_DEFAULT = {
  examSimulator: 0,
  practicalExam: 0,
  flashcardLearning: 0,
  flashcardCreation: 0,
  quizWins: 0,
  swimTrainingPlans: 0
};

export const XP_REWARDS = {
  QUIZ_WIN: 40,
  EXAM_COMPLETION: 20,
  EXAM_PASS_BONUS: 15,
  EXAM_CORRECT_ANSWER: 1,
  FLASHCARD_REVIEW: 1,
  FLASHCARD_CREATE: 15
};

export const getXpMetaFromCategoryStats = (categoryStats) => {
  const safeCategoryStats = (categoryStats && typeof categoryStats === 'object') ? categoryStats : {};
  const rawMeta = (safeCategoryStats[XP_META_KEY] && typeof safeCategoryStats[XP_META_KEY] === 'object')
    ? safeCategoryStats[XP_META_KEY]
    : {};
  const rawBreakdown = (rawMeta.breakdown && typeof rawMeta.breakdown === 'object')
    ? rawMeta.breakdown
    : {};
  const rawAwardedEvents = (rawMeta.awardedEvents && typeof rawMeta.awardedEvents === 'object')
    ? rawMeta.awardedEvents
    : {};
  const normalizedBreakdown = {
    ...XP_BREAKDOWN_DEFAULT,
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

  return {
    totalXp: explicitTotalXp === null
      ? breakdownTotal
      : (explicitTotalXp === 0 && breakdownTotal > 0 ? breakdownTotal : explicitTotalXp),
    breakdown: normalizedBreakdown,
    awardedEvents: rawAwardedEvents
  };
};

// ========== User stats helpers ==========
export const createEmptyUserStats = () => ({
  wins: 0,
  losses: 0,
  draws: 0,
  categoryStats: {},
  opponents: {},
  winStreak: 0,
  bestWinStreak: 0
});

export const ensureUserStatsStructure = (statsInput) => {
  const base = {
    ...createEmptyUserStats(),
    ...(statsInput || {})
  };

  const safeCategoryStats = (base.categoryStats && typeof base.categoryStats === 'object')
    ? { ...base.categoryStats }
    : {};
  const safeOpponents = (base.opponents && typeof base.opponents === 'object')
    ? { ...base.opponents }
    : {};

  const xpMeta = getXpMetaFromCategoryStats(safeCategoryStats);
  safeCategoryStats[XP_META_KEY] = xpMeta;

  return {
    ...base,
    wins: toSafeInt(base.wins),
    losses: toSafeInt(base.losses),
    draws: toSafeInt(base.draws),
    categoryStats: safeCategoryStats,
    opponents: safeOpponents,
    winStreak: toSafeInt(base.winStreak),
    bestWinStreak: toSafeInt(base.bestWinStreak)
  };
};

export const buildUserStatsFromRow = (row) => ensureUserStatsStructure(row ? {
  wins: row.wins || 0,
  losses: row.losses || 0,
  draws: row.draws || 0,
  categoryStats: row.categoryStats || row.category_stats || {},
  opponents: row.opponents || {},
  winStreak: row.winStreak ?? row.win_streak ?? 0,
  bestWinStreak: row.bestWinStreak ?? row.best_win_streak ?? 0
} : createEmptyUserStats());

export const getResolvedGameScores = (gameInput) => {
  const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
  return {
    player1Score: getFirstSafeInt(game.player1Score, game.player1_score, game.challengerScore) ?? 0,
    player2Score: getFirstSafeInt(game.player2Score, game.player2_score, game.duelOpponentScore) ?? 0
  };
};

export const resolveFinishedGameWinner = (gameInput) => {
  const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
  if (game.winner) {
    return game.winner;
  }

  const { player1Score, player2Score } = getResolvedGameScores(game);
  if (player1Score > player2Score) return game.player1 || null;
  if (player2Score > player1Score) return game.player2 || null;
  return null;
};

export const hasRecordedRoundAnswers = (roundInput, answerKey) => {
  const round = (roundInput && typeof roundInput === 'object') ? roundInput : {};
  return Array.isArray(round[answerKey]) && round[answerKey].length > 0;
};

export const isCountableFinishedQuizGame = (gameInput) => {
  const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
  if (!isFinishedGameStatus(game.status)) return false;

  const rounds = Array.isArray(game.categoryRounds) ? game.categoryRounds : [];
  if (rounds.length === 0) return false;

  return rounds.every((round) => (
    hasRecordedRoundAnswers(round, 'player1Answers')
    && hasRecordedRoundAnswers(round, 'player2Answers')
  ));
};

export const buildQuizTotalsFromFinishedGames = (gamesInput, currentUserName, existingStats = null) => {
  const baseStats = ensureUserStatsStructure(existingStats || createEmptyUserStats());
  const finishedGames = Array.isArray(gamesInput) ? gamesInput : [];
  const normalizedUserName = normalizePlayerName(currentUserName);
  let wins = 0;
  let losses = 0;
  let draws = 0;
  const opponents = {};

  finishedGames.forEach((game) => {
    if (!isCountableFinishedQuizGame(game)) return;

    const player1 = normalizePlayerName(game.player1);
    const player2 = normalizePlayerName(game.player2);
    if (player1 !== normalizedUserName && player2 !== normalizedUserName) return;

    const winner = resolveFinishedGameWinner(game);

    const opponent = player1 === normalizedUserName ? game.player2 : game.player1;
    if (!opponents[opponent]) {
      opponents[opponent] = { wins: 0, losses: 0, draws: 0 };
    }

    if (normalizePlayerName(winner) === normalizedUserName) {
      wins += 1;
      opponents[opponent].wins += 1;
    } else if (winner === null) {
      draws += 1;
      opponents[opponent].draws += 1;
    } else {
      losses += 1;
      opponents[opponent].losses += 1;
    }
  });

  return {
    ...baseStats,
    wins,
    losses,
    draws,
    opponents
  };
};

export const buildHeadToHeadFromFinishedGames = (gamesInput, currentUserName, opponentName) => {
  const safeOpponentName = String(opponentName || '').trim();
  if (!currentUserName || !safeOpponentName) {
    return { wins: 0, losses: 0, draws: 0 };
  }

  const finishedGames = Array.isArray(gamesInput) ? gamesInput : [];
  const normalizedUserName = normalizePlayerName(currentUserName);
  const normalizedOpponentName = normalizePlayerName(safeOpponentName);
  let wins = 0;
  let losses = 0;
  let draws = 0;

  finishedGames.forEach((game) => {
    if (!isCountableFinishedQuizGame(game)) return;

    const player1 = normalizePlayerName(game.player1);
    const player2 = normalizePlayerName(game.player2);
    const hasCurrentUser = player1 === normalizedUserName || player2 === normalizedUserName;
    const hasOpponent = player1 === normalizedOpponentName || player2 === normalizedOpponentName;
    if (!hasCurrentUser || !hasOpponent) return;

    const winner = resolveFinishedGameWinner(game);
    const normalizedWinner = normalizePlayerName(winner);
    if (!normalizedWinner) {
      draws += 1;
    } else if (normalizedWinner === normalizedUserName) {
      wins += 1;
    } else {
      losses += 1;
    }
  });

  return { wins, losses, draws };
};

export const haveQuizTotalsChanged = (currentStatsInput, syncedStatsInput) => {
  const currentStats = ensureUserStatsStructure(currentStatsInput || createEmptyUserStats());
  const syncedStats = ensureUserStatsStructure(syncedStatsInput || createEmptyUserStats());
  if (
    currentStats.wins !== syncedStats.wins
    || currentStats.losses !== syncedStats.losses
    || currentStats.draws !== syncedStats.draws
  ) {
    return true;
  }

  const currentOpponents = currentStats.opponents || {};
  const syncedOpponents = syncedStats.opponents || {};
  const opponentNames = new Set([
    ...Object.keys(currentOpponents),
    ...Object.keys(syncedOpponents)
  ]);

  for (const opponentName of opponentNames) {
    const currentOpponent = currentOpponents[opponentName] || {};
    const syncedOpponent = syncedOpponents[opponentName] || {};
    if (
      toSafeInt(currentOpponent.wins) !== toSafeInt(syncedOpponent.wins)
      || toSafeInt(currentOpponent.losses) !== toSafeInt(syncedOpponent.losses)
      || toSafeInt(currentOpponent.draws) !== toSafeInt(syncedOpponent.draws)
    ) {
      return true;
    }
  }

  return false;
};

export const syncQuizTotalsIntoStats = (statsInput, gamesInput, currentUserName) => {
  const stats = ensureUserStatsStructure(statsInput || createEmptyUserStats());
  const syncedQuizStats = buildQuizTotalsFromFinishedGames(gamesInput, currentUserName, stats);
  if (!haveQuizTotalsChanged(stats, syncedQuizStats)) {
    return stats;
  }

  return ensureUserStatsStructure({
    ...stats,
    wins: syncedQuizStats.wins,
    losses: syncedQuizStats.losses,
    draws: syncedQuizStats.draws,
    opponents: syncedQuizStats.opponents
  });
};

export const mergeOpponentStatsByMax = (storedOpponentsInput, syncedOpponentsInput) => {
  const storedOpponents = (storedOpponentsInput && typeof storedOpponentsInput === 'object')
    ? storedOpponentsInput
    : {};
  const syncedOpponents = (syncedOpponentsInput && typeof syncedOpponentsInput === 'object')
    ? syncedOpponentsInput
    : {};
  const merged = { ...storedOpponents };

  Object.entries(syncedOpponents).forEach(([opponentName, syncedValues]) => {
    const storedValues = merged[opponentName] || {};
    merged[opponentName] = {
      wins: Math.max(toSafeInt(storedValues.wins), toSafeInt(syncedValues?.wins)),
      losses: Math.max(toSafeInt(storedValues.losses), toSafeInt(syncedValues?.losses)),
      draws: Math.max(toSafeInt(storedValues.draws), toSafeInt(syncedValues?.draws))
    };
  });

  return merged;
};

export const doesUserStatsRowNeedRepair = (row, normalizedStats) => {
  if (!row) return false;
  const rawCategoryStats = (row.category_stats && typeof row.category_stats === 'object')
    ? row.category_stats
    : {};
  const rawMeta = (rawCategoryStats[XP_META_KEY] && typeof rawCategoryStats[XP_META_KEY] === 'object')
    ? rawCategoryStats[XP_META_KEY]
    : null;
  const rawBreakdown = (rawMeta?.breakdown && typeof rawMeta.breakdown === 'object')
    ? rawMeta.breakdown
    : null;
  const normalizedMeta = getXpMetaFromCategoryStats(normalizedStats?.categoryStats || {});
  const rawTotalXp = getFirstSafeInt(
    rawMeta?.totalXp,
    rawMeta?.total_xp,
    rawMeta?.xp,
    rawMeta?.total,
    rawCategoryStats.totalXp,
    rawCategoryStats.total_xp,
    rawCategoryStats.xp
  );

  if (!rawMeta || !rawBreakdown) return true;
  if (rawMeta.awardedEvents !== undefined && (rawMeta.awardedEvents === null || typeof rawMeta.awardedEvents !== 'object')) {
    return true;
  }
  if (rawTotalXp === null && normalizedMeta.totalXp > 0) {
    return true;
  }

  return Object.keys(XP_BREAKDOWN_DEFAULT).some((key) => (
    rawBreakdown[key] === undefined
    && rawMeta[key] === undefined
    && normalizedMeta.breakdown[key] > 0
  ));
};

export const getTotalXpFromStats = (statsInput) => {
  const safeStats = ensureUserStatsStructure(statsInput);
  return getXpMetaFromCategoryStats(safeStats.categoryStats).totalXp;
};

export const getXpBreakdownFromStats = (statsInput) => {
  const safeStats = ensureUserStatsStructure(statsInput);
  return getXpMetaFromCategoryStats(safeStats.categoryStats).breakdown;
};

export const addXpToStats = (statsInput, sourceKey, amount, eventKey = null) => {
  const xpToAdd = toSafeInt(amount);
  const safeStats = ensureUserStatsStructure(statsInput);
  if (xpToAdd <= 0) {
    return { stats: safeStats, addedXp: 0 };
  }

  const safeCategoryStats = { ...(safeStats.categoryStats || {}) };
  const xpMeta = getXpMetaFromCategoryStats(safeCategoryStats);

  if (eventKey && xpMeta.awardedEvents[eventKey]) {
    return { stats: safeStats, addedXp: 0 };
  }

  xpMeta.totalXp += xpToAdd;
  xpMeta.breakdown[sourceKey] = toSafeInt(xpMeta.breakdown[sourceKey]) + xpToAdd;
  if (eventKey) {
    xpMeta.awardedEvents[eventKey] = Date.now();
  }

  safeCategoryStats[XP_META_KEY] = xpMeta;

  return {
    stats: {
      ...safeStats,
      categoryStats: safeCategoryStats
    },
    addedXp: xpToAdd
  };
};

export const deductXpFromStats = (statsInput, amount) => {
  const xpToDeduct = Math.max(0, Math.round(amount));
  const safeStats = ensureUserStatsStructure(statsInput);
  if (xpToDeduct === 0) return { stats: safeStats, deductedXp: 0 };
  const safeCategoryStats = { ...(safeStats.categoryStats || {}) };
  const xpMeta = getXpMetaFromCategoryStats(safeCategoryStats);
  const actualDeduction = Math.min(xpToDeduct, xpMeta.totalXp);
  if (actualDeduction === 0) return { stats: safeStats, deductedXp: 0 };
  xpMeta.totalXp -= actualDeduction;
  safeCategoryStats[XP_META_KEY] = xpMeta;
  return { stats: { ...safeStats, categoryStats: safeCategoryStats }, deductedXp: actualDeduction };
};

// ========== Keyword / text evaluation ==========
export const normalizeKeywordText = (value) => String(value || '')
  .toLowerCase()
  .replace(/ß/g, 'ss')
  .replace(/ä/g, 'ae')
  .replace(/ö/g, 'oe')
  .replace(/ü/g, 'ue')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const getWordVariants = (normalizedWord) => {
  const variants = [normalizedWord];
  const addVariant = (candidate) => {
    if (candidate && !variants.includes(candidate)) {
      variants.push(candidate);
    }
  };

  addVariant(
    normalizedWord
      .replace(/ae/g, 'a')
      .replace(/oe/g, 'o')
      .replace(/ue/g, 'u')
  );

  if (normalizedWord.endsWith('en') && normalizedWord.length - 2 >= 4) {
    const stem = normalizedWord.slice(0, -2);
    addVariant(stem);
    if (stem.endsWith('e') && stem.length - 1 >= 4) {
      addVariant(stem.slice(0, -1));
    }
  } else if (normalizedWord.endsWith('e') && normalizedWord.length - 1 >= 4) {
    addVariant(normalizedWord.slice(0, -1));
  } else if (normalizedWord.endsWith('s') && normalizedWord.length - 1 >= 4) {
    addVariant(normalizedWord.slice(0, -1));
  }
  return variants;
};

export const tokenizeKeywordText = (value) => normalizeKeywordText(value)
  .split(' ')
  .map((token) => token.trim())
  .filter(Boolean);

export const buildKeywordTokenVariants = (value) => {
  const variants = new Set();
  tokenizeKeywordText(value).forEach((token) => {
    getWordVariants(token).forEach((variant) => {
      if (variant) variants.add(variant);
    });
  });
  return variants;
};

export const matchesKeywordTerm = (normalizedAnswer, answerVariantTokens, term) => {
  const normalizedTerm = normalizeKeywordText(term);
  if (!normalizedTerm) return false;
  if (normalizedAnswer.includes(normalizedTerm)) return true;

  const termTokens = tokenizeKeywordText(normalizedTerm);
  if (termTokens.length === 0) return false;

  return termTokens.every((token) => {
    const tokenVariants = getWordVariants(token);
    return tokenVariants.some((variant) => {
      if (!variant) return false;
      if (answerVariantTokens.has(variant)) return true;
      return Array.from(answerVariantTokens).some((answerToken) => {
        if (answerToken.startsWith(variant)) return true;
        return answerToken.length >= 4
          && answerToken.length >= variant.length - 2
          && variant.startsWith(answerToken);
      });
    });
  });
};

export const normalizeKeywordGroup = (groupInput) => {
  if (typeof groupInput === 'string') {
    return {
      label: groupInput,
      terms: [groupInput]
    };
  }

  if (Array.isArray(groupInput)) {
    const terms = groupInput
      .map((term) => String(term || '').trim())
      .filter(Boolean);
    return {
      label: terms[0] || 'Schlagwort',
      terms
    };
  }

  if (groupInput && typeof groupInput === 'object') {
    const label = String(groupInput.label || groupInput.name || '').trim();
    const terms = Array.isArray(groupInput.terms)
      ? groupInput.terms.map((term) => String(term || '').trim()).filter(Boolean)
      : [];
    return {
      label: label || terms[0] || 'Schlagwort',
      terms
    };
  }

  return { label: 'Schlagwort', terms: [] };
};

export const getKeywordGroupsFromQuestion = (question) => {
  if (!question || !Array.isArray(question.keywordGroups)) return [];
  return question.keywordGroups
    .map(normalizeKeywordGroup)
    .filter((group) => group.terms.length > 0)
    .map((group) => ({
      ...group,
      normalizedTerms: [...new Set(group.terms.map((term) => normalizeKeywordText(term)).filter(Boolean))]
    }))
    .filter((group) => group.normalizedTerms.length > 0);
};

export const isKeywordQuestion = (question) => {
  return Boolean(question?.type === 'keyword' && getKeywordGroupsFromQuestion(question).length > 0);
};

export const isWhoAmIQuestion = (question) => {
  return Boolean(question?.type === 'whoami' && Array.isArray(question?.clues) && getKeywordGroupsFromQuestion(question).length > 0);
};

export const evaluateKeywordAnswer = (question, answerInput) => {
  const groups = getKeywordGroupsFromQuestion(question);
  const normalizedAnswer = normalizeKeywordText(answerInput);
  const answerVariantTokens = buildKeywordTokenVariants(answerInput);
  const wordCount = normalizedAnswer ? normalizedAnswer.split(' ').filter(Boolean).length : 0;
  const requiredWordCount = Math.max(0, Number(question?.minWords) || 0);
  const requiredGroups = Math.max(
    1,
    Math.min(groups.length, Number(question?.minKeywordGroups) || groups.length || 1)
  );

  if (!normalizedAnswer) {
    return {
      isCorrect: false,
      hasContent: false,
      requiredGroups,
      matchedCount: 0,
      scorePercent: 0,
      basePoints: 0,
      bonusPoints: 0,
      awardedPoints: 0,
      matchedLabels: [],
      missingLabels: groups.map((group) => group.label),
      wordCount,
      requiredWordCount
    };
  }

  const matchedLabels = [];
  const missingLabels = [];
  groups.forEach((group) => {
    const matched = group.normalizedTerms.some((term) => matchesKeywordTerm(normalizedAnswer, answerVariantTokens, term));
    if (matched) {
      matchedLabels.push(group.label);
    } else {
      missingLabels.push(group.label);
    }
  });

  const matchedCount = matchedLabels.length;
  const hasEnoughWords = wordCount >= requiredWordCount;
  const isCorrect = matchedCount >= requiredGroups && hasEnoughWords;
  const scorePercent = Math.max(0, Math.min(100, Math.round((matchedCount / requiredGroups) * 100)));
  const basePoints = matchedCount;
  const bonusPoints = isCorrect ? 2 : 0;
  const awardedPoints = basePoints + bonusPoints;

  return {
    isCorrect,
    hasContent: true,
    requiredGroups,
    matchedCount,
    scorePercent,
    basePoints,
    bonusPoints,
    awardedPoints,
    matchedLabels,
    missingLabels,
    wordCount,
    requiredWordCount
  };
};

const GERMAN_STOPWORDS = new Set([
  'aber', 'alle', 'allem', 'allen', 'aller', 'alles', 'also', 'auch', 'auf', 'auss',
  'aus', 'ausserdem', 'bei', 'beim', 'bereits', 'dann', 'dabei', 'dadurch', 'damit',
  'darf', 'dass', 'dem', 'den', 'denen', 'denn', 'der', 'des', 'deshalb', 'dessen',
  'dies', 'diese', 'diesem', 'diesen', 'dieser', 'dieses', 'doch', 'dort', 'durch',
  'eine', 'einem', 'einen', 'einer', 'eines', 'erst', 'etwas', 'falls', 'für',
  'gegen', 'gibt', 'haben', 'hatte', 'hatten', 'hier', 'ihnen', 'ihre', 'ihrem',
  'ihren', 'ihrer', 'ihres', 'immer', 'innen', 'jede', 'jedem', 'jeden', 'jeder',
  'jedes', 'jetzt', 'jedoch', 'kann', 'kein', 'keine', 'keinem', 'keinen', 'keiner',
  'keines', 'muss', 'mussen', 'nach', 'nicht', 'noch', 'obwohl', 'ohne', 'oder',
  'oben', 'sein', 'seine', 'seinem', 'seinen', 'seiner', 'seines', 'sehr', 'sich',
  'sind', 'sodass', 'soll', 'sollen', 'sollte', 'sowie', 'sonst', 'uber', 'mehr',
  'viel', 'viele', 'vielen', 'von', 'vor', 'war', 'waren', 'weil', 'wenn', 'werden',
  'wird', 'wobei', 'wodurch', 'wurde', 'wurden', 'wieder', 'zwischen', 'zwar',
  'euro', 'unten', 'aussen', 'schon'
]);

export const autoExtractKeywordGroups = (answerText) => {
  const normalized = normalizeKeywordText(answerText);
  const words = normalized.split(/\s+/).filter(Boolean);
  const seen = new Set();
  const groups = [];
  for (const word of words) {
    if (word.length < 4) continue;
    if (GERMAN_STOPWORDS.has(word)) continue;
    if (seen.has(word)) continue;
    seen.add(word);
    const variants = getWordVariants(word);
    const stem = variants[variants.length - 1];
    const label = stem.charAt(0).toUpperCase() + stem.slice(1);
    groups.push({ label, terms: variants });
  }
  return groups;
};

export const getQuizTimeLimit = (question, difficultyKey) => {
  if (isWhoAmIQuestion(question)) {
    const configuredLimit = Number(question?.timeLimit);
    return Number.isFinite(configuredLimit) && configuredLimit > 0 ? configuredLimit : 60;
  }
  return DIFFICULTY_SETTINGS[difficultyKey]?.time || 30;
};

// ========== Duel game snapshot helpers ==========
export const cloneDuelGameSnapshot = (gameInput) => {
  if (!gameInput || typeof gameInput !== 'object') {
    return gameInput;
  }
  if (typeof structuredClone === 'function') {
    return structuredClone(gameInput);
  }
  return JSON.parse(JSON.stringify(gameInput));
};
