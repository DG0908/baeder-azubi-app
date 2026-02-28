import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/constants';
import { PRACTICAL_EXAM_TYPES, PRACTICAL_SWIM_EXAMS, resolvePracticalDisciplineResult, toNumericGrade, formatGradeLabel, parseExamTimeToSeconds, formatSecondsAsTime } from '../../data/practicalExam';
import { formatAnswerLabel } from '../../lib/utils';

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
  allUsers,
  resetPracticalExam,
  updatePracticalExamInput,
  evaluatePracticalExam,
  exportPracticalExamToPdf,
  loadPracticalExamHistory,
  canUseRowForSpeedRanking,
  getPracticalRowSeconds,
  getPracticalParticipantCandidates,
  savePracticalExamAttempt,
  deletePracticalExamAttempt,
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

  return (
    <>
  <div className="max-w-4xl mx-auto mb-4">
    <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-3 shadow-lg`}>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setExamSimulatorMode('theory')}
          className={`py-2 rounded-lg font-bold transition-all ${
            examSimulatorMode === 'theory'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : (darkMode ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
          }`}
        >
          📝 Theorie
        </button>
        <button
          onClick={() => setExamSimulatorMode('practical')}
          className={`py-2 rounded-lg font-bold transition-all ${
            examSimulatorMode === 'practical'
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
              : (darkMode ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
          }`}
        >
          🏊 Praxis
        </button>
      </div>
    </div>
  </div>

{examSimulatorMode === 'theory' && !userExamProgress && (
  <div className="max-w-4xl mx-auto">
    {!examSimulator || !examCurrentQuestion ? (
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-8 shadow-lg text-center`}>
        <div className="text-6xl mb-4">📝</div>
        <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Prüfungssimulator</h2>
        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Teste dein Wissen mit 30 zufälligen Fragen aus allen Kategorien
        </p>
        <div className={`mb-4 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-emerald-50 border-emerald-200'} border rounded-lg p-3 flex items-center justify-between gap-3`}>
          <div className="text-left">
            <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-emerald-800'}`}>
              Adaptiver Lernmodus
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-emerald-700'}`}>
              {adaptiveLearningEnabled ? 'Falsch beantwortete Fragen werden priorisiert.' : '30 Fragen im reinen Zufall.'}
            </p>
          </div>
          <button
            onClick={() => setAdaptiveLearningEnabled((prev) => !prev)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${
              adaptiveLearningEnabled
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : darkMode ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {adaptiveLearningEnabled ? 'Aktiv' : 'Aus'}
          </button>
        </div>
        <div className={`mb-4 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-violet-50 border-violet-200'} border rounded-lg p-3 flex items-center justify-between gap-3`}>
          <div className="text-left">
            <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-violet-800'}`}>
              🧠 Schlagwort-Modus
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-violet-700'}`}>
              {examKeywordMode ? 'Fragen schriftlich beantworten – triff die Schlüsselbegriffe.' : 'Klassisches Multiple-Choice.'}
            </p>
          </div>
          <button
            onClick={() => setExamKeywordMode(prev => !prev)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${
              examKeywordMode
                ? 'bg-violet-500 hover:bg-violet-600 text-white'
                : darkMode ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {examKeywordMode ? 'Aktiv' : 'Aus'}
          </button>
        </div>
        <div className={`${darkMode ? 'bg-slate-700' : 'bg-blue-50'} rounded-lg p-6 mb-6`}>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>30</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fragen</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{CATEGORIES.length}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Kategorien</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>50%</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Zum Bestehen</div>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            loadExamProgress();
            playSound('whistle');
          }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
        >
          Prüfung starten 🚀
        </button>

        {!user.permissions?.canViewAllStats && (
          <div className={`mt-6 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-4 text-left`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📊 Meine Ergebnisse
              </h3>
              <button
                onClick={loadTheoryExamHistory}
                className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
              >
                Aktualisieren
              </button>
            </div>
            {theoryExamHistoryLoading ? (
              <p className={`text-sm text-center py-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Laden…</p>
            ) : !theoryExamHistory || theoryExamHistory.length === 0 ? (
              <p className={`text-sm text-center py-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Noch keine Prüfungen absolviert</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {theoryExamHistory.slice(0, 10).map(attempt => (
                  <div
                    key={attempt.id}
                    className={`flex justify-between items-center rounded-lg px-3 py-2 ${darkMode ? 'bg-slate-600' : 'bg-white'}`}
                  >
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <span className={attempt.passed ? 'text-green-500' : 'text-red-500'}>
                        {attempt.passed ? '✅' : '❌'} {attempt.percentage}%
                      </span>
                      <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        ({attempt.correct}/{attempt.total} richtig)
                      </span>
                      {attempt.keyword_mode && (
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-violet-900/60 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>🧠</span>
                      )}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(attempt.created_at).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    ) : (
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
        {/* Progress Header */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Frage {examQuestionIndex + 1} / 30
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                {CATEGORIES.find(c => c.id === examCurrentQuestion.category)?.name}
              </span>
              {examKeywordMode && (
                <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${darkMode ? 'bg-violet-900/60 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>
                  🧠 Schlagwort-Modus
                </span>
              )}
            </div>
            <div className={`flex items-center gap-1.5 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
              <span className="text-xl font-bold">{examSimulator.answers.filter(a => a.correct).length}</span>
              <span className="text-xs">Richtig</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className={`w-full h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${((examQuestionIndex) / 30) * 100}%` }}
            />
          </div>
          {/* Category segment indicators */}
          <div className="flex gap-0.5 mt-1.5">
            {[0,1,2,3,4,5].map(seg => {
              const segStart = seg * 5;
              const completed = examQuestionIndex > segStart + 4;
              const active = examQuestionIndex >= segStart && examQuestionIndex <= segStart + 4;
              return (
                <div
                  key={seg}
                  className={`flex-1 h-1 rounded-full transition-all ${
                    completed ? (darkMode ? 'bg-cyan-400' : 'bg-cyan-500') :
                    active ? (darkMode ? 'bg-cyan-600' : 'bg-cyan-300') :
                    (darkMode ? 'bg-slate-600' : 'bg-gray-200')
                  }`}
                />
              );
            })}
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-xl p-6 mb-6`}>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {examCurrentQuestion.q}
          </p>
          {examCurrentQuestion.multi && !examAnswered && (
            <p className="text-center text-sm text-orange-600 mt-2 font-medium">
              ⚠️ Mehrere Antworten sind richtig - wähle alle richtigen aus!
            </p>
          )}
        </div>

        {examKeywordMode ? (
          <div className="space-y-3">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              💡 Singular und Plural werden beide erkannt – schreib, wie es natürlich klingt.
            </p>
            <textarea
              value={examKeywordInput}
              onChange={(e) => setExamKeywordInput(e.target.value)}
              disabled={examAnswered}
              rows={5}
              placeholder="Antworte in eigenen Worten und nenne die wichtigsten Schlüsselbegriffe..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-60 ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-violet-200 text-gray-800'
              }`}
            />
            {!examAnswered && (
              <button
                onClick={submitExamKeywordAnswer}
                disabled={!examKeywordInput.trim()}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                  examKeywordInput.trim()
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'
                    : 'bg-violet-300 cursor-not-allowed'
                }`}
              >
                Antwort prüfen
              </button>
            )}
            {examKeywordEvaluation && (
              <div className={`rounded-xl border-2 p-4 ${
                examKeywordEvaluation.isCorrect
                  ? darkMode ? 'border-emerald-600 bg-emerald-900/40' : 'border-emerald-400 bg-emerald-50'
                  : darkMode ? 'border-amber-600 bg-amber-900/30' : 'border-amber-400 bg-amber-50'
              }`}>
                <p className={`font-bold ${examKeywordEvaluation.isCorrect ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {examKeywordEvaluation.isCorrect ? '✅ Korrekt!' : '⚠️ Nicht ausreichend.'}
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Treffer: {examKeywordEvaluation.matchedCount}/{examKeywordEvaluation.requiredGroups} erforderlich
                </p>
                {examKeywordEvaluation.matchedLabels?.length > 0 && (
                  <p className={`text-sm mt-1 ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    Erkannt: {examKeywordEvaluation.matchedLabels.join(', ')}
                  </p>
                )}
                {examKeywordEvaluation.missingLabels?.length > 0 && (
                  <p className={`text-sm mt-1 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Fehlte: {examKeywordEvaluation.missingLabels.join(', ')}
                  </p>
                )}
                <p className={`text-sm mt-2 pt-2 border-t ${darkMode ? 'border-slate-600 text-gray-300' : 'border-gray-200 text-gray-700'}`}>
                  Korrekte Antwort: {
                    examCurrentQuestion.multi && Array.isArray(examCurrentQuestion.correct)
                      ? examCurrentQuestion.correct.map(idx => formatAnswerLabel(examCurrentQuestion.a[idx])).join(' | ')
                      : formatAnswerLabel(examCurrentQuestion.a[examCurrentQuestion.correct])
                  }
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {examCurrentQuestion.a.map((answer, idx) => {
              const isMulti = examCurrentQuestion.multi;
              const isSelected = isMulti ? examSelectedAnswers.includes(idx) : examSelectedAnswer === idx;
              const answerLabel = formatAnswerLabel(examCurrentQuestion.displayAnswers?.[idx] ?? answer);
              const isCorrectAnswer = isMulti
                ? (Array.isArray(examCurrentQuestion.correct) ? examCurrentQuestion.correct.includes(idx) : false)
                : idx === examCurrentQuestion.correct;

              let buttonClass = '';
              if (examAnswered) {
                if (isCorrectAnswer) {
                  buttonClass = 'bg-green-500 text-white';
                } else if (isSelected && !isCorrectAnswer) {
                  buttonClass = 'bg-red-500 text-white';
                } else {
                  buttonClass = darkMode ? 'bg-slate-600 text-gray-400' : 'bg-gray-200 text-gray-500';
                }
              } else {
                if (isMulti && isSelected) {
                  buttonClass = 'bg-blue-500 text-white border-2 border-blue-600';
                } else {
                  buttonClass = darkMode
                    ? 'bg-slate-700 hover:bg-slate-600 border-2 border-slate-600 hover:border-cyan-500 text-white'
                    : 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => answerExamQuestion(idx)}
                  disabled={examAnswered}
                  title={formatAnswerLabel(answer)}
                  className={`p-4 rounded-xl font-medium transition-all text-left min-h-[4.5rem] ${buttonClass}`}
                >
                  {isMulti && !examAnswered && (
                    <span className="mr-2">{isSelected ? '☑️' : '⬜'}</span>
                  )}
                  {answerLabel}
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={() => {
            void reportQuestionIssue({
              question: examCurrentQuestion,
              categoryId: examCurrentQuestion?.category,
              source: 'exam-simulator'
            });
          }}
          className={`w-full mt-2 py-2 rounded-lg font-semibold border ${
            darkMode
              ? 'bg-amber-900/40 hover:bg-amber-800/50 text-amber-300 border-amber-700'
              : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300'
          }`}
        >
          🚩 Frage melden
        </button>

        {/* Multi-Select Bestätigen Button */}
        {!examKeywordMode && examCurrentQuestion.multi && !examAnswered && examSelectedAnswers.length > 0 && (
          <button
            onClick={confirmExamMultiSelectAnswer}
            className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
          >
            ✓ Antwort bestätigen ({examSelectedAnswers.length} ausgewählt)
          </button>
        )}
      </div>
    )}
  </div>
)}

{examSimulatorMode === 'practical' && (() => {
  const selectedType = PRACTICAL_EXAM_TYPES.find(type => type.id === practicalExamType) || PRACTICAL_EXAM_TYPES[0];
  const disciplines = PRACTICAL_SWIM_EXAMS[practicalExamType] || [];
  const canManageAllPractical = Boolean(user?.permissions?.canViewAllStats);
  const practicalCandidates = getPracticalParticipantCandidates();
  const selectedTargetUser = canManageAllPractical
    ? (practicalCandidates.find(account => account.id === practicalExamTargetUserId) || null)
    : user;
  const historyFiltered = practicalExamHistory
    .filter((attempt) => practicalExamHistoryTypeFilter === 'alle' || attempt.exam_type === practicalExamHistoryTypeFilter)
    .filter((attempt) => !canManageAllPractical || practicalExamHistoryUserFilter === 'all' || attempt.user_id === practicalExamHistoryUserFilter);
  const attemptTypeLabel = (typeId) => PRACTICAL_EXAM_TYPES.find(type => type.id === typeId)?.label || typeId;
  const formatAttemptDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('de-DE');
  };

  const comparisonAttempts = practicalExamHistory
    .filter((attempt) => attempt.exam_type === 'zwischen' || attempt.exam_type === 'abschluss')
    .filter((attempt) => practicalExamComparisonType === 'alle' || attempt.exam_type === practicalExamComparisonType);

  const comparisonByUserId = {};
  comparisonAttempts.forEach((attempt) => {
    if (!attempt.user_id) return;
    if (!comparisonByUserId[attempt.user_id]) {
      comparisonByUserId[attempt.user_id] = {
        userId: attempt.user_id,
        userName: attempt.user_name || practicalCandidates.find(account => account.id === attempt.user_id)?.name || 'Unbekannt',
        attempts: []
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
      const best = attempts
        .filter(attempt => Number.isFinite(Number(attempt.average_grade)))
        .sort((a, b) => Number(a.average_grade) - Number(b.average_grade))[0] || null;
      return {
        ...entry,
        attemptsCount: attempts.length,
        latest,
        best
      };
    })
    .sort((a, b) => {
      const aBest = Number.isFinite(Number(a.best?.average_grade)) ? Number(a.best.average_grade) : Number.POSITIVE_INFINITY;
      const bBest = Number.isFinite(Number(b.best?.average_grade)) ? Number(b.best.average_grade) : Number.POSITIVE_INFINITY;
      if (aBest !== bBest) return aBest - bBest;
      return String(a.userName).localeCompare(String(b.userName), 'de');
    });

  const disciplineLeaders = disciplines.map((discipline) => {
    const isTimeBased = discipline.inputType === 'time' || discipline.inputType === 'time_distance';
    if (!isTimeBased) {
      return {
        discipline,
        best: null
      };
    }

    const best = practicalExamHistory
      .filter(attempt => attempt.exam_type === practicalExamType)
      .flatMap((attempt) => {
        const rows = Array.isArray(attempt.rows) ? attempt.rows : [];
        const row = rows.find(entry => entry?.id === discipline.id);
        if (!row) return [];
        if (!canUseRowForSpeedRanking(row, discipline.id)) return [];
        const seconds = getPracticalRowSeconds(row);
        if (!Number.isFinite(seconds) || seconds <= 0) return [];
        return [{
          userId: attempt.user_id,
          userName: attempt.user_name || practicalCandidates.find(account => account.id === attempt.user_id)?.name || 'Unbekannt',
          createdAt: attempt.created_at,
          seconds,
          row
        }];
      })
      .sort((a, b) => {
        if (a.seconds !== b.seconds) return a.seconds - b.seconds;
        return new Date(a.createdAt) - new Date(b.createdAt);
      })[0] || null;

    return {
      discipline,
      best
    };
  });

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              🏊 Praktischer Prüfungssimulator
            </h2>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Zeiten eintragen und Note direkt aus der Wertungstabelle berechnen.
            </p>
          </div>
          <div className="flex gap-2">
            {PRACTICAL_EXAM_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setPracticalExamType(type.id);
                  resetPracticalExam();
                }}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  practicalExamType === type.id
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                    : (darkMode ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }`}
              >
              {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>

        {canManageAllPractical && (
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Prüfung für Teilnehmer
            </label>
            <select
              value={practicalExamTargetUserId}
              onChange={(event) => setPracticalExamTargetUserId(event.target.value)}
              className={`w-full md:w-[360px] px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              {practicalCandidates.length === 0 && <option value="">Keine Teilnehmer verfügbar</option>}
              {practicalCandidates.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.role || 'user'})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={`${darkMode ? 'bg-slate-700' : 'bg-cyan-50'} rounded-lg p-4 mb-4`}>
          <div className={`text-sm font-medium ${darkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>
            Aktive Prüfung: {selectedType.label}
          </div>
          <div className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Format: Zeit als mm:ss (z. B. 01:42) oder in Sekunden.
          </div>
          <div className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Teilnehmer: {selectedTargetUser?.name || user?.name || 'Unbekannt'}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {disciplines.map((discipline) => (
            <div
              key={discipline.id}
              className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} border rounded-xl p-4`}
            >
              <div className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {discipline.name}
              </div>
              <input
                type="text"
                value={practicalExamInputs[discipline.id] || ''}
                onChange={(event) => updatePracticalExamInput(discipline.id, event.target.value)}
                placeholder={discipline.inputPlaceholder || 'Wert eingeben'}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
              />
              {discipline.inputType === 'time_distance' && (
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={practicalExamInputs[`${discipline.id}_distance`] || ''}
                  onChange={(event) => updatePracticalExamInput(`${discipline.id}_distance`, event.target.value)}
                  placeholder={discipline.distancePlaceholder || 'Strecke in m'}
                  className={`w-full mt-2 px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                  }`}
                />
              )}
              <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {discipline.inputType === 'time' && 'Zeit-Eingabe'}
                {discipline.inputType === 'grade' && 'Direkte Note'}
                {discipline.inputType === 'time_distance' && 'Zeit + Strecke'}
                {discipline.required === false ? ' (optional)' : ' (pflicht)'}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={evaluatePracticalExam}
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
          >
            Note berechnen
          </button>
          <button
            onClick={resetPracticalExam}
            className={`${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} px-6 py-3 rounded-lg font-bold transition-all`}
          >
            Eingaben zurücksetzen
          </button>
        </div>
      </div>

      {practicalExamResult && (
        <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Ergebnis {selectedType.label}
          </h3>
          <div className={`mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Teilnehmer: <strong>{practicalExamResult.userName || selectedTargetUser?.name || '-'}</strong>
          </div>
          <div className="space-y-2">
            {practicalExamResult.rows.map((row) => (
              <div
                key={row.id}
                className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-3 flex items-center justify-between gap-3`}
              >
                <div>
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{row.name}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Wert: {row.displayValue}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    {row.grade ? formatGradeLabel(row.grade, row.noteLabel) : 'Keine Note'}
                  </div>
                  {row.points !== null && row.points !== undefined && (
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {row.points} Punkte
                    </div>
                  )}
                  {row.gradingMissing && (
                    <div className={`text-xs ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                      Wertungstabelle fehlt
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-5 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} grid md:grid-cols-3 gap-3`}>
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3`}>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gewertete Disziplinen</div>
              <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{practicalExamResult.gradedCount}</div>
            </div>
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3`}>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Durchschnittsnote</div>
              <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {practicalExamResult.averageGrade !== null ? practicalExamResult.averageGrade.toFixed(2) : '-'}
              </div>
            </div>
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3`}>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</div>
              <div className={`text-xl font-bold ${
                practicalExamResult.passed === null
                  ? (darkMode ? 'text-gray-300' : 'text-gray-700')
                  : practicalExamResult.passed
                    ? (darkMode ? 'text-green-400' : 'text-green-600')
                    : (darkMode ? 'text-red-400' : 'text-red-600')
              }`}>
                {practicalExamResult.passed === null
                  ? 'offen'
                  : practicalExamResult.passed ? 'bestanden' : 'nicht bestanden'}
              </div>
            </div>
          </div>

          {practicalExamResult.missingTables > 0 && (
            <div className={`mt-4 text-sm ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
              Hinweis: {practicalExamResult.missingTables} Disziplin(en) haben noch keine Wertungstabelle.
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => exportPracticalExamToPdf()}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              📄 Als PDF exportieren
            </button>
            <button
              onClick={() => void loadPracticalExamHistory()}
              className={`${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} px-4 py-2 rounded-lg font-medium`}
            >
              Historie aktualisieren
            </button>
          </div>
        </div>
      )}

      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            🏁 Schnellste Zeiten je Disziplin
          </h3>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Basis: gespeicherte {selectedType.label}-Versuche
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {disciplineLeaders.map((entry) => (
            <div
              key={entry.discipline.id}
              className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3`}
            >
              <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {entry.discipline.name}
              </div>
              {(entry.discipline.inputType !== 'time' && entry.discipline.inputType !== 'time_distance') ? (
                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Keine Zeit-Bestenliste (Notenfach).
                </div>
              ) : !entry.best ? (
                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Noch keine gültige Zeit vorhanden.
                </div>
              ) : (
                <div className="mt-1 space-y-1">
                  <div className={`text-lg font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    {formatSecondsAsTime(entry.best.seconds)}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {entry.best.userName}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatAttemptDate(entry.best.createdAt)} • {entry.best.row?.grade ? formatGradeLabel(entry.best.row.grade, entry.best.row.noteLabel) : 'Keine Note'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            🗂️ Versuchshistorie
          </h3>
          <div className="flex flex-wrap gap-2">
            <select
              value={practicalExamHistoryTypeFilter}
              onChange={(event) => setPracticalExamHistoryTypeFilter(event.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="alle">Alle Prüfungen</option>
              {PRACTICAL_EXAM_TYPES.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
            {canManageAllPractical && (
              <select
                value={practicalExamHistoryUserFilter}
                onChange={(event) => setPracticalExamHistoryUserFilter(event.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              >
                <option value="all">Alle Teilnehmer</option>
                {practicalCandidates.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.role || 'user'})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {practicalExamHistoryLoading ? (
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Historie wird geladen...
          </div>
        ) : historyFiltered.length === 0 ? (
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Noch keine gespeicherten Versuche vorhanden.
          </div>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {historyFiltered.map((attempt) => (
              <div
                key={attempt.id}
                className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3`}
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {attempt.user_name} • {attemptTypeLabel(attempt.exam_type)}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatAttemptDate(attempt.created_at)} {attempt.source === 'local' ? '• lokal gespeichert' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      {Number.isFinite(Number(attempt.average_grade)) ? `Ø ${Number(attempt.average_grade).toFixed(2)}` : 'Ø -'}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {attempt.passed === null ? 'offen' : attempt.passed ? 'bestanden' : 'nicht bestanden'}
                    </div>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  {(attempt.rows || []).map((row) => (
                    <div key={`${attempt.id}-${row.id}`} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {row.name}: {row.displayValue} • {row.grade ? formatGradeLabel(row.grade, row.noteLabel) : 'Keine Note'}
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => exportPracticalExamToPdf(attempt)}
                    className={`${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} px-3 py-1.5 rounded-lg text-sm`}
                  >
                    📄 PDF exportieren
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {canManageAllPractical && (
        <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              🧭 Trainer-Vergleich (alle Teilnehmer)
            </h3>
            <select
              value={practicalExamComparisonType}
              onChange={(event) => setPracticalExamComparisonType(event.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="alle">Alle Prüfungen</option>
              {PRACTICAL_EXAM_TYPES.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          {comparisonRows.length === 0 ? (
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Noch keine Vergleichsdaten vorhanden.
            </div>
          ) : (
            <div className="space-y-2">
              {comparisonRows.map((row, index) => (
                <div
                  key={row.userId}
                  className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-3 flex flex-wrap items-center justify-between gap-3`}
                >
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {index + 1}. {row.userName}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {row.attemptsCount} Versuch(e)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Beste Note: {Number.isFinite(Number(row.best?.average_grade)) ? Number(row.best.average_grade).toFixed(2) : '-'}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Letzter Versuch: {Number.isFinite(Number(row.latest?.average_grade)) ? Number(row.latest.average_grade).toFixed(2) : '-'} ({formatAttemptDate(row.latest?.created_at)})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
})()}

{examSimulatorMode === 'theory' && userExamProgress && (
  <div className="max-w-4xl mx-auto">
    <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-8 shadow-lg text-center ${userExamProgress.passed ? 'animate-exam-pass' : ''}`}>
      <div className="text-6xl mb-4">{userExamProgress.passed ? '🎉' : '📚'}</div>
      <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {userExamProgress.passed ? 'Bestanden!' : 'Nicht bestanden'}
      </h2>
      <div className={`${userExamProgress.passed ? 'bg-green-500' : 'bg-red-500'} text-white rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6`}>
        <div className="text-4xl font-bold">{userExamProgress.percentage}%</div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-4`}>
          <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {userExamProgress.correct}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Richtig</div>
        </div>
        <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-4`}>
          <div className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            {userExamProgress.total - userExamProgress.correct}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Falsch</div>
        </div>
        <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-4`}>
          <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
            {Math.round(userExamProgress.timeMs / 60000)}min
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dauer</div>
        </div>
      </div>
      <button
        onClick={resetExam}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg"
      >
        Neue Prüfung starten
      </button>
    </div>
  </div>
)}

    </>
  );
};

export default ExamSimulatorView;
