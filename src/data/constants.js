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
  // Schwimmen & Wassersport
  { id: 'swimmer', emoji: '🏊', label: 'Schwimmer' },
  { id: 'swimmer_m', emoji: '🏊‍♂️', label: 'Schwimmer' },
  { id: 'swimmer_f', emoji: '🏊‍♀️', label: 'Schwimmerin' },
  { id: 'waterpolo', emoji: '🤽', label: 'Wasserball' },
  { id: 'diver', emoji: '🤿', label: 'Taucher' },
  { id: 'surfer', emoji: '🏄', label: 'Surfer' },
  // Meeresbewohner
  { id: 'dolphin', emoji: '🐬', label: 'Delfin' },
  { id: 'whale', emoji: '🐳', label: 'Wal' },
  { id: 'shark', emoji: '🦈', label: 'Hai' },
  { id: 'octopus', emoji: '🐙', label: 'Oktopus' },
  { id: 'turtle', emoji: '🐢', label: 'Schildkröte' },
  { id: 'fish', emoji: '🐠', label: 'Tropenfisch' },
  { id: 'blowfish', emoji: '🐡', label: 'Kugelfisch' },
  { id: 'seal', emoji: '🦭', label: 'Robbe' },
  { id: 'crab', emoji: '🦀', label: 'Krabbe' },
  { id: 'lobster', emoji: '🦞', label: 'Hummer' },
  { id: 'shrimp', emoji: '🦐', label: 'Garnele' },
  { id: 'squid', emoji: '🦑', label: 'Tintenfisch' },
  { id: 'shell', emoji: '🐚', label: 'Muschel' },
  { id: 'coral', emoji: '🪸', label: 'Koralle' },
  // Strand & Wasser
  { id: 'wave', emoji: '🌊', label: 'Welle' },
  { id: 'beach', emoji: '🏖️', label: 'Strand' },
  { id: 'umbrella', emoji: '⛱️', label: 'Sonnenschirm' },
  { id: 'goggles', emoji: '🥽', label: 'Schwimmbrille' },
  { id: 'flamingo', emoji: '🦩', label: 'Flamingo' },
  { id: 'lifeguard', emoji: '🛟', label: 'Rettungsring' },
  // Freischaltbare Level-Avatare
  { id: 'aqua_cadet', emoji: '🧢🏊', label: 'Aqua-Kadett', minLevel: 2 },
  { id: 'shades_swimmer', emoji: '😎🏊', label: 'Sonnenbrillen-Schwimmer', minLevel: 3 },
  { id: 'whistle_coach', emoji: '😎📣', label: 'Triller-Profi', minLevel: 4 },
  { id: 'turbo_dolphin', emoji: '😎🐬', label: 'Turbo-Delfin', minLevel: 5 },
  { id: 'ring_commander', emoji: '😎🛟', label: 'Rettungsring-Kommandant', minLevel: 6 },
  { id: 'shark_guard', emoji: '😎🦈', label: 'Hai-Wache', minLevel: 7 },
  { id: 'trident_master', emoji: '🔱🌊', label: 'Wellenmeister', minLevel: 8 },
  { id: 'sunset_surfer', emoji: '🌅🏄', label: 'Sunset-Surfer', minLevel: 9 },
  { id: 'pool_boss', emoji: '👑🏊‍♂️', label: 'Pool-Boss', minLevel: 10 },
  { id: 'whistle_legend', emoji: '👑📣', label: 'Whistle-Legende', minLevel: 12 },
  // Premium-Avatare: Disziplin-basiert freischaltbar
  {
    id: 'technik_scout',
    emoji: '🔧🧠',
    label: 'Technik-Scout',
    discipline: 'Bädertechnik',
    rarity: 'bronze',
    unlock: {
      requirements: [
        { metric: 'techCorrect', target: 35 },
        { metric: 'totalXp', target: 600 }
      ]
    }
  },
  {
    id: 'technik_architekt',
    emoji: '⚙️👑',
    label: 'Anlagen-Architekt',
    discipline: 'Bädertechnik',
    rarity: 'gold',
    unlock: {
      requirements: [
        { metric: 'techCorrect', target: 90 },
        { metric: 'quizWins', target: 25 }
      ]
    }
  },
  {
    id: 'rettung_captain',
    emoji: '🛟🫡',
    label: 'Rettungs-Captain',
    discipline: 'Schwimmen & Rettung',
    rarity: 'silver',
    unlock: {
      requirements: [
        { metric: 'swimCorrect', target: 40 },
        { metric: 'swimSessions', target: 10 }
      ]
    }
  },
  {
    id: 'arena_champion',
    emoji: '🏊‍♂️🏅',
    label: 'Arena-Champion',
    discipline: 'Schwimmen & Rettung',
    rarity: 'gold',
    unlock: {
      requirements: [
        { metric: 'swimCorrect', target: 90 },
        { metric: 'swimDistance', target: 8000 }
      ]
    }
  },
  {
    id: 'hygiene_guardian',
    emoji: '🧴🛡️',
    label: 'Hygiene-Guardian',
    discipline: 'Hygiene',
    rarity: 'silver',
    unlock: {
      requirements: [
        { metric: 'hygieneCorrect', target: 35 },
        { metric: 'totalCorrect', target: 140 }
      ]
    }
  },
  {
    id: 'sterile_oracle',
    emoji: '🧪✨',
    label: 'Sterile Orakel',
    discipline: 'Hygiene',
    rarity: 'gold',
    unlock: {
      requirements: [
        { metric: 'hygieneCorrect', target: 80 },
        { metric: 'badgeCount', target: 5 }
      ]
    }
  },
  {
    id: 'firstaid_guardian',
    emoji: '⛑️❤️',
    label: 'Erste-Hilfe-Wächter',
    discipline: 'Erste Hilfe',
    rarity: 'silver',
    unlock: {
      requirements: [
        { metric: 'firstAidCorrect', target: 35 },
        { metric: 'quizWins', target: 14 }
      ]
    }
  },
  {
    id: 'rescue_legend',
    emoji: '🚑🌟',
    label: 'Rettungs-Legende',
    discipline: 'Erste Hilfe',
    rarity: 'legendary',
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
    emoji: '👑🌊',
    label: 'Aqua-Großmeister',
    discipline: 'Allround',
    rarity: 'legendary',
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
