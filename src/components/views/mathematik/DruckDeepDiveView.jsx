import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was ist Druck?',
    intro:
      'Druck begegnet dir im Schwimmbad überall: am Manometer der Pumpe, im Filterkessel, beim Tauchen im Becken. Druck ist nichts anderes als eine Kraft, die auf eine bestimmte Fläche drückt. Je kleiner die Fläche, desto größer der Druck — wie bei einem Nagel: Die Spitze ist winzig, deshalb dringt er ins Holz.',
    motto: 'Druck = Kraft geteilt durch Fläche.',
    rules: [
      'Druck entsteht, wenn eine Kraft auf eine Fläche wirkt.',
      'Die Formel lautet: p = F ÷ A (Druck = Kraft geteilt durch Fläche).',
      'Die Einheit im Alltag ist bar — wie beim Reifendruck am Auto.',
      'Gleiche Kraft auf kleinere Fläche = mehr Druck (Nagel-Prinzip).',
      'Gleiche Kraft auf größere Fläche = weniger Druck (Schneeschuh-Prinzip).'
    ],
    steps: [
      {
        title: '1. Was drückt wohin?',
        text: 'Finde heraus, welche Kraft wirkt und auf welche Fläche sie drückt. Beispiel: 500 N drücken auf eine Fläche von 0,1 m².'
      },
      {
        title: '2. Formel aufschreiben',
        text: 'Schreib die Formel hin: p = F ÷ A. Setze die Werte ein: p = 500 N ÷ 0,1 m².'
      },
      {
        title: '3. Ausrechnen',
        text: 'Rechne aus: 500 ÷ 0,1 = 5.000 Pa (Pascal). Das sind 5.000 Pascal oder 0,05 bar.'
      },
      {
        title: '4. Ergebnis prüfen',
        text: 'Macht das Ergebnis Sinn? Kleine Fläche und große Kraft = hoher Druck. Passt!'
      }
    ],
    examples: [
      {
        title: 'Einfaches Beispiel: Fuss auf dem Boden',
        given: 'Ein Bademeister wiegt 80 kg (≈ 800 N). Seine Schuhsohle hat eine Fläche von 0,04 m².',
        question: 'Wie gross ist der Druck auf den Boden?',
        steps: [
          ['Formel', 'p = F ÷ A'],
          ['Einsetzen', 'p = 800 N ÷ 0,04 m²'],
          ['Ausrechnen', 'p = 20.000 Pa = 0,2 bar'],
          ['Ergebnis', 'Der Druck auf den Boden beträgt 0,2 bar']
        ]
      },
      {
        title: 'Bäder-Beispiel: Wasserstrahl',
        given: 'Eine Reinigungsdüse drückt mit 60 N auf eine Fläche von 0,0002 m².',
        question: 'Wie hoch ist der Druck am Auftreffpunkt?',
        steps: [
          ['Formel', 'p = F ÷ A'],
          ['Einsetzen', 'p = 60 N ÷ 0,0002 m²'],
          ['Ausrechnen', 'p = 300.000 Pa = 3 bar'],
          ['Ergebnis', 'Der Wasserstrahl trifft mit 3 bar auf']
        ]
      },
      {
        title: 'Vergleich: High Heels vs. Turnschuhe',
        given: 'Eine Person wiegt 60 kg (≈ 600 N). High-Heel-Absatz: 0,0001 m². Turnschuh-Sohle: 0,02 m².',
        question: 'Wie unterscheidet sich der Druck?',
        steps: [
          ['High Heel', 'p = 600 N ÷ 0,0001 m² = 6.000.000 Pa = 60 bar'],
          ['Turnschuh', 'p = 600 N ÷ 0,02 m² = 30.000 Pa = 0,3 bar'],
          ['Vergleich', 'High Heel macht 200× mehr Druck!'],
          ['Ergebnis', 'Deshalb sind High Heels im Schwimmbad verboten']
        ]
      }
    ],
    pitfalls: [
      'Druck und Kraft sind NICHT das Gleiche — Druck bezieht sich immer auf eine Fläche!',
      'Die Fläche muss in m² sein, nicht in cm² — sonst stimmt die Einheit nicht.',
      'Pascal (Pa) ist sehr klein: 1 bar = 100.000 Pa. Im Alltag rechnet man in bar.',
      'Gewicht in kg ist KEINE Kraft! Erst mit 10 malnehmen (oder genauer 9,81) für Newton.'
    ],
    quiz: {
      question: 'Eine Kraft von 1.000 N drückt auf 0,05 m². Wie gross ist der Druck?',
      options: ['0,2 bar', '0,5 bar', '2 bar'],
      correctIndex: 0,
      explanation: 'p = 1.000 N ÷ 0,05 m² = 20.000 Pa = 0,2 bar.'
    }
  },

  wasserdruck: {
    id: 'wasserdruck',
    chip: 'Wasserdruck',
    title: 'Druck unter Wasser — Hydrostatischer Druck',
    intro:
      'Jeder, der schon mal getaucht ist, kennt das: Je tiefer man taucht, desto mehr Druck spürt man auf den Ohren. Das liegt am Gewicht des Wassers über dir. Pro Meter Wassertiefe steigt der Druck um ungefähr 0,1 bar. Diese Faustregel brauchst du im Schwimmbad ständig!',
    motto: '1 Meter Tiefe ≈ 0,1 bar Wasserdruck.',
    rules: [
      'Wasser hat ein Gewicht — und dieses Gewicht erzeugt Druck.',
      'Faustregel: Pro 1 Meter Wassertiefe steigt der Druck um ca. 0,1 bar.',
      'Bei 10 Meter Tiefe herrscht ca. 1 bar Wasserdruck (plus Luftdruck).',
      'Der Druck wirkt von ALLEN Seiten — nicht nur von oben.',
      'Hydrostatischer Druck hängt NUR von der Tiefe ab, nicht von der Beckengröße.'
    ],
    steps: [
      {
        title: '1. Tiefe bestimmen',
        text: 'Wie tief ist das Wasser an der Stelle? Beispiel: Das Schwimmerbecken ist 2 Meter tief.'
      },
      {
        title: '2. Faustregel anwenden',
        text: 'Pro Meter Tiefe ≈ 0,1 bar. Also: 2 Meter × 0,1 bar = 0,2 bar Wasserdruck am Beckenboden.'
      },
      {
        title: '3. Luftdruck beachten',
        text: 'Auf der Wasseroberfläche drückt schon die Luft mit ca. 1 bar. Gesamtdruck am Boden: 1 bar + 0,2 bar = 1,2 bar.'
      },
      {
        title: '4. Was bedeutet das praktisch?',
        text: 'Beim Tauchen spürst du den Wasserdruck auf den Ohren. Für Rohre und Beckenwände muss der Druck berücksichtigt werden.'
      }
    ],
    examples: [
      {
        title: 'Schwimmerbecken: Druck am Boden',
        given: 'Das Schwimmerbecken ist 1,80 m tief.',
        question: 'Wie hoch ist der Wasserdruck am Beckenboden?',
        steps: [
          ['Faustregel', '1 m Tiefe ≈ 0,1 bar'],
          ['Rechnung', '1,80 m × 0,1 bar/m = 0,18 bar'],
          ['Plus Luftdruck', '1 bar + 0,18 bar = 1,18 bar gesamt'],
          ['Ergebnis', 'Am Beckenboden herrschen ca. 1,18 bar Gesamtdruck']
        ]
      },
      {
        title: 'Sprungbecken: Tiefer Bereich',
        given: 'Das Sprungbecken ist 3,80 m tief.',
        question: 'Welcher Wasserdruck herrscht am tiefsten Punkt?',
        steps: [
          ['Faustregel', '1 m Tiefe ≈ 0,1 bar'],
          ['Rechnung', '3,80 m × 0,1 bar/m = 0,38 bar'],
          ['Plus Luftdruck', '1 bar + 0,38 bar = 1,38 bar gesamt'],
          ['Ergebnis', 'Am Boden des Sprungbeckens herrschen ca. 1,38 bar']
        ]
      },
      {
        title: 'Warum tun die Ohren weh?',
        given: 'Ein Kind taucht im Nichtschwimmerbecken auf 1,35 m Tiefe.',
        question: 'Welcher Druck wirkt auf die Ohren?',
        steps: [
          ['Faustregel', '1 m Tiefe ≈ 0,1 bar'],
          ['Rechnung', '1,35 m × 0,1 bar/m = 0,135 bar'],
          ['Bedeutung', '0,135 bar auf dem Trommelfell — das spürt man!'],
          ['Ergebnis', 'Schon bei 1,35 m drückt es merkbar auf die Ohren']
        ]
      }
    ],
    pitfalls: [
      'Wasserdruck hängt NUR von der Tiefe ab — ein schmales Rohr hat den gleichen Druck wie ein riesiges Becken!',
      'Nicht vergessen: Der Luftdruck (ca. 1 bar) kommt IMMER noch dazu.',
      'Beim Tauchen: Druck-Ausgleich machen (Nase zuhalten und pusten), sonst kann das Trommelfell Schaden nehmen.',
      'Die Faustregel 0,1 bar pro Meter gilt für Süßwasser — Salzwasser ist etwas schwerer.'
    ],
    quiz: {
      question: 'Wie hoch ist der reine Wasserdruck in 4 Meter Tiefe (ohne Luftdruck)?',
      options: ['0,2 bar', '0,4 bar', '4 bar'],
      correctIndex: 1,
      explanation: '4 m × 0,1 bar/m = 0,4 bar reiner Wasserdruck.'
    }
  },

  berechnung: {
    id: 'berechnung',
    chip: 'Berechnung',
    title: 'Druck berechnen — Formeln und Einheiten',
    intro:
      'In der Prüfung musst du mit Druck rechnen können. Die Grundformel ist einfach: p = F ÷ A. Das Schwierigste dabei sind die Einheiten. Hier lernst du, wie du zwischen bar, Pascal und mbar umrechnest und die Formel nach allen Größen umstellst.',
    motto: 'p = F ÷ A — die drei Buchstaben reichen.',
    rules: [
      'Grundformel: p = F ÷ A (Druck = Kraft durch Fläche).',
      'Umgestellt nach Kraft: F = p × A.',
      'Umgestellt nach Fläche: A = F ÷ p.',
      '1 bar = 100.000 Pa = 100.000 N/m². Das ist der wichtigste Umrechnungsfaktor!',
      '1 mbar (Millibar) = 0,001 bar = 100 Pa.'
    ],
    steps: [
      {
        title: '1. Was ist gesucht?',
        text: 'Lies die Aufgabe genau: Ist der Druck, die Kraft oder die Fläche gesucht? Davon hängt ab, welche Formel du brauchst.'
      },
      {
        title: '2. Einheiten umrechnen',
        text: 'Alles muss zusammenpassen: Kraft in Newton (N), Fläche in m², Druck in Pascal (Pa) oder bar. 1 bar = 100.000 Pa.'
      },
      {
        title: '3. In die Formel einsetzen',
        text: 'Setze die Werte ein. Beispiel: p = 2.000 N ÷ 0,1 m² = 20.000 Pa.'
      },
      {
        title: '4. Ergebnis in richtige Einheit bringen',
        text: 'Die Prüfung will meistens bar: 20.000 Pa ÷ 100.000 = 0,2 bar. Oder mbar: 0,2 bar × 1.000 = 200 mbar.'
      }
    ],
    examples: [
      {
        title: 'Druck berechnen',
        given: 'Eine Pumpe drückt mit 5.000 N auf einen Kolben mit 0,01 m² Fläche.',
        question: 'Wie hoch ist der Druck in bar?',
        steps: [
          ['Formel', 'p = F ÷ A'],
          ['Einsetzen', 'p = 5.000 N ÷ 0,01 m² = 500.000 Pa'],
          ['Umrechnen', '500.000 Pa ÷ 100.000 = 5 bar'],
          ['Ergebnis', 'Der Kolbendruck beträgt 5 bar']
        ]
      },
      {
        title: 'Kraft berechnen (Formel umgestellt)',
        given: 'Im Filterkessel herrschen 2 bar Druck. Der Deckeldurchmesser ist so, dass die Deckelfläche 0,2 m² beträgt.',
        question: 'Welche Kraft drückt auf den Deckel?',
        steps: [
          ['Formel', 'F = p × A'],
          ['Umrechnen', '2 bar = 200.000 Pa'],
          ['Einsetzen', 'F = 200.000 Pa × 0,2 m² = 40.000 N'],
          ['Ergebnis', '40.000 N (≈ 4 Tonnen!) drücken auf den Deckel']
        ]
      },
      {
        title: 'Einheiten umrechnen',
        given: 'Ein Manometer zeigt 1.500 mbar an.',
        question: 'Wie viel ist das in bar und in Pascal?',
        steps: [
          ['mbar → bar', '1.500 mbar ÷ 1.000 = 1,5 bar'],
          ['bar → Pa', '1,5 bar × 100.000 = 150.000 Pa'],
          ['Zusammenfassung', '1.500 mbar = 1,5 bar = 150.000 Pa'],
          ['Ergebnis', 'Alles drei beschreibt den gleichen Druck']
        ]
      }
    ],
    pitfalls: [
      'Pa und bar verwechseln! 1 bar = 100.000 Pa — NICHT 1.000 Pa!',
      'Fläche: cm² in m² umrechnen nicht vergessen! 1 m² = 10.000 cm².',
      'Beim Formel-Umstellen: Immer das Dreieck nutzen — oben F, unten links p, unten rechts A.',
      'In der Prüfung steht manchmal kPa (Kilopascal): 1 kPa = 1.000 Pa = 0,01 bar.'
    ],
    quiz: {
      question: '3 bar in Pascal umrechnen — wie viel ist das?',
      options: ['3.000 Pa', '30.000 Pa', '300.000 Pa'],
      correctIndex: 2,
      explanation: '3 bar × 100.000 = 300.000 Pa.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Druck im Bäderalltag',
    intro:
      'Im Schwimmbad begegnet dir Druck bei jeder Schicht: Der Filterdruck auf dem Manometer, der Pumpendruck in der Leitung, der Wasserdruck am Beckenboden. Hier übst du mit echten Beispielen aus der Praxis, damit du für die Prüfung und den Alltag fit bist.',
    motto: 'Manometer lesen, Druck verstehen, sicher arbeiten.',
    rules: [
      'Der Filterdruck zeigt an, ob der Filter sauber ist — steigender Druck = Filter verschmutzt.',
      'Normaler Filterdruck liegt meist zwischen 0,5 und 1,5 bar (je nach Anlage).',
      'Wenn der Filterdruck um ca. 0,3–0,5 bar über dem Sauberwert liegt: Rückspülung nötig!',
      'Pumpendruck wird am Manometer abgelesen — bei Abweichungen sofort Ursache suchen.',
      'Wassertiefe im Becken × 0,1 = Druck in bar auf den Beckenboden.'
    ],
    steps: [
      {
        title: '1. Manometer ablesen',
        text: 'Lies den Druck am Manometer ab. Achte auf die Einheit (bar oder mbar). Vergleiche mit dem Sollwert aus dem Betriebstagebuch.'
      },
      {
        title: '2. Ist der Druck normal?',
        text: 'Normaler Filterdruck: 0,5–1,5 bar. Steigt der Druck über den Normalwert, muss der Filter rueckgespült werden.'
      },
      {
        title: '3. Druck im Leitungssystem prüfen',
        text: 'In den Rohrleitungen herrscht der Pumpendruck. Typisch: 1–3 bar. Undichte Stellen erkennt man an Druckverlust.'
      },
      {
        title: '4. Sicherheit beachten',
        text: 'Druckbehälter (Filterkessel) NIEMALS öffnen, solange Druck drauf ist! Erst Anlage abschalten und Druck ablassen.'
      }
    ],
    examples: [
      {
        title: 'Filterdruck: Rückspülung nötig?',
        given: 'Der Filterdruck nach der letzten Rückspülung war 0,8 bar. Jetzt zeigt das Manometer 1,2 bar.',
        question: 'Muss rueckgespült werden?',
        steps: [
          ['Druckdifferenz', '1,2 bar − 0,8 bar = 0,4 bar Anstieg'],
          ['Grenzwert', 'Rückspülung ab ca. 0,3–0,5 bar Anstieg'],
          ['Bewertung', '0,4 bar Anstieg liegt im kritischen Bereich'],
          ['Ergebnis', 'Ja, Rückspülung sollte durchgeführt werden']
        ]
      },
      {
        title: 'Wasserdruck auf Beckenfolie',
        given: 'Ein Edelstahl-Becken ist 2,5 m tief. Die Bodenfläche beträgt 250 m².',
        question: 'Welche Gesamtkraft drückt auf den Beckenboden?',
        steps: [
          ['Wasserdruck', '2,5 m × 0,1 bar/m = 0,25 bar = 25.000 Pa'],
          ['Formel', 'F = p × A'],
          ['Einsetzen', 'F = 25.000 Pa × 250 m² = 6.250.000 N'],
          ['Ergebnis', 'Ca. 6.250 kN (≈ 625 Tonnen!) drücken auf den Boden']
        ]
      },
      {
        title: 'Pumpendruck und Leitungsverlust',
        given: 'Die Umwälzpumpe liefert 2,5 bar. Am Einlauf ins Becken kommen nur noch 1,8 bar an.',
        question: 'Wie gross ist der Druckverlust in der Leitung?',
        steps: [
          ['Pumpe liefert', '2,5 bar'],
          ['Am Einlauf', '1,8 bar'],
          ['Druckverlust', '2,5 − 1,8 = 0,7 bar'],
          ['Ergebnis', '0,7 bar gehen in der Leitung verloren (Reibung, Bögen, Filter)']
        ]
      },
      {
        title: 'Manometer richtig lesen',
        given: 'Das Manometer am Filterkessel zeigt 1.350 mbar an.',
        question: 'Wie viel bar sind das und ist der Wert normal?',
        steps: [
          ['Umrechnen', '1.350 mbar ÷ 1.000 = 1,35 bar'],
          ['Normalbereich', 'Filterdruck normal: 0,5–1,5 bar'],
          ['Bewertung', '1,35 bar liegt im oberen Normalbereich'],
          ['Ergebnis', 'Wert ist noch OK, aber bald Rückspülung einplanen']
        ]
      }
    ],
    pitfalls: [
      'NIEMALS einen Druckbehälter öffnen, solange das Manometer Druck anzeigt!',
      'Filterdruck steigt langsam an — das ist normal. Erst wenn er deutlich über dem Sauberwert liegt, wird rueckgespült.',
      'Druckverlust in der Leitung ist normal (Reibung). Aber plötzlicher Druckverlust kann auf ein Leck hindeuten!',
      'Manometer können kaputt sein — bei unlogischen Werten ein zweites Manometer gegenprüfen.'
    ],
    quiz: {
      question: 'Der Filterdruck nach Rückspülung war 0,7 bar. Jetzt zeigt er 1,1 bar. Wie viel bar Druckanstieg?',
      options: ['0,3 bar', '0,4 bar', '0,7 bar'],
      correctIndex: 1,
      explanation: '1,1 bar − 0,7 bar = 0,4 bar Druckanstieg. Rückspülung wird bald fällig!'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'wasserdruck', 'berechnung', 'praxis'];

/* ─── Reference table: unit conversions ────────────────────────────────────── */

const UNIT_TABLE = [
  ['Einheit', 'Abkürzung', 'Umrechnung'],
  ['Pascal', 'Pa', '1 Pa = 1 N/m²'],
  ['Kilopascal', 'kPa', '1 kPa = 1.000 Pa'],
  ['Bar', 'bar', '1 bar = 100.000 Pa'],
  ['Millibar', 'mbar', '1 mbar = 0,001 bar = 100 Pa'],
  ['Atmosphäre', 'atm', '1 atm ≈ 1,013 bar']
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

export default function DruckDeepDiveView() {
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

          {/* Unit conversion table (on grundlagen and berechnung tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'berechnung') && (
            <InfoCard darkMode={darkMode} title="Einheiten-Umrechnung">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                        Einheit
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Kürzel
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Umrechnung
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {UNIT_TABLE.slice(1).map(([name, abbr, conversion]) => (
                      <tr key={name} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {name}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {abbr}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {conversion}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Pressure depth helper (on wasserdruck and praxis tabs) */}
          {(activeTab === 'wasserdruck' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Schnell-Check: Wasserdruck nach Tiefe">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Faustregel
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Tiefe in Metern × 0,1 = Wasserdruck in bar
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    2 m Tiefe → 0,2 bar | 3,5 m → 0,35 bar | 10 m → 1 bar
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Gesamtdruck
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Gesamtdruck = Luftdruck (1 bar) + Wasserdruck
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    In 2 m Tiefe: 1 bar + 0,2 bar = 1,2 bar gesamt
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
