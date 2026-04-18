import { useEffect } from 'react';
import { isFinishedGameStatus, namesMatch } from '../lib/quizHelpers';
import { runDataRetentionCheck } from '../lib/dataRetention';

export function useAppEffects({
  authReady, user, allUsers, currentView,
  duel, examSimApi, practicalExamApi, schoolApi, gradesApi, notificationsApi,
  loadData, loadLightData,
}) {
  useEffect(() => {
    if (currentView && currentView !== 'home') {
      localStorage.setItem('lastView', currentView);
    }
  }, [currentView]);

  useEffect(() => {
    if (!authReady) return;
    if (user) {
      loadData();
      notificationsApi.loadNotifications();
      examSimApi.loadTheoryExamHistory();
      const interval = setInterval(() => {
        if (duel.quizActiveRef.current) return;
        loadLightData();
        notificationsApi.loadNotifications();
      }, 30000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, user]);

  useEffect(() => {
    if (!user?.id) {
      practicalExamApi.setPracticalExamTargetUserId('');
      return;
    }

    const canManageAll = Boolean(user?.permissions?.canViewAllStats);
    if (!canManageAll) {
      practicalExamApi.setPracticalExamTargetUserId(user.id);
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
    practicalExamApi.setPracticalExamTargetUserId((prev) => {
      if (prev && practicalCandidates.some((a) => a.id === prev)) return prev;
      if (practicalCandidates.some((a) => a.id === user.id)) return user.id;
      return practicalCandidates[0]?.id || user.id;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, allUsers]);

  useEffect(() => {
    if (!user?.id) return;
    if (currentView !== 'exam-simulator' || examSimApi.examSimulatorMode !== 'practical') return;
    void practicalExamApi.loadPracticalExamHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentView, examSimApi.examSimulatorMode]);

  useEffect(() => {
    duel.quizActiveRef.current = duel.timerActive && currentView === 'quiz';
  }, [duel.timerActive, currentView, duel.quizActiveRef]);

  useEffect(() => {
    if (!duel.currentGame?.id || !user?.name || !duel.waitingForOpponent) return;

    const updatedGame = duel.allGames.find((g) => g.id === duel.currentGame.id)
      || duel.activeGames.find((g) => g.id === duel.currentGame.id);
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
  }, [duel.timeLeft, duel.timerActive, duel.answered]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!authReady || !user) return;
    if (user.role !== 'admin') return;
    runDataRetentionCheck();
  }, [authReady, user]);

  useEffect(() => {
    if (currentView === 'school-card' && user) {
      schoolApi.loadSchoolAttendance();
      if (schoolApi.canViewAllSchoolCards()) {
        schoolApi.loadAzubisForSchoolCard();
      }
    }

    if ((currentView === 'exam-grades' || currentView === 'exams') && user) {
      gradesApi.loadExamGrades();
      if (gradesApi.canViewAllExamGrades()) {
        gradesApi.loadAzubisForExamGrades();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, user]);
}
