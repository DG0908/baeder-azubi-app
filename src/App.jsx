import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, MessageCircle, BookOpen, Bell, ClipboardList, Users, Plus, Send, Check, X, Upload, Download, Calendar, Award, Brain, Home, Target, TrendingUp, Zap, Star, Shield, Trash2, UserCog, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { supabase } from './supabase';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import LoginScreen from './components/auth/LoginScreen';
import ChatView from './components/views/ChatView';
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
import ImpressumView from './components/views/ImpressumView';
import DatenschutzView from './components/views/DatenschutzView';

import { CATEGORIES, DEFAULT_MENU_ITEMS, DEFAULT_THEME_COLORS, PERMISSIONS, DEMO_ACCOUNTS, AVATARS } from './data/constants';
import { POOL_CHEMICALS, PERIODIC_TABLE } from './data/chemistry';
import { AUSBILDUNGSRAHMENPLAN, WOCHEN_PRO_JAHR } from './data/ausbildungsrahmenplan';
import { DID_YOU_KNOW_FACTS, DAILY_WISDOM, SAFETY_SCENARIOS, WORK_SAFETY_TOPICS } from './data/content';
import { SAMPLE_QUESTIONS } from './data/quizQuestions';
import { KEYWORD_CHALLENGES, buildKeywordFlashcards } from './data/keywordChallenges';
import { SWIM_STYLES, SWIM_CHALLENGES, SWIM_LEVELS, SWIM_BADGES, SWIM_TRAINING_PLANS, getAgeHandicap, calculateHandicappedTime, calculateSwimPoints, calculateChallengeProgress, getSwimLevel, calculateTeamBattleStats } from './data/swimming';
import { PRACTICAL_EXAM_TYPES, PRACTICAL_SWIM_EXAMS, resolvePracticalDisciplineResult, toNumericGrade, formatGradeLabel, parseExamTimeToSeconds, formatSecondsAsTime } from './data/practicalExam';
import { PRACTICAL_CHECKLISTS } from './data/practicalChecklists';
import { shuffleAnswers } from './lib/utils';
import SignatureCanvas from './components/ui/SignatureCanvas';

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

  const sanitizeGoalValue = (value, fallback = 0) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(0, Math.round(parsed));
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

  const normalizeQuestionText = (value) => String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');

  const {
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
  const [waitingForOpponent, setWaitingForOpponent] = useState(false); // Warte auf anderen Spieler
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
      label: 'PAC fluessig (Aluminiumbasis)',
      base: 'aluminum',
      continuousDoseMlPerM3: 0.12,
      shockDoseMlPerM3: 0.22
    },
    {
      id: 'aluminum_sulfate_solution',
      label: 'Aluminiumsulfat-Loesung',
      base: 'aluminum',
      continuousDoseMlPerM3: 0.15,
      shockDoseMlPerM3: 0.28
    },
    {
      id: 'ferric_chloride_solution',
      label: 'Eisen-III-chlorid-Loesung',
      base: 'iron',
      continuousDoseMlPerM3: 0.09,
      shockDoseMlPerM3: 0.18
    },
    {
      id: 'ferric_sulfate_solution',
      label: 'Eisen-III-sulfat-Loesung',
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
          color: 'Gruen',
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
          color: 'Gruen',
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
      label: 'Natriumthiosulfat Loesung (38%)',
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
        practicalExam: toSafeInt(rawBreakdown.practicalExam),
        flashcardLearning: toSafeInt(rawBreakdown.flashcardLearning),
        flashcardCreation: toSafeInt(rawBreakdown.flashcardCreation),
        quizWins: toSafeInt(rawBreakdown.quizWins),
        swimTrainingPlans: toSafeInt(rawBreakdown.swimTrainingPlans)
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
  const [keywordFlashcardMode, setKeywordFlashcardMode] = useState(false);
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
  const [berichtsheftViewMode, setBerichtsheftViewMode] = useState('edit'); // 'edit', 'list', 'progress', 'profile', 'sign'
  const [berichtsheftPendingSignatures, setBerichtsheftPendingSignatures] = useState([]);
  const [berichtsheftPendingLoading, setBerichtsheftPendingLoading] = useState(false);

  // Schwimmchallenge State
  const [swimChallengeView, setSwimChallengeView] = useState('overview'); // 'overview', 'challenges', 'plans', 'add', 'leaderboard', 'battle'
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
    challengeId: '',
    trainingPlanId: ''
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

  const normalizeKeywordText = (value) => String(value || '')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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
        normalizedTerms: group.terms
          .map((term) => normalizeKeywordText(term))
          .filter(Boolean)
      }))
      .filter((group) => group.normalizedTerms.length > 0);
  };

  const isKeywordQuestion = (question) => {
    return Boolean(question?.type === 'keyword' && getKeywordGroupsFromQuestion(question).length > 0);
  };

  const evaluateKeywordAnswer = (question, answerInput) => {
    const groups = getKeywordGroupsFromQuestion(question);
    const normalizedAnswer = normalizeKeywordText(answerInput);
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
        matchedLabels: [],
        missingLabels: groups.map((group) => group.label),
        wordCount,
        requiredWordCount
      };
    }

    const matchedLabels = [];
    const missingLabels = [];
    groups.forEach((group) => {
      const matched = group.normalizedTerms.some((term) => normalizedAnswer.includes(term));
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

    return {
      isCorrect,
      hasContent: true,
      requiredGroups,
      matchedCount,
      scorePercent,
      matchedLabels,
      missingLabels,
      wordCount,
      requiredWordCount
    };
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

  const autoExtractKeywordGroups = (answerText) => {
    const GERMAN_STOPWORDS = new Set([
      'aber', 'alle', 'allem', 'allen', 'aller', 'alles', 'also', 'auch', 'auf', 'auss',
      'aus', 'ausserdem', 'bei', 'beim', 'bereits', 'dann', 'dabei', 'dadurch', 'damit',
      'darf', 'dass', 'dem', 'den', 'denen', 'denn', 'der', 'des', 'deshalb', 'dessen',
      'dies', 'diese', 'diesem', 'diesen', 'dieser', 'dieses', 'doch', 'dort', 'durch',
      'eine', 'einem', 'einen', 'einer', 'eines', 'erst', 'etwas', 'falls', 'fuer',
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
      groups.push({ label: word, terms: [word] });
    }
    return groups;
  };

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
    ]
  };
  const KEYWORD_FLASHCARD_CONTENT = buildKeywordFlashcards(KEYWORD_CHALLENGES);

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
    if (user) {
      loadData();
      loadNotifications();
      loadTheoryExamHistory();
      const interval = setInterval(() => {
        loadData();
        loadNotifications();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

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
      if (canManageBerichtsheftSignatures) {
        loadBerichtsheftPendingSignatures();
      } else {
        setBerichtsheftPendingSignatures([]);
      }

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

  }, [currentView, user, canManageBerichtsheftSignatures]);

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
          explanation: `Aktueller Wert ${currentChlorine.toFixed(2).replace('.', ',')} mg/L liegt bereits auf/ueber Ziel ${targetChlorine.toFixed(2).replace('.', ',')} mg/L.`,
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
          details: `Produkt: ${product.label}. Aktivchlor-Bedarf: ${activeChlorineKg.toFixed(3).replace('.', ',')} kg. Gesamtmenge Produkt: ${productLiters !== null ? `${productLiters.toFixed(3).replace('.', ',')} L` : `${productMassKg.toFixed(3).replace('.', ',')} kg`} fuer ${plantRunHours.toFixed(1).replace('.', ',')} h Anlagenlaufzeit.`,
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
      recommendation: `${antichlorLiters !== null ? `${antichlorLiters.toFixed(3).replace('.', ',')} L` : `${antichlorMassKg.toFixed(3).replace('.', ',')} kg`} Anti-Chlor in 2-3 Teilgaben dosieren, gut umwaelzen und nach 15-30 min erneut messen.`
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
      explanation: `${ratioText} fuer ${roundedContainerCount} Behaelter a ${containerSize.toString().replace('.', ',')} ${containerUnit === 'l' ? 'L' : 'ml'}. ${modeText}.`,
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
      recommendation = `Pumpenmodell oder Kapazitaet fehlt. Zielzufuhr: ${(stockSolutionMlH / 1000).toFixed(3).replace('.', ',')} L/h Dosierloesung.`;
    } else if (modelCapacityInfo.settingPercent > 100) {
      recommendation = `Pumpe zu klein: benoetigt ${(stockSolutionMlH / 1000).toFixed(3).replace('.', ',')} L/h, Modell schafft ${(maxMlH / 1000).toFixed(3).replace('.', ',')} L/h.`;
    } else if (modelCapacityInfo.minPercent > 0 && modelCapacityInfo.settingPercent < modelCapacityInfo.minPercent) {
      recommendation = `Pumpe laeuft unter Mindestbereich. Stellwert waere ${modelCapacityInfo.settingPercent.toFixed(1).replace('.', ',')}%. Groessere Verduennung oder kleineres Modell nutzen.`;
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
      explanation: `${product.label} (${product.base === 'aluminum' ? 'Aluminiumbasis' : 'Eisenbasis'}) bei ${circulationFlow.toFixed(1).replace('.', ',')} m3/h Umwaelzung. Berechnung fuer ${flocculationMode === 'shock' ? 'Stoss' : 'kontinuierliche'} Flockung.`,
      details: `Produktbedarf: ${(pureProductMlH / 1000).toFixed(3).replace('.', ',')} L/h bzw. ${(pureProductMlDay / 1000).toFixed(2).replace('.', ',')} L/Tag. | Dosierloesung: ${(stockSolutionMlDay / 1000).toFixed(2).replace('.', ',')} L/Tag bei ${stockConcentrationPercent.toFixed(1).replace('.', ',')}% Ansatz. | Modell: ${modelText}${hosePressureText}. | Becken-Umwaelzungen/Tag: ${turnoversPerDay.toFixed(2).replace('.', ',')}. | Ansatz fuer ${stockTankLiters.toFixed(1).replace('.', ',')} L: ${tankProductLiters.toFixed(2).replace('.', ',')} L Produkt + ${tankWaterLiters.toFixed(2).replace('.', ',')} L Wasser. | Tankreichweite: ${tankRuntimeHours ? `${tankRuntimeHours.toFixed(1).replace('.', ',')} h` : '-'}.`,
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

      // Load reported question feedback (if table exists)
      if (user?.permissions?.canManageUsers) {
        try {
          const { data: reportsData, error: reportsError } = await supabase
            .from('question_reports')
            .select('*')
            .order('created_at', { ascending: false });

          if (!reportsError && Array.isArray(reportsData)) {
            const remoteReports = reportsData.map((row) => {
              const questionText = String(row.question_text || row.question || '').trim();
              const category = String(row.category || 'unknown');
              return {
                id: row.id ? String(row.id) : `remote-${Date.parse(row.created_at || '') || Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                questionKey: String(
                  row.question_key
                  || getQuestionPerformanceKey({ q: questionText, category }, category)
                ),
                questionText,
                category,
                source: String(row.source || 'unknown'),
                note: String(row.note || ''),
                answers: Array.isArray(row.answers) ? row.answers : [],
                reportedBy: String(row.reported_by || row.user_name || 'Unbekannt'),
                reportedById: row.reported_by_id || null,
                status: String(row.status || 'open'),
                createdAt: row.created_at || new Date().toISOString()
              };
            });

            const localReports = parseJsonSafe(localStorage.getItem(QUESTION_REPORTS_STORAGE_KEY), []);
            const safeLocalReports = Array.isArray(localReports) ? localReports : [];
            const merged = [...remoteReports];
            const seen = new Set(remoteReports.map((entry) => `${entry.questionKey}|${entry.createdAt}|${entry.reportedBy}`));
            safeLocalReports.forEach((entry) => {
              const dedupeKey = `${entry.questionKey}|${entry.createdAt}|${entry.reportedBy}`;
              if (seen.has(dedupeKey)) return;
              seen.add(dedupeKey);
              merged.push(entry);
            });
            setQuestionReports(merged.slice(0, 500));
          }
        } catch (error) {
          console.log('question_reports load skipped');
        }
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
      setQuizCategory(null);
      setCurrentQuestion(null);
      setCurrentCategoryQuestions([]);
      setAnswered(false);
      setSelectedAnswers([]);
      setLastSelectedAnswer(null);
      setTimerActive(false);
      resetQuizKeywordState();
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
    setCurrentQuestion(null);
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
        const currentStats = await getUserStatsFromSupabase(targetUserName);
        const baseStats = ensureUserStatsStructure(currentStats || createEmptyUserStats());
        const { stats: xpUpdatedStats, addedXp } = addXpToStats(baseStats, sourceKey, xpAmount, eventKey);
        if (addedXp <= 0) {
          return 0;
        }

        await saveUserStatsToSupabase(targetUserName, xpUpdatedStats);
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
      const { error } = await supabase
        .from('question_reports')
        .insert([{
          question_key: payload.questionKey,
          question_text: payload.questionText,
          category: payload.category,
          source: payload.source,
          note: payload.note || null,
          answers: payload.answers,
          reported_by: payload.reportedBy,
          reported_by_id: payload.reportedById,
          status: payload.status
        }]);
      if (!error) {
        savedRemotely = true;
      }
    } catch (error) {
      console.log('question_reports table unavailable, fallback local only');
    }

    setQuestionReports((prev) => [payload, ...prev].slice(0, 500));
    showToast(
      savedRemotely
        ? 'Frage gemeldet. Danke fuer dein Feedback!'
        : 'Frage lokal gemeldet. Danke fuer dein Feedback!',
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
        await supabase
          .from('question_reports')
          .update({ status: nextStatus })
          .eq('id', reportId);
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
    if (useKeywordQuestions && categoryKeywordQuestions.length === 0) {
      showToast('Für diese Kategorie sind noch keine Extra-schwer-Fragen hinterlegt. Standardfragen werden genutzt.', 'info');
    }
    const selectedQuestions = pickLearningQuestions(
      allQuestions,
      Math.min(5, allQuestions.length),
      () => catId
    );

    // Mische Antworten nur bei Auswahlfragen
    const preparedQuestions = selectedQuestions.map((question) => {
      if (isKeywordQuestion(question)) {
        return { ...question, category: catId };
      }
      return { ...shuffleAnswers(question), category: catId };
    });

    // Speichere die Fragen im Game für beide Spieler
    if (!currentGame.categoryRounds) currentGame.categoryRounds = [];
    currentGame.categoryRounds.push({
      categoryId: catId,
      categoryName: CATEGORIES.find(c => c.id === catId)?.name || catId,
      questions: preparedQuestions,
      player1Answers: [], // Antworten von Spieler 1
      player2Answers: [], // Antworten von Spieler 2
      chooser: user.name  // Wer hat die Kategorie gewählt
    });

    setCurrentCategoryQuestions(preparedQuestions);
    setQuestionInCategory(0);
    setCurrentQuestion(preparedQuestions[0]);
    setAnswered(false);
    setSelectedAnswers([]); // Reset für Multi-Select
    setLastSelectedAnswer(null); // Reset für Single-Choice

    const timeLimit = DIFFICULTY_SETTINGS[currentGame.difficulty]?.time || 30;
    setTimeLeft(timeLimit);
    setTimerActive(true);

    await saveGameToSupabase(currentGame);
  };

  const handleTimeUp = async () => {
    if (answered || !currentGame) return;
    setAnswered(true);
    setTimerActive(false);

    if (isKeywordQuestion(currentQuestion) && keywordAnswerText.trim()) {
      const timedOutEvaluation = evaluateKeywordAnswer(currentQuestion, keywordAnswerText);
      setKeywordAnswerEvaluation({
        ...timedOutEvaluation,
        isCorrect: false,
        timedOut: true
      });
    }

    // Speichere falsche Antwort (Timeout)
    await savePlayerAnswer(false, true, {
      answerType: isKeywordQuestion(currentQuestion) ? 'keyword' : 'choice',
      keywordText: isKeywordQuestion(currentQuestion) ? keywordAnswerText.trim() : null
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
    if (answered || !currentGame || !currentQuestion.multi) return;
    setAnswered(true);
    setTimerActive(false);

    // Prüfe ob alle richtigen Antworten ausgewählt wurden (und keine falschen)
    const correctAnswers = currentQuestion.correct;
    const isCorrect =
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every(idx => correctAnswers.includes(idx));

    await savePlayerAnswer(isCorrect, false, {
      answerType: 'multi',
      selectedAnswers: [...selectedAnswers]
    });
  };

  const answerQuestion = async (answerIndex) => {
    if (answered || !currentGame) return;
    if (isKeywordQuestion(currentQuestion)) return;

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
    await savePlayerAnswer(isCorrect, false, {
      answerType: 'single',
      selectedAnswer: answerIndex
    });
  };

  const submitKeywordAnswer = async () => {
    if (answered || !currentGame || !currentQuestion) return;
    if (!isKeywordQuestion(currentQuestion) && !quizMCKeywordMode) return;
    const trimmedAnswer = keywordAnswerText.trim();
    if (!trimmedAnswer) {
      showToast('Bitte gib zuerst eine Freitext-Antwort ein.', 'error', 1800);
      return;
    }
    let evaluation;
    if (isKeywordQuestion(currentQuestion)) {
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
    setAnswered(true);
    setTimerActive(false);
    await savePlayerAnswer(evaluation.isCorrect, false, {
      answerType: 'keyword',
      keywordText: trimmedAnswer,
      keywordEvaluation: {
        requiredGroups: evaluation.requiredGroups,
        matchedCount: evaluation.matchedCount,
        matchedLabels: evaluation.matchedLabels,
        missingLabels: evaluation.missingLabels,
        scorePercent: evaluation.scorePercent
      }
    });
  };

  // Speichert die Antwort des aktuellen Spielers
  const savePlayerAnswer = async (isCorrect, isTimeout, answerMeta = {}) => {
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
    updateWeeklyProgress('quizAnswers', 1);
    trackQuestionPerformance(currentQuestion, quizCategory, isCorrect);

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
      timeout: isTimeout,
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
      resetQuizKeywordState();

      const timeLimit = DIFFICULTY_SETTINGS[currentGame.difficulty]?.time || 30;
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
    resetQuizKeywordState();

    const timeLimit = DIFFICULTY_SETTINGS[currentGame.difficulty]?.time || 30;
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
      resetQuizKeywordState();

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
    const selectedQuestions = pickLearningQuestions(
      allQuestions,
      Math.min(30, allQuestions.length),
      (question) => question.category
    );
    // Mische die Antworten jeder Frage, damit die richtige Antwort nicht immer an der gleichen Stelle ist
    const examQuestions = selectedQuestions.map(q => shuffleAnswers(q));
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

  const deletePracticalExamAttempt = async (attemptId) => {
    if (!attemptId) return;
    // Remove from local state immediately
    setPracticalExamHistory(prev => prev.filter(entry => entry.id !== attemptId));
    // Remove from localStorage
    const existingLocal = loadLocalPracticalAttempts();
    saveLocalPracticalAttempts(existingLocal.filter(entry => entry.id !== attemptId));
    // Try to remove from Supabase
    try {
      await supabase.from('practical_exam_attempts').delete().eq('id', attemptId);
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
    const newAnswers = [...examSimulator.answers, { question: examCurrentQuestion, selectedAnswer: -1, correct: isCorrect, answerType: 'keyword' }];
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
      void saveTheoryExamAttempt(examProgress);
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
    setExamKeywordInput('');
    setExamKeywordEvaluation(null);
  };

  const saveTheoryExamAttempt = async (progress) => {
    if (!user?.id) return;
    try {
      await supabase.from('theory_exam_attempts').insert([{
        user_id: user.id,
        user_name: user.name,
        correct: progress.correct,
        total: progress.total,
        percentage: progress.percentage,
        passed: progress.passed,
        time_ms: progress.timeMs,
        keyword_mode: examKeywordMode,
      }]);
    } catch (e) {
      console.warn('Fehler beim Speichern des Prüfungsergebnisses:', e);
    }
  };

  const loadTheoryExamHistory = async () => {
    if (!user?.id) return;
    setTheoryExamHistoryLoading(true);
    try {
      let query = supabase.from('theory_exam_attempts').select('*').order('created_at', { ascending: false });
      if (!user.permissions?.canViewAllStats) {
        query = query.eq('user_id', user.id);
      }
      const { data } = await query;
      setTheoryExamHistory(data || []);
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

  const isSignedByAzubi = (entry) => Boolean(String(entry?.signatur_azubi || '').trim());
  const isSignedByAusbilder = (entry) => Boolean(String(entry?.signatur_ausbilder || '').trim());
  const hasEntryContent = (entry) => {
    if (!entry || !entry.entries || typeof entry.entries !== 'object') return false;
    return Object.values(entry.entries).some((dayRows) => Array.isArray(dayRows)
      && dayRows.some((row) => String(row?.taetigkeit || '').trim() !== ''));
  };

  const loadBerichtsheftPendingSignatures = async () => {
    if (!user || !canManageBerichtsheftSignatures) {
      setBerichtsheftPendingSignatures([]);
      return;
    }

    setBerichtsheftPendingLoading(true);
    try {
      const { data, error } = await supabase
        .from('berichtsheft')
        .select('*')
        .order('week_start', { ascending: false });

      if (error) throw error;

      const allEntries = Array.isArray(data) ? data : [];
      let pending = allEntries.filter((entry) =>
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
        assigned_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('berichtsheft')
        .update(payload)
        .eq('id', entryId);

      if (error) throw error;

      setBerichtsheftPendingSignatures((prev) => prev.map((entry) => (
        entry.id === entryId
          ? { ...entry, ...payload }
          : entry
      )));
      showToast(`Berichtsheft wurde ${trainer.name} zugewiesen.`, 'success');
    } catch (err) {
      console.error('Fehler beim Zuweisen des Berichtshefts:', err);
      showToast('Zuweisung fehlgeschlagen. Bitte Supabase-Migration prüfen.', 'error');
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

  const SWIM_PLAN_NOTE_TAG_PREFIX = '[SWIM_PLAN:';
  const SWIM_PLAN_NOTE_TAG_REGEX = /\[SWIM_PLAN:([a-z0-9_-]+)\]/i;

  const extractSwimTrainingPlanIdFromNotes = (notesInput) => {
    const notes = String(notesInput || '');
    const match = notes.match(SWIM_PLAN_NOTE_TAG_REGEX);
    return match?.[1] || null;
  };

  const stripSwimTrainingPlanTagFromNotes = (notesInput) => {
    const notes = String(notesInput || '');
    return notes
      .replace(/\s*\[SWIM_PLAN:[^\]]+\]\s*/gi, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  const encodeSwimTrainingPlanInNotes = (notesInput, trainingPlanIdInput) => {
    const cleanedNotes = stripSwimTrainingPlanTagFromNotes(notesInput);
    const trainingPlanId = String(trainingPlanIdInput || '').trim();
    if (!trainingPlanId) {
      return cleanedNotes;
    }
    return cleanedNotes
      ? `${cleanedNotes}\n${SWIM_PLAN_NOTE_TAG_PREFIX}${trainingPlanId}]`
      : `${SWIM_PLAN_NOTE_TAG_PREFIX}${trainingPlanId}]`;
  };

  const doesSessionFulfillTrainingPlan = (sessionInput, planInput) => {
    if (!sessionInput || !planInput) return false;

    const distance = Number(sessionInput.distance || 0);
    const timeMinutes = Number(sessionInput.time_minutes || 0);
    const styleId = String(sessionInput.style || '');

    if (!Number.isFinite(distance) || !Number.isFinite(timeMinutes) || distance <= 0 || timeMinutes <= 0) {
      return false;
    }

    const targetDistance = Number(planInput.targetDistance || 0);
    const targetTime = Number(planInput.targetTime || 0);
    if (!Number.isFinite(targetDistance) || !Number.isFinite(targetTime) || targetDistance <= 0 || targetTime <= 0) {
      return false;
    }

    const styleMatches = !planInput.styleId || String(planInput.styleId) === styleId;
    if (!styleMatches) return false;

    return distance >= targetDistance && timeMinutes <= targetTime;
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
        notes: encodeSwimTrainingPlanInNotes(sessionData.notes, sessionData.trainingPlanId),
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
      const sessionToConfirm = swimSessions.find(s => s.id === sessionId) || null;

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

      if (sessionToConfirm?.user_id && sessionToConfirm?.user_name) {
        const trainingPlanId = extractSwimTrainingPlanIdFromNotes(sessionToConfirm.notes);
        if (trainingPlanId) {
          const trainingPlan = SWIM_TRAINING_PLANS.find(plan => plan.id === trainingPlanId) || null;
          if (trainingPlan && doesSessionFulfillTrainingPlan(sessionToConfirm, trainingPlan)) {
            const xpAmount = toSafeInt(trainingPlan.xpReward);
            if (xpAmount > 0) {
              void queueXpAwardForUser(
                { id: sessionToConfirm.user_id, name: sessionToConfirm.user_name },
                'swimTrainingPlans',
                xpAmount,
                {
                  eventKey: `swim_training_plan_${trainingPlan.id}_${sessionId}`,
                  reason: `Trainingsplan erfuellt: ${trainingPlan.name}`,
                  showXpToast: true
                }
              );
            }
          }
        }
      }

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
    // Validierung
    const hasContent = Object.values(currentWeekEntries).some(day =>
      day.some(entry => entry.taetigkeit.trim() !== '')
    );

    if (!hasContent) {
      alert('Bitte mindestens eine Tätigkeit eintragen');
      return;
    }

    try {
      const targetUserName = selectedBerichtsheft?.user_name || user.name;
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

      if (selectedBerichtsheft) {
        berichtsheftData.assigned_trainer_id = selectedBerichtsheft.assigned_trainer_id || null;
        berichtsheftData.assigned_trainer_name = selectedBerichtsheft.assigned_trainer_name || null;
        berichtsheftData.assigned_by_id = selectedBerichtsheft.assigned_by_id || null;
        berichtsheftData.assigned_at = selectedBerichtsheft.assigned_at || null;

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
      loadBerichtsheftPendingSignatures();
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

  const loadFlashcards = (options = {}) => {
    const categoryId = options.categoryId || newQuestionCategory;
    const useKeywordMode = typeof options.useKeyword === 'boolean'
      ? options.useKeyword
      : keywordFlashcardMode;

    const hardcodedCards = useKeywordMode
      ? (KEYWORD_FLASHCARD_CONTENT[categoryId] || [])
      : (FLASHCARD_CONTENT[categoryId] || []);
    const userCards = useKeywordMode ? [] : userFlashcards.filter(fc => fc.category === categoryId);
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
    if (isKeywordFlashcard(currentFlashcard)) {
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

  // Login/Register/Impressum/Datenschutz – ausgelagert in LoginScreen
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
              onClick={handleLogout}
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
          <AdminView
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
            editingMenuItems={editingMenuItems}
            setEditingMenuItems={setEditingMenuItems}
            appConfig={appConfig}
            editingThemeColors={editingThemeColors}
            setEditingThemeColors={setEditingThemeColors}
            moveMenuItem={moveMenuItem}
            updateMenuItemIcon={updateMenuItemIcon}
            updateMenuItemLabel={updateMenuItemLabel}
            toggleMenuItemVisibility={toggleMenuItemVisibility}
            updateThemeColor={updateThemeColor}
            saveAppConfig={saveAppConfig}
            resetAppConfig={resetAppConfig}
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
            continueGame={continueGame}
            news={news}
            exams={exams}
            setExamSimulatorMode={setExamSimulatorMode}
            loadFlashcards={loadFlashcards}
            materials={materials}
            resources={resources}
            messages={messages}
          />
        )}

        {/* Quiz View */}
        {currentView === 'quiz' && (
          <QuizView
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            allUsers={allUsers}
            activeGames={activeGames}
            challengePlayer={challengePlayer}
            currentGame={currentGame}
            quizCategory={quizCategory}
            questionInCategory={questionInCategory}
            playerTurn={playerTurn}
            adaptiveLearningEnabled={adaptiveLearningEnabled}
            setAdaptiveLearningEnabled={setAdaptiveLearningEnabled}
            selectCategory={selectCategory}
            waitingForOpponent={waitingForOpponent}
            startCategoryAsSecondPlayer={startCategoryAsSecondPlayer}
            currentQuestion={currentQuestion}
            timeLeft={timeLeft}
            answered={answered}
            selectedAnswers={selectedAnswers}
            lastSelectedAnswer={lastSelectedAnswer}
            isKeywordQuestion={isKeywordQuestion}
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
          />
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
            getChecklistProgressStats={getChecklistProgressStats}
            isChecklistItemCompleted={isChecklistItemCompleted}
            toggleChecklistItem={toggleChecklistItem}
          />
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
            keywordFlashcardMode={keywordFlashcardMode}
            setKeywordFlashcardMode={setKeywordFlashcardMode}
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
            SWIM_TRAINING_PLANS={SWIM_TRAINING_PLANS}
            SWIM_STYLES={SWIM_STYLES}
            activeSwimChallenges={activeSwimChallenges}
            allUsers={allUsers}
            calculateChallengeProgress={calculateChallengeProgress}
            calculateSwimPoints={calculateSwimPoints}
            calculateTeamBattleStats={calculateTeamBattleStats}
            confirmSwimSession={confirmSwimSession}
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
            swimDuelForm={swimDuelForm}
            swimSessionForm={swimSessionForm}
            swimSessions={swimSessions}
            toSafeInt={toSafeInt}
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
            setBerichtsheftWeek={setBerichtsheftWeek}
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

      </div>
    </div>
  );
}
