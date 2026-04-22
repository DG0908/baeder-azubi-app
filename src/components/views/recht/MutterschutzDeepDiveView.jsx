import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const TABS = {
  mutterschutz: {
    id: 'mutterschutz', chip: 'MuSchG',
    title: 'Mutterschutzgesetz — Schutz vor und nach der Geburt',
    intro: 'Das Mutterschutzgesetz (MuSchG) schützt Schwangere, Wöchnerinnen (bis 8 Wochen nach Geburt) und stillende Mütter vor Gefährdungen am Arbeitsplatz und vor dem Verlust ihres Arbeitsplatzes. Es gilt für alle Arbeitnehmerinnen — auch für Azubis. Im Schwimmbad mit Chemikalien, körperlicher Belastung und Schichtdienst sind die Schutzvorschriften besonders relevant.',
    motto: 'MuSchG schützt Leben — Unwissenheit des Arbeitgebers entschuldigt keine Verletzung.',
    rules: [
      'MuSchG gilt ab Bekanntgabe der Schwangerschaft beim Arbeitgeber — nicht erst ab einem bestimmten Monat.',
      'Mutterschutzfrist: 6 Wochen vor dem errechneten Geburtstermin bis 8 Wochen danach (§3 MuSchG).',
      'In dieser Zeit: Beschäftigungsverbot, vollen Lohn weiterzahlen (Mutterschaftsgeld + Zuschuss).',
      'Kündigungsschutz: Ab Bekanntgabe der Schwangerschaft bis 4 Monate nach der Entbindung (§17 MuSchG).',
      'Gefährdungsbeurteilung: Arbeitgeber muss sofort prüfen ob Gefährdungen für Schwangere vorliegen (§10 MuSchG).',
    ],
    steps: [
      { title: '1. Was passiert wenn eine Mitarbeiterin schwanger ist?', text: 'Mitarbeiterin informiert Arbeitgeber → Arbeitgeber muss sofort Gefährdungsbeurteilung für Schwangere erstellen. Gefährdungen identifizieren (Chemikalien, Lärm, Heben, Infektionsrisiko). Maßnahmen ergreifen: Umgestaltung → Umsetzung → Beschäftigungsverbot. Gesundheitsamt informieren (§15 MuSchG). Arbeitgeber darf Schwangerschaft NICHT an Dritte weitergeben.' },
      { title: '2. Beschäftigungsverbote (§11 MuSchG)', text: 'Allgemeine Verbote: Heben über 10 kg regelmäßig / über 15 kg gelegentlich. Stehen über 4 Stunden täglich ab dem 5. Schwangerschaftsmonat. Akkord- und Fließbandarbeit. Nachtarbeit (22–6 Uhr). Sonn- und Feiertagsarbeit ohne ausdrückliches Einverständnis. Im Bad speziell: Umgang mit Gefahrstoffen (Chlor, Säuren) — direktes Beschäftigungsverbot.' },
      { title: '3. Ärztliches Beschäftigungsverbot (§16 MuSchG)', text: 'Zusätzlich zum gesetzlichen kann ein Arzt ein individuelles Beschäftigungsverbot ausstellen — wenn die Gesundheit von Mutter oder Kind gefährdet ist. Der Arbeitgeber muss dieses akzeptieren. Lohnfortzahlung bleibt: Der Arbeitgeber zahlt den Durchschnittslohn (§18 MuSchG), Erstattung durch Krankenkasse möglich.' },
      { title: '4. Mutterschaftsgeld und Zuschuss', text: 'Während der Mutterschutzfrist (6 Wochen vor + 8 Wochen nach Geburt): Mutterschaftsgeld von der Krankenkasse (max. 13 €/Tag). Arbeitgeber zahlt Zuschuss damit der Nettolohn erhalten bleibt. Erstattung: Arbeitgeber kann Auslagen bei der Krankenkasse U2 (Umlage) zurückfordern. Bei Azubis: Ausbildungsvergütung weiterzahlen.' },
    ],
    examples: [
      {
        title: 'Azubi meldet Schwangerschaft',
        given: 'Eine 17-jährige Azubi im 1. Lehrjahr meldet dem Ausbilder ihre Schwangerschaft. Sie arbeitet in der Wasseraufbereitung mit Chemikalien.',
        question: 'Was muss der Betrieb sofort tun?',
        steps: [
          ['Vertraulichkeit', 'Schwangerschaft nicht weitergeben ohne Einwilligung der Azubi'],
          ['Gefährdungsbeurt.', 'Sofort erstellen: Chemikalien, Heben, Stehen, Infektionsrisiko'],
          ['Umsetzen', 'Azubi sofort aus Chemikalienbereich — z.B. Kasse, Aufsicht ohne Technik'],
          ['Behörde', 'Gewerbeaufsicht/Gesundheitsamt informieren (§15 MuSchG)'],
          ['Vergütung', 'Ausbildungsvergütung läuft weiter — auch bei Versetzung'],
        ],
      },
    ],
    pitfalls: [
      '"Sie hat die Schwangerschaft selbst nicht mitgeteilt" — ab eigener Kenntnis des Arbeitgebers gelten die Schutzpflichten!',
      'Kündigung nach Bekanntgabe der Schwangerschaft ist nichtig — auch wenn der Arbeitgeber "das nicht wusste".',
      'Mutterschutz gilt auch für geringfügig Beschäftigte, Aushilfen und Azubis — kein Unterschied.',
    ],
    quiz: {
      question: 'Ab wann gilt der Kündigungsschutz des MuSchG für eine schwangere Mitarbeiterin?',
      options: [
        'Erst ab dem 4. Schwangerschaftsmonat',
        'Ab dem Zeitpunkt der Bekanntgabe der Schwangerschaft beim Arbeitgeber',
        'Erst ab Beginn der Mutterschutzfrist (6 Wochen vor Geburt)',
      ],
      correctIndex: 1,
      explanation: '§17 MuSchG: Der besondere Kündigungsschutz beginnt ab dem Zeitpunkt, zu dem der Arbeitgeber von der Schwangerschaft erfährt. Eine Kündigung ist ab diesem Moment nichtig — auch wenn der Arbeitgeber "es nicht wusste".',
    },
  },

  elternzeit: {
    id: 'elternzeit', chip: 'Elternzeit (BEEG)',
    title: 'Elternzeit und Elterngeld — BEEG',
    intro: 'Nach dem Mutterschutz können Mütter UND Väter Elternzeit nehmen — bis zu 3 Jahre pro Kind. Die Rechtsgrundlage ist das Bundeselterngeld- und Elternzeitgesetz (BEEG). Während der Elternzeit besteht besonderer Kündigungsschutz und der Anspruch auf Rückkehr an den Arbeitsplatz.',
    motto: 'Elternzeit ist ein Recht — kein Gefallen des Arbeitgebers.',
    rules: [
      'BEEG §15: Anspruch auf Elternzeit bis zu 3 Jahre pro Kind für Mütter UND Väter.',
      'Elternzeit muss mind. 7 Wochen vor Beginn schriftlich angemeldet werden (§16 BEEG).',
      'Teilzeitarbeit bis 32 Std./Woche während Elternzeit möglich (§15 Abs. 5 BEEG).',
      'Kündigungsschutz: 8 Wochen vor Beginn bis Ende der Elternzeit (§18 BEEG).',
      'Elterngeld: Staatliche Leistung — 65–67% des Nettolohns, max. 1.800 €/Monat, mind. 300 €.',
    ],
    steps: [
      { title: '1. Wer hat Anspruch auf Elternzeit?', text: 'Alle Arbeitnehmer (Mütter UND Väter) — auch Azubis, Teilzeitkräfte, Minijobber. Anspruch bis das Kind 3 Jahre alt ist. Übertragung: 1 Jahr kann bis zum 8. Geburtstag des Kindes genommen werden (§15 Abs. 2). Beide Elternteile können gleichzeitig Elternzeit nehmen.' },
      { title: '2. Elternzeit anmelden', text: 'Schriftlich (nicht mündlich!) mind. 7 Wochen vorher beim Arbeitgeber. Für die ersten 2 Lebensjahre des Kindes: Zeitraum bei Anmeldung bindend festlegen. Ab 3. Lebensjahr: 13 Wochen Ankündigungsfrist. Arbeitgeber kann nur in dringenden betrieblichen Gründen ablehnen (sehr selten).' },
      { title: '3. Elterngeld beantragen', text: 'Beim Elterngeldstelle des Jugendamts / Versorgungsamt beantragen. Basiselterngeld: 12 Monate (+ 2 Partnermonate wenn beide in Elternzeit). ElterngeldPlus: Doppelt so lange, halbierter Betrag — besser für Teilzeitarbeit. Antrag innerhalb von 3 Monaten nach Geburt — Elterngeld wirkt 3 Monate rückwirkend.' },
      { title: '4. Rückkehr aus der Elternzeit', text: 'Anspruch auf Rückkehr an den alten Arbeitsplatz oder einen gleichwertigen (§15 BEEG). Arbeitgeber kann den konkreten Platz umorganisiert haben — aber Funktion und Vergütung müssen gleichwertig sein. Kündigung während Elternzeit: Nur mit Zustimmung der zuständigen Behörde (§18 BEEG) — praktisch unmöglich.' },
    ],
    examples: [
      {
        title: 'Vater will 2 Monate Elternzeit nehmen',
        given: 'Ein FAB möchte nach der Geburt seines Kindes 2 Monate Elternzeit nehmen. Sein Arbeitgeber sagt: "Wir können uns das nicht leisten."',
        question: 'Hat der FAB Anspruch auf Elternzeit?',
        steps: [
          ['Recht', 'Ja — BEEG §15 gibt Anspruch, unabhängig von betrieblicher Situation'],
          ['Ablehnung', 'Arbeitgeber kann nur aus dringenden betrieblichen Gründen ablehnen — wirtschaftliche Gründe reichen nicht'],
          ['Anmeldung', 'Schriftlich, 7 Wochen vorher — dann ist Anspruch durchsetzbar'],
          ['Kündigung', 'Kündigung wegen Elternzeit = nichtig (§18 BEEG)'],
        ],
      },
    ],
    pitfalls: [
      'Mündliche Elternzeitankündigung zählt nicht — nur schriftlich ist rechtswirksam.',
      '"Das geht gerade nicht" ist kein Ablehnungsgrund — betriebliche Gründe müssen sehr schwerwiegend sein.',
      'Elterngeld läuft nicht automatisch — muss separat beim Elterngeldstelle beantragt werden.',
    ],
    quiz: {
      question: 'Wie lange muss Elternzeit mindestens vorher beim Arbeitgeber angemeldet werden?',
      options: ['2 Wochen schriftlich', '7 Wochen schriftlich', '3 Monate mündlich'],
      correctIndex: 1,
      explanation: '§16 Abs. 1 BEEG: Elternzeit muss spätestens 7 Wochen vor Beginn schriftlich beim Arbeitgeber angemeldet werden. Mündliche Anmeldung ist nicht ausreichend.',
    },
  },
};

const TabChip = ({ label, active, onClick, darkMode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${active ? 'bg-emerald-600 text-white' : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{label}</button>
);
const Section = ({ title, children, darkMode }) => (
  <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-700/60' : 'bg-gray-50'}`}>
    <h4 className={`font-bold mb-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{title}</h4>
    {children}
  </div>
);

export default function MutterschutzDeepDiveView({ onBack }) {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('mutterschutz');
  const [quizAnswer, setQuizAnswer] = useState(null);
  const tab = TABS[activeTab];

  return (
    <div className={`min-h-screen p-4 space-y-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>← Zurück</button>
        <div>
          <h2 className="text-xl font-bold">🤱 Mutterschutz & Elternzeit</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Verwaltung & Recht · MuSchG · BEEG</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.values(TABS).map(t => <TabChip key={t.id} label={t.chip} active={activeTab === t.id} onClick={() => { setActiveTab(t.id); setQuizAnswer(null); }} darkMode={darkMode} />)}
      </div>
      <div className={`rounded-xl p-4 border-l-4 border-emerald-500 ${darkMode ? 'bg-slate-800' : 'bg-emerald-50'}`}>
        <h3 className="text-lg font-bold mb-2">{tab.title}</h3>
        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tab.intro}</p>
        <p className={`mt-3 text-sm font-semibold italic ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>💡 {tab.motto}</p>
      </div>
      <Section title="📋 Das musst du wissen" darkMode={darkMode}>
        <ul className="space-y-2">{tab.rules.map((r, i) => <li key={i} className={`flex gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><span className="text-emerald-500 font-bold mt-0.5">•</span><span>{r}</span></li>)}</ul>
      </Section>
      <Section title="🔢 Schritt für Schritt" darkMode={darkMode}>
        <div className="space-y-3">{tab.steps.map((s, i) => <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-white'}`}><p className="font-semibold text-sm text-emerald-500">{s.title}</p><p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{s.text}</p></div>)}</div>
      </Section>
      {tab.examples && <Section title="📖 Beispiele aus der Praxis" darkMode={darkMode}>
        {tab.examples.map((ex, i) => (
          <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-white'}`}>
            <p className="font-bold text-sm text-emerald-500 mb-1">{ex.title}</p>
            <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ex.given}</p>
            <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{ex.question}</p>
            <div className="space-y-1">{ex.steps.map(([label, text], j) => <div key={j} className="flex gap-2 text-sm"><span className={`font-semibold min-w-[110px] ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{label}:</span><span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{text}</span></div>)}</div>
          </div>
        ))}
      </Section>}
      <Section title="⚠️ Typische Fehler vermeiden" darkMode={darkMode}>
        <ul className="space-y-2">{tab.pitfalls.map((p, i) => <li key={i} className={`flex gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><span className="text-red-400 font-bold mt-0.5">✗</span><span>{p}</span></li>)}</ul>
      </Section>
      <Section title="🧠 Teste dein Wissen" darkMode={darkMode}>
        <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{tab.quiz.question}</p>
        <div className="space-y-2">
          {tab.quiz.options.map((opt, i) => {
            const isCorrect = i === tab.quiz.correctIndex;
            let bg = darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-white hover:bg-gray-50';
            if (quizAnswer !== null) { if (isCorrect) bg = 'bg-green-600 text-white'; else if (quizAnswer === i) bg = 'bg-red-500 text-white'; }
            return <button key={i} onClick={() => quizAnswer === null && setQuizAnswer(i)} className={`w-full text-left p-3 rounded-lg text-sm border transition-colors ${bg} ${darkMode ? 'border-slate-500' : 'border-gray-200'}`}>{opt}</button>;
          })}
        </div>
        {quizAnswer !== null && <div className={`mt-3 p-3 rounded-lg text-sm ${quizAnswer === tab.quiz.correctIndex ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>{quizAnswer === tab.quiz.correctIndex ? '✓ Richtig! ' : '✗ Leider falsch. '}{tab.quiz.explanation}</div>}
      </Section>
    </div>
  );
}
