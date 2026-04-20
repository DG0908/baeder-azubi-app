import React from 'react';
import { Trophy, Medal, Calendar, Clock, BarChart3, Waves } from 'lucide-react';

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

  const rowHighlightCurrentUser = darkMode
    ? 'bg-cyan-900/40 border border-cyan-500/40'
    : 'bg-cyan-50 border border-cyan-300';
  const rowDefault = darkMode ? 'bg-white/5 border border-white/5' : 'bg-white/60 border border-gray-200';

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500" />
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
          <Trophy size={20} className={darkMode ? 'text-amber-300' : 'text-amber-600'} />
          Jahresrangliste Gesamtdistanz ({rankingYear})
        </h3>

        {leaderboard.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div
              className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                darkMode ? 'bg-white/5' : 'bg-gray-100'
              }`}
            >
              <Waves size={28} />
            </div>
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
                  className={`p-4 rounded-xl flex items-center gap-4 transition-all ${
                    isCurrentUser ? rowHighlightCurrentUser : rowDefault
                  }`}
                >
                  <div className="text-3xl w-12 text-center">{medal}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold flex items-center gap-2 text-gray-800">
                      <span className="truncate">{entry.user_name}</span>
                      {isCurrentUser && (
                        <span className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                          Du
                        </span>
                      )}
                      <span className="text-xs font-normal opacity-70 whitespace-nowrap">
                        {entry.user_role === 'azubi' ? 'Azubi' : 'Trainer'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {entry.session_count} Einheiten • Ø {avgPace} Min/100m
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
                      {(entry.total_distance / 1000).toFixed(1)} km
                    </div>
                    <div className="text-sm text-gray-600">
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
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-800">
            <Medal size={20} className={darkMode ? 'text-amber-300' : 'text-amber-600'} />
            Champions der vergangenen Monate ({rankingYear})
          </h3>
          {yearlyChampion && (
            <div
              className={`mb-3 p-3 rounded-xl border ${
                darkMode ? 'bg-cyan-900/30 border-cyan-500/40' : 'bg-cyan-50 border-cyan-200'
              }`}
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
            <div className="text-sm text-gray-500">
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
                    className={`p-3 rounded-xl border ${rowDefault}`}
                  >
                    <div className="text-xs text-gray-500">
                      {monthLabel} {toSafeInt(entry?.year)}
                    </div>
                    <div className="font-semibold text-gray-800">{winnerName}</div>
                    <div className={`text-xs ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      {distanceKm} km
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-800">
            <Calendar size={20} className={darkMode ? 'text-cyan-300' : 'text-cyan-600'} />
            Monatsrangliste Gesamtdistanz ({currentMonthLabel})
          </h3>
          {currentMonthLeaderboard.length === 0 ? (
            <div className="text-sm text-gray-500">
              Noch keine bestätigten Distanz-Einträge im aktuellen Monat.
            </div>
          ) : (
            <div className="space-y-2">
              {currentMonthLeaderboard.map((entry, index) => {
                const isCurrentUser = entry.user_id === user?.id;
                return (
                  <div
                    key={`month-${entry.user_id}`}
                    className={`p-3 rounded-xl flex items-center justify-between gap-3 ${
                      isCurrentUser ? rowHighlightCurrentUser : rowDefault
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate text-gray-800">
                        {index + 1}. {entry.user_name} {isCurrentUser ? '(Du)' : ''}
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.session_count} Einheiten • {formatMinutes(entry.total_time)}
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      {(entry.total_distance / 1000).toFixed(1)} km
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-800">
          <Clock size={20} className={darkMode ? 'text-indigo-300' : 'text-indigo-600'} />
          Schnellste Zeiten pro Challenge ({rankingYear})
        </h3>
        <p className="text-sm mb-4 text-gray-600">
          Gewertet werden bestätigte Challenge-Einheiten nach bester Pace (Sekunden pro 100m).
        </p>

        {challengeTimeLeaderboards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Noch keine bestätigten Challenge-Zeiten vorhanden.</p>
            <p className="text-sm mt-1">Trage Einheiten mit Challenge-Zuordnung ein.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {challengeTimeLeaderboards.map(({ challenge, ranking }) => (
              <div key={challenge.id} className={`rounded-xl p-4 border ${rowDefault}`}>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-lg">{challenge.icon}</span>
                    {challenge.name}
                  </div>
                  <div className="text-xs text-gray-500">Top {ranking.length}</div>
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
                          isCurrentUser ? rowHighlightCurrentUser : ''
                        }`}
                      >
                        <span className="w-8 text-center text-lg">{medal}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate text-gray-800">
                            {entry.userName}
                            {isCurrentUser && <span className="ml-1 text-xs opacity-70">(Du)</span>}
                          </div>
                          <div className="text-xs text-gray-600">
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
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500" />
          <h3 className="font-bold text-lg mb-6 text-center flex items-center justify-center gap-2 text-gray-800">
            <Medal size={20} className={darkMode ? 'text-amber-300' : 'text-amber-600'} />
            Podium
          </h3>
          <div className="flex items-end justify-center gap-4">
            <div className="text-center">
              <div className="text-4xl mb-2">🥈</div>
              <div
                className={`w-24 h-20 bg-gradient-to-b ${
                  darkMode ? 'from-slate-400 to-slate-600' : 'from-gray-300 to-gray-400'
                } rounded-t-xl flex items-center justify-center shadow-lg`}
              >
                <span className="font-bold text-white drop-shadow">
                  {(leaderboard[1].total_distance / 1000).toFixed(1)} km
                </span>
              </div>
              <div className="text-sm font-medium mt-2 text-gray-800">
                {leaderboard[1].user_name.split(' ')[0]}
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">🥇</div>
              <div
                className={`w-24 h-28 bg-gradient-to-b ${
                  darkMode ? 'from-yellow-400 to-yellow-600' : 'from-yellow-400 to-amber-500'
                } rounded-t-xl flex items-center justify-center shadow-lg`}
              >
                <span className="font-bold text-white drop-shadow">
                  {(leaderboard[0].total_distance / 1000).toFixed(1)} km
                </span>
              </div>
              <div className="text-sm font-medium mt-2 text-gray-800">
                {leaderboard[0].user_name.split(' ')[0]}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🥉</div>
              <div
                className={`w-24 h-16 bg-gradient-to-b ${
                  darkMode ? 'from-orange-500 to-orange-700' : 'from-orange-300 to-orange-500'
                } rounded-t-xl flex items-center justify-center shadow-lg`}
              >
                <span className="font-bold text-white drop-shadow">
                  {(leaderboard[2].total_distance / 1000).toFixed(1)} km
                </span>
              </div>
              <div className="text-sm font-medium mt-2 text-gray-800">
                {leaderboard[2].user_name.split(' ')[0]}
              </div>
            </div>
          </div>
        </div>
      )}

      {myStats && (
        <div
          className={`${
            darkMode
              ? 'bg-gradient-to-r from-cyan-900 via-slate-900 to-blue-900'
              : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500'
          } text-white rounded-2xl p-6 shadow-lg`}
        >
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Deine Jahres-Statistiken
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-3xl font-bold">{myRank}.</div>
              <div className="text-sm opacity-80">Platzierung</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-3xl font-bold">{(myStats.total_distance / 1000).toFixed(1)}</div>
              <div className="text-sm opacity-80">Kilometer</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-3xl font-bold">{myStats.session_count}</div>
              <div className="text-sm opacity-80">Einheiten</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
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
