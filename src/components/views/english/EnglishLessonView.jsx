import React, { useState, useMemo } from 'react';
import { BookOpen, Clock, AlertTriangle, Info, Lightbulb, MessageSquare, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { getEnglishLesson } from '../../../data/english';

const LEVEL_COLORS = {
  A1: { bg: 'bg-emerald-500', text: 'text-emerald-700', soft: 'bg-emerald-50', border: 'border-emerald-200' },
  A2: { bg: 'bg-teal-500', text: 'text-teal-700', soft: 'bg-teal-50', border: 'border-teal-200' },
  B1: { bg: 'bg-blue-500', text: 'text-blue-700', soft: 'bg-blue-50', border: 'border-blue-200' },
  B2: { bg: 'bg-indigo-500', text: 'text-indigo-700', soft: 'bg-indigo-50', border: 'border-indigo-200' },
};

const INFO_VARIANTS = {
  tip: { icon: Lightbulb, color: 'emerald', label: 'Tipp' },
  info: { icon: Info, color: 'blue', label: 'Gut zu wissen' },
  warning: { icon: AlertTriangle, color: 'amber', label: 'Achtung' },
};

const VocabTable = ({ items, darkMode }) => (
  <div className={`rounded-xl border overflow-hidden ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
    <div className={`grid grid-cols-[1fr_1fr] gap-px ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
      <div className={`px-3 py-2 text-[11px] font-mono uppercase tracking-wider ${darkMode ? 'bg-slate-900 text-indigo-300' : 'bg-gray-50 text-indigo-700'}`}>
        English
      </div>
      <div className={`px-3 py-2 text-[11px] font-mono uppercase tracking-wider ${darkMode ? 'bg-slate-900 text-indigo-300' : 'bg-gray-50 text-indigo-700'}`}>
        Deutsch
      </div>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <div className={`px-3 py-2 text-sm font-medium ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
            {item.en}
          </div>
          <div className={`px-3 py-2 text-sm ${darkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-gray-700'}`}>
            {item.de}
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
);

const AlphabetGrid = ({ items, darkMode }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
    {items.map((item) => (
      <div
        key={item.letter}
        className={`rounded-lg p-3 border ${darkMode ? 'bg-slate-800/60 border-white/10' : 'bg-white border-gray-200'}`}
      >
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>{item.letter}</span>
          <span className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{item.pron}</span>
        </div>
        <p className={`text-xs mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{item.hint}</p>
      </div>
    ))}
  </div>
);

const InfoBox = ({ variant, title, bullets, darkMode }) => {
  const v = INFO_VARIANTS[variant] || INFO_VARIANTS.info;
  const Icon = v.icon;
  const colorMap = {
    emerald: { border: 'border-emerald-300', bg: darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50', text: darkMode ? 'text-emerald-200' : 'text-emerald-800', icon: darkMode ? 'text-emerald-300' : 'text-emerald-600' },
    blue: { border: 'border-blue-300', bg: darkMode ? 'bg-blue-500/10' : 'bg-blue-50', text: darkMode ? 'text-blue-200' : 'text-blue-800', icon: darkMode ? 'text-blue-300' : 'text-blue-600' },
    amber: { border: 'border-amber-300', bg: darkMode ? 'bg-amber-500/10' : 'bg-amber-50', text: darkMode ? 'text-amber-200' : 'text-amber-800', icon: darkMode ? 'text-amber-300' : 'text-amber-600' },
  };
  const c = colorMap[v.color];
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
      <div className="flex items-start gap-2 mb-2">
        <Icon size={18} className={c.icon} />
        <div className={`font-semibold ${c.text}`}>{title || v.label}</div>
      </div>
      <ul className={`space-y-1.5 text-sm ${c.text} list-disc pl-6`}>
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    </div>
  );
};

const Dialog = ({ setting, lines, darkMode }) => (
  <div className={`rounded-xl border p-4 ${darkMode ? 'bg-slate-800/60 border-white/10' : 'bg-indigo-50/60 border-indigo-200'}`}>
    {setting && (
      <div className={`text-xs italic mb-3 flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
        <MessageSquare size={14} />
        {setting}
      </div>
    )}
    <div className="space-y-3">
      {lines.map((line, i) => (
        <div key={i}>
          <div className={`text-[11px] font-mono uppercase tracking-wider mb-0.5 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
            {line.speaker}
          </div>
          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            „{line.en}"
          </div>
          <div className={`text-sm italic ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {line.de}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuickCheck = ({ questions, darkMode }) => {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);

  const score = useMemo(() => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct += 1;
    });
    return correct;
  }, [answers, questions]);

  const allAnswered = Object.keys(answers).length === questions.length;

  const handleReset = () => {
    setAnswers({});
    setRevealed(false);
  };

  return (
    <div className={`rounded-xl border p-4 ${darkMode ? 'bg-slate-800/60 border-white/10' : 'bg-white border-gray-200'}`}>
      <div className="space-y-5">
        {questions.map((q, qi) => {
          const selected = answers[qi];
          const isCorrect = selected === q.correct;
          return (
            <div key={qi}>
              <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {qi + 1}. {q.q}
              </div>
              <div className="space-y-1.5">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const showAsCorrect = revealed && oi === q.correct;
                  const showAsWrong = revealed && isSelected && oi !== q.correct;
                  return (
                    <button
                      key={oi}
                      onClick={() => !revealed && setAnswers({ ...answers, [qi]: oi })}
                      disabled={revealed}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                        showAsCorrect
                          ? 'bg-emerald-500/15 border-emerald-400 text-emerald-700 font-medium'
                          : showAsWrong
                            ? 'bg-red-500/15 border-red-400 text-red-700'
                            : isSelected
                              ? darkMode
                                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                                : 'bg-indigo-100 border-indigo-400 text-indigo-800'
                              : darkMode
                                ? 'bg-slate-900 border-white/10 text-slate-200 hover:border-indigo-400'
                                : 'bg-white border-gray-200 text-gray-800 hover:border-indigo-400'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {showAsCorrect && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                        {showAsWrong && <XCircle size={16} className="text-red-600 shrink-0" />}
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
              {revealed && q.explanation && (
                <div className={`mt-2 text-xs px-3 py-2 rounded-lg ${isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3 flex-wrap">
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            disabled={!allAnswered}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              allAnswered
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Auswerten
          </button>
        ) : (
          <>
            <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${score === questions.length ? 'bg-emerald-500 text-white' : score >= questions.length / 2 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}>
              {score} / {questions.length} richtig
            </div>
            <button
              onClick={handleReset}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium inline-flex items-center gap-1.5 ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              <RotateCcw size={14} />
              Nochmal
            </button>
          </>
        )}
        {!allAnswered && !revealed && (
          <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Bitte alle Fragen beantworten.
          </span>
        )}
      </div>
    </div>
  );
};

const renderSection = (section, idx, darkMode) => {
  const header = (
    <div className="mb-3">
      <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {section.title}
      </h3>
      {section.subtitle && (
        <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          {section.subtitle}
        </p>
      )}
    </div>
  );

  let body = null;
  switch (section.type) {
    case 'vocab':
      body = <VocabTable items={section.items} darkMode={darkMode} />;
      break;
    case 'alphabet':
      body = <AlphabetGrid items={section.items} darkMode={darkMode} />;
      break;
    case 'info':
      return (
        <div key={idx}>
          <InfoBox variant={section.variant} title={section.title} bullets={section.bullets} darkMode={darkMode} />
        </div>
      );
    case 'dialog':
      body = <Dialog setting={section.setting} lines={section.lines} darkMode={darkMode} />;
      break;
    case 'quick-check':
      body = <QuickCheck questions={section.questions} darkMode={darkMode} />;
      break;
    default:
      body = null;
  }

  return (
    <div key={idx}>
      {header}
      {body}
    </div>
  );
};

export default function EnglishLessonView({ darkMode, lessonId }) {
  const lesson = getEnglishLesson(lessonId);

  if (!lesson) {
    return (
      <div className={`rounded-xl border p-4 ${darkMode ? 'bg-slate-800/60 border-white/10 text-slate-300' : 'bg-white border-gray-200 text-gray-700'}`}>
        Diese Lektion wurde nicht gefunden.
      </div>
    );
  }

  const levelClass = LEVEL_COLORS[lesson.level] || LEVEL_COLORS.A1;

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${levelClass.bg} text-white`}>
                {lesson.level}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono text-cyan-100">
                <Clock size={12} /> ca. {lesson.estimatedMinutes} Min
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono text-cyan-100">
                <BookOpen size={12} /> English
              </span>
            </div>
            <h2 className="text-xl font-bold">{lesson.title}</h2>
            <p className="text-sm mt-2 text-cyan-50">{lesson.intro}</p>
          </div>
          <div className="text-4xl shrink-0">{lesson.icon}</div>
        </div>
      </div>

      <div className="space-y-5">
        {lesson.sections.map((section, idx) => renderSection(section, idx, darkMode))}
      </div>

      <div className={`rounded-xl border p-4 text-center text-sm ${darkMode ? 'bg-slate-800/40 border-white/10 text-slate-300' : 'bg-indigo-50 border-indigo-200 text-indigo-900'}`}>
        <strong>Lektion abgeschlossen?</strong> Oben links kommst du zurück zur Übersicht — dort findest du die nächsten Lektionen.
      </div>
    </div>
  );
}
