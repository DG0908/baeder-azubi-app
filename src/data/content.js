export const DID_YOU_KNOW_FACTS = [
  "\u{1F4A7} Ein Schwimmbecken verliert t\u00e4glich ca. 3-5 mm Wasser durch Verdunstung.",
  "\u{1F321}\uFE0F Die optimale Wassertemperatur f\u00fcr ein Sportbecken liegt bei 26-28\u00b0C.",
  "\u2697\uFE0F 1 mg/l freies Chlor entspricht etwa 1 ppm (parts per million).",
  "\u{1F3CA} Ein Erwachsener verdr\u00e4ngt beim Schwimmen ca. 70-80 Liter Wasser.",
  "\u{1F4A6} Pro Badegast rechnet man mit ca. 30 Litern Frischwasserbedarf pro Tag.",
  "\u{1F52C} Der pH-Wert des Wassers beeinflusst die Desinfektionswirkung von Chlor erheblich.",
  "\u{1F30A} Die Umw\u00e4lzrate gibt an, wie oft das gesamte Beckenwasser pro Tag gefiltert wird.",
  "\u{1F9EA} Gebundenes Chlor (Chloramine) verursacht den typischen 'Schwimmbad-Geruch'.",
  "\u23F1\uFE0F Die ideale Umw\u00e4lzzeit f\u00fcr ein Schwimmbecken betr\u00e4gt 4-6 Stunden.",
  "\u{1F3D7}\uFE0F Edelstahlbecken sind hygienischer als geflieste Becken, da es keine Fugen gibt."
];

export const DAILY_WISDOM = [
  // Hauptst\u00e4dte & Geographie
  "Die Hauptstadt von Australien ist Canberra, nicht Sydney.",
  "Die Hauptstadt von Kanada ist Ottawa, nicht Toronto.",
  "Die Hauptstadt der Schweiz ist Bern.",
  "Der l\u00e4ngste Fluss der Welt ist der Nil mit ca. 6.650 km.",
  "Der Mount Everest ist 8.849 Meter hoch - der h\u00f6chste Berg der Erde.",
  "Russland erstreckt sich \u00fcber 11 Zeitzonen.",
  "Monaco ist mit 2 km\u00b2 das zweitkleinste Land der Welt.",
  "Die Sahara ist etwa so gro\u00df wie die gesamte USA.",
  "Island liegt auf der Grenze zweier tektonischer Platten.",
  "Der Marianengraben ist mit 11.034 m die tiefste Stelle der Ozeane.",

  // Geschichte
  "Die Berliner Mauer fiel am 9. November 1989.",
  "Die erste Mondlandung war am 20. Juli 1969.",
  "Das R\u00f6mische Reich existierte \u00fcber 1.000 Jahre.",
  "Die Franz\u00f6sische Revolution begann 1789.",
  "Der Zweite Weltkrieg endete 1945.",
  "Die Chinesische Mauer ist \u00fcber 21.000 km lang.",
  "Die Pyramiden von Gizeh sind etwa 4.500 Jahre alt.",
  "Das erste gedruckte Buch war die Gutenberg-Bibel um 1455.",
  "Die Titanic sank am 15. April 1912.",
  "Das Kolosseum in Rom fasste ca. 50.000 Zuschauer.",

  // Wissenschaft & Natur
  "Licht braucht 8 Minuten von der Sonne zur Erde.",
  "Der menschliche K\u00f6rper besteht zu etwa 60% aus Wasser.",
  "Ein Blitz kann bis zu 30.000\u00b0C hei\u00df werden.",
  "Honig kann nicht schlecht werden - auch nach 3.000 Jahren nicht.",
  "Oktopusse haben drei Herzen und blaues Blut.",
  "Die Erde dreht sich mit etwa 1.670 km/h am \u00c4quator.",
  "Ein Tag auf der Venus dauert l\u00e4nger als ein Jahr auf der Venus.",
  "Wasser ist die einzige Substanz, die in allen drei Aggregatzust\u00e4nden nat\u00fcrlich vorkommt.",
  "Das menschliche Gehirn verbraucht etwa 20% unserer Energie.",
  "Diamanten bestehen nur aus Kohlenstoff - wie Bleistiftminen.",

  // Schwimmbad-Insider
  "Das erste \u00f6ffentliche Hallenbad Deutschlands er\u00f6ffnete 1855 in Berlin.",
  "Ein olympisches Schwimmbecken fasst 2,5 Millionen Liter Wasser.",
  "Die optimale Luftfeuchtigkeit im Hallenbad liegt bei 50-60%.",
  "Schwimmen verbrennt etwa 500 Kalorien pro Stunde.",
  "Der Weltrekord im 50m-Freistil liegt bei unter 21 Sekunden.",
  "Chlor wurde erstmals 1774 entdeckt.",
  "Die Wassertemperatur bei Olympischen Spielen muss zwischen 25-28\u00b0C liegen.",
  "Pro Badegast gelangen ca. 0,5-1 Liter Wasser durch Anhaftung aus dem Becken.",
  "Der typische Chlorgeruch entsteht erst durch die Reaktion mit Verunreinigungen.",
  "Deutschland hat \u00fcber 6.000 \u00f6ffentliche Schwimmb\u00e4der.",

  // Allgemeinwissen
  "Die menschliche Nase kann \u00fcber 1 Billion Ger\u00fcche unterscheiden.",
  "Venedig wurde auf 118 kleinen Inseln erbaut.",
  "Ein Faultier bewegt sich mit maximal 0,27 km/h fort.",
  "Die Stradivari-Geigen sind so wertvoll wegen des speziellen Holzes und Lacks.",
  "Der Eiffelturm w\u00e4chst im Sommer durch die Hitze um ca. 15 cm.",
  "Bananen sind botanisch gesehen Beeren, Erdbeeren nicht.",
  "Ein Kolibri kann r\u00fcckw\u00e4rts fliegen - als einziger Vogel.",
  "Die Zugspitze ist mit 2.962 m der h\u00f6chste Berg Deutschlands.",
  "Es gibt mehr Sterne im Universum als Sandk\u00f6rner auf der Erde.",
  "Der k\u00fcrzeste Krieg der Geschichte dauerte nur 38 Minuten (England vs. Sansibar, 1896)."
];

export const SAFETY_SCENARIOS = [
  {
    title: "Stromausfall im Hallenbad",
    problem: "Pl\u00f6tzlicher Stromausfall w\u00e4hrend des Badebetriebs",
    solution: "1. Ruhe bewahren und Badeg\u00e4ste beruhigen\n2. Notbeleuchtung aktivieren\n3. Becken r\u00e4umen (Gefahr durch fehlende Filterung)\n4. Hauptschalter kontrollieren\n5. Bei l\u00e4ngerem Ausfall: Bad schlie\u00dfen",
    priority: "high"
  },
  {
    title: "Chlorgasaustritt",
    problem: "Geruch nach Chlorgas im Technikraum",
    solution: "1. SOFORT Raum verlassen und T\u00fcr schlie\u00dfen\n2. Feuerwehr alarmieren (112)\n3. Badeg\u00e4ste evakuieren\n4. Bel\u00fcftung einschalten (falls gefahrlos m\u00f6glich)\n5. Nie ohne Atemschutz betreten!",
    priority: "critical"
  },
  {
    title: "Tr\u00fcbes Wasser",
    problem: "Wasser wird pl\u00f6tzlich milchig-tr\u00fcb",
    solution: "1. Becken sofort sperren\n2. Filteranlage \u00fcberpr\u00fcfen (l\u00e4uft sie?)\n3. Wasserwerte messen (pH, Chlor)\n4. R\u00fccksp\u00fclung durchf\u00fchren\n5. Flockungsmittel dosieren\n6. Erst nach Kl\u00e4rung wieder freigeben",
    priority: "medium"
  },
  {
    title: "\u00dcberdosierung Chemikalien",
    problem: "Zu viel Chlor/pH-Mittel zugegeben",
    solution: "1. Becken sperren\n2. Werte messen und dokumentieren\n3. Bei Chlor >3 mg/l: Frischwasser zugeben\n4. Umw\u00e4lzung auf Maximum\n5. Regelm\u00e4\u00dfig nachmessen\n6. Erst bei Normwerten freigeben",
    priority: "high"
  },
  {
    title: "Filteranlage defekt",
    problem: "Pumpe l\u00e4uft nicht / kein Druck",
    solution: "1. Becken sperren\n2. Hauptschalter Filter aus\n3. Vorfilter auf Verstopfung pr\u00fcfen\n4. Dichtungen kontrollieren\n5. Techniker rufen\n6. Alternative Filterung organisieren",
    priority: "high"
  }
];

export const WORK_SAFETY_TOPICS = [
  {
    category: "Pers\u00f6nliche Schutzausr\u00fcstung (PSA)",
    icon: "\u{1F9BA}",
    items: [
      "Schutzbrille beim Umgang mit Chemikalien (Pflicht!)",
      "Chemikalienschutzhandschuhe bei Chlor/S\u00e4ure-Handling",
      "Sicherheitsschuhe im Technikbereich",
      "Geh\u00f6rschutz bei lauten Pumpen/Aggregaten",
      "Warnweste bei Arbeiten im Au\u00dfenbereich"
    ]
  },
  {
    category: "Gefahrstoffe",
    icon: "\u26A0\uFE0F",
    items: [
      "Chlorgas ist hochgiftig - Feuerwehr bei Austritt!",
      "S\u00e4uren und Laugen NIEMALS mischen",
      "Chemikalien immer beschriften und verschlossen lagern",
      "Sicherheitsdatenbl\u00e4tter griffbereit halten",
      "Augendusche und Notdusche regelm\u00e4\u00dfig pr\u00fcfen"
    ]
  },
  {
    category: "Elektrische Sicherheit",
    icon: "\u26A1",
    items: [
      "FI-Schutzschalter monatlich testen",
      "Elektrische Ger\u00e4te nicht im Nassbereich verwenden",
      "Defekte Ger\u00e4te sofort au\u00dfer Betrieb nehmen",
      "Nur geschultes Personal an Elektrik arbeiten lassen",
      "Pr\u00fcfprotokolle f\u00fchren (DGUV V3)"
    ]
  },
  {
    category: "Rutschgefahr & Stolperfallen",
    icon: "\u26A0\uFE0F",
    items: [
      "Nasse Bereiche sofort kennzeichnen/absperren",
      "Rutschhemmende Fliesen im Nassbereich (R10-R13)",
      "Barfu\u00dfbereiche frei von Hindernissen halten",
      "Regelm\u00e4\u00dfige Reinigung gegen Biofilm",
      "Stolperstellen (Kabel, Schwellen) markieren"
    ]
  },
  {
    category: "Erste Hilfe",
    icon: "\u{1F691}",
    items: [
      "Ersthelfer-Ausbildung alle 2 Jahre auffrischen",
      "Erste-Hilfe-Kasten monatlich auf Vollst\u00e4ndigkeit pr\u00fcfen",
      "Notrufnummern gut sichtbar aush\u00e4ngen",
      "AED (Defibrillator) einsatzbereit halten",
      "Unfallmeldebuch f\u00fchren"
    ]
  }
];
