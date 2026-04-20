import React from 'react';

const MONTH_NAMES = [
  'Januar',
  'Februar',
  'Maerz',
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

    return (
      <div
        key={member.user_id}
        className={`flex items-center gap-3 p-2 rounded-lg ${
          isCurrentUser
            ? darkMode
              ? `bg-${color}-900/50 border border-${color}-500`
              : `bg-${color}-100 border border-${color}-300`
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
            {member.sessions} Einheiten • {(member.distance / 1000).toFixed(1)} km • Swim{' '}
            {member.swimPoints || 0} + XP/Arena {member.xp || 0}
          </div>
        </div>
        <div
          className={`font-bold ${color === 'cyan' ? (darkMode ? 'text-cyan-400' : 'text-cyan-600') : darkMode ? 'text-orange-400' : 'text-orange-600'}`}
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
                  : darkMode
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🤝 1v1 Duel
            </button>
            <button
              onClick={() => setSwimArenaMode('boss')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                swimArenaMode === 'boss'
                  ? 'bg-orange-500 text-white'
                  : darkMode
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Disziplin
                </label>
                <select
                  value={swimDuelForm.discipline}
                  onChange={(event) =>
                    setSwimDuelForm((prev) => ({ ...prev, discipline: event.target.value }))
                  }
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                >
                  {SWIM_ARENA_DISCIPLINES.map((discipline) => (
                    <option key={discipline.id} value={discipline.id}>
                      {discipline.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Schwimmtechnik
                </label>
                <select
                  value={swimDuelForm.style}
                  onChange={(event) =>
                    setSwimDuelForm((prev) => ({ ...prev, style: event.target.value }))
                  }
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
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
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Teilnehmer A
                </label>
                <select
                  value={swimDuelForm.challengerId}
                  onChange={(event) =>
                    setSwimDuelForm((prev) => ({ ...prev, challengerId: event.target.value }))
                  }
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
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Teilnehmer B
                </label>
                <select
                  value={swimDuelForm.opponentId}
                  onChange={(event) =>
                    setSwimDuelForm((prev) => ({ ...prev, opponentId: event.target.value }))
                  }
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
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
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
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  placeholder="z.B. 36.4"
                />
              </div>
              <div>
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
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
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Disziplin
                </label>
                <select
                  value={swimBossForm.discipline}
                  onChange={(event) =>
                    setSwimBossForm((prev) => ({ ...prev, discipline: event.target.value }))
                  }
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                >
                  {SWIM_ARENA_DISCIPLINES.map((discipline) => (
                    <option key={discipline.id} value={discipline.id}>
                      {discipline.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Schwimmtechnik
                </label>
                <select
                  value={swimBossForm.style}
                  onChange={(event) =>
                    setSwimBossForm((prev) => ({ ...prev, style: event.target.value }))
                  }
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                >
                  {SWIM_STYLES.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Ausbilder
                </label>
                <select
                  value={swimBossForm.trainerId}
                  onChange={(event) =>
                    setSwimBossForm((prev) => ({ ...prev, trainerId: event.target.value }))
                  }
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
              <label
                className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Azubis gegen den Ausbilder
              </label>
              <div
                className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
              >
                {azubiCandidates.length === 0 && (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Keine Azubis gefunden.
                  </p>
                )}
                {azubiCandidates.map((azubiAccount) => {
                  const checked = swimBossForm.azubiIds.includes(azubiAccount.id);
                  return (
                    <label
                      key={azubiAccount.id}
                      className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
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
                      />
                      <span>{azubiAccount.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
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
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  placeholder="z.B. 42.0"
                />
              </div>
              <div>
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
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
          <div
            className={`mt-4 p-4 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-cyan-50 border-cyan-200'}`}
          >
            <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {swimBattleResult.draw ? '🤝 Unentschieden' : '🏁 Arena-Ergebnis'}
            </h4>
            <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {swimBattleResult.mode === 'boss' ? 'Boss-Battle' : '1v1 Duel'} •{' '}
              {swimBattleResult.discipline} • {swimBattleResult.styleName}
            </p>
            {swimBattleResult.draw ? (
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Beide Seiten haben exakt die gleiche Zeit erreicht.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                <div
                  className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'}`}
                >
                  <div
                    className={`text-sm font-semibold mb-2 ${darkMode ? 'text-green-300' : 'text-green-700'}`}
                  >
                    Sieger
                  </div>
                  <div className="space-y-1">
                    {swimBattleResult.winners.map((winner) => (
                      <div
                        key={winner.userId}
                        className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-800'}`}
                      >
                        {winner.name}: {winner.battleCreature.emoji} {winner.battleCreature.name} (
                        {winner.wins} Siege)
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}
                >
                  <div
                    className={`text-sm font-semibold mb-2 ${darkMode ? 'text-red-300' : 'text-red-700'}`}
                  >
                    Verlierer
                  </div>
                  <div className="space-y-1">
                    {swimBattleResult.losers.map((loser) => (
                      <div
                        key={loser.userId}
                        className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-800'}`}
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
              <div
                key={entry.userId}
                className={`flex items-center justify-between gap-3 p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}
              >
                <div className="min-w-0">
                  <div
                    className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}
                  >
                    {index + 1}. {entry.name}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                <div
                  key={entry.id}
                  className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}
                >
                  <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {dateText} • {entry.mode === 'boss' ? 'Boss-Battle' : 'Duel'} •{' '}
                    {entry.discipline}
                  </div>
                  {entry.draw ? (
                    <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Unentschieden ({entry.styleName})
                    </div>
                  ) : (
                    <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
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

      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          ⚔️ Team-Battle Details
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className={`p-4 rounded-lg ${darkMode ? 'bg-cyan-900/30 border border-cyan-700' : 'bg-cyan-50 border border-cyan-200'}`}
          >
            <h4
              className={`font-bold mb-3 flex items-center justify-between ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}
            >
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
                {battleStats.azubis.memberList.map((member, idx) =>
                  renderTeamMember(member, idx, 'cyan'),
                )}
              </div>
            )}
            <div
              className={`mt-4 pt-3 border-t ${darkMode ? 'border-cyan-800' : 'border-cyan-200'} text-sm`}
            >
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gesamt:</span>
                <span className={`font-medium ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  {(battleStats.azubis.distance / 1000).toFixed(1)} km •{' '}
                  {Math.floor(battleStats.azubis.time / 60)}h {battleStats.azubis.time % 60}m
                </span>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg ${darkMode ? 'bg-orange-900/30 border border-orange-700' : 'bg-orange-50 border border-orange-200'}`}
          >
            <h4
              className={`font-bold mb-3 flex items-center justify-between ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}
            >
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
                {battleStats.trainer.memberList.map((member, idx) =>
                  renderTeamMember(member, idx, 'orange'),
                )}
              </div>
            )}
            <div
              className={`mt-4 pt-3 border-t ${darkMode ? 'border-orange-800' : 'border-orange-200'} text-sm`}
            >
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gesamt:</span>
                <span className={`font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  {(battleStats.trainer.distance / 1000).toFixed(1)} km •{' '}
                  {Math.floor(battleStats.trainer.time / 60)}h {battleStats.trainer.time % 60}m
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          📈 Statistik-Vergleich
        </h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>
                {(battleStats.azubis.distance / 1000).toFixed(1)} km
              </span>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gesamtdistanz</span>
              <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>
                {(battleStats.trainer.distance / 1000).toFixed(1)} km
              </span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
              <div
                className="bg-cyan-500 transition-all"
                style={{
                  width: `${battleStats.azubis.distance + battleStats.trainer.distance > 0 ? (battleStats.azubis.distance / (battleStats.azubis.distance + battleStats.trainer.distance)) * 100 : 50}%`,
                }}
              ></div>
              <div
                className="bg-orange-500 transition-all"
                style={{
                  width: `${battleStats.azubis.distance + battleStats.trainer.distance > 0 ? (battleStats.trainer.distance / (battleStats.azubis.distance + battleStats.trainer.distance)) * 100 : 50}%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>
                {Math.floor(battleStats.azubis.time / 60)}h {battleStats.azubis.time % 60}m
              </span>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Trainingszeit</span>
              <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>
                {Math.floor(battleStats.trainer.time / 60)}h {battleStats.trainer.time % 60}m
              </span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
              <div
                className="bg-cyan-500 transition-all"
                style={{
                  width: `${battleStats.azubis.time + battleStats.trainer.time > 0 ? (battleStats.azubis.time / (battleStats.azubis.time + battleStats.trainer.time)) * 100 : 50}%`,
                }}
              ></div>
              <div
                className="bg-orange-500 transition-all"
                style={{
                  width: `${battleStats.azubis.time + battleStats.trainer.time > 0 ? (battleStats.trainer.time / (battleStats.azubis.time + battleStats.trainer.time)) * 100 : 50}%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>
                {battleStats.azubis.memberList.length}
              </span>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Teilnehmer</span>
              <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>
                {battleStats.trainer.memberList.length}
              </span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
              <div
                className="bg-cyan-500 transition-all"
                style={{
                  width: `${battleStats.azubis.memberList.length + battleStats.trainer.memberList.length > 0 ? (battleStats.azubis.memberList.length / (battleStats.azubis.memberList.length + battleStats.trainer.memberList.length)) * 100 : 50}%`,
                }}
              ></div>
              <div
                className="bg-orange-500 transition-all"
                style={{
                  width: `${battleStats.azubis.memberList.length + battleStats.trainer.memberList.length > 0 ? (battleStats.trainer.memberList.length / (battleStats.azubis.memberList.length + battleStats.trainer.memberList.length)) * 100 : 50}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            🏅 Schwimmer des Monats ({swimCurrentMonthLabel})
          </h4>
          {monthlyTopSwimmer ? (
            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg ${darkMode ? 'bg-cyan-900/30 border border-cyan-700' : 'bg-cyan-50 border border-cyan-200'}`}
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
                    className={`flex items-center justify-between text-sm p-2 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}
                  >
                    <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                      {index + 1}. {entry.user_name}
                    </span>
                    <span
                      className={`font-medium ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}
                    >
                      {(toSafeInt(entry.distance) / 1000).toFixed(1)} km
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Noch keine bestätigten Distanz-Eintraege im aktuellen Monat.
            </div>
          )}
        </div>

        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            🗓️ Jahresrangliste Schwimmer des Monats ({swimYear})
          </h4>
          {swimYearlySwimmerRanking.length === 0 ? (
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Noch keine abgeschlossenen Monatswertungen vorhanden.
            </div>
          ) : (
            <div className="space-y-2">
              {swimYearlySwimmerRanking.map((entry, index) => (
                <div
                  key={entry.key}
                  className={`flex items-center justify-between gap-3 p-2 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}
                >
                  <div className="min-w-0">
                    <div
                      className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {index + 1}. {entry.swimmer_name}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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

      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          ⚔️ Team-Gewinner pro Monat ({swimYear})
        </h4>
        {monthlyTeamResults.length === 0 ? (
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Noch keine gespeicherten Monatsabschluesse vorhanden.
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
                    : darkMode
                      ? 'text-gray-300'
                      : 'text-gray-700';
              const monthNumber = Math.max(1, Math.min(12, toSafeInt(entry.month))) - 1;
              const monthLabel = MONTH_NAMES[monthNumber] || `Monat ${entry.month}`;
              return (
                <div
                  key={entry.month_key}
                  className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {monthLabel}
                  </div>
                  <div className={`font-semibold ${winnerClass}`}>{winnerLabel}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Azubis {toSafeInt(entry.azubis_points)} : {toSafeInt(entry.trainer_points)}{' '}
                    Trainer
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          📊 Alters-Handicap System
        </h4>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
              className={`p-3 rounded-lg text-center ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}
            >
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {h.age}
              </div>
              <div className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
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
