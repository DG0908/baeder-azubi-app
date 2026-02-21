import React from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/constants';

const StatsView = ({ userStats, BADGES, userBadges, leaderboard }) => {
  const { user } = useAuth();
  const { darkMode } = useApp();

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white rounded-xl p-8`}>
        <h2 className="text-3xl font-bold mb-4">📊 Deine Statistiken</h2>
        {userStats && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-lg p-4 text-center`}>
                <div className="text-3xl font-bold">{userStats.wins}</div>
                <div className="text-sm">Siege</div>
              </div>
              <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-lg p-4 text-center`}>
                <div className="text-3xl font-bold">{userStats.losses}</div>
                <div className="text-sm">Niederlagen</div>
              </div>
              <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-lg p-4 text-center`}>
                <div className="text-3xl font-bold">{userStats.draws}</div>
                <div className="text-sm">Unentschieden</div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-xl p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{userStats.winStreak >= 10 ? '🔥' : userStats.winStreak >= 5 ? '⚡' : userStats.winStreak >= 3 ? '💪' : '🎯'}</span>
                  <div>
                    <div className="text-2xl font-bold">
                      {userStats.winStreak || 0} Siege in Folge
                    </div>
                    <div className="text-sm opacity-80">
                      Rekord: {userStats.bestWinStreak || 0} Siege
                    </div>
                  </div>
                </div>
                {(() => {
                  const current = userStats.winStreak || 0;
                  const milestones = [3, 5, 10, 15, 25, 50];
                  const nextMilestone = milestones.find(m => m > current);
                  if (nextMilestone) {
                    const remaining = nextMilestone - current;
                    return (
                      <div className="text-right">
                        <div className="text-sm opacity-80">Nächster Meilenstein</div>
                        <div className="font-bold">
                          Noch {remaining} {remaining === 1 ? 'Sieg' : 'Siege'} bis {nextMilestone}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="text-right">
                      <div className="text-2xl">💎</div>
                      <div className="text-sm font-bold">Unbesiegbar!</div>
                    </div>
                  );
                })()}
              </div>
              {(() => {
                const current = userStats.winStreak || 0;
                const milestones = [3, 5, 10, 15, 25, 50];
                const nextMilestone = milestones.find(m => m > current) || 50;
                const prevMilestone = [...milestones].reverse().find(m => m <= current) || 0;
                const progress = ((current - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
                return (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1 opacity-70">
                      <span>{prevMilestone}</span>
                      <span>{nextMilestone}</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </div>

      {/* Badges Section */}
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🏆 Deine Badges
        </h3>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {userBadges.length} von {BADGES.length} Badges freigeschaltet
        </p>

        <h4 className={`text-lg font-bold mt-4 mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          📚 Quiz & Lernen
          <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
            {userBadges.filter(b => BADGES.find(badge => badge.id === b.id && badge.category === 'quiz')).length} / {BADGES.filter(b => b.category === 'quiz').length}
          </span>
        </h4>
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {BADGES.filter(b => b.category === 'quiz').map(badge => {
            const earned = userBadges.find(b => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl text-center transition-all ${
                  earned
                    ? darkMode
                      ? 'bg-gradient-to-br from-yellow-900 to-yellow-800 border-2 border-yellow-600'
                      : 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400'
                    : darkMode
                      ? 'bg-slate-700 opacity-40'
                      : 'bg-gray-100 opacity-40'
                }`}
              >
                <div className="text-5xl mb-2">{badge.icon}</div>
                <p className={`font-bold mb-1 ${earned ? darkMode ? 'text-yellow-200' : 'text-yellow-800' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {badge.name}
                </p>
                <p className={`text-xs ${earned ? darkMode ? 'text-yellow-300' : 'text-yellow-700' : darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                  {badge.description}
                </p>
                {earned && (
                  <p className={`text-xs mt-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    ✓ Erhalten
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <h4 className={`text-lg font-bold mt-6 mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🏊 Schwimm-Challenge
          <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
            {userBadges.filter(b => BADGES.find(badge => badge.id === b.id && badge.category === 'swim')).length} / {BADGES.filter(b => b.category === 'swim').length}
          </span>
        </h4>
        <div className="grid md:grid-cols-4 gap-4">
          {BADGES.filter(b => b.category === 'swim').map(badge => {
            const earned = userBadges.find(b => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl text-center transition-all ${
                  earned
                    ? darkMode
                      ? 'bg-gradient-to-br from-cyan-900 to-blue-800 border-2 border-cyan-600'
                      : 'bg-gradient-to-br from-cyan-100 to-blue-200 border-2 border-cyan-400'
                    : darkMode
                      ? 'bg-slate-700 opacity-40'
                      : 'bg-gray-100 opacity-40'
                }`}
              >
                <div className="text-5xl mb-2">{badge.icon}</div>
                <p className={`font-bold mb-1 ${earned ? darkMode ? 'text-cyan-200' : 'text-cyan-800' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {badge.name}
                </p>
                <p className={`text-xs ${earned ? darkMode ? 'text-cyan-300' : 'text-cyan-700' : darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                  {badge.description}
                </p>
                {earned && (
                  <p className={`text-xs mt-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    ✓ Erhalten
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <Star className="mr-2 text-yellow-500" />
          Bestenliste
        </h3>
        <div className="space-y-2">
          {leaderboard.map((player, idx) => (
            <div key={player.name} className={`flex items-center justify-between p-4 rounded-lg ${
              player.name === user.name ? darkMode ? 'bg-blue-900/50 border-2 border-blue-500' : 'bg-blue-50 border-2 border-blue-500' : darkMode ? 'bg-slate-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`text-2xl font-bold ${
                  idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-600' : darkMode ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {idx + 1}.
                </div>
                <div>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{player.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {player.wins}S • {player.losses}N • {player.draws}U
                  </p>
                </div>
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{player.points}</div>
            </div>
          ))}
        </div>
      </div>

      {userStats && userStats.categoryStats && Object.entries(userStats.categoryStats).some(([catId, stat]) => {
        const hasCategory = CATEGORIES.some(c => c.id === catId);
        return hasCategory && stat && typeof stat === 'object' && typeof stat.total === 'number';
      }) && (
        <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📈 Performance nach Kategorie</h3>
          <div className="space-y-3">
            {Object.entries(userStats.categoryStats).map(([catId, stats]) => {
              const cat = CATEGORIES.find(c => c.id === catId);
              if (!cat || !stats || typeof stats !== 'object' || typeof stats.total !== 'number') {
                return null;
              }
              const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <div key={catId} className={`border rounded-lg p-4 ${darkMode ? 'border-slate-600' : ''}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`${cat.color} text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl`}>
                        {cat.icon}
                      </div>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{cat.name}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stats.correct}/{stats.total} richtig
                        </p>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{percentage}%</div>
                  </div>
                  <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-2`}>
                    <div
                      className={`h-2 rounded-full ${cat.color}`}
                      style={{ width: `${percentage}%` }}
                    />
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

export default StatsView;
