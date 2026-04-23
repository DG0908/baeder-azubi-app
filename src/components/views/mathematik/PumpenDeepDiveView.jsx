import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was machen Pumpen im Schwimmbad?',
    intro:
      'Pumpen sind das Herz jeder Badeanlage. Sie bewegen das Wasser durch Filter, Heizung und Desinfektion. Ohne Pumpen steht das Wasser still — und stehendes Wasser wird schnell unhygienisch. Als Fachangestellter musst du verstehen, wie Pumpen arbeiten und wie man sie berechnet.',
    motto: 'Ohne Pumpe kein sauberes Wasser.',
    rules: [
      'Pumpen fördern Wasser von einem Ort zum anderen — das nennt man den Förderstrom Q.',
      'Der Förderstrom Q wird in m³/h (Kubikmeter pro Stunde) angegeben.',
      'Die Förderhöhe H beschreibt, wie hoch die Pumpe das Wasser druecken kann (in Metern).',
      'Jede Pumpe hat eine Pumpenkennlinie — sie zeigt, wie viel Wasser bei welcher Höhe fliesst.',
      'Im Schwimmbad laufen Umwaelzpumpen rund um die Uhr — sie müssen zuverlaessig und sparsam sein.'
    ],
    steps: [
      {
        title: '1. Aufgabe der Pumpe verstehen',
        text: 'Die Pumpe saugt Wasser aus dem Becken an, drueckt es durch den Filter und die Aufbereitung und bringt es zurück ins Becken. Dieser Kreislauf heisst Umwaelzung.'
      },
      {
        title: '2. Förderstrom kennen',
        text: 'Der Förderstrom Q sagt dir, wie viel Wasser die Pumpe pro Stunde bewegt. Beispiel: Q = 50 m³/h bedeutet: 50 Kubikmeter Wasser pro Stunde.'
      },
      {
        title: '3. Förderhöhe verstehen',
        text: 'Die Förderhöhe H ist der Widerstand, den die Pumpe ueberwinden muss. Dazu gehoeren: Höhenunterschied, Rohrreibung und Filterwiderstand. Alles zusammen ergibt die Gesamtförderhöhe.'
      },
      {
        title: '4. Umwaelzzeit beachten',
        text: 'Die Umwaelzzeit sagt dir, wie lange es dauert, bis das gesamte Beckenwasser einmal durch die Aufbereitung gelaufen ist. Je kuerzer, desto besser die Wasserqualität.'
      }
    ],
    examples: [
      {
        title: 'Einfaches Beispiel: Förderstrom ablesen',
        given: 'Eine Pumpe fördert 30 m³/h. Das Becken hat 150 m³ Wasser.',
        question: 'Wie oft pro Tag wird das Wasser umgewaelzt?',
        steps: [
          ['Bekannt', 'Q = 30 m³/h, Beckenvolumen = 150 m³'],
          ['Umwaelzzeit berechnen', '150 m³ ÷ 30 m³/h = 5 Stunden'],
          ['Umwaelzungen pro Tag', '24 h ÷ 5 h = 4,8 Umwaelzungen'],
          ['Ergebnis', 'Das Wasser wird knapp 5 Mal pro Tag umgewaelzt']
        ]
      },
      {
        title: 'Bäder-Beispiel: Förderhöhe',
        given: 'Eine Pumpe muss Wasser 3 m hoch fördern. Dazu kommen 5 m Rohrleitungsverluste und 4 m Filterwiderstand.',
        question: 'Welche Gesamtförderhöhe braucht die Pumpe?',
        steps: [
          ['Höhenunterschied', '3 m'],
          ['Rohrverluste', '+ 5 m'],
          ['Filterwiderstand', '+ 4 m'],
          ['Gesamtförderhöhe', '3 + 5 + 4 = 12 m']
        ]
      }
    ],
    pitfalls: [
      'Förderstrom und Förderhöhe nicht verwechseln — Q ist Menge (m³/h), H ist Druck (m).',
      'Die Förderhöhe ist NICHT nur der Höhenunterschied — Rohrverluste und Filterwiderstand kommen dazu!',
      'Eine größere Pumpe ist nicht immer besser — sie verbraucht mehr Strom und kann die Rohre ueberlasten.',
      'Pumpen können nicht beliebig hoch fördern — bei zu viel Förderhöhe sinkt der Förderstrom auf null.'
    ],
    quiz: {
      question: 'Eine Pumpe fördert 40 m³/h. Das Becken fasst 200 m³. Wie lange dauert eine Umwaelzung?',
      options: ['4 Stunden', '5 Stunden', '8 Stunden'],
      correctIndex: 1,
      explanation: '200 m³ ÷ 40 m³/h = 5 Stunden für eine komplette Umwaelzung.'
    }
  },

  förderstrom: {
    id: 'foerderstrom',
    chip: 'Förderstrom',
    title: 'Förderstrom Q und Umwaelzzeit berechnen',
    intro:
      'Der Förderstrom Q ist die wichtigste Kenngröße einer Pumpe. Er sagt dir, wie viel Wasser pro Stunde bewegt wird. Die Formel ist einfach: Q = V ÷ t. Volumen geteilt durch Zeit. Damit berechnest du auch die Umwaelzzeit — also wie lange es dauert, bis das ganze Beckenwasser einmal durch die Aufbereitung gelaufen ist.',
    motto: 'Q = V geteilt durch t — Volumen durch Zeit.',
    rules: [
      'Die Grundformel lautet: Q = V ÷ t (Förderstrom = Volumen geteilt durch Zeit).',
      'Umgestellt: t = V ÷ Q (Zeit = Volumen geteilt durch Förderstrom).',
      'Umgestellt: V = Q × t (Volumen = Förderstrom mal Zeit).',
      'Die Einheiten müssen passen: Q in m³/h, V in m³, t in Stunden.',
      'Die Umwaelzzeit ist die Zeit für eine komplette Umwaelzung: t = Beckenvolumen ÷ Förderstrom.'
    ],
    steps: [
      {
        title: '1. Werte aufschreiben',
        text: 'Schreib auf was du kennst: Beckenvolumen V in m³ und entweder den Förderstrom Q oder die gewuenschte Umwaelzzeit t.'
      },
      {
        title: '2. Richtige Formel wählen',
        text: 'Förderstrom gesucht? Q = V ÷ t. Zeit gesucht? t = V ÷ Q. Volumen gesucht? V = Q × t.'
      },
      {
        title: '3. Einsetzen und rechnen',
        text: 'Setze die Werte ein und rechne. Achte darauf, dass die Einheiten stimmen — keine Minuten mit Stunden mischen!'
      },
      {
        title: '4. Ergebnis prüfen',
        text: 'Ein Schwimmerbecken sollte in 4-6 Stunden umgewaelzt werden. Wenn dein Ergebnis 20 Stunden sagt, stimmt etwas nicht.'
      }
    ],
    examples: [
      {
        title: 'Förderstrom berechnen',
        given: 'Ein Becken hat 300 m³ Wasser und soll in 6 Stunden einmal umgewaelzt werden.',
        question: 'Welchen Förderstrom braucht die Pumpe?',
        steps: [
          ['Formel', 'Q = V ÷ t'],
          ['Einsetzen', 'Q = 300 m³ ÷ 6 h'],
          ['Rechnung', 'Q = 50 m³/h'],
          ['Ergebnis', 'Die Pumpe muss 50 m³/h fördern']
        ]
      },
      {
        title: 'Umwaelzzeit berechnen',
        given: 'Ein Lehrschwimmbecken hat 180 m³. Die Pumpe fördert 60 m³/h.',
        question: 'Wie lange dauert eine Umwaelzung?',
        steps: [
          ['Formel', 't = V ÷ Q'],
          ['Einsetzen', 't = 180 m³ ÷ 60 m³/h'],
          ['Rechnung', 't = 3 Stunden'],
          ['Ergebnis', 'Die Umwaelzung dauert 3 Stunden']
        ]
      },
      {
        title: 'Gefördertes Volumen berechnen',
        given: 'Eine Pumpe laeuft mit 45 m³/h und ist 8 Stunden in Betrieb.',
        question: 'Wie viel Wasser wurde insgesamt gefördert?',
        steps: [
          ['Formel', 'V = Q × t'],
          ['Einsetzen', 'V = 45 m³/h × 8 h'],
          ['Rechnung', 'V = 360 m³'],
          ['Ergebnis', 'In 8 Stunden wurden 360 m³ gefördert']
        ]
      }
    ],
    pitfalls: [
      'Einheiten nicht mischen: Wenn Q in m³/h ist, muss t in Stunden sein — nicht in Minuten!',
      'Wenn die Zeit in Minuten gegeben ist, erst in Stunden umrechnen: 90 Minuten = 1,5 Stunden.',
      'Die Umwaelzzeit ist NICHT die Betriebszeit der Pumpe — die Pumpe laeuft oft länger als eine Umwaelzung.',
      'Bei mehreren Becken: Jedes Becken hat seinen eigenen Kreislauf und seine eigene Umwaelzzeit!'
    ],
    quiz: {
      question: 'Ein Becken hat 240 m³. Die Umwaelzzeit soll 4 Stunden betragen. Welchen Förderstrom Q braucht die Pumpe?',
      options: ['40 m³/h', '60 m³/h', '80 m³/h'],
      correctIndex: 1,
      explanation: 'Q = V ÷ t = 240 m³ ÷ 4 h = 60 m³/h.'
    }
  },

  leistung: {
    id: 'leistung',
    chip: 'Leistung',
    title: 'Pumpenleistung und Wirkungsgrad',
    intro:
      'Eine Pumpe braucht Energie, um Wasser zu bewegen. Die Leistung sagt dir, wie viel Energie pro Sekunde nötig ist. Aber keine Pumpe ist perfekt — ein Teil der Energie geht als Wärme und Reibung verloren. Das Verhältnis von nutzbarer zu aufgenommener Leistung heisst Wirkungsgrad.',
    motto: 'Wirkungsgrad = Was rauskommt geteilt durch was reingesteckt wird.',
    rules: [
      'Die Nutzleistung (hydraulische Leistung) ist die Leistung, die tatsaechlich das Wasser bewegt.',
      'Die Antriebsleistung (elektrische Leistung) ist die Leistung, die der Motor aus dem Stromnetz zieht.',
      'Wirkungsgrad η (eta) = Nutzleistung ÷ Antriebsleistung (Ergebnis als Dezimalzahl oder Prozent).',
      'Ein Wirkungsgrad von 0,75 bedeutet: 75% der Energie wird genutzt, 25% gehen verloren.',
      'Gute Schwimmbadpumpen haben einen Wirkungsgrad von 70-85%.'
    ],
    steps: [
      {
        title: '1. Unterscheide die Leistungsarten',
        text: 'Nutzleistung P_nutz ist was die Pumpe an Wasserförderung leistet. Antriebsleistung P_an ist was der Motor an Strom verbraucht. P_an ist immer größer als P_nutz!'
      },
      {
        title: '2. Wirkungsgrad berechnen',
        text: 'η = P_nutz ÷ P_an. Beispiel: 3 kW Nutzleistung, 4 kW Antriebsleistung → η = 3 ÷ 4 = 0,75 = 75%.'
      },
      {
        title: '3. Antriebsleistung berechnen',
        text: 'Wenn du die Nutzleistung und den Wirkungsgrad kennst: P_an = P_nutz ÷ η. Die Antriebsleistung ist GROESSER als die Nutzleistung!'
      },
      {
        title: '4. Ergebnis einordnen',
        text: 'Unter 60% Wirkungsgrad: Pumpe tauschen oder warten. 70-85%: normaler Bereich. Über 85%: sehr gut.'
      }
    ],
    examples: [
      {
        title: 'Wirkungsgrad berechnen',
        given: 'Eine Pumpe hat eine Nutzleistung von 4,5 kW. Der Motor nimmt 6 kW auf.',
        question: 'Wie hoch ist der Wirkungsgrad?',
        steps: [
          ['Formel', 'η = P_nutz ÷ P_an'],
          ['Einsetzen', 'η = 4,5 kW ÷ 6 kW'],
          ['Rechnung', 'η = 0,75 = 75%'],
          ['Ergebnis', 'Der Wirkungsgrad beträgt 75%']
        ]
      },
      {
        title: 'Antriebsleistung berechnen',
        given: 'Eine Pumpe soll 3 kW Nutzleistung bringen. Der Wirkungsgrad ist 80% (0,8).',
        question: 'Welche Antriebsleistung muss der Motor haben?',
        steps: [
          ['Formel', 'P_an = P_nutz ÷ η'],
          ['Einsetzen', 'P_an = 3 kW ÷ 0,8'],
          ['Rechnung', 'P_an = 3,75 kW'],
          ['Ergebnis', 'Der Motor braucht mindestens 3,75 kW']
        ]
      },
      {
        title: 'Nutzleistung berechnen',
        given: 'Ein Pumpenmotor nimmt 5,5 kW auf. Der Wirkungsgrad liegt bei 70% (0,7).',
        question: 'Wie viel Nutzleistung hat die Pumpe?',
        steps: [
          ['Formel', 'P_nutz = P_an × η'],
          ['Einsetzen', 'P_nutz = 5,5 kW × 0,7'],
          ['Rechnung', 'P_nutz = 3,85 kW'],
          ['Ergebnis', 'Die Pumpe bringt 3,85 kW Nutzleistung']
        ]
      }
    ],
    pitfalls: [
      'Wirkungsgrad ist IMMER kleiner als 1 (bzw. kleiner als 100%) — wenn du mehr als 100% rausbekommst, hast du Zähler und Nenner vertauscht!',
      'Nutzleistung und Antriebsleistung nicht verwechseln: Die Antriebsleistung ist IMMER größer.',
      'Prozent und Dezimalzahl nicht mischen: 75% = 0,75. In der Formel immer die Dezimalzahl nehmen!',
      'Der Wirkungsgrad aendert sich mit der Belastung — bei Teillast ist er oft schlechter.'
    ],
    quiz: {
      question: 'Eine Pumpe hat 2,8 kW Nutzleistung bei einem Wirkungsgrad von 70%. Wie hoch ist die Antriebsleistung?',
      options: ['1,96 kW', '3,5 kW', '4,0 kW'],
      correctIndex: 2,
      explanation: 'P_an = P_nutz ÷ η = 2,8 kW ÷ 0,7 = 4,0 kW.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Pumpenberechnung im Bäderalltag',
    intro:
      'Hier kommen alle Formeln zusammen: Umwaelzpumpen dimensionieren, Umwaelzzeiten nach DIN einhalten, mehrere Pumpen parallel betreiben und Reservepumpen einplanen. Diese Aufgaben kommen in der Prüfung und im Arbeitsalltag vor!',
    motto: 'Die richtige Pumpe für das richtige Becken.',
    rules: [
      'DIN 19643 schreibt Umwaelzzeiten vor: Schwimmerbecken max. 4-6 Stunden, Nichtschwimmer max. 2-3 Stunden, Planschbecken max. 0,5-1 Stunde.',
      'Faustregel: Je flacher das Becken und je juenger die Badegaeste, desto kuerzer die Umwaelzzeit.',
      'Bei Parallelbetrieb zweier gleicher Pumpen addiert sich der Förderstrom: Q_gesamt = Q_1 + Q_2.',
      'Eine Reservepumpe (Redundanzpumpe) muss immer vorhanden sein — faellt die Hauptpumpe aus, springt sie ein.',
      'Die Pumpe muss zum Rohrnetz passen — zu viel Förderstrom erzeugt zu hohe Fliessgeschwindigkeiten.'
    ],
    steps: [
      {
        title: '1. Beckenvolumen berechnen',
        text: 'Länge × Breite × mittlere Tiefe = Volumen in m³. Beispiel: 25 m × 12,5 m × 1,8 m = 562,5 m³.'
      },
      {
        title: '2. Umwaelzzeit nach DIN wählen',
        text: 'Schwimmerbecken: 4-6 h. Nichtschwimmer: 2-3 h. Planschbecken: 0,5-1 h. Bei hoher Besucherzahl den kuerzeren Wert nehmen!'
      },
      {
        title: '3. Förderstrom berechnen',
        text: 'Q = V ÷ t. Beispiel: 562,5 m³ ÷ 4,5 h = 125 m³/h. Das ist der minimale Förderstrom.'
      },
      {
        title: '4. Pumpe auswählen und prüfen',
        text: 'Die Pumpe muss den Förderstrom bei der errechneten Förderhöhe liefern können. Dazu kommt eine Reservepumpe gleicher Größe.'
      }
    ],
    examples: [
      {
        title: 'Schwimmerbecken dimensionieren',
        given: 'Ein 25-m-Schwimmerbecken: 25 m × 12,5 m × 1,8 m = 562,5 m³. Geforderte Umwaelzzeit: 4,5 Stunden.',
        question: 'Welchen Förderstrom braucht die Umwaelzpumpe?',
        steps: [
          ['Volumen', '25 × 12,5 × 1,8 = 562,5 m³'],
          ['Formel', 'Q = V ÷ t'],
          ['Rechnung', 'Q = 562,5 ÷ 4,5 = 125 m³/h'],
          ['Ergebnis', 'Die Pumpe muss mindestens 125 m³/h fördern']
        ]
      },
      {
        title: 'Planschbecken mit kurzer Umwaelzzeit',
        given: 'Ein Planschbecken hat 15 m³ Wasser. Die Umwaelzzeit muss nach DIN max. 30 Minuten betragen.',
        question: 'Welchen Förderstrom braucht die Pumpe?',
        steps: [
          ['Umrechnung', '30 Minuten = 0,5 Stunden'],
          ['Formel', 'Q = V ÷ t'],
          ['Rechnung', 'Q = 15 m³ ÷ 0,5 h = 30 m³/h'],
          ['Ergebnis', 'Die Pumpe braucht mindestens 30 m³/h']
        ]
      },
      {
        title: 'Zwei Pumpen im Parallelbetrieb',
        given: 'Zwei gleiche Pumpen mit je 80 m³/h laufen parallel. Das Becken hat 400 m³.',
        question: 'Wie lange dauert eine Umwaelzung?',
        steps: [
          ['Gesamtförderstrom', 'Q = 80 + 80 = 160 m³/h'],
          ['Formel', 't = V ÷ Q'],
          ['Rechnung', 't = 400 ÷ 160 = 2,5 Stunden'],
          ['Ergebnis', 'Mit zwei Pumpen dauert eine Umwaelzung 2,5 Stunden']
        ]
      },
      {
        title: 'Reservepumpe: Was passiert bei Ausfall?',
        given: 'Ein Becken mit 300 m³ wird von 2 Pumpen (je 75 m³/h) versorgt. Eine Pumpe faellt aus.',
        question: 'Wie lange dauert die Umwaelzung jetzt?',
        steps: [
          ['Normalbetrieb', 'Q = 75 + 75 = 150 m³/h → t = 300 ÷ 150 = 2 h'],
          ['Pumpenausfall', 'Q = 75 m³/h (nur noch eine Pumpe)'],
          ['Neue Umwaelzzeit', 't = 300 ÷ 75 = 4 Stunden'],
          ['Ergebnis', 'Die Umwaelzzeit verdoppelt sich auf 4 Stunden — Reservepumpe muss schnell anlaufen!']
        ]
      }
    ],
    pitfalls: [
      'Minuten und Stunden nicht verwechseln! Planschbecken: 30 Minuten = 0,5 Stunden, nicht "30" in die Formel einsetzen.',
      'Die DIN-Umwaelzzeiten sind Hoechstwerte — kuerzere Zeiten sind besser, längere sind NICHT erlaubt.',
      'Bei Parallelbetrieb: Zwei Pumpen liefern nicht immer exakt die doppelte Menge — der Rohrleitungswiderstand steigt.',
      'Die Reservepumpe zählt NICHT zum regulaeren Förderstrom — sie ist nur für den Notfall da!'
    ],
    quiz: {
      question: 'Ein Nichtschwimmerbecken hat 120 m³. Die Umwaelzzeit soll 3 Stunden betragen. Welchen Förderstrom braucht die Pumpe?',
      options: ['30 m³/h', '40 m³/h', '60 m³/h'],
      correctIndex: 1,
      explanation: 'Q = V ÷ t = 120 m³ ÷ 3 h = 40 m³/h.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'förderstrom', 'leistung', 'praxis'];

/* ─── Key formulas comparison table ────────────────────────────────────────── */

const FORMULAS = [
  ['Größe', 'Formel', 'Einheit'],
  ['Förderstrom Q', 'Q = V ÷ t', 'm³/h'],
  ['Umwaelzzeit t', 't = V ÷ Q', 'Stunden (h)'],
  ['Volumen V', 'V = Q × t', 'm³'],
  ['Wirkungsgrad η', 'η = P_nutz ÷ P_an', '% oder Dezimal'],
  ['Antriebsleistung', 'P_an = P_nutz ÷ η', 'kW']
];

/* ─── DIN reference table ──────────────────────────────────────────────────── */

const DIN_TABLE = [
  ['Beckenart', 'Umwaelzzeit'],
  ['Schwimmerbecken', '4 – 6 Stunden'],
  ['Nichtschwimmerbecken', '2 – 3 Stunden'],
  ['Springerbecken', '4 – 6 Stunden'],
  ['Lehrschwimmbecken', '2 – 3 Stunden'],
  ['Planschbecken', '0,5 – 1 Stunde'],
  ['Warmsprudelbecken (Whirlpool)', '0,5 Stunden']
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

export default function PumpenDeepDiveView() {
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

          {/* Formulas table (on förderstrom and leistung tabs) */}
          {(activeTab === 'förderstrom' || activeTab === 'leistung') && (
            <InfoCard darkMode={darkMode} title="Alle Formeln im Ueberblick">
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
                    {FORMULAS.slice(1).map(([größe, formel, einheit]) => (
                      <tr key={größe} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {größe}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-teal-300' : 'bg-white text-teal-700'}`}>
                          {formel}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {einheit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* DIN table (on grundlagen and praxis tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="DIN 19643 — Umwaelzzeiten">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {DIN_TABLE[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DIN_TABLE.slice(1).map(([beckenart, zeit]) => (
                      <tr key={beckenart} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {beckenart}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {zeit}
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
