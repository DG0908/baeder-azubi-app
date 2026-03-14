import { useState } from 'react';
import { useApp } from '../../../context/AppContext';

const makeTopic = (chip, title, intro, motto, formula, steps, exampleRows, pitfalls, quiz, sheetSections) => ({
  chip, title, intro, motto, formula, steps, exampleRows, pitfalls, quiz, sheetSections
});

const TOPICS = {
  grundrechenarten: makeTopic('Start', 'Grundrechenarten sicher anwenden', 'Plus, Minus, Mal und Geteilt sind die Basis fuer fast alle spaeteren Rechnungen.', 'Klammern zuerst, dann Punkt vor Strich.', ['Addition und Subtraktion verbinden oder trennen Werte', 'Multiplikation und Division haben Vorrang vor Plus und Minus'], [['1. Aufgabe lesen', 'Pruefe, welche Rechenarten vorkommen.'], ['2. Klammern zuerst', 'Alles in Klammern wird zuerst geloest.'], ['3. Punkt vor Strich', 'Mal und Geteilt kommen vor Plus und Minus.'], ['4. Zwischenschritte aufschreiben', 'So bleibt der Weg nachvollziehbar.']], [['Aufgabe', '18 + 6 x 3'], ['Punkt vor Strich', '6 x 3 = 18'], ['Dann addieren', '18 + 18 = 36'], ['Ergebnis', '36']], ['Nicht alles stumpf von links nach rechts rechnen.', 'Klammern nie uebersehen.', 'Bei Sachaufgaben Einheiten mitschreiben.'], { question: 'Was ist 40 - 8 : 2 ?', options: ['16', '36', '20'], correctIndex: 1, explanation: 'Erst 8 : 2 = 4, danach 40 - 4 = 36.' }),
  brueche: makeTopic('Basis', 'Bruchrechnen Schritt fuer Schritt', 'Brueche helfen bei Anteilen, Teilmengen und Mischungsverhaeltnissen.', 'Erst gleichnamig machen, dann rechnen.', ['a/b + c/b = (a + c)/b', 'Brueche duerfen erweitert und gekuerzt werden, ohne den Wert zu aendern'], [['1. Zaehler und Nenner trennen', 'Oben steht der Teil, unten die Gesamtteilung.'], ['2. Gleichnamig machen', 'Zum Addieren und Subtrahieren brauchst du denselben Nenner.'], ['3. Zaehler rechnen', 'Der Nenner bleibt gleich.'], ['4. Ergebnis kuerzen', 'Ein gekuerzter Bruch ist leichter zu lesen.']], [['Aufgabe', '1/2 + 1/4'], ['Gleichnamig', '1/2 = 2/4'], ['Addieren', '2/4 + 1/4 = 3/4'], ['Ergebnis', '3/4']], ['Nicht oben und unten einfach separat addieren.', 'Nenner vor dem Rechnen angleichen.', 'Kuerzen am besten erst am Ende.'], { question: 'Was ist 3/4 + 1/4 ?', options: ['1', '4/8', '3/8'], correctIndex: 0, explanation: '3/4 + 1/4 = 4/4. Das ist genau 1.' }),
  dreisatz: makeTopic('Grundlage', 'Dreisatz in kleinen Schritten', 'Der Dreisatz hilft, von einem bekannten Wert auf einen neuen Zielwert umzurechnen.', 'Erst auf 1, dann auf den Zielwert.', ['Bekannten Wert auf 1 Einheit herunterrechnen', 'Danach mit dem Zielwert multiplizieren'], [['1. Zusammenhang aufschreiben', 'Zum Beispiel 4 h entsprechen 120 m3.'], ['2. Auf 1 Einheit rechnen', '120 : 4 = 30 m3 pro h.'], ['3. Auf Zielwert gehen', '30 x 7 = 210 m3.'], ['4. Ergebnis mit Einheit notieren', 'Nur so bleibt die Rechnung sauber.']], [['Gegeben', '4 h -> 120 m3'], ['Auf 1 h', '120 : 4 = 30 m3'], ['Auf 7 h', '30 x 7 = 210 m3'], ['Ergebnis', '210 m3']], ['Erst gleiche Einheiten schaffen.', 'Gegenprobe: Muss das Ergebnis groesser oder kleiner werden?', 'Die Einheit immer mitschreiben.'], { question: '6 kg Chlorgranulat reichen fuer 3 Tage. Wie viel braucht man fuer 5 Tage?', options: ['8 kg', '10 kg', '12 kg'], correctIndex: 1, explanation: '6 : 3 = 2 kg pro Tag. 2 x 5 = 10 kg.' }),
  prozent: makeTopic('Pruefung', 'Prozentrechnung einfach erklaert', 'Prozent bedeutet immer ein Anteil von 100.', 'Grundwert mal Prozentsatz.', ['Prozent in Dezimalzahl umwandeln', 'Dann mit dem Grundwert multiplizieren'], [['1. Grundwert bestimmen', 'Das ist die ganze Menge.'], ['2. Prozent umwandeln', '15 % = 0,15.'], ['3. Multiplizieren', 'Grundwert x 0,15.'], ['4. Plausibilitaet pruefen', '15 % ist deutlich kleiner als 100 %.']], [['Grundwert', '800 Badegaeste'], ['Prozentsatz', '15 % = 0,15'], ['Rechnung', '800 x 0,15 = 120'], ['Ergebnis', '120']], ['15 % ist nicht 15, sondern 0,15.', 'Erst lesen, was gesucht ist.', 'Prozentwerte nie ohne Bezug sehen.'], { question: 'Von 250 Schuelern gehen 40 % ins Hallenbad. Wie viele sind das?', options: ['100', '75', '125'], correctIndex: 0, explanation: '40 % = 0,4. 250 x 0,4 = 100.' }),
  formeln: makeTopic('Umstellen', 'Rechnen mit Formeln und Buchstaben', 'Buchstaben stehen fuer Groessen wie Strecke, Zeit, Volumen oder Geschwindigkeit.', 'Gesuchte Groesse freistellen.', ['Beide Seiten immer gleich behandeln', 'Erst Formel umstellen, dann Zahlen einsetzen'], [['1. Gesuchte Groesse markieren', 'Zum Beispiel s in v = s : t.'], ['2. Stoerende Operation rueckgaengig machen', 'Aus Teilen wird durch Multiplikation wieder s.'], ['3. Neue Formel notieren', 's = v x t.'], ['4. Erst dann Zahlen einsetzen', 'So bleibt die Struktur klar.']], [['Gegeben', 'v = s : t'], ['Gesucht', 's'], ['Umgestellt', 's = v x t'], ['Beispiel', '2 m/s x 30 s = 60 m']], ['Variablen nicht mit Einheiten verwechseln.', 'Nicht zu frueh Zahlen einsetzen.', 'Beide Seiten der Gleichung immer gleich behandeln.'], { question: 'Welche Umstellung ist bei v = s : t fuer s richtig?', options: ['s = v x t', 's = v : t', 's = t : v'], correctIndex: 0, explanation: 'Aus v = s : t wird durch Multiplikation mit t die Form s = v x t.' }),
  pythagoras: makeTopic('Geometrie', 'Satz des Pythagoras', 'Im rechtwinkligen Dreieck gilt eine feste Beziehung zwischen den Seiten.', 'a2 + b2 = c2', ['Die beiden Katheten werden quadriert und addiert', 'Aus dem Ergebnis wird die Wurzel gezogen'], [['1. Rechtwinkliges Dreieck erkennen', 'Die Formel gilt nur dort.'], ['2. Katheten einsetzen', 'a und b sind die beiden kurzen Seiten.'], ['3. Quadrate addieren', 'a x a + b x b.'], ['4. Wurzel ziehen', 'So erhaeltst du c.']], [['Gegeben', 'a = 3 m, b = 4 m'], ['Quadrate', '9 + 16'], ['Summe', '25'], ['Ergebnis', 'c = 5 m']], ['c ist immer die laengste Seite.', 'Am Ende die Wurzel nicht vergessen.', 'Die Formel gilt nicht fuer jedes Dreieck.'], { question: 'Wie gross ist c bei a = 6 m und b = 8 m?', options: ['10 m', '12 m', '14 m'], correctIndex: 0, explanation: '36 + 64 = 100. Wurzel aus 100 ist 10.' }),
  flaechen: makeTopic('Geometrie', 'Flaechenberechnung einfach', 'Flaechen brauchst du fuer Becken, Beckenumgaenge, Abdeckungen und Filterflaechen.', 'Erst Form erkennen, dann Formel waehlen.', ['Rechteck: A = a x b', 'Dreieck: A = a x h : 2', 'Kreis: A = pi x r x r'], [['1. Form bestimmen', 'Rechteck, Dreieck oder Kreis?'], ['2. Laengen messen', 'Alle Werte in derselben Einheit.'], ['3. Richtige Formel nutzen', 'Die Form entscheidet die Formel.'], ['4. Ergebnis in m2 notieren', 'Flaechen sind Quadrat-Einheiten.']], [['Gegeben', '12 m x 4 m'], ['Formel', 'A = a x b'], ['Rechnung', '12 x 4 = 48'], ['Ergebnis', '48 m2']], ['m2 ist nicht m.', 'Beim Kreis Radius und Durchmesser nicht verwechseln.', 'Flaeche nicht mit Volumen mischen.'], { question: 'Wie gross ist die Flaeche eines Rechtecks mit 9 m und 5 m?', options: ['14 m2', '45 m2', '90 m2'], correctIndex: 1, explanation: '9 x 5 = 45 m2.' }),
  volumen: makeTopic('Praxis', 'Beckenvolumen Schritt fuer Schritt', 'Beim Beckenvolumen rechnest du meist Laenge mal Breite mal mittlere Tiefe.', 'Laenge x Breite x Tiefe.', ['Erst Flaeche berechnen', 'Dann mit der Tiefe multiplizieren'], [['1. Laenge und Breite messen', 'Zum Beispiel 25 m und 10 m.'], ['2. Flaeche bilden', '25 x 10 = 250 m2.'], ['3. Mit Tiefe multiplizieren', '250 x 1,8 = 450 m3.'], ['4. In Liter umrechnen', '1 m3 = 1.000 Liter.']], [['Flaeche', '25 x 10 = 250 m2'], ['Mit Tiefe', '250 x 1,8 = 450 m3'], ['Umrechnung', '450 m3 = 450.000 Liter'], ['Ergebnis', '450 m3']], ['Bei unterschiedlich tiefen Becken mittlere Tiefe nutzen.', 'm3 und Liter nicht verwechseln.', 'Flaeche ist noch kein Volumen.'], { question: 'Ein Lehrschwimmbecken ist 12 m lang, 8 m breit und 1,25 m tief. Wie gross ist das Volumen?', options: ['96 m3', '120 m3', '76 m3'], correctIndex: 1, explanation: '12 x 8 = 96. 96 x 1,25 = 120 m3.' }),
  zeit: makeTopic('Alltag', 'Zeit und Industriestunden', 'Im Betrieb brauchst du normale Uhrzeit und manchmal Industriestunden.', 'Minuten sauber in Stundenanteile umrechnen.', ['1 Stunde = 60 Minuten', 'Industriestunde rechnet mit Hundertsteln'], [['1. Uhrzeit lesen', 'Zum Beispiel 3 h 45 min.'], ['2. Minuten umrechnen', '45 : 60 = 0,75 h.'], ['3. Zusammenfassen', '3 + 0,75 = 3,75 h.'], ['4. Richtig benennen', 'Das Ergebnis ist eine Industriestunde.']], [['Gegeben', '3 h 45 min'], ['Minutenanteil', '45 : 60 = 0,75'], ['Zusammenfassen', '3 + 0,75 = 3,75'], ['Ergebnis', '3,75 h']], ['45 Minuten sind nicht 0,45 h.', 'Bei Uhrzeit wird mit 60 gerechnet, nicht mit 100.', 'Immer trennen: Uhrzeit oder Industriestunde?'], { question: 'Wie viele Industriestunden sind 2 h 15 min?', options: ['2,15 h', '2,25 h', '2,50 h'], correctIndex: 1, explanation: '15 : 60 = 0,25. Also 2,25 h.' }),
  auftrieb: makeTopic('Physik', 'Auftrieb einfach verstehen', 'Auftrieb erklaert, warum Koerper im Wasser leichter wirken oder schwimmen.', 'Verdraengtes Wasser bestimmt den Auftrieb.', ['Merksatz: 1 Liter verdraengtes Wasser entspricht grob 1 kg Auftrieb', 'Genauer gilt: Auftriebskraft = Gewicht des verdraengten Wassers'], [['1. Verdraengtes Volumen schaetzen', 'Wie viel Wasser wird weggedrueckt?'], ['2. Liter in Wassergewicht denken', '1 Liter Wasser hat grob 1 kg Masse.'], ['3. Mit Eigengewicht vergleichen', 'Genug Auftrieb bedeutet leichteres Tragen oder Schwimmen.'], ['4. Auf die Praxis beziehen', 'Rettungsmittel arbeiten genau mit diesem Effekt.']], [['Verdraengt', '15 Liter Wasser'], ['Merksatz', '15 Liter ~ 15 kg'], ['Bedeutung', 'ca. 15 kg Auftrieb'], ['Praxis', 'Hilft beim Schweben oder Tragen']], ['Auftrieb nicht mit Eigengewicht verwechseln.', 'Die Liter-zu-kg-Regel ist eine Naeherung.', 'Nicht jeder Gegenstand schwimmt automatisch.'], { question: 'Wie viel Auftrieb liefert grob ein Koerper, der 8 Liter Wasser verdraengt?', options: ['ca. 8 kg', 'ca. 80 kg', 'ca. 0,8 kg'], correctIndex: 0, explanation: '1 Liter Wasser entspricht grob 1 kg. Also etwa 8 kg Auftrieb.' }),
  druck: makeTopic('Physik', 'Druck im Badebetrieb', 'Druck ist Kraft auf einer Flaeche. Im Wasser steigt er mit der Tiefe.', 'Mehr Tiefe bedeutet mehr Druck.', ['Allgemein: p = F : A', 'Im Wasser als Faustregel: pro 1 m Tiefe etwa 0,1 bar'], [['1. Kraft und Flaeche trennen', 'Gleiche Kraft auf kleiner Flaeche bedeutet mehr Druck.'], ['2. Bei Wasser an die Tiefe denken', 'Mit jedem Meter nimmt der Druck zu.'], ['3. Faustregel nutzen', '1 m Wassertiefe ~ 0,1 bar.'], ['4. Einheit notieren', 'Typisch sind bar oder Pascal.']], [['Tiefe', '2 m'], ['Faustregel', '0,1 bar pro m'], ['Rechnung', '2 x 0,1 bar'], ['Ergebnis', 'ca. 0,2 bar']], ['Bar und Pascal nicht vermischen.', 'Druck steigt mit der Tiefe, nicht mit der Beckenlaenge.', 'Die 0,1-bar-Regel ist nur eine gute Naeherung.'], { question: 'Welcher zusaetzliche Druck wirkt in etwa bei 3 m Wassertiefe?', options: ['0,03 bar', '0,3 bar', '3 bar'], correctIndex: 1, explanation: 'Bei 0,1 bar pro Meter ergeben 3 m etwa 0,3 bar.' }),
  bewegung: makeTopic('Physik', 'Geschwindigkeit und Bewegung', 'Bewegung laesst sich oft mit Strecke, Zeit und Geschwindigkeit beschreiben.', 'v = s : t', ['Geschwindigkeit: v = s : t', 'Strecke: s = v x t', 'Zeit: t = s : v'], [['1. Gesuchte Groesse bestimmen', 'Willst du v, s oder t wissen?'], ['2. Einheiten pruefen', 'Sekunden, Minuten und Stunden muessen passen.'], ['3. Passende Formel nutzen', 'Notfalls vorher umstellen.'], ['4. Ergebnis mit Einheit kontrollieren', 'Zum Beispiel m/s oder km/h.']], [['Gegeben', '50 m in 40 s'], ['Formel', 'v = s : t'], ['Rechnung', '50 : 40 = 1,25'], ['Ergebnis', '1,25 m/s']], ['km/h und m/s nie ohne Umrechnung mischen.', 'Zeit muss zur Strecke passen.', 'Nicht vergessen, die Formel bei Bedarf umzustellen.'], { question: 'Wie gross ist die Geschwindigkeit bei 100 m in 80 s?', options: ['0,8 m/s', '1,25 m/s', '1,8 m/s'], correctIndex: 1, explanation: '100 : 80 = 1,25 m/s.' }),
  waerme: makeTopic('Energie', 'Waermelehre fuer den Betrieb', 'Bei Beckenwasser sind Temperaturdifferenzen und Waermemengen besonders wichtig.', 'Entscheidend ist die Temperaturdifferenz.', ['Delta T = Endtemperatur - Anfangstemperatur', 'Fuer Wasser grob: Q in kWh = 1,16 x m3 x Delta T'], [['1. Temperaturen notieren', 'Anfang und Ende sauber festhalten.'], ['2. Delta T berechnen', 'Zum Beispiel 28 C - 24 C = 4 K.'], ['3. Volumen einsetzen', 'Die 1,16-Regel gilt fuer Wasser in m3.'], ['4. Ergebnis als Energie lesen', 'Das Ergebnis kommt in kWh heraus.']], [['Gegeben', '20 m3 Wasser, Delta T = 5 K'], ['Formel', 'Q = 1,16 x m3 x Delta T'], ['Rechnung', '1,16 x 20 x 5 = 116'], ['Ergebnis', '116 kWh']], ['Temperatur und Temperaturdifferenz nicht verwechseln.', 'Die 1,16-Regel ist eine Betriebsnaeherung fuer Wasser.', 'Einheiten muessen passen.'], { question: 'Wie viel Energie brauchst du grob fuer 10 m3 Wasser bei 2 K Temperaturerhoehung?', options: ['11,6 kWh', '23,2 kWh', '116 kWh'], correctIndex: 1, explanation: '1,16 x 10 x 2 = 23,2 kWh.' }),
  mechanik: makeTopic('Technik', 'Mechanik: Kraft, Arbeit und Leistung', 'Mechanik beschreibt, wie Kraefte wirken und wie daraus Arbeit oder Leistung wird.', 'Kraft bewegt, Arbeit uebertraegt, Leistung sagt wie schnell.', ['Kraft: F = m x a', 'Arbeit: W = F x s', 'Leistung: P = W : t'], [['1. Groesse bestimmen', 'Geht es um Kraft, Arbeit oder Leistung?'], ['2. Werte mit Einheit einsetzen', 'Newton, Meter, Sekunde.'], ['3. Erst Arbeit, dann Leistung', 'Wenn beides gefragt ist, Schritt fuer Schritt rechnen.'], ['4. Ergebnis fachlich pruefen', 'Watt ist Arbeit pro Zeit.']], [['Gegeben', 'F = 200 N, s = 4 m'], ['Formel', 'W = F x s'], ['Rechnung', '200 x 4 = 800'], ['Ergebnis', '800 J']], ['Joule und Watt nicht verwechseln.', 'Leistung braucht immer eine Zeit.', 'Nicht jede Aufgabe braucht alle drei Groessen.'], { question: 'Wie gross ist die Leistung, wenn 6000 J Arbeit in 10 s geleistet werden?', options: ['60 W', '600 W', '6000 W'], correctIndex: 1, explanation: 'P = 6000 : 10 = 600 W.' }),
  pumpen: makeTopic('Hydraulik', 'Pumpenberechnung einfach aufbauen', 'Bei Pumpen brauchst du vor allem Foerderstrom, Foerderhoehe und Leistung.', 'Erst Foerderstrom, dann Foerderhoehe, dann Leistung.', ['Foerderstrom: Q = V : t', 'Hydraulische Leistung: P = rho x g x Q x H', 'Motorleistung liegt wegen Verlusten hoeher'], [['1. Foerderstrom berechnen', 'Wie viel Wasser in welcher Zeit?'], ['2. Foerderhoehe bestimmen', 'Gegen welchen Hoehen- oder Druckunterschied arbeitet die Pumpe?'], ['3. Leistung berechnen', 'Dafuer brauchst du Q und H.'], ['4. Verluste bedenken', 'Keine Pumpe arbeitet verlustfrei.']], [['Gegeben', '120 m3 in 4 h'], ['Formel', 'Q = V : t'], ['Rechnung', '120 : 4 = 30'], ['Ergebnis', '30 m3/h']], ['Foerderstrom nicht mit Leistung verwechseln.', 'Bei Leistungsformeln muss Q oft in m3/s stehen.', 'Wirkungsgradverluste nie vergessen.'], { question: 'Wie gross ist der Foerderstrom bei 180 m3 in 6 h?', options: ['20 m3/h', '30 m3/h', '36 m3/h'], correctIndex: 1, explanation: '180 : 6 = 30 m3/h.' }),
  filtration: makeTopic('Hydraulik', 'Berechnungen fuer Filtration', 'Bei der Filtration sind Filterflaeche und Filtrationsgeschwindigkeit zentral.', 'Filtrationsgeschwindigkeit = Durchfluss durch Flaeche.', ['vF = Q : A', 'A = Q : vF', 'Kreisflaeche: A = pi x r x r'], [['1. Durchfluss Q nehmen', 'Wie viel Wasser geht pro Stunde durch den Filter?'], ['2. Filterflaeche bestimmen', 'Bei runden Filtern ueber den Radius.'], ['3. Teilen', 'Q : A ergibt die Filtrationsgeschwindigkeit.'], ['4. Fachlich pruefen', 'Zu hohe Geschwindigkeit belastet den Filter.']], [['Gegeben', 'Q = 90 m3/h, vF = 30 m/h'], ['Formel', 'A = Q : vF'], ['Rechnung', '90 : 30 = 3'], ['Ergebnis', '3 m2']], ['Q und vF nicht verwechseln.', 'Beim Kreis den Radius nutzen.', 'm2 und m/h sind verschiedene Groessen.'], { question: 'Welche Filterflaeche brauchst du bei 60 m3/h und 20 m/h Filtrationsgeschwindigkeit?', options: ['2 m2', '3 m2', '4 m2'], correctIndex: 1, explanation: 'A = 60 : 20 = 3 m2.' }),
  chlor: makeTopic('Chemie', 'Dosierungen von Chlor berechnen', 'Fuer Chlor-Dosierungen ist eine Merkhilfe besonders wichtig: 1 mg/L entspricht 1 g pro m3.', '1 mg/L = 1 g/m3', ['Aktivchlor in g = Konzentrationsaenderung in mg/L x Beckenvolumen in m3', 'Produktmenge = Aktivchlor : Wirkstoffanteil'], [['1. Beckenvolumen kennen', 'Ohne m3-Wert geht keine saubere Dosierung.'], ['2. Zielaenderung festlegen', 'Zum Beispiel +0,3 mg/L freies Chlor.'], ['3. Aktivchlor berechnen', '0,3 g pro m3 mal Volumen.'], ['4. Produktstaerke beruecksichtigen', '65 % Wirkstoff bedeutet mehr Produktmasse.']], [['Gegeben', '450 m3, Anhebung um 0,3 mg/L'], ['Aktivchlor', '0,3 x 450 = 135 g'], ['Bei 65 % Produkt', '135 : 0,65 = ca. 208 g'], ['Ergebnis', 'ca. 208 g Produkt']], ['mg/L nicht direkt mit kg verwechseln.', 'Erst Aktivchlor, dann Produktmenge rechnen.', 'Die Rechnung ersetzt keine Betriebsanweisung.'], { question: 'Wie viel Aktivchlor brauchst du fuer 200 m3, wenn der Wert um 0,5 mg/L steigen soll?', options: ['50 g', '100 g', '500 g'], correctIndex: 1, explanation: '0,5 x 200 = 100 g Aktivchlor.' }),
  formelsammlung: makeTopic('Nachschlagen', 'Formelsammelblatt fuer Mathe und Technik', 'Hier stehen die wichtigsten Formeln gesammelt an einer Stelle.', 'Formel sehen, Einheit pruefen, dann rechnen.', ['Formeln immer zusammen mit Einheiten lesen', 'Nur gleiche Einheiten in dieselbe Formel einsetzen', 'Bei Unsicherheit erst die Groesse benennen, dann rechnen'], [['1. Themengebiet finden', 'Geometrie, Bewegung, Hydraulik, Waerme oder Chemie?'], ['2. Gesuchte Groesse markieren', 'Danach die passende Formel waehlen.'], ['3. Einheiten angleichen', 'Viele Fehler entstehen bei Minuten, Litern oder bar.'], ['4. Ergebnis per Ueberschlag pruefen', 'Das Ergebnis muss fachlich grob passen.']], [['1 m3', '1.000 Liter'], ['1 mg/L', '1 g pro m3'], ['1 m Wassertiefe', 'ca. 0,1 bar'], ['Waerme Wasser', '1,16 kWh pro m3 und K']], ['Einheiten sind Teil der Formel.', 'Nicht jede Formel gilt in jeder Situation unveraendert.', 'Das Sammelblatt ersetzt keinen sauberen Rechenweg.'], { question: 'Welche Formel passt zur Filtrationsgeschwindigkeit?', options: ['vF = Q : A', 'Q = p : A', 'A = a + b'], correctIndex: 0, explanation: 'Die Filtrationsgeschwindigkeit ergibt sich aus Durchfluss Q geteilt durch die Filterflaeche A.' }, [{ title: 'Grundlagen', lines: ['Punkt vor Strich', 'Brueche gleichnamig machen', 'Prozentwert = Grundwert x Prozentsatz'] }, { title: 'Geometrie', lines: ['A Rechteck = a x b', 'A Kreis = pi x r x r', 'V = l x b x h', 'a2 + b2 = c2'] }, { title: 'Bewegung', lines: ['v = s : t', 's = v x t', 't = s : v', '1 h = 60 min'] }, { title: 'Hydraulik', lines: ['Q = V : t', 'vF = Q : A', 'A = Q : vF', 'p Wasser ~ 0,1 bar pro m'] }, { title: 'Waerme und Chemie', lines: ['Q kWh = 1,16 x m3 x Delta T', '1 mg/L = 1 g/m3', 'Produktmenge = Aktivchlor : Wirkstoffanteil'] }])
};

const TOPIC_ORDER = ['grundrechenarten', 'brueche', 'dreisatz', 'prozent', 'formeln', 'pythagoras', 'flaechen', 'volumen', 'zeit', 'auftrieb', 'druck', 'bewegung', 'waerme', 'mechanik', 'pumpen', 'filtration', 'chlor', 'formelsammlung'];

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

  const topic = TOPICS[activeTopicId] || TOPICS.grundrechenarten;
  const isCorrect = selectedAnswer === topic.quiz.correctIndex;

  const handleTopicChange = (topicId) => {
    setActiveTopicId(topicId);
    setRevealedAnswer(false);
    setSelectedAnswer(null);
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

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {TOPIC_ORDER.map((topicId) => {
          const entry = TOPICS[topicId];
          const active = topicId === activeTopicId;
          return (
            <button
              key={topicId}
              type="button"
              onClick={() => handleTopicChange(topicId)}
              className={`rounded-2xl border p-4 text-left transition-all ${active ? 'border-cyan-400 bg-cyan-500/10 shadow-md' : darkMode ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700' : 'border-gray-200 bg-white hover:border-cyan-200 hover:shadow-sm'}`}
            >
              <div className={`text-xs font-bold uppercase tracking-wide ${active ? 'text-cyan-400' : darkMode ? 'text-slate-500' : 'text-gray-400'}`}>{entry.chip}</div>
              <div className={`text-sm font-semibold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{entry.title}</div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <InfoCard darkMode={darkMode} title="Schritt fuer Schritt">
          <div className="space-y-3">
            {topic.steps.map(([stepTitle, stepText], index) => (
              <div key={stepTitle} className={`rounded-2xl p-4 ${darkMode ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold shrink-0">{index + 1}</div>
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stepTitle}</div>
                    <p className={`text-sm mt-1 leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{stepText}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>

        <div className="space-y-5">
          <InfoCard darkMode={darkMode} title="Formelbox">
            <div className="space-y-2">
              {topic.formula.map((line) => (
                <div key={line} className={`rounded-xl px-3 py-2 text-sm ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-cyan-50 text-cyan-900'}`}>{line}</div>
              ))}
            </div>
          </InfoCard>

          <InfoCard darkMode={darkMode} title="Typische Fehler">
            <ul className={`space-y-2 text-sm leading-6 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {topic.pitfalls.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-rose-400">-</span><span>{item}</span></li>
              ))}
            </ul>
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

      <InfoCard darkMode={darkMode} title="Kurze Lernkontrolle">
        <div className="space-y-4">
          <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{topic.quiz.question}</h4>
          <div className="grid gap-3 md:grid-cols-3">
            {topic.quiz.options.map((option, index) => {
              const showState = revealedAnswer;
              const isAnswerCorrect = index === topic.quiz.correctIndex;
              const isPicked = index === selectedAnswer;
              let className = darkMode ? 'border-slate-800 bg-slate-900/70 text-slate-200' : 'border-gray-200 bg-white text-gray-700';
              if (showState && isAnswerCorrect) className = 'border-emerald-400 bg-emerald-500/10 text-emerald-700';
              else if (showState && isPicked && !isAnswerCorrect) className = 'border-rose-400 bg-rose-500/10 text-rose-700';
              else if (!showState && isPicked) className = 'border-cyan-400 bg-cyan-500/10 text-cyan-700';
              return (
                <button key={option} type="button" onClick={() => setSelectedAnswer(index)} className={`rounded-2xl border px-4 py-3 text-left text-sm transition-all ${className}`}>
                  {option}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setRevealedAnswer(true)} disabled={selectedAnswer === null} className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400">
              Antwort pruefen
            </button>
            <button type="button" onClick={() => { setSelectedAnswer(null); setRevealedAnswer(false); }} className={`rounded-xl px-4 py-2 text-sm font-semibold ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-gray-700'}`}>
              Neu starten
            </button>
          </div>
          {revealedAnswer && (
            <div className={`rounded-2xl border p-4 text-sm ${isCorrect ? 'border-emerald-400 bg-emerald-500/10 text-emerald-700' : darkMode ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-gray-200 bg-slate-50 text-gray-700'}`}>
              <div className="font-semibold mb-1">{isCorrect ? 'Richtig.' : 'Loesung'}</div>
              <div>{topic.quiz.explanation}</div>
            </div>
          )}
        </div>
      </InfoCard>
    </div>
  );
}
