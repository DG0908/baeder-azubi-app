import { lazy, Suspense } from 'react';
import HomeView from './views/HomeView';
import QuizView from './views/QuizView';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { QuizMaintenanceView } from './ui/QuizMaintenanceView';
import {
  FLOCCULANT_PRODUCTS,
  FLOCCULANT_PUMP_TYPES,
  FLOCCULANT_PUMP_MODELS,
  CHLORINATION_PRODUCTS,
  ANTICHLOR_PRODUCTS,
} from '../data/poolChemistry';
import {
  SWIM_STYLES, SWIM_CHALLENGES,
  getAgeHandicap, calculateSwimPoints, calculateChallengeProgress,
  getSwimLevel, calculateTeamBattleStats,
} from '../data/swimming';
import { SWIM_BATTLE_WIN_POINTS, SWIM_ARENA_DISCIPLINES } from '../hooks/useSwimChallenge';
import { canUseRowForSpeedRanking, getPracticalRowSeconds } from '../hooks/usePracticalExam';
import {
  toSafeInt, namesMatch, isFinishedGameStatus,
  XP_REWARDS, getTotalXpFromStats,
  isKeywordQuestion, isWhoAmIQuestion,
} from '../lib/quizHelpers';
import { sanitizeGoalValue, getWeekStartStamp, buildEmptyWeeklyProgress } from '../hooks/useWeeklyGoals';

const ChatView = lazy(() => import('./views/ChatView'));
const ForumView = lazy(() => import('./views/ForumView'));
const NewsView = lazy(() => import('./views/NewsView'));
const ExamsView = lazy(() => import('./views/ExamsView'));
const MaterialsView = lazy(() => import('./views/MaterialsView'));
const ResourcesView = lazy(() => import('./views/ResourcesView'));
const TrainerDashboardView = lazy(() => import('./views/TrainerDashboardView'));
const QuestionsView = lazy(() => import('./views/QuestionsView'));
const StatsView = lazy(() => import('./views/StatsView'));
const SchoolCardView = lazy(() => import('./views/SchoolCardView'));
const ProfileView = lazy(() => import('./views/ProfileView'));
const AdminView = lazy(() => import('./views/AdminView'));
const ExamSimulatorView = lazy(() => import('./views/ExamSimulatorView'));
const FlashcardsView = lazy(() => import('./views/FlashcardsView'));
const CalculatorView = lazy(() => import('./views/CalculatorView'));
const SwimChallengeView = lazy(() => import('./views/SwimChallengeView'));
const BerichtsheftView = lazy(() => import('./views/BerichtsheftView'));
const CollectionView = lazy(() => import('./views/CollectionView'));
const ImpressumView = lazy(() => import('./views/ImpressumView'));
const DatenschutzView = lazy(() => import('./views/DatenschutzView'));
const AGBView = lazy(() => import('./views/AGBView'));
const InteractiveLearningView = lazy(() => import('./views/InteractiveLearningView'));
const NotfallTrainerView = lazy(() => import('./views/NotfallTrainerView'));

export function AppRouter({
  currentView, setCurrentView,
  user, allUsers, pendingUsers, userStats, statsByUserId, leaderboard,
  appConfig, darkMode, questionReports,
  adminActions,
  duel, chatApi, contentApi, gradesApi, schoolApi, swimApi, challengesApi,
  berichtsheft, examSimApi, practicalExamApi, flashcardsApi, questionsApi,
  badgesApi, calculatorApi, notificationsApi, weeklyGoalsApi, questionPerformanceApi,
  dailyWisdom, rotateGeneralKnowledge,
  loadData, loadFlashcards, loadTheoryExamHistory,
  getTotalDueCards, setSpacedRepetitionMode,
  setExamSimulatorMode, messages, swimSessions,
  moderateContent, queueXpAward,
}) {
  const { materials, resources, news, exams } = contentApi;
  const {
    weeklyProgress, setWeeklyProgress, weeklyGoals, setWeeklyGoals,
  } = weeklyGoalsApi;
  const { adaptiveLearningEnabled, setAdaptiveLearningEnabled } = questionPerformanceApi;
  const { newQuestionCategory, setNewQuestionCategory } = questionsApi;
  const { userBadges, BADGES } = badgesApi;
  const {
    calculatorType, setCalculatorType,
    calculatorInputs, setCalculatorInputs,
    calculatorResult, setCalculatorResult,
    selectedChemical, setSelectedChemical,
    selectedElement, setSelectedElement,
    handleCalculation,
  } = calculatorApi;
  const {
    pushDeviceState, enablePushNotifications, syncPushSubscription, disablePushNotifications,
  } = notificationsApi;

  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="text-4xl animate-bounce">🏊‍♂️</div></div>}>
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

      {currentView === 'stats' && (
        <StatsView
          userStats={userStats}
          BADGES={BADGES}
          userBadges={userBadges}
          leaderboard={leaderboard}
        />
      )}

      {currentView === 'chat' && (
        <ChatView
          {...chatApi}
          deleteMessage={chatApi.deleteChatMessage}
          canModerateChat={user?.role === 'admin'}
        />
      )}

      {currentView === 'forum' && <ForumView />}

      {currentView === 'materials' && <MaterialsView {...contentApi} />}

      {currentView === 'interactive-learning' && <InteractiveLearningView />}

      {currentView === 'notfall-trainer' && <NotfallTrainerView />}

      {currentView === 'resources' && <ResourcesView {...contentApi} />}

      {currentView === 'news' && <NewsView {...contentApi} />}

      {currentView === 'exams' && <ExamsView {...contentApi} {...gradesApi} />}

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

      {currentView === 'questions' && <QuestionsView {...questionsApi} />}

      {currentView === 'school-card' && <SchoolCardView {...schoolApi} />}

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

      {currentView === 'berichtsheft' && (
        <BerichtsheftView
          {...berichtsheft}
          signAssignableUsers={allUsers.filter((account) => account.role === 'trainer' || account.role === 'admin')}
        />
      )}

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

      {currentView === 'collection' && (
        <CollectionView
          userStats={userStats}
          swimSessions={swimSessions}
          userBadges={userBadges}
          setCurrentView={setCurrentView}
        />
      )}

      {currentView === 'impressum' && <ImpressumView setCurrentView={setCurrentView} />}
      {currentView === 'datenschutz' && <DatenschutzView setCurrentView={setCurrentView} />}
      {currentView === 'agb' && <AGBView setCurrentView={setCurrentView} />}
    </Suspense>
  );
}
