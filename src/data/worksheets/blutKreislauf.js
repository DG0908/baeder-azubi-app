const blutKreislauf = {
  id: 'blut-kreislauf',
  title: 'Das Blut und der Blutkreislauf',
  subtitle: 'Bestandteile, Funktionen sowie großer und kleiner Blutkreislauf',
  category: 'health',
  icon: '🩸',
  estimatedMinutes: 18,
  reference: {
    image: '/worksheets/blut-kreislauf-referenz.png',
    alt: 'Lernblatt Blut und Blutkreislauf mit allen Beschriftungen',
    intro:
      'Das Blut ist das Transportsystem des Körpers. Es versorgt Zellen mit Sauerstoff und Nährstoffen, transportiert Kohlendioxid und Abfallprodukte ab, schützt vor Krankheitserregern und verteilt Wärme. Angetrieben vom Herzen fließt es in zwei getrennten Kreisläufen: dem kleinen Blutkreislauf (Lunge) und dem großen Blutkreislauf (Körper).',
    sections: [
      {
        heading: 'Was ist Blut?',
        items: [
          { label: 'Flüssiges Gewebe', body: 'Zirkuliert im Körper und erfüllt lebenswichtige Aufgaben.' },
        ],
      },
      {
        heading: 'Bestandteile des Blutes',
        items: [
          { label: 'Plasma', body: 'Transportflüssigkeit — enthält Wasser, Nährstoffe, Hormone (ca. 55 % des Blutes).' },
          { label: 'Erythrozyten', body: 'Rote Blutkörperchen — transportieren Sauerstoff (über Hämoglobin).' },
          { label: 'Leukozyten', body: 'Weiße Blutkörperchen — zuständig für die Abwehr von Krankheitserregern.' },
          { label: 'Thrombozyten', body: 'Blutplättchen — wichtig für die Blutgerinnung und den Wundverschluss.' },
        ],
      },
      {
        heading: 'Funktionen des Blutes',
        items: [
          { label: 'Sauerstofftransport', body: 'Versorgt Zellen und Gewebe mit lebenswichtigem O₂.' },
          { label: 'Kohlendioxidtransport', body: 'Transportiert CO₂ zur Lunge zur Ausatmung.' },
          { label: 'Nährstofftransport', body: 'Bringt Nährstoffe zu den Zellen.' },
          { label: 'Abwehr', body: 'Schützt vor Krankheitserregern durch Leukozyten und Antikörper.' },
          { label: 'Wärmeverteilung', body: 'Verteilt Wärme im Körper und reguliert die Körpertemperatur.' },
          { label: 'Wundverschluss / Gerinnung', body: 'Verhindert Blutverlust bei Verletzungen.' },
        ],
      },
      {
        heading: 'Kleiner Blutkreislauf (Lungenkreislauf)',
        items: [
          { label: 'Reihenfolge', body: 'Rechte Kammer → Lungenarterie → Lunge → Lungenvenen → linker Vorhof.' },
          { label: 'Zweck', body: 'Sauerstoffarmes Blut gibt CO₂ an die Lunge ab und nimmt Sauerstoff auf.' },
        ],
      },
      {
        heading: 'Großer Blutkreislauf (Körperkreislauf)',
        items: [
          { label: 'Reihenfolge', body: 'Linke Kammer → Aorta → Körper (Organe & Gewebe) → Hohlvenen → rechter Vorhof.' },
          { label: 'Zweck', body: 'Sauerstoffreiches Blut versorgt alle Organe und Zellen und kehrt sauerstoffarm zurück.' },
        ],
      },
      {
        heading: 'Blutweg auf einen Blick',
        items: [
          { label: 'Gesamtzirkulation', body: 'Rechter Vorhof (O₂-arm) → rechte Kammer → Lunge (Gasaustausch) → linker Vorhof (O₂-reich) → linke Kammer → Körper.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Plasma', body: 'Flüssiger Anteil des Blutes.' },
          { label: 'Erythrozyt', body: 'Rotes Blutkörperchen, transportiert Sauerstoff.' },
          { label: 'Leukozyt', body: 'Weißes Blutkörperchen, Abwehr von Krankheitserregern.' },
          { label: 'Thrombozyt', body: 'Blutplättchen — wichtig für die Blutgerinnung.' },
          { label: 'Aorta', body: 'Hauptschlagader — führt sauerstoffreiches Blut vom Herzen in den Körper.' },
          { label: 'Vene', body: 'Blutgefäß, das Blut zurück zum Herzen führt.' },
          { label: 'Arterie', body: 'Blutgefäß, das Blut vom Herzen wegführt.' },
        ],
      },
      {
        heading: 'Wusstest du?',
        items: [
          { label: 'Blutmenge', body: 'Ein Erwachsener hat etwa 5–6 Liter Blut.' },
          { label: 'Herzfrequenz', body: 'Das Herz schlägt in Ruhe etwa 60–80 Mal pro Minute.' },
          { label: 'Gefäßlänge', body: 'Alle Blutgefäße zusammen sind mehrere tausend Kilometer lang.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/blut-kreislauf-arbeitsblatt.png',
    alt: 'Arbeitsblatt Das Blut und der Blutkreislauf zum Ausfüllen',
    tasks: [
      {
        id: 'aufbau',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Aufbau des Blutkreislaufs',
        prompt: 'Beschrifte die 12 nummerierten Strukturen.',
        items: [
          { number: 1, accept: ['Lungenarterie', 'Pulmonalarterie', 'A. pulmonalis', 'Lungenschlagader'] },
          { number: 2, accept: ['Obere Hohlvene', 'Vena cava superior', 'V. cava superior'] },
          { number: 3, accept: ['Rechter Vorhof', 'Rechte Vorkammer', 'Atrium dextrum'] },
          { number: 4, accept: ['Rechte Kammer', 'Rechte Herzkammer', 'Rechter Ventrikel', 'Ventriculus dexter'] },
          { number: 5, accept: ['Untere Hohlvene', 'Vena cava inferior', 'V. cava inferior'] },
          { number: 6, accept: ['Hohlvenen', 'Venen', 'Körpervenen', 'Koerpervenen'] },
          { number: 7, accept: ['Lungenvenen', 'Lungenvene', 'Vv. pulmonales'] },
          { number: 8, accept: ['Aorta', 'Aortenbogen', 'Hauptschlagader'] },
          { number: 9, accept: ['Linker Vorhof', 'Linke Vorkammer', 'Atrium sinistrum'] },
          { number: 10, accept: ['Linke Kammer', 'Linke Herzkammer', 'Linker Ventrikel', 'Ventriculus sinister'] },
          { number: 11, accept: ['Aorta', 'Aorta absteigend', 'Aorta descendens', 'Absteigende Aorta'] },
          { number: 12, accept: ['Körperarterien', 'Koerperarterien', 'Körperarterie', 'Koerperarterie', 'Arterien', 'Periphere Arterien'] },
        ],
      },
      {
        id: 'funktionen',
        type: 'open-list',
        title: 'Aufgabe 2: Funktionen des Blutes',
        prompt: 'Nenne sechs wichtige Funktionen oder Aufgaben.',
        expectedCount: 6,
        pool: [
          { accept: ['Sauerstofftransport', 'Sauerstoff transportieren', 'O2-Transport', 'Sauerstoffversorgung'] },
          { accept: ['Kohlendioxidtransport', 'CO2-Transport', 'CO2 abtransportieren', 'Kohlendioxid abtransportieren'] },
          { accept: ['Nährstofftransport', 'Naehrstofftransport', 'Nährstoffe transportieren', 'Naehrstoffe transportieren'] },
          { accept: ['Abwehr', 'Immunabwehr', 'Immunsystem', 'Krankheitserreger abwehren', 'Infektionsabwehr'] },
          { accept: ['Wärmeverteilung', 'Waermeverteilung', 'Wärmeregulation', 'Waermeregulation', 'Temperaturregulation'] },
          { accept: ['Wundverschluss', 'Blutgerinnung', 'Gerinnung', 'Wundverschluss / Gerinnung', 'Hämostase'] },
        ],
      },
      {
        id: 'strukturen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Strukturen',
        prompt: 'Beschrifte die vier Abbildungen.',
        items: [
          { hint: 'Rote Blutkörperchen', accept: ['Erythrozyten', 'Erythrozyt', 'Rote Blutkörperchen', 'Rotes Blutkörperchen', 'Rote Blutkoerperchen'] },
          { hint: 'Weißes Blutkörperchen mit Zellkern', accept: ['Leukozyt', 'Leukozyten', 'Weißes Blutkörperchen', 'Weisses Blutkoerperchen', 'Weiße Blutkörperchen'] },
          { hint: 'Blutplättchen', accept: ['Thrombozyten', 'Thrombozyt', 'Blutplättchen', 'Blutplaettchen'] },
          { hint: 'Gelbe Flüssigkeit im Röhrchen', accept: ['Plasma', 'Blutplasma'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfrage',
        items: [
          {
            prompt: '1. Wie verläuft der kleine Blutkreislauf?',
            keywords: ['rechte kammer', 'rechter ventrikel', 'lungenarterie', 'lunge', 'gasaustausch', 'sauerstoff', 'kohlendioxid', 'lungenvenen', 'linker vorhof', 'linke vorkammer'],
            minMatches: 4,
            sampleAnswer:
              'Sauerstoffarmes Blut wird von der rechten Kammer über die Lungenarterie zur Lunge gepumpt. Dort gibt es Kohlendioxid ab und nimmt Sauerstoff auf. Anschließend fließt es über die Lungenvenen zurück in den linken Vorhof.',
          },
          {
            prompt: '2. Was ist der Unterschied zwischen großem und kleinem Blutkreislauf?',
            keywords: ['körperkreislauf', 'koerperkreislauf', 'lungenkreislauf', 'großer', 'grosser', 'kleiner', 'körper', 'koerper', 'lunge', 'sauerstoff', 'organe', 'gasaustausch', 'versorgt'],
            minMatches: 3,
            sampleAnswer:
              'Der kleine Blutkreislauf (Lungenkreislauf) transportiert sauerstoffarmes Blut zur Lunge, um dort Sauerstoff aufzunehmen und CO₂ abzugeben. Der große Blutkreislauf (Körperkreislauf) bringt das sauerstoffreiche Blut von der linken Kammer über die Aorta zu allen Organen und Zellen und sammelt sauerstoffarmes Blut über die Hohlvenen wieder ein.',
          },
        ],
      },
    ],
  },
};

export default blutKreislauf;
