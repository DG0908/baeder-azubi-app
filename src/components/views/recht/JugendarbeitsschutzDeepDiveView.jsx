import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const TABS = {
  grundlagen: {
    id: 'grundlagen', chip: 'Grundlagen',
    title: 'Jugendarbeitsschutzgesetz — Warum und für wen?',
    intro: 'Das Jugendarbeitsschutzgesetz (JArbSchG) schützt Kinder und Jugendliche vor gesundheitlicher Überlastung, Gefährdung und Ausbeutung in der Arbeit. Es gilt für alle Betriebe — auch für Schwimmbäder. Als FaBB-Azubi bist du selbst noch ein Jugendlicher im Sinne des Gesetzes und wirst von diesen Regeln geschützt. Gleichzeitig musst du das Gesetz kennen, wenn du selbst Jugendliche (z.B. Ferienaushilfen) beaufsichtigst.',
    motto: 'JArbSchG schützt nicht nur — es ist auch Pflicht des Arbeitgebers, es einzuhalten.',
    rules: [
      'Kind (§2 Abs. 1 JArbSchG): Unter 15 Jahre — grundsätzlich Beschäftigungsverbot.',
      'Jugendlicher (§2 Abs. 2 JArbSchG): 15 bis unter 18 Jahre — eingeschränkte Beschäftigung erlaubt.',
      'Vollzeitschulpflicht (§5 JArbSchG): Kinder dürfen nicht beschäftigt werden, solange sie schulpflichtig sind.',
      'Arbeitgeber muss JArbSchG einhalten — Verstöße sind Ordnungswidrigkeiten bis 30.000 € (§58 JArbSchG).',
      'Behörde: Gewerbeaufsichtsamt kontrolliert die Einhaltung des JArbSchG.',
    ],
    steps: [
      { title: '1. Wer ist "Kind" im Sinne des JArbSchG?', text: 'Unter 15 Jahre → Beschäftigungsverbot (§5 Abs. 1). Ausnahme: Leichte Tätigkeiten für Kinder ab 13 Jahre mit Zustimmung der Eltern (§5 Abs. 3) — z.B. Zeitungen austragen, Nachhilfe. Im Schwimmbad: Kinder unter 15 dürfen NICHT beschäftigt werden, auch nicht für leichte Hilfstätigkeiten ohne JArbSchG-Ausnahme.' },
      { title: '2. Wer ist "Jugendlicher" im Sinne des JArbSchG?', text: '15 bis unter 18 Jahre → Jugendlicher. 18 bis unter 21 Jahre als Auszubildender in gewissen Punkten gleichgestellt (z.B. gefährliche Arbeiten). Wichtig: Auch volljährige Azubis (18+) sind in bestimmten Bereichen durch das BerufsAusbildungsgesetz (BBiG) geschützt — aber nicht mehr durch JArbSchG.' },
      { title: '3. Pflichten des Arbeitgebers', text: 'Ärztliche Erstuntersuchung vor Beschäftigung (§32 JArbSchG) und Nachuntersuchung nach 1 Jahr. Verzeichnis der Jugendlichen führen (§49 JArbSchG). Aushang der Arbeitszeiten und des JArbSchG (§47 JArbSchG). Ausbildungsnachweis (Berichtsheft) ermöglichen und kontrollieren. Gefährdungsbeurteilung speziell für Jugendliche erstellen.' },
    ],
    examples: [
      {
        title: 'Ferienjob im Schwimmbad — was gilt?',
        given: 'Ein 16-Jähriger soll in den Sommerferien als Kassierer und Aufsichtshilfe im Schwimmbad arbeiten.',
        question: 'Was muss der Arbeitgeber beachten?',
        steps: [
          ['Alter', '16 Jahre = Jugendlicher → JArbSchG gilt vollständig'],
          ['Untersuchung', 'Ärztliche Erstuntersuchung erforderlich (§32 JArbSchG)'],
          ['Arbeitszeit', 'Max. 8 Std./Tag, 40 Std./Woche, nicht vor 6 Uhr, nicht nach 20 Uhr (§8)'],
          ['Verbot', 'Aufsicht alleine als einzige Fachkraft = zu gefährlich — nicht erlaubt'],
          ['Ferien', 'Max. 4 Wochen Ferienarbeit pro Jahr (§17 JArbSchG)'],
        ],
      },
    ],
    pitfalls: [
      '"Der ist schon 16, der kann alles machen" — falsch! JArbSchG gilt bis 18 mit vielen Einschränkungen.',
      'Ärztliche Erstuntersuchung vergessen: Ordnungswidrigkeit — auch wenn der Jugendliche gesund ist.',
      'Ferienjob über 4 Wochen = Verstoß gegen §17 JArbSchG — auch bei Einverständnis der Eltern.',
    ],
    quiz: {
      question: 'Ab welchem Alter gilt der Jugendliche im Sinne des JArbSchG?',
      options: ['Ab 13 Jahren', 'Ab 15 Jahren bis unter 18 Jahren', 'Ab 16 Jahren'],
      correctIndex: 1,
      explanation: '§2 Abs. 2 JArbSchG definiert Jugendliche als Personen, die 15, aber noch nicht 18 Jahre alt sind. Unter 15 Jahren gelten die strengeren Kinderschutzvorschriften.',
    },
  },

  arbeitszeiten: {
    id: 'arbeitszeiten', chip: 'Arbeitszeiten',
    title: 'Arbeitszeiten & Pausen für Jugendliche',
    intro: 'Das JArbSchG legt genaue Grenzen für Arbeitszeiten, Pausenzeiten und Ruhezeiten von Jugendlichen fest. Diese Grenzen sind strenger als beim Arbeitszeitgesetz (ArbZG) für Erwachsene. Im Bäderbetrieb mit Schichtbetrieb und Wochenendarbeit ist die Einhaltung besonders wichtig.',
    motto: 'Jugendliche brauchen mehr Schutz — weniger Stunden, mehr Pausen, kein Nachtdienst.',
    rules: [
      '§8 JArbSchG: Max. 8 Stunden täglich, max. 40 Stunden wöchentlich (5-Tage-Woche).',
      '§11 JArbSchG: Pause nach 4,5 Std. → mind. 30 Min. Pause; nach 6 Std. → mind. 60 Min.',
      '§13 JArbSchG: Frühestens 6:00 Uhr Arbeitsbeginn, spätestens 20:00 Uhr Arbeitsende.',
      '§15 JArbSchG: Samstag grundsätzlich frei (Ausnahmen: Bäderbetriebe!). Sonntag frei.',
      '§16 JArbSchG: Mind. 2 freie Samstage und mind. 2 freie Sonntage im Monat.',
    ],
    steps: [
      { title: '1. Tägliche und wöchentliche Arbeitszeit', text: 'Max. 8 Stunden/Tag und 40 Stunden/Woche — nicht überschreiten, auch nicht für Überstunden. Ausnahme §8 Abs. 2: In Ausnahmefällen (Bäder, Saison) bis 8,5 Std./Tag wenn dafür an anderen Tagen weniger. Keine Nacht- oder Schichtarbeit nach 20 Uhr ohne Ausnahme nach §14 JArbSchG.' },
      { title: '2. Pause und Ruhezeit', text: 'Nach 4,5 Stunden Arbeit: Mind. 30 Min. Pause — Pflicht! Nach 6 Stunden: Mind. 60 Min. Pause. Ruhezeit zwischen zwei Arbeitstagen: Mind. 12 Stunden (§13 JArbSchG). Urlaub: Mind. 25 Werktage/Jahr bis 16 Jahre, mind. 20 Werktage ab 17 Jahre (§19 JArbSchG).' },
      { title: '3. Besonderheiten im Bäderbetrieb', text: 'Bäderbetriebe sind in §15 Abs. 2 JArbSchG ausdrücklich erwähnt: Samstagsarbeit erlaubt — aber nur wenn dafür ein anderer Tag in der Woche frei ist. Sonntagsarbeit mit Ausgleich möglich (§17 JArbSchG Abs. 2). Achtung: Nachtarbeit (nach 20 Uhr) bleibt verboten! Jugendliche nicht im Abendschicht-Dienst einsetzen.' },
      { title: '4. Ausbildungszeiten und Berufsschule', text: 'Berufsschulzeiten zählen zur Arbeitszeit (§9 JArbSchG). An Berufsschultagen: Max. 8 Stunden Gesamtarbeitszeit (Schule + Betrieb). Bei mehr als 5 Schulstunden: Keine Betriebsarbeit mehr an diesem Tag (§9 Abs. 2). Prüfungen: Am Tag vor schriftlichen Abschlussprüfungen freihalten.' },
    ],
    examples: [
      {
        title: 'Schichtplanung mit 16-jährigem Azubi',
        given: 'Ein 16-jähriger Azubi soll von Montag bis Samstag je 8 Stunden arbeiten (Frühschicht 6–14 Uhr).',
        question: 'Was ist an diesem Plan rechtswidrig?',
        steps: [
          ['6 Tage', 'Nur 5 Arbeitstage erlaubt — 6-Tage-Woche verstößt gegen §8 JArbSchG'],
          ['40 Std.', '6 x 8 = 48 Stunden — überschreitet Maximum von 40 Stunden/Woche'],
          ['Samstag', 'Samstag zulässig im Bäderbetrieb — aber Ersatztag in der Woche nötig (§15 Abs. 2)'],
          ['Korrekt', 'Mo–Fr 8 Std. = 40 Std., Samstag mit Ausgleich an anderem Tag'],
        ],
      },
    ],
    pitfalls: [
      'Überstunden mit Jugendlichen vereinbaren ist nicht möglich — JArbSchG ist zwingendes Recht, kein Vertrag kann es aushebeln.',
      'Berufsschultage nicht als "halbe Tage" behandeln — gesetzliche Schutzregelung gilt.',
      '"Der wollte selbst arbeiten" entschuldigt den Arbeitgeber nicht — JArbSchG ist nicht disponibel.',
    ],
    quiz: {
      question: 'Wie lange muss die Pause für einen jugendlichen Mitarbeiter nach 5 Stunden Arbeit mindestens sein?',
      options: ['15 Minuten', '30 Minuten', '60 Minuten'],
      correctIndex: 1,
      explanation: '§11 JArbSchG: Nach 4,5 Stunden Arbeit müssen Jugendliche mind. 30 Minuten Pause erhalten. Nach 6 Stunden erhöht sich die Mindestpause auf 60 Minuten. Die Pause muss im Voraus feststehen.',
    },
  },

  verbote: {
    id: 'verbote', chip: 'Verbote & Ausnahmen',
    title: 'Beschäftigungsverbote und Ausnahmen im Bäderbetrieb',
    intro: 'Das JArbSchG enthält eine Liste von Tätigkeiten, bei denen Jugendliche grundsätzlich NICHT eingesetzt werden dürfen — weil sie gesundheitsgefährdend, sittlich bedenklich oder übermäßig belastend sind. Im Bäderbetrieb gibt es einige relevante Verbotstatbestände, aber auch wichtige Ausnahmen für die Ausbildung.',
    motto: 'Verbotsarbeiten schützen die Gesundheit — Ausnahmen für die Ausbildung sind eng begrenzt.',
    rules: [
      '§22 JArbSchG: Verbot gefährlicher Arbeiten (Chemikalien, Lärm, Hitze über Grenzwerte, schwere Lasten).',
      '§23 JArbSchG: Verbot von Akkord- und Fließbandarbeit unter Zeitdruck.',
      '§24 JArbSchG: Verbot von Arbeiten unter Tage (im Bad irrelevant).',
      '§22 Abs. 2: Ausnahme für Ausbildung — Jugendliche dürfen solche Tätigkeiten unter Aufsicht lernen wenn nötig.',
      'DGUV Regel 113-004 (Bäder): Jugendliche nicht allein in Chlorräumen oder mit konzentrierten Chemikalien.',
    ],
    steps: [
      { title: '1. Im Schwimmbad verbotene Tätigkeiten für Jugendliche', text: 'Alleinarbeit im Technikraum/Chlorraum (Lebensgefahr). Umgang mit konzentrierten Gefahrstoffen ohne direkte Aufsicht. Heben schwerer Lasten über Grenzwerte (25 kg gelegentlich, 10 kg regelmäßig für Jugendliche). Alleinige Aufsicht über Becken (Garantenstellung ohne ausreichende Reife). Nachtarbeit und Dienst nach 20 Uhr.' },
      { title: '2. Ausnahmen für Auszubildende', text: '§22 Abs. 2 JArbSchG: Im Rahmen der Ausbildung dürfen Jugendliche auch schwierige Tätigkeiten lernen — wenn nötig und unter Aufsicht. Beispiel: Azubi lernt Chlordosierung unter Aufsicht des Ausbilders — erlaubt. Azubi führt Chlordosierung allein als Tagesroutine durch — nicht erlaubt! Ausbildungsrahmenplan (ARP) gibt vor was gelernt werden muss.' },
      { title: '3. Gefährdungsbeurteilung für Jugendliche', text: 'Arbeitgeber muss spezifische Gefährdungsbeurteilung für jugendliche Beschäftigte erstellen (§28a ArbSchG). Dabei: Besondere Unerfahrenheit und Unreife berücksichtigen. Physische und psychische Belastung prüfen. Ergebnis dokumentieren und Schutzmaßnahmen ableiten. Eltern und Jugendlicher müssen über Ergebnis informiert werden.' },
    ],
    examples: [
      {
        title: 'Azubi soll allein die Chloranlage bedienen',
        given: 'Ein 17-jähriger Azubi im 2. Ausbildungsjahr soll die wöchentliche Inspektion der Chlordosieranlage allein durchführen.',
        question: 'Ist das erlaubt?',
        steps: [
          ['Grundsatz', 'Alleinarbeit im Chlorraum = gefährliche Arbeit nach §22 JArbSchG'],
          ['Ausnahme', '§22 Abs. 2: Erlaubt wenn zur Ausbildung nötig UND unter Aufsicht'],
          ['Allein', 'Allein = keine Aufsicht → Ausnahme greift NICHT'],
          ['Lösung', 'Ausbilder muss dabei sein oder zumindest in Hörweite — dann erlaubt'],
        ],
      },
    ],
    pitfalls: [
      '"Er hat das schon oft gemacht" — Gewöhnung schafft keine Ausnahme vom Verbot.',
      'Gefährdungsbeurteilung für Jugendliche vergessen: Ordnungswidrigkeit nach §58 JArbSchG.',
      'Ausnahme §22 Abs. 2 gilt nur für Ausbildungszwecke — nicht für reguläre Arbeitsroutine.',
    ],
    quiz: {
      question: 'Darf ein 17-jähriger Azubi im Rahmen der Ausbildung unter Aufsicht mit Gefahrstoffen arbeiten?',
      options: [
        'Nein — Gefahrstoffe sind für Jugendliche grundsätzlich verboten',
        'Ja — §22 Abs. 2 JArbSchG erlaubt es im Ausbildungsrahmen unter Aufsicht',
        'Ja — aber nur wenn die Eltern zustimmen',
      ],
      correctIndex: 1,
      explanation: '§22 Abs. 2 JArbSchG ermöglicht Ausnahmen für Ausbildungszwecke: Jugendliche dürfen gefährliche Tätigkeiten lernen, wenn es zur Ausbildung nötig ist und unter angemessener Aufsicht steht. Alleinarbeit bleibt verboten.',
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

export default function JugendarbeitsschutzDeepDiveView({ onBack }) {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('grundlagen');
  const [quizAnswer, setQuizAnswer] = useState(null);
  const tab = TABS[activeTab];

  return (
    <div className={`min-h-screen p-4 space-y-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>← Zurück</button>
        <div>
          <h2 className="text-xl font-bold">👦 Jugendarbeitsschutzgesetz</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Verwaltung & Recht · JArbSchG</p>
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
            <div className="space-y-1">{ex.steps.map(([label, text], j) => <div key={j} className="flex gap-2 text-sm"><span className={`font-semibold min-w-[100px] ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{label}:</span><span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{text}</span></div>)}</div>
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
