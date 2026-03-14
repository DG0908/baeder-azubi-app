import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const TOPICS = {
  dreisatz: {
    id: 'dreisatz',
    chip: 'Grundlage',
    title: 'Dreisatz in kleinen Schritten',
    intro: 'Der Dreisatz hilft dir immer dann, wenn du von einem bekannten Wert auf einen anderen Wert umrechnen willst.',
    motto: 'Erst auf 1, dann auf den Zielwert.',
    formula: ['Gegebenen Wert auf 1 Einheit herunterrechnen', 'Danach mit dem Zielwert multiplizieren'],
    steps: [
      {
        title: '1. Schreibe auf, was zusammengehoert',
        text: 'Zum Beispiel: 4 Stunden entsprechen 120 m3 Wasser.'
      },
      {
        title: '2. Rechne auf 1 Einheit',
        text: 'Teile beide Werte durch 4. Dann weisst du: 1 Stunde entspricht 30 m3.'
      },
      {
        title: '3. Rechne auf deinen Zielwert',
        text: 'Wenn du 7 Stunden suchst, rechnest du 30 m3 mal 7.'
      },
      {
        title: '4. Schreibe das Ergebnis mit Einheit',
        text: '30 mal 7 = 210 m3 in 7 Stunden.'
      }
    ],
    exampleTitle: 'Beispiel aus dem Badebetrieb',
    exampleRows: [
      ['Gegeben', '4 h -> 120 m3'],
      ['Auf 1 h', '120 : 4 = 30 m3'],
      ['Auf 7 h', '30 x 7 = 210 m3'],
      ['Ergebnis', '7 h -> 210 m3']
    ],
    pitfalls: [
      'Nicht verschiedene Einheiten mischen. Erst alles in dieselbe Einheit bringen.',
      'Immer pruefen: Wird der Wert groesser oder kleiner? Das muss zum Ergebnis passen.',
      'Die Einheit immer mitschreiben, sonst wird es schnell unklar.'
    ],
    quiz: {
      question: '6 kg Chlorgranulat reichen fuer 3 Tage. Wie viel wird fuer 5 Tage benoetigt?',
      options: [
        '8 kg',
        '10 kg',
        '12 kg'
      ],
      correctIndex: 1,
      explanation: '6 : 3 = 2 kg pro Tag. 2 x 5 = 10 kg.'
    }
  },
  prozent: {
    id: 'prozent',
    chip: 'Pruefung',
    title: 'Prozentrechnung einfach erklaert',
    intro: 'Bei Prozenten geht es immer um einen Anteil von 100. Du fragst also: Wie viel ist ein Teil vom Ganzen?',
    motto: 'Grundwert mal Prozentsatz.',
    formula: ['Prozentsatz in eine Dezimalzahl umwandeln', 'Dann mit dem Grundwert multiplizieren'],
    steps: [
      {
        title: '1. Bestimme den Grundwert',
        text: 'Das ist die ganze Menge. Beispiel: 800 Badegaeste am Tag.'
      },
      {
        title: '2. Wandle den Prozentsatz um',
        text: '15 % bedeutet 15 von 100. Also 0,15.'
      },
      {
        title: '3. Multipliziere',
        text: '800 mal 0,15 = 120.'
      },
      {
        title: '4. Pruefe den Sinn',
        text: '15 % ist deutlich weniger als die Haelfte. 120 passt also gut.'
      }
    ],
    exampleTitle: 'Beispiel aus dem Badebetrieb',
    exampleRows: [
      ['Grundwert', '800 Badegaeste'],
      ['Prozentsatz', '15 % = 0,15'],
      ['Rechnung', '800 x 0,15 = 120'],
      ['Ergebnis', '120 Badegaeste']
    ],
    pitfalls: [
      '15 % ist nicht 15, sondern 0,15.',
      'Prozent von einer Menge ist meist kleiner als der Grundwert.',
      'Erst lesen: Suchst du den Anteil, den Grundwert oder den Prozentsatz?'
    ],
    quiz: {
      question: 'Von 250 Schuelern gehen 40 % ins Hallenbad. Wie viele Schueler sind das?',
      options: [
        '100',
        '75',
        '125'
      ],
      correctIndex: 0,
      explanation: '40 % = 0,4. 250 x 0,4 = 100.'
    }
  },
  volumen: {
    id: 'volumen',
    chip: 'Praxis',
    title: 'Beckenvolumen Schritt fuer Schritt',
    intro: 'Beim Beckenvolumen rechnest du meist Laenge mal Breite mal mittlere Tiefe.',
    motto: 'Laenge x Breite x Tiefe.',
    formula: ['Erst die Flaeche berechnen', 'Dann mit der Tiefe multiplizieren'],
    steps: [
      {
        title: '1. Messe Laenge und Breite',
        text: 'Beispiel: Das Becken ist 25 m lang und 10 m breit.'
      },
      {
        title: '2. Berechne die Flaeche',
        text: '25 x 10 = 250 m2.'
      },
      {
        title: '3. Nutze die mittlere Tiefe',
        text: 'Wenn die Tiefe im Mittel 1,8 m ist, rechnest du 250 x 1,8.'
      },
      {
        title: '4. Ergebnis in m3 und Liter lesen',
        text: '250 x 1,8 = 450 m3. Das sind 450.000 Liter.'
      }
    ],
    exampleTitle: 'Beispiel aus dem Badebetrieb',
    exampleRows: [
      ['Laenge x Breite', '25 x 10 = 250 m2'],
      ['Mit Tiefe', '250 x 1,8 = 450 m3'],
      ['Umrechnung', '450 m3 = 450.000 Liter'],
      ['Ergebnis', 'Beckenvolumen 450 m3']
    ],
    pitfalls: [
      'Bei unterschiedlich tiefen Becken die mittlere Tiefe verwenden.',
      'm3 und Liter nicht verwechseln. 1 m3 = 1.000 Liter.',
      'Flaeche ist noch nicht Volumen. Die Tiefe kommt immer noch dazu.'
    ],
    quiz: {
      question: 'Ein Lehrschwimmbecken ist 12 m lang, 8 m breit und 1,25 m tief. Wie gross ist das Volumen?',
      options: [
        '96 m3',
        '120 m3',
        '76 m3'
      ],
      correctIndex: 1,
      explanation: '12 x 8 = 96 m2. 96 x 1,25 = 120 m3.'
    }
  },
  zeit: {
    id: 'zeit',
    chip: 'Alltag',
    title: 'Zeit und Industriestunden',
    intro: 'Im Betrieb brauchst du oft normale Uhrzeit und manchmal Industriestunden. Beides muss sicher umgerechnet werden.',
    motto: 'Minuten zuerst sauber trennen.',
    formula: ['Normale Zeit: 1 Stunde = 60 Minuten', 'Industriestunde: 1 Stunde = 100 Hundertstel'],
    steps: [
      {
        title: '1. Normale Zeit lesen',
        text: 'Beispiel: 2 Stunden 30 Minuten.'
      },
      {
        title: '2. Minuten in Stundenanteil umrechnen',
        text: '30 Minuten sind 30 : 60 = 0,5 Stunden.'
      },
      {
        title: '3. Zusammenfassen',
        text: '2 Stunden + 0,5 Stunden = 2,5 Stunden.'
      },
      {
        title: '4. Bei Industriestunden auf zwei Stellen runden',
        text: 'Zum Beispiel 45 Minuten = 45 : 60 = 0,75 Stunden.'
      }
    ],
    exampleTitle: 'Beispiel aus dem Badebetrieb',
    exampleRows: [
      ['Gegeben', '3 h 45 min'],
      ['Minuten umrechnen', '45 : 60 = 0,75 h'],
      ['Zusammenfassen', '3 + 0,75 = 3,75 h'],
      ['Ergebnis', '3,75 Industriestunden']
    ],
    pitfalls: [
      '45 Minuten sind nicht 0,45 Stunden, sondern 0,75 Stunden.',
      'Bei Uhrzeit rechnest du mit 60 Minuten, nicht mit 100.',
      'Immer klar trennen: Uhrzeit oder Industriestunde?'
    ],
    quiz: {
      question: 'Wie viele Industriestunden sind 2 h 15 min?',
      options: [
        '2,15 h',
        '2,25 h',
        '2,50 h'
      ],
      correctIndex: 1,
      explanation: '15 : 60 = 0,25. Also 2 + 0,25 = 2,25 h.'
    }
  }
};

const TOPIC_ORDER = ['dreisatz', 'prozent', 'volumen', 'zeit'];

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

export default function MathBasicsDeepDiveView({ initialTopic = 'dreisatz' }) {
  const { darkMode } = useApp();
  const [activeTopicId, setActiveTopicId] = useState(TOPICS[initialTopic] ? initialTopic : 'dreisatz');
  const [revealedAnswer, setRevealedAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const topic = TOPICS[activeTopicId] || TOPICS.dreisatz;

  const handleTopicChange = (topicId) => {
    setActiveTopicId(topicId);
    setRevealedAnswer(false);
    setSelectedAnswer(null);
  };

  const isCorrect = selectedAnswer === topic.quiz.correctIndex;

  return (
    <div className="space-y-5">
      <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-cyan-50 via-white to-sky-50 border-cyan-100'}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${darkMode ? 'bg-cyan-500/15 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>
              <span>MATHEMATIK</span>
              <span>{topic.chip}</span>
            </div>
            <h2 className={`text-3xl font-bold mt-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {topic.title}
            </h2>
            <p className={`text-sm mt-3 leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {topic.intro}
            </p>
          </div>
          <div className={`rounded-2xl px-4 py-3 border ${darkMode ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/90 border-cyan-100 text-gray-700'}`}>
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
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-md'
                  : darkMode
                    ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    : 'border-gray-200 bg-white hover:border-cyan-200 hover:shadow-sm'
              }`}
            >
              <div className={`text-xs font-bold uppercase tracking-wide ${active ? 'text-cyan-400' : darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                {entry.chip}
              </div>
              <div className={`text-sm font-semibold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {entry.title}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <InfoCard darkMode={darkMode} title="Schritt fuer Schritt">
          <div className="space-y-3">
            {topic.steps.map((step, index) => (
              <div key={step.title} className={`rounded-2xl p-4 ${darkMode ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {step.title}
                    </div>
                    <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                      {step.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>

        <div className="space-y-5">
          <InfoCard darkMode={darkMode} title="Formelbox">
            <div className="space-y-2">
              {topic.formula.map((line) => (
                <div key={line} className={`rounded-xl px-3 py-2 text-sm ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-cyan-50 text-cyan-900'}`}>
                  {line}
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard darkMode={darkMode} title="Typische Fehler">
            <ul className={`space-y-2 text-sm leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {topic.pitfalls.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-rose-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>
      </div>

      <InfoCard darkMode={darkMode} title={topic.exampleTitle}>
        <div className={`overflow-hidden rounded-2xl border ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className={`grid grid-cols-2 text-xs font-bold uppercase tracking-wide ${darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-gray-500'}`}>
            <div className="px-4 py-3">Schritt</div>
            <div className="px-4 py-3">Rechnung</div>
          </div>
          {topic.exampleRows.map(([label, value]) => (
            <div key={label} className={`grid grid-cols-2 border-t text-sm ${darkMode ? 'border-slate-800 bg-slate-900/40 text-slate-200' : 'border-gray-200 bg-white text-gray-700'}`}>
              <div className="px-4 py-3 font-semibold">{label}</div>
              <div className="px-4 py-3">{value}</div>
            </div>
          ))}
        </div>
      </InfoCard>

      <InfoCard darkMode={darkMode} title="Kurze Lernkontrolle">
        <div className="space-y-4">
          <div>
            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {topic.quiz.question}
            </h4>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {topic.quiz.options.map((option, index) => {
              const showState = revealedAnswer;
              const isAnswerCorrect = index === topic.quiz.correctIndex;
              const isPicked = index === selectedAnswer;

              let className = darkMode
                ? 'border-slate-800 bg-slate-900/70 text-slate-200'
                : 'border-gray-200 bg-white text-gray-700';

              if (showState && isAnswerCorrect) {
                className = 'border-emerald-400 bg-emerald-500/10 text-emerald-700';
              } else if (showState && isPicked && !isAnswerCorrect) {
                className = 'border-rose-400 bg-rose-500/10 text-rose-700';
              } else if (!showState && isPicked) {
                className = 'border-cyan-400 bg-cyan-500/10 text-cyan-700';
              }

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedAnswer(index)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition-all ${className}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setRevealedAnswer(true)}
              disabled={selectedAnswer === null}
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400"
            >
              Antwort pruefen
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedAnswer(null);
                setRevealedAnswer(false);
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-gray-700'}`}
            >
              Neu starten
            </button>
          </div>
          {revealedAnswer && (
            <div className={`rounded-2xl border p-4 text-sm ${
              isCorrect
                ? 'border-emerald-400 bg-emerald-500/10 text-emerald-700'
                : darkMode
                  ? 'border-slate-700 bg-slate-900 text-slate-200'
                  : 'border-gray-200 bg-slate-50 text-gray-700'
            }`}>
              <div className="font-semibold mb-1">
                {isCorrect ? 'Richtig.' : 'Loesung'}
              </div>
              <div>{topic.quiz.explanation}</div>
            </div>
          )}
        </div>
      </InfoCard>
    </div>
  );
}
