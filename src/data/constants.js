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
  { id: 'aqua_core', label: 'Delfin Scout', shortCode: 'AC', animalIcon: '🐬', discipline: 'Allround', rarity: 'common', theme: 'ocean', shape: 'orb' },
  { id: 'flow_sentinel', label: 'Hai Waechter', shortCode: 'FS', animalIcon: '🦈', discipline: 'Schwimmen & Rettung', rarity: 'common', theme: 'rescue', shape: 'ring' },
  { id: 'tech_matrix', label: 'Oktopus Tueftler', shortCode: 'TM', animalIcon: '🐙', discipline: 'Baedertechnik', rarity: 'common', theme: 'tech', shape: 'prism' },
  { id: 'hygiene_aegis', label: 'Schildkroeten Hueter', shortCode: 'HA', animalIcon: '🐢', discipline: 'Hygiene', rarity: 'common', theme: 'hygiene', shape: 'crystal' },
  { id: 'aid_beacon', label: 'Adler Retter', shortCode: 'AB', animalIcon: '🦅', discipline: 'Erste Hilfe', rarity: 'common', theme: 'firstaid', shape: 'diamond' },

  // Level-basierte 3D-Avatare
  { id: 'aqua_cadet', label: 'Panther Kadett', shortCode: 'AK', animalIcon: '🐆', discipline: 'Allround', rarity: 'bronze', theme: 'ocean', shape: 'orb', minLevel: 2 },
  { id: 'shades_swimmer', label: 'Cooler Delfin', shortCode: 'CR', animalIcon: '🐬', sunglasses: true, discipline: 'Schwimmen & Rettung', rarity: 'bronze', theme: 'rescue', shape: 'ring', minLevel: 3 },
  { id: 'whistle_coach', label: 'Wolf Coach', shortCode: 'SC', animalIcon: '🐺', discipline: 'Allround', rarity: 'bronze', theme: 'tech', shape: 'prism', minLevel: 4 },
  { id: 'turbo_dolphin', label: 'Turbo Gepard', shortCode: 'TV', animalIcon: '🐆', discipline: 'Schwimmen & Rettung', rarity: 'silver', theme: 'ocean', shape: 'diamond', minLevel: 5 },
  { id: 'ring_commander', label: 'Orca Commander', shortCode: 'RC', animalIcon: '🐋', sunglasses: true, discipline: 'Schwimmen & Rettung', rarity: 'silver', theme: 'rescue', shape: 'ring', minLevel: 6 },
  { id: 'shark_guard', label: 'Alpha Hai', shortCode: 'DG', animalIcon: '🦈', discipline: 'Schwimmen & Rettung', rarity: 'silver', theme: 'rescue', shape: 'shield', minLevel: 7 },
  { id: 'trident_master', label: 'Loewen Meister', shortCode: 'TR', animalIcon: '🦁', sunglasses: true, discipline: 'Allround', rarity: 'gold', theme: 'ocean', shape: 'prism', minLevel: 8 },
  { id: 'sunset_surfer', label: 'Adler Surfer', shortCode: 'SD', animalIcon: '🦅', sunglasses: true, discipline: 'Allround', rarity: 'gold', theme: 'elite', shape: 'orb', minLevel: 9 },
  { id: 'pool_boss', label: 'Baeren Boss', shortCode: 'PB', animalIcon: '🐻', sunglasses: true, discipline: 'Allround', rarity: 'gold', theme: 'elite', shape: 'crown', minLevel: 10 },
  { id: 'whistle_legend', label: 'Koenigs Adler', shortCode: 'WL', animalIcon: '🦅', sunglasses: true, discipline: 'Allround', rarity: 'legendary', theme: 'elite', shape: 'crown', minLevel: 12 },

  // Premium-Avatare: Disziplin-basiert freischaltbar
  {
    id: 'technik_scout',
    label: 'Fuchs Ingenieur',
    shortCode: 'TS',
    animalIcon: '🦊',
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
    label: 'Eulen Architekt',
    shortCode: 'AA',
    animalIcon: '🦉',
    sunglasses: true,
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
    label: 'Orca Captain',
    shortCode: 'RT',
    animalIcon: '🐋',
    sunglasses: true,
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
    label: 'Arenahai Champion',
    shortCode: 'AR',
    animalIcon: '🦈',
    sunglasses: true,
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
    label: 'Panda Guardian',
    shortCode: 'HG',
    animalIcon: '🐼',
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
    label: 'Schnee-Eule Orakel',
    shortCode: 'SO',
    animalIcon: '🦉',
    sunglasses: true,
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
    label: 'Labrador Retter',
    shortCode: 'FA',
    animalIcon: '🐕',
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
    label: 'Loewen Retter-Legende',
    shortCode: 'RL',
    animalIcon: '🦁',
    sunglasses: true,
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
    label: 'Drachen Grossmeister',
    shortCode: 'AG',
    animalIcon: '🐉',
    sunglasses: true,
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
  if (avatarInput?.animalIcon) return avatarInput.animalIcon;
  const shape = String(avatarInput?.shape || '').toLowerCase();
  if (shape === 'orb') return '◉';
  if (shape === 'ring') return '◎';
  if (shape === 'prism') return '⬢';
  if (shape === 'crystal') return '✦';
  if (shape === 'diamond') return '◆';
  if (shape === 'shield') return '⬟';
  if (shape === 'crown') return '♛';
  return '◈';
};

export const avatarHasSunglasses = (avatarInput) => {
  if (!avatarInput) return false;
  if (avatarInput.sunglasses) return true;
  const rarity = String(avatarInput.rarity || '').toLowerCase();
  return rarity === 'gold' || rarity === 'legendary';
};
