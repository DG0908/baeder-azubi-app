import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was sind Prozente?',
    intro:
      'Prozent bedeutet "von Hundert". Wenn du 15 % sagst, meinst du 15 von 100. Das ist wie ein Stück von einem Kuchen, der in 100 Teile geschnitten ist. Im Schwimmbad begegnen dir Prozente überall: Chlorkonzentration, Auslastung, Rabatte auf Jahreskarten.',
    motto: 'Prozent = von Hundert.',
    rules: [
      'Prozent kommt vom lateinischen "pro centum" und bedeutet "von Hundert".',
      '15 % heißt: 15 von 100 — oder 15 Hundertstel.',
      '100 % bedeutet das Ganze — alles zusammen.',
      '50 % ist genau die Hälfte, 25 % ist ein Viertel.',
      'Es gibt drei Größen: Grundwert (das Ganze), Prozentsatz (der Anteil in %), Prozentwert (das Ergebnis).'
    ],
    steps: [
      {
        title: '1. Grundwert erkennen',
        text: 'Der Grundwert ist das Ganze, also die 100 %. Beispiel: Das Schwimmbad hat 400 Plätze — das sind 100 %.'
      },
      {
        title: '2. Prozentsatz erkennen',
        text: 'Der Prozentsatz sagt dir, wie viel "von Hundert" gemeint ist. Beispiel: 75 % der Plätze sind belegt.'
      },
      {
        title: '3. Prozentwert berechnen',
        text: 'Der Prozentwert ist das tatsächliche Ergebnis in Stück, Euro, Liter usw. Beispiel: 75 % von 400 = 300 Plätze.'
      },
      {
        title: '4. Ergebnis prüfen',
        text: 'Ist der Prozentwert kleiner als der Grundwert? Bei Prozentsätzen unter 100 % muss das so sein. 300 < 400 — passt!'
      }
    ],
    examples: [
      {
        title: 'Einfaches Beispiel: Auslastung',
        given: 'Ein Schwimmbad hat 200 Plätze. Heute sind 50 % belegt.',
        question: 'Wie viele Plätze sind belegt?',
        steps: [
          ['Grundwert', '200 Plätze (= 100 %)'],
          ['Prozentsatz', '50 %'],
          ['Rechnung', '200 × 50 ÷ 100 = 100'],
          ['Ergebnis', '100 Plätze sind belegt']
        ]
      },
      {
        title: 'Bäder-Beispiel: Chlorlösung',
        given: 'Eine Chlorlösung hat 150 Liter. Der Wirkstoffanteil beträgt 10 %.',
        question: 'Wie viel Liter reiner Wirkstoff sind enthalten?',
        steps: [
          ['Grundwert', '150 Liter (= 100 %)'],
          ['Prozentsatz', '10 %'],
          ['Rechnung', '150 × 10 ÷ 100 = 15'],
          ['Ergebnis', '15 Liter reiner Wirkstoff']
        ]
      },
      {
        title: 'Alltags-Beispiel: Rabatt',
        given: 'Eine Jahreskarte kostet 400 Euro. Es gibt 25 % Mitarbeiterrabatt.',
        question: 'Wie viel Euro Rabatt bekommt man?',
        steps: [
          ['Grundwert', '400 Euro (= 100 %)'],
          ['Prozentsatz', '25 %'],
          ['Rechnung', '400 × 25 ÷ 100 = 100'],
          ['Ergebnis', '100 Euro Rabatt']
        ]
      }
    ],
    pitfalls: [
      'Prozent ist NICHT das Gleiche wie eine Menge — 50 % von 10 ist etwas anderes als 50 % von 1.000!',
      'Vergiss nicht: Der Grundwert ist IMMER die 100 %, nicht der Prozentwert.',
      'Häufiger Fehler: Das %-Zeichen vergessen und dann mit der falschen Zahl rechnen.',
      '100 % ist das Ganze. Mehr als 100 % bedeutet: mehr als alles (z.B. 120 % Auslastung = überfüllt).'
    ],
    quiz: {
      question: 'Ein Becken fasst 500 m³ Wasser. Es ist zu 80 % gefüllt. Wie viel Wasser ist im Becken?',
      options: ['350 m³', '400 m³', '450 m³'],
      correctIndex: 1,
      explanation: '500 × 80 ÷ 100 = 400 m³. Das Becken enthält 400 m³ Wasser.'
    }
  },

  prozentwert: {
    id: 'prozentwert',
    chip: 'Prozentwert',
    title: 'Den Prozentwert berechnen',
    intro:
      'Der Prozentwert ist das Ergebnis einer Prozentrechnung. Du kennst den Grundwert (das Ganze) und den Prozentsatz (wie viel Prozent), und willst wissen, wie viel das in echt ist. Die Formel ist einfach: Prozentwert = Grundwert × Prozentsatz ÷ 100.',
    motto: 'Prozentwert = Grundwert × Prozentsatz ÷ 100.',
    rules: [
      'Die Formel lautet: Prozentwert = Grundwert × Prozentsatz ÷ 100.',
      'Du kannst auch zuerst durch 100 teilen und dann malnehmen — das Ergebnis ist gleich.',
      'Der Prozentwert hat die gleiche Einheit wie der Grundwert (Euro, Liter, Stück usw.).',
      'Bei 1 % teilst du den Grundwert einfach durch 100.',
      'Trick: 10 % = Grundwert durch 10. 5 % = die Hälfte von 10 %.'
    ],
    steps: [
      {
        title: '1. Grundwert und Prozentsatz finden',
        text: 'Lies die Aufgabe genau. Der Grundwert ist das Ganze (100 %). Der Prozentsatz steht mit dem %-Zeichen in der Aufgabe.'
      },
      {
        title: '2. Formel aufschreiben',
        text: 'Prozentwert = Grundwert × Prozentsatz ÷ 100. Schreib die Zahlen ein, bevor du rechnest.'
      },
      {
        title: '3. Ausrechnen',
        text: 'Erst malnehmen, dann durch 100 teilen. Oder erst durch 100 teilen, dann malnehmen — beides geht.'
      },
      {
        title: '4. Einheit nicht vergessen',
        text: 'Das Ergebnis braucht immer eine Einheit: Euro, Liter, Stück, m³ — die gleiche wie der Grundwert!'
      }
    ],
    examples: [
      {
        title: 'Besucherstatistik',
        given: 'Am Wochenende kommen 1.200 Besucher. 35 % davon sind Kinder.',
        question: 'Wie viele Kinder kommen?',
        steps: [
          ['Grundwert', '1.200 Besucher'],
          ['Prozentsatz', '35 %'],
          ['Rechnung', '1.200 × 35 ÷ 100 = 420'],
          ['Ergebnis', '420 Kinder besuchen das Bad']
        ]
      },
      {
        title: 'Wasserverlust',
        given: 'Ein Becken enthält 800 m³ Wasser. Durch Verdunstung gehen täglich 0,5 % verloren.',
        question: 'Wie viel Wasser verdunstet pro Tag?',
        steps: [
          ['Grundwert', '800 m³'],
          ['Prozentsatz', '0,5 %'],
          ['Rechnung', '800 × 0,5 ÷ 100 = 4'],
          ['Ergebnis', '4 m³ Wasser verdunsten täglich']
        ]
      },
      {
        title: 'Energiekosten-Erhöhung',
        given: 'Die monatlichen Energiekosten betragen 8.000 Euro. Die Kosten steigen um 12 %.',
        question: 'Wie viel Euro beträgt die Erhöhung?',
        steps: [
          ['Grundwert', '8.000 Euro'],
          ['Prozentsatz', '12 %'],
          ['Rechnung', '8.000 × 12 ÷ 100 = 960'],
          ['Ergebnis', 'Die Kosten steigen um 960 Euro']
        ]
      }
    ],
    pitfalls: [
      'Nicht den Prozentsatz direkt als Ergebnis nehmen — 35 % sind NICHT 35 Stück!',
      'Immer durch 100 teilen, nicht durch 10 oder 1.000.',
      'Bei Dezimal-Prozentsätzen (z.B. 0,5 %) besonders aufpassen: Erst mal 0,5, DANN durch 100.',
      'Wenn nach dem neuen Gesamtpreis gefragt wird: Prozentwert zum Grundwert ADDIEREN!'
    ],
    quiz: {
      question: 'Ein Hallenbad hat Jahreskosten von 250.000 Euro. 18 % davon sind Personalkosten. Wie hoch sind die Personalkosten?',
      options: ['35.000 Euro', '45.000 Euro', '55.000 Euro'],
      correctIndex: 1,
      explanation: '250.000 × 18 ÷ 100 = 45.000 Euro Personalkosten.'
    }
  },

  grundwert: {
    id: 'grundwert',
    chip: 'Grundwert & %',
    title: 'Grundwert und Prozentsatz berechnen',
    intro:
      'Manchmal kennst du das Ergebnis (den Prozentwert) und sollst rückwärts rechnen. Entweder du suchst den Grundwert ("Was war das Ganze?") oder den Prozentsatz ("Wie viel Prozent sind das?"). Beide Formeln sind einfach, wenn du sie dir einmal merkst.',
    motto: 'Rückwärts rechnen: Vom Teil zum Ganzen.',
    rules: [
      'Grundwert gesucht: Grundwert = Prozentwert × 100 ÷ Prozentsatz.',
      'Prozentsatz gesucht: Prozentsatz = Prozentwert × 100 ÷ Grundwert.',
      'Merkhilfe Dreiecksformel: Oben steht der Prozentwert × 100, unten Grundwert und Prozentsatz.',
      'Beim Grundwert-Suchen: Das Ergebnis muss GROESSER sein als der Prozentwert (weil 100 % mehr ist als z.B. 25 %).',
      'Beim Prozentsatz-Suchen: Das Ergebnis muss eine Zahl zwischen 0 und 100 sein (normalerweise).'
    ],
    steps: [
      {
        title: '1. Was ist gesucht?',
        text: 'Lies die Aufgabe: Suchst du das Ganze (Grundwert) oder den Prozentsatz? Das bestimmt, welche Formel du brauchst.'
      },
      {
        title: '2. Bekannte Werte einsetzen',
        text: 'Schreib auf, was du kennst: Prozentwert (das Teilstück) und entweder den Prozentsatz oder den Grundwert.'
      },
      {
        title: '3. Formel anwenden',
        text: 'Grundwert = Prozentwert × 100 ÷ Prozentsatz. ODER: Prozentsatz = Prozentwert × 100 ÷ Grundwert.'
      },
      {
        title: '4. Ergebnis auf Plausibilität prüfen',
        text: 'Grundwert muss größer sein als der Prozentwert. Prozentsatz sollte sinnvoll sein (z.B. nicht 500 %, wenn es um Auslastung geht).'
      }
    ],
    examples: [
      {
        title: 'Grundwert gesucht: Wie viele Plätze insgesamt?',
        given: '150 Plätze sind belegt. Das sind 60 % der Gesamtkapazität.',
        question: 'Wie viele Plätze hat das Bad insgesamt?',
        steps: [
          ['Prozentwert', '150 Plätze'],
          ['Prozentsatz', '60 %'],
          ['Rechnung', '150 × 100 ÷ 60 = 250'],
          ['Ergebnis', 'Das Bad hat 250 Plätze insgesamt']
        ]
      },
      {
        title: 'Prozentsatz gesucht: Wie viel Prozent Auslastung?',
        given: 'Ein Schwimmbad hat 400 Plätze. Heute sind 280 Besucher da.',
        question: 'Wie hoch ist die Auslastung in Prozent?',
        steps: [
          ['Prozentwert', '280 Besucher'],
          ['Grundwert', '400 Plätze'],
          ['Rechnung', '280 × 100 ÷ 400 = 70'],
          ['Ergebnis', 'Die Auslastung beträgt 70 %']
        ]
      },
      {
        title: 'Grundwert gesucht: Originalpreis',
        given: 'Der Rabatt auf eine Dauerkarte beträgt 36 Euro. Das sind 15 % Ermäßigung.',
        question: 'Wie teuer war die Dauerkarte ursprünglich?',
        steps: [
          ['Prozentwert', '36 Euro (Rabatt)'],
          ['Prozentsatz', '15 %'],
          ['Rechnung', '36 × 100 ÷ 15 = 240'],
          ['Ergebnis', 'Die Dauerkarte kostete ursprünglich 240 Euro']
        ]
      }
    ],
    pitfalls: [
      'Grundwert und Prozentwert nicht verwechseln! Der Grundwert ist IMMER das Ganze (100 %).',
      'Häufiger Fehler: × 100 vergessen — dann ist der Prozentsatz 100-mal zu klein.',
      'Beim Grundwert: Wenn dein Ergebnis KLEINER ist als der Prozentwert, hast du falsch gerechnet.',
      'Bei "um ... % reduziert": Erst den Prozentwert ausrechnen, dann vom Grundwert abziehen!'
    ],
    quiz: {
      question: 'Im Freibad wurden 180 Eintrittskarten verkauft. Das entspricht 45 % der Maximalkapazität. Wie viele Besucher passen maximal rein?',
      options: ['350', '400', '450'],
      correctIndex: 1,
      explanation: 'Grundwert = 180 × 100 ÷ 45 = 400. Maximal passen 400 Besucher rein.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Prozentrechnung im Bäderalltag',
    intro:
      'Prozentrechnung brauchst du im Schwimmbad ständig: Besucherstatistiken auswerten, chemische Konzentrationen berechnen, Auslastung melden, Rabatte gewähren. Hier übst du mit echten Aufgaben aus dem Bädalltag. Diese Aufgaben kommen in der Prüfung dran!',
    motto: 'Prozente begegnen dir im Bad jeden Tag.',
    rules: [
      'Besucherstatistik: Anteil einer Gruppe an der Gesamtbesucherzahl — Prozentsatz berechnen.',
      'Chemische Konzentrationen: Wirkstoffanteil in einer Lösung — Prozentwert berechnen.',
      'Auslastung: Aktuelle Besucher im Verhältnis zur Kapazität — Prozentsatz berechnen.',
      'Rabatte: Preisermäßigung in Prozent — Prozentwert berechnen und abziehen.',
      'Immer zuerst klären: Was ist Grundwert, was ist Prozentsatz, was ist Prozentwert?'
    ],
    steps: [
      {
        title: '1. Aufgabe sortieren',
        text: 'Was ist gegeben, was ist gesucht? Ordne die Zahlen den drei Größen zu: Grundwert, Prozentsatz, Prozentwert.'
      },
      {
        title: '2. Richtige Formel wählen',
        text: 'Prozentwert gesucht: G × p ÷ 100. Grundwert gesucht: W × 100 ÷ p. Prozentsatz gesucht: W × 100 ÷ G.'
      },
      {
        title: '3. Berechnung durchführen',
        text: 'Setze die Zahlen in die Formel ein. Rechne Schritt für Schritt und schreib Zwischenergebnisse auf.'
      },
      {
        title: '4. Ergebnis im Kontext prüfen',
        text: 'Macht das Ergebnis im Bädalltag Sinn? Eine Auslastung von 250 % wäre unlogisch. Ein Chlorgehalt von 50 % wäre viel zu hoch.'
      }
    ],
    examples: [
      {
        title: 'Besucherstatistik (Prozentsatz gesucht)',
        given: 'Am Sonntag kamen 600 Besucher. 180 davon waren Frühschwimmer.',
        question: 'Wie viel Prozent der Besucher waren Frühschwimmer?',
        steps: [
          ['Prozentwert', '180 Frühschwimmer'],
          ['Grundwert', '600 Besucher gesamt'],
          ['Rechnung', '180 × 100 ÷ 600 = 30'],
          ['Ergebnis', '30 % der Besucher waren Frühschwimmer']
        ]
      },
      {
        title: 'Chemische Konzentration (Prozentwert gesucht)',
        given: 'Ein Kanister enthält 25 Liter Natriumhypochlorit-Lösung mit 13 % Aktivchlor.',
        question: 'Wie viel Liter reines Aktivchlor sind enthalten?',
        steps: [
          ['Grundwert', '25 Liter Lösung'],
          ['Prozentsatz', '13 %'],
          ['Rechnung', '25 × 13 ÷ 100 = 3,25'],
          ['Ergebnis', '3,25 Liter reines Aktivchlor']
        ]
      },
      {
        title: 'Kapazitätsauslastung (Grundwert gesucht)',
        given: 'Aktuell sind 330 Badegäste im Freibad. Die Auslastung beträgt 75 %.',
        question: 'Wie hoch ist die Maximalkapazität?',
        steps: [
          ['Prozentwert', '330 Gäste'],
          ['Prozentsatz', '75 %'],
          ['Rechnung', '330 × 100 ÷ 75 = 440'],
          ['Ergebnis', 'Die Maximalkapazität beträgt 440 Gäste']
        ]
      },
      {
        title: 'Rabattaktion (Prozentwert + Abzug)',
        given: 'Die Tageskarte für Erwachsene kostet 8 Euro. Für Gruppen ab 10 Personen gibt es 20 % Rabatt.',
        question: 'Wie viel zahlt jede Person in der Gruppe?',
        steps: [
          ['Grundwert', '8 Euro (normaler Preis)'],
          ['Rabatt berechnen', '8 × 20 ÷ 100 = 1,60 Euro'],
          ['Neuer Preis', '8 − 1,60 = 6,40 Euro'],
          ['Ergebnis', 'Jede Person zahlt 6,40 Euro']
        ]
      }
    ],
    pitfalls: [
      'Bei Rabatten: Den Prozentwert vom Grundwert ABZIEHEN, nicht einfach als Ergebnis nehmen!',
      'Bei Konzentrationen: Aufpassen, ob nach dem reinen Wirkstoff oder der gesamten Lösung gefragt wird.',
      'In der Prüfung: Lies GENAU ob nach dem Prozentsatz, dem Prozentwert oder dem Grundwert gefragt wird.',
      'Typischer Fehler: "Wie viel Prozent mehr?" ist NICHT das Gleiche wie "Wie viel Prozent von?"'
    ],
    quiz: {
      question: 'Ein Freibad hatte im Juni 12.000 Besucher und im Juli 15.000 Besucher. Um wie viel Prozent ist die Besucherzahl gestiegen?',
      options: ['20 %', '25 %', '30 %'],
      correctIndex: 1,
      explanation: 'Anstieg: 15.000 − 12.000 = 3.000. Prozentsatz: 3.000 × 100 ÷ 12.000 = 25 %.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'prozentwert', 'grundwert', 'praxis'];

/* ─── Formula overview for Grundlagen and Praxis tabs ──────────────────────── */

const FORMULA_OVERVIEW = [
  ['Gesucht', 'Formel', 'Beispiel'],
  ['Prozentwert', 'G × p ÷ 100', '200 × 25 ÷ 100 = 50'],
  ['Grundwert', 'W × 100 ÷ p', '50 × 100 ÷ 25 = 200'],
  ['Prozentsatz', 'W × 100 ÷ G', '50 × 100 ÷ 200 = 25']
];

/* ─── Comparison table for Prozentwert vs Grundwert vs Prozentsatz ─────────── */

const COMPARISON = [
  ['Was ist es?', 'Das Ergebnis in Stück/Euro/Liter', 'Das Ganze (100 %)', 'Der Anteil in %'],
  ['Formel', 'G × p ÷ 100', 'W × 100 ÷ p', 'W × 100 ÷ G'],
  ['Erkennungsmerkmal', '"Wie viel ist ...?"', '"Wie viel war es insgesamt?"', '"Wie viel Prozent?"'],
  ['Bäder-Beispiel', '25 % von 800 m³ = 200 m³', '200 m³ sind 25 % → 800 m³ gesamt', '200 von 800 m³ = 25 %']
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

export default function ProzentDeepDiveView() {
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

          {/* Comparison table (on prozentwert or grundwert tabs) */}
          {(activeTab === 'prozentwert' || activeTab === 'grundwert') && (
            <InfoCard darkMode={darkMode} title="Vergleich: Prozentwert vs. Grundwert vs. Prozentsatz">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`} />
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Prozentwert
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-emerald-900/20 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                        Grundwert
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                        Prozentsatz
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map(([label, pw, gw, ps]) => (
                      <tr key={label} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {label}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {pw}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {gw}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {ps}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Formula overview (on grundlagen and praxis tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Alle drei Formeln auf einen Blick">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Prozentwert gesucht
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Prozentwert = Grundwert × Prozentsatz ÷ 100
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Wie viel sind 25 % von 800? → 200
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    Grundwert gesucht
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Grundwert = Prozentwert × 100 ÷ Prozentsatz
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    200 sind 25 % — wie viel ist 100 %? → 800
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Prozentsatz gesucht
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Prozentsatz = Prozentwert × 100 ÷ Grundwert
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    200 von 800 — wie viel Prozent? → 25 %
                  </p>
                </div>
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
