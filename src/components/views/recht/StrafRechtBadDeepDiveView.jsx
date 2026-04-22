import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const TABS = {
  hilfeleistung: {
    id: 'hilfeleistung', chip: '§323c StGB',
    title: 'Unterlassene Hilfeleistung — §323c StGB',
    intro: '§323c StGB verpflichtet JEDEN — nicht nur FAB — bei einem Unfall oder einer Not Hilfe zu leisten, wenn dies zumutbar ist. Für Fachangestellte für Bäderbetriebe gilt eine noch strengere Sorgfaltspflicht: Als Aufsichtsperson hast du eine sogenannte Garantenstellung — du bist rechtlich verpflichtet, Gefahren zu erkennen und einzugreifen. Wer als FAB bei einer Ertrinkung untätig bleibt, macht sich strafbar.',
    motto: 'Als FAB bist du nicht nur moralisch — du bist RECHTLICH zur Hilfe verpflichtet.',
    rules: [
      '§323c Abs. 1 StGB: Wer bei einem Unglücksfall nicht hilft, obwohl es ihm zumutbar ist, wird mit Freiheitsstrafe bis zu 1 Jahr oder Geldstrafe bestraft.',
      'Zumutbarkeit: Hilfe muss ohne erhebliche eigene Gefahr möglich sein. FAB haben Ausbildung — die Schwelle ist hoch.',
      'Garantenstellung: FAB haben als Aufsichtspersonen eine besondere Rechtspflicht zur Gefahrenabwehr (§13 StGB).',
      'Garantenstellung + Untätigkeit + Tod = §212 StGB (Totschlag durch Unterlassen) möglich — nicht nur §323c!',
      'Erste Hilfe muss sofort beginnen — nicht erst nach Hilferuf warten.',
    ],
    steps: [
      { title: '1. Was ist §323c StGB genau?', text: '"Wer bei Unglücksfällen oder gemeiner Gefahr oder Not nicht Hilfe leistet, obwohl dies erforderlich und ihm den Umständen nach zuzumuten ist, wird mit Freiheitsstrafe bis zu einem Jahr oder mit Geldstrafe bestraft." Das gilt für jeden Bürger. Für FAB gilt zusätzlich die Garantenstellung.' },
      { title: '2. Garantenstellung des FAB', text: 'Durch die Berufsausübung als Aufsichtsperson übernimmt der FAB eine Garantenstellung (§13 StGB): Er ist rechtlich verpflichtet, Schäden von Badegästen abzuwenden. Das bedeutet: Auch bloßes Nichtstun kann strafbar sein — wie aktives Handeln. Merksatz: "Wer beobachtet und nichts tut, handelt."' },
      { title: '3. Praktische Konsequenzen im Bad', text: 'Konsequente Aufsicht: Sichtfeld immer frei halten — keine Ablenkung durch Handy. Sofortiger Einsatz: Bei Anzeichen von Not — sofort handeln, nicht abwarten. Rettungskette: Erretten → Sichern → 112 → Erste Hilfe → Übergabe. Dokumentation: Unfall sofort im Unfallbuch eintragen, Zeugen benennen.' },
      { title: '4. Abgrenzung: wann ist Nichthelfen strafbar?', text: 'Strafbar: FAB sitzt im Aufsichtsstand und sieht Ertrinkenden — reagiert aber nicht. Nicht strafbar: FAB hat die Situation objektiv nicht erkannt (aber: Sorgfaltspflicht gilt!). Keine Strafbarkeit bei unzumutbarer Eigengefahr (z.B. Chlorgasunfall ohne Schutzausrüstung). Zivilrechtlich (Schadensersatz) gilt strengerer Maßstab als strafrechtlich.' },
    ],
    examples: [
      {
        title: 'Ertrinkender wird zu spät bemerkt',
        given: 'Ein FAB schaut während der Aufsicht auf sein Handy. Ein Gast geht unter — wird nach 3 Min. mit bleibenden Hirnschäden gerettet.',
        question: 'Welche strafrechtlichen Konsequenzen drohen?',
        steps: [
          ['§229 StGB', 'Fahrlässige Körperverletzung — Sorgfaltspflicht verletzt durch Handynutzung'],
          ['§223 StGB', 'Körperverletzung durch Unterlassen möglich — Garantenstellung'],
          ['§323c StGB', 'Unterlassene Hilfeleistung wenn keine sofortige Rettung erfolgte'],
          ['Zivilrecht', 'Schadensersatz nach §823 BGB — Betreiber und FAB persönlich haftbar'],
        ],
      },
    ],
    pitfalls: [
      '"Ich habe gerufen und dann jemanden geholt" — die Zeit des Rettungsgeräts-Holens muss minimal sein. Sicherstellen dass JEMAND anderes die direkte Rettung übernimmt.',
      'Ablenkung während der Aufsicht (Handy, Gespräche) ist eine Sorgfaltspflichtverletzung — auch wenn nichts passiert.',
      'Ertrinkende schreien NICHT — stilles Ertrinken ist die Regel. Aktive Beobachtung ist Pflicht, nicht nur Reagieren auf Rufe.',
    ],
    quiz: {
      question: 'Was bedeutet die "Garantenstellung" des FAB?',
      options: [
        'Er garantiert, dass kein Unfall passiert',
        'Er ist rechtlich verpflichtet, Gefahren abzuwenden — Nichtstun kann wie Handeln strafbar sein',
        'Er haftet für alle Unfälle im Bad persönlich',
      ],
      correctIndex: 1,
      explanation: 'Die Garantenstellung (§13 StGB) bedeutet, dass der FAB durch seine berufliche Position rechtlich verpflichtet ist, Schäden von Badegästen abzuwenden. Bloßes Nichtstun kann dann strafbar sein wie aktives Handeln.',
    },
  },

  fahrlassigkeit: {
    id: 'fahrlassigkeit', chip: 'Fahrlässigkeit',
    title: 'Fahrlässige Körperverletzung & fahrlässige Tötung',
    intro: 'Neben der unterlassenen Hilfeleistung gibt es zwei weitere zentrale Straftatbestände im Bäderbetrieb: §229 StGB (fahrlässige Körperverletzung) und §222 StGB (fahrlässige Tötung). Der Unterschied zum Vorsatz: Der FAB wollte den Schaden nicht — hat aber durch Sorglosigkeit oder Fehler die Verletzung verursacht oder nicht verhindert.',
    motto: 'Gute Absichten schützen nicht vor Strafe — Sorgfalt schon.',
    rules: [
      '§229 StGB: Wer durch Fahrlässigkeit eine Körperverletzung verursacht, wird mit Freiheitsstrafe bis zu 3 Jahren oder Geldstrafe bestraft.',
      '§222 StGB: Wer durch Fahrlässigkeit den Tod eines Menschen verursacht, wird mit Freiheitsstrafe bis zu 5 Jahren oder Geldstrafe bestraft.',
      'Fahrlässigkeit = Sorgfaltspflicht verletzt + Schaden vorhersehbar + Schaden vermeidbar.',
      'Objektiver Maßstab: Wie hätte ein "gewissenhafter FAB" in dieser Situation gehandelt?',
      'Kausalität muss vorliegen: Das Verhalten des FAB muss ursächlich für den Schaden sein.',
    ],
    steps: [
      { title: '1. Was ist Fahrlässigkeit?', text: 'Fahrlässigkeit liegt vor wenn: (1) Eine Sorgfaltspflicht besteht (FAB hat Aufsichtspflicht), (2) Die Sorgfaltspflicht verletzt wurde (Ablenkung, falsche Technik, Missachtung von Vorschriften), (3) Der Schaden vorhersehbar war, (4) Der Schaden durch sorgfältiges Handeln vermeidbar gewesen wäre.' },
      { title: '2. Grobe vs. einfache Fahrlässigkeit', text: 'Einfache Fahrlässigkeit: Kleines Versehen, das einem sorgfältigen FAB passieren kann. Grobe Fahrlässigkeit: Besonders schwere Verletzung der Sorgfaltspflicht — z.B. Aufsichtsposten über längere Zeit verlassen, Rettungsgeräte nicht geprüft, offensichtliche Gefahren ignoriert. Grobe Fahrlässigkeit führt zu höherer Strafe und ist zivilrechtlich besonders bedeutsam.' },
      { title: '3. Typische Fälle im Bad', text: '§229 StGB: Badegast rutscht auf nicht abgesicherter nasser Stelle (fehlender Leitkegel). §222 StGB: Ertrinkender nicht rechtzeitig bemerkt wegen Ablenkung — verstirbt. §229 bei PSA-Fehler: Mitarbeiter verletzt sich mit Chemikalie, weil keine Betriebsanweisung ausgehängt. §229 bei Rutsche: Aufsicht lässt Rutsche falsch benutzen — Kollision.' },
      { title: '4. Was schützt vor Strafe?', text: 'Einhaltung der DGUV-Vorschriften und ASR-Normen. Regelmäßige Schulungen und Unterweisungen. Konsequente Aufsicht ohne Ablenkung. Vollständige und aktuelle Dokumentation. Sofortige Meldung von Mängeln. Korrekte Erste Hilfe und Rettung bei Unfällen.' },
    ],
    examples: [
      {
        title: 'Rutschunfall durch fehlenden Leitkegel',
        given: 'Nach der Beckenreinigung wurde eine nasse Stelle nicht abgesichert. Ein Badegast fällt und bricht sich das Bein.',
        question: 'Liegt fahrlässige Körperverletzung vor?',
        steps: [
          ['Sorgfaltspflicht', 'Ja — FAB muss nasse Bereiche sofort absichern (ASR A1.3, Rutschgefahr)'],
          ['Verletzung', 'Ja — Leitkegel nicht gesetzt obwohl Pflicht und möglich'],
          ['Vorhersehbar', 'Ja — nasse Böden sind bekannte Sturzgefahr im Bad'],
          ['Vermeidbar', 'Ja — Leitkegel wären verfügbar gewesen'],
          ['Ergebnis', '§229 StGB wahrscheinlich erfüllt — Anzeige und Schadensersatz möglich'],
        ],
      },
    ],
    pitfalls: [
      '"Ich habe es nicht bemerkt" entschuldigt nicht — Sorgfaltspflicht gilt auch ohne konkreten Anlass.',
      'Zivilrechtliche Haftung ist unabhängig von Strafrecht: Freispruch im Strafprozess bedeutet nicht kein Schadensersatz.',
      'Versicherungen des Trägers schützen den FAB nur bedingt — bei grober Fahrlässigkeit kann Regress genommen werden.',
    ],
    quiz: {
      question: 'Was muss vorliegen damit fahrlässige Körperverletzung (§229 StGB) strafbar ist?',
      options: [
        'Der FAB muss die Verletzung absichtlich verursacht haben',
        'Sorgfaltspflicht verletzt + Schaden vorhersehbar + Schaden vermeidbar + Kausalität',
        'Es reicht wenn der FAB anwesend war als der Unfall passierte',
      ],
      correctIndex: 1,
      explanation: 'Fahrlässigkeit setzt voraus: (1) Es bestand eine Sorgfaltspflicht, (2) sie wurde verletzt, (3) der Schaden war vorhersehbar und (4) durch sorgfältiges Handeln vermeidbar. Nur wenn alle vier Punkte vorliegen, ist der Tatbestand erfüllt.',
    },
  },

  verkehrssicherung: {
    id: 'verkehrssicherung', chip: 'Verkehrssicherung',
    title: 'Verkehrssicherungspflicht — §823 BGB',
    intro: 'Die Verkehrssicherungspflicht ist eine zivilrechtliche Pflicht aus §823 BGB: Wer eine Gefahrenquelle schafft oder unterhält (z.B. ein Schwimmbad betreibt), muss alle notwendigen und zumutbaren Maßnahmen ergreifen, um andere vor Schäden zu schützen. Sie ist die wichtigste haftungsrechtliche Grundlage im Bäderbetrieb.',
    motto: 'Wer ein Schwimmbad öffnet, öffnet eine Gefahrenquelle — und übernimmt damit Verantwortung.',
    rules: [
      '§823 Abs. 1 BGB: Wer widerrechtlich Leben, Gesundheit oder Eigentum eines anderen verletzt, ist zum Schadensersatz verpflichtet.',
      'Verkehrssicherungspflicht: Wer eine Gefahrenquelle eröffnet, muss alle zumutbaren Sicherungsmaßnahmen treffen.',
      'Sie gilt für Betreiber UND für beauftragte Mitarbeiter — auch der FAB kann persönlich haften.',
      'Übertragung möglich: Betreiber kann Pflichten an FAB delegieren — Delegierender haftet bei mangelhafter Auswahl oder Einweisung.',
      'Eigenverantwortung der Gäste: Badegäste sind mitverantwortlich — aber Kinder und ältere Menschen haben geringere Eigenverantwortung.',
    ],
    steps: [
      { title: '1. Konkrete Pflichten im Schwimmbad', text: 'Rutschhemmende Böden (mind. GS/R10) und deren Kontrolle. Tiefenangaben an allen Becken. Rettungsgeräte an jedem Becken, täglich geprüft. Warnschilder korrekt angebracht und lesbar. Aufsicht durch qualifizierte Personen. Technische Anlagen gewartet und geprüft (Pumpen, Filter, Rutschen). Fluchtwege frei.' },
      { title: '2. Wer haftet bei einem Unfall?', text: 'Primär: Der Betreiber des Bades (Träger, Gemeinde, GmbH) — als Vertragspartner der Badegäste. Sekundär: Der FAB persönlich, wenn er die Verkehrssicherungspflicht verletzt hat (z.B. Mängel nicht gemeldet, Aufsicht vernachlässigt). Regressanspruch: Betreiber kann Kosten bei grober Fahrlässigkeit vom FAB zurückfordern.' },
      { title: '3. Mitverschulden des Gastes (§254 BGB)', text: 'Wenn der Gast durch eigenes Verhalten zum Unfall beigetragen hat, mindert das den Schadensersatz. Beispiel: Gast springt trotz Verbotsschilder — Mitverschulden möglich. ABER: Das Schild muss gut sichtbar und lesbar sein! Fehlende oder verblasste Schilder = kein Mitverschulden des Gastes = volle Haftung des Betreibers.' },
      { title: '4. Dokumentation als Schutz', text: 'Regelmäßige Kontrollgänge schriftlich dokumentieren (Betriebsbuch). Mängel sofort melden und dokumentieren. Wartungsnachweise aufheben. Schulungsnachweise aufheben. Im Streitfall: Wer nichts dokumentiert hat, hat faktisch nichts getan — Beweislast liegt beim Betreiber.' },
    ],
    examples: [
      {
        title: 'Verblasstes Rutschgefahrschild',
        given: 'Ein Gast stürzt auf einer bekannten Gefahrenstelle. Das Warnschild ist seit Wochen verblasst — stand im Betriebsbuch als "prüfen".',
        question: 'Haftet der Betreiber trotz Schild?',
        steps: [
          ['Schild verblasst', 'Gilt rechtlich als NICHT vorhanden — Schutzwirkung entfällt'],
          ['Betriebsbuch', '"Prüfen" ohne Konsequenz = Verkehrssicherungspflicht verletzt'],
          ['Haftung', 'Ja — Betreiber haftet voll, kein Mitverschulden des Gastes'],
          ['Für FAB', 'Wer den Mangel kannte und nicht handelte: persönliche Haftung möglich'],
        ],
      },
    ],
    pitfalls: [
      'Ein Schild aufhängen reicht nicht — es muss lesbar, korrekt positioniert und regelmäßig geprüft sein.',
      'Mängel im Betriebsbuch als "bekannt" zu vermerken ohne Konsequenz erhöht die Haftung — nicht vermindert sie.',
      '"Der Gast hat es selbst verursacht" funktioniert nur wenn der Betreiber alle Pflichten erfüllt hatte.',
    ],
    quiz: {
      question: 'Was ist die rechtliche Grundlage der Verkehrssicherungspflicht im Bäderbetrieb?',
      options: ['§323c StGB (Unterlassene Hilfeleistung)', '§823 BGB (unerlaubte Handlung / Schadensersatz)', '§13 StGB (Garantenstellung)'],
      correctIndex: 1,
      explanation: '§823 BGB ist die zivilrechtliche Grundlage: Wer widerrechtlich Gesundheit oder Eigentum verletzt, muss Schadensersatz leisten. Die Verkehrssicherungspflicht ist eine aus dieser Norm abgeleitete Pflicht für alle, die Gefahrenquellen betreiben.',
    },
  },

  owis: {
    id: 'owis', chip: 'Ordnungswidrigkeiten',
    title: 'Ordnungswidrigkeiten & Bußgelder im Bäderbetrieb',
    intro: 'Nicht jeder Verstoß ist eine Straftat — viele Verstöße sind Ordnungswidrigkeiten (OWis). Sie werden nicht im Strafregister eingetragen, können aber empfindliche Bußgelder nach sich ziehen. Im Bäderbetrieb gibt es OWis aus vielen verschiedenen Gesetzen: ArbSchG, JArbSchG, GefStoffV, IfSG, ArbZG.',
    motto: 'Ordnungswidrigkeiten sind kein Kavaliersdelikt — Bußgelder bis 30.000 € sind möglich.',
    rules: [
      'OWiG (Ordnungswidrigkeitengesetz) ist die Grundlage — spezialgesetzliche OWi-Tatbestände gehen vor.',
      'ArbSchG §25: Bis zu 25.000 € Bußgeld bei Verstößen gegen Arbeitsschutzpflichten.',
      'JArbSchG §58: Bis zu 30.000 € bei Verstößen gegen Jugendarbeitsschutz.',
      'GefStoffV §22: Bis zu 50.000 € bei Verstößen gegen Gefahrstoffvorschriften.',
      'IfSG §73: Bis zu 25.000 € bei Verstößen gegen Infektionsschutz (Wasserqualität, Meldepflichten).',
    ],
    steps: [
      { title: 'Häufige OWis im Schwimmbad', text: 'Fehlende Betriebsanweisung für Gefahrstoffe (GefStoffV). Überschreitung der Arbeitszeiten ohne Ausgleich (ArbZG). Beschäftigung Jugendlicher entgegen JArbSchG (falsche Zeiten, Verbotsarbeiten). Fehlende PSA oder PSA nicht geprüft (DGUV Vorschrift 1). Wasseranalysenbuch nicht geführt (IfSG, DIN 19643). Fehlende oder veraltete Sicherheitsdatenblätter.' },
      { title: 'Unterschied OWi / Straftat', text: 'OWi: Verwaltungsunrecht, kein Strafregister, nur Bußgeld. Straftat: Kriminelles Unrecht, Strafregister, Freiheitsstrafe möglich. Übergang fließend: Grobe Fahrlässigkeit bei OWi kann zu Straftat werden. Beispiel: Fehlende Unterweisung (OWi) → Unfall durch Unwissenheit → §229 StGB (Straftat).' },
      { title: 'Wie werden OWis festgestellt?', text: 'Behördliche Kontrolle (Gewerbeaufsicht, Gesundheitsamt). Unfall oder Beschwerde. Anzeige durch Mitarbeiter (Whistleblower-Schutz existiert). Regelmäßige Betriebsprüfungen. Was tun: Bußgeldbescheid erhalten → Prüfen → Innerhalb 2 Wochen Einspruch einlegen wenn unberechtigt. Vorgesetzten sofort informieren.' },
    ],
    examples: [
      {
        title: 'Fehlende Betriebsanweisung bei Kontrolle',
        given: 'Die Gewerbeaufsicht kontrolliert und stellt fest: Für Natriumhypochlorit existiert keine ausgehängte Betriebsanweisung.',
        question: 'Was passiert?',
        steps: [
          ['OWi', 'Verstoß gegen §14 GefStoffV — Ordnungswidrigkeit nach §22 GefStoffV'],
          ['Bußgeld', 'Bis zu 50.000 € möglich — je nach Schwere und Wiederholung'],
          ['Frist', 'Behörde setzt Frist zur Beseitigung — BA muss erstellt werden'],
          ['Prävention', 'BA für alle Gefahrstoffe erstellen und aushängen — vor nächster Kontrolle'],
        ],
      },
    ],
    pitfalls: [
      'OWi-Bußgelder treffen oft den Betrieb — aber bei persönlichem Verstoß auch den FAB direkt.',
      'Zweite OWi = höheres Bußgeld — Behörden notieren Wiederholungstäter.',
      '"Das wusste ich nicht" hilft bei OWis weniger als bei Straftaten — fahrlässige OWi ist genauso strafbar.',
    ],
    quiz: {
      question: 'Wie hoch kann das Bußgeld für Verstöße gegen die Gefahrstoffverordnung (GefStoffV) maximal sein?',
      options: ['Bis zu 5.000 €', 'Bis zu 50.000 €', 'Bis zu 500 €'],
      correctIndex: 1,
      explanation: '§22 GefStoffV sieht Bußgelder bis zu 50.000 € vor — z.B. bei fehlenden Betriebsanweisungen, fehlenden SDB oder falsch gelagerten Gefahrstoffen. Das ist kein Kavaliersdelikt.',
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

export default function StrafRechtBadDeepDiveView({ onBack }) {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('hilfeleistung');
  const [quizAnswer, setQuizAnswer] = useState(null);
  const tab = TABS[activeTab];

  return (
    <div className={`min-h-screen p-4 space-y-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>← Zurück</button>
        <div>
          <h2 className="text-xl font-bold">⚖️ Strafrecht im Bäderbetrieb</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Verwaltung & Recht · §323c, §229, §222 StGB · §823 BGB</p>
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
