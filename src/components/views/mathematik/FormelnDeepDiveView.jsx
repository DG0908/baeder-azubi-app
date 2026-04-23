import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was sind Formeln?',
    intro:
      'Eine Formel ist wie ein Rezept — sie sagt dir, wie du mit Zahlen rechnen musst, um ein Ergebnis zu bekommen. Statt Zahlen stehen in Formeln Buchstaben. Jeder Buchstabe steht für eine bestimmte Größe. Zum Beispiel steht "v" für Geschwindigkeit und "t" für Zeit. Wenn du die Buchstaben durch Zahlen ersetzt, kannst du das Ergebnis ausrechnen.',
    motto: 'Buchstaben sind Platzhalter für Zahlen.',
    rules: [
      'Eine Formel ist eine Rechenanweisung mit Buchstaben statt Zahlen.',
      'Jeder Buchstabe steht für eine bestimmte Größe (z.B. v = Geschwindigkeit, s = Strecke, t = Zeit).',
      'Das Gleichheitszeichen (=) ist wie eine Waage — links und rechts muss immer gleich viel stehen.',
      'Die bekannteste Formel im Bad: v = s ÷ t (Geschwindigkeit = Strecke geteilt durch Zeit).',
      'Formeln funktionieren immer gleich — egal welche Zahlen du einsetzt.'
    ],
    steps: [
      {
        title: '1. Die Formel lesen',
        text: 'Schau dir die Formel an und ueberlege, wofür jeder Buchstabe steht. Bei v = s ÷ t ist v die Geschwindigkeit, s die Strecke und t die Zeit.'
      },
      {
        title: '2. Das Waage-Prinzip verstehen',
        text: 'Stell dir ein Gleichheitszeichen wie eine Waage vor. Was du auf einer Seite tust, musst du auch auf der anderen tun. Sonst kippt die Waage!'
      },
      {
        title: '3. Werte zuordnen',
        text: 'Lies die Aufgabe und schreib auf, welche Zahlen du für welche Buchstaben hast. Was ist gegeben? Was wird gesucht?'
      },
      {
        title: '4. Einsetzen und ausrechnen',
        text: 'Ersetze die Buchstaben durch die Zahlen und rechne aus. Vergiss die Einheiten nicht!'
      }
    ],
    examples: [
      {
        title: 'Geschwindigkeit im Schwimmbecken',
        given: 'Ein Schwimmer schwimmt 50 m in 25 Sekunden. Formel: v = s ÷ t',
        question: 'Wie schnell schwimmt er?',
        steps: [
          ['Formel', 'v = s ÷ t'],
          ['Werte zuordnen', 's = 50 m, t = 25 s'],
          ['Einsetzen', 'v = 50 ÷ 25'],
          ['Ergebnis', 'v = 2 m/s']
        ]
      },
      {
        title: 'Flächenberechnung Schwimmbecken',
        given: 'Ein Becken ist 25 m lang und 10 m breit. Formel: A = l × b',
        question: 'Wie gross ist die Wasserfläche?',
        steps: [
          ['Formel', 'A = l × b'],
          ['Werte zuordnen', 'l = 25 m, b = 10 m'],
          ['Einsetzen', 'A = 25 × 10'],
          ['Ergebnis', 'A = 250 m²']
        ]
      },
      {
        title: 'Förderstrom einer Pumpe',
        given: 'Eine Pumpe fördert 120 m³ Wasser in 4 Stunden. Formel: Q = V ÷ t',
        question: 'Wie gross ist der Förderstrom?',
        steps: [
          ['Formel', 'Q = V ÷ t'],
          ['Werte zuordnen', 'V = 120 m³, t = 4 h'],
          ['Einsetzen', 'Q = 120 ÷ 4'],
          ['Ergebnis', 'Q = 30 m³/h']
        ]
      }
    ],
    pitfalls: [
      'Buchstaben NICHT verwechseln — "v" ist Geschwindigkeit, "V" (gross) ist Volumen!',
      'Einheiten IMMER mitschreiben, sonst weisst du nicht was die Zahl bedeutet.',
      'Das Gleichheitszeichen heisst: Links und rechts ist der gleiche Wert — nicht "dann kommt"!',
      'Formeln auswendig lernen bringt nichts, wenn du nicht verstehst was die Buchstaben bedeuten.'
    ],
    quiz: {
      question: 'Was bedeutet die Formel v = s ÷ t?',
      options: ['Volumen = Strecke geteilt durch Temperatur', 'Geschwindigkeit = Strecke geteilt durch Zeit', 'Verbrauch = Summe geteilt durch Tage'],
      correctIndex: 1,
      explanation: 'v steht für Geschwindigkeit (velocity), s für Strecke und t für Zeit. Also: Geschwindigkeit = Strecke geteilt durch Zeit.'
    }
  },

  umstellen: {
    id: 'umstellen',
    chip: 'Umstellen',
    title: 'Formeln umstellen — die Gegenoperation',
    intro:
      'Manchmal kennst du das Ergebnis, aber dir fehlt ein anderer Wert. Dann musst du die Formel umstellen. Das heisst: Du bringst den gesuchten Buchstaben alleine auf eine Seite. Dafür nutzt du die Gegenoperation — was auf der einen Seite malgenommen wird, wird auf der anderen geteilt. Wie bei einer Waage: Was du auf einer Seite wegnimmst, musst du auf der anderen auch wegnehmen.',
    motto: 'Gegenoperation = den Buchstaben befreien.',
    rules: [
      'Ziel: Den gesuchten Buchstaben ALLEINE auf eine Seite bringen.',
      'Die Gegenoperation von × (malnehmen) ist ÷ (teilen) — und umgekehrt.',
      'Die Gegenoperation von + (plus) ist - (minus) — und umgekehrt.',
      'Was du auf einer Seite tust, musst du auf der anderen Seite AUCH tun (Waage-Prinzip!).',
      'IMMER zuerst die Formel umstellen, DANN erst Zahlen einsetzen.'
    ],
    steps: [
      {
        title: '1. Gesuchte Größe finden',
        text: 'Lies die Aufgabe: Was wird gesucht? Welcher Buchstabe muss alleine stehen? Beispiel: "Wie lang ist die Strecke?" → s muss alleine stehen.'
      },
      {
        title: '2. Formel aufschreiben',
        text: 'Schreib die Original-Formel hin. Beispiel: v = s ÷ t. Du suchst s, aber s steht nicht allein.'
      },
      {
        title: '3. Gegenoperation anwenden',
        text: 'Ueberlege: Wie ist der gesuchte Buchstabe "gefangen"? Bei v = s ÷ t ist s durch t geteilt. Gegenoperation: Beide Seiten × t. Ergebnis: v × t = s.'
      },
      {
        title: '4. Aufgeraeumte Formel hinschreiben',
        text: 'Schreib die neue Formel sauber auf: s = v × t. Jetzt steht s alleine — fertig umgestellt!'
      }
    ],
    examples: [
      {
        title: 'v = s ÷ t umstellen nach s',
        given: 'Originalformel: v = s ÷ t',
        question: 'Stelle nach s (Strecke) um!',
        steps: [
          ['Formel', 'v = s ÷ t'],
          ['s ist durch t geteilt', 'Gegenoperation: × t'],
          ['Beide Seiten × t', 'v × t = s'],
          ['Ergebnis', 's = v × t']
        ]
      },
      {
        title: 'v = s ÷ t umstellen nach t',
        given: 'Originalformel: v = s ÷ t',
        question: 'Stelle nach t (Zeit) um!',
        steps: [
          ['Formel', 'v = s ÷ t'],
          ['Erst × t auf beiden Seiten', 'v × t = s'],
          ['Dann ÷ v auf beiden Seiten', 't = s ÷ v'],
          ['Ergebnis', 't = s ÷ v']
        ]
      },
      {
        title: 'A = l × b umstellen nach b',
        given: 'Originalformel: A = l × b',
        question: 'Stelle nach b (Breite) um!',
        steps: [
          ['Formel', 'A = l × b'],
          ['b ist mit l malgenommen', 'Gegenoperation: ÷ l'],
          ['Beide Seiten ÷ l', 'A ÷ l = b'],
          ['Ergebnis', 'b = A ÷ l']
        ]
      }
    ],
    pitfalls: [
      'NIEMALS Zahlen einsetzen bevor die Formel umgestellt ist — das fuehrt zu Fehlern!',
      'Nicht vergessen: Was du links tust, musst du auch rechts tun. IMMER beide Seiten!',
      'Verwechsle nicht × und ÷ — wenn der Buchstabe malgenommen ist, musst du teilen (und umgekehrt).',
      'Tipp: Schreib dir eine "Umstell-Tabelle" — für jede Formel alle drei Varianten.'
    ],
    quiz: {
      question: 'Wie lautet v = s ÷ t umgestellt nach t?',
      options: ['t = v × s', 't = s ÷ v', 't = s × v'],
      correctIndex: 1,
      explanation: 'v = s ÷ t | Beide Seiten × t → v × t = s | Beide Seiten ÷ v → t = s ÷ v.'
    }
  },

  einsetzen: {
    id: 'einsetzen',
    chip: 'Einsetzen',
    title: 'Zahlen einsetzen — erst umstellen, dann rechnen',
    intro:
      'Nachdem du die Formel umgestellt hast, setzt du die Zahlen ein. IMMER in dieser Reihenfolge: Erst umstellen, dann einsetzen. Wenn du beides gleichzeitig machst, passieren Fehler. Denk dran: Die Formel ist der Plan, die Zahlen sind die Zutaten.',
    motto: 'Erst den Plan (Formel), dann die Zutaten (Zahlen).',
    rules: [
      'IMMER erst die Formel umstellen, DANN die Zahlen einsetzen.',
      'Schreib die umgestellte Formel in eine Zeile, die Zahlen in die nächste.',
      'Einheiten IMMER mitrechnen — sie helfen dir Fehler zu finden!',
      'Wenn die Einheit am Ende keinen Sinn ergibt, hast du falsch umgestellt.',
      'Taschenrechner erst NACH dem Einsetzen benutzen — nicht während dem Umstellen.'
    ],
    steps: [
      {
        title: '1. Formel umstellen',
        text: 'Stelle die Formel so um, dass der gesuchte Buchstabe alleine steht. Beispiel: Gesucht ist t, also t = s ÷ v.'
      },
      {
        title: '2. Werte aus der Aufgabe ablesen',
        text: 'Schreib auf welche Werte du hast: s = 100 m, v = 2 m/s. Achte auf die Einheiten!'
      },
      {
        title: '3. Zahlen einsetzen',
        text: 'Ersetze jeden Buchstaben durch seinen Wert: t = 100 m ÷ 2 m/s. Schreib die Einheiten mit!'
      },
      {
        title: '4. Ausrechnen und Einheit prüfen',
        text: 'Rechne aus: t = 50 s. Pruefe: m geteilt durch m/s gibt Sekunden — passt!'
      }
    ],
    examples: [
      {
        title: 'Zeit berechnen für Beckendurchschwimmen',
        given: 'Ein Schwimmer schwimmt mit v = 1,5 m/s. Das Becken ist s = 50 m lang.',
        question: 'Wie lange braucht er für eine Bahn?',
        steps: [
          ['Formel umstellen', 't = s ÷ v'],
          ['Werte einsetzen', 't = 50 m ÷ 1,5 m/s'],
          ['Ausrechnen', 't = 33,3 s'],
          ['Ergebnis', 'Er braucht ca. 33 Sekunden']
        ]
      },
      {
        title: 'Breite eines Beckens berechnen',
        given: 'Die Wasserfläche ist A = 312,5 m². Die Länge ist l = 25 m.',
        question: 'Wie breit ist das Becken?',
        steps: [
          ['Formel umstellen', 'b = A ÷ l'],
          ['Werte einsetzen', 'b = 312,5 m² ÷ 25 m'],
          ['Ausrechnen', 'b = 12,5 m'],
          ['Ergebnis', 'Das Becken ist 12,5 m breit']
        ]
      },
      {
        title: 'Volumen berechnen bei Förderstrom',
        given: 'Die Pumpe hat Q = 30 m³/h Förderstrom. Sie laeuft t = 8 Stunden.',
        question: 'Wie viel Wasser wird gefördert?',
        steps: [
          ['Formel umstellen', 'V = Q × t'],
          ['Werte einsetzen', 'V = 30 m³/h × 8 h'],
          ['Ausrechnen', 'V = 240 m³'],
          ['Ergebnis', 'Es werden 240 m³ Wasser gefördert']
        ]
      }
    ],
    pitfalls: [
      'Den häufigsten Fehler: Zahlen einsetzen BEVOR die Formel umgestellt ist — das geht fast immer schief!',
      'Einheiten vergessen — dann weisst du nicht ob das Ergebnis m³ oder Liter sind.',
      'Falsche Einheiten mischen: Stunden und Minuten, Meter und Zentimeter — VORHER umrechnen!',
      'Ergebnis nicht prüfen — frag dich immer: Macht die Zahl Sinn?'
    ],
    quiz: {
      question: 'Q = V ÷ t, gesucht ist V. V = 30 m³/h, t = 6 h. Wie gross ist V?',
      options: ['5 m³', '180 m³', '36 m³'],
      correctIndex: 1,
      explanation: 'V = Q × t = 30 m³/h × 6 h = 180 m³. (Achtung: In der Frage war Q = 30 m³/h gemeint.)'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Formeln im Bäderalltag',
    intro:
      'Im Schwimmbad brauchst du vier Formeln ständig: Geschwindigkeit (v = s ÷ t), Förderstrom (Q = V ÷ t), Fläche (A = l × b) und Filtergeschwindigkeit (vF = Q ÷ A). Hier uebst du alle vier mit echten Aufgaben aus dem Badalltag. Diese Formeln kommen garantiert in der Prüfung!',
    motto: 'Vier Formeln — das ganze Bad berechnen.',
    rules: [
      'v = s ÷ t → Geschwindigkeit = Strecke geteilt durch Zeit (z.B. Wasserstroemung).',
      'Q = V ÷ t → Förderstrom = Volumen geteilt durch Zeit (z.B. Pumpenleistung in m³/h).',
      'A = l × b → Fläche = Länge mal Breite (z.B. Beckenwasserfläche).',
      'vF = Q ÷ A → Filtergeschwindigkeit = Förderstrom geteilt durch Filterfläche (Richtwert: ca. 30 m/h).',
      'Jede dieser Formeln kann nach jedem Buchstaben umgestellt werden — uebe alle Varianten!'
    ],
    steps: [
      {
        title: '1. Aufgabe lesen: Welche Formel?',
        text: 'Lies die Aufgabe und entscheide: Geht es um Geschwindigkeit, Förderstrom, Fläche oder Filtergeschwindigkeit? Das bestimmt welche Formel du brauchst.'
      },
      {
        title: '2. Formel aufschreiben und umstellen',
        text: 'Schreib die passende Formel hin. Stelle sie nach der gesuchten Größe um. Beispiel: Förderstrom gesucht → Q = V ÷ t.'
      },
      {
        title: '3. Werte einsetzen und ausrechnen',
        text: 'Setze die gegebenen Zahlen mit Einheiten ein und rechne aus. Vergiss nicht: Einheiten müssen zusammenpassen!'
      },
      {
        title: '4. Ergebnis prüfen',
        text: 'Pruefe: Stimmt die Einheit? Macht der Wert Sinn? Filtergeschwindigkeit sollte ca. 20-40 m/h betragen, Förderstrom oft zwischen 20-100 m³/h.'
      }
    ],
    examples: [
      {
        title: 'Förderstrom einer Umwaelzpumpe',
        given: 'Die Pumpe fördert V = 480 m³ Wasser in t = 8 Stunden.',
        question: 'Wie gross ist der Förderstrom Q?',
        steps: [
          ['Formel', 'Q = V ÷ t'],
          ['Einsetzen', 'Q = 480 m³ ÷ 8 h'],
          ['Ausrechnen', 'Q = 60 m³/h'],
          ['Ergebnis', 'Der Förderstrom beträgt 60 m³/h']
        ]
      },
      {
        title: 'Filtergeschwindigkeit berechnen',
        given: 'Förderstrom Q = 60 m³/h, Filterfläche A = 2 m².',
        question: 'Wie gross ist die Filtergeschwindigkeit vF?',
        steps: [
          ['Formel', 'vF = Q ÷ A'],
          ['Einsetzen', 'vF = 60 m³/h ÷ 2 m²'],
          ['Ausrechnen', 'vF = 30 m/h'],
          ['Ergebnis', 'Die Filtergeschwindigkeit beträgt 30 m/h — im Normbereich!']
        ]
      },
      {
        title: 'Benötigte Filterfläche',
        given: 'Der Förderstrom ist Q = 90 m³/h. Die Filtergeschwindigkeit soll vF = 30 m/h betragen.',
        question: 'Wie gross muss die Filterfläche sein?',
        steps: [
          ['Formel umstellen', 'A = Q ÷ vF'],
          ['Einsetzen', 'A = 90 m³/h ÷ 30 m/h'],
          ['Ausrechnen', 'A = 3 m²'],
          ['Ergebnis', 'Die Filterfläche muss mindestens 3 m² betragen']
        ]
      },
      {
        title: 'Umwaelzzeit eines Beckens',
        given: 'Beckenvolumen V = 450 m³, Förderstrom Q = 75 m³/h.',
        question: 'Wie lange dauert eine komplette Umwaelzung?',
        steps: [
          ['Formel umstellen', 't = V ÷ Q'],
          ['Einsetzen', 't = 450 m³ ÷ 75 m³/h'],
          ['Ausrechnen', 't = 6 h'],
          ['Ergebnis', 'Eine Umwaelzung dauert 6 Stunden']
        ]
      }
    ],
    pitfalls: [
      'v (klein) ist Geschwindigkeit, V (gross) ist Volumen — nicht verwechseln!',
      'Filtergeschwindigkeit hat die Einheit m/h (Meter pro Stunde), NICHT m³/h!',
      'Immer zuerst umstellen, dann einsetzen — auch wenn die Prüfung stresst.',
      'Richtwerte kennen: Filtergeschwindigkeit ca. 20-40 m/h, Umwaelzzeit Hallenbad ca. 4-6 h.'
    ],
    quiz: {
      question: 'Q = 80 m³/h, Filterfläche A = 2,5 m². Wie gross ist die Filtergeschwindigkeit vF?',
      options: ['200 m/h', '32 m/h', '82,5 m/h'],
      correctIndex: 1,
      explanation: 'vF = Q ÷ A = 80 m³/h ÷ 2,5 m² = 32 m/h. Das liegt im normalen Bereich (20-40 m/h).'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'umstellen', 'einsetzen', 'praxis'];

/* ─── Formula overview table (shown on grundlagen and praxis tabs) ─────────── */

const FORMULA_OVERVIEW = [
  ['Geschwindigkeit', 'v = s ÷ t', 'm/s oder km/h', 'Stroemung, Schwimmer'],
  ['Förderstrom', 'Q = V ÷ t', 'm³/h', 'Pumpenleistung'],
  ['Fläche', 'A = l × b', 'm²', 'Beckenfläche'],
  ['Filtergeschwindigkeit', 'vF = Q ÷ A', 'm/h', 'Filteranlage']
];

/* ─── Rearrangement cheat-sheet (shown on umstellen and einsetzen tabs) ────── */

const REARRANGE_CHEATSHEET = [
  ['v = s ÷ t', 's = v × t', 't = s ÷ v'],
  ['Q = V ÷ t', 'V = Q × t', 't = V ÷ Q'],
  ['A = l × b', 'l = A ÷ b', 'b = A ÷ l'],
  ['vF = Q ÷ A', 'Q = vF × A', 'A = Q ÷ vF']
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

export default function FormelnDeepDiveView() {
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

          {/* Formula overview table (on grundlagen and praxis tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Die 4 wichtigsten Bad-Formeln">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Größe
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Formel
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Einheit
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Beispiel
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FORMULA_OVERVIEW.map(([name, formula, unit, example]) => (
                      <tr key={name} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {name}
                        </td>
                        <td className={`px-3 py-2 font-mono ${darkMode ? 'bg-slate-900/40 text-teal-300' : 'bg-white text-teal-700'}`}>
                          {formula}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {unit}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {example}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Rearrangement cheat-sheet (on umstellen and einsetzen tabs) */}
          {(activeTab === 'umstellen' || activeTab === 'einsetzen') && (
            <InfoCard darkMode={darkMode} title="Umstell-Tabelle (Spickzettel)">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Original
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Variante 1
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Variante 2
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {REARRANGE_CHEATSHEET.map(([original, var1, var2]) => (
                      <tr key={original} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-mono font-semibold ${darkMode ? 'bg-slate-950/50 text-teal-300' : 'bg-gray-50 text-teal-700'}`}>
                          {original}
                        </td>
                        <td className={`px-3 py-2 font-mono ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {var1}
                        </td>
                        <td className={`px-3 py-2 font-mono ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {var2}
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
