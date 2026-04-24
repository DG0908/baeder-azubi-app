const dasAuge = {
  id: 'das-auge',
  title: 'Das menschliche Auge',
  subtitle: 'Aufbau, Funktionen und Sehvorgang',
  category: 'health',
  icon: '👁️',
  estimatedMinutes: 15,
  reference: {
    image: '/worksheets/das-auge-referenz.png',
    alt: 'Lernblatt Das menschliche Auge mit allen Beschriftungen',
    intro:
      'Das Auge ist das Sinnesorgan des Sehens. Licht wird durch Hornhaut und Linse gebündelt, auf die Netzhaut geworfen und dort in Nervenimpulse umgewandelt, die der Sehnerv ans Gehirn weiterleitet. Schutzstrukturen wie Bindehaut, Tränenfilm und Augenlider halten das Auge feucht und reizfrei.',
    sections: [
      {
        heading: 'Aufbau (drei Bereiche)',
        items: [
          { label: 'Außenbereich / Schutzstrukturen', body: 'Hornhaut, Bindehaut, Augenlider und Tränenfilm schützen und pflegen die Oberfläche.' },
          { label: 'Brechende Medien', body: 'Hornhaut liefert den größten Teil der Brechkraft, die Linse verändert ihre Form zum Scharfstellen, der Glaskörper leitet das Licht zur Netzhaut.' },
          { label: 'Augenhintergrund / Netzhaut', body: 'Netzhaut enthält Lichtsinneszellen (Stäbchen für Hell-Dunkel, Zapfen für Farben), Aderhaut versorgt sie mit Nährstoffen, Sehnerv leitet Signale zum Gehirn.' },
        ],
      },
      {
        heading: 'Funktionen',
        items: [
          { label: 'Sehen', body: 'Licht wird gebündelt und auf der Netzhaut in Nervenimpulse umgewandelt.' },
          { label: 'Lichtregulation', body: 'Die Iris steuert die Pupillengröße und reguliert den Lichteinfall.' },
          { label: 'Scharfstellen / Akkommodation', body: 'Ziliarmuskel und Linse verändern ihre Form für scharfes Sehen in Nah und Fern.' },
          { label: 'Farbwahrnehmung', body: 'Zapfen auf der Netzhaut erkennen Farben und Helligkeit.' },
          { label: 'Schutz', body: 'Hornhaut, Bindehaut, Augenlider, Tränenfilm und Wimpern schützen vor Reizungen und Austrocknung.' },
          { label: 'Weiterleitung ans Gehirn', body: 'Der Sehnerv überträgt die Signale zur Verarbeitung im Gehirn.' },
        ],
      },
      {
        heading: 'So entsteht Sehen',
        items: [
          { label: 'Reihenfolge', body: 'Licht → Hornhaut → Pupille → Linse → Glaskörper → Netzhaut → Sehnerv → Gehirn.' },
        ],
      },
      {
        heading: 'Wichtige Strukturen',
        items: [
          { label: 'Hornhaut (Cornea)', body: 'Transparente Schutzschicht, bricht Licht und schützt das Auge.' },
          { label: 'Iris / Pupille', body: 'Regenbogenhaut mit Pigmenten, reguliert die Pupillenweite.' },
          { label: 'Linse', body: 'Elastisch, verändert ihre Form zum Scharfstellen.' },
          { label: 'Netzhaut (Retina)', body: 'Lichtsinneszellen wandeln Licht in elektrische Signale um.' },
          { label: 'Sehnerv (Nervus opticus)', body: 'Nervenfasern bündeln die Signale und leiten sie zum Gehirn.' },
          { label: 'Gelber Fleck (Makula)', body: 'Sorgt für das schärfste Sehen in der Mitte.' },
        ],
      },
      {
        heading: 'Wusstest du?',
        items: [
          { label: 'Stäbchen', body: 'Etwa 120 Millionen — für das Hell-Dunkel-Sehen bei wenig Licht.' },
          { label: 'Zapfen', body: 'Etwa 6–7 Millionen — für Farben und feine Details.' },
          { label: 'Blinder Fleck', body: 'Stelle, an der der Sehnerv die Netzhaut verlässt — hier gibt es keine Sinneszellen.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/das-auge-arbeitsblatt.png',
    alt: 'Arbeitsblatt Das menschliche Auge zum Ausfüllen',
    tasks: [
      {
        id: 'aufbau',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Aufbau des Auges',
        prompt: 'Beschrifte die 12 nummerierten Strukturen.',
        items: [
          { number: 1, accept: ['Hornhaut', 'Cornea', 'Hornhaut (Cornea)'] },
          { number: 2, accept: ['Iris', 'Regenbogenhaut', 'Iris (Regenbogenhaut)'] },
          { number: 3, accept: ['Pupille', 'Pupille (Öffnung)'] },
          { number: 4, accept: ['Linse', 'Linse (akkommodierbar)'] },
          { number: 5, accept: ['Ziliarmuskel', 'Zonulafasern', 'Ziliarmuskel (m. ciliaris)', 'm. ciliaris'] },
          { number: 6, accept: ['Glaskörper', 'Glaskoerper', 'Vitreous humor', 'Glaskörper (Vitreous humor)'] },
          { number: 7, accept: ['Netzhaut', 'Retina', 'Netzhaut (Retina)'] },
          { number: 8, accept: ['Aderhaut', 'Chorioidea', 'Aderhaut (Chorioidea)'] },
          { number: 9, accept: ['Lederhaut', 'Sklera', 'Lederhaut (Sklera)'] },
          { number: 10, accept: ['Gelber Fleck', 'Makula', 'Gelber Fleck (Makula)'] },
          { number: 11, accept: ['Blinder Fleck', 'Papille', 'Blinder Fleck (Papille)'] },
          { number: 12, accept: ['Sehnerv', 'Nervus opticus', 'Sehnerv (Nervus opticus)'] },
        ],
      },
      {
        id: 'funktionen',
        type: 'open-list',
        title: 'Aufgabe 2: Funktionen des Auges',
        prompt: 'Nenne sechs wichtige Funktionen oder Aufgaben.',
        expectedCount: 6,
        pool: [
          { accept: ['Sehen', 'Lichtwahrnehmung'] },
          { accept: ['Lichtregulation', 'Lichteinfall regulieren', 'Pupillenregulation'] },
          { accept: ['Scharfstellen', 'Akkommodation', 'Scharfstellen / Akkommodation'] },
          { accept: ['Farbwahrnehmung', 'Farbsehen', 'Farben erkennen'] },
          { accept: ['Schutz', 'Schutzfunktion'] },
          { accept: ['Weiterleitung ans Gehirn', 'Signalübertragung', 'Weiterleitung', 'Sehnerv leitet', 'Gehirn'] },
        ],
      },
      {
        id: 'strukturen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Strukturen',
        prompt: 'Beschrifte die vier Abbildungen.',
        items: [
          { hint: 'Transparente Kuppel', accept: ['Hornhaut', 'Cornea', 'Hornhaut (Cornea)'] },
          { hint: 'Gefärbter Ring mit Öffnung', accept: ['Iris', 'Iris / Pupille', 'Regenbogenhaut'] },
          { hint: 'Elastische Linse', accept: ['Linse'] },
          { hint: 'Nervenfaserbündel', accept: ['Sehnerv', 'Nervus opticus', 'Sehnerv (Nervus opticus)'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Zusatzfrage',
        items: [
          {
            prompt: '1. Wie gelangt ein Lichtreiz vom Auge bis ins Gehirn?',
            keywords: ['hornhaut', 'pupille', 'iris', 'linse', 'glaskörper', 'glaskoerper', 'netzhaut', 'retina', 'sehnerv', 'gehirn'],
            minMatches: 4,
            sampleAnswer:
              'Licht → Hornhaut → Pupille (durch die Iris reguliert) → Linse → Glaskörper → Netzhaut → Sehnerv → Gehirn.',
          },
          {
            prompt: '2. Warum sind Pupille und Iris für das Sehen wichtig?',
            keywords: ['lichteinfall', 'helligkeit', 'dunkelheit', 'pupillenweite', 'pupillengröße', 'pupillengroesse', 'weiten', 'verengen', 'blendung', 'regulieren', 'regulation'],
            minMatches: 2,
            sampleAnswer:
              'Die Iris steuert die Pupillengröße und reguliert so den Lichteinfall. Bei Helligkeit verengt sich die Pupille (Schutz vor Blendung), bei Dunkelheit weitet sie sich, damit mehr Licht auf die Netzhaut fällt.',
          },
        ],
      },
    ],
  },
};

export default dasAuge;
