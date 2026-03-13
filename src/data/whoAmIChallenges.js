export const WHO_AM_I_CATEGORY = {
  id: 'guess',
  name: 'Was bin ich?',
  color: 'bg-slate-700',
  icon: '🕵️'
};

export const WHO_AM_I_TIME_LIMIT = 60;

export const WHO_AM_I_CLUE_COUNT_BY_DIFFICULTY = {
  anfaenger: 5,
  profi: 4,
  experte: 3,
  extra: 2
};

const buildChallenge = ({
  id,
  sourceCategory,
  answer,
  terms,
  clues
}) => ({
  id,
  category: WHO_AM_I_CATEGORY.id,
  sourceCategory,
  type: 'whoami',
  prompt: 'Was bin ich?',
  q: `Was bin ich? ${clues[0]}`,
  front: 'Was bin ich?',
  back: answer,
  answerGuide: answer,
  timeLimit: WHO_AM_I_TIME_LIMIT,
  minWords: 1,
  minKeywordGroups: 1,
  keywordGroups: [
    {
      label: answer,
      terms: [answer, ...(Array.isArray(terms) ? terms : [])]
    }
  ],
  clues
});

export const WHO_AM_I_CHALLENGES = {
  [WHO_AM_I_CATEGORY.id]: [
    buildChallenge({
      id: 'umwaelzpumpe',
      sourceCategory: 'tech',
      answer: 'Umwaelzpumpe',
      terms: ['umwaelzpumpe', 'umwälzpumpe', 'kreiselpumpe'],
      clues: [
        'Ich halte Beckenwasser in Bewegung und schicke es durch den Filter.',
        'Ich arbeite in der Badewasseraufbereitung meist als Kreiselpumpe.',
        'Mein Laufrad erzeugt den noetigen Volumenstrom.',
        'Vor mir sitzt oft ein Vorfilter mit Filterkorb.',
        'Wenn ich Luft ziehe, drohen Kavitation und Stoerungen.'
      ]
    }),
    buildChallenge({
      id: 'membrandosierpumpe',
      sourceCategory: 'tech',
      answer: 'Membrandosierpumpe',
      terms: ['membrandosierpumpe', 'magnet membrandosierpumpe', 'magnetmembrandosierpumpe'],
      clues: [
        'Ich dosiere Chemikalien stoossweise und sehr genau.',
        'Meine Foerdermenge entsteht ueber einzelne Huebe.',
        'Eine Membran trennt meinen Antrieb vom Medium.',
        'Meine Hublaenge kann ueber einen Knopf eingestellt werden.',
        'In eurer App sehe ich als Magnet-Membrandosierpumpe im Schnittbild aus.'
      ]
    }),
    buildChallenge({
      id: 'calciumhypochlorid_anlage',
      sourceCategory: 'tech',
      answer: 'Calciumhypochlorid-Anlage',
      terms: ['calciumhypochlorid anlage', 'calciumhypochloritanlage', 'feststoff chloranlage'],
      clues: [
        'Ich arbeite mit festem Desinfektionsmittel statt mit Fluessigchlor.',
        'Mein Produkt wird ueber ein Duesensystem angewaessert.',
        'Im Loese- und Sedimentationsprinzip trenne ich Rueckstaende ab.',
        'Meine fertige Loesung wird spaeter mit einer Dosierpumpe ins Beckenwasser gebracht.',
        'In euren Deep Dives tauche ich als Feststoff-Chloranlage auf.'
      ]
    }),
    buildChallenge({
      id: 'sorptionsfilter',
      sourceCategory: 'tech',
      answer: 'Sorptionsfilter',
      terms: ['sorptionsfilter', 'aktivkohlefilter'],
      clues: [
        'Ich sitze in der Aufbereitung hinter einer starken Oxidation besonders sinnvoll.',
        'Ich entferne Ozonreste und organische Stoffe aus dem Wasser.',
        'Bei mir geht es um Adsorption statt um reines Sieben.',
        'Aktivkohle ist ein typisches Material in mir.',
        'Ohne mich koennen unerwuenschte Nebenprodukte im Reinwasser bleiben.'
      ]
    }),
    buildChallenge({
      id: 'redoxpotential',
      sourceCategory: 'tech',
      answer: 'Redoxpotential',
      terms: ['redoxpotential', 'redox', 'redoxwert'],
      clues: [
        'Ich werde in Millivolt angegeben.',
        'Ich zeige das Verhaeltnis von oxidierenden und reduzierenden Stoffen an.',
        'Bei Suesswasser gelten um 750 mV als wichtiger Richtwert.',
        'Sinke ich deutlich ab, sollte die Desinfektionskraft geprueft werden.',
        'Gemessen werde ich mit einer speziellen Messzelle.'
      ]
    }),
    buildChallenge({
      id: 'ph_wert',
      sourceCategory: 'tech',
      answer: 'pH-Wert',
      terms: ['ph wert', 'ph'],
      clues: [
        'Ich beschreibe, ob Wasser sauer, neutral oder basisch ist.',
        'Im Beckenwasser beeinflusse ich die Chlorwirkung direkt.',
        'Ein Zielbereich liegt meist um 7,0 bis 7,4.',
        'Ist mein Wert zu niedrig, wird das Wasser zu sauer.',
        'Ist mein Wert zu hoch, laesst die Desinfektionswirkung nach.'
      ]
    }),
    buildChallenge({
      id: 'kuevette',
      sourceCategory: 'tech',
      answer: 'Kuevette',
      terms: ['kuevette', 'küvette'],
      clues: [
        'Ich bin ein kleines Messgefaess im Labor- und Badbetrieb.',
        'Mit mir wird oft photometrisch gemessen.',
        'Sauberkeit ist bei mir besonders wichtig, sonst entstehen Messfehler.',
        'Reagenzien und Probe kommen gemeinsam in mich hinein.',
        'Verschmutzungen an meiner Wand verfalschen das Ergebnis.'
      ]
    }),
    buildChallenge({
      id: 'schwallwasserbehaelter',
      sourceCategory: 'tech',
      answer: 'Schwallwasserbehaelter',
      terms: ['schwallwasserbehaelter', 'schwallwasserbehälter'],
      clues: [
        'Ich sammele Wasser, das ueber die Rinne aus dem Becken ablaeuft.',
        'Badegaeste und Wellen sorgen dafuer, dass ich gefuellt werde.',
        'Frischwasser wird mir zugegeben, um Verluste auszugleichen.',
        'Von mir aus wird Wasser wieder in den Aufbereitungskreislauf gefoerdert.',
        'Mein Fuellstand ist fuer die Anlagenfuehrung wichtig.'
      ]
    }),
    buildChallenge({
      id: 'filterspuelung',
      sourceCategory: 'tech',
      answer: 'Filterspuelung',
      terms: ['filterspuelung', 'filterspülung', 'rueckspuelung', 'rückspülung'],
      clues: [
        'Ich reinige das Filterbett, wenn sich Schmutz und Flocken angesammelt haben.',
        'Dabei wird die Stroemungsrichtung im Filter geaendert.',
        'Das Filterbett wird aufgelockert und teilweise fluidisiert.',
        'Mein Ablauf gehoert ins Betriebstagebuch.',
        'Ohne mich sinken Filterleistung und Hygiene.'
      ]
    }),
    buildChallenge({
      id: 'startblock',
      sourceCategory: 'swim',
      answer: 'Startblock',
      terms: ['startblock'],
      clues: [
        'Ich sitze am Beckenrand vor einer Wettkampfbahn.',
        'Meine Plattform soll trittsicher und mindestens 50 mal 50 Zentimeter gross sein.',
        'Meine Oberseite darf nur leicht geneigt sein.',
        'Fuer den Rueckenstart habe ich oft einen Haltebuegel.',
        'Ich helfe Schwimmern, schnell und sauber ins Rennen zu kommen.'
      ]
    }),
    buildChallenge({
      id: 'finnische_rinne',
      sourceCategory: 'tech',
      answer: 'Finnische Rinne',
      terms: ['finnische rinne'],
      clues: [
        'Ich laufe direkt an der Beckenkante entlang.',
        'Ueber mich wird verdraengtes und angeschwapptes Wasser abgefuehrt.',
        'Im Startwand-Bild liege ich direkt am Rand unter dem Block.',
        'Ich gehoere zum Ueberlaufbereich des Beckens.',
        'Ich bin keine Bahnlinie, sondern eine Rinnenkonstruktion.'
      ]
    }),
    buildChallenge({
      id: 'rautek_griff',
      sourceCategory: 'first',
      answer: 'Rautek-Griff',
      terms: ['rautek griff', 'rautekgriff'],
      clues: [
        'Ich helfe beim Retten oder Bergen von Menschen.',
        'Mit mir ziehst du eine Person aus einem Gefahrenbereich.',
        'Ich wird oft genutzt, wenn eine Person bewusstlos ist.',
        'Mein Ansatzpunkt liegt an Schultern und Armen der betroffenen Person.',
        'Ich gehoere in die Erste Hilfe und Rettungslehre.'
      ]
    }),
    buildChallenge({
      id: 'stabile_seitenlage',
      sourceCategory: 'first',
      answer: 'Stabile Seitenlage',
      terms: ['stabile seitenlage'],
      clues: [
        'Ich bin eine Lagerung fuer bewusstlose Personen mit normaler Atmung.',
        'Ich halte die Atemwege moeglichst frei.',
        'Durch mich kann Erbrochenes besser abfliessen.',
        'Ich komme vor der HLW zum Einsatz, wenn kein Atemstillstand vorliegt.',
        'Jeder Ersthelfer sollte mich sicher beherrschen.'
      ]
    }),
    buildChallenge({
      id: 'aed',
      sourceCategory: 'first',
      answer: 'AED',
      terms: ['aed', 'automatisierter externer defibrillator', 'defibrillator'],
      clues: [
        'Ich bin ein Geraet fuer den Herz-Kreislauf-Notfall.',
        'Meine Sprachansagen fuehren durch die Anwendung.',
        'Ich analysiere den Herzrhythmus automatisch.',
        'Nur wenn es sinnvoll ist, gebe ich einen Schock frei.',
        'Gemeinsam mit HLW kann ich Leben retten.'
      ]
    }),
    buildChallenge({
      id: 'rettungskette',
      sourceCategory: 'swim',
      answer: 'Rettungskette',
      terms: ['rettungskette'],
      clues: [
        'Ich beschreibe ein geordnetes Vorgehen im Notfall.',
        'Absichern, melden, retten und versorgen gehoeren zu mir.',
        'Ich soll verhindern, dass in Stress wichtige Schritte vergessen werden.',
        'Bei Badeunfaellen bin ich besonders wichtig.',
        'Ich bin kein einzelnes Geraet, sondern ein Ablauf.'
      ]
    }),
    buildChallenge({
      id: 'hausrecht',
      sourceCategory: 'org',
      answer: 'Hausrecht',
      terms: ['hausrecht'],
      clues: [
        'Mit mir kann der Betreiber Regeln im Bad durchsetzen.',
        'Wer sich nicht an die Ordnung haelt, kann auf meiner Grundlage verwiesen werden.',
        'Ich bin wichtig fuer Sicherheit und geordneten Badebetrieb.',
        'Ich stuetze die Badeordnung in der Praxis.',
        'Ich bin ein rechtlicher Begriff und keine technische Anlage.'
      ]
    }),
    buildChallenge({
      id: 'badeordnung',
      sourceCategory: 'org',
      answer: 'Badeordnung',
      terms: ['badeordnung'],
      clues: [
        'Ich regele das Verhalten der Gaeste im Bad.',
        'In mir stehen Gebote, Verbote und Hinweise.',
        'Ich schaffe einen verbindlichen Rahmen fuer Sicherheit und Ruecksicht.',
        'Der Betreiber setzt mich ueber sein Hausrecht durch.',
        'Ich haenge oft sichtbar im Eingangs- oder Umkleidebereich.'
      ]
    }),
    buildChallenge({
      id: 'berufsgenossenschaft',
      sourceCategory: 'pol',
      answer: 'Berufsgenossenschaft',
      terms: ['berufsgenossenschaft', 'gesetzliche unfallversicherung'],
      clues: [
        'Ich bin Traeger der gesetzlichen Unfallversicherung im Betrieb.',
        'Arbeitsunfaelle und Berufskrankheiten gehoeren zu meinem Bereich.',
        'Ich gebe auch Regeln und Hinweise fuer sicheres Arbeiten.',
        'Arbeitgeber und Beschaeftigte begegnen mir im Arbeitsschutz.',
        'Meine Abkuerzung wird im Alltag oft nur mit zwei Buchstaben genannt.'
      ]
    }),
    buildChallenge({
      id: 'vier_stufen_methode',
      sourceCategory: 'aevo',
      answer: 'Vier-Stufen-Methode',
      terms: ['vier stufen methode', '4 stufen methode', 'vier-stufen-methode'],
      clues: [
        'Ich bin eine klassische Unterweisungsmethode in der Ausbildung.',
        'Vorbereiten, vormachen, nachmachen und ueben gehoeren zu mir.',
        'Ich strukturiere Lernschritte fuer praktische Taetigkeiten.',
        'Vor allem bei neuen Arbeitsablaeufen bin ich hilfreich.',
        'Mein Name nennt direkt die Anzahl meiner Schritte.'
      ]
    }),
    buildChallenge({
      id: 'legionellen',
      sourceCategory: 'hygiene',
      answer: 'Legionellen',
      terms: ['legionellen', 'legionella'],
      clues: [
        'Ich bin ein Bakterium und mag bestimmte warme Wasserbereiche.',
        'Gefaehrlich werde ich vor allem ueber eingeatmete Aerosole.',
        'Duschanlagen und Warmwassersysteme muessen wegen mir beachtet werden.',
        'Zwischen etwa 25 und 45 Grad Celsius vermehre ich mich besonders gut.',
        'Hygieneplaene und Probenahmen wollen mich im Griff behalten.'
      ]
    }),
    buildChallenge({
      id: 'freies_chlor',
      sourceCategory: 'tech',
      answer: 'Freies Chlor',
      terms: ['freies chlor'],
      clues: [
        'Ich sorge direkt fuer Desinfektionswirkung im Beckenwasser.',
        'Mein Richtwert im Schwimmbad liegt oft bei 0,3 bis 0,6 Milligramm pro Liter.',
        'Falle ich zu niedrig aus, steigt das Hygienerisiko.',
        'Mein Verhaeltnis zum pH-Wert ist besonders wichtig.',
        'Ich bin nicht dasselbe wie gebundenes Chlor.'
      ]
    }),
    buildChallenge({
      id: 'anschlagplatte',
      sourceCategory: 'swim',
      answer: 'Anschlagplatte',
      terms: ['anschlagplatte'],
      clues: [
        'Ich sitze an der Startwand unter dem Startblock.',
        'Rueckenschwimmer stossen sich an mir beim Start ab.',
        'Meine Oberflaeche muss griffig und sicher sein.',
        'Ich gehoere zur Wettkampfbahn und nicht zur Aufbereitung.',
        'Im Bild vom Startblock bin ich deutlich beschriftet.'
      ]
    }),
    buildChallenge({
      id: 'betriebstagebuch',
      sourceCategory: 'org',
      answer: 'Betriebstagebuch',
      terms: ['betriebstagebuch'],
      clues: [
        'Ich dokumentiere wichtige Betriebsdaten im Bad.',
        'Wasserwerte, Spuelungen und Stoerungen werden in mir festgehalten.',
        'Ich helfe beim Nachweis eines ordentlichen Betriebs.',
        'Bei Rueckfragen und Kontrollen bin ich besonders wertvoll.',
        'Ich bin keine App-Funktion, sondern ein betrieblicher Nachweis.'
      ]
    }),
    buildChallenge({
      id: 'redoxmesszelle',
      sourceCategory: 'tech',
      answer: 'Redoxmesszelle',
      terms: ['redoxmesszelle', 'redox messzelle'],
      clues: [
        'Mit mir wird ein elektrisches Potential im Wasser gemessen.',
        'Ich arbeite mit Elektroden.',
        'Mein Messwert hilft bei der Beurteilung der Desinfektionskraft.',
        'Verschmutzungen an mir koennen die Anzeige verfalschen.',
        'Ich liefere den Wert, aus dem das Redoxpotential abgelesen wird.'
      ]
    }),
    buildChallenge({
      id: 'dienstplan',
      sourceCategory: 'org',
      answer: 'Dienstplan',
      terms: ['dienstplan', 'dienstplanung'],
      clues: [
        'Ich ordne Personal, Zeiten und Aufgaben im Betrieb.',
        'Qualifikation, Ruhezeiten und Stoesszeiten muessen bei mir bedacht werden.',
        'Urlaub und Verfuegbarkeit spielen fuer mich eine Rolle.',
        'Ohne mich wird der Badebetrieb schnell chaotisch.',
        'Ich gehoere zur Organisation und nicht zur Wassertechnik.'
      ]
    })
  ]
};

export const getWhoAmIClueCount = (difficulty, totalClues = 5) => {
  const configuredCount = WHO_AM_I_CLUE_COUNT_BY_DIFFICULTY[difficulty] || WHO_AM_I_CLUE_COUNT_BY_DIFFICULTY.profi;
  return Math.max(1, Math.min(Number(totalClues) || 0, configuredCount));
};

export const getWhoAmIVisibleClues = (question, difficulty) => {
  const clues = Array.isArray(question?.clues) ? question.clues.filter(Boolean) : [];
  return clues.slice(0, getWhoAmIClueCount(difficulty, clues.length));
};

export const buildWhoAmIFlashcards = (challengesByCategory) => {
  const result = {};
  Object.entries(challengesByCategory || {}).forEach(([categoryId, entries]) => {
    result[categoryId] = (Array.isArray(entries) ? entries : []).map((entry) => ({
      ...entry
    }));
  });
  return result;
};

export const buildWhoAmIStudyFlashcards = (challengesByCategory) => {
  const result = {};
  Object.entries(challengesByCategory || {}).forEach(([categoryId, entries]) => {
    result[categoryId] = (Array.isArray(entries) ? entries : []).map((entry) => ({
      front: [
        'Was bin ich?',
        '',
        ...entry.clues.map((clue, index) => `${index + 1}. ${clue}`)
      ].join('\n'),
      back: entry.back,
      category: categoryId
    }));
  });
  return result;
};
