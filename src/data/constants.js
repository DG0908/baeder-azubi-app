export const CATEGORIES = [
  { id: 'org', name: 'Bäderorganisation', color: 'bg-blue-500', icon: '📋' },
  { id: 'pol', name: 'Politik & Wirtschaft', color: 'bg-green-500', icon: '🏛️' },
  { id: 'aevo', name: 'Ausbildereignung', color: 'bg-indigo-500', icon: '🎓' },
  { id: 'math', name: 'Mathematik', color: 'bg-orange-500', icon: '🧮' },
  { id: 'tech', name: 'Bädertechnik', color: 'bg-purple-500', icon: '⚗️' },
  { id: 'swim', name: 'Schwimm- & Rettungslehre', color: 'bg-cyan-500', icon: '🏊' },
  { id: 'first', name: 'Erste Hilfe', color: 'bg-red-500', icon: '🚑' },
  { id: 'hygiene', name: 'Hygiene', color: 'bg-yellow-500', icon: '🧼' },
  { id: 'health', name: 'Gesundheitslehre', color: 'bg-pink-500', icon: '🫀' }
];

// Default Menu Items Configuration
export const DEFAULT_MENU_ITEMS = [
  { id: 'home', icon: '🏠', label: 'Start', visible: true, order: 0, requiresPermission: null, group: 'home' },
  { id: 'exam-simulator', icon: '📝', label: 'Prüfungssimulator', visible: true, order: 1, requiresPermission: null, group: 'lernen' },
  { id: 'flashcards', icon: '🎴', label: 'Karteikarten', visible: true, order: 2, requiresPermission: null, group: 'lernen' },
  { id: 'calculator', icon: '🧮', label: 'Rechner', visible: true, order: 3, requiresPermission: null, group: 'lernen' },
  { id: 'quiz', icon: '🎮', label: 'Quizduell', visible: true, order: 4, requiresPermission: null, group: 'sozial' },
  { id: 'swim-challenge', icon: '🏊', label: 'Schwimm-Challenge', visible: true, order: 5, requiresPermission: null, group: 'lernen' },
  { id: 'stats', icon: '🏅', label: 'Statistiken', visible: true, order: 6, requiresPermission: null, group: 'sozial' },
  { id: 'trainer-dashboard', icon: '👨‍🏫', label: 'Azubi-Übersicht', visible: true, order: 7, requiresPermission: 'canViewAllStats', group: 'verwaltung' },
  { id: 'chat', icon: '💬', label: 'Chat', visible: true, order: 8, requiresPermission: null, group: 'sozial' },
  { id: 'materials', icon: '📚', label: 'Lernen', visible: true, order: 9, requiresPermission: null, group: 'lernen' },
  { id: 'interactive-learning', icon: '🎓', label: 'Interaktives Lernen', visible: true, order: 9.5, requiresPermission: null, group: 'lernen' },
  { id: 'resources', icon: '🔗', label: 'Ressourcen', visible: true, order: 10, requiresPermission: null, group: 'lernen' },
  { id: 'news', icon: '📢', label: 'News', visible: true, order: 11, requiresPermission: null, group: 'sozial' },
  { id: 'exams', icon: '📋', label: 'Klausuren', visible: true, order: 12, requiresPermission: null, group: 'dokumentieren' },
  { id: 'questions', icon: '💡', label: 'Fragen', visible: true, order: 13, requiresPermission: null, group: 'lernen' },
  { id: 'school-card', icon: '🎓', label: 'Kontrollkarte', visible: true, order: 14, requiresPermission: null, group: 'dokumentieren' },
  { id: 'berichtsheft', icon: '📖', label: 'Berichtsheft', visible: true, order: 15, requiresPermission: null, group: 'dokumentieren' },
  { id: 'profile', icon: '👤', label: 'Profil', visible: true, order: 16, requiresPermission: null, group: 'profil' },
  { id: 'admin', icon: '⚙️', label: 'Verwaltung', visible: true, order: 17, requiresPermission: 'canManageUsers', group: 'verwaltung' }
];

// Menu group labels for "Mehr"-Drawer
export const MENU_GROUP_LABELS = {
  home: '',
  lernen: '📚 Lernen',
  dokumentieren: '📋 Dokumentieren',
  sozial: '💬 Soziales',
  verwaltung: '⚙️ Verwaltung',
  profil: '👤 Profil'
};

// Level system: every 200 XP = 1 level
export const getLevel = (totalXp) => Math.floor((totalXp || 0) / 200) + 1;
export const getLevelProgress = (totalXp) => ((totalXp || 0) % 200) / 200;
export const getXpToNextLevel = (totalXp) => 200 - ((totalXp || 0) % 200);

// Default Theme Colors
export const DEFAULT_THEME_COLORS = {
  primary: '#0ea5e9',
  secondary: '#64748b',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#eab308'
};

export const PERMISSIONS = {
  admin: {
    label: 'Administrator',
    canManageUsers: true,
    canApproveQuestions: true,
    canUploadMaterials: true,
    canPostNews: true,
    canViewAllStats: true,
    canDeleteData: true
  },
  trainer: {
    label: 'Ausbilder',
    canManageUsers: false,
    canApproveQuestions: true,
    canUploadMaterials: true,
    canPostNews: true,
    canViewAllStats: true,
    canDeleteData: false
  },
  azubi: {
    label: 'Azubi',
    canManageUsers: false,
    canApproveQuestions: false,
    canUploadMaterials: false,
    canPostNews: false,
    canViewAllStats: false,
    canDeleteData: false
  }
};

// Demo-Accounts entfernt - alle Logins laufen über Supabase
export const DEMO_ACCOUNTS = {};

// Avatar-Auswahl für Profil
export const AVATARS = [
  // Start-Avatare (direkt verfuegbar)
  { id: 'aqua_core', label: 'Aqua Core', shortCode: 'AC', discipline: 'Allround', rarity: 'common', theme: 'ocean', shape: 'orb' },
  { id: 'flow_sentinel', label: 'Flow Sentinel', shortCode: 'FS', discipline: 'Schwimmen & Rettung', rarity: 'common', theme: 'rescue', shape: 'ring' },
  { id: 'tech_matrix', label: 'Tech Matrix', shortCode: 'TM', discipline: 'Baedertechnik', rarity: 'common', theme: 'tech', shape: 'prism' },
  { id: 'hygiene_aegis', label: 'Hygiene Aegis', shortCode: 'HA', discipline: 'Hygiene', rarity: 'common', theme: 'hygiene', shape: 'crystal' },
  { id: 'aid_beacon', label: 'Aid Beacon', shortCode: 'AB', discipline: 'Erste Hilfe', rarity: 'common', theme: 'firstaid', shape: 'diamond' },

  // Level-basierte 3D-Avatare
  { id: 'aqua_cadet', label: 'Aqua Kadett', shortCode: 'AK', discipline: 'Allround', rarity: 'bronze', theme: 'ocean', shape: 'orb', minLevel: 2 },
  { id: 'shades_swimmer', label: 'Current Runner', shortCode: 'CR', discipline: 'Schwimmen & Rettung', rarity: 'bronze', theme: 'rescue', shape: 'ring', minLevel: 3 },
  { id: 'whistle_coach', label: 'Signal Coach', shortCode: 'SC', discipline: 'Allround', rarity: 'bronze', theme: 'tech', shape: 'prism', minLevel: 4 },
  { id: 'turbo_dolphin', label: 'Turbo Vector', shortCode: 'TV', discipline: 'Schwimmen & Rettung', rarity: 'silver', theme: 'ocean', shape: 'diamond', minLevel: 5 },
  { id: 'ring_commander', label: 'Ring Commander', shortCode: 'RC', discipline: 'Schwimmen & Rettung', rarity: 'silver', theme: 'rescue', shape: 'ring', minLevel: 6 },
  { id: 'shark_guard', label: 'Deep Guard', shortCode: 'DG', discipline: 'Schwimmen & Rettung', rarity: 'silver', theme: 'rescue', shape: 'shield', minLevel: 7 },
  { id: 'trident_master', label: 'Trident Master', shortCode: 'TR', discipline: 'Allround', rarity: 'gold', theme: 'ocean', shape: 'prism', minLevel: 8 },
  { id: 'sunset_surfer', label: 'Solar Drift', shortCode: 'SD', discipline: 'Allround', rarity: 'gold', theme: 'elite', shape: 'orb', minLevel: 9 },
  { id: 'pool_boss', label: 'Pool Boss', shortCode: 'PB', discipline: 'Allround', rarity: 'gold', theme: 'elite', shape: 'crown', minLevel: 10 },
  { id: 'whistle_legend', label: 'Whistle Legend', shortCode: 'WL', discipline: 'Allround', rarity: 'legendary', theme: 'elite', shape: 'crown', minLevel: 12 },

  // Premium-Avatare: Disziplin-basiert freischaltbar
  {
    id: 'technik_scout',
    label: 'Technik Scout',
    shortCode: 'TS',
    discipline: 'Baedertechnik',
    rarity: 'bronze',
    theme: 'tech',
    shape: 'prism',
    unlock: {
      requirements: [
        { metric: 'techCorrect', target: 35 },
        { metric: 'totalXp', target: 600 }
      ]
    }
  },
  {
    id: 'technik_architekt',
    label: 'Anlagen Architekt',
    shortCode: 'AA',
    discipline: 'Baedertechnik',
    rarity: 'gold',
    theme: 'tech',
    shape: 'crown',
    unlock: {
      requirements: [
        { metric: 'techCorrect', target: 90 },
        { metric: 'quizWins', target: 25 }
      ]
    }
  },
  {
    id: 'rettung_captain',
    label: 'Rettung Captain',
    shortCode: 'RT',
    discipline: 'Schwimmen & Rettung',
    rarity: 'silver',
    theme: 'rescue',
    shape: 'ring',
    unlock: {
      requirements: [
        { metric: 'swimCorrect', target: 40 },
        { metric: 'swimSessions', target: 10 }
      ]
    }
  },
  {
    id: 'arena_champion',
    label: 'Arena Champion',
    shortCode: 'AR',
    discipline: 'Schwimmen & Rettung',
    rarity: 'gold',
    theme: 'rescue',
    shape: 'crown',
    unlock: {
      requirements: [
        { metric: 'swimCorrect', target: 90 },
        { metric: 'swimDistance', target: 8000 }
      ]
    }
  },
  {
    id: 'hygiene_guardian',
    label: 'Hygiene Guardian',
    shortCode: 'HG',
    discipline: 'Hygiene',
    rarity: 'silver',
    theme: 'hygiene',
    shape: 'shield',
    unlock: {
      requirements: [
        { metric: 'hygieneCorrect', target: 35 },
        { metric: 'totalCorrect', target: 140 }
      ]
    }
  },
  {
    id: 'sterile_oracle',
    label: 'Sterile Oracle',
    shortCode: 'SO',
    discipline: 'Hygiene',
    rarity: 'gold',
    theme: 'hygiene',
    shape: 'crystal',
    unlock: {
      requirements: [
        { metric: 'hygieneCorrect', target: 80 },
        { metric: 'badgeCount', target: 5 }
      ]
    }
  },
  {
    id: 'firstaid_guardian',
    label: 'First Aid Guardian',
    shortCode: 'FA',
    discipline: 'Erste Hilfe',
    rarity: 'silver',
    theme: 'firstaid',
    shape: 'shield',
    unlock: {
      requirements: [
        { metric: 'firstAidCorrect', target: 35 },
        { metric: 'quizWins', target: 14 }
      ]
    }
  },
  {
    id: 'rescue_legend',
    label: 'Rescue Legend',
    shortCode: 'RL',
    discipline: 'Erste Hilfe',
    rarity: 'legendary',
    theme: 'firstaid',
    shape: 'crown',
    unlock: {
      requirements: [
        { metric: 'firstAidCorrect', target: 80 },
        { metric: 'totalXp', target: 2200 },
        { metric: 'badgeCount', target: 8 }
      ]
    }
  },
  {
    id: 'aqua_grandmaster',
    label: 'Aqua Grandmaster',
    shortCode: 'AG',
    discipline: 'Allround',
    rarity: 'legendary',
    theme: 'elite',
    shape: 'crown',
    unlock: {
      requirements: [
        { metric: 'level', target: 16 },
        { metric: 'totalCorrect', target: 320 },
        { metric: 'swimDistance', target: 12000 },
        { metric: 'badgeCount', target: 12 }
      ]
    }
  }
];

export const getAvatarById = (avatarId) => AVATARS.find((avatar) => avatar.id === avatarId) || null;

export const getAvatarShortCode = (avatarInput) => {
  if (!avatarInput) return '3D';
  if (avatarInput.shortCode) return String(avatarInput.shortCode).toUpperCase();
  const parts = String(avatarInput.label || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return ((parts[0][0] || '') + (parts[1][0] || '')).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return '3D';
};
