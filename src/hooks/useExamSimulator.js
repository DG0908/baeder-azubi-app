import { useState } from 'react';
import {
  saveTheoryExamAttempt as dsSaveTheoryExamAttempt,
  loadTheoryExamHistory as dsLoadTheoryExamHistory,
  startTheoryExamSession as dsStartTheoryExamSession,
} from '../lib/dataService';
import {
  ensureUserStatsStructure,
  getTotalXpFromStats,
  getXpBreakdownFromStats,
  evaluateKeywordAnswer,
  autoExtractKeywordGroups,
} from '../lib/quizHelpers';
import { friendlyError } from '../lib/friendlyError';

export function useExamSimulator({
  user,
  duel,
  playSound,
  showToast,
  updateChallengeProgress,
  updateWeeklyProgress,
  trackQuestionPerformance,
  setUserStats,
  setStatsByUserId,
}) {
  const [examSimulator, setExamSimulator] = useState(null);
  const [examCurrentQuestion, setExamCurrentQuestion] = useState(null);
  const [examQuestionIndex, setExamQuestionIndex] = useState(0);
  const [examAnswered, setExamAnswered] = useState(false);
  const [userExamProgress, setUserExamProgress] = useState(null);
  const [examSelectedAnswers, setExamSelectedAnswers] = useState([]);
  const [examSelectedAnswer, setExamSelectedAnswer] = useState(null);
  const [examSimulatorMode, setExamSimulatorMode] = useState('theory');
  const [examKeywordMode, setExamKeywordMode] = useState(false);
  const [examKeywordInput, setExamKeywordInput] = useState('');
  const [examKeywordEvaluation, setExamKeywordEvaluation] = useState(null);
  const [theoryExamHistory, setTheoryExamHistory] = useState([]);
  const [theoryExamHistoryLoading, setTheoryExamHistoryLoading] = useState(false);

  const toggleExamAnswer = (answerIndex) => {
    if (examAnswered || !examSimulator) return;
    setExamSelectedAnswers(prev => {
      if (prev.includes(answerIndex)) {
        return prev.filter(i => i !== answerIndex);
      } else {
        return [...prev, answerIndex];
      }
    });
  };

  const confirmExamMultiSelectAnswer = () => {
    if (examAnswered || !examSimulator || !examCurrentQuestion.multi) return;
    setExamAnswered(true);

    const correctAnswers = examCurrentQuestion.correct;
    const isCorrect =
      examSelectedAnswers.length === correctAnswers.length &&
      examSelectedAnswers.every(idx => correctAnswers.includes(idx));

    if (isCorrect) { playSound('correct'); } else { playSound('wrong'); }

    updateChallengeProgress('answer_questions', 1);
    if (isCorrect) {
      updateChallengeProgress('correct_answers', 1);
    }
    if (examCurrentQuestion.category) {
      updateChallengeProgress('category_master', 1, examCurrentQuestion.category);
    }
    updateWeeklyProgress('examAnswers', 1);
    trackQuestionPerformance(examCurrentQuestion, examCurrentQuestion.category, isCorrect);

    const newAnswers = [...examSimulator.answers, {
      question: examCurrentQuestion,
      selectedAnswers: examSelectedAnswers,
      correct: isCorrect,
    }];
    setExamSimulator({ ...examSimulator, answers: newAnswers });

    setTimeout(() => {
      proceedToNextExamQuestion(newAnswers);
    }, 2000);
  };

  const submitExamKeywordAnswer = () => {
    if (examAnswered || !examSimulator || !examCurrentQuestion || !examKeywordInput.trim()) return;
    const correctText = examCurrentQuestion.multi && Array.isArray(examCurrentQuestion.correct)
      ? examCurrentQuestion.correct.map(idx => String(examCurrentQuestion.a?.[idx] || '')).join('. ')
      : String(examCurrentQuestion.a?.[examCurrentQuestion.correct] || '');
    const groups = autoExtractKeywordGroups(correctText);
    const fakeQ = { keywordGroups: groups, minKeywordGroups: Math.max(1, Math.ceil(groups.length * 0.5)) };
    const evaluation = evaluateKeywordAnswer(fakeQ, examKeywordInput);
    setExamKeywordEvaluation(evaluation);
    const isCorrect = evaluation.isCorrect;
    if (isCorrect) { playSound('correct'); } else { playSound('wrong'); }
    setExamAnswered(true);
    setExamSelectedAnswer(examCurrentQuestion.multi ? null : examCurrentQuestion.correct);
    updateChallengeProgress('answer_questions', 1);
    if (isCorrect) updateChallengeProgress('correct_answers', 1);
    if (examCurrentQuestion.category) updateChallengeProgress('category_master', 1, examCurrentQuestion.category);
    updateWeeklyProgress('examAnswers', 1);
    trackQuestionPerformance(examCurrentQuestion, examCurrentQuestion.category, isCorrect);
    const newAnswers = [...examSimulator.answers, {
      question: examCurrentQuestion,
      selectedAnswer: -1,
      correct: isCorrect,
      answerType: 'keyword',
      keywordText: examKeywordInput.trim(),
    }];
    setExamSimulator({ ...examSimulator, answers: newAnswers });
    setTimeout(() => {
      setExamKeywordInput('');
      setExamKeywordEvaluation(null);
      proceedToNextExamQuestion(newAnswers);
    }, 2500);
  };

  const answerExamQuestion = (answerIndex) => {
    if (examAnswered || !examSimulator) return;

    if (examCurrentQuestion.multi) {
      toggleExamAnswer(answerIndex);
      return;
    }

    setExamAnswered(true);
    setExamSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === examCurrentQuestion.correct;
    if (isCorrect) { playSound('correct'); } else { playSound('wrong'); }

    updateChallengeProgress('answer_questions', 1);
    if (isCorrect) {
      updateChallengeProgress('correct_answers', 1);
    }
    if (examCurrentQuestion.category) {
      updateChallengeProgress('category_master', 1, examCurrentQuestion.category);
    }
    updateWeeklyProgress('examAnswers', 1);
    trackQuestionPerformance(examCurrentQuestion, examCurrentQuestion.category, isCorrect);
    const newAnswers = [...examSimulator.answers, { question: examCurrentQuestion, selectedAnswer: answerIndex, correct: isCorrect }];
    setExamSimulator({ ...examSimulator, answers: newAnswers });
    setTimeout(() => {
      proceedToNextExamQuestion(newAnswers);
    }, 2000);
  };

  const proceedToNextExamQuestion = (newAnswers) => {
    if (examQuestionIndex < examSimulator.questions.length - 1) {
      const nextIdx = examQuestionIndex + 1;
      setExamQuestionIndex(nextIdx);
      setExamCurrentQuestion(examSimulator.questions[nextIdx]);
      setExamAnswered(false);
      setExamSelectedAnswers([]);
      setExamSelectedAnswer(null);
    } else {
      const correctAnswers = newAnswers.filter(a => a.correct).length;
      const percentage = Math.round((correctAnswers / newAnswers.length) * 100);
      const examProgress = {
        correct: correctAnswers,
        total: newAnswers.length,
        percentage,
        passed: percentage >= 50,
        timeMs: Date.now() - examSimulator.startTime,
      };
      setUserExamProgress(examProgress);
      void saveTheoryExamAttempt(examProgress, newAnswers, examSimulator?.sessionId);
      if (percentage >= 50) playSound('whistle');
    }
  };

  const resetExam = () => {
    setExamSimulator(null);
    setExamCurrentQuestion(null);
    setExamQuestionIndex(0);
    setExamAnswered(false);
    setUserExamProgress(null);
    setExamSelectedAnswers([]);
    setExamSelectedAnswer(null);
    setExamKeywordInput('');
    setExamKeywordEvaluation(null);
  };

  const loadExamProgress = async () => {
    setExamSimulatorMode('theory');
    setUserExamProgress(null);
    setExamAnswered(false);
    setExamSelectedAnswers([]);
    setExamSelectedAnswer(null);
    setExamKeywordInput('');
    setExamKeywordEvaluation(null);

    try {
      const result = await dsStartTheoryExamSession(examKeywordMode);
      const examQuestions = Array.isArray(result?.questions) ? result.questions : [];
      if (examQuestions.length === 0) {
        throw new Error('Keine Theoriefragen vom Backend erhalten.');
      }

      setExamSimulator({
        sessionId: result.sessionId,
        questions: examQuestions,
        answers: [],
        startTime: Date.now(),
        keywordMode: Boolean(result.keywordMode),
        expiresAt: result.expiresAt || null,
      });
      setExamQuestionIndex(0);
      setExamCurrentQuestion(examQuestions[0]);
    } catch (error) {
      console.error('Fehler beim Starten der Theorieprüfung:', error);
      setExamSimulator(null);
      setExamCurrentQuestion(null);
      showToast('Theorieprüfung konnte nicht gestartet werden.', 'error');
    }
  };

  const saveTheoryExamAttempt = async (progress, answers = [], sessionId = null) => {
    if (!user?.id) return;
    try {
      const result = await dsSaveTheoryExamAttempt(
        user.id,
        user.name,
        progress,
        examKeywordMode,
        {
          sessionId: sessionId || examSimulator?.sessionId || null,
          answers,
        }
      );
      if (!result) {
        return;
      }

      const authoritativeProgress = {
        correct: Number(result.correct || 0),
        total: Number(result.total || 0),
        percentage: Number(result.percentage || 0),
        passed: Boolean(result.passed),
        timeMs: Number(result.timeMs || progress?.timeMs || 0),
      };
      setUserExamProgress(authoritativeProgress);

      const savedAttempt = {
        id: result.id,
        user_id: result.userId || user.id,
        user_name: result.userName || user.name,
        correct: authoritativeProgress.correct,
        total: authoritativeProgress.total,
        percentage: authoritativeProgress.percentage,
        passed: authoritativeProgress.passed,
        time_ms: authoritativeProgress.timeMs,
        keyword_mode: Boolean(result.keywordMode),
        created_at: result.createdAt || new Date().toISOString(),
      };
      setTheoryExamHistory(prev => [savedAttempt, ...prev.filter(entry => entry.id !== savedAttempt.id)]);

      const refreshedStats = await duel.getUserStatsFromSupabase(user);
      if (refreshedStats) {
        const stats = ensureUserStatsStructure(refreshedStats);
        setUserStats(stats);
        setStatsByUserId(prev => {
          const wins = stats.wins || 0;
          const losses = stats.losses || 0;
          const draws = stats.draws || 0;
          return {
            ...prev,
            [user.id]: {
              ...(prev[user.id] || {}),
              wins,
              losses,
              draws,
              total: wins + losses + draws,
              totalXp: getTotalXpFromStats(stats),
              xpBreakdown: getXpBreakdownFromStats(stats),
            },
          };
        });
      }

      const addedXp = Number(result?.xpAward?.addedXp || 0);
      if (addedXp > 0) {
        showToast(`+${addedXp} XP • Prüfungssimulator`, 'success', 2500);
      }
    } catch (e) {
      console.warn('Fehler beim Speichern des Prüfungsergebnisses:', e);
      showToast(friendlyError(e), 'error');
    }
  };

  const loadTheoryExamHistory = async () => {
    if (!user?.id) return;
    setTheoryExamHistoryLoading(true);
    try {
      const data = await dsLoadTheoryExamHistory(user.id, user.permissions?.canViewAllStats);
      setTheoryExamHistory(data);
    } catch (e) {
      console.warn('Fehler beim Laden der Prüfungshistorie:', e);
    } finally {
      setTheoryExamHistoryLoading(false);
    }
  };

  return {
    examSimulator, setExamSimulator,
    examCurrentQuestion, setExamCurrentQuestion,
    examQuestionIndex, setExamQuestionIndex,
    examAnswered, setExamAnswered,
    userExamProgress, setUserExamProgress,
    examSelectedAnswers, setExamSelectedAnswers,
    examSelectedAnswer, setExamSelectedAnswer,
    examSimulatorMode, setExamSimulatorMode,
    examKeywordMode, setExamKeywordMode,
    examKeywordInput, setExamKeywordInput,
    examKeywordEvaluation, setExamKeywordEvaluation,
    theoryExamHistory, setTheoryExamHistory,
    theoryExamHistoryLoading,
    toggleExamAnswer,
    confirmExamMultiSelectAnswer,
    submitExamKeywordAnswer,
    answerExamQuestion,
    proceedToNextExamQuestion,
    resetExam,
    loadExamProgress,
    saveTheoryExamAttempt,
    loadTheoryExamHistory,
  };
}
