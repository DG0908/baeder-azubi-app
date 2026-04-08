import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Reinigung und Desinfektion — was ist der Unterschied?',
    intro:
      'Viele verwechseln Reinigung und Desinfektion. Reinigung entfernt sichtbaren Schmutz, Fett und organische Rueckstaende — aber toetet keine Keime. Desinfektion reduziert Krankheitserreger auf ein ungefaehrliches Mass — aber entfernt keinen Schmutz. Im Schwimmbad brauchen wir beides: zuerst reinigen, dann desinfizieren. Denn auf schmutzigen Flaechen wirkt ein Desinfektionsmittel nicht richtig!',
    motto: 'Erst reinigen, dann desinfizieren — nie beides gleichzeitig weglassen.',
    rules: [
      'Reinigung = Entfernung von sichtbarem Schmutz, Biofilm und Rueckstaenden. Toetet keine Keime.',
      'Desinfektion = Abtoeung oder Inaktivierung von Krankheitserregern auf ein sicheres Mass. Entfernt keinen Schmutz.',
      'Reihenfolge: IMMER erst reinigen, dann desinfizieren. Schmutz blockiert die Wirkung von Desinfektionsmitteln.',
      'Einwirkzeit ist entscheidend: Desinfektionsmittel braucht Zeit. Zu frueh abwischen = keine Wirkung.',
      'Reinigungsplan und Hygieneplan muessen schriftlich vorliegen und eingehalten werden.'
    ],
    steps: [
      {
        title: '1. Reinigung: Was und womit?',
        text: 'Reinigung loest Schmutz, Kalk, Fett, Hautschuppen und Biofilm. Mittel: Allzweckreiniger, alkalische Reiniger (gegen Fett), saure Reiniger (gegen Kalk). Mechanische Unterstuetzung durch Schrubben, Wischen oder Hochdruckreiniger. Ohne mechanischen Effekt wirken auch gute Mittel oft schlecht.'
      },
      {
        title: '2. Desinfektion: Wie und wie lange?',
        text: 'Nach der Reinigung: Desinfektionsmittel aufbringen und die vorgeschriebene Einwirkzeit einhalten. Einwirkzeiten stehen auf dem Produkt und im Hygieneplan (z.B. 5 Minuten, 15 Minuten). Dann abwischen oder trocknen lassen. Flaechendesis werden unverduernt oder nach Vorschrift verduernt aufgetragen.'
      },
      {
        title: '3. Typische Bereiche im Schwimmbad',
        text: 'Beckenumgang: Taeglich reinigen, rutschhemmend halten. Umkleiden und Duschen: Taeglich reinigen, regelmaessig desinfizieren. Toiletten: Mehrmals taeglich reinigen und desinfizieren. Rettungsgeraete: Regelmaessig reinigen, bei Benutzung sofort aufbereiten. Handlauefe und Tueren: Taeglich wischen.'
      },
      {
        title: '4. Der Hygieneplan',
        text: 'Der Hygieneplan regelt: Was wird gereinigt/desinfiziert? Womit (Produkt, Konzentration)? Wann und wie oft? Von wem? Mit welcher Einwirkzeit? Der Plan muss schriftlich vorliegen, allen Mitarbeitern bekannt sein und eingehalten werden. Abweichungen muessen dokumentiert werden.'
      }
    ],
    examples: [
      {
        title: 'Duschbereiche nach Betrieb',
        given: 'Nach Betriebsschluss sollen die Duschen gereinigt und desinfiziert werden.',
        question: 'In welcher Reihenfolge und mit welchen Mitteln?',
        steps: [
          ['Schritt 1', 'Groben Schmutz entfernen, Abfluss reinigen'],
          ['Schritt 2', 'Reiniger auftragen, einwirken lassen, schrubben, abspuelen'],
          ['Schritt 3', 'Flaechendesinfektionsmittel aufbringen — Einwirkzeit einhalten (lt. Plan)'],
          ['Schritt 4', 'Flaechen trocknen lassen oder abwischen, Ergebnis dokumentieren']
        ]
      },
      {
        title: 'Rettungsring nach Einsatz',
        given: 'Ein Rettungsring wurde bei einem Notfall benutzt. Was muss jetzt passieren?',
        question: 'Wie wird der Rettungsring aufbereitet?',
        steps: [
          ['Sofort', 'Ring aus dem Verkehr nehmen, reinigen und desinfizieren'],
          ['Reinigung', 'Mit Reiniger und Buerste Verunreinigungen entfernen'],
          ['Desinfektion', 'Mit geeignetem Desinfektionsmittel behandeln, Einwirkzeit abwarten'],
          ['Zurueck', 'Ring erst nach vollstaendiger Aufbereitung wieder einsatzbereit haengen']
        ]
      }
    ],
    pitfalls: [
      'Desinfizieren OHNE vorherige Reinigung ist wirkungslos — Schmutz blockiert den Wirkstoff.',
      'Einwirkzeit ignorieren ist ein haeufiger Fehler — zu frueh abgewischt = keine Desinfektionswirkung.',
      'Reinigungsmittel und Desinfektionsmittel duerfen NICHT einfach gemischt werden — oft entstehen gefaehrliche Reaktionen.',
      'Abgenutzte Wischmoppe und Lappen uebertragen Keime statt sie zu entfernen — regelmaessig wechseln!'
    ],
    quiz: {
      question: 'Warum muss vor der Desinfektion immer zuerst gereinigt werden?',
      options: [
        'Weil das so im Hygieneplan steht und man sich daran halten muss',
        'Weil Schmutz und organische Rueckstaende die Wirkung des Desinfektionsmittels blockieren',
        'Weil Desinfektionsmittel teuer ist und man es nicht verschwenden soll'
      ],
      correctIndex: 1,
      explanation: 'Schmutz und organische Substanzen "verbrauchen" das Desinfektionsmittel, bevor es auf Keime wirken kann. Desinfektion auf schmutzigen Flaechen ist deshalb wirkungslos oder stark abgeschwaecht. Richtige Reihenfolge: reinigen → desinfizieren.'
    }
  },

  mittel: {
    id: 'mittel',
    chip: 'Reinigungsmittel',
    title: 'Welche Mittel gibt es und wann nutze ich was?',
    intro:
      'Nicht jedes Reinigungsmittel passt zu jeder Flaeche oder jedem Schmutz. Alkalische Reiniger loesen Fett und Eiweiss. Saure Reiniger loesen Kalk und Urinstein. Neutrale Reiniger sind fuer allgemeine Reinigung. Desinfektionsmittel gibt es auf Basis von Alkohol, Chlor oder Quats. Das richtige Mittel in der richtigen Konzentration spart Zeit, schont Flaechen und ist sicher fuer Mitarbeiter und Gaeste.',
    motto: 'Falsches Mittel kann mehr schaden als nuetzen — kenne deine Produkte.',
    rules: [
      'Alkalische Reiniger (pH > 8): Loesen Fett, Eiweiss, Hautschuppen. Gut fuer Umkleiden, Duschen, Beckenrand.',
      'Saure Reiniger (pH < 6): Loesen Kalk, Rost, Urinstein. Gut fuer Fliesen, Armaturen, WC.',
      'Neutrale Reiniger (pH 6-8): Schonendes Allgemeinreinigen. Fuer Boeden, Glasflaechen, empfindliche Oberflaechen.',
      'Desinfektionsmittel: Immer nach Hersteller-Angabe verduernen und Einwirkzeit einhalten.',
      'Konzentration einhalten: Zu wenig = keine Wirkung, zu viel = Schaeden an Flaechen und Gesundheitsrisiko.'
    ],
    steps: [
      {
        title: '1. Alkalische Reiniger',
        text: 'Wirken durch hohen pH-Wert — "verseifern" Fette und loesen Eiweissverbindungen. Anwendung: Duschbereiche, Umkleiden, Beckenumgang. Achtung: Nicht fuer Aluminium und empfindliche Metalle — sie greifen die Oberflaeche an. Bei hoher Konzentration PSA (Handschuhe, Brille) tragen.'
      },
      {
        title: '2. Saure Reiniger',
        text: 'Wirken durch niedrigen pH-Wert — loesen Kalk, Rost, Urinstein und Wassersteinabsatze. Anwendung: WC-Keramik, verkalkte Fliesen, Armaturen. Achtung: NICHT auf Marmor oder Naturstein — loest den Stein auf! Nie zusammen mit Chlorreinigern verwenden — es entsteht Chlorgas!'
      },
      {
        title: '3. Desinfektionsmittel richtig anwenden',
        text: 'Es gibt drei Hauptgruppen: Alkohol (schnell, fuer Haende und Flaechen), Chlor (z.B. Natriumhypochlorit, breitwirkend, fuer Sanitaerbereiche), Quats (quartaere Ammoniumverbindungen, fuer Flaechen). Wichtig: Immer laut Herstellerangabe verduennen, Einwirkzeit einhalten, Belueftung sicherstellen.'
      },
      {
        title: '4. Dosierung und Verduennung',
        text: 'Zu konzentriert = Schaeden an Flaechen, Reizungen bei Mitarbeitern und Gaesten, teure Verschwendung. Zu verduernt = keine ausreichende Wirkung, Keime ueberleben. Dosiergeraete nutzen wenn vorhanden. Verduennung immer nachmessen — nicht schatzen!'
      }
    ],
    examples: [
      {
        title: 'Hartnackige Kalkflecken in der Dusche',
        given: 'In der Dusche sind weisse Kalkabsatze auf den Fliesen, die sich mit normalem Reiniger nicht entfernen lassen.',
        question: 'Welches Mittel ist richtig und was muss beachtet werden?',
        steps: [
          ['Mittel', 'Saurer Reiniger (Kalkloeser) — loest Kalkabsatze chemisch'],
          ['Einwirkzeit', 'Mittel auftragen, einige Minuten einwirken lassen, dann schrubben'],
          ['Achtung', 'Nicht auf Naturstein oder Metall verwenden — Flaeche vorher pruefen'],
          ['PSA', 'Schutzhandschuhe und Augenschutz tragen — saure Reiniger reizen Haut']
        ]
      },
      {
        title: 'Desinfektion nach Magenvirussfall',
        given: 'Ein Besucher hatte einen Durchfall-Unfall im Umkleidebereich. Wie wird desinfiziert?',
        question: 'Welches Desinfektionsmittel ist geeignet und warum?',
        steps: [
          ['Erreger', 'Magen-Darm-Viren (z.B. Noroviren) erfordern viruzide Desinfektionsmittel'],
          ['Mittel', 'Chlorhaltiges Desinfektionsmittel oder VA-gelistetes viruzides Praeparat'],
          ['Einwirkzeit', 'Mindestens 15 Minuten, oft laenger — laut Hersteller und VAH-Liste'],
          ['Schutz', 'Einweghandschuhe, Schuerze, ggf. Mundschutz — danach Haende desinfizieren']
        ]
      }
    ],
    pitfalls: [
      'Saure und chlorhaltige Reiniger NIEMALS mischen — es entsteht giftiges Chlorgas!',
      'Desinfektionsmittel auf nicht gereinigten Flaechen = Geldverschwendung und keine Wirkung.',
      'Eigenhaendige Verduennung "nach Gefuehl" ist gefaehrlich — immer mit Messbecher dosieren.',
      'Abgelaufene Desinfektionsmittel verlieren ihre Wirksamkeit — immer Verfallsdatum pruefen!'
    ],
    quiz: {
      question: 'Welcher Reiniger ist geeignet um Kalkabsatze auf Fliesen zu entfernen?',
      options: [
        'Alkalischer Reiniger — er loest alles',
        'Saurer Reiniger — er loest Kalkabsatze durch den niedrigen pH-Wert',
        'Neutralreiniger — er ist am schonendsten'
      ],
      correctIndex: 1,
      explanation: 'Saure Reiniger (pH < 6) loesen Kalk chemisch auf, weil Kalziumkarbonat in saurem Milieu reagiert und sich aufloest. Alkalische und neutrale Reiniger haben keinen Effekt auf Kalk.'
    }
  },

  hygieneplan: {
    id: 'hygieneplan',
    chip: 'Hygieneplan',
    title: 'Der Hygieneplan — Pflicht und Praxis',
    intro:
      'Ein Hygieneplan ist keine Empfehlung — er ist Pflicht. Er regelt verbindlich fuer alle Mitarbeiter, was wann wie oft und womit gereinigt und desinfiziert wird. Im Schwimmbad ist er besonders wichtig, weil viele Menschen auf engem Raum zusammenkommen und Krankheitserreger (Pilze, Viren, Bakterien) sich auf nassen Flaechen schnell ausbreiten koennen. Ein guter Hygieneplan schuetzt Gaeste, Mitarbeiter und den Betrieb.',
    motto: 'Der Hygieneplan steht — er muss auch gelebt werden.',
    rules: [
      'Jeder Betrieb mit oeffentlichem Badebetrieb braucht einen schriftlichen Hygieneplan.',
      'Der Plan muss fuer alle Mitarbeiter zugaenglich und verstaendlich sein — am besten im Aufenthaltsraum ausgehaengt.',
      'Kontrollen und Reinigungsnachweise muessen dokumentiert werden (Unterschrift, Datum, Uhrzeit).',
      'Der Plan muss regelmaessig aktualisiert werden — z.B. bei neuen Produkten, Umbau oder geaenderten Ablaeufen.',
      'Bei Nichteinhaltung des Hygieneplans hafte der Betrieb bei Schaeden an Gaesten oder Mitarbeitern.'
    ],
    steps: [
      {
        title: '1. Was steht im Hygieneplan?',
        text: 'Flaechenverzeichnis (was wird gereinigt), Mittelangaben (Produktname, Konzentration), Haeufigkeit (taeglich, woechentlich, monatlich), Einwirkzeiten, Verantwortlichkeiten (wer ist zustaendig), Dokumentationspflicht (wie wird nachgewiesen).'
      },
      {
        title: '2. Typische Reinigungszyklen',
        text: 'Taeglich: Beckenumgang, Duschen, WC, Umkleiden, Handlauefe, Schliessflaechen. Woechentlich: Gruendliche Reinigung der Filteranlage-Aussenseiten, Rettungsgeraete pruefen. Monatlich: Tiefenreinigung Technikbereiche, Kontrolle Duschkoepfe auf Legionellen. Jaehrlich: Grosse Inspektion, Schimmelpilz-Kontrolle.'
      },
      {
        title: '3. Dokumentation richtig fuehren',
        text: 'Fuer jede Reinigungsmassnahme: Datum, Uhrzeit, Bereiche, verwendetes Mittel, Konzentration, Einwirkzeit, Name des Mitarbeiters. Diese Dokumentation ist im Schadensfall der Beweis, dass der Betrieb seine Pflichten erfuellt hat. Fehlende Dokumentation gilt als nicht durchgefuehrte Reinigung!'
      },
      {
        title: '4. Sonderfall Legionellen',
        text: 'Legionellen sind Bakterien die im lauwarmen Wasser (25-55 Grad) gedeihen und ueber Duschwasser eingeatmet werden koennen — gefaehrlich fuer immungeschwaechte Personen. Vorbeugung: Warmwasser immer ueber 60 Grad halten, Kalt-wasser unter 20 Grad, regelmaessige Proben und Duschkopf-Reinigung.'
      }
    ],
    examples: [
      {
        title: 'Hygiene-Kontrolle durch Gesundheitsamt',
        given: 'Das Gesundheitsamt kuendigt eine Kontrolle des Hygieneplans und der Dokumentation an.',
        question: 'Was muss vorbereitet sein?',
        steps: [
          ['Hygieneplan', 'Schriftlich, aktuell, unterschrieben von Betriebsleitung'],
          ['Dokumentation', 'Alle Reinigungsnachweise der letzten Monate vollstaendig'],
          ['Produkte', 'Sicherheitsdatenblaetter fuer alle verwendeten Mittel vorhanden'],
          ['Personal', 'Nachweis ueber Hygieneschulungen aller Mitarbeiter']
        ]
      },
      {
        title: 'Pilzbefall in der Umkleide',
        given: 'In der Herrenumkleide wird Schimmelpilz an der Wand entdeckt.',
        question: 'Wie wird vorgegangen und was ist im Hygieneplan anzupassen?',
        steps: [
          ['Sofortmassnahme', 'Bereich sperren, Vorgesetzten informieren, Ursache klaeren'],
          ['Behandlung', 'Spezielles Anti-Schimmel-Desinfektionsmittel verwenden, Ursache (Feuchtigkeit) beheben'],
          ['Hygieneplan', 'Haeufigkeit der Lueftungskontrolle und Feuchtigkeismessung eintragen'],
          ['Praeventiv', 'Lueftungszeiten erhoehen, Reinigungshaeufigkeit temporaer steigern, dokumentieren']
        ]
      }
    ],
    pitfalls: [
      'Hygieneplan im Schrank verstecken reicht nicht — er muss gelebt und dokumentiert werden.',
      'Mitarbeiter die nicht geschult wurden koennen den Hygieneplan nicht einhalten — Schulungen sind Pflicht.',
      'Eigenprodukte oder Billigmittel ohne Pruefung einsetzen kann die Wirksamkeit zerstoeren und haftet rechtlich.',
      'Fehlende Dokumentation ist im Rechtsstreit gleichbedeutend mit nicht durchgefuehrter Reinigung!'
    ],
    quiz: {
      question: 'Welche Wassertemperatur muss Warmwasser mindestens haben um Legionellen zu verhindern?',
      options: [
        'Mindestens 45 Grad Celsius',
        'Mindestens 60 Grad Celsius',
        'Mindestens 80 Grad Celsius'
      ],
      correctIndex: 1,
      explanation: 'Legionellen werden bei Temperaturen ueber 60 Grad Celsius abgetoetet. Warmwasser muss deshalb am Speicher mindestens 60 Grad haben. Die Gefahrenzone fuer Legionellenwachstum liegt zwischen 25 und 55 Grad.'
    }
  }
};

const TabChip = ({ label, active, onClick, darkMode }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      active
        ? 'bg-yellow-500 text-white'
        : darkMode
          ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const Section = ({ title, children, darkMode }) => (
  <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-700/60' : 'bg-gray-50'}`}>
    <h4 className={`font-bold mb-3 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>{title}</h4>
    {children}
  </div>
);

export default function ReinigungDesinfektionDeepDiveView({ onBack }) {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('grundlagen');
  const [quizAnswer, setQuizAnswer] = useState(null);
  const tab = TABS[activeTab];

  return (
    <div className={`min-h-screen p-4 space-y-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
          ← Zurück
        </button>
        <div>
          <h2 className="text-xl font-bold">🧼 Reinigung & Desinfektion</h2>
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
