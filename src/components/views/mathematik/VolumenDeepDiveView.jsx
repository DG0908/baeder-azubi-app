import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was ist Volumen?',
    intro:
      'Das Volumen sagt dir, wie viel Platz in einem Körper ist — also wie viel Wasser in ein Becken passt. Für deine Ausbildung als Fachangestellte/r für Bäderbetriebe ist das die wichtigste Größe überhaupt: Du brauchst das Volumen für jede Chlor-Dosierung, jede Filterberechnung und jede Wasseraufbereitung.',
    motto: 'Länge × Breite × Tiefe = Volumen.',
    rules: [
      'Volumen = Länge × Breite × Tiefe (bei rechteckigen Becken).',
      'Die Einheit für Volumen ist Kubikmeter (m³).',
      'Die wichtigste Umrechnung: 1 m³ = 1.000 Liter.',
      'Alle Masse müssen in der GLEICHEN Einheit sein (alles in Metern!).',
      'Das Volumen brauchst du für JEDE Berechnung mit Chemikalien im Schwimmbad.'
    ],
    steps: [
      {
        title: '1. Masse herausfinden',
        text: 'Miss oder lies die Länge, Breite und Tiefe des Beckens ab. Achte darauf, dass alle Masse in Metern angegeben sind!'
      },
      {
        title: '2. Fläche berechnen',
        text: 'Rechne zuerst die Grundfläche: Länge × Breite. Beispiel: 25 m × 12,5 m = 312,5 m². Das ist die Wasserfläche von oben gesehen.'
      },
      {
        title: '3. Volumen berechnen',
        text: 'Nimm die Fläche mal die Tiefe: 312,5 m² × 2 m = 625 m³. Das ist das Volumen in Kubikmetern.'
      },
      {
        title: '4. In Liter umrechnen',
        text: 'Multipliziere mit 1.000: 625 m³ × 1.000 = 625.000 Liter. Jetzt weisst du, wie viel Wasser ins Becken passt.'
      }
    ],
    examples: [
      {
        title: 'Kleines Lehrschwimmbecken',
        given: 'Ein Lehrschwimmbecken ist 10 m lang, 6 m breit und 1,2 m tief.',
        question: 'Wie gross ist das Volumen in m³ und Litern?',
        steps: [
          ['Masse', 'L = 10 m, B = 6 m, T = 1,2 m'],
          ['Fläche', '10 × 6 = 60 m²'],
          ['Volumen', '60 × 1,2 = 72 m³'],
          ['In Liter', '72 × 1.000 = 72.000 Liter']
        ]
      },
      {
        title: 'Schwimmerbecken 25 m',
        given: 'Ein Schwimmerbecken ist 25 m lang, 12,5 m breit und 1,8 m tief.',
        question: 'Wie viel Wasser fasst das Becken?',
        steps: [
          ['Masse', 'L = 25 m, B = 12,5 m, T = 1,8 m'],
          ['Fläche', '25 × 12,5 = 312,5 m²'],
          ['Volumen', '312,5 × 1,8 = 562,5 m³'],
          ['In Liter', '562,5 × 1.000 = 562.500 Liter']
        ]
      },
      {
        title: 'Planschbecken',
        given: 'Ein Planschbecken ist 5 m lang, 4 m breit und 0,3 m tief.',
        question: 'Wie viel Wasser braucht man?',
        steps: [
          ['Masse', 'L = 5 m, B = 4 m, T = 0,3 m'],
          ['Fläche', '5 × 4 = 20 m²'],
          ['Volumen', '20 × 0,3 = 6 m³'],
          ['In Liter', '6 × 1.000 = 6.000 Liter']
        ]
      }
    ],
    pitfalls: [
      'Alle Masse müssen in der GLEICHEN Einheit sein — nicht Meter mit Zentimetern mischen!',
      'Volumen ist NICHT das Gleiche wie Fläche. Fläche hat m², Volumen hat m³.',
      'Vergiss nie die Umrechnung: 1 m³ = 1.000 Liter (nicht 100 und nicht 10.000!).',
      'Tiefe ist nicht gleich Wasserstand — das Becken ist oft nicht bis oben voll.'
    ],
    quiz: {
      question: 'Ein Becken ist 8 m lang, 5 m breit und 1,5 m tief. Wie viel Liter fasst es?',
      options: ['40.000 Liter', '60.000 Liter', '80.000 Liter'],
      correctIndex: 1,
      explanation: '8 × 5 = 40 m². 40 × 1,5 = 60 m³. 60 × 1.000 = 60.000 Liter.'
    }
  },

  berechnung: {
    id: 'berechnung',
    chip: 'Berechnung',
    title: 'Volumen Schritt für Schritt berechnen',
    intro:
      'Hier lernst du, wie du das Volumen verschiedener Beckenformen berechnest. Rechteckige Becken sind einfach, aber was machst du, wenn die Tiefe nicht überall gleich ist? Das kommt oft vor — zum Beispiel bei Nichtschwimmerbecken mit schrägstem Boden.',
    motto: 'Erst die Fläche, dann die Tiefe dazu.',
    rules: [
      'Bei gleichmäßiger Tiefe: Volumen = Länge × Breite × Tiefe.',
      'Bei unterschiedlicher Tiefe: Nimm die DURCHSCHNITTSTIEFE (tiefste Stelle + flachste Stelle geteilt durch 2).',
      'Durchschnittstiefe = (tiefste Stelle + flachste Stelle) ÷ 2.',
      'Die Grundfläche (Länge × Breite) ist immer der erste Rechenschritt.',
      'Prüfe dein Ergebnis: Ein 25-m-Becken hat meistens zwischen 400 und 700 m³.'
    ],
    steps: [
      {
        title: '1. Beckenform erkennen',
        text: 'Ist die Tiefe überall gleich? Dann einfach rechnen. Hat das Becken einen schrägen Boden? Dann brauchst du die Durchschnittstiefe.'
      },
      {
        title: '2. Durchschnittstiefe berechnen',
        text: 'Bei schrägstem Boden: (tiefste + flachste Stelle) ÷ 2. Beispiel: (2,0 m + 1,0 m) ÷ 2 = 1,5 m Durchschnittstiefe.'
      },
      {
        title: '3. Grundfläche berechnen',
        text: 'Länge × Breite ergibt die Grundfläche in m². Das ist immer gleich, egal ob der Boden schräg ist oder nicht.'
      },
      {
        title: '4. Volumen = Fläche × Tiefe',
        text: 'Grundfläche × (Durchschnitts-)Tiefe = Volumen in m³. Dann bei Bedarf × 1.000 für Liter.'
      }
    ],
    examples: [
      {
        title: 'Becken mit gleichmäßiger Tiefe',
        given: 'Ein Becken ist 20 m lang, 10 m breit und überall 1,35 m tief.',
        question: 'Wie gross ist das Volumen?',
        steps: [
          ['Masse', 'L = 20 m, B = 10 m, T = 1,35 m (überall gleich)'],
          ['Grundfläche', '20 × 10 = 200 m²'],
          ['Volumen', '200 × 1,35 = 270 m³'],
          ['In Liter', '270 × 1.000 = 270.000 Liter']
        ]
      },
      {
        title: 'Becken mit schrägstem Boden',
        given: 'Ein Nichtschwimmerbecken ist 16,67 m lang, 8 m breit. Tiefe von 0,60 m bis 1,35 m.',
        question: 'Wie gross ist das Volumen?',
        steps: [
          ['Masse', 'L = 16,67 m, B = 8 m, flach = 0,60 m, tief = 1,35 m'],
          ['Durchschnittstiefe', '(0,60 + 1,35) ÷ 2 = 0,975 m'],
          ['Grundfläche', '16,67 × 8 = 133,36 m²'],
          ['Volumen', '133,36 × 0,975 = 130,03 m³ (gerundet)']
        ]
      },
      {
        title: 'Schwimmerbecken mit Sprungbereich',
        given: 'Ein 25-m-Becken ist 12,5 m breit. Tiefe: 1,80 m im Schwimmbereich, 3,80 m im Sprungbereich.',
        question: 'Wie gross ist das Gesamtvolumen?',
        steps: [
          ['Masse', 'L = 25 m, B = 12,5 m, flach = 1,80 m, tief = 3,80 m'],
          ['Durchschnittstiefe', '(1,80 + 3,80) ÷ 2 = 2,80 m'],
          ['Grundfläche', '25 × 12,5 = 312,5 m²'],
          ['Volumen', '312,5 × 2,80 = 875 m³']
        ]
      }
    ],
    pitfalls: [
      'Die Durchschnittstiefe gilt NUR bei einem gleichmäßig schrägen Boden (keine Stufen!).',
      'Bei Becken mit Stufen musst du ZWEI getrennte Bereiche berechnen und dann addieren.',
      'Verwechsle nicht Becken-Tiefe und Wassertiefe — der Wasserstand ist oft niedriger als der Beckenrand.'
    ],
    quiz: {
      question: 'Ein Becken ist 20 m lang, 10 m breit. Die Tiefe geht von 1,0 m bis 2,0 m. Wie gross ist das Volumen?',
      options: ['200 m³', '300 m³', '400 m³'],
      correctIndex: 1,
      explanation: 'Durchschnittstiefe: (1,0 + 2,0) ÷ 2 = 1,5 m. Fläche: 20 × 10 = 200 m². Volumen: 200 × 1,5 = 300 m³.'
    }
  },

  umrechnung: {
    id: 'umrechnung',
    chip: 'Umrechnung',
    title: 'Kubikmeter, Liter und Dezimalliter',
    intro:
      'Die Umrechnung zwischen m³ und Litern ist das A und O im Schwimmbad. Chemikalien werden in g/m³ oder mg/L dosiert. Ohne sichere Umrechnung kannst du kein Chlor richtig dosieren. Und: 1 dm³ = 1 Liter — das musst du im Schlaf können!',
    motto: '1 m³ = 1.000 Liter. Immer.',
    rules: [
      '1 m³ = 1.000 Liter — das ist DIE wichtigste Umrechnung.',
      '1 dm³ (Kubikdezimeter) = 1 Liter — das ist dasselbe!',
      '1 Liter Wasser wiegt 1 kg (bei Normaltemperatur).',
      'Von m³ zu Liter: × 1.000. Von Liter zu m³: ÷ 1.000.',
      '1 mg/L = 1 g/m³ — diese Gleichung brauchst du bei JEDER Chlor-Dosierung.'
    ],
    steps: [
      {
        title: '1. Einheit erkennen',
        text: 'Steht die Angabe in m³ oder in Litern? Lies genau, was gefragt ist. Chemikalien stehen oft in mg/L, Beckenvolumen in m³.'
      },
      {
        title: '2. Umrechnungsfaktor wählen',
        text: 'Von m³ nach Liter: mal 1.000. Von Liter nach m³: geteilt durch 1.000. Einfach merken: m³ ist die GROESSERE Einheit.'
      },
      {
        title: '3. Umrechnen',
        text: 'Rechne um: z.B. 2,5 m³ × 1.000 = 2.500 Liter. Oder: 8.500 Liter ÷ 1.000 = 8,5 m³.'
      },
      {
        title: '4. Ergebnis auf Sinn prüfen',
        text: 'Die Literzahl muss IMMER größer sein als die m³-Zahl. Wenn nicht, hast du falsch gerechnet!'
      }
    ],
    examples: [
      {
        title: 'Beckenvolumen in Liter',
        given: 'Ein Becken hat 450 m³ Volumen.',
        question: 'Wie viel Liter sind das?',
        steps: [
          ['Gegeben', '450 m³'],
          ['Umrechnung', '× 1.000'],
          ['Rechnung', '450 × 1.000 = 450.000'],
          ['Ergebnis', '450 m³ = 450.000 Liter']
        ]
      },
      {
        title: 'Liter zurück in m³',
        given: 'Ein Wassertank fasst 12.000 Liter.',
        question: 'Wie viel m³ sind das?',
        steps: [
          ['Gegeben', '12.000 Liter'],
          ['Umrechnung', '÷ 1.000'],
          ['Rechnung', '12.000 ÷ 1.000 = 12'],
          ['Ergebnis', '12.000 Liter = 12 m³']
        ]
      },
      {
        title: 'Chlor-Dosierung: mg/L zu g/m³',
        given: 'Du sollst 0,5 mg/L Chlor dosieren. Das Becken hat 300 m³.',
        question: 'Wie viel Gramm Chlor brauchst du?',
        steps: [
          ['Merksatz', '1 mg/L = 1 g/m³'],
          ['Umrechnung', '0,5 mg/L = 0,5 g/m³'],
          ['Rechnung', '0,5 g/m³ × 300 m³ = 150 g'],
          ['Ergebnis', 'Du brauchst 150 g Aktivchlor']
        ]
      }
    ],
    pitfalls: [
      'Der häufigste Fehler: × 100 statt × 1.000. Es sind TAUSEND Liter pro Kubikmeter!',
      'dm³ und Liter sind DASSELBE — lass dich in der Prüfung nicht verwirren.',
      'Bei mg/L und g/m³: Die Zahlenwerte sind identisch! 0,3 mg/L = 0,3 g/m³.',
      'Kontrolliere die Richtung: m³ nach Liter = größere Zahl. Liter nach m³ = kleinere Zahl.'
    ],
    quiz: {
      question: 'Wie viel Liter sind 3,5 m³?',
      options: ['350 Liter', '3.500 Liter', '35.000 Liter'],
      correctIndex: 1,
      explanation: '3,5 × 1.000 = 3.500 Liter.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Beckenvolumen im Bäderalltag',
    intro:
      'Hier übst du mit echten Beckengrößen aus dem Schwimmbadbetrieb. Schwimmerbecken, Lehrschwimmbecken, Nichtschwimmerbecken, Planschbecken — jedes hat andere Masse. Und das Volumen brauchst du, um die richtige Menge Chlor zu dosieren!',
    motto: 'Ohne Volumen keine Dosierung.',
    rules: [
      'Schwimmerbecken (25 m): typisch 400–700 m³ je nach Breite und Tiefe.',
      'Lehrschwimmbecken: typisch 60–150 m³ (kleiner und flacher).',
      'Nichtschwimmerbecken: typisch 100–300 m³ (oft mit schrägstem Boden).',
      'Planschbecken: typisch 3–15 m³ (sehr flach, oft unter 0,40 m Tiefe).',
      'Für die Chlor-Dosierung brauchst du IMMER das aktuelle Wasservolumen, nicht das Beckenvolumen!'
    ],
    steps: [
      {
        title: '1. Beckentyp bestimmen',
        text: 'Welches Becken hast du? Miss die Masse oder lies sie vom Betriebshandbuch ab. Schwimmerbecken sind 25 m oder 50 m lang.'
      },
      {
        title: '2. Volumen berechnen',
        text: 'Länge × Breite × (Durchschnitts-)Tiefe = Volumen in m³. Bei schrägstem Boden die Durchschnittstiefe nehmen!'
      },
      {
        title: '3. In Liter umrechnen',
        text: 'm³ × 1.000 = Liter. Du brauchst die Literzahl für viele Dosier-Tabellen und Chemikalien-Berechnungen.'
      },
      {
        title: '4. Chlor-Menge berechnen',
        text: 'Volumen in m³ × gewünschte Dosierung in g/m³ = benötigte Chlormenge in Gramm. Beispiel: 500 m³ × 0,3 g/m³ = 150 g.'
      }
    ],
    examples: [
      {
        title: 'Schwimmerbecken — Chlor dosieren',
        given: 'Ein 25-m-Schwimmerbecken ist 12,5 m breit und 1,80 m tief. Dosierung: 0,3 g/m³.',
        question: 'Wie viel Chlor brauchst du?',
        steps: [
          ['Volumen', '25 × 12,5 × 1,80 = 562,5 m³'],
          ['Dosierung', '0,3 g/m³'],
          ['Rechnung', '562,5 × 0,3 = 168,75 g'],
          ['Ergebnis', 'Du brauchst ca. 169 g Aktivchlor']
        ]
      },
      {
        title: 'Lehrschwimmbecken — Wasserinhalt',
        given: 'Ein Lehrschwimmbecken ist 12,5 m lang, 8 m breit und 1,20 m tief.',
        question: 'Wie viel Wasser fasst es in Litern?',
        steps: [
          ['Volumen', '12,5 × 8 × 1,20 = 120 m³'],
          ['In Liter', '120 × 1.000 = 120.000 Liter'],
          ['Ergebnis', 'Das Lehrschwimmbecken fasst 120.000 Liter'],
          ['Hinweis', 'Das sind 120 Tonnen Wasser!']
        ]
      },
      {
        title: 'Nichtschwimmerbecken mit schrägstem Boden',
        given: 'Ein Nichtschwimmerbecken ist 16,67 m lang, 10 m breit. Tiefe von 0,60 m bis 1,35 m.',
        question: 'Wie gross ist das Volumen?',
        steps: [
          ['Durchschnittstiefe', '(0,60 + 1,35) ÷ 2 = 0,975 m'],
          ['Grundfläche', '16,67 × 10 = 166,7 m²'],
          ['Volumen', '166,7 × 0,975 = 162,5 m³ (gerundet)'],
          ['In Liter', '162,5 × 1.000 = 162.500 Liter']
        ]
      },
      {
        title: 'Planschbecken — kleine Menge, große Wirkung',
        given: 'Ein Planschbecken ist 6 m lang, 4 m breit und 0,30 m tief. Dosierung: 0,5 g/m³.',
        question: 'Wie viel Chlor brauchst du?',
        steps: [
          ['Volumen', '6 × 4 × 0,30 = 7,2 m³'],
          ['Dosierung', '0,5 g/m³'],
          ['Rechnung', '7,2 × 0,5 = 3,6 g'],
          ['Ergebnis', 'Nur 3,6 g Aktivchlor — aber genau dosieren!']
        ]
      }
    ],
    pitfalls: [
      'Bei Planschbecken: Kleine Volumina bedeuten, dass schon WENIGE Gramm Chlor zu viel sein können!',
      'Wasserstand ist NICHT gleich Beckentiefe — das Becken ist oft 5–10 cm unter dem Rand.',
      'Bei der Prüfung: Aufgaben mit unterschiedlicher Tiefe kommen HAEUFIG dran.',
      'Vergiss nicht: 1 mg/L = 1 g/m³. Ohne diese Umrechnung wird die Dosierung falsch!'
    ],
    quiz: {
      question: 'Ein Becken hat 250 m³ Volumen. Du sollst 0,4 g/m³ Chlor dosieren. Wie viel Gramm brauchst du?',
      options: ['80 g', '100 g', '125 g'],
      correctIndex: 1,
      explanation: '250 m³ × 0,4 g/m³ = 100 g Aktivchlor.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'berechnung', 'umrechnung', 'praxis'];

/* ─── Conversion reference table ────────────────────────────────────────────── */

const CONVERSION_TABLE = [
  ['1 m³', '1.000 Liter', '1.000 dm³'],
  ['0,5 m³', '500 Liter', '500 dm³'],
  ['0,1 m³', '100 Liter', '100 dm³'],
  ['0,001 m³', '1 Liter', '1 dm³']
];

/* ─── Typical pool volumes reference ────────────────────────────────────────── */

const POOL_VOLUMES = [
  ['Schwimmerbecken 25 m', '25 × 12,5 × 1,8 m', '~562 m³'],
  ['Schwimmerbecken 50 m', '50 × 25 × 2,0 m', '~2.500 m³'],
  ['Lehrschwimmbecken', '12,5 × 8 × 1,2 m', '~120 m³'],
  ['Nichtschwimmerbecken', '16,67 × 10 × ~1,0 m', '~163 m³'],
  ['Planschbecken', '6 × 4 × 0,3 m', '~7 m³']
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

export default function VolumenDeepDiveView() {
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

          {/* Conversion table (on grundlagen and umrechnung tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'umrechnung') && (
            <InfoCard darkMode={darkMode} title="Umrechnungstabelle">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        m³
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Liter
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        dm³
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONVERSION_TABLE.map(([m3, liter, dm3]) => (
                      <tr key={m3} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {m3}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {liter}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {dm3}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Pool volumes reference (on berechnung and praxis tabs) */}
          {(activeTab === 'berechnung' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Typische Beckenvolumen">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Beckentyp
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Masse (L×B×T)
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Volumen
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {POOL_VOLUMES.map(([type, dimensions, volume]) => (
                      <tr key={type} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {type}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {dimensions}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {volume}
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
