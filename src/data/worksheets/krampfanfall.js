const krampfanfall = {
  id: 'krampfanfall',
  title: 'Krampfanfall',
  subtitle: 'Anzeichen erkennen, richtig handeln und Notfälle einschätzen',
  category: 'first',
  icon: '⚡',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/krampfanfall-referenz.png',
    alt: 'Lernblatt Krampfanfall mit Anzeichen, Erste-Hilfe-Maßnahmen und Notfallkriterien',
    intro:
      'Ein Krampfanfall (epileptischer Anfall) entsteht durch eine plötzliche, übermäßige elektrische Entladung von Nervenzellen im Gehirn — vergleichbar mit einem kurzen "Kurzschluss" in der Steuerzentrale. Das kann zu Kontrollverlust, Verkrampfungen, Zuckungen, eingeschränkter Wahrnehmung oder Bewusstlosigkeit führen — nicht jeder Anfall sieht gleich aus. Im Bäderbetrieb ist besonders das Risiko im Wasser zu beachten. Die wichtigsten Regeln: Ruhe bewahren, Person schützen (NICHT festhalten!), Zeit messen — und bei Warnzeichen sofort 112.',
    sections: [
      {
        heading: 'Was ist ein Krampfanfall?',
        items: [
          { label: 'Epileptischer Anfall', body: 'Plötzliche, übermäßige elektrische Entladung von Nervenzellen im Gehirn — vergleichbar mit einem Kurzschluss in der Steuerzentrale.' },
          { label: 'Vielfältige Erscheinungsformen', body: 'Nicht jeder Anfall sieht gleich aus: von kurzen "Abwesenheits-Momenten" (Absencen) bis zum großen Krampfanfall mit Sturz und Zuckungen am ganzen Körper.' },
          { label: 'Bewusstsein', body: 'Häufig kommt es zu vorübergehendem Bewusstseinsverlust oder eingeschränkter Wahrnehmung — die Person reagiert nicht oder verzögert.' },
          { label: 'Selbstbegrenzend', body: 'Die meisten Anfälle hören nach 1–2 Minuten von selbst wieder auf. Erst ab 5 Minuten oder bei Wiederholung wird es zum medizinischen Notfall (Status epilepticus).' },
        ],
      },
      {
        heading: 'Typische Anzeichen',
        items: [
          { label: 'Plötzlicher Sturz', body: 'Person fällt unkontrolliert zu Boden, ohne sich abfangen zu können — Verletzungsgefahr durch Aufprall oder umliegende Gegenstände.' },
          { label: 'Bewusstseinsverlust oder eingeschränktes Bewusstsein', body: 'Person ist nicht mehr ansprechbar oder reagiert nur eingeschränkt; manchmal nur Sekunden, manchmal mehrere Minuten.' },
          { label: 'Verkrampfung des Körpers', body: 'Plötzliches Versteifen des gesamten Körpers oder einzelner Muskelgruppen — Arme, Beine, Rücken.' },
          { label: 'Rhythmische Zuckungen', body: 'Unkontrollierte, gleichförmige Muskelzuckungen an Armen, Beinen oder im ganzen Körper.' },
          { label: 'Verdrehte Augen / leerer Blick', body: 'Augen verdrehen sich nach oben oder zur Seite, Blick wirkt leer und starr.' },
          { label: 'Speichel oder Schaum vor dem Mund', body: 'Vermehrter Speichel, manchmal blutiger Schaum (durch Zungen- oder Wangenbiss während des Anfalls).' },
          { label: 'Unregelmäßige Atmung', body: 'Atmung kann während des Anfalls flach, stockend oder kurz aussetzend sein; Lippen können sich bläulich verfärben.' },
          { label: 'Verwirrtheit oder Müdigkeit nach dem Anfall', body: 'In der "postiktalen Phase" ist die Person oft müde, verwirrt oder desorientiert — das ist normal und kann Minuten bis Stunden dauern.' },
        ],
      },
      {
        heading: 'Erste Hilfe — richtig handeln',
        items: [
          { label: '1. Ruhe bewahren und Zeit messen', body: 'Selbst Ruhe bewahren — auch wenn der Anfall dramatisch wirkt. Sofort auf die Uhr schauen oder Stoppuhr starten: Wie lange dauert der Anfall?' },
          { label: '2. Umgebung sichern', body: 'Gefährliche Gegenstände aus dem Umfeld räumen (Stühle, Tische, Glas). Person NICHT verlegen — sondern den Raum um sie herum sicher machen.' },
          { label: '3. Kopf schützen', body: 'Etwas Weiches unter den Kopf legen (Jacke, Handtuch, Tasche), damit die Person sich nicht am Boden verletzt.' },
          { label: '4. Nicht festhalten — nichts in den Mund', body: 'Die Krämpfe NICHT versuchen festzuhalten oder zu unterdrücken (Verletzungsgefahr). NIEMALS etwas zwischen die Zähne schieben — die Zunge wird NICHT verschluckt.' },
          { label: '5. Nach dem Anfall: Atmung prüfen', body: 'Wenn der Krampf vorbei ist, Atmung prüfen. Bei normaler Atmung in stabile Seitenlage bringen, beruhigend ansprechen, dabeibleiben.' },
        ],
      },
      {
        heading: 'Stabile Seitenlage',
        items: [
          { label: 'Wann?', body: 'Nach dem Anfall, wenn die Person bewusstlos ist, aber normal atmet — schützt die Atemwege vor Erbrochenem oder Speichel.' },
          { label: 'Durchführung', body: 'Person auf die Seite legen, Kopf leicht nach hinten überstrecken, Mund nach unten zeigen lassen — so kann Flüssigkeit ungehindert ablaufen.' },
          { label: 'Beobachten', body: 'Atmung kontinuierlich kontrollieren bis Rettungsdienst eintrifft oder Person wieder vollständig wach und orientiert ist.' },
        ],
      },
      {
        heading: 'Was man vermeiden sollte',
        items: [
          { label: 'Nicht festhalten', body: 'Bewegungen NICHT mit Gewalt unterdrücken — das kann zu Knochenbrüchen, Muskelverletzungen oder Verrenkungen führen.' },
          { label: 'Nichts in den Mund stecken', body: 'Keine Gegenstände, Finger oder Zungenkeile zwischen die Zähne schieben — Verletzungs- und Erstickungsgefahr. Die Zunge wird NICHT "verschluckt".' },
          { label: 'Nichts zu essen oder trinken', body: 'Solange die Person nicht vollständig wach und orientiert ist: nichts geben — Aspirationsgefahr.' },
          { label: 'Person nicht unnötig bewegen', body: 'Nicht schütteln, nicht aufrichten, nicht tragen (außer bei akuter Gefahr) — die Person bleibt auf dem Boden, bis der Anfall vorbei ist.' },
        ],
      },
      {
        heading: 'Wann wird es zum Notfall? — Notruf 112',
        items: [
          { label: 'Anfall länger als 5 Minuten', body: 'Status epilepticus — Lebensgefahr durch dauerhafte elektrische Aktivität im Gehirn. SOFORT 112.' },
          { label: 'Mehrere Anfälle hintereinander', body: 'Wenn die Person zwischen den Anfällen das Bewusstsein nicht wieder erlangt — sofort 112.' },
          { label: 'Erste bekannte Anfallssituation', body: 'Wenn keine Epilepsie bekannt ist und der Anfall erstmalig auftritt — Ursache muss ärztlich abgeklärt werden.' },
          { label: 'Verletzung beim Anfall', body: 'Sturz mit Kopfaufprall, sichtbare Wunden, Verdacht auf Knochenbruch — 112.' },
          { label: 'Atemprobleme nach dem Anfall', body: 'Wenn die Atmung nach Anfallsende nicht innerhalb weniger Minuten zur Ruhe kommt oder aussetzt.' },
          { label: 'Anfall im Wasser', body: 'Im Bad IMMER Notfall — Person sofort aus dem Wasser holen, 112 rufen, ggf. HLW beginnen.' },
          { label: 'Schwangerschaft', body: 'Anfall in der Schwangerschaft kann auch ein Hinweis auf Eklampsie sein — immer Notfall.' },
          { label: 'Diabetes', body: 'Krampf bei bekannter Diabetes-Erkrankung kann auf Unterzuckerung hindeuten — sofort 112.' },
          { label: 'Unsicherheit', body: 'Im Zweifel IMMER 112 — lieber einmal zu viel als zu wenig anrufen.' },
        ],
      },
      {
        heading: 'Nach dem Anfall',
        items: [
          { label: 'Postiktale Phase', body: 'Nach dem Anfall ist die Person oft müde, verwirrt, desorientiert oder schlafbedürftig — das ist normal und kann Minuten bis Stunden dauern.' },
          { label: 'Ruhig ansprechen', body: 'Beruhigend mit der Person sprechen, Orientierung geben (wer du bist, was passiert ist, dass alles in Ordnung ist), nicht überfordern.' },
          { label: 'Dabeibleiben', body: 'Person nicht alleine lassen, bis sie wieder vollständig wach und orientiert ist.' },
          { label: 'Privatsphäre schützen', body: 'Schaulustige fernhalten, Person zudecken, ggf. nach einem Einnässen unauffällig helfen — Würde der Person wahren.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Epilepsie', body: 'Chronische Erkrankung mit wiederkehrenden Krampfanfällen — entsteht durch übermäßige elektrische Aktivität von Nervenzellen.' },
          { label: 'Status epilepticus', body: 'Krampfanfall, der länger als 5 Minuten dauert oder ohne Bewusstseinsrückkehr in den nächsten Anfall übergeht — lebensbedrohlich, sofort 112.' },
          { label: 'Postiktale Phase', body: 'Erholungsphase NACH dem Anfall — Person ist müde, verwirrt, manchmal benommen.' },
          { label: 'Aura', body: 'Vorgefühl, das einen Anfall ankündigen kann — ungewöhnliche Gerüche, Sehphänomene, Déjà-vu, Übelkeit.' },
          { label: 'Stabile Seitenlage', body: 'Lagerung bei bewusstloser Person mit erhaltener Atmung — schützt vor Aspiration.' },
          { label: 'Fieberkrampf', body: 'Krampfanfall im Rahmen hohen Fiebers, vor allem bei Kleinkindern — meist harmlos, aber beim ersten Mal Notruf.' },
          { label: 'Absence', body: 'Sehr kurzer Anfallstyp ohne Sturz — Person wirkt nur kurz "geistig abwesend", reagiert nicht. Häufig bei Kindern.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Anfall im Wasser ist immer 112', body: 'Erst Person aus dem Wasser bergen (Eigenschutz beachten!), dann an Land lagern, Atmung prüfen, ggf. HLW. Notruf parallel.' },
          { label: 'Sicherheit zuerst', body: 'Bevor du die Person berührst: Eigenschutz prüfen — kein Glas, kein nasser Boden, sichere Position.' },
          { label: 'Beobachten und Zeit messen', body: 'Dauer notieren — wichtige Information für Rettungsdienst und Klinik.' },
          { label: 'Beruhigend wirken', body: 'Andere Gäste auf Abstand halten, Person Privatsphäre lassen, Helferteam koordinieren.' },
          { label: 'Notruf bei Warnzeichen', body: '> 5 Min, Wiederholung, Wasser, Verletzung, Atemprobleme, erste bekannte Anfallssituation — sofort 112.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'SCHÜTZEN — ZEIT MESSEN — ATMUNG PRÜFEN — 112 BEI WARNZEICHEN', body: 'Vier Schritte. Person schützen, Anfallsdauer messen, nach dem Anfall Atmung prüfen — bei Warnzeichen sofort 112.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/krampfanfall-arbeitsblatt.png',
    alt: 'Arbeitsblatt Krampfanfall zum Ausfüllen',
    tasks: [
      {
        id: 'anzeichen',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Typische Anzeichen erkennen',
        prompt: 'Beschrifte die 8 typischen Anzeichen eines Krampfanfalls.',
        items: [
          { number: 1, accept: ['Verkrampfung', 'Verkrampfung des Körpers', 'Verkrampfung des Koerpers', 'Muskelverkrampfung', 'Versteifung', 'Körperverkrampfung', 'Koerperverkrampfung', 'Krampf'] },
          { number: 2, accept: ['Bewusstlosigkeit', 'Bewusstseinsverlust', 'Eingeschränktes Bewusstsein', 'Eingeschraenktes Bewusstsein', 'Bewusstseinsverlust / eingeschränktes Bewusstsein', 'Bewusstseinsverlust / eingeschraenktes Bewusstsein', 'Kein Bewusstsein', 'Bewusstseinstrübung', 'Bewusstseinstruebung'] },
          { number: 3, accept: ['Sturz', 'Plötzlicher Sturz', 'Ploetzlicher Sturz', 'Sturz / unkontrollierte Körperlage', 'Sturz / unkontrollierte Koerperlage', 'Unkontrollierter Sturz', 'Hinfallen', 'Person fällt', 'Person faellt', 'Unkontrollierte Körperlage', 'Unkontrollierte Koerperlage'] },
          { number: 4, accept: ['Rhythmische Zuckungen', 'Muskelzuckungen', 'Zuckungen', 'Rhythmische Muskelzuckungen', 'Krämpfe', 'Kraempfe', 'Krampfen', 'Konvulsionen'] },
          { number: 5, accept: ['Verdrehte Augen', 'Leerer Blick', 'Verdrehte Augen / leerer Blick', 'Augen verdreht', 'Starre Augen', 'Augen nach oben verdreht', 'Augenverdrehen', 'Blick leer', 'Blickkrampf'] },
          { number: 6, accept: ['Speichel', 'Schaum vor dem Mund', 'Speichel / Schaum vor dem Mund', 'Schaum', 'Mundschaum', 'Speichelfluss', 'Vermehrter Speichel', 'Schaumiger Speichel'] },
          { number: 7, accept: ['Unregelmäßige Atmung', 'Unregelmaessige Atmung', 'Atemprobleme', 'Atemstörung', 'Atemstoerung', 'Atemnot', 'Flache Atmung', 'Stockende Atmung', 'Atemaussetzer', 'Unregelmäßiges Atmen', 'Unregelmaessiges Atmen'] },
          { number: 8, accept: ['Zuckungen', 'Verkrampfte Hand', 'Muskelzuckungen', 'Armzuckungen', 'Hand zuckt', 'Verkrampfte Finger', 'Hand verkrampft', 'Krämpfe Hand', 'Kraempfe Hand', 'Zuckende Hand', 'Zuckungen Arm', 'Zuckungen Hand', 'Zuckungen Hand oder Arm', 'Hand- oder Armzuckungen'] },
        ],
      },
      {
        id: 'verhalten',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Richtiges Verhalten',
        prompt: 'Beschrifte die 6 nummerierten Erste-Hilfe-Maßnahmen bei einem Krampfanfall.',
        items: [
          { number: 1, accept: ['Zeit messen', 'Anfallsdauer messen', 'Anfallsdauer beobachten', 'Stoppuhr', 'Zeit nehmen', 'Dauer messen', 'Anfallszeit messen', 'Uhrzeit notieren', 'Stoppuhr starten', 'Zeit messen / Anfallsdauer beobachten'] },
          { number: 2, accept: ['Umgebung sichern', 'Gefährliche Gegenstände entfernen', 'Gefaehrliche Gegenstaende entfernen', 'Umgebung sichern / gefährliche Gegenstände entfernen', 'Umgebung sichern / gefaehrliche Gegenstaende entfernen', 'Gefahrenquellen entfernen', 'Sicherheit schaffen', 'Gegenstände wegräumen', 'Gegenstaende wegraeumen', 'Raum sichern'] },
          { number: 3, accept: ['Kopf schützen', 'Kopf schuetzen', 'Kopf polstern', 'Kopf abpolstern', 'Kopf weich lagern', 'Polster unter den Kopf', 'Kopf mit Jacke schützen', 'Kopf mit Jacke schuetzen', 'Kopfschutz', 'Kopf schützen / polstern', 'Kopf schuetzen / polstern'] },
          { number: 4, accept: ['Nichts in den Mund stecken', 'Nichts in Mund', 'Mund freihalten', 'Mund nicht öffnen', 'Mund nicht oeffnen', 'Nicht in den Mund', 'Keine Gegenstände in den Mund', 'Keine Gegenstaende in den Mund', 'Nichts zwischen die Zähne', 'Nichts zwischen die Zaehne', 'Nichts in den Mund schieben'] },
          { number: 5, accept: ['Atmung prüfen', 'Atmung pruefen', 'Atmung kontrollieren', 'Atemkontrolle', 'Nach dem Anfall Atmung prüfen', 'Nach dem Anfall Atmung pruefen', 'Atmung beobachten', 'Atmung prüfen / nach dem Anfall kontrollieren', 'Atmung pruefen / nach dem Anfall kontrollieren'] },
          { number: 6, accept: ['Stabile Seitenlage', 'Seitenlage', 'Person in Seitenlage', 'In Seitenlage bringen', 'Stabile Lage', 'Stabile Seitenlage nach dem Anfall'] },
        ],
      },
      {
        id: 'begriffe',
        type: 'numbered-labels',
        title: 'Aufgabe 3: Wichtige Situationen / Begriffe',
        prompt: 'Benenne die vier wichtigen Situationen und Begriffe.',
        items: [
          { number: 1, accept: ['Zeit messen', 'Anfallsdauer messen', 'Stoppuhr', 'Zeit nehmen', 'Dauer messen', 'Anfallszeit', 'Anfallsdauer beobachten', 'Anfallszeit messen'] },
          { number: 2, accept: ['Stabile Seitenlage', 'Seitenlage', 'Stabile Lage', 'Person in Seitenlage', 'In Seitenlage bringen'] },
          { number: 3, accept: ['Nichts in den Mund stecken', 'Nichts in Mund', 'Mund freihalten', 'Keine Gegenstände in den Mund', 'Keine Gegenstaende in den Mund', 'Nicht in den Mund', 'Nichts zwischen die Zähne', 'Nichts zwischen die Zaehne'] },
          { number: 4, accept: ['Notruf 112', '112', 'Notruf', '112 wählen', '112 waehlen', 'Notruf absetzen', 'Rettungsdienst rufen', 'Notruf 112 wählen', 'Notruf 112 waehlen'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfragen',
        items: [
          {
            prompt: '1. Was ist bei einem Krampfanfall als Erstes wichtig?',
            keywords: ['ruhe', 'eigenschutz', 'sicher', 'umgebung', 'gegenstände', 'gegenstaende', 'gefahr', 'verletz', 'festhalten', 'mund', 'kopf', 'schützen', 'schuetzen', 'beobachten', 'zeit', 'dauer', 'stoppuhr'],
            minMatches: 4,
            sampleAnswer:
              'Als Erstes ist Ruhe bewahren wichtig — auch wenn der Anfall dramatisch wirkt. Dann gilt: Eigenschutz beachten und die Umgebung sichern, gefährliche Gegenstände wegräumen, damit sich die Person nicht verletzt. Den Kopf weich lagern (Jacke, Handtuch). Die Person NICHT festhalten und NICHTS in den Mund stecken — das verursacht nur zusätzliche Verletzungen. Parallel auf die Uhr schauen und die Anfallsdauer messen, weil diese Information für den Rettungsdienst entscheidend ist.',
          },
          {
            prompt: '2. Wann sollte der Notruf 112 gewählt werden?',
            keywords: ['5 minuten', 'fünf minuten', 'fuenf minuten', 'minuten', 'mehrere', 'wiederhol', 'erstmal', 'erste', 'unbekannt', 'verletz', 'atemproblem', 'wasser', 'schwanger', 'diabetes', 'unsicher', 'warnzeichen', 'notruf', '112', 'status'],
            minMatches: 4,
            sampleAnswer:
              'Sofort 112 rufen bei: Anfall länger als 5 Minuten (Status epilepticus), mehreren Anfällen hintereinander ohne vollständige Erholung dazwischen, erstmaligem oder unbekanntem Anfall, Verletzungen während des Anfalls, Atemproblemen nach dem Anfall, Anfall im Wasser, Schwangerschaft oder Diabetes der betroffenen Person — sowie generell bei Unsicherheit. Ein Anfall über 5 Minuten beziehungsweise mehrere Anfälle ohne vollständige Erholung gelten als neurologischer Notfall.',
          },
        ],
      },
    ],
  },
};

export default krampfanfall;
