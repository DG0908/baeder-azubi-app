import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Siren,
  Heart,
  Waves,
  Biohazard,
  Bone,
  Phone,
  Droplet,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ChevronRight,
  Timer,
  Target,
  ListChecks,
  Hash,
  Pencil,
  Flame,
  PlayCircle,
  RotateCcw,
  List,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import scenariosData from '../../data/emergencyTrainerScenarios.json';

const DIFFICULTY_STYLE = {
  leicht: {
    label: 'Leicht',
    badge: 'bg-emerald-100 text-emerald-700',
    badgeDark: 'bg-emerald-900/40 text-emerald-300',
    bar: 'from-emerald-400 to-teal-500',
  },
  mittel: {
    label: 'Mittel',
    badge: 'bg-amber-100 text-amber-700',
    badgeDark: 'bg-amber-900/40 text-amber-300',
    bar: 'from-amber-400 to-orange-500',
  },
  schwer: {
    label: 'Schwer',
    badge: 'bg-rose-100 text-rose-700',
    badgeDark: 'bg-rose-900/40 text-rose-300',
    bar: 'from-rose-500 to-red-600',
  },
};

const CATEGORY_ICON = {
  'Erste Hilfe': Heart,
  Wasserrettung: Waves,
  Gefahrstoffe: Biohazard,
};

const SCENARIO_ICON_MAP = {
  '❤️': Heart,
  '🌊': Waves,
  '👦': Heart,
  '☣️': Biohazard,
  '🦴': Bone,
  '📞': Phone,
  '🩸': Droplet,
  '⚡': Zap,
};

const STEP_TYPE = {
  single_choice: { label: 'Auswahl', Icon: Target },
  ordering: { label: 'Reihenfolge', Icon: Hash },
  keyword_input: { label: 'Texteingabe', Icon: Pencil },
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const inputClass = (darkMode) =>
  `w-full rounded-xl border p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-400 ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder-slate-500'
      : 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-400'
  }`;

function TimerBar({ total, remaining, darkMode }) {
  const pct = (remaining / total) * 100;
  const color = pct > 50 ? 'bg-emerald-500' : pct > 20 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2">
      <Timer
        size={14}
        className={pct <= 20 ? 'text-rose-500' : darkMode ? 'text-slate-300' : 'text-gray-500'}
      />
      <span
        className={`text-xs font-mono font-bold w-10 text-right ${
          pct <= 20 ? 'text-rose-500' : darkMode ? 'text-slate-300' : 'text-gray-600'
        }`}
      >
        {formatTime(remaining)}
      </span>
      <div
        className={`flex-1 h-2 rounded-full overflow-hidden ${
          darkMode ? 'bg-white/10' : 'bg-gray-200'
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SingleChoiceStep({ step, onAnswer, darkMode }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const choose = (opt) => {
    if (revealed) return;
    setSelected(opt.id);
    setRevealed(true);
    setTimeout(() => {
      onAnswer({
        stepId: step.id,
        correct: opt.isCorrect,
        points: opt.isCorrect ? step.points : 0,
        selectedId: opt.id,
      });
    }, 1800);
  };

  return (
    <div>
      <p className="text-sm mb-4 leading-relaxed text-gray-800">{step.prompt}</p>
      <div className="space-y-2">
        {step.options.map((opt) => {
          const isSelected = selected === opt.id;
          const showResult = revealed && isSelected;
          let cardClass = darkMode
            ? 'bg-white/5 border-white/10 hover:bg-white/10'
            : 'bg-white/70 border-gray-200 hover:bg-white';
          if (showResult) {
            cardClass = opt.isCorrect
              ? darkMode
                ? 'bg-emerald-900/40 border-emerald-500'
                : 'bg-emerald-50 border-emerald-500'
              : darkMode
                ? 'bg-rose-900/40 border-rose-500'
                : 'bg-rose-50 border-rose-500';
          } else if (revealed && opt.isCorrect) {
            cardClass = darkMode
              ? 'bg-emerald-900/20 border-emerald-500'
              : 'bg-emerald-50 border-emerald-500';
          }
          return (
            <button
              key={opt.id}
              onClick={() => choose(opt)}
              className={`w-full text-left rounded-xl border-2 p-3 transition-all ${cardClass} ${
                !revealed ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="text-sm text-gray-800">{opt.text}</div>
              {showResult && (
                <div
                  className={`text-xs mt-1.5 flex items-start gap-1.5 ${
                    opt.isCorrect
                      ? darkMode
                        ? 'text-emerald-300'
                        : 'text-emerald-700'
                      : darkMode
                        ? 'text-rose-300'
                        : 'text-rose-700'
                  }`}
                >
                  {opt.isCorrect ? (
                    <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={14} className="flex-shrink-0 mt-0.5" />
                  )}
                  <span>{opt.feedback}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="mt-3 text-xs text-right text-gray-400">Weiter in wenigen Sekunden…</div>
      )}
    </div>
  );
}

function OrderingStep({ step, onAnswer, darkMode }) {
  const [shuffled] = useState(() => shuffleArray(step.items));
  const [order, setOrder] = useState([]);
  const [revealed, setRevealed] = useState(false);

  const toggle = (id) => {
    if (revealed) return;
    if (order.includes(id)) {
      setOrder(order.filter((o) => o !== id));
    } else {
      setOrder([...order, id]);
    }
  };

  const submit = () => {
    if (order.length !== step.items.length) return;
    setRevealed(true);
    let correct = 0;
    order.forEach((id, i) => {
      if (id === step.correctOrder[i]) correct++;
    });
    const ratio = correct / step.items.length;
    const pts = Math.round(step.points * ratio);
    const level = ratio === 1 ? 'success' : ratio >= 0.5 ? 'partial' : 'failure';
    setTimeout(() => {
      onAnswer({ stepId: step.id, correct: ratio >= 0.75, points: pts, level });
    }, 2200);
  };

  const reset = () => {
    if (!revealed) setOrder([]);
  };

  const allCorrect = order.every((id, i) => id === step.correctOrder[i]);
  const someCorrect = order.filter((id, i) => id === step.correctOrder[i]).length >= step.items.length * 0.5;

  return (
    <div>
      <p className="text-sm mb-3 leading-relaxed text-gray-800">{step.prompt}</p>
      <p className="text-xs mb-3 text-gray-500">
        Klicke die Aussagen in der richtigen Reihenfolge an. Bereits gewählte Punkte werden nummeriert.
      </p>
      <div className="space-y-2 mb-4">
        {shuffled.map((item) => {
          const pos = order.indexOf(item.id);
          const chosen = pos !== -1;
          let cardClass = chosen
            ? darkMode
              ? 'bg-cyan-900/30 border-cyan-500'
              : 'bg-cyan-50 border-cyan-400'
            : darkMode
              ? 'bg-white/5 border-white/10'
              : 'bg-white/70 border-gray-200';

          if (revealed) {
            const correctPos = step.correctOrder.indexOf(item.id);
            const isCorrectPos = order[correctPos] === item.id;
            cardClass = isCorrectPos
              ? darkMode
                ? 'bg-emerald-900/30 border-emerald-500'
                : 'bg-emerald-50 border-emerald-500'
              : darkMode
                ? 'bg-rose-900/30 border-rose-500'
                : 'bg-rose-50 border-rose-500';
          }

          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full text-left rounded-xl border-2 p-3 flex items-center gap-3 transition-all ${cardClass} ${
                !revealed ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                  chosen
                    ? 'bg-cyan-500 text-white'
                    : darkMode
                      ? 'bg-white/10 text-slate-400'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {chosen ? pos + 1 : '·'}
              </span>
              <span className="text-sm text-gray-800">{item.text}</span>
              {revealed && (
                <span
                  className={`ml-auto text-xs font-medium ${
                    order[step.correctOrder.indexOf(item.id)] === item.id
                      ? darkMode
                        ? 'text-emerald-400'
                        : 'text-emerald-600'
                      : darkMode
                        ? 'text-rose-400'
                        : 'text-rose-600'
                  }`}
                >
                  → {step.correctOrder.indexOf(item.id) + 1}. Stelle
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!revealed && (
        <div className="flex gap-2">
          <button
            onClick={submit}
            disabled={order.length !== step.items.length}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-sm"
          >
            <CheckCircle2 size={16} />
            Reihenfolge bestätigen ({order.length}/{step.items.length})
          </button>
          <button
            onClick={reset}
            className={`px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 ${
              darkMode
                ? 'bg-white/10 hover:bg-white/15 text-slate-300'
                : 'bg-white/70 hover:bg-white text-gray-600 border border-gray-200'
            }`}
          >
            <RotateCcw size={14} />
            Zurücksetzen
          </button>
        </div>
      )}

      {revealed && (
        <div
          className={`rounded-xl p-3 mt-2 border-l-4 ${
            allCorrect
              ? darkMode
                ? 'border-emerald-500 bg-emerald-900/20'
                : 'border-emerald-500 bg-emerald-50'
              : darkMode
                ? 'border-amber-500 bg-amber-900/20'
                : 'border-amber-500 bg-amber-50'
          }`}
        >
          <div className="text-xs text-gray-700">
            {allCorrect ? step.feedback.success : someCorrect ? step.feedback.partial : step.feedback.failure}
          </div>
        </div>
      )}
    </div>
  );
}

function KeywordInputStep({ step, onAnswer, darkMode }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const evaluate = () => {
    const lower = text.toLowerCase();
    const matched = step.keywordGroups.filter((group) =>
      group.some((kw) => lower.includes(kw.toLowerCase())),
    ).length;
    const total = step.keywordGroups.length;
    const passed = matched >= step.minimumGroupsRequired;
    const ratio = matched / total;
    const pts = Math.round(step.points * ratio);
    const level =
      matched >= step.minimumGroupsRequired
        ? 'success'
        : matched >= step.minimumGroupsRequired - 1
          ? 'partial'
          : 'failure';
    setResult({ matched, total, passed, pts, level });
    setTimeout(() => {
      onAnswer({ stepId: step.id, correct: passed, points: pts });
    }, 2500);
  };

  return (
    <div>
      <p className="text-sm mb-3 leading-relaxed text-gray-800">{step.prompt}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!!result}
        placeholder={step.placeholder}
        rows={4}
        className={`${inputClass(darkMode)} mb-3`}
      />
      {!result && (
        <button
          onClick={evaluate}
          disabled={text.trim().length < 10}
          className="w-full py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-sm"
        >
          <CheckCircle2 size={16} />
          Auswerten
        </button>
      )}
      {result && (
        <div
          className={`rounded-xl p-4 border-l-4 ${
            result.passed
              ? darkMode
                ? 'border-emerald-500 bg-emerald-900/20'
                : 'border-emerald-500 bg-emerald-50'
              : darkMode
                ? 'border-amber-500 bg-amber-900/20'
                : 'border-amber-500 bg-amber-50'
          }`}
        >
          <div
            className={`text-sm font-semibold mb-1 flex items-center gap-2 ${
              result.passed
                ? darkMode
                  ? 'text-emerald-300'
                  : 'text-emerald-700'
                : darkMode
                  ? 'text-amber-300'
                  : 'text-amber-700'
            }`}
          >
            {result.passed ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {result.matched}/{result.total} Kernpunkte erkannt
          </div>
          <div className="text-xs text-gray-700">{step.feedback[result.level]}</div>
        </div>
      )}
    </div>
  );
}

function HeroHeader({ darkMode }) {
  return (
    <div
      className={`${
        darkMode
          ? 'bg-gradient-to-r from-rose-900 via-slate-900 to-orange-900'
          : 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500'
      } text-white rounded-2xl p-6 shadow-lg`}
    >
      <h2 className="text-2xl font-bold mb-1 flex items-center gap-3">
        <Siren size={26} />
        Notfall-Trainer
      </h2>
      <p className="text-sm opacity-90">
        Situatives Entscheiden unter Zeitdruck im Badbetrieb
      </p>
      <div className="mt-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-xs flex items-start gap-2">
        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
        <span>{scenariosData.module.disclaimer}</span>
      </div>
    </div>
  );
}

function ScenarioList({ scenarios, onSelect, darkMode }) {
  return (
    <div className="space-y-4">
      <HeroHeader darkMode={darkMode} />
      <div className="space-y-3">
        {scenarios.map((s) => {
          const diff = DIFFICULTY_STYLE[s.difficulty] || DIFFICULTY_STYLE.mittel;
          const CatIcon = CATEGORY_ICON[s.category] || List;
          const ScenIcon = SCENARIO_ICON_MAP[s.icon] || Heart;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className="w-full text-left glass-card rounded-2xl p-4 relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${diff.bar}`}
              />
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    darkMode ? 'bg-white/10 text-rose-300' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  <ScenIcon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-sm text-gray-800">{s.title}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        darkMode ? diff.badgeDark : diff.badge
                      }`}
                    >
                      {diff.label}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        darkMode ? 'bg-white/10 text-slate-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <CatIcon size={12} />
                      {s.category}
                    </span>
                  </div>
                  <p className="text-xs mb-2 text-gray-500">{s.subtitle}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Timer size={12} />
                      {s.estimatedMinutes} Min · {s.steps.length} Schritte
                    </span>
                    <span className="flex items-center gap-1">
                      <Target size={12} />
                      {s.scoring.passThreshold}% zum Bestehen
                    </span>
                  </div>
                </div>
                <ChevronRight size={18} className={darkMode ? 'text-slate-500' : 'text-gray-300'} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IntroScreen({ scenario, onStart, onBack, darkMode }) {
  const diff = DIFFICULTY_STYLE[scenario.difficulty] || DIFFICULTY_STYLE.mittel;
  const ScenIcon = SCENARIO_ICON_MAP[scenario.icon] || Heart;

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
          darkMode ? 'text-slate-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <ArrowLeft size={14} />
        Zurück
      </button>

      <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${diff.bar}`}
        />
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              darkMode ? 'bg-white/10 text-rose-300' : 'bg-rose-50 text-rose-600'
            }`}
          >
            <ScenIcon size={28} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{scenario.title}</h2>
            <p className="text-sm text-gray-600">{scenario.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            ['Schwierigkeit', diff.label],
            ['Zeitlimit', `${formatTime(scenario.timerSeconds)} Min`],
            ['Schritte', scenario.steps.length],
            ['Bestehen ab', `${scenario.scoring.passThreshold}%`],
          ].map(([k, v]) => (
            <div
              key={k}
              className={`rounded-xl p-3 ${
                darkMode ? 'bg-white/5' : 'bg-white/60 border border-gray-200'
              }`}
            >
              <div className="text-xs text-gray-500">{k}</div>
              <div className="text-sm font-bold text-gray-800">{v}</div>
            </div>
          ))}
        </div>

        <div
          className={`rounded-xl p-3 mb-4 ${
            darkMode ? 'bg-white/5' : 'bg-white/60 border border-gray-200'
          }`}
        >
          <div
            className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${
              darkMode ? 'text-rose-300' : 'text-rose-600'
            }`}
          >
            <Flame size={12} />
            Lernziele
          </div>
          <ul className="space-y-1">
            {scenario.learningGoals.map((g, i) => (
              <li key={i} className="text-xs flex gap-2 text-gray-700">
                <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                {g}
              </li>
            ))}
          </ul>
        </div>

        {scenario.criticalFailures.length > 0 && (
          <div
            className={`rounded-xl p-3 border-l-4 border-rose-500 ${
              darkMode ? 'bg-rose-900/20' : 'bg-rose-50'
            }`}
          >
            <div
              className={`text-xs font-semibold mb-1 flex items-center gap-1.5 ${
                darkMode ? 'text-rose-300' : 'text-rose-700'
              }`}
            >
              <AlertTriangle size={12} />
              Kritische Fehler (führen zum sofortigen Nichtbestehen)
            </div>
            <ul className="space-y-0.5">
              {scenario.criticalFailures.map((f) => (
                <li key={f.id} className="text-xs text-gray-700">
                  • {f.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={onStart}
        className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
      >
        <PlayCircle size={18} />
        Einsatz starten
      </button>
    </div>
  );
}

function DebriefScreen({ scenario, answers, elapsed, onRestart, onBack, darkMode }) {
  const totalPoints = answers.reduce((sum, a) => sum + (a.points || 0), 0);
  const maxPoints = scenario.scoring.maxPoints;
  const timeBonus =
    elapsed <= scenario.scoring.timeBonusThresholdSeconds ? scenario.scoring.timeBonusPoints : 0;
  const finalPoints = Math.min(maxPoints, totalPoints + timeBonus);
  const pct = Math.round((finalPoints / maxPoints) * 100);
  const passed = pct >= scenario.scoring.passThreshold;

  return (
    <div className="space-y-4">
      <div
        className={`${
          passed
            ? darkMode
              ? 'bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900'
              : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500'
            : darkMode
              ? 'bg-gradient-to-r from-rose-900 via-slate-900 to-red-900'
              : 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500'
        } text-white rounded-2xl p-6 shadow-lg text-center`}
      >
        <div className="flex justify-center mb-2">
          {passed ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
        </div>
        <div className="text-3xl font-black mb-1">
          {pct}% — {passed ? 'Bestanden' : 'Nicht bestanden'}
        </div>
        <div className="text-sm opacity-90">
          {finalPoints}/{maxPoints} Punkte · Zeit: {formatTime(elapsed)}
          {timeBonus > 0 && <span className="ml-2 font-semibold">+{timeBonus} Zeitbonus</span>}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
        <h3 className="font-bold text-gray-800 mb-1">{scenario.debrief.headline}</h3>
        <p className="text-xs text-gray-600 mb-3">{scenario.debrief.summary}</p>

        <div
          className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${
            darkMode ? 'text-emerald-300' : 'text-emerald-700'
          }`}
        >
          <CheckCircle2 size={12} />
          Die wichtigsten Erkenntnisse
        </div>
        <ul className="space-y-1 mb-4">
          {scenario.debrief.keyTakeaways.map((t, i) => (
            <li key={i} className="text-xs flex gap-2 text-gray-700">
              <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              {t}
            </li>
          ))}
        </ul>

        <div
          className={`rounded-xl p-3 border-l-4 border-amber-500 ${
            darkMode ? 'bg-amber-900/20' : 'bg-amber-50'
          }`}
        >
          <div
            className={`text-xs font-semibold mb-1 flex items-center gap-1.5 ${
              darkMode ? 'text-amber-300' : 'text-amber-700'
            }`}
          >
            <AlertTriangle size={12} />
            Häufige Fehler in diesem Szenario
          </div>
          <ul className="space-y-0.5">
            {scenario.debrief.commonMistakes.map((m, i) => (
              <li key={i} className="text-xs text-gray-700">
                • {m}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`mt-3 rounded-xl p-3 border-l-4 border-cyan-500 ${
            darkMode ? 'bg-cyan-900/20' : 'bg-cyan-50'
          }`}
        >
          <div
            className={`text-xs font-semibold flex items-center gap-1.5 ${
              darkMode ? 'text-cyan-300' : 'text-cyan-700'
            }`}
          >
            <Flame size={12} />
            Merksatz: {scenario.debrief.merksatz}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4">
        <div className="text-xs font-semibold mb-3 text-gray-500 flex items-center gap-1.5">
          <ListChecks size={12} />
          Schritt-für-Schritt Ergebnis
        </div>
        <div className="space-y-2">
          {scenario.steps.map((step, i) => {
            const ans = answers.find((a) => a.stepId === step.id);
            const scored = ans?.points || 0;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 rounded-xl p-2.5 ${
                  darkMode ? 'bg-white/5' : 'bg-white/60 border border-gray-200'
                }`}
              >
                {ans?.correct ? (
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                ) : (
                  <XCircle size={18} className="text-rose-500 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate text-gray-800">
                    {i + 1}. {step.title}
                  </div>
                </div>
                <span
                  className={`text-xs font-mono font-bold ${
                    ans?.correct
                      ? darkMode
                        ? 'text-emerald-300'
                        : 'text-emerald-600'
                      : darkMode
                        ? 'text-rose-300'
                        : 'text-rose-600'
                  }`}
                >
                  {scored}/{step.points}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRestart}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <RotateCcw size={16} />
          Nochmal versuchen
        </button>
        <button
          onClick={onBack}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
            darkMode
              ? 'bg-white/10 hover:bg-white/15 text-slate-200'
              : 'bg-white/70 hover:bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <List size={16} />
          Szenario-Liste
        </button>
      </div>
    </div>
  );
}

export default function NotfallTrainerView() {
  const { darkMode } = useApp();
  const [screen, setScreen] = useState('list');
  const [scenario, setScenario] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  const startTimer = useCallback((total) => {
    setTimeLeft(total);
    setElapsed(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
      setElapsed((e) => e + 1);
    }, 1000);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const selectScenario = (s) => {
    setScenario(s);
    setScreen('intro');
  };
  const startScenario = () => {
    setStepIdx(0);
    setAnswers([]);
    setScreen('step');
    startTimer(scenario.timerSeconds);
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    const nextIdx = stepIdx + 1;
    if (nextIdx >= scenario.steps.length) {
      clearInterval(timerRef.current);
      setElapsed(scenario.timerSeconds - timeLeft);
      setScreen('debrief');
    } else {
      setStepIdx(nextIdx);
    }
  };

  const currentStep = scenario?.steps[stepIdx];

  if (screen === 'list') {
    return (
      <div className="p-4">
        <ScenarioList
          scenarios={scenariosData.scenarios}
          onSelect={selectScenario}
          darkMode={darkMode}
        />
      </div>
    );
  }

  if (screen === 'intro') {
    return (
      <div className="p-4">
        <IntroScreen
          scenario={scenario}
          onStart={startScenario}
          onBack={() => setScreen('list')}
          darkMode={darkMode}
        />
      </div>
    );
  }

  if (screen === 'step' && currentStep) {
    const progress = (stepIdx / scenario.steps.length) * 100;
    const type = STEP_TYPE[currentStep.type] || STEP_TYPE.single_choice;
    return (
      <div className="p-4 space-y-4">
        <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm font-bold flex items-center gap-1.5 ${
                darkMode ? 'text-rose-300' : 'text-rose-600'
              }`}
            >
              <Siren size={16} />
              {scenario.title}
            </span>
            <span className="text-xs text-gray-500">
              Schritt {stepIdx + 1}/{scenario.steps.length}
            </span>
          </div>
          <TimerBar total={scenario.timerSeconds} remaining={timeLeft} darkMode={darkMode} />
          <div
            className={`mt-2 h-1.5 rounded-full overflow-hidden ${
              darkMode ? 'bg-white/10' : 'bg-gray-200'
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                darkMode ? 'bg-white/10 text-slate-300' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <type.Icon size={12} />
              {type.label}
            </span>
            <span className="text-xs text-gray-500">{currentStep.points} Punkte</span>
          </div>
          <h3 className="text-base font-bold mb-3 text-gray-800">{currentStep.title}</h3>

          {currentStep.type === 'single_choice' && (
            <SingleChoiceStep
              key={currentStep.id}
              step={currentStep}
              onAnswer={handleAnswer}
              darkMode={darkMode}
            />
          )}
          {currentStep.type === 'ordering' && (
            <OrderingStep
              key={currentStep.id}
              step={currentStep}
              onAnswer={handleAnswer}
              darkMode={darkMode}
            />
          )}
          {currentStep.type === 'keyword_input' && (
            <KeywordInputStep
              key={currentStep.id}
              step={currentStep}
              onAnswer={handleAnswer}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    );
  }

  if (screen === 'debrief') {
    return (
      <div className="p-4">
        <DebriefScreen
          scenario={scenario}
          answers={answers}
          elapsed={elapsed}
          onRestart={startScenario}
          onBack={() => setScreen('list')}
          darkMode={darkMode}
        />
      </div>
    );
  }

  return null;
}
