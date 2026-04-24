const dieHaut = {
  id: 'die-haut',
  title: 'Die Haut des Menschen',
  subtitle: 'Aufbau, Funktionen und wichtige Bestandteile der Haut',
  category: 'health',
  icon: '🧴',
  estimatedMinutes: 15,
  reference: {
    image: '/worksheets/die-haut-referenz.png',
    alt: 'Lernblatt Die Haut des Menschen mit allen Beschriftungen',
    intro:
      'Die Haut ist mit 1,5 bis 2 m² das größte Organ des Menschen. Sie besteht aus drei Schichten (Oberhaut, Lederhaut, Unterhaut) und übernimmt Schutz, Temperaturregelung, Sinneswahrnehmung, Stoffwechsel, Speicherung und Wasserhaushalt.',
    sections: [
      {
        heading: 'Aufbau (drei Schichten)',
        items: [
          { label: 'Oberhaut (Epidermis)', body: 'Äußere Schutzschicht, erneuert sich ständig, enthält Hornschicht und Pigmentzellen.' },
          { label: 'Lederhaut (Dermis)', body: 'Enthält Blutgefäße, Nerven, Haarwurzeln sowie Schweiß- und Talgdrüsen.' },
          { label: 'Unterhaut (Subcutis)', body: 'Lockeres Binde- und Fettgewebe; polstert, speichert Energie und isoliert gegen Kälte.' },
        ],
      },
      {
        heading: 'Funktionen',
        items: [
          { label: 'Schutz', body: 'Barriere gegen Keime, UV-Strahlung und äußere Einflüsse.' },
          { label: 'Temperaturregelung', body: 'Durch Schwitzen und Veränderung der Durchblutung.' },
          { label: 'Sinnesorgan', body: 'Nimmt Berührung, Druck, Schmerz und Temperatur wahr.' },
          { label: 'Stoffwechsel', body: 'Beteiligt an der Bildung von Vitamin D.' },
          { label: 'Speicher & Isolation', body: 'Unterhautfett schützt vor Wärmeverlust und dient als Energiespeicher.' },
          { label: 'Wasserhaushalt', body: 'Hilft, den Verlust von Flüssigkeit zu begrenzen.' },
        ],
      },
      {
        heading: 'Hautanhangsgebilde',
        items: [
          { label: 'Haare', body: 'Schützen, wärmen und unterstützen die Sinneswahrnehmung.' },
          { label: 'Nägel', body: 'Schützen die Fingerkuppen und unterstützen die Feinmotorik.' },
          { label: 'Schweißdrüsen', body: 'Bildung von Schweiß zur Temperaturregulation.' },
          { label: 'Talgdrüsen', body: 'Bildung von Talg schmiert Haut und Haare und schützt sie.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/die-haut-arbeitsblatt.png',
    alt: 'Arbeitsblatt Die Haut des Menschen zum Ausfüllen',
    tasks: [
      {
        id: 'aufbau',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Aufbau der Haut',
        prompt: 'Beschrifte die 12 nummerierten Strukturen.',
        items: [
          { number: 1, accept: ['Oberhaut', 'Epidermis', 'Oberhaut (Epidermis)'] },
          { number: 2, accept: ['Lederhaut', 'Dermis', 'Lederhaut (Dermis)'] },
          { number: 3, accept: ['Unterhaut', 'Subcutis', 'Unterhaut (Subcutis)'] },
          { number: 4, accept: ['Haar', 'Haarschaft', 'Haar / Haarschaft'] },
          { number: 5, accept: ['Schweißpore', 'Pore'] },
          { number: 6, accept: ['Talgdrüse', 'Talgdruese'] },
          { number: 7, accept: ['Haarfollikel', 'Haarwurzel', 'Haarfollikel / Haarwurzel'] },
          { number: 8, accept: ['Schweißdrüse', 'Schweissdruese'] },
          { number: 9, accept: ['Nerven', 'Nervenendigungen', 'Nerven / Nervenendigungen'] },
          { number: 10, accept: ['Blutgefäße', 'Blutgefaesse', 'Gefäße', 'Adern'] },
          { number: 11, accept: ['Unterhautfettgewebe', 'Fettgewebe'] },
          { number: 12, accept: ['Rezeptor', 'Rezeptoren', 'Rezeptoren für Berührung', 'Rezeptor für Berührung/Druck', 'Druckrezeptor', 'Vater-Pacini-Körperchen', 'Lamellenkörperchen'] },
        ],
      },
      {
        id: 'funktionen',
        type: 'open-list',
        title: 'Aufgabe 2: Funktionen der Haut',
        prompt: 'Nenne sechs wichtige Funktionen.',
        expectedCount: 6,
        pool: [
          { accept: ['Schutz', 'Schutzfunktion', 'Barriere', 'Abwehr'] },
          { accept: ['Temperaturregelung', 'Thermoregulation', 'Wärmeregulation'] },
          { accept: ['Sinnesorgan', 'Sinneswahrnehmung', 'Wahrnehmung', 'Tastsinn'] },
          { accept: ['Stoffwechsel', 'Vitamin D', 'Vitamin-D-Bildung'] },
          { accept: ['Speicher', 'Isolation', 'Speicher und Isolation', 'Speicherung', 'Energiespeicher'] },
          { accept: ['Wasserhaushalt', 'Flüssigkeitshaushalt'] },
        ],
      },
      {
        id: 'hautanhangsgebilde',
        type: 'labels',
        title: 'Aufgabe 3: Hautanhangsgebilde',
        prompt: 'Beschrifte die vier Abbildungen.',
        items: [
          { hint: 'Haarwurzel im Querschnitt', accept: ['Haare', 'Haar'] },
          { hint: 'Fingernagel', accept: ['Nägel', 'Nagel', 'Fingernagel'] },
          { hint: 'Blaues Knäuel', accept: ['Schweißdrüsen', 'Schweißdrüse', 'Schweissdruesen'] },
          { hint: 'Gelber Zelltraube', accept: ['Talgdrüsen', 'Talgdrüse', 'Talgdruesen'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Zusatzfrage',
        items: [
          {
            prompt: '1. Warum ist die Haut ein wichtiges Schutzorgan?',
            keywords: ['barriere', 'keime', 'uv', 'bakterien', 'strahlung', 'austrocknung', 'schutz'],
            minMatches: 2,
            sampleAnswer:
              'Die Haut bildet eine mechanische und biologische Barriere gegen Keime, UV-Strahlung, Austrocknung und äußere Einflüsse.',
          },
          {
            prompt: '2. Welche Aufgaben übernimmt das Unterhautfettgewebe?',
            keywords: ['wärme', 'waerme', 'isolation', 'polster', 'energie', 'speicher', 'kälte'],
            minMatches: 2,
            sampleAnswer:
              'Das Unterhautfettgewebe schützt vor Wärmeverlust, polstert den Körper, dient als Energiespeicher und isoliert gegen Kälte.',
          },
        ],
      },
    ],
  },
};

export default dieHaut;
