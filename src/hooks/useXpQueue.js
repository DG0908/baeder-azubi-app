import { useRef } from 'react';
import {
  toSafeInt,
  ensureUserStatsStructure,
  createEmptyUserStats,
  addXpToStats,
  getTotalXpFromStats,
  getXpBreakdownFromStats,
} from '../lib/quizHelpers';

export function useXpQueue({ user, duel, showToast, setUserStats, setStatsByUserId }) {
  const xpAwardQueueRef = useRef(Promise.resolve(0));

  const queueXpAwardForUser = (targetUserInput, sourceKey, amount, options = {}) => {
    const xpAmount = toSafeInt(amount);
    const targetUserId = targetUserInput?.id || null;
    const targetUserName = targetUserInput?.name || null;

    if (!targetUserId || !targetUserName || xpAmount <= 0) {
      return Promise.resolve(0);
    }

    const { eventKey = null, reason = null, showXpToast = false } = options;

    xpAwardQueueRef.current = xpAwardQueueRef.current
      .then(async () => {
        const currentStats = await duel.getUserStatsFromSupabase({ id: targetUserId, name: targetUserName });
        const baseStats = ensureUserStatsStructure(currentStats || createEmptyUserStats());
        const { stats: xpUpdatedStats, addedXp } = addXpToStats(baseStats, sourceKey, xpAmount, eventKey);
        if (addedXp <= 0) {
          return 0;
        }

        await duel.saveUserStatsToSupabase({ id: targetUserId, name: targetUserName }, xpUpdatedStats);
        if (targetUserId === user?.id) {
          setUserStats(xpUpdatedStats);
        }
        setStatsByUserId((prev) => {
          const wins = xpUpdatedStats.wins || 0;
          const losses = xpUpdatedStats.losses || 0;
          const draws = xpUpdatedStats.draws || 0;
          return {
            ...prev,
            [targetUserId]: {
              ...(prev[targetUserId] || {}),
              wins,
              losses,
              draws,
              total: wins + losses + draws,
              totalXp: getTotalXpFromStats(xpUpdatedStats),
              xpBreakdown: getXpBreakdownFromStats(xpUpdatedStats),
            },
          };
        });

        if (showXpToast) {
          const isCurrentUserTarget = targetUserId === user?.id;
          const toastPrefix = isCurrentUserTarget ? `+${addedXp} XP` : `${targetUserName}: +${addedXp} XP`;
          showToast(`${toastPrefix}${reason ? ` • ${reason}` : ''}`, 'success', 2500);
        }
        return addedXp;
      })
      .catch((error) => {
        console.error('XP update error:', error);
        return 0;
      });

    return xpAwardQueueRef.current;
  };

  const queueXpAward = (sourceKey, amount, options = {}) => {
    if (!user?.id || !user?.name) {
      return Promise.resolve(0);
    }
    return queueXpAwardForUser({ id: user.id, name: user.name }, sourceKey, amount, options);
  };

  return { queueXpAwardForUser, queueXpAward };
}
