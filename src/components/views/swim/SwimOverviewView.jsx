import React from 'react';

const SwimOverviewView = ({
  darkMode,
  user,
  swimSessions,
  SWIM_CHALLENGES,
  calculateChallengeProgress,
  calculateSwimPoints,
  getSwimLevel,
  getAgeHandicap,
  setCurrentView,
}) => {
  const mySessions = swimSessions.filter((s) => s.user_id === user?.id && s.confirmed);
  const totalDistance = mySessions.reduce((sum, s) => sum + (s.distance || 0), 0);
  const totalTime = mySessions.reduce((sum, s) => sum + (s.time_minutes || 0), 0);
  const completedChallenges = SWIM_CHALLENGES.filter((ch) => {
    const progress = calculateChallengeProgress(ch, swimSessions, user?.id);
    return progress.percent >= 100;
  });
  const points = calculateSwimPoints(
    mySessions,
    completedChallenges.map((c) => c.id),
  );
  const currentLevel = getSwimLevel(points.total);
  const progressPercent = currentLevel.nextLevel
    ? ((points.total - currentLevel.minPoints) /
        (currentLevel.nextLevel.minPoints - currentLevel.minPoints)) *
      100
    : 100;

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">🏊</span>
            <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {totalDistance >= 1000 ? `${(totalDistance / 1000).toFixed(1)} km` : `${totalDistance} m`}
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gesamtdistanz</p>
        </div>
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">⏱️</span>
            <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {totalTime >= 60 ? `${Math.floor(totalTime / 60)}h ${totalTime % 60}m` : `${totalTime} min`}
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Trainingszeit</p>
        </div>
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">🎯</span>
            <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {completedChallenges.length}
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Challenges abgeschlossen
          </p>
        </div>
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">⭐</span>
            <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {points.total}
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Punkte</p>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dein Level</h3>
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentLevel.color} flex items-center justify-center text-3xl`}
          >
            {currentLevel.icon}
          </div>
          <div className="flex-1">
            <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {currentLevel.name}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentLevel.nextLevel
                ? `${points.total} / ${currentLevel.nextLevel.minPoints} Punkte bis ${currentLevel.nextLevel.name}`
                : `${points.total} Punkte - Maximales Level erreicht! 🎉`}
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${currentLevel.color} transition-all`}
                style={{ width: `${Math.min(100, progressPercent)}%` }}
              />
            </div>
          </div>
        </div>
        <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex justify-between">
              <span>Distanz-Punkte (1 Pkt/100m):</span>
              <span className="font-medium">{points.distancePoints}</span>
            </div>
            <div className="flex justify-between">
              <span>Zeit-Punkte (0.5 Pkt/Min):</span>
              <span className="font-medium">{points.timePoints}</span>
            </div>
            <div className="flex justify-between">
              <span>Challenge-Punkte:</span>
              <span className="font-medium">{points.challengePoints}</span>
            </div>
          </div>
        </div>
        {user?.birthDate && getAgeHandicap(user.birthDate) > 0 && (
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <div
              className={`flex items-center gap-2 text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}
            >
              <span>🎂</span>
              <span>
                Alters-Handicap aktiv:{' '}
                <strong>{Math.round(getAgeHandicap(user.birthDate) * 100)}% Zeitbonus</strong> bei
                Sprint-Challenges
              </span>
            </div>
          </div>
        )}
        {!user?.birthDate && (
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <div
              className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
            >
              <span>💡</span>
              <span>
                Tipp: Trage dein{' '}
                <button
                  onClick={() => setCurrentView('profile')}
                  className="underline text-cyan-500 hover:text-cyan-400"
                >
                  Geburtsdatum im Profil
                </button>{' '}
                ein für Alters-Handicap bei Sprint-Challenges (ab 40 Jahren).
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SwimOverviewView;
