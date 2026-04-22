import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Was sind Gefahrstoffe?',
    intro:
      'Im Schwimmbad arbeiten wir taeglich mit Stoffen, die gefaehrlich sein koennen: Chlor, Saeuren, Laugen, Flockungsmittel, Reinigungsmittel. Diese Stoffe heissen Gefahrstoffe. Sie koennen brennen, explodieren, giftig sein, aetzen oder die Umwelt schaedigen. Die Gefahrstoffverordnung (GefStoffV) und das GHS-System regeln, wie diese Stoffe gekennzeichnet, gelagert und gehandhabt werden muessen. Als FAB arbeitest du regelmaessig mit ihnen — du musst die Regeln kennen und einhalten.',
    motto: 'Gefahrstoffe sind keine Ausnahme im Bad — sie sind der Alltag. Kenne sie genau.',
    rules: [
      'Gefahrstoffe muessen nach GHS (Global Harmonisiertes System) gekennzeichnet sein — mit Piktogrammen, H- und P-Saetzen.',
      'Fuer jeden Gefahrstoff muss ein aktuelles Sicherheitsdatenblatt (SDB) vorliegen und zugaenglich sein.',
      'Gefahrstoffe duerfen NUR in Originalbehae ltern oder ordnungsgemaess beschrifteten Behaeltern aufbewahrt werden.',
      'Unvertraegliche Stoffe (z.B. Saeure und Chlormittel) duerfen NICHT zusammen gelagert werden.',
      'Alle Mitarbeiter die mit Gefahrstoffen arbeiten muessen unterwiesen sein — mindestens einmal jaehrlich.'
    ],
    steps: [
      {
        title: '1. Gefahrstoffe erkennen',
        text: 'Jeder Gefahrstoff hat ein GHS-Etikett mit: Produktname, Piktogramm(e), Signalwort (Achtung oder Gefahr), H-Saetzen (Gefahrenhinweise) und P-Saetzen (Sicherheitshinweise). Fehlt eins davon auf einem Behaelter: Nicht verwenden, sofort melden!'
      },
      {
        title: '2. Sicherheitsdatenblatt nutzen',
        text: 'Das SDB hat 16 Abschnitte. Fuer den Alltag sind am wichtigsten: Abschnitt 2 (Gefahren des Stoffs), Abschnitt 4 (Erste-Hilfe-Massnahmen), Abschnitt 5 (Brandbekaempfung), Abschnitt 6 (Massnahmen bei Unfall), Abschnitt 8 (Schutzausruestung). Das SDB muss fuer jeden Mitarbeiter greifbar sein.'
      },
      {
        title: '3. Persoenliche Schutzausruestung (PSA)',
        text: 'Die richtige PSA haengt vom Stoff und der Taetigkeit ab. Grundsaetzlich bei Gefahrstoffen: Schutzhandschuhe (Material beachten — nicht jeder Handschuh schuetzt vor allem), Schutzbrille oder Vollschutzbrille, bei Aerosolbildung Atemschutz. PSA nur dann wirksam wenn sie korrekt getragen wird!'
      },
      {
        title: '4. Lagerung und Transport',
        text: 'Gefahrstoffe muessen kuehl, trocken und gut belueftet gelagert werden. Unvertraegliche Stoffe raeumlich trennen (z.B. Saeure NICHT neben Chlor). Behaelter geschlossen halten. Beim Transport: keine undichten Behaelter, Behaelter sichern damit sie nicht fallen/kippen. Keine Gefahrstoffe in privaten Fahrzeugen ohne Genehmigung.'
      }
    ],
    examples: [
      {
        title: 'Chlorgas-Geruch im Technikraum',
        given: 'Du betrittst den Technikraum und riechst sofort stechend nach Chlor. Was tust du?',
        question: 'Richtige Reaktion Schritt fuer Schritt:',
        steps: [
          ['Sofort', 'Raum SOFORT verlassen — Chlorgas ist giftig, auch kurze Exposition schadet'],
          ['Alarm', 'Vorgesetzten und ggf. Feuerwehr alarmieren — nicht alleine handeln'],
          ['Bereich', 'Bereich absperren, andere Personen fernhalten'],
          ['Atemschutz', 'Nur mit geeignetem Atemschutz und Begleitung zurueck — niemals alleine']
        ]
      },
      {
        title: 'Verschuettete Salzsaeure',
        given: 'Beim Umfuellen von pH-Minus (Salzsaeure) wird ein kleiner Behaelter umgekippt. Die Saeure laeuft auf den Boden.',
        question: 'Was ist zu tun?',
        steps: [
          ['PSA anziehen', 'Sofort Schutzbrille, Handschuhe und Schuerze — auch beim Aufwischen!'],
          ['Belueftung', 'Fenster und Tueren oeffnen — Sauredaempfe sind giftig'],
          ['Binden', 'Mit Bindemittel (Kieselgur, Sand) aufnehmen — KEIN Wasser drauf schuetten!'],
          ['Entsorgung', 'Als Gefahrstoffabfall entsorgen, Vorfall dokumentieren und melden']
        ]
      }
    ],
    pitfalls: [
      'Niemals Gefahrstoffe in andere Behaelter umfuellen ohne neue vollstaendige Beschriftung — Verwechslungen sind lebensgefaehrlich!',
      'Saeure und Chlor NIEMALS zusammen lagern oder mischen — es entsteht sofort giftiges Chlorgas!',
      'Schutzhandschuhe aus Latex schuetzen NICHT vor Saeuren — das richtige Handschuhmaterial aus dem SDB ablesen.',
      'Bei Exposition oder Unfall: Erst eigene Sicherheit, dann Erste Hilfe — ansonsten gibt es zwei Opfer statt einem.'
    ],
    quiz: {
      question: 'Warum duerfen Salzsaeure und Natriumhypochlorit (Chlorbleichlauge) nicht zusammen gelagert werden?',
      options: [
        'Weil sie unterschiedliche Farben haben und das verwirrend ist',
        'Weil bei Mischung oder Kontakt giftiges Chlorgas entsteht',
        'Weil beide Stoffe dann schneller ablaufen'
      ],
      correctIndex: 1,
      explanation: 'Salzsaeure (HCl) reagiert mit Natriumhypochlorit (NaOCl) zu giftigem Chlorgas (Cl2). Schon geringe Mengen Chlorgas koennen Atemwege schaedigen. Deshalb: unvertraegliche Stoffe immer raeumlich getrennt lagern!'
    }
  },

  lagerung: {
    id: 'lagerung',
    chip: 'Lagerung',
    title: 'Gefahrstoffe richtig lagern',
    intro:
      'Falsche Lagerung von Gefahrstoffen ist ein haeufiger Grund fuer Unfaelle im Schwimmbad. Stoffe die miteinander reagieren koennen, muessen getrennt gelagert werden. Lagerpflichten sind in der Gefahrstoffverordnung, der TRGS 510 (Technische Regeln fuer Gefahrstoffe) und den Herstellerangaben geregelt. Im Schwimmbad sind Chlorprodukte und saeurehaltige Mittel die groesste Herausforderung — sie duerfen nicht zusammen gelagert werden.',
    motto: 'Lagere so, dass eine Panne kein Unfall wird.',
    rules: [
      'Unvertraegliche Stoffe raeumlich trennen: Saeuren und Oxidationsmittel (Chlor) mindestens in getrennten Schraenken, besser in getrennten Raeumen.',
      'Lagerraum muss belueftet, kuehl und trocken sein. Kein direktes Sonnenlicht auf Chlorbehaelter.',
      'Behaelter immer geschlossen halten. Offene Behaelter sind ein Verdunstungs- und Brandrisiko.',
      'Maximale Lagermengen beachten (laut GefStoffV und Betriebsanweisung).',
      'Gefahrstofflager mit Warnschildern kennzeichnen (z.B. GHS-Piktogramme, "Kein Zutritt fuer Unbefugte").'
    ],
    steps: [
      {
        title: '1. Unvertraeglichkeiten kennen',
        text: 'Die wichtigsten Unvertraeglichkeiten im Bad: Chlorprodukte (Oxidationsmittel) + Saeuren = Chlorgasbildung. Chlorprodukte + brennbare Stoffe = Brandgefahr. Konzentrierte Saeuren + Wasser = starke Waermeentwicklung. Loesung: Immer im SDB unter "Zu vermeidende Bedingungen" nachschauen.'
      },
      {
        title: '2. Lagerraum-Anforderungen',
        text: 'Gefahrstofflager brauchen: Ausreichende Belueftung (mindestens 1-facher Luftwechsel pro Stunde), undurchlaessigen Boden mit Auffahrschwelle (Auffangwanne fuer Leckagen), Loeschmittel in Reichweite (aber nur geeignete!), kein Zugang fuer Unbefugte, Erste-Hilfe-Einrichtung in der Naehe.'
      },
      {
        title: '3. Bestandskontrolle',
        text: 'Regelmaessige Kontrolle: Sind alle Behaelter unbeschaedigt und dicht? Stimmen die Etiketten? Sind Verfallsdaten noch gueltig? Gibt es unbekannte oder falsch etikettierte Behaelter? Gefahrstoffkataster fuehren: Eine Liste aller verwendeten Gefahrstoffe mit Menge, Ort und SDB-Verweis.'
      },
      {
        title: '4. Entsorgung',
        text: 'Gefahrstoffe duerfen nicht einfach in den normalen Muell oder den Abfluss. Reste und abgelaufene Stoffe sind Sonderabfall und muessen durch einen zugelassenen Entsorger abgeholt werden. Im Zweifelsfall Vorgesetzten fragen — nicht selbst entsorgen!'
      }
    ],
    examples: [
      {
        title: 'Lagerraumkontrolle',
        given: 'Du sollst den Gefahrstofflager kontrollieren. Was pruefst du?',
        question: 'Checkliste fuer eine gruendliche Kontrolle:',
        steps: [
          ['Behaelter', 'Alle dicht, unbeschaedigt, korrekt beschriftet?'],
          ['Trennung', 'Chlormittel und Saeuren getrennt gelagert?'],
          ['Lagerraum', 'Belueftung in Ordnung? Boden ohne Leckagen?'],
          ['Dokumente', 'SDB fuer alle Stoffe vorhanden und aktuell (max. 3 Jahre alt)?']
        ]
      },
      {
        title: 'Unbekannter Behaelter',
        given: 'Im Lager steht ein Kanister ohne Etikett. Du weisst nicht was drin ist.',
        question: 'Was tust du?',
        steps: [
          ['Nicht anfassen', 'Unbekannte Stoffe nie ohne Schutzausruestung anfassen'],
          ['Sichern', 'Behaelter isolieren, anderen Zutritt verwehren'],
          ['Melden', 'Sofort Vorgesetzten informieren'],
          ['Entsorgung', 'Fachgerechte Entsorgung veranlassen — kein Selbstversuch!']
        ]
      }
    ],
    pitfalls: [
      'Chlorprodukte und Saeuren zusammen im selben Schrank ist ein absolutes No-Go — auch kleine Leckagen reichen fuer Chlorgasbildung.',
      'Gefahrstoffe im Kuehlschrank mit Lebensmitteln lagern ist verboten und lebensgefaehrlich.',
      'Behaelter ohne Etikett sind nicht "irgendwas" — sie sind unbekannte Gefahrstoffe und muessen fachgerecht entsorgt werden.',
      'Privaten Vorrat anlegen ist verboten — Gefahrstoffe gehoeren nur in die offizielle Lagerung.'
    ],
    quiz: {
      question: 'Was muss ein Gefahrstofflager mindestens haben?',
      options: [
        'Einen Kuehschrank und gutes Licht',
        'Ausreichende Belueftung, Auffangwanne, Zugangssicherung und Gefahrstoffkennzeichnung',
        'Einen Feuerlöscher direkt neben den Chemikalien'
      ],
      correctIndex: 1,
      explanation: 'Ein Gefahrstofflager muss: belueftet sein (Daempfe abfuehren), eine Auffangwanne haben (Leckagen auffangen), gesichert sein (kein Unbefugter), und mit GHS-Schildern gekennzeichnet sein. Der Loescher sollte in der Naehe aber nicht direkt neben den Chemikalien sein.'
    }
  },

  notfall: {
    id: 'notfall',
    chip: 'Notfall & Erste Hilfe',
    title: 'Was tun im Gefahrstoff-Notfall?',
    intro:
      'Unfaelle mit Gefahrstoffen passieren schneller als man denkt — ein umgekippter Behaelter, ein geplatzter Schlauch, ein falsch gemischtes Mittel. Wer weiss was er tun muss, kann Schlimmeres verhindern. Die wichtigsten Grundsaetze: Erst die eigene Sicherheit sichern, dann helfen. Chlorgas, Saeuredaempfe und Laugen koennen in Sekunden gefaehrliche Konzentrationen erreichen. Rettungskraefte informieren — du musst wissen welche Stoffe beteiligt sind.',
    motto: 'Im Notfall: Erst Sicherheit, dann Hilfe — nie umgekehrt.',
    rules: [
      'Eigenschutz geht vor Erste Hilfe — ohne geeignete PSA kein Eingreifen.',
      'Notfallrufnummer 112 bei schweren Unfaellen sofort anrufen — Stoff und Menge nennen.',
      'Giftnotruf: 030 19240 (Berlin) — bei Vergiftung oder Exposition sofort anrufen, SDB bereithalten.',
      'Betroffene Person aus dem Gefahrenbereich bringen — immer mit geeignetem Atemschutz.',
      'Erste-Hilfe-Massnahmen laut SDB Abschnitt 4 durchfuehren — bei Augenkontakt mindestens 10-15 Minuten spuelen.'
    ],
    steps: [
      {
        title: '1. Erste Reaktion',
        text: 'Ruhe bewahren. Eigene Sicherheit pruefen: Habe ich PSA? Wenn nein: erst sichern, dann helfen. Betroffenen ansprechen, Bewusstsein pruefen. Bereich absperren. Fenster und Tueren oeffnen (Belueftung). Andere Personen fernhalten.'
      },
      {
        title: '2. Augenkontakt mit Gefahrstoff',
        text: 'Sofort und mindestens 10-15 Minuten mit viel fliessendem Wasser spuelen. Kontaktlinsen vorher entfernen wenn moeglich. Augenlider offen halten. Dann Arzt oder Augenarzt aufsuchen — auch wenn es sich besser anfuehlt. SDB-Angaben beachten!'
      },
      {
        title: '3. Hautkontakt',
        text: 'Kontaminierte Kleidung sofort ausziehen. Haut mindestens 10 Minuten mit Wasser abspuelen. Bei Saeuren oder Laugen: immer Arzt aufsuchen, auch bei scheinbar geringer Exposition. Keine Neutralisation versuchen — kann die Verletzung verschlimmern.'
      },
      {
        title: '4. Einatmen von Daempfen oder Gasen',
        text: 'Betroffenen sofort an die frische Luft bringen. Bei Bewusstlosigkeit: stabile Seitenlage, Rettungsdienst rufen. Bei Atemstillstand: HLW einleiten. Immer Arzt aufsuchen — Lungenschaeden durch Chlorgas koennen sich verzoegert zeigen!'
      }
    ],
    examples: [
      {
        title: 'Mitarbeiter atmet Chlorgas ein',
        given: 'Ein Kollege ist beim Reinigen des Chlorraums zusammengebrochen. Du riechst stechend nach Chlor.',
        question: 'Deine Reaktion Schritt fuer Schritt:',
        steps: [
          ['Eigenschutz', 'Kein Eintreten ohne Atemschutz — sonst wirst du selbst Opfer!'],
          ['Alarm', 'Sofort 112 anrufen, Standort und Stoff nennen'],
          ['Mit Atemschutz', 'Kollegen aus dem Raum ziehen, frische Luft zuführen'],
          ['Erste Hilfe', 'Bewusstsein pruefen, bei Atemstillstand HLW, stabile Seitenlage']
        ]
      },
      {
        title: 'Kind trinkt Reinigungsmittel',
        given: 'Ein Kind hat aus einem nicht gesicherten Behaelter mit Chlorreiniger getrunken.',
        question: 'Was tust du sofort?',
        steps: [
          ['112 rufen', 'Sofort Notruf — bei Kindern immer schwerwiegend'],
          ['Giftnotruf', '030 19240 anrufen, Produktname und Menge nennen'],
          ['Nicht', 'KEIN Erbrechen herbeibeifuehren — aetzende Stoffe verbrennen beim Erbrechen erneut'],
          ['Wasser', 'Mund mit Wasser aussuepueln lassen (nicht schlucken), Kind beruhigen']
        ]
      }
    ],
    pitfalls: [
      'Erbrechen bei Saeure- oder Laugen-Verschlucken NIEMALS herbeibeifuehren — der Stoff verbrennt erneut beim Hoch- und Herunterkommen.',
      'Ohne Atemschutz in einen Chlorgasraum gehen = sofort zweites Opfer schaffen.',
      'Wasser auf Chlorpulver oder konzentrierte Saeuren schuetten kann Spritzen oder Daempfe verursachen.',
      'Kleine Exposition ignorieren — auch geringe Mengen koennen verzoegert Schaeden an Lunge oder Augen verursachen.'
    ],
    quiz: {
      question: 'Was ist die erste Massnahme bei Augenkontakt mit einem Gefahrstoff?',
      options: [
        'Sofort zum Arzt fahren ohne Weitere Massnahmen',
        'Mindestens 10-15 Minuten mit viel fliessendem Wasser spuelen, dann Arzt aufsuchen',
        'Neutralisationsmittel ins Auge geben um den Stoff unschaedlich zu machen'
      ],
      correctIndex: 1,
      explanation: 'Bei Augenkontakt sofort und ausdauernd mit viel fliessendem Wasser spuelen — mindestens 10-15 Minuten. Neutralisation im Auge ist gefaehrlich und falsch. Danach immer Arzt aufsuchen, auch wenn das Auge sich besser anfuehlt.'
    }
  }
};

const TabChip = ({ label, active, onClick, darkMode }) => (
  <button onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      active ? 'bg-yellow-500 text-white' : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}>
    {label}
  </button>
);

const Section = ({ title, children, darkMode }) => (
  <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-700/60' : 'bg-gray-50'}`}>
    <h4 className={`font-bold mb-3 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>{title}</h4>
    {children}
  </div>
);

export default function GefahrstoffeDeepDiveView({ onBack }) {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('grundlagen');
  const [quizAnswer, setQuizAnswer] = useState(null);
  const tab = TABS[activeTab];

  return (
    <div className={`min-h-screen p-4 space-y-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>← Zurück</button>
        <div>
          <h2 className="text-xl font-bold">☣️ Gefahrstoffe</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hygiene & Sicherheit · §3 Nr. 4</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.values(TABS).map(t => (
          <TabChip key={t.id} label={t.chip} active={activeTab === t.id} onClick={() => { setActiveTab(t.id); setQuizAnswer(null); }} darkMode={darkMode} />
        ))}
      </div>

      <div className={`rounded-xl p-4 border-l-4 border-yellow-500 ${darkMode ? 'bg-slate-800' : 'bg-yellow-50'}`}>
        <h3 className="text-lg font-bold mb-2">{tab.title}</h3>
        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tab.intro}</p>
        <p className={`mt-3 text-sm font-semibold italic ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>💡 {tab.motto}</p>
      </div>

      <Section title="📋 Das musst du wissen" darkMode={darkMode}>
        <ul className="space-y-2">
          {tab.rules.map((r, i) => (
            <li key={i} className={`flex gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="text-yellow-500 font-bold mt-0.5">•</span><span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="🔢 Schritt fuer Schritt" darkMode={darkMode}>
        <div className="space-y-3">
          {tab.steps.map((s, i) => (
            <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-white'}`}>
              <p className="font-semibold text-sm text-yellow-500">{s.title}</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="📖 Beispiele aus der Praxis" darkMode={darkMode}>
        <div className="space-y-4">
          {tab.examples.map((ex, i) => (
            <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-white'}`}>
              <p className="font-bold text-sm text-yellow-500 mb-1">{ex.title}</p>
              <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ex.given}</p>
              <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{ex.question}</p>
              <div className="space-y-1">
                {ex.steps.map(([label, text], j) => (
                  <div key={j} className="flex gap-2 text-sm">
                    <span className={`font-semibold min-w-[90px] ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{label}:</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="⚠️ Typische Fehler vermeiden" darkMode={darkMode}>
        <ul className="space-y-2">
          {tab.pitfalls.map((p, i) => (
            <li key={i} className={`flex gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="text-red-400 font-bold mt-0.5">✗</span><span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="🧠 Teste dein Wissen" darkMode={darkMode}>
        <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{tab.quiz.question}</p>
        <div className="space-y-2">
          {tab.quiz.options.map((opt, i) => {
            const isSelected = quizAnswer === i;
            const isCorrect = i === tab.quiz.correctIndex;
            let bg = darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-white hover:bg-gray-50';
            if (quizAnswer !== null) {
              if (isCorrect) bg = 'bg-green-600 text-white';
              else if (isSelected) bg = 'bg-red-500 text-white';
            }
            return (
              <button key={i} onClick={() => quizAnswer === null && setQuizAnswer(i)}
                className={`w-full text-left p-3 rounded-lg text-sm border transition-colors ${bg} ${darkMode ? 'border-slate-500' : 'border-gray-200'}`}>
                {opt}
              </button>
            );
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
