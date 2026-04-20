import React from 'react';
import { CheckCircle2, Check, X, Undo2 } from 'lucide-react';
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
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
        <CheckCircle2
          size={20}
          className={darkMode ? 'text-amber-300' : 'text-amber-600'}
        />
        Zu bestätigende Einheiten
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
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
              className={`p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-200'
              }`}
            >
              <div>
                <div className="font-medium text-gray-800">
                  {session.user_name} - {session.distance}m in {session.time_minutes} Min
                </div>
                <div className="text-sm text-gray-600">
                  {SWIM_STYLES.find((s) => s.id === session.style)?.name} | {session.date}
                  {cleanNotes && <span className="ml-2 italic">&quot;{cleanNotes}&quot;</span>}
                </div>
                {trainingPlan && (
                  <div className={`text-xs mt-1 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    Trainingsplan: {trainingPlan.name} (+{trainingPlan.xpReward} XP bei Erfüllung)
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
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium flex items-center gap-2 shadow-sm"
                >
                  <Undo2 size={16} />
                  Zurückziehen
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => confirmSwimSession(session.id)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-medium flex items-center gap-2 shadow-sm"
                  >
                    <Check size={16} />
                    Bestätigen
                  </button>
                  <button
                    onClick={() => rejectSwimSession(session.id)}
                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white rounded-lg font-medium flex items-center gap-2 shadow-sm"
                  >
                    <X size={16} />
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
