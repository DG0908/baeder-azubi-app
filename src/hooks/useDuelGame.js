import { useState, useRef } from 'react';
import {
  toSafeInt, getFirstSafeInt,
  normalizePlayerName, namesMatch, isFinishedGameStatus,
  shuffleArray,
  DIFFICULTY_SETTINGS, DEFAULT_CHALLENGE_TIMEOUT_MINUTES, CHALLENGE_TIMEOUT_BOUNDS,
  normalizeChallengeTimeoutMinutes, parseTimestampSafe,
  getChallengeTimeoutMs,
  getWaitingChallengeRemainingMs, isWaitingChallengeExpired,
  formatDurationMinutesCompact,
  XP_REWARDS, XP_BREAKDOWN_DEFAULT,
  createEmptyUserStats, ensureUserStatsStructure, buildUserStatsFromRow,
  getResolvedGameScores, resolveFinishedGameWinner,
  buildQuizTotalsFromFinishedGames, buildHeadToHeadFromFinishedGames,
  syncQuizTotalsIntoStats, mergeOpponentStatsByMax,
  doesUserStatsRowNeedRepair,
  getXpMetaFromCategoryStats, getTotalXpFromStats, getXpBreakdownFromStats,
  addXpToStats, deductXpFromStats,
  normalizeKeywordText,
  getKeywordGroupsFromQuestion,
  isKeywordQuestion, isWhoAmIQuestion,
  evaluateKeywordAnswer, autoExtractKeywordGroups,
  getQuizTimeLimit, cloneDuelGameSnapshot,
} from '../lib/quizHelpers';
import { CATEGORIES } from '../data/constants';
import { SAMPLE_QUESTIONS } from '../data/quizQuestions';
import { friendlyError } from '../lib/friendlyError';
import {
  createDuel as dsCreateDuel,
  acceptDuel as dsAcceptDuel,
  getDuelWithQuestions as dsGetDuelWithQuestions,
  submitDuelAnswer as dsSubmitDuelAnswer,
  forfeitDuel as dsForfeitDuel,
  saveDuelState as dsSaveDuelState,
  startDuelRound as dsStartDuelRound,
  getUserStats as dsGetUserStats,
  reportQuestion as dsReportQuestion,
  updateQuestionReportStatus as dsUpdateQuestionReportStatus,
  resolveUserIdentity as dsResolveUserIdentity,
} from '../lib/dataService';
import { normalizeQuestionText, getQuestionPerformanceKey } from '../lib/questionKey';

export function useDuelGame(deps) {
  const {
    user,
    showToast,
    sendNotification,
    allUsers,
    setCurrentView,
    userStats, setUserStats,
    setStatsByUserId,
    // Late-bound via refs (defined after hook call in App.jsx)
    lateDepsRef,
    questionPerformance,
    adaptiveLearningEnabled,
    questionReports, setQuestionReports,
    sanitizeGoalValue,
  } = deps;

  // Late-bound deps accessed via ref (loadData, checkBadges, updateChallengeProgress, updateWeeklyProgress)
  const getLateDeps = () => lateDepsRef.current || {};

  // ===================== State =====================
  const [activeGames, setActiveGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('profi');
  const [currentGame, setCurrentGame] = useState(null);
  const [categoryRound, setCategoryRound] = useState(0);
  const [questionInCategory, setQuestionInCategory] = useState(0);
  const [quizCategory, setQuizCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentCategoryQuestions, setCurrentCategoryQuestions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const quizActiveRef = useRef(false);
  const answerSubmissionLockRef = useRef(false);
  const answerSavePromiseRef = useRef(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [duelResult, setDuelResult] = useState(null);
  const [categoryRoundResult, setCategoryRoundResult] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState(null);
  const [keywordAnswerText, setKeywordAnswerText] = useState('');
  const [keywordAnswerEvaluation, setKeywordAnswerEvaluation] = useState(null);
  const [quizMCKeywordMode, setQuizMCKeywordMode] = useState(false);

  // ===================== Helpers =====================

  const resetAnswerSubmissionLock = () => {
    answerSubmissionLockRef.current = false;
  };

  const resetQuizKeywordState = () => {
    setKeywordAnswerText('');
    setKeywordAnswerEvaluation(null);
  };

  const resetQuizDuelRuntimeState = () => {
    resetAnswerSubmissionLock();
    setCurrentGame(null);
    setQuizCategory(null);
    setCurrentQuestion(null);
    setCurrentCategoryQuestions([]);
    setCategoryRound(0);
    setQuestionInCategory(0);
    setPlayerTurn(null);
    setWaitingForOpponent(false);
    setAnswered(false);
    setSelectedAnswers([]);
    setLastSelectedAnswer(null);
    setTimerActive(false);
    resetQuizKeywordState();
  };

  const syncLocalDuelGame = (gameInput) => {
    const nextGame = cloneDuelGameSnapshot(gameInput);
    if (!nextGame?.id) {
      return nextGame;
    }

    setCurrentGame((prev) => (prev?.id === nextGame.id ? nextGame : prev));
    setActiveGames((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.id === nextGame.id);
      if (isFinishedGameStatus(nextGame.status)) {
        return existingIndex === -1
          ? prev
          : prev.filter((entry) => entry.id !== nextGame.id);
      }
      if (existingIndex === -1) {
        return [nextGame, ...prev];
      }
      return prev.map((entry) => (entry.id === nextGame.id ? nextGame : entry));
    });
    setAllGames((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.id === nextGame.id);
      if (existingIndex === -1) {
        return [nextGame, ...prev];
      }
      return prev.map((entry) => (entry.id === nextGame.id ? nextGame : entry));
    });

    return nextGame;
  };

  const showDuelResultForGame = (gameInput, gamesSource = null, h2hOverride = null) => {
    const game = (gameInput && typeof gameInput === 'object') ? gameInput : null;
    if (!game || !user?.name) return;

    const opponentName = namesMatch(game.player1, user.name) ? game.player2 : game.player1;
    const { player1Score, player2Score } = getResolvedGameScores(game);
    const winner = resolveFinishedGameWinner(game);
    const h2h = h2hOverride || buildHeadToHeadFromFinishedGames(gamesSource || allGames, user.name, opponentName);

    setDuelResult({
      gameId: game.id,
      player1: game.player1,
      player2: game.player2,
      player1Score,
      player2Score,
      winner,
      myName: user.name,
      opponentName,
      h2h: {
        wins: h2h.wins || 0,
        losses: h2h.losses || 0,
        draws: h2h.draws || 0
      }
    });

    resetQuizDuelRuntimeState();
    setCategoryRoundResult(null);
    setCurrentView('quiz');
  };

  const handleForfeitDuel = async () => {
    if (!currentGame?.id) return;
    try {
      await dsForfeitDuel(currentGame.id);
    } catch (e) {
      console.warn('Aufgeben fehlgeschlagen:', e);
    }
    resetQuizDuelRuntimeState();
    setActiveGames(prev => prev.filter(g => g.id !== currentGame?.id));
  };

  // ===================== Stats helpers =====================

  const resolveUserStatsIdentity = async (userInput) => {
    if (userInput && typeof userInput === 'object') {
      const userId = String(userInput.id || '').trim();
      const userName = String(userInput.name || '').trim();
      if (userId) {
        return { userId, userName };
      }
      if (userName) {
        return resolveUserStatsIdentity(userName);
      }
      return null;
    }

    const userName = String(userInput || '').trim();
    if (!userName) return null;

    const identity = await dsResolveUserIdentity(userName);
    if (identity) {
      return identity;
    }

    const match = allUsers.find(u => String(u.name || '').toLowerCase() === userName.toLowerCase());
    return match ? { userId: match.id, userName: match.name } : null;
  };

  const saveUserStatsToSupabase = async () => {
    // NestJS backend manages stats server-side
    return true;
  };

  const getUserStatsFromSupabase = async (userInput) => {
    try {
      const identity = await resolveUserStatsIdentity(userInput);
      if (!identity?.userId) return null;
      const data = await dsGetUserStats({
        id: identity.userId,
        name: identity.userName
      });
      if (!data) return null;
      return buildUserStatsFromRow(data);
    } catch (error) {
      console.error('Get stats error:', error);
      return null;
    }
  };

  // ===================== Question picking =====================

  const getQuestionPerformanceEntry = (question, categoryHint = null) => {
    const key = getQuestionPerformanceKey(question, categoryHint);
    const raw = (questionPerformance && typeof questionPerformance === 'object') ? questionPerformance[key] : null;
    return {
      key,
      stats: {
        attempts: sanitizeGoalValue(raw?.attempts, 0),
        correct: sanitizeGoalValue(raw?.correct, 0),
        wrong: sanitizeGoalValue(raw?.wrong, 0),
        wrongStreak: sanitizeGoalValue(raw?.wrongStreak, 0),
        lastSeen: Number(raw?.lastSeen) || 0
      }
    };
  };

  const getAdaptiveQuestionWeight = (question, categoryHint = null) => {
    const { stats } = getQuestionPerformanceEntry(question, categoryHint);
    const attempts = stats.attempts;
    const wrongRate = attempts > 0 ? stats.wrong / attempts : 0.45;
    const unseenBonus = attempts === 0 ? 1.5 : 0;
    const staleDays = stats.lastSeen > 0
      ? Math.max(0, (Date.now() - stats.lastSeen) / (1000 * 60 * 60 * 24))
      : 7;
    const staleBonus = Math.min(1.5, staleDays / 10);
    const weight = 1 + (wrongRate * 3) + (stats.wrongStreak * 1.2) + unseenBonus + staleBonus;
    return Math.max(0.2, weight);
  };

  const pickLearningQuestions = (questions, count, resolveCategoryId = () => null) => {
    const source = Array.isArray(questions) ? questions.filter(Boolean) : [];
    const limit = Math.min(Math.max(0, Number(count) || 0), source.length);
    if (limit <= 0) return [];

    if (!adaptiveLearningEnabled) {
      return shuffleArray(source).slice(0, limit);
    }

    const pool = [...source];
    const selected = [];

    while (selected.length < limit && pool.length > 0) {
      const weights = pool.map((question) => getAdaptiveQuestionWeight(question, resolveCategoryId(question)));
      const totalWeight = weights.reduce((sum, value) => sum + value, 0);

      let pickedIndex = 0;
      if (totalWeight > 0) {
        let random = Math.random() * totalWeight;
        for (let idx = 0; idx < weights.length; idx++) {
          random -= weights[idx];
          if (random <= 0) {
            pickedIndex = idx;
            break;
          }
        }
      } else {
        pickedIndex = Math.floor(Math.random() * pool.length);
      }

      selected.push(pool[pickedIndex]);
      pool.splice(pickedIndex, 1);
    }

    return shuffleArray(selected);
  };

  /**
   * Stellt das `correct`-Feld für Duell-Fragen wieder her, wenn der Server es redaktiert hat.
   */
  const restoreCorrectForQuestions = (questions, categoryId, preparedQuestions = null) => {
    if (!Array.isArray(questions)) return questions;
    return questions.map((q, idx) => {
      if (!q || q.correct !== undefined) return q;
      if (isKeywordQuestion(q) || isWhoAmIQuestion(q)) return q;

      if (preparedQuestions && preparedQuestions[idx]?.correct !== undefined) {
        const local = preparedQuestions[idx];
        return { ...q, correct: local.correct, ...(local.multi !== undefined && { multi: local.multi }) };
      }

      const catId = String(categoryId || q.category || '').trim();
      if (!catId) return q;
      const localPool = SAMPLE_QUESTIONS[catId] || [];
      const qText = String(q.q || '').trim().toLowerCase();
      const localQ = localPool.find(lq => String(lq.q || '').trim().toLowerCase() === qText);
      if (!localQ || localQ.correct === undefined) return q;

      const shuffled = Array.isArray(q.a) ? q.a : [];
      const original = Array.isArray(localQ.a) ? localQ.a : [];
      const shuffledToOrig = shuffled.map(t =>
        original.findIndex(o => String(o || '').trim().toLowerCase() === String(t || '').trim().toLowerCase())
      );

      if (localQ.multi && Array.isArray(localQ.correct)) {
        const correctSet = new Set(localQ.correct.filter(Number.isInteger));
        const newCorrect = shuffled
          .map((_, si) => (correctSet.has(shuffledToOrig[si]) ? si : -1))
          .filter(i => i >= 0);
        if (newCorrect.length > 0) return { ...q, correct: newCorrect, multi: true };
      } else if (Number.isInteger(localQ.correct)) {
        const newIdx = shuffledToOrig.indexOf(localQ.correct);
        if (newIdx >= 0) return { ...q, correct: newIdx };
      }
      return q;
    });
  };

  const reportQuestionIssue = async ({ question, categoryId, source }) => {
    if (!question || !user?.name) return;
    const noteInput = window.prompt('Was ist unklar oder fehlerhaft? (optional)', '');
    if (noteInput === null) return;

    const note = String(noteInput || '').trim();
    const key = getQuestionPerformanceKey(question, categoryId);
    const category = String(categoryId || question?.category || 'unknown');
    const payload = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      questionKey: key,
      questionText: String(question.q || ''),
      category,
      source: String(source || 'unknown'),
      note,
      answers: Array.isArray(question.a) ? [...question.a] : [],
      reportedBy: user.name,
      reportedById: user.id || null,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    let savedRemotely = false;
    try {
      await dsReportQuestion({
        questionKey: payload.questionKey, questionText: payload.questionText,
        category: payload.category, source: payload.source,
        note: payload.note || null, answers: payload.answers,
        reportedBy: payload.reportedBy, reportedById: payload.reportedById,
        status: payload.status,
        question_key: payload.questionKey, question_text: payload.questionText,
        reported_by: payload.reportedBy, reported_by_id: payload.reportedById
      });
      savedRemotely = true;
    } catch (error) {
      console.log('question_reports table unavailable, fallback local only');
    }

    setQuestionReports((prev) => [payload, ...prev].slice(0, 500));
    showToast(
      savedRemotely
        ? 'Frage gemeldet. Danke für dein Feedback!'
        : 'Frage lokal gemeldet. Danke für dein Feedback!',
      'success'
    );
  };

  const toggleQuestionReportStatus = async (reportId) => {
    const existing = questionReports.find((entry) => entry.id === reportId);
    if (!existing) return;
    const nextStatus = existing.status === 'resolved' ? 'open' : 'resolved';

    setQuestionReports((prev) => prev.map((entry) => (
      entry.id === reportId
        ? { ...entry, status: nextStatus, resolvedAt: nextStatus === 'resolved' ? new Date().toISOString() : null }
        : entry
    )));
    if (!String(reportId).startsWith('local-')) {
      try {
        await dsUpdateQuestionReportStatus(reportId, nextStatus);
      } catch {
        // local state remains source of truth when remote update fails
      }
    }
    showToast(nextStatus === 'resolved' ? 'Meldung als erledigt markiert.' : 'Meldung wieder geoeffnet.', 'info', 1800);
  };

  // ===================== Game save / sync =====================

  const saveGameToSupabase = async (game, { onSaveError } = {}) => {
    const syncedGame = syncLocalDuelGame(game);
    try {
      await dsSaveDuelState(syncedGame);
      const persistedGame = await dsGetDuelWithQuestions(syncedGame.id, user?.id);
      return persistedGame?.id ? syncLocalDuelGame(persistedGame) : syncedGame;
    } catch (error) {
      console.error('Save game error:', error);
      onSaveError?.(error);
      try {
        const freshGame = await dsGetDuelWithQuestions(syncedGame.id, user?.id);
        if (freshGame?.id) return syncLocalDuelGame(freshGame);
      } catch {}
      return syncedGame;
    }
  };

  const syncQuizRuntimeFromPersistedGame = (gameInput) => {
    const syncedGame = syncLocalDuelGame(gameInput);
    if (!syncedGame?.id || !user?.name) {
      return syncedGame;
    }

    const roundIndex = Math.max(0, Number(syncedGame.categoryRound || 0));
    const round = syncedGame.categoryRounds?.[roundIndex] || null;
    const isPlayer1 = syncedGame.player1 === user.name;
    const myAnswers = round
      ? ((isPlayer1 ? round.player1Answers : round.player2Answers) || [])
      : [];
    const opponentAnswers = round
      ? ((isPlayer1 ? round.player2Answers : round.player1Answers) || [])
      : [];
    const questionCount = Array.isArray(round?.questions) ? round.questions.length : 0;
    const myRoundCompleted = questionCount > 0 && myAnswers.length >= questionCount;
    const opponentRoundCompleted = questionCount > 0 && opponentAnswers.length >= questionCount;

    setCategoryRound(roundIndex);
    setPlayerTurn(syncedGame.currentTurn || '');

    if (isFinishedGameStatus(syncedGame.status) && myRoundCompleted) {
      const gamesForH2h = allGames.some(g => g.id === syncedGame.id)
        ? allGames
        : [...allGames, syncedGame];
      showDuelResultForGame(syncedGame, gamesForH2h);
      return syncedGame;
    }

    setWaitingForOpponent(
      Boolean(
        questionCount > 0
        && myRoundCompleted
        && (
          !opponentRoundCompleted
          || syncedGame.currentTurn !== user.name
        )
      )
    );

    return syncedGame;
  };

  // ===================== Actions =====================

  const challengePlayer = async (opponent, timeoutMinutesInput = DEFAULT_CHALLENGE_TIMEOUT_MINUTES, opponentId = null) => {
    const now = Date.now();
    const timeoutMinutes = normalizeChallengeTimeoutMinutes(timeoutMinutesInput);
    const challengeExpiresAt = new Date(now + timeoutMinutes * 60 * 1000).toISOString();

    const existingGame = activeGames.find(g =>
      g.status !== 'finished' &&
      !isWaitingChallengeExpired(g, now) &&
      ((g.player1 === user.name && g.player2 === opponent) ||
       (g.player1 === opponent && g.player2 === user.name))
    );

    if (existingGame) {
      showToast(`Du hast bereits ein laufendes Spiel gegen ${opponent}!`, 'error');
      return;
    }

    try {
      const game = await dsCreateDuel({
        player1: user.name,
        player2: opponent,
        difficulty: selectedDifficulty,
        challengeTimeoutMinutes: timeoutMinutes,
        challengeExpiresAt,
        opponentId
      }, user?.id);

      if (game?.timerColumnsUnavailable) {
        showToast('Herausforderung gesendet. Zeitlimit: 48 Stunden.', 'info');
      }

      setActiveGames([...activeGames, game]);
      setSelectedOpponent(null);

      await sendNotification(
        opponent,
        '🎮 Neue Quizduell-Herausforderung',
        `${user.name} hat dich herausgefordert. Annahmefrist: ${formatDurationMinutesCompact(game.challengeTimeoutMinutes || timeoutMinutes)}.`,
        'info'
      );

      showToast(`Herausforderung an ${opponent} gesendet! Frist: ${formatDurationMinutesCompact(game.challengeTimeoutMinutes || timeoutMinutes)}.`, 'success');
    } catch (error) {
      console.error('Challenge error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const acceptChallenge = async (gameId) => {
    const game = activeGames.find(g => g.id === gameId);
    if (!game) return;

    if (isWaitingChallengeExpired(game)) {
      const loser = game.player2;
      const winner = game.player1;
      await autoForfeitGame(game, loser, winner, 'challenge_expired');
      showToast('Diese Herausforderung ist bereits abgelaufen.', 'warning');
      return;
    }

    try {
      const acceptedAt = new Date().toISOString();
      await dsAcceptDuel(gameId, user?.id);

      game.status = 'active';
      game.categoryRound = 0;
      game.categoryRounds = [];
      game.updatedAt = acceptedAt;
      game.currentTurn = game.player1;
      setActiveGames(prev => prev.map((entry) => (
        entry.id === gameId
          ? {
              ...entry,
              status: 'active',
              categoryRound: 0,
              categoryRounds: [],
              currentTurn: game.player1,
              updatedAt: acceptedAt
            }
          : entry
      )));
      setAllGames(prev => prev.map((entry) => (
        entry.id === gameId
          ? {
              ...entry,
              status: 'active',
              categoryRound: 0,
              categoryRounds: [],
              currentTurn: game.player1,
              updatedAt: acceptedAt
            }
          : entry
      )));

      if (game.player1 && game.player1 !== user.name) {
        await sendNotification(
          game.player1,
          '⚡ Herausforderung angenommen - du bist dran!',
          `${user.name} hat deine Quizduell-Herausforderung angenommen. Du darfst die erste Kategorie wählen.`,
          'info'
        );
      }

      setDuelResult(null);
      setCurrentGame(game);
      setCategoryRound(0);
      setQuestionInCategory(0);
      setPlayerTurn(game.currentTurn);
      setQuizCategory(null);
      setCurrentQuestion(null);
      setCurrentCategoryQuestions([]);
      resetAnswerSubmissionLock();
      setAnswered(false);
      setSelectedAnswers([]);
      setLastSelectedAnswer(null);
      setTimerActive(false);
      localStorage.removeItem(`quiz_waiting_reminder_${game.id}_${game.player2}`);
      resetQuizKeywordState();

      await saveGameToSupabase(game);

      setCurrentView('quiz');
    } catch (error) {
      console.error('Accept error:', error);
    }
  };

  const continueGame = async (gameId) => {
    const game = activeGames.find(g => g.id === gameId);
    if (!game) return;

    setDuelResult(null);
    setCurrentGame(game);
    setCategoryRound(game.categoryRound || 0);
    setQuestionInCategory(0);
    setPlayerTurn(game.currentTurn);
    setCurrentQuestion(null);
    resetAnswerSubmissionLock();
    setAnswered(false);
    setSelectedAnswers([]);
    setLastSelectedAnswer(null);
    setTimerActive(false);
    resetQuizKeywordState();

    if (game.categoryRounds && game.categoryRounds.length > 0) {
      const currentCatRound = game.categoryRounds[game.categoryRound || 0];
      if (currentCatRound) {
        const isPlayer1 = user.name === game.player1;
        const myAnswers = isPlayer1 ? currentCatRound.player1Answers : currentCatRound.player2Answers;

        if (myAnswers.length === 0 && currentCatRound.questions.length > 0) {
          setQuizCategory(currentCatRound.categoryId);
          setCurrentCategoryQuestions(currentCatRound.questions);
        }
      }
    }

    setCurrentView('quiz');
  };

  const continueGameSafe = async (gameId) => {
    const activeGame = activeGames.find(g => g.id === gameId);
    if (!activeGame) return;

    let game = cloneDuelGameSnapshot(activeGame);
    try {
      const latestGame = await dsGetDuelWithQuestions(gameId, user?.id);
      if (latestGame?.id === gameId) {
        game = latestGame;
      }
    } catch (error) {
      console.warn('Aktuellen Duel-Stand konnte nicht nachgeladen werden:', error);
    }

    const syncedGame = syncLocalDuelGame(game);
    const gameToContinue = syncedGame?.id ? syncedGame : game;

    setDuelResult(null);
    setCurrentGame(gameToContinue);
    setCategoryRound(gameToContinue.categoryRound || 0);
    setQuestionInCategory(0);
    setPlayerTurn(gameToContinue.currentTurn);
    setQuizCategory(null);
    setCurrentQuestion(null);
    setCurrentCategoryQuestions([]);
    resetAnswerSubmissionLock();
    setAnswered(false);
    setSelectedAnswers([]);
    setLastSelectedAnswer(null);
    setTimerActive(false);
    setWaitingForOpponent(false);
    resetQuizKeywordState();

    if (gameToContinue.categoryRounds && gameToContinue.categoryRounds.length > 0) {
      const currentCatRound = gameToContinue.categoryRounds[gameToContinue.categoryRound || 0];
      if (currentCatRound) {
        const isPlayer1 = user.name === gameToContinue.player1;
        const myAnswers = isPlayer1 ? currentCatRound.player1Answers : currentCatRound.player2Answers;
        const nextQuestionIndex = Math.max(0, myAnswers.length || 0);
        const hasPendingQuestions = currentCatRound.questions.length > 0
          && nextQuestionIndex < currentCatRound.questions.length;

        if (hasPendingQuestions) {
          const restoredQuestions = restoreCorrectForQuestions(currentCatRound.questions, currentCatRound.categoryId);
          setQuizCategory(currentCatRound.categoryId);
          setCurrentCategoryQuestions(restoredQuestions);

          if (nextQuestionIndex > 0) {
            setQuestionInCategory(nextQuestionIndex);
            setCurrentQuestion(restoredQuestions[nextQuestionIndex]);
            const timeLimit = getQuizTimeLimit(restoredQuestions[nextQuestionIndex], gameToContinue.difficulty);
            setTimeLeft(timeLimit);
            setTimerActive(true);
          }
        }
      }
    }

    setCurrentView('quiz');
  };

  const selectCategory = async (catId) => {
    if (!currentGame || currentGame.currentTurn !== user.name) return;

    setQuizCategory(catId);
    resetQuizKeywordState();

    let latestGame = null;
    try {
      latestGame = await dsGetDuelWithQuestions(currentGame.id, user?.id);
    } catch (error) {
      console.warn('Aktuellen Duel-Stand vor Kategorienwahl konnte nicht nachgeladen werden:', error);
    }

    const baseGame = latestGame?.id === currentGame.id
      ? syncLocalDuelGame(latestGame)
      : syncLocalDuelGame(cloneDuelGameSnapshot(currentGame));

    if (!baseGame?.id) {
      showToast('Quizduell konnte nicht geladen werden. Bitte erneut versuchen.', 'error', 2500);
      return;
    }

    const existingRounds = Array.isArray(baseGame.categoryRounds) ? baseGame.categoryRounds : [];
    const requestedRoundIndex = Math.max(
      Number(baseGame.categoryRound || 0),
      Number(currentGame.categoryRound || 0)
    );
    const roundIndex = Math.max(0, Math.min(requestedRoundIndex, existingRounds.length));
    const existingRound = existingRounds[roundIndex];
    if (existingRound?.categoryId) {
      const resumeQuestions = restoreCorrectForQuestions(existingRound.questions || [], existingRound.categoryId);
      setQuizCategory(existingRound.categoryId);
      setCurrentCategoryQuestions(resumeQuestions);
      setCurrentQuestion(resumeQuestions[0] || null);
      showToast('Diese Runde ist bereits gestartet und wird fortgesetzt.', 'info', 2200);
      return;
    }

    setCurrentCategoryQuestions([]);
    setQuestionInCategory(0);
    setCurrentQuestion(null);
    resetAnswerSubmissionLock();
    setAnswered(false);
    setSelectedAnswers([]);
    setLastSelectedAnswer(null);
    setTimerActive(false);

    let persistedGame;
    try {
      persistedGame = await dsStartDuelRound(currentGame.id, catId, user?.id);
    } catch (error) {
      console.error('Runde konnte nicht gestartet werden:', error);
      setQuizCategory(null);
      setCurrentCategoryQuestions([]);
      setCurrentQuestion(null);
      setTimerActive(false);
      showToast(friendlyError(error) || 'Die Kategorie konnte nicht gespeichert werden. Bitte waehle sie erneut.', 'error', 3500);
      return;
    }

    const syncedGame = syncQuizRuntimeFromPersistedGame(persistedGame);
    const persistedRound = syncedGame?.categoryRounds?.[roundIndex];
    const liveQuestions = Array.isArray(persistedRound?.questions) ? persistedRound.questions : [];

    if (!persistedRound?.categoryId || !liveQuestions.length) {
      setQuizCategory(null);
      setCurrentCategoryQuestions([]);
      setCurrentQuestion(null);
      setTimerActive(false);
      showToast('Die Kategorie konnte nicht gespeichert werden. Bitte waehle sie erneut.', 'error', 3500);
      return;
    }

    const questionsToShow = restoreCorrectForQuestions(liveQuestions, catId);
    setCurrentCategoryQuestions(questionsToShow);
    setCurrentQuestion(questionsToShow[0] || null);
    if (questionsToShow[0]) {
      const timeLimit = getQuizTimeLimit(questionsToShow[0], syncedGame?.difficulty || currentGame.difficulty);
      setTimeLeft(timeLimit);
      setTimerActive(true);
    }
  };

  const handleTimeUp = async () => {
    if (answered || answerSubmissionLockRef.current || !currentGame) return;
    answerSubmissionLockRef.current = true;
    setAnswered(true);
    setTimerActive(false);

    if ((isKeywordQuestion(currentQuestion) || isWhoAmIQuestion(currentQuestion)) && keywordAnswerText.trim()) {
      const timedOutEvaluation = evaluateKeywordAnswer(currentQuestion, keywordAnswerText);
      setKeywordAnswerEvaluation({
        ...timedOutEvaluation,
        isCorrect: false,
        timedOut: true
      });
    }

    const p = savePlayerAnswer(false, true, {
      answerType: isWhoAmIQuestion(currentQuestion)
        ? 'whoami'
        : (isKeywordQuestion(currentQuestion) ? 'keyword' : 'choice'),
      keywordText: (isKeywordQuestion(currentQuestion) || isWhoAmIQuestion(currentQuestion))
        ? keywordAnswerText.trim()
        : null
    });
    answerSavePromiseRef.current = p;
    await p;
    answerSavePromiseRef.current = null;
  };

  const toggleAnswer = (answerIndex) => {
    if (answered || !currentGame) return;
    setSelectedAnswers(prev => {
      if (prev.includes(answerIndex)) {
        return prev.filter(i => i !== answerIndex);
      } else {
        return [...prev, answerIndex];
      }
    });
  };

  const confirmMultiSelectAnswer = async () => {
    if (answered || answerSubmissionLockRef.current || !currentGame || !currentQuestion.multi) return;
    answerSubmissionLockRef.current = true;
    setAnswered(true);
    setTimerActive(false);

    const correctAnswers = currentQuestion.correct;
    const isCorrect = correctAnswers !== undefined
      ? (selectedAnswers.length === correctAnswers.length &&
         selectedAnswers.every(idx => correctAnswers.includes(idx)))
      : false;

    const p = savePlayerAnswer(isCorrect, false, {
      answerType: 'multi',
      selectedAnswers: [...selectedAnswers]
    });
    answerSavePromiseRef.current = p;
    await p;
    answerSavePromiseRef.current = null;
  };

  const answerQuestion = async (answerIndex) => {
    if (answered || answerSubmissionLockRef.current || !currentGame) return;
    if (isKeywordQuestion(currentQuestion) || isWhoAmIQuestion(currentQuestion)) return;

    if (currentQuestion.multi) {
      toggleAnswer(answerIndex);
      return;
    }

    answerSubmissionLockRef.current = true;
    setAnswered(true);
    setTimerActive(false);
    setLastSelectedAnswer(answerIndex);

    const isCorrect = currentQuestion.correct !== undefined
      ? answerIndex === currentQuestion.correct
      : false;
    const p = savePlayerAnswer(isCorrect, false, {
      answerType: 'single',
      selectedAnswer: answerIndex
    });
    answerSavePromiseRef.current = p;
    await p;
    answerSavePromiseRef.current = null;
  };

  const submitKeywordAnswer = async () => {
    if (answered || answerSubmissionLockRef.current || !currentGame || !currentQuestion) return;
    if (!isKeywordQuestion(currentQuestion) && !isWhoAmIQuestion(currentQuestion) && !quizMCKeywordMode) return;
    const trimmedAnswer = keywordAnswerText.trim();
    if (!trimmedAnswer) {
      showToast('Bitte gib zuerst eine Freitext-Antwort ein.', 'error', 1800);
      return;
    }
    let evaluation;
    if (isKeywordQuestion(currentQuestion) || isWhoAmIQuestion(currentQuestion)) {
      evaluation = evaluateKeywordAnswer(currentQuestion, keywordAnswerText);
    } else {
      const correctText = currentQuestion.multi && Array.isArray(currentQuestion.correct)
        ? currentQuestion.correct.map(idx => String(currentQuestion.a?.[idx] || '')).join('. ')
        : String(currentQuestion.a?.[currentQuestion.correct] || '');
      const groups = autoExtractKeywordGroups(correctText);
      const fakeQ = { keywordGroups: groups, minKeywordGroups: Math.max(1, Math.ceil(groups.length * 0.5)) };
      evaluation = evaluateKeywordAnswer(fakeQ, keywordAnswerText);
    }
    setKeywordAnswerEvaluation(evaluation);
    answerSubmissionLockRef.current = true;
    setAnswered(true);
    setTimerActive(false);
    const answerType = isWhoAmIQuestion(currentQuestion)
      ? 'whoami'
      : 'keyword';
    const p = savePlayerAnswer(evaluation.isCorrect, false, {
      answerType,
      keywordText: trimmedAnswer,
      keywordEvaluation: {
        requiredGroups: evaluation.requiredGroups,
        matchedCount: evaluation.matchedCount,
        matchedLabels: evaluation.matchedLabels,
        missingLabels: evaluation.missingLabels,
        scorePercent: evaluation.scorePercent,
        basePoints: evaluation.basePoints,
        bonusPoints: evaluation.bonusPoints,
        awardedPoints: evaluation.awardedPoints
      }
    });
    answerSavePromiseRef.current = p;
    await p;
    answerSavePromiseRef.current = null;
  };

  const savePlayerAnswer = async (isCorrect, isTimeout, answerMeta = {}) => {
    let gameSnapshot = currentGame;
    let currentRoundIndex = gameSnapshot?.categoryRound || 0;
    const currentQuestionIndex = questionInCategory;
    let currentCategoryRound = gameSnapshot?.categoryRounds?.[currentRoundIndex];

    if (!currentCategoryRound) {
      try {
        const refreshedGame = await dsGetDuelWithQuestions(gameSnapshot?.id, user?.id);
        const syncedGame = refreshedGame?.id ? syncQuizRuntimeFromPersistedGame(refreshedGame) : null;
        if (syncedGame?.id) {
          gameSnapshot = syncedGame;
          currentRoundIndex = gameSnapshot.categoryRound || 0;
          currentCategoryRound = gameSnapshot.categoryRounds?.[currentRoundIndex];
        }
      } catch (error) {
        console.warn('Duel-Stand vor Antwort konnte nicht nachgeladen werden:', error);
      }
    }

    if (!currentCategoryRound) {
      console.error('[savePlayerAnswer] currentCategoryRound is undefined — round index:', currentRoundIndex, 'rounds:', gameSnapshot?.categoryRounds?.length);
      showToast('Quizduell-Stand ist inkonsistent. Bitte oeffne die Runde erneut.', 'error', 2500);
      return;
    }

    const isPlayer1 = user.name === gameSnapshot.player1;
    const answerType = String(answerMeta?.answerType || '');
    const correctnessKnown = answerType === 'keyword'
      || answerType === 'whoami'
      || currentQuestion?.correct !== undefined;

    // Daily Challenge Progress
    getLateDeps().updateChallengeProgress?.('answer_questions', 1);
    if (correctnessKnown && isCorrect) {
      getLateDeps().updateChallengeProgress?.('correct_answers', 1);
    }
    if (quizCategory) {
      getLateDeps().updateChallengeProgress?.('category_master', 1, quizCategory);
    }
    getLateDeps().updateChallengeProgress?.('quiz_play', 1);
    getLateDeps().updateWeeklyProgress?.('quizAnswers', 1);
    if (correctnessKnown) {
      getLateDeps().trackQuestionPerformance?.(currentQuestion, quizCategory, isCorrect);
    }

    const answerPoints = answerType === 'keyword'
      ? Math.max(0, Number(answerMeta?.keywordEvaluation?.awardedPoints) || 0)
      : answerType === 'whoami'
        ? (isCorrect ? 1 : 0)
      : (isCorrect ? 1 : 0);

    if (answerPoints > 0) {
      if (isPlayer1) {
        gameSnapshot.player1Score += answerPoints;
      } else {
        gameSnapshot.player2Score += answerPoints;
      }
    }

    const answer = {
      questionIndex: questionInCategory,
      correct: correctnessKnown ? isCorrect : null,
      timeout: isTimeout,
      points: correctnessKnown ? answerPoints : 0,
      ...answerMeta
    };

    if (isPlayer1) {
      currentCategoryRound.player1Answers.push(answer);
    } else {
      currentCategoryRound.player2Answers.push(answer);
    }

    // Stats aktualisieren
    const stats = ensureUserStatsStructure(userStats || createEmptyUserStats());

    if (!stats.categoryStats[quizCategory]) {
      stats.categoryStats[quizCategory] = { correct: 0, incorrect: 0, total: 0 };
    }

    if (correctnessKnown) {
      if (isCorrect) {
        stats.categoryStats[quizCategory].correct++;
      } else {
        stats.categoryStats[quizCategory].incorrect++;
      }
    }
    stats.categoryStats[quizCategory].total++;

    await saveUserStatsToSupabase(user, stats);
    setUserStats(stats);

    // Duel: Antwort an Backend übermitteln
    const shouldUseAuthoritativeDuelAnswer =
      currentQuestion?.duelQuestionId
      && gameSnapshot?.id
      && !isTimeout
      && answerMeta?.answerType === 'single'
      && Number.isInteger(answerMeta?.selectedAnswer);

    let authoritativeQuestionsSet = false;

    if (shouldUseAuthoritativeDuelAnswer) {
      let answerPersistedOnServer = false;

      try {
        await dsSubmitDuelAnswer(gameSnapshot.id, currentQuestion.duelQuestionId, answerMeta.selectedAnswer);
        answerPersistedOnServer = true;
      } catch (error) {
        if (error?.status === 409) {
          answerPersistedOnServer = true;
        } else {
          console.warn('submitDuelAnswer fehlgeschlagen (kein Retry):', error?.status, error?.message);
        }
      }

      try {
        const refreshedGame = await dsGetDuelWithQuestions(gameSnapshot.id, user?.id);
        const authoritativeGame = refreshedGame?.id ? syncLocalDuelGame(refreshedGame) : null;
        const authoritativeRound = authoritativeGame?.categoryRounds?.[currentRoundIndex];
        const authoritativeQuestions = Array.isArray(authoritativeRound?.questions)
          ? authoritativeRound.questions
          : null;

        if (authoritativeQuestions?.length) {
          const restoredAuthQuestions = restoreCorrectForQuestions(authoritativeQuestions, quizCategory);
          setCurrentCategoryQuestions(restoredAuthQuestions);
          authoritativeQuestionsSet = true;
          const targetQ = restoredAuthQuestions[currentQuestionIndex];
          if (targetQ?.duelQuestionId) {
            setCurrentQuestion(prev =>
              prev?.duelQuestionId === targetQ.duelQuestionId ? targetQ : prev
            );
          }
        }

        if (answerPersistedOnServer) {
          return;
        }
      } catch (error) {
        console.warn('Duel-Refresh nach Antwort fehlgeschlagen:', error);
      }
    }

    const persistedGame = await saveGameToSupabase(gameSnapshot);
    const persistedRound = persistedGame?.categoryRounds?.[currentRoundIndex];
    const persistedQuestions = Array.isArray(persistedRound?.questions) ? persistedRound.questions : null;
    if (persistedQuestions?.length) {
      if (!authoritativeQuestionsSet) {
        const restoredPersisted = restoreCorrectForQuestions(persistedQuestions, quizCategory);
        setCurrentCategoryQuestions(restoredPersisted);
        if (restoredPersisted[currentQuestionIndex]) {
          setCurrentQuestion(restoredPersisted[currentQuestionIndex]);
        }
      }
    }
  };

  const proceedToNextRound = async () => {
    const isPlayer1 = user.name === currentGame.player1;
    const currentCategoryRound = currentGame.categoryRounds[currentGame.categoryRound];
    const questionsInCurrentCategory = currentCategoryRound.questions.length;

    if (questionInCategory < questionsInCurrentCategory - 1) {
      const nextQuestionIndex = questionInCategory + 1;
      setQuestionInCategory(nextQuestionIndex);
      setCurrentQuestion(currentCategoryQuestions[nextQuestionIndex]);
      resetAnswerSubmissionLock();
      setAnswered(false);
      setSelectedAnswers([]);
      setLastSelectedAnswer(null);
      resetQuizKeywordState();

      const timeLimit = getQuizTimeLimit(currentCategoryQuestions[nextQuestionIndex], currentGame.difficulty);
      setTimeLeft(timeLimit);
      setTimerActive(true);
      return;
    }

    const player1Done = currentCategoryRound.player1Answers.length >= questionsInCurrentCategory;
    const player2Done = currentCategoryRound.player2Answers.length >= questionsInCurrentCategory;

    if (isPlayer1 && !player2Done) {
      setWaitingForOpponent(true);
      setQuizCategory(null);
      setCurrentQuestion(null);
      resetQuizKeywordState();

      if (answerSavePromiseRef.current) {
        await answerSavePromiseRef.current.catch(() => {});
      }
      let gameForPatch = cloneDuelGameSnapshot(currentGame);
      try {
        const fresh = await dsGetDuelWithQuestions(currentGame.id, user?.id);
        if (fresh?.id) gameForPatch = cloneDuelGameSnapshot(fresh);
      } catch (e) {
        console.warn('proceedToNextRound: GET vor PATCH fehlgeschlagen, nutze currentGame', e);
      }
      gameForPatch.currentTurn = currentGame.player2;

      syncQuizRuntimeFromPersistedGame(await saveGameToSupabase(gameForPatch));

      await sendNotification(
        currentGame.player2,
        '⚡ Du bist dran!',
        `${user.name} hat die Kategorie "${currentCategoryRound.categoryName}" gespielt. Jetzt bist du dran mit den gleichen Fragen!`,
        'info'
      );
      return;
    }

    if (!isPlayer1 && !player1Done) {
      setWaitingForOpponent(true);
      setQuizCategory(null);
      setCurrentQuestion(null);
      resetQuizKeywordState();

      if (answerSavePromiseRef.current) {
        await answerSavePromiseRef.current.catch(() => {});
      }
      let gameForPatch = cloneDuelGameSnapshot(currentGame);
      try {
        const fresh = await dsGetDuelWithQuestions(currentGame.id, user?.id);
        if (fresh?.id) gameForPatch = cloneDuelGameSnapshot(fresh);
      } catch (e) {
        console.warn('proceedToNextRound: GET vor PATCH fehlgeschlagen, nutze currentGame', e);
      }
      gameForPatch.currentTurn = currentGame.player1;

      syncQuizRuntimeFromPersistedGame(await saveGameToSupabase(gameForPatch));

      await sendNotification(
        currentGame.player1,
        '⚡ Du bist dran!',
        `${user.name} hat die Kategorie "${currentCategoryRound.categoryName}" gespielt. Jetzt bist du dran mit den gleichen Fragen!`,
        'info'
      );
      return;
    }

    // Beide Spieler fertig — Runden-Ergebnis anzeigen
    setCategoryRoundResult({
      round: currentGame.categoryRound,
      categoryId: currentCategoryRound.categoryId,
      categoryName: currentCategoryRound.categoryName,
      questions: currentCategoryRound.questions,
      myAnswers: isPlayer1 ? currentCategoryRound.player1Answers : currentCategoryRound.player2Answers,
      opponentAnswers: isPlayer1 ? currentCategoryRound.player2Answers : currentCategoryRound.player1Answers,
      myName: user.name,
      opponentName: isPlayer1 ? currentGame.player2 : currentGame.player1,
      player1Score: currentGame.player1Score,
      player2Score: currentGame.player2Score,
      player1Name: currentGame.player1,
      player2Name: currentGame.player2,
      isLastRound: currentGame.categoryRound >= 3,
    });
    setQuizCategory(null);
    setCurrentQuestion(null);
    setTimerActive(false);
  };

  const proceedAfterCategoryResult = async () => {
    const alreadyProcessed = categoryRoundResult &&
      (currentGame.categoryRound || 0) > (categoryRoundResult.round || 0);

    setCategoryRoundResult(null);

    if (alreadyProcessed) {
      return;
    }

    const currentCategoryRound = currentGame.categoryRounds[currentGame.categoryRound];

    if (currentGame.categoryRound < 3) {
      currentGame.categoryRound++;

      const nextChooser = currentCategoryRound.chooser === currentGame.player1
        ? currentGame.player2
        : currentGame.player1;

      currentGame.currentTurn = nextChooser;

      setCategoryRound(currentGame.categoryRound);
      setQuestionInCategory(0);
      setQuizCategory(null);
      setCurrentQuestion(null);
      setCurrentCategoryQuestions([]);
      setPlayerTurn(nextChooser);
      setWaitingForOpponent(false);
      resetAnswerSubmissionLock();
      setAnswered(false);
      setSelectedAnswers([]);
      setLastSelectedAnswer(null);
      resetQuizKeywordState();
      setTimerActive(false);

      const savedAfterRound = await saveGameToSupabase(currentGame);
      if (savedAfterRound?.id) syncQuizRuntimeFromPersistedGame(savedAfterRound);

      if (nextChooser !== user.name) {
        setWaitingForOpponent(true);
        await sendNotification(
          nextChooser,
          '🎯 Wähle eine Kategorie!',
          `Runde ${currentGame.categoryRound + 1}/4 - Du darfst die nächste Kategorie wählen!`,
          'info'
        );
      } else {
        setWaitingForOpponent(false);
      }
    } else {
      await finishGame();
    }
  };

  const resumeCategoryRound = () => {
    if (!currentGame || !currentGame.categoryRounds) return;

    const currentCategoryRound = currentGame.categoryRounds[currentGame.categoryRound];
    if (!currentCategoryRound) return;

    const isPlayer1 = user.name === currentGame.player1;
    const myAnswers = isPlayer1 ? currentCategoryRound.player1Answers : currentCategoryRound.player2Answers;
    const nextQuestionIndex = Math.max(0, myAnswers.length || 0);
    if (nextQuestionIndex >= currentCategoryRound.questions.length) return;

    const restoredQuestions = restoreCorrectForQuestions(
      currentCategoryRound.questions,
      currentCategoryRound.categoryId
    );

    setQuizCategory(currentCategoryRound.categoryId);
    setCurrentCategoryQuestions(restoredQuestions);
    setQuestionInCategory(nextQuestionIndex);
    setCurrentQuestion(restoredQuestions[nextQuestionIndex]);
    resetAnswerSubmissionLock();
    setAnswered(false);
    setSelectedAnswers([]);
    setLastSelectedAnswer(null);
    setWaitingForOpponent(false);
    resetQuizKeywordState();

    const timeLimit = getQuizTimeLimit(restoredQuestions[nextQuestionIndex], currentGame.difficulty);
    setTimeLeft(timeLimit);
    setTimerActive(true);
  };

  const autoForfeitGame = async (game, loser, winner) => {
    try {
      setAllGames(prev => prev.map(g => g.id === game.id ? { ...g, status: 'finished', winner } : g));
      setActiveGames(prev => prev.filter(g => g.id !== game.id));
      localStorage.removeItem(`quiz_reminder_${game.id}_${game.currentTurn}`);
      localStorage.removeItem(`quiz_waiting_reminder_${game.id}_${game.player2}`);
    } catch (e) {
      console.warn('autoForfeitGame Fehler:', e);
    }
  };

  const checkExpiredAndRemindGames = async (games) => {
    if (!user?.name) return;
    const now = Date.now();
    const H24 = 24 * 60 * 60 * 1000;
    const H48 = 48 * 60 * 60 * 1000;
    const H1 = 60 * 60 * 1000;

    for (const game of games) {
      if (game.status === 'finished') continue;
      const isMine = game.player1 === user.name || game.player2 === user.name;
      if (!isMine) continue;

      if (game.status === 'waiting') {
        const remainingMs = getWaitingChallengeRemainingMs(game, now);
        if (!Number.isFinite(remainingMs)) continue;

        if (remainingMs <= 0) {
          const loser = game.player2;
          const winner = game.player1;
          await autoForfeitGame(game, loser, winner, 'challenge_expired');
          continue;
        }

        const reminderTarget = game.player2;
        if (reminderTarget !== user.name) continue;

        const timeoutMs = getChallengeTimeoutMs(game);
        const createdTs = parseTimestampSafe(game.createdAt || game.updatedAt);
        if (createdTs === null) continue;

        const elapsedMs = now - createdTs;
        const reminderThresholdMs = Math.min(H24, Math.max(H1, Math.floor(timeoutMs / 2)));
        if (elapsedMs < reminderThresholdMs) continue;

        const reminderKey = `quiz_waiting_reminder_${game.id}_${reminderTarget}`;
        if (localStorage.getItem(reminderKey)) continue;

        const opponent = game.player1;
        const minutesLeft = Math.max(1, Math.ceil(remainingMs / 60000));
        await sendNotification(
          reminderTarget,
          '⏰ Herausforderung läuft bald ab',
          `Du hast noch ca. ${formatDurationMinutesCompact(minutesLeft)} um die Herausforderung von ${opponent} anzunehmen.`,
          'warning'
        );
        localStorage.setItem(reminderKey, now.toString());
        continue;
      }

      const updatedAtTs = parseTimestampSafe(game.updatedAt);
      if (updatedAtTs === null) continue;
      const elapsed = now - updatedAtTs;

      if (elapsed >= H48) {
        const loser = game.currentTurn;
        const winner = game.player1 === loser ? game.player2 : game.player1;
        await autoForfeitGame(game, loser, winner, 'turn_timeout');
      } else if (elapsed >= H24) {
        const reminderTarget = game.currentTurn;
        if (reminderTarget !== user.name) continue;
        const reminderKey = `quiz_reminder_${game.id}_${reminderTarget}`;
        const lastSent = localStorage.getItem(reminderKey);
        if (lastSent && now - parseInt(lastSent) < H24) continue;

        const opponent = game.player1 === reminderTarget ? game.player2 : game.player1;
        const hoursLeft = Math.round((H48 - elapsed) / 3600000);
        await sendNotification(
          reminderTarget,
          '⏰ Quizduell-Erinnerung',
          `Du hast noch ca. ${hoursLeft}h für deinen Zug gegen ${opponent} – danach zählt es als Niederlage!`,
          'warning'
        );
        localStorage.setItem(reminderKey, now.toString());
      }
    }
  };

  const finishGame = async () => {
    currentGame.status = 'finished';

    let winner = null;
    if (currentGame.player1Score > currentGame.player2Score) {
      winner = currentGame.player1;
    } else if (currentGame.player2Score > currentGame.player1Score) {
      winner = currentGame.player2;
    }
    currentGame.winner = winner;

    try {
      const savedGame = await saveGameToSupabase(currentGame);
      if (!isFinishedGameStatus(savedGame?.status)) {
        console.warn('[finishGame] Server hat Spielabschluss abgelehnt (Status:', savedGame?.status, '— Runden:', savedGame?.categoryRounds?.length, '). Abbruch.');
        if (savedGame?.id) syncQuizRuntimeFromPersistedGame(savedGame);
        setWaitingForOpponent(true);
        return;
      }
      const opponentName = user.name === currentGame.player1 ? currentGame.player2 : currentGame.player1;
      if (opponentName) {
        let opponentTitle = '🏁 Quizduell beendet';
        let opponentMessage = `Quizduell gegen ${user.name} ist beendet.`;

        if (winner === null) {
          opponentTitle = '🤝 Quizduell unentschieden';
          opponentMessage = `Dein Quizduell gegen ${user.name} endete unentschieden.`;
        } else if (winner === opponentName) {
          opponentTitle = '🏆 Quizduell gewonnen';
          opponentMessage = `Du hast das Quizduell gegen ${user.name} gewonnen!`;
        } else {
          opponentTitle = '😔 Quizduell verloren';
          opponentMessage = `Du hast das Quizduell gegen ${user.name} verloren.`;
        }

        await sendNotification(opponentName, opponentTitle, opponentMessage, 'info');
      }

      let updatedH2h = { wins: 0, losses: 0, draws: 0 };
      try {
        const existingStats = await getUserStatsFromSupabase(user);
        let stats = ensureUserStatsStructure(existingStats || createEmptyUserStats());

        const opponent = user.name === currentGame.player1 ? currentGame.player2 : currentGame.player1;

        if (!stats.opponents[opponent]) {
          stats.opponents[opponent] = { wins: 0, losses: 0, draws: 0 };
        }

        if (winner === user.name) {
          stats.wins++;
          stats.opponents[opponent].wins++;
          stats.winStreak++;
          if (stats.winStreak > stats.bestWinStreak) {
            stats.bestWinStreak = stats.winStreak;
          }

          const xpResult = addXpToStats(
            stats,
            'quizWins',
            XP_REWARDS.QUIZ_WIN,
            `quiz_win_${currentGame.id}_${user.id}`
          );
          stats = xpResult.stats;

          if (xpResult.addedXp > 0) {
            showToast(`+${xpResult.addedXp} XP • Quizduell-Sieg`, 'success', 2500);
          }
        } else if (winner === null) {
          stats.draws++;
          stats.opponents[opponent].draws++;
        } else {
          stats.losses++;
          stats.opponents[opponent].losses++;
          stats.winStreak = 0;
        }

        await saveUserStatsToSupabase(user, stats);
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
              xpBreakdown: getXpBreakdownFromStats(stats)
            }
          };
        });

        const allGamesWithSaved = allGames.some(g => g.id === savedGame.id)
          ? allGames.map(g => g.id === savedGame.id ? savedGame : g)
          : [...allGames, savedGame];
        updatedH2h = buildHeadToHeadFromFinishedGames(allGamesWithSaved, user.name, opponent);
      } catch (error) {
        console.error('Stats update error:', error);
      }

      const h2h = updatedH2h;

      setDuelResult({
        player1: currentGame.player1,
        player2: currentGame.player2,
        player1Score: currentGame.player1Score,
        player2Score: currentGame.player2Score,
        winner,
        myName: user.name,
        opponentName,
        h2h: { wins: h2h.wins || 0, losses: h2h.losses || 0, draws: h2h.draws || 0 }
      });

      setCurrentGame(null);
      setQuizCategory(null);
      setCurrentQuestion(null);
      setCurrentCategoryQuestions([]);
      setCategoryRound(0);
      setQuestionInCategory(0);
      setPlayerTurn(null);
      setWaitingForOpponent(false);
      setAnswered(false);
      setSelectedAnswers([]);
      setLastSelectedAnswer(null);
      setTimerActive(false);
      resetQuizKeywordState();

      getLateDeps().loadData?.();
      setCurrentView('quiz');
      getLateDeps().checkBadges?.();
    } catch (error) {
      console.error('Finish error:', error);
    }
  };

  // ===================== Return =====================
  return {
    // State (for external use, e.g. loadData sets these)
    activeGames, setActiveGames,
    allGames, setAllGames,

    // QuizView props
    selectedDifficulty, setSelectedDifficulty,
    currentGame,
    quizCategory,
    questionInCategory,
    playerTurn,
    selectCategory,
    waitingForOpponent,
    startCategoryAsSecondPlayer: resumeCategoryRound,
    currentQuestion,
    timeLeft, setTimeLeft,
    answered,
    selectedAnswers,
    lastSelectedAnswer,
    isKeywordQuestion,
    isWhoAmIQuestion,
    keywordAnswerText, setKeywordAnswerText,
    keywordAnswerEvaluation,
    submitKeywordAnswer,
    quizMCKeywordMode, setQuizMCKeywordMode,
    answerQuestion,
    reportQuestionIssue,
    confirmMultiSelectAnswer,
    proceedToNextRound,
    duelResult, setDuelResult,
    showDuelResultForGame,
    categoryRoundResult,
    proceedAfterCategoryResult,
    onForfeit: handleForfeitDuel,

    // Actions used by App.jsx
    challengePlayer,
    acceptChallenge,
    continueGame,
    continueGameSafe,
    handleTimeUp,
    toggleAnswer,
    checkExpiredAndRemindGames,
    autoForfeitGame,
    syncLocalDuelGame,
    syncQuizRuntimeFromPersistedGame,
    resetQuizDuelRuntimeState,

    // Refs
    quizActiveRef,
    timerActive, setTimerActive,
    answerSubmissionLockRef,

    // Helpers re-exported for App.jsx usage
    normalizePlayerName,
    namesMatch,
    isFinishedGameStatus,
    cloneDuelGameSnapshot,
    isWaitingChallengeExpired,
    getWaitingChallengeRemainingMs,
    formatDurationMinutesCompact,
    ensureUserStatsStructure,
    createEmptyUserStats,
    buildUserStatsFromRow,
    syncQuizTotalsIntoStats,
    mergeOpponentStatsByMax,
    doesUserStatsRowNeedRepair,
    getResolvedGameScores,
    resolveFinishedGameWinner,
    addXpToStats,
    deductXpFromStats,
    getTotalXpFromStats,
    getXpBreakdownFromStats,
    getXpMetaFromCategoryStats,
    toSafeInt,
    getFirstSafeInt,
    evaluateKeywordAnswer,
    autoExtractKeywordGroups,
    normalizeKeywordText,
    getKeywordGroupsFromQuestion,
    isKeywordFlashcard: isKeywordQuestion,
    getQuizTimeLimit,
    shuffleArray,
    buildHeadToHeadFromFinishedGames,
    buildQuizTotalsFromFinishedGames,

    // Stats helpers
    getUserStatsFromSupabase,
    saveUserStatsToSupabase,
    resolveUserStatsIdentity,

    // Question helpers
    pickLearningQuestions,
    restoreCorrectForQuestions,
    toggleQuestionReportStatus,
    getQuestionPerformanceKey,
    getQuestionPerformanceEntry,
    getAdaptiveQuestionWeight,
    normalizeQuestionText,

    // Constants re-exported
    DIFFICULTY_SETTINGS,
    DEFAULT_CHALLENGE_TIMEOUT_MINUTES,
    CHALLENGE_TIMEOUT_BOUNDS,
    XP_REWARDS,
    XP_META_KEY: '__meta',
    XP_BREAKDOWN_DEFAULT,
  };
}
