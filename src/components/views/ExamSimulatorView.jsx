import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  PRACTICAL_EXAM_TYPES,
  PRACTICAL_SWIM_EXAMS,
} from '../../data/practicalExam';
import ExamModeSwitcher from './examSimulator/ExamModeSwitcher';
import TheoryExamIntro from './examSimulator/TheoryExamIntro';
import TheoryExamActive from './examSimulator/TheoryExamActive';
import TheoryExamResult from './examSimulator/TheoryExamResult';
import PracticalExamForm from './examSimulator/PracticalExamForm';
import PracticalExamResult from './examSimulator/PracticalExamResult';
import PracticalExamLeaders from './examSimulator/PracticalExamLeaders';
import PracticalExamHistory from './examSimulator/PracticalExamHistory';
import PracticalExamComparison from './examSimulator/PracticalExamComparison';

const ExamSimulatorView = ({
  examSimulatorMode,
  setExamSimulatorMode,
  userExamProgress,
  examSimulator,
  adaptiveLearningEnabled,
  setAdaptiveLearningEnabled,
  examQuestionIndex,
  examCurrentQuestion,
  examAnswered,
  examSelectedAnswers,
  examSelectedAnswer,
  loadExamProgress,
  answerExamQuestion,
  reportQuestionIssue,
  confirmExamMultiSelectAnswer,
  resetExam,
  practicalExamType,
  setPracticalExamType,
  practicalExamInputs,
  practicalExamResult,
  practicalExamTargetUserId,
  setPracticalExamTargetUserId,
  practicalExamHistory,
  practicalExamHistoryLoading,
  practicalExamHistoryTypeFilter,
  setPracticalExamHistoryTypeFilter,
  practicalExamHistoryUserFilter,
  setPracticalExamHistoryUserFilter,
  practicalExamComparisonType,
  setPracticalExamComparisonType,
  resetPracticalExam,
  updatePracticalExamInput,
  evaluatePracticalExam,
  exportPracticalExamToPdf,
  loadPracticalExamHistory,
  canUseRowForSpeedRanking,
  getPracticalRowSeconds,
  getPracticalParticipantCandidates,
  examKeywordMode,
  setExamKeywordMode,
  examKeywordInput,
  setExamKeywordInput,
  examKeywordEvaluation,
  submitExamKeywordAnswer,
  theoryExamHistory,
  theoryExamHistoryLoading,
  loadTheoryExamHistory,
}) => {
  const { user } = useAuth();
  const { darkMode, playSound } = useApp();

  const renderPractical = () => {
    const selectedType =
      PRACTICAL_EXAM_TYPES.find((type) => type.id === practicalExamType) ||
      PRACTICAL_EXAM_TYPES[0];
    const disciplines = PRACTICAL_SWIM_EXAMS[practicalExamType] || [];
    const canManageAllPractical = Boolean(user?.permissions?.canViewAllStats);
    const practicalCandidates = getPracticalParticipantCandidates();
    const selectedTargetUser = canManageAllPractical
      ? practicalCandidates.find((a) => a.id === practicalExamTargetUserId) || null
      : user;

    const comparisonAttempts = practicalExamHistory
      .filter(
        (attempt) => attempt.exam_type === 'zwischen' || attempt.exam_type === 'abschluss',
      )
      .filter(
        (attempt) =>
          practicalExamComparisonType === 'alle' ||
          attempt.exam_type === practicalExamComparisonType,
      );

    const comparisonByUserId = {};
    comparisonAttempts.forEach((attempt) => {
      if (!attempt.user_id) return;
      if (!comparisonByUserId[attempt.user_id]) {
        comparisonByUserId[attempt.user_id] = {
          userId: attempt.user_id,
          userName:
            attempt.user_name ||
            practicalCandidates.find((a) => a.id === attempt.user_id)?.name ||
            'Unbekannt',
          attempts: [],
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
        const best =
          attempts
            .filter((a) => Number.isFinite(Number(a.average_grade)))
            .sort((a, b) => Number(a.average_grade) - Number(b.average_grade))[0] || null;
        return { ...entry, attemptsCount: attempts.length, latest, best };
      })
      .sort((a, b) => {
        const aBest = Number.isFinite(Number(a.best?.average_grade))
          ? Number(a.best.average_grade)
          : Number.POSITIVE_INFINITY;
        const bBest = Number.isFinite(Number(b.best?.average_grade))
          ? Number(b.best.average_grade)
          : Number.POSITIVE_INFINITY;
        if (aBest !== bBest) return aBest - bBest;
        return String(a.userName).localeCompare(String(b.userName), 'de');
      });

    const disciplineLeaders = disciplines.map((discipline) => {
      const isTimeBased =
        discipline.inputType === 'time' || discipline.inputType === 'time_distance';
      if (!isTimeBased) return { discipline, best: null };
      const best =
        practicalExamHistory
          .filter((attempt) => attempt.exam_type === practicalExamType)
          .flatMap((attempt) => {
            const rows = Array.isArray(attempt.rows) ? attempt.rows : [];
            const row = rows.find((entry) => entry?.id === discipline.id);
            if (!row) return [];
            if (!canUseRowForSpeedRanking(row, discipline.id)) return [];
            const seconds = getPracticalRowSeconds(row);
            if (!Number.isFinite(seconds) || seconds <= 0) return [];
            return [
              {
                userId: attempt.user_id,
                userName:
                  attempt.user_name ||
                  practicalCandidates.find((a) => a.id === attempt.user_id)?.name ||
                  'Unbekannt',
                createdAt: attempt.created_at,
                seconds,
                row,
              },
            ];
          })
          .sort((a, b) => {
            if (a.seconds !== b.seconds) return a.seconds - b.seconds;
            return new Date(a.createdAt) - new Date(b.createdAt);
          })[0] || null;
      return { discipline, best };
    });

    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <PracticalExamForm
          darkMode={darkMode}
          user={user}
          practicalExamType={practicalExamType}
          setPracticalExamType={setPracticalExamType}
          practicalExamInputs={practicalExamInputs}
          practicalExamTargetUserId={practicalExamTargetUserId}
          setPracticalExamTargetUserId={setPracticalExamTargetUserId}
          resetPracticalExam={resetPracticalExam}
          updatePracticalExamInput={updatePracticalExamInput}
          evaluatePracticalExam={evaluatePracticalExam}
          getPracticalParticipantCandidates={getPracticalParticipantCandidates}
          selectedType={selectedType}
          disciplines={disciplines}
        />
        {practicalExamResult && (
          <PracticalExamResult
            darkMode={darkMode}
            practicalExamResult={practicalExamResult}
            selectedType={selectedType}
            selectedTargetUser={selectedTargetUser}
            exportPracticalExamToPdf={exportPracticalExamToPdf}
            loadPracticalExamHistory={loadPracticalExamHistory}
          />
        )}
        <PracticalExamLeaders
          darkMode={darkMode}
          disciplineLeaders={disciplineLeaders}
          selectedType={selectedType}
        />
        <PracticalExamHistory
          darkMode={darkMode}
          user={user}
          practicalExamHistory={practicalExamHistory}
          practicalExamHistoryLoading={practicalExamHistoryLoading}
          practicalExamHistoryTypeFilter={practicalExamHistoryTypeFilter}
          setPracticalExamHistoryTypeFilter={setPracticalExamHistoryTypeFilter}
          practicalExamHistoryUserFilter={practicalExamHistoryUserFilter}
          setPracticalExamHistoryUserFilter={setPracticalExamHistoryUserFilter}
          practicalCandidates={practicalCandidates}
          exportPracticalExamToPdf={exportPracticalExamToPdf}
        />
        {canManageAllPractical && (
          <PracticalExamComparison
            darkMode={darkMode}
            practicalExamComparisonType={practicalExamComparisonType}
            setPracticalExamComparisonType={setPracticalExamComparisonType}
            comparisonRows={comparisonRows}
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <ExamModeSwitcher
        darkMode={darkMode}
        examSimulatorMode={examSimulatorMode}
        setExamSimulatorMode={setExamSimulatorMode}
      />

      {examSimulatorMode === 'theory' && !userExamProgress && (
        <>
          {!examSimulator || !examCurrentQuestion ? (
            <TheoryExamIntro
              darkMode={darkMode}
              user={user}
              adaptiveLearningEnabled={adaptiveLearningEnabled}
              setAdaptiveLearningEnabled={setAdaptiveLearningEnabled}
              examKeywordMode={examKeywordMode}
              setExamKeywordMode={setExamKeywordMode}
              loadExamProgress={loadExamProgress}
              playSound={playSound}
              theoryExamHistory={theoryExamHistory}
              theoryExamHistoryLoading={theoryExamHistoryLoading}
              loadTheoryExamHistory={loadTheoryExamHistory}
            />
          ) : (
            <TheoryExamActive
              darkMode={darkMode}
              examSimulator={examSimulator}
              examQuestionIndex={examQuestionIndex}
              examCurrentQuestion={examCurrentQuestion}
              examAnswered={examAnswered}
              examSelectedAnswers={examSelectedAnswers}
              examSelectedAnswer={examSelectedAnswer}
              answerExamQuestion={answerExamQuestion}
              reportQuestionIssue={reportQuestionIssue}
              confirmExamMultiSelectAnswer={confirmExamMultiSelectAnswer}
              examKeywordMode={examKeywordMode}
              examKeywordInput={examKeywordInput}
              setExamKeywordInput={setExamKeywordInput}
              examKeywordEvaluation={examKeywordEvaluation}
              submitExamKeywordAnswer={submitExamKeywordAnswer}
            />
          )}
        </>
      )}

      {examSimulatorMode === 'theory' && userExamProgress && (
        <TheoryExamResult
          darkMode={darkMode}
          userExamProgress={userExamProgress}
          resetExam={resetExam}
        />
      )}

      {examSimulatorMode === 'practical' && renderPractical()}
    </div>
  );
};

export default ExamSimulatorView;
