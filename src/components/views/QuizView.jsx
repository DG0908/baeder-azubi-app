import React from 'react';
import { Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, PERMISSIONS, getAvatarById } from '../../data/constants';
import { getWhoAmIClueCount, getWhoAmIVisibleClues, WHO_AM_I_TIME_LIMIT } from '../../data/whoAmIChallenges';
import { formatAnswerLabel } from '../../lib/utils';
import AvatarBadge from '../ui/AvatarBadge';

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
  categoryRoundResult,
  proceedAfterCategoryResult,
}) => {
  const { user } = useAuth();
  const { darkMode, playSound } = useApp();
  const [challengeTimeoutMinutes, setChallengeTimeoutMinutes] = React.useState(1440);
  const [countdownNow, setCountdownNow] = React.useState(() => Date.now());
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

  // Ergebnis-Screen nach Spielende
  if (duelResult) {
    const iWon = duelResult.winner === duelResult.myName;
    const isDraw = duelResult.winner === null;
    const iLost = !iWon && !isDraw;
    const myScore = duelResult.myName === duelResult.player1 ? duelResult.player1Score : duelResult.player2Score;
    const opponentScore = duelResult.myName === duelResult.player1 ? duelResult.player2Score : duelResult.player1Score;
    const h2hTotal = duelResult.h2h.wins + duelResult.h2h.losses + duelResult.h2h.draws;

    return (
      <div className={`max-w-lg mx-auto text-center space-y-6 py-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {/* Ergebnis-Grafik */}
        <div className={`rounded-2xl p-8 shadow-xl ${
          iWon
            ? 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500'
            : isDraw
              ? 'bg-gradient-to-br from-slate-500 via-gray-500 to-slate-600'
              : 'bg-gradient-to-br from-indigo-800 via-slate-700 to-slate-800'
        }`}>
          <div className="text-7xl mb-4">
            {iWon ? '🏊‍♂️🏆' : isDraw ? '🤝🏊' : '🌊😵'}
          </div>
          <h2 className={`text-3xl font-black mb-2 ${iWon || isDraw ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {iWon ? 'Sieg!' : isDraw ? 'Unentschieden!' : 'Knapp daneben!'}
          </h2>
          <p className={`text-lg ${iWon || isDraw ? 'text-white/90' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {iWon
              ? 'Du hast das Becken gerockt!'
              : isDraw
                ? 'Gleichauf — Rematch?'
                : 'Nächstes Mal tauchst du tiefer!'}
          </p>
        </div>

        {/* Score */}
        <div className={`${darkMode ? 'bg-slate-800/90 backdrop-blur-sm border border-slate-600' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-xl`}>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center flex-1">
              <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Du</p>
              <p className={`text-5xl font-black ${iWon ? 'text-emerald-500' : iLost ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-800'}`}>
                {myScore}
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getFirstName(duelResult.myName)}
              </p>
            </div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>:</div>
            <div className="text-center flex-1">
              <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gegner</p>
              <p className={`text-5xl font-black ${iLost ? 'text-emerald-500' : iWon ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-800'}`}>
                {opponentScore}
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getFirstName(duelResult.opponentName)}
              </p>
            </div>
          </div>
        </div>

        {/* Head-to-Head Statistik */}
        {h2hTotal > 0 && (
          <div className={`${darkMode ? 'bg-slate-800/90 backdrop-blur-sm border border-slate-600' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-xl`}>
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Bilanz gegen {getFirstName(duelResult.opponentName)}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-emerald-900/40' : 'bg-emerald-50'}`}>
                <p className={`text-2xl font-black ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{duelResult.h2h.wins}</p>
                <p className={`text-xs font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Siege</p>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <p className={`text-2xl font-black ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{duelResult.h2h.draws}</p>
                <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Remis</p>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-red-900/40' : 'bg-red-50'}`}>
                <p className={`text-2xl font-black ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{duelResult.h2h.losses}</p>
                <p className={`text-xs font-semibold ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Niederlagen</p>
              </div>
            </div>
            {h2hTotal >= 3 && (
              <div className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
            onClick={() => setDuelResult(null)}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl shadow-lg transition-all"
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
        <div className={`rounded-2xl p-5 text-center ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'} shadow-xl`}>
          <div className="text-sm font-semibold text-gray-500 mb-1">Runde {roundNum} von 4</div>
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
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Du</p>
            </div>
            <div className={`text-xl font-bold ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>–</div>
            <div className="text-center">
              <span className={`text-3xl font-black ${oppRoundCorrect > myRoundCorrect ? 'text-emerald-500' : oppRoundCorrect < myRoundCorrect ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-700'}`}>
                {oppRoundCorrect}
              </span>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{getFirstName(categoryRoundResult.opponentName)}</p>
            </div>
          </div>
        </div>

        {/* Fragen-Vergleich */}
        <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'} shadow-xl`}>
          {/* Header Row */}
          <div className={`flex items-center px-4 py-2 text-xs font-bold ${darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
            <span className="flex-1">Frage</span>
            <span className="w-10 text-center">Du</span>
            <span className="w-16 text-center">{getFirstName(categoryRoundResult.opponentName)}</span>
          </div>
          {(categoryRoundResult.questions || []).map((q, idx) => {
            const myAns = (categoryRoundResult.myAnswers || [])[idx];
            const oppAns = (categoryRoundResult.opponentAnswers || [])[idx];
            const myCorrect = myAns?.correct;
            const oppCorrect = oppAns?.correct;
            const myTimeout = myAns?.timeout;
            const oppTimeout = oppAns?.timeout;
            return (
              <div key={idx} className={`flex items-start px-4 py-3 border-t ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <div className="flex-1 pr-2">
                  <p className={`text-sm leading-snug ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <span className={`inline-block text-xs font-bold mr-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{idx + 1}.</span>
                    {q.q || q.prompt || '?'}
                  </p>
                </div>
                <div className="w-10 text-center text-xl flex-shrink-0">
                  {myAns === undefined ? '–' : myTimeout ? '⏱' : myCorrect ? '✅' : '❌'}
                </div>
                <div className="w-16 text-center text-xl flex-shrink-0">
                  {oppAns === undefined ? <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>–</span> : oppTimeout ? '⏱' : oppCorrect ? '✅' : '❌'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gesamtstand */}
        <div className={`rounded-2xl p-4 ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'} shadow-xl`}>
          <p className={`text-sm font-semibold text-center mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gesamtstand</p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center flex-1">
              <p className={`text-4xl font-black ${myScore > oppScore ? 'text-emerald-500' : myScore < oppScore ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-800'}`}>{myScore}</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Du</p>
            </div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>:</div>
            <div className="text-center flex-1">
              <p className={`text-4xl font-black ${oppScore > myScore ? 'text-emerald-500' : oppScore < myScore ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-800'}`}>{oppScore}</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{getFirstName(categoryRoundResult.opponentName)}</p>
            </div>
          </div>
        </div>

        {/* Weiter Button */}
        <button
          onClick={proceedAfterCategoryResult}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black text-lg rounded-2xl shadow-lg transition-all active:scale-95"
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
          <h2 className="text-3xl font-bold mb-6">Quizduell</h2>

          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-5 text-sm">
            <p className="font-bold text-amber-800 mb-2">Spielregeln - Zeitlimit & Strafen</p>
            <ul className="space-y-1 text-amber-700">
              <li>Für Herausforderungen kannst du eine <strong>Annahmefrist</strong> festlegen.</li>
              <li>Laufende Duelle behalten <strong>48 Stunden</strong> Zugfrist mit Erinnerung nach 24h.</li>
              <li>Wer seinen Zug nicht rechtzeitig macht oder eine Challenge ignoriert, <strong>verliert die Runde</strong>.</li>
              <li>Zusaetzlich werden dem Verlierer <strong>100 XP abgezogen</strong>.</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-bold mb-4">Spieler herausfordern</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Schwierigkeitsgrad wählen:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(DIFFICULTY_SETTINGS).map(([key, diff]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedDifficulty(key)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedDifficulty === key
                        ? `${diff.color} text-white border-transparent`
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-3xl mb-2">{diff.icon}</div>
                    <div className="font-bold">{diff.label}</div>
                    <div className="text-sm opacity-90">{diff.time} Sekunden</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timer für Herausforderung (Annahmefrist):
              </label>
              <select
                value={challengeTimeoutMinutes}
                onChange={(event) => setChallengeTimeoutMinutes(Number(event.target.value) || 1440)}
                className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 bg-white"
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
                  <div key={u.name} className={`grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-3 rounded-xl transition-all min-[720px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[720px]:items-center ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
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
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {roleLabel}{company}
                        </span>
                        {winrate !== null ? (
                          <span className={`font-medium ${winrate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                            - {winrate}% W/R ({totalVs} Sp.)
                          </span>
                        ) : (
                          <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>- Noch nicht gespielt</span>
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
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-bold text-sm transition-all w-full whitespace-normal text-center leading-tight"
                          >
                            Annehmen
                          </button>
                          {countdownHint && (
                            <div className={`mt-1 text-[11px] text-center font-mono ${darkMode ? 'text-gray-300' : countdownClass}`}>
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
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg font-bold text-sm transition-all w-full whitespace-normal text-center leading-tight animate-pulse"
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
                          <span className={`inline-flex w-full min-[720px]:w-auto justify-center text-xs italic px-3 py-1.5 rounded-lg whitespace-normal text-center leading-tight ${darkMode ? 'bg-slate-600 text-gray-300' : 'bg-gray-200 text-gray-500'}`}>
                            {isOutgoingChallenge ? 'Anfrage gesendet' : 'Läuft'}
                          </span>
                          {countdownHint && (
                            <div className={`mt-1 text-[11px] text-center font-mono ${darkMode ? 'text-gray-300' : countdownClass}`}>
                              {countdownHint}
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => challengePlayer(u.name, challengeTimeoutMinutes, u.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 text-sm transition-all col-span-2 min-[720px]:col-span-1 min-[720px]:justify-self-end w-full min-[720px]:w-auto whitespace-normal text-center leading-tight"
                      >
                        <Target size={16} />
                        <span>Herausfordern</span>
                      </button>
                    )}
                  </div>
                );
              })}
              {allUsers.filter(u => u.name !== user.name).length === 0 && (
                <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Noch keine anderen Spieler vorhanden</p>
              )}
            </div>
          </div>
        </>
      )}

      {currentGame && (
        <div className={`rounded-xl p-6 shadow-lg mb-6 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="text-center mb-4">
            <span className={`${currentDifficulty.color} text-white px-6 py-2 rounded-full font-bold inline-flex items-center gap-2`}>
              {currentDifficulty.icon} {currentDifficulty.label} - {(currentQuestion ? questionTimeLimit : currentDifficulty.time)} Sekunden pro Frage
            </span>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-center flex-1">
              <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getFirstName(currentGame.player1)}</p>
              <p className="text-3xl font-bold text-blue-500">{currentGame.player1Score}</p>
            </div>
            <div className="text-center flex-1">
              <p className={`text-2xl font-bold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Kategorie {(currentGame.categoryRound || 0) + 1}/4</p>
              {quizCategory && (
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Frage {questionInCategory + 1}/5
                </p>
              )}
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {playerTurn === user.name ? 'Du bist dran!' : `${getFirstName(playerTurn)} ist dran...`}
              </p>
            </div>
            <div className="text-center flex-1">
              <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getFirstName(currentGame.player2)}</p>
              <p className="text-3xl font-bold text-red-500">{currentGame.player2Score}</p>
            </div>
          </div>

          {currentGame.categoryRounds && currentGame.categoryRounds.length > 0 && !currentQuestion && (
            <div className="mb-4 flex justify-center gap-2 flex-wrap">
              {currentGame.categoryRounds.map((cr, idx) => {
                const cat = CATEGORIES.find(c => c.id === cr.categoryId);
                return (
                  <span key={idx} className={`${cat?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm`}>
                    {cat?.icon} {cat?.name}
                  </span>
                );
              })}
            </div>
          )}

          {!quizCategory && playerTurn === user.name && !waitingForOpponent && (
            <div>
              <div className={`mb-4 flex items-center justify-between gap-3 rounded-lg border p-3 ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-200 bg-gray-50'}`}>
                <div>
                  <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Adaptiver Lernmodus</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {adaptiveLearningEnabled ? 'Schwerere Fragen kommen oefter.' : 'Reiner Zufall.'}
                  </p>
                </div>
                <button
                  onClick={() => setAdaptiveLearningEnabled((prev) => !prev)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold ${
                    adaptiveLearningEnabled
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : darkMode ? 'bg-slate-600 hover:bg-slate-500 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {adaptiveLearningEnabled ? 'Aktiv' : 'Aus'}
                </button>
              </div>
              <h3 className={`text-xl font-bold text-center mb-4 ${darkMode ? 'text-white' : ''}`}>Wähle eine Kategorie:</h3>
              <p className={`text-center mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Du wählst 5 Fragen - danach spielt {getFirstName(currentGame.player1 === user.name ? currentGame.player2 : currentGame.player1)} die gleichen Fragen!</p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.filter(cat => {
                  const played = currentGame.categoryRounds?.map(cr => cr.categoryId) || [];
                  return !played.includes(cat.id);
                }).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat.id)}
                    className={`${cat.color} text-white rounded-xl p-4 hover:scale-105 transition-transform`}
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <div className="font-bold text-sm">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!currentQuestion && playerTurn === user.name && currentGame.categoryRounds && currentGame.categoryRounds.length > 0 && (() => {
            const currentCatRound = currentGame.categoryRounds[currentGame.categoryRound || 0];
            if (!currentCatRound) return false;
            const isPlayer1 = user.name === currentGame.player1;
            const myAnswers = isPlayer1 ? currentCatRound.player1Answers : currentCatRound.player2Answers;
            return myAnswers.length === 0 && currentCatRound.questions.length > 0;
          })() && (
            <div className="text-center py-8">
              <div className="text-4xl font-black mb-4 text-emerald-500">START</div>
              <p className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : ''}`}>
                {(() => {
                  const currentCatRound = currentGame.categoryRounds[currentGame.categoryRound || 0];
                  return currentCatRound?.categoryName || 'Kategorie';
                })()}
              </p>
              <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getFirstName(currentGame.player1 === user.name ? currentGame.player2 : currentGame.player1)} hat diese Kategorie gespielt. Jetzt bist du dran mit den gleichen 5 Fragen!
              </p>
              <button
                onClick={startCategoryAsSecondPlayer}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                Los geht's
              </button>
            </div>
          )}

          {!quizCategory && playerTurn !== user.name && (
            <div className="text-center py-12">
              <div className={`text-4xl mb-4 animate-pulse`}>⏳</div>
              <p className={`text-xl font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {getFirstName(playerTurn)} ist dran...
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {waitingForOpponent ? 'Dein Gegner spielt jetzt die gleichen Fragen' : 'Dein Gegner wählt eine Kategorie'}
              </p>
            </div>
          )}

          {currentQuestion && playerTurn === user.name && (
            <div className="space-y-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {(() => {
                      const cat = CATEGORIES.find(c => c.id === quizCategory);
                      return cat ? `${cat.icon} ${cat.name}` : 'Frage';
                    })()}
                  </span>
                  <span className={`text-2xl font-bold ${
                    timeLeft <= 10 ? 'text-red-500 animate-pulse' : darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className={`w-full rounded-full h-3 overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      timeLeft <= 10 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(timeLeft / questionTimeLimit) * 100}%` }}
                  />
                </div>
              </div>

              <div className={`rounded-xl p-6 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                <p className={`text-xl font-bold text-center ${darkMode ? 'text-white' : ''}`}>
                  {questionIsWhoAmI ? (currentQuestion.prompt || 'Was bin ich?') : currentQuestion.q}
                </p>
                {questionIsWhoAmI && (
                  <div className={`mt-4 rounded-xl border p-4 text-left ${darkMode ? 'border-slate-600 bg-slate-800' : 'border-slate-300 bg-white'}`}>
                    <p className={`text-center text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                      60 Sekunden Zeit. Schwierigkeit <span className="font-bold">{currentDifficulty.label}</span> zeigt dir {whoAmIClueCount} von {currentQuestion?.clues?.length || 5} Eigenschaften.
                    </p>
                    <div className="mt-3 space-y-2">
                      {visibleWhoAmIClues.map((clue, index) => (
                        <div key={`${currentQuestion?.id || 'whoami'}-${index}`} className={`rounded-lg px-3 py-2 text-sm ${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-slate-100 text-slate-700'}`}>
                          <span className={`mr-2 font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{index + 1}.</span>
                          {clue}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {currentQuestion.multi && !answered && !questionIsKeyword && !questionIsWhoAmI && !quizMCKeywordMode && (
                  <p className="text-center text-sm text-orange-600 mt-2 font-medium">
                    Mehrere Antworten sind richtig - wähle alle richtigen aus.
                  </p>
                )}
                {questionIsKeyword && (
                  <p className="text-center text-sm text-indigo-700 mt-2 font-medium">
                    Extra schwer: Freitext antworten und mindestens {requiredKeywordGroups} Schlagwoerter treffen.
                  </p>
                )}
                {quizMCKeywordMode && !questionIsKeyword && !questionIsWhoAmI && (
                  <p className="text-center text-sm text-violet-700 mt-2 font-medium">
                    Schlagwort-Modus: Antworte frei und triff die Schlüsselbegriffe.
                  </p>
                )}
              </div>

              {!questionIsKeyword && !questionIsWhoAmI && !quizMCKeywordMode && !answered && (
                <button
                  onClick={() => setQuizMCKeywordMode(true)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-all border hover:text-violet-700 hover:border-violet-300 hover:bg-violet-50 ${darkMode ? 'bg-slate-700 text-gray-400 border-slate-600' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
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
                      const isCorrectAnswer = isMulti
                        ? currentQuestion.correct.includes(idx)
                        : idx === currentQuestion.correct;

                      let buttonClass = '';
                      if (answered) {
                        if (isCorrectAnswer) {
                          buttonClass = 'bg-green-500 text-white animate-correct-flash';
                        } else if ((isMulti && isSelectedMulti) || (!isMulti && isSelectedSingle)) {
                          buttonClass = 'bg-red-500 text-white';
                        } else {
                          buttonClass = darkMode ? 'bg-slate-600 text-gray-400' : 'bg-gray-200 text-gray-500';
                        }
                      } else if (isMulti && isSelectedMulti) {
                        buttonClass = 'bg-blue-500 text-white border-2 border-blue-600';
                      } else {
                        buttonClass = darkMode
                          ? 'bg-slate-700 text-gray-200 hover:bg-slate-600 border-2 border-slate-600 hover:border-blue-500'
                          : 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500';
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
                      className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                    >
                      Antwort bestätigen ({selectedAnswers.length} ausgewaehlt)
                    </button>
                  )}
                </>
              )}

              {questionUsesFreeText && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400">
                    Singular und Plural werden beide erkannt. Schreib, wie es natürlich klingt.
                  </p>
                  {questionIsWhoAmI ? (
                    <p className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                      Gesucht ist genau ein Begriff. Im Quizduell zaehlt bei richtiger Lösung ein normaler Punkt.
                    </p>
                  ) : (
                    <p className={`text-xs font-semibold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      Wertung: jedes erkannte Schlagwort = 1 Punkt, vollstaendig geloest = +2 Bonus.
                    </p>
                  )}
                  <textarea
                    value={keywordAnswerText}
                    onChange={(e) => setKeywordAnswerText(e.target.value)}
                    disabled={answered}
                    rows={5}
                    placeholder={questionIsWhoAmI ? 'Schreibe den gesuchten Begriff...' : 'Schreibe deine Antwort frei und nenne die wichtigsten Schlagwoerter...'}
                    className={`w-full px-4 py-3 border-2 border-indigo-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${darkMode ? 'bg-slate-700 text-gray-200 placeholder-gray-500 disabled:bg-slate-800 disabled:text-gray-500' : 'disabled:bg-gray-100 disabled:text-gray-500'}`}
                  />
                  {!answered && (
                    <button
                      onClick={submitKeywordAnswer}
                      disabled={!keywordAnswerText.trim()}
                      className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                        keywordAnswerText.trim()
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                          : 'bg-indigo-300 cursor-not-allowed'
                      }`}
                    >
                      {questionIsWhoAmI ? 'Begriff prüfen' : 'Antwort prüfen'}
                    </button>
                  )}

                  {keywordAnswerEvaluation && (
                    <div className={`rounded-xl border-2 p-4 ${
                      keywordAnswerEvaluation.isCorrect
                        ? darkMode ? 'border-emerald-500 bg-emerald-900/30' : 'border-emerald-400 bg-emerald-50'
                        : darkMode ? 'border-amber-500 bg-amber-900/30' : 'border-amber-400 bg-amber-50'
                    }`}>
                      <p className={`font-bold ${keywordAnswerEvaluation.isCorrect ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {keywordAnswerEvaluation.isCorrect
                          ? (questionIsWhoAmI ? 'Richtig erkannt.' : 'Treffer! Antwort ist korrekt.')
                          : (questionIsWhoAmI ? 'Noch nicht der gesuchte Begriff.' : 'Noch nicht ausreichend.')}
                      </p>
                      {!questionIsWhoAmI && (
                        <>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Treffer: {keywordAnswerEvaluation.matchedCount}/{keywordAnswerEvaluation.requiredGroups} erforderlich
                          </p>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Punkte: {keywordAnswerEvaluation.basePoints || 0}{Number(keywordAnswerEvaluation.bonusPoints || 0) > 0 ? ` + ${keywordAnswerEvaluation.bonusPoints} Bonus` : ''} = <span className="font-bold">{keywordAnswerEvaluation.awardedPoints || 0}</span>
                          </p>
                        </>
                      )}
                      {keywordAnswerEvaluation.timedOut && (
                        <p className="text-sm text-red-500 mt-1 font-semibold">Zeit abgelaufen - Antwort wurde als falsch gewertet.</p>
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
                        <p className={`text-sm mt-3 border-t pt-2 ${darkMode ? 'text-gray-300 border-slate-600' : 'text-gray-700 border-gray-300'}`}>
                          {questionIsWhoAmI ? `Gesucht war: ${currentQuestion.answerGuide}` : `Musterloesung: ${currentQuestion.answerGuide}`}
                        </p>
                      )}
                      {quizMCKeywordMode && !questionIsKeyword && !questionIsWhoAmI && (
                        <p className={`text-sm mt-3 border-t pt-2 ${darkMode ? 'text-gray-300 border-slate-600' : 'text-gray-700 border-gray-300'}`}>
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
                className={`w-full mt-2 py-2 rounded-lg font-semibold border ${darkMode ? 'bg-amber-900/30 hover:bg-amber-900/50 text-amber-400 border-amber-700' : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300'}`}
              >
                Frage melden
              </button>

              {answered && timeLeft === 0 && (
                <div className={`border-2 border-red-500 rounded-xl p-4 text-center ${darkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                  <p className="text-red-500 font-bold">Zeit abgelaufen!</p>
                </div>
              )}

              {answered && (
                <button
                  onClick={proceedToNextRound}
                  className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
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
