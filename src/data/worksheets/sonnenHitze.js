const sonnenHitze = {
  id: 'sonnen-hitze',
  title: 'Sonnenstich, Hitzeerschöpfung & Hitzschlag',
  subtitle: 'Symptome erkennen, richtig handeln und Notfälle einschätzen',
  category: 'first',
  icon: '☀️',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/sonnen-hitze-referenz.png',
    alt: 'Lernblatt Sonnenstich, Hitzeerschöpfung und Hitzschlag mit Symptomen, Erste-Hilfe-Maßnahmen und Notfallkriterien',
    intro:
      'Sonnenstich, Hitzeerschöpfung und Hitzschlag sind drei verschiedene hitzebedingte Notfälle, die im Bäderbetrieb regelmäßig auftreten — vor allem im Freibad an heißen Sommertagen. Sonnenstich entsteht durch direkte Sonneneinstrahlung auf den ungeschützten Kopf, Hitzeerschöpfung durch Flüssigkeits- und Salzverlust bei großer Hitze. Der Hitzschlag dagegen ist ein akuter Notfall: Die Temperaturregulation versagt, der Körper überhitzt gefährlich. Dann zählt jede Minute — Notruf 112.',
    sections: [
      {
        heading: 'Was ist der Unterschied?',
        items: [
          { label: 'Sonnenstich', body: 'Reizung von Kopf und Hirnhäuten durch intensive Sonneneinstrahlung auf den ungeschützten Kopf oder Nacken. Tritt meist mit Verzögerung auf — auch erst Stunden nach der Sonne.' },
          { label: 'Hitzeerschöpfung', body: 'Kreislaufproblem durch starken Flüssigkeits- und Salzverlust bei Hitze. Entsteht oft bei körperlicher Anstrengung in der Wärme — Blutdruck sinkt, Person fühlt sich schwach.' },
          { label: 'Hitzschlag', body: 'Gefährliche Überwärmung des Körpers mit gestörter Temperaturregulation. Körperkerntemperatur steigt stark an (>40 °C), Schweißproduktion versagt — Hitzschlag ist ein AKUTER NOTFALL.' },
        ],
      },
      {
        heading: 'Typische Symptome — Sonnenstich',
        items: [
          { label: 'Kopfschmerzen', body: 'Drückend, oft im Bereich der Stirn und Schläfen.' },
          { label: 'Roter, heißer Kopf', body: 'Gesicht und Kopfhaut sind deutlich gerötet und heiß — der Rest des Körpers oft normal temperiert.' },
          { label: 'Nackenschmerzen / Nackensteifigkeit', body: 'Steifer, schmerzhafter Nacken — typisch durch die Reizung der Hirnhäute.' },
          { label: 'Übelkeit', body: 'Manchmal auch Erbrechen, vor allem bei Kindern.' },
          { label: 'Schwindel', body: 'Unsicheres Stehen, Drehgefühl.' },
          { label: 'Lichtempfindlichkeit', body: 'Helles Licht ist unangenehm — die Person sucht den Schatten.' },
        ],
      },
      {
        heading: 'Typische Symptome — Hitzeerschöpfung',
        items: [
          { label: 'Starkes Schwitzen', body: 'Die Schweißproduktion läuft auf Hochtouren — Haut feucht und blass.' },
          { label: 'Durst', body: 'Starker Durst durch den Flüssigkeitsverlust.' },
          { label: 'Blässe', body: 'Haut wirkt blass und kühl-feucht — Kreislauf zentralisiert.' },
          { label: 'Schwäche / Erschöpfung', body: 'Person fühlt sich kraftlos, kann sich kaum aufrecht halten.' },
          { label: 'Schneller Puls', body: 'Tachykardie — der Körper kompensiert den Volumenmangel.' },
          { label: 'Schwindel', body: 'Kreislaufschwäche, manchmal Kollaps-Gefühl beim Aufstehen.' },
          { label: 'Muskelkrämpfe', body: 'Durch Salzverlust — typisch in Beinen und Bauch.' },
        ],
      },
      {
        heading: 'Typische Symptome — Hitzschlag',
        items: [
          { label: 'Sehr heiße Haut', body: 'Gesamtkörper deutlich überwärmt — nicht nur der Kopf.' },
          { label: 'Oft trockene Haut', body: 'Wichtigstes Warnzeichen: Im Gegensatz zur Hitzeerschöpfung versagt die Schweißproduktion — die Haut ist heiß und trocken.' },
          { label: 'Körpertemperatur stark erhöht', body: 'Über 40 °C — lebensgefährlich.' },
          { label: 'Verwirrtheit', body: 'Person ist desorientiert, antwortet unklar oder reagiert nicht angemessen.' },
          { label: 'Bewusstseinsstörung', body: 'Eingetrübt bis bewusstlos — sofortiger Notfall.' },
          { label: 'Krampfanfall', body: 'Kann durch die hohe Temperatur ausgelöst werden.' },
          { label: 'Kollaps', body: 'Plötzlicher Zusammenbruch — Hitzschlag = akuter Notfall.' },
        ],
      },
      {
        heading: 'Erste Hilfe — richtig handeln',
        items: [
          { label: '1. Aus Sonne / Hitze bringen', body: 'Sofortiger Wechsel weg von der Hitzequelle.' },
          { label: '2. In den Schatten / kühlen Raum', body: 'Schattiger Platz, ggf. klimatisierter Raum oder kühle Sanitätsstation.' },
          { label: '3. Oberkörper lagern oder hinlegen', body: 'Bei Hitzeerschöpfung mit Beinen hoch (Schocklage), bei Sonnenstich mit erhöhtem Oberkörper. Bei Bewusstlosigkeit: stabile Seitenlage.' },
          { label: '4. Enge Kleidung lockern', body: 'Kragen öffnen, Gürtel lockern — die Wärme muss raus.' },
          { label: '5. Kühlen mit feuchten Tüchern', body: 'Auf Stirn, Nacken, Achseln und Leisten — dort verlaufen große Gefäße. KEINE eiskalte Schockkühlung.' },
          { label: '6. Kleine Schlucke Wasser', body: 'Nur wenn die Person wach und ansprechbar ist — bei Bewusstseinsstörung NICHT trinken geben.' },
          { label: '7. Beobachten', body: 'Zustand regelmäßig kontrollieren — Atmung, Puls, Bewusstsein, Hautfarbe und -temperatur.' },
          { label: '8. Bei Verschlechterung — NOTRUF 112', body: 'Sobald sich der Zustand verschlechtert oder schwere Symptome auftreten — sofort Rettungsdienst.' },
        ],
      },
      {
        heading: 'Wann ist es ein Notfall? — Notruf 112',
        items: [
          { label: 'Bewusstseinsstörung oder Ohnmacht', body: 'Person ist nicht mehr klar oder wird ohnmächtig — sofort 112.' },
          { label: 'Verwirrtheit', body: 'Desorientiert, redet wirr, reagiert unangemessen.' },
          { label: 'Krampfanfall', body: 'Krampfanfall im Zusammenhang mit Hitze.' },
          { label: 'Sehr hohe Körpertemperatur', body: 'Spürbar hochgradig überwärmt — vor allem über 40 °C.' },
          { label: 'Trockene, heiße Haut', body: 'Klassisches Hitzschlag-Zeichen — Schweißproduktion versagt.' },
          { label: 'Keine Besserung / rasche Verschlechterung', body: 'Trotz Schatten und Kühlung kein Fortschritt oder schnellere Verschlechterung.' },
          { label: 'Hitzschlag = akuter Notfall', body: 'Bei begründetem Hitzschlag-Verdacht IMMER sofort 112 — ohne Verzögerung.' },
        ],
      },
      {
        heading: 'Was man vermeiden sollte',
        items: [
          { label: 'Person nicht weiter in der Sonne lassen', body: 'Sonne weg — sofort Schatten oder kühlen Raum.' },
          { label: 'Keine Anstrengung fortsetzen', body: 'Nicht "weiter machen" oder "ein bisschen Bewegung" — die Person muss ruhen.' },
          { label: 'Keine eiskalte Schockkühlung', body: 'Kein Eiswasser, keine Kühlpacks direkt auf nackte Haut — kann Kreislaufschock auslösen.' },
          { label: 'Nichts zu trinken bei Bewusstseinsstörung', body: 'Aspirationsgefahr — bei eingetrübtem Bewusstsein nichts in den Mund geben.' },
          { label: 'Warnzeichen nicht verharmlosen', body: 'Verwirrtheit, trockene heiße Haut, Krampf — das ist ein Hitzschlag, kein "bisschen Sonne".' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Sonnenstich', body: 'Reizung der Hirnhäute durch direkte Sonne auf den Kopf — typisch: roter heißer Kopf bei normalem Körper.' },
          { label: 'Hitzeerschöpfung', body: 'Kreislaufproblem durch Flüssigkeits- und Salzverlust — typisch: blass, schwitzend, schwach.' },
          { label: 'Hitzschlag', body: 'Versagen der Temperaturregulation — typisch: heiße trockene Haut, Verwirrtheit, > 40 °C. AKUTER NOTFALL.' },
          { label: 'Schocklage', body: 'Beine hoch, Oberkörper flach — bei Kreislaufschwäche und Hitzeerschöpfung.' },
          { label: 'Stabile Seitenlage', body: 'Bei Bewusstlosigkeit mit erhaltener Atmung — verhindert Aspiration.' },
        ],
      },
      {
        heading: 'Praxisbezug — Freibad / Sommer',
        items: [
          { label: 'Risikogruppen', body: 'Besonders gefährdet sind Kinder, ältere Menschen, Sporttreibende und Personen mit langer Sonnenexposition ohne Kopfschutz.' },
          { label: 'Ausreichend trinken', body: 'Regelmäßig über den Tag verteilt — nicht erst, wenn Durst da ist.' },
          { label: 'Kopfbedeckung & Sonnenbrille', body: 'Hut/Cap und UV-Schutzbrille — schützen Kopf, Nacken und Augen.' },
          { label: 'Leichte Kleidung', body: 'Locker, hell, atmungsaktiv — keine dunklen, eng anliegenden Stoffe.' },
          { label: 'Pausen im Schatten', body: 'Regelmäßig Sonnenpausen einplanen — besonders zur Mittagszeit.' },
          { label: 'Auf Mitmenschen achten', body: 'Im Bad: Kollegen und Badegäste mit beobachten — Hitzschlag wird oft zuerst von außen erkannt.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'Schatten, kühlen, beobachten', body: 'Drei Schritte — und bei Verwirrtheit oder Kollaps sofort 112.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/sonnen-hitze-arbeitsblatt.png',
    alt: 'Arbeitsblatt Sonnenstich, Hitzeerschöpfung und Hitzschlag zum Ausfüllen',
    tasks: [
      {
        id: 'unterschiede',
        type: 'keyword-text',
        title: 'Aufgabe 1: Unterschiede erkennen',
        items: [
          {
            prompt: 'Sonnenstich — beschreibe kurz das Krankheitsbild.',
            keywords: ['sonne', 'sonnenstrahl', 'einstrahlung', 'kopf', 'nacken', 'hirnhaut', 'hirnhäute', 'hirnhaeute', 'reizung', 'ungeschützt', 'ungeschuetzt'],
            minMatches: 2,
            sampleAnswer:
              'Reizung von Kopf und Hirnhäuten durch intensive Sonneneinstrahlung auf den ungeschützten Kopf oder Nacken. Typisch: roter heißer Kopf, Kopfschmerzen, Nackensteifigkeit, Übelkeit.',
          },
          {
            prompt: 'Hitzeerschöpfung — beschreibe kurz das Krankheitsbild.',
            keywords: ['kreislauf', 'flüssigkeit', 'fluessigkeit', 'salz', 'verlust', 'schwitzen', 'durst', 'schwach', 'puls', 'blass', 'hitze'],
            minMatches: 2,
            sampleAnswer:
              'Kreislaufproblem durch Flüssigkeits- und Salzverlust bei großer Hitze. Typisch: starkes Schwitzen, blasse feuchte Haut, Schwäche, schneller Puls, Schwindel, manchmal Muskelkrämpfe.',
          },
          {
            prompt: 'Hitzschlag — beschreibe kurz das Krankheitsbild.',
            keywords: ['überwärmung', 'ueberwaermung', 'überhitzung', 'ueberhitzung', 'temperatur', '40', 'trocken', 'heiß', 'heiss', 'verwirr', 'bewusst', 'notfall', 'temperaturregulation'],
            minMatches: 3,
            sampleAnswer:
              'Gefährliche Überwärmung des Körpers mit gestörter Temperaturregulation. Körperkerntemperatur über 40 °C, oft trockene heiße Haut, Verwirrtheit, Bewusstseinsstörung, Krampf, Kollaps. Hitzschlag ist ein akuter Notfall — sofort Notruf 112.',
          },
        ],
      },
      {
        id: 'symptome-sonnenstich',
        type: 'open-list',
        title: 'Aufgabe 2a: Symptome zuordnen — Sonnenstich',
        prompt: 'Nenne vier typische Symptome eines Sonnenstichs.',
        expectedCount: 4,
        pool: [
          { accept: ['Kopfschmerzen', 'Kopfweh', 'Kopfschmerz'] },
          { accept: ['Roter Kopf', 'Roter heißer Kopf', 'Roter heisser Kopf', 'Hochroter Kopf', 'Heißer Kopf', 'Heisser Kopf', 'Gesichtsrötung', 'Gesichtsroetung'] },
          { accept: ['Nackenschmerzen', 'Nackensteifigkeit', 'Steifer Nacken', 'Nackenspannung'] },
          { accept: ['Übelkeit', 'Uebelkeit', 'Brechreiz', 'Erbrechen'] },
          { accept: ['Schwindel', 'Drehschwindel', 'Benommenheit'] },
          { accept: ['Lichtempfindlichkeit', 'Photophobie', 'Lichtscheu'] },
        ],
      },
      {
        id: 'symptome-hitzeerschoepfung',
        type: 'open-list',
        title: 'Aufgabe 2b: Symptome zuordnen — Hitzeerschöpfung',
        prompt: 'Nenne vier typische Symptome einer Hitzeerschöpfung.',
        expectedCount: 4,
        pool: [
          { accept: ['Starkes Schwitzen', 'Schwitzen', 'Vermehrtes Schwitzen', 'Feuchte Haut'] },
          { accept: ['Durst', 'Starker Durst', 'Großer Durst', 'Grosser Durst'] },
          { accept: ['Blässe', 'Blaesse', 'Blasse Haut', 'Blass'] },
          { accept: ['Schwäche', 'Schwaeche', 'Erschöpfung', 'Erschoepfung', 'Kraftlosigkeit', 'Schwächegefühl', 'Schwaechegefuehl'] },
          { accept: ['Schneller Puls', 'Erhöhter Puls', 'Erhoehter Puls', 'Tachykardie', 'Herzrasen', 'Herzklopfen'] },
          { accept: ['Schwindel', 'Drehschwindel', 'Kreislaufschwäche', 'Kreislaufschwaeche', 'Benommenheit'] },
          { accept: ['Muskelkrämpfe', 'Muskelkraempfe', 'Krämpfe', 'Kraempfe', 'Muskelkrampf'] },
        ],
      },
      {
        id: 'symptome-hitzschlag',
        type: 'open-list',
        title: 'Aufgabe 2c: Symptome zuordnen — Hitzschlag',
        prompt: 'Nenne vier typische Symptome eines Hitzschlags.',
        expectedCount: 4,
        pool: [
          { accept: ['Sehr heiße Haut', 'Sehr heisse Haut', 'Heiße Haut', 'Heisse Haut', 'Überwärmung', 'Ueberwaermung'] },
          { accept: ['Trockene Haut', 'Heiße trockene Haut', 'Heisse trockene Haut', 'Kein Schwitzen', 'Schwitzen versagt', 'Trocken-heiße Haut', 'Trocken-heisse Haut'] },
          { accept: ['Hohe Körpertemperatur', 'Hohe Koerpertemperatur', 'Stark erhöhte Körpertemperatur', 'Stark erhoehte Koerpertemperatur', 'Über 40 Grad', 'Ueber 40 Grad', 'Fieber', '40 Grad', 'Körpertemperatur erhöht', 'Koerpertemperatur erhoeht'] },
          { accept: ['Verwirrtheit', 'Verwirrt', 'Desorientiertheit', 'Desorientierung'] },
          { accept: ['Bewusstseinsstörung', 'Bewusstseinsstoerung', 'Bewusstlosigkeit', 'Ohnmacht', 'Eingetrübtes Bewusstsein', 'Eingetruebtes Bewusstsein'] },
          { accept: ['Krampf', 'Krampfanfall', 'Krämpfe', 'Kraempfe'] },
          { accept: ['Kollaps', 'Zusammenbruch', 'Kreislaufzusammenbruch'] },
        ],
      },
      {
        id: 'massnahmen',
        type: 'open-list',
        title: 'Aufgabe 3: Richtiges Verhalten',
        prompt: 'Nenne sechs wichtige Maßnahmen bei Hitzeproblemen.',
        expectedCount: 6,
        pool: [
          { accept: ['Aus der Sonne bringen', 'Aus Sonne bringen', 'Sonne weg', 'Aus Hitze bringen', 'Aus der Hitze nehmen', 'Sonne verlassen'] },
          { accept: ['Schatten', 'In den Schatten bringen', 'Schatten suchen', 'Kühlen Raum', 'Kuehlen Raum', 'Kühlen Ort', 'Kuehlen Ort'] },
          { accept: ['Hinlegen', 'Oberkörper lagern', 'Oberkoerper lagern', 'Lagern', 'Schocklage', 'Stabile Seitenlage', 'Hinsetzen'] },
          { accept: ['Enge Kleidung lockern', 'Kleidung lockern', 'Kleidung öffnen', 'Kleidung oeffnen'] },
          { accept: ['Kühlen', 'Kuehlen', 'Kühlende Tücher', 'Kuehlende Tuecher', 'Feuchte Tücher', 'Feuchte Tuecher', 'Kalte Umschläge', 'Kalte Umschlaege', 'Stirn kühlen', 'Stirn kuehlen', 'Nacken kühlen', 'Nacken kuehlen'] },
          { accept: ['Wasser geben', 'Trinken geben', 'Kleine Schlucke Wasser', 'Wasser anbieten', 'Flüssigkeit geben', 'Fluessigkeit geben'] },
          { accept: ['Beobachten', 'Zustand kontrollieren', 'Überwachen', 'Ueberwachen', 'Kontrolle Atmung Puls', 'Beobachtung'] },
          { accept: ['Notruf 112', '112', 'Notruf', 'Rettungsdienst rufen', 'Bei Verschlechterung 112'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfragen',
        items: [
          {
            prompt: '1. Woran erkennst du den Unterschied zwischen Hitzeerschöpfung und Hitzschlag?',
            keywords: ['hitzeerschöpfung', 'hitzeerschoepfung', 'hitzschlag', 'schwitz', 'feucht', 'blass', 'puls', 'durst', 'trocken', 'heiß', 'heiss', 'verwirr', 'bewusst', 'temperatur', '40', 'ansprechbar', 'kreislauf', 'haut'],
            minMatches: 4,
            sampleAnswer:
              'Bei der Hitzeerschöpfung schwitzt die Person stark, die Haut ist blass und feucht-kühl, der Puls schnell — die Person ist meist noch ansprechbar, hat Durst und ist geschwächt. Beim Hitzschlag dagegen versagt die Schweißproduktion: Die Haut ist sehr heiß und oft trocken, die Körperkerntemperatur stark erhöht (über 40 °C). Die Person ist verwirrt, kann das Bewusstsein verlieren oder krampfen. Hitzschlag ist ein akuter Notfall — sofort Notruf 112.',
          },
          {
            prompt: '2. Wann sollte bei Sonnenstich, Hitzeerschöpfung oder Hitzschlag der Notruf 112 gewählt werden?',
            keywords: ['bewusst', 'ohnmacht', 'verwirr', 'krampf', 'krampfanfall', 'temperatur', '40', 'trocken', 'heiß', 'heiss', 'haut', 'verschlechter', 'keine besserung', 'hitzschlag', 'unsicher', 'notfall'],
            minMatches: 4,
            sampleAnswer:
              'Notruf 112 immer dann, wenn ein Hitzschlag besteht oder vermutet wird (heiße trockene Haut, Verwirrtheit, > 40 °C) — Hitzschlag ist ein akuter Notfall. Außerdem bei Bewusstseinsstörung oder Ohnmacht, Krampfanfall, sehr hoher Körpertemperatur, fehlender Besserung trotz Erstmaßnahmen oder rascher Verschlechterung. Grundsatz: Im Zweifel lieber einmal zu viel als einmal zu wenig anrufen.',
          },
        ],
      },
    ],
  },
};

export default sonnenHitze;
