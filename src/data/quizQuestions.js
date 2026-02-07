// Fragen-Format:
// - correct: number = Single-Choice (Index der richtigen Antwort)
// - correct: number[] = Multi-Select (Array der richtigen Indizes) - multi: true muss gesetzt sein
export const SAMPLE_QUESTIONS = {
  // ===== BÄDERORGANISATION (Badebetrieb) =====
  org: [
    { q: 'Was ist ein Hausrecht?', a: ['Recht des Badbetreibers, Hausordnung durchzusetzen', 'Recht auf ein Haus', 'Baurecht', 'Mietrecht'], correct: 0 },
    { q: 'Wie lange muss eine Aufsichtsperson im Bad sein?', a: ['Während der Öffnungszeiten', 'Nur morgens', 'Nur abends', 'Keine Pflicht'], correct: 0 },
    { q: 'Was regelt die Badeordnung?', a: ['Verhalten der Badegäste', 'Wassertemperatur', 'Eintrittspreise', 'Öffnungszeiten'], correct: 0 },
    // Dienstplanerstellung
    { q: 'Welcher Aspekt muss bei der Erstellung von Dienstplänen berücksichtigt werden?', a: ['Urlaubszeiten der Mitarbeiter', 'Lieblingsfarbe der Gäste', 'Wetter der nächsten Woche', 'Aktienkurse'], correct: 0 },
    { q: 'Was gehört NICHT zu den Umständen bei der Dienstplanerstellung? (Mehrere richtig)', a: ['Qualifikation der Mitarbeiter', 'Besucherzahlen/Stoßzeiten', 'Private Hobbys der Gäste', 'Gesetzliche Ruhezeiten'], correct: 2 },
    { q: 'Welche 5 Aspekte müssen bei der Dienstplanerstellung berücksichtigt werden? (Mehrere richtig)', a: ['Qualifikation/Rettungsfähigkeit', 'Gesetzliche Arbeitszeiten', 'Urlaubsansprüche', 'Stoßzeiten/Besucherzahlen'], correct: [0, 1, 2, 3], multi: true },
    // Schulschwimmen
    { q: 'Welche Auswirkung hat die Schließung eines Schwimmbads auf das Schulschwimmen?', a: ['Längere Anfahrtswege für Schulen', 'Mehr Parkplätze', 'Günstigere Eintrittspreise', 'Weniger Hausaufgaben'], correct: 0 },
    { q: 'Nach welchem Kriterium werden Schwimmzeiten für Schulen verteilt?', a: ['Entfernung zum Bad und Schülerzahl', 'Alphabetische Reihenfolge', 'Wer zuerst kommt', 'Losverfahren'], correct: 0 },
    // Standortwahl Schwimmbad
    { q: 'Welches Kriterium ist bei der Standortwahl für ein neues Schwimmbad wichtig?', a: ['Gute Verkehrsanbindung', 'Nähe zu Flughäfen', 'Hohe Kriminalitätsrate', 'Viele Industriegebiete'], correct: 0 },
    { q: 'Welche Kriterien sind für die Standortwahl eines Schwimmbads relevant? (Mehrere richtig)', a: ['Einzugsgebiet/Bevölkerungsdichte', 'ÖPNV-Anbindung', 'Parkplatzsituation', 'Anzahl der Bäckereien'], correct: [0, 1, 2], multi: true },
    // Wasseraufsicht DGfdB R 94.05
    { q: 'Welche Anforderung gilt für Personen der Wasseraufsicht nach DGfdB R 94.05?', a: ['Rettungsfähigkeit nachgewiesen', 'Mindestens 2m groß', 'Unter 25 Jahre alt', 'Schwimmabzeichen Seepferdchen'], correct: 0 },
    { q: 'Welche Anforderungen gelten für die Wasseraufsicht? (Mehrere richtig)', a: ['Gültiger Rettungsschwimmnachweis', 'Erste-Hilfe-Ausbildung', 'Regelmäßige Fortbildung', 'Führerschein Klasse B'], correct: [0, 1, 2], multi: true },
    // Großrutschen Sicherheit
    { q: 'Welche Sicherheitsmaßnahme gilt beim Betrieb von Großrutschen?', a: ['Ampelanlage zur Startfreigabe', 'Keine Aufsicht nötig', 'Unbegrenzte Personenzahl', 'Rutschen ohne Wasser'], correct: 0 },
    { q: 'Welche Sicherheitsmaßnahmen gelten bei Großrutschen? (Mehrere richtig)', a: ['Startfreigabe-System (Ampel)', 'Auslaufbecken mit Aufsicht', 'Mindestabstand zwischen Nutzern', 'Altersfreigabe ab 3 Jahren'], correct: [0, 1, 2], multi: true },
    // Sprunganlagen Kontrollen
    { q: 'Was muss regelmäßig an Sprunganlagen kontrolliert werden?', a: ['Trittsicherheit der Oberflächen', 'Farbe der Bretter', 'Anzahl der Zuschauer', 'Wassertemperatur im Becken'], correct: 0 },
    { q: 'Welche Kontrollen sind an Sprunganlagen durchzuführen? (Mehrere richtig)', a: ['Standfestigkeit/Verankerung', 'Rutschfestigkeit der Beläge', 'Wassertiefe im Sprungbereich', 'Geländer und Handläufe'], correct: [0, 1, 2, 3], multi: true },
    // Wellenbecken Sicherheit
    { q: 'Welche Sicherheitsmaßnahme ist beim Wellenbecken wichtig?', a: ['Durchsage vor Wellenbetrieb', 'Wellen ohne Vorwarnung', 'Keine Aufsicht im Tiefbereich', 'Schwimmhilfen verboten'], correct: 0 },
    // Betriebstagebuch
    { q: 'Was wird im Betriebstagebuch zur Wasseraufbereitung eingetragen?', a: ['Chlorwerte und pH-Wert', 'Namen der Badegäste', 'Wettervorhersage', 'Fernsehprogramm'], correct: 0 },
    { q: 'Welche Einträge gehören ins Betriebstagebuch? (Mehrere richtig)', a: ['Hygiene-Hilfsparameter (Chlor, pH, Redox)', 'Filterspülungen', 'Chemikalienverbrauch', 'Störungen/Reparaturen'], correct: [0, 1, 2, 3], multi: true },
    // Angebote & Zielgruppen
    { q: 'Welches Angebot passt zur Zielgruppe "Senioren"?', a: ['Wassergymnastik', 'Techno-Schwimmparty', 'Wildwasser-Rafting', 'Turmspringen'], correct: 0 },
    { q: 'Ordne Angebote zu Zielgruppen: Welche passen zusammen? (Mehrere richtig)', a: ['Babyschwimmen - Eltern mit Kleinkindern', 'Aqua-Fitness - Erwachsene', 'Schwimmkurse - Anfänger', 'Nachtbaden - Familien mit Babys'], correct: [0, 1, 2], multi: true },
    // Animationsplanung
    { q: 'Was muss bei der Planung eines Animationsangebots berücksichtigt werden?', a: ['Zielgruppe und Teilnehmerzahl', 'Aktienkurse', 'Mondphasen', 'Politische Lage'], correct: 0 },
    // Marketing-Regelkreis
    { q: 'Was gehört zum Marketing-Regelkreis?', a: ['Analyse - Planung - Durchführung - Kontrolle', 'Kochen - Essen - Schlafen - Aufwachen', 'Einkaufen - Verkaufen - Sparen - Ausgeben', 'Laufen - Springen - Schwimmen - Fliegen'], correct: 0 },
    // Marketing-Mix
    { q: 'Was beschreibt der Marketing-Mix?', a: ['Kombination der 4 Ps: Product, Price, Place, Promotion', 'Mischung verschiedener Getränke', 'Musikprogramm im Bad', 'Zusammenstellung des Personals'], correct: 0 },
    // Einwintern
    { q: 'Was versteht man unter "Einwintern" eines Freibads?', a: ['Maßnahmen zum Schutz vor Frostschäden', 'Öffnung im Winter', 'Heizen des Beckens', 'Winterbaden anbieten'], correct: 0 },
    { q: 'Welche Maßnahmen gehören zur Einwinterung eines Freibad-Sportbeckens? (Mehrere richtig)', a: ['Wasserstand absenken', 'Leitungen entleeren', 'Abdeckung anbringen', 'Wasser auf 40°C heizen'], correct: [0, 1, 2], multi: true },
    // Kassensystem
    { q: 'Was spricht für ein Computer-Kassensystem?', a: ['Automatische Umsatzerfassung', 'Mehr Personalaufwand', 'Langsamere Abfertigung', 'Höhere Fehlerquote'], correct: 0 },
    // Kassentagesabrechnung
    { q: 'Was muss auf einer Kassentagesabrechnung stehen?', a: ['Datum und Gesamtumsatz', 'Lieblingsspeise des Kassierers', 'Wetterbericht', 'Fernsehprogramm'], correct: 0 },
    // Public Relations
    { q: 'Was fällt unter "Public Relations"?', a: ['Zeitungsartikel über das Schwimmbad', 'Gutscheine verkaufen', 'Eintrittspreise erhöhen', 'Personal entlassen'], correct: 0 },
    // Preisdifferenzierung
    { q: 'Was ist eine "Happy Hour" im Schwimmbad?', a: ['Zeitliche Preisdifferenzierung', 'Örtliche Preisdifferenzierung', 'Preisdifferenzierung nach Zielgruppen', 'Quantitative Preisdifferenzierung'], correct: 0 }
  ],

  // ===== BÄDERTECHNIK =====
  tech: [
    { q: 'Was ist der pH-Wert von neutralem Wasser?', a: ['7', '5', '9', '11'], correct: 0 },
    { q: 'Welche Temperatur hat ein Sportbecken normalerweise?', a: ['26-28°C', '20-22°C', '30-32°C', '35-37°C'], correct: 0 },
    { q: 'Was macht eine Umwälzpumpe?', a: ['Pumpt Wasser durch Filter', 'Heizt das Wasser', 'Misst den pH-Wert', 'Chloriert das Wasser'], correct: 0 },
    // Chlor/Desinfektion
    { q: 'Welchen Einfluss hat freies Chlor auf die Desinfektion?', a: ['Tötet Keime ab', 'Färbt das Wasser blau', 'Erhöht die Temperatur', 'Senkt den Wasserstand'], correct: 0 },
    { q: 'Was bedeutet ein zu niedriger freier Chlorwert (0,1 mg/L)?', a: ['Unzureichende Desinfektion', 'Optimale Wasserqualität', 'Zu viel Chlor', 'Perfekter Zustand'], correct: 0 },
    { q: 'Was bedeutet ein hoher gebundener Chlorwert (0,5 mg/L)?', a: ['Zu viele Verunreinigungen, die mit Chlor reagiert haben', 'Gute Wasserqualität', 'Zu wenig Badegäste', 'Optimale Desinfektion'], correct: 0 },
    { q: 'Was bedeutet ein zu niedriger pH-Wert (6,2)?', a: ['Wasser ist zu sauer, Chlorwirkung eingeschränkt', 'Wasser ist zu basisch', 'Optimaler Wert', 'Perfekt für Schwimmer'], correct: 0 },
    // Messfehler
    { q: 'Was kann zu Messfehlern beim photometrischen Verfahren führen?', a: ['Verschmutzte Küvetten', 'Zu sauberes Wasser', 'Zu viele Badegäste', 'Sonnenschein'], correct: 0 },
    { q: 'Welche Fehler können beim photometrischen Verfahren auftreten? (Mehrere richtig)', a: ['Verschmutzte Küvetten', 'Falsche Reagenzien', 'Abgelaufene Reagenzien', 'Zu kaltes Wasser'], correct: [0, 1, 2], multi: true },
    { q: 'Was kann zu Fehlern an der Messzelle führen?', a: ['Verschmutzte Elektroden', 'Zu viel Sonnenlicht', 'Zu viele Schwimmer', 'Falsche Beckengröße'], correct: 0 },
    // Ursachen Abweichung
    { q: 'Was kann eine Ursache für abweichende Wasserwerte sein (ohne Messfehler)?', a: ['Hohe Besucherzahlen', 'Zu wenig Personal', 'Falsche Kassenabrechnung', 'Schlechtes Wetter'], correct: 0 },
    { q: 'Welche Ursachen können zu abweichenden Wasserwerten führen? (Mehrere richtig)', a: ['Hohe Besucherzahl', 'Defekte Dosieranlage', 'Filterproblem', 'Zu wenig Umwälzung'], correct: [0, 1, 2, 3], multi: true },
    // Sorptionsfilter
    { q: 'Welche Aufgabe hat der Sorptionsfilter?', a: ['Entfernung von Ozonresten und organischen Stoffen', 'Wasser erwärmen', 'Chlor hinzufügen', 'pH-Wert erhöhen'], correct: 0 },
    { q: 'Welche Aufgaben hat der Sorptionsfilter? (Mehrere richtig)', a: ['Ozonabbau', 'Adsorption organischer Stoffe', 'Biologischer Abbau von Verunreinigungen', 'Wasser aufheizen'], correct: [0, 1, 2], multi: true },
    // Pumpen-Kenngrößen
    { q: 'Wofür steht U = 400 V bei einer Pumpe?', a: ['Spannung (Volt)', 'Umdrehungen', 'Umwälzrate', 'Uhrzeit'], correct: 0 },
    { q: 'Wofür steht Pzu bei einer Pumpe?', a: ['Zugeführte Leistung (kW)', 'Pumpenanzahl', 'Personenzahl', 'Prüfungszeit'], correct: 0 },
    { q: 'Wofür steht Q bei einer Pumpe?', a: ['Volumenstrom (m³/h)', 'Qualität', 'Quadratmeter', 'Querschnitt'], correct: 0 },
    { q: 'Was bedeutet η (Eta) bei einer Pumpe?', a: ['Wirkungsgrad (Verhältnis Nutz-/Aufwandleistung)', 'Wasserhärte', 'Temperatur', 'Chlorgehalt'], correct: 0 },
    // Flockung
    { q: 'Was ist eine Voraussetzung für funktionierende Flockung?', a: ['Richtige Dosierung des Flockungsmittels', 'Hohe Wassertemperatur', 'Viele Badegäste', 'Starke Beleuchtung'], correct: 0 },
    { q: 'Welche Voraussetzungen braucht eine funktionierende Flockung? (Mehrere richtig)', a: ['Richtige Flockungsmittel-Dosierung', 'Geeigneter pH-Wert', 'Ausreichende Reaktionszeit', 'Turbulente Vermischung'], correct: [0, 1, 2, 3], multi: true },
    // Teilchengrößen
    { q: 'Welche Kategorie von Teilchengrößen gibt es bei Wasserverschmutzung?', a: ['Gelöste Stoffe', 'Gefrorene Stoffe', 'Verdampfte Stoffe', 'Magnetische Stoffe'], correct: 0 },
    { q: 'Welche 3 Kategorien von Teilchengrößen gibt es? (Mehrere richtig)', a: ['Gelöste Stoffe', 'Kolloidale Stoffe', 'Suspendierte Stoffe', 'Radioaktive Stoffe'], correct: [0, 1, 2], multi: true },
    // Filtersysteme
    { q: 'Was ist ein Vorteil des Schnell-Schüttfilters?', a: ['Hohe Filterleistung bei großen Wassermengen', 'Sehr klein', 'Kein Strom nötig', 'Funktioniert ohne Wasser'], correct: 0 },
    { q: 'Was ist ein Vorteil des Anschwemmfilters?', a: ['Sehr feine Filtration möglich', 'Keine Wartung nötig', 'Extrem billig', 'Funktioniert mit Luft'], correct: 0 },
    { q: 'Was ist ein Vorteil des Ultrafilters?', a: ['Entfernt auch Bakterien und Viren', 'Keine Energie nötig', 'Wartungsfrei', 'Funktioniert bei Frost'], correct: 0 },
    // Klappenstellungen
    { q: 'Wie ist die Rohwasser-Klappe im Filterbetrieb?', a: ['Offen', 'Geschlossen', 'Halb offen', 'Gibt es nicht'], correct: 0 },
    { q: 'Wie ist die Spülwasser-Klappe im Filterbetrieb?', a: ['Geschlossen', 'Offen', 'Halb offen', 'Gibt es nicht'], correct: 0 },
    // Filter-Berechnungen
    { q: 'Was ist das Freibord bei einem Filter?', a: ['Abstand zwischen Filterbett-Oberkante und Behälter-Oberkante', 'Wassertiefe', 'Filterdicke', 'Rohrdurchmesser'], correct: 0 },
    { q: 'Was beschreibt die Filtergeschwindigkeit?', a: ['Wie schnell Wasser durch den Filter fließt (m/h)', 'Wie schnell der Filter rotiert', 'Wie schnell man den Filter wechselt', 'Umdrehungen pro Minute'], correct: 0 },
    // Ankreuzfragen Technik
    { q: 'Was versteht man unter "Fluidisierung" bei Filtern?', a: ['Auflockern des Filterbetts bei der Spülung', 'Ablassen des Wassers vor der Spülung', 'Besiedelung durch Algen', 'Verfestigung des Sandes'], correct: 0 },
    { q: 'Welche Aufgabe haben Phosphate in alkalischen Reinigern?', a: ['Binden von Kalk', 'Senken der Oberflächenspannung', 'Lösen von Fetten', 'Färben des Reinigers'], correct: 0 },
    { q: 'Welche Aufgabe haben Emulgatoren in Reinigern?', a: ['Bessere Löslichkeit von Fetten in Wasser', 'Senken der Oberflächenspannung', 'Binden von Kalk', 'Desinfizieren'], correct: 0 },
    { q: 'Welcher Reiniger sollte gegen Mineralablagerungen eingesetzt werden?', a: ['Saurer Reiniger', 'Alkalischer Reiniger', 'Neutraler Reiniger', 'Gar kein Reiniger'], correct: 0 },
    // Flockungsmittel-Berechnung
    { q: 'Ein Bad hat 180 m³/h Volumenstrom und 6,5 kg Flockungsmittelverbrauch in 48h. Wie hoch ist die Konzentration?', a: ['Ca. 0,75 g/m³', 'Ca. 7,5 g/m³', 'Ca. 75 g/m³', 'Ca. 0,075 g/m³'], correct: 0 },
    // ===== PRÜFUNGSFACH 3: BÄDERTECHNIK - Naturwissenschaftliche Grundlagen =====
    // Atomaufbau & Chemie (Fragen 1-24)
    { q: 'Wie ist ein Atom aufgebaut?', a: ['Atomkern (Protonen + Neutronen) umgeben von einer Elektronenhülle', 'Nur aus Protonen bestehend', 'Elektronen im Kern, Protonen außen', 'Nur aus Neutronen aufgebaut'], correct: 0 },
    { q: 'Was versteht man unter einem Molekül?', a: ['Verbindung aus zwei oder mehr Atomen', 'Ein einzelnes Proton', 'Ein freies Elektron', 'Ein Atomkern ohne Hülle'], correct: 0 },
    { q: 'Was sind Elektronen?', a: ['Negativ geladene Teilchen in der Atomhülle', 'Positiv geladene Kernteilchen', 'Ungeladene Kernteilchen', 'Bestandteile von Molekülen'], correct: 0 },
    { q: 'Was sind Protonen?', a: ['Positiv geladene Teilchen im Atomkern', 'Negativ geladene Hüllenteilchen', 'Ungeladene Teilchen', 'Freie Elektronen'], correct: 0 },
    { q: 'Was sind Neutronen?', a: ['Elektrisch neutrale Teilchen im Atomkern', 'Positiv geladene Teilchen', 'Negativ geladene Teilchen', 'Teilchen in der Elektronenhülle'], correct: 0 },
    { q: 'Woraus setzt sich die Masse eines Atoms fast ausschließlich zusammen?', a: ['Aus Protonen und Neutronen im Kern', 'Aus Elektronen', 'Aus der Elektronenhülle', 'Aus dem Vakuum zwischen Kern und Hülle'], correct: 0 },
    { q: 'Welche Elementarteilchen sind für chemische Reaktionen von Bedeutung?', a: ['Elektronen (besonders Valenzelektronen)', 'Neutronen', 'Protonen', 'Alle Kernbestandteile'], correct: 0 },
    { q: 'Wie ist das Periodensystem der Elemente aufgebaut?', a: ['Nach steigender Ordnungszahl in Perioden und Gruppen', 'Alphabetisch nach Namen', 'Nach Entdeckungsdatum', 'Nach der Farbe der Elemente'], correct: 0 },
    { q: 'Welche Elemente befinden sich in der 7. Hauptgruppe des PSE?', a: ['Halogene (Fluor, Chlor, Brom, Iod)', 'Edelgase (Helium, Neon, Argon)', 'Alkalimetalle (Lithium, Natrium)', 'Erdalkalimetalle (Calcium, Magnesium)'], correct: 0 },
    { q: 'Was versteht man unter den Halogenen?', a: ['Elemente der 7. Hauptgruppe wie Fluor, Chlor, Brom, Iod', 'Edelgase der 8. Hauptgruppe', 'Metalle der 1. Hauptgruppe', 'Halbmetalle der 4. Hauptgruppe'], correct: 0 },
    { q: 'Wo finden Sie Chlor im Periodensystem?', a: ['7. Hauptgruppe, 3. Periode, Ordnungszahl 17', '1. Hauptgruppe, 2. Periode', '8. Hauptgruppe, 3. Periode', '6. Hauptgruppe, 4. Periode'], correct: 0 },
    { q: 'Wofür steht das chemische Symbol "Cl"?', a: ['Chlor', 'Calcium', 'Chrom', 'Kohlenstoff'], correct: 0 },
    { q: 'Wofür steht das chemische Symbol "Ca"?', a: ['Calcium', 'Chlor', 'Kohlenstoff', 'Cadmium'], correct: 0 },
    { q: 'Wofür steht das chemische Symbol "Fe"?', a: ['Eisen', 'Fluor', 'Francium', 'Fermium'], correct: 0 },
    { q: 'Wofür steht das chemische Symbol "Mg"?', a: ['Magnesium', 'Mangan', 'Molybdän', 'Quecksilber'], correct: 0 },
    { q: 'Wofür steht das chemische Symbol "N"?', a: ['Stickstoff', 'Natrium', 'Neon', 'Nickel'], correct: 0 },
    { q: 'Worüber gibt die Nummer der Hauptgruppe des PSE Auskunft?', a: ['Über die Anzahl der Valenzelektronen', 'Über die Masse des Atoms', 'Über die Anzahl der Neutronen', 'Über den Aggregatzustand'], correct: 0 },
    { q: 'Was versteht man unter einem Ion?', a: ['Ein elektrisch geladenes Atom oder Molekül', 'Ein neutrales Atom', 'Ein freies Neutron', 'Ein ungeladenes Molekül'], correct: 0 },
    { q: 'Wobei sind Ionenbindungen typisch?', a: ['Bei Verbindungen zwischen Metallen und Nichtmetallen (z.B. NaCl)', 'Nur bei Gasen', 'Nur bei organischen Verbindungen', 'Bei Edelgasen'], correct: 0 },
    { q: 'Wie unterscheidet man Ionen?', a: ['Kationen (positiv geladen) und Anionen (negativ geladen)', 'Große und kleine Ionen', 'Heiße und kalte Ionen', 'Feste und flüssige Ionen'], correct: 0 },
    { q: 'Was versteht man unter Hydratation?', a: ['Anlagerung von Wassermolekülen an gelöste Ionen', 'Verdampfung von Wasser', 'Gefrieren von Wasser', 'Zerlegung von Wasser in H und O'], correct: 0 },
    { q: 'Was versteht man unter Dissoziation?', a: ['Zerfall einer Verbindung in Ionen beim Lösen in Wasser', 'Zusammenfügen von Atomen', 'Verdampfung einer Flüssigkeit', 'Gefrieren einer Lösung'], correct: 0 },
    { q: 'Was versteht man unter Elektrolyse?', a: ['Zerlegung einer chemischen Verbindung durch elektrischen Strom', 'Herstellung von Strom aus Wasser', 'Mischung zweier Flüssigkeiten', 'Erwärmung von Wasser'], correct: 0 },
    { q: 'In welche Bestandteile dissoziiert Natriumchlorid (NaCl)?', a: ['Na⁺ (Natrium-Kation) und Cl⁻ (Chlorid-Anion)', 'Na und Cl als neutrale Atome', 'NaO und HCl', 'Na₂ und Cl₂'], correct: 0 },
    { q: 'Was ist NaCl?', a: ['Natriumchlorid (Kochsalz)', 'Natriumcarbonat', 'Natriumhydroxid', 'Natriumhypochlorit'], correct: 0 },
    { q: 'Was versteht man unter der Molmasse?', a: ['Die Masse von einem Mol eines Stoffes in g/mol', 'Das Volumen eines Gases', 'Die Temperatur einer Lösung', 'Die Dichte eines Feststoffs'], correct: 0 },
    { q: 'Was ist ein Mol?', a: ['6,022 × 10²³ Teilchen eines Stoffes', '1000 Gramm eines Stoffes', '1 Liter einer Lösung', '100 Atome eines Elements'], correct: 0 },
    { q: 'Wobei verwendet man die Einheit mol oder mmol?', a: ['Bei der Angabe von Stoffmengen in der Chemie', 'Bei Längenangaben', 'Bei Temperaturmessungen', 'Bei Druckangaben'], correct: 0 },
    { q: 'Wann verwendet man die Einheit ppm?', a: ['Bei sehr kleinen Konzentrationen (parts per million)', 'Bei großen Mengen in Tonnen', 'Bei Temperaturangaben', 'Bei Druckmessungen'], correct: 0 },
    { q: 'Welche Bedeutung hat die Einheit ppm?', a: ['Parts per million = Teile pro Million = mg/L', 'Prozent pro Minute', 'Pumpenleistung pro Meter', 'Partikel pro Mikroliter'], correct: 0 },
    { q: 'Wie viel sind 1000 ppm in cm³/m³?', a: ['1000 cm³/m³', '100 cm³/m³', '10 cm³/m³', '10000 cm³/m³'], correct: 0 },
    // Säuren & Laugen (Fragen 25-45)
    { q: 'Was sind typische Eigenschaften von Säuren?', a: ['Saurer Geschmack, pH < 7, ätzend, reagieren mit Metallen', 'Seifig, glatt, pH > 7', 'Neutral, geschmacklos, pH = 7', 'Süß, klebrig, nicht reaktiv'], correct: 0 },
    { q: 'Wobei spielen Säuren im Schwimmbadbereich eine wichtige Rolle?', a: ['pH-Wert-Korrektur und Desinfektion', 'Beheizung des Beckens', 'Beleuchtung der Halle', 'Steuerung der Wellenmaschine'], correct: 0 },
    { q: 'Welche Säure wird zur pH-Wert-Senkung im Schwimmbad eingesetzt?', a: ['Salzsäure (HCl) oder Schwefelsäure (H₂SO₄)', 'Essigsäure', 'Zitronensäure', 'Kohlensäure'], correct: 0 },
    { q: 'Welche Sicherheitsmaßnahmen gelten beim Umgang mit Säuren?', a: ['Schutzbrille, Handschuhe, Schürze tragen; nie Wasser in Säure geben', 'Keine besonderen Maßnahmen nötig', 'Nur Handschuhe reichen aus', 'Säuren können bedenkenlos mit Wasser gemischt werden'], correct: 0 },
    { q: 'Wie reagiert eine neutrale Flüssigkeit bei Säurehinzugabe?', a: ['Der pH-Wert sinkt unter 7 (wird sauer)', 'Der pH-Wert steigt über 7', 'Der pH-Wert bleibt bei 7', 'Die Flüssigkeit wird basisch'], correct: 0 },
    { q: 'Was sind typische Eigenschaften von Laugen?', a: ['Seifig, ätzend, pH > 7, reagieren mit Fetten', 'Sauer, pH < 7, reagieren mit Metallen', 'Neutral, pH = 7, nicht reaktiv', 'Süß, klebrig, pH = 14'], correct: 0 },
    { q: 'Wofür werden Laugen im Schwimmbad angewendet?', a: ['pH-Wert-Erhöhung und Reinigung', 'Nur zur Wassererwärmung', 'Ausschließlich zur Desinfektion', 'Zur Beckenwasserfärbung'], correct: 0 },
    { q: 'Welche Lauge wird im Schwimmbad häufig zur pH-Korrektur eingesetzt?', a: ['Natronlauge (NaOH)', 'Kalilauge', 'Ammoniaklösung', 'Calciumhydroxid-Lösung'], correct: 0 },
    { q: 'Welche Sicherheitsmaßnahmen gelten beim Umgang mit Laugen?', a: ['Schutzbrille, Handschuhe und Schutzkleidung tragen', 'Keine besonderen Maßnahmen nötig', 'Nur bei hohen Konzentrationen vorsichtig sein', 'Laugen sind ungefährlich'], correct: 0 },
    { q: 'Wie reagiert Beckenwasser bei Hinzugabe einer Lauge?', a: ['Der pH-Wert steigt (wird basischer)', 'Der pH-Wert sinkt', 'Der pH-Wert ändert sich nicht', 'Das Wasser wird sauer'], correct: 0 },
    { q: 'Was ist beim Umgang mit Säuren und Laugen allgemein zu beachten?', a: ['Schutzausrüstung tragen, getrennt lagern, nie mischen', 'Können bedenkenlos zusammen gelagert werden', 'Keine besonderen Vorsichtsmaßnahmen nötig', 'Nur im Freien verwenden'], correct: 0 },
    { q: 'Was tun Sie, wenn Ihre Haut mit Säure oder Lauge in Berührung kommt?', a: ['Sofort mit viel Wasser spülen (mindestens 15 Minuten)', 'Mit einem Tuch abreiben', 'Mit Seife waschen', 'Nichts tun, es vergeht von selbst'], correct: 0 },
    { q: 'Wie entsteht Salzsäure?', a: ['Durch Lösen von Chlorwasserstoffgas (HCl) in Wasser', 'Durch Mischen von Salz mit Essig', 'Durch Elektrolyse von Natriumchlorid', 'Durch Erhitzen von Kochsalz'], correct: 0 },
    { q: 'Wie heißt die Säure HCl?', a: ['Salzsäure', 'Schwefelsäure', 'Kohlensäure', 'Unterchlorige Säure'], correct: 0 },
    { q: 'Wie heißt die Säure H₂SO₄?', a: ['Schwefelsäure', 'Salzsäure', 'Salpetersäure', 'Phosphorsäure'], correct: 0 },
    { q: 'Wie heißt die Säure HClO?', a: ['Unterchlorige Säure (Hypochlorige Säure)', 'Salzsäure', 'Schwefelsäure', 'Perchlorsäure'], correct: 0 },
    { q: 'Welche chemische Formel hat Salzsäure?', a: ['HCl', 'H₂SO₄', 'HClO', 'HNO₃'], correct: 0 },
    { q: 'Welche chemische Formel hat Schwefelsäure?', a: ['H₂SO₄', 'HCl', 'H₂CO₃', 'HClO'], correct: 0 },
    { q: 'Wofür wird HCl im Schwimmbad verwendet?', a: ['Zur pH-Wert-Senkung', 'Zur Wassererwärmung', 'Zur Beckenbeleuchtung', 'Zur Wasserfärbung'], correct: 0 },
    { q: 'Wofür wird HClO im Schwimmbad verwendet?', a: ['Zur Desinfektion des Beckenwassers', 'Zur Wassererwärmung', 'Zur pH-Wert-Erhöhung', 'Zur Entfärbung des Wassers'], correct: 0 },
    { q: 'Was ist NaOH?', a: ['Natriumhydroxid (Natronlauge)', 'Natriumchlorid (Kochsalz)', 'Natriumhypochlorit', 'Natriumcarbonat'], correct: 0 },
    { q: 'Wofür wird Natronlauge im Schwimmbad verwendet?', a: ['Zur pH-Wert-Anhebung', 'Zur Desinfektion', 'Zur Wassererwärmung', 'Zur Filterreinigung'], correct: 0 },
    { q: 'Was entsteht, wenn Ammoniakwasser mit Chlor (Cl₂) reagiert?', a: ['Chloramine (gebundenes Chlor)', 'Salzsäure', 'Natriumhypochlorit', 'Ozon'], correct: 0 },
    { q: 'Wie entstehen Säuren allgemein?', a: ['Durch Lösen von Nichtmetalloxiden in Wasser', 'Durch Erhitzen von Metallen', 'Durch Abkühlen von Gasen', 'Durch Mischen von Edelgasen'], correct: 0 },
    { q: 'Welche typischen Merkmale kennzeichnen chemisch Laugen?', a: ['Enthalten OH⁻-Ionen, seifig, pH > 7', 'Enthalten H⁺-Ionen, sauer, pH < 7', 'Sind neutral, pH = 7', 'Sind gasförmig und geruchlos'], correct: 0 },
    // pH-Wert (Fragen 46-58)
    { q: 'Worüber gibt der pH-Wert Auskunft?', a: ['Über den Säure- oder Basengehalt einer Lösung', 'Über die Temperatur des Wassers', 'Über den Salzgehalt', 'Über die Wasserhärte'], correct: 0 },
    { q: 'Wie ist die pH-Wert-Skala aufgebaut?', a: ['Von 0 (stark sauer) über 7 (neutral) bis 14 (stark basisch)', 'Von 0 bis 7', 'Von 1 bis 10', 'Von -7 bis +7'], correct: 0 },
    { q: 'Wann ist eine Lösung pH-neutral?', a: ['Bei einem pH-Wert von 7', 'Bei einem pH-Wert von 0', 'Bei einem pH-Wert von 14', 'Bei einem pH-Wert von 5,5'], correct: 0 },
    { q: 'Was versteht man unter pH-hautneutral?', a: ['pH-Wert von ca. 5,5 (natürlicher Säureschutzmantel der Haut)', 'pH-Wert von 7,0', 'pH-Wert von 9,0', 'pH-Wert von 3,0'], correct: 0 },
    { q: 'Warum ist der pH-Wert des Beckenwassers von Bedeutung?', a: ['Er beeinflusst die Desinfektionswirkung des Chlors und die Hautverträglichkeit', 'Er bestimmt nur die Wasserfarbe', 'Er hat keinen Einfluss auf die Wasserqualität', 'Er beeinflusst nur die Wassertemperatur'], correct: 0 },
    { q: 'Welche Folgen können Abweichungen des pH-Wertes im Beckenwasser haben?', a: ['Verminderte Chlorwirkung, Haut-/Augenreizungen, Korrosion', 'Keine Auswirkungen', 'Nur optische Veränderungen', 'Nur Geruchsbelästigung'], correct: 0 },
    { q: 'Warum soll das Beckenwasser einen pH-Wert von 7,2 haben?', a: ['Optimale Chlorwirkung und gute Hautverträglichkeit', 'Weil das Wasser dann blau aussieht', 'Weil es gesetzlich vorgeschrieben ist unabhängig vom Grund', 'Damit das Wasser besser schmeckt'], correct: 0 },
    { q: 'Was bedeutet ein pH-Wert von 7,6 für das Beckenwasser?', a: ['Leicht basisch – Chlorwirkung nimmt ab, pH-Korrektur nötig', 'Optimal, keine Maßnahme nötig', 'Zu sauer, Lauge hinzufügen', 'Stark sauer, sofort Badebetrieb einstellen'], correct: 0 },
    { q: 'Eine Lösung hat einen pH-Wert von 4. Was bedeutet das?', a: ['Die Lösung ist sauer', 'Die Lösung ist neutral', 'Die Lösung ist basisch', 'Die Lösung ist destilliert'], correct: 0 },
    { q: 'Eine Lösung hat einen pH-Wert von 12. Was bedeutet das?', a: ['Die Lösung ist stark basisch (alkalisch)', 'Die Lösung ist sauer', 'Die Lösung ist neutral', 'Die Lösung enthält kein Wasser'], correct: 0 },
    { q: 'Welche Reaktion entsteht beim Mischen einer Base mit einer Säure?', a: ['Neutralisation: Es entstehen Salz und Wasser', 'Explosion', 'Es passiert nichts', 'Es entsteht ein Gas'], correct: 0 },
    { q: 'Wie reagieren Säuren mit Metallen?', a: ['Es entsteht ein Salz und Wasserstoff wird freigesetzt', 'Es passiert nichts', 'Das Metall schmilzt', 'Es entsteht Sauerstoff'], correct: 0 },
    { q: 'Wie nennt man die Salze der Kohlensäure (H₂CO₃)?', a: ['Karbonate', 'Chloride', 'Sulfate', 'Nitrate'], correct: 0 },
    { q: 'Wie nennt man die Salze der Phosphorsäure (H₃PO₄)?', a: ['Phosphate', 'Chloride', 'Sulfate', 'Karbonate'], correct: 0 },
    { q: 'Wie nennt man die Salze der Salzsäure?', a: ['Chloride', 'Sulfate', 'Nitrate', 'Phosphate'], correct: 0 },
    { q: 'Wie nennt man die Salze der Schwefelsäure?', a: ['Sulfate', 'Chloride', 'Nitrate', 'Karbonate'], correct: 0 },
    { q: 'Wie nennt man die Salze der Salpetersäure?', a: ['Nitrate', 'Chloride', 'Sulfate', 'Phosphate'], correct: 0 },
    { q: 'Was versteht man unter Neutralisation?', a: ['Reaktion von Säure und Base zu Salz und Wasser', 'Verdampfung von Wasser', 'Auflösung eines Salzes', 'Gefrieren einer Lösung'], correct: 0 },
    // Wasser & Wasserqualität (Fragen 60-72)
    { q: 'Woraus besteht Wasser chemisch gesehen?', a: ['Aus zwei Wasserstoffatomen und einem Sauerstoffatom (H₂O)', 'Aus einem Wasserstoffatom und zwei Sauerstoffatomen', 'Nur aus Sauerstoff', 'Aus Stickstoff und Wasserstoff'], correct: 0 },
    { q: 'Wodurch entsteht die Anreicherung von Wässern mit Mineralien?', a: ['Durch Kontakt mit Gesteinsschichten im Boden', 'Durch Zugabe von Chemikalien', 'Durch Sonneneinstrahlung', 'Durch Luftkontakt'], correct: 0 },
    { q: 'Aus welchen Quellen lässt sich Trinkwasser gewinnen?', a: ['Grundwasser, Oberflächenwasser, Quellwasser', 'Nur aus Meerwasser', 'Nur aus Regenwasser', 'Nur aus Flusswasser'], correct: 0 },
    { q: 'Was versteht man unter Grundwasser?', a: ['Unterirdisches Wasser, das durch Versickerung entsteht und in Bodenschichten gespeichert wird', 'Wasser in Flüssen', 'Regenwasser auf der Oberfläche', 'Leitungswasser'], correct: 0 },
    { q: 'Was versteht man unter Oberflächenwasser?', a: ['Wasser aus Seen, Flüssen und Talsperren', 'Wasser aus tiefen Brunnen', 'Destilliertes Wasser', 'Grundwasser'], correct: 0 },
    { q: 'Welche Eigenschaften werden für Trinkwasser nach DIN 2000 gefordert?', a: ['Klar, kühl, keimarm, geschmacklich einwandfrei, geruchlos', 'Warm und salzig', 'Trüb und mineralreich', 'Sauer und gechlort'], correct: 0 },
    { q: 'Wie muss Beckenwasser nach dem Bundesseuchengesetz beschaffen sein?', a: ['So beschaffen, dass eine Schädigung der Gesundheit nicht zu befürchten ist', 'Trinkwasserqualität ist nicht nötig', 'Beliebig, da es nicht getrunken wird', 'Nur optisch klar'], correct: 0 },
    { q: 'Welche Keime dürfen nicht im Beckenwasser nachweisbar sein?', a: ['Pseudomonas aeruginosa, E. coli, Legionellen', 'Nur E. coli', 'Keine Einschränkungen', 'Nur Legionellen'], correct: 0 },
    { q: 'Warum muss das Beckenwasser Desinfektionskraft haben?', a: ['Um eingetragene Keime durch Badegäste kontinuierlich abzutöten', 'Um das Wasser blau zu färben', 'Um die Temperatur zu halten', 'Um den pH-Wert zu senken'], correct: 0 },
    { q: 'Was versteht man unter der Anomalie des Wassers?', a: ['Wasser hat bei 4°C seine größte Dichte und dehnt sich beim Gefrieren aus', 'Wasser kocht bei 90°C', 'Wasser gefriert bei -10°C', 'Wasser ist bei 0°C am dichtesten'], correct: 0 },
    { q: 'Wie wirkt sich die Anomalie des Wassers im Winter im Freibad aus?', a: ['Eis bildet sich an der Oberfläche, 4°C warmes Wasser sinkt auf den Grund', 'Das Wasser gefriert von unten nach oben', 'Das Becken platzt sofort', 'Es gibt keine Auswirkungen'], correct: 0 },
    { q: 'Wann hat Wasser seine größte Dichte?', a: ['Bei 4°C', 'Bei 0°C', 'Bei 100°C', 'Bei 20°C'], correct: 0 },
    { q: 'Was versteht man unter Füllwasser?', a: ['Wasser zum erstmaligen Befüllen oder Nachfüllen des Beckens', 'Nur Regenwasser', 'Abwasser', 'Gebrauchtes Beckenwasser'], correct: 0 },
    { q: 'Was ist Rohwasser?', a: ['Unbehandeltes Wasser vor der Aufbereitung', 'Fertig aufbereitetes Wasser', 'Destilliertes Wasser', 'Abwasser'], correct: 0 },
    { q: 'Was ist Reinwasser?', a: ['Aufbereitetes Wasser, das dem Becken zugeführt wird', 'Rohwasser aus dem Brunnen', 'Schmutzwasser', 'Regenwasser'], correct: 0 },
    { q: 'Was ist Filtrat?', a: ['Das Wasser, das den Filter durchlaufen hat', 'Schmutz im Filter', 'Filtermaterial', 'Rückspülwasser'], correct: 0 },
    // Schwallwasser & Messparameter (Fragen 73-81)
    { q: 'Was ist Verdrängungswasser?', a: ['Wasser, das durch den Körper des Badenden aus dem Becken verdrängt wird', 'Wasser aus der Filteranlage', 'Wasser in der Überlaufrinne', 'Regenwasser im Freibad'], correct: 0 },
    { q: 'Was ist Schwallwasser?', a: ['Durch Badende und Wellenbewegung über die Rinne abfließendes Wasser', 'Frisch zugeführtes Wasser', 'Regenwasser', 'Filtrat'], correct: 0 },
    { q: 'Warum wird Frischwasser dem Schwallwasserbehälter zugegeben?', a: ['Um Wasserverluste auszugleichen und die Wasserqualität zu verbessern', 'Um den Behälter zu reinigen', 'Um die Temperatur zu senken', 'Aus optischen Gründen'], correct: 0 },
    { q: 'Was sind Messparameter/Hygienehilfsparameter?', a: ['Messwerte zur Beurteilung der Wasserqualität (pH, Chlor, Redox)', 'Nur Temperaturmessungen', 'Messungen der Wassermenge', 'Stromverbrauchsdaten'], correct: 0 },
    { q: 'Welche drei Kategorien von Messparametern gelten für Beckenwasser?', a: ['Mikrobiologische, chemische und physikalische Parameter', 'Nur chemische Parameter', 'Temperatur, Farbe, Geruch', 'Druck, Volumen, Masse'], correct: 0 },
    { q: 'Was sind mikrobiologische Messparameter des Beckenwassers?', a: ['KBE, Pseudomonas aeruginosa, E. coli, Legionellen', 'pH-Wert und Chlorgehalt', 'Temperatur und Trübung', 'Redoxpotential und Leitfähigkeit'], correct: 0 },
    { q: 'Was sind chemische Messparameter des Beckenwassers?', a: ['Freies Chlor, gebundenes Chlor, pH-Wert, Redoxpotential', 'Nur die Wassertemperatur', 'Nur die Trübung', 'Nur der Salzgehalt'], correct: 0 },
    { q: 'Was sind physikalische Messparameter des Beckenwassers?', a: ['Temperatur, Trübung, Färbung', 'pH-Wert und Chlor', 'Keimzahl und E. coli', 'Redoxpotential und Leitfähigkeit'], correct: 0 },
    { q: 'Wie wirkt sich Regen auf das Wasser im Freibad aus?', a: ['Verdünnung, pH-Änderung, erhöhter Schmutzeintrag', 'Gar nicht', 'Nur positiv durch Frischwasserzufuhr', 'Es wird nur wärmer'], correct: 0 },
    { q: 'Wie oft müssen Chlor und pH-Wert im Schwimmbad gemessen werden?', a: ['Mindestens stündlich während des Badebetriebs', 'Einmal pro Woche', 'Einmal pro Tag', 'Nur bei Beschwerden'], correct: 0 },
    // Küvette, Indikator, Redox (Fragen 82-102)
    { q: 'Was ist eine Küvette?', a: ['Ein kleines Glasgefäß für photometrische Messungen', 'Ein Filtergehäuse', 'Ein Pumpengehäuse', 'Ein Chlorbehälter'], correct: 0 },
    { q: 'Was versteht man unter einem Indikator?', a: ['Ein Stoff, der durch Farbänderung den pH-Wert oder andere Werte anzeigt', 'Ein Messgerät für Temperatur', 'Ein Wasserfilter', 'Eine Pumpe'], correct: 0 },
    { q: 'Wofür steht der Begriff "Redox"?', a: ['Reduktion und Oxidation', 'Reinigung und Desinfektion', 'Regelung und Dosierung', 'Rückspülung und Oxidation'], correct: 0 },
    { q: 'Was versteht man unter dem Redoxpotential des Beckenwassers?', a: ['Das elektrische Potential, das die Oxidations-/Reduktionskraft des Wassers anzeigt', 'Die Temperatur des Wassers', 'Den pH-Wert', 'Die Wasserhärte'], correct: 0 },
    { q: 'Was sind die reduzierenden Stoffe im Beckenwasser?', a: ['Verunreinigungen wie Harnstoff, Schweiß, Hautschuppen', 'Chlor und Ozon', 'Nur Metalle', 'Nur Gase'], correct: 0 },
    { q: 'Was sind die oxidierenden Stoffe im Beckenwasser?', a: ['Desinfektionsmittel wie Chlor oder Ozon', 'Nur Harnstoff', 'Nur Hautschuppen', 'Nur Schweiß'], correct: 0 },
    { q: 'Wie wird das Redoxpotential gemessen?', a: ['Mit einer Redoxmesszelle (Platin-Elektrode gegen Bezugselektrode)', 'Mit einem Thermometer', 'Mit einer Küvette', 'Mit einer Waage'], correct: 0 },
    { q: 'Was besagt die Redox-Spannungsreihe?', a: ['Sie ordnet Metalle nach ihrem Bestreben, Elektronen abzugeben', 'Sie zeigt Temperaturen von Metallen', 'Sie misst Wasserdrücke', 'Sie zeigt Stromstärken'], correct: 0 },
    { q: 'Was ist Kalomel?', a: ['Quecksilber(I)-chlorid, verwendet als Bezugselektrode bei Redoxmessungen', 'Ein Filtermedium', 'Ein Desinfektionsmittel', 'Eine Chlorverbindung'], correct: 0 },
    { q: 'Worüber gibt das Redoxpotential Auskunft?', a: ['Über das Verhältnis von oxidierenden zu reduzierenden Stoffen im Wasser', 'Über die Wassertemperatur', 'Über den Wasserstand', 'Über den Salzgehalt'], correct: 0 },
    { q: 'Was sind Karbonathärtebildner des Wassers?', a: ['Calcium- und Magnesiumhydrogencarbonat', 'Natriumchlorid', 'Kaliumnitrat', 'Eisensulfat'], correct: 0 },
    { q: 'Wie setzt sich die Wasserhärte zusammen?', a: ['Aus Karbonathärte (temporär) und Nichtkarbonathärte (permanent)', 'Nur aus dem Kalkgehalt', 'Nur aus dem Salzgehalt', 'Nur aus dem pH-Wert'], correct: 0 },
    { q: 'Wodurch entsteht die Karbonathärte?', a: ['Durch gelöste Calcium- und Magnesiumhydrogencarbonate', 'Durch Chlorzugabe', 'Durch hohe Temperaturen', 'Durch Filterung'], correct: 0 },
    { q: 'Wie hängen Karbonathärte und Wassertemperatur zusammen?', a: ['Bei steigender Temperatur fällt Kalk aus (Karbonathärte sinkt)', 'Temperatur hat keinen Einfluss', 'Bei steigender Temperatur steigt die Härte', 'Nur bei Frost ändert sich die Härte'], correct: 0 },
    { q: 'Wann und wie kommt es zur Kalkausfällung?', a: ['Bei Erwärmung oder CO₂-Verlust fällt Calciumcarbonat aus', 'Nur bei Kälte', 'Nur bei Chlorzugabe', 'Niemals im Schwimmbad'], correct: 0 },
    { q: 'Wie wirkt sich Kalkausfällung im Duschwassererwärmer aus?', a: ['Kalkablagerungen reduzieren die Heizleistung und können zu Verstopfungen führen', 'Keine Auswirkung', 'Der Erwärmer arbeitet besser', 'Es entsteht mehr Warmwasser'], correct: 0 },
    { q: 'Wie wirkt sich eine höhere Beckenwassertemperatur (32°C) auf die Wasserhärte aus?', a: ['Kalkausfällung steigt, Karbonathärte sinkt', 'Keine Auswirkung', 'Karbonathärte steigt', 'Wasser wird weicher ohne Ausfällung'], correct: 0 },
    { q: 'Was tun Sie bei zu niedrigem Redoxpotential?', a: ['Chlordosierung erhöhen, Umwälzung und Filterung prüfen', 'Nichts, es reguliert sich selbst', 'Wassertemperatur erhöhen', 'Badebetrieb fortsetzen'], correct: 0 },
    { q: 'Warum sind die Redoxmesswerte bei Salzwasser niedriger?', a: ['Weil die Chlorid-Ionen die Messung beeinflussen', 'Weil Salzwasser wärmer ist', 'Weil der pH-Wert höher ist', 'Salzwasser hat keinen Redox-Unterschied'], correct: 0 },
    { q: 'Welche Redoxanzeige erhalten Sie, wenn reduzierende Stoffe im Beckenwasser überwiegen?', a: ['Niedrige Redoxspannung (unter 750 mV)', 'Hohe Redoxspannung (über 800 mV)', 'Genau 750 mV', 'Der Wert ist nicht messbar'], correct: 0 },
    { q: 'Was kann die Ursache für einen zu niedrigen Redoxwert sein?', a: ['Zu wenig Desinfektionsmittel, hohe Belastung durch Badegäste', 'Zu viel Chlor', 'Zu niedrige Besucherzahl', 'Zu hohe Wassertemperatur'], correct: 0 },
    { q: 'Was sagt ein Redoxwert von 750 mV bei Süßwasser?', a: ['Ausreichende Desinfektionskraft des Beckenwassers', 'Zu niedriger Wert, sofort handeln', 'Gefährlich hoher Wert', 'Kein aussagekräftiger Wert'], correct: 0 },
    // Aggregatzustände & Messtechnik (Fragen 103-113)
    { q: 'Welche Aggregatzustände hat Wasser?', a: ['Fest (Eis), flüssig (Wasser), gasförmig (Wasserdampf)', 'Nur flüssig und fest', 'Nur flüssig und gasförmig', 'Nur fest und gasförmig'], correct: 0 },
    { q: 'In welchen Aggregatzuständen kommt Wasser im Schwimmbadbereich vor?', a: ['Alle drei: Eis (Winter Freibad), Wasser (Becken), Dampf (Hallenbad)', 'Nur als Flüssigkeit', 'Nur als Dampf', 'Nur als Eis'], correct: 0 },
    { q: 'Was passiert im Hallenbad bei extrem niedrigen Außentemperaturen?', a: ['Kondenswasser an Fenstern und Wänden (Taupunktunterschreitung)', 'Nichts, die Halle ist isoliert', 'Das Beckenwasser gefriert', 'Die Luftfeuchtigkeit sinkt'], correct: 0 },
    { q: 'Wer darf die mikrobiologische Wasserqualität untersuchen?', a: ['Akkreditierte Labore und das Gesundheitsamt', 'Jeder Bademeister', 'Nur der Betreiber', 'Die Feuerwehr'], correct: 0 },
    { q: 'Welche Messmethoden gibt es für die chemische Wasserqualität?', a: ['Photometrische und kolorimetrische Verfahren, Teststreifen', 'Nur Geschmackstests', 'Nur optische Prüfung', 'Nur Temperaturmessung'], correct: 0 },
    { q: 'Wie können Chlorwerte des Beckenwassers ermittelt werden?', a: ['DPD-Methode (photometrisch/kolorimetrisch) oder Messautomatik', 'Nur durch Riechen', 'Nur durch Schmecken', 'Nur durch Betrachten'], correct: 0 },
    { q: 'Mit welchen Geräten wird der pH-Wert bestimmt?', a: ['Photometer, pH-Meter (Glaselektrode), Teststreifen, Indikatorlösung', 'Nur mit Thermometer', 'Nur mit der Nase', 'Nur mit Waage'], correct: 0 },
    { q: 'Was versteht man unter dem fotometrischen Messverfahren?', a: ['Bestimmung der Konzentration durch Lichtabsorption einer gefärbten Lösung', 'Messung mit Fotografien', 'Messung mit Sonnenenergie', 'Optische Schätzung der Wasserfarbe'], correct: 0 },
    { q: 'Was versteht man unter dem Siedepunkt des Wassers?', a: ['Temperatur bei der Wasser verdampft (100°C bei Normaldruck)', 'Temperatur bei der Wasser gefriert', 'Der Punkt an dem Salz sich auflöst', 'Die maximale Wassertemperatur im Becken'], correct: 0 },
    { q: 'Was versteht man unter dem Gefrierpunkt des Wassers?', a: ['Temperatur bei der Wasser zu Eis wird (0°C bei Normaldruck)', 'Temperatur bei der Wasser verdampft', 'Temperatur des Beckenwassers im Winter', 'Die minimale Duschtemperatur'], correct: 0 },
    { q: 'Was versteht man unter dem Kondensationspunkt?', a: ['Temperatur bei der Dampf wieder zu Flüssigkeit wird', 'Temperatur bei der Wasser gefriert', 'Der höchste Punkt einer Wasserleitung', 'Die Temperatur in der Sauna'], correct: 0 },
    { q: 'Wie unterscheidet man Schwimmbäder nach Anlagen und Einrichtungen?', a: ['Hallenbäder, Freibäder, Kombibäder, Erlebnisbäder, Naturbäder', 'Nur nach Größe', 'Nur nach Wassertemperatur', 'Nur nach Eintrittspreisen'], correct: 0 },
    { q: 'Was versteht man unter einem Naturbad?', a: ['Ein Bad mit biologischer Wasseraufbereitung ohne Chemikalien', 'Ein Hallenbad mit Pflanzen', 'Ein Freibad mit Chlorung', 'Ein Bad nur für Naturfreunde'], correct: 0 },
    // Bäderbau & Einrichtungen (Fragen 114-141)
    { q: 'Warum können Freibäder höhere Besucherzahlen aufnehmen als Hallenbäder?', a: ['Größere Liegewiesen und offene Wasserflächen bieten mehr Platz', 'Weil sie wärmer sind', 'Weil sie billiger sind', 'Weil sie mehr Personal haben'], correct: 0 },
    { q: 'Welche baulichen Besonderheiten haben Erlebnisbäder?', a: ['Rutschen, Wellenbecken, Strömungskanal, Whirlpools, Saunalandschaft', 'Nur ein Schwimmbecken', 'Keine besonderen Einrichtungen', 'Nur Duschen und Umkleiden'], correct: 0 },
    { q: 'Über welche Bereiche muss ein Hallenbad mindestens verfügen?', a: ['Eingang, Umkleiden, Duschen, Schwimmhalle, Technikräume, Sanitäranlagen', 'Nur ein Becken', 'Nur Umkleiden und Becken', 'Nur einen Eingangsbereich'], correct: 0 },
    { q: 'Was versteht man unter dem Nassbereich eines Schwimmbades?', a: ['Bereiche mit Wasser: Becken, Duschen, Umgänge', 'Nur die Umkleiden', 'Der Parkplatz', 'Das Foyer'], correct: 0 },
    { q: 'Was versteht man unter dem Trockenbereich eines Schwimmbades?', a: ['Bereiche ohne Wasserkontakt: Foyer, Gastronomie, Zuschauertribüne', 'Die Schwimmhalle', 'Die Duschen', 'Der Beckenumgang'], correct: 0 },
    { q: 'Was versteht man unter dem Ergänzungsbereich eines Bades?', a: ['Zusatzeinrichtungen wie Sauna, Fitness, Gastronomie, Wellness', 'Das Hauptbecken', 'Die Umkleidekabinen', 'Die Technikräume'], correct: 0 },
    { q: 'Welche Beckenanlagen kann ein Hallenbad haben?', a: ['Schwimmer-, Nichtschwimmer-, Springer-, Plansch-, Lehrschwimmbecken', 'Nur ein Schwimmerbecken', 'Nur ein Nichtschwimmerbecken', 'Nur ein Planschbecken'], correct: 0 },
    { q: 'Was sind Beispiele für Wasserattraktionen?', a: ['Wellenanlage, Strömungskanal, Wasserrutschen, Wasserpilz, Sprudel', 'Nur eine Wellenanlage', 'Nur Duschen', 'Nur Sprungbretter'], correct: 0 },
    { q: 'Was sind Beispiele für Attraktionen im Trockenbereich eines Spaßbades?', a: ['Saunalandschaft, Fitnessbereich, Kletterwand, Minigolf', 'Nur Liegen', 'Nur Automaten', 'Nur Umkleidekabinen'], correct: 0 },
    { q: 'Welche Räume gehören zum Sanitärbereich eines Schwimmbades?', a: ['Toiletten, Duschen, Waschräume, Umkleiden, Fönplätze', 'Nur Toiletten', 'Nur Duschen', 'Nur Umkleiden'], correct: 0 },
    { q: 'Welche Metalle finden im Bäderbereich Verwendung?', a: ['Edelstahl (V4A), Aluminium, Kupfer, Titan', 'Nur Eisen', 'Nur Gold', 'Nur Blei'], correct: 0 },
    { q: 'Unter welchen Bedingungen ist Holz im Bad als Baustoff geeignet?', a: ['Wenn es gegen Feuchtigkeit behandelt, pilzresistent und rutschfest ist', 'Immer und ohne Behandlung', 'Niemals, Holz ist verboten', 'Nur im Außenbereich'], correct: 0 },
    { q: 'Welche Anforderungen werden an Baustoffe im Bäderbereich gestellt?', a: ['Korrosionsbeständig, rutschfest, hygienisch, chlorbeständig', 'Nur billig', 'Nur schön', 'Keine besonderen Anforderungen'], correct: 0 },
    { q: 'Warum ist Polypropylen als Rohrmaterial im Bäderbereich geeignet?', a: ['Korrosionsbeständig, chemikalienresistent, leicht, kostengünstig', 'Weil es schön aussieht', 'Weil es sehr schwer ist', 'Weil es elektrisch leitend ist'], correct: 0 },
    { q: 'Welche Materialien werden für Leitern im Beckenwasserbereich benutzt?', a: ['Edelstahl (V4A) oder GFK', 'Holz', 'Normaler Stahl', 'Aluminium unlackiert'], correct: 0 },
    { q: 'Warum sind Schutzanzüge im Bäderbereich in der Regel aus Gummi?', a: ['Chemikalienbeständig und wasserdicht', 'Weil sie billig sind', 'Aus optischen Gründen', 'Weil sie leicht sind'], correct: 0 },
    { q: 'Welche Arbeiten können mit einem Hochdruckreiniger im Bad ausgeführt werden?', a: ['Beckenreinigung, Fliesenreinigung, Rinnenreinigung, Fugensäuberung', 'Nur Fensterputzen', 'Nur Rasen mähen', 'Nur Wäsche waschen'], correct: 0 },
    { q: 'Welche Reinigungsgeräte werden im Nassbereich eines Schwimmbads eingesetzt?', a: ['Scheuersaugmaschine, Hochdruckreiniger, Nasssauger, Bürstenmaschine', 'Nur Besen', 'Nur Staubsauger', 'Nur Lappen'], correct: 0 },
    { q: 'Worauf ist beim Einsatz elektrischer Reinigungsmaschinen zu achten?', a: ['FI-Schutzschalter, Schutzisolierung, kein beschädigtes Kabel, Spritzschutz', 'Auf nichts Besonderes', 'Nur auf die Farbe', 'Nur auf die Größe'], correct: 0 },
    { q: 'Welche Anforderungen werden an keramische Bodenbeläge im Nassbereich gestellt?', a: ['Rutschfestigkeit (Bewertungsgruppe B/C), Frostbeständigkeit, Säurebeständigkeit', 'Nur Farbe', 'Nur Preis', 'Keine besonderen Anforderungen'], correct: 0 },
    { q: 'Welche Reinigungsarten werden unterschieden?', a: ['Unterhaltsreinigung, Grundreinigung, Sonderreinigung', 'Nur nasse Reinigung', 'Nur trockene Reinigung', 'Nur chemische Reinigung'], correct: 0 },
    { q: 'Welche Arbeitsregeln gelten für die Reinigung?', a: ['Von oben nach unten, von hinten nach vorne, von sauber nach schmutzig', 'Von unten nach oben', 'Beliebige Reihenfolge', 'Nur von links nach rechts'], correct: 0 },
    { q: 'Wo lassen sich Bürstenmaschinen einsetzen?', a: ['Auf großen Flächen wie Beckenumgänge, Foyer, Umkleidebereiche', 'Nur in der Küche', 'Nur in der Sauna', 'Nur im Büro'], correct: 0 },
    { q: 'Wie lang muss die Wurfleine an einem Rettungsball sein?', a: ['Mindestens 15-20 Meter', 'Nur 2 Meter', '100 Meter', '1 Meter'], correct: 0 },
    { q: 'Wie müssen Erste-Hilfe-Räume in Bädern ausgestattet sein?', a: ['Liege, Verbandmaterial, Beatmungsgerät, Defibrillator, Sauerstoff', 'Nur ein Stuhl', 'Nur Pflaster', 'Keine besondere Ausstattung'], correct: 0 },
    { q: 'Wie groß müssen Sanitätsräume in Bädern mindestens sein?', a: ['Mindestens 12 m²', 'Mindestens 2 m²', 'Mindestens 50 m²', 'Keine Mindestgröße'], correct: 0 },
    { q: 'Welche Anforderungen gelten an Sanitätsräume in Bädern?', a: ['Gut erreichbar, hell, beheizt, mit Wasseranschluss, abschließbar', 'Nur abschließbar', 'Nur beheizt', 'Keine besonderen Anforderungen'], correct: 0 },
    { q: 'Welche Wiederbelebungsgeräte dürfen vom Fachpersonal eingesetzt werden?', a: ['Beatmungsbeutel, Absauggerät, AED (Defibrillator), Sauerstoffgerät', 'Nur Pflaster', 'Keine Geräte', 'Nur Verbände'], correct: 0 },
    { q: 'Welche Rettungsgeräte können in Naturbädern eingesetzt werden?', a: ['Rettungsring, Rettungsboje, Wurfleine, Rettungsbrett, Rettungsboot', 'Nur ein Seil', 'Keine speziellen Geräte', 'Nur Schwimmflügel'], correct: 0 },
    // Gefahrstoffe (Fragen 142-154)
    { q: 'Was sind Gefahrstoffe im Bäderbereich?', a: ['Chlor, Salzsäure, Natronlauge, Flockungsmittel, Reinigungschemikalien', 'Nur Wasser', 'Nur Handtücher', 'Es gibt keine Gefahrstoffe'], correct: 0 },
    { q: 'Wo befinden sich Gefahrenbereiche im technischen Bereich eines Schwimmbades?', a: ['Chlorgasraum, Chemikalienlager, Filteranlage, Heizungsraum', 'Nur am Beckenrand', 'Nur in der Umkleide', 'Es gibt keine Gefahrenbereiche'], correct: 0 },
    { q: 'Wie müssen Gefahrstoffe gekennzeichnet sein?', a: ['Mit GHS-Piktogrammen, Signalwort, H- und P-Sätzen', 'Gar nicht', 'Nur mit der Farbe', 'Nur mit dem Namen'], correct: 0 },
    { q: 'Welche Eigenschaften können gefährliche Arbeitsstoffe haben?', a: ['Ätzend, giftig, entzündlich, oxidierend, reizend', 'Nur flüssig', 'Nur fest', 'Keine besonderen Eigenschaften'], correct: 0 },
    { q: 'Wie kann unser Körper gesundheitsgefährliche Stoffe aufnehmen?', a: ['Über Haut, Atemwege und Verdauungstrakt', 'Nur über die Haut', 'Nur über die Atemwege', 'Gar nicht, der Körper schützt sich selbst'], correct: 0 },
    { q: 'Was ist der Unterschied zwischen Aerosolen und Gasen?', a: ['Aerosole sind fein verteilte Flüssigkeits-/Feststoffteilchen in der Luft, Gase sind einzelne Moleküle', 'Kein Unterschied', 'Gase sind schwerer als Aerosole', 'Aerosole sind immer giftig, Gase nicht'], correct: 0 },
    { q: 'Welchem Zweck dienen Sicherheitsdatenblätter?', a: ['Information über Gefahren, Schutzmaßnahmen und Erste-Hilfe-Maßnahmen', 'Nur zur Dekoration', 'Nur für die Buchhaltung', 'Nur für den Hersteller'], correct: 0 },
    { q: 'Welche Angaben müssen Sicherheitsdatenblätter enthalten?', a: ['Gefahrenhinweise, Schutzmaßnahmen, Erste Hilfe, Lagerung, Entsorgung', 'Nur den Preis', 'Nur den Herstellernamen', 'Nur die Farbe'], correct: 0 },
    { q: 'Welche Angaben sollten Produktinformationen auf Behältern mindestens enthalten?', a: ['Stoffbezeichnung, Gefahrensymbole, Hinweise für den sicheren Umgang', 'Nur den Preis', 'Nur das Gewicht', 'Keine Angaben nötig'], correct: 0 },
    { q: 'Wozu dient die Kennzeichnungspflicht eines Herstellers?', a: ['Zum Schutz der Anwender vor Gefahren durch korrekte Information', 'Nur zur Werbung', 'Nur zur Preisgestaltung', 'Hat keinen bestimmten Zweck'], correct: 0 },
    { q: 'Warum müssen Gefahrstoffe nach Stoffklassen getrennt gelagert werden?', a: ['Um gefährliche Reaktionen bei unbeabsichtigtem Kontakt zu vermeiden', 'Aus Platzgründen', 'Zur besseren Optik', 'Das ist nicht vorgeschrieben'], correct: 0 },
    { q: 'Was bedeutet ein quadratisches orangefarbenes Schild mit schwarzem X?', a: ['Gesundheitsschädlich (Xn) oder reizend (Xi)', 'Explosiv', 'Radioaktiv', 'Umweltgefährlich'], correct: 0 },
    { q: 'Wie sind Chemikalien und brennbare Stoffe grundsätzlich zu lagern?', a: ['In gekennzeichneten Räumen, getrennt, belüftet, mit Auffangwannen', 'Beliebig zusammen in einem Raum', 'Im Freien ohne Schutz', 'In der Schwimmhalle'], correct: 0 },
    // Sicherheit & Arbeitsschutz (Fragen 155-166)
    { q: 'Welche Bedeutung hat die Sicherheitsfarbe Rot?', a: ['Verbot, Brandschutz, Feuerlöscher', 'Gebotsschilder', 'Warnschilder', 'Rettungsschilder'], correct: 0 },
    { q: 'Welche Bedeutung hat die Sicherheitsfarbe Gelb?', a: ['Warnung vor Gefahren', 'Verbotsschilder', 'Rettungsschilder', 'Gebotsschilder'], correct: 0 },
    { q: 'Welche Bedeutung hat die Sicherheitsfarbe Blau?', a: ['Gebotszeichen (z.B. Schutzausrüstung tragen)', 'Verbotsschilder', 'Warnschilder', 'Rettungsschilder'], correct: 0 },
    { q: 'Wie können Gefahrstoffe fachgerecht entsorgt werden?', a: ['Über zertifizierte Entsorgungsunternehmen, nie ins Abwasser', 'Einfach in den Hausmüll', 'Ins Beckenwasser schütten', 'In den nächsten Fluss leiten'], correct: 0 },
    { q: 'Wie sind im Bad Säuren und Laugen zu lagern?', a: ['Getrennt voneinander, in gekennzeichneten Auffangwannen', 'Zusammen in einem Regal', 'In der Schwimmhalle', 'Im Umkleidebereich'], correct: 0 },
    { q: 'Wie sind im Bad Säuren und Laugen zu verdünnen?', a: ['Immer Säure/Lauge ins Wasser geben, nie umgekehrt', 'Wasser in die Säure geben', 'Beides zusammen in einen Eimer', 'Egal in welcher Reihenfolge'], correct: 0 },
    { q: 'Welche Arten von Sicherheitskennzeichen gibt es?', a: ['Verbots-, Warn-, Gebots-, Rettungs- und Brandschutzzeichen', 'Nur Verbotszeichen', 'Nur Warnzeichen', 'Nur Rettungszeichen'], correct: 0 },
    { q: 'Bei welchen Arbeiten muss Gehörschutz getragen werden?', a: ['Bei Arbeiten über 85 dB (z.B. Hochdruckreiniger, Maschinen)', 'Nur beim Schwimmen', 'Nie im Schwimmbad', 'Nur beim Telefonieren'], correct: 0 },
    { q: 'Was bedeutet die Angabe dB?', a: ['Dezibel – Maßeinheit für Schallpegel/Lautstärke', 'Destilliertes Beckenwasser', 'Deutsche Betriebsordnung', 'Desinfektion Becken'], correct: 0 },
    { q: 'Wie sind elektrische Anlagen in Bädern abzusichern?', a: ['Durch FI-Schutzschalter, Schutzisolierung und regelmäßige Prüfung', 'Gar nicht speziell', 'Nur mit einer normalen Sicherung', 'Nur im Trockenbereich'], correct: 0 },
    { q: 'Worauf ist beim Verwenden von Atemschutzmasken zu achten?', a: ['Richtiger Filtertyp, Dichtsitz, regelmäßiger Filterwechsel', 'Auf nichts Besonderes', 'Nur auf die Farbe', 'Nur auf die Größe'], correct: 0 },
    { q: 'Was ist der AGW-Wert (früher MAK-Wert)?', a: ['Arbeitsplatzgrenzwert – maximale Konzentration eines Stoffes am Arbeitsplatz', 'Allgemeiner Gewichtswert', 'Automatischer Grenzwertsensor', 'Abwassergrenzwert'], correct: 0 },
    { q: 'Wo ist der AGW-Wert im Bäderbereich besonders von Bedeutung?', a: ['Im Chlorgasraum und beim Umgang mit Chemikalien', 'Nur im Büro', 'Nur in der Kasse', 'Nur im Ruheraum'], correct: 0 },
    { q: 'Was sind S+R-Sätze in Sicherheitsdatenblättern?', a: ['Sicherheitsratschläge (S) und Risikohinweise (R) – heute H- und P-Sätze', 'Sport- und Rettungsregeln', 'Schwimm- und Rutschhinweise', 'Sonder- und Regelleistungen'], correct: 0 },
    // Reinigung (Fragen 167-201)
    { q: 'Welche Reinigerarten werden in Bädern unterschieden?', a: ['Saure, basische (alkalische), neutrale Reiniger und Desinfektionsmittel', 'Nur Seife', 'Nur Wasser', 'Nur Chlorreiniger'], correct: 0 },
    { q: 'Was versteht man unter einer Grundreinigung?', a: ['Intensive, turnusmäßige Komplettreinigung aller Bereiche', 'Tägliches kurzes Wischen', 'Nur Fensterputzen', 'Nur Beckenreinigung'], correct: 0 },
    { q: 'Wie können gefüllte Becken gereinigt werden?', a: ['Mit Unterwasserreiniger/Poolsauger und Beckenbürsten', 'Nur durch Ablassen des Wassers', 'Gar nicht, nur bei leerem Becken', 'Mit einem Besen'], correct: 0 },
    { q: 'Mit welchen Reinigern sollten Beckenumgänge gereinigt werden?', a: ['Saure oder neutrale Reiniger, je nach Verschmutzungsart', 'Nur mit klarem Wasser', 'Mit Spülmittel', 'Mit Geschirrspülpulver'], correct: 0 },
    { q: 'Wie oft sollten Beckenumgänge gereinigt werden?', a: ['Täglich, bei starker Nutzung mehrmals täglich', 'Einmal pro Woche', 'Einmal pro Monat', 'Nur bei sichtbarem Schmutz'], correct: 0 },
    { q: 'Wie oft sollten Umkleiden gereinigt werden?', a: ['Täglich, bei starkem Besuch mehrmals täglich', 'Einmal pro Woche', 'Einmal pro Monat', 'Nur nach Beschwerden'], correct: 0 },
    { q: 'Warum ist eine tägliche Badreinigung erforderlich?', a: ['Zur Hygiene, Vermeidung von Keimverbreitung und Rutschgefahr', 'Nur wegen der Optik', 'Ist nicht erforderlich', 'Nur vom Gesundheitsamt gefordert'], correct: 0 },
    { q: 'Was ist zu tun, bevor Sie eine Überlaufrinne reinigen?', a: ['Wasserstand absenken, Rinne vom Kreislauf trennen', 'Einfach reinigen ohne Vorbereitung', 'Nur den Filter abstellen', 'Die Gäste informieren'], correct: 0 },
    { q: 'Wonach richtet sich die Auswahl des Reinigers?', a: ['Nach Art der Verschmutzung und dem zu reinigenden Material', 'Nach dem Preis', 'Nach der Farbe', 'Nach der Flaschengröße'], correct: 0 },
    { q: 'Wie sind empfindliche Bauteile zu reinigen?', a: ['Mit neutralen Reinigern und weichen Materialien, keine Scheuermittel', 'Mit aggressiven Säuren', 'Mit Drahtbürsten', 'Mit Hochdruckreiniger'], correct: 0 },
    { q: 'Was sind typische Substanzen saurer Reiniger?', a: ['Salzsäure, Phosphorsäure, Zitronensäure, Essigsäure', 'Natronlauge', 'Ammoniak', 'Seife'], correct: 0 },
    { q: 'Was sind typische Substanzen basischer Reiniger?', a: ['Natronlauge, Kalilauge, Soda, Ammoniak', 'Salzsäure', 'Essigsäure', 'Zitronensäure'], correct: 0 },
    { q: 'Wann werden neutrale Reiniger eingesetzt?', a: ['Bei empfindlichen Oberflächen und bei der täglichen Unterhaltsreinigung', 'Nur bei Grundreinigungen', 'Nur bei starken Verschmutzungen', 'Nie im Bäderbereich'], correct: 0 },
    { q: 'Was ist ein Kombi-Reiniger?', a: ['Ein Reiniger mit gleichzeitiger desinfizierender Wirkung', 'Ein Reiniger für zwei Personen', 'Ein Gemisch aus Säure und Lauge', 'Ein rein mechanischer Reiniger'], correct: 0 },
    { q: 'Wo werden saure Reiniger eingesetzt?', a: ['Gegen Kalk, Urinstein, Rost, mineralische Ablagerungen', 'Gegen Fettschmutz', 'Gegen Schimmel', 'Nur auf Holz'], correct: 0 },
    { q: 'Wo werden basische (alkalische) Reiniger eingesetzt?', a: ['Gegen Fette, Öle, organische Verschmutzungen', 'Gegen Kalkablagerungen', 'Gegen Rost', 'Nur auf Glas'], correct: 0 },
    { q: 'Wo werden neutrale Reiniger eingesetzt?', a: ['Auf empfindlichen Oberflächen, bei der täglichen Unterhaltsreinigung', 'Nur gegen starke Verschmutzungen', 'Nur in der Küche', 'Nur im Außenbereich'], correct: 0 },
    { q: 'Wie wirken saure Reiniger?', a: ['Sie lösen Kalk und mineralische Ablagerungen auf', 'Sie lösen Fette auf', 'Sie desinfizieren', 'Sie neutralisieren Gerüche'], correct: 0 },
    { q: 'Wie wirken basische Reiniger?', a: ['Sie lösen Fette und organische Verschmutzungen', 'Sie lösen Kalk auf', 'Sie desinfizieren nur', 'Sie polieren Oberflächen'], correct: 0 },
    { q: 'Wie wirken neutrale Reiniger?', a: ['Schonende Reinigung durch Tenside ohne aggressive pH-Wirkung', 'Stark ätzend', 'Stark kalkauflösend', 'Stark desinfizierend'], correct: 0 },
    { q: 'Was sind Netzmittel?', a: ['Stoffe die die Oberflächenspannung des Wassers herabsetzen', 'Stoffe zum Festigen von Geweben', 'Stoffe zum Trocknen', 'Stoffe zum Erhitzen'], correct: 0 },
    { q: 'Was sind Emulgatoren?', a: ['Stoffe die nicht mischbare Flüssigkeiten (Fett/Wasser) verbinden', 'Stoffe die Kalk lösen', 'Stoffe die desinfizieren', 'Stoffe die Wasser färben'], correct: 0 },
    { q: 'Wann benutzt man Reiniger mit Lösungsmittel?', a: ['Bei hartnäckigen öl- und fetthaltigen Verschmutzungen', 'Bei Kalkablagerungen', 'Bei leichtem Staub', 'Nie im Bäderbereich'], correct: 0 },
    { q: 'Was sind Tenside (WAS)?', a: ['Waschaktive Substanzen, die die Oberflächenspannung herabsetzen', 'Wasseraktive Salze', 'Wasserabweisende Stoffe', 'Wärmeaktivierende Substanzen'], correct: 0 },
    { q: 'Warum muss das Zusammenkommen von Beckenwasser und Flächenreinigern verhindert werden?', a: ['Es können giftige Gase (z.B. Chlorgas) entstehen', 'Es passiert nichts', 'Es riecht nur unangenehm', 'Das Beckenwasser wird nur trüb'], correct: 0 },
    { q: 'Warum sollen Flächenreiniger nicht antrocknen?', a: ['Rückstände können Oberflächen angreifen und sind schwer zu entfernen', 'Kein besonderer Grund', 'Nur aus optischen Gründen', 'Weil sie dann besser riechen'], correct: 0 },
    { q: 'Warum ist bei Reinigern auf die Einwirkzeit zu achten?', a: ['Für optimale Wirkung; zu kurz = unwirksam, zu lang = Materialschäden', 'Egal wie lange', 'Nur für den Geruch wichtig', 'Hat keinen Einfluss'], correct: 0 },
    { q: 'Was versteht man unter der mechanischen Unterstützung einer Reinigung?', a: ['Einsatz von Bürsten, Schrubber, Maschinen zur physischen Schmutzentfernung', 'Nur chemische Reinigung', 'Nur Hochdruckreiniger', 'Nur Einweichen'], correct: 0 },
    { q: 'Mit welchen Reinigern entfernen Sie den Speckrand eines Beckens?', a: ['Alkalische/basische Reiniger (fettlösend)', 'Saure Reiniger', 'Nur klares Wasser', 'Neutrale Reiniger'], correct: 0 },
    { q: 'Welche Bäderarten gibt es?', a: ['Hallenbad, Freibad, Kombibad, Erlebnisbad, Naturbad, Thermalbad', 'Nur Hallenbäder', 'Nur Freibäder', 'Nur Erlebnisbäder'], correct: 0 },
    { q: 'Was bedeutet "biologisch abbaubar"?', a: ['Der Stoff kann durch Mikroorganismen in der Umwelt zersetzt werden', 'Der Stoff ist giftig', 'Der Stoff ist nicht abbaubar', 'Der Stoff ist radioaktiv'], correct: 0 },
    { q: 'Welche Richtlinien gelten für den Bau und Betrieb von Bädern?', a: ['DIN 19643, KOK-Richtlinien, DGfdB, GUV, Landesbauordnung', 'Keine besonderen Richtlinien', 'Nur interne Regeln', 'Nur EU-Richtlinien'], correct: 0 },
    { q: 'Welche besonderen Anforderungen gelten für ein Lehrschwimmbecken?', a: ['Verstellbarer Hubboden, geringe Tiefe, gute Sicht, warme Wassertemperatur', 'Nur ein normales Becken', 'Mindestens 3m tief', 'Keine besonderen Anforderungen'], correct: 0 },
    { q: 'Wie sollen Beckenboden und Beckenausstiege beschaffen sein?', a: ['Rutschfest, trittsicher, leicht zu reinigen', 'Glatt und poliert', 'Aus Holz', 'Beliebig'], correct: 0 },
    { q: 'Welche Sicherheitsvorschriften gelten für Springerbecken und Sprunganlagen?', a: ['Mindest-Wassertiefe, Abstände, Geländer, rutschfeste Oberflächen', 'Keine besonderen Vorschriften', 'Nur ein Warnschild', 'Nur Aufsichtspflicht'], correct: 0 },
    { q: 'Welche Aufgabe erfüllt der Schlitten (die Walze) bei einem Sprungbrett?', a: ['Verstellung der Federspannung und Sprungweite', 'Dekoration', 'Beleuchtung', 'Rutschfestigkeit'], correct: 0 },
    { q: 'Welche Wassertiefen werden unter Sprungbrettern gefordert?', a: ['1m-Brett: min. 3,40m Tiefe, 3m-Brett: min. 3,80m Tiefe', '1m-Brett: 1m Tiefe, 3m-Brett: 3m Tiefe', '1m für beide', '5m für beide'], correct: 0 },
    // Variobecken & Elektrotechnik (Fragen 202-210)
    { q: 'Was versteht man unter einem Variobecken?', a: ['Ein Becken mit verstellbarem Hubboden für verschiedene Wassertiefen', 'Ein Becken mit verschiedenen Farben', 'Ein rundes Becken', 'Ein Becken ohne Wasser'], correct: 0 },
    { q: 'Wie sind Variobecken hinsichtlich der Beckenhydraulik zu durchströmen?', a: ['Gleichmäßig über den gesamten Beckenquerschnitt', 'Nur von einer Seite', 'Nur von oben', 'Gar nicht'], correct: 0 },
    { q: 'Was ist bei der Bedienung von Hubböden zu beachten?', a: ['Sicherheitsabschaltung, Quetschsicherung, nur geschultes Personal', 'Keine besonderen Vorschriften', 'Jeder darf sie bedienen', 'Nur im Notfall'], correct: 0 },
    { q: 'Welche Arten von Wellenmaschinen gibt es?', a: ['Luftkammer-, Klappen- und Tauchkörper-Wellenmaschinen', 'Nur elektrische Wellenmaschinen', 'Nur manuelle Wellenerzeuger', 'Es gibt nur eine Art'], correct: 0 },
    { q: 'Welchen Sinn hat ein FI-Schalter (Fehlerstrom-Schutzschalter)?', a: ['Schutz vor elektrischem Schlag durch Abschaltung bei Fehlerstrom', 'Schutz vor Überspannung', 'Nur Kurzschlussschutz', 'Nur Überlastschutz'], correct: 0 },
    { q: 'Was ist das Symbol für einen Schutzklasse-I-Geräte?', a: ['Schutzleiteranschluss (Erde-Symbol)', 'Doppelte Isolierung (Quadrat im Quadrat)', 'Keine Kennzeichnung', 'Tropfwasserschutz'], correct: 0 },
    { q: 'Was ist das Symbol für Schutzklasse II?', a: ['Quadrat im Quadrat (doppelte/verstärkte Isolierung)', 'Erde-Symbol', 'Blitzsymbol', 'Wassertropfen'], correct: 0 },
    { q: 'Welches Symbol steht für elektrische Spannung?', a: ['U (Einheit: Volt)', 'I (Einheit: Ampere)', 'P (Einheit: Watt)', 'R (Einheit: Ohm)'], correct: 0 },
    { q: 'Welches Symbol steht für elektrischen Strom?', a: ['I (Einheit: Ampere)', 'U (Einheit: Volt)', 'P (Einheit: Watt)', 'R (Einheit: Ohm)'], correct: 0 },
    { q: 'In welcher Einheit wird die Frequenz angegeben?', a: ['Hertz (Hz)', 'Volt (V)', 'Ampere (A)', 'Watt (W)'], correct: 0 },
    { q: 'Wie wird Gleichstrom dargestellt?', a: ['DC oder mit geradem Strich (—)', 'AC oder mit Wellenlinie (~)', 'Mit einem Kreis', 'Mit einem Dreieck'], correct: 0 },
    { q: 'Wie wird Wechselstrom dargestellt?', a: ['AC oder mit Wellenlinie (~)', 'DC oder mit geradem Strich (—)', 'Mit einem Kreuz', 'Mit einem Pfeil'], correct: 0 },
    { q: 'Wie kann sich elektrischer Strom bei Kontakt auf den Menschen auswirken?', a: ['Muskelverkrampfung, Herzrhythmusstörung, Verbrennungen, Tod', 'Gar nicht bei niedrigen Spannungen', 'Nur leichtes Kribbeln', 'Nur bei Gleichstrom gefährlich'], correct: 0 },
    // Korrosion (Fragen 211-219)
    { q: 'Was versteht man unter Korrosion?', a: ['Zerstörung von Werkstoffen durch chemische oder elektrochemische Reaktion mit der Umgebung', 'Reinigung von Metallen', 'Verstärkung von Materialien', 'Lackierung von Oberflächen'], correct: 0 },
    { q: 'Welche Korrosionsarten werden unterschieden?', a: ['Chemische, elektrochemische und biologische Korrosion', 'Nur Rost', 'Nur Lochfraß', 'Nur Flächenkorrosion'], correct: 0 },
    { q: 'Wie entsteht chemische Korrosion?', a: ['Durch direkte Reaktion des Metalls mit aggressiven Stoffen (Säuren, Laugen, Gase)', 'Nur durch Strom', 'Nur durch Wasser', 'Nur durch Hitze'], correct: 0 },
    { q: 'Wie kann es zur Korrosion an Werkstoffen kommen?', a: ['Durch Feuchtigkeit, aggressive Chemikalien, Kontakt verschiedener Metalle', 'Nur durch Sonneneinstrahlung', 'Nur durch Kälte', 'Korrosion tritt nur an Eisen auf'], correct: 0 },
    { q: 'Wie entsteht elektrochemische Korrosion?', a: ['Durch ein galvanisches Element (zwei verschiedene Metalle in einem Elektrolyt)', 'Durch Sonnenlicht', 'Durch Hitze allein', 'Durch Wind'], correct: 0 },
    { q: 'Was bedeutet aktiver Korrosionsschutz?', a: ['Kathodischer Schutz durch Opferanoden oder Fremdstrom', 'Nur Anstreichen', 'Nur Abdecken', 'Kein Schutz nötig'], correct: 0 },
    { q: 'Was bedeutet passiver Korrosionsschutz?', a: ['Beschichtungen, Lackierungen, Verzinkung als Barriere', 'Elektrischer Schutz', 'Chemischer Zusatz im Wasser', 'Keine Maßnahme'], correct: 0 },
    { q: 'Was bedeutet konstruktiver Korrosionsschutz?', a: ['Vermeidung von Korrosion durch geeignete Materialwahl und Konstruktion', 'Nur Anstreichen', 'Nur Opferanoden', 'Nur Verzinkung'], correct: 0 },
    { q: 'Wie können Sie einen Filter von innen vor Korrosion schützen?', a: ['Innenbeschichtung mit GFK oder Gummierung', 'Gar nicht', 'Nur von außen streichen', 'Durch höhere Wassertemperatur'], correct: 0 },
    { q: 'Welche Bedeutung hat die Spannungsreihe der Metalle für die Korrosion?', a: ['Unedle Metalle korrodieren bei Kontakt mit edleren Metallen', 'Keine Bedeutung', 'Nur für die Elektrotechnik wichtig', 'Nur für Gold relevant'], correct: 0 },
    { q: 'Welche Vor- und Nachteile hat eine GFK-Innenbeschichtung bei Filtern?', a: ['Vorteil: korrosionsbeständig; Nachteil: kann bei Beschädigung unterwandert werden', 'Nur Vorteile', 'Nur Nachteile', 'Weder Vor- noch Nachteile'], correct: 0 },
    // Beckenausstattung (Fragen 220-236)
    { q: 'Wie müssen Beckenausstiege beschaffen sein?', a: ['Rutschfest, gut erkennbar, leicht zugänglich, mit Handlauf', 'Glatt und poliert', 'Aus Holz', 'Ohne Handlauf'], correct: 0 },
    { q: 'Was ist eine Beckenraststufe?', a: ['Eine Stufe unterhalb des Wasserspiegels zum Ausruhen und Festhalten', 'Eine Treppenstufe außerhalb des Beckens', 'Ein Sprungbrett', 'Eine Rutsche'], correct: 0 },
    { q: 'Was sind bauliche Ausbildungsmerkmale eines Startblocks?', a: ['Rutschfeste Oberfläche, 10% Neigung, stabile Verankerung, Haltegriff', 'Nur ein flaches Brett', 'Nur eine erhöhte Plattform', 'Keine besonderen Merkmale'], correct: 0 },
    { q: 'Warum hat die Auftrittsfläche eines Startblocks 10% Neigung zum Becken?', a: ['Für einen optimalen Absprungwinkel beim Start', 'Damit Regenwasser abfließt', 'Aus optischen Gründen', 'Gegen Rutschgefahr'], correct: 0 },
    { q: 'Warum ist ein Sprungbrett ca. 2% zum Beckenumgang hin geneigt?', a: ['Damit Wasser vom Brett ablaufen kann und es rutschfester wird', 'Für besseren Absprung', 'Aus optischen Gründen', 'Das stimmt nicht'], correct: 0 },
    { q: 'Welche Markierungen sind am Beckenkopf erforderlich?', a: ['Bahnbegrenzungen, Tiefenangaben, Wendemarken', 'Nur die Beckennummer', 'Keine Markierungen', 'Nur Werbung'], correct: 0 },
    { q: 'Wie sind Handläufe bei Beckenausstiegsleitern beschaffen?', a: ['Aus Edelstahl, durchgehend, ergonomisch geformt, korrosionsbeständig', 'Aus Holz', 'Aus normalem Stahl', 'Aus Kunststoff'], correct: 0 },
    { q: 'Welche Aufgaben erfüllen Rinnenabdeckroste?', a: ['Abdeckung der Überlaufrinne, Trittsicherheit, Verhinderung von Unfällen', 'Nur Dekoration', 'Nur Schallschutz', 'Keine besondere Aufgabe'], correct: 0 },
    { q: 'Wie sind Rinnenabdeckroste zu warten?', a: ['Regelmäßig reinigen, auf Bruchstellen und Befestigung prüfen', 'Gar nicht', 'Nur einmal jährlich ansehen', 'Nur bei Bedarf'], correct: 0 },
    { q: 'Worauf ist bei Gittern, Sieben und Rosten an Wasserein- und -ausläufen zu achten?', a: ['Unfallsicher befestigt, keine Ansaugefahr, fingersichere Öffnungen', 'Auf nichts Besonderes', 'Nur auf die Optik', 'Nur auf die Farbe'], correct: 0 },
    { q: 'Welche Rettungsgeräte werden in Hallenbädern benötigt?', a: ['Rettungsstange, Rettungsring, Spineboard, Rettungsbrett, Erste-Hilfe-Material', 'Nur ein Seil', 'Keine speziellen Geräte', 'Nur Schwimmflügel'], correct: 0 },
    { q: 'Welche Schutzausrüstung benötigen Sie bei Arbeiten an Chlorungsanlagen?', a: ['Chlorgasmaske, Schutzhandschuhe, Schutzbrille, Schutzkleidung', 'Keine besondere Ausrüstung', 'Nur eine Sonnenbrille', 'Nur Handschuhe'], correct: 0 },
    { q: 'Welche Angaben kennzeichnen einen Schutzmaskenfilter gegen Chlorgas?', a: ['Filtertyp B (grau) für anorganische Gase und Dämpfe', 'Filtertyp A (braun)', 'Filtertyp K (grün)', 'Kein spezieller Filter nötig'], correct: 0 },
    { q: 'Wann müssen Sie den Filter Ihrer Chlorgasmaske erneuern?', a: ['Nach Gebrauch, bei Geruchswahrnehmung, nach Ablaufdatum', 'Nie, Filter halten ewig', 'Nur einmal pro Jahr', 'Nur bei sichtbarer Verschmutzung'], correct: 0 },
    { q: 'Welche Schutzausrüstung benötigen Sie bei einer Grundreinigung?', a: ['Gummistiefel, Schutzhandschuhe, Schutzbrille, ggf. Atemschutz', 'Keine besondere Ausrüstung', 'Nur Straßenkleidung', 'Nur Badehose'], correct: 0 },
    { q: 'Welche Schutzausrüstung benötigen Sie beim Umgang mit Salzsäure oder Natriumhypochlorit?', a: ['Schutzbrille, Gesichtsschutz, säurefeste Handschuhe und Schürze', 'Keine besondere Ausrüstung', 'Nur Handschuhe', 'Nur Mundschutz'], correct: 0 },
    { q: 'Wie können Freibadbecken winterfest gemacht werden?', a: ['Wasserstand absenken oder Becken gefüllt lassen mit Eisdruckpolstern', 'Gar nicht, einfach stehenlassen', 'Nur Wasser komplett ablassen', 'Nur abdecken'], correct: 0 },
    // Überwinterung (Fragen 237-239)
    { q: 'Was sind Vorteile der Überwinterung ohne Wasser im Becken?', a: ['Gute Inspektionsmöglichkeit, Reparaturen möglich', 'Keine Vorteile', 'Weniger Kosten immer', 'Besserer Frostschutz'], correct: 0 },
    { q: 'Was sind Nachteile der Überwinterung ohne Wasser im Becken?', a: ['Gefahr von Frostschäden durch Grundwasserauftrieb und Rissbildung', 'Keine Nachteile', 'Nur höhere Kosten', 'Nur Geruchsbelästigung'], correct: 0 },
    { q: 'Was sind Vorteile der Überwinterung mit Wasser im Becken?', a: ['Schutz gegen Grundwasserauftrieb, Stabilisierung der Beckenwände', 'Keine Vorteile', 'Das Wasser bleibt sauber', 'Man kann im Winter schwimmen'], correct: 0 },
    { q: 'Welche Maßnahmen sind zur Überwinterung von Freibädern zu treffen?', a: ['Leitungen entleeren, Eisdruckpolster einsetzen, Technik konservieren', 'Keine besonderen Maßnahmen', 'Nur Zaun abschließen', 'Nur Wasser ablassen'], correct: 0 },
    // Werkstoffe (Fragen 240-244)
    { q: 'Wie lassen sich Werkstoffe generell einteilen?', a: ['In Metalle, Kunststoffe, Keramik und Naturstoffe', 'Nur in Metalle und Holz', 'Nur in Kunststoffe', 'Nur in Glas und Stein'], correct: 0 },
    { q: 'Welche Metalle zählen zu den Eisenmetallen?', a: ['Stahl und Gusseisen', 'Kupfer und Aluminium', 'Gold und Silber', 'Zink und Zinn'], correct: 0 },
    { q: 'Welche Metalle zählen zu den Nichteisenmetallen?', a: ['Kupfer, Aluminium, Zink, Titan', 'Stahl und Gusseisen', 'Nur Eisen', 'Nur Blei'], correct: 0 },
    { q: 'Welche physikalischen Eigenschaften von Werkstoffen sind im Bäderbereich wichtig?', a: ['Dichte, Wärmeleitfähigkeit, Schmelzpunkt, elektrische Leitfähigkeit', 'Nur die Farbe', 'Nur der Geruch', 'Nur das Gewicht'], correct: 0 },
    { q: 'Welche mechanischen Eigenschaften von Werkstoffen sind im Bäderbereich wichtig?', a: ['Festigkeit, Härte, Elastizität, Verschleißbeständigkeit', 'Nur der Preis', 'Nur die Farbe', 'Nur der Geschmack'], correct: 0 },
    { q: 'Welche chemischen Eigenschaften von Werkstoffen sind im Bäderbereich wichtig?', a: ['Korrosionsbeständigkeit, Säure-/Laugenbeständigkeit, Chlorbeständigkeit', 'Nur die Brennbarkeit', 'Nur die Löslichkeit', 'Keine besonderen'], correct: 0 },
    // Pumpen (Fragen 245-258)
    { q: 'Wie unterscheidet man Pumpen im Bäderbereich?', a: ['Verdrängerpumpen (Kolben, Membran) und Strömungspumpen (Kreisel)', 'Nur nach Größe', 'Nur nach Farbe', 'Nur nach Hersteller'], correct: 0 },
    { q: 'Wo werden Kolbenpumpen im Bäderbereich eingesetzt?', a: ['Zur Chemikaliendosierung (geringe Mengen, hoher Druck)', 'Als Hauptumwälzpumpe', 'Zur Beckenentleerung', 'Zur Wellenanlage'], correct: 0 },
    { q: 'Wie funktioniert eine Membranpumpe?', a: ['Eine flexible Membran erzeugt durch Hin- und Herbewegung einen Pumpeffekt', 'Durch Rotation eines Rades', 'Durch Schwerkraft', 'Durch Dampfdruck'], correct: 0 },
    { q: 'Wo werden Membranpumpen im Bäderbereich eingesetzt?', a: ['Zur Dosierung von Chemikalien (Chlor, Flockungsmittel, pH-Korrektur)', 'Als Hauptumwälzpumpe', 'Zur Schwallwasserentsorgung', 'Als Feuerlöschpumpe'], correct: 0 },
    { q: 'Was ist ein Vorteil von Kolbenpumpen?', a: ['Sehr genaue Dosierung auch bei kleinen Mengen', 'Sehr hoher Volumenstrom', 'Keine Wartung nötig', 'Sehr leise'], correct: 0 },
    { q: 'Was ist ein Nachteil von Kolbenpumpen?', a: ['Pulsierender Förderstrom, Verschleiß der Ventile', 'Zu hoher Volumenstrom', 'Zu leise', 'Keine Nachteile'], correct: 0 },
    { q: 'Wie arbeitet eine Kreiselpumpe?', a: ['Ein rotierendes Laufrad beschleunigt das Wasser durch Fliehkraft', 'Durch einen Kolben', 'Durch eine Membran', 'Durch Schwerkraft'], correct: 0 },
    { q: 'Wie können Kreiselpumpen zwischen Nass- und Trockenteil abgedichtet werden?', a: ['Durch Gleitringdichtungen oder Stopfbuchsen', 'Gar nicht', 'Mit Klebeband', 'Mit Silikon'], correct: 0 },
    { q: 'Was ist das Prinzip einer Wasserstrahlpumpe?', a: ['Treibwasser erzeugt Unterdruck durch hohe Geschwindigkeit (Venturi-Effekt)', 'Elektromotor treibt Laufrad', 'Kolben erzeugt Druck', 'Membran bewegt sich'], correct: 0 },
    { q: 'Nach welchem Prinzip arbeitet eine Injektorpumpe?', a: ['Nach dem Venturi-Prinzip (Strahlpumpe)', 'Nach dem Kolbenprinzip', 'Nach dem Membranprinzip', 'Nach dem Kreiselprinzip'], correct: 0 },
    { q: 'Wo werden Injektorpumpen im Bäderbereich eingesetzt?', a: ['Zur Chemikalien-Einimpfung und Mischung', 'Als Hauptumwälzpumpe', 'Zur Beckenentleerung', 'Zur Wellenanlage'], correct: 0 },
    { q: 'Was ist ein Stechheber?', a: ['Ein Gerät zur Probeentnahme von Flüssigkeiten aus Behältern', 'Eine Pumpe', 'Ein Werkzeug für Rohre', 'Ein Messgerät'], correct: 0 },
    { q: 'Wie ändern sich Förderhöhe und Volumen bei zwei in Reihe geschalteten Pumpen?', a: ['Förderhöhe verdoppelt sich, Volumenstrom bleibt gleich', 'Volumenstrom verdoppelt sich', 'Beides verdoppelt sich', 'Nichts ändert sich'], correct: 0 },
    { q: 'Wie ändern sich Förderhöhe und Volumen bei zwei parallel geschalteten Pumpen?', a: ['Volumenstrom verdoppelt sich, Förderhöhe bleibt gleich', 'Förderhöhe verdoppelt sich', 'Beides verdoppelt sich', 'Nichts ändert sich'], correct: 0 },
    { q: 'Mit welchen Pumpen lassen sich im Bäderbereich Chemikalien dosieren?', a: ['Membranpumpen und Kolbenpumpen', 'Nur Kreiselpumpen', 'Nur Zahnradpumpen', 'Nur Wasserstrahlpumpen'], correct: 0 },
    { q: 'Was ist ein Gegenstromapparat?', a: ['Ein Wärmetauscher, in dem zwei Medien in entgegengesetzter Richtung fließen', 'Eine Schwimmhilfe', 'Ein Wasserrutschenteil', 'Ein Filtergehäuse'], correct: 0 },
    // Wärme & Energie (Fragen 259-270)
    { q: 'Welche Möglichkeiten gibt es, Schwimmbeckenwasser zu erwärmen?', a: ['Wärmetauscher, Solarthermie, Wärmepumpe, direkte Beheizung', 'Nur Sonnenlicht', 'Nur Elektroheizstab', 'Gar nicht'], correct: 0 },
    { q: 'Wie kann Duschwasser in Bädern erwärmt werden?', a: ['Wärmetauscher, Durchlauferhitzer, Speichersystem, Solaranlage', 'Nur durch Sonnenlicht', 'Nur durch Dampf', 'Gar nicht'], correct: 0 },
    { q: 'Wie kann man in Schwimmbädern die Wärmeenergieausnutzung verbessern?', a: ['Wärmerückgewinnung aus Abluft und Abwasser, Beckenabdeckung', 'Fenster öffnen', 'Heizung abschalten', 'Mehr Badegäste einladen'], correct: 0 },
    { q: 'Wofür könnte Solarenergie in Hallenbädern genutzt werden?', a: ['Beckenwassererwärmung, Warmwasser, Raumheizung', 'Nur für Beleuchtung', 'Nur für Kassensystem', 'Nicht nutzbar'], correct: 0 },
    { q: 'Was sind Hauptaufgaben der Klimaanlage eines Hallenbades?', a: ['Be- und Entlüftung, Entfeuchtung, Temperierung der Hallenluft', 'Nur Kühlung', 'Nur Heizung', 'Nur Geruchsbeseitigung'], correct: 0 },
    { q: 'Warum ist die Entfeuchtung der Luft in der Schwimmhalle wichtig?', a: ['Zur Vermeidung von Kondenswasser, Korrosion und Bauschäden', 'Nur für den Komfort', 'Ist nicht wichtig', 'Nur für den Geruch'], correct: 0 },
    { q: 'Was ist der Taupunkt der Luft?', a: ['Die Temperatur, bei der die Luft mit Wasserdampf gesättigt ist und Kondensation eintritt', 'Die maximale Lufttemperatur', 'Die minimale Raumtemperatur', 'Der Siedepunkt von Wasser'], correct: 0 },
    { q: 'Was passiert bei Ausfall der Schwimmhallenklimaanlage?', a: ['Kondenswasser an Wänden und Decke, Korrosion, Schimmelgefahr', 'Nichts Besonderes', 'Das Wasser kühlt ab', 'Die Beleuchtung fällt aus'], correct: 0 },
    { q: 'Warum kann ein Mensch in der Sauna ca. 100°C kurzzeitig ertragen?', a: ['Trockene Luft leitet Wärme schlecht, Schweiß kühlt durch Verdunstung', 'Der Körper ist hitzeresistent', 'Die Temperatur wird falsch gemessen', 'Der Mensch spürt keine Hitze'], correct: 0 },
    { q: 'Was sind Legionellen?', a: ['Stäbchenförmige Bakterien, die sich in warmem Wasser vermehren (25-50°C)', 'Viren im kalten Wasser', 'Algen im Beckenwasser', 'Pilze auf Fliesen'], correct: 0 },
    { q: 'Wie wird Legionellenprophylaxe in Bädern durchgeführt?', a: ['Wassertemperatur >60°C im Speicher, regelmäßige thermische Desinfektion, Durchfluss sichern', 'Nur durch Chlorung', 'Gar nicht', 'Durch Abkühlung des Wassers'], correct: 0 },
    { q: 'Wie kann Wärmerückgewinnung in Bädern durchgeführt werden?', a: ['Wärmetauscher in Abluft und Abwasser zur Vorwärmung von Frischluft/Frischwasser', 'Gar nicht möglich', 'Nur durch Solaranlagen', 'Durch Fenster öffnen'], correct: 0 },
    { q: 'Welchen Sinn haben Schwimmbadabdeckungen?', a: ['Reduzierung von Verdunstung, Wärmeverlust und Verschmutzung', 'Nur Dekoration', 'Nur Schutz vor Regen', 'Kein besonderer Nutzen'], correct: 0 },
    // Algen (Fragen 271-276)
    { q: 'Was sind Algen und wie vermehren sie sich?', a: ['Pflanzenähnliche Organismen, vermehren sich durch Zellteilung und Sporen', 'Bakterien, vermehren sich durch Luft', 'Pilze, vermehren sich durch Wurzeln', 'Viren, vermehren sich durch Kontakt'], correct: 0 },
    { q: 'Wie wirkt sich starker Algenbefall im Becken aus?', a: ['Glatte Oberflächen (Rutschgefahr), Trübung, erhöhter Chlorverbrauch', 'Gar nicht', 'Nur optisch störend', 'Nur leichter Geruch'], correct: 0 },
    { q: 'Welche Wachstumsbedingungen benötigen Algen?', a: ['Licht, Wärme, Nährstoffe, stehendes Wasser', 'Nur Dunkelheit', 'Nur Kälte', 'Nur trockene Bedingungen'], correct: 0 },
    { q: 'Welche schwimmbadtechnischen Auswirkungen hat Algenbewuchs?', a: ['Filterbelastung, erhöhter Chemikalienverbrauch, Rutschgefahr', 'Keine Auswirkungen', 'Nur bessere Wasserqualität', 'Nur optische Veränderung'], correct: 0 },
    { q: 'Was sind Algenbekämpfungsmittel?', a: ['Algizide – spezielle Chemikalien zur Vorbeugung und Bekämpfung von Algenwachstum', 'Nur Chlor', 'Nur Essig', 'Nur heißes Wasser'], correct: 0 },
    { q: 'Worauf ist bei der Algenbekämpfung besonders zu achten?', a: ['Richtige Dosierung, ausreichend Chlor, gute Durchströmung, Ursache beseitigen', 'Auf nichts Besonderes', 'Nur mehr Wasser hinzufügen', 'Nur die Temperatur senken'], correct: 0 },
    // Desinfektion (Fragen 277-303)
    { q: 'Was versteht man unter Stoßchlorung?', a: ['Kurzzeitige, stark erhöhte Chlorzugabe zur intensiven Desinfektion', 'Normale tägliche Chlorung', 'Chlorentzug aus dem Wasser', 'Chlormessung am Morgen'], correct: 0 },
    { q: 'Warum müssen Flächen und Beckenwasser desinfiziert werden?', a: ['Zur Abtötung von Krankheitserregern und Schutz der Badegäste', 'Nur wegen dem Geruch', 'Nur wegen der Farbe', 'Nur zur Reinigung'], correct: 0 },
    { q: 'Welche Krankheitserreger kommen im Bäderbereich häufig vor?', a: ['Bakterien, Viren, Pilze (z.B. Fußpilz), Einzeller', 'Nur Bakterien', 'Keine Krankheitserreger', 'Nur Viren'], correct: 0 },
    { q: 'Was bedeutet "fungizid"?', a: ['Pilztötend', 'Bakterientötend', 'Virentötend', 'Algentötend'], correct: 0 },
    { q: 'Was bedeutet "bakterizid"?', a: ['Bakterientötend', 'Pilztötend', 'Virentötend', 'Algentötend'], correct: 0 },
    { q: 'Was bedeutet "virulent"?', a: ['Ansteckend, krankmachend (Fähigkeit eines Erregers, Krankheit auszulösen)', 'Gegen Viren wirkend', 'Virentötend', 'Virenfreundlich'], correct: 0 },
    { q: 'Was bedeutet "algizid"?', a: ['Algentötend', 'Bakterientötend', 'Pilztötend', 'Virentötend'], correct: 0 },
    { q: 'Was bedeutet "sporizid"?', a: ['Sporentötend (Abtötung von Dauerformen)', 'Pilztötend', 'Bakterientötend', 'Algentötend'], correct: 0 },
    { q: 'Welche Algenarten kommen in Freibädern häufig vor?', a: ['Grünalgen, Blaualgen (Cyanobakterien), Braunalgen', 'Nur Rotalgen', 'Keine Algen', 'Nur Kieselalgen'], correct: 0 },
    { q: 'Welche Wirkstofftypen gibt es für die Flächendesinfektion?', a: ['Aldehyde, Alkohole, Halogene, quartäre Ammoniumverbindungen', 'Nur Chlor', 'Nur Seife', 'Nur Wasser'], correct: 0 },
    { q: 'Welche Anforderungen werden an gute Desinfektionsmittel gestellt?', a: ['Breites Wirkungsspektrum, schnelle Wirkung, materialschonend, umweltverträglich', 'Nur billig', 'Nur gut riechend', 'Keine besonderen Anforderungen'], correct: 0 },
    { q: 'Wie wirken Aldehyde als Desinfektionsmittel?', a: ['Sie denaturieren Eiweiße von Mikroorganismen', 'Sie lösen Kalk auf', 'Sie senken den pH-Wert', 'Sie erwärmen das Wasser'], correct: 0 },
    { q: 'Wie wirken Phenolderivate als Desinfektionsmittel?', a: ['Sie schädigen die Zellmembran von Mikroorganismen', 'Sie erhöhen den pH-Wert', 'Sie senken die Temperatur', 'Sie lösen Fette'], correct: 0 },
    { q: 'Wie wirken Alkohole als Desinfektionsmittel?', a: ['Sie denaturieren Eiweiße und lösen Lipide der Zellmembran', 'Sie lösen nur Kalk', 'Sie wirken nur bei hohen Temperaturen', 'Sie sind unwirksam'], correct: 0 },
    { q: 'Wie wirken quartäre Ammoniumverbindungen (QUAT)?', a: ['Sie stören die Zellmembran von Bakterien', 'Sie lösen Kalk', 'Sie erhöhen den pH-Wert', 'Sie wirken nur gegen Viren'], correct: 0 },
    { q: 'Wie wirken Halogene (z.B. Chlor) als Desinfektionsmittel?', a: ['Oxidation und Zerstörung der Zellstrukturen von Mikroorganismen', 'Nur durch Erwärmung', 'Nur durch Abkühlung', 'Durch mechanische Wirkung'], correct: 0 },
    { q: 'Was ist ein Vorteil von Alkoholen bei der Flächendesinfektion?', a: ['Schnelle Wirkung, verdunsten rückstandsfrei', 'Sehr billig', 'Wirken gegen Sporen', 'Kein Geruch'], correct: 0 },
    { q: 'Was ist ein Nachteil von Alkoholen bei der Flächendesinfektion?', a: ['Keine Sporentwirksamkeit, brennbar, schnelle Verdunstung', 'Zu teuer', 'Zu langsam', 'Hinterlassen Rückstände'], correct: 0 },
    { q: 'Was ist ein Nachteil von QUAT bei der Flächendesinfektion?', a: ['Eingeschränktes Wirkungsspektrum, nicht sporentwirksam', 'Zu teuer', 'Zu schnelle Wirkung', 'Zu starker Geruch'], correct: 0 },
    { q: 'Was sind Arbeitsgrundsätze bei der Desinfektion von Flächen?', a: ['Richtige Konzentration, Einwirkzeit beachten, Fläche vorher reinigen', 'Keine besonderen Grundsätze', 'Einfach draufsprühen', 'Nur bei sichtbarem Schmutz'], correct: 0 },
    { q: 'Was versteht man unter "gebunden wirksames Chlor"?', a: ['Chlor, das mit Stickstoffverbindungen (Harnstoff etc.) zu Chloraminen reagiert hat', 'Frisch dosiertes Chlor', 'Chlor im Gasraum', 'Chlor in der Flasche'], correct: 0 },
    { q: 'Was versteht man unter "frei wirksames Chlor"?', a: ['Aktives Chlor (HOCl/OCl⁻), das noch Desinfektionskraft hat', 'Chlor, das verbraucht ist', 'Gebundenes Chlor', 'Chlorgas in der Luft'], correct: 0 },
    { q: 'Was sind Chloramine und wie entstehen sie?', a: ['Verbindungen aus Chlor und Stickstoff (Harnstoff, Schweiß), verursachen Chlorgeruch', 'Chlor in reiner Form', 'Chlor im Gasraum', 'Natürliche Chlorverbindungen'], correct: 0 },
    { q: 'Was sind THMs (Trihalogenmethane)?', a: ['Desinfektionsnebenprodukte aus der Reaktion von Chlor mit organischen Stoffen', 'Ein Filtertyp', 'Ein Pumpenmodell', 'Ein Reinigungsmittel'], correct: 0 },
    { q: 'Welche Richtwerte gelten für freies Chlor im Beckenwasser?', a: ['0,3–0,6 mg/l (Hallenbad), bis 1,2 mg/l (Freibad)', '5–10 mg/l', '0,01 mg/l', 'Kein Richtwert'], correct: 0 },
    { q: 'Wer führt die Kontrollen der Wasserqualität in öffentlichen Bädern durch?', a: ['Das Gesundheitsamt und akkreditierte Labore', 'Nur der Bademeister', 'Die Feuerwehr', 'Die Polizei'], correct: 0 },
    // Messfehler & Messtechnik (Fragen 301-303)
    { q: 'Welche Messfehler können bei der kolorimetrischen Wasseruntersuchung auftreten?', a: ['Verschmutzte Küvetten, falsche Reagenzien, abgelaufene Testmittel', 'Keine Fehler möglich', 'Nur Temperaturfehler', 'Nur Ablesefehler'], correct: 0 },
    { q: 'Wie unterscheiden sich kolorimetrische und fotometrische Wasseruntersuchung?', a: ['Kolorimetrisch: Farbvergleich mit Auge; Fotometrisch: elektronische Messung der Lichtabsorption', 'Kein Unterschied', 'Kolorimetrisch ist genauer', 'Fotometrisch nutzt Farbvergleichsscheiben'], correct: 0 },
    { q: 'Welche Verfahrenskombinationen zur Wasseraufbereitung gibt es nach DIN 19643?', a: ['Flockung-Filtration-Desinfektion in verschiedenen Kombinationen (z.B. mit Ozon, Adsorption, UV)', 'Nur Chlorung', 'Nur Filtration', 'Keine festgelegten Verfahren'], correct: 0 },
    // Beckenwasserdurchströmung (Fragen 304-312)
    { q: 'Warum ist eine gute Beckenwasserdurchströmung erforderlich?', a: ['Gleichmäßige Verteilung des Desinfektionsmittels und Vermeidung von Totzonen', 'Nur für Wellenbetrieb', 'Nur für die Optik', 'Ist nicht wichtig'], correct: 0 },
    { q: 'Welche Beckenwasserdurchströmungsarten gibt es?', a: ['Horizontale, vertikale und gemischte Durchströmung', 'Nur horizontale', 'Nur vertikale', 'Es gibt keine Unterschiede'], correct: 0 },
    { q: 'Welche Anforderungen werden an die Beckenwasserdurchströmung gestellt?', a: ['Gleichmäßig, totzonenfrei, kurze Aufenthaltszeit, guter Austausch', 'Keine besonderen Anforderungen', 'Nur schnelle Durchströmung', 'Nur langsame Durchströmung'], correct: 0 },
    { q: 'Was sind Totzonen bzw. Totwassergebiete?', a: ['Bereiche im Becken mit unzureichender Durchströmung und Desinfektion', 'Die tiefsten Stellen im Becken', 'Bereiche ohne Badegäste', 'Bereiche mit zu viel Chlor'], correct: 0 },
    { q: 'Was versteht man unter dem mittleren stündlichen Förderstrom?', a: ['Das Wasservolumen, das pro Stunde durch die Aufbereitungsanlage gefördert wird', 'Die maximale Pumpenleistung', 'Den Wasserverbrauch der Duschen', 'Die Regenmenge pro Stunde'], correct: 0 },
    { q: 'Welche Aufgaben erfüllen Überlaufrinnen?', a: ['Abführung des Schwallwassers, Oberflächenreinigung, Niveauregulierung', 'Nur Dekoration', 'Nur Wellenbrecher', 'Keine besondere Aufgabe'], correct: 0 },
    { q: 'Welche Rinnensysteme gibt es?', a: ['Finnische Rinne, Wiesbadener Rinne, Züricher Rinne, Kastenrinne', 'Nur ein Rinnensystem', 'Nur die Wiesbadener Rinne', 'Nur die Finnische Rinne'], correct: 0 },
    { q: 'Was sind Vorteile der Finnischen Rinne?', a: ['Gute Oberflächenreinigung, geringe Geräuschentwicklung', 'Sehr billig', 'Keine Wartung nötig', 'Besser als alle anderen'], correct: 0 },
    { q: 'Was sind Nachteile der Finnischen Rinne?', a: ['Hoher baulicher Aufwand, schwer zu reinigen', 'Keine Nachteile', 'Zu laut', 'Zu teuer im Betrieb'], correct: 0 },
    { q: 'Was sind Vorteile der Wiesbadener Rinne?', a: ['Leicht zu reinigen, gute Zugänglichkeit', 'Keine Vorteile', 'Sehr billig', 'Geräuschlos'], correct: 0 },
    { q: 'Was sind Nachteile der Wiesbadener Rinne?', a: ['Höhere Geräuschentwicklung, Spritzwasser auf Umgang möglich', 'Keine Nachteile', 'Sehr teuer', 'Schwer zu reinigen'], correct: 0 },
    // Handfasse, Skimmer, Schwallwasserbehälter (Fragen 313-324)
    { q: 'Welche Aufgaben erfüllt eine Handfasse?', a: ['Festhaltemöglichkeit für Schwimmer am Beckenrand', 'Nur Dekoration', 'Wassereinlauf', 'Wasserablauf'], correct: 0 },
    { q: 'Wie ist eine Finnische Rinne aufgebaut?', a: ['Unter Wasserspiegel liegende Rinne mit Überlaufkante und Abflusskanal', 'Eine einfache Regenrinne', 'Ein offener Kanal am Beckenrand', 'Eine Rohleitung unter dem Becken'], correct: 0 },
    { q: 'Welche Aufgaben erfüllt ein Skimmer?', a: ['Absaugung der Wasseroberfläche zur Entfernung von Verschmutzungen', 'Nur Wasserzufuhr', 'Nur Beleuchtung', 'Nur Dekoration'], correct: 0 },
    { q: 'Wie funktioniert ein Skimmer?', a: ['Schwimmende Klappe passt sich dem Wasserspiegel an und saugt Oberfläche ab', 'Durch eine Pumpe am Beckenboden', 'Durch Überlauf wie eine Rinne', 'Durch manuelle Absaugung'], correct: 0 },
    { q: 'Welche Aufgaben hat ein Schwallwasserbehälter?', a: ['Pufferung von Schwallwasser, Niveauregulierung, Mischpunkt für Chemikalien', 'Nur Wasserspeicherung', 'Nur Filterbehälter', 'Keine besondere Aufgabe'], correct: 0 },
    { q: 'Was bedeutet Niveauregulierung beim Schwallwasserspeicher?', a: ['Ausgleich von Wasserstandsschwankungen im Becken durch Zu-/Ablauf im Behälter', 'Farbliche Markierung des Wasserstands', 'Regelung der Wassertemperatur', 'Steuerung der Beleuchtung'], correct: 0 },
    { q: 'Welche Aufgaben erfüllen Vorfilter?', a: ['Rückhaltung grober Verschmutzungen vor der Hauptfilteranlage', 'Nur Desinfektion', 'Nur pH-Korrektur', 'Nur Wassererwärmung'], correct: 0 },
    { q: 'Welche Arten von Vorfiltern gibt es?', a: ['Haarfangsiebe, Grobfilter, Korbfilter', 'Nur Sandfilter', 'Nur Aktivkohlefilter', 'Es gibt keine Vorfilter'], correct: 0 },
    { q: 'Wie sind Roste, Gitter und Rinnenabdeckungen unfallsicher auszubilden?', a: ['Rutschfest, kippsicher, fingersicher, belastbar, gut befestigt', 'Nur angeschraubt', 'Nur lose aufgelegt', 'Keine besonderen Anforderungen'], correct: 0 },
    { q: 'Wo finden Sie Vorfilter im Schwimmbad?', a: ['Vor der Umwälzpumpe, im Schwallwasserbehälter, in der Rinne', 'Nur nach dem Hauptfilter', 'Nur im Becken', 'Nirgends'], correct: 0 },
    { q: 'Welche Arten von Wasserverunreinigungen gibt es im Bäderbereich?', a: ['Grob-, fein- und gelöste Verunreinigungen (Haare, Hautschuppen, Harnstoff)', 'Nur Haare', 'Nur Chlorreste', 'Nur Sand'], correct: 0 },
    { q: 'Was sind Kolloide?', a: ['Sehr fein verteilte Teilchen (1-100 nm), die weder gelöst noch absetzbar sind', 'Grobe Verunreinigungen', 'Chemische Verbindungen', 'Filtermedien'], correct: 0 },
    { q: 'Was sind molekular disperse Stoffe?', a: ['In Wasser gelöste Stoffe auf molekularer Ebene', 'Große Schmutzpartikel', 'Sandkörner', 'Filtermaterialien'], correct: 0 },
    { q: 'Was sind grob disperse Stoffe?', a: ['Sichtbare, absetzbare Teilchen (Haare, Fasern, Insekten)', 'Gelöste Salze', 'Kolloide', 'Gase im Wasser'], correct: 0 },
    // Filter (Fragen 325-360)
    { q: 'Wie können Kolloide im Schwimmbadwasser beseitigt werden?', a: ['Durch Flockung und anschließende Filtration', 'Nur durch Absetzen', 'Nur durch Erwärmung', 'Gar nicht'], correct: 0 },
    { q: 'Was ist der Unterschied zwischen Einschicht- und Mehrschichtenfilter?', a: ['Einschicht: ein Filtermaterial; Mehrschicht: verschiedene Materialien übereinander', 'Kein Unterschied', 'Einschicht hat mehr Material', 'Mehrschicht ist kleiner'], correct: 0 },
    { q: 'Welchen Sinn hat die Stützschicht eines Filters?', a: ['Trägt das Filtermaterial und verhindert Austrag in die Düsen', 'Nur Dekoration', 'Nur Isolierung', 'Keine Funktion'], correct: 0 },
    { q: 'Wie können Filtermaterialien wirken?', a: ['Mechanisch (Siebwirkung), adsorptiv (Anlagerung), biologisch (Abbau)', 'Nur mechanisch', 'Nur chemisch', 'Nur biologisch'], correct: 0 },
    { q: 'Welche Eigenschaften hat das Filtermaterial Anthrazitkohle?', a: ['Leicht, grobkörnig, gute mechanische Filtration, lange Standzeiten', 'Sehr schwer', 'Löst sich im Wasser', 'Nur für Trinkwasser'], correct: 0 },
    { q: 'Welche Eigenschaften hat das Filtermaterial Kieselgur?', a: ['Sehr feine Filtration, für Anschwemmfilter geeignet', 'Sehr grobe Filtration', 'Nur für Gasfilter', 'Nicht für Schwimmbäder geeignet'], correct: 0 },
    { q: 'Welche Eigenschaften hat Aktivkornkohle als Filtermaterial?', a: ['Adsorption von organischen Stoffen und Chloraminen, hohe innere Oberfläche', 'Nur mechanische Filtration', 'Keine Adsorption', 'Nur für Luftfilter'], correct: 0 },
    { q: 'Welche Eigenschaften hat dolomitisches Filtermaterial?', a: ['Entsäuerung des Wassers, pH-Anhebung durch Calciumcarbonat', 'Nur mechanische Filtration', 'Senkt den pH-Wert', 'Keine besonderen Eigenschaften'], correct: 0 },
    { q: 'Welche chemische Filterwirkung hat dolomitisches Filtermaterial?', a: ['Entsäuerung: CO₂ reagiert mit Dolomit und hebt den pH-Wert', 'Chlorproduktion', 'Säureproduktion', 'Keine chemische Wirkung'], correct: 0 },
    { q: 'Was versteht man unter kathalytisch adsorptiver Filterwirkung?', a: ['Beschleunigte chemische Umsetzung an der Oberfläche des Filtermaterials', 'Rein mechanische Filtration', 'Thermische Wirkung', 'Elektrische Wirkung'], correct: 0 },
    { q: 'Was ist der Unterschied zwischen Schnellfilter und Langsamfilter?', a: ['Schnellfilter: hohe Filtergeschwindigkeit (10-30 m/h); Langsamfilter: niedrige (0,1-0,3 m/h)', 'Kein Unterschied', 'Langsamfilter ist schneller', 'Nur die Größe unterscheidet sich'], correct: 0 },
    { q: 'Welche Vorteile bieten offene Filter?', a: ['Leichte Kontrolle des Filterzustands, einfache Wartung', 'Keine Vorteile', 'Höherer Druck möglich', 'Kleinere Bauweise'], correct: 0 },
    { q: 'Was versteht man unter mechanischer Filterwirkung?', a: ['Rückhaltung von Partikeln durch die Siebwirkung des Filtermaterials', 'Chemische Umwandlung', 'Biologischer Abbau', 'Thermische Behandlung'], correct: 0 },
    { q: 'Woran erkennen Sie, dass ein Filter rückgespült werden muss?', a: ['Druckverlust steigt an (Differenzdruck zwischen Ein- und Auslauf)', 'Der Filter wird lauter', 'Das Wasser wird wärmer', 'Der Filter wird leichter'], correct: 0 },
    { q: 'Welche Aufgaben erfüllt die Be- und Entlüftung eines Filters?', a: ['Entfernung von Luft aus dem Filter für gleichmäßige Durchströmung', 'Nur Kühlung', 'Nur Trocknung', 'Keine besondere Aufgabe'], correct: 0 },
    { q: 'Welche Aufgaben erfüllt der Düsenboden eines Filters?', a: ['Gleichmäßige Wasserverteilung und Rückhaltung des Filtermaterials', 'Nur Dekoration', 'Nur Isolierung', 'Keine Funktion'], correct: 0 },
    { q: 'Welche Aufgaben hat die Glocke (Trichter) eines Filters?', a: ['Sammlung und Ableitung des Filtrats, gleichmäßige Wasserverteilung bei Rückspülung', 'Nur Dekoration', 'Nur Schallschutz', 'Keine Aufgabe'], correct: 0 },
    { q: 'Wozu dienen die Mannlöcher eines geschlossenen Filters?', a: ['Zugang für Inspektion, Wartung und Filtermaterialwechsel', 'Nur zur Belüftung', 'Nur als Wassereinlauf', 'Nur als Notausstieg'], correct: 0 },
    { q: 'Wie machen Sie einen Filter im Freibad winterfest?', a: ['Entleeren, reinigen, Armaturen schützen, Filtermedium belüften', 'Gar nicht', 'Nur abschalten', 'Nur Wasser ablassen'], correct: 0 },
    { q: 'Was ist die Filterhaut und woraus besteht sie?', a: ['Schmutzschicht auf der Filterbett-Oberfläche aus zurückgehaltenen Partikeln und Flocken', 'Eine Folie über dem Filter', 'Eine Metallplatte', 'Eine Gummidichtung'], correct: 0 },
    { q: 'Wann wird ein Filter nach Rückspülung wieder filterwirksam?', a: ['Nach Aufbau einer neuen Filterhaut (Einfiltrierphase)', 'Sofort', 'Nach 24 Stunden', 'Nie wieder'], correct: 0 },
    { q: 'Was versteht man unter Raumfiltration?', a: ['Filtration in der Tiefe des Filterbetts – Schmutz wird im gesamten Volumen zurückgehalten', 'Filtration in einem Raum', 'Luftfiltration', 'Filtration an der Oberfläche'], correct: 0 },
    { q: 'Was versteht man unter Flächenfiltration?', a: ['Filtration an der Oberfläche des Filterbetts – Schmutz lagert sich oben ab', 'Filtration einer großen Fläche', 'Filtration von Bodenbelägen', 'Tiefenfiltration'], correct: 0 },
    { q: 'Was sind Vorteile von Aktivkohle als Filtermaterial?', a: ['Sehr gute Adsorption von organischen Stoffen, Chloraminen und Geruchsstoffen', 'Sehr billig', 'Keine Wartung nötig', 'Ewig haltbar'], correct: 0 },
    { q: 'Was sind Nachteile von Aktivkohle als Filtermaterial?', a: ['Begrenzte Lebensdauer, regelmäßiger Austausch nötig, biologische Besiedelung möglich', 'Keine Nachteile', 'Zu teuer', 'Zu schwer'], correct: 0 },
    { q: 'Was beschreibt die Filtergeschwindigkeit?', a: ['Wassermenge pro Filterfläche und Zeit (m/h oder m³/m²·h)', 'Wie schnell der Filter eingebaut wird', 'Die Drehzahl des Filters', 'Die Geschwindigkeit des Rückspülens'], correct: 0 },
    { q: 'Was versteht man unter der Standzeit eines Filters?', a: ['Betriebszeit zwischen zwei Rückspülungen', 'Die Lebensdauer des Filtergehäuses', 'Die Einbauzeit', 'Die Trocknungszeit'], correct: 0 },
    { q: 'Wie hoch muss das Freibord eines Schüttfilters mit 3,2m Schichthöhe sein?', a: ['Ca. 50% der Schichthöhe = ca. 1,6m', 'Genau 1m', 'Genau 5m', 'Kein Freibord nötig'], correct: 0 },
    { q: 'Welche Aufgaben hat das Filterfreibord?', a: ['Platz für die Ausdehnung des Filterbetts bei Rückspülung', 'Nur Isolierung', 'Nur Dekoration', 'Keine Aufgabe'], correct: 0 },
    { q: 'Welche jährlichen Wartungsarbeiten sind an einem Filter durchzuführen?', a: ['Filtermaterial prüfen, Düsenboden kontrollieren, Armaturen warten, Dichtungen prüfen', 'Keine Wartung nötig', 'Nur äußere Reinigung', 'Nur Anstrich'], correct: 0 },
    { q: 'Wie arbeitet ein Anschwemmfilter mit Sekundäranschwemmung?', a: ['Filterhilfsmittel wird auf ein Trägerelement aufgeschwemmt und bildet die Filterschicht', 'Wie ein normaler Sandfilter', 'Durch chemische Fällung', 'Durch UV-Bestrahlung'], correct: 0 },
    { q: 'Was bewirkt der Rückspülimpuls bei einem Anschwemmfilter?', a: ['Ablösung der Filterhilfsmittelschicht mit dem Schmutz', 'Verdichtung des Filterbetts', 'Erwärmung des Wassers', 'Erhöhung des Drucks'], correct: 0 },
    { q: 'Welche Filtermaterialien werden bei Anschwemmfiltern verwendet?', a: ['Kieselgur, Cellulose, Perlite', 'Nur Sand', 'Nur Aktivkohle', 'Nur Kies'], correct: 0 },
    { q: 'Was ist ein Vorteil des Anschwemmfilters?', a: ['Sehr feine Filtration, auch feinste Partikel werden zurückgehalten', 'Keine Wartung', 'Sehr billig', 'Kein Filtermaterial nötig'], correct: 0 },
    { q: 'Was ist ein Nachteil des Anschwemmfilters?', a: ['Filterhilfsmittel muss regelmäßig erneuert werden, aufwendige Handhabung', 'Keine Nachteile', 'Zu grobe Filtration', 'Zu schnelle Durchströmung'], correct: 0 },
    { q: 'Wie lässt sich die Standzeit eines Anschwemmfilters verlängern?', a: ['Durch Nachdosierung von Filterhilfsmittel (Sekundäranschwemmung)', 'Gar nicht', 'Durch höheren Druck', 'Durch wärmeres Wasser'], correct: 0 },
    // Flockung (Fragen 361-380)
    { q: 'Wozu dient die Flockung des Rohwassers?', a: ['Zusammenlagerung feiner Partikel zu größeren Flocken für die Filtration', 'Nur zur Färbung des Wassers', 'Zur Desinfektion', 'Zur Wassererwärmung'], correct: 0 },
    { q: 'Wodurch kann die Flockung beeinflusst werden?', a: ['pH-Wert, Dosierung, Mischung, Temperatur, Wasserchemie', 'Nur durch die Wassermenge', 'Nur durch die Farbe', 'Gar nicht beeinflussbar'], correct: 0 },
    { q: 'Welche Flockungsmittel werden in der Bädertechnik eingesetzt?', a: ['Aluminiumsulfat, Eisen-III-Chlorid, Polyaluminiumchlorid', 'Nur Kochsalz', 'Nur Chlor', 'Nur Essig'], correct: 0 },
    { q: 'Welche Auswirkung hat Flockung mit Aluminiumsulfat auf das Rohwasser?', a: ['pH-Wert sinkt, Karbonathärte sinkt, Flocken bilden sich', 'pH-Wert steigt', 'Keine Auswirkung', 'Wasser wird warm'], correct: 0 },
    { q: 'Welche Auswirkung hat Flockung mit Natriumaluminat auf das Rohwasser?', a: ['pH-Wert steigt, Flocken bilden sich, alkalische Reaktion', 'pH-Wert sinkt stark', 'Keine Auswirkung', 'Wasser gefriert'], correct: 0 },
    { q: 'Wie muss die Reaktionsstrecke bei der Flockung beschaffen sein?', a: ['Ausreichend lang für vollständige Flockenbildung, turbulente Mischung', 'Möglichst kurz', 'Ohne Durchmischung', 'Egal wie lang'], correct: 0 },
    { q: 'Welchen Sinn hat die Reaktionsstrecke bei der Flockung?', a: ['Zeit und Raum für die Reaktion des Flockungsmittels mit den Verunreinigungen', 'Nur Wassererwärmung', 'Nur Druckerhöhung', 'Kein besonderer Sinn'], correct: 0 },
    { q: 'Warum sollen Pumpen vor der Flockungsimpfstelle eingebaut sein?', a: ['Damit die Pumpe die Durchmischung des Flockungsmittels unterstützt', 'Aus Platzgründen', 'Wegen der Optik', 'Das ist nicht wichtig'], correct: 0 },
    { q: 'Wie werden Flockungsmittel eingeimpft?', a: ['Durch Dosierpumpen in die Rohwasserleitung nach der Umwälzpumpe', 'Per Hand ins Becken', 'Durch Schwerkraft', 'Durch Verdampfung'], correct: 0 },
    { q: 'Wie setzt sich Aluminiumsulfat (Al₂(SO₄)₃) chemisch zusammen?', a: ['Aus Aluminium, Schwefel und Sauerstoff', 'Aus Eisen und Chlor', 'Aus Natrium und Chlor', 'Aus Calcium und Kohlenstoff'], correct: 0 },
    { q: 'Was passiert chemisch bei Einsatz von Eisen-III-Chlorid im Wasser?', a: ['Es bilden sich Eisen(III)-hydroxid-Flocken unter pH-Absenkung', 'Das Wasser wird rot', 'Nichts passiert', 'Das Wasser gefriert'], correct: 0 },
    { q: 'Welche chemische Formel hat Aluminiumsulfat?', a: ['Al₂(SO₄)₃', 'FeCl₃', 'NaCl', 'CaCO₃'], correct: 0 },
    { q: 'Welche chemische Formel hat Eisen-III-Sulfat?', a: ['Fe₂(SO₄)₃', 'Al₂(SO₄)₃', 'FeCl₃', 'NaOH'], correct: 0 },
    { q: 'Wovon ist eine optimale Flockung abhängig?', a: ['Richtige Dosierung, geeigneter pH-Wert, gute Durchmischung', 'Nur von der Wassertemperatur', 'Nur vom Wasserdruck', 'Von nichts Besonderem'], correct: 0 },
    { q: 'Welche Aufgaben hat ein Marmorreaktionsturm?', a: ['Entsäuerung des Wassers und Einstellung des Kalk-Kohlensäure-Gleichgewichts', 'Nur Wassererwärmung', 'Nur Filtration', 'Nur Desinfektion'], correct: 0 },
    { q: 'Wie kann man Schwimmbadwasser chemisch enthärten?', a: ['Durch Zugabe von Enthärtungsmitteln (Phosphate, Komplexbildner)', 'Durch Erhitzen', 'Durch Abkühlen', 'Gar nicht möglich'], correct: 0 },
    { q: 'Wie kann man Schwimmbadwasser technologisch enthärten?', a: ['Durch Ionenaustauscher oder Umkehrosmose', 'Nur durch Kochen', 'Nur durch Einfrieren', 'Nur durch Filtration'], correct: 0 },
    { q: 'Wann ist in der Wasseraufbereitung eine pH-Korrektur nötig?', a: ['Wenn der pH-Wert außerhalb des Sollbereichs (6,5-7,6) liegt', 'Nie', 'Nur einmal pro Jahr', 'Nur bei Neubefüllung'], correct: 0 },
    { q: 'Welche Mittel werden zur pH-Korrektur eingesetzt?', a: ['Salzsäure/Schwefelsäure (Senkung), Natronlauge/Soda (Erhöhung)', 'Nur Kochsalz', 'Nur Zucker', 'Nur destilliertes Wasser'], correct: 0 },
    { q: 'Warum muss die Säurekapazität des Wassers eingestellt werden?', a: ['Für ein stabiles Kalk-Kohlensäure-Gleichgewicht und stabile pH-Pufferung', 'Nur aus optischen Gründen', 'Für die Wasserfarbe', 'Ist nicht nötig'], correct: 0 },
    { q: 'Wie kann man eine zu hohe Säurekapazität senken?', a: ['Durch Säurezugabe (z.B. Salzsäure, Schwefelsäure)', 'Durch Laugenzugabe', 'Durch Erwärmung', 'Durch Chlorzugabe'], correct: 0 },
    // Desinfektion Beckenwasser (Fragen 381-396)
    { q: 'Welche Anforderungen werden an Beckenwasserdesinfektionsmittel gestellt?', a: ['Breitspektrum-Wirkung, Depotwirkung, verträglich, DIN-zugelassen', 'Nur günstig', 'Nur gut riechend', 'Keine Anforderungen'], correct: 0 },
    { q: 'Welche Desinfektionsmittel sind nach DIN 19643 für Beckenwasser erlaubt?', a: ['Chlorgas, Natriumhypochlorit, Calciumhypochlorit, Chlorelektrolyse, Ozon', 'Nur Chlorgas', 'Nur Ozon', 'Beliebige Mittel'], correct: 0 },
    { q: 'Warum kann die Chlordosierung im Freibad bis 5x höher sein als im Hallenbad?', a: ['UV-Strahlung baut Chlor ab, höhere Verschmutzung durch Umwelteinflüsse', 'Weil Freibäder größer sind', 'Weil das Wasser kälter ist', 'Das stimmt nicht'], correct: 0 },
    { q: 'Welche Eigenschaften hat Chlor?', a: ['Gelbgrünes, giftiges Gas, schwerer als Luft, stechend riechend', 'Farbloses, geruchloses Gas', 'Leichter als Luft', 'Ungiftig und geruchlos'], correct: 0 },
    { q: 'Welche Eigenschaften hat Ozon?', a: ['Starkes Oxidationsmittel, instabil, zerfällt zu Sauerstoff, stechend riechend', 'Stabiles Gas', 'Geruchlos', 'Schwächer als Chlor'], correct: 0 },
    { q: 'Welche Eigenschaften hat Natriumhypochlorit?', a: ['Flüssiges Desinfektionsmittel, alkalisch, chlorhaltig, begrenzt lagerfähig', 'Festes Pulver', 'Geruchlos und neutral', 'Unbegrenzt haltbar'], correct: 0 },
    { q: 'Welche Chlorelektrolyseverfahren gibt es?', a: ['Salzsäure-Elektrolyse, Rohrzellen-Verfahren, Membranverfahren, Salzwasser-Elektrolyse', 'Nur ein Verfahren', 'Nur manuelle Chlorung', 'Keine Elektrolyseverfahren'], correct: 0 },
    { q: 'Was passiert bei der Chlorelektrolyse?', a: ['Chlorid-Ionen werden durch Strom zu Chlor oxidiert', 'Wasser wird zu Dampf', 'Salz wird zu Gold', 'Nichts Besonderes'], correct: 0 },
    { q: 'Was sind Ausgangsstoffe für die Chlorelektrolyse?', a: ['Salzsäure, Natriumchlorid-Lösung, Salzwasser', 'Nur reines Wasser', 'Nur Chlorgas', 'Nur Natronlauge'], correct: 0 },
    { q: 'Wie funktioniert die Elektrolyse von Salzsäure?', a: ['HCl wird durch Gleichstrom in Chlor (Cl₂) und Wasserstoff (H₂) zerlegt', 'HCl wird erhitzt', 'HCl wird eingefroren', 'HCl wird verdünnt'], correct: 0 },
    { q: 'Was ist das Rohrzellen-Elektrolyseverfahren?', a: ['Elektrolyse in einem rohrförmigen Reaktor mit Anode und Kathode', 'Filtration in Rohren', 'Desinfektion durch UV-Rohre', 'Pumpen in Rohrform'], correct: 0 },
    { q: 'Wie funktioniert das Membran-Elektrolyseverfahren?', a: ['Anoden- und Kathodenraum sind durch eine Membran getrennt', 'Ohne Membran', 'Durch Verdampfung', 'Durch Filtration'], correct: 0 },
    { q: 'Wie funktioniert das Salzwasser-Elektrolyseverfahren?', a: ['Meersalz wird im Wasser gelöst und durch Strom zu Chlor umgewandelt (anodische Oxidation)', 'Salz wird einfach ins Becken gestreut', 'Salzwasser wird abgekocht', 'Salzwasser wird eingefroren'], correct: 0 },
    { q: 'Wie funktioniert ein Vakuumchlorgasdosiergerät?', a: ['Chlorgas wird durch Unterdruck (Vakuum) aus der Flasche gesaugt und dem Wasser zugeführt', 'Chlorgas wird unter Druck eingepresst', 'Chlor wird erhitzt', 'Chlor wird abgekühlt'], correct: 0 },
    { q: 'Wie entsteht unterchlorige Säure (HOCl)?', a: ['Chlor reagiert mit Wasser: Cl₂ + H₂O → HOCl + HCl', 'Durch Erhitzen von Chlor', 'Durch Mischen von Salz und Essig', 'Durch UV-Bestrahlung'], correct: 0 },
    // Chlorgasanlagen (Fragen 397-419)
    { q: 'Was ist eine Treibwasserleitung?', a: ['Wasserleitung, die durch Unterdruck Chlorgas aus dem Dosiergerät ansaugt', 'Eine Abwasserleitung', 'Eine Gasleitung', 'Eine Heizungsleitung'], correct: 0 },
    { q: 'Welchen Sinn haben Chlorflaschenhilfsventile?', a: ['Sicheres Absperren der Chlorflasche ohne direkten Kontakt zum Flaschenventil', 'Nur Dekoration', 'Nur als Ersatzventil', 'Kein besonderer Sinn'], correct: 0 },
    { q: 'Wie prüfen Sie Chlor führende Leitungen auf Dichtheit?', a: ['Mit Ammoniakdampf (weißer Nebel bei Chloraustritt) oder Lecksuchspray', 'Mit Wasser', 'Mit bloßem Auge', 'Gar nicht prüfbar'], correct: 0 },
    { q: 'Wodurch kann eine Vereisung einer Chlorflasche entstehen?', a: ['Durch zu hohe Entnahmemenge – das expandierende Gas kühlt die Flasche stark ab', 'Durch zu warme Umgebung', 'Durch Sonneneinstrahlung', 'Durch zu wenig Entnahme'], correct: 0 },
    { q: 'Welche Sicherheitsvorkehrungen treffen Sie beim Chlorgasflaschenwechsel?', a: ['Schutzausrüstung anlegen, Raum belüften, Chlorgaswarngerät prüfen, Ventile schließen', 'Keine besonderen Maßnahmen', 'Nur Fenster öffnen', 'Nur Handschuhe anziehen'], correct: 0 },
    { q: 'Wo befindet sich die Messzelle des Chlorgaswarngeräts?', a: ['In Bodennähe, da Chlorgas schwerer als Luft ist', 'An der Decke', 'In der Mitte des Raums', 'Außerhalb des Gebäudes'], correct: 0 },
    { q: 'Was ist der AGW-Wert für Chlor?', a: ['0,5 ppm (1,5 mg/m³)', '5 ppm', '50 ppm', '0,05 ppm'], correct: 0 },
    { q: 'Auf welchen Wert wird die Messzelle des Chlorgaswarngerätes eingestellt?', a: ['Auf den AGW-Wert (0,5 ppm) als Alarmschwelle', 'Auf 100 ppm', 'Auf 0 ppm', 'Auf keinen bestimmten Wert'], correct: 0 },
    { q: 'Welche Bestimmungen gelten für Chlorgasanlagen?', a: ['Störfallverordnung, Unfallverhütungsvorschriften, TRG, TRGS', 'Keine besonderen Bestimmungen', 'Nur interne Regeln', 'Nur Empfehlungen'], correct: 0 },
    { q: 'Welche Sicherheitsbestimmungen gelten für Chlorgas-Lagerräume?', a: ['Belüftung, Gaswarnanlage, Berieselungsanlage, Bodenabfluss, feuerhemmende Tür', 'Keine besonderen Bestimmungen', 'Nur ein Schloss', 'Nur ein Warnschild'], correct: 0 },
    { q: 'Wie hoch ist die stündliche Entnahmemenge aus Chlorgasflaschen?', a: ['Max. ca. 500-700 g/h pro 50-kg-Flasche (um Vereisung zu vermeiden)', '10 kg/h', '50 kg/h', 'Unbegrenzt'], correct: 0 },
    { q: 'Welchen Sinn hat die Berieselungsanlage im Chlorgasraum?', a: ['Bindung von austretendem Chlorgas durch Wasser im Havariefall', 'Nur Kühlung des Raums', 'Nur Reinigung des Bodens', 'Nur Brandschutz'], correct: 0 },
    { q: 'Wie gehen Sie mit vollen Chlorgasflaschen um?', a: ['Aufrecht transportieren, sichern, vor Hitze und Sonneneinstrahlung schützen', 'Beliebig rollen', 'Werfen und stapeln', 'Ohne Vorsichtsmaßnahmen'], correct: 0 },
    { q: 'Wie gehen Sie mit leeren Chlorgasflaschen um?', a: ['Ventil schließen, Schutzkappen aufsetzen, als nicht leer behandeln', 'Einfach entsorgen', 'Ventil offen lassen', 'In den Müll werfen'], correct: 0 },
    { q: 'Was passiert, wenn Natriumhypochlorit mit Säuren in Kontakt kommt?', a: ['Es entsteht giftiges Chlorgas!', 'Nichts passiert', 'Es wird neutral', 'Es entsteht Sauerstoff'], correct: 0 },
    { q: 'Wie kann es zur Rückverflüssigung von Chlorgas kommen?', a: ['Durch Druckerhöhung oder starke Abkühlung in der Leitung', 'Durch Erwärmung', 'Durch Verdünnung', 'Gar nicht möglich'], correct: 0 },
    { q: 'Welche Aussagen lassen sich an der Dampfdruckkurve des Chlors ablesen?', a: ['Zusammenhang zwischen Temperatur und Druck für den Phasenübergang', 'Nur die Farbe des Chlors', 'Nur das Gewicht', 'Keine aussagekräftigen Daten'], correct: 0 },
    { q: 'Wie viel Chlor darf man maximal pro Stunde aus einer 50-kg-Flasche entnehmen?', a: ['Ca. 500-700 g/h', '10 kg/h', '50 kg/h', '1 g/h'], correct: 0 },
    { q: 'In welchem Zustand befindet sich Chlor in der Chlorflasche?', a: ['Flüssig (unter Druck verflüssigt)', 'Gasförmig', 'Fest', 'Als Pulver'], correct: 0 },
    { q: 'In welchem Zustand befindet sich Chlor in der Dosierleitung?', a: ['Gasförmig (nach Expansion durch das Dosiergerät)', 'Flüssig', 'Fest', 'Als Pulver'], correct: 0 },
    { q: 'Was passiert, wenn die Temperatur an der Chlordosierleitung stark sinkt?', a: ['Chlorgas kann rückverflüssigen und die Dosierung unkontrolliert werden', 'Nichts passiert', 'Die Dosierung wird genauer', 'Das Chlor verdampft schneller'], correct: 0 },
    { q: 'Von welchen Einflüssen hängt die Dosiermenge des frei wirksamen Chlors ab?', a: ['Besucherzahl, Wassertemperatur, UV-Strahlung, Verschmutzungsgrad', 'Nur von der Uhrzeit', 'Von nichts', 'Nur vom Wetter'], correct: 0 },
    { q: 'Welche Temperatur sollte im Chlorgas-Lagerraum herrschen?', a: ['Kühl, aber frostfrei (idealerweise unter 40°C)', 'Über 60°C', 'Egal welche Temperatur', 'Unter -20°C'], correct: 0 },
    { q: 'Was ist wichtig beim Wasserablauf/Bodeneinlauf im Chlorgas-Lagerraum?', a: ['Muss vorhanden sein für Berieselungsanlage, darf nicht in Kanalisation führen', 'Nicht nötig', 'Normaler Abfluss reicht', 'Nur im Notfall wichtig'], correct: 0 },
    { q: 'Wie muss die Ausgangstür des Chlorgas-Lagerraums sein?', a: ['Nach außen öffnend, feuerhemmend, von innen ohne Schlüssel zu öffnen', 'Nach innen öffnend', 'Aus Glas', 'Ohne besondere Anforderungen'], correct: 0 },
    // Ozon (Fragen 420-429)
    { q: 'Wie wirkt Ozon als Desinfektionsmittel?', a: ['Sehr starkes Oxidationsmittel, wirkt gegen Bakterien, Viren und Pilze', 'Schwaches Desinfektionsmittel', 'Nur gegen Algen', 'Gar nicht desinfizierend'], correct: 0 },
    { q: 'Wie wird Ozon hergestellt?', a: ['Durch elektrische Entladung (stille Entladung) in Sauerstoff oder Luft', 'Durch Erhitzen von Wasser', 'Durch Mischen von Chemikalien', 'Durch Filtrierung von Luft'], correct: 0 },
    { q: 'Was bedeutet "instabil" bei Ozon?', a: ['Ozon (O₃) zerfällt schnell wieder zu Sauerstoff (O₂)', 'Ozon ist sehr stabil', 'Ozon explodiert leicht', 'Ozon löst sich nicht in Wasser'], correct: 0 },
    { q: 'Welche positiven Begleiterscheinungen hat die Desinfektion mit Ozon?', a: ['Abbau von Chloraminen, Verbesserung von Geruch/Geschmack, Mikroflockung', 'Keine positiven Effekte', 'Nur Chlorproduktion', 'Nur Wassererwärmung'], correct: 0 },
    { q: 'Was sind Hauptbestandteile einer Ozonungsanlage?', a: ['Ozongenerator, Lufttrocknung, Reaktionsbehälter, Restozonvernichter', 'Nur ein Generator', 'Nur ein Tank', 'Nur eine Pumpe'], correct: 0 },
    { q: 'Woraus wird Ozon in Schwimmbädern gewonnen?', a: ['Aus getrockneter Luft oder reinem Sauerstoff', 'Aus Chlorgas', 'Aus Salzsäure', 'Aus Beckenwasser'], correct: 0 },
    { q: 'Warum benötigt man bei Ozonungsanlagen einen Restozonvernichter?', a: ['Ozon darf nicht ins Becken gelangen, da es in hohen Konzentrationen gesundheitsschädlich ist', 'Ozon ist ungefährlich', 'Nur aus wirtschaftlichen Gründen', 'Nur wegen dem Geruch'], correct: 0 },
    { q: 'Womit wird Restozon vernichtet?', a: ['Durch Aktivkohlefilter oder thermische/katalytische Zersetzung', 'Durch Chlorzugabe', 'Durch Erhitzen auf 500°C', 'Durch Einfrieren'], correct: 0 },
    { q: 'Wie erreicht man bei Ozon-Desinfektion die Desinfektionskraft im Becken?', a: ['Nach der Ozonbehandlung wird Chlor als Depotdesinfektionsmittel zugegeben', 'Nur durch Ozon allein', 'Durch UV-Licht', 'Durch Erhöhung der Temperatur'], correct: 0 },
    { q: 'Welche Unfallverhütungsregeln gelten bei Verwendung von Ozon?', a: ['Dichtheitsprüfung, Ozonwarngerät, Lüftung, Schutzausrüstung, Restozonvernichtung', 'Keine besonderen Regeln', 'Nur Fenster öffnen', 'Nur Mundschutz tragen'], correct: 0 },
  ],

  // ===== SCHWIMM- & RETTUNGSLEHRE =====
  swim: [
    { q: 'Was ist der Rautek-Griff?', a: ['Rettungsgriff zum Transport von Personen', 'Schwimmtechnik', 'Sprungfigur', 'Tauchübung'], correct: 0 },
    { q: 'Welches Abzeichen benötigt man für Rettungsschwimmer?', a: ['DLRG Bronze/Silber/Gold', 'Seepferdchen', 'Freischwimmer', 'Totenkopf'], correct: 0 },
    { q: 'Was ist ein Anlandbringen?', a: ['Retten einer Person ans Ufer', 'Sprungübung', 'Tauchgang', 'Schwimmstil'], correct: 0 },
    // Ertrinken
    { q: 'Was ist "trockenes Ertrinken"?', a: ['Stimmritzenkrampf verhindert Wassereintritt in die Lunge', 'Ertrinken ohne Wasser', 'Ertrinken in der Wüste', 'Ertrinken mit Schwimmweste'], correct: 0 },
    { q: 'Was passiert beim "nassen Ertrinken in Süßwasser"?', a: ['Wasser dringt in die Lunge, verdünnt das Blut (Hämolyse)', 'Wasser verdunstet sofort', 'Lunge bleibt trocken', 'Blut wird dicker'], correct: 0 },
    { q: 'Was ist "Beinahe-Ertrinken"?', a: ['Person überlebt mindestens 24 Stunden nach Submersion', 'Ertrinken in flachem Wasser', 'Fast ertrunken aber nie unter Wasser', 'Ertrinken im Traum'], correct: 0 },
    { q: 'Was ist der "Badetod"?', a: ['Plötzlicher Herztod im Wasser (z.B. durch Kälteschock)', 'Tod durch zu langes Baden', 'Tod durch Chlorallergie', 'Tod durch Sonnenbrand'], correct: 0 },
    // Wettkampf
    { q: 'Was muss in einer Wettkampf-Werbeanzeige stehen?', a: ['Datum, Ort und Veranstalter', 'Nur der Preis', 'Nur das Logo', 'Lieblingsspeise des Veranstalters'], correct: 0 },
    { q: 'Welche Informationen müssen in einer Wettkampf-Werbeanzeige stehen? (Mehrere richtig)', a: ['Datum und Uhrzeit', 'Veranstaltungsort', 'Veranstalter/Kontakt', 'Disziplinen/Altersklassen'], correct: [0, 1, 2, 3], multi: true },
    { q: 'Was ist ein Erkennungsmerkmal eines Wettkampfbeckens?', a: ['50m Länge und Wendewände', 'Nur 10m lang', 'Keine Bahnen', 'Wellenanlage'], correct: 0 },
    { q: 'Welche Merkmale hat ein Wettkampfbecken? (Mehrere richtig)', a: ['Normierte Länge (25m/50m)', 'Startblöcke', 'Wendewände', 'Zeitmessanlage'], correct: [0, 1, 2, 3], multi: true },
    { q: 'Was gehört zu den Aufgaben des Wettkampfgerichts?', a: ['Regelüberwachung und Disqualifikation', 'Getränke verkaufen', 'Becken reinigen', 'Tickets kontrollieren'], correct: 0 },
    { q: 'Was sind Aufgaben des Wettkampfgerichts? (Mehrere richtig)', a: ['Startüberwachung', 'Wende-Kontrolle', 'Zieleinlauf bewerten', 'Disqualifikationen aussprechen'], correct: [0, 1, 2, 3], multi: true },
    { q: 'Was ist eine organisatorische Aufgabe am Wettkampftag?', a: ['Zeitmessanlage aufbauen', 'Neue Fliesen verlegen', 'Wasser ablassen', 'Becken neu streichen'], correct: 0 },
    { q: 'Welche organisatorischen Aufgaben fallen am Wettkampftag an? (Mehrere richtig)', a: ['Startlisten erstellen', 'Zeitmessanlage prüfen', 'Sanitätsbereich einrichten', 'Siegerehrung vorbereiten'], correct: [0, 1, 2, 3], multi: true },
    // Disqualifikation Brustschwimmen
    { q: 'Was führt zur Disqualifikation beim Brustschwimmen?', a: ['Delfinbeinschlag (außer nach Start/Wende)', 'Zu schnelles Schwimmen', 'Zu langsames Schwimmen', 'Blaue Badekappe'], correct: 0 },
    { q: 'Welche Fehler führen zur Disqualifikation beim Brustschwimmen? (Mehrere richtig)', a: ['Delfinbeinschlag', 'Wechselschlag', 'Einarmiger Anschlag', 'Nicht gleichzeitiger Anschlag'], correct: [0, 1, 2, 3], multi: true },
    // Training
    { q: 'Was bedeutet "anaerob-laktazid"?', a: ['Energiegewinnung ohne Sauerstoff mit Laktatbildung', 'Mit Sauerstoff', 'Ohne Energie', 'Nur mit Fetten'], correct: 0 },
    { q: 'Was ist die Wiederholungsmethode im Training?', a: ['Intensive Belastung mit vollständiger Erholung', 'Dauerhaftes Schwimmen ohne Pause', 'Nur Dehnen', 'Kein Training'], correct: 0 },
    { q: 'Was ist die Intervallmethode?', a: ['Wechsel von Belastung und unvollständiger Erholung', 'Nur Pausen', 'Dauerlauf ohne Ende', 'Einmaliges Schwimmen'], correct: 0 },
    // Trainingsprinzipien
    { q: 'Was ist ein Trainingsprinzip?', a: ['Progressive Belastungssteigerung', 'Immer gleich trainieren', 'Nie trainieren', 'Nur am Wochenende'], correct: 0 },
    { q: 'Welche Trainingsprinzipien gibt es? (Mehrere richtig)', a: ['Progressive Belastungssteigerung', 'Regelmäßigkeit', 'Individualisierung', 'Variation'], correct: [0, 1, 2, 3], multi: true },
    // Methodische Hilfsmittel
    { q: 'Was ist ein methodisches Hilfsmittel im Schwimmunterricht?', a: ['Schwimmbrett', 'Handtuch', 'Sonnencreme', 'Badelatschen'], correct: 0 },
    { q: 'Welche methodischen Hilfsmittel gibt es? (Mehrere richtig)', a: ['Schwimmbrett', 'Pull-Buoy', 'Flossen', 'Paddles'], correct: [0, 1, 2, 3], multi: true },

    // ===== PRÜFUNGSFACH 1: SCHWIMM- & RETTUNGSLEHRE (272 Fragen) =====

    // --- SCHWIMMTECHNIKEN (Fragen 1-36) ---
    // Frage 1: Gleichzug- und Wechselzug-Schwimmsportart
    { q: 'Welche ist eine Gleichzug-Schwimmsportart?', a: ['Brustschwimmen', 'Kraulschwimmen', 'Rückenkraulen', 'Seitenschwimmen'], correct: 0 },
    { q: 'Welche ist eine Wechselzug-Schwimmsportart?', a: ['Kraulschwimmen', 'Brustschwimmen', 'Schmetterling', 'Delphin'], correct: 0 },
    // Frage 2: Unnatürliche Schwimmtechnik
    { q: 'Welche Schwimmtechnik wird als unnatürlich angesehen?', a: ['Brustschwimmen - wegen der unnatürlichen Grätsche und Kopfhaltung', 'Kraulschwimmen', 'Rückenschwimmen', 'Delphinschwimmen'], correct: 0 },
    // Frage 3: Internationale Wettkampfschwimmtechniken
    { q: 'Welche sind die internationalen Wettkampfschwimmtechniken?', a: ['Kraul, Rücken, Brust, Schmetterling', 'Kraul, Brust, Seiten, Rücken', 'Brust, Rücken, Tauchen, Kraul', 'Freistil, Rücken, Brust, Lagen'], correct: 0 },
    // Frage 4: Zwei Wenden und Unterschiede
    { q: 'Was ist eine Kippwende?', a: ['Wende mit Wandberührung und Drehung um die Querachse', 'Wende ohne Wandberührung', 'Wende nur beim Brustschwimmen', 'Wende mit Salto'], correct: 0 },
    { q: 'Was ist eine Rollwende?', a: ['Schnelle Wende mit Salto ohne Handberührung (Kraul)', 'Langsame Wende mit Handberührung', 'Wende beim Brustschwimmen', 'Wende beim Rückenschwimmen mit Stop'], correct: 0 },
    // Frage 5: Vortrieb beim Brustschwimmen
    { q: 'Wodurch erfolgt der Vortrieb beim Brustschwimmen?', a: ['Hauptsächlich durch den Beinschlag (ca. 70%)', 'Nur durch den Armzug', 'Durch die Kopfbewegung', 'Durch die Wasserlage'], correct: 0 },
    // Frage 6: Zeitpunkt Einatmung Brustschwimmen
    { q: 'Zu welchem Zeitpunkt wird beim Brustschwimmen eingeatmet?', a: ['Während der Armzug-Druckphase, wenn Kopf über Wasser ist', 'Unter Wasser', 'Beim Beinschlag', 'In der Gleitphase'], correct: 0 },
    // Frage 7a: Schwunggrätsche Bewegungsmerkmale
    { q: 'Was ist ein Merkmal der Schwunggrätsche beim Brustschwimmen?', a: ['Schnelles, peitschenartiges Schließen der Beine', 'Langsames Öffnen der Beine', 'Kreisende Bewegung', 'Wechselseitiger Beinschlag'], correct: 0 },
    // Frage 7b: Stoßgrätsche Bewegungsmerkmale
    { q: 'Was ist ein Merkmal der Stoßgrätsche beim Brustschwimmen?', a: ['Kraftvolles Abstoßen mit den Fußsohlen nach hinten', 'Schnelles Schließen ohne Druck', 'Delphinartige Bewegung', 'Wechselseitiger Beinschlag'], correct: 0 },
    // Frage 8: Vor- und Nachteile Brustschwimmtechnik
    { q: 'Was ist ein Vorteil der Brustschwimmtechnik?', a: ['Gute Orientierung, da Kopf über Wasser', 'Höchste Geschwindigkeit aller Schwimmarten', 'Geringster Energieverbrauch', 'Einfachste Atemtechnik'], correct: 0 },
    { q: 'Was ist ein Nachteil der Brustschwimmtechnik?', a: ['Langsamer als Kraul- und Delphin, hoher Wasserwiderstand', 'Schlechte Orientierung', 'Zu schnell', 'Zu einfach zu erlernen'], correct: 0 },
    // Frage 9: Bewegungsablauf Schwunggrätsche
    { q: 'Was ist der erste Schritt bei der Schwunggrätsche?', a: ['Anfersen - Fersen zum Gesäß ziehen', 'Beine strecken', 'Füße nach außen drehen', 'Beine schnell schließen'], correct: 0 },
    // Frage 10: Anschlag beim Brustschwimmen
    { q: 'Wie muss man beim Brustschwimmen anschlagen?', a: ['Mit beiden Händen gleichzeitig auf gleicher Höhe', 'Mit einer Hand', 'Mit dem Kopf', 'Mit den Füßen'], correct: 0 },
    { q: 'Warum ist der beidhändige Anschlag beim Brustschwimmen Pflicht?', a: ['Wettkampfregel zur fairen Zeitmessung', 'Ist leichter', 'Für mehr Geschwindigkeit', 'Ist sicherer'], correct: 0 },
    // Frage 11: Übungsmöglichkeiten Kraulbeinschlag
    { q: 'Welche Übung eignet sich für den Kraulbeinschlag?', a: ['Beinschlag mit Brett in Vorhalte', 'Nur Armzug üben', 'Brustschwimmen', 'Tauchen'], correct: 0 },
    // Frage 12: Übungsmöglichkeiten Brustbeinschlag
    { q: 'Welche Übung eignet sich für den Brustbeinschlag?', a: ['Beinschlag am Beckenrand oder mit Brett', 'Kraulbeinschlag üben', 'Delphinschwimmen', 'Nur Armzug'], correct: 0 },
    // Frage 13: Übungsmöglichkeiten Delphinbeinschlag
    { q: 'Welche Übung eignet sich für den Delphinbeinschlag?', a: ['Wellenbewegung in Bauchlage mit Brett', 'Brustbeinschlag', 'Scherenschlag', 'Wechselbeinschlag'], correct: 0 },
    // Frage 14: Übungsmöglichkeiten Rückenkraulbeinschlag
    { q: 'Welche Übung eignet sich für den Rückenkraulbeinschlag?', a: ['Beinschlag in Rückenlage mit Brett auf Oberschenkeln', 'Brustschwimmen', 'Tauchen', 'Wasserball spielen'], correct: 0 },
    // Frage 15: Übungsmöglichkeiten Kraularmzug
    { q: 'Welche Übung eignet sich für den Kraularmzug?', a: ['Einarmkraul mit Brett oder Pull-Buoy', 'Nur Beinschlag', 'Rückenschwimmen', 'Brustschwimmen'], correct: 0 },
    // Frage 16: Übungsmöglichkeiten Brustarmzug
    { q: 'Welche Übung eignet sich für den Brustarmzug?', a: ['Armzug im Stehen oder mit Pull-Buoy', 'Kraularmzug', 'Delphinschwimmen', 'Tauchen'], correct: 0 },
    // Frage 17: Übungsmöglichkeiten Delphinarmzug
    { q: 'Welche Übung eignet sich für den Delphinarmzug?', a: ['Einarmiger Delphinzug mit Brett', 'Brustarmzug', 'Kraularmzug', 'Rückenarmzug'], correct: 0 },
    // Frage 18: Übungsmöglichkeiten Rückenkraularmzug
    { q: 'Welche Übung eignet sich für den Rückenkraularmzug?', a: ['Einarmrücken mit gestrecktem Arm vor dem Körper', 'Brustarmzug', 'Kraularmzug', 'Delphinarmzug'], correct: 0 },
    // Frage 19: Übungsmöglichkeiten Koordination Kraulschwimmen
    { q: 'Was übt man bei der Koordination im Kraulschwimmen?', a: ['Abstimmung von Armzug, Beinschlag und Atmung', 'Nur den Beinschlag', 'Nur den Armzug', 'Nur die Atmung'], correct: 0 },
    // Frage 20: Übungsmöglichkeiten Koordination Brustschwimmen
    { q: 'Was ist wichtig bei der Koordination im Brustschwimmen?', a: ['Timing: Armzug - Atmung - Beinschlag - Gleitphase', 'Gleichzeitig Arme und Beine bewegen', 'Nur schnell schwimmen', 'Unter Wasser atmen'], correct: 0 },
    // Frage 21: Übungsmöglichkeiten Koordination Delphinschwimmen
    { q: 'Was ist typisch für die Koordination beim Delphinschwimmen?', a: ['Zwei Beinschläge pro Armzyklus', 'Ein Beinschlag pro Armzyklus', 'Drei Beinschläge pro Armzyklus', 'Kein festes Schema'], correct: 0 },
    // Frage 22: Übungsmöglichkeiten Koordination Rückenkraulschwimmen
    { q: 'Was ist wichtig bei der Koordination beim Rückenkraulen?', a: ['Kontinuierlicher Beinschlag und wechselseitiger Armzug', 'Gleichzeitiger Armzug', 'Brustschwimmbeinschlag', 'Delphinbeinschlag'], correct: 0 },
    // Frage 23: Wendetechniken Kraulschwimmen
    { q: 'Welche Wendetechnik wird beim Kraulschwimmen eingesetzt?', a: ['Rollwende (Salto vorwärts ohne Handberührung)', 'Kippwende mit Handberührung', 'Brustwende', 'Keine Wende nötig'], correct: 0 },
    // Frage 24: Startmöglichkeiten Kraulschwimmen
    { q: 'Welche Startmöglichkeit gibt es beim Kraulschwimmen?', a: ['Startsprung vom Block (Schrittstellung oder Parallelstand)', 'Start im Wasser', 'Rückwärtsstart', 'Kopfsprung ohne Block'], correct: 0 },
    // Frage 25: Wendemöglichkeiten Kraulschwimmen
    { q: 'Was passiert nach der Rollwende beim Kraulschwimmen?', a: ['Abstoß in Seitenlage, Drehung während Gleitphase', 'Sofort weiterschwimmen', 'Brustschwimmen', 'Tauchen'], correct: 0 },
    // Frage 26: Typische Fehler Kraularmzug und Korrektur
    { q: 'Was ist ein typischer Fehler beim Kraularmzug?', a: ['Gestreckter Arm beim Durchzug (wenig Vortrieb)', 'Zu viel Ellbogenbeugung', 'Zu schneller Armzug', 'Zu langsamer Armzug'], correct: 0 },
    // Frage 27: Warum Rückenschwimmen als Erstschwimmart
    { q: 'Warum kann Rückenschwimmen als Erstschwimmart gelehrt werden?', a: ['Freie Atmung, da Gesicht über Wasser', 'Weil es am schnellsten ist', 'Weil es am einfachsten aussieht', 'Weil alle es können'], correct: 0 },
    // Frage 28: Armzugphasen Rückenschwimmen
    { q: 'Welche Phase gehört zum Armzug beim Rückenschwimmen?', a: ['Eintauchen - Zug - Druck - Herausnehmen - Schwung', 'Nur Ziehen', 'Nur Drücken', 'Kreisen'], correct: 0 },
    // Frage 29: Armzugphasen Brustschwimmen
    { q: 'Welche Phase gehört zum Armzug beim Brustschwimmen?', a: ['Ausschwung - Zug - Druck - Vorschwung', 'Nur Ziehen', 'Nur Kreisen', 'Wechselseitiges Ziehen'], correct: 0 },
    // Frage 30: Armzugphasen Kraulschwimmen
    { q: 'Welche Phase gehört zum Armzug beim Kraulschwimmen?', a: ['Eintauchen - Strecken - Zug - Druck - Rückholphase', 'Nur Kreisen', 'Gleichzeitiges Ziehen', 'Nur Drücken'], correct: 0 },
    // Frage 31: Armzugphasen Delphinschwimmen
    { q: 'Welche Phase gehört zum Armzug beim Delphinschwimmen?', a: ['Eintauchen - Fassen - Zug - Druck - Rückführen', 'Wechselseitiges Ziehen', 'Nur Kreisen', 'Brustarmzug'], correct: 0 },
    // Frage 32: Unterschiede Kraul- und Rückenkraulbeinschlag
    { q: 'Was ist ein Unterschied zwischen Kraul- und Rückenkraulbeinschlag?', a: ['Beim Rücken beginnt Aufwärtsschlag aus Hüfte, beim Kraul Abwärtsschlag', 'Kein Unterschied', 'Verschiedene Frequenz', 'Anderer Rhythmus'], correct: 0 },
    // Frage 33: Schmetterling Armzugphasen und Beinschlag
    { q: 'Wann erfolgt der erste Beinschlag beim Schmetterlingsschwimmen?', a: ['Beim Eintauchen der Hände', 'Beim Herausheben der Arme', 'In der Gleitphase', 'Es gibt nur einen Beinschlag'], correct: 0 },
    { q: 'Wann erfolgt der zweite Beinschlag beim Schmetterlingsschwimmen?', a: ['Während der Druckphase der Arme', 'Beim Eintauchen', 'Gibt es nicht', 'Nach dem Atmen'], correct: 0 },
    // Fragen 34-36: Sprünge
    // Frage 34: Phasen eines Sprunges vom 1m-Brett
    { q: 'Was ist die erste Phase eines Sprunges vom Brett?', a: ['Anlauf', 'Absprung', 'Flugphase', 'Eintauchen'], correct: 0 },
    { q: 'Welche Phasen hat ein Sprung vom 1m-Brett?', a: ['Anlauf - Absprung - Flug - Eintauchen', 'Nur Absprung und Eintauchen', 'Anlauf und Flug', 'Springen und Schwimmen'], correct: 0 },
    // Frage 35: Kopfsprungarten Turm- und Brettspringen
    { q: 'Was ist ein Kopfsprung vorwärts?', a: ['Sprung mit gestrecktem Körper, Hände voran eintauchen', 'Rückwärts springen', 'Seitwärts springen', 'Bombensprung'], correct: 0 },
    // Frage 36: Ausführungsarten Kopfsprung
    { q: 'Welche Ausführungsart gibt es beim Kopfsprung?', a: ['Gehockt, gehechtet, gestreckt', 'Nur gestreckt', 'Nur gehockt', 'Nur gebückt'], correct: 0 },

    // --- TAUCHEN UND SICHERHEIT (Fragen 37-48) ---
    // Frage 37: Sicherheitsaspekte Streckentauchen
    { q: 'Was ist beim Streckentauchen zu beachten?', a: ['Niemals alleine, Aufsicht erforderlich, Hyperventilation vermeiden', 'Möglichst lange unter Wasser bleiben', 'Vorher hyperventilieren', 'Ohne Aufsicht tauchen'], correct: 0 },
    // Frage 38: Sicherheitsaspekte Tieftauchen
    { q: 'Was ist beim Tieftauchen zu beachten?', a: ['Druckausgleich durchführen, Tauchtiefe begrenzen', 'Möglichst schnell abtauchen', 'Ohne Druckausgleich tauchen', 'Alleine tauchen'], correct: 0 },
    // Frage 39: Druckausgleich beim Tieftauchen
    { q: 'Wie erreicht man Druckausgleich beim Tieftauchen?', a: ['Nase zuhalten und vorsichtig gegen verschlossene Nase ausatmen', 'Mund öffnen', 'Luft anhalten', 'Tiefer tauchen'], correct: 0 },
    // Frage 40: Unterschied Tauchzug vom Brustarmzug
    { q: 'Worin unterscheidet sich der Tauchzug vom Brustarmzug?', a: ['Arme werden bis zur Hüfte durchgezogen', 'Arme bleiben vor der Brust', 'Schnellerer Armzug', 'Langsamerer Armzug'], correct: 0 },
    // Frage 41: Tauchzug beschreiben
    { q: 'Wie wird der Tauchzug ausgeführt?', a: ['Arme strecken - weit ausschwingen - kräftig zur Hüfte ziehen', 'Nur kleine Bewegungen', 'Wie beim Kraulschwimmen', 'Nur mit einem Arm'], correct: 0 },
    // Frage 42: Druck in 10m Wassertiefe
    { q: 'Welcher Druck herrscht in 10m Wassertiefe?', a: ['Etwa 2 bar (Atmosphärendruck + 1 bar pro 10m)', 'Etwa 1 bar', 'Etwa 5 bar', 'Etwa 10 bar'], correct: 0 },
    // Frage 42a: Warum Kopf- und Fußwärtstauchen beherrschen
    { q: 'Warum muss ein Rettungsschwimmer Kopf- und Fußwärtstauchen beherrschen?', a: ['Um in verschiedenen Situationen schnell abtauchen zu können', 'Nur für Wettkämpfe', 'Ist nicht notwendig', 'Für die Optik'], correct: 0 },
    // Frage 43: Unterschied Ertrinken und Beinahe-Ertrinken
    { q: 'Was ist der Unterschied zwischen Ertrinken und Beinahe-Ertrinken?', a: ['Ertrinken = Tod innerhalb 24h, Beinahe-Ertrinken = Überleben > 24h', 'Kein Unterschied', 'Zeit unter Wasser', 'Wassertemperatur'], correct: 0 },
    // Frage 44: Schwimmbad-Blackout
    { q: 'Was ist ein Schwimmbad-Blackout?', a: ['Bewusstlosigkeit durch Sauerstoffmangel nach Hyperventilation', 'Stromausfall im Schwimmbad', 'Wassertrübung', 'Defekte Beleuchtung'], correct: 0 },
    // Frage 45: Allgemeine Baderegeln
    { q: 'Welche allgemeine Baderegel gibt es?', a: ['Vor dem Baden duschen, nicht mit vollem Magen schwimmen', 'Immer alleine schwimmen', 'Direkt nach dem Essen schwimmen', 'Ohne Aufsicht ins Wasser'], correct: 0 },
    // Frage 46: Begriff Freistilschwimmen
    { q: 'Was bedeutet Freistilschwimmen?', a: ['Jede Schwimmart erlaubt, meist Kraul wegen Geschwindigkeit', 'Nur Brustschwimmen', 'Nur Rückenschwimmen', 'Ohne Technik schwimmen'], correct: 0 },
    // Frage 47: Internationale Reihenfolge der Stilarten
    { q: 'Was ist die Reihenfolge der Stilarten beim Lagenschwimmen (Einzel)?', a: ['Schmetterling - Rücken - Brust - Freistil', 'Freistil - Rücken - Brust - Schmetterling', 'Brust - Rücken - Schmetterling - Freistil', 'Rücken - Brust - Freistil - Schmetterling'], correct: 0 },
    { q: 'Was ist die Reihenfolge bei der Lagenstaffel?', a: ['Rücken - Brust - Schmetterling - Freistil', 'Schmetterling - Rücken - Brust - Freistil', 'Freistil - Brust - Rücken - Schmetterling', 'Brust - Schmetterling - Rücken - Freistil'], correct: 0 },
    // Frage 48: Startkommando internationale Wettkämpfe
    { q: 'Wie lautet das Startkommando bei internationalen Wettkämpfen?', a: ['Take your marks - Startsignal (Pfiff/Hupton)', 'Auf die Plätze - Fertig - Los', 'Ready - Set - Go', 'Achtung - Start'], correct: 0 },

    // --- TRAINING UND DIDAKTIK (Fragen 49-76) ---
    // Frage 49: Intervalltraining
    { q: 'Was ist Intervalltraining?', a: ['Wechsel zwischen Belastungs- und Erholungsphasen', 'Dauerhaftes Schwimmen ohne Pause', 'Nur Techniktraining', 'Nur Krafttraining'], correct: 0 },
    // Frage 50: Extensives vs. intensives Intervalltraining
    { q: 'Was ist der Unterschied zwischen extensivem und intensivem Intervalltraining?', a: ['Extensiv: längere Strecken, niedrigere Intensität; Intensiv: kürzere Strecken, höhere Intensität', 'Kein Unterschied', 'Nur die Dauer', 'Nur die Pausen'], correct: 0 },
    // Frage 51: Kriterien Trainingseinheit
    { q: 'Welche Kriterien gelten für eine Trainingseinheit?', a: ['Aufwärmen - Hauptteil - Abwärmen/Cool-down', 'Nur Hauptteil', 'Nur Aufwärmen', 'Keine feste Struktur'], correct: 0 },
    // Frage 52: Konditionsgymnastik im Wasser
    { q: 'Was versteht man unter Konditionsgymnastik im Wasser?', a: ['Aqua-Fitness zur Verbesserung von Ausdauer, Kraft und Beweglichkeit', 'Nur Schwimmen', 'Trockenübungen', 'Nur Dehnen'], correct: 0 },
    // Frage 53: Verschiedene Wasserwiderstände
    { q: 'Welche Art von Wasserwiderstand gibt es?', a: ['Formwiderstand, Reibungswiderstand, Wellenwiderstand', 'Nur Formwiderstand', 'Kein Widerstand im Wasser', 'Nur Luftwiderstand'], correct: 0 },
    // Frage 54: Hydrostatischer Druck und Atmung
    { q: 'Welchen Einfluss hat der hydrostatische Druck auf die Atmung?', a: ['Einatmung wird erschwert, Ausatmung erleichtert', 'Kein Einfluss', 'Atmung wird leichter', 'Nur Ausatmung wird erschwert'], correct: 0 },
    // Frage 55: Trainingsplan allgemeine Kondition
    { q: 'Was sollte ein Trainingsplan zur Verbesserung der allgemeinen Kondition beinhalten?', a: ['Ausdauer, Kraft, Schnelligkeit, Beweglichkeit, Koordination', 'Nur Ausdauer', 'Nur Kraft', 'Nur Technik'], correct: 0 },
    // Frage 56: Trainingsplan schwimmerische Kondition
    { q: 'Was beinhaltet ein Trainingsplan für schwimmerische Kondition?', a: ['Schwimmspezifische Ausdauer, Techniktraining, Schnelligkeitstraining', 'Nur Laufen', 'Nur Krafttraining an Land', 'Nur Dehnen'], correct: 0 },
    // Frage 57: Begriffe Ausdauer und Kondition
    { q: 'Was ist der Unterschied zwischen Ausdauer und Kondition?', a: ['Ausdauer = Ermüdungswiderstand; Kondition = Summe aller körperlichen Leistungsfaktoren', 'Kein Unterschied', 'Ausdauer ist wichtiger', 'Kondition ist nur Kraft'], correct: 0 },
    // Frage 58: Pulsmessung als Trainingseffektivität
    { q: 'Wie nutzt man die Pulsmessung zur Kontrolle der Trainingseffektivität?', a: ['Vergleich von Belastungs- und Erholungspuls', 'Nur einmal messen', 'Ist nicht relevant', 'Nur vor dem Training'], correct: 0 },
    // Frage 59: Aerobes vs. anaerobes Training
    { q: 'Was ist der Unterschied zwischen aerobem und anaerobem Training?', a: ['Aerob: mit Sauerstoff, niedrige Intensität; Anaerob: ohne ausreichend Sauerstoff, hohe Intensität', 'Kein Unterschied', 'Aerob ist schneller', 'Anaerob ist langsamer'], correct: 0 },
    // Frage 60: Statisches vs. dynamisches Krafttraining
    { q: 'Was ist der Unterschied zwischen statischem und dynamischem Krafttraining?', a: ['Statisch: ohne Bewegung (Haltearbeit); Dynamisch: mit Bewegung', 'Kein Unterschied', 'Statisch ist schwerer', 'Dynamisch ist leichter'], correct: 0 },
    // Frage 61: Gesundheitliche Vorteile Schwimmen
    { q: 'Welche gesundheitlichen Vorteile hat Schwimmen?', a: ['Gelenkschonend, trainiert Herz-Kreislauf, verbessert Ausdauer', 'Keine Vorteile', 'Nur für Profis geeignet', 'Belastet die Gelenke'], correct: 0 },
    // Frage 62: Begriffe Didaktik und Methodik
    { q: 'Was ist der Unterschied zwischen Didaktik und Methodik?', a: ['Didaktik = Was wird gelehrt; Methodik = Wie wird gelehrt', 'Kein Unterschied', 'Didaktik ist Praxis', 'Methodik ist Theorie'], correct: 0 },
    // Frage 63: Methodische Übungsreihe
    { q: 'Was ist eine methodische Übungsreihe?', a: ['Aufeinander aufbauende Übungen vom Leichten zum Schweren', 'Zufällige Übungsabfolge', 'Nur eine Übung', 'Immer die gleiche Übung'], correct: 0 },
    // Frage 64: Drei methodische Prinzipien
    { q: 'Welches ist ein methodisches Prinzip?', a: ['Vom Bekannten zum Unbekannten', 'Vom Schweren zum Leichten', 'Vom Schnellen zum Langsamen', 'Ohne Struktur lehren'], correct: 0 },
    // Frage 65: Methodische Prinzipien - Bekanntes zu Unbekanntem, Anschaulichkeit
    { q: 'Was bedeutet das Prinzip der Anschaulichkeit?', a: ['Vormachen, Bilder und Demonstrationen nutzen', 'Nur theoretisch erklären', 'Ohne Vorzeigen', 'Nur schriftlich erklären'], correct: 0 },
    // Frage 66: Methodische Prinzipien - Leichtes zu Schwerem, Fasslichkeit
    { q: 'Was bedeutet das Prinzip der Fasslichkeit?', a: ['Altersgerechte und verständliche Vermittlung', 'Möglichst kompliziert erklären', 'Nur für Erwachsene', 'Ohne Anpassung'], correct: 0 },
    // Frage 67: Hilfsmittel und Geräte in der Schwimmausbildung
    { q: 'Welche Hilfsmittel werden in der Schwimmausbildung eingesetzt?', a: ['Schwimmbretter, Pull-Buoys, Flossen, Poolnudeln', 'Nur Badehose', 'Keine Hilfsmittel', 'Nur Taucherbrillen'], correct: 0 },
    // Frage 68: Merkmale Angstverhalten Schwimmanfänger
    { q: 'Welche Merkmale zeigt Angstverhalten bei Schwimmanfängern?', a: ['Verkrampfung, Festklammern, Weinen, Verweigerung', 'Freude und Entspannung', 'Schnelles Lernen', 'Keine Anzeichen'], correct: 0 },
    // Frage 69: Ursachen Angstverhalten Schwimmanfänger
    { q: 'Was kann Angst bei Schwimmanfängern verursachen?', a: ['Negative Vorerfahrungen, Unsicherheit im Wasser, fremde Umgebung', 'Zu viel Spaß', 'Zu warmes Wasser', 'Zu viele Hilfsmittel'], correct: 0 },
    // Frage 70: Angstüberwindung bei Schwimmanfängern
    { q: 'Wie kann der Kursleiter bei der Angstüberwindung helfen?', a: ['Vertrauen aufbauen, kleine Schritte, spielerische Gewöhnung', 'Kind ins Wasser werfen', 'Angst ignorieren', 'Sofort Schwimmen verlangen'], correct: 0 },
    // Frage 71: Organisation und Planung Schwimmkurse
    { q: 'Worauf muss bei der Organisation von Schwimmkursen geachtet werden?', a: ['Gruppengröße, Wassertiefe, Qualifikation Kursleiter, Hilfsmittel', 'Nur auf die Uhrzeit', 'Nur auf den Preis', 'Auf nichts Besonderes'], correct: 0 },
    // Frage 72: Durchführung Schwimmkurse
    { q: 'Worauf muss bei der Durchführung von Schwimmkursen geachtet werden?', a: ['Sicherheit, methodischer Aufbau, individuelle Betreuung', 'Nur schnell durchführen', 'Möglichst viele Teilnehmer', 'Keine Struktur nötig'], correct: 0 },
    // Frage 73: Animationsprogramme im Wasser
    { q: 'Was sind Animationsprogramme im Wasser?', a: ['Spielerische Aktivitäten wie Aqua-Fitness, Wassergymnastik, Wasserspiele', 'Nur Schwimmunterricht', 'Nur Wettkämpfe', 'Nur Rettungsschwimmen'], correct: 0 },
    // Frage 74: Attraktive Gestaltung Hydro-Power-Einheit
    { q: 'Wie gestaltet man eine Hydro-Power-Einheit attraktiv?', a: ['Motivierende Musik, abwechslungsreiche Übungen, verschiedene Intensitäten', 'Immer gleiche Übungen', 'Ohne Musik', 'Nur für Profis'], correct: 0 },
    // Frage 75: Bedeutung Spiele Wassergewöhnungskurs
    { q: 'Welche Bedeutung haben Spiele in einem Wassergewöhnungskurs?', a: ['Angstabbau, Motivation, spielerisches Lernen der Grundfertigkeiten', 'Keine Bedeutung', 'Nur Zeitvertreib', 'Nur für Fortgeschrittene'], correct: 0 },
    // Frage 76: Begriffe Aqua-Fitness und Aqua-Jogging
    { q: 'Was ist Aqua-Fitness?', a: ['Ganzkörpertraining im flachen Wasser mit Musik', 'Nur Schwimmen', 'Tauchen', 'Wasserball'], correct: 0 },
    { q: 'Was ist Aqua-Jogging?', a: ['Laufbewegung im tiefen Wasser mit Auftriebsgürtel', 'Normales Joggen', 'Schwimmen', 'Tauchen'], correct: 0 },

    // --- RETTUNGSSCHWIMMEN (Fragen 77-95) ---
    // Frage 77: Wer ist Rettungsschwimmer
    { q: 'Was ist ein Rettungsschwimmer?', a: ['Person mit gültigem Rettungsschwimmabzeichen (mind. Bronze)', 'Jeder der schwimmen kann', 'Nur DLRG-Mitglieder', 'Nur Bademeister'], correct: 0 },
    // Frage 78: Anforderungen Rettungsschwimmer öffentliche Bäder
    { q: 'Welche Anforderungen muss ein Rettungsschwimmer für öffentliche Bäder erfüllen?', a: ['Gültiges Rettungsschwimmabzeichen Silber, Erste-Hilfe-Kurs, regelmäßige Auffrischung', 'Nur Seepferdchen', 'Keine besonderen Anforderungen', 'Nur Schwimmabzeichen Gold'], correct: 0 },
    // Frage 79: Einsatz von Rettungsschwimmern
    { q: 'Wann ist der Einsatz von Rettungsschwimmern für die Wasseraufsicht ausreichend?', a: ['Bei Betriebssicherheit durch Fachkraft oder unterbesetztem ES', 'Immer ausreichend', 'Nie ausreichend', 'Nur nachts'], correct: 0 },
    // Frage 80: Befreiungsgriffe
    { q: 'Welche Befreiungsgriffe gibt es?', a: ['Kopf-Nacken-Befreiung, Hals-Umklammerung-Lösen, Handgelenk-Befreiung', 'Keine Befreiungsgriffe', 'Nur Schlagen', 'Nur Wegtauchen'], correct: 0 },
    // Frage 81: Techniken Opfer an Land bringen
    { q: 'Welche Technik gibt es, um ein Opfer an Land zu bringen?', a: ['Rautek-Griff, Schultertragegriff, Seemannsgriff', 'Opfer selbst laufen lassen', 'Nur Ziehen', 'Nur Schieben'], correct: 0 },
    // Frage 82: Rettungstransport im Wasser
    { q: 'Wie kann ein Retter ein Opfer im Wasser bewegen?', a: ['Schleppen (z.B. Kopfschleppgriff) oder Schieben/Ziehen', 'Opfer selbst schwimmen lassen', 'Unter Wasser ziehen', 'Auf dem Rücken des Retters'], correct: 0 },
    // Frage 83: Schleppgriffe
    { q: 'Welche Schleppgriffe gibt es?', a: ['Kopfschleppgriff, Achselschleppgriff, Standard-Fesselschleppgriff', 'Nur einen Griff', 'Keine standardisierten Griffe', 'Nur den Kopfschleppgriff'], correct: 0 },
    // Frage 84: Schleppen vs. Schieben
    { q: 'Was ist der Unterschied zwischen Schleppen und Schieben beim Rettungsschwimmen?', a: ['Schleppen: Retter zieht das Opfer; Schieben: Retter schiebt das Opfer vor sich her', 'Kein Unterschied', 'Schleppen ist nur an Land', 'Schieben ist nur im Flachwasser'], correct: 0 },
    // Frage 85a: Wann Kopf-/Achselschleppgriff
    { q: 'Wann wendet man den Kopf- oder Achselschleppgriff an?', a: ['Bei bewusstlosen oder nicht kooperativen Opfern', 'Nur bei erschöpften wachen Opfern', 'Immer', 'Nie'], correct: 0 },
    // Frage 85b: Wann Standard-Fesselschleppgriff
    { q: 'Wann wendet man den Standard-Fesselschleppgriff an?', a: ['Bei panischen oder sich wehrenden Opfern (Selbstschutz)', 'Nur bei Bewusstlosen', 'Nur bei kooperativen Opfern', 'Nur an Land'], correct: 0 },
    // Frage 85c: Wichtigste Regel beim Rettungsschwimmen
    { q: 'Was ist die wichtigste Regel beim Rettungsschwimmen?', a: ['Eigenschutz geht vor - nie selbst in Gefahr bringen', 'Möglichst schnell ins Wasser springen', 'Immer alleine retten', 'Opfer sofort untertauchen'], correct: 0 },
    // Frage 86: Bedeutung Kleiderschwimmen
    { q: 'Warum ist Kleiderschwimmen in der Rettungsschwimmausbildung wichtig?', a: ['Simulation realistischer Rettungssituationen, da man oft bekleidet retten muss', 'Nur für Wettkämpfe', 'Hat keine Bedeutung', 'Nur zur Unterhaltung'], correct: 0 },
    // Frage 87: Lagerung nach Wiederbelebung
    { q: 'Wie wird eine Person nach erfolgreicher Wiederbelebung gelagert?', a: ['Stabile Seitenlage bei vorhandener Atmung', 'Auf dem Bauch', 'Sitzend', 'Kopfüber'], correct: 0 },
    // Frage 88: Arten von Rettungsgeräten
    { q: 'Welche Arten von Rettungsgeräten gibt es?', a: ['Rettungsring, Rettungsstange, Rettungsball, Rettungsbrett, Rettungsleine', 'Nur Rettungsring', 'Nur Schwimmbrett', 'Keine speziellen Geräte'], correct: 0 },
    // Frage 89: Rettungsgeräte Hallenbad (Berufsgenossenschaft)
    { q: 'Welche Rettungsgeräte müssen laut Berufsgenossenschaft in einem Hallenbad vorhanden sein?', a: ['Rettungsstange, Rettungsring mit Leine, Erste-Hilfe-Material', 'Nur Rettungsring', 'Keine Pflicht', 'Nur Erste-Hilfe-Koffer'], correct: 0 },
    // Frage 90: Rettungsgeräte Badesee
    { q: 'Über welche Rettungsgeräte sollte ein Badesee verfügen?', a: ['Rettungsboot, Rettungsringe, Rettungsleinen, Kommunikationsmittel', 'Nur Rettungsringe', 'Keine speziellen Geräte', 'Nur Telefon'], correct: 0 },
    // Frage 91: Mindestausstattung Erste-Hilfe-Raum
    { q: 'Welche Mindestausstattung muss ein Erste-Hilfe-Raum haben?', a: ['Liege, Erste-Hilfe-Material, Beatmungsbeutel, AED, Decken, Waschgelegenheit', 'Nur Pflaster', 'Nur Liege', 'Keine Vorgaben'], correct: 0 },
    // Frage 92: Eisrettung
    { q: 'Wie führt man eine Eisrettung durch?', a: ['Flach auf das Eis legen, Hilfsmittel reichen, nie direkt zur Person gehen', 'Aufrecht zum Opfer gehen', 'Ins Wasser springen', 'Auf das Eis springen'], correct: 0 },
    // Frage 93: Fremdkörper/Blockade der Luftwege
    { q: 'Bei welchem Zustand muss man mit Fremdkörpern in den Luftwegen rechnen?', a: ['Bewusstlosigkeit mit röchelnder oder fehlender Atmung', 'Nur bei Kindern', 'Nur beim Essen', 'Nie im Schwimmbad'], correct: 0 },
    // Frage 94: Insektenstich Mund-/Rachenraum
    { q: 'Welche Maßnahmen ergreifen Sie bei einem Insektenstich im Mund-/Rachenraum?', a: ['Eis lutschen/kühlen, Notruf, bei Atemnot Atemwege freihalten', 'Abwarten', 'Warme Getränke geben', 'Nichts tun'], correct: 0 },
    // Frage 95: Beatmung bei Chlorgaseinatmung
    { q: 'Mit welchen Hilfsmitteln kann man beatmen, wenn Chlorgas eingeatmet wurde?', a: ['Beatmungsbeutel mit Filter/Maske, keine Mund-zu-Mund-Beatmung wegen Eigenschutz', 'Mund-zu-Mund ist sicher', 'Keine Beatmung nötig', 'Normale Mund-zu-Mund-Beatmung'], correct: 0 }
  ],

  // ===== ERSTE HILFE =====
  first: [
    { q: 'Was ist die stabile Seitenlage?', a: ['Lagerung bewusstloser, atmender Personen', 'Schwimmposition', 'Erste-Hilfe-Tasche', 'Rettungsgriff'], correct: 0 },
    { q: 'Wie oft drückt man bei einer Herzdruckmassage pro Minute?', a: ['100-120 mal', '60 mal', '200 mal', '30 mal'], correct: 0 },
    { q: 'Was ist ein Defibrillator?', a: ['Gerät zur Herzrhythmus-Wiederherstellung', 'Beatmungsgerät', 'Blutdruckmesser', 'Thermometer'], correct: 0 },
    // Lagerungsarten
    { q: 'Wie wird eine Person mit Sonnenstich gelagert?', a: ['Oberkörper erhöht, Kopf kühlen', 'Flach auf dem Bauch', 'Kopfüber', 'In der Sonne'], correct: 0 },
    { q: 'Wie wird eine Person mit Herzinfarkt gelagert?', a: ['Oberkörper erhöht (Herz entlasten)', 'Kopfüber', 'Flach auf dem Bauch', 'Stehend'], correct: 0 },
    { q: 'Wie wird eine Person mit Hitzeerschöpfung gelagert?', a: ['Flach lagern, Beine hoch, kühlen', 'Oberkörper hoch', 'In der Sonne', 'Kopfüber'], correct: 0 },
    { q: 'Wie wird eine Person mit Volumenmangelschock gelagert?', a: ['Schocklage: Beine hoch', 'Oberkörper hoch', 'Sitzend', 'Kopfüber'], correct: 0 },
    { q: 'Wie wird eine Person mit Hitzschlag gelagert?', a: ['Flach lagern, schnell kühlen, Notruf!', 'In der Sonne lassen', 'Warm einpacken', 'Heißen Tee geben'], correct: 0 },
    { q: 'Wie wird eine Person mit Schlaganfall gelagert?', a: ['Oberkörper erhöht (30°), beengende Kleidung öffnen', 'Flach auf dem Bauch', 'Kopfüber', 'Stehend'], correct: 0 },
    // Verbandsbuch
    { q: 'Was muss im Verbandsbuch eingetragen werden?', a: ['Name des Verletzten und Art der Verletzung', 'Lieblingsspeise', 'Schuhgröße', 'Haarfarbe'], correct: 0 },
    { q: 'Welche Einträge gehören ins Verbandsbuch? (Mehrere richtig)', a: ['Datum und Uhrzeit', 'Name des Verletzten', 'Art der Verletzung', 'Durchgeführte Maßnahmen'], correct: [0, 1, 2, 3], multi: true },
    // Neuner-Regel
    { q: 'Was beschreibt die Neuner-Regel?', a: ['Einschätzung der verbrannten Körperoberfläche in %', 'Anzahl der Rettungsschwimmer', 'Chlor-Dosierung', 'Anzahl der Bahnen'], correct: 0 },
    { q: 'Wie viel % der Körperoberfläche macht ein Arm nach der Neuner-Regel aus?', a: ['9%', '18%', '27%', '36%'], correct: 0 },
    { q: 'Wie viel % der Körperoberfläche macht ein Bein nach der Neuner-Regel aus?', a: ['18%', '9%', '27%', '36%'], correct: 0 },
    // Reanimation Ankreuzfragen
    { q: 'Was ist die Funktion der Koronararterien?', a: ['Herzmuskelzellen mit sauerstoffreichem Blut versorgen', 'Herzmuskelzellen mit venösem Blut versorgen', 'Blut aus dem Herzen pumpen', 'Herzklappen steuern'], correct: 0 },
    { q: 'Was ist bei der Reanimation von Säuglingen FALSCH?', a: ['Kopf stark überstrecken', 'Harte Unterlage verwenden', '5 Initialbeatmungen', 'Puls an der Arminnenseite tasten'], correct: 0 },
    { q: 'Wie tief drückt man bei der Reanimation von Säuglingen?', a: ['Ca. 1/3 des Brustkorbs (4 cm)', '4-5 cm wie bei Erwachsenen', '0,5 cm', 'So tief wie möglich'], correct: 0 },

    // ===== PRÜFUNGSFACH 1: ERSTE HILFE (Fragen 96-157) =====

    // Frage 96: Telefonische Meldung Notfall - Notruf
    { q: 'Was gehört zu einer korrekten Notruf-Meldung?', a: ['Wo, Was, Wie viele, Welche Verletzungen, Warten auf Rückfragen', 'Nur den Namen nennen', 'Sofort auflegen', 'Nur "Hilfe" rufen'], correct: 0 },
    // Frage 97: Glieder der Rettungskette
    { q: 'Was ist das erste Glied der Rettungskette?', a: ['Absichern und Eigenschutz', 'Transport ins Krankenhaus', 'Notruf absetzen', 'Wiederbelebung'], correct: 0 },
    { q: 'Welche Glieder hat die Rettungskette?', a: ['Absichern - Notruf - Erste Hilfe - Rettungsdienst - Krankenhaus', 'Nur Notruf und Krankenhaus', 'Nur Erste Hilfe', 'Notruf - Warten - Krankenhaus'], correct: 0 },
    // Frage 98: Rettungskette optimal abwickeln
    { q: 'Wie wickelt man die Rettungskette optimal ab?', a: ['Gleichzeitig: Einer ruft Notruf, anderer leistet Erste Hilfe', 'Erst alles alleine machen', 'Nur Notruf, dann warten', 'Erst ins Krankenhaus fahren'], correct: 0 },
    // Frage 99: Rettungskette - Glieder benennen
    { q: 'Was ist das dritte Glied der Rettungskette?', a: ['Erste Hilfe leisten', 'Notruf absetzen', 'Absichern', 'Transport'], correct: 0 },
    // Frage 100: Strafgesetz unterlassene Hilfeleistung
    { q: 'Welche Konsequenzen hat unterlassene Hilfeleistung laut Strafgesetzbuch?', a: ['Freiheitsstrafe bis 1 Jahr oder Geldstrafe (§323c StGB)', 'Keine Konsequenzen', 'Nur Verwarnung', 'Nur bei Absicht strafbar'], correct: 0 },
    // Frage 101: Beispiele unzumutbare Erste-Hilfe-Leistung
    { q: 'Wann ist Erste-Hilfe-Leistung unzumutbar?', a: ['Bei erheblicher Eigengefährdung (z.B. brennendes Auto)', 'Bei schlechtem Wetter', 'Wenn man keine Lust hat', 'Wenn man spät dran ist'], correct: 0 },
    // Frage 102: Notfall vs. Notsituation
    { q: 'Was unterscheidet einen Notfall von einer Notsituation?', a: ['Notfall = akute Lebensgefahr; Notsituation = keine unmittelbare Lebensgefahr', 'Kein Unterschied', 'Notfall ist weniger schlimm', 'Notsituation ist gefährlicher'], correct: 0 },
    // Frage 103: Absicherung Unfallstelle im Badebetrieb
    { q: 'Wie sichert man eine Unfallstelle im Badebetrieb ab?', a: ['Bereich absperren, Badegäste fernhalten, ggf. Becken räumen', 'Nichts tun', 'Weiterschwimmen lassen', 'Nur zuschauen'], correct: 0 },
    // Frage 104: Lebensrettende Sofortmaßnahmen als Ersthelfer
    { q: 'Welche lebensrettenden Sofortmaßnahmen gibt es?', a: ['Bewusstsein prüfen, Atmung prüfen, Notruf, HLW, stabile Seitenlage', 'Nur Notruf', 'Nur warten', 'Nur Decke geben'], correct: 0 },
    // Frage 105: Symptome Kreislaufstillstand
    { q: 'Was sind Symptome eines Kreislaufstillstands?', a: ['Bewusstlosigkeit, keine normale Atmung, keine Reaktion', 'Kopfschmerzen', 'Hunger', 'Müdigkeit'], correct: 0 },
    // Frage 106: Esmarch'scher Griff - Was ist das
    { q: 'Was ist der Esmarch\'sche Griff?', a: ['Handgriff zum Überstrecken des Kopfes und Anheben des Kinns', 'Ein Rettungsgriff im Wasser', 'Ein Tragegriff', 'Ein Befreiungsgriff'], correct: 0 },
    // Frage 107: Esmarch'scher Griff - Wozu dient er
    { q: 'Wozu dient der Esmarch\'sche Griff?', a: ['Freimachen der Atemwege durch Überstrecken des Kopfes', 'Zum Transport von Opfern', 'Zum Befreien aus Umklammerung', 'Zum Messen des Pulses'], correct: 0 },
    // Frage 108: Esmarch'scher Griff - Technik beschreiben
    { q: 'Wie führt man den Esmarch\'schen Griff aus?', a: ['Hand an Stirn, Kopf überstrecken, mit zwei Fingern Kinn anheben', 'Kopf nach vorne beugen', 'Kopf zur Seite drehen', 'Mund zuhalten'], correct: 0 },
    // Frage 109: Mund-zu-Mund-Beatmung Technik
    { q: 'Wie führt man die Mund-zu-Mund-Beatmung durch?', a: ['Kopf überstrecken, Nase zuhalten, in den Mund beatmen, Brustkorb beobachten', 'Einfach in den Mund pusten', 'Mund zuhalten und durch Nase beatmen', 'Kopf nach vorne beugen'], correct: 0 },
    // Frage 110: Mund-zu-Nase-Beatmung Technik
    { q: 'Wie führt man die Mund-zu-Nase-Beatmung durch?', a: ['Kopf überstrecken, Mund zuhalten, durch die Nase beatmen', 'Nase zuhalten', 'Wie Mund-zu-Mund', 'Ohne Kopfüberstreckung'], correct: 0 },
    // Frage 111: Vor- und Nachteile Atemspende
    { q: 'Was ist ein Vorteil der Mund-zu-Nase-Beatmung?', a: ['Mund des Opfers muss nicht geöffnet werden', 'Mehr Luft möglich', 'Einfacher auszuführen', 'Hygienischer'], correct: 0 },
    // Frage 112: Typische Fehler bei Atemspende
    { q: 'Was ist ein typischer Fehler bei der Atemspende?', a: ['Kopf nicht ausreichend überstreckt, Atemwege nicht frei', 'Zu langsam beatmen', 'Zu viel Luft', 'Zu hygienisch'], correct: 0 },
    // Frage 113: Beatmungsfrequenz und -volumen Erwachsene
    { q: 'Wie hoch sind Beatmungsfrequenz und -volumen beim Erwachsenen?', a: ['Ca. 10-12 Beatmungen/min, ca. 500-600 ml Volumen', '5 Beatmungen/min, 200 ml', '30 Beatmungen/min, 1000 ml', '2 Beatmungen/min, 100 ml'], correct: 0 },
    // Frage 114: Beatmungsfrequenz und -volumen 5-jähriges Kind
    { q: 'Wie hoch sind Beatmungsfrequenz und -volumen beim 5-jährigen Kind?', a: ['Ca. 12-20 Beatmungen/min, kleineres Volumen als Erwachsene', 'Wie beim Erwachsenen', 'Nur 5 Beatmungen/min', 'Doppelt so viel wie Erwachsene'], correct: 0 },
    // Frage 115: Beatmungsfrequenz und -volumen Säugling
    { q: 'Wie beatmet man einen Säugling?', a: ['Mund und Nase umschließen, kleine Atemzüge, 20-30/min', 'Wie beim Erwachsenen', 'Nur durch die Nase', 'Gar nicht beatmen'], correct: 0 },
    // Frage 116: Herzdruckmassage bei Reanimation
    { q: 'Wie führt man die Herzdruckmassage bei Erwachsenen durch?', a: ['Handballen auf Brustbeinmitte, 5-6 cm tief, 100-120/min', 'Auf den Bauch drücken', 'Nur 50 mal pro Minute', 'Mit einem Finger'], correct: 0 },
    { q: 'Wo ist der Druckpunkt für die Herzdruckmassage beim Erwachsenen?', a: ['Mitte des Brustkorbs (untere Brustbeinhälfte)', 'Auf dem Bauch', 'Am Hals', 'Auf der Schulter'], correct: 0 },
    // Frage 116b: Herzdruckmassage Kleinkinder
    { q: 'Wie führt man die Herzdruckmassage bei Kleinkindern durch?', a: ['Ein Handballen, ca. 5 cm tief, auf untere Brustbeinhälfte', 'Wie beim Erwachsenen', 'Gar nicht drücken', 'Mit beiden Fäusten'], correct: 0 },
    // Frage 116c: Herzdruckmassage Säuglinge
    { q: 'Wie führt man die Herzdruckmassage bei Säuglingen durch?', a: ['Zwei Finger auf Brustbeinmitte, ca. 4 cm tief', 'Mit der ganzen Hand', 'Auf den Bauch drücken', 'Gar nicht drücken'], correct: 0 },
    // Frage 117: Fehler bei Herzdruckmassage
    { q: 'Was ist ein häufiger Fehler bei der Herzdruckmassage?', a: ['Zu geringe Drucktiefe oder falsche Druckpunktposition', 'Zu schnell drücken', 'Zu tief drücken', 'Zu wenig Pausen'], correct: 0 },
    // Frage 118: Herzfrequenz pro Minute
    { q: 'Wie hoch ist die normale Herzfrequenz beim Erwachsenen?', a: ['60-100 Schläge pro Minute', '30-40 Schläge pro Minute', '150-200 Schläge pro Minute', '10-20 Schläge pro Minute'], correct: 0 },
    { q: 'Wie hoch ist die normale Herzfrequenz beim Kleinkind?', a: ['80-120 Schläge pro Minute', '60-80 Schläge pro Minute', '40-60 Schläge pro Minute', '150-200 Schläge pro Minute'], correct: 0 },
    { q: 'Wie hoch ist die normale Herzfrequenz beim Säugling?', a: ['100-140 Schläge pro Minute', '60-80 Schläge pro Minute', '40-60 Schläge pro Minute', '200-250 Schläge pro Minute'], correct: 0 },
    // Frage 119: Pulsmessung - Wo und wie lange
    { q: 'Wo misst man den Puls bei einer bewusstlosen Person?', a: ['An der Halsschlagader (Carotis)', 'Am Handgelenk', 'Am Fuß', 'Am Ohr'], correct: 0 },
    { q: 'Wo misst man den Puls bei einer ansprechbaren Person?', a: ['Am Handgelenk (Arteria radialis)', 'An der Halsschlagader', 'Am Fuß', 'Am Knie'], correct: 0 },
    // Frage 120: Pulsmessung beim Baby
    { q: 'Wo misst man den Puls beim Baby?', a: ['An der Oberarminnenseite (Arteria brachialis)', 'Am Hals', 'Am Handgelenk', 'Am Fuß'], correct: 0 },
    // Frage 121: Diagnostischer Block bei HLW
    { q: 'Was ist der diagnostische Block bei der HLW?', a: ['Bewusstsein prüfen, Hilfe rufen, Atemwege freimachen, Atmung prüfen', 'Nur Atmung prüfen', 'Sofort mit Herzdruckmassage beginnen', 'Nichts tun'], correct: 0 },
    // Frage 122: Korrekte Reanimation (HLW)
    { q: 'Wie ist das Verhältnis von Herzdruckmassage zu Beatmung bei Erwachsenen?', a: ['30:2 (30 Kompressionen, 2 Beatmungen)', '15:2', '5:1', '100:10'], correct: 0 },
    // Frage 123: Wiederbelebung Kleinkinder
    { q: 'Was ist bei der Wiederbelebung von Kleinkindern zu beachten?', a: ['5 Initialbeatmungen, dann 15:2, angepasste Drucktiefe', 'Wie beim Erwachsenen', 'Keine Beatmung', 'Nur Herzdruckmassage'], correct: 0 },
    // Frage 124: Stabile Seitenlage
    { q: 'Wozu dient die stabile Seitenlage?', a: ['Freihaltung der Atemwege bei Bewusstlosen mit Atmung', 'Zur Wiederbelebung', 'Zum Transport', 'Bei Herzinfarkt'], correct: 0 },
    { q: 'Wie bringt man jemanden in die stabile Seitenlage?', a: ['Arm anwinkeln, gegenüberliegendes Bein anwinkeln, zur Seite drehen, Kopf überstrecken', 'Einfach auf die Seite legen', 'Auf den Bauch drehen', 'Sitzen lassen'], correct: 0 },
    // Frage 125: Lagerung während Reanimation
    { q: 'Wie muss eine Person während der Reanimation gelagert werden?', a: ['Flach auf dem Rücken auf harter Unterlage', 'In stabiler Seitenlage', 'Sitzend', 'Auf dem Bauch'], correct: 0 },
    // Frage 126: Lagerung zu reanimierendes Opfer
    { q: 'Worauf muss bei der Lagerung eines zu reanimierenden Opfers geachtet werden?', a: ['Harte Unterlage, flache Rückenlage, Kopf in Neutralposition', 'Weiche Unterlage', 'Kopf erhöht', 'Seitenlage'], correct: 0 },
    // Frage 127: Verletzungen im Unfallbuch
    { q: 'Warum sollten Verletzungen im Unfallbuch festgehalten werden?', a: ['Dokumentation für Versicherung und Berufsgenossenschaft', 'Nur zur Unterhaltung', 'Ist nicht nötig', 'Nur bei schweren Verletzungen'], correct: 0 },
    // Frage 128: Eintragungen Unfallbuch
    { q: 'Was muss ins Unfallbuch eingetragen werden?', a: ['Datum, Zeit, Ort, Hergang, Verletzte Person, Maßnahmen, Zeugen', 'Nur der Name', 'Nur das Datum', 'Nichts'], correct: 0 },
    // Frage 129: Lagerung Person mit Atemnot/Asthma
    { q: 'Wie lagert man eine Person mit Atemnot oder Asthma?', a: ['Oberkörper erhöht, sitzend oder mit Kutschersitz', 'Flach auf dem Rücken', 'Kopfüber', 'Auf dem Bauch'], correct: 0 },
    // Frage 130: Lagerung Person mit Herzinfarkt-Verdacht
    { q: 'Wie lagert man eine Person mit Herzinfarkt-Verdacht?', a: ['Oberkörper erhöht (30-45°) zur Herzentlastung', 'Flach auf dem Rücken', 'Kopfüber', 'Schocklage'], correct: 0 },
    // Frage 131: Sichere Anzeichen einer Fraktur
    { q: 'Was sind sichere Anzeichen einer Fraktur?', a: ['Fehlstellung, abnorme Beweglichkeit, Knochenreiben, offene Wunde mit Knochen', 'Nur Schmerzen', 'Nur Schwellung', 'Nur Bluterguss'], correct: 0 },
    // Frage 132: Maßnahmen Ersthelfer bei offener Fraktur
    { q: 'Was macht der Ersthelfer bei einer offenen Fraktur?', a: ['Wunde steril abdecken, Extremität ruhigstellen, Notruf', 'Knochen einrenken', 'Stark bewegen', 'Ignorieren'], correct: 0 },
    // Frage 133: PECH-Regel bei Sportverletzungen
    { q: 'Wofür steht die PECH-Regel?', a: ['Pause, Eis, Compression, Hochlagern', 'Pflaster, Essen, Creme, Hinlegen', 'Pressen, Entlasten, Cremen, Hochlegen', 'Pause, Essen, Cola, Hinlegen'], correct: 0 },
    // Frage 134: Symptome Schockzustand
    { q: 'An welchen Symptomen erkennt man einen Schockzustand?', a: ['Blässe, kalter Schweiß, schneller flacher Puls, Unruhe, Bewusstseinstrübung', 'Rotes Gesicht', 'Langsamer Puls', 'Hunger'], correct: 0 },
    // Frage 135: Schocklage beschreiben
    { q: 'Wie sieht die Schocklage aus?', a: ['Flache Rückenlage, Beine ca. 30° erhöht', 'Oberkörper erhöht', 'Auf dem Bauch', 'Sitzend'], correct: 0 },
    // Frage 136: Definition Schock
    { q: 'Was versteht man unter Schock?', a: ['Lebensbedrohliches Kreislaufversagen mit Minderdurchblutung der Organe', 'Nur Erschrecken', 'Müdigkeit', 'Hunger'], correct: 0 },
    // Frage 137: Lagerung bewusstloser Schockpatient
    { q: 'Wie lagert man einen bewusstlosen Schockpatienten?', a: ['Stabile Seitenlage (Atmung hat Vorrang!)', 'Schocklage mit Beinen hoch', 'Sitzend', 'Auf dem Bauch'], correct: 0 },
    // Frage 138: Lagerung Schockpatient mit Bewusstsein
    { q: 'Wie lagert man einen Schockpatienten mit Bewusstsein?', a: ['Schocklage: flach auf Rücken, Beine hoch', 'Sitzend', 'Auf dem Bauch', 'Stabile Seitenlage'], correct: 0 },
    // Frage 139: Lagerungsart nach Zustand
    { q: 'Welche Lagerung bei bewusstloser Person mit Atmung?', a: ['Stabile Seitenlage', 'Schocklage', 'Flach auf dem Rücken', 'Sitzend'], correct: 0 },
    { q: 'Welche Lagerung bei Volumenmangelschock?', a: ['Schocklage (Beine hoch)', 'Oberkörper hoch', 'Stabile Seitenlage', 'Sitzend'], correct: 0 },
    { q: 'Welche Lagerung bei Sonnenstich?', a: ['Oberkörper erhöht, Kopf kühlen, Schatten', 'Schocklage', 'Flach in der Sonne', 'Beine hoch'], correct: 0 },
    { q: 'Welche Lagerung bei Herzinfarkt-Verdacht?', a: ['Oberkörper erhöht zur Herzentlastung', 'Schocklage', 'Flach auf dem Bauch', 'Kopfüber'], correct: 0 },
    // Frage 140: Definition Herzinfarkt
    { q: 'Was ist ein Herzinfarkt?', a: ['Verschluss eines Herzkranzgefäßes mit Absterben von Herzmuskelgewebe', 'Herzrasen', 'Langsamer Herzschlag', 'Herzgeräusch'], correct: 0 },
    // Frage 141: Fallbeispiel Herzinfarkt im Wasser
    { q: 'Ein Mann erleidet beim Schwimmen einen Herzinfarkt und wird bewusstlos ohne Atmung geborgen. Was tun?', a: ['Sofort mit Wiederbelebung beginnen (30:2) und Notruf', 'Nur Notruf absetzen', 'Warten bis er aufwacht', 'Wasser aus der Lunge drücken'], correct: 0 },
    // Frage 142: Fallbeispiel Brustschmerzen nach Schwimmen
    { q: 'Ein Badegast klagt nach dem Schwimmen über Brustschmerzen und Ausstrahlung in den Arm. Was tun?', a: ['Herzinfarkt-Verdacht: Oberkörper hoch lagern, beruhigen, Notruf, enge Kleidung öffnen', 'Weiterschwimmen lassen', 'Kaltes Wasser geben', 'Nichts tun'], correct: 0 },
    // Frage 143: Unterschied Herzinfarkt und Angina Pectoris
    { q: 'Was unterscheidet Herzinfarkt von Angina Pectoris?', a: ['Herzinfarkt: dauerhafter Verschluss, Gewebe stirbt; Angina: vorübergehende Minderdurchblutung', 'Kein Unterschied', 'Angina ist schlimmer', 'Herzinfarkt ist harmlos'], correct: 0 },
    // Frage 144: Symptome Schädelhirntrauma
    { q: 'Welche Symptome deuten auf ein Schädelhirntrauma hin?', a: ['Bewusstseinsstörung, Übelkeit, Erbrechen, ungleiche Pupillen, Erinnerungslücken', 'Nur Kopfschmerzen', 'Nur Müdigkeit', 'Hunger'], correct: 0 },
    // Frage 145: Ursache Blutaustritt Mund, Nase, Ohren
    { q: 'Was kann Blutaustritt aus Mund, Nase und Ohren bedeuten?', a: ['Schweres Schädelhirntrauma mit Schädelbasisbruch', 'Harmloser Schnupfen', 'Zahnfleischbluten', 'Allergie'], correct: 0 },
    // Frage 146: Lagerung Patient mit akutem Bauch
    { q: 'Wie lagert man einen Patienten mit "Akutem Bauch"?', a: ['Rückenlage mit angezogenen Beinen (entlastet Bauchdecke)', 'Flach gestreckt', 'Auf dem Bauch', 'Schocklage'], correct: 0 },
    // Frage 147: Ursachen und Symptome Akuter Bauch
    { q: 'Was sind mögliche Ursachen für einen Akuten Bauch?', a: ['Blinddarmentzündung, Darmverschluss, innere Blutung, Gallenkolik', 'Nur Hunger', 'Nur Verstopfung', 'Nur Durchfall'], correct: 0 },
    // Frage 148: Maßnahmen bei Akutem Bauch
    { q: 'Welche Maßnahmen ergreift man bei Akutem Bauch?', a: ['Nichts zu essen/trinken geben, Schonlagerung, Notruf', 'Essen geben', 'Viel trinken lassen', 'Abwarten'], correct: 0 },
    // Frage 149: Körpertemperaturregulierung
    { q: 'Wie reguliert der Körper die Temperatur?', a: ['Durch Schwitzen, Gefäßerweiterung/-verengung, Zittern', 'Gar nicht', 'Nur durch Kleidung', 'Nur durch Trinken'], correct: 0 },
    // Frage 150: Hitzeerschöpfung Ursachen, Symptome, Maßnahmen
    { q: 'Was sind Symptome einer Hitzeerschöpfung?', a: ['Blässe, Schwäche, Übelkeit, Schwitzen, niedriger Blutdruck', 'Rotes heißes Gesicht', 'Kein Schwitzen', 'Hoher Blutdruck'], correct: 0 },
    { q: 'Was sind Maßnahmen bei Hitzeerschöpfung?', a: ['In den Schatten bringen, flach lagern, Beine hoch, trinken lassen', 'In die Sonne legen', 'Viel bewegen lassen', 'Warm einpacken'], correct: 0 },
    // Frage 151: Thermische Verletzungen
    { q: 'Was sind thermische Verletzungen?', a: ['Verbrennungen, Verbrühungen, Erfrierungen', 'Nur Schnitte', 'Nur Prellungen', 'Nur Brüche'], correct: 0 },
    { q: 'Woran erkennt man den Grad einer Verbrennung?', a: ['Grad I: Rötung; Grad II: Blasen; Grad III: weiß/schwarz, schmerzlos', 'Nur an der Größe', 'Nur an der Stelle', 'Gar nicht'], correct: 0 },
    // Frage 152: Sofortmaßnahmen bei verschiedenen Notfällen
    { q: 'Was ist die Sofortmaßnahme bei Stromunfall?', a: ['Stromkreis unterbrechen (Sicherung!), dann Erste Hilfe', 'Sofort anfassen', 'Mit Wasser löschen', 'Abwarten'], correct: 0 },
    { q: 'Was ist die Sofortmaßnahme bei Verbrennung?', a: ['Kühlen mit lauwarmem Wasser (10-20 min), steril abdecken', 'Eis direkt auf die Wunde', 'Brandsalbe auftragen', 'Blasen aufstechen'], correct: 0 },
    { q: 'Was ist die Sofortmaßnahme bei Verätzung?', a: ['Mit viel Wasser spülen, Notruf', 'Nichts tun', 'Salbe auftragen', 'Reiben'], correct: 0 },
    // Frage 153: Hitzschlag Ursachen, Symptome, Maßnahmen
    { q: 'Was sind Symptome eines Hitzschlags?', a: ['Hochrotes heißes Gesicht, KEIN Schwitzen, hohe Körpertemperatur, Bewusstseinsstörung', 'Blässe und Schwitzen', 'Kalte Haut', 'Niedriger Puls'], correct: 0 },
    { q: 'Was sind Maßnahmen bei Hitzschlag?', a: ['Sofort kühlen, Notruf 112, Schatten, Kleidung öffnen', 'Warm einpacken', 'Viel bewegen', 'In die Sonne legen'], correct: 0 },
    // Frage 154: Sonnenstich Ursachen, Symptome, Maßnahmen
    { q: 'Was sind Symptome eines Sonnenstichs?', a: ['Kopfschmerzen, Übelkeit, steifer Nacken, roter heißer Kopf, Körper kühl', 'Kalter Kopf', 'Kein Kopfschmerz', 'Heißer Körper'], correct: 0 },
    { q: 'Was sind Maßnahmen bei Sonnenstich?', a: ['Schatten, Kopf und Nacken kühlen, Oberkörper erhöht lagern', 'In die Sonne legen', 'Flach lagern', 'Viel bewegen'], correct: 0 },
    // Frage 155: Aufgabe Ozonschicht
    { q: 'Welche Aufgabe hat die Ozonschicht der Erde?', a: ['Filtert schädliche UV-Strahlung der Sonne', 'Erzeugt Sauerstoff', 'Wärmt die Erde', 'Produziert Regen'], correct: 0 },
    // Frage 156: Vorbeugende Maßnahmen Sonnenschutz
    { q: 'Welche vorbeugenden Maßnahmen schützen vor Sonnenschäden?', a: ['Sonnencreme, Kopfbedeckung, Schatten, Mittagssonne meiden', 'Nichts tun', 'Viel in die Sonne gehen', 'Ohne Schutz sonnen'], correct: 0 },
    // Frage 157: Fallbeispiel Sonnenstich
    { q: 'Ein Badegast liegt bewusstlos in der Sonne, sein Gesicht ist hochrot und heiß. Was tun?', a: ['Schatten, Oberkörper hoch, Kopf kühlen, Notruf, bei Atemstillstand HLW', 'Liegen lassen', 'Kaltes Wasser über den Körper', 'Aufstehen lassen'], correct: 0 }
  ],

  // ===== HYGIENE =====
  hygiene: [
    { q: 'Warum muss vor dem Schwimmen geduscht werden?', a: ['Hygiene und Wasserqualität', 'Nur zur Gewohnheit', 'Weil es Spaß macht', 'Um warm zu werden'], correct: 0 },
    { q: 'Was ist eine Legionellenprüfung?', a: ['Kontrolle auf Bakterien im Wasser', 'Sicherheitscheck der Rutschen', 'Temperaturmessung', 'pH-Test'], correct: 0 },
    { q: 'Wie oft muss ein Schwimmbecken gereinigt werden?', a: ['Täglich', 'Wöchentlich', 'Monatlich', 'Jährlich'], correct: 0 },
    // Pseudomonas
    { q: 'Was ist richtig über Pseudomonas aeruginosa?', a: ['Bakterien, die Otitis externa (Ohrenentzündung) verursachen können', 'Viren im Beckenwasser', 'Harmlose Algen', 'Ein Reinigungsmittel'], correct: 0 },
    // Hautschichten
    { q: 'Welche Reihenfolge der Hautschichten von außen nach innen ist korrekt?', a: ['Oberhaut, Lederhaut, Unterhaut', 'Unterhaut, Aderhaut, Oberhaut', 'Unterhaut, Aderhaut, Hornhaut', 'Lederhaut, Oberhaut, Unterhaut'], correct: 0 },
    { q: 'Warum sind Straßenschuhe in Nassbereichen hygienisch problematisch?', a: ['Sie bringen Schmutz und Keime von außen ein', 'Sie machen den Boden wärmer', 'Sie schützen besser vor Ausrutschen', 'Sie verbessern die Luftqualität'], correct: 0 },
    { q: 'Welche Maßnahme hilft gegen Fußpilz in Schwimmbädern?', a: ['Badeschuhe tragen und Füße gut abtrocknen', 'Barfuß in allen Bereichen laufen', 'Füße dauerhaft nass lassen', 'Nur kaltes Wasser benutzen'], correct: 0 },
    { q: 'Was ist die Hauptaufgabe von freiem Chlor im Beckenwasser?', a: ['Abtötung bzw. Inaktivierung von Keimen', 'Steigerung der Wassertemperatur', 'Erhöhung der Wasserhärte', 'Verbesserung der Beleuchtung'], correct: 0 },
    { q: 'Was deutet ein hoher Wert an gebundenem Chlor häufig an?', a: ['Hohe organische Belastung im Beckenwasser', 'Zu wenig Badegäste', 'Zu kaltes Wasser', 'Defekte Umkleiden'], correct: 0 },
    { q: 'Welche pH-Wirkung ist für die Desinfektion ungünstig?', a: ['Zu hoher pH-Wert', 'Neutraler pH-Wert', 'Stabiler pH-Wert', 'Regelmäßig kontrollierter pH-Wert'], correct: 0 },
    { q: 'Welche Beschwerden können bei zu vielen Chloraminen in der Luft auftreten?', a: ['Augen- und Atemwegsreizungen', 'Bessere Sicht unter Wasser', 'Höhere Schwimmgeschwindigkeit', 'Schnellere Wundheilung'], correct: 0 },
    { q: 'Warum ist regelmäßiges Rückspülen von Filtern wichtig?', a: ['Entfernung zurückgehaltener Schmutzstoffe und Keime', 'Damit das Wasser blau bleibt', 'Zur Senkung der Luftfeuchtigkeit', 'Nur zur Geräuschminderung'], correct: 0 },
    { q: 'Was ist ein Biofilm?', a: ['Mikroorganismen in einer schleimigen Schutzschicht auf Oberflächen', 'Ein Wasserfilm ohne Keime', 'Eine Art Reinigungsmittel', 'Eine besondere Fliesenart'], correct: 0 },
    { q: 'Wo bilden sich Biofilme besonders leicht?', a: ['In warm-feuchten Bereichen und Leitungen mit wenig Durchfluss', 'Nur auf trockenen Flächen', 'Nur im Außenbereich', 'Ausschließlich im Beckenboden'], correct: 0 },
    { q: 'Welche Aussage zu Legionellen ist richtig?', a: ['Sie vermehren sich bevorzugt in warmem, stehendem Wasser', 'Sie entstehen nur durch Chlor', 'Sie sind nur in Meerwasser zu finden', 'Sie sind ausschließlich Hautpilze'], correct: 0 },
    { q: 'Wie werden Legionellen häufig übertragen?', a: ['Über fein vernebelte Aerosole', 'Nur durch Hautkontakt', 'Nur über Lebensmittel', 'Gar nicht auf Menschen'], correct: 0 },
    { q: 'Welche Sofortmaßnahme ist bei Erbrochenem im Becken richtig?', a: ['Bereich sichern, entfernen, desinfizieren und Parameter prüfen', 'Ignorieren und weiterschwimmen lassen', 'Nur Wasser nachfüllen', 'Nur den Boden trockenwischen'], correct: 0 },
    { q: 'Warum sind Durchfallerkrankungen bei Badegästen hygienisch kritisch?', a: ['Erhöhtes Eintragsrisiko von Krankheitserregern ins Wasser', 'Sie beeinflussen nur den Lärmpegel', 'Sie betreffen nur die Umkleiden', 'Sie machen das Wasser weicher'], correct: 0 },
    { q: 'Welche Reihenfolge ist bei der Flächenreinigung sinnvoll?', a: ['Von sauber nach schmutzig arbeiten', 'Von schmutzig nach sauber arbeiten', 'Zufällig arbeiten', 'Nur sichtbaren Schmutz entfernen'], correct: 0 },
    { q: 'Warum sollten Reinigungsutensilien für WC und Beckenrand getrennt sein?', a: ['Zur Vermeidung von Keimverschleppung', 'Damit weniger Wasser verbraucht wird', 'Damit die Farben schöner wirken', 'Damit weniger Personal nötig ist'], correct: 0 },
    { q: 'Welche Schutzausrüstung ist bei Desinfektionsmitteln häufig notwendig?', a: ['Geeignete Schutzhandschuhe und ggf. Schutzbrille', 'Keine Schutzausrüstung', 'Nur Badeschuhe', 'Nur Gehörschutz'], correct: 0 },
    { q: 'Welche Aussage zum Mischen von Chemikalien ist richtig?', a: ['Chlorprodukte und saure Reiniger niemals unkontrolliert mischen', 'Alle Reiniger können immer zusammen verwendet werden', 'Nur im Sommer ist Mischen gefährlich', 'Mischen verbessert stets die Wirkung'], correct: 0 },
    { q: 'Warum ist gute Lüftung in Hallenbädern hygienisch wichtig?', a: ['Sie reduziert Reizstoffe und verbessert die Luftqualität', 'Sie erhöht automatisch den Chlorgehalt', 'Sie ersetzt die Wasseraufbereitung', 'Sie macht Duschen überflüssig'], correct: 0 },
    { q: 'Welche Maßnahmen senken den Schmutzeintrag ins Becken? (Mehrere richtig)', a: ['Vor dem Baden duschen', 'Toilette vor dem Schwimmen nutzen', 'Haare zusammenbinden/Badekappe nutzen', 'Mit Straßenschuhen durch den Nassbereich laufen'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Punkte gehören zur Hygienekontrolle im Badbetrieb? (Mehrere richtig)', a: ['Regelmäßige Wasserparameter-Messungen', 'Reinigungs- und Desinfektionsplan', 'Dokumentation der Kontrollen', 'Verzicht auf Sichtkontrollen'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Situationen erhöhen das Risiko für Keimwachstum? (Mehrere richtig)', a: ['Stagnation in Leitungen', 'Zu geringe Desinfektionswirkung', 'Warme Feuchtbereiche', 'Konsequentes Reinigungsmanagement'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Aussagen zu Händehygiene im Schwimmbad sind richtig? (Mehrere richtig)', a: ['Händewaschen nach Toilettengang', 'Händedesinfektion bei Bedarf nach Kontakt mit potenziell infektiösem Material', 'Händewaschen vor dem Essen', 'Händehygiene ist im Badebetrieb unwichtig'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Maßnahmen sind bei Verdacht auf einen hygienischen Zwischenfall sinnvoll? (Mehrere richtig)', a: ['Betriebsinterne Meldekette einhalten', 'Bereich absichern', 'Dokumentation durchführen', 'Zwischenfall verschweigen'], correct: [0, 1, 2], multi: true },
    { q: 'Welcher Temperaturbereich begünstigt Legionellen besonders?', a: ['Etwa 25 bis 45 Grad Celsius', 'Unter 5 Grad Celsius', 'Genau 0 Grad Celsius', 'Über 80 Grad Celsius'], correct: 0 },
    { q: 'Wann steigt das Legionellenrisiko in Leitungen besonders an?', a: ['Bei Stagnation und seltenem Wasseraustausch', 'Bei täglicher Nutzung', 'Bei kalter Außenluft', 'Bei häufiger Rückspülung'], correct: 0 },
    { q: 'Warum sind Duschanlagen hygienisch besonders sensibel?', a: ['Durch Aerosole können Keime verbreitet werden', 'Duschen haben kein Wasser', 'Dort gibt es keine Oberflächen', 'Nur wegen hoher Lautstärke'], correct: 0 },
    { q: 'Was ist bei Duschköpfen aus Hygienesicht wichtig?', a: ['Regelmäßige Reinigung und Entkalkung', 'Nur jährlich tauschen', 'Gar nicht reinigen', 'Nur mit klarem Wasser abspritzen'], correct: 0 },
    { q: 'Wozu dient ein Reinigungs- und Desinfektionsplan?', a: ['Zur standardisierten und nachvollziehbaren Hygiene', 'Zur Dienstplanerstellung', 'Zur Preisgestaltung', 'Zur Besucherzählung'], correct: 0 },
    { q: 'Warum ist die Dokumentation von Hygienemaßnahmen wichtig?', a: ['Sie ermöglicht Nachweis und Rückverfolgbarkeit', 'Sie ersetzt alle Kontrollen', 'Sie ist nur für Gäste gedacht', 'Sie hat keine Funktion'], correct: 0 },
    { q: 'Was bedeutet Sichtreinigung?', a: ['Entfernung sichtbarer Verschmutzungen als erster Schritt', 'Nur Geruchskontrolle', 'Nur mit Desinfektionsmittel arbeiten', 'Reinigung ohne Wasser'], correct: 0 },
    { q: 'Wann wird eine Fläche in der Regel desinfiziert?', a: ['Nach der Reinigung bei hygienisch relevanten Flächen', 'Nur vor der Reinigung', 'Nur bei Vollmond', 'Niemals im Badebetrieb'], correct: 0 },
    { q: 'Warum ist die Einwirkzeit bei Desinfektionsmitteln entscheidend?', a: ['Nur so wird die gewünschte Keimreduktion erreicht', 'Sie ist nur für die Farbe wichtig', 'Sie beeinflusst nur den Geruch', 'Sie hat keine Bedeutung'], correct: 0 },
    { q: 'Was ist die Folge einer zu kurzen Einwirkzeit?', a: ['Unzureichende Desinfektionswirkung', 'Sicherere Wasserqualität', 'Weniger Keimeintrag', 'Bessere Filterleistung'], correct: 0 },
    { q: 'Warum muss die Dosierung von Desinfektionsmitteln stimmen?', a: ['Unter- und Überdosierung sind beide problematisch', 'Nur Unterdosierung ist problematisch', 'Nur Überdosierung ist problematisch', 'Dosierung ist egal'], correct: 0 },
    { q: 'Was kann bei Überdosierung von Desinfektionsmitteln passieren?', a: ['Materialschäden und Reizungen', 'Keime verschwinden dauerhaft', 'Bessere Luftqualität ohne Nebenwirkungen', 'Wasser wird automatisch trinkbar'], correct: 0 },
    { q: 'Was ist ein typisches Risiko bei Unterdosierung?', a: ['Krankheitserreger werden nicht ausreichend reduziert', 'Das Wasser wird zu warm', 'Es entsteht kein Biofilm mehr', 'Die Lüftung fällt aus'], correct: 0 },
    { q: 'Warum ist Personalhygiene im Badebetrieb wichtig?', a: ['Sie reduziert die Übertragung von Keimen', 'Sie erhöht nur den Papierverbrauch', 'Sie betrifft nur Gäste', 'Sie ist nur im Winter nötig'], correct: 0 },
    { q: 'Wann ist Händedesinfektion für Mitarbeitende besonders sinnvoll?', a: ['Nach Kontakt mit potenziell infektiösem Material', 'Vor dem Feierabendfoto', 'Nur nach der Pause', 'Nur wenn Gäste zuschauen'], correct: 0 },
    { q: 'Was gehört zu wirksamem Händewaschen?', a: ['Mindestens 20 bis 30 Sekunden mit Seife waschen', 'Nur kurz mit Wasser abspülen', 'Nur mit Handtuch reiben', 'Hände danach nicht trocknen'], correct: 0 },
    { q: 'Warum sollten offene Wunden im Dienst abgedeckt werden?', a: ['Zum Schutz vor Keimeintrag und Keimabgabe', 'Nur aus optischen Gründen', 'Damit Handschuhe entfallen', 'Damit weniger Seife benötigt wird'], correct: 0 },
    { q: 'Wie sollte mit Mitarbeitenden bei akuter Magen-Darm-Erkrankung umgegangen werden?', a: ['Nicht im Badebetrieb einsetzen, bis symptomfrei', 'Normal weiterarbeiten lassen', 'Nur in der Kasse einsetzen', 'Nur kürzere Schichten geben'], correct: 0 },
    { q: 'Warum nutzt man getrennte Wischsysteme für verschiedene Bereiche?', a: ['Zur Vermeidung von Kreuzkontamination', 'Damit weniger Tücher nötig sind', 'Nur wegen der Optik', 'Damit der Boden schneller trocknet'], correct: 0 },
    { q: 'Warum sollten Reinigungsgeräte klar gekennzeichnet sein?', a: ['Damit Bereichstrennung hygienisch sicher eingehalten wird', 'Damit sie teurer wirken', 'Damit man weniger schult', 'Damit sie weniger wiegen'], correct: 0 },
    { q: 'Was bedeutet Kreuzkontamination?', a: ['Übertragung von Keimen auf zuvor saubere Bereiche', 'Austausch von Schichtplänen', 'Nur sichtbarer Schmutz', 'Wasserverdunstung auf Fliesen'], correct: 0 },
    { q: 'Warum sollten Reinigungstextilien regelmäßig gewechselt werden?', a: ['Feuchte Tücher können Keime verbreiten', 'Nur wegen der Farbe', 'Damit weniger gewaschen werden muss', 'Es ist hygienisch ohne Bedeutung'], correct: 0 },
    { q: 'Welche Flächen sind im Bad oft hygienisch besonders relevant?', a: ['Häufig berührte Kontaktflächen wie Griffe und Handläufe', 'Nur Deckenflächen', 'Nur Außenwände', 'Nur Büroarbeitsplätze'], correct: 0 },
    { q: 'Was ist im Wickelraum hygienisch besonders wichtig?', a: ['Regelmäßige Reinigung und Desinfektion der Auflageflächen', 'Nur tägliches Lüften', 'Keine Handschuhe nutzen', 'Nur Boden fegen'], correct: 0 },
    { q: 'Warum sollte man Barfußgänge möglichst trocken halten?', a: ['Das reduziert Rutsch- und Keimrisiken', 'Damit mehr Wasser verdunstet', 'Nur aus Komfortgründen', 'Damit weniger gereinigt werden muss'], correct: 0 },
    { q: 'Was begünstigt Schimmelbildung in Sanitärräumen?', a: ['Feuchtigkeit, Wärme und schlechte Lüftung', 'Trockene Luft', 'Niedrige Luftfeuchte', 'Kurze Öffnungszeiten'], correct: 0 },
    { q: 'Welche Maßnahme hilft gegen Schimmelbildung?', a: ['Regelmäßiges Lüften, Trocknen und fachgerechte Reinigung', 'Raum dauerhaft schließen', 'Nur kalt nachwischen', 'Reinigung komplett aussetzen'], correct: 0 },
    { q: 'Was ist eine Totleitung?', a: ['Ein Leitungsteil ohne regelmäßigen Wasserdurchfluss', 'Eine Leitung ohne Druckverlust', 'Eine vollständig entleerte Leitung im Betrieb', 'Eine Leitung nur für Regenwasser'], correct: 0 },
    { q: 'Warum sind Totleitungen hygienisch problematisch?', a: ['Sie fördern Stagnation und Keimwachstum', 'Sie kühlen das Wasser zu stark', 'Sie erhöhen nur den Stromverbrauch', 'Sie sind rein optisch problematisch'], correct: 0 },
    { q: 'Was versteht man unter einer Stagnationsspülung?', a: ['Gezieltes Durchspülen wenig genutzter Leitungen', 'Austausch aller Leitungen', 'Komplette Beckenschließung', 'Nur Filter rückspülen'], correct: 0 },
    { q: 'Warum sind Solltemperaturen im Warmwasser hygienisch wichtig?', a: ['Sie unterstützen die Legionellenprävention', 'Sie beeinflussen nur den Komfort', 'Sie sind nur im Winter relevant', 'Sie haben keinen Einfluss'], correct: 0 },
    { q: 'Was ist bei Kaltwasser aus Hygienesicht wichtig?', a: ['Erwärmung vermeiden und Temperatur möglichst niedrig halten', 'Kaltwasser aufheizen', 'Nur selten nutzen', 'Mit Warmwasser mischen'], correct: 0 },
    { q: 'Worauf sollte man bei Probennahmestellen achten?', a: ['Sie müssen repräsentativ und gut zugänglich sein', 'Sie dürfen nie beschriftet sein', 'Sie müssen verdeckt liegen', 'Sie werden zufällig täglich verlegt'], correct: 0 },
    { q: 'Was ist ein Hygiene-Audit?', a: ['Eine systematische Überprüfung von Hygienemaßnahmen', 'Ein neuer Filtertyp', 'Ein chemischer Zusatzstoff', 'Eine Marketingaktion'], correct: 0 },
    { q: 'Warum sind Hygieneschulungen für das Team wichtig?', a: ['Sie sichern einheitliche und wirksame Abläufe', 'Sie ersetzen technische Wartung', 'Sie reduzieren die Dokumentation', 'Sie sind nur für neue Mitarbeitende nötig'], correct: 0 },
    { q: 'Was ist bei positivem mikrobiologischen Befund sinnvoll?', a: ['Ursachenanalyse und Maßnahmenplan mit Nachkontrolle', 'Messung ignorieren', 'Nur Wasser nachfüllen', 'Nur Öffnungszeiten ändern'], correct: 0 },
    { q: 'Wie sollte bei Verdacht auf Pseudomonaden im Whirlpool reagiert werden?', a: ['Nutzung einschränken und Technik plus Desinfektion prüfen', 'Whirlpool länger laufen lassen', 'Wassertemperatur erhöhen und sonst nichts', 'Nur Hinweisschild aufstellen'], correct: 0 },
    { q: 'Warum sind Whirlpools hygienisch besonders anspruchsvoll?', a: ['Wärme und Aerosole begünstigen Keimrisiken', 'Sie enthalten kein Wasser', 'Sie werden nicht genutzt', 'Sie haben keine Rohrleitungen'], correct: 0 },
    { q: 'Warum brauchen Babybecken häufig besondere Hygienekontrollen?', a: ['Durch empfindliche Nutzer und erhöhtes Eintragsrisiko', 'Weil sie immer leer sind', 'Weil dort keine Keime vorkommen', 'Nur wegen der Beckentiefe'], correct: 0 },
    { q: 'Warum sind Toilettenpausen bei Kindergruppen wichtig?', a: ['Sie reduzieren fäkale Einträge ins Beckenwasser', 'Sie verkürzen nur den Unterricht', 'Sie verbessern nur die Lautstärke', 'Sie sind nur organisatorisch wichtig'], correct: 0 },
    { q: 'Was ist bei einem Stuhlunfall im Becken die richtige Reaktion?', a: ['Bereich sperren, entfernen, desinfizieren und Werte kontrollieren', 'Sofort wieder freigeben', 'Nur Wasser nachfüllen', 'Unfall nicht dokumentieren'], correct: 0 },
    { q: 'Wie sollte bei Blut im Becken gehandelt werden?', a: ['Nach internem Hygieneplan sichern, bewerten und dokumentieren', 'Immer ignorieren', 'Nur Gäste informieren', 'Nur Umkleiden schließen'], correct: 0 },
    { q: 'Warum sind klare Hygienehinweise für Badegäste wichtig?', a: ['Sie senken den Keimeintrag durch korrektes Verhalten', 'Sie ersetzen die Wasseraufbereitung', 'Sie machen Kontrollen überflüssig', 'Sie gelten nur für Trainer'], correct: 0 },
    { q: 'Was umfasst die Betreiberverantwortung im Hygienebereich?', a: ['Sicherstellung hygienisch einwandfreier Betriebsbedingungen', 'Nur Kassenabrechnung', 'Nur Personalplanung', 'Nur Marketing'], correct: 0 },
    { q: 'Warum sind externe Laboranalysen hilfreich?', a: ['Sie bieten eine unabhängige Kontrolle der Wasserqualität', 'Sie ersetzen jede Eigenkontrolle', 'Sie senken automatisch den Chlorwert', 'Sie sind nur für Freibäder relevant'], correct: 0 },
    { q: 'Was ist bei der Probenahme für Laboruntersuchungen wichtig?', a: ['Sterile Gefäße und korrekte Transportbedingungen', 'Beliebige Behälter', 'Lange Lagerung bei Wärme', 'Proben unbeschriftet versenden'], correct: 0 },
    { q: 'Warum müssen pH-Wert und freies Chlor gemeinsam bewertet werden?', a: ['Die Desinfektionswirkung hängt von beiden Parametern ab', 'Weil sie nie zusammen auftreten', 'Nur pH ist entscheidend', 'Nur Chlor ist entscheidend'], correct: 0 },
    { q: 'Was beschreibt der Redoxwert im Badebetrieb?', a: ['Einen Hinweis auf die Oxidations- und Desinfektionswirkung', 'Die Beckentiefe', 'Die Luftfeuchte', 'Die Wasserhärte allein'], correct: 0 },
    { q: 'Was kann Trübung im Beckenwasser anzeigen?', a: ['Erhöhte Belastung oder Probleme in der Aufbereitung', 'Immer optimale Wasserqualität', 'Nur Lichteffekte', 'Zu viel Frischwasser'], correct: 0 },
    { q: 'Warum werden Filterlaufzeiten überwacht?', a: ['Um eine verlässliche Wasseraufbereitung sicherzustellen', 'Nur zur Energieabrechnung', 'Nur für Statistiken', 'Ohne hygienische Relevanz'], correct: 0 },
    { q: 'Welche hygienische Funktion hat Flockung?', a: ['Sie bindet feine Partikel für die nachfolgende Filtration', 'Sie ersetzt Desinfektion vollständig', 'Sie erhöht nur die Temperatur', 'Sie reduziert nur die Lautstärke'], correct: 0 },
    { q: 'Warum müssen Überlaufrinnen regelmäßig gereinigt werden?', a: ['Zur Vermeidung von Ablagerungen und Biofilmen', 'Nur aus optischen Gründen', 'Nur bei Regen', 'Damit Chlor nicht wirkt'], correct: 0 },
    { q: 'Was sollte ein Hygiene-Notfallset enthalten?', a: ['Geeignete Schutzausrüstung und Material zur sicheren Erstmaßnahme', 'Nur Kugelschreiber', 'Nur Putzlappen ohne Schutzmittel', 'Nur Werbeplakate'], correct: 0 },
    { q: 'Warum sollten Einmalhandschuhe zwischen Tätigkeiten gewechselt werden?', a: ['Zur Vermeidung von Keimverschleppung', 'Damit sie schneller trocknen', 'Nur aus Komfortgründen', 'Nur wenn Gäste anwesend sind'], correct: 0 },
    { q: 'Was ist bei der Müllentsorgung in Nassbereichen wichtig?', a: ['Geschlossene Behälter und regelmäßige Entleerung', 'Offene Eimer ohne Deckel', 'Entleerung nur monatlich', 'Müll in Technikraum lagern'], correct: 0 },
    { q: 'Warum müssen Reinigungschemikalien getrennt und sicher gelagert werden?', a: ['Zur Vermeidung gefährlicher Reaktionen und für Arbeitsschutz', 'Damit sie schneller wirken', 'Nur wegen der Farbe', 'Damit weniger dokumentiert wird'], correct: 0 },
    { q: 'Wofür sind Sicherheitsdatenblätter im Hygienebereich wichtig?', a: ['Sie geben klare Hinweise zu Schutz und Anwendung', 'Sie ersetzen Unterweisungen vollständig', 'Sie sind nur für Hersteller', 'Sie sind nicht erforderlich'], correct: 0 },
    { q: 'Was ist bei Chemikalienspritzern ins Auge richtig?', a: ['Sofort spülen und medizinisch abklären lassen', 'Abwarten und weiterarbeiten', 'Nur kurz blinzeln', 'Mit Desinfektionsmittel nachspülen'], correct: 0 },
    { q: 'Welche Faktoren beeinflussen die Hygienesituation im Becken? (Mehrere richtig)', a: ['Badegastanzahl', 'Wassertemperatur', 'Filterleistung', 'Farbe der Schwimmbrillen'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Maßnahmen gehören zur Legionellenprävention? (Mehrere richtig)', a: ['Stagnation vermeiden', 'Geeignete Temperaturführung', 'Regelmäßige Kontrollen', 'Duschköpfe reinigen'], correct: [0, 1, 2, 3], multi: true },
    { q: 'Was ist bei der Flächendesinfektion wichtig? (Mehrere richtig)', a: ['Vorreinigung der Fläche', 'Richtige Konzentration', 'Mindest-Einwirkzeit', 'Desinfektionsmittel sofort wieder trocken abreiben'], correct: [0, 1, 2], multi: true },
    { q: 'Was sind typische Quellen für Keimeintrag? (Mehrere richtig)', a: ['Badegäste', 'Außenschmutz über Zugänge', 'Unzureichend gereinigte Flächen', 'Regelkonforme Dokumentation'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Dokumente unterstützen ein gutes Hygiene-Management? (Mehrere richtig)', a: ['Reinigungs- und Desinfektionspläne', 'Messprotokolle', 'Unterweisungsnachweise', 'Private Einkaufslisten'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Signale können auf ein Hygieneproblem hindeuten? (Mehrere richtig)', a: ['Geruchsauffälligkeiten', 'Trübes Wasser', 'Häufung von Haut- oder Augenreizungen', 'Stabile unauffällige Messwerte'], correct: [0, 1, 2], multi: true },
    { q: 'Welche persönlichen Maßnahmen sollten Mitarbeitende beachten? (Mehrere richtig)', a: ['Saubere Arbeitskleidung', 'Konsequente Händehygiene', 'Wunden sicher abdecken', 'Benutzte Handschuhe mehrfach verwenden'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Bereiche benötigen häufig erhöhte Hygieneaufmerksamkeit? (Mehrere richtig)', a: ['Duschen', 'WC-Bereiche', 'Barfußgänge', 'Unbenutzte Trockenlager ohne Kontaktflächen'], correct: [0, 1, 2], multi: true },
    { q: 'Was ist bei auffälligen Messwerten richtig? (Mehrere richtig)', a: ['Messung verifizieren', 'Ursache systematisch prüfen', 'Gegenmaßnahmen dokumentieren', 'Werte grundsätzlich ignorieren'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Vorteile bringt gute Lüftung im Hallenbad? (Mehrere richtig)', a: ['Weniger Feuchte', 'Reduzierte Reizstoffbelastung', 'Geringeres Schimmelrisiko', 'Sie ersetzt alle Reinigungsmaßnahmen'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Aufgaben hat das Team bei Hygienefragen? (Mehrere richtig)', a: ['Regeln konsequent einhalten', 'Mängel zeitnah melden', 'Gäste korrekt informieren', 'Schutzmaßnahmen umgehen'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Hygienehinweise sollten Gäste erhalten? (Mehrere richtig)', a: ['Vor dem Baden duschen', 'Bei Infekt nicht baden', 'Toilette vor dem Schwimmen nutzen', 'Straßenschuhe im Nassbereich tragen'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Aussagen zu Biofilmen sind richtig? (Mehrere richtig)', a: ['Biofilme können Keime schützen', 'Sie entstehen auf feuchten Oberflächen', 'Sie erschweren wirksame Desinfektion', 'Sie verschwinden immer ohne Reinigung'], correct: [0, 1, 2], multi: true },
    { q: 'Welche Maßnahmen helfen gegen Kreuzkontamination? (Mehrere richtig)', a: ['Bereichsgetrennte Utensilien', 'Handschuhwechsel zwischen Tätigkeiten', 'Reinigungsfolge von sauber nach schmutzig', 'Ein Tuch für alle Bereiche nutzen'], correct: [0, 1, 2], multi: true }
  ],

  // ===== POLITIK & WIRTSCHAFT =====
  pol: [
    { q: 'Was regelt das Arbeitsrecht?', a: ['Beziehung Arbeitgeber-Arbeitnehmer', 'Nur Gehälter', 'Nur Urlaub', 'Nur Kündigung'], correct: 0 },
    { q: 'Was ist eine Berufsgenossenschaft?', a: ['Unfallversicherungsträger der gewerblichen Wirtschaft', 'Gewerkschaft', 'Arbeitgeberverband', 'Prüfungsamt'], correct: 0 },
    { q: 'Was bedeutet Tarifvertrag?', a: ['Vereinbarung über Arbeitsbedingungen zwischen Gewerkschaft und Arbeitgeber', 'Mietvertrag', 'Kaufvertrag', 'Versicherungsvertrag'], correct: 0 },
    // Grundgesetz Art. 1
    { q: 'Was besagt Artikel 1 des Grundgesetzes?', a: ['Die Würde des Menschen ist unantastbar', 'Jeder darf alles', 'Steuern müssen bezahlt werden', 'Autos haben Vorfahrt'], correct: 0 },
    // Bundestag/Bundesrat
    { q: 'Was ist eine wichtige Aufgabe des Bundestags?', a: ['Gesetze beschließen', 'Straßen bauen', 'Schulen leiten', 'Müll abholen'], correct: 0 },
    { q: 'Welche Aufgaben hat der Bundestag? (Mehrere richtig)', a: ['Gesetze beschließen', 'Bundeskanzler wählen', 'Regierung kontrollieren', 'Haushalt beschließen'], correct: [0, 1, 2, 3], multi: true },
    { q: 'Was ist eine wichtige Aufgabe des Bundesrats?', a: ['Mitwirkung bei der Gesetzgebung (Länderkammer)', 'Bundeskanzler wählen', 'Bundespräsident sein', 'Olympische Spiele organisieren'], correct: 0 },
    { q: 'Welche Aufgaben hat der Bundesrat? (Mehrere richtig)', a: ['Mitwirkung bei Bundesgesetzen', 'Vertretung der Länderinteressen', 'Zustimmung bei Verfassungsänderungen', 'Bundeskanzler wählen'], correct: [0, 1, 2], multi: true },
    // Bundespräsident
    { q: 'Wer ist (war) Bundespräsident? (Stand 2024)', a: ['Frank-Walter Steinmeier', 'Olaf Scholz', 'Angela Merkel', 'Robert Habeck'], correct: 0 },
    { q: 'Was ist eine Aufgabe des Bundespräsidenten?', a: ['Gesetze unterzeichnen und verkünden', 'Gesetze beschließen', 'Steuern erheben', 'Polizei leiten'], correct: 0 },
    // Bundesversammlung
    { q: 'Was ist die Aufgabe der Bundesversammlung?', a: ['Wahl des Bundespräsidenten', 'Wahl des Bundeskanzlers', 'Gesetze beschließen', 'Verträge unterschreiben'], correct: 0 },
    // Minister (Kabinett Scholz)
    { q: 'Wer war Finanzminister im Kabinett Scholz?', a: ['Christian Lindner (FDP)', 'Robert Habeck (Grüne)', 'Nancy Faeser (SPD)', 'Karl Lauterbach (SPD)'], correct: 0 },
    { q: 'Wer war Wirtschaftsminister im Kabinett Scholz?', a: ['Robert Habeck (Grüne)', 'Christian Lindner (FDP)', 'Nancy Faeser (SPD)', 'Annalena Baerbock (Grüne)'], correct: 0 },
    { q: 'Wer war Innenministerin im Kabinett Scholz?', a: ['Nancy Faeser (SPD)', 'Annalena Baerbock (Grüne)', 'Christian Lindner (FDP)', 'Robert Habeck (Grüne)'], correct: 0 },
    { q: 'Wer war Außenministerin im Kabinett Scholz?', a: ['Annalena Baerbock (Grüne)', 'Nancy Faeser (SPD)', 'Robert Habeck (Grüne)', 'Christine Lambrecht (SPD)'], correct: 0 },
    { q: 'Wer war Gesundheitsminister im Kabinett Scholz?', a: ['Karl Lauterbach (SPD)', 'Robert Habeck (Grüne)', 'Christian Lindner (FDP)', 'Nancy Faeser (SPD)'], correct: 0 },
    // Tarifvertragsarten
    { q: 'Was ist eine Tarifvertragsart?', a: ['Manteltarifvertrag (regelt allgemeine Arbeitsbedingungen)', 'Mietvertrag', 'Kaufvertrag', 'Handyvertrag'], correct: 0 },
    { q: 'Welche Tarifvertragsarten gibt es? (Mehrere richtig)', a: ['Manteltarifvertrag', 'Entgelttarifvertrag', 'Rahmentarifvertrag', 'Mietvertrag'], correct: [0, 1, 2], multi: true },
    // Tarifbegriffe
    { q: 'Was bedeutet Tarifautonomie?', a: ['Recht von Gewerkschaften und Arbeitgebern, Tarife selbst auszuhandeln', 'Automatische Lohnerhöhung', 'Staatliche Lohnfestsetzung', 'Verbot von Gewerkschaften'], correct: 0 },
    { q: 'Was bedeutet Unabdingbarkeit beim Tarifvertrag?', a: ['Tarifvertrag darf nicht zum Nachteil des Arbeitnehmers unterschritten werden', 'Kündigung ist unmöglich', 'Vertrag kann jederzeit geändert werden', 'Vertrag hat kein Ende'], correct: 0 },
    { q: 'Was bedeutet Allgemeinverbindlichkeit?', a: ['Tarifvertrag gilt für alle Arbeitnehmer einer Branche (auch Nicht-Gewerkschaftsmitglieder)', 'Gilt nur für Gewerkschaftsmitglieder', 'Gilt nur in Bayern', 'Gilt nur für Beamte'], correct: 0 },
    { q: 'Was bedeutet Friedenspflicht?', a: ['Während der Tariflaufzeit keine Streiks über tarifliche Themen', 'Kein Krieg in Deutschland', 'Friedliche Verhandlungen', 'Verbot von Demonstrationen'], correct: 0 },
    // Demokratische Wahlen
    { q: 'Was ist ein Grundsatz demokratischer Wahlen?', a: ['Geheim (niemand sieht, was man wählt)', 'Öffentlich (jeder sieht, was man wählt)', 'Nur für Männer', 'Nur für Reiche'], correct: 0 },
    { q: 'Welche sind Grundsätze demokratischer Wahlen? (Mehrere richtig)', a: ['Allgemein', 'Geheim', 'Frei', 'Öffentlich'], correct: [0, 1, 2], multi: true },
    // Gesellschaftsformen
    { q: 'Welche Gesellschaftsform ist im Handelsregister eingetragen?', a: ['Gesellschaft mit beschränkter Haftung (GmbH)', 'Einzelunternehmen ohne Kaufmannseigenschaft', 'Verein', 'Stiftung'], correct: 0 },
    { q: 'Welche Gesellschaftsformen gibt es? (Mehrere richtig)', a: ['Gesellschaft mit beschränkter Haftung', 'Aktiengesellschaft', 'Offene Handelsgesellschaft', 'Kommanditgesellschaft'], correct: [0, 1, 2, 3], multi: true },
    // Sozialversicherungen
    { q: 'Welche Sozialversicherung gibt es?', a: ['Krankenversicherung', 'Autoversicherung', 'Handyversicherung', 'Reiseversicherung'], correct: 0 },
    { q: 'Welche der folgenden zählen zur gesetzlichen Sozialversicherung? (Mehrere richtig)', a: ['Krankenversicherung', 'Rentenversicherung', 'Arbeitslosenversicherung', 'Autoversicherung'], correct: [0, 1, 2], multi: true },
    // Geschäftsfähigkeit
    { q: 'Wer ist geschäftsunfähig?', a: ['Kinder unter 7 Jahren', 'Kinder unter 18 Jahren', 'Alle Minderjährigen', 'Niemand'], correct: 0 },
    { q: 'Wer ist beschränkt geschäftsfähig?', a: ['Minderjährige von 7-17 Jahren', 'Alle unter 21', 'Nur Kinder unter 7', 'Alle Erwachsenen'], correct: 0 },
    { q: 'Ab wann ist man voll geschäftsfähig?', a: ['Ab 18 Jahren', 'Ab 16 Jahren', 'Ab 21 Jahren', 'Ab 14 Jahren'], correct: 0 },
    // Umweltschutz
    { q: 'Was ist eine Umweltschutzmaßnahme im Schwimmbad?', a: ['Solaranlage für Warmwasser', 'Mehr Chlor verwenden', 'Längere Öffnungszeiten', 'Mehr Parkplätze bauen'], correct: 0 },
    { q: 'Welche Umweltschutzmaßnahmen gibt es im Schwimmbad? (Mehrere richtig)', a: ['Solarenergie nutzen', 'Wärmerückgewinnung', 'Regenwassernutzung', 'LED-Beleuchtung'], correct: [0, 1, 2, 3], multi: true },
    // Mutterschutz
    { q: 'Wie viele Wochen gilt das Beschäftigungsverbot nach der Entbindung?', a: ['8 Wochen', '2 Wochen', '6 Wochen', '10 Wochen'], correct: 0 }
  ],

  // ===== GESUNDHEITSLEHRE =====
  health: [
    { q: 'Wie viele Knochen hat der erwachsene Mensch?', a: ['206', '150', '300', '100'], correct: 0 },
    { q: 'Was ist das größte Organ des Menschen?', a: ['Die Haut', 'Die Leber', 'Das Herz', 'Die Lunge'], correct: 0 },
    { q: 'Wie viele Liter Blut pumpt das Herz pro Tag?', a: ['Ca. 7.000 Liter', 'Ca. 1.000 Liter', 'Ca. 500 Liter', 'Ca. 10.000 Liter'], correct: 0 },
    { q: 'Was transportiert das Blut im Körper?', a: ['Sauerstoff und Nährstoffe', 'Nur Wasser', 'Nur Hormone', 'Nur CO2'], correct: 0 },
    { q: 'Welches Organ filtert das Blut?', a: ['Die Nieren', 'Die Leber', 'Die Milz', 'Das Herz'], correct: 0 },
    { q: 'Wie viele Herzkammern hat das menschliche Herz?', a: ['4', '2', '3', '6'], correct: 0 },
    { q: 'Was ist die Funktion der Lunge?', a: ['Gasaustausch (O2/CO2)', 'Blutreinigung', 'Hormonproduktion', 'Verdauung'], correct: 0 },
    { q: 'Wo findet die Verdauung hauptsächlich statt?', a: ['Im Dünndarm', 'Im Magen', 'Im Dickdarm', 'In der Speiseröhre'], correct: 0 },
    // Verdauungssystem
    { q: 'Wo werden Eiweiße bei der Verdauung gespalten?', a: ['Im Magen und Dünndarm', 'Nur im Mund', 'Nur im Dickdarm', 'In der Lunge'], correct: 0 },
    { q: 'Wo werden Kohlenhydrate gespalten?', a: ['Im Mund (Speichel) und Dünndarm', 'Nur im Magen', 'Nur im Dickdarm', 'In der Leber'], correct: 0 },
    { q: 'Wo werden Verdauungssäfte hinzugefügt?', a: ['Magen, Bauchspeicheldrüse, Gallenblase', 'Nur im Mund', 'Nur im Dickdarm', 'Nur in der Lunge'], correct: 0 },
    { q: 'Wo wird bei der Verdauung Wasser entzogen?', a: ['Im Dickdarm', 'Im Magen', 'Im Mund', 'In der Speiseröhre'], correct: 0 },
    { q: 'Was gehört zum Verdauungssystem? (Mehrere richtig)', a: ['Speiseröhre', 'Magen', 'Dünndarm', 'Bauchspeicheldrüse'], correct: [0, 1, 2, 3], multi: true },
    // Blutkreislauf
    { q: 'Was folgt im Blutkreislauf auf den rechten Vorhof?', a: ['Rechte Herzkammer', 'Linke Herzkammer', 'Aorta', 'Lunge'], correct: 0 },
    { q: 'Wohin pumpt die rechte Herzkammer das Blut?', a: ['In die Lungenarterie zur Lunge', 'In den Körper', 'Ins Gehirn', 'In den Magen'], correct: 0 },
    { q: 'Welche Reihenfolge ist im Blutkreislauf korrekt?', a: ['Rechter Vorhof → Rechte Kammer → Lunge → Linker Vorhof', 'Linker Vorhof → Lunge → Rechter Vorhof', 'Aorta → Lunge → Herz', 'Lunge → Magen → Herz'], correct: 0 },
    // Herz-Reiz-Leitungssystem
    { q: 'Was ist die Funktion des Herz-Reiz-Leitungssystems?', a: ['Koordinierte elektrische Erregung für rhythmischen Herzschlag', 'Blut transportieren', 'Sauerstoff speichern', 'Hormone produzieren'], correct: 0 },
    { q: 'Wo beginnt die Erregung im Herz-Reiz-Leitungssystem?', a: ['Sinusknoten', 'AV-Knoten', 'His-Bündel', 'Purkinje-Fasern'], correct: 0 },
    { q: 'Wie ist die Reihenfolge im Herz-Reiz-Leitungssystem?', a: ['Sinusknoten → AV-Knoten → His-Bündel → Purkinje-Fasern', 'AV-Knoten → Sinusknoten → Purkinje-Fasern', 'His-Bündel → Sinusknoten → AV-Knoten', 'Purkinje-Fasern → His-Bündel → Sinusknoten'], correct: 0 },

    // ===== PRÜFUNGSFACH 1: GESUNDHEITSLEHRE (Fragen 158-272) =====

    // --- UNTERKÜHLUNG UND KÄLTESCHÄDEN (Fragen 158-160) ---
    // Frage 158: Unterkühlung erkennen und Maßnahmen
    { q: 'Woran erkennt man eine Unterkühlung?', a: ['Kältezittern, blaue Lippen, Apathie, verlangsamte Reaktionen', 'Rotes Gesicht', 'Schwitzen', 'Hyperaktivität'], correct: 0 },
    { q: 'Welche Maßnahmen sind bei Unterkühlung zu treffen?', a: ['Langsam aufwärmen, nasse Kleidung entfernen, warme Getränke (bei Bewusstsein)', 'Schnell in heißes Wasser', 'Alkohol geben', 'Massieren'], correct: 0 },
    // Frage 159: Warum unnötige Bewegung vermeiden bei Unterkühlung
    { q: 'Warum soll bei Unterkühlung jede unnötige Bewegung vermieden werden?', a: ['Kaltes Blut aus Extremitäten kann zum Herzstillstand führen (Bergungstod)', 'Um Energie zu sparen', 'Weil es schmerzt', 'Um nicht zu schwitzen'], correct: 0 },
    // Frage 160: Unterschied Unterkühlung und Erfrierung
    { q: 'Was ist der Unterschied zwischen Unterkühlung und Erfrierung?', a: ['Unterkühlung = Körperkerntemperatur sinkt; Erfrierung = lokale Gewebeschädigung', 'Kein Unterschied', 'Erfrierung ist weniger schlimm', 'Unterkühlung betrifft nur Hände'], correct: 0 },
    { q: 'Welche Sofortmaßnahmen führt man bei Erfrierung durch?', a: ['Langsam erwärmen, nicht reiben, steril abdecken', 'Mit Schnee abreiben', 'In heißes Wasser tauchen', 'Stark massieren'], correct: 0 },

    // --- ZELLBIOLOGIE (Fragen 161-163) ---
    // Frage 161: Aufbau einer Zelle
    { q: 'Was ist der Grundbaustein des menschlichen Körpers?', a: ['Die Zelle', 'Das Atom', 'Das Molekül', 'Das Organ'], correct: 0 },
    { q: 'Welche Bestandteile hat eine Zelle?', a: ['Zellmembran, Zytoplasma, Zellkern, Mitochondrien', 'Nur Zellkern', 'Nur Membran', 'Nur Wasser'], correct: 0 },
    // Frage 162: Zellatmung
    { q: 'Was ist die Zellatmung?', a: ['Energiegewinnung aus Nährstoffen unter Sauerstoffverbrauch', 'Atmen durch die Nase', 'Austausch in der Lunge', 'Bluttransport'], correct: 0 },
    // Frage 163: Zellflüssigkeit und Aufgaben
    { q: 'Was ist Zellflüssigkeit (Zytoplasma)?', a: ['Gallertartige Substanz im Zellinneren, in der Zellorganellen schwimmen', 'Blut in der Zelle', 'Nur Wasser', 'Der Zellkern'], correct: 0 },

    // --- WUNDEN UND INFEKTIONEN (Fragen 164-172) ---
    // Frage 164: Gefahren durch Wunden
    { q: 'Welche Gefahren entstehen durch eine Wunde?', a: ['Infektion, Blutverlust, Schmerzen, Funktionsverlust', 'Keine Gefahren', 'Nur Schmerzen', 'Nur optische Probleme'], correct: 0 },
    // Frage 165: Begriffe Krankheitserreger, Infektion, Infektionskrankheit
    { q: 'Was sind Krankheitserreger?', a: ['Mikroorganismen, die Krankheiten verursachen (Bakterien, Viren, Pilze)', 'Nur Viren', 'Nur Bakterien', 'Nur Pilze'], correct: 0 },
    { q: 'Was ist eine Infektion?', a: ['Eindringen und Vermehrung von Krankheitserregern im Körper', 'Jede Krankheit', 'Nur Fieber', 'Nur Husten'], correct: 0 },
    // Frage 166: Mikroorganismen beschreiben
    { q: 'Was sind Bakterien?', a: ['Einzellige Mikroorganismen, einige krankheitserregend', 'Viren', 'Pilze', 'Große Organismen'], correct: 0 },
    { q: 'Was sind Viren?', a: ['Infektiöse Partikel, die Wirtszellen zur Vermehrung brauchen', 'Bakterien', 'Pilze', 'Einzellige Lebewesen'], correct: 0 },
    // Frage 167: Erkrankungen durch Mikroorganismen
    { q: 'Welche Erkrankungen werden durch Bakterien verursacht?', a: ['Angina, Salmonellose, Tuberkulose', 'Grippe, Masern', 'Fußpilz', 'Malaria'], correct: 0 },
    // Frage 168: Bädertypische Krankheitserreger
    { q: 'Welche Krankheitserreger sind bädertypisch?', a: ['Pseudomonas, Legionellen, Fußpilze, Warzen (HPV)', 'Nur Erkältungsviren', 'Keine besonderen', 'Nur Bakterien'], correct: 0 },
    // Frage 169: Definition Berufskrankheit
    { q: 'Was ist eine Berufskrankheit?', a: ['Krankheit, die durch die berufliche Tätigkeit verursacht wird', 'Jede Krankheit bei der Arbeit', 'Nur Unfälle', 'Nur psychische Erkrankungen'], correct: 0 },
    // Frage 170: Was ist eine Infektion
    { q: 'Was passiert bei einer Infektion?', a: ['Erreger dringen ein, vermehren sich und lösen Reaktionen aus', 'Nur Fieber', 'Nur Schmerzen', 'Nichts Besonderes'], correct: 0 },
    // Frage 171: Häufige Infektionsquellen
    { q: 'Was sind häufige Infektionsquellen?', a: ['Tröpfchen, Schmierinfektion, kontaminierte Flächen, Wasser', 'Nur Luft', 'Nur Wasser', 'Nur Essen'], correct: 0 },
    // Frage 172: Gesundheitsspezifische Begriffe Bäderbereich
    { q: 'Was versteht man unter Desinfektion?', a: ['Abtötung/Inaktivierung von Krankheitserregern', 'Reinigung mit Wasser', 'Nur Staubwischen', 'Lüften'], correct: 0 },
    { q: 'Was ist Hygiene?', a: ['Maßnahmen zur Verhütung von Krankheiten und Erhaltung der Gesundheit', 'Nur Händewaschen', 'Nur Duschen', 'Nur Putzen'], correct: 0 },
    // Frage 173: Begriffe bakterizid, fungizid, viruzid, sporizid
    { q: 'Was bedeutet bakterizid?', a: ['Bakterien abtötend', 'Pilze abtötend', 'Viren abtötend', 'Sporen abtötend'], correct: 0 },
    { q: 'Was bedeutet fungizid?', a: ['Pilze abtötend', 'Bakterien abtötend', 'Viren abtötend', 'Sporen abtötend'], correct: 0 },
    { q: 'Was bedeutet viruzid?', a: ['Viren abtötend/inaktivierend', 'Bakterien abtötend', 'Pilze abtötend', 'Sporen abtötend'], correct: 0 },
    { q: 'Was bedeutet sporizid?', a: ['Sporen abtötend', 'Viren abtötend', 'Bakterien abtötend', 'Pilze abtötend'], correct: 0 },
    // Frage 174: Gemeinsamkeiten Bakterien und Viren
    { q: 'Was haben Bakterien und Viren gemeinsam?', a: ['Beide können Infektionskrankheiten verursachen', 'Beide haben Zellkern', 'Beide vermehren sich gleich', 'Beide sind gleich groß'], correct: 0 },
    // Frage 175: Unterschiede Viren von anderen Mikroorganismen
    { q: 'Worin unterscheiden sich Viren von Bakterien?', a: ['Viren können sich nicht selbstständig vermehren, brauchen Wirtszelle', 'Viren sind größer', 'Viren haben Zellwand', 'Kein Unterschied'], correct: 0 },
    // Frage 176: Was sind Legionellen
    { q: 'Was sind Legionellen?', a: ['Bakterien, die Legionärskrankheit (schwere Lungenentzündung) verursachen', 'Viren', 'Pilze', 'Parasiten'], correct: 0 },
    // Frage 177: Wie werden Legionellen übertragen
    { q: 'Wie werden Legionellen übertragen?', a: ['Einatmen von kontaminierten Wassertröpfchen (Aerosolen)', 'Durch Trinken', 'Von Mensch zu Mensch', 'Durch Essen'], correct: 0 },
    // Frage 178: Was ist Legionellenprophylaxe
    { q: 'Was versteht man unter Legionellenprophylaxe?', a: ['Maßnahmen zur Vermeidung von Legionellenvermehrung (Temperatur, Spülung)', 'Impfung gegen Legionellen', 'Antibiotika-Behandlung', 'Nichts tun'], correct: 0 },
    // Frage 179: Vorbeugende Maßnahmen Fußpilz
    { q: 'Welche vorbeugenden Maßnahmen gibt es gegen Fußpilz?', a: ['Füße trocknen, Badeschuhe tragen, Desinfektionsmatten nutzen', 'Barfuß laufen', 'Füße feucht lassen', 'Keine Maßnahmen nötig'], correct: 0 },
    // Frage 180: Häufigste Ursachen Fußpilz
    { q: 'Was sind die häufigsten Ursachen für Fußpilz?', a: ['Feuchtigkeit, Barfußlaufen auf kontaminierten Flächen, enges Schuhwerk', 'Kalte Füße', 'Zu viel Laufen', 'Zu wenig Schwimmen'], correct: 0 },
    // Frage 181: Fußpilz (Fußmykosen) im Schwimmbad
    { q: 'Warum ist Fußpilz im Schwimmbad häufig?', a: ['Feucht-warmes Klima, Barfußlaufen, viele Menschen auf engem Raum', 'Chlor im Wasser', 'Zu kaltes Wasser', 'Zu wenig Besucher'], correct: 0 },
    { q: 'Welche Anzeichen deuten auf Fußpilz hin?', a: ['Jucken, Rötung, Schuppen, Bläschen zwischen den Zehen', 'Kalte Füße', 'Blaue Zehen', 'Keine Symptome'], correct: 0 },
    // Frage 182: Immunsystem - Was ist das
    { q: 'Was ist das Immunsystem?', a: ['Körpereigene Abwehr gegen Krankheitserreger', 'Nur weiße Blutkörperchen', 'Nur die Haut', 'Nur Antikörper'], correct: 0 },
    // Frage 183: Möglichkeiten zur Stärkung des Immunsystems
    { q: 'Wie kann man das Immunsystem stärken?', a: ['Gesunde Ernährung, ausreichend Schlaf, Bewegung, wenig Stress', 'Nur Medikamente', 'Viel Alkohol', 'Wenig Schlaf'], correct: 0 },
    // Frage 184: Wodurch wird das Immunsystem geschwächt
    { q: 'Wodurch wird das Immunsystem geschwächt?', a: ['Stress, Schlafmangel, ungesunde Ernährung, Rauchen, Alkohol', 'Sport', 'Gesundes Essen', 'Ausreichend Schlaf'], correct: 0 },
    // Frage 185: Chlorgasunfall - Rettungskette
    { q: 'Wie ist die Rettungskette bei einem Chlorgasunfall?', a: ['Selbstschutz, Bereich absperren, Notruf, Personen retten (mit Schutz), Erste Hilfe', 'Sofort reinlaufen', 'Nur Notruf', 'Abwarten'], correct: 0 },
    // Frage 186: Anzeichen nach Chlorgas-Einatmung
    { q: 'Welche Anzeichen treten nach Chlorgas-Einatmung auf?', a: ['Reizhusten, Atemnot, Augenreizung, Übelkeit, Lungenödem möglich', 'Keine Symptome', 'Nur Müdigkeit', 'Nur Hunger'], correct: 0 },
    // Frage 187: Erste Hilfe bei Chlorgasvergiftung
    { q: 'Was ist bei einer Chlorgasvergiftung zu tun?', a: ['Frischluft, Oberkörper hoch lagern, Notruf, Ruhe, ggf. Sauerstoff', 'Viel trinken lassen', 'Flach lagern', 'Massieren'], correct: 0 },

    // --- HAUT UND SINNESORGANE (Fragen 188-191) ---
    // Frage 188: Aufbau und Funktionen der Haut
    { q: 'Welche Funktionen hat die Haut?', a: ['Schutz, Temperaturregulation, Sinnesorgan, Ausscheidung', 'Nur Schutz', 'Nur Wärme', 'Keine besonderen Funktionen'], correct: 0 },
    // Frage 189: Begriff Hautanhangsgebilde
    { q: 'Was sind Hautanhangsgebilde?', a: ['Haare, Nägel, Schweiß- und Talgdrüsen', 'Nur Haare', 'Nur Nägel', 'Muskeln'], correct: 0 },
    // Frage 190: Hautschichten und ihre Funktion
    { q: 'Welche Schicht der Haut enthält Blutgefäße und Nerven?', a: ['Die Lederhaut (Dermis)', 'Die Oberhaut (Epidermis)', 'Die Unterhaut', 'Keine Schicht'], correct: 0 },
    { q: 'Welche Funktion hat die Oberhaut (Epidermis)?', a: ['Schutzbarriere gegen Umwelteinflüsse', 'Wärmespeicherung', 'Blutversorgung', 'Fetteinlagerung'], correct: 0 },
    // Frage 191: Sinnesrezeptoren in der Haut
    { q: 'Welche Sinnesrezeptoren gibt es in der Haut?', a: ['Druck-, Berührungs-, Temperatur- und Schmerzrezeptoren', 'Nur Schmerzrezeptoren', 'Keine Rezeptoren', 'Nur Temperatur'], correct: 0 },

    // --- SKELETT UND BEWEGUNGSAPPARAT (Fragen 192-206) ---
    // Frage 192: Funktionen des Skeletts
    { q: 'Welche Funktionen hat das Skelett?', a: ['Stütze, Schutz, Bewegung, Blutbildung, Mineralstoffspeicher', 'Nur Stütze', 'Nur Schutz', 'Nur Bewegung'], correct: 0 },
    // Frage 193: Aufbau des Skeletts
    { q: 'Aus welchen Hauptteilen besteht das Skelett?', a: ['Schädel, Wirbelsäule, Brustkorb, Becken, Gliedmaßen', 'Nur Knochen', 'Nur Wirbelsäule', 'Nur Schädel'], correct: 0 },
    // Frage 194: Aufbau und Funktion des Thorax
    { q: 'Was ist der Thorax (Brustkorb)?', a: ['Knöcherner Schutzraum für Herz und Lunge aus Rippen, Brustbein, Wirbelsäule', 'Nur die Rippen', 'Der Bauch', 'Der Kopf'], correct: 0 },
    // Frage 195: Aufbau und Funktionen des Schädels
    { q: 'Welche Funktion hat der Schädel?', a: ['Schutz des Gehirns und der Sinnesorgane', 'Nur Aussehen', 'Nur Kauen', 'Nur Hören'], correct: 0 },
    // Frage 196: Was sind Bandscheiben und ihre Funktion
    { q: 'Was sind Bandscheiben?', a: ['Knorpelige Puffer zwischen den Wirbeln, die Stöße abfedern', 'Knochen', 'Muskeln', 'Sehnen'], correct: 0 },
    // Frage 197: Was ist ein Bandscheibenvorfall
    { q: 'Was ist ein Bandscheibenvorfall?', a: ['Austritt des Bandscheibenkerns, der auf Nerven drücken kann', 'Gebrochene Bandscheibe', 'Entzündung', 'Verschleiß'], correct: 0 },
    // Frage 198: Bewegungsmöglichkeiten der Wirbelsäule
    { q: 'Welche Bewegungen kann die Wirbelsäule ausführen?', a: ['Beugung, Streckung, Seitneigung, Rotation', 'Nur Beugung', 'Keine Bewegung', 'Nur Streckung'], correct: 0 },
    { q: 'Welche Muskeln sind an der Bewegung der Wirbelsäule beteiligt?', a: ['Rückenstrecker, Bauchmuskeln, seitliche Rumpfmuskeln', 'Nur Armmuskeln', 'Nur Beinmuskeln', 'Keine Muskeln'], correct: 0 },
    // Frage 199: Skelett federt Stöße beim Laufen ab
    { q: 'Wie federt das Skelett Stöße beim Laufen ab?', a: ['Durch Gewölbe des Fußes, Gelenke und Krümmungen der Wirbelsäule', 'Gar nicht', 'Nur durch Muskeln', 'Nur durch Haut'], correct: 0 },
    // Frage 200: Gelenktypen
    { q: 'Welche Gelenktypen gibt es?', a: ['Kugelgelenk, Scharniergelenk, Sattelgelenk, Drehgelenk', 'Nur Kugelgelenk', 'Nur ein Typ', 'Keine verschiedenen Typen'], correct: 0 },
    { q: 'Was ist ein Beispiel für ein Kugelgelenk?', a: ['Schultergelenk, Hüftgelenk', 'Kniegelenk', 'Ellbogengelenk', 'Fingergelenk'], correct: 0 },
    // Frage 201: Gelenke beim Brustschwimmen
    { q: 'Welche Gelenke werden beim Brustschwimmen extrem belastet?', a: ['Kniegelenk und Hüftgelenk (durch Grätschbewegung)', 'Nur Schultergelenk', 'Nur Fingergelenke', 'Keine Gelenke'], correct: 0 },
    // Frage 202: Antagonisten bei Muskeln
    { q: 'Was versteht man unter Antagonisten bei Muskeln?', a: ['Gegenspieler, die entgegengesetzte Bewegungen ausführen (z.B. Bizeps-Trizeps)', 'Gleiche Muskeln', 'Helfer', 'Keine Bedeutung'], correct: 0 },
    // Frage 203: Unterschied Bänder und Sehnen
    { q: 'Was ist der Unterschied zwischen Bändern und Sehnen?', a: ['Bänder verbinden Knochen; Sehnen verbinden Muskeln mit Knochen', 'Kein Unterschied', 'Sehnen verbinden Knochen', 'Bänder verbinden Muskeln'], correct: 0 },
    // Frage 204: Belastung der Menisken
    { q: 'Bei welcher Schwimmtechnik ist die Belastung der Menisken besonders groß?', a: ['Brustschwimmen (durch Drehbewegung im Knie)', 'Kraulschwimmen', 'Rückenschwimmen', 'Delphinschwimmen'], correct: 0 },
    // Frage 205: Knochen beweglich verbunden
    { q: 'Wie sind Knochen beweglich miteinander verbunden?', a: ['Durch Gelenke', 'Durch Muskeln', 'Durch Haut', 'Gar nicht'], correct: 0 },
    // Frage 206: Gefahren einseitiges Muskelgruppentraining
    { q: 'Welche Gefahren bestehen durch einseitiges Muskelgruppentraining?', a: ['Muskuläre Dysbalancen, Fehlhaltungen, erhöhte Verletzungsgefahr', 'Keine Gefahren', 'Nur Langeweile', 'Zu viel Kraft'], correct: 0 },

    // --- MUSKULATUR (Fragen 207-210) ---
    // Frage 207: Unterschied glatte und quer gestreifte Muskulatur
    { q: 'Was ist der Unterschied zwischen glatter und quer gestreifter Muskulatur?', a: ['Glatt = unwillkürlich (Organe); Quer gestreift = willkürlich (Skelettmuskeln)', 'Kein Unterschied', 'Glatt ist stärker', 'Quer gestreift arbeitet langsamer'], correct: 0 },
    // Frage 208: Funktion des Herzens im Blutkreislauf
    { q: 'Wozu dient das Herz im Blutkreislauf?', a: ['Als Pumpe, die Blut durch den Körper transportiert', 'Zur Blutreinigung', 'Zur Sauerstoffproduktion', 'Zur Verdauung'], correct: 0 },
    // Frage 209: Arbeitsweise des Herzens
    { q: 'Wie arbeitet das Herz?', a: ['Rhythmisches Zusammenziehen (Systole) und Entspannen (Diastole)', 'Dauerhaft angespannt', 'Nur bei Belastung', 'Unregelmäßig'], correct: 0 },
    // Frage 210: Diastolischer und systolischer Blutdruck
    { q: 'Was ist der diastolische Blutdruck?', a: ['Der untere Wert - Druck in den Gefäßen bei Herzentspannung', 'Der obere Wert', 'Der Durchschnitt', 'Der Puls'], correct: 0 },
    { q: 'Was ist der systolische Blutdruck?', a: ['Der obere Wert - Druck bei Herzkontraktion', 'Der untere Wert', 'Der Durchschnitt', 'Der Puls'], correct: 0 },

    // --- HERZ-KREISLAUF-SYSTEM (Fragen 211-232) ---
    // Frage 211: Herz schlägt schneller bei psychischer Erregung
    { q: 'Warum schlägt das Herz bei psychischer Erregung schneller?', a: ['Adrenalin wird ausgeschüttet und erhöht Herzfrequenz und Blutdruck', 'Weil es müde wird', 'Durch Kälte', 'Ohne Grund'], correct: 0 },
    // Frage 212-216: Blutkreislauf
    { q: 'Welche Funktionen hat der Blutkreislauf?', a: ['Transport von O2, CO2, Nährstoffen, Hormonen, Wärme', 'Nur Sauerstofftransport', 'Nur Wärme', 'Keine Funktion'], correct: 0 },
    // Frage 217: Kleiner und großer Blutkreislauf
    { q: 'Was beschreibt der kleine Blutkreislauf?', a: ['Lungenkreislauf: Herz → Lunge → Herz (Gasaustausch)', 'Kreislauf im Bein', 'Kreislauf im Arm', 'Der ganze Körper'], correct: 0 },
    { q: 'Was beschreibt der große Blutkreislauf?', a: ['Körperkreislauf: Herz → Körper → Herz (Versorgung der Organe)', 'Nur die Lunge', 'Nur das Gehirn', 'Nur die Beine'], correct: 0 },
    // Frage 218: Körperkreislauf und Lungenkreislauf
    { q: 'Was versteht man unter dem Körperkreislauf?', a: ['Transport von sauerstoffreichem Blut vom Herzen zu den Organen und zurück', 'Nur Lungenblutfluss', 'Nur Gehirnversorgung', 'Nur Beine'], correct: 0 },
    // Frage 219: Drei Blutgefäße des Menschen
    { q: 'Welche drei Arten von Blutgefäßen gibt es?', a: ['Arterien, Venen, Kapillaren', 'Nur Arterien', 'Nur Venen', 'Nur Kapillaren'], correct: 0 },
    // Frage 220: Kleiner Blutkreislauf
    { q: 'Aus welchen Bauteilen besteht der kleine Blutkreislauf?', a: ['Rechte Herzhälfte, Lungenarterien, Lungenkapillaren, Lungenvenen, linker Vorhof', 'Nur Herz', 'Nur Lunge', 'Nur Arterien'], correct: 0 },
    // Frage 221: Großer Blutkreislauf
    { q: 'Aus welchen Bauteilen besteht der große Blutkreislauf?', a: ['Linke Herzhälfte, Aorta, Arterien, Kapillaren, Venen, rechter Vorhof', 'Nur Venen', 'Nur Arterien', 'Nur Kapillaren'], correct: 0 },
    // Frage 222: Was ist eine Arterie
    { q: 'Was ist eine Arterie?', a: ['Blutgefäß, das Blut vom Herzen wegführt', 'Blutgefäß zum Herzen', 'Kleinstes Blutgefäß', 'Nur in der Lunge'], correct: 0 },
    // Frage 223: Was ist eine Vene
    { q: 'Was ist eine Vene?', a: ['Blutgefäß, das Blut zum Herzen transportiert', 'Blutgefäß vom Herzen weg', 'Nur in den Armen', 'Nur für Sauerstoff'], correct: 0 },
    // Frage 224: Erkennen einer Arterienverletzung
    { q: 'Woran erkennt man eine Arterienverletzung?', a: ['Hellrotes, pulsierend spritzendes Blut', 'Dunkelrotes, gleichmäßig fließendes Blut', 'Kein Blut', 'Blaues Blut'], correct: 0 },
    // Frage 225: Maßnahmen bei Schlagaderverletzung am Arm
    { q: 'Welche Maßnahmen ergreift man bei einer Schlagaderverletzung am Arm?', a: ['Druckverband, Arm hoch, ggf. Abdrücken der Arterie, Notruf', 'Nichts tun', 'Kühlen', 'Wärmen'], correct: 0 },
    // Frage 226: Was ist eine Kapillare
    { q: 'Was ist eine Kapillare?', a: ['Kleinstes Blutgefäß für Stoffaustausch zwischen Blut und Gewebe', 'Große Arterie', 'Große Vene', 'Ein Muskel'], correct: 0 },
    // Frage 227: Einrichtung Venen - Blutfließrichtung
    { q: 'Welche Einrichtung haben Venen, um die Blutfließrichtung festzulegen?', a: ['Venenklappen, die Rückfluss verhindern', 'Keine Einrichtung', 'Muskeln', 'Nerven'], correct: 0 },
    // Frage 228: Taschenklappen im Kreislaufsystem
    { q: 'Wo existieren im Kreislaufsystem Taschenklappen?', a: ['Am Herz (Aorten- und Pulmonalklappe) und in den Venen', 'Nur in Arterien', 'Nirgends', 'Nur im Gehirn'], correct: 0 },
    // Frage 229: Segelklappen im Kreislaufsystem
    { q: 'Wo sind im Herz Segelklappen zu finden?', a: ['Zwischen Vorhöfen und Kammern (Mitral- und Trikuspidalklappe)', 'Am Herzausgang', 'In den Venen', 'In den Arterien'], correct: 0 },
    // Frage 230: Blutkörperchen und Funktionen
    { q: 'Welche Funktion haben rote Blutkörperchen (Erythrozyten)?', a: ['Sauerstofftransport durch Hämoglobin', 'Immunabwehr', 'Blutgerinnung', 'Nährstofftransport'], correct: 0 },
    { q: 'Welche Funktion haben weiße Blutkörperchen (Leukozyten)?', a: ['Immunabwehr gegen Krankheitserreger', 'Sauerstofftransport', 'Blutgerinnung', 'Nährstofftransport'], correct: 0 },
    { q: 'Welche Funktion haben Blutplättchen (Thrombozyten)?', a: ['Blutgerinnung bei Verletzungen', 'Sauerstofftransport', 'Immunabwehr', 'Hormontransport'], correct: 0 },
    // Frage 231: Funktion der Herzkranzgefäße
    { q: 'Wozu dienen die Herzkranzgefäße?', a: ['Versorgung des Herzmuskels selbst mit Sauerstoff und Nährstoffen', 'Versorgung der Lunge', 'Versorgung des Gehirns', 'Bluttransport in die Beine'], correct: 0 },
    // Frage 232: Sauerstoffversorgung des Herzmuskels
    { q: 'Wodurch erfolgt die Sauerstoffversorgung des Herzmuskels?', a: ['Durch die Koronararterien (Herzkranzgefäße)', 'Durch das Blut in den Herzkammern', 'Durch die Lunge direkt', 'Durch die Luft'], correct: 0 },

    // --- ATMUNGSSYSTEM (Fragen 233-260) ---
    // Frage 233: Was passiert wenn der Sinusknoten ausfällt
    { q: 'Was passiert, wenn der Sinusknoten ausfällt?', a: ['AV-Knoten übernimmt als Ersatz-Schrittmacher mit niedrigerer Frequenz', 'Herzstillstand sofort', 'Nichts passiert', 'Herz schlägt schneller'], correct: 0 },
    // Frage 234: Behandlung Schlagaderverletzungen
    { q: 'Wie behandelt man Verletzungen von Schlagadern an Gliedmaßen?', a: ['Druckverband, Hochlagern, Abdrücken proximal der Wunde, Notruf', 'Nur kühlen', 'Nichts tun', 'Nur Pflaster'], correct: 0 },
    // Frage 235: Wichtigste Anzeichen Schock
    { q: 'Was sind die wichtigsten Anzeichen eines Schocks?', a: ['Blässe, kalter Schweiß, schneller flacher Puls, Unruhe, Bewusstseinstrübung', 'Rotes Gesicht', 'Langsamer Puls', 'Warme Haut'], correct: 0 },
    // Frage 236: Was ist ein Schlaganfall
    { q: 'Was ist ein Schlaganfall?', a: ['Durchblutungsstörung oder Blutung im Gehirn mit neurologischen Ausfällen', 'Herzinfarkt', 'Ohnmacht', 'Kopfschmerzen'], correct: 0 },
    { q: 'Was sind mögliche Ursachen eines Schlaganfalls?', a: ['Hirninfarkt (Gefäßverschluss) oder Hirnblutung', 'Nur Stress', 'Nur Müdigkeit', 'Nur Kopfschmerzen'], correct: 0 },
    { q: 'Was sind Symptome eines Schlaganfalls?', a: ['Halbseitenlähmung, Sprachstörungen, Gesichtslähmung, Sehstörungen', 'Nur Kopfschmerzen', 'Nur Müdigkeit', 'Keine Symptome'], correct: 0 },
    { q: 'Welche Sofortmaßnahmen ergreift man bei Schlaganfall?', a: ['Notruf 112, Oberkörper erhöht lagern, beruhigen, Vitalzeichen überwachen', 'Schlafen lassen', 'Viel trinken geben', 'Massieren'], correct: 0 },
    // Frage 237: Drei Organe des Lymphsystems
    { q: 'Welche Organe gehören zum Lymphsystem?', a: ['Lymphknoten, Milz, Thymus', 'Nur Herz', 'Nur Lunge', 'Nur Nieren'], correct: 0 },
    // Frage 238: Aufgaben von Lymphknoten
    { q: 'Welche Aufgaben haben Lymphknoten?', a: ['Filtern der Lymphe, Immunabwehr, Bildung von Lymphozyten', 'Blut pumpen', 'Verdauung', 'Atmung'], correct: 0 },
    // Frage 239: Wodurch kann Atemfunktion gestört sein
    { q: 'Wodurch kann die Atemfunktion gestört sein?', a: ['Verlegung der Atemwege, Lungenerkrankungen, Thoraxverletzungen, Vergiftung', 'Nur durch Erkältung', 'Gar nicht', 'Nur im Schlaf'], correct: 0 },
    // Frage 240: Innere und äußere Atmung
    { q: 'Was unterscheidet innere von äußerer Atmung?', a: ['Äußere = Gasaustausch Lunge; Innere = Zellatmung', 'Kein Unterschied', 'Innere = Einatmen', 'Äußere = Ausatmen'], correct: 0 },
    // Frage 241: Obere und untere Atemwege
    { q: 'Was gehört zu den oberen Atemwegen?', a: ['Nase, Nasennebenhöhlen, Rachen, Kehlkopf', 'Nur die Lunge', 'Nur die Bronchien', 'Nur die Luftröhre'], correct: 0 },
    { q: 'Was gehört zu den unteren Atemwegen?', a: ['Luftröhre, Bronchien, Bronchiolen, Lungenbläschen', 'Nur die Nase', 'Nur der Rachen', 'Nur der Kehlkopf'], correct: 0 },
    // Frage 242: Was versteht man unter Brustatmung
    { q: 'Was versteht man unter Brustatmung?', a: ['Erweiterung des Brustkorbs durch Zwischenrippenmuskeln', 'Atmung in den Bauch', 'Nur Ausatmen', 'Atmung durch den Mund'], correct: 0 },
    // Frage 243: Was ist ein Stimmritzenkrampf
    { q: 'Was ist ein Stimmritzenkrampf?', a: ['Krampfhafter Verschluss der Stimmritze, der Atmen verhindert', 'Heiserkeit', 'Husten', 'Sprechen'], correct: 0 },
    // Frage 244: Vorgang der Zwerchfellatmung
    { q: 'Wie funktioniert die Zwerchfellatmung (Bauchatmung)?', a: ['Zwerchfell kontrahiert und senkt sich → Lunge dehnt sich → Einatmung', 'Zwerchfell hebt sich', 'Nur mit Rippen', 'Nur beim Sport'], correct: 0 },
    // Frage 245: Inspiration und Exspiration
    { q: 'Was versteht man unter Inspiration?', a: ['Einatmung', 'Ausatmung', 'Atemanhalten', 'Husten'], correct: 0 },
    { q: 'Was versteht man unter Exspiration?', a: ['Ausatmung', 'Einatmung', 'Atemanhalten', 'Niesen'], correct: 0 },
    // Frage 246: Atemfrequenz und Vitalkapazität
    { q: 'Was ist die normale Atemfrequenz beim Erwachsenen?', a: ['12-20 Atemzüge pro Minute', '5-8 pro Minute', '30-40 pro Minute', '50-60 pro Minute'], correct: 0 },
    { q: 'Was ist die Vitalkapazität?', a: ['Maximales Luftvolumen, das nach maximaler Einatmung ausgeatmet werden kann', 'Normales Atemvolumen', 'Totraum', 'Residualvolumen'], correct: 0 },
    // Frage 247: Atemzugvolumen und Vitalkapazität
    { q: 'Was ist das normale Atemzugvolumen beim Erwachsenen?', a: ['Ca. 500 ml', 'Ca. 100 ml', 'Ca. 2000 ml', 'Ca. 5000 ml'], correct: 0 },
    // Frage 248: Totraum bei der Atmung
    { q: 'Was versteht man unter dem Totraum bei der Atmung?', a: ['Luftvolumen in den Atemwegen ohne Gasaustausch (ca. 150 ml)', 'Die Lunge', 'Das Zwerchfell', 'Der Magen'], correct: 0 },
    // Frage 249: Auswirkungen der Pressatmung
    { q: 'Welche Auswirkungen hat die Pressatmung?', a: ['Blutdruckanstieg, Rückstau in Venen, mögliche Ohnmacht', 'Keine Auswirkungen', 'Bessere Atmung', 'Mehr Sauerstoff'], correct: 0 },
    // Frage 250: Ursachen und Auswirkungen Hyperventilation
    { q: 'Was ist Hyperventilation?', a: ['Übermäßig schnelle und tiefe Atmung mit CO2-Abfall', 'Zu langsame Atmung', 'Normales Atmen', 'Atemanhalten'], correct: 0 },
    { q: 'Was sind Auswirkungen der Hyperventilation?', a: ['Kribbeln, Schwindel, Muskelkrämpfe, Ohnmacht möglich', 'Mehr Energie', 'Bessere Konzentration', 'Keine Auswirkungen'], correct: 0 },
    // Frage 251: Warum ist Hyperventilation vor Tauchgang gefährlich
    { q: 'Warum ist Hyperventilation vor einem Tauchgang gefährlich?', a: ['CO2-Mangel verzögert Atemreflex → Bewusstlosigkeit unter Wasser möglich', 'Mehr Luft zum Tauchen', 'Bessere Leistung', 'Keine Gefahr'], correct: 0 },
    // Frage 252: Warum sind überlange Schnorchel verboten
    { q: 'Warum sind überlange Schnorchel (>35 cm) verboten?', a: ['Zu viel Totraum → Rückatmung von CO2 → Vergiftungsgefahr', 'Sehen schlecht aus', 'Zu schwer', 'Zu teuer'], correct: 0 },
    // Frage 253: Welches Gewebe kleidet Luftröhre und Bronchien aus
    { q: 'Welches Gewebe kleidet Luftröhre und Bronchien aus?', a: ['Flimmerepithel mit Schleimschicht', 'Haut', 'Muskelgewebe', 'Knochengewebe'], correct: 0 },
    // Frage 254: Funktion des Flimmerepithels in Bronchien
    { q: 'Welche Funktion hat das Flimmerepithel in den Bronchien?', a: ['Transport von Schleim und Fremdpartikeln nach oben', 'Gasaustausch', 'Sauerstoffproduktion', 'Bluttransport'], correct: 0 },
    // Frage 255: Was passiert wenn Flimmerepithel beschädigt
    { q: 'Was passiert, wenn das Flimmerepithel in den Bronchien oder der Luftröhre beschädigt ist?', a: ['Selbstreinigung gestört → erhöhte Infektanfälligkeit', 'Bessere Atmung', 'Nichts', 'Mehr Sauerstoff'], correct: 0 },
    // Frage 256: Wo sitzt das Atemzentrum
    { q: 'Wo sitzt das Atemzentrum und welche Aufgaben hat es?', a: ['Im Hirnstamm (verlängertes Mark) - steuert Atemrhythmus automatisch', 'Im Herz', 'In der Lunge', 'Im Magen'], correct: 0 },
    // Frage 257: Blutgase beeinflussen Atemzentrum
    { q: 'Welche Blutgase beeinflussen die Tätigkeit des Atemzentrums?', a: ['CO2 (Kohlendioxid) und O2 (Sauerstoff)', 'Nur Stickstoff', 'Nur Helium', 'Keine Gase'], correct: 0 },
    // Frage 258: Maßnahmen Kind Luftwege durch Fremdkörper blockiert
    { q: 'Welche Maßnahmen ergreifen Sie, wenn bei einem Kind die Luftwege durch Fremdkörper blockiert sind (Kind bei Bewusstsein)?', a: ['Rückenschläge, Heimlich-Handgriff (bei älteren Kindern), Notruf', 'Abwarten', 'Kind schütteln', 'Wasser geben'], correct: 0 },
    // Frage 259: Anteil CO2 in normaler Umgebungsluft
    { q: 'Wie hoch ist der Anteil an Kohlendioxid in der normalen Umgebungsluft?', a: ['Ca. 0,04%', 'Ca. 21%', 'Ca. 78%', 'Ca. 10%'], correct: 0 },
    // Frage 260: Prozentuale Anteile der Atemgase
    { q: 'Wie hoch sind die prozentualen Anteile der Atemgase in der normalen Umgebungsluft?', a: ['Ca. 78% Stickstoff, 21% Sauerstoff, 0,04% CO2', '50% Sauerstoff, 50% Stickstoff', '100% Sauerstoff', '90% CO2'], correct: 0 },
    { q: 'Wie verändert sich die Zusammensetzung in der Ausatemluft?', a: ['O2 sinkt auf ca. 16%, CO2 steigt auf ca. 4%', 'Bleibt gleich', 'Mehr O2', 'Kein CO2'], correct: 0 },

    // --- NERVENSYSTEM (Fragen 261-262) ---
    // Frage 261: Zentrales und peripheres Nervensystem
    { q: 'Was unterscheidet das zentrale vom peripheren Nervensystem?', a: ['ZNS = Gehirn + Rückenmark; PNS = Nerven im restlichen Körper', 'Kein Unterschied', 'PNS ist im Kopf', 'ZNS ist in den Beinen'], correct: 0 },
    // Frage 262: Willkürliches und unwillkürliches Nervensystem
    { q: 'Was unterscheidet das willkürliche vom unwillkürlichen Nervensystem?', a: ['Willkürlich = bewusst steuerbar (Bewegung); Unwillkürlich = automatisch (Herzschlag, Verdauung)', 'Kein Unterschied', 'Beide sind steuerbar', 'Beide sind automatisch'], correct: 0 },

    // --- GEHÖR UND GLEICHGEWICHT (Fragen 263-267) ---
    // Frage 263: Abschnitte des Gehörgangs
    { q: 'Welche Abschnitte hat das Gehör?', a: ['Außenohr, Mittelohr, Innenohr', 'Nur Ohrmuschel', 'Nur Trommelfell', 'Nur Schnecke'], correct: 0 },
    // Frage 264: Aufgaben des Trommelfells
    { q: 'Welche Aufgaben hat das Trommelfell?', a: ['Schallübertragung auf die Gehörknöchelchen', 'Gleichgewicht', 'Riechen', 'Sehen'], correct: 0 },
    // Frage 265: Warum Schläge auf wassergefüllte Ohren gefährlich
    { q: 'Warum sind Schläge auf das wassergefüllte Ohr gefährlich?', a: ['Druckwelle kann Trommelfell zum Platzen bringen', 'Wasser wird wärmer', 'Besseres Hören', 'Keine Gefahr'], correct: 0 },
    // Frage 266: Druckausgleich im Mittelohr
    { q: 'Welches Organ dient dem Druckausgleich des Mittelohrs?', a: ['Eustachische Röhre (Ohrtrompete)', 'Trommelfell', 'Gehörknöchelchen', 'Innenohr'], correct: 0 },
    { q: 'Wie kann man einen Druckausgleich durchführen?', a: ['Nase zuhalten und gegen geschlossene Nase ausatmen (Valsalva)', 'Schreien', 'Kopf schütteln', 'Gar nicht'], correct: 0 },
    // Frage 267: Warum nicht bei Erkältung tauchen
    { q: 'Warum darf man bei einer Erkältungskrankheit nicht tauchen?', a: ['Druckausgleich gestört durch geschwollene Schleimhäute → Barotrauma-Gefahr', 'Wasser ist zu kalt', 'Zu anstrengend', 'Keine Gefahr'], correct: 0 },

    // --- HORMONE UND STOFFWECHSEL (Fragen 268-272) ---
    // Frage 268: Hormone Insulin und Adrenalin
    { q: 'Welche Rolle spielt Insulin im Stoffhaushalt?', a: ['Senkt Blutzuckerspiegel, ermöglicht Glukoseaufnahme in Zellen', 'Erhöht Blutzucker', 'Für Verdauung', 'Für Atmung'], correct: 0 },
    { q: 'Welche Rolle spielt Adrenalin im Stoffhaushalt?', a: ['Stresshormon: erhöht Herzfrequenz, Blutdruck, Blutzucker', 'Senkt Herzfrequenz', 'Für Verdauung', 'Für Schlaf'], correct: 0 },
    // Frage 269: Funktion des Hormonsystems
    { q: 'Was ist die Funktion des Hormonsystems?', a: ['Steuerung von Stoffwechsel, Wachstum, Fortpflanzung durch chemische Botenstoffe', 'Nur Verdauung', 'Nur Bewegung', 'Nur Atmung'], correct: 0 },
    // Frage 270: Enzyme bei der Verdauung
    { q: 'Welche Enzyme spielen im Mund bei der Verdauung eine Rolle?', a: ['Amylase (Speichel) - spaltet Stärke', 'Pepsin', 'Lipase', 'Trypsin'], correct: 0 },
    { q: 'Welche Enzyme spielen im Magen bei der Verdauung eine Rolle?', a: ['Pepsin - spaltet Eiweiße', 'Amylase', 'Maltase', 'Laktase'], correct: 0 },
    { q: 'Welche Enzyme sind im Darmsaft?', a: ['Maltase, Laktase, Peptidase - Endspaltung von Nährstoffen', 'Nur Amylase', 'Nur Pepsin', 'Keine Enzyme'], correct: 0 },
    // Frage 271: Lebenswichtige Aufgaben des Harnapparats
    { q: 'Welche lebenswichtigen Aufgaben erfüllt der Harnapparat?', a: ['Ausscheidung von Stoffwechselendprodukten, Wasserhaushalt, Blutdruckregulation', 'Nur Wasserausscheidung', 'Verdauung', 'Atmung'], correct: 0 },
    // Frage 272: Aufgaben der Niere
    { q: 'Welche Aufgaben erfüllt die Niere?', a: ['Blutfilterung, Urinbildung, Elektrolythaushalt, Blutdruckregulation, Hormonproduktion', 'Nur Urinbildung', 'Nur Blutfilterung', 'Verdauung'], correct: 0 }
  ]
};
