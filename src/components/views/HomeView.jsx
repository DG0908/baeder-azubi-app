import React from 'react';
import { Bell, Calendar, Brain, Trophy, Zap, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { DAILY_WISDOM, DID_YOU_KNOW_FACTS } from '../../data/content';

const DIFFICULTY_SETTINGS = {
  anfaenger: { time: 45, label: 'Anfänger', icon: '🟢', color: 'bg-green-500' },
  profi: { time: 30, label: 'Profi', icon: '🟡', color: 'bg-yellow-500' },
  experte: { time: 15, label: 'Experte', icon: '🔴', color: 'bg-red-500' }
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

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-900' : 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500'} text-white rounded-xl p-8 text-center shadow-xl backdrop-blur-sm`}>
        <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">🌊 Willkommen zurück! 💦</h2>
        <div className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-white/20 border-white/30'} border rounded-lg p-3 mb-4 max-w-3xl mx-auto`}>
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-90">🧠 Allgemeinbildung</span>
            <button
              onClick={rotateGeneralKnowledge}
              className={`${darkMode ? 'bg-white/15 hover:bg-white/25 border-white/20' : 'bg-white/25 hover:bg-white/35 border-white/30'} border px-2.5 py-1 rounded-md text-xs font-semibold transition-all`}
            >
              Neuer Satz
            </button>
          </div>
          <p className="text-sm opacity-95 italic">
            💡 {dailyWisdom || DAILY_WISDOM[0] || DID_YOU_KNOW_FACTS[0] || 'Wissen lädt...'}
          </p>
        </div>
        {userStats && (
          <div className="mt-4 -mx-2 px-2 overflow-x-auto swipe-stats-scroll">
            <div className="flex gap-4 md:justify-center snap-x snap-mandatory min-w-max md:min-w-0">
              <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm rounded-lg px-6 py-3 border-2 ${darkMode ? 'border-white/20' : 'border-white/30'} min-w-[170px] text-center snap-center`}>
              <div className="text-2xl font-bold">🏆 {userStats.wins}</div>
              <div className="text-sm">Siege</div>
              </div>
              <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm rounded-lg px-6 py-3 border-2 ${darkMode ? 'border-white/20' : 'border-white/30'} min-w-[170px] text-center snap-center`}>
              <div className="text-2xl font-bold">💪 {userStats.losses}</div>
              <div className="text-sm">Niederlagen</div>
              </div>
              <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm rounded-lg px-6 py-3 border-2 ${darkMode ? 'border-white/20' : 'border-white/30'} min-w-[170px] text-center snap-center`}>
              <div className="text-2xl font-bold">🤝 {userStats.draws}</div>
              <div className="text-sm">Unentschieden</div>
              </div>
              <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm rounded-lg px-6 py-3 border-2 ${darkMode ? 'border-white/20' : 'border-white/30'} min-w-[170px] text-center snap-center`}>
              <div className="text-2xl font-bold">⭐ {getTotalXpFromStats(userStats)}</div>
              <div className="text-sm">XP Gesamt</div>
              </div>
            </div>
          </div>
        )}
        {/* Profil-Button */}
        <button
          onClick={() => setCurrentView('profile')}
          className={`mt-4 inline-flex items-center gap-2 px-6 py-3 ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/20 hover:bg-white/30'} backdrop-blur-sm rounded-lg border-2 ${darkMode ? 'border-white/20' : 'border-white/30'} transition-all font-medium`}
        >
          <span className="text-xl">👤</span>
          <span>Mein Profil</span>
        </button>
      </div>

      {/* Daily Challenges Section */}
      {dailyChallenges.length > 0 && (
        <div className={`${darkMode ? 'bg-gradient-to-r from-orange-900/80 via-amber-900/80 to-orange-900/80' : 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50'} backdrop-blur-sm border-2 ${darkMode ? 'border-orange-700' : 'border-orange-300'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold flex items-center ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
              <Target className="mr-2" />
              🎯 Tägliche Challenges
            </h3>
            <div className={`flex items-center gap-2 ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
              <span className="text-sm font-medium">{getCompletedChallengesCount()}/3 erledigt</span>
              {getCompletedChallengesCount() === 3 && <span className="text-xl">🏆</span>}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {dailyChallenges.map((challenge, idx) => {
              const progress = getChallengeProgress(challenge);
              const completed = isChallengeCompleted(challenge);
              const percentage = Math.min((progress / challenge.target) * 100, 100);

              return (
                <div
                  key={idx}
                  className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-4 shadow-md transition-all ${
                    completed ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{challenge.icon}</span>
                    {completed && <span className="text-green-500 text-xl">✓</span>}
                  </div>
                  <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {challenge.name}
                  </h4>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {challenge.target} {challenge.unit}
                    {challenge.category && ` ${challenge.category.name}`}
                  </p>
                  <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-3 mb-2`}>
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        completed ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {progress}/{challenge.target}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      completed
                        ? 'bg-green-100 text-green-700'
                        : darkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700'
                    }`}>
                      +{challenge.xpReward} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {getCompletedChallengesCount() === 3 && (
            <div className={`mt-4 text-center p-3 rounded-lg ${darkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
              <p className={`font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                🎉 Alle Challenges geschafft! Du hast heute {getTotalXPEarned()} XP verdient!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Weekly Goals Section */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-emerald-900/80 via-cyan-900/70 to-emerald-900/80 border-emerald-700' : 'bg-gradient-to-r from-emerald-50 via-cyan-50 to-emerald-50 border-emerald-300'} border-2 rounded-xl p-6 shadow-lg`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
              📅 Wochenziele
            </h3>
            <p className={`text-sm ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              Woche ab {new Date(`${weeklyProgress.weekStart}T00:00:00`).toLocaleDateString('de-DE')}
            </p>
          </div>
          <button
            onClick={() => setWeeklyProgress(buildEmptyWeeklyProgress(getWeekStartStamp()))}
            className={`${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700'} px-4 py-2 rounded-lg text-sm font-bold border ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}
          >
            Diese Woche resetten
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-3 mb-4">
          {[
            { key: 'quizAnswers', label: 'Quiz', icon: '🎯' },
            { key: 'examAnswers', label: 'Pruefung', icon: '📝' },
            { key: 'flashcards', label: 'Karteikarten', icon: '🧠' },
            { key: 'checklistItems', label: 'Praxis', icon: '✅' }
          ].map((metric) => {
            const target = sanitizeGoalValue(weeklyGoals[metric.key], 0);
            const current = sanitizeGoalValue(weeklyProgress.stats?.[metric.key], 0);
            const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
            return (
              <div key={metric.key} className={`${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-gray-200'} border rounded-lg p-3`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{metric.icon}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${percentage >= 100 ? 'bg-green-500 text-white' : darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {percentage}%
                  </span>
                </div>
                <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {metric.label}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {current} / {target}
                </p>
                <div className={`mt-2 h-2 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-2 rounded-full ${percentage >= 100 ? 'bg-green-500' : 'bg-emerald-500'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-4 gap-3">
          {[
            { key: 'quizAnswers', label: 'Quiz/Woche' },
            { key: 'examAnswers', label: 'Pruefung/Woche' },
            { key: 'flashcards', label: 'Karten/Woche' },
            { key: 'checklistItems', label: 'Praxis/Woche' }
          ].map((metric) => (
            <label key={metric.key} className="block">
              <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {metric.label}
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={sanitizeGoalValue(weeklyGoals[metric.key], 0)}
                onChange={(event) => {
                  const value = sanitizeGoalValue(event.target.value, 0);
                  setWeeklyGoals((prev) => ({ ...prev, [metric.key]: value }));
                }}
                className={`mt-1 w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Win Streak Banner */}
      {userStats && userStats.winStreak >= 3 && (
        <div className={`${
          userStats.winStreak >= 10
            ? darkMode ? 'bg-gradient-to-r from-orange-900/80 via-red-900/80 to-orange-900/80 border-orange-500' : 'bg-gradient-to-r from-orange-100 via-red-100 to-orange-100 border-orange-400'
            : darkMode ? 'bg-gradient-to-r from-yellow-900/80 via-amber-900/80 to-yellow-900/80 border-yellow-600' : 'bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border-yellow-400'
        } backdrop-blur-sm border-2 rounded-xl p-4 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-pulse">
                {userStats.winStreak >= 25 ? '💎' : userStats.winStreak >= 15 ? '🏆' : userStats.winStreak >= 10 ? '🔥' : userStats.winStreak >= 5 ? '⚡' : '💪'}
              </span>
              <div>
                <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {userStats.winStreak} Siege in Folge!
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {userStats.winStreak >= 25 ? 'Legendäre Serie!' :
                   userStats.winStreak >= 15 ? 'Dominanz pur!' :
                   userStats.winStreak >= 10 ? 'Unaufhaltsam!' :
                   userStats.winStreak >= 5 ? 'Durchstarter!' : 'Weiter so!'}
                </p>
              </div>
            </div>
            <div className={`text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="text-sm">Nächster Meilenstein</p>
              <p className="font-bold">
                {(() => {
                  const milestones = [3, 5, 10, 15, 25, 50];
                  const next = milestones.find(m => m > userStats.winStreak);
                  return next ? `${next - userStats.winStreak} bis ${next}` : 'Maximum erreicht!';
                })()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Spaced Repetition Reminder */}
      {getTotalDueCards() > 0 && (
        <div className={`${darkMode ? 'bg-purple-900/80' : 'bg-purple-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-purple-700' : 'border-purple-300'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className={`mr-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={32} />
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                  🧠 Lernkarten zur Wiederholung
                </h3>
                <p className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {getTotalDueCards()} Karten sind heute fällig
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSpacedRepetitionMode(true);
                setCurrentView('flashcards');
                playSound('splash');
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold shadow-md flex items-center gap-2"
            >
              <Zap size={18} />
              Jetzt wiederholen
            </button>
          </div>
        </div>
      )}

      {activeGames.filter(g => g.player2 === user.name && g.status === 'waiting').length > 0 && (
        <div className={`${darkMode ? 'bg-yellow-900/80' : 'bg-yellow-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-yellow-700' : 'border-yellow-400'} rounded-xl p-6 shadow-lg`}>
          <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
            <Zap className="mr-2" />
            ⚡ Offene Herausforderungen
          </h3>
          {activeGames.filter(g => g.player2 === user.name && g.status === 'waiting').map(game => {
            const diff = DIFFICULTY_SETTINGS[game.difficulty];
            return (
              <div key={game.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 mb-3 flex justify-between items-center shadow-md`}>
                <div>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>🏊 {game.player1} fordert dich heraus!</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
                    <span>Quizduell • 6 Runden</span>
                    <span className={`${diff.color} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                      {diff.icon} {diff.label} ({diff.time}s)
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    acceptChallenge(game.id);
                    playSound('whistle');
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-md"
                >
                  Annehmen 🎯
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeGames.filter(g => (g.player1 === user.name || g.player2 === user.name) && g.status === 'active').length > 0 && (
        <div className={`${darkMode ? 'bg-cyan-900/80' : 'bg-cyan-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-cyan-700' : 'border-cyan-400'} rounded-xl p-6 shadow-lg`}>
          <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>
            <Trophy className="mr-2" />
            🏊 Laufende Spiele
          </h3>
          {activeGames.filter(g => (g.player1 === user.name || g.player2 === user.name) && g.status === 'active').map(game => {
            const diff = DIFFICULTY_SETTINGS[game.difficulty];
            return (
              <div key={game.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 mb-3 flex justify-between items-center shadow-md`}>
                <div>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>⚔️ {game.player1} vs {game.player2}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
                    <span>Runde {game.round + 1}/6 • {game.player1Score}:{game.player2Score}</span>
                    <span className={`${diff.color} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                      {diff.icon} {diff.label}
                    </span>
                    {game.currentTurn === user.name && ' • Du bist dran! ⚡'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    continueGame(game.id);
                    playSound('whistle');
                  }}
                  className={`px-6 py-2 rounded-lg font-bold shadow-md ${
                    game.currentTurn === user.name
                      ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse'
                      : darkMode
                        ? 'bg-slate-600 text-gray-300'
                        : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {game.currentTurn === user.name ? 'Weiterspielen ⚡' : 'Anschauen'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* News Section */}
      {news.length > 0 && (
        <div className={`${darkMode ? 'bg-red-900/80' : 'bg-red-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-red-700' : 'border-red-400'} rounded-xl p-6 shadow-lg`}>
          <h3 className={`text-xl font-bold mb-4 flex items-center justify-between ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
            <span className="flex items-center">
              <Bell className="mr-2" />
              📢 Aktuelle News
            </span>
            <button
              onClick={() => {
                setCurrentView('news');
                playSound('splash');
              }}
              className={`text-sm ${darkMode ? 'text-red-300 hover:text-red-100' : 'text-red-600 hover:text-red-800'} underline`}
            >
              Alle anzeigen →
            </button>
          </h3>
          <div className="space-y-3">
            {news.slice(0, 3).map(item => (
              <div key={item.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-md border-l-4 border-red-500`}>
                <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</h4>
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>{item.content}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Von {item.author} • {new Date(item.time).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exams Section */}
      {exams.length > 0 && (
        <div className={`${darkMode ? 'bg-green-900/80' : 'bg-green-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-green-700' : 'border-green-400'} rounded-xl p-6 shadow-lg`}>
          <h3 className={`text-xl font-bold mb-4 flex items-center justify-between ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
            <span className="flex items-center">
              <Calendar className="mr-2" />
              📋 Anstehende Klausuren
            </span>
            <button
              onClick={() => {
                setCurrentView('exams');
                playSound('splash');
              }}
              className={`text-sm ${darkMode ? 'text-green-300 hover:text-green-100' : 'text-green-600 hover:text-green-800'} underline`}
            >
              Alle anzeigen →
            </button>
          </h3>
          <div className="space-y-3">
            {exams.slice(0, 3).map(exam => {
              const examDate = new Date(exam.date);
              const today = new Date();
              const daysUntil = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
              const isUrgent = daysUntil <= 7 && daysUntil >= 0;

              return (
                <div key={exam.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-md border-l-4 ${
                  isUrgent ? 'border-orange-500' : 'border-green-500'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{exam.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isUrgent
                        ? 'bg-orange-500 text-white animate-pulse'
                        : darkMode ? 'bg-green-700 text-green-200' : 'bg-green-100 text-green-800'
                    }`}>
                      {daysUntil > 0 ? `in ${daysUntil} Tagen` : daysUntil === 0 ? 'Heute!' : 'Vorbei'}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-1`}>{exam.topics}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {examDate.toLocaleDateString()} • {exam.user}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-4">
        <div className={`${darkMode ? 'bg-slate-800/95 border-cyan-600' : 'bg-white/95 border-cyan-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-cyan-400`}
         onClick={() => {
               setCurrentView('exam-simulator');
               setExamSimulatorMode('theory');
               playSound('splash');
             }}>
          <div className="text-5xl mb-3 text-center">📝</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>Prüfungssimulator</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Theorie & Praxis üben</p>
        </div>

        <div className={`${darkMode ? 'bg-slate-800/95 border-purple-600' : 'bg-white/95 border-purple-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-400`}
             onClick={() => {
               setCurrentView('flashcards');
               loadFlashcards();
               playSound('splash');
             }}>
          <div className="text-5xl mb-3 text-center">🎴</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>Karteikarten</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Klassisch lernen</p>
        </div>

        <div className={`${darkMode ? 'bg-slate-800/95 border-blue-600' : 'bg-white/95 border-blue-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-400`}
             onClick={() => {
               setCurrentView('calculator');
               playSound('splash');
             }}>
          <div className="text-5xl mb-3 text-center">🧮</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Praxis-Rechner</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Mit Lösungsweg</p>
        </div>

        <div className={`${darkMode ? 'bg-slate-800/95 border-green-600' : 'bg-white/95 border-green-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-400`}
             onClick={() => {
               setCurrentView('quiz');
               playSound('splash');
             }}>
          <div className="text-5xl mb-3 text-center">🎮</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Quizduell</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fordere andere heraus!</p>
        </div>

        <div className={`${darkMode ? 'bg-slate-800/95 border-cyan-600' : 'bg-white/95 border-cyan-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-cyan-400`}
             onClick={() => {
               setCurrentView('swim-challenge');
               playSound('splash');
             }}>
          <div className="text-5xl mb-3 text-center">🏊</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>Schwimm-Challenge</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Azubis vs. Trainer!</p>
        </div>

        <div className={`${darkMode ? 'bg-slate-800/95 border-yellow-600' : 'bg-white/95 border-yellow-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-yellow-400`}
             onClick={() => {
               setCurrentView('stats');
               playSound('splash');
             }}>
          <div className="text-5xl mb-3 text-center">🏅</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>Statistiken</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Badges & Ranking</p>
        </div>

        {user.permissions.canViewAllStats && (
          <div className={`${darkMode ? 'bg-slate-800/95 border-indigo-600' : 'bg-white/95 border-indigo-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-indigo-400`}
               onClick={() => {
                 setCurrentView('trainer-dashboard');
                 playSound('splash');
               }}>
            <div className="text-5xl mb-3 text-center">👨‍🏫</div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Azubi-Übersicht</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fortschritte sehen</p>
          </div>
        )}

        <div className={`${darkMode ? 'bg-slate-800/95 border-green-600' : 'bg-white/95 border-green-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-400`}
             onClick={() => {
               setCurrentView('materials');
               playSound('splash');
             }}>
          <div className="text-5xl mb-3 text-center">📚</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Lernmaterialien</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{materials.length} Materialien</p>
        </div>

        <div className={`${darkMode ? 'bg-slate-800/95 border-indigo-600' : 'bg-white/95 border-indigo-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-indigo-400`}
             onClick={() => {
               setCurrentView('resources');
               playSound('splash');
             }}>
          <div className="text-5xl mb-3 text-center">🔗</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Ressourcen</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{resources.length} Links</p>
        </div>

        <div className={`${darkMode ? 'bg-slate-800/95 border-pink-600' : 'bg-white/95 border-pink-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-pink-400`}
             onClick={() => {
               setCurrentView('chat');
               playSound('splash');
             }}>
          <div className="text-5xl mb-3 text-center">💬</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-pink-400' : 'text-pink-700'}`}>Team-Chat</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{messages.length} Nachrichten</p>
        </div>

        {/* Berichtsheft */}
        <div className={`${darkMode ? 'bg-slate-800/95 border-teal-600' : 'bg-white/95 border-teal-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-teal-400`}
             onClick={() => {
               setCurrentView('berichtsheft');
               playSound('splash');
             }}>
          <div className="text-5xl mb-3 text-center">📖</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>Berichtsheft</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Ausbildungsnachweis</p>
        </div>

        {/* Kontrollkarte Berufsschule */}
        <div className={`${darkMode ? 'bg-slate-800/95 border-orange-600' : 'bg-white/95 border-orange-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-orange-400`}
             onClick={() => {
               setCurrentView('school-card');
               playSound('splash');
             }}>
          <div className="text-5xl mb-3 text-center">🎓</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>Kontrollkarte</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Berufsschule</p>
        </div>

        {/* Fragen einreichen */}
        <div className={`${darkMode ? 'bg-slate-800/95 border-amber-600' : 'bg-white/95 border-amber-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-amber-400`}
             onClick={() => {
               setCurrentView('questions');
               playSound('splash');
             }}>
          <div className="text-5xl mb-3 text-center">💡</div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>Fragen</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Einreichen & lernen</p>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
