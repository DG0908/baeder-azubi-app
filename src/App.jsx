import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import toast from 'react-hot-toast';
import { Trophy, MessageCircle, BookOpen, ClipboardList, Users, Plus, Send, Check, X, Upload, Download, Calendar, Award, Brain, Home, Target, TrendingUp, Zap, Star, Shield, Trash2, UserCog, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
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
import { useSchoolAttendance } from './hooks/useSchoolAttendance';
import { useExamGrades } from './hooks/useExamGrades';
import { useDailyChallenges } from './hooks/useDailyChallenges';
import { useExamSimulator } from './hooks/useExamSimulator';
import { usePracticalExam, canUseRowForSpeedRanking, getPracticalRowSeconds } from './hooks/usePracticalExam';
import { useBadges } from './hooks/useBadges';
import { useWeeklyGoals, sanitizeGoalValue, getWeekStartStamp, buildEmptyWeeklyProgress } from './hooks/useWeeklyGoals';
import { useQuestionPerformance } from './hooks/useQuestionPerformance';
import {
  FLOCCULANT_PRODUCTS,
  FLOCCULANT_PUMP_TYPES,
  FLOCCULANT_PUMP_MODELS,
  CHLORINATION_PRODUCTS,
  ANTICHLOR_PRODUCTS,
} from './data/poolChemistry';
import { createContentModerator } from './lib/contentModeration';
import { computeLeaderboard } from './lib/leaderboard';
import { loadAppData, refreshLightData } from './lib/loadAppData';
import { parseJsonSafe } from './lib/jsonUtils';
import { useXpQueue } from './hooks/useXpQueue';
import { useContentAdmin } from './hooks/useContentAdmin';
import { useCalculator } from './hooks/useCalculator';
import { useDailyWisdom } from './hooks/useDailyWisdom';
import { useQuestionSubmission } from './hooks/useQuestionSubmission';
import HomeView from './components/views/HomeView';
import QuizView from './components/views/QuizView';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import AvatarBadge from './components/ui/AvatarBadge';
import { LiveTickerBanner } from './components/ui/LiveTickerBanner';
import { OfflineBanner, InstallBanner, CookieNotice } from './components/ui/AppBanners';
import { ToastStack } from './components/ui/ToastStack';
import { AppBackground } from './components/ui/AppBackground';
import { AppHeader } from './components/ui/AppHeader';
import { NotificationsDropdown } from './components/ui/NotificationsDropdown';
import { DesktopSidebar } from './components/ui/DesktopSidebar';

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

import { CATEGORIES, DEFAULT_MENU_ITEMS, DEFAULT_THEME_COLORS, PERMISSIONS, MENU_GROUP_LABELS } from './data/constants';
import { POOL_CHEMICALS, PERIODIC_TABLE } from './data/chemistry';
import { SAFETY_SCENARIOS, WORK_SAFETY_TOPICS } from './data/content';
import { SAMPLE_QUESTIONS } from './data/quizQuestions';
// Flashcard-Builder + KEYWORD_CHALLENGES / WHO_AM_I_* werden jetzt im useFlashcards Hook genutzt
import { SWIM_STYLES, SWIM_CHALLENGES, SWIM_LEVELS, getAgeHandicap, calculateHandicappedTime, calculateSwimPoints, calculateChallengeProgress, getSwimLevel, calculateTeamBattleStats } from './data/swimming';
import {
  getAuthorizedReviewers as dsGetAuthorizedReviewers,
} from './lib/dataService';
import { runDataRetentionCheck } from './lib/dataRetention';
import {
  toSafeInt, getFirstSafeInt,
  namesMatch, isFinishedGameStatus,
  shuffleArray,
  DIFFICULTY_SETTINGS, DEFAULT_CHALLENGE_TIMEOUT_MINUTES,
  parseTimestampSafe, getChallengeTimeoutMs,
  getWaitingChallengeRemainingMs, isWaitingChallengeExpired,
  formatDurationMinutesCompact,
  XP_META_KEY, XP_BREAKDOWN_DEFAULT, XP_REWARDS,
  getResolvedGameScores, resolveFinishedGameWinner,
  hasRecordedRoundAnswers,
  buildHeadToHeadFromFinishedGames,
  mergeOpponentStatsByMax,
  getTotalXpFromStats,
  deductXpFromStats,
  normalizeKeywordText, getWordVariants,
  isKeywordQuestion, isWhoAmIQuestion,
  getQuizTimeLimit, cloneDuelGameSnapshot,
} from './lib/quizHelpers';

export default function BaederApp() {
  const QUESTION_REPORTS_STORAGE_KEY = 'question_reports_v1';

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
  

  // Other State
  const [userStats, setUserStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // Exam Simulator State + Funktionen: useExamSimulator Hook (nach Stats-Setup)
  // Praktische Prüfung: State + Funktionen via usePracticalExam Hook (nach queueXpAwardForUser)

  // UI State – darkMode, soundEnabled, toasts, showToast, playSound vom AppContext
  const { darkMode, setDarkMode, soundEnabled, setSoundEnabled, toasts, setToasts, showToast, playSound } = useApp();

  const { dailyWisdom, rotateGeneralKnowledge } = useDailyWisdom({ user, showToast });

  // Weekly Goals & Progress: useWeeklyGoals Hook
  const {
    weeklyGoals,
    setWeeklyGoals,
    weeklyProgress,
    setWeeklyProgress,
    updateWeeklyProgress,
  } = useWeeklyGoals({ user, currentView, showToast });

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

  // Question Performance + Adaptive Learning: useQuestionPerformance Hook
  const {
    questionPerformance,
    adaptiveLearningEnabled, setAdaptiveLearningEnabled,
    trackQuestionPerformance,
  } = useQuestionPerformance();

  const [questionReports, setQuestionReports] = useState(() => {
    const parsed = parseJsonSafe(localStorage.getItem(QUESTION_REPORTS_STORAGE_KEY), []);
    return Array.isArray(parsed) ? parsed : [];
  });

  // Kontrollkarte Berufsschule + Klasuren: useSchoolAttendance + useExamGrades Hooks
  // Swim state lives in useSwimChallenge hook

  // Calculator State
  const {
    calculatorType, setCalculatorType,
    calculatorInputs, setCalculatorInputs,
    calculatorResult, setCalculatorResult,
    handleCalculation,
  } = useCalculator({ playSound });
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  // Profil-Bearbeitung State: vollständig in ProfileView ausgelagert


  // Track last visited view for "Weiter machen" shortcut on Home
  useEffect(() => {
    if (currentView && currentView !== 'home') {
      localStorage.setItem('lastView', currentView);
    }
  }, [currentView]);

  const moderateContent = createContentModerator({ toast, playSound });

  const {
    submittedQuestions, setSubmittedQuestions,
    newQuestionText, setNewQuestionText,
    newQuestionCategory, setNewQuestionCategory,
    newQuestionAnswers, setNewQuestionAnswers,
    newQuestionCorrect, setNewQuestionCorrect,
    submitQuestion, approveQuestion,
  } = useQuestionSubmission({ user, moderateContent, showToast });

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

  const {
    materials, setMaterials,
    materialTitle, setMaterialTitle,
    materialCategory, setMaterialCategory,
    addMaterial,
    resources, setResources,
    resourceTitle, setResourceTitle,
    resourceUrl, setResourceUrl,
    resourceType, setResourceType,
    resourceDescription, setResourceDescription,
    addResource, deleteResource,
    news, setNews,
    newsTitle, setNewsTitle,
    newsContent, setNewsContent,
    addNews, deleteNews,
    exams, setExams,
    examTitle, setExamTitle,
    examDate, setExamDate,
    examTopics, setExamTopics,
    addExam, deleteExam,
  } = useContentAdmin({
    user,
    showToast,
    playSound,
    moderateContent,
    sendNotificationToApprovedUsers,
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

  // Kontrollkarte Berufsschule: useSchoolAttendance Hook
  const {
    schoolAttendance, setSchoolAttendance,
    newAttendanceDate, setNewAttendanceDate,
    newAttendanceStart, setNewAttendanceStart,
    newAttendanceEnd, setNewAttendanceEnd,
    newAttendanceTeacherSig, setNewAttendanceTeacherSig,
    newAttendanceTrainerSig, setNewAttendanceTrainerSig,
    signatureModal, setSignatureModal,
    tempSignature, setTempSignature,
    selectedSchoolCardUser, setSelectedSchoolCardUser,
    allAzubisForSchoolCard,
    canViewAllSchoolCards,
    loadAzubisForSchoolCard,
    loadSchoolAttendance,
    addSchoolAttendance,
    updateAttendanceSignature,
    deleteSchoolAttendance,
  } = useSchoolAttendance({ user, showToast, sendNotification });

  // Klasuren: useExamGrades Hook
  const {
    examGrades, setExamGrades,
    selectedExamGradesUser, setSelectedExamGradesUser,
    allAzubisForExamGrades,
    canViewAllExamGrades,
    loadAzubisForExamGrades,
    loadExamGrades,
    addExamGrade,
    deleteExamGrade,
  } = useExamGrades({ user, showToast, sendNotification });

  // Daily Challenges: useDailyChallenges Hook
  const {
    dailyChallenges,
    updateChallengeProgress,
    getChallengeProgress,
    isChallengeCompleted,
    getCompletedChallengesCount,
    getTotalXPEarned,
  } = useDailyChallenges();

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

  // Badges: useBadges Hook
  const {
    userBadges,
    BADGES,
    checkBadges,
    loadUserBadges,
  } = useBadges({ user, userStats, swimSessions });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, user]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, allUsers]);

  useEffect(() => {
    if (!user?.id) return;
    if (currentView !== 'exam-simulator' || examSimulatorMode !== 'practical') return;
    void loadPracticalExamHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    runDataRetentionCheck();
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
    localStorage.setItem(QUESTION_REPORTS_STORAGE_KEY, JSON.stringify(questionReports));
  }, [questionReports]);

  // playSound + showToast + darkMode + soundEnabled kommen vom AppContext (siehe oben)


  // handleLogin, handleRegister, handleLogout werden vom AuthContext bereitgestellt

  const loadLightData = () => refreshLightData({
    user,
    duel,
    allUsers,
    setUserStats,
    updateLeaderboard,
    loadChatMessages,
  });

  const loadData = () => loadAppData({
    user,
    duel,
    setAppConfig,
    setConfigLoaded,
    setAllUsers,
    setPendingUsers,
    setStatsByUserId,
    setUserStats,
    setSubmittedQuestions,
    setQuestionReports,
    setMaterials,
    setResources,
    setNews,
    setExams,
    updateLeaderboard,
    loadCustomSwimTrainingPlans,
    loadChatMessages,
    loadFlashcardsFromBackend,
    loadUserBadges,
  });

  const updateLeaderboard = (games) => {
    setLeaderboard(computeLeaderboard(games));
  };

  const { queueXpAwardForUser, queueXpAward } = useXpQueue({
    user,
    duel,
    showToast,
    setUserStats,
    setStatsByUserId,
  });

  // Prüfungssimulator: useExamSimulator Hook (nach trackQuestionPerformance + updateWeeklyProgress)
  const {
    examSimulator,
    examCurrentQuestion,
    examQuestionIndex,
    examAnswered,
    userExamProgress,
    examSelectedAnswers,
    examSelectedAnswer,
    examSimulatorMode, setExamSimulatorMode,
    examKeywordMode, setExamKeywordMode,
    examKeywordInput, setExamKeywordInput,
    examKeywordEvaluation,
    theoryExamHistory,
    theoryExamHistoryLoading,
    confirmExamMultiSelectAnswer,
    submitExamKeywordAnswer,
    answerExamQuestion,
    resetExam,
    loadExamProgress,
    loadTheoryExamHistory,
  } = useExamSimulator({
    user,
    duel,
    playSound,
    showToast,
    updateChallengeProgress,
    updateWeeklyProgress,
    trackQuestionPerformance,
    setUserStats,
    setStatsByUserId,
  });

  // Praktische Prüfung: usePracticalExam Hook
  const {
    practicalExamType, setPracticalExamType,
    practicalExamInputs,
    practicalExamResult,
    practicalExamTargetUserId, setPracticalExamTargetUserId,
    practicalExamHistory,
    practicalExamHistoryLoading,
    practicalExamHistoryTypeFilter, setPracticalExamHistoryTypeFilter,
    practicalExamHistoryUserFilter, setPracticalExamHistoryUserFilter,
    practicalExamComparisonType, setPracticalExamComparisonType,
    getPracticalParticipantCandidates,
    loadPracticalExamHistory,
    savePracticalExamAttempt,
    deletePracticalExamAttempt,
    exportPracticalExamToPdf,
    resetPracticalExam,
    updatePracticalExamInput,
    evaluatePracticalExam,
  } = usePracticalExam({
    user,
    allUsers,
    showToast,
    queueXpAwardForUser,
  });

  duelLateDepsRef.current = { loadData, checkBadges, updateChallengeProgress, updateWeeklyProgress, trackQuestionPerformance };
  flashcardLateDepsRef.current = { updateChallengeProgress, updateWeeklyProgress, queueXpAward };


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
      <AppBackground darkMode={darkMode} playSound={playSound} />

      <OfflineBanner isOnline={isOnline} />
      <InstallBanner show={showInstallBanner} onInstall={triggerInstall} onDismiss={dismissInstall} />
      <CookieNotice show={showCookieNotice} onAcknowledge={acknowledgeCookie} onShowPrivacy={() => setCurrentView('datenschutz')} />

      <LiveTickerBanner appConfig={appConfig} />

      {/* Inaktivitäts-Warnung — gehandhabt von AuthGuard */}

      <ToastStack toasts={toasts} setToasts={setToasts} />

      <AppHeader
        darkMode={darkMode} setDarkMode={setDarkMode}
        soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled}
        sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed}
        appConfig={appConfig} user={user} userStats={userStats}
        setCurrentView={setCurrentView} playSound={playSound}
        updateAvailable={updateAvailable} updatingApp={updatingApp} applyPwaUpdate={applyPwaUpdate}
        enablePushNotifications={enablePushNotifications}
        notifications={notifications}
        showNotificationsPanel={showNotificationsPanel}
        setShowNotificationsPanel={setShowNotificationsPanel}
        handleLogout={handleLogout}
      />

      <NotificationsDropdown
        show={showNotificationsPanel}
        darkMode={darkMode}
        notifications={notifications}
        onClose={() => setShowNotificationsPanel(false)}
        onClear={clearAllNotifications}
        onMarkRead={markNotificationAsRead}
      />

      <DesktopSidebar
        darkMode={darkMode} sidebarCollapsed={sidebarCollapsed}
        appConfig={appConfig} user={user} currentView={currentView}
        setCurrentView={setCurrentView} playSound={playSound}
        loadFlashcards={loadFlashcards} handleLogout={handleLogout}
      />

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
