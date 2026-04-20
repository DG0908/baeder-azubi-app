import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import SwimHero from './swim/SwimHero';
import SwimTeamBattleBanner from './swim/SwimTeamBattleBanner';
import SwimOverviewView from './swim/SwimOverviewView';
import SwimTrainerConfirmationsView from './swim/SwimTrainerConfirmationsView';
import SwimChallengesListView from './swim/SwimChallengesListView';
import SwimTrainingPlansView from './swim/SwimTrainingPlansView';
import SwimSessionFormView from './swim/SwimSessionFormView';
import SwimLeaderboardView from './swim/SwimLeaderboardView';
import SwimBattleArenaView from './swim/SwimBattleArenaView';

const SwimChallengeView = (props) => {
const {
  SWIM_ARENA_DISCIPLINES,
  SWIM_BATTLE_WIN_POINTS,
  SWIM_CHALLENGES,
  SWIM_TRAINING_PLANS,
  SWIM_STYLES,
  activeSwimChallenges,
  allUsers,
  calculateChallengeProgress,
  calculateSwimPoints,
  calculateTeamBattleStats,
  confirmSwimSession,
  createCustomSwimTrainingPlan,
  getAgeHandicap,
  getSeaCreatureTier,
  getSwimLevel,
  getUserNameById,
  handleSwimBossBattleSubmit,
  handleSwimDuelSubmit,
  pendingSwimConfirmations,
  rejectSwimSession,
  saveActiveSwimChallenges,
  saveSwimSession,
  setCurrentView,
  setSwimArenaMode,
  setSwimBossForm,
  setSwimChallengeFilter,
  setSwimChallengeView,
  setSwimDuelForm,
  setSwimSessionForm,
  swimArenaMode,
  swimBattleHistory,
  swimBattleResult,
  swimBattleWinsByUserId,
  swimBossForm,
  swimChallengeFilter,
  swimChallengeView,
  swimCurrentMonthBattleStats,
  swimCurrentMonthLabel,
  swimDuelForm,
  swimMonthlyDistanceRankingCurrentMonth,
  swimMonthlyResults,
  swimMonthlySwimmerCurrentMonth,
  swimSessionForm,
  swimSessions,
  swimYear,
  swimYearlySwimmerRanking,
  toSafeInt,
  withdrawSwimSession,
} = props;
  const { user } = useAuth();
  const { darkMode } = useApp();

  const isTrainerLike = Boolean(
    user?.permissions?.canViewAllStats
    || user?.role === 'admin'
    || user?.role === 'trainer'
    || user?.role === 'ausbilder'
  );
  const azubiCandidates = allUsers.filter((account) => {
    if (String(account?.role || '').toLowerCase() !== 'azubi' || !account?.id) return false;
    const canSeeAll = user?.permissions?.canManageUsers || user?.role === 'admin';
    if (!canSeeAll && user?.organizationId) {
      const accountOrgId = account?.organizationId || account?.organization_id || null;
      return accountOrgId === user.organizationId;
    }
    return true;
  });

  return (
          <div className="space-y-6">
            <SwimHero
              darkMode={darkMode}
              swimChallengeView={swimChallengeView}
              setSwimChallengeView={setSwimChallengeView}
            />

            <SwimTeamBattleBanner
              darkMode={darkMode}
              swimCurrentMonthBattleStats={swimCurrentMonthBattleStats}
              swimCurrentMonthLabel={swimCurrentMonthLabel}
              calculateTeamBattleStats={calculateTeamBattleStats}
              allUsers={allUsers}
            />

            {swimChallengeView === 'overview' && (
              <SwimOverviewView
                darkMode={darkMode}
                user={user}
                swimSessions={swimSessions}
                SWIM_CHALLENGES={SWIM_CHALLENGES}
                calculateChallengeProgress={calculateChallengeProgress}
                calculateSwimPoints={calculateSwimPoints}
                getSwimLevel={getSwimLevel}
                getAgeHandicap={getAgeHandicap}
                setCurrentView={setCurrentView}
              />
            )}

            {swimChallengeView === 'challenges' && (
              <SwimChallengesListView
                darkMode={darkMode}
                user={user}
                SWIM_CHALLENGES={SWIM_CHALLENGES}
                swimChallengeFilter={swimChallengeFilter}
                setSwimChallengeFilter={setSwimChallengeFilter}
                swimSessions={swimSessions}
                calculateChallengeProgress={calculateChallengeProgress}
                activeSwimChallenges={activeSwimChallenges}
                saveActiveSwimChallenges={saveActiveSwimChallenges}
              />
            )}

            {swimChallengeView === 'plans' && (
              <SwimTrainingPlansView
                darkMode={darkMode}
                user={user}
                isTrainerLike={isTrainerLike}
                azubiCandidates={azubiCandidates}
                SWIM_STYLES={SWIM_STYLES}
                SWIM_TRAINING_PLANS={SWIM_TRAINING_PLANS}
                createCustomSwimTrainingPlan={createCustomSwimTrainingPlan}
                setSwimSessionForm={setSwimSessionForm}
                setSwimChallengeView={setSwimChallengeView}
              />
            )}


            {/* Trainingseinheit eintragen */}
            {swimChallengeView === 'add' && (
              <SwimSessionFormView
                darkMode={darkMode}
                swimSessionForm={swimSessionForm}
                setSwimSessionForm={setSwimSessionForm}
                SWIM_STYLES={SWIM_STYLES}
                SWIM_TRAINING_PLANS={SWIM_TRAINING_PLANS}
                SWIM_CHALLENGES={SWIM_CHALLENGES}
                activeSwimChallenges={activeSwimChallenges}
                saveSwimSession={saveSwimSession}
              />
            )}


            {swimChallengeView === 'leaderboard' && (
              <SwimLeaderboardView
                darkMode={darkMode}
                user={user}
                swimSessions={swimSessions}
                swimYear={swimYear}
                swimCurrentMonthLabel={swimCurrentMonthLabel}
                swimMonthlyResults={swimMonthlyResults}
                swimYearlySwimmerRanking={swimYearlySwimmerRanking}
                swimMonthlyDistanceRankingCurrentMonth={swimMonthlyDistanceRankingCurrentMonth}
                SWIM_CHALLENGES={SWIM_CHALLENGES}
                toSafeInt={toSafeInt}
              />
            )}
            {/* Team-Battle Detail */}
            {swimChallengeView === 'battle' && (
              <SwimBattleArenaView
                darkMode={darkMode}
                user={user}
                allUsers={allUsers}
                SWIM_ARENA_DISCIPLINES={SWIM_ARENA_DISCIPLINES}
                SWIM_BATTLE_WIN_POINTS={SWIM_BATTLE_WIN_POINTS}
                SWIM_STYLES={SWIM_STYLES}
                calculateTeamBattleStats={calculateTeamBattleStats}
                getSeaCreatureTier={getSeaCreatureTier}
                getUserNameById={getUserNameById}
                handleSwimBossBattleSubmit={handleSwimBossBattleSubmit}
                handleSwimDuelSubmit={handleSwimDuelSubmit}
                setSwimArenaMode={setSwimArenaMode}
                setSwimBossForm={setSwimBossForm}
                setSwimDuelForm={setSwimDuelForm}
                swimArenaMode={swimArenaMode}
                swimBattleHistory={swimBattleHistory}
                swimBattleResult={swimBattleResult}
                swimBattleWinsByUserId={swimBattleWinsByUserId}
                swimBossForm={swimBossForm}
                swimCurrentMonthBattleStats={swimCurrentMonthBattleStats}
                swimCurrentMonthLabel={swimCurrentMonthLabel}
                swimDuelForm={swimDuelForm}
                swimMonthlyDistanceRankingCurrentMonth={swimMonthlyDistanceRankingCurrentMonth}
                swimMonthlyResults={swimMonthlyResults}
                swimMonthlySwimmerCurrentMonth={swimMonthlySwimmerCurrentMonth}
                swimYear={swimYear}
                swimYearlySwimmerRanking={swimYearlySwimmerRanking}
                toSafeInt={toSafeInt}
              />
            )}

            <SwimTrainerConfirmationsView
              darkMode={darkMode}
              user={user}
              pendingSwimConfirmations={pendingSwimConfirmations}
              SWIM_STYLES={SWIM_STYLES}
              SWIM_TRAINING_PLANS={SWIM_TRAINING_PLANS}
              confirmSwimSession={confirmSwimSession}
              rejectSwimSession={rejectSwimSession}
              withdrawSwimSession={withdrawSwimSession}
            />
          </div>
  );
};

export default SwimChallengeView;
