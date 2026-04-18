// Fragen-Format:
// - correct: number = Single-Choice (Index der richtigen Antwort)
// - correct: number[] = Multi-Select (Array der richtigen Indizes) - multi: true muss gesetzt sein
//
// Kategorien liegen pro Datei in src/data/quiz/ — dieser Assembler bündelt sie.
import { ORG_QUESTIONS } from './quiz/org.js';
import { TECH_QUESTIONS } from './quiz/tech.js';
import { SWIM_QUESTIONS } from './quiz/swim.js';
import { FIRST_QUESTIONS } from './quiz/first.js';
import { HYGIENE_QUESTIONS } from './quiz/hygiene.js';
import { POL_QUESTIONS } from './quiz/pol.js';
import { HEALTH_QUESTIONS } from './quiz/health.js';
import { AEVO_QUESTIONS, MATH_QUESTIONS } from './quizQuestionsExpansion.js';
import { WHO_AM_I_CATEGORY, WHO_AM_I_CHALLENGES } from './whoAmIChallenges.js';

export const SAMPLE_QUESTIONS = {
  org: ORG_QUESTIONS,
  [WHO_AM_I_CATEGORY.id]: WHO_AM_I_CHALLENGES[WHO_AM_I_CATEGORY.id] || [],
  tech: TECH_QUESTIONS,
  swim: SWIM_QUESTIONS,
  first: FIRST_QUESTIONS,
  hygiene: HYGIENE_QUESTIONS,
  pol: POL_QUESTIONS,
  aevo: AEVO_QUESTIONS,
  math: MATH_QUESTIONS,
  health: HEALTH_QUESTIONS,
};
