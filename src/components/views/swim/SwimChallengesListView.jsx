import React from 'react';

const FILTER_CATEGORIES = [
  { id: 'alle', label: '🎯 Alle' },
  { id: 'distanz', label: '🌊 Distanz' },
  { id: 'sprint', label: '⚡ Sprint' },
  { id: 'ausdauer', label: '💪 Ausdauer' },
  { id: 'regelmaessigkeit', label: '📅 Regelmäßigkeit' },
  { id: 'technik', label: '🏊 Technik' },
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
    <div className="flex gap-2 flex-wrap mb-4">
      {FILTER_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSwimChallengeFilter(cat.id)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            swimChallengeFilter === cat.id
              ? 'bg-cyan-500 text-white'
              : darkMode
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {cat.label}
        </button>
      ))}
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
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 shadow-lg ${
              isCompleted ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{challenge.icon}</span>
                <div>
                  <h4
                    className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                  >
                    {challenge.name}
                    {isCompleted && <span className="text-green-500">✓</span>}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {challenge.description}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  isCompleted
                    ? darkMode
                      ? 'bg-green-900 text-green-300'
                      : 'bg-green-100 text-green-700'
                    : darkMode
                      ? 'bg-cyan-900 text-cyan-300'
                      : 'bg-cyan-100 text-cyan-700'
                }`}
              >
                {isCompleted ? '✓ ' : '+'}
                {challenge.points} Pkt
              </span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fortschritt</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {challenge.type === 'distance' || challenge.type === 'single_distance'
                    ? `${(progress.current / 1000).toFixed(1)} / ${(challenge.target / 1000).toFixed(1)} km`
                    : `${progress.current} / ${challenge.target} ${challenge.unit}`}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-cyan-500'}`}
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
              className={`mt-4 w-full py-2 rounded-lg font-medium transition-all ${
                isCompleted
                  ? darkMode
                    ? 'bg-green-900 text-green-300'
                    : 'bg-green-100 text-green-700'
                  : isActive
                    ? darkMode
                      ? 'bg-cyan-900 text-cyan-300'
                      : 'bg-cyan-100 text-cyan-700'
                    : darkMode
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              {isCompleted ? '🏆 Abgeschlossen!' : isActive ? '✓ Aktiv' : 'Challenge starten'}
            </button>
          </div>
        );
      })}
    </div>
  </div>
);

export default SwimChallengesListView;
