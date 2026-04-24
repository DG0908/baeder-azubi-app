import { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, FileText, RefreshCw, CheckCircle2, XCircle, Eye, EyeOff, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { matchesAny, scoreOpenList, scoreKeywordAnswer } from '../../lib/worksheetMatching';

const PAGE_REFERENCE = 'reference';
const PAGE_EXERCISE = 'exercise';

const buildInitialAnswers = (worksheet) => {
  const answers = {};
  worksheet.exercise.tasks.forEach((task) => {
    if (task.type === 'numbered-labels') {
      answers[task.id] = Object.fromEntries(task.items.map((item) => [item.number, '']));
    } else if (task.type === 'open-list') {
      answers[task.id] = Array.from({ length: task.expectedCount }, () => '');
    } else if (task.type === 'labels') {
      answers[task.id] = task.items.map(() => '');
    } else if (task.type === 'keyword-text') {
      answers[task.id] = task.items.map(() => '');
    }
  });
  return answers;
};

const gradeWorksheet = (worksheet, answers) => {
  const report = {};
  let totalCorrect = 0;
  let totalPossible = 0;
  worksheet.exercise.tasks.forEach((task) => {
    if (task.type === 'numbered-labels') {
      const perItem = {};
      let correct = 0;
      task.items.forEach((item) => {
        const value = answers[task.id][item.number] || '';
        const ok = matchesAny(value, item.accept);
        perItem[item.number] = { ok, value };
        if (ok) correct += 1;
      });
      report[task.id] = { correct, total: task.items.length, perItem };
      totalCorrect += correct;
      totalPossible += task.items.length;
    } else if (task.type === 'open-list') {
      const result = scoreOpenList(answers[task.id], task.pool);
      report[task.id] = { ...result };
      totalCorrect += result.correct;
      totalPossible += result.total;
    } else if (task.type === 'labels') {
      const perItem = task.items.map((item, i) => {
        const value = answers[task.id][i] || '';
        return { ok: matchesAny(value, item.accept), value };
      });
      const correct = perItem.filter((r) => r.ok).length;
      report[task.id] = { correct, total: task.items.length, perItem };
      totalCorrect += correct;
      totalPossible += task.items.length;
    } else if (task.type === 'keyword-text') {
      const perItem = task.items.map((item, i) => {
        const value = answers[task.id][i] || '';
        const result = scoreKeywordAnswer(value, item.keywords, item.minMatches || 1);
        return { ok: result.ok, matched: result.matched, value };
      });
      const correct = perItem.filter((r) => r.ok).length;
      report[task.id] = { correct, total: task.items.length, perItem };
      totalCorrect += correct;
      totalPossible += task.items.length;
    }
  });
  return { report, totalCorrect, totalPossible };
};

const ReferencePage = ({ worksheet, darkMode }) => {
  const ref = worksheet.reference;
  const [imgError, setImgError] = useState(false);
  return (
    <div className="space-y-5">
      {ref.image && !imgError && (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20">
          <img
            src={ref.image}
            alt={ref.alt || worksheet.title}
            className="w-full h-auto block"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      {imgError && (
        <div className={`rounded-2xl p-4 text-sm ${darkMode ? 'bg-amber-500/10 text-amber-200' : 'bg-amber-50 text-amber-800'}`}>
          Lernblatt-Bild nicht gefunden. Lege die PNG unter <code>public{ref.image}</code> ab.
        </div>
      )}
      {ref.intro && (
        <p className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} leading-relaxed`}>{ref.intro}</p>
      )}
      {ref.sections?.map((section) => (
        <div key={section.heading} className="glass-card rounded-2xl p-5">
          <h3 className={`font-bold mb-3 ${darkMode ? 'text-cyan-300' : 'text-gray-800'}`}>{section.heading}</h3>
          <ul className="space-y-2">
            {section.items.map((item) => (
              <li key={item.label} className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}:</span>{' '}
                {item.body}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const inputClasses = (darkMode, state) => {
  const base = 'w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition-colors';
  if (state === 'ok') {
    return `${base} ${darkMode ? 'bg-emerald-500/15 border-emerald-400/60 text-emerald-100' : 'bg-emerald-50 border-emerald-500 text-emerald-900'}`;
  }
  if (state === 'wrong') {
    return `${base} ${darkMode ? 'bg-rose-500/15 border-rose-400/60 text-rose-100' : 'bg-rose-50 border-rose-500 text-rose-900'}`;
  }
  return `${base} ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/80 border-gray-300'}`;
};

const stateOf = (submitted, ok) => {
  if (!submitted) return 'neutral';
  return ok ? 'ok' : 'wrong';
};

const FeedbackIcon = ({ ok }) =>
  ok ? <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" /> : <XCircle size={18} className="text-rose-500 flex-shrink-0" />;

const NumberedLabelsTask = ({ task, value, onChange, submitted, report, showSolutions, darkMode }) => (
  <div className="glass-card rounded-2xl p-5">
    <h3 className={`font-bold mb-1 ${darkMode ? 'text-cyan-300' : 'text-gray-800'}`}>{task.title}</h3>
    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{task.prompt}</p>
    <div className="grid md:grid-cols-2 gap-2">
      {task.items.map((item) => {
        const itemReport = submitted ? report?.perItem?.[item.number] : null;
        return (
          <div key={item.number} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${darkMode ? 'bg-blue-500/30 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
              {item.number}
            </div>
            <input
              type="text"
              value={value[item.number] || ''}
              onChange={(e) => onChange(item.number, e.target.value)}
              disabled={submitted}
              placeholder="Bezeichnung…"
              className={inputClasses(darkMode, stateOf(submitted, itemReport?.ok))}
            />
            {submitted && <FeedbackIcon ok={itemReport?.ok} />}
          </div>
        );
      })}
    </div>
    {showSolutions && (
      <div className={`mt-4 rounded-xl p-3 text-sm ${darkMode ? 'bg-white/5 text-gray-200' : 'bg-blue-50 text-gray-700'}`}>
        <strong>Lösungen: </strong>
        {task.items.map((item) => `${item.number}. ${item.accept[0]}`).join(' · ')}
      </div>
    )}
  </div>
);

const OpenListTask = ({ task, value, onChange, submitted, report, showSolutions, darkMode }) => (
  <div className="glass-card rounded-2xl p-5">
    <h3 className={`font-bold mb-1 ${darkMode ? 'text-cyan-300' : 'text-gray-800'}`}>{task.title}</h3>
    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{task.prompt}</p>
    <div className="grid md:grid-cols-2 gap-2">
      {value.map((entry, i) => {
        const itemReport = submitted ? report?.perInput?.[i] : null;
        return (
          <div key={i} className="flex items-center gap-2">
            <span className={`w-8 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{i + 1}.</span>
            <input
              type="text"
              value={entry}
              onChange={(e) => onChange(i, e.target.value)}
              disabled={submitted}
              placeholder="Funktion…"
              className={inputClasses(darkMode, stateOf(submitted, itemReport?.ok))}
            />
            {submitted && <FeedbackIcon ok={itemReport?.ok} />}
          </div>
        );
      })}
    </div>
    {showSolutions && (
      <div className={`mt-4 rounded-xl p-3 text-sm ${darkMode ? 'bg-white/5 text-gray-200' : 'bg-blue-50 text-gray-700'}`}>
        <strong>Lösungen: </strong>
        {task.pool.map((entry) => entry.accept[0]).join(' · ')}
      </div>
    )}
  </div>
);

const LabelsTask = ({ task, value, onChange, submitted, report, showSolutions, darkMode }) => (
  <div className="glass-card rounded-2xl p-5">
    <h3 className={`font-bold mb-1 ${darkMode ? 'text-cyan-300' : 'text-gray-800'}`}>{task.title}</h3>
    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{task.prompt}</p>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
      {task.items.map((item, i) => {
        const itemReport = submitted ? report?.perItem?.[i] : null;
        return (
          <div key={i} className={`rounded-xl p-3 ${darkMode ? 'bg-white/5' : 'bg-white/60'}`}>
            <div className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.hint}</div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={value[i] || ''}
                onChange={(e) => onChange(i, e.target.value)}
                disabled={submitted}
                placeholder="Bezeichnung…"
                className={inputClasses(darkMode, stateOf(submitted, itemReport?.ok))}
              />
              {submitted && <FeedbackIcon ok={itemReport?.ok} />}
            </div>
          </div>
        );
      })}
    </div>
    {showSolutions && (
      <div className={`mt-4 rounded-xl p-3 text-sm ${darkMode ? 'bg-white/5 text-gray-200' : 'bg-blue-50 text-gray-700'}`}>
        <strong>Lösungen: </strong>
        {task.items.map((item) => item.accept[0]).join(' · ')}
      </div>
    )}
  </div>
);

const KeywordTextTask = ({ task, value, onChange, submitted, report, showSolutions, darkMode }) => (
  <div className="glass-card rounded-2xl p-5">
    <h3 className={`font-bold mb-3 ${darkMode ? 'text-cyan-300' : 'text-gray-800'}`}>{task.title}</h3>
    <div className="space-y-4">
      {task.items.map((item, i) => {
        const itemReport = submitted ? report?.perItem?.[i] : null;
        return (
          <div key={i}>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {item.prompt}
            </label>
            <div className="flex items-start gap-2">
              <textarea
                value={value[i] || ''}
                onChange={(e) => onChange(i, e.target.value)}
                disabled={submitted}
                rows={2}
                placeholder="Deine Antwort…"
                className={inputClasses(darkMode, stateOf(submitted, itemReport?.ok))}
              />
              {submitted && <div className="pt-2"><FeedbackIcon ok={itemReport?.ok} /></div>}
            </div>
            {submitted && !itemReport?.ok && (
              <p className={`text-xs mt-1 ${darkMode ? 'text-rose-200' : 'text-rose-700'}`}>
                Schlüsselbegriffe fehlen. Mindestens {item.minMatches || 1} aus: {item.keywords.slice(0, 6).join(', ')}…
              </p>
            )}
            {showSolutions && item.sampleAnswer && (
              <p className={`text-xs mt-2 italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Musterlösung: {item.sampleAnswer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const ExercisePage = ({ worksheet, answers, setAnswers, submitted, onSubmit, onReset, report, showSolutions, toggleSolutions, totals, darkMode }) => {
  const ex = worksheet.exercise;
  const [imgError, setImgError] = useState(false);

  const updateNumbered = (taskId) => (number, v) =>
    setAnswers((prev) => ({ ...prev, [taskId]: { ...prev[taskId], [number]: v } }));
  const updateArray = (taskId) => (index, v) =>
    setAnswers((prev) => {
      const next = [...prev[taskId]];
      next[index] = v;
      return { ...prev, [taskId]: next };
    });

  return (
    <div className="space-y-5">
      {ex.image && !imgError && (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20">
          <img
            src={ex.image}
            alt={ex.alt || worksheet.title}
            className="w-full h-auto block"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      {imgError && (
        <div className={`rounded-2xl p-4 text-sm ${darkMode ? 'bg-amber-500/10 text-amber-200' : 'bg-amber-50 text-amber-800'}`}>
          Arbeitsblatt-Bild nicht gefunden. Lege die PNG unter <code>public{ex.image}</code> ab.
        </div>
      )}

      {ex.tasks.map((task) => {
        const taskAnswers = answers[task.id];
        const taskReport = report?.[task.id];
        const common = { task, submitted, report: taskReport, showSolutions, darkMode };
        if (task.type === 'numbered-labels') {
          return <NumberedLabelsTask key={task.id} {...common} value={taskAnswers} onChange={updateNumbered(task.id)} />;
        }
        if (task.type === 'open-list') {
          return <OpenListTask key={task.id} {...common} value={taskAnswers} onChange={updateArray(task.id)} />;
        }
        if (task.type === 'labels') {
          return <LabelsTask key={task.id} {...common} value={taskAnswers} onChange={updateArray(task.id)} />;
        }
        if (task.type === 'keyword-text') {
          return <KeywordTextTask key={task.id} {...common} value={taskAnswers} onChange={updateArray(task.id)} />;
        }
        return null;
      })}

      <div className="sticky bottom-4 z-10">
        <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-3 justify-between">
          {submitted ? (
            <div className="flex items-center gap-3">
              <Award className="text-amber-400" size={28} />
              <div>
                <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {totals.totalCorrect} / {totals.totalPossible} richtig
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {Math.round((totals.totalCorrect / Math.max(totals.totalPossible, 1)) * 100)}% — {totals.totalCorrect === totals.totalPossible ? 'Perfekt!' : 'Gut gemacht, probier die falschen nochmal.'}
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Fülle alle Felder aus und klicke „Abgeben".
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {submitted && (
              <button
                onClick={toggleSolutions}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
              >
                {showSolutions ? <EyeOff size={16} /> : <Eye size={16} />}
                {showSolutions ? 'Lösungen verbergen' : 'Lösungen zeigen'}
              </button>
            )}
            {submitted ? (
              <button
                onClick={onReset}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Nochmal
              </button>
            ) : (
              <button
                onClick={onSubmit}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                Abgeben
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const WorksheetPlayer = ({ worksheet, onBack }) => {
  const { darkMode } = useApp();
  const [page, setPage] = useState(PAGE_REFERENCE);
  const [answers, setAnswers] = useState(() => buildInitialAnswers(worksheet));
  const [submitted, setSubmitted] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);

  const grading = useMemo(() => (submitted ? gradeWorksheet(worksheet, answers) : null), [submitted, worksheet, answers]);

  const reset = () => {
    setAnswers(buildInitialAnswers(worksheet));
    setSubmitted(false);
    setShowSolutions(false);
  };

  const submit = () => {
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-5">
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900' : 'bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500'} text-white rounded-2xl p-6 shadow-lg`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-white/80 hover:text-white text-sm mb-2"
            >
              <ArrowLeft size={16} />
              Zurück zur Übersicht
            </button>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <span aria-hidden>{worksheet.icon}</span>
              {worksheet.title}
            </h2>
            {worksheet.subtitle && <p className="text-white/80 mt-1">{worksheet.subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-2 flex gap-2">
        <button
          onClick={() => setPage(PAGE_REFERENCE)}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
            page === PAGE_REFERENCE
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
              : darkMode
                ? 'text-gray-200 hover:bg-white/5'
                : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <BookOpen size={18} />
          Lernblatt
        </button>
        <button
          onClick={() => setPage(PAGE_EXERCISE)}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
            page === PAGE_EXERCISE
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
              : darkMode
                ? 'text-gray-200 hover:bg-white/5'
                : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <FileText size={18} />
          Arbeitsblatt
        </button>
      </div>

      {page === PAGE_REFERENCE ? (
        <ReferencePage worksheet={worksheet} darkMode={darkMode} />
      ) : (
        <ExercisePage
          worksheet={worksheet}
          answers={answers}
          setAnswers={setAnswers}
          submitted={submitted}
          onSubmit={submit}
          onReset={reset}
          report={grading?.report}
          showSolutions={showSolutions}
          toggleSolutions={() => setShowSolutions((v) => !v)}
          totals={grading ? { totalCorrect: grading.totalCorrect, totalPossible: grading.totalPossible } : { totalCorrect: 0, totalPossible: 0 }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default WorksheetPlayer;
