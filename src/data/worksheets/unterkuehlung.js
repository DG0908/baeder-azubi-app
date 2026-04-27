const unterkuehlung = {
  id: 'unterkuehlung',
  title: 'Unterkühlung',
  subtitle: 'Warnzeichen erkennen, richtig handeln und Risiken einschätzen',
  category: 'first',
  icon: '🥶',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/unterkuehlung-referenz.png',
    alt: 'Lernblatt Unterkühlung — Warnzeichen, Ursachen, Erste-Hilfe-Maßnahmen und Notfallkriterien',
    intro:
      'Eine Unterkühlung (Hypothermie) entsteht, wenn der Körper mehr Wärme verliert, als er produzieren kann — die Körpertemperatur sinkt unter 35 °C. Kreislauf, Atmung, Bewusstsein und Organe können dadurch beeinträchtigt werden. Im Bäderbetrieb sind kaltes Wasser, lange Aufenthalte, nasse Kleidung und Wind die typischen Auslöser. Wichtigste Regeln: aus der Kälte bringen, nasse Kleidung entfernen, warm und trocken einpacken, LANGSAM erwärmen — KEINE Extrem-Erwärmung, KEIN Alkohol, NICHT reiben. Bei Bewusstseinsstörung, fehlendem Zittern oder Verschlechterung sofort 112. Merksatz: AUS KÄLTE BRINGEN — WARM EINPACKEN — LANGSAM ERWÄRMEN — BEOBACHTEN — 112 BEI SCHWEREN ZEICHEN.',
    sections: [
      {
        heading: 'Was ist Unterkühlung?',
        items: [
          { label: 'Definition (Hypothermie)', body: 'Der Körper verliert mehr Wärme, als er produzieren kann. Die Körpertemperatur sinkt unter 35 °C — die normale Körpertemperatur liegt bei etwa 37 °C.' },
          { label: 'Auswirkungen', body: 'Mit sinkender Temperatur arbeiten Kreislauf, Atmung, Gehirn und Stoffwechsel langsamer — bei schweren Verläufen drohen Bewusstlosigkeit, Herzrhythmusstörungen und Tod.' },
          { label: 'Stadien', body: 'Leichte Unterkühlung (32–35 °C): Zittern, Frieren, Verwirrtheit. Mittelschwere (28–32 °C): Zittern lässt nach, Schläfrigkeit. Schwere (< 28 °C): Bewusstlosigkeit, lebensbedrohlich.' },
          { label: 'Wichtigster Grundsatz', body: 'Frühzeitig erkennen und LANGSAM erwärmen — schnelle Wiedererwärmung kann Kreislauf belasten und gefährlich sein (Bergungstod).' },
        ],
      },
      {
        heading: 'Typische Warnzeichen',
        items: [
          { label: 'Starkes Zittern', body: 'Reflexartiges Muskelzittern — Körper versucht durch Bewegung Wärme zu produzieren. Erstes deutliches Warnzeichen.' },
          { label: 'Kalte, blasse Haut', body: 'Blutgefäße der Haut ziehen sich zusammen, um lebenswichtige Organe zu versorgen — Haut wird blass-bläulich, kühl, manchmal marmoriert.' },
          { label: 'Müdigkeit / Schwäche', body: 'Person wirkt erschöpft, antriebslos, schläfrig — Stoffwechsel und Gehirn arbeiten langsamer.' },
          { label: 'Langsame oder verwaschene Sprache', body: 'Sprache wird undeutlich, langsam, "lallend" — Hinweis auf zentrale Beeinträchtigung.' },
          { label: 'Verwirrtheit', body: 'Desorientierung, falsche Antworten, paradoxe Reaktionen (z. B. Auskleiden trotz Kälte — "paradoxes Entkleiden") — Spätzeichen, sehr ernst.' },
          { label: 'Koordinationsprobleme', body: 'Unsicherer Gang, ungeschickte Handbewegungen — Person stolpert, lässt Gegenstände fallen.' },
          { label: 'Langsame Atmung / langsamer Puls', body: 'Atmung und Herzschlag verlangsamen sich messbar — bei schwerer Unterkühlung kaum noch tastbar oder sichtbar.' },
          { label: 'Später: Bewusstseinsstörung', body: 'Verwirrtheit, Benommenheit, Bewusstlosigkeit — höchste Eile, sofort 112.' },
        ],
      },
      {
        heading: 'Mögliche Ursachen',
        items: [
          { label: 'Kaltes Wasser', body: 'Wasser entzieht dem Körper 25× schneller Wärme als Luft — auch kurze Aufenthalte im kalten Wasser können Unterkühlung verursachen.' },
          { label: 'Nasse Kleidung', body: 'Nasse Kleidung leitet Wärme weg und kühlt den Körper massiv — Wechsel in trockene Kleidung ist Pflicht-Sofortmaßnahme.' },
          { label: 'Wind und Kälte', body: 'Wind verstärkt den Wärmeentzug erheblich (Wind-Chill-Effekt) — auch bei mäßigen Temperaturen kritisch.' },
          { label: 'Lange Kälteexposition', body: 'Längere Aufenthalte in kalter Umgebung — auch ohne Wasser Unterkühlung möglich, besonders nachts oder bei Erschöpfung.' },
          { label: 'Erschöpfung, zu wenig Energie', body: 'Hunger, Schlafmangel, Krankheit — der Körper kann weniger Wärme produzieren. Schwächt die Abwehr gegen Unterkühlung.' },
          { label: 'Kinder und ältere Menschen besonders gefährdet', body: 'Kinder haben relativ große Hautoberfläche und kühlen schneller aus. Ältere haben weniger Wärmeregulation. Beide Risiko-Gruppen besonders schützen.' },
          { label: 'Mehrere Faktoren kombiniert', body: 'Kaltes Wasser + Wind + nasse Kleidung + Erschöpfung — die Kombination erhöht das Risiko dramatisch, auch bei eigentlich harmloser Einzeleinwirkung.' },
        ],
      },
      {
        heading: 'Erste Hilfe — richtig handeln',
        items: [
          { label: '1. Aus Kälte bringen', body: 'An einen windgeschützten, warmen Ort bringen — Aufenthaltsraum, Auto, beheiztes Zimmer. Vor weiterer Kälteexposition schützen.' },
          { label: '2. Nasse Kleidung entfernen', body: 'Vorsichtig ausziehen, Feuchtigkeit reduzieren — nasse Kleidung MUSS weg, sonst weiterer Wärmeverlust. Bei Bewusstseinsstörung Kleidung aufschneiden.' },
          { label: '3. Warm und trocken einpacken', body: 'Decken, Schlafsack oder Rettungsdecke (silberne Seite zur Person) verwenden — auch Kopf und Hals einwickeln, da viel Wärme darüber verloren geht.' },
          { label: '4. Langsam erwärmen', body: 'Körpermitte (Brust, Hals, Kopf) zuerst wärmen — z. B. Wärmflaschen mit Tuch dazwischen, warmer Kontakt. NICHT die Extremitäten zuerst, sonst Bergungstod-Gefahr.' },
          { label: '5. Warme, süße Getränke — nur bei wacher Person', body: 'Tee, Kakao, warmes Wasser mit Honig — Energie und Wärme von innen. KEIN Alkohol (öffnet Hautgefäße, beschleunigt Auskühlung). KEIN Kaffee (entwässert).' },
          { label: '6. Atmung und Bewusstsein beobachten', body: 'Regelmäßig kontrollieren, beruhigend begleiten — bei Bewusstseinsverlust mit normaler Atmung: stabile Seitenlage. Bei Atemstillstand: HLW.' },
          { label: '7. Notruf 112 bei schweren Zeichen', body: 'Frühzeitig Hilfe holen — bei Verwirrtheit, fehlendem Zittern, sehr langsamer Atmung oder Bewusstseinsstörung NICHT warten, sondern sofort 112.' },
        ],
      },
      {
        heading: 'Was man vermeiden sollte',
        items: [
          { label: 'Nicht heiß duschen oder baden', body: 'Heißes Wasser öffnet die Hautgefäße schlagartig — kaltes Blut der Extremitäten gelangt zur Körpermitte und kann tödliche Herzrhythmusstörungen auslösen (Bergungstod).' },
          { label: 'Nicht stark reiben oder massieren', body: 'Reiben kann Erfrierungen verschlimmern und kaltes Blut der Haut in den Kreislauf befördern — gefährlich.' },
          { label: 'Kein Alkohol', body: 'Alkohol fühlt sich warm an, weil Hautgefäße sich öffnen — TATSÄCHLICH wird der Wärmeverlust beschleunigt. Niemals bei Unterkühlung geben.' },
          { label: 'Keine schnelle Extrem-Erwärmung', body: 'Heizdecke direkt auf die Haut, Heizstrahler, heißes Wasser — alles, was schnell und stark wärmt, kann den Kreislauf überlasten.' },
          { label: 'Nicht unnötig bewegen, schonen', body: 'Person ruhig lagern — bei schwerer Unterkühlung können Bewegungen lebensbedrohliche Herzrhythmusstörungen auslösen. Sanfte Bergung.' },
          { label: 'Keine koffeinhaltigen Getränke', body: 'Kaffee, schwarzer Tee, Cola, Energy-Drinks — entwässern und belasten Kreislauf. Stattdessen warme süße Getränke ohne Koffein.' },
        ],
      },
      {
        heading: 'Wann wird es zum Notfall? — Sofort 112',
        items: [
          { label: 'Verwirrtheit oder Bewusstseinsstörung', body: 'Person wirkt verwirrt, beantwortet Fragen falsch, ist schläfrig oder bewusstlos — Hinweis auf schwere Unterkühlung. Sofort 112.' },
          { label: 'Fehlendes oder stark vermindertes Zittern', body: 'Wenn Zittern aufhört, ist das KEIN gutes Zeichen — der Körper kann keine Wärme mehr produzieren. Schwere Unterkühlung. Sofort 112.' },
          { label: 'Sehr langsame Atmung', body: 'Atmung deutlich unter normal (Erwachsener < 8/min) — Atemstillstand droht. Sofort 112, Atmung kontinuierlich überwachen.' },
          { label: 'Starke Schwäche / Reaktionsverlangsamung', body: 'Person reagiert kaum, ist apathisch, kann sich nicht selbst halten — schwere Beeinträchtigung. Sofort 112.' },
          { label: 'Verschlechterung trotz Maßnahmen', body: 'Wenn Symptome trotz Wärme und Schutz weiter zunehmen — kein Eigenversuch mehr, sofort 112.' },
          { label: 'Unterkühlung nach Wasserunfall', body: 'Nach längerem Aufenthalt im Wasser oder Beinahe-Ertrinken IMMER 112 — auch wenn die Person ansprechbar wirkt. Bergungstod-Gefahr.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Hypothermie', body: 'Medizinischer Begriff für Unterkühlung — Körperkerntemperatur unter 35 °C.' },
          { label: 'Kerntemperatur', body: 'Temperatur im Körperinneren (Brust, Bauch, Kopf) — wird in der Klinik mit Spezialthermometer gemessen. Normalwert: 36,5–37,5 °C.' },
          { label: 'Bergungstod (Rescue collapse)', body: 'Plötzlicher Kreislaufzusammenbruch beim Erwärmen oder Bewegen einer schwer unterkühlten Person — kaltes Blut gelangt aus der Peripherie zum Herzen, Herzrhythmusstörungen.' },
          { label: 'Paradoxes Entkleiden', body: 'In fortgeschrittenem Stadium reißt sich die Person die Kleidung vom Leib — Hirnstamm-Fehlfunktion durch Kälte. Spätzeichen, sehr ernst.' },
          { label: 'Wind-Chill-Effekt', body: 'Bei Wind fühlt sich die Temperatur deutlich kälter an, weil Wind die wärmende Luftschicht um den Körper wegbläst.' },
          { label: 'Rettungsdecke', body: 'Goldfarbene Folie zum Wärmeschutz — silberne Seite zum Körper bei Wärmeerhalt, goldene Seite zum Körper bei Sonnenschutz/Hitze.' },
          { label: 'Kältezittern', body: 'Reflexartige Muskelkontraktionen zur Wärmeproduktion — sehr energieintensiv, hört bei schwerer Unterkühlung auf.' },
        ],
      },
      {
        heading: 'Praxisbezug — typische Situationen',
        items: [
          { label: 'Freibad / kaltes Wasser', body: 'Auch kurze Aufenthalte im kalten Wasser (besonders Quellen, Seen, Frühjahrs-/Herbstbadezeit) können Unterkühlung verursachen — Aufsicht achtsam, Gäste auf Wassertemperatur hinweisen.' },
          { label: 'Wintereinsatz', body: 'Bei Außenarbeiten (Eisrettung, Becken-Reinigung, Gartendienst): Wind, Kälte und Nässe erhöhen das Risiko — Schutzkleidung tragen, Pausen, warmes Getränk.' },
          { label: 'Erschöpfte Schwimmer', body: 'Erschöpfung + Kälte = hohes Risiko. Frühzeitig reagieren — Schwimmer aus dem Wasser holen, in Decke wickeln, warmes Getränk.' },
          { label: 'Kinder besonders schützen', body: 'Kinder kühlen schneller aus als Erwachsene — kleine Körperoberfläche im Verhältnis zum Körpergewicht. Warm halten, abtrocknen, beobachten.' },
          { label: 'Sauna nach kaltem Wasser', body: 'Saunagänger können nach Kaltwasser-Tauchbecken plötzlich kollabieren — vor allem bei Alkoholgenuss. Aufsichtskraft im Saunabereich aufmerksam.' },
          { label: 'Beinahe-Ertrinken', body: 'Personen nach Wasserrettung sind oft unterkühlt, auch wenn sie scheinbar OK sind — IMMER ärztlich abklären lassen, in Decke einpacken, Atmung beobachten.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'AUS KÄLTE BRINGEN — WARM EINPACKEN — LANGSAM ERWÄRMEN — BEOBACHTEN — 112 BEI SCHWEREN ZEICHEN', body: 'Früh erkennen — richtig handeln — Leben schützen. Wer die fünf Schritte beherrscht, kann Unterkühlte sicher bis zum Rettungsdienst bringen.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/unterkuehlung-arbeitsblatt.png',
    alt: 'Arbeitsblatt Unterkühlung zum Ausfüllen',
    tasks: [
      {
        id: 'warnzeichen',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Warnzeichen erkennen',
        prompt: 'Beschrifte die acht nummerierten Warnzeichen und Merkmale.',
        items: [
          { number: 1, accept: ['Müdigkeit', 'Muedigkeit', 'Schwäche', 'Schwaeche', 'Müdigkeit / Schwäche', 'Muedigkeit / Schwaeche', 'Erschöpfung', 'Erschoepfung', 'Starke Müdigkeit', 'Starke Muedigkeit', 'Schläfrigkeit', 'Schlaefrigkeit', 'Antriebslosigkeit'] },
          { number: 2, accept: ['Zittern', 'Starkes Zittern', 'Kältezittern', 'Kaeltezittern', 'Muskelzittern', 'Frieren', 'Schauer', 'Zittern / starkes Zittern', 'Schüttelfrost', 'Schuettelfrost'] },
          { number: 3, accept: ['Verlangsamte Reaktion', 'Langsame Reaktion', 'Reaktionsverlangsamung', 'Verlangsamte Reaktionen', 'Reaktionen verlangsamt', 'Langsame Reaktionen', 'Verzögerte Reaktion', 'Verzoegerte Reaktion', 'Reaktion verlangsamt'] },
          { number: 4, accept: ['Kalte Haut', 'Blasse Haut', 'Kalte blasse Haut', 'Kalte, blasse Haut', 'Hautblässe', 'Hautblaesse', 'Blässe', 'Blaesse', 'Marmorierte Haut', 'Bläuliche Haut', 'Blaeuliche Haut', 'Kühle Haut', 'Kuehle Haut'] },
          { number: 5, accept: ['Verwirrtheit', 'Benommenheit', 'Verwirrtheit / Benommenheit', 'Desorientierung', 'Verwirrt', 'Bewusstseinstrübung', 'Bewusstseinstruebung', 'Eingeschränktes Bewusstsein', 'Eingeschraenktes Bewusstsein', 'Verwirrung'] },
          { number: 6, accept: ['Rettungsdecke', 'Warm eingepackt', 'Wärmeerhalt', 'Waermeerhalt', 'Rettungsdecke / warm eingepackt', 'Wärmeschutz', 'Waermeschutz', 'Eingewickelt', 'In Decke gewickelt', 'Schutz vor Auskühlung', 'Schutz vor Auskuehlung', 'Wärmedecke', 'Waermedecke'] },
          { number: 7, accept: ['Kälte', 'Kaelte', 'Frösteln', 'Froesteln', 'Frieren', 'Gänsehaut', 'Gaensehaut', 'Kälte / Frösteln', 'Kaelte / Froesteln', 'Kältegefühl', 'Kaeltegefuehl', 'Schauer', 'Kalt'] },
          { number: 8, accept: ['Bewusstseinsstörung', 'Bewusstseinsstoerung', 'Verschlechterung', 'Bewusstlosigkeit', 'Bewusstseinsstörung / Verschlechterung', 'Bewusstseinsstoerung / Verschlechterung', 'Bewusstseinstrübung', 'Bewusstseinstruebung', 'Bewusstseinsverlust', 'Verschlechterung des Zustands'] },
        ],
      },
      {
        id: 'verhalten',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Richtiges Verhalten',
        prompt: 'Beschrifte die sechs Erste-Hilfe-Schritte bei Unterkühlung.',
        items: [
          { number: 1, accept: ['Aus der Kälte bringen', 'Aus der Kaelte bringen', 'An warmen Ort bringen', 'Windgeschützt bringen', 'Windgeschuetzt bringen', 'Aus Kälte bringen', 'Aus Kaelte bringen', 'In warmen Raum bringen', 'Aus der Kälte bringen / an warmen Ort bringen', 'Aus der Kaelte bringen / an warmen Ort bringen', 'In Wärme bringen', 'In Waerme bringen'] },
          { number: 2, accept: ['Nasse Kleidung entfernen', 'Trockene Kleidung anziehen', 'Kleidung wechseln', 'Nasse Kleidung entfernen / trockene Kleidung anziehen', 'Nasses ausziehen', 'Nasse Sachen entfernen', 'Feuchte Kleidung entfernen', 'Trockenlegen'] },
          { number: 3, accept: ['Warm einpacken', 'Trocken einpacken', 'Rettungsdecke', 'Decke', 'Warm und trocken einpacken', 'Warm und trocken einpacken / Rettungsdecke verwenden', 'In Decke einwickeln', 'Mit Decke zudecken', 'Eingewickelt halten', 'Wärmedecke verwenden', 'Waermedecke verwenden'] },
          { number: 4, accept: ['Langsam erwärmen', 'Langsam erwaermen', 'Behutsam erwärmen', 'Behutsam erwaermen', 'Wärmflasche', 'Waermflasche', 'Sanft erwärmen', 'Sanft erwaermen', 'Körpermitte wärmen', 'Koerpermitte waermen', 'Vorsichtig wärmen', 'Vorsichtig waermen'] },
          { number: 5, accept: ['Warme süße Getränke', 'Warme suesse Getraenke', 'Warmes Getränk', 'Warmes Getraenk', 'Tee', 'Süßes Getränk', 'Suesses Getraenk', 'Warme Getränke geben', 'Warme Getraenke geben', 'Warme süße Getränke nur bei wacher Person', 'Warme suesse Getraenke nur bei wacher Person', 'Warmes Getränk bei wacher Person', 'Warmes Getraenk bei wacher Person', 'Tee oder Kakao'] },
          { number: 6, accept: ['Beobachten', 'Atmung kontrollieren', 'Bewusstsein kontrollieren', 'Atmung und Bewusstsein beobachten', 'Notruf 112 bei schweren Zeichen', 'Atmung und Bewusstsein beobachten / Notruf 112 bei schweren Zeichen', 'Atmung und Bewusstsein überwachen', 'Atmung und Bewusstsein ueberwachen', 'Vitalfunktionen kontrollieren', 'Zustand beobachten', 'Person beobachten', 'Bei Verschlechterung 112'] },
        ],
      },
      {
        id: 'begriffe',
        type: 'numbered-labels',
        title: 'Aufgabe 3: Wichtige Begriffe / Situationen',
        prompt: 'Benenne die vier wichtigen Begriffe und Situationen.',
        items: [
          { number: 1, accept: ['Rettungsdecke', 'Wärmeerhalt', 'Waermeerhalt', 'Rettungsdecke / Wärmeerhalt', 'Rettungsdecke / Waermeerhalt', 'Wärmedecke', 'Waermedecke', 'Wärmeschutz', 'Waermeschutz', 'Goldfolie', 'Folie', 'Notfalldecke'] },
          { number: 2, accept: ['Unterkühlung', 'Unterkuehlung', 'Niedrige Körpertemperatur', 'Niedrige Koerpertemperatur', 'Hypothermie', 'Unterkühlung / niedrige Körpertemperatur', 'Unterkuehlung / niedrige Koerpertemperatur', 'Körpertemperatur unter 35 Grad', 'Koerpertemperatur unter 35 Grad', 'Untertemperatur', 'Auskühlung', 'Auskuehlung', 'Kalte Körpertemperatur', 'Kalte Koerpertemperatur'] },
          { number: 3, accept: ['Warmes Getränk', 'Warmes Getraenk', 'Warme Getränke', 'Warme Getraenke', 'Tee', 'Kakao', 'Heißes Getränk', 'Heisses Getraenk', 'Warme süße Getränke', 'Warme suesse Getraenke', 'Süßes Getränk', 'Suesses Getraenk', 'Warmer Tee'] },
          { number: 4, accept: ['Notruf 112', '112', 'Notruf', '112 wählen', '112 waehlen', 'Notruf 112 wählen', 'Notruf 112 waehlen', 'Rettungsdienst rufen', 'Notruf absetzen'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfragen',
        items: [
          {
            prompt: 'a) Warum ist Unterkühlung gefährlich?',
            keywords: ['körpertemperatur', 'koerpertemperatur', 'sinkt', 'kreislauf', 'atmung', 'bewusstsein', 'organe', 'beeinträchtigt', 'beeintraechtigt', 'herz', 'rhythmus', 'lebensbedrohlich', 'tod', 'beeinträchtigung', 'beeintraechtigung', 'verlangsamt', 'stoffwechsel'],
            minMatches: 3,
            sampleAnswer:
              'Unterkühlung ist gefährlich, weil die Körpertemperatur unter 35 °C sinkt und dadurch lebenswichtige Funktionen beeinträchtigt werden. Kreislauf, Atmung, Bewusstsein und Organe arbeiten langsamer — bei schweren Verläufen drohen Herzrhythmusstörungen, Bewusstlosigkeit und Tod. Besonders kritisch: Wenn das Zittern aufhört, kann der Körper keine Wärme mehr produzieren, und beim falschen Erwärmen droht der gefürchtete Bergungstod (kaltes Blut der Extremitäten gelangt zur Körpermitte und löst Herzrhythmusstörungen aus).',
          },
          {
            prompt: 'b) Was sollte man bei Unterkühlung vermeiden?',
            keywords: ['heiß', 'heiss', 'duschen', 'baden', 'reiben', 'massieren', 'alkohol', 'extrem', 'schnell', 'erwärmung', 'erwaermung', 'bewegen', 'koffein', 'kaffee', 'unnötig', 'unnoetig'],
            minMatches: 3,
            sampleAnswer:
              'Bei Unterkühlung NICHT heiß duschen oder baden, NICHT stark reiben oder massieren, KEINEN Alkohol geben (öffnet Hautgefäße und beschleunigt den Wärmeverlust), keine schnelle Extrem-Erwärmung (kann den Kreislauf belasten und Herzrhythmusstörungen auslösen) und die Person nicht unnötig bewegen, sondern schonen. Auch keine koffeinhaltigen Getränke wie Kaffee, schwarzer Tee oder Cola — sie entwässern und belasten den Kreislauf zusätzlich. Stattdessen langsam erwärmen, warme süße Getränke nur bei wacher Person, ruhig lagern und beobachten.',
          },
        ],
      },
    ],
  },
};

export default unterkuehlung;
