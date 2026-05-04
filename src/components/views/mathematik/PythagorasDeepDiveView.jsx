import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was ist der Satz des Pythagoras?',
    intro:
      'Der Satz des Pythagoras beschreibt den Zusammenhang der drei Seiten in einem rechtwinkligen Dreieck. Die Formel lautet: a² + b² = c². Damit kannst du jede Seite berechnen, wenn du die anderen beiden kennst. Im Schwimmbad brauchst du das z.B. für Diagonalen, Rampen oder Rohrleitungen.',
    motto: 'a² + b² = c² — gilt NUR im rechtwinkligen Dreieck.',
    rules: [
      'Der Satz des Pythagoras gilt AUSSCHLIESSLICH für rechtwinklige Dreiecke (ein Winkel = 90°).',
      'Die zwei kurzen Seiten heißen Katheten (a und b) — sie bilden den rechten Winkel.',
      'Die lange Seite gegenüber dem rechten Winkel heißt Hypotenuse (c) — sie ist IMMER die längste Seite.',
      'Die Formel lautet: a² + b² = c². Das heißt: Kathete zum Quadrat plus Kathete zum Quadrat = Hypotenuse zum Quadrat.',
      'Wenn du zwei Seiten kennst, kannst du die dritte IMMER berechnen.'
    ],
    steps: [
      {
        title: '1. Rechten Winkel finden',
        text: 'Schau dir das Dreieck an: Wo ist der 90°-Winkel? Die Seite GEGENUEBER davon ist die Hypotenuse c. Die anderen beiden Seiten sind die Katheten a und b.'
      },
      {
        title: '2. Seiten benennen',
        text: 'Beschrifte die Seiten: a und b sind die Katheten (am rechten Winkel), c ist die Hypotenuse (die längste Seite, gegenüber dem rechten Winkel).'
      },
      {
        title: '3. Formel aufschreiben',
        text: 'Schreib hin: a² + b² = c². Diese Formel ist dein Werkzeug. Je nachdem, welche Seite gesucht ist, stellst du sie um.'
      },
      {
        title: '4. Werte einsetzen und rechnen',
        text: 'Setze die bekannten Werte ein, rechne die Quadrate aus, und zieh am Ende die Wurzel. Fertig!'
      }
    ],
    examples: [
      {
        title: 'Einfaches Beispiel: a = 3, b = 4',
        given: 'Ein rechtwinkliges Dreieck hat die Katheten a = 3 cm und b = 4 cm.',
        question: 'Wie lang ist die Hypotenuse c?',
        steps: [
          ['Formel', 'a² + b² = c²'],
          ['Einsetzen', '3² + 4² = c²'],
          ['Quadrieren', '9 + 16 = c²'],
          ['Addieren', '25 = c²'],
          ['Wurzel ziehen', 'c = √25 = 5 cm']
        ]
      },
      {
        title: 'Weiteres Beispiel: a = 6, b = 8',
        given: 'Ein rechtwinkliges Dreieck hat die Katheten a = 6 m und b = 8 m.',
        question: 'Wie lang ist die Hypotenuse c?',
        steps: [
          ['Formel', 'a² + b² = c²'],
          ['Einsetzen', '6² + 8² = c²'],
          ['Quadrieren', '36 + 64 = c²'],
          ['Addieren', '100 = c²'],
          ['Wurzel ziehen', 'c = √100 = 10 m']
        ]
      }
    ],
    pitfalls: [
      'Der Satz gilt NUR bei rechtwinkligen Dreiecken — bei anderen Dreiecken funktioniert er NICHT!',
      'Die Hypotenuse c ist IMMER die längste Seite. Wenn dein Ergebnis kürzer als eine Kathete ist, hast du falsch gerechnet.',
      'Nicht vergessen: Am Ende die Wurzel ziehen! c² = 25 heißt c = 5, nicht c = 25.',
      'a und b darf man vertauschen — aber c ist IMMER die Hypotenuse!'
    ],
    quiz: {
      question: 'Ein rechtwinkliges Dreieck hat die Katheten a = 5 cm und b = 12 cm. Wie lang ist c?',
      options: ['13 cm', '17 cm', '15 cm'],
      correctIndex: 0,
      explanation: '5² + 12² = 25 + 144 = 169. √169 = 13 cm.'
    }
  },

  berechnung: {
    id: 'berechnung',
    chip: 'Berechnung',
    title: 'Die Hypotenuse c berechnen',
    intro:
      'Am häufigsten musst du die längste Seite berechnen — die Hypotenuse c. Dafür setzt du die beiden Katheten in die Formel ein, quadrierst sie, addierst sie und ziehst die Wurzel. Drei einfache Schritte!',
    motto: 'Quadrieren, addieren, Wurzel ziehen.',
    rules: [
      'Die Formel für c lautet: c = √(a² + b²).',
      'Zuerst jede Kathete einzeln quadrieren (mit sich selbst malnehmen).',
      'Dann die beiden Quadrate addieren (zusammenzählen).',
      'Zum Schluss aus der Summe die Quadratwurzel ziehen (√-Taste auf dem Taschenrechner).',
      'Das Ergebnis c ist IMMER größer als jede einzelne Kathete — sonst hast du falsch gerechnet.'
    ],
    steps: [
      {
        title: '1. Katheten quadrieren',
        text: 'Nimm jede Kathete und rechne sie "zum Quadrat". Das heißt: die Zahl mal sich selbst. Beispiel: 3² = 3 × 3 = 9.'
      },
      {
        title: '2. Quadrate addieren',
        text: 'Zähle die beiden Ergebnisse zusammen. Beispiel: 9 + 16 = 25. Das ist c².'
      },
      {
        title: '3. Wurzel ziehen',
        text: 'Drück auf dem Taschenrechner die √-Taste und gib die Summe ein. √25 = 5. Das ist c.'
      },
      {
        title: '4. Ergebnis prüfen',
        text: 'Ist c größer als a und größer als b? Dann passt es. Vergiss die Einheit nicht (cm, m, ...)!'
      }
    ],
    examples: [
      {
        title: 'Beispiel mit glatten Zahlen',
        given: 'Kathete a = 8 m, Kathete b = 15 m.',
        question: 'Wie lang ist die Hypotenuse c?',
        steps: [
          ['a quadrieren', '8² = 64'],
          ['b quadrieren', '15² = 225'],
          ['Addieren', '64 + 225 = 289'],
          ['Wurzel ziehen', 'c = √289 = 17 m']
        ]
      },
      {
        title: 'Beispiel mit Kommazahl',
        given: 'Kathete a = 2 m, Kathete b = 3 m.',
        question: 'Wie lang ist die Hypotenuse c?',
        steps: [
          ['a quadrieren', '2² = 4'],
          ['b quadrieren', '3² = 9'],
          ['Addieren', '4 + 9 = 13'],
          ['Wurzel ziehen', 'c = √13 ≈ 3,61 m']
        ]
      },
      {
        title: 'Klassiker: 5-12-13',
        given: 'Kathete a = 5 cm, Kathete b = 12 cm.',
        question: 'Wie lang ist die Hypotenuse c?',
        steps: [
          ['a quadrieren', '5² = 25'],
          ['b quadrieren', '12² = 144'],
          ['Addieren', '25 + 144 = 169'],
          ['Wurzel ziehen', 'c = √169 = 13 cm']
        ]
      }
    ],
    pitfalls: [
      'Quadrieren heißt "mal sich selbst" — NICHT "mal 2"! Also 3² = 9, nicht 6.',
      'Erst quadrieren, DANN addieren — nicht umgekehrt! (3+4)² ist was anderes als 3²+4².',
      'Wenn die Wurzel keine glatte Zahl ergibt, auf 2 Nachkommastellen runden.',
      'Die Einheit (cm, m) NICHT mit quadrieren — nur die Zahlen!'
    ],
    quiz: {
      question: 'Kathete a = 9 m, Kathete b = 12 m. Wie lang ist c?',
      options: ['15 m', '21 m', '225 m'],
      correctIndex: 0,
      explanation: '9² + 12² = 81 + 144 = 225. √225 = 15 m.'
    }
  },

  umstellen: {
    id: 'umstellen',
    chip: 'Umstellen',
    title: 'Kathete a oder b berechnen — Formel umstellen',
    intro:
      'Manchmal kennst du die Hypotenuse und eine Kathete und suchst die andere Kathete. Dann musst du die Formel umstellen. Statt zu addieren, musst du subtrahieren (abziehen). Die umgestellte Formel lautet: a² = c² - b² oder b² = c² - a².',
    motto: 'Kathete gesucht? Abziehen statt addieren!',
    rules: [
      'Wenn du eine Kathete suchst, stellst du die Formel um: a² = c² - b².',
      'Du kannst auch b suchen: b² = c² - a². Es ist immer das Gleiche — nur die Buchstaben ändern sich.',
      'ACHTUNG: Jetzt wird SUBTRAHIERT (minus), nicht addiert (plus)!',
      'c² muss IMMER größer sein als a² oder b² — sonst ist irgendwo ein Fehler.',
      'Am Ende wieder die Wurzel ziehen, um von a² auf a zu kommen.'
    ],
    steps: [
      {
        title: '1. Formel umstellen',
        text: 'Aus a² + b² = c² wird a² = c² - b² (wenn du a suchst) oder b² = c² - a² (wenn du b suchst). Das b bzw. a wandert auf die andere Seite und aus + wird -.'
      },
      {
        title: '2. Bekannte Werte quadrieren',
        text: 'Quadriere c und die bekannte Kathete. Beispiel: c = 13, b = 5 → c² = 169, b² = 25.'
      },
      {
        title: '3. Subtrahieren',
        text: 'Zieh das kleinere Quadrat vom größeren ab: 169 - 25 = 144. Das ist a².'
      },
      {
        title: '4. Wurzel ziehen',
        text: 'Zieh die Wurzel: a = √144 = 12. Vergiss die Einheit nicht!'
      }
    ],
    examples: [
      {
        title: 'Kathete a gesucht',
        given: 'Hypotenuse c = 10 m, Kathete b = 6 m.',
        question: 'Wie lang ist Kathete a?',
        steps: [
          ['Formel umstellen', 'a² = c² - b²'],
          ['Quadrieren', 'c² = 100, b² = 36'],
          ['Subtrahieren', 'a² = 100 - 36 = 64'],
          ['Wurzel ziehen', 'a = √64 = 8 m']
        ]
      },
      {
        title: 'Kathete b gesucht',
        given: 'Hypotenuse c = 17 cm, Kathete a = 8 cm.',
        question: 'Wie lang ist Kathete b?',
        steps: [
          ['Formel umstellen', 'b² = c² - a²'],
          ['Quadrieren', 'c² = 289, a² = 64'],
          ['Subtrahieren', 'b² = 289 - 64 = 225'],
          ['Wurzel ziehen', 'b = √225 = 15 cm']
        ]
      },
      {
        title: 'Beispiel mit Kommazahl',
        given: 'Hypotenuse c = 5 m, Kathete a = 3 m.',
        question: 'Wie lang ist Kathete b?',
        steps: [
          ['Formel umstellen', 'b² = c² - a²'],
          ['Quadrieren', 'c² = 25, a² = 9'],
          ['Subtrahieren', 'b² = 25 - 9 = 16'],
          ['Wurzel ziehen', 'b = √16 = 4 m']
        ]
      }
    ],
    pitfalls: [
      'Beim Umstellen wird aus PLUS ein MINUS — das vergessen viele!',
      'IMMER c² minus Kathete² rechnen — nie andersherum! Sonst kommt eine negative Zahl raus.',
      'Wenn dein Ergebnis für a oder b GROESSER als c ist, hast du falsch gerechnet. Die Hypotenuse ist immer am längsten!',
      'Aufpassen: a² = c² - b² ist NICHT das gleiche wie a = c - b. Du musst erst quadrieren, dann subtrahieren, dann Wurzel ziehen!'
    ],
    quiz: {
      question: 'Hypotenuse c = 13 m, Kathete b = 5 m. Wie lang ist a?',
      options: ['8 m', '12 m', '18 m'],
      correctIndex: 1,
      explanation: 'a² = 13² - 5² = 169 - 25 = 144. √144 = 12 m.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Pythagoras im Schwimmbadalltag',
    intro:
      'Im Schwimmbad gibt es viele Stellen, wo du den Satz des Pythagoras brauchst: Beckendiagonalen messen, Rampenlängen berechnen, Dachneigungen prüfen oder Rohrleitungen verlegen. Hier übst du mit echten Aufgaben aus dem Bäderalltag!',
    motto: 'Rechter Winkel im Bad? Pythagoras hilft!',
    rules: [
      'Im Schwimmbad findest du rechte Winkel überall: Beckenkanten, Wände, Bodenplatten, Rampen.',
      'Die Diagonale eines Rechtecks teilt es in zwei rechtwinklige Dreiecke — perfekt für Pythagoras!',
      'Bei Rampen: Die Höhe und die horizontale Länge sind die Katheten, die Rampe selbst ist die Hypotenuse.',
      'Bei Rohrleitungen: Wenn ein Rohr schräg durch eine Wand läuft, kannst du die Länge mit Pythagoras berechnen.',
      'In der Prüfung kommen oft Beckendiagonalen und Rampen dran — diese Aufgaben unbedingt üben!'
    ],
    steps: [
      {
        title: '1. Rechten Winkel erkennen',
        text: 'Wo ist der 90°-Winkel in der Aufgabe? Bei einem Becken ist es die Ecke. Bei einer Rampe ist es der Winkel zwischen Boden und Wand.'
      },
      {
        title: '2. Seiten zuordnen',
        text: 'Welche Längen kennst du? Welche ist gesucht? Bestimme was a, b und c ist. Die Schräge (Diagonale, Rampe) ist meistens die Hypotenuse c.'
      },
      {
        title: '3. Richtige Formel wählen',
        text: 'Hypotenuse gesucht? → c = √(a² + b²). Kathete gesucht? → a = √(c² - b²).'
      },
      {
        title: '4. Rechnen und Einheit nicht vergessen',
        text: 'Einsetzen, quadrieren, addieren oder subtrahieren, Wurzel ziehen. Ergebnis mit Einheit (m, cm) aufschreiben!'
      }
    ],
    examples: [
      {
        title: 'Beckendiagonale',
        given: 'Ein Schwimmerbecken ist 25 m lang und 12 m breit.',
        question: 'Wie lang ist die Diagonale des Beckens?',
        steps: [
          ['Seiten zuordnen', 'a = 25 m (Länge), b = 12 m (Breite), c = Diagonale'],
          ['Formel', 'c = √(a² + b²)'],
          ['Quadrieren', '25² = 625, 12² = 144'],
          ['Addieren', '625 + 144 = 769'],
          ['Wurzel ziehen', 'c = √769 ≈ 27,73 m']
        ]
      },
      {
        title: 'Rampe ins Nichtschwimmerbecken',
        given: 'Eine Rampe führt 1,2 m tief ins Becken. Die horizontale Länge der Rampe beträgt 5 m.',
        question: 'Wie lang ist die Rampe (die Schräge)?',
        steps: [
          ['Seiten zuordnen', 'a = 1,2 m (Tiefe), b = 5 m (horizontal), c = Rampe'],
          ['Formel', 'c = √(a² + b²)'],
          ['Quadrieren', '1,2² = 1,44 und 5² = 25'],
          ['Addieren', '1,44 + 25 = 26,44'],
          ['Wurzel ziehen', 'c = √26,44 ≈ 5,14 m']
        ]
      },
      {
        title: 'Rohrleitung schräg durch die Wand',
        given: 'Ein Rohr läuft schräg durch eine 3 m dicke Wand. Es kommt 4 m höher auf der anderen Seite raus.',
        question: 'Wie lang ist das Rohrstück in der Wand?',
        steps: [
          ['Seiten zuordnen', 'a = 3 m (Wanddicke), b = 4 m (Höhe), c = Rohrlänge'],
          ['Formel', 'c = √(a² + b²)'],
          ['Quadrieren', '3² = 9, 4² = 16'],
          ['Addieren', '9 + 16 = 25'],
          ['Wurzel ziehen', 'c = √25 = 5 m']
        ]
      },
      {
        title: 'Dachneigung prüfen',
        given: 'Das Dach der Schwimmhalle ist 8 m hoch. Die schräge Dachfläche ist 17 m lang.',
        question: 'Wie breit ist die halbe Halle (horizontale Spannweite)?',
        steps: [
          ['Seiten zuordnen', 'a = 8 m (Höhe), c = 17 m (Schräge), b = horizontale Breite'],
          ['Formel umstellen', 'b = √(c² - a²)'],
          ['Quadrieren', '17² = 289, 8² = 64'],
          ['Subtrahieren', '289 - 64 = 225'],
          ['Wurzel ziehen', 'b = √225 = 15 m']
        ]
      }
    ],
    pitfalls: [
      'Die Diagonale ist IMMER länger als die längste Seite des Beckens — wenn nicht, rechne nochmal!',
      'Bei Rampen: Die Rampe (Schräge) ist die Hypotenuse, NICHT eine Kathete!',
      'Einheiten müssen übereinstimmen — nicht Meter und Zentimeter mischen!',
      'In der Prüfung: Immer eine Skizze machen und den rechten Winkel einzeichnen, bevor du rechnest.'
    ],
    quiz: {
      question: 'Ein Kinderbecken ist 8 m lang und 6 m breit. Wie lang ist die Diagonale?',
      options: ['14 m', '10 m', '12 m'],
      correctIndex: 1,
      explanation: '8² + 6² = 64 + 36 = 100. √100 = 10 m.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'berechnung', 'umstellen', 'praxis'];

/* ─── Formula reference table ──────────────────────────────────────────────── */

const FORMULA_TABLE = [
  ['Gesucht', 'Formel', 'Rechenweg'],
  ['Hypotenuse c', 'c = √(a² + b²)', 'Quadrieren → addieren → Wurzel'],
  ['Kathete a', 'a = √(c² - b²)', 'Quadrieren → subtrahieren → Wurzel'],
  ['Kathete b', 'b = √(c² - a²)', 'Quadrieren → subtrahieren → Wurzel']
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

export default function PythagorasDeepDiveView() {
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

          {/* Formula reference table (on berechnung and umstellen tabs) */}
          {(activeTab === 'berechnung' || activeTab === 'umstellen') && (
            <InfoCard darkMode={darkMode} title="Formel-Übersicht">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        {FORMULA_TABLE[0][0]}
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        {FORMULA_TABLE[0][1]}
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        {FORMULA_TABLE[0][2]}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FORMULA_TABLE.slice(1).map(([gesucht, formel, weg]) => (
                      <tr key={gesucht} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {gesucht}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {formel}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {weg}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Triangle helper (on grundlagen and praxis tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Schnell-Check: Seiten erkennen">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Hypotenuse c
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Die längste Seite, gegenüber dem rechten Winkel. Bei Becken: die Diagonale. Bei Rampen: die Schräge.
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Katheten a und b
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Die zwei Seiten, die den rechten Winkel bilden. Bei Becken: Länge und Breite. Bei Rampen: Höhe und horizontale Strecke.
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
