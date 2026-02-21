import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const SwimChallengeView = (props) => {
const {
  SWIM_ARENA_DISCIPLINES,
  SWIM_BATTLE_WIN_POINTS,
  SWIM_CHALLENGES,
  SWIM_TRAINING_PLANS,
  SWIM_STYLES,
  activeSwimChallenges,
  allUsers,
  calculateChallengeProgress,
  calculateSwimPoints,
  calculateTeamBattleStats,
  confirmSwimSession,
  getAgeHandicap,
  getSeaCreatureTier,
  getSwimLevel,
  getUserNameById,
  handleSwimBossBattleSubmit,
  handleSwimDuelSubmit,
  pendingSwimConfirmations,
  rejectSwimSession,
  saveActiveSwimChallenges,
  saveSwimSession,
  setCurrentView,
  setSwimArenaMode,
  setSwimBossForm,
  setSwimChallengeFilter,
  setSwimChallengeView,
  setSwimDuelForm,
  setSwimSessionForm,
  statsByUserId,
  swimArenaMode,
  swimBattleHistory,
  swimBattleResult,
  swimBattleWinsByUserId,
  swimBossForm,
  swimChallengeFilter,
  swimChallengeView,
  swimDuelForm,
  swimSessionForm,
  swimSessions,
  toSafeInt,
} = props;
  const { user } = useAuth();
  const { darkMode } = useApp();

  const TRAINING_CATEGORY_META = {
    ausdauer: { label: 'Ausdauer', icon: '🌊' },
    sprint: { label: 'Sprint', icon: '⚡' },
    technik: { label: 'Technik', icon: '🎯' },
    kombi: { label: 'Kombi', icon: '🔗' }
  };

  const TRAINING_DIFFICULTY_META = {
    angenehm: { label: 'Angenehm', badge: darkMode ? 'bg-emerald-900/60 text-emerald-300' : 'bg-emerald-100 text-emerald-700' },
    fokussiert: { label: 'Fokussiert', badge: darkMode ? 'bg-amber-900/60 text-amber-300' : 'bg-amber-100 text-amber-700' },
    anspruchsvoll: { label: 'Anspruchsvoll', badge: darkMode ? 'bg-rose-900/60 text-rose-300' : 'bg-rose-100 text-rose-700' }
  };

  const SWIM_PLAN_NOTE_TAG_REGEX = /\[SWIM_PLAN:([a-z0-9_-]+)\]/i;
  const extractTrainingPlanIdFromNotes = (notesInput) => {
    const notes = String(notesInput || '');
    const match = notes.match(SWIM_PLAN_NOTE_TAG_REGEX);
    return match?.[1] || null;
  };
  const stripTrainingPlanTagFromNotes = (notesInput) => String(notesInput || '')
    .replace(/\s*\[SWIM_PLAN:[^\]]+\]\s*/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const getTrainingPlanById = (planId) => SWIM_TRAINING_PLANS.find(plan => plan.id === planId) || null;
  const selectedTrainingPlan = getTrainingPlanById(swimSessionForm.trainingPlanId);

  const isPlanFulfilledByForm = (planInput) => {
    if (!planInput) return false;
    const distance = Number(swimSessionForm.distance || 0);
    const timeMinutes = Number(swimSessionForm.time || 0);
    const styleId = String(swimSessionForm.style || '');
    if (!Number.isFinite(distance) || !Number.isFinite(timeMinutes) || distance <= 0 || timeMinutes <= 0) {
      return false;
    }
    const styleMatches = !planInput.styleId || planInput.styleId === styleId;
    return styleMatches && distance >= planInput.targetDistance && timeMinutes <= planInput.targetTime;
  };

  return (
          <div className="space-y-6">
            {/* Header mit Team-Battle */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-600'} text-white rounded-xl p-6 shadow-lg`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    🏊 Schwimm-Challenge
                  </h2>
                  <p className="opacity-90 mt-1">Trainiere, sammle Punkte und miss dich mit anderen!</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['overview', 'challenges', 'plans', 'add', 'leaderboard', 'battle'].map(view => (
                    <button
                      key={view}
                      onClick={() => setSwimChallengeView(view)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${swimChallengeView === view ? 'bg-white text-cyan-600' : 'bg-white/20 hover:bg-white/30'}`}
                    >
                      {view === 'overview' && '📊 Übersicht'}
                      {view === 'challenges' && '🎯 Challenges'}
                      {view === 'plans' && 'Trainingsplaene'}
                      {view === 'add' && '➕ Einheit'}
                      {view === 'leaderboard' && '🏆 Bestenliste'}
                      {view === 'battle' && '⚔️ Team-Battle'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Team-Battle Banner */}
            {(() => {
              const xpByUserId = Object.fromEntries(
                Object.entries(statsByUserId).map(([userId, stats]) => [userId, stats?.totalXp || 0])
              );
              Object.entries(swimBattleWinsByUserId || {}).forEach(([userId, wins]) => {
                const bonusPoints = toSafeInt(wins) * SWIM_BATTLE_WIN_POINTS;
                if (bonusPoints <= 0) return;
                xpByUserId[userId] = (xpByUserId[userId] || 0) + bonusPoints;
              });
              const battleStats = calculateTeamBattleStats(swimSessions, xpByUserId, allUsers);
              const currentMonth = new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }).toUpperCase();
              const leading = battleStats.azubis.points > battleStats.trainer.points ? 'azubis' : battleStats.trainer.points > battleStats.azubis.points ? 'trainer' : 'tie';

              return (
                <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                  <div className="text-center mb-4">
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ⚔️ TEAM-BATTLE: {currentMonth}
                    </h3>
                    {leading !== 'tie' && (
                      <p className={`text-sm mt-1 ${leading === 'azubis' ? (darkMode ? 'text-cyan-400' : 'text-cyan-600') : (darkMode ? 'text-orange-400' : 'text-orange-600')}`}>
                        {leading === 'azubis' ? '👨‍🎓 Azubis führen!' : '👨‍🏫 Trainer führen!'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-center flex-1">
                      <div className="text-3xl mb-1">👨‍🎓</div>
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Team Azubis</div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{battleStats.azubis.points} Pkt</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Swim {battleStats.azubis.swimPoints} + XP/Arena {battleStats.azubis.xpPoints}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {battleStats.azubis.memberList.length} Teilnehmer
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-gray-400">VS</div>
                    <div className="text-center flex-1">
                      <div className="text-3xl mb-1">👨‍🏫</div>
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Team Trainer</div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{battleStats.trainer.points} Pkt</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Swim {battleStats.trainer.swimPoints} + XP/Arena {battleStats.trainer.xpPoints}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {battleStats.trainer.memberList.length} Teilnehmer
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
                      <div className="bg-cyan-500 transition-all" style={{ width: `${battleStats.azubis.percent}%` }}></div>
                      <div className="bg-orange-500 transition-all" style={{ width: `${battleStats.trainer.percent}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>{battleStats.azubis.percent.toFixed(0)}%</span>
                      <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>{battleStats.trainer.percent.toFixed(0)}%</span>
                    </div>
                  </div>
                  {/* Distanz-Vergleich */}
                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} grid grid-cols-2 gap-4 text-center text-sm`}>
                    <div>
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Gesamtdistanz</div>
                      <div className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{(battleStats.azubis.distance / 1000).toFixed(1)} km</div>
                    </div>
                    <div>
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Gesamtdistanz</div>
                      <div className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{(battleStats.trainer.distance / 1000).toFixed(1)} km</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Übersicht */}
            {swimChallengeView === 'overview' && (() => {
              const mySessions = swimSessions.filter(s => s.user_id === user?.id && s.confirmed);
              const totalDistance = mySessions.reduce((sum, s) => sum + (s.distance || 0), 0);
              const totalTime = mySessions.reduce((sum, s) => sum + (s.time_minutes || 0), 0);
              const completedChallenges = SWIM_CHALLENGES.filter(ch => {
                const progress = calculateChallengeProgress(ch, swimSessions, user?.id);
                return progress.percent >= 100;
              });
              const points = calculateSwimPoints(mySessions, completedChallenges.map(c => c.id));

              return (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">🏊</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        {totalDistance >= 1000 ? `${(totalDistance / 1000).toFixed(1)} km` : `${totalDistance} m`}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gesamtdistanz</p>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">⏱️</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        {totalTime >= 60 ? `${Math.floor(totalTime / 60)}h ${totalTime % 60}m` : `${totalTime} min`}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Trainingszeit</p>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">🎯</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{completedChallenges.length}</span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Challenges abgeschlossen</p>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">⭐</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{points.total}</span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Punkte</p>
                  </div>
                </div>
              );
            })()}

            {/* Level-Anzeige */}
            {swimChallengeView === 'overview' && (() => {
              const mySessions = swimSessions.filter(s => s.user_id === user?.id && s.confirmed);
              const completedChallenges = SWIM_CHALLENGES.filter(ch => {
                const progress = calculateChallengeProgress(ch, swimSessions, user?.id);
                return progress.percent >= 100;
              });
              const points = calculateSwimPoints(mySessions, completedChallenges.map(c => c.id));
              const currentLevel = getSwimLevel(points.total);
              const progressPercent = currentLevel.nextLevel
                ? ((points.total - currentLevel.minPoints) / (currentLevel.nextLevel.minPoints - currentLevel.minPoints)) * 100
                : 100;

              return (
                <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dein Level</h3>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentLevel.color} flex items-center justify-center text-3xl`}>
                      {currentLevel.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {currentLevel.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {currentLevel.nextLevel
                          ? `${points.total} / ${currentLevel.nextLevel.minPoints} Punkte bis ${currentLevel.nextLevel.name}`
                          : `${points.total} Punkte - Maximales Level erreicht! 🎉`
                        }
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${currentLevel.color} transition-all`} style={{ width: `${Math.min(100, progressPercent)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Punkte-Aufschlüsselung */}
                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="flex justify-between">
                        <span>Distanz-Punkte (1 Pkt/100m):</span>
                        <span className="font-medium">{points.distancePoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zeit-Punkte (0.5 Pkt/Min):</span>
                        <span className="font-medium">{points.timePoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Challenge-Punkte:</span>
                        <span className="font-medium">{points.challengePoints}</span>
                      </div>
                    </div>
                  </div>
                  {/* Handicap-Info */}
                  {user?.birthDate && getAgeHandicap(user.birthDate) > 0 && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                      <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        <span>🎂</span>
                        <span>Alters-Handicap aktiv: <strong>{Math.round(getAgeHandicap(user.birthDate) * 100)}% Zeitbonus</strong> bei Sprint-Challenges</span>
                      </div>
                    </div>
                  )}
                  {!user?.birthDate && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                      <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span>💡</span>
                        <span>Tipp: Trage dein <button onClick={() => setCurrentView('profile')} className="underline text-cyan-500 hover:text-cyan-400">Geburtsdatum im Profil</button> ein für Alters-Handicap bei Sprint-Challenges (ab 40 Jahren).</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Challenges Liste */}
            {swimChallengeView === 'challenges' && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap mb-4">
                  {['alle', 'distanz', 'sprint', 'ausdauer', 'regelmaessigkeit', 'technik'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSwimChallengeFilter(cat)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        swimChallengeFilter === cat
                          ? 'bg-cyan-500 text-white'
                          : (darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                      }`}
                    >
                      {cat === 'alle' && '🎯 Alle'}
                      {cat === 'distanz' && '🌊 Distanz'}
                      {cat === 'sprint' && '⚡ Sprint'}
                      {cat === 'ausdauer' && '💪 Ausdauer'}
                      {cat === 'regelmaessigkeit' && '📅 Regelmäßigkeit'}
                      {cat === 'technik' && '🏊 Technik'}
                    </button>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {SWIM_CHALLENGES.filter(c => swimChallengeFilter === 'alle' || c.category === swimChallengeFilter).map(challenge => {
                    const progress = calculateChallengeProgress(challenge, swimSessions, user?.id);
                    const isCompleted = progress.percent >= 100;

                    return (
                      <div key={challenge.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 shadow-lg ${isCompleted ? 'ring-2 ring-green-500' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{challenge.icon}</span>
                            <div>
                              <h4 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {challenge.name}
                                {isCompleted && <span className="text-green-500">✓</span>}
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{challenge.description}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            isCompleted
                              ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700')
                              : (darkMode ? 'bg-cyan-900 text-cyan-300' : 'bg-cyan-100 text-cyan-700')
                          }`}>
                            {isCompleted ? '✓ ' : '+'}{challenge.points} Pkt
                          </span>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fortschritt</span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {challenge.type === 'distance' || challenge.type === 'single_distance'
                                ? `${(progress.current / 1000).toFixed(1)} / ${(challenge.target / 1000).toFixed(1)} km`
                                : `${progress.current} / ${challenge.target} ${challenge.unit}`
                              }
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-cyan-500'}`}
                              style={{ width: `${Math.min(100, progress.percent)}%` }}
                            ></div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (!activeSwimChallenges.includes(challenge.id)) {
                              saveActiveSwimChallenges([...activeSwimChallenges, challenge.id]);
                            }
                          }}
                          disabled={activeSwimChallenges.includes(challenge.id) || isCompleted}
                          className={`mt-4 w-full py-2 rounded-lg font-medium transition-all ${
                            isCompleted
                              ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700')
                              : activeSwimChallenges.includes(challenge.id)
                                ? (darkMode ? 'bg-cyan-900 text-cyan-300' : 'bg-cyan-100 text-cyan-700')
                                : (darkMode ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white')
                          }`}
                        >
                          {isCompleted ? '🏆 Abgeschlossen!' : activeSwimChallenges.includes(challenge.id) ? '✓ Aktiv' : 'Challenge starten'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {swimChallengeView === 'plans' && (
              <div className="space-y-4">
                <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 shadow-lg`}>
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    📋 Schwimm-Trainingsplaene
                  </h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ausdauer, Sprint, Technik und Kombi. Von angenehm bis anspruchsvoll. Bei erfuelltem Plan gibt es XP nach Trainer-Bestaetigung.
                  </p>
                </div>

                {['ausdauer', 'sprint', 'technik', 'kombi'].map((categoryId) => {
                  const categoryPlans = SWIM_TRAINING_PLANS.filter(plan => plan.category === categoryId);
                  const categoryMeta = TRAINING_CATEGORY_META[categoryId] || { label: categoryId, icon: '🏊' };

                  return (
                    <div key={categoryId} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 shadow-lg`}>
                      <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {categoryMeta.icon} {categoryMeta.label} ({categoryPlans.length})
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {categoryPlans.map((plan) => {
                          const difficultyMeta = TRAINING_DIFFICULTY_META[plan.difficulty] || TRAINING_DIFFICULTY_META.fokussiert;
                          const styleName = SWIM_STYLES.find(style => style.id === plan.styleId)?.name || 'beliebig';
                          return (
                            <div key={plan.id} className={`rounded-lg p-4 border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{plan.name}</div>
                                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{plan.description}</div>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${difficultyMeta.badge}`}>
                                  {difficultyMeta.label}
                                </span>
                              </div>
                              <div className={`text-sm mt-3 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                                Ziel: {plan.targetDistance} m in max. {plan.targetTime} Min • Stil: {styleName}
                              </div>
                              <div className={`text-sm mt-1 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                                Belohnung: +{plan.xpReward} XP
                              </div>
                              <button
                                onClick={() => {
                                  setSwimSessionForm(prev => ({
                                    ...prev,
                                    style: plan.styleId || prev.style || 'kraul',
                                    distance: String(plan.targetDistance),
                                    time: String(plan.targetTime),
                                    trainingPlanId: plan.id
                                  }));
                                  setSwimChallengeView('add');
                                }}
                                className={`mt-3 w-full py-2 rounded-lg font-medium ${
                                  darkMode ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                                }`}
                              >
                                Diesen Plan nutzen
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Trainingseinheit eintragen */}
            {swimChallengeView === 'add' && (
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ➕ Neue Trainingseinheit eintragen
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum</label>
                    <input
                      type="date"
                      value={swimSessionForm.date}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, date: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Schwimmstil</label>
                    <select
                      value={swimSessionForm.style}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, style: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      {SWIM_STYLES.map(style => (
                        <option key={style.id} value={style.id}>{style.icon} {style.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Distanz (Meter)</label>
                    <input
                      type="number"
                      value={swimSessionForm.distance}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, distance: e.target.value})}
                      placeholder="z.B. 1000"
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Zeit (Minuten)</label>
                    <input
                      type="number"
                      value={swimSessionForm.time}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, time: e.target.value})}
                      placeholder="z.B. 25"
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Trainingsplan (XP-Bonus)</label>
                    <select
                      value={swimSessionForm.trainingPlanId || ''}
                      onChange={(e) => {
                        const planId = e.target.value;
                        if (!planId) {
                          setSwimSessionForm({
                            ...swimSessionForm,
                            trainingPlanId: ''
                          });
                          return;
                        }
                        const plan = getTrainingPlanById(planId);
                        if (!plan) return;
                        setSwimSessionForm({
                          ...swimSessionForm,
                          trainingPlanId: plan.id,
                          style: plan.styleId || swimSessionForm.style,
                          distance: String(plan.targetDistance),
                          time: String(plan.targetTime)
                        });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="">-- Kein Trainingsplan --</option>
                      {['ausdauer', 'sprint', 'technik', 'kombi'].map((categoryId) => {
                        const categoryMeta = TRAINING_CATEGORY_META[categoryId] || { label: categoryId, icon: 'Plan' };
                        const plans = SWIM_TRAINING_PLANS.filter(plan => plan.category === categoryId);
                        if (plans.length === 0) return null;
                        return (
                          <optgroup key={categoryId} label={`${categoryMeta.icon} ${categoryMeta.label}`}>
                            {plans.map(plan => {
                              const difficulty = TRAINING_DIFFICULTY_META[plan.difficulty]?.label || plan.difficulty;
                              return (
                                <option key={plan.id} value={plan.id}>
                                  {plan.name} - {difficulty} (+{plan.xpReward} XP)
                                </option>
                              );
                            })}
                          </optgroup>
                        );
                      })}
                    </select>
                  </div>
                  {selectedTrainingPlan && (
                    <div className="md:col-span-2">
                      <div className={`rounded-lg p-3 border ${
                        isPlanFulfilledByForm(selectedTrainingPlan)
                          ? (darkMode ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-700')
                          : (darkMode ? 'bg-slate-700 border-slate-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-700')
                      }`}>
                        <div className="font-semibold">Plan: {selectedTrainingPlan.name} | +{selectedTrainingPlan.xpReward} XP</div>
                        <div className="text-sm mt-1">
                          Ziel: {selectedTrainingPlan.targetDistance} m in max. {selectedTrainingPlan.targetTime} Min | Stil: {SWIM_STYLES.find(style => style.id === selectedTrainingPlan.styleId)?.name || 'beliebig'}
                        </div>
                        <div className="text-sm mt-1">
                          {isPlanFulfilledByForm(selectedTrainingPlan)
                            ? 'Plan mit aktueller Eingabe erfuellt (XP nach Bestaetigung).'
                            : 'Distanz/Zeit/Stil auf Planziel einstellen, um XP zu erhalten.'}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Für Challenge (optional)</label>
                    <select
                      value={swimSessionForm.challengeId}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, challengeId: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="">-- Keine Challenge --</option>
                      {activeSwimChallenges.map(id => {
                        const ch = SWIM_CHALLENGES.find(c => c.id === id);
                        return ch ? <option key={id} value={id}>{ch.icon} {ch.name}</option> : null;
                      })}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notizen</label>
                    <textarea
                      value={swimSessionForm.notes}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, notes: e.target.value})}
                      placeholder="Wie lief das Training?"
                      rows={2}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
                <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-300'}`}>
                  <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    ⚠️ Die Einheit muss von einem Trainer/Ausbilder bestätigt werden, bevor Punkte und Trainingsplan-XP gutgeschrieben werden.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (swimSessionForm.distance && swimSessionForm.time) {
                      const result = await saveSwimSession(swimSessionForm);
                      if (result.success) {
                        setSwimSessionForm({
                          date: new Date().toISOString().split('T')[0],
                          distance: '',
                          time: '',
                          style: 'kraul',
                          notes: '',
                          challengeId: '',
                          trainingPlanId: ''
                        });
                        alert('Trainingseinheit eingereicht! Warte auf Bestätigung durch einen Trainer.');
                      } else {
                        alert('Fehler beim Speichern: ' + result.error);
                      }
                    }
                  }}
                  disabled={!swimSessionForm.distance || !swimSessionForm.time}
                  className={`mt-4 w-full py-3 rounded-lg font-bold transition-all ${
                    swimSessionForm.distance && swimSessionForm.time
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                      : (darkMode ? 'bg-slate-700 text-gray-500' : 'bg-gray-200 text-gray-400')
                  }`}
                >
                  📤 Einheit zur Bestätigung einreichen
                </button>
              </div>
            )}

            {/* Bestenliste */}
            {swimChallengeView === 'leaderboard' && (() => {
              // Aggregiere bestätigte Sessions pro Benutzer
              const confirmedSessions = swimSessions.filter(s => s.confirmed);
              const userStats = {};

              confirmedSessions.forEach(session => {
                const userId = session.user_id;
                if (!userStats[userId]) {
                  userStats[userId] = {
                    user_id: session.user_id,
                    user_name: session.user_name,
                    user_role: session.user_role,
                    total_distance: 0,
                    total_time: 0,
                    session_count: 0,
                    styles: new Set()
                  };
                }
                userStats[userId].total_distance += session.distance || 0;
                userStats[userId].total_time += session.time_minutes || 0;
                userStats[userId].session_count += 1;
                userStats[userId].styles.add(session.style);
              });

              // Sortiere nach Gesamtdistanz
              const leaderboard = Object.values(userStats)
                .sort((a, b) => b.total_distance - a.total_distance);

              const formatMinutes = (minutesInput) => {
                const minutes = Math.max(0, Number(minutesInput) || 0);
                if (minutes >= 60) {
                  return `${Math.floor(minutes / 60)}h ${Math.round(minutes % 60)}min`;
                }
                return `${Math.round(minutes)} min`;
              };

              const challengeTimeLeaderboards = SWIM_CHALLENGES
                .map((challenge) => {
                  const challengeSessions = confirmedSessions.filter(session =>
                    session.challenge_id === challenge.id
                    && Number(session.time_minutes || 0) > 0
                    && Number(session.distance || 0) > 0
                  );

                  if (challengeSessions.length === 0) {
                    return null;
                  }

                  const bestByUser = {};
                  challengeSessions.forEach((session) => {
                    const userId = session.user_id;
                    const timeMinutes = Number(session.time_minutes || 0);
                    const distance = Number(session.distance || 0);
                    if (!userId || timeMinutes <= 0 || distance <= 0) return;

                    const paceSecondsPer100 = (timeMinutes * 60) / (distance / 100);
                    if (!Number.isFinite(paceSecondsPer100) || paceSecondsPer100 <= 0) return;

                    const existing = bestByUser[userId];
                    if (
                      !existing
                      || paceSecondsPer100 < existing.paceSecondsPer100
                      || (paceSecondsPer100 === existing.paceSecondsPer100 && timeMinutes < existing.timeMinutes)
                    ) {
                      bestByUser[userId] = {
                        userId,
                        userName: session.user_name || 'Unbekannt',
                        timeMinutes,
                        distance,
                        paceSecondsPer100,
                        date: session.date
                      };
                    }
                  });

                  const ranking = Object.values(bestByUser)
                    .sort((a, b) => a.paceSecondsPer100 - b.paceSecondsPer100)
                    .slice(0, 5);

                  if (ranking.length === 0) {
                    return null;
                  }

                  return {
                    challenge,
                    ranking
                  };
                })
                .filter(Boolean);

              return (
                <div className="space-y-4">
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      🏆 Bestenliste - Gesamtdistanz
                    </h3>

                    {leaderboard.length === 0 ? (
                      <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="text-5xl mb-4 block">🏊</span>
                        <p>Noch keine bestätigten Einträge vorhanden.</p>
                        <p className="text-sm mt-2">Trage deine erste Trainingseinheit ein!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.map((entry, index) => {
                          const medals = ['🥇', '🥈', '🥉'];
                          const medal = medals[index] || `${index + 1}.`;
                          const isCurrentUser = entry.user_id === user?.id;
                          const avgPace = entry.total_time > 0
                            ? ((entry.total_time / (entry.total_distance / 100))).toFixed(1)
                            : 0;

                          return (
                            <div
                              key={entry.user_id}
                              className={`p-4 rounded-lg flex items-center gap-4 transition-all ${
                                isCurrentUser
                                  ? (darkMode ? 'bg-cyan-900/50 border-2 border-cyan-500' : 'bg-cyan-50 border-2 border-cyan-400')
                                  : (darkMode ? 'bg-slate-700' : 'bg-gray-50')
                              }`}
                            >
                              <div className="text-3xl w-12 text-center">
                                {medal}
                              </div>
                              <div className="flex-1">
                                <div className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  {entry.user_name}
                                  {isCurrentUser && <span className="text-xs bg-cyan-500 text-white px-2 py-0.5 rounded-full">Du</span>}
                                  <span className="text-sm font-normal opacity-70">
                                    {entry.user_role === 'azubi' ? '👨‍🎓' : '👨‍🏫'}
                                  </span>
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {entry.session_count} Einheiten • ⌀ {avgPace} Min/100m
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                  {(entry.total_distance / 1000).toFixed(1)} km
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {Math.floor(entry.total_time / 60)}h {entry.total_time % 60}min
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ⏱️ Schnellste Zeiten pro Challenge
                    </h3>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Gewertet werden bestätigte Challenge-Einheiten nach bester Pace (Sekunden pro 100m).
                    </p>

                    {challengeTimeLeaderboards.length === 0 ? (
                      <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <p>Noch keine bestätigten Challenge-Zeiten vorhanden.</p>
                        <p className="text-sm mt-1">Trage Einheiten mit Challenge-Zuordnung ein.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {challengeTimeLeaderboards.map(({ challenge, ranking }) => (
                          <div
                            key={challenge.id}
                            className={`rounded-lg p-4 border ${
                              darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {challenge.icon} {challenge.name}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Top {ranking.length}
                              </div>
                            </div>
                            <div className="space-y-2">
                              {ranking.map((entry, index) => {
                                const medals = ['🥇', '🥈', '🥉'];
                                const medal = medals[index] || `${index + 1}.`;
                                const isCurrentUser = entry.userId === user?.id;
                                return (
                                  <div
                                    key={`${challenge.id}-${entry.userId}`}
                                    className={`flex items-center gap-3 p-2 rounded-lg ${
                                      isCurrentUser
                                        ? (darkMode ? 'bg-cyan-900/40 border border-cyan-700' : 'bg-cyan-50 border border-cyan-200')
                                        : ''
                                    }`}
                                  >
                                    <span className="w-8 text-center text-lg">{medal}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {entry.userName}
                                        {isCurrentUser && <span className="ml-1 text-xs opacity-70">(Du)</span>}
                                      </div>
                                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {entry.distance}m in {formatMinutes(entry.timeMinutes)} • {entry.paceSecondsPer100.toFixed(1)} s/100m
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Top 3 Podium für > 3 Teilnehmer */}
                  {leaderboard.length >= 3 && (
                    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                      <h3 className={`font-bold text-lg mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        🏅 Podium
                      </h3>
                      <div className="flex items-end justify-center gap-4">
                        {/* Platz 2 */}
                        <div className="text-center">
                          <div className="text-4xl mb-2">🥈</div>
                          <div className={`w-24 h-20 ${darkMode ? 'bg-gray-500' : 'bg-gray-300'} rounded-t-lg flex items-center justify-center`}>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                              {(leaderboard[1].total_distance / 1000).toFixed(1)} km
                            </span>
                          </div>
                          <div className={`text-sm font-medium mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {leaderboard[1].user_name.split(' ')[0]}
                          </div>
                        </div>
                        {/* Platz 1 */}
                        <div className="text-center">
                          <div className="text-5xl mb-2">🥇</div>
                          <div className={`w-24 h-28 bg-gradient-to-b ${darkMode ? 'from-yellow-500 to-yellow-700' : 'from-yellow-400 to-yellow-500'} rounded-t-lg flex items-center justify-center`}>
                            <span className="font-bold text-white">
                              {(leaderboard[0].total_distance / 1000).toFixed(1)} km
                            </span>
                          </div>
                          <div className={`text-sm font-medium mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {leaderboard[0].user_name.split(' ')[0]}
                          </div>
                        </div>
                        {/* Platz 3 */}
                        <div className="text-center">
                          <div className="text-4xl mb-2">🥉</div>
                          <div className={`w-24 h-16 ${darkMode ? 'bg-orange-700' : 'bg-orange-400'} rounded-t-lg flex items-center justify-center`}>
                            <span className="font-bold text-white">
                              {(leaderboard[2].total_distance / 1000).toFixed(1)} km
                            </span>
                          </div>
                          <div className={`text-sm font-medium mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {leaderboard[2].user_name.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Eigene Statistiken */}
                  {(() => {
                    const myStats = userStats[user?.id];
                    if (!myStats) return null;
                    const myRank = leaderboard.findIndex(e => e.user_id === user?.id) + 1;
                    return (
                      <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-600'} text-white rounded-xl p-6 shadow-lg`}>
                        <h3 className="font-bold text-lg mb-4">📊 Deine Statistiken</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold">{myRank}.</div>
                            <div className="text-sm opacity-80">Platzierung</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{(myStats.total_distance / 1000).toFixed(1)}</div>
                            <div className="text-sm opacity-80">Kilometer</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{myStats.session_count}</div>
                            <div className="text-sm opacity-80">Einheiten</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{Math.floor(myStats.total_time / 60)}h</div>
                            <div className="text-sm opacity-80">Trainingszeit</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}

            {/* Team-Battle Detail */}
            {swimChallengeView === 'battle' && (() => {
              const xpByUserId = Object.fromEntries(
                Object.entries(statsByUserId).map(([userId, stats]) => [userId, stats?.totalXp || 0])
              );
              Object.entries(swimBattleWinsByUserId || {}).forEach(([userId, wins]) => {
                const bonusPoints = toSafeInt(wins) * SWIM_BATTLE_WIN_POINTS;
                if (bonusPoints <= 0) return;
                xpByUserId[userId] = (xpByUserId[userId] || 0) + bonusPoints;
              });
              const battleStats = calculateTeamBattleStats(swimSessions, xpByUserId, allUsers);

              const renderTeamMember = (member, index, color) => {
                const medals = ['🥇', '🥈', '🥉'];
                const medal = medals[index] || `${index + 1}.`;
                const isCurrentUser = member.user_id === user?.id;

                return (
                  <div
                    key={member.user_id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      isCurrentUser
                        ? (darkMode ? `bg-${color}-900/50 border border-${color}-500` : `bg-${color}-100 border border-${color}-300`)
                        : ''
                    }`}
                  >
                    <span className="text-xl w-8">{medal}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {member.user_name}
                        {isCurrentUser && <span className="ml-1 text-xs opacity-70">(Du)</span>}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {member.sessions} Einheiten • {(member.distance / 1000).toFixed(1)} km • Swim {member.swimPoints || 0} + XP/Arena {member.xp || 0}
                      </div>
                    </div>
                    <div className={`font-bold ${color === 'cyan' ? (darkMode ? 'text-cyan-400' : 'text-cyan-600') : (darkMode ? 'text-orange-400' : 'text-orange-600')}`}>
                      {member.points} Pkt
                    </div>
                  </div>
                );
              };

              const duelCandidates = allUsers.filter(u => Boolean(u?.id));
              const trainerCandidates = allUsers.filter(u =>
                u?.role === 'trainer'
                || u?.role === 'ausbilder'
                || u?.role === 'admin'
                || Boolean(u?.permissions?.canViewAllStats)
              );
              const azubiCandidates = allUsers.filter(u => u?.role === 'azubi');
              const arenaLeaderboard = allUsers
                .filter(u => Boolean(u?.id))
                .map((account) => {
                  const wins = toSafeInt(swimBattleWinsByUserId?.[account.id]);
                  return {
                    userId: account.id,
                    name: account.name || 'Unbekannt',
                    role: account.role || 'azubi',
                    wins,
                    creature: getSeaCreatureTier(wins)
                  };
                })
                .sort((a, b) => b.wins - a.wins)
                .slice(0, 10);
              const recentArenaHistory = Array.isArray(swimBattleHistory)
                ? swimBattleHistory.slice(0, 8)
                : [];

              return (
                <div className="space-y-4">
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                      <div>
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          🏟️ Swim-Arena
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          1v1-Duelle oder Team Boss-Battle mit Meereswesen-Rangsystem
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSwimArenaMode('duel')}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            swimArenaMode === 'duel'
                              ? 'bg-cyan-500 text-white'
                              : (darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                          }`}
                        >
                          🤝 1v1 Duel
                        </button>
                        <button
                          onClick={() => setSwimArenaMode('boss')}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            swimArenaMode === 'boss'
                              ? 'bg-orange-500 text-white'
                              : (darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                          }`}
                        >
                          👨‍🏫 Boss-Battle
                        </button>
                      </div>
                    </div>

                    {swimArenaMode === 'duel' && (
                      <form onSubmit={handleSwimDuelSubmit} className="space-y-3">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Disziplin</label>
                            <select
                              value={swimDuelForm.discipline}
                              onChange={(event) => setSwimDuelForm(prev => ({ ...prev, discipline: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              {SWIM_ARENA_DISCIPLINES.map((discipline) => (
                                <option key={discipline.id} value={discipline.id}>{discipline.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Schwimmtechnik</label>
                            <select
                              value={swimDuelForm.style}
                              onChange={(event) => setSwimDuelForm(prev => ({ ...prev, style: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              {SWIM_STYLES.map((style) => (
                                <option key={style.id} value={style.id}>{style.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Teilnehmer A</label>
                            <select
                              value={swimDuelForm.challengerId}
                              onChange={(event) => setSwimDuelForm(prev => ({ ...prev, challengerId: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              <option value="">Bitte wählen</option>
                              {duelCandidates.map((candidate) => (
                                <option key={candidate.id} value={candidate.id}>
                                  {candidate.name} ({candidate.role})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Teilnehmer B</label>
                            <select
                              value={swimDuelForm.opponentId}
                              onChange={(event) => setSwimDuelForm(prev => ({ ...prev, opponentId: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              <option value="">Bitte wählen</option>
                              {duelCandidates.map((candidate) => (
                                <option key={candidate.id} value={candidate.id}>
                                  {candidate.name} ({candidate.role})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Zeit A (Sek.)</label>
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={swimDuelForm.challengerSeconds}
                              onChange={(event) => setSwimDuelForm(prev => ({ ...prev, challengerSeconds: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                              placeholder="z.B. 36.4"
                            />
                          </div>
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Zeit B (Sek.)</label>
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={swimDuelForm.opponentSeconds}
                              onChange={(event) => setSwimDuelForm(prev => ({ ...prev, opponentSeconds: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                              placeholder="z.B. 38.1"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium"
                          >
                            Ergebnis eintragen
                          </button>
                        </div>
                      </form>
                    )}

                    {swimArenaMode === 'boss' && (
                      <form onSubmit={handleSwimBossBattleSubmit} className="space-y-3">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Disziplin</label>
                            <select
                              value={swimBossForm.discipline}
                              onChange={(event) => setSwimBossForm(prev => ({ ...prev, discipline: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              {SWIM_ARENA_DISCIPLINES.map((discipline) => (
                                <option key={discipline.id} value={discipline.id}>{discipline.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Schwimmtechnik</label>
                            <select
                              value={swimBossForm.style}
                              onChange={(event) => setSwimBossForm(prev => ({ ...prev, style: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              {SWIM_STYLES.map((style) => (
                                <option key={style.id} value={style.id}>{style.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbilder</label>
                            <select
                              value={swimBossForm.trainerId}
                              onChange={(event) => setSwimBossForm(prev => ({ ...prev, trainerId: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              <option value="">Bitte wählen</option>
                              {trainerCandidates.map((trainerAccount) => (
                                <option key={trainerAccount.id} value={trainerAccount.id}>
                                  {trainerAccount.name} ({trainerAccount.role})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Azubis gegen den Ausbilder
                          </label>
                          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                            {azubiCandidates.length === 0 && (
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Keine Azubis gefunden.</p>
                            )}
                            {azubiCandidates.map((azubiAccount) => {
                              const checked = swimBossForm.azubiIds.includes(azubiAccount.id);
                              return (
                                <label key={azubiAccount.id} className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(event) => {
                                      const enabled = event.target.checked;
                                      setSwimBossForm((prev) => ({
                                        ...prev,
                                        azubiIds: enabled
                                          ? [...prev.azubiIds, azubiAccount.id]
                                          : prev.azubiIds.filter((id) => id !== azubiAccount.id)
                                      }));
                                    }}
                                  />
                                  <span>{azubiAccount.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Zeit Ausbilder (Sek.)</label>
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={swimBossForm.trainerSeconds}
                              onChange={(event) => setSwimBossForm(prev => ({ ...prev, trainerSeconds: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                              placeholder="z.B. 42.0"
                            />
                          </div>
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Team-Zeit Azubis (Sek.)</label>
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={swimBossForm.azubiSeconds}
                              onChange={(event) => setSwimBossForm(prev => ({ ...prev, azubiSeconds: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                              placeholder="z.B. 39.5"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
                          >
                            Boss-Battle auswerten
                          </button>
                        </div>
                      </form>
                    )}

                    {swimBattleResult && (
                      <div className={`mt-4 p-4 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-cyan-50 border-cyan-200'}`}>
                        <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {swimBattleResult.draw ? '🤝 Unentschieden' : '🏁 Arena-Ergebnis'}
                        </h4>
                        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {swimBattleResult.mode === 'boss' ? 'Boss-Battle' : '1v1 Duel'} • {swimBattleResult.discipline} • {swimBattleResult.styleName}
                        </p>
                        {swimBattleResult.draw ? (
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Beide Seiten haben exakt die gleiche Zeit erreicht.
                          </p>
                        ) : (
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                              <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Sieger</div>
                              <div className="space-y-1">
                                {swimBattleResult.winners.map((winner) => (
                                  <div key={winner.userId} className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-800'}`}>
                                    {winner.name}: {winner.battleCreature.emoji} {winner.battleCreature.name} ({winner.wins} Siege)
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                              <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Verlierer</div>
                              <div className="space-y-1">
                                {swimBattleResult.losers.map((loser) => (
                                  <div key={loser.userId} className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                                    {loser.name}: {loser.battleCreature.emoji} {loser.battleCreature.name} ({loser.wins} Siege)
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-4">
                    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                      <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        🐟 Meereswesen-Rangliste
                      </h4>
                      <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Pro Arena-Sieg gibt es +1 Rang-Sieg und +{SWIM_BATTLE_WIN_POINTS} Team-Battle Punkte.
                      </p>
                      <div className="space-y-2">
                        {arenaLeaderboard.length === 0 && (
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Noch keine Arena-Siege eingetragen.
                          </div>
                        )}
                        {arenaLeaderboard.map((entry, index) => (
                          <div key={entry.userId} className={`flex items-center justify-between gap-3 p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                            <div className="min-w-0">
                              <div className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {index + 1}. {entry.name}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {entry.role} • {entry.wins} Siege
                              </div>
                            </div>
                            <div className={`text-sm font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                              {entry.creature.emoji} {entry.creature.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                      <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        🧾 Arena-Verlauf
                      </h4>
                      <div className="space-y-2">
                        {recentArenaHistory.length === 0 && (
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Noch keine Duelle oder Boss-Battles erfasst.
                          </div>
                        )}
                        {recentArenaHistory.map((entry) => {
                          const winners = (entry.winnerIds || []).map((id) => getUserNameById(id)).join(', ');
                          const losers = (entry.loserIds || []).map((id) => getUserNameById(id)).join(', ');
                          const dateText = new Date(entry.created_at).toLocaleString('de-DE');
                          return (
                            <div key={entry.id} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                              <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {dateText} • {entry.mode === 'boss' ? 'Boss-Battle' : 'Duel'} • {entry.discipline}
                              </div>
                              {entry.draw ? (
                                <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Unentschieden ({entry.styleName})</div>
                              ) : (
                                <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  🏆 {winners || 'Unbekannt'} besiegt {losers || 'Unbekannt'} ({entry.styleName})
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ⚔️ Team-Battle Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Team Azubis */}
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-cyan-900/30 border border-cyan-700' : 'bg-cyan-50 border border-cyan-200'}`}>
                        <h4 className={`font-bold mb-3 flex items-center justify-between ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                          <span>👨‍🎓 Team Azubis</span>
                          <span>{battleStats.azubis.points} Pkt</span>
                        </h4>
                        <p className={`text-xs mb-3 ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>
                          Swim {battleStats.azubis.swimPoints} + XP/Arena {battleStats.azubis.xpPoints}
                        </p>
                        {battleStats.azubis.memberList.length === 0 ? (
                          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <p>Noch keine Teilnehmer</p>
                            <p className="text-sm mt-1">Trage eine Trainingseinheit ein!</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {battleStats.azubis.memberList.map((member, idx) => renderTeamMember(member, idx, 'cyan'))}
                          </div>
                        )}
                        <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-cyan-800' : 'border-cyan-200'} text-sm`}>
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gesamt:</span>
                            <span className={`font-medium ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                              {(battleStats.azubis.distance / 1000).toFixed(1)} km • {Math.floor(battleStats.azubis.time / 60)}h {battleStats.azubis.time % 60}m
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Team Trainer */}
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-orange-900/30 border border-orange-700' : 'bg-orange-50 border border-orange-200'}`}>
                        <h4 className={`font-bold mb-3 flex items-center justify-between ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                          <span>👨‍🏫 Team Trainer</span>
                          <span>{battleStats.trainer.points} Pkt</span>
                        </h4>
                        <p className={`text-xs mb-3 ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
                          Swim {battleStats.trainer.swimPoints} + XP/Arena {battleStats.trainer.xpPoints}
                        </p>
                        {battleStats.trainer.memberList.length === 0 ? (
                          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <p>Noch keine Teilnehmer</p>
                            <p className="text-sm mt-1">Trainer, zeigt was ihr könnt!</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {battleStats.trainer.memberList.map((member, idx) => renderTeamMember(member, idx, 'orange'))}
                          </div>
                        )}
                        <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-orange-800' : 'border-orange-200'} text-sm`}>
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gesamt:</span>
                            <span className={`font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                              {(battleStats.trainer.distance / 1000).toFixed(1)} km • {Math.floor(battleStats.trainer.time / 60)}h {battleStats.trainer.time % 60}m
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistik-Vergleich */}
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      📈 Statistik-Vergleich
                    </h4>
                    <div className="space-y-4">
                      {/* Distanz-Vergleich */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>{(battleStats.azubis.distance / 1000).toFixed(1)} km</span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gesamtdistanz</span>
                          <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>{(battleStats.trainer.distance / 1000).toFixed(1)} km</span>
                        </div>
                        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                          <div className="bg-cyan-500 transition-all" style={{ width: `${battleStats.azubis.distance + battleStats.trainer.distance > 0 ? (battleStats.azubis.distance / (battleStats.azubis.distance + battleStats.trainer.distance)) * 100 : 50}%` }}></div>
                          <div className="bg-orange-500 transition-all" style={{ width: `${battleStats.azubis.distance + battleStats.trainer.distance > 0 ? (battleStats.trainer.distance / (battleStats.azubis.distance + battleStats.trainer.distance)) * 100 : 50}%` }}></div>
                        </div>
                      </div>
                      {/* Zeit-Vergleich */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>{Math.floor(battleStats.azubis.time / 60)}h {battleStats.azubis.time % 60}m</span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Trainingszeit</span>
                          <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>{Math.floor(battleStats.trainer.time / 60)}h {battleStats.trainer.time % 60}m</span>
                        </div>
                        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                          <div className="bg-cyan-500 transition-all" style={{ width: `${battleStats.azubis.time + battleStats.trainer.time > 0 ? (battleStats.azubis.time / (battleStats.azubis.time + battleStats.trainer.time)) * 100 : 50}%` }}></div>
                          <div className="bg-orange-500 transition-all" style={{ width: `${battleStats.azubis.time + battleStats.trainer.time > 0 ? (battleStats.trainer.time / (battleStats.azubis.time + battleStats.trainer.time)) * 100 : 50}%` }}></div>
                        </div>
                      </div>
                      {/* Teilnehmer-Vergleich */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>{battleStats.azubis.memberList.length}</span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Teilnehmer</span>
                          <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>{battleStats.trainer.memberList.length}</span>
                        </div>
                        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                          <div className="bg-cyan-500 transition-all" style={{ width: `${battleStats.azubis.memberList.length + battleStats.trainer.memberList.length > 0 ? (battleStats.azubis.memberList.length / (battleStats.azubis.memberList.length + battleStats.trainer.memberList.length)) * 100 : 50}%` }}></div>
                          <div className="bg-orange-500 transition-all" style={{ width: `${battleStats.azubis.memberList.length + battleStats.trainer.memberList.length > 0 ? (battleStats.trainer.memberList.length / (battleStats.azubis.memberList.length + battleStats.trainer.memberList.length)) * 100 : 50}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Handicap-System */}
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      📊 Alters-Handicap System
                    </h4>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Für faire Wettkämpfe zwischen verschiedenen Altersgruppen wird ein Handicap-System angewendet:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {[
                        { age: '< 40', bonus: '0%' },
                        { age: '40-49', bonus: '-5%' },
                        { age: '50-59', bonus: '-10%' },
                        { age: '60-69', bonus: '-15%' },
                        { age: '70+', bonus: '-20%' },
                      ].map(h => (
                        <div key={h.age} className={`p-3 rounded-lg text-center ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{h.age}</div>
                          <div className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{h.bonus} Zeit</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Trainer: Bestätigungen */}
            {(user.role === 'trainer' || user.role === 'ausbilder' || user.permissions.canViewAllStats) && pendingSwimConfirmations.length > 0 && (
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ✅ Zu bestätigende Einheiten
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingSwimConfirmations.length}</span>
                </h3>
                <div className="space-y-3">
                  {pendingSwimConfirmations.map(session => {
                    const trainingPlanId = extractTrainingPlanIdFromNotes(session.notes);
                    const trainingPlan = trainingPlanId ? getTrainingPlanById(trainingPlanId) : null;
                    const cleanNotes = stripTrainingPlanTagFromNotes(session.notes);
                    return (
                      <div key={session.id} className={`p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                        <div>
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {session.user_name} - {session.distance}m in {session.time_minutes} Min
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {SWIM_STYLES.find(s => s.id === session.style)?.name} | {session.date}
                            {cleanNotes && <span className="ml-2 italic">"{cleanNotes}"</span>}
                          </div>
                          {trainingPlan && (
                            <div className={`text-xs mt-1 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                              Trainingsplan: {trainingPlan.name} (+{trainingPlan.xpReward} XP bei Erfuellung)
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => confirmSwimSession(session.id)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                          >
                            Bestaetigen
                          </button>
                          <button
                            onClick={() => rejectSwimSession(session.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
                          >
                            Ablehnen
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
  );
};

export default SwimChallengeView;
