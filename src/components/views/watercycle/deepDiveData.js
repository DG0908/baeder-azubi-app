// Deep dive content and labels for WaterCycleView.

export const DEEP_DIVE = {
  pumpe: {
    icon: '⚙️', subtitle: 'Kreiselpumpe · Radialläufer',
    kenndaten: [
      { label: 'Typ', value: 'Kreiselpumpe (Radialläufer)' },
      { label: 'Mindest-Umwälzung', value: '4× täglich (DIN 19643)' },
      { label: 'Saugseite', value: 'Schwallwasserbehälter → Pumpe' },
      { label: 'Druckseite', value: 'Pumpe → Flockung → Filter' },
    ],
    lernpunkte: [
      'Das Laufrad wandelt Drehbewegung in Strömungsenergie um',
      'Kavitation: Unterdruck → Dampfblasen → Materialschäden',
      'Bei Kavitation V3 (Entlüftung) öffnen',
      'Pumpenkurve: Q↑ = H↓ (mehr Durchfluss = weniger Druck)',
    ],
    pruefungsfrage: 'Was ist Kavitation und wie wird sie verhindert?',
    pruefungsantwort: 'Kavitation = Dampfblasenbildung durch Unterdruck auf der Saugseite. Vermeidung: Saugleitung dicht halten, Entlüftungsventil V3 öffnen, Saughöhe minimieren.',
  },
  filter: {
    icon: '🗂️', subtitle: 'Mehrschichtfilter · Druckfilter',
    kenndaten: [
      { label: 'Schichten (von oben)', value: 'Aktivkohle -> Quarzsand -> Stuetzkies' },
      { label: 'Filtrat ab', value: 'Partikel ≥ 0,1 µm' },
      { label: 'Rückspülung bei', value: 'dP > 0,5 bar oder nach 72 h' },
      { label: 'Rückspülwasser', value: 'Nicht zurück ins Becken!' },
    ],
    lernpunkte: [
      'Aktivkohle (oben): bindet organische Verbindungen und Chloramine',
      'Quarzsand (Mitte): Hauptfilterleistung fuer Feinstpartikel',
      'Stuetzkies (unten): Tragschicht und Lastverteilung ueber dem Duesenboden',
      'Rückspülung löst Schmutz → Kanal/Abwurf',
    ],
    pruefungsfrage: 'Ab welchem Differenzdruck muss rückgespült werden?',
    pruefungsantwort: 'Bei ΔP > 0,5 bar oder spätestens nach 72 h Betrieb. Rückspülwasser muss in den Kanal (nicht ins Becken) abgeleitet werden.',
  },
  desinfektion: {
    icon: '⚗️', subtitle: 'Chlorierung · DIN 19643',
    kenndaten: [
      { label: 'Freies Chlor Soll', value: '0,3 – 0,6 mg/L' },
      { label: 'Max. freies Chlor', value: '1,0 mg/L' },
      { label: 'Messmethode', value: 'DPD-Methode (täglich)' },
      { label: 'Optimal-pH', value: '7,0 – 7,4' },
    ],
    lernpunkte: [
      'HOCl (hypochlorige Säure) ist die wirksame Form',
      'pH 7,2 → ~65 % als HOCl; pH 8,0 → nur ~20 %',
      'Gebundenes Chlor (Chloramine) → Geruch + Reizung',
      'Stoßchlorierung: kurzzeitig bis 5 mg/L für Problemfälle',
    ],
    pruefungsfrage: 'Wie beeinflusst der pH-Wert die Chlorwirksamkeit?',
    pruefungsantwort: 'Je niedriger der pH, desto mehr HOCl (wirksam). Bei pH 7,2 ca. 65 % HOCl; bei pH 8,0 nur ~20 %. Deshalb Ziel-pH 7,0–7,4 einhalten.',
  },
  heizung: {
    icon: '🌡️', subtitle: 'Plattenwärmetauscher · Gegenstrom',
    kenndaten: [
      { label: 'Zieltemperatur', value: '26 – 28 °C (DIN 19643)' },
      { label: 'Prinzip', value: 'Gegenstrom-Wärmetauscher' },
      { label: 'Kreise', value: 'Primär (Fernwärme) | Sekundär (Bad)' },
      { label: 'Wartung', value: 'Antikalk-Behandlung nötig' },
    ],
    lernpunkte: [
      'Gegenstrom: heiß/kalt entgegengesetzt → max. Temperaturgefälle',
      'Beide Kreise hydraulisch getrennt (Hygiene)',
      'Kalkablagerungen → schlechterer Wärmeübergang',
      'Kinderbecken bis 32 °C; Schwimmerbecken 26–28 °C',
    ],
    pruefungsfrage: 'Warum ist das Gegenstrom-Prinzip effizienter als Gleichstrom?',
    pruefungsantwort: 'Beim Gegenstrom bleibt das Temperaturgefälle über die gesamte Länge konstant → maximale Wärmeübertragung. Bei Gleichstrom gleicht sich die Temperatur schnell an.',
  },
  schwall: {
    icon: '🏊', subtitle: 'Schwallwasserbehälter · Pufferspeicher',
    kenndaten: [
      { label: 'Mindestvolumen', value: '≥ 10 % Beckenvolumen' },
      { label: 'Zulauf', value: 'Überlaufrinne → Schwall' },
      { label: 'Ablauf', value: 'Schwall → Umwälzpumpe' },
      { label: 'Pegel steigt wenn', value: 'Viele Badegäste einsteigen' },
    ],
    lernpunkte: [
      'Badegäste verdrängen Wasser → Überlaufrinne → Schwall',
      'Puffer verhindert Absenkung des Beckenspiegels',
      'Schwallwasser = konzentrierteste Badewasserbelastung',
      'Pegel-Monitoring gibt Rückschluss auf Badegastzahlen',
    ],
    pruefungsfrage: 'Warum sinkt der Beckenwasserspiegel nicht wenn viele Badegäste einsteigen?',
    pruefungsantwort: 'Das verdrängte Wasser fließt über die Überlaufrinne in den Schwallwasserbehälter und wird gepuffert. Der Beckenpegel bleibt so stabil.',
  },
  flockung: {
    icon: '🧪', subtitle: 'Flockungsmittel-Dosierung · Koagulation',
    kenndaten: [
      { label: 'Mittel', value: 'Aluminiumsulfat / Polyelektrolyt' },
      { label: 'Dosierung', value: '0,1 – 0,3 mg/L Al' },
      { label: 'Zielgröße', value: 'Flocken ≥ 5 µm (filterbar)' },
      { label: 'pH-Optimum', value: '6,8 – 7,2' },
    ],
    lernpunkte: [
      'Mikropartikel < 0,1 µm sind zu klein für Sandfilter',
      'Flockungsmittel destabilisiert Partikelladungen → Zusammenballung',
      'Flocken wachsen zu > 5 µm → vom Filter abscheidbar',
      'Zu viel Flockungsmittel → Aluminium im Wasser (Grenzwert!)',
    ],
    pruefungsfrage: 'Welche Partikelgröße kann der Sandfilter ohne Flockung abscheiden?',
    pruefungsantwort: 'Nur Partikel ≥ 0,1 µm. Kleinere Partikel (Viren, Eiweiße) müssen durch Flockung zu größeren Aggregaten verbunden werden.',
  },
  becken: {
    icon: '🏊‍♂️', subtitle: 'Schwimmbecken · 3D-Interaktiv · DIN 19643',
    kenndaten: [
      { label: 'Turnover Schwimmer', value: 'max. 12 h (DIN 19643)' },
      { label: 'Turnover Lehrbecken', value: 'max. 4 h (DIN 19643)' },
      { label: 'Beckentiefe (Norm)', value: '≥ 1,80 m (DIN 18032)' },
      { label: 'Vertikaldurchströmung', value: 'Bodeneinströmung ↑ → Überlauf oben' },
      { label: 'Horizontaldurchströmung', value: 'Wandeinströmung → Querstrom → Ablauf' },
      { label: 'Bahnbreite 50m-Bahn', value: '2,5 m (FINA-Regeln)' },
    ],
    lernpunkte: [
      'Vertikaldurchströmung (Standard): Einströmdüsen im Boden → Wasser steigt gleichmäßig auf → Überlaufrinne oben → wenig Totzonen, hygienisch optimal',
      'Horizontaldurchströmung: Düsen in Seitenwand → Wasser strömt quer durch das Becken → Ablauf an Gegenseite → günstig für schmale/lange Becken',
      'Überlaufrinne nimmt das Oberflächenwasser ab (höchste Verunreinigung!)',
      'Turnover = Beckenvolumen [m³] ÷ Volumenstrom [m³/h] – je kleiner, desto besser',
      'Totzonen entstehen bei schlechter Düsenplatzierung → Keimgefahr, schlechte Chlorverteilung',
      'Restentleerung am tiefsten Punkt (Bodengefälle 1–2 % zum Ablauf), Entsorgung: Kanal',
      'Wendewandfliesen: Rutschhemmung R9, T-Markierung 2 m vor Wand, 1 m lang',
    ],
    pruefungsfrage: 'Wie wird die Turnover-Zeit berechnet und was ist der Grenzwert?',
    pruefungsantwort: 'Turnover [h] = Beckenvolumen [m³] ÷ Volumenstrom [m³/h]. Grenzwert: max. 12 h für Schwimmer-, max. 4 h für Lehr-/Kinderbecken (DIN 19643). Kleiner Turnover = häufigere Aufbereitung = besser.',
  },
  ueberlauf: {
    icon: '↩️', subtitle: 'Überlaufrinne · Rinnensysteme · DIN 19643',
    kenndaten: [
      { label: 'Funktion', value: 'Oberflächenwasser kontinuierlich abführen' },
      { label: 'Belastung', value: 'Höchste Verunreinigung (Öle, Schweiß, Cremes)' },
      { label: 'Lotrechte Beckenbegrenzung', value: 'Wiesbadener Rinne (2 Varianten)' },
      { label: 'Eingetauchte Beckenbegrenzung', value: 'St.-Moritz · Züricher · Finnische Rinne' },
      { label: 'Skimmer nur für', value: 'Kleinstbecken ≤ 60 m³' },
      { label: 'Norm', value: 'DIN 19643 / DIN EN 13451-2' },
    ],
    lernpunkte: [
      '📐 Lotrechte Beckenbegrenzung: Beckenwand endet senkrecht am Wasserspiegel',
      '① Tieflegende offene Wiesbadener Rinne: breite, tief liegende Rinne am Beckenrand – klassischer Hallenbad-Standard',
      '② Wiesbadener Rinne (Beckenumgangshöhe): Rinne auf Höhe des Umgangs, begehbar – typisch für Sportbäder',
      '📐 Eingetauchte Beckenbegrenzung: Beckenrand taucht leicht unter den Wasserspiegel',
      '③ St.-Moritz-Rinne: eingetauchter Rand mit seitlichem Überlaufschlitz – hygienisch, gleichmäßig',
      '④ Züricher Rinne: breiter eingetauchter Rand mit Überlaufkanal – Freizeit- und Hotelbäder',
      '⑤ Finnische Rinne (Spaltrinne): umlaufender Schlitz direkt am eingetauchten Rand – modern, sehr verbreitet',
      'Skimmer: nur für Kleinstbecken < 60 m³, kein vollständiger Umfangsüberlauf!',
      'Alle Rinnensysteme führen das höchstbelastete Oberflächenwasser (Öle, Schweiß) kontinuierlich ab',
    ],
    pruefungsfrage: 'Was ist der Unterschied zwischen lotrechter und eingetauchter Beckenbegrenzung? Welche Rinnensysteme gibt es?',
    pruefungsantwort: 'Lotrechte Beckenbegrenzung: Wand endet senkrecht am Wasserspiegel → Wiesbadener Rinne (tieflegend offen oder auf Beckenumgangshöhe). Eingetauchte Beckenbegrenzung: Rand taucht unter den Wasserspiegel → St.-Moritz-Rinne, Züricher Rinne, Finnische Rinne (Spaltrinne). Skimmer nur für Kleinstbecken < 60 m³.',
  },
  ruecklauf: {
    icon: '🔄', subtitle: 'Rücklauf · Einspeisung ins Becken',
    kenndaten: [
      { label: 'Einströmung', value: 'Boden-Einströmdüsen' },
      { label: 'Druck', value: '0,5 – 1,5 bar am Einlass' },
      { label: 'Chlorgehalt', value: 'Auf Sollwert eingestellt' },
      { label: 'Temperatur', value: 'Auf Zielwert geheizt' },
    ],
    lernpunkte: [
      'Nach Filter, Desinfektion, Heizung → zurück ins Becken',
      'Einströmdüsen am Boden → gleichmäßige Verteilung',
      'Gegenstrom zur Überlaufrichtung → optimale Durchmischung',
      'pH und Chlor müssen vor Einspeisung im Soll sein',
    ],
    pruefungsfrage: 'Was passiert wenn das Rücklaufwasser nicht korrekt aufbereitet ist?',
    pruefungsantwort: 'Unterchloriertes oder pH-falsches Wasser verletzt hygienische Grenzwerte → Badebetrieb muss eingestellt werden. Laut DIN 19643 täglich messen und dokumentieren.',
  },
};


// ─── Interactive 3D Pool Deep-Dive ─────────────────────────────────────────────
export const FILTER_REFERENCE_TABS = {
  materialien: [
    'Aktivkohle: Adsorption von organischen Spurenstoffen und Chloraminen',
    'Quarzsand: Hauptfilterstufe fuer Flocken und Schwebstoffe',
    'Stuetzkies: Tragschicht, Lastverteilung, Schutz des Duesenbodens',
    'Hydroanthrazit: in manchen Filtern als obere Leichtschicht statt Aktivkohle',
    'AFM/Glasgranulat: alternative Mehrschichtmedien mit geringer Biofilmbildung',
  ],
  filterarten: [
    'Mehrschicht-Druckfilter (am haeufigsten im Schwimmbadkreislauf)',
    'Einschicht-Sandfilter (kleinere Anlagen/Bestandsanlagen)',
    'Aktivkohlefilter als Zusatzstufe bei Geruchs-/THM-Themen',
    'Kerzen-/Patronenfilter eher in Nebenstrom oder kleinen Technikstrecken',
    'Ultrafiltration/Membranfiltration in Sonderanlagen oder hoher Hygienestufe',
  ],
};

export const DEEP_DIVE_MODEL_HEIGHT = 'clamp(360px, 64vh, 820px)';

export const BECKEN_HOTSPOT_DATA = {
  ueberlauf: {
    color: '#4a9eff', icon: '↩️', title: 'Überlaufrinne',
    items: [
      '📐 Spaltrinne: schmaler Schlitz rundum (häufigste Bauart)',
      '📐 Rostrinne: Rost über tiefer Rinne, begehbar (Sportbäder)',
      '📐 Schlitzrinne: diskrete Schlitze im Beckenrand',
      '📐 Liegende Rinne: vertikal für Hallenbäder',
      '⚡ Funktion: erfasst Oberflächenwasser (höchste Belastung)',
      '📏 Rinne läuft den gesamten Beckenumfang entlang',
      '🔬 Rinnenwasser enthält: Schweiß, Öle, Sonnencreme',
    ]
  },
  einstroemdüsen: {
    color: '#34c090', icon: '▲', title: 'Einströmdüsen',
    items: [
      '↕ Vertikaldurchströmung: Düsen im Boden, Wasser steigt auf',
      '↔ Horizontaldurchströmung: Düsen in Wänden, Querstrom',
      '💡 Gegenstromanlage: starker Strahl für Schwimmer',
      '📏 DIN 19643: Düsenabstand max. 2,5 m × 3,5 m',
      '🌊 Einströmgeschwindigkeit: 0,3 – 0,5 m/s',
      '🔵 Düsentypen: Deckelventil, Dübelventil, Körperdüse',
      '✅ Gleichmäßige Verteilung verhindert Totzonen',
    ]
  },
  wendewand: {
    color: '#ffaa40', icon: '🔲', title: 'Wendewandfliesen',
    items: [
      '🛡 Rutschhemmung: R9 nach DIN 51097 (Barfußbereich)',
      '🎨 Kontrastfarben: Orientierung + Kennzeichnung',
      '📏 T-Markierung: 2 m vor der Wand, 1 m breit',
      '🔢 Tiefenmarkierung: eingebrannte Zahlen in den Fliesen',
      '📐 Wendewandtiefe: ≥ 0,8 m für Wettkampf',
      '🏊 Ablaufblock-Sockel: rutschfeste Trittplatte',
      '📋 DIN 18032-3: Anforderungen an Sportbäder',
    ]
  },
  restentleerung: {
    color: '#d04040', icon: '⬇️', title: 'Restentleerung',
    items: [
      '📍 Lage: tiefster Punkt des Beckens (Bodengefälle 1–2 %)',
      '🔧 Nennweite: DN 100–150 je nach Beckenvolumen',
      '⏱ Entleerungszeit: < 6 h für Übungsbereich',
      '🚫 Entsorgung: Kanal (NICHT in Aufbereitungskreislauf)',
      '🔒 Absperrung: Schieber oder Kugelhahn außen',
      '🧹 Zweck: Reinigung, Inspektion, Reparatur',
      '🌀 Zuläufe werden vor Entleerung gesperrt',
    ]
  },
  bahnmarkierung: {
    color: '#a040d0', icon: '📏', title: 'Bahnmarkierung',
    items: [
      '📐 Sportstätte 50 m: 8 Bahnen × 2,5 m = 20 m breit',
      '📐 Sportstätte 25 m: 6–8 Bahnen × 2,5 m',
      '🔵 Mittellinie: 25 cm breit, dunkle Farbe, Beckenlänge',
      '🏁 T-Markierung: 2 m vor Wand, 1 m lang, quer',
      '🎯 Startblock-Abstand: 50 cm Mindestabstand',
      '🔴 Sportboje: ø 5 cm, alle 5 m entlang Seile',
      '📋 FINA-Regeln: rot = 1./8. Bahn, blau = 4./5. Bahn',
    ]
  },
};
