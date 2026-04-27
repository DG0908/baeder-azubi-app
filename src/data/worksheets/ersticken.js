const ersticken = {
  id: 'ersticken',
  title: 'Ersticken',
  subtitle: 'Fremdkörper in den Atemwegen erkennen und richtig handeln',
  category: 'first',
  icon: '😮‍💨',
  estimatedMinutes: 20,
  reference: {
    image: '/worksheets/ersticken-referenz.png',
    alt: 'Lernblatt Ersticken — Fremdkörper in den Atemwegen erkennen, Warnzeichen, teilweise und schwere Verlegung, richtiges Vorgehen',
    intro:
      'Ein Fremdkörper in den Atemwegen kann lebensbedrohlich sein. Entscheidend ist, ob die Person noch wirksam husten oder sprechen kann. Solange die Person wirksam hustet: zum Husten auffordern und beobachten — Husten ist der effektivste natürliche Mechanismus, um den Fremdkörper zu lösen. Bei schwerer Atemwegsverlegung (kein wirksames Husten, kaum Sprechen oder Atmen): sofort Hilfe rufen / 112, im Wechsel 5 Rückenschläge zwischen die Schulterblätter und 5 Oberbauchkompressionen — fortsetzen bis der Fremdkörper entfernt ist oder die Person bewusstlos wird. Bei Bewusstlosigkeit: Atmung prüfen, bei fehlender normaler Atmung HLW beginnen, AED einsetzen, wenn verfügbar. Merksatz: HUSTEN LASSEN — HILFE HOLEN — 5 RÜCKENSCHLÄGE — 5 OBERBAUCHKOMPRESSIONEN — BEI BEWUSSTLOSIGKEIT HLW.',
    sections: [
      {
        heading: 'Was ist gemeint?',
        items: [
          { label: 'Fremdkörper in den Atemwegen', body: 'Ein Gegenstand (Essen, Bonbon, Spielzeugteil, Münze, Zahnersatz) gelangt in die Luftröhre und verlegt die Atemwege teilweise oder vollständig.' },
          { label: 'Entscheidende Frage', body: 'Kann die Person noch wirksam husten oder sprechen? Davon hängt das gesamte weitere Vorgehen ab.' },
          { label: 'Solange wirksam gehustet wird', body: 'Person zum Husten auffordern und beobachten — NICHT eingreifen, NICHT auf den Rücken schlagen. Husten ist der wirksamste Mechanismus zur Selbstbefreiung.' },
          { label: 'Bei schwerer Verlegung', body: 'Wenn die Person nicht mehr wirksam husten, kaum sprechen oder atmen kann: Sofortmaßnahmen im Wechsel — 5 Rückenschläge / 5 Oberbauchkompressionen.' },
        ],
      },
      {
        heading: 'Typische Warnzeichen',
        items: [
          { label: 'Plötzlicher Hustenreiz', body: 'Heftiges, plötzliches Husten, oft mitten beim Essen oder Trinken — der Körper versucht, den Fremdkörper auszustoßen.' },
          { label: 'Würgen', body: 'Würgereiz, krampfartige Bewegungen im Hals — Hinweis auf einen Fremdkörper im Rachen oder oberen Atemweg.' },
          { label: 'Keine oder kaum Stimme', body: 'Person kann nicht mehr sprechen oder bringt nur leise, gepresste Laute hervor — Zeichen für eine schwere Verlegung der Atemwege.' },
          { label: 'Atemnot', body: 'Person ringt nach Luft, kann nicht mehr durchatmen — bedrohliches Zeichen, sofort handeln.' },
          { label: 'Pfeifende Atemgeräusche', body: 'Stridor — pfeifendes oder zischendes Geräusch beim Einatmen, weil die Luft nur noch durch eine enge Stelle strömt.' },
          { label: 'Griff an den Hals', body: 'Universelles Erstickenszeichen — die Person fasst sich instinktiv mit beiden Händen an den Hals.' },
          { label: 'Blaue Lippen / Haut', body: 'Zyanose — Sauerstoffmangel macht sich an Lippen, Fingern und Gesicht bemerkbar. Zeichen für eine schwere, anhaltende Verlegung.' },
          { label: 'Panik / Unruhe', body: 'Person ist sehr aufgeregt, panisch, verzweifelt — emotionaler Ausdruck der Atemnot.' },
          { label: 'Bei kompletter Verlegung: Bewusstlosigkeit', body: 'Wenn keine Luft mehr in die Lunge gelangt, verliert die Person nach kurzer Zeit das Bewusstsein — sofort HLW vorbereiten.' },
        ],
      },
      {
        heading: 'Teilweise Verlegung — Person kann noch husten oder sprechen',
        items: [
          { label: 'Zum Husten auffordern', body: 'Die Person ermutigen, kräftig weiter zu husten — Husten ist der effektivste Weg, den Fremdkörper zu lösen.' },
          { label: 'Beruhigen', body: 'Ruhig und freundlich sprechen, Panik nehmen — Stress verstärkt die Atemnot und den Hustenreiz.' },
          { label: 'Nicht allein lassen', body: 'In der Nähe bleiben — der Zustand kann sich jederzeit verschlechtern, dann sofort eingreifen.' },
          { label: 'Zustand beobachten', body: 'Atmung, Hustenkraft, Hautfarbe, Bewusstsein im Blick behalten — auf Verschlechterung achten.' },
          { label: 'Bei Verschlechterung 112', body: 'Wenn das Husten nachlässt, die Stimme verschwindet oder die Atemnot zunimmt: sofort Notruf 112 und schwere Verlegung behandeln.' },
        ],
      },
      {
        heading: 'Schwere Atemwegsverlegung — Person kann nicht wirksam husten, kaum sprechen oder atmen',
        items: [
          { label: '1. Hilfe rufen / 112', body: 'Sofort Notruf absetzen oder absetzen lassen — auch während der Maßnahmen, am besten per Lautsprecher mit dem Rettungsdienst verbunden bleiben.' },
          { label: '2. 5 kräftige Rückenschläge', body: 'Person nach vorn beugen lassen, Brust mit einer Hand stützen — mit dem Handballen 5× kräftig zwischen die Schulterblätter schlagen. Nach jedem Schlag prüfen, ob der Fremdkörper gelöst ist.' },
          { label: '3. Wenn erfolglos: 5 Oberbauchkompressionen', body: 'Heimlich-Handgriff — von hinten umfassen, Faust unter dem Brustbein in der Magengrube, mit der anderen Hand umfassen, 5× ruckartig nach innen-oben drücken.' },
          { label: '4. Abwechselnd 5/5 fortsetzen', body: '5 Rückenschläge — 5 Oberbauchkompressionen im Wechsel, bis der Fremdkörper entfernt ist oder die Person bewusstlos wird.' },
          { label: 'Wenn der Fremdkörper sichtbar', body: 'Nur sichtbare Fremdkörper aus dem Mund entfernen — niemals blind in den Mund greifen, da der Fremdkörper sonst tiefer rutschen kann.' },
          { label: 'Nach erfolgreicher Befreiung', body: 'IMMER ärztlich abklären lassen — Oberbauchkompressionen können innere Verletzungen verursachen, der Fremdkörper kann Reste hinterlassen haben.' },
        ],
      },
      {
        heading: 'Wenn die Person bewusstlos wird',
        items: [
          { label: 'Notruf 112', body: 'Sofort Notruf absetzen oder bestätigen, falls noch nicht geschehen — Rettungsdienst alarmieren.' },
          { label: 'Atmung prüfen', body: 'Person flach auf den Rücken legen, Atemwege freimachen (Kopf überstrecken, Kinn anheben), Atmung höchstens 10 Sekunden prüfen — sehen, hören, fühlen.' },
          { label: 'Bei fehlender normaler Atmung: HLW beginnen', body: 'Sofort 30 Brustkorbkompressionen, dann 2 Beatmungen — Rhythmus 30:2 fortsetzen. Vor jeder Beatmung Mundraum kurz auf sichtbare Fremdkörper prüfen.' },
          { label: 'AED einsetzen, wenn verfügbar', body: 'Sobald ein AED da ist: einschalten, Pads anlegen, Anweisungen folgen — auch beim Ersticken-Fall sinnvoll, da Herzrhythmusstörungen drohen.' },
          { label: 'Weiterhelfen bis Rettungsdienst übernimmt', body: 'HLW ohne Unterbrechung fortsetzen — der Rettungsdienst übernimmt vor Ort und führt die Versorgung weiter.' },
        ],
      },
      {
        heading: 'Wichtig: Was man vermeiden sollte',
        items: [
          { label: 'Nicht blind in den Mund greifen', body: 'Niemals mit den Fingern unkontrolliert in den Mund — der Fremdkörper kann tiefer rutschen oder verkeilen. Nur sichtbare Gegenstände entfernen.' },
          { label: 'Keine Getränke geben', body: 'Wasser, Tee oder andere Flüssigkeiten KEINE Hilfe — sie können in die Atemwege gelangen und die Lage verschlimmern.' },
          { label: 'Nicht abwarten bei zunehmender Atemnot', body: 'Wenn das Husten nachlässt oder die Atemnot stärker wird: sofort handeln. Jede Minute zählt — Bewusstlosigkeit droht.' },
          { label: 'Nicht hektisch oder planlos handeln', body: 'Ruhig bleiben, Reihenfolge einhalten — 5 Rückenschläge, dann 5 Oberbauchkompressionen, im Wechsel. Hektik überträgt sich auf die Person.' },
          { label: 'Nicht auf den Rücken schlagen, wenn die Person noch wirksam hustet', body: 'Solange die Person wirksam hustet: NICHT eingreifen — Schläge können den Fremdkörper tiefer in die Atemwege treiben.' },
          { label: 'Nicht auf eigene Faust transportieren', body: 'Nicht selbst ins Krankenhaus fahren — Rettungsdienst rufen, der bringt Equipment und kann unterwegs versorgen.' },
        ],
      },
      {
        heading: 'Notruf 112 — was sagen?',
        items: [
          { label: '1. Wo ist es passiert?', body: 'Genaue Adresse oder Standort im Bad — Becken, Sauna, Bistro, Eingangsbereich. Bei Großbädern: Etage und nächster Zugang.' },
          { label: '2. Was ist passiert?', body: 'Kurz und klar: „Person erstickt — Fremdkörper in den Atemwegen, kann nicht mehr husten/sprechen."' },
          { label: '3. Wie viele Betroffene?', body: 'Anzahl der Verletzten / Betroffenen — meist eine Person, aber bei Mehrfachsituationen klar benennen.' },
          { label: '4. Welche Symptome?', body: 'Bewusstsein, Atmung, Hautfarbe (z. B. „bläuliche Lippen"), wirksames Husten möglich? — kurze Lagebeschreibung.' },
          { label: '5. Warten auf Rückfragen', body: 'Verbindung NIE selbst beenden — Disponent legt auf, sobald alle Informationen vorliegen. Hinweise zu Maßnahmen befolgen.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Bolus / Bolusgeschehen', body: 'Medizinischer Begriff für einen verschluckten Fremdkörper, der die Atemwege verlegt — typischerweise größerer Bissen Essen.' },
          { label: 'Heimlich-Handgriff', body: 'Oberbauchkompression — von hinten umfassen, Faust in die Magengrube, ruckartig nach innen-oben drücken. Erzeugt einen Druckstoß, der den Fremdkörper aus den Atemwegen schießen soll.' },
          { label: 'Rückenschlag', body: 'Mit dem Handballen kräftig zwischen die Schulterblätter — Person dabei nach vorn beugen, damit der Fremdkörper nach oben/außen befördert wird.' },
          { label: 'Stridor', body: 'Pfeifendes Atemgeräusch durch verengte Atemwege — Hinweis auf eine Verlegung im Kehlkopf- oder Luftröhrenbereich.' },
          { label: 'Zyanose', body: 'Bläuliche Verfärbung der Haut, besonders Lippen und Finger — Zeichen für Sauerstoffmangel im Blut.' },
          { label: 'Wirksames Husten', body: 'Husten mit hörbarem Luftstrom und Kraft — Person bekommt zwischen den Hustenstößen noch Luft. Hinweis auf teilweise Verlegung.' },
          { label: 'Aspiration', body: 'Eindringen von Fremdkörpern, Flüssigkeiten oder Speiseresten in die Atemwege — z. B. beim Verschlucken oder beim Erbrechen einer bewusstlosen Person.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Bistro / Cafeteria', body: 'Häufigster Ort: Verschlucken beim Essen — Pommes, Brötchenstücke, Kaugummi. Aufsicht im Bistrobereich auf Erstickenszeichen achten.' },
          { label: 'Kinderbereich', body: 'Kleinkinder stecken sich Spielzeugteile, Münzen oder Tauchringe in den Mund — bei Atemnot sofort eingreifen, Spezialgriffe für Säuglinge / Kleinkinder beachten.' },
          { label: 'Säuglinge und Kleinkinder', body: 'Bei Säuglingen (< 1 Jahr): Kopf nach unten über den Unterarm legen, 5 Rückenschläge, dann 5 Brustkompressionen — KEIN Heimlich-Handgriff bei Säuglingen.' },
          { label: 'Senioren', body: 'Schluckbeschwerden, Zahnersatz — erhöhte Erstickensgefahr beim Essen. Im Café-/Bistrobereich aufmerksam beobachten.' },
          { label: 'Schwimmer mit Kaugummi', body: 'Klassische Gefahr: Kaugummi beim Tauchen oder Springen — verschluckt sich leicht. Auf Hinweisschilder im Eingang achten.' },
          { label: 'Erstickungsfall bei Wasserrettung', body: 'Person hat beim Untergehen Erbrochenes oder Wasser eingeatmet — nach Rettung Atemwege prüfen, ggf. ärztlich abklären (sekundäres Ertrinken).' },
          { label: 'Schulung der Aufsichtskräfte', body: 'Erste-Hilfe-Auffrischung jährlich, Heimlich-Handgriff am Übungspuppe trainieren — im Notfall muss jeder Handgriff sitzen.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'HUSTEN LASSEN — HILFE HOLEN — 5 RÜCKENSCHLÄGE — 5 OBERBAUCHKOMPRESSIONEN — BEI BEWUSSTLOSIGKEIT HLW', body: 'Ruhe bewahren — schnell einschätzen — richtig handeln. Die fünf Schritte sitzen, wenn man sie regelmäßig übt.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/ersticken-arbeitsblatt.png',
    alt: 'Arbeitsblatt Fremdkörper in den Atemwegen zum Ausfüllen',
    tasks: [
      {
        id: 'warnzeichen',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Warnzeichen erkennen',
        prompt: 'Beschrifte die acht Warnzeichen entsprechend der Abbildungen.',
        items: [
          { number: 1, accept: ['Husten', 'Hustenreiz', 'Plötzlicher Hustenreiz', 'Ploetzlicher Hustenreiz', 'Plötzlicher Husten', 'Ploetzlicher Husten', 'Heftiger Husten', 'Hustenanfall'] },
          { number: 2, accept: ['Würgen', 'Wuergen', 'Würgereiz', 'Wuergereiz', 'Würgen / Würgereiz', 'Wuergen / Wuergereiz', 'Brechreiz'] },
          { number: 3, accept: ['Keine Stimme', 'Kaum Stimme', 'Keine oder kaum Stimme', 'Kann nicht sprechen', 'Sprachlosigkeit', 'Stimmverlust', 'Tonlos', 'Stimme weg'] },
          { number: 4, accept: ['Atemnot', 'Luftnot', 'Keine Luft bekommen', 'Atemprobleme', 'Atembeschwerden', 'Schwere Atmung', 'Kurzatmigkeit'] },
          { number: 5, accept: ['Griff an den Hals', 'Hände am Hals', 'Haende am Hals', 'Hals greifen', 'Hand am Hals', 'Greift sich an den Hals', 'Hals umklammern', 'Universelles Erstickenszeichen'] },
          { number: 6, accept: ['Pfeifende Atemgeräusche', 'Pfeifende Atemgeraeusche', 'Pfeifen', 'Atemgeräusche', 'Atemgeraeusche', 'Stridor', 'Pfeifendes Atmen', 'Pfeifender Atem', 'Pfeifgeräusch', 'Pfeifgeraeusch'] },
          { number: 7, accept: ['Blaue Lippen', 'Blaue Haut', 'Blaue Lippen / Haut', 'Zyanose', 'Bläuliche Lippen', 'Blaeuliche Lippen', 'Bläuliche Haut', 'Blaeuliche Haut', 'Sauerstoffmangel', 'Lippen blau'] },
          { number: 8, accept: ['Panik', 'Unruhe', 'Panik / Unruhe', 'Angst', 'Verzweiflung', 'Aufregung', 'Nervosität', 'Nervositaet', 'Panische Reaktion'] },
        ],
      },
      {
        id: 'verlegung',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Teilweise oder schwere Verlegung?',
        prompt: 'Ordne die Merkmale zu — 1–4 teilweise Verlegung, 5–8 schwere Verlegung.',
        items: [
          { number: 1, accept: ['Husten', 'Person kann husten', 'Wirksames Husten', 'Kann noch husten', 'Person hustet', 'Hustet noch', 'Kräftiges Husten', 'Kraeftiges Husten'] },
          { number: 2, accept: ['Sprechen', 'Person kann sprechen', 'Kann noch sprechen', 'Spricht noch', 'Person spricht', 'Reden möglich', 'Reden moeglich', 'Stimme vorhanden'] },
          { number: 3, accept: ['Atmen', 'Person bekommt Luft', 'Atmet noch', 'Atmung vorhanden', 'Bekommt Luft', 'Person atmet', 'Luft bekommen', 'Atmen möglich', 'Atmen moeglich'] },
          { number: 4, accept: ['Bei Bewusstsein', 'Person ist bei Bewusstsein', 'Wach', 'Ansprechbar', 'Bleibt bei Bewusstsein', 'Bewusstsein vorhanden', 'Person reagiert', 'Bewusst'] },
          { number: 5, accept: ['Kann nicht husten', 'Kein wirksames Husten', 'Person kann nicht husten', 'Kein Husten', 'Hustet nicht mehr', 'Hustet nicht', 'Husten unwirksam', 'Hustet kraftlos'] },
          { number: 6, accept: ['Kann nicht sprechen', 'Keine Stimme', 'Person kann nicht sprechen', 'Spricht nicht', 'Sprachlos', 'Tonlos', 'Stimme weg', 'Stimmverlust'] },
          { number: 7, accept: ['Atemnot', 'Starke Atemnot', 'Keine normale Atmung', 'Schwere Atemnot', 'Luftnot', 'Bekommt keine Luft', 'Erstickungsgefühl', 'Erstickungsgefuehl', 'Kaum Atmung'] },
          { number: 8, accept: ['Panik', 'Drohende Bewusstlosigkeit', 'Bewusstseinsstörung', 'Bewusstseinsstoerung', 'Panik / drohende Bewusstlosigkeit', 'Bewusstlosigkeit', 'Eintrübung', 'Eintruebung', 'Verwirrtheit'] },
        ],
      },
      {
        id: 'verhalten',
        type: 'numbered-labels',
        title: 'Aufgabe 3: Richtiges Verhalten',
        prompt: 'Bringe die fünf Schritte bei schwerer Atemwegsverlegung in die richtige Reihenfolge.',
        items: [
          { number: 1, accept: ['Husten lassen', 'Zum Husten auffordern', 'Husten lassen / zum Husten auffordern', 'Weiter husten lassen', 'Person zum Husten auffordern', 'Husten ermutigen', 'Beobachten'] },
          { number: 2, accept: ['Hilfe rufen', 'Notruf 112', '112 rufen', 'Notruf', 'Hilfe rufen / 112', '112', 'Rettungsdienst rufen', 'Notruf absetzen', '112 wählen', '112 waehlen'] },
          { number: 3, accept: ['Rückenschläge', 'Ruckenschlaege', 'Rueckenschlaege', '5 Rückenschläge', '5 Rueckenschlaege', '5 Ruckenschlaege', 'Rückenschläge zwischen die Schulterblätter', 'Rueckenschlaege zwischen die Schulterblaetter', 'Schläge auf den Rücken', 'Schlaege auf den Ruecken', 'Fünf Rückenschläge', 'Fuenf Rueckenschlaege'] },
          { number: 4, accept: ['Oberbauchkompressionen', '5 Oberbauchkompressionen', 'Heimlich-Handgriff', 'Heimlich Handgriff', 'Heimlich', 'Oberbauchkompression', 'Bauchstoß', 'Bauchstoss', 'Bauchstöße', 'Bauchstoesse', 'Fünf Oberbauchkompressionen', 'Fuenf Oberbauchkompressionen', 'Oberbauchstoß', 'Oberbauchstoss'] },
          { number: 5, accept: ['HLW', 'Wiederbelebung', 'Reanimation', 'HLW beginnen', 'Reanimation beginnen', 'Bei Bewusstlosigkeit HLW', 'HLW bei Bewusstlosigkeit', 'Herz-Lungen-Wiederbelebung', 'Wiederbelebung beginnen', 'Reanimation starten'] },
        ],
      },
      {
        id: 'begriffe',
        type: 'numbered-labels',
        title: 'Aufgabe 4: Wichtige Begriffe',
        prompt: 'Schreibe die passenden Begriffe unter die Bilder.',
        items: [
          { number: 1, accept: ['Rückenschläge', 'Rueckenschlaege', 'Ruckenschlaege', '5 Rückenschläge', '5 Rueckenschlaege', '5 Ruckenschlaege', 'Schläge auf den Rücken', 'Schlaege auf den Ruecken', 'Rückenschlag', 'Rueckenschlag', 'Schulterschlag', 'Schläge zwischen die Schulterblätter', 'Schlaege zwischen die Schulterblaetter'] },
          { number: 2, accept: ['Oberbauchkompressionen', 'Oberbauchkompression', '5 Oberbauchkompressionen', 'Heimlich-Handgriff', 'Heimlich Handgriff', 'Heimlich', 'Bauchstoß', 'Bauchstoss', 'Bauchstöße', 'Bauchstoesse', 'Oberbauchstoß', 'Oberbauchstoss', 'Bauchkompression'] },
          { number: 3, accept: ['Notruf 112', '112', 'Notruf', '112 rufen', '112 wählen', '112 waehlen', 'Notruf absetzen', 'Rettungsdienst rufen', 'Hilfe rufen'] },
          { number: 4, accept: ['HLW', 'Wiederbelebung', 'Reanimation', 'Herz-Lungen-Wiederbelebung', 'HLW bei Bewusstlosigkeit', 'Wiederbelebung beginnen', 'Reanimation beginnen', 'CPR'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 5: Zusatzfragen',
        items: [
          {
            prompt: 'Warum soll eine Person mit wirksamem Husten zunächst weiter husten?',
            keywords: ['husten', 'wirksam', 'fremdkörper', 'fremdkoerper', 'lösen', 'loesen', 'natürlich', 'natuerlich', 'mechanismus', 'effektiv', 'ausstoßen', 'ausstossen', 'luft', 'beobachten', 'ermutigen'],
            minMatches: 3,
            sampleAnswer:
              'Husten ist der wirksamste natürliche Mechanismus, um einen Fremdkörper aus den Atemwegen zu lösen — der Druckstoß beim Husten kann den Fremdkörper nach außen befördern. Solange die Person wirksam hustet und noch Luft bekommt, soll sie ermutigt werden, kräftig weiter zu husten. Eingriffe wie Rückenschläge oder Oberbauchkompressionen wären in dieser Phase sogar gefährlich, weil sie den Fremdkörper tiefer in die Atemwege treiben könnten. Der Helfer beruhigt, beobachtet und greift erst ein, wenn das Husten nachlässt oder die Person nicht mehr sprechen oder atmen kann.',
          },
          {
            prompt: 'Was sollte man bei einem Fremdkörper in den Atemwegen vermeiden?',
            keywords: ['blind', 'mund', 'greifen', 'getränke', 'getraenke', 'wasser', 'trinken', 'abwarten', 'hektisch', 'planlos', 'rücken', 'ruecken', 'schlagen', 'transport', 'eigene faust'],
            minMatches: 3,
            sampleAnswer:
              'Niemals blind in den Mund greifen — der Fremdkörper kann tiefer rutschen oder verkeilen. Keine Getränke geben, da Flüssigkeit in die Atemwege gelangen und die Lage verschlimmern kann. Nicht abwarten, wenn die Atemnot zunimmt oder das Husten nachlässt — sofort handeln. Nicht hektisch oder planlos vorgehen, sondern die Reihenfolge einhalten (5 Rückenschläge / 5 Oberbauchkompressionen im Wechsel). Nicht auf den Rücken schlagen, solange die Person noch wirksam hustet, und nicht auf eigene Faust ins Krankenhaus transportieren — Rettungsdienst rufen.',
          },
        ],
      },
    ],
  },
};

export default ersticken;
