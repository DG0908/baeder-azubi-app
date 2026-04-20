import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  createCustomPlanUnitDraft,
  normalizePlanUnitForView,
  getPlanUnits as getPlanUnitsShared,
  getPlanUnitLabel as getPlanUnitLabelShared,
} from '../../../lib/swim/swimPlans';

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

const SwimTrainingPlansView = ({
  darkMode,
  user,
  isTrainerLike,
  azubiCandidates,
  SWIM_STYLES,
  SWIM_TRAINING_PLANS,
  createCustomSwimTrainingPlan,
  setSwimSessionForm,
  setSwimChallengeView,
}) => {
  const [customPlanForm, setCustomPlanForm] = useState({
    name: '',
    category: 'ausdauer',
    difficulty: 'fokussiert',
    units: [createCustomPlanUnitDraft()],
    xpReward: '15',
    description: '',
    assignedUserId: '',
  });

  useEffect(() => {
    if (!isTrainerLike) return;
    if (customPlanForm.assignedUserId) return;
    if (azubiCandidates.length === 0) return;
    setCustomPlanForm((prev) => ({ ...prev, assignedUserId: azubiCandidates[0].id }));
  }, [azubiCandidates, customPlanForm.assignedUserId, isTrainerLike]);

  const difficultyMetaMap = getDifficultyMeta(darkMode);
  const getPlanUnitLabel = (unitInput, index) =>
    getPlanUnitLabelShared(unitInput, index, SWIM_STYLES);

  const updateCustomPlanUnitField = (unitId, field, value) => {
    setCustomPlanForm((prev) => ({
      ...prev,
      units: (Array.isArray(prev.units) ? prev.units : []).map((unit) =>
        unit.id === unitId ? { ...unit, [field]: value } : unit,
      ),
    }));
  };

  const addCustomPlanUnit = () => {
    setCustomPlanForm((prev) => ({
      ...prev,
      units: [...(Array.isArray(prev.units) ? prev.units : []), createCustomPlanUnitDraft()],
    }));
  };

  const removeCustomPlanUnit = (unitId) => {
    setCustomPlanForm((prev) => {
      const currentUnits = Array.isArray(prev.units) ? prev.units : [];
      if (currentUnits.length <= 1) return prev;
      return {
        ...prev,
        units: currentUnits.filter((unit) => unit.id !== unitId),
      };
    });
  };

  const handleCreateCustomPlan = async (event) => {
    event.preventDefault();
    const units = (Array.isArray(customPlanForm.units) ? customPlanForm.units : []).map(
      (unit, index) => normalizePlanUnitForView(unit, index),
    );
    if (units.length === 0) {
      toast.error('Bitte mindestens eine Einheit fuer den Trainingsplan hinterlegen.');
      return;
    }

    const payload = {
      name: customPlanForm.name,
      category: customPlanForm.category,
      difficulty: customPlanForm.difficulty,
      styleId: units[0].styleId,
      targetDistance: units[0].targetDistance,
      targetTime: units[0].targetTime,
      units: units.map((unit) => ({
        id: unit.id,
        styleId: unit.styleId,
        targetDistance: unit.targetDistance,
        targetTime: unit.targetTime,
      })),
      xpReward: customPlanForm.xpReward,
      description: customPlanForm.description,
      assignedUserId: isTrainerLike ? customPlanForm.assignedUserId : user?.id,
      assignToAllCandidates:
        isTrainerLike && customPlanForm.assignedUserId === '__all__' ? azubiCandidates : null,
    };

    const result = await createCustomSwimTrainingPlan(payload);
    if (!result?.success) {
      toast.error(`Fehler beim Speichern des Plans: ${result?.error || 'Unbekannter Fehler'}`);
      return;
    }

    const defaultAssignedUserId = isTrainerLike ? azubiCandidates[0]?.id || '' : '';
    const firstUnit = units[0] || normalizePlanUnitForView(createCustomPlanUnitDraft(), 0);
    setCustomPlanForm({
      name: '',
      category: customPlanForm.category,
      difficulty: customPlanForm.difficulty,
      units: [
        createCustomPlanUnitDraft({
          styleId: firstUnit.styleId,
          targetDistance: String(firstUnit.targetDistance),
          targetTime: String(firstUnit.targetTime),
        }),
      ],
      xpReward: customPlanForm.xpReward,
      description: '',
      assignedUserId: defaultAssignedUserId,
    });
    toast.success('Trainingsplan gespeichert.');
  };

  return (
    <div className="space-y-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 shadow-lg`}>
        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          📋 Schwimm-Trainingsplaene
        </h3>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Ausdauer, Sprint, Technik und Kombi. Von angenehm bis anspruchsvoll. Bei erfuelltem Plan
          gibt es XP nach Trainer-Bestätigung.
        </p>
      </div>

      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 shadow-lg`}>
        <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Eigenen Trainingsplan erstellen
        </h4>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {isTrainerLike
            ? 'Als Ausbilder kannst du Plaene für dich oder gezielt für Azubis anlegen.'
            : 'Stelle dir deinen eigenen Plan zusammen und nutze ihn direkt für neue Einheiten.'}
        </p>
        <form onSubmit={handleCreateCustomPlan} className="grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label
              className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Planname
            </label>
            <input
              type="text"
              value={customPlanForm.name}
              onChange={(event) =>
                setCustomPlanForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder={isTrainerLike ? 'z.B. Technikblock für Lina' : 'z.B. Mein 1km Abendplan'}
              required
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
          </div>

          {isTrainerLike && (
            <div className="md:col-span-2">
              <label
                className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Zuweisen an
              </label>
              <select
                value={customPlanForm.assignedUserId}
                onChange={(event) =>
                  setCustomPlanForm((prev) => ({ ...prev, assignedUserId: event.target.value }))
                }
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                }`}
              >
                {azubiCandidates.length === 0 && <option value="">Keine Azubis verfügbar</option>}
                {azubiCandidates.length > 1 && (
                  <option value="__all__">👥 Alle Azubis ({azubiCandidates.length})</option>
                )}
                {azubiCandidates.map((azubi) => (
                  <option key={azubi.id} value={azubi.id}>
                    {azubi.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Kategorie
            </label>
            <select
              value={customPlanForm.category}
              onChange={(event) =>
                setCustomPlanForm((prev) => ({ ...prev, category: event.target.value }))
              }
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="ausdauer">Ausdauer</option>
              <option value="sprint">Sprint</option>
              <option value="technik">Technik</option>
              <option value="kombi">Kombi</option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Schwierigkeit
            </label>
            <select
              value={customPlanForm.difficulty}
              onChange={(event) =>
                setCustomPlanForm((prev) => ({ ...prev, difficulty: event.target.value }))
              }
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="angenehm">Angenehm</option>
              <option value="fokussiert">Fokussiert</option>
              <option value="anspruchsvoll">Anspruchsvoll</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Plan-Einheiten
              </label>
              <button
                type="button"
                onClick={addCustomPlanUnit}
                className={`text-xs font-medium px-2 py-1 rounded border ${
                  darkMode
                    ? 'border-cyan-500 text-cyan-300 hover:bg-cyan-900/40'
                    : 'border-cyan-500 text-cyan-700 hover:bg-cyan-50'
                }`}
              >
                + Einheit
              </button>
            </div>
            <div className="space-y-3">
              {(Array.isArray(customPlanForm.units) ? customPlanForm.units : []).map((unit, index) => (
                <div
                  key={unit.id}
                  className={`rounded-lg border p-3 ${
                    darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Einheit {index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomPlanUnit(unit.id)}
                      disabled={(customPlanForm.units || []).length <= 1}
                      className={`text-xs px-2 py-1 rounded border ${
                        (customPlanForm.units || []).length <= 1
                          ? darkMode
                            ? 'border-slate-500 text-slate-400'
                            : 'border-gray-300 text-gray-400'
                          : darkMode
                            ? 'border-rose-500 text-rose-300 hover:bg-rose-900/30'
                            : 'border-rose-400 text-rose-700 hover:bg-rose-50'
                      }`}
                    >
                      Entfernen
                    </button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <label
                        className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Stil
                      </label>
                      <select
                        value={unit.styleId}
                        onChange={(event) =>
                          updateCustomPlanUnitField(unit.id, 'styleId', event.target.value)
                        }
                        className={`w-full px-3 py-2 rounded-lg border ${
                          darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      >
                        {SWIM_STYLES.map((style) => (
                          <option key={style.id} value={style.id}>
                            {style.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Distanz (m)
                      </label>
                      <input
                        type="number"
                        min="100"
                        step="50"
                        value={unit.targetDistance}
                        onChange={(event) =>
                          updateCustomPlanUnitField(unit.id, 'targetDistance', event.target.value)
                        }
                        required
                        className={`w-full px-3 py-2 rounded-lg border ${
                          darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Max. Zeit (Min)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={unit.targetTime}
                        onChange={(event) =>
                          updateCustomPlanUnitField(unit.id, 'targetTime', event.target.value)
                        }
                        required
                        className={`w-full px-3 py-2 rounded-lg border ${
                          darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label
              className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              XP Belohnung
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={customPlanForm.xpReward}
              onChange={(event) =>
                setCustomPlanForm((prev) => ({ ...prev, xpReward: event.target.value }))
              }
              required
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
          </div>
          <div className="md:col-span-2">
            <label
              className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Beschreibung (optional)
            </label>
            <textarea
              rows={2}
              value={customPlanForm.description}
              onChange={(event) =>
                setCustomPlanForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="z.B. Fokus auf gleichmaessigen Rhythmus und saubere Wenden."
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isTrainerLike && azubiCandidates.length === 0}
              className={`w-full py-2 rounded-lg font-medium ${
                isTrainerLike && azubiCandidates.length === 0
                  ? darkMode
                    ? 'bg-slate-700 text-gray-500'
                    : 'bg-gray-200 text-gray-400'
                  : darkMode
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              Trainingsplan speichern
            </button>
          </div>
        </form>
      </div>

      {['ausdauer', 'sprint', 'technik', 'kombi'].map((categoryId) => {
        const categoryPlans = SWIM_TRAINING_PLANS.filter((plan) => plan.category === categoryId);
        const categoryMeta = TRAINING_CATEGORY_META[categoryId] || { label: categoryId, icon: '🏊' };

        return (
          <div
            key={categoryId}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 shadow-lg`}
          >
            <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {categoryMeta.icon} {categoryMeta.label} ({categoryPlans.length})
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {categoryPlans.map((plan) => {
                const difficultyMeta =
                  difficultyMetaMap[plan.difficulty] || difficultyMetaMap.fokussiert;
                const planUnits = getPlanUnitsShared(plan);
                const defaultUnit = planUnits[0] || null;
                const isCustomPlan = Boolean(plan.isCustom);
                const assignedInfo = String(plan.assignedUserName || '').trim();
                const createdInfo = String(plan.createdByName || '').trim();
                return (
                  <div
                    key={plan.id}
                    className={`rounded-lg p-4 border ${
                      darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {plan.name}
                        </div>
                        <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {plan.description}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${difficultyMeta.badge}`}
                      >
                        {difficultyMeta.label}
                      </span>
                    </div>
                    {isCustomPlan && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className={`text-[11px] px-2 py-1 rounded-full ${
                            darkMode ? 'bg-cyan-900/50 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
                          }`}
                        >
                          Individuell
                        </span>
                        {assignedInfo && (
                          <span
                            className={`text-[11px] px-2 py-1 rounded-full ${
                              darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            Für {assignedInfo}
                          </span>
                        )}
                        {createdInfo && (
                          <span
                            className={`text-[11px] px-2 py-1 rounded-full ${
                              darkMode ? 'bg-slate-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            von {createdInfo}
                          </span>
                        )}
                      </div>
                    )}
                    <div className={`text-sm mt-3 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      {(planUnits.length > 1 ? planUnits : [defaultUnit])
                        .filter(Boolean)
                        .map((unit, index) => (
                          <div key={unit.id}>{getPlanUnitLabel(unit, index)}</div>
                        ))}
                    </div>
                    <div className={`text-sm mt-1 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                      Belohnung: +{plan.xpReward} XP
                    </div>
                    <button
                      onClick={() => {
                        if (!defaultUnit) return;
                        setSwimSessionForm((prev) => ({
                          ...prev,
                          trainingPlanId: plan.id,
                          trainingPlanUnitId: defaultUnit.id,
                        }));
                        setSwimChallengeView('add');
                      }}
                      className={`mt-3 w-full py-2 rounded-lg font-medium ${
                        darkMode
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                          : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                      }`}
                    >
                      Diesen Plan nutzen
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SwimTrainingPlansView;
