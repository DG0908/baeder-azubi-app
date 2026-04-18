import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import AuthGuard from './components/auth/AuthGuard';
import { useChatState } from './hooks/useChatState';
import { useAdminActions } from './hooks/useAdminActions';
import { useNotifications } from './hooks/useNotifications';
import { useBerichtsheft } from './hooks/useBerichtsheft';
import { useDuelGame } from './hooks/useDuelGame';
import { useFlashcards } from './hooks/useFlashcards';
import { useSwimChallenge } from './hooks/useSwimChallenge';
import { useSchoolAttendance } from './hooks/useSchoolAttendance';
import { useExamGrades } from './hooks/useExamGrades';
import { useDailyChallenges } from './hooks/useDailyChallenges';
import { useExamSimulator } from './hooks/useExamSimulator';
import { usePracticalExam } from './hooks/usePracticalExam';
import { useBadges } from './hooks/useBadges';
import { useWeeklyGoals, sanitizeGoalValue } from './hooks/useWeeklyGoals';
import { useQuestionPerformance } from './hooks/useQuestionPerformance';
import { useQuestionReports } from './hooks/useQuestionReports';
import { createContentModerator } from './lib/contentModeration';
import { computeLeaderboard } from './lib/leaderboard';
import { loadAppData, refreshLightData } from './lib/loadAppData';
import { useXpQueue } from './hooks/useXpQueue';
import { useContentAdmin } from './hooks/useContentAdmin';
import { useCalculator } from './hooks/useCalculator';
import { useDailyWisdom } from './hooks/useDailyWisdom';
import { useQuestionSubmission } from './hooks/useQuestionSubmission';
import { LiveTickerBanner } from './components/ui/LiveTickerBanner';
import { OfflineBanner, InstallBanner, CookieNotice } from './components/ui/AppBanners';
import { ToastStack } from './components/ui/ToastStack';
import { AppBackground } from './components/ui/AppBackground';
import { AppHeader } from './components/ui/AppHeader';
import { NotificationsDropdown } from './components/ui/NotificationsDropdown';
import { DesktopSidebar } from './components/ui/DesktopSidebar';
import { MobileNav } from './components/ui/MobileNav';
import { AppRouter } from './components/AppRouter';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { useCookieNotice } from './hooks/useCookieNotice';
import { useViewRouter } from './hooks/useViewRouter';
import { useAppEffects } from './hooks/useAppEffects';

import { DEFAULT_MENU_ITEMS, DEFAULT_THEME_COLORS } from './data/constants';

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
  const weeklyGoalsApi = useWeeklyGoals({ user, currentView, showToast });
  const { updateWeeklyProgress } = weeklyGoalsApi;

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
  const questionPerformanceApi = useQuestionPerformance();
  const {
    questionPerformance,
    adaptiveLearningEnabled, setAdaptiveLearningEnabled,
    trackQuestionPerformance,
  } = questionPerformanceApi;

  const { questionReports, setQuestionReports } = useQuestionReports();

  // Calculator + Chemie/Elemente
  const calculatorHookApi = useCalculator({ playSound });
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const calculatorApi = {
    ...calculatorHookApi,
    selectedChemical, setSelectedChemical,
    selectedElement, setSelectedElement,
  };

  // Profil-Bearbeitung State: vollständig in ProfileView ausgelagert

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
  const notificationsApi = useNotifications({
    user,
    authReady,
    allUsers,
    showToast,
    playSound,
  });
  const {
    notifications, showNotificationsPanel, setShowNotificationsPanel,
    loadNotifications, sendNotification, sendNotificationToApprovedUsers,
    markNotificationAsRead, clearAllNotifications,
    enablePushNotifications,
    updateAvailable, updatingApp, applyPwaUpdate,
  } = notificationsApi;

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
  const badgesApi = useBadges({ user, userStats, swimSessions });
  const { checkBadges, loadUserBadges } = badgesApi;

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

  useAppEffects({
    authReady, user, allUsers, currentView,
    duel, examSimApi, practicalExamApi, schoolApi, gradesApi, notificationsApi,
    loadData, loadLightData,
  });

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
        <AppRouter
          currentView={currentView} setCurrentView={setCurrentView}
          user={user} allUsers={allUsers} pendingUsers={pendingUsers}
          userStats={userStats} statsByUserId={statsByUserId} leaderboard={leaderboard}
          appConfig={appConfig} darkMode={darkMode} questionReports={questionReports}
          adminActions={adminActions}
          duel={duel} chatApi={chatApi} contentApi={contentApi}
          gradesApi={gradesApi} schoolApi={schoolApi} swimApi={swimApi}
          challengesApi={challengesApi} berichtsheft={berichtsheft}
          examSimApi={examSimApi} practicalExamApi={practicalExamApi}
          flashcardsApi={flashcardsApi} questionsApi={questionsApi}
          badgesApi={badgesApi} calculatorApi={calculatorApi}
          notificationsApi={notificationsApi} weeklyGoalsApi={weeklyGoalsApi}
          questionPerformanceApi={questionPerformanceApi}
          dailyWisdom={dailyWisdom} rotateGeneralKnowledge={rotateGeneralKnowledge}
          loadData={loadData} loadFlashcards={loadFlashcards}
          loadTheoryExamHistory={loadTheoryExamHistory}
          getTotalDueCards={getTotalDueCards}
          setSpacedRepetitionMode={setSpacedRepetitionMode}
          setExamSimulatorMode={setExamSimulatorMode}
          messages={messages} swimSessions={swimSessions}
          moderateContent={moderateContent} queueXpAward={queueXpAward}
        />
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
