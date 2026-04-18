import { useState, useEffect } from 'react';
import { sanitizeGoalValue } from './useWeeklyGoals';
import { getQuestionPerformanceKey } from '../lib/questionKey';
import { parseJsonSafe } from '../lib/jsonUtils';

const QUESTION_PERFORMANCE_STORAGE_KEY = 'question_performance_v1';
const ADAPTIVE_LEARNING_STORAGE_KEY = 'adaptive_learning_mode_v1';

export function useQuestionPerformance() {
  const [questionPerformance, setQuestionPerformance] = useState(() => {
    const parsed = parseJsonSafe(localStorage.getItem(QUESTION_PERFORMANCE_STORAGE_KEY), {});
    return (parsed && typeof parsed === 'object') ? parsed : {};
  });

  const [adaptiveLearningEnabled, setAdaptiveLearningEnabled] = useState(() => {
    const saved = localStorage.getItem(ADAPTIVE_LEARNING_STORAGE_KEY);
    if (saved === null) return true;
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem(QUESTION_PERFORMANCE_STORAGE_KEY, JSON.stringify(questionPerformance));
  }, [questionPerformance]);

  useEffect(() => {
    localStorage.setItem(ADAPTIVE_LEARNING_STORAGE_KEY, adaptiveLearningEnabled ? 'true' : 'false');
  }, [adaptiveLearningEnabled]);

  const trackQuestionPerformance = (question, categoryHint, isCorrect) => {
    if (!question) return;
    const key = getQuestionPerformanceKey(question, categoryHint);
    setQuestionPerformance((prev) => {
      const current = (prev && typeof prev[key] === 'object') ? prev[key] : {};
      const attempts = sanitizeGoalValue(current.attempts, 0) + 1;
      const correct = sanitizeGoalValue(current.correct, 0) + (isCorrect ? 1 : 0);
      const wrong = sanitizeGoalValue(current.wrong, 0) + (isCorrect ? 0 : 1);
      const wrongStreak = isCorrect ? 0 : sanitizeGoalValue(current.wrongStreak, 0) + 1;
      return {
        ...prev,
        [key]: {
          attempts,
          correct,
          wrong,
          wrongStreak,
          lastSeen: Date.now(),
          lastResult: isCorrect ? 'correct' : 'wrong',
        },
      };
    });
  };

  return {
    questionPerformance,
    setQuestionPerformance,
    adaptiveLearningEnabled,
    setAdaptiveLearningEnabled,
    trackQuestionPerformance,
  };
}
