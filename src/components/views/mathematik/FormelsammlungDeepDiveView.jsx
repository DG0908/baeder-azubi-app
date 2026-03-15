import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Wie benutzt man eine Formelsammlung?',
    intro:
      'Eine Formelsammlung ist dein wichtigstes Werkzeug in der Pruefung. Sie enthaelt alle Formeln, die du brauchst — du musst sie nicht auswendig lernen, aber du musst sie LESEN und ANWENDEN koennen. Hier lernst du, wie du jede Formel richtig einsetzt.',
    motto: 'Nicht auswendig lernen — verstehen und anwenden.',
    rules: [
      'Jede Formel besteht aus Buchstaben (Variablen) und Rechenzeichen — die Buchstaben stehen fuer Zahlen mit Einheiten.',
      'Lies eine Formel immer MIT den Einheiten: V = L × B × T bedeutet Volumen in m³ = Laenge in m × Breite in m × Tiefe in m.',
      'Bevor du rechnest: Pruefe ob alle Einheiten zusammenpassen (z.B. alles in Metern, nicht Meter und Zentimeter mischen).',
      'Stelle die Formel IMMER zuerst nach der gesuchten Groesse um, bevor du Zahlen einsetzt.',
      'In der Pruefung darfst du die Formelsammlung benutzen — uebe vorher damit, damit du schnell findest was du brauchst.'
    ],
    steps: [
      {
        title: '1. Aufgabe lesen — was ist gesucht?',
        text: 'Lies die Aufgabe genau. Was sollst du berechnen? Das ist deine gesuchte Groesse. Beispiel: "Berechne das Volumen" → gesucht ist V.'
      },
      {
        title: '2. Richtige Formel finden',
        text: 'Suche in der Formelsammlung die passende Formel. Fuer Volumen eines Beckens brauchst du V = L × B × T. Schreib die Formel auf.'
      },
      {
        title: '3. Einheiten pruefen und umrechnen',
        text: 'Sind alle gegebenen Werte in der gleichen Einheit? Wenn nicht, zuerst umrechnen! 150 cm = 1,5 m. Erst dann einsetzen.'
      },
      {
        title: '4. Zahlen einsetzen und ausrechnen',
        text: 'Setze die Zahlen in die Formel ein und rechne Schritt fuer Schritt. Schreib die Einheit zum Ergebnis: V = 25 × 12 × 1,5 = 450 m³.'
      }
    ],
    examples: [
      {
        title: 'Formel anwenden: Beckenvolumen',
        given: 'Ein Schwimmbecken ist 25 m lang, 12 m breit und 1,8 m tief.',
        question: 'Berechne das Volumen mit der Formel V = L × B × T.',
        steps: [
          ['Gesucht', 'V (Volumen)'],
          ['Formel', 'V = L × B × T'],
          ['Einsetzen', 'V = 25 × 12 × 1,8'],
          ['Ergebnis', 'V = 540 m³']
        ]
      },
      {
        title: 'Formel umstellen: Tiefe gesucht',
        given: 'Ein Becken hat 300 m³ Volumen, ist 25 m lang und 10 m breit.',
        question: 'Wie tief ist das Becken?',
        steps: [
          ['Gesucht', 'T (Tiefe)'],
          ['Formel', 'V = L × B × T → umstellen: T = V ÷ (L × B)'],
          ['Einsetzen', 'T = 300 ÷ (25 × 10) = 300 ÷ 250'],
          ['Ergebnis', 'T = 1,2 m']
        ]
      },
      {
        title: 'Einheiten-Falle erkennen',
        given: 'Ein Becken ist 25 m lang, 10 m breit und 180 cm tief.',
        question: 'Berechne das Volumen (Achtung: Einheiten!).',
        steps: [
          ['Einheiten pruefen', '180 cm = 1,8 m (erst umrechnen!)'],
          ['Formel', 'V = L × B × T'],
          ['Einsetzen', 'V = 25 × 10 × 1,8'],
          ['Ergebnis', 'V = 450 m³ (NICHT 450.000!)']
        ]
      }
    ],
    pitfalls: [
      'NIEMALS mit gemischten Einheiten rechnen — erst alles in die gleiche Einheit umrechnen!',
      'Formel falsch umgestellt? Kontroll-Trick: Setze das Ergebnis zurueck in die Originalformel ein.',
      'Einheit vergessen? Ohne Einheit ist eine Zahl wertlos — 450 was? m³? Liter? cm³?',
      'Taschenrechner-Fehler: Klammern setzen! V÷(L×B) ist NICHT das gleiche wie V÷L×B.'
    ],
    quiz: {
      question: 'Die Formel lautet A = L × B. Ein Becken ist 50 m lang und 20 m breit. Wie gross ist die Flaeche?',
      options: ['70 m²', '1.000 m²', '100 m²'],
      correctIndex: 1,
      explanation: 'A = L × B = 50 × 20 = 1.000 m².'
    }
  },

  geometrie: {
    id: 'geometrie',
    chip: 'Geometrie & Hydraulik',
    title: 'Geometrie- und Hydraulik-Formeln',
    intro:
      'Diese Formeln brauchst du fuer Beckenberechnungen, Flaechenberechnung und Wasserstroemungen. Ob Beckenvolumen, Rohrquerschnitt oder Durchflussmenge — hier findest du alle wichtigen Formeln auf einen Blick.',
    motto: 'Flaeche, Volumen, Durchfluss — die drei Sauelen der Badtechnik.',
    rules: [
      'Flaeche Rechteck: A = l × b (Laenge mal Breite, Ergebnis in m²).',
      'Flaeche Kreis: A = π × r² (Pi mal Radius zum Quadrat, π ≈ 3,14).',
      'Volumen Quader: V = L × B × T (Laenge × Breite × Tiefe, Ergebnis in m³).',
      'Volumenstrom: Q = V ÷ t (Volumen geteilt durch Zeit, z.B. m³/h).',
      'Fliessgeschwindigkeit: vF = Q ÷ A (Volumenstrom geteilt durch Querschnittsflaeche).'
    ],
    steps: [
      {
        title: '1. Form erkennen',
        text: 'Was fuer eine Form hat das Objekt? Rechteck → A = l × b. Kreis → A = π × r². Quader (Becken) → V = L × B × T.'
      },
      {
        title: '2. Werte zuordnen',
        text: 'Welche Masse sind gegeben? Schreib sie mit Einheiten auf. Beispiel: L = 25 m, B = 12,5 m, T = 2 m.'
      },
      {
        title: '3. In Formel einsetzen',
        text: 'Setze die Werte ein: V = 25 × 12,5 × 2. Bei Hydraulik: Q = V ÷ t oder vF = Q ÷ A.'
      },
      {
        title: '4. Ergebnis mit Einheit',
        text: 'Rechne aus und schreib die Einheit dazu: V = 625 m³. Bei Hydraulik achte auf m³/h oder m/s.'
      }
    ],
    examples: [
      {
        title: 'Beckenvolumen berechnen',
        given: 'Schwimmerbecken: 50 m lang, 21 m breit, 1,8 m tief.',
        question: 'Wie viel Wasser fasst das Becken?',
        steps: [
          ['Formel', 'V = L × B × T'],
          ['Einsetzen', 'V = 50 × 21 × 1,8'],
          ['Rechnen', 'V = 1.890 m³'],
          ['In Liter', '1.890 m³ × 1.000 = 1.890.000 Liter']
        ]
      },
      {
        title: 'Kreisflaeche eines Rundbeckens',
        given: 'Ein Rundbecken hat einen Durchmesser von 8 m.',
        question: 'Wie gross ist die Wasserflaeche?',
        steps: [
          ['Radius', 'r = d ÷ 2 = 8 ÷ 2 = 4 m'],
          ['Formel', 'A = π × r²'],
          ['Einsetzen', 'A = 3,14 × 4² = 3,14 × 16'],
          ['Ergebnis', 'A ≈ 50,27 m²']
        ]
      },
      {
        title: 'Volumenstrom einer Filteranlage',
        given: 'Die Filteranlage waelzt 600 m³ Wasser in 4 Stunden um.',
        question: 'Wie gross ist der Volumenstrom Q?',
        steps: [
          ['Formel', 'Q = V ÷ t'],
          ['Einsetzen', 'Q = 600 m³ ÷ 4 h'],
          ['Ergebnis', 'Q = 150 m³/h'],
          ['Umrechnung', '150 ÷ 3.600 ≈ 0,042 m³/s = 42 L/s']
        ]
      }
    ],
    pitfalls: [
      'Durchmesser und Radius verwechseln! Der Radius ist die HAELFTE des Durchmessers: r = d ÷ 2.',
      'Bei r² den Radius ZUERST quadrieren, DANN mit π multiplizieren (Punkt vor Strich).',
      'Volumenstrom Q: Einheiten muessen zueinander passen — m³ mit Stunden ODER Liter mit Sekunden.',
      'Pythagoras (a² + b² = c²) wird bei schraegen Beckenboeden gebraucht — c ist immer die laengste Seite!'
    ],
    quiz: {
      question: 'Eine Pumpe foerdert 240 m³ in 6 Stunden. Wie gross ist der Volumenstrom Q?',
      options: ['30 m³/h', '40 m³/h', '1.440 m³/h'],
      correctIndex: 1,
      explanation: 'Q = V ÷ t = 240 ÷ 6 = 40 m³/h.'
    }
  },

  physikchemie: {
    id: 'physikchemie',
    chip: 'Physik & Chemie',
    title: 'Physik- und Chemie-Formeln',
    intro:
      'Geschwindigkeit, Druck, Arbeit, Leistung und Waerme — diese Formeln brauchst du fuer Wasseraufbereitung, Heizung und Technik im Schwimmbad. Dazu kommen die wichtigsten Chemie-Formeln fuer Chlorung und Dosierung.',
    motto: 'Physik erklaert die Technik — Chemie schuetzt das Wasser.',
    rules: [
      'Geschwindigkeit: v = s ÷ t (Strecke geteilt durch Zeit, z.B. m/s).',
      'Druck: p = F ÷ A (Kraft geteilt durch Flaeche, Einheit: Pascal oder bar). Wasserdruck: ca. 0,1 bar pro Meter Tiefe.',
      'Arbeit: W = F × s (Kraft mal Weg, Einheit: Joule oder Nm). Leistung: P = W ÷ t (Arbeit pro Zeit, Einheit: Watt).',
      'Waermemenge: Q = 1,16 × m³ × ΔT (Wh). 1,16 Wh braucht man, um 1 Liter Wasser um 1°C zu erwaermen.',
      'Chemie: Produktmenge = Aktivchlor ÷ Wirkstoffgehalt(%). Umrechnung: 1 mg/L = 1 g/m³.'
    ],
    steps: [
      {
        title: '1. Physikalische Groesse identifizieren',
        text: 'Was wird gefragt? Geschwindigkeit (v), Druck (p), Arbeit (W), Leistung (P) oder Waerme (Q)? Das bestimmt die Formel.'
      },
      {
        title: '2. Gegebene Werte sammeln',
        text: 'Welche Werte hast du? Schreib sie mit Einheiten auf. Beispiel: F = 500 N, A = 0,1 m² → p = F ÷ A.'
      },
      {
        title: '3. Einsetzen und rechnen',
        text: 'Zahlen in die Formel einsetzen: p = 500 ÷ 0,1 = 5.000 Pa. Eventuell umrechnen: 5.000 Pa = 0,05 bar.'
      },
      {
        title: '4. Ergebnis pruefen',
        text: 'Ist das Ergebnis realistisch? Wasserdruck in 3 m Tiefe ≈ 0,3 bar. Beckenwasser erwaermen braucht viele kWh. Plausibilitaets-Check!'
      }
    ],
    examples: [
      {
        title: 'Wasserdruck in der Tiefe',
        given: 'Ein Schwimmerbecken ist 3,5 m tief.',
        question: 'Wie gross ist der Wasserdruck am Beckenboden?',
        steps: [
          ['Faustregel', '0,1 bar pro Meter Wassertiefe'],
          ['Rechnung', 'p = 3,5 × 0,1 bar'],
          ['Ergebnis', 'p = 0,35 bar am Beckenboden'],
          ['Hinweis', 'Dazu kommt der Luftdruck (ca. 1 bar)']
        ]
      },
      {
        title: 'Beckenwasser erwaermen',
        given: 'Ein Becken hat 400 m³ Wasser. Es soll von 22°C auf 28°C erwaermt werden.',
        question: 'Wie viel Waermeenergie wird benoetigt?',
        steps: [
          ['Temperaturdifferenz', 'ΔT = 28 - 22 = 6°C'],
          ['Formel', 'Q = 1,16 × m³ × ΔT (in Wh)'],
          ['Einsetzen', 'Q = 1,16 × 400 × 6 = 2.784 Wh'],
          ['In kWh', 'Q = 2.784 ÷ 1.000 = 2,784 kWh']
        ]
      },
      {
        title: 'Chlorprodukt-Menge berechnen',
        given: 'Du brauchst 150 g Aktivchlor. Das Chlorprodukt hat 65% Wirkstoffgehalt.',
        question: 'Wie viel Produkt musst du abwiegen?',
        steps: [
          ['Formel', 'Produkt = Aktivchlor ÷ Wirkstoffgehalt'],
          ['Prozent umrechnen', '65% = 0,65'],
          ['Einsetzen', 'Produkt = 150 g ÷ 0,65'],
          ['Ergebnis', 'Produkt ≈ 230,8 g abwiegen']
        ]
      }
    ],
    pitfalls: [
      'Waermeformel: Q = 1,16 × m³ × ΔT gibt Wh (Wattstunden), NICHT kWh! Durch 1.000 teilen fuer kWh.',
      'Chlor-Dosierung: Prozent als Dezimalzahl einsetzen! 65% = 0,65 (nicht 65).',
      'Druck: 1 bar = 100.000 Pa. Wasserdruck-Faustregel 0,1 bar/m gilt nur fuer Wasser, nicht fuer andere Fluessigkeiten.',
      'Leistung P = W ÷ t: Zeit in Sekunden einsetzen, wenn Ergebnis in Watt sein soll!'
    ],
    quiz: {
      question: 'Wie viel Waerme braucht man, um 200 m³ Wasser um 4°C zu erwaermen? (Q = 1,16 × m³ × ΔT)',
      options: ['464 Wh', '928 Wh', '232 Wh'],
      correctIndex: 1,
      explanation: 'Q = 1,16 × 200 × 4 = 928 Wh (= 0,928 kWh).'
    }
  },

  schnellreferenz: {
    id: 'schnellreferenz',
    chip: 'Schnellreferenz',
    title: 'Schnellreferenz — Umrechnungen und wichtige Werte',
    intro:
      'Hier findest du die wichtigsten Umrechnungen, haeufig gebrauchte Werte und eine Einheiten-Uebersicht auf einen Blick. Diese Tabelle solltest du in der Pruefung sofort finden koennen — sie spart dir viel Zeit!',
    motto: 'Nachschlagen statt nachdenken — aber wissen wo es steht!',
    rules: [
      'Volumen: 1 m³ = 1.000 Liter. Ein Kubikmeter ist ein Wuerfel mit 1 m Kantenlaenge.',
      'Konzentration: 1 mg/L = 1 g/m³. Diese Umrechnung brauchst du bei JEDER Chlor-Aufgabe!',
      'Geschwindigkeit: m/s × 3,6 = km/h. Von m/s auf km/h multiplizierst du mit 3,6.',
      'Zeit: Minuten ÷ 60 = Stunden. 90 Minuten = 1,5 Stunden (nicht 1,9!).',
      'Flaechenmasse: 1 m² = 10.000 cm². Volumenmasse: 1 m³ = 1.000.000 cm³.'
    ],
    steps: [
      {
        title: '1. Einheit der Aufgabe erkennen',
        text: 'In welcher Einheit steht die Angabe? In welcher Einheit wird das Ergebnis verlangt? Beispiel: Gegeben in Litern, gesucht in m³.'
      },
      {
        title: '2. Umrechnungsfaktor nachschlagen',
        text: 'Suche in der Tabelle den passenden Faktor: Liter → m³ bedeutet ÷ 1.000. Also: 5.000 L ÷ 1.000 = 5 m³.'
      },
      {
        title: '3. Umrechnung durchfuehren',
        text: 'Multipliziere oder dividiere mit dem Faktor. Merke: Von klein nach gross → teilen. Von gross nach klein → malnehmen.'
      },
      {
        title: '4. Ergebnis auf Plausibilitaet pruefen',
        text: 'Kubikmeter sind "groesser" als Liter, also muss die Zahl in m³ KLEINER sein als in Litern. 5 m³ < 5.000 L — passt!'
      }
    ],
    examples: [
      {
        title: 'Liter in Kubikmeter umrechnen',
        given: 'Ein Becken fasst 750.000 Liter.',
        question: 'Wie viel ist das in Kubikmetern?',
        steps: [
          ['Umrechnung', '1 m³ = 1.000 Liter'],
          ['Rechnung', '750.000 L ÷ 1.000'],
          ['Ergebnis', '750 m³'],
          ['Check', 'm³ ist groesser → Zahl wird kleiner ✓']
        ]
      },
      {
        title: 'mg/L in g/m³ umrechnen',
        given: 'Der Chlorgehalt soll 0,6 mg/L betragen. Das Becken hat 500 m³.',
        question: 'Wie viel Gramm Aktivchlor werden insgesamt benoetigt?',
        steps: [
          ['Umrechnung', '0,6 mg/L = 0,6 g/m³'],
          ['Rechnung', '0,6 g/m³ × 500 m³'],
          ['Ergebnis', '300 g Aktivchlor'],
          ['Hinweis', 'mg/L = g/m³ ist die wichtigste Umrechnung!']
        ]
      },
      {
        title: 'Minuten in Stunden umrechnen',
        given: 'Die Umwaelzzeit betraegt 270 Minuten.',
        question: 'Wie viel Stunden sind das?',
        steps: [
          ['Umrechnung', 'Minuten ÷ 60 = Stunden'],
          ['Rechnung', '270 ÷ 60'],
          ['Ergebnis', '4,5 Stunden (= 4 Stunden 30 Minuten)'],
          ['Achtung', '4,5 h ist NICHT 4 h 50 min!']
        ]
      }
    ],
    pitfalls: [
      'Haeufigster Fehler: 4,5 Stunden als "4 Stunden 50 Minuten" lesen. 0,5 h = 30 min, NICHT 50 min!',
      'cm² in m² umrechnen: Durch 10.000 teilen (nicht durch 100!). 50.000 cm² = 5 m².',
      'Liter pro Sekunde in m³/h: Erst × 3.600 (Sekunden pro Stunde), dann ÷ 1.000 (Liter pro m³). Oder: × 3,6.',
      'mg/L und g/m³ sind GLEICH — nicht nochmal umrechnen! Das ist der haeufigste Pruefungsfehler.'
    ],
    quiz: {
      question: 'Wie viel sind 2.500 Liter in Kubikmetern?',
      options: ['25 m³', '2,5 m³', '0,25 m³'],
      correctIndex: 1,
      explanation: '2.500 L ÷ 1.000 = 2,5 m³.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'geometrie', 'physikchemie', 'schnellreferenz'];

/* ─── Reference tables for sidebar ─────────────────────────────────────────── */

const CONVERSIONS = [
  ['1 m³', '= 1.000 Liter'],
  ['1 mg/L', '= 1 g/m³'],
  ['m/s × 3,6', '= km/h'],
  ['Minuten ÷ 60', '= Stunden'],
  ['1 m²', '= 10.000 cm²'],
  ['1 m³', '= 1.000.000 cm³'],
  ['1 bar', '= 100.000 Pa'],
  ['1 kWh', '= 1.000 Wh']
];

const COMMON_VALUES = [
  ['Wasserdruck', '≈ 0,1 bar pro m Tiefe'],
  ['Waerme (Wasser)', '1,16 Wh pro Liter und °C'],
  ['π (Pi)', '≈ 3,14159'],
  ['Aktivchlor-Gehalt', 'meist 60–70% im Produkt'],
  ['Schwimmerbecken', 'typ. 25×12,5×1,8 m'],
  ['Freibecken-Temp.', '24–26 °C empfohlen']
];

const FORMULA_OVERVIEW = [
  ['A = l × b', 'Rechteckflaeche'],
  ['A = π × r²', 'Kreisflaeche'],
  ['V = L × B × T', 'Beckenvolumen'],
  ['Q = V ÷ t', 'Volumenstrom'],
  ['vF = Q ÷ A', 'Fliessgeschwindigkeit'],
  ['v = s ÷ t', 'Geschwindigkeit'],
  ['p = F ÷ A', 'Druck'],
  ['W = F × s', 'Arbeit'],
  ['P = W ÷ t', 'Leistung'],
  ['Q = 1,16 × m³ × ΔT', 'Waermemenge (Wh)']
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

export default function FormelsammlungDeepDiveView() {
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
          <InfoCard darkMode={darkMode} title="Schritt fuer Schritt">
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

          {/* Formula overview table (on grundlagen and geometrie tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'geometrie') && (
            <InfoCard darkMode={darkMode} title="Alle Formeln im Ueberblick">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Formel
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Bedeutung
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FORMULA_OVERVIEW.map(([formula, meaning]) => (
                      <tr key={formula} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {formula}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {meaning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Conversions table (on schnellreferenz tab) */}
          {activeTab === 'schnellreferenz' && (
            <>
              <InfoCard darkMode={darkMode} title="Wichtige Umrechnungen">
                <div className="overflow-hidden rounded-xl border border-transparent">
                  <table className="min-w-full text-sm">
                    <tbody>
                      {CONVERSIONS.map(([from, to]) => (
                        <tr key={from + to} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                          <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                            {from}
                          </td>
                          <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                            {to}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </InfoCard>

              <InfoCard darkMode={darkMode} title="Haeufig gebrauchte Werte">
                <div className="overflow-hidden rounded-xl border border-transparent">
                  <table className="min-w-full text-sm">
                    <tbody>
                      {COMMON_VALUES.map(([label, value]) => (
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
              </InfoCard>
            </>
          )}

          {/* Physics/Chemistry quick reference (on physikchemie tab) */}
          {activeTab === 'physikchemie' && (
            <InfoCard darkMode={darkMode} title="Einheiten-Schnellhilfe">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Physik-Einheiten
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Geschwindigkeit: m/s oder km/h
                  </p>
                  <p className={`text-sm leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Druck: Pa (Pascal) oder bar
                  </p>
                  <p className={`text-sm leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Arbeit: J (Joule) = Nm
                  </p>
                  <p className={`text-sm leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Leistung: W (Watt) = J/s
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Chemie-Einheiten
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Konzentration: mg/L = g/m³
                  </p>
                  <p className={`text-sm leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Waermemenge: Wh oder kWh
                  </p>
                  <p className={`text-sm leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Wirkstoffgehalt: % (als Dezimal rechnen!)
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
              Antwort pruefen
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
