const schlaganfall = {
  id: 'schlaganfall',
  title: 'Schlaganfall',
  subtitle: 'Warnzeichen erkennen, FAST-Regel anwenden und richtig handeln',
  category: 'first',
  icon: '🧠',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/schlaganfall-referenz.png',
    alt: 'Lernblatt Schlaganfall mit Warnzeichen, FAST-Regel und Erste-Hilfe-Maßnahmen',
    intro:
      'Ein Schlaganfall entsteht, wenn die Durchblutung eines Bereichs im Gehirn plötzlich gestört ist — entweder durch ein Blutgerinnsel, das ein Gefäß verstopft (ischämischer Schlaganfall), oder durch eine Hirnblutung. Gehirnzellen werden nicht mehr ausreichend mit Sauerstoff und Nährstoffen versorgt und beginnen abzusterben. Jede Minute zählt: "Zeit ist Gehirn." Mit der FAST-Regel (Face, Arms, Speech, Time) lassen sich die wichtigsten Warnzeichen schnell erkennen — und dann gilt: sofort 112.',
    sections: [
      {
        heading: 'Was ist ein Schlaganfall?',
        items: [
          { label: 'Ischämischer Schlaganfall (Verstopfung)', body: 'Ein Blutgerinnsel verschließt ein Hirngefäß — der dahinterliegende Bereich bekommt keinen Sauerstoff mehr. Häufigster Schlaganfall-Typ.' },
          { label: 'Hämorrhagischer Schlaganfall (Blutung)', body: 'Ein Hirngefäß platzt — Blut fließt ins Gehirngewebe und schädigt es zusätzlich durch Druck.' },
          { label: 'Folge', body: 'Gehirnzellen sterben innerhalb von Minuten ab — ohne schnelle Hilfe drohen bleibende Schäden (Lähmung, Sprachverlust, Tod).' },
          { label: 'Zeit ist Gehirn', body: 'Jede Minute zählt — schnelles Handeln rettet Hirnzellen und damit Lebensqualität.' },
        ],
      },
      {
        heading: 'Typische Warnzeichen',
        items: [
          { label: 'Plötzliche Lähmung oder Schwäche einer Körperseite', body: 'Arm, Bein oder ganze Körperhälfte fühlen sich plötzlich kraftlos oder taub an — meist nur einseitig.' },
          { label: 'Hängender Mundwinkel', body: 'Eine Gesichtshälfte hängt herab — beim Lächeln wird der Mund schief.' },
          { label: 'Sprachstörung', body: 'Verwaschene, lallende oder unverständliche Sprache — oder Person findet plötzlich keine Worte mehr.' },
          { label: 'Sehstörung', body: 'Verschwommenes Sehen, Doppelbilder, Sehverlust auf einem Auge oder halbseitiger Gesichtsfeldausfall.' },
          { label: 'Schwindel oder Gangunsicherheit', body: 'Plötzlicher Schwindel, Standunsicherheit oder Sturz ohne erkennbaren Grund.' },
          { label: 'Starke, plötzliche Kopfschmerzen', body: 'Vernichtungskopfschmerz "wie noch nie" — typisch bei Hirnblutung.' },
          { label: 'Verwirrtheit oder Desorientierung', body: 'Person ist plötzlich verwirrt, antwortet wirr oder erkennt vertraute Dinge nicht mehr.' },
        ],
      },
      {
        heading: 'FAST-Regel — schnell prüfen',
        items: [
          { label: 'F — FACE (Gesicht)', body: 'Person bitten zu lächeln. Hängt ein Mundwinkel herab? Ist das Gesicht einseitig "schief"?' },
          { label: 'A — ARMS (Arme)', body: 'Person bitten, beide Arme nach vorne zu strecken und die Handflächen nach oben zu drehen. Sinkt ein Arm ab oder dreht sich? Lähmung möglich.' },
          { label: 'S — SPEECH (Sprache)', body: 'Person einen einfachen Satz nachsprechen lassen. Klingt die Sprache verwaschen, lallend oder unverständlich?' },
          { label: 'T — TIME (Zeit)', body: 'Bei nur einem auffälligen Test: SOFORT Notruf 112 wählen. Uhrzeit der ersten Symptome merken — wichtig für die Klinik!' },
        ],
      },
      {
        heading: 'Erste Hilfe — richtig handeln',
        items: [
          { label: '1. Ruhe bewahren', body: 'Selbst ruhig bleiben — Hektik überträgt sich auf die Person.' },
          { label: '2. Person ansprechen und beruhigen', body: 'Beruhigend sprechen, Sicherheit vermitteln — Person nicht allein lassen.' },
          { label: '3. FAST prüfen', body: 'Face, Arms, Speech testen — schon ein einzelner positiver Test reicht für den Notruf.' },
          { label: '4. Notruf 112 absetzen', body: 'Sofort 112 anrufen, "Verdacht auf Schlaganfall" nennen, Symptome und Uhrzeit der ersten Symptome durchgeben.' },
          { label: '5. Nichts essen oder trinken geben', body: 'Schluckstörung möglich — Aspirationsgefahr. Auch keine Tabletten.' },
          { label: '6. Enge Kleidung lockern', body: 'Kragen, Krawatte, Gürtel — alles, was den Körper einengt, lösen.' },
          { label: '7. Bei Bewusstsein bequem lagern', body: 'Oberkörper leicht erhöht (ca. 30°), Person sicher und bequem lagern.' },
          { label: '8. Bei Bewusstlosigkeit', body: 'Atmung prüfen — bei vorhandener normaler Atmung: stabile Seitenlage.' },
          { label: '9. Bei fehlender Atmung', body: 'Sofort mit Wiederbelebung beginnen (30 Herzdruckmassagen : 2 Beatmungen). AED einsetzen, wenn verfügbar.' },
        ],
      },
      {
        heading: 'Wann ist es ein Notfall? — Notruf 112',
        items: [
          { label: 'Plötzliche Lähmungen', body: 'Einseitige Schwäche oder Taubheit in Gesicht, Arm oder Bein.' },
          { label: 'Sprachstörung', body: 'Plötzlich verwaschene oder unverständliche Sprache.' },
          { label: 'Gesichtslähmung', body: 'Hängender Mundwinkel, schiefes Lächeln.' },
          { label: 'Unklare neurologische Ausfälle', body: 'Sehstörung, plötzlicher Schwindel, starke Kopfschmerzen, Verwirrtheit — sofort 112.' },
          { label: 'Grundsatz', body: 'Schon ein einziger FAST-Test positiv → SOFORT 112. Nicht abwarten!' },
        ],
      },
      {
        heading: 'Was man vermeiden sollte',
        items: [
          { label: 'Nicht abwarten', body: 'Jede Minute zählt — Schlaganfall ist immer ein Notfall, kein "Vielleicht-bessert-sich-das".' },
          { label: 'Nicht selbst fahren lassen', body: 'Person darf NICHT selbst zum Krankenhaus fahren — Bewusstlosigkeit, Lähmung, Krampf können jederzeit auftreten.' },
          { label: 'Nichts zu essen oder trinken geben', body: 'Schluckstörung möglich — Aspirationsgefahr. Auch keine Medikamente.' },
          { label: 'Symptome nicht verharmlosen', body: 'Auch wenn Symptome wieder verschwinden (TIA = Mini-Schlaganfall): trotzdem sofort 112 — kann Vorbote eines schweren Schlaganfalls sein.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Schlaganfall (Apoplex, Insult)', body: 'Plötzliche Durchblutungsstörung des Gehirns — durch Verstopfung oder Blutung.' },
          { label: 'FAST-Regel', body: 'Face — Arms — Speech — Time. Vier-Schritt-Test, mit dem auch Laien einen Schlaganfall schnell erkennen können.' },
          { label: 'TIA (transitorische ischämische Attacke)', body: 'Vorübergehende Schlaganfall-Symptome, die innerhalb 24 Stunden vollständig verschwinden — trotzdem Notfall, oft Vorbote.' },
          { label: 'Stabile Seitenlage', body: 'Lagerung bei Bewusstlosigkeit mit erhaltener Atmung — verhindert Aspiration.' },
          { label: 'Reanimation (HLW)', body: 'Herz-Lungen-Wiederbelebung — bei Bewusstlosigkeit ohne normale Atmung.' },
          { label: 'Aspiration', body: 'Versehentliches Einatmen von Flüssigkeit oder Speisereste — beim Schlaganfall durch Schluckstörung erhöht.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Risikogruppe', body: 'Ältere Badegäste und Menschen mit Vorerkrankungen (Bluthochdruck, Vorhofflimmern, Diabetes) sind besonders gefährdet.' },
          { label: 'Aufmerksam beobachten', body: 'Symptome können beim Schwimmen, in der Sauna oder im Ruheraum auftreten — auf einseitige Schwäche und Sprachprobleme achten.' },
          { label: 'FAST griffbereit', body: 'Jede Aufsichtskraft sollte die FAST-Regel auswendig kennen und in Sekunden anwenden können.' },
          { label: 'Zeit dokumentieren', body: 'Uhrzeit der ersten Symptome notieren — entscheidet in der Klinik über Therapie (Lyse-Zeitfenster).' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'Zeit ist Gehirn', body: 'Bei Verdacht auf Schlaganfall sofort 112 — jede Minute rettet Hirnzellen.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/schlaganfall-arbeitsblatt.png',
    alt: 'Arbeitsblatt Schlaganfall zum Ausfüllen',
    tasks: [
      {
        id: 'warnzeichen',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Typische Warnzeichen erkennen',
        prompt: 'Beschrifte die 7 Warnzeichen eines Schlaganfalls.',
        items: [
          { number: 1, accept: ['Hängender Mundwinkel', 'Haengender Mundwinkel', 'Hängender Mund', 'Haengender Mund', 'Mundwinkel hängt', 'Mundwinkel haengt', 'Gesichtslähmung', 'Gesichtslaehmung', 'Gesicht hängt', 'Gesicht haengt', 'Einseitige Gesichtsschwäche', 'Einseitige Gesichtsschwaeche', 'Schiefes Gesicht', 'Schiefes Lächeln', 'Schiefes Laecheln'] },
          { number: 2, accept: ['Armschwäche', 'Armschwaeche', 'Lähmung', 'Laehmung', 'Einseitige Lähmung', 'Einseitige Laehmung', 'Schwäche einer Körperseite', 'Schwaeche einer Koerperseite', 'Arm sinkt ab', 'Absinkender Arm', 'Lähmung einer Körperseite', 'Laehmung einer Koerperseite', 'Halbseitige Lähmung', 'Halbseitige Laehmung', 'Lähmung Arm', 'Laehmung Arm', 'Einseitige Schwäche', 'Einseitige Schwaeche'] },
          { number: 3, accept: ['Sprachstörung', 'Sprachstoerung', 'Verwaschene Sprache', 'Undeutliche Sprache', 'Sprache verwaschen', 'Wortfindungsstörung', 'Wortfindungsstoerung', 'Sprechstörung', 'Sprechstoerung', 'Sprachprobleme', 'Sprachstörungen', 'Sprachstoerungen', 'Lallende Sprache', 'Unverständliche Sprache', 'Unverstaendliche Sprache'] },
          { number: 4, accept: ['Sehstörung', 'Sehstoerung', 'Sehstörungen', 'Sehstoerungen', 'Verschwommenes Sehen', 'Sehverlust', 'Doppelbilder', 'Sehprobleme', 'Gesichtsfeldausfall'] },
          { number: 5, accept: ['Schwindel', 'Gangunsicherheit', 'Schwindel oder Gangunsicherheit', 'Gleichgewichtsstörung', 'Gleichgewichtsstoerung', 'Unsicherer Gang', 'Standunsicherheit', 'Drehschwindel'] },
          { number: 6, accept: ['Verwirrtheit', 'Desorientierung', 'Verwirrt', 'Bewusstseinsveränderung', 'Bewusstseinsveraenderung', 'Ungeklärte Verwirrung', 'Ungeklaerte Verwirrung', 'Verwirrtheit oder Desorientierung', 'Bewusstseinstrübung', 'Bewusstseinstruebung', 'Orientierungsstörung', 'Orientierungsstoerung'] },
          { number: 7, accept: ['Starke Kopfschmerzen', 'Plötzliche Kopfschmerzen', 'Ploetzliche Kopfschmerzen', 'Sehr starke Kopfschmerzen', 'Kopfschmerz', 'Kopfschmerzen', 'Heftige Kopfschmerzen', 'Vernichtungskopfschmerz', 'Starke plötzliche Kopfschmerzen', 'Starke ploetzliche Kopfschmerzen'] },
        ],
      },
      {
        id: 'verhalten',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Richtiges Verhalten',
        prompt: 'Beschrifte die 6 nummerierten Erste-Hilfe-Maßnahmen bei Verdacht auf Schlaganfall.',
        items: [
          { number: 1, accept: ['Ruhe bewahren', 'Ruhig bleiben', 'Selbst Ruhe bewahren'] },
          { number: 2, accept: ['Notruf 112', '112', 'Notruf', '112 wählen', '112 waehlen', 'Sofort 112', 'Notruf absetzen', 'Rettungsdienst rufen'] },
          { number: 3, accept: ['Beruhigen', 'Person beruhigen', 'Ansprechen und beruhigen', 'Person ansprechen', 'Beruhigend sprechen', 'Ansprechen'] },
          { number: 4, accept: ['FAST prüfen', 'FAST pruefen', 'FAST anwenden', 'FAST-Regel prüfen', 'FAST-Regel pruefen', 'FAST-Test', 'FAST'] },
          { number: 5, accept: ['Bequem lagern', 'Lagern', 'Bei Bewusstsein bequem lagern', 'Bequeme Lagerung', 'Oberkörper hochlagern', 'Oberkoerper hochlagern', 'Hochlagerung', 'Sitzend lagern'] },
          { number: 6, accept: ['Uhrzeit notieren', 'Zeit notieren', 'Uhrzeit der Symptome notieren', 'Zeit dokumentieren', 'Symptombeginn notieren', 'Beobachten und Zeit notieren', 'Beobachten', 'Zeit der ersten Symptome'] },
        ],
      },
      {
        id: 'begriffe',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Begriffe',
        prompt: 'Schreibe die passenden Begriffe unter die Bilder.',
        items: [
          { hint: 'Klemmbrett mit FAST-Checkliste', accept: ['FAST', 'FAST-Regel', 'FAST Regel', 'FAST-Test', 'FAST prüfen', 'FAST pruefen'] },
          { hint: 'Notrufnummer auf rotem Telefonsymbol', accept: ['Notruf 112', '112', 'Notruf', 'Rettungsdienst rufen', '112 wählen', '112 waehlen'] },
          { hint: 'Gesicht mit hängendem Mundwinkel', accept: ['Hängender Mundwinkel', 'Haengender Mundwinkel', 'Gesichtslähmung', 'Gesichtslaehmung', 'Schiefes Gesicht', 'Mundwinkel hängt', 'Mundwinkel haengt', 'Face-Test', 'F von FAST'] },
          { hint: 'Person hebt beide Arme — ein Arm sinkt ab', accept: ['Armtest', 'Arme heben', 'Absinkender Arm', 'Lähmung Arm', 'Laehmung Arm', 'Armschwäche', 'Armschwaeche', 'Arms-Test', 'A von FAST', 'Beide Arme heben'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfrage',
        items: [
          {
            prompt: '1. Warum ist beim Schlaganfall Zeit so wichtig?',
            keywords: ['minute', 'zeit', 'gehirn', 'hirnzellen', 'sterben', 'absterben', 'schaden', 'schäden', 'schaeden', 'sauerstoff', 'durchblutung', 'lähmung', 'laehmung', 'bleibend', 'lyse', 'therapie', 'zeitfenster', 'früh', 'frueh'],
            minMatches: 4,
            sampleAnswer:
              'Bei einem Schlaganfall ist die Durchblutung eines Gehirnbereichs unterbrochen — die Hirnzellen bekommen keinen Sauerstoff mehr und beginnen innerhalb von Minuten abzusterben. Jede Minute ohne Behandlung führt zu mehr bleibenden Schäden wie Lähmung, Sprachverlust oder Tod ("Zeit ist Gehirn"). Außerdem gibt es in der Klinik nur ein begrenztes Zeitfenster für eine Lyse-Therapie (Auflösen des Blutgerinnsels) — je früher die Person dort ankommt, desto besser stehen die Chancen, das Gehirn zu retten.',
          },
          {
            prompt: '2. Was bedeutet die FAST-Regel?',
            keywords: ['face', 'gesicht', 'arms', 'arme', 'speech', 'sprache', 'time', 'zeit', '112', 'mundwinkel', 'lächeln', 'laecheln', 'absinken', 'satz', 'verwaschen', 'notruf', 'sofort'],
            minMatches: 4,
            sampleAnswer:
              'Die FAST-Regel ist ein einfacher Vier-Schritt-Test, mit dem auch Laien einen Schlaganfall schnell erkennen können. F steht für Face (Gesicht): Person lächeln lassen — hängt ein Mundwinkel? A steht für Arms (Arme): Beide Arme heben lassen — sinkt einer ab? S steht für Speech (Sprache): Einen einfachen Satz nachsprechen lassen — klingt die Sprache verwaschen? T steht für Time (Zeit): Bei nur einem positiven Test sofort Notruf 112 wählen und die Uhrzeit der ersten Symptome merken.',
          },
        ],
      },
    ],
  },
};

export default schlaganfall;
