import React from 'react';
import { Target, Trophy, ChevronDown, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, PERMISSIONS, getAvatarById } from '../../data/constants';
import { getWhoAmIClueCount, getWhoAmIVisibleClues, WHO_AM_I_TIME_LIMIT } from '../../data/whoAmIChallenges';
import { formatAnswerLabel } from '../../lib/utils';
import AvatarBadge from '../ui/AvatarBadge';

const SEEN_RESULTS_KEY = 'seen_duel_results_v1';

const DIFFICULTY_SETTINGS = {
  anfaenger: { time: 45, label: 'Anfaenger', icon: 'A', color: 'bg-green-500' },
  profi: { time: 30, label: 'Profi', icon: 'P', color: 'bg-yellow-500' },
  experte: { time: 15, label: 'Experte', icon: 'E', color: 'bg-red-500' },
  extra: { time: 75, label: 'Extra schwer', icon: 'X', color: 'bg-indigo-700' }
};

const CHALLENGE_TIMEOUT_OPTIONS = [
  { minutes: 15, label: '15 Min' },
  { minutes: 30, label: '30 Min' },
  { minutes: 60, label: '1 Stunde' },
  { minutes: 120, label: '2 Stunden' },
  { minutes: 360, label: '6 Stunden' },
  { minutes: 720, label: '12 Stunden' },
  { minutes: 1440, label: '24 Stunden' },
  { minutes: 2880, label: '48 Stunden' }
];

const getDifficulty = (difficulty) => DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.profi;
const QuizView = ({
  selectedDifficulty,
  setSelectedDifficulty,
  allUsers,
  allGames = [],
  activeGames,
  challengePlayer,
  acceptChallenge,
  continueGame,
  currentGame,
  quizCategory,
  questionInCategory,
  playerTurn,
  adaptiveLearningEnabled,
  setAdaptiveLearningEnabled,
  selectCategory,
  waitingForOpponent,
  startCategoryAsSecondPlayer,
  currentQuestion,
  timeLeft,
  answered,
  selectedAnswers,
  lastSelectedAnswer,
  isKeywordQuestion,
  isWhoAmIQuestion,
  keywordAnswerText,
  setKeywordAnswerText,
  keywordAnswerEvaluation,
  submitKeywordAnswer,
  quizMCKeywordMode,
  setQuizMCKeywordMode,
  answerQuestion,
  reportQuestionIssue,
  confirmMultiSelectAnswer,
  proceedToNextRound,
  userStats,
  duelResult,
  setDuelResult,
  showDuelResultForGame,
  categoryRoundResult,
  proceedAfterCategoryResult,
  onForfeit,
  exitCurrentGame,
}) => {
  const { user } = useAuth();
  const { darkMode, playSound } = useApp();
  const [challengeTimeoutMinutes, setChallengeTimeoutMinutes] = React.useState(1440);
  const [countdownNow, setCountdownNow] = React.useState(() => Date.now());
  const [showForfeitConfirm, setShowForfeitConfirm] = React.useState(false);
  const [showRecentGames, setShowRecentGames] = React.useState(false);
  const currentDifficulty = getDifficulty(currentGame?.difficulty);
  const questionIsKeyword = Boolean(currentQuestion && isKeywordQuestion?.(currentQuestion));
  const questionIsWhoAmI = Boolean(currentQuestion && isWhoAmIQuestion?.(currentQuestion));
  const questionUsesFreeText = questionIsKeyword || questionIsWhoAmI || quizMCKeywordMode;
  const availableKeywordGroups = Array.isArray(currentQuestion?.keywordGroups)
    ? currentQuestion.keywordGroups.length
    : 0;
  const requiredKeywordGroups = Math.max(
    1,
    Math.min(availableKeywordGroups || 1, Number(currentQuestion?.minKeywordGroups) || availableKeywordGroups || 1)
  );
  const whoAmIClueCount = questionIsWhoAmI
    ? getWhoAmIClueCount(currentGame?.difficulty, currentQuestion?.clues?.length || 0)
    : 0;
  const visibleWhoAmIClues = questionIsWhoAmI
    ? getWhoAmIVisibleClues(currentQuestion, currentGame?.difficulty)
    : [];
  const questionTimeLimit = questionIsWhoAmI
    ? Number(currentQuestion?.timeLimit) || WHO_AM_I_TIME_LIMIT
    : (currentDifficulty.time || 30);
  const activeCategoryRound = currentGame?.categoryRounds?.[currentGame?.categoryRound || 0] || null;
  const isCurrentPlayer1 = Boolean(currentGame && user?.name === currentGame.player1);
  const myCurrentRoundAnswers = activeCategoryRound
    ? (isCurrentPlayer1 ? activeCategoryRound.player1Answers : activeCategoryRound.player2Answers) || []
    : [];
  const opponentCurrentRoundAnswers = activeCategoryRound
    ? (isCurrentPlayer1 ? activeCategoryRound.player2Answers : activeCategoryRound.player1Answers) || []
    : [];
  const nextPendingQuestionIndex = myCurrentRoundAnswers.length || 0;
  const hasPendingCategoryRound = Boolean(
    currentGame
    && activeCategoryRound
    && playerTurn === user?.name
    && Array.isArray(activeCategoryRound.questions)
    && activeCategoryRound.questions.length > 0
    && nextPendingQuestionIndex < activeCategoryRound.questions.length
  );
  const isResumingCategoryRound = hasPendingCategoryRound && nextPendingQuestionIndex > 0;
  const isOpponentReplayRound = hasPendingCategoryRound
    && opponentCurrentRoundAnswers.length > 0
    && nextPendingQuestionIndex === 0;
  React.useEffect(() => {
    if (currentGame) return undefined;
    const intervalId = window.setInterval(() => {
      setCountdownNow(Date.now());
    }, 1000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [currentGame]);

  const parseTimestamp = (value) => {
    const ts = new Date(value || '').getTime();
    return Number.isFinite(ts) ? ts : null;
  };

  const getWaitingDeadlineTs = (gameInput) => {
    const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
    const timeoutMinutesRaw = Number(game.challengeTimeoutMinutes || 2880);
    const timeoutMinutes = Number.isFinite(timeoutMinutesRaw) ? Math.max(15, timeoutMinutesRaw) : 2880;
    const createdTs = parseTimestamp(game.createdAt || game.updatedAt);
    const explicitExpiryTs = parseTimestamp(game.challengeExpiresAt);
    const fallbackExpiryTs = Number.isFinite(createdTs)
      ? createdTs + timeoutMinutes * 60 * 1000
      : null;
    return Number.isFinite(explicitExpiryTs) ? explicitExpiryTs : fallbackExpiryTs;
  };

  const getTurnDeadlineTs = (gameInput) => {
    const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
    const updatedTs = parseTimestamp(game.updatedAt || game.createdAt);
    if (!Number.isFinite(updatedTs)) return null;
    return updatedTs + 48 * 60 * 60 * 1000;
  };

  const isWaitingGameExpired = (gameInput, nowInput = Date.now()) => {
    const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
    if (String(game.status || '').toLowerCase() !== 'waiting') return false;
    const deadlineTs = getWaitingDeadlineTs(game);
    if (!Number.isFinite(deadlineTs)) return false;
    return deadlineTs <= nowInput;
  };

  const formatCountdown = (remainingMsInput) => {
    const remainingMs = Number(remainingMsInput);
    if (!Number.isFinite(remainingMs)) return '--:--:--';
    const safeMs = Math.max(0, remainingMs);
    const totalSeconds = Math.floor(safeMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (days > 0) {
      return `${days}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getFirstName = (name) => String(name || '').trim().split(/\s+/)[0] || '?';

  // Ungesehene beendete Duelle erkennen
  const getSeenResultIds = () => {
    try {
      return JSON.parse(localStorage.getItem(SEEN_RESULTS_KEY) || '[]');
    } catch { return []; }
  };

  const markResultSeen = (gameId) => {
    const seen = getSeenResultIds();
    if (!seen.includes(gameId)) {
      const updated = [...seen, gameId].slice(-50); // max 50 merken
      localStorage.setItem(SEEN_RESULTS_KEY, JSON.stringify(updated));
    }
  };

  // Wenn duelResult angezeigt wird, als gesehen markieren
  React.useEffect(() => {
    if (duelResult?.gameId) {
      markResultSeen(duelResult.gameId);
    }
  }, [duelResult?.gameId]);

  const recentFinishedGames = React.useMemo(() => {
    if (!user?.name || !allGames?.length) return [];
    return allGames
      .filter(g => {
        if (g.status !== 'finished') return false;
        return g.player1 === user.name || g.player2 === user.name;
      })
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .slice(0, 10);
  }, [allGames, user?.name]);

  const handleViewUnseenResult = (game) => {
    if (showDuelResultForGame) {
      showDuelResultForGame(game, allGames);
    }
  };

  const handleRevanche = () => {
    if (!duelResult?.opponentName || !challengePlayer) return;
    const opponent = allUsers.find(u => u.name === duelResult.opponentName);
    setDuelResult(null);
    challengePlayer(duelResult.opponentName, challengeTimeoutMinutes, opponent?.id);
    playSound('whistle');
  };

  // Ergebnis-Screen nach Spielende
  if (duelResult) {
    const iWon = duelResult.winner === duelResult.myName;
    const isDraw = duelResult.winner === null;
    const iLost = !iWon && !isDraw;
    const myScore = duelResult.myName === duelResult.player1 ? duelResult.player1Score : duelResult.player2Score;
    const opponentScore = duelResult.myName === duelResult.player1 ? duelResult.player2Score : duelResult.player1Score;
    const h2hTotal = duelResult.h2h.wins + duelResult.h2h.losses + duelResult.h2h.draws;

    const resultGradient = iWon
      ? 'from-amber-400 via-yellow-400 to-orange-500'
      : isDraw
        ? 'from-slate-400 via-slate-500 to-slate-600'
        : 'from-indigo-500 via-slate-600 to-slate-800';

    return (
      <div className={`max-w-lg mx-auto text-center space-y-5 py-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {/* Ergebnis-Grafik */}
        <div className={`glass-card rounded-2xl p-8 relative overflow-hidden`}>
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${resultGradient}`} />
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none opacity-40"
            style={{ background: `radial-gradient(circle, ${iWon ? 'rgba(251,191,36,0.55)' : isDraw ? 'rgba(148,163,184,0.45)' : 'rgba(99,102,241,0.45)'} 0%, transparent 70%)` }}
          />
          <div className="text-7xl mb-4 relative">
            {iWon ? '🏊‍♂️🏆' : isDraw ? '🤝🏊' : '🌊😵'}
          </div>
          <h2 className={`text-3xl font-black mb-2 relative ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {iWon ? 'Sieg!' : isDraw ? 'Unentschieden!' : 'Knapp daneben!'}
          </h2>
          <p className={`text-lg relative ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            {iWon
              ? 'Du hast das Becken gerockt!'
              : isDraw
                ? 'Gleichauf — Rematch?'
                : 'Nächstes Mal tauchst du tiefer!'}
          </p>
        </div>

        {/* Score */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500" />
          <div className="flex items-center justify-center gap-6">
            <div className="text-center flex-1">
              <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Du</p>
              <p className={`text-5xl font-black ${iWon ? 'text-emerald-500' : iLost ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-800'}`}>
                {myScore}
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {getFirstName(duelResult.myName)}
              </p>
            </div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-slate-600' : 'text-gray-300'}`}>:</div>
            <div className="text-center flex-1">
              <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Gegner</p>
              <p className={`text-5xl font-black ${iLost ? 'text-emerald-500' : iWon ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-800'}`}>
                {opponentScore}
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {getFirstName(duelResult.opponentName)}
              </p>
            </div>
          </div>
        </div>

        {/* Head-to-Head Statistik */}
        {h2hTotal > 0 && (
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500" />
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Bilanz gegen {getFirstName(duelResult.opponentName)}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3 rounded-xl border ${darkMode ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <p className={`text-2xl font-black ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>{duelResult.h2h.wins}</p>
                <p className={`text-xs font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>Siege</p>
              </div>
              <div className={`p-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200'}`}>
                <p className={`text-2xl font-black ${darkMode ? 'text-slate-200' : 'text-gray-600'}`}>{duelResult.h2h.draws}</p>
                <p className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-500'}`}>Remis</p>
              </div>
              <div className={`p-3 rounded-xl border ${darkMode ? 'bg-red-500/10 border-red-400/30' : 'bg-red-50 border-red-200'}`}>
                <p className={`text-2xl font-black ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{duelResult.h2h.losses}</p>
                <p className={`text-xs font-semibold ${darkMode ? 'text-red-200' : 'text-red-700'}`}>Niederlagen</p>
              </div>
            </div>
            {h2hTotal >= 3 && (
              <div className={`mt-3 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {duelResult.h2h.wins > duelResult.h2h.losses
                  ? `Du führst mit ${duelResult.h2h.wins - duelResult.h2h.losses} Sieg${duelResult.h2h.wins - duelResult.h2h.losses > 1 ? 'en' : ''} Vorsprung!`
                  : duelResult.h2h.losses > duelResult.h2h.wins
                    ? `${getFirstName(duelResult.opponentName)} führt — Zeit für die Aufholjagd!`
                    : 'Absolut ausgeglichen — wer holt sich den Vorsprung?'}
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRevanche}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Target size={18} />
            Revanche!
          </button>
          <button
            onClick={() => setDuelResult(null)}
            className={`px-8 py-3 font-bold rounded-xl border transition-all ${darkMode ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10' : 'bg-white/70 hover:bg-white text-gray-700 border-gray-200'}`}
          >
            Zurück zum Quizduell
          </button>
        </div>
      </div>
    );
  }

  // Runden-Ergebnis-Screen (nach jeder abgeschlossenen Kategorie)
  if (categoryRoundResult && currentGame) {
    const isMyPlayer1 = categoryRoundResult.myName === categoryRoundResult.player1Name;
    const myScore = isMyPlayer1 ? categoryRoundResult.player1Score : categoryRoundResult.player2Score;
    const oppScore = isMyPlayer1 ? categoryRoundResult.player2Score : categoryRoundResult.player1Score;
    const myRoundCorrect = (categoryRoundResult.myAnswers || []).filter(a => a.correct).length;
    const oppRoundCorrect = (categoryRoundResult.opponentAnswers || []).filter(a => a.correct).length;
    const cat = CATEGORIES.find(c => c.id === categoryRoundResult.categoryId);
    const roundNum = categoryRoundResult.round + 1; // 1-4

    return (
      <div className={`max-w-lg mx-auto space-y-4 py-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {/* Header */}
        <div className="glass-card rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500" />
          <div className={`text-xs font-mono tracking-wider mb-1 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
            RUNDE {roundNum} VON 4
          </div>
          <div className="text-4xl mb-2">{cat?.icon || '❓'}</div>
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {categoryRoundResult.categoryName}
          </h2>
          {/* Mini-Score dieser Runde */}
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="text-center">
              <span className={`text-3xl font-black ${myRoundCorrect > oppRoundCorrect ? 'text-emerald-500' : myRoundCorrect < oppRoundCorrect ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-700'}`}>
                {myRoundCorrect}
              </span>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Du</p>
            </div>
            <div className={`text-xl font-bold ${darkMode ? 'text-slate-600' : 'text-gray-300'}`}>–</div>
            <div className="text-center">
              <span className={`text-3xl font-black ${oppRoundCorrect > myRoundCorrect ? 'text-emerald-500' : oppRoundCorrect < myRoundCorrect ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-700'}`}>
                {oppRoundCorrect}
              </span>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{getFirstName(categoryRoundResult.opponentName)}</p>
            </div>
          </div>
        </div>

        {/* Fragen-Vergleich */}
        <div className="glass-card rounded-2xl overflow-hidden relative p-0">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 z-10" />
          {/* Header Row */}
          <div className={`flex items-center px-4 pt-4 pb-2 text-xs font-mono tracking-wider ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
            <span className="flex-1">FRAGE</span>
            <span className="w-10 text-center">DU</span>
            <span className="w-16 text-center">{getFirstName(categoryRoundResult.opponentName).toUpperCase()}</span>
          </div>
          {(categoryRoundResult.questions || []).map((q, idx) => {
            const myAns = (categoryRoundResult.myAnswers || [])[idx];
            const oppAns = (categoryRoundResult.opponentAnswers || [])[idx];
            const myCorrect = myAns?.correct;
            const oppCorrect = oppAns?.correct;
            const myTimeout = myAns?.timeout;
            const oppTimeout = oppAns?.timeout;
            return (
              <div key={idx} className={`flex items-start px-4 py-3 border-t ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                <div className="flex-1 pr-2">
                  <p className={`text-sm leading-snug ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    <span className={`inline-block text-xs font-bold mr-1 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>{idx + 1}.</span>
                    {q.q || q.prompt || '?'}
                  </p>
                </div>
                <div className="w-10 text-center text-xl flex-shrink-0">
                  {myAns === undefined ? '–' : myTimeout ? '⏱' : myCorrect ? '✅' : '❌'}
                </div>
                <div className="w-16 text-center text-xl flex-shrink-0">
                  {oppAns === undefined ? <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>–</span> : oppTimeout ? '⏱' : oppCorrect ? '✅' : '❌'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gesamtstand */}
        <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <p className={`text-xs font-mono tracking-wider text-center mb-3 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>GESAMTSTAND</p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center flex-1">
              <p className={`text-4xl font-black ${myScore > oppScore ? 'text-emerald-500' : myScore < oppScore ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-800'}`}>{myScore}</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Du</p>
            </div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-slate-600' : 'text-gray-300'}`}>:</div>
            <div className="text-center flex-1">
              <p className={`text-4xl font-black ${oppScore > myScore ? 'text-emerald-500' : oppScore < myScore ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-800'}`}>{oppScore}</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{getFirstName(categoryRoundResult.opponentName)}</p>
            </div>
          </div>
        </div>

        {/* Weiter Button */}
        <button
          onClick={proceedAfterCategoryResult}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-600 hover:via-sky-600 hover:to-blue-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-cyan-500/30 transition-all active:scale-95"
        >
          {categoryRoundResult.isLastRound ? '🏁 Ergebnis ansehen' : `Runde ${roundNum + 1} →`}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!currentGame && (
        <>
          <div className="glass-card rounded-2xl p-5 mb-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500" />
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${darkMode ? 'bg-fuchsia-500/15' : 'bg-fuchsia-500/10'}`}>
                <Target size={24} className={darkMode ? 'text-fuchsia-300' : 'text-fuchsia-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-mono tracking-wider mb-1 ${darkMode ? 'text-fuchsia-300' : 'text-fuchsia-700'}`}>
                  PVP · 1 GEGEN 1
                </div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quizduell</h2>
                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  Fordere andere Azubis zum direkten Wissens-Duell heraus.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 mb-5 text-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400" />
            <p className={`font-bold mb-2 ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>Spielregeln · Zeitlimit & Strafen</p>
            <ul className={`space-y-1 ${darkMode ? 'text-slate-300' : 'text-amber-700'}`}>
              <li>Für Herausforderungen kannst du eine <strong>Annahmefrist</strong> festlegen.</li>
              <li>Laufende Duelle behalten <strong>48 Stunden</strong> Zugfrist mit Erinnerung nach 24h.</li>
              <li>Wer seinen Zug nicht rechtzeitig macht oder eine Challenge ignoriert, <strong>verliert die Runde</strong>.</li>
              <li>Zusätzlich werden dem Verlierer <strong>100 XP abgezogen</strong>.</li>
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500" />
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Spieler herausfordern</h3>
            <div className="mb-6">
              <label className={`block text-xs font-mono tracking-wider mb-3 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                SCHWIERIGKEITSGRAD WÄHLEN
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(DIFFICULTY_SETTINGS).map(([key, diff]) => {
                  const gradientMap = {
                    anfaenger: 'from-emerald-400 via-green-500 to-teal-500',
                    profi: 'from-amber-400 via-yellow-500 to-orange-400',
                    experte: 'from-red-500 via-rose-500 to-pink-500',
                    extra: 'from-indigo-500 via-violet-500 to-purple-600',
                  };
                  const gradient = gradientMap[key] || 'from-cyan-500 to-blue-500';
                  const active = selectedDifficulty === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDifficulty(key)}
                      className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                        active
                          ? `bg-gradient-to-br ${gradient} text-white border-transparent shadow-lg`
                          : darkMode
                            ? 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                            : 'bg-white/70 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2 font-black">{diff.icon}</div>
                      <div className="font-bold">{diff.label}</div>
                      <div className={`text-xs mt-1 ${active ? 'text-white/90' : darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{diff.time} Sekunden</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="challenge-timeout" className={`block text-xs font-mono tracking-wider mb-2 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                TIMER FÜR HERAUSFORDERUNG (ANNAHMEFRIST)
              </label>
              <select
                id="challenge-timeout"
                value={challengeTimeoutMinutes}
                onChange={(event) => setChallengeTimeoutMinutes(Number(event.target.value) || 1440)}
                className={`w-full md:w-64 border rounded-lg px-3 py-2 text-sm ${darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white/70 border-gray-200 text-gray-700'}`}
              >
                {CHALLENGE_TIMEOUT_OPTIONS.map((option) => (
                  <option key={option.minutes} value={option.minutes}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              {allUsers.filter(u => u.name !== user.name).map(u => {
                const vsStats = userStats?.opponents?.[u.name] || { wins: 0, losses: 0, draws: 0 };
                const totalVs = vsStats.wins + vsStats.losses + vsStats.draws;
                const winrate = totalVs > 0 ? Math.round((vsStats.wins / totalVs) * 100) : null;
                const firstName = getFirstName(u.name);
                const roleLabel = (PERMISSIONS[u.role] || PERMISSIONS.azubi).label;
                const company = u.company ? ` · ${u.company}` : '';
                const relatedGame = activeGames.find((g) => {
                  if (g.status === 'finished') return false;
                  const isPair = (g.player1 === user.name && g.player2 === u.name)
                    || (g.player1 === u.name && g.player2 === user.name);
                  if (!isPair) return false;
                  if (g.status === 'waiting' && isWaitingGameExpired(g, countdownNow)) return false;
                  return true;
                });
                const hasRelatedGame = Boolean(relatedGame);
                const isIncomingChallenge = Boolean(
                  relatedGame
                  && relatedGame.status === 'waiting'
                  && relatedGame.player2 === user.name
                );
                const isOutgoingChallenge = Boolean(
                  relatedGame
                  && relatedGame.status === 'waiting'
                  && relatedGame.player1 === user.name
                );
                const isMyTurn = Boolean(
                  relatedGame
                  && relatedGame.status === 'active'
                  && relatedGame.currentTurn === user.name
                );
                const waitingDeadlineTs = relatedGame?.status === 'waiting'
                  ? getWaitingDeadlineTs(relatedGame)
                  : null;
                const turnDeadlineTs = relatedGame?.status === 'active'
                  ? getTurnDeadlineTs(relatedGame)
                  : null;
                const waitingRemainingMs = Number.isFinite(waitingDeadlineTs) ? (waitingDeadlineTs - countdownNow) : null;
                const turnRemainingMs = Number.isFinite(turnDeadlineTs) ? (turnDeadlineTs - countdownNow) : null;
                const countdownHint = relatedGame?.status === 'waiting'
                  ? `Annahmefrist: ${formatCountdown(waitingRemainingMs)}`
                  : relatedGame?.status === 'active'
                    ? `${isMyTurn ? 'Deine Runde' : 'Rundenfrist'}: ${formatCountdown(turnRemainingMs)}`
                    : '';
                const countdownClass = relatedGame?.status === 'active' && isMyTurn
                  ? 'text-amber-600'
                  : 'text-gray-500';
                return (
                  <div key={u.name} className={`grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-3 rounded-xl border transition-all min-[720px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[720px]:items-center ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/70 border-gray-200 hover:bg-white'}`}>
                    {/* Avatar */}
                    <AvatarBadge
                      avatar={u.avatar ? getAvatarById(u.avatar) : null}
                      size="md"
                      fallback={u.name.slice(0, 2).toUpperCase()}
                      className="flex-shrink-0"
                    />
                    {/* Name + Rolle + Betrieb + Winrate */}
                    <div className="min-w-0">
                      <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{firstName}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                        <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>
                          {roleLabel}{company}
                        </span>
                        {winrate !== null ? (
                          <span className={`font-medium ${winrate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                            · {winrate}% W/R ({totalVs} Sp.)
                          </span>
                        ) : (
                          <span className={darkMode ? 'text-slate-500' : 'text-gray-400'}>· Noch nicht gespielt</span>
                        )}
                      </div>
                    </div>
                    {/* Action Button */}
                    {hasRelatedGame ? (
                      isIncomingChallenge ? (
                        <div className="col-span-2 min-[720px]:col-span-1 min-[720px]:justify-self-end w-full min-[720px]:w-auto">
                          <button
                            onClick={() => {
                              acceptChallenge?.(relatedGame.id);
                              playSound('whistle');
                            }}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-3 py-2 rounded-lg font-bold text-sm transition-all shadow-md shadow-emerald-500/30 w-full whitespace-normal text-center leading-tight"
                          >
                            Annehmen
                          </button>
                          {countdownHint && (
                            <div className={`mt-1 text-[11px] text-center font-mono ${darkMode ? 'text-slate-300' : countdownClass}`}>
                              {countdownHint}
                            </div>
                          )}
                        </div>
                      ) : isMyTurn ? (
                        <div className="col-span-2 min-[720px]:col-span-1 min-[720px]:justify-self-end w-full min-[720px]:w-auto">
                          <button
                            onClick={() => {
                              continueGame?.(relatedGame.id);
                              playSound('whistle');
                            }}
                            className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white px-3 py-2 rounded-lg font-bold text-sm transition-all shadow-md shadow-emerald-500/30 w-full whitespace-normal text-center leading-tight animate-pulse"
                          >
                            Weiterspielen
                          </button>
                          {countdownHint && (
                            <div className={`mt-1 text-[11px] text-center font-mono ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                              {countdownHint}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="col-span-2 min-[720px]:col-span-1 min-[720px]:justify-self-end w-full min-[720px]:w-auto">
                          <span className={`inline-flex w-full min-[720px]:w-auto justify-center text-xs italic px-3 py-1.5 rounded-lg border whitespace-normal text-center leading-tight ${darkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white/60 border-gray-200 text-gray-500'}`}>
                            {isOutgoingChallenge ? 'Anfrage gesendet' : 'Läuft'}
                          </span>
                          {countdownHint && (
                            <div className={`mt-1 text-[11px] text-center font-mono ${darkMode ? 'text-slate-300' : countdownClass}`}>
                              {countdownHint}
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => challengePlayer(u.name, challengeTimeoutMinutes, u.id)}
                        className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 hover:from-cyan-600 hover:via-sky-600 hover:to-blue-600 text-white px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 text-sm transition-all shadow-md shadow-cyan-500/30 col-span-2 min-[720px]:col-span-1 min-[720px]:justify-self-end w-full min-[720px]:w-auto whitespace-normal text-center leading-tight"
                      >
                        <Target size={16} />
                        <span>Herausfordern</span>
                      </button>
                    )}
                  </div>
                );
              })}
              {allUsers.filter(u => u.name !== user.name).length === 0 && (
                <p className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Noch keine anderen Spieler vorhanden</p>
              )}
            </div>
          </div>

          {/* Letzte Spiele — ausklappbar */}
          {recentFinishedGames.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowRecentGames((prev) => !prev)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border font-bold text-sm transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200' : 'bg-white/70 border-gray-200 hover:bg-white text-gray-700'}`}
              >
                <span className="flex items-center gap-2">
                  <Trophy size={16} className={darkMode ? 'text-cyan-300' : 'text-cyan-600'} />
                  Letzte Spiele ({recentFinishedGames.length})
                </span>
                <ChevronDown size={18} className={`transition-transform ${showRecentGames ? 'rotate-180' : ''} ${darkMode ? 'text-slate-400' : 'text-gray-500'}`} />
              </button>
              {showRecentGames && (
                <div className="space-y-2 mt-3">
                  {recentFinishedGames.map(game => {
                    const isP1 = game.player1 === user?.name;
                    const myScore = isP1 ? game.player1Score : game.player2Score;
                    const oppScore = isP1 ? game.player2Score : game.player1Score;
                    const opponentName = isP1 ? game.player2 : game.player1;
                    const iWon = (game.winner === user?.name)
                      || (isP1 && game.player1Score > game.player2Score)
                      || (!isP1 && game.player2Score > game.player1Score);
                    const isDraw = game.player1Score === game.player2Score;
                    const accentGradient = iWon
                      ? 'from-emerald-400 via-teal-500 to-cyan-500'
                      : isDraw
                        ? 'from-slate-400 via-slate-500 to-slate-600'
                        : 'from-red-500 via-rose-500 to-pink-500';
                    return (
                      <div
                        key={game.id}
                        className={`rounded-xl p-3 border cursor-pointer transition-all hover:scale-[1.01] relative overflow-hidden ${
                          iWon
                            ? darkMode ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-emerald-50 border-emerald-200'
                            : isDraw
                              ? darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200'
                              : darkMode ? 'bg-red-500/10 border-red-400/30' : 'bg-red-50 border-red-200'
                        }`}
                        onClick={() => handleViewUnseenResult(game)}
                      >
                        <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accentGradient}`} />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{iWon ? '🏆' : isDraw ? '🤝' : '😤'}</span>
                            <div>
                              <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {iWon ? 'Gewonnen' : isDraw ? 'Unentschieden' : 'Verloren'} gegen {getFirstName(opponentName)}
                              </p>
                              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                {myScore} : {oppScore}
                              </p>
                            </div>
                          </div>
                          <Trophy size={14} className={darkMode ? 'text-slate-500' : 'text-gray-400'} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {currentGame && (
        <div className="glass-card rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500" />
          {exitCurrentGame && !currentQuestion && (
            <div className="flex justify-start mb-3">
              <button
                onClick={exitCurrentGame}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium inline-flex items-center gap-1.5 transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200' : 'bg-white/70 border-gray-200 hover:bg-white text-gray-700'}`}
              >
                <ArrowLeft className="w-3 h-3" />
                Zur Herausforderungsliste
              </button>
            </div>
          )}
          {(() => {
            const diffGradientMap = {
              anfaenger: 'from-emerald-400 via-green-500 to-teal-500',
              profi: 'from-amber-400 via-yellow-500 to-orange-400',
              experte: 'from-red-500 via-rose-500 to-pink-500',
              extra: 'from-indigo-500 via-violet-500 to-purple-600',
            };
            const diffKey = Object.keys(DIFFICULTY_SETTINGS).find(k => DIFFICULTY_SETTINGS[k] === currentDifficulty) || 'profi';
            const diffGradient = diffGradientMap[diffKey] || 'from-cyan-500 to-blue-500';
            return (
              <div className="text-center mb-4">
                <span className={`bg-gradient-to-r ${diffGradient} text-white px-6 py-2 rounded-full font-bold inline-flex items-center gap-2 shadow-md`}>
                  {currentDifficulty.icon} {currentDifficulty.label} · {(currentQuestion ? questionTimeLimit : currentDifficulty.time)} Sekunden pro Frage
                </span>
              </div>
            );
          })()}

          <div className="flex justify-between items-center mb-6">
            <div className="text-center flex-1">
              <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{getFirstName(currentGame.player1)}</p>
              <p className={`text-4xl font-black ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>{currentGame.player1Score}</p>
            </div>
            <div className="text-center flex-1">
              <p className={`text-xs font-mono tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>KATEGORIE {(currentGame.categoryRound || 0) + 1}/4</p>
              {quizCategory && (
                <p className={`text-xs font-mono mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  FRAGE {questionInCategory + 1}/5
                </p>
              )}
              <p className={`text-sm mt-2 font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                {playerTurn === user.name ? 'Du bist dran!' : `${getFirstName(playerTurn)} ist dran...`}
              </p>
            </div>
            <div className="text-center flex-1">
              <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{getFirstName(currentGame.player2)}</p>
              <p className="text-4xl font-black text-rose-500">{currentGame.player2Score}</p>
            </div>
          </div>

          {/* Aufgeben */}
          {onForfeit && !duelResult && (
            <div className="flex justify-end mb-2">
              {!showForfeitConfirm ? (
                <button
                  onClick={() => setShowForfeitConfirm(true)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${darkMode ? 'border-red-400/30 bg-red-500/10 text-red-300 hover:bg-red-500/20' : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'}`}
                >
                  Aufgeben
                </button>
              ) : (
                <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${darkMode ? 'border-red-400/30 bg-red-500/10' : 'border-red-200 bg-red-50'}`}>
                  <span className={`text-xs font-medium ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
                    Wirklich aufgeben? Du verlierst das Duell.
                  </span>
                  <button
                    onClick={() => { setShowForfeitConfirm(false); onForfeit(); }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold shadow-md shadow-red-500/30"
                  >
                    Ja, aufgeben
                  </button>
                  <button
                    onClick={() => setShowForfeitConfirm(false)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200' : 'bg-white/70 border-gray-200 hover:bg-white text-gray-700'}`}
                  >
                    Abbrechen
                  </button>
                </div>
              )}
            </div>
          )}

          {currentGame.categoryRounds && currentGame.categoryRounds.length > 0 && !currentQuestion && (
            <div className="mb-4 flex justify-center gap-2 flex-wrap">
              {currentGame.categoryRounds.map((cr, idx) => {
                const cat = CATEGORIES.find(c => c.id === cr.categoryId);
                return (
                  <span key={idx} className={`${cat?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm shadow-md`}>
                    {cat?.icon} {cat?.name}
                  </span>
                );
              })}
            </div>
          )}

          {!quizCategory && playerTurn === user.name && !waitingForOpponent && !hasPendingCategoryRound && (
            <div>
              <div className={`mb-4 flex items-center justify-between gap-3 rounded-xl border p-3 ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white/70'}`}>
                <div>
                  <p className={`text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>Adaptiver Lernmodus</p>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    {adaptiveLearningEnabled ? 'Schwerere Fragen kommen öfter.' : 'Reiner Zufall.'}
                  </p>
                </div>
                <button
                  onClick={() => setAdaptiveLearningEnabled((prev) => !prev)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    adaptiveLearningEnabled
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/30'
                      : darkMode ? 'bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200' : 'bg-white/70 border border-gray-200 hover:bg-white text-gray-700'
                  }`}
                >
                  {adaptiveLearningEnabled ? 'Aktiv' : 'Aus'}
                </button>
              </div>
              <h3 className={`text-xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Wähle eine Kategorie</h3>
              <p className={`text-center text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Du wählst 5 Fragen — danach spielt {getFirstName(currentGame.player1 === user.name ? currentGame.player2 : currentGame.player1)} die gleichen Fragen.</p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.filter(cat => {
                  const played = currentGame.categoryRounds?.map(cr => cr.categoryId) || [];
                  return !played.includes(cat.id);
                }).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat.id)}
                    className={`${cat.color} text-white rounded-2xl p-4 hover:scale-105 hover:shadow-xl transition-all shadow-md`}
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <div className="font-bold text-sm">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!currentQuestion && hasPendingCategoryRound && (
            <div className="text-center py-8">
              <div className="text-4xl font-black mb-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">START</div>
              <p className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {activeCategoryRound?.categoryName || 'Kategorie'}
              </p>
              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {isResumingCategoryRound
                  ? `Du warst bereits bei Frage ${nextPendingQuestionIndex + 1}/${activeCategoryRound?.questions?.length || 5}. Setze diese Kategorie genau dort fort.`
                  : isOpponentReplayRound
                    ? `${getFirstName(currentGame.player1 === user.name ? currentGame.player2 : currentGame.player1)} hat diese Kategorie gespielt. Jetzt bist du dran mit den gleichen ${activeCategoryRound?.questions?.length || 5} Fragen!`
                    : 'Diese Kategorie ist bereits gestartet. Du setzt jetzt deine laufende Runde fort, statt eine neue Kategorie zu wählen.'}
              </p>
              <button
                onClick={startCategoryAsSecondPlayer}
                className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/30"
              >
                {isResumingCategoryRound ? 'Fortsetzen' : "Los geht's"}
              </button>
            </div>
          )}

          {!quizCategory && playerTurn !== user.name && (
            <div className="text-center py-12">
              <div className={`text-4xl mb-4 animate-pulse`}>⏳</div>
              <p className={`text-xl font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>
                {getFirstName(playerTurn)} ist dran...
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {waitingForOpponent ? 'Dein Gegner spielt jetzt die gleichen Fragen' : 'Dein Gegner wählt eine Kategorie'}
              </p>
            </div>
          )}

          {currentQuestion && playerTurn === user.name && (
            <div className="space-y-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {(() => {
                      const cat = CATEGORIES.find(c => c.id === quizCategory);
                      return cat ? `${cat.icon} ${cat.name}` : 'Frage';
                    })()}
                  </span>
                  <span className={`text-2xl font-black ${
                    timeLeft <= 10 ? 'text-red-500 animate-pulse' : darkMode ? 'text-cyan-300' : 'text-cyan-600'
                  }`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className={`w-full rounded-full h-3 overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      timeLeft <= 10 ? 'bg-gradient-to-r from-red-500 to-rose-500' : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500'
                    }`}
                    style={{ width: `${(timeLeft / questionTimeLimit) * 100}%` }}
                  />
                </div>
              </div>

              <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200'}`}>
                {currentQuestion.level && (
                  <div className="flex justify-center mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                      currentQuestion.level === 'A1' ? 'bg-emerald-500 text-white'
                      : currentQuestion.level === 'A2' ? 'bg-teal-500 text-white'
                      : currentQuestion.level === 'B1' ? 'bg-blue-500 text-white'
                      : 'bg-slate-500 text-white'
                    }`}>
                      {currentQuestion.level}
                    </span>
                  </div>
                )}
                <p className={`text-xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {questionIsWhoAmI ? (currentQuestion.prompt || 'Was bin ich?') : currentQuestion.q}
                </p>
                {questionIsWhoAmI && (
                  <div className={`mt-4 rounded-xl border p-4 text-left ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white/70'}`}>
                    <p className={`text-center text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      60 Sekunden Zeit. Schwierigkeit <span className="font-bold">{currentDifficulty.label}</span> zeigt dir {whoAmIClueCount} von {currentQuestion?.clues?.length || 5} Eigenschaften.
                    </p>
                    <div className="mt-3 space-y-2">
                      {visibleWhoAmIClues.map((clue, index) => (
                        <div key={`${currentQuestion?.id || 'whoami'}-${index}`} className={`rounded-lg px-3 py-2 text-sm border ${darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white/80 border-gray-200 text-slate-700'}`}>
                          <span className={`mr-2 font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>{index + 1}.</span>
                          {clue}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {currentQuestion.multi && !answered && !questionIsKeyword && !questionIsWhoAmI && !quizMCKeywordMode && (
                  <p className={`text-center text-sm mt-2 font-medium ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                    Mehrere Antworten sind richtig — wähle alle richtigen aus.
                  </p>
                )}
                {questionIsKeyword && (
                  <p className={`text-center text-sm mt-2 font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    Extra schwer: Freitext antworten und mindestens {requiredKeywordGroups} Schlagwörter treffen.
                  </p>
                )}
                {quizMCKeywordMode && !questionIsKeyword && !questionIsWhoAmI && (
                  <p className={`text-center text-sm mt-2 font-medium ${darkMode ? 'text-violet-300' : 'text-violet-700'}`}>
                    Schlagwort-Modus: Antworte frei und triff die Schlüsselbegriffe.
                  </p>
                )}
              </div>

              {!questionIsKeyword && !questionIsWhoAmI && !quizMCKeywordMode && !answered && (
                <button
                  onClick={() => setQuizMCKeywordMode(true)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-all border ${darkMode ? 'bg-white/5 text-slate-300 border-white/10 hover:bg-violet-500/20 hover:border-violet-400/40 hover:text-violet-200' : 'bg-white/70 text-gray-600 border-gray-200 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700'}`}
                >
                  Schlagwort-Modus aktivieren
                </button>
              )}

              {!questionIsKeyword && !questionIsWhoAmI && Array.isArray(currentQuestion.a) && !quizMCKeywordMode && (
                <>
                  <div className="grid gap-3">
                    {currentQuestion.a.map((answer, idx) => {
                      const isMulti = currentQuestion.multi;
                      const isSelectedMulti = selectedAnswers.includes(idx);
                      const isSelectedSingle = lastSelectedAnswer === idx;
                      const answerLabel = formatAnswerLabel(currentQuestion.displayAnswers?.[idx] ?? answer);
                      // correct kann undefined sein, wenn der Server es noch nicht
                      // preisgibt (Spieler hat diese Runde noch nicht fertig gespielt).
                      const correctKnown = currentQuestion.correct !== undefined;
                      const isCorrectAnswer = correctKnown
                        ? (isMulti
                            ? currentQuestion.correct.includes(idx)
                            : idx === currentQuestion.correct)
                        : false;

                      let buttonClass = '';
                      if (answered) {
                        if (correctKnown && isCorrectAnswer) {
                          buttonClass = 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 animate-correct-flash';
                        } else if (correctKnown && ((isMulti && isSelectedMulti) || (!isMulti && isSelectedSingle))) {
                          buttonClass = 'bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30';
                        } else if ((isMulti && isSelectedMulti) || (!isMulti && isSelectedSingle)) {
                          buttonClass = 'bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-md';
                        } else {
                          buttonClass = darkMode ? 'bg-white/5 border border-white/10 text-slate-400' : 'bg-white/70 border border-gray-200 text-gray-500';
                        }
                      } else if (isMulti && isSelectedMulti) {
                        buttonClass = 'bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 text-white shadow-md shadow-cyan-500/30 border-2 border-cyan-400';
                      } else {
                        buttonClass = darkMode
                          ? 'bg-white/5 text-slate-100 hover:bg-white/10 border-2 border-white/10 hover:border-cyan-400/50'
                          : 'bg-white/80 hover:bg-white text-gray-800 border-2 border-gray-200 hover:border-cyan-400';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => answerQuestion(idx)}
                          disabled={answered}
                          title={formatAnswerLabel(answer)}
                          className={`p-4 rounded-xl font-medium transition-all min-h-[4.5rem] ${buttonClass}`}
                        >
                          {answerLabel}
                        </button>
                      );
                    })}
                  </div>

                  {currentQuestion.multi && !answered && selectedAnswers.length > 0 && (
                    <button
                      onClick={confirmMultiSelectAnswer}
                      className="w-full mt-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/30"
                    >
                      Antwort bestätigen ({selectedAnswers.length} ausgewählt)
                    </button>
                  )}
                </>
              )}

              {questionUsesFreeText && (
                <div className="space-y-3">
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Singular und Plural werden beide erkannt. Schreib, wie es natürlich klingt.
                  </p>
                  {questionIsWhoAmI ? (
                    <p className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Gesucht ist genau ein Begriff. Im Quizduell zählt bei richtiger Lösung ein normaler Punkt.
                    </p>
                  ) : (
                    <p className={`text-xs font-semibold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                      Wertung: jedes erkannte Schlagwort = 1 Punkt, vollständig gelöst = +2 Bonus.
                    </p>
                  )}
                  <textarea
                    value={keywordAnswerText}
                    onChange={(e) => setKeywordAnswerText(e.target.value)}
                    disabled={answered}
                    rows={5}
                    placeholder={questionIsWhoAmI ? 'Schreibe den gesuchten Begriff...' : 'Schreibe deine Antwort frei und nenne die wichtigsten Schlagwörter...'}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${darkMode ? 'bg-white/5 border-indigo-400/40 text-slate-100 placeholder-slate-500 disabled:bg-white/5 disabled:text-slate-500' : 'bg-white/80 border-indigo-300 disabled:bg-gray-100 disabled:text-gray-500'}`}
                  />
                  {!answered && (
                    <button
                      onClick={submitKeywordAnswer}
                      disabled={!keywordAnswerText.trim()}
                      className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                        keywordAnswerText.trim()
                          ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30'
                          : 'bg-indigo-300 cursor-not-allowed'
                      }`}
                    >
                      {questionIsWhoAmI ? 'Begriff prüfen' : 'Antwort prüfen'}
                    </button>
                  )}

                  {keywordAnswerEvaluation && (
                    <div className={`rounded-xl border-2 p-4 relative overflow-hidden ${
                      keywordAnswerEvaluation.isCorrect
                        ? darkMode ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-emerald-300 bg-emerald-50'
                        : darkMode ? 'border-amber-400/40 bg-amber-500/10' : 'border-amber-300 bg-amber-50'
                    }`}>
                      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${keywordAnswerEvaluation.isCorrect ? 'from-emerald-400 via-teal-500 to-cyan-500' : 'from-amber-400 via-yellow-500 to-orange-400'}`} />
                      <p className={`font-bold ${keywordAnswerEvaluation.isCorrect ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {keywordAnswerEvaluation.isCorrect
                          ? (questionIsWhoAmI ? 'Richtig erkannt.' : 'Treffer! Antwort ist korrekt.')
                          : (questionIsWhoAmI ? 'Noch nicht der gesuchte Begriff.' : 'Noch nicht ausreichend.')}
                      </p>
                      {!questionIsWhoAmI && (
                        <>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                            Treffer: {keywordAnswerEvaluation.matchedCount}/{keywordAnswerEvaluation.requiredGroups} erforderlich
                          </p>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                            Punkte: {keywordAnswerEvaluation.basePoints || 0}{Number(keywordAnswerEvaluation.bonusPoints || 0) > 0 ? ` + ${keywordAnswerEvaluation.bonusPoints} Bonus` : ''} = <span className="font-bold">{keywordAnswerEvaluation.awardedPoints || 0}</span>
                          </p>
                        </>
                      )}
                      {keywordAnswerEvaluation.timedOut && (
                        <p className="text-sm text-red-500 mt-1 font-semibold">Zeit abgelaufen — Antwort wurde als falsch gewertet.</p>
                      )}
                      {keywordAnswerEvaluation.matchedLabels?.length > 0 && (
                        <p className="text-sm text-emerald-500 mt-2">
                          Erkannt: {keywordAnswerEvaluation.matchedLabels.join(', ')}
                        </p>
                      )}
                      {keywordAnswerEvaluation.missingLabels?.length > 0 && (
                        <p className="text-sm text-amber-500 mt-1">
                          Fehlt noch: {keywordAnswerEvaluation.missingLabels.join(', ')}
                        </p>
                      )}
                      {currentQuestion.answerGuide && (
                        <p className={`text-sm mt-3 border-t pt-2 ${darkMode ? 'text-slate-300 border-white/10' : 'text-gray-700 border-gray-300'}`}>
                          {questionIsWhoAmI ? `Gesucht war: ${currentQuestion.answerGuide}` : `Musterlösung: ${currentQuestion.answerGuide}`}
                        </p>
                      )}
                      {quizMCKeywordMode && !questionIsKeyword && !questionIsWhoAmI && currentQuestion.correct !== undefined && (
                        <p className={`text-sm mt-3 border-t pt-2 ${darkMode ? 'text-slate-300 border-white/10' : 'text-gray-700 border-gray-300'}`}>
                          Korrekte Antwort: {
                            currentQuestion.multi && Array.isArray(currentQuestion.correct)
                              ? currentQuestion.correct.map(idx => formatAnswerLabel(currentQuestion.a[idx])).join(' | ')
                              : formatAnswerLabel(currentQuestion.a[currentQuestion.correct])
                          }
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  void reportQuestionIssue({
                    question: currentQuestion,
                    categoryId: quizCategory,
                    source: 'quiz'
                  });
                }}
                className={`w-full mt-2 py-2 rounded-lg font-semibold border transition-all ${darkMode ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border-amber-400/30' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'}`}
              >
                Frage melden
              </button>

              {answered && timeLeft === 0 && (
                <div className={`border-2 rounded-xl p-4 text-center relative overflow-hidden ${darkMode ? 'border-red-400/40 bg-red-500/10' : 'border-red-300 bg-red-50'}`}>
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500" />
                  <p className="text-red-500 font-bold">Zeit abgelaufen!</p>
                </div>
              )}

              {answered && (
                <button
                  onClick={proceedToNextRound}
                  className="w-full mt-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 hover:from-cyan-600 hover:via-sky-600 hover:to-blue-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-cyan-500/30"
                >
                  Weiter
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizView;
