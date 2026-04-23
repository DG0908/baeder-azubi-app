import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was macht der Filter im Schwimmbad?',
    intro:
      'Der Filter ist das Herzstück der Wasseraufbereitung. Er reinigt das Beckenwasser, indem er Schmutzpartikel zurückhaelt. Damit der Filter gut arbeitet, muss das Wasser mit der richtigen Geschwindigkeit durchfliessen. Zu schnell = schlechte Reinigung. Zu langsam = Verschwendung. Die wichtigste Formel: Filtergeschwindigkeit = Durchfluss geteilt durch Filterfläche.',
    motto: 'Ohne Filter kein sauberes Wasser.',
    rules: [
      'Der Filter reinigt das Beckenwasser von Schmutzpartikeln, Truebstoffen und Keimen.',
      'Die Filtergeschwindigkeit (vF) sagt dir, wie schnell das Wasser durch den Filter fliesst.',
      'Die Formel lautet: vF = Q ÷ A (Durchfluss geteilt durch Filterfläche).',
      'Die Filtergeschwindigkeit wird in Metern pro Stunde (m/h) angegeben.',
      'Ist die Filtergeschwindigkeit zu hoch, wird das Wasser nicht richtig sauber — der Schmutz rutscht durch.'
    ],
    steps: [
      {
        title: '1. Durchfluss bestimmen',
        text: 'Der Durchfluss (Q) ist die Wassermenge, die pro Stunde durch den Filter fliesst. Einheit: m³/h. Steht meistens am Durchflussmesser oder wird aus der Pumpenleistung abgelesen.'
      },
      {
        title: '2. Filterfläche bestimmen',
        text: 'Die Filterfläche (A) ist die Querschnittsfläche des Filters von oben gesehen. Einheit: m². Bei runden Filtern: A = π × r² (pi mal Radius zum Quadrat).'
      },
      {
        title: '3. Formel anwenden',
        text: 'Filtergeschwindigkeit berechnen: vF = Q ÷ A. Beispiel: 60 m³/h ÷ 2 m² = 30 m/h. So schnell fliesst das Wasser durch den Filter.'
      },
      {
        title: '4. Ergebnis bewerten',
        text: 'Liegt die Filtergeschwindigkeit zwischen 20 und 30 m/h? Dann ist alles im gruenen Bereich. Über 30 m/h ist zu schnell, unter 20 m/h ist unnötig langsam.'
      }
    ],
    examples: [
      {
        title: 'Einfaches Beispiel: Filtergeschwindigkeit prüfen',
        given: 'Ein Filter hat eine Fläche von 3 m². Der Durchfluss beträgt 75 m³/h.',
        question: 'Wie hoch ist die Filtergeschwindigkeit?',
        steps: [
          ['Formel', 'vF = Q ÷ A'],
          ['Einsetzen', 'vF = 75 m³/h ÷ 3 m²'],
          ['Ergebnis', 'vF = 25 m/h'],
          ['Bewertung', '25 m/h liegt im erlaubten Bereich (20–30 m/h) — passt!']
        ]
      },
      {
        title: 'Bäder-Beispiel: Ist der Filter zu schnell?',
        given: 'Ein Hallenbadfilter hat 1,5 m² Filterfläche. Die Pumpe fördert 60 m³/h.',
        question: 'Ist die Filtergeschwindigkeit in Ordnung?',
        steps: [
          ['Formel', 'vF = Q ÷ A'],
          ['Einsetzen', 'vF = 60 m³/h ÷ 1,5 m²'],
          ['Ergebnis', 'vF = 40 m/h'],
          ['Bewertung', '40 m/h ist zu schnell! Maximum ist 30 m/h. Der Filter reinigt nicht gut genug.']
        ]
      }
    ],
    pitfalls: [
      'Filterfläche ist NICHT die Aussenfläche des Kessels, sondern die Querschnittsfläche von oben!',
      'Durchfluss (m³/h) und Filtergeschwindigkeit (m/h) sind NICHT dasselbe — nicht verwechseln!',
      'Einheiten müssen stimmen: Q in m³/h und A in m², dann kommt vF in m/h raus.',
      'Eine hohe Filtergeschwindigkeit klingt gut, ist aber schlecht — das Wasser wird nicht sauber.'
    ],
    quiz: {
      question: 'Ein Filter hat 2 m² Fläche und einen Durchfluss von 50 m³/h. Wie hoch ist die Filtergeschwindigkeit?',
      options: ['20 m/h', '25 m/h', '100 m/h'],
      correctIndex: 1,
      explanation: 'vF = Q ÷ A = 50 ÷ 2 = 25 m/h.'
    }
  },

  filtergeschwindigkeit: {
    id: 'filtergeschwindigkeit',
    chip: 'Geschwindigkeit',
    title: 'Filtergeschwindigkeit berechnen — vF = Q ÷ A',
    intro:
      'Die Filtergeschwindigkeit zeigt, wie schnell das Wasser durch die Filterschicht fliesst. Sie wird in Metern pro Stunde (m/h) gemessen. In der Praxis sollte sie zwischen 20 und 30 m/h liegen. Ist sie höher, wird das Wasser nicht richtig gereinigt. Ist sie niedriger, ist die Anlage ueberdimensioniert.',
    motto: 'vF = Q ÷ A — das musst du im Schlaf können.',
    rules: [
      'Die Formel ist: vF = Q ÷ A (Filtergeschwindigkeit = Durchfluss geteilt durch Filterfläche).',
      'Q = Durchfluss in m³/h (Kubikmeter pro Stunde).',
      'A = Filterfläche in m² (Quadratmeter).',
      'Erlaubter Bereich: meistens 20 bis 30 m/h (je nach Filtertyp und Vorschrift).',
      'Wenn vF zu hoch ist, muss entweder der Durchfluss gesenkt oder ein größerer Filter eingebaut werden.'
    ],
    steps: [
      {
        title: '1. Durchfluss (Q) ablesen',
        text: 'Lies den Durchfluss von der Pumpe oder dem Durchflussmesser ab. Achte auf die Einheit — es muss m³/h sein! Falls die Angabe in Litern ist: 1.000 Liter = 1 m³.'
      },
      {
        title: '2. Filterfläche (A) bestimmen',
        text: 'Miss den Durchmesser des Filters. Dann rechne: Radius = Durchmesser ÷ 2. Danach: A = π × r² (also 3,14 × Radius × Radius).'
      },
      {
        title: '3. Dividieren: Q ÷ A',
        text: 'Teile den Durchfluss durch die Filterfläche. Das Ergebnis ist die Filtergeschwindigkeit in m/h.'
      },
      {
        title: '4. Bewerten',
        text: 'Liegt das Ergebnis zwischen 20 und 30 m/h? Gut! Darüber? Maßnahmen nötig. Darunter? Filter ist grosszuegig dimensioniert.'
      }
    ],
    examples: [
      {
        title: 'Standardberechnung',
        given: 'Durchfluss Q = 80 m³/h. Filterfläche A = 3,2 m².',
        question: 'Wie hoch ist die Filtergeschwindigkeit?',
        steps: [
          ['Formel', 'vF = Q ÷ A'],
          ['Einsetzen', 'vF = 80 ÷ 3,2'],
          ['Ergebnis', 'vF = 25 m/h'],
          ['Bewertung', '25 m/h — perfekt im Bereich 20–30 m/h']
        ]
      },
      {
        title: 'Durchmesser gegeben',
        given: 'Ein runder Filter hat einen Durchmesser von 2 m. Der Durchfluss ist 90 m³/h.',
        question: 'Wie hoch ist die Filtergeschwindigkeit?',
        steps: [
          ['Radius', 'r = 2 m ÷ 2 = 1 m'],
          ['Filterfläche', 'A = π × 1² = 3,14 m²'],
          ['Filtergeschwindigkeit', 'vF = 90 ÷ 3,14 = 28,7 m/h'],
          ['Bewertung', '28,7 m/h — noch im erlaubten Bereich, aber knapp']
        ]
      },
      {
        title: 'Zu schnell — was nun?',
        given: 'Filter mit A = 1,8 m². Pumpe fördert 72 m³/h.',
        question: 'Ist die Filtergeschwindigkeit in Ordnung?',
        steps: [
          ['Formel', 'vF = Q ÷ A'],
          ['Einsetzen', 'vF = 72 ÷ 1,8'],
          ['Ergebnis', 'vF = 40 m/h'],
          ['Bewertung', '40 m/h ist viel zu hoch! Der Durchfluss muss reduziert oder ein größerer Filter eingesetzt werden.']
        ]
      }
    ],
    pitfalls: [
      'Durchmesser und Radius verwechseln! Radius ist die HAELFTE vom Durchmesser.',
      'Vergiss nicht: r² heisst r × r, nicht r × 2!',
      'Wenn die Pumpenleistung in Litern angegeben ist, erst in m³ umrechnen (÷ 1.000).'
    ],
    quiz: {
      question: 'Ein runder Filter hat 1,6 m Durchmesser. Q = 50 m³/h. Wie hoch ist vF? (π ≈ 3,14)',
      options: ['20,5 m/h', '24,9 m/h', '31,3 m/h'],
      correctIndex: 1,
      explanation: 'r = 0,8 m. A = 3,14 × 0,8² = 3,14 × 0,64 = 2,01 m². vF = 50 ÷ 2,01 = 24,9 m/h.'
    }
  },

  filterfläche: {
    id: 'filterflaeche',
    chip: 'Filterfläche',
    title: 'Filterfläche berechnen — A = Q ÷ vF',
    intro:
      'Wenn du weisst, wie viel Wasser pro Stunde durch den Filter muss und welche Filtergeschwindigkeit erlaubt ist, kannst du die benötigte Filterfläche berechnen. Die Formel ist einfach umgestellt: A = Q ÷ vF. Bei runden Filtern rechnest du dann mit A = π × r² zurück auf den Durchmesser.',
    motto: 'Erst die Fläche, dann den Filter auswählen.',
    rules: [
      'Umgestellte Formel: A = Q ÷ vF (Filterfläche = Durchfluss geteilt durch Filtergeschwindigkeit).',
      'Du brauchst den Durchfluss (Q in m³/h) und die gewuenschte Filtergeschwindigkeit (vF in m/h).',
      'Die meisten Schwimmbadfilter sind rund — da gilt: A = π × r².',
      'Wenn du die Fläche hast, rechnest du rueckwaerts: r = √(A ÷ π) und Durchmesser = 2 × r.',
      'Waehle im Zweifelsfall den naechstgrößeren Standardfilter — lieber etwas zu gross als zu klein.'
    ],
    steps: [
      {
        title: '1. Durchfluss (Q) bestimmen',
        text: 'Wie viel Wasser muss pro Stunde gefiltert werden? Das haengt von der Umwaelzzeit und dem Beckenvolumen ab. Q = Beckenvolumen ÷ Umwaelzzeit.'
      },
      {
        title: '2. Filtergeschwindigkeit (vF) festlegen',
        text: 'Normalerweise 30 m/h als Maximalwert. Für bessere Filterung 20–25 m/h. Steht oft in der Aufgabe oder in der DIN-Norm.'
      },
      {
        title: '3. Fläche berechnen: A = Q ÷ vF',
        text: 'Teile den Durchfluss durch die Filtergeschwindigkeit. Das Ergebnis ist die mindestens nötige Filterfläche in m².'
      },
      {
        title: '4. Filterdurchmesser bestimmen',
        text: 'Bei runden Filtern: r = √(A ÷ π). Dann Durchmesser = 2 × r. Waehle den nächsten verfuegbaren Standarddurchmesser.'
      }
    ],
    examples: [
      {
        title: 'Benötigte Filterfläche',
        given: 'Durchfluss Q = 120 m³/h. Erlaubte Filtergeschwindigkeit vF = 30 m/h.',
        question: 'Wie gross muss die Filterfläche sein?',
        steps: [
          ['Formel', 'A = Q ÷ vF'],
          ['Einsetzen', 'A = 120 ÷ 30'],
          ['Ergebnis', 'A = 4 m²'],
          ['Bewertung', 'Der Filter braucht mindestens 4 m² Filterfläche.']
        ]
      },
      {
        title: 'Filterdurchmesser bestimmen',
        given: 'Benötigte Filterfläche A = 2 m². Der Filter ist rund.',
        question: 'Welchen Durchmesser braucht der Filter?',
        steps: [
          ['Formel umstellen', 'r = √(A ÷ π)'],
          ['Einsetzen', 'r = √(2 ÷ 3,14) = √(0,637)'],
          ['Radius', 'r = 0,80 m'],
          ['Durchmesser', 'd = 2 × 0,80 = 1,60 m']
        ]
      },
      {
        title: 'Beckenvolumen → Filtergröße',
        given: 'Becken mit 600 m³ Wasser, Umwaelzzeit 4 Stunden, vF max. 30 m/h.',
        question: 'Welche Filterfläche wird benötigt?',
        steps: [
          ['Durchfluss', 'Q = 600 m³ ÷ 4 h = 150 m³/h'],
          ['Filterfläche', 'A = 150 ÷ 30 = 5 m²'],
          ['Radius', 'r = √(5 ÷ 3,14) = √(1,59) = 1,26 m'],
          ['Durchmesser', 'd = 2 × 1,26 = 2,52 m — oder 2 kleinere Filter verwenden']
        ]
      }
    ],
    pitfalls: [
      'Vergiss nicht, zuerst den Durchfluss (Q) zu berechnen, wenn nur Beckenvolumen und Umwaelzzeit gegeben sind!',
      'Beim Wurzelziehen den Taschenrechner benutzen — Kopfrechnen geht da meistens schief.',
      'Standardfiltergrößen beachten: Es gibt nicht jeden Durchmesser zu kaufen.',
      'Immer aufrunden! Ein zu kleiner Filter ist ein echtes Problem, ein etwas größerer nicht.'
    ],
    quiz: {
      question: 'Q = 90 m³/h, vF soll maximal 30 m/h sein. Wie gross muss die Filterfläche mindestens sein?',
      options: ['2 m²', '3 m²', '4 m²'],
      correctIndex: 1,
      explanation: 'A = Q ÷ vF = 90 ÷ 30 = 3 m².'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Filtration im Bäderalltag',
    intro:
      'Hier uebst du mit echten Aufgaben aus dem Schwimmbadbetrieb. Filteranlage dimensionieren, vorhandene Filter prüfen, mehrere Filter berechnen und Spuelwassermengen abschaetzen — das kommt in der Prüfung dran und brauchst du im Alltag.',
    motto: 'Wer den Filter versteht, versteht die Wasseraufbereitung.',
    rules: [
      'Umwaelzzeit im Hallenbad: meistens 4–6 Stunden (je nach Beckenart laut DIN 19643).',
      'Freibad-Schwimmerbecken: Umwaelzzeit bis 8 Stunden, Nichtschwimmerbecken kuerzer.',
      'Bei mehreren Filtern: Gesamtfläche = Fläche pro Filter × Anzahl Filter.',
      'Spülung (Rückspülung): Filtergeschwindigkeit dabei ca. 40–60 m/h — absichtlich höher, um den Schmutz rauszuwaschen.',
      'Nach der Spülung laeuft der Filter kurz im Vorlauf — das Wasser geht nicht ins Becken, bis es sauber ist.'
    ],
    steps: [
      {
        title: '1. Beckenvolumen und Umwaelzzeit klären',
        text: 'Lies aus der Aufgabe: Wie gross ist das Becken (m³)? Welche Umwaelzzeit ist vorgeschrieben (h)? Daraus ergibt sich der Durchfluss: Q = V ÷ t.'
      },
      {
        title: '2. Filtergeschwindigkeit beachten',
        text: 'Ist eine maximale Filtergeschwindigkeit vorgegeben? Meistens 30 m/h. Damit berechnest du die Mindest-Filterfläche: A = Q ÷ vF.'
      },
      {
        title: '3. Filter auswählen oder prüfen',
        text: 'Neuer Filter: Waehle den naechstgrößeren Standarddurchmesser. Vorhandener Filter: Berechne vF und pruefe, ob sie im erlaubten Bereich liegt.'
      },
      {
        title: '4. Sonderfaelle beachten',
        text: 'Mehrere Filter? Flächen addieren. Spülung? Spueldurchfluss und Spuelwassermenge berechnen. Ein Filter faellt aus? Restkapazität prüfen.'
      }
    ],
    examples: [
      {
        title: 'Filterdimensionierung für ein Sportbecken',
        given: 'Sportbecken 25 × 12,5 × 2 m = 625 m³. Umwaelzzeit 4,5 Stunden. vF max. 30 m/h.',
        question: 'Welche Filterfläche wird benötigt?',
        steps: [
          ['Durchfluss', 'Q = 625 ÷ 4,5 = 138,9 m³/h'],
          ['Filterfläche', 'A = 138,9 ÷ 30 = 4,63 m²'],
          ['Aufrunden', 'Mindestens 4,63 m² — z.B. 3 Filter mit je 1,4 m Durchmesser (je 1,54 m² = 4,62 m²) reicht knapp, besser 3 × 1,5 m Durchmesser'],
          ['Prüfung', '3 Filter à 1,5 m: A = 3 × π × 0,75² = 3 × 1,77 = 5,30 m². vF = 138,9 ÷ 5,30 = 26,2 m/h — passt!']
        ]
      },
      {
        title: 'Vorhandenen Filter prüfen',
        given: '2 Rundfilter mit je 1,8 m Durchmesser. Pumpe fördert 140 m³/h.',
        question: 'Ist die Filtergeschwindigkeit in Ordnung?',
        steps: [
          ['Einzelfläche', 'A = π × 0,9² = 3,14 × 0,81 = 2,54 m²'],
          ['Gesamtfläche', '2 × 2,54 = 5,09 m²'],
          ['Filtergeschwindigkeit', 'vF = 140 ÷ 5,09 = 27,5 m/h'],
          ['Bewertung', '27,5 m/h — im erlaubten Bereich, alles in Ordnung']
        ]
      },
      {
        title: 'Ein Filter faellt aus',
        given: 'Normalerweise laufen 3 Filter mit je 2 m² Fläche bei Q = 150 m³/h. Ein Filter muss zur Wartung.',
        question: 'Wie hoch ist die Filtergeschwindigkeit mit nur 2 Filtern?',
        steps: [
          ['Restfläche', '2 × 2 m² = 4 m²'],
          ['Neue vF', 'vF = 150 ÷ 4 = 37,5 m/h'],
          ['Bewertung', '37,5 m/h — zu hoch! Durchfluss muss reduziert werden.'],
          ['Lösung', 'Q reduzieren auf max. 4 × 30 = 120 m³/h, oder Wartung schnell erledigen']
        ]
      },
      {
        title: 'Spuelwassermenge berechnen',
        given: 'Filter mit 2,5 m² Fläche. Spuelgeschwindigkeit 50 m/h. Spueldauer 5 Minuten.',
        question: 'Wie viel Spuelwasser wird verbraucht?',
        steps: [
          ['Spueldurchfluss', 'Q_spuel = vF_spuel × A = 50 × 2,5 = 125 m³/h'],
          ['Umrechnen', '5 Minuten = 5/60 Stunden = 0,0833 h'],
          ['Spuelwassermenge', '125 × 0,0833 = 10,4 m³'],
          ['Ergebnis', 'Pro Spülung werden ca. 10,4 m³ Wasser verbraucht']
        ]
      }
    ],
    pitfalls: [
      'Umwaelzzeit nicht mit Filtergeschwindigkeit verwechseln — das sind voellig verschiedene Dinge!',
      'Bei mehreren Filtern: Die Flächen ADDIEREN, nicht den Durchmesser!',
      'Spuelwasser geht in den Kanal — das muss mit Frischwasser ersetzt werden. Kosten beachten!',
      'Wenn ein Filter ausfaellt, steigt die Geschwindigkeit in den anderen Filtern — immer nachrechnen!'
    ],
    quiz: {
      question: '2 Rundfilter mit je 1,2 m Durchmesser. Q = 50 m³/h. Wie hoch ist vF? (π ≈ 3,14)',
      options: ['18,4 m/h', '22,1 m/h', '26,5 m/h'],
      correctIndex: 1,
      explanation: 'r = 0,6 m. A pro Filter = 3,14 × 0,36 = 1,13 m². Gesamt = 2,26 m². vF = 50 ÷ 2,26 = 22,1 m/h.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'filtergeschwindigkeit', 'filterfläche', 'praxis'];

/* ─── Formula overview table ────────────────────────────────────────────────── */

const FORMULAS = [
  ['Filtergeschwindigkeit', 'vF = Q ÷ A', 'm/h'],
  ['Filterfläche', 'A = Q ÷ vF', 'm²'],
  ['Durchfluss', 'Q = vF × A', 'm³/h'],
  ['Kreisfläche', 'A = π × r²', 'm²'],
  ['Radius aus Durchmesser', 'r = d ÷ 2', 'm'],
  ['Durchfluss aus Becken', 'Q = V ÷ t', 'm³/h']
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

export default function FiltrationDeepDiveView() {
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

          {/* Formula overview (on grundlagen and filtergeschwindigkeit tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'filtergeschwindigkeit') && (
            <InfoCard darkMode={darkMode} title="Alle Formeln auf einen Blick">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Gesucht
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Formel
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Einheit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FORMULAS.map(([label, formula, unit]) => (
                      <tr key={label} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {label}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {formula}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Quick filter check (on filterfläche and praxis tabs) */}
          {(activeTab === 'filterfläche' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Schnell-Check: Filter richtig dimensioniert?">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    vF unter 20 m/h
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Filter ist grosszuegig dimensioniert. Kein Problem, aber eventuell unnötig teuer.
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    vF zwischen 20–30 m/h
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Optimaler Bereich! Gute Filterleistung bei wirtschaftlichem Betrieb.
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    vF über 30 m/h
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Zu schnell! Schlechte Filterwirkung. Durchfluss reduzieren oder größeren Filter einbauen.
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
