import { PartyPopper, BookOpenCheck, RefreshCw, Check, X, Timer } from 'lucide-react';
import { glassCard, sectionAccent } from './examUi';

const TheoryExamResult = ({ darkMode, userExamProgress, resetExam }) => {
  const passed = userExamProgress.passed;
  return (
    <div className={`${glassCard} ${passed ? 'animate-exam-pass' : ''}`}>
      <div
        className={sectionAccent(
          passed ? 'from-emerald-500 via-green-500 to-teal-500' : 'from-rose-500 via-orange-500 to-amber-500',
        )}
      />
      <div className="text-center">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 ${
            passed
              ? darkMode
                ? 'bg-emerald-900/40 text-emerald-300'
                : 'bg-emerald-100 text-emerald-600'
              : darkMode
                ? 'bg-rose-900/40 text-rose-300'
                : 'bg-rose-100 text-rose-600'
          }`}
        >
          {passed ? <PartyPopper size={32} /> : <BookOpenCheck size={32} />}
        </div>
        <h2 className="text-3xl font-bold mb-3 text-gray-800">
          {passed ? 'Bestanden!' : 'Nicht bestanden'}
        </h2>
        <div
          className={`${
            passed
              ? 'bg-gradient-to-br from-emerald-500 to-green-500'
              : 'bg-gradient-to-br from-rose-500 to-red-500'
          } text-white rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6 shadow-lg`}
        >
          <div className="text-4xl font-bold">{userExamProgress.percentage}%</div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div
            className={`rounded-xl p-4 ${
              darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-emerald-500">
              <Check size={16} />
              <div className="text-2xl font-bold">{userExamProgress.correct}</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Richtig</div>
          </div>
          <div
            className={`rounded-xl p-4 ${
              darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-rose-500">
              <X size={16} />
              <div className="text-2xl font-bold">
                {userExamProgress.total - userExamProgress.correct}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Falsch</div>
          </div>
          <div
            className={`rounded-xl p-4 ${
              darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-gray-200'
            }`}
          >
            <div className={`flex items-center justify-center gap-1.5 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
              <Timer size={16} />
              <div className="text-2xl font-bold">
                {Math.round(userExamProgress.timeMs / 60000)} min
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Dauer</div>
          </div>
        </div>

        <button
          onClick={resetExam}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mx-auto transition-all"
        >
          <RefreshCw size={18} />
          Neue Prüfung starten
        </button>
      </div>
    </div>
  );
};

export default TheoryExamResult;
