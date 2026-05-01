const rettungsgeraete = {
  id: 'rettungsgeraete',
  title: 'Rettungsgeräte im Schwimmbad',
  subtitle: 'Auswahl und Einsatz von Rettungsmitteln',
  category: 'swim',
  icon: '🛟',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/rettungsgeraete-referenz.png',
    alt: 'Lernblatt Rettungsgeräte im Schwimmbad — Stange, Ring, Ball, Wurfleine, Gurtretter, Boje',
    intro:
      'Rettungsgeräte helfen, eine Person im Wasser schnell, sicher und möglichst eigenschutzorientiert zu erreichen oder zu sichern. Die Auswahl des richtigen Geräts hängt von Entfernung, Zustand der Person, Erreichbarkeit und Gefährdung des Retters ab. Sechs Standard-Geräte: Rettungsstange (kurze Distanz), Rettungsring mit Wurfleine, Rettungsball mit Wurfleine, Wurfleine/Wurfsack (mittlere Distanz), Gurtretter und Rettungsboje (schwimmerischer Einsatz). Wichtigste Regel: Erst retten, ohne sich selbst zu gefährden — wenn möglich Rettungsgerät einsetzen, Abstand halten, ruhig ansprechen, Hilfe alarmieren und kontrolliert sichern.',
    sections: [
      {
        heading: 'Worum geht es?',
        items: [
          { label: 'Rettungsgeräte = Eigenschutz', body: 'Sie ermöglichen es, eine Person zu sichern oder ans Ufer zu bringen, ohne selbst ins Wasser zu müssen oder mit zusätzlichem Auftrieb. Eigenschutz wird durch Geräte massiv erhöht.' },
          { label: 'Auswahl nach Situation', body: 'Entfernung zur Person, Bewusstseinszustand (ansprechbar oder bewusstlos), Greiffähigkeit, Wassertiefe und eigene Möglichkeiten — alle Faktoren beeinflussen die Geräte-Wahl.' },
          { label: 'Sechs Standard-Geräte im Bäderbetrieb', body: 'Rettungsstange, Rettungsring mit Wurfleine, Rettungsball mit Wurfleine, Wurfleine/Wurfsack, Gurtretter, Rettungsboje. Jedes Bad hat mindestens diese Grundausstattung griffbereit.' },
          { label: 'Reihenfolge: Distanz vor Berührung', body: 'Erst Geräte einsetzen, die Distanz wahren (Stange, Wurf-Geräte). Schwimmerische Rettung mit Boje oder Gurtretter nur, wenn die Distanzrettung nicht reicht.' },
        ],
      },
      {
        heading: '1. Rettungsstange',
        items: [
          { label: 'Wann einsetzen?', body: 'Bei Personen in Beckennähe, die erreichbar sind oder greifen können. Klassischer Einsatz im Schwimmbad bei Personen am Beckenrand.' },
          { label: 'Vorteil', body: 'Schnell einsetzbar, der Retter bleibt außerhalb des Wassers — maximaler Eigenschutz. Keine Wurftechnik nötig, einfach hinhalten.' },
          { label: 'Grenze / Achtung', body: 'Nur für kurze Distanz (typisch 2–4 m). Bei bewusstlosen Personen nur eingeschränkt geeignet — die Person muss greifen können.' },
          { label: 'Praxistipp', body: 'Stange seitlich oder von hinten anreichen, NICHT von oben — Person könnte panisch nach der Stange greifen und den Retter ins Wasser ziehen.' },
        ],
      },
      {
        heading: '2. Rettungsring mit Wurfleine',
        items: [
          { label: 'Wann einsetzen?', body: 'Bei größerer Entfernung (8–15 m), wenn die Person bei Bewusstsein ist und sich festhalten kann. Klassisches Wurf-Rettungsmittel.' },
          { label: 'Vorteil', body: 'Auftriebshilfe mit Leine — die Person kann zur Kante gezogen werden. Rettung über Distanz möglich, Retter bleibt am Ufer.' },
          { label: 'Grenze / Achtung', body: 'Zielwurf muss geübt sein — eine ungeübte Person verfehlt die Position. Nicht ideal, wenn die Person nicht greifen kann (bewusstlos).' },
          { label: 'Praxistipp', body: 'Vor dem Wurf das Leinen-Ende festhalten oder am Beckenrand fixieren — sonst geht die Leine mit dem Ring weg. Ring leicht hinter die Person werfen, dann zu sich heranziehen.' },
        ],
      },
      {
        heading: '3. Rettungsball mit Wurfleine',
        items: [
          { label: 'Wann einsetzen?', body: 'Wenn eine Person weiter entfernt ist und ein kompaktes Wurfgerät benötigt wird. Kleiner und kompakter als der Ring, daher leichter zielgenau zu werfen.' },
          { label: 'Vorteil', body: 'Guter Auftrieb, schnelle Hilfe, Retter bleibt an Land. Kompakter Ball ist aerodynamischer — Wurfdistanz oft größer als beim Ring.' },
          { label: 'Grenze / Achtung', body: 'Benötigt Wurfgenauigkeit. Die Person muss den Ball greifen können — kein Auftrieb für bewusstlose Personen.' },
          { label: 'Praxistipp', body: 'Vor allem an Stränden und in offenen Gewässern beliebt. Vom Beckenrand aus mit etwas Schwung werfen, Leine vorher entwirren.' },
        ],
      },
      {
        heading: '4. Wurfleine / Wurfsack',
        items: [
          { label: 'Wann einsetzen?', body: 'Bei Distanzrettung, wenn die Person ansprechbar ist und eine Leine greifen kann. Typische Einsatzdistanz: 15–20 m.' },
          { label: 'Vorteil', body: 'Kompakt, schnell, eigenschutzorientiert. Beim Wurf rollt sich die Leine aus dem Sack ab — kein Verheddern. Standard im Wildwasser-Rettungssport.' },
          { label: 'Grenze / Achtung', body: 'Nur wirksam, wenn die Person aktiv mitwirken kann (greifen, festhalten). Kein Auftrieb — die Person muss schwimmen können.' },
          { label: 'Praxistipp', body: 'Vor dem Wurf laut „Leine!" rufen, damit die Person aufmerksam wird. Wurfsack mit ausgerolltem Ende werfen, das andere Ende in der Hand halten.' },
        ],
      },
      {
        heading: '5. Gurtretter',
        items: [
          { label: 'Wann einsetzen?', body: 'Wenn der Retter ins Wasser muss, besonders bei erschöpften, unsicheren oder bewusstlosen Personen. Der Retter schwimmt mit dem Gurt zur Person.' },
          { label: 'Vorteil', body: 'Auftriebskörper zwischen Retter und Opfer — mehr Kontrolle und Eigenschutz. Person greift den Gurt, Retter behält Distanz und kann besser schleppen.' },
          { label: 'Grenze / Achtung', body: 'Nur nach Einweisung und Übung sicher anwenden — Anlegen und Bedienen müssen trainiert sein. Ungeübter Einsatz kann zu Eigengefährdung führen.' },
          { label: 'Praxistipp', body: 'Standard-Ausrüstung in Freibädern und an Stränden (Lifeguard-Gerät). Vor jeder Schicht Funktionsprüfung — Karabiner, Leine, Auftriebskörper.' },
        ],
      },
      {
        heading: '6. Rettungsboje',
        items: [
          { label: 'Wann einsetzen?', body: 'Beim schwimmerischen Einsatz, besonders im Freibad, Außenbereich oder bei längeren Strecken. Klassisches Rettungsschwimmer-Gerät.' },
          { label: 'Vorteil', body: 'Bietet Auftrieb und Abstand zum Opfer. Retter schwimmt mit der Boje, Person hält sich daran fest — Retter wird nicht direkt umklammert.' },
          { label: 'Grenze / Achtung', body: 'Erfordert sicheren Umgang und regelmäßiges Training. Wenn die Boje nicht richtig angelegt ist, kann sie behindern statt helfen.' },
          { label: 'Praxistipp', body: 'Boje wird mit Schultergurt geschwommen — Hand frei für Brustschwimmen. Bei Erreichen der Person: Boje vor sich halten, Person umarmt sie, dann zurück schleppen.' },
        ],
      },
      {
        heading: 'Einsatzentscheidung — Schritt für Schritt',
        items: [
          { label: '1. Person in Reichweite?', body: 'Wenn ja: Rettungsstange nutzen — schnellster und sicherster Eigenschutz.' },
          { label: '2. Person ansprechbar und greiffähig?', body: 'Wenn ja: Rettungsring, Rettungsball oder Wurfleine einsetzen — Distanzrettung mit Leine, Retter bleibt an Land.' },
          { label: '3. Person nicht greiffähig oder zu weit entfernt?', body: 'Schwimmerische Rettung mit geeignetem Rettungsmittel — Gurtretter (mehr Kontrolle, Eigenschutz) oder Rettungsboje (Auftrieb für die Person).' },
          { label: '4. Hilfe alarmieren', body: 'IMMER parallel: zweite Aufsicht oder Kollegen rufen, ggf. 112. Auch eine erfolgreiche Rettung kann Folge-Maßnahmen brauchen (Erste Hilfe, ärztliche Abklärung).' },
          { label: 'Goldene Regel', body: 'Distanz vor Berührung: Wann immer es geht, Rettungsmittel einsetzen, ohne ins Wasser zu müssen. Erst wenn das nicht reicht, schwimmerische Rettung mit Boje oder Gurtretter.' },
        ],
      },
      {
        heading: 'Eigenschutz — warum so wichtig?',
        items: [
          { label: 'Aus einem Retter wird sonst ein zweites Opfer', body: 'Wer sich selbst gefährdet, kann nicht mehr helfen — und braucht im schlimmsten Fall selbst Rettung. Aus einer Person in Not werden zwei.' },
          { label: 'Panische Personen sind unberechenbar', body: 'Eine ertrinkende Person greift instinktiv nach allem, was Halt verspricht — auch nach dem Retter. Ohne Eigenschutz droht Umklammerung und gemeinsames Untergehen.' },
          { label: 'Hilfsmittel halten Distanz', body: 'Rettungsstange, Wurfleinen und Bojen schaffen Abstand. Selbst wenn die Person panisch greift, geschieht das am Hilfsmittel — nicht am Retter.' },
          { label: 'Ruhig und kontrolliert handeln', body: 'Vor jedem Einsatz kurz die Lage einschätzen — welches Gerät passt, wie ist die Distanz, gibt es Helfer? Hektik führt zu Fehlern, Ruhe spart Zeit.' },
          { label: 'Gerätekenntnisse sind Pflicht', body: 'Aufsichtskräfte müssen jedes der sechs Geräte sicher bedienen können — Wurftechnik, Anlegen, Schleppen. Übung mindestens jährlich.' },
        ],
      },
      {
        heading: 'Was bedeuten die Begriffe?',
        items: [
          { label: 'Rettungsstange', body: 'Lange Stange (meist 3–4 m) mit Haken oder Greifer am Ende — für Personen in Beckennähe. Retter steht auf festem Boden, kein Wasserkontakt nötig.' },
          { label: 'Rettungsring mit Wurfleine', body: 'Auftriebsring (Hartschaum oder aufblasbar) mit angebundener Leine — wird zum Opfer geworfen, dann zurückgezogen.' },
          { label: 'Rettungsball mit Wurfleine', body: 'Kompakter Ball mit Auftrieb und Leine — kleiner und aerodynamischer als der Ring, größere Wurfdistanz möglich.' },
          { label: 'Wurfleine / Wurfsack', body: 'Leine in einem Sack verstaut, aus dem sie sich beim Wurf abrollt — Reichweite oft 15–20 m, Standard im Rettungssport.' },
          { label: 'Gurtretter', body: 'Lifeguard-Gerät — Auftriebskörper mit Gurt und Leine. Retter schwimmt damit zur Person, legt den Gurt um sie und schleppt sie zurück.' },
          { label: 'Rettungsboje', body: 'Großer Auftriebskörper mit Schultergurt — wird vom Retter mitgeschwommen, die Person hält sich daran fest. Klassisches Rettungsschwimmer-Gerät.' },
          { label: 'Eigenschutz', body: 'Schutz der eigenen Person vor Verletzung oder Ertrinken — oberste Priorität bei jeder Rettung. Ohne Eigenschutz keine Fremdrettung.' },
          { label: 'Distanzrettung', body: 'Rettung mit Hilfsmitteln, ohne ins Wasser zu müssen — Stange, Ring, Ball, Wurfleine. Sicherste Form der Rettung.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Standorte der Rettungsgeräte', body: 'Alle sechs Geräte müssen schnell erreichbar sein — meist an mehreren Stellen am Beckenrand, an der Wand befestigt. Standorte allen Aufsichtskräften bekannt.' },
          { label: 'Tägliche Sichtkontrolle', body: 'Vor Schichtbeginn: Sind alle Geräte da? Wurfleine sauber aufgewickelt? Boje und Gurtretter unbeschädigt? Defekte sofort melden und ersetzen.' },
          { label: 'Übungswerfen / Übungseinsätze', body: 'Mindestens jährlich Wurftechnik mit Ring und Wurfleine üben — auf Zielgenauigkeit und Geschwindigkeit. Im Team trainieren.' },
          { label: 'Rettungsschwimm-Auffrischung', body: 'Alle 4 Jahre DLRG-Auffrischung — Gurtretter und Boje gehören zum Pflichtprogramm. Wer länger nicht geübt hat, ist im Ernstfall langsamer.' },
          { label: 'Sichtbarkeit der Geräte', body: 'Markante Farben (rot, orange, gelb), klare Beschilderung, freier Zugang. Im Notfall zählt jede Sekunde — Geräte müssen sofort gefunden werden.' },
          { label: 'Schulung neuer Mitarbeiter', body: 'Jeder neue Aufsichtskraft sofort am ersten Tag die Standorte aller Geräte zeigen und Funktion erklären. Erste Übungswürfe machen.' },
          { label: 'Dokumentation der Einsätze', body: 'Jeden Rettungseinsatz mit Geräteeinsatz dokumentieren — Zeit, Ort, Gerät, Person, Hergang. Wichtig für Auswertung und Versicherung.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'ERST RETTEN, OHNE SICH SELBST ZU GEFÄHRDEN', body: 'Wenn möglich: Rettungsgerät einsetzen, Abstand halten, ruhig ansprechen, Hilfe alarmieren und kontrolliert sichern. Eigenschutz hat IMMER Vorrang vor Fremdrettung.' },
          { label: 'DISTANZ VOR BERÜHRUNG', body: 'Erst Stange, dann Wurfgeräte, erst zuletzt schwimmerische Rettung mit Boje oder Gurtretter. Jeder Schritt mit mehr Eigenschutz und mehr Distanz ist der bessere.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/rettungsgeraete-arbeitsblatt.png',
    alt: 'Arbeitsblatt Rettungsgeräte im Schwimmbad zum Ausfüllen',
    tasks: [
      {
        id: 'geraete',
        type: 'open-list',
        title: 'Aufgabe 1: Nenne vier Rettungsgeräte',
        prompt: 'Nenne vier Rettungsgeräte aus dem Schwimmbad.',
        expectedCount: 4,
        pool: [
          { accept: ['Rettungsstange', 'Stange', 'Rettungs-Stange', 'Bergungsstange'] },
          { accept: ['Rettungsring', 'Rettungsring mit Wurfleine', 'Ring mit Wurfleine', 'Rettungsring mit Leine', 'Wurfring'] },
          { accept: ['Rettungsball', 'Rettungsball mit Wurfleine', 'Rescue Ball', 'Wurfball'] },
          { accept: ['Wurfleine', 'Wurfsack', 'Wurfleine / Wurfsack', 'Wurf-Sack', 'Wurf-Leine', 'Rettungsleine'] },
          { accept: ['Gurtretter', 'Gurt-Retter', 'Lifeguard-Gurt', 'Rescue-Gurt'] },
          { accept: ['Rettungsboje', 'Boje', 'Rescue-Boje', 'Lifeguard-Boje'] },
        ],
      },
      {
        id: 'zuordnen',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Ordne zu',
        prompt: 'Trage zu jedem Rettungsgerät (1–6) den passenden Buchstaben (A–F) ein. A: Personen in Beckennähe, Retter bleibt außerhalb. B: Auftriebshilfe mit Leine, Person greiffähig. C: Kompaktes Wurfgerät auf Distanz. D: Nur wirksam, wenn Person Leine greifen kann. E: Schwimmerischer Einsatz mit mehr Eigenschutz. F: Auftrieb und Abstand zum Opfer, längere Strecken.',
        items: [
          { number: 1, accept: ['A', 'a'] },
          { number: 2, accept: ['B', 'b'] },
          { number: 3, accept: ['C', 'c'] },
          { number: 4, accept: ['D', 'd'] },
          { number: 5, accept: ['E', 'e'] },
          { number: 6, accept: ['F', 'f'] },
        ],
      },
      {
        id: 'rettungsstange',
        type: 'keyword-text',
        title: 'Aufgabe 3: Wann setzt man eine Rettungsstange ein?',
        items: [
          {
            prompt: 'Erkläre kurz, wann man eine Rettungsstange einsetzt.',
            keywords: ['beckennähe', 'beckennaehe', 'nah', 'kurze distanz', 'erreichbar', 'greifen', 'greiffähig', 'greiffaehig', 'außerhalb', 'ausserhalb', 'wasser', 'eigenschutz', 'kein wasser', 'beckenrand'],
            minMatches: 3,
            sampleAnswer:
              'Eine Rettungsstange setzt man ein, wenn sich eine Person in Beckennähe befindet, erreichbar ist oder noch greifen kann. Der große Vorteil ist, dass der Retter außerhalb des Wassers bleiben kann — maximaler Eigenschutz. Die Stange wird seitlich oder von hinten angereicht, nicht von oben, damit die Person nicht panisch nach unten zieht.',
          },
        ],
      },
      {
        id: 'ankreuzen',
        type: 'open-list',
        title: 'Aufgabe 4: Ankreuzen — weiter entfernt, ansprechbar, greiffähig',
        prompt: 'Welche Rettungsgeräte eignen sich besonders, wenn eine Person weiter entfernt, aber ansprechbar und greiffähig ist? Nenne mindestens drei.',
        expectedCount: 3,
        pool: [
          { accept: ['Rettungsring', 'Rettungsring mit Wurfleine', 'Ring mit Wurfleine', 'Rettungsring mit Leine', 'Wurfring'] },
          { accept: ['Rettungsball', 'Rettungsball mit Wurfleine', 'Rescue Ball', 'Wurfball'] },
          { accept: ['Wurfleine', 'Wurfsack', 'Wurfleine / Wurfsack', 'Wurf-Sack', 'Wurf-Leine', 'Rettungsleine'] },
        ],
      },
      {
        id: 'eigenschutz',
        type: 'keyword-text',
        title: 'Aufgabe 5: Eigenschutz',
        items: [
          {
            prompt: 'Warum ist der Eigenschutz bei einer Wasserrettung wichtig?',
            keywords: ['retter', 'opfer', 'zweites', 'gefährdet', 'gefaehrdet', 'helfen', 'kann nicht', 'panik', 'umklammerung', 'abstand', 'rettungsgerät', 'rettungsgeraet', 'kontrolliert', 'fremdrettung'],
            minMatches: 3,
            sampleAnswer:
              'Der Eigenschutz ist wichtig, damit aus einem Retter nicht selbst ein weiteres Opfer wird. Ein gefährdeter Retter kann nicht mehr helfen und braucht im schlimmsten Fall selbst Rettung — aus einer Person in Not werden zwei. Deshalb soll möglichst mit Abstand, mit einem Rettungsgerät und kontrolliert gearbeitet werden. Panische Personen greifen instinktiv nach allem — ohne Eigenschutz droht Umklammerung.',
          },
        ],
      },
      {
        id: 'fall1',
        type: 'keyword-text',
        title: 'Aufgabe 6: Fallbeispiel 1 — Person nah am Beckenrand',
        items: [
          {
            prompt: 'Eine Person befindet sich nah am Beckenrand und kann noch greifen. Welches Rettungsgerät ist am sinnvollsten? Begründe kurz.',
            keywords: ['rettungsstange', 'stange', 'kurze distanz', 'schnell', 'einsetzbar', 'außerhalb', 'ausserhalb', 'wasser', 'kein wasser', 'eigenschutz', 'beckenrand', 'greifen'],
            minMatches: 3,
            sampleAnswer:
              'Am sinnvollsten ist die Rettungsstange. Sie ist schnell einsetzbar, geeignet für kurze Distanz und der Retter muss nicht ins Wasser gehen — maximaler Eigenschutz. Die Person kann nach der Stange greifen oder wird mit dem Haken zur Wand gezogen.',
          },
        ],
      },
      {
        id: 'fall2',
        type: 'open-list',
        title: 'Aufgabe 7: Fallbeispiel 2 — Person weiter entfernt, ansprechbar',
        prompt: 'Eine Person ist weiter entfernt, ansprechbar und kann sich festhalten. Nenne zwei geeignete Rettungsgeräte.',
        expectedCount: 2,
        pool: [
          { accept: ['Rettungsring', 'Rettungsring mit Wurfleine', 'Ring mit Wurfleine'] },
          { accept: ['Rettungsball', 'Rettungsball mit Wurfleine', 'Rescue Ball'] },
          { accept: ['Wurfleine', 'Wurfsack', 'Wurfleine / Wurfsack'] },
        ],
      },
      {
        id: 'fall3',
        type: 'keyword-text',
        title: 'Aufgabe 8: Fallbeispiel 3 — Person nicht greiffähig, Retter muss ins Wasser',
        items: [
          {
            prompt: 'Eine Person ist nicht greiffähig und der Retter muss ins Wasser. Welche Rettungsmittel kommen eher infrage?',
            keywords: ['gurtretter', 'rettungsboje', 'boje', 'auftrieb', 'abstand', 'opfer', 'eigenschutz', 'schwimmerisch', 'rettung', 'kontrolle', 'umklammerung'],
            minMatches: 3,
            sampleAnswer:
              'Eher infrage kommen Gurtretter und Rettungsboje. Beide geben Auftrieb, schaffen mehr Abstand zum Opfer und verbessern den Eigenschutz bei der schwimmerischen Rettung. Der Retter behält Kontrolle, die Person greift den Auftriebskörper statt den Retter — Risiko der Umklammerung deutlich reduziert.',
          },
        ],
      },
    ],
  },
};

export default rettungsgeraete;
