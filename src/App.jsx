import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import toast from 'react-hot-toast';
import { Trophy, MessageCircle, BookOpen, Bell, ClipboardList, Users, Plus, Send, Check, X, Upload, Download, Calendar, Award, Brain, Home, Target, TrendingUp, Zap, Star, Shield, Trash2, UserCog, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import AuthGuard from './components/auth/AuthGuard';
import { useChatState, getRoleKey, isStaffRole, getAccountOrganizationId, getChatScopeKey } from './hooks/useChatState';
import { useAdminActions } from './hooks/useAdminActions';
import { useNotifications } from './hooks/useNotifications';
import { useBerichtsheft } from './hooks/useBerichtsheft';
import { useDuelGame } from './hooks/useDuelGame';
import { useFlashcards } from './hooks/useFlashcards';
import { useSwimChallenge, SWIM_BATTLE_WIN_POINTS, SWIM_ARENA_DISCIPLINES } from './hooks/useSwimChallenge';
import HomeView from './components/views/HomeView';
import QuizView from './components/views/QuizView';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import AvatarBadge from './components/ui/AvatarBadge';

// Lazy-loaded Views — werden erst geladen wenn sie gebraucht werden
const ChatView = lazy(() => import('./components/views/ChatView'));
const ForumView = lazy(() => import('./components/views/ForumView'));
const NewsView = lazy(() => import('./components/views/NewsView'));
const ExamsView = lazy(() => import('./components/views/ExamsView'));
const MaterialsView = lazy(() => import('./components/views/MaterialsView'));
const ResourcesView = lazy(() => import('./components/views/ResourcesView'));
const TrainerDashboardView = lazy(() => import('./components/views/TrainerDashboardView'));
const QuestionsView = lazy(() => import('./components/views/QuestionsView'));
const StatsView = lazy(() => import('./components/views/StatsView'));
const SchoolCardView = lazy(() => import('./components/views/SchoolCardView'));
const ProfileView = lazy(() => import('./components/views/ProfileView'));
const AdminView = lazy(() => import('./components/views/AdminView'));
const ExamSimulatorView = lazy(() => import('./components/views/ExamSimulatorView'));
const FlashcardsView = lazy(() => import('./components/views/FlashcardsView'));
const CalculatorView = lazy(() => import('./components/views/CalculatorView'));
const SwimChallengeView = lazy(() => import('./components/views/SwimChallengeView'));
const BerichtsheftView = lazy(() => import('./components/views/BerichtsheftView'));
const CollectionView = lazy(() => import('./components/views/CollectionView'));
const ImpressumView = lazy(() => import('./components/views/ImpressumView'));
const DatenschutzView = lazy(() => import('./components/views/DatenschutzView'));
const AGBView = lazy(() => import('./components/views/AGBView'));
const InteractiveLearningView = lazy(() => import('./components/views/InteractiveLearningView'));
const NotfallTrainerView = lazy(() => import('./components/views/NotfallTrainerView'));
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { useCookieNotice } from './hooks/useCookieNotice';
import { useViewRouter } from './hooks/useViewRouter';

import { CATEGORIES, DEFAULT_MENU_ITEMS, DEFAULT_THEME_COLORS, PERMISSIONS, MENU_GROUP_LABELS, getAvatarById, getLevel, getLevelProgress } from './data/constants';
import { POOL_CHEMICALS, PERIODIC_TABLE } from './data/chemistry';
import { DID_YOU_KNOW_FACTS, DAILY_WISDOM, SAFETY_SCENARIOS, WORK_SAFETY_TOPICS } from './data/content';
import { SAMPLE_QUESTIONS } from './data/quizQuestions';
// Flashcard-Builder + KEYWORD_CHALLENGES / WHO_AM_I_* werden jetzt im useFlashcards Hook genutzt
import { SWIM_STYLES, SWIM_CHALLENGES, SWIM_LEVELS, SWIM_BADGES, getAgeHandicap, calculateHandicappedTime, calculateSwimPoints, calculateChallengeProgress, getSwimLevel, calculateTeamBattleStats } from './data/swimming';
import { PRACTICAL_EXAM_TYPES, PRACTICAL_SWIM_EXAMS, resolvePracticalDisciplineResult, toNumericGrade, formatGradeLabel, parseExamTimeToSeconds, formatSecondsAsTime } from './data/practicalExam';
import { PRACTICAL_CHECKLISTS } from './data/practicalChecklists';
import { friendlyError } from './lib/friendlyError';
import {
  loadUsers as dsLoadUsers,
  loadAppConfig as dsLoadAppConfig,
  loadGames as dsLoadGames,
  getUserStats as dsGetUserStats,
  getAllUserStats as dsGetAllUserStats,
  loadMaterials as dsLoadMaterials,
  loadResources as dsLoadResources,
  loadNews as dsLoadNews,
  loadExams as dsLoadExams,
  loadCustomQuestions as dsLoadCustomQuestions,
  createQuestionSubmission as dsCreateQuestionSubmission,
  approveQuestionSubmission as dsApproveQuestionSubmission,
  loadQuestionReports as dsLoadQuestionReports,
  purgeUserData as dsPurgeUserData,
  startTheoryExamSession as dsStartTheoryExamSession,
  saveTheoryExamAttempt as dsSaveTheoryExamAttempt,
  loadTheoryExamHistory as dsLoadTheoryExamHistory,
  deletePracticalExamAttempt as dsDsPracticalExamAttempt,
  loadSchoolAttendanceAzubis as dsLoadSchoolAttendanceAzubis,
  loadSchoolAttendance as dsLoadSchoolAttendance,
  addSchoolAttendanceEntry as dsAddSchoolAttendance,
  updateSchoolAttendanceSignature as dsUpdateAttendanceSignature,
  deleteSchoolAttendanceEntry as dsDeleteSchoolAttendance,
  loadExamGradesAzubis as dsLoadExamGradesAzubis,
  loadExamGradeEntries as dsLoadExamGrades,
  addExamGradeEntry as dsAddExamGrade,
  deleteExamGradeEntry as dsDeleteExamGrade,
  addMaterialEntry as dsAddMaterial,
  addResourceEntry as dsAddResource,
  deleteResourceEntry as dsDeleteResource,
  addNewsEntry as dsAddNews,
  deleteNewsEntry as dsDeleteNews,
  addExamEntry as dsAddExam,
  deleteExamEntry as dsDeleteExam,
  loadPracticalExamAttempts as dsLoadPracticalExamAttempts,
  savePracticalExamAttemptEntry as dsSavePracticalExamAttempt,
  getAuthorizedReviewers as dsGetAuthorizedReviewers,
  saveBadges as dsSaveBadges,
  loadUserBadges as dsLoadUserBadges,
  loadRetentionCandidates as dsLoadRetentionCandidates,
} from './lib/dataService';
import {
  toSafeInt, getFirstSafeInt,
  normalizePlayerName, namesMatch, isFinishedGameStatus,
  shuffleArray,
  DIFFICULTY_SETTINGS, DEFAULT_CHALLENGE_TIMEOUT_MINUTES,
  normalizeChallengeTimeoutMinutes,
  parseTimestampSafe, getChallengeTimeoutMs,
  getWaitingChallengeRemainingMs, isWaitingChallengeExpired,
  formatDurationMinutesCompact,
  XP_META_KEY, XP_BREAKDOWN_DEFAULT, XP_REWARDS,
  getXpMetaFromCategoryStats,
  createEmptyUserStats, ensureUserStatsStructure, buildUserStatsFromRow,
  getResolvedGameScores, resolveFinishedGameWinner,
  hasRecordedRoundAnswers, isCountableFinishedQuizGame,
  buildQuizTotalsFromFinishedGames, buildHeadToHeadFromFinishedGames,
  haveQuizTotalsChanged,
  syncQuizTotalsIntoStats, mergeOpponentStatsByMax,
  doesUserStatsRowNeedRepair,
  getTotalXpFromStats, getXpBreakdownFromStats,
  addXpToStats, deductXpFromStats,
  normalizeKeywordText, getWordVariants,
  isKeywordQuestion, isWhoAmIQuestion,
  evaluateKeywordAnswer, autoExtractKeywordGroups,
  getQuizTimeLimit, cloneDuelGameSnapshot,
} from './lib/quizHelpers';

export default function BaederApp() {
  const QUESTION_PERFORMANCE_STORAGE_KEY = 'question_performance_v1';
  const ADAPTIVE_LEARNING_STORAGE_KEY = 'adaptive_learning_mode_v1';
  const WEEKLY_GOALS_STORAGE_KEY = 'weekly_goals_v1';
  const WEEKLY_PROGRESS_STORAGE_KEY = 'weekly_progress_v1';
  const WEEKLY_REMINDER_STORAGE_KEY = 'weekly_goals_reminder_v1';
  const QUESTION_REPORTS_STORAGE_KEY = 'question_reports_v1';
  const CHECKLIST_PROGRESS_STORAGE_KEY = 'practical_checklist_progress_v1';
  const WEEKLY_PROGRESS_TEMPLATE = {
    quizAnswers: 0,
    examAnswers: 0,
    flashcards: 0,
    checklistItems: 0
  };
  const WEEKLY_GOAL_DEFAULTS = {
    quizAnswers: 40,
    examAnswers: 30,
    flashcards: 35,
    checklistItems: 10
  };

  const parseJsonSafe = (value, fallback) => {
    try {
      const parsed = JSON.parse(value);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  };

  const repairLegacyText = (value) => {
    if (typeof value !== 'string') return value;
    let repaired = value;
    for (let i = 0; i < 3; i += 1) {
      if (!/[ÃÂâð]/.test(repaired)) break;
      try {
        const next = decodeURIComponent(escape(repaired));
        if (!next || next === repaired) break;
        repaired = next;
      } catch {
        break;
      }
    }
    return repaired;
  };

  const sanitizeMenuItem = (itemInput) => {
    const item = itemInput && typeof itemInput === 'object' ? itemInput : {};
    return {
      ...item,
      icon: repairLegacyText(String(item.icon || '')),
      label: repairLegacyText(String(item.label || '')),
      group: repairLegacyText(String(item.group || ''))
    };
  };

  const sanitizeGoalValue = (value, fallback = 0) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(0, Math.round(parsed));
  };

  const mergeMenuItemsWithDefaults = (customMenuItems) => {
    const incoming = Array.isArray(customMenuItems) ? customMenuItems : [];
    const safeDefaults = DEFAULT_MENU_ITEMS.map((item) => sanitizeMenuItem(item));
    const defaultById = new Map(safeDefaults.map((item) => [item.id, item]));

    const normalizedIncoming = incoming
      .filter((item) => item && typeof item.id === 'string')
      .map((item) => {
        const defaultItem = defaultById.get(item.id);
        const mergedItem = defaultItem ? { ...defaultItem, ...item } : item;
        return sanitizeMenuItem(mergedItem);
      });

    const incomingIds = new Set(normalizedIncoming.map((item) => item.id));
    const missingDefaults = safeDefaults
      .filter((item) => !incomingIds.has(item.id))
      .map((item) => ({ ...item }));

    return [...normalizedIncoming, ...missingDefaults];
  };

  const getWeekStartStamp = (input = Date.now()) => {
    const base = new Date(input);
    if (Number.isNaN(base.getTime())) return '';
    const date = new Date(base);
    const day = date.getDay(); // Sonntag = 0
    const offsetToMonday = (day + 6) % 7;
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offsetToMonday);
    return date.toISOString().slice(0, 10);
  };

  const buildEmptyWeeklyProgress = (weekStart = getWeekStartStamp()) => ({
    weekStart,
    stats: { ...WEEKLY_PROGRESS_TEMPLATE },
    updatedAt: Date.now()
  });


  const toTimestampMs = (value) => {
    const timestamp = Date.parse(String(value || ''));
    return Number.isFinite(timestamp) ? timestamp : 0;
  };

  const normalizeQuestionText = (value) => String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');

  const {
    authReady,
    user,
    setUser,
    authView,
    setAuthView,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    registerData,
    setRegisterData,
    handleLogin,
    handleRegister,
    handleLogout
  } = useAuth();

  const isOnline = useOnlineStatus();
  const { showBanner: showInstallBanner, triggerInstall, dismiss: dismissInstall } = useInstallPrompt();
  const { showNotice: showCookieNotice, acknowledge: acknowledgeCookie } = useCookieNotice();
  const { currentView, setCurrentView } = useViewRouter();
  const [allUsers, setAllUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  // Quiz State (shared)
  const [statsByUserId, setStatsByUserId] = useState({});
  const duelLateDepsRef = useRef({});
  const flashcardLateDepsRef = useRef({});
  
  const GENERAL_KNOWLEDGE_STORAGE_KEY = 'general_knowledge_rotation_v1';
  const PRACTICAL_PASS_XP_BY_GRADE = {
    1: 40,
    2: 30,
    3: 20,
    4: 10,
    5: 0,
    6: 0
  };
  const PRACTICAL_ATTEMPTS_LOCAL_KEY = 'practical_exam_attempts_local_v1';
  const FLOCCULANT_PRODUCTS = [
    {
      id: 'pac_liquid_standard',
      label: 'PAC flüssig (Aluminiumbasis)',
      base: 'aluminum',
      continuousDoseMlPerM3: 0.12,
      shockDoseMlPerM3: 0.22
    },
    {
      id: 'aluminum_sulfate_solution',
      label: 'Aluminiumsulfat-Lösung',
      base: 'aluminum',
      continuousDoseMlPerM3: 0.15,
      shockDoseMlPerM3: 0.28
    },
    {
      id: 'ferric_chloride_solution',
      label: 'Eisen-III-chlorid-Lösung',
      base: 'iron',
      continuousDoseMlPerM3: 0.09,
      shockDoseMlPerM3: 0.18
    },
    {
      id: 'ferric_sulfate_solution',
      label: 'Eisen-III-sulfat-Lösung',
      base: 'iron',
      continuousDoseMlPerM3: 0.11,
      shockDoseMlPerM3: 0.2
    }
  ];
  const FLOCCULANT_PUMP_TYPES = [
    { id: 'peristaltic', label: 'Schlauchpumpe' },
    { id: 'diaphragm', label: 'Membrandosierpumpe' },
    { id: 'manual', label: 'Manuelle Literdosierung' }
  ];
  const FLOCCULANT_PUMP_MODELS = [
    {
      id: 'concept_420_smd',
      pumpTypeId: 'peristaltic',
      label: 'Concept 420 SMD',
      hoseOptions: [
        {
          id: 'blue_sk_3_2',
          color: 'Blau',
          label: 'SK 3,2 mm',
          innerDiameterMm: 3.2,
          minMlH: 15,
          maxMlH: 150,
          minPressureBar: 2.0,
          maxPressureBar: 2.5
        },
        {
          id: 'green_sk_4_0',
          color: 'Grün',
          label: 'SK 4,0 mm',
          innerDiameterMm: 4.0,
          minMlH: 40,
          maxMlH: 400,
          minPressureBar: 1.5,
          maxPressureBar: 2.0
        },
        {
          id: 'red_sk_4_0_reinforced',
          color: 'Rot',
          label: 'SK 4,0 mm (verstaerkt)',
          innerDiameterMm: 4.0,
          minMlH: 50,
          maxMlH: 500,
          minPressureBar: 2.0,
          maxPressureBar: 2.0
        },
        {
          id: 'black_sk_4_8',
          color: 'Schwarz',
          label: 'SK 4,8 mm',
          innerDiameterMm: 4.8,
          minMlH: 60,
          maxMlH: 600
        }
      ]
    },
    {
      id: 'chem_ad_vpp_e',
      pumpTypeId: 'peristaltic',
      label: 'Chem AD VPP E',
      hoseOptions: [
        {
          id: 'blue_sk_3_2',
          color: 'Blau',
          label: 'SK 3,2 mm',
          innerDiameterMm: 3.2,
          minMlH: 15,
          maxMlH: 150,
          minPressureBar: 2.0,
          maxPressureBar: 2.5
        },
        {
          id: 'green_sk_4_0',
          color: 'Grün',
          label: 'SK 4,0 mm',
          innerDiameterMm: 4.0,
          minMlH: 40,
          maxMlH: 400,
          minPressureBar: 1.5,
          maxPressureBar: 2.0
        },
        {
          id: 'red_sk_4_0_reinforced',
          color: 'Rot',
          label: 'SK 4,0 mm (verstaerkt)',
          innerDiameterMm: 4.0,
          minMlH: 50,
          maxMlH: 500,
          minPressureBar: 2.0,
          maxPressureBar: 2.0
        },
        {
          id: 'black_sk_4_8',
          color: 'Schwarz',
          label: 'SK 4,8 mm',
          innerDiameterMm: 4.8,
          minMlH: 60,
          maxMlH: 600
        }
      ]
    },
    {
      id: 'prominent_gamma_x',
      pumpTypeId: 'diaphragm',
      label: 'ProMinent gamma/X',
      minMlH: 40,
      maxMlH: 2000
    },
    {
      id: 'grundfos_dde_6_10',
      pumpTypeId: 'diaphragm',
      label: 'Grundfos DDE 6-10',
      minMlH: 60,
      maxMlH: 6000
    },
    {
      id: 'manual_litering',
      pumpTypeId: 'manual',
      label: 'Manuell (Liter an der Pumpe)'
    }
  ];
  const FLOCCULANT_LOAD_FACTORS = {
    low: 0.85,
    normal: 1,
    high: 1.2,
    peak: 1.35
  };
  const FLOCCULANT_WATER_FACTORS = {
    clear: 0.9,
    normal: 1,
    turbid: 1.2,
    severe: 1.35
  };
  const CHLORINATION_PRODUCTS = [
    {
      id: 'sodium_hypochlorite_13',
      label: 'Chlorbleichlauge (NaOCl, 13% Aktivchlor)',
      productType: 'liquid',
      activeChlorinePercent: 13,
      densityKgPerL: 1.2
    },
    {
      id: 'aktivchlor_granulate_56',
      label: 'Aktivchlor Granulat (56% Aktivchlor)',
      productType: 'solid',
      activeChlorinePercent: 56
    }
  ];
  const ANTICHLOR_PRODUCTS = [
    {
      id: 'antichlor_powder_100',
      label: 'Natriumthiosulfat Pulver (100%)',
      productType: 'solid',
      neutralizationFactorKgPerKgActiveChlorine: 1.8
    },
    {
      id: 'antichlor_solution_38',
      label: 'Natriumthiosulfat Lösung (38%)',
      productType: 'liquid',
      neutralizationFactorKgPerKgActiveChlorine: 4.74,
      densityKgPerL: 1.3
    }
  ];

  // Other State
  const [userStats, setUserStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
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
  const [examKeywordMode, setExamKeywordMode] = useState(false);
  const [examKeywordInput, setExamKeywordInput] = useState('');
  const [examKeywordEvaluation, setExamKeywordEvaluation] = useState(null);
  const [theoryExamHistory, setTheoryExamHistory] = useState([]);
  const [theoryExamHistoryLoading, setTheoryExamHistoryLoading] = useState(false);
  const [practicalExamType, setPracticalExamType] = useState('zwischen');
  const [practicalExamInputs, setPracticalExamInputs] = useState({});
  const [practicalExamResult, setPracticalExamResult] = useState(null);
  const [practicalExamTargetUserId, setPracticalExamTargetUserId] = useState('');
  const [practicalExamHistory, setPracticalExamHistory] = useState([]);
  const [practicalExamHistoryLoading, setPracticalExamHistoryLoading] = useState(false);
  const [practicalExamHistoryTypeFilter, setPracticalExamHistoryTypeFilter] = useState('alle');
  const [practicalExamHistoryUserFilter, setPracticalExamHistoryUserFilter] = useState('all');
  const [practicalExamComparisonType, setPracticalExamComparisonType] = useState('alle');
  
  // UI State – darkMode, soundEnabled, toasts, showToast, playSound vom AppContext
  const { darkMode, setDarkMode, soundEnabled, setSoundEnabled, toasts, setToasts, showToast, playSound } = useApp();

  const [devMode, setDevMode] = useState(false);

  // App Config State (Admin UI Editor)
  const [appConfig, setAppConfig] = useState({
    menuItems: DEFAULT_MENU_ITEMS,
    themeColors: DEFAULT_THEME_COLORS,
    featureFlags: { quizMaintenance: false },
    companies: ['Freizeitbad Oktopus'],
    announcement: { enabled: false, message: '' }
  });
  const [configLoaded, setConfigLoaded] = useState(false);
  const [showMehrDrawer, setShowMehrDrawer] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Badges State
  const [userBadges, setUserBadges] = useState([]);

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
  const [questionPerformance, setQuestionPerformance] = useState(() => {
    const parsed = parseJsonSafe(localStorage.getItem(QUESTION_PERFORMANCE_STORAGE_KEY), {});
    return (parsed && typeof parsed === 'object') ? parsed : {};
  });
  const [adaptiveLearningEnabled, setAdaptiveLearningEnabled] = useState(() => {
    const saved = localStorage.getItem(ADAPTIVE_LEARNING_STORAGE_KEY);
    if (saved === null) return true;
    return saved === 'true';
  });
  const [weeklyGoals, setWeeklyGoals] = useState(() => {
    const parsed = parseJsonSafe(localStorage.getItem(WEEKLY_GOALS_STORAGE_KEY), {});
    return {
      quizAnswers: sanitizeGoalValue(parsed.quizAnswers, WEEKLY_GOAL_DEFAULTS.quizAnswers),
      examAnswers: sanitizeGoalValue(parsed.examAnswers, WEEKLY_GOAL_DEFAULTS.examAnswers),
      flashcards: sanitizeGoalValue(parsed.flashcards, WEEKLY_GOAL_DEFAULTS.flashcards),
      checklistItems: sanitizeGoalValue(parsed.checklistItems, WEEKLY_GOAL_DEFAULTS.checklistItems)
    };
  });
  const [weeklyProgress, setWeeklyProgress] = useState(() => {
    const currentWeek = getWeekStartStamp();
    const parsed = parseJsonSafe(localStorage.getItem(WEEKLY_PROGRESS_STORAGE_KEY), null);
    if (!parsed || typeof parsed !== 'object') return buildEmptyWeeklyProgress(currentWeek);
    if (parsed.weekStart !== currentWeek) return buildEmptyWeeklyProgress(currentWeek);
    const rawStats = (parsed.stats && typeof parsed.stats === 'object') ? parsed.stats : {};
    return {
      weekStart: currentWeek,
      stats: {
        quizAnswers: sanitizeGoalValue(rawStats.quizAnswers, 0),
        examAnswers: sanitizeGoalValue(rawStats.examAnswers, 0),
        flashcards: sanitizeGoalValue(rawStats.flashcards, 0),
        checklistItems: sanitizeGoalValue(rawStats.checklistItems, 0)
      },
      updatedAt: parsed.updatedAt || Date.now()
    };
  });
  const [practicalChecklistProgress, setPracticalChecklistProgress] = useState(() => {
    const parsed = parseJsonSafe(localStorage.getItem(CHECKLIST_PROGRESS_STORAGE_KEY), {});
    return (parsed && typeof parsed === 'object') ? parsed : {};
  });
  const [questionReports, setQuestionReports] = useState(() => {
    const parsed = parseJsonSafe(localStorage.getItem(QUESTION_REPORTS_STORAGE_KEY), []);
    return Array.isArray(parsed) ? parsed : [];
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

  // Klasuren/Noten State
  const [examGrades, setExamGrades] = useState([]);
  const [selectedExamGradesUser, setSelectedExamGradesUser] = useState(null);
  const [allAzubisForExamGrades, setAllAzubisForExamGrades] = useState([]);

  // Swim state lives in useSwimChallenge hook

  const xpAwardQueueRef = useRef(Promise.resolve(0));

  // Calculator State
  const [calculatorType, setCalculatorType] = useState('ph');
  const [calculatorInputs, setCalculatorInputs] = useState({});
  const [calculatorResult, setCalculatorResult] = useState(null);
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  // Profil-Bearbeitung State: vollständig in ProfileView ausgelagert


  // Track last visited view for "Weiter machen" shortcut on Home
  useEffect(() => {
    if (currentView && currentView !== 'home') {
      localStorage.setItem('lastView', currentView);
    }
  }, [currentView]);

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
      toast.error(`${context} enthaelt unangemessene Inhalte und wurde blockiert. Bitte achte auf einen respektvollen Umgang.`);
      playSound('wrong');
      return false;
    }
    return true;
  };

  // Chat-State (extrahiert in eigenen Hook)
  const {
    messages, newMessage, setNewMessage,
    chatScope, setChatScope,
    selectedChatRecipientId, setSelectedChatRecipientId,
    hasChatOrganization, directChatCandidates,
    messageCount: chatMessageCount,
    sendMessage, deleteChatMessage: deleteChatMsg,
    loadChatMessages, normalizeChatMessageRow,
  } = useChatState({
    user,
    allUsers,
    showToast,
    moderateContent,
    sendNotification: async () => null,
  });

  // Notifications + Push + PWA (extrahiert in eigenen Hook)
  const {
    notifications, showNotificationsPanel, setShowNotificationsPanel,
    loadNotifications, sendNotification, sendNotificationToApprovedUsers,
    markNotificationAsRead, clearAllNotifications,
    pushDeviceState, enablePushNotifications, disablePushNotifications, syncPushSubscription,
    updateAvailable, updatingApp, applyPwaUpdate,
  } = useNotifications({
    user,
    authReady,
    allUsers,
    showToast,
    playSound,
  });

  const berichtsheft = useBerichtsheft({
    user,
    currentView,
    allUsers,
    showToast,
    sendNotification,
  });

  const duel = useDuelGame({
    user,
    showToast,
    playSound,
    sendNotification,
    allUsers,
    setCurrentView,
    userStats, setUserStats,
    statsByUserId, setStatsByUserId,
    lateDepsRef: duelLateDepsRef,
    questionPerformance,
    adaptiveLearningEnabled, setAdaptiveLearningEnabled,
    questionReports, setQuestionReports,
    sanitizeGoalValue,
  });

  const {
    flashcards, setFlashcards,
    currentFlashcard, setCurrentFlashcard,
    flashcardIndex, setFlashcardIndex,
    showFlashcardAnswer, setShowFlashcardAnswer,
    userFlashcards, setUserFlashcards,
    pendingFlashcards, setPendingFlashcards,
    newFlashcardFront, setNewFlashcardFront,
    newFlashcardBack, setNewFlashcardBack,
    newFlashcardCategory, setNewFlashcardCategory,
    keywordFlashcardMode, setKeywordFlashcardMode,
    whoAmIFlashcardMode, setWhoAmIFlashcardMode,
    flashcardKeywordInput, setFlashcardKeywordInput,
    flashcardKeywordEvaluation,
    flashcardFreeTextMode, setFlashcardFreeTextMode,
    spacedRepetitionMode, setSpacedRepetitionMode,
    dueCards,
    FLASHCARD_CONTENT,
    KEYWORD_FLASHCARD_CONTENT,
    WHO_AM_I_FLASHCARD_CONTENT,
    loadFlashcards,
    loadFlashcardsFromBackend,
    evaluateFlashcardKeywordAnswer,
    resetFlashcardKeywordState,
    approveFlashcard,
    deleteFlashcard,
    getCardSpacedData,
    updateCardSpacedData,
    loadDueCards,
    getDueCardCount,
    getTotalDueCards,
    getLevelColor,
    getLevelLabel,
  } = useFlashcards({
    showToast,
    playSound,
    newQuestionCategory,
    lateDepsRef: flashcardLateDepsRef,
  });

  const {
    swimChallengeView, setSwimChallengeView,
    swimSessions, setSwimSessions,
    swimSessionsLoaded,
    customSwimTrainingPlans,
    activeSwimChallenges,
    swimSessionForm, setSwimSessionForm,
    pendingSwimConfirmations,
    swimChallengeFilter, setSwimChallengeFilter,
    swimArenaMode, setSwimArenaMode,
    swimBattleHistory,
    swimBattleWinsByUserId,
    swimBattleResult,
    swimMonthlyResults,
    swimDuelForm, setSwimDuelForm,
    swimBossForm, setSwimBossForm,
    saveActiveSwimChallenges,
    loadCustomSwimTrainingPlans,
    createCustomSwimTrainingPlan,
    getSeaCreatureTier,
    getUserNameById,
    handleSwimDuelSubmit,
    handleSwimBossBattleSubmit,
    saveSwimSession,
    confirmSwimSession,
    rejectSwimSession,
    withdrawSwimSession,
    swimTrainingPlans,
    swimCurrentMonthLabel,
    swimCurrentMonthBattleStats,
    swimMonthlyDistanceRankingCurrentMonth,
    swimMonthlySwimmerCurrentMonth,
    swimYear,
    swimYearlySwimmerRanking,
  } = useSwimChallenge({
    user,
    allUsers,
    authReady,
    showToast,
    sendNotification,
  });

  // Schwimm-Badges prüfen wenn sich Sessions ändern
  useEffect(() => {
    if (user && swimSessions.length > 0) {
      checkBadges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swimSessions]);

  // Admin-Aktionen (nach useDuelGame, da duel.activeGames benötigt wird)
  const adminActions = useAdminActions({
    user,
    allUsers,
    pendingUsers,
    showToast,
    playSound,
    loadData: () => loadData(),
    appConfig,
    setAppConfig,
    statsSources: { materials, submittedQuestions, activeGames: duel.activeGames, chatMessageCount },
  });

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

  // Auth wird vollständig vom AuthContext verwaltet (src/context/AuthContext.jsx)

  useEffect(() => {
    if (!authReady) return;
    if (user) {
      loadData();
      loadNotifications();
      loadTheoryExamHistory();
      // Polling: nur leichte Daten (Notifications, Games, Messages) alle 30s
      // Pausiert wenn Quiz aktiv, um Re-Renders und Flicker zu vermeiden
      const interval = setInterval(() => {
        if (duel.quizActiveRef.current) return;
        loadLightData();
        loadNotifications();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [authReady, user]);

  useEffect(() => {
    if (!user?.id) return;
    applyGeneralKnowledge(false);
  }, [user?.id]);

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

    const practicalCandidates = allUsers.filter((account) => {
      if (!account?.id) return false;
      const role = String(account.role || '').toLowerCase();
      return role === 'azubi'
        || role === 'trainer'
        || role === 'ausbilder'
        || role === 'admin'
        || Boolean(account?.permissions?.canViewAllStats);
    });
    setPracticalExamTargetUserId((prev) => {
      if (prev && practicalCandidates.some(account => account.id === prev)) return prev;
      if (practicalCandidates.some(account => account.id === user.id)) return user.id;
      return practicalCandidates[0]?.id || user.id;
    });
  }, [user, allUsers]);

  useEffect(() => {
    if (!user?.id) return;
    if (currentView !== 'exam-simulator' || examSimulatorMode !== 'practical') return;
    void loadPracticalExamHistory();
  }, [user, currentView, examSimulatorMode]);

  // Sync quiz active ref for polling guard
  useEffect(() => {
    duel.quizActiveRef.current = duel.timerActive && currentView === 'quiz';
  }, [duel.timerActive, currentView]);

  // Automatisch reagieren wenn Gegner fertig gespielt hat (waitingForOpponent)
  useEffect(() => {
    if (!duel.currentGame?.id || !user?.name || !duel.waitingForOpponent) return;

    const updatedGame = duel.allGames.find(g => g.id === duel.currentGame.id) || duel.activeGames.find(g => g.id === duel.currentGame.id);
    if (!updatedGame) return;

    if (isFinishedGameStatus(updatedGame.status)) {
      if (duel.duelResult?.gameId !== updatedGame.id) {
        const opponentNameForStats = namesMatch(updatedGame.player1, user.name)
          ? updatedGame.player2
          : updatedGame.player1;
        const h2hFromGames = duel.buildHeadToHeadFromFinishedGames(duel.allGames, user.name, opponentNameForStats);
        duel.showDuelResultForGame(updatedGame, duel.allGames, h2hFromGames);
      }
      return;
    }

    const serverRound = updatedGame.categoryRound || 0;
    const localRound = duel.currentGame.categoryRound || 0;
    const myTurnNow = updatedGame.currentTurn === user.name;

    if (!myTurnNow && serverRound <= localRound) return;

    duel.syncQuizRuntimeFromPersistedGame(updatedGame);
  }, [duel.activeGames, duel.allGames, duel.duelResult]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (duel.timerActive && duel.timeLeft > 0 && !duel.answered) {
      const timer = setTimeout(() => {
        duel.setTimeLeft(duel.timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (duel.timeLeft === 0 && !duel.answered) {
      duel.handleTimeUp();
    }
  }, [duel.timeLeft, duel.timerActive, duel.answered]);

  // Check data retention only once on login, only for admins (endpoint requires admin role)
  useEffect(() => {
    if (!authReady || !user) return;
    if (user.role !== 'admin') return;
    checkDataRetention();
  }, [authReady, user]);

  useEffect(() => {
    // Load school attendance when view changes
    if (currentView === 'school-card' && user) {
      loadSchoolAttendance();
      if (canViewAllSchoolCards()) {
        loadAzubisForSchoolCard();
      }
    }

    // Load Klasuren when view changes (both standalone and within exams view)
    if ((currentView === 'exam-grades' || currentView === 'exams') && user) {
      loadExamGrades();
      if (canViewAllExamGrades()) {
        loadAzubisForExamGrades();
      }
    }

  }, [currentView, user]);

  useEffect(() => {
    localStorage.setItem(QUESTION_PERFORMANCE_STORAGE_KEY, JSON.stringify(questionPerformance));
  }, [questionPerformance]);

  useEffect(() => {
    localStorage.setItem(ADAPTIVE_LEARNING_STORAGE_KEY, adaptiveLearningEnabled ? 'true' : 'false');
  }, [adaptiveLearningEnabled]);

  useEffect(() => {
    localStorage.setItem(WEEKLY_GOALS_STORAGE_KEY, JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  useEffect(() => {
    localStorage.setItem(WEEKLY_PROGRESS_STORAGE_KEY, JSON.stringify(weeklyProgress));
  }, [weeklyProgress]);

  useEffect(() => {
    localStorage.setItem(CHECKLIST_PROGRESS_STORAGE_KEY, JSON.stringify(practicalChecklistProgress));
  }, [practicalChecklistProgress]);

  useEffect(() => {
    localStorage.setItem(QUESTION_REPORTS_STORAGE_KEY, JSON.stringify(questionReports));
  }, [questionReports]);

  useEffect(() => {
    const currentWeek = getWeekStartStamp();
    if (weeklyProgress.weekStart !== currentWeek) {
      setWeeklyProgress(buildEmptyWeeklyProgress(currentWeek));
    }
  }, [currentView, weeklyProgress.weekStart]);

  useEffect(() => {
    if (!user?.id || currentView !== 'home') return;

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const reminderInfo = parseJsonSafe(localStorage.getItem(WEEKLY_REMINDER_STORAGE_KEY), {});
    if (reminderInfo?.date === today) return;

    const goalKeys = Object.keys(WEEKLY_GOAL_DEFAULTS).filter((key) => sanitizeGoalValue(weeklyGoals[key], 0) > 0);
    if (goalKeys.length === 0) return;

    const progressRatio = goalKeys.reduce((sum, key) => {
      const target = sanitizeGoalValue(weeklyGoals[key], 0);
      const current = sanitizeGoalValue(weeklyProgress.stats?.[key], 0);
      const ratio = target > 0 ? Math.min(1, current / target) : 1;
      return sum + ratio;
    }, 0) / goalKeys.length;

    const weekday = ((now.getDay() + 6) % 7) + 1; // Montag=1 ... Sonntag=7
    const expectedRatio = weekday / 7;

    if (progressRatio + 0.12 < expectedRatio) {
      showToast('Wochenziel-Reminder: Du bist hinter deinem Wochenplan.', 'info', 4200);
      localStorage.setItem(WEEKLY_REMINDER_STORAGE_KEY, JSON.stringify({
        date: today,
        weekStart: weeklyProgress.weekStart
      }));
    }
  }, [user?.id, currentView, weeklyGoals, weeklyProgress]);

  // playSound + showToast + darkMode + soundEnabled kommen vom AppContext (siehe oben)

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
      explanation: `Bei ${chlorine} mg/L Chlor, ${alkalinity} mg/L Alkalinität${acidCapacity ? ` und ${acidCapacity} mmol/L Säurekapazität` : ''} ergibt sich ein pH-Wert von ${ph.toFixed(2)}. Optimal: 7,0-7,4`,
      recommendation: ph < 7.0 ? 'pH-Heber (Na₂CO₃) zugeben' : ph > 7.4 ? 'pH-Senker (NaHSO₄) zugeben' : 'pH-Wert optimal!',
      details: acidCapacity ? `Die Säurekapazität von ${acidCapacity} mmol/L zeigt die Pufferfähigkeit des Wassers an.` : null
    };
  };

  const calculateChlorine = (inputs) => {
    const poolVolume = parseDecimalInput(inputs.poolVolume);
    const currentChlorine = parseDecimalInput(inputs.currentChlorine);
    const targetChlorine = parseDecimalInput(inputs.targetChlorine);
    const chlorineDirection = inputs.chlorineDirection === 'decrease' ? 'decrease' : 'increase';

    if (
      poolVolume === null
      || currentChlorine === null
      || targetChlorine === null
      || poolVolume <= 0
      || currentChlorine < 0
      || targetChlorine < 0
    ) {
      return null;
    }

    const deltaMgPerL = targetChlorine - currentChlorine;

    if (chlorineDirection === 'increase') {
      if (deltaMgPerL <= 0) {
        return {
          result: '0,00 kg',
          explanation: `Aktueller Wert ${currentChlorine.toFixed(2).replace('.', ',')} mg/L liegt bereits auf/über Ziel ${targetChlorine.toFixed(2).replace('.', ',')} mg/L.`,
          recommendation: 'Kein Aufchloren notwendig.'
        };
      }

      const product = CHLORINATION_PRODUCTS.find((entry) => entry.id === inputs.chlorineProductId)
        || CHLORINATION_PRODUCTS[0];
      const dosingMethod = inputs.chlorineDosingMethod === 'plant' ? 'plant' : 'manual';
      const activeFraction = (product?.activeChlorinePercent || 0) / 100;
      if (!product || activeFraction <= 0) return null;

      const activeChlorineKg = (deltaMgPerL * poolVolume) / 1000;
      const productMassKg = activeChlorineKg / activeFraction;
      const productLiters = (product.productType === 'liquid' && Number.isFinite(product.densityKgPerL) && product.densityKgPerL > 0)
        ? (productMassKg / product.densityKgPerL)
        : null;

      if (dosingMethod === 'plant') {
        const plantRunHours = parseDecimalInput(inputs.chlorinePlantRunHours);
        if (plantRunHours === null || plantRunHours <= 0 || plantRunHours > 24) return null;

        const productKgPerHour = productMassKg / plantRunHours;
        const productLitersPerHour = productLiters !== null ? productLiters / plantRunHours : null;

        return {
          result: productLitersPerHour !== null
            ? `${productLitersPerHour.toFixed(3).replace('.', ',')} L/h`
            : `${productKgPerHour.toFixed(3).replace('.', ',')} kg/h`,
          explanation: `Aufchloren von ${currentChlorine.toFixed(2).replace('.', ',')} auf ${targetChlorine.toFixed(2).replace('.', ',')} mg/L bei ${poolVolume.toFixed(1).replace('.', ',')} m3.`,
          details: `Produkt: ${product.label}. Aktivchlor-Bedarf: ${activeChlorineKg.toFixed(3).replace('.', ',')} kg. Gesamtmenge Produkt: ${productLiters !== null ? `${productLiters.toFixed(3).replace('.', ',')} L` : `${productMassKg.toFixed(3).replace('.', ',')} kg`} für ${plantRunHours.toFixed(1).replace('.', ',')} h Anlagenlaufzeit.`,
          recommendation: `Chloranlage auf etwa ${productLitersPerHour !== null ? `${productLitersPerHour.toFixed(3).replace('.', ',')} L/h` : `${productKgPerHour.toFixed(3).replace('.', ',')} kg/h`} einstellen und nach 30-60 min nachmessen.`
        };
      }

      return {
        result: productLiters !== null
          ? `${productLiters.toFixed(3).replace('.', ',')} L`
          : `${productMassKg.toFixed(3).replace('.', ',')} kg`,
        explanation: `Aufchloren von ${currentChlorine.toFixed(2).replace('.', ',')} auf ${targetChlorine.toFixed(2).replace('.', ',')} mg/L bei ${poolVolume.toFixed(1).replace('.', ',')} m3.`,
        details: `Produkt: ${product.label}. Aktivchlor-Bedarf: ${activeChlorineKg.toFixed(3).replace('.', ',')} kg.`,
        recommendation: `Produktmenge ${productLiters !== null ? `${productLiters.toFixed(3).replace('.', ',')} L` : `${productMassKg.toFixed(3).replace('.', ',')} kg`} in Teilgaben dosieren und nach 30-60 min kontrollieren.`
      };
    }

    const reductionMgPerL = currentChlorine - targetChlorine;
    if (reductionMgPerL <= 0) {
      return {
        result: '0,00 kg',
        explanation: `Aktueller Wert ${currentChlorine.toFixed(2).replace('.', ',')} mg/L liegt bereits auf/unter Ziel ${targetChlorine.toFixed(2).replace('.', ',')} mg/L.`,
        recommendation: 'Kein Runterchloren notwendig.'
      };
    }

    const antichlorProduct = ANTICHLOR_PRODUCTS.find((entry) => entry.id === inputs.antichlorProductId)
      || ANTICHLOR_PRODUCTS[0];
    if (!antichlorProduct) return null;

    const activeChlorineToNeutralizeKg = (reductionMgPerL * poolVolume) / 1000;
    const antichlorMassKg = activeChlorineToNeutralizeKg * (antichlorProduct.neutralizationFactorKgPerKgActiveChlorine || 0);
    if (!Number.isFinite(antichlorMassKg) || antichlorMassKg < 0) return null;

    const antichlorLiters = (antichlorProduct.productType === 'liquid'
      && Number.isFinite(antichlorProduct.densityKgPerL)
      && antichlorProduct.densityKgPerL > 0)
      ? antichlorMassKg / antichlorProduct.densityKgPerL
      : null;

    return {
      result: antichlorLiters !== null
        ? `${antichlorLiters.toFixed(3).replace('.', ',')} L`
        : `${antichlorMassKg.toFixed(3).replace('.', ',')} kg`,
      explanation: `Runterchloren von ${currentChlorine.toFixed(2).replace('.', ',')} auf ${targetChlorine.toFixed(2).replace('.', ',')} mg/L bei ${poolVolume.toFixed(1).replace('.', ',')} m3.`,
      details: `Produkt: ${antichlorProduct.label}. Zu neutralisieren: ${activeChlorineToNeutralizeKg.toFixed(3).replace('.', ',')} kg Aktivchlor.`,
      recommendation: `${antichlorLiters !== null ? `${antichlorLiters.toFixed(3).replace('.', ',')} L` : `${antichlorMassKg.toFixed(3).replace('.', ',')} kg`} Anti-Chlor in 2-3 Teilgaben dosieren, gut umwälzen und nach 15-30 min erneut messen.`
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

  const parseDecimalInput = (value) => {
    const normalized = String(value ?? '').trim().replace(',', '.');
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const formatClockTimeFromMinutes = (totalMinutesInput) => {
    const safeMinutes = Math.max(0, Math.round(totalMinutesInput));
    const hours = Math.floor(safeMinutes / 60);
    const minutes = safeMinutes % 60;
    return `${hours}:${String(minutes).padStart(2, '0')} h`;
  };

  const formatMl = (valueMlInput) => {
    const valueMl = Number(valueMlInput) || 0;
    return `${valueMl.toFixed(0).replace('.', ',')} ml`;
  };

  const formatLitersFromMl = (valueMlInput) => {
    const valueMl = Number(valueMlInput) || 0;
    return `${(valueMl / 1000).toFixed(3).replace('.', ',')} L`;
  };

  const resolveFlocculantPumpCapacity = (pumpTypeId, pumpModelId, hoseSizeInput) => {
    const fallbackModel = FLOCCULANT_PUMP_MODELS.find((model) => model.pumpTypeId === pumpTypeId) || null;
    const model = FLOCCULANT_PUMP_MODELS.find(
      (entry) => entry.id === pumpModelId && entry.pumpTypeId === pumpTypeId
    ) || fallbackModel;

    if (!model) {
      return {
        pumpModel: null,
        maxMlH: null,
        minMlH: null,
        selectedHoseSize: null,
        selectedHoseOption: null
      };
    }

    if (pumpTypeId === 'peristaltic') {
      const hoseOptionsFromArray = Array.isArray(model.hoseOptions) ? model.hoseOptions : [];
      if (hoseOptionsFromArray.length > 0) {
        const normalizedInput = String(hoseSizeInput || '').trim();
        const selectedHoseOption = hoseOptionsFromArray.find((option) => option.id === normalizedInput) || hoseOptionsFromArray[0];

        return {
          pumpModel: model,
          maxMlH: selectedHoseOption?.maxMlH ?? null,
          minMlH: selectedHoseOption?.minMlH ?? null,
          selectedHoseSize: selectedHoseOption?.id ?? null,
          selectedHoseOption
        };
      }

      const hoseOptions = Object.keys(model.maxMlHByHose || {});
      if (hoseOptions.length === 0) {
        return {
          pumpModel: model,
          maxMlH: null,
          minMlH: null,
          selectedHoseSize: null,
          selectedHoseOption: null
        };
      }

      const normalizedInput = String(Math.max(1, Math.round(parseDecimalInput(hoseSizeInput) || 0)));
      const selectedHoseSize = hoseOptions.includes(normalizedInput) ? normalizedInput : hoseOptions[0];

      return {
        pumpModel: model,
        maxMlH: model.maxMlHByHose?.[selectedHoseSize] ?? null,
        minMlH: model.minMlHByHose?.[selectedHoseSize] ?? null,
        selectedHoseSize,
        selectedHoseOption: {
          id: selectedHoseSize,
          label: `SK ${selectedHoseSize} mm`,
          innerDiameterMm: parseDecimalInput(selectedHoseSize),
          minMlH: model.minMlHByHose?.[selectedHoseSize] ?? null,
          maxMlH: model.maxMlHByHose?.[selectedHoseSize] ?? null
        }
      };
    }

    return {
      pumpModel: model,
      maxMlH: model.maxMlH ?? null,
      minMlH: model.minMlH ?? null,
      selectedHoseSize: null,
      selectedHoseOption: null
    };
  };

  const calculateIndustrialTime = (inputs) => {
    const mode = inputs.industrialMode || 'clockToIndustrial';

    if (mode === 'clockToIndustrial') {
      const hours = parseDecimalInput(inputs.clockHours);
      const minutes = parseDecimalInput(inputs.clockMinutes);
      if (hours === null || minutes === null || hours < 0 || minutes < 0 || minutes >= 60) {
        return null;
      }

      const totalMinutes = (hours * 60) + minutes;
      const industrialHours = totalMinutes / 60;
      const industrialMinutes = totalMinutes * (100 / 60);

      return {
        result: `${industrialHours.toFixed(2).replace('.', ',')} h`,
        explanation: `${hours} h ${minutes} min entsprechen ${totalMinutes.toFixed(0)} Minuten Gesamtzeit.`,
        details: `Industrieminuten: ${industrialMinutes.toFixed(2).replace('.', ',')} min`,
        recommendation: `Als Industriezeit kannst du ${industrialHours.toFixed(2).replace('.', ',')} h abrechnen.`
      };
    }

    const industrialHours = parseDecimalInput(inputs.industrialHours);
    if (industrialHours === null || industrialHours < 0) {
      return null;
    }

    const totalMinutes = industrialHours * 60;
    const industrialMinutes = industrialHours * 100;

    return {
      result: formatClockTimeFromMinutes(totalMinutes),
      explanation: `${industrialHours.toFixed(2).replace('.', ',')} Industriestunden entsprechen ${totalMinutes.toFixed(1).replace('.', ',')} Realminuten.`,
      details: `Industrieminuten gesamt: ${industrialMinutes.toFixed(2).replace('.', ',')} min`,
      recommendation: `In Uhrzeit entspricht das ${formatClockTimeFromMinutes(totalMinutes)}.`
    };
  };

  const calculateDilution = (inputs) => {
    const concentrateParts = parseDecimalInput(inputs.concentrateParts);
    const ratioValue = parseDecimalInput(inputs.ratioValue);
    const containerSize = parseDecimalInput(inputs.containerSize);
    const containerCount = parseDecimalInput(inputs.containerCount);
    const containerUnit = inputs.containerUnit === 'ml' ? 'ml' : 'l';
    const dilutionMode = inputs.dilutionMode || 'partToWater';

    if (
      concentrateParts === null
      || ratioValue === null
      || containerSize === null
      || containerCount === null
      || concentrateParts <= 0
      || ratioValue <= 0
      || containerSize <= 0
      || containerCount <= 0
    ) {
      return null;
    }

    const roundedContainerCount = Math.max(1, Math.floor(containerCount));
    const volumePerContainerMl = containerUnit === 'l' ? containerSize * 1000 : containerSize;
    if (!Number.isFinite(volumePerContainerMl) || volumePerContainerMl <= 0) {
      return null;
    }

    const totalParts = dilutionMode === 'partToTotal'
      ? ratioValue
      : concentrateParts + ratioValue;

    if (!Number.isFinite(totalParts) || totalParts <= concentrateParts) {
      return null;
    }

    const totalVolumeMl = volumePerContainerMl * roundedContainerCount;
    const concentrateTotalMl = totalVolumeMl * (concentrateParts / totalParts);
    const waterTotalMl = totalVolumeMl - concentrateTotalMl;

    const concentratePerContainerMl = concentrateTotalMl / roundedContainerCount;
    const waterPerContainerMl = waterTotalMl / roundedContainerCount;

    const ratioText = `${concentrateParts.toString().replace('.', ',')}:${ratioValue.toString().replace('.', ',')}`;
    const modeText = dilutionMode === 'partToTotal'
      ? 'Interpretation: 1:10 bedeutet 1 Teil in 10 Teilen gesamt'
      : 'Interpretation: 1:10 bedeutet 1 Teil + 10 Teile Wasser';

    const roundTo = (value, step = 5) => Math.round(value / step) * step;
    const concentrateRoundedMl = roundTo(concentratePerContainerMl, 5);
    const waterRoundedMl = roundTo(waterPerContainerMl, 5);

    return {
      result: `${formatLitersFromMl(concentrateTotalMl)} Konzentrat`,
      explanation: `${ratioText} für ${roundedContainerCount} Behaelter a ${containerSize.toString().replace('.', ',')} ${containerUnit === 'l' ? 'L' : 'ml'}. ${modeText}.`,
      details: `Pro Behaelter: ${formatMl(concentratePerContainerMl)} Konzentrat + ${formatMl(waterPerContainerMl)} Wasser. Gesamtmenge: ${formatLitersFromMl(totalVolumeMl)}.`,
      recommendation: `Praxiswert je Behaelter (auf 5 ml gerundet): ${concentrateRoundedMl} ml Konzentrat + ${waterRoundedMl} ml Wasser. Gesamt Wasser: ${formatLitersFromMl(waterTotalMl)}.`
    };
  };

  const calculateFlocculation = (inputs) => {
    const circulationFlow = parseDecimalInput(inputs.circulationFlow);
    const poolVolume = parseDecimalInput(inputs.poolVolume);
    const dosingHoursPerDay = parseDecimalInput(inputs.dosingHoursPerDay);
    const stockConcentrationPercent = parseDecimalInput(inputs.stockConcentrationPercent);
    const stockTankLiters = parseDecimalInput(inputs.stockTankLiters);
    const pumpTypeId = inputs.flocPumpTypeId || 'peristaltic';
    const pumpModelId = inputs.flocPumpModelId || '';
    const flocculationMode = inputs.flocculationMode === 'shock' ? 'shock' : 'continuous';
    const loadProfile = inputs.loadProfile || 'normal';
    const waterCondition = inputs.waterCondition || 'normal';

    if (
      circulationFlow === null
      || poolVolume === null
      || dosingHoursPerDay === null
      || stockConcentrationPercent === null
      || stockTankLiters === null
      || circulationFlow <= 0
      || poolVolume <= 0
      || dosingHoursPerDay <= 0
      || dosingHoursPerDay > 24
      || stockConcentrationPercent <= 0
      || stockConcentrationPercent > 100
      || stockTankLiters <= 0
    ) {
      return null;
    }

    const product = FLOCCULANT_PRODUCTS.find((item) => item.id === inputs.flocProductId)
      || FLOCCULANT_PRODUCTS[0];
    if (!product) return null;

    const loadFactor = FLOCCULANT_LOAD_FACTORS[loadProfile] || 1;
    const waterFactor = FLOCCULANT_WATER_FACTORS[waterCondition] || 1;
    const baseDoseMlPerM3 = flocculationMode === 'shock'
      ? product.shockDoseMlPerM3
      : product.continuousDoseMlPerM3;
    const adjustedDoseMlPerM3 = baseDoseMlPerM3 * loadFactor * waterFactor;

    const pureProductMlH = circulationFlow * adjustedDoseMlPerM3;
    const pureProductMlDay = pureProductMlH * dosingHoursPerDay;

    const stockFraction = stockConcentrationPercent / 100;
    const stockSolutionMlH = pureProductMlH / stockFraction;
    const stockSolutionMlDay = stockSolutionMlH * dosingHoursPerDay;

    const turnoversPerDay = (circulationFlow * dosingHoursPerDay) / poolVolume;
    const tankRuntimeHours = stockSolutionMlH > 0
      ? (stockTankLiters * 1000) / stockSolutionMlH
      : null;
    const tankProductLiters = stockTankLiters * stockFraction;
    const tankWaterLiters = Math.max(0, stockTankLiters - tankProductLiters);

    const {
      pumpModel,
      maxMlH,
      minMlH,
      selectedHoseSize,
      selectedHoseOption
    } = resolveFlocculantPumpCapacity(pumpTypeId, pumpModelId, inputs.flocHoseSizeMm);

    const modelCapacityInfo = (() => {
      if (!pumpModel || !maxMlH) return null;
      const settingPercent = (stockSolutionMlH / maxMlH) * 100;
      const minPercent = minMlH ? (minMlH / maxMlH) * 100 : 0;
      return { settingPercent, minPercent };
    })();

    let recommendation = `Ziel-Dosierung: ${adjustedDoseMlPerM3.toFixed(3).replace('.', ',')} ml/m3 (Produkt).`;
    if (pumpTypeId === 'manual') {
      recommendation = `Manuell pro Tag dosieren: ${(pureProductMlDay / 1000).toFixed(2).replace('.', ',')} L Produkt.`;
    } else if (!pumpModel || !maxMlH) {
      recommendation = `Pumpenmodell oder Kapazität fehlt. Zielzufuhr: ${(stockSolutionMlH / 1000).toFixed(3).replace('.', ',')} L/h Dosierloesung.`;
    } else if (modelCapacityInfo.settingPercent > 100) {
      recommendation = `Pumpe zu klein: benoetigt ${(stockSolutionMlH / 1000).toFixed(3).replace('.', ',')} L/h, Modell schafft ${(maxMlH / 1000).toFixed(3).replace('.', ',')} L/h.`;
    } else if (modelCapacityInfo.minPercent > 0 && modelCapacityInfo.settingPercent < modelCapacityInfo.minPercent) {
      recommendation = `Pumpe läuft unter Mindestbereich. Stellwert waere ${modelCapacityInfo.settingPercent.toFixed(1).replace('.', ',')}%. Größere Verduennung oder kleineres Modell nutzen.`;
    } else {
      recommendation = `Pumpeneinstellung: ca. ${modelCapacityInfo.settingPercent.toFixed(1).replace('.', ',')}% (${(stockSolutionMlH / 1000).toFixed(3).replace('.', ',')} L/h).`;
    }

    const hoseLabel = selectedHoseOption?.label || (selectedHoseSize ? `${selectedHoseSize} mm` : '');
    const hoseColorText = selectedHoseOption?.color ? `${selectedHoseOption.color} ` : '';
    const pressureLower = Number.isFinite(selectedHoseOption?.minPressureBar) ? selectedHoseOption.minPressureBar : null;
    const pressureUpper = Number.isFinite(selectedHoseOption?.maxPressureBar) ? selectedHoseOption.maxPressureBar : null;
    const pressureText = (() => {
      if (pressureLower !== null && pressureUpper !== null) {
        if (Math.abs(pressureLower - pressureUpper) < 0.001) {
          return `${pressureLower.toFixed(1).replace('.', ',')} bar`;
        }
        return `${pressureLower.toFixed(1).replace('.', ',')} - ${pressureUpper.toFixed(1).replace('.', ',')} bar`;
      }
      if (pressureUpper !== null) return `${pressureUpper.toFixed(1).replace('.', ',')} bar`;
      if (pressureLower !== null) return `${pressureLower.toFixed(1).replace('.', ',')} bar`;
      return null;
    })();
    const hoseText = hoseLabel ? ` | Schlauch: ${hoseColorText}${hoseLabel}` : '';
    const hosePressureText = pressureText ? ` | Druckbereich: ${pressureText}` : '';
    const modelText = pumpModel ? `${pumpModel.label}${hoseText}` : 'kein Modell';

    return {
      result: `${(stockSolutionMlH / 1000).toFixed(3).replace('.', ',')} L/h Dosierloesung`,
      explanation: `${product.label} (${product.base === 'aluminum' ? 'Aluminiumbasis' : 'Eisenbasis'}) bei ${circulationFlow.toFixed(1).replace('.', ',')} m3/h Umwälzung. Berechnung für ${flocculationMode === 'shock' ? 'Stoss' : 'kontinuierliche'} Flockung.`,
      details: `Produktbedarf: ${(pureProductMlH / 1000).toFixed(3).replace('.', ',')} L/h bzw. ${(pureProductMlDay / 1000).toFixed(2).replace('.', ',')} L/Tag. | Dosierloesung: ${(stockSolutionMlDay / 1000).toFixed(2).replace('.', ',')} L/Tag bei ${stockConcentrationPercent.toFixed(1).replace('.', ',')}% Ansatz. | Modell: ${modelText}${hosePressureText}. | Becken-Umwälzungen/Tag: ${turnoversPerDay.toFixed(2).replace('.', ',')}. | Ansatz für ${stockTankLiters.toFixed(1).replace('.', ',')} L: ${tankProductLiters.toFixed(2).replace('.', ',')} L Produkt + ${tankWaterLiters.toFixed(2).replace('.', ',')} L Wasser. | Tankreichweite: ${tankRuntimeHours ? `${tankRuntimeHours.toFixed(1).replace('.', ',')} h` : '-'}.`,
      recommendation
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
      case 'industrialTime':
        result = calculateIndustrialTime(calculatorInputs);
        break;
      case 'dilution':
        result = calculateDilution(calculatorInputs);
        break;
      case 'flocculation':
        result = calculateFlocculation(calculatorInputs);
        break;
    }
    
    setCalculatorResult(result);
    if (result) playSound('correct');
  };

  const checkDataRetention = async () => {
    try {
      const users = await dsLoadRetentionCandidates();

      if (!users || users.length === 0) {
        if (import.meta.env.DEV) console.log('No users found or Supabase error');
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
      await dsPurgeUserData(userId, userName);

      console.log(`Alle Daten für ${email} gelöscht`);
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  };

  const getTodayStamp = (input = Date.now()) => {
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  };

  const getGeneralKnowledgePool = () => {
    const merged = [...DAILY_WISDOM, ...DID_YOU_KNOW_FACTS];
    const unique = [];
    const seen = new Set();
    merged.forEach((entry) => {
      const text = String(entry || '').trim();
      if (!text) return;
      if (seen.has(text)) return;
      seen.add(text);
      unique.push(text);
    });
    return unique;
  };

  const pickRandomGeneralKnowledge = (excludeText = '') => {
    const pool = getGeneralKnowledgePool();
    if (pool.length === 0) return '';
    const filtered = excludeText ? pool.filter(text => text !== excludeText) : pool;
    const source = filtered.length > 0 ? filtered : pool;
    return source[Math.floor(Math.random() * source.length)];
  };

  const applyGeneralKnowledge = (forceRotate = false) => {
    const todayStamp = getTodayStamp();
    let stored = null;

    try {
      stored = JSON.parse(localStorage.getItem(GENERAL_KNOWLEDGE_STORAGE_KEY) || 'null');
    } catch {
      stored = null;
    }

    const storedText = typeof stored?.text === 'string' ? stored.text.trim() : '';
    const storedDay = typeof stored?.day === 'string' ? stored.day : '';

    if (!forceRotate && storedDay === todayStamp && storedText) {
      setDailyWisdom(storedText);
      return storedText;
    }

    const nextText = pickRandomGeneralKnowledge(storedText) || storedText;
    if (!nextText) return '';

    setDailyWisdom(nextText);
    try {
      localStorage.setItem(GENERAL_KNOWLEDGE_STORAGE_KEY, JSON.stringify({
        day: todayStamp,
        text: nextText,
        updatedAt: new Date().toISOString()
      }));
    } catch {
      // localStorage write can fail in private mode; UI fallback still works.
    }
    return nextText;
  };

  const rotateGeneralKnowledge = () => {
    const nextText = applyGeneralKnowledge(true);
    if (nextText) {
      showToast('Neue Allgemeinbildung geladen.', 'info', 1800);
    }
  };

  // handleLogin, handleRegister, handleLogout werden vom AuthContext bereitgestellt

  // Leichte Daten für Polling (alle 30s) — nur schnell ändernde Tabellen
  const loadLightData = async () => {
    try {
      // Games aktualisieren
      const games = await dsLoadGames(100, user?.id);
      if (games.length > 0) {
        const normalized = games.map(g => ({
          ...g,
          challengeTimeoutMinutes: normalizeChallengeTimeoutMinutes(g.challengeTimeoutMinutes)
        }));
        duel.setAllGames(normalized);
        duel.setActiveGames(normalized.filter(g => g.status !== 'finished'));
        updateLeaderboard(normalized, allUsers);
        if (user?.name) {
          setUserStats(prevStats => syncQuizTotalsIntoStats(prevStats, normalized, user.name));
        }
      }

      // Messages aktualisieren
      const userDirectory = Object.fromEntries(
        (allUsers || []).filter(a => a?.id).map(a => [a.id, a])
      );
      await loadChatMessages(userDirectory, user?.role);
    } catch (error) {
      console.log('Light data refresh error:', error.message);
    }
  };

  const loadData = async () => {
    try {
      let visibleUsers = [];

      // Load App Config
      try {
        const configResult = await dsLoadAppConfig();
        if (configResult) {
          const loadedMenuItems = mergeMenuItemsWithDefaults(configResult.menuItems);
          const loadedThemeColors = configResult.themeColors && Object.keys(configResult.themeColors).length > 0
            ? configResult.themeColors
            : DEFAULT_THEME_COLORS;
          const loadedCompanies = Array.isArray(configResult.companies) && configResult.companies.length > 0
            ? configResult.companies
            : ['Freizeitbad Oktopus'];
          const loadedAnnouncement = configResult.announcement && typeof configResult.announcement === 'object'
            ? configResult.announcement
            : { enabled: false, message: '' };
          const loadedFeatureFlags = configResult.featureFlags && typeof configResult.featureFlags === 'object'
            ? { quizMaintenance: false, ...configResult.featureFlags }
            : { quizMaintenance: false };
          setAppConfig({ menuItems: loadedMenuItems, themeColors: loadedThemeColors, featureFlags: loadedFeatureFlags, companies: loadedCompanies, announcement: loadedAnnouncement });
        }
        setConfigLoaded(true);
      } catch (err) {
        console.error('Config load error:', err);
        setConfigLoaded(true);
      }

      // Load users
      const usersResult = await dsLoadUsers(user);
      visibleUsers = usersResult.allUsers;
      setAllUsers(usersResult.allUsers);
      if (usersResult.pendingUsers.length > 0) {
        setPendingUsers(usersResult.pendingUsers);
      }

      await loadCustomSwimTrainingPlans();

      // Load games
      const gamesRaw = await dsLoadGames(200, user?.id);
      const gamesData = gamesRaw; // keep reference for stats sync below
      if (gamesRaw.length > 0) {
        const games = gamesRaw.map(g => ({
          ...g,
          challengeTimeoutMinutes: normalizeChallengeTimeoutMinutes(g.challengeTimeoutMinutes)
        }));
        duel.setAllGames(games);
        duel.setActiveGames(games.filter(g => g.status !== 'finished'));
        updateLeaderboard(games, allUsers);
        await duel.checkExpiredAndRemindGames(games);
      }

      // Load all user stats for trainer dashboard cards
      try {
        const allStatsData = await dsGetAllUserStats();
        const nextStatsByUserId = {};
        (allStatsData || []).forEach(row => {
          const wins = row.wins || 0;
          const losses = row.losses || 0;
          const draws = row.draws || 0;
          const xpMeta = getXpMetaFromCategoryStats(row.category_stats || row.categoryStats || {});
          nextStatsByUserId[row.user_id || row.userId] = {
            wins, losses, draws,
            total: wins + losses + draws,
            totalXp: xpMeta.totalXp,
            xpBreakdown: xpMeta.breakdown
          };
        });
        setStatsByUserId(nextStatsByUserId);
      } catch (e) {
        console.log('All stats load error:', e.message);
        setStatsByUserId({});
      }

      // Load user stats — restore from finished games if needed
      if (user && user.id && gamesData) {
        try {
          const statsData = await dsGetUserStats(user);
          let stats = buildUserStatsFromRow(statsData);
          let shouldPersistStats = doesUserStatsRowNeedRepair(statsData, stats);
          const currentUserName = normalizePlayerName(user.name);
          const finishedGames = (gamesData || []).filter(g => {
            if (!isCountableFinishedQuizGame(g)) return false;
            const p1 = normalizePlayerName(g.player1);
            const p2 = normalizePlayerName(g.player2);
            return p1 === currentUserName || p2 === currentUserName;
          });
          const syncedStats = buildQuizTotalsFromFinishedGames(finishedGames, currentUserName, stats);
          const storedTotalGames = stats.wins + stats.losses + stats.draws;
          const syncedTotalGames = syncedStats.wins + syncedStats.losses + syncedStats.draws;
          const shouldRestoreQuizTotals =
            (storedTotalGames === 0 && syncedTotalGames > 0) ||
            syncedTotalGames > storedTotalGames;

          const syncedTotals = syncQuizTotalsIntoStats(stats, finishedGames, currentUserName);
          if (haveQuizTotalsChanged(stats, syncedTotals)) {
            stats = syncedTotals;
          }

          if (shouldPersistStats) {
            await duel.saveUserStatsToSupabase(user, stats);
          }

          setUserStats(stats);
        } catch (e) {
          console.log('Stats load:', e);
          setUserStats(ensureUserStatsStructure(createEmptyUserStats()));
        }
      }

      // Load messages
      const userDirectory = Object.fromEntries(
        (visibleUsers || []).filter(a => a?.id).map(a => [a.id, a])
      );
      await loadChatMessages(userDirectory, user?.role);

      // Load custom questions
      const customQuestions = await dsLoadCustomQuestions();
      setSubmittedQuestions(customQuestions);

      // Load reported question feedback
      if (user?.permissions?.canManageUsers) {
        try {
          const remoteReports = await dsLoadQuestionReports();
          // Enrich with questionKey if missing
          const enriched = remoteReports.map(r => ({
            ...r,
            questionKey: r.questionKey || duel.getQuestionPerformanceKey({ q: r.questionText, category: r.category }, r.category)
          }));
          const localReports = parseJsonSafe(localStorage.getItem(QUESTION_REPORTS_STORAGE_KEY), []);
          const safeLocalReports = Array.isArray(localReports) ? localReports : [];
          const merged = [...enriched];
          const seen = new Set(enriched.map(e => `${e.questionKey}|${e.createdAt}|${e.reportedBy}`));
          safeLocalReports.forEach(entry => {
            const key = `${entry.questionKey}|${entry.createdAt}|${entry.reportedBy}`;
            if (!seen.has(key)) { seen.add(key); merged.push(entry); }
          });
          setQuestionReports(merged.slice(0, 500));
        } catch { console.log('question_reports load skipped'); }
      }

      // Load materials
      setMaterials(await dsLoadMaterials());

      // Load resources
      try { setResources(await dsLoadResources()); }
      catch (err) { console.error('Resources fetch failed:', err); }

      // Load news
      setNews(await dsLoadNews());

      // Load exams
      setExams(await dsLoadExams());

      // Load flashcards via hook (sets userFlashcards + pendingFlashcards)
      await loadFlashcardsFromBackend();

      // Load user badges from Supabase
      if (user?.id) {
        setUserBadges(await dsLoadUserBadges(user));
      }
    } catch (error) {
      console.log('Loading data - some features may not work:', error.message);
    }
  };

  const updateLeaderboard = (games, users) => {
    const stats = {};

    // Nur vollständig gespielte Spiele zählen
    games.filter(isCountableFinishedQuizGame).forEach(game => {
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

  const queueXpAwardForUser = (targetUserInput, sourceKey, amount, options = {}) => {
    const xpAmount = toSafeInt(amount);
    const targetUserId = targetUserInput?.id || null;
    const targetUserName = targetUserInput?.name || null;

    if (!targetUserId || !targetUserName || xpAmount <= 0) {
      return Promise.resolve(0);
    }

    const { eventKey = null, reason = null, showXpToast = false } = options;

    xpAwardQueueRef.current = xpAwardQueueRef.current
      .then(async () => {
        const currentStats = await duel.getUserStatsFromSupabase({ id: targetUserId, name: targetUserName });
        const baseStats = ensureUserStatsStructure(currentStats || createEmptyUserStats());
        const { stats: xpUpdatedStats, addedXp } = addXpToStats(baseStats, sourceKey, xpAmount, eventKey);
        if (addedXp <= 0) {
          return 0;
        }

        await duel.saveUserStatsToSupabase({ id: targetUserId, name: targetUserName }, xpUpdatedStats);
        if (targetUserId === user?.id) {
          setUserStats(xpUpdatedStats);
        }
        setStatsByUserId(prev => {
          const wins = xpUpdatedStats.wins || 0;
          const losses = xpUpdatedStats.losses || 0;
          const draws = xpUpdatedStats.draws || 0;
          return {
            ...prev,
            [targetUserId]: {
              ...(prev[targetUserId] || {}),
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
          const isCurrentUserTarget = targetUserId === user?.id;
          const toastPrefix = isCurrentUserTarget ? `+${addedXp} XP` : `${targetUserName}: +${addedXp} XP`;
          showToast(`${toastPrefix}${reason ? ` • ${reason}` : ''}`, 'success', 2500);
        }
        return addedXp;
      })
      .catch(error => {
        console.error('XP update error:', error);
        return 0;
      });

    return xpAwardQueueRef.current;
  };

  const queueXpAward = (sourceKey, amount, options = {}) => {
    if (!user?.id || !user?.name) {
      return Promise.resolve(0);
    }
    return queueXpAwardForUser({ id: user.id, name: user.name }, sourceKey, amount, options);
  };

  const trackQuestionPerformance = (question, categoryHint, isCorrect) => {
    if (!question) return;
    const key = duel.getQuestionPerformanceKey(question, categoryHint);
    setQuestionPerformance((prev) => {
      const current = (prev && typeof prev[key] === 'object') ? prev[key] : {};
      const attempts = sanitizeGoalValue(current.attempts, 0) + 1;
      const correct = sanitizeGoalValue(current.correct, 0) + (isCorrect ? 1 : 0);
      const wrong = sanitizeGoalValue(current.wrong, 0) + (isCorrect ? 0 : 1);
      const wrongStreak = isCorrect ? 0 : sanitizeGoalValue(current.wrongStreak, 0) + 1;
      return {
        ...prev,
        [key]: {
          attempts,
          correct,
          wrong,
          wrongStreak,
          lastSeen: Date.now(),
          lastResult: isCorrect ? 'correct' : 'wrong'
        }
      };
    });
  };

  const updateWeeklyProgress = (metric, delta = 1) => {
    const deltaInt = Math.round(Number(delta));
    if (!Number.isFinite(deltaInt) || deltaInt === 0) return;
    if (!(metric in WEEKLY_PROGRESS_TEMPLATE)) return;

    const currentWeek = getWeekStartStamp();
    setWeeklyProgress((prev) => {
      const safePrev = (prev && typeof prev === 'object') ? prev : buildEmptyWeeklyProgress(currentWeek);
      const base = safePrev.weekStart === currentWeek
        ? safePrev
        : buildEmptyWeeklyProgress(currentWeek);
      const currentValue = sanitizeGoalValue(base.stats?.[metric], 0);
      const nextValue = Math.max(0, currentValue + deltaInt);
      return {
        weekStart: currentWeek,
        stats: {
          ...WEEKLY_PROGRESS_TEMPLATE,
          ...(base.stats || {}),
          [metric]: nextValue
        },
        updatedAt: Date.now()
      };
    });
  };

  const getChecklistItemKey = (checklistId, itemIndex) => `${checklistId}:${itemIndex}`;

  const isChecklistItemCompleted = (checklistId, itemIndex) => {
    return Boolean(practicalChecklistProgress[getChecklistItemKey(checklistId, itemIndex)]);
  };

  const toggleChecklistItem = (checklistId, itemIndex) => {
    const key = getChecklistItemKey(checklistId, itemIndex);
    const wasChecked = Boolean(practicalChecklistProgress[key]);

    setPracticalChecklistProgress((prev) => ({
      ...prev,
      [key]: !wasChecked
    }));
    updateWeeklyProgress('checklistItems', wasChecked ? -1 : 1);
  };

  const getChecklistProgressStats = (checklist) => {
    const total = Array.isArray(checklist?.items) ? checklist.items.length : 0;
    const done = Array.isArray(checklist?.items)
      ? checklist.items.filter((_, idx) => isChecklistItemCompleted(checklist.id, idx)).length
      : 0;
    return { total, done };
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
      const q = await dsCreateQuestionSubmission({
        category: newQuestionCategory,
        question: newQuestionText,
        answers: newQuestionAnswers,
        correct: newQuestionCorrect,
        createdBy: user.name
      });

      setSubmittedQuestions([...submittedQuestions, q]);
      setNewQuestionText('');
      setNewQuestionAnswers(['', '', '', '']);
      showToast('Frage eingereicht!', 'success');
    } catch (error) {
      console.error('Question error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const approveQuestion = async (qId) => {
    try {
      await dsApproveQuestionSubmission(qId);
      setSubmittedQuestions(submittedQuestions.map(sq => sq.id === qId ? { ...sq, approved: true } : sq));
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  
  // Exam Simulator Functions
  const loadExamProgress = async () => {
    setExamSimulatorMode('theory');
    setUserExamProgress(null);
    setExamAnswered(false);
    setExamSelectedAnswers([]);
    setExamSelectedAnswer(null);
    setExamKeywordInput('');
    setExamKeywordEvaluation(null);

    try {
      const result = await dsStartTheoryExamSession(examKeywordMode);
      const examQuestions = Array.isArray(result?.questions) ? result.questions : [];
      if (examQuestions.length === 0) {
        throw new Error('Keine Theoriefragen vom Backend erhalten.');
      }

      setExamSimulator({
        sessionId: result.sessionId,
        questions: examQuestions,
        answers: [],
        startTime: Date.now(),
        keywordMode: Boolean(result.keywordMode),
        expiresAt: result.expiresAt || null
      });
      setExamQuestionIndex(0);
      setExamCurrentQuestion(examQuestions[0]);
      return;
    } catch (error) {
      console.error('Fehler beim Starten der Theorieprüfung:', error);
      setExamSimulator(null);
      setExamCurrentQuestion(null);
      showToast('Theorieprüfung konnte nicht gestartet werden.', 'error');
      return;
    }
  };

  const toIsoDateTime = (value) => {
    const date = new Date(value || Date.now());
    if (Number.isNaN(date.getTime())) return new Date().toISOString();
    return date.toISOString();
  };


  const toPracticalAttemptId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const toPracticalGradeBucket = (averageGrade) => {
    const value = Number(averageGrade);
    if (!Number.isFinite(value)) return null;
    if (value <= 1.5) return 1;
    if (value <= 2.5) return 2;
    if (value <= 3.5) return 3;
    if (value <= 4.0) return 4;
    if (value <= 5.5) return 5;
    return 6;
  };

  const getPracticalPassXpReward = (averageGrade) => {
    const gradeBucket = toPracticalGradeBucket(averageGrade);
    const xp = gradeBucket ? (PRACTICAL_PASS_XP_BY_GRADE[gradeBucket] || 0) : 0;
    return { gradeBucket, xp };
  };

  const getPracticalDisciplineRequiredDistance = (disciplineId) => {
    if (disciplineId === 'ap_35m_tauch') return 35;
    if (disciplineId === 'zp_30m_tauch') return 30;
    return null;
  };

  const getPracticalRowSeconds = (row) => {
    const directSeconds = Number(row?.seconds);
    if (Number.isFinite(directSeconds) && directSeconds > 0) {
      return directSeconds;
    }

    const displayValue = String(row?.displayValue || '').trim();
    if (!displayValue || displayValue === '-') return null;
    const match = displayValue.match(/(\d+:\d{1,2}(?:[,.]\d+)?)/);
    const valueToParse = match?.[1] || displayValue;
    const parsed = parseExamTimeToSeconds(valueToParse);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const canUseRowForSpeedRanking = (row, disciplineId) => {
    const requiredDistance = getPracticalDisciplineRequiredDistance(disciplineId);
    if (!requiredDistance) return true;
    const distanceMeters = Number(row?.distanceMeters);
    return Number.isFinite(distanceMeters) && distanceMeters >= requiredDistance;
  };

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

  const getPracticalParticipantCandidates = () => allUsers
    .filter((account) => {
      if (!account?.id) return false;
      const role = String(account.role || '').toLowerCase();
      return role === 'azubi'
        || role === 'trainer'
        || role === 'ausbilder'
        || role === 'admin'
        || Boolean(account?.permissions?.canViewAllStats);
    })
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'de'));

  const getPracticalExamTargetUser = () => {
    if (!user?.id) return null;
    const canManageAll = Boolean(user?.permissions?.canViewAllStats);
    if (!canManageAll) {
      return { id: user.id, name: user.name || 'Unbekannt', role: user.role || 'azubi' };
    }
    const participants = getPracticalParticipantCandidates();
    const selectedParticipant = participants.find(account => account.id === practicalExamTargetUserId);
    if (selectedParticipant) {
      return {
        id: selectedParticipant.id,
        name: selectedParticipant.name || 'Unbekannt',
        role: selectedParticipant.role || 'azubi'
      };
    }
    if (participants.some(account => account.id === user.id)) {
      return { id: user.id, name: user.name || 'Unbekannt', role: user.role || 'trainer' };
    }
    return participants.length > 0
      ? { id: participants[0].id, name: participants[0].name || 'Unbekannt', role: participants[0].role || 'azubi' }
      : { id: user.id, name: user.name || 'Unbekannt', role: user.role || 'trainer' };
  };

  const loadPracticalExamHistory = async () => {
    if (!user?.id) return;
    setPracticalExamHistoryLoading(true);

    const localAttempts = loadLocalPracticalAttempts();
    const canManageAll = Boolean(user?.permissions?.canViewAllStats);

    try {
      const rawAttempts = await dsLoadPracticalExamAttempts(user.id, canManageAll);

      const remoteAttempts = (rawAttempts || [])
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
        userId: targetUser.id,
        examType: resultPayload.type,
        inputValues: Object.fromEntries(
          Object.entries(practicalExamInputs || {}).map(([key, value]) => [key, String(value ?? '')])
        )
      };

      const data = await dsSavePracticalExamAttempt(insertPayload);

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

  const deletePracticalExamAttempt = async (attemptId) => {
    if (!attemptId) return;
    // Remove from local state immediately
    setPracticalExamHistory(prev => prev.filter(entry => entry.id !== attemptId));
    // Remove from localStorage
    const existingLocal = loadLocalPracticalAttempts();
    saveLocalPracticalAttempts(existingLocal.filter(entry => entry.id !== attemptId));
    // Try to remove from backend
    try {
      await dsDsPracticalExamAttempt(attemptId);
    } catch {
      // Local removal already done, ignore remote error
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
            <div><strong>Teilnehmer:</strong> ${escapeHtml(attempt.user_name || '-')}</div>
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
      showToast('Bitte zuerst einen Teilnehmer auswählen.', 'warning');
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

    if (resultPayload.passed) {
      const { gradeBucket, xp } = getPracticalPassXpReward(resultPayload.averageGrade);
      if (xp > 0) {
        void queueXpAwardForUser(
          { id: targetUser.id, name: targetUser.name },
          'practicalExam',
          xp,
          {
            eventKey: `practical_pass_${targetUser.id}_${resultPayload.type}_${resultPayload.createdAt}`,
            reason: gradeBucket ? `Praxis bestanden • Note ${gradeBucket}` : 'Praxis bestanden',
            showXpToast: targetUser.id === user?.id
          }
        );
      }
    }

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
    updateWeeklyProgress('examAnswers', 1);
    trackQuestionPerformance(examCurrentQuestion, examCurrentQuestion.category, isCorrect);

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

  const submitExamKeywordAnswer = () => {
    if (examAnswered || !examSimulator || !examCurrentQuestion || !examKeywordInput.trim()) return;
    const correctText = examCurrentQuestion.multi && Array.isArray(examCurrentQuestion.correct)
      ? examCurrentQuestion.correct.map(idx => String(examCurrentQuestion.a?.[idx] || '')).join('. ')
      : String(examCurrentQuestion.a?.[examCurrentQuestion.correct] || '');
    const groups = autoExtractKeywordGroups(correctText);
    const fakeQ = { keywordGroups: groups, minKeywordGroups: Math.max(1, Math.ceil(groups.length * 0.5)) };
    const evaluation = evaluateKeywordAnswer(fakeQ, examKeywordInput);
    setExamKeywordEvaluation(evaluation);
    const isCorrect = evaluation.isCorrect;
    if (isCorrect) { playSound('correct'); } else { playSound('wrong'); }
    setExamAnswered(true);
    setExamSelectedAnswer(examCurrentQuestion.multi ? null : examCurrentQuestion.correct);
    updateChallengeProgress('answer_questions', 1);
    if (isCorrect) updateChallengeProgress('correct_answers', 1);
    if (examCurrentQuestion.category) updateChallengeProgress('category_master', 1, examCurrentQuestion.category);
    updateWeeklyProgress('examAnswers', 1);
    trackQuestionPerformance(examCurrentQuestion, examCurrentQuestion.category, isCorrect);
    const newAnswers = [...examSimulator.answers, {
      question: examCurrentQuestion,
      selectedAnswer: -1,
      correct: isCorrect,
      answerType: 'keyword',
      keywordText: examKeywordInput.trim()
    }];
    setExamSimulator({ ...examSimulator, answers: newAnswers });
    setTimeout(() => {
      setExamKeywordInput('');
      setExamKeywordEvaluation(null);
      proceedToNextExamQuestion(newAnswers);
    }, 2500);
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
    updateWeeklyProgress('examAnswers', 1);
    trackQuestionPerformance(examCurrentQuestion, examCurrentQuestion.category, isCorrect);
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
      const examProgress = { correct: correctAnswers, total: newAnswers.length, percentage, passed: percentage >= 50, timeMs: Date.now() - examSimulator.startTime };
      setUserExamProgress(examProgress);
      void saveTheoryExamAttempt(examProgress, newAnswers, examSimulator?.sessionId);
      if (percentage >= 50) playSound('whistle');

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
    setExamKeywordInput('');
    setExamKeywordEvaluation(null);
  };

  const saveTheoryExamAttempt = async (progress, answers = [], sessionId = null) => {
    if (!user?.id) return;
    try {
      const result = await dsSaveTheoryExamAttempt(
        user.id,
        user.name,
        progress,
        examKeywordMode,
        {
          sessionId: sessionId || examSimulator?.sessionId || null,
          answers
        }
      );
      if (!result) {
        return;
      }

      const authoritativeProgress = {
        correct: Number(result.correct || 0),
        total: Number(result.total || 0),
        percentage: Number(result.percentage || 0),
        passed: Boolean(result.passed),
        timeMs: Number(result.timeMs || progress?.timeMs || 0)
      };
      setUserExamProgress(authoritativeProgress);

      const savedAttempt = {
        id: result.id,
        user_id: result.userId || user.id,
        user_name: result.userName || user.name,
        correct: authoritativeProgress.correct,
        total: authoritativeProgress.total,
        percentage: authoritativeProgress.percentage,
        passed: authoritativeProgress.passed,
        time_ms: authoritativeProgress.timeMs,
        keyword_mode: Boolean(result.keywordMode),
        created_at: result.createdAt || new Date().toISOString()
      };
      setTheoryExamHistory(prev => [savedAttempt, ...prev.filter(entry => entry.id !== savedAttempt.id)]);

      const refreshedStats = await duel.getUserStatsFromSupabase(user);
      if (refreshedStats) {
        const stats = ensureUserStatsStructure(refreshedStats);
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
      }

      const addedXp = Number(result?.xpAward?.addedXp || 0);
      if (addedXp > 0) {
        showToast(`+${addedXp} XP • Prüfungssimulator`, 'success', 2500);
      }
    } catch (e) {
      console.warn('Fehler beim Speichern des Prüfungsergebnisses:', e);
      showToast(friendlyError(e), 'error');
    }
  };

  const loadTheoryExamHistory = async () => {
    if (!user?.id) return;
    setTheoryExamHistoryLoading(true);
    try {
      const data = await dsLoadTheoryExamHistory(user.id, user.permissions?.canViewAllStats);
      setTheoryExamHistory(data);
    } catch (e) {
      console.warn('Fehler beim Laden der Prüfungshistorie:', e);
    } finally {
      setTheoryExamHistoryLoading(false);
    }
  };

  // Kontrollkarte Berufsschule Funktionen
  const canViewAllSchoolCards = () => {
    return user?.role === 'admin' || user?.canViewSchoolCards;
  };

  const loadAzubisForSchoolCard = async () => {
    if (!canViewAllSchoolCards()) return;
    try {
      const data = await dsLoadSchoolAttendanceAzubis();
      setAllAzubisForSchoolCard(data);
    } catch (err) {
      console.error('Fehler beim Laden der Azubis:', err);
    }
  };

  const loadSchoolAttendance = async (targetUserId = null) => {
    if (!user) return;
    try {
      const userIdToLoad = targetUserId || selectedSchoolCardUser?.id || user.id;
      const data = await dsLoadSchoolAttendance(userIdToLoad);
      setSchoolAttendance(data);
    } catch (err) {
      console.error('Fehler beim Laden der Kontrollkarte:', err);
    }
  };

  const addSchoolAttendance = async () => {
    if (!newAttendanceDate || !newAttendanceStart || !newAttendanceEnd) {
      toast.error('Bitte alle Felder ausfuellen');
      return;
    }

    try {
      await dsAddSchoolAttendance({
        userId: user.id, userName: user.name, date: newAttendanceDate,
        startTime: newAttendanceStart, endTime: newAttendanceEnd,
        teacherSignature: newAttendanceTeacherSig, trainerSignature: newAttendanceTrainerSig,
        // Supabase-format fields for fallback
        user_id: user.id, user_name: user.name,
        start_time: newAttendanceStart, end_time: newAttendanceEnd,
        teacher_signature: newAttendanceTeacherSig, trainer_signature: newAttendanceTrainerSig
      });

      const authorizedUsers = await dsGetAuthorizedReviewers('can_view_school_cards');
      for (const authUser of authorizedUsers) {
        if (authUser.id !== user.id && authUser.name) {
          await sendNotification(
            authUser.name,
            '📝 Neuer Kontrollkarten-Eintrag',
            `${user.name} hat einen neuen Berufsschul-Eintrag vom ${new Date(newAttendanceDate).toLocaleDateString('de-DE')} hinzugefuegt.`,
            'school_card'
          );
        }
      }

      setNewAttendanceDate('');
      setNewAttendanceStart('');
      setNewAttendanceEnd('');
      setNewAttendanceTeacherSig('');
      setNewAttendanceTrainerSig('');
      showToast('Eintrag gespeichert!', 'success');
      loadSchoolAttendance();
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      toast.error('Fehler beim Speichern');
    }
  };

  const updateAttendanceSignature = async (id, field, value) => {
    try {
      await dsUpdateAttendanceSignature(id, field, value);
      loadSchoolAttendance();
    } catch (err) {
      console.error('Fehler beim Aktualisieren:', err);
    }
  };

  const deleteSchoolAttendance = async (id) => {
    if (!confirm('Eintrag wirklich löschen?')) return;
    try {
      await dsDeleteSchoolAttendance(id);
      loadSchoolAttendance();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    }
  };

  // ==================== KLASUREN/NOTEN FUNKTIONEN ====================

  const canViewAllExamGrades = () => {
    return user?.role === 'admin' || user?.canViewExamGrades;
  };

  const loadAzubisForExamGrades = async () => {
    if (!canViewAllExamGrades()) return;
    try {
      const data = await dsLoadExamGradesAzubis();
      setAllAzubisForExamGrades(data);
    } catch (err) {
      console.error('Fehler beim Laden der Azubis für Klasuren:', err);
    }
  };

  const loadExamGrades = async (targetUserId = null) => {
    if (!user) return;
    try {
      const userIdToLoad = targetUserId || selectedExamGradesUser?.id || user.id;
      const data = await dsLoadExamGrades(userIdToLoad);
      setExamGrades(data);
    } catch (err) {
      console.error('Fehler beim Laden der Klasuren:', err);
    }
  };

  const addExamGrade = async ({ date, subject, topic, grade, notes }) => {
    try {
      await dsAddExamGrade({
        userId: user.id, userName: user.name, date, subject, topic, grade, notes,
        user_id: user.id, user_name: user.name
      });

      const authorizedUsers = await dsGetAuthorizedReviewers('can_view_exam_grades');
      for (const authUser of authorizedUsers) {
        if (authUser.id !== user.id && authUser.name) {
          await sendNotification(
            authUser.name,
            '📝 Neue Klasur eingetragen',
            `${user.name} hat eine ${subject}-Klasur vom ${new Date(date).toLocaleDateString('de-DE')} eingetragen: Note ${grade.toFixed(1).replace('.', ',')}`,
            'exam_grade'
          );
        }
      }

      showToast('Klasur gespeichert!', 'success');
      loadExamGrades();
    } catch (err) {
      console.error('Fehler beim Speichern der Klasur:', err);
      showToast(friendlyError(err), 'error');
    }
  };

  const deleteExamGrade = async (id) => {
    if (!confirm('Klasur wirklich löschen?')) return;
    try {
      await dsDeleteExamGrade(id);
      showToast('Klasur gelöscht', 'success');
      loadExamGrades();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
      showToast(friendlyError(err), 'error');
    }
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
        await dsSaveBadges(newBadges, user.id, user.name);
      } catch (error) {
        console.error('Save badges error:', error);
      }
    }
  };

  duelLateDepsRef.current = { loadData, checkBadges, updateChallengeProgress, updateWeeklyProgress, trackQuestionPerformance };
  flashcardLateDepsRef.current = { updateChallengeProgress, updateWeeklyProgress, queueXpAward };

  const addMaterial = async () => {
    if (!materialTitle.trim() || !user?.permissions.canUploadMaterials) return;

    try {
      const mat = await dsAddMaterial({
        title: materialTitle, category: materialCategory, createdBy: user.name
      });
      setMaterials([...materials, mat]);
      setMaterialTitle('');
      showToast('Material hinzugefügt!', 'success');
    } catch (error) {
      console.error('Material error:', error);
      showToast(friendlyError(error), 'error');
    }
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
      const resource = await dsAddResource({
        title: resourceTitle, url: resourceUrl, category: resourceType,
        description: resourceDescription, createdBy: user.name
      });
      setResources([resource, ...resources]);
      setResourceTitle('');
      setResourceUrl('');
      setResourceDescription('');
      playSound('splash');
      showToast('Ressource hinzugefügt!', 'success');
    } catch (error) {
      console.error('Resource error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const deleteResource = async (resourceId) => {
    if (user.role !== 'admin') {
      showToast('Nur Administratoren können Ressourcen löschen', 'warning');
      return;
    }
    if (!confirm('Ressource wirklich löschen?')) return;
    try {
      await dsDeleteResource(resourceId);
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
      const newsItem = await dsAddNews({
        title: newsTitle.trim(), content: newsContent.trim(), author: user.name
      });

      await sendNotificationToApprovedUsers({
        title: '📰 Neue News',
        message: `${user.name} hat eine neue News veroeffentlicht: "${newsItem.title}"`,
        type: 'news',
        excludeUserNames: [user.name]
      });

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
      await dsDeleteNews(newsId);
      setNews(news.filter(n => n.id !== newsId));
    } catch (error) {
      console.error('Delete news error:', error);
      toast.error('Fehler beim Loeschen der Ankuendigung');
    }
  };

  const addExam = async () => {
    if (!examTitle.trim() || !user) return;

    try {
      const exam = await dsAddExam({
        title: examTitle, description: examTopics,
        examDate: examDate || null, createdBy: user.name
      });

      const examDateLabel = exam.date
        ? new Date(exam.date).toLocaleDateString('de-DE')
        : 'ohne Termin';

      await sendNotificationToApprovedUsers({
        title: '📝 Neue Klausur',
        message: `${user.name} hat eine neue Klausur eingetragen: "${exam.title}" (${examDateLabel}).`,
        type: 'exam',
        excludeUserNames: [user.name]
      });

      setExams([...exams, exam].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setExamTitle('');
      setExamDate('');
      setExamTopics('');
    } catch (error) {
      console.error('Exam error:', error);
    }
  };

  const deleteExam = async (examId) => {
    if (!examId) return;
    if (!confirm('Klausur wirklich löschen?')) return;
    try {
      await dsDeleteExam(examId);
      setExams(prev => prev.filter(exam => exam.id !== examId));
      showToast('Klausur gelöscht.', 'success');
    } catch (error) {
      console.error('Delete exam error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  // Auth-Guards: Early Return verhindert dass Hooks unten auf null-User zugreifen
  if (!authReady) return <AuthGuard />;
  if (!user) return <AuthGuard />;

  return (
  <AuthGuard>
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

      {/* Offline-Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[9998] bg-gray-800 text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
          <span>📡</span>
          <span>Keine Internetverbindung – Einige Funktionen sind nicht verfügbar</span>
        </div>
      )}

      {/* PWA Install-Banner */}
      {showInstallBanner && (
        <div className="fixed bottom-20 left-4 right-4 z-[9996] sm:left-auto sm:right-4 sm:w-80">
          <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-sky-100">
            <div className="text-3xl">📲</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm">App installieren</p>
              <p className="text-xs text-gray-500">Schneller Zugriff ohne Browser</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={triggerInstall}
                className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Installieren
              </button>
              <button
                onClick={dismissInstall}
                className="text-gray-400 hover:text-gray-600 text-xs text-center transition-colors"
              >
                Nicht jetzt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie-Hinweis */}
      {showCookieNotice && (
        <div className="fixed bottom-0 left-0 right-0 z-[9995] bg-gray-900/97 text-white px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3"
             style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}>
          <p className="text-xs text-gray-300 flex-1">
            🍪 Diese App verwendet ausschließlich technisch notwendige Cookies für die sichere Anmeldung.
            Kein Tracking, keine Werbung.{' '}
            <button
              onClick={() => setCurrentView('datenschutz')}
              className="underline text-cyan-400 hover:text-cyan-300"
            >
              Mehr erfahren
            </button>
          </p>
          <button
            onClick={acknowledgeCookie}
            className="shrink-0 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Verstanden
          </button>
        </div>
      )}

      {/* Live-Ticker Banner */}
      {(() => {
        const maintenanceActive = appConfig.featureFlags?.quizMaintenance;
        const announcementActive = appConfig.announcement?.enabled && appConfig.announcement?.message;
        if (!maintenanceActive && !announcementActive) return null;

        const isMaintenanceTicker = maintenanceActive && !announcementActive;
        const tickerText = announcementActive
          ? appConfig.announcement.message
          : 'Quiz-Wartung läuft — wir verbessern das Quizduell für euch. Bitte bald wieder vorbeischauen!';

        const bgColor = isMaintenanceTicker ? '#b45309' : '#d97706';
        const textColor = '#fff8e1';
        const badgeLabel = isMaintenanceTicker ? 'WARTUNG' : 'INFO';
        const badgeBg = isMaintenanceTicker ? '#92400e' : '#b45309';

        return (
          <div
            className="fixed top-0 left-0 right-0 z-[9997] flex items-center overflow-hidden"
            style={{ background: bgColor, height: '32px' }}
          >
            {/* LIVE / WARTUNG Badge */}
            <div
              className="flex-shrink-0 flex items-center gap-1.5 px-3 h-full text-xs font-black tracking-widest z-10"
              style={{ background: badgeBg, color: textColor, minWidth: 'max-content' }}
            >
              <span className="animate-live-pulse inline-block w-1.5 h-1.5 rounded-full bg-white" />
              {badgeLabel}
            </div>

            {/* Scrolling text */}
            <div className="flex-1 overflow-hidden h-full flex items-center relative">
              <span
                className={announcementActive ? 'animate-ticker-slow' : 'animate-ticker'}
                style={{ color: textColor, fontSize: '0.78rem', fontWeight: 600 }}
              >
                {tickerText}
                &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                {tickerText}
              </span>
            </div>

            {/* Rechts: Uhrzeit */}
            <div
              className="flex-shrink-0 px-3 text-xs font-semibold tabular-nums"
              style={{ color: textColor, opacity: 0.75 }}
            >
              {new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      })()}

      {/* Inaktivitäts-Warnung — gehandhabt von AuthGuard */}

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

      {/* Header — slim top bar */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800' : 'bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600'} text-white shadow-lg relative z-20 ${(appConfig.featureFlags?.quizMaintenance || (appConfig.announcement?.enabled && appConfig.announcement?.message)) ? 'mt-8' : ''}`}>
        <div className={`flex justify-between items-center px-4 py-2 transition-all ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
          <div className="flex items-center gap-3">
            {/* Sidebar toggle — desktop only */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors"
              title={sidebarCollapsed ? 'Menü ausklappen' : 'Menü einklappen'}
            >
              <span className="text-lg leading-none">{sidebarCollapsed ? '☰' : '✕'}</span>
            </button>
            <button
              onClick={() => { setCurrentView('profile'); playSound('splash'); }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <AvatarBadge
                avatar={user.avatar ? getAvatarById(user.avatar) : null}
                size="sm"
                className="border border-white/40"
              />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold leading-tight">{user.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold bg-white/20 rounded-full px-1.5 py-0.5 leading-none">
                    Lv.{getLevel(getTotalXpFromStats(userStats))}
                  </span>
                  <div className="w-10 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white/80 rounded-full" style={{ width: `${getLevelProgress(getTotalXpFromStats(userStats)) * 100}%` }} />
                  </div>
                </div>
              </div>
            </button>
          </div>

          <h1 className="text-lg font-bold drop-shadow-lg hidden md:block absolute left-1/2 -translate-x-1/2">Bäder-Azubi App</h1>
          <h1 className="text-lg font-bold drop-shadow-lg md:hidden">Bäder-Azubi</h1>

          <div className="flex items-center gap-2">
            <button onClick={() => { setDarkMode(!darkMode); playSound('splash'); }} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors" title={darkMode ? 'Tag-Modus' : 'Nacht-Modus'}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => { setSoundEnabled(!soundEnabled); if (!soundEnabled) playSound('splash'); }} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors hidden sm:block" title={soundEnabled ? 'Sound aus' : 'Sound an'}>
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            {(updateAvailable || updatingApp) && (
              <button onClick={() => { void applyPwaUpdate(); }} disabled={updatingApp} className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 bg-emerald-500/90 hover:bg-emerald-600/90 text-sm ${updatingApp ? 'opacity-70 cursor-not-allowed' : ''}`} title="Neue Version installieren">
                <span>{updatingApp ? '⏳' : '⬆️'}</span>
                <span className="hidden sm:inline text-xs font-medium">{updatingApp ? 'Update...' : 'Update'}</span>
              </button>
            )}
            {'Notification' in window && Notification.permission === 'default' && (
              <button onClick={() => { void enablePushNotifications(); }} className="bg-yellow-500/80 hover:bg-yellow-600/80 px-2 py-1.5 rounded-lg transition-colors font-bold text-xs flex items-center gap-1 animate-pulse" title="Benachrichtigungen erlauben">
                🔔
              </button>
            )}
            <div className="relative">
              <button id="notification-bell" onClick={() => { setShowNotificationsPanel(!showNotificationsPanel); playSound('splash'); }} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors relative">
                <Bell size={20} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">{notifications.filter(n => !n.read).length}</span>
                )}
              </button>
            </div>
            <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors text-sm hidden sm:block">Abmelden</button>
          </div>
        </div>
      </div>

      {/* Notification Dropdown - fixed positioniert um Stacking-Probleme zu vermeiden */}
      {showNotificationsPanel && (
        <div
          className="fixed inset-0 z-[9999]"
          onClick={() => setShowNotificationsPanel(false)}
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

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col fixed top-0 left-0 h-full z-30 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-60'} ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} border-r shadow-lg`}>
        {/* Sidebar header */}
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} h-11 shrink-0 ${darkMode ? 'border-slate-700' : 'border-gray-200'} border-b`}>
          {!sidebarCollapsed && <span className={`font-bold text-sm ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Navigation</span>}
          {sidebarCollapsed && <span className="text-lg">🏊</span>}
        </div>
        {/* Menu items grouped */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
          {Object.entries(MENU_GROUP_LABELS).map(([groupId, groupLabel]) => {
            const groupItems = [...appConfig.menuItems]
              .filter(item => {
                if (!item.visible) return false;
                if ((item.group || 'lernen') !== groupId) return false;
                if (item.requiresPermission) return user.permissions[item.requiresPermission];
                return true;
              })
              .sort((a, b) => a.order - b.order);
            if (groupItems.length === 0) return null;
            return (
              <div key={groupId} className={sidebarCollapsed ? 'mb-1' : 'mb-2'}>
                {!sidebarCollapsed && groupId !== 'home' && (
                  <p className={`text-[10px] font-bold uppercase tracking-wider px-4 pt-3 pb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {groupLabel}
                  </p>
                )}
                {sidebarCollapsed && groupId !== 'home' && (
                  <div className={`mx-3 my-1 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`} />
                )}
                {groupItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentView(item.id); playSound('splash'); if (item.id === 'flashcards') loadFlashcards(); }}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 transition-all ${sidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-4 py-2'} ${
                      currentView === item.id
                        ? darkMode ? 'text-cyan-400 bg-cyan-400/10 border-r-3 border-cyan-400' : 'text-cyan-600 bg-cyan-50 border-r-3 border-cyan-600'
                        : darkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className={sidebarCollapsed ? 'text-xl' : 'text-lg'}>{item.icon}</span>
                    {!sidebarCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>
        {/* Sidebar footer — logout */}
        <div className={`shrink-0 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} ${sidebarCollapsed ? 'p-2' : 'p-3'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 ${sidebarCollapsed ? 'justify-center py-2' : 'px-3 py-2'} rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-slate-800' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'}`}
            title={sidebarCollapsed ? 'Abmelden' : undefined}
          >
            <span className="text-lg">🚪</span>
            {!sidebarCollapsed && <span className="text-sm font-medium">Abmelden</span>}
          </button>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'} p-4 relative z-10 pb-20 md:pb-4 ${(appConfig.featureFlags?.quizMaintenance || (appConfig.announcement?.enabled && appConfig.announcement?.message)) ? 'pt-12' : ''}`}>
       <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="text-4xl animate-bounce">🏊‍♂️</div></div>}>
        {/* Admin Panel */}
        {currentView === 'admin' && user.permissions.canManageUsers && (
          <AdminView
            currentUserEmail={user.email}
            canManageRoles={Boolean(user.isOwner) || (user.role === 'admin' && !allUsers.some((account) => Boolean(account?.is_owner)))}
            canEditAppConfig={Boolean(user.isOwner) || (user.role === 'admin' && !allUsers.some((account) => Boolean(account?.is_owner)))}
            getAdminStats={adminActions.getAdminStats}
            questionReports={questionReports}
            toggleQuestionReportStatus={duel.toggleQuestionReportStatus}
            pendingUsers={pendingUsers}
            approveUser={adminActions.approveUser}
            loadData={loadData}
            allUsers={allUsers}
            getDaysUntilDeletion={adminActions.getDaysUntilDeletion}
            changeUserRole={adminActions.changeUserRole}
            exportUserData={adminActions.exportUserData}
            deleteUser={adminActions.deleteUser}
            toggleSchoolCardPermission={adminActions.toggleSchoolCardPermission}
            toggleSignReportsPermission={adminActions.toggleSignReportsPermission}
            toggleExamGradesPermission={adminActions.toggleExamGradesPermission}
            repairQuizStats={adminActions.repairQuizStats}
            sendTestPush={adminActions.sendTestPush}
            editingMenuItems={adminActions.editingMenuItems}
            setEditingMenuItems={adminActions.setEditingMenuItems}
            appConfig={appConfig}
            editingThemeColors={adminActions.editingThemeColors}
            setEditingThemeColors={adminActions.setEditingThemeColors}
            moveMenuItem={adminActions.moveMenuItem}
            updateMenuItemIcon={adminActions.updateMenuItemIcon}
            updateMenuItemLabel={adminActions.updateMenuItemLabel}
            updateMenuItemGroup={adminActions.updateMenuItemGroup}
            toggleMenuItemVisibility={adminActions.toggleMenuItemVisibility}
            updateThemeColor={adminActions.updateThemeColor}
            saveAppConfig={adminActions.saveAppConfig}
            resetAppConfig={adminActions.resetAppConfig}
            companies={appConfig.companies}
            saveCompanies={adminActions.saveCompanies}
            announcement={appConfig.announcement}
            saveAnnouncement={adminActions.saveAnnouncement}
            featureFlags={appConfig.featureFlags}
            saveFeatureFlag={adminActions.saveFeatureFlag}
            verifyParentalConsent={adminActions.verifyParentalConsent}
          />
        )}

        {currentView === 'home' && (
          <HomeView
            rotateGeneralKnowledge={rotateGeneralKnowledge}
            dailyWisdom={dailyWisdom}
            userStats={userStats}
            getTotalXpFromStats={getTotalXpFromStats}
            setCurrentView={setCurrentView}
            dailyChallenges={dailyChallenges}
            getChallengeProgress={getChallengeProgress}
            isChallengeCompleted={isChallengeCompleted}
            getCompletedChallengesCount={getCompletedChallengesCount}
            getTotalXPEarned={getTotalXPEarned}
            weeklyProgress={weeklyProgress}
            buildEmptyWeeklyProgress={buildEmptyWeeklyProgress}
            getWeekStartStamp={getWeekStartStamp}
            setWeeklyProgress={setWeeklyProgress}
            weeklyGoals={weeklyGoals}
            sanitizeGoalValue={sanitizeGoalValue}
            setWeeklyGoals={setWeeklyGoals}
            getTotalDueCards={getTotalDueCards}
            setSpacedRepetitionMode={setSpacedRepetitionMode}
            activeGames={duel.activeGames}
            acceptChallenge={duel.acceptChallenge}
            continueGame={duel.continueGameSafe}
            news={news}
            exams={exams}
            setExamSimulatorMode={setExamSimulatorMode}
            loadFlashcards={loadFlashcards}
            materials={materials}
            resources={resources}
            messages={messages}
            berichtsheftPendingSignatures={berichtsheft.berichtsheftPendingSignatures}
            menuItems={appConfig.menuItems}
          />
        )}

        {/* Quiz View */}
        {currentView === 'quiz' && appConfig.featureFlags?.quizMaintenance && (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center"
               style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
            <div className="text-7xl mb-6">🚧</div>
            <h1 className="text-2xl font-bold text-white mb-3">Am Quiz wird gearbeitet</h1>
            <p className="text-slate-400 max-w-sm mb-2">
              Wir verbessern das Quizduell gerade für euch.
            </p>
            <p className="text-slate-500 text-sm">Bitte bald wieder vorbeischauen!</p>
            <button
              onClick={() => setCurrentView('home')}
              className="mt-8 px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
            >
              Zurück zur Startseite
            </button>
          </div>
        )}
        {currentView === 'quiz' && !appConfig.featureFlags?.quizMaintenance && (
          <QuizView
            selectedDifficulty={duel.selectedDifficulty}
            setSelectedDifficulty={duel.setSelectedDifficulty}
            allUsers={allUsers}
            allGames={duel.allGames}
            activeGames={duel.activeGames}
            challengePlayer={duel.challengePlayer}
            acceptChallenge={duel.acceptChallenge}
            continueGame={duel.continueGameSafe}
            currentGame={duel.currentGame}
            quizCategory={duel.quizCategory}
            questionInCategory={duel.questionInCategory}
            playerTurn={duel.playerTurn}
            adaptiveLearningEnabled={adaptiveLearningEnabled}
            setAdaptiveLearningEnabled={setAdaptiveLearningEnabled}
            selectCategory={duel.selectCategory}
            waitingForOpponent={duel.waitingForOpponent}
            startCategoryAsSecondPlayer={duel.startCategoryAsSecondPlayer}
            currentQuestion={duel.currentQuestion}
            timeLeft={duel.timeLeft}
            answered={duel.answered}
            selectedAnswers={duel.selectedAnswers}
            lastSelectedAnswer={duel.lastSelectedAnswer}
            isKeywordQuestion={isKeywordQuestion}
            isWhoAmIQuestion={isWhoAmIQuestion}
            keywordAnswerText={duel.keywordAnswerText}
            setKeywordAnswerText={duel.setKeywordAnswerText}
            keywordAnswerEvaluation={duel.keywordAnswerEvaluation}
            submitKeywordAnswer={duel.submitKeywordAnswer}
            quizMCKeywordMode={duel.quizMCKeywordMode}
            setQuizMCKeywordMode={duel.setQuizMCKeywordMode}
            answerQuestion={duel.answerQuestion}
            reportQuestionIssue={duel.reportQuestionIssue}
            confirmMultiSelectAnswer={duel.confirmMultiSelectAnswer}
            proceedToNextRound={duel.proceedToNextRound}
            userStats={userStats}
            duelResult={duel.duelResult}
            setDuelResult={duel.setDuelResult}
            showDuelResultForGame={duel.showDuelResultForGame}
            categoryRoundResult={duel.categoryRoundResult}
            proceedAfterCategoryResult={duel.proceedAfterCategoryResult}
            onForfeit={duel.onForfeit}
          />
        )}

        {/* Stats View */}
        {currentView === 'stats' && (
          <StatsView
            userStats={userStats}
            BADGES={BADGES}
            userBadges={userBadges}
            leaderboard={leaderboard}
          />
        )}

        {/* Chat View */}
        {currentView === 'chat' && (
          <ChatView
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            deleteMessage={deleteChatMsg}
            chatScope={chatScope}
            setChatScope={setChatScope}
            selectedChatRecipientId={selectedChatRecipientId}
            setSelectedChatRecipientId={setSelectedChatRecipientId}
            directChatCandidates={directChatCandidates}
            hasChatOrganization={hasChatOrganization}
            canModerateChat={user?.role === 'admin'}
          />
        )}

        {/* Forum View */}
        {currentView === 'forum' && (
          <ForumView />
        )}

        {/* Materials View */}
        {currentView === 'materials' && (
          <MaterialsView
            materials={materials}
            materialTitle={materialTitle}
            setMaterialTitle={setMaterialTitle}
            materialCategory={materialCategory}
            setMaterialCategory={setMaterialCategory}
            addMaterial={addMaterial}
          />
        )}

        {/* Interactive Learning Hub (includes Water Cycle) */}
        {currentView === 'interactive-learning' && (
          <InteractiveLearningView />
        )}

        {/* Notfall-Trainer */}
        {currentView === 'notfall-trainer' && (
          <NotfallTrainerView />
        )}

                {/* Resources View */}
        {currentView === 'resources' && (
          <ResourcesView
            resources={resources}
            resourceTitle={resourceTitle}
            setResourceTitle={setResourceTitle}
            resourceType={resourceType}
            setResourceType={setResourceType}
            resourceUrl={resourceUrl}
            setResourceUrl={setResourceUrl}
            resourceDescription={resourceDescription}
            setResourceDescription={setResourceDescription}
            addResource={addResource}
            deleteResource={deleteResource}
          />
        )}

                {/* News View */}
        {currentView === 'news' && (
          <NewsView
            news={news}
            newsTitle={newsTitle}
            setNewsTitle={setNewsTitle}
            newsContent={newsContent}
            setNewsContent={setNewsContent}
            addNews={addNews}
            deleteNews={deleteNews}
          />
        )}

        {/* Exams View */}
        {currentView === 'exams' && (
          <ExamsView
            exams={exams}
            examTitle={examTitle}
            setExamTitle={setExamTitle}
            examDate={examDate}
            setExamDate={setExamDate}
            examTopics={examTopics}
            setExamTopics={setExamTopics}
            addExam={addExam}
            deleteExam={deleteExam}
            examGrades={examGrades}
            allAzubisForExamGrades={allAzubisForExamGrades}
            selectedExamGradesUser={selectedExamGradesUser}
            setSelectedExamGradesUser={setSelectedExamGradesUser}
            addExamGrade={addExamGrade}
            deleteExamGrade={deleteExamGrade}
            loadExamGrades={loadExamGrades}
            canViewAllExamGrades={canViewAllExamGrades}
          />
        )}

        {/* Exam Simulator View */}
        {currentView === 'exam-simulator' && (
          <ErrorBoundary darkMode={darkMode}>
          <ExamSimulatorView
            examSimulatorMode={examSimulatorMode}
            setExamSimulatorMode={setExamSimulatorMode}
            userExamProgress={userExamProgress}
            examSimulator={examSimulator}
            adaptiveLearningEnabled={adaptiveLearningEnabled}
            setAdaptiveLearningEnabled={setAdaptiveLearningEnabled}
            examQuestionIndex={examQuestionIndex}
            examCurrentQuestion={examCurrentQuestion}
            examAnswered={examAnswered}
            examSelectedAnswers={examSelectedAnswers}
            examSelectedAnswer={examSelectedAnswer}
            loadExamProgress={loadExamProgress}
            answerExamQuestion={answerExamQuestion}
            reportQuestionIssue={duel.reportQuestionIssue}
            confirmExamMultiSelectAnswer={confirmExamMultiSelectAnswer}
            resetExam={resetExam}
            practicalExamType={practicalExamType}
            setPracticalExamType={setPracticalExamType}
            practicalExamInputs={practicalExamInputs}
            practicalExamResult={practicalExamResult}
            practicalExamTargetUserId={practicalExamTargetUserId}
            setPracticalExamTargetUserId={setPracticalExamTargetUserId}
            practicalExamHistory={practicalExamHistory}
            practicalExamHistoryLoading={practicalExamHistoryLoading}
            practicalExamHistoryTypeFilter={practicalExamHistoryTypeFilter}
            setPracticalExamHistoryTypeFilter={setPracticalExamHistoryTypeFilter}
            practicalExamHistoryUserFilter={practicalExamHistoryUserFilter}
            setPracticalExamHistoryUserFilter={setPracticalExamHistoryUserFilter}
            practicalExamComparisonType={practicalExamComparisonType}
            setPracticalExamComparisonType={setPracticalExamComparisonType}
            allUsers={allUsers}
            resetPracticalExam={resetPracticalExam}
            updatePracticalExamInput={updatePracticalExamInput}
            evaluatePracticalExam={evaluatePracticalExam}
            exportPracticalExamToPdf={exportPracticalExamToPdf}
            loadPracticalExamHistory={loadPracticalExamHistory}
            canUseRowForSpeedRanking={canUseRowForSpeedRanking}
            getPracticalRowSeconds={getPracticalRowSeconds}
            getPracticalParticipantCandidates={getPracticalParticipantCandidates}
            savePracticalExamAttempt={savePracticalExamAttempt}
            deletePracticalExamAttempt={deletePracticalExamAttempt}
            examKeywordMode={examKeywordMode}
            setExamKeywordMode={setExamKeywordMode}
            examKeywordInput={examKeywordInput}
            setExamKeywordInput={setExamKeywordInput}
            examKeywordEvaluation={examKeywordEvaluation}
            submitExamKeywordAnswer={submitExamKeywordAnswer}
            theoryExamHistory={theoryExamHistory}
            theoryExamHistoryLoading={theoryExamHistoryLoading}
            loadTheoryExamHistory={loadTheoryExamHistory}
          />
          </ErrorBoundary>
        )}
        {/* Flashcards View */}
        {currentView === 'flashcards' && (
          <FlashcardsView
            flashcards={flashcards}
            setFlashcards={setFlashcards}
            flashcardIndex={flashcardIndex}
            setFlashcardIndex={setFlashcardIndex}
            currentFlashcard={currentFlashcard}
            setCurrentFlashcard={setCurrentFlashcard}
            showFlashcardAnswer={showFlashcardAnswer}
            setShowFlashcardAnswer={setShowFlashcardAnswer}
            spacedRepetitionMode={spacedRepetitionMode}
            setSpacedRepetitionMode={setSpacedRepetitionMode}
            dueCards={dueCards}
            newFlashcardCategory={newFlashcardCategory}
            setNewFlashcardCategory={setNewFlashcardCategory}
            newFlashcardFront={newFlashcardFront}
            setNewFlashcardFront={setNewFlashcardFront}
            newFlashcardBack={newFlashcardBack}
            setNewFlashcardBack={setNewFlashcardBack}
            pendingFlashcards={pendingFlashcards}
            setPendingFlashcards={setPendingFlashcards}
            userFlashcards={userFlashcards}
            setUserFlashcards={setUserFlashcards}
            newQuestionCategory={newQuestionCategory}
            setNewQuestionCategory={setNewQuestionCategory}
            deleteFlashcard={deleteFlashcard}
            approveFlashcard={approveFlashcard}
            getDueCardCount={getDueCardCount}
            getLevelColor={getLevelColor}
            getLevelLabel={getLevelLabel}
            loadDueCards={loadDueCards}
            loadFlashcards={loadFlashcards}
            moderateContent={moderateContent}
            getCardSpacedData={getCardSpacedData}
            updateCardSpacedData={updateCardSpacedData}
            queueXpAward={queueXpAward}
            XP_REWARDS={XP_REWARDS}
            FLASHCARD_CONTENT={FLASHCARD_CONTENT}
            KEYWORD_FLASHCARD_CONTENT={KEYWORD_FLASHCARD_CONTENT}
            WHO_AM_I_FLASHCARD_CONTENT={WHO_AM_I_FLASHCARD_CONTENT}
            keywordFlashcardMode={keywordFlashcardMode}
            setKeywordFlashcardMode={setKeywordFlashcardMode}
            whoAmIFlashcardMode={whoAmIFlashcardMode}
            setWhoAmIFlashcardMode={setWhoAmIFlashcardMode}
            flashcardFreeTextMode={flashcardFreeTextMode}
            setFlashcardFreeTextMode={setFlashcardFreeTextMode}
            flashcardKeywordInput={flashcardKeywordInput}
            setFlashcardKeywordInput={setFlashcardKeywordInput}
            flashcardKeywordEvaluation={flashcardKeywordEvaluation}
            evaluateFlashcardKeywordAnswer={evaluateFlashcardKeywordAnswer}
            resetFlashcardKeywordState={resetFlashcardKeywordState}
          />
        )}

        {/* Calculator View */}
        {currentView === 'calculator' && (
          <CalculatorView
            calculatorType={calculatorType}
            setCalculatorType={setCalculatorType}
            calculatorInputs={calculatorInputs}
            setCalculatorInputs={setCalculatorInputs}
            calculatorResult={calculatorResult}
            setCalculatorResult={setCalculatorResult}
            selectedChemical={selectedChemical}
            setSelectedChemical={setSelectedChemical}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            performCalculation={handleCalculation}
            chlorinationProducts={CHLORINATION_PRODUCTS}
            antichlorProducts={ANTICHLOR_PRODUCTS}
            flocculantProducts={FLOCCULANT_PRODUCTS}
            flocculantPumpTypes={FLOCCULANT_PUMP_TYPES}
            flocculantPumpModels={FLOCCULANT_PUMP_MODELS}
          />
        )}

        {/* Trainer Dashboard */}
        {currentView === 'trainer-dashboard' && user.permissions.canViewAllStats && (
          <TrainerDashboardView
            allUsers={allUsers}
            statsByUserId={statsByUserId}
            leaderboard={leaderboard}
            allGames={duel.allGames}
            namesMatch={namesMatch}
            isFinishedGameStatus={isFinishedGameStatus}
            theoryExamHistory={theoryExamHistory}
            theoryExamHistoryLoading={theoryExamHistoryLoading}
            loadTheoryExamHistory={loadTheoryExamHistory}
          />
        )}

        {/* Questions View */}
        {currentView === 'questions' && (
          <QuestionsView
            submittedQuestions={submittedQuestions}
            newQuestionText={newQuestionText}
            setNewQuestionText={setNewQuestionText}
            newQuestionCategory={newQuestionCategory}
            setNewQuestionCategory={setNewQuestionCategory}
            newQuestionAnswers={newQuestionAnswers}
            setNewQuestionAnswers={setNewQuestionAnswers}
            newQuestionCorrect={newQuestionCorrect}
            setNewQuestionCorrect={setNewQuestionCorrect}
            submitQuestion={submitQuestion}
            approveQuestion={approveQuestion}
          />
        )}

        {/* Kontrollkarte Berufsschule View */}
        {currentView === 'school-card' && (
          <SchoolCardView
            schoolAttendance={schoolAttendance}
            newAttendanceDate={newAttendanceDate}
            setNewAttendanceDate={setNewAttendanceDate}
            newAttendanceStart={newAttendanceStart}
            setNewAttendanceStart={setNewAttendanceStart}
            newAttendanceEnd={newAttendanceEnd}
            setNewAttendanceEnd={setNewAttendanceEnd}
            addSchoolAttendance={addSchoolAttendance}
            deleteSchoolAttendance={deleteSchoolAttendance}
            signatureModal={signatureModal}
            setSignatureModal={setSignatureModal}
            tempSignature={tempSignature}
            setTempSignature={setTempSignature}
            updateAttendanceSignature={updateAttendanceSignature}
            selectedSchoolCardUser={selectedSchoolCardUser}
            setSelectedSchoolCardUser={setSelectedSchoolCardUser}
            allAzubisForSchoolCard={allAzubisForSchoolCard}
            loadSchoolAttendance={loadSchoolAttendance}
            canViewAllSchoolCards={canViewAllSchoolCards}
          />
        )}

        {/* ==================== SCHWIMMCHALLENGE VIEW ==================== */}
        {currentView === 'swim-challenge' && (
          <SwimChallengeView
            SWIM_ARENA_DISCIPLINES={SWIM_ARENA_DISCIPLINES}
            SWIM_BATTLE_WIN_POINTS={SWIM_BATTLE_WIN_POINTS}
            SWIM_CHALLENGES={SWIM_CHALLENGES}
            SWIM_TRAINING_PLANS={swimTrainingPlans}
            SWIM_STYLES={SWIM_STYLES}
            activeSwimChallenges={activeSwimChallenges}
            allUsers={allUsers}
            calculateChallengeProgress={calculateChallengeProgress}
            calculateSwimPoints={calculateSwimPoints}
            calculateTeamBattleStats={calculateTeamBattleStats}
            confirmSwimSession={confirmSwimSession}
            createCustomSwimTrainingPlan={createCustomSwimTrainingPlan}
            getAgeHandicap={getAgeHandicap}
            getSeaCreatureTier={getSeaCreatureTier}
            getSwimLevel={getSwimLevel}
            getUserNameById={getUserNameById}
            handleSwimBossBattleSubmit={handleSwimBossBattleSubmit}
            handleSwimDuelSubmit={handleSwimDuelSubmit}
            pendingSwimConfirmations={pendingSwimConfirmations}
            rejectSwimSession={rejectSwimSession}
            saveActiveSwimChallenges={saveActiveSwimChallenges}
            saveSwimSession={saveSwimSession}
            setCurrentView={setCurrentView}
            setSwimArenaMode={setSwimArenaMode}
            setSwimBossForm={setSwimBossForm}
            setSwimChallengeFilter={setSwimChallengeFilter}
            setSwimChallengeView={setSwimChallengeView}
            setSwimDuelForm={setSwimDuelForm}
            setSwimSessionForm={setSwimSessionForm}
            statsByUserId={statsByUserId}
            swimArenaMode={swimArenaMode}
            swimBattleHistory={swimBattleHistory}
            swimBattleResult={swimBattleResult}
            swimBattleWinsByUserId={swimBattleWinsByUserId}
            swimBossForm={swimBossForm}
            swimChallengeFilter={swimChallengeFilter}
            swimChallengeView={swimChallengeView}
            swimCurrentMonthBattleStats={swimCurrentMonthBattleStats}
            swimCurrentMonthLabel={swimCurrentMonthLabel}
            swimDuelForm={swimDuelForm}
            swimMonthlyDistanceRankingCurrentMonth={swimMonthlyDistanceRankingCurrentMonth}
            swimMonthlyResults={swimMonthlyResults}
            swimMonthlySwimmerCurrentMonth={swimMonthlySwimmerCurrentMonth}
            swimSessionForm={swimSessionForm}
            swimSessions={swimSessions}
            swimYear={swimYear}
            swimYearlySwimmerRanking={swimYearlySwimmerRanking}
            toSafeInt={toSafeInt}
            withdrawSwimSession={withdrawSwimSession}
          />
        )}

        {/* ==================== BERICHTSHEFT VIEW ==================== */}
        {currentView === 'berichtsheft' && (
          <BerichtsheftView
            addWeekEntry={berichtsheft.addWeekEntry}
            assignBerichtsheftTrainer={berichtsheft.assignBerichtsheftTrainer}
            azubiProfile={berichtsheft.azubiProfile}
            berichtsheftBemerkungAusbilder={berichtsheft.berichtsheftBemerkungAusbilder}
            berichtsheftBemerkungAzubi={berichtsheft.berichtsheftBemerkungAzubi}
            berichtsheftDatumAusbilder={berichtsheft.berichtsheftDatumAusbilder}
            berichtsheftDatumAzubi={berichtsheft.berichtsheftDatumAzubi}
            berichtsheftEntries={berichtsheft.berichtsheftEntries}
            berichtsheftNr={berichtsheft.berichtsheftNr}
            berichtsheftPendingLoading={berichtsheft.berichtsheftPendingLoading}
            berichtsheftPendingSignatures={berichtsheft.berichtsheftPendingSignatures}
            berichtsheftSignaturAusbilder={berichtsheft.berichtsheftSignaturAusbilder}
            berichtsheftSignaturAzubi={berichtsheft.berichtsheftSignaturAzubi}
            berichtsheftViewMode={berichtsheft.berichtsheftViewMode}
            berichtsheftWeek={berichtsheft.berichtsheftWeek}
            berichtsheftYear={berichtsheft.berichtsheftYear}
            canManageBerichtsheftSignatures={berichtsheft.canManageBerichtsheftSignatures}
            calculateBereichProgress={berichtsheft.calculateBereichProgress}
            calculateDayHours={berichtsheft.calculateDayHours}
            calculateTotalHours={berichtsheft.calculateTotalHours}
            currentWeekEntries={berichtsheft.currentWeekEntries}
            deleteBerichtsheft={berichtsheft.deleteBerichtsheft}
            generateBerichtsheftPDF={berichtsheft.generateBerichtsheftPDF}
            getBerichtsheftBereichSuggestions={berichtsheft.getBerichtsheftBereichSuggestions}
            getBerichtsheftYearWeeks={berichtsheft.getBerichtsheftYearWeeks}
            getWeekEndDate={berichtsheft.getWeekEndDate}
            loadBerichtsheftForEdit={berichtsheft.loadBerichtsheftForEdit}
            openBerichtsheftDraftForCurrentWeek={berichtsheft.openBerichtsheftDraftForCurrentWeek}
            removeWeekEntry={berichtsheft.removeWeekEntry}
            resetBerichtsheftForm={berichtsheft.resetBerichtsheftForm}
            saveAzubiProfile={berichtsheft.saveAzubiProfile}
            saveBerichtsheft={berichtsheft.saveBerichtsheft}
            selectedBerichtsheft={berichtsheft.selectedBerichtsheft}
            setBerichtsheftBemerkungAusbilder={berichtsheft.setBerichtsheftBemerkungAusbilder}
            setBerichtsheftBemerkungAzubi={berichtsheft.setBerichtsheftBemerkungAzubi}
            setBerichtsheftDatumAusbilder={berichtsheft.setBerichtsheftDatumAusbilder}
            setBerichtsheftDatumAzubi={berichtsheft.setBerichtsheftDatumAzubi}
            setBerichtsheftNr={berichtsheft.setBerichtsheftNr}
            setBerichtsheftSignaturAusbilder={berichtsheft.setBerichtsheftSignaturAusbilder}
            setBerichtsheftSignaturAzubi={berichtsheft.setBerichtsheftSignaturAzubi}
            setBerichtsheftViewMode={berichtsheft.setBerichtsheftViewMode}
            setBerichtsheftWeek={berichtsheft.setBerichtsheftWeek}
            setBerichtsheftYear={berichtsheft.setBerichtsheftYear}
            signAssignableUsers={allUsers.filter((account) => account.role === 'trainer' || account.role === 'admin')}
            updateWeekEntry={berichtsheft.updateWeekEntry}
          />
        )}

        {/* ==================== PROFIL VIEW ==================== */}
        {currentView === 'profile' && (
          <ProfileView
            userStats={userStats}
            swimSessions={swimSessions}
            userBadges={userBadges}
            setCurrentView={setCurrentView}
            pushDeviceState={pushDeviceState}
            enablePushNotifications={enablePushNotifications}
            syncPushSubscription={syncPushSubscription}
            disablePushNotifications={disablePushNotifications}
            companies={appConfig.companies}
          />
        )}

        {/* ==================== SAMMLUNG VIEW ==================== */}
        {currentView === 'collection' && (
          <CollectionView
            userStats={userStats}
            swimSessions={swimSessions}
            userBadges={userBadges}
            setCurrentView={setCurrentView}
          />
        )}

        {/* Impressum */}
        {currentView === 'impressum' && (
          <ImpressumView
            setCurrentView={setCurrentView}
          />
        )}

        {/* Datenschutzerkl?rung */}
        {currentView === 'datenschutz' && (
          <DatenschutzView
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'agb' && (
          <AGBView
            setCurrentView={setCurrentView}
          />
        )}

       </Suspense>
      </div>

      {/* Bottom Navigation Bar — mobile only */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden ${darkMode ? 'bg-slate-900/97 border-slate-700' : 'bg-white/97 border-gray-200'} border-t backdrop-blur-sm flex`}
           style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {[
          { id: 'home', icon: '🏠', label: 'Start' },
          { id: 'exam-simulator', icon: '📝', label: 'Prüfung' },
          { id: 'quiz', icon: '🎮', label: 'Quiz' },
          { id: 'berichtsheft', icon: '📖', label: 'Bericht' },
          { id: '__mehr', icon: '☰', label: 'Mehr' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === '__mehr') {
                setShowMehrDrawer(true);
              } else {
                setCurrentView(tab.id);
                playSound('splash');
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center py-2 text-xs transition-all ${
              currentView === tab.id
                ? darkMode ? 'text-cyan-400' : 'text-cyan-600'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-xl leading-none mb-0.5">{tab.icon}</span>
            <span className="text-[10px]">{tab.label}</span>
            {tab.id !== '__mehr' && currentView === tab.id && (
              <div className={`w-1 h-1 rounded-full mt-0.5 ${darkMode ? 'bg-cyan-400' : 'bg-cyan-600'}`} />
            )}
          </button>
        ))}
      </div>

      {/* "Mehr"-Drawer — grouped menu items */}
      {showMehrDrawer && (
        <div
          className="fixed inset-0 z-[100]"
          onClick={() => setShowMehrDrawer(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className={`absolute bottom-0 left-0 right-0 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-t-2xl max-h-[75vh] overflow-y-auto`}
            onClick={e => e.stopPropagation()}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Alle Menüpunkte</h3>
              <button onClick={() => setShowMehrDrawer(false)} className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>✕</button>
            </div>
            <div className="p-4 space-y-4">
              {Object.entries(MENU_GROUP_LABELS)
                .filter(([groupId]) => groupId !== 'home')
                .map(([groupId, groupLabel]) => {
                  const groupItems = [...appConfig.menuItems]
                    .filter(item => {
                      if (!item.visible) return false;
                      if ((item.group || 'lernen') !== groupId) return false;
                      if (item.requiresPermission) return user.permissions[item.requiresPermission];
                      return true;
                    })
                    .sort((a, b) => a.order - b.order);
                  if (groupItems.length === 0) return null;
                  return (
                    <div key={groupId}>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{groupLabel}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {groupItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setCurrentView(item.id);
                              playSound('splash');
                              setShowMehrDrawer(false);
                              if (item.id === 'flashcards') loadFlashcards();
                            }}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                              currentView === item.id
                                ? darkMode ? 'bg-cyan-900/50 text-cyan-400' : 'bg-cyan-50 text-cyan-600'
                                : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              <div className={`pt-2 border-t ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <button
                  onClick={() => {
                    setShowMehrDrawer(false);
                    handleLogout();
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    darkMode
                      ? 'bg-red-500/10 text-red-300 hover:bg-red-500/20'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <span className="text-lg">🚪</span>
                  <span className="font-medium">Abmelden</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  </AuthGuard>
  );
}
