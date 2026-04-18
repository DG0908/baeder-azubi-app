export const FIRST_QUESTIONS = [
    { q: 'Was ist die stabile Seitenlage?', a: ['Lagerung bewusstloser, atmender Personen', 'Schwimmposition auf dem Rücken', 'Erste-Hilfe-Maßnahme bei Herzinfarkt', 'Rettungsgriff beim Schleppen im Wasser'], correct: 0 },
    { q: 'Wie oft drückt man bei einer Herzdruckmassage pro Minute?', a: ['100-120 mal', '60 mal', '200 mal', '30 mal'], correct: 0 },
    { q: 'Was ist ein Defibrillator?', a: ['Gerät zur Herzrhythmus-Wiederherstellung', 'Beatmungsgerät für die künstliche Beatmung', 'Blutdruckmessgerät für die Vitalzeichenkontrolle', 'Thermometer zur Körpertemperaturmessung'], correct: 0 },
    // Lagerungsarten
    { q: 'Wie wird eine Person mit Sonnenstich gelagert?', a: ['Oberkörper erhöht, Kopf kühlen', 'Flach auf dem Bauch, Sonne meiden', 'Kopfüber für bessere Hirndurchblutung', 'In der Sonne weiterliegenlassen'], correct: 0 },
    { q: 'Wie wird eine Person mit Herzinfarkt gelagert?', a: ['Oberkörper erhöht (Herz entlasten)', 'Kopfüber zur Entlastung des Herzens', 'Flach auf dem Bauch mit angewinkelten Beinen', 'Stehend mit Stütze – Herz braucht Bewegung'], correct: 0 },
    { q: 'Wie wird eine Person mit Hitzeerschöpfung gelagert?', a: ['Flach lagern, Beine hoch, kühlen', 'Oberkörper hoch wie beim Herzinfarkt', 'In der Sonne – Kühlung ist unnötig', 'Kopfüber für Kreislaufunterstützung'], correct: 0 },
    { q: 'Wie wird eine Person mit Volumenmangelschock gelagert?', a: ['Schocklage: Beine hoch', 'Oberkörper hoch wie beim Herzinfarkt', 'Sitzend mit gespreizten Beinen', 'Kopfüber – Blut fließt zum Herzen'], correct: 0 },
    { q: 'Wie wird eine Person mit Hitzschlag gelagert?', a: ['Flach lagern, schnell kühlen, Notruf!', 'In der Sonne lassen – direktes Sonnenlicht aktiviert die körpereigene Kühlung', 'Warm einpacken – das steigert die Durchblutung und unterstützt die Genesung', 'Heißen Tee geben – die Flüssigkeit regt das Schwitzen und die Abkühlung an'], correct: 0 },
    { q: 'Wie wird eine Person mit Schlaganfall gelagert?', a: ['Oberkörper erhöht (30°), beengende Kleidung öffnen', 'Flach auf dem Bauch für bessere Atemwege', 'Kopfüber zur Förderung der Hirndurchblutung', 'Stehend mit Unterstützung – Bewegung hilft dem Gehirn'], correct: 0 },
    // Verbandsbuch
    { q: 'Was muss im Verbandsbuch eingetragen werden?', a: ['Name des Verletzten und Art der Verletzung', 'Lieblingsspeise und Unverträglichkeiten', 'Schuhgröße für passende Schutzausrüstung', 'Haarfarbe für die Personenbeschreibung'], correct: 0 },
    { q: 'Welche Einträge gehören ins Verbandsbuch? (Mehrere richtig)', a: ['Datum und Uhrzeit', 'Name des Verletzten', 'Art der Verletzung', 'Durchgeführte Maßnahmen'], correct: [0, 1, 2, 3], multi: true },
    // Neuner-Regel
    { q: 'Was beschreibt die Neuner-Regel?', a: ['Einschätzung der verbrannten Körperoberfläche in %', 'Mindestanzahl der Rettungsschwimmer je Beckenabschnitt', 'Die neun wichtigsten Parameter bei der Chlor-Dosierung im Beckenwasser', 'Anzahl der Pflichtschwimmbahnpausen pro Tag nach Bäderbetriebsordnung'], correct: 0 },
    { q: 'Wie viel % der Körperoberfläche macht ein Arm nach der Neuner-Regel aus?', a: ['9%', '18%', '27%', '36%'], correct: 0 },
    { q: 'Wie viel % der Körperoberfläche macht ein Bein nach der Neuner-Regel aus?', a: ['18%', '9%', '27%', '36%'], correct: 0 },
    // Reanimation Ankreuzfragen
    { q: 'Was ist die Funktion der Koronararterien?', a: ['Herzmuskelzellen mit sauerstoffreichem Blut versorgen', 'Herzmuskelzellen mit venösem (sauerstoffarmem) Blut versorgen', 'Blut aus dem linken Ventrikel in die Aorta pumpen', 'Die Herzklappen durch Blutdruck öffnen und schließen'], correct: 0 },
    { q: 'Was ist bei der Reanimation von Säuglingen FALSCH?', a: ['Kopf stark überstrecken', 'Harte Unterlage verwenden', '5 Initialbeatmungen', 'Puls an der Arminnenseite tasten'], correct: 0 },
    { q: 'Wie tief drückt man bei der Reanimation von Säuglingen?', a: ['Ca. 1/3 des Brustkorbs (4 cm)', '4-5 cm – wie bei Erwachsenen, da Säuglinge relativ zur Körpergröße gleich druckfest sind', '0,5 cm – bei Säuglingen reicht ein sehr sanfter Druck zur Herzstimulation', 'So tief wie möglich – mehr Druck erhöht immer die Pumpwirkung'], correct: 0 },

    // ===== PRÜFUNGSFACH 1: ERSTE HILFE (Fragen 96-157) =====

    // Frage 96: Telefonische Meldung Notfall - Notruf
    { q: 'Was gehört zu einer korrekten Notruf-Meldung?', a: ['Wo, Was, Wie viele, Welche Verletzungen, Warten auf Rückfragen', 'Nur den eigenen Namen nennen', 'Sofort auflegen und Hilfe vor Ort suchen', 'Nur "Hilfe" rufen – der Rest ergibt sich'], correct: 0 },
    // Frage 97: Glieder der Rettungskette
    { q: 'Was ist das erste Glied der Rettungskette?', a: ['Absichern und Eigenschutz', 'Transport ins Krankenhaus', 'Notruf absetzen', 'Wiederbelebung'], correct: 0 },
    { q: 'Welche Glieder hat die Rettungskette?', a: ['Absichern - Notruf - Erste Hilfe - Rettungsdienst - Krankenhaus', 'Nur Notruf und Krankenhaus – dazwischen nichts', 'Nur Erste Hilfe und Transport ins Krankenhaus', 'Notruf - Warten - Krankenhaus – Erste Hilfe ist optional'], correct: 0 },
    // Frage 98: Rettungskette optimal abwickeln
    { q: 'Wie wickelt man die Rettungskette optimal ab?', a: ['Gleichzeitig: Einer ruft Notruf, anderer leistet Erste Hilfe', 'Erst alles alleine in Reihenfolge abarbeiten', 'Nur Notruf absetzen, dann auf Rettungsdienst warten', 'Erst ins Krankenhaus fahren, dann zurückkommen'], correct: 0 },
    // Frage 99: Rettungskette - Glieder benennen
    { q: 'Was ist das dritte Glied der Rettungskette?', a: ['Erste Hilfe leisten', 'Notruf absetzen', 'Absichern', 'Transport'], correct: 0 },
    // Frage 100: Strafgesetz unterlassene Hilfeleistung
    { q: 'Welche Konsequenzen hat unterlassene Hilfeleistung laut Strafgesetzbuch?', a: ['Freiheitsstrafe bis 1 Jahr oder Geldstrafe (§323c StGB)', 'Keine Konsequenzen – moralische Frage, keine Rechtsfrage', 'Nur eine Verwarnung ohne weitere Folgen', 'Nur strafbar wenn man den Unfall verursacht hat'], correct: 0 },
    // Frage 101: Beispiele unzumutbare Erste-Hilfe-Leistung
    { q: 'Wann ist Erste-Hilfe-Leistung unzumutbar?', a: ['Bei erheblicher Eigengefährdung (z.B. brennendes Auto)', 'Bei schlechtem Wetter und Kälte', 'Wenn man keine Ausbildung in Erster Hilfe hat', 'Wenn man spät zur Arbeit muss'], correct: 0 },
    // Frage 102: Notfall vs. Notsituation
    { q: 'Was unterscheidet einen Notfall von einer Notsituation?', a: ['Notfall = akute Lebensgefahr; Notsituation = keine unmittelbare Lebensgefahr', 'Kein Unterschied – beides bedeutet dasselbe', 'Notfall ist weniger schlimm als eine Notsituation', 'Notsituation ist immer lebensgefährlich, Notfall nicht'], correct: 0 },
    // Frage 103: Absicherung Unfallstelle im Badebetrieb
    { q: 'Wie sichert man eine Unfallstelle im Badebetrieb ab?', a: ['Bereich absperren, Badegäste fernhalten, ggf. Becken räumen', 'Nichts tun – Badegäste regeln das selbst', 'Weiterschwimmen lassen – Absperrung stört den Betrieb', 'Nur zuschauen und auf den Rettungsdienst warten'], correct: 0 },
    // Frage 104: Lebensrettende Sofortmaßnahmen als Ersthelfer
    { q: 'Welche lebensrettenden Sofortmaßnahmen gibt es?', a: ['Bewusstsein prüfen, Atmung prüfen, Notruf, HLW, stabile Seitenlage', 'Nur Notruf absetzen und auf den Rettungsdienst warten', 'Nur warten – Laien verschlimmern oft die Situation', 'Nur eine Decke geben und beruhigend zusprechen'], correct: 0 },
    // Frage 105: Symptome Kreislaufstillstand
    { q: 'Was sind Symptome eines Kreislaufstillstands?', a: ['Bewusstlosigkeit, keine normale Atmung, keine Reaktion', 'Kopfschmerzen und Schwindel', 'Hunger und Unterzuckerungsgefühl', 'Müdigkeit und Schlafbedürfnis'], correct: 0 },
    // Frage 106: Esmarch'scher Griff - Was ist das
    { q: 'Was ist der Esmarch\'sche Griff?', a: ['Handgriff zum Überstrecken des Kopfes und Anheben des Kinns', 'Ein Rettungsgriff im Wasser', 'Ein Tragegriff', 'Ein Befreiungsgriff'], correct: 0 },
    // Frage 107: Esmarch'scher Griff - Wozu dient er
    { q: 'Wozu dient der Esmarch\'sche Griff?', a: ['Freimachen der Atemwege durch Überstrecken des Kopfes', 'Zum Transport von Opfern', 'Zum Befreien aus Umklammerung', 'Zum Messen des Pulses'], correct: 0 },
    // Frage 108: Esmarch'scher Griff - Technik beschreiben
    { q: 'Wie führt man den Esmarch\'schen Griff aus?', a: ['Hand an Stirn, Kopf überstrecken, mit zwei Fingern Kinn anheben', 'Kopf nach vorne beugen', 'Kopf zur Seite drehen', 'Mund zuhalten'], correct: 0 },
    // Frage 109: Mund-zu-Mund-Beatmung Technik
    { q: 'Wie führt man die Mund-zu-Mund-Beatmung durch?', a: ['Kopf überstrecken, Nase zuhalten, in den Mund beatmen, Brustkorb beobachten', 'Einfach in den Mund pusten ohne Kopfüberstrecken', 'Mund zuhalten und durch die Nase beatmen', 'Kopf nach vorne beugen und über Nase beatmen'], correct: 0 },
    // Frage 110: Mund-zu-Nase-Beatmung Technik
    { q: 'Wie führt man die Mund-zu-Nase-Beatmung durch?', a: ['Kopf überstrecken, Mund zuhalten, durch die Nase beatmen', 'Nase zuhalten und über den Mund beatmen', 'Wie Mund-zu-Mund – Nase oder Mund spielt keine Rolle', 'Ohne Kopfüberstreckung – Hals gerade lassen'], correct: 0 },
    // Frage 111: Vor- und Nachteile Atemspende
    { q: 'Was ist ein Vorteil der Mund-zu-Nase-Beatmung?', a: ['Mund des Opfers muss nicht geöffnet werden', 'Mehr Luft möglich durch größere Öffnung', 'Einfacher auszuführen als Mund-zu-Mund', 'Hygienischer wegen weniger Kontakt'], correct: 0 },
    // Frage 112: Typische Fehler bei Atemspende
    { q: 'Was ist ein typischer Fehler bei der Atemspende?', a: ['Kopf nicht ausreichend überstreckt, Atemwege nicht frei', 'Zu langsam beatmen – zu wenig Atemzüge pro Minute', 'Zu viel Luft auf einmal – Magen bläht sich auf', 'Zu kurze Beatmungszeit pro Atemzug'], correct: 0 },
    // Frage 113: Beatmungsfrequenz und -volumen Erwachsene
    { q: 'Wie hoch sind Beatmungsfrequenz und -volumen beim Erwachsenen?', a: ['Ca. 10-12 Beatmungen/min, ca. 500-600 ml Volumen', '5 Beatmungen/min, 200 ml – langsamer und weniger für eine schonendere Beatmung', '30 Beatmungen/min, 1000 ml – höhere Frequenz und größeres Volumen gewährleisten bessere Sauerstoffversorgung', '2 Beatmungen/min, 100 ml – minimale Beatmung reicht bei Herzstillstand aus'], correct: 0 },
    // Frage 114: Beatmungsfrequenz und -volumen 5-jähriges Kind
    { q: 'Wie hoch sind Beatmungsfrequenz und -volumen beim 5-jährigen Kind?', a: ['Ca. 12-20 Beatmungen/min, kleineres Volumen als Erwachsene', 'Wie beim Erwachsenen – Alter spielt keine Rolle', 'Nur 5 Beatmungen/min – Kinder brauchen weniger', 'Doppelt so viel wie Erwachsene – Kinder brauchen mehr O2'], correct: 0 },
    // Frage 115: Beatmungsfrequenz und -volumen Säugling
    { q: 'Wie beatmet man einen Säugling?', a: ['Mund und Nase umschließen, kleine Atemzüge, 20-30/min', 'Wie beim Erwachsenen – Körpergröße spielt keine Rolle', 'Nur durch die Nase, Mund bleibt offen', 'Gar nicht beatmen – Säuglinge erholen sich von selbst'], correct: 0 },
    // Frage 116: Herzdruckmassage bei Reanimation
    { q: 'Wie führt man die Herzdruckmassage bei Erwachsenen durch?', a: ['Handballen auf Brustbeinmitte, 5-6 cm tief, 100-120/min', 'Auf den Bauch drücken – dort liegt das Herz', 'Nur 50 mal pro Minute – langsamer ist gründlicher', 'Mit einem Finger – zu viel Druck kann Rippen brechen'], correct: 0 },
    { q: 'Wo ist der Druckpunkt für die Herzdruckmassage beim Erwachsenen?', a: ['Mitte des Brustkorbs (untere Brustbeinhälfte)', 'Auf dem Bauch über dem Magen', 'Am Hals über der Halsschlagader', 'Auf der Schulter über dem Schulterblatt'], correct: 0 },
    // Frage 116b: Herzdruckmassage Kleinkinder
    { q: 'Wie führt man die Herzdruckmassage bei Kleinkindern durch?', a: ['Ein Handballen, ca. 5 cm tief, auf untere Brustbeinhälfte', 'Wie beim Erwachsenen – Alter spielt keine Rolle', 'Gar nicht drücken – zu gefährlich bei Kindern', 'Mit beiden Fäusten – mehr Druck ist effektiver'], correct: 0 },
    // Frage 116c: Herzdruckmassage Säuglinge
    { q: 'Wie führt man die Herzdruckmassage bei Säuglingen durch?', a: ['Zwei Finger auf Brustbeinmitte, ca. 4 cm tief', 'Mit der ganzen Hand – mehr Fläche ist stabiler', 'Auf den Bauch drücken – der Magen ist robuster', 'Gar nicht drücken – Säuglinge sind zu zerbrechlich'], correct: 0 },
    // Frage 117: Fehler bei Herzdruckmassage
    { q: 'Was ist ein häufiger Fehler bei der Herzdruckmassage?', a: ['Zu geringe Drucktiefe oder falsche Druckpunktposition', 'Zu schnell drücken über 120 Kompressionen pro Minute', 'Zu tief drücken über 6 cm – Rippenfraktur möglich', 'Zu wenig Pausen zwischen Kompressions-Beatmungs-Zyklen'], correct: 0 },
    // Frage 118: Herzfrequenz pro Minute
    { q: 'Wie hoch ist die normale Herzfrequenz beim Erwachsenen?', a: ['60-100 Schläge pro Minute', '30-40 Schläge pro Minute', '150-200 Schläge pro Minute', '10-20 Schläge pro Minute'], correct: 0 },
    { q: 'Wie hoch ist die normale Herzfrequenz beim Kleinkind?', a: ['80-120 Schläge pro Minute', '60-80 Schläge pro Minute', '40-60 Schläge pro Minute', '150-200 Schläge pro Minute'], correct: 0 },
    { q: 'Wie hoch ist die normale Herzfrequenz beim Säugling?', a: ['100-140 Schläge pro Minute', '60-80 Schläge pro Minute', '40-60 Schläge pro Minute', '200-250 Schläge pro Minute'], correct: 0 },
    // Frage 119: Pulsmessung - Wo und wie lange
    { q: 'Wo misst man den Puls bei einer bewusstlosen Person?', a: ['An der Halsschlagader (Carotis)', 'Am Handgelenk – einfacher zu ertasten', 'Am Fuß an der Fußarterie', 'Am Ohr durch Druckpulsmessung'], correct: 0 },
    { q: 'Wo misst man den Puls bei einer ansprechbaren Person?', a: ['Am Handgelenk (Arteria radialis)', 'An der Halsschlagader – besser tastbar', 'Am Fuß an der Fußarterie', 'Am Knie an der Kniekehlenschlagader'], correct: 0 },
    // Frage 120: Pulsmessung beim Baby
    { q: 'Wo misst man den Puls beim Baby?', a: ['An der Oberarminnenseite (Arteria brachialis)', 'Am Hals – wie bei Erwachsenen', 'Am Handgelenk – gut ertastbar', 'Am Fuß – große Arterie beim Baby'], correct: 0 },
    // Frage 121: Diagnostischer Block bei HLW
    { q: 'Was ist der diagnostische Block bei der HLW?', a: ['Bewusstsein prüfen, Hilfe rufen, Atemwege freimachen, Atmung prüfen', 'Nur Atmung prüfen – alles andere ist sekundär', 'Sofort mit Herzdruckmassage beginnen ohne Diagnose', 'Nichts tun – auf den Rettungsdienst warten'], correct: 0 },
    // Frage 122: Korrekte Reanimation (HLW)
    { q: 'Wie ist das Verhältnis von Herzdruckmassage zu Beatmung bei Erwachsenen?', a: ['30:2 (30 Kompressionen, 2 Beatmungen)', '15:2 wie beim Kind – kein Unterschied', '5:1 – häufiger beatmen ist effektiver', '100:10 – mehr Kompressionen, mehr Beatmungen'], correct: 0 },
    // Frage 123: Wiederbelebung Kleinkinder
    { q: 'Was ist bei der Wiederbelebung von Kleinkindern zu beachten?', a: ['5 Initialbeatmungen, dann 15:2, angepasste Drucktiefe', 'Wie beim Erwachsenen – 30:2 ohne Initialbeatmungen', 'Keine Beatmung – nur Herzdruckmassage', 'Nur beatmen ohne Herzdruckmassage'], correct: 0 },
    // Frage 124: Stabile Seitenlage
    { q: 'Wozu dient die stabile Seitenlage?', a: ['Freihaltung der Atemwege bei Bewusstlosen mit Atmung', 'Zur Durchführung der Herzdruckmassage', 'Zum einfacheren Transport ins Krankenhaus', 'Bei Herzinfarkt zur Herzentlastung'], correct: 0 },
    { q: 'Wie bringt man jemanden in die stabile Seitenlage?', a: ['Arm anwinkeln, gegenüberliegendes Bein anwinkeln, zur Seite drehen, Kopf überstrecken', 'Einfach auf die Seite legen ohne weitere Maßnahmen', 'Auf den Bauch drehen für bessere Atemwege', 'Sitzen lassen und Oberkörper stützen'], correct: 0 },
    // Frage 125: Lagerung während Reanimation
    { q: 'Wie muss eine Person während der Reanimation gelagert werden?', a: ['Flach auf dem Rücken auf harter Unterlage', 'In stabiler Seitenlage für die Atemwege', 'Sitzend mit angewinkelten Beinen', 'Auf dem Bauch für bessere Druckwirkung'], correct: 0 },
    // Frage 126: Lagerung zu reanimierendes Opfer
    { q: 'Worauf muss bei der Lagerung eines zu reanimierenden Opfers geachtet werden?', a: ['Harte Unterlage, flache Rückenlage, Kopf in Neutralposition', 'Weiche Unterlage – federt die Kompressionen ab', 'Kopf erhöht – verbessert die Hirndurchblutung', 'Seitenlage – freiere Atemwege'], correct: 0 },
    // Frage 127: Verletzungen im Unfallbuch
    { q: 'Warum sollten Verletzungen im Unfallbuch festgehalten werden?', a: ['Dokumentation für Versicherung und Berufsgenossenschaft', 'Nur zur Unterhaltung der Belegschaft', 'Ist nicht nötig – der Verletzte erinnert sich selbst', 'Nur bei schweren Verletzungen mit Krankenhausaufenthalt'], correct: 0 },
    // Frage 128: Eintragungen Unfallbuch
    { q: 'Was muss ins Unfallbuch eingetragen werden?', a: ['Datum, Zeit, Ort, Hergang, Verletzte Person, Maßnahmen, Zeugen', 'Nur der Name des Verletzten', 'Nur das Datum und die Uhrzeit', 'Nichts – mündliche Meldung reicht aus'], correct: 0 },
    // Frage 129: Lagerung Person mit Atemnot/Asthma
    { q: 'Wie lagert man eine Person mit Atemnot oder Asthma?', a: ['Oberkörper erhöht, sitzend oder mit Kutschersitz', 'Flach auf dem Rücken – Lunge hat mehr Platz', 'Kopfüber – Atemhilfsmuskulatur unterstützen', 'Auf dem Bauch – drückt den Zwerchfellkrampf weg'], correct: 0 },
    // Frage 130: Lagerung Person mit Herzinfarkt-Verdacht
    { q: 'Wie lagert man eine Person mit Herzinfarkt-Verdacht?', a: ['Oberkörper erhöht (30-45°) zur Herzentlastung', 'Flach auf dem Rücken – Standardlagerung bei Bewusstlosigkeit', 'Kopfüber – Blut fließt zum Herzen', 'Schocklage mit Beinen hoch'], correct: 0 },
    // Frage 131: Sichere Anzeichen einer Fraktur
    { q: 'Was sind sichere Anzeichen einer Fraktur?', a: ['Fehlstellung, abnorme Beweglichkeit, Knochenreiben, offene Wunde mit Knochen', 'Nur Schmerzen – alle anderen Symptome sind unsicher', 'Nur Schwellung und Bluterguss', 'Nur Bluterguss – andere Symptome kommen selten vor'], correct: 0 },
    // Frage 132: Maßnahmen Ersthelfer bei offener Fraktur
    { q: 'Was macht der Ersthelfer bei einer offenen Fraktur?', a: ['Wunde steril abdecken, Extremität ruhigstellen, Notruf', 'Knochen manuell einrenken – verkürzt die Heilungszeit', 'Extremität stark bewegen – um Schwellung zu verhindern', 'Ignorieren – offene Frakturen heilen von selbst'], correct: 0 },
    // Frage 133: PECH-Regel bei Sportverletzungen
    { q: 'Wofür steht die PECH-Regel?', a: ['Pause, Eis, Compression, Hochlagern', 'Pflaster, Essen, Creme, Hinlegen', 'Pressen, Entlasten, Cremen, Hochlegen', 'Pause, Essen, Cola, Hinlegen'], correct: 0 },
    // Frage 134: Symptome Schockzustand
    { q: 'An welchen Symptomen erkennt man einen Schockzustand?', a: ['Blässe, kalter Schweiß, schneller flacher Puls, Unruhe, Bewusstseinstrübung', 'Rotes Gesicht und warme Haut', 'Langsamer kräftiger Puls und Schläfrigkeit', 'Hunger und Unterzuckerungsgefühl'], correct: 0 },
    // Frage 135: Schocklage beschreiben
    { q: 'Wie sieht die Schocklage aus?', a: ['Flache Rückenlage, Beine ca. 30° erhöht', 'Oberkörper erhöht wie beim Herzinfarkt', 'Auf dem Bauch mit Kopf zur Seite', 'Sitzend mit gespreizten Beinen'], correct: 0 },
    // Frage 136: Definition Schock
    { q: 'Was versteht man unter Schock?', a: ['Lebensbedrohliches Kreislaufversagen mit Minderdurchblutung der Organe', 'Nur psychisches Erschrecken nach einem Erlebnis', 'Müdigkeit und allgemeine Erschöpfung', 'Hunger und Hypoglykämie'], correct: 0 },
    // Frage 137: Lagerung bewusstloser Schockpatient
    { q: 'Wie lagert man einen bewusstlosen Schockpatienten?', a: ['Stabile Seitenlage (Atmung hat Vorrang!)', 'Schocklage mit Beinen hoch – mehr Blut zum Herzen', 'Sitzend – bewusster Patient sitzt sicherer', 'Auf dem Bauch – Zunge fällt nicht zurück'], correct: 0 },
    // Frage 138: Lagerung Schockpatient mit Bewusstsein
    { q: 'Wie lagert man einen Schockpatienten mit Bewusstsein?', a: ['Schocklage: flach auf Rücken, Beine hoch', 'Sitzend – angenehmer für den Patienten', 'Auf dem Bauch – freiere Atmung', 'Stabile Seitenlage – wie bei Bewusstlosigkeit'], correct: 0 },
    // Frage 139: Lagerungsart nach Zustand
    { q: 'Welche Lagerung bei bewusstloser Person mit Atmung?', a: ['Stabile Seitenlage', 'Schocklage', 'Flach auf dem Rücken', 'Sitzend'], correct: 0 },
    { q: 'Welche Lagerung bei Volumenmangelschock?', a: ['Schocklage (Beine hoch)', 'Oberkörper hoch', 'Stabile Seitenlage', 'Sitzend'], correct: 0 },
    { q: 'Welche Lagerung bei Sonnenstich?', a: ['Oberkörper erhöht, Kopf kühlen, Schatten', 'Schocklage mit Beinen hoch', 'Flach in der Sonne – Wärme hilft', 'Beine hoch – wie beim Volumenmangel'], correct: 0 },
    { q: 'Welche Lagerung bei Herzinfarkt-Verdacht?', a: ['Oberkörper erhöht zur Herzentlastung', 'Schocklage mit Beinen hoch', 'Flach auf dem Bauch – reduziert Schmerzen', 'Kopfüber – verbessert Herzauswurf'], correct: 0 },
    // Frage 140: Definition Herzinfarkt
    { q: 'Was ist ein Herzinfarkt?', a: ['Verschluss eines Herzkranzgefäßes mit Absterben von Herzmuskelgewebe', 'Herzrasen durch Stress und körperliche Belastung', 'Zu langsamer Herzschlag (Bradykardie)', 'Herzgeräusch durch Klappeninsuffizienz'], correct: 0 },
    // Frage 141: Fallbeispiel Herzinfarkt im Wasser
    { q: 'Ein Mann erleidet beim Schwimmen einen Herzinfarkt und wird bewusstlos ohne Atmung geborgen. Was tun?', a: ['Sofort mit Wiederbelebung beginnen (30:2) und Notruf', 'Nur Notruf absetzen – Laien sollten nichts tun', 'Warten bis er aufwacht – er ist nur bewusstlos', 'Wasser aus der Lunge drücken bevor man beatmet'], correct: 0 },
    // Frage 142: Fallbeispiel Brustschmerzen nach Schwimmen
    { q: 'Ein Badegast klagt nach dem Schwimmen über Brustschmerzen und Ausstrahlung in den Arm. Was tun?', a: ['Herzinfarkt-Verdacht: Oberkörper hoch lagern, beruhigen, Notruf, enge Kleidung öffnen', 'Weiterschwimmen lassen – Bewegung hält das Blut flüssig', 'Kaltes Wasser trinken lassen – hilft gegen Krämpfe', 'Nichts tun – Brustschmerzen nach Sport sind normal'], correct: 0 },
    // Frage 143: Unterschied Herzinfarkt und Angina Pectoris
    { q: 'Was unterscheidet Herzinfarkt von Angina Pectoris?', a: ['Herzinfarkt: dauerhafter Verschluss, Gewebe stirbt; Angina: vorübergehende Minderdurchblutung', 'Kein Unterschied – beides ist dasselbe', 'Angina Pectoris ist immer tödlicher als ein Herzinfarkt', 'Herzinfarkt ist harmlos und heilt ohne Folgen aus'], correct: 0 },
    // Frage 144: Symptome Schädelhirntrauma
    { q: 'Welche Symptome deuten auf ein Schädelhirntrauma hin?', a: ['Bewusstseinsstörung, Übelkeit, Erbrechen, ungleiche Pupillen, Erinnerungslücken', 'Nur Kopfschmerzen – alle anderen Symptome sind keine SHT-Zeichen', 'Nur Müdigkeit und allgemeine Erschöpfung', 'Nur Hunger und leichte Übelkeit'], correct: 0 },
    // Frage 145: Ursache Blutaustritt Mund, Nase, Ohren
    { q: 'Was kann Blutaustritt aus Mund, Nase und Ohren bedeuten?', a: ['Schweres Schädelhirntrauma mit Schädelbasisbruch', 'Harmloser Schnupfen mit starker Schleimhautentzündung', 'Zahnfleischbluten durch Parodontose', 'Allergische Reaktion auf Chlor im Wasser'], correct: 0 },
    // Frage 146: Lagerung Patient mit akutem Bauch
    { q: 'Wie lagert man einen Patienten mit "Akutem Bauch"?', a: ['Rückenlage mit angezogenen Beinen (entlastet Bauchdecke)', 'Flach gestreckt – Bauchdecke entspannt sich', 'Auf dem Bauch – Druck entlastet Verdauungsorgane', 'Schocklage mit Beinen hoch'], correct: 0 },
    // Frage 147: Ursachen und Symptome Akuter Bauch
    { q: 'Was sind mögliche Ursachen für einen Akuten Bauch?', a: ['Blinddarmentzündung, Darmverschluss, innere Blutung, Gallenkolik', 'Nur Hunger nach langem Schwimmen', 'Nur einfache Verstopfung', 'Nur Durchfall nach falschem Essen'], correct: 0 },
    // Frage 148: Maßnahmen bei Akutem Bauch
    { q: 'Welche Maßnahmen ergreift man bei Akutem Bauch?', a: ['Nichts zu essen/trinken geben, Schonlagerung, Notruf', 'Essen geben – leerer Magen verschlimmert die Schmerzen', 'Viel trinken lassen – Flüssigkeit löst Krämpfe', 'Abwarten – Bauchschmerzen gehen von selbst weg'], correct: 0 },
    // Frage 149: Körpertemperaturregulierung
    { q: 'Wie reguliert der Körper die Temperatur?', a: ['Durch Schwitzen, Gefäßerweiterung/-verengung, Zittern', 'Gar nicht – Körpertemperatur ist immer konstant', 'Nur durch Kleidung und äußere Isolation', 'Nur durch Trinken von heißen oder kalten Getränken'], correct: 0 },
    // Frage 150: Hitzeerschöpfung Ursachen, Symptome, Maßnahmen
    { q: 'Was sind Symptome einer Hitzeerschöpfung?', a: ['Blässe, Schwäche, Übelkeit, Schwitzen, niedriger Blutdruck', 'Rotes heißes Gesicht ohne Schwitzen (wie beim Hitzschlag)', 'Kein Schwitzen und hohe Körpertemperatur', 'Hoher Blutdruck und verlangsamter Puls'], correct: 0 },
    { q: 'Was sind Maßnahmen bei Hitzeerschöpfung?', a: ['In den Schatten bringen, flach lagern, Beine hoch, trinken lassen', 'In die Sonne legen – Wärme fördert Erholung', 'Viel bewegen lassen – Kreislauf anregen', 'Warm einpacken – verhindert weiteren Wärmeverlust'], correct: 0 },
    // Frage 151: Thermische Verletzungen
    { q: 'Was sind thermische Verletzungen?', a: ['Verbrennungen, Verbrühungen, Erfrierungen', 'Nur Schnitte und Schnittwunden', 'Nur Prellungen und Quetschungen', 'Nur Knochenbrüche und Frakturen'], correct: 0 },
    { q: 'Woran erkennt man den Grad einer Verbrennung?', a: ['Grad I: Rötung; Grad II: Blasen; Grad III: weiß/schwarz, schmerzlos', 'Nur an der Größe der betroffenen Fläche', 'Nur an der Körperstelle – Gesicht immer schlimmer', 'Gar nicht – Verbrennungsgrade sind rein medizinisch'], correct: 0 },
    // Frage 152: Sofortmaßnahmen bei verschiedenen Notfällen
    { q: 'Was ist die Sofortmaßnahme bei Stromunfall?', a: ['Stromkreis unterbrechen (Sicherung!), dann Erste Hilfe', 'Sofort die Person berühren und wegziehen', 'Mit Wasser löschen – Wasser leitet Strom ab', 'Abwarten – Strom unterbricht sich selbst'], correct: 0 },
    { q: 'Was ist die Sofortmaßnahme bei Verbrennung?', a: ['Kühlen mit lauwarmem Wasser (10-20 min), steril abdecken', 'Eis direkt auf die Wunde – kühlt schneller', 'Brandsalbe auftragen – hilft gegen Schmerzen', 'Blasen aufstechen – verhindert Infektion'], correct: 0 },
    { q: 'Was ist die Sofortmaßnahme bei Verätzung?', a: ['Mit viel Wasser spülen, Notruf', 'Nichts tun – neutralisiert sich selbst', 'Salbe auftragen für Schmerzlinderung', 'Kräftig reiben um Mittel zu entfernen'], correct: 0 },
    // Frage 153: Hitzschlag Ursachen, Symptome, Maßnahmen
    { q: 'Was sind Symptome eines Hitzschlags?', a: ['Hochrotes heißes Gesicht, KEIN Schwitzen, hohe Körpertemperatur, Bewusstseinsstörung', 'Blässe und Schwitzen wie bei der Hitzeerschöpfung', 'Kalte feuchte Haut mit niedrigem Blutdruck', 'Niedriger Puls und normale Körpertemperatur'], correct: 0 },
    { q: 'Was sind Maßnahmen bei Hitzschlag?', a: ['Sofort kühlen, Notruf 112, Schatten, Kleidung öffnen', 'Warm einpacken – verhindert weiteren Wärmeverlust', 'Viel bewegen – fördert die Wärmeabgabe', 'In die Sonne legen – Wärme soll ausgeglichen werden'], correct: 0 },
    // Frage 154: Sonnenstich Ursachen, Symptome, Maßnahmen
    { q: 'Was sind Symptome eines Sonnenstichs?', a: ['Kopfschmerzen, Übelkeit, steifer Nacken, roter heißer Kopf, Körper kühl', 'Kalter Kopf und heißer Körper – wie beim Hitzschlag', 'Kein Kopfschmerz, nur Schwindel und Blässe', 'Heißer Körper mit starkem Schwitzen'], correct: 0 },
    { q: 'Was sind Maßnahmen bei Sonnenstich?', a: ['Schatten, Kopf und Nacken kühlen, Oberkörper erhöht lagern', 'In die Sonne legen – Wärme stimuliert Erholung', 'Flach lagern mit Beinen hoch wie bei Schocklage', 'Viel bewegen – Kreislauf anregen'], correct: 0 },
    // Frage 155: Aufgabe Ozonschicht
    { q: 'Welche Aufgabe hat die Ozonschicht der Erde?', a: ['Filtert schädliche UV-Strahlung der Sonne', 'Erzeugt Sauerstoff durch Photosynthese', 'Wärmt die Erde durch den Treibhauseffekt', 'Produziert Regen und Niederschlag'], correct: 0 },
    // Frage 156: Vorbeugende Maßnahmen Sonnenschutz
    { q: 'Welche vorbeugenden Maßnahmen schützen vor Sonnenschäden?', a: ['Sonnencreme, Kopfbedeckung, Schatten, Mittagssonne meiden', 'Nichts tun – Sonne ist immer gesund', 'Viel in die Sonne gehen – fördert Vitamin D', 'Ohne Schutz sonnen – Haut gewöhnt sich'], correct: 0 },
    // Frage 157: Fallbeispiel Sonnenstich
    { q: 'Ein Badegast liegt bewusstlos in der Sonne, sein Gesicht ist hochrot und heiß. Was tun?', a: ['Schatten, Oberkörper hoch, Kopf kühlen, Notruf, bei Atemstillstand HLW', 'Liegen lassen – Körper regelt das selbst', 'Kaltes Eiswasser direkt über den Körper gießen', 'Aufstehen lassen und weggehen lassen'], correct: 0 }
];
