import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was ist eine Fläche?',
    intro:
      'Eine Fläche ist der Platz, den etwas einnimmt — zum Beispiel die Wasseroberfläche eines Beckens oder der Boden einer Schwimmhalle. Fläche misst man in Quadratmetern (m²). Wenn du weisst, wie lang und wie breit etwas ist, kannst du die Fläche berechnen.',
    motto: 'Fläche = wie viel Platz etwas braucht.',
    rules: [
      'Fläche ist IMMER zweidimensional — sie hat Länge und Breite, aber keine Höhe.',
      'Die Einheit für Fläche ist m² (Quadratmeter) — nicht m (Meter)!',
      '1 m² ist ein Quadrat mit 1 m Seitenlänge — also 1 m × 1 m.',
      'Meter (m) misst eine Strecke, Quadratmeter (m²) misst eine Fläche — nicht verwechseln!',
      'Um die Fläche zu berechnen, brauchst du IMMER mindestens zwei Masse (z.B. Länge und Breite).'
    ],
    steps: [
      {
        title: '1. Was ist die Form?',
        text: 'Schau dir den Gegenstand an: Ist es ein Rechteck, ein Dreieck oder ein Kreis? Die Form bestimmt, welche Formel du brauchst.'
      },
      {
        title: '2. Masse herausfinden',
        text: 'Miss oder lies die Masse ab. Bei einem Rechteck brauchst du Länge und Breite. Bei einem Kreis den Radius oder Durchmesser.'
      },
      {
        title: '3. Formel anwenden',
        text: 'Setze die Masse in die passende Formel ein. Beim Rechteck: Länge × Breite. Rechne Schritt für Schritt.'
      },
      {
        title: '4. Einheit nicht vergessen',
        text: 'Das Ergebnis bekommt IMMER die Einheit m² (oder cm²). Wenn du m × m rechnest, kommt m² raus — das ist logisch!'
      }
    ],
    examples: [
      {
        title: 'Einfaches Beispiel: Schwimmbecken',
        given: 'Ein Schwimmbecken ist 25 m lang und 10 m breit.',
        question: 'Wie gross ist die Wasseroberfläche?',
        steps: [
          ['Form erkennen', 'Rechteck (4 Ecken, gegenüberliegende Seiten gleich lang)'],
          ['Masse', 'Länge = 25 m, Breite = 10 m'],
          ['Formel', 'A = Länge × Breite = 25 × 10 = 250'],
          ['Ergebnis', 'Die Wasseroberfläche ist 250 m²']
        ]
      },
      {
        title: 'Bäder-Beispiel: Umkleidekabine',
        given: 'Eine Umkleidekabine ist 3 m lang und 2 m breit.',
        question: 'Wie viel Bodenfläche hat die Kabine?',
        steps: [
          ['Form erkennen', 'Rechteck'],
          ['Masse', 'Länge = 3 m, Breite = 2 m'],
          ['Formel', 'A = 3 × 2 = 6'],
          ['Ergebnis', 'Die Bodenfläche ist 6 m²']
        ]
      },
      {
        title: 'Unterschied m und m²',
        given: 'Ein quadratischer Raum hat Seiten von 4 m.',
        question: 'Wie gross ist der Umfang und wie gross ist die Fläche?',
        steps: [
          ['Umfang (Strecke)', '4 Seiten × 4 m = 16 m (das ist eine Länge!)'],
          ['Fläche', '4 m × 4 m = 16 m² (das ist eine Fläche!)'],
          ['Unterschied', '16 m ist die Strecke drum herum, 16 m² ist der Platz darin'],
          ['Merke', 'm = Strecke, m² = Fläche — andere Einheit, andere Bedeutung!']
        ]
      }
    ],
    pitfalls: [
      'm und m² verwechseln: 10 m ist eine Strecke, 10 m² ist eine Fläche — das ist ein riesiger Unterschied!',
      'Einheiten vergessen: Wenn du nur "250" schreibst statt "250 m²", gibt es Punktabzug.',
      'Länge und Breite müssen die GLEICHE Einheit haben — nicht cm mit m mischen!',
      'Die Fläche ist NICHT dasselbe wie der Umfang. Umfang = Strecke drum herum, Fläche = Platz darin.'
    ],
    quiz: {
      question: 'Ein Lehrschwimmbecken ist 12 m lang und 8 m breit. Wie gross ist die Wasseroberfläche?',
      options: ['40 m²', '96 m²', '20 m'],
      correctIndex: 1,
      explanation: 'A = Länge × Breite = 12 × 8 = 96 m². Achtung: 40 m² wäre der Umfang (aber in m, nicht m²) und 20 m ist nur der halbe Umfang.'
    }
  },

  rechteckDreieck: {
    id: 'rechteckDreieck',
    chip: 'Rechteck & Dreieck',
    title: 'Rechteck und Dreieck berechnen',
    intro:
      'Die beiden häufigsten Formen im Schwimmbad: Rechtecke (Becken, Räume, Fliesen) und Dreiecke (Dachflächen, Rasenecken). Das Dreieck ist dabei einfach das halbe Rechteck — wenn du das verstanden hast, kannst du beides!',
    motto: 'Dreieck = halbes Rechteck.',
    rules: [
      'Rechteck-Formel: A = a × b (Länge mal Breite).',
      'Quadrat ist ein Sonderfall: A = a × a (beide Seiten gleich lang).',
      'Dreieck-Formel: A = a × h ÷ 2 (Grundseite mal Höhe geteilt durch 2).',
      'Die Höhe beim Dreieck steht IMMER senkrecht (im rechten Winkel) auf der Grundseite.',
      'Warum ÷ 2? Weil ein Dreieck genau die Haelfte eines Rechtecks mit gleicher Grundseite und Höhe ist.'
    ],
    steps: [
      {
        title: '1. Rechteck: Seiten bestimmen',
        text: 'Ein Rechteck hat zwei verschiedene Seitenlängen: Seite a (Länge) und Seite b (Breite). Miss beide oder lies sie aus der Aufgabe ab.'
      },
      {
        title: '2. Rechteck: Multiplizieren',
        text: 'A = a × b — einfach Länge mal Breite. Beispiel: 25 m × 10 m = 250 m². Fertig!'
      },
      {
        title: '3. Dreieck: Grundseite und Höhe',
        text: 'Beim Dreieck brauchst du die Grundseite (a) und die Höhe (h). Die Höhe geht senkrecht von der Grundseite zur gegenüberliegenden Spitze.'
      },
      {
        title: '4. Dreieck: Rechnen wie Rechteck, dann halbieren',
        text: 'A = a × h ÷ 2 — erst Grundseite mal Höhe (wie beim Rechteck), dann durch 2 teilen. Beispiel: 6 m × 4 m ÷ 2 = 12 m².'
      }
    ],
    examples: [
      {
        title: 'Rechteck: Beckenboden fliesen',
        given: 'Ein Sportbecken ist 25 m lang und 12,5 m breit.',
        question: 'Wie viele m² Fliesen braucht man für den Boden?',
        steps: [
          ['Form', 'Rechteck'],
          ['Masse', 'a = 25 m, b = 12,5 m'],
          ['Rechnung', 'A = 25 × 12,5 = 312,5'],
          ['Ergebnis', 'Man braucht 312,5 m² Fliesen']
        ]
      },
      {
        title: 'Dreieck: Rasendreiecksfläche',
        given: 'Eine dreieckige Rasenfläche neben dem Becken hat eine Grundseite von 10 m und eine Höhe von 6 m.',
        question: 'Wie gross ist die Rasenfläche?',
        steps: [
          ['Form', 'Dreieck'],
          ['Masse', 'Grundseite a = 10 m, Höhe h = 6 m'],
          ['Rechnung', 'A = 10 × 6 ÷ 2 = 60 ÷ 2 = 30'],
          ['Ergebnis', 'Die Rasenfläche ist 30 m²']
        ]
      },
      {
        title: 'Dreieck als halbes Rechteck',
        given: 'Ein Rechteck ist 8 m × 5 m. Es wird diagonal halbiert.',
        question: 'Wie gross ist jedes der beiden Dreiecke?',
        steps: [
          ['Rechteck-Fläche', 'A = 8 × 5 = 40 m²'],
          ['Diagonale teilt in 2 Dreiecke', 'Jedes Dreieck = 40 ÷ 2 = 20 m²'],
          ['Probe mit Formel', 'A = 8 × 5 ÷ 2 = 20 m² — stimmt!'],
          ['Merke', 'Jedes Dreieck ist genau die Haelfte des Rechtecks']
        ]
      }
    ],
    pitfalls: [
      'Beim Dreieck das Teilen durch 2 vergessen — dann ist die Fläche doppelt so gross!',
      'Die Höhe ist NICHT die Seitenlänge! Die Höhe steht senkrecht auf der Grundseite.',
      'Bei Dreiecken: Nicht irgendwelche Seiten multiplizieren — es muss die Grundseite mit der DAZUGEHOERIGEN Höhe sein.',
      'Beim Quadrat beide Seiten gleich lang — aber trotzdem multiplizieren, nicht verdoppeln! 5 m × 5 m = 25 m², nicht 10 m².'
    ],
    quiz: {
      question: 'Eine dreieckige Sonnensegel-Fläche hat eine Grundseite von 8 m und eine Höhe von 5 m. Wie gross ist die Fläche?',
      options: ['40 m²', '20 m²', '13 m²'],
      correctIndex: 1,
      explanation: 'A = a × h ÷ 2 = 8 × 5 ÷ 2 = 40 ÷ 2 = 20 m².'
    }
  },

  kreis: {
    id: 'kreis',
    chip: 'Kreis',
    title: 'Kreisfläche berechnen',
    intro:
      'Runde Becken, Whirlpools, Filterplatten — im Schwimmbad gibt es viele Kreise. Die Kreisfläche berechnest du mit der Zahl Pi (π ≈ 3,14). Wichtig: Du brauchst den Radius, also den halben Durchmesser!',
    motto: 'A = π × r² — Pi mal Radius zum Quadrat.',
    rules: [
      'Die Kreisformel lautet: A = π × r² (Pi mal Radius hoch 2).',
      'π (Pi) ist ungefaehr 3,14 — für die Prüfung reicht 3,14 meistens aus.',
      'Der Radius (r) ist der Abstand vom Mittelpunkt zum Rand — also der HALBE Durchmesser.',
      'Der Durchmesser (d) geht von Rand zu Rand durch den Mittelpunkt — also das DOPPELTE vom Radius.',
      'r² bedeutet r × r — also den Radius mit sich selbst malnehmen (nicht mal 2!).'
    ],
    steps: [
      {
        title: '1. Radius oder Durchmesser?',
        text: 'Lies die Aufgabe genau: Steht da Radius oder Durchmesser? Wenn Durchmesser gegeben ist, teile durch 2 um den Radius zu bekommen. r = d ÷ 2.'
      },
      {
        title: '2. Radius quadrieren',
        text: 'Nimm den Radius mal sich selbst: r² = r × r. Beispiel: Radius 3 m → 3 × 3 = 9.'
      },
      {
        title: '3. Mit Pi malnehmen',
        text: 'Nimm das Ergebnis mal π (3,14): A = 3,14 × 9 = 28,26 m². Das ist die Kreisfläche!'
      },
      {
        title: '4. Ergebnis prüfen',
        text: 'Die Kreisfläche ist immer kleiner als das Quadrat, das drum herum passt. Ein Kreis mit r = 3 m passt in ein 6 m × 6 m Quadrat (36 m²). 28,26 < 36 — passt!'
      }
    ],
    examples: [
      {
        title: 'Rundbecken (Radius gegeben)',
        given: 'Ein rundes Planschbecken hat einen Radius von 4 m.',
        question: 'Wie gross ist die Wasseroberfläche?',
        steps: [
          ['Radius', 'r = 4 m'],
          ['r²', '4 × 4 = 16'],
          ['Formel', 'A = π × r² = 3,14 × 16 = 50,24'],
          ['Ergebnis', 'Die Wasseroberfläche ist 50,24 m²']
        ]
      },
      {
        title: 'Whirlpool (Durchmesser gegeben)',
        given: 'Ein Whirlpool hat einen Durchmesser von 3 m.',
        question: 'Wie gross ist die Wasserfläche?',
        steps: [
          ['Durchmesser → Radius', 'd = 3 m → r = 3 ÷ 2 = 1,5 m'],
          ['r²', '1,5 × 1,5 = 2,25'],
          ['Formel', 'A = π × r² = 3,14 × 2,25 = 7,065'],
          ['Ergebnis', 'Die Wasserfläche ist ca. 7,07 m²']
        ]
      },
      {
        title: 'Filterplatte',
        given: 'Eine runde Filterplatte hat einen Durchmesser von 60 cm.',
        question: 'Wie gross ist die Filterfläche in cm²?',
        steps: [
          ['Durchmesser → Radius', 'd = 60 cm → r = 30 cm'],
          ['r²', '30 × 30 = 900'],
          ['Formel', 'A = π × r² = 3,14 × 900 = 2.826'],
          ['Ergebnis', 'Die Filterfläche ist 2.826 cm²']
        ]
      }
    ],
    pitfalls: [
      'Radius und Durchmesser verwechseln — der Durchmesser ist DOPPELT so gross wie der Radius! Wenn du den Durchmesser statt den Radius einsetzt, ist die Fläche 4-mal zu gross.',
      'r² heisst r × r, NICHT r × 2! Das ist der häufigste Fehler: 5² = 25, nicht 10!',
      'Pi (π) nicht vergessen — ohne π ist es kein Kreis, sondern ein Quadrat.',
      'Bei Durchmesser-Angaben: ERST durch 2 teilen, DANN quadrieren. Nicht umgekehrt!'
    ],
    quiz: {
      question: 'Ein rundes Tauchbecken hat einen Durchmesser von 6 m. Wie gross ist die Wasseroberfläche? (π ≈ 3,14)',
      options: ['18,84 m²', '28,26 m²', '113,04 m²'],
      correctIndex: 1,
      explanation: 'Durchmesser 6 m → Radius = 3 m. r² = 3 × 3 = 9. A = 3,14 × 9 = 28,26 m².'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Flächenberechnung im Bäderalltag',
    intro:
      'Im Schwimmbad brauchst du Flächenberechnung ständig: Beckenwasserfläche für die Abdeckung, Bodenfläche für Fliesen, Rasenfläche für Duenger, Filterplatten-Größe. Hier uebst du mit echten Aufgaben aus dem Bäderalltag.',
    motto: 'Fläche berechnen gehoert zum Bäder-Alltag.',
    rules: [
      'Im Schwimmbad sind die meisten Becken rechteckig — also A = Länge × Breite.',
      'Runde Becken (Whirlpool, Planschbecken) brauchen die Kreisformel A = π × r².',
      'Für Fliesenberechnung: Erst die Gesamtfläche berechnen, dann durch die Fliesengröße teilen.',
      'Bei Abdeckplanen: Immer etwas Ueberstand einplanen (ca. 10-20 cm pro Seite).',
      'Für zusammengesetzte Flächen: In einfache Formen zerlegen, einzeln berechnen, dann addieren.'
    ],
    steps: [
      {
        title: '1. Aufgabe lesen und Form bestimmen',
        text: 'Was wird berechnet? Welche Form hat es? Rechteck, Dreieck, Kreis oder eine Kombination? Das bestimmt deine Formel.'
      },
      {
        title: '2. Alle Masse sammeln',
        text: 'Welche Masse sind gegeben? Länge, Breite, Radius? Müssen Einheiten umgerechnet werden (z.B. cm in m)?'
      },
      {
        title: '3. Formel anwenden',
        text: 'Rechteck: A = a × b. Dreieck: A = a × h ÷ 2. Kreis: A = π × r². Bei zusammengesetzten Flächen: Teilflächen einzeln berechnen.'
      },
      {
        title: '4. Ergebnis prüfen und runden',
        text: 'Macht die Größenordnung Sinn? Ein Sportbecken hat ca. 250-300 m², ein Whirlpool ca. 5-10 m². In der Prüfung: auf 2 Dezimalstellen runden.'
      }
    ],
    examples: [
      {
        title: 'Becken-Abdeckung bestellen',
        given: 'Das Sportbecken ist 25 m × 12,5 m. Eine Abdeckplane soll 0,5 m Ueberstand auf jeder Seite haben.',
        question: 'Wie gross muss die Abdeckplane sein?',
        steps: [
          ['Masse mit Ueberstand', 'Länge: 25 + 0,5 + 0,5 = 26 m, Breite: 12,5 + 0,5 + 0,5 = 13,5 m'],
          ['Formel', 'A = 26 × 13,5 = 351'],
          ['Ergebnis', 'Die Abdeckplane muss mindestens 351 m² gross sein'],
          ['Praxis-Tipp', 'Beim Bestellen lieber aufrunden auf 360 m²']
        ]
      },
      {
        title: 'Liegewiese duengen',
        given: 'Die Liegewiese ist 40 m lang und 25 m breit. Pro 100 m² braucht man 3 kg Duenger.',
        question: 'Wie viel Duenger wird benötigt?',
        steps: [
          ['Fläche berechnen', 'A = 40 × 25 = 1.000 m²'],
          ['Duenger berechnen', '1.000 ÷ 100 = 10 Einheiten à 3 kg'],
          ['Ergebnis', '10 × 3 = 30 kg Duenger'],
          ['Kontrolle', '1.000 m² ist 10-mal so viel wie 100 m², also 10-mal so viel Duenger']
        ]
      },
      {
        title: 'Fliesen für Beckenboden',
        given: 'Ein Nichtschwimmerbecken ist 16 m × 8 m. Die Fliesen sind 20 cm × 20 cm gross.',
        question: 'Wie viele Fliesen braucht man für den Boden?',
        steps: [
          ['Beckenfläche', 'A = 16 × 8 = 128 m²'],
          ['Fliesengröße umrechnen', '20 cm = 0,2 m → Fliese = 0,2 × 0,2 = 0,04 m²'],
          ['Anzahl berechnen', '128 ÷ 0,04 = 3.200 Fliesen'],
          ['Praxis-Tipp', 'Immer 5-10% Verschnitt einplanen → ca. 3.400-3.500 Fliesen bestellen']
        ]
      },
      {
        title: 'Rundbecken-Abdeckung',
        given: 'Das runde Planschbecken hat einen Durchmesser von 8 m.',
        question: 'Wie gross ist die Wasseroberfläche?',
        steps: [
          ['Radius bestimmen', 'd = 8 m → r = 4 m'],
          ['r²', '4 × 4 = 16'],
          ['Kreisfläche', 'A = π × r² = 3,14 × 16 = 50,24 m²'],
          ['Ergebnis', 'Die Wasseroberfläche ist ca. 50 m²']
        ]
      }
    ],
    pitfalls: [
      'Bei Fliesen: cm in m umrechnen, BEVOR du rechnest! 20 cm = 0,2 m, nicht 20 m.',
      'Zusammengesetzte Flächen nicht in einem Schritt rechnen — zerlege sie in Rechtecke, Dreiecke und Kreise.',
      'Ueberstand bei Abdeckplanen: Auf JEDER Seite dazurechnen, nicht nur einmal!',
      'Verschnitt nicht vergessen: Bei Fliesen, Folien und Rasen immer 5-10% extra einplanen.'
    ],
    quiz: {
      question: 'Ein quadratisches Becken hat Seitenlängen von 10 m. Wie viele Fliesen (25 cm × 25 cm) braucht man für den Boden?',
      options: ['400 Fliesen', '1.600 Fliesen', '4.000 Fliesen'],
      correctIndex: 1,
      explanation: 'Beckenfläche: 10 × 10 = 100 m². Fliesengröße: 0,25 × 0,25 = 0,0625 m². Anzahl: 100 ÷ 0,0625 = 1.600 Fliesen.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'rechteckDreieck', 'kreis', 'praxis'];

/* ─── Formula reference table ──────────────────────────────────────────────── */

const FORMULAS = [
  ['Form', 'Formel', 'Beispiel'],
  ['Rechteck', 'A = a × b', '25 m × 10 m = 250 m²'],
  ['Quadrat', 'A = a × a', '5 m × 5 m = 25 m²'],
  ['Dreieck', 'A = a × h ÷ 2', '10 m × 6 m ÷ 2 = 30 m²'],
  ['Kreis', 'A = π × r²', '3,14 × 4² = 50,24 m²']
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

export default function FlächenDeepDiveView() {
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

          {/* Formula reference table (on grundlagen and praxis tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Formelübersicht">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {FORMULAS[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FORMULAS.slice(1).map(([form, formel, beispiel]) => (
                      <tr key={form} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {form}
                        </td>
                        <td className={`px-3 py-2 font-mono ${darkMode ? 'bg-slate-900/40 text-teal-300' : 'bg-white text-teal-700'}`}>
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

          {/* Visual helper for Rechteck & Dreieck tab */}
          {activeTab === 'rechteckDreieck' && (
            <InfoCard darkMode={darkMode} title="Visueller Vergleich">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Rechteck
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    A = a × b — die ganze Fläche.
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Stell dir ein Schwimmbecken von oben vor: Länge × Breite.
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Dreieck = halbes Rechteck
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    A = a × h ÷ 2 — wie Rechteck, aber halbiert.
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Schneide ein Rechteck diagonal durch — jede Haelfte ist ein Dreieck.
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* Radius vs Diameter helper for Kreis tab */}
          {activeTab === 'kreis' && (
            <InfoCard darkMode={darkMode} title="Radius vs. Durchmesser">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Radius (r)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Vom Mittelpunkt zum Rand. Das ist der Wert, den du in die Formel einsetzt.
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Durchmesser (d)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Von Rand zu Rand durch den Mittelpunkt. Doppelt so gross wie der Radius.
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    d = 2 × r oder r = d ÷ 2
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-red-500/30 bg-red-500/10' : 'border-red-200 bg-red-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                    Achtung bei r²
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    r² = r × r (nicht r × 2!). Beispiel: 3² = 3 × 3 = 9, nicht 6!
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
