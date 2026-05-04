import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Warum Zeit anders tickt',
    intro:
      'Zeit rechnet sich anders als alles andere. Warum? Weil eine Stunde nicht 100 Minuten hat, sondern nur 60! Das 60er-System macht Zeitrechnung schwieriger als normales Rechnen. Aber keine Sorge — wenn du die Grundregeln kennst, ist es ganz einfach.',
    motto: '1 Stunde = 60 Minuten, nicht 100!',
    rules: [
      '1 Stunde hat 60 Minuten — NICHT 100. Das ist der wichtigste Unterschied zu normalem Rechnen.',
      '1 Minute hat 60 Sekunden — wieder 60, nicht 100.',
      'Du kannst Minuten NICHT einfach wie Kommazahlen behandeln. 1:30 ist NICHT 1,30 Stunden!',
      'Beim Addieren von Zeiten: Wenn die Minuten über 60 kommen, wird daraus eine neue Stunde.',
      'Beim Subtrahieren von Zeiten: Wenn die Minuten nicht reichen, musst du dir eine Stunde "borgen" (= 60 Minuten dazunehmen).'
    ],
    steps: [
      {
        title: '1. Zeitformat verstehen',
        text: 'Zeit wird als Stunden:Minuten geschrieben. 2:45 bedeutet 2 Stunden und 45 Minuten. Die Zahl nach dem Doppelpunkt kann NIE größer als 59 sein.'
      },
      {
        title: '2. Zeiten addieren',
        text: 'Minuten und Stunden getrennt addieren. Wenn die Minuten 60 oder mehr ergeben: 60 abziehen und 1 Stunde dazurechnen. Beispiel: 2:45 + 1:30 = 3:75 → 4:15.'
      },
      {
        title: '3. Zeiten subtrahieren',
        text: 'Minuten und Stunden getrennt abziehen. Wenn die Minuten nicht reichen: 1 Stunde wegnehmen und 60 Minuten dazurechnen. Beispiel: 3:10 - 0:40 → 2:70 - 0:40 = 2:30.'
      },
      {
        title: '4. Dauer berechnen',
        text: 'Von Startzeit bis Endzeit: Erst die Stunden zählen, dann die Minuten. Oder alles in Minuten umrechnen, abziehen, und zurückrechnen.'
      }
    ],
    examples: [
      {
        title: 'Zeiten addieren: Zwei Schichten',
        given: 'Morgens arbeitest du 3:45 Stunden, nachmittags 2:30 Stunden.',
        question: 'Wie lange hast du insgesamt gearbeitet?',
        steps: [
          ['Stunden addieren', '3 + 2 = 5 Stunden'],
          ['Minuten addieren', '45 + 30 = 75 Minuten'],
          ['Umrechnen', '75 Minuten = 1 Stunde und 15 Minuten'],
          ['Ergebnis', '5 + 1:15 = 6:15 Stunden = 6 Stunden 15 Minuten']
        ]
      },
      {
        title: 'Dauer berechnen: Schichtlänge',
        given: 'Deine Schicht beginnt um 6:30 Uhr und endet um 14:15 Uhr.',
        question: 'Wie lange dauert die Schicht?',
        steps: [
          ['Stunden abziehen', '14 - 6 = 8 Stunden'],
          ['Minuten abziehen', '15 - 30 → geht nicht!'],
          ['Stunde borgen', '13:75 - 6:30 (1 Stunde = 60 Minuten dazu)'],
          ['Ergebnis', '13:75 - 6:30 = 7:45 Stunden = 7 Stunden 45 Minuten']
        ]
      },
      {
        title: 'Pause abziehen',
        given: 'Du arbeitest von 7:00 bis 15:30 Uhr mit 45 Minuten Pause.',
        question: 'Wie viel reine Arbeitszeit hast du?',
        steps: [
          ['Gesamtzeit', '15:30 - 7:00 = 8:30 Stunden'],
          ['Pause abziehen', '8:30 - 0:45'],
          ['Minuten reichen nicht', '7:90 - 0:45 (1 Stunde borgen)'],
          ['Ergebnis', '7:90 - 0:45 = 7:45 Stunden reine Arbeitszeit']
        ]
      }
    ],
    pitfalls: [
      'NIEMALS 1:30 als 1,30 Stunden lesen! 1:30 = 1,50 Industriestunden (30 Minuten = halbe Stunde).',
      'Beim Addieren vergessen, dass ab 60 Minuten eine neue Stunde anfängt.',
      'Beim Subtrahieren vergessen, eine Stunde zu borgen, wenn die Minuten nicht reichen.',
      'Uhrzeit und Dauer verwechseln: 14:30 Uhr ist eine Uhrzeit, 2:30 ist eine Dauer.'
    ],
    quiz: {
      question: 'Wie viel ist 2:50 + 1:25?',
      options: ['3:75', '4:15', '3:15'],
      correctIndex: 1,
      explanation: '2:50 + 1:25 = 3:75. Aber 75 Minuten = 1 Stunde und 15 Minuten. Also 3 + 1 = 4 Stunden und 15 Minuten = 4:15.'
    }
  },

  umrechnung: {
    id: 'umrechnung',
    chip: 'Umrechnung',
    title: 'Minuten in Dezimalstunden umrechnen',
    intro:
      'Für Stundenzettel und Gehaltsabrechnung brauchst du Dezimalstunden (Industriestunden). Statt 7 Stunden 45 Minuten schreibst du 7,75 Stunden. Die Umrechnung ist einfach: Minuten geteilt durch 60. Hier lernst du die wichtigsten Werte auswendig.',
    motto: 'Minuten ÷ 60 = Dezimalstunden.',
    rules: [
      'Um Minuten in Dezimalstunden umzurechnen: Minuten ÷ 60.',
      'Um Dezimalstunden in Minuten umzurechnen: Dezimalzahl × 60.',
      'Die vier wichtigsten Werte: 15 min = 0,25 h | 30 min = 0,50 h | 45 min = 0,75 h | 60 min = 1,00 h.',
      'Dezimalstunden haben IMMER ein Komma, nie einen Doppelpunkt.',
      'Merkregel Viertelstunden: 15 min = ein Viertel = 0,25 | 30 min = die Hälfte = 0,50 | 45 min = drei Viertel = 0,75.'
    ],
    steps: [
      {
        title: '1. Stunden und Minuten trennen',
        text: 'Nimm die Zeit auseinander. Beispiel: 6 Stunden 20 Minuten → Die 6 Stunden bleiben, die 20 Minuten musst du umrechnen.'
      },
      {
        title: '2. Minuten durch 60 teilen',
        text: '20 Minuten ÷ 60 = 0,333... Auf zwei Stellen runden: 0,33. Das ist der Dezimalanteil.'
      },
      {
        title: '3. Zusammensetzen',
        text: 'Stunden + Dezimalanteil = Dezimalstunden. 6 + 0,33 = 6,33 Stunden.'
      },
      {
        title: '4. Rückrechnung prüfen',
        text: 'Zur Kontrolle: 0,33 × 60 = 19,8 ≈ 20 Minuten. Passt!'
      }
    ],
    examples: [
      {
        title: 'Einfach: Viertelstunde',
        given: 'Du hast 7 Stunden und 15 Minuten gearbeitet.',
        question: 'Wie viel ist das in Dezimalstunden?',
        steps: [
          ['Stunden', '7 Stunden bleiben'],
          ['Minuten umrechnen', '15 ÷ 60 = 0,25'],
          ['Zusammensetzen', '7 + 0,25 = 7,25'],
          ['Ergebnis', '7:15 = 7,25 Industriestunden']
        ]
      },
      {
        title: 'Mittel: Krummer Wert',
        given: 'Deine Schicht war 8 Stunden und 40 Minuten lang.',
        question: 'Wie viel ist das in Dezimalstunden?',
        steps: [
          ['Stunden', '8 Stunden bleiben'],
          ['Minuten umrechnen', '40 ÷ 60 = 0,667 ≈ 0,67'],
          ['Zusammensetzen', '8 + 0,67 = 8,67'],
          ['Ergebnis', '8:40 = 8,67 Industriestunden']
        ]
      },
      {
        title: 'Rückrechnung: Dezimal zu Minuten',
        given: 'Auf dem Stundenzettel steht 6,75 Stunden.',
        question: 'Wie viel Stunden und Minuten sind das?',
        steps: [
          ['Stunden', '6 volle Stunden'],
          ['Dezimalanteil', '0,75 × 60 = 45 Minuten'],
          ['Zusammensetzen', '6 Stunden und 45 Minuten'],
          ['Ergebnis', '6,75 Industriestunden = 6:45 Stunden']
        ]
      }
    ],
    pitfalls: [
      '0,50 Stunden sind 30 Minuten, NICHT 50 Minuten! Das ist der häufigste Fehler.',
      '0,75 Stunden sind 45 Minuten, NICHT 75 Minuten!',
      'Immer auf zwei Nachkommastellen runden, sonst wird der Stundenzettel ungenau.',
      'Nicht vergessen: Bei der Rückrechnung mit 60 MALNEHMEN, nicht durch 60 teilen.'
    ],
    quiz: {
      question: 'Wie viel sind 5 Stunden und 50 Minuten in Dezimalstunden?',
      options: ['5,50', '5,83', '5,80'],
      correctIndex: 1,
      explanation: '50 ÷ 60 = 0,833... ≈ 0,83. Also 5 + 0,83 = 5,83 Industriestunden.'
    }
  },

  industriestunden: {
    id: 'industriestunden',
    chip: 'Industriestunden',
    title: 'Industriestunden im Arbeitsalltag',
    intro:
      'Industriestunden (auch Dezimalstunden genannt) sind das Zeitformat für Stundenzettel, Gehaltsabrechnung und Zeiterfassung. Statt 7:45 schreibst du 7,75. Das macht das Rechnen viel einfacher, weil du normal addieren und subtrahieren kannst — ohne das lästige 60er-System.',
    motto: 'Industriezeit = dezimal = einfacher rechnen.',
    rules: [
      'Industriestunden nutzen das 100er-System (Dezimalsystem) statt des 60er-Systems.',
      'Vorteil: Du kannst ganz normal rechnen — addieren, subtrahieren, malnehmen.',
      'Arbeitgeber nutzen Industriestunden für die Gehaltsabrechnung (Stundenlohn × Industriestunden = Bruttolohn).',
      'Auf Stundenzetteln stehen IMMER Industriestunden, nie normale Stunden:Minuten.',
      'Die Umrechnung zwischen beiden Formaten musst du sicher beherrschen.'
    ],
    steps: [
      {
        title: '1. Normalzeit ablesen',
        text: 'Schau auf die Uhr oder den Dienstplan: Arbeitsbeginn und Arbeitsende. Beispiel: 6:30 bis 14:45 Uhr.'
      },
      {
        title: '2. Dauer berechnen',
        text: 'Endzeit minus Startzeit: 14:45 - 6:30 = 8:15 (8 Stunden 15 Minuten). Pause abziehen: 8:15 - 0:30 = 7:45.'
      },
      {
        title: '3. In Industriestunden umrechnen',
        text: '45 ÷ 60 = 0,75. Also 7:45 = 7,75 Industriestunden. DAS kommt auf den Stundenzettel.'
      },
      {
        title: '4. Lohn berechnen',
        text: 'Industriestunden × Stundenlohn = Verdienst. 7,75 × 14,50 Euro = 112,38 Euro brutto für diesen Tag.'
      }
    ],
    examples: [
      {
        title: 'Tages-Stundenzettel ausfüllen',
        given: 'Schicht von 7:00 bis 15:30 Uhr, 30 Minuten Pause.',
        question: 'Was kommt auf den Stundenzettel?',
        steps: [
          ['Gesamtzeit', '15:30 - 7:00 = 8:30 (8 Stunden 30 Minuten)'],
          ['Pause abziehen', '8:30 - 0:30 = 8:00'],
          ['In Industriestunden', '0 ÷ 60 = 0,00 → 8,00 Industriestunden'],
          ['Ergebnis', '8,00 Stunden auf den Stundenzettel']
        ]
      },
      {
        title: 'Wochenstunden zusammenrechnen',
        given: 'Mo: 7,75 | Di: 8,50 | Mi: 7,25 | Do: 8,00 | Fr: 6,50 Industriestunden.',
        question: 'Wie viele Stunden in dieser Woche?',
        steps: [
          ['Addieren', '7,75 + 8,50 + 7,25 + 8,00 + 6,50'],
          ['Zwischensumme', '7,75 + 8,50 = 16,25 | + 7,25 = 23,50'],
          ['Weiter', '23,50 + 8,00 = 31,50 | + 6,50 = 38,00'],
          ['Ergebnis', '38,00 Industriestunden diese Woche']
        ]
      },
      {
        title: 'Ueberstunden berechnen',
        given: 'Soll-Arbeitszeit: 38,50 Industriestunden. Tatsächlich gearbeitet: 41,25 Industriestunden.',
        question: 'Wie viele Ueberstunden hast du?',
        steps: [
          ['Ist minus Soll', '41,25 - 38,50'],
          ['Rechnung', '41,25 - 38,50 = 2,75'],
          ['In Normalzeit', '0,75 × 60 = 45 Minuten → 2 Stunden 45 Minuten'],
          ['Ergebnis', '2,75 Industriestunden = 2:45 Stunden Ueberstunden']
        ]
      }
    ],
    pitfalls: [
      'Stundenzettel in Normalzeit (7:45) statt Industriezeit (7,75) ausfüllen — das gibt Aerger bei der Abrechnung!',
      'Industriestunden einfach addieren und dabei vergessen, dass das Ergebnis NICHT in Stunden:Minuten ist.',
      'Pause vergessen abzuziehen — passiert besonders bei langen Schichten.',
      'Den Doppelpunkt (:) statt des Kommas (,) verwenden — 7:75 gibt es nicht!'
    ],
    quiz: {
      question: 'Schicht von 6:15 bis 14:00, 30 min Pause. Wie viel Industriestunden?',
      options: ['7,25', '7,50', '7,75'],
      correctIndex: 0,
      explanation: '14:00 - 6:15 = 7:45. Minus 0:30 Pause = 7:15. Umrechnung: 15 ÷ 60 = 0,25. Also 7,25 Industriestunden.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Zeit im Bäderalltag',
    intro:
      'Im Schwimmbad brauchst du Zeitrechnung überall: Schichtplanung, Stundenzettel, Umwälzzeiten berechnen, Ueberstunden ermitteln. Hier übst du mit echten Aufgaben aus dem Bäderalltag. Diese Aufgaben kommen in der Prüfung dran!',
    motto: 'Vom Stundenzettel bis zur Umwälzzeit — Zeit ist überall.',
    rules: [
      'Schichtlänge = Endzeit - Startzeit - Pause. IMMER die Pause abziehen!',
      'Auf dem Stundenzettel stehen IMMER Industriestunden (Dezimalformat).',
      'Umwälzzeit = Beckenvolumen ÷ Umwälzleistung. Das Ergebnis ist in Stunden (Dezimal).',
      'Ueberstunden = Ist-Stunden - Soll-Stunden. Beides in Industriestunden rechnen!',
      'Bei der Prüfung: Achte darauf, ob die Aufgabe Normalzeit oder Industriezeit verlangt.'
    ],
    steps: [
      {
        title: '1. Aufgabe lesen und Format erkennen',
        text: 'Was wird gefragt? Normalzeit (Stunden:Minuten) oder Industriezeit (Dezimal)? Was ist gegeben? Schreib die Werte auf.'
      },
      {
        title: '2. Alles ins gleiche Format bringen',
        text: 'Wenn du rechnen musst, bring alles in das gleiche Format. Am einfachsten: Alles in Industriezeit umrechnen, dann normal rechnen.'
      },
      {
        title: '3. Rechnung durchführen',
        text: 'In Industriezeit kannst du ganz normal addieren, subtrahieren und multiplizieren. Kein 60er-System mehr!'
      },
      {
        title: '4. Ergebnis im richtigen Format angeben',
        text: 'Fragt die Aufgabe nach Stunden:Minuten? Dann zurückrechnen! Fragt sie nach Industriestunden? Dann bist du schon fertig.'
      }
    ],
    examples: [
      {
        title: 'Schichtlänge mit Pause',
        given: 'Frühschicht: 5:45 bis 13:30 Uhr, 30 Minuten Pause.',
        question: 'Wie lang ist die Netto-Arbeitszeit in Industriestunden?',
        steps: [
          ['Gesamtzeit', '13:30 - 5:45 = 7:45 (12:90 - 5:45 = 7:45)'],
          ['Pause abziehen', '7:45 - 0:30 = 7:15'],
          ['In Industriestunden', '15 ÷ 60 = 0,25 → 7,25 Industriestunden'],
          ['Ergebnis', '7,25 Stunden auf den Stundenzettel']
        ]
      },
      {
        title: 'Umwälzzeit berechnen',
        given: 'Schwimmerbecken: 600 m³ Volumen. Umwälzpumpe: 150 m³/h Leistung.',
        question: 'Wie lange dauert eine komplette Umwälzung?',
        steps: [
          ['Formel', 'Umwälzzeit = Volumen ÷ Leistung'],
          ['Einsetzen', '600 m³ ÷ 150 m³/h = 4,0 Stunden'],
          ['In Normalzeit', '4,0 Stunden = 4 Stunden 0 Minuten'],
          ['Ergebnis', 'Eine Umwälzung dauert 4 Stunden']
        ]
      },
      {
        title: 'Wochenarbeitszeit und Ueberstunden',
        given: 'Soll: 39,00 h/Woche. Tatsächlich: Mo 8,25 | Di 8,50 | Mi 8,75 | Do 8,25 | Fr 7,50.',
        question: 'Gibt es Ueberstunden?',
        steps: [
          ['Ist-Stunden addieren', '8,25 + 8,50 + 8,75 + 8,25 + 7,50 = 41,25'],
          ['Soll abziehen', '41,25 - 39,00 = 2,25'],
          ['In Normalzeit', '0,25 × 60 = 15 Min → 2 Stunden 15 Minuten'],
          ['Ergebnis', '2,25 Industriestunden = 2:15 Ueberstunden']
        ]
      },
      {
        title: 'Umwälzzeit Nichtschwimmerbecken',
        given: 'Nichtschwimmerbecken: 180 m³. Pumpe: 80 m³/h. Vorschrift: max. 2,5 Stunden Umwälzzeit.',
        question: 'Wird die Vorschrift eingehalten?',
        steps: [
          ['Umwälzzeit berechnen', '180 ÷ 80 = 2,25 Stunden'],
          ['In Normalzeit', '0,25 × 60 = 15 Min → 2 Stunden 15 Minuten'],
          ['Vergleich', '2,25 h < 2,50 h (Vorschrift)'],
          ['Ergebnis', 'Ja! 2,25 h ist unter der Grenze von 2,50 h. Vorschrift eingehalten.']
        ]
      }
    ],
    pitfalls: [
      'Bei Schichtberechnung die Pause vergessen — das verfälscht den ganzen Stundenzettel!',
      'Normalzeit und Industriezeit in einer Rechnung mischen — IMMER erst alles umrechnen.',
      'Bei der Umwälzzeit: Einheiten prüfen! Volumen in m³ und Leistung in m³/h ergibt Stunden.',
      'Ergebnis im falschen Format angeben: Aufgabe fragt Industriestunden, du gibst Stunden:Minuten an.'
    ],
    quiz: {
      question: 'Beckenvolumen 450 m³, Pumpenleistung 100 m³/h. Wie lange dauert die Umwälzung?',
      options: ['4,00 Stunden', '4,50 Stunden', '5,00 Stunden'],
      correctIndex: 1,
      explanation: '450 ÷ 100 = 4,50 Stunden. In Normalzeit: 4 Stunden 30 Minuten.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'umrechnung', 'industriestunden', 'praxis'];

/* ─── Conversion reference table ───────────────────────────────────────────── */

const CONVERSION_TABLE = [
  ['5 min', '0,08 h'],
  ['10 min', '0,17 h'],
  ['15 min', '0,25 h'],
  ['20 min', '0,33 h'],
  ['30 min', '0,50 h'],
  ['40 min', '0,67 h'],
  ['45 min', '0,75 h'],
  ['50 min', '0,83 h'],
  ['60 min', '1,00 h']
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

export default function ZeitDeepDiveView() {
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

          {/* Conversion table (on umrechnung and industriestunden tabs) */}
          {(activeTab === 'umrechnung' || activeTab === 'industriestunden') && (
            <InfoCard darkMode={darkMode} title="Umrechnungstabelle: Minuten → Industriestunden">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Minuten
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Industriestunden
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONVERSION_TABLE.map(([minutes, decimal]) => (
                      <tr key={minutes} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {minutes}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {decimal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Quick reference (on grundlagen and praxis tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Schnell-Check: Normalzeit vs. Industriezeit">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Normalzeit (Stunden:Minuten)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Das kennst du von der Uhr. 7:45 = 7 Stunden 45 Minuten. Doppelpunkt als Trenner.
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Minuten gehen nur bis 59! Danach wird eine neue Stunde.
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Industriezeit (Dezimalstunden)
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Für Stundenzettel und Abrechnung. 7,75 = 7 Stunden 45 Minuten. Komma als Trenner.
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Nachkommastellen gehen bis 99! Viel einfacher zum Rechnen.
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
