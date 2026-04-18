import { useState, useEffect, useCallback } from 'react';
import {
  loadSwimSessionEntries as dsLoadSwimSessions,
  saveSwimSessionEntry as dsSaveSwimSession,
  confirmSwimSessionEntry as dsConfirmSwimSession,
  rejectSwimSessionEntry as dsRejectSwimSession,
  withdrawSwimSessionEntry as dsWithdrawSwimSession,
  loadCustomSwimTrainingPlanEntries as dsLoadCustomSwimPlans,
  createCustomSwimTrainingPlanEntry as dsCreateCustomSwimPlan,
  loadSwimMonthlyResultEntries as dsLoadSwimMonthlyResults,
  upsertSwimMonthlyResultEntry as dsUpsertSwimMonthlyResult,
  getAuthorizedReviewers as dsGetAuthorizedReviewers,
} from '../lib/dataService';
import {
  SWIM_STYLES,
  SWIM_TRAINING_PLANS,
  calculateTeamBattleStats,
} from '../data/swimming';
import {
  toSafeInt,
  parseDateSafe,
  getSwimMonthKey,
  isDateInSwimMonth,
} from '../lib/quizHelpers';

export const SWIM_BATTLE_WIN_POINTS = 20;

export const SWIM_ARENA_DISCIPLINES = [
  { id: '25m', label: '25m Sprint' },
  { id: '50m', label: '50m Sprint' },
  { id: '100m', label: '100m Sprint' },
  { id: '200m', label: '200m Mittelstrecke' },
  { id: '400m', label: '400m Ausdauer' },
];

const SEA_CREATURE_TIERS = [
  { minWins: 0, emoji: '🐚', name: 'Muschel' },
  { minWins: 2, emoji: '🪼', name: 'Qualle' },
  { minWins: 4, emoji: '🐢', name: 'Meeresschildkröte' },
  { minWins: 7, emoji: '🐬', name: 'Delfin' },
  { minWins: 10, emoji: '🦑', name: 'Tintenfisch' },
  { minWins: 14, emoji: '🦈', name: 'Hai' },
  { minWins: 18, emoji: '🐋', name: 'Orca' },
];

const ARENA_LOSER_CREATURE = { emoji: '🪼', name: 'Langsame Qualle' };

const SWIM_PLAN_NOTE_TAG_PREFIX = '[SWIM_PLAN:';
const SWIM_PLAN_NOTE_UNIT_TAG_PREFIX = '[SWIM_PLAN_UNIT:';
const SWIM_PLAN_NOTE_TAG_REGEX = /\[SWIM_PLAN:([a-z0-9_-]+)\]/i;
const SWIM_PLAN_NOTE_UNIT_TAG_REGEX = /\[SWIM_PLAN_UNIT:([a-z0-9_-]+)\]/i;

const normalizeSwimTrainingPlanCategory = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (['ausdauer', 'sprint', 'technik', 'kombi'].includes(normalized)) {
    return normalized;
  }
  return 'ausdauer';
};

const normalizeSwimTrainingPlanDifficulty = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (['angenehm', 'fokussiert', 'anspruchsvoll'].includes(normalized)) {
    return normalized;
  }
  return 'fokussiert';
};

const parseSwimTrainingPlanUnitsJson = (unitsInput) => {
  if (Array.isArray(unitsInput)) {
    return unitsInput;
  }
  if (typeof unitsInput === 'string') {
    try {
      const parsed = JSON.parse(unitsInput);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizeSwimTrainingPlanUnit = (unitInput = {}, index = 0) => {
  const unit = (unitInput && typeof unitInput === 'object') ? unitInput : {};
  const requestedId = String(unit.id || unit.unitId || '').trim().toLowerCase();
  const baseId = requestedId.replace(/[^a-z0-9_-]/g, '') || `unit_${index + 1}`;
  const styleId = String(unit.styleId || unit.style_id || 'kraul').trim() || 'kraul';
  const targetDistance = Math.max(100, toSafeInt(unit.targetDistance ?? unit.target_distance));
  const targetTime = Math.max(1, toSafeInt(unit.targetTime ?? unit.target_time));
  return { id: baseId, styleId, targetDistance, targetTime };
};

const normalizeSwimTrainingPlanUnits = (unitsInput, fallbackInput = {}) => {
  const planFallback = (fallbackInput && typeof fallbackInput === 'object') ? fallbackInput : {};
  const parsedUnits = parseSwimTrainingPlanUnitsJson(unitsInput);
  const fallbackUnit = {
    id: 'unit_1',
    styleId: String(planFallback.style_id || planFallback.styleId || 'kraul').trim() || 'kraul',
    targetDistance: Math.max(100, toSafeInt(planFallback.target_distance ?? planFallback.targetDistance)),
    targetTime: Math.max(1, toSafeInt(planFallback.target_time ?? planFallback.targetTime)),
  };
  const sourceUnits = parsedUnits.length > 0 ? parsedUnits : [fallbackUnit];

  const usedIds = new Set();
  return sourceUnits.map((unit, index) => {
    const normalized = normalizeSwimTrainingPlanUnit(unit, index);
    let finalId = normalized.id;
    let suffix = 2;
    while (usedIds.has(finalId)) {
      finalId = `${normalized.id}_${suffix}`;
      suffix += 1;
    }
    usedIds.add(finalId);
    return { ...normalized, id: finalId };
  });
};

const normalizeCustomSwimTrainingPlan = (planRowInput) => {
  const planRow = (planRowInput && typeof planRowInput === 'object') ? planRowInput : {};
  const normalizedUnits = normalizeSwimTrainingPlanUnits(planRow.units_json, planRow);
  const primaryUnit = normalizedUnits[0] || normalizeSwimTrainingPlanUnit({}, 0);
  const normalizedXp = Math.max(1, toSafeInt(planRow.xp_reward));
  return {
    id: String(planRow.id || ''),
    name: String(planRow.name || 'Individueller Plan').trim() || 'Individueller Plan',
    category: normalizeSwimTrainingPlanCategory(planRow.category),
    difficulty: normalizeSwimTrainingPlanDifficulty(planRow.difficulty),
    styleId: primaryUnit.styleId,
    targetDistance: primaryUnit.targetDistance,
    targetTime: primaryUnit.targetTime,
    units: normalizedUnits,
    xpReward: normalizedXp,
    description: String(planRow.description || '').trim(),
    source: 'custom',
    isCustom: true,
    createdByUserId: planRow.created_by_user_id || null,
    createdByName: String(planRow.created_by_name || '').trim(),
    createdByRole: String(planRow.created_by_role || '').trim(),
    assignedUserId: planRow.assigned_user_id || null,
    assignedUserName: String(planRow.assigned_user_name || '').trim(),
    assignedUserRole: String(planRow.assigned_user_role || '').trim(),
    createdAt: planRow.created_at || null,
  };
};

const extractSwimTrainingPlanIdFromNotes = (notesInput) => {
  const notes = String(notesInput || '');
  const match = notes.match(SWIM_PLAN_NOTE_TAG_REGEX);
  return match?.[1] || null;
};

const extractSwimTrainingPlanUnitIdFromNotes = (notesInput) => {
  const notes = String(notesInput || '');
  const match = notes.match(SWIM_PLAN_NOTE_UNIT_TAG_REGEX);
  return match?.[1] || null;
};

const extractSwimTrainingPlanSelectionFromNotes = (notesInput) => ({
  trainingPlanId: extractSwimTrainingPlanIdFromNotes(notesInput),
  trainingPlanUnitId: extractSwimTrainingPlanUnitIdFromNotes(notesInput),
});

const stripSwimTrainingPlanTagFromNotes = (notesInput) => {
  const notes = String(notesInput || '');
  return notes
    .replace(/\s*\[SWIM_PLAN:[^\]]+\]\s*/gi, ' ')
    .replace(/\s*\[SWIM_PLAN_UNIT:[^\]]+\]\s*/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const encodeSwimTrainingPlanInNotes = (notesInput, trainingPlanIdInput, trainingPlanUnitIdInput) => {
  const cleanedNotes = stripSwimTrainingPlanTagFromNotes(notesInput);
  const trainingPlanId = String(trainingPlanIdInput || '').trim();
  const trainingPlanUnitId = String(trainingPlanUnitIdInput || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!trainingPlanId) return cleanedNotes;

  const tags = [`${SWIM_PLAN_NOTE_TAG_PREFIX}${trainingPlanId}]`];
  if (trainingPlanUnitId) {
    tags.push(`${SWIM_PLAN_NOTE_UNIT_TAG_PREFIX}${trainingPlanUnitId}]`);
  }
  return cleanedNotes ? `${cleanedNotes}\n${tags.join('\n')}` : tags.join('\n');
};

const doesSessionFulfillPlanUnit = (sessionInput, planUnitInput) => {
  if (!sessionInput || !planUnitInput) return false;
  const distance = Number(sessionInput.distance || 0);
  const timeMinutes = Number(sessionInput.time_minutes || 0);
  const styleId = String(sessionInput.style || '');
  if (!Number.isFinite(distance) || !Number.isFinite(timeMinutes) || distance <= 0 || timeMinutes <= 0) return false;

  const targetDistance = Number(planUnitInput.targetDistance || 0);
  const targetTime = Number(planUnitInput.targetTime || 0);
  if (!Number.isFinite(targetDistance) || !Number.isFinite(targetTime) || targetDistance <= 0 || targetTime <= 0) return false;

  const styleMatches = !planUnitInput.styleId || String(planUnitInput.styleId) === styleId;
  if (!styleMatches) return false;

  return distance >= targetDistance && timeMinutes <= targetTime;
};

const doesSessionFulfillTrainingPlan = (sessionInput, planInput, requestedUnitIdInput = '') => {
  if (!sessionInput || !planInput) return false;
  const requestedUnitId = String(requestedUnitIdInput || '').trim().toLowerCase();
  const normalizedUnits = normalizeSwimTrainingPlanUnits(planInput.units, planInput);
  if (normalizedUnits.length === 0) return false;
  if (requestedUnitId) {
    const requestedUnit = normalizedUnits.find((u) => u.id === requestedUnitId);
    if (!requestedUnit) return false;
    return doesSessionFulfillPlanUnit(sessionInput, requestedUnit);
  }
  return normalizedUnits.some((unit) => doesSessionFulfillPlanUnit(sessionInput, unit));
};

export function useSwimChallenge({
  user,
  allUsers,
  authReady,
  showToast,
  sendNotification,
}) {
  // ==================== STATE ====================
  const [swimChallengeView, setSwimChallengeView] = useState('overview');
  const [swimSessions, setSwimSessions] = useState([]);
  const [swimSessionsLoaded, setSwimSessionsLoaded] = useState(false);
  const [customSwimTrainingPlans, setCustomSwimTrainingPlans] = useState([]);
  const [activeSwimChallenges, setActiveSwimChallenges] = useState(() => {
    const saved = localStorage.getItem('active_swim_challenges');
    return saved ? JSON.parse(saved) : [];
  });
  const [swimSessionForm, setSwimSessionForm] = useState({
    date: new Date().toISOString().split('T')[0],
    distance: '',
    time: '',
    style: 'kraul',
    notes: '',
    challengeId: '',
    trainingPlanId: '',
    trainingPlanUnitId: '',
  });
  const [pendingSwimConfirmations, setPendingSwimConfirmations] = useState([]);
  const [swimChallengeFilter, setSwimChallengeFilter] = useState('alle');
  const [swimArenaMode, setSwimArenaMode] = useState('duel');
  const [swimBattleHistory, setSwimBattleHistory] = useState(() => {
    const saved = localStorage.getItem('swim_battle_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [swimBattleWinsByUserId, setSwimBattleWinsByUserId] = useState(() => {
    const saved = localStorage.getItem('swim_battle_wins_by_user');
    return saved ? JSON.parse(saved) : {};
  });
  const [swimBattleResult, setSwimBattleResult] = useState(null);
  const [swimMonthlyResults, setSwimMonthlyResults] = useState([]);
  const [swimDuelForm, setSwimDuelForm] = useState({
    discipline: '50m',
    style: 'kraul',
    challengerId: '',
    opponentId: '',
    challengerSeconds: '',
    opponentSeconds: '',
  });
  const [swimBossForm, setSwimBossForm] = useState({
    discipline: '100m',
    style: 'brust',
    trainerId: '',
    azubiIds: [],
    trainerSeconds: '',
    azubiSeconds: '',
  });

  // ==================== ACTIONS ====================

  const saveActiveSwimChallenges = (challenges) => {
    setActiveSwimChallenges(challenges);
    localStorage.setItem('active_swim_challenges', JSON.stringify(challenges));
  };

  const saveSwimBattleHistory = (entries) => {
    const safeEntries = Array.isArray(entries) ? entries.slice(0, 30) : [];
    setSwimBattleHistory(safeEntries);
    localStorage.setItem('swim_battle_history', JSON.stringify(safeEntries));
  };

  const saveSwimBattleWins = (winsByUserId) => {
    const safeWins = (winsByUserId && typeof winsByUserId === 'object') ? winsByUserId : {};
    setSwimBattleWinsByUserId(safeWins);
    localStorage.setItem('swim_battle_wins_by_user', JSON.stringify(safeWins));
  };

  const loadCustomSwimTrainingPlans = async () => {
    if (!user?.id) {
      setCustomSwimTrainingPlans([]);
      return;
    }
    try {
      const data = await dsLoadCustomSwimPlans();
      const normalizedPlans = (Array.isArray(data) ? data : []).map(normalizeCustomSwimTrainingPlan);
      const canManageAllPlans = Boolean(
        user?.permissions?.canViewAllStats
        || user?.role === 'admin'
        || user?.role === 'trainer'
        || user?.role === 'ausbilder'
      );
      const visiblePlans = canManageAllPlans
        ? normalizedPlans
        : normalizedPlans.filter((plan) =>
          plan.assignedUserId === user.id || plan.createdByUserId === user.id
        );
      setCustomSwimTrainingPlans(visiblePlans);
    } catch (err) {
      console.warn('Individuelle Schwimm-Trainingsplaene konnten nicht geladen werden:', err);
      setCustomSwimTrainingPlans([]);
    }
  };

  const createCustomSwimTrainingPlan = async (planInput = {}) => {
    if (!user?.id) {
      return { success: false, error: 'Bitte melde dich erneut an.' };
    }

    if (Array.isArray(planInput.assignToAllCandidates) && planInput.assignToAllCandidates.length > 0) {
      const candidates = planInput.assignToAllCandidates;
      let successCount = 0;
      for (const azubi of candidates) {
        const singleResult = await createCustomSwimTrainingPlan({
          ...planInput,
          assignedUserId: azubi.id,
          assignToAllCandidates: null,
        });
        if (singleResult?.success) successCount++;
      }
      if (successCount === 0) return { success: false, error: 'Kein Plan konnte gespeichert werden.' };
      showToast(`Trainingsplan an ${successCount} Azubi${successCount !== 1 ? 's' : ''} zugewiesen.`, 'success');
      return { success: true };
    }

    const isTrainerLike = Boolean(
      user?.permissions?.canViewAllStats
      || user?.role === 'admin'
      || user?.role === 'trainer'
      || user?.role === 'ausbilder'
    );
    const canSeeAll = user?.permissions?.canManageUsers || user?.role === 'admin';
    const availableAzubis = allUsers.filter((account) => {
      if (!account?.id || String(account.role || '').toLowerCase() !== 'azubi') return false;
      if (!canSeeAll && user?.organizationId) {
        const accountOrgId = account?.organizationId || account?.organization_id || null;
        return accountOrgId === user.organizationId;
      }
      return true;
    });
    const requestedAssignedUserId = String(planInput.assignedUserId || '').trim();
    const fallbackAssignedUserId = isTrainerLike
      ? (availableAzubis[0]?.id || user.id)
      : user.id;
    const assignedUserId = isTrainerLike
      ? (requestedAssignedUserId || fallbackAssignedUserId)
      : user.id;

    const assignedUser =
      allUsers.find((account) => account?.id === assignedUserId)
      || (assignedUserId === user.id ? { id: user.id, name: user.name, role: user.role } : null);

    if (!assignedUserId || !assignedUser) {
      return { success: false, error: 'Zielperson für den Trainingsplan konnte nicht gefunden werden.' };
    }

    const name = String(planInput.name || '').trim();
    if (!name) {
      return { success: false, error: 'Bitte einen Namen für den Trainingsplan angeben.' };
    }

    const category = normalizeSwimTrainingPlanCategory(planInput.category);
    const difficulty = normalizeSwimTrainingPlanDifficulty(planInput.difficulty);
    const normalizedUnits = normalizeSwimTrainingPlanUnits(planInput.units, planInput);
    const primaryUnit = normalizedUnits[0] || normalizeSwimTrainingPlanUnit({}, 0);
    const styleId = primaryUnit.styleId;
    const targetDistance = primaryUnit.targetDistance;
    const targetTime = primaryUnit.targetTime;
    const xpReward = Math.max(1, toSafeInt(planInput.xpReward));
    const description = String(planInput.description || '').trim();

    const insertPayload = {
      created_by_user_id: user.id,
      created_by_name: user.name || 'Unbekannt',
      created_by_role: user.role || 'azubi',
      assigned_user_id: assignedUserId,
      assigned_user_name: assignedUser?.name || 'Unbekannt',
      assigned_user_role: assignedUser?.role || 'azubi',
      name,
      category,
      difficulty,
      style_id: styleId,
      target_distance: targetDistance,
      target_time: targetTime,
      units_json: normalizedUnits.map((unit) => ({
        id: unit.id,
        style_id: unit.styleId,
        target_distance: unit.targetDistance,
        target_time: unit.targetTime,
      })),
      xp_reward: xpReward,
      description,
      is_active: true,
    };

    try {
      const data = await dsCreateCustomSwimPlan(insertPayload);
      const normalized = normalizeCustomSwimTrainingPlan(data);
      setCustomSwimTrainingPlans((prev) => [normalized, ...prev]);

      if (assignedUserId !== user.id && assignedUser?.name) {
        const unitLabel = normalizedUnits.length > 1
          ? `${normalizedUnits.length} Einheiten (Start: ${targetDistance}m in ${targetTime} Min)`
          : `${targetDistance}m in ${targetTime} Min`;
        await sendNotification(
          assignedUser.name,
          '🏊 Neuer Trainingsplan',
          `${user.name} hat dir den Plan "${name}" zugewiesen (${unitLabel}).`,
          'swim_plan'
        );
      }

      return { success: true, data: normalized };
    } catch (err) {
      console.error('Fehler beim Speichern des individuellen Trainingsplans:', err);
      return { success: false, error: err.message || 'Unbekannter Fehler beim Speichern.' };
    }
  };

  const swimTrainingPlans = [
    ...SWIM_TRAINING_PLANS.map((plan) => {
      const normalizedUnits = normalizeSwimTrainingPlanUnits(plan.units, plan);
      const primaryUnit = normalizedUnits[0] || normalizeSwimTrainingPlanUnit({}, 0);
      return {
        ...plan,
        styleId: primaryUnit.styleId,
        targetDistance: primaryUnit.targetDistance,
        targetTime: primaryUnit.targetTime,
        units: normalizedUnits,
        source: 'default',
        isCustom: false,
        createdByUserId: null,
        createdByName: '',
        createdByRole: '',
        assignedUserId: null,
        assignedUserName: '',
        assignedUserRole: '',
        createdAt: null,
      };
    }),
    ...customSwimTrainingPlans,
  ];

  const getSwimTrainingPlanById = (planIdInput) => {
    const planId = String(planIdInput || '').trim();
    if (!planId) return null;
    return swimTrainingPlans.find((plan) => String(plan.id || '') === planId) || null;
  };

  const buildSwimmerDistanceRankingForMonth = useCallback((monthKey) => {
    if (!monthKey) return [];
    const userDirectory = {};
    allUsers.forEach((account) => {
      if (!account?.id) return;
      userDirectory[account.id] = {
        name: account.name || 'Unbekannt',
        role: account.role || 'azubi',
      };
    });

    const totalsByUserId = {};
    swimSessions.forEach((session) => {
      if (!session?.confirmed || !isDateInSwimMonth(session.date, monthKey)) return;
      const userId = session.user_id || '';
      if (!userId) return;
      if (!totalsByUserId[userId]) {
        totalsByUserId[userId] = {
          user_id: userId,
          user_name: session.user_name || userDirectory[userId]?.name || 'Unbekannt',
          user_role: session.user_role || userDirectory[userId]?.role || 'azubi',
          distance: 0,
          time_minutes: 0,
          sessions: 0,
        };
      }
      totalsByUserId[userId].distance += toSafeInt(session.distance);
      totalsByUserId[userId].time_minutes += toSafeInt(session.time_minutes);
      totalsByUserId[userId].sessions += 1;
    });

    return Object.values(totalsByUserId)
      .sort((a, b) =>
        (b.distance - a.distance)
        || (b.sessions - a.sessions)
        || String(a.user_name || '').localeCompare(String(b.user_name || ''), 'de-DE')
      );
  }, [allUsers, swimSessions]);

  const buildSwimMonthlyResultPayload = useCallback((monthDateInput) => {
    const monthDate = parseDateSafe(monthDateInput);
    if (!monthDate) return null;

    const targetDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthKey = getSwimMonthKey(targetDate);
    if (!monthKey) return null;

    const monthSessions = swimSessions.filter((session) => isDateInSwimMonth(session?.date, monthKey));
    const battleStats = calculateTeamBattleStats(monthSessions, {}, allUsers);

    let winnerTeam = 'tie';
    if (battleStats.azubis.points > battleStats.trainer.points) {
      winnerTeam = 'azubis';
    } else if (battleStats.trainer.points > battleStats.azubis.points) {
      winnerTeam = 'trainer';
    }

    const swimmerRanking = buildSwimmerDistanceRankingForMonth(monthKey);
    const swimmerOfMonth = swimmerRanking.find((entry) => toSafeInt(entry.distance) > 0) || null;

    return {
      month_key: monthKey,
      year: targetDate.getFullYear(),
      month: targetDate.getMonth() + 1,
      winner_team: winnerTeam,
      azubis_points: toSafeInt(battleStats.azubis.points),
      trainer_points: toSafeInt(battleStats.trainer.points),
      azubis_distance: toSafeInt(battleStats.azubis.distance),
      trainer_distance: toSafeInt(battleStats.trainer.distance),
      swimmer_user_id: swimmerOfMonth?.user_id || null,
      swimmer_name: swimmerOfMonth?.user_name || null,
      swimmer_role: swimmerOfMonth?.user_role || null,
      swimmer_distance: swimmerOfMonth ? toSafeInt(swimmerOfMonth.distance) : 0,
    };
  }, [allUsers, buildSwimmerDistanceRankingForMonth, swimSessions]);

  const loadSwimMonthlyResults = useCallback(async (yearInput = new Date().getFullYear()) => {
    try {
      const parsedYear = Number(yearInput);
      const year = Number.isFinite(parsedYear) ? Math.max(0, Math.round(parsedYear)) : new Date().getFullYear();
      const data = await dsLoadSwimMonthlyResults(year);
      setSwimMonthlyResults(data);
    } catch (err) {
      console.warn('Monatsergebnisse konnten nicht geladen werden:', err);
      setSwimMonthlyResults([]);
    }
  }, []);

  const upsertSwimMonthlyResult = useCallback(async (monthDateInput) => {
    const payload = buildSwimMonthlyResultPayload(monthDateInput);
    if (!payload) return;
    try {
      await dsUpsertSwimMonthlyResult(payload);
    } catch (err) {
      console.warn('Monatsergebnis konnte nicht gespeichert werden:', err);
    }
  }, [buildSwimMonthlyResultPayload]);

  const getSeaCreatureTier = (winsInput) => {
    const wins = toSafeInt(winsInput);
    for (let i = SEA_CREATURE_TIERS.length - 1; i >= 0; i--) {
      if (wins >= SEA_CREATURE_TIERS[i].minWins) {
        return SEA_CREATURE_TIERS[i];
      }
    }
    return SEA_CREATURE_TIERS[0];
  };

  const getUserNameById = (userId) => {
    if (!userId) return 'Unbekannt';
    if (user?.id === userId) return user.name || 'Du';
    const fromUsers = allUsers.find((u) => u.id === userId);
    return fromUsers?.name || 'Unbekannt';
  };

  const parseSwimSeconds = (value) => {
    const raw = String(value ?? '').trim().replace(',', '.');
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    if (parsed <= 0) return null;
    return parsed;
  };

  const registerSwimArenaResult = ({
    mode,
    discipline,
    styleId,
    winnerIds = [],
    loserIds = [],
    participants = [],
    draw = false,
  }) => {
    const styleName = SWIM_STYLES.find((s) => s.id === styleId)?.name || styleId || 'Freistil';
    const timestamp = new Date().toISOString();

    let nextWinsByUserId = { ...swimBattleWinsByUserId };
    if (!draw) {
      winnerIds.forEach((winnerId) => {
        if (!winnerId) return;
        nextWinsByUserId[winnerId] = toSafeInt(nextWinsByUserId[winnerId]) + 1;
      });
      saveSwimBattleWins(nextWinsByUserId);
    }

    const entry = {
      id: `arena-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mode,
      discipline,
      styleId,
      styleName,
      draw: Boolean(draw),
      winnerIds,
      loserIds,
      participants,
      created_at: timestamp,
    };
    saveSwimBattleHistory([entry, ...swimBattleHistory]);

    const winnerResults = winnerIds.map((winnerId) => {
      const wins = toSafeInt(nextWinsByUserId[winnerId]);
      const creature = getSeaCreatureTier(wins);
      return {
        userId: winnerId,
        name: getUserNameById(winnerId),
        wins,
        creature,
        battleCreature: creature,
      };
    });

    const loserResults = loserIds.map((loserId) => {
      const wins = toSafeInt(nextWinsByUserId[loserId]);
      return {
        userId: loserId,
        name: getUserNameById(loserId),
        wins,
        creature: getSeaCreatureTier(wins),
        battleCreature: ARENA_LOSER_CREATURE,
      };
    });

    setSwimBattleResult({
      id: entry.id,
      mode,
      discipline,
      styleName,
      draw: Boolean(draw),
      participants,
      winners: winnerResults,
      losers: loserResults,
    });
  };

  const handleSwimDuelSubmit = (event) => {
    event.preventDefault();

    const challengerId = swimDuelForm.challengerId;
    const opponentId = swimDuelForm.opponentId;
    if (!challengerId || !opponentId) {
      showToast('Bitte zwei Teilnehmer auswählen.', 'warning');
      return;
    }
    if (challengerId === opponentId) {
      showToast('Ein Duell braucht zwei verschiedene Teilnehmer.', 'warning');
      return;
    }

    const challengerSeconds = parseSwimSeconds(swimDuelForm.challengerSeconds);
    const opponentSeconds = parseSwimSeconds(swimDuelForm.opponentSeconds);
    if (!challengerSeconds || !opponentSeconds) {
      showToast('Bitte gültige Zeiten in Sekunden eintragen.', 'warning');
      return;
    }

    const participants = [
      { userId: challengerId, name: getUserNameById(challengerId), seconds: challengerSeconds },
      { userId: opponentId, name: getUserNameById(opponentId), seconds: opponentSeconds },
    ];

    if (challengerSeconds === opponentSeconds) {
      registerSwimArenaResult({
        mode: 'duel',
        discipline: swimDuelForm.discipline,
        styleId: swimDuelForm.style,
        draw: true,
        participants,
      });
      showToast('Unentschieden! Beide waren gleich schnell.', 'info');
      return;
    }

    const winnerId = challengerSeconds < opponentSeconds ? challengerId : opponentId;
    const loserId = winnerId === challengerId ? opponentId : challengerId;

    registerSwimArenaResult({
      mode: 'duel',
      discipline: swimDuelForm.discipline,
      styleId: swimDuelForm.style,
      winnerIds: [winnerId],
      loserIds: [loserId],
      participants,
    });

    showToast(`Duell abgeschlossen: ${getUserNameById(winnerId)} gewinnt!`, 'success');
  };

  const handleSwimBossBattleSubmit = (event) => {
    event.preventDefault();

    const trainerId = swimBossForm.trainerId;
    if (!trainerId) {
      showToast('Bitte einen Ausbilder auswählen.', 'warning');
      return;
    }
    if (!Array.isArray(swimBossForm.azubiIds) || swimBossForm.azubiIds.length === 0) {
      showToast('Bitte mindestens einen Azubi auswählen.', 'warning');
      return;
    }

    const trainerSeconds = parseSwimSeconds(swimBossForm.trainerSeconds);
    const azubiSeconds = parseSwimSeconds(swimBossForm.azubiSeconds);
    if (!trainerSeconds || !azubiSeconds) {
      showToast('Bitte gültige Zeiten in Sekunden eintragen.', 'warning');
      return;
    }

    const participants = [
      { userId: trainerId, name: getUserNameById(trainerId), seconds: trainerSeconds },
      ...swimBossForm.azubiIds.map((azubiId) => ({
        userId: azubiId,
        name: getUserNameById(azubiId),
        seconds: azubiSeconds,
      })),
    ];

    if (trainerSeconds === azubiSeconds) {
      registerSwimArenaResult({
        mode: 'boss',
        discipline: swimBossForm.discipline,
        styleId: swimBossForm.style,
        draw: true,
        participants,
      });
      showToast('Boss-Battle unentschieden.', 'info');
      return;
    }

    const azubisWon = azubiSeconds < trainerSeconds;
    const winnerIds = azubisWon ? swimBossForm.azubiIds : [trainerId];
    const loserIds = azubisWon ? [trainerId] : swimBossForm.azubiIds;

    registerSwimArenaResult({
      mode: 'boss',
      discipline: swimBossForm.discipline,
      styleId: swimBossForm.style,
      winnerIds,
      loserIds,
      participants,
    });

    showToast(
      azubisWon
        ? 'Boss-Battle: Azubis haben den Ausbilder geschlagen!'
        : 'Boss-Battle: Ausbilder verteidigt den Titel!',
      'success'
    );
  };

  const loadSwimSessions = async () => {
    setSwimSessionsLoaded(false);
    try {
      const data = await dsLoadSwimSessions();
      if (import.meta.env.DEV) console.log('Schwimm-Sessions geladen:', data?.length || 0);
      setSwimSessions(data);

      if (user?.permissions?.canViewAllStats) {
        const pending = data.filter((s) => !s.confirmed);
        setPendingSwimConfirmations(pending);
      }
      setSwimSessionsLoaded(true);
    } catch (err) {
      console.error('Fehler beim Laden der Schwimm-Einheiten:', err);
      setSwimSessions([]);
      setSwimSessionsLoaded(true);
    }
  };

  const saveSwimSession = async (sessionData) => {
    try {
      if (!user || !user.id) {
        console.error('Kein User oder User-ID vorhanden');
        return { success: false, error: 'Bitte melde dich erneut an.' };
      }

      const newSession = {
        user_id: user.id, userId: user.id,
        user_name: user.name, userName: user.name,
        user_role: user.role, userRole: user.role,
        date: sessionData.date,
        distance: parseInt(sessionData.distance) || 0,
        time_minutes: parseInt(sessionData.time) || 0, timeMinutes: parseInt(sessionData.time) || 0,
        style: sessionData.style,
        notes: encodeSwimTrainingPlanInNotes(sessionData.notes, sessionData.trainingPlanId, sessionData.trainingPlanUnitId),
        challenge_id: sessionData.challengeId || null, challengeId: sessionData.challengeId || null,
        confirmed: false, confirmed_by: null, confirmed_at: null,
      };

      if (import.meta.env.DEV) console.log('Speichere Schwimm-Session');
      const savedSession = await dsSaveSwimSession(newSession);
      if (import.meta.env.DEV) console.log('Session gespeichert');

      setSwimSessions((prev) => [savedSession, ...prev]);
      setPendingSwimConfirmations((prev) => [savedSession, ...prev]);

      const styleLabel = SWIM_STYLES.find((style) => style.id === sessionData.style)?.name || sessionData.style || 'Unbekannt';
      const sessionDateLabel = sessionData.date
        ? new Date(sessionData.date).toLocaleDateString('de-DE')
        : 'ohne Datum';

      try {
        const reviewers = await dsGetAuthorizedReviewers();
        const reviewerNames = [...new Set(reviewers.map((r) => String(r.name || '').trim()).filter(Boolean))];
        for (const reviewerName of reviewerNames) {
          if (reviewerName === user.name) continue;
          await sendNotification(
            reviewerName,
            '🏊 Neue Schwimmeinheit wartet auf Freigabe',
            `${user.name} hat eine Schwimmeinheit eingetragen (${sessionDateLabel}, ${sessionData.distance}m, ${styleLabel}) und wartet auf Bestätigung.`,
            'swim_pending'
          );
        }
      } catch (reviewErr) {
        console.warn('Reviewer lookup for swim notification failed:', reviewErr);
      }

      return { success: true, data: savedSession };
    } catch (err) {
      console.error('Fehler beim Speichern der Schwimm-Einheit:', err);
      return { success: false, error: err.message || 'Unbekannter Fehler' };
    }
  };

  const confirmSwimSession = async (sessionId) => {
    try {
      const sessionToConfirm = swimSessions.find((s) => s.id === sessionId) || null;
      const confirmationResult = await dsConfirmSwimSession(sessionId, user.name);
      const confirmedSession = confirmationResult?.id ? confirmationResult : sessionToConfirm;

      setSwimSessions((prev) => prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              ...(confirmedSession || {}),
              confirmed: true,
              confirmed_by: confirmationResult?.confirmed_by || confirmationResult?.reviewed_by || user.name,
              confirmed_at: confirmationResult?.confirmed_at || confirmationResult?.reviewed_at || new Date().toISOString(),
            }
          : s
      ));
      setPendingSwimConfirmations((prev) => prev.filter((s) => s.id !== sessionId));

      return { success: true };
    } catch (err) {
      console.error('Fehler beim Bestätigen:', err);
      return { success: false, error: err.message };
    }
  };

  const rejectSwimSession = async (sessionId) => {
    try {
      await dsRejectSwimSession(sessionId);
      setSwimSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setPendingSwimConfirmations((prev) => prev.filter((s) => s.id !== sessionId));
      return { success: true };
    } catch (err) {
      console.error('Fehler beim Ablehnen:', err);
      return { success: false, error: err.message };
    }
  };

  const withdrawSwimSession = async (sessionId) => {
    try {
      await dsWithdrawSwimSession(sessionId);
      setSwimSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setPendingSwimConfirmations((prev) => prev.filter((s) => s.id !== sessionId));
      return { success: true };
    } catch (err) {
      console.error('Fehler beim Zurueckziehen:', err);
      return { success: false, error: err.message };
    }
  };

  // ==================== EFFECTS ====================

  // Lade Schwimmdaten beim Start
  useEffect(() => {
    if (!authReady) return;
    if (user) {
      loadSwimSessions();
    } else {
      setSwimSessions([]);
      setPendingSwimConfirmations([]);
      setSwimSessionsLoaded(false);
      setCustomSwimTrainingPlans([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, user]);

  // Monatsergebnisse berechnen
  useEffect(() => {
    if (!user) {
      setSwimMonthlyResults([]);
      return;
    }
    if (!swimSessionsLoaded) return;

    let cancelled = false;
    const syncSwimMonthlyResults = async () => {
      const now = new Date();
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      await upsertSwimMonthlyResult(previousMonth);
      if (!cancelled) {
        if (swimSessions.length > 0) {
          const year = now.getFullYear();
          const results = [];
          for (let m = 0; m < now.getMonth(); m++) {
            const monthDate = new Date(year, m, 1);
            const payload = buildSwimMonthlyResultPayload(monthDate);
            if (payload && (payload.azubis_points > 0 || payload.trainer_points > 0)) {
              results.push(payload);
            }
          }
          if (!cancelled) setSwimMonthlyResults(results);
        } else {
          await loadSwimMonthlyResults(now.getFullYear());
        }
      }
    };

    void syncSwimMonthlyResults();
    return () => {
      cancelled = true;
    };
  }, [allUsers, loadSwimMonthlyResults, swimSessions, swimSessionsLoaded, upsertSwimMonthlyResult, user]);

  // Form-Defaults aus allUsers ableiten
  useEffect(() => {
    const trainerCandidates = allUsers.filter((u) =>
      u?.role === 'trainer'
      || u?.role === 'ausbilder'
      || u?.role === 'admin'
      || Boolean(u?.permissions?.canViewAllStats)
    );
    const azubiCandidates = allUsers.filter((u) => u?.role === 'azubi');

    setSwimDuelForm((prev) => {
      const knownUserIds = new Set(allUsers.map((u) => u.id));
      let challengerId = prev.challengerId;
      if (!challengerId || !knownUserIds.has(challengerId)) {
        if (user?.id && knownUserIds.has(user.id)) {
          challengerId = user.id;
        } else {
          challengerId = azubiCandidates[0]?.id || trainerCandidates[0]?.id || '';
        }
      }

      let opponentId = prev.opponentId;
      if (!opponentId || !knownUserIds.has(opponentId) || opponentId === challengerId) {
        opponentId = allUsers.find((u) => u.id && u.id !== challengerId)?.id || '';
      }

      return { ...prev, challengerId, opponentId };
    });

    setSwimBossForm((prev) => {
      let trainerId = prev.trainerId;
      if (!trainerId || !trainerCandidates.some((t) => t.id === trainerId)) {
        if (user?.id && trainerCandidates.some((t) => t.id === user.id)) {
          trainerId = user.id;
        } else {
          trainerId = trainerCandidates[0]?.id || '';
        }
      }

      let azubiIds = Array.isArray(prev.azubiIds)
        ? prev.azubiIds.filter((id) => azubiCandidates.some((a) => a.id === id) && id !== trainerId)
        : [];
      if (azubiIds.length === 0) {
        azubiIds = azubiCandidates
          .map((a) => a.id)
          .filter((id) => id !== trainerId)
          .slice(0, 3);
      }

      return { ...prev, trainerId, azubiIds };
    });
  }, [allUsers, user?.id]);

  // ==================== DERIVED ====================

  const swimCurrentMonthKey = getSwimMonthKey(new Date());
  const swimCurrentMonthLabel = new Date()
    .toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
    .toUpperCase();
  const swimCurrentMonthSessions = swimSessions.filter((session) => isDateInSwimMonth(session?.date, swimCurrentMonthKey));
  const swimCurrentMonthBattleStats = calculateTeamBattleStats(swimCurrentMonthSessions, {}, allUsers);
  const swimMonthlyDistanceRankingCurrentMonth = buildSwimmerDistanceRankingForMonth(swimCurrentMonthKey);
  const swimMonthlySwimmerCurrentMonth = swimMonthlyDistanceRankingCurrentMonth[0] || null;
  const swimYear = new Date().getFullYear();
  const swimYearlySwimmerRanking = Object.values(
    swimMonthlyResults.reduce((accumulator, entry) => {
      const swimmerName = String(entry?.swimmer_name || '').trim();
      if (!swimmerName) return accumulator;
      const swimmerId = String(entry?.swimmer_user_id || '').trim();
      const rankingKey = swimmerId || swimmerName.toLowerCase();
      if (!accumulator[rankingKey]) {
        accumulator[rankingKey] = {
          key: rankingKey,
          swimmer_user_id: swimmerId || null,
          swimmer_name: swimmerName,
          swimmer_role: entry?.swimmer_role || '',
          titles: 0,
          total_distance: 0,
          months: [],
        };
      }
      accumulator[rankingKey].titles += 1;
      accumulator[rankingKey].total_distance += toSafeInt(entry?.swimmer_distance);
      accumulator[rankingKey].months.push(toSafeInt(entry?.month));
      return accumulator;
    }, {})
  ).sort((a, b) =>
    (b.titles - a.titles)
    || (b.total_distance - a.total_distance)
    || String(a.swimmer_name || '').localeCompare(String(b.swimmer_name || ''), 'de-DE')
  );

  return {
    // State
    swimChallengeView, setSwimChallengeView,
    swimSessions, setSwimSessions,
    swimSessionsLoaded, setSwimSessionsLoaded,
    customSwimTrainingPlans, setCustomSwimTrainingPlans,
    activeSwimChallenges, setActiveSwimChallenges,
    swimSessionForm, setSwimSessionForm,
    pendingSwimConfirmations, setPendingSwimConfirmations,
    swimChallengeFilter, setSwimChallengeFilter,
    swimArenaMode, setSwimArenaMode,
    swimBattleHistory, setSwimBattleHistory,
    swimBattleWinsByUserId, setSwimBattleWinsByUserId,
    swimBattleResult, setSwimBattleResult,
    swimMonthlyResults, setSwimMonthlyResults,
    swimDuelForm, setSwimDuelForm,
    swimBossForm, setSwimBossForm,
    // Actions
    saveActiveSwimChallenges,
    saveSwimBattleHistory,
    saveSwimBattleWins,
    loadCustomSwimTrainingPlans,
    createCustomSwimTrainingPlan,
    getSwimTrainingPlanById,
    buildSwimmerDistanceRankingForMonth,
    buildSwimMonthlyResultPayload,
    loadSwimMonthlyResults,
    upsertSwimMonthlyResult,
    getSeaCreatureTier,
    getUserNameById,
    parseSwimSeconds,
    registerSwimArenaResult,
    handleSwimDuelSubmit,
    handleSwimBossBattleSubmit,
    loadSwimSessions,
    saveSwimSession,
    confirmSwimSession,
    rejectSwimSession,
    withdrawSwimSession,
    extractSwimTrainingPlanIdFromNotes,
    extractSwimTrainingPlanUnitIdFromNotes,
    extractSwimTrainingPlanSelectionFromNotes,
    stripSwimTrainingPlanTagFromNotes,
    encodeSwimTrainingPlanInNotes,
    doesSessionFulfillPlanUnit,
    doesSessionFulfillTrainingPlan,
    // Derived
    swimTrainingPlans,
    swimCurrentMonthKey,
    swimCurrentMonthLabel,
    swimCurrentMonthSessions,
    swimCurrentMonthBattleStats,
    swimMonthlyDistanceRankingCurrentMonth,
    swimMonthlySwimmerCurrentMonth,
    swimYear,
    swimYearlySwimmerRanking,
  };
}
