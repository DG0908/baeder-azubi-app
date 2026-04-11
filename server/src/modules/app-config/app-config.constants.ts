export const APP_CONFIG_MENU_IDS = [
  'home',
  'exam-simulator',
  'flashcards',
  'calculator',
  'quiz',
  'swim-challenge',
  'stats',
  'trainer-dashboard',
  'chat',
  'forum',
  'materials',
  'interactive-learning',
  'notfall-trainer',
  'resources',
  'news',
  'exams',
  'questions',
  'school-card',
  'berichtsheft',
  'profile',
  'admin'
] as const;

export const APP_CONFIG_GROUP_IDS = [
  'home',
  'lernen',
  'dokumentieren',
  'sozial',
  'verwaltung',
  'profil'
] as const;

export const APP_CONFIG_PERMISSION_KEYS = [
  'canViewAllStats',
  'canManageUsers'
] as const;

export const APP_CONFIG_THEME_KEYS = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning'
] as const;

export const APP_CONFIG_DEFAULT_THEME_COLORS = {
  primary: '#0ea5e9',
  secondary: '#64748b',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#eab308'
} as const;

/** Known feature-flag keys. Unknown keys are stripped on write. */
export const APP_CONFIG_FEATURE_FLAG_KEYS = [
  'quizMaintenance'
] as const;

export type AppFeatureFlagKey = (typeof APP_CONFIG_FEATURE_FLAG_KEYS)[number];

export const APP_CONFIG_DEFAULT_FEATURE_FLAGS: Record<AppFeatureFlagKey, boolean> = {
  quizMaintenance: false
};
