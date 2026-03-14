import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { PERIODIC_TABLE, POOL_CHEMICALS } from '../../../data/chemistry';

const SUBSCRIPT_TO_ASCII = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9'
};

const normalizeFormula = (formula = '') => formula.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (char) => SUBSCRIPT_TO_ASCII[char] || char);

const CHEMICAL_USE_BY_FORMULA = new Map(
  POOL_CHEMICALS.map((chemical) => [normalizeFormula(chemical.formula), chemical.use])
);

const ELEMENT_SYMBOLS = ['H', 'O', 'Na', 'Cl', 'Ca', 'C', 'S', 'Al'];
const ELEMENT_OVERVIEW = ELEMENT_SYMBOLS.map((symbol) => {
  const entry = PERIODIC_TABLE.find((item) => item.symbol === symbol);
  return {
    symbol,
    name: entry?.name || symbol
  };
});

const FORMULA_LIBRARY = {
  wasser: {
    id: 'wasser',
    formula: 'H2O',
    name: 'Wasser',
    atoms: [
      ['H', 'Wasserstoff', 2],
      ['O', 'Sauerstoff', 1]
    ],
    note: 'Die 2 gilt nur fuer H. Hinter O steht keine Zahl, also ist O einmal vorhanden.',
    use: 'Grundstoff jedes Beckenwassers.'
  },
  kohlendioxid: {
    id: 'kohlendioxid',
    formula: 'CO2',
    name: 'Kohlenstoffdioxid',
    atoms: [
      ['C', 'Kohlenstoff', 1],
      ['O', 'Sauerstoff', 2]
    ],
    note: 'Die 2 steht direkt hinter O und zaehlt deshalb nur fuer Sauerstoff.',
    use: 'Einfaches Beispiel fuer eine Formel mit nur einer Zahl.'
  },
  natriumchlorid: {
    id: 'natriumchlorid',
    formula: 'NaCl',
    name: 'Natriumchlorid',
    atoms: [
      ['Na', 'Natrium', 1],
      ['Cl', 'Chlor', 1]
    ],
    note: 'Zwei Symbole ohne Zahl bedeuten: beide Elemente kommen jeweils einmal vor.',
    use: 'Salz im Solebetrieb oder als Grundstoff fuer Elektrolyse.'
  },
  natriumhypochlorit: {
    id: 'natriumhypochlorit',
    formula: 'NaClO',
    name: 'Natriumhypochlorit',
    atoms: [
      ['Na', 'Natrium', 1],
      ['Cl', 'Chlor', 1],
      ['O', 'Sauerstoff', 1]
    ],
    note: 'Hier fehlen Zahlen komplett. Damit gilt fuer alle drei Elemente die Anzahl 1.',
    use: CHEMICAL_USE_BY_FORMULA.get('NaClO') || 'Fluessigchlor zur Desinfektion.'
  },
  salzsaeure: {
    id: 'salzsaeure',
    formula: 'HCl',
    name: 'Salzsaeure',
    atoms: [
      ['H', 'Wasserstoff', 1],
      ['Cl', 'Chlor', 1]
    ],
    note: 'H und Cl stehen jeweils einmal da. Keine Zahl bedeutet immer 1.',
    use: CHEMICAL_USE_BY_FORMULA.get('HCl') || 'Starker pH-Senker.'
  },
  schwefelsaeure: {
    id: 'schwefelsaeure',
    formula: 'H2SO4',
    name: 'Schwefelsaeure',
    atoms: [
      ['H', 'Wasserstoff', 2],
      ['S', 'Schwefel', 1],
      ['O', 'Sauerstoff', 4]
    ],
    note: 'Mehrere Zahlen koennen in einer Formel vorkommen. Jede Zahl gehoert nur zu dem Symbol direkt davor.',
    use: CHEMICAL_USE_BY_FORMULA.get('H2SO4') || 'Starker pH-Senker in technischen Anwendungen.'
  },
  calciumhypochlorit: {
    id: 'calciumhypochlorit',
    formula: 'Ca(ClO)2',
    name: 'Calciumhypochlorit',
    atoms: [
      ['Ca', 'Calcium', 1],
      ['Cl', 'Chlor', 2],
      ['O', 'Sauerstoff', 2]
    ],
    note: 'Die 2 hinter der Klammer gilt fuer die ganze Gruppe ClO. Dadurch werden Chlor und Sauerstoff jeweils verdoppelt.',
    use: CHEMICAL_USE_BY_FORMULA.get('Ca(ClO)2') || 'Chlorgranulat fuer die Desinfektion.'
  },
  aluminiumsulfat: {
    id: 'aluminiumsulfat',
    formula: 'Al2(SO4)3',
    name: 'Aluminiumsulfat',
    atoms: [
      ['Al', 'Aluminium', 2],
      ['S', 'Schwefel', 3],
      ['O', 'Sauerstoff', 12]
    ],
    note: 'SO4 steht dreimal da. Deshalb entstehen 3 Schwefelatome und 3 mal 4, also 12 Sauerstoffatome.',
    use: CHEMICAL_USE_BY_FORMULA.get('Al2(SO4)3') || 'Flockungsmittel in der Wasseraufbereitung.'
  }
};

const TOPICS = {
  symbole: {
    id: 'symbole',
    chip: 'Grundlage',
    title: 'Chemische Formeln verstehen',
    intro: 'Chemische Formeln wirken zuerst kompliziert, folgen aber ein paar einfachen Regeln. Wenn du Symbole, Zahlen und Klammern sauber liest, kannst du jede Formel Schritt fuer Schritt zerlegen.',
    motto: 'Grossbuchstabe = neues Element. Zahl = Anzahl. Klammer = Gruppe.',
    formulaRules: [
      'Ein Grossbuchstabe startet immer ein neues Elementsymbol.',
      'Ein Kleinbuchstabe gehoert zum selben Symbol, zum Beispiel Na oder Cl.',
      'Steht keine Zahl hinter einem Symbol, ist die Anzahl automatisch 1.'
    ],
    steps: [
      {
        title: '1. Suche die Elementsymbole',
        text: 'Lies zuerst nur die Buchstaben. H, O, Na, Cl oder Ca sind die Bausteine der Formel.'
      },
      {
        title: '2. Achte auf Kleinbuchstaben',
        text: 'Na ist etwas anderes als N und a. Kleinbuchstaben gehoeren immer zum Symbol davor.'
      },
      {
        title: '3. Pruefe, ob eine Zahl folgt',
        text: 'Wenn direkt hinter einem Symbol eine Zahl steht, sagt sie dir die Anzahl der Atome.'
      },
      {
        title: '4. Sprich die Formel laut aus',
        text: 'Zum Beispiel H2O: zwei Wasserstoff, ein Sauerstoff.'
      }
    ],
    exampleTitle: 'Wichtige Symbole fuer den Einstieg',
    exampleRows: ELEMENT_OVERVIEW.map((element) => [element.symbol, element.name]),
    formulaIds: ['wasser', 'natriumchlorid', 'natriumhypochlorit'],
    pitfalls: [
      'Na ist ein einziges Symbol. Es sind nicht zwei getrennte Zeichen.',
      'Fehlt eine Zahl, dann ist die Anzahl nicht 0, sondern 1.',
      'Nicht direkt Stoffname und Elementsymbol verwechseln.'
    ],
    quiz: {
      question: 'Wofuer steht das Symbol Cl?',
      options: ['Calcium', 'Chlor', 'Kohlenstoff'],
      correctIndex: 1,
      explanation: 'Cl ist das Elementsymbol fuer Chlor. Calcium hat das Symbol Ca.'
    }
  },
  zahlen: {
    id: 'zahlen',
    chip: 'Anzahl',
    title: 'Zahlen in Formeln richtig lesen',
    intro: 'Die kleinen Zahlen sagen dir, wie oft ein Element in der Formel vorkommt. Sie gelten immer nur fuer das Symbol direkt davor.',
    motto: 'Eine Zahl zaehlt nur das Element direkt vor ihr.',
    formulaRules: [
      'H2 bedeutet: Wasserstoff kommt zweimal vor.',
      'O4 bedeutet: Sauerstoff kommt viermal vor.',
      'Steht keine Zahl da, bleibt die Anzahl 1.'
    ],
    steps: [
      {
        title: '1. Lies die Formel von links nach rechts',
        text: 'So erkennst du, an welchem Symbol eine Zahl haengt.'
      },
      {
        title: '2. Merke dir: keine Zahl = 1',
        text: 'Bei CO2 ist C einmal vorhanden, weil hinter C keine Zahl steht.'
      },
      {
        title: '3. Schreibe die Anzahl je Element auf',
        text: 'So verlierst du bei mehreren Symbolen nicht den Ueberblick.'
      },
      {
        title: '4. Kontrolliere die Einheit am Ende',
        text: 'Du zaehlst Atome in der Formel, nicht Liter, Kilogramm oder Prozent.'
      }
    ],
    exampleTitle: 'Einfache Formeln mit Zahlen',
    exampleRows: [
      ['H2O', '2 x H, 1 x O'],
      ['CO2', '1 x C, 2 x O'],
      ['H2SO4', '2 x H, 1 x S, 4 x O']
    ],
    formulaIds: ['wasser', 'kohlendioxid', 'schwefelsaeure'],
    pitfalls: [
      'Die Zahl 2 in CO2 zaehlt nicht den ganzen Stoff, sondern nur O.',
      'Bei H2SO4 hat jedes Element seine eigene Anzahl.',
      'Nicht vergessen: Wenn keine Zahl folgt, bleibt das Element einmal vorhanden.'
    ],
    quiz: {
      question: 'Wie viele Sauerstoffatome sind in H2SO4 enthalten?',
      options: ['2', '4', '6'],
      correctIndex: 1,
      explanation: 'Die 4 hinter O zeigt direkt an: Sauerstoff kommt viermal vor.'
    }
  },
  klammern: {
    id: 'klammern',
    chip: 'Klammer',
    title: 'Klammern in Formeln verstehen',
    intro: 'Klammern fassen eine Gruppe zusammen. Die Zahl hinter der Klammer vervielfacht alles, was in der Klammer steht.',
    motto: 'Die Zahl hinter der Klammer zaehlt die ganze Gruppe.',
    formulaRules: [
      'ClO in einer Klammer ist eine feste Gruppe.',
      'Ca(ClO)2 bedeutet: die Gruppe ClO kommt zweimal vor.',
      'Bei Al2(SO4)3 wird SO4 dreimal genommen.'
    ],
    steps: [
      {
        title: '1. Bestimme zuerst das Symbol ausserhalb der Klammer',
        text: 'Bei Ca(ClO)2 steht Calcium ausserhalb und bleibt daher einmal vorhanden.'
      },
      {
        title: '2. Lies die Gruppe in der Klammer',
        text: 'In ClO steckt einmal Chlor und einmal Sauerstoff.'
      },
      {
        title: '3. Multipliziere mit der Zahl hinter der Klammer',
        text: 'Die 2 macht aus einem Chlor zwei Chlor und aus einem Sauerstoff zwei Sauerstoff.'
      },
      {
        title: '4. Schreibe das Endergebnis sauber auf',
        text: 'Ca(ClO)2 ergibt also: 1 x Ca, 2 x Cl, 2 x O.'
      }
    ],
    exampleTitle: 'Formeln mit Klammern',
    exampleRows: [
      ['Ca(ClO)2', '1 x Ca, 2 x Cl, 2 x O'],
      ['Al2(SO4)3', '2 x Al, 3 x S, 12 x O']
    ],
    formulaIds: ['calciumhypochlorit', 'aluminiumsulfat'],
    pitfalls: [
      'Die Zahl hinter der Klammer zaehlt nicht nur das letzte Symbol, sondern die ganze Gruppe.',
      'SO4 mal 3 bedeutet 3 Schwefel und 12 Sauerstoff.',
      'Erst Klammer verstehen, dann das Gesamtergebnis aufschreiben.'
    ],
    quiz: {
      question: 'Wie viele Sauerstoffatome sind in Ca(ClO)2 enthalten?',
      options: ['1', '2', '4'],
      correctIndex: 1,
      explanation: 'ClO kommt zweimal vor. Deshalb sind 2 Sauerstoffatome enthalten.'
    }
  },
  baederbetrieb: {
    id: 'baederbetrieb',
    chip: 'Praxis',
    title: 'Formeln aus dem Baederbetrieb lesen',
    intro: 'Im Schwimmbad begegnen dir Formeln nicht nur im Unterricht, sondern auf Gebinden, Sicherheitsdatenblaettern und Dosieranlagen. Wer die Formel lesen kann, versteht den Stoff schneller.',
    motto: 'Erst Formel lesen, dann Stoff und Einsatz einordnen.',
    formulaRules: [
      'Die Formel zeigt, welche Elemente im Stoff enthalten sind.',
      'Der Stoffname sagt dir, um welchen Stoff es geht.',
      'Der Einsatz im Betrieb ist ein eigener Schritt und steht nicht direkt in der Formel.'
    ],
    steps: [
      {
        title: '1. Lies die Formel technisch sauber',
        text: 'Erkenne zuerst Symbole, Zahlen und Klammern, bevor du den Stoff bewertest.'
      },
      {
        title: '2. Verbinde Formel und Stoffname',
        text: 'NaClO ist Natriumhypochlorit, HCl ist Salzsaeure.'
      },
      {
        title: '3. Ordne den Einsatzzweck zu',
        text: 'Ein Stoff kann zur Desinfektion, zur pH-Korrektur oder zur Flockung eingesetzt werden.'
      },
      {
        title: '4. Trenne Formel und Sicherheit',
        text: 'Die Formel hilft beim Verstehen. Schutzmassnahmen liest du trotzdem immer im Sicherheitsdatenblatt nach.'
      }
    ],
    exampleTitle: 'Typische Stoffe im Schwimmbad',
    exampleRows: [
      ['NaClO', CHEMICAL_USE_BY_FORMULA.get('NaClO') || 'Fluessigchlor zur Desinfektion'],
      ['Ca(ClO)2', CHEMICAL_USE_BY_FORMULA.get('Ca(ClO)2') || 'Chlorgranulat zur Desinfektion'],
      ['HCl', CHEMICAL_USE_BY_FORMULA.get('HCl') || 'pH-Senker'],
      ['Al2(SO4)3', CHEMICAL_USE_BY_FORMULA.get('Al2(SO4)3') || 'Flockungsmittel']
    ],
    formulaIds: ['natriumhypochlorit', 'calciumhypochlorit', 'salzsaeure', 'aluminiumsulfat'],
    pitfalls: [
      'Die Formel verrät nicht automatisch die Konzentration des Produkts.',
      'Gleiche Elemente bedeuten nicht automatisch gleiche Gefahr oder gleiche Wirkung.',
      'Einsatzgebiet und Schutzmassnahmen immer getrennt betrachten.'
    ],
    quiz: {
      question: 'Welche Elemente stecken in NaClO?',
      options: [
        'Natrium, Chlor und Sauerstoff',
        'Natrium, Calcium und Sauerstoff',
        'Natrium und Chlor'
      ],
      correctIndex: 0,
      explanation: 'Na = Natrium, Cl = Chlor und O = Sauerstoff.'
    }
  }
};

const TOPIC_ORDER = ['symbole', 'zahlen', 'klammern', 'baederbetrieb'];

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

function FormulaText({ formula }) {
  return (
    <span aria-label={formula}>
      {formula.split('').map((char, index) => (
        /\d/.test(char)
          ? <sub key={`${char}-${index}`}>{char}</sub>
          : <span key={`${char}-${index}`}>{char}</span>
      ))}
    </span>
  );
}

export default function ChemicalFormulasDeepDiveView() {
  const { darkMode } = useApp();
  const [activeTopicId, setActiveTopicId] = useState('symbole');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [revealedAnswer, setRevealedAnswer] = useState(false);

  const topic = TOPICS[activeTopicId] || TOPICS.symbole;
  const focusedFormulas = topic.formulaIds.map((formulaId) => FORMULA_LIBRARY[formulaId]).filter(Boolean);
  const isCorrect = selectedAnswer === topic.quiz.correctIndex;

  const handleTopicChange = (topicId) => {
    setActiveTopicId(topicId);
    setSelectedAnswer(null);
    setRevealedAnswer(false);
  };

  return (
    <div className="space-y-5">
      <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50 border-blue-100'}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${darkMode ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
              <span>CHEMIE</span>
              <span>{topic.chip}</span>
            </div>
            <h2 className={`text-3xl font-bold mt-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {topic.title}
            </h2>
            <p className={`text-sm mt-3 leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {topic.intro}
            </p>
          </div>
          <div className={`rounded-2xl px-4 py-3 border ${darkMode ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/90 border-blue-100 text-gray-700'}`}>
            <div className="text-xs uppercase tracking-wide opacity-70">Merksatz</div>
            <div className="text-sm font-semibold mt-1">{topic.motto}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {TOPIC_ORDER.map((topicId) => {
          const entry = TOPICS[topicId];
          const active = topicId === activeTopicId;
          return (
            <button
              key={topicId}
              type="button"
              onClick={() => handleTopicChange(topicId)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                active
                  ? darkMode
                    ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-900/20'
                    : 'border-blue-300 bg-blue-50 shadow-sm'
                  : darkMode
                    ? 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                    : 'border-gray-200 bg-white hover:border-blue-200'
              }`}
            >
              <div className={`text-xs font-bold uppercase tracking-wide ${active ? (darkMode ? 'text-blue-300' : 'text-blue-700') : (darkMode ? 'text-slate-400' : 'text-gray-500')}`}>
                {entry.chip}
              </div>
              <div className={`text-base font-semibold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {entry.title}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <InfoCard darkMode={darkMode} title="Regeln auf einen Blick">
            <ul className={`space-y-2 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {topic.formulaRules.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <span className={`mt-2 h-2 w-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`} />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard darkMode={darkMode} title="Schritt fuer Schritt">
            <div className="grid gap-3 md:grid-cols-2">
              {topic.steps.map((step) => (
                <div
                  key={step.title}
                  className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-blue-100 bg-blue-50/60'}`}
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
          </InfoCard>

          <InfoCard darkMode={darkMode} title={topic.exampleTitle}>
            <div className="overflow-hidden rounded-2xl border border-transparent">
              <table className="min-w-full text-sm">
                <tbody>
                  {topic.exampleRows.map(([left, right]) => (
                    <tr key={`${left}-${right}`} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                      <td className={`px-4 py-3 font-semibold ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                        {left}
                      </td>
                      <td className={`px-4 py-3 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                        {right}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InfoCard>
        </div>

        <div className="space-y-5">
          <InfoCard darkMode={darkMode} title="Typische Fehler">
            <ul className={`space-y-2 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {topic.pitfalls.map((pitfall) => (
                <li key={pitfall} className="flex gap-2">
                  <span className={`mt-2 h-2 w-2 rounded-full ${darkMode ? 'bg-amber-400' : 'bg-amber-500'}`} />
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard darkMode={darkMode} title="Mini-Quiz">
            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {topic.quiz.question}
            </div>
            <div className="mt-4 space-y-2">
              {topic.quiz.options.map((option, index) => {
                const active = selectedAnswer === index;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      active
                        ? darkMode
                          ? 'border-blue-400 bg-blue-500/10 text-white'
                          : 'border-blue-300 bg-blue-50 text-gray-900'
                        : darkMode
                          ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200'
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
                    ? 'bg-blue-500 text-white hover:bg-blue-400'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
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
                  {isCorrect ? 'Richtig.' : 'Noch nicht ganz.'}
                </div>
                <div>{topic.quiz.explanation}</div>
              </div>
            )}
          </InfoCard>
        </div>
      </div>

      <InfoCard darkMode={darkMode} title="Formeln zerlegen">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {focusedFormulas.map((entry) => (
            <div
              key={entry.id}
              className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-blue-100 bg-blue-50/40'}`}
            >
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <FormulaText formula={entry.formula} />
              </div>
              <div className={`text-sm font-semibold mt-2 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                {entry.name}
              </div>
              <ul className={`mt-3 space-y-2 text-sm leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                {entry.atoms.map(([symbol, name, amount]) => (
                  <li key={`${entry.id}-${symbol}`} className="flex items-start justify-between gap-3">
                    <span>{symbol} = {name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-700'}`}>
                      x {amount}
                    </span>
                  </li>
                ))}
              </ul>
              <div className={`mt-3 rounded-xl border p-3 text-sm leading-6 ${darkMode ? 'border-slate-800 bg-slate-900/60 text-slate-300' : 'border-white bg-white text-gray-700'}`}>
                {entry.note}
              </div>
              <div className={`mt-3 text-xs leading-6 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Einsatz: {entry.use}
              </div>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  );
}
