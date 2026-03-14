const ex = (prompt, answer, steps) => ({
  prompt,
  answer,
  steps
});

export const PRACTICE_SETS = {
  grundrechenarten: [
    ex('Rechne: 27 + 15', '42', ['Zuerst die Einer: 7 + 5 = 12.', 'Schreibe 2 und merke 1 Zehner.', 'Dann 2 + 1 + 1 = 4 Zehner.', 'Ergebnis: 42.']),
    ex('Rechne: 64 - 28', '36', ['Ziehe zuerst 20 ab: 64 - 20 = 44.', 'Dann ziehe 8 ab: 44 - 8 = 36.', 'Kontrolle: 36 + 28 = 64.', 'Ergebnis: 36.']),
    ex('Rechne: 8 x 7', '56', ['Male 8 mit 7.', '8 x 7 = 56.', 'Du kannst auch 7 x 8 rechnen.', 'Ergebnis: 56.']),
    ex('Rechne: 72 : 9', '8', ['Du suchst die Zahl, die mit 9 multipliziert 72 ergibt.', '9 x 8 = 72.', 'Darum ist 72 : 9 = 8.', 'Ergebnis: 8.']),
    ex('Rechne: 18 + 6 x 3', '36', ['Punkt vor Strich gilt.', 'Zuerst 6 x 3 = 18.', 'Dann 18 + 18 = 36.', 'Ergebnis: 36.'])
  ],
  brueche: [
    ex('Rechne: 1/2 + 1/4', '3/4', ['Mache die Brueche gleichnamig.', '1/2 wird zu 2/4.', 'Dann 2/4 + 1/4 = 3/4.', 'Ergebnis: 3/4.']),
    ex('Rechne: 3/5 + 1/5', '4/5', ['Beide Brueche haben schon den Nenner 5.', 'Addiere nur die Zaehler: 3 + 1 = 4.', 'Der Nenner bleibt 5.', 'Ergebnis: 4/5.']),
    ex('Rechne: 5/6 - 1/6', '2/3', ['Beide Brueche sind gleichnamig.', 'Ziehe die Zaehler ab: 5 - 1 = 4.', 'Du bekommst 4/6 und kuerzt durch 2.', 'Ergebnis: 2/3.']),
    ex('Wie viel sind 2/3 von 12?', '8', ['Teile 12 zuerst durch den Nenner 3.', '12 : 3 = 4.', 'Dann 4 x 2 = 8.', 'Ergebnis: 8.']),
    ex('Wie viel sind 3/4 von 8?', '6', ['Teile 8 zuerst durch 4.', '8 : 4 = 2.', 'Dann 2 x 3 = 6.', 'Ergebnis: 6.'])
  ],
  dreisatz: [
    ex('3 h entsprechen 90 m3. Wie viel sind es in 5 h?', '150 m3', ['Rechne zuerst auf 1 Stunde.', '90 : 3 = 30 m3 pro Stunde.', 'Dann 30 x 5 = 150 m3.', 'Ergebnis: 150 m3.']),
    ex('8 kg reichen fuer 4 Tage. Wie viel fuer 7 Tage?', '14 kg', ['Rechne auf 1 Tag.', '8 : 4 = 2 kg pro Tag.', 'Dann 2 x 7 = 14 kg.', 'Ergebnis: 14 kg.']),
    ex('12 Karten kosten 96 EUR. Was kosten 5 Karten?', '40 EUR', ['Rechne auf 1 Karte.', '96 : 12 = 8 EUR pro Karte.', 'Dann 8 x 5 = 40 EUR.', 'Ergebnis: 40 EUR.']),
    ex('4 Saecke kosten 20 EUR. Was kosten 7 Saecke?', '35 EUR', ['Rechne auf 1 Sack.', '20 : 4 = 5 EUR pro Sack.', 'Dann 5 x 7 = 35 EUR.', 'Ergebnis: 35 EUR.']),
    ex('10 m werden in 5 s geschwommen. Wie lange dauern 30 m?', '15 s', ['Rechne auf 1 Meter.', '5 : 10 = 0,5 s pro Meter.', 'Dann 0,5 x 30 = 15 s.', 'Ergebnis: 15 s.'])
  ],
  prozent: [
    ex('Wie viel sind 10 % von 200?', '20', ['10 % sind 0,10.', '200 x 0,10 = 20.', 'Oder: 10 % ist ein Zehntel von 200.', 'Ergebnis: 20.']),
    ex('Wie viel sind 25 % von 80?', '20', ['25 % sind 0,25.', '80 x 0,25 = 20.', 'Oder: Ein Viertel von 80 ist 20.', 'Ergebnis: 20.']),
    ex('Wie viel sind 5 % von 300?', '15', ['5 % sind 0,05.', '300 x 0,05 = 15.', 'Kontrolle: 10 % waeren 30, also 5 % die Haelfte davon.', 'Ergebnis: 15.']),
    ex('Wie viel sind 40 % von 90?', '36', ['40 % sind 0,4.', '90 x 0,4 = 36.', 'Kontrolle: 50 % waeren 45, also passt 36 gut.', 'Ergebnis: 36.']),
    ex('Wie viel sind 12 % von 250?', '30', ['12 % sind 0,12.', '250 x 0,12 = 30.', 'Kontrolle: 10 % sind 25 und 2 % sind 5.', 'Ergebnis: 30.'])
  ],
  formeln: [
    ex('Berechne s bei s = v x t mit v = 2 m/s und t = 30 s.', '60 m', ['Setze die Werte ein.', 's = 2 x 30.', 'Das ergibt 60.', 'Ergebnis: 60 m.']),
    ex('Berechne t bei t = s : v mit s = 100 m und v = 2 m/s.', '50 s', ['Setze die Werte ein.', 't = 100 : 2.', 'Das ergibt 50.', 'Ergebnis: 50 s.']),
    ex('Berechne A bei A = a x b mit a = 8 m und b = 6 m.', '48 m2', ['Setze die Werte in die Flaechenformel ein.', 'A = 8 x 6.', 'Das ergibt 48.', 'Ergebnis: 48 m2.']),
    ex('Berechne Q bei Q = V : t mit V = 150 m3 und t = 5 h.', '30 m3/h', ['Setze die Werte ein.', 'Q = 150 : 5.', 'Das ergibt 30.', 'Ergebnis: 30 m3/h.']),
    ex('Berechne A bei A = Q : vF mit Q = 80 m3/h und vF = 20 m/h.', '4 m2', ['Setze die Werte ein.', 'A = 80 : 20.', 'Das ergibt 4.', 'Ergebnis: 4 m2.'])
  ],
  pythagoras: [
    ex('Berechne c bei a = 3 m und b = 4 m.', '5 m', ['Nutze a2 + b2 = c2.', '3 x 3 + 4 x 4 = 9 + 16 = 25.', 'Ziehe die Wurzel aus 25.', 'Ergebnis: 5 m.']),
    ex('Berechne c bei a = 5 m und b = 12 m.', '13 m', ['5 x 5 + 12 x 12 = 25 + 144 = 169.', 'Ziehe die Wurzel aus 169.', 'Wurzel aus 169 ist 13.', 'Ergebnis: 13 m.']),
    ex('Berechne c bei a = 6 m und b = 8 m.', '10 m', ['6 x 6 + 8 x 8 = 36 + 64 = 100.', 'Ziehe die Wurzel aus 100.', 'Wurzel aus 100 ist 10.', 'Ergebnis: 10 m.']),
    ex('Berechne c bei a = 8 m und b = 15 m.', '17 m', ['8 x 8 + 15 x 15 = 64 + 225 = 289.', 'Ziehe die Wurzel aus 289.', 'Wurzel aus 289 ist 17.', 'Ergebnis: 17 m.']),
    ex('Berechne c bei a = 9 m und b = 12 m.', '15 m', ['9 x 9 + 12 x 12 = 81 + 144 = 225.', 'Ziehe die Wurzel aus 225.', 'Wurzel aus 225 ist 15.', 'Ergebnis: 15 m.'])
  ],
  flaechen: [
    ex('Wie gross ist die Flaeche eines Rechtecks mit 12 m und 5 m?', '60 m2', ['Nutze A = a x b.', '12 x 5 = 60.', 'Schreibe die Einheit als Quadratmeter.', 'Ergebnis: 60 m2.']),
    ex('Wie gross ist die Flaeche eines Rechtecks mit 25 m und 8 m?', '200 m2', ['A = a x b.', '25 x 8 = 200.', 'Die Einheit ist m2.', 'Ergebnis: 200 m2.']),
    ex('Wie gross ist die Flaeche eines Dreiecks mit a = 10 m und h = 6 m?', '30 m2', ['Nutze A = a x h : 2.', '10 x 6 = 60.', '60 : 2 = 30.', 'Ergebnis: 30 m2.']),
    ex('Wie gross ist die Kreisflaeche bei r = 2 m? Rechne mit 3,14.', '12,56 m2', ['Nutze A = pi x r x r.', 'A = 3,14 x 2 x 2.', '3,14 x 4 = 12,56.', 'Ergebnis: 12,56 m2.']),
    ex('Wie gross ist die Flaeche eines Quadrats mit 7 m Seitenlaenge?', '49 m2', ['Ein Quadrat ist auch ein Rechteck.', 'A = 7 x 7.', 'Das ergibt 49.', 'Ergebnis: 49 m2.'])
  ],
  volumen: [
    ex('Wie gross ist das Volumen bei 10 m x 5 m x 2 m?', '100 m3', ['Nutze V = l x b x h.', '10 x 5 = 50.', '50 x 2 = 100.', 'Ergebnis: 100 m3.']),
    ex('Wie gross ist das Volumen bei 25 m x 8 m x 1,5 m?', '300 m3', ['25 x 8 = 200.', '200 x 1,5 = 300.', 'Die Einheit ist m3.', 'Ergebnis: 300 m3.']),
    ex('Wie gross ist das Volumen bei 12 m x 6 m x 1,2 m?', '86,4 m3', ['12 x 6 = 72.', '72 x 1,2 = 86,4.', 'Schreibe die Einheit m3 dazu.', 'Ergebnis: 86,4 m3.']),
    ex('Wie gross ist das Volumen bei 20 m x 10 m x 2 m?', '400 m3', ['20 x 10 = 200.', '200 x 2 = 400.', 'Das ist das Volumen.', 'Ergebnis: 400 m3.']),
    ex('Wie gross ist das Volumen bei 15 m x 5 m x 1,8 m?', '135 m3', ['15 x 5 = 75.', '75 x 1,8 = 135.', 'Die Einheit ist m3.', 'Ergebnis: 135 m3.'])
  ],
  zeit: [
    ex('Wandle 1 h 30 min in Industriestunden um.', '1,5 h', ['30 Minuten sind 30 : 60 = 0,5 h.', 'Dann 1 h + 0,5 h.', 'Das ergibt 1,5 h.', 'Ergebnis: 1,5 h.']),
    ex('Wandle 2 h 15 min in Industriestunden um.', '2,25 h', ['15 Minuten sind 15 : 60 = 0,25 h.', 'Dann 2 + 0,25.', 'Das ergibt 2,25 h.', 'Ergebnis: 2,25 h.']),
    ex('Wandle 45 min in Industriestunden um.', '0,75 h', ['Teile 45 durch 60.', '45 : 60 = 0,75.', 'Das ist der Stundenanteil.', 'Ergebnis: 0,75 h.']),
    ex('Wandle 3 h 6 min in Industriestunden um.', '3,1 h', ['6 Minuten sind 6 : 60 = 0,1 h.', 'Dann 3 + 0,1.', 'Das ergibt 3,1 h.', 'Ergebnis: 3,1 h.']),
    ex('Wandle 4 h 45 min in Industriestunden um.', '4,75 h', ['45 Minuten sind 45 : 60 = 0,75 h.', 'Dann 4 + 0,75.', 'Das ergibt 4,75 h.', 'Ergebnis: 4,75 h.'])
  ],
  auftrieb: [
    ex('Ein Koerper verdraengt 5 Liter Wasser. Wie gross ist der Auftrieb grob?', '5 kg', ['Merksatz: 1 Liter Wasser entspricht grob 1 kg.', '5 Liter entsprechen darum 5 kg.', 'Das ist der grobe Auftrieb.', 'Ergebnis: 5 kg.']),
    ex('Ein Koerper verdraengt 12 Liter Wasser. Wie gross ist der Auftrieb grob?', '12 kg', ['1 Liter Wasser entspricht grob 1 kg.', '12 Liter entsprechen darum 12 kg.', 'Das ist der grobe Auftrieb.', 'Ergebnis: 12 kg.']),
    ex('Ein Koerper verdraengt 20 Liter Wasser. Wie gross ist der Auftrieb grob?', '20 kg', ['Nutze wieder die 1-zu-1-Regel.', '20 Liter entsprechen grob 20 kg.', 'Das ist der Auftrieb.', 'Ergebnis: 20 kg.']),
    ex('Ein Koerper verdraengt 7,5 Liter Wasser. Wie gross ist der Auftrieb grob?', '7,5 kg', ['1 Liter Wasser entspricht grob 1 kg.', '7,5 Liter entsprechen grob 7,5 kg.', 'Auch mit Kommazahl gilt die gleiche Regel.', 'Ergebnis: 7,5 kg.']),
    ex('Ein Koerper verdraengt 30 Liter Wasser. Wie gross ist der Auftrieb grob?', '30 kg', ['1 Liter Wasser entspricht grob 1 kg.', '30 Liter entsprechen grob 30 kg.', 'Das ist der Auftrieb.', 'Ergebnis: 30 kg.'])
  ],
  druck: [
    ex('Wie hoch ist der zusaetzliche Wasserdruck bei 1 m Tiefe?', '0,1 bar', ['Faustregel: 1 m Tiefe entspricht grob 0,1 bar.', 'Darum ist es bei 1 m genau diese Naeherung.', 'Mehr musst du hier nicht umrechnen.', 'Ergebnis: 0,1 bar.']),
    ex('Wie hoch ist der zusaetzliche Wasserdruck bei 2,5 m Tiefe?', '0,25 bar', ['Faustregel: 0,1 bar pro Meter.', '2,5 x 0,1 = 0,25.', 'Das ist der zusaetzliche Druck.', 'Ergebnis: 0,25 bar.']),
    ex('Wie hoch ist der zusaetzliche Wasserdruck bei 4 m Tiefe?', '0,4 bar', ['Nutze 0,1 bar pro Meter.', '4 x 0,1 = 0,4.', 'Das ist der ungefaehre Druck.', 'Ergebnis: 0,4 bar.']),
    ex('Wie hoch ist der zusaetzliche Wasserdruck bei 0,5 m Tiefe?', '0,05 bar', ['Nutze wieder 0,1 bar pro Meter.', '0,5 x 0,1 = 0,05.', 'Auch halbe Meter kannst du so rechnen.', 'Ergebnis: 0,05 bar.']),
    ex('Wie hoch ist der zusaetzliche Wasserdruck bei 6 m Tiefe?', '0,6 bar', ['Faustregel: 0,1 bar pro Meter.', '6 x 0,1 = 0,6.', 'Das ist der ungefaehre Druck.', 'Ergebnis: 0,6 bar.'])
  ],
  bewegung: [
    ex('Wie gross ist die Geschwindigkeit bei 50 m in 25 s?', '2 m/s', ['Nutze v = s : t.', '50 : 25 = 2.', 'Die Einheit ist Meter pro Sekunde.', 'Ergebnis: 2 m/s.']),
    ex('Wie gross ist die Geschwindigkeit bei 100 m in 80 s?', '1,25 m/s', ['Nutze v = s : t.', '100 : 80 = 1,25.', 'Die Einheit ist m/s.', 'Ergebnis: 1,25 m/s.']),
    ex('Welche Strecke legt man bei 2 m/s in 30 s zurueck?', '60 m', ['Nutze s = v x t.', '2 x 30 = 60.', 'Die Einheit ist Meter.', 'Ergebnis: 60 m.']),
    ex('Wie lange braucht man fuer 200 m bei 4 m/s?', '50 s', ['Nutze t = s : v.', '200 : 4 = 50.', 'Die Einheit ist Sekunden.', 'Ergebnis: 50 s.']),
    ex('Wie gross ist die Geschwindigkeit bei 75 m in 50 s?', '1,5 m/s', ['Nutze v = s : t.', '75 : 50 = 1,5.', 'Die Einheit ist m/s.', 'Ergebnis: 1,5 m/s.'])
  ],
  waerme: [
    ex('Wie viel Energie braucht man grob fuer 10 m3 Wasser bei 2 K?', '23,2 kWh', ['Nutze Q = 1,16 x m3 x Delta T.', '1,16 x 10 x 2 = 23,2.', 'Die Einheit ist kWh.', 'Ergebnis: 23,2 kWh.']),
    ex('Wie viel Energie braucht man grob fuer 20 m3 Wasser bei 3 K?', '69,6 kWh', ['Q = 1,16 x 20 x 3.', '1,16 x 60 = 69,6.', 'Die Einheit ist kWh.', 'Ergebnis: 69,6 kWh.']),
    ex('Wie viel Energie braucht man grob fuer 5 m3 Wasser bei 4 K?', '23,2 kWh', ['Q = 1,16 x 5 x 4.', '1,16 x 20 = 23,2.', 'Das Ergebnis ist eine Energiemenge.', 'Ergebnis: 23,2 kWh.']),
    ex('Wie viel Energie braucht man grob fuer 15 m3 Wasser bei 1 K?', '17,4 kWh', ['Q = 1,16 x 15 x 1.', '1,16 x 15 = 17,4.', 'Die Einheit ist kWh.', 'Ergebnis: 17,4 kWh.']),
    ex('Wie viel Energie braucht man grob fuer 30 m3 Wasser bei 2 K?', '69,6 kWh', ['Q = 1,16 x 30 x 2.', '1,16 x 60 = 69,6.', 'Die Einheit ist kWh.', 'Ergebnis: 69,6 kWh.'])
  ],
  mechanik: [
    ex('Wie gross ist die Arbeit bei 100 N und 5 m Weg?', '500 J', ['Nutze W = F x s.', '100 x 5 = 500.', 'Die Einheit ist Joule.', 'Ergebnis: 500 J.']),
    ex('Wie gross ist die Arbeit bei 200 N und 3 m Weg?', '600 J', ['Nutze W = F x s.', '200 x 3 = 600.', 'Die Einheit ist Joule.', 'Ergebnis: 600 J.']),
    ex('Wie gross ist die Leistung bei 1000 J in 10 s?', '100 W', ['Nutze P = W : t.', '1000 : 10 = 100.', 'Die Einheit ist Watt.', 'Ergebnis: 100 W.']),
    ex('Wie gross ist die Leistung bei 2400 J in 30 s?', '80 W', ['Nutze P = W : t.', '2400 : 30 = 80.', 'Die Einheit ist Watt.', 'Ergebnis: 80 W.']),
    ex('Wie gross ist die Kraft bei m = 50 kg und a = 2 m/s2?', '100 N', ['Nutze F = m x a.', '50 x 2 = 100.', 'Die Einheit ist Newton.', 'Ergebnis: 100 N.'])
  ],
  pumpen: [
    ex('Wie gross ist der Foerderstrom bei 120 m3 in 4 h?', '30 m3/h', ['Nutze Q = V : t.', '120 : 4 = 30.', 'Die Einheit ist m3/h.', 'Ergebnis: 30 m3/h.']),
    ex('Wie gross ist der Foerderstrom bei 180 m3 in 6 h?', '30 m3/h', ['Q = V : t.', '180 : 6 = 30.', 'Die Einheit ist m3/h.', 'Ergebnis: 30 m3/h.']),
    ex('Wie gross ist der Foerderstrom bei 200 m3 in 5 h?', '40 m3/h', ['Q = V : t.', '200 : 5 = 40.', 'Die Einheit ist m3/h.', 'Ergebnis: 40 m3/h.']),
    ex('Wie gross ist die Foerderhoehe grob bei 0,3 bar?', '3 m', ['Faustregel: 1 bar sind grob 10 m Wassersaeule.', '0,3 bar entsprechen darum grob 3 m.', 'Das ist die Foerderhoehe als Naeherung.', 'Ergebnis: 3 m.']),
    ex('Wie gross ist die hydraulische Leistung grob bei Q = 0,01 m3/s und H = 10 m?', '981 W', ['Nutze P = 1000 x 9,81 x Q x H.', 'Setze ein: 1000 x 9,81 x 0,01 x 10.', 'Das ergibt 981.', 'Ergebnis: 981 W.'])
  ],
  filtration: [
    ex('Welche Filterflaeche braucht man bei 60 m3/h und 20 m/h?', '3 m2', ['Nutze A = Q : vF.', '60 : 20 = 3.', 'Die Einheit ist m2.', 'Ergebnis: 3 m2.']),
    ex('Wie hoch ist die Filtrationsgeschwindigkeit bei 90 m3/h und 3 m2?', '30 m/h', ['Nutze vF = Q : A.', '90 : 3 = 30.', 'Die Einheit ist m/h.', 'Ergebnis: 30 m/h.']),
    ex('Welche Filterflaeche braucht man bei 120 m3/h und 30 m/h?', '4 m2', ['A = Q : vF.', '120 : 30 = 4.', 'Die Einheit ist m2.', 'Ergebnis: 4 m2.']),
    ex('Wie hoch ist die Filtrationsgeschwindigkeit bei 80 m3/h und 4 m2?', '20 m/h', ['vF = Q : A.', '80 : 4 = 20.', 'Die Einheit ist m/h.', 'Ergebnis: 20 m/h.']),
    ex('Wie gross ist die Kreisflaeche eines Filters mit r = 1 m? Rechne mit 3,14.', '3,14 m2', ['Nutze A = pi x r x r.', 'A = 3,14 x 1 x 1.', 'Das ergibt 3,14.', 'Ergebnis: 3,14 m2.'])
  ],
  chlor: [
    ex('Wie viel Aktivchlor braucht man fuer 100 m3 bei +0,2 mg/L?', '20 g', ['Merke: 1 mg/L = 1 g pro m3.', '0,2 x 100 = 20.', 'Das ist die Aktivchlor-Menge.', 'Ergebnis: 20 g.']),
    ex('Wie viel Aktivchlor braucht man fuer 250 m3 bei +0,4 mg/L?', '100 g', ['1 mg/L entspricht 1 g/m3.', '0,4 x 250 = 100.', 'Das ist die Aktivchlor-Menge.', 'Ergebnis: 100 g.']),
    ex('Wie viel Aktivchlor braucht man fuer 400 m3 bei +0,5 mg/L?', '200 g', ['1 mg/L entspricht 1 g/m3.', '0,5 x 400 = 200.', 'Das ist die Aktivchlor-Menge.', 'Ergebnis: 200 g.']),
    ex('Wie viel 65-%-Produkt braucht man fuer 200 m3 bei +0,3 mg/L?', '92,3 g', ['Berechne zuerst das Aktivchlor: 0,3 x 200 = 60 g.', 'Teile dann durch den Wirkstoffanteil 0,65.', '60 : 0,65 = 92,3.', 'Ergebnis: 92,3 g Produkt.']),
    ex('Wie viel 50-%-Produkt braucht man fuer 450 m3 bei +0,2 mg/L?', '180 g', ['Berechne zuerst das Aktivchlor: 0,2 x 450 = 90 g.', 'Teile dann durch 0,50.', '90 : 0,50 = 180.', 'Ergebnis: 180 g Produkt.'])
  ],
  formelsammlung: [
    ex('Mischaufgabe: Wie gross ist A bei 8 m x 6 m?', '48 m2', ['Nutze A = a x b.', '8 x 6 = 48.', 'Die Einheit ist m2.', 'Ergebnis: 48 m2.']),
    ex('Mischaufgabe: Welche Filterflaeche braucht man bei 90 m3/h und 30 m/h?', '3 m2', ['Nutze A = Q : vF.', '90 : 30 = 3.', 'Die Einheit ist m2.', 'Ergebnis: 3 m2.']),
    ex('Mischaufgabe: Wie viel Energie braucht man fuer 20 m3 Wasser bei 3 K?', '69,6 kWh', ['Nutze Q = 1,16 x m3 x Delta T.', '1,16 x 20 x 3 = 69,6.', 'Die Einheit ist kWh.', 'Ergebnis: 69,6 kWh.']),
    ex('Mischaufgabe: Wie viel Aktivchlor braucht man fuer 300 m3 bei +0,4 mg/L?', '120 g', ['1 mg/L entspricht 1 g pro m3.', '0,4 x 300 = 120.', 'Das ist die Aktivchlor-Menge.', 'Ergebnis: 120 g.']),
    ex('Mischaufgabe: Wie gross ist die Geschwindigkeit bei 150 m in 100 s?', '1,5 m/s', ['Nutze v = s : t.', '150 : 100 = 1,5.', 'Die Einheit ist m/s.', 'Ergebnis: 1,5 m/s.'])
  ]
};
