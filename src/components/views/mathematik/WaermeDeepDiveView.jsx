import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was ist Wärmeenergie?',
    intro:
      'Wenn du ein Schwimmbecken aufheizen willst, brauchst du Energie. Diese Energie heisst Wärmeenergie. Je mehr Wasser du aufheizen willst und je größer der Temperaturunterschied ist, desto mehr Energie brauchst du. Das ist logisch — aber wie rechnet man das genau aus?',
    motto: 'Wärme ist Energie, die Wasser wärmer macht.',
    rules: [
      'Temperatur und Wärme sind NICHT das gleiche — Temperatur misst man in °C, Wärme ist Energie in kWh.',
      'Um Wasser aufzuheizen, braucht man immer Energie — die kommt aus Gas, Strom, Sonne oder Fernwärme.',
      'Je MEHR Wasser du hast, desto mehr Energie brauchst du für die gleiche Erwaermung.',
      'Je GROESSER der Temperaturunterschied, desto mehr Energie brauchst du.',
      'Die Einheit für Wärmeenergie im Schwimmbad ist die Kilowattstunde (kWh).'
    ],
    steps: [
      {
        title: '1. Temperatur verstehen',
        text: 'Temperatur sagt dir, wie warm oder kalt etwas ist. Sie wird in Grad Celsius (°C) gemessen. Beispiel: Beckenwasser hat 26 °C, Leitungswasser hat 12 °C.'
      },
      {
        title: '2. Wärmeenergie verstehen',
        text: 'Wärmeenergie ist die Menge an Energie, die du brauchst, um Wasser wärmer zu machen. Mehr Wasser oder größerer Temperaturunterschied = mehr Energie.'
      },
      {
        title: '3. Temperaturdifferenz berechnen',
        text: 'Die Temperaturdifferenz (Delta T oder ΔT) ist der Unterschied zwischen Zieltemperatur und Starttemperatur: ΔT = Ziel - Start. Beispiel: 28 °C - 12 °C = 16 K (Kelvin).'
      },
      {
        title: '4. Die Einheit kWh',
        text: 'kWh steht für Kilowattstunde. Das ist die gaengige Einheit für Energie im Schwimmbad. Deine Gasrechnung oder Stromrechnung wird auch in kWh abgerechnet.'
      }
    ],
    examples: [
      {
        title: 'Temperatur vs. Wärme',
        given: 'Ein Eimer mit 10 Litern hat 20 °C. Ein Schwimmbecken mit 500 m³ hat auch 20 °C.',
        question: 'Wo steckt mehr Wärmeenergie drin?',
        steps: [
          ['Temperatur Eimer', '20 °C'],
          ['Temperatur Becken', '20 °C — gleiche Temperatur!'],
          ['Wassermenge', 'Becken hat 50.000 mal mehr Wasser'],
          ['Ergebnis', 'Das Becken hat viel mehr Wärmeenergie, obwohl die Temperatur gleich ist']
        ]
      },
      {
        title: 'Temperaturdifferenz berechnen',
        given: 'Frischwasser kommt mit 10 °C an. Das Becken soll 28 °C haben.',
        question: 'Wie gross ist die Temperaturdifferenz?',
        steps: [
          ['Zieltemperatur', '28 °C'],
          ['Starttemperatur', '10 °C'],
          ['Rechnung', '28 °C - 10 °C = 18 K'],
          ['Ergebnis', 'Das Wasser muss um 18 K (Kelvin) erwaermt werden']
        ]
      }
    ],
    pitfalls: [
      'Temperatur und Wärme verwechseln — heisses Wasser im Eimer hat hohe Temperatur aber wenig Wärmeenergie!',
      'Die Temperaturdifferenz wird in Kelvin (K) angegeben, nicht in °C — aber 1 K = 1 °C Unterschied.',
      'Vergiss nicht: Auch das Becken verliert Wärme (an die Luft, an den Boden) — du musst also mehr heizen als nur die Differenz.',
      'kWh ist NICHT das gleiche wie kW. kW ist Leistung (wie schnell), kWh ist Energie (wie viel).'
    ],
    quiz: {
      question: 'Frischwasser hat 8 °C. Das Becken soll 26 °C haben. Wie gross ist die Temperaturdifferenz?',
      options: ['34 K', '18 K', '8 K'],
      correctIndex: 1,
      explanation: '26 °C - 8 °C = 18 K. Immer Zieltemperatur minus Starttemperatur!'
    }
  },

  berechnung: {
    id: 'berechnung',
    chip: 'Berechnung',
    title: 'Die Formel: Q = 1,16 × m³ × ΔT',
    intro:
      'Die wichtigste Formel für Wärmeberechnungen im Schwimmbad ist ganz einfach: Q = 1,16 × Wassermenge in m³ × Temperaturdifferenz in K. Das Ergebnis ist die benötigte Energie in kWh. Die Zahl 1,16 ist der "magische Faktor" für Wasser.',
    motto: '1,16 ist die magische Zahl für Wasser.',
    rules: [
      'Die Formel lautet: Q = 1,16 × m³ × ΔT — das Ergebnis ist in kWh.',
      '1,16 ist ein fester Wert speziell für Wasser — er aendert sich nie.',
      'm³ ist die Wassermenge in Kubikmetern (1 m³ = 1.000 Liter).',
      'ΔT ist die Temperaturdifferenz in Kelvin (Zieltemperatur minus Starttemperatur).',
      'Einfach merken: Drei Zahlen multiplizieren — fertig!'
    ],
    steps: [
      {
        title: '1. Wassermenge bestimmen',
        text: 'Wie viel Wasser willst du aufheizen? Die Menge muss in m³ (Kubikmeter) sein. Wenn du Liter hast, teile durch 1.000. Beispiel: 25.000 Liter = 25 m³.'
      },
      {
        title: '2. Temperaturdifferenz berechnen',
        text: 'ΔT = Zieltemperatur - Starttemperatur. Beispiel: Becken soll 28 °C haben, Wasser kommt mit 12 °C an: ΔT = 28 - 12 = 16 K.'
      },
      {
        title: '3. In die Formel einsetzen',
        text: 'Q = 1,16 × m³ × ΔT. Beispiel: Q = 1,16 × 25 × 16 = 464 kWh. Einfach drei Zahlen multiplizieren!'
      },
      {
        title: '4. Ergebnis prüfen',
        text: 'Macht das Ergebnis Sinn? Grosses Becken + grosser Temperaturunterschied = viel Energie. Kleines Becken + kleiner Unterschied = wenig Energie.'
      }
    ],
    examples: [
      {
        title: 'Kleines Becken aufheizen',
        given: 'Ein Lehrschwimmbecken hat 100 m³ Wasser mit 20 °C. Es soll auf 30 °C erwaermt werden.',
        question: 'Wie viel Energie wird benötigt?',
        steps: [
          ['Wassermenge', '100 m³'],
          ['Temperaturdifferenz', '30 °C - 20 °C = 10 K'],
          ['Formel', 'Q = 1,16 × 100 × 10'],
          ['Ergebnis', 'Q = 1.160 kWh']
        ]
      },
      {
        title: 'Grosses Sportbecken',
        given: 'Ein Sportbecken hat 2.000 m³ Wasser. Die Temperatur soll von 24 °C auf 27 °C angehoben werden.',
        question: 'Wie viel Energie braucht man?',
        steps: [
          ['Wassermenge', '2.000 m³'],
          ['Temperaturdifferenz', '27 °C - 24 °C = 3 K'],
          ['Formel', 'Q = 1,16 × 2.000 × 3'],
          ['Ergebnis', 'Q = 6.960 kWh']
        ]
      },
      {
        title: 'Whirlpool aufheizen',
        given: 'Ein Whirlpool hat 5 m³ Wasser bei 15 °C. Zieltemperatur: 37 °C.',
        question: 'Wie viel Energie wird benötigt?',
        steps: [
          ['Wassermenge', '5 m³'],
          ['Temperaturdifferenz', '37 °C - 15 °C = 22 K'],
          ['Formel', 'Q = 1,16 × 5 × 22'],
          ['Ergebnis', 'Q = 127,6 kWh']
        ]
      }
    ],
    pitfalls: [
      'Die 1,16 NICHT vergessen — ohne sie stimmt das Ergebnis nicht!',
      'Wassermenge MUSS in m³ sein — wenn Liter gegeben sind, erst durch 1.000 teilen.',
      'ΔT ist immer Ziel MINUS Start — nicht umgekehrt!',
      'Die Formel gilt nur für Wasser — andere Stoffe haben andere Faktoren.'
    ],
    quiz: {
      question: 'Ein Becken hat 200 m³ Wasser. Es soll von 18 °C auf 26 °C erwaermt werden. Wie viel Energie?',
      options: ['1.392 kWh', '1.856 kWh', '2.320 kWh'],
      correctIndex: 1,
      explanation: 'ΔT = 26 - 18 = 8 K. Q = 1,16 × 200 × 8 = 1.856 kWh.'
    }
  },

  temperaturdifferenz: {
    id: 'temperaturdifferenz',
    chip: 'Temperaturdifferenz',
    title: 'ΔT — der Unterschied machts',
    intro:
      'Die Temperaturdifferenz (ΔT, sprich: "Delta T") ist der Unterschied zwischen zwei Temperaturen. Das ist NICHT die Temperatur selbst, sondern wie viel wärmer oder kaelter etwas werden soll. Im Schwimmbad brauchst du ΔT ständig: beim Aufheizen, beim Nachheizen, bei der Energieberechnung.',
    motto: 'ΔT ist der Unterschied, nicht die Temperatur.',
    rules: [
      'ΔT = Zieltemperatur minus Starttemperatur — IMMER in dieser Reihenfolge.',
      'ΔT wird in Kelvin (K) angegeben — aber 1 K ist genauso gross wie 1 °C.',
      'ΔT ist NICHT die Temperatur selbst — es ist die DIFFERENZ (der Unterschied).',
      'Je größer ΔT, desto mehr Energie brauchst du zum Aufheizen.',
      'ΔT kann auch negativ sein (beim Abkuehlen), aber im Schwimmbad heizen wir meistens auf.'
    ],
    steps: [
      {
        title: '1. Starttemperatur bestimmen',
        text: 'Wie warm ist das Wasser jetzt? Das ist deine Starttemperatur. Beispiel: Frischwasser aus der Leitung hat 10 °C.'
      },
      {
        title: '2. Zieltemperatur bestimmen',
        text: 'Wie warm soll das Wasser werden? Das ist deine Zieltemperatur. Beispiel: Das Schwimmerbecken soll 26 °C haben.'
      },
      {
        title: '3. Differenz berechnen',
        text: 'Ziel minus Start: 26 °C - 10 °C = 16 K. Das Wasser muss um 16 Kelvin erwaermt werden.'
      },
      {
        title: '4. Einheit beachten',
        text: 'Das Ergebnis schreibst du in Kelvin (K), nicht in °C. Aber keine Sorge: 1 K = 1 °C Unterschied. Es ist nur eine andere Bezeichnung für Differenzen.'
      }
    ],
    examples: [
      {
        title: 'Frischwasser aufheizen',
        given: 'Frischwasser kommt mit 8 °C ins Bad. Das Sportbecken braucht 26 °C.',
        question: 'Wie gross ist ΔT?',
        steps: [
          ['Zieltemperatur', '26 °C'],
          ['Starttemperatur', '8 °C'],
          ['Rechnung', '26 - 8 = 18'],
          ['Ergebnis', 'ΔT = 18 K']
        ]
      },
      {
        title: 'Beckenwasser nachheizen',
        given: 'Über Nacht ist das Wasser von 28 °C auf 25 °C abgekuehlt. Es soll wieder auf 28 °C.',
        question: 'Wie gross ist ΔT?',
        steps: [
          ['Zieltemperatur', '28 °C'],
          ['Starttemperatur', '25 °C'],
          ['Rechnung', '28 - 25 = 3'],
          ['Ergebnis', 'ΔT = 3 K — deutlich weniger als bei Frischwasser!']
        ]
      },
      {
        title: 'Babybecken aufheizen',
        given: 'Das Planschbecken hat aktuell 30 °C. Für Babyschwimmen braucht man 34 °C.',
        question: 'Wie gross ist ΔT?',
        steps: [
          ['Zieltemperatur', '34 °C'],
          ['Starttemperatur', '30 °C'],
          ['Rechnung', '34 - 30 = 4'],
          ['Ergebnis', 'ΔT = 4 K']
        ]
      }
    ],
    pitfalls: [
      'ΔT ist NICHT die Temperatur — sondern die DIFFERENZ! 26 °C ist eine Temperatur, 18 K ist eine Differenz.',
      'Nicht Start minus Ziel rechnen — dann bekommst du ein negatives Ergebnis. Immer Ziel minus Start!',
      'Kelvin und Celsius NICHT verwechseln: Temperaturen in °C, Differenzen in K.',
      'Im Winter ist ΔT größer (kaltes Frischwasser), im Sommer kleiner — das beeinflusst die Heizkosten!'
    ],
    quiz: {
      question: 'Frischwasser hat 12 °C. Das Becken soll 30 °C warm sein. Wie gross ist ΔT?',
      options: ['12 K', '18 K', '30 K'],
      correctIndex: 1,
      explanation: 'ΔT = 30 - 12 = 18 K. Immer Zieltemperatur minus Starttemperatur.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Wärme im Bäderalltag',
    intro:
      'Hier uebst du die Wärmeberechnung mit echten Aufgaben aus dem Schwimmbad. Becken aufheizen nach Wasserwechsel, Energiekosten berechnen, Heizarten vergleichen — das alles kommt in der Prüfung dran und brauchst du im Arbeitsalltag!',
    motto: 'Im Bad dreht sich alles um warmes Wasser.',
    rules: [
      'Ein Lehrschwimmbecken (ca. 100–200 m³) bei 30 °C braucht deutlich mehr Heizenergie als man denkt.',
      'Nach einem kompletten Wasserwechsel ist die Aufheizung am teuersten — deshalb wechselt man nur wenn nötig.',
      'Die Formel Q = 1,16 × m³ × ΔT gilt für die reine Aufheizung — Wärmeverluste kommen noch dazu.',
      'Energiekosten: kWh × Preis pro kWh (z.B. 0,10 Euro für Gas, 0,35 Euro für Strom).',
      'Solarheizung ist "gratis" (nach der Anschaffung), Gas und Strom kosten laufend Geld.'
    ],
    steps: [
      {
        title: '1. Aufgabe lesen',
        text: 'Was ist gegeben? Wassermenge (m³), Starttemperatur, Zieltemperatur? Wird nach Energie (kWh) oder nach Kosten (Euro) gefragt?'
      },
      {
        title: '2. ΔT berechnen',
        text: 'Zieltemperatur minus Starttemperatur. Bei Frischwasser ist die Starttemperatur das kalte Leitungswasser (ca. 8–15 °C je nach Jahreszeit).'
      },
      {
        title: '3. Formel anwenden',
        text: 'Q = 1,16 × m³ × ΔT. Drei Zahlen multiplizieren — fertig ist die benötigte Energie in kWh.'
      },
      {
        title: '4. Ggf. Kosten berechnen',
        text: 'Wenn nach Kosten gefragt wird: Energie (kWh) × Preis pro kWh = Kosten in Euro.'
      }
    ],
    examples: [
      {
        title: 'Lehrschwimmbecken nach Wasserwechsel',
        given: 'Ein Lehrschwimmbecken hat 150 m³. Nach dem Wasserwechsel hat das Frischwasser 10 °C. Zieltemperatur: 30 °C.',
        question: 'Wie viel Energie braucht die Aufheizung?',
        steps: [
          ['Wassermenge', '150 m³'],
          ['ΔT', '30 - 10 = 20 K'],
          ['Formel', 'Q = 1,16 × 150 × 20'],
          ['Ergebnis', 'Q = 3.480 kWh']
        ]
      },
      {
        title: 'Energiekosten mit Gas',
        given: 'Ein Sportbecken (600 m³) soll von 22 °C auf 27 °C erwaermt werden. Gaspreis: 0,10 Euro/kWh.',
        question: 'Was kostet die Aufheizung?',
        steps: [
          ['ΔT', '27 - 22 = 5 K'],
          ['Energie', 'Q = 1,16 × 600 × 5 = 3.480 kWh'],
          ['Kosten', '3.480 × 0,10 Euro = 348 Euro'],
          ['Ergebnis', 'Die Aufheizung kostet 348 Euro an Gas']
        ]
      },
      {
        title: 'Freibad-Becken im Fruehling',
        given: 'Das Freibadbecken hat 1.200 m³. Im Mai hat das Wasser 14 °C. Ziel: 24 °C. Gaspreis: 0,10 Euro/kWh.',
        question: 'Wie viel kostet das Aufheizen?',
        steps: [
          ['ΔT', '24 - 14 = 10 K'],
          ['Energie', 'Q = 1,16 × 1.200 × 10 = 13.920 kWh'],
          ['Kosten', '13.920 × 0,10 = 1.392 Euro'],
          ['Ergebnis', 'Das Aufheizen kostet 1.392 Euro — deshalb nutzen viele Freibäder Solaranlagen!']
        ]
      },
      {
        title: 'Solar vs. Gas: Vergleich',
        given: 'Ein Becken braucht 5.000 kWh zum Aufheizen. Gas kostet 0,10 Euro/kWh. Die Solaranlage ist bereits installiert.',
        question: 'Wie viel spart die Solaranlage?',
        steps: [
          ['Gaskosten', '5.000 × 0,10 = 500 Euro'],
          ['Solarkosten', 'Laufende Kosten: ca. 0 Euro (Sonne ist gratis)'],
          ['Ersparnis', '500 Euro pro Aufheizung'],
          ['Ergebnis', 'Solar spart 500 Euro — aber die Anlage muss erst angeschafft werden']
        ]
      }
    ],
    pitfalls: [
      'Die Formel gibt nur die REINE Aufheizenergie — Wärmeverluste durch Verdunstung, Abstrahlung und Beckenwand kommen noch dazu!',
      'Im Winter ist das Frischwasser kaelter (ca. 5–8 °C), im Sommer wärmer (ca. 12–18 °C) — ΔT aendert sich mit der Jahreszeit.',
      'Nicht vergessen: Nach dem Aufheizen muss das Becken auch WARM GEHALTEN werden — das kostet täglich Energie.',
      'Bei der Prüfung genau lesen: Wird nach kWh oder nach Euro gefragt? Das sind zwei verschiedene Dinge!'
    ],
    quiz: {
      question: 'Ein Becken hat 400 m³ Wasser bei 15 °C. Zieltemperatur 27 °C. Wie viel Energie braucht man?',
      options: ['4.640 kWh', '5.568 kWh', '6.264 kWh'],
      correctIndex: 1,
      explanation: 'ΔT = 27 - 15 = 12 K. Q = 1,16 × 400 × 12 = 5.568 kWh.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'berechnung', 'temperaturdifferenz', 'praxis'];

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

/* ─── Formula display ──────────────────────────────────────────────────────── */

const FORMULA_PARTS = [
  ['Q', 'Wärmeenergie in kWh'],
  ['1,16', 'Faktor für Wasser (fest)'],
  ['m³', 'Wassermenge in Kubikmetern'],
  ['ΔT', 'Temperaturdifferenz in Kelvin']
];

/* ─── Main component ────────────────────────────────────────────────────────── */

export default function WärmeDeepDiveView() {
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

          {/* Formula card (on berechnung and praxis tabs) */}
          {(activeTab === 'berechnung' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Formel-Übersicht">
              <div className={`rounded-xl border p-4 text-center ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                <div className={`text-xl font-bold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                  Q = 1,16 × m³ × ΔT
                </div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Ergebnis in kWh
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {FORMULA_PARTS.map(([symbol, desc]) => (
                  <div key={symbol} className="flex items-center gap-3">
                    <span className={`inline-block w-10 text-center text-sm font-bold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                      {symbol}
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </InfoCard>
          )}

          {/* Quick reference (on grundlagen and temperaturdifferenz tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'temperaturdifferenz') && (
            <InfoCard darkMode={darkMode} title="Schnell-Check: Einheiten">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Temperatur
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Wird in Grad Celsius (°C) angegeben. Beispiel: 28 °C Wassertemperatur.
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Temperaturdifferenz
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Wird in Kelvin (K) angegeben. 1 K = 1 °C Unterschied. Beispiel: ΔT = 18 K.
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Wärmeenergie
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Wird in Kilowattstunden (kWh) angegeben. Das steht auch auf der Gasrechnung.
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
