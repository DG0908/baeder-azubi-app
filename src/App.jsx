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
import { useQuestionReports } from './hooks/useQuestionReports';
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
import { MobileNav } from './components/ui/MobileNav';
import { QuizMaintenanceView } from './components/ui/QuizMaintenanceView';

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

import { CATEGORIES, DEFAULT_MENU_ITEMS, DEFAULT_THEME_COLORS, PERMISSIONS } from './data/constants';
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

  const { questionReports, setQuestionReports } = useQuestionReports();

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

  const questionsApi = useQuestionSubmission({ user, moderateContent, showToast });
  const {
    setSubmittedQuestions,
    newQuestionCategory, setNewQuestionCategory,
  } = questionsApi;

  // Chat-State (extrahiert in eigenen Hook)
  const chatApi = useChatState({
    user,
    allUsers,
    showToast,
    moderateContent,
    sendNotification: async () => null,
  });
  const {
    messages,
    messageCount: chatMessageCount,
    loadChatMessages,
  } = chatApi;

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

  const contentApi = useContentAdmin({
    user,
    showToast,
    playSound,
    moderateContent,
    sendNotificationToApprovedUsers,
  });
  const {
    materials, setMaterials,
    resources, setResources,
    news, setNews,
    exams, setExams,
  } = contentApi;

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

  const flashcardsApi = useFlashcards({
    showToast,
    playSound,
    newQuestionCategory,
    lateDepsRef: flashcardLateDepsRef,
  });
  const {
    setSpacedRepetitionMode,
    loadFlashcards,
    loadFlashcardsFromBackend,
    getTotalDueCards,
  } = flashcardsApi;

  const swimApi = useSwimChallenge({
    user,
    allUsers,
    authReady,
    showToast,
    sendNotification,
  });
  const {
    swimSessions,
    loadCustomSwimTrainingPlans,
  } = swimApi;

  // Kontrollkarte Berufsschule: useSchoolAttendance Hook
  const schoolApi = useSchoolAttendance({ user, showToast, sendNotification });
  const {
    canViewAllSchoolCards,
    loadAzubisForSchoolCard,
    loadSchoolAttendance,
  } = schoolApi;

  // Klasuren: useExamGrades Hook
  const gradesApi = useExamGrades({ user, showToast, sendNotification });
  const {
    canViewAllExamGrades,
    loadAzubisForExamGrades,
    loadExamGrades,
  } = gradesApi;

  // Daily Challenges: useDailyChallenges Hook
  const challengesApi = useDailyChallenges();
  const { updateChallengeProgress } = challengesApi;

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
    statsSources: { materials, submittedQuestions: questionsApi.submittedQuestions, activeGames: duel.activeGames, chatMessageCount },
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
  const examSimApi = useExamSimulator({
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
  const {
    examSimulatorMode, setExamSimulatorMode,
    loadTheoryExamHistory,
  } = examSimApi;

  // Praktische Prüfung: usePracticalExam Hook
  const practicalExamApi = usePracticalExam({
    user,
    allUsers,
    showToast,
    queueXpAwardForUser,
  });
  const {
    setPracticalExamTargetUserId,
    loadPracticalExamHistory,
  } = practicalExamApi;

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
            {...adminActions}
            currentUserEmail={user.email}
            canManageRoles={Boolean(user.isOwner) || (user.role === 'admin' && !allUsers.some((account) => Boolean(account?.is_owner)))}
            canEditAppConfig={Boolean(user.isOwner) || (user.role === 'admin' && !allUsers.some((account) => Boolean(account?.is_owner)))}
            questionReports={questionReports}
            toggleQuestionReportStatus={duel.toggleQuestionReportStatus}
            pendingUsers={pendingUsers}
            loadData={loadData}
            allUsers={allUsers}
            appConfig={appConfig}
            companies={appConfig.companies}
            announcement={appConfig.announcement}
            featureFlags={appConfig.featureFlags}
          />
        )}

        {currentView === 'home' && (
          <HomeView
            {...challengesApi}
            rotateGeneralKnowledge={rotateGeneralKnowledge}
            dailyWisdom={dailyWisdom}
            userStats={userStats}
            getTotalXpFromStats={getTotalXpFromStats}
            setCurrentView={setCurrentView}
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
          <QuizMaintenanceView setCurrentView={setCurrentView} />
        )}
        {currentView === 'quiz' && !appConfig.featureFlags?.quizMaintenance && (
          <QuizView
            {...duel}
            continueGame={duel.continueGameSafe}
            allUsers={allUsers}
            adaptiveLearningEnabled={adaptiveLearningEnabled}
            setAdaptiveLearningEnabled={setAdaptiveLearningEnabled}
            isKeywordQuestion={isKeywordQuestion}
            isWhoAmIQuestion={isWhoAmIQuestion}
            userStats={userStats}
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
            {...chatApi}
            deleteMessage={chatApi.deleteChatMessage}
            canModerateChat={user?.role === 'admin'}
          />
        )}

        {/* Forum View */}
        {currentView === 'forum' && (
          <ForumView />
        )}

        {/* Materials View */}
        {currentView === 'materials' && (
          <MaterialsView {...contentApi} />
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
          <ResourcesView {...contentApi} />
        )}

                {/* News View */}
        {currentView === 'news' && (
          <NewsView {...contentApi} />
        )}

        {/* Exams View */}
        {currentView === 'exams' && (
          <ExamsView {...contentApi} {...gradesApi} />
        )}

        {/* Exam Simulator View */}
        {currentView === 'exam-simulator' && (
          <ErrorBoundary darkMode={darkMode}>
          <ExamSimulatorView
            {...examSimApi}
            {...practicalExamApi}
            adaptiveLearningEnabled={adaptiveLearningEnabled}
            setAdaptiveLearningEnabled={setAdaptiveLearningEnabled}
            reportQuestionIssue={duel.reportQuestionIssue}
            allUsers={allUsers}
            canUseRowForSpeedRanking={canUseRowForSpeedRanking}
            getPracticalRowSeconds={getPracticalRowSeconds}
          />
          </ErrorBoundary>
        )}
        {/* Flashcards View */}
        {currentView === 'flashcards' && (
          <FlashcardsView
            {...flashcardsApi}
            newQuestionCategory={newQuestionCategory}
            setNewQuestionCategory={setNewQuestionCategory}
            moderateContent={moderateContent}
            queueXpAward={queueXpAward}
            XP_REWARDS={XP_REWARDS}
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
            theoryExamHistory={examSimApi.theoryExamHistory}
            theoryExamHistoryLoading={examSimApi.theoryExamHistoryLoading}
            loadTheoryExamHistory={loadTheoryExamHistory}
          />
        )}

        {/* Questions View */}
        {currentView === 'questions' && (
          <QuestionsView {...questionsApi} />
        )}

        {/* Kontrollkarte Berufsschule View */}
        {currentView === 'school-card' && (
          <SchoolCardView {...schoolApi} />
        )}

        {/* ==================== SCHWIMMCHALLENGE VIEW ==================== */}
        {currentView === 'swim-challenge' && (
          <SwimChallengeView
            {...swimApi}
            SWIM_ARENA_DISCIPLINES={SWIM_ARENA_DISCIPLINES}
            SWIM_BATTLE_WIN_POINTS={SWIM_BATTLE_WIN_POINTS}
            SWIM_CHALLENGES={SWIM_CHALLENGES}
            SWIM_TRAINING_PLANS={swimApi.swimTrainingPlans}
            SWIM_STYLES={SWIM_STYLES}
            allUsers={allUsers}
            calculateChallengeProgress={calculateChallengeProgress}
            calculateSwimPoints={calculateSwimPoints}
            calculateTeamBattleStats={calculateTeamBattleStats}
            getAgeHandicap={getAgeHandicap}
            getSwimLevel={getSwimLevel}
            setCurrentView={setCurrentView}
            statsByUserId={statsByUserId}
            toSafeInt={toSafeInt}
          />
        )}

        {/* ==================== BERICHTSHEFT VIEW ==================== */}
        {currentView === 'berichtsheft' && (
          <BerichtsheftView
            {...berichtsheft}
            signAssignableUsers={allUsers.filter((account) => account.role === 'trainer' || account.role === 'admin')}
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

      <MobileNav
        darkMode={darkMode}
        currentView={currentView}
        setCurrentView={setCurrentView}
        playSound={playSound}
        showMehrDrawer={showMehrDrawer}
        setShowMehrDrawer={setShowMehrDrawer}
        appConfig={appConfig}
        user={user}
        loadFlashcards={loadFlashcards}
        handleLogout={handleLogout}
      />

    </div>
  </AuthGuard>
  );
}
