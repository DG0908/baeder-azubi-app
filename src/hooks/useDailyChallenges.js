import { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/constants';

const CHALLENGE_TYPES = [
  { id: 'answer_questions', name: 'Fragen beantworten', icon: '❓', unit: 'Fragen', baseTarget: 10 },
  { id: 'correct_answers', name: 'Richtige Antworten', icon: '✅', unit: 'richtige', baseTarget: 7 },
  { id: 'flashcards_reviewed', name: 'Lernkarten wiederholen', icon: '🎴', unit: 'Karten', baseTarget: 15 },
  { id: 'category_master', name: 'Kategorie üben', icon: '📚', unit: 'Fragen aus', baseTarget: 5, hasCategory: true },
  { id: 'quiz_play', name: 'Quiz spielen', icon: '🎮', unit: 'Runde', baseTarget: 1 },
  { id: 'streak_keep', name: 'Lernstreak halten', icon: '🔥', unit: 'Tag', baseTarget: 1 },
];

function generateDailyChallenges() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const seededRandom = (index) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  const shuffled = [...CHALLENGE_TYPES].sort(
    (a, b) => seededRandom(CHALLENGE_TYPES.indexOf(a)) - seededRandom(CHALLENGE_TYPES.indexOf(b))
  );
  const selectedChallenges = shuffled.slice(0, 3);

  return selectedChallenges.map((challenge, idx) => {
    const difficulty = 1 + seededRandom(idx + 100) * 0.5;
    const target = Math.round(challenge.baseTarget * difficulty);

    let category = null;
    if (challenge.hasCategory) {
      const catIndex = Math.floor(seededRandom(idx + 200) * CATEGORIES.length);
      category = CATEGORIES[catIndex];
    }

    return { ...challenge, target, category, xpReward: target * 10 };
  });
}

export function useDailyChallenges() {
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [dailyChallengeProgress, setDailyChallengeProgress] = useState(() => {
    const saved = localStorage.getItem('daily_challenge_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      if (parsed.date === today) {
        return parsed;
      }
    }
    return { date: new Date().toDateString(), completed: [], stats: {} };
  });

  useEffect(() => {
    setDailyChallenges(generateDailyChallenges());
  }, []);

  const updateChallengeProgress = (challengeType, amount = 1, categoryId = null) => {
    setDailyChallengeProgress(prev => {
      const today = new Date().toDateString();

      if (prev.date !== today) {
        const newProgress = {
          date: today,
          completed: [],
          stats: { [challengeType]: amount },
        };
        if (categoryId) {
          newProgress.stats[`category_${categoryId}`] = amount;
        }
        localStorage.setItem('daily_challenge_progress', JSON.stringify(newProgress));
        return newProgress;
      }

      const newStats = { ...prev.stats };
      newStats[challengeType] = (newStats[challengeType] || 0) + amount;
      if (categoryId) {
        newStats[`category_${categoryId}`] = (newStats[`category_${categoryId}`] || 0) + amount;
      }

      const newProgress = { ...prev, stats: newStats };
      localStorage.setItem('daily_challenge_progress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const getChallengeProgress = (challenge) => {
    const stats = dailyChallengeProgress.stats || {};
    if (challenge.hasCategory && challenge.category) {
      return stats[`category_${challenge.category.id}`] || 0;
    }
    return stats[challenge.id] || 0;
  };

  const isChallengeCompleted = (challenge) => {
    return getChallengeProgress(challenge) >= challenge.target;
  };

  const getCompletedChallengesCount = () => {
    return dailyChallenges.filter(c => isChallengeCompleted(c)).length;
  };

  const getTotalXPEarned = () => {
    return dailyChallenges
      .filter(c => isChallengeCompleted(c))
      .reduce((sum, c) => sum + c.xpReward, 0);
  };

  return {
    dailyChallenges,
    dailyChallengeProgress,
    setDailyChallengeProgress,
    updateChallengeProgress,
    getChallengeProgress,
    isChallengeCompleted,
    getCompletedChallengesCount,
    getTotalXPEarned,
  };
}
