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

const parseSessionDateParts = (dateInput) => {
  const raw = String(dateInput || '').trim();
  const dateMatch = raw.match(/^(\d{4})-(\d{2})/);
  if (dateMatch) {
    return { year: Number(dateMatch[1]), month: Number(dateMatch[2]) };
  }
  const parsedDate = new Date(raw);
  if (Number.isNaN(parsedDate.getTime())) return null;
  return { year: parsedDate.getFullYear(), month: parsedDate.getMonth() + 1 };
};

const formatMinutes = (minutesInput) => {
  const minutes = Math.max(0, Number(minutesInput) || 0);
  if (minutes >= 60) {
    return `${Math.floor(minutes / 60)}h ${Math.round(minutes % 60)}min`;
  }
  return `${Math.round(minutes)} min`;
};

const SwimLeaderboardView = ({
  darkMode,
  user,
  swimSessions,
  swimYear,
  swimCurrentMonthLabel,
  swimMonthlyResults,
  swimYearlySwimmerRanking,
  swimMonthlyDistanceRankingCurrentMonth,
  SWIM_CHALLENGES,
  toSafeInt,
}) => {
  const now = new Date();
  const rankingYear = Number.isFinite(Number(swimYear)) ? Number(swimYear) : now.getFullYear();
  const currentMonthNumber = now.getMonth() + 1;
  const currentMonthLabel =
    swimCurrentMonthLabel
    || now.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }).toUpperCase();

  const pastMonthChampions = (Array.isArray(swimMonthlyResults) ? swimMonthlyResults : [])
    .filter(
      (entry) =>
        toSafeInt(entry?.year) === rankingYear
        && toSafeInt(entry?.month) > 0
        && toSafeInt(entry?.month) < currentMonthNumber
        && String(entry?.swimmer_name || '').trim(),
    )
    .sort((a, b) => toSafeInt(b?.month) - toSafeInt(a?.month));

  const yearlyChampion =
    Array.isArray(swimYearlySwimmerRanking) && swimYearlySwimmerRanking.length > 0
      ? swimYearlySwimmerRanking[0]
      : null;

  const buildDistanceLeaderboard = (sessionsInput) => {
    const rankingByUserId = {};
    sessionsInput.forEach((session) => {
      if (!session?.confirmed) return;
      const userId = String(session.user_id || '').trim();
      if (!userId) return;
      if (!rankingByUserId[userId]) {
        rankingByUserId[userId] = {
          user_id: userId,
          user_name: session.user_name || 'Unbekannt',
          user_role: session.user_role || 'azubi',
          total_distance: 0,
          total_time: 0,
          session_count: 0,
        };
      }
      rankingByUserId[userId].total_distance += toSafeInt(session.distance);
      rankingByUserId[userId].total_time += toSafeInt(session.time_minutes);
      rankingByUserId[userId].session_count += 1;
    });

    return Object.values(rankingByUserId).sort(
      (a, b) =>
        b.total_distance - a.total_distance
        || b.session_count - a.session_count
        || a.total_time - b.total_time
        || String(a.user_name || '').localeCompare(String(b.user_name || ''), 'de-DE'),
    );
  };

  const confirmedSessions = swimSessions.filter((session) => Boolean(session?.confirmed));
  const yearlyConfirmedSessions = confirmedSessions.filter((session) => {
    const dateParts = parseSessionDateParts(session?.date);
    return dateParts?.year === rankingYear;
  });
  const leaderboard = buildDistanceLeaderboard(yearlyConfirmedSessions);

  const currentMonthLeaderboard = (
    Array.isArray(swimMonthlyDistanceRankingCurrentMonth) ? swimMonthlyDistanceRankingCurrentMonth : []
  )
    .map((entry) => ({
      user_id: entry?.user_id || '',
      user_name: entry?.user_name || 'Unbekannt',
      user_role: entry?.user_role || 'azubi',
      total_distance: toSafeInt(entry?.distance),
      total_time: toSafeInt(entry?.time_minutes),
      session_count: toSafeInt(entry?.sessions),
    }))
    .filter((entry) => entry.user_id)
    .sort(
      (a, b) =>
        b.total_distance - a.total_distance
        || b.session_count - a.session_count
        || a.total_time - b.total_time
        || String(a.user_name || '').localeCompare(String(b.user_name || ''), 'de-DE'),
    );

  const challengeTimeLeaderboards = SWIM_CHALLENGES.map((challenge) => {
    const challengeSessions = yearlyConfirmedSessions.filter(
      (session) =>
        session.challenge_id === challenge.id
        && Number(session.time_minutes || 0) > 0
        && Number(session.distance || 0) > 0,
    );

    if (challengeSessions.length === 0) return null;

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
          date: session.date,
        };
      }
    });

    const ranking = Object.values(bestByUser)
      .sort((a, b) => a.paceSecondsPer100 - b.paceSecondsPer100)
      .slice(0, 5);

    if (ranking.length === 0) return null;

    return { challenge, ranking };
  }).filter(Boolean);

  const myStats = leaderboard.find((entry) => entry.user_id === user?.id) || null;
  const myRank = myStats ? leaderboard.findIndex((entry) => entry.user_id === user?.id) + 1 : 0;

  return (
    <div className="space-y-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🏆 Jahresrangliste Gesamtdistanz ({rankingYear})
        </h3>

        {leaderboard.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="text-5xl mb-4 block">🏊</span>
            <p>Noch keine bestätigten Einträge im Jahr {rankingYear}.</p>
            <p className="text-sm mt-2">Trage deine erste Trainingseinheit ein!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              const medal = medals[index] || `${index + 1}.`;
              const isCurrentUser = entry.user_id === user?.id;
              const avgPace =
                entry.total_time > 0
                  ? (entry.total_time / (entry.total_distance / 100)).toFixed(1)
                  : 0;

              return (
                <div
                  key={entry.user_id}
                  className={`p-4 rounded-lg flex items-center gap-4 transition-all ${
                    isCurrentUser
                      ? darkMode
                        ? 'bg-cyan-900/50 border-2 border-cyan-500'
                        : 'bg-cyan-50 border-2 border-cyan-400'
                      : darkMode
                        ? 'bg-slate-700'
                        : 'bg-gray-50'
                  }`}
                >
                  <div className="text-3xl w-12 text-center">{medal}</div>
                  <div className="flex-1">
                    <div
                      className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {entry.user_name}
                      {isCurrentUser && (
                        <span className="text-xs bg-cyan-500 text-white px-2 py-0.5 rounded-full">
                          Du
                        </span>
                      )}
                      <span className="text-sm font-normal opacity-70">
                        {entry.user_role === 'azubi' ? '👨‍🎓' : '👨‍🏫'}
                      </span>
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {entry.session_count} Einheiten • Ø {avgPace} Min/100m
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}
                    >
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

      <div className="grid lg:grid-cols-2 gap-4">
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            🏅 Champions der vergangenen Monate ({rankingYear})
          </h3>
          {yearlyChampion && (
            <div
              className={`mb-3 p-3 rounded-lg ${darkMode ? 'bg-cyan-900/30 border border-cyan-700' : 'bg-cyan-50 border border-cyan-200'}`}
            >
              <div className={`text-sm ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>
                Bisheriger Jahres-Champion
              </div>
              <div className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                {yearlyChampion.swimmer_name}
              </div>
              <div className={`text-xs ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>
                {toSafeInt(yearlyChampion.titles)} Titel •{' '}
                {(toSafeInt(yearlyChampion.total_distance) / 1000).toFixed(1)} km
              </div>
            </div>
          )}

          {pastMonthChampions.length === 0 ? (
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Noch keine abgeschlossenen Champion-Monate verfügbar.
            </div>
          ) : (
            <div className="space-y-2">
              {pastMonthChampions.map((entry) => {
                const monthNumber = Math.max(1, Math.min(12, toSafeInt(entry?.month))) - 1;
                const monthLabel = MONTH_NAMES[monthNumber] || `Monat ${toSafeInt(entry?.month)}`;
                const winnerName = String(entry?.swimmer_name || '').trim() || 'Unbekannt';
                const distanceKm = (toSafeInt(entry?.swimmer_distance) / 1000).toFixed(1);
                return (
                  <div
                    key={entry?.month_key || `${rankingYear}-${monthNumber}`}
                    className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {monthLabel} {toSafeInt(entry?.year)}
                    </div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {winnerName}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      {distanceKm} km
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            📅 Monatsrangliste Gesamtdistanz ({currentMonthLabel})
          </h3>
          {currentMonthLeaderboard.length === 0 ? (
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Noch keine bestätigten Distanz-Einträge im aktuellen Monat.
            </div>
          ) : (
            <div className="space-y-2">
              {currentMonthLeaderboard.map((entry, index) => {
                const isCurrentUser = entry.user_id === user?.id;
                return (
                  <div
                    key={`month-${entry.user_id}`}
                    className={`p-3 rounded-lg flex items-center justify-between gap-3 ${
                      isCurrentUser
                        ? darkMode
                          ? 'bg-cyan-900/40 border border-cyan-700'
                          : 'bg-cyan-50 border border-cyan-200'
                        : darkMode
                          ? 'bg-slate-700'
                          : 'bg-gray-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}
                      >
                        {index + 1}. {entry.user_name} {isCurrentUser ? '(Du)' : ''}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {entry.session_count} Einheiten • {formatMinutes(entry.total_time)}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}
                    >
                      {(entry.total_distance / 1000).toFixed(1)} km
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          ⏱️ Schnellste Zeiten pro Challenge ({rankingYear})
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
                            ? darkMode
                              ? 'bg-cyan-900/40 border border-cyan-700'
                              : 'bg-cyan-50 border border-cyan-200'
                            : ''
                        }`}
                      >
                        <span className="w-8 text-center text-lg">{medal}</span>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}
                          >
                            {entry.userName}
                            {isCurrentUser && (
                              <span className="ml-1 text-xs opacity-70">(Du)</span>
                            )}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {entry.distance}m in {formatMinutes(entry.timeMinutes)} •{' '}
                            {entry.paceSecondsPer100.toFixed(1)} s/100m
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

      {leaderboard.length >= 3 && (
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <h3
            className={`font-bold text-lg mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}
          >
            🏅 Podium
          </h3>
          <div className="flex items-end justify-center gap-4">
            <div className="text-center">
              <div className="text-4xl mb-2">🥈</div>
              <div
                className={`w-24 h-20 ${darkMode ? 'bg-gray-500' : 'bg-gray-300'} rounded-t-lg flex items-center justify-center`}
              >
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  {(leaderboard[1].total_distance / 1000).toFixed(1)} km
                </span>
              </div>
              <div className={`text-sm font-medium mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {leaderboard[1].user_name.split(' ')[0]}
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">🥇</div>
              <div
                className={`w-24 h-28 bg-gradient-to-b ${darkMode ? 'from-yellow-500 to-yellow-700' : 'from-yellow-400 to-yellow-500'} rounded-t-lg flex items-center justify-center`}
              >
                <span className="font-bold text-white">
                  {(leaderboard[0].total_distance / 1000).toFixed(1)} km
                </span>
              </div>
              <div className={`text-sm font-medium mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {leaderboard[0].user_name.split(' ')[0]}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🥉</div>
              <div
                className={`w-24 h-16 ${darkMode ? 'bg-orange-700' : 'bg-orange-400'} rounded-t-lg flex items-center justify-center`}
              >
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

      {myStats && (
        <div
          className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-600'} text-white rounded-xl p-6 shadow-lg`}
        >
          <h3 className="font-bold text-lg mb-4">📊 Deine Jahres-Statistiken</h3>
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
      )}
    </div>
  );
};

export default SwimLeaderboardView;
