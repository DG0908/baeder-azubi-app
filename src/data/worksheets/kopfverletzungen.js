const kopfverletzungen = {
  id: 'kopfverletzungen',
  title: 'Kopfverletzungen',
  subtitle: 'Symptome erkennen, richtig handeln und Notfälle einschätzen',
  category: 'first',
  icon: '🤕',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/kopfverletzungen-referenz.png',
    alt: 'Lernblatt Kopfverletzungen — Warnzeichen, Erste-Hilfe-Maßnahmen und Notfallkriterien',
    intro:
      'Kopfverletzungen entstehen durch Stoß, Sturz oder Schlag gegen den Kopf. Es können äußere Verletzungen wie Platzwunden oder Prellungen sowie innere Verletzungen wie eine Gehirnerschütterung oder ein Schädel-Hirn-Trauma auftreten. Auch wenn die Person nach einem Sturz "ganz normal" wirkt, können sich Symptome später verschlechtern — deshalb gilt: jede Kopfverletzung ernst nehmen, beobachten und bei Warnzeichen sofort 112. Im Bäderbetrieb sind Kopfverletzungen durch Stürze auf Fliesen, Kopfsprünge in zu flaches Wasser oder Zusammenstöße häufige Notfälle. Merksatz: BERUHIGEN — BEOBACHTEN — KÜHLEN / ABDECKEN — 112 BEI WARNZEICHEN.',
    sections: [
      {
        heading: 'Was sind Kopfverletzungen?',
        items: [
          { label: 'Definition', body: 'Verletzungen des Schädels, der Kopfhaut, des Gehirns oder umliegender Strukturen — entstehen durch Stoß, Sturz oder Schlag gegen den Kopf.' },
          { label: 'Äußere Verletzungen', body: 'Platzwunden, Schürfwunden, Prellungen, Beulen, Hämatome — meist sichtbar, aber nicht immer das ganze Ausmaß zeigend.' },
          { label: 'Innere Verletzungen', body: 'Gehirnerschütterung, Hirnblutung, Schädelbruch — können von außen unsichtbar sein und sich erst Stunden später bemerkbar machen.' },
          { label: 'Wichtigster Grundsatz', body: 'Jede Kopfverletzung ernst nehmen — auch wenn die Person zunächst noch ansprechbar wirkt. Symptome können sich verschlechtern.' },
        ],
      },
      {
        heading: 'Typische Warnzeichen',
        items: [
          { label: 'Kopfschmerzen', body: 'Plötzliche, oft starke Schmerzen am Kopf — können konstant sein oder zunehmend.' },
          { label: 'Schwindel', body: 'Drehschwindel, Gangunsicherheit, Standunsicherheit — Hinweis auf Beteiligung des Gleichgewichtssystems.' },
          { label: 'Übelkeit / Erbrechen', body: 'Übelkeit oder Erbrechen — besonders wiederholtes Erbrechen ist ein Warnzeichen für eine ernste Hirnverletzung.' },
          { label: 'Blutung / Platzwunde', body: 'Blutung an der Kopfhaut — kann durch viele kleine Blutgefäße der Kopfhaut sehr stark wirken, ist aber meist gut zu stillen.' },
          { label: 'Beule / Schwellung', body: 'Sichtbare Beule oder Schwellung am Kopf — Hinweis auf Prellung oder Hämatom.' },
          { label: 'Benommenheit / Verwirrtheit', body: 'Person wirkt verwirrt, beantwortet Fragen falsch, ist desorientiert (zeitlich, örtlich, persönlich).' },
          { label: 'Sehstörungen', body: 'Verschwommenes Sehen, Doppelbilder, ungleich große Pupillen, Lichtempfindlichkeit.' },
          { label: 'Bewusstlosigkeit', body: 'Person reagiert nicht auf Ansprache oder Berührung — IMMER ein Notfall, sofort 112.' },
        ],
      },
      {
        heading: 'Mögliche Ursachen',
        items: [
          { label: 'Sturz', body: 'Auf nasser Fliese, glattem Boden, in der Sauna, beim Treppensteigen — häufigste Ursache.' },
          { label: 'Zusammenstoß', body: 'Im Becken mit anderen Schwimmern, beim Spielen, an Beckenrand oder Sprungturm.' },
          { label: 'Schlag', body: 'Direkter Schlag gegen den Kopf — z. B. durch fallende Gegenstände, beim Sport oder bei tätlichen Auseinandersetzungen.' },
          { label: 'Sportunfall', body: 'Kopfsprung in zu flaches Wasser, Aufprall am Beckenboden, Aufprall mit Sprungbrett — typisch im Bäderbetrieb.' },
        ],
      },
      {
        heading: 'Erste Hilfe — richtig handeln',
        items: [
          { label: '1. Ruhe bewahren', body: 'Sich selbst sammeln und überlegt handeln. Eigene Ruhe hilft der betroffenen Person.' },
          { label: '2. Person beruhigen und lagern', body: 'Beruhigend ansprechen, hinsetzen oder halbaufrecht lagern. Bewegungen vermeiden — bei Verdacht auf Halswirbelsäulenverletzung Kopf möglichst nicht bewegen.' },
          { label: '3. Wunde abdecken / Schwellung kühlen', body: 'Platzwunde mit sauberem Tuch oder steriler Wundauflage abdecken. Bei Schwellung oder Beule: kühlen (NICHT direkt auf die Haut — Tuch dazwischen, Kühlpausen alle 20 Minuten).' },
          { label: '4. Bei Bewusstseinsstörung oder Atemproblemen: 112', body: 'Sofort Notruf wählen — bei Bewusstlosigkeit, Atemproblemen oder Verschlechterung jede Sekunde wichtig.' },
          { label: '5. Beobachten', body: 'Regelmäßig Zustand prüfen — Bewusstsein, Atmung, Pupillen, Symptome. Veränderungen an Rettungsdienst weitergeben.' },
          { label: '6. Nichts essen oder trinken geben', body: 'Besonders bei Übelkeit, Erbrechen oder Bewusstseinsstörung — Aspirationsgefahr und mögliche OP-Vorbereitung.' },
        ],
      },
      {
        heading: 'Wann wird es zum Notfall? — Sofort 112',
        items: [
          { label: 'Bewusstlosigkeit', body: 'Auch kurze Bewusstlosigkeit nach Aufprall ist immer ein Notfall — sofort 112.' },
          { label: 'Wiederholtes Erbrechen', body: 'Mehrfaches Erbrechen nach Kopftrauma deutet auf Hirndruck oder schwere Verletzung — sofort 112.' },
          { label: 'Starke Kopfschmerzen', body: 'Heftige, anhaltende oder sich verstärkende Kopfschmerzen — Hinweis auf Hirnblutung möglich.' },
          { label: 'Verwirrtheit', body: 'Anhaltende Desorientierung, falsche Antworten, verzögerte Reaktion — neurologisches Warnzeichen.' },
          { label: 'Krampfanfall', body: 'Krampfanfall nach Kopftrauma — sofort 112, parallel Erste Hilfe bei Krampfanfall (schützen, Zeit messen, nach Anfall stabile Seitenlage).' },
          { label: 'Sehstörungen', body: 'Doppelbilder, verschwommenes Sehen, ungleich große Pupillen — kritischer Hinweis auf Hirndruck.' },
          { label: 'Blut oder klare Flüssigkeit aus Nase oder Ohr', body: 'Hinweis auf Schädelbruch oder Hirnhautriss — Lebensgefahr, sofort 112. NICHT die Nase verschließen oder die Flüssigkeit stoppen.' },
          { label: 'Atemprobleme', body: 'Atemnot, unregelmäßige Atmung, Atemstillstand nach Kopftrauma — sofort 112, ggf. HLW.' },
        ],
      },
      {
        heading: 'Was man vermeiden sollte',
        items: [
          { label: 'Nicht schütteln oder rütteln', body: 'Person NICHT schütteln, um sie "wachzubekommen" — bei Hirnverletzung kann das den Schaden vergrößern.' },
          { label: 'Nicht unnötig bewegen oder transportieren', body: 'Person möglichst liegen lassen — bei Verdacht auf Halswirbelsäulenverletzung Kopf in der gefundenen Position lassen, bis Rettungsdienst übernimmt.' },
          { label: 'Nicht allein lassen', body: 'Person bleibt bis Rettungsdienst eintrifft unter ständiger Beobachtung — Symptome können sich rasch verschlechtern.' },
          { label: 'Keine Bagatellisierung', body: 'Jede Kopfverletzung ernst nehmen — auch wenn die Person zunächst "wieder OK" wirkt. "Talk-and-Die"-Phänomen ist möglich (Person spricht zunächst, verschlechtert sich später dramatisch).' },
          { label: 'Keine Selbstmedikation', body: 'Keine Schmerzmittel ohne ärztliche Anweisung — können Blutgerinnung beeinflussen oder Symptome verschleiern.' },
          { label: 'Helm nicht abnehmen', body: 'Bei Sport-/Verkehrsunfällen mit Helm: Helm NUR in absoluter Notlage abnehmen (Atemstillstand) — sonst Halswirbelsäulen-Schaden möglich.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Gehirnerschütterung (Commotio cerebri)', body: 'Leichteste Form der Hirnverletzung — meist mit kurzer Bewusstlosigkeit, Übelkeit, Kopfschmerzen, Erinnerungslücken. Trotzdem ärztlich abklären.' },
          { label: 'Schädel-Hirn-Trauma (SHT)', body: 'Verletzung des Schädels mit Beteiligung des Gehirns — leicht (GCS 13–15), mittelschwer (GCS 9–12), schwer (GCS ≤ 8).' },
          { label: 'Platzwunde', body: 'Riss oder Spalt in der Kopfhaut — blutet oft stark, weil Kopfhaut viele Gefäße hat. Mit Druck und sauberer Auflage gut zu stillen.' },
          { label: 'Hämatom (Beule)', body: 'Bluterguss unter der Haut — sichtbare Schwellung. Kühlen reduziert Schwellung und Schmerz.' },
          { label: 'Hirnblutung', body: 'Blutung im oder am Gehirn — kann sich Stunden nach Trauma entwickeln. Symptome: zunehmende Kopfschmerzen, Verwirrtheit, Bewusstseinstrübung.' },
          { label: 'Kühlpause', body: 'Kühlung niemals durchgehend — alle 20 Minuten Pause einlegen, damit die Haut sich erholt und keine Erfrierungen entstehen.' },
          { label: 'Halswirbelsäulen-Schonung', body: 'Bei Verdacht auf HWS-Verletzung: Kopf NICHT bewegen, Person möglichst liegen lassen, bis Rettungsdienst kommt.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Stürze auf nassen Fliesen', body: 'Klassischer Bäderunfall — Person rutscht aus, schlägt mit Hinterkopf auf. Sofort hinsetzen, Wunde versorgen, beobachten — bei Bewusstlosigkeit oder Erbrechen 112.' },
          { label: 'Kopfsprünge in zu flaches Wasser', body: 'Lebensgefahr durch Halswirbelsäulen-Verletzung — Person nicht bewegen, Kopf in Wasser-Position halten, achsengerecht bergen, sofort 112.' },
          { label: 'Zusammenstöße im Becken', body: 'Schwimmer kollidieren mit anderen, Wand oder Beckenrand — Person an Land bringen, lagern, Symptome beobachten.' },
          { label: 'Aufmerksam beobachten', body: 'Symptome können sich erst Minuten oder Stunden später zeigen — Person nicht allein nach Hause schicken, immer ärztliche Abklärung empfehlen.' },
          { label: 'Sturzprophylaxe', body: 'Rutschige Stellen sofort kennzeichnen, Pfützen aufwischen, Hinweisschilder gut sichtbar — viele Kopfverletzungen lassen sich verhindern.' },
        ],
      },
      {
        heading: 'Praxis — Wichtiges auf einen Blick',
        items: [
          { label: 'BERUHIGEN', body: 'Ruhe ausstrahlen und Person beruhigen — Hektik überträgt sich.' },
          { label: 'BEOBACHTEN', body: 'Zustand regelmäßig prüfen — Bewusstsein, Atmung, Symptome.' },
          { label: 'KÜHLEN / ABDECKEN', body: 'Wunde abdecken, bei Schwellung kühlen — Kühlpausen einhalten.' },
          { label: '112 BEI WARNZEICHEN', body: 'Bei Verschlechterung oder Warnzeichen sofort 112.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'Kopfverletzung ernst nehmen — beobachten, beruhigen, bei Warnzeichen 112', body: 'Jeder Kopf ist wichtig — Achtsamkeit rettet Leben. Auch wenn die Person zunächst "OK" wirkt: jede Kopfverletzung ernst nehmen, beobachten, dokumentieren, bei Warnzeichen sofort 112.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/kopfverletzungen-arbeitsblatt.png',
    alt: 'Arbeitsblatt Kopfverletzungen zum Ausfüllen',
    tasks: [
      {
        id: 'warnzeichen',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Warnzeichen erkennen',
        prompt: 'Beschrifte die 8 typischen Warnzeichen einer Kopfverletzung (1–8).',
        items: [
          { number: 1, accept: ['Kopfschmerzen', 'Kopfschmerz', 'Starke Kopfschmerzen', 'Heftige Kopfschmerzen', 'Schmerzen am Kopf', 'Plötzliche Kopfschmerzen', 'Ploetzliche Kopfschmerzen'] },
          { number: 2, accept: ['Schwindel', 'Gleichgewichtsstörung', 'Gleichgewichtsstoerung', 'Benommenheit', 'Drehschwindel', 'Gangunsicherheit', 'Standunsicherheit', 'Schwindelgefühl', 'Schwindelgefuehl'] },
          { number: 3, accept: ['Übelkeit', 'Uebelkeit', 'Erbrechen', 'Übelkeit / Erbrechen', 'Uebelkeit / Erbrechen', 'Brechreiz', 'Übelkeit und Erbrechen', 'Uebelkeit und Erbrechen', 'Wiederholtes Erbrechen'] },
          { number: 4, accept: ['Blutung', 'Platzwunde', 'Blutende Wunde', 'Kopfwunde', 'Blutung / Platzwunde', 'Blutende Kopfwunde', 'Blutung am Kopf', 'Wunde am Kopf', 'Kopfplatzwunde', 'Kopfhautblutung'] },
          { number: 5, accept: ['Beule', 'Schwellung', 'Beule / Schwellung', 'Hämatom', 'Haematom', 'Bluterguss', 'Beule und Schwellung', 'Anschwellung', 'Schwellung am Kopf', 'Kopfbeule'] },
          { number: 6, accept: ['Benommenheit', 'Verwirrtheit', 'Benommenheit / Verwirrtheit', 'Verwirrt', 'Desorientierung', 'Bewusstseinsstörung', 'Bewusstseinsstoerung', 'Bewusstseinstrübung', 'Bewusstseinstruebung', 'Verwirrtheit / Benommenheit', 'Eingeschränktes Bewusstsein', 'Eingeschraenktes Bewusstsein'] },
          { number: 7, accept: ['Sehstörung', 'Sehstoerung', 'Sehstörungen', 'Sehstoerungen', 'Sehprobleme', 'Auffällige Augen', 'Auffaellige Augen', 'Sehstörung / auffällige Augen', 'Sehstoerung / auffaellige Augen', 'Pupillenauffälligkeit', 'Pupillenauffaelligkeit', 'Doppelbilder', 'Verschwommenes Sehen', 'Ungleiche Pupillen'] },
          { number: 8, accept: ['Bewusstlosigkeit', 'Starke Müdigkeit', 'Starke Muedigkeit', 'Bewusstlosigkeit / starke Müdigkeit', 'Bewusstlosigkeit / starke Muedigkeit', 'Nicht ansprechbar', 'Bewusstseinsverlust', 'Schläfrigkeit', 'Schlaefrigkeit', 'Eingeschlafen', 'Komatös', 'Komatoes'] },
        ],
      },
      {
        id: 'verhalten',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Richtiges Verhalten',
        prompt: 'Nenne sechs wichtige Maßnahmen bei Kopfverletzungen.',
        items: [
          { number: 1, accept: ['Ruhig lagern', 'Hinsetzen', 'Person ruhig lagern', 'Person ruhig lagern / hinsetzen', 'Person lagern', 'Ruhe schaffen', 'Person hinsetzen', 'Halbaufrecht lagern', 'Bequem lagern', 'Person beruhigen und lagern'] },
          { number: 2, accept: ['Beruhigen', 'Ansprechen', 'Person beruhigen', 'Beruhigen / ansprechen', 'Person beruhigen / ansprechen', 'Betreuen', 'Nicht allein lassen', 'Beruhigen und ansprechen', 'Beruhigend sprechen'] },
          { number: 3, accept: ['Kühlen', 'Kuehlen', 'Wunde abdecken', 'Kühlen / Wunde abdecken', 'Kuehlen / Wunde abdecken', 'Kühlung', 'Kuehlung', 'Kompresse', 'Kalte Kompresse', 'Wundauflage', 'Wunde versorgen', 'Wunde abdecken und kühlen', 'Wunde abdecken und kuehlen', 'Wunde abdecken / kühlen', 'Wunde abdecken / kuehlen'] },
          { number: 4, accept: ['Notruf 112', '112', '112 rufen', 'Notruf', 'Notruf 112 wählen', 'Notruf 112 waehlen', 'Rettungsdienst rufen', 'Notruf absetzen', 'Notruf 112 bei Warnzeichen', 'Bei Warnzeichen 112'] },
          { number: 5, accept: ['Nichts essen', 'Nichts trinken', 'Nichts essen oder trinken', 'Keine Nahrung', 'Keine Getränke', 'Keine Getraenke', 'Nichts zu essen oder trinken geben', 'Kein Essen oder Trinken', 'Nichts zu essen', 'Nichts zu trinken', 'Nicht essen oder trinken geben', 'Nichts essen / trinken'] },
          { number: 6, accept: ['Beobachten', 'Zustand kontrollieren', 'Beobachten / Zustand kontrollieren', 'Bewusstsein kontrollieren', 'Atmung kontrollieren', 'Zustand beobachten', 'Vitalfunktionen kontrollieren', 'Überwachen', 'Ueberwachen', 'Zustand prüfen', 'Zustand pruefen', 'Regelmäßig prüfen', 'Regelmaessig pruefen'] },
        ],
      },
      {
        id: 'begriffe',
        type: 'numbered-labels',
        title: 'Aufgabe 3: Wichtige Situationen / Begriffe',
        prompt: 'Benenne die vier wichtigen Situationen und Begriffe.',
        items: [
          { number: 1, accept: ['Platzwunde', 'Blutende Kopfwunde', 'Platzwunde / blutende Kopfwunde', 'Kopfwunde', 'Wunde', 'Kopfplatzwunde', 'Blutung am Kopf', 'Blutung', 'Schnittwunde am Kopf'] },
          { number: 2, accept: ['Kühlen', 'Kuehlen', 'Kühlung', 'Kuehlung', 'Kompresse', 'Kalte Kompresse', 'Kühlpack', 'Kuehlpack', 'Kühlkompresse', 'Kuehlkompresse', 'Kühlen mit Tuch', 'Kuehlen mit Tuch'] },
          { number: 3, accept: ['Beruhigen', 'Betreuen', 'Beruhigen / betreuen', 'Person beruhigen', 'Ansprechen', 'Beruhigen und betreuen', 'Bei der Person bleiben', 'Person nicht allein lassen', 'Begleiten', 'Trösten', 'Troesten'] },
          { number: 4, accept: ['Notruf 112', '112', 'Notruf', '112 wählen', '112 waehlen', 'Notruf 112 wählen', 'Notruf 112 waehlen', 'Rettungsdienst rufen', 'Notruf absetzen'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfragen',
        items: [
          {
            prompt: '1. Warum muss man Kopfverletzungen immer ernst nehmen?',
            keywords: ['inner', 'gehirn', 'gehirnerschütterung', 'gehirnerschuetterung', 'hirnblutung', 'sicht', 'unsichtbar', 'verschlecht', 'beobachten', 'symptom', 'spät', 'spaet', 'stunden', 'schädel', 'schaedel', 'sht', 'lebensbedrohlich', 'ernst'],
            minMatches: 3,
            sampleAnswer:
              'Weil neben sichtbaren Wunden wie Platzwunden oder Beulen auch innere Verletzungen möglich sind — etwa eine Gehirnerschütterung, eine Hirnblutung oder ein Schädel-Hirn-Trauma. Diese inneren Verletzungen sind von außen oft nicht erkennbar und können sich erst Stunden später bemerkbar machen ("Talk-and-Die"-Phänomen). Beschwerden wie Kopfschmerzen, Übelkeit oder Verwirrtheit können sich verschlechtern, deshalb muss der Zustand der Person regelmäßig kontrolliert werden — und bei Warnzeichen sofort der Notruf 112 gewählt werden.',
          },
          {
            prompt: '2. Wann sollte bei einer Kopfverletzung sofort der Notruf 112 gewählt werden?',
            keywords: ['bewusstlos', 'bewusstsein', 'erbrechen', 'wiederholt', 'kopfschmerz', 'benommenheit', 'verwirr', 'krampf', 'pupille', 'sehstörung', 'sehstoerung', 'blutung', 'atem', 'verschlecht', 'nase', 'ohr', 'flüssigkeit', 'fluessigkeit', '112', 'notruf'],
            minMatches: 3,
            sampleAnswer:
              'Sofort 112 rufen bei Bewusstlosigkeit (auch wenn nur kurz), wiederholtem Erbrechen, starken oder zunehmenden Kopfschmerzen, starker Benommenheit oder Verwirrtheit, einem Krampfanfall, Sehstörungen oder auffälligen Pupillen (z. B. ungleich groß), starker Blutung, Atemproblemen, Blut oder klarer Flüssigkeit aus Nase oder Ohr (Hinweis auf Schädelbruch) oder bei deutlicher Verschlechterung des Zustands. Im Zweifel lieber einmal zu viel als zu wenig anrufen — eine ernste Hirnverletzung kann lebensbedrohlich sein.',
          },
        ],
      },
    ],
  },
};

export default kopfverletzungen;
