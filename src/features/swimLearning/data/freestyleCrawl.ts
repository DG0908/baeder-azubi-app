import type { SwimStyleData } from '../types';

export const freestyleCrawlStyle: SwimStyleData = {
  id: 'freestyle/crawl',
  name: 'Kraulschwimmen',
  subtitle: 'Technikmodul mit Hotspots, Phasenmodus und konfigurierbarer Animation',
  phases: [
    {
      id: 'strecklage',
      label: 'Phase 1: Strecklage',
      description: 'Ein Arm liegt lang vorne, der andere beendet den Druck bis zur Huefte.',
      t: 0
    },
    {
      id: 'wasserfassen',
      label: 'Phase 2: Wasserfassen',
      description: 'Der Vorderarm stellt Wasser an, der Ellbogen bleibt gefuehrt.',
      t: 0.25
    },
    {
      id: 'druckphase',
      label: 'Phase 3: Druckphase',
      description: 'Der Zug endet mit Druck nach hinten bis zum Oberschenkel.',
      t: 0.5
    },
    {
      id: 'rotation_atmung',
      label: 'Phase 4: Rotation + Atmung',
      description: 'Seitliche Atmung waehrend der Rollbewegung, Rueckholarm bleibt locker.',
      t: 0.75
    }
  ],
  hotspots: [
    {
      id: 'kopfhaltung',
      area: 'head',
      label: 'Kopfhaltung',
      anchor: [1.04, 0.2, 0],
      title: 'Kopfhaltung',
      explanation: 'Blick schraeg nach unten, Kopf bleibt ruhig und der Nacken entspannt.',
      mistakes: ['Kopf zu hoch', 'Starre Kopfbewegung', 'Blick nach vorn statt nach unten'],
      tip: 'Stell dir vor, du haeltst eine Orange zwischen Kinn und Brustbein.',
      phaseHint: 'In allen Phasen stabil halten.',
      color: '#38bdf8'
    },
    {
      id: 'atmung',
      area: 'breathing',
      label: 'Atmung',
      anchor: [1.0, 0.3, 0.17],
      title: 'Seitliche Atmung',
      explanation: 'Atme seitlich in der Rotation ein. Ein Arm bleibt lang vorne zur Stabilisierung.',
      mistakes: ['Kopf komplett herausheben', 'Zu spaet einatmen', 'Atmung nur auf eine Seite trainieren'],
      tip: 'Nur Mund und ein Auge aus dem Wasser drehen, nicht den ganzen Kopf heben.',
      phaseHint: 'Am besten in Rotation + Atmung.',
      color: '#10b981'
    },
    {
      id: 'rotation',
      area: 'rotation',
      label: 'Rotation',
      anchor: [0.12, 0.4, 0.02],
      title: 'Rollbewegung',
      explanation: 'Gleichmaessige Rotation um die Laengsachse verbessert Zuglaenge und Atmung.',
      mistakes: ['Zu flach rotieren', 'Zu stark kippen', 'Rotation nur aus den Schultern statt aus dem Rumpf'],
      tip: 'Denke an eine kontrollierte Rotation von Rippenbogen und Huefte gemeinsam.',
      phaseHint: 'Uebergang Phase 3 -> 4.',
      color: '#a78bfa'
    },
    {
      id: 'rechter_armzug',
      area: 'right-arm',
      label: 'Rechter Armzug',
      anchor: [0.42, 0.28, -0.46],
      title: 'Armzug rechts',
      explanation: 'Eintauchen vor der Schulter, fruehes Wasserfassen, Zug unter dem Koerper, Druck bis hinten.',
      mistakes: ['Hand kreuzt vor dem Kopf', 'Zu spaeter Catch', 'Druckphase bricht vorzeitig ab'],
      tip: 'Rechter Arm: Ellbogen frueh hoch, Unterarm als Paddel ausrichten.',
      phaseHint: 'Phasen 1-3 des Zyklus.',
      color: '#fb7185'
    },
    {
      id: 'linker_armzug',
      area: 'left-arm',
      label: 'Linker Armzug',
      anchor: [0.42, 0.28, 0.46],
      title: 'Armzug links',
      explanation: 'Linke Seite arbeitet spiegelbildlich und gibt den Rhythmus fuer die Koordination.',
      mistakes: ['Asymmetrischer Zugweg', 'Rueckholphase zu verkrampft', 'Zu wenig Druck bis hinten'],
      tip: 'Linken Rueckholarm locker fuehren, Hand entspannt nach vorn bringen.',
      phaseHint: 'Phasen 1-3 gespiegelt.',
      color: '#22d3ee'
    },
    {
      id: 'beinschlag',
      area: 'kick',
      label: 'Beinschlag',
      anchor: [-0.96, -0.06, 0],
      title: 'Beinschlag aus der Huefte',
      explanation: 'Der Kick startet in der Huefte. Knie locker, Fussgelenke lang und weich.',
      mistakes: ['Fahrradbewegung aus dem Knie', 'Steife Fuesse', 'Zu grosse Amplitude'],
      tip: 'Kleiner, schneller Kick mit gestreckten Fuessen und stabilem Rumpf.',
      phaseHint: 'Kontinuierlich als 6er-Kick mitlaufen lassen.',
      color: '#f59e0b'
    },
    {
      id: 'wasserlage',
      area: 'bodyline',
      label: 'Wasserlage',
      anchor: [0.0, 0.18, 0],
      title: 'Wasserlage / Koerperspannung',
      explanation: 'Gestreckte Position mit Huefte nahe der Oberflaeche reduziert Widerstand.',
      mistakes: ['Huefte sinkt ab', 'Hohlkreuz', 'Unruhige Rumpfspannung'],
      tip: 'Bauch aktiv halten und in der Strecklage bewusst Laenge erzeugen.',
      phaseHint: 'Basis fuer alle Technikbereiche.',
      color: '#0ea5e9'
    },
    {
      id: 'timing',
      area: 'timing',
      label: 'Timing',
      anchor: [-0.18, 0.55, 0],
      title: 'Timing / Koordination',
      explanation: 'Armwechsel, Rotation, Atmung und Beinschlag greifen zeitlich ineinander.',
      mistakes: ['Atmung entkoppelt vom Armwechsel', 'Kick stoppt waehrend Atmung', 'Zu hektischer Rhythmus'],
      tip: 'Zuerst langsam im Phasenmodus, dann auf fliessenden Gesamtzyklus steigern.',
      phaseHint: 'Ueber den gesamten Loop beobachten.',
      color: '#14b8a6'
    }
  ],
  animation: {
    loopDuration: 2.9,
    kickFrequency: 6,
    kickAmplitude: 0.2,
    bodyFrames: [
      {
        t: 0,
        roll: -0.1,
        pitch: -0.065,
        yaw: 0,
        heave: 0,
        surge: -0.02,
        headYaw: 0,
        headPitch: 0.06,
        leftHip: -0.05,
        leftKnee: 0.2,
        leftAnkle: -0.08,
        rightHip: 0.2,
        rightKnee: 0.34,
        rightAnkle: 0.02
      },
      {
        t: 0.25,
        roll: 0.02,
        pitch: -0.06,
        yaw: 0,
        heave: 0.005,
        surge: 0.02,
        headYaw: 0,
        headPitch: 0.06,
        leftHip: 0.17,
        leftKnee: 0.31,
        leftAnkle: 0.01,
        rightHip: -0.08,
        rightKnee: 0.22,
        rightAnkle: -0.08
      },
      {
        t: 0.5,
        roll: 0.12,
        pitch: -0.06,
        yaw: 0,
        heave: 0.002,
        surge: 0.03,
        headYaw: 0.04,
        headPitch: 0.06,
        leftHip: -0.08,
        leftKnee: 0.22,
        leftAnkle: -0.08,
        rightHip: 0.22,
        rightKnee: 0.34,
        rightAnkle: 0.02
      },
      {
        t: 0.75,
        roll: 0.2,
        pitch: -0.055,
        yaw: 0,
        heave: 0.004,
        surge: 0.01,
        headYaw: 0.58,
        headPitch: 0.08,
        leftHip: 0.2,
        leftKnee: 0.34,
        leftAnkle: 0.02,
        rightHip: -0.09,
        rightKnee: 0.2,
        rightAnkle: -0.08
      }
    ],
    leftArmFrames: [
      { t: 0, shoulder: [-0.18, 0.16, -0.12], elbow: [0.35, 0.1, -0.02] },
      { t: 0.25, shoulder: [0.22, 0.06, -0.58], elbow: [1.08, 0.08, 0.02] },
      { t: 0.5, shoulder: [0.28, -0.14, -1.08], elbow: [0.76, -0.02, 0.02] },
      { t: 0.75, shoulder: [-0.14, 0.38, 0.92], elbow: [1.32, 0.12, -0.06] }
    ],
    rightArmFrames: [
      { t: 0, shoulder: [0.28, -0.14, -1.08], elbow: [0.76, -0.02, 0.02] },
      { t: 0.25, shoulder: [-0.14, 0.38, 0.92], elbow: [1.32, 0.12, -0.06] },
      { t: 0.5, shoulder: [-0.18, 0.16, -0.12], elbow: [0.35, 0.1, -0.02] },
      { t: 0.75, shoulder: [0.22, 0.06, -0.58], elbow: [1.08, 0.08, 0.02] }
    ]
  }
};
