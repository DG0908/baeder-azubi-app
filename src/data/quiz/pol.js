import { POL_EXPANSION_QUESTIONS } from '../quizQuestionsExpansion.js';

export const POL_QUESTIONS = [
    { q: 'Was regelt das Arbeitsrecht?', a: ['Beziehung Arbeitgeber-Arbeitnehmer', 'Nur Gehälter und Lohnfortzahlung im Krankheitsfall', 'Nur Urlaubsanspruch und Sonderurlaub', 'Nur Kündigungsfristen und Abfindungsregelungen'], correct: 0 },
    { q: 'Was ist eine Berufsgenossenschaft?', a: ['Unfallversicherungsträger der gewerblichen Wirtschaft', 'Gewerkschaft, die Arbeitnehmerinteressen in Tarifverhandlungen vertritt', 'Arbeitgeberverband, der Unternehmen in Lohnverhandlungen berät', 'Staatliches Prüfungsamt für Berufsabschlüsse und Qualifikationen'], correct: 0 },
    { q: 'Was bedeutet Tarifvertrag?', a: ['Vereinbarung über Arbeitsbedingungen zwischen Gewerkschaft und Arbeitgeber', 'Mietvertrag zwischen Unternehmen und Gemeinde über die Nutzung öffentlicher Flächen', 'Kaufvertrag über die Lieferung von Betriebsmitteln zu Sonderkonditionen', 'Versicherungsvertrag für Betriebshaftpflicht und Berufsunfähigkeit'], correct: 0 },
    // Grundgesetz Art. 1
    { q: 'Was besagt Artikel 1 des Grundgesetzes?', a: ['Die Würde des Menschen ist unantastbar', 'Jeder darf alles unter Betriebsbedingungen', 'Steuern müssen bezahlt werden', 'Autos haben Vorfahrt unter Aufsicht'], correct: 0 },
    // Bundestag/Bundesrat
    { q: 'Was ist eine wichtige Aufgabe des Bundestags?', a: ['Gesetze beschließen', 'Straßen bauen', 'Schulen leiten', 'Müll abholen'], correct: 0 },
    { q: 'Welche Aufgaben hat der Bundestag? (Mehrere richtig)', a: ['Gesetze beschließen', 'Bundeskanzler wählen', 'Regierung kontrollieren', 'Haushalt beschließen'], correct: [0, 1, 2, 3], multi: true },
    { q: 'Was ist eine wichtige Aufgabe des Bundesrats?', a: ['Mitwirkung bei der Gesetzgebung (Länderkammer)', 'Bundeskanzler wählen – das Bundesrat bestimmt die Regierungsführung', 'Bundespräsident sein – der Vorsitzende des Bundesrats ist zugleich Staatsoberhaupt', 'Olympische Spiele organisieren und internationale Sportwettkämpfe vergeben'], correct: 0 },
    { q: 'Welche Aufgaben hat der Bundesrat? (Mehrere richtig)', a: ['Mitwirkung bei Bundesgesetzen', 'Vertretung der Länderinteressen', 'Zustimmung bei Verfassungsänderungen', 'Bundeskanzler wählen'], correct: [0, 1, 2], multi: true },
    // Bundespräsident
    { q: 'Wie heißt das Staatsoberhaupt der Bundesrepublik Deutschland?', a: ['Bundespräsident', 'Bundeskanzler', 'Bundestagspräsident', 'Bundesratspräsident'], correct: 0 },
    { q: 'Was ist eine Aufgabe des Bundespräsidenten?', a: ['Gesetze unterzeichnen und verkünden', 'Gesetze beschließen – der Bundespräsident initiiert die Gesetzgebung', 'Steuern erheben und über die Verwendung der Haushaltsmittel entscheiden', 'Die Polizei leiten – der Bundespräsident ist Oberbefehlshaber der Sicherheitskräfte'], correct: 0 },
    // Bundesversammlung
    { q: 'Was ist die Aufgabe der Bundesversammlung?', a: ['Wahl des Bundespräsidenten', 'Wahl des Bundeskanzlers', 'Gesetze beschließen', 'Verträge unterschreiben'], correct: 0 },
    // Minister (Kabinett Scholz)
    { q: 'Wer war Finanzminister im Kabinett Scholz?', a: ['Christian Lindner (FDP)', 'Robert Habeck (Grüne)', 'Nancy Faeser (SPD)', 'Karl Lauterbach (SPD)'], correct: 0 },
    { q: 'Wer war Wirtschaftsminister im Kabinett Scholz?', a: ['Robert Habeck (Grüne)', 'Christian Lindner (FDP)', 'Nancy Faeser (SPD)', 'Annalena Baerbock (Grüne)'], correct: 0 },
    { q: 'Wer war Innenministerin im Kabinett Scholz?', a: ['Nancy Faeser (SPD)', 'Annalena Baerbock (Grüne)', 'Christian Lindner (FDP)', 'Robert Habeck (Grüne)'], correct: 0 },
    { q: 'Wer war Außenministerin im Kabinett Scholz?', a: ['Annalena Baerbock (Grüne)', 'Nancy Faeser (SPD)', 'Robert Habeck (Grüne)', 'Christine Lambrecht (SPD)'], correct: 0 },
    { q: 'Wer war Gesundheitsminister im Kabinett Scholz?', a: ['Karl Lauterbach (SPD)', 'Robert Habeck (Grüne)', 'Christian Lindner (FDP)', 'Nancy Faeser (SPD)'], correct: 0 },
    // Tarifvertragsarten
    { q: 'Was ist eine Tarifvertragsart?', a: ['Manteltarifvertrag (regelt allgemeine Arbeitsbedingungen)', 'Mietvertrag – regelt die Nutzung von Betriebsimmobilien', 'Kaufvertrag – regelt die Beschaffung von Betriebsmitteln', 'Handyvertrag – regelt die Nutzung von Diensttelefonen'], correct: 0 },
    { q: 'Welche Tarifvertragsarten gibt es? (Mehrere richtig)', a: ['Manteltarifvertrag', 'Entgelttarifvertrag', 'Rahmentarifvertrag', 'Mietvertrag'], correct: [0, 1, 2], multi: true },
    // Tarifbegriffe
    { q: 'Was bedeutet Tarifautonomie?', a: ['Recht von Gewerkschaften und Arbeitgebern, Tarife selbst auszuhandeln', 'Automatische jährliche Lohnerhöhung entsprechend der Inflationsrate', 'Staatliche Lohnfestsetzung durch das Arbeitsministerium', 'Verbot von Gewerkschaften zugunsten staatlicher Lohnregelung'], correct: 0 },
    { q: 'Was bedeutet Unabdingbarkeit beim Tarifvertrag?', a: ['Tarifvertrag darf nicht zum Nachteil des Arbeitnehmers unterschritten werden', 'Kündigung ist während der Tariflaufzeit vollständig ausgeschlossen', 'Vertrag kann jederzeit einvernehmlich geändert werden', 'Vertrag läuft unbegrenzt weiter und hat kein automatisches Ende'], correct: 0 },
    { q: 'Was bedeutet Allgemeinverbindlichkeit?', a: ['Tarifvertrag gilt für alle Arbeitnehmer einer Branche (auch Nicht-Gewerkschaftsmitglieder)', 'Gilt nur für Gewerkschaftsmitglieder – Nicht-Mitglieder können abweichend behandelt werden', 'Gilt nur in dem Bundesland, in dem der Tarifvertrag abgeschlossen wurde', 'Gilt nur für Beamte – privatwirtschaftliche Beschäftigte sind ausgenommen'], correct: 0 },
    { q: 'Was bedeutet Friedenspflicht?', a: ['Während der Tariflaufzeit keine Streiks über tarifliche Themen', 'Kein Krieg in Deutschland – das Grundgesetz verpflichtet zur Friedenswahrung', 'Friedliche Verhandlungsführung ohne Druck oder Drohungen', 'Verbot von Demonstrationen während laufender Tarifverhandlungen'], correct: 0 },
    // Demokratische Wahlen
    { q: 'Was ist ein Grundsatz demokratischer Wahlen?', a: ['Geheim (niemand sieht, was man wählt)', 'Öffentlich (jeder sieht, was man wählt)', 'Nur für Männer im Normalbetrieb', 'Nur für Reiche unter Aufsicht'], correct: 0 },
    { q: 'Welche sind Grundsätze demokratischer Wahlen? (Mehrere richtig)', a: ['Allgemein', 'Geheim', 'Frei', 'Öffentlich'], correct: [0, 1, 2], multi: true },
    // Gesellschaftsformen
    { q: 'Welche Gesellschaftsform ist im Handelsregister eingetragen?', a: ['Gesellschaft mit beschränkter Haftung (GmbH)', 'Einzelunternehmen ohne Kaufmannseigenschaft – jeder Selbstständige ist eingetragen', 'Eingetragener Verein – gemeinnützige Organisationen sind immer einzutragen', 'Stiftung – alle Stiftungen müssen im Handelsregister verzeichnet sein'], correct: 0 },
    { q: 'Welche Gesellschaftsformen gibt es? (Mehrere richtig)', a: ['Gesellschaft mit beschränkter Haftung', 'Aktiengesellschaft', 'Offene Handelsgesellschaft', 'Kommanditgesellschaft'], correct: [0, 1, 2, 3], multi: true },
    // Sozialversicherungen
    { q: 'Welche Sozialversicherung gibt es?', a: ['Krankenversicherung', 'Autoversicherung', 'Handyversicherung', 'Reiseversicherung'], correct: 0 },
    { q: 'Welche der folgenden zählen zur gesetzlichen Sozialversicherung? (Mehrere richtig)', a: ['Krankenversicherung', 'Rentenversicherung', 'Arbeitslosenversicherung', 'Autoversicherung'], correct: [0, 1, 2], multi: true },
    // Geschäftsfähigkeit
    { q: 'Wer ist geschäftsunfähig?', a: ['Kinder unter 7 Jahren', 'Kinder unter 18 Jahren', 'Alle Minderjährigen', 'Niemand'], correct: 0 },
    { q: 'Wer ist beschränkt geschäftsfähig?', a: ['Minderjährige von 7-17 Jahren', 'Alle Personen unter 21 Jahren – die volle Geschäftsfähigkeit beginnt erst mit 21', 'Nur Kinder unter 7 Jahren – sie dürfen kleinere Alltagsgeschäfte abschließen', 'Alle Erwachsenen mit Betreuung – eine gesetzliche Betreuung bedeutet immer Beschränkung'], correct: 0 },
    { q: 'Ab wann ist man voll geschäftsfähig?', a: ['Ab 18 Jahren', 'Ab 16 Jahren', 'Ab 21 Jahren', 'Ab 14 Jahren'], correct: 0 },
    // Umweltschutz
    { q: 'Was ist eine Umweltschutzmaßnahme im Schwimmbad?', a: ['Solaranlage für Warmwasser', 'Mehr Chlor verwenden', 'Längere Öffnungszeiten', 'Mehr Parkplätze bauen'], correct: 0 },
    { q: 'Welche Umweltschutzmaßnahmen gibt es im Schwimmbad? (Mehrere richtig)', a: ['Solarenergie nutzen', 'Wärmerückgewinnung', 'Regenwassernutzung', 'LED-Beleuchtung'], correct: [0, 1, 2, 3], multi: true },
    // Mutterschutz
    { q: 'Wie viele Wochen gilt das Beschäftigungsverbot nach der Entbindung?', a: ['8 Wochen', '2 Wochen', '6 Wochen', '10 Wochen'], correct: 0 },
    ...POL_EXPANSION_QUESTIONS
];
