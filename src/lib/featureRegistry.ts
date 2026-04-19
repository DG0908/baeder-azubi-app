/**
 * Frontend-Spiegel zu server/src/modules/feature-rollout/feature-registry.ts
 * Keys, Rollen und Default-Stages muessen konsistent gehalten werden.
 *
 * Rollen werden hier als Frontend-String-Form gehalten ('admin', 'trainer', ...),
 * weil das Frontend diese Form in user.role verwendet.
 */

export type FeatureStage = 'alpha' | 'beta' | 'stable';
export type FrontendRoleKey = 'admin' | 'trainer' | 'azubi' | 'rettungsschwimmer_azubi';

export interface FeatureDefinition {
  key: string;
  label: string;
  requiredRoles: FrontendRoleKey[];
  defaultStage: FeatureStage;
  alwaysOn?: boolean;
}

export const FEATURE_STAGES: readonly FeatureStage[] = ['alpha', 'beta', 'stable'] as const;

const ALL_ROLES: FrontendRoleKey[] = ['admin', 'trainer', 'azubi', 'rettungsschwimmer_azubi'];
const TRAINER_ROLES: FrontendRoleKey[] = ['admin', 'trainer'];
const ADMIN_ONLY: FrontendRoleKey[] = ['admin'];

export const APP_FEATURE_REGISTRY: FeatureDefinition[] = [
  { key: 'home',                 label: 'Home',                   requiredRoles: ALL_ROLES,     defaultStage: 'stable', alwaysOn: true },
  { key: 'profile',              label: 'Profil',                 requiredRoles: ALL_ROLES,     defaultStage: 'stable', alwaysOn: true },

  { key: 'quiz',                 label: 'Quiz',                   requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'flashcards',           label: 'Karteikarten',           requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'exam-simulator',       label: 'Pruefungs-Simulator',    requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'calculator',           label: 'Rechner',                requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'interactive-learning', label: 'Interaktives Lernen',    requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'materials',            label: 'Materialien',            requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'resources',            label: 'Ressourcen',             requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'notfall-trainer',      label: 'Notfall-Trainer',        requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'swim-challenge',       label: 'Schwimm-Challenge',      requiredRoles: ALL_ROLES,     defaultStage: 'stable' },

  { key: 'chat',                 label: 'Chat',                   requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'forum',                label: 'Forum',                  requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'news',                 label: 'News',                   requiredRoles: ALL_ROLES,     defaultStage: 'stable' },

  { key: 'berichtsheft',         label: 'Berichtsheft',           requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'school-card',          label: 'Schul-Karte',            requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'exams',                label: 'Pruefungen',             requiredRoles: ALL_ROLES,     defaultStage: 'stable' },
  { key: 'stats',                label: 'Statistiken',            requiredRoles: ALL_ROLES,     defaultStage: 'stable' },

  { key: 'trainer-dashboard',    label: 'Ausbilder-Dashboard',    requiredRoles: TRAINER_ROLES, defaultStage: 'stable' },
  { key: 'questions',            label: 'Fragen-Workflow',        requiredRoles: TRAINER_ROLES, defaultStage: 'stable' },
  { key: 'admin',                label: 'Admin-Bereich',          requiredRoles: ADMIN_ONLY,    defaultStage: 'stable' }
];

const KNOWN_KEYS = new Set(APP_FEATURE_REGISTRY.map((f) => f.key));

export const isKnownFeatureKey = (key: string): boolean => KNOWN_KEYS.has(key);

export const getFeatureDefinition = (key: string): FeatureDefinition | undefined =>
  APP_FEATURE_REGISTRY.find((f) => f.key === key);
