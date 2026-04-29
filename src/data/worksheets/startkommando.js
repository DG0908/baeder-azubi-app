const startkommando = {
  id: 'startkommando',
  title: 'Startkommando im Wettkampfschwimmen',
  subtitle: 'Ablauf · Startarten · Fehlstart vermeiden',
  category: 'swim',
  icon: '🏁',
  estimatedMinutes: 18,
  reference: {
    image: '/worksheets/startkommando-referenz.png',
    alt: 'Lernblatt Startkommando im Wettkampfschwimmen — Ablauf vom Block, Start aus dem Wasser, Fehlstart',
    intro:
      'Im Wettkampfschwimmen folgt der Start einer klaren Abfolge aus Pfiffzeichen, Kommando, Stillephase und Startsignal. Man unterscheidet zwischen dem Start vom Block (Freistil, Brust, Schmetterling, Lageneinzel) und dem Start aus dem Wasser (Rücken und Lagenstaffel). Der Schiedsrichter eröffnet den Vorgang mit einem langen Pfiff und übergibt per Armzeichen an den Starter. Der Starter gibt das Kommando „Auf die Plätze" („Take your marks") und das Startsignal. Bewegung vor dem Startsignal = Fehlstart und kann zur Disqualifikation führen. Merksatz: PFIFF — POSITION EINNEHMEN — AUF DIE PLÄTZE — RUHIG HALTEN — STARTSIGNAL.',
    sections: [
      {
        heading: 'Überblick',
        items: [
          { label: 'Klare Abfolge', body: 'Der Start im Wettkampfschwimmen ist ein streng geregelter Ablauf — Pfiffzeichen, Kommando, Stillephase, Startsignal. Diese Reihenfolge ist international einheitlich (FINA / DSV).' },
          { label: 'Zwei Startarten', body: 'Start vom Block (für Freistil, Brust, Schmetterling, Lageneinzel) und Start aus dem Wasser (für Rücken und Lagenstaffel-Erstschwimmer).' },
          { label: 'Fairness und Sicherheit', body: 'Klare Regeln sorgen für gleiche Bedingungen für alle Schwimmer und verhindern Missverständnisse oder Verletzungen durch chaotische Starts.' },
          { label: 'Internationale Kommandos', body: 'Im internationalen Wettkampf wird auf Englisch kommandiert: „Take your marks". National üblich ist die deutsche Variante „Auf die Plätze".' },
        ],
      },
      {
        heading: 'Start vom Block — 5 Schritte',
        items: [
          { label: '1. Langer Pfiff des Schiedsrichters', body: 'Der Schiedsrichter eröffnet den Startvorgang mit einem langen Pfiff. Die Schwimmer treten auf den Startblock.' },
          { label: '2. Übergabe an den Starter', body: 'Der Schiedsrichter gibt mit einem Armzeichen den Start an den Starter frei — der Starter übernimmt jetzt die Verantwortung für den Ablauf.' },
          { label: '3. „Auf die Plätze" („Take your marks")', body: 'Der Starter gibt das Kommando — die Schwimmer nehmen die Startstellung ein.' },
          { label: '4. Startposition', body: 'Mindestens ein Fuß muss an der Vorderkante des Startblocks stehen. Schwimmer halten ruhig in Startposition — kein Wackeln, keine Bewegung.' },
          { label: '5. Startsignal', body: 'Erst beim akustischen Signal (Pfeife, Pistole oder elektronisches Signal) beginnt der eigentliche Start. Vorher = Fehlstart.' },
        ],
      },
      {
        heading: 'Start aus dem Wasser — 5 Schritte (Rücken / Lagenstaffel)',
        items: [
          { label: '1. Erster langer Pfiff', body: 'Der Schiedsrichter pfeift lang — die Schwimmer steigen ins Wasser.' },
          { label: '2. Zweiter langer Pfiff', body: 'Beim zweiten langen Pfiff nehmen die Schwimmer Startposition an der Wand ein.' },
          { label: '3. „Auf die Plätze" („Take your marks")', body: 'Der Starter gibt das Kommando — die Schwimmer ziehen sich an den Griffen hoch und gehen in Startbereitschaft.' },
          { label: '4. Startposition', body: 'Hände an den Griffen bzw. an der Startvorrichtung, Füße an der Wand unter der Wasseroberfläche, Körper ruhig halten.' },
          { label: '5. Startsignal', body: 'Erst beim Startsignal vom Starter abstoßen — vorher = Fehlstart.' },
        ],
      },
      {
        heading: 'Wer macht was?',
        items: [
          { label: 'Schiedsrichter', body: 'Eröffnet den Startvorgang mit dem langen Pfiff, prüft Ordnung am Startblock, übergibt per Armzeichen an den Starter. Hat die Gesamtaufsicht über den Wettkampf.' },
          { label: 'Starter', body: 'Gibt das Kommando „Auf die Plätze" und das Startsignal — entscheidet, wann die Schwimmer ruhig genug sind, dass das Signal gegeben werden kann. Ist auch zuständig für die Bewertung von Fehlstarts.' },
          { label: 'Schwimmer', body: 'Position einnehmen, ruhig bleiben, erst beim Signal starten. Bei Bewegung vor dem Signal droht Disqualifikation.' },
          { label: 'Wendekampfrichter (zusätzlich)', body: 'Beobachten Wenden und Anschläge — nicht direkt am Start beteiligt, aber Teil des Kampfgerichts.' },
        ],
      },
      {
        heading: 'Wichtige Merkpunkte',
        items: [
          { label: 'Pfiffzeichen beachten', body: 'Auf jeden Pfiff exakt reagieren — kein Vorgreifen, keine eigene Initiative. Die Pfiffe geben den Takt vor.' },
          { label: '„Auf die Plätze" = Startstellung einnehmen', body: 'Mit diesem Kommando geht die Startbewegung los — Schwimmer nimmt die ruhige Ausgangsposition ein, hält an, wartet.' },
          { label: 'Erst starten, wenn das Signal kommt', body: 'Auf das akustische Startsignal warten — keine eigenen Vorhersagen, kein „Vorausahnen". Ruhe halten.' },
          { label: 'Rückenstart erfolgt aus dem Wasser', body: 'Beim Rückenschwimmen und beim ersten Schwimmer der Lagenstaffel — Hände an den Griffen, Füße an der Wand unter Wasser.' },
          { label: 'Mindestens ein Fuß vorn am Block', body: 'Beim Start vom Block muss mindestens ein Fuß an der Vorderkante stehen — bei Greift-Start (Track-Start) ein Fuß vorn, ein Fuß hinten.' },
        ],
      },
      {
        heading: 'Fehlstart',
        items: [
          { label: 'Bewegung vor dem Startsignal', body: 'Jede Startbewegung vor dem akustischen Signal gilt als Fehlstart — auch unwillkürliches Wackeln oder Aufrichten.' },
          { label: 'Konsequenz: Disqualifikation', body: 'Seit Einführung der „One-Start-Rule" (FINA) führt jeder Fehlstart zur sofortigen Disqualifikation des betreffenden Schwimmers — keine zweite Chance.' },
          { label: 'Ruhig bleiben bis das Signal ertönt', body: 'In der Stillephase nach „Auf die Plätze" absolut ruhig stehen oder hängen — auch kleinste Bewegungen können als Fehlstart gewertet werden.' },
          { label: 'Verzögerung durch Schwimmer', body: 'Wer bewusst nicht in Position geht oder den Start verzögert, kann ebenfalls verwarnt oder disqualifiziert werden („Behinderung des Wettkampfs").' },
          { label: 'Technisches Frühstart-System', body: 'Auf Startblöcken ist meist eine elektronische Frühstartanzeige verbaut — registriert Bewegung vor dem Signal automatisch und meldet dem Starter.' },
        ],
      },
      {
        heading: 'Was bedeuten die Begriffe?',
        items: [
          { label: 'Startsignal', body: 'Das akustische Signal (Pfeife, Pistole, elektronisches Signal), nach dem die Schwimmer starten dürfen. Erst mit diesem Signal beginnt der eigentliche Start.' },
          { label: 'Startposition', body: 'Die ruhige Ausgangsstellung vor dem Start. Beim Start vom Block: mindestens ein Fuß an der Vorderkante. Beim Rückenstart: Hände an Griffen, Füße an der Wand unter Wasser.' },
          { label: 'Fehlstart', body: 'Liegt vor, wenn ein Schwimmer vor dem Startsignal startet oder eine Startbewegung zu früh einleitet. Führt zur Disqualifikation.' },
          { label: 'Starter', body: 'Person, die das Kommando „Auf die Plätze" und das Startsignal gibt. Verantwortlich für korrekten Startablauf und Fehlstart-Bewertung.' },
          { label: 'Schiedsrichter', body: 'Leitet den Wettkampf, eröffnet den Start mit dem langen Pfiff, übergibt per Armzeichen an den Starter. Höchste Autorität im Wettkampf.' },
          { label: '„Auf die Plätze" / „Take your marks"', body: 'Kommando des Starters zum Einnehmen der Startstellung. International auf Englisch, national meist auf Deutsch.' },
          { label: 'Track-Start (Greift-Start)', body: 'Häufigste Startform vom Block — ein Fuß vorn, ein Fuß hinten, Hände greifen vorne am Block. Schneller und sicherer als der klassische Hocktest-Start.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Wettkampf-Vorbereitung', body: 'Vor jedem Wettkampf Probestarts machen — Schwimmer sollen Pfiffe, Kommandos und Signale kennen. Auch Kindern erklären, wann sie was machen.' },
          { label: 'Schiedsrichter-Schulung', body: 'In Vereinsmaßstab: Kampfrichter-Schein erwerben (DSV). Im Bäderbetrieb sollten Mitarbeiter mit Wettkampf-Erfahrung als Helfer ausgebildet sein.' },
          { label: 'Sicherheit am Block', body: 'Startblöcke nur bei ausreichender Wassertiefe (mind. 1,80 m, besser 2,00 m) verwenden — sonst Verletzungsgefahr durch Aufprall.' },
          { label: 'Trainingseinsatz', body: 'Auch im Training Startabläufe üben — Pfiffe, Kommando, Stillephase, Signal. Schult Konzentration und Reaktion.' },
          { label: 'Fehlstart-Prävention', body: 'Schwimmer trainieren bewusst die Stillephase — 1–2 Sekunden absolute Ruhe nach „Auf die Plätze" bevor das Signal kommt. Häufiger Fehler bei Anfängern.' },
          { label: 'Akustik im Bad', body: 'Im Hallenbad ist die Akustik kritisch — Echoreduktion, gute Lautsprecher. Sonst hören manche Schwimmer das Signal später als andere.' },
          { label: 'Disqualifikation kommunizieren', body: 'Bei Fehlstart-DSQ ruhig erklären — gerade bei Jugendlichen kann das hart sein. Trainer und Eltern einbinden.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'PFIFF — POSITION EINNEHMEN — AUF DIE PLÄTZE — RUHIG HALTEN — STARTSIGNAL', body: 'Fünf Stichworte für den vollständigen Startablauf. Erst der lange Pfiff (Schwimmer auf Block oder ins Wasser), dann Position einnehmen, dann das Kommando „Auf die Plätze", dann Stillephase, am Ende das Startsignal.' },
          { label: 'STARTABLÄUFE MÜSSEN KLAR, RUHIG UND REGELGERECHT AUSGEFÜHRT WERDEN', body: 'Fairness, Sicherheit und gleiche Bedingungen für alle Schwimmer. Wer hetzt oder vorgreift, riskiert die Disqualifikation.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/startkommando-arbeitsblatt.png',
    alt: 'Arbeitsblatt Startkommando im Wettkampfschwimmen zum Ausfüllen',
    tasks: [
      {
        id: 'schritte-block',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Benenne die 5 Schritte beim Start vom Block',
        prompt: 'Trage die fünf Schritte des Starts vom Block in der richtigen Reihenfolge ein.',
        items: [
          { number: 1, accept: ['Langer Pfiff', 'Langer Pfiff des Schiedsrichters', 'Pfiff des Schiedsrichters', 'Schwimmer treten auf den Startblock', 'Schiedsrichter pfeift', 'Pfiff', 'Auf den Startblock', 'Auf den Block treten'] },
          { number: 2, accept: ['Übergabe an den Starter', 'Uebergabe an den Starter', 'Übergabe', 'Uebergabe', 'Armzeichen', 'Armzeichen des Schiedsrichters', 'Übergabe per Armzeichen', 'Uebergabe per Armzeichen', 'Schiedsrichter übergibt an Starter', 'Schiedsrichter uebergibt an Starter'] },
          { number: 3, accept: ['Auf die Plätze', 'Auf die Plaetze', 'Take your marks', 'Kommando Auf die Plätze', 'Kommando Auf die Plaetze', 'Kommando', '„Auf die Plätze"', 'Auf die Platze'] },
          { number: 4, accept: ['Startposition', 'Startposition einnehmen', 'Position einnehmen', 'Startstellung', 'Startstellung einnehmen', 'Ruhig stehen', 'Startposition und ruhig halten', 'Position und ruhig halten'] },
          { number: 5, accept: ['Startsignal', 'Signal', 'Akustisches Signal', 'Pistolensignal', 'Pfeife', 'Start erst beim Signal', 'Startsignal ertönt', 'Startsignal ertoent'] },
        ],
      },
      {
        id: 'zuordnung',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Ordne die passende Beschreibung zu',
        prompt: 'Trage zu jedem Schritt 1–5 den richtigen Buchstaben (A–E) ein. A: Starter gibt das Kommando zum Einnehmen der Startstellung. B: Schiedsrichter gibt mit Armzeichen den Start an den Starter frei. C: Schwimmer treten nach dem langen Pfiff auf den Startblock. D: Erst bei diesem Signal beginnt der eigentliche Start. E: Schwimmer nehmen ruhig die Startposition ein.',
        items: [
          { number: 1, accept: ['C', 'c'] },
          { number: 2, accept: ['B', 'b'] },
          { number: 3, accept: ['A', 'a'] },
          { number: 4, accept: ['E', 'e'] },
          { number: 5, accept: ['D', 'd'] },
        ],
      },
      {
        id: 'begriffe',
        type: 'keyword-text',
        title: 'Aufgabe 3: Erkläre die Begriffe in eigenen Worten',
        items: [
          {
            prompt: 'Startsignal — was ist das?',
            keywords: ['akustisch', 'signal', 'pfeife', 'pistole', 'elektronisch', 'starter', 'starten', 'beginnen', 'eigentliche', 'erst'],
            minMatches: 2,
            sampleAnswer:
              'Das Startsignal ist das akustische Signal, nach dem die Schwimmer starten dürfen — meist eine Pfeife, Pistole oder ein elektronisches Signal. Erst mit diesem Signal beginnt der eigentliche Start, vorher gilt jede Bewegung als Fehlstart.',
          },
          {
            prompt: 'Startposition — was ist das?',
            keywords: ['ruhig', 'ausgangsstellung', 'ausgangsposition', 'vor dem start', 'fuß', 'fuss', 'vorderkante', 'startblock', 'wand', 'griff', 'unter wasser', 'rückenstart', 'rueckenstart'],
            minMatches: 3,
            sampleAnswer:
              'Die Startposition ist die ruhige Ausgangsstellung vor dem Start. Beim Start vom Block steht mindestens ein Fuß vorne an der Vorderkante des Startblocks. Beim Rückenstart befindet sich der Schwimmer im Wasser an der Wand — Hände an den Griffen, Füße an der Wand unter der Wasseroberfläche.',
          },
          {
            prompt: 'Fehlstart — was ist das?',
            keywords: ['vor dem signal', 'vor dem startsignal', 'startbewegung', 'zu früh', 'zu frueh', 'startet', 'bewegung', 'disqualifikation', 'disqualifiziert', 'dsq', 'regelverstoß', 'regelverstoss'],
            minMatches: 3,
            sampleAnswer:
              'Ein Fehlstart liegt vor, wenn ein Schwimmer vor dem Startsignal startet oder eine Startbewegung zu früh einleitet. Auch unwillkürliches Wackeln oder Aufrichten in der Stillephase wird als Fehlstart gewertet. Konsequenz ist die Disqualifikation des Schwimmers.',
          },
          {
            prompt: 'Starter / Schiedsrichter — wer macht was?',
            keywords: ['schiedsrichter', 'pfiff', 'eröffnet', 'eroeffnet', 'pfeift', 'leitet', 'übergibt', 'uebergibt', 'armzeichen', 'starter', 'kommando', 'auf die plätze', 'auf die plaetze', 'take your marks', 'startsignal', 'signal', 'gibt'],
            minMatches: 3,
            sampleAnswer:
              'Der Schiedsrichter leitet den Startvorgang ein — er pfeift lang und übergibt per Armzeichen an den Starter. Der Starter gibt dann das Kommando „Auf die Plätze" („Take your marks") und anschließend das Startsignal, sobald die Schwimmer ruhig in Position sind. Beide arbeiten zusammen, der Schiedsrichter hat die Gesamtaufsicht.',
          },
        ],
      },
      {
        id: 'reihenfolge',
        type: 'numbered-labels',
        title: 'Aufgabe 4: Bringe den Ablauf in die richtige Reihenfolge',
        prompt: 'Trage in der richtigen Reihenfolge die sechs Schritte ein (1 = erster Schritt, 6 = letzter Schritt).',
        items: [
          { number: 1, accept: ['Langer Pfiff des Schiedsrichters', 'Langer Pfiff', 'Pfiff des Schiedsrichters', 'Schiedsrichter pfeift', 'Pfiff', 'Erster Pfiff'] },
          { number: 2, accept: ['Schwimmer treten auf den Startblock', 'Auf den Startblock treten', 'Schwimmer auf Block', 'Schwimmer auf den Startblock', 'Auf den Block treten', 'Auf Block treten'] },
          { number: 3, accept: ['Armzeichen', 'Übergabe an den Starter', 'Uebergabe an den Starter', 'Armzeichen: Übergabe an den Starter', 'Armzeichen: Uebergabe an den Starter', 'Übergabe per Armzeichen', 'Uebergabe per Armzeichen', 'Schiedsrichter übergibt an Starter', 'Schiedsrichter uebergibt an Starter'] },
          { number: 4, accept: ['Kommando: Auf die Plätze', 'Kommando: Auf die Plaetze', 'Auf die Plätze', 'Auf die Plaetze', 'Take your marks', 'Kommando', 'Kommando Auf die Plätze', 'Kommando Auf die Plaetze', 'Kommando des Starters'] },
          { number: 5, accept: ['Schwimmer nehmen die Startposition ein', 'Startposition einnehmen', 'Position einnehmen', 'Startstellung einnehmen', 'Schwimmer nehmen Startposition ein', 'Ruhige Startposition'] },
          { number: 6, accept: ['Startsignal ertönt', 'Startsignal ertoent', 'Startsignal', 'Signal', 'Signal ertönt', 'Signal ertoent', 'Akustisches Signal'] },
        ],
      },
      {
        id: 'fachfragen',
        type: 'keyword-text',
        title: 'Aufgabe 5: Fachfragen',
        items: [
          {
            prompt: '1. Warum müssen Schwimmer bis zum Startsignal ruhig bleiben?',
            keywords: ['gleich', 'bedingungen', 'fairness', 'fair', 'frühstart', 'fruehstart', 'fehlstart', 'verhindern', 'gleichzeitig', 'starter', 'signal', 'ruhig', 'gerecht', 'chancengleich'],
            minMatches: 3,
            sampleAnswer:
              'Schwimmer müssen ruhig bleiben, damit alle unter den gleichen Bedingungen starten und kein Frühstart entsteht. Erst wenn alle Schwimmer ruhig in Position sind, darf der Starter das Startsignal geben — nur so ist Fairness und Chancengleichheit gewährleistet.',
          },
          {
            prompt: '2. Worin unterscheidet sich der Rückenstart vom Start vom Block?',
            keywords: ['wasser', 'wand', 'griff', 'griffen', 'block', 'oben', 'sprung', 'springt', 'rückenlage', 'rueckenlage', 'zwei pfiffe', 'zwei lange pfiffe', 'einstieg', 'startposition', 'unterschied'],
            minMatches: 3,
            sampleAnswer:
              'Beim Rückenstart beginnt der Schwimmer im Wasser an der Wand — Hände an den Griffen, Füße unter Wasser an der Wand. Beim Start vom Block startet der Schwimmer von oben durch einen Sprung ins Wasser. Außerdem gibt es beim Rückenstart zwei lange Pfiffe: einen zum Einstieg ins Wasser, danach einen zur Startposition an der Wand.',
          },
          {
            prompt: '3. Welche Aufgabe hat der Starter im Startvorgang?',
            keywords: ['kommando', 'auf die plätze', 'auf die plaetze', 'take your marks', 'startsignal', 'signal', 'gibt', 'wartet', 'ruhig', 'position', 'fehlstart', 'bewertet'],
            minMatches: 3,
            sampleAnswer:
              'Der Starter gibt das Kommando „Auf die Plätze" und danach das Startsignal, wenn alle Schwimmer ruhig in Startposition sind. Er wartet bewusst, bis Stille herrscht — vorher darf das Signal nicht kommen. Außerdem ist der Starter zuständig für die Bewertung und Meldung von Fehlstarts.',
          },
          {
            prompt: '4. Wann spricht man von einem Fehlstart?',
            keywords: ['vor dem signal', 'vor dem startsignal', 'startet', 'bewegung', 'startbewegung', 'zu früh', 'zu frueh', 'vorzeitig', 'wackeln', 'aufrichten', 'einleitet', 'frühstart', 'fruehstart'],
            minMatches: 2,
            sampleAnswer:
              'Von einem Fehlstart spricht man, wenn ein Schwimmer vor dem Startsignal startet oder eine Startbewegung zu früh einleitet. Auch unwillkürliches Wackeln, Aufrichten oder vorzeitiges Eintauchen in der Stillephase werden als Fehlstart gewertet — und führen zur Disqualifikation.',
          },
          {
            prompt: '5. Warum ist ein klarer Ablauf beim Startkommando wichtig?',
            keywords: ['fairness', 'fair', 'sicherheit', 'gleich', 'bedingungen', 'chancengleich', 'missverständnis', 'missverstaendnis', 'fehlstart', 'verhindert', 'klar', 'regel', 'regelgerecht', 'einheitlich', 'verlässlich', 'verlaesslich'],
            minMatches: 3,
            sampleAnswer:
              'Ein klarer Ablauf sorgt für Fairness, Sicherheit und gleiche Bedingungen für alle Schwimmer. Außerdem verhindert er Missverständnisse und Fehlstarts — jeder weiß, was wann passiert, und die Schwimmer können sich auf die Reihenfolge verlassen. International einheitliche Regeln (FINA / DSV) machen Wettkämpfe weltweit vergleichbar.',
          },
        ],
      },
    ],
  },
};

export default startkommando;
