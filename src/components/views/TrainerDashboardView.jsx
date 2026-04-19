import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import AvatarBadge from '../ui/AvatarBadge';
import { getAvatarById, getLevel, getLevelProgress } from '../../data/constants';

const EMPTY_STATS = { wins: 0, losses: 0, draws: 0, total: 0, totalXp: 0 };

const TrainerDashboardView = ({
  allUsers,
  statsByUserId,
  theoryExamHistory,
  theoryExamHistoryLoading,
  loadTheoryExamHistory
}) => {
  const { user } = useAuth();
  const { darkMode } = useApp();

  if (!user.permissions.canViewAllStats) return null;

  const azubis = allUsers
    .filter((u) => u.role === 'azubi')
    .slice()
    .sort((a, b) => {
      const xpA = (statsByUserId[a.id]?.totalXp) || 0;
      const xpB = (statsByUserId[b.id]?.totalXp) || 0;
      if (xpB !== xpA) return xpB - xpA;
      return (a.name || '').localeCompare(b.name || '', 'de');
    });

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gradient-to-r from-indigo-900 to-purple-900' : 'bg-gradient-to-r from-indigo-500 to-purple-500'} text-white rounded-2xl p-8 text-center shadow-lg`}>
        <h2 className="text-3xl font-bold mb-2">👨‍🏫 Azubi-Übersicht</h2>
        <p className="opacity-90">Fortschritte und Leistungen deiner Azubis</p>
        <p className="opacity-75 text-sm mt-2">{azubis.length} {azubis.length === 1 ? 'Azubi' : 'Azubis'} aktiv</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {azubis.map((azubi) => {
          const stats = statsByUserId[azubi.id] || EMPTY_STATS;
          const wins = stats.wins || 0;
          const losses = stats.losses || 0;
          const draws = stats.draws || 0;
          const total = stats.total || (wins + losses + draws);
          const totalXp = stats.totalXp || 0;
          const level = getLevel(totalXp);
          const levelProgress = Math.round(getLevelProgress(totalXp) * 100);
          const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

          const azubiAttempts = (theoryExamHistory || []).filter((a) => a.user_id === azubi.id);
          const hasAttempts = azubiAttempts.length > 0;
          const best = hasAttempts
            ? azubiAttempts.reduce((a, b) => (a.percentage > b.percentage ? a : b))
            : null;
          const last = hasAttempts ? azubiAttempts[0] : null;

          return (
            <div key={azubi.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <AvatarBadge
                  avatar={azubi.avatar ? getAvatarById(azubi.avatar) : null}
                  size="lg"
                  className="ring-2 ring-cyan-400/40"
                />
                <div className="min-w-0 flex-1">
                  <p className={`font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubi.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full px-2 py-0.5 leading-none">
                      Lv.{level}
                    </span>
                    <div className={`flex-1 h-1 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all"
                        style={{ width: `${levelProgress}%` }}
                      />
                    </div>
                  </div>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {totalXp.toLocaleString('de-DE')} XP
                  </p>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-slate-700/60' : 'bg-gray-100'} rounded-xl p-3 mb-3`}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className={`text-xs uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Siegesrate</span>
                  <span className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{winRate}%</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${winRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-slate-700/60' : 'bg-gray-100'}`}>
                  <div className={`text-base font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{wins}</div>
                  <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Siege</div>
                </div>
                <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-slate-700/60' : 'bg-gray-100'}`}>
                  <div className={`text-base font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{losses}</div>
                  <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Niederl.</div>
                </div>
                <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-slate-700/60' : 'bg-gray-100'}`}>
                  <div className={`text-base font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{draws}</div>
                  <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unent.</div>
                </div>
                <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-slate-700/60' : 'bg-gray-100'}`}>
                  <div className={`text-base font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{total}</div>
                  <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gesamt</div>
                </div>
              </div>

              <div className={`pt-3 border-t ${darkMode ? 'border-slate-600/60' : 'border-gray-200'}`}>
                <p className={`text-xs font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>📝 Prüfungssimulator</p>
                {!hasAttempts ? (
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Noch keine Prüfungen absolviert</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className={`text-base font-bold ${best.passed ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-amber-400' : 'text-amber-600')}`}>
                        {best.percentage}%
                      </div>
                      <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bestes</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-base font-bold ${last.passed ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
                        {last.percentage}%
                      </div>
                      <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Letztes</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-base font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{azubiAttempts.length}</div>
                      <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Versuche</div>
                    </div>
                  </div>
                )}
              </div>

              {azubi.trainingEnd && (
                <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-slate-600/60' : 'border-gray-200'}`}>
                  <p className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    🎓 Ausbildungsende: {new Date(azubi.trainingEnd).toLocaleDateString('de-DE')}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {azubis.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 text-center py-12 glass-card rounded-2xl">
            <div className="text-6xl mb-4">📚</div>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Noch keine Azubis registriert
            </p>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>📝 Prüfungsverlauf (alle Azubis)</h3>
          <button
            onClick={loadTheoryExamHistory}
            className={`text-sm px-3 py-1.5 rounded-lg transition ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
          >
            Aktualisieren
          </button>
        </div>
        {theoryExamHistoryLoading ? (
          <p className={`text-sm text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Laden…</p>
        ) : !theoryExamHistory || theoryExamHistory.length === 0 ? (
          <p className={`text-sm text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Noch keine Ergebnisse vorhanden</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {theoryExamHistory.map((attempt) => (
              <div
                key={attempt.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 gap-2 ${darkMode ? 'bg-slate-700/60' : 'bg-gray-50'}`}
              >
                <span className={`text-sm font-medium flex-1 min-w-0 truncate ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{attempt.user_name}</span>
                <span className={`text-sm font-bold whitespace-nowrap ${attempt.passed ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
                  {attempt.passed ? '✅' : '❌'} {attempt.percentage}% ({attempt.correct}/{attempt.total})
                </span>
                {attempt.keyword_mode && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-violet-900/60 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>🧠</span>
                )}
                <span className={`text-xs whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
