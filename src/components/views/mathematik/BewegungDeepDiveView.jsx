import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was ist Geschwindigkeit?',
    intro:
      'Geschwindigkeit beschreibt, wie schnell sich etwas bewegt. Ein Schwimmer im Becken, Wasser in einer Rohrleitung oder ein Kind auf der Rutsche — alles hat eine Geschwindigkeit. Die Formel ist einfach: Geschwindigkeit = Strecke geteilt durch Zeit. In der Ausbildung brauchst du das ständig.',
    motto: 'v = s ÷ t — Strecke durch Zeit.',
    rules: [
      'Geschwindigkeit (v) = Strecke (s) geteilt durch Zeit (t). Kurzform: v = s ÷ t.',
      'v steht für Geschwindigkeit (vom lateinischen "velocitas").',
      's steht für die Strecke (der Weg in Metern oder Kilometern).',
      't steht für die Zeit (in Sekunden, Minuten oder Stunden).',
      'Die häufigsten Einheiten sind m/s (Meter pro Sekunde) und km/h (Kilometer pro Stunde).'
    ],
    steps: [
      {
        title: '1. Was ist gegeben?',
        text: 'Schreib auf, welche Werte du hast. Zum Beispiel: Ein Schwimmer schwimmt 50 Meter in 40 Sekunden. Strecke s = 50 m, Zeit t = 40 s.'
      },
      {
        title: '2. Formel aufschreiben',
        text: 'v = s ÷ t. Setz die Werte ein: v = 50 m ÷ 40 s.'
      },
      {
        title: '3. Ausrechnen',
        text: '50 ÷ 40 = 1,25. Die Geschwindigkeit ist also 1,25 m/s.'
      },
      {
        title: '4. Einheit dranschreiben',
        text: 'IMMER die Einheit dazuschreiben! Hier: 1,25 m/s. Ohne Einheit ist die Zahl wertlos.'
      }
    ],
    examples: [
      {
        title: 'Schwimmer im 50-m-Becken',
        given: 'Ein Schwimmer schwimmt 50 Meter in 40 Sekunden.',
        question: 'Wie schnell ist der Schwimmer?',
        steps: [
          ['Gegeben', 's = 50 m, t = 40 s'],
          ['Formel', 'v = s ÷ t'],
          ['Einsetzen', 'v = 50 ÷ 40 = 1,25'],
          ['Ergebnis', 'v = 1,25 m/s']
        ]
      },
      {
        title: 'Wasserrutsche',
        given: 'Die Rutsche ist 30 Meter lang. Die Fahrt dauert 6 Sekunden.',
        question: 'Wie schnell rutscht man?',
        steps: [
          ['Gegeben', 's = 30 m, t = 6 s'],
          ['Formel', 'v = s ÷ t'],
          ['Einsetzen', 'v = 30 ÷ 6 = 5'],
          ['Ergebnis', 'v = 5 m/s']
        ]
      }
    ],
    pitfalls: [
      'v, s und t NICHT verwechseln! v = Geschwindigkeit, s = Strecke, t = Zeit.',
      'IMMER die Einheit dazuschreiben — "1,25" allein sagt nichts aus.',
      'Strecke und Zeit müssen zusammenpassen: Meter mit Sekunden oder Kilometer mit Stunden.',
      'Geschwindigkeit kann NICHT negativ sein (im Schwimmbad-Kontext).'
    ],
    quiz: {
      question: 'Ein Kind schwimmt 25 Meter in 50 Sekunden. Wie schnell ist es?',
      options: ['0,25 m/s', '0,5 m/s', '2 m/s'],
      correctIndex: 1,
      explanation: 'v = s ÷ t = 25 ÷ 50 = 0,5 m/s.'
    }
  },

  berechnung: {
    id: 'berechnung',
    chip: 'Berechnung',
    title: 'Geschwindigkeit, Strecke oder Zeit berechnen',
    intro:
      'Mit der Formel v = s ÷ t kannst du ALLES berechnen — nicht nur die Geschwindigkeit. Du kannst auch die Strecke oder die Zeit ausrechnen. Der Trick: Das Formeldreieck. Einfach den gesuchten Wert abdecken und ablesen, wie du rechnen musst.',
    motto: 'Dreieck-Trick: Abdecken und ablesen.',
    rules: [
      'v = s ÷ t — Geschwindigkeit berechnen, wenn Strecke und Zeit bekannt sind.',
      's = v × t — Strecke berechnen, wenn Geschwindigkeit und Zeit bekannt sind.',
      't = s ÷ v — Zeit berechnen, wenn Strecke und Geschwindigkeit bekannt sind.',
      'Formeldreieck: Oben steht s, unten links v, unten rechts t. Abdecken was gesucht ist!',
      'Nebeneinander = malnehmen. Uebereinander = teilen.'
    ],
    steps: [
      {
        title: '1. Was ist gesucht?',
        text: 'Lies die Aufgabe genau. Wird nach der Geschwindigkeit (v), der Strecke (s) oder der Zeit (t) gefragt?'
      },
      {
        title: '2. Formeldreieck nutzen',
        text: 'Deck im Dreieck den gesuchten Buchstaben ab. Was uebrig bleibt, ist die Formel. s abgedeckt → v × t. v abgedeckt → s ÷ t. t abgedeckt → s ÷ v.'
      },
      {
        title: '3. Werte einsetzen',
        text: 'Setz die bekannten Werte in die Formel ein. Achte auf die richtigen Einheiten!'
      },
      {
        title: '4. Ergebnis mit Einheit',
        text: 'Rechne aus und schreib die passende Einheit dazu. Pruefe: Macht das Ergebnis Sinn?'
      }
    ],
    examples: [
      {
        title: 'Strecke berechnen',
        given: 'Ein Schwimmer schwimmt mit 1,5 m/s. Er schwimmt 60 Sekunden lang.',
        question: 'Welche Strecke legt er zurück?',
        steps: [
          ['Gegeben', 'v = 1,5 m/s, t = 60 s'],
          ['Formel', 's = v × t'],
          ['Einsetzen', 's = 1,5 × 60 = 90'],
          ['Ergebnis', 's = 90 m']
        ]
      },
      {
        title: 'Zeit berechnen',
        given: 'Wasser fliesst mit 2 m/s durch ein 80 Meter langes Rohr.',
        question: 'Wie lange braucht das Wasser?',
        steps: [
          ['Gegeben', 'v = 2 m/s, s = 80 m'],
          ['Formel', 't = s ÷ v'],
          ['Einsetzen', 't = 80 ÷ 2 = 40'],
          ['Ergebnis', 't = 40 s']
        ]
      },
      {
        title: 'Geschwindigkeit berechnen',
        given: 'Ein Rettungsschwimmer sprint 20 Meter in 8 Sekunden zum Beckenrand.',
        question: 'Wie schnell ist er?',
        steps: [
          ['Gegeben', 's = 20 m, t = 8 s'],
          ['Formel', 'v = s ÷ t'],
          ['Einsetzen', 'v = 20 ÷ 8 = 2,5'],
          ['Ergebnis', 'v = 2,5 m/s']
        ]
      }
    ],
    pitfalls: [
      'Das Formeldreieck falsch aufbauen — s steht IMMER oben, v und t stehen unten.',
      'Malnehmen und Teilen verwechseln: Nebeneinander = ×, uebereinander = ÷.',
      'Die Einheiten müssen zusammenpassen! Nicht m/s mit km oder Minuten mischen.'
    ],
    quiz: {
      question: 'Wasser fliesst mit 3 m/s durch ein Rohr. Wie weit kommt es in 20 Sekunden?',
      options: ['30 m', '60 m', '90 m'],
      correctIndex: 1,
      explanation: 's = v × t = 3 × 20 = 60 m.'
    }
  },

  umrechnung: {
    id: 'umrechnung',
    chip: 'Umrechnung',
    title: 'm/s und km/h umrechnen',
    intro:
      'Im Schwimmbad rechnest du meistens mit m/s (Meter pro Sekunde). Aber manchmal brauchst du km/h (Kilometer pro Stunde) — zum Beispiel für Wasserrutschen-Geschwindigkeiten oder wenn du Werte vergleichen willst. Die Umrechnung ist einfach, wenn du dir die Zahl 3,6 merkst.',
    motto: '× 3,6 = km/h. ÷ 3,6 = m/s.',
    rules: [
      'Von m/s nach km/h: MAL 3,6 rechnen.',
      'Von km/h nach m/s: DURCH 3,6 rechnen.',
      'Warum 3,6? Weil 1 km = 1000 m und 1 h = 3600 s. 1000 ÷ 3600 = 1 ÷ 3,6.',
      'km/h ist IMMER die größere Zahl (3,6-mal so gross wie m/s).',
      'NIEMALS Einheiten mischen! Erst alles in die gleiche Einheit umrechnen, dann rechnen.'
    ],
    steps: [
      {
        title: '1. Welche Einheit hast du?',
        text: 'Schau auf die Einheit: Steht da m/s oder km/h? Das bestimmt, ob du mal oder durch 3,6 rechnest.'
      },
      {
        title: '2. Welche Einheit brauchst du?',
        text: 'Was wird in der Aufgabe verlangt? Wenn du km/h brauchst und m/s hast → mal 3,6. Andersrum → durch 3,6.'
      },
      {
        title: '3. Umrechnen',
        text: 'Einfach den Wert mal 3,6 oder durch 3,6 nehmen. Taschenrechner ist erlaubt!'
      },
      {
        title: '4. Ergebnis prüfen',
        text: 'km/h muss IMMER größer sein als m/s. Wenn nicht, hast du falsch herum gerechnet.'
      }
    ],
    examples: [
      {
        title: 'm/s in km/h umrechnen',
        given: 'Ein Schwimmer schwimmt mit 1,5 m/s.',
        question: 'Wie viel ist das in km/h?',
        steps: [
          ['Gegeben', 'v = 1,5 m/s'],
          ['Richtung', 'm/s → km/h = mal 3,6'],
          ['Rechnung', '1,5 × 3,6 = 5,4'],
          ['Ergebnis', 'v = 5,4 km/h']
        ]
      },
      {
        title: 'km/h in m/s umrechnen',
        given: 'Wasser auf der Rutsche hat eine Geschwindigkeit von 36 km/h.',
        question: 'Wie viel ist das in m/s?',
        steps: [
          ['Gegeben', 'v = 36 km/h'],
          ['Richtung', 'km/h → m/s = durch 3,6'],
          ['Rechnung', '36 ÷ 3,6 = 10'],
          ['Ergebnis', 'v = 10 m/s']
        ]
      },
      {
        title: 'Einheiten vor dem Rechnen anpassen',
        given: 'Ein Rohr ist 500 m lang. Wasser fliesst mit 7,2 km/h.',
        question: 'Wie lange braucht das Wasser? (Antwort in Sekunden)',
        steps: [
          ['Gegeben', 's = 500 m, v = 7,2 km/h'],
          ['Umrechnen', '7,2 km/h ÷ 3,6 = 2 m/s'],
          ['Formel', 't = s ÷ v = 500 ÷ 2 = 250'],
          ['Ergebnis', 't = 250 s (ca. 4 Minuten)']
        ]
      }
    ],
    pitfalls: [
      'Die häufigste Falle: × und ÷ vertauschen. Merke: km/h ist die GROESSERE Zahl!',
      'Einheiten mischen: 50 m ÷ 2 km/h geht NICHT — erst km/h in m/s umrechnen!',
      'Die 3,6 vergessen und stattdessen mit 60 oder 1000 rechnen — das stimmt nicht.',
      'Bei der Prüfung: Immer zuerst alle Werte in die GLEICHE Einheit bringen.'
    ],
    quiz: {
      question: 'Ein Schwimmer schwimmt mit 2 m/s. Wie viel km/h sind das?',
      options: ['5,4 km/h', '7,2 km/h', '0,56 km/h'],
      correctIndex: 1,
      explanation: '2 m/s × 3,6 = 7,2 km/h.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Geschwindigkeit im Bäderalltag',
    intro:
      'Im Schwimmbad begegnet dir Geschwindigkeit überall: Wie schnell schwimmt ein Gast? Wie schnell fliesst Wasser durch die Rohrleitung? Wie schnell ist die Rutsche? Hier uebst du mit echten Aufgaben aus dem Bäderalltag. Genau solche Aufgaben kommen in der Prüfung dran!',
    motto: 'Geschwindigkeit steckt im ganzen Schwimmbad.',
    rules: [
      'Schwimmer-Geschwindigkeit im Sportschwimmen liegt zwischen 1 und 2 m/s.',
      'Wassergeschwindigkeit in Rohrleitungen liegt meistens zwischen 1 und 3 m/s.',
      'Rutschen-Geschwindigkeit kann bis zu 10 m/s (36 km/h) erreichen.',
      'Bei Stroemungsaufgaben in der Prüfung: Immer erst v = s ÷ t anwenden.',
      'Tipp: Wenn die Aufgabe Minuten angibt, erst in Sekunden umrechnen (× 60)!'
    ],
    steps: [
      {
        title: '1. Aufgabe lesen und Werte rausschreiben',
        text: 'Was ist gegeben: Strecke, Zeit oder Geschwindigkeit? Was ist gesucht? Schreib alles mit Einheit auf.'
      },
      {
        title: '2. Einheiten prüfen',
        text: 'Passen die Einheiten zusammen? Meter mit Sekunden? Oder musst du erst umrechnen (Minuten → Sekunden, km → m)?'
      },
      {
        title: '3. Richtige Formel wählen',
        text: 'v = s ÷ t (Geschwindigkeit gesucht), s = v × t (Strecke gesucht), t = s ÷ v (Zeit gesucht). Im Zweifel: Formeldreieck!'
      },
      {
        title: '4. Ergebnis auf Sinn prüfen',
        text: 'Ist die Schwimmer-Geschwindigkeit realistisch (ca. 0,5 bis 2 m/s)? Ist die Rohrgeschwindigkeit im normalen Bereich (1-3 m/s)?'
      }
    ],
    examples: [
      {
        title: 'Schwimmer-Geschwindigkeit',
        given: 'Ein Schwimmer schwimmt 50 Meter Freistil in 40 Sekunden.',
        question: 'Wie schnell schwimmt er in m/s und km/h?',
        steps: [
          ['Gegeben', 's = 50 m, t = 40 s'],
          ['Geschwindigkeit', 'v = 50 ÷ 40 = 1,25 m/s'],
          ['Umrechnung', '1,25 × 3,6 = 4,5 km/h'],
          ['Ergebnis', 'v = 1,25 m/s = 4,5 km/h']
        ]
      },
      {
        title: 'Wassergeschwindigkeit im Rohr',
        given: 'Eine Rohrleitung ist 120 Meter lang. Das Wasser braucht 60 Sekunden.',
        question: 'Wie schnell fliesst das Wasser?',
        steps: [
          ['Gegeben', 's = 120 m, t = 60 s'],
          ['Formel', 'v = s ÷ t'],
          ['Rechnung', 'v = 120 ÷ 60 = 2'],
          ['Ergebnis', 'v = 2 m/s']
        ]
      },
      {
        title: 'Rutschengeschwindigkeit',
        given: 'Eine Rutsche ist 45 Meter lang. Die Fahrt dauert 5 Sekunden.',
        question: 'Wie schnell ist man auf der Rutsche (in m/s und km/h)?',
        steps: [
          ['Gegeben', 's = 45 m, t = 5 s'],
          ['Geschwindigkeit', 'v = 45 ÷ 5 = 9 m/s'],
          ['Umrechnung', '9 × 3,6 = 32,4 km/h'],
          ['Ergebnis', 'v = 9 m/s = 32,4 km/h']
        ]
      },
      {
        title: 'Strecke eines Schwimmers',
        given: 'Ein Schwimmer schwimmt mit 0,8 m/s. Er schwimmt 5 Minuten lang.',
        question: 'Wie weit kommt er?',
        steps: [
          ['Gegeben', 'v = 0,8 m/s, t = 5 min = 300 s'],
          ['Formel', 's = v × t'],
          ['Rechnung', 's = 0,8 × 300 = 240'],
          ['Ergebnis', 's = 240 m (fast 10 Bahnen im 25-m-Becken)']
        ]
      }
    ],
    pitfalls: [
      'Minuten und Sekunden verwechseln! 5 Minuten sind 300 Sekunden, nicht 5.',
      'In der Prüfung: Auf die gefragte Einheit achten — manchmal wird km/h verlangt, manchmal m/s.',
      'Unrealistische Ergebnisse nicht einfach hinschreiben — ein Schwimmer mit 15 m/s ist unmöglich.',
      'Bei Rohraufgaben: Die Länge des Rohrs ist die Strecke, nicht der Durchmesser!'
    ],
    quiz: {
      question: 'Wasser fliesst mit 1,5 m/s durch ein 90 Meter langes Rohr. Wie lange braucht es?',
      options: ['45 Sekunden', '60 Sekunden', '135 Sekunden'],
      correctIndex: 1,
      explanation: 't = s ÷ v = 90 ÷ 1,5 = 60 Sekunden.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'berechnung', 'umrechnung', 'praxis'];

/* ─── Formula overview for grundlagen and berechnung tabs ─────────────────── */

const FORMULA_OVERVIEW = [
  ['Gesucht', 'Formel', 'Beispiel'],
  ['Geschwindigkeit v', 'v = s ÷ t', '50 m ÷ 40 s = 1,25 m/s'],
  ['Strecke s', 's = v × t', '2 m/s × 30 s = 60 m'],
  ['Zeit t', 't = s ÷ v', '100 m ÷ 2 m/s = 50 s']
];

/* ─── Unit conversion reference for umrechnung tab ────────────────────────── */

const UNIT_REFERENCE = [
  ['Richtung', 'Rechnung', 'Beispiel'],
  ['m/s → km/h', '× 3,6', '2 m/s × 3,6 = 7,2 km/h'],
  ['km/h → m/s', '÷ 3,6', '36 km/h ÷ 3,6 = 10 m/s'],
  ['min → s', '× 60', '5 min × 60 = 300 s'],
  ['km → m', '× 1000', '2 km × 1000 = 2000 m']
];

/* ─── Shared components ─────────────────────────────────────────────────────── */

function InfoCard({ darkMode, title, children }) {
  return (
    <div className={`rounded-2xl border p-4 ${darkMode ? 'bg-slate-900/75 border-slate-800' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function StepCards({ steps, darkMode }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {steps.map((step) => (
        <div
          key={step.title}
          className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-teal-100 bg-teal-50/60'}`}
        >
          <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {step.title}
          </div>
          <p className={`text-sm mt-2 leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            {step.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function ExampleCard({ example, darkMode }) {
  return (
    <div className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-teal-100 bg-teal-50/40'}`}>
      <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {example.title}
      </div>
      <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
        {example.given}
      </p>
      <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
        {example.question}
      </p>
      <div className="overflow-hidden rounded-xl border mt-3 border-transparent">
        <table className="min-w-full text-sm">
          <tbody>
            {example.steps.map(([label, value]) => (
              <tr key={label} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                  {label}
                </td>
                <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────────────────── */

export default function BewegungDeepDiveView() {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('grundlagen');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [revealedAnswer, setRevealedAnswer] = useState(false);

  const tab = TABS[activeTab] || TABS.grundlagen;
  const isCorrect = selectedAnswer === tab.quiz.correctIndex;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedAnswer(null);
    setRevealedAnswer(false);
  };

  return (
    <div className="space-y-5">
      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-teal-50 via-white to-emerald-50 border-teal-100'}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${darkMode ? 'bg-teal-500/15 text-teal-300' : 'bg-teal-100 text-teal-700'}`}>
              <span>MATHEMATIK</span>
              <span>{tab.chip}</span>
            </div>
            <h2 className={`text-3xl font-bold mt-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tab.title}
            </h2>
            <p className={`text-sm mt-3 leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {tab.intro}
            </p>
          </div>
          <div className={`rounded-2xl px-4 py-3 border ${darkMode ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/90 border-teal-100 text-gray-700'}`}>
            <div className="text-xs uppercase tracking-wide opacity-70">Merksatz</div>
            <div className="text-sm font-semibold mt-1">{tab.motto}</div>
          </div>
        </div>
      </div>

      {/* ── Tab navigation ──────────────────────────────────────────────── */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {TAB_ORDER.map((tabId) => {
          const entry = TABS[tabId];
          const active = tabId === activeTab;
          return (
            <button
              key={tabId}
              type="button"
              onClick={() => handleTabChange(tabId)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                active
                  ? darkMode
                    ? 'border-teal-400 bg-teal-500/10 shadow-lg shadow-teal-900/20'
                    : 'border-teal-300 bg-teal-50 shadow-sm'
                  : darkMode
                    ? 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                    : 'border-gray-200 bg-white hover:border-teal-200'
              }`}
            >
              <div className={`text-xs font-bold uppercase tracking-wide ${active ? (darkMode ? 'text-teal-300' : 'text-teal-700') : (darkMode ? 'text-slate-400' : 'text-gray-500')}`}>
                {entry.chip}
              </div>
              <div className={`text-sm font-semibold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {entry.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Main content grid ───────────────────────────────────────────── */}
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          {/* Rules */}
          <InfoCard darkMode={darkMode} title="Regeln auf einen Blick">
            <ul className={`space-y-2 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {tab.rules.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${darkMode ? 'bg-teal-400' : 'bg-teal-500'}`} />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          {/* Steps */}
          <InfoCard darkMode={darkMode} title="Schritt für Schritt">
            <StepCards steps={tab.steps} darkMode={darkMode} />
          </InfoCard>

          {/* Worked examples */}
          <InfoCard darkMode={darkMode} title="Durchgerechnete Beispiele">
            <div className="space-y-4">
              {tab.examples.map((example) => (
                <ExampleCard key={example.title} example={example} darkMode={darkMode} />
              ))}
            </div>
          </InfoCard>
        </div>

        {/* ── Right sidebar ───────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Pitfalls */}
          <InfoCard darkMode={darkMode} title="Typische Fehler">
            <ul className={`space-y-2 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {tab.pitfalls.map((pitfall) => (
                <li key={pitfall} className="flex gap-2">
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${darkMode ? 'bg-amber-400' : 'bg-amber-500'}`} />
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          {/* Formula overview (on grundlagen and berechnung tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'berechnung') && (
            <InfoCard darkMode={darkMode} title="Formelübersicht: v, s, t">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {FORMULA_OVERVIEW[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FORMULA_OVERVIEW.slice(1).map(([gesucht, formel, beispiel]) => (
                      <tr key={gesucht} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {gesucht}
                        </td>
                        <td className={`px-3 py-2 font-mono ${darkMode ? 'bg-teal-900/20 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                          {formel}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {beispiel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Unit conversion reference (on umrechnung and praxis tabs) */}
          {(activeTab === 'umrechnung' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Umrechnungs-Tabelle">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {UNIT_REFERENCE[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {UNIT_REFERENCE.slice(1).map(([richtung, rechnung, beispiel]) => (
                      <tr key={richtung} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {richtung}
                        </td>
                        <td className={`px-3 py-2 font-mono ${darkMode ? 'bg-teal-900/20 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                          {rechnung}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {beispiel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Mini-Quiz */}
          <InfoCard darkMode={darkMode} title="Mini-Quiz">
            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tab.quiz.question}
            </div>
            <div className="mt-4 space-y-2">
              {tab.quiz.options.map((option, index) => {
                const active = selectedAnswer === index;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      active
                        ? darkMode
                          ? 'border-teal-400 bg-teal-500/10 text-white'
                          : 'border-teal-300 bg-teal-50 text-gray-900'
                        : darkMode
                          ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-teal-200'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setRevealedAnswer(true)}
              disabled={selectedAnswer === null}
              className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                selectedAnswer === null
                  ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                  : darkMode
                    ? 'bg-teal-500 text-white hover:bg-teal-400'
                    : 'bg-teal-600 text-white hover:bg-teal-500'
              }`}
            >
              Antwort prüfen
            </button>
            {revealedAnswer && (
              <div className={`mt-4 rounded-2xl border p-4 text-sm leading-7 ${
                isCorrect
                  ? darkMode
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : darkMode
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-100'
                    : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}>
                <div className="font-semibold">
                  {isCorrect ? 'Richtig!' : 'Noch nicht ganz.'}
                </div>
                <div>{tab.quiz.explanation}</div>
              </div>
            )}
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
