const hyperventilation = {
  id: 'hyperventilation',
  title: 'Hyperventilation',
  subtitle: 'Symptome erkennen, richtig handeln und Notfälle einschätzen',
  category: 'first',
  icon: '🫁',
  estimatedMinutes: 18,
  reference: {
    image: '/worksheets/hyperventilation-referenz.png',
    alt: 'Lernblatt Hyperventilation mit allen Symptomen, Erste-Hilfe-Maßnahmen und Notfallkriterien',
    intro:
      'Hyperventilation bedeutet zu schnelles oder zu tiefes Atmen. Dabei wird zu viel CO₂ aus dem Blut abgeatmet — der CO₂-Spiegel sinkt. Typische Folgen sind Kribbeln in Händen und Lippen, Schwindel, Herzklopfen und ein Engegefühl in der Brust. Im Bäderbetrieb tritt Hyperventilation häufig nach Aufregung, Angst oder Stress auf — etwa bei Badegästen, die sich überfordert fühlen. Sie wirkt bedrohlich, ist aber meist stressbedingt und gut beherrschbar. Wichtig ist, ruhig zu bleiben, langsam mit der Atmung anzuleiten und gefährliche Ursachen auszuschließen.',
    sections: [
      {
        heading: 'Was passiert im Körper?',
        items: [
          { label: 'Zu schnelles Atmen', body: 'Atemfrequenz und Atemtiefe sind deutlich erhöht — oft als Reaktion auf Angst, Panik oder Stress.' },
          { label: 'Weniger CO₂ im Blut', body: 'Mit jedem Atemzug wird Kohlendioxid abgeatmet — bei zu schneller Atmung sinkt der CO₂-Spiegel im Blut.' },
          { label: 'Folgen / Symptome', body: 'Der niedrige CO₂-Spiegel verändert das Säure-Basen-Gleichgewicht und löst Symptome wie Kribbeln, Schwindel und Engegefühl aus.' },
        ],
      },
      {
        heading: 'Typische Symptome',
        items: [
          { label: 'Schnelle Atmung', body: 'Sehr hohe Atemfrequenz, oft mit deutlich sichtbarer Brustkorb-Bewegung.' },
          { label: 'Atemnotgefühl', body: 'Die Person hat das Gefühl, nicht genug Luft zu bekommen — obwohl objektiv genug Sauerstoff im Blut ist.' },
          { label: 'Schwindel', body: 'Durch den niedrigen CO₂-Spiegel verengen sich die Hirngefäße — das führt zu Schwindel.' },
          { label: 'Kribbeln in Händen und Lippen', body: 'Typisches Zeichen — beginnt meist an Fingerspitzen und Mundbereich.' },
          { label: 'Herzklopfen', body: 'Der Puls ist erhöht, das Herz schlägt spürbar schneller und kräftiger.' },
          { label: 'Brustenge', body: 'Druck- oder Engegefühl in der Brust, oft begleitet von Angst.' },
          { label: 'Unruhe / Angst', body: 'Die Person wirkt panisch oder ängstlich — die Mimik ist angespannt.' },
          { label: 'Verkrampfte Hände (Pfötchenstellung)', body: 'Bei längerer Hyperventilation krampfen Hände und manchmal Füße — typische "Pfötchenstellung" der Finger.' },
        ],
      },
      {
        heading: 'Mögliche Auslöser',
        items: [
          { label: 'Angst / Panik', body: 'Häufigste Ursache — z. B. Wasserangst, Höhenangst, Gruppensituation.' },
          { label: 'Stress', body: 'Akute oder chronische Belastung kann das Atemmuster verändern.' },
          { label: 'Schmerzen', body: 'Starke Schmerzen führen reflexartig zu schneller Atmung.' },
          { label: 'Starke Aufregung', body: 'Streit, freudige Erregung, Konflikt — alles kann eine Hyperventilation auslösen.' },
          { label: 'Körperliche Belastung', body: 'Ungewohnte Anstrengung — wenn die Atmung den Sauerstoffbedarf nicht mehr trifft.' },
          { label: 'Wichtig', body: 'Ähnliche Beschwerden können auch ernste Ursachen haben (Asthma, Herzproblem, Allergie). Im Zweifel ärztliche Hilfe.' },
        ],
      },
      {
        heading: 'Erste Hilfe — richtig handeln',
        items: [
          { label: '1. Ruhe bewahren', body: 'Selbst ruhig bleiben und bei der Person bleiben — deine Ruhe überträgt sich.' },
          { label: '2. Beruhigend sprechen, sichere Position', body: 'Klar und ruhig sprechen, in eine sichere, bequeme Position bringen (sitzen, anlehnen).' },
          { label: '3. Langsame Atmung anleiten', body: 'Vormachen und mitatmen lassen — z. B. 4 Sekunden einatmen, 6 Sekunden ausatmen. Das verlängerte Ausatmen ist entscheidend.' },
          { label: '4. Reize reduzieren', body: 'Enge Kleidung lockern, Schaulustige wegschicken, ruhigen Ort suchen.' },
          { label: '5. Beobachten', body: 'Tritt Besserung ein? Wenn nicht oder bei Unsicherheit → ärztliche Hilfe holen.' },
        ],
      },
      {
        heading: 'Was man vermeiden sollte',
        items: [
          { label: 'Nicht alleine lassen', body: 'Die Angst verstärkt sich, wenn die Person sich allein gelassen fühlt.' },
          { label: 'Nicht zusätzlich in Panik versetzen', body: 'Keine hektischen Sätze, keine dramatischen Aussagen ("Du musst sofort …").' },
          { label: 'Nicht zu schneller Belastung auffordern', body: 'Nicht "lauf herum" oder "beweg dich" — Ruhe ist erste Maßnahme.' },
          { label: 'Nicht ungeprüft in eine Tüte atmen lassen', body: 'Tütenatmung kann gefährlich sein und zu Sauerstoffmangel führen — vor allem bei nicht erkanntem Asthma, Herzproblem oder Allergie. Heute nicht mehr empfohlen.' },
        ],
      },
      {
        heading: 'Wann wird es zum Notfall? — Notruf 112',
        items: [
          { label: 'Bewusstseinsstörung oder Ohnmacht', body: 'Person reagiert nicht mehr klar oder wird ohnmächtig.' },
          { label: 'Anhaltender, starker Brustschmerz', body: 'Druck oder Schmerz in der Brust, der nicht nachlässt — Verdacht auf Herzproblem.' },
          { label: 'Blauverfärbung von Lippen oder Haut', body: 'Zyanose — deutliches Zeichen für Sauerstoffmangel.' },
          { label: 'Deutliche Luftnot, die nicht besser wird', body: 'Trotz Beruhigung und Atemanleitung keine Besserung.' },
          { label: 'Krampfanfall', body: 'Krampfanfall während oder nach der Hyperventilation.' },
          { label: 'Erstmaliger oder unklarer Verlauf', body: 'Erste Episode oder ungewöhnlich starkes Bild — ärztliche Abklärung nötig.' },
          { label: 'Verdacht auf Asthma, Herz, Allergie', body: 'Bekannte Vorerkrankung oder Hinweis auf Allergen-Kontakt — sofort 112.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'Langsamer atmen, beruhigen, beobachten', body: 'Drei Schritte — und bei Unsicherheit immer Notruf 112.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Häufige Situation', body: 'Hyperventilation tritt im Bad häufig auf — Wasserangst, Aufregung beim Schwimmunterricht, nach Streit oder Schreck.' },
          { label: 'Deine Aufgabe', body: 'Zuerst beruhigen, sichere Position schaffen, langsam atmen anleiten — dann ernsthafte Ursachen ausschließen.' },
          { label: 'Reize reduzieren', body: 'Person aus dem Trubel führen (Ruheraum, Schatten), Schaulustige wegschicken — die Umgebung beeinflusst die Atmung stark.' },
          { label: 'Im Zweifel 112', body: 'Lieber einmal zu viel als einmal zu wenig — bei jedem Verdacht auf ernste Ursache sofort Notruf.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/hyperventilation-arbeitsblatt.png',
    alt: 'Arbeitsblatt Hyperventilation zum Ausfüllen',
    tasks: [
      {
        id: 'symptome',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Typische Symptome erkennen',
        prompt: 'Beschrifte die 8 nummerierten Symptome.',
        items: [
          { number: 1, accept: ['Schnelle Atmung', 'Angestrengte Atmung', 'Hyperventilation', 'Schnelle angestrengte Atmung', 'Atemnotgefühl', 'Atemnotgefuehl', 'Sichtbare Atembewegungen'] },
          { number: 2, accept: ['Brustenge', 'Engegefühl', 'Engegefuehl', 'Druckgefühl', 'Druckgefuehl', 'Engegefühl in der Brust', 'Engegefuehl in der Brust', 'Hand auf Brust'] },
          { number: 3, accept: ['Schwindel', 'Benommenheit', 'Drehschwindel'] },
          { number: 4, accept: ['Ängstliche Mimik', 'Aengstliche Mimik', 'Angst', 'Unruhe', 'Panik', 'Angst und Unruhe'] },
          { number: 5, accept: ['Kribbeln Lippen', 'Kribbeln in den Lippen', 'Kribbeln im Mund', 'Taubheitsgefühl Lippen', 'Taubheitsgefuehl Lippen', 'Lippenkribbeln'] },
          { number: 6, accept: ['Herzklopfen', 'Herzrasen', 'Schneller Puls', 'Erhöhter Puls', 'Erhoehter Puls', 'Tachykardie'] },
          { number: 7, accept: ['Verkrampfte Hände', 'Verkrampfte Haende', 'Pfötchenstellung', 'Pfoetchenstellung', 'Krampf der Hände', 'Krampf der Haende', 'Krämpfe', 'Kraempfe', 'Kribbeln in den Händen', 'Kribbeln in den Haenden'] },
          { number: 8, accept: ['Zittern', 'Schwäche', 'Schwaeche', 'Schwächegefühl', 'Schwaechegefuehl', 'Unsicherheit', 'Körperliche Unruhe', 'Koerperliche Unruhe', 'Zittrigkeit', 'Zittern und Schwäche', 'Zittern und Schwaeche'] },
        ],
      },
      {
        id: 'verhalten',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Richtiges Verhalten',
        prompt: 'Beschrifte die 6 nummerierten Erste-Hilfe-Schritte.',
        items: [
          { number: 1, accept: ['Ruhe bewahren', 'Ruhig bleiben', 'Selbst ruhig bleiben', 'Cool bleiben', 'Nicht in Panik geraten'] },
          { number: 2, accept: ['Bei der Person bleiben', 'Person nicht alleine lassen', 'Nähe geben', 'Naehe geben', 'Da sein', 'Hand auf Schulter', 'Beruhigend nahe sein'] },
          { number: 3, accept: ['Beruhigend sprechen', 'Ruhig sprechen', 'Mit der Person sprechen', 'Klar und ruhig sprechen', 'Beruhigen', 'Zuspruch'] },
          { number: 4, accept: ['Sichere Position', 'Bequeme Position', 'In sichere Position bringen', 'In bequeme Position bringen', 'Hinsetzen', 'Sitzposition', 'Anlehnen lassen'] },
          { number: 5, accept: ['Langsame Atmung anleiten', 'Atmung anleiten', 'Langsam atmen', 'Atemanleitung', 'Mitatmen lassen', '4 Sekunden ein 6 Sekunden aus', 'Bewusst atmen'] },
          { number: 6, accept: ['Reize reduzieren', 'Enge Kleidung lockern', 'Kleidung lockern', 'Schaulustige wegschicken', 'Handy weg', 'Ruhigen Ort suchen', 'Reizüberflutung vermeiden', 'Reizueberflutung vermeiden'] },
        ],
      },
      {
        id: 'situationen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Situationen / Begriffe',
        prompt: 'Benenne die abgebildeten Situationen.',
        items: [
          { hint: 'Helfer beruhigt die betroffene Person', accept: ['Beruhigen', 'Beruhigend sprechen', 'Ruhe geben', 'Ruhe vermitteln', 'Person beruhigen'] },
          { hint: 'Verkrampfte Hand mit gekrümmten Fingern', accept: ['Pfötchenstellung', 'Pfoetchenstellung', 'Verkrampfte Hand', 'Handkrampf', 'Krampf der Hand', 'Karpopedalspasmus'] },
          { hint: 'Helfer leitet die Atmung an', accept: ['Atemanleitung', 'Langsame Atmung anleiten', 'Atmung anleiten', 'Mitatmen', '4-6-Atmung', 'Atemtechnik'] },
          { hint: 'Notrufnummer auf rotem Schild', accept: ['Notruf 112', '112', 'Notruf', 'Rettungsdienst rufen', 'Notruf wählen', 'Notruf waehlen'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfragen',
        items: [
          {
            prompt: '1. Wie hilft man einer hyperventilierenden Person richtig?',
            keywords: ['ruhe', 'beruhig', 'ruhig', 'bleiben', 'sprechen', 'position', 'sitzen', 'atmung', 'atmen', 'langsam', 'anleit', '4', '6', 'sekunden', 'kleidung', 'lockern', 'reize', 'beobachten', 'zuspruch'],
            minMatches: 4,
            sampleAnswer:
              'Zuerst selbst Ruhe bewahren und bei der Person bleiben. Beruhigend sprechen und in eine sichere, bequeme Position bringen (am besten hinsetzen lassen, anlehnen). Dann eine langsame Atmung anleiten — z. B. 4 Sekunden einatmen, 6 Sekunden ausatmen — und dabei selbst mitatmen. Enge Kleidung lockern, Reize reduzieren (Schaulustige wegschicken, Handy weg, ruhiger Ort). Anschließend beobachten, ob Besserung eintritt. Wichtig: NICHT in eine Tüte atmen lassen — bei Unsicherheit oder ausbleibender Besserung ärztliche Hilfe holen.',
          },
          {
            prompt: '2. Wann sollte bei Hyperventilation der Notruf 112 gewählt werden?',
            keywords: ['bewusst', 'ohnmacht', 'brustschmerz', 'schmerz', 'blau', 'lippen', 'haut', 'zyanose', 'luftnot', 'krampf', 'krampfanfall', 'erstmal', 'unklar', 'asthma', 'herz', 'allerg', 'unsicher', 'keine besserung', 'nicht besser'],
            minMatches: 4,
            sampleAnswer:
              'Notruf 112 immer dann, wenn ernste Ursachen nicht ausgeschlossen werden können oder die Person sich nicht stabilisiert: bei Bewusstseinsstörung oder Ohnmacht, anhaltendem starken Brustschmerz, Blauverfärbung von Lippen oder Haut (Zyanose), deutlicher Luftnot ohne Besserung, einem Krampfanfall, einem erstmaligen oder unklaren Verlauf sowie bei Verdacht auf Asthma, Herzproblem oder Allergie (z. B. nach Kontakt mit Allergenen). Grundsatz: Im Zweifel lieber einmal zu viel anrufen als einmal zu wenig.',
          },
        ],
      },
    ],
  },
};

export default hyperventilation;
