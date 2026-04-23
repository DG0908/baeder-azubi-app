import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

/* ─── Tab data ──────────────────────────────────────────────────────────────── */

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Warum schwimmen Dinge?',
    intro:
      'Auftrieb ist die Kraft, mit der Wasser nach oben drueckt. Wenn du einen Ball unter Wasser drueckst, spuerst du wie das Wasser ihn zurückdrueckt. Je mehr Wasser ein Gegenstand verdraengt, desto stärker drueckt das Wasser nach oben. Einfache Regel: 1 Liter verdraengtes Wasser erzeugt etwa 1 kg Auftrieb.',
    motto: 'Wasser drueckt immer nach oben.',
    rules: [
      'Auftrieb ist die Kraft, mit der Wasser einen Gegenstand nach oben drueckt.',
      'Je mehr Wasser verdraengt wird, desto größer ist der Auftrieb.',
      'Einfache Merkhilfe: 1 Liter verdraengtes Wasser ≈ 1 kg Auftriebskraft.',
      'Jeder Gegenstand im Wasser verdraengt genau so viel Wasser, wie er selbst Platz braucht.',
      'Die Auftriebskraft wirkt IMMER nach oben — egal wie schwer der Gegenstand ist.'
    ],
    steps: [
      {
        title: '1. Gegenstand ins Wasser',
        text: 'Wenn du einen Gegenstand ins Wasser tauchst, muss das Wasser Platz machen. Der Gegenstand verdraengt das Wasser — es weicht zur Seite und nach oben aus.'
      },
      {
        title: '2. Wasser drueckt zurück',
        text: 'Das verdraengte Wasser erzeugt eine Gegenkraft — den Auftrieb. Diese Kraft drueckt den Gegenstand nach oben. Du spuerst das, wenn du einen Ball unter Wasser drueckst.'
      },
      {
        title: '3. Verdraengtes Volumen zählt',
        text: 'Je größer der Gegenstand, desto mehr Wasser verdraengt er. Mehr verdraengtes Wasser = mehr Auftrieb. Ein grosser Ball hat mehr Auftrieb als ein kleiner.'
      },
      {
        title: '4. Faustregel merken',
        text: '1 Liter verdraengtes Wasser gibt etwa 1 kg Auftrieb. Ein Gegenstand mit 5 Liter Volumen bekommt also etwa 5 kg Auftrieb. So einfach ist das!'
      }
    ],
    examples: [
      {
        title: 'Wasserball im Schwimmbecken',
        given: 'Ein Wasserball hat ein Volumen von 10 Litern und wiegt 0,2 kg.',
        question: 'Wie viel Auftrieb bekommt der Ball?',
        steps: [
          ['Volumen', '10 Liter werden verdraengt'],
          ['Faustregel', '1 Liter ≈ 1 kg Auftrieb'],
          ['Auftrieb', '10 Liter × 1 kg = 10 kg Auftrieb'],
          ['Ergebnis', '10 kg Auftrieb für einen 0,2 kg Ball — er schwimmt leicht!']
        ]
      },
      {
        title: 'Stein im Wasser',
        given: 'Ein Stein hat ein Volumen von 0,5 Litern und wiegt 1,3 kg.',
        question: 'Wie viel Auftrieb bekommt der Stein?',
        steps: [
          ['Volumen', '0,5 Liter werden verdraengt'],
          ['Faustregel', '1 Liter ≈ 1 kg Auftrieb'],
          ['Auftrieb', '0,5 Liter × 1 kg = 0,5 kg Auftrieb'],
          ['Ergebnis', 'Nur 0,5 kg Auftrieb für 1,3 kg Gewicht — der Stein sinkt']
        ]
      },
      {
        title: 'Schwimmbrett',
        given: 'Ein Schwimmbrett hat ein Volumen von 3 Litern und wiegt 0,3 kg.',
        question: 'Wie viel Auftrieb hat das Brett?',
        steps: [
          ['Volumen', '3 Liter werden verdraengt'],
          ['Faustregel', '1 Liter ≈ 1 kg Auftrieb'],
          ['Auftrieb', '3 Liter × 1 kg = 3 kg Auftrieb'],
          ['Ergebnis', '3 kg Auftrieb für 0,3 kg — das Brett schwimmt sehr gut']
        ]
      }
    ],
    pitfalls: [
      'Auftrieb haengt NICHT vom Gewicht ab, sondern vom verdraengten Volumen!',
      'Ein grosser leichter Gegenstand hat MEHR Auftrieb als ein kleiner schwerer.',
      'Wasser drueckt nicht nur von unten — es drueckt von allen Seiten. Aber unten ist der Druck größer, deshalb geht die Kraft nach oben.',
      'Auftrieb gibt es nicht nur in Wasser, auch in Salzwasser, Sole und anderen Flüssigkeiten.'
    ],
    quiz: {
      question: 'Ein Gegenstand verdraengt 8 Liter Wasser. Wie viel Auftrieb bekommt er ungefaehr?',
      options: ['4 kg', '8 kg', '16 kg'],
      correctIndex: 1,
      explanation: 'Faustregel: 1 Liter verdraengtes Wasser ≈ 1 kg Auftrieb. 8 Liter = 8 kg Auftrieb.'
    }
  },

  schwimmen_sinken: {
    id: 'schwimmen_sinken',
    chip: 'Schwimmen & Sinken',
    title: 'Wann schwimmt etwas, wann sinkt es?',
    intro:
      'Ob etwas schwimmt oder sinkt, haengt von einem einfachen Vergleich ab: Ist der Auftrieb größer als das Gewicht, schwimmt es. Ist das Gewicht größer als der Auftrieb, sinkt es. Ein Schiff aus Stahl schwimmt, weil es durch seine Form so viel Wasser verdraengt, dass der Auftrieb größer ist als das Gewicht.',
    motto: 'Auftrieb größer als Gewicht = schwimmt.',
    rules: [
      'Schwimmen: Auftrieb ist GROESSER als das Gewicht — der Gegenstand bleibt oben.',
      'Sinken: Gewicht ist GROESSER als der Auftrieb — der Gegenstand geht unter.',
      'Schweben: Auftrieb ist GLEICH dem Gewicht — der Gegenstand bleibt in der Schwebe.',
      'Entscheidend ist die Dichte: Ist der Gegenstand leichter als gleich viel Wasser, schwimmt er.',
      'Die Form spielt eine grosse Rolle: Ein Stahlschiff schwimmt, ein Stahlklotz sinkt.'
    ],
    steps: [
      {
        title: '1. Gewicht bestimmen',
        text: 'Wie schwer ist der Gegenstand? Das ist die Kraft, die nach unten zieht. Zum Beispiel: Ein Rettungsring wiegt 2 kg.'
      },
      {
        title: '2. Auftrieb berechnen',
        text: 'Wie viel Wasser verdraengt der Gegenstand? Volumen in Litern × 1 kg = Auftrieb. Zum Beispiel: Der Rettungsring verdraengt 12 Liter = 12 kg Auftrieb.'
      },
      {
        title: '3. Vergleichen',
        text: 'Auftrieb > Gewicht? Dann schwimmt es! 12 kg Auftrieb > 2 kg Gewicht — der Rettungsring schwimmt gut und kann sogar noch eine Person tragen.'
      },
      {
        title: '4. Tragfähigkeit',
        text: 'Wie viel kann der Gegenstand zusätzlich tragen? Auftrieb minus Eigengewicht = Tragfähigkeit. 12 kg - 2 kg = 10 kg zusätzliche Last.'
      }
    ],
    examples: [
      {
        title: 'Warum schwimmt ein Schiff?',
        given: 'Ein Modellboot aus Stahl wiegt 5 kg. Durch seine Hohlform verdraengt es 20 Liter Wasser.',
        question: 'Schwimmt das Boot?',
        steps: [
          ['Gewicht', '5 kg zieht nach unten'],
          ['Auftrieb', '20 Liter × 1 kg = 20 kg drueckt nach oben'],
          ['Vergleich', '20 kg Auftrieb > 5 kg Gewicht'],
          ['Ergebnis', 'Das Boot schwimmt! Es kann sogar noch 15 kg zusätzlich tragen.']
        ]
      },
      {
        title: 'Warum sinkt ein Stein?',
        given: 'Ein Stein wiegt 3 kg und verdraengt 1,2 Liter Wasser.',
        question: 'Schwimmt der Stein?',
        steps: [
          ['Gewicht', '3 kg zieht nach unten'],
          ['Auftrieb', '1,2 Liter × 1 kg = 1,2 kg drueckt nach oben'],
          ['Vergleich', '1,2 kg Auftrieb < 3 kg Gewicht'],
          ['Ergebnis', 'Der Stein sinkt — er ist zu schwer für seinen Auftrieb.']
        ]
      },
      {
        title: 'Holzbrett auf dem Wasser',
        given: 'Ein Holzbrett wiegt 4 kg und hat ein Volumen von 8 Litern.',
        question: 'Wie tief taucht das Brett ein?',
        steps: [
          ['Gewicht', '4 kg zieht nach unten'],
          ['Maximaler Auftrieb', '8 Liter × 1 kg = 8 kg (wenn ganz unter Wasser)'],
          ['Gleichgewicht', 'Es taucht so tief ein, bis Auftrieb = Gewicht: 4 Liter'],
          ['Ergebnis', 'Das Brett taucht zur Haelfte ein (4 von 8 Litern unter Wasser)']
        ]
      }
    ],
    pitfalls: [
      'Schwer heisst NICHT automatisch sinken! Es kommt auf das Verhältnis von Gewicht zu Volumen an.',
      'Ein grosses Schiff ist schwerer als ein kleiner Stein — aber das Schiff schwimmt weil es mehr Wasser verdraengt.',
      'Luft zählt mit! Hohle Gegenstaende verdraengen viel Wasser bei wenig Gewicht — deshalb schwimmen sie.'
    ],
    quiz: {
      question: 'Ein Gegenstand wiegt 6 kg und verdraengt 4 Liter Wasser. Was passiert?',
      options: ['Er schwimmt', 'Er sinkt', 'Er schwebt'],
      correctIndex: 1,
      explanation: '4 Liter = 4 kg Auftrieb. 4 kg Auftrieb < 6 kg Gewicht — er sinkt.'
    }
  },

  berechnung: {
    id: 'berechnung',
    chip: 'Berechnung',
    title: 'Auftrieb berechnen — Archimedes ganz einfach',
    intro:
      'Archimedes hat vor über 2000 Jahren entdeckt: Der Auftrieb ist genau so gross wie das Gewicht des verdraengten Wassers. Die Formel ist einfach: Volumen × Dichte des Wassers = Auftrieb. Bei normalem Wasser ist die Dichte etwa 1 kg pro Liter. Bei Salzwasser etwas mehr.',
    motto: 'Auftrieb = verdraengtes Volumen × Wasserdichte.',
    rules: [
      'Formel: Auftrieb (in kg) = Volumen (in Litern) × Dichte (in kg/L).',
      'Dichte von normalem Wasser: ca. 1 kg pro Liter (genauer: 0,998 kg/L bei 20°C).',
      'Dichte von Salzwasser/Sole: höher als 1 kg/L — deshalb schwimmt man in Sole besser!',
      'Das verdraengte Volumen ist der Teil des Gegenstands, der UNTER Wasser ist.',
      'Wichtig: Volumen in Litern ODER m³ rechnen — aber nicht mischen! 1 m³ = 1.000 Liter.'
    ],
    steps: [
      {
        title: '1. Volumen bestimmen',
        text: 'Wie gross ist der Gegenstand unter Wasser? Das ist das verdraengte Volumen. Bei regelmäßigen Formen: Länge × Breite × Höhe. Beispiel: 0,5 m × 0,3 m × 0,2 m = 0,03 m³ = 30 Liter.'
      },
      {
        title: '2. Dichte des Wassers',
        text: 'Normales Beckenwasser: ca. 1 kg/L. Solebecken mit 3% Salz: ca. 1,02 kg/L. Für die meisten Aufgaben reicht 1 kg/L.'
      },
      {
        title: '3. Auftrieb berechnen',
        text: 'Volumen × Dichte = Auftrieb. Beispiel: 30 Liter × 1 kg/L = 30 kg Auftrieb. So einfach ist das!'
      },
      {
        title: '4. Ergebnis einordnen',
        text: 'Vergleiche den Auftrieb mit dem Gewicht des Gegenstands. Auftrieb > Gewicht = schwimmt. Auftrieb < Gewicht = sinkt.'
      }
    ],
    examples: [
      {
        title: 'Schwimmhilfe berechnen',
        given: 'Eine Schwimmhilfe hat ein Volumen von 5 Litern. Dichte Beckenwasser: 1 kg/L.',
        question: 'Wie viel Auftrieb erzeugt sie?',
        steps: [
          ['Volumen', '5 Liter'],
          ['Dichte', '1 kg/L (normales Wasser)'],
          ['Rechnung', '5 L × 1 kg/L = 5 kg'],
          ['Ergebnis', 'Die Schwimmhilfe erzeugt 5 kg Auftrieb']
        ]
      },
      {
        title: 'Rettungsring im Solebecken',
        given: 'Ein Rettungsring verdraengt 15 Liter. Im Solebecken hat das Wasser eine Dichte von 1,05 kg/L.',
        question: 'Wie viel Auftrieb gibt es im Solebecken vs. normales Wasser?',
        steps: [
          ['Normales Wasser', '15 L × 1,00 kg/L = 15,0 kg Auftrieb'],
          ['Solebecken', '15 L × 1,05 kg/L = 15,75 kg Auftrieb'],
          ['Unterschied', '15,75 - 15,0 = 0,75 kg mehr Auftrieb'],
          ['Ergebnis', 'Im Solebecken hat man 0,75 kg mehr Auftrieb — man schwebt leichter!']
        ]
      },
      {
        title: 'Tauchring am Beckenboden',
        given: 'Ein Tauchring hat ein Volumen von 0,1 Liter und wiegt 0,25 kg.',
        question: 'Liegt er am Boden oder schwimmt er?',
        steps: [
          ['Volumen', '0,1 Liter'],
          ['Auftrieb', '0,1 L × 1 kg/L = 0,1 kg'],
          ['Vergleich', '0,1 kg Auftrieb < 0,25 kg Gewicht'],
          ['Ergebnis', 'Er sinkt — deshalb ist er perfekt als Tauchring!']
        ]
      }
    ],
    pitfalls: [
      'Einheiten nicht mischen! Entweder alles in Litern und kg oder alles in m³ und Tonnen.',
      'Die Dichte von Wasser ist nur UNGEFAEHR 1 kg/L. Bei warmen Wasser etwas weniger, bei Salzwasser mehr.',
      'Das verdraengte Volumen ist NICHT immer das ganze Volumen — nur der Teil unter Wasser zählt!',
      'Bei Prüfungsaufgaben: Auf die Einheiten achten! Manchmal wird in cm³ gefragt (1 Liter = 1.000 cm³).'
    ],
    quiz: {
      question: 'Ein Gegenstand mit 12 Litern Volumen ist komplett unter Wasser (Dichte 1 kg/L). Wie gross ist der Auftrieb?',
      options: ['6 kg', '12 kg', '24 kg'],
      correctIndex: 1,
      explanation: '12 Liter × 1 kg/L = 12 kg Auftrieb.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Praxis',
    title: 'Auftrieb im Schwimmbadalltag',
    intro:
      'Auftrieb begegnet dir im Schwimmbad überall: Rettungsringe, Schwimmhilfen, Poolnudeln, aufblasbare Tiere — alles funktioniert mit Auftrieb. Auch warum Menschen schwimmen oder untergehen, hat mit Auftrieb zu tun. Hier uebst du mit echten Beispielen aus dem Bad.',
    motto: 'Im Schwimmbad ist Auftrieb überall.',
    rules: [
      'Rettungsgeräte müssen genug Auftrieb haben, um eine Person über Wasser zu halten (mind. 8-10 kg Auftrieb).',
      'Menschen haben eine Dichte von ca. 0,95-1,05 kg/L — deshalb schwimmen manche knapp und andere gehen leicht unter.',
      'Mit Luft in der Lunge sinkt die Körperdichte — man schwimmt besser. Ausatmen = man sinkt leichter.',
      'Schwimmhilfen für Kinder müssen zum Körpergewicht passen — zu wenig Auftrieb ist gefährlich!',
      'Im Solebecken schwebt man leichter, weil Salzwasser eine höhere Dichte hat als normales Wasser.'
    ],
    steps: [
      {
        title: '1. Auftrieb im Rettungswesen',
        text: 'Rettungsringe und -bälle müssen mindestens 14,5 kg Auftrieb haben (Norm). So können sie eine erwachsene Person über Wasser halten, bis Hilfe kommt.'
      },
      {
        title: '2. Schwimmhilfen richtig einsetzen',
        text: 'Schwimmfluegel, Bretter und Nudeln geben Auftrieb. Ein Schwimmbrett mit 3 Litern Volumen gibt ca. 3 kg Auftrieb — genug, um den Oberkörper eines Kindes zu stuetzen.'
      },
      {
        title: '3. Warum Menschen schwimmen',
        text: 'Der menschliche Körper ist fast so dicht wie Wasser. Mit voller Lunge (mehr Volumen, gleich schwer) schwimmt man. Nach dem Ausatmen (weniger Volumen) sinkt man eher.'
      },
      {
        title: '4. Beckenreinigung und Auftrieb',
        text: 'Saugroboter am Beckenboden brauchen Gewicht, das größer ist als ihr Auftrieb, sonst schwimmen sie hoch. Schlaeuche werden oft mit Gewichten beschwert.'
      }
    ],
    examples: [
      {
        title: 'Rettungsring prüfen',
        given: 'Ein Rettungsring hat 18 Liter Volumen und wiegt 2,5 kg. Eine Person wiegt 80 kg.',
        question: 'Reicht der Auftrieb, um die Person zu stuetzen?',
        steps: [
          ['Auftrieb', '18 L × 1 kg/L = 18 kg'],
          ['Minus Eigengewicht', '18 - 2,5 = 15,5 kg nutzbar'],
          ['Person', 'Die Person braucht ca. 5-8 kg Auftrieb (Kopf über Wasser)'],
          ['Ergebnis', '15,5 kg > 8 kg — der Ring reicht! Die Person kann sich festhalten.']
        ]
      },
      {
        title: 'Poolnudel als Schwimmhilfe',
        given: 'Eine Poolnudel hat ca. 3 Liter Volumen und wiegt 0,1 kg.',
        question: 'Wie viel Auftrieb gibt eine Poolnudel?',
        steps: [
          ['Auftrieb', '3 L × 1 kg/L = 3 kg'],
          ['Minus Eigengewicht', '3 - 0,1 = 2,9 kg nutzbar'],
          ['Einordnung', 'Für ein kleines Kind (15-20 kg) reicht EINE Nudel nicht als alleinige Schwimmhilfe'],
          ['Ergebnis', '2,9 kg nutzbarer Auftrieb — gut als Stuetze, nicht als Rettungsmittel']
        ]
      },
      {
        title: 'Mensch im Solebecken',
        given: 'Ein Mensch (75 kg, 73 Liter Körpervolumen) geht in ein Solebecken (Dichte 1,08 kg/L).',
        question: 'Schwimmt er besser als im normalen Becken?',
        steps: [
          ['Normales Wasser', '73 L × 1,00 kg/L = 73 kg Auftrieb (knapp unter 75 kg)'],
          ['Solebecken', '73 L × 1,08 kg/L = 78,8 kg Auftrieb'],
          ['Vergleich', '78,8 kg Auftrieb > 75 kg Gewicht → er schwimmt!'],
          ['Ergebnis', 'Im Solebecken schwebt man, im normalen Wasser sinkt man leicht']
        ]
      },
      {
        title: 'Aufblasbares Spielzeug',
        given: 'Ein aufblasbarer Delfin hat 40 Liter Volumen und wiegt 0,8 kg.',
        question: 'Wie viel kann ein Kind wiegen, das sich draufsetzt?',
        steps: [
          ['Auftrieb', '40 L × 1 kg/L = 40 kg'],
          ['Minus Eigengewicht', '40 - 0,8 = 39,2 kg nutzbar'],
          ['Sicherheit', 'Nur ca. 50-60% nutzen, damit es stabil bleibt ≈ 20-24 kg'],
          ['Ergebnis', 'Geeignet für Kinder bis ca. 20-24 kg — mit Aufsicht!']
        ]
      }
    ],
    pitfalls: [
      'Aufblasbare Spielzeuge sind KEINE Rettungsmittel — sie können Luft verlieren!',
      'Schwimmhilfen ersetzen NICHT die Aufsicht — ein Kind mit Schwimmfluegeln kann trotzdem in Gefahr sein.',
      'Die Körperdichte aendert sich: Mit Luft in der Lunge schwimmt man, ohne sinkt man. Das ist wichtig bei der Rettung!',
      'Salzwasser gibt mehr Auftrieb — aber Vorsicht: Badegaeste unterschaetzen oft die Stroemung in Solebecken.'
    ],
    quiz: {
      question: 'Eine Schwimmhilfe hat 6 Liter Volumen und wiegt 0,5 kg. Wie viel nutzbarer Auftrieb bleibt?',
      options: ['5,5 kg', '6 kg', '6,5 kg'],
      correctIndex: 0,
      explanation: '6 Liter × 1 kg/L = 6 kg Auftrieb. Minus 0,5 kg Eigengewicht = 5,5 kg nutzbarer Auftrieb.'
    }
  }
};

const TAB_ORDER = ['grundlagen', 'schwimmen_sinken', 'berechnung', 'praxis'];

/* ─── Comparison table for Schwimmen vs Sinken ─────────────────────────────── */

const COMPARISON = [
  ['Zustand', 'Schwimmen', 'Sinken'],
  ['Bedingung', 'Auftrieb > Gewicht', 'Gewicht > Auftrieb'],
  ['Dichte', 'Gegenstand leichter als Wasser', 'Gegenstand schwerer als Wasser'],
  ['Beispiel', 'Holz, Schwimmhilfen, Boote', 'Steine, Metall, Tauchringe'],
  ['Im Bad', 'Rettungsring, Poolnudel', 'Tauchring, Saugroboter'],
  ['Körper', 'Mit Luft in der Lunge', 'Nach dem Ausatmen']
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

export default function AuftriebDeepDiveView() {
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

          {/* Comparison table (on schwimmen_sinken and berechnung tabs) */}
          {(activeTab === 'schwimmen_sinken' || activeTab === 'berechnung') && (
            <InfoCard darkMode={darkMode} title="Vergleich: Schwimmen vs. Sinken">
              <div className="overflow-hidden rounded-xl border border-transparent">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={darkMode ? 'border-slate-800' : 'border-gray-200'}>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-slate-950/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`} />
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                        Schwimmen
                      </th>
                      <th className={`px-3 py-2 text-left font-semibold ${darkMode ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                        Sinken
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map(([label, swim, sink]) => (
                      <tr key={label} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                          {label}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {swim}
                        </td>
                        <td className={`px-3 py-2 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                          {sink}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          )}

          {/* Quick info helper (on grundlagen and praxis tabs) */}
          {(activeTab === 'grundlagen' || activeTab === 'praxis') && (
            <InfoCard darkMode={darkMode} title="Schnell-Check: Schwimmt es?">
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                    Es schwimmt?
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Frag dich: &quot;Ist der Auftrieb GROESSER als das Gewicht?&quot;
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Rettungsring: 18 kg Auftrieb &gt; 2,5 kg Gewicht? JA → schwimmt
                  </p>
                </div>
                <div className={`rounded-xl border p-3 ${darkMode ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                    Es sinkt?
                  </div>
                  <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Frag dich: &quot;Ist das Gewicht GROESSER als der Auftrieb?&quot;
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Tauchring: 0,25 kg Gewicht &gt; 0,1 kg Auftrieb? JA → sinkt
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
