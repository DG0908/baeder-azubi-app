import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was ist der Dreisatz?',
    intro:
      'Der Dreisatz ist die wichtigste Rechenmethode in der Ausbildung. Du rechnest in genau drei Schritten von einer bekannten Groesse auf eine unbekannte. Ob Chlor-Dosierung, Wasserverbrauch oder Materialkosten — der Dreisatz funktioniert immer gleich.',
    motto: 'Drei Schritte, ein Ergebnis.',
    rules: [
      'Der Dreisatz besteht IMMER aus genau 3 Schritten — daher der Name.',
      'Du brauchst immer ein Wertepaar das zusammengehoert (z.B. 3 Stueck kosten 6 Euro).',
      'Im zweiten Schritt rechnest du auf 1 Einheit runter.',
      'Im dritten Schritt rechnest du auf die Zielmenge hoch.',
      'Es gibt zwei Arten: proportional (gerader) und antiproportional (umgekehrter) Dreisatz.'
    ],
    steps: [
      {
        title: '1. Aufschreiben was du weisst',
        text: 'Schreib die zwei Werte auf, die zusammengehoeren. Zum Beispiel: 5 Packungen kosten 20 Euro. Das ist dein Startpunkt.'
      },
      {
        title: '2. Auf 1 runterrechnen',
        text: 'Teile durch die bekannte Menge: 20 Euro geteilt durch 5 Packungen = 4 Euro pro Packung. Jetzt weisst du, was EINE Einheit wert ist.'
      },
      {
        title: '3. Auf den Zielwert hochrechnen',
        text: 'Nimm den Einzelwert mal die gewuenschte Menge: 4 Euro mal 8 Packungen = 32 Euro. Fertig!'
      },
      {
        title: '4. Ergebnis pruefen',
        text: 'Macht das Ergebnis Sinn? 8 Packungen sind mehr als 5, also muss der Preis auch hoeher sein. 32 Euro ist mehr als 20 Euro — passt!'
      }
    ],
    examples: [
      {
        title: 'Einfaches Beispiel: Einkauf',
        given: '5 Packungen Chlortabletten kosten 20 Euro.',
        question: 'Was kosten 8 Packungen?',
        steps: [
          ['Was wir wissen', '5 Packungen = 20 Euro'],
          ['Auf 1 rechnen', '20 Euro ÷ 5 = 4 Euro pro Packung'],
          ['Auf 8 rechnen', '4 Euro × 8 = 32 Euro'],
          ['Ergebnis', '8 Packungen kosten 32 Euro']
        ]
      },
      {
        title: 'Baeder-Beispiel: Wasserverbrauch',
        given: 'In 3 Stunden fliessen 90 m³ Wasser durch den Filter.',
        question: 'Wie viel Wasser in 7 Stunden?',
        steps: [
          ['Was wir wissen', '3 Stunden = 90 m³'],
          ['Auf 1 Stunde', '90 ÷ 3 = 30 m³ pro Stunde'],
          ['Auf 7 Stunden', '30 × 7 = 210 m³'],
          ['Ergebnis', 'In 7 Stunden fliessen 210 m³']
        ]
      }
    ],
    pitfalls: [
      'NICHT direkt von 5 auf 8 springen — immer erst auf 1 rechnen!',
      'Die Einheiten muessen zusammenpassen (nicht Stunden mit Minuten mischen).',
      'Schreib die Einheit IMMER dazu, sonst weisst du spaeter nicht mehr was die Zahl bedeutet.',
      'Ueberlege VOR dem Rechnen: Muss das Ergebnis groesser oder kleiner werden?'
    ],
    quiz: {
      question: '4 Sack Filtersand wiegen 100 kg. Wie viel wiegen 7 Saecke?',
      options: ['150 kg', '175 kg', '200 kg'],
      correctIndex: 1,
      explanation: '100 ÷ 4 = 25 kg pro Sack. 25 × 7 = 175 kg.'
    }
  },

  proportional: {
    id: 'proportional',
    chip: 'Proportional',
    title: 'Proportionaler Dreisatz — je mehr, desto mehr',
    intro:
      'Beim proportionalen (geraden) Dreisatz gilt: Wenn die eine Groesse groesser wird, wird die andere auch groesser. Mehr Chlortabletten = mehr Kosten. Mehr Stunden = mehr Wasserverbrauch. Das ist der haeufigste Fall im Alltag.',
    motto: 'Mehr von dem einen = mehr von dem anderen.',
    rules: [
      'Proportional heisst: Beide Werte aendern sich in die GLEICHE Richtung.',
      'Doppelte Menge = doppelter Preis. Dreifache Menge = dreifacher Preis.',
      'Erkennungsmerkmal: "Je mehr ... desto mehr" oder "je weniger ... desto weniger".',
      'Beim Rechnen: Erst teilen (auf 1), dann malnehmen (auf Ziel).',
      'Die meisten Dreisatz-Aufgaben in der Pruefung sind proportional.'
    ],
    steps: [
      {
        title: '1. Ist es proportional?',
        text: 'Frage dich: Wenn ich mehr davon nehme, wird das Ergebnis dann auch mehr? Beispiel: Mehr Badegaeste = mehr Einnahmen? Ja! Also proportional.'
      },
      {
        title: '2. Wertepaar aufschreiben',
        text: 'Links die Menge, rechts den zugehoerigen Wert. Z.B.: 6 Stunden → 180 m³ Wasser.'
      },
      {
        title: '3. Auf 1 Einheit teilen',
        text: '180 m³ ÷ 6 Stunden = 30 m³ pro Stunde. BEIDE Seiten durch die gleiche Zahl teilen!'
      },
      {
        title: '4. Mit Zielmenge malnehmen',
        text: '30 m³ × 10 Stunden = 300 m³. BEIDE Seiten mit der gleichen Zahl malnehmen!'
      }
    ],
    examples: [
      {
        title: 'Chlor-Dosierung',
        given: 'Fuer 200 m³ Beckenwasser braucht man 60 g Aktivchlor.',
        question: 'Wie viel braucht man fuer 350 m³?',
        steps: [
          ['Bekannt', '200 m³ → 60 g Aktivchlor'],
          ['Auf 1 m³', '60 g ÷ 200 = 0,3 g pro m³'],
          ['Auf 350 m³', '0,3 g × 350 = 105 g'],
          ['Ergebnis', 'Fuer 350 m³ braucht man 105 g Aktivchlor']
        ]
      },
      {
        title: 'Eintrittsgelder',
        given: 'An einem Tag mit 120 Besuchern werden 600 Euro eingenommen.',
        question: 'Wie viel bringen 200 Besucher?',
        steps: [
          ['Bekannt', '120 Besucher → 600 Euro'],
          ['Auf 1 Besucher', '600 ÷ 120 = 5 Euro pro Besucher'],
          ['Auf 200 Besucher', '5 × 200 = 1.000 Euro'],
          ['Ergebnis', '200 Besucher bringen 1.000 Euro']
        ]
      },
      {
        title: 'Materialbestellung',
        given: '3 Eimer Fluessigchlor reichen fuer 12 Tage.',
        question: 'Wie viele Eimer braucht man fuer 40 Tage?',
        steps: [
          ['Bekannt', '3 Eimer → 12 Tage'],
          ['Auf 1 Tag', '3 ÷ 12 = 0,25 Eimer pro Tag'],
          ['Auf 40 Tage', '0,25 × 40 = 10 Eimer'],
          ['Ergebnis', 'Fuer 40 Tage braucht man 10 Eimer']
        ]
      }
    ],
    pitfalls: [
      'Pruefe IMMER zuerst ob es wirklich proportional ist — nicht alles ist "je mehr desto mehr"!',
      'Typischer Fehler: Die Aufgabe ist eigentlich antiproportional, wird aber proportional gerechnet.',
      'Wenn das Ergebnis unlogisch wirkt (z.B. weniger Chlor fuer ein groesseres Becken), hast du wahrscheinlich die falsche Art gewaehlt.',
      'Beim Teilen und Malnehmen immer BEIDE Seiten gleich behandeln.'
    ],
    quiz: {
      question: '8 Liter Reinigungsmittel reichen fuer 400 m² Flaeche. Wie viel braucht man fuer 600 m²?',
      options: ['10 Liter', '12 Liter', '14 Liter'],
      correctIndex: 1,
      explanation: '8 ÷ 400 = 0,02 Liter pro m². 0,02 × 600 = 12 Liter.'
    }
  },

  antiproportional: {
    id: 'antiproportional',
    chip: 'Antiproportional',
    title: 'Antiproportionaler Dreisatz — je mehr, desto weniger',
    intro:
      'Manchmal ist es umgekehrt: Mehr Arbeiter brauchen WENIGER Zeit. Mehr Pumpen = schneller fertig. Das ist der antiproportionale (umgekehrte) Dreisatz. Hier musst du anders rechnen!',
    motto: 'Mehr von dem einen = weniger von dem anderen.',
    rules: [
      'Antiproportional heisst: Wenn eine Groesse steigt, sinkt die andere.',
      'Erkennungsmerkmal: "Je mehr ... desto weniger" oder "je weniger ... desto mehr".',
      'Beispiel: 2 Pumpen brauchen 6 Stunden. 3 Pumpen brauchen WENIGER als 6 Stunden!',
      'Trick: Du rechnest auf 1, aber dann TEILST du statt zu malnehmen.',
      'Oder du merkst dir: Erst auf 1 rechnen (malnehmen!), dann auf die Zielmenge (teilen!).'
    ],
    steps: [
      {
        title: '1. Ist es antiproportional?',
        text: 'Frage dich: Wenn ich mehr davon nehme, wird das Ergebnis dann WENIGER? Beispiel: Mehr Arbeiter → weniger Tage? Ja! Also antiproportional.'
      },
      {
        title: '2. Gesamtaufwand berechnen',
        text: 'Beim antiproportionalen Dreisatz gibt es einen Gesamtaufwand: z.B. 2 Arbeiter × 6 Stunden = 12 Arbeitsstunden insgesamt.'
      },
      {
        title: '3. Durch die neue Menge teilen',
        text: 'Jetzt teilst du den Gesamtaufwand durch die neue Groesse: 12 Arbeitsstunden ÷ 3 Arbeiter = 4 Stunden.'
      },
      {
        title: '4. Ergebnis pruefen',
        text: 'Mehr Arbeiter als vorher? Dann MUSS die Zeit kuerzer sein. 4 < 6 — passt!'
      }
    ],
    examples: [
      {
        title: 'Arbeiter und Zeit',
        given: '4 Mitarbeiter brauchen 6 Stunden fuer die Beckensaeuberung.',
        question: 'Wie lange brauchen 8 Mitarbeiter?',
        steps: [
          ['Bekannt', '4 Mitarbeiter → 6 Stunden'],
          ['Gesamtaufwand', '4 × 6 = 24 Arbeitsstunden'],
          ['Durch neue Menge', '24 ÷ 8 = 3 Stunden'],
          ['Ergebnis', '8 Mitarbeiter brauchen nur 3 Stunden']
        ]
      },
      {
        title: 'Pumpen und Umwaelzzeit',
        given: '2 Pumpen brauchen 8 Stunden, um das Becken einmal umzuwaelzen.',
        question: 'Wie lange brauchen 4 Pumpen?',
        steps: [
          ['Bekannt', '2 Pumpen → 8 Stunden'],
          ['Gesamtaufwand', '2 × 8 = 16 Pumpenstunden'],
          ['Durch neue Menge', '16 ÷ 4 = 4 Stunden'],
          ['Ergebnis', '4 Pumpen brauchen nur 4 Stunden']
        ]
      },
      {
        title: 'Fahrzeuge und Fahrten',
        given: '3 Fahrzeuge brauchen 10 Fahrten, um Material zu transportieren.',
        question: 'Wie viele Fahrten brauchen 5 Fahrzeuge?',
        steps: [
          ['Bekannt', '3 Fahrzeuge → 10 Fahrten'],
          ['Gesamtaufwand', '3 × 10 = 30 Fahrzeug-Fahrten'],
          ['Durch neue Menge', '30 ÷ 5 = 6 Fahrten'],
          ['Ergebnis', '5 Fahrzeuge brauchen nur 6 Fahrten']
        ]
      }
    ],
    pitfalls: [
      'Den haeufigsten Fehler: Proportional und antiproportional verwechseln! Frag dich IMMER: Wird es mehr oder weniger?',
      'Beim Antiproportionalen wird im 2. Schritt MALGENOMMEN (nicht geteilt wie beim proportionalen).',
      'Im 3. Schritt wird GETEILT (nicht malgenommen wie beim proportionalen).',
      'Merkhilfe: Proportional = ÷ dann × | Antiproportional = × dann ÷'
    ],
    quiz: {
      question: '6 Mitarbeiter brauchen 5 Tage fuer die Revision. Wie viele Tage brauchen 10 Mitarbeiter?',
      options: ['2 Tage', '3 Tage', '4 Tage'],
      correctIndex: 1,
      explanation: 'Gesamtaufwand: 6 × 5 = 30 Arbeitstage. 30 ÷ 10 = 3 Tage.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Dreisatz im Baederalltag',
    intro:
      'Hier uebst du den Dreisatz mit echten Aufgaben aus dem Schwimmbad. Chlor dosieren, Wassermengen berechnen, Kosten kalkulieren — alles mit dem Dreisatz. Diese Aufgaben kommen in der Pruefung dran!',
    motto: 'Im Bad brauchst du den Dreisatz jeden Tag.',
    rules: [
      'Im Baederalltag sind die meisten Aufgaben proportional (mehr Wasser = mehr Chlor).',
      'Antiproportionale Aufgaben kommen bei Arbeitszeit und Personal vor.',
      'IMMER die Einheiten mitschreiben — mg/L, m³, Gramm, Stunden.',
      'Tipp: 1 mg/L = 1 g/m³ — diese Umrechnung brauchst du staendig!',
      'Bei Pruefungsaufgaben: Erst lesen, dann entscheiden ob proportional oder antiproportional.'
    ],
    steps: [
      {
        title: '1. Aufgabe lesen und sortieren',
        text: 'Was ist gegeben? Was ist gesucht? Schreib beides auf. Dann entscheide: proportional oder antiproportional?'
      },
      {
        title: '2. Tabelle anlegen',
        text: 'Schreib links die Mengenangabe, rechts den zugehoerigen Wert. Beispiel: Links m³, rechts Gramm Chlor.'
      },
      {
        title: '3. Dreisatz durchrechnen',
        text: 'Proportional: ÷ auf 1, dann × auf Ziel. Antiproportional: × den Gesamtaufwand, dann ÷ durch neue Menge.'
      },
      {
        title: '4. Plausibilitaets-Check',
        text: 'Groesseres Becken = mehr Chlor? Mehr Mitarbeiter = weniger Zeit? Stimmt die Richtung, stimmt meistens auch die Rechnung.'
      }
    ],
    examples: [
      {
        title: 'Chlor-Dosierung (proportional)',
        given: 'Fuer 300 m³ Beckenwasser werden 90 g Aktivchlor benoetigt (0,3 mg/L Anhebung).',
        question: 'Wie viel Aktivchlor braucht ein 500 m³ Becken?',
        steps: [
          ['Bekannt', '300 m³ → 90 g Aktivchlor'],
          ['Auf 1 m³', '90 ÷ 300 = 0,3 g pro m³'],
          ['Auf 500 m³', '0,3 × 500 = 150 g'],
          ['Ergebnis', '150 g Aktivchlor fuer 500 m³']
        ]
      },
      {
        title: 'Filteranlage (proportional)',
        given: 'Die Filteranlage schafft in 4 Stunden 120 m³ Wasser.',
        question: 'Wie viel schafft sie in einer 8-Stunden-Schicht?',
        steps: [
          ['Bekannt', '4 Stunden → 120 m³'],
          ['Auf 1 Stunde', '120 ÷ 4 = 30 m³/h'],
          ['Auf 8 Stunden', '30 × 8 = 240 m³'],
          ['Ergebnis', 'In 8 Stunden schafft die Anlage 240 m³']
        ]
      },
      {
        title: 'Revision (antiproportional)',
        given: '3 Fachangestellte brauchen 8 Tage fuer die Jahresrevision.',
        question: 'Wie lange dauert es mit 6 Fachangestellten?',
        steps: [
          ['Bekannt', '3 Leute → 8 Tage'],
          ['Gesamtaufwand', '3 × 8 = 24 Personentage'],
          ['Durch 6 Leute', '24 ÷ 6 = 4 Tage'],
          ['Ergebnis', 'Mit 6 Leuten dauert es nur 4 Tage']
        ]
      },
      {
        title: 'Kosten (proportional)',
        given: '25 kg pH-Senker kosten 45 Euro.',
        question: 'Was kosten 60 kg?',
        steps: [
          ['Bekannt', '25 kg → 45 Euro'],
          ['Auf 1 kg', '45 ÷ 25 = 1,80 Euro pro kg'],
          ['Auf 60 kg', '1,80 × 60 = 108 Euro'],
          ['Ergebnis', '60 kg pH-Senker kosten 108 Euro']
        ]
      }
    ],
    pitfalls: [
      'In der Pruefung: Lies GENAU was gefragt ist — manchmal wird nach dem Preis gefragt, manchmal nach der Menge.',
      'Bei Chlor: Nicht vergessen, dass das Produkt weniger als 100% Wirkstoff hat!',
      'Taschenrechner-Tipp: Zwischenergebnisse aufschreiben, nicht im Kopf behalten.',
      'Antiproportionale Aufgaben erkennt man oft an Woertern wie "Arbeiter", "Maschinen", "gemeinsam".'
    ],
    quiz: {
      question: '5 Schwimmmeister ueberwachen eine Veranstaltung in 4 Stunden. Wie viele Stunden brauchen 10 Schwimmmeister?',
      options: ['2 Stunden', '8 Stunden', '20 Stunden'],
      correctIndex: 0,
      explanation: 'Antiproportional! 5 × 4 = 20 Gesamtstunden. 20 ÷ 10 = 2 Stunden.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'proportional', 'antiproportional', 'praxis'];

/* ─── Comparison table for proportional vs antiproportional ─────────────────── */

const COMPARISON = [
  ['Anderer Name', 'Gerader Dreisatz', 'Umgekehrter Dreisatz'],
  ['Richtung', 'Mehr → mehr', 'Mehr → weniger'],
  ['Erkennungssatz', '"Je mehr, desto mehr"', '"Je mehr, desto weniger"'],
  ['Schritt 2', 'Teilen (÷)', 'Malnehmen (×)'],
  ['Schritt 3', 'Malnehmen (×)', 'Teilen (÷)'],
  ['Baeder-Beispiel', 'Mehr Wasser → mehr Chlor', 'Mehr Pumpen → weniger Zeit']
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

export default function DreisatzDeepDiveView() {
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

          {/* Comparison table (only on proportional or antiproportional tabs) */}
          {(activeTab === 'proportional' || activeTab === 'antiproportional') && (
            <InfoCard darkMode={darkMode} title="Vergleich: Proportional vs. Antiproportional">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`} />
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Proportional
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                        Antiproportional
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map(([label, prop, anti]) => (
                      <tr key={label} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {label}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {prop}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {anti}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Quick decision helper (on grundlagen and praxis tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Schnell-Check: Welcher Dreisatz?">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Proportional?
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Frag dich: &quot;Wenn ich MEHR nehme, wird es dann auch MEHR?&quot;
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Mehr Wasser → mehr Chlor? JA → proportional
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Antiproportional?
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Frag dich: &quot;Wenn ich MEHR nehme, wird es dann WENIGER?&quot;
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Mehr Arbeiter → weniger Tage? JA → antiproportional
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
