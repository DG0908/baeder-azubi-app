const waermehaushalt = {
  id: 'waermehaushalt',
  title: 'Wärmehaushalt & Thermoregulation',
  subtitle: 'Wie der Körper seine Temperatur konstant hält',
  category: 'health',
  icon: '🌡️',
  estimatedMinutes: 18,
  reference: {
    image: '/worksheets/waermehaushalt-referenz.png',
    alt: 'Lernblatt Wärmehaushalt und Thermoregulation mit allen Beschriftungen',
    intro:
      'Der Körper hält seine Kerntemperatur bei rund 37 °C konstant — egal ob es draußen heiß oder kalt ist. Diese Temperaturregelung nennt man Thermoregulation. Steuerzentrale ist der Hypothalamus im Zwischenhirn, der Soll- und Ist-Temperatur vergleicht und über Wärmebildung (Stoffwechsel, Muskelarbeit, Zittern) und Wärmeabgabe (Hautgefäße, Schweiß, Atmung, Strahlung) gegensteuert. Im Bäderbetrieb ist das Thema besonders wichtig — Sonne, kaltes Wasser und körperliche Belastung fordern die Regulation jeden Tag heraus.',
    sections: [
      {
        heading: 'Drei Säulen der Thermoregulation',
        items: [
          { label: 'Steuerzentrale (Hypothalamus)', body: 'Liegt im Zwischenhirn — vergleicht laufend Soll- und Ist-Temperatur und steuert Gefäße, Schweißdrüsen, Atmung und Muskeln.' },
          { label: 'Wärmebildung', body: 'Entsteht durch Stoffwechsel, Muskelarbeit und Muskelzittern. Auch braunes Fettgewebe (v. a. bei Babys) erzeugt Wärme.' },
          { label: 'Wärmeabgabe', body: 'Hauptsächlich über die Haut (Gefäßerweiterung, Schweiß), zusätzlich über Atmung (Wasserdampf) und Strahlung.' },
        ],
      },
      {
        heading: 'Bei Kälte — der Körper spart Wärme',
        items: [
          { label: 'Gefäßverengung', body: 'Hautgefäße verengen sich — weniger Blut an der Oberfläche, weniger Wärmeverlust.' },
          { label: 'Zittern (Muskelzittern)', body: 'Schnelle, unwillkürliche Muskelkontraktionen erzeugen zusätzliche Wärme.' },
          { label: 'Gänsehaut', body: 'Haare richten sich auf — die isolierende Luftschicht über der Haut wird dicker.' },
          { label: 'Weniger Wärmeabgabe', body: 'Atmung, Schweißproduktion und Hautdurchblutung werden zurückgefahren.' },
          { label: 'Verhalten', body: 'Wärmere Kleidung, Bewegung, warme Getränke — bewusste Verhaltensanpassung unterstützt die Regulation.' },
        ],
      },
      {
        heading: 'Bei Hitze — der Körper gibt Wärme ab',
        items: [
          { label: 'Gefäßerweiterung', body: 'Hautgefäße weiten sich — mehr Blut an der Oberfläche, mehr Wärmeabgabe an die Umgebung.' },
          { label: 'Schwitzen', body: 'Schweißdrüsen produzieren Schweiß, der auf der Haut austritt.' },
          { label: 'Verdunstungskälte', body: 'Beim Verdunsten entzieht der Schweiß der Haut Wärme — der wirksamste Kühlmechanismus.' },
          { label: 'Mehr Atmung', body: 'Schnellere und tiefere Atmung gibt mehr Wärme und Wasserdampf ab.' },
          { label: 'Verhalten', body: 'Schatten suchen, leichte Kleidung, viel trinken — sonst droht Überhitzung.' },
        ],
      },
      {
        heading: 'Regelkreis der Thermoregulation',
        items: [
          { label: '1. Reiz', body: 'Veränderung der Außen- oder Innentemperatur (Sonne, kaltes Wasser, Anstrengung …).' },
          { label: '2. Thermorezeptoren', body: 'Temperatursensoren in Haut und Körperkern melden die Abweichung.' },
          { label: '3. Hypothalamus', body: 'Vergleicht Ist-Wert mit Sollwert (ca. 37 °C) und entscheidet, was zu tun ist.' },
          { label: '4. Reaktion', body: 'Über Nerven werden Gefäße, Schweißdrüsen, Atmung und Muskeln gesteuert.' },
          { label: '5. Temperaturausgleich', body: 'Wärmebildung und -abgabe werden angepasst — die Kerntemperatur bleibt stabil.' },
        ],
      },
      {
        heading: 'Gefahren',
        items: [
          { label: 'Sonnenstich', body: 'Direkte Sonneneinstrahlung auf den ungeschützten Kopf — Überhitzung des Gehirns. Symptome: Kopfschmerzen, Übelkeit, Schwindel, hochroter Kopf. Maßnahmen: Kopf kühlen, Schatten, Flüssigkeit, ärztliche Hilfe.' },
          { label: 'Hitzschlag', body: 'Versagen der Temperaturregulation. Sehr hohe Kerntemperatur (>40 °C), heiße trockene Haut, Bewusstseinsstörungen möglich. Maßnahmen: Notfall! Sofort kühlen, Notruf 112.' },
          { label: 'Überhitzung / Hitzeerschöpfung', body: 'Zu viel Wärmebildung oder unzureichende Abgabe. Erschöpfung, Kopfschmerz, Übelkeit, Schwindel, Leistungsabfall. Maßnahmen: Kühlen, trinken, Pause, Elektrolyte zuführen.' },
          { label: 'Unterkühlung (Hypothermie)', body: 'Körper verliert zu viel Wärme. Verwirrung, Zittern, Verlangsamung von Herz und Atmung, Bewusstlosigkeit möglich. Maßnahmen: Wärmen, trockene Kleidung, warme Getränke, Hilfe holen.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Körperkerntemperatur', body: 'Temperatur im Körperinneren — normal ca. 37 °C (Normalbereich 36,5–37,5 °C).' },
          { label: 'Hypothalamus', body: 'Bereich im Zwischenhirn — Steuerzentrale für Wärmehaushalt, Hunger, Durst und vieles mehr.' },
          { label: 'Thermorezeptoren', body: 'Temperatursensoren in der Haut und im Körperkern, melden Wärme- und Kältereize.' },
          { label: 'Verdunstungskälte', body: 'Beim Verdunsten von Schweiß wird Wärme entzogen — kühlt den Körper effektiv.' },
          { label: 'Gefäßerweiterung (Vasodilatation)', body: 'Blutgefäße werden weiter — mehr Wärmeabgabe an die Hautoberfläche.' },
          { label: 'Gefäßverengung (Vasokonstriktion)', body: 'Blutgefäße werden enger — weniger Wärmeverlust über die Haut.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderalltag',
        items: [
          { label: 'Sauna', body: 'Wechsel von Hitze und Abkühlung trainiert die Thermoregulation und fördert die Durchblutung.' },
          { label: 'Freibadsonne', body: 'Sonnenschutz, Schatten und ausreichend trinken — beugt Sonnenstich und Hitzschlag vor.' },
          { label: 'Kaltes Wasser', body: 'Kaltreize stärken Abwehrkräfte und Anpassung — Badegäste sollten sich aber langsam gewöhnen.' },
          { label: 'Körperliche Belastung', body: 'Bei Anstrengung steigt die Wärmebildung — der Körper schwitzt und kühlt sich. Ausdauertraining verbessert die Regulation.' },
        ],
      },
      {
        heading: 'Wusstest du?',
        items: [
          { label: '37 °C', body: 'Die normale Körperkerntemperatur liegt bei rund 37 °C — der Normalbereich umfasst 36,5–37,5 °C.' },
          { label: 'Schweiß', body: 'Bei großer Hitze oder Belastung kann der Körper mehrere Liter Schweiß pro Stunde produzieren — deshalb ist Trinken so wichtig.' },
          { label: 'Wassertemperatur', body: 'Wasser leitet Wärme rund 25-mal besser als Luft — deshalb kühlt kaltes Wasser den Körper viel schneller aus als kalte Luft.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/waermehaushalt-arbeitsblatt.png',
    alt: 'Arbeitsblatt Wärmehaushalt und Thermoregulation zum Ausfüllen',
    tasks: [
      {
        id: 'aufbau',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Aufbau der Thermoregulation',
        prompt: 'Beschrifte die 12 nummerierten Bestandteile und Reaktionen.',
        items: [
          { number: 1, accept: ['Hypothalamus', 'Gehirn', 'Temperaturzentrum', 'Steuerzentrale'] },
          { number: 2, accept: ['Hautgefäße', 'Hautgefaesse', 'Blutgefäße', 'Blutgefaesse', 'Blutgefäße der Haut', 'Blutgefaesse der Haut', 'Hautdurchblutung'] },
          { number: 3, accept: ['Schwitzen', 'Schweiß', 'Schweiss', 'Schweißabgabe', 'Schweissabgabe', 'Schweißbildung', 'Schweissbildung'] },
          { number: 4, accept: ['Verdunstung', 'Verdunstungskälte', 'Verdunstungskaelte', 'Kühlung durch Verdunstung', 'Kuehlung durch Verdunstung', 'Schweißverdunstung', 'Schweissverdunstung'] },
          { number: 5, accept: ['Muskulatur', 'Muskeln', 'Muskelarbeit', 'Wärmebildung durch Muskelarbeit', 'Waermebildung durch Muskelarbeit'] },
          { number: 6, accept: ['Atmung', 'Ausatmung', 'Atemluft', 'Wärmeabgabe über Atmung', 'Waermeabgabe ueber Atmung'] },
          { number: 7, accept: ['Wärmeabgabe', 'Waermeabgabe', 'Wärmestrahlung', 'Waermestrahlung', 'Abstrahlung', 'Wärmeverlust', 'Waermeverlust'] },
          { number: 8, accept: ['Körperkerntemperatur', 'Koerperkerntemperatur', 'Temperatur', 'Körpertemperatur', 'Koerpertemperatur', '37 Grad', '37 °C', '37°C'] },
          { number: 9, accept: ['Gefäßerweiterung', 'Gefaesserweiterung', 'Vasodilatation', 'Erweiterung der Blutgefäße', 'Erweiterung der Blutgefaesse'] },
          { number: 10, accept: ['Gefäßverengung', 'Gefaessverengung', 'Vasokonstriktion', 'Verengung der Blutgefäße', 'Verengung der Blutgefaesse'] },
          { number: 11, accept: ['Zittern', 'Muskelzittern', 'Kältezittern', 'Kaeltezittern'] },
          { number: 12, accept: ['Beingefäße', 'Beingefaesse', 'Blutgefäße der Beine', 'Blutgefaesse der Beine', 'Periphere Durchblutung', 'Beinvenen', 'Periphere Gefäße', 'Periphere Gefaesse'] },
        ],
      },
      {
        id: 'funktionen',
        type: 'open-list',
        title: 'Aufgabe 2: Funktionen der Thermoregulation',
        prompt: 'Nenne sechs wichtige Funktionen oder Aufgaben des Wärmehaushalts.',
        expectedCount: 6,
        pool: [
          { accept: ['Wärmebildung', 'Waermebildung', 'Wärme bilden', 'Waerme bilden', 'Wärmeproduktion', 'Waermeproduktion'] },
          { accept: ['Wärmeabgabe', 'Waermeabgabe', 'Wärme abgeben', 'Waerme abgeben', 'Wärmeverlust steuern', 'Waermeverlust steuern'] },
          { accept: ['Konstante Körpertemperatur', 'Konstante Koerpertemperatur', 'Körpertemperatur konstant halten', 'Koerpertemperatur konstant halten', 'Temperatur konstant', '37 Grad halten', 'Kerntemperatur halten'] },
          { accept: ['Schutz vor Überhitzung', 'Schutz vor Ueberhitzung', 'Überhitzung verhindern', 'Ueberhitzung verhindern', 'Überhitzungsschutz', 'Ueberhitzungsschutz'] },
          { accept: ['Schutz vor Auskühlung', 'Schutz vor Auskuehlung', 'Auskühlung verhindern', 'Auskuehlung verhindern', 'Schutz vor Unterkühlung', 'Schutz vor Unterkuehlung', 'Kälteschutz', 'Kaelteschutz'] },
          { accept: ['Anpassung an Umgebung', 'Anpassung an die Umgebung', 'Anpassung', 'Anpassung an Temperatur', 'Reaktion auf Temperaturänderung', 'Reaktion auf Temperaturaenderung'] },
          { accept: ['Regelkreis', 'Soll-Ist-Vergleich', 'Soll-/Ist-Vergleich', 'Sollwertvergleich', 'Steuerung über Hypothalamus', 'Steuerung ueber Hypothalamus'] },
          { accept: ['Schweißbildung', 'Schweissbildung', 'Schwitzen', 'Schweiß zur Kühlung', 'Schweiss zur Kuehlung'] },
          { accept: ['Gefäßregulation', 'Gefaessregulation', 'Steuerung der Gefäße', 'Steuerung der Gefaesse', 'Hautdurchblutung steuern'] },
        ],
      },
      {
        id: 'strukturen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Strukturen / Situationen',
        prompt: 'Benenne die abgebildeten Strukturen und Reaktionen.',
        items: [
          { hint: 'Hautausschnitt mit Schweißtropfen und Schweißdrüse', accept: ['Schweißdrüse', 'Schweissdruese', 'Schweißbildung', 'Schweissbildung', 'Schwitzen', 'Schweiß', 'Schweiss'] },
          { hint: 'Arm mit Muskel und Zitter-Linien', accept: ['Zittern', 'Muskelzittern', 'Kältezittern', 'Kaeltezittern', 'Schüttelfrost', 'Schuettelfrost'] },
          { hint: 'Blutgefäß mit roten Pfeilen nach außen — bei Hitze', accept: ['Gefäßerweiterung', 'Gefaesserweiterung', 'Vasodilatation', 'Gefäßweitstellung', 'Gefaessweitstellung', 'Weitstellung'] },
          { hint: 'Blutgefäß mit blauen Pfeilen nach innen — bei Kälte', accept: ['Gefäßverengung', 'Gefaessverengung', 'Vasokonstriktion', 'Gefäßengstellung', 'Gefaessengstellung', 'Engstellung'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Zusatzfrage',
        items: [
          {
            prompt: '1. Wie reagiert der Körper bei Hitze, um sich abzukühlen?',
            keywords: ['gefäß', 'gefaess', 'erweitern', 'weitstellung', 'vasodilatation', 'durchblutung', 'haut', 'schweiß', 'schweiss', 'schwitzen', 'verdunstung', 'verdunstungskälte', 'verdunstungskaelte', 'atmung', 'kühl', 'kuehl', 'wärmeabgabe', 'waermeabgabe', 'strahlung'],
            minMatches: 4,
            sampleAnswer:
              'Bei Hitze weiten sich die Hautgefäße (Vasodilatation) — mehr Blut gelangt an die Oberfläche und gibt Wärme ab. Die Schweißdrüsen produzieren Schweiß, der auf der Haut verdunstet und ihr dabei Wärme entzieht (Verdunstungskälte). Zusätzlich wird die Atmung schneller, sodass mehr Wärme und Wasserdampf abgegeben wird. Insgesamt erhöht der Körper so die Wärmeabgabe und schützt sich vor Überhitzung.',
          },
          {
            prompt: '2. Warum kann kaltes Wasser den Körper schnell auskühlen?',
            keywords: ['wasser', 'leitet', 'wärmeleitung', 'waermeleitung', 'wärmeleitfähigkeit', 'waermeleitfaehigkeit', 'luft', 'schnell', 'wärmeverlust', 'waermeverlust', 'haut', 'gefäß', 'gefaess', 'verengung', 'kalt', 'unterkühlung', 'unterkuehlung', 'auskühlung', 'auskuehlung', '25', 'mal'],
            minMatches: 4,
            sampleAnswer:
              'Wasser leitet Wärme ungefähr 25-mal besser als Luft. Deshalb verliert der Körper im kalten Wasser sehr schnell Wärme an die Umgebung — auch wenn die Lufttemperatur ähnlich wäre, würde man dort viel langsamer auskühlen. Die Hautgefäße verengen sich zwar (Vasokonstriktion), um den Wärmeverlust zu reduzieren, aber das reicht im kalten Wasser oft nicht aus. Bei längerer Kälteeinwirkung droht Unterkühlung — deshalb ist im Bäderbetrieb die Aufsicht auf Auskühlung (besonders bei Kindern und älteren Badegästen) so wichtig.',
          },
        ],
      },
    ],
  },
};

export default waermehaushalt;
