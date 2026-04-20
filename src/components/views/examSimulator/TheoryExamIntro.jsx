import { Rocket, Brain, Sparkles, CheckCircle2, XCircle, RefreshCw, Target } from 'lucide-react';
import { CATEGORIES } from '../../../data/constants';
import { glassCard, sectionAccent, subtleBoxClass } from './examUi';

const TheoryExamIntro = ({
  darkMode,
  user,
  adaptiveLearningEnabled,
  setAdaptiveLearningEnabled,
  examKeywordMode,
  setExamKeywordMode,
  loadExamProgress,
  playSound,
  theoryExamHistory,
  theoryExamHistoryLoading,
  loadTheoryExamHistory,
}) => {
  const canSeeAll = Boolean(user?.permissions?.canViewAllStats);
  const toggleBtn = (active, tone) => {
    const activeBg = tone === 'violet'
      ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm'
      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm';
    const inactiveBg = darkMode
      ? 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
      : 'bg-white/70 text-gray-700 hover:bg-white border border-gray-200';
    return `px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? activeBg : inactiveBg}`;
  };

  return (
    <div className={glassCard}>
      <div className={sectionAccent('from-blue-500 via-cyan-500 to-emerald-500')} />
      <div className="text-center mb-5">
        <div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 ${
            darkMode ? 'bg-cyan-900/40 text-cyan-300' : 'bg-cyan-100 text-cyan-600'
          }`}
        >
          <Sparkles size={28} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Theorie-Prüfung starten</h2>
        <p className="text-sm text-gray-600 mt-1">
          30 zufällige Fragen aus allen Kategorien – 50&nbsp;% zum Bestehen
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <div
          className={`flex items-center justify-between gap-3 p-3 rounded-xl border-l-4 ${
            darkMode
              ? 'bg-emerald-900/30 border-emerald-500 text-emerald-200'
              : 'bg-emerald-50 border-emerald-500 text-emerald-900'
          }`}
        >
          <div className="text-left">
            <p className="text-sm font-bold flex items-center gap-1.5">
              <Target size={14} /> Adaptiver Lernmodus
            </p>
            <p className="text-xs opacity-80">
              {adaptiveLearningEnabled
                ? 'Falsch beantwortete Fragen werden priorisiert.'
                : '30 Fragen im reinen Zufall.'}
            </p>
          </div>
          <button
            onClick={() => setAdaptiveLearningEnabled((prev) => !prev)}
            className={toggleBtn(adaptiveLearningEnabled, 'emerald')}
          >
            {adaptiveLearningEnabled ? 'Aktiv' : 'Aus'}
          </button>
        </div>

        <div
          className={`flex items-center justify-between gap-3 p-3 rounded-xl border-l-4 ${
            darkMode
              ? 'bg-violet-900/30 border-violet-500 text-violet-200'
              : 'bg-violet-50 border-violet-500 text-violet-900'
          }`}
        >
          <div className="text-left">
            <p className="text-sm font-bold flex items-center gap-1.5">
              <Brain size={14} /> Schlagwort-Modus
            </p>
            <p className="text-xs opacity-80">
              {examKeywordMode
                ? 'Fragen schriftlich beantworten – triff die Schlüsselbegriffe.'
                : 'Klassisches Multiple-Choice.'}
            </p>
          </div>
          <button
            onClick={() => setExamKeywordMode((prev) => !prev)}
            className={toggleBtn(examKeywordMode, 'violet')}
          >
            {examKeywordMode ? 'Aktiv' : 'Aus'}
          </button>
        </div>
      </div>

      <div className={`${subtleBoxClass(darkMode)} mb-5`}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`}>30</div>
            <div className="text-xs text-gray-500">Fragen</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`}>
              {CATEGORIES.length}
            </div>
            <div className="text-xs text-gray-500">Kategorien</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`}>50 %</div>
            <div className="text-xs text-gray-500">Zum Bestehen</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          loadExamProgress();
          playSound('whistle');
        }}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all"
      >
        <Rocket size={20} />
        Prüfung starten
      </button>

      {!canSeeAll && (
        <div className={`${subtleBoxClass(darkMode)} mt-5 text-left`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-1.5">
              <Sparkles size={16} className={darkMode ? 'text-cyan-300' : 'text-cyan-600'} />
              Meine Ergebnisse
            </h3>
            <button
              onClick={loadTheoryExamHistory}
              className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${
                darkMode ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10' : 'bg-white/70 hover:bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <RefreshCw size={12} />
              Aktualisieren
            </button>
          </div>
          {theoryExamHistoryLoading ? (
            <p className="text-sm text-center py-3 text-gray-500">Laden…</p>
          ) : !theoryExamHistory || theoryExamHistory.length === 0 ? (
            <p className="text-sm text-center py-3 text-gray-500">Noch keine Prüfungen absolviert</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {theoryExamHistory.slice(0, 10).map((attempt) => (
                <div
                  key={attempt.id}
                  className={`flex justify-between items-center rounded-lg px-3 py-2 ${
                    darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                    {attempt.passed ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <XCircle size={14} className="text-rose-500" />
                    )}
                    <span className={attempt.passed ? 'text-emerald-600' : 'text-rose-600'}>
                      {attempt.percentage}%
                    </span>
                    <span className="ml-1 text-gray-600 text-xs">
                      ({attempt.correct}/{attempt.total})
                    </span>
                    {attempt.keyword_mode && (
                      <span
                        className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                          darkMode ? 'bg-violet-900/60 text-violet-300' : 'bg-violet-100 text-violet-700'
                        }`}
                      >
                        <Brain size={10} />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(attempt.created_at).toLocaleDateString('de-DE')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TheoryExamIntro;
