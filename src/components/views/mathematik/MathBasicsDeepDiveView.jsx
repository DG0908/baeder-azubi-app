import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { PRACTICE_SETS } from './MathPracticeSets';

const makeTopic = (chip, title, intro, motto, formula, steps, exampleRows, pitfalls, quiz, sheetSections) => ({
  chip, title, intro, motto, formula, steps, exampleRows, pitfalls, quiz, sheetSections
});

const TOPICS = {
  grundrechenarten: makeTopic('Start', 'Grundrechenarten sicher anwenden', 'Plus, Minus, Mal und Geteilt — das brauchst du für alles andere. Stell dir vor, du zählst Badegäste oder rechnest Eintrittsgelder zusammen.', 'Klammern zuerst, dann Punkt vor Strich.', ['Plus (+) und Minus (-) kommen immer zuletzt dran', 'Mal (×) und Geteilt (÷) werden ZUERST gerechnet — das ist die „Punkt vor Strich"-Regel', 'Steht was in Klammern? Dann wird das ALLERERST gerechnet!'], [['1. Aufgabe lesen', 'Schau genau hin: Welche Rechenzeichen siehst du?'], ['2. Klammern zuerst', 'Alles was in Klammern steht, rechnest du als erstes aus.'], ['3. Punkt vor Strich', 'Jetzt alle Mal- und Geteilt-Aufgaben lösen.'], ['4. Zum Schluss Plus und Minus', 'Erst jetzt addierst oder subtrahierst du.']], [['Aufgabe', '18 + 6 × 3'], ['Punkt vor Strich', 'Erst 6 × 3 = 18'], ['Dann Plus', '18 + 18 = 36'], ['Ergebnis', '36']], ['NICHT einfach von links nach rechts rechnen — erst Punkt, dann Strich!', 'Klammern nie übersehen — die gehen VOR allem anderen.', 'Schreib bei Textaufgaben die Einheit dazu (€, Personen, Liter).'], { question: 'Was ist 40 - 8 ÷ 2?', options: ['16', '36', '20'], correctIndex: 1, explanation: 'Erst Punkt (8 ÷ 2 = 4), dann Strich (40 - 4 = 36).' }),

  brueche: makeTopic('Basis', 'Brüche verstehen und rechnen', 'Stell dir eine Pizza vor: Wenn du sie in 4 Stücke teilst und 3 davon isst, hast du 3/4 gegessen. Der Bruch sagt dir: Wie viele Teile von wie vielen insgesamt.', 'Die untere Zahl (Nenner) sagt, in wie viele Teile geteilt wird. Die obere (Zähler) sagt, wie viele du davon hast.', ['Oben steht der Zähler = die Anzahl der Teile die du hast', 'Unten steht der Nenner = in wie viele Stücke das Ganze geteilt ist', 'Zum Addieren müssen die Nenner (unten) gleich sein!'], [['1. Was bedeutet der Bruch?', 'Oben = deine Teile, unten = alle Teile. Beispiel: 3/4 = 3 von 4 Stücken.'], ['2. Gleiche Nenner machen', 'Bei 1/2 + 1/4 musst du 1/2 in Viertel umwandeln: 1/2 = 2/4.'], ['3. Jetzt nur oben rechnen', 'Die Nenner bleiben gleich! 2/4 + 1/4 = 3/4.'], ['4. Ergebnis kürzen', 'Wenn du oben und unten durch dieselbe Zahl teilen kannst, mach das.']], [['Aufgabe', '1/2 + 1/4'], ['Gleichnamig machen', '1/2 = 2/4 (mal 2 oben und unten)'], ['Addieren', '2/4 + 1/4 = 3/4'], ['Ergebnis', '3/4']], ['NICHT oben und unten getrennt zusammenzählen — das gibt Quatsch!', 'Erst die Nenner gleich machen, DANN rechnen.', 'Tipp: Kürzen macht den Bruch einfacher, ändert aber nicht den Wert.'], { question: 'Was ist 3/4 + 1/4?', options: ['1', '4/8', '3/8'], correctIndex: 0, explanation: '3/4 + 1/4 = 4/4 — und 4 von 4 Teilen ist genau 1 Ganzes.' }),

  dreisatz: makeTopic('Grundlage', 'Dreisatz — der Alleskönner', 'Der Dreisatz ist wie ein Taschenrechner-Trick: Wenn du weißt, was EINE Sache kostet oder dauert, kannst du alles andere ausrechnen. Beispiel: Wenn 3 Chlortabletten 6 € kosten, was kosten dann 5?', 'Immer erst auf 1 runterrechnen, dann auf die Zielzahl hoch.', ['Schritt 1: Was du weißt aufschreiben (z.B. 3 Stück = 6 €)', 'Schritt 2: Auf 1 Stück runterrechnen (6 ÷ 3 = 2 € pro Stück)', 'Schritt 3: Auf die gewünschte Menge hochrechnen (2 × 5 = 10 €)'], [['1. Was weißt du?', 'Schreib auf, was zusammengehört. Z.B.: In 4 Stunden laufen 120 m³ Wasser durch.'], ['2. Auf 1 runterrechnen', 'Teile durch die bekannte Menge: 120 ÷ 4 = 30 m³ pro Stunde.'], ['3. Auf den Zielwert rechnen', 'Mal nehmen mit dem, was du wissen willst: 30 × 7 = 210 m³.'], ['4. Einheit nicht vergessen!', 'Schreib immer dazu, was das Ergebnis bedeutet: 210 m³.']], [['Was wir wissen', '4 Stunden → 120 m³ Wasser'], ['Auf 1 Stunde', '120 ÷ 4 = 30 m³'], ['Auf 7 Stunden', '30 × 7 = 210 m³'], ['Ergebnis', '210 m³']], ['Immer erst auf 1 rechnen — nie direkt von 4 auf 7 springen!', 'Überlege vorher: Muss das Ergebnis größer oder kleiner werden?', 'Einheiten immer mitschreiben, sonst weißt du nachher nicht, was die Zahl bedeutet.'], { question: '6 kg Chlorgranulat reichen für 3 Tage. Wie viel braucht man für 5 Tage?', options: ['8 kg', '10 kg', '12 kg'], correctIndex: 1, explanation: '6 ÷ 3 = 2 kg pro Tag. 2 × 5 = 10 kg.' }),

  prozent: makeTopic('Prüfung', 'Prozentrechnung — Anteile berechnen', 'Prozent heißt wörtlich „von Hundert". 15 % bedeutet: 15 von 100. Wenn 100 Badegäste kommen und 15 % Kinder sind, dann sind das 15 Kinder. Bei 200 Gästen wären es 30 Kinder.', 'Prozentzahl durch 100 teilen, dann mal den Grundwert.', ['15 % bedeutet: 15 von 100 — als Dezimalzahl ist das 0,15', '50 % = die Hälfte, 25 % = ein Viertel, 10 % = ein Zehntel', 'Formel: Anteil = Grundwert × (Prozent ÷ 100)'], [['1. Was ist der Grundwert?', 'Das ist die gesamte Menge — z.B. 800 Badegäste.'], ['2. Prozent in Dezimalzahl', 'Teile die Prozentzahl durch 100. Also: 15 % = 0,15.'], ['3. Mal nehmen', '800 × 0,15 = 120.'], ['4. Macht das Sinn?', '15 % ist weniger als ein Fünftel — 120 von 800 passt!']], [['Grundwert', '800 Badegäste'], ['Prozent umwandeln', '15 % = 15 ÷ 100 = 0,15'], ['Rechnung', '800 × 0,15 = 120'], ['Ergebnis', '120 Badegäste']], ['15 % sind NICHT 15! Immer erst durch 100 teilen.', 'Check: 50 % von 800 wäre 400 — liegt 120 drunter? Ja, passt also.', 'Lies genau, was gesucht ist: Der Anteil? Der Grundwert? Der Prozentsatz?'], { question: 'Von 250 Schülern gehen 40 % ins Hallenbad. Wie viele sind das?', options: ['100', '75', '125'], correctIndex: 0, explanation: '40 % = 0,4. Dann: 250 × 0,4 = 100 Schüler.' }),

  formeln: makeTopic('Umstellen', 'Formeln umstellen — kein Hexenwerk', 'In Formeln stehen Buchstaben statt Zahlen. v = s ÷ t heißt: Geschwindigkeit = Strecke geteilt durch Zeit. Wenn du die Strecke wissen willst, musst du die Formel „umbauen".', 'Was du suchst, muss alleine auf einer Seite stehen.', ['Stell dir eine Waage vor: Was du auf der einen Seite machst, musst du auch auf der anderen machen', 'Willst du etwas „rüberbringen"? Dann machst du die Gegenrechnung (÷ wird zu ×, + wird zu -)'], [['1. Was suchst du?', 'Markiere den Buchstaben, den du berechnen willst. Z.B. s in v = s ÷ t.'], ['2. Was stört?', 's wird durch t geteilt — das t muss weg.'], ['3. Gegenrechnung', 'Aus Teilen wird Malnehmen: Beide Seiten × t → s = v × t.'], ['4. Jetzt Zahlen einsetzen', 'Erst umstellen, dann rechnen: v=2, t=30 → s = 2 × 30 = 60 m.']], [['Formel', 'v = s ÷ t (Geschwindigkeit = Strecke durch Zeit)'], ['Gesucht', 's (die Strecke)'], ['Umgestellt', 's = v × t (beide Seiten mal t)'], ['Beispiel', '2 m/s × 30 s = 60 m']], ['Verwechsle nicht die Buchstaben (v, s, t) mit den Einheiten (m/s, m, s).', 'ERST die Formel umstellen, DANN die Zahlen einsetzen!', 'Immer beide Seiten gleich behandeln — wie bei einer Waage.'], { question: 'Wie stellst du v = s ÷ t nach s um?', options: ['s = v × t', 's = v ÷ t', 's = t ÷ v'], correctIndex: 0, explanation: 'Beide Seiten mal t → s = v × t. Das ÷ t wird rückgängig gemacht.' }),

  pythagoras: makeTopic('Geometrie', 'Satz des Pythagoras', 'Wenn ein Dreieck einen rechten Winkel hat (90°), dann gilt eine magische Regel: Die beiden kurzen Seiten zum Quadrat ergeben zusammen das Quadrat der langen Seite. Im Bad z.B. für Schrägen an Beckenrändern.', 'a² + b² = c² (kurz mal kurz + kurz mal kurz = lang mal lang)', ['a und b sind die kurzen Seiten (Katheten)', 'c ist IMMER die längste Seite (Hypotenuse) — die gegenüber vom rechten Winkel', 'a × a + b × b = c × c, dann Wurzel ziehen für c'], [['1. Rechter Winkel?', 'Prüfe: Hat das Dreieck einen 90°-Winkel? Nur dann funktioniert die Formel!'], ['2. Seiten einsetzen', 'Die zwei kurzen Seiten quadrieren: z.B. 3 × 3 = 9 und 4 × 4 = 16.'], ['3. Addieren', '9 + 16 = 25.'], ['4. Wurzel ziehen', 'Welche Zahl mal sich selbst ergibt 25? → 5! Also c = 5 m.']], [['Gegeben', 'a = 3 m, b = 4 m'], ['Quadrate', '3 × 3 = 9, und 4 × 4 = 16'], ['Summe', '9 + 16 = 25'], ['Ergebnis', 'c = √25 = 5 m']], ['c ist IMMER die längste Seite — die gegenüber vom rechten Winkel.', 'Am Ende die Wurzel nicht vergessen!', 'Funktioniert NUR bei Dreiecken mit rechtem Winkel (90°).'], { question: 'Wie groß ist c bei a = 6 m und b = 8 m?', options: ['10 m', '12 m', '14 m'], correctIndex: 0, explanation: '6² = 36, 8² = 64. 36 + 64 = 100. √100 = 10 m.' }),

  flaechen: makeTopic('Geometrie', 'Flächen berechnen', 'Eine Fläche ist wie ein Teppich — sie hat Länge und Breite, aber keine Tiefe. Im Bad brauchst du Flächen z.B. für Beckenoberflächen, Liegewiesen oder Filterplatten.', 'Fläche = Länge × Breite (beim Rechteck).', ['Rechteck: A = Länge × Breite', 'Dreieck: A = Grundseite × Höhe ÷ 2 (das halbe Rechteck)', 'Kreis: A = π × r × r (π ≈ 3,14, r = Radius = halber Durchmesser)'], [['1. Welche Form?', 'Rechteck, Dreieck oder Kreis? Die Form bestimmt die Formel.'], ['2. Maße sammeln', 'Miss Länge und Breite in der gleichen Einheit (alles in Meter!).'], ['3. In die Formel einsetzen', 'Beim Rechteck einfach mal nehmen: 12 × 4 = 48.'], ['4. Einheit beachten', 'Fläche wird in m² angegeben — das ist Quadratmeter.']], [['Form', 'Rechteck, 12 m lang, 4 m breit'], ['Formel', 'A = Länge × Breite'], ['Rechnung', '12 × 4 = 48'], ['Ergebnis', '48 m²']], ['m² ist NICHT das gleiche wie m — m² sind Quadratmeter (Fläche).', 'Beim Kreis: Radius ist der HALBE Durchmesser, nicht verwechseln!', 'Fläche (m²) ist NICHT Volumen (m³) — Volumen braucht noch die Tiefe.'], { question: 'Wie groß ist die Fläche eines Rechtecks mit 9 m und 5 m?', options: ['14 m²', '45 m²', '90 m²'], correctIndex: 1, explanation: '9 × 5 = 45 m².' }),

  volumen: makeTopic('Praxis', 'Beckenvolumen berechnen', 'Volumen heißt: Wie viel Wasser passt rein? Stell dir ein Schwimmbecken vor — du brauchst Länge, Breite und Tiefe. Das brauchst du z.B. für Chlor-Dosierung oder Umwälzzeiten.', 'Volumen = Länge × Breite × Tiefe', ['Erst die Grundfläche: Länge × Breite = Fläche in m²', 'Dann mit der Tiefe malnehmen = Volumen in m³', 'Wichtig: 1 m³ = 1.000 Liter!'], [['1. Länge und Breite messen', 'Z.B. 25 m lang und 10 m breit.'], ['2. Fläche berechnen', '25 × 10 = 250 m².'], ['3. Mit Tiefe malnehmen', '250 × 1,8 = 450 m³.'], ['4. In Liter umrechnen', '450 × 1.000 = 450.000 Liter.']], [['Fläche', '25 × 10 = 250 m²'], ['Mit Tiefe', '250 × 1,8 = 450 m³'], ['In Liter', '450 m³ = 450.000 Liter'], ['Ergebnis', '450 m³ bzw. 450.000 Liter']], ['Bei Becken mit unterschiedlicher Tiefe: Nimm die mittlere Tiefe (flach + tief) ÷ 2.', '1 m³ = 1.000 Liter — das brauchst du ständig!', 'Fläche (m²) ist noch kein Volumen (m³) — dafür brauchst du die Tiefe.'], { question: 'Ein Lehrschwimmbecken ist 12 m lang, 8 m breit und 1,25 m tief. Wie groß ist das Volumen?', options: ['96 m³', '120 m³', '76 m³'], correctIndex: 1, explanation: '12 × 8 = 96 m². Dann 96 × 1,25 = 120 m³.' }),

  zeit: makeTopic('Alltag', 'Zeit und Industriestunden', 'Normal rechnen wir mit Stunden und Minuten (1 Stunde = 60 Minuten). Aber auf Stundenzetteln steht oft die „Industriestunde" — da werden Minuten als Dezimalzahl geschrieben.', 'Minuten ÷ 60 = Dezimalstunden.', ['1 Stunde = 60 Minuten (nicht 100!)', '30 Minuten = 0,5 Stunden (die Hälfte)', '15 Minuten = 0,25 Stunden (ein Viertel)', '45 Minuten = 0,75 Stunden (drei Viertel)'], [['1. Stunden und Minuten trennen', 'Z.B. 3 Stunden und 45 Minuten.'], ['2. Minuten durch 60 teilen', '45 ÷ 60 = 0,75.'], ['3. Zusammenzählen', '3 + 0,75 = 3,75 Industriestunden.'], ['4. Für den Stundenzettel', '3,75 h schreibst du auf den Zettel.']], [['Gegeben', '3 Stunden 45 Minuten'], ['Minuten umrechnen', '45 ÷ 60 = 0,75'], ['Zusammenzählen', '3 + 0,75 = 3,75'], ['Ergebnis', '3,75 Industriestunden']], ['45 Minuten sind NICHT 0,45 h! Du musst durch 60 teilen, nicht durch 100.', 'Merke: 15 min = 0,25 h / 30 min = 0,50 h / 45 min = 0,75 h.', 'Auf dem Stundenzettel stehen Industriestunden — vergleiche nicht mit der Uhr.'], { question: 'Wie viele Industriestunden sind 2 Stunden 15 Minuten?', options: ['2,15 h', '2,25 h', '2,50 h'], correctIndex: 1, explanation: '15 ÷ 60 = 0,25. Also 2 + 0,25 = 2,25 h.' }),

  auftrieb: makeTopic('Physik', 'Auftrieb — warum Dinge schwimmen', 'Leg dich ins Wasser — du fühlst dich leichter. Das liegt am Auftrieb: Das Wasser drückt dich nach oben. Je mehr Wasser ein Gegenstand verdrängt (wegdrückt), desto stärker wird er nach oben gedrückt.', 'Einfache Regel: 1 Liter verdrängtes Wasser = ca. 1 kg Auftrieb.', ['Wenn du etwas ins Wasser tauchst, drückt es Wasser zur Seite', 'Die Menge an verdrängtem Wasser bestimmt die Auftriebskraft', 'Einfache Regel: 1 Liter Wasser ≈ 1 kg Auftrieb'], [['1. Wie viel Wasser wird verdrängt?', 'Stell dir vor: Wie viel Wasser wird zur Seite gedrückt, wenn du den Gegenstand eintauchst?'], ['2. Liter = Kilogramm (ungefähr)', '1 Liter Wasser wiegt ca. 1 kg. Verdrängt etwas 15 Liter, hat es ca. 15 kg Auftrieb.'], ['3. Vergleiche mit dem Eigengewicht', 'Wenn der Auftrieb größer ist als das Gewicht → der Gegenstand schwimmt!'], ['4. Praxis im Bad', 'Rettungsringe und Schwimmhilfen funktionieren genau so.']], [['Gegenstand verdrängt', '15 Liter Wasser'], ['Faustregel', '15 Liter ≈ 15 kg Auftrieb'], ['Bedeutung', 'Der Gegenstand fühlt sich 15 kg leichter an'], ['Praxis', 'Deshalb helfen Schwimmflügel beim Schweben']], ['Auftrieb ≠ Eigengewicht — der Auftrieb ist die Kraft vom Wasser nach oben.', 'Schwere Dinge können schwimmen, wenn sie genug Wasser verdrängen (z.B. Schiffe).', 'Ein Stein verdrängt wenig Wasser für sein Gewicht → er sinkt.'], { question: 'Wie viel Auftrieb liefert ungefähr ein Körper, der 8 Liter Wasser verdrängt?', options: ['ca. 8 kg', 'ca. 80 kg', 'ca. 0,8 kg'], correctIndex: 0, explanation: '1 Liter Wasser ≈ 1 kg Auftrieb. 8 Liter = ca. 8 kg.' }),

  druck: makeTopic('Physik', 'Druck — warum es unten mehr drückt', 'Steh im flachen Wasser — kein Problem. Tauch 3 Meter tief und du spürst den Druck auf den Ohren. Das liegt daran, dass das Wasser über dir auf dich drückt. Je tiefer, desto mehr Wasser, desto mehr Druck.', 'Pro Meter Wassertiefe steigt der Druck um ca. 0,1 bar.', ['Druck = Kraft ÷ Fläche (gleiche Kraft auf kleinere Fläche = mehr Druck)', 'Im Wasser gilt die Faustregel: 1 Meter Tiefe ≈ 0,1 bar', 'Deshalb merkt man beim Tauchen den Druck auf den Ohren'], [['1. Was ist Druck?', 'Stell dir vor, du drückst mit dem Finger auf einen Tisch — das ist Kraft auf einer kleinen Fläche = hoher Druck.'], ['2. Im Wasser', 'Je tiefer du tauchst, desto mehr Wasser liegt über dir und drückt auf dich.'], ['3. Faustregel benutzen', '2 Meter tief? Dann ca. 2 × 0,1 = 0,2 bar zusätzlicher Druck.'], ['4. Einheiten', 'Druck wird in bar gemessen (wie beim Reifendruck).']], [['Wassertiefe', '2 Meter'], ['Faustregel', '0,1 bar pro Meter'], ['Rechnung', '2 × 0,1 = 0,2 bar'], ['Ergebnis', 'ca. 0,2 bar zusätzlicher Druck']], ['Der Druck steigt mit der Tiefe, NICHT mit der Beckenlänge oder -breite.', 'bar kennst du vom Reifendruck — im Wasser ist es dasselbe Maß.', '0,1 bar pro Meter ist eine Faustregel — für den Alltag reicht das.'], { question: 'Welcher zusätzliche Druck wirkt ungefähr bei 3 m Wassertiefe?', options: ['0,03 bar', '0,3 bar', '3 bar'], correctIndex: 1, explanation: '3 Meter × 0,1 bar pro Meter = ca. 0,3 bar.' }),

  bewegung: makeTopic('Physik', 'Geschwindigkeit berechnen', 'Wie schnell schwimmt jemand? Dafür brauchst du zwei Dinge: Wie weit (Strecke) und wie lange (Zeit). Daraus rechnest du die Geschwindigkeit aus.', 'Geschwindigkeit = Strecke ÷ Zeit', ['v = s ÷ t → Geschwindigkeit = Strecke geteilt durch Zeit', 's = v × t → Strecke = Geschwindigkeit mal Zeit', 't = s ÷ v → Zeit = Strecke geteilt durch Geschwindigkeit'], [['1. Was suchst du?', 'Die Geschwindigkeit (v), die Strecke (s) oder die Zeit (t)?'], ['2. Einheiten prüfen', 'Meter und Sekunden? Oder Kilometer und Stunden? Nicht mischen!'], ['3. Formel benutzen', 'Für Geschwindigkeit: Strecke ÷ Zeit. Z.B. 50 m ÷ 40 s = 1,25 m/s.'], ['4. Ergebnis mit Einheit', '1,25 m/s heißt: 1,25 Meter pro Sekunde.']], [['Gegeben', '50 Meter in 40 Sekunden'], ['Formel', 'v = s ÷ t'], ['Rechnung', '50 ÷ 40 = 1,25'], ['Ergebnis', '1,25 m/s (Meter pro Sekunde)']], ['km/h und m/s NICHT mischen — erst umrechnen!', 'Die Zeit muss zur Strecke passen (Sekunden zu Metern, Stunden zu Kilometern).', 'Tipp: m/s × 3,6 = km/h.'], { question: 'Wie schnell schwimmt jemand, der 100 m in 80 Sekunden schafft?', options: ['0,8 m/s', '1,25 m/s', '1,8 m/s'], correctIndex: 1, explanation: '100 ÷ 80 = 1,25 m/s.' }),

  waerme: makeTopic('Energie', 'Wärme berechnen — Wasser aufheizen', 'Wie viel Energie brauchst du, um ein Becken aufzuheizen? Das ist im Schwimmbad superwichtig. Dafür brauchst du: Wie viel Wasser (in m³) und wie warm soll es werden.', 'Energie in kWh = 1,16 × m³ × Temperaturdifferenz', ['Temperaturdifferenz = Zieltemperatur minus Starttemperatur', 'Beispiel: Von 24°C auf 28°C = 4 Grad Unterschied', 'Formel für Wasser: Q = 1,16 × Volumen in m³ × Temperaturdifferenz'], [['1. Temperaturen aufschreiben', 'Anfangstemperatur und Zieltemperatur. Z.B. 24°C → 28°C.'], ['2. Differenz berechnen', '28 - 24 = 4 Grad Unterschied.'], ['3. Formel benutzen', 'Q = 1,16 × 20 m³ × 4 = 92,8 kWh.'], ['4. Was bedeutet das?', 'Du brauchst 92,8 Kilowattstunden Energie zum Aufheizen.']], [['Gegeben', '20 m³ Wasser, von 23°C auf 28°C'], ['Temperaturdifferenz', '28 - 23 = 5 Grad'], ['Formel', 'Q = 1,16 × 20 × 5'], ['Ergebnis', '116 kWh Energie']], ['Temperaturdifferenz (Unterschied) ist NICHT die Temperatur selbst!', '1,16 ist eine feste Zahl speziell für Wasser — einfach merken.', 'kWh kennst du von der Stromrechnung — dieselbe Einheit.'], { question: 'Wie viel Energie brauchst du für 10 m³ Wasser bei 2 Grad Temperaturerhöhung?', options: ['11,6 kWh', '23,2 kWh', '116 kWh'], correctIndex: 1, explanation: '1,16 × 10 × 2 = 23,2 kWh.' }),

  mechanik: makeTopic('Technik', 'Kraft, Arbeit und Leistung', 'Du schiebst eine schwere Abdeckung über das Becken. Die Kraft zum Schieben, der Weg den du schiebst, und wie schnell du das machst — das sind Kraft, Arbeit und Leistung.', 'Kraft × Weg = Arbeit. Arbeit ÷ Zeit = Leistung.', ['Kraft (F) wird in Newton (N) gemessen — wie stark du drückst/ziehst', 'Arbeit (W) = Kraft × Weg — in Joule (J)', 'Leistung (P) = Arbeit ÷ Zeit — in Watt (W)'], [['1. Um was geht es?', 'Kraft (wie stark?), Arbeit (wie viel insgesamt?) oder Leistung (wie schnell?).'], ['2. Kraft × Weg = Arbeit', 'Du schiebst mit 200 N über 4 Meter: 200 × 4 = 800 Joule Arbeit.'], ['3. Arbeit ÷ Zeit = Leistung', '800 J in 10 Sekunden: 800 ÷ 10 = 80 Watt Leistung.'], ['4. Einheiten merken', 'Newton (N), Joule (J), Watt (W) — wie bei Elektrogeräten.']], [['Gegeben', '200 N Kraft, 4 Meter Weg'], ['Formel Arbeit', 'W = F × s'], ['Rechnung', '200 × 4 = 800 J'], ['Ergebnis', '800 Joule Arbeit']], ['Joule (Arbeit) und Watt (Leistung) NICHT verwechseln!', 'Leistung braucht immer eine Zeitangabe.', 'Watt kennst du von Glühbirnen — 60W Birne leistet 60 Joule pro Sekunde.'], { question: 'Wie groß ist die Leistung, wenn 6000 J Arbeit in 10 Sekunden geleistet werden?', options: ['60 W', '600 W', '6000 W'], correctIndex: 1, explanation: '6000 ÷ 10 = 600 Watt.' }),

  pumpen: makeTopic('Hydraulik', 'Pumpenberechnung', 'Pumpen bewegen das Wasser durch die Technik — Filter, Heizung, Desinfektion. Die wichtigste Frage: Wie viel Wasser schafft die Pumpe pro Stunde? Das ist der Förderstrom.', 'Förderstrom = Wassermenge ÷ Zeit', ['Förderstrom Q = wie viel Wasser pro Stunde (m³/h)', 'Q = Volumen ÷ Zeit → z.B. 120 m³ ÷ 4 h = 30 m³/h', 'Die Pumpe muss gegen die Höhe und den Widerstand der Rohre arbeiten'], [['1. Wie viel Wasser?', 'Z.B. das Becken hat 120 m³.'], ['2. In welcher Zeit?', 'Das Wasser soll in 4 Stunden einmal durchlaufen.'], ['3. Teilen', '120 ÷ 4 = 30 m³ pro Stunde.'], ['4. Das ist der Förderstrom', '30 m³/h — so viel muss die Pumpe schaffen.']], [['Gegeben', '120 m³ Wasser, 4 Stunden Umwälzzeit'], ['Formel', 'Q = V ÷ t'], ['Rechnung', '120 ÷ 4 = 30'], ['Ergebnis', '30 m³/h Förderstrom']], ['Förderstrom ist NICHT Leistung — m³/h ist nicht Watt.', 'Keine Pumpe ist perfekt — der Motor braucht immer etwas mehr Leistung als berechnet.', 'Achte auf die Einheit: m³/h (pro Stunde) oder m³/s (pro Sekunde)?'], { question: 'Wie groß ist der Förderstrom bei 180 m³ in 6 Stunden?', options: ['20 m³/h', '30 m³/h', '36 m³/h'], correctIndex: 1, explanation: '180 ÷ 6 = 30 m³/h.' }),

  filtration: makeTopic('Hydraulik', 'Filter berechnen', 'Das Beckenwasser läuft durch einen Filter, der den Schmutz rausholt. Dabei ist wichtig: Wie schnell fließt das Wasser durch den Filter? Zu schnell = schlechte Reinigung!', 'Filtergeschwindigkeit = Durchfluss ÷ Filterfläche', ['vF = Q ÷ A (Filtergeschwindigkeit = Durchfluss durch die Filterfläche)', 'Wenn du die Fläche suchst: A = Q ÷ vF', 'Bei runden Filtern: Fläche = π × r × r (r = Radius)'], [['1. Wie viel Wasser fließt durch?', 'Das ist der Durchfluss Q in m³/h — z.B. 90 m³/h.'], ['2. Wie schnell darf es sein?', 'Die erlaubte Filtergeschwindigkeit, z.B. 30 m/h.'], ['3. Fläche berechnen', '90 ÷ 30 = 3 m² Filterfläche braucht man.'], ['4. Ergebnis prüfen', 'Ist die Geschwindigkeit im erlaubten Bereich? Dann passt der Filter.']], [['Gegeben', '90 m³/h Durchfluss, max. 30 m/h Filtergeschwindigkeit'], ['Formel', 'A = Q ÷ vF'], ['Rechnung', '90 ÷ 30 = 3'], ['Ergebnis', '3 m² Filterfläche werden benötigt']], ['Q (Durchfluss, m³/h) und vF (Geschwindigkeit, m/h) nicht verwechseln!', 'Beim runden Filter: Durchmesser ÷ 2 = Radius, dann A = π × r × r.', 'm² (Fläche) und m/h (Geschwindigkeit) sind komplett verschiedene Dinge.'], { question: 'Welche Filterfläche brauchst du bei 60 m³/h und 20 m/h Filtergeschwindigkeit?', options: ['2 m²', '3 m²', '4 m²'], correctIndex: 1, explanation: '60 ÷ 20 = 3 m².' }),

  chlor: makeTopic('Chemie', 'Chlor-Dosierung berechnen', 'Chlor hält das Wasser sauber. Aber wie viel brauchst du? Die magische Umrechnung: 1 mg/L (Milligramm pro Liter) = 1 g pro m³ (Gramm pro Kubikmeter). Damit wird alles einfach!', '1 mg/L = 1 g pro m³', ['Zaubertrick: mg/L und g/m³ sind dasselbe! 0,3 mg/L = 0,3 g pro m³', 'Aktivchlor in Gramm = Anhebung in mg/L × Beckenvolumen in m³', 'Das Produkt hat nicht 100% Wirkstoff → deshalb mehr Produkt nötig!'], [['1. Wie groß ist das Becken?', 'Volumen in m³ — z.B. 450 m³.'], ['2. Wie viel Chlor willst du anheben?', 'Z.B. um 0,3 mg/L — das sind 0,3 g pro m³.'], ['3. Rechnen', '0,3 × 450 = 135 g Aktivchlor brauchst du.'], ['4. Produkt hat nicht 100%', 'Bei 65% Wirkstoff: 135 ÷ 0,65 = ca. 208 g Produkt abwiegen.']], [['Beckenvolumen', '450 m³'], ['Chlor-Anhebung', '0,3 mg/L = 0,3 g pro m³'], ['Aktivchlor', '0,3 × 450 = 135 g'], ['Bei 65% Produkt', '135 ÷ 0,65 ≈ 208 g abwiegen']], ['mg/L und g/m³ sind dasselbe — das ist der Trick! Einfach merken.', 'ERST Aktivchlor berechnen, DANN auf die Produktmenge umrechnen.', 'Diese Rechnung ersetzt NICHT die Betriebsanweisung — immer nach Vorschrift arbeiten!'], { question: 'Wie viel Aktivchlor brauchst du für 200 m³, wenn der Wert um 0,5 mg/L steigen soll?', options: ['50 g', '100 g', '500 g'], correctIndex: 1, explanation: '0,5 mg/L = 0,5 g/m³. Also 0,5 × 200 = 100 g Aktivchlor.' }),

  formelsammlung: makeTopic('Nachschlagen', 'Formelsammlung — alles auf einen Blick', 'Hier findest du die wichtigsten Formeln zum Nachschlagen. Nicht auswendig lernen — verstehen und nachschlagen!', 'Formel finden → Einheiten prüfen → rechnen.', ['Lies Formeln immer MIT den Einheiten', 'Setze nur gleiche Einheiten ein (nicht Minuten und Stunden mischen!)', 'Wenn du unsicher bist: Erst aufschreiben was du weißt, dann die passende Formel suchen'], [['1. Welches Thema?', 'Geometrie? Bewegung? Wärme? Chemie?'], ['2. Formel raussuchen', 'Hier unten im Sammelblatt nachschauen.'], ['3. Einheiten angleichen', 'Alles in m, s, kg — nicht durcheinander!'], ['4. Ergebnis kurz überschlagen', 'Kommt ungefähr das raus, was Sinn macht?']], [['1 m³', '= 1.000 Liter'], ['1 mg/L', '= 1 g pro m³'], ['1 m Wassertiefe', '≈ 0,1 bar Druck'], ['Wärme für Wasser', '1,16 kWh pro m³ und Grad']], ['Einheiten gehören IMMER zur Formel dazu.', 'Nicht jede Formel passt in jeder Situation — lies genau was gegeben ist.', 'Das Sammelblatt ist zum Nachschlagen — den Rechenweg musst du selbst machen.'], { question: 'Welche Formel passt zur Filtergeschwindigkeit?', options: ['vF = Q ÷ A', 'Q = p ÷ A', 'A = a + b'], correctIndex: 0, explanation: 'Filtergeschwindigkeit = Durchfluss Q geteilt durch die Filterfläche A.' }, [{ title: 'Grundlagen', lines: ['Punkt vor Strich', 'Brüche: erst Nenner gleich machen', 'Prozent: Grundwert × (% ÷ 100)'] }, { title: 'Geometrie', lines: ['Rechteck: A = a × b', 'Kreis: A = π × r × r', 'Volumen: V = L × B × T', 'Pythagoras: a² + b² = c²'] }, { title: 'Bewegung', lines: ['v = s ÷ t', 's = v × t', 't = s ÷ v', '1 h = 60 min'] }, { title: 'Hydraulik', lines: ['Förderstrom: Q = V ÷ t', 'Filtergeschw.: vF = Q ÷ A', 'Filterfläche: A = Q ÷ vF', 'Wasserdruck: ≈ 0,1 bar pro m'] }, { title: 'Wärme & Chemie', lines: ['Q = 1,16 × m³ × ΔT (in kWh)', '1 mg/L = 1 g/m³', 'Produkt = Aktivchlor ÷ Wirkstoff-%'] }])
};

const TOPIC_ORDER = ['grundrechenarten', 'brueche', 'dreisatz', 'prozent', 'formeln', 'pythagoras', 'flaechen', 'volumen', 'zeit', 'auftrieb', 'druck', 'bewegung', 'waerme', 'mechanik', 'pumpen', 'filtration', 'chlor', 'formelsammlung'];

const KNOWN_UNITS = ['m3/h', 'm/s2', 'm/s', 'kwh', 'bar', 'm2', 'm3', 'kg', 'eur', 'sek', 'min', 'std', 'h', 's', 'w', 'j', 'g', 'm'];

const normalizeAnswer = (value = '') => value
  .toLowerCase()
  .replace(/ca\.?/g, '')
  .replace(/,/g, '.')
  .replace(/\s+/g, '')
  .trim();

const stripKnownUnit = (value = '') => {
  let normalized = normalizeAnswer(value);

  KNOWN_UNITS.forEach((unit) => {
    if (normalized.endsWith(unit)) {
      normalized = normalized.slice(0, -unit.length);
    }
  });

  return normalized;
};

const answersMatch = (userValue, expectedValue) => {
  const normalizedUser = normalizeAnswer(userValue);
  const normalizedExpected = normalizeAnswer(expectedValue);

  if (!normalizedUser) {
    return false;
  }

  return (
    normalizedUser === normalizedExpected
    || stripKnownUnit(normalizedUser) === stripKnownUnit(normalizedExpected)
  );
};

function InfoCard({ darkMode, title, children }) {
  return (
    <div className={`rounded-2xl border p-4 ${darkMode ? 'bg-slate-900/75 border-slate-800' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{title}</h3>
      {children}
    </div>
  );
}

export default function MathBasicsDeepDiveView({ initialTopic = 'grundrechenarten' }) {
  const { darkMode } = useApp();
  const [activeTopicId, setActiveTopicId] = useState(TOPICS[initialTopic] ? initialTopic : 'grundrechenarten');
  const [revealedAnswer, setRevealedAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [practiceInputs, setPracticeInputs] = useState({});
  const [revealedExercises, setRevealedExercises] = useState({});

  const topic = TOPICS[activeTopicId] || TOPICS.grundrechenarten;
  const practiceSet = PRACTICE_SETS[activeTopicId] || [];
  const isCorrect = selectedAnswer === topic.quiz.correctIndex;

  const handleTopicChange = (topicId) => {
    setActiveTopicId(topicId);
    setRevealedAnswer(false);
    setSelectedAnswer(null);
  };

  const updatePracticeInput = (exerciseKey, value) => {
    setPracticeInputs((current) => ({
      ...current,
      [exerciseKey]: value
    }));
  };

  const revealExercise = (exerciseKey) => {
    setRevealedExercises((current) => ({
      ...current,
      [exerciseKey]: true
    }));
  };

  return (
    <div className="space-y-5">
      <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-cyan-50 via-white to-sky-50 border-cyan-100'}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${darkMode ? 'bg-cyan-500/15 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>
              <span>MATHEMATIK</span>
              <span>{topic.chip}</span>
            </div>
            <h2 className={`text-3xl font-bold mt-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{topic.title}</h2>
            <p className={`text-sm mt-3 leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{topic.intro}</p>
          </div>
          <div className={`rounded-2xl px-4 py-3 border ${darkMode ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/90 border-cyan-100 text-gray-700'}`}>
            <div className="text-xs uppercase tracking-wide opacity-70">Merksatz</div>
            <div className="text-sm font-semibold mt-1">{topic.motto}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {TOPIC_ORDER.map((topicId) => {
          const entry = TOPICS[topicId];
          const active = topicId === activeTopicId;
          return (
            <button
              key={topicId}
              type="button"
              onClick={() => handleTopicChange(topicId)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                active
                  ? darkMode
                    ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-900/20'
                    : 'border-cyan-300 bg-cyan-50 shadow-sm'
                  : darkMode
                    ? 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                    : 'border-gray-200 bg-white hover:border-cyan-200'
              }`}
            >
              <div className={`text-xs font-bold uppercase tracking-wide ${active ? (darkMode ? 'text-cyan-300' : 'text-cyan-700') : (darkMode ? 'text-slate-400' : 'text-gray-500')}`}>{entry.chip}</div>
              <div className={`text-base font-semibold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{entry.title}</div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <InfoCard darkMode={darkMode} title="Regeln auf einen Blick">
            <ul className={`space-y-2 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {topic.formula.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className={`mt-2 h-2 w-2 rounded-full ${darkMode ? 'bg-cyan-400' : 'bg-cyan-500'}`} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard darkMode={darkMode} title="Schritt fuer Schritt">
            <div className="grid gap-3 md:grid-cols-2">
              {topic.steps.map(([stepTitle, stepText]) => (
                <div key={stepTitle} className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-cyan-100 bg-cyan-50/60'}`}>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stepTitle}</div>
                  <p className={`text-sm mt-2 leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{stepText}</p>
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard darkMode={darkMode} title="Beispielrechnung">
            <div className="overflow-hidden rounded-2xl border border-transparent">
              <table className="min-w-full text-sm">
                <tbody>
                  {topic.exampleRows.map(([left, right]) => (
                    <tr key={`${left}-${right}`} className={`${darkMode ? 'border-slate-800' : 'border-gray-200'} border-b last:border-b-0`}>
                      <td className={`px-4 py-3 font-semibold ${darkMode ? 'bg-slate-950/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                        {left}
                      </td>
                      <td className={`px-4 py-3 ${darkMode ? 'bg-slate-900/40 text-slate-300' : 'bg-white text-gray-700'}`}>
                        {right}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InfoCard>
        </div>

        <div className="space-y-5">
          <InfoCard darkMode={darkMode} title="Typische Fehler">
            <ul className={`space-y-2 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {topic.pitfalls.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className={`mt-2 h-2 w-2 rounded-full ${darkMode ? 'bg-amber-400' : 'bg-amber-500'}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard darkMode={darkMode} title="Mini-Quiz">
            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {topic.quiz.question}
            </div>
            <div className="mt-4 space-y-2">
              {topic.quiz.options.map((option, index) => {
                const active = selectedAnswer === index;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      active
                        ? darkMode
                          ? 'border-cyan-400 bg-cyan-500/10 text-white'
                          : 'border-cyan-300 bg-cyan-50 text-gray-900'
                        : darkMode
                          ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-cyan-200'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setRevealedAnswer(true)}
              disabled={selectedAnswer === null}
              className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                selectedAnswer === null
                  ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                  : darkMode
                    ? 'bg-cyan-500 text-white hover:bg-cyan-400'
                    : 'bg-cyan-600 text-white hover:bg-cyan-500'
              }`}
            >
              Antwort pruefen
            </button>
            {revealedAnswer && (
              <div className={`mt-4 rounded-2xl border p-4 text-sm leading-7 ${
                isCorrect
                  ? darkMode
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : darkMode
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-100'
                    : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}>
                <div className="font-semibold">{isCorrect ? 'Richtig.' : 'Noch nicht ganz.'}</div>
                <div>{topic.quiz.explanation}</div>
              </div>
            )}
          </InfoCard>
        </div>
      </div>

      <InfoCard darkMode={darkMode} title="Beispielrechnung">
        <div className={`overflow-hidden rounded-2xl border ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className={`grid grid-cols-2 text-xs font-bold uppercase tracking-wide ${darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-gray-500'}`}>
            <div className="px-4 py-3">Schritt</div>
            <div className="px-4 py-3">Rechnung</div>
          </div>
          {topic.exampleRows.map(([label, value]) => (
            <div key={label} className={`grid grid-cols-2 border-t text-sm ${darkMode ? 'border-slate-800 bg-slate-900/40 text-slate-200' : 'border-gray-200 bg-white text-gray-700'}`}>
              <div className="px-4 py-3 font-semibold">{label}</div>
              <div className="px-4 py-3">{value}</div>
            </div>
          ))}
        </div>
      </InfoCard>

      {topic.sheetSections && (
        <InfoCard darkMode={darkMode} title="Formelsammelblatt">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {topic.sheetSections.map((section) => (
              <div key={section.title} className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/60' : 'border-cyan-100 bg-cyan-50/40'}`}>
                <div className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{section.title}</div>
                <div className="space-y-2">
                  {section.lines.map((line) => (
                    <div key={line} className={`rounded-xl px-3 py-2 text-sm ${darkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-gray-700'}`}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      <InfoCard darkMode={darkMode} title="5 Uebungsrechnungen">
        <div className="space-y-4">
          {practiceSet.map((exercise, index) => {
            const exerciseKey = `${activeTopicId}-${index}`;
            const userInput = practiceInputs[exerciseKey] || '';
            const isRevealed = Boolean(revealedExercises[exerciseKey]);
            const matches = answersMatch(userInput, exercise.answer);

            return (
              <div
                key={exerciseKey}
                className={`rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-950/60' : 'border-cyan-100 bg-cyan-50/40'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-wide ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      Aufgabe {index + 1}
                    </div>
                    <div className={`text-sm font-semibold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {exercise.prompt}
                    </div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${darkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-gray-600'}`}>
                    Erst rechnen, dann loesen
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(event) => updatePracticeInput(exerciseKey, event.target.value)}
                    placeholder="Dein Ergebnis eingeben"
                    className={`rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
                      darkMode
                        ? 'border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-cyan-400'
                        : 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-cyan-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => revealExercise(exerciseKey)}
                    disabled={!userInput.trim()}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      userInput.trim()
                        ? darkMode
                          ? 'bg-cyan-500 text-white hover:bg-cyan-400'
                          : 'bg-cyan-600 text-white hover:bg-cyan-500'
                        : 'cursor-not-allowed bg-gray-200 text-gray-400'
                    }`}
                  >
                    Loesung vergleichen
                  </button>
                </div>

                {isRevealed && (
                  <div className={`mt-4 rounded-2xl border p-4 ${
                    matches
                      ? darkMode
                        ? 'border-emerald-500/40 bg-emerald-500/10'
                        : 'border-emerald-200 bg-emerald-50'
                      : darkMode
                        ? 'border-amber-500/40 bg-amber-500/10'
                        : 'border-amber-200 bg-amber-50'
                  }`}>
                    <div className={`text-sm font-semibold ${matches ? (darkMode ? 'text-emerald-200' : 'text-emerald-800') : (darkMode ? 'text-amber-100' : 'text-amber-800')}`}>
                      {matches ? 'Das passt gut.' : 'Vergleiche dein Ergebnis mit dem Loesungsweg.'}
                    </div>
                    <div className={`mt-2 text-sm ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                      Dein Ergebnis: <span className="font-semibold">{userInput}</span>
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                      Soll-Ergebnis: <span className="font-semibold">{exercise.answer}</span>
                    </div>
                    <div className="mt-3">
                      <div className={`text-xs font-bold uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        Loesungsweg
                      </div>
                      <ol className={`mt-2 space-y-2 text-sm leading-6 ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                        {exercise.steps.map((step) => (
                          <li key={step} className="flex gap-2">
                            <span className={`mt-1 h-2 w-2 rounded-full ${darkMode ? 'bg-cyan-400' : 'bg-cyan-500'}`} />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </InfoCard>

    </div>
  );
}
