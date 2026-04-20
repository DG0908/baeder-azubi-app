import React from 'react';
import {
  Swords,
  Users,
  Fish,
  ScrollText,
  BarChart3,
  Trophy,
  Calendar,
  Cake,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Flag,
} from 'lucide-react';

const MONTH_NAMES = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

const inputClass = (darkMode) =>
  `w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
      : 'bg-white/70 border-gray-300 text-gray-800'
  }`;

const SwimBattleArenaView = ({
  darkMode,
  user,
  allUsers,
  SWIM_ARENA_DISCIPLINES,
  SWIM_BATTLE_WIN_POINTS,
  SWIM_STYLES,
  calculateTeamBattleStats,
  getSeaCreatureTier,
  getUserNameById,
  handleSwimBossBattleSubmit,
  handleSwimDuelSubmit,
  setSwimArenaMode,
  setSwimBossForm,
  setSwimDuelForm,
  swimArenaMode,
  swimBattleHistory,
  swimBattleResult,
  swimBattleWinsByUserId,
  swimBossForm,
  swimCurrentMonthBattleStats,
  swimCurrentMonthLabel,
  swimDuelForm,
  swimMonthlyDistanceRankingCurrentMonth,
  swimMonthlyResults,
  swimMonthlySwimmerCurrentMonth,
  swimYear,
  swimYearlySwimmerRanking,
  toSafeInt,
}) => {
  const battleStats = swimCurrentMonthBattleStats || calculateTeamBattleStats([], {}, allUsers);

  const renderTeamMember = (member, index, color) => {
    const medals = ['🥇', '🥈', '🥉'];
    const medal = medals[index] || `${index + 1}.`;
    const isCurrentUser = member.user_id === user?.id;
    const highlightCurrent =
      color === 'cyan'
        ? darkMode
          ? 'bg-cyan-900/50 border border-cyan-500/40'
          : 'bg-cyan-100 border border-cyan-300'
        : darkMode
          ? 'bg-orange-900/50 border border-orange-500/40'
          : 'bg-orange-100 border border-orange-300';

    return (
      <div
        key={member.user_id}
        className={`flex items-center gap-3 p-2 rounded-lg ${isCurrentUser ? highlightCurrent : ''}`}
      >
        <span className="text-xl w-8">{medal}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate text-gray-800">
            {member.user_name}
            {isCurrentUser && <span className="ml-1 text-xs opacity-70">(Du)</span>}
          </div>
          <div className="text-xs text-gray-500">
            {member.sessions} Einheiten • {(member.distance / 1000).toFixed(1)} km • Swim{' '}
            {member.swimPoints || 0} + XP/Arena {member.xp || 0}
          </div>
        </div>
        <div
          className={`font-bold ${
            color === 'cyan'
              ? darkMode
                ? 'text-cyan-300'
                : 'text-cyan-600'
              : darkMode
                ? 'text-orange-300'
                : 'text-orange-600'
          }`}
        >
          {member.points} Pkt
        </div>
      </div>
    );
  };

  const duelCandidates = allUsers.filter((u) => Boolean(u?.id));
  const trainerCandidates = allUsers.filter(
    (u) =>
      u?.role === 'trainer'
      || u?.role === 'ausbilder'
      || u?.role === 'admin'
      || Boolean(u?.permissions?.canViewAllStats),
  );
  const azubiCandidates = allUsers.filter((u) => u?.role === 'azubi');
  const arenaLeaderboard = allUsers
    .filter((u) => Boolean(u?.id))
    .map((account) => {
      const wins = toSafeInt(swimBattleWinsByUserId?.[account.id]);
      return {
        userId: account.id,
        name: account.name || 'Unbekannt',
        role: account.role || 'azubi',
        wins,
        creature: getSeaCreatureTier(wins),
      };
    })
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 10);
  const recentArenaHistory = Array.isArray(swimBattleHistory) ? swimBattleHistory.slice(0, 8) : [];
  const monthlyDistanceRanking = Array.isArray(swimMonthlyDistanceRankingCurrentMonth)
    ? swimMonthlyDistanceRankingCurrentMonth
    : [];
  const monthlyTopSwimmer =
    swimMonthlySwimmerCurrentMonth && toSafeInt(swimMonthlySwimmerCurrentMonth.distance) > 0
      ? swimMonthlySwimmerCurrentMonth
      : null;
  const monthlyTeamResults = Array.isArray(swimMonthlyResults) ? swimMonthlyResults : [];

  const subRowClass = darkMode
    ? 'bg-white/5 border border-white/5'
    : 'bg-white/60 border border-gray-200';

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-orange-500" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
              <Swords size={20} className={darkMode ? 'text-cyan-300' : 'text-cyan-600'} />
              Swim-Arena
            </h3>
            <p className="text-sm text-gray-600">
              1v1-Duelle oder Team Boss-Battle mit Meereswesen-Rangsystem
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSwimArenaMode('duel')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                swimArenaMode === 'duel'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm'
                  : darkMode
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80'
              }`}
            >
              <HeartHandshake size={16} />
              1v1 Duel
            </button>
            <button
              onClick={() => setSwimArenaMode('boss')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                swimArenaMode === 'boss'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                  : darkMode
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80'
              }`}
            >
              <Users size={16} />
              Boss-Battle
            </button>
          </div>
        </div>

        {swimArenaMode === 'duel' && (
          <form onSubmit={handleSwimDuelSubmit} className="space-y-3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-1 text-gray-700 font-medium">Disziplin</label>
                <select
                  value={swimDuelForm.discipline}
                  onChange={(event) =>
                    setSwimDuelForm((prev) => ({ ...prev, discipline: event.target.value }))
                  }
                  className={inputClass(darkMode)}
                >
                  {SWIM_ARENA_DISCIPLINES.map((discipline) => (
                    <option key={discipline.id} value={discipline.id}>
                      {discipline.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700 font-medium">
                  Schwimmtechnik
                </label>
                <select
                  value={swimDuelForm.style}
                  onChange={(event) =>
                    setSwimDuelForm((prev) => ({ ...prev, style: event.target.value }))
                  }
                  className={inputClass(darkMode)}
                >
                  {SWIM_STYLES.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-gray-700 font-medium">Teilnehmer A</label>
                <select
                  value={swimDuelForm.challengerId}
                  onChange={(event) =>
                    setSwimDuelForm((prev) => ({ ...prev, challengerId: event.target.value }))
                  }
                  className={inputClass(darkMode)}
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
                <label className="block text-sm mb-1 text-gray-700 font-medium">Teilnehmer B</label>
                <select
                  value={swimDuelForm.opponentId}
                  onChange={(event) =>
                    setSwimDuelForm((prev) => ({ ...prev, opponentId: event.target.value }))
                  }
                  className={inputClass(darkMode)}
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
                <label className="block text-sm mb-1 text-gray-700 font-medium">
                  Zeit A (Sek.)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={swimDuelForm.challengerSeconds}
                  onChange={(event) =>
                    setSwimDuelForm((prev) => ({ ...prev, challengerSeconds: event.target.value }))
                  }
                  className={inputClass(darkMode)}
                  placeholder="z.B. 36.4"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700 font-medium">
                  Zeit B (Sek.)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={swimDuelForm.opponentSeconds}
                  onChange={(event) =>
                    setSwimDuelForm((prev) => ({ ...prev, opponentSeconds: event.target.value }))
                  }
                  className={inputClass(darkMode)}
                  placeholder="z.B. 38.1"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium shadow-sm"
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
                <label className="block text-sm mb-1 text-gray-700 font-medium">Disziplin</label>
                <select
                  value={swimBossForm.discipline}
                  onChange={(event) =>
                    setSwimBossForm((prev) => ({ ...prev, discipline: event.target.value }))
                  }
                  className={inputClass(darkMode)}
                >
                  {SWIM_ARENA_DISCIPLINES.map((discipline) => (
                    <option key={discipline.id} value={discipline.id}>
                      {discipline.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700 font-medium">
                  Schwimmtechnik
                </label>
                <select
                  value={swimBossForm.style}
                  onChange={(event) =>
                    setSwimBossForm((prev) => ({ ...prev, style: event.target.value }))
                  }
                  className={inputClass(darkMode)}
                >
                  {SWIM_STYLES.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700 font-medium">Ausbilder</label>
                <select
                  value={swimBossForm.trainerId}
                  onChange={(event) =>
                    setSwimBossForm((prev) => ({ ...prev, trainerId: event.target.value }))
                  }
                  className={inputClass(darkMode)}
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
              <label className="block text-sm mb-2 text-gray-700 font-medium">
                Azubis gegen den Ausbilder
              </label>
              <div
                className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 rounded-xl border ${
                  darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-200'
                }`}
              >
                {azubiCandidates.length === 0 && (
                  <p className="text-sm text-gray-500">Keine Azubis gefunden.</p>
                )}
                {azubiCandidates.map((azubiAccount) => {
                  const checked = swimBossForm.azubiIds.includes(azubiAccount.id);
                  return (
                    <label
                      key={azubiAccount.id}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          const enabled = event.target.checked;
                          setSwimBossForm((prev) => ({
                            ...prev,
                            azubiIds: enabled
                              ? [...prev.azubiIds, azubiAccount.id]
                              : prev.azubiIds.filter((id) => id !== azubiAccount.id),
                          }));
                        }}
                        className="accent-cyan-500"
                      />
                      <span>{azubiAccount.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-gray-700 font-medium">
                  Zeit Ausbilder (Sek.)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={swimBossForm.trainerSeconds}
                  onChange={(event) =>
                    setSwimBossForm((prev) => ({ ...prev, trainerSeconds: event.target.value }))
                  }
                  className={inputClass(darkMode)}
                  placeholder="z.B. 42.0"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700 font-medium">
                  Team-Zeit Azubis (Sek.)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={swimBossForm.azubiSeconds}
                  onChange={(event) =>
                    setSwimBossForm((prev) => ({ ...prev, azubiSeconds: event.target.value }))
                  }
                  className={inputClass(darkMode)}
                  placeholder="z.B. 39.5"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-medium shadow-sm"
              >
                Boss-Battle auswerten
              </button>
            </div>
          </form>
        )}

        {swimBattleResult && (
          <div
            className={`mt-4 p-4 rounded-xl border ${
              darkMode ? 'bg-cyan-900/20 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'
            }`}
          >
            <h4 className="font-bold mb-2 flex items-center gap-2 text-gray-800">
              {swimBattleResult.draw ? (
                <>
                  <HeartHandshake size={18} />
                  Unentschieden
                </>
              ) : (
                <>
                  <Flag size={18} />
                  Arena-Ergebnis
                </>
              )}
            </h4>
            <p className="text-sm mb-3 text-gray-700">
              {swimBattleResult.mode === 'boss' ? 'Boss-Battle' : '1v1 Duel'} •{' '}
              {swimBattleResult.discipline} • {swimBattleResult.styleName}
            </p>
            {swimBattleResult.draw ? (
              <p className="text-sm text-gray-700">
                Beide Seiten haben exakt die gleiche Zeit erreicht.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                <div
                  className={`p-3 rounded-xl border ${
                    darkMode
                      ? 'bg-emerald-900/30 border-emerald-500/40'
                      : 'bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <div
                    className={`text-sm font-semibold mb-2 ${
                      darkMode ? 'text-emerald-300' : 'text-emerald-700'
                    }`}
                  >
                    Sieger
                  </div>
                  <div className="space-y-1">
                    {swimBattleResult.winners.map((winner) => (
                      <div
                        key={winner.userId}
                        className={`text-sm ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}
                      >
                        {winner.name}: {winner.battleCreature.emoji} {winner.battleCreature.name} (
                        {winner.wins} Siege)
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl border ${
                    darkMode ? 'bg-rose-900/30 border-rose-500/40' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div
                    className={`text-sm font-semibold mb-2 ${
                      darkMode ? 'text-rose-300' : 'text-rose-700'
                    }`}
                  >
                    Verlierer
                  </div>
                  <div className="space-y-1">
                    {swimBattleResult.losers.map((loser) => (
                      <div
                        key={loser.userId}
                        className={`text-sm ${darkMode ? 'text-rose-200' : 'text-rose-800'}`}
                      >
                        {loser.name}: {loser.battleCreature.emoji} {loser.battleCreature.name} (
                        {loser.wins} Siege)
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
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-500" />
          <h4 className="font-bold mb-3 flex items-center gap-2 text-gray-800">
            <Fish size={18} className={darkMode ? 'text-cyan-300' : 'text-cyan-600'} />
            Meereswesen-Rangliste
          </h4>
          <p className="text-xs mb-3 text-gray-500">
            Pro Arena-Sieg gibt es +1 Rang-Sieg und +{SWIM_BATTLE_WIN_POINTS} Team-Battle Punkte.
          </p>
          <div className="space-y-2">
            {arenaLeaderboard.length === 0 && (
              <div className="text-sm text-gray-500">Noch keine Arena-Siege eingetragen.</div>
            )}
            {arenaLeaderboard.map((entry, index) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between gap-3 p-2 rounded-lg ${subRowClass}`}
              >
                <div className="min-w-0">
                  <div className="font-medium truncate text-gray-800">
                    {index + 1}. {entry.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {entry.role} • {entry.wins} Siege
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}
                >
                  {entry.creature.emoji} {entry.creature.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
          <h4 className="font-bold mb-3 flex items-center gap-2 text-gray-800">
            <ScrollText size={18} className={darkMode ? 'text-indigo-300' : 'text-indigo-600'} />
            Arena-Verlauf
          </h4>
          <div className="space-y-2">
            {recentArenaHistory.length === 0 && (
              <div className="text-sm text-gray-500">
                Noch keine Duelle oder Boss-Battles erfasst.
              </div>
            )}
            {recentArenaHistory.map((entry) => {
              const winners = (entry.winnerIds || []).map((id) => getUserNameById(id)).join(', ');
              const losers = (entry.loserIds || []).map((id) => getUserNameById(id)).join(', ');
              const dateText = new Date(entry.created_at).toLocaleString('de-DE');
              return (
                <div key={entry.id} className={`p-3 rounded-lg ${subRowClass}`}>
                  <div className="text-xs mb-1 text-gray-500">
                    {dateText} • {entry.mode === 'boss' ? 'Boss-Battle' : 'Duel'} •{' '}
                    {entry.discipline}
                  </div>
                  {entry.draw ? (
                    <div className="text-sm text-gray-800">Unentschieden ({entry.styleName})</div>
                  ) : (
                    <div className="text-sm text-gray-800">
                      🏆 {winners || 'Unbekannt'} besiegt {losers || 'Unbekannt'} (
                      {entry.styleName})
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-slate-500 to-orange-500" />
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
          <Swords size={20} />
          Team-Battle Details
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className={`p-4 rounded-xl border ${
              darkMode ? 'bg-cyan-900/20 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'
            }`}
          >
            <h4
              className={`font-bold mb-3 flex items-center justify-between ${
                darkMode ? 'text-cyan-300' : 'text-cyan-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <GraduationCap size={18} />
                Team Azubis
              </span>
              <span>{battleStats.azubis.points} Pkt</span>
            </h4>
            <p className={`text-xs mb-3 ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>
              Swim {battleStats.azubis.swimPoints} + XP/Arena {battleStats.azubis.xpPoints}
            </p>
            {battleStats.azubis.memberList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Noch keine Teilnehmer</p>
                <p className="text-sm mt-1">Trage eine Trainingseinheit ein!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {battleStats.azubis.memberList.map((member, idx) =>
                  renderTeamMember(member, idx, 'cyan'),
                )}
              </div>
            )}
            <div
              className={`mt-4 pt-3 border-t ${
                darkMode ? 'border-cyan-500/30' : 'border-cyan-200'
              } text-sm`}
            >
              <div className="flex justify-between">
                <span className="text-gray-600">Gesamt:</span>
                <span className={`font-medium ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
                  {(battleStats.azubis.distance / 1000).toFixed(1)} km •{' '}
                  {Math.floor(battleStats.azubis.time / 60)}h {battleStats.azubis.time % 60}m
                </span>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              darkMode ? 'bg-orange-900/20 border-orange-500/30' : 'bg-orange-50 border-orange-200'
            }`}
          >
            <h4
              className={`font-bold mb-3 flex items-center justify-between ${
                darkMode ? 'text-orange-300' : 'text-orange-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Briefcase size={18} />
                Team Trainer
              </span>
              <span>{battleStats.trainer.points} Pkt</span>
            </h4>
            <p className={`text-xs mb-3 ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
              Swim {battleStats.trainer.swimPoints} + XP/Arena {battleStats.trainer.xpPoints}
            </p>
            {battleStats.trainer.memberList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Noch keine Teilnehmer</p>
                <p className="text-sm mt-1">Trainer, zeigt was ihr könnt!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {battleStats.trainer.memberList.map((member, idx) =>
                  renderTeamMember(member, idx, 'orange'),
                )}
              </div>
            )}
            <div
              className={`mt-4 pt-3 border-t ${
                darkMode ? 'border-orange-500/30' : 'border-orange-200'
              } text-sm`}
            >
              <div className="flex justify-between">
                <span className="text-gray-600">Gesamt:</span>
                <span className={`font-medium ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                  {(battleStats.trainer.distance / 1000).toFixed(1)} km •{' '}
                  {Math.floor(battleStats.trainer.time / 60)}h {battleStats.trainer.time % 60}m
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-orange-500" />
        <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
          <BarChart3 size={18} className={darkMode ? 'text-cyan-300' : 'text-cyan-600'} />
          Statistik-Vergleich
        </h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={darkMode ? 'text-cyan-300' : 'text-cyan-600'}>
                {(battleStats.azubis.distance / 1000).toFixed(1)} km
              </span>
              <span className="text-gray-600">Gesamtdistanz</span>
              <span className={darkMode ? 'text-orange-300' : 'text-orange-600'}>
                {(battleStats.trainer.distance / 1000).toFixed(1)} km
              </span>
            </div>
            <div
              className={`flex h-3 rounded-full overflow-hidden ${
                darkMode ? 'bg-white/10' : 'bg-gray-200'
              }`}
            >
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                style={{
                  width: `${battleStats.azubis.distance + battleStats.trainer.distance > 0 ? (battleStats.azubis.distance / (battleStats.azubis.distance + battleStats.trainer.distance)) * 100 : 50}%`,
                }}
              />
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                style={{
                  width: `${battleStats.azubis.distance + battleStats.trainer.distance > 0 ? (battleStats.trainer.distance / (battleStats.azubis.distance + battleStats.trainer.distance)) * 100 : 50}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={darkMode ? 'text-cyan-300' : 'text-cyan-600'}>
                {Math.floor(battleStats.azubis.time / 60)}h {battleStats.azubis.time % 60}m
              </span>
              <span className="text-gray-600">Trainingszeit</span>
              <span className={darkMode ? 'text-orange-300' : 'text-orange-600'}>
                {Math.floor(battleStats.trainer.time / 60)}h {battleStats.trainer.time % 60}m
              </span>
            </div>
            <div
              className={`flex h-3 rounded-full overflow-hidden ${
                darkMode ? 'bg-white/10' : 'bg-gray-200'
              }`}
            >
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                style={{
                  width: `${battleStats.azubis.time + battleStats.trainer.time > 0 ? (battleStats.azubis.time / (battleStats.azubis.time + battleStats.trainer.time)) * 100 : 50}%`,
                }}
              />
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                style={{
                  width: `${battleStats.azubis.time + battleStats.trainer.time > 0 ? (battleStats.trainer.time / (battleStats.azubis.time + battleStats.trainer.time)) * 100 : 50}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={darkMode ? 'text-cyan-300' : 'text-cyan-600'}>
                {battleStats.azubis.memberList.length}
              </span>
              <span className="text-gray-600">Teilnehmer</span>
              <span className={darkMode ? 'text-orange-300' : 'text-orange-600'}>
                {battleStats.trainer.memberList.length}
              </span>
            </div>
            <div
              className={`flex h-3 rounded-full overflow-hidden ${
                darkMode ? 'bg-white/10' : 'bg-gray-200'
              }`}
            >
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                style={{
                  width: `${battleStats.azubis.memberList.length + battleStats.trainer.memberList.length > 0 ? (battleStats.azubis.memberList.length / (battleStats.azubis.memberList.length + battleStats.trainer.memberList.length)) * 100 : 50}%`,
                }}
              />
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                style={{
                  width: `${battleStats.azubis.memberList.length + battleStats.trainer.memberList.length > 0 ? (battleStats.trainer.memberList.length / (battleStats.azubis.memberList.length + battleStats.trainer.memberList.length)) * 100 : 50}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />
          <h4 className="font-bold mb-3 flex items-center gap-2 text-gray-800">
            <Trophy size={18} className={darkMode ? 'text-amber-300' : 'text-amber-600'} />
            Schwimmer des Monats ({swimCurrentMonthLabel})
          </h4>
          {monthlyTopSwimmer ? (
            <div className="space-y-3">
              <div
                className={`p-3 rounded-xl border ${
                  darkMode ? 'bg-cyan-900/30 border-cyan-500/40' : 'bg-cyan-50 border-cyan-200'
                }`}
              >
                <div className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                  {monthlyTopSwimmer.user_name}
                </div>
                <div className={`text-sm ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>
                  {(toSafeInt(monthlyTopSwimmer.distance) / 1000).toFixed(1)} km •{' '}
                  {toSafeInt(monthlyTopSwimmer.sessions)} Einheiten
                </div>
              </div>
              <div className="space-y-2">
                {monthlyDistanceRanking.slice(0, 5).map((entry, index) => (
                  <div
                    key={entry.user_id}
                    className={`flex items-center justify-between text-sm p-2 rounded-lg ${subRowClass}`}
                  >
                    <span className="text-gray-700">
                      {index + 1}. {entry.user_name}
                    </span>
                    <span className={`font-medium ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      {(toSafeInt(entry.distance) / 1000).toFixed(1)} km
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Noch keine bestätigten Distanz-Einträge im aktuellen Monat.
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
          <h4 className="font-bold mb-3 flex items-center gap-2 text-gray-800">
            <Calendar size={18} className={darkMode ? 'text-indigo-300' : 'text-indigo-600'} />
            Jahresrangliste Schwimmer des Monats ({swimYear})
          </h4>
          {swimYearlySwimmerRanking.length === 0 ? (
            <div className="text-sm text-gray-500">
              Noch keine abgeschlossenen Monatswertungen vorhanden.
            </div>
          ) : (
            <div className="space-y-2">
              {swimYearlySwimmerRanking.map((entry, index) => (
                <div
                  key={entry.key}
                  className={`flex items-center justify-between gap-3 p-2 rounded-lg ${subRowClass}`}
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate text-gray-800">
                      {index + 1}. {entry.swimmer_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Titel: {toSafeInt(entry.titles)} • Monate:{' '}
                      {(entry.months || []).filter((month) => month > 0).join(', ')}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}
                  >
                    {(toSafeInt(entry.total_distance) / 1000).toFixed(1)} km
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-orange-500" />
        <h4 className="font-bold mb-3 flex items-center gap-2 text-gray-800">
          <Swords size={18} />
          Team-Gewinner pro Monat ({swimYear})
        </h4>
        {monthlyTeamResults.length === 0 ? (
          <div className="text-sm text-gray-500">
            Noch keine gespeicherten Monatsabschlüsse vorhanden.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-2">
            {monthlyTeamResults.map((entry) => {
              const winnerTeam = String(entry.winner_team || 'tie');
              const winnerLabel =
                winnerTeam === 'azubis'
                  ? 'Azubis'
                  : winnerTeam === 'trainer'
                    ? 'Trainer'
                    : 'Unentschieden';
              const winnerClass =
                winnerTeam === 'azubis'
                  ? darkMode
                    ? 'text-cyan-300'
                    : 'text-cyan-700'
                  : winnerTeam === 'trainer'
                    ? darkMode
                      ? 'text-orange-300'
                      : 'text-orange-700'
                    : 'text-gray-700';
              const monthNumber = Math.max(1, Math.min(12, toSafeInt(entry.month))) - 1;
              const monthLabel = MONTH_NAMES[monthNumber] || `Monat ${entry.month}`;
              return (
                <div key={entry.month_key} className={`p-3 rounded-lg ${subRowClass}`}>
                  <div className="text-xs text-gray-500">{monthLabel}</div>
                  <div className={`font-semibold ${winnerClass}`}>{winnerLabel}</div>
                  <div className="text-xs text-gray-500">
                    Azubis {toSafeInt(entry.azubis_points)} : {toSafeInt(entry.trainer_points)}{' '}
                    Trainer
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
        <h4 className="font-bold mb-3 flex items-center gap-2 text-gray-800">
          <Cake size={18} className={darkMode ? 'text-emerald-300' : 'text-emerald-600'} />
          Alters-Handicap System
        </h4>
        <p className="text-sm mb-4 text-gray-600">
          Für faire Wettkämpfe zwischen verschiedenen Altersgruppen wird ein Handicap-System
          angewendet:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { age: '< 40', bonus: '0%' },
            { age: '40-49', bonus: '-5%' },
            { age: '50-59', bonus: '-10%' },
            { age: '60-69', bonus: '-15%' },
            { age: '70+', bonus: '-20%' },
          ].map((h) => (
            <div
              key={h.age}
              className={`p-3 rounded-xl text-center border ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-200'
              }`}
            >
              <div className="font-bold text-gray-800">{h.age}</div>
              <div className={`text-sm ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                {h.bonus} Zeit
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwimBattleArenaView;
