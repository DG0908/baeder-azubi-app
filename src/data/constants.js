export const CATEGORIES = [
  { id: 'org', name: 'BÃ¤derorganisation', color: 'bg-blue-500', icon: 'ðŸ“‹' },
  { id: 'pol', name: 'Politik & Wirtschaft', color: 'bg-green-500', icon: 'ðŸ›ï¸' },
  { id: 'aevo', name: 'Ausbildereignung', color: 'bg-indigo-500', icon: 'ðŸŽ“' },
    { id: 'guess', name: 'Was bin ich?', color: 'bg-slate-700', icon: 'WB' },
  { id: 'tech', name: 'BÃ¤dertechnik', color: 'bg-purple-500', icon: 'âš—ï¸' },
  { id: 'swim', name: 'Schwimm- & Rettungslehre', color: 'bg-cyan-500', icon: 'ðŸŠ' },
  { id: 'first', name: 'Erste Hilfe', color: 'bg-red-500', icon: 'ðŸš‘' },
  { id: 'hygiene', name: 'Hygiene', color: 'bg-yellow-500', icon: 'ðŸ§¼' },
  { id: 'health', name: 'Gesundheitslehre', color: 'bg-pink-500', icon: 'ðŸ«€' }
];

// Default Menu Items Configuration
export const DEFAULT_MENU_ITEMS = [
  { id: 'home', icon: 'ðŸ ', label: 'Start', visible: true, order: 0, requiresPermission: null, group: 'home' },
  { id: 'exam-simulator', icon: 'ðŸ“', label: 'PrÃ¼fungssimulator', visible: true, order: 1, requiresPermission: null, group: 'lernen' },
  { id: 'flashcards', icon: 'ðŸŽ´', label: 'Karteikarten', visible: true, order: 2, requiresPermission: null, group: 'lernen' },
  { id: 'calculator', icon: 'ðŸ§®', label: 'Rechner', visible: true, order: 3, requiresPermission: null, group: 'lernen' },
  { id: 'quiz', icon: 'ðŸŽ®', label: 'Quizduell', visible: true, order: 4, requiresPermission: null, group: 'sozial' },
  { id: 'swim-challenge', icon: 'ðŸŠ', label: 'Schwimm-Challenge', visible: true, order: 5, requiresPermission: null, group: 'lernen' },
  { id: 'stats', icon: 'ðŸ…', label: 'Statistiken', visible: true, order: 6, requiresPermission: null, group: 'sozial' },
  { id: 'trainer-dashboard', icon: 'ðŸ‘¨â€ðŸ«', label: 'Azubi-Ãœbersicht', visible: true, order: 7, requiresPermission: 'canViewAllStats', group: 'verwaltung' },
  { id: 'chat', icon: 'ðŸ’¬', label: 'Chat', visible: true, order: 8, requiresPermission: null, group: 'sozial' },
  { id: 'materials', icon: 'ðŸ“š', label: 'Lernen', visible: true, order: 9, requiresPermission: null, group: 'lernen' },
  { id: 'interactive-learning', icon: 'ðŸŽ“', label: 'Interaktives Lernen', visible: true, order: 9.5, requiresPermission: null, group: 'lernen' },
  { id: 'resources', icon: 'ðŸ”—', label: 'Ressourcen', visible: true, order: 10, requiresPermission: null, group: 'lernen' },
  { id: 'news', icon: 'ðŸ“¢', label: 'News', visible: true, order: 11, requiresPermission: null, group: 'sozial' },
  { id: 'exams', icon: 'ðŸ“‹', label: 'Klausuren', visible: true, order: 12, requiresPermission: null, group: 'dokumentieren' },
  { id: 'questions', icon: 'ðŸ’¡', label: 'Fragen', visible: true, order: 13, requiresPermission: null, group: 'lernen' },
  { id: 'school-card', icon: 'ðŸŽ“', label: 'Kontrollkarte', visible: true, order: 14, requiresPermission: null, group: 'dokumentieren' },
  { id: 'berichtsheft', icon: 'ðŸ“–', label: 'Berichtsheft', visible: true, order: 15, requiresPermission: null, group: 'dokumentieren' },
  { id: 'profile', icon: 'ðŸ‘¤', label: 'Profil', visible: true, order: 16, requiresPermission: null, group: 'profil' },
  { id: 'admin', icon: 'âš™ï¸', label: 'Verwaltung', visible: true, order: 17, requiresPermission: 'canManageUsers', group: 'verwaltung' }
];

// Menu group labels for "Mehr"-Drawer
export const MENU_GROUP_LABELS = {
  home: '',
  lernen: 'ðŸ“š Lernen',
  dokumentieren: 'ðŸ“‹ Dokumentieren',
  sozial: 'ðŸ’¬ Soziales',
  verwaltung: 'âš™ï¸ Verwaltung',
  profil: 'ðŸ‘¤ Profil'
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

// Demo-Accounts entfernt - alle Logins laufen Ã¼ber Supabase
export const DEMO_ACCOUNTS = {};

// Avatar-Auswahl fÃ¼r Profil
export const AVATARS = [
  // Start-Avatare (direkt verfügbar)
  { id: 'aqua_core', label: 'Delfin Scout', shortCode: 'AC', animalIcon: 'ðŸ¬', discipline: 'Allround', rarity: 'common', theme: 'ocean', shape: 'orb' },
  { id: 'flow_sentinel', label: 'Hai Waechter', shortCode: 'FS', animalIcon: 'ðŸ¦ˆ', discipline: 'Schwimmen & Rettung', rarity: 'common', theme: 'rescue', shape: 'ring' },
  { id: 'tech_matrix', label: 'Oktopus Tueftler', shortCode: 'TM', animalIcon: 'ðŸ™', discipline: 'Bädertechnik', rarity: 'common', theme: 'tech', shape: 'prism' },
  { id: 'hygiene_aegis', label: 'Schildkroeten Hueter', shortCode: 'HA', animalIcon: 'ðŸ¢', discipline: 'Hygiene', rarity: 'common', theme: 'hygiene', shape: 'crystal' },
  { id: 'aid_beacon', label: 'Adler Retter', shortCode: 'AB', animalIcon: 'ðŸ¦…', discipline: 'Erste Hilfe', rarity: 'common', theme: 'firstaid', shape: 'diamond' },

  // Level-basierte 3D-Avatare
  { id: 'aqua_cadet', label: 'Panther Kadett', shortCode: 'AK', animalIcon: 'ðŸ†', discipline: 'Allround', rarity: 'bronze', theme: 'ocean', shape: 'orb', minLevel: 2 },
  { id: 'shades_swimmer', label: 'Cooler Delfin', shortCode: 'CR', animalIcon: 'ðŸ¬', sunglasses: true, discipline: 'Schwimmen & Rettung', rarity: 'bronze', theme: 'rescue', shape: 'ring', minLevel: 3 },
  { id: 'whistle_coach', label: 'Wolf Coach', shortCode: 'SC', animalIcon: 'ðŸº', discipline: 'Allround', rarity: 'bronze', theme: 'tech', shape: 'prism', minLevel: 4 },
  { id: 'turbo_dolphin', label: 'Turbo Gepard', shortCode: 'TV', animalIcon: 'ðŸ†', discipline: 'Schwimmen & Rettung', rarity: 'silver', theme: 'ocean', shape: 'diamond', minLevel: 5 },
  { id: 'ring_commander', label: 'Orca Commander', shortCode: 'RC', animalIcon: 'ðŸ‹', sunglasses: true, discipline: 'Schwimmen & Rettung', rarity: 'silver', theme: 'rescue', shape: 'ring', minLevel: 6 },
  { id: 'shark_guard', label: 'Alpha Hai', shortCode: 'DG', animalIcon: 'ðŸ¦ˆ', discipline: 'Schwimmen & Rettung', rarity: 'silver', theme: 'rescue', shape: 'shield', minLevel: 7 },
  { id: 'trident_master', label: 'Loewen Meister', shortCode: 'TR', animalIcon: 'ðŸ¦', sunglasses: true, discipline: 'Allround', rarity: 'gold', theme: 'ocean', shape: 'prism', minLevel: 8 },
  { id: 'sunset_surfer', label: 'Adler Surfer', shortCode: 'SD', animalIcon: 'ðŸ¦…', sunglasses: true, discipline: 'Allround', rarity: 'gold', theme: 'elite', shape: 'orb', minLevel: 9 },
  { id: 'pool_boss', label: 'Baeren Boss', shortCode: 'PB', animalIcon: 'ðŸ»', sunglasses: true, discipline: 'Allround', rarity: 'gold', theme: 'elite', shape: 'crown', minLevel: 10 },
  { id: 'whistle_legend', label: 'Koenigs Adler', shortCode: 'WL', animalIcon: 'ðŸ¦…', sunglasses: true, discipline: 'Allround', rarity: 'legendary', theme: 'elite', shape: 'crown', minLevel: 12 },

  // Premium-Avatare: Disziplin-basiert freischaltbar
  {
    id: 'technik_scout',
    label: 'Fuchs Ingenieur',
    shortCode: 'TS',
    animalIcon: 'ðŸ¦Š',
    discipline: 'Bädertechnik',
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
    animalIcon: 'ðŸ¦‰',
    sunglasses: true,
    discipline: 'Bädertechnik',
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
    animalIcon: 'ðŸ‹',
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
    animalIcon: 'ðŸ¦ˆ',
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
    animalIcon: 'ðŸ¼',
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
    animalIcon: 'ðŸ¦‰',
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
    animalIcon: 'ðŸ•',
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
    animalIcon: 'ðŸ¦',
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
    animalIcon: 'ðŸ‰',
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
  if (shape === 'orb') return 'â—‰';
  if (shape === 'ring') return 'â—Ž';
  if (shape === 'prism') return 'â¬¢';
  if (shape === 'crystal') return 'âœ¦';
  if (shape === 'diamond') return 'â—†';
  if (shape === 'shield') return 'â¬Ÿ';
  if (shape === 'crown') return 'â™›';
  return 'â—ˆ';
};

export const avatarHasSunglasses = (avatarInput) => {
  if (!avatarInput) return false;
  if (avatarInput.sunglasses) return true;
  const rarity = String(avatarInput.rarity || '').toLowerCase();
  return rarity === 'gold' || rarity === 'legendary';
};

