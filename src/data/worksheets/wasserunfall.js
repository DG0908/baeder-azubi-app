const wasserunfall = {
  id: 'wasserunfall',
  title: 'Sicherheit nach einem Wasserunfall',
  subtitle: 'Wasserunfall erkennen, richtig handeln und Warnzeichen nach Beinahe-Ertrinken ernst nehmen',
  category: 'first',
  icon: '🛟',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/wasserunfall-referenz.png',
    alt: 'Lernblatt Wasserunfall und Warnzeichen nach Beinahe-Ertrinken',
    intro:
      'Wasserunfälle und Beinahe-Ertrinken sind klassische Notfälle im Bäderbetrieb — und sie sind oft leise: Wer wirklich am Ertrinken ist, ruft und winkt meistens nicht. Auch nach einem geretteten Wasserunfall kann sich der Zustand der Person noch Stunden später verschlechtern, weil schon kleine Mengen Wasser in den Atemwegen Beschwerden auslösen können. Deshalb gilt: erkennen, sicher retten, Atmung und Bewusstsein prüfen — und nach dem Vorfall genau beobachten. Im Zweifel immer Notruf 112.',
    sections: [
      {
        heading: 'Wasserunfall erkennen — typische Anzeichen',
        items: [
          { label: 'Ertrinken ist oft leise', body: 'Wer wirklich ertrinkt, hat keine Luft zum Rufen — ein lautes "Hilfe!" ist die Ausnahme, nicht die Regel.' },
          { label: 'Kein lautes Rufen oder Winken', body: 'Die Arme sind oft instinktiv unter Wasser, um den Kopf an der Oberfläche zu halten — Winken ist nicht möglich.' },
          { label: 'Senkrechte Körperlage', body: 'Person steht fast aufrecht im Wasser, ohne wirklich Schwimmbewegungen zu machen — typisches Zeichen.' },
          { label: 'Mund und Nase wechseln nahe der Oberfläche', body: 'Der Kopf taucht immer wieder kurz unter und kommt zum Luftholen wieder hoch — oft mit weit aufgerissenem Mund.' },
          { label: 'Erschöpfter, panischer oder leerer Blick', body: 'Augen weit aufgerissen oder glasig, Mimik panisch oder völlig ausdruckslos — die Person ist nicht ansprechbar.' },
        ],
      },
      {
        heading: 'Rettungshilfen nutzen!',
        items: [
          { label: 'Rettungsring', body: 'Wirft man der Person zu — sie kann sich daran festhalten und wird zum Beckenrand gezogen.' },
          { label: 'Rettungsstange', body: 'Reicht man der Person vom sicheren Beckenrand aus — sie greift sie und wird gezogen. Eigenschutz bleibt gewahrt.' },
          { label: 'Andere Hilfsmittel', body: 'Schwimmbrett, Pool-Nudel, Handtuch, Seil — alles, was sicher reicht oder geworfen werden kann.' },
        ],
      },
      {
        heading: 'Sofort richtig handeln (6 Schritte)',
        items: [
          { label: '1. Eigenschutz beachten', body: 'Die eigene Sicherheit hat Priorität. Umgebung überblicken — niemals unkontrolliert ins Wasser springen.' },
          { label: '2. Hilfe rufen / Aufsicht alarmieren', body: 'Sofort andere um Hilfe bitten und die Aufsicht informieren — nicht alleine handeln.' },
          { label: '3. Rettungsmittel nutzen', body: 'Rettungsring, Rettungsstange oder andere Hilfsmittel verwenden — vom sicheren Beckenrand aus.' },
          { label: '4. Person aus dem Wasser bringen — wenn sicher möglich', body: 'Nur handeln, wenn es ungefährlich ist. Niemals sich selbst in Gefahr bringen.' },
          { label: '5. Atmung und Bewusstsein prüfen', body: 'Ansprechen — Atmung kontrollieren — normale Atmung? Bei keiner Atmung: sofort Wiederbelebung.' },
          { label: '6. Bei Atemnot, Bewusstlosigkeit, Unsicherheit: 112', body: 'Notruf absetzen und Anweisungen der Leitstelle befolgen — bis professionelle Hilfe da ist.' },
        ],
      },
      {
        heading: 'Warnzeichen NACH dem Vorfall',
        items: [
          { label: 'Anhaltender Husten', body: 'Husten, der nicht aufhört oder immer wiederkommt — klassisches Zeichen für Wasser in den Atemwegen.' },
          { label: 'Schnelle oder erschwerte Atmung', body: 'Atemfrequenz erhöht, Atmen wirkt angestrengt oder rasselnd.' },
          { label: 'Atemnot', body: 'Person hat das Gefühl, schlecht Luft zu bekommen — oder ringt sichtbar nach Luft.' },
          { label: 'Erbrechen', body: 'Häufig nach verschlucktem Wasser — auch ein Warnzeichen für gestörte Atemwege.' },
          { label: 'Starke Müdigkeit', body: 'Auffallende Erschöpfung, Schläfrigkeit — kann Hinweis auf Sauerstoffmangel sein.' },
          { label: 'Verwirrtheit', body: 'Person ist desorientiert, antwortet wirr oder reagiert verzögert.' },
          { label: 'Bläuliche Lippen oder Haut', body: 'Zyanose — deutliches Zeichen für Sauerstoffmangel. SOFORT 112.' },
          { label: 'Verschlechterung in den nächsten Stunden', body: 'Auch wenn die Person zunächst stabil wirkt: Warnzeichen können sich erst Stunden später entwickeln.' },
        ],
      },
      {
        heading: 'Sofort 112, wenn …',
        items: [
          { label: 'Bewusstlosigkeit', body: 'Person reagiert nicht mehr auf Ansprache oder Berührung — sofortiger Notfall.' },
          { label: 'Atmung fehlt oder ist auffällig', body: 'Keine normale Atmung, Schnappatmung, Rasseln oder Aussetzer — sofort 112 und Wiederbelebung beginnen.' },
          { label: 'Blaue Lippen oder Haut', body: 'Zyanose — Sauerstoffmangel.' },
          { label: 'Zustand verschlechtert sich', body: 'Person wirkt zunehmend schwächer, müder, atemnötiger.' },
          { label: 'Starke Atemnot', body: 'Sichtbar erschwertes Atmen, Person ringt nach Luft.' },
          { label: 'Grundsatz', body: '112 — IMMER lieber zu früh als zu spät. Auch bei Unsicherheit.' },
        ],
      },
      {
        heading: 'Wichtig zu wissen',
        items: [
          { label: 'Begriff "Nachertrinken"', body: 'Ist medizinisch ungenau — gemeint sind Beschwerden nach einem Beinahe-Ertrinken oder Wassereintritt in die Atemwege.' },
          { label: 'Schon kleine Mengen reichen', body: 'Bereits geringe Mengen Wasser in den Atemwegen können Lungenreizung und Atemprobleme auslösen.' },
          { label: 'Verzögerter Verlauf möglich', body: 'Warnzeichen können sich erst Stunden nach dem Vorfall zeigen — Beobachtung über mehrere Stunden ist Pflicht.' },
          { label: 'Immer ärztlich abklären', body: 'Im Zweifel nach jedem Wasserunfall medizinische Hilfe in Anspruch nehmen — auch bei scheinbarer Stabilität.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Wasserunfall', body: 'Jeder Vorfall mit Wassereintritt in die Atemwege oder akuter Gefährdung im Wasser.' },
          { label: 'Beinahe-Ertrinken', body: 'Person wurde aus akuter Wassergefahr gerettet, hat aber Wasser geschluckt oder eingeatmet — engmaschige Beobachtung nötig.' },
          { label: 'Rettungsring', body: 'Schwimmfähiger Ring zum Zuwerfen — Person hält sich fest und wird gezogen.' },
          { label: 'Rettungsstange', body: 'Lange Stange (Hakenstange), die vom sicheren Beckenrand zum Verunfallten gereicht wird.' },
          { label: 'Eigenschutz', body: 'Erste Regel jeder Hilfeleistung: Sich selbst nicht zusätzlich in Gefahr bringen.' },
          { label: 'Zyanose', body: 'Blauverfärbung von Lippen und Haut durch Sauerstoffmangel.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Aufmerksamkeit', body: 'Die Aufsicht muss aktiv beobachten — gerade weil Ertrinken leise abläuft. Senkrechte Körperlage und stiller Kampf an der Oberfläche sind die wichtigsten visuellen Marker.' },
          { label: 'Erstbetreuung nach Rettung', body: 'Nach jeder Rettung Person aus dem Wasser holen, in sichere Lage, Atmung und Bewusstsein prüfen — und in einen ruhigen Raum (Sanitätsraum) bringen.' },
          { label: 'Beobachtung über Stunden', body: 'Auch scheinbar stabile Personen mindestens 4–6 Stunden beobachten lassen — bevorzugt ärztlich abklären.' },
          { label: 'Dokumentation', body: 'Vorfall, Maßnahmen und Verlauf schriftlich dokumentieren — wichtig für Nachsorge und rechtliche Absicherung.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'Nicht nur beruhigen — auch beobachten', body: 'Nach einem Wasserunfall sind Beobachtung und ärztliche Abklärung genauso wichtig wie die Erstrettung.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/wasserunfall-arbeitsblatt.png',
    alt: 'Arbeitsblatt Sicherheit nach einem Wasserunfall zum Ausfüllen',
    tasks: [
      {
        id: 'warnzeichen',
        type: 'open-list',
        title: 'Aufgabe 1: Warnzeichen nach einem Wasserunfall erkennen',
        prompt: 'Trage acht wichtige Warnzeichen ein, auf die du nach einem Wasserunfall oder Beinahe-Ertrinken achten musst.',
        expectedCount: 8,
        pool: [
          { accept: ['Anhaltender Husten', 'Husten', 'Reizhusten', 'Hustenanfall', 'Lang anhaltender Husten'] },
          { accept: ['Schnelle Atmung', 'Erschwerte Atmung', 'Schnelle oder erschwerte Atmung', 'Erhöhte Atemfrequenz', 'Erhoehte Atemfrequenz', 'Beschleunigte Atmung'] },
          { accept: ['Atemnot', 'Luftnot', 'Schwere Atemnot', 'Starke Atemnot', 'Atembeschwerden'] },
          { accept: ['Starke Müdigkeit', 'Starke Muedigkeit', 'Müdigkeit', 'Muedigkeit', 'Schwäche', 'Schwaeche', 'Erschöpfung', 'Erschoepfung', 'Schläfrigkeit', 'Schlaefrigkeit'] },
          { accept: ['Verwirrtheit', 'Benommenheit', 'Desorientierung', 'Verwirrt', 'Bewusstseinstrübung', 'Bewusstseinstruebung'] },
          { accept: ['Bläuliche Lippen', 'Blauliche Lippen', 'Blaue Lippen', 'Bläuliche Haut', 'Blauliche Haut', 'Blaue Haut', 'Zyanose', 'Bläuliche Lippen oder Haut', 'Blauliche Lippen oder Haut', 'Lippenverfärbung', 'Lippenverfaerbung'] },
          { accept: ['Übelkeit', 'Uebelkeit', 'Erbrechen', 'Brechreiz', 'Übelkeit oder Erbrechen', 'Uebelkeit oder Erbrechen'] },
          { accept: ['Verschlechterung', 'Zustandsverschlechterung', 'Verschlechterung in den nächsten Stunden', 'Verschlechterung in den naechsten Stunden', 'Spätere Verschlechterung', 'Spaetere Verschlechterung', 'Verschlechterung des Zustands'] },
        ],
      },
      {
        id: 'verhalten',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Richtiges Verhalten',
        prompt: 'Beschrifte die 6 nummerierten Erste-Hilfe-Schritte.',
        items: [
          { number: 1, accept: ['Eigenschutz', 'Eigenschutz beachten', 'Eigene Sicherheit', 'Selbstschutz', 'Sicherheit beachten'] },
          { number: 2, accept: ['Hilfe rufen', 'Aufsicht alarmieren', 'Hilfe rufen / Aufsicht alarmieren', 'Aufsicht informieren', 'Hilfe holen', 'Andere um Hilfe bitten'] },
          { number: 3, accept: ['Rettungsmittel nutzen', 'Rettungsring', 'Rettungsring nutzen', 'Rettungsstange', 'Rettungsstange nutzen', 'Rettungshilfen einsetzen', 'Hilfsmittel verwenden'] },
          { number: 4, accept: ['Person aus dem Wasser bringen', 'Aus Wasser bringen', 'Aus dem Wasser holen', 'Bergen', 'Person bergen', 'Person retten', 'Wenn sicher Person aus Wasser bringen'] },
          { number: 5, accept: ['Atmung prüfen', 'Atmung pruefen', 'Bewusstsein prüfen', 'Bewusstsein pruefen', 'Atmung und Bewusstsein prüfen', 'Atmung und Bewusstsein pruefen', 'Ansprechen und Atmung kontrollieren', 'Vitalfunktionen prüfen', 'Vitalfunktionen pruefen'] },
          { number: 6, accept: ['Notruf 112', '112', 'Notruf', 'Notruf absetzen', 'Rettungsdienst rufen', '112 wählen', '112 waehlen'] },
        ],
      },
      {
        id: 'situationen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Situationen / Begriffe',
        prompt: 'Benenne die abgebildeten Situationen.',
        items: [
          { hint: 'Rettungsring und Rettungsstange am Beckenrand', accept: ['Rettungsmittel', 'Rettungshilfen', 'Rettungsring', 'Rettungsstange', 'Rettungsring und Rettungsstange', 'Rettungsausrüstung', 'Rettungsausruestung', 'Hilfsmittel'] },
          { hint: 'Person hustet — Wasser in den Atemwegen', accept: ['Husten', 'Anhaltender Husten', 'Reizhusten', 'Hustenanfall', 'Atemwegsreizung'] },
          { hint: 'Notrufnummer auf rotem Schild', accept: ['Notruf 112', '112', 'Notruf', 'Rettungsdienst rufen'] },
          { hint: 'Aufsicht überwacht und dokumentiert die betroffene Person', accept: ['Beobachtung', 'Nachbeobachtung', 'Aufsicht', 'Nachsorge', 'Dokumentation', 'Beobachten', 'Überwachung', 'Ueberwachung'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfragen',
        items: [
          {
            prompt: '1. Warum ist Beobachtung nach einem Wasserunfall wichtig?',
            keywords: ['warnzeichen', 'spät', 'spaet', 'später', 'spaeter', 'stunden', 'wasser', 'atemwege', 'lunge', 'verschlechter', 'beinahe', 'ertrinken', 'nachertrinken', 'auffällig', 'auffaellig', 'beobacht', 'kontroll', 'arzt', 'medizin', 'abklär', 'abklaer'],
            minMatches: 4,
            sampleAnswer:
              'Auch wenn die Person nach einem Wasserunfall zunächst stabil wirkt, können sich Warnzeichen erst Stunden später entwickeln. Schon kleine Mengen Wasser in den Atemwegen oder in der Lunge können zu Atemproblemen, Husten, Atemnot, Verwirrtheit oder bläulichen Lippen führen — oft erst mit Verzögerung. Deshalb muss die Person nach einem Wasserunfall mehrere Stunden beobachtet und im Zweifel ärztlich abgeklärt werden. So lassen sich verzögerte Komplikationen früh erkennen.',
          },
          {
            prompt: '2. Wann sollte der Notruf 112 gewählt werden?',
            keywords: ['bewusst', 'bewusstlos', 'atmung', 'atemnot', 'fehlt', 'auffällig', 'auffaellig', 'blau', 'bläulich', 'blaulich', 'lippen', 'haut', 'zyanose', 'verschlechter', 'unsicher', 'zweifel', 'früh', 'frueh'],
            minMatches: 3,
            sampleAnswer:
              'Notruf 112 immer dann, wenn die Person bewusstlos ist, die Atmung fehlt oder auffällig ist (Schnappatmung, Rasseln), bei bläulichen Lippen oder Haut (Zyanose), starker Atemnot oder einer Verschlechterung des Zustands. Auch bei jeder Unsicherheit gilt: Lieber einmal zu früh anrufen als einmal zu spät — der Rettungsdienst ist auch für Beratung da.',
          },
        ],
      },
    ],
  },
};

export default wasserunfall;
