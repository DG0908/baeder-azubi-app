import React from 'react';
import { Bell, Calendar, Brain, Trophy, Zap, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { DAILY_WISDOM, DID_YOU_KNOW_FACTS } from '../../data/content';

const DIFFICULTY_SETTINGS = {
  anfaenger: { time: 45, label: 'Anfaenger', icon: '\u{1F7E2}', color: 'bg-green-500' },
  profi: { time: 30, label: 'Profi', icon: '\u{1F7E1}', color: 'bg-yellow-500' },
  experte: { time: 15, label: 'Experte', icon: '\u{1F534}', color: 'bg-red-500' },
  extra: { time: 75, label: 'Extra schwer', icon: '\u{1F9E0}', color: 'bg-indigo-700' }
};

const HomeView = ({
  rotateGeneralKnowledge,
  dailyWisdom,
  userStats,
  getTotalXpFromStats,
  setCurrentView,
  dailyChallenges,
  getChallengeProgress,
  isChallengeCompleted,
  getCompletedChallengesCount,
  getTotalXPEarned,
  weeklyProgress,
  buildEmptyWeeklyProgress,
  getWeekStartStamp,
  setWeeklyProgress,
  weeklyGoals,
  sanitizeGoalValue,
  setWeeklyGoals,
  getTotalDueCards,
  setSpacedRepetitionMode,
  activeGames,
  acceptChallenge,
  continueGame,
  news,
  exams,
  setExamSimulatorMode,
  loadFlashcards,
  materials,
  resources,
  messages,
}) => {
  const { user } = useAuth();
  const { darkMode, playSound } = useApp();
  const dueCards = getTotalDueCards();
  const completedChallenges = getCompletedChallengesCount();
  const [weeklyGoalsExpanded, setWeeklyGoalsExpanded] = React.useState(false);
  const waitingChallenges = activeGames.filter(g => g.player2 === user.name && g.status === 'waiting');
  const activeGamesForUser = activeGames.filter(g => (g.player1 === user.name || g.player2 === user.name) && g.status === 'active');
  const playerTurnChallenges = activeGamesForUser.filter(g => g.currentTurn === user.name);
  const actionableChallenges = [
    ...waitingChallenges.map((game) => ({ ...game, challengeType: 'waiting' })),
    ...playerTurnChallenges.map((game) => ({ ...game, challengeType: 'turn' }))
  ];
  const playerTurnGame = activeGamesForUser.find(g => g.currentTurn === user.name);

  const nextExam = exams
    .map((exam) => {
      const examDate = new Date(exam.date);
      const daysUntil = Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24));
      return { ...exam, examDate, daysUntil };
    })
    .filter((exam) => !Number.isNaN(exam.examDate.getTime()) && exam.daysUntil >= 0)
    .sort((a, b) => a.examDate - b.examDate)[0] || null;

  const openView = (view) => {
    setCurrentView(view);
    playSound('splash');
  };

  const openExamSimulator = () => {
    setCurrentView('exam-simulator');
    setExamSimulatorMode('theory');
    playSound('splash');
  };

  const openFlashcards = () => {
    setCurrentView('flashcards');
    loadFlashcards();
    playSound('splash');
  };

  const openSpacedRepetition = () => {
    setSpacedRepetitionMode(true);
    setCurrentView('flashcards');
    playSound('splash');
  };

  const getWaitingChallengeRemainingMs = (gameInput) => {
    const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
    const explicitExpiry = new Date(game.challengeExpiresAt || '').getTime();
    if (Number.isFinite(explicitExpiry)) {
      return explicitExpiry - Date.now();
    }
    const createdTs = new Date(game.createdAt || game.updatedAt || '').getTime();
    const timeoutMinutesRaw = Number(game.challengeTimeoutMinutes || 2880);
    const timeoutMinutes = Number.isFinite(timeoutMinutesRaw) ? Math.max(15, timeoutMinutesRaw) : 2880;
    if (!Number.isFinite(createdTs)) return Number.POSITIVE_INFINITY;
    return (createdTs + timeoutMinutes * 60 * 1000) - Date.now();
  };

  const formatRemainingTime = (remainingMsInput) => {
    const remainingMs = Number(remainingMsInput);
    if (!Number.isFinite(remainingMs)) return '';
    if (remainingMs <= 0) return 'Abgelaufen';
    const totalMinutes = Math.max(1, Math.ceil(remainingMs / 60000));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    return `${minutes}m`;
  };

  const totalXp = getTotalXpFromStats(userStats);

  // Actionable items count for badge
  const actionCount = actionableChallenges.length + (dueCards > 0 ? 1 : 0);

  // Quick-nav cards (compact)
  const quickCards = [
    { id: 'exam', icon: '\u{1F4DD}', label: 'Prüfung', onClick: openExamSimulator, accent: 'cyan' },
    { id: 'flash', icon: '\u{1F3B4}', label: 'Karten', badge: dueCards > 0 ? dueCards : null, onClick: openFlashcards, accent: 'purple' },
    { id: 'quiz', icon: '\u{1F3AE}', label: 'Quiz', badge: playerTurnGame ? '!' : null, onClick: () => openView('quiz'), accent: 'green' },
    { id: 'swim', icon: '\u{1F3CA}', label: 'Schwimmen', onClick: () => openView('swim-challenge'), accent: 'blue' },
    { id: 'report', icon: '\u{1F4D6}', label: 'Bericht', onClick: () => openView('berichtsheft'), accent: 'teal' },
    { id: 'chat', icon: '\u{1F4AC}', label: 'Chat', badge: messages.length > 0 ? messages.length : null, onClick: () => openView('chat'), accent: 'pink' },
  ];

  return (
    <div className="space-y-4">
      {/* Header — kompakt mit Stats-Leiste */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-900' : 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500'} text-white rounded-xl p-5 shadow-xl`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold">Willkommen zurück!</h2>
            <p className="text-sm text-white/70 mt-0.5">{dailyWisdom || DAILY_WISDOM[0] || DID_YOU_KNOW_FACTS[0] || ''}</p>
          </div>
          <button
            onClick={() => setCurrentView('profile')}
            className={`${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/20 hover:bg-white/30'} px-3 py-2 rounded-lg border ${darkMode ? 'border-white/20' : 'border-white/30'} text-sm font-medium transition-all`}
          >
            Profil
          </button>
        </div>
        {userStats && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {[
              { val: userStats.wins, label: 'Siege' },
              { val: userStats.losses, label: 'Niederl.' },
              { val: userStats.draws, label: 'Remis' },
              { val: totalXp, label: 'XP' },
            ].map(s => (
              <div key={s.label} className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-lg px-4 py-2 text-center min-w-[80px] flex-shrink-0`}>
                <div className="text-lg font-bold">{s.val}</div>
                <div className="text-[11px] text-white/80">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick-Nav — horizontale Icons */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {quickCards.map(card => (
          <button
            key={card.id}
            onClick={card.onClick}
            className={`relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl min-w-[72px] flex-shrink-0 transition-all ${
              darkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm'
            }`}
          >
            <span className="text-2xl">{card.icon}</span>
            <span className="text-[11px] font-semibold">{card.label}</span>
            {card.badge && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {card.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Aktions-Bereich — Herausforderungen + Karteikarten-Erinnerung zusammen */}
      {(actionableChallenges.length > 0 || dueCards > 0) && (
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-4 shadow-lg space-y-3`}>
          <h3 className={`text-sm font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Deine Aufgaben ({actionCount})
          </h3>

          {dueCards > 0 && (
            <button
              onClick={openSpacedRepetition}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                darkMode ? 'bg-purple-900/40 hover:bg-purple-900/60 border-purple-700' : 'bg-purple-50 hover:bg-purple-100 border-purple-200'
              } border`}
            >
              <div className="flex items-center gap-3">
                <Brain size={20} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
                <div className="text-left">
                  <p className={`text-sm font-bold ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                    {dueCards} Lernkarten fällig
                  </p>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${darkMode ? 'bg-purple-700 text-purple-200' : 'bg-purple-200 text-purple-800'}`}>
                Jetzt lernen
              </span>
            </button>
          )}

          {actionableChallenges.map(game => {
            const diff = DIFFICULTY_SETTINGS[game.difficulty] || DIFFICULTY_SETTINGS.profi;
            const isWaiting = game.challengeType === 'waiting';
            const remainingMs = getWaitingChallengeRemainingMs(game);
            const isExpired = isWaiting && Number.isFinite(remainingMs) && remainingMs <= 0;
            const opponentName = isWaiting
              ? game.player1
              : (game.player1 === user.name ? game.player2 : game.player1);
            return (
              <div key={game.id} className={`flex items-center justify-between gap-3 p-3 rounded-lg ${
                darkMode ? 'bg-slate-700/60' : 'bg-gray-50'
              }`}>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {isWaiting ? `${opponentName} fordert dich!` : `Du bist dran vs. ${opponentName}`}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {diff.label}
                    {isWaiting && <span className="ml-2">{formatRemainingTime(remainingMs)}</span>}
                    {!isWaiting && <span className="ml-2">{game.player1Score}:{game.player2Score}</span>}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (isWaiting) acceptChallenge(game.id);
                    else continueGame(game.id);
                    playSound('whistle');
                  }}
                  disabled={isExpired}
                  className={`px-4 py-2 rounded-lg text-sm font-bold flex-shrink-0 ${
                    isExpired
                      ? (darkMode ? 'bg-slate-600 text-gray-500' : 'bg-gray-200 text-gray-400')
                      : isWaiting
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-cyan-500 hover:bg-cyan-600 text-white animate-pulse'
                  }`}
                >
                  {isExpired ? 'Abgelaufen' : isWaiting ? 'Annehmen' : 'Spielen'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Win Streak — kompakt inline */}
      {userStats && userStats.winStreak >= 3 && (
        <div className={`flex items-center gap-3 p-3 rounded-xl ${
          userStats.winStreak >= 10
            ? darkMode ? 'bg-orange-900/50 border-orange-600' : 'bg-orange-50 border-orange-300'
            : darkMode ? 'bg-yellow-900/50 border-yellow-700' : 'bg-yellow-50 border-yellow-300'
        } border`}>
          <span className="text-2xl">{userStats.winStreak >= 10 ? '\u{1F525}' : '\u{26A1}'}</span>
          <div className="flex-1 min-w-0">
            <span className={`text-sm font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
              {userStats.winStreak}er Siegesserie!
            </span>
            <span className={`text-xs ml-2 ${darkMode ? 'text-yellow-400/70' : 'text-yellow-700'}`}>
              Bester: {userStats.bestWinStreak}
            </span>
          </div>
        </div>
      )}

      {/* Daily Challenges — kompakt als Fortschrittsbalken */}
      {dailyChallenges?.length > 0 && (
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-4 shadow-lg`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Tages-Challenges ({completedChallenges}/{dailyChallenges.length})
            </h3>
            {completedChallenges === dailyChallenges.length && (
              <span className="text-xs font-bold text-green-500">+{getTotalXPEarned()} XP</span>
            )}
          </div>
          <div className="space-y-2">
            {dailyChallenges.map((challenge, idx) => {
              const progress = getChallengeProgress(challenge);
              const completed = isChallengeCompleted(challenge);
              const pct = Math.min(100, Math.round(progress * 100));
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className={`text-sm ${completed ? 'opacity-50' : ''}`}>
                    {completed ? '\u{2705}' : '\u{1F3AF}'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-medium truncate ${completed ? (darkMode ? 'text-green-400 line-through' : 'text-green-600 line-through') : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>
                        {challenge.label}
                      </span>
                      <span className={`text-[10px] ml-2 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className={`h-1.5 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                      <div
                        className={`h-1.5 rounded-full transition-all ${completed ? 'bg-green-500' : 'bg-cyan-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* News + Klausuren nebeneinander */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* News */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-4 shadow-lg`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Bell size={16} /> News
            </h3>
            <button onClick={() => openView('news')} className={`text-xs font-semibold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              Alle
            </button>
          </div>
          {news.length > 0 ? (
            <div className="space-y-2">
              {news.slice(0, 3).map(item => (
                <div key={item.id} className={`${darkMode ? 'bg-slate-700/60' : 'bg-gray-50'} rounded-lg p-3 border-l-3 border-red-500`}>
                  <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</p>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>{item.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Keine News</p>
          )}
        </div>

        {/* Klausuren */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-4 shadow-lg`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Calendar size={16} /> Klausuren
            </h3>
            <button onClick={() => openView('exams')} className={`text-xs font-semibold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              Alle
            </button>
          </div>
          {exams.length > 0 ? (
            <div className="space-y-2">
              {exams.slice(0, 3).map(exam => {
                const examDate = new Date(exam.date);
                const daysUntil = Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysUntil <= 7 && daysUntil >= 0;
                return (
                  <div key={exam.id} className={`${darkMode ? 'bg-slate-700/60' : 'bg-gray-50'} rounded-lg p-3 border-l-3 ${isUrgent ? 'border-orange-500' : 'border-green-500'}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{exam.title}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isUrgent ? 'bg-orange-500 text-white' : darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                      }`}>
                        {daysUntil > 0 ? `${daysUntil}d` : daysUntil === 0 ? 'Heute!' : 'Vorbei'}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>{exam.topics}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Keine Klausuren</p>
          )}
        </div>
      </div>

      {/* Wochenziele — standardmäßig eingeklappt */}
      <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg overflow-hidden`}>
        <button
          onClick={() => setWeeklyGoalsExpanded(prev => !prev)}
          className={`w-full flex items-center justify-between p-4 transition-all ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}
        >
          <div className="flex items-center gap-3">
            <Target size={18} className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} />
            <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Wochenziele</span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              KW {new Date(`${weeklyProgress.weekStart}T00:00:00`).toLocaleDateString('de-DE')}
            </span>
          </div>
          {weeklyGoalsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {weeklyGoalsExpanded && (
          <div className="px-4 pb-4 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { key: 'quizAnswers', label: 'Quiz' },
                { key: 'examAnswers', label: 'Prüfung' },
                { key: 'flashcards', label: 'Karten' },
                { key: 'checklistItems', label: 'Praxis' }
              ].map(metric => {
                const target = sanitizeGoalValue(weeklyGoals[metric.key], 0);
                const current = sanitizeGoalValue(weeklyProgress.stats?.[metric.key], 0);
                const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
                return (
                  <div key={metric.key} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700/60' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{metric.label}</span>
                      <span className={`text-[10px] font-bold ${pct >= 100 ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {current}/{target}
                      </span>
                    </div>
                    <div className={`h-1.5 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                      <div className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-green-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { key: 'quizAnswers', label: 'Quiz/Wo.' },
                { key: 'examAnswers', label: 'Prüfung/Wo.' },
                { key: 'flashcards', label: 'Karten/Wo.' },
                { key: 'checklistItems', label: 'Praxis/Wo.' }
              ].map(metric => (
                <input
                  key={metric.key}
                  type="number"
                  min="0"
                  step="1"
                  placeholder={metric.label}
                  value={sanitizeGoalValue(weeklyGoals[metric.key], 0)}
                  onChange={(e) => setWeeklyGoals(prev => ({ ...prev, [metric.key]: sanitizeGoalValue(e.target.value, 0) }))}
                  className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setWeeklyProgress(buildEmptyWeeklyProgress(getWeekStartStamp()))}
              className={`text-xs font-semibold ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Woche zurücksetzen
            </button>
          </div>
        )}
      </div>

      {/* Funktionsbereiche — kompakter */}
      <div className="space-y-4">
        {/* Lernen */}
        <div>
          <h3 className={`text-sm font-bold uppercase tracking-wide mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lernen</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: '\u{1F4DD}', title: 'Prüfungssimulator', sub: nextExam ? `Klausur in ${nextExam.daysUntil}d` : 'Theorie & Praxis', onClick: openExamSimulator, color: 'cyan' },
              { icon: '\u{1F3B4}', title: 'Karteikarten', sub: dueCards > 0 ? `${dueCards} fällig` : 'Keine fällig', onClick: openFlashcards, color: 'purple' },
              { icon: '\u{1F9EE}', title: 'Rechner', sub: 'Praxis-Formeln', onClick: () => openView('calculator'), color: 'blue' },
              { icon: '\u{1F3AE}', title: 'Quizduell', sub: `${activeGamesForUser.length} aktiv`, onClick: () => openView('quiz'), color: 'green' },
            ].map(c => (
              <button key={c.title} onClick={c.onClick} className={`p-4 rounded-xl text-left transition-all hover:-translate-y-0.5 ${
                darkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm'
              } border`}>
                <span className="text-2xl">{c.icon}</span>
                <p className={`text-sm font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{c.title}</p>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{c.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Praxis */}
        <div>
          <h3 className={`text-sm font-bold uppercase tracking-wide mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Praxis & Nachweise</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: '\u{1F3CA}', title: 'Schwimm-Challenge', sub: 'Disziplinen trainieren', onClick: () => openView('swim-challenge'), color: 'cyan' },
              { icon: '\u{1F4D6}', title: 'Berichtsheft', sub: 'Wochenberichte', onClick: () => openView('berichtsheft'), color: 'teal' },
              { icon: '\u{1F393}', title: 'Kontrollkarte', sub: 'Berufsschule', onClick: () => openView('school-card'), color: 'orange' },
              { icon: '\u{1F4A1}', title: 'Fragen', sub: 'Pool erweitern', onClick: () => openView('questions'), color: 'amber' },
            ].map(c => (
              <button key={c.title} onClick={c.onClick} className={`p-4 rounded-xl text-left transition-all hover:-translate-y-0.5 ${
                darkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm'
              } border`}>
                <span className="text-2xl">{c.icon}</span>
                <p className={`text-sm font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{c.title}</p>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{c.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Team & Übersicht */}
        <div>
          <h3 className={`text-sm font-bold uppercase tracking-wide mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Team & Übersicht</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ...(user.permissions.canViewAllStats ? [{ icon: '\u{1F468}\u200D\u{1F3EB}', title: 'Azubi-Übersicht', sub: 'Trainer-Bereich', onClick: () => openView('trainer-dashboard') }] : []),
              { icon: '\u{1F3C5}', title: 'Statistiken', sub: userStats ? `${userStats.wins} Siege` : 'Ranglisten', onClick: () => openView('stats') },
              { icon: '\u{1F4DA}', title: 'Materialien', sub: `${materials.length} Dateien`, onClick: () => openView('materials') },
              { icon: '\u{1F517}', title: 'Ressourcen', sub: `${resources.length} Links`, onClick: () => openView('resources') },
              { icon: '\u{1F4AC}', title: 'Chat', sub: `${messages.length} Nachrichten`, onClick: () => openView('chat') },
            ].map(c => (
              <button key={c.title} onClick={c.onClick} className={`p-4 rounded-xl text-left transition-all hover:-translate-y-0.5 ${
                darkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm'
              } border`}>
                <span className="text-2xl">{c.icon}</span>
                <p className={`text-sm font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{c.title}</p>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{c.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
