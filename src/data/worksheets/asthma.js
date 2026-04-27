const asthma = {
  id: 'asthma',
  title: 'Asthma',
  subtitle: 'Symptome erkennen, Auslöser verstehen und richtig handeln',
  category: 'first',
  icon: '🫁',
  estimatedMinutes: 20,
  reference: {
    image: '/worksheets/asthma-referenz.png',
    alt: 'Lernblatt Asthma — Symptome, Auslöser, Erste-Hilfe-Maßnahmen und Notfallkriterien',
    intro:
      'Asthma ist eine chronische Erkrankung der Atemwege. Bei einem Anfall verengen sich die Bronchien, die Schleimhaut schwillt an und es wird vermehrt Schleim gebildet — das Atmen, vor allem das Ausatmen, fällt schwer. Wichtig: Ruhe bewahren, aufrechte Haltung ermöglichen (Kutschersitz), enge Kleidung lockern, eigenes Asthmaspray reichen, beruhigend sprechen und die Ausatmung betonen. Bei schwerer Atemnot, bläulichen Lippen, fehlender Besserung trotz Spray, zunehmender Erschöpfung oder Bewusstseinsstörung sofort Notruf 112. Merksatz: AUFRECHT LAGERN — BERUHIGEN — SPRAY REICHEN — BEOBACHTEN — BEI VERSCHLECHTERUNG NOTRUF 112.',
    sections: [
      {
        heading: 'Was ist Asthma?',
        items: [
          { label: 'Chronische Atemwegserkrankung', body: 'Asthma bronchiale ist eine dauerhafte Entzündung der Atemwege — die Bronchien reagieren überempfindlich auf bestimmte Reize.' },
          { label: 'Was im Anfall passiert', body: 'Bronchien verengen sich (Bronchokonstriktion), die Schleimhaut schwillt an, vermehrt zäher Schleim wird gebildet — die Luft kann nur noch schwer durchströmen, vor allem beim Ausatmen.' },
          { label: 'Verlauf', body: 'Anfälle können kurz und harmlos sein oder sich zu einem lebensbedrohlichen Status asthmaticus entwickeln — frühzeitig erkennen und behandeln ist entscheidend.' },
          { label: 'Behandlung', body: 'Dauertherapie mit kortisonhaltigem Spray (entzündungshemmend), Notfallspray (bronchienerweiternd) für akute Anfälle — die Person kennt ihr Schema in der Regel selbst.' },
        ],
      },
      {
        heading: 'Typische Symptome',
        items: [
          { label: 'Atemnot', body: 'Person bekommt schlecht Luft, ringt nach Atem — typisch ist die Schwierigkeit beim Ausatmen, nicht so sehr beim Einatmen.' },
          { label: 'Pfeifende Atmung (Giemen)', body: 'Pfeifendes oder zischendes Atemgeräusch beim Ausatmen — die Luft strömt durch verengte Bronchien.' },
          { label: 'Husten', body: 'Trockener, oft anfallsartiger Husten — manchmal mit zähem, glasigem Schleim. Kann auch das einzige Symptom sein.' },
          { label: 'Engegefühl in der Brust', body: 'Druck oder Beklemmung im Brustkorb — die Atemmuskulatur arbeitet hart, Brustkorb fühlt sich „eng" an.' },
          { label: 'Verlängertes Ausatmen', body: 'Ausatmen dauert deutlich länger als das Einatmen — die Luft kommt nur mühsam aus den verengten Atemwegen.' },
          { label: 'Unruhe / Angst', body: 'Atemnot löst Panik aus — Person ist aufgeregt, ängstlich, manchmal verzweifelt. Beruhigung ist wichtig.' },
          { label: 'Schnelle Atmung', body: 'Tachypnoe — schnelle, flache Atmung als Versuch, mehr Luft zu bekommen. Verbraucht viel Energie.' },
          { label: 'Blasse oder bläuliche Lippen (bei schwerem Verlauf)', body: 'Zyanose — Sauerstoffmangel zeigt sich an Lippen, Fingern, Gesicht. Hinweis auf schweren Anfall, sofort 112.' },
        ],
      },
      {
        heading: 'Mögliche Auslöser',
        items: [
          { label: 'Körperliche Belastung', body: 'Anstrengungs-Asthma — Sport, schnelles Schwimmen, Treppensteigen können einen Anfall auslösen, vor allem bei kalter, trockener Luft.' },
          { label: 'Allergene (Pollen, Tierhaare, Hausstaub)', body: 'Allergisches Asthma — Pollen im Frühjahr, Tierhaare im Sportbereich, Schimmel in feuchten Räumen, Hausstaubmilben in Polstern.' },
          { label: 'Kalte Luft', body: 'Kälte verengt die Bronchien zusätzlich — typisch beim Wechsel aus warmer Halle ins Freie, bei Wintereinsätzen.' },
          { label: 'Infekte', body: 'Erkältungen, Bronchitis, Grippe — virale Infekte sind häufige Trigger. Auch leichte Erkältung kann zum Anfall führen.' },
          { label: 'Rauch / Reizstoffe', body: 'Zigarettenrauch (auch passiv), Chlorgase im Bad, Putzmittel-Dämpfe, Parfum, Räucherstäbchen, Lagerfeuer — alles, was Atemwege reizt.' },
          { label: 'Stress / Emotionen', body: 'Aufregung, Angst, Streit, Leistungsdruck — psychische Belastung kann Anfälle auslösen oder verstärken.' },
          { label: 'Medikamente', body: 'Manche Schmerzmittel (z. B. ASS, Ibuprofen), Beta-Blocker — bei bekannter Unverträglichkeit besonders aufpassen.' },
        ],
      },
      {
        heading: 'Erste Hilfe — richtig handeln',
        items: [
          { label: '1. Ruhe bewahren und bei der Person bleiben', body: 'Eigene Ruhe überträgt sich — Person beruhigen, an ihrer Seite bleiben, NICHT alleine lassen.' },
          { label: '2. Aufrechte, atemerleichternde Haltung', body: 'Kutschersitz: Vornübergeneigt sitzen, Hände auf den Knien — Atemhilfsmuskulatur kann besser arbeiten. Alternativ Torwartstellung (stehend, Hände auf Knien).' },
          { label: '3. Enge Kleidung lockern', body: 'Krawatte, Hemdkragen, eng anliegende Kleidung öffnen — Brustkorb braucht Platz, Reize reduzieren.' },
          { label: '4. Eigenes Asthmaspray / Notfallspray reichen', body: 'Person kennt ihr Spray meist — reichen, an die Anwendung erinnern (1–2 Hübe, ggf. nach 5 Min. wiederholen). KEINE eigenen Medikamente verabreichen.' },
          { label: '5. Langsam und beruhigend sprechen', body: 'Auf Ausatmung achten — „lippenbremse" zeigen: gegen leicht geschlossene Lippen ausatmen, das hält die Bronchien länger offen.' },
          { label: '6. Bessert es sich nicht: Notruf 112', body: 'Wenn keine Besserung nach 15–20 Min. trotz Spray, oder Verschlechterung: sofort 112. Bei schwerer Atemnot, Bewusstseinsstörung oder Zyanose: nicht abwarten.' },
        ],
      },
      {
        heading: 'Wichtig: Was man vermeiden sollte',
        items: [
          { label: 'Person nicht alleine lassen', body: 'Asthma-Anfälle können sich rasch verschlechtern — bei der Person bleiben, beobachten, beruhigen.' },
          { label: 'Nicht flach hinlegen', body: 'Flache Lage erschwert die Atmung erheblich — die Atemhilfsmuskulatur kann nicht arbeiten. Immer aufrecht oder sitzend lagern.' },
          { label: 'Nicht in Panik versetzen', body: 'Hektik, laute Stimme, Drängeln verstärken die Atemnot — ruhig, langsam, beruhigend sprechen.' },
          { label: 'Keine unnötige Anstrengung verlangen', body: 'Nicht nach Reisetasche schicken, nicht zur Bewegung auffordern — jede Anstrengung verschlimmert die Atemnot.' },
          { label: 'Bei fehlender Besserung nicht abwarten', body: 'Wenn Spray nicht wirkt oder Symptome zunehmen: sofort 112. Status asthmaticus ist lebensbedrohlich.' },
          { label: 'Keine eigenen Medikamente geben', body: 'Nur das eigene Spray der betroffenen Person verwenden — fremde Medikamente können Allergien oder gefährliche Wechselwirkungen auslösen.' },
        ],
      },
      {
        heading: 'Wann wird es zum Notfall? — Sofort 112',
        items: [
          { label: 'Schwere Atemnot oder kaum Sprechen möglich', body: 'Person bringt nur einzelne Worte heraus, ringt nach Luft — Hinweis auf schweren Anfall. Sofort 112.' },
          { label: 'Lippen oder Haut werden blau', body: 'Zyanose — deutlicher Sauerstoffmangel. Lebensbedrohlich, sofort 112.' },
          { label: 'Kein Effekt trotz Spray', body: 'Notfallspray bringt keine Besserung nach 15–20 Min. — Bronchospasmus reagiert nicht mehr. Sofort 112.' },
          { label: 'Zunehmende Erschöpfung / Benommenheit', body: 'Person wird müder, antwortet langsamer, schläfrig — Atemmuskulatur ermüdet, Sauerstoff fehlt. Sofort 112.' },
          { label: 'Atemgeräusch wird leiser trotz Verschlechterung', body: '„Stille Lunge" — kaum noch Luft strömt, Pfeifen verschwindet. Sehr ernstes Zeichen, drohender Atemstillstand. Sofort 112.' },
          { label: 'Bewusstseinsstörung', body: 'Verwirrtheit, Schläfrigkeit, Bewusstlosigkeit — Sauerstoffmangel im Gehirn. Sofort 112, HLW vorbereiten.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Asthma bronchiale', body: 'Chronische Entzündung der Atemwege mit überempfindlichen Bronchien — anfallsartige Atemnot.' },
          { label: 'Bronchien', body: 'Verzweigte Atemwege in der Lunge — beim Asthma-Anfall verengen sie sich (Bronchospasmus).' },
          { label: 'Bronchospasmus', body: 'Krampfartige Verengung der Bronchialmuskulatur — Hauptursache der Atemnot beim Asthma-Anfall.' },
          { label: 'Notfallspray (Bedarfsspray)', body: 'Schnell wirksames Bronchien-erweiterndes Spray (z. B. Salbutamol) — wirkt innerhalb weniger Minuten, für akute Anfälle.' },
          { label: 'Kortison-Spray (Dauerspray)', body: 'Entzündungshemmendes Spray für die tägliche Dauertherapie — wirkt langfristig, NICHT für den akuten Notfall.' },
          { label: 'Kutschersitz', body: 'Atemerleichternde Haltung — vornübergeneigt sitzen, Unterarme auf den Oberschenkeln abstützen, Atemhilfsmuskulatur entlasten.' },
          { label: 'Lippenbremse', body: 'Atemtechnik — gegen locker geschlossene Lippen ausatmen, baut Gegendruck auf, hält Bronchien länger offen.' },
          { label: 'Status asthmaticus', body: 'Schwerer Asthma-Anfall, der nicht auf das übliche Notfallspray anspricht — lebensbedrohlich, sofort 112.' },
          { label: 'Zyanose', body: 'Bläuliche Verfärbung von Lippen, Fingern und Haut durch Sauerstoffmangel — Notfallzeichen.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Chlor und Reizstoffe im Bad', body: 'Chloramine, Reinigungsmittel, schlechte Lüftung — können Asthma-Anfälle bei empfindlichen Gästen auslösen. Auf gute Belüftung achten.' },
          { label: 'Kalte Außenanlagen', body: 'Wechsel von warmer Halle ins Freie (Freibad, Sauna-Außenbereich) — kalte Luft kann Anfall triggern. Gäste auf den Wechsel hinweisen.' },
          { label: 'Sport-/Schwimmunterricht', body: 'Belastungsasthma häufig bei Anfängern — Tempo anpassen, Pausen einplanen, Notfallspray-Verfügbarkeit klären.' },
          { label: 'Saunabereich', body: 'Heiße, trockene Luft kann bei manchen Asthmatikern Anfälle auslösen — auf Beschwerden achten, im Notfall sofort herausführen.' },
          { label: 'Kinder mit Asthma', body: 'Eltern fragen nach Notfallspray, Anwendungs-Schema, Triggern — Spray sollte griffbereit sein, nicht im Schrank verschlossen.' },
          { label: 'Kommunikation mit Eltern und Lehrern', body: 'Bei Schwimmkursen, Schulausflügen — schriftliche Notfallinfo („Asthma-Pass"), Aufsichtskräfte wissen, was zu tun ist.' },
          { label: 'Erste-Hilfe-Material', body: 'Im Bad gibt es kein Asthmaspray für andere — nur die Person selbst hat ihres. Aufsicht hilft mit Lagerung, Beruhigung, Notruf.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'AUFRECHT LAGERN — BERUHIGEN — SPRAY REICHEN — BEOBACHTEN — BEI VERSCHLECHTERUNG NOTRUF 112', body: 'Ruhe bewahren — schnell handeln — Leben schützen. Die fünf Schritte bringen die meisten Anfälle sicher unter Kontrolle.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/asthma-arbeitsblatt.png',
    alt: 'Arbeitsblatt Asthma zum Ausfüllen',
    tasks: [
      {
        id: 'symptome',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Typische Symptome erkennen',
        prompt: 'Beschrifte die acht Symptome entsprechend der Symbole.',
        items: [
          { number: 1, accept: ['Atemnot', 'Luftnot', 'Erschwerte Atmung', 'Atembeschwerden', 'Atemprobleme', 'Kurzatmigkeit', 'Lufthunger'] },
          { number: 2, accept: ['Pfeifende Atmung', 'Pfeifen', 'Atemgeräusche', 'Atemgeraeusche', 'Giemen', 'Pfeifender Atem', 'Pfeifgeräusch', 'Pfeifgeraeusch', 'Pfeifgeräusche', 'Pfeifgeraeusche'] },
          { number: 3, accept: ['Husten', 'Hustenreiz', 'Trockener Husten', 'Reizhusten', 'Anfallsartiger Husten'] },
          { number: 4, accept: ['Engegefühl in der Brust', 'Engegefuehl in der Brust', 'Brustenge', 'Druck auf der Brust', 'Engegefühl', 'Engegefuehl', 'Brustdruck', 'Beklemmung', 'Druck in der Brust', 'Brustkorbenge'] },
          { number: 5, accept: ['Verlängertes Ausatmen', 'Verlaengertes Ausatmen', 'Erschwerte Ausatmung', 'Ausatmen fällt schwer', 'Ausatmen faellt schwer', 'Verlängerte Ausatmung', 'Verlaengerte Ausatmung', 'Langes Ausatmen', 'Schweres Ausatmen', 'Ausatmung verlängert', 'Ausatmung verlaengert'] },
          { number: 6, accept: ['Schnelle Atmung', 'Beschleunigte Atmung', 'Tachypnoe', 'Schnelles Atmen', 'Erhöhte Atemfrequenz', 'Erhoehte Atemfrequenz', 'Hechelnde Atmung', 'Flache schnelle Atmung'] },
          { number: 7, accept: ['Unruhe', 'Angst', 'Unruhe / Angst', 'Panik', 'Angstgefühl', 'Angstgefuehl', 'Aufregung', 'Nervosität', 'Nervositaet', 'Verzweiflung'] },
          { number: 8, accept: ['Bläuliche Lippen', 'Blaeuliche Lippen', 'Blaue Lippen', 'Zyanose', 'Bläuliche Haut', 'Blaeuliche Haut', 'Blaue Lippen / Zyanose', 'Blasse Lippen', 'Lippen blau', 'Bläuliche Verfärbung', 'Blaeuliche Verfaerbung', 'Sauerstoffmangel'] },
        ],
      },
      {
        id: 'ausloeser',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Mögliche Auslöser',
        prompt: 'Beschrifte die sechs typischen Auslöser für einen Asthma-Anfall.',
        items: [
          { number: 1, accept: ['Körperliche Belastung', 'Koerperliche Belastung', 'Sport', 'Anstrengung', 'Belastung', 'Körperliche Anstrengung', 'Koerperliche Anstrengung', 'Bewegung', 'Belastungsasthma', 'Anstrengungsasthma'] },
          { number: 2, accept: ['Allergene', 'Pollen', 'Tierhaare', 'Hausstaub', 'Hausstaubmilben', 'Allergie', 'Allergene / Pollen', 'Pollenflug', 'Schimmel', 'Allergische Reize'] },
          { number: 3, accept: ['Kalte Luft', 'Kälte', 'Kaelte', 'Kaltluft', 'Kalte Außenluft', 'Kalte Aussenluft', 'Frostige Luft', 'Kühle Luft', 'Kuehle Luft'] },
          { number: 4, accept: ['Infekte', 'Infektion', 'Erkältung', 'Erkaeltung', 'Grippe', 'Bronchitis', 'Atemwegsinfekt', 'Virusinfekt', 'Infekt'] },
          { number: 5, accept: ['Rauch', 'Reizstoffe', 'Rauch / Reizstoffe', 'Qualm', 'Chemikalien', 'Zigarettenrauch', 'Passivrauchen', 'Reizgase', 'Chlor', 'Putzmittel', 'Dämpfe', 'Daempfe'] },
          { number: 6, accept: ['Stress', 'Aufregung', 'Stress / Aufregung', 'Psychische Belastung', 'Emotionen', 'Angst', 'Anspannung', 'Seelische Belastung', 'Nervosität', 'Nervositaet'] },
        ],
      },
      {
        id: 'verhalten',
        type: 'numbered-labels',
        title: 'Aufgabe 3: Richtiges Verhalten',
        prompt: 'Beschrifte die sechs Erste-Hilfe-Schritte bei einem Asthma-Anfall.',
        items: [
          { number: 1, accept: ['Ruhe bewahren', 'Beruhigen', 'Person beruhigen', 'Ruhe bewahren / beruhigen', 'Bei der Person bleiben', 'Ruhe ausstrahlen', 'Person nicht alleine lassen'] },
          { number: 2, accept: ['Aufrecht sitzen', 'Aufrechte Sitzposition', 'Kutschersitz', 'Aufrecht lagern', 'Aufrechte Haltung', 'Sitzposition', 'Atemerleichternde Haltung', 'Aufrecht hinsetzen', 'Vornübergeneigt sitzen', 'Vornuebergeneigt sitzen'] },
          { number: 3, accept: ['Kleidung lockern', 'Enge Kleidung lockern', 'Kragen öffnen', 'Kragen oeffnen', 'Krawatte lösen', 'Krawatte loesen', 'Hemd öffnen', 'Hemd oeffnen', 'Beengende Kleidung lockern'] },
          { number: 4, accept: ['Asthmaspray reichen', 'Notfallspray reichen', 'Spray reichen', 'Inhalator reichen', 'Asthmaspray geben', 'Notfallspray geben', 'Eigenes Asthmaspray reichen', 'Spray bereitstellen', 'Inhalator geben', 'Bedarfsspray reichen', 'An Spray erinnern'] },
          { number: 5, accept: ['Beruhigend sprechen', 'Langsam sprechen', 'Beruhigend reden', 'Ausatmung betonen', 'Lippenbremse', 'Lippenbremse zeigen', 'Auf Ausatmung achten', 'Ruhig sprechen', 'Langsam und beruhigend sprechen'] },
          { number: 6, accept: ['Notruf 112', '112', '112 rufen', 'Notruf', 'Rettungsdienst rufen', 'Notruf absetzen', '112 wählen', '112 waehlen', '112 bei Verschlechterung', 'Bei Verschlechterung 112'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfragen',
        items: [
          {
            prompt: '1. Warum hilft eine aufrechte Sitzposition?',
            keywords: ['aufrecht', 'haltung', 'atmung', 'erleichtert', 'brustkorb', 'atemhilfsmuskulatur', 'muskulatur', 'arbeiten', 'luft', 'leichter', 'kutschersitz', 'flach', 'liegen', 'erleichtern'],
            minMatches: 3,
            sampleAnswer:
              'Eine aufrechte Haltung erleichtert die Atmung, weil der Brustkorb sich freier bewegen kann und die Atemhilfsmuskulatur (Schultern, Hals, Rücken) zusätzlich zum Atmen eingesetzt werden kann. Im Kutschersitz — vornübergeneigt mit aufgestützten Armen — hängt das Gewicht der Schultern an den Armen, das entlastet die Atemmuskulatur erheblich. Flaches Liegen hingegen drückt die Bauchorgane gegen das Zwerchfell und macht das Ausatmen noch schwerer. Die betroffene Person bekommt aufrecht oft deutlich leichter Luft und beruhigt sich auch psychisch schneller.',
          },
          {
            prompt: '2. Wann wird Asthma zum Notfall?',
            keywords: ['atemnot', 'schwer', 'sprechen', 'lippen', 'blau', 'zyanose', 'spray', 'wirkt', 'wirkung', 'erschöpfung', 'erschoepfung', 'benommenheit', 'bewusstsein', 'bewusstlos', 'verschlechterung', 'stille', 'lunge', '112'],
            minMatches: 3,
            sampleAnswer:
              'Asthma wird zum Notfall bei schwerer Atemnot (Person kann kaum noch sprechen), bläulichen Lippen oder Haut (Zyanose), fehlender Besserung trotz Notfallspray, zunehmender Erschöpfung oder Benommenheit, Bewusstseinsstörung sowie wenn das pfeifende Atemgeräusch leiser wird trotz weiter bestehender Atemnot („stille Lunge" — drohender Atemstillstand). In all diesen Fällen sofort Notruf 112, Person aufrecht lagern, beruhigen und auf den Rettungsdienst warten — nicht abwarten, ob es vielleicht doch noch besser wird.',
          },
        ],
      },
    ],
  },
};

export default asthma;
