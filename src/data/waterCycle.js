export const WATER_CYCLE_STATION_ORDER = [
  'becken',
  'ueberlauf',
  'schwall',
  'pumpe',
  'flockung',
  'filter',
  'desinfektion',
  'heizung',
  'ruecklauf'
];

export const WATER_CYCLE_FLOW = [
  ...WATER_CYCLE_STATION_ORDER,
  'becken'
];

export const WATER_CYCLE_STATIONS = [
  {
    id: 'becken',
    title: 'Becken',
    shortLabel: 'Badebetrieb',
    icon: 'B',
    x: 120,
    y: 340,
    summary: 'Hier landet das aufbereitete Wasser. Badegaeste tragen Waerme, Schmutz und Keime ein.',
    functionPoints: [
      'Nutzung durch Gaeste und Kurse.',
      'Hydraulik verteilt Frisch- und Reinwasser ueber Einstroemdsen.',
      'Aufsicht und Wasserbeobachtung greifen hier direkt.'
    ],
    targetValues: [
      { label: 'Freies Chlor', value: '0.3 bis 0.6 mg/L' },
      { label: 'pH-Wert', value: '6.5 bis 7.6 (praxisnah 7.2)' },
      { label: 'Wassertemperatur', value: 'beckenabhaengig 24 bis 34 C' }
    ],
    faultSignals: [
      'Truebung, Geruch, Augenreizungen.',
      'Hohe Lastspitzen bei Stoesszeiten.',
      'Hydraulische Totzonen bei schlechter Durchstroemung.'
    ],
    practiceChecks: [
      'Sichttiefe, Wasseroberflaeche und Ueberlaufrinne beobachten.',
      'Messwerte und Uhrzeiten dokumentieren.',
      'Bei Auffaelligkeit Sofortmassnahmen mit Technik abstimmen.'
    ]
  },
  {
    id: 'ueberlauf',
    title: 'Ueberlaufrinne',
    shortLabel: 'Oberflaechenabzug',
    icon: 'R',
    x: 260,
    y: 210,
    summary: 'Verdrangungs- und Schwallwasser wird an der Beckenoberflaeche abgefuehrt.',
    functionPoints: [
      'Entfernt Oberflaechenschmutz schnell aus dem Badebereich.',
      'Fuehrt Wasser in Richtung Schwallwasserbehaelter.',
      'Stabilisiert den Wasserstand im Becken.'
    ],
    targetValues: [
      { label: 'Rinnenfunktion', value: 'durchgaengig frei und sauber' },
      { label: 'Wasserstand', value: 'konstant auf Betriebsniveau' },
      { label: 'Reinigung', value: 'regelmaessig nach Plan' }
    ],
    faultSignals: [
      'Verstopfungen durch Laub, Pflasterreste oder Schmutz.',
      'Geruch und Biofilm in schlecht gereinigten Bereichen.',
      'Ungleichmaessiger Abzug bei hydraulischen Problemen.'
    ],
    practiceChecks: [
      'Rinne im Oeffnungs- und Schliessrundgang kontrollieren.',
      'Ablagerungen frueh entfernen.',
      'Auffaellige Stellen sofort im Betriebstagebuch vermerken.'
    ]
  },
  {
    id: 'schwall',
    title: 'Schwallwasserbehaelter',
    shortLabel: 'Wasserspeicher',
    icon: 'S',
    x: 420,
    y: 210,
    summary: 'Zwischenspeicher fuer Ueberlaufwasser und Frischwasserzugabe vor der Aufbereitung.',
    functionPoints: [
      'Puffert Lastschwankungen im Badebetrieb.',
      'Sichert konstante Ansaugbedingungen fuer Pumpen.',
      'Mischpunkt fuer Beckenruecklauf und Frischwasser.'
    ],
    targetValues: [
      { label: 'Fuellstand', value: 'im freigegebenen Betriebsband' },
      { label: 'Frischwasser', value: 'nach Bedarf und Vorschrift nachspeisen' },
      { label: 'Hygiene', value: 'totraumarme und saubere Betriebsweise' }
    ],
    faultSignals: [
      'Zu niedriger Fuellstand fuehrt zu Pumpenproblemen.',
      'Stagnation beguenstigt Keimwachstum.',
      'Schaumbildung oder Geruch zeigt Belastungen an.'
    ],
    practiceChecks: [
      'Fuellstand und Nachspeisung je Schicht pruefen.',
      'Reinigungsintervall einhalten und dokumentieren.',
      'Bei Stoerungen sofort Technikdienst informieren.'
    ]
  },
  {
    id: 'pumpe',
    title: 'Umwaelzpumpe',
    shortLabel: 'Foerderung',
    icon: 'P',
    x: 560,
    y: 340,
    summary: 'Transportiert Wasser aus dem Schwallwasserbehaelter durch die Aufbereitung.',
    functionPoints: [
      'Liefert den benoetigten Volumenstrom fuer den gesamten Kreislauf.',
      'Bestimmt mit der Hydraulik die Umwaelzleistung.',
      'Sichert die Verteilung auf Aufbereitungsstufen.'
    ],
    targetValues: [
      { label: 'Volumenstrom Q', value: 'gemass Anlagenauslegung' },
      { label: 'Betriebsdruck', value: 'innerhalb Sollfenster' },
      { label: 'Betriebsgeraeusch', value: 'ruhig ohne Kavitation' }
    ],
    faultSignals: [
      'Druckschwankungen oder Abfall im Durchfluss.',
      'Ungewoehnliche Geraeusche deuten auf Luft oder Lagerprobleme.',
      'Hoher Energiebedarf bei verstopften Leitungen oder Filtern.'
    ],
    practiceChecks: [
      'Pumpenwerte mit Sollwertblatt vergleichen.',
      'Leckagen und Dichtungen visuell kontrollieren.',
      'Abweichungen sofort protokollieren.'
    ]
  },
  {
    id: 'flockung',
    title: 'Flockung',
    shortLabel: 'Partikelbindung',
    icon: 'F',
    x: 700,
    y: 480,
    summary: 'Flockungsmittel bindet feinste Stoffe, damit der Filter sie sicher entfernen kann.',
    functionPoints: [
      'Verbessert Filtration durch Bildung groesserer Flocken.',
      'Reduziert truebungsaktive Kleinstpartikel.',
      'Unterstuetzt hygienisch stabile Wasserqualitaet.'
    ],
    targetValues: [
      { label: 'Dosierung', value: 'stetig und mengenproportional' },
      { label: 'Mischung', value: 'ausreichende Reaktionsstrecke' },
      { label: 'pH-Umfeld', value: 'im wirksamen Bereich halten' }
    ],
    faultSignals: [
      'Unterdosierung fuehrt zu Truebung.',
      'Ueberdosierung belastet Filter und Wasseroptik.',
      'Unruhiger Betrieb bei fehlender Dosierkontinuitaet.'
    ],
    practiceChecks: [
      'Vorrat, Pumpe und Leitungen taeglich kontrollieren.',
      'Dosiermenge mit Betriebsdaten plausibilisieren.',
      'Bei Wasserbild-Auffaelligkeiten zuerst Flockung mitpruefen.'
    ]
  },
  {
    id: 'filter',
    title: 'Filterstufe',
    shortLabel: 'Abscheidung',
    icon: 'Fi',
    x: 860,
    y: 480,
    summary: 'Entfernt suspendierte Stoffe und transportiert sie ueber Rueckspuelung aus dem System.',
    functionPoints: [
      'Mechanische Trennung von Partikeln aus dem Wasser.',
      'Unterstuetzt Keimkontrolle durch Lastreduktion.',
      'Rueckspuelung stellt Filterleistung wieder her.'
    ],
    targetValues: [
      { label: 'Differenzdruck', value: 'im freigegebenen Bereich' },
      { label: 'Filterlaufzeit', value: 'gemaess Betriebsplan' },
      { label: 'Rueckspuelung', value: 'bedarfsgerecht und dokumentiert' }
    ],
    faultSignals: [
      'Steigender Differenzdruck zeigt Belastung oder Verblockung.',
      'Zu lange Laufzeiten verschlechtern Wasserqualitaet.',
      'Unklare Rueckspuelung kann Filterbett schaedigen.'
    ],
    practiceChecks: [
      'Druckwerte trendbasiert ueberwachen.',
      'Rueckspuelprotokolle konsequent fuehren.',
      'Bei Leistungseinbruch sofort Stoerungsanalyse starten.'
    ]
  },
  {
    id: 'desinfektion',
    title: 'Desinfektion',
    shortLabel: 'Keimkontrolle',
    icon: 'D',
    x: 1000,
    y: 340,
    summary: 'Desinfektionsmittel wie Chlor inaktivieren Keime kontinuierlich im Kreislauf.',
    functionPoints: [
      'Sichert mikrobiologische Unbedenklichkeit des Beckenwassers.',
      'Wirkt zusammen mit pH-Steuerung und Redoxfuehrung.',
      'Muss bedarfsgerecht und stabil geregelt sein.'
    ],
    targetValues: [
      { label: 'Freies Chlor', value: '0.3 bis 0.6 mg/L (betrieblich)' },
      { label: 'Gebundenes Chlor', value: 'moeglichst niedrig halten' },
      { label: 'Redox', value: 'anlagen- und verfahrensspezifisch' }
    ],
    faultSignals: [
      'Zu niedrige Werte verschlechtern Desinfektionsreserve.',
      'Zu hohe Werte belasten Komfort und Material.',
      'Steigende Chloramine zeigen hohe Belastung oder Regelprobleme.'
    ],
    practiceChecks: [
      'Onlinewerte mit Handmessung verifizieren.',
      'Dosierbehaelter, Leitungen und Sicherheitseinrichtungen pruefen.',
      'Abweichungen mit pH und Belastung gemeinsam bewerten.'
    ]
  },
  {
    id: 'heizung',
    title: 'Waermetauscher',
    shortLabel: 'Temperaturfuehrung',
    icon: 'H',
    x: 860,
    y: 200,
    summary: 'Bringt das aufbereitete Wasser auf die erforderliche Becken-Solltemperatur.',
    functionPoints: [
      'Stellt nutzungsabhaengige Komforttemperaturen sicher.',
      'Arbeitet mit Energieeffizienz und Lastmanagement zusammen.',
      'Beeinflusst indirekt Wasserchemie und Badegastkomfort.'
    ],
    targetValues: [
      { label: 'Temperaturdifferenz', value: 'stabil ohne Spruenge' },
      { label: 'Sollwert Sportbecken', value: 'haeufig 26 bis 28 C' },
      { label: 'Sollwert Lernbecken', value: 'haeufig 30 bis 34 C' }
    ],
    faultSignals: [
      'Zu kaltes Wasser fuehrt zu Komfortbeschwerden.',
      'Zu warmes Wasser erhoeht Belastung und Energiebedarf.',
      'Schwankungen deuten auf Regelungsprobleme hin.'
    ],
    practiceChecks: [
      'Soll-Ist-Temperaturen je Becken vergleichen.',
      'Waermetauscher auf Plausibilitaet und Leistung pruefen.',
      'Auffaellige Energiespitzen mit Technik klaeren.'
    ]
  },
  {
    id: 'ruecklauf',
    title: 'Ruecklaufleitung',
    shortLabel: 'Reinwasser zurueck',
    icon: 'RL',
    x: 640,
    y: 160,
    summary: 'Fuehrt desinfiziertes und temperiertes Wasser wieder ins Becken ein.',
    functionPoints: [
      'Verteilt Reinwasser ueber Einstroemdsen im Becken.',
      'Schliesst den Kreislauf fuer kontinuierliche Aufbereitung.',
      'Beeinflusst hydraulische Gleichmaessigkeit stark.'
    ],
    targetValues: [
      { label: 'Einstroembild', value: 'gleichmaessig ohne Totzonen' },
      { label: 'Durchsatz', value: 'konstant gemaess Betriebszustand' },
      { label: 'Anlagensauberkeit', value: 'Ablagerungen vermeiden' }
    ],
    faultSignals: [
      'Ungleichmaessige Stroemung verschlechtert Aufbereitung.',
      'Luft in Leitungen stoert Verteilung.',
      'Teilweise verengte Leitungen senken Volumenstrom.'
    ],
    practiceChecks: [
      'Stroemungsbild und Oberflaechenbewegung beobachten.',
      'Hydraulik bei Umbauten oder Stoerungen neu bewerten.',
      'Rueckmeldungen aus Aufsicht und Technik zusammenfuehren.'
    ]
  }
];
