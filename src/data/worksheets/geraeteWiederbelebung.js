const geraeteWiederbelebung = {
  id: 'geraete-wiederbelebung',
  title: 'Geräte für die Wiederbelebung',
  subtitle: 'AED, Pocket-Maske, Beatmungsbeutel und weitere Hilfsmittel',
  category: 'first',
  icon: '🫀',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/geraete-wiederbelebung-referenz.png',
    alt: 'Lernblatt Geräte für die Wiederbelebung — AED, Pocket-Maske, Beatmungsbeutel',
    intro:
      'Bei der Wiederbelebung unterstützen verschiedene Geräte die Herzdruckmassage und Beatmung — sie ersetzen sie aber nicht. Die wichtigsten Hilfsmittel: AED (Automatisierter Externer Defibrillator), Pocket-Maske für hygienische Beatmung, Beatmungsbeutel (Ambu-Beutel) sowie weitere Hilfsmittel wie Einmalhandschuhe, Schutzfolie/Beatmungstuch, Schere/Kleiderschere und Sauerstoffgerät. Wichtigster Grundsatz: Eigenschutz beachten, 112 veranlassen, Atmung und Bewusstsein prüfen, HLW ohne unnötige Unterbrechungen, Geräte sicher und zügig einsetzen. Merksatz: DRÜCKEN RETTET ZEIT — DER AED FÜHRT — BEATMUNGSHILFEN UNTERSTÜTZEN.',
    sections: [
      {
        heading: 'Ablauf der Wiederbelebung',
        items: [
          { label: '1. Prüfen', body: 'Bewusstsein und Atmung prüfen — laut ansprechen, an den Schultern rütteln, Atmung max. 10 Sek. sehen/hören/fühlen. Schnappatmung gilt NICHT als normale Atmung.' },
          { label: '2. Rufen', body: 'Notruf 112 veranlassen oder rufen lassen — gezielt eine Person ansprechen. Lautsprecher nutzen, damit der Disponent zuhört.' },
          { label: '3. Drücken', body: 'Thoraxkompression beginnen — 100–120/min, 5–6 cm tief, vollständig entlasten. Druckpunkt: Mitte des Brustkorbs, untere Hälfte des Brustbeins.' },
          { label: '4. AED einsetzen', body: 'Sobald verfügbar: Gerät einschalten und Anweisungen folgen. Frühzeitiger AED-Einsatz verdoppelt bis verdreifacht die Überlebenschance.' },
          { label: '5. Beatmung — nur wenn geschult und bereit', body: 'Beatmung mit Pocket-Maske oder Beatmungsbeutel erst, wenn Helfer geschult ist. Sonst: durchgehende Herzdruckmassage (Hands-only-CPR).' },
        ],
      },
      {
        heading: '1. AED (Automatisierter Externer Defibrillator)',
        items: [
          { label: 'Was macht der AED?', body: 'Analysiert den Herzrhythmus und gibt klare Sprach- und/oder Bildanweisungen. Bei kritischen Rhythmen (Kammerflimmern, ventrikuläre Tachykardie) gibt er einen Stromstoß.' },
          { label: 'Elektroden anlegen', body: 'Auf den entkleideten Brustkorb kleben — Position laut Bild auf den Elektroden: rechts neben dem Brustbein und links seitlich unter der Achsel.' },
          { label: 'Während Analyse und Schock: Niemand berührt die Person', body: 'Wichtig für Sicherheit und korrekte Analyse — alle einen Schritt zurück, „Weg von der Person!" rufen.' },
          { label: 'Nach Schock oder „kein Schock": sofort mit HLW fortfahren', body: 'Keine Pause — Thoraxkompressionen sofort wieder aufnehmen. Der AED meldet sich nach 2 Min. erneut zur Analyse.' },
          { label: 'Früh einsetzen — nicht aufschieben', body: 'Jede Minute ohne Defibrillation reduziert die Überlebenschance um ca. 10 %. Sobald AED da ist: ANSCHALTEN.' },
          { label: 'Sicherheitshinweis', body: 'Wasserbereich sichern, Brustkorb möglichst trocken (Tuch nutzen), Anweisungen des Geräts befolgen. Keine Defibrillation in Pfütze oder auf Metallplatte.' },
        ],
      },
      {
        heading: '2. Pocket-Maske',
        items: [
          { label: 'Was ist das?', body: 'Hilfsmittel für hygienischere Beatmung — eine durchsichtige Maske mit Ventil, die zwischen Helfer und Patient platziert wird.' },
          { label: 'Auf Mund und Nase dicht aufsetzen', body: 'Maske mit beiden Händen fixieren (C-Griff), Mund und Nase dicht abdecken — sonst entweicht Luft seitlich.' },
          { label: 'Kopf überstrecken, Kinn anheben, auf dichten Sitz achten', body: 'Atemwege freimachen, Kinn nach vorne ziehen, Maske dicht aufdrücken. Bei Wirbelsäulenverdacht: nur Esmarch-Handgriff (Unterkiefer vorziehen).' },
          { label: 'Beatmung nur durchführen, wenn geschult und bereit', body: 'Wer nicht geschult ist: durchgehende Herzdruckmassage statt unsicherer Beatmungsversuche. Hands-only-CPR ist auch wirksam.' },
          { label: 'Schützt durch Ventil/Filter', body: 'Einwegventil verhindert Rückatmung von Erbrochenem oder Sekret — Schutz für den Helfer. Filter zusätzlich gegen Aerosole.' },
        ],
      },
      {
        heading: '3. Beatmungsbeutel (Ambu-Beutel)',
        items: [
          { label: 'Was ist das?', body: 'Beatmungsbeutel mit Maske, manchmal auch Ambu-Beutel genannt (nach dem Hersteller). Selbstfüllender Beutel mit Ventil und Maske.' },
          { label: 'Dient zur kontrollierten Beatmung mit Maske', body: 'Erlaubt dosierte Beatmung — Volumen und Geschwindigkeit besser steuerbar als bei Mund-zu-Maske-Beatmung.' },
          { label: 'Erfordert Übung für dichten Sitz und wirksame Beatmung', body: 'C-Griff zum Fixieren der Maske, gleichzeitig Drücken des Beutels — anspruchsvoll, deshalb Übung nötig.' },
          { label: 'Wenn vorhanden: oft in Kombination mit Sauerstoff', body: 'Beatmungsbeutel kann an Sauerstoffflasche angeschlossen werden — dann Beatmung mit erhöhtem O₂-Anteil. Nur nach Einweisung.' },
          { label: 'Nur nach Ausbildung, Einweisung oder betrieblicher Vorgabe einsetzen', body: 'Falsche Anwendung kann Magen aufblasen, Aspirationsgefahr erhöhen — deshalb nur durch geschulte Personen.' },
          { label: 'Zu starke oder zu schnelle Beatmung vermeiden', body: 'Sanft und gleichmäßig — Brustkorb soll sich sichtbar heben, dann passive Ausatmung abwarten. Zu viel Druck → Magenaufblähung.' },
        ],
      },
      {
        heading: '4. Weitere wichtige Hilfsmittel',
        items: [
          { label: 'Einmalhandschuhe', body: 'Schützen vor direktem Kontakt mit Körperflüssigkeiten — Eigenschutz und Hygiene. Sollten in jeder Erste-Hilfe-Station griffbereit sein.' },
          { label: 'Schutzfolie / Beatmungstuch oder Reserve-Maske', body: 'Schutzfolie oder Beatmungstuch als Notfall-Beatmungshilfe — wenn keine Pocket-Maske greifbar ist. Reduziert direkten Kontakt mit Mund/Nase.' },
          { label: 'Schere / Kleiderschere', body: 'Hilft beim schnellen Öffnen oder Entfernen von Kleidung — wichtig zum Freilegen des Brustkorbs für AED-Pads. Spezielle Verbandsscheren mit abgerundeter Spitze.' },
          { label: 'Handtuch oder Tuch zum Trocknen des Brustkorbs', body: 'Vor dem Aufkleben der AED-Pads MUSS der Brustkorb trocken sein — sonst kein Kontakt, AED funktioniert nicht. Schweiß, Wasser, Blut entfernen.' },
          { label: 'Sauerstoffgerät mit Maske (optional)', body: 'Erweitertes Hilfsmittel — nur nach betrieblichem Standard und entsprechender Einweisung. Wird mit Beatmungsbeutel oder Sauerstoffmaske kombiniert.' },
          { label: 'Hilfsmittel ersetzen keine HLW', body: 'Alle Geräte unterstützen nur — die kontinuierliche Herzdruckmassage bleibt das Wichtigste. Geräte holen sollte parallel zur HLW geschehen, nicht statt dessen.' },
        ],
      },
      {
        heading: 'Wichtige Grundsätze',
        items: [
          { label: '1. Eigenschutz beachten', body: 'Vor jeder Maßnahme: eigene Sicherheit prüfen — Handschuhe, Beatmungsmaske, freier Bereich um die Person.' },
          { label: '2. 112 veranlassen bzw. Hilfe organisieren', body: 'Notruf so früh wie möglich — gezielt eine Person bitten, niemals „irgendjemand". Lautsprecher anlassen.' },
          { label: '3. Atmung und Bewusstsein prüfen', body: 'Standard: 10-Sek-Atemkontrolle, Schnappatmung erkennen. Bei keiner normalen Atmung: sofort HLW.' },
          { label: '4. HLW ohne unnötige Unterbrechungen durchführen', body: 'Jede Pause kostet Hirndurchblutung — nur für AED-Analyse, Schockabgabe und Personalwechsel unterbrechen.' },
          { label: '5. Geräte sicher und zügig einsetzen', body: 'AED sofort anschalten, Pocket-Maske/Beatmungsbeutel nur wenn geschult, Sauerstoff nur nach Einweisung.' },
        ],
      },
      {
        heading: 'Was bedeuten die Begriffe?',
        items: [
          { label: 'AED (Automatisierter Externer Defibrillator)', body: 'Tragbares medizinisches Gerät, das den Herzrhythmus analysiert und im Notfall einen Stromstoß abgibt. Auch von Laien sicher zu bedienen — gibt klare Anweisungen.' },
          { label: 'Pocket-Maske', body: 'Kompakte Beatmungsmaske mit Einwegventil — schützt den Helfer vor Erbrochenem oder Sekret bei der Beatmung. Standard-Hilfsmittel im Erste-Hilfe-Kasten.' },
          { label: 'Beatmungsbeutel (Ambu-Beutel)', body: 'Selbstfüllender Beutel mit Maske für die manuelle Beatmung — präziser dosierbar als Mund-zu-Maske, aber Übung nötig.' },
          { label: 'Hands-only-CPR', body: 'Wiederbelebung nur mit Herzdruckmassage, ohne Beatmung — empfohlen für ungeschulte Helfer. Auch wirksam, vor allem in den ersten Minuten.' },
          { label: 'C-Griff', body: 'Handgriff zum Fixieren der Beatmungsmaske: Daumen und Zeigefinger bilden ein C über der Maske, die anderen Finger ziehen den Unterkiefer hoch.' },
          { label: 'Defibrillation', body: 'Stromstoß durch das Herz, um lebensbedrohliche Rhythmusstörungen (Kammerflimmern) zu beenden. Ziel: Wiederherstellung des normalen Rhythmus.' },
          { label: 'Schnappatmung', body: 'Flache, langsame Schnaufer bei Kreislaufstillstand — KEINE normale Atmung. Sofort HLW beginnen.' },
          { label: 'Esmarch-Handgriff', body: 'Atemwegs-Freimachung ohne Kopf-Überstrecken — nur Unterkiefer nach vorn ziehen. Schonend bei Verdacht auf HWS-Verletzung.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'AED-Standort kennen', body: 'Jede Aufsichtskraft muss wissen, wo der AED hängt — meist mehrere im Bad, Schilder beachten. Standort allen bekannt.' },
          { label: 'Auf nassem Untergrund', body: 'Person aus dem Wasser holen, möglichst trockene Stelle suchen, Brustkorb mit Handtuch trockenwischen — AED funktioniert auch auf Fliesen, aber nicht in Pfützen.' },
          { label: 'Erste-Hilfe-Material', body: 'Pocket-Maske, Handschuhe, Schere, Tuch in jeder Erste-Hilfe-Station. Vor Schichtbeginn Sichtkontrolle.' },
          { label: 'AED-Wartung', body: 'Selbstchecks dokumentieren, Akkus und Pads regelmäßig prüfen — Pads haben Verfallsdatum. Standorte mind. monatlich kontrollieren.' },
          { label: 'Regelmäßige HLW-Schulung', body: 'Mindestens jährliche Auffrischung — HLW-Praxis verblasst schnell. Pocket-Maske und ggf. Beatmungsbeutel mit üben.' },
          { label: 'Sauerstoff-Standard', body: 'Wenn ein Bad ein Sauerstoffgerät vorhält: Standard schriftlich fixiert, Einweisung dokumentiert, nur durch eingewiesenes Personal anwenden.' },
          { label: 'Im Team arbeiten', body: 'HLW ist Teamarbeit: Einer drückt, einer beatmet/AED, einer koordiniert mit Rettungsdienst. Aufgaben klar verteilen.' },
          { label: 'Dokumentation', body: 'Jeden Reanimationseinsatz dokumentieren — Zeitstempel, Hergang, eingesetzte Geräte, Übergabe an Rettungsdienst. Wichtig für Qualität und Versicherung.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'DRÜCKEN RETTET ZEIT — DER AED FÜHRT — BEATMUNGSHILFEN UNTERSTÜTZEN', body: 'Drei Stichworte für die Geräte-Hierarchie. Herzdruckmassage rettet Sekunden ohne Sauerstoff im Hirn. Der AED gibt klare Anweisungen und behebt den Rhythmus. Beatmungshilfen ergänzen, ersetzen aber nicht die HLW.' },
          { label: 'GERÄTE UNTERSTÜTZEN — HLW BLEIBT ENTSCHEIDEND', body: 'Nie auf Geräte warten, wenn die HLW unterbrochen wäre. Drücken hat oberste Priorität, alles andere parallel.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/geraete-wiederbelebung-arbeitsblatt.png',
    alt: 'Arbeitsblatt Geräte für die Wiederbelebung zum Ausfüllen',
    tasks: [
      {
        id: 'zuordnen',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Begriffe zuordnen',
        prompt: 'Trage zu jedem Buchstaben (A–F) das passende Gerät ein. A: Unterstützt die Defibrillation und gibt Sprach-/Bildanweisungen. B: Hygienische Beatmungshilfe mit Ventil/Filter. C: Dient zur kontrollierten Beatmung mit Maske. D: Schützen vor direktem Kontakt mit Körperflüssigkeiten. E: Hilft beim schnellen Öffnen oder Entfernen von Kleidung. F: Optionales Hilfsmittel zur Sauerstoffgabe nach Einweisung/Standard.',
        items: [
          { number: 1, accept: ['AED', 'Automatisierter Externer Defibrillator', 'Defibrillator', 'Automatischer externer Defibrillator', 'Automatischer Externer Defibrillator'] },
          { number: 2, accept: ['Pocket-Maske', 'Pocketmaske', 'Beatmungsmaske', 'Taschenmaske', 'Beatmungshilfe mit Ventil', 'Maske mit Filter', 'Pocket Maske'] },
          { number: 3, accept: ['Beatmungsbeutel', 'Beatmungsbeutel mit Maske', 'Ambu-Beutel', 'Ambubeutel', 'Beutel-Masken-Beatmung', 'Beatmungsgerät mit Maske', 'Beatmungsgeraet mit Maske', 'Ambu Beutel'] },
          { number: 4, accept: ['Einmalhandschuhe', 'Handschuhe', 'Schutzhandschuhe', 'Einweghandschuhe', 'Medizinische Handschuhe', 'Latexhandschuhe', 'Nitrilhandschuhe'] },
          { number: 5, accept: ['Schere', 'Kleiderschere', 'Rettungsschere', 'Verbandschere', 'Kleidungsschere', 'Schere / Kleiderschere'] },
          { number: 6, accept: ['Sauerstoffgerät', 'Sauerstoffgeraet', 'Sauerstoffflasche', 'Sauerstoff', 'O2-Gerät', 'O2-Geraet', 'Sauerstoffsystem', 'Sauerstoffgabe', 'O2'] },
        ],
      },
      {
        id: 'reihenfolge',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Reihenfolge der Anwendung',
        prompt: 'Bringe die Schritte der Wiederbelebung in die richtige Reihenfolge (1 = zuerst, 6 = zuletzt).',
        items: [
          { number: 1, accept: ['Eigenschutz beachten', 'Eigenschutz', 'Sicher arbeiten', 'Eigene Sicherheit prüfen', 'Eigene Sicherheit pruefen'] },
          { number: 2, accept: ['Bewusstsein und Atmung prüfen', 'Bewusstsein und Atmung pruefen', 'Atmung prüfen', 'Atmung pruefen', 'Bewusstsein prüfen', 'Bewusstsein pruefen', 'Person prüfen', 'Person pruefen', 'Reaktion prüfen', 'Reaktion pruefen'] },
          { number: 3, accept: ['Notruf 112 veranlassen', '112 rufen', 'Notruf 112', 'Notruf', '112', 'Notruf absetzen', 'Hilfe holen', 'Rettungsdienst rufen'] },
          { number: 4, accept: ['Thoraxkompression durchführen', 'Thoraxkompression durchfuehren', 'Thoraxkompression', 'Herzdruckmassage', 'Drücken', 'Druecken', 'Brustkorbkompression', 'HLW beginnen'] },
          { number: 5, accept: ['AED einsetzen', 'AED einschalten', 'Defibrillator einsetzen', 'Elektroden kleben', 'Anweisungen des AED folgen', 'AED nutzen', 'AED holen und einsetzen', 'AED'] },
          { number: 6, accept: ['Beatmungshilfe vorbereiten', 'Beatmungshilfe nutzen', 'Beatmungshilfe vorbereiten / nutzen', 'Pocket-Maske nutzen', 'Beatmungsbeutel vorbereiten', 'Beatmungshilfe anwenden', 'Beatmung vorbereiten', 'Beatmung'] },
        ],
      },
      {
        id: 'kurzfragen',
        type: 'keyword-text',
        title: 'Aufgabe 3: Kurzfragen',
        items: [
          {
            prompt: '1. Wofür steht die Abkürzung AED?',
            keywords: ['automatisierter', 'automatisch', 'externer', 'defibrillator', 'analysiert', 'herzrhythmus', 'gerät', 'geraet', 'defibrillation', 'stromstoß', 'stromstoss'],
            minMatches: 2,
            sampleAnswer:
              'AED steht für Automatisierter Externer Defibrillator. Das Gerät analysiert den Herzrhythmus und gibt bei Bedarf einen Stromstoß zur Wiederherstellung eines normalen Herzrhythmus. Auch von Laien sicher bedienbar — gibt klare Sprach- und Bildanweisungen.',
          },
          {
            prompt: '2. Warum ist eine Pocket-Maske im Einsatz sinnvoll?',
            keywords: ['hygienisch', 'beatmung', 'schutz', 'direkten kontakt', 'ventil', 'filter', 'eigenschutz', 'infektion', 'mund', 'nase', 'erbrochenes', 'sekret'],
            minMatches: 3,
            sampleAnswer:
              'Eine Pocket-Maske ermöglicht eine hygienischere Beatmung. Sie hilft, direkten Kontakt zu Mund und Nase zu vermeiden, und kann durch Ventil oder Filter zusätzlichen Schutz vor Erbrochenem, Sekret oder Aerosolen bieten — Eigenschutz und Infektionsschutz für den Helfer.',
          },
          {
            prompt: '3. Was ist beim Beatmungsbeutel besonders zu beachten?',
            keywords: ['dichter sitz', 'dichter maskensitz', 'maske', 'kopfposition', 'atemwege', 'ruhig', 'nicht zu stark', 'nicht zu schnell', 'einweisung', 'ausbildung', 'betriebliche vorgabe', 'kontrolliert'],
            minMatches: 3,
            sampleAnswer:
              'Ein Beatmungsbeutel muss richtig angewendet werden. Wichtig sind ein dichter Maskensitz (C-Griff), eine geeignete Kopfposition, ruhiges und kontrolliertes Beatmen sowie keine zu starke oder zu schnelle Beatmung. Er sollte nur nach Ausbildung, Einweisung oder betrieblicher Vorgabe genutzt werden.',
          },
          {
            prompt: '4. Warum sind Einmalhandschuhe wichtig?',
            keywords: ['schutz', 'eigenschutz', 'hygiene', 'körperflüssigkeiten', 'koerperfluessigkeiten', 'blut', 'speichel', 'infektion', 'direkter kontakt', 'kontakt vermeiden'],
            minMatches: 3,
            sampleAnswer:
              'Einmalhandschuhe schützen Ersthelfer und betroffene Person vor direktem Kontakt mit Blut, Speichel oder anderen Körperflüssigkeiten. Sie dienen dem Eigenschutz und der Hygiene — Infektionen wie HIV oder Hepatitis können so vermieden werden.',
          },
          {
            prompt: '5. Welche Aufgabe hat eine Kleiderschere im Notfall?',
            keywords: ['kleidung', 'öffnen', 'oeffnen', 'entfernen', 'brustkorb', 'freilegen', 'aed', 'klebestellen', 'pads', 'schnell', 'sicher', 'verletzungen', 'zugang'],
            minMatches: 3,
            sampleAnswer:
              'Eine Kleiderschere hilft, Kleidung schnell und sicher zu öffnen oder zu entfernen, damit Brustkorb, Verletzungen oder AED-Klebestellen erreichbar werden. Speziell die abgerundete Spitze schützt die Haut vor Verletzungen beim schnellen Aufschneiden.',
          },
          {
            prompt: '6. Warum ersetzen Hilfsmittel nicht die HLW?',
            keywords: ['unterstützen', 'unterstuetzen', 'ergänzen', 'ergaenzen', 'hlw', 'herzdruckmassage', 'entscheidend', 'unterbrechungen', 'drücken', 'druecken', 'aed ersetzt nicht', 'beatmungshilfe ersetzt nicht', 'kontinuierlich'],
            minMatches: 3,
            sampleAnswer:
              'Hilfsmittel unterstützen die Wiederbelebung, aber sie ersetzen nicht die Herzdruckmassage. Entscheidend bleibt, dass die HLW ohne unnötige Unterbrechungen durchgeführt wird — auch der AED ersetzt keine Herzdruckmassage, sondern ergänzt sie. Drücken rettet Zeit, alles andere kommt parallel dazu.',
          },
        ],
      },
      {
        id: 'richtig-falsch',
        type: 'numbered-labels',
        title: 'Aufgabe 4: Richtig oder falsch?',
        prompt: 'Trage zu jeder Aussage „Richtig" oder „Falsch" ein.',
        items: [
          { number: 1, accept: ['Falsch', 'falsch', 'F', 'f'] },
          { number: 2, accept: ['Richtig', 'richtig', 'R', 'r'] },
          { number: 3, accept: ['Richtig', 'richtig', 'R', 'r'] },
          { number: 4, accept: ['Falsch', 'falsch', 'F', 'f'] },
          { number: 5, accept: ['Richtig', 'richtig', 'R', 'r'] },
          { number: 6, accept: ['Richtig', 'richtig', 'R', 'r'] },
        ],
      },
      {
        id: 'merksatz',
        type: 'numbered-labels',
        title: 'Aufgabe 5: Merksatz ergänzen',
        prompt: 'Fülle die drei Lücken: „___ rettet Zeit — der ___ führt — Beatmungshilfen ___."',
        items: [
          { number: 1, accept: ['Drücken', 'Druecken', 'Herzdruckmassage', 'Thoraxkompression', 'Brustkorbkompression', 'drücken', 'druecken'] },
          { number: 2, accept: ['AED', 'aed', 'Defibrillator', 'Automatisierter Externer Defibrillator'] },
          { number: 3, accept: ['Unterstützen', 'Unterstuetzen', 'unterstützen', 'unterstuetzen', 'Helfen', 'helfen', 'Ergänzen', 'Ergaenzen', 'ergänzen', 'ergaenzen'] },
        ],
      },
    ],
  },
};

export default geraeteWiederbelebung;
