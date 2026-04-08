import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const TABS = {
  grundlagen: {
    id: 'grundlagen', chip: 'Grundlagen',
    title: 'Gewaltenteilung — Warum drei Gewalten?',
    intro: 'Das Grundgesetz (GG) teilt die Staatsmacht in drei unabhängige Gewalten auf — damit keine einzelne Person oder Gruppe zu viel Macht bekommt. Dieses Prinzip nennt sich Gewaltenteilung (auch: Gewaltentrennung) und ist in Art. 20 GG verankert. Für den FaBB-Azubi ist wichtig: Die Regeln, die du täglich im Schwimmbad anwendest, kommen aus genau diesen drei Gewalten.',
    motto: 'Kontrolle der Macht schützt die Freiheit — das ist das Fundament des Grundgesetzes.',
    rules: [
      'Art. 20 Abs. 2 GG: "Die Staatsgewalt geht vom Volke aus" — wir wählen das Parlament.',
      'Art. 20 Abs. 3 GG: Die drei Gewalten sind gegenseitig gebunden und kontrollieren sich.',
      'Legislative = macht Gesetze. Exekutive = führt Gesetze aus. Judikative = spricht Recht.',
      'Kein Organ darf alle drei Funktionen gleichzeitig ausüben — das verhindert Willkür.',
      'Deutschland ist ein Bundesstaat: Bund UND Länder haben jeweils eigene Gewalten.',
    ],
    steps: [
      { title: '1. Legislative — die gesetzgebende Gewalt', text: 'Auf Bundesebene: Bundestag (direkt gewählt) + Bundesrat (Länder). Sie erlassen Gesetze, z.B. das Arbeitszeitgesetz, JArbSchG, GefStoffV. Auf Landesebene: Landtag. Beispiel: Das bayerische Bäderbetriebsgesetz kommt vom Landtag Bayern.' },
      { title: '2. Exekutive — die ausführende Gewalt', text: 'Bundesregierung, Landesregierungen, Behörden (Gewerbeaufsicht, Gesundheitsamt). Sie setzen Gesetze um. Beispiel: Das Gesundheitsamt kontrolliert die Wasserqualität im Schwimmbad nach TrinkwV / DIN 19643.' },
      { title: '3. Judikative — die rechtsprechende Gewalt', text: 'Gerichte: Amtsgericht, Landgericht, Bundesgerichtshof (BGH), Bundesverfassungsgericht (BVerfG). Sie entscheiden bei Rechtsstreitigkeiten. Für Arbeitsrecht: Arbeitsgericht, Landesarbeitsgericht (LAG), Bundesarbeitsgericht (BAG).' },
      { title: '4. Föderalismus — Bund und Länder', text: 'Deutschland hat 16 Bundesländer. Manche Gesetze sind Bundessache (ArbZG, GG, StGB), andere Landessache (Schulen, Polizei, teilweise Bäderrecht). Die Gewerbeaufsicht ist Landesbehörde — sie kontrolliert Arbeitssicherheit im Bad.' },
    ],
    examples: [
      {
        title: 'Woher kommt die Pflichtdusche vor dem Baden?',
        given: 'DIN 19643 schreibt vor, dass Badegäste vor dem Betreten des Beckens duschen müssen.',
        question: 'Welche Gewalt hat das geregelt und wer kontrolliert es?',
        steps: [
          ['Legislative', 'Bundestag hat das IfSG (Infektionsschutzgesetz) erlassen — Ermächtigungsgrundlage'],
          ['Exekutive', 'Umweltbundesamt/DIN hat DIN 19643 als technische Norm konkretisiert'],
          ['Kontrolle', 'Gesundheitsamt (Exekutive) prüft die Einhaltung vor Ort im Bad'],
          ['Judikative', 'Bei Verstößen: Bußgeld oder Schließungsanordnung, Klage vor Verwaltungsgericht'],
        ],
      },
    ],
    pitfalls: [
      'Gesetz ≠ Norm ≠ Verordnung: DIN-Normen sind technische Regeln, keine Gesetze — aber oft in Gesetze einbezogen.',
      'Bundesgesetz bricht Landesgesetz (Art. 31 GG) — aber nur wenn der Bund zuständig ist.',
      'Das Bundesverfassungsgericht ist keine "vierte Gewalt" — es gehört zur Judikative, ist aber der Hüter des GG.',
    ],
    quiz: {
      question: 'Welche der drei Staatsgewalten erlässt Gesetze wie das Arbeitszeitgesetz?',
      options: ['Exekutive (Bundesregierung)', 'Legislative (Bundestag + Bundesrat)', 'Judikative (Gerichte)'],
      correctIndex: 1,
      explanation: 'Die Legislative (gesetzgebende Gewalt) erlässt Gesetze — in Deutschland Bundestag und Bundesrat gemeinsam. Die Exekutive führt sie aus, die Judikative wendet sie bei Streitigkeiten an.',
    },
  },

  staatsorgane: {
    id: 'staatsorgane', chip: 'Staatsorgane',
    title: 'Die wichtigsten Staatsorgane im Überblick',
    intro: 'Neben den drei Gewalten gibt es in Deutschland konkrete Staatsorgane, die du kennen musst. Bundesebene und Landesebene haben jeweils eigene Organe. Für den Bäderbetrieb relevant sind vor allem die Behörden, die kontrollieren und regulieren.',
    motto: 'Jedes Staatsorgan hat eine klar definierte Aufgabe — Überlappung ist gewollt, damit Kontrolle funktioniert.',
    rules: [
      'Bundespräsident: Staatsoberhaupt, repräsentiert Deutschland, zeichnet Gesetze aus (Art. 59 GG).',
      'Bundestag: 736 Abgeordnete (direkt gewählt), erlässt Bundesgesetze, wählt Bundeskanzler.',
      'Bundesrat: 69 Stimmen der 16 Länder — muss vielen Bundesgesetzen zustimmen.',
      'Bundesregierung: Bundeskanzler + Minister — Exekutive auf Bundesebene.',
      'Bundesverfassungsgericht (BVerfG): Hüter des GG — kann Gesetze für verfassungswidrig erklären.',
    ],
    steps: [
      { title: 'Für den Bäderbetrieb relevante Behörden', text: 'Gesundheitsamt: Wasserqualität, Hygienekontrolle (DIN 19643, IfSG). Gewerbeaufsicht/Amt für Arbeitsschutz: Arbeitssicherheit, JArbSchG, ArbZG. Berufsgenossenschaft (DGUV): Unfallversicherung, Arbeitsschutzvorschriften. Bauordnungsamt: Baugenehmigungen für Bäder, Fluchtwege.' },
      { title: 'Bundesrecht vs. Landesrecht im Bad', text: 'Bundesrecht: ArbZG, JArbSchG, MuSchG, GefStoffV, StGB, BGB, KSchG — gilt überall gleich. Landesrecht: Bäderbetriebsgesetze, Badeordnungen, Schulausflugregeln — variiert je Bundesland. Kommunalrecht: Örtliche Badeordnung des Betreibers (Hausordnung) ist kein Gesetz, aber privatrechtlich bindend.' },
      { title: 'Gerichtszweige', text: 'Strafgerichte (Amtsgericht/LG/BGH): Bei §323c StGB, §229 StGB. Arbeitsgerichte (ArbG/LAG/BAG): Bei Kündigung, Lohnstreit, Diskriminierung. Verwaltungsgerichte (VG/OVG/BVerwG): Bei Behördenentscheidungen (Schließungsverfügung). Zivilgerichte (AG/LG/BGH): Bei Schadensersatz nach Unfall.' },
    ],
    examples: [
      {
        title: 'Ein Badegast verletzt sich — wer ist zuständig?',
        given: 'Ein Badegast rutscht auf nassen Fliesen, bricht sich das Handgelenk und klagt auf Schadensersatz.',
        question: 'Welche Gerichte und welches Recht gilt?',
        steps: [
          ['Zivilrecht', 'Schadensersatzklage nach §823 BGB (Verkehrssicherungspflicht) vor Zivilgericht'],
          ['Strafrecht', 'Falls Fahrlässigkeit vorliegt: §229 StGB (fahrlässige Körperverletzung) vor Strafgericht'],
          ['Behörde', 'Gewerbeaufsicht prüft ob ASR-Vorschriften (rutschfeste Böden) eingehalten wurden'],
          ['BG', 'Berufsgenossenschaft zahlt wenn Mitarbeiter verletzt — nicht bei Gästen'],
        ],
      },
    ],
    pitfalls: [
      'Die DGUV (Berufsgenossenschaft) ist KEINE Behörde — sie ist ein Unfallversicherungsträger (Körperschaft des öffentlichen Rechts).',
      'Gesundheitsamt und Gewerbeaufsicht sind verschiedene Behörden mit verschiedenen Zuständigkeiten.',
      '"Das hat mir keiner gesagt" schützt nicht vor Strafe — Unwissenheit des Gesetzes schützt nicht (§17 StGB Grundsatz).',
    ],
    quiz: {
      question: 'Welche Behörde ist zuständig für die Kontrolle der Wasserqualität im öffentlichen Schwimmbad?',
      options: ['Gewerbeaufsicht (Arbeitsschutz)', 'Gesundheitsamt (IfSG, DIN 19643)', 'Berufsgenossenschaft (DGUV)'],
      correctIndex: 1,
      explanation: 'Das Gesundheitsamt überwacht die Badewasserqualität nach dem Infektionsschutzgesetz (IfSG) und der DIN 19643. Die Gewerbeaufsicht ist für Arbeitsschutz zuständig, die DGUV für Unfallversicherung.',
    },
  },

  baeder: {
    id: 'baeder', chip: 'Recht im Bad',
    title: 'Staatliches Recht im Bäderbetrieb',
    intro: 'Im Schwimmbad treffen viele Rechtsbereiche aufeinander: Öffentliches Recht (Genehmigungen, Kontrollen), Privatrecht (Hausordnung, Haftung) und Strafrecht (Sorgfaltspflichten). Als FaBB musst du wissen, welche Normen direkt für deine tägliche Arbeit gelten und wer kontrolliert.',
    motto: 'Recht kennen bedeutet Verantwortung tragen — und sich selbst schützen.',
    rules: [
      'DIN 19643 (Badewasseraufbereitung) ist technische Norm — durch IfSG und Landesrecht bindend.',
      'Badeordnung/Hausordnung ist privatrechtlich — Hausrecht des Betreibers (§903 BGB).',
      'Verkehrssicherungspflicht (§823 BGB): Wer eine Gefahrenquelle schafft, muss sie sichern.',
      'Betriebserlaubnis vom Bauordnungsamt nötig — bei Umbau oder Nutzungsänderung neu beantragen.',
      'Öffnungszeiten, Eintrittspreise: Privatautonomie des Betreibers — aber Diskriminierungsverbot (AGG) beachten.',
    ],
    steps: [
      { title: 'Wichtige Gesetze im Überblick', text: 'IfSG (Infektionsschutzgesetz): Wasserqualität, Hygiene, Meldepflichten. GefStoffV: Chemikalienlagerung, Betriebsanweisungen. ArbSchG: Allgemeiner Arbeitsschutz. BetrSichV: Sicherheit von Arbeitsmitteln. DGUV Vorschriften: Unfallverhütung. Landesbädergesetze: Je nach Bundesland.' },
      { title: 'Behördenkontrollen im Bad', text: 'Gesundheitsamt: Unangemeldet — Wasserproben, Hygieneplan, Dokumentation. Gewerbeaufsicht: Arbeitssicherheit, Betriebsanweisungen, PSA, Unfallbuch. Bauordnungsamt: Brandschutz, Fluchtwege, Rettungsplan. Feuerwehr: Brandschutzbegehung. Bei Mängeln: Sofortmaßnahmen oder Schließungsanordnung möglich.' },
      { title: 'Was tun bei einer Behördenkontrolle?', text: 'Ruhe bewahren. Beamte haben Zutrittsrecht — nicht verweigern. Geforderte Unterlagen vorlegen: Hygieneplan, SDB, Betriebsanweisungen, Wartungsnachweise. Mängel ehrlich benennen. Frist zur Nachbesserung vereinbaren. Alles dokumentieren (Protokoll verlangen). Vorgesetzten sofort informieren.' },
    ],
    examples: [
      {
        title: 'Unangemeldete Kontrolle durch das Gesundheitsamt',
        given: 'Ein Kontrolleur des Gesundheitsamts erscheint und möchte Wasserproben nehmen und den Hygieneplan prüfen.',
        question: 'Wie verhältst du dich richtig?',
        steps: [
          ['Zutritt', 'Kontrolleure haben gesetzliches Zutrittsrecht (IfSG §16) — gewähren'],
          ['Unterlagen', 'Hygieneplan, Wasseranalysenbuch, SDB vorlegen'],
          ['Mängel', 'Ehrlich benennen — Vertuschung kann strafrechtlich relevant sein'],
          ['Vorgesetzter', 'Sofort informieren — Kontrolleure sprechen mit Betriebsleitung'],
        ],
      },
    ],
    pitfalls: [
      'Behördenkontrolle verweigern ist rechtswidrig und kann zu sofortiger Schließung führen.',
      'Fehlende Dokumentation gilt als Regelverstoß — auch wenn die Kontrolle faktisch gemacht wurde.',
      '"Das haben wir immer so gemacht" ist keine Rechtfertigung gegenüber Behörden.',
    ],
    quiz: {
      question: 'Auf welcher Rechtsgrundlage hat das Gesundheitsamt Zutrittsrecht ins Schwimmbad?',
      options: ['ArbSchG (Arbeitsschutzgesetz)', 'IfSG §16 (Infektionsschutzgesetz)', 'BGB §823 (Verkehrssicherungspflicht)'],
      correctIndex: 1,
      explanation: '§16 IfSG gibt Behörden Betretungs- und Kontrollrechte zur Verhütung übertragbarer Krankheiten — das gilt auch für öffentliche Bäder als Einrichtungen mit Publikumsverkehr.',
    },
  },
};

const TabChip = ({ label, active, onClick, darkMode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${active ? 'bg-emerald-600 text-white' : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
    {label}
  </button>
);

const Section = ({ title, children, darkMode }) => (
  <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-700/60' : 'bg-gray-50'}`}>
    <h4 className={`font-bold mb-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{title}</h4>
    {children}
  </div>
);

export default function GewaltenteilungDeepDiveView({ onBack }) {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('grundlagen');
  const [quizAnswer, setQuizAnswer] = useState(null);
  const tab = TABS[activeTab];

  return (
    <div className={`min-h-screen p-4 space-y-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>← Zurück</button>
        <div>
          <h2 className="text-xl font-bold">🏛️ Staatsaufbau & Gewaltenteilung</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Verwaltung & Recht · Art. 20 GG</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.values(TABS).map(t => (
          <TabChip key={t.id} label={t.chip} active={activeTab === t.id} onClick={() => { setActiveTab(t.id); setQuizAnswer(null); }} darkMode={darkMode} />
        ))}
      </div>

      <div className={`rounded-xl p-4 border-l-4 border-emerald-500 ${darkMode ? 'bg-slate-800' : 'bg-emerald-50'}`}>
        <h3 className="text-lg font-bold mb-2">{tab.title}</h3>
        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tab.intro}</p>
        <p className={`mt-3 text-sm font-semibold italic ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>💡 {tab.motto}</p>
      </div>

      <Section title="📋 Das musst du wissen" darkMode={darkMode}>
        <ul className="space-y-2">
          {tab.rules.map((r, i) => <li key={i} className={`flex gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><span className="text-emerald-500 font-bold mt-0.5">•</span><span>{r}</span></li>)}
        </ul>
      </Section>

      <Section title="🔢 Schritt für Schritt" darkMode={darkMode}>
        <div className="space-y-3">
          {tab.steps.map((s, i) => (
            <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-white'}`}>
              <p className="font-semibold text-sm text-emerald-500">{s.title}</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {tab.examples && <Section title="📖 Beispiele aus der Praxis" darkMode={darkMode}>
        {tab.examples.map((ex, i) => (
          <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-white'}`}>
            <p className="font-bold text-sm text-emerald-500 mb-1">{ex.title}</p>
            <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ex.given}</p>
            <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{ex.question}</p>
            <div className="space-y-1">
              {ex.steps.map(([label, text], j) => (
                <div key={j} className="flex gap-2 text-sm">
                  <span className={`font-semibold min-w-[100px] ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{label}:</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>}

      <Section title="⚠️ Typische Fehler vermeiden" darkMode={darkMode}>
        <ul className="space-y-2">
          {tab.pitfalls.map((p, i) => <li key={i} className={`flex gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><span className="text-red-400 font-bold mt-0.5">✗</span><span>{p}</span></li>)}
        </ul>
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
        {quizAnswer !== null && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${quizAnswer === tab.quiz.correctIndex ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
            {quizAnswer === tab.quiz.correctIndex ? '✓ Richtig! ' : '✗ Leider falsch. '}{tab.quiz.explanation}
          </div>
        )}
      </Section>
    </div>
  );
}
