const TRAINING_CATEGORIES = ['ausdauer', 'sprint', 'technik', 'kombi'] as const;
const TRAINING_DIFFICULTIES = ['angenehm', 'fokussiert', 'anspruchsvoll'] as const;

export type SwimTrainingPlanCategory = (typeof TRAINING_CATEGORIES)[number];
export type SwimTrainingPlanDifficulty = (typeof TRAINING_DIFFICULTIES)[number];

export type SwimTrainingPlanUnit = {
  id: string;
  styleId: string;
  targetDistance: number;
  targetTime: number;
};

export type ResolvedSwimTrainingPlan = {
  id: string;
  name: string;
  category: SwimTrainingPlanCategory;
  difficulty: SwimTrainingPlanDifficulty;
  units: SwimTrainingPlanUnit[];
  xpReward: number;
  description: string;
  source: 'default' | 'custom';
  isCustom: boolean;
  createdByUserId: string | null;
  createdByName: string;
  createdByRole: string;
  assignedUserId: string | null;
  assignedUserName: string;
  assignedUserRole: string;
  createdAt: string | null;
};

const toSafeInt = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
};

const normalizeStyleId = (value: unknown) => {
  const normalized = String(value || '').trim();
  if (normalized === 'ruecken') {
    return 'rücken';
  }

  return normalized || 'kraul';
};

export const normalizeSwimTrainingPlanCategory = (value: unknown): SwimTrainingPlanCategory => {
  const normalized = String(value || '').trim().toLowerCase();
  return (TRAINING_CATEGORIES as readonly string[]).includes(normalized)
    ? (normalized as SwimTrainingPlanCategory)
    : 'ausdauer';
};

export const normalizeSwimTrainingPlanDifficulty = (value: unknown): SwimTrainingPlanDifficulty => {
  const normalized = String(value || '').trim().toLowerCase();
  return (TRAINING_DIFFICULTIES as readonly string[]).includes(normalized)
    ? (normalized as SwimTrainingPlanDifficulty)
    : 'fokussiert';
};

const parseUnits = (value: unknown) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

export const normalizeSwimTrainingPlanUnit = (unitInput: unknown, index = 0): SwimTrainingPlanUnit => {
  const unit = unitInput && typeof unitInput === 'object'
    ? (unitInput as Record<string, unknown>)
    : {};
  const requestedId = String(unit.id || unit.unitId || '').trim().toLowerCase();
  const baseId = requestedId.replace(/[^a-z0-9_-]/g, '') || `unit_${index + 1}`;
  const styleId = normalizeStyleId(unit.styleId || unit.style_id || 'kraul');
  const targetDistance = Math.max(100, toSafeInt(unit.targetDistance ?? unit.target_distance));
  const targetTime = Math.max(1, toSafeInt(unit.targetTime ?? unit.target_time));

  return {
    id: baseId,
    styleId,
    targetDistance,
    targetTime
  };
};

export const normalizeSwimTrainingPlanUnits = (unitsInput: unknown, fallbackInput: unknown = {}): SwimTrainingPlanUnit[] => {
  const fallback = fallbackInput && typeof fallbackInput === 'object'
    ? (fallbackInput as Record<string, unknown>)
    : {};
  const parsedUnits = parseUnits(unitsInput);
  const fallbackUnit = {
    id: 'unit_1',
    styleId: normalizeStyleId(fallback.styleId || fallback.style_id || 'kraul'),
    targetDistance: Math.max(100, toSafeInt(fallback.targetDistance ?? fallback.target_distance)),
    targetTime: Math.max(1, toSafeInt(fallback.targetTime ?? fallback.target_time))
  };
  const sourceUnits = parsedUnits.length > 0 ? parsedUnits : [fallbackUnit];
  const usedIds = new Set<string>();

  return sourceUnits.map((unit, index) => {
    const normalized = normalizeSwimTrainingPlanUnit(unit, index);
    let finalId = normalized.id;
    let suffix = 2;
    while (usedIds.has(finalId)) {
      finalId = `${normalized.id}_${suffix}`;
      suffix += 1;
    }

    usedIds.add(finalId);
    return {
      ...normalized,
      id: finalId
    };
  });
};

export const doesSessionFulfillPlanUnit = (
  sessionInput: { distanceMeters: number; timeMinutes: number; styleId: string },
  planUnitInput: SwimTrainingPlanUnit | null | undefined
) => {
  if (!sessionInput || !planUnitInput) {
    return false;
  }

  const distance = toSafeInt(sessionInput.distanceMeters);
  const timeMinutes = toSafeInt(sessionInput.timeMinutes);
  if (distance <= 0 || timeMinutes <= 0) {
    return false;
  }

  const targetDistance = toSafeInt(planUnitInput.targetDistance);
  const targetTime = toSafeInt(planUnitInput.targetTime);
  if (targetDistance <= 0 || targetTime <= 0) {
    return false;
  }

  const styleMatches = !planUnitInput.styleId || normalizeStyleId(planUnitInput.styleId) === normalizeStyleId(sessionInput.styleId || '');
  if (!styleMatches) {
    return false;
  }

  return distance >= targetDistance && timeMinutes <= targetTime;
};

export const doesSessionFulfillTrainingPlan = (
  sessionInput: { distanceMeters: number; timeMinutes: number; styleId: string },
  planInput: ResolvedSwimTrainingPlan | null | undefined,
  requestedUnitIdInput = ''
) => {
  if (!sessionInput || !planInput) {
    return false;
  }

  const requestedUnitId = String(requestedUnitIdInput || '').trim().toLowerCase();
  const normalizedUnits = normalizeSwimTrainingPlanUnits(planInput.units, planInput);
  if (normalizedUnits.length === 0) {
    return false;
  }

  if (requestedUnitId) {
    const requestedUnit = normalizedUnits.find((unit) => unit.id === requestedUnitId);
    return requestedUnit ? doesSessionFulfillPlanUnit(sessionInput, requestedUnit) : false;
  }

  return normalizedUnits.some((unit) => doesSessionFulfillPlanUnit(sessionInput, unit));
};

const defaultPlan = (
  id: string,
  name: string,
  category: SwimTrainingPlanCategory,
  difficulty: SwimTrainingPlanDifficulty,
  styleId: string,
  targetDistance: number,
  targetTime: number,
  xpReward: number,
  description: string
): ResolvedSwimTrainingPlan => ({
  id,
  name,
  category,
  difficulty,
  units: [{ id: 'unit_1', styleId, targetDistance, targetTime }],
  xpReward,
  description,
  source: 'default',
  isCustom: false,
  createdByUserId: null,
  createdByName: '',
  createdByRole: '',
  assignedUserId: null,
  assignedUserName: '',
  assignedUserRole: '',
  createdAt: null
});

export const DEFAULT_SWIM_TRAINING_PLANS: ResolvedSwimTrainingPlan[] = [
  defaultPlan('plan_ausdauer_01', 'Ausdauer Start', 'ausdauer', 'angenehm', 'brust', 1000, 35, 12, 'Ruhiger Einstieg mit sauberem Tempo und gleichmaessiger Atmung.'),
  defaultPlan('plan_ausdauer_02', 'Grundlage Plus', 'ausdauer', 'angenehm', 'kraul', 1400, 42, 14, 'Konstante Strecke im lockeren bis mittleren Intensitaetsbereich.'),
  defaultPlan('plan_ausdauer_03', 'Rhythmus 2k', 'ausdauer', 'fokussiert', 'kraul', 2000, 56, 18, 'Stabiler Rhythmus ueber laengere Distanz mit Technikfokus.'),
  defaultPlan('plan_ausdauer_04', 'Langstrecke Basis', 'ausdauer', 'fokussiert', 'brust', 2400, 68, 20, 'Laengeres Grundlagentraining fuer Becken-Routine und Ausdauer.'),
  defaultPlan('plan_ausdauer_05', 'Ausdauer Peak', 'ausdauer', 'anspruchsvoll', 'kraul', 3000, 80, 26, 'Fordernde Einheit fuer starke Grundlagenausdauer.'),
  defaultPlan('plan_sprint_01', 'Sprint Technik Start', 'sprint', 'angenehm', 'kraul', 500, 13, 12, 'Kurze schnelle Abschnitte mit Fokus auf Wasserlage und Zug.'),
  defaultPlan('plan_sprint_02', '50er Serie', 'sprint', 'angenehm', 'kraul', 700, 17, 14, 'Wiederholte Sprints mit kontrollierter Erholung.'),
  defaultPlan('plan_sprint_03', 'Explosiv 900', 'sprint', 'fokussiert', 'kraul', 900, 20, 18, 'Intensiver Mix fuer Starts, Wenden und Endbeschleunigung.'),
  defaultPlan('plan_sprint_04', 'Race Pace', 'sprint', 'fokussiert', 'kraul', 1100, 24, 21, 'Hohe Geschwindigkeit mit kurzen Entlastungsphasen.'),
  defaultPlan('plan_sprint_05', 'Sprint Maximum', 'sprint', 'anspruchsvoll', 'kraul', 1300, 27, 28, 'Sehr intensive Serien fuer Tempohaerte und Renndruck.'),
  defaultPlan('plan_technik_01', 'Kraul Sauberkeit', 'technik', 'angenehm', 'kraul', 900, 30, 13, 'Techniktempo mit Fokus auf Zugweg und Atmungsrhythmus.'),
  defaultPlan('plan_technik_02', 'Brust Linie', 'technik', 'angenehm', 'brust', 900, 32, 13, 'Beinschlag und Gleitphase sauber koordinieren.'),
  defaultPlan('plan_technik_03', 'Ruecken Kontrolle', 'technik', 'fokussiert', 'rücken', 1000, 33, 18, 'Koerperspannung und Armzug fuer stabile Wasserlage.'),
  defaultPlan('plan_technik_04', 'Schmetterling Basis', 'technik', 'fokussiert', 'schmetterling', 600, 24, 22, 'Delphinbewegung, Timing und gleichmaessige Wellenarbeit.'),
  defaultPlan('plan_technik_05', 'Technik Master', 'technik', 'anspruchsvoll', 'lagen', 1400, 42, 28, 'Lagenfokus fuer Stilwechsel, Technikuebergaenge und Kontrolle.'),
  defaultPlan('plan_kombi_01', 'Kombi Einstieg', 'kombi', 'angenehm', 'lagen', 1000, 31, 15, 'Ausdauer plus Technik in einer runden Lageneinheit.'),
  defaultPlan('plan_kombi_02', 'Kombi Aufbau', 'kombi', 'angenehm', 'lagen', 1400, 40, 17, 'Mehr Umfang mit sauberem Stilwechsel.'),
  defaultPlan('plan_kombi_03', 'Kombi Tempo', 'kombi', 'fokussiert', 'lagen', 1800, 49, 21, 'Mittelstrecke mit Technikdruck und Tempowechsel.'),
  defaultPlan('plan_kombi_04', 'Kombi Wettkampf', 'kombi', 'fokussiert', 'lagen', 2200, 58, 24, 'Hoher Umfang mit Wettkampfcharakter.'),
  defaultPlan('plan_kombi_05', 'Kombi Elite', 'kombi', 'anspruchsvoll', 'lagen', 2600, 68, 32, 'Komplette Belastung fuer Ausdauer, Technik und Tempo.')
];

export const getDefaultSwimTrainingPlanById = (planIdInput: unknown) => {
  const planId = String(planIdInput || '').trim();
  if (!planId) {
    return null;
  }

  return DEFAULT_SWIM_TRAINING_PLANS.find((plan) => plan.id === planId) || null;
};
