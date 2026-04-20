const SWIM_PLAN_NOTE_TAG_REGEX = /\[SWIM_PLAN:([a-z0-9_-]+)\]/i;
const SWIM_PLAN_NOTE_UNIT_TAG_REGEX = /\[SWIM_PLAN_UNIT:([a-z0-9_-]+)\]/i;

export const extractTrainingPlanIdFromNotes = (notesInput) => {
  const notes = String(notesInput || '');
  const match = notes.match(SWIM_PLAN_NOTE_TAG_REGEX);
  return match?.[1] || null;
};

export const extractTrainingPlanUnitIdFromNotes = (notesInput) => {
  const notes = String(notesInput || '');
  const match = notes.match(SWIM_PLAN_NOTE_UNIT_TAG_REGEX);
  return match?.[1] || null;
};

export const extractTrainingPlanSelectionFromNotes = (notesInput) => ({
  trainingPlanId: extractTrainingPlanIdFromNotes(notesInput),
  trainingPlanUnitId: extractTrainingPlanUnitIdFromNotes(notesInput),
});

export const stripTrainingPlanTagFromNotes = (notesInput) =>
  String(notesInput || '')
    .replace(/\s*\[SWIM_PLAN:[^\]]+\]\s*/gi, ' ')
    .replace(/\s*\[SWIM_PLAN_UNIT:[^\]]+\]\s*/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
