import React from 'react';
import {
  Waves,
  BarChart3,
  Target,
  ListChecks,
  Plus,
  Trophy,
  Swords,
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Übersicht', Icon: BarChart3 },
  { id: 'challenges', label: 'Challenges', Icon: Target },
  { id: 'plans', label: 'Pläne', Icon: ListChecks },
  { id: 'add', label: 'Einheit', Icon: Plus },
  { id: 'leaderboard', label: 'Bestenliste', Icon: Trophy },
  { id: 'battle', label: 'Team-Battle', Icon: Swords },
];

const SwimHero = ({ darkMode, swimChallengeView, setSwimChallengeView, stats }) => (
  <div
    className={`${
      darkMode
        ? 'bg-gradient-to-r from-cyan-900 via-slate-900 to-blue-900'
        : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500'
    } text-white rounded-2xl p-8 shadow-lg`}
  >
    <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
      <Waves size={30} />
      Schwimm-Challenge
    </h2>
    <p className="opacity-90">Trainiere, sammle Punkte und miss dich mit anderen!</p>

    {stats && (
      <div className="flex flex-wrap gap-3 mt-4">
        <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
          <span className="font-bold text-lg">{stats.totalDistanceLabel}</span>
          <span className="opacity-80 ml-2">Gesamt</span>
        </div>
        <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
          <span className="font-bold text-lg">{stats.completedChallenges}</span>
          <span className="opacity-80 ml-2">Challenges</span>
        </div>
        <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
          <span className="font-bold text-lg">{stats.points}</span>
          <span className="opacity-80 ml-2">Punkte</span>
        </div>
        {stats.levelName && (
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
            <span className="font-bold text-lg">{stats.levelName}</span>
            <span className="opacity-80 ml-2">Level</span>
          </div>
        )}
      </div>
    )}

    <div className="flex gap-2 flex-wrap mt-5">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => setSwimChallengeView(id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            swimChallengeView === id
              ? 'bg-white text-cyan-600 shadow-sm'
              : 'bg-white/15 hover:bg-white/25 backdrop-blur-sm'
          }`}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  </div>
);

export default SwimHero;
