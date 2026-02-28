export const WATER_CYCLE_VIEWBOX = {
  width: 1280,
  height: 760
};

export const WATER_CYCLE_STATIONS = [
  {
    id: 'becken',
    title: 'Schwimmbecken',
    shortLabel: 'Becken',
    x: 180,
    y: 338,
    summary: 'Hier findet der Badebetrieb statt. Organik, Schmutz und Keime werden eingetragen.',
    functionPoints: [
      'Nutzwasser fuer Gaeste und Kurse.',
      'Hydraulik verteilt Reinwasser ueber Einstroemdsen.',
      'Ausgangspunkt fuer Oberflaechenabzug.'
    ],
    targetValues: [
      { label: 'Freies Chlor', value: '0.3 bis 0.6 mg/L' },
      { label: 'pH-Wert', value: '6.5 bis 7.6 (ideal etwa 7.2)' },
      { label: 'Temperatur', value: 'nutzungsabhaengig 24 bis 34 C' }
    ],
    faultSignals: [
      'Truebung, Geruch, Augenreizungen.',
      'Totzonen durch schwache Umwaelzung.',
      'Belastungsspitzen in Stoesszeiten.'
    ],
    practiceChecks: [
      'Sichttiefe und Oberflaeche regelmaessig pruefen.',
      'Messwerte im Betriebstagebuch festhalten.',
      'Auffaelligkeiten direkt an Technik melden.'
    ]
  },
  {
    id: 'ueberlauf',
    title: 'Ueberlaufrinne',
    shortLabel: 'Ueberlauf',
    x: 345,
    y: 248,
    summary: 'Nimmt Oberflaechenwasser auf und fuehrt es in den Schwallwasserbehaelter.',
    functionPoints: [
      'Entfernt Oberflaechenschmutz schnell.',
      'Stabilisiert den Wasserstand im Becken.',
      'Koppelt Badebetrieb mit der Aufbereitung.'
    ],
    targetValues: [
      { label: 'Rinnenstatus', value: 'frei von Ablagerungen' },
      { label: 'Wasserstand', value: 'stabil auf Sollniveau' },
      { label: 'Reinigungszyklus', value: 'nach Hygieneplan' }
    ],
    faultSignals: [
      'Verstopfungen und Biofilm.',
      'Ungleichmaessiger Abzug.',
      'Geruchsbildung in Rinnenbereichen.'
    ],
    practiceChecks: [
      'Rinne im Oeffnungsrundgang pruefen.',
      'Ablagerungen frueh entfernen.',
      'Auffaellige Gerueche dokumentieren.'
    ]
  },
  {
    id: 'schwall',
    title: 'Schwallwasserbehaelter',
    shortLabel: 'Speicher',
    x: 520,
    y: 218,
    summary: 'Pufferbehaelter fuer Ueberlaufwasser und Frischwasserzugabe.',
    functionPoints: [
      'Gleicht Lastschwankungen aus.',
      'Stellt sichere Ansaugung fuer Pumpen bereit.',
      'Mischpunkt fuer Ruecklauf- und Frischwasser.'
    ],
    targetValues: [
      { label: 'Fuellstand', value: 'innerhalb Betriebsfenster' },
      { label: 'Nachspeisung', value: 'regelkonform und nachvollziehbar' },
      { label: 'Hygiene', value: 'stagnationsarm und sauber' }
    ],
    faultSignals: [
      'Zu niedriger Fuellstand verursacht Luftzug.',
      'Stagnation beguenstigt Keimbildung.',
      'Schaum oder Geruch bei Ueberlastung.'
    ],
    practiceChecks: [
      'Fuellstand je Schicht kontrollieren.',
      'Nachspeisung mit Verbrauch plausibilisieren.',
      'Behälterreinigung termingerecht dokumentieren.'
    ]
  },
  {
    id: 'pumpe',
    title: 'Umwaelzpumpe mit Vorfilter',
    shortLabel: 'Pumpe',
    x: 532,
    y: 430,
    summary: 'Foerdert Wasser durch die gesamte Aufbereitung. Vorfilter schuetzt Laufrad und Anlage.',
    functionPoints: [
      'Erzeugt den Volumenstrom Q.',
      'Haupttreiber fuer hydraulische Versorgung.',
      'Vorfilter haelt grobe Partikel zurueck.'
    ],
    targetValues: [
      { label: 'Volumenstrom', value: 'entspricht Auslegung und Last' },
      { label: 'Betriebsdruck', value: 'stabil ohne starke Schwankung' },
      { label: 'Geraeuschbild', value: 'ruhig ohne Kavitation' }
    ],
    faultSignals: [
      'Luftblasen im Vorfilterdeckel.',
      'Unruhiger Lauf oder Schluerfgeraeusch.',
      'Abfallender Volumenstrom.'
    ],
    practiceChecks: [
      'Sichtpruefung Vorfilter auf Luft und Schmutz.',
      'Pumpenwerte mit Sollblatt vergleichen.',
      'Bei Auffaelligkeit Entlueftung und Dichtheit pruefen.'
    ]
  },
  {
    id: 'flockung',
    title: 'Flockungs-Impfstelle',
    shortLabel: 'Flockung',
    x: 690,
    y: 430,
    summary: 'Dosierpumpe impft Flockungsmittel vor die Filtration ein.',
    functionPoints: [
      'Bindet feinste Partikel zu filtrierbaren Flocken.',
      'Entlastet Filter und verbessert Wasserklarheit.',
      'Stabilisiert hygienische Wasserfuehrung.'
    ],
    targetValues: [
      { label: 'Dosierart', value: 'stetig und mengenproportional' },
      { label: 'Dosiermenge', value: 'gemass Betriebskonzept' },
      { label: 'Kontaktstrecke', value: 'ausreichend bis Filtereintritt' }
    ],
    faultSignals: [
      'Unterdosierung: Truebung steigt.',
      'Ueberdosierung: Filter belastet.',
      'Taktbetrieb statt gleichmaessiger Impfung.'
    ],
    practiceChecks: [
      'Kanisterstand und Dosierpumpe kontrollieren.',
      'Dosierwerte in Relation zum Durchfluss pruefen.',
      'Abweichungen direkt nachstellen und dokumentieren.'
    ]
  },
  {
    id: 'filter',
    title: 'Filterkessel mit Schauglas',
    shortLabel: 'Filter',
    x: 850,
    y: 430,
    summary: 'Entfernt gebundene Partikel aus dem Wasser. Rueckspuelung regeneriert das Filterbett.',
    functionPoints: [
      'Mechanische Abscheidung im Filtermedium.',
      'Differenzdruck zeigt Belastungszustand.',
      'Rueckspuelung transportiert Schmutz in den Kanal.'
    ],
    targetValues: [
      { label: 'Differenzdruck', value: 'im freigegebenen Sollfenster' },
      { label: 'Filterlaufzeit', value: 'nach Last und Anlagenplan' },
      { label: 'Rueckspuelkriterium', value: 'druck- und qualitaetsbasiert' }
    ],
    faultSignals: [
      'Steigender Differenzdruck.',
      'Truebes Schauglas oder schlechter Spuelabwurf.',
      'Leistungseinbruch bei verblocktem Bett.'
    ],
    practiceChecks: [
      'Differenzdruck trendbasiert auswerten.',
      'Rueckspuelung vollstaendig dokumentieren.',
      'Bei Auffaelligkeit Filtermedium mitpruefen.'
    ]
  },
  {
    id: 'desinfektion',
    title: 'Desinfektionsanlage',
    shortLabel: 'Desinfektion',
    x: 1020,
    y: 320,
    summary: 'Sorgt ueber Chlor-Dosierung fuer sichere Keimkontrolle im gesamten Kreislauf.',
    functionPoints: [
      'Baut Desinfektionsreserve im Reinwasser auf.',
      'Arbeitet im Verbund mit pH-Management.',
      'Reagiert auf Lastschwankungen im Badebetrieb.'
    ],
    targetValues: [
      { label: 'Freies Chlor', value: '0.3 bis 0.6 mg/L' },
      { label: 'Gebundenes Chlor', value: 'moeglichst niedrig halten' },
      { label: 'Regelverhalten', value: 'stabil ohne Ueberdosierung' }
    ],
    faultSignals: [
      'Zu niedrige Chlorreserve.',
      'Chloramine und Reizstoffbildung.',
      'Unruhige Nachregelung.'
    ],
    practiceChecks: [
      'Onlinewert mit Handmessung gegenpruefen.',
      'Dosierstrecke auf Leckagen pruefen.',
      'Stoerungen nach Ursache statt nur nach Wert beheben.'
    ]
  },
  {
    id: 'heizung',
    title: 'Waermetauscher',
    shortLabel: 'Heizung',
    x: 1020,
    y: 180,
    summary: 'Temperiert das aufbereitete Wasser auf den Becken-Sollwert.',
    functionPoints: [
      'Sichert Komforttemperatur je Beckenart.',
      'Beeinflusst Energiebedarf direkt.',
      'Wirkt auf Badegastkomfort und Betriebssicherheit.'
    ],
    targetValues: [
      { label: 'Sportbecken', value: 'typisch 26 bis 28 C' },
      { label: 'Lehrbecken', value: 'typisch 30 bis 34 C' },
      { label: 'Stabilitaet', value: 'moeglichst geringe Schwankungen' }
    ],
    faultSignals: [
      'Temperaturspruenge bei Regelproblemen.',
      'Zu hohe Ruecklauftemperaturen.',
      'Unverhaeltnismaessiger Energieeinsatz.'
    ],
    practiceChecks: [
      'Soll-Ist-Vergleich pro Becken fuehren.',
      'Lastzeiten mit Temperaturfuehrung abstimmen.',
      'Abweichungen zeitnah melden.'
    ]
  },
  {
    id: 'ruecklauf',
    title: 'Ruecklaufleitung',
    shortLabel: 'Ruecklauf',
    x: 760,
    y: 158,
    summary: 'Fuehrt Reinwasser aus Technik in das Becken zurueck und schliesst den Kreislauf.',
    functionPoints: [
      'Verteilung ueber Einstroemdsen.',
      'Hydraulische Gleichmaessigkeit im Becken.',
      'Sicherer Abschluss der Aufbereitungskette.'
    ],
    targetValues: [
      { label: 'Stroemungsbild', value: 'gleichmaessig ohne Totzonen' },
      { label: 'Leitungszustand', value: 'frei von Stoerstellen' },
      { label: 'Verteilung', value: 'zur Beckenhydraulik passend' }
    ],
    faultSignals: [
      'Ungleichmaessige Stroemung.',
      'Luft in Ruecklaufleitungen.',
      'Druckverluste durch Teilverblockung.'
    ],
    practiceChecks: [
      'Oberflaechenbewegung regelmaessig beobachten.',
      'Hydraulik nach Umbauten neu validieren.',
      'Rueckmeldungen aus Aufsicht und Technik abgleichen.'
    ]
  }
];

export const WATER_CYCLE_STATION_ORDER = WATER_CYCLE_STATIONS.map((station) => station.id);

export const WATER_CYCLE_PIPES = [
  {
    id: 'becken-ueberlauf',
    from: 'becken',
    to: 'ueberlauf',
    path: 'M 282 300 C 306 284 324 264 340 250',
    mode: 'normal'
  },
  {
    id: 'ueberlauf-schwall',
    from: 'ueberlauf',
    to: 'schwall',
    path: 'M 360 248 C 415 238 462 228 500 222',
    mode: 'normal'
  },
  {
    id: 'schwall-pumpe',
    from: 'schwall',
    to: 'pumpe',
    path: 'M 520 252 L 520 382',
    mode: 'normal'
  },
  {
    id: 'pumpe-flockung',
    from: 'pumpe',
    to: 'flockung',
    path: 'M 560 430 L 664 430',
    mode: 'normal'
  },
  {
    id: 'flockung-filter',
    from: 'flockung',
    to: 'filter',
    path: 'M 714 430 L 820 430',
    mode: 'normal',
    reversibleInBackwash: true
  },
  {
    id: 'filter-desinfektion',
    from: 'filter',
    to: 'desinfektion',
    path: 'M 880 410 C 930 380 972 346 1000 330',
    mode: 'normal',
    reversibleInBackwash: true
  },
  {
    id: 'desinfektion-heizung',
    from: 'desinfektion',
    to: 'heizung',
    path: 'M 1020 292 L 1020 210',
    mode: 'normal'
  },
  {
    id: 'heizung-ruecklauf',
    from: 'heizung',
    to: 'ruecklauf',
    path: 'M 996 180 C 930 160 846 152 782 156',
    mode: 'normal'
  },
  {
    id: 'ruecklauf-becken',
    from: 'ruecklauf',
    to: 'becken',
    path: 'M 740 156 C 602 168 454 204 302 286',
    mode: 'normal'
  },
  {
    id: 'filter-kanal',
    from: 'filter',
    to: 'kanal',
    path: 'M 850 468 L 850 560 C 850 598 912 620 982 620',
    mode: 'backwash'
  }
];

export const WATER_CYCLE_DEFAULT_CONTROLS = {
  pumpEnabled: true,
  pumpPower: 72,
  rawValveOpen: true,
  returnValveOpen: true,
  ventValveOpen: false,
  backwashValveOpen: false,
  backwashMode: false,
  disinfectPumpEnabled: true,
  disinfectSetpoint: 7,
  phTrim: 0,
  heatExchangerPower: 55
};

export const WATER_CYCLE_PROFI_SPICKZETTEL = [
  {
    title: 'DIN 19643 Kernbereiche',
    items: [
      'Freies Chlor im Badebetrieb typischerweise 0.3 bis 0.6 mg/L.',
      'pH-Wert im Bereich 6.5 bis 7.6, praxisnah meist um 7.2.',
      'Wasser muss klar, geruchlich unauffaellig und hygienisch sicher sein.'
    ]
  },
  {
    title: 'Betriebskontrolle',
    items: [
      'Chlor und pH waehrend des Badebetriebs regelmaessig pruefen.',
      'Differenzdruck und Filterlaufzeiten trendbasiert bewerten.',
      'Abweichungen immer mit Ursache und Massnahme dokumentieren.'
    ]
  },
  {
    title: 'Rueckspuelung',
    items: [
      'Rueckspuelung nach Druckanstieg oder Qualitaetsanzeichen ausloesen.',
      'Spuelrichtung gegen Betriebsrichtung, mit klarem Schmutzaustrag.',
      'Nachspuelen und Rueckkehr in Normalbetrieb sauber absichern.'
    ]
  }
];

export const WATER_CYCLE_FUTURE_MODULES = [
  { id: 'chlorgasraum', label: 'Chlorgasraum + PSA-Training', status: 'geplant' },
  { id: 'wirtschaft', label: 'Energie- und Kostenanalyse', status: 'geplant' },
  { id: 'stoerfall', label: 'Stoerfall-Simulator Technikraum', status: 'geplant' }
];
