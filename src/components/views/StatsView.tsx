import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, getAvatarById, getLevel, getLevelProgress } from '../../data/constants';
import AvatarBadge from '../ui/AvatarBadge';

interface CategoryStats {
  correct: number;
  total: number;
}

interface UserStats {
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestWinStreak: number;
  categoryStats?: Record<string, CategoryStats>;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

interface UserBadge {
  id: string;
  [key: string]: unknown;
}

interface AppUser {
  id: string;
  name: string;
  role?: string;
  avatar?: string | null;
}

interface StatsRow {
  wins?: number;
  losses?: number;
  draws?: number;
  total?: number;
  totalXp?: number;
}

interface StatsViewProps {
  userStats: UserStats | null;
  BADGES: Badge[];
  userBadges: UserBadge[];
  allUsers: AppUser[];
  statsByUserId: Record<string, StatsRow>;
}

interface LeaderRow {
  id: string;
  name: string;
  avatar: string | null;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  totalXp: number;
  level: number;
}

const getShortName = (name: string | null | undefined): string => {
  const trimmed = String(name || '').trim();
  if (!trimmed) return '';
  return trimmed.split(/\s+/)[0];
};

const StatsView: React.FC<StatsViewProps> = ({ userStats, BADGES, userBadges, allUsers, statsByUserId }) => {
  const auth = useAuth();
  const app = useApp();
  const user = auth?.user;
  const darkMode = app?.darkMode;

  const leaderboard = useMemo<LeaderRow[]>(() => {
    const pool: AppUser[] = [];
    const seen = new Set<string>();
    (allUsers || []).forEach((u) => {
      if (u?.id && !seen.has(u.id)) {
        pool.push(u);
        seen.add(u.id);
      }
    });
    if (user?.id && !seen.has(user.id)) {
      pool.push(user as AppUser);
    }

    const rows: LeaderRow[] = pool
      .filter((u) => u.role !== 'admin')
      .map((u) => {
        const s = statsByUserId?.[u.id] || {};
        const wins = s.wins || 0;
        const losses = s.losses || 0;
        const draws = s.draws || 0;
        const totalXp = s.totalXp || 0;
        return {
          id: u.id,
          name: u.name,
          avatar: u.avatar || null,
          wins,
          losses,
          draws,
          points: wins * 3 + draws,
          totalXp,
          level: getLevel(totalXp)
        };
      })
      .filter((r) => r.points > 0 || r.wins + r.losses + r.draws > 0 || r.id === user?.id)
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.totalXp - a.totalXp;
      });

    return rows;
  }, [allUsers, statsByUserId, user]);

  const rankLabel = (idx: number): string => {
    if (idx === 0) return '🥇';
    if (idx === 1) return '🥈';
    if (idx === 2) return '🥉';
    return `${idx + 1}.`;
  };

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white rounded-2xl p-8 shadow-lg`}>
        <h2 className="text-3xl font-bold mb-4">📊 Deine Statistiken</h2>
        {userStats && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">{userStats.wins}</div>
                <div className="text-sm opacity-90">Siege</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">{userStats.losses}</div>
                <div className="text-sm opacity-90">Niederlagen</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">{userStats.draws}</div>
                <div className="text-sm opacity-90">Unentschieden</div>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
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
                  const nextMilestone = milestones.find((m) => m > current);
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
                const nextMilestone = milestones.find((m) => m > current) || 50;
                const prevMilestone = [...milestones].reverse().find((m) => m <= current) || 0;
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

      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <Star className="mr-2 text-yellow-500" />
            Bestenliste
          </h3>
          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Sieg +3 Pkt. • Unentschieden +1 Pkt.
          </span>
        </div>
        {leaderboard.length === 0 ? (
          <p className={`text-sm text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Noch keine Quizduelle gespielt — sei der Erste!
          </p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((player, idx) => {
              const isSelf = player.id === user?.id;
              const total = player.wins + player.losses + player.draws;
              const winRate = total > 0 ? Math.round((player.wins / total) * 100) : 0;
              const progress = Math.round(getLevelProgress(player.totalXp) * 100);
              return (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isSelf
                      ? darkMode
                        ? 'bg-blue-900/40 border border-blue-500/60'
                        : 'bg-blue-50 border border-blue-400'
                      : darkMode
                        ? 'bg-slate-700/50 border border-transparent'
                        : 'bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className={`w-10 text-center text-xl font-bold ${
                    idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-500' : darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {rankLabel(idx)}
                  </div>
                  <AvatarBadge
                    avatar={player.avatar ? getAvatarById(player.avatar) : null}
                    size="md"
                    className={isSelf ? 'ring-2 ring-blue-400/60' : ''}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`} title={player.name}>
                        {getShortName(player.name)}
                      </p>
                      {isSelf && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${darkMode ? 'bg-blue-500/30 text-blue-200' : 'bg-blue-500 text-white'}`}>
                          DU
                        </span>
                      )}
                      <span className="text-[10px] font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full px-1.5 py-0.5 leading-none">
                        Lv.{player.level}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span>{player.wins}S · {player.losses}N · {player.draws}U</span>
                      <span className="opacity-60">·</span>
                      <span>{winRate}% Quote</span>
                    </div>
                    <div className={`mt-1.5 h-1 rounded-full overflow-hidden ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{player.points}</div>
                    <div className={`text-[10px] uppercase tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Pkt.</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🏆 Deine Badges
        </h3>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {userBadges.length} von {BADGES.length} Badges freigeschaltet
        </p>

        <h4 className={`text-lg font-bold mt-4 mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          📚 Quiz & Lernen
          <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
            {userBadges.filter((b) => BADGES.find((badge) => badge.id === b.id && badge.category === 'quiz')).length} / {BADGES.filter((b) => b.category === 'quiz').length}
          </span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {BADGES.filter((b) => b.category === 'quiz').map((badge) => {
            const earned = userBadges.find((b) => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl text-center transition-all ${
                  earned
                    ? darkMode
                      ? 'bg-gradient-to-br from-yellow-900 to-yellow-800 border-2 border-yellow-600'
                      : 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400'
                    : darkMode
                      ? 'bg-slate-700/50 opacity-40'
                      : 'bg-gray-100 opacity-40'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className={`font-bold text-sm mb-1 ${earned ? (darkMode ? 'text-yellow-200' : 'text-yellow-800') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                  {badge.name}
                </p>
                <p className={`text-xs ${earned ? (darkMode ? 'text-yellow-300' : 'text-yellow-700') : (darkMode ? 'text-gray-600' : 'text-gray-500')}`}>
                  {badge.description}
                </p>
                {earned && (
                  <p className={`text-xs mt-2 font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
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
            {userBadges.filter((b) => BADGES.find((badge) => badge.id === b.id && badge.category === 'swim')).length} / {BADGES.filter((b) => b.category === 'swim').length}
          </span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BADGES.filter((b) => b.category === 'swim').map((badge) => {
            const earned = userBadges.find((b) => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl text-center transition-all ${
                  earned
                    ? darkMode
                      ? 'bg-gradient-to-br from-cyan-900 to-blue-800 border-2 border-cyan-600'
                      : 'bg-gradient-to-br from-cyan-100 to-blue-200 border-2 border-cyan-400'
                    : darkMode
                      ? 'bg-slate-700/50 opacity-40'
                      : 'bg-gray-100 opacity-40'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className={`font-bold text-sm mb-1 ${earned ? (darkMode ? 'text-cyan-200' : 'text-cyan-800') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                  {badge.name}
                </p>
                <p className={`text-xs ${earned ? (darkMode ? 'text-cyan-300' : 'text-cyan-700') : (darkMode ? 'text-gray-600' : 'text-gray-500')}`}>
                  {badge.description}
                </p>
                {earned && (
                  <p className={`text-xs mt-2 font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    ✓ Erhalten
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {userStats && userStats.categoryStats && Object.entries(userStats.categoryStats).some(([catId, stat]) => {
        const hasCategory = (CATEGORIES as Array<{ id: string }>).some((c) => c.id === catId);
        return hasCategory && stat && typeof stat === 'object' && typeof stat.total === 'number';
      }) && (
        <div className="glass-card rounded-2xl p-5">
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📈 Performance nach Kategorie</h3>
          <div className="space-y-3">
            {Object.entries(userStats.categoryStats).map(([catId, stats]) => {
              const cat = (CATEGORIES as Array<{ id: string; name: string; icon: string; color: string }>).find((c) => c.id === catId);
              if (!cat || !stats || typeof stats !== 'object' || typeof stats.total !== 'number') {
                return null;
              }
              const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <div key={catId} className={`rounded-xl p-3 ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
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
                  <div className={`w-full ${darkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded-full h-2`}>
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
