const anaphylaktischerSchock = {
  id: 'anaphylaktischer-schock',
  title: 'Anaphylaktischer Schock',
  subtitle: 'Warnzeichen erkennen, richtig handeln und Notfälle einschätzen',
  category: 'first',
  icon: '🐝',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/anaphylaktischer-schock-referenz.png',
    alt: 'Lernblatt Anaphylaktischer Schock — Auslöser, Warnzeichen, Erste-Hilfe-Maßnahmen und Adrenalin-Autoinjektor',
    intro:
      'Eine Anaphylaxie ist eine schwere allergische Reaktion, die innerhalb von Minuten lebensbedrohlich werden kann. Sie kann Haut, Atemwege, Kreislauf und Verdauung gleichzeitig betreffen — typische Auslöser sind Insektenstiche, Nahrungsmittel (Erdnüsse, Schalentiere), Medikamente oder Latex. WICHTIG für Ersthelfer: Den Adrenalin-Autoinjektor REICHEN und die Anwendung nach individuellem Notfallplan UNTERSTÜTZEN — NICHT selbst spritzen. Wenn möglich, wendet die betroffene Person ihn selbst an. Merksatz: Erkennen — 112 rufen — reichen & unterstützen — überwachen.',
    sections: [
      {
        heading: 'Was ist eine Anaphylaxie?',
        items: [
          { label: 'Schwere allergische Reaktion', body: 'Plötzliche, generalisierte Überreaktion des Immunsystems auf einen normalerweise harmlosen Stoff (Allergen) — Symptome treten innerhalb von Sekunden bis Minuten auf.' },
          { label: 'Mehrere Organsysteme betroffen', body: 'Anaphylaxie kann Haut, Atemwege, Kreislauf und Verdauungstrakt gleichzeitig betreffen — das unterscheidet sie von einer leichten allergischen Reaktion.' },
          { label: 'Lebensbedrohlich', body: 'Wenn Atemwege zuschwellen oder der Kreislauf zusammenbricht, drohen Erstickung oder Herz-Kreislauf-Stillstand. Frühes Handeln rettet Leben.' },
          { label: 'Adrenalin als Notfallmedikament', body: 'Adrenalin (über Auto-Injektor) ist das wichtigste Notfallmedikament — wirkt sofort auf Atemwege (öffnet Bronchien) und Kreislauf (hebt Blutdruck).' },
        ],
      },
      {
        heading: 'Mögliche Auslöser',
        items: [
          { label: 'Insektenstiche', body: 'Wespen, Bienen, Hornissen — besonders gefährlich bei Allergikern. Stich in Mund- oder Halsbereich erhöht das Risiko zusätzlich.' },
          { label: 'Nahrungsmittel', body: 'Erdnüsse, Baumnüsse, Schalentiere, Fisch, Milch, Eier, Sesam — typische Auslöser bei Lebensmittelallergie. Auch Spuren können reichen.' },
          { label: 'Medikamente', body: 'Antibiotika (z. B. Penicillin), Schmerzmittel, Lokalanästhetika, Kontrastmittel — können auch bei wiederholter Anwendung plötzlich Anaphylaxie auslösen.' },
          { label: 'Latex', body: 'Latex-Allergie — typisch bei medizinischen Handschuhen, Luftballons, Pflastern, Sportausrüstung.' },
          { label: 'Andere Auslöser', body: 'Insektengift-Therapie, körperliche Anstrengung in Kombination mit Allergen, kalte Luft, Tierhaare — selten, aber möglich.' },
        ],
      },
      {
        heading: 'Typische Warnzeichen',
        items: [
          { label: 'Juckreiz / Quaddeln / Hautausschlag', body: 'Plötzliche, oft großflächige Quaddeln (Nesselsucht), Rötung, starker Juckreiz — meist eines der ersten Zeichen.' },
          { label: 'Schwellung von Lippen, Zunge oder Hals', body: 'Lippen werden dick, Zunge schwillt an, Halsbereich verengt — kann zu Erstickung führen.' },
          { label: 'Atemnot / pfeifende Atmung', body: 'Verengung der Atemwege (Bronchospasmus) — keuchende, pfeifende Atmung, Luftnot, blau-graue Lippen.' },
          { label: 'Engegefühl im Hals', body: 'Person greift sich an den Hals, Heiserkeit, Schluckbeschwerden — Zeichen einer Schwellung im oberen Atemweg.' },
          { label: 'Schwindel / Kreislaufabfall', body: 'Blutdruck fällt rapide ab, Person fühlt sich schwindelig, sieht "Sterne", droht ohnmächtig zu werden.' },
          { label: 'Übelkeit / Erbrechen', body: 'Magen-Darm-Reaktion — Übelkeit, Erbrechen, Bauchkrämpfe, Durchfall.' },
          { label: 'Unruhe / Angst', body: 'Plötzliche starke Unruhe, Todesangst — typisches Frühzeichen, bevor körperliche Symptome offensichtlich sind.' },
          { label: 'Bewusstseinsstörung', body: 'Spätzeichen — Verwirrtheit, Benommenheit, Bewusstlosigkeit. Hochkritisch.' },
        ],
      },
      {
        heading: 'Erste Hilfe — richtig handeln',
        items: [
          { label: '1. Notruf 112 wählen', body: 'SOFORT — Anaphylaxie ist immer ein Notfall. "Verdacht auf anaphylaktischen Schock" durchgeben.' },
          { label: '2. Allergen entfernen / stoppen', body: 'Insektenstachel entfernen (mit Karte/Pinzette), Medikament absetzen, Nahrungsmittel ausspucken, Kontakt mit Auslöser sofort beenden.' },
          { label: '3. Betroffene Person beruhigen', body: 'Beruhigend ansprechen, Sicherheit vermitteln — Angst verstärkt die Reaktion. Person nicht allein lassen.' },
          { label: '4. Geeignete Lagerung', body: 'Bei Atemnot: Oberkörper hoch lagern. Bei Kreislaufschwäche: flach lagern, Beine etwas hoch. Bei Bewusstlosigkeit mit normaler Atmung: stabile Seitenlage.' },
          { label: '5. Notfallset / Adrenalin-Autoinjektor reichen', body: 'Notfallset oder Adrenalin-Pen aushändigen und bei der Anwendung NACH NOTFALLPLAN UNTERSTÜTZEN — als Ersthelfer NICHT selbst spritzen. Wenn möglich, wendet die Person den Pen selbst an.' },
          { label: '6. Atmung und Bewusstsein überwachen', body: 'Kontinuierlich beobachten — bei Atemausfall sofort HLW beginnen. Veränderungen an Rettungsdienst weitergeben.' },
        ],
      },
      {
        heading: 'Adrenalin-Autoinjektor — Anwendung unterstützen',
        items: [
          { label: '1. Sicherheitskappe abziehen', body: 'Betroffene Person anweisen, die farbige Sicherheitskappe vom Pen abzuziehen. Person hält den Pen selbst — Ersthelfer reicht und unterstützt verbal.' },
          { label: '2. Pen außen am Oberschenkel ansetzen', body: 'Person anweisen, den Auto-Injektor fest an die Außenseite des Oberschenkels zu drücken — auch durch Hose oder Stoff möglich.' },
          { label: '3. Auslösen nach Anweisung des Geräts', body: 'Person anweisen, den Pen nach Anweisung des Geräts auszulösen — meist 3–10 Sekunden gedrückt halten, dann Klick abwarten.' },
          { label: 'WICHTIGER HINWEIS', body: 'Auto-Injektor nur nach individuellem Notfallplan / Einweisung unterstützen. Wenn die Person ansprechbar ist, wendet SIE den Pen selbst an. Ersthelfer reichen und unterstützen NUR — keine Eigeninjektion.' },
          { label: 'Nach der Anwendung', body: 'Pen für Rettungsdienst aufbewahren, Uhrzeit der Anwendung notieren. Auch nach Adrenalin: 112 muss erfolgt sein, da Wirkung nach 15–30 Min abklingt und Symptome zurückkehren können (biphasische Reaktion).' },
        ],
      },
      {
        heading: 'Wann wird es zum Notfall? — 112 rufen',
        items: [
          { label: 'Atemnot', body: 'Pfeifende Atmung, Luftnot, Husten, blau-graue Lippen — Atemwege schwellen zu. Sofort 112.' },
          { label: 'Schwellung im Mund-/Halsbereich', body: 'Lippen, Zunge, Rachen schwellen an — Erstickungsgefahr. Sofort 112.' },
          { label: 'Kreislaufprobleme / Schwindel', body: 'Blutdruckabfall, Schwindel, drohende Ohnmacht — Schock entwickelt sich. Sofort 112.' },
          { label: 'Bewusstseinsstörung', body: 'Verwirrtheit, Benommenheit, Bewusstlosigkeit — Sauerstoffmangel im Gehirn. Sofort 112.' },
          { label: 'Rasche Verschlechterung', body: 'Symptome werden schnell schlimmer, mehrere Organsysteme betroffen — sofort 112.' },
          { label: 'Mehrere Körpersysteme betroffen', body: 'Wenn gleichzeitig Haut UND Atmung UND Kreislauf reagieren — generalisierte Anaphylaxie. Sofort 112.' },
        ],
      },
      {
        heading: 'Was man vermeiden sollte',
        items: [
          { label: 'Person nicht allein lassen', body: 'Anaphylaxie kann sich rasend schnell verschlechtern — kontinuierlich beobachten, ansprechen, Atmung kontrollieren.' },
          { label: 'Beschwerden nicht unterschätzen', body: 'Auch leichte Symptome (Juckreiz, Quaddeln) können sich binnen Minuten zur lebensbedrohlichen Reaktion entwickeln. Bei bekannter Allergie immer ernst nehmen.' },
          { label: 'Nicht warten bei Atemnot oder Kreislaufproblemen', body: 'Bei Atemnot oder Kreislaufschwäche darf KEIN "Abwarten" stattfinden — sofort 112 und Adrenalin-Autoinjektor reichen.' },
          { label: 'Nicht unnötig herumlaufen lassen', body: 'Körperliche Anstrengung verstärkt die Reaktion — Person ruhig lagern, nicht aufstehen lassen.' },
          { label: 'Nicht selbst Adrenalin spritzen', body: 'Ersthelfer ohne medizinische Ausbildung dürfen NICHT selbst spritzen — nur Auto-Injektor reichen und Anwendung nach Notfallplan unterstützen.' },
          { label: 'Nicht trinken oder essen geben', body: 'Bei Schwellung im Halsbereich Aspirationsgefahr — keine Flüssigkeit, keine Tabletten ohne Notfallplan.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Anaphylaxie', body: 'Schwere, plötzlich einsetzende allergische Reaktion mit Beteiligung mehrerer Organsysteme — kann tödlich verlaufen.' },
          { label: 'Anaphylaktischer Schock', body: 'Schwerste Form der Anaphylaxie mit Kreislaufversagen — Blutdruck fällt rapide, Lebensgefahr.' },
          { label: 'Adrenalin (Epinephrin)', body: 'Wichtigstes Notfallmedikament bei Anaphylaxie — wirkt sofort auf Atemwege und Kreislauf.' },
          { label: 'Auto-Injektor (z. B. EpiPen, Jext, Emerade)', body: 'Vorbefüllter Adrenalin-Pen für die Notfall-Selbstanwendung — wird in den seitlichen Oberschenkel gedrückt.' },
          { label: 'Notfallplan', body: 'Individueller Plan der Person mit bekannter Allergie — beschreibt, was im Anaphylaxie-Notfall in welcher Reihenfolge zu tun ist.' },
          { label: 'Allergen', body: 'Stoff, der die allergische Reaktion auslöst — z. B. Insektengift, Erdnussprotein, Penicillin, Latex.' },
          { label: 'Quaddeln (Urtikaria, Nesselsucht)', body: 'Erhabene, juckende, gerötete Hautstellen — typisch für allergische Hautreaktion.' },
          { label: 'Biphasische Reaktion', body: 'Zweite Welle der allergischen Reaktion, die Stunden nach der ersten Episode auftreten kann — auch nach erfolgreicher Erste-Hilfe weiter beobachten.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Wespen am Beckenrand und Bistro', body: 'Im Sommer häufig — Wespe fliegt ins Getränk oder sticht beim Essen. Allergiker sind in Lebensgefahr binnen Minuten.' },
          { label: 'Lebensmittelallergien im Bistro', body: 'Erdnüsse, Schalentiere, Sesam — Anaphylaxie kann auch bei winzigen Spuren auftreten. Bei bekannten Allergikern Notfallset prüfen.' },
          { label: 'Notfallset der Person erfragen', body: 'Bei Verdacht auf Anaphylaxie sofort fragen: "Haben Sie ein Notfallset?" — viele Allergiker haben EpiPen, Antihistaminika und Cortison-Tabletten dabei.' },
          { label: 'Im Wasser besonders kritisch', body: 'Bei Anaphylaxie im Wasser: sofort aus dem Wasser, an Land lagern, 112, Notfallset reichen — Atemnot und Bewusstseinsstörung im Wasser sind tödlich.' },
          { label: 'Aufmerksam bleiben — biphasische Reaktion', body: 'Auch nach erfolgreicher Erste-Hilfe: Person nicht allein lassen — zweite Welle nach Stunden möglich.' },
        ],
      },
      {
        heading: 'Praxisleiste',
        items: [
          { label: 'ERKENNEN', body: 'Auf Warnzeichen achten: Juckreiz, Quaddeln, Schwellung, Atemnot, Engegefühl, Schwindel, Übelkeit, Unruhe, Bewusstseinsstörung.' },
          { label: '112 RUFEN', body: 'Sofort. Anaphylaxie ist immer ein Notfall. "Verdacht auf anaphylaktischen Schock" durchgeben.' },
          { label: 'REICHEN & UNTERSTÜTZEN', body: 'Notfallset / Adrenalin-Autoinjektor reichen, bei der Anwendung nach Notfallplan unterstützen — NICHT selbst spritzen.' },
          { label: 'ÜBERWACHEN', body: 'Atmung und Bewusstsein kontinuierlich kontrollieren bis Rettungsdienst eintrifft. Bei Atemausfall sofort HLW.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'Allergische Reaktion + Atemnot/Kreislaufprobleme = 112 rufen, Adrenalin-Autoinjektor reichen, überwachen', body: '112 rufen, Adrenalin-Autoinjektor reichen und bei der Anwendung nach Notfallplan unterstützen, überwachen. Erkennen — 112 — reichen & unterstützen — überwachen.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/anaphylaktischer-schock-arbeitsblatt.png',
    alt: 'Arbeitsblatt Anaphylaktischer Schock zum Ausfüllen',
    tasks: [
      {
        id: 'warnzeichen',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Typische Warnzeichen erkennen',
        prompt: 'Beschrifte die Abbildung mit den passenden Warnzeichen (1–8).',
        items: [
          { number: 1, accept: ['Juckreiz', 'Quaddeln', 'Hautausschlag', 'Juckreiz / Quaddeln', 'Juckreiz / Quaddeln / Hautausschlag', 'Nesselsucht', 'Hautreaktion', 'Urtikaria', 'Juckreiz und Quaddeln', 'Allergische Hautreaktion'] },
          { number: 2, accept: ['Schwellung von Lippen, Zunge oder Hals', 'Schwellung Lippen Zunge Hals', 'Schwellung', 'Geschwollene Lippen', 'Lippenschwellung', 'Zungenschwellung', 'Halsschwellung', 'Schwellung im Hals', 'Schwellung der Lippen', 'Schwellung von Lippen', 'Schwellung Lippen / Zunge / Hals', 'Schwellung im Mund'] },
          { number: 3, accept: ['Atemnot', 'Pfeifende Atmung', 'Atemnot / pfeifende Atmung', 'Erschwerte Atmung', 'Luftnot', 'Bronchospasmus', 'Atemnot und pfeifende Atmung', 'Keuchende Atmung'] },
          { number: 4, accept: ['Engegefühl im Hals', 'Engegefuehl im Hals', 'Halsenge', 'Kloß im Hals', 'Kloss im Hals', 'Enge im Hals', 'Engegefühl', 'Engegefuehl', 'Halsenge / Engegefühl', 'Halsenge / Engegefuehl', 'Heiserkeit'] },
          { number: 5, accept: ['Schwindel', 'Kreislaufprobleme', 'Kreislaufabfall', 'Schwindel / Kreislaufabfall', 'Schwindel / Kreislaufprobleme', 'Blutdruckabfall', 'Kreislaufschwäche', 'Kreislaufschwaeche', 'Schwindel und Kreislaufabfall'] },
          { number: 6, accept: ['Übelkeit', 'Uebelkeit', 'Erbrechen', 'Übelkeit / Erbrechen', 'Uebelkeit / Erbrechen', 'Bauchbeschwerden', 'Übelkeit und Erbrechen', 'Uebelkeit und Erbrechen', 'Magenkrämpfe', 'Magenkraempfe', 'Bauchkrämpfe', 'Bauchkraempfe'] },
          { number: 7, accept: ['Unruhe', 'Angst', 'Unruhe / Angst', 'Unruhe und Angst', 'Panikgefühl', 'Panikgefuehl', 'Todesangst', 'Nervosität', 'Nervositaet', 'Ängstlichkeit', 'Aengstlichkeit'] },
          { number: 8, accept: ['Bewusstseinsstörung', 'Bewusstseinsstoerung', 'Benommenheit', 'Verwirrtheit', 'Bewusstlosigkeit', 'Bewusstseinstrübung', 'Bewusstseinstruebung', 'Eingeschränktes Bewusstsein', 'Eingeschraenktes Bewusstsein', 'Bewusstseinsverlust'] },
        ],
      },
      {
        id: 'verhalten',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Richtiges Verhalten',
        prompt: 'Nenne sechs wichtige Maßnahmen bei einem anaphylaktischen Schock.',
        items: [
          { number: 1, accept: ['Notruf 112', '112', '112 rufen', 'Notruf', 'Rettungsdienst rufen', 'Notruf 112 wählen', 'Notruf 112 waehlen', 'Notruf absetzen', '112 anrufen'] },
          { number: 2, accept: ['Allergen entfernen', 'Allergenkontakt beenden', 'Allergen entfernen / Allergenkontakt beenden', 'Auslöser entfernen', 'Ausloeser entfernen', 'Stachel entfernen', 'Allergen stoppen', 'Allergen wenn möglich entfernen', 'Allergen wenn moeglich entfernen', 'Kontakt mit Allergen beenden', 'Allergen wegnehmen'] },
          { number: 3, accept: ['Person beruhigen', 'Beruhigen', 'Person nicht allein lassen', 'Nicht allein lassen', 'Beruhigen / nicht allein lassen', 'Person beruhigen / nicht allein lassen', 'Betroffene Person beruhigen', 'Betreuen', 'Beruhigen und betreuen', 'Ansprechen und beruhigen'] },
          { number: 4, accept: ['Geeignete Lagerung', 'Lagern', 'Lagerung', 'Bequem lagern', 'Je nach Situation lagern', 'Oberkörper hoch bei Atemnot', 'Oberkoerper hoch bei Atemnot', 'Flach lagern bei Kreislaufschwäche', 'Flach lagern bei Kreislaufschwaeche', 'Passende Lagerung', 'Lagerung je nach Beschwerden'] },
          { number: 5, accept: ['Notfallset reichen', 'Adrenalin-Autoinjektor reichen', 'Autoinjektor reichen', 'Auto-Injektor reichen', 'Adrenalin-Pen reichen', 'EpiPen reichen', 'Notfallset / Adrenalin-Autoinjektor reichen', 'Notfallset reichen und Anwendung unterstützen', 'Notfallset reichen und Anwendung unterstuetzen', 'Autoinjektor reichen und Anwendung unterstützen', 'Autoinjektor reichen und Anwendung unterstuetzen', 'Notfallset und Anwendung nach Notfallplan unterstützen', 'Notfallset und Anwendung nach Notfallplan unterstuetzen', 'Adrenalin-Autoinjektor reichen und bei der Anwendung unterstützen', 'Adrenalin-Autoinjektor reichen und bei der Anwendung unterstuetzen', 'Notfallset / Adrenalin-Autoinjektor reichen und Anwendung unterstützen', 'Notfallset / Adrenalin-Autoinjektor reichen und Anwendung unterstuetzen', 'Nach Notfallplan unterstützen', 'Nach Notfallplan unterstuetzen'] },
          { number: 6, accept: ['Atmung überwachen', 'Atmung ueberwachen', 'Bewusstsein überwachen', 'Bewusstsein ueberwachen', 'Atmung und Bewusstsein überwachen', 'Atmung und Bewusstsein ueberwachen', 'Beobachten', 'Zustand kontrollieren', 'Vitalfunktionen überwachen', 'Vitalfunktionen ueberwachen', 'Atmung und Bewusstsein beobachten', 'Überwachen', 'Ueberwachen', 'Atmung kontrollieren'] },
        ],
      },
      {
        id: 'begriffe',
        type: 'numbered-labels',
        title: 'Aufgabe 3: Wichtige Situationen / Begriffe',
        prompt: 'Benenne die vier wichtigen Situationen und Begriffe.',
        items: [
          { number: 1, accept: ['Notruf 112', '112', 'Notruf', '112 wählen', '112 waehlen', 'Notruf 112 wählen', 'Notruf 112 waehlen', 'Rettungsdienst rufen', 'Notruf absetzen'] },
          { number: 2, accept: ['Notfallset', 'Adrenalin-Autoinjektor', 'Autoinjektor', 'Auto-Injektor', 'Adrenalin-Pen', 'EpiPen', 'Notfallset / Adrenalin-Autoinjektor', 'Adrenalin', 'Allergie-Notfallset', 'Adrenalin-Pen / Notfallset'] },
          { number: 3, accept: ['Atemnot', 'Pfeifende Atmung', 'Luftnot', 'Engegefühl im Hals', 'Engegefuehl im Hals', 'Erschwerte Atmung', 'Halsschwellung', 'Atemwegsverengung', 'Schwellung der Atemwege', 'Atemnot / Halsenge'] },
          { number: 4, accept: ['Hautausschlag', 'Quaddeln', 'Allergische Hautreaktion', 'Hautausschlag / Quaddeln / allergische Hautreaktion', 'Nesselsucht', 'Urtikaria', 'Quaddeln / Hautausschlag', 'Hautrötung', 'Hautroetung', 'Hautreaktion', 'Schwellung mit Hautausschlag', 'Lippenschwellung', 'Hautausschlag / Quaddeln'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfragen',
        items: [
          {
            prompt: '1. Wie hilft man einer Person mit anaphylaktischem Schock richtig?',
            keywords: ['112', 'notruf', 'beruhigen', 'allergen', 'entfernen', 'kontakt', 'beenden', 'lagern', 'lagerung', 'notfallset', 'autoinjektor', 'adrenalin', 'reichen', 'unterstützen', 'unterstuetzen', 'anwendung', 'atmung', 'bewusstsein', 'überwachen', 'ueberwachen', 'kontrollieren', 'notfallplan'],
            minMatches: 4,
            sampleAnswer:
              'Sofort 112 rufen und die Person beruhigen. Den Allergenkontakt nach Möglichkeit beenden (Stachel entfernen, Nahrung ausspucken, Medikament absetzen). Eine geeignete Lagerung wählen — bei Atemnot Oberkörper hoch, bei Kreislaufschwäche flach, bei Bewusstlosigkeit mit normaler Atmung in stabile Seitenlage. Das Notfallset bzw. den Adrenalin-Autoinjektor reichen und bei der Anwendung nach individuellem Notfallplan unterstützen — als Ersthelfer NICHT selbst spritzen, wenn möglich wendet die Person den Pen selbst an. Atmung und Bewusstsein kontinuierlich kontrollieren, bei Atemausfall sofort mit der HLW beginnen.',
          },
          {
            prompt: '2. Wann sollte bei einer allergischen Reaktion sofort der Notruf 112 gewählt werden?',
            keywords: ['atemnot', 'schwellung', 'mund', 'hals', 'zunge', 'kreislauf', 'schwindel', 'bewusstsein', 'bewusstlos', 'verschlecht', 'mehrere', 'organsysteme', 'körpersysteme', 'koerpersysteme', 'anaphylax', 'kritisch', '112', 'notruf'],
            minMatches: 3,
            sampleAnswer:
              'Sofort 112 rufen bei Atemnot, Schwellung im Mund-, Zungen- oder Halsbereich, Kreislaufproblemen, Schwindel, Bewusstseinsstörung oder schneller Verschlechterung des Zustands. Auch wenn mehrere Körpersysteme gleichzeitig betroffen sind (Haut UND Atmung UND Kreislauf) — das ist eine generalisierte Anaphylaxie und immer ein Notfall. Im Zweifel lieber einmal zu viel als zu wenig anrufen, denn Anaphylaxie kann sich binnen Minuten zur Lebensgefahr entwickeln.',
          },
        ],
      },
    ],
  },
};

export default anaphylaktischerSchock;
