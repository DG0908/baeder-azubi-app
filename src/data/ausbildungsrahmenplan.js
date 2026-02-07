// Ausbildungsrahmenplan gemäß §4 - Fachangestellte für Bäderbetriebe
// Zeitliche Richtwerte in Wochen pro Ausbildungsjahr
export const AUSBILDUNGSRAHMENPLAN = [
  {
    nr: 1,
    bereich: 'Berufsbildung',
    paragraph: '§3 Nr. 1',
    icon: '📚',
    color: 'bg-blue-500',
    wochen: { jahr1: 0, jahr2: 0, jahr3: 0 }, // während der gesamten Ausbildung
    gesamtWochen: 0, // wird laufend vermittelt
    inhalte: [
      'Bedeutung des Ausbildungsvertrages, insbesondere Abschluss, Dauer und Beendigung, erklären',
      'Gegenseitige Rechte und Pflichten aus dem Ausbildungsvertrag nennen',
      'Möglichkeiten der beruflichen Fortbildung nennen'
    ]
  },
  {
    nr: 2,
    bereich: 'Aufbau und Organisation des Ausbildungsbetriebes',
    paragraph: '§3 Nr. 2',
    icon: '🏢',
    color: 'bg-indigo-500',
    wochen: { jahr1: 0, jahr2: 0, jahr3: 0 },
    gesamtWochen: 0,
    inhalte: [
      'Struktur und Aufgaben von Freizeit- und Badebetrieben beschreiben',
      'Rechtsform, Aufbau und Ablauforganisation des ausbildenden Betriebes erläutern',
      'Beziehungen des ausbildenden Betriebes zu Wirtschaftsorganisationen, Fachverbänden, Berufsvertretungen, Gewerkschaften und Verwaltungen nennen',
      'Grundlagen, Aufgaben und Arbeitsweise der betriebsverfassungs- oder personalvertretungsrechtlichen Organe beschreiben'
    ]
  },
  {
    nr: 3,
    bereich: 'Arbeits- und Tarifrecht, Arbeitsschutz',
    paragraph: '§3 Nr. 3',
    icon: '⚖️',
    color: 'bg-green-500',
    wochen: { jahr1: 0, jahr2: 0, jahr3: 0 },
    gesamtWochen: 0,
    inhalte: [
      'Über Bedeutung und Inhalt von Arbeitsverträgen Auskunft geben',
      'Bestimmungen der für den ausbildenden Betrieb geltenden Tarifverträge nennen',
      'Aufgaben des betrieblichen Arbeitsschutzes, der zuständigen Unfallversicherung und der Gewerbeaufsicht erläutern',
      'Bestimmungen der für den ausbildenden Betrieb geltenden Arbeitsschutzgesetze anwenden',
      'Bestandteile der Sozialversicherung sowie Träger und Beitragssysteme aufzeigen'
    ]
  },
  {
    nr: 4,
    bereich: 'Arbeitssicherheit, Umweltschutz und rationelle Energieverwendung',
    paragraph: '§3 Nr. 4',
    icon: '🛡️',
    color: 'bg-yellow-500',
    wochen: { jahr1: 0, jahr2: 0, jahr3: 0 },
    gesamtWochen: 0,
    inhalte: [
      'Berufsbezogene Vorschriften der Träger der gesetzlichen Unfallversicherung beachten',
      'Arbeitssicherheitsvorschriften bei den Arbeitsabläufen anwenden',
      'Geeignete Maßnahmen zur Verhütung von Unfällen im eigenen Arbeitsbereich ergreifen',
      'Verhaltensregeln für den Brandfall nennen und Maßnahmen zur Brandbekämpfung ergreifen',
      'Gefahren, die von Giften, Gasen, Dämpfen, leicht entzündlichen Stoffen sowie vom elektrischen Strom ausgehen, beachten',
      'Berufsspezifische Bestimmungen zu Gefahrstoffen und -gütern anwenden',
      'Vorschriften zum Schutz der Gesundheit am Arbeitsplatz anwenden',
      'Zur Vermeidung betriebsbedingter Umweltbelastungen nach ökologischen Gesichtspunkten beitragen',
      'Maßnahmen zur Entsorgung von Abfällen unter Beachtung betrieblicher Sicherheitsbestimmungen ergreifen',
      'Zur rationellen Energie- und Materialverwendung im beruflichen Beobachtungs- und Einwirkungsbereich beitragen'
    ]
  },
  {
    nr: 5,
    bereich: 'Aufrechterhaltung der Betriebssicherheit',
    paragraph: '§3 Nr. 5',
    icon: '🔧',
    color: 'bg-purple-500',
    wochen: { jahr1: 12, jahr2: 6, jahr3: 6 },
    gesamtWochen: 24,
    inhalte: [
      'Rechtsvorschriften und betriebliche Bestimmungen, die für den Betrieb des Bades gelten, anwenden',
      'Rechtsvorschriften und betriebliche Grundsätze der Hygiene anwenden',
      'Mittel, Geräte und Verfahren zur Reinigung und Desinfektion anwenden und deren Auswahl begründen',
      'Bei der Organisation von Betriebsabläufen des Badebetriebes mitwirken',
      'Bei der Kontrolle und Beaufsichtigung im Rahmen der Verkehrssicherungspflicht mitwirken'
    ]
  },
  {
    nr: 6,
    bereich: 'Beaufsichtigung des Badebetriebes',
    paragraph: '§3 Nr. 6',
    icon: '👀',
    color: 'bg-cyan-500',
    wochen: { jahr1: 4, jahr2: 6, jahr3: 8 },
    gesamtWochen: 18,
    inhalte: [
      'Gefahren des Badebetriebes in und an Naturgewässern erläutern',
      'Rechtsnormen, Verwaltungsvorschriften, Betriebs- und Dienstanweisungen zur Aufsicht im Badebetrieb sowie die Badeordnung anwenden',
      'Beaufsichtigung im Badebetrieb, insbesondere im Beckenbereich, durchführen',
      'Bei der Planung und Organisation des Aufsichtsdienstes mitwirken',
      'Bedrohliche Situationen im Badebetrieb feststellen und Sofortmaßnahmen einleiten'
    ]
  },
  {
    nr: 7,
    bereich: 'Betreuen von Besuchern',
    paragraph: '§3 Nr. 7',
    icon: '🤝',
    color: 'bg-pink-500',
    wochen: { jahr1: 4, jahr2: 6, jahr3: 4 },
    gesamtWochen: 14,
    inhalte: [
      'Besucher empfangen und informieren',
      'Konfliktfelder beschreiben und Möglichkeiten zur Konfliktregelung anwenden',
      'Über notwendige Hygienemaßnahmen beraten',
      'Besucherwünsche ermitteln und entsprechende Spiel- und Sportarrangements anbieten',
      'Besucher betreuen',
      'Kommunikationsregeln in verschiedenen beruflichen Situationen anwenden und zur Vermeidung von Kommunikationsstörungen beitragen'
    ]
  },
  {
    nr: 8,
    bereich: 'Schwimmen',
    paragraph: '§3 Nr. 8',
    icon: '🏊',
    color: 'bg-blue-600',
    wochen: { jahr1: 7, jahr2: 7, jahr3: 6 },
    gesamtWochen: 20,
    inhalte: [
      'Wettkampftechniken einschließlich Start- und Wendetechniken anwenden',
      'Techniken des Strecken- und Tieftauchens anwenden',
      'Einfachsprünge ausführen',
      'Theoretischen und praktischen Schwimmunterricht für Anfänger durchführen',
      'Schwimmunterricht für Fortgeschrittene durchführen',
      'Spring- und Tauchunterricht für Anfänger durchführen'
    ]
  },
  {
    nr: 9,
    bereich: 'Einleitung und Ausüben von Wasserrettungsmaßnahmen',
    paragraph: '§3 Nr. 9',
    icon: '🚨',
    color: 'bg-red-500',
    wochen: { jahr1: 6, jahr2: 7, jahr3: 7 },
    gesamtWochen: 20,
    inhalte: [
      'Rettungsmaßnahmen, insbesondere unter Anwendung der Methoden des Rettungsschwimmens, durchführen',
      'Rettungssituationen erläutern und entsprechende Rettungsmaßnahmen ableiten',
      'Rettungsgeräte für Wasserrettungsmaßnahmen warten und einsetzen'
    ]
  },
  {
    nr: 10,
    bereich: 'Durchführen von Erster Hilfe und Wiederbelebungsmaßnahmen',
    paragraph: '§3 Nr. 10',
    icon: '🚑',
    color: 'bg-red-600',
    wochen: { jahr1: 4, jahr2: 2, jahr3: 2 },
    gesamtWochen: 8,
    inhalte: [
      'Aufgaben eines Ersthelfers nach den Unfallverhütungsvorschriften des Trägers der gesetzlichen Unfallversicherung ausüben',
      'Herz-Lungen-Wiederbelebungsmaßnahmen an Personen unterschiedlicher Altersgruppen durchführen',
      'Unfallbeteiligte betreuen',
      'Herz-Lungen-Wiederbelebung mit einfachem Gerät, insbesondere Beutel- und Balgbeatmer, durchführen',
      'Verletzten mit und ohne Gerät transportieren'
    ]
  },
  {
    nr: 11,
    bereich: 'Messen physikalischer und chemischer Größen sowie Bestimmen von Stoffkonstanten',
    paragraph: '§3 Nr. 11',
    icon: '🔬',
    color: 'bg-purple-600',
    wochen: { jahr1: 2, jahr2: 0, jahr3: 3 },
    gesamtWochen: 5,
    inhalte: [
      'Länge, Masse, Volumen, Temperatur und Druck messen',
      'Die Bedeutung von Schmelzpunkt, Siedepunkt und Dichte erläutern',
      'pH-Wert und Hygienehilfsparameter bestimmen',
      'Proben unter betrieblichen Bedingungen entnehmen',
      'Messgeräte zur Überwachung der Wasserqualität handhaben und pflegen'
    ]
  },
  {
    nr: 12,
    bereich: 'Kontrollieren und Sichern des technischen Betriebsablaufs',
    paragraph: '§3 Nr. 12',
    icon: '⚙️',
    color: 'bg-gray-600',
    wochen: { jahr1: 7, jahr2: 8, jahr3: 9 },
    gesamtWochen: 24,
    inhalte: [
      'Betriebsabläufe durch regelmäßige Kontrolle der bädertechnischen Anlagen und der Betriebszustände sichern',
      'Arbeits- und Bäderhygiene kontrollieren und sichern',
      'Betriebsdaten von Steuer-, Regel- und Sicherheitseinrichtungen prüfen und dokumentieren',
      'Notfallpläne zur Bewältigung häufiger Störungen anwenden',
      'Prozessabläufe technischer Anlagen, insbesondere zur Schwimm- und Badebeckenwasseraufbereitung, steuern'
    ]
  },
  {
    nr: 13,
    bereich: 'Pflegen und Warten bäder- und freizeittechnischer Einrichtungen',
    paragraph: '§3 Nr. 13',
    icon: '🔩',
    color: 'bg-orange-500',
    wochen: { jahr1: 4, jahr2: 4, jahr3: 4 },
    gesamtWochen: 12,
    inhalte: [
      'Werkstoffe nach Eigenschaften und Einsatzmöglichkeiten beurteilen',
      'Arbeitsgerät, Werkzeuge und Werkstücke einsetzen',
      'Einfache Schlauch- und Rohrverbindungen zusammenfügen und lösen',
      'Aufbau, Einsatz und Wirkungsweise von Armaturen, Filtern und Aggregaten beschreiben',
      'Dichtungen erneuern und Filtereinsätze auswechseln',
      'Technische Anlagen, Geräte und Werkzeuge pflegen und warten',
      'Innen- und Außenanlagen pflegen und warten'
    ]
  },
  {
    nr: 14,
    bereich: 'Durchführung von Verwaltungsarbeiten im Bad',
    paragraph: '§3 Nr. 14',
    icon: '📝',
    color: 'bg-teal-500',
    wochen: { jahr1: 0, jahr2: 4, jahr3: 2 },
    gesamtWochen: 6,
    inhalte: [
      'Ablauforganisation der Verwaltungsarbeiten im Bad beschreiben',
      'Kassensysteme unterscheiden und Kassenabrechnungen erstellen',
      'Einfache Buchungen durchführen',
      'Schriftverkehr erledigen',
      'Vorschriften zum Datenschutz anwenden',
      'Informations- und Kommunikationssysteme aufgabenorientiert einsetzen',
      'Ausgewählte Vorschriften des Vertrags- und Haftungsrechts anwenden',
      'Zahlungsverkehr abwickeln'
    ]
  },
  {
    nr: 15,
    bereich: 'Öffentlichkeitsarbeit',
    paragraph: '§3 Nr. 15',
    icon: '📢',
    color: 'bg-rose-500',
    wochen: { jahr1: 2, jahr2: 2, jahr3: 2 },
    gesamtWochen: 6,
    inhalte: [
      'Inhalte und Zielstellung öffentlichkeitswirksamer Maßnahmen darstellen',
      'Einfache Texte und Werbeträger gestalten',
      'Bei Planung und Organisation von Werbemaßnahmen mitwirken',
      'Werbemaßnahmen durchführen'
    ]
  }
];

// Gesamtzahl der Ausbildungswochen pro Jahr (ca. 52 Wochen - Urlaub - Berufsschule ≈ 40 Wochen betrieblich)
export const WOCHEN_PRO_JAHR = 40;
