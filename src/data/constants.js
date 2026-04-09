export const CATEGORIES = [
  { id: 'org', name: 'B\u00e4derorganisation', color: 'bg-blue-500', icon: '\u{1F4CB}' },
  { id: 'pol', name: 'Politik & Wirtschaft', color: 'bg-green-500', icon: '\u{1F3DB}\uFE0F' },
  { id: 'aevo', name: 'Ausbildereignung', color: 'bg-indigo-500', icon: '\u{1F393}' },
  { id: 'guess', name: 'Was bin ich?', color: 'bg-slate-700', icon: 'WB' },
  { id: 'tech', name: 'B\u00e4dertechnik', color: 'bg-purple-500', icon: '\u2697\uFE0F' },
  { id: 'swim', name: 'Schwimm- & Rettungslehre', color: 'bg-cyan-500', icon: '\u{1F3CA}' },
  { id: 'first', name: 'Erste Hilfe', color: 'bg-red-500', icon: '\u{1F691}' },
  { id: 'hygiene', name: 'Hygiene', color: 'bg-yellow-500', icon: '\u{1F9FC}' },
  { id: 'health', name: 'Gesundheitslehre', color: 'bg-pink-500', icon: '\u{1FAC0}' }
];

export const DEFAULT_MENU_ITEMS = [
  { id: 'home', icon: '\u{1F3E0}', label: 'Start', visible: true, order: 0, requiresPermission: null, group: 'home' },
  { id: 'exam-simulator', icon: '\u{1F4DD}', label: 'Pr\u00fcfungssimulator', visible: true, order: 1, requiresPermission: null, group: 'lernen' },
  { id: 'flashcards', icon: '\u{1F3B4}', label: 'Karteikarten', visible: true, order: 2, requiresPermission: null, group: 'lernen' },
  { id: 'calculator', icon: '\u{1F9EE}', label: 'Rechner', visible: true, order: 3, requiresPermission: null, group: 'lernen' },
  { id: 'quiz', icon: '\u{1F3AE}', label: 'Quizduell', visible: true, order: 4, requiresPermission: null, group: 'sozial' },
  { id: 'swim-challenge', icon: '\u{1F3CA}', label: 'Schwimm-Challenge', visible: true, order: 5, requiresPermission: null, group: 'lernen' },
  { id: 'stats', icon: '\u{1F3C5}', label: 'Statistiken', visible: true, order: 6, requiresPermission: null, group: 'sozial' },
  { id: 'trainer-dashboard', icon: '\u{1F468}\u200D\u{1F3EB}', label: 'Azubi-\u00dcbersicht', visible: true, order: 7, requiresPermission: 'canViewAllStats', group: 'verwaltung' },
  { id: 'chat', icon: '\u{1F4AC}', label: 'Chat', visible: true, order: 8, requiresPermission: null, group: 'sozial' },
  { id: 'forum', icon: '\u{1F4DD}', label: 'Forum', visible: true, order: 8.5, requiresPermission: null, group: 'sozial' },
  { id: 'materials', icon: '\u{1F4DA}', label: 'Lernen', visible: true, order: 9, requiresPermission: null, group: 'lernen' },
  { id: 'interactive-learning', icon: '\u{1F393}', label: 'Interaktives Lernen', visible: true, order: 9.5, requiresPermission: null, group: 'lernen' },
  { id: 'notfall-trainer', icon: '\u{1F6A8}', label: 'Notfall-Trainer', visible: true, order: 9.8, requiresPermission: null, group: 'lernen' },
  { id: 'resources', icon: '\u{1F517}', label: 'Ressourcen', visible: true, order: 10, requiresPermission: null, group: 'lernen' },
  { id: 'news', icon: '\u{1F4E2}', label: 'News', visible: true, order: 11, requiresPermission: null, group: 'sozial' },
  { id: 'exams', icon: '\u{1F4CB}', label: 'Klausuren', visible: true, order: 12, requiresPermission: null, group: 'dokumentieren' },
  { id: 'questions', icon: '\u{1F4A1}', label: 'Fragen', visible: true, order: 13, requiresPermission: null, group: 'lernen' },
  { id: 'school-card', icon: '\u{1F393}', label: 'Kontrollkarte', visible: true, order: 14, requiresPermission: null, group: 'dokumentieren' },
  { id: 'berichtsheft', icon: '\u{1F4D6}', label: 'Berichtsheft', visible: true, order: 16, requiresPermission: null, group: 'dokumentieren' },
  { id: 'profile', icon: '\u{1F464}', label: 'Profil', visible: true, order: 17, requiresPermission: null, group: 'profil' },
  { id: 'admin', icon: '\u2699\uFE0F', label: 'Verwaltung', visible: true, order: 18, requiresPermission: 'canManageUsers', group: 'verwaltung' }
];

export const MENU_GROUP_LABELS = {
  home: '',
  lernen: '\u{1F4DA} Lernen',
  dokumentieren: '\u{1F4CB} Dokumentieren',
  sozial: '\u{1F4AC} Soziales',
  verwaltung: '\u2699\uFE0F Verwaltung',
  profil: '\u{1F464} Profil'
};

export const getLevel = (totalXp) => Math.floor((totalXp || 0) / 200) + 1;
export const getLevelProgress = (totalXp) => ((totalXp || 0) % 200) / 200;
export const getXpToNextLevel = (totalXp) => 200 - ((totalXp || 0) % 200);

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

export const DEMO_ACCOUNTS = {};

export const AVATARS = [
  { id: 'aqua_core', label: 'Delfin Scout', shortCode: 'AC', animalIcon: '\u{1F42C}', discipline: 'Allround', rarity: 'common', theme: 'ocean', shape: 'orb' },
  { id: 'flow_sentinel', label: 'Hai Waechter', shortCode: 'FS', animalIcon: '\u{1F988}', discipline: 'Schwimmen & Rettung', rarity: 'common', theme: 'rescue', shape: 'ring' },
  { id: 'tech_matrix', label: 'Oktopus Tueftler', shortCode: 'TM', animalIcon: '\u{1F419}', discipline: 'B\u00e4dertechnik', rarity: 'common', theme: 'tech', shape: 'prism' },
  { id: 'hygiene_aegis', label: 'Schildkroeten Hueter', shortCode: 'HA', animalIcon: '\u{1F422}', discipline: 'Hygiene', rarity: 'common', theme: 'hygiene', shape: 'crystal' },
  { id: 'aid_beacon', label: 'Adler Retter', shortCode: 'AB', animalIcon: '\u{1F985}', discipline: 'Erste Hilfe', rarity: 'common', theme: 'firstaid', shape: 'diamond' },
  { id: 'aqua_cadet', label: 'Panther Kadett', shortCode: 'AK', animalIcon: '\u{1F406}', discipline: 'Allround', rarity: 'bronze', theme: 'ocean', shape: 'orb', minLevel: 2 },
  { id: 'shades_swimmer', label: 'Cooler Delfin', shortCode: 'CR', animalIcon: '\u{1F42C}', sunglasses: true, discipline: 'Schwimmen & Rettung', rarity: 'bronze', theme: 'rescue', shape: 'ring', minLevel: 3 },
  { id: 'whistle_coach', label: 'Wolf Coach', shortCode: 'SC', animalIcon: '\u{1F43A}', discipline: 'Allround', rarity: 'bronze', theme: 'tech', shape: 'prism', minLevel: 4 },
  { id: 'turbo_dolphin', label: 'Turbo Gepard', shortCode: 'TV', animalIcon: '\u{1F406}', discipline: 'Schwimmen & Rettung', rarity: 'silver', theme: 'ocean', shape: 'diamond', minLevel: 5 },
  { id: 'ring_commander', label: 'Orca Commander', shortCode: 'RC', animalIcon: '\u{1F40B}', sunglasses: true, discipline: 'Schwimmen & Rettung', rarity: 'silver', theme: 'rescue', shape: 'ring', minLevel: 6 },
  { id: 'shark_guard', label: 'Alpha Hai', shortCode: 'DG', animalIcon: '\u{1F988}', discipline: 'Schwimmen & Rettung', rarity: 'silver', theme: 'rescue', shape: 'shield', minLevel: 7 },
  { id: 'trident_master', label: 'Loewen Meister', shortCode: 'TR', animalIcon: '\u{1F981}', sunglasses: true, discipline: 'Allround', rarity: 'gold', theme: 'ocean', shape: 'prism', minLevel: 8 },
  { id: 'sunset_surfer', label: 'Adler Surfer', shortCode: 'SD', animalIcon: '\u{1F985}', sunglasses: true, discipline: 'Allround', rarity: 'gold', theme: 'elite', shape: 'orb', minLevel: 9 },
  { id: 'pool_boss', label: 'Baeren Boss', shortCode: 'PB', animalIcon: '\u{1F43B}', sunglasses: true, discipline: 'Allround', rarity: 'gold', theme: 'elite', shape: 'crown', minLevel: 10 },
  { id: 'whistle_legend', label: 'Koenigs Adler', shortCode: 'WL', animalIcon: '\u{1F985}', sunglasses: true, discipline: 'Allround', rarity: 'legendary', theme: 'elite', shape: 'crown', minLevel: 12 },
  {
    id: 'technik_scout',
    label: 'Fuchs Ingenieur',
    shortCode: 'TS',
    animalIcon: '\u{1F98A}',
    discipline: 'B\u00e4dertechnik',
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
    animalIcon: '\u{1F989}',
    sunglasses: true,
    discipline: 'B\u00e4dertechnik',
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
    animalIcon: '\u{1F40B}',
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
    animalIcon: '\u{1F988}',
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
    animalIcon: '\u{1F43C}',
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
    animalIcon: '\u{1F989}',
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
    animalIcon: '\u{1F415}',
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
    animalIcon: '\u{1F981}',
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
    animalIcon: '\u{1F409}',
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
  },
  // ── Premium Collection: Nacht & Gezeiten ──
  {
    id: 'midnight_kraken',
    label: 'Mitternachts-Krake',
    shortCode: 'MK',
    animalIcon: '🦑',
    sunglasses: true,
    discipline: 'Allround',
    rarity: 'legendary',
    theme: 'ocean',
    shape: 'crown',
    unlock: {
      requirements: [
        { metric: 'totalCorrect', target: 500 },
        { metric: 'quizWins', target: 50 },
        { metric: 'badgeCount', target: 15 }
      ]
    }
  },
  {
    id: 'neon_jellyfish',
    label: 'Neon-Qualle',
    shortCode: 'NQ',
    animalIcon: '🪼',
    discipline: 'Bädertechnik',
    rarity: 'silver',
    theme: 'tech',
    shape: 'crystal',
    unlock: {
      requirements: [
        { metric: 'techCorrect', target: 55 },
        { metric: 'level', target: 6 }
      ]
    }
  },
  {
    id: 'glacier_wolf',
    label: 'Gletscher-Wolf',
    shortCode: 'GW',
    animalIcon: '🐺',
    sunglasses: true,
    discipline: 'Schwimmen & Rettung',
    rarity: 'gold',
    theme: 'rescue',
    shape: 'shield',
    unlock: {
      requirements: [
        { metric: 'swimDistance', target: 15000 },
        { metric: 'swimSessions', target: 30 },
        { metric: 'swimCorrect', target: 60 }
      ]
    }
  },
  {
    id: 'coral_phoenix',
    label: 'Korallen-Phönix',
    shortCode: 'CP',
    animalIcon: '🦅',
    sunglasses: true,
    discipline: 'Allround',
    rarity: 'legendary',
    theme: 'elite',
    shape: 'crown',
    unlock: {
      requirements: [
        { metric: 'level', target: 20 },
        { metric: 'totalXp', target: 4000 },
        { metric: 'quizWins', target: 75 },
        { metric: 'totalCorrect', target: 600 }
      ]
    }
  },
  // ── Premium Collection: Spezialisten ──
  {
    id: 'chlor_meister',
    label: 'Chlor-Meister',
    shortCode: 'CM',
    animalIcon: '🧪',
    discipline: 'Hygiene',
    rarity: 'gold',
    theme: 'hygiene',
    shape: 'prism',
    unlock: {
      requirements: [
        { metric: 'hygieneCorrect', target: 100 },
        { metric: 'totalXp', target: 1800 }
      ]
    }
  },
  {
    id: 'turm_falke',
    label: 'Turmspringer-Falke',
    shortCode: 'TF',
    animalIcon: '🦅',
    discipline: 'Schwimmen & Rettung',
    rarity: 'bronze',
    theme: 'rescue',
    shape: 'diamond',
    unlock: {
      requirements: [
        { metric: 'swimCorrect', target: 25 },
        { metric: 'totalXp', target: 400 }
      ]
    }
  },
  {
    id: 'circuit_otter',
    label: 'Elektro-Otter',
    shortCode: 'EO',
    animalIcon: '🦦',
    discipline: 'Bädertechnik',
    rarity: 'gold',
    theme: 'tech',
    shape: 'prism',
    unlock: {
      requirements: [
        { metric: 'techCorrect', target: 120 },
        { metric: 'quizWins', target: 30 },
        { metric: 'level', target: 10 }
      ]
    }
  },
  {
    id: 'frost_pinguin',
    label: 'Frost-Pinguin',
    shortCode: 'FP',
    animalIcon: '🐧',
    discipline: 'Schwimmen & Rettung',
    rarity: 'silver',
    theme: 'ocean',
    shape: 'orb',
    unlock: {
      requirements: [
        { metric: 'swimDistance', target: 5000 },
        { metric: 'swimSessions', target: 15 }
      ]
    }
  },
  {
    id: 'blitz_gecko',
    label: 'Blitz-Gecko',
    shortCode: 'BG',
    animalIcon: '🦎',
    discipline: 'Allround',
    rarity: 'bronze',
    theme: 'elite',
    shape: 'ring',
    unlock: {
      requirements: [
        { metric: 'quizWins', target: 8 },
        { metric: 'totalCorrect', target: 80 }
      ]
    }
  },
  {
    id: 'abyssal_leviathan',
    label: 'Tiefsee-Leviathan',
    shortCode: 'TL',
    animalIcon: '🐉',
    sunglasses: true,
    discipline: 'Allround',
    rarity: 'legendary',
    theme: 'ocean',
    shape: 'crown',
    unlock: {
      requirements: [
        { metric: 'level', target: 25 },
        { metric: 'totalCorrect', target: 800 },
        { metric: 'swimDistance', target: 42195 },
        { metric: 'badgeCount', target: 18 },
        { metric: 'quizWins', target: 100 }
      ]
    }
  },
  {
    id: 'medic_flamingo',
    label: 'Sanitäts-Flamingo',
    shortCode: 'MF',
    animalIcon: '🦩',
    discipline: 'Erste Hilfe',
    rarity: 'silver',
    theme: 'firstaid',
    shape: 'shield',
    unlock: {
      requirements: [
        { metric: 'firstAidCorrect', target: 50 },
        { metric: 'level', target: 5 }
      ]
    }
  },
  {
    id: 'golden_seahorse',
    label: 'Gold-Seepferdchen',
    shortCode: 'GS',
    animalIcon: '🐴',
    sunglasses: true,
    discipline: 'Schwimmen & Rettung',
    rarity: 'gold',
    theme: 'elite',
    shape: 'crown',
    unlock: {
      requirements: [
        { metric: 'swimDistance', target: 25000 },
        { metric: 'swimSessions', target: 50 },
        { metric: 'swimCorrect', target: 80 }
      ]
    }
  }
];

export const getAvatarById = (avatarId) => AVATARS.find((avatar) => avatar.id === avatarId) || null;

export const getAvatarShortCode = (avatarInput) => {
  if (avatarInput?.animalIcon) return avatarInput.animalIcon;
  const shape = String(avatarInput?.shape || '').toLowerCase();
  if (shape === 'orb') return '\u25C9';
  if (shape === 'ring') return '\u25CE';
  if (shape === 'prism') return '\u2B22';
  if (shape === 'crystal') return '\u2736';
  if (shape === 'diamond') return '\u25C6';
  if (shape === 'shield') return '\u2B1F';
  if (shape === 'crown') return '\u265B';
  return '\u25C7';
};

export const avatarHasSunglasses = (avatarInput) => {
  if (!avatarInput) return false;
  if (avatarInput.sunglasses) return true;
  const rarity = String(avatarInput.rarity || '').toLowerCase();
  return rarity === 'gold' || rarity === 'legendary';
};
