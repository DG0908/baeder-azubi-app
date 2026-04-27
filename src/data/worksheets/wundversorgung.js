const wundversorgung = {
  id: 'wundversorgung',
  title: 'Wundversorgung',
  subtitle: 'Kleine und mittlere Wunden richtig behandeln',
  category: 'first',
  icon: '🩹',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/wundversorgung-referenz.png',
    alt: 'Lernblatt Wundversorgung — Wundarten, Schritte der Versorgung und Kriterien für ärztliche Abklärung',
    intro:
      'Schnell und richtig handeln hilft, Infektionen zu vermeiden und die Heilung zu fördern. Bei der Wundversorgung gilt: Ruhe bewahren, systematisch vorgehen — Eigenschutz, Wunde beurteilen, Verschmutzung entfernen, Blutung stillen, steril abdecken, Verband anlegen, Wunde beobachten. Bei tiefen, stark verschmutzten oder entzündeten Wunden, Bisswunden, Fremdkörpern oder unklarem Tetanusschutz: ärztlich abklären lassen. Merksatz: REINIGEN — ABDECKEN — SCHÜTZEN — BEOBACHTEN.',
    sections: [
      {
        heading: 'Was ist Wundversorgung?',
        items: [
          { label: 'Erste-Hilfe bei kleinen und mittleren Wunden', body: 'Eigenständige Versorgung von Schürfwunden, Schnittwunden, Kratzern, Blasen — solange die Wunde sauber, klein und ungefährlich ist.' },
          { label: 'Ziel', body: 'Infektionen verhindern, Blutung stillen, Heilung fördern, Schmerzen reduzieren — und entscheiden, ob ärztliche Hilfe nötig ist.' },
          { label: 'Grenzen der Erste-Hilfe', body: 'Bei tiefen, klaffenden, stark verschmutzten Wunden, Bisswunden, Fremdkörpern oder Entzündungszeichen IMMER ärztlich abklären lassen.' },
          { label: 'Hygienisches Arbeiten', body: 'Hände waschen, Einmalhandschuhe anlegen, sterile Wundauflagen verwenden — schützt sowohl Helfer als auch Verletzten vor Keimen.' },
        ],
      },
      {
        heading: 'Wundarten — Übersicht',
        items: [
          { label: 'Schürfwunde', body: 'Oberflächliche Hautverletzung durch Reibung oder Sturz — typisch beim Sturz auf Asphalt, Fliesen, Beckenrand. Meist großflächig, aber flach.' },
          { label: 'Schnittwunde', body: 'Durch scharfe Gegenstände verursachte, meist glatte Wunde — Glasscherben, Messer, scharfe Fliesenkanten. Können tief sein, oft starke Blutung.' },
          { label: 'Platzwunde', body: 'Durch stumpfe Gewalt, Quetschung oder Stoß entstanden — typisch am Kopf nach Sturz oder Aufprall. Wundränder unregelmäßig, oft mit Beule und Bluterguss.' },
          { label: 'Kratzer', body: 'Oberflächliche Ritzverletzung durch Nägel, Dornen oder spitze Gegenstände — meist harmlos, aber Infektionsgefahr bei Verschmutzung.' },
          { label: 'Blase', body: 'Mit Flüssigkeit gefüllte Hautblase durch Reibung oder Druck — typisch an Füßen (neue Schuhe) oder Händen. NICHT aufstechen!' },
          { label: 'Stichwunde', body: 'Durch spitze Gegenstände (Nadel, Holzsplitter, Zahn) — kann tief sein, äußerlich klein wirken, aber innen Verletzungen verursachen. Ärztlich abklären.' },
          { label: 'Bisswunde', body: 'Mensch- oder Tierbiss — IMMER ärztlich abklären (Infektionsgefahr durch Keime im Speichel).' },
        ],
      },
      {
        heading: 'So gehst du vor — Schritte der Wundversorgung',
        items: [
          { label: '1. Eigenschutz', body: 'Hände gründlich waschen, Einmalhandschuhe anziehen — schützt vor Infektionen (für Helfer und Verletzten).' },
          { label: '2. Wunde beurteilen', body: 'Art, Größe, Tiefe, Verschmutzung und Blutung einschätzen — danach entscheiden, ob Erste-Hilfe ausreicht oder Arzt nötig ist.' },
          { label: '3. Leichte Verschmutzung vorsichtig entfernen', body: 'Mit sauberem Wasser oder steriler Kochsalzlösung ausspülen. KEINE aggressiven Mittel (Wasserstoffperoxid, Jod ohne Anweisung).' },
          { label: '4. Blutung durch sanften Druck stillen', body: 'Mit steriler Kompresse oder sauberem Tuch direkt auf die Wunde drücken — bei stärkerer Blutung Druckverband, ggf. 112.' },
          { label: '5. Wunde steril abdecken', body: 'Mit steriler Kompresse oder Wundauflage abdecken — Wundseite NICHT mit den Fingern berühren.' },
          { label: '6. Pflaster oder Verband anlegen', body: 'Passend fixieren: Pflaster für kleine Wunden, Mullbinde oder Verbandpäckchen für größere — fest, aber nicht zu eng (Durchblutung).' },
          { label: '7. Wunde beobachten', body: 'Auf Rötung, Schwellung, Schmerzen, Wärme oder Eiter achten — Verband regelmäßig wechseln. Bei Verschlechterung Arzt.' },
        ],
      },
      {
        heading: 'Wann ärztlich abklären?',
        items: [
          { label: 'Tiefe oder klaffende Wunde', body: 'Wunde ist tief, klafft auseinander oder lässt sich nicht schließen — Naht oder Wundkleber nötig.' },
          { label: 'Starke Verschmutzung', body: 'Erde, Schmutz, Rost, Chemikalien, Splitter in der Wunde — Infektionsgefahr, ärztliche Reinigung nötig.' },
          { label: 'Bisswunde', body: 'Durch Menschen oder Tiere verursachte Wunden — IMMER ärztlich, Tollwutprophylaxe und Tetanus prüfen.' },
          { label: 'Fremdkörper in der Wunde', body: 'Splitter, Glas, Metall sichtbar oder tastbar — größere NIE selbst entfernen, Wunde abdecken, ärztlich entfernen lassen.' },
          { label: 'Starke Schmerzen', body: 'Zunehmende oder sehr starke Schmerzen trotz Erstversorgung — Hinweis auf tiefere Verletzung oder Infektion.' },
          { label: 'Entzündungszeichen', body: 'Rötung, Wärme, Schwellung, Eiter, Fieber — Wundinfektion, sofort Arzt.' },
          { label: 'Tetanusschutz unklar', body: 'Letzte Tetanus-Schutzimpfung länger als 10 Jahre zurück oder unbekannt — vor allem bei verschmutzten oder tiefen Wunden auffrischen lassen.' },
          { label: 'Wunde im Gesicht', body: 'Auch kleine Schnitte am Gesicht ärztlich versorgen — kosmetisches Ergebnis und Narbenbildung wichtig.' },
          { label: 'Im Zweifel', body: 'Lieber einmal zu viel als zu wenig zum Arzt — bei Unsicherheit ärztlichen Notdienst anrufen oder Hausarzt aufsuchen.' },
        ],
      },
      {
        heading: 'Wichtig vermeiden',
        items: [
          { label: 'Keine Hausmittel', body: 'Salben, Puder, Mehl, Zahnpasta, Desinfektionsmittel aus dem Haushalt NICHT verwenden — können die Wunde reizen, Infektionen begünstigen oder die Beurteilung erschweren.' },
          { label: 'Keine Watte direkt auf offene Wunden', body: 'Wattefasern können in der Wunde zurückbleiben — verwenden statt dessen sterile Kompressen oder Wundauflagen.' },
          { label: 'Größere Fremdkörper nicht herausziehen', body: 'NIE selbst entfernen — können wie ein Stöpsel wirken und stärkere Blutung verhindern. Wunde abdecken, ärztlich entfernen lassen.' },
          { label: 'Nicht unnötig in der Wunde reiben', body: 'Zusätzliche Reibung kann die Wunde reizen und die Heilung stören — sanft spülen, nicht schrubben.' },
          { label: 'Keine Eigenmedikation mit Antibiotika', body: 'Antibiotika-Salben oder -Tabletten nur nach ärztlicher Anweisung — falsche Anwendung fördert Resistenzen.' },
        ],
      },
      {
        heading: 'Erste-Hilfe-Ausstattung',
        items: [
          { label: 'Einmalhandschuhe', body: 'Pflicht für jeden Helfer — schützt vor Infektion durch Blut. Mehrere Größen vorrätig.' },
          { label: 'Wunddesinfektion', body: 'Hautfreundliches Desinfektionsmittel (z. B. Octenisept) — für die äußere Anwendung. KEIN reiner Alkohol auf offene Wunden.' },
          { label: 'Sterile Kompressen', body: 'In verschiedenen Größen — als Wundauflage und für Druckverbände.' },
          { label: 'Mullbinde', body: 'Zur Fixierung von Kompressen und für Druckverbände.' },
          { label: 'Pflaster', body: 'Verschiedene Größen — für kleine Wunden, Schürfwunden, Schnitte.' },
          { label: 'Verbandpäckchen', body: 'Sterile Wundauflage mit Mullbinde in einem — schnell griffbereit für mittlere Wunden.' },
          { label: 'Schere', body: 'Verbandschere mit abgerundeter Spitze — zum Zuschneiden von Verbänden, im Notfall auch zum Aufschneiden von Kleidung.' },
          { label: 'Pinzette', body: 'Zum Entfernen kleiner Splitter oder Insektenstacheln — größere Fremdkörper nicht selbst entfernen.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Wundversorgung', body: 'Erste-Hilfe-Maßnahmen bei Verletzungen der Haut — Reinigung, Blutstillung, Abdecken, Beobachten.' },
          { label: 'Steril', body: 'Keimfrei — sterile Wundauflagen sind nicht durch Hände, Luft oder Gegenstände kontaminiert. NICHT die Wundseite berühren.' },
          { label: 'Aseptik', body: 'Vermeiden, dass Keime in die Wunde gelangen — durch hygienisches Arbeiten und sterile Materialien.' },
          { label: 'Antiseptik', body: 'Abtöten von Keimen — Wunddesinfektion mit speziellen Mitteln (z. B. Octenisept).' },
          { label: 'Tetanus (Wundstarrkrampf)', body: 'Bakterielle Erkrankung durch Tetanus-Erreger im Boden, Rost, Speichel — Impfung alle 10 Jahre auffrischen, vor allem bei verschmutzten Wunden.' },
          { label: 'Tollwut', body: 'Virale Erkrankung durch Bisswunden — bei jeder Bisswunde ärztliche Abklärung, in Risikoregionen Impfung erwägen.' },
          { label: 'Wundinfektion', body: 'Eindringen und Vermehrung von Krankheitserregern in der Wunde — typische Zeichen: Rötung, Wärme, Schwellung, Schmerz, Eiter, Fieber.' },
          { label: 'Tiefe Wunde', body: 'Wunde, die durch alle Hautschichten reicht oder Muskeln, Sehnen, Nerven freilegt — IMMER ärztlich.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Schürfwunden auf nassen Fliesen', body: 'Sturz am Beckenrand — Knie, Ellenbogen, Handfläche. Sauber spülen, abdecken, beobachten — bei großflächigen Schürfwunden ärztlich.' },
          { label: 'Schnittwunden durch Glas', body: 'Glasscherben in der Sauna, am Bistro — sofort Eigenschutz (Handschuhe), Druck, Verband, ggf. 112. Wundbeurteilung: tief? klaffend?' },
          { label: 'Platzwunden am Kopf', body: 'Sturz, Aufprall am Sprungturm — bluten oft stark wegen vieler Blutgefäße. Druck mit Kompresse, ärztliche Abklärung wegen möglicher Gehirnerschütterung.' },
          { label: 'Bisswunden im Bistro', body: 'Hund unter dem Tisch beißt — IMMER ärztlich (Tollwut, Tetanus, Bakterien). Wunde reinigen, abdecken, 112 oder Hausarzt.' },
          { label: 'Insektenstiche und Splitter', body: 'Bienen, Wespen, Holzsplitter aus Sitzbänken — Stachel/Splitter mit Pinzette entfernen, Wunde reinigen. Bei allergischer Reaktion sofort 112.' },
          { label: 'Hygiene zuerst', body: 'Im Bäderbetrieb erhöhtes Infektionsrisiko (Wasser, viele Personen) — IMMER Handschuhe, sterile Wundauflagen, regelmäßige Verbandwechsel.' },
          { label: 'Erste-Hilfe-Koffer aktuell halten', body: 'Verfallsdaten der Materialien prüfen, nach Einsatz auffüllen, Standort allen Aufsichtskräften bekannt.' },
        ],
      },
      {
        heading: 'Merkkasten — wichtige Schritte auf einen Blick',
        items: [
          { label: 'REINIGEN', body: 'Schonend spülen und säubern — Wasser, Kochsalzlösung, sterile Lösung. Keine Hausmittel.' },
          { label: 'ABDECKEN', body: 'Steril abdecken, Wundauflage NICHT berühren — saubere Hände, Handschuhe.' },
          { label: 'SCHÜTZEN', body: 'Verband oder Pflaster sicher anlegen — fest, aber nicht zu eng. Durchblutung kontrollieren.' },
          { label: 'BEOBACHTEN', body: 'Heilungsverlauf im Blick behalten und reagieren — bei Rötung, Schwellung, Eiter, Fieber zum Arzt.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'REINIGEN — ABDECKEN — SCHÜTZEN — BEOBACHTEN', body: 'Erste Hilfe ist einfach — wenn man weiß, wie es geht. Vier Schritte, die jede Wundversorgung tragen. Im Zweifel: ärztlich abklären lassen.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/wundversorgung-arbeitsblatt.png',
    alt: 'Arbeitsblatt Wundversorgung zum Ausfüllen',
    tasks: [
      {
        id: 'wundarten',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Wundarten erkennen',
        prompt: 'Beschrifte die Abbildungen mit dem passenden Begriff.',
        items: [
          { number: 1, accept: ['Schürfwunde', 'Schuerfwunde', 'Abschürfung', 'Abschuerfung', 'Hautabschürfung', 'Hautabschuerfung', 'Schürfung', 'Schuerfung', 'Schürfwunde / Abschürfung', 'Schuerfwunde / Abschuerfung'] },
          { number: 2, accept: ['Schnittwunde', 'Schnittverletzung', 'Schnitt', 'Schnitt-Wunde', 'Schnittwunde / Schnittverletzung', 'Glatte Schnittwunde'] },
          { number: 3, accept: ['Platzwunde', 'Prellung', 'Beule', 'Hämatom', 'Haematom', 'Platzwunde / Prellung', 'Platzwunde / Beule', 'Prellwunde', 'Bluterguss', 'Quetschwunde', 'Platzwunde / Prellwunde', 'Platzwunde / Hämatom', 'Platzwunde / Haematom'] },
          { number: 4, accept: ['Kratzer', 'Kratzwunde', 'Kratzverletzung', 'Schramme', 'Ritzverletzung', 'Hautritzverletzung'] },
          { number: 5, accept: ['Blase', 'Hautblase', 'Brandblase', 'Druckblase', 'Wundblase', 'Reibungsblase'] },
        ],
      },
      {
        id: 'vorgehen',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Richtiges Vorgehen',
        prompt: 'Nenne sechs wichtige Schritte der Wundversorgung.',
        items: [
          { number: 1, accept: ['Eigenschutz', 'Handschuhe', 'Handschuhe anziehen', 'Eigenschutz / Handschuhe anziehen', 'Einmalhandschuhe', 'Einmalhandschuhe anziehen', 'Sauber arbeiten', 'Hände waschen', 'Haende waschen', 'Hände waschen und Handschuhe anziehen', 'Haende waschen und Handschuhe anziehen', 'Schutzhandschuhe anlegen'] },
          { number: 2, accept: ['Wunde beurteilen', 'Wunde anschauen', 'Wunde kontrollieren', 'Wunde prüfen', 'Wunde pruefen', 'Wunde beurteilen / anschauen', 'Wunde einschätzen', 'Wunde einschaetzen', 'Wunde inspizieren', 'Beurteilen', 'Wunde betrachten'] },
          { number: 3, accept: ['Blutung stillen', 'Blutung durch sanften Druck stillen', 'Sanften Druck ausüben', 'Sanften Druck ausueben', 'Druck ausüben', 'Druck ausueben', 'Druck auf die Wunde', 'Kompresse aufdrücken', 'Kompresse aufdruecken', 'Blutung durch Druck stillen', 'Sanfter Druck', 'Blutung stoppen', 'Druck mit Kompresse'] },
          { number: 4, accept: ['Wunde reinigen', 'Reinigen', 'Leichte Verschmutzung entfernen', 'Wunde vorsichtig reinigen', 'Wunde vorsichtig reinigen / leichte Verschmutzung entfernen', 'Ausspülen', 'Ausspuelen', 'Wunde ausspülen', 'Wunde ausspuelen', 'Mit Wasser reinigen', 'Mit Kochsalzlösung spülen', 'Mit Kochsalzloesung spuelen', 'Wunde säubern', 'Wunde saeubern'] },
          { number: 5, accept: ['Sterile Kompresse', 'Wundauflage', 'Sterile Kompresse / Wundauflage', 'Sterile Wundauflage', 'Sterile Kompresse / Wundauflage bereitlegen', 'Kompresse auflegen', 'Sterile Kompresse auflegen', 'Steril abdecken', 'Wunde steril abdecken', 'Sterile Wundauflage auflegen', 'Wunde abdecken'] },
          { number: 6, accept: ['Pflaster', 'Verband', 'Pflaster oder Verband', 'Pflaster anlegen', 'Verband anlegen', 'Pflaster oder Verband anlegen', 'Verbinden', 'Verband fixieren', 'Pflaster aufkleben', 'Mullbinde anlegen', 'Verbandpäckchen', 'Verbandpaeckchen'] },
        ],
      },
      {
        id: 'arzt',
        type: 'numbered-labels',
        title: 'Aufgabe 3: Wann ärztlich abklären?',
        prompt: 'Schreibe passende Situationen auf — wann muss eine Wunde ärztlich abgeklärt werden?',
        items: [
          { number: 1, accept: ['Tiefe Wunde', 'Klaffende Wunde', 'Tiefe oder klaffende Wunde', 'Klaffend', 'Tiefe oder klaffende Verletzung', 'Wunde klafft', 'Tiefe Schnittwunde', 'Wunde lässt sich nicht schließen', 'Wunde laesst sich nicht schliessen'] },
          { number: 2, accept: ['Starke Verschmutzung', 'Verschmutzte Wunde', 'Schmutz in der Wunde', 'Stark verschmutzt', 'Erde in der Wunde', 'Schmutz', 'Verschmutzung', 'Stark verschmutzte Wunde', 'Schmutzige Wunde'] },
          { number: 3, accept: ['Bisswunde', 'Tierbiss', 'Menschenbiss', 'Biss', 'Bissverletzung', 'Hundebiss', 'Bisswunde durch Mensch oder Tier'] },
          { number: 4, accept: ['Fremdkörper', 'Fremdkoerper', 'Fremdkörper in der Wunde', 'Fremdkoerper in der Wunde', 'Splitter', 'Splitter in der Wunde', 'Glas in der Wunde', 'Metall in der Wunde', 'Holzsplitter', 'Stachel'] },
          { number: 5, accept: ['Entzündung', 'Entzuendung', 'Entzündungszeichen', 'Entzuendungszeichen', 'Rötung', 'Roetung', 'Schwellung', 'Eiter', 'Fieber', 'Wundinfektion', 'Infektion', 'Rötung und Schwellung', 'Roetung und Schwellung', 'Entzündete Wunde', 'Entzuendete Wunde'] },
          { number: 6, accept: ['Tetanusschutz unklar', 'Unsicherheit', 'Tetanus unklar', 'Unklarer Tetanusschutz', 'Tetanusimpfung unklar', 'Unsicherheit / Tetanusschutz unklar', 'Im Zweifel', 'Tetanus-Auffrischung nötig', 'Tetanus-Auffrischung noetig', 'Impfschutz unklar', 'Tetanusschutz fehlt'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfragen',
        items: [
          {
            prompt: '1. Warum ist hygienisches Arbeiten bei der Wundversorgung wichtig?',
            keywords: ['keime', 'bakterien', 'infektion', 'wunde', 'eindringen', 'verhindern', 'schutz', 'helfer', 'verletzt', 'sauber', 'hygienisch', 'sterile', 'handschuhe', 'heilung'],
            minMatches: 3,
            sampleAnswer:
              'Hygienisches Arbeiten ist wichtig, damit keine Keime, Bakterien oder Viren in die Wunde gelangen — sonst droht eine Wundinfektion mit Rötung, Schwellung, Eiter und Fieber. Saubere Hände, Einmalhandschuhe und sterile Wundauflagen schützen sowohl den Helfer als auch den Verletzten vor einer Übertragung von Krankheitserregern (z. B. HIV, Hepatitis, Tetanus). Eine saubere Versorgung verringert das Risiko für Infektionen erheblich und fördert eine schnellere Heilung der Wunde.',
          },
          {
            prompt: '2. Wann sollte man mit einer Wunde ärztliche Hilfe suchen?',
            keywords: ['tief', 'klaffend', 'verschmutz', 'biss', 'fremdkörper', 'fremdkoerper', 'splitter', 'entzünd', 'entzuend', 'rötung', 'roetung', 'schwellung', 'eiter', 'fieber', 'schmerz', 'tetanus', 'unsicher', 'gesicht', 'arzt'],
            minMatches: 3,
            sampleAnswer:
              'Ärztliche Hilfe ist nötig bei tiefen oder klaffenden Wunden, starker Verschmutzung (Erde, Rost, Chemikalien), Bisswunden (Mensch oder Tier), Fremdkörpern in der Wunde (Splitter, Glas, Metall), Entzündungszeichen (Rötung, Schwellung, Eiter, Fieber), starken oder zunehmenden Schmerzen, unklarem Tetanusschutz (letzte Auffrischung > 10 Jahre), Wunden im Gesicht und generell bei Unsicherheit. Im Zweifel lieber einmal zu viel als zu wenig zum Arzt — eine verschleppte Wundinfektion kann ernste Komplikationen verursachen.',
          },
        ],
      },
    ],
  },
};

export default wundversorgung;
