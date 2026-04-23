import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Die vier Grundrechenarten',
    intro:
      'Plus, Minus, Mal und Geteilt — das sind die vier Grundrechenarten. Alles in Mathe baut darauf auf. Ob du Badegaeste zaehlst, Eintrittsgelder zusammenrechnest oder Material bestellst: Ohne die Grundrechenarten geht nichts.',
    motto: 'Klammern zuerst, dann Punkt vor Strich.',
    rules: [
      'Es gibt vier Grundrechenarten: Addition (+), Subtraktion (-), Multiplikation (×) und Division (÷).',
      'Punkt vor Strich: Mal und Geteilt werden IMMER vor Plus und Minus gerechnet.',
      'Klammern gehen vor ALLEM anderen — erst Klammer ausrechnen, dann weiter.',
      'Von links nach rechts rechnen, wenn die Rechenzeichen gleichwertig sind.',
      'Die Reihenfolge ist: 1. Klammern → 2. Punkt (× ÷) → 3. Strich (+ -)'
    ],
    steps: [
      {
        title: '1. Aufgabe lesen',
        text: 'Schau genau hin: Welche Rechenzeichen siehst du? Gibt es Klammern? Markiere dir die Reihenfolge.'
      },
      {
        title: '2. Klammern zuerst',
        text: 'Alles was in Klammern steht, rechnest du als Erstes aus. Danach die Klammer weglassen und weiterrechnen.'
      },
      {
        title: '3. Punkt vor Strich',
        text: 'Jetzt alle Mal- und Geteilt-Rechnungen loesen. Erst danach Plus und Minus.'
      },
      {
        title: '4. Von links nach rechts',
        text: 'Wenn nur noch gleiche Rechenzeichen uebrig sind (z.B. nur Plus), rechnest du einfach von links nach rechts.'
      }
    ],
    examples: [
      {
        title: 'Punkt vor Strich',
        given: 'Aufgabe: 18 + 6 × 3',
        question: 'Was ist das Ergebnis?',
        steps: [
          ['Punkt vor Strich', 'Erst 6 × 3 = 18'],
          ['Dann Strich', '18 + 18 = 36'],
          ['Ergebnis', '36']
        ]
      },
      {
        title: 'Mit Klammern',
        given: 'Aufgabe: (18 + 6) × 3',
        question: 'Was ist das Ergebnis?',
        steps: [
          ['Klammer zuerst', '18 + 6 = 24'],
          ['Dann Mal', '24 × 3 = 72'],
          ['Ergebnis', '72']
        ]
      }
    ],
    pitfalls: [
      'NICHT einfach von links nach rechts rechnen — erst Punkt, dann Strich!',
      'Klammern nie uebersehen — die gehen VOR allem anderen.',
      '18 + 6 × 3 ist NICHT 72, sondern 36 (erst 6 × 3, dann + 18).'
    ],
    quiz: {
      question: 'Was ist 40 - 8 ÷ 2?',
      options: ['16', '36', '20'],
      correctIndex: 1,
      explanation: 'Erst Punkt (8 ÷ 2 = 4), dann Strich (40 - 4 = 36).'
    }
  },

  addition: {
    id: 'addition',
    chip: 'Plus & Minus',
    title: 'Addition und Subtraktion',
    intro:
      'Addition (Plus) und Subtraktion (Minus) sind die einfachsten Rechenarten. Du zaehlst dazu oder ziehst ab. Im Bad brauchst du das ständig: Gaeste zählen, Kassenabrechnung, Bestaende prüfen.',
    motto: 'Plus zählt dazu, Minus zieht ab.',
    rules: [
      'Addition (+): Zwei oder mehr Zahlen zusammenzählen.',
      'Subtraktion (-): Eine Zahl von einer anderen abziehen.',
      'Die Reihenfolge beim Addieren ist egal: 3 + 5 = 5 + 3.',
      'Beim Subtrahieren ist die Reihenfolge WICHTIG: 8 - 3 ist nicht dasselbe wie 3 - 8.',
      'Tipp: Grosse Zahlen in Schritten rechnen: 148 + 67 = 148 + 60 + 7 = 215.'
    ],
    steps: [
      {
        title: '1. Zahlen untereinander schreiben',
        text: 'Einer unter Einer, Zehner unter Zehner. Das hilft bei grossen Zahlen enorm.'
      },
      {
        title: '2. Von rechts nach links rechnen',
        text: 'Fange bei den Einern an, dann Zehner, dann Hunderter. Uebertrag nicht vergessen!'
      },
      {
        title: '3. Uebertrag beachten',
        text: 'Wenn eine Spalte mehr als 9 ergibt: Die Einer hinschreiben, den Zehner als Uebertrag zur nächsten Spalte.'
      },
      {
        title: '4. Ergebnis prüfen',
        text: 'Gegenrechnung: Wenn 148 + 67 = 215, dann muss 215 - 67 = 148 sein.'
      }
    ],
    examples: [
      {
        title: 'Badegaeste zählen',
        given: 'Vormittags kommen 148 Gaeste, nachmittags 67 Gaeste.',
        question: 'Wie viele Gaeste waren es insgesamt?',
        steps: [
          ['Aufgabe', '148 + 67'],
          ['Einer', '8 + 7 = 15 → 5 hinschreiben, 1 Uebertrag'],
          ['Zehner', '4 + 6 + 1 = 11 → 1 hinschreiben, 1 Uebertrag'],
          ['Hunderter', '1 + 0 + 1 = 2'],
          ['Ergebnis', '215 Gaeste']
        ]
      },
      {
        title: 'Kassenabrechnung',
        given: 'In der Kasse sind 850 Euro. Es werden 375 Euro abgehoben.',
        question: 'Wie viel bleibt in der Kasse?',
        steps: [
          ['Aufgabe', '850 - 375'],
          ['Einer', '0 - 5 geht nicht → 10 - 5 = 5, 1 Uebertrag'],
          ['Zehner', '5 - 7 - 1 geht nicht → 15 - 7 - 1 = 7, 1 Uebertrag'],
          ['Hunderter', '8 - 3 - 1 = 4'],
          ['Ergebnis', '475 Euro']
        ]
      }
    ],
    pitfalls: [
      'Uebertrag nicht vergessen — das ist der häufigste Fehler!',
      'Bei Subtraktion: Die größere Zahl muss oben stehen.',
      'Einheiten immer mitschreiben: 148 Gaeste + 67 Gaeste = 215 Gaeste.'
    ],
    quiz: {
      question: 'Am Montag kamen 234 Gaeste, am Dienstag 189. Wie viele insgesamt?',
      options: ['413', '423', '433'],
      correctIndex: 1,
      explanation: '234 + 189 = 423 Gaeste.'
    }
  },

  multiplikation: {
    id: 'multiplikation',
    chip: 'Mal & Geteilt',
    title: 'Multiplikation und Division',
    intro:
      'Mal-Rechnen ist schnelles Zusammenzählen: 4 × 5 heisst "5 mal die 4" = 20. Teilen ist das Gegenteil: 20 ÷ 4 = 5. Im Bad brauchst du das für Materialbestellungen, Umrechnungen und Flächenberechnungen.',
    motto: 'Mal ist schnelles Plus, Geteilt ist gerechtes Aufteilen.',
    rules: [
      'Multiplikation (×): Eine Zahl wird mehrfach genommen. 4 × 5 = 4 + 4 + 4 + 4 + 4 = 20.',
      'Division (÷): Eine Zahl wird gleichmaessig aufgeteilt. 20 ÷ 4 = 5.',
      'Die Reihenfolge beim Malnehmen ist egal: 4 × 5 = 5 × 4.',
      'Durch 0 teilen ist VERBOTEN — das geht nicht!',
      'Trick: Mal 10 = eine Null anhaengen. Mal 100 = zwei Nullen anhaengen.'
    ],
    steps: [
      {
        title: '1. Kleines Einmaleins kennen',
        text: 'Die Reihen bis 10 × 10 solltest du auswendig können. Das spart enorm viel Zeit.'
      },
      {
        title: '2. Grosse Zahlen zerlegen',
        text: '23 × 4 = (20 × 4) + (3 × 4) = 80 + 12 = 92. Zerlege in einfache Teile!'
      },
      {
        title: '3. Bei Division: Wie oft passt es rein?',
        text: '92 ÷ 4: Wie oft passt 4 in 9? Zweimal (8). Rest 1. Wie oft passt 4 in 12? Dreimal. Ergebnis: 23.'
      },
      {
        title: '4. Gegenrechnung machen',
        text: 'Wenn 23 × 4 = 92, dann muss 92 ÷ 4 = 23 sein. So pruefst du dich selbst.'
      }
    ],
    examples: [
      {
        title: 'Materialbestellung',
        given: '12 Packungen Chlortabletten zu je 8 Euro.',
        question: 'Was kostet die Bestellung?',
        steps: [
          ['Aufgabe', '12 × 8'],
          ['Zerlegen', '(10 × 8) + (2 × 8)'],
          ['Ausrechnen', '80 + 16 = 96'],
          ['Ergebnis', '96 Euro']
        ]
      },
      {
        title: 'Gerecht aufteilen',
        given: '156 Handtuecher sollen auf 12 Schraenke verteilt werden.',
        question: 'Wie viele pro Schrank?',
        steps: [
          ['Aufgabe', '156 ÷ 12'],
          ['Ueberlegen', '12 × 10 = 120, 12 × 13 = 156'],
          ['Ergebnis', '13 Handtuecher pro Schrank']
        ]
      }
    ],
    pitfalls: [
      'Durch 0 teilen geht NICHT — wenn das in einer Aufgabe vorkommt, stimmt etwas nicht.',
      'Beim Zerlegen: Nicht die Teile vergessen zusammenzuzählen.',
      'Einheiten beachten: Euro × Stueck ergibt keinen Sinn. Stueck × Euro pro Stueck = Euro.'
    ],
    quiz: {
      question: '15 Gaeste kaufen je 3 Getraenke für 2 Euro. Wie viel wird eingenommen?',
      options: ['60 Euro', '90 Euro', '45 Euro'],
      correctIndex: 1,
      explanation: '15 × 3 × 2 = 90 Euro.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Grundrechenarten im Bäderalltag',
    intro:
      'Im Schwimmbad rechnest du jeden Tag: Gaeste zählen, Kasse abrechnen, Material bestellen, Schichtplaene prüfen. Hier uebst du mit echten Aufgaben aus dem Arbeitsalltag.',
    motto: 'Jeden Tag rechnen — mit den Grundrechenarten kein Problem.',
    rules: [
      'Bei Textaufgaben: Erst lesen, dann die Zahlen und Rechenzeichen rausschreiben.',
      'Einheiten immer mitfuehren (Euro, Stueck, Liter, Gaeste).',
      'Ergebnis immer auf Plausibilitaet prüfen: Macht die Zahl Sinn?',
      'Taschenrechner ist erlaubt — aber du musst wissen, welche Rechnung du eingibst!',
      'Zwischenergebnisse aufschreiben, nicht im Kopf behalten.'
    ],
    steps: [
      {
        title: '1. Aufgabe lesen und verstehen',
        text: 'Was ist gegeben? Was wird gefragt? Unterstreiche die wichtigen Zahlen und Woerter.'
      },
      {
        title: '2. Rechenweg aufschreiben',
        text: 'Schreib die Rechnung auf, BEVOR du anfaengst zu rechnen. So machst du weniger Fehler.'
      },
      {
        title: '3. Schritt für Schritt rechnen',
        text: 'Nicht alles auf einmal — eine Rechnung nach der anderen. Zwischenergebnisse notieren.'
      },
      {
        title: '4. Antwortsatz schreiben',
        text: 'In der Prüfung: "Es werden 215 Badegaeste erwartet." Nicht nur die nackte Zahl hinschreiben.'
      }
    ],
    examples: [
      {
        title: 'Tagesabrechnung',
        given: 'Erwachsene: 185 × 5 Euro. Kinder: 92 × 3 Euro. Abendkasse extra: 120 Euro.',
        question: 'Wie hoch sind die Tageseinnahmen?',
        steps: [
          ['Erwachsene', '185 × 5 = 925 Euro'],
          ['Kinder', '92 × 3 = 276 Euro'],
          ['Plus Abendkasse', '925 + 276 + 120'],
          ['Ergebnis', '1.321 Euro Tageseinnahmen']
        ]
      },
      {
        title: 'Materialverbrauch',
        given: 'Pro Woche werden 4 Kanister Chlor verbraucht. Ein Kanister kostet 35 Euro.',
        question: 'Was kosten 6 Wochen Chlor?',
        steps: [
          ['Pro Woche', '4 × 35 = 140 Euro'],
          ['6 Wochen', '140 × 6 = 840 Euro'],
          ['Ergebnis', '840 Euro für 6 Wochen']
        ]
      },
      {
        title: 'Besucherstatistik',
        given: 'Mo: 210, Di: 185, Mi: 240, Do: 195, Fr: 310, Sa: 420, So: 380.',
        question: 'Wie viele Besucher in der Woche?',
        steps: [
          ['Addieren', '210 + 185 + 240 + 195 + 310 + 420 + 380'],
          ['In Schritten', '210 + 185 = 395. + 240 = 635. + 195 = 830.'],
          ['Weiter', '830 + 310 = 1.140. + 420 = 1.560. + 380 = 1.940.'],
          ['Ergebnis', '1.940 Besucher in der Woche']
        ]
      }
    ],
    pitfalls: [
      'Bei Textaufgaben: Nicht einfach alle Zahlen zusammenrechnen — lies GENAU was gefragt ist.',
      'Punkt vor Strich gilt auch bei Textaufgaben mit mehreren Schritten.',
      'Einheiten nicht vergessen: "1.321" ohne Euro sagt nichts aus.',
      'Taschenrechner-Tipp: Klammern setzen bei Punkt-vor-Strich-Aufgaben!'
    ],
    quiz: {
      question: 'Ein Schwimmbad hat 3 Becken mit je 6 Bahnen. Pro Bahn passen 8 Schwimmer. Wie viele Schwimmer maximal?',
      options: ['48', '144', '96'],
      correctIndex: 1,
      explanation: '3 × 6 × 8 = 144 Schwimmer maximal.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'addition', 'multiplikation', 'praxis'];

function InfoCard({ darkMode, title, children }) {
  return (
    <div className={`rounded-2xl border p-4 ${darkMode ? 'bg-slate-900/75 border-slate-800' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{title}</h3>
      {children}
    </div>
  );
}

export default function GrundrechenartenDeepDiveView() {
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
      <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-teal-50 via-white to-emerald-50 border-teal-100'}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${darkMode ? 'bg-teal-500/15 text-teal-300' : 'bg-teal-100 text-teal-700'}`}>
              <span>MATHEMATIK</span>
              <span>{tab.chip}</span>
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
          const entry = TABS[tabId];
          const active = tabId === activeTab;
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
              {tab.rules.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${darkMode ? 'bg-teal-400' : 'bg-teal-500'}`} />
                  <span>{rule}</span>
                </li>
              ))}
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
              {tab.examples.map((example) => (
                <div key={example.title} className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-teal-100 bg-teal-50/40'}`}>
                  <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{example.title}</div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{example.given}</p>
                  <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>{example.question}</p>
                  <div className="overflow-hidden rounded-xl border mt-3 border-transparent">
                    <table className="min-w-full text-sm">
                      <tbody>
                        {example.steps.map(([label, value]) => (
                          <tr key={label} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                            <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>{label}</td>
                            <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>

        <div className="space-y-5">
          <InfoCard darkMode={darkMode} title="Typische Fehler">
            <ul className={`space-y-2 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {tab.pitfalls.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${darkMode ? 'bg-amber-400' : 'bg-amber-500'}`} />
                  <span>{p}</span>
                </li>
              ))}
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
