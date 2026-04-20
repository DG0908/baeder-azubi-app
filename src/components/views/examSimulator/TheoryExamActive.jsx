import {
  Brain,
  AlertTriangle,
  Square,
  CheckSquare,
  CheckCircle2,
  XCircle,
  Flag,
  Lightbulb,
} from 'lucide-react';
import { CATEGORIES } from '../../../data/constants';
import { formatAnswerLabel } from '../../../lib/utils';
import { glassCard, sectionAccent } from './examUi';

const TheoryExamActive = ({
  darkMode,
  examSimulator,
  examQuestionIndex,
  examCurrentQuestion,
  examAnswered,
  examSelectedAnswers,
  examSelectedAnswer,
  answerExamQuestion,
  reportQuestionIssue,
  confirmExamMultiSelectAnswer,
  examKeywordMode,
  examKeywordInput,
  setExamKeywordInput,
  examKeywordEvaluation,
  submitExamKeywordAnswer,
}) => {
  const correctCount = examSimulator.answers.filter((a) => a.correct).length;
  const categoryName = CATEGORIES.find((c) => c.id === examCurrentQuestion.category)?.name;

  return (
    <div className={glassCard}>
      <div className={sectionAccent('from-blue-500 via-cyan-500 to-emerald-500')} />

      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-800">
              Frage {examQuestionIndex + 1} / 30
            </span>
            {categoryName && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  darkMode ? 'bg-white/10 text-slate-200' : 'bg-white/70 text-gray-700 border border-gray-200'
                }`}
              >
                {categoryName}
              </span>
            )}
            {examKeywordMode && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-bold flex items-center gap-1 ${
                  darkMode ? 'bg-violet-900/60 text-violet-300' : 'bg-violet-100 text-violet-700'
                }`}
              >
                <Brain size={12} /> Schlagwort
              </span>
            )}
          </div>
          <div className={`flex items-center gap-1.5 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
            <span className="text-xl font-bold">{correctCount}</span>
            <span className="text-xs">Richtig</span>
          </div>
        </div>

        <div className={`w-full h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(examQuestionIndex / 30) * 100}%` }}
          />
        </div>

        <div className="flex gap-0.5 mt-1.5">
          {[0, 1, 2, 3, 4, 5].map((seg) => {
            const segStart = seg * 5;
            const completed = examQuestionIndex > segStart + 4;
            const active = examQuestionIndex >= segStart && examQuestionIndex <= segStart + 4;
            return (
              <div
                key={seg}
                className={`flex-1 h-1 rounded-full transition-all ${
                  completed
                    ? darkMode
                      ? 'bg-cyan-400'
                      : 'bg-cyan-500'
                    : active
                      ? darkMode
                        ? 'bg-cyan-600'
                        : 'bg-cyan-300'
                      : darkMode
                        ? 'bg-white/10'
                        : 'bg-gray-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      <div
        className={`rounded-xl p-5 mb-5 ${
          darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-gray-200'
        }`}
      >
        <p className="text-xl font-bold text-gray-800">{examCurrentQuestion.q}</p>
        {examCurrentQuestion.multi && !examAnswered && (
          <p className="text-sm text-orange-600 mt-2 font-medium flex items-center gap-1.5">
            <AlertTriangle size={14} />
            Mehrere Antworten sind richtig – wähle alle richtigen aus!
          </p>
        )}
      </div>

      {examKeywordMode ? (
        <div className="space-y-3">
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <Lightbulb size={12} />
            Singular und Plural werden beide erkannt – schreib, wie es natürlich klingt.
          </p>
          <textarea
            value={examKeywordInput}
            onChange={(e) => setExamKeywordInput(e.target.value)}
            disabled={examAnswered}
            rows={5}
            placeholder="Antworte in eigenen Worten und nenne die wichtigsten Schlüsselbegriffe..."
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-60 ${
              darkMode
                ? 'bg-white/5 border-white/10 text-white placeholder-slate-400'
                : 'bg-white/70 border-violet-200 text-gray-800'
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
            <div
              className={`rounded-xl border-2 p-4 ${
                examKeywordEvaluation.isCorrect
                  ? darkMode
                    ? 'border-emerald-500 bg-emerald-900/30'
                    : 'border-emerald-400 bg-emerald-50'
                  : darkMode
                    ? 'border-amber-500 bg-amber-900/30'
                    : 'border-amber-400 bg-amber-50'
              }`}
            >
              <p
                className={`font-bold flex items-center gap-1.5 ${
                  examKeywordEvaluation.isCorrect ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {examKeywordEvaluation.isCorrect ? (
                  <>
                    <CheckCircle2 size={16} /> Korrekt!
                  </>
                ) : (
                  <>
                    <AlertTriangle size={16} /> Nicht ausreichend.
                  </>
                )}
              </p>
              <p className="text-sm mt-1 text-gray-700">
                Treffer: {examKeywordEvaluation.matchedCount}/{examKeywordEvaluation.requiredGroups} erforderlich
              </p>
              {examKeywordEvaluation.matchedLabels?.length > 0 && (
                <p className="text-sm mt-1 text-emerald-700">
                  Erkannt: {examKeywordEvaluation.matchedLabels.join(', ')}
                </p>
              )}
              {examKeywordEvaluation.missingLabels?.length > 0 && (
                <p className="text-sm mt-1 text-amber-700">
                  Fehlte: {examKeywordEvaluation.missingLabels.join(', ')}
                </p>
              )}
              <p className="text-sm mt-2 pt-2 border-t border-black/10 text-gray-700">
                Korrekte Antwort:{' '}
                {examCurrentQuestion.multi && Array.isArray(examCurrentQuestion.correct)
                  ? examCurrentQuestion.correct
                      .map((idx) => formatAnswerLabel(examCurrentQuestion.a[idx]))
                      .join(' | ')
                  : formatAnswerLabel(examCurrentQuestion.a[examCurrentQuestion.correct])}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {examCurrentQuestion.a.map((answer, idx) => {
            const isMulti = examCurrentQuestion.multi;
            const isSelected = isMulti
              ? examSelectedAnswers.includes(idx)
              : examSelectedAnswer === idx;
            const answerLabel = formatAnswerLabel(examCurrentQuestion.displayAnswers?.[idx] ?? answer);
            const isCorrectAnswer = isMulti
              ? Array.isArray(examCurrentQuestion.correct)
                ? examCurrentQuestion.correct.includes(idx)
                : false
              : idx === examCurrentQuestion.correct;

            let buttonClass = '';
            if (examAnswered) {
              if (isCorrectAnswer) {
                buttonClass = 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-2 border-emerald-400 shadow-sm';
              } else if (isSelected && !isCorrectAnswer) {
                buttonClass = 'bg-gradient-to-r from-rose-500 to-red-500 text-white border-2 border-rose-400 shadow-sm';
              } else {
                buttonClass = darkMode
                  ? 'bg-white/5 text-gray-400 border-2 border-white/10'
                  : 'bg-white/60 text-gray-500 border-2 border-gray-200';
              }
            } else if (isMulti && isSelected) {
              buttonClass = 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-2 border-blue-400 shadow-sm';
            } else {
              buttonClass = darkMode
                ? 'bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-cyan-400 text-white'
                : 'bg-white/70 hover:bg-white border-2 border-gray-200 hover:border-blue-400 text-gray-800';
            }

            return (
              <button
                key={idx}
                onClick={() => answerExamQuestion(idx)}
                disabled={examAnswered}
                title={formatAnswerLabel(answer)}
                className={`p-4 rounded-xl font-medium transition-all text-left min-h-[4.5rem] flex items-start gap-2 ${buttonClass}`}
              >
                {isMulti && !examAnswered && (
                  <span className="flex-shrink-0 mt-0.5">
                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                  </span>
                )}
                <span className="flex-1">{answerLabel}</span>
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
            source: 'exam-simulator',
          });
        }}
        className={`w-full mt-3 py-2 rounded-xl font-semibold border flex items-center justify-center gap-2 transition-all ${
          darkMode
            ? 'bg-amber-900/30 hover:bg-amber-800/40 text-amber-200 border-amber-700/60'
            : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
        }`}
      >
        <Flag size={14} />
        Frage melden
      </button>

      {!examKeywordMode &&
        examCurrentQuestion.multi &&
        !examAnswered &&
        examSelectedAnswers.length > 0 && (
          <button
            onClick={confirmExamMultiSelectAnswer}
            className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} />
            Antwort bestätigen ({examSelectedAnswers.length} ausgewählt)
          </button>
        )}
    </div>
  );
};

export default TheoryExamActive;
