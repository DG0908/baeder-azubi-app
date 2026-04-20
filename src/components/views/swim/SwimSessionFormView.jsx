import React from 'react';
import toast from 'react-hot-toast';
import { Plus, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import {
  normalizePlanUnitForView,
  getPlanUnits as getPlanUnitsShared,
  getPlanUnitLabel as getPlanUnitLabelShared,
} from '../../../lib/swim/swimPlans';
import { parseFormTimeToMinutes } from '../../../lib/swim/swimTime';

const TRAINING_CATEGORY_META = {
  ausdauer: { label: 'Ausdauer', icon: '🌊' },
  sprint: { label: 'Sprint', icon: '⚡' },
  technik: { label: 'Technik', icon: '🎯' },
  kombi: { label: 'Kombi', icon: '🔗' },
};

const getDifficultyMeta = (darkMode) => ({
  angenehm: {
    label: 'Angenehm',
    badge: darkMode ? 'bg-emerald-900/60 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
  },
  fokussiert: {
    label: 'Fokussiert',
    badge: darkMode ? 'bg-amber-900/60 text-amber-300' : 'bg-amber-100 text-amber-700',
  },
  anspruchsvoll: {
    label: 'Anspruchsvoll',
    badge: darkMode ? 'bg-rose-900/60 text-rose-300' : 'bg-rose-100 text-rose-700',
  },
});

const inputClass = (darkMode) =>
  `w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
      : 'bg-white/70 border-gray-300 text-gray-800'
  }`;

const SwimSessionFormView = ({
  darkMode,
  swimSessionForm,
  setSwimSessionForm,
  SWIM_STYLES,
  SWIM_TRAINING_PLANS,
  SWIM_CHALLENGES,
  activeSwimChallenges,
  saveSwimSession,
}) => {
  const difficultyMeta = getDifficultyMeta(darkMode);

  const getTrainingPlanById = (planId) =>
    SWIM_TRAINING_PLANS.find((plan) => plan.id === planId) || null;

  const getPlanUnits = React.useCallback((planInput) => getPlanUnitsShared(planInput), []);
  const getPlanUnitLabel = React.useCallback(
    (unitInput, index) => getPlanUnitLabelShared(unitInput, index, SWIM_STYLES),
    [SWIM_STYLES],
  );

  const selectedTrainingPlan = getTrainingPlanById(swimSessionForm.trainingPlanId);
  const selectedTrainingPlanUnits = React.useMemo(
    () => getPlanUnits(selectedTrainingPlan),
    [selectedTrainingPlan, getPlanUnits],
  );
  const selectedTrainingPlanUnit = React.useMemo(() => {
    if (selectedTrainingPlanUnits.length === 0) return null;
    const requestedUnitId = String(swimSessionForm.trainingPlanUnitId || '').trim();
    return (
      selectedTrainingPlanUnits.find((unit) => unit.id === requestedUnitId)
      || selectedTrainingPlanUnits[0]
    );
  }, [selectedTrainingPlanUnits, swimSessionForm.trainingPlanUnitId]);

  const isPlanFulfilledByForm = (planInput, planUnitInput) => {
    if (!planInput) return false;
    const targetUnit = normalizePlanUnitForView(planUnitInput || getPlanUnits(planInput)[0], 0);
    const distance = Number(swimSessionForm.distance || 0);
    const timeMinutes = parseFormTimeToMinutes(swimSessionForm.time);
    const styleId = String(swimSessionForm.style || '');
    if (
      !Number.isFinite(distance)
      || !Number.isFinite(timeMinutes)
      || distance <= 0
      || timeMinutes <= 0
    ) {
      return false;
    }
    const styleMatches = !targetUnit.styleId || targetUnit.styleId === styleId;
    return (
      styleMatches
      && distance >= targetUnit.targetDistance
      && timeMinutes <= targetUnit.targetTime
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
        <Plus size={20} className={darkMode ? 'text-cyan-300' : 'text-cyan-600'} />
        Neue Trainingseinheit eintragen
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Datum</label>
          <input
            type="date"
            value={swimSessionForm.date}
            onChange={(e) => setSwimSessionForm({ ...swimSessionForm, date: e.target.value })}
            className={inputClass(darkMode)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Schwimmstil</label>
          <select
            value={swimSessionForm.style}
            onChange={(e) => setSwimSessionForm({ ...swimSessionForm, style: e.target.value })}
            className={inputClass(darkMode)}
          >
            {SWIM_STYLES.map((style) => (
              <option key={style.id} value={style.id}>
                {style.icon} {style.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Distanz (Meter)</label>
          <input
            type="number"
            value={swimSessionForm.distance}
            onChange={(e) => setSwimSessionForm({ ...swimSessionForm, distance: e.target.value })}
            placeholder="z.B. 1000"
            className={inputClass(darkMode)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Zeit{' '}
            <span className="font-normal text-xs text-gray-500">(Min : Sek , 1/100)</span>
          </label>
          <div
            className={`flex items-center gap-1 px-3 py-2 rounded-lg border font-mono text-lg ${
              darkMode
                ? 'bg-white/5 border-white/10 text-white'
                : 'bg-white/70 border-gray-300 text-gray-800'
            }`}
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={2}
              value={swimSessionForm.time ? swimSessionForm.time.split(':')[0] : ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                const rest = swimSessionForm.time.includes(':')
                  ? swimSessionForm.time.split(':')[1]
                  : '00,00';
                setSwimSessionForm({
                  ...swimSessionForm,
                  time: val !== '' ? `${val}:${rest}` : '',
                });
              }}
              placeholder="00"
              className="w-8 text-center bg-transparent outline-none placeholder-gray-400"
            />
            <span className="text-gray-400">:</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={2}
              value={
                swimSessionForm.time && swimSessionForm.time.includes(':')
                  ? swimSessionForm.time.split(':')[1]?.split(',')[0] || ''
                  : ''
              }
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                const m = swimSessionForm.time.split(':')[0] || '0';
                const cs = swimSessionForm.time.includes(',')
                  ? swimSessionForm.time.split(',')[1]
                  : '00';
                setSwimSessionForm({ ...swimSessionForm, time: `${m}:${val},${cs}` });
              }}
              placeholder="00"
              className="w-8 text-center bg-transparent outline-none placeholder-gray-400"
            />
            <span className="text-gray-400">,</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={2}
              value={
                swimSessionForm.time && swimSessionForm.time.includes(',')
                  ? swimSessionForm.time.split(',')[1]
                  : ''
              }
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                const beforeComma = swimSessionForm.time.includes(',')
                  ? swimSessionForm.time.split(',')[0]
                  : swimSessionForm.time || '0:00';
                setSwimSessionForm({ ...swimSessionForm, time: `${beforeComma},${val}` });
              }}
              placeholder="00"
              className="w-8 text-center bg-transparent outline-none placeholder-gray-400"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Trainingsplan (XP-Bonus)
          </label>
          <select
            value={swimSessionForm.trainingPlanId || ''}
            onChange={(e) => {
              const planId = e.target.value;
              if (!planId) {
                setSwimSessionForm({
                  ...swimSessionForm,
                  trainingPlanId: '',
                  trainingPlanUnitId: '',
                });
                return;
              }
              const plan = getTrainingPlanById(planId);
              if (!plan) return;
              const planUnits = getPlanUnits(plan);
              const defaultUnit = planUnits[0];
              if (!defaultUnit) return;
              setSwimSessionForm({
                ...swimSessionForm,
                trainingPlanId: plan.id,
                trainingPlanUnitId: defaultUnit.id,
              });
            }}
            className={inputClass(darkMode)}
          >
            <option value="">-- Kein Trainingsplan --</option>
            {['ausdauer', 'sprint', 'technik', 'kombi'].map((categoryId) => {
              const categoryMeta = TRAINING_CATEGORY_META[categoryId] || {
                label: categoryId,
                icon: 'Plan',
              };
              const plans = SWIM_TRAINING_PLANS.filter((plan) => plan.category === categoryId);
              if (plans.length === 0) return null;
              return (
                <optgroup key={categoryId} label={`${categoryMeta.icon} ${categoryMeta.label}`}>
                  {plans.map((plan) => {
                    const difficulty = difficultyMeta[plan.difficulty]?.label || plan.difficulty;
                    const customPrefix = plan.isCustom ? '[Individuell] ' : '';
                    return (
                      <option key={plan.id} value={plan.id}>
                        {customPrefix}
                        {plan.name} - {difficulty} (+{plan.xpReward} XP)
                      </option>
                    );
                  })}
                </optgroup>
              );
            })}
          </select>
        </div>
        {selectedTrainingPlan && selectedTrainingPlanUnits.length > 1 && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Plan-Einheit</label>
            <select
              value={selectedTrainingPlanUnit?.id || ''}
              onChange={(e) => {
                const nextUnitId = e.target.value;
                const nextUnit = selectedTrainingPlanUnits.find((unit) => unit.id === nextUnitId);
                if (!nextUnit) return;
                setSwimSessionForm({ ...swimSessionForm, trainingPlanUnitId: nextUnit.id });
              }}
              className={inputClass(darkMode)}
            >
              {selectedTrainingPlanUnits.map((unit, index) => (
                <option key={unit.id} value={unit.id}>
                  {getPlanUnitLabel(unit, index)}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedTrainingPlan && (
          <div className="md:col-span-2">
            {(() => {
              const isFulfilled = isPlanFulfilledByForm(
                selectedTrainingPlan,
                selectedTrainingPlanUnit,
              );
              return (
                <div
                  className={`rounded-xl p-3 border ${
                    isFulfilled
                      ? darkMode
                        ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : darkMode
                        ? 'bg-white/5 border-white/10 text-gray-200'
                        : 'bg-white/60 border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-semibold flex items-center gap-2">
                    {isFulfilled && <CheckCircle2 size={16} />}
                    Plan: {selectedTrainingPlan.name} | +{selectedTrainingPlan.xpReward} XP
                  </div>
                  <div className="text-sm mt-1">
                    {selectedTrainingPlanUnit
                      ? `Ziel: ${selectedTrainingPlanUnit.targetDistance} m in max. ${selectedTrainingPlanUnit.targetTime} Min | Stil: ${SWIM_STYLES.find((style) => style.id === selectedTrainingPlanUnit.styleId)?.name || 'beliebig'}`
                      : 'Ziel konnte nicht geladen werden.'}
                  </div>
                  {selectedTrainingPlanUnits.length > 1 && selectedTrainingPlanUnit && (
                    <div className="text-sm mt-1">
                      Aktive Einheit:{' '}
                      {getPlanUnitLabel(
                        selectedTrainingPlanUnit,
                        selectedTrainingPlanUnits.findIndex(
                          (unit) => unit.id === selectedTrainingPlanUnit.id,
                        ),
                      )}
                    </div>
                  )}
                  <div className="text-sm mt-1">
                    {isFulfilled
                      ? 'Plan mit aktueller Eingabe erfüllt (XP nach Bestätigung).'
                      : 'Distanz/Zeit/Stil auf Planziel einstellen, um XP zu erhalten.'}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Für Challenge (optional)
          </label>
          <select
            value={swimSessionForm.challengeId}
            onChange={(e) => setSwimSessionForm({ ...swimSessionForm, challengeId: e.target.value })}
            className={inputClass(darkMode)}
          >
            <option value="">-- Keine Challenge --</option>
            {activeSwimChallenges.map((id) => {
              const ch = SWIM_CHALLENGES.find((c) => c.id === id);
              return ch ? (
                <option key={id} value={id}>
                  {ch.icon} {ch.name}
                </option>
              ) : null;
            })}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-gray-700">Notizen</label>
          <textarea
            value={swimSessionForm.notes}
            onChange={(e) => setSwimSessionForm({ ...swimSessionForm, notes: e.target.value })}
            placeholder="Wie lief das Training?"
            rows={2}
            className={inputClass(darkMode)}
          />
        </div>
      </div>
      <div
        className={`mt-4 p-4 rounded-xl border flex items-start gap-3 ${
          darkMode
            ? 'bg-amber-900/20 border-amber-500/30 text-amber-200'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}
      >
        <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
        <p className="text-sm">
          Die Einheit muss von einem Trainer oder Ausbilder bestätigt werden, bevor Punkte und
          Trainingsplan-XP gutgeschrieben werden.
        </p>
      </div>
      <button
        onClick={async () => {
          if (swimSessionForm.distance && swimSessionForm.time) {
            const result = await saveSwimSession(swimSessionForm);
            if (result.success) {
              setSwimSessionForm({
                date: new Date().toISOString().split('T')[0],
                distance: '',
                time: '',
                style: 'kraul',
                notes: '',
                challengeId: '',
                trainingPlanId: '',
                trainingPlanUnitId: '',
              });
              toast.success(
                'Trainingseinheit eingereicht! Warte auf Bestätigung durch einen Trainer.',
              );
            } else {
              toast.error('Fehler beim Speichern: ' + result.error);
            }
          }
        }}
        disabled={!swimSessionForm.distance || !swimSessionForm.time}
        className={`mt-4 w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
          swimSessionForm.distance && swimSessionForm.time
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-sm'
            : darkMode
              ? 'bg-white/5 text-gray-500'
              : 'bg-gray-200 text-gray-400'
        }`}
      >
        <Send size={18} />
        Einheit zur Bestätigung einreichen
      </button>
    </div>
  );
};

export default SwimSessionFormView;
