const dasHerz = {
  id: 'das-herz',
  title: 'Das menschliche Herz',
  subtitle: 'Aufbau, Funktionen und Blutkreislauf',
  category: 'health',
  icon: '❤️',
  estimatedMinutes: 18,
  reference: {
    image: '/worksheets/das-herz-referenz.png',
    alt: 'Lernblatt Das menschliche Herz mit allen Beschriftungen',
    intro:
      'Das Herz ist die Pumpe des Körpers. Es versorgt alle Organe mit sauerstoff- und nährstoffreichem Blut und treibt zwei getrennte Kreisläufe an: den Lungenkreislauf (Blut holt sich Sauerstoff) und den Körperkreislauf (Blut gibt Sauerstoff ab). Es schlägt ununterbrochen Tag und Nacht.',
    sections: [
      {
        heading: 'Was macht das Herz?',
        items: [
          { label: 'Pumpe', body: 'Pumpt Blut durch den Körper.' },
          { label: 'Sauerstoff & Nährstoffe', body: 'Versorgt Organe mit Sauerstoff und Nährstoffen.' },
          { label: 'Entsorgung', body: 'Transportiert Kohlendioxid und Stoffwechselprodukte ab.' },
          { label: 'Blutdruck', body: 'Hält den Blutdruck aufrecht.' },
          { label: 'Daueraufgabe', body: 'Arbeitet ununterbrochen Tag und Nacht.' },
        ],
      },
      {
        heading: 'Funktionen',
        items: [
          { label: 'Sauerstoffversorgung', body: 'Bringt Sauerstoff zu allen Zellen des Körpers.' },
          { label: 'Stofftransport', body: 'Transportiert Nährstoffe, Hormone und wichtige Substanzen.' },
          { label: 'Abtransport von CO₂', body: 'Entsorgt Kohlendioxid und Stoffwechselprodukte.' },
          { label: 'Blutdruck / Kreislauferhaltung', body: 'Sorgt für den nötigen Druck, damit das Blut fließt.' },
          { label: 'Zwei Kreisläufe', body: 'Trennung von Lungen- und Körperkreislauf.' },
          { label: 'Anpassung an Belastung', body: 'Schnellerer Puls bei Aktivität, mehr Leistung bei Bedarf.' },
        ],
      },
      {
        heading: 'Der Blutweg',
        items: [
          { label: 'Reihenfolge', body: 'Körper → obere/untere Hohlvene → rechter Vorhof → rechte Kammer → Lungenarterie → Lunge → Lungenvenen → linker Vorhof → linke Kammer → Aorta → Körper.' },
          { label: 'Farbcode', body: 'Blau = sauerstoffarm, Rot = sauerstoffreich.' },
        ],
      },
      {
        heading: 'Herzkreisläufe',
        items: [
          { label: 'Lungenkreislauf (kleiner Kreislauf)', body: 'Sauerstoffarmes Blut wird zur Lunge gepumpt, gibt CO₂ ab und nimmt Sauerstoff auf.' },
          { label: 'Körperkreislauf (großer Kreislauf)', body: 'Sauerstoffreiches Blut wird in den Körper gepumpt und versorgt alle Organe und Zellen.' },
        ],
      },
      {
        heading: 'So arbeitet das Herz',
        items: [
          { label: 'Diastole (Füllungsphase)', body: 'Das Herz entspannt sich. Die Kammern füllen sich mit Blut.' },
          { label: 'Systole (Austreibungsphase)', body: 'Das Herz zieht sich zusammen und pumpt Blut weiter.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Herzklappen', body: 'Verhindern den Rückfluss des Blutes und sorgen für die richtige Flussrichtung.' },
          { label: 'Aorta', body: 'Die größte Schlagader — leitet das Blut vom Herz in den Körper.' },
          { label: 'Hohlvene', body: 'Große Venen, die das Blut aus dem Körper zum Herz zurückführen.' },
          { label: 'Lungenarterie', body: 'Transportiert sauerstoffarmes Blut vom Herz zur Lunge.' },
          { label: 'Lungenvene', body: 'Bringt das sauerstoffreiche Blut von der Lunge zum Herz.' },
          { label: 'Herzmuskel (Myokard)', body: 'Starke Muskelschicht, die sich zusammenzieht und pumpt.' },
          { label: 'Puls', body: 'Die spürbare Schlagwelle in den Arterien bei jedem Herzschlag.' },
        ],
      },
      {
        heading: 'Wusstest du?',
        items: [
          { label: 'Herzfrequenz', body: 'Das Herz schlägt in Ruhe etwa 60–80 Mal pro Minute.' },
          { label: 'Pro Tag', body: 'Ungefähr 100.000 Schläge und mehrere tausend Liter Blut.' },
          { label: 'Linke Herzkammer', body: 'Hat eine besonders kräftige Muskelwand, weil sie den gesamten Körperkreislauf versorgt.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/das-herz-arbeitsblatt.png',
    alt: 'Arbeitsblatt Das menschliche Herz zum Ausfüllen',
    tasks: [
      {
        id: 'aufbau',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Aufbau des Herzens',
        prompt: 'Beschrifte die 12 nummerierten Strukturen.',
        items: [
          { number: 1, accept: ['Aorta', 'Hauptschlagader'] },
          { number: 2, accept: ['Obere Hohlvene', 'Vena cava superior'] },
          { number: 3, accept: ['Untere Hohlvene', 'Vena cava inferior'] },
          { number: 4, accept: ['Rechte Vorkammer', 'Rechter Vorhof', 'Atrium dextrum'] },
          { number: 5, accept: ['Rechte Herzkammer', 'Rechter Ventrikel', 'Ventriculus dexter'] },
          { number: 6, accept: ['Linke Herzkammer', 'Linker Ventrikel', 'Ventriculus sinister'] },
          { number: 7, accept: ['Lungenvenen', 'Lungenvene', 'Vv. pulmonales'] },
          { number: 8, accept: ['Lungenarterie', 'Pulmonalarterie', 'A. pulmonalis', 'Lungenschlagader'] },
          { number: 9, accept: ['Linke Vorkammer', 'Linker Vorhof', 'Atrium sinistrum'] },
          { number: 10, accept: ['Trikuspidalklappe', 'Trikuspidalis', 'Dreizipfelklappe'] },
          { number: 11, accept: ['Mitralklappe', 'Bikuspidalklappe', 'Zweizipfelklappe'] },
          { number: 12, accept: ['Herzscheidewand', 'Scheidewand', 'Septum', 'Kammerscheidewand'] },
        ],
      },
      {
        id: 'funktionen',
        type: 'open-list',
        title: 'Aufgabe 2: Funktionen des Herzens',
        prompt: 'Nenne sechs wichtige Funktionen oder Aufgaben.',
        expectedCount: 6,
        pool: [
          { accept: ['Sauerstoffversorgung', 'Sauerstoff zu den Zellen', 'O2-Versorgung'] },
          { accept: ['Stofftransport', 'Nährstofftransport', 'Transport von Nährstoffen', 'Nährstoffe Hormone'] },
          { accept: ['Abtransport von CO2', 'CO2-Abtransport', 'Kohlendioxid abtransportieren', 'Entsorgung von Stoffwechselprodukten'] },
          { accept: ['Blutdruck', 'Kreislauferhaltung', 'Blutdruck aufrechterhalten', 'Druck erzeugen'] },
          { accept: ['Zwei Kreisläufe', 'Lungenkreislauf und Körperkreislauf', 'Versorgung Lunge und Körper', 'Kreisläufe trennen'] },
          { accept: ['Anpassung an Belastung', 'Belastungsanpassung', 'Schnellerer Puls', 'Leistungsanpassung'] },
        ],
      },
      {
        id: 'strukturen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Strukturen',
        prompt: 'Beschrifte die vier Abbildungen.',
        items: [
          { hint: 'Klappenapparat mit Sehnenfäden', accept: ['Herzklappen', 'Klappen', 'Herzklappe'] },
          { hint: 'Bogenförmige rote Schlagader', accept: ['Aorta', 'Hauptschlagader'] },
          { hint: 'Rote gestreifte Muskulatur', accept: ['Herzmuskel', 'Myokard', 'Herzmuskulatur'] },
          { hint: 'Y-förmige blaue Vene', accept: ['Hohlvene', 'Hohlvenen', 'Vena cava'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Zusatzfrage',
        items: [
          {
            prompt: '1. Wie fließt das Blut durch das Herz?',
            keywords: ['hohlvene', 'vorhof', 'vorkammer', 'kammer', 'ventrikel', 'lungenarterie', 'lunge', 'lungenvene', 'lungenvenen', 'aorta', 'körper', 'koerper', 'klappen'],
            minMatches: 5,
            sampleAnswer:
              'Sauerstoffarmes Blut kommt über die obere und untere Hohlvene in den rechten Vorhof, fließt in die rechte Kammer und wird über die Lungenarterie zur Lunge gepumpt. Dort nimmt es Sauerstoff auf und gelangt über die Lungenvenen in den linken Vorhof, dann in die linke Kammer und von dort über die Aorta in den Körperkreislauf.',
          },
          {
            prompt: '2. Warum ist die linke Herzkammer besonders kräftig?',
            keywords: ['körperkreislauf', 'koerperkreislauf', 'großer kreislauf', 'druck', 'widerstand', 'muskel', 'muskelwand', 'körper', 'koerper', 'versorgt', 'dicker'],
            minMatches: 3,
            sampleAnswer:
              'Die linke Herzkammer pumpt das Blut in den Körperkreislauf und muss dabei einen viel höheren Widerstand überwinden als die rechte Kammer (die nur den Lungenkreislauf versorgt). Deshalb ist ihre Muskelwand besonders dick und kräftig.',
          },
        ],
      },
    ],
  },
};

export default dasHerz;
