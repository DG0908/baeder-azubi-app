const dieMuskulatur = {
  id: 'die-muskulatur',
  title: 'Die menschliche Muskulatur',
  subtitle: 'Aufbau, Funktionen und wichtige Muskelgruppen des Körpers',
  category: 'health',
  icon: '💪',
  estimatedMinutes: 18,
  reference: {
    image: '/worksheets/die-muskulatur-referenz.png',
    alt: 'Lernblatt Die menschliche Muskulatur mit allen Beschriftungen',
    intro:
      'Die Muskulatur ist der aktive Teil des Bewegungsapparates. Ein Mensch besitzt über 600 Muskeln, die rund 40 % des Körpergewichts ausmachen. Sie ermöglichen Bewegung, halten den Körper aufrecht, erzeugen Wärme, schützen innere Organe und unterstützen die Atmung sowie den Blutrückfluss zum Herzen.',
    sections: [
      {
        heading: 'Aufbau (drei Muskeltypen)',
        items: [
          { label: 'Skelettmuskulatur', body: 'Willkürlich steuerbar und über Sehnen mit den Knochen verbunden. Bewegt den Körper und sorgt für Haltung.' },
          { label: 'Glatte Muskulatur', body: 'Arbeitet unwillkürlich in Organen und Gefäßen (z. B. Magen, Darm, Blutgefäße) und reguliert deren Funktionen.' },
          { label: 'Herzmuskulatur', body: 'Arbeitet rhythmisch und unwillkürlich. Sorgt für die Pumpleistung des Herzens — eine eigenständige Muskelart.' },
        ],
      },
      {
        heading: 'Funktionen',
        items: [
          { label: 'Bewegung', body: 'Muskeln ermöglichen jede Form von Bewegung — vom Gehen bis zur Mimik.' },
          { label: 'Haltung & Stabilität', body: 'Sie halten uns aufrecht und stabilisieren Gelenke und Körper.' },
          { label: 'Wärmeerzeugung', body: 'Bei Aktivität entsteht Wärme, die den Körper warm hält (z. B. Muskelzittern bei Kälte).' },
          { label: 'Schutz innerer Organe', body: 'Muskeln und Muskelwände schützen Organe vor Stößen und Verletzungen.' },
          { label: 'Unterstützung der Atmung', body: 'Atemmuskeln (Zwerchfell, Zwischenrippenmuskeln) sorgen für das Ein- und Ausatmen.' },
          { label: 'Muskelpumpe / venöser Rückfluss', body: 'Muskelkontraktionen unterstützen die Rückführung des Blutes zum Herzen.' },
        ],
      },
      {
        heading: 'Wichtige Muskelgruppen',
        items: [
          { label: 'Deltamuskel', body: 'Schultermuskel, der die Arme in alle Richtungen bewegen kann.' },
          { label: 'Großer Brustmuskel', body: 'Bewegt den Arm nach vorn und innen, unterstützt beim Drücken.' },
          { label: 'Bizeps', body: 'Beugt den Unterarm im Ellenbogengelenk — der klassische Beuger des Oberarms.' },
          { label: 'Trizeps', body: 'Streckt den Unterarm im Ellenbogengelenk — Gegenspieler des Bizeps.' },
          { label: 'Gerader Bauchmuskel', body: 'Beugt den Rumpf nach vorn und stabilisiert den Oberkörper.' },
          { label: 'Breiter Rückenmuskel (Latissimus)', body: 'Großer Rückenmuskel — zieht die Arme nach unten und hinten (z. B. beim Schwimmen).' },
          { label: 'Großer Gesäßmuskel', body: 'Streckt und stabilisiert die Hüfte, wichtig für Gehen und Aufstehen — der größte Muskel des Körpers.' },
          { label: 'Quadrizeps', body: 'Streckt das Knie und ist der wichtigste Streckmuskel des Oberschenkels.' },
          { label: 'Beinbeuger', body: 'Auf der Rückseite des Oberschenkels — beugt das Knie und streckt die Hüfte.' },
          { label: 'Wadenmuskel', body: 'Streckt den Fuß im Sprunggelenk — wichtig beim Gehen, Laufen und beim Abdruck.' },
        ],
      },
      {
        heading: 'Muskelaufbau',
        items: [
          { label: 'Muskel', body: 'Gesamter Muskel als funktionelle Einheit, von einer Muskelhülle umgeben.' },
          { label: 'Muskelfaserbündel', body: 'Mehrere Muskelfasern sind zu Bündeln zusammengefasst.' },
          { label: 'Muskelfaser', body: 'Lange, vielkernige Zelle, die sich kontrahieren (verkürzen) kann.' },
          { label: 'Myofibrillen', body: 'Feine Fäden in der Muskelfaser — bestehen aus Aktin und Myosin und sorgen für die Kontraktion.' },
          { label: 'Sehne', body: 'Verbindet Muskel mit Knochen und überträgt die Kraft auf das Skelett.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Sehne', body: 'Feste Bindegewebsstruktur, die Muskel mit Knochen verbindet und die Kraft überträgt.' },
          { label: 'Muskeltonus', body: 'Leichte, ständige Grundspannung der Muskulatur, die Haltung und Bereitschaft sichert.' },
          { label: 'Agonist', body: 'Hauptmuskel, der eine bestimmte Bewegung ausführt (z. B. Bizeps beugt den Unterarm).' },
          { label: 'Antagonist', body: 'Gegenspieler, der die entgegengesetzte Bewegung ausführt (z. B. Trizeps streckt den Unterarm).' },
          { label: 'Kontraktion', body: 'Verkürzung der Muskelfasern, durch die Kraft entsteht und Bewegung möglich ist.' },
          { label: 'Kraftübertragung', body: 'Über Sehnen wird die Kraft vom Muskel auf den Knochen übertragen — so entsteht Bewegung.' },
        ],
      },
      {
        heading: 'Wusstest du?',
        items: [
          { label: 'Anzahl', body: 'Der Mensch besitzt über 600 Muskeln — sie machen rund 40 % des Körpergewichts aus.' },
          { label: 'Größter Muskel', body: 'Der größte Muskel des Körpers ist der große Gesäßmuskel.' },
          { label: 'Gegenspieler-Paare', body: 'Muskeln arbeiten oft in Paaren als Agonist und Antagonist (z. B. Bizeps und Trizeps).' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/die-muskulatur-arbeitsblatt.png',
    alt: 'Arbeitsblatt Die menschliche Muskulatur zum Ausfüllen',
    tasks: [
      {
        id: 'aufbau',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Aufbau der Muskulatur',
        prompt: 'Beschrifte die 12 nummerierten Muskeln.',
        items: [
          { number: 1, accept: ['Kaumuskel', 'Masseter'] },
          { number: 2, accept: ['Deltamuskel', 'Deltoideus', 'Schultermuskel'] },
          { number: 3, accept: ['Großer Brustmuskel', 'Grosser Brustmuskel', 'Brustmuskel', 'Pectoralis', 'Pectoralis major'] },
          { number: 4, accept: ['Bizeps', 'Biceps', 'Armbeuger', 'Bizeps brachii'] },
          { number: 5, accept: ['Gerader Bauchmuskel', 'Bauchmuskel', 'Bauchmuskeln', 'Rectus abdominis'] },
          { number: 6, accept: ['Quadrizeps', 'Quadriceps', 'Vierköpfiger Oberschenkelmuskel', 'Vierkoepfiger Oberschenkelmuskel', 'Oberschenkelstrecker'] },
          { number: 7, accept: ['Trapezmuskel', 'Trapezius', 'Kapuzenmuskel'] },
          { number: 8, accept: ['Trizeps', 'Triceps', 'Armstrecker', 'Trizeps brachii'] },
          { number: 9, accept: ['Breiter Rückenmuskel', 'Breiter Rueckenmuskel', 'Latissimus', 'Latissimus dorsi', 'Rückenmuskel', 'Rueckenmuskel'] },
          { number: 10, accept: ['Großer Gesäßmuskel', 'Grosser Gesaessmuskel', 'Gesäßmuskel', 'Gesaessmuskel', 'Gluteus', 'Gluteus maximus'] },
          { number: 11, accept: ['Beinbeuger', 'Hamstrings', 'Ischiocrurale Muskulatur', 'Oberschenkelbeuger'] },
          { number: 12, accept: ['Wadenmuskel', 'Wade', 'Gastrocnemius', 'Zwillingswadenmuskel'] },
        ],
      },
      {
        id: 'funktionen',
        type: 'open-list',
        title: 'Aufgabe 2: Funktionen der Muskulatur',
        prompt: 'Nenne sechs wichtige Funktionen der Muskulatur.',
        expectedCount: 6,
        pool: [
          { accept: ['Bewegung', 'Bewegungsfunktion', 'Bewegen', 'Fortbewegung'] },
          { accept: ['Haltung', 'Stabilität', 'Stabilitaet', 'Haltung und Stabilität', 'Haltung und Stabilitaet', 'Körperhaltung', 'Koerperhaltung', 'Stützfunktion', 'Stuetzfunktion'] },
          { accept: ['Wärmeerzeugung', 'Waermeerzeugung', 'Wärme', 'Waerme', 'Wärmeproduktion', 'Waermeproduktion', 'Thermoregulation'] },
          { accept: ['Schutz', 'Schutz innerer Organe', 'Schutz der Organe', 'Organschutz', 'Schutzfunktion'] },
          { accept: ['Atmung', 'Unterstützung der Atmung', 'Unterstuetzung der Atmung', 'Atemfunktion', 'Atemhilfe', 'Atemmuskulatur'] },
          { accept: ['Muskelpumpe', 'Venöser Rückfluss', 'Venoeser Rueckfluss', 'Blutrückfluss', 'Blutrueckfluss', 'Venenpumpe'] },
        ],
      },
      {
        id: 'strukturen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Strukturen',
        prompt: 'Benenne die abgebildeten Strukturen.',
        items: [
          { hint: 'Einzelner Muskel als Ganzes', accept: ['Muskel', 'Skelettmuskel', 'Muskelbauch'] },
          { hint: 'Verbindet Muskel mit Knochen', accept: ['Sehne', 'Sehnenansatz', 'Tendo'] },
          { hint: 'Beuger im Oberarm — gebeugter Arm', accept: ['Bizeps', 'Biceps', 'Armbeuger', 'Beuger', 'Agonist', 'Bizeps brachii'] },
          { hint: 'Querschnitt durch den Muskel mit Fasern und Bündeln', accept: ['Muskelfaserbündel', 'Muskelfaserbuendel', 'Muskelaufbau', 'Muskelquerschnitt', 'Muskelfasern', 'Muskelfaser', 'Faserbündel', 'Faserbuendel'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Zusatzfrage',
        items: [
          {
            prompt: '1. Worin unterscheidet sich Skelettmuskulatur von glatter Muskulatur?',
            keywords: ['willkürlich', 'willkuerlich', 'unwillkürlich', 'unwillkuerlich', 'bewusst', 'steuerbar', 'knochen', 'sehnen', 'organe', 'gefäße', 'gefaesse', 'darm', 'magen', 'ermüd', 'ermued', 'quergestreift', 'glatt'],
            minMatches: 3,
            sampleAnswer:
              'Die Skelettmuskulatur ist willkürlich (bewusst) steuerbar, über Sehnen mit den Knochen verbunden und bewegt den Körper. Die glatte Muskulatur arbeitet dagegen unwillkürlich (ohne unseren Willen), kommt in Organen und Blutgefäßen vor und reguliert dort z. B. Verdauung, Atemwege oder Blutdruck. Skelettmuskulatur ist quergestreift, glatte Muskulatur dagegen nicht und ermüdet langsamer.',
          },
          {
            prompt: '2. Warum arbeiten Muskeln häufig als Gegenspieler?',
            keywords: ['agonist', 'antagonist', 'gegenspieler', 'beuger', 'strecker', 'beugen', 'strecken', 'ziehen', 'kontrahieren', 'verkürzen', 'verkuerzen', 'bizeps', 'trizeps', 'bewegung', 'kontrolle', 'gelenk'],
            minMatches: 3,
            sampleAnswer:
              'Muskeln können sich nur zusammenziehen (kontrahieren), aber nicht aktiv strecken. Damit ein Gelenk in beide Richtungen bewegt werden kann, braucht es immer einen Gegenspieler: einen Agonisten, der die Bewegung ausführt (z. B. Bizeps beugt den Arm), und einen Antagonisten, der die Gegenbewegung übernimmt (z. B. Trizeps streckt den Arm). So lassen sich Bewegungen kontrolliert, fein dosiert und sicher ausführen.',
          },
        ],
      },
    ],
  },
};

export default dieMuskulatur;
