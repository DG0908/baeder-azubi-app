import { useState, useEffect } from 'react';
import { parseJsonSafe } from '../lib/jsonUtils';

const WEEKLY_GOALS_STORAGE_KEY = 'weekly_goals_v1';
const WEEKLY_PROGRESS_STORAGE_KEY = 'weekly_progress_v1';
const WEEKLY_REMINDER_STORAGE_KEY = 'weekly_goals_reminder_v1';

const WEEKLY_PROGRESS_TEMPLATE = {
  quizAnswers: 0,
  examAnswers: 0,
  flashcards: 0,
  checklistItems: 0,
};

const WEEKLY_GOAL_DEFAULTS = {
  quizAnswers: 40,
  examAnswers: 30,
  flashcards: 35,
  checklistItems: 10,
};

export const sanitizeGoalValue = (value, fallback = 0) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.round(parsed));
};

export const getWeekStartStamp = (input = Date.now()) => {
  const base = new Date(input);
  if (Number.isNaN(base.getTime())) return '';
  const date = new Date(base);
  const day = date.getDay(); // Sonntag = 0
  const offsetToMonday = (day + 6) % 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - offsetToMonday);
  return date.toISOString().slice(0, 10);
};

export const buildEmptyWeeklyProgress = (weekStart = getWeekStartStamp()) => ({
  weekStart,
  stats: { ...WEEKLY_PROGRESS_TEMPLATE },
  updatedAt: Date.now(),
});

export function useWeeklyGoals({ user, currentView, showToast }) {
  const [weeklyGoals, setWeeklyGoals] = useState(() => {
    const parsed = parseJsonSafe(localStorage.getItem(WEEKLY_GOALS_STORAGE_KEY), {});
    return {
      quizAnswers: sanitizeGoalValue(parsed.quizAnswers, WEEKLY_GOAL_DEFAULTS.quizAnswers),
      examAnswers: sanitizeGoalValue(parsed.examAnswers, WEEKLY_GOAL_DEFAULTS.examAnswers),
      flashcards: sanitizeGoalValue(parsed.flashcards, WEEKLY_GOAL_DEFAULTS.flashcards),
      checklistItems: sanitizeGoalValue(parsed.checklistItems, WEEKLY_GOAL_DEFAULTS.checklistItems),
    };
  });

  const [weeklyProgress, setWeeklyProgress] = useState(() => {
    const currentWeek = getWeekStartStamp();
    const parsed = parseJsonSafe(localStorage.getItem(WEEKLY_PROGRESS_STORAGE_KEY), null);
    if (!parsed || typeof parsed !== 'object') return buildEmptyWeeklyProgress(currentWeek);
    if (parsed.weekStart !== currentWeek) return buildEmptyWeeklyProgress(currentWeek);
    const rawStats = (parsed.stats && typeof parsed.stats === 'object') ? parsed.stats : {};
    return {
      weekStart: currentWeek,
      stats: {
        quizAnswers: sanitizeGoalValue(rawStats.quizAnswers, 0),
        examAnswers: sanitizeGoalValue(rawStats.examAnswers, 0),
        flashcards: sanitizeGoalValue(rawStats.flashcards, 0),
        checklistItems: sanitizeGoalValue(rawStats.checklistItems, 0),
      },
      updatedAt: parsed.updatedAt || Date.now(),
    };
  });

  useEffect(() => {
    localStorage.setItem(WEEKLY_GOALS_STORAGE_KEY, JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  useEffect(() => {
    localStorage.setItem(WEEKLY_PROGRESS_STORAGE_KEY, JSON.stringify(weeklyProgress));
  }, [weeklyProgress]);

  useEffect(() => {
    const currentWeek = getWeekStartStamp();
    if (weeklyProgress.weekStart !== currentWeek) {
      setWeeklyProgress(buildEmptyWeeklyProgress(currentWeek));
    }
  }, [currentView, weeklyProgress.weekStart]);

  useEffect(() => {
    if (!user?.id || currentView !== 'home') return;

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const reminderInfo = parseJsonSafe(localStorage.getItem(WEEKLY_REMINDER_STORAGE_KEY), {});
    if (reminderInfo?.date === today) return;

    const goalKeys = Object.keys(WEEKLY_GOAL_DEFAULTS).filter((key) => sanitizeGoalValue(weeklyGoals[key], 0) > 0);
    if (goalKeys.length === 0) return;

    const progressRatio = goalKeys.reduce((sum, key) => {
      const target = sanitizeGoalValue(weeklyGoals[key], 0);
      const current = sanitizeGoalValue(weeklyProgress.stats?.[key], 0);
      const ratio = target > 0 ? Math.min(1, current / target) : 1;
      return sum + ratio;
    }, 0) / goalKeys.length;

    const weekday = ((now.getDay() + 6) % 7) + 1; // Montag=1 ... Sonntag=7
    const expectedRatio = weekday / 7;

    if (progressRatio + 0.12 < expectedRatio) {
      showToast('Wochenziel-Reminder: Du bist hinter deinem Wochenplan.', 'info', 4200);
      localStorage.setItem(WEEKLY_REMINDER_STORAGE_KEY, JSON.stringify({
        date: today,
        weekStart: weeklyProgress.weekStart,
      }));
    }
  }, [user?.id, currentView, weeklyGoals, weeklyProgress, showToast]);

  const updateWeeklyProgress = (metric, delta = 1) => {
    const deltaInt = Math.round(Number(delta));
    if (!Number.isFinite(deltaInt) || deltaInt === 0) return;
    if (!(metric in WEEKLY_PROGRESS_TEMPLATE)) return;

    const currentWeek = getWeekStartStamp();
    setWeeklyProgress((prev) => {
      const safePrev = (prev && typeof prev === 'object') ? prev : buildEmptyWeeklyProgress(currentWeek);
      const base = safePrev.weekStart === currentWeek
        ? safePrev
        : buildEmptyWeeklyProgress(currentWeek);
      const currentValue = sanitizeGoalValue(base.stats?.[metric], 0);
      const nextValue = Math.max(0, currentValue + deltaInt);
      return {
        weekStart: currentWeek,
        stats: {
          ...WEEKLY_PROGRESS_TEMPLATE,
          ...(base.stats || {}),
          [metric]: nextValue,
        },
        updatedAt: Date.now(),
      };
    });
  };

  return {
    weeklyGoals,
    setWeeklyGoals,
    weeklyProgress,
    setWeeklyProgress,
    updateWeeklyProgress,
  };
}
