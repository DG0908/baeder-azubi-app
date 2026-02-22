import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const TrainerDashboardView = ({ allUsers, statsByUserId, leaderboard, allGames, namesMatch, isFinishedGameStatus, theoryExamHistory, theoryExamHistoryLoading, loadTheoryExamHistory }) => {
  const { user } = useAuth();
  const { darkMode } = useApp();

  if (!user.permissions.canViewAllStats) return null;

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gradient-to-r from-indigo-900 to-purple-900' : 'bg-gradient-to-r from-indigo-500 to-purple-500'} text-white rounded-xl p-8 text-center`}>
        <h2 className="text-3xl font-bold mb-2">👨‍🏫 Azubi-Übersicht</h2>
        <p className="opacity-90">Fortschritte und Leistungen deiner Azubis</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {allUsers.filter(u => u.role === 'azubi').map(azubi => {
          const rowStats = statsByUserId[azubi.id] || null;
          const leaderboardEntry = leaderboard.find(
            player => namesMatch(player.name, azubi.name)
          );
          const fallbackFinishedGames = allGames.filter(g =>
            isFinishedGameStatus(g.status) &&
            (namesMatch(g.player1, azubi.name) || namesMatch(g.player2, azubi.name))
          );
          const fallbackWins = fallbackFinishedGames.filter(g => {
            let winner = g.winner || null;
            if (!winner && g.player1Score > g.player2Score) winner = g.player1;
            else if (!winner && g.player2Score > g.player1Score) winner = g.player2;
            return namesMatch(winner, azubi.name);
          }).length;
          const fallbackTotal = fallbackFinishedGames.length;

          const hasLeaderboardStats = !!leaderboardEntry;
          const leaderboardWins = hasLeaderboardStats ? (leaderboardEntry.wins || 0) : 0;
          const leaderboardTotal = hasLeaderboardStats
            ? ((leaderboardEntry.wins || 0) + (leaderboardEntry.losses || 0) + (leaderboardEntry.draws || 0))
            : 0;

          const useFallback = (rowStats?.total || 0) === 0 && fallbackTotal > 0;
          const wins = hasLeaderboardStats
            ? leaderboardWins
            : (useFallback ? fallbackWins : (rowStats?.wins || 0));
          const total = hasLeaderboardStats
            ? leaderboardTotal
            : (useFallback ? fallbackTotal : (rowStats?.total || 0));
          const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

          return (
            <div key={azubi.email} className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                  🎓
                </div>
                <div>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubi.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Azubi</p>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-4 mb-4`}>
                <div className="flex justify-between mb-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Siegesrate</span>
                  <span className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{winRate}%</span>
                </div>
                <div className={`w-full ${darkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded-full h-2`}>
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                    style={{ width: `${winRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3 text-center`}>
                  <div className={`text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{wins}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quiz-Siege</div>
                </div>
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3 text-center`}>
                  <div className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{total}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quiz gesamt</div>
                </div>
              </div>

              {(() => {
                const azubiAttempts = (theoryExamHistory || []).filter(a => a.user_id === azubi.id);
                if (azubiAttempts.length === 0) return (
                  <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                    <p className={`text-xs font-bold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>📝 Prüfungssimulator</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Noch keine Prüfungen absolviert</p>
                  </div>
                );
                const best = azubiAttempts.reduce((a, b) => a.percentage > b.percentage ? a : b);
                const last = azubiAttempts[0];
                return (
                  <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                    <p className={`text-xs font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>📝 Prüfungssimulator</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${best.passed ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-amber-400' : 'text-amber-600')}`}>
                          {best.percentage}%
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bestes</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${last.passed ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
                          {last.percentage}%
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Letztes</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{azubiAttempts.length}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Versuche</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {azubi.trainingEnd && (
                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ausbildungsende: {new Date(azubi.trainingEnd).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {allUsers.filter(u => u.role === 'azubi').length === 0 && (
          <div className="col-span-3 text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Noch keine Azubis registriert
            </p>
          </div>
        )}
      </div>

      {/* Vollständige Prüfungshistorie */}
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>📝 Prüfungsverlauf (alle Azubis)</h3>
          <button
            onClick={loadTheoryExamHistory}
            className={`text-sm px-3 py-1.5 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
          >
            Aktualisieren
          </button>
        </div>
        {theoryExamHistoryLoading ? (
          <p className={`text-sm text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Laden…</p>
        ) : !theoryExamHistory || theoryExamHistory.length === 0 ? (
          <p className={`text-sm text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Noch keine Ergebnisse vorhanden</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {theoryExamHistory.map(attempt => (
              <div
                key={attempt.id}
                className={`flex items-center justify-between rounded-lg px-4 py-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}
              >
                <span className={`text-sm font-medium w-32 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{attempt.user_name}</span>
                <span className={`text-sm font-bold ${attempt.passed ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
                  {attempt.passed ? '✅' : '❌'} {attempt.percentage}% ({attempt.correct}/{attempt.total})
                </span>
                {attempt.keyword_mode && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-violet-900/60 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>🧠</span>
                )}
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(attempt.created_at).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboardView;
