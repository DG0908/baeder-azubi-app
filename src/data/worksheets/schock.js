const schock = {
  id: 'schock',
  title: 'Schock',
  subtitle: 'Warnzeichen erkennen, richtig handeln und Notfälle einschätzen',
  category: 'first',
  icon: '🆘',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/schock-referenz.png',
    alt: 'Lernblatt Schock — Warnzeichen, Ursachen, Erste-Hilfe-Maßnahmen und Notfallkriterien',
    intro:
      'Ein Schock ist ein lebensbedrohlicher Zustand, bei dem Organe und Gewebe nicht mehr ausreichend mit Sauerstoff versorgt werden — meist als Folge eines schweren Kreislaufversagens (Blutverlust, Flüssigkeitsverlust, allergische Reaktion, Herzproblem, schwere Infektion). Ohne schnelle Erste Hilfe drohen Bewusstlosigkeit, Organversagen und Kreislaufstillstand. Merksatz: Schock = Sauerstoffmangel im Körper. Wichtigste Maßnahmen: Beruhigen — 112 — warm halten — beobachten.',
    sections: [
      {
        heading: 'Was ist ein Schock?',
        items: [
          { label: 'Lebensbedrohlicher Zustand', body: 'Bei einem Schock versagt die Versorgung der Organe mit Sauerstoff — ein medizinischer Notfall, der sofortige Hilfe verlangt.' },
          { label: 'Ursache: Kreislaufversagen', body: 'Das Herz-Kreislauf-System schafft es nicht mehr, ausreichend sauerstoffhaltiges Blut zu den Organen zu pumpen — durch Blutverlust, Flüssigkeitsmangel, Allergie, Herzproblem oder Infektion.' },
          { label: 'Folge: Sauerstoffmangel', body: 'Gehirn, Herz, Nieren und andere Organe bekommen zu wenig Sauerstoff. Ohne Hilfe kommt es zu Organversagen, Bewusstlosigkeit und Kreislaufstillstand.' },
          { label: 'Merksatz', body: 'Schock = Sauerstoffmangel im Körper. Schnelles Erkennen und Handeln rettet Leben.' },
        ],
      },
      {
        heading: 'Mögliche Ursachen',
        items: [
          { label: 'Starke Blutung / Blutverlust', body: 'Innere oder äußere Blutung → Volumenmangel-Schock (hypovolämisch). Häufigste Schockform nach Verletzungen.' },
          { label: 'Flüssigkeitsverlust', body: 'Schweres Erbrechen, Durchfall, Verbrennungen, übermäßiges Schwitzen — Körper verliert zu viel Flüssigkeit.' },
          { label: 'Schwere Verletzung', body: 'Polytrauma, große Wunden, Knochenbrüche — Schmerz, Blutverlust und Stress führen zum Schock.' },
          { label: 'Verbrennung', body: 'Großflächige Verbrennungen verursachen massiven Flüssigkeitsverlust über die zerstörte Haut.' },
          { label: 'Allergische Reaktion', body: 'Anaphylaktischer Schock — z. B. nach Insektenstich, Nahrungsmitteln, Medikamenten. Lebensgefahr binnen Minuten.' },
          { label: 'Infektion', body: 'Septischer Schock — schwere Infektion (Blutvergiftung) führt zu Kreislaufversagen.' },
          { label: 'Starke Schmerzen', body: 'Extreme Schmerzen können einen Schock auslösen oder verstärken.' },
          { label: 'Herzproblem', body: 'Kardiogener Schock — Herzinfarkt oder Herzschwäche, das Herz pumpt nicht mehr ausreichend.' },
        ],
      },
      {
        heading: 'Typische Warnzeichen',
        items: [
          { label: 'Blasse, kalte Haut', body: 'Blutgefäße ziehen sich zusammen, um lebenswichtige Organe zu versorgen — die Haut wird blass und kühl, oft fahl-grau.' },
          { label: 'Kalter Schweiß', body: 'Stressreaktion des Körpers — feuchte, klebrige Haut auf Stirn, Oberlippe, Nacken.' },
          { label: 'Schneller Puls', body: 'Das Herz schlägt schneller (über 100/min), um den Sauerstoffmangel auszugleichen — Puls oft schwach und fadenförmig.' },
          { label: 'Schnelle, flache Atmung', body: 'Tachypnoe — der Körper versucht, mehr Sauerstoff aufzunehmen. Atmung wirkt hektisch und oberflächlich.' },
          { label: 'Unruhe oder Angst', body: 'Person ist nervös, unruhig, ängstlich, weiß nicht, was mit ihr los ist — typisches Frühzeichen.' },
          { label: 'Schwäche / Zittern', body: 'Allgemeine Schwäche, zitternde Glieder, Person fühlt sich kraftlos.' },
          { label: 'Durst', body: 'Starkes Durstgefühl als Hinweis auf Flüssigkeitsmangel — besonders nach Blutverlust oder Verbrennung.' },
          { label: 'Verwirrtheit / Benommenheit', body: 'Sauerstoffmangel im Gehirn — Person wirkt benommen, verwirrt, antwortet verzögert oder wirr.' },
          { label: 'Später: Bewusstlosigkeit', body: 'Spätzeichen — wenn der Schock fortschreitet, verliert die Person das Bewusstsein. Lebensgefahr!' },
        ],
      },
      {
        heading: 'Erste Hilfe — richtig handeln',
        items: [
          { label: '1. Ruhe bewahren und Hilfe holen', body: 'Selbst ruhig bleiben — Hektik überträgt sich auf die Person und verschlechtert den Schock. Andere zur Unterstützung rufen.' },
          { label: '2. Notruf 112 wählen', body: 'Sofort 112 anrufen, "Verdacht auf Schock" nennen, Symptome und mögliche Ursache durchgeben.' },
          { label: '3. Person nicht allein lassen, beruhigen', body: 'Beruhigend sprechen, Sicherheit vermitteln — Angst verstärkt den Schock. Dabeibleiben, ansprechen, Atmung beobachten.' },
          { label: '4. Beengende Kleidung lockern, warm halten', body: 'Kragen, Krawatte, Gürtel öffnen — und IMMER warm halten (Decke, Jacke, Rettungsdecke). Schock-Personen kühlen schnell aus.' },
          { label: '5. Je nach Situation lagern', body: 'Bequem lagern — bei Bewusstlosigkeit mit normaler Atmung in stabile Seitenlage. Schocklage (Beine hoch) NICHT immer angezeigt — bei Atemnot, Brustschmerz, Kopfverletzung oder Verdacht auf Wirbelsäulenverletzung kontraindiziert.' },
          { label: '6. Atmung und Bewusstsein ständig überwachen', body: 'Mindestens alle 1–2 Minuten kontrollieren. Bei Atemausfall sofort HLW beginnen.' },
        ],
      },
      {
        heading: 'Wann sofort 112?',
        items: [
          { label: 'Bewusstseinsstörung oder Bewusstlosigkeit', body: 'Person reagiert verzögert, ist verwirrt oder reagiert gar nicht — Spätzeichen, höchste Eile.' },
          { label: 'Starke Atemnot', body: 'Atmung sehr schnell, sehr flach oder mit deutlicher Anstrengung — Sauerstoffmangel kritisch.' },
          { label: 'Anzeichen einer schweren Blutung', body: 'Sichtbare starke Blutung außen oder Hinweise auf innere Blutung (Bauchschmerz, blaue Flecken, Bewusstseinstrübung).' },
          { label: 'Verschlechterung des Zustands', body: 'Symptome werden schnell schlimmer — Puls steigt weiter, Haut wird kälter, Bewusstsein lässt nach.' },
          { label: 'Verdacht auf Herzproblem', body: 'Brustschmerzen, Schmerzen in Arm/Kiefer, kalter Schweiß bei Schock-Symptomen — möglicher Herzinfarkt.' },
          { label: 'Allergische Reaktion', body: 'Anaphylaktischer Schock nach Insektenstich, Nahrungsmittel, Medikament — sofort 112, Notfall-Pen anwenden falls vorhanden.' },
          { label: 'Schwere Verletzung', body: 'Polytrauma, große Wunden, Verbrennungen — Schock entwickelt sich oft erst nach Minuten. Frühzeitig 112.' },
          { label: 'Unsicherheit', body: 'Im Zweifel IMMER 112 — lieber einmal zu viel als zu wenig anrufen.' },
        ],
      },
      {
        heading: 'Was man vermeiden sollte',
        items: [
          { label: 'Person nicht allein lassen', body: 'Schock kann sich rasend schnell verschlechtern — kontinuierlich beobachten, ansprechen, Atmung kontrollieren.' },
          { label: 'Nichts zu essen oder trinken', body: 'Bei schwerem Zustand keine Flüssigkeiten oder Speisen — Aspirationsgefahr und mögliche OP-Vorbereitung in der Klinik.' },
          { label: 'Nicht unnötig aufrichten oder herumlaufen lassen', body: 'Aufrichten verschlechtert die Hirndurchblutung — Person liegen oder bequem sitzen lassen, je nach Lage.' },
          { label: 'Starke Blutungen nicht ignorieren', body: 'Sichtbare Blutungen mit Druckverband stillen — Blutverlust verstärkt den Schock dramatisch.' },
          { label: 'Person nicht zu kühl lagern', body: 'Auskühlung (Hypothermie) verschlimmert den Schock — IMMER zudecken, auch im Sommer.' },
        ],
      },
      {
        heading: 'Schock-Formen (Übersicht)',
        items: [
          { label: 'Hypovolämischer Schock', body: 'Volumenmangel — durch Blutverlust, Flüssigkeitsverlust, Verbrennungen. Häufigste Form.' },
          { label: 'Kardiogener Schock', body: 'Herzversagen — durch Herzinfarkt, Herzrhythmusstörungen, Herzmuskelschwäche. Pumpe versagt.' },
          { label: 'Anaphylaktischer Schock', body: 'Allergische Reaktion — Insektenstich, Nahrung, Medikament. Sehr schnelle Entwicklung, lebensgefährlich.' },
          { label: 'Septischer Schock', body: 'Schwere Infektion / Blutvergiftung — Bakterientoxine bringen den Kreislauf zum Erliegen.' },
          { label: 'Neurogener Schock', body: 'Verletzungen des Rückenmarks oder schwere Schmerzreaktion — Gefäße erschlaffen, Blutdruck fällt.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Schock', body: 'Lebensbedrohlicher Zustand mit Sauerstoffmangel der Organe — meist durch Kreislaufversagen.' },
          { label: 'Schocklage', body: 'Lagerung mit hochgelagerten Beinen (ca. 30°) — fördert venösen Rückstrom. Nur bei Volumenmangel ohne Atemnot/Brustschmerz/Wirbelsäulenverdacht.' },
          { label: 'Stabile Seitenlage', body: 'Lagerung der Wahl bei Bewusstlosigkeit MIT normaler Atmung — schützt vor Aspiration.' },
          { label: 'Anaphylaxie', body: 'Schwere allergische Reaktion mit Schock — Lebensgefahr binnen Minuten. Notfall-Pen (Adrenalin) anwenden, 112.' },
          { label: 'Sepsis', body: 'Blutvergiftung — schwere systemische Reaktion auf eine Infektion. Kann zum septischen Schock führen.' },
          { label: 'Hypothermie', body: 'Untertemperatur des Körpers — verschlechtert jeden Schock. IMMER warm halten.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Nach Verletzungen am Beckenrand', body: 'Stürze, Schnittverletzungen, große Wunden — Schock kann sich erst nach Minuten entwickeln. Person nie allein lassen, frühzeitig 112.' },
          { label: 'Nach Bergung aus dem Wasser', body: 'Beinahe-Ertrinken, Auskühlung, Erschöpfung — typische Schockauslöser. Warm halten, beobachten, 112.' },
          { label: 'Bei allergischen Reaktionen', body: 'Wespenstich am Beckenrand, Erdnüsse im Bistro — anaphylaktischer Schock möglich. Sofort 112, Notfall-Pen falls vorhanden.' },
          { label: 'Nach Kreislaufzwischenfällen', body: 'Kollaps in Sauna, Hitzschlag, Herzproblem — Person aus Risikobereich bringen, flach lagern, 112.' },
          { label: 'Rasches Erkennen rettet Leben', body: 'Aufmerksam bleiben — blasse Haut, kalter Schweiß, schneller Puls = Alarmzeichen, auch wenn die Person zunächst noch ansprechbar wirkt.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'BERUHIGEN — 112 — WARM HALTEN — BEOBACHTEN', body: 'Vier Schritte. Person beruhigen, Notruf veranlassen, vor Auskühlung schützen, Atmung und Bewusstsein kontinuierlich überwachen — bis Rettungsdienst eintrifft.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/schock-arbeitsblatt.png',
    alt: 'Arbeitsblatt Schock zum Ausfüllen',
    tasks: [
      {
        id: 'warnzeichen',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Typische Warnzeichen erkennen',
        prompt: 'Beschrifte die acht typischen Warnzeichen eines Schocks.',
        items: [
          { number: 1, accept: ['Blasse, kalte Haut', 'Blasse Haut', 'Kalte Haut', 'Blasse kalte Haut', 'Hautblässe', 'Hautblaesse', 'Blässe', 'Blaesse', 'Fahle Haut'] },
          { number: 2, accept: ['Kalter Schweiß', 'Kalter Schweiss', 'Schweißausbruch', 'Schweissausbruch', 'Kaltschweißigkeit', 'Kaltschweissigkeit', 'Schweiß', 'Schweiss', 'Klamme Haut'] },
          { number: 3, accept: ['Schneller Puls', 'Hoher Puls', 'Pulsbeschleunigung', 'Tachykardie', 'Schneller Herzschlag', 'Beschleunigter Puls', 'Pulsanstieg', 'Herzrasen'] },
          { number: 4, accept: ['Schnelle, flache Atmung', 'Schnelle flache Atmung', 'Schnelle Atmung', 'Flache Atmung', 'Schnelle / flache Atmung', 'Tachypnoe', 'Beschleunigte Atmung', 'Hechelnde Atmung', 'Hyperventilation'] },
          { number: 5, accept: ['Unruhe', 'Angst', 'Unruhe / Angst', 'Unruhe und Angst', 'Nervosität', 'Nervositaet', 'Ängstlichkeit', 'Aengstlichkeit', 'Angst und Unruhe', 'Erregung'] },
          { number: 6, accept: ['Schwäche', 'Schwaeche', 'Zittern', 'Schwäche / Zittern', 'Schwaeche / Zittern', 'Schwäche und Zittern', 'Schwaeche und Zittern', 'Kraftlosigkeit', 'Muskelschwäche', 'Muskelschwaeche', 'Schlottern'] },
          { number: 7, accept: ['Durst', 'Starkes Durstgefühl', 'Starkes Durstgefuehl', 'Durstgefühl', 'Durstgefuehl', 'Trockener Mund'] },
          { number: 8, accept: ['Verwirrtheit', 'Benommenheit', 'Verwirrtheit / Benommenheit', 'Verwirrtheit und Benommenheit', 'Verwirrt', 'Desorientierung', 'Bewusstseinstrübung', 'Bewusstseinstruebung', 'Eingeschränktes Bewusstsein', 'Eingeschraenktes Bewusstsein', 'Bewusstseinsveränderung', 'Bewusstseinsveraenderung'] },
        ],
      },
      {
        id: 'verhalten',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Richtiges Verhalten',
        prompt: 'Nenne sechs wichtige Erste-Hilfe-Maßnahmen bei Schock.',
        items: [
          { number: 1, accept: ['Hilfe holen', 'Ruhe bewahren', 'Ruhe bewahren und Hilfe holen', 'Hilfe rufen', 'Notruf vorbereiten', 'Hilfe holen / Notruf vorbereiten', 'Hilfe organisieren', 'Andere um Hilfe bitten'] },
          { number: 2, accept: ['Notruf 112', '112', 'Notruf', '112 wählen', '112 waehlen', 'Notruf 112 wählen', 'Notruf 112 waehlen', 'Notruf absetzen', 'Rettungsdienst rufen'] },
          { number: 3, accept: ['Person beruhigen', 'Beruhigen', 'Person nicht allein lassen', 'Nicht allein lassen', 'Beruhigen / nicht allein lassen', 'Person beruhigen / nicht allein lassen', 'Ansprechen und beruhigen', 'Dabeibleiben'] },
          { number: 4, accept: ['Warm halten', 'Zudecken', 'Warm halten / zudecken', 'Mit Decke zudecken', 'Decke', 'Vor Auskühlung schützen', 'Vor Auskuehlung schuetzen', 'Beengende Kleidung lockern und warm halten', 'Wärmen', 'Waermen', 'Warm einpacken'] },
          { number: 5, accept: ['Bequem lagern', 'Je nach Situation lagern', 'Schocklage', 'Schocklage / flache Lagerung', 'Flach lagern', 'Liegend lagern', 'Beine hochlagern', 'Bequeme Lagerung', 'Lagern', 'Stabile Seitenlage bei Bewusstlosigkeit'] },
          { number: 6, accept: ['Atmung und Bewusstsein beobachten', 'Atmung beobachten', 'Bewusstsein beobachten', 'Atmung kontrollieren', 'Beobachten', 'Atmung und Bewusstsein überwachen', 'Atmung und Bewusstsein ueberwachen', 'Vitalfunktionen kontrollieren', 'Atmung und Bewusstsein ständig überwachen', 'Atmung und Bewusstsein staendig ueberwachen', 'Überwachen', 'Ueberwachen'] },
        ],
      },
      {
        id: 'begriffe',
        type: 'numbered-labels',
        title: 'Aufgabe 3: Wichtige Begriffe / Situationen',
        prompt: 'Benenne die vier wichtigen Begriffe und Situationen.',
        items: [
          { number: 1, accept: ['Notruf 112', '112', 'Notruf', '112 wählen', '112 waehlen', 'Notruf absetzen', 'Rettungsdienst rufen', 'Notruf 112 wählen', 'Notruf 112 waehlen'] },
          { number: 2, accept: ['Warm halten', 'Zudecken', 'Warm halten / zudecken', 'Decke', 'Wärmen', 'Waermen', 'Vor Auskühlung schützen', 'Vor Auskuehlung schuetzen', 'Mit Decke zudecken', 'Warmhalten'] },
          { number: 3, accept: ['Beobachten', 'Zustand kontrollieren', 'Beobachten / Zustand kontrollieren', 'Überwachen', 'Ueberwachen', 'Atmung beobachten', 'Vitalfunktionen kontrollieren', 'Person beobachten', 'Zustand beobachten', 'Atmung und Bewusstsein beobachten'] },
          { number: 4, accept: ['Schocklage', 'Flache Lagerung', 'Schocklage / flache Lagerung', 'Flach lagern', 'Liegend lagern', 'Bequem lagern', 'Lagern', 'Beine hochlagern', 'Hochlagerung der Beine'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfragen',
        items: [
          {
            prompt: '1. Warum ist ein Schock lebensbedrohlich?',
            keywords: ['organe', 'gewebe', 'sauerstoff', 'mangel', 'durchblutung', 'kreislauf', 'versagen', 'organversagen', 'bewusstlos', 'kreislaufstillstand', 'lebensbedrohlich', 'sterben', 'absterben', 'tod', 'minute', 'sinkt'],
            minMatches: 3,
            sampleAnswer:
              'Bei einem Schock werden Organe und Gewebe nicht mehr ausreichend mit Sauerstoff versorgt — die Pumpfunktion des Kreislaufs versagt. Lebenswichtige Organe wie Gehirn, Herz und Nieren bekommen zu wenig Sauerstoff und beginnen zu schwächeln. Ohne schnelle Hilfe kann es zu Bewusstlosigkeit, Organversagen und schließlich zum Kreislaufstillstand kommen. Mit jeder Minute ohne Behandlung sinkt die Überlebenschance — deshalb sofort 112, beruhigen, warm halten und Atmung überwachen.',
          },
          {
            prompt: '2. Wann sollte bei einem Schock sofort der Notruf 112 gewählt werden?',
            keywords: ['bewusstsein', 'bewusstlos', 'bewusstseinsstörung', 'bewusstseinsstoerung', 'atemnot', 'atmung', 'blutung', 'verschlecht', 'herz', 'herzproblem', 'allergie', 'allergisch', 'verletzung', 'schwer', 'unsicher', '112', 'notruf'],
            minMatches: 3,
            sampleAnswer:
              'Sofort 112 rufen bei Bewusstseinsstörung oder Bewusstlosigkeit, starker Atemnot, Anzeichen einer schweren Blutung, schneller Verschlechterung des Zustands, Verdacht auf Herzproblem (z. B. Brustschmerz), allergischer Reaktion (Anaphylaxie nach Insektenstich, Nahrung oder Medikament) oder schwerer Verletzung. Auch bei Unsicherheit gilt: lieber einmal zu viel als zu wenig anrufen — der Schock kann sich rasend schnell verschlimmern.',
          },
        ],
      },
    ],
  },
};

export default schock;
