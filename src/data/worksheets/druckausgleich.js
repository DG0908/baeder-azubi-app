const druckausgleich = {
  id: 'druckausgleich',
  title: 'Druckausgleich beim Tauchen',
  subtitle: 'Warum er wichtig ist · Wie er funktioniert · Worauf man achten muss',
  category: 'swim',
  icon: '👂',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/druckausgleich-referenz.png',
    alt: 'Lernblatt Druckausgleich beim Tauchen — Anatomie des Ohres, Ablauf und Sicherheit',
    intro:
      'Beim Abtauchen steigt der Wasserdruck — der Druck zwischen Außen- und Mittelohr muss ausgeglichen werden, damit das Trommelfell nicht verletzt wird. Der Druckausgleich gelingt über die Ohrtrompete (Eustachische Röhre) und kann durch Schlucken, Gähnen, Kieferbewegungen oder das Valsalva-Manöver (Nase zuhalten und sanft ausatmen) ausgelöst werden. Wichtigste Regeln: früh beginnen, langsam und kontrolliert abtauchen, nie mit Gewalt drücken, bei Schmerzen sofort stoppen. Bei Erkältung oder verstopfter Nase NICHT tauchen — die Ohrtrompete ist blockiert. Merksatz: FRÜH, SANFT UND REGELMÄSSIG — NIEMALS MIT GEWALT.',
    sections: [
      {
        heading: 'Anatomie des Ohres',
        items: [
          { label: 'Außenohr', body: 'Ohrmuschel und äußerer Gehörgang — leitet Schallwellen zum Trommelfell. Im Wasser: Wasser kann eindringen, beim Tauchen herrscht hier der Wasserdruck.' },
          { label: 'Trommelfell', body: 'Dünne Membran zwischen Außenohr und Mittelohr — überträgt Schwingungen auf die Gehörknöchelchen. Bei Druckunterschied wird es nach innen gedrückt → Schmerzen, im Extremfall Riss.' },
          { label: 'Mittelohr', body: 'Luftgefüllter Raum hinter dem Trommelfell — enthält die Gehörknöchelchen (Hammer, Amboss, Steigbügel). Hier muss der Druck dem Außendruck angepasst werden.' },
          { label: 'Ohrtrompete (Eustachische Röhre)', body: 'Verbindung zwischen Mittelohr und hinterem Nasen-Rachen-Raum. Über sie kann Luft ins Mittelohr nachströmen — das ist der Schlüsselweg für den Druckausgleich.' },
          { label: 'Innenohr (Cochlea)', body: 'Schnecke und Bogengänge — wandeln Schwingungen in Nervenimpulse um, sind für Hören und Gleichgewicht zuständig. Vor Druckschäden geschützt durch Trommelfell und Mittelohr.' },
        ],
      },
      {
        heading: 'Was ist Druckausgleich?',
        items: [
          { label: 'Beim Abtauchen steigt der Wasserdruck', body: 'Pro 10 m Wassertiefe steigt der Druck um ca. 1 bar — das Trommelfell wird nach innen gedrückt.' },
          { label: 'Druck zwischen Außen- und Mittelohr ausgleichen', body: 'Damit das Trommelfell nicht verletzt wird, muss im Mittelohr ebenfalls der entsprechend höhere Druck herrschen — Luft strömt über die Ohrtrompete nach.' },
          { label: 'So werden Schmerzen und Verletzungen vermieden', body: 'Ohne Druckausgleich: starke Schmerzen, im schlimmsten Fall Trommelfellriss (Barotrauma). Deshalb ist regelmäßiger Druckausgleich Pflicht beim Tauchen.' },
          { label: 'Besonders kritisch in den ersten Metern', body: 'In den ersten 5 m verändert sich der Druck am stärksten (von 1 auf 1,5 bar = 50 % Anstieg). Hier ist der Druckausgleich am wichtigsten.' },
        ],
      },
      {
        heading: 'So gelingt der Druckausgleich — 5 Schritte',
        items: [
          { label: '1. Früh beginnen', body: 'Schon an der Wasseroberfläche oder direkt beim Abtauchen mit dem Druckausgleich starten — nicht erst, wenn es weh tut. Vorbeugend statt reaktiv.' },
          { label: '2. Langsam und kontrolliert abtauchen', body: 'Tempo dem Druckausgleich anpassen — wenn der Ausgleich nicht klappt, Tempo verlangsamen oder kurz stoppen.' },
          { label: '3. Schlucken, Gähnen oder Kiefer bewegen', body: 'Sanfte Methoden: Bewegung der Kiefermuskulatur öffnet die Ohrtrompete kurz — Luft strömt ins Mittelohr.' },
          { label: '4. Nase zuhalten und sanft ausatmen (Valsalva-Manöver)', body: 'Nase mit Daumen und Zeigefinger zuhalten, dann sanft gegen die geschlossene Nase ausatmen — Luft drückt durch die Ohrtrompete ins Mittelohr. NIE mit Gewalt!' },
          { label: '5. Mehrfach wiederholen — nicht erst bei Schmerzen', body: 'In regelmäßigen Abständen wiederholen, je nach Tauchtiefe alle 0,5–1 m. Wer wartet, bis es weh tut, ist zu spät.' },
          { label: 'Alternative: Frenzel-Manöver', body: 'Fortgeschrittene Technik: Zungenbewegung kombiniert mit geschlossener Nase — sanfter als Valsalva, aber Übungssache. Wird im Apnoe-Tauchen genutzt.' },
        ],
      },
      {
        heading: 'Wichtige Regeln',
        items: [
          { label: 'Nie mit Gewalt drücken', body: 'Beim Valsalva-Manöver nur SANFT gegen die Nase ausatmen — zu starkes Pressen kann Innenohrverletzungen verursachen (Barotrauma des Innenohrs).' },
          { label: 'Bei Schmerzen sofort stoppen', body: 'Schmerzen sind ein Warnsignal — das Trommelfell ist überlastet. Sofort den Tauchgang stoppen, nicht weitermachen.' },
          { label: 'Wenn nötig etwas auftauchen und erneut versuchen', body: 'Wenn der Druckausgleich nicht gelingt: 1–2 m auftauchen, neu versuchen. Lieber langsam abtauchen als schmerzhaft.' },
          { label: 'Nur tauchen, wenn Nase und Ohren frei sind', body: 'Verstopfte Nase = blockierte Ohrtrompete = kein Druckausgleich. Tauchen bei Erkältung verboten.' },
          { label: 'Bei Erkältung oder Ohrproblemen besonders vorsichtig sein', body: 'Auch nach einer Erkältung können die Ohrtrompeten noch geschwollen sein — bei Unsicherheit nicht tauchen oder Arzt fragen.' },
        ],
      },
      {
        heading: 'Warnzeichen — Tauchgang abbrechen',
        items: [
          { label: 'Starke Ohrenschmerzen', body: 'Stechende, plötzliche Schmerzen — Hinweis auf zu großen Druckunterschied. Sofort auftauchen.' },
          { label: 'Druckgefühl, das nicht verschwindet', body: 'Anhaltendes Druckgefühl trotz Druckausgleich — die Ohrtrompete ist möglicherweise blockiert. Tauchgang beenden.' },
          { label: 'Schwindel', body: 'Schwindel beim Abtauchen oder unter Wasser — Hinweis auf Innenohr-Beteiligung (Vertigo). Sofort auftauchen, ärztlich abklären lassen.' },
          { label: 'Hörminderung', body: 'Plötzlich gedämpftes Hören oder Hörverlust — kann auf Mittelohr-Erguss oder Trommelfell-Verletzung hinweisen.' },
          { label: 'Schmerzen in Stirn oder Nebenhöhlen', body: 'Ähnliches Prinzip wie beim Mittelohr — auch die Nasennebenhöhlen brauchen Druckausgleich. Schmerzen bedeuten blockierte Verbindung.' },
          { label: 'Ohrgeräusche oder „Glucksen"', body: 'Ungewöhnliche Geräusche im Ohr beim Tauchen — Hinweis auf Flüssigkeit im Mittelohr. Tauchgang beenden, ärztlich abklären.' },
          { label: 'Nach dem Auftauchen: anhaltende Beschwerden', body: 'Wenn Schmerzen, Druckgefühl, Schwindel oder Hörminderung nicht innerhalb weniger Minuten verschwinden — Arzt aufsuchen.' },
        ],
      },
      {
        heading: 'Was vermeiden?',
        items: [
          { label: 'Zu schnelles Abtauchen', body: 'Der Druck steigt schneller, als der Ausgleich erfolgen kann — das Trommelfell wird massiv belastet. Korrektur: langsam abtauchen, Tempo dem Druckausgleich anpassen.' },
          { label: 'Druckausgleich erst bei starken Schmerzen versuchen', body: 'Dann ist es oft zu spät — die Ohrtrompete ist durch den Druckunterschied bereits geschlossen. Korrektur: früh und vorbeugend Druckausgleich machen.' },
          { label: 'Zu stark pressen (Valsalva)', body: 'Heftiges Ausatmen gegen die Nase kann Innenohr-Schäden verursachen. Korrektur: nur sanft Druck aufbauen — wenn es nicht klappt, anders versuchen oder auftauchen.' },
          { label: 'Mit Erkältung oder verstopfter Nase tauchen', body: 'Die Ohrtrompete ist geschwollen oder verschleimt — kein Druckausgleich möglich. Korrektur: bei Erkältung NICHT tauchen, auch nicht „leicht" tauchen.' },
          { label: 'Druckausgleich vergessen', body: 'Beim Schwimmen und Tauchen mal abgelenkt — keine Druckausgleich-Bewegung gemacht. Schmerzen folgen sofort. Korrektur: bewusst alle 0,5–1 m kurz Druckausgleich.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Außendruck', body: 'Der Druck der umgebenden Wassersäule — steigt beim Abtauchen pro 10 m um 1 bar. An der Oberfläche herrscht 1 bar (Atmosphärendruck), bei 10 m Tiefe schon 2 bar.' },
          { label: 'Mittelohr', body: 'Der luftgefüllte Raum hinter dem Trommelfell im Ohr — enthält die drei Gehörknöchelchen. Hier muss der Druck dem Außendruck angeglichen werden.' },
          { label: 'Ohrtrompete (Eustachische Röhre)', body: 'Durchgang vom hinteren Nasen-Rachen-Raum zum Mittelohr — etwa 3,5 cm lang. Über diesen Kanal kann Luft ins Mittelohr nachströmen, um den Druckausgleich herzustellen.' },
          { label: 'Druckausgleich', body: 'Der Vorgang, bei dem der Druck im Mittelohr an den Außendruck angepasst wird — durch Schlucken, Gähnen, Kieferbewegung oder Valsalva-Manöver.' },
          { label: 'Valsalva-Manöver', body: 'Standardmethode: Nase zuhalten, sanft gegen die geschlossene Nase ausatmen — Luft drückt durch die Ohrtrompete ins Mittelohr. Nicht mit Gewalt!' },
          { label: 'Frenzel-Manöver', body: 'Alternative Druckausgleichstechnik mit Zungenbewegung — sanfter als Valsalva. Wird im Apnoe-Tauchen verwendet.' },
          { label: 'Barotrauma', body: 'Verletzung durch Druckunterschied — typisch beim Ohr (Trommelfellriss) oder Nasennebenhöhlen. Vermeidbar durch frühzeitigen Druckausgleich.' },
          { label: 'Warnzeichen', body: 'Kennzeichen oder Symptome, die auf ein Problem beim Abtauchen hinweisen — Schmerzen, Druckgefühl, Schwindel, Hörminderung. Bei Auftreten: Tauchgang abbrechen.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Schwimmkurse / Schnuppertauchen', body: 'Vor jedem Tauch-Training Druckausgleich erklären — gerade bei Anfängern oft die Ursache für „Tauch-Angst" (weil Schmerzen drohen ohne Wissen).' },
          { label: 'Erkältung = Tauchverbot', body: 'Auch leichte Erkältung kann die Ohrtrompete blockieren. Klare Regel im Kursbetrieb: bei Schnupfen kein Tauchen.' },
          { label: 'Sprungbretter und Druckausgleich', body: 'Beim Sprung vom 5-m- oder 10-m-Brett gelangt der Springer schnell in Tiefe — Druckausgleich vorher mental einplanen, wenn man tiefer eintaucht.' },
          { label: 'Whirlpool und Saunabecken', body: 'Auch hier kann Druckausgleich nötig sein, wenn der Körper im Tauchbecken nach unten kommt — eher selten, aber bei tiefen Tauchbecken wichtig.' },
          { label: 'Bei Beschwerden ärztliche Abklärung', body: 'Wenn Schwimmer/Taucher nach dem Tauchgang Ohrenschmerzen oder Hörminderung haben — Arzt-Adresse herausgeben, nicht „abwarten und Tee trinken".' },
          { label: 'Erste-Hilfe bei Verdacht auf Trommelfellriss', body: 'Ohr trocken halten, NICHT spülen, kein Wasser ins Ohr — sofort HNO-Arzt. Schmerzmittel nur nach ärztlicher Anweisung.' },
          { label: 'Aufklärung über Schwimmbad-Blackout-Risiko', body: 'Druckausgleich-Probleme können zu Panik führen — Panik wiederum zu Hyperventilation oder Bewusstlosigkeit. Ruhe und kontrollierter Aufstieg sind wichtig.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'FRÜH, SANFT UND REGELMÄSSIG — NIEMALS MIT GEWALT', body: 'Vier Regeln in einem Satz. Früh = vor den Schmerzen beginnen. Sanft = nicht pressen. Regelmäßig = alle 0,5–1 m wiederholen. Niemals mit Gewalt = bei Widerstand stoppen, anders versuchen oder auftauchen.' },
          { label: 'BEI ERKÄLTUNG NICHT TAUCHEN', body: 'Verstopfte Nase = blockierte Ohrtrompete = kein Druckausgleich = Schmerzen oder Verletzung. Klare Regel ohne Ausnahme.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/druckausgleich-arbeitsblatt.png',
    alt: 'Arbeitsblatt Druckausgleich beim Tauchen zum Ausfüllen',
    tasks: [
      {
        id: 'begriffe-zuordnen',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Begriffe zuordnen',
        prompt: 'Trage zu jedem Begriff (1–5) den passenden Buchstaben (A–E) ein. A: Kennzeichen oder Symptome, die auf ein Problem beim Abtauchen hinweisen. B: Durchgang vom hinteren Nasen-Rachen-Raum zum Mittelohr, über den Luft geleitet werden kann. C: Der Druck der umgebenden Wassersäule, der beim Abtauchen zunimmt. D: Der luftgefüllte Raum hinter dem Trommelfell im Ohr. E: Der Vorgang, bei dem der Druck im Mittelohr an den Außendruck angepasst wird.',
        items: [
          { number: 1, accept: ['C', 'c'] },
          { number: 2, accept: ['D', 'd'] },
          { number: 3, accept: ['B', 'b'] },
          { number: 4, accept: ['E', 'e'] },
          { number: 5, accept: ['A', 'a'] },
        ],
      },
      {
        id: 'reihenfolge',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Ablauf ordnen',
        prompt: 'Bringe die Schritte des Druckausgleichs in die richtige Reihenfolge (1 = zuerst, 6 = zuletzt).',
        items: [
          { number: 1, accept: ['Früh beginnen', 'Frueh beginnen', 'Vorbeugend', 'Schon an der Oberfläche', 'Schon an der Oberflaeche', 'Frühzeitig', 'Fruehzeitig'] },
          { number: 2, accept: ['Langsam abtauchen', 'Langsam und kontrolliert abtauchen', 'Kontrolliert abtauchen', 'Langsam', 'Tempo anpassen'] },
          { number: 3, accept: ['Schlucken', 'Gähnen', 'Gaehnen', 'Kiefer bewegen', 'Schlucken / gähnen / Kiefer bewegen', 'Schlucken / gaehnen / Kiefer bewegen', 'Schlucken oder gähnen', 'Schlucken oder gaehnen', 'Kieferbewegung'] },
          { number: 4, accept: ['Nase zuhalten und sanft ausatmen', 'Valsalva-Manöver', 'Valsalva-Manoever', 'Valsalva', 'Nase zuhalten', 'Sanft ausatmen', 'Nase zuhalten und ausatmen'] },
          { number: 5, accept: ['Mehrfach wiederholen', 'Wiederholen', 'Regelmäßig wiederholen', 'Regelmaessig wiederholen', 'Mehrmals', 'Immer wieder'] },
          { number: 6, accept: ['Bei Schmerzen stoppen', 'Stoppen bei Schmerzen', 'Bei Schmerzen abbrechen', 'Stop bei Schmerzen', 'Sofort stoppen', 'Tauchgang abbrechen', 'Abbrechen'] },
        ],
      },
      {
        id: 'lueckentext',
        type: 'numbered-labels',
        title: 'Aufgabe 3: Lückentext',
        prompt: 'Fülle die sechs Lücken mit den richtigen Wörtern aus der Wortbank: Wasserdruck · Mittelohr · Ohrtrompete · sanft · Schmerzen · Druckausgleich.',
        items: [
          { number: 1, accept: ['Wasserdruck', 'Druck', 'Außendruck', 'Aussendruck', 'Umgebungsdruck'] },
          { number: 2, accept: ['Mittelohr', 'Mittel-Ohr'] },
          { number: 3, accept: ['Druckausgleich', 'Ausgleich', 'Druck-Ausgleich'] },
          { number: 4, accept: ['Ohrtrompete', 'Ohr-Trompete', 'Eustachische Röhre', 'Eustachische Roehre', 'Tuba auditiva', 'Tuba Eustachii'] },
          { number: 5, accept: ['Sanft', 'Vorsichtig', 'Behutsam', 'Leicht', 'Nur sanft'] },
          { number: 6, accept: ['Schmerzen', 'Schmerz', 'Beschwerden', 'Bei Schmerzen'] },
        ],
      },
      {
        id: 'fachfragen',
        type: 'keyword-text',
        title: 'Aufgabe 4: Fachfragen',
        items: [
          {
            prompt: 'a) Warum ist der Druckausgleich wichtig?',
            keywords: ['druck', 'außenbereich', 'aussenbereich', 'mittelohr', 'ausgleich', 'gleicht', 'trommelfell', 'entlastet', 'schmerzen', 'verletzung', 'vermeiden', 'schutz'],
            minMatches: 3,
            sampleAnswer:
              'Der Druckausgleich gleicht den Druck zwischen Außenbereich (Wasserdruck) und Mittelohr aus. Dadurch wird das Trommelfell entlastet — ohne Druckausgleich würde es nach innen gedrückt, was Schmerzen und im Extremfall einen Trommelfellriss (Barotrauma) verursachen kann. Regelmäßiger Druckausgleich schützt das Ohr.',
          },
          {
            prompt: 'b) Nenne zwei Möglichkeiten für einen Druckausgleich.',
            keywords: ['schlucken', 'gähnen', 'gaehnen', 'kiefer', 'bewegen', 'nase zuhalten', 'sanft', 'ausatmen', 'valsalva', 'frenzel'],
            minMatches: 2,
            sampleAnswer:
              'Möglichkeiten für den Druckausgleich sind: Schlucken, Gähnen oder Kiefer bewegen (sanfte Methoden) sowie das Valsalva-Manöver (Nase zuhalten und sanft gegen die geschlossene Nase ausatmen). Eine fortgeschrittene Technik ist das Frenzel-Manöver mit Zungenbewegung.',
          },
          {
            prompt: 'c) Nenne drei wichtige Regeln beim Druckausgleich.',
            keywords: ['früh', 'frueh', 'beginnen', 'langsam', 'kontrolliert', 'abtauchen', 'mehrfach', 'wiederholen', 'gewalt', 'sanft', 'schmerzen', 'stoppen', 'erkältung', 'erkaeltung', 'verstopfte nase'],
            minMatches: 3,
            sampleAnswer:
              'Drei wichtige Regeln sind: 1. Früh beginnen — schon an der Oberfläche, nicht erst bei Schmerzen. 2. Langsam und kontrolliert abtauchen — Tempo dem Druckausgleich anpassen. 3. Nie mit Gewalt drücken — sanftes Valsalva, sonst Innenohr-Verletzung. Weitere Regeln: mehrfach wiederholen, bei Schmerzen sofort stoppen, bei Erkältung oder verstopfter Nase nicht tauchen.',
          },
          {
            prompt: 'd) Nenne drei Warnzeichen, bei denen man abbrechen sollte.',
            keywords: ['ohrenschmerzen', 'starke schmerzen', 'druckgefühl', 'druckgefuehl', 'schwindel', 'hörminderung', 'hoerminderung', 'hörverlust', 'hoerverlust', 'stirn', 'nebenhöhlen', 'nebenhoehlen', 'unwohl', 'glucksen', 'ohrgeräusche', 'ohrgeraeusche'],
            minMatches: 3,
            sampleAnswer:
              'Drei wichtige Warnzeichen sind: starke Ohrenschmerzen, Druckgefühl, das nicht verschwindet, und Schwindel. Weitere Warnzeichen: Hörminderung, Schmerzen in Stirn oder Nebenhöhlen, Ohrgeräusche oder „Glucksen" und allgemeines Unwohlsein. Bei jedem dieser Zeichen Tauchgang sofort abbrechen.',
          },
        ],
      },
      {
        id: 'vermeiden',
        type: 'keyword-text',
        title: 'Aufgabe 5: Was vermeiden?',
        items: [
          {
            prompt: '1. Warum sollte man zu schnelles Abtauchen vermeiden?',
            keywords: ['druck', 'steigt', 'schneller', 'ausgleich', 'erfolgen', 'kann nicht', 'überlastet', 'ueberlastet', 'trommelfell', 'schmerzen', 'ohrprobleme', 'verletzung'],
            minMatches: 3,
            sampleAnswer:
              'Bei zu schnellem Abtauchen steigt der Druck schneller, als der Druckausgleich erfolgen kann. Dadurch wird das Trommelfell überlastet — es können Schmerzen oder Ohrprobleme bis hin zu einem Trommelfellriss entstehen. Lieber langsam abtauchen und das Tempo dem Druckausgleich anpassen.',
          },
          {
            prompt: '2. Warum sollte man zu starkes Pressen beim Druckausgleich vermeiden?',
            keywords: ['gewalt', 'stark', 'pressen', 'belastet', 'belastung', 'innenohr', 'verletzung', 'barotrauma', 'sanft', 'schaden', 'ohr'],
            minMatches: 3,
            sampleAnswer:
              'Zu starkes Pressen beim Valsalva-Manöver kann das Innenohr belasten und Verletzungen (Innenohr-Barotrauma) verursachen. Der Druckausgleich soll immer SANFT erfolgen — wenn er mit sanftem Druck nicht klappt, lieber stoppen, kurz auftauchen und neu versuchen, anstatt mit Gewalt zu pressen.',
          },
          {
            prompt: '3. Warum sollte man Druckausgleich nicht erst bei starken Schmerzen versuchen?',
            keywords: ['zu spät', 'zu spaet', 'ohrtrompete', 'geschlossen', 'blockiert', 'früh', 'frueh', 'regelmäßig', 'regelmaessig', 'vorbeugend', 'sofort stoppen'],
            minMatches: 3,
            sampleAnswer:
              'Wenn man erst bei starken Schmerzen Druckausgleich versucht, ist es oft zu spät — die Ohrtrompete ist durch den Druckunterschied bereits geschlossen oder blockiert. Druckausgleich sollte deshalb früh und regelmäßig erfolgen, vorbeugend statt reaktiv. Bei Schmerzen gilt: sofort den Tauchgang stoppen.',
          },
          {
            prompt: '4. Warum darf man mit Erkältung oder verstopfter Nase nicht tauchen?',
            keywords: ['ohrtrompete', 'blockiert', 'geschwollen', 'verschleimt', 'verstopft', 'erkältung', 'erkaeltung', 'kein druckausgleich', 'gelingt nicht', 'schmerzen', 'verletzung'],
            minMatches: 3,
            sampleAnswer:
              'Bei Erkältung oder verstopfter Nase ist die Ohrtrompete geschwollen oder verschleimt — sie kann blockiert sein. Dann gelingt der Druckausgleich schlechter oder gar nicht, der Druck im Mittelohr kann nicht angeglichen werden. Folge: starke Schmerzen oder Verletzungen. Deshalb klare Regel: bei Erkältung NICHT tauchen, auch nicht „nur kurz".',
          },
        ],
      },
    ],
  },
};

export default druckausgleich;
