import React from 'react';
import {
  extractTrainingPlanSelectionFromNotes,
  stripTrainingPlanTagFromNotes,
} from '../../../lib/swim/swimPlanNotes';
import {
  getPlanUnits as getPlanUnitsShared,
  getPlanUnitLabel as getPlanUnitLabelShared,
} from '../../../lib/swim/swimPlans';

const SwimTrainerConfirmationsView = ({
  darkMode,
  user,
  pendingSwimConfirmations,
  SWIM_STYLES,
  SWIM_TRAINING_PLANS,
  confirmSwimSession,
  rejectSwimSession,
  withdrawSwimSession,
}) => {
  if (
    !(user?.role === 'trainer' || user?.role === 'ausbilder' || user?.permissions?.canViewAllStats) ||
    pendingSwimConfirmations.length === 0
  ) {
    return null;
  }

  const getTrainingPlanById = (planId) =>
    SWIM_TRAINING_PLANS.find((plan) => plan.id === planId) || null;

  const isOwnPendingSwimSession = (sessionInput) => {
    if (!sessionInput?.user_id || !user?.id) return false;
    return String(sessionInput.user_id) === String(user.id);
  };

  return (
    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
      <h3
        className={`font-bold text-lg mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}
      >
        ✅ Zu bestätigende Einheiten
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {pendingSwimConfirmations.length}
        </span>
      </h3>
      <div className="space-y-3">
        {pendingSwimConfirmations.map((session) => {
          const isOwnSession = isOwnPendingSwimSession(session);
          const { trainingPlanId, trainingPlanUnitId } = extractTrainingPlanSelectionFromNotes(
            session.notes,
          );
          const trainingPlan = trainingPlanId ? getTrainingPlanById(trainingPlanId) : null;
          const trainingPlanUnits = getPlanUnitsShared(trainingPlan);
          const trainingPlanUnit = trainingPlanUnitId
            ? trainingPlanUnits.find((unit) => unit.id === trainingPlanUnitId) || null
            : null;
          const trainingPlanUnitIndex = trainingPlanUnit
            ? trainingPlanUnits.findIndex((unit) => unit.id === trainingPlanUnit.id)
            : -1;
          const cleanNotes = stripTrainingPlanTagFromNotes(session.notes);

          return (
            <div
              key={session.id}
              className={`p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}
            >
              <div>
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {session.user_name} - {session.distance}m in {session.time_minutes} Min
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {SWIM_STYLES.find((s) => s.id === session.style)?.name} | {session.date}
                  {cleanNotes && <span className="ml-2 italic">&quot;{cleanNotes}&quot;</span>}
                </div>
                {trainingPlan && (
                  <div className={`text-xs mt-1 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    Trainingsplan: {trainingPlan.name} (+{trainingPlan.xpReward} XP bei Erfuellung)
                    {trainingPlanUnit &&
                      trainingPlanUnitIndex >= 0 &&
                      ` | ${getPlanUnitLabelShared(trainingPlanUnit, trainingPlanUnitIndex, SWIM_STYLES)}`}
                  </div>
                )}
                {isOwnSession && (
                  <div className={`text-xs mt-1 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Eigene Einheit: Diese Freigabe muss durch eine andere Person erfolgen.
                  </div>
                )}
              </div>
              {isOwnSession ? (
                <button
                  onClick={() => withdrawSwimSession(session.id)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium"
                >
                  Zurueckziehen
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => confirmSwimSession(session.id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                  >
                    Bestätigen
                  </button>
                  <button
                    onClick={() => rejectSwimSession(session.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
                  >
                    Ablehnen
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SwimTrainerConfirmationsView;
