import { AppRole } from '@prisma/client';

export type FeatureStage = 'alpha' | 'beta' | 'stable';

export const FEATURE_STAGES: readonly FeatureStage[] = [
  'alpha',
  'beta',
  'stable'
] as const;

export interface FeatureDefinition {
  readonly key: string;
  readonly label: string;
  readonly requiredRoles: readonly AppRole[];
  readonly defaultStage: FeatureStage;
  /** Always-on features that cannot be gated by stage (e.g. home, profile). */
  readonly alwaysOn?: boolean;
}

const ALL_ROLES: readonly AppRole[] = [
  AppRole.ADMIN,
  AppRole.AUSBILDER,
  AppRole.AZUBI,
  AppRole.RETTUNGSSCHWIMMER_AZUBI
] as const;

const TRAINER_ROLES: readonly AppRole[] = [
  AppRole.ADMIN,
  AppRole.AUSBILDER
] as const;

const ADMIN_ONLY: readonly AppRole[] = [AppRole.ADMIN] as const;

export const APP_FEATURE_REGISTRY: readonly FeatureDefinition[] = [
  { key: 'home', label: 'Home', requiredRoles: ALL_ROLES, defaultStage: 'stable', alwaysOn: true },
  { key: 'profile', label: 'Profil', requiredRoles: ALL_ROLES, defaultStage: 'stable', alwaysOn: true },

  { key: 'quiz', label: 'Quiz', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'flashcards', label: 'Karteikarten', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'exam-simulator', label: 'Pruefungs-Simulator', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'calculator', label: 'Rechner', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'interactive-learning', label: 'Interaktives Lernen', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'materials', label: 'Materialien', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'resources', label: 'Ressourcen', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'notfall-trainer', label: 'Notfall-Trainer', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'swim-challenge', label: 'Schwimm-Challenge', requiredRoles: ALL_ROLES, defaultStage: 'stable' },

  { key: 'chat', label: 'Chat', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'forum', label: 'Forum', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'news', label: 'News', requiredRoles: ALL_ROLES, defaultStage: 'stable' },

  { key: 'berichtsheft', label: 'Berichtsheft', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'school-card', label: 'Schul-Karte', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'exams', label: 'Pruefungen', requiredRoles: ALL_ROLES, defaultStage: 'stable' },
  { key: 'stats', label: 'Statistiken', requiredRoles: ALL_ROLES, defaultStage: 'stable' },

  { key: 'trainer-dashboard', label: 'Ausbilder-Dashboard', requiredRoles: TRAINER_ROLES, defaultStage: 'stable' },
  { key: 'questions', label: 'Fragen-Workflow', requiredRoles: TRAINER_ROLES, defaultStage: 'stable' },

  { key: 'admin', label: 'Admin-Bereich', requiredRoles: ADMIN_ONLY, defaultStage: 'stable' }
] as const;

const REGISTRY_BY_KEY: ReadonlyMap<string, FeatureDefinition> = new Map(
  APP_FEATURE_REGISTRY.map((feature) => [feature.key, feature])
);

export function getFeatureDefinition(key: string): FeatureDefinition | undefined {
  return REGISTRY_BY_KEY.get(key);
}

export function isKnownFeatureKey(key: string): boolean {
  return REGISTRY_BY_KEY.has(key);
}

export function isValidStage(value: unknown): value is FeatureStage {
  return typeof value === 'string' && (FEATURE_STAGES as readonly string[]).includes(value);
}
