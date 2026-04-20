import React from 'react';
import { Waves, Clock, Target, Star, Cake, Lightbulb } from 'lucide-react';

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

  const statCard = (Icon, value, label, accent) => (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-2">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            darkMode ? `${accent.darkBg} ${accent.darkText}` : `${accent.lightBg} ${accent.lightText}`
          }`}
        >
          <Icon size={22} />
        </div>
        <span className={`text-2xl font-bold ${darkMode ? accent.darkText : accent.lightText}`}>
          {value}
        </span>
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );

  const cyanAccent = {
    darkBg: 'bg-cyan-900/60',
    darkText: 'text-cyan-300',
    lightBg: 'bg-cyan-100',
    lightText: 'text-cyan-600',
  };
  const blueAccent = {
    darkBg: 'bg-blue-900/60',
    darkText: 'text-blue-300',
    lightBg: 'bg-blue-100',
    lightText: 'text-blue-600',
  };
  const amberAccent = {
    darkBg: 'bg-amber-900/60',
    darkText: 'text-amber-300',
    lightBg: 'bg-amber-100',
    lightText: 'text-amber-600',
  };
  const emeraldAccent = {
    darkBg: 'bg-emerald-900/60',
    darkText: 'text-emerald-300',
    lightBg: 'bg-emerald-100',
    lightText: 'text-emerald-600',
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCard(
          Waves,
          totalDistance >= 1000 ? `${(totalDistance / 1000).toFixed(1)} km` : `${totalDistance} m`,
          'Gesamtdistanz',
          cyanAccent,
        )}
        {statCard(
          Clock,
          totalTime >= 60 ? `${Math.floor(totalTime / 60)}h ${totalTime % 60}m` : `${totalTime} min`,
          'Trainingszeit',
          blueAccent,
        )}
        {statCard(Target, completedChallenges.length, 'Challenges abgeschlossen', emeraldAccent)}
        {statCard(Star, points.total, 'Punkte', amberAccent)}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold mb-4 text-gray-800">Dein Level</h3>
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentLevel.color} flex items-center justify-center text-3xl shadow-lg`}
          >
            {currentLevel.icon}
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg text-gray-800">{currentLevel.name}</div>
            <div className="text-sm text-gray-600">
              {currentLevel.nextLevel
                ? `${points.total} / ${currentLevel.nextLevel.minPoints} Punkte bis ${currentLevel.nextLevel.name}`
                : `${points.total} Punkte - Maximales Level erreicht!`}
            </div>
            <div
              className={`mt-2 h-2 rounded-full overflow-hidden ${
                darkMode ? 'bg-white/10' : 'bg-gray-200'
              }`}
            >
              <div
                className={`h-full bg-gradient-to-r ${currentLevel.color} transition-all`}
                style={{ width: `${Math.min(100, progressPercent)}%` }}
              />
            </div>
          </div>
        </div>
        <div
          className={`mt-4 pt-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}
        >
          <div className="text-sm text-gray-600 space-y-1">
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
          <div
            className={`mt-4 pt-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}
          >
            <div
              className={`flex items-center gap-2 text-sm ${
                darkMode ? 'text-emerald-300' : 'text-emerald-700'
              }`}
            >
              <Cake size={16} />
              <span>
                Alters-Handicap aktiv:{' '}
                <strong>{Math.round(getAgeHandicap(user.birthDate) * 100)}% Zeitbonus</strong> bei
                Sprint-Challenges
              </span>
            </div>
          </div>
        )}
        {!user?.birthDate && (
          <div
            className={`mt-4 pt-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Lightbulb size={16} />
              <span>
                Tipp: Trage dein{' '}
                <button
                  onClick={() => setCurrentView('profile')}
                  className={`underline font-medium ${
                    darkMode ? 'text-cyan-300 hover:text-cyan-200' : 'text-cyan-600 hover:text-cyan-500'
                  }`}
                >
                  Geburtsdatum im Profil
                </button>{' '}
                ein für Alters-Handicap bei Sprint-Challenges (ab 40 Jahren).
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwimOverviewView;
