import { ORG_EXPANSION_QUESTIONS } from '../quizQuestionsExpansion.js';

export const ORG_QUESTIONS = [
    { q: 'Was ist ein Hausrecht?', a: ['Dokumentation aller Messwerte im Betriebstagebuch', 'Recht des Badbetreibers, Hausordnung durchzusetzen', 'Schulung des Personals zu Sicherheitsmaßnahmen', 'Sicherstellung der Rettungsfähigkeit des Personals'], correct: 1 },
    { q: 'Wie lange muss eine Aufsichtsperson im Bad sein?', a: ['Während der Öffnungszeiten', 'Einhaltung der Hygienevorschriften', 'Dokumentation im Betriebstagebuch', 'Regelmäßige Wasserproben dokumentieren'], correct: 0 },
    { q: 'Was regelt die Badeordnung?', a: ['Verhalten der Badegäste', 'Wassertemperatur', 'Eintrittspreise', 'Öffnungszeiten'], correct: 0 },
    // Dienstplanerstellung
    { q: 'Welcher Aspekt muss bei der Erstellung von Dienstplänen berücksichtigt werden?', a: ['Urlaubszeiten der Mitarbeiter', 'Einhaltung der DIN-Normen', 'Prüfung der Notfallausrüstung', 'Überprüfung der Rettungsgeräte'], correct: 0 },
    { q: 'Was gehört NICHT zu den Umständen bei der Dienstplanerstellung?', a: ['Qualifikation der Mitarbeiter', 'Besucherzahlen/Stoßzeiten', 'Private Hobbys der Gäste', 'Gesetzliche Ruhezeiten'], correct: 2 },
    { q: 'Welche 4 Aspekte müssen bei der Dienstplanerstellung berücksichtigt werden? (Mehrere richtig)', a: ['Qualifikation/Rettungsfähigkeit', 'Gesetzliche Arbeitszeiten', 'Urlaubsansprüche', 'Stoßzeiten/Besucherzahlen'], correct: [0, 1, 2, 3], multi: true },
    // Schulschwimmen
    { q: 'Welche Auswirkung hat die Schließung eines Schwimmbads auf das Schulschwimmen?', a: ['Längere Anfahrtswege für Schulen', 'Kontrolle der vorgeschriebenen Grenzwerte', 'Regelmäßige Kontrolle der Desinfektionsanlage', 'Einhaltung der vorgeschriebenen Umwälzzeiten'], correct: 0 },
    { q: 'Nach welchem Kriterium werden Schwimmzeiten für Schulen verteilt?', a: ['Prüfung der Beckenwasserdurchströmung auf Totzonen', 'Wer zuerst kommt', 'Anpassung der Betriebsparameter bei Abweichungen', 'Entfernung zum Bad und Schülerzahl'], correct: 3 },
    // Standortwahl Schwimmbad
    { q: 'Welches Kriterium ist bei der Standortwahl für ein neues Schwimmbad wichtig?', a: ['Nähe zu Flughäfen', 'Aktivkohle-Filtermedium erneuern', 'Gute Verkehrsanbindung', 'Kontrolle des Redoxpotentials'], correct: 2 },
    { q: 'Welche Kriterien sind für die Standortwahl eines Schwimmbads relevant? (Mehrere richtig)', a: ['Einzugsgebiet/Bevölkerungsdichte', 'ÖPNV-Anbindung', 'Parkplatzsituation', 'Anzahl der Bäckereien'], correct: [0, 1, 2], multi: true },
    // Wasseraufsicht DGfdB R 94.05
    { q: 'Welche Anforderung gilt für Personen der Wasseraufsicht nach DGfdB R 94.05?', a: ['Kontrolle der Wasseraufbereitung', 'Sicherheitskonzept regelmäßig aktualisieren', 'Rettungsfähigkeit nachgewiesen', 'Pflege der Außenanlagen'], correct: 2 },
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
    { q: 'Was wird im Betriebstagebuch zur Wasseraufbereitung eingetragen?', a: ['Namen der Badegäste', 'Chlorwerte und pH-Wert', 'Wettervorhersage', 'Anpassung der Chlordosierung'], correct: 1 },
    { q: 'Welche Einträge gehören ins Betriebstagebuch? (Mehrere richtig)', a: ['Hygiene-Hilfsparameter (Chlor, pH, Redox)', 'Filterspülungen', 'Chemikalienverbrauch', 'Störungen/Reparaturen'], correct: [0, 1, 2, 3], multi: true },
    // Angebote & Zielgruppen
    { q: 'Welches Angebot passt zur Zielgruppe "Senioren"?', a: ['Wassergymnastik', 'Überwachung der Beckenauslastung', 'Kontrolle der Zugangsbereiche', 'Schulung der Mitarbeiter'], correct: 0 },
    { q: 'Ordne Angebote zu Zielgruppen: Welche passen zusammen? (Mehrere richtig)', a: ['Babyschwimmen - Eltern mit Kleinkindern', 'Aqua-Fitness - Erwachsene', 'Schwimmkurse - Anfänger', 'Nachtbaden - Familien mit Babys'], correct: [0, 1, 2], multi: true },
    // Animationsplanung
    { q: 'Was muss bei der Planung eines Animationsangebots berücksichtigt werden?', a: ['Veränderung der Oberflächenspannung', 'Anlagerung von Metallionen', 'Zielgruppe und Teilnehmerzahl', 'Freisetzung von Kohlendioxid'], correct: 2 },
    // Marketing-Regelkreis
    { q: 'Was gehört zum Marketing-Regelkreis?', a: ['Überwachung der Filterleistung und Spülintervalle', 'Abstimmung mit dem zuständigen Gesundheitsamt', 'Regelmäßige Wartung der technischen Anlagen sicherstellen', 'Analyse - Planung - Durchführung - Kontrolle'], correct: 3 },
    // Marketing-Mix
    { q: 'Was beschreibt der Marketing-Mix?', a: ['Kombination der 4 Ps: Product, Price, Place, Promotion', 'Besucherströme lenken und steuern', 'Einhaltung der Hygienevorschriften und Qualitätsstandards', 'Personaleinsatz nach Qualifikation planen'], correct: 0 },
    // Einwintern
    { q: 'Was versteht man unter "Einwintern" eines Freibads?', a: ['Maßnahmen zum Schutz vor Frostschäden', 'Öffnung im Winter für besonders hartgesottene Schwimmer', 'Heizen des Beckens mit Solarenergie', 'Winterbaden als besonderes Angebot anbieten'], correct: 0 },
    { q: 'Welche Maßnahmen gehören zur Einwinterung eines Freibad-Sportbeckens? (Mehrere richtig)', a: ['Wasserstand absenken', 'Leitungen entleeren', 'Abdeckung anbringen', 'Wasser auf 40°C heizen'], correct: [0, 1, 2], multi: true },
    // Kassensystem
    { q: 'Was spricht für ein Computer-Kassensystem?', a: ['Automatische Umsatzerfassung', 'Mehr Personalaufwand', 'Langsamere Abfertigung', 'Höhere Fehlerquote'], correct: 0 },
    // Kassentagesabrechnung
    { q: 'Was muss auf einer Kassentagesabrechnung stehen?', a: ['Prüfung der Brandschutzeinrichtungen', 'Einweisung neuer Mitarbeiter', 'Datum und Gesamtumsatz', 'Beachtung der Arbeitszeitregelungen'], correct: 2 },
    // Public Relations
    { q: 'Was fällt unter "Public Relations"?', a: ['Zeitungsartikel über das Schwimmbad', 'Gutscheine verkaufen für ermäßigte Eintritte', 'Eintrittspreise erhöhen und anpassen', 'Personal entlassen und neu einstellen'], correct: 0 },
    // Preisdifferenzierung
    { q: 'Was ist eine "Happy Hour" im Schwimmbad?', a: ['Zeitliche Preisdifferenzierung', 'Örtliche Preisdifferenzierung', 'Preisdifferenzierung nach Zielgruppen', 'Quantitative Preisdifferenzierung'], correct: 0 },
    ...ORG_EXPANSION_QUESTIONS
];
