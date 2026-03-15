import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Kraft, Arbeit und Leistung — die Basics',
    intro:
      'In der Physik beschreiben Kraft, Arbeit und Leistung, wie Dinge bewegt werden. Das brauchst du im Schwimmbad staendig: Pumpen druecken Wasser durch Filter, Motoren bewegen Beckenabdeckungen, und du selbst hebst schwere Kanister. Hier lernst du die drei Grundbegriffe kennen.',
    motto: 'Kraft bewegt, Arbeit misst den Aufwand, Leistung misst die Geschwindigkeit.',
    rules: [
      'Kraft wird in Newton (N) gemessen — benannt nach Isaac Newton.',
      'Arbeit wird in Joule (J) gemessen — sie entsteht, wenn eine Kraft ueber eine Strecke wirkt.',
      'Leistung wird in Watt (W) gemessen — sie sagt, wie schnell Arbeit verrichtet wird.',
      'Die Erdanziehung erzeugt pro Kilogramm etwa 10 Newton Kraft (genau: 9,81 N).',
      'Merke: Kraft allein ist noch keine Arbeit — erst wenn sich etwas BEWEGT, wird Arbeit verrichtet.'
    ],
    steps: [
      {
        title: '1. Kraft verstehen',
        text: 'Kraft ist ein Schubsen oder Ziehen. Wenn du einen 10-kg-Kanister hochhebst, wirkt eine Kraft von etwa 100 Newton (10 kg × 10 N/kg). Die Einheit ist Newton (N).'
      },
      {
        title: '2. Arbeit verstehen',
        text: 'Arbeit = Kraft × Weg. Wenn du den 10-kg-Kanister (100 N) einen Meter hochhebst, verrichtest du 100 Joule Arbeit (100 N × 1 m = 100 J).'
      },
      {
        title: '3. Leistung verstehen',
        text: 'Leistung = Arbeit geteilt durch Zeit. Wenn du die 100 Joule in 2 Sekunden schaffst, ist deine Leistung 50 Watt (100 J ÷ 2 s = 50 W). Schneller arbeiten = mehr Leistung.'
      },
      {
        title: '4. Alltags-Vergleich',
        text: 'Eine normale Gluehbirne hat 60 Watt. Das heisst, sie verbraucht 60 Joule pro Sekunde. Ein Foehntrocknerhaar hat ca. 2.000 Watt — der zieht richtig Strom!'
      }
    ],
    examples: [
      {
        title: 'Kanister hochheben',
        given: 'Ein Chlorkanister wiegt 25 kg. Du hebst ihn 0,8 m auf die Ablage.',
        question: 'Wie viel Arbeit verrichtest du?',
        steps: [
          ['Kraft berechnen', '25 kg × 10 N/kg = 250 N'],
          ['Arbeit berechnen', 'W = F × s = 250 N × 0,8 m = 200 J'],
          ['Ergebnis', 'Du verrichtest 200 Joule Arbeit']
        ]
      },
      {
        title: 'Vergleich: schnell vs. langsam',
        given: 'Du verrichtest 200 J Arbeit. Einmal in 2 Sekunden, einmal in 4 Sekunden.',
        question: 'Wie unterscheidet sich die Leistung?',
        steps: [
          ['Schnell', 'P = 200 J ÷ 2 s = 100 W'],
          ['Langsam', 'P = 200 J ÷ 4 s = 50 W'],
          ['Ergebnis', 'Doppelt so schnell = doppelte Leistung']
        ]
      }
    ],
    pitfalls: [
      'Kraft und Arbeit sind NICHT dasselbe — Kraft allein ohne Bewegung ergibt keine Arbeit.',
      'Newton (Kraft) nicht mit Joule (Arbeit) verwechseln.',
      'Leistung ist NICHT wie viel, sondern wie SCHNELL Arbeit gemacht wird.',
      'Gewichtskraft: Immer Masse × 10 rechnen (nicht vergessen!).'
    ],
    quiz: {
      question: 'Ein Sack Filtersand wiegt 25 kg und wird 2 m hochgehoben. Wie viel Arbeit ist das?',
      options: ['250 Joule', '500 Joule', '50 Joule'],
      correctIndex: 1,
      explanation: 'Kraft = 25 kg × 10 = 250 N. Arbeit = 250 N × 2 m = 500 J.'
    }
  },

  kraftArbeit: {
    id: 'kraftArbeit',
    chip: 'Kraft & Arbeit',
    title: 'Kraft (F) und Arbeit (W) berechnen',
    intro:
      'Kraft wird in Newton gemessen und Arbeit in Joule. Die Formel ist einfach: W = F × s (Arbeit = Kraft mal Weg). Im Schwimmbad brauchst du das, wenn du Abdeckungen schiebst, Geraete hebst oder berechnen musst, wie viel Energie eine Pumpe braucht.',
    motto: 'W = F × s — Arbeit gleich Kraft mal Weg.',
    rules: [
      'Die Formel lautet: W = F × s (Arbeit = Kraft × Strecke).',
      'Kraft in Newton (N), Strecke in Metern (m), Arbeit in Joule (J).',
      'Gewichtskraft: F = m × g, wobei g ≈ 10 N/kg (Erdbeschleunigung).',
      '1 Newton ist ungefaehr die Kraft, die ein 100-g-Apfel auf deine Hand aususebt.',
      'Umstellen: F = W ÷ s und s = W ÷ F — immer die gesuchte Groesse freistellen.'
    ],
    steps: [
      {
        title: '1. Kraft bestimmen',
        text: 'Wenn du die Masse hast (z.B. 30 kg), rechne die Kraft aus: F = 30 kg × 10 = 300 N. Wenn die Kraft direkt gegeben ist, schreib sie auf.'
      },
      {
        title: '2. Strecke ablesen',
        text: 'Lies die Strecke aus der Aufgabe ab. Achte auf die Einheit — immer in Metern rechnen! 50 cm = 0,5 m.'
      },
      {
        title: '3. Arbeit berechnen',
        text: 'Multipliziere Kraft mal Strecke: W = F × s. Einheit ist Joule (J). Beispiel: 300 N × 2 m = 600 J.'
      },
      {
        title: '4. Ergebnis pruefen',
        text: 'Ist die Zahl realistisch? Einen 30-kg-Sack 2 m hochheben ergibt 600 J. Zum Vergleich: Eine Tafel Schokolade liefert ca. 2 Millionen Joule Energie.'
      }
    ],
    examples: [
      {
        title: 'Beckenabdeckung schieben',
        given: 'Die Beckenabdeckung wird mit 400 N ueber 12 m geschoben.',
        question: 'Wie viel Arbeit wird verrichtet?',
        steps: [
          ['Kraft', 'F = 400 N (gegeben)'],
          ['Strecke', 's = 12 m (gegeben)'],
          ['Arbeit', 'W = 400 N × 12 m = 4.800 J'],
          ['Ergebnis', 'Es werden 4.800 Joule (4,8 kJ) Arbeit verrichtet']
        ]
      },
      {
        title: 'pH-Senker-Sack hochheben',
        given: 'Ein Sack pH-Senker wiegt 20 kg. Er wird 1,5 m auf ein Regal gehoben.',
        question: 'Wie viel Arbeit ist noetig?',
        steps: [
          ['Kraft berechnen', 'F = 20 kg × 10 = 200 N'],
          ['Strecke', 's = 1,5 m'],
          ['Arbeit', 'W = 200 N × 1,5 m = 300 J'],
          ['Ergebnis', 'Es werden 300 Joule Arbeit verrichtet']
        ]
      },
      {
        title: 'Umstellen: Kraft gesucht',
        given: 'Beim Schieben eines Reinigungswagens wird 900 J Arbeit verrichtet. Der Weg ist 15 m.',
        question: 'Wie gross war die Kraft?',
        steps: [
          ['Formel umstellen', 'F = W ÷ s'],
          ['Einsetzen', 'F = 900 J ÷ 15 m = 60 N'],
          ['Ergebnis', 'Die Schiebekraft betraegt 60 Newton']
        ]
      }
    ],
    pitfalls: [
      'Strecke IMMER in Metern angeben — Zentimeter vorher umrechnen (÷ 100)!',
      'Gewichtskraft nicht vergessen: Masse ist NICHT gleich Kraft. Erst × 10 rechnen!',
      'Wenn du schiebst, zaehlt nur die Kraft IN Bewegungsrichtung.',
      'Kilojoule (kJ) = 1.000 Joule. Bei grossen Zahlen umrechnen!'
    ],
    quiz: {
      question: 'Eine Pumpe drueckt mit 500 N Kraft Wasser durch eine 3 m lange Leitung. Wie viel Arbeit?',
      options: ['1.500 Joule', '1.000 Joule', '500 Joule'],
      correctIndex: 0,
      explanation: 'W = F × s = 500 N × 3 m = 1.500 J.'
    }
  },

  leistung: {
    id: 'leistung',
    chip: 'Leistung',
    title: 'Leistung (P) — wie schnell wird gearbeitet?',
    intro:
      'Leistung sagt dir, wie schnell Arbeit erledigt wird. Die Einheit ist Watt (W). Ein starker Motor hat viel Watt, weil er in kurzer Zeit viel Arbeit schafft. Im Schwimmbad siehst du Watt-Angaben auf jeder Pumpe, jedem Foehr und jeder Heizung.',
    motto: 'P = W ÷ t — Leistung gleich Arbeit durch Zeit.',
    rules: [
      'Die Formel lautet: P = W ÷ t (Leistung = Arbeit ÷ Zeit).',
      'Leistung in Watt (W), Arbeit in Joule (J), Zeit in Sekunden (s).',
      '1 Watt = 1 Joule pro Sekunde.',
      '1 Kilowatt (kW) = 1.000 Watt. Pumpen haben oft 2-5 kW.',
      'Umstellen: W = P × t (Arbeit = Leistung × Zeit) und t = W ÷ P.'
    ],
    steps: [
      {
        title: '1. Arbeit bestimmen',
        text: 'Berechne zuerst die Arbeit mit W = F × s (falls nicht direkt gegeben). Ergebnis in Joule.'
      },
      {
        title: '2. Zeit bestimmen',
        text: 'Lies die Zeit aus der Aufgabe. Achtung: Immer in Sekunden rechnen! 1 Minute = 60 Sekunden, 1 Stunde = 3.600 Sekunden.'
      },
      {
        title: '3. Leistung berechnen',
        text: 'Teile Arbeit durch Zeit: P = W ÷ t. Beispiel: 3.600 J ÷ 60 s = 60 W.'
      },
      {
        title: '4. In kW umrechnen',
        text: 'Bei grossen Zahlen: Watt ÷ 1.000 = Kilowatt. Beispiel: 2.500 W = 2,5 kW. Auf Pumpen steht oft kW.'
      }
    ],
    examples: [
      {
        title: 'Motor hebt Beckenabdeckung',
        given: 'Ein Motor verrichtet 6.000 J Arbeit in 30 Sekunden.',
        question: 'Welche Leistung hat der Motor?',
        steps: [
          ['Arbeit', 'W = 6.000 J (gegeben)'],
          ['Zeit', 't = 30 s (gegeben)'],
          ['Leistung', 'P = 6.000 J ÷ 30 s = 200 W'],
          ['Ergebnis', 'Der Motor hat 200 Watt (0,2 kW) Leistung']
        ]
      },
      {
        title: 'Umwaelzpumpe — Arbeit berechnen',
        given: 'Eine Pumpe hat 3 kW Leistung und laeuft 2 Stunden.',
        question: 'Wie viel Arbeit verrichtet sie?',
        steps: [
          ['Leistung umrechnen', '3 kW = 3.000 W'],
          ['Zeit umrechnen', '2 Stunden = 7.200 Sekunden'],
          ['Arbeit', 'W = P × t = 3.000 W × 7.200 s = 21.600.000 J'],
          ['Ergebnis', '21.600.000 J = 21.600 kJ = 6 kWh']
        ]
      },
      {
        title: 'Gluehbirne vs. LED',
        given: 'Eine Gluehbirne hat 60 W, eine LED hat 8 W. Beide leuchten 5 Stunden.',
        question: 'Wie viel Arbeit (Energie) verbraucht jede?',
        steps: [
          ['Zeit umrechnen', '5 h = 18.000 s'],
          ['Gluehbirne', 'W = 60 × 18.000 = 1.080.000 J = 0,3 kWh'],
          ['LED', 'W = 8 × 18.000 = 144.000 J = 0,04 kWh'],
          ['Ergebnis', 'Die Gluehbirne braucht fast 8-mal so viel Energie!']
        ]
      }
    ],
    pitfalls: [
      'Zeit IMMER in Sekunden umrechnen — Minuten und Stunden vorher umwandeln!',
      'Watt (Leistung) nicht mit Wattstunde (Energie) verwechseln! kWh = kW × Stunden.',
      'Auf Typenschildern steht oft kW — das muss fuer Formeln in W umgerechnet werden (× 1.000).',
      'Merke: 1 kWh = 3.600.000 J — das ist die Einheit auf deiner Stromrechnung.'
    ],
    quiz: {
      question: 'Eine Pumpe verrichtet 12.000 J Arbeit in 1 Minute. Welche Leistung hat sie?',
      options: ['12.000 Watt', '200 Watt', '120 Watt'],
      correctIndex: 1,
      explanation: '1 Minute = 60 Sekunden. P = 12.000 J ÷ 60 s = 200 W.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Mechanik im Baederalltag',
    intro:
      'Im Schwimmbad begegnen dir Kraft, Arbeit und Leistung ueberall: Umwaelzpumpen mit Kilowatt-Angaben, Hubmotoren fuer Beckenabdeckungen, Heizkessel und Stromzaehler. Hier uebst du mit echten Aufgaben aus dem Baederalltag.',
    motto: 'Pumpen, Motoren, Energie — alles ist Mechanik.',
    rules: [
      'Umwaelzpumpen haben typisch 2 bis 7 kW Leistung.',
      'Energieverbrauch = Leistung × Laufzeit. Auf der Stromrechnung steht kWh.',
      'Hebeanlagen und Beckenabdeckungen: Kraft = Gewicht × 10, dann Arbeit = Kraft × Hubhoehe.',
      'Stromkosten berechnen: kWh × Preis pro kWh (ca. 0,30 Euro).',
      'Typenschilder an Geraeten zeigen immer die Nennleistung in Watt oder Kilowatt.'
    ],
    steps: [
      {
        title: '1. Typenschild lesen',
        text: 'Schau auf das Typenschild der Pumpe oder des Motors. Dort steht die Leistung in W oder kW. Beispiel: 4,0 kW = 4.000 W.'
      },
      {
        title: '2. Laufzeit bestimmen',
        text: 'Wie lange laeuft das Geraet? Im Schwimmbad laufen Pumpen oft 8-16 Stunden am Tag.'
      },
      {
        title: '3. Energieverbrauch berechnen',
        text: 'Leistung × Zeit = Energieverbrauch. Fuer kWh: kW × Stunden. Beispiel: 4 kW × 10 h = 40 kWh pro Tag.'
      },
      {
        title: '4. Kosten berechnen',
        text: 'kWh × Strompreis. Beispiel: 40 kWh × 0,30 Euro = 12 Euro pro Tag. Auf den Monat: 12 × 30 = 360 Euro!'
      }
    ],
    examples: [
      {
        title: 'Umwaelzpumpe — Tagesverbrauch',
        given: 'Die Umwaelzpumpe hat 5,5 kW und laeuft 14 Stunden am Tag.',
        question: 'Wie viel Energie verbraucht sie pro Tag und was kostet das?',
        steps: [
          ['Energie', '5,5 kW × 14 h = 77 kWh pro Tag'],
          ['Tageskosten', '77 kWh × 0,30 Euro = 23,10 Euro'],
          ['Monatskosten', '23,10 × 30 = 693 Euro'],
          ['Ergebnis', 'Die Pumpe kostet ca. 693 Euro pro Monat an Strom']
        ]
      },
      {
        title: 'Hubmotor fuer Beckenabdeckung',
        given: 'Die Beckenabdeckung wiegt 800 kg und wird 1,2 m angehoben. Der Motor braucht 40 Sekunden.',
        question: 'Welche Leistung braucht der Motor mindestens?',
        steps: [
          ['Kraft', 'F = 800 kg × 10 = 8.000 N'],
          ['Arbeit', 'W = 8.000 N × 1,2 m = 9.600 J'],
          ['Leistung', 'P = 9.600 J ÷ 40 s = 240 W'],
          ['Ergebnis', 'Der Motor braucht mindestens 240 W (0,24 kW)']
        ]
      },
      {
        title: 'Energievergleich: alte vs. neue Pumpe',
        given: 'Alte Pumpe: 7 kW, 12 h/Tag. Neue Pumpe: 4 kW, 12 h/Tag.',
        question: 'Wie viel spart die neue Pumpe pro Monat?',
        steps: [
          ['Alte Pumpe', '7 × 12 = 84 kWh/Tag → 84 × 30 = 2.520 kWh/Monat'],
          ['Neue Pumpe', '4 × 12 = 48 kWh/Tag → 48 × 30 = 1.440 kWh/Monat'],
          ['Ersparnis', '2.520 − 1.440 = 1.080 kWh/Monat'],
          ['In Euro', '1.080 × 0,30 = 324 Euro Ersparnis pro Monat']
        ]
      },
      {
        title: 'Filtersand-Lieferung',
        given: 'Ein Gabelstapler hebt 500 kg Filtersand 0,5 m hoch, 20 Mal am Tag.',
        question: 'Wie viel Gesamtarbeit verrichtet er?',
        steps: [
          ['Kraft pro Hub', 'F = 500 × 10 = 5.000 N'],
          ['Arbeit pro Hub', 'W = 5.000 × 0,5 = 2.500 J'],
          ['20 Mal', '2.500 × 20 = 50.000 J = 50 kJ'],
          ['Ergebnis', 'Der Stapler verrichtet 50 kJ Arbeit am Tag']
        ]
      }
    ],
    pitfalls: [
      'Auf Typenschildern steht manchmal VA statt W — das ist bei Motoren NICHT dasselbe!',
      'Vergiss nicht: Pumpen haben einen Wirkungsgrad. Ein 5-kW-Motor gibt nicht 5 kW an das Wasser ab.',
      'kWh ist Energie (Arbeit), kW ist Leistung. Nicht verwechseln — besonders auf der Stromrechnung!',
      'Bei Pruefungsaufgaben: Erst alle Werte in Grundeinheiten umrechnen (N, m, s, J, W).'
    ],
    quiz: {
      question: 'Eine 3-kW-Pumpe laeuft 8 Stunden. Strom kostet 0,30 Euro/kWh. Was kostet das?',
      options: ['7,20 Euro', '24,00 Euro', '2,40 Euro'],
      correctIndex: 0,
      explanation: '3 kW × 8 h = 24 kWh. 24 kWh × 0,30 Euro = 7,20 Euro.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'kraftArbeit', 'leistung', 'praxis'];

/* ─── Formulas overview table ──────────────────────────────────────────────── */

const FORMULAS = [
  ['Groesse', 'Formel', 'Einheit'],
  ['Kraft', 'F = m × g', 'Newton (N)'],
  ['Arbeit', 'W = F × s', 'Joule (J)'],
  ['Leistung', 'P = W ÷ t', 'Watt (W)'],
  ['Energie', 'E = P × t', 'kWh (Kilowattstunde)']
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

export default function MechanikDeepDiveView() {
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

          {/* Formulas table (on grundlagen and leistung tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'leistung') && (
            <InfoCard darkMode={darkMode} title="Alle Formeln auf einen Blick">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      {FORMULAS[0].map((header) => (
                        <th key={header} className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FORMULAS.slice(1).map(([groesse, formel, einheit]) => (
                      <tr key={groesse} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {groesse}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
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

          {/* Unit helper (on kraftArbeit and praxis tabs) */}
          {(activeTab === 'kraftArbeit' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Einheiten-Helfer">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Kraft
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    1 kg Masse = ca. 10 N Gewichtskraft
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    25 kg Sack → 250 N
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Arbeit
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    1 Joule = 1 Newton ueber 1 Meter
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    1.000 J = 1 kJ | 3.600.000 J = 1 kWh
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Leistung
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    1 Watt = 1 Joule pro Sekunde
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    1.000 W = 1 kW | Pumpen: 2-7 kW
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
