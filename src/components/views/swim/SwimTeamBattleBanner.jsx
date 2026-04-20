import React from 'react';
import { Swords, GraduationCap, Briefcase } from 'lucide-react';

const SwimTeamBattleBanner = ({
  darkMode,
  swimCurrentMonthBattleStats,
  swimCurrentMonthLabel,
  calculateTeamBattleStats,
  allUsers,
}) => {
  const battleStats = swimCurrentMonthBattleStats || calculateTeamBattleStats([], {}, allUsers);
  const currentMonth =
    swimCurrentMonthLabel ||
    new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }).toUpperCase();
  const leading =
    battleStats.azubis.points > battleStats.trainer.points
      ? 'azubis'
      : battleStats.trainer.points > battleStats.azubis.points
        ? 'trainer'
        : 'tie';

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          leading === 'azubis'
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
            : leading === 'trainer'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500'
              : 'bg-gradient-to-r from-slate-400 to-slate-500'
        }`}
      />
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold flex items-center justify-center gap-2 text-gray-800">
          <Swords size={20} />
          Team-Battle: {currentMonth}
        </h3>
        {leading !== 'tie' && (
          <p
            className={`text-sm mt-1 font-semibold ${
              leading === 'azubis'
                ? darkMode
                  ? 'text-cyan-300'
                  : 'text-cyan-600'
                : darkMode
                  ? 'text-orange-300'
                  : 'text-orange-600'
            }`}
          >
            {leading === 'azubis' ? 'Azubis führen!' : 'Trainer führen!'}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="text-center flex-1">
          <div className="flex justify-center mb-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-cyan-900/60 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
              }`}
            >
              <GraduationCap size={24} />
            </div>
          </div>
          <div className="font-bold text-gray-800">Team Azubis</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
            {battleStats.azubis.points} Pkt
          </div>
          <div className="text-xs text-gray-500">
            Swim {battleStats.azubis.swimPoints} + XP/Arena {battleStats.azubis.xpPoints}
          </div>
          <div className="text-xs text-gray-500">
            {battleStats.azubis.memberList.length} Teilnehmer
          </div>
        </div>
        <div className="text-4xl font-bold text-gray-400">VS</div>
        <div className="text-center flex-1">
          <div className="flex justify-center mb-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-orange-900/60 text-orange-300' : 'bg-orange-100 text-orange-700'
              }`}
            >
              <Briefcase size={22} />
            </div>
          </div>
          <div className="font-bold text-gray-800">Team Trainer</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
            {battleStats.trainer.points} Pkt
          </div>
          <div className="text-xs text-gray-500">
            Swim {battleStats.trainer.swimPoints} + XP/Arena {battleStats.trainer.xpPoints}
          </div>
          <div className="text-xs text-gray-500">
            {battleStats.trainer.memberList.length} Teilnehmer
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div
          className={`flex h-4 rounded-full overflow-hidden ${
            darkMode ? 'bg-white/10' : 'bg-gray-200'
          }`}
        >
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
            style={{ width: `${battleStats.azubis.percent}%` }}
          />
          <div
            className="bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
            style={{ width: `${battleStats.trainer.percent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-sm">
          <span className={darkMode ? 'text-cyan-300' : 'text-cyan-600'}>
            {battleStats.azubis.percent.toFixed(0)}%
          </span>
          <span className={darkMode ? 'text-orange-300' : 'text-orange-600'}>
            {battleStats.trainer.percent.toFixed(0)}%
          </span>
        </div>
      </div>
      <div
        className={`mt-4 pt-4 border-t ${
          darkMode ? 'border-white/10' : 'border-gray-200'
        } grid grid-cols-2 gap-4 text-center text-sm`}
      >
        <div>
          <div className="text-gray-500">Gesamtdistanz</div>
          <div className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
            {(battleStats.azubis.distance / 1000).toFixed(1)} km
          </div>
        </div>
        <div>
          <div className="text-gray-500">Gesamtdistanz</div>
          <div className={`font-bold ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
            {(battleStats.trainer.distance / 1000).toFixed(1)} km
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwimTeamBattleBanner;
