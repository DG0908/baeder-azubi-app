const herzinfarkt = {
  id: 'herzinfarkt',
  title: 'Herzinfarkt',
  subtitle: 'Warnzeichen erkennen, richtig handeln und Notfälle einschätzen',
  category: 'first',
  icon: '❤️‍🔥',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/herzinfarkt-referenz.png',
    alt: 'Lernblatt Herzinfarkt mit Warnzeichen, Erste-Hilfe-Maßnahmen und Notfallkriterien',
    intro:
      'Bei einem Herzinfarkt wird ein Herzkranzgefäß plötzlich verschlossen. Der dahinterliegende Teil des Herzmuskels wird nicht mehr mit Sauerstoff versorgt und droht abzusterben. Jede Minute zählt: Ohne schnelle Hilfe drohen schwere Schäden oder der Tod. Klassische Warnzeichen sind starker Druck oder Schmerz in der Brust mit Ausstrahlung, Atemnot und kalter Schweiß. Bei Frauen, älteren Menschen und Diabetikern verläuft ein Herzinfarkt oft atypisch — mit Müdigkeit, Übelkeit oder Rückenschmerzen statt klarem Brustschmerz. Im Zweifel immer Notruf 112.',
    sections: [
      {
        heading: 'Was ist ein Herzinfarkt?',
        items: [
          { label: 'Gefäßverschluss', body: 'Ein Herzkranzgefäß (Koronararterie) wird durch ein Blutgerinnsel plötzlich verschlossen — meist auf Boden einer Arterienverkalkung.' },
          { label: 'Sauerstoffmangel', body: 'Der Bereich hinter dem Verschluss bekommt keinen Sauerstoff mehr — die Herzmuskelzellen geraten in akute Not.' },
          { label: 'Herzmuskel in Gefahr', body: 'Ohne schnelle Wiedereröffnung des Gefäßes (Lyse, Katheter) sterben Herzmuskelzellen ab. Dauer entscheidet über das Ausmaß des Schadens — "time is muscle".' },
        ],
      },
      {
        heading: 'Typische Warnzeichen',
        items: [
          { label: 'Starker Druck, Schmerz oder Enge in der Brust', body: 'Anhaltend, oft länger als 5 Minuten — wird als "Tonne auf der Brust", brennend oder einschnürend beschrieben.' },
          { label: 'Ausstrahlung', body: 'In linken Arm, Schulter, Rücken (zwischen die Schulterblätter), Hals oder Kiefer — auch in den rechten Arm möglich.' },
          { label: 'Atemnot', body: 'Plötzliche Luftnot, Person ringt nach Atem — auch in Ruhe.' },
          { label: 'Kalter Schweiß', body: 'Person ist fahl, schweißnass und kalt — typisches vegetatives Zeichen.' },
          { label: 'Übelkeit / Erbrechen', body: 'Häufig bei Hinterwandinfarkt — kann mit Magen-Darm-Beschwerden verwechselt werden.' },
          { label: 'Blässe, Schwäche, Angstgefühl', body: 'Vernichtungsangst — das Gefühl "es stirbt jemand" — ist ein klassisches Warnzeichen.' },
        ],
      },
      {
        heading: 'Atypische Symptome',
        items: [
          { label: 'Wer ist betroffen?', body: 'Besonders Frauen, ältere Menschen und Menschen mit Diabetes können einen Herzinfarkt mit unklaren oder schwachen Symptomen haben.' },
          { label: 'Oberbauchbeschwerden', body: 'Druck oder Schmerz im Oberbauch — leicht mit Magenproblemen verwechselbar.' },
          { label: 'Starke Müdigkeit', body: 'Plötzlich auftretende, ungewohnte Erschöpfung ohne klaren Grund.' },
          { label: 'Rückenschmerzen', body: 'Plötzliche Schmerzen zwischen den Schulterblättern oder im oberen Rücken.' },
          { label: 'Kurzatmigkeit', body: 'Atemnot bei leichter Belastung oder in Ruhe — ohne klassischen Brustschmerz.' },
          { label: 'Übelkeit ohne Brustschmerz', body: 'Übelkeit und Erbrechen können das einzige Symptom sein — gerade bei Frauen.' },
        ],
      },
      {
        heading: 'Erste Hilfe — richtig handeln',
        items: [
          { label: '1. Ruhe bewahren', body: 'Selbst ruhig bleiben und die Person nicht alleine lassen — Anwesenheit gibt Sicherheit.' },
          { label: '2. Sofort Notruf 112', body: 'Sofort 112 anrufen und Verdacht auf Herzinfarkt nennen — keine Zeit verlieren.' },
          { label: '3. Oberkörperhochlagerung', body: 'In bequeme, halbsitzende Position bringen — das entlastet das Herz. Bei Schwindel/Schwäche eher flach mit erhöhtem Oberkörper.' },
          { label: '4. Enge Kleidung lockern', body: 'Krawatte, Kragen, Gürtel — alles was den Brustkorb einengt, lösen.' },
          { label: '5. Beruhigen und beobachten', body: 'Person beruhigen, Atmung und Bewusstsein laufend kontrollieren — bis der Rettungsdienst da ist.' },
          { label: '6. Bei Bewusstlosigkeit', body: 'Atmung prüfen — bei keiner normalen Atmung sofort mit Wiederbelebung beginnen (Herzdruckmassage 30 : 2). AED einsetzen, wenn verfügbar.' },
        ],
      },
      {
        heading: 'Wann ist es ein Notfall? — Notruf 112',
        items: [
          { label: 'Verdacht ernst nehmen', body: 'Jeder Verdacht auf Herzinfarkt ist ein Notfall. Lieber einmal zu viel rufen.' },
          { label: 'Schmerzen länger als wenige Minuten', body: 'Brustschmerz, der mehr als 5 Minuten anhält — sofort 112.' },
          { label: 'Atemnot oder starke Verschlechterung', body: 'Sich rasch verschlechternder Zustand — sofortiger Notfall.' },
          { label: 'Bewusstseinsstörung oder Kollaps', body: 'Bewusstlosigkeit, Krampf oder Zusammenbruch — sofort 112 und ggf. Wiederbelebung.' },
        ],
      },
      {
        heading: 'Was man vermeiden sollte',
        items: [
          { label: 'Nicht warten "ob es besser wird"', body: 'Bei Herzinfarkt zählt jede Minute. Abwarten kostet Herzmuskel und Leben.' },
          { label: 'Person nicht allein lassen', body: 'Bewusstlosigkeit oder Kollaps können jederzeit eintreten — immer dabei bleiben.' },
          { label: 'Keine unnötige körperliche Belastung', body: 'Person nicht laufen oder Treppen steigen lassen — jede Anstrengung belastet das Herz zusätzlich.' },
          { label: 'Nicht selbst Auto fahren lassen', body: 'Die Person darf NICHT selbst zum Krankenhaus fahren — Bewusstlosigkeit am Steuer wäre fatal. Immer 112.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Herzinfarkt (Myokardinfarkt)', body: 'Plötzlicher Verschluss eines Herzkranzgefäßes mit Absterben von Herzmuskelgewebe.' },
          { label: 'Herzkranzgefäße (Koronararterien)', body: 'Kleine Arterien, die den Herzmuskel selbst mit Blut und Sauerstoff versorgen.' },
          { label: 'Angina pectoris', body: 'Vorübergehender Brustschmerz bei Sauerstoffmangel des Herzmuskels — Vorbote oder Begleiter eines Infarkts.' },
          { label: 'Vernichtungsangst', body: 'Typisches Angstgefühl beim Herzinfarkt — die Person hat das Gefühl, zu sterben.' },
          { label: 'Wiederbelebung (HLW)', body: 'Herz-Lungen-Wiederbelebung mit Herzdruckmassage 30 : 2 (Druckmassage : Beatmung) — bei Bewusstlosigkeit ohne normale Atmung.' },
          { label: 'AED', body: 'Automatisierter Externer Defibrillator — gibt im Notfall einen Stromstoß zur Wiederherstellung des Herzrhythmus.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Risikogruppe', body: 'Im Bad treffen wir oft auf ältere Badegäste oder Menschen mit Vorerkrankungen — Herzinfarkt-Risiko ist real.' },
          { label: 'Auslöser im Bad', body: 'Plötzliche Anstrengung, kaltes Wasser, Sauna-Wechsel — können einen Infarkt provozieren.' },
          { label: 'AED-Standort kennen', body: 'Jede Aufsichtskraft muss wissen, wo der AED hängt und wie er bedient wird.' },
          { label: 'Früh alarmieren', body: 'Beschwerden ernst nehmen, schnell Hilfe holen und den Rettungsdienst früh alarmieren — auch bei untypischen Symptomen.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'BRUSTSCHMERZ + ATEMNOT + KALTER SCHWEISS', body: 'Diese drei zusammen sind das klassische Bild — sofort 112.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/herzinfarkt-arbeitsblatt.png',
    alt: 'Arbeitsblatt Herzinfarkt zum Ausfüllen',
    tasks: [
      {
        id: 'warnzeichen',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Typische Warnzeichen erkennen',
        prompt: 'Beschrifte die 8 nummerierten Warnzeichen.',
        items: [
          { number: 1, accept: ['Brustschmerz', 'Druck in der Brust', 'Engegefühl', 'Engegefuehl', 'Brustenge', 'Schmerz in der Brust', 'Starker Druck', 'Druck oder Schmerz in der Brust'] },
          { number: 2, accept: ['Ausstrahlung in den Arm', 'Schmerzausstrahlung', 'Ausstrahlung Arm', 'Ausstrahlung in Arm Schulter', 'Armschmerz', 'Schulterschmerz', 'Ausstrahlung in Arm und Schulter'] },
          { number: 3, accept: ['Atemnot', 'Luftnot', 'Kurzatmigkeit', 'Schwere Atmung', 'Atembeschwerden'] },
          { number: 4, accept: ['Kalter Schweiß', 'Kalter Schweiss', 'Schweißausbruch', 'Schweissausbruch', 'Schwitzen', 'Kaltschweißig', 'Kaltschweissig'] },
          { number: 5, accept: ['Übelkeit', 'Uebelkeit', 'Erbrechen', 'Übelkeit und Erbrechen', 'Uebelkeit und Erbrechen', 'Brechreiz'] },
          { number: 6, accept: ['Blässe', 'Blaesse', 'Blasse Haut', 'Blass', 'Fahles Gesicht', 'Bleich'] },
          { number: 7, accept: ['Angst', 'Angstgefühl', 'Angstgefuehl', 'Vernichtungsangst', 'Unruhe', 'Innere Unruhe', 'Panik', 'Todesangst', 'Zittern'] },
          { number: 8, accept: ['Schwäche', 'Schwaeche', 'Kollaps', 'Zusammenbruch', 'Kreislaufzusammenbruch', 'Kraftlosigkeit', 'Kreislaufschwäche', 'Kreislaufschwaeche', 'Bewusstseinsstörung', 'Bewusstseinsstoerung'] },
        ],
      },
      {
        id: 'atypisch',
        type: 'open-list',
        title: 'Aufgabe 2: Atypische Symptome',
        prompt: 'Nenne fünf mögliche atypische Symptome eines Herzinfarkts (besonders bei Frauen, älteren Menschen und Diabetikern).',
        expectedCount: 5,
        pool: [
          { accept: ['Oberbauchbeschwerden', 'Oberbauchschmerz', 'Oberbauchschmerzen', 'Magenbeschwerden', 'Bauchschmerzen'] },
          { accept: ['Starke Müdigkeit', 'Starke Muedigkeit', 'Müdigkeit', 'Muedigkeit', 'Erschöpfung', 'Erschoepfung', 'Schwächegefühl', 'Schwaechegefuehl'] },
          { accept: ['Rückenschmerzen', 'Rueckenschmerzen', 'Rückenschmerz', 'Rueckenschmerz', 'Schmerzen im Rücken', 'Schmerzen im Ruecken', 'Schulterblattschmerzen'] },
          { accept: ['Kurzatmigkeit', 'Atemnot', 'Luftnot', 'Schnelle Atmung'] },
          { accept: ['Übelkeit ohne Brustschmerz', 'Uebelkeit ohne Brustschmerz', 'Übelkeit', 'Uebelkeit', 'Erbrechen', 'Übelkeit ohne starken Brustschmerz', 'Uebelkeit ohne starken Brustschmerz'] },
          { accept: ['Schwindel', 'Drehschwindel', 'Benommenheit'] },
          { accept: ['Kiefer-Schmerzen', 'Kieferschmerz', 'Kieferschmerzen', 'Schmerzen im Kiefer', 'Halsschmerzen'] },
        ],
      },
      {
        id: 'verhalten',
        type: 'numbered-labels',
        title: 'Aufgabe 3: Richtiges Verhalten',
        prompt: 'Beschrifte die 6 nummerierten Erste-Hilfe-Maßnahmen bei Verdacht auf Herzinfarkt.',
        items: [
          { number: 1, accept: ['Ruhe bewahren', 'Ruhig bleiben', 'Selbst Ruhe bewahren'] },
          { number: 2, accept: ['Person nicht allein lassen', 'Bei Person bleiben', 'Beruhigen', 'Person beruhigen', 'Nicht alleine lassen', 'Beistehen'] },
          { number: 3, accept: ['Notruf 112', '112', 'Notruf', '112 wählen', '112 waehlen', 'Sofort 112', 'Notruf absetzen', 'Rettungsdienst rufen'] },
          { number: 4, accept: ['Oberkörperhochlagerung', 'Oberkoerperhochlagerung', 'Oberkörper hochlagern', 'Oberkoerper hochlagern', 'Halbsitzende Position', 'Bequeme Position', 'Entlastende Position', 'Hochlagerung'] },
          { number: 5, accept: ['Enge Kleidung lockern', 'Kleidung lockern', 'Kleidung öffnen', 'Kleidung oeffnen', 'Kragen öffnen', 'Kragen oeffnen'] },
          { number: 6, accept: ['Beobachten', 'Person beobachten', 'Zustand beobachten', 'Zustand überwachen', 'Zustand ueberwachen', 'Atmung beobachten', 'Atmung kontrollieren', 'Bewusstsein beobachten', 'Bewusstsein kontrollieren', 'Überwachen', 'Ueberwachen', 'Vitalfunktionen kontrollieren'] },
        ],
      },
      {
        id: 'begriffe',
        type: 'labels',
        title: 'Aufgabe 4: Wichtige Begriffe',
        prompt: 'Beschrifte die Bilder mit dem passenden Begriff.',
        items: [
          { hint: 'Notrufnummer auf rotem Telefonsymbol', accept: ['Notruf 112', '112', 'Notruf', 'Rettungsdienst rufen'] },
          { hint: 'Person liegt mit erhöhtem Oberkörper auf einem Kissen', accept: ['Oberkörperhochlagerung', 'Oberkoerperhochlagerung', 'Oberkörper hochlagern', 'Oberkoerper hochlagern', 'Hochlagerung', 'Halbsitzende Position', 'Entlastende Position', 'Bequeme Position'] },
          { hint: 'Helfer beatmet die Person Mund-zu-Mund', accept: ['Beatmung', 'Mund-zu-Mund-Beatmung', 'Mund zu Mund Beatmung', 'Atemspende', 'Wiederbelebung', 'Reanimation', 'Beatmung Mund-zu-Mund'] },
          { hint: 'Helfer drückt mit beiden Händen auf den Brustkorb', accept: ['Herzdruckmassage', 'Reanimation', 'Wiederbelebung', 'HLW', 'Herz-Lungen-Wiederbelebung', 'CPR', 'Drückmassage', 'Drueckmassage', 'Druckmassage'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 5: Zusatzfragen',
        items: [
          {
            prompt: '1. Wann sollte bei Verdacht auf Herzinfarkt sofort der Notruf 112 gewählt werden?',
            keywords: ['immer', 'sofort', 'verdacht', 'brustschmerz', 'schmerz', 'minuten', 'länger', 'laenger', 'atemnot', 'verschlechter', 'bewusst', 'kollaps', 'zweifel', 'unsicher', 'kalter schweiß', 'kalter schweiss', 'früh', 'frueh'],
            minMatches: 4,
            sampleAnswer:
              'Bei jedem Verdacht auf Herzinfarkt sofort 112 — ohne abzuwarten "ob es besser wird". Konkret bei: Brustschmerz oder Druck/Engegefühl in der Brust, der länger als wenige Minuten anhält; Ausstrahlung in Arm, Schulter, Rücken, Hals oder Kiefer; Atemnot oder starker Verschlechterung; kaltem Schweiß und Übelkeit; Bewusstseinsstörung oder Kollaps. Auch bei untypischen Symptomen (Frauen, ältere Menschen, Diabetiker) und bei jedem Zweifel — lieber einmal zu früh als einmal zu spät anrufen, denn bei einem Herzinfarkt zählt jede Minute.',
          },
          {
            prompt: '2. Warum sollte die betroffene Person nicht alleine bleiben oder selbst Auto fahren?',
            keywords: ['bewusstlos', 'kollaps', 'bewusst', 'plötzlich', 'ploetzlich', 'wiederbelebung', 'reanimation', 'atmung', 'herzstillstand', 'unfall', 'gefahr', 'allein', 'fahren', 'auto', 'belastung', 'verschlechter', 'jeder zeit', 'jederzeit', 'rettungsdienst'],
            minMatches: 4,
            sampleAnswer:
              'Beim Herzinfarkt kann der Zustand jederzeit kippen — Bewusstlosigkeit, Herzstillstand oder Kollaps können plötzlich auftreten. Allein wäre keine sofortige Hilfe möglich, eine Wiederbelebung könnte nicht eingeleitet werden. Auto fahren ist besonders gefährlich: Bei Bewusstlosigkeit am Steuer drohen schwere Unfälle — für die Person selbst und andere. Außerdem belastet jede körperliche Anstrengung das ohnehin geschädigte Herz zusätzlich. Deshalb gilt: Bei der Person bleiben, beruhigen, beobachten und den Rettungsdienst zu sich kommen lassen.',
          },
        ],
      },
    ],
  },
};

export default herzinfarkt;
