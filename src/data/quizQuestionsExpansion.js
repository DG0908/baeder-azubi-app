const rotateAnswers = (correctAnswer, wrongAnswers, seed = 0) => {
  const options = [correctAnswer, ...wrongAnswers.slice(0, 3)];
  const shift = ((seed % options.length) + options.length) % options.length;
  const answers = options.slice(shift).concat(options.slice(0, shift));
  const correctIndex = (options.length - shift) % options.length;
  return { answers, correctIndex };
};

const createSingleChoice = (question, correctAnswer, wrongAnswers, seed) => {
  const { answers, correctIndex } = rotateAnswers(correctAnswer, wrongAnswers, seed);
  return { q: question, a: answers, correct: correctIndex };
};

const buildWithBorrowedDistractors = (prompts, offset = 0) => {
  return prompts.map(([question, correctAnswer], index) => {
    const wrongAnswers = [];
    let step = 1;
    while (wrongAnswers.length < 3) {
      const candidate = prompts[(index + step * 7) % prompts.length][1];
      if (candidate !== correctAnswer && !wrongAnswers.includes(candidate)) {
        wrongAnswers.push(candidate);
      }
      step += 1;
    }
    return createSingleChoice(question, correctAnswer, wrongAnswers, offset + index);
  });
};

const ORG_EXPANSION_PROMPTS = [
  ['Wozu dient ein Belegungsplan im Schwimmbad?', 'Er ordnet Bahnen, Zeiten und Gruppen verbindlich zu'],
  ['Was hat bei voller Schwimmhalle oberste Prioritaet?', 'Sichere Aufsicht und konsequente Regelumsetzung'],
  ['Was muss ein Raeumungsplan enthalten?', 'Fluchtwege, Sammelpunkte und eindeutige Zustaendigkeiten'],
  ['Wer entscheidet im laufenden Betrieb ueber eine sofortige Beckenevakuierung?', 'Die verantwortliche Aufsicht im Dienst'],
  ['Warum wird die Schichtuebergabe schriftlich festgehalten?', 'Damit offene Punkte nachvollziehbar bleiben'],
  ['Was ist bei Fundsachen zuerst zu tun?', 'Fund dokumentieren und sicher verwahren'],
  ['Warum ist eine Besucherzaehlung wichtig?', 'Sie steuert Personal- und Sicherheitsplanung'],
  ['Welche Kennzahl zeigt die Auslastung im Tagesverlauf?', 'Besucher pro Zeitfenster'],
  ['Was gehoert in die Erstunterweisung neuer Mitarbeitender?', 'Notfallwege, Alarmablaeufe und Meldeketten'],
  ['Warum arbeitet der Oeffnungsdienst mit Checkliste?', 'Sicherheitsrelevante Punkte werden nicht vergessen'],
  ['Warum werden Sprung- und Rutschbereiche getrennt organisiert?', 'Um Kollisionsrisiken wirksam zu reduzieren'],
  ['Was bedeutet Spitzenlast im Badebetrieb?', 'Zeitabschnitt mit besonders hohem Besucheraufkommen'],
  ['Was wird bei der Kursplanung zuerst geprueft?', 'Verfuegbare Wasserflaeche und qualifiziertes Personal'],
  ['Warum sind Strassenschuh- und Barfusszonen zu trennen?', 'Schmutzeintrag und Rutschrisiko werden vermindert'],
  ['Was ist Ziel eines strukturierten Beschwerdemanagements?', 'Probleme loesen und Wiederholungen verhindern'],
  ['Wofuer dient Deeskalation bei Konflikten?', 'Lage beruhigen und Sicherheitsregeln durchsetzen'],
  ['Wer wird bei einer technischen Stoerung zuerst informiert?', 'Diensthabende Leitung oder Technikbereitschaft'],
  ['Warum gilt beim Kassenabschluss oft das Vier-Augen-Prinzip?', 'Fehler und Manipulationen werden vorbeugt'],
  ['Welche Information gehoert in jeden Schichtbericht?', 'Besonderheiten, Vorfaelle und getroffene Massnahmen'],
  ['Warum muessen Fluchtwege frei bleiben?', 'Rettung bleibt im Notfall ohne Zeitverlust moeglich'],
  ['Was ist eine Kernaufgabe der Schichtleitung?', 'Personal koordinieren und Betriebssicherheit sichern'],
  ['Warum sind kurze Teambriefings vor Stosszeiten sinnvoll?', 'Alle kennen Rollen, Prioritaeten und Risiken'],
  ['Wozu dient ein Leitsystem fuer Badegaeste?', 'Es lenkt sicher zu Kasse, Umkleide und Becken'],
  ['Wie sollen Lautsprecherdurchsagen gestaltet sein?', 'Kurz, eindeutig und handlungsorientiert'],
  ['Warum wird die Haus- und Badeordnung sichtbar ausgehaengt?', 'Gaeste kennen Regeln schon vor der Nutzung'],
  ['Welche Massnahme reduziert Wartezeiten an der Kasse am besten?', 'Getrennte Spuren fuer unterschiedliche Tickets'],
  ['Warum werden Vereinszeiten fest reserviert?', 'Training bleibt planbar und konfliktarm'],
  ['Was ist bei Kindergruppen besonders wichtig?', 'Ausreichende Zahl verantwortlicher Begleitpersonen'],
  ['Warum wird das Notfalltelefon taeglich geprueft?', 'Es muss im Ernstfall sofort funktionieren'],
  ['Wozu dient der Schliessrundgang nach Betriebsende?', 'Gefahrenstellen und offene Bereiche werden erkannt'],
  ['Was beschreibt Besucherlenkung im Bad?', 'Gezielte Steuerung von Wegen und Aufenthaltsbereichen'],
  ['Warum werden Schliessfaecher regelmaessig kontrolliert?', 'Sicherheit, Ordnung und Fundmanagement verbessern sich'],
  ['Was gilt beim Umgang mit Kassendaten?', 'Nur berechtigte Personen duerfen Einsicht erhalten'],
  ['Warum werden Quittungen sauber archiviert?', 'Abrechnung und Pruefung bleiben nachvollziehbar'],
  ['Was ist bei Alarmuebungen entscheidend?', 'Rollen ueben, Zeiten messen, Luecken schliessen'],
  ['Warum ist saisonale Personalplanung notwendig?', 'Auslastung schwankt zwischen Frei- und Hallenbad'],
  ['Was gehoert in die Einweisung externer Kursleitungen?', 'Hausregeln, Notfallablauf und Meldewege'],
  ['Wie werden Konflikte an der Rutsche am besten reduziert?', 'Klare Startfreigabe und feste Abstandsregeln'],
  ['Warum sollte Ersatz fuer Rettungsgeraete verfuegbar sein?', 'Ausfaelle duerfen Einsatzbereitschaft nicht stoppen'],
  ['Wozu dient eine Prioritaetenliste bei Reparaturen?', 'Sicherheitskritische Maengel werden zuerst behoben'],
  ['Was zeigt die Kennzahl Verweildauer der Gaeste?', 'Wie lange Besucher durchschnittlich im Bad bleiben'],
  ['Warum wird Materialausgabe dokumentiert?', 'Verbrauch, Bestand und Verantwortung bleiben transparent'],
  ['Was ist bei Ueberbelegung die richtige Reaktion?', 'Zugang steuern und sichere Kapazitaet einhalten'],
  ['Wozu dient eine Unfallmeldung im Betrieb?', 'Rechts- und Lernsicherheit durch dokumentierte Fakten'],
  ['Warum ist Inventur im Badebetrieb wichtig?', 'Bestand, Verluste und Nachbestellungen steuern'],
  ['Welche Angabe muss bei Kursangeboten klar sein?', 'Voraussetzungen wie Alter oder Schwimmniveau'],
  ['Warum braucht Beschilderung barrierearme Gestaltung?', 'Informationen muessen fuer alle nutzbar sein'],
  ['Was muss die Pausenplanung im Dienst sicherstellen?', 'Durchgehend ausreichende Mindestbesetzung'],
  ['Wann ist eine zusaetzliche Aufsichtskraft sinnvoll?', 'Bei hoher Auslastung oder Risikobereichen'],
  ['Wofuer dient ein Gewitter-Fruehwarnschema?', 'Fruehe Entscheidung zu Raeumung und Sperrung'],
  ['Warum werden Spiel- und Trainingsgeraete vor Nutzung geprueft?', 'Defekte werden frueh erkannt und Unfaelle vermieden'],
  ['Was gehoert zu einer Veranstaltungsnachbereitung?', 'Ablauf, Sicherheit und Feedback systematisch auswerten'],
  ['Wie vermeidet man Doppelbelegungen von Wasserflaechen?', 'Zentrale und verbindliche Terminplanung'],
  ['Warum helfen klare Tagesziele im Team?', 'Sie synchronisieren Prioritaeten und Verantwortung'],
  ['Was ist bei Kassenabweichungen zwingend?', 'Sofort dokumentieren und Ursachen pruefen'],
  ['Warum wird Besucherfeedback systematisch ausgewertet?', 'Qualitaet verbessern und Probleme frueh erkennen'],
  ['Womit laesst sich Servicequalitaet gut messen?', 'Wartezeit, Rueckmeldungen und Beschwerdequote'],
  ['Warum wird der AED regelmaessig kontrolliert?', 'Einsatzbereitschaft und Batteriestatus sichern'],
  ['Was bedeutet Eskalationsstufe 1 im Gaestekonflikt?', 'Ruhige Ansprache und klare Regelhinweise'],
  ['Warum ist geordnete Schluesselverwaltung wichtig?', 'Unbefugter Zugang und Haftungsrisiken sinken'],
  ['Was gilt fuer Reinigungsarbeiten waehrend Oeffnungszeiten?', 'Absichern, kennzeichnen und Wege freihalten'],
  ['Warum werden wertvolle Fundsachen gesondert verwahrt?', 'Schutz vor Verlust und klare Nachweiskette'],
  ['Welche Information hilft auf digitalen Belegungsanzeigen?', 'Zeitfenster, Bahnnummer und Nutzungsart'],
  ['Warum werden Mitarbeitende nach Qualifikation eingeteilt?', 'Aufgaben brauchen passende Fachkompetenz'],
  ['Wie wird Notausgangsfreiheit im Alltag gesichert?', 'Regelmaessige Sichtkontrollen mit Dokumentation'],
  ['Was macht die Tagesverantwortung bei ploetzlichem Wetterumschwung?', 'Betriebslage pruefen und Schutzmassnahmen ausloesen'],
  ['Warum werden Kontrollgaenge protokolliert?', 'Massnahmen sind spaeter nachvollziehbar'],
  ['Warum muessen Rettungszufahrten frei bleiben?', 'Einsatzfahrzeuge brauchen jederzeit Zugang'],
  ['Was bedeutet kontinuierliche Verbesserung im Badebetrieb?', 'Ablaeufe regelmaessig messen und anpassen'],
  ['Welche Wirkung hat ein klarer Kommunikationskanal im Team?', 'Weniger Missverstaendnisse im laufenden Betrieb']
];

export const ORG_EXPANSION_QUESTIONS = buildWithBorrowedDistractors(ORG_EXPANSION_PROMPTS, 1200);

const POL_EXPANSION_PROMPTS = [
  ['Wofuer ist der Bundestag in erster Linie zustaendig?', 'Gesetze beraten und beschliessen'],
  ['Was regelt ein Arbeitsvertrag grundsaetzlich?', 'Taetigkeit, Arbeitszeit und Verguetung'],
  ['Wie lange darf eine Probezeit im Arbeitsverhaeltnis maximal dauern?', 'In der Regel bis zu sechs Monate'],
  ['Welche gesetzliche Kuendigungsfrist gilt fuer Arbeitnehmer meist zum Ende der Probezeit?', 'Vier Wochen zum Fuenfzehnten oder Monatsende'],
  ['Wofuer steht das Prinzip Tarifautonomie?', 'Tarifparteien handeln Arbeitsbedingungen eigenstaendig aus'],
  ['Welche Aufgabe hat ein Betriebsrat?', 'Interessen der Beschaeftigten im Betrieb vertreten'],
  ['Warum gibt es einen gesetzlichen Mindestlohn?', 'Um eine untere Lohnschutzgrenze festzulegen'],
  ['Welche Versicherung ist bei Arbeitsunfaellen zustaendig?', 'Die gesetzliche Unfallversicherung'],
  ['Wofuer ist die Rentenversicherung vor allem da?', 'Absicherung im Alter und bei Erwerbsminderung'],
  ['Was bedeutet Bruttolohn?', 'Lohn vor Abzug von Steuern und Sozialbeitraegen'],
  ['Was bedeutet Nettolohn?', 'Auszahlungsbetrag nach allen Abzuegen'],
  ['Wozu dient eine Lohnabrechnung?', 'Sie macht Entgelt und Abzuege nachvollziehbar'],
  ['Was versteht man unter Inflation?', 'Anhaltender Anstieg des allgemeinen Preisniveaus'],
  ['Was ist eine typische Folge hoher Inflation?', 'Die Kaufkraft des Geldes sinkt'],
  ['Was misst das Bruttoinlandsprodukt (BIP)?', 'Wert aller im Inland erzeugten Endgueter'],
  ['Was meint der Begriff Konjunktur?', 'Wirtschaftliche Lage im zeitlichen Verlauf'],
  ['Was kennzeichnet progressive Besteuerung?', 'Hoeheres Einkommen wird prozentual staerker belastet'],
  ['Wie hoch ist der regulaere Mehrwertsteuersatz in Deutschland?', 'Neunzehn Prozent'],
  ['Wie hoch ist der ermaessigte Mehrwertsteuersatz in Deutschland?', 'Sieben Prozent'],
  ['Welche Aufgabe hat das Bundesverfassungsgericht?', 'Es prueft Gesetze auf Vereinbarkeit mit dem Grundgesetz'],
  ['Wer waehlt den Bundeskanzler auf Bundesebene?', 'Der Deutsche Bundestag'],
  ['Was bedeutet konstruktives Misstrauensvotum?', 'Abwahl nur mit gleichzeitiger Wahl eines Nachfolgers'],
  ['Wer sitzt im Bundesrat?', 'Mitglieder der Landesregierungen'],
  ['Wozu dient der Foederalismus in Deutschland?', 'Macht wird zwischen Bund und Laendern verteilt'],
  ['Was bedeutet der Wahlgrundsatz Gleichheit?', 'Jede Stimme hat den gleichen Zaehlwert'],
  ['Wofuer steht die Erststimme bei der Bundestagswahl?', 'Direktkandidat im Wahlkreis waehlen'],
  ['Wofuer steht die Zweitstimme bei der Bundestagswahl?', 'Partei und Sitzverteilung im Bundestag beeinflussen'],
  ['Welchen Zweck hat die Fuenf-Prozent-Huerde?', 'Zersplitterung des Parlaments begrenzen'],
  ['Was ist eine Koalition in der Politik?', 'Zusammenschluss mehrerer Parteien zur Regierungsbildung'],
  ['Welche Rolle hat die Opposition im Parlament?', 'Regierung kontrollieren und Alternativen aufzeigen'],
  ['Was garantiert das Petitionsrecht?', 'Buerger duerfen sich mit Bitten und Beschwerden an Stellen wenden'],
  ['Welche Aufgabe hat eine Jugend- und Auszubildendenvertretung?', 'Belange von Azubis und Jugendlichen vertreten'],
  ['Welche Pflicht hat ein Azubi laut Berufsbildungsgesetz?', 'Lernpflicht und Fuehren des Berichtshefts'],
  ['Welche Pflicht hat der Ausbildungsbetrieb?', 'Ausbildungsziel vermitteln und Ausbildung ermoeglichen'],
  ['Was regelt das Berufsbildungsgesetz (BBiG)?', 'Rahmenbedingungen der beruflichen Ausbildung'],
  ['Was ist ein einfaches Arbeitszeugnis?', 'Es bestaetigt Art und Dauer der Taetigkeit'],
  ['Was ist ein qualifiziertes Arbeitszeugnis?', 'Es enthaelt zusaetzlich Leistung und Verhalten'],
  ['Wozu dient eine Gewerkschaft?', 'Interessen von Arbeitnehmern gemeinsam vertreten'],
  ['Was ist ein Streik im Tarifkonflikt?', 'Gemeinsame Arbeitsniederlegung zur Durchsetzung von Forderungen'],
  ['Was bedeutet Sozialpartnerschaft?', 'Arbeitgeber und Arbeitnehmer suchen geregelte Kompromisse'],
  ['Was beschreibt das Prinzip Angebot und Nachfrage?', 'Preise entstehen aus dem Zusammenspiel beider Seiten'],
  ['Was passiert typischerweise bei steigender Nachfrage und gleichem Angebot?', 'Der Preis steigt tendenziell'],
  ['Was ist ein Monopol?', 'Ein Anbieter beherrscht einen Markt weitgehend allein'],
  ['Was ist der Unterschied zwischen Umsatz und Gewinn?', 'Gewinn bleibt nach Abzug der Kosten vom Umsatz'],
  ['Was sind Fixkosten?', 'Kosten, die unabhaengig von der Auslastung anfallen'],
  ['Was sind variable Kosten?', 'Kosten, die mit der Produktionsmenge steigen oder fallen'],
  ['Wofuer steht der Break-even-Point?', 'Punkt, an dem Erloese und Kosten gleich hoch sind'],
  ['Was bedeutet Liquiditaet eines Unternehmens?', 'Faehigkeit, faellige Zahlungen rechtzeitig zu leisten'],
  ['Was bedeutet Insolvenz?', 'Ein Schuldner kann Verbindlichkeiten nicht mehr bedienen'],
  ['Was ist mit Zweckbindung im Datenschutz gemeint?', 'Daten nur fuer festgelegten Zweck nutzen'],
  ['Was versteht man unter Schwarzarbeit?', 'Arbeit ohne ordnungsgemaesse Meldung und Abgaben'],
  ['Wozu dient Korruptionspraevention im Betrieb?', 'Unfaire Vorteile und Regelverstoesse verhindern'],
  ['Wodurch finanziert sich der Staat hauptsaechlich?', 'Durch Steuern, Gebuehren und Abgaben'],
  ['Was bedeutet Schuldenbremse grundsaetzlich?', 'Neue staatliche Schulden werden rechtlich begrenzt'],
  ['Warum ist Energieeffizienz auch wirtschaftlich wichtig?', 'Sie senkt laufende Betriebskosten'],
  ['Was beschreibt Nachhaltigkeit im wirtschaftlichen Kontext?', 'Oekonomie, Oekologie und Soziales zusammendenken'],
  ['Wofuer steht das Prinzip soziale Marktwirtschaft?', 'Freier Markt mit sozialem Ausgleich durch den Staat'],
  ['Was ist ein Haushaltsplan des Staates?', 'Jaehrliche Planung von Einnahmen und Ausgaben'],
  ['Welche Funktion hat die Arbeitslosenversicherung?', 'Absicherung bei Jobverlust durch Leistungen und Foerderung'],
  ['Welche Funktion hat die gesetzliche Krankenversicherung?', 'Absicherung medizinischer Versorgung bei Krankheit'],
  ['Was ist eine Arbeitsunfaehigkeitsbescheinigung?', 'AErztlicher Nachweis, dass jemand voruebergehend nicht arbeiten kann'],
  ['Was bedeutet Mitbestimmung im Unternehmen?', 'Beschaeftigte wirken bei bestimmten Entscheidungen mit'],
  ['Wozu dient ein Tarifvertrag praktisch?', 'Er legt verbindliche Arbeitsbedingungen fuer Tarifparteien fest'],
  ['Was ist Compliance im Betrieb?', 'Regelkonformes Handeln nach Gesetz und internen Vorgaben'],
  ['Warum ist politische Bildung im Berufsalltag relevant?', 'Sie staerkt Urteilsfaehigkeit und demokratische Teilhabe'],
  ['Was bedeutet Gleichbehandlung im Arbeitsrecht?', 'Niemand darf ohne sachlichen Grund benachteiligt werden']
];

export const POL_EXPANSION_QUESTIONS = buildWithBorrowedDistractors(POL_EXPANSION_PROMPTS, 2200);

const formatNumber = (value) => {
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(2).replace(/\.?0+$/, '');
};

const uniqueNumbers = (correct, candidates, minValue = 0) => {
  const wrongs = [];
  candidates.forEach((candidate) => {
    const rounded = Math.round(candidate * 100) / 100;
    if (rounded >= minValue && rounded !== correct && !wrongs.includes(rounded)) {
      wrongs.push(rounded);
    }
  });

  let step = Math.max(1, Math.abs(correct) * 0.1);
  while (wrongs.length < 3) {
    const candidate = Math.round((correct + step * (wrongs.length + 2)) * 100) / 100;
    if (candidate !== correct && !wrongs.includes(candidate)) {
      wrongs.push(candidate);
    }
    step += 0.5;
  }

  return wrongs.slice(0, 3);
};

const mathQuestions = [];

const addMathQuestion = (question, correctValue, wrongCandidates, unit = '') => {
  const correct = Math.round(correctValue * 100) / 100;
  const wrongValues = uniqueNumbers(correct, wrongCandidates, 0);
  const withUnit = (value) => (unit ? `${formatNumber(value)} ${unit}` : formatNumber(value));
  mathQuestions.push(
    createSingleChoice(
      question,
      withUnit(correct),
      wrongValues.map(withUnit),
      3300 + mathQuestions.length
    )
  );
};

const dreisatzScenarios = [
  { amount: 3, price: 9, target: 7, label: 'Kinderkarten' },
  { amount: 4, price: 16, target: 9, label: 'Erwachsenentickets' },
  { amount: 5, price: 20, target: 8, label: 'Fruehschwimmer-Tickets' },
  { amount: 6, price: 18, target: 10, label: 'Schuelerkarten' },
  { amount: 2, price: 14, target: 5, label: 'Familienkarten' },
  { amount: 8, price: 24, target: 11, label: 'Abendkarten' },
  { amount: 10, price: 35, target: 6, label: 'Vereinskarten' },
  { amount: 3, price: 12, target: 11, label: 'Sauna-Zutritte' },
  { amount: 7, price: 21, target: 9, label: 'Ferienpass-Tickets' },
  { amount: 4, price: 10, target: 15, label: 'Kurzzeittickets' },
  { amount: 5, price: 15, target: 12, label: 'Bahntarif-Tickets' },
  { amount: 12, price: 30, target: 7, label: 'Morgentarif-Tickets' },
  { amount: 9, price: 27, target: 14, label: 'Abokarten-Tage' },
  { amount: 6, price: 24, target: 13, label: 'Sauna-Einzelzutritte' },
  { amount: 11, price: 33, target: 4, label: 'Feierabendkarten' },
  { amount: 14, price: 42, target: 5, label: 'Aquafitness-Tickets' },
  { amount: 15, price: 45, target: 8, label: 'Kurskarten' },
  { amount: 16, price: 48, target: 6, label: 'Bahnreservierungen' },
  { amount: 18, price: 54, target: 10, label: 'Gruppenkarten' },
  { amount: 20, price: 60, target: 7, label: 'Schulbad-Tickets' }
];

dreisatzScenarios.forEach(({ amount, price, target, label }) => {
  const unitPrice = price / amount;
  const correct = unitPrice * target;
  addMathQuestion(
    `${amount} ${label} kosten zusammen ${formatNumber(price)} EUR. Was kosten ${target} ${label}?`,
    correct,
    [correct + unitPrice, correct - unitPrice, price + target, correct + 2 * unitPrice],
    'EUR'
  );
});

const volumeDirectScenarios = [
  { l: 25, b: 10, t: 2 },
  { l: 20, b: 10, t: 1.5 },
  { l: 50, b: 12, t: 2 },
  { l: 16, b: 8, t: 1.5 },
  { l: 33, b: 15, t: 2 },
  { l: 12, b: 8, t: 1.25 },
  { l: 30, b: 15, t: 1.8 },
  { l: 10, b: 6, t: 1.5 },
  { l: 25, b: 12, t: 1.2 },
  { l: 18, b: 10, t: 1.4 },
  { l: 40, b: 20, t: 2 },
  { l: 15, b: 10, t: 1.2 }
];

volumeDirectScenarios.forEach(({ l, b, t }) => {
  const correct = l * b * t;
  addMathQuestion(
    `Ein Becken ist ${formatNumber(l)} m lang, ${formatNumber(b)} m breit und ${formatNumber(t)} m tief. Wie gross ist das Volumen?`,
    correct,
    [l * b + t, l + b + t, correct - l * b * 0.2, correct + l * b * 0.2],
    'm3'
  );
});

const volumeDepthScenarios = [
  { v: 400, l: 20, b: 10 },
  { v: 540, l: 30, b: 12 },
  { v: 360, l: 24, b: 10 },
  { v: 288, l: 16, b: 12 },
  { v: 250, l: 25, b: 10 },
  { v: 330, l: 30, b: 11 },
  { v: 168, l: 14, b: 8 },
  { v: 216, l: 18, b: 8 }
];

volumeDepthScenarios.forEach(({ v, l, b }) => {
  const correct = v / (l * b);
  addMathQuestion(
    `Ein Becken hat ${v} m3 Volumen. Laenge ${l} m, Breite ${b} m. Wie tief ist es im Mittel?`,
    correct,
    [correct + 0.5, correct - 0.5, v / (l + b), correct + 1],
    'm'
  );
});

const percentScenarios = [
  { base: 240, percent: 25, type: 'share' },
  { base: 850, percent: 10, type: 'share' },
  { base: 320, percent: 15, type: 'share' },
  { base: 500, percent: 8, type: 'share' },
  { base: 1200, percent: 5, type: 'share' },
  { base: 30, percent: 20, type: 'discount' },
  { base: 18, percent: 25, type: 'discount' },
  { base: 42, percent: 10, type: 'discount' },
  { base: 64, percent: 12.5, type: 'discount' },
  { base: 80, percent: 15, type: 'discount' },
  { base: 150, percent: 20, type: 'increase' },
  { base: 200, percent: 12, type: 'increase' },
  { base: 90, percent: 30, type: 'increase' },
  { base: 400, percent: 7.5, type: 'increase' },
  { base: 72, percent: 25, type: 'increase' }
];

percentScenarios.forEach(({ base, percent, type }) => {
  if (type === 'share') {
    const correct = (base * percent) / 100;
    addMathQuestion(
      `Wie viel sind ${formatNumber(percent)}% von ${formatNumber(base)}?`,
      correct,
      [correct + base * 0.1, correct - base * 0.05, base / percent, correct + 5]
    );
    return;
  }

  if (type === 'discount') {
    const correct = base * (1 - percent / 100);
    addMathQuestion(
      `Ein Ticket kostet ${formatNumber(base)} EUR. Es gibt ${formatNumber(percent)}% Rabatt. Neuer Preis?`,
      correct,
      [base - percent, base * (percent / 100), base + percent, correct + 3],
      'EUR'
    );
    return;
  }

  const correct = base * (1 + percent / 100);
  addMathQuestion(
    `Der Wert ${formatNumber(base)} steigt um ${formatNumber(percent)}%. Was ist der neue Wert?`,
    correct,
    [base + percent, base * (percent / 100), base - (base * percent) / 100, correct + 6]
  );
});

const dosageScenarios = [
  { volume: 500, dose: 0.6, unit: 'g/m3', label: 'Flockungsmittel' },
  { volume: 250, dose: 1.2, unit: 'g/m3', label: 'Flockungsmittel' },
  { volume: 900, dose: 0.4, unit: 'g/m3', label: 'Aktivkohle' },
  { volume: 320, dose: 0.8, unit: 'g/m3', label: 'Flockungsmittel' },
  { volume: 150, dose: 1.5, unit: 'g/m3', label: 'Flockungsmittel' },
  { volume: 420, dose: 0.5, unit: 'g/m3', label: 'Flockungsmittel' },
  { volume: 760, dose: 0.3, unit: 'g/m3', label: 'Aktivkohle' },
  { volume: 280, dose: 0.9, unit: 'g/m3', label: 'Flockungsmittel' }
];

dosageScenarios.forEach(({ volume, dose, label }) => {
  const correct = volume * dose;
  addMathQuestion(
    `Dosierung ${label}: ${formatNumber(dose)} g/m3 bei ${volume} m3 Wasser. Wie viele Gramm werden benoetigt?`,
    correct,
    [correct + volume * 0.1, correct - volume * 0.1, dose + volume, correct + dose * 50],
    'g'
  );
});

const flowScenarios = [
  { q: 180, h: 5 },
  { q: 240, h: 4 },
  { q: 125, h: 8 },
  { q: 300, h: 3 },
  { q: 95, h: 6 },
  { q: 210, h: 2 },
  { q: 160, h: 7 }
];

flowScenarios.forEach(({ q, h }) => {
  const correct = q * h;
  addMathQuestion(
    `Eine Umwaelzpumpe foerdert ${q} m3/h und laeuft ${h} Stunden. Wie viel Wasser wird umgewaelzt?`,
    correct,
    [q + h, q * (h - 1), q * (h + 1), correct + q],
    'm3'
  );
});

const expressionScenarios = [
  ['(18 + 6) : 3', 8],
  ['7 x (5 + 3)', 56],
  ['(40 - 16) : 4', 6],
  ['9 x 9 - 12', 69],
  ['(6 x 8) + 15', 63],
  ['(72 : 8) + 14', 23],
  ['5^2 + 3^2', 34],
  ['2^4 + 2^3', 24],
  ['3^3 - 9', 18],
  ['(4 + 6) x (5 - 2)', 30],
  ['84 : (7 x 2)', 6],
  ['(45 - 9) : (3 + 3)', 6],
  ['11 x 7 - 15', 62],
  ['(90 : 5) - 8', 10],
  ['(12 + 18) : (2 x 3)', 5]
];

expressionScenarios.forEach(([expr, result]) => {
  addMathQuestion(
    `Rechne im Kopf: ${expr}`,
    result,
    [result + 4, Math.max(1, result - 3), result + 8, result - 6]
  );
});

const equationScenarios = [
  ['x + 18 = 45', 27],
  ['x - 14 = 26', 40],
  ['3x = 81', 27],
  ['5x = 140', 28],
  ['x / 4 = 9', 36],
  ['x / 6 = 7', 42],
  ['2x + 10 = 58', 24],
  ['4x - 12 = 52', 16],
  ['7x + 14 = 70', 8],
  ['9x - 27 = 45', 8],
  ['x + x + 6 = 30', 12],
  ['3(x - 2) = 24', 10],
  ['(x + 5) / 3 = 9', 22],
  ['2(x + 4) = 40', 16],
  ['(x - 7) / 5 = 3', 22]
];

equationScenarios.forEach(([equation, result]) => {
  addMathQuestion(
    `Loese im Kopf: ${equation}.`,
    result,
    [result + 2, Math.max(1, result - 4), result + 6, result - 1]
  );
});

if (mathQuestions.length !== 100) {
  throw new Error(`Math question generation expected 100, got ${mathQuestions.length}`);
}

export const MATH_QUESTIONS = mathQuestions;
