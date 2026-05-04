import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was sind Brüche?',
    intro:
      'Ein Bruch ist ein Teil von einem Ganzen. Stell dir eine Pizza vor: Du schneidest sie in 4 Stücke und isst 3 davon — das sind 3/4. Der Bruch sagt dir: Wie viele Teile hast du von wie vielen insgesamt?',
    motto: 'Oben = was du hast, unten = wie viele Teile es insgesamt gibt.',
    rules: [
      'Oben steht der Zähler — das ist die Anzahl der Teile, die du hast.',
      'Unten steht der Nenner — das sagt, in wie viele Stücke das Ganze geteilt ist.',
      'Der Bruchstrich bedeutet "geteilt durch": 3/4 = 3 ÷ 4 = 0,75.',
      'Wenn Zähler und Nenner gleich sind (z.B. 4/4), ist das genau 1 Ganzes.',
      'Wenn der Zähler größer ist als der Nenner (z.B. 5/4), hast du mehr als 1 Ganzes.'
    ],
    steps: [
      {
        title: '1. Bruch lesen',
        text: 'Oben die Zahl, Bruchstrich, unten die Zahl. 3/4 sprichst du "drei Viertel".'
      },
      {
        title: '2. Bedeutung verstehen',
        text: '3/4 heißt: Das Ganze wurde in 4 Teile geteilt, du hast 3 davon.'
      },
      {
        title: '3. Als Dezimalzahl',
        text: 'Zähler durch Nenner teilen: 3 ÷ 4 = 0,75. Das ist derselbe Wert.'
      },
      {
        title: '4. Alltags-Brüche merken',
        text: '1/2 = 0,5 (Hälfte), 1/4 = 0,25 (Viertel), 3/4 = 0,75 (Dreiviertel).'
      }
    ],
    examples: [
      {
        title: 'Pizza-Beispiel',
        given: 'Eine Pizza hat 8 Stücke. Du isst 3 davon.',
        question: 'Welcher Bruch beschreibt deinen Anteil?',
        steps: [
          ['Ganze Stücke', '8 (= Nenner)'],
          ['Deine Stücke', '3 (= Zähler)'],
          ['Bruch', '3/8'],
          ['Als Dezimalzahl', '3 ÷ 8 = 0,375']
        ]
      },
      {
        title: 'Schwimmbad-Beispiel',
        given: 'Ein Becken ist zu 3/4 gefüllt.',
        question: 'Wie viel Prozent ist das?',
        steps: [
          ['Bruch', '3/4'],
          ['Dezimal', '3 ÷ 4 = 0,75'],
          ['Prozent', '0,75 × 100 = 75 %'],
          ['Ergebnis', 'Das Becken ist zu 75 % gefüllt']
        ]
      }
    ],
    pitfalls: [
      'Der Nenner (unten) darf NIE 0 sein — durch 0 teilen geht nicht.',
      '1/2 ist NICHT dasselbe wie 1 und 2 — es ist eine halbe Einheit.',
      'Größerer Nenner = kleinere Stücke: 1/8 ist kleiner als 1/4.'
    ],
    quiz: {
      question: 'Was ist größer: 1/3 oder 1/5?',
      options: ['1/5', '1/3', 'Beide gleich'],
      correctIndex: 1,
      explanation: 'Je kleiner der Nenner, desto größer das Stück. 1/3 > 1/5.'
    }
  },

  rechnen: {
    id: 'rechnen',
    chip: 'Rechnen',
    title: 'Mit Brüchen rechnen',
    intro:
      'Brüche addieren, subtrahieren, malnehmen und teilen — das klingt kompliziert, folgt aber klaren Regeln. Das Wichtigste: Zum Addieren und Subtrahieren müssen die Nenner gleich sein!',
    motto: 'Gleicher Nenner = einfach rechnen. Verschiedene Nenner = erst angleichen!',
    rules: [
      'Addition/Subtraktion: Nur bei gleichem Nenner! Dann rechnest du nur die Zähler.',
      'Verschiedene Nenner? Erst gleichnamig machen (gemeinsamen Nenner finden).',
      'Multiplikation: Zähler × Zähler und Nenner × Nenner. Ganz einfach!',
      'Division: Den zweiten Bruch umdrehen (Kehrwert) und dann malnehmen.',
      'Nach dem Rechnen immer prüfen: Kann man das Ergebnis kürzen?'
    ],
    steps: [
      {
        title: '1. Gleiche Nenner prüfen',
        text: 'Sind die Nenner gleich? Super, dann einfach die Zähler addieren/subtrahieren. Nenner bleibt!'
      },
      {
        title: '2. Nenner angleichen',
        text: 'Bei 1/2 + 1/3: Gemeinsamer Nenner = 6. Also 3/6 + 2/6 = 5/6.'
      },
      {
        title: '3. Malnehmen ist einfach',
        text: '2/3 × 4/5 = (2×4)/(3×5) = 8/15. Zähler mal Zähler, Nenner mal Nenner.'
      },
      {
        title: '4. Teilen = Kehrwert und Mal',
        text: '2/3 ÷ 4/5 → 2/3 × 5/4 = 10/12 = 5/6. Den zweiten Bruch einfach umdrehen!'
      }
    ],
    examples: [
      {
        title: 'Addition mit gleichem Nenner',
        given: '2/5 + 1/5',
        question: 'Was ist die Summe?',
        steps: [
          ['Nenner gleich?', 'Ja, beide 5'],
          ['Zähler addieren', '2 + 1 = 3'],
          ['Ergebnis', '3/5']
        ]
      },
      {
        title: 'Addition mit verschiedenen Nennern',
        given: '1/2 + 1/4',
        question: 'Was ist die Summe?',
        steps: [
          ['Nenner gleich?', 'Nein (2 und 4)'],
          ['Gleichnamig machen', '1/2 = 2/4 (Zähler und Nenner mal 2)'],
          ['Jetzt addieren', '2/4 + 1/4 = 3/4'],
          ['Ergebnis', '3/4']
        ]
      },
      {
        title: 'Multiplikation',
        given: '3/4 × 2/3',
        question: 'Was ist das Produkt?',
        steps: [
          ['Zähler × Zähler', '3 × 2 = 6'],
          ['Nenner × Nenner', '4 × 3 = 12'],
          ['Ergebnis', '6/12 = 1/2 (gekürzt)']
        ]
      }
    ],
    pitfalls: [
      'NICHT die Nenner addieren! 1/2 + 1/3 ist NICHT 2/5!',
      'Erst die Nenner gleich machen, DANN rechnen.',
      'Beim Teilen: Nicht vergessen den zweiten Bruch umzudrehen.'
    ],
    quiz: {
      question: 'Was ist 3/4 + 1/4?',
      options: ['4/8', '1', '3/8'],
      correctIndex: 1,
      explanation: '3/4 + 1/4 = 4/4 — und 4 von 4 Teilen ist genau 1 Ganzes.'
    }
  },

  kürzen: {
    id: 'kürzen',
    chip: 'Kürzen & Erweitern',
    title: 'Brüche kürzen und erweitern',
    intro:
      'Kürzen macht Brüche einfacher, Erweitern macht sie gleichnamig. Beim Kürzen teilst du oben und unten durch dieselbe Zahl. Beim Erweitern nimmst du oben und unten mal dieselbe Zahl. Der Wert des Bruchs ändert sich dabei NIE.',
    motto: 'Kürzen = einfacher machen. Erweitern = Nenner angleichen.',
    rules: [
      'Kürzen: Zähler und Nenner durch dieselbe Zahl teilen. 6/8 ÷ 2 = 3/4.',
      'Erweitern: Zähler und Nenner mit derselben Zahl malnehmen. 1/2 × 3 = 3/6.',
      'Kürzen ändert den Wert NICHT: 6/8 = 3/4 = 0,75.',
      'Erweitern ändert den Wert NICHT: 1/2 = 3/6 = 0,5.',
      'Ein Bruch ist vollständig gekürzt, wenn man nicht mehr weiter teilen kann.'
    ],
    steps: [
      {
        title: '1. Gemeinsamen Teiler finden',
        text: 'Durch welche Zahl kann man Zähler UND Nenner teilen? Bei 12/18: Beide durch 6 teilbar!'
      },
      {
        title: '2. Beide Teile durch dieselbe Zahl teilen',
        text: '12 ÷ 6 = 2 und 18 ÷ 6 = 3. Also 12/18 = 2/3.'
      },
      {
        title: '3. Prüfen: Kann man weiter kürzen?',
        text: '2 und 3 haben keinen gemeinsamen Teiler mehr. Der Bruch ist fertig gekürzt.'
      },
      {
        title: '4. Zum Erweitern: Mit derselben Zahl malnehmen',
        text: '2/3 auf Sechstel erweitern: 2×2/3×2 = 4/6. Oder auf Neuntel: 2×3/3×3 = 6/9.'
      }
    ],
    examples: [
      {
        title: 'Kürzen',
        given: 'Der Bruch 15/20 soll gekürzt werden.',
        question: 'Was ist das Ergebnis?',
        steps: [
          ['Gemeinsamer Teiler', '5 (beide durch 5 teilbar)'],
          ['Zähler kürzen', '15 ÷ 5 = 3'],
          ['Nenner kürzen', '20 ÷ 5 = 4'],
          ['Ergebnis', '15/20 = 3/4']
        ]
      },
      {
        title: 'Erweitern für Addition',
        given: '1/3 + 1/4 — verschiedene Nenner!',
        question: 'Wie macht man sie gleichnamig?',
        steps: [
          ['Gemeinsamer Nenner', '3 × 4 = 12'],
          ['1/3 erweitern', '1×4 / 3×4 = 4/12'],
          ['1/4 erweitern', '1×3 / 4×3 = 3/12'],
          ['Jetzt addieren', '4/12 + 3/12 = 7/12']
        ]
      }
    ],
    pitfalls: [
      'IMMER Zähler und Nenner durch die GLEICHE Zahl teilen!',
      'Nur mit einer Zahl kürzen, nicht mit verschiedenen Zahlen oben und unten.',
      'Tipp: Durch 2 kürzen, wenn beide Zahlen gerade sind. Durch 5, wenn beide auf 0 oder 5 enden.'
    ],
    quiz: {
      question: 'Was ist 24/36 vollständig gekürzt?',
      options: ['4/6', '2/3', '12/18'],
      correctIndex: 1,
      explanation: '24 und 36 durch 12 teilen: 24÷12 = 2, 36÷12 = 3. Ergebnis: 2/3.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Brüche im Bäderalltag',
    intro:
      'Im Schwimmbad begegnest du Brüchen öfter als du denkst: Becken halb voll, Dreiviertel der Schicht rum, ein Drittel der Chemikalie verbraucht. Hier übst du mit echten Situationen.',
    motto: 'Brüche sind Alltag — auch im Schwimmbad.',
    rules: [
      'Füllstände werden oft als Bruch angegeben: 3/4 voll, 1/2 leer.',
      'Mischungsverhältnisse sind Brüche: 1 Teil Chemikalie auf 3 Teile Wasser = 1/4 Anteil.',
      'Schichtanteile: 1/3 der Schicht = ein Drittel der Arbeitszeit.',
      'Prozent und Brüche sind das Gleiche: 50 % = 1/2, 25 % = 1/4, 75 % = 3/4.',
      'Tipp: Im Kopf mit Halben und Vierteln rechnen ist schneller als mit dem Taschenrechner.'
    ],
    steps: [
      {
        title: '1. Situation als Bruch aufschreiben',
        text: '"Zwei Drittel des Beckens sind gefüllt" → 2/3. Schreib den Bruch hin.'
      },
      {
        title: '2. Wenn nötig in Dezimal umwandeln',
        text: '2/3 = 2 ÷ 3 = 0,667. Oder als Prozent: 0,667 × 100 = 66,7 %.'
      },
      {
        title: '3. Mit konkreten Zahlen rechnen',
        text: '2/3 von 450 m³ = 450 × 2/3 = 300 m³.'
      },
      {
        title: '4. Ergebnis mit Einheit',
        text: '300 m³ — immer die Einheit dazuschreiben!'
      }
    ],
    examples: [
      {
        title: 'Becken-Füllung',
        given: 'Ein 600 m³ Becken ist zu 3/4 gefüllt.',
        question: 'Wie viel Wasser ist drin?',
        steps: [
          ['Bruch', '3/4 von 600 m³'],
          ['Rechnung', '600 × 3 ÷ 4'],
          ['Ausrechnen', '1.800 ÷ 4 = 450'],
          ['Ergebnis', '450 m³ Wasser']
        ]
      },
      {
        title: 'Chemikalien-Vorrat',
        given: 'Von 30 Litern Flockungsmittel ist noch 2/5 übrig.',
        question: 'Wie viel Liter sind noch da?',
        steps: [
          ['Bruch', '2/5 von 30 Litern'],
          ['Rechnung', '30 × 2 ÷ 5'],
          ['Ausrechnen', '60 ÷ 5 = 12'],
          ['Ergebnis', '12 Liter sind noch übrig']
        ]
      }
    ],
    pitfalls: [
      '"Drei Viertel" heißt 3/4, nicht 3 und 4!',
      'Wenn ein Becken zu 3/4 voll ist, fehlt noch 1/4 bis ganz voll.',
      'Bei Mischverhältnissen: 1:3 heißt 1 Teil von insgesamt 4 Teilen = 1/4.'
    ],
    quiz: {
      question: 'Ein 200 m³ Becken ist zu 3/5 gefüllt. Wie viel fehlt bis ganz voll?',
      options: ['80 m³', '120 m³', '60 m³'],
      correctIndex: 0,
      explanation: '3/5 sind drin, also fehlen 2/5. 200 × 2/5 = 80 m³.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'rechnen', 'kürzen', 'praxis'];

function InfoCard({ darkMode, title, children }) {
  return (
    <div className={`rounded-2xl border p-4 ${darkMode ? 'bg-slate-900/75 border-slate-800' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{title}</h3>
      {children}
    </div>
  );
}

export default function BrücheDeepDiveView() {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('grundlagen');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [revealedAnswer, setRevealedAnswer] = useState(false);

  const tab = TABS[activeTab] || TABS.grundlagen;
  const isCorrect = selectedAnswer === tab.quiz.correctIndex;

  const handleTabChange = (tabId) => { setActiveTab(tabId); setSelectedAnswer(null); setRevealedAnswer(false); };

  return (
    <div className="space-y-5">
      <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-teal-50 via-white to-emerald-50 border-teal-100'}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${darkMode ? 'bg-teal-500/15 text-teal-300' : 'bg-teal-100 text-teal-700'}`}>
              <span>MATHEMATIK</span><span>{tab.chip}</span>
            </div>
            <h2 className={`text-3xl font-bold mt-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tab.title}</h2>
            <p className={`text-sm mt-3 leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{tab.intro}</p>
          </div>
          <div className={`rounded-2xl px-4 py-3 border ${darkMode ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/90 border-teal-100 text-gray-700'}`}>
            <div className="text-xs uppercase tracking-wide opacity-70">Merksatz</div>
            <div className="text-sm font-semibold mt-1">{tab.motto}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {TAB_ORDER.map((tabId) => {
          const entry = TABS[tabId]; const active = tabId === activeTab;
          return (
            <button key={tabId} type="button" onClick={() => handleTabChange(tabId)}
              className={`rounded-2xl border p-4 text-left transition-all ${active ? darkMode ? 'border-teal-400 bg-teal-500/10 shadow-lg shadow-teal-900/20' : 'border-teal-300 bg-teal-50 shadow-sm' : darkMode ? 'border-slate-800 bg-slate-900/70 hover:border-slate-700' : 'border-gray-200 bg-white hover:border-teal-200'}`}>
              <div className={`text-xs font-bold uppercase tracking-wide ${active ? (darkMode ? 'text-teal-300' : 'text-teal-700') : (darkMode ? 'text-slate-400' : 'text-gray-500')}`}>{entry.chip}</div>
              <div className={`text-sm font-semibold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{entry.title}</div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <InfoCard darkMode={darkMode} title="Regeln auf einen Blick">
            <ul className={`space-y-2 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {tab.rules.map((rule) => (<li key={rule} className="flex gap-2"><span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${darkMode ? 'bg-teal-400' : 'bg-teal-500'}`} /><span>{rule}</span></li>))}
            </ul>
          </InfoCard>
          <InfoCard darkMode={darkMode} title="Schritt für Schritt">
            <div className="grid gap-3 md:grid-cols-2">
              {tab.steps.map((step) => (
                <div key={step.title} className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-teal-100 bg-teal-50/60'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{step.title}</div>
                  <p className={`text-sm mt-2 leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{step.text}</p>
                </div>
              ))}
            </div>
          </InfoCard>
          <InfoCard darkMode={darkMode} title="Durchgerechnete Beispiele">
            <div className="space-y-4">
              {tab.examples.map((ex) => (
                <div key={ex.title} className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-teal-100 bg-teal-50/40'}`}>
                  <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ex.title}</div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{ex.given}</p>
                  <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>{ex.question}</p>
                  <div className="overflow-hidden rounded-xl border mt-3 border-transparent">
                    <table className="min-w-full text-sm"><tbody>
                      {ex.steps.map(([l, v]) => (
                        <tr key={l} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                          <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>{l}</td>
                          <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>{v}</td>
                        </tr>
                      ))}
                    </tbody></table>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
        <div className="space-y-5">
          <InfoCard darkMode={darkMode} title="Typische Fehler">
            <ul className={`space-y-2 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {tab.pitfalls.map((p) => (<li key={p} className="flex gap-2"><span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${darkMode ? 'bg-amber-400' : 'bg-amber-500'}`} /><span>{p}</span></li>))}
            </ul>
          </InfoCard>
          <InfoCard darkMode={darkMode} title="Mini-Quiz">
            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tab.quiz.question}</div>
            <div className="mt-4 space-y-2">
              {tab.quiz.options.map((option, index) => (
                <button key={option} type="button" onClick={() => setSelectedAnswer(index)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${selectedAnswer === index ? darkMode ? 'border-teal-400 bg-teal-500/10 text-white' : 'border-teal-300 bg-teal-50 text-gray-900' : darkMode ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700' : 'border-gray-200 bg-white text-gray-700 hover:border-teal-200'}`}>
                  {option}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setRevealedAnswer(true)} disabled={selectedAnswer === null}
              className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${selectedAnswer === null ? 'cursor-not-allowed bg-gray-200 text-gray-400' : darkMode ? 'bg-teal-500 text-white hover:bg-teal-400' : 'bg-teal-600 text-white hover:bg-teal-500'}`}>
              Antwort prüfen
            </button>
            {revealedAnswer && (
              <div className={`mt-4 rounded-2xl border p-4 text-sm leading-7 ${isCorrect ? darkMode ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-800' : darkMode ? 'border-amber-500/40 bg-amber-500/10 text-amber-100' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
                <div className="font-semibold">{isCorrect ? 'Richtig!' : 'Noch nicht ganz.'}</div>
                <div>{tab.quiz.explanation}</div>
              </div>
            )}
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
