const dasOhr = {
  id: 'das-ohr',
  title: 'Das menschliche Ohr',
  subtitle: 'Aufbau, Funktionen und Schallverarbeitung',
  category: 'health',
  icon: '👂',
  estimatedMinutes: 15,
  reference: {
    image: '/worksheets/das-ohr-referenz.png',
    alt: 'Lernblatt Das menschliche Ohr mit allen Beschriftungen',
    intro:
      'Das Ohr ist Sinnesorgan für Hören und Gleichgewicht. Es gliedert sich in Außenohr, Mittelohr und Innenohr. Schallwellen werden aufgenommen, mechanisch verstärkt und in der Schnecke in Nervenimpulse umgewandelt, die über den Hörnerv an das Gehirn weitergeleitet werden.',
    sections: [
      {
        heading: 'Aufbau (drei Abschnitte)',
        items: [
          { label: 'Außenohr', body: 'Schallaufnahme über Ohrmuschel und äußeren Gehörgang.' },
          { label: 'Mittelohr', body: 'Trommelfell und die Gehörknöchelchen (Hammer, Amboss, Steigbügel) übertragen und verstärken Schwingungen.' },
          { label: 'Innenohr', body: 'Schnecke wandelt Schallreize in Nervenimpulse um; Bogengänge dienen dem Gleichgewicht.' },
        ],
      },
      {
        heading: 'Funktionen',
        items: [
          { label: 'Hören', body: 'Schallwellen werden aufgenommen und weitergeleitet.' },
          { label: 'Schallverstärkung', body: 'Die Gehörknöchelchen verstärken feine Schwingungen.' },
          { label: 'Druckausgleich', body: 'Die Ohrtrompete (Eustachische Röhre) verbindet Ohr und Rachenraum.' },
          { label: 'Gleichgewicht', body: 'Die Bogengänge erfassen Drehbewegungen des Kopfes.' },
          { label: 'Richtungshören', body: 'Beide Ohren zusammen ermöglichen das Orten von Geräuschen.' },
          { label: 'Reizumwandlung', body: 'Haarzellen in der Schnecke wandeln Schwingungen in Nervenimpulse.' },
        ],
      },
      {
        heading: 'Schallweg',
        items: [
          { label: 'Reihenfolge', body: 'Schall → Ohrmuschel → Gehörgang → Trommelfell → Gehörknöchelchen → Schnecke → Hörnerv → Gehirn.' },
        ],
      },
      {
        heading: 'Wichtige Strukturen',
        items: [
          { label: 'Ohrmuschel', body: 'Fängt Schallwellen auf.' },
          { label: 'Trommelfell', body: 'Dünne Membran, die durch Schall in Schwingung versetzt wird.' },
          { label: 'Gehörknöchelchen', body: 'Hammer (Malleus), Amboss (Incus) und Steigbügel (Stapes) verstärken Schwingungen.' },
          { label: 'Schnecke (Cochlea)', body: 'Enthält Haarzellen, die Schwingungen in Nervenimpulse umwandeln.' },
          { label: 'Bogengänge (Vestibularapparat)', body: 'Teil des Gleichgewichtssystems.' },
          { label: 'Hörnerv (N. cochlearis)', body: 'Leitet Nervenimpulse zum Gehirn.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/das-ohr-arbeitsblatt.png',
    alt: 'Arbeitsblatt Das menschliche Ohr zum Ausfüllen',
    tasks: [
      {
        id: 'aufbau',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Aufbau des Ohres',
        prompt: 'Beschrifte die 12 nummerierten Strukturen.',
        items: [
          { number: 1, accept: ['Außenohr', 'Aussenohr'] },
          { number: 2, accept: ['Mittelohr'] },
          { number: 3, accept: ['Innenohr'] },
          { number: 4, accept: ['Ohrmuschel'] },
          { number: 5, accept: ['Äußerer Gehörgang', 'Gehörgang', 'Aeusserer Gehoergang', 'Gehoergang'] },
          { number: 6, accept: ['Trommelfell'] },
          { number: 7, accept: ['Hammer', 'Malleus', 'Hammer (Malleus)'] },
          { number: 8, accept: ['Amboss', 'Incus', 'Amboss (Incus)'] },
          { number: 9, accept: ['Steigbügel', 'Stapes', 'Steigbuegel', 'Steigbügel (Stapes)'] },
          { number: 10, accept: ['Schnecke', 'Cochlea', 'Schnecke (Cochlea)'] },
          { number: 11, accept: ['Bogengänge', 'Bogengaenge', 'Vestibularapparat', 'Bogengänge (Vestibularapparat)'] },
          { number: 12, accept: ['Hörnerv', 'Hoernerv', 'N. cochlearis', 'Hörnerv (N. cochlearis)'] },
        ],
      },
      {
        id: 'funktionen',
        type: 'open-list',
        title: 'Aufgabe 2: Funktionen des Ohres',
        prompt: 'Nenne sechs wichtige Funktionen oder Aufgaben.',
        expectedCount: 6,
        pool: [
          { accept: ['Hören', 'Hoeren'] },
          { accept: ['Schallverstärkung', 'Schallverstaerkung', 'Verstärkung', 'Verstaerkung'] },
          { accept: ['Druckausgleich'] },
          { accept: ['Gleichgewicht', 'Gleichgewichtssinn'] },
          { accept: ['Richtungshören', 'Richtungshoeren', 'Ortung', 'Geräuschortung'] },
          { accept: ['Reizumwandlung', 'Umwandlung', 'Schwingungen in Nervenimpulse'] },
        ],
      },
      {
        id: 'strukturen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Strukturen',
        prompt: 'Beschrifte die vier Abbildungen.',
        items: [
          { hint: 'Äußere Form', accept: ['Ohrmuschel'] },
          { hint: 'Runde Membran', accept: ['Trommelfell'] },
          { hint: 'Spirale', accept: ['Schnecke', 'Cochlea', 'Schnecke (Cochlea)'] },
          { hint: 'Drei Schleifen', accept: ['Bogengänge', 'Bogengaenge', 'Vestibularapparat', 'Bogengänge (Vestibularapparat)'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Zusatzfrage',
        items: [
          {
            prompt: '1. Wie gelangt ein Schallreiz vom Außenohr bis zum Gehirn?',
            keywords: ['ohrmuschel', 'gehörgang', 'gehoergang', 'trommelfell', 'gehörknöchelchen', 'gehoerknoechelchen', 'hammer', 'amboss', 'steigbügel', 'steigbuegel', 'schnecke', 'cochlea', 'hörnerv', 'hoernerv', 'gehirn'],
            minMatches: 4,
            sampleAnswer:
              'Schall → Ohrmuschel → Gehörgang → Trommelfell → Gehörknöchelchen (Hammer, Amboss, Steigbügel) → Schnecke → Hörnerv → Gehirn.',
          },
          {
            prompt: '2. Warum sind die Bogengänge wichtig für den Menschen?',
            keywords: ['gleichgewicht', 'drehbewegung', 'drehbewegungen', 'orientierung', 'lage', 'gleichgewichtssinn', 'vestibular'],
            minMatches: 2,
            sampleAnswer:
              'Die Bogengänge erfassen Drehbewegungen des Kopfes und sind Teil des Gleichgewichtssystems. Sie helfen uns, das Gleichgewicht zu halten und uns im Raum zu orientieren.',
          },
        ],
      },
    ],
  },
};

export default dasOhr;
