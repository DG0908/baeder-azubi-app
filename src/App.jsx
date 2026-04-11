import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, MessageCircle, BookOpen, Bell, ClipboardList, Users, Plus, Send, Check, X, Upload, Download, Calendar, Award, Brain, Home, Target, TrendingUp, Zap, Star, Shield, Trash2, UserCog, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import LoginScreen from './components/auth/LoginScreen';
import ChatView from './components/views/ChatView';
import ForumView from './components/views/ForumView';
import NewsView from './components/views/NewsView';
import ExamsView from './components/views/ExamsView';
import MaterialsView from './components/views/MaterialsView';
import ResourcesView from './components/views/ResourcesView';
import TrainerDashboardView from './components/views/TrainerDashboardView';
import QuestionsView from './components/views/QuestionsView';
import StatsView from './components/views/StatsView';
import SchoolCardView from './components/views/SchoolCardView';
import ProfileView from './components/views/ProfileView';
import QuizView from './components/views/QuizView';
import HomeView from './components/views/HomeView';
import AdminView from './components/views/AdminView';
import ExamSimulatorView from './components/views/ExamSimulatorView';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import FlashcardsView from './components/views/FlashcardsView';
import CalculatorView from './components/views/CalculatorView';
import SwimChallengeView from './components/views/SwimChallengeView';
import BerichtsheftView from './components/views/BerichtsheftView';
import CollectionView from './components/views/CollectionView';
import ImpressumView from './components/views/ImpressumView';
import DatenschutzView from './components/views/DatenschutzView';
import AGBView from './components/views/AGBView';
import InteractiveLearningView from './components/views/InteractiveLearningView';
import NotfallTrainerView from './components/views/NotfallTrainerView';
import AvatarBadge from './components/ui/AvatarBadge';
import { useInactivityTimeout } from './hooks/useInactivityTimeout';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { useCookieNotice } from './hooks/useCookieNotice';

import { CATEGORIES, DEFAULT_MENU_ITEMS, DEFAULT_THEME_COLORS, PERMISSIONS, MENU_GROUP_LABELS, getAvatarById, getLevel, getLevelProgress } from './data/constants';
import { POOL_CHEMICALS, PERIODIC_TABLE } from './data/chemistry';
import { AUSBILDUNGSRAHMENPLAN, WOCHEN_PRO_JAHR } from './data/ausbildungsrahmenplan';
import { DID_YOU_KNOW_FACTS, DAILY_WISDOM, SAFETY_SCENARIOS, WORK_SAFETY_TOPICS } from './data/content';
import { SAMPLE_QUESTIONS } from './data/quizQuestions';
import { KEYWORD_CHALLENGES, buildKeywordFlashcards } from './data/keywordChallenges';
import { WHO_AM_I_CATEGORY, WHO_AM_I_CHALLENGES, buildWhoAmIFlashcards, buildWhoAmIStudyFlashcards } from './data/whoAmIChallenges';
import { SWIM_STYLES, SWIM_CHALLENGES, SWIM_LEVELS, SWIM_BADGES, SWIM_TRAINING_PLANS, getAgeHandicap, calculateHandicappedTime, calculateSwimPoints, calculateChallengeProgress, getSwimLevel, calculateTeamBattleStats } from './data/swimming';
import { PRACTICAL_EXAM_TYPES, PRACTICAL_SWIM_EXAMS, resolvePracticalDisciplineResult, toNumericGrade, formatGradeLabel, parseExamTimeToSeconds, formatSecondsAsTime } from './data/practicalExam';
import { PRACTICAL_CHECKLISTS } from './data/practicalChecklists';
import { shuffleAnswers } from './lib/utils';
import { friendlyError } from './lib/friendlyError';
import SignatureCanvas from './components/ui/SignatureCanvas';
import { clearUserPushSubscription, ensureUserPushSubscription, fetchPushBackendWithAuth, getCurrentPushDeviceState, isWebPushConfigured, triggerWebPushNotification } from './lib/pushNotifications';
import {
  loadUsers as dsLoadUsers,
  loadAppConfig as dsLoadAppConfig,
  loadGames as dsLoadGames,
  loadMessages as dsLoadMessages,
  loadDirectMessages as dsLoadDirectMessages,
  createChatMessage as dsCreateChatMessage,
  deleteChatMessage as dsDeleteChatMessage,
  loadNotifications as dsLoadNotifications,
  sendNotification as dsSendNotification,
  markNotificationRead as dsMarkNotificationRead,
  clearAllNotifications as dsClearAllNotifications,
  getUserStats as dsGetUserStats,
  getAllUserStats as dsGetAllUserStats,
  saveUserStats as dsSaveUserStats,
  loadMaterials as dsLoadMaterials,
  loadResources as dsLoadResources,
  loadNews as dsLoadNews,
  loadExams as dsLoadExams,
  loadFlashcards as dsLoadFlashcards,
  loadCustomQuestions as dsLoadCustomQuestions,
  createQuestionSubmission as dsCreateQuestionSubmission,
  approveQuestionSubmission as dsApproveQuestionSubmission,
  loadQuestionReports as dsLoadQuestionReports,
  approveUser as dsApproveUser,
  deleteUser as dsDeleteUser,
  purgeUserData as dsPurgeUserData,
  changeUserRole as dsChangeUserRole,
  updateUserPermission as dsUpdateUserPermission,
  loadSwimTrainingPlans as dsLoadSwimTrainingPlans,
  startTheoryExamSession as dsStartTheoryExamSession,
  saveTheoryExamAttempt as dsSaveTheoryExamAttempt,
  loadTheoryExamHistory as dsLoadTheoryExamHistory,
  deletePracticalExamAttempt as dsDsPracticalExamAttempt,
  saveAppConfig as dsSaveAppConfig,
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
  approveFlashcardEntry as dsApproveFlashcard,
  deleteFlashcardEntry as dsDeleteFlashcard,
  createDuel as dsCreateDuel,
  acceptDuel as dsAcceptDuel,
  getDuelWithQuestions as dsGetDuelWithQuestions,
  submitDuelAnswer as dsSubmitDuelAnswer,
  forfeitDuel as dsForfeitDuel,
  saveDuelState as dsSaveDuelState,
  loadSwimSessionEntries as dsLoadSwimSessions,
  saveSwimSessionEntry as dsSaveSwimSession,
  confirmSwimSessionEntry as dsConfirmSwimSession,
  rejectSwimSessionEntry as dsRejectSwimSession,
  withdrawSwimSessionEntry as dsWithdrawSwimSession,
  loadCustomSwimTrainingPlanEntries as dsLoadCustomSwimPlans,
  createCustomSwimTrainingPlanEntry as dsCreateCustomSwimPlan,
  loadBerichtsheftEntriesFromDb as dsLoadBerichtsheftEntries,
  saveBerichtsheftEntry as dsSaveBerichtsheft,
  deleteBerichtsheftEntry as dsDeleteBerichtsheft,
  loadBerichtsheftPending as dsLoadBerichtsheftPending,
  assignBerichtsheftTrainerEntry as dsAssignBerichtsheftTrainer,
  upsertBerichtsheftDraft as dsUpsertBerichtsheftDraft,
  deleteBerichtsheftDraftByWeek as dsDeleteBerichtsheftDraft,
  updateBerichtsheftProfile as dsUpdateBerichtsheftProfile,
  loadPracticalExamAttempts as dsLoadPracticalExamAttempts,
  savePracticalExamAttemptEntry as dsSavePracticalExamAttempt,
  reportQuestion as dsReportQuestion,
  updateQuestionReportStatus as dsUpdateQuestionReportStatus,
  repairQuizStatsRemote as dsRepairQuizStats,
  sendTestPushRemote as dsSendTestPush,
  getAuthorizedReviewers as dsGetAuthorizedReviewers,
  saveBadges as dsSaveBadges,
  loadUserBadges as dsLoadUserBadges,
  loadSwimMonthlyResultEntries as dsLoadSwimMonthlyResults,
  upsertSwimMonthlyResultEntry as dsUpsertSwimMonthlyResult,
  loadBerichtsheftProfile as dsLoadBerichtsheftProfile,
  resolveUserIdentity as dsResolveUserIdentity,
  loadRetentionCandidates as dsLoadRetentionCandidates,
  exportUserDataBundle as dsExportUserDataBundle
} from './lib/dataService';

export default function BaederApp() {
  const QUESTION_PERFORMANCE_STORAGE_KEY = 'question_performance_v1';
  const ADAPTIVE_LEARNING_STORAGE_KEY = 'adaptive_learning_mode_v1';
  const WEEKLY_GOALS_STORAGE_KEY = 'weekly_goals_v1';
  const WEEKLY_PROGRESS_STORAGE_KEY = 'weekly_progress_v1';
  const WEEKLY_REMINDER_STORAGE_KEY = 'weekly_goals_reminder_v1';
  const QUESTION_REPORTS_STORAGE_KEY = 'question_reports_v1';
  const CHECKLIST_PROGRESS_STORAGE_KEY = 'practical_checklist_progress_v1';
  const BERICHTSHEFT_DRAFT_STORAGE_KEY = 'berichtsheft_drafts_v1';
  const BERICHTSHEFT_DAY_KEYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
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

  const createEmptyBerichtsheftEntries = () => BERICHTSHEFT_DAY_KEYS.reduce((acc, day) => {
    acc[day] = [{ taetigkeit: '', stunden: '', bereich: '' }];
    return acc;
  }, {});

  const normalizeBerichtsheftEntries = (value) => {
    const source = (value && typeof value === 'object' && !Array.isArray(value)) ? value : {};
    const normalized = {};
    BERICHTSHEFT_DAY_KEYS.forEach((day) => {
      const rows = Array.isArray(source[day]) ? source[day] : [];
      const mapped = rows
        .filter((row) => row && typeof row === 'object')
        .map((row) => ({
          taetigkeit: String(row.taetigkeit || ''),
          stunden: String(row.stunden || ''),
          bereich: String(row.bereich || '')
        }));
      normalized[day] = mapped.length > 0
        ? mapped
        : [{ taetigkeit: '', stunden: '', bereich: '' }];
    });
    return normalized;
  };

  const getBerichtsheftStatus = (entry) => String(entry?.status || 'submitted')
    .trim()
    .toLowerCase();

  const isBerichtsheftDraft = (entry) => getBerichtsheftStatus(entry) === 'draft';

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
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);

  useInactivityTimeout({
    enabled: !!user,
    onWarn: () => setShowInactivityWarning(true),
    onDismissWarn: () => setShowInactivityWarning(false),
    onLogout: handleLogout,
  });

  const [currentView, setCurrentView] = useState('home');
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
  const quizActiveRef = useRef(false);
  const answerSubmissionLockRef = useRef(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false); // Warte auf anderen Spieler
  const [duelResult, setDuelResult] = useState(null); // Ergebnis-Screen nach Spielende
  const [categoryRoundResult, setCategoryRoundResult] = useState(null); // Kategorie-Vergleich zwischen Runden
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Für Multi-Select Fragen
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState(null); // Für Single-Choice Feedback
  const [keywordAnswerText, setKeywordAnswerText] = useState('');
  const [keywordAnswerEvaluation, setKeywordAnswerEvaluation] = useState(null);
  const [quizMCKeywordMode, setQuizMCKeywordMode] = useState(false);
  
  const DIFFICULTY_SETTINGS = {
    anfaenger: { time: 45, label: 'Anfänger', icon: '🟢', color: 'bg-green-500' },
    profi: { time: 30, label: 'Profi', icon: '🟡', color: 'bg-yellow-500' },
    experte: { time: 15, label: 'Experte', icon: '🔴', color: 'bg-red-500' },
    extra: { time: 75, label: 'Extra schwer', icon: '🧠', color: 'bg-indigo-700' }
  };
  const DEFAULT_CHALLENGE_TIMEOUT_MINUTES = 48 * 60;
  const CHALLENGE_TIMEOUT_BOUNDS = { min: 15, max: 7 * 24 * 60 };

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
  const STAFF_CHAT_ROLES = new Set(['trainer', 'ausbilder', 'admin']);
  const CHAT_SCOPE_META = {
    azubi_room: {
      label: 'Azubi-Chat',
      description: 'Nur Azubis aus deinem Betrieb'
    },
    staff_room: {
      label: 'Azubi & Ausbilder',
      description: 'Gemeinsamer Betriebschat'
    },
    direct_staff: {
      label: 'Direktchat',
      description: '1:1 zwischen Azubi und Ausbilder'
    }
  };
  const getRoleKey = (value) => String(value || '').trim().toLowerCase();
  const isStaffRole = (value) => STAFF_CHAT_ROLES.has(getRoleKey(value));
  const getAccountOrganizationId = (account) => account?.organizationId || account?.organization_id || null;
  const getChatScopeKey = (value, fallback = 'staff_room') => {
    const normalized = String(value || '').trim().toLowerCase();
    return CHAT_SCOPE_META[normalized] ? normalized : fallback;
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
    practicalExam: 0,
    flashcardLearning: 0,
    flashcardCreation: 0,
    quizWins: 0,
    swimTrainingPlans: 0
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

  const getFirstSafeInt = (...values) => {
    for (const value of values) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return Math.max(0, Math.round(parsed));
      }
    }
    return null;
  };

  const normalizeChallengeTimeoutMinutes = (value) => {
    const parsed = toSafeInt(value);
    if (!parsed) return DEFAULT_CHALLENGE_TIMEOUT_MINUTES;
    return Math.min(
      CHALLENGE_TIMEOUT_BOUNDS.max,
      Math.max(CHALLENGE_TIMEOUT_BOUNDS.min, parsed)
    );
  };

  const parseTimestampSafe = (value) => {
    if (!value) return null;
    const date = new Date(value);
    const timestamp = date.getTime();
    return Number.isFinite(timestamp) ? timestamp : null;
  };

  const getChallengeTimeoutMs = (gameInput) => {
    const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
    const timeoutMinutes = normalizeChallengeTimeoutMinutes(game.challengeTimeoutMinutes);
    return timeoutMinutes * 60 * 1000;
  };

  const getChallengeExpiryTimestamp = (gameInput) => {
    const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
    const explicitExpiry = parseTimestampSafe(game.challengeExpiresAt);
    if (explicitExpiry !== null) return explicitExpiry;

    const createdAt = parseTimestampSafe(game.createdAt);
    if (createdAt !== null) return createdAt + getChallengeTimeoutMs(game);

    const updatedAt = parseTimestampSafe(game.updatedAt);
    if (updatedAt !== null) return updatedAt + getChallengeTimeoutMs(game);

    return null;
  };

  const getWaitingChallengeRemainingMs = (gameInput, nowInput = Date.now()) => {
    const expiryTs = getChallengeExpiryTimestamp(gameInput);
    if (expiryTs === null) return Number.POSITIVE_INFINITY;
    return expiryTs - nowInput;
  };

  const isWaitingChallengeExpired = (gameInput, nowInput = Date.now()) => {
    const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
    if (String(game.status || '').toLowerCase() !== 'waiting') return false;
    return getWaitingChallengeRemainingMs(game, nowInput) <= 0;
  };

  const formatDurationMinutesCompact = (minutesInput) => {
    const minutes = Math.max(1, toSafeInt(minutesInput));
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;

    if (days > 0) {
      if (hours > 0) return `${days}d ${hours}h`;
      return `${days}d`;
    }
    if (hours > 0) {
      if (mins > 0) return `${hours}h ${mins}m`;
      return `${hours}h`;
    }
    return `${mins}m`;
  };

  const parseDateSafe = (value) => {
    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const getSwimMonthKey = (dateInput = new Date()) => {
    const date = parseDateSafe(dateInput);
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const isDateInSwimMonth = (dateInput, monthKey) => {
    const date = parseDateSafe(dateInput);
    if (!date) return false;
    return getSwimMonthKey(date) === String(monthKey || '');
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
    const normalizedBreakdown = {
      ...XP_BREAKDOWN_DEFAULT,
      examSimulator: getFirstSafeInt(rawBreakdown.examSimulator, rawMeta.examSimulator) ?? 0,
      practicalExam: getFirstSafeInt(rawBreakdown.practicalExam, rawMeta.practicalExam) ?? 0,
      flashcardLearning: getFirstSafeInt(rawBreakdown.flashcardLearning, rawMeta.flashcardLearning) ?? 0,
      flashcardCreation: getFirstSafeInt(rawBreakdown.flashcardCreation, rawMeta.flashcardCreation) ?? 0,
      quizWins: getFirstSafeInt(rawBreakdown.quizWins, rawMeta.quizWins) ?? 0,
      swimTrainingPlans: getFirstSafeInt(rawBreakdown.swimTrainingPlans, rawMeta.swimTrainingPlans) ?? 0
    };
    const breakdownTotal = Object.values(normalizedBreakdown).reduce((sum, value) => sum + toSafeInt(value), 0);
    const explicitTotalXp = getFirstSafeInt(
      rawMeta.totalXp,
      rawMeta.total_xp,
      rawMeta.xp,
      rawMeta.total,
      safeCategoryStats.totalXp,
      safeCategoryStats.total_xp,
      safeCategoryStats.xp
    );

    return {
      totalXp: explicitTotalXp === null
        ? breakdownTotal
        : (explicitTotalXp === 0 && breakdownTotal > 0 ? breakdownTotal : explicitTotalXp),
      breakdown: normalizedBreakdown,
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

  const buildUserStatsFromRow = (row) => ensureUserStatsStructure(row ? {
    wins: row.wins || 0,
    losses: row.losses || 0,
    draws: row.draws || 0,
    categoryStats: row.categoryStats || row.category_stats || {},
    opponents: row.opponents || {},
    winStreak: row.winStreak ?? row.win_streak ?? 0,
    bestWinStreak: row.bestWinStreak ?? row.best_win_streak ?? 0
  } : createEmptyUserStats());

  const getResolvedGameScores = (gameInput) => {
    const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
    return {
      player1Score: getFirstSafeInt(game.player1Score, game.player1_score, game.challengerScore) ?? 0,
      player2Score: getFirstSafeInt(game.player2Score, game.player2_score, game.duelOpponentScore) ?? 0
    };
  };

  const resolveFinishedGameWinner = (gameInput) => {
    const game = (gameInput && typeof gameInput === 'object') ? gameInput : {};
    if (game.winner) {
      return game.winner;
    }

    const { player1Score, player2Score } = getResolvedGameScores(game);
    if (player1Score > player2Score) return game.player1 || null;
    if (player2Score > player1Score) return game.player2 || null;
    return null;
  };

  const buildQuizTotalsFromFinishedGames = (gamesInput, currentUserName, existingStats = null) => {
    const baseStats = ensureUserStatsStructure(existingStats || createEmptyUserStats());
    const finishedGames = Array.isArray(gamesInput) ? gamesInput : [];
    const normalizedUserName = normalizePlayerName(currentUserName);
    let wins = 0;
    let losses = 0;
    let draws = 0;
    const opponents = {};

    finishedGames.forEach((game) => {
      if (!isFinishedGameStatus(game?.status)) return;

      const player1 = normalizePlayerName(game.player1);
      const player2 = normalizePlayerName(game.player2);
      if (player1 !== normalizedUserName && player2 !== normalizedUserName) return;

      const winner = resolveFinishedGameWinner(game);

      const opponent = player1 === normalizedUserName ? game.player2 : game.player1;
      if (!opponents[opponent]) {
        opponents[opponent] = { wins: 0, losses: 0, draws: 0 };
      }

      if (normalizePlayerName(winner) === normalizedUserName) {
        wins += 1;
        opponents[opponent].wins += 1;
      } else if (winner === null) {
        draws += 1;
        opponents[opponent].draws += 1;
      } else {
        losses += 1;
        opponents[opponent].losses += 1;
      }
    });

    return {
      ...baseStats,
      wins,
      losses,
      draws,
      opponents
    };
  };

  const buildHeadToHeadFromFinishedGames = (gamesInput, currentUserName, opponentName) => {
    const safeOpponentName = String(opponentName || '').trim();
    if (!currentUserName || !safeOpponentName) {
      return { wins: 0, losses: 0, draws: 0 };
    }

    const finishedGames = Array.isArray(gamesInput) ? gamesInput : [];
    const normalizedUserName = normalizePlayerName(currentUserName);
    const normalizedOpponentName = normalizePlayerName(safeOpponentName);
    let wins = 0;
    let losses = 0;
    let draws = 0;

    finishedGames.forEach((game) => {
      if (!isFinishedGameStatus(game?.status)) return;

      const player1 = normalizePlayerName(game.player1);
      const player2 = normalizePlayerName(game.player2);
      const hasCurrentUser = player1 === normalizedUserName || player2 === normalizedUserName;
      const hasOpponent = player1 === normalizedOpponentName || player2 === normalizedOpponentName;
      if (!hasCurrentUser || !hasOpponent) return;

      const winner = resolveFinishedGameWinner(game);
      const normalizedWinner = normalizePlayerName(winner);
      if (!normalizedWinner) {
        draws += 1;
      } else if (normalizedWinner === normalizedUserName) {
        wins += 1;
      } else {
        losses += 1;
      }
    });

    return { wins, losses, draws };
  };

  const haveQuizTotalsChanged = (currentStatsInput, syncedStatsInput) => {
    const currentStats = ensureUserStatsStructure(currentStatsInput || createEmptyUserStats());
    const syncedStats = ensureUserStatsStructure(syncedStatsInput || createEmptyUserStats());
    if (
      currentStats.wins !== syncedStats.wins
      || currentStats.losses !== syncedStats.losses
      || currentStats.draws !== syncedStats.draws
    ) {
      return true;
    }

    const currentOpponents = currentStats.opponents || {};
    const syncedOpponents = syncedStats.opponents || {};
    const opponentNames = new Set([
      ...Object.keys(currentOpponents),
      ...Object.keys(syncedOpponents)
    ]);

    for (const opponentName of opponentNames) {
      const currentOpponent = currentOpponents[opponentName] || {};
      const syncedOpponent = syncedOpponents[opponentName] || {};
      if (
        toSafeInt(currentOpponent.wins) !== toSafeInt(syncedOpponent.wins)
        || toSafeInt(currentOpponent.losses) !== toSafeInt(syncedOpponent.losses)
        || toSafeInt(currentOpponent.draws) !== toSafeInt(syncedOpponent.draws)
      ) {
        return true;
      }
    }

    return false;
  };

  const syncQuizTotalsIntoStats = (statsInput, gamesInput, currentUserName) => {
    const stats = ensureUserStatsStructure(statsInput || createEmptyUserStats());
    const syncedQuizStats = buildQuizTotalsFromFinishedGames(gamesInput, currentUserName, stats);
    if (!haveQuizTotalsChanged(stats, syncedQuizStats)) {
      return stats;
    }

    return ensureUserStatsStructure({
      ...stats,
      wins: syncedQuizStats.wins,
      losses: syncedQuizStats.losses,
      draws: syncedQuizStats.draws,
      opponents: syncedQuizStats.opponents
    });
  };

  const resetAnswerSubmissionLock = () => {
    answerSubmissionLockRef.current = false;
  };

  const resetQuizDuelRuntimeState = () => {
    resetAnswerSubmissionLock();
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
    resetQuizKeywordState();
  };

  const handleForfeitDuel = async () => {
    if (!currentGame?.id) return;
    try {
      await dsForfeitDuel(currentGame.id);
    } catch (e) {
      console.warn('Aufgeben fehlgeschlagen:', e);
    }
    resetQuizDuelRuntimeState();
    setActiveGames(prev => prev.filter(g => g.id !== currentGame?.id));
  };

  const cloneDuelGameSnapshot = (gameInput) => {
    if (!gameInput || typeof gameInput !== 'object') {
      return gameInput;
    }
    if (typeof structuredClone === 'function') {
      return structuredClone(gameInput);
    }
    return JSON.parse(JSON.stringify(gameInput));
  };

  const syncLocalDuelGame = (gameInput) => {
    const nextGame = cloneDuelGameSnapshot(gameInput);
    if (!nextGame?.id) {
      return nextGame;
    }

    setCurrentGame((prev) => (prev?.id === nextGame.id ? nextGame : prev));
    setActiveGames((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.id === nextGame.id);
      if (isFinishedGameStatus(nextGame.status)) {
        return existingIndex === -1
          ? prev
          : prev.filter((entry) => entry.id !== nextGame.id);
      }
      if (existingIndex === -1) {
        return [nextGame, ...prev];
      }
      return prev.map((entry) => (entry.id === nextGame.id ? nextGame : entry));
    });
    setAllGames((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.id === nextGame.id);
      if (existingIndex === -1) {
        return [nextGame, ...prev];
      }
      return prev.map((entry) => (entry.id === nextGame.id ? nextGame : entry));
    });

    return nextGame;
  };

  const showDuelResultForGame = (gameInput, gamesSource = null, h2hOverride = null) => {
    const game = (gameInput && typeof gameInput === 'object') ? gameInput : null;
    if (!game || !user?.name) return;

    const opponentName = namesMatch(game.player1, user.name) ? game.player2 : game.player1;
    const { player1Score, player2Score } = getResolvedGameScores(game);
    const winner = resolveFinishedGameWinner(game);
    const h2h = h2hOverride || buildHeadToHeadFromFinishedGames(gamesSource || allGames, user.name, opponentName);

    setDuelResult({
      gameId: game.id,
      player1: game.player1,
      player2: game.player2,
      player1Score,
      player2Score,
      winner,
      myName: user.name,
      opponentName,
      h2h: {
        wins: h2h.wins || 0,
        losses: h2h.losses || 0,
        draws: h2h.draws || 0
      }
    });

    resetQuizDuelRuntimeState();
    setCategoryRoundResult(null);
    setCurrentView('quiz');
  };

  const mergeOpponentStatsByMax = (storedOpponentsInput, syncedOpponentsInput) => {
    const storedOpponents = (storedOpponentsInput && typeof storedOpponentsInput === 'object')
      ? storedOpponentsInput
      : {};
    const syncedOpponents = (syncedOpponentsInput && typeof syncedOpponentsInput === 'object')
      ? syncedOpponentsInput
      : {};
    const merged = { ...storedOpponents };

    Object.entries(syncedOpponents).forEach(([opponentName, syncedValues]) => {
      const storedValues = merged[opponentName] || {};
      merged[opponentName] = {
        wins: Math.max(toSafeInt(storedValues.wins), toSafeInt(syncedValues?.wins)),
        losses: Math.max(toSafeInt(storedValues.losses), toSafeInt(syncedValues?.losses)),
        draws: Math.max(toSafeInt(storedValues.draws), toSafeInt(syncedValues?.draws))
      };
    });

    return merged;
  };

  const doesUserStatsRowNeedRepair = (row, normalizedStats) => {
    if (!row) return false;
    const rawCategoryStats = (row.category_stats && typeof row.category_stats === 'object')
      ? row.category_stats
      : {};
    const rawMeta = (rawCategoryStats[XP_META_KEY] && typeof rawCategoryStats[XP_META_KEY] === 'object')
      ? rawCategoryStats[XP_META_KEY]
      : null;
    const rawBreakdown = (rawMeta?.breakdown && typeof rawMeta.breakdown === 'object')
      ? rawMeta.breakdown
      : null;
    const normalizedMeta = getXpMetaFromCategoryStats(normalizedStats?.categoryStats || {});
    const rawTotalXp = getFirstSafeInt(
      rawMeta?.totalXp,
      rawMeta?.total_xp,
      rawMeta?.xp,
      rawMeta?.total,
      rawCategoryStats.totalXp,
      rawCategoryStats.total_xp,
      rawCategoryStats.xp
    );

    if (!rawMeta || !rawBreakdown) return true;
    if (rawMeta.awardedEvents !== undefined && (rawMeta.awardedEvents === null || typeof rawMeta.awardedEvents !== 'object')) {
      return true;
    }
    if (rawTotalXp === null && normalizedMeta.totalXp > 0) {
      return true;
    }

    return Object.keys(XP_BREAKDOWN_DEFAULT).some((key) => (
      rawBreakdown[key] === undefined
      && rawMeta[key] === undefined
      && normalizedMeta.breakdown[key] > 0
    ));
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

  const deductXpFromStats = (statsInput, amount) => {
    const xpToDeduct = Math.max(0, Math.round(amount));
    const safeStats = ensureUserStatsStructure(statsInput);
    if (xpToDeduct === 0) return { stats: safeStats, deductedXp: 0 };
    const safeCategoryStats = { ...(safeStats.categoryStats || {}) };
    const xpMeta = getXpMetaFromCategoryStats(safeCategoryStats);
    const actualDeduction = Math.min(xpToDeduct, xpMeta.totalXp); // nie unter 0
    if (actualDeduction === 0) return { stats: safeStats, deductedXp: 0 };
    xpMeta.totalXp -= actualDeduction;
    safeCategoryStats[XP_META_KEY] = xpMeta;
    return { stats: { ...safeStats, categoryStats: safeCategoryStats }, deductedXp: actualDeduction };
  };

  // Other State
  const [userStats, setUserStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatScope, setChatScope] = useState('staff_room');
  const [selectedChatRecipientId, setSelectedChatRecipientId] = useState('');
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
  const [editingMenuItems, setEditingMenuItems] = useState([]);
  const [editingThemeColors, setEditingThemeColors] = useState({});
  const [configLoaded, setConfigLoaded] = useState(false);
  const [showMehrDrawer, setShowMehrDrawer] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
  const [keywordFlashcardMode, setKeywordFlashcardMode] = useState(false);
  const [whoAmIFlashcardMode, setWhoAmIFlashcardMode] = useState(false);
  const [flashcardKeywordInput, setFlashcardKeywordInput] = useState('');
  const [flashcardKeywordEvaluation, setFlashcardKeywordEvaluation] = useState(null);
  const [flashcardFreeTextMode, setFlashcardFreeTextMode] = useState(false);
  
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

  // Berichtsheft (Ausbildungsnachweis) State
  const [berichtsheftEntries, setBerichtsheftEntries] = useState([]);
  const [berichtsheftWeek, setBerichtsheftWeek] = useState(() => getWeekStartStamp());
  const [berichtsheftYear, setBerichtsheftYear] = useState(1); // Ausbildungsjahr 1-3
  const [berichtsheftNr, setBerichtsheftNr] = useState(1); // Nachweis-Nummer
  const [currentWeekEntries, setCurrentWeekEntries] = useState(() => createEmptyBerichtsheftEntries());
  const [berichtsheftBemerkungAzubi, setBerichtsheftBemerkungAzubi] = useState('');
  const [berichtsheftBemerkungAusbilder, setBerichtsheftBemerkungAusbilder] = useState('');
  const [berichtsheftSignaturAzubi, setBerichtsheftSignaturAzubi] = useState('');
  const [berichtsheftSignaturAusbilder, setBerichtsheftSignaturAusbilder] = useState('');
  const [berichtsheftDatumAzubi, setBerichtsheftDatumAzubi] = useState('');
  const [berichtsheftDatumAusbilder, setBerichtsheftDatumAusbilder] = useState('');
  const [selectedBerichtsheft, setSelectedBerichtsheft] = useState(null); // Für Bearbeitung
  const [berichtsheftViewMode, setBerichtsheftViewMode] = useState('edit'); // 'edit', 'list', 'progress', 'profile', 'sign'
  const [berichtsheftPendingSignatures, setBerichtsheftPendingSignatures] = useState([]);
  const [berichtsheftPendingLoading, setBerichtsheftPendingLoading] = useState(false);
  const [berichtsheftServerDraftsByWeek, setBerichtsheftServerDraftsByWeek] = useState({});
  const [berichtsheftRemoteDraftsEnabled, setBerichtsheftRemoteDraftsEnabled] = useState(true);

  // Schwimmchallenge State
  const [swimChallengeView, setSwimChallengeView] = useState('overview'); // 'overview', 'challenges', 'plans', 'add', 'leaderboard', 'battle'
  const [swimSessions, setSwimSessions] = useState([]); // Alle Trainingseinheiten (aus Supabase)
  const [swimSessionsLoaded, setSwimSessionsLoaded] = useState(false);
  const [customSwimTrainingPlans, setCustomSwimTrainingPlans] = useState([]);
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
    challengeId: '',
    trainingPlanId: '',
    trainingPlanUnitId: ''
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
  const [swimMonthlyResults, setSwimMonthlyResults] = useState([]);
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
  const berichtsheftDraftSaveTimerRef = useRef(null);
  const berichtsheftRemoteDraftSaveTimerRef = useRef(null);
  const berichtsheftRemoteDraftWarningShownRef = useRef(false);
  const xpAwardQueueRef = useRef(Promise.resolve(0));
  const notificationTrackerRef = useRef({
    userId: null,
    initialized: false,
    knownIds: new Set(),
    announcedIds: new Set()
  });
  const canManageBerichtsheftSignatures = Boolean(
    user && (user.role === 'admin' || user.role === 'trainer' || user.canSignReports)
  );

  // Calculator State
  const [calculatorType, setCalculatorType] = useState('ph');
  const [calculatorInputs, setCalculatorInputs] = useState({});
  const [calculatorResult, setCalculatorResult] = useState(null);
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  // Profil-Bearbeitung State: vollständig in ProfileView ausgelagert

  // Toast-Benachrichtigungen (Zustand + showToast vom AppContext)
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updatingApp, setUpdatingApp] = useState(false);
  const [pushDeviceState, setPushDeviceState] = useState({
    supported: false,
    configured: false,
    permission: 'default',
    hasSubscription: false,
    endpoint: '',
    checking: false
  });

  const refreshPushDeviceState = useCallback(async () => {
    setPushDeviceState((previous) => ({ ...previous, checking: true }));
    try {
      const nextState = await getCurrentPushDeviceState();
      setPushDeviceState({ ...nextState, checking: false });
      return nextState;
    } catch (error) {
      console.warn('Push device state check failed:', error);
      const permission = typeof window !== 'undefined' && 'Notification' in window
        ? Notification.permission
        : 'unsupported';
      const fallbackState = {
        supported: false,
        configured: isWebPushConfigured(),
        permission,
        hasSubscription: false,
        endpoint: '',
        checking: false
      };
      setPushDeviceState(fallbackState);
      return fallbackState;
    }
  }, []);

  const syncPushSubscription = useCallback(async (requestPermission = false) => {
    try {
      const result = await ensureUserPushSubscription({
        user,
        requestPermission
      });
      await refreshPushDeviceState();
      return result.enabled;
    } catch (error) {
      console.warn('Push subscription sync failed:', error);
      await refreshPushDeviceState();
      return false;
    }
  }, [refreshPushDeviceState, user]);

  const disablePushNotifications = useCallback(async () => {
    try {
      const result = await clearUserPushSubscription({
        user
      });
      await refreshPushDeviceState();
      return result;
    } catch (error) {
      console.warn('Push disable failed:', error);
      await refreshPushDeviceState();
      throw error;
    }
  }, [refreshPushDeviceState, user]);

  const enablePushNotifications = async () => {
    if (!isWebPushConfigured()) {
      showToast('Push ist noch nicht konfiguriert (VAPID Public Key fehlt).', 'warning');
      return;
    }

    const enabled = await syncPushSubscription(true);
    if (!enabled) {
      if ('Notification' in window && Notification.permission === 'denied') {
        showToast('Bitte aktiviere Benachrichtigungen in den Browser-/App-Einstellungen.', 'warning');
      } else {
        showToast('Push konnte nicht aktiviert werden.', 'error');
      }
      return;
    }

    showToast('Push-Benachrichtigungen aktiviert.', 'success');
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Push aktiviert', {
        body: 'Du erhaeltst jetzt Handy-Benachrichtigungen für neue Ereignisse.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'push-enabled'
      });
    }
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

  const announceNotificationLocally = useCallback(async (notification) => {
    const notificationId = String(notification?.id || '').trim();
    if (!notificationId) return;

    const tracker = notificationTrackerRef.current;
    if (tracker.announcedIds.has(notificationId)) return;
    tracker.announcedIds.add(notificationId);

    if (user?.name === notification?.userName) {
      playSound('whistle');
    }

    const toastType = notification?.type === 'error' || notification?.type === 'warning'
      ? notification.type
      : 'info';

    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const notificationOptions = {
          body: notification.message,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          tag: `notif-${notificationId}`,
          data: { url: '/' }
        };

        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration?.showNotification) {
            await registration.showNotification(notification.title, notificationOptions);
            return;
          }
        }

        new Notification(notification.title, notificationOptions);
        return;
      }
    } catch (error) {
      console.warn('Local notification fallback failed:', error);
    }

    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      showToast(`${notification.title}: ${notification.message}`, toastType, 4500);
    }
  }, [playSound, showToast, user?.name]);

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

  // Track last visited view for "Weiter machen" shortcut on Home
  useEffect(() => {
    if (currentView && currentView !== 'home') {
      localStorage.setItem('lastView', currentView);
    }
  }, [currentView]);

  useEffect(() => {
    notificationTrackerRef.current = {
      userId: user?.id || null,
      initialized: false,
      knownIds: new Set(),
      announcedIds: new Set()
    };
  }, [user?.id]);

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

  const normalizeKeywordText = (value) => String(value || '')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Returns the word plus singular/plural variants so matching works both ways.
  // German plurals are mostly formed with -en, -e, -s; we strip these to get the stem.
  // The stem is added alongside the original so `includes(term)` matches either form.
  const getWordVariants = (normalizedWord) => {
    const variants = [normalizedWord];
    const addVariant = (candidate) => {
      if (candidate && !variants.includes(candidate)) {
        variants.push(candidate);
      }
    };

    addVariant(
      normalizedWord
        .replace(/ae/g, 'a')
        .replace(/oe/g, 'o')
        .replace(/ue/g, 'u')
    );

    if (normalizedWord.endsWith('en') && normalizedWord.length - 2 >= 4) {
      const stem = normalizedWord.slice(0, -2);
      addVariant(stem);
      // Two-level strip: Chloriden → Chloride → Chlorid
      if (stem.endsWith('e') && stem.length - 1 >= 4) {
        addVariant(stem.slice(0, -1));
      }
    } else if (normalizedWord.endsWith('e') && normalizedWord.length - 1 >= 4) {
      addVariant(normalizedWord.slice(0, -1));
    } else if (normalizedWord.endsWith('s') && normalizedWord.length - 1 >= 4) {
      addVariant(normalizedWord.slice(0, -1));
    }
    return variants;
  };

  const tokenizeKeywordText = (value) => normalizeKeywordText(value)
    .split(' ')
    .map((token) => token.trim())
    .filter(Boolean);

  const buildKeywordTokenVariants = (value) => {
    const variants = new Set();
    tokenizeKeywordText(value).forEach((token) => {
      getWordVariants(token).forEach((variant) => {
        if (variant) variants.add(variant);
      });
    });
    return variants;
  };

  const matchesKeywordTerm = (normalizedAnswer, answerVariantTokens, term) => {
    const normalizedTerm = normalizeKeywordText(term);
    if (!normalizedTerm) return false;
    if (normalizedAnswer.includes(normalizedTerm)) return true;

    const termTokens = tokenizeKeywordText(normalizedTerm);
    if (termTokens.length === 0) return false;

    return termTokens.every((token) => {
      const tokenVariants = getWordVariants(token);
      return tokenVariants.some((variant) => {
        if (!variant) return false;
        if (answerVariantTokens.has(variant)) return true;
        return Array.from(answerVariantTokens).some((answerToken) =>
          answerToken.startsWith(variant) || variant.startsWith(answerToken)
        );
      });
    });
  };

  const normalizeKeywordGroup = (groupInput) => {
    if (typeof groupInput === 'string') {
      return {
        label: groupInput,
        terms: [groupInput]
      };
    }

    if (Array.isArray(groupInput)) {
      const terms = groupInput
        .map((term) => String(term || '').trim())
        .filter(Boolean);
      return {
        label: terms[0] || 'Schlagwort',
        terms
      };
    }

    if (groupInput && typeof groupInput === 'object') {
      const label = String(groupInput.label || groupInput.name || '').trim();
      const terms = Array.isArray(groupInput.terms)
        ? groupInput.terms.map((term) => String(term || '').trim()).filter(Boolean)
        : [];
      return {
        label: label || terms[0] || 'Schlagwort',
        terms
      };
    }

    return { label: 'Schlagwort', terms: [] };
  };

  const getKeywordGroupsFromQuestion = (question) => {
    if (!question || !Array.isArray(question.keywordGroups)) return [];
    return question.keywordGroups
      .map(normalizeKeywordGroup)
      .filter((group) => group.terms.length > 0)
      .map((group) => ({
        ...group,
        normalizedTerms: [...new Set(group.terms.map((term) => normalizeKeywordText(term)).filter(Boolean))]
      }))
      .filter((group) => group.normalizedTerms.length > 0);
  };

  const isKeywordQuestion = (question) => {
    return Boolean(question?.type === 'keyword' && getKeywordGroupsFromQuestion(question).length > 0);
  };

  const isWhoAmIQuestion = (question) => {
    return Boolean(question?.type === 'whoami' && Array.isArray(question?.clues) && getKeywordGroupsFromQuestion(question).length > 0);
  };

  const evaluateKeywordAnswer = (question, answerInput) => {
    const groups = getKeywordGroupsFromQuestion(question);
    const normalizedAnswer = normalizeKeywordText(answerInput);
    const answerVariantTokens = buildKeywordTokenVariants(answerInput);
    const wordCount = normalizedAnswer ? normalizedAnswer.split(' ').filter(Boolean).length : 0;
    const requiredWordCount = Math.max(0, Number(question?.minWords) || 0);
    const requiredGroups = Math.max(
      1,
      Math.min(groups.length, Number(question?.minKeywordGroups) || groups.length || 1)
    );

    if (!normalizedAnswer) {
      return {
        isCorrect: false,
        hasContent: false,
        requiredGroups,
        matchedCount: 0,
        scorePercent: 0,
        basePoints: 0,
        bonusPoints: 0,
        awardedPoints: 0,
        matchedLabels: [],
        missingLabels: groups.map((group) => group.label),
        wordCount,
        requiredWordCount
      };
    }

    const matchedLabels = [];
    const missingLabels = [];
    groups.forEach((group) => {
      const matched = group.normalizedTerms.some((term) => matchesKeywordTerm(normalizedAnswer, answerVariantTokens, term));
      if (matched) {
        matchedLabels.push(group.label);
      } else {
        missingLabels.push(group.label);
      }
    });

    const matchedCount = matchedLabels.length;
    const hasEnoughWords = wordCount >= requiredWordCount;
    const isCorrect = matchedCount >= requiredGroups && hasEnoughWords;
    const scorePercent = Math.max(0, Math.min(100, Math.round((matchedCount / requiredGroups) * 100)));
    const basePoints = matchedCount;
    const bonusPoints = isCorrect ? 2 : 0;
    const awardedPoints = basePoints + bonusPoints;

    return {
      isCorrect,
      hasContent: true,
      requiredGroups,
      matchedCount,
      scorePercent,
      basePoints,
      bonusPoints,
      awardedPoints,
      matchedLabels,
      missingLabels,
      wordCount,
      requiredWordCount
    };
  };

  const getUsedQuestionTextsForGame = (game, categoryId) => {
    if (!game || !Array.isArray(game.categoryRounds)) return new Set();
    return new Set(
      game.categoryRounds
        .filter((round) => String(round?.categoryId || '') === String(categoryId || ''))
        .flatMap((round) => Array.isArray(round?.questions) ? round.questions : [])
        .map((question) => normalizeQuestionText(question?.q || ''))
        .filter(Boolean)
    );
  };

  const pickBattleQuestions = (questions, count, categoryId, game) => {
    const source = Array.isArray(questions) ? questions.filter(Boolean) : [];
    const limit = Math.min(Math.max(0, Number(count) || 0), source.length);
    if (limit <= 0) return [];

    const usedQuestionTexts = getUsedQuestionTextsForGame(game, categoryId);
    const freshPool = source.filter((question) => !usedQuestionTexts.has(normalizeQuestionText(question?.q || '')));
    const freshSelected = pickLearningQuestions(
      freshPool,
      Math.min(limit, freshPool.length),
      () => categoryId
    );

    const remaining = limit - freshSelected.length;
    if (remaining <= 0) {
      return shuffleArray(freshSelected);
    }

    const selectedTextSet = new Set(freshSelected.map((question) => normalizeQuestionText(question?.q || '')));
    const fallbackPool = source.filter((question) => !selectedTextSet.has(normalizeQuestionText(question?.q || '')));
    const fallbackSelected = pickLearningQuestions(
      fallbackPool,
      Math.min(remaining, fallbackPool.length),
      () => categoryId
    );

    return shuffleArray([...freshSelected, ...fallbackSelected]);
  };

  const resetQuizKeywordState = () => {
    setKeywordAnswerText('');
    setKeywordAnswerEvaluation(null);
  };

  const resetFlashcardKeywordState = () => {
    setFlashcardKeywordInput('');
    setFlashcardKeywordEvaluation(null);
  };

  const isKeywordFlashcard = (card) => isKeywordQuestion(card);

  const getQuizTimeLimit = (question, difficultyKey) => {
    if (isWhoAmIQuestion(question)) {
      const configuredLimit = Number(question?.timeLimit);
      return Number.isFinite(configuredLimit) && configuredLimit > 0 ? configuredLimit : 60;
    }
    return DIFFICULTY_SETTINGS[difficultyKey]?.time || 30;
  };

  const autoExtractKeywordGroups = (answerText) => {
    const GERMAN_STOPWORDS = new Set([
      'aber', 'alle', 'allem', 'allen', 'aller', 'alles', 'also', 'auch', 'auf', 'auss',
      'aus', 'ausserdem', 'bei', 'beim', 'bereits', 'dann', 'dabei', 'dadurch', 'damit',
      'darf', 'dass', 'dem', 'den', 'denen', 'denn', 'der', 'des', 'deshalb', 'dessen',
      'dies', 'diese', 'diesem', 'diesen', 'dieser', 'dieses', 'doch', 'dort', 'durch',
      'eine', 'einem', 'einen', 'einer', 'eines', 'erst', 'etwas', 'falls', 'für',
      'gegen', 'gibt', 'haben', 'hatte', 'hatten', 'hier', 'ihnen', 'ihre', 'ihrem',
      'ihren', 'ihrer', 'ihres', 'immer', 'innen', 'jede', 'jedem', 'jeden', 'jeder',
      'jedes', 'jetzt', 'jedoch', 'kann', 'kein', 'keine', 'keinem', 'keinen', 'keiner',
      'keines', 'muss', 'mussen', 'nach', 'nicht', 'noch', 'obwohl', 'ohne', 'oder',
      'oben', 'sein', 'seine', 'seinem', 'seinen', 'seiner', 'seines', 'sehr', 'sich',
      'sind', 'sodass', 'soll', 'sollen', 'sollte', 'sowie', 'sonst', 'uber', 'mehr',
      'viel', 'viele', 'vielen', 'von', 'vor', 'war', 'waren', 'weil', 'wenn', 'werden',
      'wird', 'wobei', 'wodurch', 'wurde', 'wurden', 'wieder', 'zwischen', 'zwar',
      'euro', 'unten', 'aussen', 'schon'
    ]);
    const normalized = normalizeKeywordText(answerText);
    const words = normalized.split(/\s+/).filter(Boolean);
    const seen = new Set();
    const groups = [];
    for (const word of words) {
      if (word.length < 4) continue;
      if (GERMAN_STOPWORDS.has(word)) continue;
      if (seen.has(word)) continue;
      seen.add(word);
      const variants = getWordVariants(word);
      // Use the shortest variant (stem) as the label so users see the singular form
      const stem = variants[variants.length - 1];
      const label = stem.charAt(0).toUpperCase() + stem.slice(1);
      groups.push({ label, terms: variants });
    }
    return groups;
  };

  const WHO_AM_I_STUDY_FLASHCARDS = buildWhoAmIStudyFlashcards(WHO_AM_I_CHALLENGES);

  const FLASHCARD_CONTENT = {
    org: [
      { front: 'Was ist das Hausrecht?', back: 'Das Recht des Badbetreibers, die Hausordnung durchzusetzen und Personen des Platzes zu verweisen.' },
      { front: 'Wer ist für die Aufsicht verantwortlich?', back: 'Die Aufsichtsperson während der kompletten Öffnungszeiten.' }
    ],
    tech: [
      { front: 'Optimaler pH-Wert im Schwimmbad?', back: '7,0 - 7,4 (neutral bis leicht basisch)' },
      { front: 'Was macht eine Umwälzpumpe?', back: 'Sie pumpt das Wasser durch die Filteranlage zur Reinigung.' },
      { front: 'Chlor-Richtwert im Becken?', back: '0,3 - 0,6 mg/L freies Chlor' }
    ],
    swim: [
      { front: 'Was ist der Rautek-Griff?', back: 'Rettungsgriff zum Bergen bewusstloser Personen aus dem Gefahrenbereich.' },
      { front: 'Wie funktioniert die Mund-zu-Mund-Beatmung?', back: 'Kopf überstrecken, Nase zuhalten, 2-mal beatmen, dann Herzdruckmassage.' }
    ],
    first: [
      { front: 'Verhältnis Herzdruckmassage zu Beatmung?', back: '30:2 - 30 Kompressionen, dann 2 Beatmungen.' },
      { front: 'Wo drückt man bei der Herzdruckmassage?', back: 'Unteres Drittel des Brustbeins, 5-6 cm tief.' }
    ],
    hygiene: [
      { front: 'Warum Duschpflicht vor dem Schwimmen?', back: 'Entfernung von Schmutz, Schweiß und Kosmetik für bessere Wasserqualität.' },
      { front: 'Was sind Legionellen?', back: 'Bakterien im Wasser, gefährlich bei Inhalation, vermehren sich bei 25-45 °C.' }
    ],
    pol: [
      { front: 'Was regelt das Arbeitsrecht?', back: 'Beziehung zwischen Arbeitgeber und Arbeitnehmer, Rechte und Pflichten.' },
      { front: 'Was ist die Berufsgenossenschaft?', back: 'Träger der gesetzlichen Unfallversicherung für Arbeitsunfälle.' }
    ],
    [WHO_AM_I_CATEGORY.id]: WHO_AM_I_STUDY_FLASHCARDS[WHO_AM_I_CATEGORY.id] || [],
    aevo: [
      { front: 'Was ist das Ziel der Berufsausbildung nach BBiG?', back: 'Berufliche Handlungsfähigkeit vermitteln.' },
      { front: 'Woraus besteht die Eignung eines Ausbilders?', back: 'Aus persönlicher und fachlicher Eignung.' },
      { front: 'Wie lange darf die Probezeit in der Ausbildung sein?', back: 'Mindestens 1 Monat, höchstens 4 Monate.' },
      { front: 'Welche Methode hat 4 feste Schritte in der Unterweisung?', back: 'Die Vier-Stufen-Methode: vorbereiten, vormachen, nachmachen, üben.' },
      { front: 'Was bedeutet SMART bei Lernzielen?', back: 'Spezifisch, messbar, attraktiv, realistisch und terminiert.' },
      { front: 'Wofür ist der betriebliche Ausbildungsplan da?', back: 'Er konkretisiert den Ausbildungsrahmenplan für den Betrieb.' },
      { front: 'Was ist bei Feedback an Azubis wichtig?', back: 'Zeitnah, konkret, respektvoll und nachvollziehbar.' },
      { front: 'Was muss der Betrieb für Azubis bereitstellen?', back: 'Alle erforderlichen Ausbildungsmittel und Anleitung.' },
      { front: 'Wann endet die Ausbildung regulär?', back: 'Mit dem Bestehen der Abschlussprüfung.' },
      { front: 'Was gilt bei nicht bestandener Abschlussprüfung?', back: 'Auf Verlangen Verlängerung bis zur nächsten Wiederholungsprüfung.' },
      { front: 'Wofür muss ein Azubi freigestellt werden?', back: 'Für Berufsschule, Prüfungen und angeordnete Ausbildungsmaßnahmen.' },
      { front: 'Warum sind Beurteilungsgespräche wichtig?', back: 'Sie machen Lernfortschritt transparent und helfen beim Nachsteuern.' }
    ]
  };
  const KEYWORD_FLASHCARD_CONTENT = buildKeywordFlashcards(KEYWORD_CHALLENGES);
  const WHO_AM_I_FLASHCARD_CONTENT = buildWhoAmIFlashcards(WHO_AM_I_CHALLENGES);

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
        if (quizActiveRef.current) return;
        loadLightData();
        loadNotifications();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [authReady, user]);

  useEffect(() => {
    if (!user?.id) return;

    const allowedScopes = getRoleKey(user.role) === 'azubi'
      ? ['azubi_room', 'staff_room', 'direct_staff']
      : ['staff_room', 'direct_staff'];

    if (!allowedScopes.includes(chatScope)) {
      setChatScope(allowedScopes[0]);
    }
  }, [user?.id, user?.role, chatScope]);

  useEffect(() => {
    if (!authReady) return;
    if (!user?.id) {
      setPushDeviceState({
        supported: false,
        configured: isWebPushConfigured(),
        permission: typeof window !== 'undefined' && 'Notification' in window
          ? Notification.permission
          : 'default',
        hasSubscription: false,
        endpoint: '',
        checking: false
      });
      return;
    }

    void refreshPushDeviceState();
  }, [authReady, refreshPushDeviceState, user?.id]);

  useEffect(() => {
    if (!authReady) return;
    if (!user?.id) return;
    if (!isWebPushConfigured()) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    void syncPushSubscription(false);
  }, [authReady, user?.id, syncPushSubscription]);

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
    quizActiveRef.current = timerActive && currentView === 'quiz';
  }, [timerActive, currentView]);

  // Automatisch reagieren wenn Gegner fertig gespielt hat (waitingForOpponent)
  useEffect(() => {
    if (!currentGame?.id || !user?.name || !waitingForOpponent) return;

    const updatedGame = allGames.find(g => g.id === currentGame.id) || activeGames.find(g => g.id === currentGame.id);
    if (!updatedGame) return;

    if (isFinishedGameStatus(updatedGame.status)) {
      if (duelResult?.gameId !== updatedGame.id) {
        showDuelResultForGame(updatedGame, allGames);
      }
      return;
    }

    const serverRound = updatedGame.categoryRound || 0;
    const localRound = currentGame.categoryRound || 0;
    const myTurnNow = updatedGame.currentTurn === user.name;

    // Nur reagieren wenn sich der Serverstand tatsächlich geändert hat
    if (!myTurnNow && serverRound <= localRound) return;

    // Spiel-State mit aktuellen Server-Daten synchronisieren
    setCurrentGame(updatedGame);
    setCategoryRound(serverRound);
    setPlayerTurn(updatedGame.currentTurn);
    setWaitingForOpponent(false);
    setAnswered(false);
    setSelectedAnswers([]);
    setLastSelectedAnswer(null);
    setCurrentQuestion(null);
    setQuizCategory(null);
    setCurrentCategoryQuestions([]);
    setTimerActive(false);
    resetQuizKeywordState();

    // Prüfen ob die gerade abgeschlossene Runde (localRound) für uns darstellbar ist:
    // Beide Antwort-Sets vorhanden → Runden-Ergebnis-Screen nachträglich zeigen
    const finishedCatRound = updatedGame.categoryRounds?.[localRound];
    if (finishedCatRound && serverRound > localRound) {
      const isP1 = user.name === updatedGame.player1;
      const myAnswers = isP1 ? finishedCatRound.player1Answers : finishedCatRound.player2Answers;
      const oppAnswers = isP1 ? finishedCatRound.player2Answers : finishedCatRound.player1Answers;
      if (myAnswers.length > 0 && oppAnswers.length > 0) {
        setCategoryRoundResult({
          round: localRound,
          categoryId: finishedCatRound.categoryId,
          categoryName: finishedCatRound.categoryName,
          questions: finishedCatRound.questions,
          myAnswers,
          opponentAnswers: oppAnswers,
          myName: user.name,
          opponentName: isP1 ? updatedGame.player2 : updatedGame.player1,
          player1Score: updatedGame.player1Score,
          player2Score: updatedGame.player2Score,
          player1Name: updatedGame.player1,
          player2Name: updatedGame.player2,
          isLastRound: localRound >= 3,
        });
        return; // proceedAfterCategoryResult übernimmt die restliche State-Transition
      }
    }

    // Prüfen ob ich noch in der aktuellen Runde spielen muss
    // (Gegner hat Kategorie gewählt und gespielt → gleiche Fragen für mich)
    if (myTurnNow && serverRound === localRound) {
      const currentCatRound = updatedGame.categoryRounds?.[serverRound];
      if (currentCatRound) {
        const isP1 = user.name === updatedGame.player1;
        const myAnswers = isP1 ? currentCatRound.player1Answers : currentCatRound.player2Answers;
        const oppAnswers = isP1 ? currentCatRound.player2Answers : currentCatRound.player1Answers;
        if (myAnswers.length === 0 && oppAnswers.length > 0 && currentCatRound.questions.length > 0) {
          setQuizCategory(currentCatRound.categoryId);
          setCurrentCategoryQuestions(currentCatRound.questions);
        }
      }
    }
  }, [activeGames, allGames, duelResult]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Check data retention only once on login (not on every view change)
  useEffect(() => {
    if (!authReady || !user) return;
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

    // Load Berichtsheft when view changes
    if (currentView === 'berichtsheft' && user) {
      loadBerichtsheftEntries();
      void loadBerichtsheftServerDrafts();
      if (canManageBerichtsheftSignatures) {
        loadBerichtsheftPendingSignatures();
      } else {
        setBerichtsheftPendingSignatures([]);
      }

      // Azubi-Profil aus Supabase nachladen falls localStorage leer
      if (user.id && (!azubiProfile.vorname || !azubiProfile.nachname)) {
        (async () => {
          try {
            const profile = await dsLoadBerichtsheftProfile(user.id);
            if (profile) {
              setAzubiProfile(profile);
              localStorage.setItem('azubi_profile', JSON.stringify(profile));
            }
          } catch (err) {
            console.warn('Azubi-Profil nachladen fehlgeschlagen:', err);
          }
        })();
      }
    }

  }, [currentView, user, canManageBerichtsheftSignatures]);

  useEffect(() => {
    if (user) return;
    setBerichtsheftServerDraftsByWeek({});
    setBerichtsheftRemoteDraftsEnabled(true);
    berichtsheftRemoteDraftWarningShownRef.current = false;
  }, [user]);

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
    if (!user || currentView !== 'berichtsheft' || selectedBerichtsheft) return;
    loadBerichtsheftDraftForWeek(berichtsheftWeek);
  }, [currentView, user?.id, user?.name, selectedBerichtsheft, berichtsheftWeek]);

  useEffect(() => {
    if (!user || currentView !== 'berichtsheft' || berichtsheftViewMode !== 'edit' || selectedBerichtsheft) return;

    if (berichtsheftDraftSaveTimerRef.current) {
      clearTimeout(berichtsheftDraftSaveTimerRef.current);
    }
    if (berichtsheftRemoteDraftSaveTimerRef.current) {
      clearTimeout(berichtsheftRemoteDraftSaveTimerRef.current);
    }

    berichtsheftDraftSaveTimerRef.current = setTimeout(() => {
      persistBerichtsheftDraft(berichtsheftWeek);
      berichtsheftDraftSaveTimerRef.current = null;
    }, 280);
    berichtsheftRemoteDraftSaveTimerRef.current = setTimeout(() => {
      void persistBerichtsheftDraftRemote(berichtsheftWeek);
      berichtsheftRemoteDraftSaveTimerRef.current = null;
    }, 1500);

    return () => {
      if (berichtsheftDraftSaveTimerRef.current) {
        clearTimeout(berichtsheftDraftSaveTimerRef.current);
        berichtsheftDraftSaveTimerRef.current = null;
      }
      if (berichtsheftRemoteDraftSaveTimerRef.current) {
        clearTimeout(berichtsheftRemoteDraftSaveTimerRef.current);
        berichtsheftRemoteDraftSaveTimerRef.current = null;
      }
    };
  }, [
    user?.id,
    user?.name,
    currentView,
    berichtsheftViewMode,
    selectedBerichtsheft,
    berichtsheftWeek,
    berichtsheftYear,
    berichtsheftNr,
    currentWeekEntries,
    berichtsheftBemerkungAzubi,
    berichtsheftBemerkungAusbilder,
    berichtsheftSignaturAzubi,
    berichtsheftSignaturAusbilder,
    berichtsheftDatumAzubi,
    berichtsheftDatumAusbilder
  ]);

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

  const exportUserData = async (targetInput, fallbackName = '') => {
    const targetUser = targetInput && typeof targetInput === 'object'
      ? targetInput
      : { email: targetInput, name: fallbackName };
    const targetLabel = String(targetUser?.name || targetUser?.displayName || targetUser?.email || 'nutzer').trim();
    const userName = targetLabel;
    try {
      const exportData = await dsExportUserDataBundle(targetUser);

      // Create download
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${targetLabel}_daten_export_${new Date().toISOString().split('T')[0]}.json`;
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
      const rawNotifs = await dsLoadNotifications(user.name);
      const notifs = rawNotifs.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        userName: user.name,
        time: new Date(n.createdAt || Date.now()).getTime(),
        read: n.read
      }));

      const tracker = notificationTrackerRef.current;
      const knownIds = tracker.knownIds || new Set();
      const freshNotifications = tracker.initialized
        ? notifs.filter((notif) => !knownIds.has(String(notif.id || '')))
        : [];

      tracker.userId = user.id;
      tracker.initialized = true;
      tracker.knownIds = new Set(notifs.map((notif) => String(notif.id || '')));

      setNotifications(notifs);

      for (const notif of [...freshNotifications].reverse()) {
        if (!notif.read) {
          void announceNotificationLocally(notif);
        }
      }
    } catch (error) {
      console.log('Loading notifications...');
    }
  };

  const sendNotification = async () => {
    // NestJS backend handles notifications server-side
    return null;
  };

  const sendNotificationToApprovedUsers = async ({
    title,
    message,
    type = 'info',
    excludeUserNames = []
  }) => {
    try {
      const excluded = new Set(
        (excludeUserNames || [])
          .map(value => String(value || '').trim().toLowerCase())
          .filter(Boolean)
      );

      // Use allUsers state (already loaded) instead of a separate Supabase query
      const targetNames = [...new Set(
        (allUsers || [])
          .map(u => String(u.name || '').trim())
          .filter(Boolean)
      )].filter(name => !excluded.has(name.toLowerCase()));

      for (const name of targetNames) {
        await sendNotification(name, title, message, type);
      }

      return targetNames.length;
    } catch (error) {
      console.error('Broadcast notification error:', error);
      return 0;
    }
  };

  const markNotificationAsRead = async (notifId) => {
    try {
      await dsMarkNotificationRead(notifId);
      setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Mark read error:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await dsClearAllNotifications(user.name);
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

  const hasChatOrganization = Boolean(user?.organizationId);
  const chatUsersInOrganization = hasChatOrganization
    ? allUsers.filter((account) => (
      account?.id
      && account.approved !== false
      && getAccountOrganizationId(account) === user.organizationId
    ))
    : [];
  const directChatCandidates = chatUsersInOrganization.filter((account) => {
    if (!user?.id || account.id === user.id) return false;
    const accountRole = getRoleKey(account.role);
    if (!accountRole) return false;

    if (getRoleKey(user?.role) === 'azubi') {
      return isStaffRole(accountRole);
    }

    if (isStaffRole(user?.role)) {
      return accountRole === 'azubi';
    }

    return false;
  });

  useEffect(() => {
    if (chatScope !== 'direct_staff') {
      if (selectedChatRecipientId) {
        setSelectedChatRecipientId('');
      }
      return;
    }

    if (!directChatCandidates.some((account) => account.id === selectedChatRecipientId)) {
      setSelectedChatRecipientId(directChatCandidates[0]?.id || '');
    }
  }, [chatScope, selectedChatRecipientId, directChatCandidates]);

  // Load direct messages on-demand when switching to direct_staff scope
  useEffect(() => {
    if (chatScope !== 'direct_staff' || !selectedChatRecipientId) return;
    const loadDirectMessages = async () => {
      try {
        const mapped = await dsLoadDirectMessages({
          recipientId: selectedChatRecipientId,
          currentUserId: user?.id
        });
        setMessages(prev => {
          // Remove old direct_staff messages for this recipient, add new ones
          const withoutOldDirect = prev.filter(msg =>
            msg.scope !== 'direct_staff' ||
            !(
              (msg.senderId === user?.id && msg.recipientId === selectedChatRecipientId) ||
              (msg.senderId === selectedChatRecipientId && msg.recipientId === user?.id)
            )
          );
          return [...withoutOldDirect, ...mapped];
        });
      } catch (error) {
        console.warn('Direct messages load error:', error.message);
      }
    };
    loadDirectMessages();
  }, [chatScope, selectedChatRecipientId]);

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

  const normalizeChatMessageRow = (row, userDirectory = {}) => {
    const senderProfile = row?.sender_id ? userDirectory[row.sender_id] : null;
    const senderRole = getRoleKey(row?.user_role || senderProfile?.role || 'azubi') || 'azubi';
    const fallbackScope = senderRole === 'azubi' ? 'azubi_room' : 'staff_room';

    return {
      id: row?.id || `${row?.created_at || Date.now()}-${row?.user_name || 'chat'}`,
      user: String(row?.user_name || senderProfile?.name || 'Unbekannt'),
      text: String(row?.content || ''),
      time: new Date(row?.created_at || Date.now()).getTime(),
      avatar: row?.user_avatar || senderProfile?.avatar || null,
      senderId: row?.sender_id || senderProfile?.id || null,
      senderRole,
      scope: getChatScopeKey(row?.chat_scope, fallbackScope),
      organizationId: row?.organization_id || getAccountOrganizationId(senderProfile) || null,
      recipientId: row?.recipient_id || null
    };
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
        setAllGames(normalized);
        setActiveGames(normalized.filter(g => g.status !== 'finished'));
        updateLeaderboard(normalized, allUsers);
        if (user?.name) {
          setUserStats(prevStats => syncQuizTotalsIntoStats(prevStats, normalized, user.name));
        }
      }

      // Messages aktualisieren
      const userDirectory = Object.fromEntries(
        (allUsers || []).filter(a => a?.id).map(a => [a.id, a])
      );
      const msgs = await dsLoadMessages(normalizeChatMessageRow, userDirectory, user?.role);
      setMessages(msgs);
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
        setAllGames(games);
        setActiveGames(games.filter(g => g.status !== 'finished'));
        updateLeaderboard(games, allUsers);
        await checkExpiredAndRemindGames(games);
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
            if (!isFinishedGameStatus(g.status)) return false;
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
            await saveUserStatsToSupabase(user, stats);
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
      const msgs = await dsLoadMessages(normalizeChatMessageRow, userDirectory, user?.role);
      setMessages(msgs);

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
            questionKey: r.questionKey || getQuestionPerformanceKey({ q: r.questionText, category: r.category }, r.category)
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

      // Load flashcards
      const flashcardsResult = await dsLoadFlashcards();
      setUserFlashcards(flashcardsResult.approved);
      setPendingFlashcards(flashcardsResult.pending);

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
      const result = await dsApproveUser(email, [...(allUsers || []), ...(pendingUsers || [])]);
      loadData();
      playSound('whistle');
      showToast(`${result.account?.name || email} wurde freigeschaltet!`, 'success');
    } catch (error) {
      console.error('Error approving user:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const deleteUser = async (email) => {
    try {
      const targetUser = allUsers.find(
        u => String(u.email || '').trim().toLowerCase() === String(email || '').trim().toLowerCase()
      );
      if (!targetUser) {
        showToast('User nicht gefunden', 'error');
        return;
      }
      if (targetUser.role === 'admin') {
        showToast('Administratoren können nicht gelöscht werden!', 'error');
        return;
      }
      if (!confirm('Möchtest du diesen Nutzer wirklich löschen? Alle Daten werden unwiderruflich gelöscht!')) {
        return;
      }

      await dsDeleteUser(email, allUsers);
      loadData();
      showToast('Nutzerprofil und Daten wurden gelöscht', 'success');
    } catch (error) {
      console.error('Delete user error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const changeUserRole = async (email, newRole) => {
    try {
      if (!user?.permissions?.canManageUsers) {
        showToast('Keine Berechtigung für Rollenänderungen.', 'error');
        return;
      }
      const hasOwnerAccount = allUsers.some((account) => Boolean(account?.is_owner));
      const canManageSecurity = Boolean(user?.isOwner) || (user?.role === 'admin' && !hasOwnerAccount);
      if (!canManageSecurity) {
        showToast('Nur der Hauptadmin darf Rollen ändern.', 'error');
        return;
      }

      const targetEmail = String(email || '').trim().toLowerCase();
      const ownEmail = String(user?.email || '').trim().toLowerCase();
      const allowedRoles = ['azubi', 'trainer', 'admin'];
      if (!allowedRoles.includes(newRole)) {
        showToast('Ungültige Rolle ausgewählt', 'error');
        return;
      }

      // Protect against locking yourself out of the admin area.
      if (targetEmail && targetEmail === ownEmail && newRole !== 'admin') {
        showToast('Deine eigene Admin-Rolle kann nicht geändert werden.', 'error');
        return;
      }

      const targetUser = allUsers.find(
        (account) => String(account?.email || '').trim().toLowerCase() === targetEmail
      );
      if (targetUser?.role === 'admin' && newRole !== 'admin') {
        const adminCount = allUsers.filter((account) => account.role === 'admin').length;
        if (adminCount <= 1) {
          showToast('Mindestens ein Administrator muss erhalten bleiben.', 'error');
          return;
        }
      }

      await dsChangeUserRole(targetEmail, newRole, allUsers);

      loadData();
      showToast(`Rolle geändert zu: ${PERMISSIONS[newRole].label}`, 'success');
    } catch (error) {
      console.error('Error changing role:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const togglePermission = async (userId, field, currentValue, labels) => {
    try {
      await dsUpdateUserPermission(userId, field, !currentValue);
      loadData();
      showToast(!currentValue ? labels.granted : labels.revoked, 'success');
    } catch (error) {
      console.error(`Error toggling ${field}:`, error);
      showToast(friendlyError(error), 'error');
    }
  };

  const toggleSchoolCardPermission = (userId, currentValue) =>
    togglePermission(userId, 'canViewSchoolCards', currentValue, {
      granted: 'Kontrollkarten-Berechtigung erteilt',
      revoked: 'Kontrollkarten-Berechtigung entzogen'
    });

  const toggleSignReportsPermission = (userId, currentValue) =>
    togglePermission(userId, 'canSignReports', currentValue, {
      granted: 'Berichtsheft-Unterschrift-Berechtigung erteilt',
      revoked: 'Berichtsheft-Unterschrift-Berechtigung entzogen'
    });

  const toggleExamGradesPermission = (userId, currentValue) =>
    togglePermission(userId, 'canViewExamGrades', currentValue, {
      granted: 'Klasuren-Berechtigung erteilt',
      revoked: 'Klasuren-Berechtigung entzogen'
    });

  const repairQuizStats = async () => {
    if (!user?.permissions?.canManageUsers) {
      throw new Error('Keine Berechtigung für den Statistik-Repair.');
    }

    const responseData = await dsRepairQuizStats(fetchPushBackendWithAuth);
    await loadData();
    return responseData;
  };

  const sendTestPush = async (targetScope = 'self') => {
    if (!user?.id) {
      throw new Error('Keine aktive Sitzung für den Test-Push gefunden.');
    }

    const requestedTargetUserNames = targetScope === 'organization'
      ? [...new Set(
          (allUsers || [])
            .filter((account) => account?.approved !== false)
            .filter((account) => (account?.organization_id || account?.organizationId || null) === (user.organizationId || null))
            .map((account) => String(account?.name || '').trim())
            .filter(Boolean)
        )]
      : [String(user.name || '').trim()].filter(Boolean);

    const payload = {
      delaySeconds: 15, targetScope,
      userName: user.name || '', email: user.email || '',
      organizationId: user.organizationId || null,
      targetUserNames: requestedTargetUserNames
    };

    return dsSendTestPush(fetchPushBackendWithAuth, payload);
  };

  // Profil-Bearbeitung: Name ändern

  const getDaysUntilDeletion = (account) => {
    // Admins are NEVER deleted
    if (account.role === 'admin') {
      return null;
    }
    
    const now = Date.now();
    
    if (account.role === 'azubi' && account.trainingEnd) {
      const endDate = new Date(account.trainingEnd).getTime();
      if (isNaN(endDate)) return null;
      const threeMonthsMs = 3 * 30 * 24 * 60 * 60 * 1000;
      const daysLeft = Math.ceil((endDate + threeMonthsMs - now) / (1000 * 60 * 60 * 24));
      return daysLeft;
    }

    if (account.role === 'trainer' && (account.lastLogin || account.last_login)) {
      const sixMonthsMs = 6 * 30 * 24 * 60 * 60 * 1000;
      const lastLoginTime = new Date(account.lastLogin || account.last_login).getTime();
      if (isNaN(lastLoginTime)) return null;
      const deleteDate = lastLoginTime + sixMonthsMs;
      const daysLeft = Math.ceil((deleteDate - now) / (1000 * 60 * 60 * 24));
      return daysLeft;
    }
    
    return null;
  };

  // Quiz functions with Supabase
  const challengePlayer = async (opponent, timeoutMinutesInput = DEFAULT_CHALLENGE_TIMEOUT_MINUTES, opponentId = null) => {
    const now = Date.now();
    const timeoutMinutes = normalizeChallengeTimeoutMinutes(timeoutMinutesInput);
    const challengeExpiresAt = new Date(now + timeoutMinutes * 60 * 1000).toISOString();

    // Prüfe ob bereits ein laufendes Spiel gegen diesen Gegner existiert
    const existingGame = activeGames.find(g =>
      g.status !== 'finished' &&
      !isWaitingChallengeExpired(g, now) &&
      ((g.player1 === user.name && g.player2 === opponent) ||
       (g.player1 === opponent && g.player2 === user.name))
    );

    if (existingGame) {
      showToast(`Du hast bereits ein laufendes Spiel gegen ${opponent}!`, 'error');
      return;
    }

    try {
      const game = await dsCreateDuel({
        player1: user.name,
        player2: opponent,
        difficulty: selectedDifficulty,
        challengeTimeoutMinutes: timeoutMinutes,
        challengeExpiresAt,
        opponentId
      }, user?.id);

      if (game?.timerColumnsUnavailable) {
        showToast('Herausforderung gesendet. Zeitlimit: 48 Stunden.', 'info');
      }

      setActiveGames([...activeGames, game]);
      setSelectedOpponent(null);

      await sendNotification(
        opponent,
        '🎮 Neue Quizduell-Herausforderung',
        `${user.name} hat dich herausgefordert. Annahmefrist: ${formatDurationMinutesCompact(game.challengeTimeoutMinutes || timeoutMinutes)}.`,
        'info'
      );

      showToast(`Herausforderung an ${opponent} gesendet! Frist: ${formatDurationMinutesCompact(game.challengeTimeoutMinutes || timeoutMinutes)}.`, 'success');
    } catch (error) {
      console.error('Challenge error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const acceptChallenge = async (gameId) => {
    const game = activeGames.find(g => g.id === gameId);
    if (!game) return;

    if (isWaitingChallengeExpired(game)) {
      const loser = game.player2;
      const winner = game.player1;
      await autoForfeitGame(game, loser, winner, 'challenge_expired');
      showToast('Diese Herausforderung ist bereits abgelaufen.', 'warning');
      return;
    }

    try {
      const acceptedAt = new Date().toISOString();
      await dsAcceptDuel(gameId, user?.id);

      game.status = 'active';
      game.categoryRound = 0;
      game.categoryRounds = [];
      game.updatedAt = acceptedAt;
      // Challenger (player1) picks first category
      game.currentTurn = game.player1;
      setActiveGames(prev => prev.map((entry) => (
        entry.id === gameId
          ? {
              ...entry,
              status: 'active',
              categoryRound: 0,
              categoryRounds: [],
              currentTurn: game.player1,
              updatedAt: acceptedAt
            }
          : entry
      )));
      setAllGames(prev => prev.map((entry) => (
        entry.id === gameId
          ? {
              ...entry,
              status: 'active',
              categoryRound: 0,
              categoryRounds: [],
              currentTurn: game.player1,
              updatedAt: acceptedAt
            }
          : entry
      )));

      if (game.player1 && game.player1 !== user.name) {
        await sendNotification(
          game.player1,
          '⚡ Herausforderung angenommen - du bist dran!',
          `${user.name} hat deine Quizduell-Herausforderung angenommen. Du darfst die erste Kategorie wählen.`,
          'info'
        );
      }

      setDuelResult(null);
      setCurrentGame(game);
      setCategoryRound(0);
      setQuestionInCategory(0);
      setPlayerTurn(game.currentTurn);
      setQuizCategory(null);
      setCurrentQuestion(null);
      setCurrentCategoryQuestions([]);
      resetAnswerSubmissionLock();
      setAnswered(false);
      setSelectedAnswers([]);
      setLastSelectedAnswer(null);
      setTimerActive(false);
      localStorage.removeItem(`quiz_waiting_reminder_${game.id}_${game.player2}`);
      resetQuizKeywordState();

      // Save initial game state to backend so the other player can see it
      await saveGameToSupabase(game);

      setCurrentView('quiz');
    } catch (error) {
      console.error('Accept error:', error);
    }
  };

  const continueGame = async (gameId) => {
    const game = activeGames.find(g => g.id === gameId);
    if (!game) return;

    setDuelResult(null);
    setCurrentGame(game);
    setCategoryRound(game.categoryRound || 0);
    setQuestionInCategory(0);
    setPlayerTurn(game.currentTurn);
    setCurrentQuestion(null);
    resetAnswerSubmissionLock();
    setAnswered(false);
    setSelectedAnswers([]);
    setLastSelectedAnswer(null);
    setTimerActive(false);
    resetQuizKeywordState();

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

  const continueGameSafe = async (gameId) => {
    const activeGame = activeGames.find(g => g.id === gameId);
    if (!activeGame) return;

    let game = cloneDuelGameSnapshot(activeGame);
    try {
      const latestGame = await dsGetDuelWithQuestions(gameId, user?.id);
      if (latestGame?.id === gameId) {
        game = latestGame;
      }
    } catch (error) {
      console.warn('Aktuellen Duel-Stand konnte nicht nachgeladen werden:', error);
    }

    const syncedGame = syncLocalDuelGame(game);
    const gameToContinue = syncedGame?.id ? syncedGame : game;

    setDuelResult(null);
    setCurrentGame(gameToContinue);
    setCategoryRound(gameToContinue.categoryRound || 0);
    setQuestionInCategory(0);
    setPlayerTurn(gameToContinue.currentTurn);
    setQuizCategory(null);
    setCurrentQuestion(null);
    setCurrentCategoryQuestions([]);
    resetAnswerSubmissionLock();
    setAnswered(false);
    setSelectedAnswers([]);
    setLastSelectedAnswer(null);
    setTimerActive(false);
    setWaitingForOpponent(false);
    resetQuizKeywordState();

    if (gameToContinue.categoryRounds && gameToContinue.categoryRounds.length > 0) {
      const currentCatRound = gameToContinue.categoryRounds[gameToContinue.categoryRound || 0];
      if (currentCatRound) {
        const isPlayer1 = user.name === gameToContinue.player1;
        const myAnswers = isPlayer1 ? currentCatRound.player1Answers : currentCatRound.player2Answers;
        const nextQuestionIndex = Math.max(0, myAnswers.length || 0);
        const hasPendingQuestions = currentCatRound.questions.length > 0
          && nextQuestionIndex < currentCatRound.questions.length;

        if (hasPendingQuestions) {
          setQuizCategory(currentCatRound.categoryId);
          setCurrentCategoryQuestions(currentCatRound.questions);

          if (nextQuestionIndex > 0) {
            setQuestionInCategory(nextQuestionIndex);
            setCurrentQuestion(currentCatRound.questions[nextQuestionIndex]);
            const timeLimit = getQuizTimeLimit(currentCatRound.questions[nextQuestionIndex], gameToContinue.difficulty);
            setTimeLeft(timeLimit);
            setTimerActive(true);
          }
        }
      }
    }

    setCurrentView('quiz');
  };

  // Helper function to save game state
  const saveGameToSupabase = async (game) => {
    const syncedGame = syncLocalDuelGame(game);
    try {
      await dsSaveDuelState(syncedGame);
      const persistedGame = await dsGetDuelWithQuestions(syncedGame.id, user?.id);
      return persistedGame?.id ? syncLocalDuelGame(persistedGame) : syncedGame;
    } catch (error) {
      console.error('Save game error:', error);
      return syncedGame;
    }
  };

  const resolveUserStatsIdentity = async (userInput) => {
    if (userInput && typeof userInput === 'object') {
      const userId = String(userInput.id || '').trim();
      const userName = String(userInput.name || '').trim();
      if (userId) {
        return { userId, userName };
      }
      if (userName) {
        return resolveUserStatsIdentity(userName);
      }
      return null;
    }

    const userName = String(userInput || '').trim();
    if (!userName) return null;

    const identity = await dsResolveUserIdentity(userName);
    if (identity) {
      return identity;
    }

    const match = allUsers.find(u => String(u.name || '').toLowerCase() === userName.toLowerCase());
    return match ? { userId: match.id, userName: match.name } : null;
  };

  // Helper function to save user stats
  const saveUserStatsToSupabase = async () => {
    // NestJS backend manages stats server-side
    return true;
  };

  // Helper function to get user stats
  const getUserStatsFromSupabase = async (userInput) => {
    try {
      const identity = await resolveUserStatsIdentity(userInput);
      if (!identity?.userId) return null;
      const data = await dsGetUserStats({
        id: identity.userId,
        name: identity.userName
      });
      if (!data) return null;
      return buildUserStatsFromRow(data);
    } catch (error) {
      console.error('Get stats error:', error);
      return null;
    }
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
        const currentStats = await getUserStatsFromSupabase({ id: targetUserId, name: targetUserName });
        const baseStats = ensureUserStatsStructure(currentStats || createEmptyUserStats());
        const { stats: xpUpdatedStats, addedXp } = addXpToStats(baseStats, sourceKey, xpAmount, eventKey);
        if (addedXp <= 0) {
          return 0;
        }

        await saveUserStatsToSupabase({ id: targetUserId, name: targetUserName }, xpUpdatedStats);
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

  // Fisher-Yates Shuffle für zufällige Fragenreihenfolge
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getQuestionPerformanceKey = (question, categoryHint = null) => {
    const categoryId = String(categoryHint || question?.category || 'unknown').trim() || 'unknown';
    const normalizedText = normalizeQuestionText(question?.q || '');
    return `${categoryId}::${normalizedText}`;
  };

  const getQuestionPerformanceEntry = (question, categoryHint = null) => {
    const key = getQuestionPerformanceKey(question, categoryHint);
    const raw = (questionPerformance && typeof questionPerformance === 'object') ? questionPerformance[key] : null;
    return {
      key,
      stats: {
        attempts: sanitizeGoalValue(raw?.attempts, 0),
        correct: sanitizeGoalValue(raw?.correct, 0),
        wrong: sanitizeGoalValue(raw?.wrong, 0),
        wrongStreak: sanitizeGoalValue(raw?.wrongStreak, 0),
        lastSeen: Number(raw?.lastSeen) || 0
      }
    };
  };

  const getAdaptiveQuestionWeight = (question, categoryHint = null) => {
    const { stats } = getQuestionPerformanceEntry(question, categoryHint);
    const attempts = stats.attempts;
    const wrongRate = attempts > 0 ? stats.wrong / attempts : 0.45;
    const unseenBonus = attempts === 0 ? 1.5 : 0;
    const staleDays = stats.lastSeen > 0
      ? Math.max(0, (Date.now() - stats.lastSeen) / (1000 * 60 * 60 * 24))
      : 7;
    const staleBonus = Math.min(1.5, staleDays / 10);
    const weight = 1 + (wrongRate * 3) + (stats.wrongStreak * 1.2) + unseenBonus + staleBonus;
    return Math.max(0.2, weight);
  };

  const pickLearningQuestions = (questions, count, resolveCategoryId = () => null) => {
    const source = Array.isArray(questions) ? questions.filter(Boolean) : [];
    const limit = Math.min(Math.max(0, Number(count) || 0), source.length);
    if (limit <= 0) return [];

    if (!adaptiveLearningEnabled) {
      return shuffleArray(source).slice(0, limit);
    }

    const pool = [...source];
    const selected = [];

    while (selected.length < limit && pool.length > 0) {
      const weights = pool.map((question) => getAdaptiveQuestionWeight(question, resolveCategoryId(question)));
      const totalWeight = weights.reduce((sum, value) => sum + value, 0);

      let pickedIndex = 0;
      if (totalWeight > 0) {
        let random = Math.random() * totalWeight;
        for (let idx = 0; idx < weights.length; idx++) {
          random -= weights[idx];
          if (random <= 0) {
            pickedIndex = idx;
            break;
          }
        }
      } else {
        pickedIndex = Math.floor(Math.random() * pool.length);
      }

      selected.push(pool[pickedIndex]);
      pool.splice(pickedIndex, 1);
    }

    return shuffleArray(selected);
  };

  const trackQuestionPerformance = (question, categoryHint, isCorrect) => {
    if (!question) return;
    const key = getQuestionPerformanceKey(question, categoryHint);
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

  const reportQuestionIssue = async ({ question, categoryId, source }) => {
    if (!question || !user?.name) return;
    const noteInput = window.prompt('Was ist unklar oder fehlerhaft? (optional)', '');
    if (noteInput === null) return;

    const note = String(noteInput || '').trim();
    const key = getQuestionPerformanceKey(question, categoryId);
    const category = String(categoryId || question?.category || 'unknown');
    const payload = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      questionKey: key,
      questionText: String(question.q || ''),
      category,
      source: String(source || 'unknown'),
      note,
      answers: Array.isArray(question.a) ? [...question.a] : [],
      reportedBy: user.name,
      reportedById: user.id || null,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    let savedRemotely = false;
    try {
      await dsReportQuestion({
        questionKey: payload.questionKey, questionText: payload.questionText,
        category: payload.category, source: payload.source,
        note: payload.note || null, answers: payload.answers,
        reportedBy: payload.reportedBy, reportedById: payload.reportedById,
        status: payload.status,
        // Supabase-format fields for fallback
        question_key: payload.questionKey, question_text: payload.questionText,
        reported_by: payload.reportedBy, reported_by_id: payload.reportedById
      });
      savedRemotely = true;
    } catch (error) {
      console.log('question_reports table unavailable, fallback local only');
    }

    setQuestionReports((prev) => [payload, ...prev].slice(0, 500));
    showToast(
      savedRemotely
        ? 'Frage gemeldet. Danke für dein Feedback!'
        : 'Frage lokal gemeldet. Danke für dein Feedback!',
      'success'
    );
  };

  const toggleQuestionReportStatus = async (reportId) => {
    const existing = questionReports.find((entry) => entry.id === reportId);
    if (!existing) return;
    const nextStatus = existing.status === 'resolved' ? 'open' : 'resolved';

    setQuestionReports((prev) => prev.map((entry) => (
      entry.id === reportId
        ? { ...entry, status: nextStatus, resolvedAt: nextStatus === 'resolved' ? new Date().toISOString() : null }
        : entry
    )));
    if (!String(reportId).startsWith('local-')) {
      try {
        await dsUpdateQuestionReportStatus(reportId, nextStatus);
      } catch {
        // local state remains source of truth when remote update fails
      }
    }
    showToast(nextStatus === 'resolved' ? 'Meldung als erledigt markiert.' : 'Meldung wieder geoeffnet.', 'info', 1800);
  };

  // Spieler wählt Kategorie → 5 zufällige Fragen werden für BEIDE Spieler gespeichert
  const selectCategory = async (catId) => {
    if (!currentGame || currentGame.currentTurn !== user.name) return;

    setQuizCategory(catId);
    resetQuizKeywordState();

    const useKeywordQuestions = selectedDifficulty === 'extra' || currentGame.difficulty === 'extra';
    const categoryKeywordQuestions = KEYWORD_CHALLENGES[catId] || [];
    const categoryStandardQuestions = SAMPLE_QUESTIONS[catId] || [];
    const allQuestions = useKeywordQuestions && categoryKeywordQuestions.length > 0
      ? categoryKeywordQuestions
      : categoryStandardQuestions;
    if (useKeywordQuestions && categoryKeywordQuestions.length === 0 && catId !== WHO_AM_I_CATEGORY.id) {
      showToast('Für diese Kategorie sind noch keine Extra-schwer-Fragen hinterlegt. Standardfragen werden genutzt.', 'info');
    }
    const selectedQuestions = pickBattleQuestions(allQuestions, Math.min(5, allQuestions.length), catId, currentGame);

    // Mische Antworten nur bei Auswahlfragen
    const preparedQuestions = selectedQuestions.map((question) => {
      if (isKeywordQuestion(question) || isWhoAmIQuestion(question)) {
        return { ...question, category: catId };
      }
      return { ...shuffleAnswers(question), category: catId };
    });

    // Speichere die Fragen im Game für beide Spieler
    if (!currentGame.categoryRounds) currentGame.categoryRounds = [];
    const roundIndex = currentGame.categoryRound;
    currentGame.categoryRounds.push({
      categoryId: catId,
      categoryName: CATEGORIES.find(c => c.id === catId)?.name || catId,
      questions: preparedQuestions,
      player1Answers: [], // Antworten von Spieler 1
      player2Answers: [], // Antworten von Spieler 2
      chooser: user.name  // Wer hat die Kategorie gewählt
    });

    setCurrentCategoryQuestions([]);
    setQuestionInCategory(0);
    setCurrentQuestion(null);
    resetAnswerSubmissionLock();
    setAnswered(false);
    setSelectedAnswers([]); // Reset für Multi-Select
    setLastSelectedAnswer(null); // Reset für Single-Choice

    setTimerActive(false);

    const persistedGame = await saveGameToSupabase(currentGame);
    const persistedRound = persistedGame?.categoryRounds?.[roundIndex];
    const liveQuestions = Array.isArray(persistedRound?.questions) && persistedRound.questions.length > 0
      ? persistedRound.questions
      : preparedQuestions;

    setCurrentCategoryQuestions(liveQuestions);
    if (liveQuestions[0]) {
      setCurrentQuestion(liveQuestions[0]);
      const timeLimit = getQuizTimeLimit(liveQuestions[0], persistedGame?.difficulty || currentGame.difficulty);
      setTimeLeft(timeLimit);
      setTimerActive(true);
    }
  };

  const handleTimeUp = async () => {
    if (answered || answerSubmissionLockRef.current || !currentGame) return;
    answerSubmissionLockRef.current = true;
    setAnswered(true);
    setTimerActive(false);

    if ((isKeywordQuestion(currentQuestion) || isWhoAmIQuestion(currentQuestion)) && keywordAnswerText.trim()) {
      const timedOutEvaluation = evaluateKeywordAnswer(currentQuestion, keywordAnswerText);
      setKeywordAnswerEvaluation({
        ...timedOutEvaluation,
        isCorrect: false,
        timedOut: true
      });
    }

    // Speichere falsche Antwort (Timeout)
    // Note: For server duels, timeouts are NOT submitted to the API.
    // The question remains unanswered and can be retried.
    await savePlayerAnswer(false, true, {
      answerType: isWhoAmIQuestion(currentQuestion)
        ? 'whoami'
        : (isKeywordQuestion(currentQuestion) ? 'keyword' : 'choice'),
      keywordText: (isKeywordQuestion(currentQuestion) || isWhoAmIQuestion(currentQuestion))
        ? keywordAnswerText.trim()
        : null
    });
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
    if (answered || answerSubmissionLockRef.current || !currentGame || !currentQuestion.multi) return;
    answerSubmissionLockRef.current = true;
    setAnswered(true);
    setTimerActive(false);

    // Prüfe ob alle richtigen Antworten ausgewählt wurden (und keine falschen).
    // Wenn correct serverseitig redaktiert wurde (undefined), senden wir false —
    // der Server berechnet das korrekte Ergebnis selbst.
    const correctAnswers = currentQuestion.correct;
    const isCorrect = correctAnswers !== undefined
      ? (selectedAnswers.length === correctAnswers.length &&
         selectedAnswers.every(idx => correctAnswers.includes(idx)))
      : false;

    await savePlayerAnswer(isCorrect, false, {
      answerType: 'multi',
      selectedAnswers: [...selectedAnswers]
    });
  };

  const answerQuestion = async (answerIndex) => {
    if (answered || answerSubmissionLockRef.current || !currentGame) return;
    if (isKeywordQuestion(currentQuestion) || isWhoAmIQuestion(currentQuestion)) return;

    // Multi-Select: Nur togglen, nicht direkt antworten
    if (currentQuestion.multi) {
      toggleAnswer(answerIndex);
      return;
    }

    // Single-Choice: Direkt antworten
    answerSubmissionLockRef.current = true;
    setAnswered(true);
    setTimerActive(false);
    setLastSelectedAnswer(answerIndex); // Speichere gewählte Antwort für Feedback

    // Wenn correct serverseitig redaktiert wurde (undefined), senden wir false —
    // der Server berechnet das korrekte Ergebnis selbst.
    const isCorrect = currentQuestion.correct !== undefined
      ? answerIndex === currentQuestion.correct
      : false;
    await savePlayerAnswer(isCorrect, false, {
      answerType: 'single',
      selectedAnswer: answerIndex
    });
  };

  const submitKeywordAnswer = async () => {
    if (answered || answerSubmissionLockRef.current || !currentGame || !currentQuestion) return;
    if (!isKeywordQuestion(currentQuestion) && !isWhoAmIQuestion(currentQuestion) && !quizMCKeywordMode) return;
    const trimmedAnswer = keywordAnswerText.trim();
    if (!trimmedAnswer) {
      showToast('Bitte gib zuerst eine Freitext-Antwort ein.', 'error', 1800);
      return;
    }
    let evaluation;
    if (isKeywordQuestion(currentQuestion) || isWhoAmIQuestion(currentQuestion)) {
      evaluation = evaluateKeywordAnswer(currentQuestion, keywordAnswerText);
    } else {
      const correctText = currentQuestion.multi && Array.isArray(currentQuestion.correct)
        ? currentQuestion.correct.map(idx => String(currentQuestion.a?.[idx] || '')).join('. ')
        : String(currentQuestion.a?.[currentQuestion.correct] || '');
      const groups = autoExtractKeywordGroups(correctText);
      const fakeQ = { keywordGroups: groups, minKeywordGroups: Math.max(1, Math.ceil(groups.length * 0.5)) };
      evaluation = evaluateKeywordAnswer(fakeQ, keywordAnswerText);
    }
    setKeywordAnswerEvaluation(evaluation);
    answerSubmissionLockRef.current = true;
    setAnswered(true);
    setTimerActive(false);
    const answerType = isWhoAmIQuestion(currentQuestion)
      ? 'whoami'
      : 'keyword';
    await savePlayerAnswer(evaluation.isCorrect, false, {
      answerType,
      keywordText: trimmedAnswer,
      keywordEvaluation: {
        requiredGroups: evaluation.requiredGroups,
        matchedCount: evaluation.matchedCount,
        matchedLabels: evaluation.matchedLabels,
        missingLabels: evaluation.missingLabels,
        scorePercent: evaluation.scorePercent,
        basePoints: evaluation.basePoints,
        bonusPoints: evaluation.bonusPoints,
        awardedPoints: evaluation.awardedPoints
      }
    });
  };

  // Speichert die Antwort des aktuellen Spielers
  const savePlayerAnswer = async (isCorrect, isTimeout, answerMeta = {}) => {
    const isPlayer1 = user.name === currentGame.player1;
    const currentRoundIndex = currentGame.categoryRound;
    const currentQuestionIndex = questionInCategory;
    const currentCategoryRound = currentGame.categoryRounds[currentGame.categoryRound];
    const answerType = String(answerMeta?.answerType || '');
    const correctnessKnown = answerType === 'keyword'
      || answerType === 'whoami'
      || currentQuestion?.correct !== undefined;

    // Daily Challenge Progress
    updateChallengeProgress('answer_questions', 1);
    if (correctnessKnown && isCorrect) {
      updateChallengeProgress('correct_answers', 1);
    }
    if (quizCategory) {
      updateChallengeProgress('category_master', 1, quizCategory);
    }
    updateChallengeProgress('quiz_play', 1);
    updateWeeklyProgress('quizAnswers', 1);
    if (correctnessKnown) {
      trackQuestionPerformance(currentQuestion, quizCategory, isCorrect);
    }

    const answerPoints = answerType === 'keyword'
      ? Math.max(0, Number(answerMeta?.keywordEvaluation?.awardedPoints) || 0)
      : answerType === 'whoami'
        ? (isCorrect ? 1 : 0)
      : (isCorrect ? 1 : 0);

    if (answerPoints > 0) {
      if (isPlayer1) {
        currentGame.player1Score += answerPoints;
      } else {
        currentGame.player2Score += answerPoints;
      }
    }

    // Antwort speichern
    const answer = {
      questionIndex: questionInCategory,
      correct: correctnessKnown ? isCorrect : null,
      timeout: isTimeout,
      points: correctnessKnown ? answerPoints : 0,
      ...answerMeta
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

    if (correctnessKnown) {
      if (isCorrect) {
        stats.categoryStats[quizCategory].correct++;
      } else {
        stats.categoryStats[quizCategory].incorrect++;
      }
    }
    stats.categoryStats[quizCategory].total++;

    await saveUserStatsToSupabase(user, stats);
    setUserStats(stats);

    // Duel: Antwort an Backend übermitteln (enthüllt correctOptionIndex für nächsten API-Aufruf)
    const shouldUseAuthoritativeDuelAnswer =
      currentQuestion?.duelQuestionId
      && currentGame?.id
      && !isTimeout
      && answerMeta?.answerType === 'single'
      && Number.isInteger(answerMeta?.selectedAnswer);

    if (shouldUseAuthoritativeDuelAnswer) {
      try {
        await dsSubmitDuelAnswer(currentGame.id, currentQuestion.duelQuestionId, answerMeta.selectedAnswer);
      } catch (error) {
        if (error?.status === 409) {
          // Duplicate — already recorded, ignore
        } else {
          console.warn('submitDuelAnswer fehlgeschlagen, retry in 1.5s:', error);
          // Retry once after a short delay (covers transient 401 refresh + network blips)
          await new Promise((resolve) => setTimeout(resolve, 1500));
          try {
            await dsSubmitDuelAnswer(currentGame.id, currentQuestion.duelQuestionId, answerMeta.selectedAnswer);
          } catch (retryError) {
            if (retryError?.status !== 409) {
              console.warn('submitDuelAnswer retry fehlgeschlagen:', retryError);
            }
          }
        }
      }

      try {
        const refreshedGame = await dsGetDuelWithQuestions(currentGame.id, user?.id);
        const authoritativeGame = refreshedGame?.id ? syncLocalDuelGame(refreshedGame) : null;
        const authoritativeRound = authoritativeGame?.categoryRounds?.[currentRoundIndex];
        const authoritativeQuestions = Array.isArray(authoritativeRound?.questions)
          ? authoritativeRound.questions
          : null;

        if (authoritativeQuestions?.length) {
          setCurrentCategoryQuestions(authoritativeQuestions);
          if (authoritativeQuestions[currentQuestionIndex]) {
            setCurrentQuestion(authoritativeQuestions[currentQuestionIndex]);
          }
        }

        return;
      } catch (error) {
        console.warn('Duel-Refresh nach Antwort fehlgeschlagen:', error);
      }
    }

    const persistedGame = await saveGameToSupabase(currentGame);
    const persistedRound = persistedGame?.categoryRounds?.[currentRoundIndex];
    const persistedQuestions = Array.isArray(persistedRound?.questions) ? persistedRound.questions : null;
    if (persistedQuestions?.length) {
      setCurrentCategoryQuestions(persistedQuestions);
      if (persistedQuestions[currentQuestionIndex]) {
        setCurrentQuestion(persistedQuestions[currentQuestionIndex]);
      }
    }
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
      resetAnswerSubmissionLock();
      setAnswered(false);
      setSelectedAnswers([]); // Reset für Multi-Select
      setLastSelectedAnswer(null); // Reset für Single-Choice
      resetQuizKeywordState();

      const timeLimit = getQuizTimeLimit(currentCategoryQuestions[nextQuestionIndex], currentGame.difficulty);
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
      resetQuizKeywordState();

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
      resetQuizKeywordState();

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
    // Runden-Ergebnis anzeigen bevor weitergemacht wird
    setCategoryRoundResult({
      round: currentGame.categoryRound,
      categoryId: currentCategoryRound.categoryId,
      categoryName: currentCategoryRound.categoryName,
      questions: currentCategoryRound.questions,
      myAnswers: isPlayer1 ? currentCategoryRound.player1Answers : currentCategoryRound.player2Answers,
      opponentAnswers: isPlayer1 ? currentCategoryRound.player2Answers : currentCategoryRound.player1Answers,
      myName: user.name,
      opponentName: isPlayer1 ? currentGame.player2 : currentGame.player1,
      player1Score: currentGame.player1Score,
      player2Score: currentGame.player2Score,
      player1Name: currentGame.player1,
      player2Name: currentGame.player2,
      isLastRound: currentGame.categoryRound >= 3,
    });
    setQuizCategory(null);
    setCurrentQuestion(null);
    setTimerActive(false);
  };

  // Weiter nach dem Runden-Ergebnis-Screen
  const proceedAfterCategoryResult = async () => {
    // Wenn der Result-Screen nachträglich per Polling angezeigt wurde (Spieler hat zuerst gespielt
    // und gewartet), ist die Runde auf dem Server bereits verarbeitet. Nur State clearen.
    const alreadyProcessed = categoryRoundResult &&
      (currentGame.categoryRound || 0) > (categoryRoundResult.round || 0);

    setCategoryRoundResult(null);

    if (alreadyProcessed) {
      // Game-State ist bereits korrekt aus dem Polling-Sync gesetzt
      return;
    }

    const currentCategoryRound = currentGame.categoryRounds[currentGame.categoryRound];

    if (currentGame.categoryRound < 3) {
      currentGame.categoryRound++;

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
      resetAnswerSubmissionLock();
      setAnswered(false);
      setSelectedAnswers([]);
      setLastSelectedAnswer(null);
      resetQuizKeywordState();
      setTimerActive(false);

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
    resetAnswerSubmissionLock();
    setAnswered(false);
    setSelectedAnswers([]); // Reset für Multi-Select
    setLastSelectedAnswer(null); // Reset für Single-Choice
    setWaitingForOpponent(false);
    resetQuizKeywordState();

    const timeLimit = getQuizTimeLimit(currentCategoryRound.questions[0], currentGame.difficulty);
    setTimeLeft(timeLimit);
    setTimerActive(true);
  };

  const resumeCategoryRound = () => {
    if (!currentGame || !currentGame.categoryRounds) return;

    const currentCategoryRound = currentGame.categoryRounds[currentGame.categoryRound];
    if (!currentCategoryRound) return;

    const isPlayer1 = user.name === currentGame.player1;
    const myAnswers = isPlayer1 ? currentCategoryRound.player1Answers : currentCategoryRound.player2Answers;
    const nextQuestionIndex = Math.max(0, myAnswers.length || 0);
    if (nextQuestionIndex >= currentCategoryRound.questions.length) return;

    setQuizCategory(currentCategoryRound.categoryId);
    setCurrentCategoryQuestions(currentCategoryRound.questions);
    setQuestionInCategory(nextQuestionIndex);
    setCurrentQuestion(currentCategoryRound.questions[nextQuestionIndex]);
    resetAnswerSubmissionLock();
    setAnswered(false);
    setSelectedAnswers([]);
    setLastSelectedAnswer(null);
    setWaitingForOpponent(false);
    resetQuizKeywordState();

    const timeLimit = getQuizTimeLimit(currentCategoryRound.questions[nextQuestionIndex], currentGame.difficulty);
    setTimeLeft(timeLimit);
    setTimerActive(true);
  };

  const autoForfeitGame = async (game, loser, winner) => {
    try {
      // NestJS backend handles duel expiry via its lifecycle cron.
      // Just update local UI state — the backend already marked it expired.
      setAllGames(prev => prev.map(g => g.id === game.id ? { ...g, status: 'finished', winner } : g));
      setActiveGames(prev => prev.filter(g => g.id !== game.id));
      localStorage.removeItem(`quiz_reminder_${game.id}_${game.currentTurn}`);
      localStorage.removeItem(`quiz_waiting_reminder_${game.id}_${game.player2}`);
    } catch (e) {
      console.warn('autoForfeitGame Fehler:', e);
    }
  };

  const checkExpiredAndRemindGames = async (games) => {
    if (!user?.name) return;
    const now = Date.now();
    const H24 = 24 * 60 * 60 * 1000;
    const H48 = 48 * 60 * 60 * 1000;
    const H1 = 60 * 60 * 1000;

    for (const game of games) {
      if (game.status === 'finished') continue;
      const isMine = game.player1 === user.name || game.player2 === user.name;
      if (!isMine) continue;

      if (game.status === 'waiting') {
        const remainingMs = getWaitingChallengeRemainingMs(game, now);
        if (!Number.isFinite(remainingMs)) continue;

        if (remainingMs <= 0) {
          const loser = game.player2;
          const winner = game.player1;
          await autoForfeitGame(game, loser, winner, 'challenge_expired');
          continue;
        }

        const reminderTarget = game.player2;
        if (reminderTarget !== user.name) continue;

        const timeoutMs = getChallengeTimeoutMs(game);
        const createdTs = parseTimestampSafe(game.createdAt || game.updatedAt);
        if (createdTs === null) continue;

        const elapsedMs = now - createdTs;
        const reminderThresholdMs = Math.min(H24, Math.max(H1, Math.floor(timeoutMs / 2)));
        if (elapsedMs < reminderThresholdMs) continue;

        const reminderKey = `quiz_waiting_reminder_${game.id}_${reminderTarget}`;
        if (localStorage.getItem(reminderKey)) continue;

        const opponent = game.player1;
        const minutesLeft = Math.max(1, Math.ceil(remainingMs / 60000));
        await sendNotification(
          reminderTarget,
          '⏰ Herausforderung läuft bald ab',
          `Du hast noch ca. ${formatDurationMinutesCompact(minutesLeft)} um die Herausforderung von ${opponent} anzunehmen.`,
          'warning'
        );
        localStorage.setItem(reminderKey, now.toString());
        continue;
      }

      const updatedAtTs = parseTimestampSafe(game.updatedAt);
      if (updatedAtTs === null) continue;
      const elapsed = now - updatedAtTs;

      if (elapsed >= H48) {
        const loser = game.currentTurn;
        const winner = game.player1 === loser ? game.player2 : game.player1;
        await autoForfeitGame(game, loser, winner, 'turn_timeout');
      } else if (elapsed >= H24) {
        const reminderTarget = game.currentTurn;
        if (reminderTarget !== user.name) continue;
        const reminderKey = `quiz_reminder_${game.id}_${reminderTarget}`;
        const lastSent = localStorage.getItem(reminderKey);
        if (lastSent && now - parseInt(lastSent) < H24) continue;

        const opponent = game.player1 === reminderTarget ? game.player2 : game.player1;
        const hoursLeft = Math.round((H48 - elapsed) / 3600000);
        await sendNotification(
          reminderTarget,
          '⏰ Quizduell-Erinnerung',
          `Du hast noch ca. ${hoursLeft}h für deinen Zug gegen ${opponent} – danach zählt es als Niederlage!`,
          'warning'
        );
        localStorage.setItem(reminderKey, now.toString());
      }
    }
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
      const opponentName = user.name === currentGame.player1 ? currentGame.player2 : currentGame.player1;
      if (opponentName) {
        let opponentTitle = '🏁 Quizduell beendet';
        let opponentMessage = `Quizduell gegen ${user.name} ist beendet.`;

        if (winner === null) {
          opponentTitle = '🤝 Quizduell unentschieden';
          opponentMessage = `Dein Quizduell gegen ${user.name} endete unentschieden.`;
        } else if (winner === opponentName) {
          opponentTitle = '🏆 Quizduell gewonnen';
          opponentMessage = `Du hast das Quizduell gegen ${user.name} gewonnen!`;
        } else {
          opponentTitle = '😔 Quizduell verloren';
          opponentMessage = `Du hast das Quizduell gegen ${user.name} verloren.`;
        }

        await sendNotification(opponentName, opponentTitle, opponentMessage, 'info');
      }

      // Nur eigene Stats aktualisieren (RLS erlaubt nur eigene Stats)
      let updatedH2h = { wins: 0, losses: 0, draws: 0 };
      try {
        const existingStats = await getUserStatsFromSupabase(user);
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

        await saveUserStatsToSupabase(user, stats);
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

        // H2H aus den aktualisierten Stats lesen (inkl. aktuelles Spiel)
        updatedH2h = stats.opponents[opponent] || { wins: 0, losses: 0, draws: 0 };
      } catch (error) {
        console.error('Stats update error:', error);
      }

      // Ergebnis-Screen anzeigen statt sofort zurückzusetzen
      const h2h = updatedH2h;

      setDuelResult({
        player1: currentGame.player1,
        player2: currentGame.player2,
        player1Score: currentGame.player1Score,
        player2Score: currentGame.player2Score,
        winner,
        myName: user.name,
        opponentName,
        h2h: { wins: h2h.wins || 0, losses: h2h.losses || 0, draws: h2h.draws || 0 }
      });

      // Spiel-State zurücksetzen (aber duelResult bleibt)
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
      resetQuizKeywordState();

      loadData();
      setCurrentView('quiz');
      checkBadges();
    } catch (error) {
      console.error('Finish error:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    if (!hasChatOrganization) {
      showToast('Chat ist erst verfuegbar, wenn dein Betrieb zugewiesen ist.', 'warning');
      return;
    }

    // Content moderation
    if (!moderateContent(newMessage, 'Nachricht')) {
      setNewMessage('');
      return;
    }

    const activeScope = getChatScopeKey(
      chatScope,
      getRoleKey(user.role) === 'azubi' ? 'azubi_room' : 'staff_room'
    );

    if (activeScope === 'azubi_room' && getRoleKey(user.role) !== 'azubi') {
      showToast('Der Azubi-Chat ist nur fuer Azubis gedacht.', 'warning');
      return;
    }

    let recipient = null;
    if (activeScope === 'direct_staff') {
      recipient = directChatCandidates.find((account) => account.id === selectedChatRecipientId) || null;
      if (!recipient) {
        showToast('Bitte zuerst einen passenden Chatpartner auswaehlen.', 'warning');
        return;
      }
    }

    try {
      const msg = await dsCreateChatMessage({
        content: newMessage.trim(),
        scope: activeScope,
        userName: user.name,
        avatar: user.avatar || null,
        senderRole: user.role,
        senderId: user.id,
        organizationId: user.organizationId,
        recipientId: recipient?.id || null
      });

      setMessages((prev) => [...prev, msg]);
      setNewMessage('');

      if (recipient?.name) {
        const preview = newMessage.trim().slice(0, 80);
        await sendNotification(
          recipient.name,
          'Neue Chatnachricht',
          `${user.name}: ${preview}${newMessage.trim().length > 80 ? '...' : ''}`,
          'info'
        );
      }
    } catch (error) {
      console.error('Message error:', error);
      showToast('Nachricht konnte nicht gesendet werden. Bitte erneut versuchen.', 'error');
    }
  };

  const deleteChatMessage = async (message) => {
    if (!message?.id || message?.isDeleted) return;

    const isMine = message.senderId === user?.id;
    const isAdminModeration = user?.role === 'admin' && !isMine;
    const confirmText = isAdminModeration
      ? 'Nachricht für alle Chatteilnehmer als entfernt markieren?'
      : 'Eigene Nachricht wirklich löschen?';

    if (!confirm(confirmText)) {
      return;
    }

    try {
      const deletedMessage = await dsDeleteChatMessage(message.id);
      setMessages((prev) => prev.filter((entry) => entry.id !== deletedMessage.id));
      showToast(isAdminModeration ? 'Nachricht wurde moderiert.' : 'Nachricht wurde gelöscht.', 'success');
    } catch (error) {
      console.error('Chat moderation error:', error);
      showToast(friendlyError(error), 'error');
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

      const refreshedStats = await getUserStatsFromSupabase(user);
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
      alert('Bitte alle Felder ausfüllen');
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
      alert('Fehler beim Speichern');
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

  // ==================== BERICHTSHEFT FUNKTIONEN ====================

  const loadBerichtsheftEntries = async () => {
    if (!user) return;
    try {
      const data = await dsLoadBerichtsheftEntries(user.name);
      const allEntries = Array.isArray(data) ? data : [];
      const submittedEntries = allEntries.filter((entry) => !isBerichtsheftDraft(entry));
      setBerichtsheftEntries(submittedEntries);

      // Setze die Nachweis-Nr auf nächste freie Nummer
      if (submittedEntries.length > 0) {
        const maxNr = Math.max(...submittedEntries.map(e => e.nachweis_nr || 0));
        setBerichtsheftNr(maxNr + 1);
      } else {
        setBerichtsheftNr(1);
      }
    } catch (err) {
      console.error('Fehler beim Laden des Berichtshefts:', err);
    }
  };

  const isSignedByAzubi = (entry) => Boolean(String(entry?.signatur_azubi || '').trim());
  const isSignedByAusbilder = (entry) => Boolean(String(entry?.signatur_ausbilder || '').trim());
  const hasEntryContent = (entry) => {
    if (!entry || !entry.entries || typeof entry.entries !== 'object') return false;
    return Object.values(entry.entries).some((dayRows) => Array.isArray(dayRows)
      && dayRows.some((row) => String(row?.taetigkeit || '').trim() !== ''));
  };
  const isBerichtsheftReadyForReview = (entry) => (
    hasEntryContent(entry)
    && isSignedByAzubi(entry)
    && !isSignedByAusbilder(entry)
  );

  const notifyBerichtsheftReadyForReview = async ({ azubiName, weekStart }) => {
    const normalizedAzubiName = String(azubiName || '').trim();
    if (!normalizedAzubiName) return;

    try {
      const reviewers = await dsGetAuthorizedReviewers('can_sign_reports');
      const reviewerNames = [...new Set(
        reviewers.map((r) => String(r?.name || '').trim()).filter(Boolean)
      )].filter((name) => name !== normalizedAzubiName);

      if (reviewerNames.length === 0) return;

      let weekLabel = String(weekStart || '').trim();
      if (weekLabel) {
        const weekDate = new Date(weekLabel);
        if (!Number.isNaN(weekDate.getTime())) {
          weekLabel = weekDate.toLocaleDateString('de-DE');
        }
      } else {
        weekLabel = 'unbekannt';
      }

      for (const reviewerName of reviewerNames) {
        await sendNotification(
          reviewerName,
          '📘 Berichtsheft wartet auf Freigabe',
          `${normalizedAzubiName} hat das Berichtsheft für die Woche ab ${weekLabel} abgeschlossen und zur Freigabe eingereicht.`,
          'berichtsheft_pending'
        );
      }
    } catch (error) {
      console.warn('Berichtsheft ready notification failed:', error);
    }
  };

  const loadBerichtsheftPendingSignatures = async () => {
    if (!user || !canManageBerichtsheftSignatures) {
      setBerichtsheftPendingSignatures([]);
      return;
    }

    setBerichtsheftPendingLoading(true);
    try {
      const data = await dsLoadBerichtsheftPending();
      const allEntries = Array.isArray(data) ? data : [];
      let pending = allEntries.filter((entry) =>
        !isBerichtsheftDraft(entry)
        &&
        hasEntryContent(entry)
        && isSignedByAzubi(entry)
        && !isSignedByAusbilder(entry)
      );

      const isAdmin = user.role === 'admin';
      if (!isAdmin) {
        pending = pending.filter((entry) =>
          !entry.assigned_trainer_id
          || entry.assigned_trainer_id === user.id
          || String(entry.assigned_trainer_name || '').trim() === String(user.name || '').trim()
        );
      }

      setBerichtsheftPendingSignatures(pending);
    } catch (err) {
      console.error('Fehler beim Laden offener Berichtshefte:', err);
      setBerichtsheftPendingSignatures([]);
    } finally {
      setBerichtsheftPendingLoading(false);
    }
  };

  const assignBerichtsheftTrainer = async (entryId, trainerId) => {
    if (!entryId || !trainerId) return;

    const trainer = allUsers.find((account) => account.id === trainerId);
    if (!trainer) {
      showToast('Ausbilder nicht gefunden.', 'error');
      return;
    }

    try {
      const payload = {
        assigned_trainer_id: trainerId,
        assigned_trainer_name: trainer.name || null,
        assigned_by_id: user?.id || null,
        assigned_at: new Date().toISOString(),
        trainerId, trainerName: trainer.name || null
      };

      await dsAssignBerichtsheftTrainer(entryId, payload);

      setBerichtsheftPendingSignatures((prev) => prev.map((entry) => (
        entry.id === entryId
          ? { ...entry, ...payload }
          : entry
      )));
      showToast(`Berichtsheft wurde ${trainer.name} zugewiesen.`, 'success');
    } catch (err) {
      console.error('Fehler beim Zuweisen des Berichtshefts:', err);
      showToast('Zuweisung fehlgeschlagen.', 'error');
    }
  };

  const getWeekEndDate = (startDate) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Sonntag
    return end.toISOString().split('T')[0];
  };

  const calculateTotalHoursFromEntries = (entries) => BERICHTSHEFT_DAY_KEYS.reduce((sum, day) => {
    const rows = Array.isArray(entries?.[day]) ? entries[day] : [];
    const daySum = rows.reduce((innerSum, row) => innerSum + (parseFloat(row?.stunden) || 0), 0);
    return sum + daySum;
  }, 0);

  const getBerichtsheftDraftOwnerKey = () => {
    if (!user) return '';
    if (user.id) return `id:${user.id}`;
    const normalizedName = String(user.name || '').trim().toLowerCase();
    return normalizedName ? `name:${normalizedName}` : '';
  };

  const buildBerichtsheftDraftKey = (weekStart) => {
    const owner = getBerichtsheftDraftOwnerKey();
    const week = String(weekStart || '').trim();
    if (!owner || !week) return '';
    return `${owner}|${week}`;
  };

  const readBerichtsheftDraftStore = () => {
    const parsed = parseJsonSafe(localStorage.getItem(BERICHTSHEFT_DRAFT_STORAGE_KEY), {});
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed;
  };

  const writeBerichtsheftDraftStore = (store) => {
    localStorage.setItem(BERICHTSHEFT_DRAFT_STORAGE_KEY, JSON.stringify(store));
  };

  const getBerichtsheftServerDraft = (weekStart) => {
    const week = String(weekStart || '').trim();
    if (!week) return null;
    return berichtsheftServerDraftsByWeek[week] || null;
  };

  const upsertBerichtsheftServerDraft = (draftRow) => {
    const week = String(draftRow?.week_start || '').trim();
    if (!week) return;
    setBerichtsheftServerDraftsByWeek((prev) => {
      const current = prev[week];
      if (!current || toTimestampMs(draftRow.updated_at) >= toTimestampMs(current.updated_at)) {
        return { ...prev, [week]: draftRow };
      }
      return prev;
    });
  };

  const removeBerichtsheftServerDraft = (weekStart) => {
    const week = String(weekStart || '').trim();
    if (!week) return;
    setBerichtsheftServerDraftsByWeek((prev) => {
      if (!prev[week]) return prev;
      const next = { ...prev };
      delete next[week];
      return next;
    });
  };

  const isBerichtsheftStatusColumnMissingError = (error) => {
    if (!error) return false;
    const code = String(error.code || '').trim();
    if (code === '42703') return true;
    const message = String(error.message || '').toLowerCase();
    const details = String(error.details || '').toLowerCase();
    return (message.includes('status') && message.includes('column'))
      || details.includes('status');
  };

  const disableBerichtsheftRemoteDrafts = (error) => {
    if (!isBerichtsheftStatusColumnMissingError(error)) return;
    setBerichtsheftRemoteDraftsEnabled(false);
    setBerichtsheftServerDraftsByWeek({});
    if (!berichtsheftRemoteDraftWarningShownRef.current) {
      showToast('Server-Entwurfs-Sync ist vorübergehend nicht verfügbar.', 'warning');
      berichtsheftRemoteDraftWarningShownRef.current = true;
    }
    console.warn('Berichtsheft Remote-Drafts deaktiviert (status-Spalte fehlt).', error);
  };

  const buildBerichtsheftDraftSnapshot = (weekStart = berichtsheftWeek) => ({
    week_start: String(weekStart || '').trim(),
    ausbildungsjahr: berichtsheftYear,
    nachweis_nr: berichtsheftNr,
    entries: normalizeBerichtsheftEntries(currentWeekEntries),
    bemerkung_azubi: berichtsheftBemerkungAzubi,
    bemerkung_ausbilder: berichtsheftBemerkungAusbilder,
    signatur_azubi: berichtsheftSignaturAzubi,
    signatur_ausbilder: berichtsheftSignaturAusbilder,
    datum_azubi: berichtsheftDatumAzubi,
    datum_ausbilder: berichtsheftDatumAusbilder,
    updated_at: new Date().toISOString()
  });

  const hasBerichtsheftDraftContent = (snapshot) => {
    if (!snapshot) return false;
    const hasDayContent = Object.values(snapshot.entries || {}).some((rows) => Array.isArray(rows)
      && rows.some((row) => String(row?.taetigkeit || '').trim() !== ''
        || String(row?.stunden || '').trim() !== ''
        || String(row?.bereich || '').trim() !== ''));
    if (hasDayContent) return true;
    return String(snapshot.bemerkung_azubi || '').trim() !== ''
      || String(snapshot.bemerkung_ausbilder || '').trim() !== ''
      || String(snapshot.signatur_azubi || '').trim() !== ''
      || String(snapshot.signatur_ausbilder || '').trim() !== ''
      || String(snapshot.datum_azubi || '').trim() !== ''
      || String(snapshot.datum_ausbilder || '').trim() !== '';
  };

  const loadBerichtsheftServerDrafts = async () => {
    if (!user || !berichtsheftRemoteDraftsEnabled) {
      setBerichtsheftServerDraftsByWeek({});
      return;
    }

    try {
      const entries = await dsLoadBerichtsheftEntries(user.name);
      const data = entries.filter((entry) => entry.status === 'draft');

      const map = {};
      (Array.isArray(data) ? data : []).forEach((row) => {
        const week = String(row?.week_start || '').trim();
        if (!week) return;
        const prev = map[week];
        if (!prev || toTimestampMs(row.updated_at) >= toTimestampMs(prev.updated_at)) {
          map[week] = row;
        }
      });
      setBerichtsheftServerDraftsByWeek(map);
      if (currentView === 'berichtsheft' && !selectedBerichtsheft) {
        loadBerichtsheftDraftForWeek(berichtsheftWeek, { serverDraftMap: map });
      }
    } catch (error) {
      disableBerichtsheftRemoteDrafts(error);
      if (!isBerichtsheftStatusColumnMissingError(error)) {
        console.warn('Berichtsheft-Serverentwuerfe konnten nicht geladen werden:', error);
      }
    }
  };

  const findBerichtsheftServerDraftByWeek = async (weekStart) => {
    const week = String(weekStart || '').trim();
    if (!week || !user || !berichtsheftRemoteDraftsEnabled) return null;

    const cached = getBerichtsheftServerDraft(week);
    if (cached?.id) return cached;

    try {
      const entries = await dsLoadBerichtsheftEntries(user.name);
      const row = entries
        .filter((entry) => entry.status === 'draft' && String(entry.week_start || '').trim() === week)
        .reduce((latest, entry) => {
          if (!latest) return entry;
          return toTimestampMs(entry.updated_at) >= toTimestampMs(latest.updated_at) ? entry : latest;
        }, null);
      if (row) upsertBerichtsheftServerDraft(row);
      return row;
    } catch (error) {
      disableBerichtsheftRemoteDrafts(error);
      if (!isBerichtsheftStatusColumnMissingError(error)) {
        console.warn('Berichtsheft-Serverentwurf konnte nicht abgefragt werden:', error);
      }
      return null;
    }
  };

  const persistBerichtsheftDraft = (weekStart = berichtsheftWeek) => {
    if (!user || selectedBerichtsheft) return;
    const draftKey = buildBerichtsheftDraftKey(weekStart);
    if (!draftKey) return;

    const snapshot = buildBerichtsheftDraftSnapshot(weekStart);

    const store = readBerichtsheftDraftStore();
    if (!hasBerichtsheftDraftContent(snapshot)) {
      if (store[draftKey]) {
        delete store[draftKey];
        writeBerichtsheftDraftStore(store);
      }
      return;
    }

    store[draftKey] = snapshot;
    writeBerichtsheftDraftStore(store);
  };

  const persistBerichtsheftDraftRemote = async (weekStart = berichtsheftWeek) => {
    if (!user || selectedBerichtsheft || !berichtsheftRemoteDraftsEnabled) return;

    const snapshot = buildBerichtsheftDraftSnapshot(weekStart);
    const targetWeek = String(snapshot.week_start || '').trim();
    if (!targetWeek) return;

    const existingDraft = await findBerichtsheftServerDraftByWeek(targetWeek);
    const hasContent = hasBerichtsheftDraftContent(snapshot);

    if (!hasContent) {
      if (existingDraft?.id) {
        try {
          await dsDeleteBerichtsheftDraft(targetWeek, { draftId: existingDraft.id });
          removeBerichtsheftServerDraft(targetWeek);
        } catch (error) {
          disableBerichtsheftRemoteDrafts(error);
          if (!isBerichtsheftStatusColumnMissingError(error)) {
            console.warn('Leerer Berichtsheft-Serverentwurf konnte nicht entfernt werden:', error);
          }
        }
      }
      return;
    }

    const payload = {
      user_name: user.name, userName: user.name,
      week_start: targetWeek, weekStart: targetWeek,
      week_end: getWeekEndDate(targetWeek), weekEnd: getWeekEndDate(targetWeek),
      ausbildungsjahr: snapshot.ausbildungsjahr, trainingYear: snapshot.ausbildungsjahr,
      nachweis_nr: snapshot.nachweis_nr, reportNumber: snapshot.nachweis_nr,
      entries: snapshot.entries,
      bemerkung_azubi: snapshot.bemerkung_azubi, azubiRemarks: snapshot.bemerkung_azubi,
      bemerkung_ausbilder: snapshot.bemerkung_ausbilder, trainerRemarks: snapshot.bemerkung_ausbilder,
      signatur_azubi: snapshot.signatur_azubi, azubiSignature: snapshot.signatur_azubi,
      signatur_ausbilder: snapshot.signatur_ausbilder, trainerSignature: snapshot.signatur_ausbilder,
      datum_azubi: snapshot.datum_azubi || null, azubiDate: snapshot.datum_azubi || null,
      datum_ausbilder: snapshot.datum_ausbilder || null, trainerDate: snapshot.datum_ausbilder || null,
      total_hours: calculateTotalHoursFromEntries(snapshot.entries),
      totalHours: calculateTotalHoursFromEntries(snapshot.entries),
      status: 'draft'
    };

    try {
      const savedRow = await dsUpsertBerichtsheftDraft({
        ...payload,
        existingDraftId: existingDraft?.id || undefined
      });
      if (savedRow) upsertBerichtsheftServerDraft(savedRow);
    } catch (error) {
      disableBerichtsheftRemoteDrafts(error);
      if (!isBerichtsheftStatusColumnMissingError(error)) {
        console.warn('Berichtsheft-Serverentwurf konnte nicht gespeichert werden:', error);
      }
    }
  };

  const clearBerichtsheftDraft = (weekStart = berichtsheftWeek) => {
    const draftKey = buildBerichtsheftDraftKey(weekStart);
    if (!draftKey) return;
    const store = readBerichtsheftDraftStore();
    if (!store[draftKey]) return;
    delete store[draftKey];
    writeBerichtsheftDraftStore(store);
  };

  const clearBerichtsheftDraftRemote = async (weekStart = berichtsheftWeek) => {
    if (!user || !berichtsheftRemoteDraftsEnabled) return;
    const week = String(weekStart || '').trim();
    if (!week) return;

    const existingDraft = await findBerichtsheftServerDraftByWeek(week);
    if (!existingDraft?.id) {
      removeBerichtsheftServerDraft(week);
      return;
    }

    try {
      await dsDeleteBerichtsheftDraft(week, { draftId: existingDraft.id });
      removeBerichtsheftServerDraft(week);
    } catch (error) {
      disableBerichtsheftRemoteDrafts(error);
      if (!isBerichtsheftStatusColumnMissingError(error)) {
        console.warn('Berichtsheft-Serverentwurf konnte nicht geloescht werden:', error);
      }
    }
  };

  const loadBerichtsheftDraftForWeek = (weekStart, options = {}) => {
    if (!user) return false;
    const targetWeek = String(weekStart || '').trim();
    if (!targetWeek) return false;

    const { resetIfMissing = false, serverDraftMap = null } = options;
    const draftKey = buildBerichtsheftDraftKey(targetWeek);
    const store = readBerichtsheftDraftStore();
    const localDraft = draftKey ? store[draftKey] : null;
    const remoteMap = (serverDraftMap && typeof serverDraftMap === 'object') ? serverDraftMap : berichtsheftServerDraftsByWeek;
    const remoteDraft = remoteMap[targetWeek] || null;

    let draft = null;
    if (localDraft && remoteDraft) {
      draft = toTimestampMs(localDraft.updated_at) >= toTimestampMs(remoteDraft.updated_at)
        ? localDraft
        : remoteDraft;
    } else {
      draft = localDraft || remoteDraft;
    }

    if (draft && typeof draft === 'object') {
      const parsedYear = Number(draft.ausbildungsjahr);
      const parsedNr = Number(draft.nachweis_nr);
      setSelectedBerichtsheft(null);
      setBerichtsheftWeek(targetWeek);
      setBerichtsheftYear(parsedYear >= 1 && parsedYear <= 3 ? parsedYear : 1);
      setBerichtsheftNr(Number.isFinite(parsedNr) ? Math.max(1, Math.round(parsedNr)) : 1);
      setCurrentWeekEntries(normalizeBerichtsheftEntries(draft.entries));
      setBerichtsheftBemerkungAzubi(String(draft.bemerkung_azubi || ''));
      setBerichtsheftBemerkungAusbilder(String(draft.bemerkung_ausbilder || ''));
      setBerichtsheftSignaturAzubi(String(draft.signatur_azubi || ''));
      setBerichtsheftSignaturAusbilder(String(draft.signatur_ausbilder || ''));
      setBerichtsheftDatumAzubi(String(draft.datum_azubi || ''));
      setBerichtsheftDatumAusbilder(String(draft.datum_ausbilder || ''));
      return true;
    }

    if (resetIfMissing) {
      setSelectedBerichtsheft(null);
      setBerichtsheftWeek(targetWeek);
      setCurrentWeekEntries(createEmptyBerichtsheftEntries());
      setBerichtsheftBemerkungAzubi('');
      setBerichtsheftBemerkungAusbilder('');
      setBerichtsheftSignaturAzubi('');
      setBerichtsheftSignaturAusbilder('');
      setBerichtsheftDatumAzubi('');
      setBerichtsheftDatumAusbilder('');
    }
    return false;
  };

  const handleBerichtsheftWeekChange = (nextWeek) => {
    const targetWeek = String(nextWeek || '').trim();
    if (!targetWeek) return;

    if (!selectedBerichtsheft) {
      if (berichtsheftDraftSaveTimerRef.current) {
        clearTimeout(berichtsheftDraftSaveTimerRef.current);
        berichtsheftDraftSaveTimerRef.current = null;
      }
      if (berichtsheftRemoteDraftSaveTimerRef.current) {
        clearTimeout(berichtsheftRemoteDraftSaveTimerRef.current);
        berichtsheftRemoteDraftSaveTimerRef.current = null;
      }
      persistBerichtsheftDraft(berichtsheftWeek);
      void persistBerichtsheftDraftRemote(berichtsheftWeek);
      loadBerichtsheftDraftForWeek(targetWeek, { resetIfMissing: true });
      return;
    }

    setBerichtsheftWeek(targetWeek);
  };

  // Azubi-Profil speichern (localStorage sofort + Backend debounced)
  const saveAzubiProfile = (newProfile) => {
    setAzubiProfile(newProfile);
    localStorage.setItem('azubi_profile', JSON.stringify(newProfile));

    if (azubiProfileSaveTimerRef.current) {
      clearTimeout(azubiProfileSaveTimerRef.current);
    }
    azubiProfileSaveTimerRef.current = setTimeout(async () => {
      if (user?.id) {
        try {
          await dsUpdateBerichtsheftProfile(user.id, newProfile);
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

  const normalizeSwimTrainingPlanCategory = (value) => {
    const normalized = String(value || '').trim().toLowerCase();
    if (['ausdauer', 'sprint', 'technik', 'kombi'].includes(normalized)) {
      return normalized;
    }
    return 'ausdauer';
  };

  const normalizeSwimTrainingPlanDifficulty = (value) => {
    const normalized = String(value || '').trim().toLowerCase();
    if (['angenehm', 'fokussiert', 'anspruchsvoll'].includes(normalized)) {
      return normalized;
    }
    return 'fokussiert';
  };

  const parseSwimTrainingPlanUnitsJson = (unitsInput) => {
    if (Array.isArray(unitsInput)) {
      return unitsInput;
    }
    if (typeof unitsInput === 'string') {
      try {
        const parsed = JSON.parse(unitsInput);
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        return [];
      }
    }
    return [];
  };

  const normalizeSwimTrainingPlanUnit = (unitInput = {}, index = 0) => {
    const unit = (unitInput && typeof unitInput === 'object') ? unitInput : {};
    const requestedId = String(unit.id || unit.unitId || '').trim().toLowerCase();
    const baseId = requestedId.replace(/[^a-z0-9_-]/g, '') || `unit_${index + 1}`;
    const styleId = String(unit.styleId || unit.style_id || 'kraul').trim() || 'kraul';
    const targetDistance = Math.max(100, toSafeInt(unit.targetDistance ?? unit.target_distance));
    const targetTime = Math.max(1, toSafeInt(unit.targetTime ?? unit.target_time));
    return {
      id: baseId,
      styleId,
      targetDistance,
      targetTime
    };
  };

  const normalizeSwimTrainingPlanUnits = (unitsInput, fallbackInput = {}) => {
    const planFallback = (fallbackInput && typeof fallbackInput === 'object') ? fallbackInput : {};
    const parsedUnits = parseSwimTrainingPlanUnitsJson(unitsInput);
    const fallbackUnit = {
      id: 'unit_1',
      styleId: String(planFallback.style_id || planFallback.styleId || 'kraul').trim() || 'kraul',
      targetDistance: Math.max(100, toSafeInt(planFallback.target_distance ?? planFallback.targetDistance)),
      targetTime: Math.max(1, toSafeInt(planFallback.target_time ?? planFallback.targetTime))
    };
    const sourceUnits = parsedUnits.length > 0 ? parsedUnits : [fallbackUnit];

    const usedIds = new Set();
    return sourceUnits.map((unit, index) => {
      const normalized = normalizeSwimTrainingPlanUnit(unit, index);
      let finalId = normalized.id;
      let suffix = 2;
      while (usedIds.has(finalId)) {
        finalId = `${normalized.id}_${suffix}`;
        suffix += 1;
      }
      usedIds.add(finalId);
      return { ...normalized, id: finalId };
    });
  };

  const normalizeCustomSwimTrainingPlan = (planRowInput) => {
    const planRow = (planRowInput && typeof planRowInput === 'object') ? planRowInput : {};
    const normalizedUnits = normalizeSwimTrainingPlanUnits(planRow.units_json, planRow);
    const primaryUnit = normalizedUnits[0] || normalizeSwimTrainingPlanUnit({}, 0);
    const normalizedXp = Math.max(1, toSafeInt(planRow.xp_reward));
    return {
      id: String(planRow.id || ''),
      name: String(planRow.name || 'Individueller Plan').trim() || 'Individueller Plan',
      category: normalizeSwimTrainingPlanCategory(planRow.category),
      difficulty: normalizeSwimTrainingPlanDifficulty(planRow.difficulty),
      styleId: primaryUnit.styleId,
      targetDistance: primaryUnit.targetDistance,
      targetTime: primaryUnit.targetTime,
      units: normalizedUnits,
      xpReward: normalizedXp,
      description: String(planRow.description || '').trim(),
      source: 'custom',
      isCustom: true,
      createdByUserId: planRow.created_by_user_id || null,
      createdByName: String(planRow.created_by_name || '').trim(),
      createdByRole: String(planRow.created_by_role || '').trim(),
      assignedUserId: planRow.assigned_user_id || null,
      assignedUserName: String(planRow.assigned_user_name || '').trim(),
      assignedUserRole: String(planRow.assigned_user_role || '').trim(),
      createdAt: planRow.created_at || null
    };
  };

  const loadCustomSwimTrainingPlans = async () => {
    if (!user?.id) {
      setCustomSwimTrainingPlans([]);
      return;
    }

    try {
      const data = await dsLoadCustomSwimPlans();
      const normalizedPlans = (Array.isArray(data) ? data : []).map(normalizeCustomSwimTrainingPlan);
      const canManageAllPlans = Boolean(
        user?.permissions?.canViewAllStats
        || user?.role === 'admin'
        || user?.role === 'trainer'
        || user?.role === 'ausbilder'
      );

      const visiblePlans = canManageAllPlans
        ? normalizedPlans
        : normalizedPlans.filter((plan) =>
          plan.assignedUserId === user.id || plan.createdByUserId === user.id
        );

      setCustomSwimTrainingPlans(visiblePlans);
    } catch (err) {
      console.warn('Individuelle Schwimm-Trainingsplaene konnten nicht geladen werden:', err);
      setCustomSwimTrainingPlans([]);
    }
  };

  const createCustomSwimTrainingPlan = async (planInput = {}) => {
    if (!user?.id) {
      return { success: false, error: 'Bitte melde dich erneut an.' };
    }

    const isTrainerLike = Boolean(
      user?.permissions?.canViewAllStats
      || user?.role === 'admin'
      || user?.role === 'trainer'
      || user?.role === 'ausbilder'
    );
    const availableAzubis = allUsers.filter((account) => account?.id && String(account.role || '').toLowerCase() === 'azubi');
    const requestedAssignedUserId = String(planInput.assignedUserId || '').trim();
    const fallbackAssignedUserId = isTrainerLike
      ? (availableAzubis[0]?.id || user.id)
      : user.id;
    const assignedUserId = isTrainerLike
      ? (requestedAssignedUserId || fallbackAssignedUserId)
      : user.id;

    const assignedUser =
      allUsers.find((account) => account?.id === assignedUserId)
      || (assignedUserId === user.id ? { id: user.id, name: user.name, role: user.role } : null);

    if (!assignedUserId || !assignedUser) {
      return { success: false, error: 'Zielperson für den Trainingsplan konnte nicht gefunden werden.' };
    }

    const name = String(planInput.name || '').trim();
    if (!name) {
      return { success: false, error: 'Bitte einen Namen für den Trainingsplan angeben.' };
    }

    const category = normalizeSwimTrainingPlanCategory(planInput.category);
    const difficulty = normalizeSwimTrainingPlanDifficulty(planInput.difficulty);
    const normalizedUnits = normalizeSwimTrainingPlanUnits(planInput.units, planInput);
    const primaryUnit = normalizedUnits[0] || normalizeSwimTrainingPlanUnit({}, 0);
    const styleId = primaryUnit.styleId;
    const targetDistance = primaryUnit.targetDistance;
    const targetTime = primaryUnit.targetTime;
    const xpReward = Math.max(1, toSafeInt(planInput.xpReward));
    const description = String(planInput.description || '').trim();

    const insertPayload = {
      created_by_user_id: user.id,
      created_by_name: user.name || 'Unbekannt',
      created_by_role: user.role || 'azubi',
      assigned_user_id: assignedUserId,
      assigned_user_name: assignedUser?.name || 'Unbekannt',
      assigned_user_role: assignedUser?.role || 'azubi',
      name,
      category,
      difficulty,
      style_id: styleId,
      target_distance: targetDistance,
      target_time: targetTime,
      units_json: normalizedUnits.map((unit) => ({
        id: unit.id,
        style_id: unit.styleId,
        target_distance: unit.targetDistance,
        target_time: unit.targetTime
      })),
      xp_reward: xpReward,
      description,
      is_active: true
    };

    try {
      const data = await dsCreateCustomSwimPlan(insertPayload);
      const normalized = normalizeCustomSwimTrainingPlan(data);
      setCustomSwimTrainingPlans((prev) => [normalized, ...prev]);

      if (assignedUserId !== user.id && assignedUser?.name) {
        const unitLabel = normalizedUnits.length > 1
          ? `${normalizedUnits.length} Einheiten (Start: ${targetDistance}m in ${targetTime} Min)`
          : `${targetDistance}m in ${targetTime} Min`;
        await sendNotification(
          assignedUser.name,
          '🏊 Neuer Trainingsplan',
          `${user.name} hat dir den Plan "${name}" zugewiesen (${unitLabel}).`,
          'swim_plan'
        );
      }

      return { success: true, data: normalized };
    } catch (err) {
      console.error('Fehler beim Speichern des individuellen Trainingsplans:', err);
      return { success: false, error: err.message || 'Unbekannter Fehler beim Speichern.' };
    }
  };

  const swimTrainingPlans = [
    ...SWIM_TRAINING_PLANS.map((plan) => {
      const normalizedUnits = normalizeSwimTrainingPlanUnits(plan.units, plan);
      const primaryUnit = normalizedUnits[0] || normalizeSwimTrainingPlanUnit({}, 0);
      return {
        ...plan,
        styleId: primaryUnit.styleId,
        targetDistance: primaryUnit.targetDistance,
        targetTime: primaryUnit.targetTime,
        units: normalizedUnits,
        source: 'default',
        isCustom: false,
        createdByUserId: null,
        createdByName: '',
        createdByRole: '',
        assignedUserId: null,
        assignedUserName: '',
        assignedUserRole: '',
        createdAt: null
      };
    }),
    ...customSwimTrainingPlans
  ];

  const getSwimTrainingPlanById = (planIdInput) => {
    const planId = String(planIdInput || '').trim();
    if (!planId) return null;
    return swimTrainingPlans.find((plan) => String(plan.id || '') === planId) || null;
  };

  const buildSwimmerDistanceRankingForMonth = useCallback((monthKey) => {
    if (!monthKey) return [];

    const userDirectory = {};
    allUsers.forEach((account) => {
      if (!account?.id) return;
      userDirectory[account.id] = {
        name: account.name || 'Unbekannt',
        role: account.role || 'azubi'
      };
    });

    const totalsByUserId = {};
    swimSessions.forEach((session) => {
      if (!session?.confirmed || !isDateInSwimMonth(session.date, monthKey)) return;
      const userId = session.user_id || '';
      if (!userId) return;
      if (!totalsByUserId[userId]) {
        totalsByUserId[userId] = {
          user_id: userId,
          user_name: session.user_name || userDirectory[userId]?.name || 'Unbekannt',
          user_role: session.user_role || userDirectory[userId]?.role || 'azubi',
          distance: 0,
          time_minutes: 0,
          sessions: 0
        };
      }
      totalsByUserId[userId].distance += toSafeInt(session.distance);
      totalsByUserId[userId].time_minutes += toSafeInt(session.time_minutes);
      totalsByUserId[userId].sessions += 1;
    });

    return Object.values(totalsByUserId)
      .sort((a, b) =>
        (b.distance - a.distance)
        || (b.sessions - a.sessions)
        || String(a.user_name || '').localeCompare(String(b.user_name || ''), 'de-DE')
      );
  }, [allUsers, swimSessions]);

  const buildSwimMonthlyResultPayload = useCallback((monthDateInput) => {
    const monthDate = parseDateSafe(monthDateInput);
    if (!monthDate) return null;

    const targetDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthKey = getSwimMonthKey(targetDate);
    if (!monthKey) return null;

    const monthSessions = swimSessions.filter((session) => isDateInSwimMonth(session?.date, monthKey));
    const battleStats = calculateTeamBattleStats(monthSessions, {}, allUsers);

    let winnerTeam = 'tie';
    if (battleStats.azubis.points > battleStats.trainer.points) {
      winnerTeam = 'azubis';
    } else if (battleStats.trainer.points > battleStats.azubis.points) {
      winnerTeam = 'trainer';
    }

    const swimmerRanking = buildSwimmerDistanceRankingForMonth(monthKey);
    const swimmerOfMonth = swimmerRanking.find((entry) => toSafeInt(entry.distance) > 0) || null;

    return {
      month_key: monthKey,
      year: targetDate.getFullYear(),
      month: targetDate.getMonth() + 1,
      winner_team: winnerTeam,
      azubis_points: toSafeInt(battleStats.azubis.points),
      trainer_points: toSafeInt(battleStats.trainer.points),
      azubis_distance: toSafeInt(battleStats.azubis.distance),
      trainer_distance: toSafeInt(battleStats.trainer.distance),
      swimmer_user_id: swimmerOfMonth?.user_id || null,
      swimmer_name: swimmerOfMonth?.user_name || null,
      swimmer_role: swimmerOfMonth?.user_role || null,
      swimmer_distance: swimmerOfMonth ? toSafeInt(swimmerOfMonth.distance) : 0
    };
  }, [allUsers, buildSwimmerDistanceRankingForMonth, swimSessions]);

  const loadSwimMonthlyResults = useCallback(async (yearInput = new Date().getFullYear()) => {
    try {
      const parsedYear = Number(yearInput);
      const year = Number.isFinite(parsedYear) ? Math.max(0, Math.round(parsedYear)) : new Date().getFullYear();
      const data = await dsLoadSwimMonthlyResults(year);
      setSwimMonthlyResults(data);
    } catch (err) {
      console.warn('Monatsergebnisse konnten nicht geladen werden:', err);
      setSwimMonthlyResults([]);
    }
  }, []);

  const upsertSwimMonthlyResult = useCallback(async (monthDateInput) => {
    const payload = buildSwimMonthlyResultPayload(monthDateInput);
    if (!payload) return;
    try {
      await dsUpsertSwimMonthlyResult(payload);
    } catch (err) {
      console.warn('Monatsergebnis konnte nicht gespeichert werden:', err);
    }
  }, [buildSwimMonthlyResultPayload]);

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

  const SWIM_PLAN_NOTE_TAG_PREFIX = '[SWIM_PLAN:';
  const SWIM_PLAN_NOTE_UNIT_TAG_PREFIX = '[SWIM_PLAN_UNIT:';
  const SWIM_PLAN_NOTE_TAG_REGEX = /\[SWIM_PLAN:([a-z0-9_-]+)\]/i;
  const SWIM_PLAN_NOTE_UNIT_TAG_REGEX = /\[SWIM_PLAN_UNIT:([a-z0-9_-]+)\]/i;

  const extractSwimTrainingPlanIdFromNotes = (notesInput) => {
    const notes = String(notesInput || '');
    const match = notes.match(SWIM_PLAN_NOTE_TAG_REGEX);
    return match?.[1] || null;
  };

  const extractSwimTrainingPlanUnitIdFromNotes = (notesInput) => {
    const notes = String(notesInput || '');
    const match = notes.match(SWIM_PLAN_NOTE_UNIT_TAG_REGEX);
    return match?.[1] || null;
  };

  const extractSwimTrainingPlanSelectionFromNotes = (notesInput) => ({
    trainingPlanId: extractSwimTrainingPlanIdFromNotes(notesInput),
    trainingPlanUnitId: extractSwimTrainingPlanUnitIdFromNotes(notesInput)
  });

  const stripSwimTrainingPlanTagFromNotes = (notesInput) => {
    const notes = String(notesInput || '');
    return notes
      .replace(/\s*\[SWIM_PLAN:[^\]]+\]\s*/gi, ' ')
      .replace(/\s*\[SWIM_PLAN_UNIT:[^\]]+\]\s*/gi, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  const encodeSwimTrainingPlanInNotes = (notesInput, trainingPlanIdInput, trainingPlanUnitIdInput) => {
    const cleanedNotes = stripSwimTrainingPlanTagFromNotes(notesInput);
    const trainingPlanId = String(trainingPlanIdInput || '').trim();
    const trainingPlanUnitId = String(trainingPlanUnitIdInput || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!trainingPlanId) {
      return cleanedNotes;
    }

    const tags = [`${SWIM_PLAN_NOTE_TAG_PREFIX}${trainingPlanId}]`];
    if (trainingPlanUnitId) {
      tags.push(`${SWIM_PLAN_NOTE_UNIT_TAG_PREFIX}${trainingPlanUnitId}]`);
    }
    return cleanedNotes
      ? `${cleanedNotes}\n${tags.join('\n')}`
      : tags.join('\n');
  };

  const doesSessionFulfillPlanUnit = (sessionInput, planUnitInput) => {
    if (!sessionInput || !planUnitInput) return false;

    const distance = Number(sessionInput.distance || 0);
    const timeMinutes = Number(sessionInput.time_minutes || 0);
    const styleId = String(sessionInput.style || '');
    if (!Number.isFinite(distance) || !Number.isFinite(timeMinutes) || distance <= 0 || timeMinutes <= 0) {
      return false;
    }

    const targetDistance = Number(planUnitInput.targetDistance || 0);
    const targetTime = Number(planUnitInput.targetTime || 0);
    if (!Number.isFinite(targetDistance) || !Number.isFinite(targetTime) || targetDistance <= 0 || targetTime <= 0) {
      return false;
    }

    const styleMatches = !planUnitInput.styleId || String(planUnitInput.styleId) === styleId;
    if (!styleMatches) return false;

    return distance >= targetDistance && timeMinutes <= targetTime;
  };

  const doesSessionFulfillTrainingPlan = (sessionInput, planInput, requestedUnitIdInput = '') => {
    if (!sessionInput || !planInput) return false;

    const requestedUnitId = String(requestedUnitIdInput || '').trim().toLowerCase();
    const normalizedUnits = normalizeSwimTrainingPlanUnits(planInput.units, planInput);
    if (normalizedUnits.length === 0) {
      return false;
    }

    if (requestedUnitId) {
      const requestedUnit = normalizedUnits.find((unit) => unit.id === requestedUnitId);
      if (!requestedUnit) return false;
      return doesSessionFulfillPlanUnit(sessionInput, requestedUnit);
    }

    return normalizedUnits.some((unit) => doesSessionFulfillPlanUnit(sessionInput, unit));
  };

  // Trainingseinheiten laden
  const loadSwimSessions = async () => {
    setSwimSessionsLoaded(false);
    try {
      const data = await dsLoadSwimSessions();
      if (import.meta.env.DEV) console.log('Schwimm-Sessions geladen:', data?.length || 0);
      setSwimSessions(data);

      if (user?.permissions?.canViewAllStats) {
        const pending = data.filter(s => !s.confirmed);
        setPendingSwimConfirmations(pending);
      }
      setSwimSessionsLoaded(true);
    } catch (err) {
      console.error('Fehler beim Laden der Schwimm-Einheiten:', err);
      setSwimSessions([]);
      setSwimSessionsLoaded(true);
    }
  };

  // Trainingseinheit speichern
  const saveSwimSession = async (sessionData) => {
    try {
      if (!user || !user.id) {
        console.error('Kein User oder User-ID vorhanden');
        return { success: false, error: 'Bitte melde dich erneut an.' };
      }

      const newSession = {
        user_id: user.id, userId: user.id,
        user_name: user.name, userName: user.name,
        user_role: user.role, userRole: user.role,
        date: sessionData.date,
        distance: parseInt(sessionData.distance) || 0,
        time_minutes: parseInt(sessionData.time) || 0, timeMinutes: parseInt(sessionData.time) || 0,
        style: sessionData.style,
        notes: encodeSwimTrainingPlanInNotes(sessionData.notes, sessionData.trainingPlanId, sessionData.trainingPlanUnitId),
        challenge_id: sessionData.challengeId || null, challengeId: sessionData.challengeId || null,
        confirmed: false, confirmed_by: null, confirmed_at: null
      };

      if (import.meta.env.DEV) console.log('Speichere Schwimm-Session');
      const savedSession = await dsSaveSwimSession(newSession);
      if (import.meta.env.DEV) console.log('Session gespeichert');

      setSwimSessions(prev => [savedSession, ...prev]);
      setPendingSwimConfirmations(prev => [savedSession, ...prev]);

      const styleLabel = SWIM_STYLES.find(style => style.id === sessionData.style)?.name || sessionData.style || 'Unbekannt';
      const sessionDateLabel = sessionData.date
        ? new Date(sessionData.date).toLocaleDateString('de-DE')
        : 'ohne Datum';

      try {
        const reviewers = await dsGetAuthorizedReviewers();
        const reviewerNames = [...new Set(reviewers.map(r => String(r.name || '').trim()).filter(Boolean))];
        for (const reviewerName of reviewerNames) {
          if (reviewerName === user.name) continue;
          await sendNotification(
            reviewerName,
            '🏊 Neue Schwimmeinheit wartet auf Freigabe',
            `${user.name} hat eine Schwimmeinheit eingetragen (${sessionDateLabel}, ${sessionData.distance}m, ${styleLabel}) und wartet auf Bestätigung.`,
            'swim_pending'
          );
        }
      } catch (reviewErr) {
        console.warn('Reviewer lookup for swim notification failed:', reviewErr);
      }

      return { success: true, data: savedSession };
    } catch (err) {
      console.error('Fehler beim Speichern der Schwimm-Einheit:', err);
      return { success: false, error: err.message || 'Unbekannter Fehler' };
    }
  };

  // Trainingseinheit bestätigen (Trainer)
  const confirmSwimSession = async (sessionId) => {
    try {
      const sessionToConfirm = swimSessions.find(s => s.id === sessionId) || null;
      const confirmationResult = await dsConfirmSwimSession(sessionId, user.name);
      const confirmedSession = confirmationResult?.id ? confirmationResult : sessionToConfirm;

      // Aktualisiere lokale Listen
      setSwimSessions(prev => prev.map(s =>
        s.id === sessionId
          ? {
              ...s,
              ...(confirmedSession || {}),
              confirmed: true,
              confirmed_by: confirmationResult?.confirmed_by || confirmationResult?.reviewed_by || user.name,
              confirmed_at: confirmationResult?.confirmed_at || confirmationResult?.reviewed_at || new Date().toISOString()
            }
          : s
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
      await dsRejectSwimSession(sessionId);
      setSwimSessions(prev => prev.filter(s => s.id !== sessionId));
      setPendingSwimConfirmations(prev => prev.filter(s => s.id !== sessionId));
      return { success: true };
    } catch (err) {
      console.error('Fehler beim Ablehnen:', err);
      return { success: false, error: err.message };
    }
  };

  const withdrawSwimSession = async (sessionId) => {
    try {
      await dsWithdrawSwimSession(sessionId);
      setSwimSessions(prev => prev.filter(s => s.id !== sessionId));
      setPendingSwimConfirmations(prev => prev.filter(s => s.id !== sessionId));
      return { success: true };
    } catch (err) {
      console.error('Fehler beim Zurueckziehen:', err);
      return { success: false, error: err.message };
    }
  };

  // Lade Schwimmdaten beim Start
  useEffect(() => {
    if (!authReady) return;
    if (user) {
      loadSwimSessions();
    } else {
      setSwimSessions([]);
      setPendingSwimConfirmations([]);
      setSwimSessionsLoaded(false);
      setCustomSwimTrainingPlans([]);
    }
  }, [authReady, user]);

  useEffect(() => {
    if (!user) {
      setSwimMonthlyResults([]);
      return;
    }
    if (!swimSessionsLoaded) return;

    let cancelled = false;
    const syncSwimMonthlyResults = async () => {
      const now = new Date();
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      await upsertSwimMonthlyResult(previousMonth);
      if (!cancelled) {
        if (swimSessions.length > 0) {
          // Compute monthly results client-side from swim sessions (no backend endpoint)
          const year = now.getFullYear();
          const results = [];
          for (let m = 0; m < now.getMonth(); m++) {
            const monthDate = new Date(year, m, 1);
            const payload = buildSwimMonthlyResultPayload(monthDate);
            if (payload && (payload.azubis_points > 0 || payload.trainer_points > 0)) {
              results.push(payload);
            }
          }
          if (!cancelled) setSwimMonthlyResults(results);
        } else {
          await loadSwimMonthlyResults(now.getFullYear());
        }
      }
    };

    void syncSwimMonthlyResults();
    return () => {
      cancelled = true;
    };
  }, [allUsers, loadSwimMonthlyResults, swimSessions, swimSessionsLoaded, upsertSwimMonthlyResult, user]);

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

  const openBerichtsheftDraftForCurrentWeek = () => {
    if (berichtsheftDraftSaveTimerRef.current) {
      clearTimeout(berichtsheftDraftSaveTimerRef.current);
      berichtsheftDraftSaveTimerRef.current = null;
    }
    if (berichtsheftRemoteDraftSaveTimerRef.current) {
      clearTimeout(berichtsheftRemoteDraftSaveTimerRef.current);
      berichtsheftRemoteDraftSaveTimerRef.current = null;
    }
    const currentWeek = getWeekStartStamp();
    loadBerichtsheftDraftForWeek(currentWeek, { resetIfMissing: true });
    setBerichtsheftViewMode('edit');
  };

  const resetBerichtsheftForm = () => {
    setCurrentWeekEntries(createEmptyBerichtsheftEntries());
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

  const normalizeBerichtsheftText = (value) => String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const toBerichtsheftTokens = (value) => normalizeBerichtsheftText(value)
    .split(' ')
    .filter(token => token.length >= 3);

  const getBerichtsheftYearWeeks = (bereich, year) => {
    const key = `jahr${year}`;
    const value = Number(bereich?.wochen?.[key]);
    return Number.isFinite(value) ? value : 0;
  };

  const getBerichtsheftBereichSuggestions = (taetigkeit, year) => {
    const taetigkeitTokens = toBerichtsheftTokens(taetigkeit);
    if (taetigkeitTokens.length === 0) return [];

    const scored = AUSBILDUNGSRAHMENPLAN.map((bereich) => {
      const keywordSet = new Set();
      [bereich.bereich, ...(bereich.inhalte || [])].forEach((text) => {
        toBerichtsheftTokens(text).forEach(token => keywordSet.add(token));
      });

      let matchCount = 0;
      taetigkeitTokens.forEach((token) => {
        if (keywordSet.has(token)) matchCount += 1;
      });

      const yearWeeks = getBerichtsheftYearWeeks(bereich, year);
      const score = (matchCount * 3) + (yearWeeks > 0 ? 1 : 0);

      return { bereich, score, matchCount, yearWeeks };
    })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
        if (b.yearWeeks !== a.yearWeeks) return b.yearWeeks - a.yearWeeks;
        return a.bereich.nr - b.bereich.nr;
      });

    return scored.filter(item => item.matchCount > 0).slice(0, 3);
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
    if (berichtsheftDraftSaveTimerRef.current) {
      clearTimeout(berichtsheftDraftSaveTimerRef.current);
      berichtsheftDraftSaveTimerRef.current = null;
    }
    if (berichtsheftRemoteDraftSaveTimerRef.current) {
      clearTimeout(berichtsheftRemoteDraftSaveTimerRef.current);
      berichtsheftRemoteDraftSaveTimerRef.current = null;
    }

    // Validierung
    const hasContent = Object.values(currentWeekEntries).some(day =>
      day.some(entry => entry.taetigkeit.trim() !== '')
    );

    if (!hasContent) {
      alert('Bitte mindestens eine Tätigkeit eintragen');
      return;
    }

    try {
      const existingServerDraft = (!selectedBerichtsheft && berichtsheftRemoteDraftsEnabled)
        ? await findBerichtsheftServerDraftByWeek(berichtsheftWeek)
        : null;
      const persistedEntry = selectedBerichtsheft || existingServerDraft;
      const targetUserName = persistedEntry?.user_name || user.name;
      const wasReadyForReview = Boolean(persistedEntry && isBerichtsheftReadyForReview(persistedEntry));
      const berichtsheftData = {
        user_name: targetUserName,
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
      if (berichtsheftRemoteDraftsEnabled) {
        berichtsheftData.status = 'submitted';
      }
      const isReadyForReviewNow = isBerichtsheftReadyForReview(berichtsheftData);

      if (persistedEntry) {
        berichtsheftData.assigned_trainer_id = persistedEntry.assigned_trainer_id || null;
        berichtsheftData.assigned_trainer_name = persistedEntry.assigned_trainer_name || null;
        berichtsheftData.assigned_by_id = persistedEntry.assigned_by_id || null;
        berichtsheftData.assigned_at = persistedEntry.assigned_at || null;

        await dsSaveBerichtsheft(berichtsheftData, persistedEntry.id);
        removeBerichtsheftServerDraft(berichtsheftWeek);
        showToast(selectedBerichtsheft ? 'Berichtsheft aktualisiert!' : 'Berichtsheft gespeichert!', 'success');
      } else {
        await dsSaveBerichtsheft(berichtsheftData);
        showToast('Berichtsheft gespeichert!', 'success');
        setBerichtsheftNr(prev => prev + 1);
      }

      if (isReadyForReviewNow && !wasReadyForReview) {
        await notifyBerichtsheftReadyForReview({
          azubiName: targetUserName,
          weekStart: berichtsheftWeek
        });
      }

      clearBerichtsheftDraft(berichtsheftWeek);
      await clearBerichtsheftDraftRemote(berichtsheftWeek);
      resetBerichtsheftForm();
      loadBerichtsheftEntries();
      loadBerichtsheftPendingSignatures();
      setBerichtsheftViewMode('list');
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      showToast(friendlyError(err), 'error');
    }
  };

  const loadBerichtsheftForEdit = (entry) => {
    setSelectedBerichtsheft(entry);
    setBerichtsheftWeek(entry.week_start);
    setBerichtsheftYear(entry.ausbildungsjahr);
    setBerichtsheftNr(entry.nachweis_nr);
    setCurrentWeekEntries(normalizeBerichtsheftEntries(entry.entries));
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
      await dsDeleteBerichtsheft(id);
      loadBerichtsheftEntries();
      loadBerichtsheftPendingSignatures();
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

        <div style="margin-bottom: 15px; page-break-inside: avoid;">
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

        <div style="margin-top: 20px; page-break-inside: avoid;">
          <strong>Für die Richtigkeit</strong>
          <div style="display: flex; gap: 40px; margin-top: 10px;">
            <div style="flex: 1;">
              <div style="margin-bottom: 5px;">Datum: ${entry.datum_azubi ? new Date(entry.datum_azubi).toLocaleDateString('de-DE') : '________________'}</div>
              ${entry.signatur_azubi
                ? `<img src="${entry.signatur_azubi}" style="max-height: 70px; max-width: 220px; display: block; margin: 8px 0;" />`
                : '<div style="height: 55px;"></div>'
              }
              <div style="border-top: 1px solid #333; padding-top: 4px; font-size: 10px; color: #333;">
                Unterschrift Auszubildende/r
              </div>
            </div>
            <div style="flex: 1;">
              <div style="margin-bottom: 5px;">Datum: ${entry.datum_ausbilder ? new Date(entry.datum_ausbilder).toLocaleDateString('de-DE') : '________________'}</div>
              ${entry.signatur_ausbilder
                ? `<img src="${entry.signatur_ausbilder}" style="max-height: 70px; max-width: 220px; display: block; margin: 8px 0;" />`
                : '<div style="height: 55px;"></div>'
              }
              <div style="border-top: 1px solid #333; padding-top: 4px; font-size: 10px; color: #333;">
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

  const loadFlashcards = (options = {}) => {
    const categoryId = options.categoryId || newQuestionCategory;
    const useKeywordMode = typeof options.useKeyword === 'boolean'
      ? options.useKeyword
      : keywordFlashcardMode;
    const useWhoAmIMode = typeof options.useWhoAmI === 'boolean'
      ? options.useWhoAmI
      : whoAmIFlashcardMode;

    const hardcodedCards = useWhoAmIMode
      ? (WHO_AM_I_FLASHCARD_CONTENT[categoryId] || [])
      : useKeywordMode
        ? (KEYWORD_FLASHCARD_CONTENT[categoryId] || [])
        : (FLASHCARD_CONTENT[categoryId] || []);
    const userCards = (useKeywordMode || useWhoAmIMode) ? [] : userFlashcards.filter(fc => fc.category === categoryId);
    const allCards = [...hardcodedCards, ...userCards];

    setFlashcards(allCards);
    setFlashcardIndex(0);
    setCurrentFlashcard(allCards[0] || null);
    setShowFlashcardAnswer(false);
    resetFlashcardKeywordState();
  };

  const evaluateFlashcardKeywordAnswer = () => {
    if (!currentFlashcard) return null;
    const trimmedInput = flashcardKeywordInput.trim();
    if (!trimmedInput) {
      showToast('Bitte gib zuerst deine Antwort ein.', 'error', 1800);
      return null;
    }
    let evaluation;
    if (isKeywordFlashcard(currentFlashcard) || currentFlashcard?.type === 'whoami') {
      evaluation = evaluateKeywordAnswer(currentFlashcard, trimmedInput);
    } else {
      const backText = String(currentFlashcard.back || '');
      const groups = autoExtractKeywordGroups(backText);
      const fakeQ = { keywordGroups: groups, minKeywordGroups: Math.max(1, Math.ceil(groups.length * 0.5)) };
      evaluation = evaluateKeywordAnswer(fakeQ, trimmedInput);
    }
    setFlashcardKeywordEvaluation(evaluation);
    return evaluation;
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
    updateWeeklyProgress('flashcards', 1);
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
      await dsApproveFlashcard(fcId);
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
      await dsDeleteFlashcard(fcId);
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
        await dsSaveBadges(newBadges, user.id, user.name);
      } catch (error) {
        console.error('Save badges error:', error);
      }
    }
  };


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

  // Save App Config (Admin UI Editor)
  const saveAppConfig = async () => {
    const hasOwnerAccount = allUsers.some((account) => Boolean(account?.is_owner));
    const canManageSecurity = Boolean(user?.isOwner) || (user?.role === 'admin' && !hasOwnerAccount);
    if (!canManageSecurity) {
      showToast('Nur der Hauptadmin kann die Konfiguration ändern.', 'warning');
      return;
    }

    try {
      await dsSaveAppConfig({
        menuItems: editingMenuItems,
        themeColors: editingThemeColors,
        featureFlags: appConfig.featureFlags,
        companies: appConfig.companies,
        announcement: appConfig.announcement
      });

      setAppConfig({
        menuItems: editingMenuItems,
        themeColors: editingThemeColors,
        featureFlags: appConfig.featureFlags,
        companies: appConfig.companies,
        announcement: appConfig.announcement
      });

      showToast('Konfiguration gespeichert.', 'success');
      playSound('splash');
    } catch (error) {
      console.error('Config save error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const saveAnnouncement = async (announcement) => {
    const updated = { ...appConfig, announcement };
    try {
      await dsSaveAppConfig({
        menuItems: appConfig.menuItems,
        themeColors: appConfig.themeColors,
        featureFlags: appConfig.featureFlags,
        companies: appConfig.companies,
        announcement
      });
      setAppConfig(updated);
      showToast(announcement.enabled ? 'Ankündigung aktiviert.' : 'Ankündigung deaktiviert.', 'success');
    } catch (error) {
      console.error('Announcement save error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const saveFeatureFlag = async (key, value) => {
    const nextFlags = { ...appConfig.featureFlags, [key]: value };
    const updated = { ...appConfig, featureFlags: nextFlags };
    try {
      await dsSaveAppConfig({
        menuItems: appConfig.menuItems,
        themeColors: appConfig.themeColors,
        featureFlags: nextFlags,
        companies: appConfig.companies,
        announcement: appConfig.announcement
      });
      setAppConfig(updated);
      showToast(value ? 'Wartungsmodus aktiviert.' : 'Wartungsmodus deaktiviert.', 'success');
    } catch (error) {
      console.error('Feature flag save error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const saveCompanies = async (newCompanies) => {
    const updated = { ...appConfig, companies: newCompanies };
    try {
      await dsSaveAppConfig({
        menuItems: appConfig.menuItems,
        themeColors: appConfig.themeColors,
        companies: newCompanies
      });
      setAppConfig(updated);
      showToast('Betriebe gespeichert.', 'success');
    } catch (error) {
      console.error('Companies save error:', error);
      showToast(friendlyError(error), 'error');
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

  // Update menu item group
  const updateMenuItemGroup = (itemId, newGroup) => {
    setEditingMenuItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, group: newGroup } : item
    ));
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
      alert('Fehler beim Löschen der Ankündigung');
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

  const swimCurrentMonthKey = getSwimMonthKey(new Date());
  const swimCurrentMonthLabel = new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }).toUpperCase();
  const swimCurrentMonthSessions = swimSessions.filter((session) => isDateInSwimMonth(session?.date, swimCurrentMonthKey));
  const swimCurrentMonthBattleStats = calculateTeamBattleStats(swimCurrentMonthSessions, {}, allUsers);
  const swimMonthlyDistanceRankingCurrentMonth = buildSwimmerDistanceRankingForMonth(swimCurrentMonthKey);
  const swimMonthlySwimmerCurrentMonth = swimMonthlyDistanceRankingCurrentMonth[0] || null;
  const swimYear = new Date().getFullYear();
  const swimYearlySwimmerRanking = Object.values(
    swimMonthlyResults.reduce((accumulator, entry) => {
      const swimmerName = String(entry?.swimmer_name || '').trim();
      if (!swimmerName) return accumulator;
      const swimmerId = String(entry?.swimmer_user_id || '').trim();
      const rankingKey = swimmerId || swimmerName.toLowerCase();
      if (!accumulator[rankingKey]) {
        accumulator[rankingKey] = {
          key: rankingKey,
          swimmer_user_id: swimmerId || null,
          swimmer_name: swimmerName,
          swimmer_role: entry?.swimmer_role || '',
          titles: 0,
          total_distance: 0,
          months: []
        };
      }
      accumulator[rankingKey].titles += 1;
      accumulator[rankingKey].total_distance += toSafeInt(entry?.swimmer_distance);
      accumulator[rankingKey].months.push(toSafeInt(entry?.month));
      return accumulator;
    }, {})
  ).sort((a, b) =>
    (b.titles - a.titles)
    || (b.total_distance - a.total_distance)
    || String(a.swimmer_name || '').localeCompare(String(b.swimmer_name || ''), 'de-DE')
  );

  // Login/Register/Impressum/Datenschutz – ausgelagert in LoginScreen
  if (!authReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
      }}>
        <div className="text-8xl mb-6 animate-bounce">🏊‍♂️</div>
        <h1 className="text-white text-2xl font-bold mb-2">Bäder-Azubi App</h1>
        <p className="text-white/70 text-sm mb-8">Wird geladen...</p>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-white/80 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
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

      {/* Inaktivitäts-Warnung */}
      {showInactivityWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 text-center">
            <div className="text-5xl mb-3">⏱️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Noch da?</h2>
            <p className="text-gray-600 mb-5 text-sm">
              Du wirst in <strong>2 Minuten</strong> automatisch abgemeldet.
            </p>
            <button
              onClick={() => window.dispatchEvent(new MouseEvent('mousemove'))}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              Aktiv bleiben
            </button>
          </div>
        </div>
      )}

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
              <button id="notification-bell" onClick={() => { setShowNotifications(!showNotifications); playSound('splash'); }} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors relative">
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
        {/* Admin Panel */}
        {currentView === 'admin' && user.permissions.canManageUsers && (
          <AdminView
            currentUserEmail={user.email}
            canManageRoles={Boolean(user.isOwner) || (user.role === 'admin' && !allUsers.some((account) => Boolean(account?.is_owner)))}
            canEditAppConfig={Boolean(user.isOwner) || (user.role === 'admin' && !allUsers.some((account) => Boolean(account?.is_owner)))}
            getAdminStats={getAdminStats}
            questionReports={questionReports}
            toggleQuestionReportStatus={toggleQuestionReportStatus}
            pendingUsers={pendingUsers}
            approveUser={approveUser}
            loadData={loadData}
            allUsers={allUsers}
            getDaysUntilDeletion={getDaysUntilDeletion}
            changeUserRole={changeUserRole}
            exportUserData={exportUserData}
            deleteUser={deleteUser}
            toggleSchoolCardPermission={toggleSchoolCardPermission}
            toggleSignReportsPermission={toggleSignReportsPermission}
            toggleExamGradesPermission={toggleExamGradesPermission}
            repairQuizStats={repairQuizStats}
            sendTestPush={sendTestPush}
            editingMenuItems={editingMenuItems}
            setEditingMenuItems={setEditingMenuItems}
            appConfig={appConfig}
            editingThemeColors={editingThemeColors}
            setEditingThemeColors={setEditingThemeColors}
            moveMenuItem={moveMenuItem}
            updateMenuItemIcon={updateMenuItemIcon}
            updateMenuItemLabel={updateMenuItemLabel}
            updateMenuItemGroup={updateMenuItemGroup}
            toggleMenuItemVisibility={toggleMenuItemVisibility}
            updateThemeColor={updateThemeColor}
            saveAppConfig={saveAppConfig}
            resetAppConfig={resetAppConfig}
            companies={appConfig.companies}
            saveCompanies={saveCompanies}
            announcement={appConfig.announcement}
            saveAnnouncement={saveAnnouncement}
            featureFlags={appConfig.featureFlags}
            saveFeatureFlag={saveFeatureFlag}
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
            activeGames={activeGames}
            acceptChallenge={acceptChallenge}
            continueGame={continueGameSafe}
            news={news}
            exams={exams}
            setExamSimulatorMode={setExamSimulatorMode}
            loadFlashcards={loadFlashcards}
            materials={materials}
            resources={resources}
            messages={messages}
            berichtsheftPendingSignatures={berichtsheftPendingSignatures}
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
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            allUsers={allUsers}
            activeGames={activeGames}
            challengePlayer={challengePlayer}
            acceptChallenge={acceptChallenge}
            continueGame={continueGameSafe}
            currentGame={currentGame}
            quizCategory={quizCategory}
            questionInCategory={questionInCategory}
            playerTurn={playerTurn}
            adaptiveLearningEnabled={adaptiveLearningEnabled}
            setAdaptiveLearningEnabled={setAdaptiveLearningEnabled}
            selectCategory={selectCategory}
            waitingForOpponent={waitingForOpponent}
            startCategoryAsSecondPlayer={resumeCategoryRound}
            currentQuestion={currentQuestion}
            timeLeft={timeLeft}
            answered={answered}
            selectedAnswers={selectedAnswers}
            lastSelectedAnswer={lastSelectedAnswer}
            isKeywordQuestion={isKeywordQuestion}
            isWhoAmIQuestion={isWhoAmIQuestion}
            keywordAnswerText={keywordAnswerText}
            setKeywordAnswerText={setKeywordAnswerText}
            keywordAnswerEvaluation={keywordAnswerEvaluation}
            submitKeywordAnswer={submitKeywordAnswer}
            quizMCKeywordMode={quizMCKeywordMode}
            setQuizMCKeywordMode={setQuizMCKeywordMode}
            answerQuestion={answerQuestion}
            reportQuestionIssue={reportQuestionIssue}
            confirmMultiSelectAnswer={confirmMultiSelectAnswer}
            proceedToNextRound={proceedToNextRound}
            userStats={userStats}
            duelResult={duelResult}
            setDuelResult={setDuelResult}
            categoryRoundResult={categoryRoundResult}
            proceedAfterCategoryResult={proceedAfterCategoryResult}
            onForfeit={handleForfeitDuel}
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
            deleteMessage={deleteChatMessage}
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
            reportQuestionIssue={reportQuestionIssue}
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
            allGames={allGames}
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
            addWeekEntry={addWeekEntry}
            assignBerichtsheftTrainer={assignBerichtsheftTrainer}
            azubiProfile={azubiProfile}
            berichtsheftBemerkungAusbilder={berichtsheftBemerkungAusbilder}
            berichtsheftBemerkungAzubi={berichtsheftBemerkungAzubi}
            berichtsheftDatumAusbilder={berichtsheftDatumAusbilder}
            berichtsheftDatumAzubi={berichtsheftDatumAzubi}
            berichtsheftEntries={berichtsheftEntries}
            berichtsheftNr={berichtsheftNr}
            berichtsheftPendingLoading={berichtsheftPendingLoading}
            berichtsheftPendingSignatures={berichtsheftPendingSignatures}
            berichtsheftSignaturAusbilder={berichtsheftSignaturAusbilder}
            berichtsheftSignaturAzubi={berichtsheftSignaturAzubi}
            berichtsheftViewMode={berichtsheftViewMode}
            berichtsheftWeek={berichtsheftWeek}
            berichtsheftYear={berichtsheftYear}
            canManageBerichtsheftSignatures={canManageBerichtsheftSignatures}
            calculateBereichProgress={calculateBereichProgress}
            calculateDayHours={calculateDayHours}
            calculateTotalHours={calculateTotalHours}
            currentWeekEntries={currentWeekEntries}
            deleteBerichtsheft={deleteBerichtsheft}
            generateBerichtsheftPDF={generateBerichtsheftPDF}
            getBerichtsheftBereichSuggestions={getBerichtsheftBereichSuggestions}
            getBerichtsheftYearWeeks={getBerichtsheftYearWeeks}
            getWeekEndDate={getWeekEndDate}
            loadBerichtsheftForEdit={loadBerichtsheftForEdit}
            openBerichtsheftDraftForCurrentWeek={openBerichtsheftDraftForCurrentWeek}
            removeWeekEntry={removeWeekEntry}
            resetBerichtsheftForm={resetBerichtsheftForm}
            saveAzubiProfile={saveAzubiProfile}
            saveBerichtsheft={saveBerichtsheft}
            selectedBerichtsheft={selectedBerichtsheft}
            setBerichtsheftBemerkungAusbilder={setBerichtsheftBemerkungAusbilder}
            setBerichtsheftBemerkungAzubi={setBerichtsheftBemerkungAzubi}
            setBerichtsheftDatumAusbilder={setBerichtsheftDatumAusbilder}
            setBerichtsheftDatumAzubi={setBerichtsheftDatumAzubi}
            setBerichtsheftNr={setBerichtsheftNr}
            setBerichtsheftSignaturAusbilder={setBerichtsheftSignaturAusbilder}
            setBerichtsheftSignaturAzubi={setBerichtsheftSignaturAzubi}
            setBerichtsheftViewMode={setBerichtsheftViewMode}
            setBerichtsheftWeek={handleBerichtsheftWeekChange}
            setBerichtsheftYear={setBerichtsheftYear}
            signAssignableUsers={allUsers.filter((account) => account.role === 'trainer' || account.role === 'admin')}
            updateWeekEntry={updateWeekEntry}
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
  );
}
