import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, MessageCircle, BookOpen, Bell, ClipboardList, Users, Plus, Send, Check, X, Upload, Download, Calendar, Award, Brain, Home, Target, TrendingUp, Zap, Star, Shield, Trash2, UserCog, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { supabase } from './supabase';

import { CATEGORIES, DEFAULT_MENU_ITEMS, DEFAULT_THEME_COLORS, PERMISSIONS, DEMO_ACCOUNTS, AVATARS } from './data/constants';
import { POOL_CHEMICALS, PERIODIC_TABLE } from './data/chemistry';
import { AUSBILDUNGSRAHMENPLAN, WOCHEN_PRO_JAHR } from './data/ausbildungsrahmenplan';
import { DID_YOU_KNOW_FACTS, DAILY_WISDOM, SAFETY_SCENARIOS, WORK_SAFETY_TOPICS } from './data/content';
import { SAMPLE_QUESTIONS } from './data/quizQuestions';
import { SWIM_STYLES, SWIM_CHALLENGES, SWIM_LEVELS, SWIM_BADGES, getAgeHandicap, calculateHandicappedTime, calculateSwimPoints, calculateChallengeProgress, getSwimLevel, calculateTeamBattleStats } from './data/swimming';
import { PRACTICAL_EXAM_TYPES, PRACTICAL_SWIM_EXAMS, resolvePracticalDisciplineResult, toNumericGrade, formatGradeLabel } from './data/practicalExam';
import { shuffleAnswers } from './lib/utils';
import SignatureCanvas from './components/ui/SignatureCanvas';

export default function BaederApp() {
  const [currentView, setCurrentView] = useState('home');
  const [authView, setAuthView] = useState('login'); // login, register, impressum, datenschutz
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial render
    const savedUser = localStorage.getItem('baeder_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'azubi',
    trainingEnd: ''
  });
  const [allUsers, setAllUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingFlashcards, setPendingFlashcards] = useState([]);

  // Quiz State
  const [activeGames, setActiveGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [statsByUserId, setStatsByUserId] = useState({});
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('profi');
  const [currentGame, setCurrentGame] = useState(null);
  const [categoryRound, setCategoryRound] = useState(0); // 0-3 (4 Kategorien)
  const [questionInCategory, setQuestionInCategory] = useState(0); // 0-4 (5 Fragen pro Kategorie)
  const [quizCategory, setQuizCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentCategoryQuestions, setCurrentCategoryQuestions] = useState([]); // 5 Fragen für aktuelle Kategorie
  const [answered, setAnswered] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false); // Warte auf anderen Spieler
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Für Multi-Select Fragen
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState(null); // Für Single-Choice Feedback
  
  const DIFFICULTY_SETTINGS = {
    anfaenger: { time: 45, label: 'Anfänger', icon: '🟢', color: 'bg-green-500' },
    profi: { time: 30, label: 'Profi', icon: '🟡', color: 'bg-yellow-500' },
    experte: { time: 15, label: 'Experte', icon: '🔴', color: 'bg-red-500' }
  };

  const normalizePlayerName = (name) => {
    const base = String(name || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return base;
  };

  const namesMatch = (a, b) => {
    const na = normalizePlayerName(a);
    const nb = normalizePlayerName(b);
    if (!na || !nb) return false;
    return na === nb || na.includes(nb) || nb.includes(na);
  };
  const isFinishedGameStatus = (status) => {
    const normalized = String(status || '').trim().toLowerCase();
    return normalized === 'finished' || normalized === 'completed' || normalized === 'done';
  };

  const XP_REWARDS = {
    QUIZ_WIN: 40,
    EXAM_COMPLETION: 20,
    EXAM_PASS_BONUS: 15,
    EXAM_CORRECT_ANSWER: 1,
    FLASHCARD_REVIEW: 1,
    FLASHCARD_CREATE: 15
  };
  const PRACTICAL_ATTEMPTS_LOCAL_KEY = 'practical_exam_attempts_local_v1';

  const SWIM_BATTLE_WIN_POINTS = 20;
  const SWIM_ARENA_DISCIPLINES = [
    { id: '25m', label: '25m Sprint' },
    { id: '50m', label: '50m Sprint' },
    { id: '100m', label: '100m Sprint' },
    { id: '200m', label: '200m Mittelstrecke' },
    { id: '400m', label: '400m Ausdauer' },
  ];
  const SEA_CREATURE_TIERS = [
    { minWins: 0, emoji: '🐚', name: 'Muschel' },
    { minWins: 2, emoji: '🪼', name: 'Qualle' },
    { minWins: 4, emoji: '🐢', name: 'Meeresschildkröte' },
    { minWins: 7, emoji: '🐬', name: 'Delfin' },
    { minWins: 10, emoji: '🦑', name: 'Tintenfisch' },
    { minWins: 14, emoji: '🦈', name: 'Hai' },
    { minWins: 18, emoji: '🐋', name: 'Orca' },
  ];
  const ARENA_LOSER_CREATURE = { emoji: '🪼', name: 'Langsame Qualle' };

  const XP_META_KEY = '__meta';
  const XP_BREAKDOWN_DEFAULT = {
    examSimulator: 0,
    flashcardLearning: 0,
    flashcardCreation: 0,
    quizWins: 0
  };

  const createEmptyUserStats = () => ({
    wins: 0,
    losses: 0,
    draws: 0,
    categoryStats: {},
    opponents: {},
    winStreak: 0,
    bestWinStreak: 0
  });

  const toSafeInt = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
  };

  const getXpMetaFromCategoryStats = (categoryStats) => {
    const safeCategoryStats = (categoryStats && typeof categoryStats === 'object') ? categoryStats : {};
    const rawMeta = (safeCategoryStats[XP_META_KEY] && typeof safeCategoryStats[XP_META_KEY] === 'object')
      ? safeCategoryStats[XP_META_KEY]
      : {};
    const rawBreakdown = (rawMeta.breakdown && typeof rawMeta.breakdown === 'object')
      ? rawMeta.breakdown
      : {};
    const rawAwardedEvents = (rawMeta.awardedEvents && typeof rawMeta.awardedEvents === 'object')
      ? rawMeta.awardedEvents
      : {};

    return {
      totalXp: toSafeInt(rawMeta.totalXp),
      breakdown: {
        ...XP_BREAKDOWN_DEFAULT,
        examSimulator: toSafeInt(rawBreakdown.examSimulator),
        flashcardLearning: toSafeInt(rawBreakdown.flashcardLearning),
        flashcardCreation: toSafeInt(rawBreakdown.flashcardCreation),
        quizWins: toSafeInt(rawBreakdown.quizWins)
      },
      awardedEvents: rawAwardedEvents
    };
  };

  const ensureUserStatsStructure = (statsInput) => {
    const base = {
      ...createEmptyUserStats(),
      ...(statsInput || {})
    };

    const safeCategoryStats = (base.categoryStats && typeof base.categoryStats === 'object')
      ? { ...base.categoryStats }
      : {};
    const safeOpponents = (base.opponents && typeof base.opponents === 'object')
      ? { ...base.opponents }
      : {};

    const xpMeta = getXpMetaFromCategoryStats(safeCategoryStats);
    safeCategoryStats[XP_META_KEY] = xpMeta;

    return {
      ...base,
      wins: toSafeInt(base.wins),
      losses: toSafeInt(base.losses),
      draws: toSafeInt(base.draws),
      categoryStats: safeCategoryStats,
      opponents: safeOpponents,
      winStreak: toSafeInt(base.winStreak),
      bestWinStreak: toSafeInt(base.bestWinStreak)
    };
  };

  const getTotalXpFromStats = (statsInput) => {
    const safeStats = ensureUserStatsStructure(statsInput);
    return getXpMetaFromCategoryStats(safeStats.categoryStats).totalXp;
  };

  const getXpBreakdownFromStats = (statsInput) => {
    const safeStats = ensureUserStatsStructure(statsInput);
    return getXpMetaFromCategoryStats(safeStats.categoryStats).breakdown;
  };

  const addXpToStats = (statsInput, sourceKey, amount, eventKey = null) => {
    const xpToAdd = toSafeInt(amount);
    const safeStats = ensureUserStatsStructure(statsInput);
    if (xpToAdd <= 0) {
      return { stats: safeStats, addedXp: 0 };
    }

    const safeCategoryStats = { ...(safeStats.categoryStats || {}) };
    const xpMeta = getXpMetaFromCategoryStats(safeCategoryStats);

    if (eventKey && xpMeta.awardedEvents[eventKey]) {
      return { stats: safeStats, addedXp: 0 };
    }

    xpMeta.totalXp += xpToAdd;
    xpMeta.breakdown[sourceKey] = toSafeInt(xpMeta.breakdown[sourceKey]) + xpToAdd;
    if (eventKey) {
      xpMeta.awardedEvents[eventKey] = Date.now();
    }

    safeCategoryStats[XP_META_KEY] = xpMeta;

    return {
      stats: {
        ...safeStats,
        categoryStats: safeCategoryStats
      },
      addedXp: xpToAdd
    };
  };

  // Other State
  const [userStats, setUserStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('org');
  const [newQuestionAnswers, setNewQuestionAnswers] = useState(['', '', '', '']);
  const [newQuestionCorrect, setNewQuestionCorrect] = useState(0);
  const [materials, setMaterials] = useState([]);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialCategory, setMaterialCategory] = useState('org');
  const [resources, setResources] = useState([]);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceType, setResourceType] = useState('youtube');
  const [resourceDescription, setResourceDescription] = useState('');
  const [news, setNews] = useState([]);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [exams, setExams] = useState([]);
  const [examTitle, setExamTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTopics, setExamTopics] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dailyWisdom, setDailyWisdom] = useState('');

  // Exam Simulator State
  const [examSimulator, setExamSimulator] = useState(null);
  const [examCurrentQuestion, setExamCurrentQuestion] = useState(null);
  const [examQuestionIndex, setExamQuestionIndex] = useState(0);
  const [examAnswered, setExamAnswered] = useState(false);
  const [userExamProgress, setUserExamProgress] = useState(null);
  const [examSelectedAnswers, setExamSelectedAnswers] = useState([]); // Für Multi-Select im Prüfungssimulator
  const [examSelectedAnswer, setExamSelectedAnswer] = useState(null); // Für Single-Choice Feedback
  const [examSimulatorMode, setExamSimulatorMode] = useState('theory');
  const [practicalExamType, setPracticalExamType] = useState('zwischen');
  const [practicalExamInputs, setPracticalExamInputs] = useState({});
  const [practicalExamResult, setPracticalExamResult] = useState(null);
  const [practicalExamTargetUserId, setPracticalExamTargetUserId] = useState('');
  const [practicalExamHistory, setPracticalExamHistory] = useState([]);
  const [practicalExamHistoryLoading, setPracticalExamHistoryLoading] = useState(false);
  const [practicalExamHistoryTypeFilter, setPracticalExamHistoryTypeFilter] = useState('alle');
  const [practicalExamHistoryUserFilter, setPracticalExamHistoryUserFilter] = useState('all');
  const [practicalExamComparisonType, setPracticalExamComparisonType] = useState('alle');
  
  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [devMode, setDevMode] = useState(false);

  // App Config State (Admin UI Editor)
  const [appConfig, setAppConfig] = useState({
    menuItems: DEFAULT_MENU_ITEMS,
    themeColors: DEFAULT_THEME_COLORS
  });
  const [editingMenuItems, setEditingMenuItems] = useState([]);
  const [editingThemeColors, setEditingThemeColors] = useState({});
  const [configLoaded, setConfigLoaded] = useState(false);
  
  // Flashcards State
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [flashcardProgress, setFlashcardProgress] = useState(null);
  const [userFlashcards, setUserFlashcards] = useState([]);
  const [newFlashcardFront, setNewFlashcardFront] = useState('');
  const [newFlashcardBack, setNewFlashcardBack] = useState('');
  const [newFlashcardCategory, setNewFlashcardCategory] = useState('org');
  
  // Badges State
  const [userBadges, setUserBadges] = useState([]);

  // Spaced Repetition State
  const [spacedRepetitionData, setSpacedRepetitionData] = useState(() => {
    const saved = localStorage.getItem('spaced_repetition_data');
    return saved ? JSON.parse(saved) : {};
  });
  const [spacedRepetitionMode, setSpacedRepetitionMode] = useState(false);
  const [dueCards, setDueCards] = useState([]);

  // Daily Challenges State
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [dailyChallengeProgress, setDailyChallengeProgress] = useState(() => {
    const saved = localStorage.getItem('daily_challenge_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if it's from today
      const today = new Date().toDateString();
      if (parsed.date === today) {
        return parsed;
      }
    }
    return { date: new Date().toDateString(), completed: [], stats: {} };
  });

  // Kontrollkarte Berufsschule State
  const [schoolAttendance, setSchoolAttendance] = useState([]);
  const [newAttendanceDate, setNewAttendanceDate] = useState('');
  const [newAttendanceStart, setNewAttendanceStart] = useState('');
  const [newAttendanceEnd, setNewAttendanceEnd] = useState('');
  const [newAttendanceTeacherSig, setNewAttendanceTeacherSig] = useState('');
  const [newAttendanceTrainerSig, setNewAttendanceTrainerSig] = useState('');
  const [signatureModal, setSignatureModal] = useState(null); // { id, field, currentValue }
  const [tempSignature, setTempSignature] = useState(null); // Temporäre Unterschrift im Modal
  const [selectedSchoolCardUser, setSelectedSchoolCardUser] = useState(null); // Ausgewählter Azubi für Kontrollkarten-Ansicht
  const [allAzubisForSchoolCard, setAllAzubisForSchoolCard] = useState([]); // Liste aller Azubis für Auswahl

  // Berichtsheft (Ausbildungsnachweis) State
  const [berichtsheftEntries, setBerichtsheftEntries] = useState([]);
  const [berichtsheftWeek, setBerichtsheftWeek] = useState(() => {
    // Aktuelle Woche als Default
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Montag
    return startOfWeek.toISOString().split('T')[0];
  });
  const [berichtsheftYear, setBerichtsheftYear] = useState(1); // Ausbildungsjahr 1-3
  const [berichtsheftNr, setBerichtsheftNr] = useState(1); // Nachweis-Nummer
  const [currentWeekEntries, setCurrentWeekEntries] = useState({
    Mo: [{ taetigkeit: '', stunden: '', bereich: '' }],
    Di: [{ taetigkeit: '', stunden: '', bereich: '' }],
    Mi: [{ taetigkeit: '', stunden: '', bereich: '' }],
    Do: [{ taetigkeit: '', stunden: '', bereich: '' }],
    Fr: [{ taetigkeit: '', stunden: '', bereich: '' }],
    Sa: [{ taetigkeit: '', stunden: '', bereich: '' }],
    So: [{ taetigkeit: '', stunden: '', bereich: '' }]
  });
  const [berichtsheftBemerkungAzubi, setBerichtsheftBemerkungAzubi] = useState('');
  const [berichtsheftBemerkungAusbilder, setBerichtsheftBemerkungAusbilder] = useState('');
  const [berichtsheftSignaturAzubi, setBerichtsheftSignaturAzubi] = useState('');
  const [berichtsheftSignaturAusbilder, setBerichtsheftSignaturAusbilder] = useState('');
  const [berichtsheftDatumAzubi, setBerichtsheftDatumAzubi] = useState('');
  const [berichtsheftDatumAusbilder, setBerichtsheftDatumAusbilder] = useState('');
  const [selectedBerichtsheft, setSelectedBerichtsheft] = useState(null); // Für Bearbeitung
  const [berichtsheftViewMode, setBerichtsheftViewMode] = useState('edit'); // 'edit', 'list', 'progress', 'profile'

  // Schwimmchallenge State
  const [swimChallengeView, setSwimChallengeView] = useState('overview'); // 'overview', 'challenges', 'add', 'leaderboard', 'battle'
  const [swimSessions, setSwimSessions] = useState([]); // Alle Trainingseinheiten (aus Supabase)
  const [activeSwimChallenges, setActiveSwimChallenges] = useState(() => {
    // Lade aktive Challenges aus localStorage
    const saved = localStorage.getItem('active_swim_challenges');
    return saved ? JSON.parse(saved) : [];
  });
  const [swimSessionForm, setSwimSessionForm] = useState({
    date: new Date().toISOString().split('T')[0],
    distance: '',
    time: '',
    style: 'kraul',
    notes: '',
    challengeId: ''
  });
  const [pendingSwimConfirmations, setPendingSwimConfirmations] = useState([]); // Für Trainer: Zu bestätigende Einheiten
  const [swimChallengeFilter, setSwimChallengeFilter] = useState('alle'); // Filter für Challenge-Kategorien
  const [swimArenaMode, setSwimArenaMode] = useState('duel');
  const [swimBattleHistory, setSwimBattleHistory] = useState(() => {
    const saved = localStorage.getItem('swim_battle_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [swimBattleWinsByUserId, setSwimBattleWinsByUserId] = useState(() => {
    const saved = localStorage.getItem('swim_battle_wins_by_user');
    return saved ? JSON.parse(saved) : {};
  });
  const [swimBattleResult, setSwimBattleResult] = useState(null);
  const [swimDuelForm, setSwimDuelForm] = useState({
    discipline: '50m',
    style: 'kraul',
    challengerId: '',
    opponentId: '',
    challengerSeconds: '',
    opponentSeconds: ''
  });
  const [swimBossForm, setSwimBossForm] = useState({
    discipline: '100m',
    style: 'brust',
    trainerId: '',
    azubiIds: [],
    trainerSeconds: '',
    azubiSeconds: ''
  });

  // Azubi-Profildaten für Berichtsheft
  const [azubiProfile, setAzubiProfile] = useState(() => {
    const saved = localStorage.getItem('azubi_profile');
    return saved ? JSON.parse(saved) : {
      vorname: '',
      nachname: '',
      ausbildungsbetrieb: '',
      ausbildungsberuf: 'Fachangestellte/r für Bäderbetriebe',
      ausbilder: '',
      ausbildungsbeginn: '',
      ausbildungsende: ''
    };
  });
  const azubiProfileSaveTimerRef = useRef(null);
  const xpAwardQueueRef = useRef(Promise.resolve(0));

  // Calculator State
  const [calculatorType, setCalculatorType] = useState('ph');
  const [calculatorInputs, setCalculatorInputs] = useState({});
  const [calculatorResult, setCalculatorResult] = useState(null);
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  // Profil-Bearbeitung State
  const [profileEditName, setProfileEditName] = useState('');
  const [profileEditPassword, setProfileEditPassword] = useState('');
  const [profileEditPasswordConfirm, setProfileEditPasswordConfirm] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [profileEditCompany, setProfileEditCompany] = useState('');
  const [profileEditBirthDate, setProfileEditBirthDate] = useState('');

  // Toast-Benachrichtigungen
  const [toasts, setToasts] = useState([]);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updatingApp, setUpdatingApp] = useState(false);

  // Toast anzeigen
  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    setToasts(prev => [...prev, { id, message, type, icon: icons[type] || icons.info }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const checkForPwaUpdate = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) return false;

      if (registration.waiting) {
        setUpdateAvailable(true);
        return true;
      }

      await registration.update();

      if (registration.waiting) {
        setUpdateAvailable(true);
        return true;
      }

      if (registration.installing) {
        registration.installing.addEventListener('statechange', () => {
          if (registration.waiting) {
            setUpdateAvailable(true);
          }
        });
      }

      return false;
    } catch (error) {
      console.warn('PWA update check failed:', error);
      return false;
    }
  }, []);

  const applyPwaUpdate = async () => {
    if (updatingApp) return;
    setUpdatingApp(true);

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      }

      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      }

      window.location.reload();
    } catch (error) {
      console.error('PWA update failed:', error);
      setUpdatingApp(false);
      showToast('Update fehlgeschlagen. Bitte Seite neu laden.', 'error');
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return undefined;

    const onControllerChange = () => {
      window.location.reload();
    };

    const onForeground = () => {
      if (document.visibilityState === 'visible') {
        void checkForPwaUpdate();
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    document.addEventListener('visibilitychange', onForeground);
    window.addEventListener('focus', onForeground);

    void checkForPwaUpdate();
    const intervalId = window.setInterval(() => {
      void checkForPwaUpdate();
    }, 120000);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      document.removeEventListener('visibilitychange', onForeground);
      window.removeEventListener('focus', onForeground);
      window.clearInterval(intervalId);
    };
  }, [checkForPwaUpdate]);

  // Content moderation
  const BANNED_WORDS = [
    // Explizite Inhalte
    'porn', 'sex', 'xxx', 'nackt', 'nude',
    // Beleidigungen
    'arschloch', 'idiot', 'scheiße', 'fuck', 'shit', 'bastard', 'bitch',
    // Rassismus & Rechtsradikalismus
    'nazi', 'hitler', 'rassist', 'hure', 'schwuchtel', 'neger',
    // Weitere problematische Begriffe
    'hurensohn', 'wichser', 'fotze', 'schlampe'
  ];

  const containsBannedContent = (text) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return BANNED_WORDS.some(word => lowerText.includes(word));
  };

  const moderateContent = (text, context = 'Text') => {
    if (containsBannedContent(text)) {
      alert(`⚠️ ${context} enthält unangemessene Inhalte und wurde blockiert.\n\nBitte achte auf einen respektvollen Umgang.`);
      playSound('wrong');
      return false;
    }
    return true;
  };

  const FLASHCARD_CONTENT = {
    org: [
      { front: 'Was ist das Hausrecht?', back: 'Das Recht des Badbetreibers, die Hausordnung durchzusetzen und Personen des Platzes zu verweisen.' },
      { front: 'Wer ist für die Aufsicht verantwortlich?', back: 'Die Aufsichtsperson während der kompletten Öffnungszeiten.' }
    ],
    tech: [
      { front: 'Optimaler pH-Wert im Schwimmbad?', back: '7,0 - 7,4 (neutral bis leicht basisch)' },
      { front: 'Was macht eine Umwälzpumpe?', back: 'Sie pumpt das Wasser durch die Filteranlage zur Reinigung.' },
      { front: 'Chlor-Richtwert im Becken?', back: '0,3 - 0,6 mg/l freies Chlor' }
    ],
    swim: [
      { front: 'Was ist der Rautek-Griff?', back: 'Rettungsgriff zum Bergen bewusstloser Personen aus Gefahrenbereich.' },
      { front: 'Wie funktioniert die Mund-zu-Mund-Beatmung?', back: 'Kopf überstrecken, Nase zuhalten, 2x beatmen, dann Herzdruckmassage.' }
    ],
    first: [
      { front: 'Verhältnis Herzdruckmassage zu Beatmung?', back: '30:2 - 30 Kompressionen, dann 2 Beatmungen' },
      { front: 'Wo drückt man bei der Herzdruckmassage?', back: 'Unteres Drittel des Brustbeins, 5-6 cm tief' }
    ],
    hygiene: [
      { front: 'Warum Duschpflicht vor dem Schwimmen?', back: 'Entfernung von Schmutz, Schweiß und Kosmetik für bessere Wasserqualität.' },
      { front: 'Was sind Legionellen?', back: 'Bakterien im Wasser, gefährlich bei Inhalation, vermehren sich bei 25-45°C' }
    ],
    pol: [
      { front: 'Was regelt das Arbeitsrecht?', back: 'Beziehung zwischen Arbeitgeber und Arbeitnehmer, Rechte und Pflichten.' },
      { front: 'Was ist die Berufsgenossenschaft?', back: 'Träger der gesetzlichen Unfallversicherung für Arbeitsunfälle.' }
    ]
  };

  const BADGES = [
    // Quiz/Lern-Badges
    { id: 'streak_7', name: '7 Tage Streak', icon: '🔥', description: '7 Tage hintereinander gelernt', requirement: 'streak', value: 7, category: 'quiz' },
    { id: 'streak_30', name: '30 Tage Streak', icon: '🔥🔥', description: '30 Tage hintereinander gelernt', requirement: 'streak', value: 30, category: 'quiz' },
    { id: 'questions_50', name: 'Lernmaschine', icon: '💯', description: '50 Fragen richtig beantwortet', requirement: 'questions', value: 50, category: 'quiz' },
    { id: 'questions_100', name: 'Wissensmeister', icon: '🎓', description: '100 Fragen richtig beantwortet', requirement: 'questions', value: 100, category: 'quiz' },
    { id: 'quiz_winner_10', name: 'Quiz-Champion', icon: '👑', description: '10 Quizduell-Siege', requirement: 'quiz_wins', value: 10, category: 'quiz' },
    { id: 'perfectionist', name: 'Perfektionist', icon: '⭐', description: 'Alle Fragen gemeistert', requirement: 'all_mastered', value: 1, category: 'quiz' },
    { id: 'early_bird', name: 'Frühaufsteher', icon: '🌅', description: 'Vor 7 Uhr morgens gelernt', requirement: 'early', value: 1, category: 'quiz' },
    { id: 'night_owl', name: 'Nachteule', icon: '🦉', description: 'Nach 22 Uhr gelernt', requirement: 'night', value: 1, category: 'quiz' },
    // Win Streak Badges - Ungeschlagenen-Serie
    { id: 'win_streak_3', name: 'Aufsteiger', icon: '🥉', description: '3 Siege in Folge', requirement: 'win_streak', value: 3, category: 'quiz' },
    { id: 'win_streak_5', name: 'Durchstarter', icon: '🥈', description: '5 Siege in Folge', requirement: 'win_streak', value: 5, category: 'quiz' },
    { id: 'win_streak_10', name: 'Unaufhaltsam', icon: '🥇', description: '10 Siege in Folge', requirement: 'win_streak', value: 10, category: 'quiz' },
    { id: 'win_streak_15', name: 'Dominanz', icon: '🏅', description: '15 Siege in Folge', requirement: 'win_streak', value: 15, category: 'quiz' },
    { id: 'win_streak_25', name: 'Legende', icon: '🏆', description: '25 Siege in Folge', requirement: 'win_streak', value: 25, category: 'quiz' },
    { id: 'win_streak_50', name: 'Unbesiegbar', icon: '💎', description: '50 Siege in Folge', requirement: 'win_streak', value: 50, category: 'quiz' },
    // Schwimm-Badges (aus SWIM_BADGES)
    ...SWIM_BADGES.map(b => ({ ...b, requirement: b.requirement.type, value: b.requirement.value }))
  ];

  // Supabase Auth Session Listener
  useEffect(() => {
    // Initiale Session prüfen
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // User ist eingeloggt - Profil laden
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && profile.approved) {
          const userSession = {
            id: session.user.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            avatar: profile.avatar || null,
            company: profile.company || null,
            birthDate: profile.birth_date || null,
            canViewSchoolCards: profile.can_view_school_cards || false,
            canSignReports: profile.can_sign_reports || false,
            permissions: PERMISSIONS[profile.role]
          };
          setUser(userSession);
          localStorage.setItem('baeder_user', JSON.stringify(userSession));

          // Azubi-Profil aus Supabase laden (falls vorhanden)
          if (profile.berichtsheft_profile) {
            setAzubiProfile(profile.berichtsheft_profile);
            localStorage.setItem('azubi_profile', JSON.stringify(profile.berichtsheft_profile));
          }
        } else if (profile && !profile.approved) {
          // User nicht freigeschaltet
          await supabase.auth.signOut();
          setUser(null);
          localStorage.removeItem('baeder_user');
        }
      } else {
        // Keine aktive Session - localStorage löschen
        const savedUser = localStorage.getItem('baeder_user');
        if (savedUser) {
          // Es gibt einen gespeicherten User aber keine Session
          // Das kann passieren wenn die Session abgelaufen ist
          setUser(null);
          localStorage.removeItem('baeder_user');
        }
      }
    };

    checkSession();

    // Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);

      if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('baeder_user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
      loadNotifications();
      const interval = setInterval(() => {
        loadData();
        loadNotifications();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) {
      setPracticalExamTargetUserId('');
      return;
    }

    const canManageAll = Boolean(user?.permissions?.canViewAllStats);
    if (!canManageAll) {
      setPracticalExamTargetUserId(user.id);
      return;
    }

    const azubiCandidates = allUsers.filter(account => account?.role === 'azubi');
    setPracticalExamTargetUserId((prev) => {
      if (prev && azubiCandidates.some(account => account.id === prev)) return prev;
      return azubiCandidates[0]?.id || user.id;
    });
  }, [user, allUsers]);

  useEffect(() => {
    if (!user?.id) return;
    if (currentView !== 'exam-simulator' || examSimulatorMode !== 'practical') return;
    void loadPracticalExamHistory();
  }, [user, currentView, examSimulatorMode]);

  
  useEffect(() => {
    if (timerActive && timeLeft > 0 && !answered) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !answered) {
      handleTimeUp();
    }
  }, [timeLeft, timerActive, answered]);

  // Check for users to delete on load
  useEffect(() => {
    checkDataRetention();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Load school attendance when view changes
    if (currentView === 'school-card' && user) {
      loadSchoolAttendance();
      if (canViewAllSchoolCards()) {
        loadAzubisForSchoolCard();
      }
    }

    // Load Berichtsheft when view changes
    if (currentView === 'berichtsheft' && user) {
      loadBerichtsheftEntries();

      // Azubi-Profil aus Supabase nachladen falls localStorage leer
      if (user.id && (!azubiProfile.vorname || !azubiProfile.nachname)) {
        (async () => {
          try {
            const { data } = await supabase
              .from('profiles')
              .select('berichtsheft_profile')
              .eq('id', user.id)
              .single();
            if (data?.berichtsheft_profile) {
              setAzubiProfile(data.berichtsheft_profile);
              localStorage.setItem('azubi_profile', JSON.stringify(data.berichtsheft_profile));
            }
          } catch (err) {
            console.warn('Azubi-Profil nachladen fehlgeschlagen:', err);
          }
        })();
      }
    }

  }, [currentView, user]);

  // Sound Effects
  const playSound = (type) => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
      case 'splash': // Wasser-Platschen
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'whistle': // Pfeife
        oscillator.frequency.value = 2000;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'correct': // Richtige Antwort
        oscillator.frequency.value = 523.25; // C5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'wrong': // Falsche Antwort
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'bubble': // Blase
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
    }
  };

  const calculatePH = (inputs) => {
    const { chlorine, alkalinity, acidCapacity } = inputs;
    if (!chlorine || !alkalinity) return null;
    
    let ph = 7.5 + (parseFloat(chlorine) - 0.5) * 0.2 + (parseFloat(alkalinity) - 120) * 0.01;
    
    // Säurekapazität berücksichtigen
    if (acidCapacity) {
      ph = ph - (parseFloat(acidCapacity) - 2.5) * 0.15;
    }
    
    return {
      result: ph.toFixed(2),
      explanation: `Bei ${chlorine} mg/l Chlor, ${alkalinity} mg/l Alkalinität${acidCapacity ? ` und ${acidCapacity} mmol/l Säurekapazität` : ''} ergibt sich ein pH-Wert von ${ph.toFixed(2)}. Optimal: 7,0-7,4`,
      recommendation: ph < 7.0 ? 'pH-Heber (Na₂CO₃) zugeben' : ph > 7.4 ? 'pH-Senker (NaHSO₄) zugeben' : 'pH-Wert optimal!',
      details: acidCapacity ? `Die Säurekapazität von ${acidCapacity} mmol/l zeigt die Pufferfähigkeit des Wassers an.` : null
    };
  };

  const calculateChlorine = (inputs) => {
    const { poolVolume, currentChlorine, targetChlorine } = inputs;
    if (!poolVolume || currentChlorine === undefined || !targetChlorine) return null;
    
    const difference = parseFloat(targetChlorine) - parseFloat(currentChlorine);
    const needed = (difference * parseFloat(poolVolume)) / 1000;
    
    return {
      result: needed.toFixed(2) + ' kg',
      explanation: `Für ${poolVolume} m³ Wasser von ${currentChlorine} auf ${targetChlorine} mg/l`,
      recommendation: needed > 0 ? `${needed.toFixed(2)} kg Chlor zugeben` : 'Kein Chlor nötig'
    };
  };

  const calculateVolume = (inputs) => {
    const { length, width, depth } = inputs;
    if (!length || !width || !depth) return null;
    
    const volume = parseFloat(length) * parseFloat(width) * parseFloat(depth);
    const liters = volume * 1000;
    
    return {
      result: volume.toFixed(2) + ' m³',
      explanation: `${length}m × ${width}m × ${depth}m = ${volume.toFixed(2)} m³ (${liters.toFixed(0)} Liter)`,
      recommendation: `Bei ${volume.toFixed(0)} m³ beträgt die empfohlene Umwälzrate 4-6 Stunden`
    };
  };

  const handleCalculation = () => {
    let result = null;
    
    switch(calculatorType) {
      case 'ph':
        result = calculatePH(calculatorInputs);
        break;
      case 'chlorine':
        result = calculateChlorine(calculatorInputs);
        break;
      case 'volume':
        result = calculateVolume(calculatorInputs);
        break;
    }
    
    setCalculatorResult(result);
    if (result) playSound('correct');
  };

  const checkDataRetention = async () => {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*');

      if (error || !users) {
        console.log('No users found or Supabase error');
        return;
      }

      const now = Date.now();
      const sixMonthsMs = 6 * 30 * 24 * 60 * 60 * 1000;

      for (const account of users) {
        try {
          // NEVER delete admins - they are permanent
          if (account.role === 'admin') {
            continue;
          }

          // Check Azubi training end
          if (account.role === 'azubi' && account.training_end) {
            const endDate = new Date(account.training_end).getTime();
            if (now > endDate) {
              console.log(`Azubi ${account.name} Ausbildung beendet - Daten werden gelöscht`);
              await deleteUserData(account.id, account.email, account.name);
            }
          }

          // Check Trainer inactivity
          if (account.role === 'trainer' && account.last_login) {
            const lastLoginDate = new Date(account.last_login).getTime();
            if (now - lastLoginDate > sixMonthsMs) {
              console.log(`Ausbilder ${account.name} 6 Monate inaktiv - Daten werden gelöscht`);
              await deleteUserData(account.id, account.email, account.name);
            }
          }
        } catch (e) {
          console.error('Error checking user:', e);
        }
      }
    } catch (error) {
      console.log('Data retention check skipped:', error.message);
    }
  };

  const deleteUserData = async (userId, email, userName) => {
    try {
      // Delete related data first
      await supabase.from('user_stats').delete().eq('user_id', userId);
      await supabase.from('user_badges').delete().eq('user_name', userName);
      await supabase.from('notifications').delete().eq('user_name', userName);

      // Delete user
      await supabase.from('profiles').delete().eq('id', userId);

      console.log(`Alle Daten für ${email} gelöscht`);
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  };

  const exportUserData = async (email, userName) => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        user: userName,
        email: email,
        data: {}
      };

      // Get account data from Supabase
      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (userData) {
        exportData.data.account = userData;

        // Get stats
        const { data: statsData } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userData.id)
          .single();

        if (statsData) exportData.data.stats = statsData;
      }

      // Get user games
      const { data: gamesData } = await supabase
        .from('games')
        .select('*')
        .or(`player1.eq.${userName},player2.eq.${userName}`);

      exportData.data.games = gamesData || [];

      // Get user exams
      const { data: examsData } = await supabase
        .from('exams')
        .select('*')
        .eq('created_by', userName);

      exportData.data.exams = examsData || [];

      // Get submitted questions
      const { data: questionsData } = await supabase
        .from('custom_questions')
        .select('*')
        .eq('created_by', userName);

      exportData.data.questions = questionsData || [];

      // Get badges
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_name', userName);

      exportData.data.badges = badgesData || [];

      // Create download
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userName}_daten_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`Datenexport für ${userName} erfolgreich heruntergeladen!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Fehler beim Datenexport!');
    }
  };

  const loadNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_name', user.name)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const notifs = (data || []).map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        time: new Date(n.created_at).getTime(),
        read: n.read
      }));
      setNotifications(notifs);
    } catch (error) {
      console.log('Loading notifications...');
    }
  };

  const sendNotification = async (userName, title, message, type = 'info') => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_name: userName,
          title,
          message,
          type,
          read: false
        }])
        .select()
        .single();

      if (error) throw error;

      // Desktop notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '🏊',
          badge: '🔔',
          tag: `notif-${data.id}`
        });
      }

      // Sound notification
      playSound('whistle');
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const markNotificationAsRead = async (notifId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notifId);

      if (error) throw error;

      setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Mark read error:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_name', user.name);

      if (error) throw error;

      setNotifications([]);
    } catch (error) {
      console.error('Clear notifications error:', error);
    }
  };

  const getAdminStats = () => {
    const stats = {
      totalUsers: allUsers.length,
      pendingApprovals: pendingUsers.length,
      azubis: allUsers.filter(u => u.role === 'azubi').length,
      trainers: allUsers.filter(u => u.role === 'trainer').length,
      admins: allUsers.filter(u => u.role === 'admin').length,
      usersToDeleteSoon: allUsers.filter(u => {
        const days = getDaysUntilDeletion(u);
        return days !== null && days < 30 && days >= 0;
      }).length,
      totalGames: 0,
      totalMaterials: materials.length,
      totalQuestions: submittedQuestions.length,
      approvedQuestions: submittedQuestions.filter(q => q.approved).length,
      pendingQuestions: submittedQuestions.filter(q => !q.approved).length,
      activeGamesCount: activeGames.length,
      totalMessages: messages.length
    };

    // Count total games from storage
    activeGames.forEach(() => stats.totalGames++);

    return stats;
  };

  const handleRegister = async () => {
    if (!registerData.name || !registerData.email || !registerData.password) {
      alert('Bitte alle Felder ausfüllen!');
      return;
    }

    if (registerData.password.length < 6) {
      alert('Das Passwort muss mindestens 6 Zeichen lang sein!');
      return;
    }

    try {
      // Supabase Auth Registrierung
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            name: registerData.name,
            role: registerData.role,
            training_end: registerData.trainingEnd || null
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          alert('Diese E-Mail ist bereits registriert!');
        } else {
          throw error;
        }
        return;
      }

      console.log('User created via Supabase Auth:', data);

      // Profil erstellen - zuerst via RPC (umgeht RLS), dann Fallback via direktem Insert
      if (data?.user) {
        try {
          // RPC-Funktion aufrufen (funktioniert auch ohne aktive Session)
          const { error: rpcError } = await supabase.rpc('create_user_profile', {
            user_id: data.user.id,
            user_name: registerData.name,
            user_email: registerData.email,
            user_role: registerData.role,
            user_training_end: registerData.trainingEnd || null
          });

          if (rpcError) {
            console.warn('RPC Profil-Erstellung Info:', rpcError.message);
            // Fallback: Direkter Insert (funktioniert nur mit aktiver Session)
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                name: registerData.name,
                email: registerData.email,
                role: registerData.role,
                training_end: registerData.trainingEnd || null,
                approved: false
              }, { onConflict: 'id' });

            if (profileError) {
              console.warn('Profil-Fallback Info:', profileError.message);
            }
          } else {
            console.log('Profil erfolgreich via RPC erstellt');
          }
        } catch (e) {
          console.warn('Profil-Erstellung fehlgeschlagen:', e);
        }
      }

      // Direkt ausloggen - User muss erst freigeschaltet werden
      await supabase.auth.signOut();

      // Prüfe ob Email-Bestätigung erforderlich ist
      const emailConfirmRequired = data?.user && !data?.session;

      if (emailConfirmRequired) {
        alert('✅ Registrierung erfolgreich!\n\n📧 Bitte bestätige zuerst deine E-Mail-Adresse (prüfe auch den Spam-Ordner).\n\n⏳ Danach muss dein Account noch von einem Administrator freigeschaltet werden.');
      } else {
        alert('✅ Registrierung erfolgreich!\n\n⏳ Dein Account muss von einem Administrator freigeschaltet werden.\n\nDu erhältst eine Benachrichtigung, sobald dein Account aktiviert wurde.');
      }

      setAuthView('login');
      setRegisterData({ name: '', email: '', password: '', role: 'azubi', trainingEnd: '' });
    } catch (error) {
      alert('Fehler bei der Registrierung: ' + error.message);
      console.error('Registration error:', error);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert('Bitte E-Mail und Passwort eingeben!');
      return;
    }

    try {
      // Supabase Auth Login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword
      });

      if (authError) {
        if (authError.message.includes('Invalid login')) {
          alert('E-Mail oder Passwort falsch!');
        } else if (authError.message.includes('Email not confirmed')) {
          alert('Bitte bestätige zuerst deine E-Mail-Adresse.\n\nPrüfe dein E-Mail-Postfach (auch den Spam-Ordner) nach einer Bestätigungs-Mail von Supabase.\n\nFalls du keine E-Mail erhalten hast, wende dich an den Administrator.');
        } else {
          alert('Fehler beim Login: ' + authError.message);
        }
        return;
      }

      // Profil aus profiles Tabelle laden
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profil nicht gefunden:', profileError);
        await supabase.auth.signOut();
        alert('Profil nicht gefunden. Bitte kontaktiere den Administrator.');
        return;
      }

      // Prüfe ob Account freigeschaltet ist
      if (!profile.approved) {
        await supabase.auth.signOut();
        alert('Dein Account wurde noch nicht freigeschaltet. Bitte warte auf die Freigabe durch einen Administrator.');
        return;
      }

      // Update last login
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authData.user.id);

      // User Session erstellen
      const userSession = {
        id: authData.user.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        avatar: profile.avatar || null,
        company: profile.company || null,
        birthDate: profile.birth_date || null,
        canViewSchoolCards: profile.can_view_school_cards || false,
        canSignReports: profile.can_sign_reports || false,
        permissions: PERMISSIONS[profile.role]
      };

      setUser(userSession);
      localStorage.setItem('baeder_user', JSON.stringify(userSession));
      setDailyWisdom(DAILY_WISDOM[Math.floor(Math.random() * DAILY_WISDOM.length)]);

      // Initialize stats in Supabase if not exists
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (!existingStats) {
        await supabase
          .from('user_stats')
          .insert([{
            user_id: authData.user.id,
            wins: 0,
            losses: 0,
            draws: 0,
            category_stats: {},
            opponents: {}
          }]);
      }

      setLoginEmail('');
      setLoginPassword('');
      playSound('whistle');

    } catch (error) {
      alert('Fehler beim Login: ' + error.message);
      console.error('Login error:', error);
    }
  };

  const loadData = async () => {
    try {
      // Load App Config from Supabase (for all users)
      try {
        const { data: configData, error: configError } = await supabase
          .from('app_config')
          .select('*')
          .eq('id', 'main')
          .single();

        if (configError) {
          console.log('No custom config found, using defaults');
        } else if (configData) {
          const loadedMenuItems = configData.menu_items && configData.menu_items.length > 0
            ? configData.menu_items
            : DEFAULT_MENU_ITEMS;
          const loadedThemeColors = configData.theme_colors && Object.keys(configData.theme_colors).length > 0
            ? configData.theme_colors
            : DEFAULT_THEME_COLORS;

          setAppConfig({
            menuItems: loadedMenuItems,
            themeColors: loadedThemeColors
          });
        }
        setConfigLoaded(true);
      } catch (err) {
        console.error('Config load error:', err);
        setConfigLoaded(true);
      }

      // Load users from Supabase
      if (user && user.permissions.canManageUsers) {
        // Admin sees all users
        const { data: allUsersData } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (allUsersData) {
          const approved = allUsersData.filter(u => u.approved);
          const pending = allUsersData.filter(u => !u.approved);
          setAllUsers(approved);
          setPendingUsers(pending);
        }
      } else {
        // Normal users see only approved users
        const { data: approvedUsers } = await supabase
          .from('profiles')
          .select('*')
          .eq('approved', true);

        if (approvedUsers) {
          setAllUsers(approvedUsers);
        }
      }

      // Load games from Supabase
      const { data: gamesData } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (gamesData) {
        const games = gamesData.map(g => {
          // Winner aus DB laden, oder aus Scores berechnen (Fallback)
          let winner = g.winner || null;
          if (!winner && g.status === 'finished') {
            if (g.player1_score > g.player2_score) winner = g.player1;
            else if (g.player2_score > g.player1_score) winner = g.player2;
          }
          return {
            id: g.id,
            player1: g.player1,
            player2: g.player2,
            player1Score: g.player1_score,
            player2Score: g.player2_score,
            currentTurn: g.current_turn,
            categoryRound: g.round || 0,
            status: g.status,
            difficulty: g.difficulty,
            categoryRounds: g.rounds_data || [],
            winner: winner,
            questionHistory: []
          };
        });
        setAllGames(games);
        setActiveGames(games.filter(g => g.status !== 'finished'));
        updateLeaderboard(games, allUsers);
      }

      // Load all user stats for trainer dashboard cards
      const { data: allStatsData, error: allStatsError } = await supabase
        .from('user_stats')
        .select('user_id, wins, losses, draws, category_stats');

      if (allStatsError) {
        console.log('All stats load error:', allStatsError.message);
        setStatsByUserId({});
      } else if (allStatsData) {
        const nextStatsByUserId = {};
        allStatsData.forEach(row => {
          const wins = row.wins || 0;
          const losses = row.losses || 0;
          const draws = row.draws || 0;
          const xpMeta = getXpMetaFromCategoryStats(row.category_stats || {});
          nextStatsByUserId[row.user_id] = {
            wins,
            losses,
            draws,
            total: wins + losses + draws,
            totalXp: xpMeta.totalXp,
            xpBreakdown: xpMeta.breakdown
          };
        });
        setStatsByUserId(nextStatsByUserId);
      }

      // Load user stats from Supabase und mit beendeten Spielen synchronisieren
      if (user && user.id && gamesData) {
        try {
          const { data: statsData } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();

          let stats = ensureUserStatsStructure(statsData ? {
            wins: statsData.wins || 0,
            losses: statsData.losses || 0,
            draws: statsData.draws || 0,
            categoryStats: statsData.category_stats || {},
            opponents: statsData.opponents || {},
            winStreak: statsData.win_streak || 0,
            bestWinStreak: statsData.best_win_streak || 0
          } : createEmptyUserStats());

          // Stats aus beendeten Spielen neu berechnen (behebt inkonsistente lokale Stats)
          const currentUserName = normalizePlayerName(user.name);
          const finishedGames = gamesData.filter(g => {
            if (!isFinishedGameStatus(g.status)) return false;
            const p1 = normalizePlayerName(g.player1);
            const p2 = normalizePlayerName(g.player2);
            return p1 === currentUserName || p2 === currentUserName;
          });

          if (finishedGames.length > 0) {
            let syncedWins = 0, syncedLosses = 0, syncedDraws = 0;
            const syncedOpponents = {};

            finishedGames.forEach(g => {
              let winner = g.winner || null;
              if (!winner && g.player1_score > g.player2_score) winner = g.player1;
              else if (!winner && g.player2_score > g.player1_score) winner = g.player2;

              const opponent = normalizePlayerName(g.player1) === currentUserName ? g.player2 : g.player1;
              if (!syncedOpponents[opponent]) {
                syncedOpponents[opponent] = { wins: 0, losses: 0, draws: 0 };
              }

              if (normalizePlayerName(winner) === currentUserName) {
                syncedWins++;
                syncedOpponents[opponent].wins++;
              } else if (winner === null) {
                syncedDraws++;
                syncedOpponents[opponent].draws++;
              } else {
                syncedLosses++;
                syncedOpponents[opponent].losses++;
              }
            });

            const statsChanged =
              stats.wins !== syncedWins ||
              stats.losses !== syncedLosses ||
              stats.draws !== syncedDraws ||
              JSON.stringify(stats.opponents || {}) !== JSON.stringify(syncedOpponents);

            if (statsChanged) {
              stats.wins = syncedWins;
              stats.losses = syncedLosses;
              stats.draws = syncedDraws;
              stats.opponents = syncedOpponents;
              await saveUserStatsToSupabase(user.name, stats);
            }
          }

          setUserStats(stats);
        } catch (e) {
          console.log('Stats load:', e);
          setUserStats(ensureUserStatsStructure(createEmptyUserStats()));
        }
      }

      // Load messages from Supabase
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (messagesData) {
        const msgs = messagesData.map(m => ({
          id: m.id,
          user: m.user_name,
          text: m.content,
          time: new Date(m.created_at).getTime(),
          isTrainer: false, // Will be updated when we have role info
          avatar: m.user_avatar || null
        }));
        setMessages(msgs);
      }

      // Load custom questions from Supabase
      const { data: questionsData } = await supabase
        .from('custom_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (questionsData) {
        const qs = questionsData.map(q => ({
          id: q.id,
          text: q.question,
          category: q.category,
          answers: q.answers,
          correct: q.correct,
          submittedBy: q.created_by,
          approved: q.approved,
          time: new Date(q.created_at).getTime()
        }));
        setSubmittedQuestions(qs);
      }

      // Load materials from Supabase
      const { data: materialsData } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (materialsData) {
        const mats = materialsData.map(m => ({
          id: m.id,
          title: m.title,
          content: m.content,
          category: m.category,
          type: m.type,
          url: m.url,
          createdBy: m.created_by,
          time: new Date(m.created_at).getTime()
        }));
        setMaterials(mats);
      }

      // Load resources from Supabase
      try {
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (resourcesError) {
          console.error('Resources load error:', resourcesError);
        } else if (resourcesData) {
          const ress = resourcesData.map(r => ({
            id: r.id,
            title: r.title,
            description: r.description,
            url: r.url,
            type: r.category,
            addedBy: r.created_by,
            time: new Date(r.created_at).getTime()
          }));
          setResources(ress);
        }
      } catch (err) {
        console.error('Resources fetch failed:', err);
      }

      // Load news from Supabase
      const { data: newsData } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (newsData) {
        const newsItems = newsData.map(n => ({
          id: n.id,
          title: n.title,
          content: n.content,
          author: n.author,
          time: new Date(n.created_at).getTime()
        }));
        setNews(newsItems);
      }

      // Load exams from Supabase
      const { data: examsData } = await supabase
        .from('exams')
        .select('*')
        .order('exam_date', { ascending: true });

      if (examsData) {
        const exs = examsData.map(e => ({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.exam_date,
          location: e.location,
          createdBy: e.created_by,
          time: new Date(e.created_at).getTime()
        }));
        setExams(exs);
      }

      // Load flashcards from Supabase
      const { data: flashcardsData } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false });

      if (flashcardsData) {
        const fcs = [];
        const pendingFcs = [];
        flashcardsData.forEach(fc => {
          const card = {
            id: fc.id,
            category: fc.category,
            front: fc.question,
            back: fc.answer,
            approved: fc.approved,
            userId: fc.user_id
          };
          if (fc.approved) {
            fcs.push(card);
          } else {
            pendingFcs.push(card);
          }
        });
        setUserFlashcards(fcs);
        setPendingFlashcards(pendingFcs);
      }

      // Load user badges from Supabase
      if (user?.id) {
        // Versuche zuerst nach user_id zu suchen, dann nach user_name (Abwärtskompatibilität)
        let badgesData = null;
        const { data: byId } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id);

        if (byId && byId.length > 0) {
          badgesData = byId;
        } else if (user.name) {
          // Fallback für alte Einträge ohne user_id
          const { data: byName } = await supabase
            .from('user_badges')
            .select('*')
            .eq('user_name', user.name);
          badgesData = byName;
        }

        if (badgesData) {
          const badges = badgesData.map(b => ({
            id: b.badge_id,
            earnedAt: new Date(b.earned_at).getTime()
          }));
          setUserBadges(badges);
        }
      }
    } catch (error) {
      console.log('Loading data - some features may not work:', error.message);
    }
  };

  const updateLeaderboard = (games, users) => {
    const stats = {};

    // Nur vollständig gespielte Spiele zählen
    games.filter(g => {
      if (g.status !== 'finished') return false;
      const rounds = g.categoryRounds || [];
      if (rounds.length === 0) return false;
      return rounds.every(r =>
        r.player1Answers && r.player1Answers.length > 0 &&
        r.player2Answers && r.player2Answers.length > 0
      );
    }).forEach(game => {
      [game.player1, game.player2].forEach(player => {
        if (!stats[player]) {
          stats[player] = { name: player, wins: 0, losses: 0, draws: 0, points: 0 };
        }
      });

      if (game.winner === game.player1) {
        stats[game.player1].wins++;
        stats[game.player2].losses++;
        stats[game.player1].points += 3;
      } else if (game.winner === game.player2) {
        stats[game.player2].wins++;
        stats[game.player1].losses++;
        stats[game.player2].points += 3;
      } else {
        stats[game.player1].draws++;
        stats[game.player2].draws++;
        stats[game.player1].points += 1;
        stats[game.player2].points += 1;
      }
    });

    const ranking = Object.values(stats).sort((a, b) => b.points - a.points);
    setLeaderboard(ranking);
  };

  const approveUser = async (email) => {
    try {
      // Update user in Supabase
      const { data: account, error } = await supabase
        .from('profiles')
        .update({ approved: true })
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;

      // Initialize stats in Supabase
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', account.id)
        .single();

      if (!existingStats) {
        await supabase
          .from('user_stats')
          .insert([{
            user_id: account.id,
            wins: 0,
            losses: 0,
            draws: 0,
            category_stats: {},
            opponents: {}
          }]);
      }

      loadData();
      playSound('whistle');
      showToast(`${account.name} wurde freigeschaltet!`, 'success');
    } catch (error) {
      console.error('Error approving user:', error);
      showToast('Fehler beim Freischalten', 'error');
    }
  };

  const deleteUser = async (email) => {
    try {
      // Get user from Supabase
      const { data: account, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError || !account) {
        showToast('User nicht gefunden', 'error');
        return;
      }

      // NEVER allow deletion of admin accounts
      if (account.role === 'admin') {
        showToast('Administratoren können nicht gelöscht werden!', 'error');
        return;
      }

      if (!confirm('Möchtest du diesen Nutzer wirklich löschen? Alle Daten werden unwiderruflich gelöscht!')) {
        return;
      }

      // Delete profile from Supabase
      // HINWEIS: Der Supabase Auth User bleibt erhalten und muss über
      // eine Edge Function oder manuell im Dashboard gelöscht werden.
      // Für vollständige Löschung: supabase.auth.admin.deleteUser(userId)
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('email', email);

      if (deleteError) throw deleteError;

      loadData();
      showToast('Nutzerprofil und Daten wurden gelöscht', 'success');
    } catch (error) {
      console.error('Delete user error:', error);
      showToast('Fehler beim Löschen', 'error');
    }
  };

  const changeUserRole = async (email, newRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('email', email);

      if (error) throw error;

      loadData();
      showToast(`Rolle geändert zu: ${PERMISSIONS[newRole].label}`, 'success');
    } catch (error) {
      console.error('Error changing role:', error);
      showToast('Fehler beim Ändern der Rolle', 'error');
    }
  };

  // Kontrollkarten-Berechtigung für Trainer ändern
  const toggleSchoolCardPermission = async (userId, currentValue) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ can_view_school_cards: !currentValue })
        .eq('id', userId);

      if (error) throw error;

      loadData();
      showToast(
        !currentValue
          ? 'Kontrollkarten-Berechtigung erteilt'
          : 'Kontrollkarten-Berechtigung entzogen',
        'success'
      );
    } catch (error) {
      console.error('Error toggling school card permission:', error);
      showToast('Fehler beim Ändern der Berechtigung', 'error');
    }
  };

  // Berichtsheft-Unterschrift-Berechtigung für Trainer ändern
  const toggleSignReportsPermission = async (userId, currentValue) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ can_sign_reports: !currentValue })
        .eq('id', userId);

      if (error) throw error;

      loadData();
      showToast(
        !currentValue
          ? 'Berichtsheft-Unterschrift-Berechtigung erteilt'
          : 'Berichtsheft-Unterschrift-Berechtigung entzogen',
        'success'
      );
    } catch (error) {
      console.error('Error toggling sign reports permission:', error);
      showToast('Fehler beim Ändern der Berechtigung', 'error');
    }
  };

  // Profil-Bearbeitung: Name ändern
  const updateProfileName = async () => {
    if (!profileEditName.trim()) {
      showToast('Bitte gib einen Namen ein.', 'warning');
      return;
    }

    setProfileSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: profileEditName.trim() })
        .eq('id', user.id);

      if (error) throw error;

      // Lokalen User-State aktualisieren
      const updatedUser = { ...user, name: profileEditName.trim() };
      setUser(updatedUser);
      localStorage.setItem('baeder_user', JSON.stringify(updatedUser));

      showToast('Name erfolgreich geändert!', 'success');
      setProfileEditName('');
    } catch (error) {
      console.error('Error updating name:', error);
      showToast('Fehler beim Ändern des Namens', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  // Profil-Bearbeitung: Passwort ändern
  const updateProfilePassword = async () => {
    if (!profileEditPassword || !profileEditPasswordConfirm) {
      showToast('Bitte beide Passwort-Felder ausfüllen.', 'warning');
      return;
    }

    if (profileEditPassword !== profileEditPasswordConfirm) {
      showToast('Die Passwörter stimmen nicht überein!', 'error');
      return;
    }

    if (profileEditPassword.length < 6) {
      showToast('Das Passwort muss mindestens 6 Zeichen haben.', 'warning');
      return;
    }

    setProfileSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: profileEditPassword
      });

      if (error) throw error;

      showToast('Passwort erfolgreich geändert!', 'success');
      setProfileEditPassword('');
      setProfileEditPasswordConfirm('');
    } catch (error) {
      console.error('Error updating password:', error);
      showToast('Fehler beim Ändern des Passworts', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  // Profil-Bearbeitung: Avatar ändern
  const updateProfileAvatar = async (avatarId) => {
    setProfileSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar: avatarId })
        .eq('id', user.id);

      if (error) throw error;

      // Lokalen User-State aktualisieren
      const updatedUser = { ...user, avatar: avatarId };
      setUser(updatedUser);
      localStorage.setItem('baeder_user', JSON.stringify(updatedUser));
      showToast(avatarId ? 'Avatar geändert!' : 'Avatar entfernt', 'success');
    } catch (error) {
      console.error('Error updating avatar:', error);
      showToast('Fehler beim Ändern des Avatars', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  // Profil-Bearbeitung: Betrieb ändern
  const updateProfileCompany = async () => {
    setProfileSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ company: profileEditCompany.trim() || null })
        .eq('id', user.id);

      if (error) throw error;

      // Lokalen User-State aktualisieren
      const updatedUser = { ...user, company: profileEditCompany.trim() || null };
      setUser(updatedUser);
      localStorage.setItem('baeder_user', JSON.stringify(updatedUser));
      showToast('Betrieb gespeichert!', 'success');
      setProfileEditCompany('');
    } catch (error) {
      console.error('Error updating company:', error);
      showToast('Fehler beim Speichern des Betriebs', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  // Profil-Bearbeitung: Geburtsdatum ändern
  const updateProfileBirthDate = async () => {
    if (!profileEditBirthDate) {
      showToast('Bitte gib dein Geburtsdatum ein', 'warning');
      return;
    }
    setProfileSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ birth_date: profileEditBirthDate })
        .eq('id', user.id);

      if (error) throw error;

      // Lokalen User-State aktualisieren
      const updatedUser = { ...user, birthDate: profileEditBirthDate };
      setUser(updatedUser);
      localStorage.setItem('baeder_user', JSON.stringify(updatedUser));
      showToast('Geburtsdatum gespeichert!', 'success');
      setProfileEditBirthDate('');
    } catch (error) {
      console.error('Error updating birth date:', error);
      showToast('Fehler beim Speichern des Geburtsdatums', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const getDaysUntilDeletion = (account) => {
    // Admins are NEVER deleted
    if (account.role === 'admin') {
      return null;
    }
    
    const now = Date.now();
    
    if (account.role === 'azubi' && account.trainingEnd) {
      const endDate = new Date(account.trainingEnd).getTime();
      const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return daysLeft;
    }
    
    if (account.role === 'trainer' && account.lastLogin) {
      const sixMonthsMs = 6 * 30 * 24 * 60 * 60 * 1000;
      const deleteDate = account.lastLogin + sixMonthsMs;
      const daysLeft = Math.ceil((deleteDate - now) / (1000 * 60 * 60 * 24));
      return daysLeft;
    }
    
    return null;
  };

  // Quiz functions with Supabase
  const challengePlayer = async (opponent) => {
    // Prüfe ob bereits ein laufendes Spiel gegen diesen Gegner existiert
    const existingGame = activeGames.find(g =>
      g.status !== 'finished' &&
      ((g.player1 === user.name && g.player2 === opponent) ||
       (g.player1 === opponent && g.player2 === user.name))
    );

    if (existingGame) {
      showToast(`Du hast bereits ein laufendes Spiel gegen ${opponent}!`, 'error');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('games')
        .insert([{
          player1: user.name,
          player2: opponent,
          difficulty: selectedDifficulty,
          status: 'waiting',
          round: 0,
          player1_score: 0,
          player2_score: 0,
          current_turn: user.name,
          rounds_data: []
        }])
        .select()
        .single();

      if (error) throw error;

      const game = {
        id: data.id,
        player1: data.player1,
        player2: data.player2,
        difficulty: data.difficulty,
        status: data.status,
        categoryRound: 0, // 0-3 (4 Kategorien)
        player1Score: data.player1_score,
        player2Score: data.player2_score,
        currentTurn: data.current_turn,
        categoryRounds: [], // Speichert alle Kategorie-Runden mit Fragen
        questionHistory: []
      };

      setActiveGames([...activeGames, game]);
      setSelectedOpponent(null);
      showToast(`Herausforderung an ${opponent} gesendet!`, 'success');
    } catch (error) {
      console.error('Challenge error:', error);
      showToast('Fehler beim Senden der Herausforderung', 'error');
    }
  };

  const acceptChallenge = async (gameId) => {
    const game = activeGames.find(g => g.id === gameId);
    if (!game) return;

    try {
      const { error } = await supabase
        .from('games')
        .update({ status: 'active' })
        .eq('id', gameId);

      if (error) throw error;

      game.status = 'active';
      game.categoryRound = 0;
      game.categoryRounds = [];
      setCurrentGame(game);
      setCategoryRound(0);
      setQuestionInCategory(0);
      setPlayerTurn(game.currentTurn);
      setCurrentView('quiz');
    } catch (error) {
      console.error('Accept error:', error);
    }
  };

  const continueGame = async (gameId) => {
    const game = activeGames.find(g => g.id === gameId);
    if (!game) return;

    setCurrentGame(game);
    setCategoryRound(game.categoryRound || 0);
    setQuestionInCategory(0);
    setPlayerTurn(game.currentTurn);

    // Prüfe ob der Spieler die gespeicherten Fragen spielen muss
    if (game.categoryRounds && game.categoryRounds.length > 0) {
      const currentCatRound = game.categoryRounds[game.categoryRound || 0];
      if (currentCatRound) {
        const isPlayer1 = user.name === game.player1;
        const myAnswers = isPlayer1 ? currentCatRound.player1Answers : currentCatRound.player2Answers;

        // Wenn ich noch keine Antworten habe aber Fragen existieren, muss ich die gleichen Fragen spielen
        if (myAnswers.length === 0 && currentCatRound.questions.length > 0) {
          setQuizCategory(currentCatRound.categoryId);
          setCurrentCategoryQuestions(currentCatRound.questions);
        }
      }
    }

    setCurrentView('quiz');
  };

  // Helper function to save game state to Supabase
  const saveGameToSupabase = async (game) => {
    try {
      const updateData = {
        player1_score: game.player1Score,
        player2_score: game.player2Score,
        current_turn: game.currentTurn,
        round: game.categoryRound || 0,
        status: game.status,
        rounds_data: game.categoryRounds || [],
        updated_at: new Date().toISOString()
      };

      // Winner-Feld nur setzen wenn Spiel beendet ist
      if (game.status === 'finished') {
        updateData.winner = game.winner || null;
      }

      const { error } = await supabase
        .from('games')
        .update(updateData)
        .eq('id', game.id);

      if (error) throw error;
    } catch (error) {
      console.error('Save game error:', error);
    }
  };

  // Helper function to save user stats to Supabase
  const saveUserStatsToSupabase = async (userName, stats) => {
    try {
      const safeStats = ensureUserStatsStructure(stats);

      // First get user id
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .ilike('name', userName)
        .single();

      if (userError) throw userError;

      // Check if stats exist
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('id')
        .eq('user_id', userData.id)
        .single();

      if (existingStats) {
        // Update existing stats
        const { error } = await supabase
          .from('user_stats')
          .update({
            wins: safeStats.wins,
            losses: safeStats.losses,
            draws: safeStats.draws,
            category_stats: safeStats.categoryStats || {},
            opponents: safeStats.opponents || {}
          })
          .eq('user_id', userData.id);
        if (error) throw error;
      } else {
        // Create new stats
        const { error } = await supabase
          .from('user_stats')
          .insert([{
            user_id: userData.id,
            wins: safeStats.wins,
            losses: safeStats.losses,
            draws: safeStats.draws,
            category_stats: safeStats.categoryStats || {},
            opponents: safeStats.opponents || {}
          }]);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Save stats error:', error);
    }
  };

  // Helper function to get user stats from Supabase
  const getUserStatsFromSupabase = async (userName) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .ilike('name', userName)
        .single();

      if (userError) return null;

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (error) return null;

      return ensureUserStatsStructure({
        wins: data.wins || 0,
        losses: data.losses || 0,
        draws: data.draws || 0,
        categoryStats: data.category_stats || {},
        opponents: data.opponents || {},
        winStreak: data.win_streak || 0,
        bestWinStreak: data.best_win_streak || 0
      });
    } catch (error) {
      console.error('Get stats error:', error);
      return null;
    }
  };

  const queueXpAward = (sourceKey, amount, options = {}) => {
    const xpAmount = toSafeInt(amount);
    if (!user?.name || !user?.id || xpAmount <= 0) {
      return Promise.resolve(0);
    }

    const { eventKey = null, reason = null, showXpToast = false } = options;

    xpAwardQueueRef.current = xpAwardQueueRef.current
      .then(async () => {
        const currentStats = await getUserStatsFromSupabase(user.name);
        const baseStats = ensureUserStatsStructure(currentStats || createEmptyUserStats());
        const { stats: xpUpdatedStats, addedXp } = addXpToStats(baseStats, sourceKey, xpAmount, eventKey);
        if (addedXp <= 0) {
          return 0;
        }

        await saveUserStatsToSupabase(user.name, xpUpdatedStats);
        setUserStats(xpUpdatedStats);
        setStatsByUserId(prev => {
          const wins = xpUpdatedStats.wins || 0;
          const losses = xpUpdatedStats.losses || 0;
          const draws = xpUpdatedStats.draws || 0;
          return {
            ...prev,
            [user.id]: {
              ...(prev[user.id] || {}),
              wins,
              losses,
              draws,
              total: wins + losses + draws,
              totalXp: getTotalXpFromStats(xpUpdatedStats),
              xpBreakdown: getXpBreakdownFromStats(xpUpdatedStats)
            }
          };
        });

        if (showXpToast) {
          showToast(`+${addedXp} XP${reason ? ` • ${reason}` : ''}`, 'success', 2500);
        }
        return addedXp;
      })
      .catch(error => {
        console.error('XP update error:', error);
        return 0;
      });

    return xpAwardQueueRef.current;
  };

  // Fisher-Yates Shuffle für zufällige Fragenreihenfolge
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Spieler wählt Kategorie → 5 zufällige Fragen werden für BEIDE Spieler gespeichert
  const selectCategory = async (catId) => {
    if (!currentGame || currentGame.currentTurn !== user.name) return;

    setQuizCategory(catId);

    // Hole alle Fragen dieser Kategorie und mische sie
    const allQuestions = SAMPLE_QUESTIONS[catId] || [];
    const shuffledQuestions = shuffleArray(allQuestions);

    // Nimm 5 Fragen (oder weniger falls nicht genug vorhanden)
    const selectedQuestions = shuffledQuestions.slice(0, Math.min(5, shuffledQuestions.length));

    // Mische auch die Antworten jeder Frage
    const questionsWithShuffledAnswers = selectedQuestions.map(q => shuffleAnswers(q));

    // Speichere die Fragen im Game für beide Spieler
    if (!currentGame.categoryRounds) currentGame.categoryRounds = [];
    currentGame.categoryRounds.push({
      categoryId: catId,
      categoryName: CATEGORIES.find(c => c.id === catId)?.name || catId,
      questions: questionsWithShuffledAnswers,
      player1Answers: [], // Antworten von Spieler 1
      player2Answers: [], // Antworten von Spieler 2
      chooser: user.name  // Wer hat die Kategorie gewählt
    });

    setCurrentCategoryQuestions(questionsWithShuffledAnswers);
    setQuestionInCategory(0);
    setCurrentQuestion(questionsWithShuffledAnswers[0]);
    setAnswered(false);
    setSelectedAnswers([]); // Reset für Multi-Select
    setLastSelectedAnswer(null); // Reset für Single-Choice

    const timeLimit = DIFFICULTY_SETTINGS[currentGame.difficulty].time;
    setTimeLeft(timeLimit);
    setTimerActive(true);

    await saveGameToSupabase(currentGame);
  };

  const handleTimeUp = async () => {
    if (answered || !currentGame) return;
    setAnswered(true);
    setTimerActive(false);

    // Speichere falsche Antwort (Timeout)
    await savePlayerAnswer(false, true);
  };

  // Toggle Antwort für Multi-Select Fragen
  const toggleAnswer = (answerIndex) => {
    if (answered || !currentGame) return;

    setSelectedAnswers(prev => {
      if (prev.includes(answerIndex)) {
        return prev.filter(i => i !== answerIndex);
      } else {
        return [...prev, answerIndex];
      }
    });
  };

  // Bestätigen der Multi-Select Antwort
  const confirmMultiSelectAnswer = async () => {
    if (answered || !currentGame || !currentQuestion.multi) return;
    setAnswered(true);
    setTimerActive(false);

    // Prüfe ob alle richtigen Antworten ausgewählt wurden (und keine falschen)
    const correctAnswers = currentQuestion.correct;
    const isCorrect =
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every(idx => correctAnswers.includes(idx));

    await savePlayerAnswer(isCorrect, false);
  };

  const answerQuestion = async (answerIndex) => {
    if (answered || !currentGame) return;

    // Multi-Select: Nur togglen, nicht direkt antworten
    if (currentQuestion.multi) {
      toggleAnswer(answerIndex);
      return;
    }

    // Single-Choice: Direkt antworten
    setAnswered(true);
    setTimerActive(false);
    setLastSelectedAnswer(answerIndex); // Speichere gewählte Antwort für Feedback

    const isCorrect = answerIndex === currentQuestion.correct;
    await savePlayerAnswer(isCorrect, false);
  };

  // Speichert die Antwort des aktuellen Spielers
  const savePlayerAnswer = async (isCorrect, isTimeout) => {
    const isPlayer1 = user.name === currentGame.player1;
    const currentCategoryRound = currentGame.categoryRounds[currentGame.categoryRound];

    // Daily Challenge Progress
    updateChallengeProgress('answer_questions', 1);
    if (isCorrect) {
      updateChallengeProgress('correct_answers', 1);
    }
    if (quizCategory) {
      updateChallengeProgress('category_master', 1, quizCategory);
    }
    updateChallengeProgress('quiz_play', 1);

    // Punkte vergeben
    if (isCorrect) {
      if (isPlayer1) {
        currentGame.player1Score++;
      } else {
        currentGame.player2Score++;
      }
    }

    // Antwort speichern
    const answer = {
      questionIndex: questionInCategory,
      correct: isCorrect,
      timeout: isTimeout
    };

    if (isPlayer1) {
      currentCategoryRound.player1Answers.push(answer);
    } else {
      currentCategoryRound.player2Answers.push(answer);
    }

    // Stats aktualisieren
    const stats = ensureUserStatsStructure(userStats || createEmptyUserStats());

    if (!stats.categoryStats[quizCategory]) {
      stats.categoryStats[quizCategory] = { correct: 0, incorrect: 0, total: 0 };
    }

    if (isCorrect) {
      stats.categoryStats[quizCategory].correct++;
    } else {
      stats.categoryStats[quizCategory].incorrect++;
    }
    stats.categoryStats[quizCategory].total++;

    await saveUserStatsToSupabase(user.name, stats);
    setUserStats(stats);
    await saveGameToSupabase(currentGame);
  };

  // Funktion zum Weitergehen zur nächsten Frage/Runde
  const proceedToNextRound = async () => {
    const isPlayer1 = user.name === currentGame.player1;
    const currentCategoryRound = currentGame.categoryRounds[currentGame.categoryRound];
    const questionsInCurrentCategory = currentCategoryRound.questions.length;

    // Nächste Frage in der aktuellen Kategorie?
    if (questionInCategory < questionsInCurrentCategory - 1) {
      // Noch mehr Fragen in dieser Kategorie
      const nextQuestionIndex = questionInCategory + 1;
      setQuestionInCategory(nextQuestionIndex);
      setCurrentQuestion(currentCategoryQuestions[nextQuestionIndex]);
      setAnswered(false);
      setSelectedAnswers([]); // Reset für Multi-Select
      setLastSelectedAnswer(null); // Reset für Single-Choice

      const timeLimit = DIFFICULTY_SETTINGS[currentGame.difficulty].time;
      setTimeLeft(timeLimit);
      setTimerActive(true);
      return;
    }

    // Alle 5 Fragen dieser Kategorie beantwortet
    // Prüfe ob der andere Spieler auch schon dran war
    const player1Done = currentCategoryRound.player1Answers.length >= questionsInCurrentCategory;
    const player2Done = currentCategoryRound.player2Answers.length >= questionsInCurrentCategory;

    if (isPlayer1 && !player2Done) {
      // Spieler 1 fertig, Spieler 2 muss noch die gleichen Fragen beantworten
      currentGame.currentTurn = currentGame.player2;
      setWaitingForOpponent(true);
      setQuizCategory(null);
      setCurrentQuestion(null);
      setPlayerTurn(currentGame.player2);

      await saveGameToSupabase(currentGame);

      // Benachrichtigung an Spieler 2
      await sendNotification(
        currentGame.player2,
        '⚡ Du bist dran!',
        `${user.name} hat die Kategorie "${currentCategoryRound.categoryName}" gespielt. Jetzt bist du dran mit den gleichen Fragen!`,
        'info'
      );
      return;
    }

    if (!isPlayer1 && !player1Done) {
      // Spieler 2 fertig (hat Kategorie gewählt), Spieler 1 muss noch
      currentGame.currentTurn = currentGame.player1;
      setWaitingForOpponent(true);
      setQuizCategory(null);
      setCurrentQuestion(null);
      setPlayerTurn(currentGame.player1);

      await saveGameToSupabase(currentGame);

      await sendNotification(
        currentGame.player1,
        '⚡ Du bist dran!',
        `${user.name} hat die Kategorie "${currentCategoryRound.categoryName}" gespielt. Jetzt bist du dran mit den gleichen Fragen!`,
        'info'
      );
      return;
    }

    // Beide Spieler haben diese Kategorie abgeschlossen
    // Nächste Kategorie oder Spielende?
    if (currentGame.categoryRound < 3) {
      // Nächste Kategorie-Runde (insgesamt 4)
      currentGame.categoryRound++;

      // Der Spieler der NICHT die letzte Kategorie gewählt hat, wählt jetzt
      const nextChooser = currentCategoryRound.chooser === currentGame.player1
        ? currentGame.player2
        : currentGame.player1;

      currentGame.currentTurn = nextChooser;

      setCategoryRound(currentGame.categoryRound);
      setQuestionInCategory(0);
      setQuizCategory(null);
      setCurrentQuestion(null);
      setCurrentCategoryQuestions([]);
      setPlayerTurn(nextChooser);
      setWaitingForOpponent(false);
      setAnswered(false);

      await saveGameToSupabase(currentGame);

      if (nextChooser !== user.name) {
        await sendNotification(
          nextChooser,
          '🎯 Wähle eine Kategorie!',
          `Runde ${currentGame.categoryRound + 1}/4 - Du darfst die nächste Kategorie wählen!`,
          'info'
        );
      }
    } else {
      // Spiel beendet (4 Kategorien gespielt)
      await finishGame();
    }
  };

  // Wenn Spieler 2 die gespeicherten Fragen spielen muss
  const startCategoryAsSecondPlayer = () => {
    if (!currentGame || !currentGame.categoryRounds) return;

    const currentCategoryRound = currentGame.categoryRounds[currentGame.categoryRound];
    if (!currentCategoryRound) return;

    setQuizCategory(currentCategoryRound.categoryId);
    setCurrentCategoryQuestions(currentCategoryRound.questions);
    setQuestionInCategory(0);
    setCurrentQuestion(currentCategoryRound.questions[0]);
    setAnswered(false);
    setSelectedAnswers([]); // Reset für Multi-Select
    setLastSelectedAnswer(null); // Reset für Single-Choice
    setWaitingForOpponent(false);

    const timeLimit = DIFFICULTY_SETTINGS[currentGame.difficulty].time;
    setTimeLeft(timeLimit);
    setTimerActive(true);
  };

  const finishGame = async () => {
    currentGame.status = 'finished';

    let winner = null;
    if (currentGame.player1Score > currentGame.player2Score) {
      winner = currentGame.player1;
    } else if (currentGame.player2Score > currentGame.player1Score) {
      winner = currentGame.player2;
    }
    currentGame.winner = winner;

    try {
      await saveGameToSupabase(currentGame);

      // Nur eigene Stats aktualisieren (RLS erlaubt nur eigene Stats)
      try {
        const existingStats = await getUserStatsFromSupabase(user.name);
        let stats = ensureUserStatsStructure(existingStats || createEmptyUserStats());

        const opponent = user.name === currentGame.player1 ? currentGame.player2 : currentGame.player1;

        if (!stats.opponents[opponent]) {
          stats.opponents[opponent] = { wins: 0, losses: 0, draws: 0 };
        }

        if (winner === user.name) {
          stats.wins++;
          stats.opponents[opponent].wins++;
          stats.winStreak++;
          if (stats.winStreak > stats.bestWinStreak) {
            stats.bestWinStreak = stats.winStreak;
          }

          const xpResult = addXpToStats(
            stats,
            'quizWins',
            XP_REWARDS.QUIZ_WIN,
            `quiz_win_${currentGame.id}_${user.id}`
          );
          stats = xpResult.stats;

          if (xpResult.addedXp > 0) {
            showToast(`+${xpResult.addedXp} XP • Quizduell-Sieg`, 'success', 2500);
          }
        } else if (winner === null) {
          stats.draws++;
          stats.opponents[opponent].draws++;
        } else {
          stats.losses++;
          stats.opponents[opponent].losses++;
          stats.winStreak = 0;
        }

        await saveUserStatsToSupabase(user.name, stats);
        setUserStats(stats);
        setStatsByUserId(prev => {
          const wins = stats.wins || 0;
          const losses = stats.losses || 0;
          const draws = stats.draws || 0;
          return {
            ...prev,
            [user.id]: {
              ...(prev[user.id] || {}),
              wins,
              losses,
              draws,
              total: wins + losses + draws,
              totalXp: getTotalXpFromStats(stats),
              xpBreakdown: getXpBreakdownFromStats(stats)
            }
          };
        });
      } catch (error) {
        console.error('Stats update error:', error);
      }

      // Spiel-State komplett zurücksetzen
      setCurrentGame(null);
      setQuizCategory(null);
      setCurrentQuestion(null);
      setCurrentCategoryQuestions([]);
      setCategoryRound(0);
      setQuestionInCategory(0);
      setPlayerTurn(null);
      setWaitingForOpponent(false);
      setAnswered(false);
      setSelectedAnswers([]);
      setLastSelectedAnswer(null);
      setTimerActive(false);

      // Spieleliste neu laden damit beendetes Spiel verschwindet
      loadData();

      showToast(
        winner === user.name
          ? '🎉 Glückwunsch, du hast gewonnen!'
          : winner === null
            ? '🤝 Unentschieden!'
            : '😔 Leider verloren!',
        winner === user.name ? 'success' : 'info'
      );

      setCurrentView('quizduell');
      checkBadges();
    } catch (error) {
      console.error('Finish error:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    // Content moderation
    if (!moderateContent(newMessage, 'Nachricht')) {
      setNewMessage('');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          user_name: user.name,
          content: newMessage.trim(),
          user_avatar: user.avatar || null
        }])
        .select()
        .single();

      if (error) throw error;

      // Add to local state with compatible format
      const msg = {
        id: data.id,
        user: data.user_name,
        text: data.content,
        time: new Date(data.created_at).getTime(),
        isTrainer: user.role === 'trainer' || user.role === 'admin',
        avatar: data.user_avatar
      };

      setMessages([...messages, msg]);
      setNewMessage('');
    } catch (error) {
      console.error('Message error:', error);
    }
  };

  const submitQuestion = async () => {
    if (!newQuestionText.trim() || !user) return;

    // Content moderation
    if (!moderateContent(newQuestionText, 'Frage')) {
      return;
    }
    
    for (let i = 0; i < newQuestionAnswers.length; i++) {
      if (newQuestionAnswers[i] && !moderateContent(newQuestionAnswers[i], `Antwort ${i + 1}`)) {
        return;
      }
    }

    try {
      const { data, error } = await supabase
        .from('custom_questions')
        .insert([{
          category: newQuestionCategory,
          question: newQuestionText,
          answers: newQuestionAnswers,
          correct: newQuestionCorrect,
          created_by: user.name,
          approved: false
        }])
        .select()
        .single();

      if (error) throw error;

      const q = {
        id: data.id,
        text: data.question,
        category: data.category,
        answers: data.answers,
        correct: data.correct,
        submittedBy: data.created_by,
        approved: data.approved,
        time: new Date(data.created_at).getTime()
      };

      setSubmittedQuestions([...submittedQuestions, q]);
      setNewQuestionText('');
      setNewQuestionAnswers(['', '', '', '']);
      showToast('Frage eingereicht!', 'success');
    } catch (error) {
      console.error('Question error:', error);
      showToast('Fehler beim Einreichen der Frage', 'error');
    }
  };

  const approveQuestion = async (qId) => {
    try {
      const { error } = await supabase
        .from('custom_questions')
        .update({ approved: true })
        .eq('id', qId);

      if (error) throw error;

      setSubmittedQuestions(submittedQuestions.map(sq => sq.id === qId ? { ...sq, approved: true } : sq));
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  
  // Exam Simulator Functions
  const loadExamProgress = () => {
    setExamSimulatorMode('theory');
    const allQuestions = [];
    Object.entries(SAMPLE_QUESTIONS).forEach(([catId, questions]) => {
      questions.forEach(q => { allQuestions.push({ ...q, category: catId }); });
    });
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    // Mische die Antworten jeder Frage, damit die richtige Antwort nicht immer an der gleichen Stelle ist
    const examQuestions = shuffled.slice(0, Math.min(30, shuffled.length)).map(q => shuffleAnswers(q));
    setExamSimulator({ questions: examQuestions, answers: [], startTime: Date.now() });
    setExamQuestionIndex(0);
    setExamCurrentQuestion(examQuestions[0]);
    setExamAnswered(false);
    setExamSelectedAnswers([]); // Reset Multi-Select
    setExamSelectedAnswer(null); // Reset Single-Choice
    setUserExamProgress(null);
  };

  const toIsoDateTime = (value) => {
    const date = new Date(value || Date.now());
    if (Number.isNaN(date.getTime())) return new Date().toISOString();
    return date.toISOString();
  };

  const toPracticalAttemptId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const normalizePracticalAttempt = (rawAttempt) => {
    if (!rawAttempt || typeof rawAttempt !== 'object') return null;

    let rows = rawAttempt.result_rows ?? rawAttempt.rows ?? [];
    if (typeof rows === 'string') {
      try {
        rows = JSON.parse(rows);
      } catch {
        rows = [];
      }
    }
    if (!Array.isArray(rows)) rows = [];

    const id = rawAttempt.id || rawAttempt.attempt_id || toPracticalAttemptId();
    const examType = rawAttempt.exam_type || rawAttempt.type || 'zwischen';
    const averageGradeRaw = rawAttempt.average_grade ?? rawAttempt.averageGrade;
    const averageGrade = Number.isFinite(Number(averageGradeRaw))
      ? Number(averageGradeRaw)
      : null;
    const gradedCountRaw = rawAttempt.graded_count ?? rawAttempt.gradedCount;
    const gradedCount = Number.isFinite(Number(gradedCountRaw))
      ? Number(gradedCountRaw)
      : rows.filter(row => toNumericGrade(row?.grade) !== null).length;
    const passedRaw = rawAttempt.passed;
    const passed = typeof passedRaw === 'boolean'
      ? passedRaw
      : (averageGrade !== null ? averageGrade <= 4 : null);

    return {
      id,
      user_id: rawAttempt.user_id || '',
      user_name: rawAttempt.user_name || 'Unbekannt',
      exam_type: examType,
      average_grade: averageGrade,
      graded_count: gradedCount,
      passed,
      rows,
      created_at: toIsoDateTime(rawAttempt.created_at || rawAttempt.createdAt),
      created_by: rawAttempt.created_by || null,
      created_by_name: rawAttempt.created_by_name || null,
      source: rawAttempt.source || (String(id).startsWith('local-') ? 'local' : 'remote')
    };
  };

  const loadLocalPracticalAttempts = () => {
    try {
      const raw = localStorage.getItem(PRACTICAL_ATTEMPTS_LOCAL_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map(normalizePracticalAttempt)
        .filter(Boolean);
    } catch {
      return [];
    }
  };

  const saveLocalPracticalAttempts = (attempts) => {
    const safeAttempts = Array.isArray(attempts) ? attempts.slice(0, 500) : [];
    localStorage.setItem(PRACTICAL_ATTEMPTS_LOCAL_KEY, JSON.stringify(safeAttempts));
  };

  const getPracticalExamTargetUser = () => {
    if (!user?.id) return null;
    const canManageAll = Boolean(user?.permissions?.canViewAllStats);
    if (!canManageAll) {
      return { id: user.id, name: user.name || 'Unbekannt', role: user.role || 'azubi' };
    }
    const azubis = allUsers.filter(account => account?.role === 'azubi');
    const selectedAzubi = azubis.find(account => account.id === practicalExamTargetUserId);
    if (selectedAzubi) {
      return {
        id: selectedAzubi.id,
        name: selectedAzubi.name || 'Unbekannt',
        role: selectedAzubi.role || 'azubi'
      };
    }
    return azubis.length > 0
      ? { id: azubis[0].id, name: azubis[0].name || 'Unbekannt', role: 'azubi' }
      : { id: user.id, name: user.name || 'Unbekannt', role: user.role || 'trainer' };
  };

  const loadPracticalExamHistory = async () => {
    if (!user?.id) return;
    setPracticalExamHistoryLoading(true);

    const localAttempts = loadLocalPracticalAttempts();
    const canManageAll = Boolean(user?.permissions?.canViewAllStats);

    try {
      let query = supabase
        .from('practical_exam_attempts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!canManageAll) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;
      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          const filteredLocal = canManageAll
            ? localAttempts
            : localAttempts.filter(entry => entry.user_id === user.id);
          setPracticalExamHistory(filteredLocal.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
          return;
        }
        throw error;
      }

      const remoteAttempts = (data || [])
        .map(normalizePracticalAttempt)
        .filter(Boolean);

      const mergedById = {};
      remoteAttempts.forEach((entry) => {
        mergedById[entry.id] = entry;
      });
      localAttempts.forEach((entry) => {
        if (!mergedById[entry.id]) {
          mergedById[entry.id] = entry;
        }
      });

      const merged = Object.values(mergedById).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const filtered = canManageAll ? merged : merged.filter(entry => entry.user_id === user.id);
      setPracticalExamHistory(filtered);
    } catch (error) {
      const fallback = canManageAll
        ? localAttempts
        : localAttempts.filter(entry => entry.user_id === user.id);
      setPracticalExamHistory(fallback.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } finally {
      setPracticalExamHistoryLoading(false);
    }
  };

  const savePracticalExamAttempt = async (resultPayload) => {
    const targetUser = getPracticalExamTargetUser();
    if (!targetUser?.id || !resultPayload) return;

    const normalizedResultRows = Array.isArray(resultPayload.rows)
      ? resultPayload.rows.map((row) => ({ ...row }))
      : [];

    const localAttempt = normalizePracticalAttempt({
      id: toPracticalAttemptId(),
      user_id: targetUser.id,
      user_name: targetUser.name,
      exam_type: resultPayload.type,
      average_grade: resultPayload.averageGrade,
      graded_count: resultPayload.gradedCount,
      passed: resultPayload.passed,
      result_rows: normalizedResultRows,
      created_at: toIsoDateTime(resultPayload.createdAt),
      created_by: user?.id || null,
      created_by_name: user?.name || null,
      source: 'local'
    });

    try {
      const insertPayload = {
        user_id: targetUser.id,
        user_name: targetUser.name,
        exam_type: resultPayload.type,
        average_grade: resultPayload.averageGrade,
        graded_count: resultPayload.gradedCount,
        passed: resultPayload.passed,
        result_rows: normalizedResultRows,
        created_by: user?.id || null,
        created_by_name: user?.name || null
      };

      const { data, error } = await supabase
        .from('practical_exam_attempts')
        .insert([insertPayload])
        .select()
        .single();

      if (error) throw error;

      const savedAttempt = normalizePracticalAttempt({ ...data, source: 'remote' });
      if (savedAttempt) {
        setPracticalExamHistory(prev => [savedAttempt, ...prev.filter(entry => entry.id !== savedAttempt.id)]);
      }
    } catch (error) {
      const existingLocal = loadLocalPracticalAttempts();
      const nextLocal = [localAttempt, ...existingLocal.filter(entry => entry.id !== localAttempt.id)];
      saveLocalPracticalAttempts(nextLocal);

      const canManageAll = Boolean(user?.permissions?.canViewAllStats);
      if (canManageAll || localAttempt.user_id === user?.id) {
        setPracticalExamHistory(prev => [localAttempt, ...prev.filter(entry => entry.id !== localAttempt.id)]);
      }
      if (!(error.code === '42P01' || error.message?.includes('does not exist'))) {
        showToast('Versuch lokal gespeichert (Cloud-Speicherung nicht verfügbar).', 'info');
      }
    }
  };

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const exportPracticalExamToPdf = (attemptInput = null) => {
    const targetUser = getPracticalExamTargetUser();
    const fallbackAttempt = practicalExamResult ? {
      id: 'current-preview',
      user_id: targetUser?.id || user?.id || '',
      user_name: targetUser?.name || user?.name || 'Unbekannt',
      exam_type: practicalExamResult.type,
      average_grade: practicalExamResult.averageGrade,
      graded_count: practicalExamResult.gradedCount,
      passed: practicalExamResult.passed,
      rows: practicalExamResult.rows || [],
      created_at: toIsoDateTime(practicalExamResult.createdAt),
      source: 'session'
    } : null;

    const attempt = attemptInput || fallbackAttempt;
    if (!attempt) {
      showToast('Kein Ergebnis zum Export vorhanden.', 'warning');
      return;
    }

    const attemptRows = Array.isArray(attempt.rows) ? attempt.rows : [];
    const examTypeLabel = PRACTICAL_EXAM_TYPES.find(type => type.id === attempt.exam_type)?.label || attempt.exam_type;
    const createdLabel = new Date(attempt.created_at).toLocaleString('de-DE');
    const averageGradeLabel = Number.isFinite(Number(attempt.average_grade))
      ? Number(attempt.average_grade).toFixed(2)
      : '-';
    const statusLabel = attempt.passed === null
      ? 'offen'
      : attempt.passed ? 'bestanden' : 'nicht bestanden';

    const rowsHtml = attemptRows.map((row) => {
      const gradeLabel = row?.grade ? formatGradeLabel(row.grade, row.noteLabel) : 'Keine Note';
      const pointsLabel = row?.points !== null && row?.points !== undefined ? `${row.points} Punkte` : '-';
      return `
        <tr>
          <td>${escapeHtml(row?.name || '-')}</td>
          <td>${escapeHtml(row?.displayValue || '-')}</td>
          <td>${escapeHtml(gradeLabel || '-')}</td>
          <td>${escapeHtml(pointsLabel)}</td>
        </tr>
      `;
    }).join('');

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Praktische Prüfung ${escapeHtml(examTypeLabel)} - ${escapeHtml(attempt.user_name)}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          @media print { .no-print { display: none !important; } }
          body { font-family: Arial, sans-serif; font-size: 12px; color: #111; margin: 0; padding: 0; }
          .wrap { max-width: 190mm; margin: 0 auto; }
          h1 { margin: 0 0 10px 0; font-size: 22px; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; margin-bottom: 14px; padding: 10px; border: 1px solid #bbb; background: #f8fafc; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #333; padding: 7px; vertical-align: top; }
          th { background: #efefef; text-align: left; }
          .summary { margin-top: 14px; padding: 10px; border: 1px solid #333; background: #f8fafc; }
          .print-button { margin-top: 18px; text-align: center; }
          .print-button button { padding: 10px 26px; font-size: 15px; background: #0ea5e9; color: white; border: none; border-radius: 8px; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Praktische Prüfung - ${escapeHtml(examTypeLabel)}</h1>
          <div class="meta">
            <div><strong>Azubi:</strong> ${escapeHtml(attempt.user_name || '-')}</div>
            <div><strong>Datum:</strong> ${escapeHtml(createdLabel)}</div>
            <div><strong>Gewertete Disziplinen:</strong> ${escapeHtml(attempt.graded_count ?? '-')}</div>
            <div><strong>Status:</strong> ${escapeHtml(statusLabel)}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Disziplin</th>
                <th>Eingabe / Wert</th>
                <th>Ergebnis</th>
                <th>Punkte</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || '<tr><td colspan="4">Keine Disziplinen vorhanden.</td></tr>'}
            </tbody>
          </table>

          <div class="summary">
            <strong>Durchschnittsnote:</strong> ${escapeHtml(averageGradeLabel)}
          </div>

          <div class="print-button no-print">
            <button onclick="window.print()">Drucken / Als PDF speichern</button>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Popup blockiert. Bitte Popup erlauben.', 'warning');
      return;
    }
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const resetPracticalExam = () => {
    setPracticalExamInputs({});
    setPracticalExamResult(null);
  };

  const updatePracticalExamInput = (disciplineId, value) => {
    setPracticalExamInputs(prev => ({ ...prev, [disciplineId]: value }));
    setPracticalExamResult(null);
  };

  const evaluatePracticalExam = () => {
    const disciplines = PRACTICAL_SWIM_EXAMS[practicalExamType] || [];
    if (disciplines.length === 0) {
      showToast('Keine Disziplinen für diese Prüfung gefunden.', 'warning');
      return;
    }
    const targetUser = getPracticalExamTargetUser();
    if (!targetUser?.id) {
      showToast('Bitte zuerst einen Azubi auswählen.', 'warning');
      return;
    }

    const missingRequiredInputs = [];
    const evaluatedRows = disciplines.map((discipline) => {
      const resolved = resolvePracticalDisciplineResult(discipline, practicalExamInputs);
      if (resolved.missingRequired) {
        missingRequiredInputs.push(discipline.name);
      }
      return {
        id: discipline.id,
        name: discipline.name,
        inputType: discipline.inputType,
        ...resolved
      };
    });

    if (missingRequiredInputs.length > 0) {
      showToast(`Bitte gültige Eingaben ergänzen: ${missingRequiredInputs.join(', ')}`, 'warning');
      return;
    }

    const numericGrades = evaluatedRows
      .map(row => toNumericGrade(row.grade))
      .filter(value => value !== null);

    const averageGrade = numericGrades.length > 0
      ? numericGrades.reduce((sum, value) => sum + value, 0) / numericGrades.length
      : null;

    const missingTables = evaluatedRows.filter(row => row.gradingMissing).length;
    const resultPayload = {
      type: practicalExamType,
      userId: targetUser.id,
      userName: targetUser.name,
      rows: evaluatedRows,
      averageGrade,
      gradedCount: numericGrades.length,
      passed: averageGrade !== null ? averageGrade <= 4 : null,
      missingTables,
      createdAt: Date.now()
    };
    setPracticalExamResult(resultPayload);
    void savePracticalExamAttempt(resultPayload);

    if (missingTables > 0) {
      showToast('Wertungstabellen fehlen noch teilweise. Bitte nachreichen.', 'info');
    } else {
      showToast('Praktische Prüfung ausgewertet.', 'success');
    }
  };

  // Toggle für Multi-Select im Prüfungssimulator
  const toggleExamAnswer = (answerIndex) => {
    if (examAnswered || !examSimulator) return;
    setExamSelectedAnswers(prev => {
      if (prev.includes(answerIndex)) {
        return prev.filter(i => i !== answerIndex);
      } else {
        return [...prev, answerIndex];
      }
    });
  };

  // Bestätigen der Multi-Select Antwort im Prüfungssimulator
  const confirmExamMultiSelectAnswer = () => {
    if (examAnswered || !examSimulator || !examCurrentQuestion.multi) return;
    setExamAnswered(true);

    const correctAnswers = examCurrentQuestion.correct;
    const isCorrect =
      examSelectedAnswers.length === correctAnswers.length &&
      examSelectedAnswers.every(idx => correctAnswers.includes(idx));

    if (isCorrect) { playSound('correct'); } else { playSound('wrong'); }

    // Daily Challenge Progress
    updateChallengeProgress('answer_questions', 1);
    if (isCorrect) {
      updateChallengeProgress('correct_answers', 1);
    }
    if (examCurrentQuestion.category) {
      updateChallengeProgress('category_master', 1, examCurrentQuestion.category);
    }

    const newAnswers = [...examSimulator.answers, {
      question: examCurrentQuestion,
      selectedAnswers: examSelectedAnswers,
      correct: isCorrect
    }];
    setExamSimulator({ ...examSimulator, answers: newAnswers });

    setTimeout(() => {
      proceedToNextExamQuestion(newAnswers);
    }, 2000);
  };

  const answerExamQuestion = (answerIndex) => {
    if (examAnswered || !examSimulator) return;

    // Multi-Select: Nur togglen, nicht direkt antworten
    if (examCurrentQuestion.multi) {
      toggleExamAnswer(answerIndex);
      return;
    }

    // Single-Choice: Direkt antworten
    setExamAnswered(true);
    setExamSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === examCurrentQuestion.correct;
    if (isCorrect) { playSound('correct'); } else { playSound('wrong'); }

    // Daily Challenge Progress
    updateChallengeProgress('answer_questions', 1);
    if (isCorrect) {
      updateChallengeProgress('correct_answers', 1);
    }
    if (examCurrentQuestion.category) {
      updateChallengeProgress('category_master', 1, examCurrentQuestion.category);
    }
    const newAnswers = [...examSimulator.answers, { question: examCurrentQuestion, selectedAnswer: answerIndex, correct: isCorrect }];
    setExamSimulator({ ...examSimulator, answers: newAnswers });
    setTimeout(() => {
      proceedToNextExamQuestion(newAnswers);
    }, 2000);
  };

  const proceedToNextExamQuestion = (newAnswers) => {
    if (examQuestionIndex < examSimulator.questions.length - 1) {
      const nextIdx = examQuestionIndex + 1;
      setExamQuestionIndex(nextIdx);
      setExamCurrentQuestion(examSimulator.questions[nextIdx]);
      setExamAnswered(false);
      setExamSelectedAnswers([]);
      setExamSelectedAnswer(null);
    } else {
      const correctAnswers = newAnswers.filter(a => a.correct).length;
      const percentage = Math.round((correctAnswers / newAnswers.length) * 100);
      setUserExamProgress({ correct: correctAnswers, total: newAnswers.length, percentage, passed: percentage >= 50, timeMs: Date.now() - examSimulator.startTime });
      if (percentage >= 50) playSound('whistle');

      const earnedXp =
        XP_REWARDS.EXAM_COMPLETION +
        (correctAnswers * XP_REWARDS.EXAM_CORRECT_ANSWER) +
        (percentage >= 50 ? XP_REWARDS.EXAM_PASS_BONUS : 0);
      void queueXpAward('examSimulator', earnedXp, {
        eventKey: `exam_run_${examSimulator.startTime}`,
        reason: 'Prüfungssimulator',
        showXpToast: true
      });
    }
  };

  const resetExam = () => {
    setExamSimulator(null);
    setExamCurrentQuestion(null);
    setExamQuestionIndex(0);
    setExamAnswered(false);
    setUserExamProgress(null);
    setExamSelectedAnswers([]);
    setExamSelectedAnswer(null);
  };

  // Kontrollkarte Berufsschule Funktionen
  const canViewAllSchoolCards = () => {
    return user?.role === 'admin' || user?.canViewSchoolCards;
  };

  const loadAzubisForSchoolCard = async () => {
    if (!canViewAllSchoolCards()) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('role', 'azubi')
        .eq('approved', true)
        .order('name');

      if (error) throw error;
      setAllAzubisForSchoolCard(data || []);
    } catch (err) {
      console.error('Fehler beim Laden der Azubis:', err);
    }
  };

  const loadSchoolAttendance = async (targetUserId = null) => {
    if (!user) return;
    try {
      // Bestimme welche User-ID geladen werden soll
      const userIdToLoad = targetUserId || selectedSchoolCardUser?.id || user.id;

      const { data, error } = await supabase
        .from('school_attendance')
        .select('*')
        .eq('user_id', userIdToLoad)
        .order('date', { ascending: false });

      if (error) throw error;
      setSchoolAttendance(data || []);
    } catch (err) {
      console.error('Fehler beim Laden der Kontrollkarte:', err);
    }
  };

  const addSchoolAttendance = async () => {
    if (!newAttendanceDate || !newAttendanceStart || !newAttendanceEnd) {
      alert('Bitte alle Felder ausfüllen');
      return;
    }

    try {
      const { error } = await supabase
        .from('school_attendance')
        .insert({
          user_id: user.id,
          user_name: user.name,
          date: newAttendanceDate,
          start_time: newAttendanceStart,
          end_time: newAttendanceEnd,
          teacher_signature: newAttendanceTeacherSig,
          trainer_signature: newAttendanceTrainerSig
        });

      if (error) throw error;

      // Benachrichtigung an berechtigte Trainer/Admins senden
      const { data: authorizedUsers } = await supabase
        .from('profiles')
        .select('id')
        .or('role.eq.admin,can_view_school_cards.eq.true');

      if (authorizedUsers) {
        for (const authUser of authorizedUsers) {
          if (authUser.id !== user.id) {
            await supabase.from('notifications').insert({
              user_id: authUser.id,
              type: 'school_card',
              title: '📝 Neuer Kontrollkarten-Eintrag',
              message: `${user.name} hat einen neuen Berufsschul-Eintrag vom ${new Date(newAttendanceDate).toLocaleDateString('de-DE')} hinzugefügt.`,
              data: { azubi_id: user.id, azubi_name: user.name, date: newAttendanceDate }
            });
          }
        }
      }

      // Reset form
      setNewAttendanceDate('');
      setNewAttendanceStart('');
      setNewAttendanceEnd('');
      setNewAttendanceTeacherSig('');
      setNewAttendanceTrainerSig('');

      showToast('Eintrag gespeichert!', 'success');

      // Reload data
      loadSchoolAttendance();
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      alert('Fehler beim Speichern');
    }
  };

  const updateAttendanceSignature = async (id, field, value) => {
    try {
      const { error } = await supabase
        .from('school_attendance')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;
      loadSchoolAttendance();
    } catch (err) {
      console.error('Fehler beim Aktualisieren:', err);
    }
  };

  const deleteSchoolAttendance = async (id) => {
    if (!confirm('Eintrag wirklich löschen?')) return;
    try {
      const { error } = await supabase
        .from('school_attendance')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadSchoolAttendance();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    }
  };

  // ==================== BERICHTSHEFT FUNKTIONEN ====================

  const loadBerichtsheftEntries = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('berichtsheft')
        .select('*')
        .eq('user_name', user.name)
        .order('week_start', { ascending: false });

      if (error) throw error;
      setBerichtsheftEntries(data || []);

      // Setze die Nachweis-Nr auf nächste freie Nummer
      if (data && data.length > 0) {
        const maxNr = Math.max(...data.map(e => e.nachweis_nr || 0));
        setBerichtsheftNr(maxNr + 1);
      }
    } catch (err) {
      console.error('Fehler beim Laden des Berichtshefts:', err);
    }
  };

  const getWeekEndDate = (startDate) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Sonntag
    return end.toISOString().split('T')[0];
  };

  // Azubi-Profil speichern (localStorage sofort + Supabase debounced)
  const saveAzubiProfile = (newProfile) => {
    setAzubiProfile(newProfile);
    localStorage.setItem('azubi_profile', JSON.stringify(newProfile));

    // Debounced Supabase-Speicherung (1 Sekunde nach letzter Änderung)
    if (azubiProfileSaveTimerRef.current) {
      clearTimeout(azubiProfileSaveTimerRef.current);
    }
    azubiProfileSaveTimerRef.current = setTimeout(async () => {
      if (user?.id) {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ berichtsheft_profile: newProfile })
            .eq('id', user.id);
          if (error) {
            console.warn('Berichtsheft-Profil Supabase-Sync Fehler:', error.message);
          }
        } catch (err) {
          console.warn('Berichtsheft-Profil Sync fehlgeschlagen:', err);
        }
      }
    }, 1000);
  };

  // ==================== SCHWIMMCHALLENGE FUNKTIONEN ====================

  // Aktive Challenges speichern (localStorage)
  const saveActiveSwimChallenges = (challenges) => {
    setActiveSwimChallenges(challenges);
    localStorage.setItem('active_swim_challenges', JSON.stringify(challenges));
  };

  const saveSwimBattleHistory = (entries) => {
    const safeEntries = Array.isArray(entries) ? entries.slice(0, 30) : [];
    setSwimBattleHistory(safeEntries);
    localStorage.setItem('swim_battle_history', JSON.stringify(safeEntries));
  };

  const saveSwimBattleWins = (winsByUserId) => {
    const safeWins = (winsByUserId && typeof winsByUserId === 'object') ? winsByUserId : {};
    setSwimBattleWinsByUserId(safeWins);
    localStorage.setItem('swim_battle_wins_by_user', JSON.stringify(safeWins));
  };

  const getSeaCreatureTier = (winsInput) => {
    const wins = toSafeInt(winsInput);
    for (let i = SEA_CREATURE_TIERS.length - 1; i >= 0; i--) {
      if (wins >= SEA_CREATURE_TIERS[i].minWins) {
        return SEA_CREATURE_TIERS[i];
      }
    }
    return SEA_CREATURE_TIERS[0];
  };

  const getUserNameById = (userId) => {
    if (!userId) return 'Unbekannt';
    if (user?.id === userId) return user.name || 'Du';
    const fromUsers = allUsers.find(u => u.id === userId);
    return fromUsers?.name || 'Unbekannt';
  };

  const parseSwimSeconds = (value) => {
    const raw = String(value ?? '').trim().replace(',', '.');
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    if (parsed <= 0) return null;
    return parsed;
  };

  const registerSwimArenaResult = ({
    mode,
    discipline,
    styleId,
    winnerIds = [],
    loserIds = [],
    participants = [],
    draw = false
  }) => {
    const styleName = SWIM_STYLES.find(s => s.id === styleId)?.name || styleId || 'Freistil';
    const timestamp = new Date().toISOString();

    let nextWinsByUserId = { ...swimBattleWinsByUserId };
    if (!draw) {
      winnerIds.forEach((winnerId) => {
        if (!winnerId) return;
        nextWinsByUserId[winnerId] = toSafeInt(nextWinsByUserId[winnerId]) + 1;
      });
      saveSwimBattleWins(nextWinsByUserId);
    }

    const entry = {
      id: `arena-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mode,
      discipline,
      styleId,
      styleName,
      draw: Boolean(draw),
      winnerIds,
      loserIds,
      participants,
      created_at: timestamp
    };
    saveSwimBattleHistory([entry, ...swimBattleHistory]);

    const winnerResults = winnerIds.map((winnerId) => {
      const wins = toSafeInt(nextWinsByUserId[winnerId]);
      const creature = getSeaCreatureTier(wins);
      return {
        userId: winnerId,
        name: getUserNameById(winnerId),
        wins,
        creature,
        battleCreature: creature
      };
    });

    const loserResults = loserIds.map((loserId) => {
      const wins = toSafeInt(nextWinsByUserId[loserId]);
      return {
        userId: loserId,
        name: getUserNameById(loserId),
        wins,
        creature: getSeaCreatureTier(wins),
        battleCreature: ARENA_LOSER_CREATURE
      };
    });

    setSwimBattleResult({
      id: entry.id,
      mode,
      discipline,
      styleName,
      draw: Boolean(draw),
      participants,
      winners: winnerResults,
      losers: loserResults
    });
  };

  const handleSwimDuelSubmit = (event) => {
    event.preventDefault();

    const challengerId = swimDuelForm.challengerId;
    const opponentId = swimDuelForm.opponentId;
    if (!challengerId || !opponentId) {
      showToast('Bitte zwei Teilnehmer auswählen.', 'warning');
      return;
    }
    if (challengerId === opponentId) {
      showToast('Ein Duell braucht zwei verschiedene Teilnehmer.', 'warning');
      return;
    }

    const challengerSeconds = parseSwimSeconds(swimDuelForm.challengerSeconds);
    const opponentSeconds = parseSwimSeconds(swimDuelForm.opponentSeconds);
    if (!challengerSeconds || !opponentSeconds) {
      showToast('Bitte gültige Zeiten in Sekunden eintragen.', 'warning');
      return;
    }

    const participants = [
      {
        userId: challengerId,
        name: getUserNameById(challengerId),
        seconds: challengerSeconds
      },
      {
        userId: opponentId,
        name: getUserNameById(opponentId),
        seconds: opponentSeconds
      }
    ];

    if (challengerSeconds === opponentSeconds) {
      registerSwimArenaResult({
        mode: 'duel',
        discipline: swimDuelForm.discipline,
        styleId: swimDuelForm.style,
        draw: true,
        participants
      });
      showToast('Unentschieden! Beide waren gleich schnell.', 'info');
      return;
    }

    const winnerId = challengerSeconds < opponentSeconds ? challengerId : opponentId;
    const loserId = winnerId === challengerId ? opponentId : challengerId;

    registerSwimArenaResult({
      mode: 'duel',
      discipline: swimDuelForm.discipline,
      styleId: swimDuelForm.style,
      winnerIds: [winnerId],
      loserIds: [loserId],
      participants
    });

    showToast(`Duell abgeschlossen: ${getUserNameById(winnerId)} gewinnt!`, 'success');
  };

  const handleSwimBossBattleSubmit = (event) => {
    event.preventDefault();

    const trainerId = swimBossForm.trainerId;
    if (!trainerId) {
      showToast('Bitte einen Ausbilder auswählen.', 'warning');
      return;
    }
    if (!Array.isArray(swimBossForm.azubiIds) || swimBossForm.azubiIds.length === 0) {
      showToast('Bitte mindestens einen Azubi auswählen.', 'warning');
      return;
    }

    const trainerSeconds = parseSwimSeconds(swimBossForm.trainerSeconds);
    const azubiSeconds = parseSwimSeconds(swimBossForm.azubiSeconds);
    if (!trainerSeconds || !azubiSeconds) {
      showToast('Bitte gültige Zeiten in Sekunden eintragen.', 'warning');
      return;
    }

    const participants = [
      {
        userId: trainerId,
        name: getUserNameById(trainerId),
        seconds: trainerSeconds
      },
      ...swimBossForm.azubiIds.map((azubiId) => ({
        userId: azubiId,
        name: getUserNameById(azubiId),
        seconds: azubiSeconds
      }))
    ];

    if (trainerSeconds === azubiSeconds) {
      registerSwimArenaResult({
        mode: 'boss',
        discipline: swimBossForm.discipline,
        styleId: swimBossForm.style,
        draw: true,
        participants
      });
      showToast('Boss-Battle unentschieden.', 'info');
      return;
    }

    const azubisWon = azubiSeconds < trainerSeconds;
    const winnerIds = azubisWon ? swimBossForm.azubiIds : [trainerId];
    const loserIds = azubisWon ? [trainerId] : swimBossForm.azubiIds;

    registerSwimArenaResult({
      mode: 'boss',
      discipline: swimBossForm.discipline,
      styleId: swimBossForm.style,
      winnerIds,
      loserIds,
      participants
    });

    showToast(
      azubisWon
        ? 'Boss-Battle: Azubis haben den Ausbilder geschlagen!'
        : 'Boss-Battle: Ausbilder verteidigt den Titel!',
      'success'
    );
  };

  // Trainingseinheiten aus Supabase laden
  const loadSwimSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('swim_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Tabelle existiert nicht - kein Fehler anzeigen, nur leere Liste
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('swim_sessions Tabelle existiert nicht in Supabase');
          setSwimSessions([]);
          return;
        }
        throw error;
      }

      console.log('Schwimm-Sessions geladen:', data?.length || 0);
      setSwimSessions(data || []);

      // Filtere unbestätigte Einheiten für Trainer
      if (user?.permissions?.canViewAllStats) {
        const pending = (data || []).filter(s => !s.confirmed);
        setPendingSwimConfirmations(pending);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Schwimm-Einheiten:', err);
      setSwimSessions([]);
    }
  };

  // Trainingseinheit speichern
  const saveSwimSession = async (sessionData) => {
    try {
      // Prüfe ob User eingeloggt ist und eine ID hat
      if (!user || !user.id) {
        console.error('Kein User oder User-ID vorhanden:', user);
        return { success: false, error: 'Bitte melde dich erneut an.' };
      }

      const newSession = {
        user_id: user.id,
        user_name: user.name,
        user_role: user.role,
        date: sessionData.date,
        distance: parseInt(sessionData.distance) || 0,
        time_minutes: parseInt(sessionData.time) || 0,
        style: sessionData.style,
        notes: sessionData.notes || '',
        challenge_id: sessionData.challengeId || null,
        confirmed: false,
        confirmed_by: null,
        confirmed_at: null
      };

      console.log('Speichere Schwimm-Session:', newSession);

      const { data, error } = await supabase
        .from('swim_sessions')
        .insert([newSession])
        .select();

      if (error) {
        console.error('Supabase Fehler:', error);
        // Prüfe ob Tabelle nicht existiert
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return { success: false, error: 'Die Tabelle swim_sessions existiert nicht in Supabase. Bitte erstellen!' };
        }
        throw error;
      }

      console.log('Session gespeichert:', data);

      // Aktualisiere lokale Liste
      setSwimSessions(prev => [data[0], ...prev]);
      setPendingSwimConfirmations(prev => [data[0], ...prev]);

      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Fehler beim Speichern der Schwimm-Einheit:', err);
      return { success: false, error: err.message || 'Unbekannter Fehler' };
    }
  };

  // Trainingseinheit bestätigen (Trainer)
  const confirmSwimSession = async (sessionId) => {
    try {
      const { error } = await supabase
        .from('swim_sessions')
        .update({
          confirmed: true,
          confirmed_by: user.name,
          confirmed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Aktualisiere lokale Listen
      setSwimSessions(prev => prev.map(s =>
        s.id === sessionId ? { ...s, confirmed: true, confirmed_by: user.name } : s
      ));
      setPendingSwimConfirmations(prev => prev.filter(s => s.id !== sessionId));

      return { success: true };
    } catch (err) {
      console.error('Fehler beim Bestätigen:', err);
      return { success: false, error: err.message };
    }
  };

  // Trainingseinheit ablehnen (Trainer)
  const rejectSwimSession = async (sessionId) => {
    try {
      const { error } = await supabase
        .from('swim_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSwimSessions(prev => prev.filter(s => s.id !== sessionId));
      setPendingSwimConfirmations(prev => prev.filter(s => s.id !== sessionId));

      return { success: true };
    } catch (err) {
      console.error('Fehler beim Ablehnen:', err);
      return { success: false, error: err.message };
    }
  };

  // Lade Schwimmdaten beim Start
  useEffect(() => {
    if (user) {
      loadSwimSessions();
    }
  }, [user]);

  // Prüfe Schwimm-Badges wenn sich Sessions ändern
  useEffect(() => {
    if (user && swimSessions.length > 0) {
      checkBadges();
    }
  }, [swimSessions]);

  useEffect(() => {
    const trainerCandidates = allUsers.filter(u =>
      u?.role === 'trainer'
      || u?.role === 'ausbilder'
      || u?.role === 'admin'
      || Boolean(u?.permissions?.canViewAllStats)
    );
    const azubiCandidates = allUsers.filter(u => u?.role === 'azubi');

    setSwimDuelForm((prev) => {
      const knownUserIds = new Set(allUsers.map(u => u.id));
      let challengerId = prev.challengerId;
      if (!challengerId || !knownUserIds.has(challengerId)) {
        if (user?.id && knownUserIds.has(user.id)) {
          challengerId = user.id;
        } else {
          challengerId = azubiCandidates[0]?.id || trainerCandidates[0]?.id || '';
        }
      }

      let opponentId = prev.opponentId;
      if (!opponentId || !knownUserIds.has(opponentId) || opponentId === challengerId) {
        opponentId = allUsers.find(u => u.id && u.id !== challengerId)?.id || '';
      }

      return {
        ...prev,
        challengerId,
        opponentId
      };
    });

    setSwimBossForm((prev) => {
      let trainerId = prev.trainerId;
      if (!trainerId || !trainerCandidates.some(t => t.id === trainerId)) {
        if (user?.id && trainerCandidates.some(t => t.id === user.id)) {
          trainerId = user.id;
        } else {
          trainerId = trainerCandidates[0]?.id || '';
        }
      }

      let azubiIds = Array.isArray(prev.azubiIds)
        ? prev.azubiIds.filter(id => azubiCandidates.some(a => a.id === id) && id !== trainerId)
        : [];
      if (azubiIds.length === 0) {
        azubiIds = azubiCandidates
          .map(a => a.id)
          .filter(id => id !== trainerId)
          .slice(0, 3);
      }

      return {
        ...prev,
        trainerId,
        azubiIds
      };
    });
  }, [allUsers, user?.id]);

  const resetBerichtsheftForm = () => {
    setCurrentWeekEntries({
      Mo: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Di: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Mi: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Do: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Fr: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Sa: [{ taetigkeit: '', stunden: '', bereich: '' }],
      So: [{ taetigkeit: '', stunden: '', bereich: '' }]
    });
    setBerichtsheftBemerkungAzubi('');
    setBerichtsheftBemerkungAusbilder('');
    setBerichtsheftSignaturAzubi('');
    setBerichtsheftSignaturAusbilder('');
    setBerichtsheftDatumAzubi('');
    setBerichtsheftDatumAusbilder('');
    setSelectedBerichtsheft(null);
  };

  const addWeekEntry = (day) => {
    setCurrentWeekEntries(prev => ({
      ...prev,
      [day]: [...prev[day], { taetigkeit: '', stunden: '', bereich: '' }]
    }));
  };

  const updateWeekEntry = (day, index, field, value) => {
    setCurrentWeekEntries(prev => ({
      ...prev,
      [day]: prev[day].map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const removeWeekEntry = (day, index) => {
    if (currentWeekEntries[day].length <= 1) return; // Mindestens eine Zeile
    setCurrentWeekEntries(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const calculateDayHours = (day) => {
    return currentWeekEntries[day].reduce((sum, entry) => {
      const hours = parseFloat(entry.stunden) || 0;
      return sum + hours;
    }, 0);
  };

  const calculateTotalHours = () => {
    return Object.keys(currentWeekEntries).reduce((sum, day) => {
      return sum + calculateDayHours(day);
    }, 0);
  };

  const saveBerichtsheft = async () => {
    // Validierung
    const hasContent = Object.values(currentWeekEntries).some(day =>
      day.some(entry => entry.taetigkeit.trim() !== '')
    );

    if (!hasContent) {
      alert('Bitte mindestens eine Tätigkeit eintragen');
      return;
    }

    try {
      const berichtsheftData = {
        user_name: user.name,
        week_start: berichtsheftWeek,
        week_end: getWeekEndDate(berichtsheftWeek),
        ausbildungsjahr: berichtsheftYear,
        nachweis_nr: berichtsheftNr,
        entries: currentWeekEntries,
        bemerkung_azubi: berichtsheftBemerkungAzubi,
        bemerkung_ausbilder: berichtsheftBemerkungAusbilder,
        signatur_azubi: berichtsheftSignaturAzubi,
        signatur_ausbilder: berichtsheftSignaturAusbilder,
        datum_azubi: berichtsheftDatumAzubi || null,
        datum_ausbilder: berichtsheftDatumAusbilder || null,
        total_hours: calculateTotalHours()
      };

      if (selectedBerichtsheft) {
        // Update
        const { error } = await supabase
          .from('berichtsheft')
          .update(berichtsheftData)
          .eq('id', selectedBerichtsheft.id);

        if (error) throw error;
        showToast('Berichtsheft aktualisiert!', 'success');
      } else {
        // Insert
        const { error } = await supabase
          .from('berichtsheft')
          .insert(berichtsheftData);

        if (error) throw error;
        showToast('Berichtsheft gespeichert!', 'success');
        setBerichtsheftNr(prev => prev + 1);
      }

      resetBerichtsheftForm();
      loadBerichtsheftEntries();
      setBerichtsheftViewMode('list');
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      showToast('Fehler beim Speichern des Berichtshefts', 'error');
    }
  };

  const loadBerichtsheftForEdit = (entry) => {
    setSelectedBerichtsheft(entry);
    setBerichtsheftWeek(entry.week_start);
    setBerichtsheftYear(entry.ausbildungsjahr);
    setBerichtsheftNr(entry.nachweis_nr);
    setCurrentWeekEntries(entry.entries || {
      Mo: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Di: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Mi: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Do: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Fr: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Sa: [{ taetigkeit: '', stunden: '', bereich: '' }],
      So: [{ taetigkeit: '', stunden: '', bereich: '' }]
    });
    setBerichtsheftBemerkungAzubi(entry.bemerkung_azubi || '');
    setBerichtsheftBemerkungAusbilder(entry.bemerkung_ausbilder || '');
    setBerichtsheftSignaturAzubi(entry.signatur_azubi || '');
    setBerichtsheftSignaturAusbilder(entry.signatur_ausbilder || '');
    setBerichtsheftDatumAzubi(entry.datum_azubi || '');
    setBerichtsheftDatumAusbilder(entry.datum_ausbilder || '');
    setBerichtsheftViewMode('edit');
  };

  const deleteBerichtsheft = async (id) => {
    if (!confirm('Berichtsheft wirklich löschen?')) return;
    try {
      const { error } = await supabase
        .from('berichtsheft')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadBerichtsheftEntries();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    }
  };

  const calculateBereichProgress = () => {
    // Berechnet wie viele Stunden pro Ausbildungsbereich bereits erfasst wurden
    const progress = {};
    AUSBILDUNGSRAHMENPLAN.forEach(bereich => {
      progress[bereich.nr] = {
        name: bereich.bereich,
        icon: bereich.icon,
        color: bereich.color,
        sollWochen: bereich.gesamtWochen,
        istStunden: 0
      };
    });

    berichtsheftEntries.forEach(entry => {
      if (entry.entries) {
        Object.values(entry.entries).forEach(day => {
          day.forEach(item => {
            if (item.bereich && item.stunden) {
              const bereichNr = parseInt(item.bereich);
              if (progress[bereichNr]) {
                progress[bereichNr].istStunden += parseFloat(item.stunden) || 0;
              }
            }
          });
        });
      }
    });

    return progress;
  };

  const generateBerichtsheftPDF = (entry) => {
    // Erstellt eine druckbare HTML-Version im A4-Format
    const weekStart = new Date(entry.week_start);
    const weekEnd = new Date(entry.week_end);

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long' });
    };

    const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

    let tableRows = '';
    let runningTotal = 0;

    days.forEach(day => {
      const dayEntries = entry.entries?.[day] || [];
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + days.indexOf(day));

      let dayHours = 0;
      let dayContent = '';

      dayEntries.forEach(e => {
        if (e.taetigkeit) {
          const bereich = AUSBILDUNGSRAHMENPLAN.find(b => b.nr === parseInt(e.bereich));
          dayContent += `<div style="margin-bottom: 3px;">${e.taetigkeit}${bereich ? ` <small style="color: #555;">(${bereich.bereich})</small>` : ''}</div>`;
          dayHours += parseFloat(e.stunden) || 0;
        }
      });

      runningTotal += dayHours;

      tableRows += `
        <tr>
          <td style="font-weight: bold; width: 35px; text-align: center;">${day}</td>
          <td style="min-height: 40px;">${dayContent || '-'}</td>
          <td style="text-align: center; width: 65px;">${dayHours > 0 ? dayHours : '-'}</td>
          <td style="text-align: center; width: 65px;">${dayHours > 0 ? runningTotal : ''}</td>
          <td style="width: 120px;"></td>
        </tr>
      `;
    });

    const profileName = azubiProfile.vorname && azubiProfile.nachname
      ? `${azubiProfile.vorname} ${azubiProfile.nachname}`
      : (user?.name || '');

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ausbildungsnachweis Nr. ${entry.nachweis_nr}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #000;
            max-width: 210mm;
            margin: 0 auto;
            padding: 15mm;
          }
          h1 {
            text-align: center;
            font-size: 16px;
            margin: 0 0 12px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #333;
          }
          .header-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3px 20px;
            margin-bottom: 12px;
            padding: 8px 10px;
            border: 1px solid #999;
            background: #fafafa;
            font-size: 11px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
          }
          th {
            background: #e8e8e8;
            border: 1px solid #333;
            padding: 5px;
            text-align: left;
            font-size: 10px;
          }
          td {
            border: 1px solid #333;
            padding: 5px;
            font-size: 11px;
            vertical-align: top;
          }
        </style>
      </head>
      <body>
        <h1>Ausbildungsnachweis</h1>

        <div class="header-grid">
          <div><strong>Name:</strong> ${profileName}</div>
          <div><strong>Nachweis Nr.:</strong> ${entry.nachweis_nr}</div>
          <div><strong>Ausbildungsbetrieb:</strong> ${azubiProfile.ausbildungsbetrieb || ''}</div>
          <div><strong>Ausbildungsberuf:</strong> ${azubiProfile.ausbildungsberuf || 'Fachangestellte/r für Bäderbetriebe'}</div>
          <div><strong>Ausbilder/in:</strong> ${azubiProfile.ausbilder || ''}</div>
          <div><strong>Ausbildungsbeginn:</strong> ${azubiProfile.ausbildungsbeginn ? new Date(azubiProfile.ausbildungsbeginn).toLocaleDateString('de-DE') : ''}</div>
          <div><strong>Woche vom:</strong> ${formatDate(entry.week_start)} bis ${formatDate(entry.week_end)} ${weekEnd.getFullYear()}</div>
          <div><strong>Ausbildungsjahr:</strong> ${entry.ausbildungsjahr}. Ausbildungsjahr</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Ausgeführte Arbeiten, Unterricht usw.</th>
              <th>Einzel-std.</th>
              <th>Gesamt-std.</th>
              <th>Abteilung</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            <tr>
              <td colspan="2" style="text-align: right; font-weight: bold;">Wochenstunden gesamt:</td>
              <td style="text-align: center; font-weight: bold;">${entry.total_hours || 0}</td>
              <td style="text-align: center; font-weight: bold;">${runningTotal}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div style="margin-bottom: 15px;">
          <strong>Besondere Bemerkungen</strong>
          <div style="display: flex; gap: 15px; margin-top: 8px;">
            <div style="flex: 1; border: 1px solid #333; padding: 8px; min-height: 50px;">
              <small style="color: #555;">Auszubildende/r:</small><br>
              ${entry.bemerkung_azubi || ''}
            </div>
            <div style="flex: 1; border: 1px solid #333; padding: 8px; min-height: 50px;">
              <small style="color: #555;">Ausbilder/in:</small><br>
              ${entry.bemerkung_ausbilder || ''}
            </div>
          </div>
        </div>

        <div style="margin-top: 20px;">
          <strong>Für die Richtigkeit</strong>
          <div style="display: flex; gap: 40px; margin-top: 10px;">
            <div style="flex: 1;">
              <div style="margin-bottom: 5px;">Datum: ${entry.datum_azubi || '________________'}</div>
              <div style="border-top: 1px solid #333; padding-top: 5px; margin-top: 30px;">
                Unterschrift Auszubildende/r
              </div>
            </div>
            <div style="flex: 1;">
              <div style="margin-bottom: 5px;">Datum: ${entry.datum_ausbilder || '________________'}</div>
              <div style="border-top: 1px solid #333; padding-top: 5px; margin-top: 30px;">
                Unterschrift Ausbilder/in
              </div>
            </div>
          </div>
        </div>

        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 30px; font-size: 16px; cursor: pointer; background: #0ea5e9; color: white; border: none; border-radius: 8px;">
            Drucken / Als PDF speichern
          </button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // ==================== ENDE BERICHTSHEFT FUNKTIONEN ====================

  const loadFlashcards = () => {
    const hardcodedCards = FLASHCARD_CONTENT[newQuestionCategory] || [];
    const userCards = userFlashcards.filter(fc => fc.category === newQuestionCategory);
    const allCards = [...hardcodedCards, ...userCards];
    setFlashcards(allCards); setFlashcardIndex(0); setCurrentFlashcard(allCards[0] || null); setShowFlashcardAnswer(false);
  };

  // ==================== SPACED REPETITION SYSTEM ====================

  // Intervalle in Tagen basierend auf Level (SM-2 ähnlich)
  const SPACED_INTERVALS = {
    1: 1,    // Level 1: 1 Tag
    2: 3,    // Level 2: 3 Tage
    3: 7,    // Level 3: 1 Woche
    4: 14,   // Level 4: 2 Wochen
    5: 30,   // Level 5: 1 Monat
    6: 60    // Level 6: 2 Monate (gemeistert)
  };

  const getCardKey = (card, category) => {
    return `${category}_${card.front.substring(0, 30)}`;
  };

  const getCardSpacedData = (card, category) => {
    const key = getCardKey(card, category);
    return spacedRepetitionData[key] || { level: 1, nextReview: Date.now(), reviewCount: 0 };
  };

  const updateCardSpacedData = (card, category, correct) => {
    const key = getCardKey(card, category);
    const current = getCardSpacedData(card, category);

    let newLevel;
    if (correct) {
      newLevel = Math.min(current.level + 1, 6);
    } else {
      newLevel = Math.max(current.level - 1, 1);
    }

    const intervalDays = SPACED_INTERVALS[newLevel];
    const nextReview = Date.now() + (intervalDays * 24 * 60 * 60 * 1000);

    const newData = {
      ...spacedRepetitionData,
      [key]: {
        level: newLevel,
        nextReview: nextReview,
        reviewCount: current.reviewCount + 1,
        lastReview: Date.now()
      }
    };

    setSpacedRepetitionData(newData);
    localStorage.setItem('spaced_repetition_data', JSON.stringify(newData));

    // Update daily challenge progress
    updateChallengeProgress('flashcards_reviewed', 1);
    if (correct) {
      updateChallengeProgress('correct_answers', 1);
    }
    void queueXpAward('flashcardLearning', XP_REWARDS.FLASHCARD_REVIEW, { showXpToast: false });

    return newLevel;
  };

  const loadDueCards = (category) => {
    const hardcodedCards = FLASHCARD_CONTENT[category] || [];
    const userCards = userFlashcards.filter(fc => fc.category === category);
    const allCards = [...hardcodedCards, ...userCards];

    const now = Date.now();
    const due = allCards
      .map(card => ({
        ...card,
        spacedData: getCardSpacedData(card, category)
      }))
      .filter(card => card.spacedData.nextReview <= now)
      .sort((a, b) => a.spacedData.level - b.spacedData.level); // Niedrigste Level zuerst

    setDueCards(due);
    return due;
  };

  const getDueCardCount = (category) => {
    const hardcodedCards = FLASHCARD_CONTENT[category] || [];
    const userCards = userFlashcards.filter(fc => fc.category === category);
    const allCards = [...hardcodedCards, ...userCards];

    const now = Date.now();
    return allCards.filter(card => getCardSpacedData(card, category).nextReview <= now).length;
  };

  const getTotalDueCards = () => {
    return CATEGORIES.reduce((sum, cat) => sum + getDueCardCount(cat.id), 0);
  };

  const getLevelColor = (level) => {
    const colors = {
      1: 'bg-red-500',
      2: 'bg-orange-500',
      3: 'bg-yellow-500',
      4: 'bg-lime-500',
      5: 'bg-green-500',
      6: 'bg-emerald-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  const getLevelLabel = (level) => {
    const labels = {
      1: 'Neu',
      2: 'Lernend',
      3: 'Bekannt',
      4: 'Gefestigt',
      5: 'Sicher',
      6: 'Gemeistert'
    };
    return labels[level] || 'Unbekannt';
  };

  // ==================== DAILY CHALLENGES SYSTEM ====================

  const CHALLENGE_TYPES = [
    { id: 'answer_questions', name: 'Fragen beantworten', icon: '❓', unit: 'Fragen', baseTarget: 10 },
    { id: 'correct_answers', name: 'Richtige Antworten', icon: '✅', unit: 'richtige', baseTarget: 7 },
    { id: 'flashcards_reviewed', name: 'Lernkarten wiederholen', icon: '🎴', unit: 'Karten', baseTarget: 15 },
    { id: 'category_master', name: 'Kategorie üben', icon: '📚', unit: 'Fragen aus', baseTarget: 5, hasCategory: true },
    { id: 'quiz_play', name: 'Quiz spielen', icon: '🎮', unit: 'Runde', baseTarget: 1 },
    { id: 'streak_keep', name: 'Lernstreak halten', icon: '🔥', unit: 'Tag', baseTarget: 1 }
  ];

  const generateDailyChallenges = () => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // Pseudo-random basierend auf Datum (gleiche Challenges für alle Nutzer am selben Tag)
    const seededRandom = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };

    // Wähle 3 Challenges für heute
    const shuffled = [...CHALLENGE_TYPES].sort((a, b) => seededRandom(CHALLENGE_TYPES.indexOf(a)) - seededRandom(CHALLENGE_TYPES.indexOf(b)));
    const selectedChallenges = shuffled.slice(0, 3);

    return selectedChallenges.map((challenge, idx) => {
      const difficulty = 1 + seededRandom(idx + 100) * 0.5; // 1.0 - 1.5x
      const target = Math.round(challenge.baseTarget * difficulty);

      let category = null;
      if (challenge.hasCategory) {
        const catIndex = Math.floor(seededRandom(idx + 200) * CATEGORIES.length);
        category = CATEGORIES[catIndex];
      }

      return {
        ...challenge,
        target,
        category,
        xpReward: target * 10
      };
    });
  };

  const updateChallengeProgress = (challengeType, amount = 1, categoryId = null) => {
    setDailyChallengeProgress(prev => {
      const today = new Date().toDateString();

      // Reset if it's a new day
      if (prev.date !== today) {
        const newProgress = {
          date: today,
          completed: [],
          stats: { [challengeType]: amount }
        };
        if (categoryId) {
          newProgress.stats[`category_${categoryId}`] = amount;
        }
        localStorage.setItem('daily_challenge_progress', JSON.stringify(newProgress));
        return newProgress;
      }

      const newStats = { ...prev.stats };
      newStats[challengeType] = (newStats[challengeType] || 0) + amount;
      if (categoryId) {
        newStats[`category_${categoryId}`] = (newStats[`category_${categoryId}`] || 0) + amount;
      }

      const newProgress = { ...prev, stats: newStats };
      localStorage.setItem('daily_challenge_progress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const getChallengeProgress = (challenge) => {
    const stats = dailyChallengeProgress.stats || {};

    if (challenge.hasCategory && challenge.category) {
      return stats[`category_${challenge.category.id}`] || 0;
    }

    return stats[challenge.id] || 0;
  };

  const isChallengeCompleted = (challenge) => {
    return getChallengeProgress(challenge) >= challenge.target;
  };

  const getCompletedChallengesCount = () => {
    return dailyChallenges.filter(c => isChallengeCompleted(c)).length;
  };

  const getTotalXPEarned = () => {
    return dailyChallenges
      .filter(c => isChallengeCompleted(c))
      .reduce((sum, c) => sum + c.xpReward, 0);
  };

  // Initialize daily challenges
  useEffect(() => {
    const challenges = generateDailyChallenges();
    setDailyChallenges(challenges);
  }, []);

  const approveFlashcard = async (fcId) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .update({ approved: true })
        .eq('id', fcId);

      if (error) throw error;

      const fc = pendingFlashcards.find(f => f.id === fcId);
      if (fc) {
        fc.approved = true;
        setPendingFlashcards(pendingFlashcards.filter(f => f.id !== fcId));
        setUserFlashcards([...userFlashcards, fc]);
      }
      playSound('correct');
    } catch (error) {
      console.error('Approve flashcard error:', error);
    }
  };

  const deleteFlashcard = async (fcId) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', fcId);

      if (error) throw error;

      setPendingFlashcards(pendingFlashcards.filter(f => f.id !== fcId));
      setUserFlashcards(userFlashcards.filter(f => f.id !== fcId));
    } catch (error) {
      console.error('Delete flashcard error:', error);
    }
  };

  const checkBadges = async () => {
    if (!user || !userStats) return;
    const earnedBadges = [...userBadges];
    const newBadges = [];

    // === QUIZ-BADGES ===
    if (userStats.wins >= 10 && !earnedBadges.find(b => b.id === 'quiz_winner_10')) {
      const badge = { id: 'quiz_winner_10', earnedAt: Date.now() };
      earnedBadges.push(badge);
      newBadges.push(badge);
    }
    const totalCorrect = Object.values(userStats.categoryStats || {}).reduce((sum, cat) => sum + (cat.correct || 0), 0);
    if (totalCorrect >= 50 && !earnedBadges.find(b => b.id === 'questions_50')) {
      const badge = { id: 'questions_50', earnedAt: Date.now() };
      earnedBadges.push(badge);
      newBadges.push(badge);
    }
    if (totalCorrect >= 100 && !earnedBadges.find(b => b.id === 'questions_100')) {
      const badge = { id: 'questions_100', earnedAt: Date.now() };
      earnedBadges.push(badge);
      newBadges.push(badge);
    }
    const hour = new Date().getHours();
    if (hour < 7 && !earnedBadges.find(b => b.id === 'early_bird')) {
      const badge = { id: 'early_bird', earnedAt: Date.now() };
      earnedBadges.push(badge);
      newBadges.push(badge);
    }
    if (hour >= 22 && !earnedBadges.find(b => b.id === 'night_owl')) {
      const badge = { id: 'night_owl', earnedAt: Date.now() };
      earnedBadges.push(badge);
      newBadges.push(badge);
    }

    // Win Streak Badges - basierend auf bestWinStreak (höchste erreichte Serie)
    const bestStreak = userStats.bestWinStreak || 0;
    const winStreakMilestones = [
      { id: 'win_streak_3', value: 3 },
      { id: 'win_streak_5', value: 5 },
      { id: 'win_streak_10', value: 10 },
      { id: 'win_streak_15', value: 15 },
      { id: 'win_streak_25', value: 25 },
      { id: 'win_streak_50', value: 50 }
    ];

    for (const milestone of winStreakMilestones) {
      if (bestStreak >= milestone.value && !earnedBadges.find(b => b.id === milestone.id)) {
        const badge = { id: milestone.id, earnedAt: Date.now() };
        earnedBadges.push(badge);
        newBadges.push(badge);
      }
    }

    // === SCHWIMM-BADGES ===
    const mySwimSessions = swimSessions.filter(s => s.user_id === user.id && s.confirmed);
    const totalDistance = mySwimSessions.reduce((sum, s) => sum + (s.distance || 0), 0);
    const totalTime = mySwimSessions.reduce((sum, s) => sum + (s.time_minutes || 0), 0);
    const sessionCount = mySwimSessions.length;

    // Distanz-Badges
    const distanceMilestones = [
      { id: 'swim_first_km', value: 1000 },
      { id: 'swim_five_km', value: 5000 },
      { id: 'swim_ten_km', value: 10000 },
      { id: 'swim_marathon', value: 42195 }
    ];
    for (const milestone of distanceMilestones) {
      if (totalDistance >= milestone.value && !earnedBadges.find(b => b.id === milestone.id)) {
        const badge = { id: milestone.id, earnedAt: Date.now() };
        earnedBadges.push(badge);
        newBadges.push(badge);
      }
    }

    // Session-Badges
    const sessionMilestones = [
      { id: 'swim_first_session', value: 1 },
      { id: 'swim_10_sessions', value: 10 },
      { id: 'swim_25_sessions', value: 25 },
      { id: 'swim_50_sessions', value: 50 }
    ];
    for (const milestone of sessionMilestones) {
      if (sessionCount >= milestone.value && !earnedBadges.find(b => b.id === milestone.id)) {
        const badge = { id: milestone.id, earnedAt: Date.now() };
        earnedBadges.push(badge);
        newBadges.push(badge);
      }
    }

    // Zeit-Badges (in Minuten)
    const timeMilestones = [
      { id: 'swim_1h_training', value: 60 },
      { id: 'swim_10h_training', value: 600 }
    ];
    for (const milestone of timeMilestones) {
      if (totalTime >= milestone.value && !earnedBadges.find(b => b.id === milestone.id)) {
        const badge = { id: milestone.id, earnedAt: Date.now() };
        earnedBadges.push(badge);
        newBadges.push(badge);
      }
    }

    // Challenge-Badges
    const completedChallenges = SWIM_CHALLENGES.filter(ch => {
      const progress = calculateChallengeProgress(ch, swimSessions, user.id);
      return progress.percent >= 100;
    });
    const challengeMilestones = [
      { id: 'swim_challenge_first', value: 1 },
      { id: 'swim_challenge_5', value: 5 },
      { id: 'swim_challenge_master', value: 10 }
    ];
    for (const milestone of challengeMilestones) {
      if (completedChallenges.length >= milestone.value && !earnedBadges.find(b => b.id === milestone.id)) {
        const badge = { id: milestone.id, earnedAt: Date.now() };
        earnedBadges.push(badge);
        newBadges.push(badge);
      }
    }

    // Team-Battle Badge (mindestens 1 Session = Teilnahme)
    if (sessionCount >= 1 && !earnedBadges.find(b => b.id === 'swim_team_battle')) {
      const badge = { id: 'swim_team_battle', earnedAt: Date.now() };
      earnedBadges.push(badge);
      newBadges.push(badge);
    }

    if (newBadges.length > 0) {
      setUserBadges(earnedBadges);
      try {
        for (const badge of newBadges) {
          await supabase
            .from('user_badges')
            .insert([{
              user_id: user.id,
              user_name: user.name,
              badge_id: badge.id
            }]);
        }
      } catch (error) {
        console.error('Save badges error:', error);
      }
    }
  };


  const addMaterial = async () => {
    if (!materialTitle.trim() || !user?.permissions.canUploadMaterials) return;

    try {
      const { data, error } = await supabase
        .from('materials')
        .insert([{
          title: materialTitle,
          category: materialCategory,
          created_by: user.name
        }])
        .select()
        .single();

      if (error) throw error;

      const mat = {
        id: data.id,
        title: data.title,
        category: data.category,
        createdBy: data.created_by,
        time: new Date(data.created_at).getTime()
      };

      setMaterials([...materials, mat]);
      setMaterialTitle('');
      showToast('Material hinzugefügt!', 'success');
    } catch (error) {
      console.error('Material error:', error);
      showToast('Fehler beim Hinzufügen', 'error');
    }
  };

  // Save App Config (Admin UI Editor)
  const saveAppConfig = async () => {
    if (user.role !== 'admin') {
      showToast('Nur Administratoren können die Konfiguration ändern', 'warning');
      return;
    }

    try {
      const { error } = await supabase
        .from('app_config')
        .upsert({
          id: 'main',
          menu_items: editingMenuItems,
          theme_colors: editingThemeColors,
          updated_at: new Date().toISOString(),
          updated_by: user.name
        });

      if (error) throw error;

      setAppConfig({
        menuItems: editingMenuItems,
        themeColors: editingThemeColors
      });

      showToast('Konfiguration gespeichert! Alle Nutzer sehen jetzt die Änderungen.', 'success');
      playSound('splash');
    } catch (error) {
      console.error('Config save error:', error);
      showToast('Fehler beim Speichern der Konfiguration', 'error');
    }
  };

  // Reset App Config to defaults
  const resetAppConfig = () => {
    setEditingMenuItems([...DEFAULT_MENU_ITEMS]);
    setEditingThemeColors({...DEFAULT_THEME_COLORS});
    showToast('Zurückgesetzt auf Standardwerte. Klicke Speichern um zu übernehmen.', 'info');
  };

  // Move menu item up/down
  const moveMenuItem = (itemId, direction) => {
    // Sort items by order first
    const sortedItems = [...editingMenuItems].sort((a, b) => a.order - b.order);
    const currentIndex = sortedItems.findIndex(item => item.id === itemId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sortedItems.length) return;

    // Swap the two items in the sorted array
    [sortedItems[currentIndex], sortedItems[newIndex]] = [sortedItems[newIndex], sortedItems[currentIndex]];

    // Reassign order values based on new positions
    const reorderedItems = sortedItems.map((item, idx) => ({
      ...item,
      order: idx
    }));

    setEditingMenuItems(reorderedItems);
  };

  // Toggle menu item visibility
  const toggleMenuItemVisibility = (itemId) => {
    const newItems = editingMenuItems.map(item =>
      item.id === itemId ? { ...item, visible: !item.visible } : item
    );
    setEditingMenuItems(newItems);
  };

  // Update menu item label
  const updateMenuItemLabel = (itemId, newLabel) => {
    const newItems = editingMenuItems.map(item =>
      item.id === itemId ? { ...item, label: newLabel } : item
    );
    setEditingMenuItems(newItems);
  };

  // Update menu item icon
  const updateMenuItemIcon = (itemId, newIcon) => {
    const newItems = editingMenuItems.map(item =>
      item.id === itemId ? { ...item, icon: newIcon } : item
    );
    setEditingMenuItems(newItems);
  };

  // Update theme color
  const updateThemeColor = (colorKey, newColor) => {
    setEditingThemeColors(prev => ({ ...prev, [colorKey]: newColor }));
  };

  const addResource = async () => {
    if (!resourceTitle.trim() || !resourceUrl.trim()) return;

    // Only admins can add resources
    if (user.role !== 'admin') {
      showToast('Nur Administratoren können Ressourcen hinzufügen', 'warning');
      return;
    }

    // Content moderation
    if (!moderateContent(resourceTitle, 'Titel')) {
      return;
    }
    
    if (resourceDescription && !moderateContent(resourceDescription, 'Beschreibung')) {
      return;
    }
    
    if (!moderateContent(resourceUrl, 'URL')) {
      return;
    }

    // URL validation
    try {
      new URL(resourceUrl);
    } catch (e) {
      showToast('Bitte gib eine gültige URL ein (mit https://)', 'warning');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([{
          title: resourceTitle,
          url: resourceUrl,
          category: resourceType,
          description: resourceDescription,
          created_by: user.name
        }])
        .select()
        .single();

      if (error) throw error;

      const resource = {
        id: data.id,
        title: data.title,
        url: data.url,
        type: data.category,
        description: data.description,
        addedBy: data.created_by,
        time: new Date(data.created_at).getTime()
      };

      setResources([resource, ...resources]);
      setResourceTitle('');
      setResourceUrl('');
      setResourceDescription('');
      playSound('splash');
      showToast('Ressource hinzugefügt!', 'success');
    } catch (error) {
      console.error('Resource error:', error);
      showToast('Fehler beim Hinzufügen', 'error');
    }
  };

  const deleteResource = async (resourceId) => {
    // Only admins can delete resources
    if (user.role !== 'admin') {
      showToast('Nur Administratoren können Ressourcen löschen', 'warning');
      return;
    }

    if (!confirm('Ressource wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;

      setResources(resources.filter(r => r.id !== resourceId));
    } catch (error) {
      console.error('Delete resource error:', error);
    }
  };

  const addNews = async () => {
    if (!newsTitle.trim() || !user?.permissions.canPostNews) return;

    // Content moderation
    if (!moderateContent(newsTitle, 'News-Titel')) {
      return;
    }

    if (newsContent && !moderateContent(newsContent, 'News-Inhalt')) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('news')
        .insert([{
          title: newsTitle.trim(),
          content: newsContent.trim(),
          author: user.name
        }])
        .select()
        .single();

      if (error) throw error;

      const newsItem = {
        id: data.id,
        title: data.title,
        content: data.content,
        author: data.author,
        time: new Date(data.created_at).getTime()
      };

      setNews([newsItem, ...news]);
      setNewsTitle('');
      setNewsContent('');
    } catch (error) {
      console.error('News error:', error);
    }
  };

  const deleteNews = async (newsId) => {
    if (!user?.permissions.canPostNews) return;
    if (!confirm('Diese Ankündigung wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', newsId);

      if (error) throw error;

      setNews(news.filter(n => n.id !== newsId));
    } catch (error) {
      console.error('Delete news error:', error);
      alert('Fehler beim Löschen der Ankündigung');
    }
  };

  const addExam = async () => {
    if (!examTitle.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('exams')
        .insert([{
          title: examTitle,
          description: examTopics,
          exam_date: examDate || null,
          created_by: user.name
        }])
        .select()
        .single();

      if (error) throw error;

      const exam = {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.exam_date,
        createdBy: data.created_by,
        time: new Date(data.created_at).getTime()
      };

      setExams([...exams, exam].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setExamTitle('');
      setExamDate('');
      setExamTopics('');
    } catch (error) {
      console.error('Exam error:', error);
    }
  };

  // Impressum vor Login
  if (!user && authView === 'impressum') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
      }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setAuthView('login')}
            className="mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-500 transition-colors"
          >
            ← Zurück zum Login
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">📜 Impressum</h2>

          <div className="space-y-4 text-gray-700 text-sm">
            <section>
              <h3 className="font-bold text-gray-800">Angaben gemäß § 5 TMG</h3>
              <p>Dennie Gulbinski<br/>Zeitstraße 108<br/>53721 Siegburg</p>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">Kontakt</h3>
              <p>E-Mail: denniegulbinski@gmail.com</p>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">Verantwortlich für den Inhalt</h3>
              <p>Dennie Gulbinski<br/>Zeitstraße 108<br/>53721 Siegburg</p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // Datenschutz vor Login
  if (!user && authView === 'datenschutz') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
      }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setAuthView('login')}
            className="mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-500 transition-colors"
          >
            ← Zurück zum Login
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">🔒 Datenschutzerklärung</h2>
          <p className="text-xs text-gray-500 mb-4">Stand: Januar 2025 | Diese Datenschutzerklärung gilt für die Nutzung der Bäder-Azubi App.</p>

          <div className="space-y-4 text-gray-700 text-sm">
            <section>
              <h3 className="font-bold text-gray-800">1. Verantwortlicher</h3>
              <p>Dennie Gulbinski<br/>Zeitstraße 108<br/>53721 Siegburg<br/>E-Mail: denniegulbinski@gmail.com</p>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">2. Zwecke der Datenverarbeitung</h3>
              <p>Die Verarbeitung personenbezogener Daten erfolgt ausschließlich zur:</p>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Bereitstellung der App-Funktionen</li>
                <li>Unterstützung von Ausbildungsprozessen (Berichtsheft, Lernfortschritt, Kommunikation)</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">3. Verarbeitete Datenarten</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li><strong>Stammdaten:</strong> Name, E-Mail-Adresse, optional Geburtsdatum</li>
                <li><strong>Nutzungsdaten:</strong> Login-Zeitpunkte, aktive Module</li>
                <li><strong>Lern- & Ausbildungsdaten:</strong> Quiz-Ergebnisse, Berichtshefteinträge, Schwimmeinheiten, Schulungsfortschritte</li>
                <li><strong>Kommunikationsdaten:</strong> Chatnachrichten innerhalb der App</li>
                <li><strong>Ausbilderdaten:</strong> Kontrollkarten, Kommentare, Freigaben</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">4. Rechtsgrundlagen der Verarbeitung</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung/Ausbildungsverhältnis)</li>
                <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: z. B. Systembetrieb, Support)</li>
                <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, z. B. für Chatfunktion)</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">5. Empfänger der Daten</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>IT-Dienstleister (z. B. Hosting, Wartung)</li>
                <li>Keine Weitergabe an Dritte zu Werbezwecken</li>
                <li>Datenverarbeitung erfolgt ausschließlich innerhalb der EU</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">6. Speicherdauer</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li><strong>Azubis:</strong> Löschung 3 Monate nach Ausbildungsende</li>
                <li><strong>Ausbilder:innen:</strong> Löschung 6 Monate nach Inaktivität</li>
                <li><strong>Admins:</strong> regelmäßige Löschprüfung jährlich</li>
                <li><strong>Chatnachrichten:</strong> max. 12 Monate, dann automatische Löschung</li>
                <li><strong>Berichtshefte:</strong> Löschung spätestens 1 Jahr nach Ausbildungsende</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">7. Betroffenenrechte</h3>
              <p>Du hast das Recht auf:</p>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Auskunft (Art. 15 DSGVO)</li>
                <li>Berichtigung (Art. 16 DSGVO)</li>
                <li>Löschung (Art. 17 DSGVO)</li>
                <li>Einschränkung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch (Art. 21 DSGVO)</li>
                <li>Widerruf einer Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
              </ul>
              <p className="mt-2">Anfragen bitte per E-Mail an: denniegulbinski@gmail.com</p>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">8. Cookies und lokale Speicherung</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Die App nutzt kein Tracking</li>
                <li>Es wird ausschließlich Local Storage verwendet (z. B. für Einstellungen und Anmeldedaten)</li>
                <li>Es erfolgt keine Analyse oder Weitergabe dieser Daten</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">9. Sicherheit der Verarbeitung</h3>
              <p>Zum Schutz deiner Daten setzen wir technische und organisatorische Maßnahmen ein:</p>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Verschlüsselte Übertragung (TLS)</li>
                <li>Zugriffsrechte nach Rolle</li>
                <li>Datensicherung</li>
                <li>Regelmäßige Updates</li>
              </ul>
            </section>
            <section className="pt-2 border-t border-gray-200 text-xs text-gray-500">
              <p>Diese Datenschutzerklärung wird regelmäßig aktualisiert. Letzte Aktualisierung: Januar 2025</p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // Login/Register Screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)',
        animation: 'waterFlow 20s ease-in-out infinite'
      }}>
        {/* Water Wave Animation */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 20px,
            rgba(255, 255, 255, 0.1) 20px,
            rgba(255, 255, 255, 0.1) 40px
          )`,
          animation: 'waves 8s linear infinite'
        }}></div>
        
        {/* Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                left: `${Math.random() * 100}%`,
                bottom: '-50px',
                animation: `bubble ${Math.random() * 10 + 5}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>

        <style>{`
          @keyframes waterFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes waves {
            0% { transform: translateY(0); }
            100% { transform: translateY(-40px); }
          }
          @keyframes bubble {
            0% { transform: translateY(0) scale(1); opacity: 0.2; }
            50% { opacity: 0.3; }
            100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
          }
        `}</style>

        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <img src="/icons/icon-192x192.png" alt="FAB Logo" className="w-24 h-24 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-cyan-700 mb-2">Bäder-Azubi App</h1>
            <p className="text-cyan-600">Professionelle Lern-Plattform</p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAuthView('login')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                authView === 'login'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthView('register')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                authView === 'register'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Registrieren
            </button>
          </div>
          
          {authView === 'login' ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="E-Mail oder Name"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Passwort"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <button
                onClick={handleLogin}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                <Lock className="inline mr-2" size={20} />
                Anmelden
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Vollständiger Name"
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="E-Mail"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Passwort"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <select
                value={registerData.role}
                onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="azubi">Azubi</option>
                <option value="trainer">Ausbilder</option>
                <option value="admin">Administrator</option>
              </select>
              {registerData.role === 'azubi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voraussichtliches Ausbildungsende:
                  </label>
                  <input
                    type="date"
                    value={registerData.trainingEnd}
                    onChange={(e) => setRegisterData({...registerData, trainingEnd: e.target.value})}
                    className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <AlertTriangle className="inline" size={12} /> Deine Daten werden nach Ausbildungsende automatisch gelöscht.
                  </p>
                </div>
              )}
              
              <button
                onClick={handleRegister}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                <Shield className="inline mr-2" size={20} />
                Registrierung beantragen
              </button>
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-sm text-cyan-800">
                <Shield className="inline mr-2" size={16} />
                Nach der Registrierung muss dein Account von einem Administrator freigeschaltet werden.
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-center gap-4 text-xs text-gray-600">
              <button
                onClick={() => setAuthView('impressum')}
                className="text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                Impressum
              </button>
              <span>|</span>
              <button
                onClick={() => setAuthView('datenschutz')}
                className="text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                Datenschutz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'dark-mode' : ''}`} style={{
      background: darkMode 
        ? 'linear-gradient(135deg, #0c4a6e 0%, #075985 25%, #0e7490 50%, #164e63 75%, #0f172a 100%)'
        : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
    }}>
      {/* Animated Swimmer */}
      <div className="absolute top-20 left-0 w-full h-32 overflow-hidden pointer-events-none z-0">
        <div className="swimmer animate-swim">
          <span className="text-6xl">🏊‍♂️</span>
        </div>
      </div>

      {/* Water Wave Animation Background */}
      <div className={`absolute inset-0 ${darkMode ? 'opacity-5' : 'opacity-10'}`} style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 30px,
          rgba(255, 255, 255, 0.1) 30px,
          rgba(255, 255, 255, 0.1) 60px
        )`,
        animation: 'waves 12s linear infinite'
      }}></div>

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white cursor-pointer"
            onClick={() => playSound('bubble')}
            style={{
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-100px',
              opacity: darkMode ? 0.05 : 0.1,
              animation: `bubble ${Math.random() * 15 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              pointerEvents: 'auto'
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes waves {
          0% { transform: translateY(0); }
          100% { transform: translateY(-60px); }
        }
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: ${darkMode ? 0.05 : 0.1}; }
          50% { opacity: ${darkMode ? 0.08 : 0.15}; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes swim {
          0% { transform: translateX(-100px) translateY(0); }
          25% { transform: translateX(25vw) translateY(-20px); }
          50% { transform: translateX(50vw) translateY(0); }
          75% { transform: translateX(75vw) translateY(20px); }
          100% { transform: translateX(calc(100vw + 100px)) translateY(0); }
        }
        .swimmer {
          position: absolute;
          animation: swim 20s linear infinite;
        }
        .animate-swim {
          animation: swim 20s linear infinite;
        }
      `}</style>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm animate-slide-in ${
              toast.type === 'success' ? 'bg-green-500/90 text-white' :
              toast.type === 'error' ? 'bg-red-500/90 text-white' :
              toast.type === 'warning' ? 'bg-yellow-500/90 text-white' :
              'bg-blue-500/90 text-white'
            }`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <span className="text-xl">{toast.icon}</span>
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-2 opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800' : 'bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600'} text-white p-4 shadow-lg relative z-20`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-3xl bg-white/20 rounded-full w-12 h-12 flex items-center justify-center">
              {user.avatar ? AVATARS.find(a => a.id === user.avatar)?.emoji || '🏊‍♂️' : '🏊‍♂️'}
            </div>
            <div>
              <h1 className="text-2xl font-bold drop-shadow-lg">Bäder-Azubi App</h1>
              <p className="text-sm opacity-90">
                {user.name} • {PERMISSIONS[user.role].label}
                {user.role === 'admin' && ' 👑'}
                {user.role === 'trainer' && ' 👨‍🏫'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                playSound('splash');
              }}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
              title={darkMode ? 'Tag-Modus' : 'Nacht-Modus'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playSound('splash');
              }}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
              title={soundEnabled ? 'Sound aus' : 'Sound an'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            {/* App Update (nur wenn neue Version verfügbar) */}
            {(updateAvailable || updatingApp) && (
              <button
                onClick={() => { void applyPwaUpdate(); }}
                disabled={updatingApp}
                className={`px-3 py-2 rounded-lg transition-colors backdrop-blur-sm flex items-center gap-2 bg-emerald-500/90 hover:bg-emerald-600/90 ${
                  updatingApp ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                title="Neue Version installieren"
              >
                <span>{updatingApp ? '⏳' : '⬆️'}</span>
                <span className="hidden sm:inline text-sm font-medium">
                  {updatingApp ? 'Update...' : 'Update'}
                </span>
              </button>
            )}

            {/* Request Notification Permission */}
            {'Notification' in window && Notification.permission === 'default' && (
              <button
                onClick={() => {
                  Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                      new Notification('🏊 Benachrichtigungen aktiviert!', {
                        body: 'Du wirst jetzt über News und Spielzüge informiert.',
                        icon: '🏊'
                      });
                    }
                  });
                }}
                className="bg-yellow-500/80 hover:bg-yellow-600/80 px-3 py-2 rounded-lg transition-colors backdrop-blur-sm font-bold text-sm flex items-center gap-2 animate-pulse"
                title="Benachrichtigungen erlauben"
              >
                🔔 Erlauben
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notification-bell"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  playSound('splash');
                }}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors relative backdrop-blur-sm"
              >
                <Bell size={24} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </div>
            
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
                localStorage.removeItem('baeder_user');
              }}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>

      {/* Notification Dropdown - fixed positioniert um Stacking-Probleme zu vermeiden */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-[9999]"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className={`fixed right-4 top-16 w-96 max-w-[calc(100vw-2rem)] ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl max-h-96 overflow-hidden`}
            onClick={e => e.stopPropagation()}
          >
            <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-cyan-50'}`}>
              <h3 className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>Benachrichtigungen</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className={`text-sm ${darkMode ? 'text-cyan-300 hover:text-cyan-100' : 'text-cyan-600 hover:text-cyan-800'}`}
                >
                  Alle löschen
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Keine Benachrichtigungen</p>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-4 border-b cursor-pointer ${
                      darkMode
                        ? `hover:bg-slate-700 ${!notif.read ? 'bg-slate-700' : ''} border-slate-700`
                        : `hover:bg-cyan-50 ${!notif.read ? 'bg-cyan-50' : ''}`
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{notif.title}</p>
                      {!notif.read && (
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notif.message}</p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(notif.time).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm shadow-md sticky top-0 z-10 relative`}>
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {[...appConfig.menuItems]
            .sort((a, b) => a.order - b.order)
            .filter(item => {
              // Check visibility
              if (!item.visible) return false;
              // Check permission requirements
              if (item.requiresPermission) {
                return user.permissions[item.requiresPermission];
              }
              return true;
            })
            .map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                playSound('splash');
                if (item.id === 'flashcards') {
                  loadFlashcards();
                }
              }}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                currentView === item.id
                  ? darkMode
                    ? 'text-cyan-400 border-b-4 border-cyan-400 bg-slate-700'
                    : 'text-cyan-600 border-b-4 border-cyan-600 bg-cyan-50'
                  : darkMode
                    ? 'text-gray-300 hover:text-cyan-400 hover:bg-slate-700'
                    : 'text-gray-600 hover:text-cyan-600 hover:bg-cyan-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 relative z-10">
        {/* Admin Panel */}
        {currentView === 'admin' && user.permissions.canManageUsers && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-8 text-center relative">
              <h2 className="text-3xl font-bold mb-2">👑 Admin-Bereich</h2>
              <p className="opacity-90">Nutzerverwaltung & Datenschutz</p>
              <div className="absolute bottom-2 right-3 text-xs opacity-60">v1.1.0</div>
            </div>

            {/* Admin Statistics Dashboard */}
            <div className="grid md:grid-cols-4 gap-4">
              {(() => {
                const stats = getAdminStats();
                return (
                  <>
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="text-blue-500" size={32} />
                        <span className="text-3xl font-bold text-blue-600">{stats.totalUsers}</span>
                      </div>
                      <p className="text-sm text-gray-600">Aktive Nutzer</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stats.azubis} Azubis • {stats.trainers} Ausbilder
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <AlertTriangle className="text-yellow-500" size={32} />
                        <span className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals}</span>
                      </div>
                      <p className="text-sm text-gray-600">Ausstehende Freischaltungen</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <Trophy className="text-green-500" size={32} />
                        <span className="text-3xl font-bold text-green-600">{stats.totalGames}</span>
                      </div>
                      <p className="text-sm text-gray-600">Laufende Spiele</p>
                      <p className="text-xs text-gray-500 mt-1">{stats.activeGamesCount} aktiv</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <Brain className="text-purple-500" size={32} />
                        <span className="text-3xl font-bold text-purple-600">{stats.totalQuestions}</span>
                      </div>
                      <p className="text-sm text-gray-600">Eingereichte Fragen</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stats.approvedQuestions} genehmigt • {stats.pendingQuestions} offen
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <BookOpen className="text-blue-500" size={32} />
                        <span className="text-3xl font-bold text-blue-600">{stats.totalMaterials}</span>
                      </div>
                      <p className="text-sm text-gray-600">Lernmaterialien</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <MessageCircle className="text-green-500" size={32} />
                        <span className="text-3xl font-bold text-green-600">{stats.totalMessages}</span>
                      </div>
                      <p className="text-sm text-gray-600">Chat-Nachrichten</p>
                    </div>

                    <div className={`bg-white rounded-xl p-6 shadow-md ${
                      stats.usersToDeleteSoon > 0 ? 'border-2 border-red-400' : ''
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <Trash2 className={stats.usersToDeleteSoon > 0 ? 'text-red-500' : 'text-gray-400'} size={32} />
                        <span className={`text-3xl font-bold ${
                          stats.usersToDeleteSoon > 0 ? 'text-red-600' : 'text-gray-400'
                        }`}>{stats.usersToDeleteSoon}</span>
                      </div>
                      <p className="text-sm text-gray-600">Löschung bald fällig</p>
                      <p className="text-xs text-gray-500 mt-1">Innerhalb 30 Tage</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <Shield className="text-indigo-500" size={32} />
                        <span className="text-3xl font-bold text-indigo-600">{stats.admins}</span>
                      </div>
                      <p className="text-sm text-gray-600">Administratoren</p>
                    </div>
                  </>
                );
              })()}
            </div>

            {pendingUsers.length > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center text-yellow-800">
                  <AlertTriangle className="mr-2" />
                  Ausstehende Freischaltungen ({pendingUsers.length})
                </h3>
                <div className="space-y-3">
                  {pendingUsers.map(acc => (
                    <div key={acc.email} className="bg-white rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{acc.name}</p>
                        <p className="text-sm text-gray-600">{acc.email} • {PERMISSIONS[acc.role].label}</p>
                        {acc.role === 'azubi' && acc.trainingEnd && (
                          <p className="text-xs text-gray-500">Ausbildungsende: {new Date(acc.trainingEnd).toLocaleDateString()}</p>
                        )}
                      </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveUser(acc.email)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Account von ${acc.name} wirklich ablehnen und löschen?`)) {
                                await supabase.from('profiles').delete().eq('email', acc.email);
                                loadData();
                                alert('Account abgelehnt und gelöscht.');
                              }
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
                          >
                            <X size={20} />
                          </button>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Users className="mr-2 text-blue-500" />
                Aktive Nutzer ({allUsers.length})
              </h3>
              <div className="space-y-3">
                {allUsers.map(acc => {
                  const daysLeft = getDaysUntilDeletion(acc);
                  return (
                    <div key={acc.email} className="border rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-1 flex-wrap">
                        <p className="font-bold">{acc.name}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
                          acc.role === 'admin' ? 'bg-purple-500' :
                          acc.role === 'trainer' ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {PERMISSIONS[acc.role].label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{acc.email}</p>
                      {acc.trainingEnd && (
                        <p className="text-xs text-gray-500">
                          Ausbildungsende: {new Date(acc.trainingEnd).toLocaleDateString()}
                        </p>
                      )}
                      {acc.lastLogin && (
                        <p className="text-xs text-gray-500">
                          Letzter Login: {new Date(acc.lastLogin).toLocaleDateString()}
                        </p>
                      )}
                      {daysLeft !== null && (
                        <div className={`mt-1 flex items-center text-xs ${
                          daysLeft < 30 ? 'text-red-600' : daysLeft < 90 ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          <AlertTriangle size={14} className="mr-1" />
                          {daysLeft > 0
                            ? `Automatische Löschung in ${daysLeft} Tagen`
                            : 'Löschung steht bevor'}
                        </div>
                      )}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <select
                          value={acc.role}
                          onChange={(e) => changeUserRole(acc.email, e.target.value)}
                          className="px-3 py-1.5 border rounded text-sm"
                          disabled={acc.role === 'admin'}
                        >
                          <option value="azubi">Azubi</option>
                          <option value="trainer">Ausbilder</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => exportUserData(acc.email, acc.name)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                          title="Daten exportieren"
                        >
                          <Download size={18} />
                        </button>
                        {acc.role !== 'admin' && (
                          <button
                            onClick={() => deleteUser(acc.email)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                            title="Nutzer löschen"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        {acc.role === 'trainer' && (
                          <>
                            <button
                              onClick={() => toggleSchoolCardPermission(acc.id, acc.can_view_school_cards)}
                              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                acc.can_view_school_cards
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={acc.can_view_school_cards ? 'Kontrollkarten-Zugriff entziehen' : 'Kontrollkarten-Zugriff erteilen'}
                            >
                              Kontrollkarten {acc.can_view_school_cards ? '✓' : '○'}
                            </button>
                            <button
                              onClick={() => toggleSignReportsPermission(acc.id, acc.can_sign_reports)}
                              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                acc.can_sign_reports
                                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={acc.can_sign_reports ? 'Berichtsheft-Unterschrift entziehen' : 'Berichtsheft-Unterschrift erteilen'}
                            >
                              Berichte {acc.can_sign_reports ? '✓' : '○'}
                            </button>
                          </>
                        )}
                        {acc.role === 'admin' && (
                          <div className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold flex items-center">
                            <Shield size={14} className="mr-1" />
                            Geschützt
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* UI Editor Section */}
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <span className="text-2xl mr-2">🎨</span>
                UI-Editor (App-Konfiguration)
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Hier kannst du die Navigation und Farben der App für alle Nutzer anpassen.
              </p>

              {/* Initialize editing state button */}
              {editingMenuItems.length === 0 && (
                <button
                  onClick={() => {
                    setEditingMenuItems([...appConfig.menuItems]);
                    setEditingThemeColors({...appConfig.themeColors});
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-bold mb-4"
                >
                  🎨 Editor öffnen
                </button>
              )}

              {editingMenuItems.length > 0 && (
                <>
                  {/* Menu Items Editor */}
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4 mb-4`}>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-cyan-400' : 'text-gray-800'}`}>
                      📋 Menü-Reihenfolge & Sichtbarkeit
                    </h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {[...editingMenuItems]
                        .sort((a, b) => a.order - b.order)
                        .map((item, index) => (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 p-3 rounded-lg ${
                              darkMode ? 'bg-slate-600' : 'bg-white'
                            } ${!item.visible ? 'opacity-50' : ''}`}
                          >
                            {/* Order number */}
                            <span className={`text-sm font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {index + 1}.
                            </span>

                            {/* Move buttons */}
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => moveMenuItem(item.id, 'up')}
                                disabled={index === 0}
                                className={`p-1 rounded ${index === 0 ? 'opacity-30' : 'hover:bg-gray-200 dark:hover:bg-slate-500'}`}
                              >
                                ⬆️
                              </button>
                              <button
                                onClick={() => moveMenuItem(item.id, 'down')}
                                disabled={index === editingMenuItems.length - 1}
                                className={`p-1 rounded ${index === editingMenuItems.length - 1 ? 'opacity-30' : 'hover:bg-gray-200 dark:hover:bg-slate-500'}`}
                              >
                                ⬇️
                              </button>
                            </div>

                            {/* Icon */}
                            <input
                              type="text"
                              value={item.icon}
                              onChange={(e) => updateMenuItemIcon(item.id, e.target.value)}
                              className={`w-12 text-center text-xl p-1 rounded border ${darkMode ? 'bg-slate-700 border-slate-500' : 'border-gray-300'}`}
                              maxLength={2}
                            />

                            {/* Label */}
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => updateMenuItemLabel(item.id, e.target.value)}
                              className={`flex-1 px-3 py-1 rounded border ${darkMode ? 'bg-slate-700 border-slate-500 text-white' : 'border-gray-300'}`}
                            />

                            {/* Visibility toggle */}
                            <button
                              onClick={() => toggleMenuItemVisibility(item.id)}
                              className={`px-3 py-1 rounded-lg text-sm font-bold ${
                                item.visible
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-300 text-gray-600'
                              }`}
                            >
                              {item.visible ? '👁️ Sichtbar' : '🚫 Versteckt'}
                            </button>

                            {/* Permission indicator */}
                            {item.requiresPermission && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                🔒 {item.requiresPermission}
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Theme Colors Editor */}
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4 mb-4`}>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-cyan-400' : 'text-gray-800'}`}>
                      🎨 Theme-Farben
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {Object.entries(editingThemeColors).map(([key, value]) => (
                        <div key={key} className="flex flex-col items-center gap-2">
                          <label className={`text-sm font-medium capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {key === 'primary' ? '🔵 Primär' :
                             key === 'secondary' ? '⚪ Sekundär' :
                             key === 'success' ? '🟢 Erfolg' :
                             key === 'danger' ? '🔴 Gefahr' :
                             key === 'warning' ? '🟡 Warnung' : key}
                          </label>
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => updateThemeColor(key, e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer border-2 border-gray-300"
                          />
                          <span className="text-xs font-mono">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={saveAppConfig}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-bold"
                    >
                      💾 Speichern (für alle Nutzer)
                    </button>
                    <button
                      onClick={resetAppConfig}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold"
                    >
                      🔄 Zurücksetzen
                    </button>
                    <button
                      onClick={() => {
                        setEditingMenuItems([]);
                        setEditingThemeColors({});
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold"
                    >
                      ❌ Abbrechen
                    </button>
                  </div>

                  {/* Info Box */}
                  <div className={`mt-4 ${darkMode ? 'bg-blue-900/50 border-blue-600' : 'bg-blue-50 border-blue-300'} border-2 rounded-lg p-4`}>
                    <h4 className={`font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                      💡 Hinweise
                    </h4>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <li>• Änderungen gelten für <strong>alle Nutzer</strong> nach dem Speichern</li>
                      <li>• Menüpunkte mit 🔒 sind nur für bestimmte Rollen sichtbar</li>
                      <li>• Versteckte Menüpunkte erscheinen nicht in der Navigation</li>
                      <li>• Farben werden aktuell nur in der Vorschau angezeigt</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Existing views - Home, Quiz, Stats, Chat, Materials, News, Exams, Questions */}
        {/* (Keeping all previous view code - too long to repeat here, but it stays the same) */}
        
        {currentView === 'home' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-900' : 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500'} text-white rounded-xl p-8 text-center shadow-xl backdrop-blur-sm`}>
              <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">🌊 Willkommen zurück! 💦</h2>
              {dailyWisdom && (
                <p className="text-sm opacity-90 mb-4 italic">💡 {dailyWisdom}</p>
              )}
              {userStats && (
                <div className="flex justify-center gap-6 mt-4">
                  <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm rounded-lg px-6 py-3 border-2 ${darkMode ? 'border-white/20' : 'border-white/30'}`}>
                    <div className="text-2xl font-bold">🏆 {userStats.wins}</div>
                    <div className="text-sm">Siege</div>
                  </div>
                  <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm rounded-lg px-6 py-3 border-2 ${darkMode ? 'border-white/20' : 'border-white/30'}`}>
                    <div className="text-2xl font-bold">💪 {userStats.losses}</div>
                    <div className="text-sm">Niederlagen</div>
                  </div>
                  <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm rounded-lg px-6 py-3 border-2 ${darkMode ? 'border-white/20' : 'border-white/30'}`}>
                    <div className="text-2xl font-bold">🤝 {userStats.draws}</div>
                    <div className="text-sm">Unentschieden</div>
                  </div>
                  <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm rounded-lg px-6 py-3 border-2 ${darkMode ? 'border-white/20' : 'border-white/30'}`}>
                    <div className="text-2xl font-bold">⭐ {getTotalXpFromStats(userStats)}</div>
                    <div className="text-sm">XP Gesamt</div>
                  </div>
                </div>
              )}
              {/* Profil-Button */}
              <button
                onClick={() => setCurrentView('profile')}
                className={`mt-4 inline-flex items-center gap-2 px-6 py-3 ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/20 hover:bg-white/30'} backdrop-blur-sm rounded-lg border-2 ${darkMode ? 'border-white/20' : 'border-white/30'} transition-all font-medium`}
              >
                <span className="text-xl">👤</span>
                <span>Mein Profil</span>
              </button>
            </div>

            {/* Daily Challenges Section */}
            {dailyChallenges.length > 0 && (
              <div className={`${darkMode ? 'bg-gradient-to-r from-orange-900/80 via-amber-900/80 to-orange-900/80' : 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50'} backdrop-blur-sm border-2 ${darkMode ? 'border-orange-700' : 'border-orange-300'} rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold flex items-center ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                    <Target className="mr-2" />
                    🎯 Tägliche Challenges
                  </h3>
                  <div className={`flex items-center gap-2 ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                    <span className="text-sm font-medium">{getCompletedChallengesCount()}/3 erledigt</span>
                    {getCompletedChallengesCount() === 3 && <span className="text-xl">🏆</span>}
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {dailyChallenges.map((challenge, idx) => {
                    const progress = getChallengeProgress(challenge);
                    const completed = isChallengeCompleted(challenge);
                    const percentage = Math.min((progress / challenge.target) * 100, 100);

                    return (
                      <div
                        key={idx}
                        className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-4 shadow-md transition-all ${
                          completed ? 'ring-2 ring-green-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{challenge.icon}</span>
                          {completed && <span className="text-green-500 text-xl">✓</span>}
                        </div>
                        <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {challenge.name}
                        </h4>
                        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {challenge.target} {challenge.unit}
                          {challenge.category && ` ${challenge.category.name}`}
                        </p>
                        <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-3 mb-2`}>
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              completed ? 'bg-green-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {progress}/{challenge.target}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            completed
                              ? 'bg-green-100 text-green-700'
                              : darkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700'
                          }`}>
                            +{challenge.xpReward} XP
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {getCompletedChallengesCount() === 3 && (
                  <div className={`mt-4 text-center p-3 rounded-lg ${darkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                    <p className={`font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                      🎉 Alle Challenges geschafft! Du hast heute {getTotalXPEarned()} XP verdient!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Win Streak Banner */}
            {userStats && userStats.winStreak >= 3 && (
              <div className={`${
                userStats.winStreak >= 10
                  ? darkMode ? 'bg-gradient-to-r from-orange-900/80 via-red-900/80 to-orange-900/80 border-orange-500' : 'bg-gradient-to-r from-orange-100 via-red-100 to-orange-100 border-orange-400'
                  : darkMode ? 'bg-gradient-to-r from-yellow-900/80 via-amber-900/80 to-yellow-900/80 border-yellow-600' : 'bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border-yellow-400'
              } backdrop-blur-sm border-2 rounded-xl p-4 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl animate-pulse">
                      {userStats.winStreak >= 25 ? '💎' : userStats.winStreak >= 15 ? '🏆' : userStats.winStreak >= 10 ? '🔥' : userStats.winStreak >= 5 ? '⚡' : '💪'}
                    </span>
                    <div>
                      <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {userStats.winStreak} Siege in Folge!
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {userStats.winStreak >= 25 ? 'Legendäre Serie!' :
                         userStats.winStreak >= 15 ? 'Dominanz pur!' :
                         userStats.winStreak >= 10 ? 'Unaufhaltsam!' :
                         userStats.winStreak >= 5 ? 'Durchstarter!' : 'Weiter so!'}
                      </p>
                    </div>
                  </div>
                  <div className={`text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p className="text-sm">Nächster Meilenstein</p>
                    <p className="font-bold">
                      {(() => {
                        const milestones = [3, 5, 10, 15, 25, 50];
                        const next = milestones.find(m => m > userStats.winStreak);
                        return next ? `${next - userStats.winStreak} bis ${next}` : 'Maximum erreicht!';
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Spaced Repetition Reminder */}
            {getTotalDueCards() > 0 && (
              <div className={`${darkMode ? 'bg-purple-900/80' : 'bg-purple-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-purple-700' : 'border-purple-300'} rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className={`mr-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={32} />
                    <div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                        🧠 Lernkarten zur Wiederholung
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        {getTotalDueCards()} Karten sind heute fällig
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSpacedRepetitionMode(true);
                      setCurrentView('flashcards');
                      playSound('splash');
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold shadow-md flex items-center gap-2"
                  >
                    <Zap size={18} />
                    Jetzt wiederholen
                  </button>
                </div>
              </div>
            )}

            {activeGames.filter(g => g.player2 === user.name && g.status === 'waiting').length > 0 && (
              <div className={`${darkMode ? 'bg-yellow-900/80' : 'bg-yellow-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-yellow-700' : 'border-yellow-400'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  <Zap className="mr-2" />
                  ⚡ Offene Herausforderungen
                </h3>
                {activeGames.filter(g => g.player2 === user.name && g.status === 'waiting').map(game => {
                  const diff = DIFFICULTY_SETTINGS[game.difficulty];
                  return (
                    <div key={game.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 mb-3 flex justify-between items-center shadow-md`}>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>🏊 {game.player1} fordert dich heraus!</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
                          <span>Quizduell • 6 Runden</span>
                          <span className={`${diff.color} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                            {diff.icon} {diff.label} ({diff.time}s)
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          acceptChallenge(game.id);
                          playSound('whistle');
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-md"
                      >
                        Annehmen 🎯
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {activeGames.filter(g => (g.player1 === user.name || g.player2 === user.name) && g.status === 'active').length > 0 && (
              <div className={`${darkMode ? 'bg-cyan-900/80' : 'bg-cyan-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-cyan-700' : 'border-cyan-400'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>
                  <Trophy className="mr-2" />
                  🏊 Laufende Spiele
                </h3>
                {activeGames.filter(g => (g.player1 === user.name || g.player2 === user.name) && g.status === 'active').map(game => {
                  const diff = DIFFICULTY_SETTINGS[game.difficulty];
                  return (
                    <div key={game.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 mb-3 flex justify-between items-center shadow-md`}>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>⚔️ {game.player1} vs {game.player2}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
                          <span>Runde {game.round + 1}/6 • {game.player1Score}:{game.player2Score}</span>
                          <span className={`${diff.color} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                            {diff.icon} {diff.label}
                          </span>
                          {game.currentTurn === user.name && ' • Du bist dran! ⚡'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          continueGame(game.id);
                          playSound('whistle');
                        }}
                        className={`px-6 py-2 rounded-lg font-bold shadow-md ${
                          game.currentTurn === user.name
                            ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse'
                            : darkMode
                              ? 'bg-slate-600 text-gray-300'
                              : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        {game.currentTurn === user.name ? 'Weiterspielen ⚡' : 'Anschauen'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* News Section */}
            {news.length > 0 && (
              <div className={`${darkMode ? 'bg-red-900/80' : 'bg-red-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-red-700' : 'border-red-400'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold mb-4 flex items-center justify-between ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                  <span className="flex items-center">
                    <Bell className="mr-2" />
                    📢 Aktuelle News
                  </span>
                  <button
                    onClick={() => {
                      setCurrentView('news');
                      playSound('splash');
                    }}
                    className={`text-sm ${darkMode ? 'text-red-300 hover:text-red-100' : 'text-red-600 hover:text-red-800'} underline`}
                  >
                    Alle anzeigen →
                  </button>
                </h3>
                <div className="space-y-3">
                  {news.slice(0, 3).map(item => (
                    <div key={item.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-md border-l-4 border-red-500`}>
                      <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</h4>
                      <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>{item.content}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Von {item.author} • {new Date(item.time).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exams Section */}
            {exams.length > 0 && (
              <div className={`${darkMode ? 'bg-green-900/80' : 'bg-green-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-green-700' : 'border-green-400'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold mb-4 flex items-center justify-between ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                  <span className="flex items-center">
                    <Calendar className="mr-2" />
                    📋 Anstehende Klausuren
                  </span>
                  <button
                    onClick={() => {
                      setCurrentView('exams');
                      playSound('splash');
                    }}
                    className={`text-sm ${darkMode ? 'text-green-300 hover:text-green-100' : 'text-green-600 hover:text-green-800'} underline`}
                  >
                    Alle anzeigen →
                  </button>
                </h3>
                <div className="space-y-3">
                  {exams.slice(0, 3).map(exam => {
                    const examDate = new Date(exam.date);
                    const today = new Date();
                    const daysUntil = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysUntil <= 7 && daysUntil >= 0;
                    
                    return (
                      <div key={exam.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-md border-l-4 ${
                        isUrgent ? 'border-orange-500' : 'border-green-500'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{exam.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isUrgent 
                              ? 'bg-orange-500 text-white animate-pulse' 
                              : darkMode ? 'bg-green-700 text-green-200' : 'bg-green-100 text-green-800'
                          }`}>
                            {daysUntil > 0 ? `in ${daysUntil} Tagen` : daysUntil === 0 ? 'Heute!' : 'Vorbei'}
                          </span>
                        </div>
                        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-1`}>{exam.topics}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {examDate.toLocaleDateString()} • {exam.user}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-4 gap-4">
              <div className={`${darkMode ? 'bg-slate-800/95 border-cyan-600' : 'bg-white/95 border-cyan-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-cyan-400`}
               onClick={() => {
                     setCurrentView('exam-simulator');
                     setExamSimulatorMode('theory');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">📝</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>Prüfungssimulator</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Theorie & Praxis üben</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-purple-600' : 'bg-white/95 border-purple-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-400`}
                   onClick={() => {
                     setCurrentView('flashcards');
                     loadFlashcards();
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🎴</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>Karteikarten</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Klassisch lernen</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-blue-600' : 'bg-white/95 border-blue-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-400`}
                   onClick={() => {
                     setCurrentView('calculator');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🧮</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Praxis-Rechner</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Mit Lösungsweg</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-green-600' : 'bg-white/95 border-green-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-400`}
                   onClick={() => {
                     setCurrentView('quiz');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🎮</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Quizduell</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fordere andere heraus!</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-cyan-600' : 'bg-white/95 border-cyan-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-cyan-400`}
                   onClick={() => {
                     setCurrentView('swim-challenge');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🏊</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>Schwimm-Challenge</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Azubis vs. Trainer!</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-yellow-600' : 'bg-white/95 border-yellow-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-yellow-400`}
                   onClick={() => {
                     setCurrentView('stats');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🏅</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>Statistiken</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Badges & Ranking</p>
              </div>

              {user.permissions.canViewAllStats && (
                <div className={`${darkMode ? 'bg-slate-800/95 border-indigo-600' : 'bg-white/95 border-indigo-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-indigo-400`}
                     onClick={() => {
                       setCurrentView('trainer-dashboard');
                       playSound('splash');
                     }}>
                  <div className="text-5xl mb-3 text-center">👨‍🏫</div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Azubi-Übersicht</h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fortschritte sehen</p>
                </div>
              )}

              <div className={`${darkMode ? 'bg-slate-800/95 border-green-600' : 'bg-white/95 border-green-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-400`}
                   onClick={() => {
                     setCurrentView('materials');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">📚</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Lernmaterialien</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{materials.length} Materialien</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-indigo-600' : 'bg-white/95 border-indigo-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-indigo-400`}
                   onClick={() => {
                     setCurrentView('resources');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🔗</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Ressourcen</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{resources.length} Links</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-pink-600' : 'bg-white/95 border-pink-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-pink-400`}
                   onClick={() => {
                     setCurrentView('chat');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">💬</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-pink-400' : 'text-pink-700'}`}>Team-Chat</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{messages.length} Nachrichten</p>
              </div>

              {/* Berichtsheft */}
              <div className={`${darkMode ? 'bg-slate-800/95 border-teal-600' : 'bg-white/95 border-teal-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-teal-400`}
                   onClick={() => {
                     setCurrentView('berichtsheft');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">📖</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>Berichtsheft</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Ausbildungsnachweis</p>
              </div>

              {/* Kontrollkarte Berufsschule */}
              <div className={`${darkMode ? 'bg-slate-800/95 border-orange-600' : 'bg-white/95 border-orange-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-orange-400`}
                   onClick={() => {
                     setCurrentView('school-card');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🎓</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>Kontrollkarte</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Berufsschule</p>
              </div>

              {/* Fragen einreichen */}
              <div className={`${darkMode ? 'bg-slate-800/95 border-amber-600' : 'bg-white/95 border-amber-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-amber-400`}
                   onClick={() => {
                     setCurrentView('questions');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">💡</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>Fragen</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Einreichen & lernen</p>
              </div>
            </div>
          </div>
        )}

        {/* Quiz View */}
        {currentView === 'quiz' && !currentGame && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Quizduell 🏆</h2>
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold mb-4">Spieler herausfordern</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Schwierigkeitsgrad wählen:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(DIFFICULTY_SETTINGS).map(([key, diff]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedDifficulty(key)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedDifficulty === key
                          ? `${diff.color} text-white border-transparent`
                          : 'bg-white border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-3xl mb-2">{diff.icon}</div>
                      <div className="font-bold">{diff.label}</div>
                      <div className="text-sm opacity-90">{diff.time} Sekunden</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3">
                {allUsers.filter(u => u.name !== user.name).map(u => (
                  <div key={u.name} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        u.role === 'trainer' || u.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        {u.role === 'trainer' || u.role === 'admin' ? '👨‍🏫' : '🎓'}
                      </div>
                      <div>
                        <p className="font-bold">{u.name}</p>
                        <p className="text-sm text-gray-600">
                          {u.role === 'admin' ? 'Administrator' : u.role === 'trainer' ? 'Ausbilder' : 'Azubi'}
                        </p>
                      </div>
                    </div>
                    {activeGames.some(g =>
                      g.status !== 'finished' &&
                      ((g.player1 === user.name && g.player2 === u.name) ||
                       (g.player1 === u.name && g.player2 === user.name))
                    ) ? (
                      <span className="text-sm text-gray-500 italic px-4">Spiel läuft bereits</span>
                    ) : (
                      <button
                        onClick={() => challengePlayer(u.name)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center space-x-2"
                      >
                        <Target size={20} />
                        <span>Herausfordern</span>
                      </button>
                    )}
                  </div>
                ))}
                {allUsers.filter(u => u.name !== user.name).length === 0 && (
                  <p className="text-gray-500 text-center py-8">Noch keine anderen Spieler online</p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === 'quiz' && currentGame && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <div className="text-center mb-4">
                {(() => {
                  const diff = DIFFICULTY_SETTINGS[currentGame.difficulty];
                  return (
                    <span className={`${diff.color} text-white px-6 py-2 rounded-full font-bold inline-flex items-center gap-2`}>
                      {diff.icon} {diff.label} - {diff.time} Sekunden pro Frage
                    </span>
                  );
                })()}
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="text-center flex-1">
                  <p className="text-sm text-gray-600 mb-1">{currentGame.player1}</p>
                  <p className="text-3xl font-bold text-blue-600">{currentGame.player1Score}</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-gray-400">Kategorie {(currentGame.categoryRound || 0) + 1}/4</p>
                  {quizCategory && (
                    <p className="text-sm text-gray-500 mt-1">
                      Frage {questionInCategory + 1}/5
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    {playerTurn === user.name ? '⚡ Du bist dran!' : `${playerTurn} ist dran...`}
                  </p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-sm text-gray-600 mb-1">{currentGame.player2}</p>
                  <p className="text-3xl font-bold text-red-600">{currentGame.player2Score}</p>
                </div>
              </div>

              {/* Kategorie-Übersicht */}
              {currentGame.categoryRounds && currentGame.categoryRounds.length > 0 && !currentQuestion && (
                <div className="mb-4 flex justify-center gap-2 flex-wrap">
                  {currentGame.categoryRounds.map((cr, idx) => {
                    const cat = CATEGORIES.find(c => c.id === cr.categoryId);
                    return (
                      <span key={idx} className={`${cat?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm`}>
                        {cat?.icon} {cat?.name}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Kategorie wählen - nur wenn ich dran bin UND noch keine Kategorie gewählt wurde */}
              {!quizCategory && playerTurn === user.name && !waitingForOpponent && (
                <div>
                  <h3 className="text-xl font-bold text-center mb-4">Wähle eine Kategorie:</h3>
                  <p className="text-center text-gray-500 mb-4">Du wählst 5 Fragen - danach spielt {currentGame.player1 === user.name ? currentGame.player2 : currentGame.player1} die gleichen Fragen!</p>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.filter(cat => {
                      // Bereits gespielte Kategorien ausblenden
                      const played = currentGame.categoryRounds?.map(cr => cr.categoryId) || [];
                      return !played.includes(cat.id);
                    }).map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => selectCategory(cat.id)}
                        className={`${cat.color} text-white rounded-xl p-4 hover:scale-105 transition-transform`}
                      >
                        <div className="text-3xl mb-2">{cat.icon}</div>
                        <div className="font-bold text-sm">{cat.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Spieler 2 muss die gleichen Fragen spielen */}
              {!currentQuestion && playerTurn === user.name && currentGame.categoryRounds && currentGame.categoryRounds.length > 0 && (() => {
                const currentCatRound = currentGame.categoryRounds[currentGame.categoryRound || 0];
                if (!currentCatRound) return false;
                const isPlayer1 = user.name === currentGame.player1;
                const myAnswers = isPlayer1 ? currentCatRound.player1Answers : currentCatRound.player2Answers;
                return myAnswers.length === 0 && currentCatRound.questions.length > 0;
              })() && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-xl font-bold mb-2">
                    {(() => {
                      const currentCatRound = currentGame.categoryRounds[currentGame.categoryRound || 0];
                      return currentCatRound?.categoryName || 'Kategorie';
                    })()}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {currentGame.player1 === user.name ? currentGame.player2 : currentGame.player1} hat diese Kategorie gespielt. Jetzt bist du dran mit den gleichen 5 Fragen!
                  </p>
                  <button
                    onClick={startCategoryAsSecondPlayer}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                  >
                    Los geht's! 🚀
                  </button>
                </div>
              )}

              {/* Warte auf anderen Spieler */}
              {!quizCategory && playerTurn !== user.name && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⏳</div>
                  <p className="text-xl text-gray-600">Warte auf {playerTurn}...</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {waitingForOpponent ? 'Dein Gegner spielt jetzt die gleichen Fragen' : 'Dein Gegner wählt eine Kategorie'}
                  </p>
                </div>
              )}

              {/* Frage anzeigen */}
              {currentQuestion && playerTurn === user.name && (
                <div className="space-y-4">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        {(() => {
                          const cat = CATEGORIES.find(c => c.id === quizCategory);
                          return cat ? `${cat.icon} ${cat.name}` : 'Frage';
                        })()}
                      </span>
                      <span className={`text-2xl font-bold ${
                        timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'
                      }`}>
                        {timeLeft}s
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          timeLeft <= 10 ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(timeLeft / DIFFICULTY_SETTINGS[currentGame.difficulty].time) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-6">
                    <p className="text-xl font-bold text-center">{currentQuestion.q}</p>
                    {currentQuestion.multi && !answered && (
                      <p className="text-center text-sm text-orange-600 mt-2 font-medium">
                        ⚠️ Mehrere Antworten sind richtig - wähle alle richtigen aus!
                      </p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    {currentQuestion.a.map((answer, idx) => {
                      // Multi-Select Logik
                      const isMulti = currentQuestion.multi;
                      const isSelectedMulti = selectedAnswers.includes(idx);
                      const isSelectedSingle = lastSelectedAnswer === idx;
                      const isCorrectAnswer = isMulti
                        ? currentQuestion.correct.includes(idx)
                        : idx === currentQuestion.correct;

                      let buttonClass = '';
                      if (answered) {
                        if (isCorrectAnswer) {
                          buttonClass = 'bg-green-500 text-white'; // Richtige Antwort grün
                        } else if ((isMulti && isSelectedMulti) || (!isMulti && isSelectedSingle)) {
                          buttonClass = 'bg-red-500 text-white'; // Falsch ausgewählt rot
                        } else {
                          buttonClass = 'bg-gray-200 text-gray-500';
                        }
                      } else {
                        if (isMulti && isSelectedMulti) {
                          buttonClass = 'bg-blue-500 text-white border-2 border-blue-600';
                        } else {
                          buttonClass = 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => answerQuestion(idx)}
                          disabled={answered}
                          className={`p-4 rounded-xl font-medium transition-all ${buttonClass}`}
                        >
                          {isMulti && !answered && (
                            <span className="mr-2">{isSelectedMulti ? '☑️' : '⬜'}</span>
                          )}
                          {answer}
                        </button>
                      );
                    })}
                  </div>
                  {/* Multi-Select Bestätigen Button */}
                  {currentQuestion.multi && !answered && selectedAnswers.length > 0 && (
                    <button
                      onClick={confirmMultiSelectAnswer}
                      className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                    >
                      ✓ Antwort bestätigen ({selectedAnswers.length} ausgewählt)
                    </button>
                  )}
                  {answered && timeLeft === 0 && (
                    <div className="bg-red-100 border-2 border-red-500 rounded-xl p-4 text-center">
                      <p className="text-red-700 font-bold">⏰ Zeit abgelaufen!</p>
                    </div>
                  )}
                  {answered && (
                    <button
                      onClick={proceedToNextRound}
                      className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
                    >
                      Weiter →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats View */}
        {currentView === 'stats' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white rounded-xl p-8`}>
              <h2 className="text-3xl font-bold mb-4">📊 Deine Statistiken</h2>
              {userStats && (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-lg p-4 text-center`}>
                      <div className="text-3xl font-bold">{userStats.wins}</div>
                      <div className="text-sm">Siege</div>
                    </div>
                    <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-lg p-4 text-center`}>
                      <div className="text-3xl font-bold">{userStats.losses}</div>
                      <div className="text-sm">Niederlagen</div>
                    </div>
                    <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-lg p-4 text-center`}>
                      <div className="text-3xl font-bold">{userStats.draws}</div>
                      <div className="text-sm">Unentschieden</div>
                    </div>
                  </div>

                  {/* Win Streak Anzeige */}
                  <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-xl p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{userStats.winStreak >= 10 ? '🔥' : userStats.winStreak >= 5 ? '⚡' : userStats.winStreak >= 3 ? '💪' : '🎯'}</span>
                        <div>
                          <div className="text-2xl font-bold">
                            {userStats.winStreak || 0} Siege in Folge
                          </div>
                          <div className="text-sm opacity-80">
                            Rekord: {userStats.bestWinStreak || 0} Siege
                          </div>
                        </div>
                      </div>
                      {/* Nächster Meilenstein */}
                      {(() => {
                        const current = userStats.winStreak || 0;
                        const milestones = [3, 5, 10, 15, 25, 50];
                        const nextMilestone = milestones.find(m => m > current);
                        if (nextMilestone) {
                          const remaining = nextMilestone - current;
                          return (
                            <div className="text-right">
                              <div className="text-sm opacity-80">Nächster Meilenstein</div>
                              <div className="font-bold">
                                Noch {remaining} {remaining === 1 ? 'Sieg' : 'Siege'} bis {nextMilestone}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div className="text-right">
                            <div className="text-2xl">💎</div>
                            <div className="text-sm font-bold">Unbesiegbar!</div>
                          </div>
                        );
                      })()}
                    </div>
                    {/* Streak Progress Bar */}
                    {(() => {
                      const current = userStats.winStreak || 0;
                      const milestones = [3, 5, 10, 15, 25, 50];
                      const nextMilestone = milestones.find(m => m > current) || 50;
                      const prevMilestone = [...milestones].reverse().find(m => m <= current) || 0;
                      const progress = ((current - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
                      return (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1 opacity-70">
                            <span>{prevMilestone}</span>
                            <span>{nextMilestone}</span>
                          </div>
                          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}
            </div>

            {/* Badges Section */}
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🏆 Deine Badges
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {userBadges.length} von {BADGES.length} Badges freigeschaltet
              </p>

              {/* Quiz-Badges */}
              <h4 className={`text-lg font-bold mt-4 mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📚 Quiz & Lernen
                <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                  {userBadges.filter(b => BADGES.find(badge => badge.id === b.id && badge.category === 'quiz')).length} / {BADGES.filter(b => b.category === 'quiz').length}
                </span>
              </h4>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                {BADGES.filter(b => b.category === 'quiz').map(badge => {
                  const earned = userBadges.find(b => b.id === badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-xl text-center transition-all ${
                        earned
                          ? darkMode
                            ? 'bg-gradient-to-br from-yellow-900 to-yellow-800 border-2 border-yellow-600'
                            : 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400'
                          : darkMode
                            ? 'bg-slate-700 opacity-40'
                            : 'bg-gray-100 opacity-40'
                      }`}
                    >
                      <div className="text-5xl mb-2">{badge.icon}</div>
                      <p className={`font-bold mb-1 ${earned ? darkMode ? 'text-yellow-200' : 'text-yellow-800' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {badge.name}
                      </p>
                      <p className={`text-xs ${earned ? darkMode ? 'text-yellow-300' : 'text-yellow-700' : darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                        {badge.description}
                      </p>
                      {earned && (
                        <p className={`text-xs mt-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          ✓ Erhalten
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Schwimm-Badges */}
              <h4 className={`text-lg font-bold mt-6 mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🏊 Schwimm-Challenge
                <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                  {userBadges.filter(b => BADGES.find(badge => badge.id === b.id && badge.category === 'swim')).length} / {BADGES.filter(b => b.category === 'swim').length}
                </span>
              </h4>
              <div className="grid md:grid-cols-4 gap-4">
                {BADGES.filter(b => b.category === 'swim').map(badge => {
                  const earned = userBadges.find(b => b.id === badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-xl text-center transition-all ${
                        earned
                          ? darkMode
                            ? 'bg-gradient-to-br from-cyan-900 to-blue-800 border-2 border-cyan-600'
                            : 'bg-gradient-to-br from-cyan-100 to-blue-200 border-2 border-cyan-400'
                          : darkMode
                            ? 'bg-slate-700 opacity-40'
                            : 'bg-gray-100 opacity-40'
                      }`}
                    >
                      <div className="text-5xl mb-2">{badge.icon}</div>
                      <p className={`font-bold mb-1 ${earned ? darkMode ? 'text-cyan-200' : 'text-cyan-800' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {badge.name}
                      </p>
                      <p className={`text-xs ${earned ? darkMode ? 'text-cyan-300' : 'text-cyan-700' : darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                        {badge.description}
                      </p>
                      {earned && (
                        <p className={`text-xs mt-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          ✓ Erhalten
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Star className="mr-2 text-yellow-500" />
                Bestenliste
              </h3>
              <div className="space-y-2">
                {leaderboard.map((player, idx) => (
                  <div key={player.name} className={`flex items-center justify-between p-4 rounded-lg ${
                    player.name === user.name ? darkMode ? 'bg-blue-900/50 border-2 border-blue-500' : 'bg-blue-50 border-2 border-blue-500' : darkMode ? 'bg-slate-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`text-2xl font-bold ${
                        idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-600' : darkMode ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {idx + 1}.
                      </div>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{player.name}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {player.wins}S • {player.losses}N • {player.draws}U
                        </p>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{player.points}</div>
                  </div>
                ))}
              </div>
            </div>
            {userStats && userStats.categoryStats && Object.entries(userStats.categoryStats).some(([catId, stat]) => {
              const hasCategory = CATEGORIES.some(c => c.id === catId);
              return hasCategory && stat && typeof stat === 'object' && typeof stat.total === 'number';
            }) && (
              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📈 Performance nach Kategorie</h3>
                <div className="space-y-3">
                  {Object.entries(userStats.categoryStats).map(([catId, stats]) => {
                    const cat = CATEGORIES.find(c => c.id === catId);
                    if (!cat || !stats || typeof stats !== 'object' || typeof stats.total !== 'number') {
                      return null;
                    }
                    const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                    return (
                      <div key={catId} className={`border rounded-lg p-4 ${darkMode ? 'border-slate-600' : ''}`}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`${cat.color} text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl`}>
                              {cat.icon}
                            </div>
                            <div>
                              <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{cat.name}</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {stats.correct}/{stats.total} richtig
                              </p>
                            </div>
                          </div>
                          <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{percentage}%</div>
                        </div>
                        <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-2`}>
                          <div 
                            className={`h-2 rounded-full ${cat.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat View */}
        {currentView === 'chat' && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg flex flex-col h-[600px]">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold flex items-center">
                <MessageCircle className="mr-2" />
                Team-Chat
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                🛡️ Respektvoller Umgang erforderlich - Beleidigungen und unangemessene Inhalte sind verboten
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.user === user.name ? 'justify-end' : 'justify-start'}`}>
                  {msg.user !== user.name && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg flex-shrink-0">
                      {msg.avatar ? AVATARS.find(a => a.id === msg.avatar)?.emoji || msg.user.charAt(0).toUpperCase() : msg.user.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={`max-w-xs rounded-xl p-3 ${
                    msg.user === user.name
                      ? 'bg-blue-500 text-white'
                      : msg.isTrainer
                      ? 'bg-purple-100 text-purple-900'
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p className="text-xs font-bold mb-1">
                      {msg.user} {msg.isTrainer && '👨‍🏫'}
                    </p>
                    <p>{msg.text}</p>
                  </div>
                  {msg.user === user.name && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                      {user.avatar ? AVATARS.find(a => a.id === user.avatar)?.emoji || user.name.charAt(0).toUpperCase() : user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Nachricht schreiben..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
              >
                <Send size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Materials View */}
        {currentView === 'materials' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <BookOpen className="mr-2 text-blue-500" />
                Lernmaterialien
              </h2>
              {user.permissions.canUploadMaterials && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-bold mb-3">Neues Material hinzufügen</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={materialTitle}
                      onChange={(e) => setMaterialTitle(e.target.value)}
                      placeholder="Titel des Materials"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <select
                      value={materialCategory}
                      onChange={(e) => setMaterialCategory(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={addMaterial}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                    >
                      <Upload className="inline mr-2" size={18} />
                      Hinzufügen
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {materials.map(mat => {
                  const cat = CATEGORIES.find(c => c.id === mat.category);
                  return (
                    <div key={mat.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`${cat.color} text-white w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                            {cat.icon}
                          </div>
                          <div>
                            <h3 className="font-bold">{mat.title}</h3>
                            <p className="text-sm text-gray-600">{cat.name}</p>
                          </div>
                        </div>
                        <button className="text-blue-500 hover:text-blue-600">
                          <Download size={24} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {materials.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Noch keine Materialien vorhanden</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resources View */}
        {currentView === 'resources' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <span className="text-3xl mr-3">🔗</span>
                Nützliche Links & Ressourcen
              </h2>

              {/* Add Resource Form */}
              {user.role === 'admin' ? (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4 mb-6`}>
                  <h3 className={`font-bold mb-3 ${darkMode ? 'text-cyan-400' : 'text-gray-800'}`}>
                    🔒 Neue Ressource hinzufügen (Nur Admins)
                  </h3>
                  <div className="space-y-3">
                  <input
                    type="text"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    placeholder="Titel (z.B. 'Prüfungstermine NRW')"
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : ''}`}
                  />
                  
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : ''}`}
                  >
                    <option value="youtube">📺 YouTube Video</option>
                    <option value="website">🌐 Website/Link</option>
                    <option value="document">📄 Dokument</option>
                    <option value="behörde">🏛️ Behörde/Amt</option>
                    <option value="tool">🛠️ Tool/Software</option>
                  </select>

                  <input
                    type="url"
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    placeholder="URL (https://...)"
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : ''}`}
                  />

                  <textarea
                    value={resourceDescription}
                    onChange={(e) => setResourceDescription(e.target.value)}
                    placeholder="Beschreibung (optional)"
                    rows="2"
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : ''}`}
                  />

                  <button
                    onClick={addResource}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-bold"
                  >
                    <Plus className="inline mr-2" size={18} />
                    Ressource hinzufügen
                  </button>
                </div>
              </div>
              ) : (
                <div className={`${darkMode ? 'bg-yellow-900/50 border-yellow-600' : 'bg-yellow-50 border-yellow-400'} border-2 rounded-lg p-4 mb-6`}>
                  <div className="flex items-center gap-3">
                    <Shield size={32} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                    <div>
                      <p className={`font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                        🔒 Nur Administratoren können Ressourcen hinzufügen
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                        Dies dient der Sicherheit und Qualität der geteilten Inhalte.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resources List */}
              <div className="space-y-3">
                {resources.map(resource => {
                  const typeIcons = {
                    youtube: '📺',
                    website: '🌐',
                    document: '📄',
                    behörde: '🏛️',
                    tool: '🛠️'
                  };
                  
                  const typeColors = {
                    youtube: 'bg-red-500',
                    website: 'bg-blue-500',
                    document: 'bg-green-500',
                    behörde: 'bg-purple-500',
                    tool: 'bg-orange-500'
                  };

                  return (
                    <div key={resource.id} className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white'} border rounded-lg p-4 hover:shadow-md transition-shadow`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`${typeColors[resource.type] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                              {typeIcons[resource.type] || '🔗'} {resource.type ? resource.type.charAt(0).toUpperCase() + resource.type.slice(1) : 'Link'}
                            </span>
                          </div>
                          <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {resource.title}
                          </h3>
                          {resource.description && (
                            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {resource.description}
                            </p>
                          )}
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${darkMode ? 'text-cyan-400' : 'text-blue-600'} hover:underline break-all`}
                          >
                            {resource.url}
                          </a>
                          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Von {resource.addedBy || 'Unbekannt'} • {resource.time ? new Date(resource.time).toLocaleDateString() : '-'}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                            title="Öffnen"
                          >
                            <Download size={20} />
                          </a>
                          {user.role === 'admin' && (
                            <button
                              onClick={() => deleteResource(resource.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                              title="Löschen"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* YouTube Embed Preview */}
                      {resource.type === 'youtube' && resource.url.includes('youtube.com') && (
                        <div className="mt-3">
                          <iframe
                            width="100%"
                            height="315"
                            src={resource.url.replace('watch?v=', 'embed/')}
                            title={resource.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  );
                })}

                {resources.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔗</div>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Noch keine Ressourcen vorhanden
                    </p>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className={`mt-6 ${darkMode ? 'bg-cyan-900/50 border-cyan-600' : 'bg-cyan-50 border-cyan-300'} border-2 rounded-lg p-4`}>
                <h4 className={`font-bold mb-2 ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>
                  💡 Beispiele für nützliche Ressourcen:
                </h4>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• YouTube: Technik-Tutorials, Rettungsschwimmen-Videos</li>
                  <li>• Behörden: Bezirksregierung (Prüfungstermine, Anmeldeformulare)</li>
                  <li>• Websites: DLRG, DGfdB, Berufsverbände</li>
                  <li>• Dokumente: Gesetze, Verordnungen, Leitfäden</li>
                  <li>• Tools: Rechner, Simulationen, Lern-Apps</li>
                </ul>
              </div>

              {/* Security Info Box */}
              <div className={`mt-4 ${darkMode ? 'bg-red-900/50 border-red-600' : 'bg-red-50 border-red-300'} border-2 rounded-lg p-4`}>
                <h4 className={`font-bold mb-2 flex items-center ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                  <Shield className="mr-2" size={20} />
                  🛡️ Sicherheitshinweise
                </h4>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• <strong>Nur Administratoren</strong> können Ressourcen hinzufügen</li>
                  <li>• Alle Inhalte werden automatisch auf unangemessene Begriffe geprüft</li>
                  <li>• Pornografische, beleidigende oder rechtsradikale Inhalte sind verboten</li>
                  <li>• Verstöße führen zur sofortigen Sperrung des Accounts</li>
                  <li>• Bei Problemen: Sofort einen Administrator informieren</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* News View */}
        {currentView === 'news' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Bell className="mr-2 text-red-500" />
                Ankündigungen & News
              </h2>
              {user.permissions.canPostNews && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-bold mb-3">Neue Ankündigung</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      placeholder="Titel"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <textarea
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      placeholder="Inhalt"
                      rows="3"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <button
                      onClick={addNews}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                    >
                      <Plus className="inline mr-2" size={18} />
                      Veröffentlichen
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {news.map(item => (
                  <div key={item.id} className="border-l-4 border-red-500 bg-gray-50 rounded-r-lg p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      {user?.permissions.canPostNews && (
                        <button
                          onClick={() => deleteNews(item.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 transition-all"
                          title="Löschen"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{item.content}</p>
                    <p className="text-sm text-gray-500">
                      Von {item.author} • {new Date(item.time).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {news.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Keine Ankündigungen vorhanden</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Exams View */}
        {currentView === 'exams' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <ClipboardList className="mr-2 text-green-500" />
                Klasuren & Prüfungen
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-3">Klasur eintragen</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="Klasur-Titel"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <textarea
                    value={examTopics}
                    onChange={(e) => setExamTopics(e.target.value)}
                    placeholder="Themen"
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <button
                    onClick={addExam}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
                  >
                    <Calendar className="inline mr-2" size={18} />
                    Eintragen
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {exams.map(exam => (
                  <div key={exam.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{exam.title}</h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {new Date(exam.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{exam.topics}</p>
                    <p className="text-sm text-gray-500">Eingetragen von {exam.user}</p>
                  </div>
                ))}
                {exams.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Keine Klasuren eingetragen</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Exam Simulator View */}
        {currentView === 'exam-simulator' && (
          <div className="max-w-4xl mx-auto mb-4">
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-3 shadow-lg`}>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setExamSimulatorMode('theory')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    examSimulatorMode === 'theory'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : (darkMode ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                  }`}
                >
                  📝 Theorie
                </button>
                <button
                  onClick={() => setExamSimulatorMode('practical')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    examSimulatorMode === 'practical'
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                      : (darkMode ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                  }`}
                >
                  🏊 Praxis
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'exam-simulator' && examSimulatorMode === 'theory' && !userExamProgress && (
          <div className="max-w-4xl mx-auto">
            {!examSimulator ? (
              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-8 shadow-lg text-center`}>
                <div className="text-6xl mb-4">📝</div>
                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Prüfungssimulator</h2>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Teste dein Wissen mit 30 zufälligen Fragen aus allen Kategorien
                </p>
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-blue-50'} rounded-lg p-6 mb-6`}>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>30</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fragen</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>6</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Kategorien</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>50%</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Zum Bestehen</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    loadExamProgress();
                    playSound('whistle');
                  }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
                >
                  Prüfung starten 🚀
                </button>
              </div>
            ) : (
              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Frage {examQuestionIndex + 1} / 30
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {CATEGORIES.find(c => c.id === examCurrentQuestion.category)?.name}
                    </p>
                  </div>
                  <div className={`text-right ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                    <div className="text-2xl font-bold">
                      {examSimulator.answers.filter(a => a.correct).length}
                    </div>
                    <div className="text-sm">Richtig</div>
                  </div>
                </div>
                
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-xl p-6 mb-6`}>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {examCurrentQuestion.q}
                  </p>
                  {examCurrentQuestion.multi && !examAnswered && (
                    <p className="text-center text-sm text-orange-600 mt-2 font-medium">
                      ⚠️ Mehrere Antworten sind richtig - wähle alle richtigen aus!
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  {examCurrentQuestion.a.map((answer, idx) => {
                    const isMulti = examCurrentQuestion.multi;
                    const isSelected = isMulti ? examSelectedAnswers.includes(idx) : examSelectedAnswer === idx;
                    const isCorrectAnswer = isMulti
                      ? examCurrentQuestion.correct.includes(idx)
                      : idx === examCurrentQuestion.correct;

                    let buttonClass = '';
                    if (examAnswered) {
                      if (isCorrectAnswer) {
                        buttonClass = 'bg-green-500 text-white'; // Richtige Antwort grün
                      } else if (isSelected && !isCorrectAnswer) {
                        buttonClass = 'bg-red-500 text-white'; // Falsch ausgewählt rot
                      } else {
                        buttonClass = darkMode ? 'bg-slate-600 text-gray-400' : 'bg-gray-200 text-gray-500';
                      }
                    } else {
                      if (isMulti && isSelected) {
                        buttonClass = 'bg-blue-500 text-white border-2 border-blue-600';
                      } else {
                        buttonClass = darkMode
                          ? 'bg-slate-700 hover:bg-slate-600 border-2 border-slate-600 hover:border-cyan-500 text-white'
                          : 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => answerExamQuestion(idx)}
                        disabled={examAnswered}
                        className={`p-4 rounded-xl font-medium transition-all text-left ${buttonClass}`}
                      >
                        {isMulti && !examAnswered && (
                          <span className="mr-2">{isSelected ? '☑️' : '⬜'}</span>
                        )}
                        {answer}
                      </button>
                    );
                  })}
                </div>

                {/* Multi-Select Bestätigen Button */}
                {examCurrentQuestion.multi && !examAnswered && examSelectedAnswers.length > 0 && (
                  <button
                    onClick={confirmExamMultiSelectAnswer}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                  >
                    ✓ Antwort bestätigen ({examSelectedAnswers.length} ausgewählt)
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {currentView === 'exam-simulator' && examSimulatorMode === 'practical' && (() => {
          const selectedType = PRACTICAL_EXAM_TYPES.find(type => type.id === practicalExamType) || PRACTICAL_EXAM_TYPES[0];
          const disciplines = PRACTICAL_SWIM_EXAMS[practicalExamType] || [];
          const canManageAllPractical = Boolean(user?.permissions?.canViewAllStats);
          const azubiCandidates = allUsers
            .filter(account => account?.role === 'azubi')
            .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'de'));
          const selectedTargetUser = canManageAllPractical
            ? (azubiCandidates.find(account => account.id === practicalExamTargetUserId) || null)
            : user;
          const historyFiltered = practicalExamHistory
            .filter((attempt) => practicalExamHistoryTypeFilter === 'alle' || attempt.exam_type === practicalExamHistoryTypeFilter)
            .filter((attempt) => !canManageAllPractical || practicalExamHistoryUserFilter === 'all' || attempt.user_id === practicalExamHistoryUserFilter);
          const attemptTypeLabel = (typeId) => PRACTICAL_EXAM_TYPES.find(type => type.id === typeId)?.label || typeId;
          const formatAttemptDate = (value) => {
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return '-';
            return date.toLocaleString('de-DE');
          };

          const comparisonAttempts = practicalExamHistory
            .filter((attempt) => attempt.exam_type === 'zwischen' || attempt.exam_type === 'abschluss')
            .filter((attempt) => practicalExamComparisonType === 'alle' || attempt.exam_type === practicalExamComparisonType);

          const comparisonByUserId = {};
          comparisonAttempts.forEach((attempt) => {
            if (!attempt.user_id) return;
            if (!comparisonByUserId[attempt.user_id]) {
              comparisonByUserId[attempt.user_id] = {
                userId: attempt.user_id,
                userName: attempt.user_name || azubiCandidates.find(account => account.id === attempt.user_id)?.name || 'Unbekannt',
                attempts: []
              };
            }
            comparisonByUserId[attempt.user_id].attempts.push(attempt);
          });

          const comparisonRows = Object.values(comparisonByUserId)
            .map((entry) => {
              const attempts = entry.attempts
                .slice()
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
              const latest = attempts[0] || null;
              const best = attempts
                .filter(attempt => Number.isFinite(Number(attempt.average_grade)))
                .sort((a, b) => Number(a.average_grade) - Number(b.average_grade))[0] || null;
              return {
                ...entry,
                attemptsCount: attempts.length,
                latest,
                best
              };
            })
            .sort((a, b) => {
              const aBest = Number.isFinite(Number(a.best?.average_grade)) ? Number(a.best.average_grade) : Number.POSITIVE_INFINITY;
              const bBest = Number.isFinite(Number(b.best?.average_grade)) ? Number(b.best.average_grade) : Number.POSITIVE_INFINITY;
              if (aBest !== bBest) return aBest - bBest;
              return String(a.userName).localeCompare(String(b.userName), 'de');
            });

          return (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      🏊 Praktischer Prüfungssimulator
                    </h2>
                    <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Zeiten eintragen und Note direkt aus der Wertungstabelle berechnen.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {PRACTICAL_EXAM_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setPracticalExamType(type.id);
                          resetPracticalExam();
                        }}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          practicalExamType === type.id
                            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                            : (darkMode ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                        }`}
                      >
                      {type.icon} {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {canManageAllPractical && (
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Prüfung für Azubi
                    </label>
                    <select
                      value={practicalExamTargetUserId}
                      onChange={(event) => setPracticalExamTargetUserId(event.target.value)}
                      className={`w-full md:w-[360px] px-4 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    >
                      {azubiCandidates.length === 0 && <option value="">Keine Azubis verfügbar</option>}
                      {azubiCandidates.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className={`${darkMode ? 'bg-slate-700' : 'bg-cyan-50'} rounded-lg p-4 mb-4`}>
                  <div className={`text-sm font-medium ${darkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>
                    Aktive Prüfung: {selectedType.label}
                  </div>
                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Format: Zeit als mm:ss (z. B. 01:42) oder in Sekunden.
                  </div>
                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Teilnehmer: {selectedTargetUser?.name || user?.name || 'Unbekannt'}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {disciplines.map((discipline) => (
                    <div
                      key={discipline.id}
                      className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} border rounded-xl p-4`}
                    >
                      <div className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {discipline.name}
                      </div>
                      <input
                        type="text"
                        value={practicalExamInputs[discipline.id] || ''}
                        onChange={(event) => updatePracticalExamInput(discipline.id, event.target.value)}
                        placeholder={discipline.inputPlaceholder || 'Wert eingeben'}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                        }`}
                      />
                      {discipline.inputType === 'time_distance' && (
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={practicalExamInputs[`${discipline.id}_distance`] || ''}
                          onChange={(event) => updatePracticalExamInput(`${discipline.id}_distance`, event.target.value)}
                          placeholder={discipline.distancePlaceholder || 'Strecke in m'}
                          className={`w-full mt-2 px-4 py-2 rounded-lg border ${
                            darkMode
                              ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                          }`}
                        />
                      )}
                      <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {discipline.inputType === 'time' && 'Zeit-Eingabe'}
                        {discipline.inputType === 'grade' && 'Direkte Note'}
                        {discipline.inputType === 'time_distance' && 'Zeit + Strecke'}
                        {discipline.required === false ? ' (optional)' : ' (pflicht)'}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={evaluatePracticalExam}
                    className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
                  >
                    Note berechnen
                  </button>
                  <button
                    onClick={resetPracticalExam}
                    className={`${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} px-6 py-3 rounded-lg font-bold transition-all`}
                  >
                    Eingaben zurücksetzen
                  </button>
                </div>
              </div>

              {practicalExamResult && (
                <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
                  <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Ergebnis {selectedType.label}
                  </h3>
                  <div className={`mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Azubi: <strong>{practicalExamResult.userName || selectedTargetUser?.name || '-'}</strong>
                  </div>
                  <div className="space-y-2">
                    {practicalExamResult.rows.map((row) => (
                      <div
                        key={row.id}
                        className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-3 flex items-center justify-between gap-3`}
                      >
                        <div>
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{row.name}</div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Wert: {row.displayValue}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                            {row.grade ? formatGradeLabel(row.grade, row.noteLabel) : 'Keine Note'}
                          </div>
                          {row.points !== null && row.points !== undefined && (
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {row.points} Punkte
                            </div>
                          )}
                          {row.gradingMissing && (
                            <div className={`text-xs ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                              Wertungstabelle fehlt
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-5 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} grid md:grid-cols-3 gap-3`}>
                    <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3`}>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gewertete Disziplinen</div>
                      <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{practicalExamResult.gradedCount}</div>
                    </div>
                    <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3`}>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Durchschnittsnote</div>
                      <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {practicalExamResult.averageGrade !== null ? practicalExamResult.averageGrade.toFixed(2) : '-'}
                      </div>
                    </div>
                    <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3`}>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</div>
                      <div className={`text-xl font-bold ${
                        practicalExamResult.passed === null
                          ? (darkMode ? 'text-gray-300' : 'text-gray-700')
                          : practicalExamResult.passed
                            ? (darkMode ? 'text-green-400' : 'text-green-600')
                            : (darkMode ? 'text-red-400' : 'text-red-600')
                      }`}>
                        {practicalExamResult.passed === null
                          ? 'offen'
                          : practicalExamResult.passed ? 'bestanden' : 'nicht bestanden'}
                      </div>
                    </div>
                  </div>

                  {practicalExamResult.missingTables > 0 && (
                    <div className={`mt-4 text-sm ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                      Hinweis: {practicalExamResult.missingTables} Disziplin(en) haben noch keine Wertungstabelle.
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => exportPracticalExamToPdf()}
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      📄 Als PDF exportieren
                    </button>
                    <button
                      onClick={() => void loadPracticalExamHistory()}
                      className={`${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} px-4 py-2 rounded-lg font-medium`}
                    >
                      Historie aktualisieren
                    </button>
                  </div>
                </div>
              )}

              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    🗂️ Versuchshistorie
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={practicalExamHistoryTypeFilter}
                      onChange={(event) => setPracticalExamHistoryTypeFilter(event.target.value)}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        darkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    >
                      <option value="alle">Alle Prüfungen</option>
                      {PRACTICAL_EXAM_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                    {canManageAllPractical && (
                      <select
                        value={practicalExamHistoryUserFilter}
                        onChange={(event) => setPracticalExamHistoryUserFilter(event.target.value)}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          darkMode
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      >
                        <option value="all">Alle Azubis</option>
                        {azubiCandidates.map((account) => (
                          <option key={account.id} value={account.id}>{account.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {practicalExamHistoryLoading ? (
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Historie wird geladen...
                  </div>
                ) : historyFiltered.length === 0 ? (
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Noch keine gespeicherten Versuche vorhanden.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {historyFiltered.map((attempt) => (
                      <div
                        key={attempt.id}
                        className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3`}
                      >
                        <div className="flex flex-wrap justify-between gap-3">
                          <div>
                            <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {attempt.user_name} • {attemptTypeLabel(attempt.exam_type)}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {formatAttemptDate(attempt.created_at)} {attempt.source === 'local' ? '• lokal gespeichert' : ''}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                              {Number.isFinite(Number(attempt.average_grade)) ? `Ø ${Number(attempt.average_grade).toFixed(2)}` : 'Ø -'}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {attempt.passed === null ? 'offen' : attempt.passed ? 'bestanden' : 'nicht bestanden'}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 space-y-1">
                          {(attempt.rows || []).map((row) => (
                            <div key={`${attempt.id}-${row.id}`} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {row.name}: {row.displayValue} • {row.grade ? formatGradeLabel(row.grade, row.noteLabel) : 'Keine Note'}
                            </div>
                          ))}
                        </div>

                        <div className="mt-3">
                          <button
                            onClick={() => exportPracticalExamToPdf(attempt)}
                            className={`${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} px-3 py-1.5 rounded-lg text-sm`}
                          >
                            📄 PDF exportieren
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {canManageAllPractical && (
                <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      🧭 Trainer-Vergleich (alle Azubis)
                    </h3>
                    <select
                      value={practicalExamComparisonType}
                      onChange={(event) => setPracticalExamComparisonType(event.target.value)}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        darkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    >
                      <option value="alle">Alle Prüfungen</option>
                      {PRACTICAL_EXAM_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {comparisonRows.length === 0 ? (
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Noch keine Vergleichsdaten vorhanden.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {comparisonRows.map((row, index) => (
                        <div
                          key={row.userId}
                          className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-3 flex flex-wrap items-center justify-between gap-3`}
                        >
                          <div>
                            <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {index + 1}. {row.userName}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {row.attemptsCount} Versuch(e)
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Beste Note: {Number.isFinite(Number(row.best?.average_grade)) ? Number(row.best.average_grade).toFixed(2) : '-'}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Letzter Versuch: {Number.isFinite(Number(row.latest?.average_grade)) ? Number(row.latest.average_grade).toFixed(2) : '-'} ({formatAttemptDate(row.latest?.created_at)})
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {currentView === 'exam-simulator' && examSimulatorMode === 'theory' && userExamProgress && (
          <div className="max-w-4xl mx-auto">
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-8 shadow-lg text-center`}>
              <div className="text-6xl mb-4">{userExamProgress.passed ? '🎉' : '📚'}</div>
              <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {userExamProgress.passed ? 'Bestanden!' : 'Nicht bestanden'}
              </h2>
              <div className={`${userExamProgress.passed ? 'bg-green-500' : 'bg-red-500'} text-white rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6`}>
                <div className="text-4xl font-bold">{userExamProgress.percentage}%</div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-4`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {userExamProgress.correct}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Richtig</div>
                </div>
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-4`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {userExamProgress.total - userExamProgress.correct}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Falsch</div>
                </div>
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-4`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                    {Math.round(userExamProgress.timeMs / 60000)}min
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dauer</div>
                </div>
              </div>
              <button
                onClick={resetExam}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg"
              >
                Neue Prüfung starten
              </button>
            </div>
          </div>
        )}

        {/* Flashcards View */}
        {currentView === 'flashcards' && (
          <div className="max-w-4xl mx-auto">
            {/* Add Flashcard Form */}
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                ➕ Neue Karteikarte erstellen
              </h3>
              <div className="space-y-3">
                <select
                  value={newFlashcardCategory}
                  onChange={(e) => setNewFlashcardCategory(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white'
                  }`}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Vorderseite (Frage):
                  </label>
                  <textarea
                    value={newFlashcardFront}
                    onChange={(e) => setNewFlashcardFront(e.target.value)}
                    placeholder="z.B. Was ist der optimale pH-Wert?"
                    rows="2"
                    className={`w-full px-4 py-3 border rounded-lg ${
                      darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Rückseite (Antwort):
                  </label>
                  <textarea
                    value={newFlashcardBack}
                    onChange={(e) => setNewFlashcardBack(e.target.value)}
                    placeholder="z.B. 7,0 - 7,4 (neutral bis leicht basisch)"
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg ${
                      darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white'
                    }`}
                  />
                </div>

                <button
                  onClick={async () => {
                    if (!newFlashcardFront.trim() || !newFlashcardBack.trim()) {
                      alert('Bitte Vorder- und Rückseite ausfüllen!');
                      return;
                    }

                    // Content moderation
                    if (!moderateContent(newFlashcardFront, 'Vorderseite')) {
                      return;
                    }
                    if (!moderateContent(newFlashcardBack, 'Rückseite')) {
                      return;
                    }

                    try {
                      const isApproved = user.permissions.canApproveQuestions;
                      const { data, error } = await supabase
                        .from('flashcards')
                        .insert([{
                          user_id: user.id,
                          category: newFlashcardCategory,
                          question: newFlashcardFront.trim(),
                          answer: newFlashcardBack.trim(),
                          approved: isApproved
                        }])
                        .select()
                        .single();

                      if (error) throw error;

                      const flashcard = {
                        id: data.id,
                        front: data.question,
                        back: data.answer,
                        category: data.category,
                        approved: data.approved,
                        userId: data.user_id
                      };

                      if (flashcard.approved) {
                        setUserFlashcards([...userFlashcards, flashcard]);
                        alert('Karteikarte hinzugefügt! 🎴');
                      } else {
                        setPendingFlashcards([...pendingFlashcards, flashcard]);
                        alert('Karteikarte eingereicht! Sie wird nach Prüfung freigeschaltet. ⏳');
                      }

                      void queueXpAward('flashcardCreation', XP_REWARDS.FLASHCARD_CREATE, {
                        eventKey: `flashcard_create_${data.id}`,
                        reason: 'Karteikarte erstellt',
                        showXpToast: true
                      });

                      setNewFlashcardFront('');
                      setNewFlashcardBack('');
                      playSound('splash');
                    } catch (error) {
                      console.error('Flashcard error:', error);
                      alert('Fehler beim Erstellen der Karteikarte');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
                >
                  <Plus className="inline mr-2" size={20} />
                  Karteikarte erstellen
                </button>

                {!user.permissions.canApproveQuestions && (
                  <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ℹ️ Deine Karteikarte wird nach Prüfung durch einen Trainer freigeschaltet
                  </p>
                )}
              </div>
            </div>

            {/* Flashcard Display */}
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  🎴 Karteikarten
                </h2>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {FLASHCARD_CONTENT[newQuestionCategory]?.length || 0} Standard + {userFlashcards.filter(fc => fc.category === newQuestionCategory).length} Custom
                </div>
              </div>

              {/* Lernmodus Umschalter */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    setSpacedRepetitionMode(false);
                    loadFlashcards();
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                    !spacedRepetitionMode
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📚 Alle Karten
                </button>
                <button
                  onClick={() => {
                    setSpacedRepetitionMode(true);
                    const due = loadDueCards(newQuestionCategory);
                    if (due.length > 0) {
                      setFlashcards(due);
                      setFlashcardIndex(0);
                      setCurrentFlashcard(due[0]);
                      setShowFlashcardAnswer(false);
                    }
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    spacedRepetitionMode
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🧠 Spaced Repetition
                  {getDueCardCount(newQuestionCategory) > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {getDueCardCount(newQuestionCategory)}
                    </span>
                  )}
                </button>
              </div>

              {/* Spaced Repetition Info */}
              {spacedRepetitionMode && (
                <div className={`${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-lg p-4 mb-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-bold ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                      🧠 Spaced Repetition Modus
                    </h4>
                    <span className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {dueCards.length} Karten fällig
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                    Beantworte mit "Gewusst" oder "Nicht gewusst". Karten die du nicht wusstest kommen früher wieder.
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map(level => (
                      <div key={level} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-full ${getLevelColor(level)}`}></div>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {getLevelLabel(level)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kategorien mit fälligen Karten Übersicht */}
              {spacedRepetitionMode && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {CATEGORIES.map(cat => {
                    const dueCount = getDueCardCount(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setNewQuestionCategory(cat.id);
                          const due = loadDueCards(cat.id);
                          if (due.length > 0) {
                            setFlashcards(due);
                            setFlashcardIndex(0);
                            setCurrentFlashcard(due[0]);
                            setShowFlashcardAnswer(false);
                          } else {
                            setFlashcards([]);
                            setCurrentFlashcard(null);
                          }
                        }}
                        className={`p-3 rounded-lg text-left transition-all ${
                          newQuestionCategory === cat.id
                            ? `${cat.color} text-white`
                            : darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{cat.icon}</span>
                          {dueCount > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              newQuestionCategory === cat.id
                                ? 'bg-white/30 text-white'
                                : 'bg-red-500 text-white'
                            }`}>
                              {dueCount}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-1 truncate ${
                          newQuestionCategory === cat.id
                            ? 'text-white/80'
                            : darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {cat.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {!spacedRepetitionMode && (
                <select
                  value={newQuestionCategory}
                  onChange={(e) => {
                    setNewQuestionCategory(e.target.value);
                    const hardcodedCards = FLASHCARD_CONTENT[e.target.value] || [];
                    const userCards = userFlashcards.filter(fc => fc.category === e.target.value);
                    const allCards = [...hardcodedCards, ...userCards];
                    setFlashcards(allCards);
                    setFlashcardIndex(0);
                    setCurrentFlashcard(allCards[0]);
                    setShowFlashcardAnswer(false);
                  }}
                  className={`w-full px-4 py-3 border rounded-lg mb-6 ${
                    darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white'
                  }`}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              )}
            </div>

            {currentFlashcard && flashcards.length > 0 && (
              <div className="perspective-1000">
                {/* Spaced Repetition Level Badge */}
                {spacedRepetitionMode && currentFlashcard.spacedData && (
                  <div className="flex justify-center mb-4">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                      darkMode ? 'bg-slate-700' : 'bg-gray-100'
                    }`}>
                      <div className={`w-4 h-4 rounded-full ${getLevelColor(currentFlashcard.spacedData.level)}`}></div>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {getLevelLabel(currentFlashcard.spacedData.level)}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        • {currentFlashcard.spacedData.reviewCount || 0}x wiederholt
                      </span>
                    </div>
                  </div>
                )}

                <div
                  onClick={() => {
                    setShowFlashcardAnswer(!showFlashcardAnswer);
                    playSound('bubble');
                  }}
                  className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-12 shadow-2xl cursor-pointer transform transition-all hover:scale-105 min-h-[300px] flex items-center justify-center ${
                    spacedRepetitionMode && currentFlashcard.spacedData
                      ? `border-4 ${getLevelColor(currentFlashcard.spacedData.level).replace('bg-', 'border-')}`
                      : ''
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-sm font-bold mb-4 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                      {showFlashcardAnswer ? 'ANTWORT' : 'FRAGE'}
                    </div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {showFlashcardAnswer ? currentFlashcard.back : currentFlashcard.front}
                    </p>
                    <p className={`text-sm mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {showFlashcardAnswer ? '' : 'Klicken zum Umdrehen'}
                    </p>
                  </div>
                </div>

                {/* Spaced Repetition Buttons */}
                {spacedRepetitionMode && showFlashcardAnswer && (
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => {
                        const newLevel = updateCardSpacedData(currentFlashcard, newQuestionCategory, false);
                        playSound('wrong');

                        // Nächste Karte oder fertig
                        if (flashcardIndex < flashcards.length - 1) {
                          const nextIdx = flashcardIndex + 1;
                          setFlashcardIndex(nextIdx);
                          setCurrentFlashcard(flashcards[nextIdx]);
                          setShowFlashcardAnswer(false);
                        } else {
                          // Alle Karten durchgearbeitet
                          const remaining = loadDueCards(newQuestionCategory);
                          if (remaining.length > 0) {
                            setFlashcards(remaining);
                            setFlashcardIndex(0);
                            setCurrentFlashcard(remaining[0]);
                            setShowFlashcardAnswer(false);
                          } else {
                            setCurrentFlashcard(null);
                            setFlashcards([]);
                          }
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg text-lg"
                    >
                      ❌ Nicht gewusst
                    </button>
                    <button
                      onClick={() => {
                        const newLevel = updateCardSpacedData(currentFlashcard, newQuestionCategory, true);
                        playSound('correct');

                        // Nächste Karte oder fertig
                        if (flashcardIndex < flashcards.length - 1) {
                          const nextIdx = flashcardIndex + 1;
                          setFlashcardIndex(nextIdx);
                          setCurrentFlashcard(flashcards[nextIdx]);
                          setShowFlashcardAnswer(false);
                        } else {
                          // Alle Karten durchgearbeitet
                          const remaining = loadDueCards(newQuestionCategory);
                          if (remaining.length > 0) {
                            setFlashcards(remaining);
                            setFlashcardIndex(0);
                            setCurrentFlashcard(remaining[0]);
                            setShowFlashcardAnswer(false);
                          } else {
                            setCurrentFlashcard(null);
                            setFlashcards([]);
                          }
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg text-lg"
                    >
                      ✅ Gewusst
                    </button>
                  </div>
                )}

                {/* Standard Navigation (nicht im Spaced Repetition Modus oder Antwort noch nicht gezeigt) */}
                {(!spacedRepetitionMode || !showFlashcardAnswer) && (
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={() => {
                        if (flashcardIndex > 0) {
                          const prevIdx = flashcardIndex - 1;
                          setFlashcardIndex(prevIdx);
                          setCurrentFlashcard(flashcards[prevIdx]);
                          setShowFlashcardAnswer(false);
                          playSound('splash');
                        }
                      }}
                      disabled={flashcardIndex === 0}
                      className={`px-6 py-3 rounded-lg font-bold ${
                        flashcardIndex === 0
                          ? darkMode ? 'bg-slate-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                      }`}
                    >
                      ← Zurück
                    </button>
                    <div className={darkMode ? 'text-white' : 'text-gray-800'}>
                      <span className="font-bold">{flashcardIndex + 1}</span> / {flashcards.length}
                    </div>
                    <button
                      onClick={() => {
                        if (flashcardIndex < flashcards.length - 1) {
                          const nextIdx = flashcardIndex + 1;
                          setFlashcardIndex(nextIdx);
                          setCurrentFlashcard(flashcards[nextIdx]);
                          setShowFlashcardAnswer(false);
                          playSound('splash');
                        }
                      }}
                      disabled={flashcardIndex === flashcards.length - 1}
                      className={`px-6 py-3 rounded-lg font-bold ${
                        flashcardIndex === flashcards.length - 1
                          ? darkMode ? 'bg-slate-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                      }`}
                    >
                      Weiter →
                    </button>
                  </div>
                )}
              </div>
            )}

            {(!currentFlashcard || flashcards.length === 0) && (
              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-12 text-center`}>
                <div className="text-6xl mb-4">{spacedRepetitionMode ? '🎉' : '🎴'}</div>
                <p className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {spacedRepetitionMode ? 'Alle Karten wiederholt!' : 'Keine Karteikarten'}
                </p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {spacedRepetitionMode
                    ? 'Super! Du hast alle fälligen Karten in dieser Kategorie durchgearbeitet. Komm später wieder!'
                    : 'Noch keine Karteikarten in dieser Kategorie. Erstelle die erste!'}
                </p>
                {spacedRepetitionMode && (
                  <button
                    onClick={() => {
                      setSpacedRepetitionMode(false);
                      loadFlashcards();
                    }}
                    className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-bold"
                  >
                    📚 Alle Karten anzeigen
                  </button>
                )}
              </div>
            )}

            {/* Pending Flashcards for Trainers/Admins */}
            {user.permissions.canApproveQuestions && (
              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg mt-6`}>
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ⏳ Wartende Karteikarten genehmigen
                </h3>
                {pendingFlashcards.length > 0 ? (
                  <div className="space-y-3">
                    {pendingFlashcards.map(fc => {
                      const cat = CATEGORIES.find(c => c.id === fc.category);
                      return (
                        <div key={fc.id} className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-yellow-50 border-yellow-300'} border-2 rounded-lg p-4`}>
                          <div className="flex justify-between items-start mb-3">
                            <span className={`${cat.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                              {cat.icon} {cat.name}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => approveFlashcard(fc.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                              >
                                <Check size={16} className="inline" /> Genehmigen
                              </button>
                              <button
                                onClick={() => deleteFlashcard(fc.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                              >
                                <X size={16} className="inline" /> Ablehnen
                              </button>
                            </div>
                          </div>
                          <div className={`${darkMode ? 'bg-slate-600' : 'bg-white'} rounded-lg p-3 mb-2`}>
                            <p className={`text-sm font-bold mb-1 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>Vorderseite:</p>
                            <p className={darkMode ? 'text-white' : 'text-gray-800'}>{fc.front}</p>
                          </div>
                          <div className={`${darkMode ? 'bg-slate-600' : 'bg-white'} rounded-lg p-3`}>
                            <p className={`text-sm font-bold mb-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Rückseite:</p>
                            <p className={darkMode ? 'text-white' : 'text-gray-800'}>{fc.back}</p>
                          </div>
                          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                            Von {fc.createdBy} • {new Date(fc.time).toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Keine wartenden Karteikarten
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Calculator View */}
        {currentView === 'calculator' && (
          <div className="max-w-4xl mx-auto">
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🧮 Praxis-Rechner
              </h2>
              
              <div className="grid md:grid-cols-5 gap-4 mb-6">
                <button
                  onClick={() => {
                    setCalculatorType('ph');
                    setCalculatorInputs({});
                    setCalculatorResult(null);
                  }}
                  className={`p-4 rounded-xl font-bold ${
                    calculatorType === 'ph'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  💧 pH-Wert
                </button>
                <button
                  onClick={() => {
                    setCalculatorType('chlorine');
                    setCalculatorInputs({});
                    setCalculatorResult(null);
                  }}
                  className={`p-4 rounded-xl font-bold ${
                    calculatorType === 'chlorine'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  ⚗️ Chlor-Bedarf
                </button>
                <button
                  onClick={() => {
                    setCalculatorType('volume');
                    setCalculatorInputs({});
                    setCalculatorResult(null);
                  }}
                  className={`p-4 rounded-xl font-bold ${
                    calculatorType === 'volume'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  📏 Beckenvolumen
                </button>
                <button
                  onClick={() => {
                    setCalculatorType('chemicals');
                    setCalculatorInputs({});
                    setCalculatorResult(null);
                  }}
                  className={`p-4 rounded-xl font-bold ${
                    calculatorType === 'chemicals'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  🧪 Chemikalien
                </button>
                <button
                  onClick={() => {
                    setCalculatorType('periodic');
                    setCalculatorInputs({});
                    setCalculatorResult(null);
                  }}
                  className={`p-4 rounded-xl font-bold ${
                    calculatorType === 'periodic'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  ⚛️ Periodensystem
                </button>
              </div>

              {calculatorType === 'ph' && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-blue-50'} rounded-xl p-6 mb-6`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-cyan-400' : 'text-blue-800'}`}>pH-Wert / Säurekapazität berechnen</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Chlor-Wert (mg/l)"
                      value={calculatorInputs.chlorine || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, chlorine: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <input
                      type="number"
                      placeholder="Alkalinität (mg/l)"
                      value={calculatorInputs.alkalinity || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, alkalinity: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Säurekapazität (mmol/l) - Optional"
                      value={calculatorInputs.acidCapacity || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, acidCapacity: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <div className={`${darkMode ? 'bg-slate-600' : 'bg-blue-100'} rounded-lg p-3 text-sm`}>
                      <p className={darkMode ? 'text-cyan-300' : 'text-blue-800'}>
                        💡 <strong>Säurekapazität:</strong> Maß für die Pufferfähigkeit des Wassers. Optimal: 2,0-3,0 mmol/l
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {calculatorType === 'chlorine' && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-green-50'} rounded-xl p-6 mb-6`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>Chlor-Bedarf berechnen</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Beckenvolumen (m³)"
                      value={calculatorInputs.poolVolume || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, poolVolume: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Aktueller Chlor-Wert (mg/l)"
                      value={calculatorInputs.currentChlorine || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, currentChlorine: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Ziel-Chlor-Wert (mg/l)"
                      value={calculatorInputs.targetChlorine || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, targetChlorine: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                  </div>
                </div>
              )}

              {calculatorType === 'volume' && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-purple-50'} rounded-xl p-6 mb-6`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>Beckenvolumen berechnen</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Länge (m)"
                      value={calculatorInputs.length || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, length: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Breite (m)"
                      value={calculatorInputs.width || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, width: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Tiefe (m)"
                      value={calculatorInputs.depth || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, depth: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                  </div>
                </div>
              )}

              {calculatorType === 'chemicals' && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-orange-50'} rounded-xl p-6 mb-6`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-orange-400' : 'text-orange-800'}`}>🧪 Chemische Zusammensetzungen</h3>
                  <select
                    value={selectedChemical?.name || ''}
                    onChange={(e) => {
                      const chem = POOL_CHEMICALS.find(c => c.name === e.target.value);
                      setSelectedChemical(chem);
                      playSound('bubble');
                    }}
                    className={`w-full px-4 py-3 rounded-lg mb-4 ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                  >
                    <option value="">-- Chemikalie wählen --</option>
                    {POOL_CHEMICALS.map(chem => (
                      <option key={chem.name} value={chem.name}>{chem.name}</option>
                    ))}
                  </select>
                  
                  {selectedChemical && (
                    <div className={`${darkMode ? 'bg-slate-600' : 'bg-white'} rounded-lg p-6 border-2 ${darkMode ? 'border-orange-500' : 'border-orange-400'}`}>
                      <div className="text-center mb-4">
                        <h4 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {selectedChemical.name}
                        </h4>
                        <div className={`text-5xl font-bold mb-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                          {selectedChemical.formula}
                        </div>
                      </div>
                      <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4`}>
                        <p className={`font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                          Verwendung:
                        </p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {selectedChemical.use}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {calculatorType === 'periodic' && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-indigo-50'} rounded-xl p-6 mb-6`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>⚛️ Periodensystem der Elemente</h3>
                  
                  <div className="grid grid-cols-18 gap-1 mb-6 overflow-x-auto">
                    {PERIODIC_TABLE.map(element => {
                      const colors = {
                        'alkali': 'bg-red-500',
                        'alkaline-earth': 'bg-orange-500',
                        'transition': 'bg-yellow-500',
                        'post-transition': 'bg-green-500',
                        'metalloid': 'bg-teal-500',
                        'nonmetal': 'bg-blue-500',
                        'halogen': 'bg-purple-500',
                        'noble-gas': 'bg-pink-500',
                        'lanthanide': 'bg-cyan-500',
                        'actinide': 'bg-lime-500'
                      };
                      
                      const bgColor = colors[element.category] || 'bg-gray-400';
                      
                      return (
                        <button
                          key={element.number}
                          onClick={() => {
                            setSelectedElement(element);
                            playSound('bubble');
                          }}
                          className={`${bgColor} hover:scale-110 transition-transform rounded p-1 text-white text-center cursor-pointer ${
                            selectedElement?.number === element.number ? 'ring-2 ring-white scale-110' : ''
                          }`}
                          style={{
                            gridColumn: element.group,
                            gridRow: element.period,
                            minWidth: '40px'
                          }}
                        >
                          <div className="text-[8px] font-bold">{element.number}</div>
                          <div className="text-xs font-bold">{element.symbol}</div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedElement && (
                    <div className={`${darkMode ? 'bg-slate-600 border-indigo-500' : 'bg-white border-indigo-400'} rounded-lg p-6 border-2`}>
                      <div className="text-center mb-4">
                        <div className={`text-6xl font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                          {selectedElement.symbol}
                        </div>
                        <h4 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {selectedElement.name}
                        </h4>
                      </div>
                      <div className={`grid grid-cols-2 gap-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4`}>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ordnungszahl</p>
                          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedElement.number}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Atommasse</p>
                          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedElement.mass} u</p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gruppe</p>
                          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedElement.group}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Periode</p>
                          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedElement.period}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Alkalimetalle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Erdalkalimetalle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Übergangsmetalle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nichtmetalle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Halogene</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-pink-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Edelgase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-teal-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Halbmetalle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lanthanoide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-lime-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actinoide</span>
                    </div>
                  </div>
                </div>
              )}

              {calculatorType !== 'chemicals' && calculatorType !== 'periodic' && (
                <button
                  onClick={handleCalculation}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg mb-6"
                >
                  Berechnen 🧮
                </button>
              )}

              {calculatorResult && (
                <div className={`${darkMode ? 'bg-slate-700 border-cyan-600' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300'} border-2 rounded-xl p-6`}>
                  <div className={`text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <div className="text-sm font-bold mb-2">ERGEBNIS</div>
                    <div className="text-4xl font-bold mb-2">{calculatorResult.result}</div>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-600' : 'bg-white'} rounded-lg p-4 mb-4`}>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <strong>Berechnung:</strong> {calculatorResult.explanation}
                    </p>
                    {calculatorResult.details && (
                      <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {calculatorResult.details}
                      </p>
                    )}
                    <p className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                      💡 {calculatorResult.recommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trainer Dashboard */}
        {currentView === 'trainer-dashboard' && user.permissions.canViewAllStats && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gradient-to-r from-indigo-900 to-purple-900' : 'bg-gradient-to-r from-indigo-500 to-purple-500'} text-white rounded-xl p-8 text-center`}>
              <h2 className="text-3xl font-bold mb-2">👨‍🏫 Azubi-Übersicht</h2>
              <p className="opacity-90">Fortschritte und Leistungen deiner Azubis</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {allUsers.filter(u => u.role === 'azubi').map(azubi => {
                const rowStats = statsByUserId[azubi.id] || null;
                const leaderboardEntry = leaderboard.find(
                  player => namesMatch(player.name, azubi.name)
                );
                const fallbackFinishedGames = allGames.filter(g =>
                  isFinishedGameStatus(g.status) &&
                  (namesMatch(g.player1, azubi.name) || namesMatch(g.player2, azubi.name))
                );
                const fallbackWins = fallbackFinishedGames.filter(g => {
                  let winner = g.winner || null;
                  if (!winner && g.player1Score > g.player2Score) winner = g.player1;
                  else if (!winner && g.player2Score > g.player1Score) winner = g.player2;
                  return namesMatch(winner, azubi.name);
                }).length;
                const fallbackTotal = fallbackFinishedGames.length;

                // Use the same source as the visible quiz leaderboard first.
                const hasLeaderboardStats = !!leaderboardEntry;
                const leaderboardWins = hasLeaderboardStats ? (leaderboardEntry.wins || 0) : 0;
                const leaderboardTotal = hasLeaderboardStats
                  ? ((leaderboardEntry.wins || 0) + (leaderboardEntry.losses || 0) + (leaderboardEntry.draws || 0))
                  : 0;

                // If stored stats are still empty but games exist, use live game fallback.
                const useFallback = (rowStats?.total || 0) === 0 && fallbackTotal > 0;
                const wins = hasLeaderboardStats
                  ? leaderboardWins
                  : (useFallback ? fallbackWins : (rowStats?.wins || 0));
                const total = hasLeaderboardStats
                  ? leaderboardTotal
                  : (useFallback ? fallbackTotal : (rowStats?.total || 0));
                const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

                return (
                  <div key={azubi.email} className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                        🎓
                      </div>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubi.name}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Azubi</p>
                      </div>
                    </div>
                    
                    <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-4 mb-4`}>
                      <div className="flex justify-between mb-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Siegesrate</span>
                        <span className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{winRate}%</span>
                      </div>
                      <div className={`w-full ${darkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded-full h-2`}>
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${winRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3 text-center`}>
                        <div className={`text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{wins}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quiz-Siege</div>
                      </div>
                      <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3 text-center`}>
                        <div className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{total}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quiz gesamt</div>
                      </div>
                    </div>

                    {azubi.trainingEnd && (
                      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Ausbildungsende: {new Date(azubi.trainingEnd).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {allUsers.filter(u => u.role === 'azubi').length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Noch keine Azubis registriert
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Questions View */}
        {currentView === 'questions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Brain className="mr-2 text-purple-500" />
                Fragen einreichen
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-3">Neue Quizfrage vorschlagen</h3>
                <div className="space-y-3">
                  <textarea
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Deine Frage..."
                    rows="2"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <select
                    value={newQuestionCategory}
                    onChange={(e) => setNewQuestionCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {[0, 1, 2, 3].map(i => (
                    <input
                      key={i}
                      type="text"
                      value={newQuestionAnswers[i]}
                      onChange={(e) => {
                        const newAnswers = [...newQuestionAnswers];
                        newAnswers[i] = e.target.value;
                        setNewQuestionAnswers(newAnswers);
                      }}
                      placeholder={`Antwort ${i + 1} ${i === newQuestionCorrect ? '(richtig)' : ''}`}
                      className={`w-full px-4 py-2 border rounded-lg ${i === newQuestionCorrect ? 'border-green-500' : ''}`}
                    />
                  ))}
                  <select
                    value={newQuestionCorrect}
                    onChange={(e) => setNewQuestionCorrect(Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {[0, 1, 2, 3].map(i => (
                      <option key={i} value={i}>Richtige Antwort: {i + 1}</option>
                    ))}
                  </select>
                  <button
                    onClick={submitQuestion}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
                  >
                    <Plus className="inline mr-2" size={18} />
                    Frage einreichen
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-lg">Eingereichte Fragen</h3>
                {submittedQuestions.map(q => {
                  const cat = CATEGORIES.find(c => c.id === q.category);
                  return (
                    <div key={q.id} className={`border rounded-lg p-4 ${q.approved ? 'bg-green-50 border-green-500' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`${cat.color} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                              {cat.name}
                            </span>
                            {q.approved && (
                              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                <Check size={14} className="mr-1" />
                                Genehmigt
                              </span>
                            )}
                          </div>
                          <p className="font-bold mb-2">{q.text}</p>
                          <ul className="text-sm space-y-1">
                            {q.answers.map((a, i) => (
                              <li key={i} className={i === q.correct ? 'text-green-600 font-medium' : ''}>
                                {i + 1}. {a}
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-gray-500 mt-2">Von {q.submittedBy}</p>
                        </div>
                        {user.permissions.canApproveQuestions && !q.approved && (
                          <button
                            onClick={() => approveQuestion(q.id)}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg ml-4"
                          >
                            <Check size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {submittedQuestions.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Noch keine Fragen eingereicht</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Kontrollkarte Berufsschule View */}
        {currentView === 'school-card' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🎓 Kontrollkarte Berufsschule
                {selectedSchoolCardUser && (
                  <span className="ml-3 text-lg font-normal text-cyan-500">
                    - {selectedSchoolCardUser.name}
                  </span>
                )}
              </h2>

              {/* Azubi-Auswahl für berechtigte User */}
              {canViewAllSchoolCards() && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-purple-50 to-pink-50'} rounded-xl p-4 mb-6`}>
                  <h3 className={`font-bold mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                    👀 Azubi-Kontrollkarten einsehen
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedSchoolCardUser(null);
                        loadSchoolAttendance(user.id);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        !selectedSchoolCardUser
                          ? 'bg-cyan-500 text-white'
                          : (darkMode ? 'bg-slate-600 text-gray-300 hover:bg-slate-500' : 'bg-white text-gray-700 hover:bg-gray-100')
                      }`}
                    >
                      📝 Meine Karte
                    </button>
                    {allAzubisForSchoolCard.map(azubi => (
                      <button
                        key={azubi.id}
                        onClick={() => {
                          setSelectedSchoolCardUser(azubi);
                          loadSchoolAttendance(azubi.id);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedSchoolCardUser?.id === azubi.id
                            ? 'bg-purple-500 text-white'
                            : (darkMode ? 'bg-slate-600 text-gray-300 hover:bg-slate-500' : 'bg-white text-gray-700 hover:bg-gray-100')
                        }`}
                      >
                        👨‍🎓 {azubi.name}
                      </button>
                    ))}
                  </div>
                  {allAzubisForSchoolCard.length === 0 && (
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Keine Azubis vorhanden.
                    </p>
                  )}
                </div>
              )}

              {/* Neuer Eintrag Form - nur für eigene Karte */}
              {!selectedSchoolCardUser && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50'} rounded-xl p-6 mb-6`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>Neuen Eintrag hinzufügen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum</label>
                      <input
                        type="date"
                        value={newAttendanceDate}
                        onChange={(e) => setNewAttendanceDate(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Beginn</label>
                      <input
                        type="time"
                        value={newAttendanceStart}
                        onChange={(e) => setNewAttendanceStart(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ende</label>
                      <input
                        type="time"
                        value={newAttendanceEnd}
                        onChange={(e) => setNewAttendanceEnd(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  </div>
                  <button
                    onClick={addSchoolAttendance}
                    className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
                  >
                    <Plus className="inline mr-2" size={18} />
                    Eintrag hinzufügen
                  </button>
                </div>
              )}

              {/* Hinweis wenn fremde Karte angezeigt wird */}
              {selectedSchoolCardUser && (
                <div className={`${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-xl p-4 mb-6 border-2 ${darkMode ? 'border-purple-700' : 'border-purple-200'}`}>
                  <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                    👀 Du siehst die Kontrollkarte von <strong>{selectedSchoolCardUser.name}</strong>. Nur der Azubi selbst kann Einträge hinzufügen.
                  </p>
                </div>
              )}

              {/* Tabelle mit Einträgen */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                      <th className={`px-4 py-3 text-left font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum</th>
                      <th className={`px-4 py-3 text-left font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Beginn</th>
                      <th className={`px-4 py-3 text-left font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ende</th>
                      <th className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lehrer ✍️</th>
                      <th className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbilder ✍️</th>
                      <th className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolAttendance.map((entry, idx) => (
                      <tr key={entry.id} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'} ${idx % 2 === 0 ? (darkMode ? 'bg-slate-800' : 'bg-white') : (darkMode ? 'bg-slate-750' : 'bg-gray-50')}`}>
                        <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {new Date(entry.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </td>
                        <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{entry.start_time}</td>
                        <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{entry.end_time}</td>
                        <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          <div
                            onClick={() => setSignatureModal({ id: entry.id, field: 'teacher_signature', currentValue: entry.teacher_signature })}
                            className={`cursor-pointer rounded min-h-[50px] flex items-center justify-center ${entry.teacher_signature && entry.teacher_signature.startsWith('data:image') ? '' : (darkMode ? 'bg-slate-700' : 'bg-gray-100')} hover:opacity-80 transition-all border-2 border-dashed ${darkMode ? 'border-slate-600 hover:border-green-500' : 'border-gray-300 hover:border-green-500'}`}
                          >
                            {entry.teacher_signature && entry.teacher_signature.startsWith('data:image') ? (
                              <img src={entry.teacher_signature} alt="Unterschrift Lehrer" className="h-12 max-w-[120px] object-contain" />
                            ) : (
                              <span className={`italic text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>✍️ Unterschreiben</span>
                            )}
                          </div>
                        </td>
                        <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          <div
                            onClick={() => setSignatureModal({ id: entry.id, field: 'trainer_signature', currentValue: entry.trainer_signature })}
                            className={`cursor-pointer rounded min-h-[50px] flex items-center justify-center ${entry.trainer_signature && entry.trainer_signature.startsWith('data:image') ? '' : (darkMode ? 'bg-slate-700' : 'bg-gray-100')} hover:opacity-80 transition-all border-2 border-dashed ${darkMode ? 'border-slate-600 hover:border-blue-500' : 'border-gray-300 hover:border-blue-500'}`}
                          >
                            {entry.trainer_signature && entry.trainer_signature.startsWith('data:image') ? (
                              <img src={entry.trainer_signature} alt="Unterschrift Ausbilder" className="h-12 max-w-[120px] object-contain" />
                            ) : (
                              <span className={`italic text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>✍️ Unterschreiben</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => deleteSchoolAttendance(entry.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {schoolAttendance.length === 0 && (
                  <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-lg">Noch keine Einträge vorhanden</p>
                    <p className="text-sm mt-2">Füge deinen ersten Berufsschultag hinzu!</p>
                  </div>
                )}
              </div>

              {/* Zusammenfassung */}
              {schoolAttendance.length > 0 && (
                <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{schoolAttendance.length}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Einträge gesamt</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {schoolAttendance.filter(e => e.teacher_signature && e.teacher_signature.trim() !== '').length}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lehrer unterschrieben</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {schoolAttendance.filter(e => e.trainer_signature && e.trainer_signature.trim() !== '').length}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ausbilder unterschrieben</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        {schoolAttendance.filter(e => !e.teacher_signature?.trim() || !e.trainer_signature?.trim()).length}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Offen</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Unterschrift Modal */}
            {signatureModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full shadow-2xl`}>
                  <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    ✍️ {signatureModal.field === 'teacher_signature' ? 'Unterschrift Lehrer' : 'Unterschrift Ausbilder'}
                  </h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Bitte unterschreiben Sie im Feld unten mit dem Finger oder Stift.
                  </p>
                  <div className="mb-4">
                    <SignatureCanvas
                      value={tempSignature || signatureModal.currentValue}
                      onChange={(sig) => setTempSignature(sig)}
                      darkMode={darkMode}
                      label={signatureModal.field === 'teacher_signature' ? 'Lehrer' : 'Ausbilder'}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (tempSignature) {
                          updateAttendanceSignature(signatureModal.id, signatureModal.field, tempSignature);
                        }
                        setSignatureModal(null);
                        setTempSignature(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
                    >
                      <Check className="inline mr-2" size={18} />
                      Speichern
                    </button>
                    <button
                      onClick={() => {
                        setSignatureModal(null);
                        setTempSignature(null);
                      }}
                      className={`flex-1 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-3 rounded-lg font-bold transition-all ${darkMode ? 'text-white' : 'text-gray-700'}`}
                    >
                      <X className="inline mr-2" size={18} />
                      Abbrechen
                    </button>
                  </div>
                  {signatureModal.currentValue && signatureModal.currentValue.startsWith('data:image') && (
                    <button
                      onClick={() => {
                        updateAttendanceSignature(signatureModal.id, signatureModal.field, null);
                        setSignatureModal(null);
                        setTempSignature(null);
                      }}
                      className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      🗑️ Unterschrift löschen
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== SCHWIMMCHALLENGE VIEW ==================== */}
        {currentView === 'swim-challenge' && (
          <div className="space-y-6">
            {/* Header mit Team-Battle */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-600'} text-white rounded-xl p-6 shadow-lg`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    🏊 Schwimm-Challenge
                  </h2>
                  <p className="opacity-90 mt-1">Trainiere, sammle Punkte und miss dich mit anderen!</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['overview', 'challenges', 'add', 'leaderboard', 'battle'].map(view => (
                    <button
                      key={view}
                      onClick={() => setSwimChallengeView(view)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${swimChallengeView === view ? 'bg-white text-cyan-600' : 'bg-white/20 hover:bg-white/30'}`}
                    >
                      {view === 'overview' && '📊 Übersicht'}
                      {view === 'challenges' && '🎯 Challenges'}
                      {view === 'add' && '➕ Einheit'}
                      {view === 'leaderboard' && '🏆 Bestenliste'}
                      {view === 'battle' && '⚔️ Team-Battle'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Team-Battle Banner */}
            {(() => {
              const xpByUserId = Object.fromEntries(
                Object.entries(statsByUserId).map(([userId, stats]) => [userId, stats?.totalXp || 0])
              );
              Object.entries(swimBattleWinsByUserId || {}).forEach(([userId, wins]) => {
                const bonusPoints = toSafeInt(wins) * SWIM_BATTLE_WIN_POINTS;
                if (bonusPoints <= 0) return;
                xpByUserId[userId] = (xpByUserId[userId] || 0) + bonusPoints;
              });
              const battleStats = calculateTeamBattleStats(swimSessions, xpByUserId, allUsers);
              const currentMonth = new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }).toUpperCase();
              const leading = battleStats.azubis.points > battleStats.trainer.points ? 'azubis' : battleStats.trainer.points > battleStats.azubis.points ? 'trainer' : 'tie';

              return (
                <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                  <div className="text-center mb-4">
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ⚔️ TEAM-BATTLE: {currentMonth}
                    </h3>
                    {leading !== 'tie' && (
                      <p className={`text-sm mt-1 ${leading === 'azubis' ? (darkMode ? 'text-cyan-400' : 'text-cyan-600') : (darkMode ? 'text-orange-400' : 'text-orange-600')}`}>
                        {leading === 'azubis' ? '👨‍🎓 Azubis führen!' : '👨‍🏫 Trainer führen!'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-center flex-1">
                      <div className="text-3xl mb-1">👨‍🎓</div>
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Team Azubis</div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{battleStats.azubis.points} Pkt</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Swim {battleStats.azubis.swimPoints} + XP/Arena {battleStats.azubis.xpPoints}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {battleStats.azubis.memberList.length} Teilnehmer
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-gray-400">VS</div>
                    <div className="text-center flex-1">
                      <div className="text-3xl mb-1">👨‍🏫</div>
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Team Trainer</div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{battleStats.trainer.points} Pkt</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Swim {battleStats.trainer.swimPoints} + XP/Arena {battleStats.trainer.xpPoints}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {battleStats.trainer.memberList.length} Teilnehmer
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
                      <div className="bg-cyan-500 transition-all" style={{ width: `${battleStats.azubis.percent}%` }}></div>
                      <div className="bg-orange-500 transition-all" style={{ width: `${battleStats.trainer.percent}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>{battleStats.azubis.percent.toFixed(0)}%</span>
                      <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>{battleStats.trainer.percent.toFixed(0)}%</span>
                    </div>
                  </div>
                  {/* Distanz-Vergleich */}
                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} grid grid-cols-2 gap-4 text-center text-sm`}>
                    <div>
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Gesamtdistanz</div>
                      <div className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{(battleStats.azubis.distance / 1000).toFixed(1)} km</div>
                    </div>
                    <div>
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Gesamtdistanz</div>
                      <div className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{(battleStats.trainer.distance / 1000).toFixed(1)} km</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Übersicht */}
            {swimChallengeView === 'overview' && (() => {
              const mySessions = swimSessions.filter(s => s.user_id === user?.id && s.confirmed);
              const totalDistance = mySessions.reduce((sum, s) => sum + (s.distance || 0), 0);
              const totalTime = mySessions.reduce((sum, s) => sum + (s.time_minutes || 0), 0);
              const completedChallenges = SWIM_CHALLENGES.filter(ch => {
                const progress = calculateChallengeProgress(ch, swimSessions, user?.id);
                return progress.percent >= 100;
              });
              const points = calculateSwimPoints(mySessions, completedChallenges.map(c => c.id));

              return (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">🏊</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        {totalDistance >= 1000 ? `${(totalDistance / 1000).toFixed(1)} km` : `${totalDistance} m`}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gesamtdistanz</p>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">⏱️</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        {totalTime >= 60 ? `${Math.floor(totalTime / 60)}h ${totalTime % 60}m` : `${totalTime} min`}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Trainingszeit</p>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">🎯</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{completedChallenges.length}</span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Challenges abgeschlossen</p>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">⭐</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{points.total}</span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Punkte</p>
                  </div>
                </div>
              );
            })()}

            {/* Level-Anzeige */}
            {swimChallengeView === 'overview' && (() => {
              const mySessions = swimSessions.filter(s => s.user_id === user?.id && s.confirmed);
              const completedChallenges = SWIM_CHALLENGES.filter(ch => {
                const progress = calculateChallengeProgress(ch, swimSessions, user?.id);
                return progress.percent >= 100;
              });
              const points = calculateSwimPoints(mySessions, completedChallenges.map(c => c.id));
              const currentLevel = getSwimLevel(points.total);
              const progressPercent = currentLevel.nextLevel
                ? ((points.total - currentLevel.minPoints) / (currentLevel.nextLevel.minPoints - currentLevel.minPoints)) * 100
                : 100;

              return (
                <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dein Level</h3>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentLevel.color} flex items-center justify-center text-3xl`}>
                      {currentLevel.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {currentLevel.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {currentLevel.nextLevel
                          ? `${points.total} / ${currentLevel.nextLevel.minPoints} Punkte bis ${currentLevel.nextLevel.name}`
                          : `${points.total} Punkte - Maximales Level erreicht! 🎉`
                        }
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${currentLevel.color} transition-all`} style={{ width: `${Math.min(100, progressPercent)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Punkte-Aufschlüsselung */}
                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="flex justify-between">
                        <span>Distanz-Punkte (1 Pkt/100m):</span>
                        <span className="font-medium">{points.distancePoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zeit-Punkte (0.5 Pkt/Min):</span>
                        <span className="font-medium">{points.timePoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Challenge-Punkte:</span>
                        <span className="font-medium">{points.challengePoints}</span>
                      </div>
                    </div>
                  </div>
                  {/* Handicap-Info */}
                  {user?.birthDate && getAgeHandicap(user.birthDate) > 0 && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                      <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        <span>🎂</span>
                        <span>Alters-Handicap aktiv: <strong>{Math.round(getAgeHandicap(user.birthDate) * 100)}% Zeitbonus</strong> bei Sprint-Challenges</span>
                      </div>
                    </div>
                  )}
                  {!user?.birthDate && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                      <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span>💡</span>
                        <span>Tipp: Trage dein <button onClick={() => setCurrentView('profile')} className="underline text-cyan-500 hover:text-cyan-400">Geburtsdatum im Profil</button> ein für Alters-Handicap bei Sprint-Challenges (ab 40 Jahren).</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Challenges Liste */}
            {swimChallengeView === 'challenges' && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap mb-4">
                  {['alle', 'distanz', 'sprint', 'ausdauer', 'regelmaessigkeit', 'technik'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSwimChallengeFilter(cat)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        swimChallengeFilter === cat
                          ? 'bg-cyan-500 text-white'
                          : (darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                      }`}
                    >
                      {cat === 'alle' && '🎯 Alle'}
                      {cat === 'distanz' && '🌊 Distanz'}
                      {cat === 'sprint' && '⚡ Sprint'}
                      {cat === 'ausdauer' && '💪 Ausdauer'}
                      {cat === 'regelmaessigkeit' && '📅 Regelmäßigkeit'}
                      {cat === 'technik' && '🏊 Technik'}
                    </button>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {SWIM_CHALLENGES.filter(c => swimChallengeFilter === 'alle' || c.category === swimChallengeFilter).map(challenge => {
                    const progress = calculateChallengeProgress(challenge, swimSessions, user?.id);
                    const isCompleted = progress.percent >= 100;

                    return (
                      <div key={challenge.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 shadow-lg ${isCompleted ? 'ring-2 ring-green-500' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{challenge.icon}</span>
                            <div>
                              <h4 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {challenge.name}
                                {isCompleted && <span className="text-green-500">✓</span>}
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{challenge.description}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            isCompleted
                              ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700')
                              : (darkMode ? 'bg-cyan-900 text-cyan-300' : 'bg-cyan-100 text-cyan-700')
                          }`}>
                            {isCompleted ? '✓ ' : '+'}{challenge.points} Pkt
                          </span>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fortschritt</span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {challenge.type === 'distance' || challenge.type === 'single_distance'
                                ? `${(progress.current / 1000).toFixed(1)} / ${(challenge.target / 1000).toFixed(1)} km`
                                : `${progress.current} / ${challenge.target} ${challenge.unit}`
                              }
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-cyan-500'}`}
                              style={{ width: `${Math.min(100, progress.percent)}%` }}
                            ></div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (!activeSwimChallenges.includes(challenge.id)) {
                              saveActiveSwimChallenges([...activeSwimChallenges, challenge.id]);
                            }
                          }}
                          disabled={activeSwimChallenges.includes(challenge.id) || isCompleted}
                          className={`mt-4 w-full py-2 rounded-lg font-medium transition-all ${
                            isCompleted
                              ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700')
                              : activeSwimChallenges.includes(challenge.id)
                                ? (darkMode ? 'bg-cyan-900 text-cyan-300' : 'bg-cyan-100 text-cyan-700')
                                : (darkMode ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white')
                          }`}
                        >
                          {isCompleted ? '🏆 Abgeschlossen!' : activeSwimChallenges.includes(challenge.id) ? '✓ Aktiv' : 'Challenge starten'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trainingseinheit eintragen */}
            {swimChallengeView === 'add' && (
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ➕ Neue Trainingseinheit eintragen
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum</label>
                    <input
                      type="date"
                      value={swimSessionForm.date}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, date: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Schwimmstil</label>
                    <select
                      value={swimSessionForm.style}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, style: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      {SWIM_STYLES.map(style => (
                        <option key={style.id} value={style.id}>{style.icon} {style.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Distanz (Meter)</label>
                    <input
                      type="number"
                      value={swimSessionForm.distance}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, distance: e.target.value})}
                      placeholder="z.B. 1000"
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Zeit (Minuten)</label>
                    <input
                      type="number"
                      value={swimSessionForm.time}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, time: e.target.value})}
                      placeholder="z.B. 25"
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Für Challenge (optional)</label>
                    <select
                      value={swimSessionForm.challengeId}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, challengeId: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="">-- Keine Challenge --</option>
                      {activeSwimChallenges.map(id => {
                        const ch = SWIM_CHALLENGES.find(c => c.id === id);
                        return ch ? <option key={id} value={id}>{ch.icon} {ch.name}</option> : null;
                      })}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notizen</label>
                    <textarea
                      value={swimSessionForm.notes}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, notes: e.target.value})}
                      placeholder="Wie lief das Training?"
                      rows={2}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
                <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-300'}`}>
                  <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    ⚠️ Die Einheit muss von einem Trainer/Ausbilder bestätigt werden, bevor die Punkte gutgeschrieben werden.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (swimSessionForm.distance && swimSessionForm.time) {
                      const result = await saveSwimSession(swimSessionForm);
                      if (result.success) {
                        setSwimSessionForm({
                          date: new Date().toISOString().split('T')[0],
                          distance: '',
                          time: '',
                          style: 'kraul',
                          notes: '',
                          challengeId: ''
                        });
                        alert('Trainingseinheit eingereicht! Warte auf Bestätigung durch einen Trainer.');
                      } else {
                        alert('Fehler beim Speichern: ' + result.error);
                      }
                    }
                  }}
                  disabled={!swimSessionForm.distance || !swimSessionForm.time}
                  className={`mt-4 w-full py-3 rounded-lg font-bold transition-all ${
                    swimSessionForm.distance && swimSessionForm.time
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                      : (darkMode ? 'bg-slate-700 text-gray-500' : 'bg-gray-200 text-gray-400')
                  }`}
                >
                  📤 Einheit zur Bestätigung einreichen
                </button>
              </div>
            )}

            {/* Bestenliste */}
            {swimChallengeView === 'leaderboard' && (() => {
              // Aggregiere bestätigte Sessions pro Benutzer
              const confirmedSessions = swimSessions.filter(s => s.confirmed);
              const userStats = {};

              confirmedSessions.forEach(session => {
                const userId = session.user_id;
                if (!userStats[userId]) {
                  userStats[userId] = {
                    user_id: session.user_id,
                    user_name: session.user_name,
                    user_role: session.user_role,
                    total_distance: 0,
                    total_time: 0,
                    session_count: 0,
                    styles: new Set()
                  };
                }
                userStats[userId].total_distance += session.distance || 0;
                userStats[userId].total_time += session.time_minutes || 0;
                userStats[userId].session_count += 1;
                userStats[userId].styles.add(session.style);
              });

              // Sortiere nach Gesamtdistanz
              const leaderboard = Object.values(userStats)
                .sort((a, b) => b.total_distance - a.total_distance);

              const formatMinutes = (minutesInput) => {
                const minutes = Math.max(0, Number(minutesInput) || 0);
                if (minutes >= 60) {
                  return `${Math.floor(minutes / 60)}h ${Math.round(minutes % 60)}min`;
                }
                return `${Math.round(minutes)} min`;
              };

              const challengeTimeLeaderboards = SWIM_CHALLENGES
                .map((challenge) => {
                  const challengeSessions = confirmedSessions.filter(session =>
                    session.challenge_id === challenge.id
                    && Number(session.time_minutes || 0) > 0
                    && Number(session.distance || 0) > 0
                  );

                  if (challengeSessions.length === 0) {
                    return null;
                  }

                  const bestByUser = {};
                  challengeSessions.forEach((session) => {
                    const userId = session.user_id;
                    const timeMinutes = Number(session.time_minutes || 0);
                    const distance = Number(session.distance || 0);
                    if (!userId || timeMinutes <= 0 || distance <= 0) return;

                    const paceSecondsPer100 = (timeMinutes * 60) / (distance / 100);
                    if (!Number.isFinite(paceSecondsPer100) || paceSecondsPer100 <= 0) return;

                    const existing = bestByUser[userId];
                    if (
                      !existing
                      || paceSecondsPer100 < existing.paceSecondsPer100
                      || (paceSecondsPer100 === existing.paceSecondsPer100 && timeMinutes < existing.timeMinutes)
                    ) {
                      bestByUser[userId] = {
                        userId,
                        userName: session.user_name || 'Unbekannt',
                        timeMinutes,
                        distance,
                        paceSecondsPer100,
                        date: session.date
                      };
                    }
                  });

                  const ranking = Object.values(bestByUser)
                    .sort((a, b) => a.paceSecondsPer100 - b.paceSecondsPer100)
                    .slice(0, 5);

                  if (ranking.length === 0) {
                    return null;
                  }

                  return {
                    challenge,
                    ranking
                  };
                })
                .filter(Boolean);

              return (
                <div className="space-y-4">
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      🏆 Bestenliste - Gesamtdistanz
                    </h3>

                    {leaderboard.length === 0 ? (
                      <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="text-5xl mb-4 block">🏊</span>
                        <p>Noch keine bestätigten Einträge vorhanden.</p>
                        <p className="text-sm mt-2">Trage deine erste Trainingseinheit ein!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.map((entry, index) => {
                          const medals = ['🥇', '🥈', '🥉'];
                          const medal = medals[index] || `${index + 1}.`;
                          const isCurrentUser = entry.user_id === user?.id;
                          const avgPace = entry.total_time > 0
                            ? ((entry.total_time / (entry.total_distance / 100))).toFixed(1)
                            : 0;

                          return (
                            <div
                              key={entry.user_id}
                              className={`p-4 rounded-lg flex items-center gap-4 transition-all ${
                                isCurrentUser
                                  ? (darkMode ? 'bg-cyan-900/50 border-2 border-cyan-500' : 'bg-cyan-50 border-2 border-cyan-400')
                                  : (darkMode ? 'bg-slate-700' : 'bg-gray-50')
                              }`}
                            >
                              <div className="text-3xl w-12 text-center">
                                {medal}
                              </div>
                              <div className="flex-1">
                                <div className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  {entry.user_name}
                                  {isCurrentUser && <span className="text-xs bg-cyan-500 text-white px-2 py-0.5 rounded-full">Du</span>}
                                  <span className="text-sm font-normal opacity-70">
                                    {entry.user_role === 'azubi' ? '👨‍🎓' : '👨‍🏫'}
                                  </span>
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {entry.session_count} Einheiten • ⌀ {avgPace} Min/100m
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                  {(entry.total_distance / 1000).toFixed(1)} km
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {Math.floor(entry.total_time / 60)}h {entry.total_time % 60}min
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ⏱️ Schnellste Zeiten pro Challenge
                    </h3>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Gewertet werden bestätigte Challenge-Einheiten nach bester Pace (Sekunden pro 100m).
                    </p>

                    {challengeTimeLeaderboards.length === 0 ? (
                      <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <p>Noch keine bestätigten Challenge-Zeiten vorhanden.</p>
                        <p className="text-sm mt-1">Trage Einheiten mit Challenge-Zuordnung ein.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {challengeTimeLeaderboards.map(({ challenge, ranking }) => (
                          <div
                            key={challenge.id}
                            className={`rounded-lg p-4 border ${
                              darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {challenge.icon} {challenge.name}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Top {ranking.length}
                              </div>
                            </div>
                            <div className="space-y-2">
                              {ranking.map((entry, index) => {
                                const medals = ['🥇', '🥈', '🥉'];
                                const medal = medals[index] || `${index + 1}.`;
                                const isCurrentUser = entry.userId === user?.id;
                                return (
                                  <div
                                    key={`${challenge.id}-${entry.userId}`}
                                    className={`flex items-center gap-3 p-2 rounded-lg ${
                                      isCurrentUser
                                        ? (darkMode ? 'bg-cyan-900/40 border border-cyan-700' : 'bg-cyan-50 border border-cyan-200')
                                        : ''
                                    }`}
                                  >
                                    <span className="w-8 text-center text-lg">{medal}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {entry.userName}
                                        {isCurrentUser && <span className="ml-1 text-xs opacity-70">(Du)</span>}
                                      </div>
                                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {entry.distance}m in {formatMinutes(entry.timeMinutes)} • {entry.paceSecondsPer100.toFixed(1)} s/100m
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Top 3 Podium für > 3 Teilnehmer */}
                  {leaderboard.length >= 3 && (
                    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                      <h3 className={`font-bold text-lg mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        🏅 Podium
                      </h3>
                      <div className="flex items-end justify-center gap-4">
                        {/* Platz 2 */}
                        <div className="text-center">
                          <div className="text-4xl mb-2">🥈</div>
                          <div className={`w-24 h-20 ${darkMode ? 'bg-gray-500' : 'bg-gray-300'} rounded-t-lg flex items-center justify-center`}>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                              {(leaderboard[1].total_distance / 1000).toFixed(1)} km
                            </span>
                          </div>
                          <div className={`text-sm font-medium mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {leaderboard[1].user_name.split(' ')[0]}
                          </div>
                        </div>
                        {/* Platz 1 */}
                        <div className="text-center">
                          <div className="text-5xl mb-2">🥇</div>
                          <div className={`w-24 h-28 bg-gradient-to-b ${darkMode ? 'from-yellow-500 to-yellow-700' : 'from-yellow-400 to-yellow-500'} rounded-t-lg flex items-center justify-center`}>
                            <span className="font-bold text-white">
                              {(leaderboard[0].total_distance / 1000).toFixed(1)} km
                            </span>
                          </div>
                          <div className={`text-sm font-medium mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {leaderboard[0].user_name.split(' ')[0]}
                          </div>
                        </div>
                        {/* Platz 3 */}
                        <div className="text-center">
                          <div className="text-4xl mb-2">🥉</div>
                          <div className={`w-24 h-16 ${darkMode ? 'bg-orange-700' : 'bg-orange-400'} rounded-t-lg flex items-center justify-center`}>
                            <span className="font-bold text-white">
                              {(leaderboard[2].total_distance / 1000).toFixed(1)} km
                            </span>
                          </div>
                          <div className={`text-sm font-medium mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {leaderboard[2].user_name.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Eigene Statistiken */}
                  {(() => {
                    const myStats = userStats[user?.id];
                    if (!myStats) return null;
                    const myRank = leaderboard.findIndex(e => e.user_id === user?.id) + 1;
                    return (
                      <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-600'} text-white rounded-xl p-6 shadow-lg`}>
                        <h3 className="font-bold text-lg mb-4">📊 Deine Statistiken</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold">{myRank}.</div>
                            <div className="text-sm opacity-80">Platzierung</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{(myStats.total_distance / 1000).toFixed(1)}</div>
                            <div className="text-sm opacity-80">Kilometer</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{myStats.session_count}</div>
                            <div className="text-sm opacity-80">Einheiten</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{Math.floor(myStats.total_time / 60)}h</div>
                            <div className="text-sm opacity-80">Trainingszeit</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}

            {/* Team-Battle Detail */}
            {swimChallengeView === 'battle' && (() => {
              const xpByUserId = Object.fromEntries(
                Object.entries(statsByUserId).map(([userId, stats]) => [userId, stats?.totalXp || 0])
              );
              Object.entries(swimBattleWinsByUserId || {}).forEach(([userId, wins]) => {
                const bonusPoints = toSafeInt(wins) * SWIM_BATTLE_WIN_POINTS;
                if (bonusPoints <= 0) return;
                xpByUserId[userId] = (xpByUserId[userId] || 0) + bonusPoints;
              });
              const battleStats = calculateTeamBattleStats(swimSessions, xpByUserId, allUsers);

              const renderTeamMember = (member, index, color) => {
                const medals = ['🥇', '🥈', '🥉'];
                const medal = medals[index] || `${index + 1}.`;
                const isCurrentUser = member.user_id === user?.id;

                return (
                  <div
                    key={member.user_id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      isCurrentUser
                        ? (darkMode ? `bg-${color}-900/50 border border-${color}-500` : `bg-${color}-100 border border-${color}-300`)
                        : ''
                    }`}
                  >
                    <span className="text-xl w-8">{medal}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {member.user_name}
                        {isCurrentUser && <span className="ml-1 text-xs opacity-70">(Du)</span>}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {member.sessions} Einheiten • {(member.distance / 1000).toFixed(1)} km • Swim {member.swimPoints || 0} + XP/Arena {member.xp || 0}
                      </div>
                    </div>
                    <div className={`font-bold ${color === 'cyan' ? (darkMode ? 'text-cyan-400' : 'text-cyan-600') : (darkMode ? 'text-orange-400' : 'text-orange-600')}`}>
                      {member.points} Pkt
                    </div>
                  </div>
                );
              };

              const duelCandidates = allUsers.filter(u => Boolean(u?.id));
              const trainerCandidates = allUsers.filter(u =>
                u?.role === 'trainer'
                || u?.role === 'ausbilder'
                || u?.role === 'admin'
                || Boolean(u?.permissions?.canViewAllStats)
              );
              const azubiCandidates = allUsers.filter(u => u?.role === 'azubi');
              const arenaLeaderboard = allUsers
                .filter(u => Boolean(u?.id))
                .map((account) => {
                  const wins = toSafeInt(swimBattleWinsByUserId?.[account.id]);
                  return {
                    userId: account.id,
                    name: account.name || 'Unbekannt',
                    role: account.role || 'azubi',
                    wins,
                    creature: getSeaCreatureTier(wins)
                  };
                })
                .sort((a, b) => b.wins - a.wins)
                .slice(0, 10);
              const recentArenaHistory = Array.isArray(swimBattleHistory)
                ? swimBattleHistory.slice(0, 8)
                : [];

              return (
                <div className="space-y-4">
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                      <div>
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          🏟️ Swim-Arena
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          1v1-Duelle oder Team Boss-Battle mit Meereswesen-Rangsystem
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSwimArenaMode('duel')}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            swimArenaMode === 'duel'
                              ? 'bg-cyan-500 text-white'
                              : (darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                          }`}
                        >
                          🤝 1v1 Duel
                        </button>
                        <button
                          onClick={() => setSwimArenaMode('boss')}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            swimArenaMode === 'boss'
                              ? 'bg-orange-500 text-white'
                              : (darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                          }`}
                        >
                          👨‍🏫 Boss-Battle
                        </button>
                      </div>
                    </div>

                    {swimArenaMode === 'duel' && (
                      <form onSubmit={handleSwimDuelSubmit} className="space-y-3">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Disziplin</label>
                            <select
                              value={swimDuelForm.discipline}
                              onChange={(event) => setSwimDuelForm(prev => ({ ...prev, discipline: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              {SWIM_ARENA_DISCIPLINES.map((discipline) => (
                                <option key={discipline.id} value={discipline.id}>{discipline.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Schwimmtechnik</label>
                            <select
                              value={swimDuelForm.style}
                              onChange={(event) => setSwimDuelForm(prev => ({ ...prev, style: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              {SWIM_STYLES.map((style) => (
                                <option key={style.id} value={style.id}>{style.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Teilnehmer A</label>
                            <select
                              value={swimDuelForm.challengerId}
                              onChange={(event) => setSwimDuelForm(prev => ({ ...prev, challengerId: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              <option value="">Bitte wählen</option>
                              {duelCandidates.map((candidate) => (
                                <option key={candidate.id} value={candidate.id}>
                                  {candidate.name} ({candidate.role})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Teilnehmer B</label>
                            <select
                              value={swimDuelForm.opponentId}
                              onChange={(event) => setSwimDuelForm(prev => ({ ...prev, opponentId: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              <option value="">Bitte wählen</option>
                              {duelCandidates.map((candidate) => (
                                <option key={candidate.id} value={candidate.id}>
                                  {candidate.name} ({candidate.role})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Zeit A (Sek.)</label>
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={swimDuelForm.challengerSeconds}
                              onChange={(event) => setSwimDuelForm(prev => ({ ...prev, challengerSeconds: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                              placeholder="z.B. 36.4"
                            />
                          </div>
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Zeit B (Sek.)</label>
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={swimDuelForm.opponentSeconds}
                              onChange={(event) => setSwimDuelForm(prev => ({ ...prev, opponentSeconds: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                              placeholder="z.B. 38.1"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium"
                          >
                            Ergebnis eintragen
                          </button>
                        </div>
                      </form>
                    )}

                    {swimArenaMode === 'boss' && (
                      <form onSubmit={handleSwimBossBattleSubmit} className="space-y-3">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Disziplin</label>
                            <select
                              value={swimBossForm.discipline}
                              onChange={(event) => setSwimBossForm(prev => ({ ...prev, discipline: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              {SWIM_ARENA_DISCIPLINES.map((discipline) => (
                                <option key={discipline.id} value={discipline.id}>{discipline.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Schwimmtechnik</label>
                            <select
                              value={swimBossForm.style}
                              onChange={(event) => setSwimBossForm(prev => ({ ...prev, style: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              {SWIM_STYLES.map((style) => (
                                <option key={style.id} value={style.id}>{style.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbilder</label>
                            <select
                              value={swimBossForm.trainerId}
                              onChange={(event) => setSwimBossForm(prev => ({ ...prev, trainerId: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                            >
                              <option value="">Bitte wählen</option>
                              {trainerCandidates.map((trainerAccount) => (
                                <option key={trainerAccount.id} value={trainerAccount.id}>
                                  {trainerAccount.name} ({trainerAccount.role})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Azubis gegen den Ausbilder
                          </label>
                          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                            {azubiCandidates.length === 0 && (
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Keine Azubis gefunden.</p>
                            )}
                            {azubiCandidates.map((azubiAccount) => {
                              const checked = swimBossForm.azubiIds.includes(azubiAccount.id);
                              return (
                                <label key={azubiAccount.id} className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(event) => {
                                      const enabled = event.target.checked;
                                      setSwimBossForm((prev) => ({
                                        ...prev,
                                        azubiIds: enabled
                                          ? [...prev.azubiIds, azubiAccount.id]
                                          : prev.azubiIds.filter((id) => id !== azubiAccount.id)
                                      }));
                                    }}
                                  />
                                  <span>{azubiAccount.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Zeit Ausbilder (Sek.)</label>
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={swimBossForm.trainerSeconds}
                              onChange={(event) => setSwimBossForm(prev => ({ ...prev, trainerSeconds: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                              placeholder="z.B. 42.0"
                            />
                          </div>
                          <div>
                            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Team-Zeit Azubis (Sek.)</label>
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={swimBossForm.azubiSeconds}
                              onChange={(event) => setSwimBossForm(prev => ({ ...prev, azubiSeconds: event.target.value }))}
                              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                              placeholder="z.B. 39.5"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
                          >
                            Boss-Battle auswerten
                          </button>
                        </div>
                      </form>
                    )}

                    {swimBattleResult && (
                      <div className={`mt-4 p-4 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-cyan-50 border-cyan-200'}`}>
                        <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {swimBattleResult.draw ? '🤝 Unentschieden' : '🏁 Arena-Ergebnis'}
                        </h4>
                        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {swimBattleResult.mode === 'boss' ? 'Boss-Battle' : '1v1 Duel'} • {swimBattleResult.discipline} • {swimBattleResult.styleName}
                        </p>
                        {swimBattleResult.draw ? (
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Beide Seiten haben exakt die gleiche Zeit erreicht.
                          </p>
                        ) : (
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                              <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Sieger</div>
                              <div className="space-y-1">
                                {swimBattleResult.winners.map((winner) => (
                                  <div key={winner.userId} className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-800'}`}>
                                    {winner.name}: {winner.battleCreature.emoji} {winner.battleCreature.name} ({winner.wins} Siege)
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                              <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Verlierer</div>
                              <div className="space-y-1">
                                {swimBattleResult.losers.map((loser) => (
                                  <div key={loser.userId} className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                                    {loser.name}: {loser.battleCreature.emoji} {loser.battleCreature.name} ({loser.wins} Siege)
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-4">
                    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                      <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        🐟 Meereswesen-Rangliste
                      </h4>
                      <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Pro Arena-Sieg gibt es +1 Rang-Sieg und +{SWIM_BATTLE_WIN_POINTS} Team-Battle Punkte.
                      </p>
                      <div className="space-y-2">
                        {arenaLeaderboard.length === 0 && (
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Noch keine Arena-Siege eingetragen.
                          </div>
                        )}
                        {arenaLeaderboard.map((entry, index) => (
                          <div key={entry.userId} className={`flex items-center justify-between gap-3 p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                            <div className="min-w-0">
                              <div className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {index + 1}. {entry.name}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {entry.role} • {entry.wins} Siege
                              </div>
                            </div>
                            <div className={`text-sm font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                              {entry.creature.emoji} {entry.creature.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                      <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        🧾 Arena-Verlauf
                      </h4>
                      <div className="space-y-2">
                        {recentArenaHistory.length === 0 && (
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Noch keine Duelle oder Boss-Battles erfasst.
                          </div>
                        )}
                        {recentArenaHistory.map((entry) => {
                          const winners = (entry.winnerIds || []).map((id) => getUserNameById(id)).join(', ');
                          const losers = (entry.loserIds || []).map((id) => getUserNameById(id)).join(', ');
                          const dateText = new Date(entry.created_at).toLocaleString('de-DE');
                          return (
                            <div key={entry.id} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                              <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {dateText} • {entry.mode === 'boss' ? 'Boss-Battle' : 'Duel'} • {entry.discipline}
                              </div>
                              {entry.draw ? (
                                <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Unentschieden ({entry.styleName})</div>
                              ) : (
                                <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  🏆 {winners || 'Unbekannt'} besiegt {losers || 'Unbekannt'} ({entry.styleName})
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ⚔️ Team-Battle Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Team Azubis */}
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-cyan-900/30 border border-cyan-700' : 'bg-cyan-50 border border-cyan-200'}`}>
                        <h4 className={`font-bold mb-3 flex items-center justify-between ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                          <span>👨‍🎓 Team Azubis</span>
                          <span>{battleStats.azubis.points} Pkt</span>
                        </h4>
                        <p className={`text-xs mb-3 ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>
                          Swim {battleStats.azubis.swimPoints} + XP/Arena {battleStats.azubis.xpPoints}
                        </p>
                        {battleStats.azubis.memberList.length === 0 ? (
                          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <p>Noch keine Teilnehmer</p>
                            <p className="text-sm mt-1">Trage eine Trainingseinheit ein!</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {battleStats.azubis.memberList.map((member, idx) => renderTeamMember(member, idx, 'cyan'))}
                          </div>
                        )}
                        <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-cyan-800' : 'border-cyan-200'} text-sm`}>
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gesamt:</span>
                            <span className={`font-medium ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                              {(battleStats.azubis.distance / 1000).toFixed(1)} km • {Math.floor(battleStats.azubis.time / 60)}h {battleStats.azubis.time % 60}m
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Team Trainer */}
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-orange-900/30 border border-orange-700' : 'bg-orange-50 border border-orange-200'}`}>
                        <h4 className={`font-bold mb-3 flex items-center justify-between ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                          <span>👨‍🏫 Team Trainer</span>
                          <span>{battleStats.trainer.points} Pkt</span>
                        </h4>
                        <p className={`text-xs mb-3 ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
                          Swim {battleStats.trainer.swimPoints} + XP/Arena {battleStats.trainer.xpPoints}
                        </p>
                        {battleStats.trainer.memberList.length === 0 ? (
                          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <p>Noch keine Teilnehmer</p>
                            <p className="text-sm mt-1">Trainer, zeigt was ihr könnt!</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {battleStats.trainer.memberList.map((member, idx) => renderTeamMember(member, idx, 'orange'))}
                          </div>
                        )}
                        <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-orange-800' : 'border-orange-200'} text-sm`}>
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gesamt:</span>
                            <span className={`font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                              {(battleStats.trainer.distance / 1000).toFixed(1)} km • {Math.floor(battleStats.trainer.time / 60)}h {battleStats.trainer.time % 60}m
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistik-Vergleich */}
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      📈 Statistik-Vergleich
                    </h4>
                    <div className="space-y-4">
                      {/* Distanz-Vergleich */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>{(battleStats.azubis.distance / 1000).toFixed(1)} km</span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gesamtdistanz</span>
                          <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>{(battleStats.trainer.distance / 1000).toFixed(1)} km</span>
                        </div>
                        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                          <div className="bg-cyan-500 transition-all" style={{ width: `${battleStats.azubis.distance + battleStats.trainer.distance > 0 ? (battleStats.azubis.distance / (battleStats.azubis.distance + battleStats.trainer.distance)) * 100 : 50}%` }}></div>
                          <div className="bg-orange-500 transition-all" style={{ width: `${battleStats.azubis.distance + battleStats.trainer.distance > 0 ? (battleStats.trainer.distance / (battleStats.azubis.distance + battleStats.trainer.distance)) * 100 : 50}%` }}></div>
                        </div>
                      </div>
                      {/* Zeit-Vergleich */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>{Math.floor(battleStats.azubis.time / 60)}h {battleStats.azubis.time % 60}m</span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Trainingszeit</span>
                          <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>{Math.floor(battleStats.trainer.time / 60)}h {battleStats.trainer.time % 60}m</span>
                        </div>
                        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                          <div className="bg-cyan-500 transition-all" style={{ width: `${battleStats.azubis.time + battleStats.trainer.time > 0 ? (battleStats.azubis.time / (battleStats.azubis.time + battleStats.trainer.time)) * 100 : 50}%` }}></div>
                          <div className="bg-orange-500 transition-all" style={{ width: `${battleStats.azubis.time + battleStats.trainer.time > 0 ? (battleStats.trainer.time / (battleStats.azubis.time + battleStats.trainer.time)) * 100 : 50}%` }}></div>
                        </div>
                      </div>
                      {/* Teilnehmer-Vergleich */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>{battleStats.azubis.memberList.length}</span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Teilnehmer</span>
                          <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>{battleStats.trainer.memberList.length}</span>
                        </div>
                        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                          <div className="bg-cyan-500 transition-all" style={{ width: `${battleStats.azubis.memberList.length + battleStats.trainer.memberList.length > 0 ? (battleStats.azubis.memberList.length / (battleStats.azubis.memberList.length + battleStats.trainer.memberList.length)) * 100 : 50}%` }}></div>
                          <div className="bg-orange-500 transition-all" style={{ width: `${battleStats.azubis.memberList.length + battleStats.trainer.memberList.length > 0 ? (battleStats.trainer.memberList.length / (battleStats.azubis.memberList.length + battleStats.trainer.memberList.length)) * 100 : 50}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Handicap-System */}
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      📊 Alters-Handicap System
                    </h4>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Für faire Wettkämpfe zwischen verschiedenen Altersgruppen wird ein Handicap-System angewendet:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {[
                        { age: '< 40', bonus: '0%' },
                        { age: '40-49', bonus: '-5%' },
                        { age: '50-59', bonus: '-10%' },
                        { age: '60-69', bonus: '-15%' },
                        { age: '70+', bonus: '-20%' },
                      ].map(h => (
                        <div key={h.age} className={`p-3 rounded-lg text-center ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{h.age}</div>
                          <div className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{h.bonus} Zeit</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Trainer: Bestätigungen */}
            {(user.role === 'trainer' || user.role === 'ausbilder' || user.permissions.canViewAllStats) && pendingSwimConfirmations.length > 0 && (
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ✅ Zu bestätigende Einheiten
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingSwimConfirmations.length}</span>
                </h3>
                <div className="space-y-3">
                  {pendingSwimConfirmations.map(session => (
                    <div key={session.id} className={`p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {session.user_name} - {session.distance}m in {session.time_minutes} Min
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {SWIM_STYLES.find(s => s.id === session.style)?.name} • {session.date}
                          {session.notes && <span className="ml-2 italic">"{session.notes}"</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmSwimSession(session.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                        >
                          ✓ Bestätigen
                        </button>
                        <button
                          onClick={() => rejectSwimSession(session.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
                        >
                          ✗ Ablehnen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== BERICHTSHEFT VIEW ==================== */}
        {currentView === 'berichtsheft' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className={`text-2xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  📖 Digitales Berichtsheft
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => { resetBerichtsheftForm(); setBerichtsheftViewMode('edit'); }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${berichtsheftViewMode === 'edit' ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                  >
                    ✏️ Neu
                  </button>
                  <button
                    onClick={() => setBerichtsheftViewMode('list')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${berichtsheftViewMode === 'list' ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                  >
                    📋 Übersicht
                  </button>
                  <button
                    onClick={() => setBerichtsheftViewMode('progress')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${berichtsheftViewMode === 'progress' ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                  >
                    📊 Fortschritt
                  </button>
                  <button
                    onClick={() => setBerichtsheftViewMode('profile')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${berichtsheftViewMode === 'profile' ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                  >
                    👤 Profil
                  </button>
                </div>
              </div>

              {/* Profil-Hinweis wenn nicht ausgefüllt */}
              {berichtsheftViewMode !== 'profile' && (!azubiProfile.vorname || !azubiProfile.nachname || !azubiProfile.ausbildungsbetrieb) && (
                <div className={`mb-4 p-4 rounded-lg border-2 ${darkMode ? 'bg-yellow-900/30 border-yellow-600' : 'bg-yellow-50 border-yellow-400'}`}>
                  <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    ⚠️ Bitte fülle zuerst dein <button onClick={() => setBerichtsheftViewMode('profile')} className="underline font-bold">Azubi-Profil</button> aus, damit deine Daten automatisch in den Berichten erscheinen.
                  </p>
                </div>
              )}

              {/* PROFILE VIEW - Azubi-Profil bearbeiten */}
              {berichtsheftViewMode === 'profile' && (
                <div className="space-y-6">
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50'} rounded-xl p-6`}>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      👤 Azubi-Profil für Berichtsheft
                    </h3>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Diese Daten werden automatisch in deine Berichtshefte übernommen.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vorname *</label>
                        <input
                          type="text"
                          value={azubiProfile.vorname}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, vorname: e.target.value })}
                          placeholder="Max"
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nachname *</label>
                        <input
                          type="text"
                          value={azubiProfile.nachname}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, nachname: e.target.value })}
                          placeholder="Mustermann"
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbildungsbetrieb *</label>
                        <input
                          type="text"
                          value={azubiProfile.ausbildungsbetrieb}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsbetrieb: e.target.value })}
                          placeholder="Stadtwerke Musterstadt GmbH"
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbildungsberuf</label>
                        <input
                          type="text"
                          value={azubiProfile.ausbildungsberuf}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsberuf: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name Ausbilder/in</label>
                        <input
                          type="text"
                          value={azubiProfile.ausbilder}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbilder: e.target.value })}
                          placeholder="Frau/Herr Ausbilder"
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbildungsbeginn</label>
                        <input
                          type="date"
                          value={azubiProfile.ausbildungsbeginn}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsbeginn: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vorschau */}
                  {azubiProfile.vorname && azubiProfile.nachname && (
                    <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-6`}>
                      <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Vorschau Kopfzeile:</h4>
                      <div className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Name:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.vorname} {azubiProfile.nachname}</span></div>
                          <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Betrieb:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbildungsbetrieb || '-'}</span></div>
                          <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Beruf:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbildungsberuf}</span></div>
                          <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Ausbilder:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbilder || '-'}</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setBerichtsheftViewMode('edit')}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg"
                  >
                    <Check className="inline mr-2" size={20} />
                    Profil gespeichert - Zum Berichtsheft
                  </button>
                </div>
              )}

              {/* EDIT VIEW - Neuer Wochenbericht */}
              {berichtsheftViewMode === 'edit' && (
                <div className="space-y-6">
                  {/* Azubi-Kopfzeile */}
                  {(azubiProfile.vorname || azubiProfile.nachname || azubiProfile.ausbildungsbetrieb) && (
                    <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-3 border ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Azubi:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.vorname} {azubiProfile.nachname}</span></div>
                        {azubiProfile.ausbildungsbetrieb && <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Betrieb:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbildungsbetrieb}</span></div>}
                        {azubiProfile.ausbilder && <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Ausbilder:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbilder}</span></div>}
                      </div>
                    </div>
                  )}

                  {/* Header-Infos */}
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50'} rounded-xl p-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nachweis Nr.</label>
                        <input
                          type="number"
                          value={berichtsheftNr}
                          onChange={(e) => setBerichtsheftNr(parseInt(e.target.value) || 1)}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Woche vom (Montag)</label>
                        <input
                          type="date"
                          value={berichtsheftWeek}
                          onChange={(e) => setBerichtsheftWeek(e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>bis (Sonntag)</label>
                        <input
                          type="text"
                          value={getWeekEndDate(berichtsheftWeek)}
                          readOnly
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-500'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbildungsjahr</label>
                        <select
                          value={berichtsheftYear}
                          onChange={(e) => setBerichtsheftYear(parseInt(e.target.value))}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        >
                          <option value={1}>1. Ausbildungsjahr</option>
                          <option value={2}>2. Ausbildungsjahr</option>
                          <option value={3}>3. Ausbildungsjahr</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tageseinträge */}
                  <div className="space-y-4">
                    {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, dayIndex) => {
                      const dayNames = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag', Sa: 'Samstag', So: 'Sonntag' };
                      const dayDate = new Date(berichtsheftWeek);
                      dayDate.setDate(dayDate.getDate() + dayIndex);

                      return (
                        <div key={day} className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-4`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{day}</span>
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {dayNames[day]} - {dayDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                              </span>
                            </div>
                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {calculateDayHours(day)} Std.
                            </div>
                          </div>

                          {currentWeekEntries[day].map((entry, entryIndex) => (
                            <div key={entryIndex} className="flex flex-wrap lg:flex-nowrap gap-2 mb-2 items-start">
                              <div className="flex-grow min-w-[200px]">
                                <input
                                  type="text"
                                  value={entry.taetigkeit}
                                  onChange={(e) => updateWeekEntry(day, entryIndex, 'taetigkeit', e.target.value)}
                                  placeholder="Ausgeführte Tätigkeit..."
                                  className={`w-full px-3 py-2 border rounded-lg text-sm ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                                />
                              </div>
                              <div className="w-20 flex-shrink-0">
                                <input
                                  type="number"
                                  value={entry.stunden}
                                  onChange={(e) => updateWeekEntry(day, entryIndex, 'stunden', e.target.value)}
                                  placeholder="Std."
                                  step="0.5"
                                  min="0"
                                  max="12"
                                  className={`w-full px-2 py-2 border rounded-lg text-sm text-center ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                                />
                              </div>
                              <div className="w-full sm:w-auto">
                                <select
                                  value={entry.bereich}
                                  onChange={(e) => updateWeekEntry(day, entryIndex, 'bereich', e.target.value)}
                                  className={`w-full min-w-[500px] px-2 py-2 border rounded-lg text-sm ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                >
                                  <option value="">-- Bereich --</option>
                                  {AUSBILDUNGSRAHMENPLAN.map(b => (
                                    <option key={b.nr} value={b.nr}>{b.icon} {b.nr}. {b.bereich}</option>
                                  ))}
                                </select>
                              </div>
                              <button
                                onClick={() => removeWeekEntry(day, entryIndex)}
                                disabled={currentWeekEntries[day].length <= 1}
                                className={`px-2 py-2 rounded-lg transition-all ${currentWeekEntries[day].length <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-100'}`}
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addWeekEntry(day)}
                            className={`mt-2 text-sm flex items-center gap-1 ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}
                          >
                            <Plus size={16} /> Weitere Tätigkeit
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Gesamtstunden */}
                  <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-500'} rounded-xl p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">Gesamtstunden diese Woche:</span>
                      <span className="text-3xl font-bold">{calculateTotalHours()} Std.</span>
                    </div>
                  </div>

                  {/* Bemerkungen */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Bemerkungen Auszubildender
                      </label>
                      <textarea
                        value={berichtsheftBemerkungAzubi}
                        onChange={(e) => setBerichtsheftBemerkungAzubi(e.target.value)}
                        rows={3}
                        placeholder="Besondere Vorkommnisse, Lernerfolge..."
                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Bemerkungen Ausbilder
                      </label>
                      <textarea
                        value={berichtsheftBemerkungAusbilder}
                        onChange={(e) => setBerichtsheftBemerkungAusbilder(e.target.value)}
                        rows={3}
                        placeholder="Feedback, Anmerkungen..."
                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  </div>

                  {/* Unterschriften */}
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-6`}>
                    <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Für die Richtigkeit</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum Azubi</label>
                          <input
                            type="date"
                            value={berichtsheftDatumAzubi}
                            onChange={(e) => setBerichtsheftDatumAzubi(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                          />
                        </div>
                        <SignatureCanvas
                          value={berichtsheftSignaturAzubi}
                          onChange={setBerichtsheftSignaturAzubi}
                          darkMode={darkMode}
                          label="Unterschrift Auszubildender"
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum Ausbilder</label>
                          <input
                            type="date"
                            value={berichtsheftDatumAusbilder}
                            onChange={(e) => setBerichtsheftDatumAusbilder(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                          />
                        </div>
                        <SignatureCanvas
                          value={berichtsheftSignaturAusbilder}
                          onChange={setBerichtsheftSignaturAusbilder}
                          darkMode={darkMode}
                          label="Unterschrift Ausbilder"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Speichern & PDF Buttons */}
                  <div className="flex gap-4 flex-wrap">
                    <button
                      onClick={saveBerichtsheft}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg"
                    >
                      <Check className="inline mr-2" size={20} />
                      {selectedBerichtsheft ? 'Aktualisieren' : 'Speichern'}
                    </button>
                    {selectedBerichtsheft && (
                      <button
                        onClick={() => generateBerichtsheftPDF(selectedBerichtsheft)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center gap-2"
                      >
                        <Download className="inline" size={20} />
                        PDF / Drucken
                      </button>
                    )}
                    {selectedBerichtsheft && (
                      <button
                        onClick={resetBerichtsheftForm}
                        className={`px-6 py-3 rounded-xl font-medium ${darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        Abbrechen
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* LIST VIEW - Übersicht aller Berichte */}
              {berichtsheftViewMode === 'list' && (
                <div className="space-y-4">
                  {berichtsheftEntries.length === 0 ? (
                    <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="text-6xl mb-4">📖</div>
                      <p className="text-lg">Noch keine Berichtshefte vorhanden</p>
                      <p className="text-sm mt-2">Erstelle deinen ersten Wochenbericht!</p>
                      <button
                        onClick={() => setBerichtsheftViewMode('edit')}
                        className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium"
                      >
                        <Plus className="inline mr-2" size={18} />
                        Neuer Bericht
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className={`grid gap-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {berichtsheftEntries.map(entry => (
                          <div key={entry.id} className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4`}>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                  Nr. {entry.nachweis_nr}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${entry.signatur_azubi && entry.signatur_ausbilder ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-600'}`}>
                                  {entry.signatur_azubi && entry.signatur_ausbilder ? '✓ Unterschrieben' : '⏳ Offen'}
                                </span>
                              </div>
                              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                KW {new Date(entry.week_start).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} - {new Date(entry.week_end).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                <span className="mx-2">|</span>
                                {entry.ausbildungsjahr}. Ausbildungsjahr
                                <span className="mx-2">|</span>
                                <span className="font-medium">{entry.total_hours || 0} Stunden</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => generateBerichtsheftPDF(entry)}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                              >
                                <Download size={16} /> PDF
                              </button>
                              <button
                                onClick={() => loadBerichtsheftForEdit(entry)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                              >
                                ✏️ Bearbeiten
                              </button>
                              <button
                                onClick={() => deleteBerichtsheft(entry.id)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Statistik */}
                      <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{berichtsheftEntries.length}</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wochen erfasst</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                              {berichtsheftEntries.filter(e => e.signatur_azubi && e.signatur_ausbilder).length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unterschrieben</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                              {berichtsheftEntries.filter(e => !e.signatur_azubi || !e.signatur_ausbilder).length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Offen</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              {berichtsheftEntries.reduce((sum, e) => sum + (e.total_hours || 0), 0)}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stunden gesamt</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* PROGRESS VIEW - Fortschritt nach Ausbildungsrahmenplan */}
              {berichtsheftViewMode === 'progress' && (
                <div className="space-y-6">
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50'} rounded-xl p-4`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Hier siehst du deinen Fortschritt in den verschiedenen Ausbildungsbereichen gemäß Ausbildungsrahmenplan (§4).
                      Die Soll-Wochen basieren auf den zeitlichen Richtwerten der Verordnung.
                    </p>
                  </div>

                  {(() => {
                    const progress = calculateBereichProgress();
                    const stundenProWoche = 40; // Annahme: 40 Stunden = 1 Woche

                    return (
                      <div className="space-y-4">
                        {Object.entries(progress).map(([nr, data]) => {
                          const istWochen = data.istStunden / stundenProWoche;
                          const prozent = data.sollWochen > 0 ? Math.min(100, (istWochen / data.sollWochen) * 100) : (data.istStunden > 0 ? 100 : 0);

                          return (
                            <div key={nr} className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-4`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{data.icon}</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {nr}. {data.name}
                                  </span>
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {istWochen.toFixed(1)} / {data.sollWochen > 0 ? data.sollWochen : '∞'} Wochen
                                  <span className="ml-2 font-bold">({data.istStunden.toFixed(0)} Std.)</span>
                                </div>
                              </div>
                              <div className={`h-4 rounded-full overflow-hidden ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${data.color}`}
                                  style={{ width: `${prozent}%` }}
                                />
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {prozent.toFixed(0)}% erreicht
                                </span>
                                {prozent >= 100 && (
                                  <span className="text-xs text-green-500 font-medium">✓ Abgeschlossen</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Gesamt-Übersicht */}
                  <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-500'} rounded-xl p-6 text-white`}>
                    <h3 className="font-bold text-lg mb-4">Gesamtfortschritt</h3>
                    {(() => {
                      const progress = calculateBereichProgress();
                      const totalIstStunden = Object.values(progress).reduce((sum, d) => sum + d.istStunden, 0);
                      const totalSollWochen = AUSBILDUNGSRAHMENPLAN.reduce((sum, b) => sum + b.gesamtWochen, 0);
                      const totalSollStunden = totalSollWochen * 40;
                      const gesamtProzent = totalSollStunden > 0 ? (totalIstStunden / totalSollStunden) * 100 : 0;

                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-3xl font-bold">{totalIstStunden.toFixed(0)}</div>
                            <div className="text-sm opacity-80">Stunden erfasst</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{(totalIstStunden / 40).toFixed(1)}</div>
                            <div className="text-sm opacity-80">Wochen erfasst</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{totalSollWochen}</div>
                            <div className="text-sm opacity-80">Soll-Wochen (gesamt)</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{gesamtProzent.toFixed(0)}%</div>
                            <div className="text-sm opacity-80">Gesamtfortschritt</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Ausbildungsrahmenplan Übersicht */}
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-6`}>
                    <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      📋 Ausbildungsrahmenplan - Übersicht
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className={`${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                            <th className={`px-3 py-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nr.</th>
                            <th className={`px-3 py-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bereich</th>
                            <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>1. Jahr</th>
                            <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>2. Jahr</th>
                            <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>3. Jahr</th>
                            <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gesamt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {AUSBILDUNGSRAHMENPLAN.map((bereich, idx) => (
                            <tr key={bereich.nr} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'} ${idx % 2 === 0 ? '' : (darkMode ? 'bg-slate-750' : 'bg-gray-100')}`}>
                              <td className={`px-3 py-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                <span className="mr-1">{bereich.icon}</span> {bereich.nr}
                              </td>
                              <td className={`px-3 py-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {bereich.bereich}
                                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{bereich.paragraph}</div>
                              </td>
                              <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {bereich.wochen.jahr1 || '-'}
                              </td>
                              <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {bereich.wochen.jahr2 || '-'}
                              </td>
                              <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {bereich.wochen.jahr3 || '-'}
                              </td>
                              <td className={`px-3 py-2 text-center font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                {bereich.gesamtWochen || 'lfd.'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className={`mt-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      * "lfd." = wird während der gesamten Ausbildung laufend vermittelt
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== PROFIL VIEW ==================== */}
        {currentView === 'profile' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl p-8 text-center">
              <div className="text-6xl mb-3">
                {user.avatar ? AVATARS.find(a => a.id === user.avatar)?.emoji || '👤' : '👤'}
              </div>
              <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
              <p className="opacity-90">{PERMISSIONS[user.role]?.label || user.role}</p>
            </div>

            {/* Avatar auswählen */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Avatar auswählen
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Wähle einen Avatar für dein Profil
              </p>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => updateProfileAvatar(avatar.id)}
                    disabled={profileSaving}
                    title={avatar.label}
                    className={`text-3xl p-2 rounded-xl transition-all hover:scale-110 ${
                      user.avatar === avatar.id
                        ? 'bg-cyan-500 ring-2 ring-cyan-400 ring-offset-2 ' + (darkMode ? 'ring-offset-slate-800' : 'ring-offset-white')
                        : darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {avatar.emoji}
                  </button>
                ))}
              </div>
              {user.avatar && (
                <button
                  onClick={() => updateProfileAvatar(null)}
                  disabled={profileSaving}
                  className={`mt-4 text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                >
                  Avatar entfernen
                </button>
              )}
            </div>

            {/* Aktivitäts-Statistik */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Meine Aktivitäten
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Quiz-Statistik */}
                <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-green-900 to-emerald-900' : 'bg-gradient-to-br from-green-100 to-emerald-100'}`}>
                  <div className="text-3xl mb-1">🏆</div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {userStats?.wins || 0}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Quiz-Siege</div>
                </div>
                <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-blue-900 to-cyan-900' : 'bg-gradient-to-br from-blue-100 to-cyan-100'}`}>
                  <div className="text-3xl mb-1">🏊</div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {swimSessions.filter(s => s.user_id === user.id || s.user_name === user.name).reduce((sum, s) => sum + (s.distance || 0), 0).toLocaleString()}m
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Geschwommen</div>
                </div>
                <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-gradient-to-br from-purple-100 to-pink-100'}`}>
                  <div className="text-3xl mb-1">🎖️</div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {userBadges.length}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Badges</div>
                </div>
                <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-orange-900 to-amber-900' : 'bg-gradient-to-br from-orange-100 to-amber-100'}`}>
                  <div className="text-3xl mb-1">✅</div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    {Object.values(userStats?.categoryStats || {}).reduce((sum, cat) => sum + (cat.correct || 0), 0)}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>Richtige Antworten</div>
                </div>
              </div>
              {/* Erweiterte Stats */}
              <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} grid grid-cols-3 gap-4 text-center`}>
                <div>
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {userStats?.losses || 0}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Niederlagen</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {userStats?.draws || 0}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unentschieden</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {swimSessions.filter(s => s.user_id === user.id || s.user_name === user.name).length}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Schwimm-Einheiten</div>
                </div>
              </div>
            </div>

            {/* Aktuelle Daten */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Aktuelle Kontodaten
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>E-Mail</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.email}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rolle</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {PERMISSIONS[user.role]?.label || user.role}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Betrieb</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {user.company || <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Nicht angegeben</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Betrieb ändern */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Betrieb angeben
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder={user.company || "z.B. Stadtbad München, Hallenbad Köln..."}
                  value={profileEditCompany}
                  onChange={(e) => setProfileEditCompany(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
                />
                <button
                  onClick={updateProfileCompany}
                  disabled={profileSaving}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
                >
                  {profileSaving ? 'Speichern...' : 'Speichern'}
                </button>
              </div>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                In welchem Schwimmbad / Betrieb arbeitest du?
              </p>
            </div>

            {/* Geburtsdatum für Handicap */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🎂 Geburtsdatum
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="date"
                  value={profileEditBirthDate || user.birthDate || ''}
                  onChange={(e) => setProfileEditBirthDate(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
                />
                <button
                  onClick={updateProfileBirthDate}
                  disabled={profileSaving || !profileEditBirthDate}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
                >
                  {profileSaving ? 'Speichern...' : 'Speichern'}
                </button>
              </div>
              {user.birthDate && (
                <p className={`mt-2 text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  ✓ Gespeichert: {new Date(user.birthDate).toLocaleDateString('de-DE')}
                  {getAgeHandicap(user.birthDate) > 0 && (
                    <span className="ml-2 text-cyan-500">
                      (Handicap: {Math.round(getAgeHandicap(user.birthDate) * 100)}% Zeitbonus)
                    </span>
                  )}
                </p>
              )}
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Wird für das Alters-Handicap bei der Schwimm-Challenge verwendet (ab 40 Jahren).
              </p>
            </div>

            {/* Name ändern */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Anzeigename ändern
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Neuer Name"
                  value={profileEditName}
                  onChange={(e) => setProfileEditName(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
                />
                <button
                  onClick={updateProfileName}
                  disabled={profileSaving || !profileEditName.trim()}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
                >
                  {profileSaving ? 'Speichern...' : 'Name ändern'}
                </button>
              </div>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Dein Anzeigename wird in der App, im Chat und in der Bestenliste angezeigt.
              </p>
            </div>

            {/* Freunde einladen */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-pink-900/80 to-purple-900/80' : 'bg-gradient-to-r from-pink-100 to-purple-100'} rounded-xl p-6 shadow-lg border-2 ${darkMode ? 'border-pink-700' : 'border-pink-300'}`}>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🎉 Freunde einladen
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Teile die App mit deinen Azubi-Kollegen und lernt gemeinsam!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={async () => {
                    const shareData = {
                      title: 'FAB COMPASS - Bäder-Azubi App',
                      text: 'Hey! Schau dir diese Lern-App für Fachangestellte für Bäderbetriebe an. Quiz, Karteikarten, Schwimm-Challenge und mehr!',
                      url: 'https://baeder-azubi-app.vercel.app'
                    };

                    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                      try {
                        await navigator.share(shareData);
                        showToast('Danke fürs Teilen!', 'success');
                      } catch (err) {
                        if (err.name !== 'AbortError') {
                          console.error('Share error:', err);
                        }
                      }
                    } else {
                      // Fallback: Copy to clipboard
                      try {
                        await navigator.clipboard.writeText('https://baeder-azubi-app.vercel.app');
                        showToast('Link kopiert! Teile ihn mit deinen Freunden.', 'success');
                        playSound('splash');
                      } catch (err) {
                        showToast('Link: https://baeder-azubi-app.vercel.app', 'info');
                      }
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <span className="text-xl">📤</span>
                  <span>App teilen</span>
                </button>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText('https://baeder-azubi-app.vercel.app');
                      showToast('Link kopiert!', 'success');
                      playSound('splash');
                    } catch (err) {
                      showToast('Link: https://baeder-azubi-app.vercel.app', 'info');
                    }
                  }}
                  className={`px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    darkMode
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
                  }`}
                >
                  <span className="text-xl">📋</span>
                  <span>Link kopieren</span>
                </button>
              </div>
            </div>

            {/* Passwort ändern */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Passwort ändern
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Neues Passwort
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mindestens 6 Zeichen"
                      value={profileEditPassword}
                      onChange={(e) => setProfileEditPassword(e.target.value)}
                      className={`w-full px-4 py-3 pr-12 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Passwort bestätigen
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordConfirm ? 'text' : 'password'}
                      placeholder="Passwort wiederholen"
                      value={profileEditPasswordConfirm}
                      onChange={(e) => setProfileEditPasswordConfirm(e.target.value)}
                      className={`w-full px-4 py-3 pr-12 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                    >
                      {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={updateProfilePassword}
                  disabled={profileSaving || !profileEditPassword || !profileEditPasswordConfirm}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
                >
                  {profileSaving ? 'Speichern...' : 'Passwort ändern'}
                </button>
              </div>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Verwende ein sicheres Passwort mit mindestens 6 Zeichen.
              </p>
            </div>

            {/* Abmelden */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Sitzung beenden
              </h3>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  localStorage.removeItem('baeder_user');
                }}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
              >
                Abmelden
              </button>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Du wirst aus der App abgemeldet und musst dich erneut anmelden.
              </p>
            </div>

            {/* Rechtliches */}
            <div className={`${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'} rounded-xl p-6`}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                📜 Rechtliches
              </h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setCurrentView('impressum')}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'} transition-all`}
                >
                  Impressum
                </button>
                <button
                  onClick={() => setCurrentView('datenschutz')}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'} transition-all`}
                >
                  Datenschutzerklärung
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Impressum */}
        {currentView === 'impressum' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-8 shadow-lg`}>
              <button
                onClick={() => setCurrentView('profile')}
                className={`mb-6 flex items-center gap-2 ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'} transition-colors`}
              >
                ← Zurück zum Profil
              </button>

              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📜 Impressum
              </h2>

              <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Angaben gemäß § 5 TMG</h3>
                  <p>Dennie Gulbinski</p>
                  <p>Zeitstraße 108</p>
                  <p>53721 Siegburg</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Kontakt</h3>
                  <p>E-Mail: denniegulbinski@gmail.com</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                  <p>Dennie Gulbinski</p>
                  <p>Zeitstraße 108</p>
                  <p>53721 Siegburg</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Haftungsausschluss</h3>
                  <p className="text-sm leading-relaxed">
                    Die Inhalte dieser App wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
                    Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter sind wir gemäß
                    § 7 Abs.1 TMG für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich.
                  </p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Urheberrecht</h3>
                  <p className="text-sm leading-relaxed">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke unterliegen dem deutschen Urheberrecht.
                    Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
                    Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* Datenschutzerklärung */}
        {currentView === 'datenschutz' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-8 shadow-lg`}>
              <button
                onClick={() => setCurrentView('profile')}
                className={`mb-6 flex items-center gap-2 ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'} transition-colors`}
              >
                ← Zurück zum Profil
              </button>

              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🔒 Datenschutzerklärung
              </h2>
              <p className={`text-xs mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Stand: Januar 2025 | Diese Datenschutzerklärung gilt für die Nutzung der Bäder-Azubi App.
              </p>

              <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>1. Verantwortlicher</h3>
                  <p className="text-sm">Dennie Gulbinski<br/>Zeitstraße 108<br/>53721 Siegburg<br/>E-Mail: denniegulbinski@gmail.com</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>2. Zwecke der Datenverarbeitung</h3>
                  <p className="text-sm leading-relaxed mb-2">Die Verarbeitung personenbezogener Daten erfolgt ausschließlich zur:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Bereitstellung der App-Funktionen</li>
                    <li>Unterstützung von Ausbildungsprozessen (Berichtsheft, Lernfortschritt, Kommunikation)</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>3. Verarbeitete Datenarten</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li><strong>Stammdaten:</strong> Name, E-Mail-Adresse, optional Geburtsdatum</li>
                    <li><strong>Nutzungsdaten:</strong> Login-Zeitpunkte, aktive Module</li>
                    <li><strong>Lern- & Ausbildungsdaten:</strong> Quiz-Ergebnisse, Berichtshefteinträge, Schwimmeinheiten, Schulungsfortschritte</li>
                    <li><strong>Kommunikationsdaten:</strong> Chatnachrichten innerhalb der App</li>
                    <li><strong>Ausbilderdaten:</strong> Kontrollkarten, Kommentare, Freigaben</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>4. Rechtsgrundlagen der Verarbeitung</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung/Ausbildungsverhältnis)</li>
                    <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: z. B. Systembetrieb, Support)</li>
                    <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, z. B. für Chatfunktion)</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>5. Empfänger der Daten</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>IT-Dienstleister (z. B. Supabase für Hosting)</li>
                    <li>Keine Weitergabe an Dritte zu Werbezwecken</li>
                    <li>Datenverarbeitung erfolgt ausschließlich innerhalb der EU</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>6. Speicherdauer</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li><strong>Azubis:</strong> Löschung 3 Monate nach Ausbildungsende</li>
                    <li><strong>Ausbilder:innen:</strong> Löschung 6 Monate nach Inaktivität</li>
                    <li><strong>Admins:</strong> regelmäßige Löschprüfung jährlich</li>
                    <li><strong>Chatnachrichten:</strong> max. 12 Monate, dann automatische Löschung</li>
                    <li><strong>Berichtshefte:</strong> Löschung spätestens 1 Jahr nach Ausbildungsende</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>7. Betroffenenrechte</h3>
                  <p className="text-sm leading-relaxed mb-2">Du hast das Recht auf:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Auskunft (Art. 15 DSGVO)</li>
                    <li>Berichtigung (Art. 16 DSGVO)</li>
                    <li>Löschung (Art. 17 DSGVO)</li>
                    <li>Einschränkung (Art. 18 DSGVO)</li>
                    <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                    <li>Widerspruch (Art. 21 DSGVO)</li>
                    <li>Widerruf einer Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
                  </ul>
                  <p className="text-sm leading-relaxed mt-2">Anfragen bitte per E-Mail an: denniegulbinski@gmail.com</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>8. Cookies und lokale Speicherung</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Die App nutzt kein Tracking</li>
                    <li>Es wird ausschließlich Local Storage verwendet (z. B. für Einstellungen und Anmeldedaten)</li>
                    <li>Es erfolgt keine Analyse oder Weitergabe dieser Daten</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>9. Sicherheit der Verarbeitung</h3>
                  <p className="text-sm leading-relaxed mb-2">Zum Schutz deiner Daten setzen wir technische und organisatorische Maßnahmen ein:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Verschlüsselte Übertragung (TLS)</li>
                    <li>Zugriffsrechte nach Rolle</li>
                    <li>Datensicherung</li>
                    <li>Regelmäßige Updates</li>
                  </ul>
                </section>

                <section className={`pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                  <p className="text-xs text-gray-500">
                    Diese Datenschutzerklärung wird regelmäßig aktualisiert. Letzte Aktualisierung: Januar 2025
                  </p>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
