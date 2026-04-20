import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ClipboardList, Wand2, Plus, Trash2, Save } from 'lucide-react';
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

const inputClass = (darkMode) =>
  `w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
      : 'bg-white/70 border-gray-300 text-gray-800'
  }`;

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
      toast.error('Bitte mindestens eine Einheit für den Trainingsplan hinterlegen.');
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
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
          <ClipboardList size={20} />
          Schwimm-Trainingspläne
        </h3>
        <p className="text-sm mt-1 text-gray-600">
          Ausdauer, Sprint, Technik und Kombi. Von angenehm bis anspruchsvoll. Bei erfülltem Plan
          gibt es XP nach Trainer-Bestätigung.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <h4 className="font-bold mb-1 flex items-center gap-2 text-gray-800">
          <Wand2 size={18} />
          Eigenen Trainingsplan erstellen
        </h4>
        <p className="text-sm mb-4 text-gray-600">
          {isTrainerLike
            ? 'Als Ausbilder kannst du Pläne für dich oder gezielt für Azubis anlegen.'
            : 'Stelle dir deinen eigenen Plan zusammen und nutze ihn direkt für neue Einheiten.'}
        </p>
        <form onSubmit={handleCreateCustomPlan} className="grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-gray-700 font-medium">Planname</label>
            <input
              type="text"
              value={customPlanForm.name}
              onChange={(event) =>
                setCustomPlanForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder={isTrainerLike ? 'z.B. Technikblock für Lina' : 'z.B. Mein 1km Abendplan'}
              required
              className={inputClass(darkMode)}
            />
          </div>

          {isTrainerLike && (
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 text-gray-700 font-medium">Zuweisen an</label>
              <select
                value={customPlanForm.assignedUserId}
                onChange={(event) =>
                  setCustomPlanForm((prev) => ({ ...prev, assignedUserId: event.target.value }))
                }
                required
                className={inputClass(darkMode)}
              >
                {azubiCandidates.length === 0 && <option value="">Keine Azubis verfügbar</option>}
                {azubiCandidates.length > 1 && (
                  <option value="__all__">Alle Azubis ({azubiCandidates.length})</option>
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
            <label className="block text-sm mb-1 text-gray-700 font-medium">Kategorie</label>
            <select
              value={customPlanForm.category}
              onChange={(event) =>
                setCustomPlanForm((prev) => ({ ...prev, category: event.target.value }))
              }
              className={inputClass(darkMode)}
            >
              <option value="ausdauer">Ausdauer</option>
              <option value="sprint">Sprint</option>
              <option value="technik">Technik</option>
              <option value="kombi">Kombi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 font-medium">Schwierigkeit</label>
            <select
              value={customPlanForm.difficulty}
              onChange={(event) =>
                setCustomPlanForm((prev) => ({ ...prev, difficulty: event.target.value }))
              }
              className={inputClass(darkMode)}
            >
              <option value="angenehm">Angenehm</option>
              <option value="fokussiert">Fokussiert</option>
              <option value="anspruchsvoll">Anspruchsvoll</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-gray-700 font-medium">Plan-Einheiten</label>
              <button
                type="button"
                onClick={addCustomPlanUnit}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border flex items-center gap-1 ${
                  darkMode
                    ? 'border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/40'
                    : 'border-cyan-500 text-cyan-700 hover:bg-cyan-50'
                }`}
              >
                <Plus size={14} />
                Einheit
              </button>
            </div>
            <div className="space-y-3">
              {(Array.isArray(customPlanForm.units) ? customPlanForm.units : []).map((unit, index) => (
                <div
                  key={unit.id}
                  className={`rounded-xl border p-3 ${
                    darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-800">Einheit {index + 1}</div>
                    <button
                      type="button"
                      onClick={() => removeCustomPlanUnit(unit.id)}
                      disabled={(customPlanForm.units || []).length <= 1}
                      className={`text-xs px-2 py-1 rounded-lg border flex items-center gap-1 ${
                        (customPlanForm.units || []).length <= 1
                          ? darkMode
                            ? 'border-white/10 text-slate-400'
                            : 'border-gray-300 text-gray-400'
                          : darkMode
                            ? 'border-rose-500/50 text-rose-300 hover:bg-rose-900/30'
                            : 'border-rose-400 text-rose-700 hover:bg-rose-50'
                      }`}
                    >
                      <Trash2 size={12} />
                      Entfernen
                    </button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm mb-1 text-gray-700">Stil</label>
                      <select
                        value={unit.styleId}
                        onChange={(event) =>
                          updateCustomPlanUnitField(unit.id, 'styleId', event.target.value)
                        }
                        className={inputClass(darkMode)}
                      >
                        {SWIM_STYLES.map((style) => (
                          <option key={style.id} value={style.id}>
                            {style.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-gray-700">Distanz (m)</label>
                      <input
                        type="number"
                        min="100"
                        step="50"
                        value={unit.targetDistance}
                        onChange={(event) =>
                          updateCustomPlanUnitField(unit.id, 'targetDistance', event.target.value)
                        }
                        required
                        className={inputClass(darkMode)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-gray-700">Max. Zeit (Min)</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={unit.targetTime}
                        onChange={(event) =>
                          updateCustomPlanUnitField(unit.id, 'targetTime', event.target.value)
                        }
                        required
                        className={inputClass(darkMode)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 font-medium">XP-Belohnung</label>
            <input
              type="number"
              min="1"
              step="1"
              value={customPlanForm.xpReward}
              onChange={(event) =>
                setCustomPlanForm((prev) => ({ ...prev, xpReward: event.target.value }))
              }
              required
              className={inputClass(darkMode)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-gray-700 font-medium">
              Beschreibung (optional)
            </label>
            <textarea
              rows={2}
              value={customPlanForm.description}
              onChange={(event) =>
                setCustomPlanForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="z.B. Fokus auf gleichmäßigen Rhythmus und saubere Wenden."
              className={inputClass(darkMode)}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isTrainerLike && azubiCandidates.length === 0}
              className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                isTrainerLike && azubiCandidates.length === 0
                  ? darkMode
                    ? 'bg-white/5 text-gray-500'
                    : 'bg-gray-200 text-gray-400'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-sm'
              }`}
            >
              <Save size={16} />
              Trainingsplan speichern
            </button>
          </div>
        </form>
      </div>

      {['ausdauer', 'sprint', 'technik', 'kombi'].map((categoryId) => {
        const categoryPlans = SWIM_TRAINING_PLANS.filter((plan) => plan.category === categoryId);
        const categoryMeta = TRAINING_CATEGORY_META[categoryId] || { label: categoryId, icon: '🏊' };

        return (
          <div key={categoryId} className="glass-card rounded-2xl p-5">
            <h4 className="font-bold mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-xl">{categoryMeta.icon}</span>
              {categoryMeta.label}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-normal ${
                  darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {categoryPlans.length}
              </span>
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
                    className={`rounded-xl p-4 border ${
                      darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-gray-800">{plan.name}</div>
                        <div className="text-xs mt-1 text-gray-600">{plan.description}</div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${difficultyMeta.badge}`}
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
                              darkMode ? 'bg-white/10 text-gray-200' : 'bg-gray-200 text-gray-700'
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
                      className="mt-3 w-full py-2 rounded-lg font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-sm"
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
