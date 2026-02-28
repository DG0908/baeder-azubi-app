export const WATER_CYCLE_MISSIONS = [
  {
    id: 'luft-im-system',
    title: 'Mission 1: Luft im System',
    level: 'Basis',
    symptom: {
      title: 'Pumpe zieht Luft',
      description: 'Im Vorfilter sind Luftblasen sichtbar und an der Pumpe ist ein Schluerfgeraeusch zu hoeren.',
      visualFlags: ['pumpBubbles'],
      audio: 'bubble'
    },
    targetAction: 'Entlueftungsventil oeffnen und stabilen Volumenstrom herstellen.',
    solveWhen: {
      all: [
        { source: 'control', key: 'pumpEnabled', equals: true },
        { source: 'control', key: 'ventValveOpen', equals: true },
        { source: 'metric', key: 'flowRate', min: 120 }
      ]
    },
    successFeedback: 'Luft wurde abgefuehrt. Die Pumpe laeuft wieder stabil.'
  },
  {
    id: 'filter-rueckspuelung',
    title: 'Mission 2: Filter rueckspuelen',
    level: 'Fortgeschritten',
    symptom: {
      title: 'Filter stark belastet',
      description: 'Differenzdruck steigt, das Schauglas wirkt trueb. Rueckspuelung ist faellig.',
      visualFlags: ['filterTurbidity'],
      audio: 'warning'
    },
    targetAction: 'Rueckspuelmodus starten, Rueckspuelventil oeffnen und Rueckspuelung bis 100 Prozent durchlaufen lassen.',
    solveWhen: {
      all: [
        { source: 'control', key: 'pumpEnabled', equals: true },
        { source: 'control', key: 'backwashMode', equals: true },
        { source: 'control', key: 'backwashValveOpen', equals: true },
        { source: 'metric', key: 'backwashProgress', min: 100 }
      ]
    },
    successFeedback: 'Rueckspuelung abgeschlossen. Das Filterbett ist regeneriert.'
  },
  {
    id: 'chlorunterdosierung',
    title: 'Mission 3: Desinfektion stabilisieren',
    level: 'Profi',
    symptom: {
      title: 'Zu niedriger Chlorwert',
      description: 'Die Chlorreserve faellt unter den Sollbereich. Keimsicherheit ist gefaehrdet.',
      visualFlags: ['lowChlorine'],
      audio: 'warning'
    },
    targetAction: 'Desinfektionspumpe aktivieren und Sollwert so anheben, dass freies Chlor mindestens 0.3 mg/L erreicht.',
    solveWhen: {
      all: [
        { source: 'control', key: 'disinfectPumpEnabled', equals: true },
        { source: 'metric', key: 'freeChlorine', min: 0.3 }
      ]
    },
    successFeedback: 'Desinfektion wieder im sicheren Arbeitsbereich.'
  }
];
