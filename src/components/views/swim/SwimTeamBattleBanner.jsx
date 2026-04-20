import React from 'react';

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
    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
      <div className="text-center mb-4">
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          ⚔️ TEAM-BATTLE: {currentMonth}
        </h3>
        {leading !== 'tie' && (
          <p
            className={`text-sm mt-1 ${
              leading === 'azubis'
                ? darkMode
                  ? 'text-cyan-400'
                  : 'text-cyan-600'
                : darkMode
                  ? 'text-orange-400'
                  : 'text-orange-600'
            }`}
          >
            {leading === 'azubis' ? '👨‍🎓 Azubis führen!' : '👨‍🏫 Trainer führen!'}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="text-center flex-1">
          <div className="text-3xl mb-1">👨‍🎓</div>
          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Team Azubis</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            {battleStats.azubis.points} Pkt
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Swim {battleStats.azubis.swimPoints} + XP/Arena {battleStats.azubis.xpPoints}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {battleStats.azubis.memberList.length} Teilnehmer
          </div>
        </div>
        <div className="text-4xl font-bold text-gray-400">VS</div>
        <div className="text-center flex-1">
          <div className="text-3xl mb-1">👨‍🏫</div>
          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Team Trainer</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
            {battleStats.trainer.points} Pkt
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Swim {battleStats.trainer.swimPoints} + XP/Arena {battleStats.trainer.xpPoints}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {battleStats.trainer.memberList.length} Teilnehmer
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
          <div
            className="bg-cyan-500 transition-all"
            style={{ width: `${battleStats.azubis.percent}%` }}
          />
          <div
            className="bg-orange-500 transition-all"
            style={{ width: `${battleStats.trainer.percent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-sm">
          <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>
            {battleStats.azubis.percent.toFixed(0)}%
          </span>
          <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>
            {battleStats.trainer.percent.toFixed(0)}%
          </span>
        </div>
      </div>
      <div
        className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} grid grid-cols-2 gap-4 text-center text-sm`}
      >
        <div>
          <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Gesamtdistanz</div>
          <div className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            {(battleStats.azubis.distance / 1000).toFixed(1)} km
          </div>
        </div>
        <div>
          <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Gesamtdistanz</div>
          <div className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
            {(battleStats.trainer.distance / 1000).toFixed(1)} km
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwimTeamBattleBanner;
