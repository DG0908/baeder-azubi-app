import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import scenariosData from '../../data/emergencyTrainerScenarios.json';

const DIFFICULTY_COLOR = {
  leicht:  { bg: 'bg-green-100 text-green-700',  dark: 'bg-green-900/40 text-green-300'  },
  mittel:  { bg: 'bg-amber-100 text-amber-700',   dark: 'bg-amber-900/40 text-amber-300'  },
  schwer:  { bg: 'bg-red-100 text-red-700',       dark: 'bg-red-900/40 text-red-300'      },
};

const CATEGORY_ICON = {
  'Erste Hilfe':   '❤️',
  'Wasserrettung': '🌊',
  'Gefahrstoffe':  '☣️',
};

// ─── Utility ─────────────────────────────────────────────────────────────────
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

// ─── Sub-Components ───────────────────────────────────────────────────────────

function TimerBar({ total, remaining, darkMode }) {
  const pct = (remaining / total) * 100;
  const color = pct > 50 ? 'bg-emerald-500' : pct > 20 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-mono font-bold w-10 text-right ${
        pct <= 20 ? 'text-red-500' : darkMode ? 'text-slate-300' : 'text-gray-600'
      }`}>{formatTime(remaining)}</span>
      <div className={`flex-1 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
        <div className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// SingleChoice Step
function SingleChoiceStep({ step, onAnswer, darkMode }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const choose = (opt) => {
    if (revealed) return;
    setSelected(opt.id);
    setRevealed(true);
    setTimeout(() => {
      onAnswer({ stepId: step.id, correct: opt.isCorrect, points: opt.isCorrect ? step.points : 0, selectedId: opt.id });
    }, 1800);
  };

  return (
    <div>
      <p className={`text-sm mb-4 leading-relaxed ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{step.prompt}</p>
      <div className="space-y-2">
        {step.options.map(opt => {
          const isSelected = selected === opt.id;
          const showResult = revealed && isSelected;
          let borderClass = darkMode ? 'border-slate-600' : 'border-gray-200';
          let bgClass = darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-white';
          if (showResult) {
            borderClass = opt.isCorrect ? 'border-emerald-500' : 'border-red-500';
            bgClass = opt.isCorrect
              ? (darkMode ? 'bg-emerald-900/40' : 'bg-emerald-50')
              : (darkMode ? 'bg-red-900/40' : 'bg-red-50');
          } else if (revealed && opt.isCorrect) {
            borderClass = 'border-emerald-500';
            bgClass = darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50';
          }
          return (
            <button key={opt.id} onClick={() => choose(opt)}
              className={`w-full text-left rounded-xl border-2 p-3 transition-all ${borderClass} ${bgClass} ${!revealed ? 'cursor-pointer' : 'cursor-default'}`}>
              <div className={`text-sm ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{opt.text}</div>
              {showResult && (
                <div className={`text-xs mt-1.5 ${opt.isCorrect ? (darkMode ? 'text-emerald-300' : 'text-emerald-700') : (darkMode ? 'text-red-300' : 'text-red-700')}`}>
                  {opt.isCorrect ? '✓ ' : '✗ '}{opt.feedback}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className={`mt-3 text-xs text-right ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Weiter in wenigen Sekunden…</div>
      )}
    </div>
  );
}

// Ordering Step – user clicks items in the order they think is correct
function OrderingStep({ step, onAnswer, darkMode }) {
  const [shuffled] = useState(() => shuffleArray(step.items));
  const [order, setOrder] = useState([]); // ids in chosen order
  const [revealed, setRevealed] = useState(false);

  const toggle = (id) => {
    if (revealed) return;
    if (order.includes(id)) {
      setOrder(order.filter(o => o !== id));
    } else {
      setOrder([...order, id]);
    }
  };

  const submit = () => {
    if (order.length !== step.items.length) return;
    setRevealed(true);
    // score: count items in correct position
    let correct = 0;
    order.forEach((id, i) => { if (id === step.correctOrder[i]) correct++; });
    const ratio = correct / step.items.length;
    const pts = Math.round(step.points * ratio);
    const level = ratio === 1 ? 'success' : ratio >= 0.5 ? 'partial' : 'failure';
    setTimeout(() => {
      onAnswer({ stepId: step.id, correct: ratio >= 0.75, points: pts, level });
    }, 2200);
  };

  const reset = () => { if (!revealed) setOrder([]); };

  return (
    <div>
      <p className={`text-sm mb-3 leading-relaxed ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{step.prompt}</p>
      <p className={`text-xs mb-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
        Klicke die Aussagen in der richtigen Reihenfolge an. Bereits gewählte Punkte werden nummeriert.
      </p>
      <div className="space-y-2 mb-4">
        {shuffled.map(item => {
          const pos = order.indexOf(item.id);
          const chosen = pos !== -1;
          const correctPos = step.correctOrder.indexOf(item.id);
          let borderClass = chosen
            ? (darkMode ? 'border-cyan-500' : 'border-cyan-400')
            : (darkMode ? 'border-slate-600' : 'border-gray-200');
          let bgClass = chosen
            ? (darkMode ? 'bg-cyan-900/30' : 'bg-cyan-50')
            : (darkMode ? 'bg-slate-700' : 'bg-gray-50');

          if (revealed) {
            const isCorrectPos = order[correctPos] === item.id;
            borderClass = isCorrectPos ? 'border-emerald-500' : 'border-red-500';
            bgClass = isCorrectPos
              ? (darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50')
              : (darkMode ? 'bg-red-900/30' : 'bg-red-50');
          }

          return (
            <button key={item.id} onClick={() => toggle(item.id)}
              className={`w-full text-left rounded-xl border-2 p-3 flex items-center gap-3 transition-all ${borderClass} ${bgClass} ${!revealed ? 'cursor-pointer' : 'cursor-default'}`}>
              <span className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                chosen
                  ? 'bg-cyan-500 text-white'
                  : (darkMode ? 'bg-slate-600 text-slate-400' : 'bg-gray-200 text-gray-500')
              }`}>
                {chosen ? pos + 1 : '·'}
              </span>
              <span className={`text-sm ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{item.text}</span>
              {revealed && (
                <span className={`ml-auto text-xs font-medium ${
                  order[step.correctOrder.indexOf(item.id)] === item.id
                    ? (darkMode ? 'text-emerald-400' : 'text-emerald-600')
                    : (darkMode ? 'text-red-400' : 'text-red-600')
                }`}>
                  → {step.correctOrder.indexOf(item.id) + 1}. Stelle
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!revealed && (
        <div className="flex gap-2">
          <button onClick={submit} disabled={order.length !== step.items.length}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 ${
              darkMode ? 'bg-cyan-700 hover:bg-cyan-600 text-white' : 'bg-cyan-600 hover:bg-cyan-700 text-white'
            }`}>
            Reihenfolge bestätigen ({order.length}/{step.items.length})
          </button>
          <button onClick={reset}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}>Zurücksetzen</button>
        </div>
      )}

      {revealed && (
        <div className={`rounded-xl p-3 mt-2 border-l-4 ${
          order.every((id, i) => id === step.correctOrder[i])
            ? 'border-emerald-500 ' + (darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50')
            : 'border-amber-500 ' + (darkMode ? 'bg-amber-900/20' : 'bg-amber-50')
        }`}>
          <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            {order.every((id, i) => id === step.correctOrder[i])
              ? step.feedback.success
              : order.filter((id, i) => id === step.correctOrder[i]).length >= step.items.length * 0.5
              ? step.feedback.partial
              : step.feedback.failure}
          </div>
        </div>
      )}
    </div>
  );
}

// Keyword Input Step
function KeywordInputStep({ step, onAnswer, darkMode }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const evaluate = () => {
    const lower = text.toLowerCase();
    const matched = step.keywordGroups.filter(group =>
      group.some(kw => lower.includes(kw.toLowerCase()))
    ).length;
    const total = step.keywordGroups.length;
    const passed = matched >= step.minimumGroupsRequired;
    const ratio = matched / total;
    const pts = Math.round(step.points * ratio);
    const level = matched >= step.minimumGroupsRequired ? 'success' : matched >= step.minimumGroupsRequired - 1 ? 'partial' : 'failure';
    setResult({ matched, total, passed, pts, level });
    setTimeout(() => {
      onAnswer({ stepId: step.id, correct: passed, points: pts });
    }, 2500);
  };

  return (
    <div>
      <p className={`text-sm mb-3 leading-relaxed ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{step.prompt}</p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={!!result}
        placeholder={step.placeholder}
        rows={4}
        className={`w-full rounded-xl border p-3 text-sm resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
          darkMode
            ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500'
            : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
        }`}
      />
      {!result && (
        <button onClick={evaluate} disabled={text.trim().length < 10}
          className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 ${
            darkMode ? 'bg-cyan-700 hover:bg-cyan-600 text-white' : 'bg-cyan-600 hover:bg-cyan-700 text-white'
          }`}>
          Auswerten
        </button>
      )}
      {result && (
        <div className={`rounded-xl p-4 border-l-4 ${
          result.passed
            ? 'border-emerald-500 ' + (darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50')
            : 'border-amber-500 ' + (darkMode ? 'bg-amber-900/20' : 'bg-amber-50')
        }`}>
          <div className={`text-sm font-semibold mb-1 ${result.passed ? (darkMode ? 'text-emerald-300' : 'text-emerald-700') : (darkMode ? 'text-amber-300' : 'text-amber-700')}`}>
            {result.matched}/{result.total} Kernpunkte erkannt
          </div>
          <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            {step.feedback[result.level]}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function ScenarioList({ scenarios, onSelect, darkMode }) {
  return (
    <div>
      <div className={`rounded-2xl p-5 mb-5 ${
        darkMode
          ? 'bg-gradient-to-br from-red-900/50 to-orange-900/30 border border-red-800'
          : 'bg-gradient-to-br from-red-50 to-orange-50 border border-red-200'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🚨</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Notfall-Trainer</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Situatives Entscheiden unter Zeitdruck im Badbetrieb
            </p>
          </div>
        </div>
        <div className={`mt-3 p-2 rounded-lg text-xs ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'}`}>
          ⚠️ {scenariosData.module.disclaimer}
        </div>
      </div>

      <div className="space-y-3">
        {scenarios.map(s => {
          const diff = DIFFICULTY_COLOR[s.difficulty] || DIFFICULTY_COLOR.mittel;
          return (
            <button key={s.id} onClick={() => onSelect(s)}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all hover:scale-[1.01] active:scale-[0.99] ${
                darkMode ? 'bg-slate-800 border-slate-700 hover:border-red-700' : 'bg-white border-gray-200 hover:border-red-300'
              }`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`font-bold text-sm ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{s.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${darkMode ? diff.dark : diff.bg}`}>
                      {s.difficulty}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                      {CATEGORY_ICON[s.category] || '📋'} {s.category}
                    </span>
                  </div>
                  <p className={`text-xs mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{s.subtitle}</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                      ⏱ {s.estimatedMinutes} Min · {s.steps.length} Schritte
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                      🎯 {s.scoring.passThreshold}% zum Bestehen
                    </span>
                  </div>
                </div>
                <span className={`text-xl ${darkMode ? 'text-slate-600' : 'text-gray-300'}`}>›</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IntroScreen({ scenario, onStart, onBack, darkMode }) {
  return (
    <div>
      <button onClick={onBack}
        className={`flex items-center gap-1.5 text-sm mb-4 px-3 py-1.5 rounded-lg transition-colors ${
          darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-gray-500 hover:bg-gray-100'
        }`}>
        ← Zurück
      </button>

      <div className={`rounded-2xl border p-5 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="text-4xl mb-3">{scenario.icon}</div>
        <h2 className={`text-xl font-bold mb-1 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{scenario.title}</h2>
        <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{scenario.subtitle}</p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            ['Schwierigkeit', scenario.difficulty],
            ['Zeitlimit', `${formatTime(scenario.timerSeconds)} Min`],
            ['Schritte', scenario.steps.length],
            ['Bestehen ab', `${scenario.scoring.passThreshold}%`],
          ].map(([k, v]) => (
            <div key={k} className={`rounded-xl p-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{k}</div>
              <div className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{v}</div>
            </div>
          ))}
        </div>

        <div className={`rounded-xl p-3 mb-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
          <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Lernziele</div>
          <ul className="space-y-1">
            {scenario.learningGoals.map((g, i) => (
              <li key={i} className={`text-xs flex gap-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-emerald-500 flex-shrink-0">✓</span>{g}
              </li>
            ))}
          </ul>
        </div>

        {scenario.criticalFailures.length > 0 && (
          <div className={`rounded-xl p-3 border-l-4 border-red-500 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
            <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
              ⚠️ Kritische Fehler (führen zum sofortigen Nichtbestehen)
            </div>
            <ul className="space-y-0.5">
              {scenario.criticalFailures.map(f => (
                <li key={f.id} className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>• {f.label}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button onClick={onStart}
        className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg">
        🚨 Einsatz starten
      </button>
    </div>
  );
}

function DebriefScreen({ scenario, answers, elapsed, onRestart, onBack, darkMode }) {
  const totalPoints = answers.reduce((sum, a) => sum + (a.points || 0), 0);
  const maxPoints = scenario.scoring.maxPoints;
  const timeBonus = elapsed <= scenario.scoring.timeBonusThresholdSeconds ? scenario.scoring.timeBonusPoints : 0;
  const finalPoints = Math.min(maxPoints, totalPoints + timeBonus);
  const pct = Math.round((finalPoints / maxPoints) * 100);
  const passed = pct >= scenario.scoring.passThreshold;

  return (
    <div>
      {/* Ergebnis-Header */}
      <div className={`rounded-2xl p-5 mb-4 text-center ${
        passed
          ? (darkMode ? 'bg-emerald-900/40 border border-emerald-700' : 'bg-emerald-50 border border-emerald-300')
          : (darkMode ? 'bg-red-900/40 border border-red-700' : 'bg-red-50 border border-red-300')
      }`}>
        <div className="text-5xl mb-2">{passed ? '✅' : '❌'}</div>
        <div className={`text-2xl font-black mb-1 ${passed ? (darkMode ? 'text-emerald-300' : 'text-emerald-700') : (darkMode ? 'text-red-300' : 'text-red-700')}`}>
          {pct}% — {passed ? 'Bestanden' : 'Nicht bestanden'}
        </div>
        <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          {finalPoints}/{maxPoints} Punkte · Zeit: {formatTime(elapsed)}
          {timeBonus > 0 && <span className={`ml-2 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>+{timeBonus} Zeitbonus</span>}
        </div>
      </div>

      {/* Debrief */}
      <div className={`rounded-2xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <h3 className={`font-bold mb-1 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{scenario.debrief.headline}</h3>
        <p className={`text-xs mb-3 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{scenario.debrief.summary}</p>

        <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Die wichtigsten Erkenntnisse:</div>
        <ul className="space-y-1 mb-4">
          {scenario.debrief.keyTakeaways.map((t, i) => (
            <li key={i} className={`text-xs flex gap-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>{t}
            </li>
          ))}
        </ul>

        <div className={`rounded-xl p-3 border-l-4 border-amber-500 ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
          <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>Häufige Fehler in diesem Szenario:</div>
          <ul className="space-y-0.5">
            {scenario.debrief.commonMistakes.map((m, i) => (
              <li key={i} className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>• {m}</li>
            ))}
          </ul>
        </div>

        <div className={`mt-3 rounded-xl p-3 border-l-4 border-cyan-500 ${darkMode ? 'bg-cyan-900/20' : 'bg-cyan-50'}`}>
          <div className={`text-xs font-semibold ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
            💡 Merksatz: {scenario.debrief.merksatz}
          </div>
        </div>
      </div>

      {/* Schritte-Übersicht */}
      <div className={`rounded-2xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className={`text-xs font-semibold mb-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Schritt-für-Schritt Ergebnis</div>
        <div className="space-y-2">
          {scenario.steps.map((step, i) => {
            const ans = answers.find(a => a.stepId === step.id);
            const scored = ans?.points || 0;
            return (
              <div key={step.id} className={`flex items-center gap-3 rounded-xl p-2.5 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="text-lg">{ans?.correct ? '✅' : '❌'}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium truncate ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    {i + 1}. {step.title}
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold ${ans?.correct ? (darkMode ? 'text-emerald-400' : 'text-emerald-600') : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
                  {scored}/{step.points}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={onRestart}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
          Nochmal versuchen
        </button>
        <button onClick={onBack}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}>
          Szenario-Liste
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function NotfallTrainerView() {
  const { darkMode } = useApp();
  const [screen, setScreen] = useState('list'); // list | intro | step | debrief
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
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
      setElapsed(e => e + 1);
    }, 1000);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const selectScenario = (s) => { setScenario(s); setScreen('intro'); };
  const startScenario  = () => { setStepIdx(0); setAnswers([]); setScreen('step'); startTimer(scenario.timerSeconds); };

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

  // ── Render ──
  if (screen === 'list') {
    return (
      <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <ScenarioList scenarios={scenariosData.scenarios} onSelect={selectScenario} darkMode={darkMode} />
      </div>
    );
  }

  if (screen === 'intro') {
    return (
      <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <IntroScreen scenario={scenario} onStart={startScenario} onBack={() => setScreen('list')} darkMode={darkMode} />
      </div>
    );
  }

  if (screen === 'step' && currentStep) {
    const progress = ((stepIdx) / scenario.steps.length) * 100;
    return (
      <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <div className={`rounded-2xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              🚨 {scenario.title}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Schritt {stepIdx + 1}/{scenario.steps.length}
            </span>
          </div>
          <TimerBar total={scenario.timerSeconds} remaining={timeLeft} darkMode={darkMode} />
          <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
            <div className="h-full bg-cyan-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Schritt-Karte */}
        <div className={`rounded-2xl border p-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
              {currentStep.type === 'single_choice' ? '☑️ Auswahl' : currentStep.type === 'ordering' ? '🔢 Reihenfolge' : '✏️ Texteingabe'}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              {currentStep.points} Punkte
            </span>
          </div>
          <h3 className={`text-base font-bold mb-3 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
            {currentStep.title}
          </h3>

          {currentStep.type === 'single_choice' && (
            <SingleChoiceStep key={currentStep.id} step={currentStep} onAnswer={handleAnswer} darkMode={darkMode} />
          )}
          {currentStep.type === 'ordering' && (
            <OrderingStep key={currentStep.id} step={currentStep} onAnswer={handleAnswer} darkMode={darkMode} />
          )}
          {currentStep.type === 'keyword_input' && (
            <KeywordInputStep key={currentStep.id} step={currentStep} onAnswer={handleAnswer} darkMode={darkMode} />
          )}
        </div>
      </div>
    );
  }

  if (screen === 'debrief') {
    return (
      <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
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
