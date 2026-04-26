const hlwWiederbelebung = {
  id: 'hlw-wiederbelebung',
  title: 'HLW / Wiederbelebung mit AED',
  subtitle: 'Bewusstlosigkeit erkennen, richtig handeln und den AED sicher anwenden',
  category: 'first',
  icon: '🫀',
  estimatedMinutes: 25,
  reference: {
    image: '/worksheets/hlw-wiederbelebung-referenz.png',
    alt: 'Lernblatt HLW / Wiederbelebung mit AED — Ablauf, Herzdruckmassage und AED-Anwendung',
    intro:
      'Die Herz-Lungen-Wiederbelebung (HLW) ist die wichtigste Erste-Hilfe-Maßnahme bei einem Kreislaufstillstand — und für jede Aufsichtskraft im Bäderbetrieb absolute Pflicht. Bei plötzlichem Herzstillstand sterben Hirnzellen innerhalb weniger Minuten ab. Frühzeitige Herzdruckmassage und der Einsatz eines AED (automatisierter externer Defibrillator) können Leben retten und die Überlebenschance verdoppeln bis verdreifachen. Der Merksatz lautet: Prüfen — Rufen — Drücken — AED.',
    sections: [
      {
        heading: 'Notfall erkennen',
        items: [
          { label: 'Person reagiert nicht', body: 'Kein Reagieren auf Ansprache, Anfassen oder Rütteln an den Schultern.' },
          { label: 'Keine normale Atmung / Schnappatmung', body: 'Atmung fehlt komplett, oder es ist nur eine flache, unregelmäßige Schnappatmung erkennbar — Schnappatmung ist KEINE normale Atmung und gilt als Kreislaufstillstand.' },
          { label: 'Sofort Hilfe holen', body: 'Andere lautstark um Hilfe rufen, Notruf 112 absetzen lassen, AED holen lassen.' },
        ],
      },
      {
        heading: 'Sofortmaßnahmen (4 Schritte)',
        items: [
          { label: '1. Ansprechen und Reaktion prüfen', body: 'Laut ansprechen ("Hallo, hören Sie mich?"), an den Schultern rütteln. Keine Reaktion → bewusstlos.' },
          { label: '2. Atmung max. 10 Sekunden prüfen', body: 'Kopf überstrecken (Esmarch-Handgriff), Atmung sehen, hören, fühlen — maximal 10 Sekunden. Schnappatmung zählt NICHT als normale Atmung.' },
          { label: '3. Notruf 112 veranlassen', body: 'Selbst rufen oder gezielt eine Person ansprechen ("Sie da, in dem roten T-Shirt — rufen Sie 112!").' },
          { label: '4. AED holen lassen', body: 'Wenn jemand verfügbar ist: AED holen lassen. Solange parallel mit der Herzdruckmassage starten — nicht warten.' },
        ],
      },
      {
        heading: 'Herzdruckmassage — die Technik',
        items: [
          { label: 'Druckpunkt', body: 'Mitte des Brustkorbs — auf das untere Drittel des Brustbeins, zwischen den Brustwarzen.' },
          { label: 'Drucktiefe', body: 'Etwa 5–6 cm bei Erwachsenen. Lieber etwas tiefer als zu flach.' },
          { label: 'Frequenz', body: '100–120 Kompressionen pro Minute (Takt von "Stayin\' Alive" oder "Highway to Hell").' },
          { label: 'Arme gestreckt, Schultern über den Händen', body: 'Senkrecht von oben drücken — die Kraft kommt aus dem Oberkörper, nicht aus den Armen.' },
          { label: 'Vollständig entlasten', body: 'Nach jeder Kompression den Brustkorb komplett zurückfedern lassen — sonst füllt sich das Herz nicht.' },
          { label: 'Hartere Unterlage', body: 'Person flach auf den Rücken auf festem Untergrund (Boden) — auf weichem Bett ist die Druckmassage wirkungslos.' },
        ],
      },
      {
        heading: 'Beatmung',
        items: [
          { label: 'Wenn geschult und sicher: 30 : 2', body: '30 Druckmassagen, dann 2 Atemspenden — das ist der Standard-Ablauf für geschulte Helfer.' },
          { label: 'Atemspende durchführen', body: 'Kopf überstrecken, Kinn anheben, Nase zuhalten, normale Einatmung, dann etwa 1 Sekunde gleichmäßig in den Mund der Person ausatmen — Brustkorb soll sich heben.' },
          { label: 'Wenn nicht geschult oder nicht möglich', body: 'Reine Druckmassage — DURCHGEHEND drücken, keine Pausen für Beatmung. Auch das rettet Leben.' },
          { label: 'Hygiene', body: 'Beatmungstuch oder Beatmungsmaske mit Ventil verwenden, wenn verfügbar — schützt Helfer und Patient.' },
        ],
      },
      {
        heading: 'AED anwenden',
        items: [
          { label: '1. Gerät einschalten', body: 'AED-Koffer öffnen, Gerät einschalten — viele AEDs starten automatisch beim Öffnen.' },
          { label: '2. Elektroden aufkleben', body: 'Wie auf den Elektroden abgebildet: eine rechts oberhalb der Brustwarze unter dem Schlüsselbein, eine links seitlich unterhalb der Brustwarze. Brust ggf. trockenwischen, behaart kurz rasieren.' },
          { label: '3. Sprachanweisungen folgen', body: 'AED gibt klare Sprachanweisungen — einfach folgen. Das Gerät analysiert den Herzrhythmus selbständig.' },
          { label: '4. Während Analyse / Schock: niemand berührt!', body: 'Bei Analyse und Schockabgabe darf NIEMAND die Person berühren — laut "Weg von der Person!" rufen und sicherstellen, dass alle Abstand halten.' },
          { label: '5. Sofort HLW fortsetzen', body: 'Nach Schockabgabe oder bei "Kein Schock empfohlen": SOFORT mit der Herzdruckmassage weitermachen — der AED meldet sich nach 2 Minuten erneut.' },
        ],
      },
      {
        heading: 'Elektrodenposition',
        items: [
          { label: 'Elektrode 1 — rechts oben', body: 'Rechts oberhalb der Brustwarze, unter dem Schlüsselbein.' },
          { label: 'Elektrode 2 — links unten', body: 'Links seitlich unterhalb der Brustwarze, an der Flanke.' },
          { label: 'Wichtig', body: 'Elektroden direkt auf trockene Haut, nicht auf Pflaster, Schmuck, Schrittmacher oder behaarte Brust ohne Rasur.' },
        ],
      },
      {
        heading: 'Wann weitermachen — wann aufhören?',
        items: [
          { label: 'Weitermachen bis …', body: 'Professionelle Hilfe (Rettungsdienst) übernimmt — die Person wieder normal atmet — du selbst völlig erschöpft bist und keine andere Hilfe verfügbar ist.' },
          { label: 'Niemals zu früh aufhören', body: 'Auch wenn die Person nicht "reagiert" — die Druckmassage zirkuliert das Blut. Aufhören hieße Hirnschaden.' },
          { label: 'Helfer wechseln', body: 'Druckmassage ist anstrengend — wenn möglich alle 2 Minuten mit einem zweiten Helfer wechseln, ohne Pause.' },
        ],
      },
      {
        heading: 'Was man vermeiden sollte',
        items: [
          { label: 'Maßnahmen nicht unnötig unterbrechen', body: 'Jede Pause kostet Hirndurchblutung — möglichst durchgehend drücken.' },
          { label: 'Bei Analyse oder Schock nicht berühren', body: 'Sicherheitsabstand zur Person, sonst Stromschlaggefahr.' },
          { label: 'Nicht lange nach dem Puls suchen', body: 'Pulskontrolle ist auch für Profis schwer — bei Bewusstlosigkeit ohne normale Atmung sofort drücken. Keine Zeit verlieren.' },
          { label: 'Keine Angst vor Fehlern', body: 'Die einzige falsche Entscheidung ist NICHTS zu tun. Selbst bei Knochenbruch (Rippe) ist die Druckmassage richtig — Knochen heilen, das Gehirn nicht.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'HLW (Herz-Lungen-Wiederbelebung)', body: 'Kombination aus Herzdruckmassage und Beatmung — bei Kreislaufstillstand.' },
          { label: 'CPR (Cardio-Pulmonary Resuscitation)', body: 'Englische Bezeichnung für HLW — international gebräuchlich.' },
          { label: 'AED', body: 'Automatisierter Externer Defibrillator — gibt im Notfall einen Stromstoß zur Wiederherstellung des Herzrhythmus. Auch von Laien sicher bedienbar.' },
          { label: 'Schnappatmung', body: 'Flache, langsame, schnaufende Atemzüge bei Kreislaufstillstand — KEINE normale Atmung. Sofort mit HLW beginnen.' },
          { label: 'Kreislaufstillstand', body: 'Herz pumpt kein Blut mehr — Person bewusstlos ohne normale Atmung. Lebensgefahr in Minuten.' },
          { label: 'Esmarch-Handgriff', body: 'Kopf überstrecken und Kinn anheben — öffnet die Atemwege bei bewusstlosen Personen.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'AED-Standort', body: 'Jede Aufsichtskraft muss wissen, wo der AED hängt — und wie er bedient wird. Standort regelmäßig prüfen.' },
          { label: 'Auf nassem Untergrund', body: 'Person aus dem Wasser holen, möglichst trockene Stelle suchen, Brustkorb trockenwischen — AED funktioniert auch auf Fliesen, aber nicht in Pfützen.' },
          { label: 'Regelmäßige Schulung', body: 'HLW-Praxis verblasst schnell — mindestens jährliche Auffrischung ist Pflicht. Neuen Kollegen vorführen.' },
          { label: 'Im Team arbeiten', body: 'HLW ist Teamarbeit: Einer drückt, einer beatmet/AED, einer koordiniert mit dem Rettungsdienst — Aufgaben klar verteilen.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'PRÜFEN — RUFEN — DRÜCKEN — AED', body: 'Vier Schritte. Jede Sekunde zählt. Lieber unsicher Hilfe leisten als gar nicht helfen.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/hlw-wiederbelebung-arbeitsblatt.png',
    alt: 'Arbeitsblatt HLW / Wiederbelebung mit AED zum Ausfüllen',
    tasks: [
      {
        id: 'ablauf',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Ablauf im Notfall',
        prompt: 'Bringe die Schritte der Wiederbelebung in die richtige Reihenfolge und benenne sie.',
        items: [
          { number: 1, accept: ['Bewusstsein prüfen', 'Bewusstsein pruefen', 'Person ansprechen', 'Ansprechen', 'Reaktion prüfen', 'Reaktion pruefen', 'Ansprechen und Reaktion prüfen', 'Ansprechen und Reaktion pruefen'] },
          { number: 2, accept: ['Atmung prüfen', 'Atmung pruefen', 'Atmung kontrollieren', 'Atemkontrolle', 'Atemwege prüfen', 'Atemwege pruefen', 'Atmung max. 10 Sekunden prüfen', 'Atmung max 10 Sekunden pruefen'] },
          { number: 3, accept: ['Notruf 112', '112', 'Notruf', '112 wählen', '112 waehlen', 'Notruf absetzen', 'Notruf 112 absetzen', 'Hilfe rufen', 'Rettungsdienst rufen'] },
          { number: 4, accept: ['Herzdruckmassage', 'Herzdruckmassage beginnen', 'Druckmassage', 'Drücken', 'Druecken', 'Brustkorbkompression', 'Kompressionen', '30 zu 2', '30:2', 'HLW beginnen', 'Wiederbelebung beginnen'] },
          { number: 5, accept: ['AED holen', 'AED einschalten', 'AED holen / einschalten', 'AED holen einschalten', 'AED anwenden', 'AED einsetzen', 'AED', 'Defibrillator', 'AED holen lassen', 'AED einsatzbereit machen'] },
          { number: 6, accept: ['Niemand berührt', 'Niemand beruehrt', 'AED analysiert', 'Schock abgeben', 'Niemand berührt – AED analysiert', 'Niemand beruehrt - AED analysiert', 'AED-Analyse', 'AED Analyse', 'Schockabgabe', 'Schock auslösen', 'Schock ausloesen', 'Person nicht berühren', 'Person nicht beruehren', 'Sicherheitsabstand', 'Während Schock nicht berühren', 'Waehrend Schock nicht beruehren', 'Weg von der Person', 'AED-Schock'] },
        ],
      },
      {
        id: 'technik',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Herzdruckmassage',
        prompt: 'Beschrifte die wichtige Technik der Herzdruckmassage.',
        items: [
          { number: 1, accept: ['Hände', 'Haende', 'Handposition', 'Hände übereinander', 'Haende uebereinander', 'Druckpunkt', 'Hände auf Brustkorb', 'Haende auf Brustkorb', 'Handballen', 'Handballen auf Brustbein'] },
          { number: 2, accept: ['Schultern über den Händen', 'Schultern ueber den Haenden', 'Schultern über Händen', 'Schultern ueber Haenden', 'Schulterposition', 'Senkrecht über Brustkorb', 'Senkrecht ueber Brustkorb', 'Oberkörper über Person', 'Oberkoerper ueber Person'] },
          { number: 3, accept: ['Arme gestreckt', 'Gestreckte Arme', 'Arme durchgestreckt', 'Ellenbogen gestreckt', 'Arme nicht gebeugt'] },
          { number: 4, accept: ['Druckpunkt Brustbeinmitte', 'Druckpunkt', 'Brustbeinmitte', 'Mitte des Brustkorbs', 'Druckpunkt Mitte Brustkorb', 'Mitte Brustbein', 'Brustbein', 'Brustkorbmitte', 'Sternum', 'Unteres Drittel Brustbein'] },
          { number: 5, accept: ['Drucktiefe 5-6 cm', 'Drucktiefe', 'Drucktiefe ca. 5-6 cm', '5-6 cm', '5 bis 6 cm', 'Tief drücken', 'Tief druecken', 'Eindrücktiefe', 'Eindruecktiefe', 'Kompressionstiefe'] },
          { number: 6, accept: ['Harter Untergrund', 'Flache Rückenlage', 'Flache Rueckenlage', 'Harter Untergrund / flache Rückenlage', 'Harter Untergrund / flache Rueckenlage', 'Person flach auf dem Rücken', 'Person flach auf dem Ruecken', 'Person flach auf Rücken', 'Person flach auf Ruecken', 'Rückenlage', 'Rueckenlage', 'Fester Untergrund', 'Boden', 'Auf hartem Boden', 'Auf hartem Untergrund'] },
        ],
      },
      {
        id: 'aed',
        type: 'labels',
        title: 'Aufgabe 3: AED richtig anwenden',
        prompt: 'Schreibe den passenden Begriff unter jedes Bild.',
        items: [
          { hint: 'AED-Koffer geöffnet, Gerät bereit', accept: ['AED einschalten', 'AED öffnen', 'AED oeffnen', 'AED bereitstellen', 'Gerät einschalten', 'Geraet einschalten', 'AED aktivieren', 'AED', 'AED holen'] },
          { hint: 'Elektroden auf den Brustkorb der Person aufgeklebt', accept: ['Elektroden aufkleben', 'Elektroden anbringen', 'Elektroden anlegen', 'Pads aufkleben', 'Klebeelektroden', 'Elektrodenposition', 'Elektroden auf Brust'] },
          { hint: 'Helfer signalisiert mit Hand "Stop" — niemand berührt die Person', accept: ['Niemand berührt', 'Niemand beruehrt', 'Person nicht berühren', 'Person nicht beruehren', 'Sicherheitsabstand', 'Während Schock nicht berühren', 'Waehrend Schock nicht beruehren', 'Weg von der Person', 'Während Analyse nicht berühren', 'Waehrend Analyse nicht beruehren', 'Abstand halten'] },
          { hint: 'Helfer setzt die Herzdruckmassage fort', accept: ['HLW fortsetzen', 'Wiederbelebung fortsetzen', 'Weitermachen', 'Druckmassage fortsetzen', 'Sofort HLW fortsetzen', 'CPR fortsetzen', 'HLW weiterführen', 'HLW weiterfuehren'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfragen',
        items: [
          {
            prompt: '1. Warum soll bei einem Kreislaufstillstand sofort mit der Herzdruckmassage begonnen werden?',
            keywords: ['gehirn', 'sauerstoff', 'durchblutung', 'kreislauf', 'minute', 'zeit', 'absterben', 'sterben', 'hirnzellen', 'schaden', 'früh', 'frueh', 'überleben', 'ueberleben', 'pumpe', 'blut', 'herz', 'pumpen', 'zirkulation'],
            minMatches: 4,
            sampleAnswer:
              'Bei einem Kreislaufstillstand pumpt das Herz kein Blut mehr — die Hirnzellen bekommen sofort keinen Sauerstoff mehr und beginnen innerhalb von 3–5 Minuten abzusterben. Mit jeder Minute ohne Herzdruckmassage sinkt die Überlebenswahrscheinlichkeit um etwa 10 %. Die Herzdruckmassage ersetzt vorübergehend die Pumpfunktion des Herzens und versorgt Gehirn und Organe mit Blut, bis professionelle Hilfe kommt oder der AED den Herzrhythmus wiederherstellt. Deshalb gilt: sofort drücken — keine Zeit mit Pulskontrolle oder Zögern verlieren.',
          },
          {
            prompt: '2. Wann darf man mit der HLW aufhören?',
            keywords: ['rettungsdienst', 'professionell', 'übernimmt', 'uebernimmt', 'normal', 'atmet', 'atmung', 'erschöpft', 'erschoepft', 'erschöpfung', 'erschoepfung', 'wechseln', 'helfer', 'reagiert', 'aufwacht', 'übernehmen', 'uebernehmen'],
            minMatches: 3,
            sampleAnswer:
              'Mit der HLW darf man erst aufhören, wenn der Rettungsdienst oder professionelle Hilfe übernimmt, wenn die Person wieder normal atmet und Lebenszeichen zeigt, oder wenn man selbst völlig erschöpft ist und keine andere Hilfe verfügbar ist. Vorher gilt: weitermachen — wenn möglich alle 2 Minuten mit einem zweiten Helfer wechseln, ohne die Druckmassage zu unterbrechen. Auch wenn die Person nicht "reagiert", sorgt die Druckmassage für Blutfluss zum Gehirn — aufhören hieße Hirnschaden riskieren.',
          },
        ],
      },
    ],
  },
};

export default hlwWiederbelebung;
