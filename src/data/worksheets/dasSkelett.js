const dasSkelett = {
  id: 'das-skelett',
  title: 'Das menschliche Skelett',
  subtitle: 'Aufbau, Funktionen und wichtige Knochen des Körpers',
  category: 'health',
  icon: '🦴',
  estimatedMinutes: 18,
  reference: {
    image: '/worksheets/das-skelett-referenz.png',
    alt: 'Lernblatt Das menschliche Skelett mit allen Beschriftungen',
    intro:
      'Das Skelett ist das Stützgerüst des Körpers. Ein erwachsener Mensch besitzt etwa 206 Knochen. Sie geben dem Körper Halt und Form, schützen die inneren Organe, ermöglichen mit Muskeln und Gelenken Bewegung, bilden Blutzellen und speichern wichtige Mineralstoffe wie Calcium und Phosphat.',
    sections: [
      {
        heading: 'Aufbau (zwei Hauptbereiche)',
        items: [
          { label: 'Achsenskelett', body: 'Schädel, Wirbelsäule und Rippenkorb — schützt Gehirn, Rückenmark und Brustorgane.' },
          { label: 'Extremitätenskelett', body: 'Schultergürtel, Arme, Becken und Beine — ermöglicht Bewegung und Lastaufnahme.' },
        ],
      },
      {
        heading: 'Funktionen',
        items: [
          { label: 'Stütze & Form', body: 'Gibt dem Körper Halt und seine Gestalt.' },
          { label: 'Schutz', body: 'Schützt Gehirn, Herz, Lunge und Rückenmark.' },
          { label: 'Bewegung', body: 'Wirkt zusammen mit Gelenken, Muskeln, Bändern und Sehnen.' },
          { label: 'Blutbildung', body: 'Im roten Knochenmark entstehen Blutzellen.' },
          { label: 'Mineralspeicher', body: 'Speichert vor allem Calcium und Phosphat.' },
          { label: 'Fettreserve', body: 'Gelbes Knochenmark dient als Energiespeicher.' },
        ],
      },
      {
        heading: 'Wichtige Knochen',
        items: [
          { label: 'Schädel', body: 'Schützt das Gehirn und bildet das Gesicht.' },
          { label: 'Wirbelsäule', body: 'Stabilisiert den Körper und schützt das Rückenmark.' },
          { label: 'Rippenkorb', body: 'Schützt Herz, Lunge und andere wichtige Brustorgane.' },
          { label: 'Becken', body: 'Verbindet Rumpf und Beine und schützt die Beckenorgane.' },
          { label: 'Oberschenkelknochen', body: 'Stabilster und kräftigster Knochen — trägt das Körpergewicht und ist der längste Knochen des Körpers.' },
          { label: 'Schlüsselbein & Schulterblatt', body: 'Bilden gemeinsam den Schultergürtel.' },
          { label: 'Speiche & Elle', body: 'Die beiden Knochen des Unterarms.' },
          { label: 'Schienbein & Wadenbein', body: 'Die beiden Knochen des Unterschenkels.' },
        ],
      },
      {
        heading: 'Knochenaufbau',
        items: [
          { label: 'Knochenhaut (Periost)', body: 'Dünne, gefäßreiche Haut, umhüllt den Knochen.' },
          { label: 'Kompakta', body: 'Harte, dichte Knochenschicht — sorgt für Stabilität.' },
          { label: 'Spongiosa', body: 'Schwammartige Struktur — macht den Knochen leichter und widerstandsfähig.' },
          { label: 'Knochenmark', body: 'Rotes Mark bildet Blutzellen, gelbes Mark speichert Fett.' },
          { label: 'Gelenkknorpel', body: 'Glatte Knorpelschicht an den Gelenkflächen — vermindert Reibung und dämpft Stöße.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Gelenk', body: 'Verbindet Knochen miteinander und ermöglicht Bewegungen.' },
          { label: 'Knorpel', body: 'Glatte, elastische Schicht, die Gelenke schützt und Reibung verringert.' },
          { label: 'Knochenmark', body: 'Im Knocheninneren — rotes Mark bildet Blutzellen, gelbes Mark speichert Fett.' },
          { label: 'Bänder', body: 'Feste Bindegewebsstrukturen, die Knochen miteinander verbinden und stabilisieren.' },
          { label: 'Sehnen', body: 'Verbinden Muskeln mit Knochen und übertragen die Muskelkraft.' },
        ],
      },
      {
        heading: 'Wusstest du?',
        items: [
          { label: 'Anzahl', body: 'Ein erwachsener Mensch besitzt meist 206 Knochen.' },
          { label: 'Lebendes Gewebe', body: 'Knochen sind lebendes Gewebe und werden ständig umgebaut.' },
          { label: 'Längster Knochen', body: 'Der Oberschenkelknochen ist der längste und stabilste Knochen des Körpers.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/das-skelett-arbeitsblatt.png',
    alt: 'Arbeitsblatt Das menschliche Skelett zum Ausfüllen',
    tasks: [
      {
        id: 'aufbau',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Aufbau des Skeletts',
        prompt: 'Beschrifte die 12 nummerierten Knochen.',
        items: [
          { number: 1, accept: ['Schädel', 'Schaedel', 'Cranium'] },
          { number: 2, accept: ['Schlüsselbein', 'Schluesselbein', 'Clavicula'] },
          { number: 3, accept: ['Oberarmknochen', 'Humerus'] },
          { number: 4, accept: ['Brustbein', 'Sternum'] },
          { number: 5, accept: ['Rippen', 'Rippenbogen', 'Costae'] },
          { number: 6, accept: ['Wirbelsäule', 'Wirbelsaeule', 'Columna vertebralis'] },
          { number: 7, accept: ['Becken', 'Beckenknochen', 'Pelvis'] },
          { number: 8, accept: ['Speiche und Elle', 'Speiche & Elle', 'Speiche', 'Elle', 'Radius und Ulna', 'Unterarmknochen'] },
          { number: 9, accept: ['Handknochen', 'Hand', 'Mittelhand', 'Mittelhandknochen', 'Handwurzel', 'Fingerknochen'] },
          { number: 10, accept: ['Oberschenkelknochen', 'Femur'] },
          { number: 11, accept: ['Schienbein', 'Tibia'] },
          { number: 12, accept: ['Fußknochen', 'Fussknochen', 'Fuß', 'Fuss', 'Mittelfuß', 'Mittelfuss', 'Fußwurzel', 'Fusswurzel', 'Zehenknochen'] },
        ],
      },
      {
        id: 'funktionen',
        type: 'open-list',
        title: 'Aufgabe 2: Funktionen des Skeletts',
        prompt: 'Nenne sechs wichtige Funktionen oder Aufgaben.',
        expectedCount: 6,
        pool: [
          { accept: ['Stütze', 'Stuetze', 'Stütze und Form', 'Form', 'Halt', 'Stützfunktion'] },
          { accept: ['Schutz', 'Schutzfunktion', 'Schutz der Organe', 'Schutz innerer Organe'] },
          { accept: ['Bewegung', 'Bewegungsfunktion', 'Bewegungsapparat'] },
          { accept: ['Blutbildung', 'Blutzellbildung', 'Hämatopoese', 'Haematopoese'] },
          { accept: ['Mineralspeicher', 'Calciumspeicher', 'Mineralstoffspeicher', 'Speicher für Calcium', 'Calcium und Phosphat'] },
          { accept: ['Fettreserve', 'Energiespeicher', 'Fettspeicher', 'Fettreserven'] },
        ],
      },
      {
        id: 'strukturen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Strukturen',
        prompt: 'Beschrifte die vier Abbildungen.',
        items: [
          { hint: 'Knöcherner Kopf', accept: ['Schädel', 'Schaedel', 'Cranium'] },
          { hint: 'Knochenkette von oben nach unten', accept: ['Wirbelsäule', 'Wirbelsaeule', 'Columna vertebralis'] },
          { hint: 'Knochenkäfig im Brustbereich', accept: ['Rippenkorb', 'Brustkorb', 'Thorax'] },
          { hint: 'Knochen-Querschnitt mit innerem Aufbau', accept: ['Knochen', 'Knochenaufbau', 'Knochenquerschnitt', 'Röhrenknochen', 'Roehrenknochen', 'Oberschenkelknochen'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Zusatzfrage',
        items: [
          {
            prompt: '1. Warum ist das Skelett für den Körper so wichtig?',
            keywords: ['stütze', 'stuetze', 'halt', 'form', 'schutz', 'bewegung', 'blutbildung', 'mineral', 'calcium', 'organe'],
            minMatches: 3,
            sampleAnswer:
              'Das Skelett gibt dem Körper Halt und Form, schützt die inneren Organe (Gehirn, Herz, Lunge, Rückenmark), ermöglicht zusammen mit Muskeln und Gelenken Bewegung, dient der Blutbildung im Knochenmark und speichert Mineralien wie Calcium und Phosphat.',
          },
          {
            prompt: '2. Welche Aufgaben übernimmt das Knochenmark?',
            keywords: ['rotes', 'gelbes', 'blutbildung', 'blutzellen', 'erythrozyten', 'fett', 'fettspeicher', 'energiespeicher', 'mark'],
            minMatches: 2,
            sampleAnswer:
              'Im roten Knochenmark werden Blutzellen gebildet (rote und weiße Blutkörperchen sowie Blutplättchen). Das gelbe Knochenmark dient als Fett- und Energiespeicher.',
          },
        ],
      },
    ],
  },
};

export default dasSkelett;
