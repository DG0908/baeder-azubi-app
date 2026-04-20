import { toSafeInt } from '../quizHelpers';

export const createCustomPlanUnitDraft = (unitInput = {}) => {
  const requestedId = String(unitInput.id || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const fallbackId = `unit_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  return {
    id: requestedId || fallbackId,
    styleId: String(unitInput.styleId || 'kraul').trim() || 'kraul',
    targetDistance: String(unitInput.targetDistance || '1000'),
    targetTime: String(unitInput.targetTime || '30'),
  };
};

export const normalizePlanUnitForView = (unitInput = {}, index = 0) => {
  const unit = unitInput && typeof unitInput === 'object' ? unitInput : {};
  const requestedId = String(unit.id || unit.unitId || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const styleId = String(unit.styleId || unit.style_id || 'kraul').trim() || 'kraul';
  const targetDistance = Math.max(100, toSafeInt(unit.targetDistance ?? unit.target_distance));
  const targetTime = Math.max(1, toSafeInt(unit.targetTime ?? unit.target_time));
  return {
    id: requestedId || `unit_${index + 1}`,
    styleId,
    targetDistance,
    targetTime,
  };
};

export const getPlanUnits = (planInput) => {
  if (!planInput || typeof planInput !== 'object') return [];
  const sourceUnits = Array.isArray(planInput.units) && planInput.units.length > 0
    ? planInput.units
    : [
        {
          id: 'unit_1',
          styleId: planInput.styleId || 'kraul',
          targetDistance: planInput.targetDistance || 1000,
          targetTime: planInput.targetTime || 30,
        },
      ];
  const usedIds = new Set();
  return sourceUnits.map((unit, index) => {
    const normalized = normalizePlanUnitForView(unit, index);
    let finalId = normalized.id;
    let suffix = 2;
    while (usedIds.has(finalId)) {
      finalId = `${normalized.id}_${suffix}`;
      suffix += 1;
    }
    usedIds.add(finalId);
    return { ...normalized, id: finalId };
  });
};

export const getPlanUnitLabel = (unitInput, index, swimStyles = []) => {
  if (!unitInput) return `Einheit ${index + 1}`;
  const styleName = swimStyles.find((style) => style.id === unitInput.styleId)?.name || 'beliebig';
  return `Einheit ${index + 1}: ${unitInput.targetDistance} m / ${unitInput.targetTime} Min / ${styleName}`;
};
