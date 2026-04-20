import React from 'react';

const TABS = [
  { id: 'overview', label: 'Übersicht', icon: '📊' },
  { id: 'challenges', label: 'Challenges', icon: '🎯' },
  { id: 'plans', label: 'Trainingsplaene', icon: '' },
  { id: 'add', label: 'Einheit', icon: '➕' },
  { id: 'leaderboard', label: 'Bestenliste', icon: '🏆' },
  { id: 'battle', label: 'Team-Battle', icon: '⚔️' },
];

const SwimHero = ({ darkMode, swimChallengeView, setSwimChallengeView }) => (
  <div
    className={`${
      darkMode
        ? 'bg-gradient-to-r from-cyan-900 to-blue-900'
        : 'bg-gradient-to-r from-cyan-500 to-blue-600'
    } text-white rounded-xl p-6 shadow-lg`}
  >
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">🏊 Schwimm-Challenge</h2>
        <p className="opacity-90 mt-1">Trainiere, sammle Punkte und miss dich mit anderen!</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSwimChallengeView(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              swimChallengeView === tab.id
                ? 'bg-white text-cyan-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {tab.icon && `${tab.icon} `}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default SwimHero;
