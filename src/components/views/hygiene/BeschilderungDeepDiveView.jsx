import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const TABS = {
  grundlagen: {
    id: 'grundlagen',
    chip: 'Grundlagen',
    title: 'Warum sind Schilder so wichtig?',
    intro:
      'Im Schwimmbad kommen taeglich viele Menschen zusammen — Kinder, Erwachsene, Nichtschwimmer, aeltere Gaeste. Schilder und Kennzeichnungen sind die erste Schutzlinie: Sie warnen vor Gefahren, zeigen Verbote, weisen Rettungswege aus und informieren ueber Regeln. Als Fachangestellter fuer Baederbetriebe musst du alle Schilder kennen, ihre Bedeutung erklaeren koennen und sicherstellen, dass sie lesbar, vollstaendig und korrekt angebracht sind.',
    motto: 'Ein fehlendes Schild kann ein Unfall sein, der nicht passiert waere.',
    rules: [
      'Sicherheitszeichen sind in der ASR A1.3 (Technische Regeln fuer Arbeitsstaetten) und der ISO 7010 geregelt.',
      'Farbe ist kein Zufall: Jede Farbe hat eine feste Bedeutung — Rot = Verbot/Gefahr, Gelb = Warnung, Gruen = Rettung, Blau = Gebot.',
      'Alle Schilder muessen gut sichtbar, lesbar und unbeschaedigt sein. Beschaedigte oder verblasste Schilder muessen sofort ersetzt werden.',
      'Badeordnung und Hausordnung sind Pflicht: Sie muessen gut sichtbar am Eingang und an den Becken ausgehaengt sein.',
      'Nichtschwimmerbereiche muessen klar gekennzeichnet sein — mit Tiefenangaben und Warnschildern.'
    ],
    steps: [
      {
        title: '1. Die vier Signalfarben',
        text: 'Rot = Verbot oder Brandschutz (roter Kreis mit Querstrich). Gelb/Orange = Warnung vor Gefahr (gelbes Dreieck). Gruen = Rettungsweg oder Erste Hilfe (gruenes Rechteck). Blau = Gebot (blaues Rund, z.B. Schwimmweste tragen). Diese Farben sind international genormt!'
      },
      {
        title: '2. Verbotsschilder (rot)',
        text: 'Erkennbar am roten Kreis mit Querstrich. Typische Beispiele im Bad: Kein Springen, Kein Kopfsprung, Kein Fotografieren, Kein Essen und Trinken im Beckenbereich, Kein Zugang fuer Unbefugte. Verbote gelten ohne Ausnahme fuer alle.'
      },
      {
        title: '3. Warnschilder (gelb)',
        text: 'Gelbes Dreieck mit schwarzem Symbol. Typisch im Bad: Warnung vor Rutschgefahr (nasser Boden), Warnung vor gefaehrlicher Wassertiefe, Warnung vor Chlorgas im Technikraum, Warnung vor elektrischer Spannung. Warnschilder bedeuten: Vorsicht, Gefahr ist moeglich!'
      },
      {
        title: '4. Rettungs- und Gebotsschilder',
        text: 'Gruene Schilder zeigen Rettungswege, Notausgaenge, AED-Standorte und Erste-Hilfe-Stationen. Blaue Schilder schreiben ein Verhalten vor: Duschen vor dem Baden, Schwimmweste tragen, Rutsche nur einzeln benutzen. Beide sind genauso verbindlich wie Verbotsschilder!'
      }
    ],
    examples: [
      {
        title: 'Tiefenangaben am Becken',
        given: 'Am Beckenrand haengt ein Schild mit "1,35 m" und daneben ein Schild "Kein Kopfsprung".',
        question: 'Was bedeutet das und warum ist es wichtig?',
        steps: [
          ['Tiefenangabe', 'Die Wassertiefe betraegt an dieser Stelle 1,35 m'],
          ['Verbot', 'Kein Kopfsprung — bei dieser Tiefe ist Kopfspringen lebensgefaehrlich'],
          ['Rechtlich', 'Fehlende Tiefenangaben sind eine Verletzung der Verkehrssicherungspflicht'],
          ['Merke', 'Kopfsprung erst ab mind. 1,80 m Tiefe erlaubt (je nach Anlage)']
        ]
      },
      {
        title: 'Rettungsring-Standort',
        given: 'An jedem Becken haengt ein gruenes Schild mit einem Rettungsring-Symbol.',
        question: 'Was muss daneben sein und warum?',
        steps: [
          ['Sinn', 'Das Schild zeigt wo Rettungsgeraete haengen — damit jeder sie sofort findet'],
          ['Pflicht', 'Rettungsringe und Wurfleinen muessen immer einsatzbereit und zurueckgelegt sein'],
          ['Kontrolle', 'Taegliche Sichtkontrolle: Sind Geraete vorhanden, unbeschaedigt, richtig aufgehaengt?'],
          ['Fehlt was', 'Sofort Vorgesetzten informieren und Ersatz beschaffen — nicht warten!']
        ]
      }
    ],
    pitfalls: [
      'Ein Schild das verblasst oder verdeckt ist, gilt rechtlich als NICHT vorhanden — bei einem Unfall haftet der Betreiber.',
      'Verbotsschilder und Gebotschilder haben die GLEICHE Rechtskraft — beide sind verbindlich.',
      'Tiefenangaben muessen am Beckenrand UND senkrecht zur Wasserflaeche sichtbar sein.',
      'Schilder nur in Raeumen aufhaengen reicht nicht — Gaeste lesen sie oft nicht. Mundliche Hinweise der Aufsicht sind genauso wichtig!'
    ],
    quiz: {
      question: 'Welche Farbe haben Warnschilder und was bedeuten sie?',
      options: [
        'Rot — etwas ist verboten',
        'Gelb — es besteht eine moegliche Gefahr, Vorsicht ist geboten',
        'Blau — ein bestimmtes Verhalten ist vorgeschrieben'
      ],
      correctIndex: 1,
      explanation: 'Gelbe Dreiecke sind Warnschilder. Sie signalisieren eine moegliche Gefahr (z.B. Rutschgefahr, Chlorgas, Wassertiefe). Rot = Verbot, Blau = Gebot, Gruen = Rettung.'
    }
  },

  gefahrstoffkennzeichnung: {
    id: 'gefahrstoffkennzeichnung',
    chip: 'Gefahrstoffkennzeichnung',
    title: 'GHS-Symbole & Gefahrenkennzeichnung',
    intro:
      'Im Schwimmbad arbeiten wir mit Chemikalien wie Chlor, Saeuren, Laugen und Flockungsmitteln. Diese Stoffe muessen nach dem GHS-System (Global Harmonisiertes System) gekennzeichnet sein. Die Symbole — auch Piktogramme genannt — warnen vor den spezifischen Gefahren eines Stoffes. Als FaBB musst du diese Symbole auf Anhieb erkennen und wissen, was sie bedeuten.',
    motto: 'GHS-Piktogramme sind international — sie gelten ueberall auf der Welt.',
    rules: [
      'GHS steht fuer "Globally Harmonised System" — weltweit einheitliche Gefahrstoffkennzeichnung.',
      'GHS-Piktogramme sind rautenfoermig (Quadrat auf Spitze), weiss mit rotem Rand und schwarzem Symbol.',
      'Jedes Piktogramm steht fuer eine bestimmte Gefahrenklasse: z.B. Flamme = entzuendlich, Totenkopf = sehr giftig.',
      'Gefahrenstoffe haben immer auch H-Saetze (Hazard = Gefahrenhinweise) und P-Saetze (Precautionary = Sicherheitshinweise).',
      'Sicherheitsdatenblatt (SDB) muss fuer jeden Gefahrstoff vorliegen und zugreifbar sein.'
    ],
    steps: [
      {
        title: '1. Die wichtigsten GHS-Piktogramme',
        text: 'Flamme (GHS02) = leicht-/entzuendlich. Ausrufezeichen (GHS07) = gesundheitsschaedlich, reizend. Aetzung (GHS05) = aetzend fuer Haut/Augen. Totenkopf (GHS06) = akut giftig. Umwelt (GHS09) = umweltgefaehrlich. Gasflasche (GHS04) = unter Druck verpackte Gase.'
      },
      {
        title: '2. H-Saetze lesen',
        text: 'H-Saetze beschreiben die Gefahr: H290 = "Kann fuer Metalle korrosiv sein." H314 = "Verursacht schwere Veraetzungen der Haut und des Auges." H335 = "Kann die Atemwege reizen." Die Zahl gibt die Art der Gefahr an (2xx = physikalisch, 3xx = gesundheit, 4xx = umwelt).'
      },
      {
        title: '3. P-Saetze lesen',
        text: 'P-Saetze geben Verhaltensanweisungen: P260 = "Staub/Rauch/Gas/Nebel nicht einatmen." P280 = "Schutzhandschuhe/Schutzkleidung/Augenschutz tragen." P301+P330+P331 = "BEI VERSCHLUCKEN: Mund aussuepueln. KEIN Erbrechen herbeibeifuehren." Diese Saetze stehen auch im Sicherheitsdatenblatt.'
      },
      {
        title: '4. Sicherheitsdatenblatt (SDB)',
        text: 'Das SDB hat 16 Abschnitte. Die wichtigsten fuer den Alltag: Abschnitt 2 (Gefahren), Abschnitt 4 (Erste-Hilfe), Abschnitt 5 (Brand), Abschnitt 6 (Unfall), Abschnitt 8 (PSA). Das SDB muss fuer jeden Mitarbeiter zugaenglich sein — in der Regel im Technikraum oder Buero.'
      }
    ],
    examples: [
      {
        title: 'Natriumhypochlorit-Loesung (Fluessigchlor)',
        given: 'Ein Kanister mit Natriumhypochlorit (Chlorbleichlauge) steht im Technikraum. Auf dem Etikett sind GHS05 und GHS09 zu sehen.',
        question: 'Was bedeuten diese Symbole und welche Schutzmasnahmen sind noetig?',
        steps: [
          ['GHS05 (Aetzung)', 'Der Stoff ist aetzend — kann Haut und Augen schwer schaedigen'],
          ['GHS09 (Umwelt)', 'Umweltgefaehrlich — darf NICHT ins Abwasser/Grundwasser'],
          ['PSA', 'Schutzbrille, Schutzhandschuhe (Nitril/Neopren), Schuerze tragen'],
          ['Erste Hilfe', 'Bei Hautkontakt sofort mit viel Wasser spuelen, Arzt aufsuchen']
        ]
      },
      {
        title: 'Salzsaeure (pH-Minus)',
        given: 'Ein Behaelter mit Salzsaeure (32%) hat das GHS05-Symbol (Aetzung) und GHS07 (Ausrufezeichen).',
        question: 'Wie muss dieser Stoff gelagert und gehandhabt werden?',
        steps:
          [
          ['GHS05', 'Stark aetzend — direkt gefaehrlich fuer Haut, Augen und Atemwege'],
          ['GHS07', 'Reizend und gesundheitsschaedlich auch bei geringer Konzentration'],
          ['Lagerung', 'Getrennt von Chlorprodukten lagern — Mischung erzeugt Chlorgas!'],
          ['PSA', 'Vollschutzbrille, Saeureschutzhandschuhe, ggf. Atemschutz']
        ]
      }
    ],
    pitfalls: [
      'GHS-Symbole und das alte "Gefahrensymbol" (orange Raute) sind NICHT dasselbe — das alte System ist abgeloest!',
      'Nur ein Symbol bedeutet nicht "weniger gefaehrlich" — ein einziger Totenkopf reicht fuer hoechste Vorsicht.',
      'Sicherheitsdatenblaetter muessen AKTUELL sein — veraltete SDB (aelter als 3 Jahre) muessen erneuert werden.',
      'Gefahrstoffe NIEMALS umfuellen ohne klare Beschriftung des Zielbehaelters — Verwechslungen koennen toedlich sein!'
    ],
    quiz: {
      question: 'Was bedeutet das GHS05-Piktogramm (Aetzung)?',
      options: [
        'Der Stoff ist leicht entzuendlich',
        'Der Stoff ist aetzend und kann Haut und Augen schwer schaedigen',
        'Der Stoff ist umweltgefaehrlich'
      ],
      correctIndex: 1,
      explanation: 'GHS05 zeigt eine Hand und ein Material, das aufgeloest wird — Symbol fuer aetzende Stoffe. Diese koennen Haut, Augen und Schleimhaeute schwer schaedigen. Bei Kontakt sofort mit viel Wasser spuelen und Arzt aufsuchen.'
    }
  },

  praxis: {
    id: 'praxis',
    chip: 'Kontrolle & Praxis',
    title: 'Schilder pruefen und instand halten',
    intro:
      'Das Anbringen von Schildern ist nur der erste Schritt. Im laufenden Betrieb muessen Schilder regelmaessig kontrolliert, gereinigt und bei Bedarf ersetzt werden. Als FaBB bist du Teil dieser Kontrollpflicht. Fehlende, beschaedigte oder verblasste Schilder muessen sofort gemeldet und behoben werden — denn rechtlich gilt: Wer ein Schild nicht in Ordnung haelt, traegt Mitverantwortung fuer daraus entstehende Unfaelle.',
    motto: 'Kontrolle ist keine Buerokratie — sie schuetzt Menschenleben.',
    rules: [
      'Regelmaessige Sichtkontrolle aller Schilder — mindestens woechentlich, besser taeglich bei der Oeffnungskontrolle.',
      'Beschaedigte, verblasste oder fehlende Schilder sofort melden und ersetzen lassen.',
      'Nach Umbauarbeiten oder Raumveraenderungen: Pruefe ob alle Schilder noch korrekt platziert sind.',
      'Saison-Schilder (z.B. "Badesaison beendet") muessen rechtzeitig ausgetauscht werden.',
      'Jede Meldung dokumentieren — schriftlich, mit Datum und Beschreibung.'
    ],
    steps: [
      {
        title: '1. Oeffnungskontrolle',
        text: 'Jeden Morgen beim Aufschliessen: Sind alle Schilder vorhanden? Nichts abgefallen, verdeckt oder beschaedigt? Kurzer Rundgang reicht — aber konsequent jeden Tag. Wenn etwas fehlt: Sofort notieren und melden.'
      },
      {
        title: '2. Was tun wenn ein Schild fehlt?',
        text: 'Erstens: Den Bereich absperren oder eine Alternative schaffen (z.B. muendlicher Hinweis, Leitkegel), bis das Schild ersetzt ist. Zweitens: Schaden schriftlich dokumentieren (Ort, Art, Datum). Drittens: Vorgesetzten informieren und Ersatz beschaffen. NICHT einfach abwarten!'
      },
      {
        title: '3. Schilder richtig anbringen',
        text: 'Hoehe: Augenphoehe (ca. 1,60-1,80 m), damit sie gut lesbar sind. Beleuchtung: Rettungswegsschilder muessen auch bei Stromausfall leuchten (Nachleuchtmasse oder eigene Beleuchtung). Abstand: Nicht durch andere Gegenstaende verdeckt. Material: Fuer Feucht-/Nassbereiche feuchtigkeitsbestaendige Schilder verwenden.'
      },
      {
        title: '4. Dokumentation',
        text: 'Alle Kontrollgaenge und festgestellten Maengel ins Betriebsbuch oder Kontrollbuch eintragen. Datum, Uhrzeit, was geprueft wurde, was bemaengelt wurde, welche Massnahme eingeleitet wurde. Diese Dokumentation ist im Schadensfall dein Nachweis, dass du deine Pflichten erfuellt hast.'
      }
    ],
    examples: [
      {
        title: 'Verblasstes Rutschgefahr-Schild',
        given: 'Beim Rundgang faellt auf: Das Warnschild "Rutschgefahr" am Beckenrand ist durch Chloreinwirkung stark verblasst und kaum noch lesbar.',
        question: 'Was tust du konkret?',
        steps: [
          ['Sofortmassnahme', 'Bereich mit Leitkegeln sichern oder Warnung muendlich an Gaeste weitergeben'],
          ['Dokumentation', 'Schaden ins Betriebsbuch eintragen: Ort, Datum, Zustand'],
          ['Meldung', 'Vorgesetzten informieren und Ersatzschild anfordern'],
          ['Ersetzen', 'Neues Schild anbringen sobald vorhanden — Chlorbestaendiges Material waehlen']
        ]
      },
      {
        title: 'Neuer Bereich nach Umbau',
        given: 'Das Bad hat nach einer Sanierung einen neuen Kleinkinderbereich mit flachem Becken (0,40 m). Welche Schilder muessen hier angebracht werden?',
        question: 'Welche Pflichtbeschilderung braucht der neue Bereich?',
        steps: [
          ['Tiefenangabe', '"0,40 m" — deutlich sichtbar am Beckenrand'],
          ['Altersgrenze', '"Nur fuer Kinder bis X Jahre" oder "Nur unter Aufsicht Erwachsener"'],
          ['Verbote', '"Kein Springen" und "Kein Kopfsprung"'],
          ['Rettung', 'Naechster Rettungsring und AED-Standort ausgeschildert']
        ]
      }
    ],
    pitfalls: [
      'Muendliche Hinweise ersetzen KEINE Schilder — sie ergaenzen sie nur.',
      'Verblasste Schilder sind rechtlich wertlos — ein Schild das man nicht lesen kann, existiert nicht.',
      'Schilder hinter Pflanzen oder Regalen aufhaengen ist sinnlos — sie muessen immer gut sichtbar sein.',
      'Nicht warten bis der Chef kommt — wer einen Mangel sieht und ihn nicht meldet, macht sich mitschuldig.'
    ],
    quiz: {
      question: 'Du entdeckst beim Oeffnungsrundgang ein fehlendes Verbotssschild. Was ist der erste richtige Schritt?',
      options: [
        'Abwarten bis der Vorgesetzte von selbst kommt',
        'Den Bereich sofort sichern (z.B. Leitkegel), Schaden dokumentieren und Vorgesetzten informieren',
        'Das Schild selbst irgendwo abmalen und aufhaengen'
      ],
      correctIndex: 1,
      explanation: 'Ersthelfer-Prinzip: Erst sichern, dann melden, dann dokumentieren. Der Bereich muss sofort abgesichert werden damit kein Unfall passiert. Dann schriftliche Dokumentation und Meldung an den Vorgesetzten damit das Schild so schnell wie moeglich ersetzt wird.'
    }
  }
};

/* --- Shared render helpers (same pattern as other DeepDive views) ----------- */

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

export default function BeschilderungDeepDiveView({ onBack }) {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('grundlagen');
  const [quizAnswer, setQuizAnswer] = useState(null);

  const tab = TABS[activeTab];

  return (
    <div className={`min-h-screen p-4 space-y-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
          ← Zurück
        </button>
        <div>
          <h2 className="text-xl font-bold">🪧 Beschilderung & Kennzeichnungen</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hygiene & Sicherheit · §3 Nr. 4</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.values(TABS).map(t => (
          <TabChip key={t.id} label={t.chip} active={activeTab === t.id} onClick={() => { setActiveTab(t.id); setQuizAnswer(null); }} darkMode={darkMode} />
        ))}
      </div>

      {/* Intro */}
      <div className={`rounded-xl p-4 border-l-4 border-yellow-500 ${darkMode ? 'bg-slate-800' : 'bg-yellow-50'}`}>
        <h3 className="text-lg font-bold mb-2">{tab.title}</h3>
        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tab.intro}</p>
        <p className={`mt-3 text-sm font-semibold italic ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>💡 {tab.motto}</p>
      </div>

      {/* Regeln */}
      <Section title="📋 Das musst du wissen" darkMode={darkMode}>
        <ul className="space-y-2">
          {tab.rules.map((r, i) => (
            <li key={i} className={`flex gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="text-yellow-500 font-bold mt-0.5">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Schritt fuer Schritt */}
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

      {/* Beispiele */}
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

      {/* Fehler vermeiden */}
      <Section title="⚠️ Typische Fehler vermeiden" darkMode={darkMode}>
        <ul className="space-y-2">
          {tab.pitfalls.map((p, i) => (
            <li key={i} className={`flex gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="text-red-400 font-bold mt-0.5">✗</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Mini-Quiz */}
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
              <button
                key={i}
                onClick={() => quizAnswer === null && setQuizAnswer(i)}
                className={`w-full text-left p-3 rounded-lg text-sm border transition-colors ${bg} ${darkMode ? 'border-slate-500' : 'border-gray-200'}`}
              >
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
