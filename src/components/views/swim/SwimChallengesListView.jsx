import React from 'react';
import { Target, Waves, Zap, Dumbbell, Calendar, Activity, Check, Trophy, Plus } from 'lucide-react';

const FILTER_CATEGORIES = [
  { id: 'alle', label: 'Alle', Icon: Target },
  { id: 'distanz', label: 'Distanz', Icon: Waves },
  { id: 'sprint', label: 'Sprint', Icon: Zap },
  { id: 'ausdauer', label: 'Ausdauer', Icon: Dumbbell },
  { id: 'regelmaessigkeit', label: 'Regelmäßigkeit', Icon: Calendar },
  { id: 'technik', label: 'Technik', Icon: Activity },
];

const SwimChallengesListView = ({
  darkMode,
  user,
  SWIM_CHALLENGES,
  swimChallengeFilter,
  setSwimChallengeFilter,
  swimSessions,
  calculateChallengeProgress,
  activeSwimChallenges,
  saveActiveSwimChallenges,
}) => (
  <div className="space-y-4">
    <div className="glass-card rounded-2xl p-3">
      <div className="flex gap-2 flex-wrap">
        {FILTER_CATEGORIES.map(({ id, label, Icon }) => {
          const isActive = swimChallengeFilter === id;
          return (
            <button
              key={id}
              onClick={() => setSwimChallengeFilter(id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm'
                  : darkMode
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      {SWIM_CHALLENGES.filter(
        (c) => swimChallengeFilter === 'alle' || c.category === swimChallengeFilter,
      ).map((challenge) => {
        const progress = calculateChallengeProgress(challenge, swimSessions, user?.id);
        const isCompleted = progress.percent >= 100;
        const isActive = activeSwimChallenges.includes(challenge.id);

        return (
          <div
            key={challenge.id}
            className={`glass-card rounded-2xl p-5 relative overflow-hidden ${
              isCompleted ? 'ring-2 ring-emerald-400/70' : ''
            }`}
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                  : isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    : 'bg-gradient-to-r from-slate-400/40 to-slate-500/40'
              }`}
            />
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    darkMode ? 'bg-cyan-900/60' : 'bg-cyan-100'
                  }`}
                >
                  {challenge.icon}
                </div>
                <div>
                  <h4 className="font-bold flex items-center gap-2 text-gray-800">
                    {challenge.name}
                    {isCompleted && (
                      <Check
                        size={16}
                        className={darkMode ? 'text-emerald-300' : 'text-emerald-600'}
                      />
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                  isCompleted
                    ? darkMode
                      ? 'bg-emerald-900/60 text-emerald-300'
                      : 'bg-emerald-100 text-emerald-700'
                    : darkMode
                      ? 'bg-cyan-900/60 text-cyan-300'
                      : 'bg-cyan-100 text-cyan-700'
                }`}
              >
                {isCompleted ? '✓ ' : '+'}
                {challenge.points} Pkt
              </span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Fortschritt</span>
                <span className="text-gray-600">
                  {challenge.type === 'distance' || challenge.type === 'single_distance'
                    ? `${(progress.current / 1000).toFixed(1)} / ${(challenge.target / 1000).toFixed(1)} km`
                    : `${progress.current} / ${challenge.target} ${challenge.unit}`}
                </span>
              </div>
              <div
                className={`h-2 rounded-full overflow-hidden ${
                  darkMode ? 'bg-white/10' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`h-full transition-all ${
                    isCompleted
                      ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, progress.percent)}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (!isActive) {
                  saveActiveSwimChallenges([...activeSwimChallenges, challenge.id]);
                }
              }}
              disabled={isActive || isCompleted}
              className={`mt-4 w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                isCompleted
                  ? darkMode
                    ? 'bg-emerald-900/60 text-emerald-300'
                    : 'bg-emerald-100 text-emerald-700'
                  : isActive
                    ? darkMode
                      ? 'bg-cyan-900/60 text-cyan-300'
                      : 'bg-cyan-100 text-cyan-700'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-sm'
              }`}
            >
              {isCompleted ? (
                <>
                  <Trophy size={16} /> Abgeschlossen
                </>
              ) : isActive ? (
                <>
                  <Check size={16} /> Aktiv
                </>
              ) : (
                <>
                  <Plus size={16} /> Challenge starten
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  </div>
);

export default SwimChallengesListView;
