const wettkampfschwimmen = {
  id: 'wettkampfschwimmen',
  title: 'Wettkampfschwimmen',
  subtitle: 'Grundlagen, Regeln und wichtige Merkmale',
  category: 'swim',
  icon: '🏆',
  estimatedMinutes: 25,
  reference: {
    image: '/worksheets/wettkampfschwimmen-referenz.png',
    alt: 'Lernblatt Wettkampfschwimmen — Schwimmarten, Bestandteile, Regeln und Wettkampfumfeld',
    intro:
      'Wettkampfschwimmen ist eine geregelte Sportdisziplin mit klaren Vorgaben für Schwimmarten, Start, Wende, Anschlag und Wettkampfablauf. Die vier Wettkampf-Schwimmarten sind Freistil, Rückenschwimmen, Brustschwimmen und Schmetterlingsschwimmen. Jedes Rennen besteht aus Start — Schwimmstrecke — Wende — Zielanschlag. Entscheidend sind: Reaktion auf das Startsignal, saubere Technik, regelgerechte Wenden und Anschläge, Konzentration und Ausdauer. Häufige Disqualifikationsgründe: Fehlstart, falsche Wende, Verlassen der vorgeschriebenen Schwimmart, unsauberer Staffelwechsel. Merksatz: TECHNIK — REGELN — WENDESICHERHEIT — SAUBERER ZIELANSCHLAG.',
    sections: [
      {
        heading: 'Schwimmarten im Wettkampf',
        items: [
          { label: 'Freistil', body: 'Schnellste Schwimmart, Wechselschlag der Arme, Beinschlag frei wählbar — fast immer wird Kraul geschwommen. „Freistil" bedeutet im Wettkampf: jede Technik außer Rücken, Brust oder Schmetterling (in Lagenrennen). In reinen Freistilrennen ist die Technik komplett frei.' },
          { label: 'Rückenschwimmen', body: 'Schwimmen in Rückenlage, Wechselschlag der Arme, Beinschlag in Rückenlage. Start aus dem Wasser an der Wand. Schwimmer dürfen nur kurz beim Wenden auf die Brust drehen.' },
          { label: 'Brustschwimmen', body: 'Symmetrische Arm- und Beinbewegung — beidhändiger Anschlag bei Wende und Ziel Pflicht. Brustbeinschlag (Froschkick), Atmung und Armzug koordiniert. Kopf muss bei jedem Zyklus an die Oberfläche.' },
          { label: 'Schmetterlingsschwimmen', body: 'Gleichzeitiger Armzug beidarmig über Wasser, Delfinbeinschlag mit Wellenbewegung. Beidhändiger Anschlag bei Wende und Ziel Pflicht. Kraftvolle Ganzkörperbewegung.' },
          { label: 'Weitere Wettkampfformen', body: 'Lagenschwimmen (ein Sportler, alle vier Lagen) und Lagenstaffeln (vier Sportler, je eine Lage). Plus Freistil-Staffeln (4 × Freistil). Jeweils mit eigenem Reglement.' },
        ],
      },
      {
        heading: 'Bestandteile eines Rennens',
        items: [
          { label: 'Start', body: 'Regelgerechter Start vom Block (Freistil, Brust, Schmetterling, Lageneinzel) oder beim Rücken aus dem Wasser. Reaktion auf das Startsignal entscheidet über die ersten Zehntelsekunden.' },
          { label: 'Schwimmstrecke', body: 'Die Bahn wird in der vorgeschriebenen Schwimmart mit sauberer Technik und gleichmäßigem Rhythmus geschwommen. Bahn einhalten, andere Schwimmer nicht behindern.' },
          { label: 'Wende', body: 'An der Wand wird regelgerecht gewendet, um Geschwindigkeit mitzunehmen. Eine gute Wende kann mehrere Sekunden Vorsprung bringen — eine schlechte kostet die Endzeit.' },
          { label: 'Zielanschlag', body: 'Der Zielanschlag beendet das Rennen und muss regelgerecht erfolgen — bei Brust und Schmetterling beidhändig. Der Anschlag entscheidet über die offizielle Zeit und mit über die Wertung.' },
        ],
      },
      {
        heading: 'Was ist im Wettkampf wichtig?',
        items: [
          { label: '1. Reaktion auf das Startsignal', body: 'Schnelle, kontrollierte Reaktion auf das akustische Signal. Bewegung vor dem Signal = Fehlstart, sofortige Disqualifikation (One-Start-Rule).' },
          { label: '2. Saubere Technik', body: 'Jede Schwimmart muss regelgerecht ausgeführt werden — z. B. symmetrische Bewegungen bei Brust und Schmetterling, beidhändiger Anschlag, korrekte Beinschläge.' },
          { label: '3. Regelgerechte Wenden und Anschläge', body: 'Wendekampfrichter beobachten genau — bei Verstoß droht Disqualifikation. Saubere Wenden bringen Zeit, schlechte kosten Sekunden.' },
          { label: '4. Einhaltung der jeweiligen Schwimmart', body: 'In Lagenrennen muss jede Teilstrecke in der vorgegebenen Schwimmart geschwommen werden. Verlassen der Schwimmart = DSQ.' },
          { label: '5. Konzentration, Rhythmus und Ausdauer', body: 'Mentale Stärke, gleichmäßiges Tempo und Kraftreserven für die letzte Strecke — alle drei zusammen entscheiden über Sieg oder Niederlage.' },
          { label: 'Bahn einhalten', body: 'Schwimmer bleibt in seiner zugewiesenen Bahn — andere Schwimmer behindern oder seitlich abtauchen = Regelverstoß.' },
          { label: 'Korrekter Staffelwechsel', body: 'In Staffeln darf der nächste Schwimmer erst starten, wenn der vorherige die Wand berührt hat. Frühstart = Disqualifikation der ganzen Staffel.' },
        ],
      },
      {
        heading: 'Häufige Gründe für Fehler oder Disqualifikation',
        items: [
          { label: 'Fehlstart', body: 'Bewegung vor dem Startsignal — auch unwillkürliches Wackeln in der Stillephase. One-Start-Rule der FINA: sofortige Disqualifikation.' },
          { label: 'Falsche Wende oder falscher Anschlag', body: 'Bei Brust und Schmetterling: nicht beidhändig oder verspätet. Bei Kipp-/Rückenwende: Füße zu hoch/tief an der Wand. Wendekampfrichter meldet, Schiedsrichter entscheidet.' },
          { label: 'Verlassen der vorgeschriebenen Schwimmart', body: 'In Lagenrennen versehentlich Brust auf der Schmetterlingsstrecke oder Kraul auf der Brustbahn — sofortige Disqualifikation.' },
          { label: 'Unsauberer Staffelwechsel', body: 'Zu früher Start (Frühstart) oder unsauberer Anschlag des ankommenden Schwimmers — DSQ der ganzen Staffel.' },
          { label: 'Regelverstoß bei Start, Schwimmart oder Zielanschlag', body: 'Kombination aus mehreren möglichen Verstößen — Wertung richtet sich nach dem aktuellen FINA/DSV-Regelwerk und der Wettkampf-Ausschreibung.' },
          { label: 'Bahn verlassen oder Behinderung', body: 'Schwimmer wechselt die Bahn oder behindert einen anderen — Disqualifikation, in seltenen Fällen auch Sperre.' },
          { label: 'Hilfsmittel nicht erlaubt', body: 'Flossen, Schnorchel oder Auftriebshilfen sind im Wettkampf verboten (außer in spezialisierten Disziplinen). Verwendung = DSQ.' },
        ],
      },
      {
        heading: 'Wettkampfumfeld',
        items: [
          { label: 'Zeitnahme', body: 'Die Zeit wird elektronisch gemessen und ausgewertet — typisch über Druckkontaktplatten an der Wand und Lichtschranken. Bei kleineren Wettkämpfen auch durch Kampfrichter mit Stoppuhren.' },
          { label: 'Kampfrichter / Schiedsrichter', body: 'Überwachen Regeln, Starts, Wenden, Anschläge und mögliche Verstöße. Schiedsrichter hat Gesamtaufsicht, Wendekampfrichter beobachten die Wende, Zielrichter den Zielanschlag.' },
          { label: 'Startkommando', body: 'Klares, geregeltes Signal für einen regelgerechten Rennstart — Pfiff → „Auf die Plätze" → Startsignal. International: „Take your marks". One-Start-Rule.' },
          { label: 'Bahnaufteilung', body: 'Bahnen werden zugewiesen und eingehalten — meist nach Setzliste (schnellste Zeit auf mittlerer Bahn). Bahnenleinen trennen die einzelnen Bahnen.' },
          { label: 'Ausschreibung und Streckenlänge', body: 'Definiert Regeln, Distanzen, Schwimmarten und Rahmenbedingungen — wer darf starten, welche Strecken werden geschwommen, welche Regeln gelten zusätzlich. Pflicht-Lektüre vor jedem Wettkampf.' },
          { label: 'Wettkampfgericht', body: 'Bestehend aus Schiedsrichter, Starter, Wendekampfrichtern, Zielrichtern und Sekretariat. Bei größeren Wettkämpfen zusätzlich Doping-Kommissar und Pressekoordination.' },
          { label: 'Wettkampfformen', body: 'Einzelrennen, Staffeln, Lagenrennen, Mixed-Staffeln. Zusätzlich Freiwasserschwimmen (im offenen Gewässer) — unterscheidet sich in Regeln und Ausstattung.' },
        ],
      },
      {
        heading: 'Was bedeuten die Begriffe?',
        items: [
          { label: 'Fehlstart', body: 'Ein Fehlstart liegt vor, wenn ein Schwimmer vor dem Startsignal startet oder sich zu früh in die Startbewegung begibt. Führt zur sofortigen Disqualifikation (One-Start-Rule der FINA).' },
          { label: 'Zielanschlag', body: 'Der Zielanschlag ist die regelgerechte Berührung der Wand am Ende des Rennens. Er entscheidet, wann die Strecke beendet ist — bei Brust und Schmetterling beidhändig, sonst einhändig.' },
          { label: 'Wende', body: 'Die Wende ist die regelgerechte Richtungsänderung an der Wand. Sie verbindet zwei Teilstrecken und soll möglichst schnell und sauber ausgeführt werden — vier verschiedene Wendetechniken je nach Schwimmart.' },
          { label: 'Staffelwechsel', body: 'Beim Staffelwechsel übernimmt der nächste Schwimmer. Er darf erst starten, wenn der vorherige Schwimmer korrekt angeschlagen hat. Frühstart = DSQ der ganzen Staffel.' },
          { label: 'Disqualifikation (DSQ)', body: 'Ausschluss aus dem Rennen wegen Regelverstoß — Schwimmer wird nicht gewertet, die Zeit wird nicht offiziell. Im Staffelfall trifft es die ganze Mannschaft.' },
          { label: 'Ausschreibung', body: 'Schriftliches Regelwerk eines Wettkampfs — definiert Disziplinen, Zeitlimits, Teilnahmeberechtigung, Startgelder, Zeitplan. Pflicht-Information vor der Anmeldung.' },
          { label: 'One-Start-Rule', body: 'FINA-Regel seit den 1990ern: ein Fehlstart = sofortige Disqualifikation. Vorher gab es eine zweite Chance, heute keine mehr — erhöht den Druck auf die Konzentration in der Stillephase.' },
          { label: 'Setzliste', body: 'Reihenfolge der Schwimmer auf den Bahnen, basierend auf Meldezeiten — schnellste Zeiten auf mittleren Bahnen (4–5), schwächere Zeiten außen. So treffen die Stärksten direkt aufeinander.' },
        ],
      },
      {
        heading: 'Praxisbezug — Aufsicht und Durchführung im Bäderbetrieb',
        items: [
          { label: 'Wettkämpfe erfordern klare Organisation', body: 'Vorbereitung mit Kampfgericht, Sicherheitskonzept, Sanitätsdienst, Bahnzuteilung und Zeitplan. Aufsichtskräfte unterstützen Sicherheit und Reibungslos-Ablauf.' },
          { label: 'Sicherheit im Wettkampf', body: 'Aufsichtskräfte achten auf Schwimmer-Sicherheit zwischen den Rennen, Wassertiefe für Startsprung mind. 1,80 m (besser 2,00 m), Erste-Hilfe-Material griffbereit.' },
          { label: 'Regelkenntnis als Aufsichtskraft', body: 'Bei Vereins- und Schul-Wettkämpfen wird die Aufsicht oft als Kampfrichter eingesetzt. Mindestens Grundkenntnisse der FINA/DSV-Regeln nötig — DSV bietet Kampfrichter-Lehrgänge.' },
          { label: 'Kommunikation', body: 'Mit Schwimmern, Trainern, Eltern, Sanitätsdienst und Schiedsrichter — Funkgerät oder Smartphone für schnelle Abstimmung bei Vorfällen.' },
          { label: 'Starts, Wenden und Abläufe verstehen', body: 'Aufsicht muss erkennen, wenn etwas schiefgeht — z. B. ein Schwimmer in Schwierigkeiten gerät, eine Wende mit Verletzung endet, ein Sturz vom Block passiert.' },
          { label: 'Veranstaltungstechnik', body: 'Lautsprecheranlage für Startkommando, elektronische Zeitmessung, Anzeigetafel, Bahnenleinen, Startblöcke — alles muss vor Wettkampfbeginn geprüft werden.' },
          { label: 'Notfälle im Wettkampf', body: 'Schwimmer bewusstlos im Wasser, Krampf, Wandkontakt mit Verletzung — sofortige Bergung, Rettungsschwimm-Maßnahmen, Sanitätsdienst alarmieren. Wettkampf wird unterbrochen.' },
          { label: 'Doping-Kontrollen bei größeren Wettkämpfen', body: 'Bei Landes- oder Bundesebene können Dopingkontrollen stattfinden — Aufsicht zeigt den Weg zur Kontrollstelle, schützt die Privatsphäre der Sportler.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'TECHNIK — REGELN — WENDESICHERHEIT — SAUBERER ZIELANSCHLAG', body: 'Vier Pfeiler des erfolgreichen Wettkampfschwimmens. Saubere Schwimmtechnik, Regelkenntnis, kompakte und regelgerechte Wenden, dazu ein präziser Zielanschlag — wer alle vier beherrscht, gewinnt Zeit und vermeidet Disqualifikation.' },
          { label: 'IM ZWEIFEL: AUSSCHREIBUNG UND REGELWERK LESEN', body: 'Jeder Wettkampf hat eigene Bedingungen in der Ausschreibung. Wer sie kennt, vermeidet Überraschungen und Regelverstöße. Plus: Aktuelles FINA/DSV-Regelwerk als Grundlage.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/wettkampfschwimmen-arbeitsblatt.png',
    alt: 'Arbeitsblatt Wettkampfschwimmen zum Ausfüllen',
    tasks: [
      {
        id: 'schwimmarten',
        type: 'keyword-text',
        title: 'Aufgabe 1: Schwimmarten im Wettkampf',
        items: [
          {
            prompt: 'Freistil — nenne zwei wichtige Merkmale.',
            keywords: ['schnell', 'schnellste', 'wechselschlag', 'arme', 'wechsel', 'kraul', 'beinschlag', 'frei', 'wählbar', 'waehlbar', 'frei wählbar', 'frei waehlbar'],
            minMatches: 2,
            sampleAnswer:
              'Freistil ist meist die schnellste Schwimmart und wird mit Wechselschlag der Arme geschwommen — fast immer als Kraul. Der Beinschlag ist im Wettkampf frei wählbar, in Lagenrennen darf Freistil aber nicht Rücken, Brust oder Schmetterling sein.',
          },
          {
            prompt: 'Rückenschwimmen — nenne zwei wichtige Merkmale.',
            keywords: ['rückenlage', 'rueckenlage', 'rücken', 'ruecken', 'wechselschlag', 'arme', 'wechsel', 'beinschlag', 'rückenlage', 'rueckenlage', 'wasserstart', 'aus dem wasser', 'wand', 'griffe'],
            minMatches: 2,
            sampleAnswer:
              'Rückenschwimmen wird in Rückenlage geschwommen, mit Wechselschlag der Arme und Beinschlag in Rückenlage. Der Start erfolgt aus dem Wasser an der Wand — Hände an den Startgriffen, Füße an der Wand.',
          },
          {
            prompt: 'Brustschwimmen — nenne zwei wichtige Merkmale.',
            keywords: ['symmetrisch', 'gleichzeitig', 'arm', 'bein', 'beidhändig', 'beidhaendig', 'anschlag', 'brustbeinschlag', 'froschkick', 'kopf', 'auftauchen', 'koordiniert', 'atmung'],
            minMatches: 2,
            sampleAnswer:
              'Brustschwimmen erfolgt mit symmetrischen Arm- und Beinbewegungen — beide Arme und Beine immer gleichzeitig. Der Brustbeinschlag (Froschkick) und das gleichzeitige Ziehen und Stoßen der Arme sind charakteristisch. Bei jedem Zyklus muss der Kopf an die Oberfläche, beim Anschlag müssen beide Hände gleichzeitig die Wand berühren.',
          },
          {
            prompt: 'Schmetterlingsschwimmen — nenne zwei wichtige Merkmale.',
            keywords: ['gleichzeitig', 'armzug', 'beidarmig', 'beide arme', 'über wasser', 'ueber wasser', 'delfin', 'delfinbeinschlag', 'wellenbewegung', 'ganzkörper', 'ganzkoerper', 'kraftvoll', 'beidhändig', 'beidhaendig'],
            minMatches: 2,
            sampleAnswer:
              'Schmetterlingsschwimmen hat einen gleichzeitigen Armzug — beide Arme bewegen sich beidarmig über Wasser nach vorn. Der Delfinbeinschlag mit Wellenbewegung verbindet die Bewegung zu einer kraftvollen Ganzkörperaktion. Beim Anschlag müssen beide Hände gleichzeitig die Wand berühren.',
          },
        ],
      },
      {
        id: 'reihenfolge',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Bestandteile eines Rennens — richtige Reihenfolge',
        prompt: 'Trage die vier Bestandteile in der richtigen Reihenfolge ein (1 = zuerst, 4 = zuletzt).',
        items: [
          { number: 1, accept: ['Start', 'Startsprung', 'Startphase'] },
          { number: 2, accept: ['Schwimmstrecke', 'Strecke', 'Schwimmen', 'Strecke schwimmen', 'Hauptstrecke'] },
          { number: 3, accept: ['Wende', 'Wenden', 'Wendebewegung'] },
          { number: 4, accept: ['Zielanschlag', 'Anschlag', 'Ziel', 'Zielberührung', 'Zielberuehrung'] },
        ],
      },
      {
        id: 'begriffe',
        type: 'keyword-text',
        title: 'Aufgabe 3: Erkläre die Begriffe in eigenen Worten',
        items: [
          {
            prompt: 'Fehlstart — was ist das?',
            keywords: ['vor dem startsignal', 'vor dem signal', 'startet', 'zu früh', 'zu frueh', 'startbewegung', 'frühstart', 'fruehstart', 'bewegung', 'disqualifikation', 'one-start-rule', 'reglement'],
            minMatches: 2,
            sampleAnswer:
              'Ein Fehlstart liegt vor, wenn ein Schwimmer vor dem Startsignal startet oder sich zu früh in die Startbewegung begibt — auch unwillkürliches Wackeln in der Stillephase zählt. Folge ist die sofortige Disqualifikation (One-Start-Rule der FINA, keine zweite Chance).',
          },
          {
            prompt: 'Zielanschlag — was ist das?',
            keywords: ['regelgerecht', 'berührung', 'beruehrung', 'wand', 'ende', 'rennen', 'beendet', 'beidhändig', 'beidhaendig', 'einhändig', 'einhaendig', 'wertung', 'zeit'],
            minMatches: 2,
            sampleAnswer:
              'Der Zielanschlag ist die regelgerechte Berührung der Wand am Ende des Rennens. Er entscheidet, wann die Strecke offiziell beendet ist und mit über die Wertung. Bei Brust und Schmetterling beidhändig Pflicht, bei Kraul und Rücken kann einhändig angeschlagen werden.',
          },
          {
            prompt: 'Wende — was ist das?',
            keywords: ['regelgerechte', 'richtungsänderung', 'richtungsaenderung', 'wand', 'verbindet', 'teilstrecken', 'schnell', 'sauber', 'wendetechniken', 'kipp', 'rücken', 'ruecken', 'brust', 'schmetterling'],
            minMatches: 2,
            sampleAnswer:
              'Die Wende ist die regelgerechte Richtungsänderung an der Wand — sie verbindet zwei Teilstrecken und soll möglichst schnell und sauber ausgeführt werden. Es gibt vier Wendetechniken je nach Schwimmart: Kippwende (Freistil), Rückenwende, Brustwende und Schmetterlingswende.',
          },
          {
            prompt: 'Staffelwechsel — was ist das?',
            keywords: ['nächste', 'naechste', 'schwimmer', 'übernimmt', 'uebernimmt', 'erst starten', 'wenn der vorherige', 'angeschlagen', 'wandkontakt', 'frühstart', 'fruehstart', 'disqualifikation', 'staffel'],
            minMatches: 2,
            sampleAnswer:
              'Beim Staffelwechsel übernimmt der nächste Schwimmer. Er darf erst starten, wenn der vorherige Schwimmer korrekt die Wand angeschlagen hat. Ein Frühstart führt zur sofortigen Disqualifikation der ganzen Staffel — auch wenn nur einer der vier Wechsel zu früh war.',
          },
        ],
      },
      {
        id: 'wichtige-dinge',
        type: 'open-list',
        title: 'Aufgabe 4: Was ist im Wettkampfschwimmen wichtig?',
        prompt: 'Nenne mindestens vier Dinge, die im Wettkampfschwimmen wichtig sind.',
        expectedCount: 4,
        pool: [
          { accept: ['Reaktion auf das Startsignal', 'Reaktion', 'Schnelle Reaktion', 'Reaktion auf Startsignal', 'Startsignal-Reaktion'] },
          { accept: ['Saubere Technik', 'Saubere Schwimmtechnik', 'Technik', 'Korrekte Technik', 'Schwimmtechnik'] },
          { accept: ['Regelgerechte Wenden', 'Regelgerechte Wende', 'Saubere Wenden', 'Wenden', 'Korrekte Wenden'] },
          { accept: ['Regelgerechter Zielanschlag', 'Sauberer Zielanschlag', 'Zielanschlag', 'Anschlag', 'Korrekter Anschlag'] },
          { accept: ['Einhaltung der Schwimmart', 'Einhaltung der vorgeschriebenen Schwimmart', 'Schwimmart einhalten', 'Vorgeschriebene Schwimmart', 'Korrekte Schwimmart'] },
          { accept: ['Konzentration', 'Mentale Stärke', 'Mentale Staerke', 'Fokus', 'Konzentration im Rennen'] },
          { accept: ['Rhythmus', 'Gleichmäßiger Rhythmus', 'Gleichmaessiger Rhythmus', 'Gleichmäßiges Tempo', 'Gleichmaessiges Tempo'] },
          { accept: ['Ausdauer', 'Kondition', 'Durchhaltevermögen', 'Durchhaltevermoegen', 'Kraftreserven'] },
          { accept: ['Bahn einhalten', 'Bahnen einhalten', 'In der Bahn bleiben', 'Bahn nicht verlassen'] },
          { accept: ['Korrekter Staffelwechsel', 'Sauberer Staffelwechsel', 'Staffelwechsel', 'Wechselzeit', 'Wechsel timen'] },
          { accept: ['Regelkenntnis', 'Regeln kennen', 'Regelwerk kennen', 'FINA-Regeln', 'DSV-Regeln'] },
        ],
      },
      {
        id: 'disqualifikation',
        type: 'open-list',
        title: 'Aufgabe 5: Gründe für Fehler oder Disqualifikation',
        prompt: 'Nenne mindestens drei mögliche Gründe für Fehler oder Disqualifikation.',
        expectedCount: 3,
        pool: [
          { accept: ['Fehlstart', 'Frühstart', 'Fruehstart', 'Bewegung vor dem Signal', 'Start vor dem Signal'] },
          { accept: ['Falsche Wende', 'Falscher Anschlag', 'Falsche Wende oder Anschlag', 'Wendefehler', 'Anschlagfehler', 'Unsaubere Wende', 'Wende-Fehler'] },
          { accept: ['Verlassen der vorgeschriebenen Schwimmart', 'Verlassen der Schwimmart', 'Falsche Schwimmart', 'Schwimmart-Verstoß', 'Schwimmart-Verstoss', 'Verlassen der Schwimmart in Lagenrennen'] },
          { accept: ['Zu früher Staffelwechsel', 'Zu frueher Staffelwechsel', 'Frühstart in der Staffel', 'Fruehstart in der Staffel', 'Unsauberer Staffelwechsel', 'Staffelwechsel zu früh', 'Staffelwechsel zu frueh', 'Wechselfehler'] },
          { accept: ['Falscher Zielanschlag', 'Unsauberer Zielanschlag', 'Zielanschlag falsch', 'Anschlag-Fehler im Ziel'] },
          { accept: ['Bahn verlassen', 'Bahn wechseln', 'Behinderung anderer Schwimmer', 'Andere Schwimmer behindern', 'Bahnverlassen'] },
          { accept: ['Hilfsmittel benutzt', 'Verbotene Hilfsmittel', 'Flossen', 'Schnorchel', 'Auftriebshilfen'] },
          { accept: ['Regelverstoß', 'Regelverstoss', 'Allgemeiner Regelverstoß', 'Allgemeiner Regelverstoss', 'Verstoß gegen das Regelwerk', 'Verstoss gegen das Regelwerk'] },
        ],
      },
      {
        id: 'wettkampfumfeld',
        type: 'keyword-text',
        title: 'Aufgabe 6: Wettkampfumfeld — Erkläre die Begriffe',
        items: [
          {
            prompt: 'Zeitnahme — was ist das?',
            keywords: ['zeit', 'gemessen', 'messung', 'elektronisch', 'auswertung', 'kampfrichter', 'stoppuhr', 'druckkontaktplatten', 'lichtschranken', 'auswertet'],
            minMatches: 2,
            sampleAnswer:
              'Die Zeitnahme misst und wertet die Zeit aus — meist elektronisch über Druckkontaktplatten an der Wand und Lichtschranken am Start. Bei kleineren Wettkämpfen unterstützen Kampfrichter mit Stoppuhren.',
          },
          {
            prompt: 'Kampfrichter / Schiedsrichter — was machen sie?',
            keywords: ['überwachen', 'ueberwachen', 'regeln', 'starts', 'wenden', 'anschläge', 'anschlaege', 'verstöße', 'verstoesse', 'beobachten', 'gesamtaufsicht', 'wendekampfrichter', 'zielrichter'],
            minMatches: 2,
            sampleAnswer:
              'Kampfrichter und Schiedsrichter überwachen Regeln, Starts, Wenden, Anschläge und mögliche Verstöße. Der Schiedsrichter hat die Gesamtaufsicht, Wendekampfrichter beobachten die Wenden, Zielrichter den Zielanschlag.',
          },
          {
            prompt: 'Startkommando — was ist das?',
            keywords: ['klares', 'signal', 'regelgerechten', 'rennstart', 'pfiff', 'auf die plätze', 'auf die plaetze', 'take your marks', 'startsignal', 'one-start-rule'],
            minMatches: 2,
            sampleAnswer:
              'Das Startkommando ist ein klares, geregeltes Signal für einen regelgerechten Rennstart — Ablauf: langer Pfiff → Schwimmer auf den Block → „Auf die Plätze" / „Take your marks" → Stillephase → Startsignal. Bewegung vor dem Signal = Fehlstart, sofortige Disqualifikation.',
          },
          {
            prompt: 'Bahnaufteilung — was ist das?',
            keywords: ['bahnen', 'zugewiesen', 'eingehalten', 'setzliste', 'meldezeiten', 'mittlere bahn', 'bahnenleinen', 'trennen'],
            minMatches: 2,
            sampleAnswer:
              'Die Bahnaufteilung legt fest, auf welcher Bahn jeder Schwimmer startet — meist nach Setzliste (schnellste Meldezeiten auf den mittleren Bahnen 4–5, schwächere außen). Bahnenleinen trennen die einzelnen Bahnen voneinander.',
          },
          {
            prompt: 'Ausschreibung und Streckenlänge — was bedeuten sie?',
            keywords: ['regeln', 'distanzen', 'rahmenbedingungen', 'wettkampfform', 'ausschreibung', 'streckenlänge', 'streckenlaenge', 'definiert', 'festgelegt', 'pflicht'],
            minMatches: 2,
            sampleAnswer:
              'Die Ausschreibung und Streckenlänge definieren Regeln, Distanzen, Schwimmarten und Rahmenbedingungen eines Wettkampfs — wer darf starten, welche Strecken werden geschwommen, welche Regeln gelten zusätzlich. Pflicht-Lektüre vor jeder Anmeldung.',
          },
        ],
      },
    ],
  },
};

export default wettkampfschwimmen;
