import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const TrainerDashboardView = ({ allUsers, statsByUserId, leaderboard, allGames, namesMatch, isFinishedGameStatus }) => {
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
    </div>
  );
};

export default TrainerDashboardView;
