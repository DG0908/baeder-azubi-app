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
    kickAmplitude: 0.48,
    // -----------------------------------------------------------------------
    // Body keyframes — one full stroke cycle (left arm leads).
    // Coordinates:
    //   roll  = rotation around longitudinal axis (positive = roll towards right / left-shoulder-up)
    //   pitch = nose-down tilt (negative = streamlined, slight downhill angle)
    //   yaw   = lateral wiggle (kept near zero for clean crawl)
    //   heave = vertical bobbing
    //   surge = forward pulse per stroke
    //   headYaw / headPitch = independent head orientation for breathing
    //   hip / knee / ankle = leg joint angles (positive = downkick direction)
    // -----------------------------------------------------------------------
    bodyFrames: [
      {
        // Phase 1 — Strecklage: left arm extended, body nearly flat, slight roll left
        t: 0,
        roll: -0.38,
        pitch: -0.08,
        yaw: 0,
        heave: 0,
        surge: -0.02,
        headYaw: 0,
        headPitch: 0.08,
        leftHip: -0.18,
        leftKnee: 0.10,
        leftAnkle: -0.12,
        rightHip: 0.28,
        rightKnee: 0.38,
        rightAnkle: 0.06
      },
      {
        // Phase 2 — Wasserfassen: left arm catches, body rolls towards center
        t: 0.25,
        roll: -0.08,
        pitch: -0.07,
        yaw: 0,
        heave: 0.01,
        surge: 0.04,
        headYaw: 0,
        headPitch: 0.07,
        leftHip: 0.26,
        leftKnee: 0.36,
        leftAnkle: 0.04,
        rightHip: -0.20,
        rightKnee: 0.12,
        rightAnkle: -0.12
      },
      {
        // Phase 3 — Druckphase: left arm pushes back, body rolls right
        t: 0.5,
        roll: 0.42,
        pitch: -0.07,
        yaw: 0,
        heave: 0.005,
        surge: 0.06,
        headYaw: 0.15,
        headPitch: 0.07,
        leftHip: -0.22,
        leftKnee: 0.12,
        leftAnkle: -0.12,
        rightHip: 0.30,
        rightKnee: 0.40,
        rightAnkle: 0.06
      },
      {
        // Phase 4 — Rotation + Atmung: full roll right, head turns to breathe
        t: 0.75,
        roll: 0.62,
        pitch: -0.06,
        yaw: 0,
        heave: 0.008,
        surge: 0.02,
        headYaw: 1.25,
        headPitch: 0.12,
        leftHip: 0.28,
        leftKnee: 0.38,
        leftAnkle: 0.06,
        rightHip: -0.22,
        rightKnee: 0.10,
        rightAnkle: -0.12
      }
    ],
    // -----------------------------------------------------------------------
    // Arm keyframes — shoulder [flexion, abduction, sweep], elbow [flexion, ?, ?]
    // Left arm leads the cycle; right arm is offset by half a cycle.
    //
    // Phase 1 (t=0):    Left arm EXTENDED forward (entry/glide)
    // Phase 2 (t=0.25): Left arm CATCH (high elbow, forearm drops)
    // Phase 3 (t=0.5):  Left arm PULL/PUSH (power stroke, elbow extends)
    // Phase 4 (t=0.75): Left arm RECOVERY (elbow exits water, swings forward)
    // -----------------------------------------------------------------------
    leftArmFrames: [
      // Entry/Glide — arm stretched forward, elbow nearly straight
      { t: 0,    shoulder: [-0.25,  0.20, -0.15], elbow: [0.18, 0.05, -0.02] },
      // Catch — high elbow, forearm angles down into water
      { t: 0.25, shoulder: [ 0.65,  0.10, -1.10], elbow: [1.75, 0.10,  0.05] },
      // Pull/Push — arm sweeps back past hip, elbow extends
      { t: 0.5,  shoulder: [ 1.20, -0.25, -1.80], elbow: [0.55, -0.05,  0.04] },
      // Recovery — elbow high out of water, forearm dangles forward
      { t: 0.75, shoulder: [-0.40,  0.55,  1.40], elbow: [2.10, 0.15, -0.08] }
    ],
    // Right arm is half a cycle behind left
    rightArmFrames: [
      // t=0: right arm is in Pull/Push (mirrored from left t=0.5)
      { t: 0,    shoulder: [ 1.20, -0.25, -1.80], elbow: [0.55, -0.05,  0.04] },
      // t=0.25: right arm Recovery (mirrored from left t=0.75)
      { t: 0.25, shoulder: [-0.40,  0.55,  1.40], elbow: [2.10, 0.15, -0.08] },
      // t=0.5: right arm Entry/Glide (mirrored from left t=0)
      { t: 0.5,  shoulder: [-0.25,  0.20, -0.15], elbow: [0.18, 0.05, -0.02] },
      // t=0.75: right arm Catch (mirrored from left t=0.25)
      { t: 0.75, shoulder: [ 0.65,  0.10, -1.10], elbow: [1.75, 0.10,  0.05] }
    ]
  }
};
