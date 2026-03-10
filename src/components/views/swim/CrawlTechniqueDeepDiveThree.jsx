import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../../../context/AppContext';

const MODEL_HEIGHT = 'clamp(420px, 68vh, 860px)';

const ARM_PHASES = [
  {
    id: 'eintauchen',
    label: 'Eintauchphase',
    short: '1',
    hint: 'Hand taucht vor der Schulter ein, Ellbogen bleibt leicht hoch.',
    focus: 'Wasser sauber anstellen, keine Kreuzung vor dem Kopf.'
  },
  {
    id: 'wasserfassen',
    label: 'Wasserfassen',
    short: '2',
    hint: 'Unterarm kippt frueh in Druckrichtung (Early Vertical Forearm).',
    focus: 'Unterarm als Paddel einsetzen, nicht nur aus der Hand ziehen.'
  },
  {
    id: 'zugphase',
    label: 'Zugphase',
    short: '3',
    hint: 'Arm zieht unter dem Koerper nach hinten, Ellbogen bleibt gefuehrt.',
    focus: 'Kraft aus Lat + Rumpf, stabile Wasserlage halten.'
  },
  {
    id: 'druckphase',
    label: 'Druckphase',
    short: '4',
    hint: 'Beschleunigtes Abdrucken bis zur Huefte.',
    focus: 'Druck bis ganz nach hinten halten, nicht zu frueh aussteigen.'
  },
  {
    id: 'rueckholphase',
    label: 'Rueckholphase',
    short: '5',
    hint: 'Lockere Rueckfuehrung ueber Wasser mit hohem Ellbogen.',
    focus: 'Entspannt und knapp ueber Wasser nach vorn.'
  }
];

const KICK_MODES = [
  {
    id: 'aktiv',
    label: 'Aktiver Kick',
    hint: 'Abwaertsschlag ist kraftbetont und stabilisiert die Wasserlage.',
    details: 'Kraftimpuls aus der Huefte, Knie nur leicht gebeugt.'
  },
  {
    id: 'passiv',
    label: 'Passiver Kick',
    hint: 'Aufwaertsbewegung ist locker und bereitet den naechsten Kick vor.',
    details: 'Rueckfuehrung ohne Bremseffekt, Fuesse gestreckt halten.'
  }
];

const KICK_PHASES = [
  {
    id: 'aktiv-einleitung',
    mode: 'aktiv',
    label: 'Aktiv 1: Einleitung',
    details: 'Huefte startet den Abwaertsschlag, Knie bleibt kontrolliert.'
  },
  {
    id: 'aktiv-druck',
    mode: 'aktiv',
    label: 'Aktiv 2: Druckphase',
    details: 'Unterschenkel/Fuss beschleunigen nach hinten-unten.'
  },
  {
    id: 'passiv-rueckfuehrung',
    mode: 'passiv',
    label: 'Passiv 3: Rueckfuehrung',
    details: 'Locker nach oben zurueck, ohne Wasser zu bremsen.'
  },
  {
    id: 'passiv-umschalt',
    mode: 'passiv',
    label: 'Passiv 4: Umschaltphase',
    details: 'Fuss strecken und direkt in den naechsten Aktionskick wechseln.'
  }
];

const KICK_MODE_TO_PHASES = {
  aktiv: ['aktiv-einleitung', 'aktiv-druck'],
  passiv: ['passiv-rueckfuehrung', 'passiv-umschalt']
};

const BREATH_MODES = [
  {
    id: 'zwei_zug',
    label: '2er Rhythmus',
    hint: 'Einatmen alle zwei Armzuege zur gleichen Seite.',
    details: 'Gut fuer hohe Intensitaet, aber Seite regelmaessig wechseln.'
  },
  {
    id: 'drei_zug',
    label: '3er Bilateral',
    hint: 'Einatmen alle drei Armzuege, Seitenwechsel automatisch.',
    details: 'Foerdert symmetrische Technik und bessere Orientierung.'
  },
  {
    id: 'frueh_ausatmen',
    label: 'Frueh ausatmen',
    hint: 'Kontinuierlich unter Wasser ausatmen, kurz seitlich einatmen.',
    details: 'Nimmt Zeitdruck bei der Einatmung und beruhigt den Rhythmus.'
  }
];

const DEEP_DIVE_FOCUS = [
  { id: 'armzug', label: 'Armzug-Fokus' },
  { id: 'beinschlag', label: 'Beinschlag-Fokus' },
  { id: 'atmung', label: 'Atem-Fokus' }
];

const CAMERA_PRESETS = {
  iso: { label: 'Iso', position: [3.5, 1.6, 4.2], target: [0.05, 0.18, 0] },
  side: { label: 'Seite', position: [0.2, 1.0, 6.2], target: [0.0, 0.15, 0] },
  front: { label: 'Front', position: [5.1, 1.08, 1.6], target: [0.15, 0.16, 0] },
  top: { label: 'Top', position: [0.35, 6.1, 1.3], target: [0.0, 0.16, 0] }
};

const REFERENCE_PHASES = [
  {
    id: 'phase_1_strecklage',
    label: 'Phase 1: Strecklage',
    summary: 'Vorderer Arm lang, Gegenseite beendet den Druck bis zur Huefte.',
    bodyRoll: -0.1,
    torsoPitch: -0.065,
    headYaw: 0,
    headPitch: 0.06,
    leftArm: {
      shoulder: [-0.62, 0.22, -0.12],
      elbow: [0.65, 0.16, -0.04]
    },
    rightArm: {
      shoulder: [0.92, -0.2, -1.2],
      elbow: [0.78, -0.02, 0.02]
    },
    leftLeg: { hip: -0.05, knee: 0.2, ankle: -0.08 },
    rightLeg: { hip: 0.21, knee: 0.34, ankle: 0.02 }
  },
  {
    id: 'phase_2_wasserfassen',
    label: 'Phase 2: Wasserfassen',
    summary: 'Vorderarm stellt an, Gegenseite fuehrt den Ellbogen hoch zur Rueckholung.',
    bodyRoll: 0.02,
    torsoPitch: -0.06,
    headYaw: 0,
    headPitch: 0.06,
    leftArm: {
      shoulder: [0.16, 0.06, -0.64],
      elbow: [1.08, 0.08, 0.02]
    },
    rightArm: {
      shoulder: [-0.28, 0.56, 0.36],
      elbow: [1.0, 0.08, -0.1]
    },
    leftLeg: { hip: 0.18, knee: 0.32, ankle: 0.01 },
    rightLeg: { hip: -0.08, knee: 0.22, ankle: -0.08 }
  },
  {
    id: 'phase_3_druck_streck',
    label: 'Phase 3: Druckphase',
    summary: 'Druckarm beschleunigt nach hinten, Gegenseite liegt wieder lang gestreckt.',
    bodyRoll: 0.11,
    torsoPitch: -0.06,
    headYaw: 0.05,
    headPitch: 0.06,
    leftArm: {
      shoulder: [0.96, -0.2, -1.24],
      elbow: [0.78, -0.02, 0.02]
    },
    rightArm: {
      shoulder: [-0.6, 0.24, -0.14],
      elbow: [0.66, 0.18, -0.04]
    },
    leftLeg: { hip: -0.07, knee: 0.22, ankle: -0.08 },
    rightLeg: { hip: 0.22, knee: 0.34, ankle: 0.02 }
  },
  {
    id: 'phase_4_rotation_atmung',
    label: 'Phase 4: Rotation + Atmung',
    summary: 'Rumpf rotiert zur Atemseite, Mund ist frei, Rueckhol-Ellbogen bleibt hoch.',
    bodyRoll: 0.19,
    torsoPitch: -0.055,
    headYaw: 0.58,
    headPitch: 0.08,
    leftArm: {
      shoulder: [-0.36, 0.62, 0.44],
      elbow: [1.0, 0.1, -0.12]
    },
    rightArm: {
      shoulder: [0.12, 0.08, -0.72],
      elbow: [1.12, 0.1, 0.02]
    },
    leftLeg: { hip: 0.2, knee: 0.34, ankle: 0.02 },
    rightLeg: { hip: -0.09, knee: 0.2, ankle: -0.08 }
  }
];

const ARM_PHASE_TO_REFERENCE = {
  eintauchen: 'phase_1_strecklage',
  wasserfassen: 'phase_2_wasserfassen',
  zugphase: 'phase_2_wasserfassen',
  druckphase: 'phase_3_druck_streck',
  rueckholphase: 'phase_4_rotation_atmung'
};

const phaseIndexById = ARM_PHASES.reduce((acc, phase, index) => {
  acc[phase.id] = index;
  return acc;
}, {});

const referencePhaseIndexById = REFERENCE_PHASES.reduce((acc, phase, index) => {
  acc[phase.id] = index;
  return acc;
}, {});

const lerpArray3 = (from, to, t) => ([
  THREE.MathUtils.lerp(from[0], to[0], t),
  THREE.MathUtils.lerp(from[1], to[1], t),
  THREE.MathUtils.lerp(from[2], to[2], t)
]);

const scalePose = (pose, shoulderScale = 1, elbowScale = 1) => ({
  shoulder: [
    pose.shoulder[0] * shoulderScale,
    pose.shoulder[1] * shoulderScale,
    pose.shoulder[2] * shoulderScale
  ],
  elbow: [
    pose.elbow[0] * elbowScale,
    pose.elbow[1] * elbowScale,
    pose.elbow[2] * elbowScale
  ]
});

const getReferencePhaseById = (id) => {
  const index = referencePhaseIndexById[id];
  return REFERENCE_PHASES[index ?? 0];
};

const sampleReferencePhase = (progress) => {
  const safeProgress = ((progress % 1) + 1) % 1;
  const scaled = safeProgress * REFERENCE_PHASES.length;
  const index = Math.floor(scaled) % REFERENCE_PHASES.length;
  const nextIndex = (index + 1) % REFERENCE_PHASES.length;
  const t = scaled - index;
  const a = REFERENCE_PHASES[index];
  const b = REFERENCE_PHASES[nextIndex];

  return {
    id: a.id,
    label: a.label,
    bodyRoll: THREE.MathUtils.lerp(a.bodyRoll, b.bodyRoll, t),
    torsoPitch: THREE.MathUtils.lerp(a.torsoPitch, b.torsoPitch, t),
    headYaw: THREE.MathUtils.lerp(a.headYaw, b.headYaw, t),
    headPitch: THREE.MathUtils.lerp(a.headPitch, b.headPitch, t),
    leftArm: {
      shoulder: lerpArray3(a.leftArm.shoulder, b.leftArm.shoulder, t),
      elbow: lerpArray3(a.leftArm.elbow, b.leftArm.elbow, t)
    },
    rightArm: {
      shoulder: lerpArray3(a.rightArm.shoulder, b.rightArm.shoulder, t),
      elbow: lerpArray3(a.rightArm.elbow, b.rightArm.elbow, t)
    },
    leftLeg: {
      hip: THREE.MathUtils.lerp(a.leftLeg.hip, b.leftLeg.hip, t),
      knee: THREE.MathUtils.lerp(a.leftLeg.knee, b.leftLeg.knee, t),
      ankle: THREE.MathUtils.lerp(a.leftLeg.ankle, b.leftLeg.ankle, t)
    },
    rightLeg: {
      hip: THREE.MathUtils.lerp(a.rightLeg.hip, b.rightLeg.hip, t),
      knee: THREE.MathUtils.lerp(a.rightLeg.knee, b.rightLeg.knee, t),
      ankle: THREE.MathUtils.lerp(a.rightLeg.ankle, b.rightLeg.ankle, t)
    }
  };
};

const dampEuler = (targetRef, target, delta, lambda = 10) => {
  if (!targetRef?.current) return;
  targetRef.current.rotation.x = THREE.MathUtils.damp(targetRef.current.rotation.x, target[0], lambda, delta);
  targetRef.current.rotation.y = THREE.MathUtils.damp(targetRef.current.rotation.y, target[1], lambda, delta);
  targetRef.current.rotation.z = THREE.MathUtils.damp(targetRef.current.rotation.z, target[2], lambda, delta);
};

function CameraPresetController({ cameraPreset = 'iso' }) {
  const { camera } = useThree();
  const lookAtVector = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const preset = CAMERA_PRESETS[cameraPreset] || CAMERA_PRESETS.iso;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, preset.position[0], 5.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, preset.position[1], 5.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, preset.position[2], 5.5, delta);

    lookAtVector.set(preset.target[0], preset.target[1], preset.target[2]);
    camera.lookAt(lookAtVector);
    camera.updateProjectionMatrix();
  });

  return null;
}

function WaterEnvironment({ darkMode }) {
  const rippleRef = useRef(null);
  useFrame((state, delta) => {
    if (!rippleRef.current) return;
    rippleRef.current.rotation.z += delta * 0.07;
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
        <planeGeometry args={[22, 16, 1, 1]} />
        <meshStandardMaterial
          color={darkMode ? '#06243d' : '#89ddff'}
          metalness={0.06}
          roughness={0.32}
          transparent
          opacity={darkMode ? 0.88 : 0.8}
        />
      </mesh>

      <mesh ref={rippleRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.105, 0]}>
        <ringGeometry args={[2.2, 5.1, 64]} />
        <meshBasicMaterial color={darkMode ? '#4cc9ff' : '#22b6ff'} transparent opacity={0.16} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.18, 0]}>
        <planeGeometry args={[22, 16, 1, 1]} />
        <meshStandardMaterial
          color={darkMode ? '#67e8f9' : '#d9f5ff'}
          metalness={0.02}
          roughness={0.16}
          transparent
          opacity={darkMode ? 0.19 : 0.24}
        />
      </mesh>

      {[-2.4, 0, 2.4].map((zOffset) => (
        <mesh key={zOffset} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.08, zOffset]}>
          <cylinderGeometry args={[0.04, 0.04, 15.5, 20]} />
          <meshStandardMaterial color={darkMode ? '#f59e0b' : '#f97316'} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function SwimmerRig({
  darkMode,
  speed,
  viewMode,
  deepDiveFocus,
  cameraPreset,
  selectedArmPhase,
  selectedKickMode,
  selectedBreathingMode
}) {
  const rootRef = useRef(null);
  const torsoRef = useRef(null);
  const upperTorsoRef = useRef(null);
  const pelvisRef = useRef(null);
  const headRef = useRef(null);

  const leftShoulderRef = useRef(null);
  const leftElbowRef = useRef(null);
  const rightShoulderRef = useRef(null);
  const rightElbowRef = useRef(null);

  const leftHipRef = useRef(null);
  const leftKneeRef = useRef(null);
  const leftAnkleRef = useRef(null);
  const rightHipRef = useRef(null);
  const rightKneeRef = useRef(null);
  const rightAnkleRef = useRef(null);

  const selectedPhaseIndex = phaseIndexById[selectedArmPhase] ?? 0;

  const colorPalette = useMemo(() => {
    const armFocus = viewMode === 'deep' && deepDiveFocus === 'armzug';
    const kickFocus = viewMode === 'deep' && deepDiveFocus === 'beinschlag';
    const breathFocus = viewMode === 'deep' && deepDiveFocus === 'atmung';
    const skinBase = darkMode ? '#eec19c' : '#efc5a4';

    return {
      skin: breathFocus ? '#ffd6b6' : skinBase,
      skinShade: darkMode ? '#d2a17b' : '#d4a37f',
      suitMain: darkMode ? '#ea580c' : '#dc5d2f',
      suitAccent: darkMode ? '#c2410c' : '#b94824',
      joint: darkMode ? '#e3b691' : '#d8ab86',
      armUpper: armFocus ? '#22d3ee' : skinBase,
      armLower: armFocus ? '#67e8f9' : (darkMode ? '#e4b28d' : '#e9b894'),
      legUpper: kickFocus ? '#fb923c' : skinBase,
      legLower: kickFocus ? '#fdba74' : (darkMode ? '#dfad89' : '#e4b28d'),
      cap: darkMode ? '#0b1120' : '#111827',
      goggle: breathFocus ? '#22d3ee' : '#1f2937',
      foot: darkMode ? '#e8ba95' : '#efc49f',
      seam: darkMode ? '#7c2d12' : '#8a3417'
    };
  }, [darkMode, viewMode, deepDiveFocus]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const baseSpeed = THREE.MathUtils.clamp(speed, 0.45, 1.8);
    const cycle = elapsed * baseSpeed * 0.23;
    const referenceSample = sampleReferencePhase(cycle);
    const deepReferenceId = ARM_PHASE_TO_REFERENCE[selectedArmPhase] || REFERENCE_PHASES[0].id;
    const deepReference = getReferencePhaseById(deepReferenceId);
    const breathingReference = getReferencePhaseById('phase_4_rotation_atmung');

    const isDeepArm = viewMode === 'deep' && deepDiveFocus === 'armzug';
    const isDeepKick = viewMode === 'deep' && deepDiveFocus === 'beinschlag';
    const isDeepBreath = viewMode === 'deep' && deepDiveFocus === 'atmung';

    let bodyRollTarget = referenceSample.bodyRoll;
    let torsoPitchTarget = referenceSample.torsoPitch;

    if (isDeepArm) {
      bodyRollTarget = deepReference.bodyRoll * 0.8;
      torsoPitchTarget = deepReference.torsoPitch;
    }
    if (isDeepKick) {
      bodyRollTarget *= 0.55;
      torsoPitchTarget -= 0.004;
    }
    if (isDeepBreath) {
      bodyRollTarget = breathingReference.bodyRoll * 1.05;
      torsoPitchTarget = breathingReference.torsoPitch;
    }

    if (rootRef.current) {
      const travel = Math.sin(elapsed * baseSpeed * 0.58) * (viewMode === 'full' ? 0.04 : 0.02);
      const cameraYawOffset = cameraPreset === 'front' ? 0.2 : 0;
      rootRef.current.position.x = travel;
      rootRef.current.position.y = 0.2 + Math.sin(elapsed * baseSpeed * 1.2) * 0.006;
      rootRef.current.rotation.z = THREE.MathUtils.damp(rootRef.current.rotation.z, bodyRollTarget, 7, delta);
      rootRef.current.rotation.y = cameraYawOffset + Math.sin(elapsed * baseSpeed * 0.35) * 0.014;
      rootRef.current.rotation.x = THREE.MathUtils.damp(
        rootRef.current.rotation.x,
        torsoPitchTarget + Math.sin(elapsed * baseSpeed * 1.3) * 0.006,
        6,
        delta
      );
    }

    if (torsoRef.current) {
      torsoRef.current.rotation.x = THREE.MathUtils.damp(
        torsoRef.current.rotation.x,
        torsoPitchTarget + Math.sin(elapsed * baseSpeed * 1.7) * 0.014,
        10,
        delta
      );
    }

    if (upperTorsoRef.current) {
      upperTorsoRef.current.rotation.z = THREE.MathUtils.damp(upperTorsoRef.current.rotation.z, bodyRollTarget * 0.96, 7, delta);
      upperTorsoRef.current.rotation.y = THREE.MathUtils.damp(
        upperTorsoRef.current.rotation.y,
        Math.sin(elapsed * baseSpeed * 0.78) * 0.028,
        6,
        delta
      );
    }
    if (pelvisRef.current) {
      pelvisRef.current.rotation.z = THREE.MathUtils.damp(pelvisRef.current.rotation.z, -bodyRollTarget * 0.58, 7, delta);
      pelvisRef.current.rotation.y = THREE.MathUtils.damp(
        pelvisRef.current.rotation.y,
        -Math.sin(elapsed * baseSpeed * 0.78) * 0.022,
        6,
        delta
      );
    }

    let leftArmPose = scalePose(referenceSample.leftArm, 1.05, 1.05);
    let rightArmPose = scalePose(referenceSample.rightArm, 1.05, 1.05);

    if (isDeepArm) {
      const pulse = Math.sin(elapsed * 2.1) * 0.03;
      const basePose = scalePose(deepReference.leftArm, 1.12, 1.1);
      leftArmPose = {
        shoulder: [basePose.shoulder[0], basePose.shoulder[1] + pulse, basePose.shoulder[2]],
        elbow: [basePose.elbow[0] + pulse * 0.35, basePose.elbow[1], basePose.elbow[2]]
      };
      rightArmPose = scalePose(deepReference.rightArm, 0.74, 0.74);
    } else if (isDeepKick) {
      leftArmPose = scalePose(referenceSample.leftArm, 0.82, 0.82);
      rightArmPose = scalePose(referenceSample.rightArm, 0.82, 0.82);
    } else if (isDeepBreath) {
      const breathPulse = Math.sin(elapsed * baseSpeed * 1.25) * 0.03;
      leftArmPose = {
        shoulder: [
          breathingReference.leftArm.shoulder[0],
          breathingReference.leftArm.shoulder[1] + breathPulse,
          breathingReference.leftArm.shoulder[2]
        ],
        elbow: breathingReference.leftArm.elbow
      };
      rightArmPose = scalePose(breathingReference.rightArm, 0.92, 0.9);
    }

    dampEuler(leftShoulderRef, leftArmPose.shoulder, delta, 11);
    dampEuler(leftElbowRef, leftArmPose.elbow, delta, 11);
    dampEuler(rightShoulderRef, rightArmPose.shoulder, delta, 11);
    dampEuler(rightElbowRef, rightArmPose.elbow, delta, 11);

    let leftLegTarget = {
      hip: referenceSample.leftLeg.hip,
      knee: referenceSample.leftLeg.knee,
      ankle: referenceSample.leftLeg.ankle
    };
    let rightLegTarget = {
      hip: referenceSample.rightLeg.hip,
      knee: referenceSample.rightLeg.knee,
      ankle: referenceSample.rightLeg.ankle
    };

    if (viewMode === 'full') {
      const flutter = Math.sin(elapsed * baseSpeed * 5.5);
      leftLegTarget.hip += flutter * 0.08;
      rightLegTarget.hip -= flutter * 0.08;
      leftLegTarget.knee += Math.max(0, -flutter) * 0.12;
      rightLegTarget.knee += Math.max(0, flutter) * 0.12;
      leftLegTarget.ankle += flutter * 0.08;
      rightLegTarget.ankle -= flutter * 0.08;
    }

    if (isDeepKick) {
      const kickWave = Math.sin(elapsed * baseSpeed * 6.2);
      const down = Math.max(0, kickWave);
      const up = Math.max(0, -kickWave);
      const activeGain = selectedKickMode === 'aktiv' ? 0.48 : 0.34;
      const passiveGain = selectedKickMode === 'passiv' ? 0.42 : 0.28;

      leftLegTarget = {
        hip: -0.08 + down * activeGain - up * passiveGain,
        knee: 0.17 + up * (0.36 + passiveGain * 0.24) + down * 0.08,
        ankle: -0.08 + down * 0.22 - up * 0.14
      };
      rightLegTarget = {
        hip: -0.08 + up * activeGain - down * passiveGain,
        knee: 0.17 + down * (0.36 + passiveGain * 0.24) + up * 0.08,
        ankle: -0.08 + up * 0.22 - down * 0.14
      };
    }

    if (isDeepArm) {
      leftLegTarget = {
        hip: THREE.MathUtils.lerp(leftLegTarget.hip, -0.06, 0.55),
        knee: THREE.MathUtils.lerp(leftLegTarget.knee, 0.2, 0.55),
        ankle: THREE.MathUtils.lerp(leftLegTarget.ankle, -0.07, 0.55)
      };
      rightLegTarget = {
        hip: THREE.MathUtils.lerp(rightLegTarget.hip, 0.02, 0.55),
        knee: THREE.MathUtils.lerp(rightLegTarget.knee, 0.22, 0.55),
        ankle: THREE.MathUtils.lerp(rightLegTarget.ankle, -0.02, 0.55)
      };
    }

    const leftHipTarget = leftLegTarget.hip;
    const rightHipTarget = rightLegTarget.hip;
    const leftKneeTarget = leftLegTarget.knee;
    const rightKneeTarget = rightLegTarget.knee;
    const leftAnkleTarget = leftLegTarget.ankle;
    const rightAnkleTarget = rightLegTarget.ankle;

    dampEuler(leftHipRef, [leftHipTarget, 0, 0], delta, 10);
    dampEuler(rightHipRef, [rightHipTarget, 0, 0], delta, 10);
    dampEuler(leftKneeRef, [leftKneeTarget, 0, 0], delta, 10);
    dampEuler(rightKneeRef, [rightKneeTarget, 0, 0], delta, 10);
    dampEuler(leftAnkleRef, [leftAnkleTarget, 0, 0], delta, 10);
    dampEuler(rightAnkleRef, [rightAnkleTarget, 0, 0], delta, 10);

    if (headRef.current) {
      let yawTarget = referenceSample.headYaw;
      let pitchTarget = referenceSample.headPitch;

      if (selectedBreathingMode === 'zwei_zug') {
        const cyclePhase = ((elapsed * baseSpeed * 0.64) % 1 + 1) % 1;
        yawTarget = cyclePhase > 0.7 && cyclePhase < 0.9 ? 0.52 : 0;
      } else if (selectedBreathingMode === 'drei_zug') {
        const cyclePhase = ((elapsed * baseSpeed * 0.5) % 1.5 + 1.5) % 1.5;
        if (cyclePhase > 0.2 && cyclePhase < 0.36) yawTarget = -0.5;
        if (cyclePhase > 1.02 && cyclePhase < 1.2) yawTarget = 0.5;
      } else {
        yawTarget = Math.sin(elapsed * baseSpeed * 2.1) * 0.08;
        pitchTarget = 0.07 + Math.sin(elapsed * baseSpeed * 2.1) * 0.03;
      }

      if (isDeepBreath) {
        yawTarget = yawTarget === 0 ? breathingReference.headYaw * 0.95 : yawTarget * 1.16;
        pitchTarget = breathingReference.headPitch + 0.01;
      }

      headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, yawTarget, 8, delta);
      headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, pitchTarget, 8, delta);
    }
  });

  return (
    <group ref={rootRef} position={[0, 0.22, 0]}>
      <group ref={torsoRef}>
        <group ref={upperTorsoRef}>
          <mesh position={[0.22, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.25, 0.52, 14, 24]} />
            <meshStandardMaterial color={colorPalette.skin} roughness={0.72} metalness={0.01} />
          </mesh>
          <mesh position={[-0.1, 0.11, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.24, 0.62, 14, 24]} />
            <meshStandardMaterial color={colorPalette.skin} roughness={0.72} metalness={0.01} />
          </mesh>
          <mesh position={[-0.44, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.2, 0.42, 12, 20]} />
            <meshStandardMaterial color={colorPalette.skinShade} roughness={0.76} metalness={0.01} />
          </mesh>
          <mesh position={[-0.08, 0.1, 0]}>
            <torusGeometry args={[0.31, 0.015, 10, 40]} />
            <meshStandardMaterial color={colorPalette.seam} roughness={0.52} metalness={0.01} />
          </mesh>
        </group>

        <group ref={pelvisRef}>
          <mesh position={[-0.62, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.22, 0.38, 12, 20]} />
            <meshStandardMaterial color={colorPalette.suitMain} roughness={0.62} metalness={0.02} />
          </mesh>
          <mesh position={[-0.62, -0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.17, 0.16, 10, 16]} />
            <meshStandardMaterial color={colorPalette.suitAccent} roughness={0.64} metalness={0.02} />
          </mesh>
        </group>
      </group>

      <group ref={headRef} position={[0.98, 0.2, 0]}>
        <mesh scale={[1.08, 0.98, 0.9]}>
          <sphereGeometry args={[0.22, 28, 28]} />
          <meshStandardMaterial color={colorPalette.skin} roughness={0.74} metalness={0.01} />
        </mesh>
        <mesh position={[0.09, 0.07, 0]} scale={[1.15, 0.62, 0.94]}>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial color={colorPalette.cap} roughness={0.46} metalness={0.04} />
        </mesh>
        <mesh position={[0.18, 0.01, 0]}>
          <boxGeometry args={[0.16, 0.07, 0.24]} />
          <meshStandardMaterial color={colorPalette.goggle} roughness={0.28} metalness={0.22} />
        </mesh>
        <mesh position={[0.15, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.033, 0.1, 6, 10]} />
          <meshStandardMaterial color={colorPalette.skinShade} roughness={0.72} metalness={0.01} />
        </mesh>
      </group>

      <group ref={leftShoulderRef} position={[0.43, 0.24, 0.36]}>
        <mesh>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={colorPalette.skinShade} roughness={0.74} metalness={0.01} />
        </mesh>
        <mesh position={[0.36, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.086, 0.56, 10, 18]} />
          <meshStandardMaterial color={colorPalette.armUpper} roughness={0.7} metalness={0.01} />
        </mesh>
        <group ref={leftElbowRef} position={[0.71, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.073, 12, 12]} />
            <meshStandardMaterial color={colorPalette.skinShade} roughness={0.74} metalness={0.01} />
          </mesh>
          <mesh position={[0.31, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.073, 0.5, 10, 18]} />
            <meshStandardMaterial color={colorPalette.armLower} roughness={0.7} metalness={0.01} />
          </mesh>
          <mesh position={[0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.045, 0.16, 8, 12]} />
            <meshStandardMaterial color={colorPalette.foot} roughness={0.76} metalness={0.01} />
          </mesh>
        </group>
      </group>

      <group ref={rightShoulderRef} position={[0.43, 0.24, -0.36]}>
        <mesh>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={colorPalette.skinShade} roughness={0.74} metalness={0.01} />
        </mesh>
        <mesh position={[0.36, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.086, 0.56, 10, 18]} />
          <meshStandardMaterial color={colorPalette.armUpper} roughness={0.7} metalness={0.01} />
        </mesh>
        <group ref={rightElbowRef} position={[0.71, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.073, 12, 12]} />
            <meshStandardMaterial color={colorPalette.skinShade} roughness={0.74} metalness={0.01} />
          </mesh>
          <mesh position={[0.31, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.073, 0.5, 10, 18]} />
            <meshStandardMaterial color={colorPalette.armLower} roughness={0.7} metalness={0.01} />
          </mesh>
          <mesh position={[0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.045, 0.16, 8, 12]} />
            <meshStandardMaterial color={colorPalette.foot} roughness={0.76} metalness={0.01} />
          </mesh>
        </group>
      </group>

      <group ref={leftHipRef} position={[-0.66, -0.06, 0.24]}>
        <mesh>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={colorPalette.suitMain} roughness={0.62} metalness={0.02} />
        </mesh>
        <mesh position={[-0.36, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.106, 0.62, 10, 18]} />
          <meshStandardMaterial color={colorPalette.legUpper} roughness={0.7} metalness={0.01} />
        </mesh>
        <mesh position={[-0.2, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.11, 0.12, 8, 14]} />
          <meshStandardMaterial color={colorPalette.suitMain} roughness={0.62} metalness={0.02} />
        </mesh>
        <group ref={leftKneeRef} position={[-0.74, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.078, 12, 12]} />
            <meshStandardMaterial color={colorPalette.skinShade} roughness={0.74} metalness={0.01} />
          </mesh>
          <mesh position={[-0.33, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.084, 0.56, 10, 18]} />
            <meshStandardMaterial color={colorPalette.legLower} roughness={0.7} metalness={0.01} />
          </mesh>
          <group ref={leftAnkleRef} position={[-0.67, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.058, 12, 12]} />
              <meshStandardMaterial color={colorPalette.skinShade} roughness={0.74} metalness={0.01} />
            </mesh>
            <mesh position={[-0.27, -0.02, 0]} rotation={[0, 0, -0.11]}>
              <boxGeometry args={[0.39, 0.055, 0.19]} />
              <meshStandardMaterial color={colorPalette.foot} roughness={0.78} metalness={0.01} />
            </mesh>
          </group>
        </group>
      </group>

      <group ref={rightHipRef} position={[-0.66, -0.06, -0.24]}>
        <mesh>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={colorPalette.suitMain} roughness={0.62} metalness={0.02} />
        </mesh>
        <mesh position={[-0.36, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.106, 0.62, 10, 18]} />
          <meshStandardMaterial color={colorPalette.legUpper} roughness={0.7} metalness={0.01} />
        </mesh>
        <mesh position={[-0.2, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.11, 0.12, 8, 14]} />
          <meshStandardMaterial color={colorPalette.suitMain} roughness={0.62} metalness={0.02} />
        </mesh>
        <group ref={rightKneeRef} position={[-0.74, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.078, 12, 12]} />
            <meshStandardMaterial color={colorPalette.skinShade} roughness={0.74} metalness={0.01} />
          </mesh>
          <mesh position={[-0.33, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.084, 0.56, 10, 18]} />
            <meshStandardMaterial color={colorPalette.legLower} roughness={0.7} metalness={0.01} />
          </mesh>
          <group ref={rightAnkleRef} position={[-0.67, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.058, 12, 12]} />
              <meshStandardMaterial color={colorPalette.skinShade} roughness={0.74} metalness={0.01} />
            </mesh>
            <mesh position={[-0.27, -0.02, 0]} rotation={[0, 0, -0.11]}>
              <boxGeometry args={[0.39, 0.055, 0.19]} />
              <meshStandardMaterial color={colorPalette.foot} roughness={0.78} metalness={0.01} />
            </mesh>
          </group>
        </group>
      </group>

      {viewMode === 'deep' && (
        <Html position={[0.0, 0.92, 0]} center transform>
          <div
            style={{
              padding: '4px 8px',
              borderRadius: '999px',
              border: '1px solid rgba(34, 211, 238, 0.55)',
              background: 'rgba(2, 6, 23, 0.78)',
              color: '#d9f8ff',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap'
            }}
          >
            {deepDiveFocus === 'armzug' && `Deep Dive: ${ARM_PHASES[selectedPhaseIndex]?.label || 'Armzug'}`}
            {deepDiveFocus === 'beinschlag' && `Deep Dive: ${selectedKickMode === 'aktiv' ? 'Aktiver Kick' : 'Passiver Kick'}`}
            {deepDiveFocus === 'atmung' && `Deep Dive: ${BREATH_MODES.find((mode) => mode.id === selectedBreathingMode)?.label || 'Atmung'}`}
          </div>
        </Html>
      )}
    </group>
  );
}

function SelectionButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 10,
        border: active ? '1px solid rgba(34, 211, 238, 0.75)' : '1px solid rgba(148, 163, 184, 0.38)',
        background: active ? 'rgba(34, 211, 238, 0.16)' : 'rgba(15, 23, 42, 0.48)',
        color: active ? '#e6fdff' : '#c7d2fe',
        padding: '8px 10px',
        fontSize: 12,
        fontWeight: 700,
        lineHeight: 1.25,
        textAlign: 'left',
        transition: 'all 150ms ease'
      }}
    >
      {children}
    </button>
  );
}

export default function CrawlTechniqueDeepDiveThree() {
  const { darkMode } = useApp();
  const [viewMode, setViewMode] = useState('full');
  const [deepDiveFocus, setDeepDiveFocus] = useState('armzug');
  const [cameraPreset, setCameraPreset] = useState('side');
  const [selectedArmPhase, setSelectedArmPhase] = useState(ARM_PHASES[0].id);
  const [selectedKickMode, setSelectedKickMode] = useState(KICK_MODES[0].id);
  const [selectedBreathingMode, setSelectedBreathingMode] = useState(BREATH_MODES[1].id);
  const [speed, setSpeed] = useState(1.0);

  const activeArmPhase = ARM_PHASES.find((phase) => phase.id === selectedArmPhase) || ARM_PHASES[0];
  const activeKickMode = KICK_MODES.find((mode) => mode.id === selectedKickMode) || KICK_MODES[0];
  const activeBreathMode = BREATH_MODES.find((mode) => mode.id === selectedBreathingMode) || BREATH_MODES[0];
  const activeKickPhaseIds = KICK_MODE_TO_PHASES[selectedKickMode] || [];
  const activeReferencePhase = getReferencePhaseById(ARM_PHASE_TO_REFERENCE[selectedArmPhase]);

  return (
    <div className="space-y-4">
      <div
        className={`rounded-xl border p-4 ${darkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-gray-200'}`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h2 className={`text-lg font-bold ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>
              Kraultechnik Deep Dive (3D)
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              Waehle Armzugphase, Kick und Atmung. Im Deep Dive wird gezielt die ausgewaehlte Technik animiert.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode('full')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'full'
                  ? 'bg-cyan-500 text-white'
                  : (darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
              }`}
            >
              Gesamtzyklus
            </button>
            <button
              type="button"
              onClick={() => setViewMode('deep')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'deep'
                  ? 'bg-cyan-500 text-white'
                  : (darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
              }`}
            >
              Deep Dive
            </button>
          </div>
        </div>

        <div className="mt-3">
          <label className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Animationsgeschwindigkeit: {speed.toFixed(2)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="1.8"
            step="0.05"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            className="w-full mt-1"
          />
        </div>

        <div className="mt-3">
          <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Videoanalyse-Perspektive
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CAMERA_PRESETS).map(([presetKey, preset]) => (
              <button
                key={presetKey}
                type="button"
                onClick={() => setCameraPreset(presetKey)}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-colors ${
                  cameraPreset === presetKey
                    ? 'bg-cyan-500 text-white'
                    : (darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`relative rounded-xl border overflow-hidden ${darkMode ? 'border-slate-700 bg-slate-950' : 'border-gray-200 bg-cyan-50'}`}
        style={{ height: MODEL_HEIGHT }}
      >
        {viewMode === 'deep' && (
          <div
            className={`absolute top-3 left-3 right-3 z-20 rounded-lg border p-2 backdrop-blur-sm ${
              darkMode
                ? 'bg-slate-900/80 border-slate-700 text-slate-100'
                : 'bg-white/90 border-gray-200 text-gray-800'
            }`}
          >
            <div className="grid gap-1 sm:grid-cols-4">
              <div className={`text-[11px] rounded px-2 py-1 border ${darkMode ? 'bg-cyan-900/30 border-cyan-600 text-cyan-100' : 'bg-cyan-50 border-cyan-300 text-cyan-800'}`}>
                Armzug: <span className="font-semibold">{activeArmPhase.label}</span>
              </div>
              <div className={`text-[11px] rounded px-2 py-1 border ${darkMode ? 'bg-orange-900/30 border-orange-600 text-orange-100' : 'bg-orange-50 border-orange-300 text-orange-800'}`}>
                Beinschlag: <span className="font-semibold">{activeKickMode.label}</span>
              </div>
              <div className={`text-[11px] rounded px-2 py-1 border ${darkMode ? 'bg-emerald-900/30 border-emerald-600 text-emerald-100' : 'bg-emerald-50 border-emerald-300 text-emerald-800'}`}>
                Atmung: <span className="font-semibold">{activeBreathMode.label}</span>
              </div>
              <div className={`text-[11px] rounded px-2 py-1 border ${darkMode ? 'bg-violet-900/30 border-violet-600 text-violet-100' : 'bg-violet-50 border-violet-300 text-violet-800'}`}>
                Referenz: <span className="font-semibold">{activeReferencePhase.label}</span>
              </div>
            </div>
          </div>
        )}

        <Canvas dpr={[1, 1.8]} camera={{ position: [0, 1.35, 5.4], fov: 44 }}>
          <CameraPresetController cameraPreset={cameraPreset} />
          <color attach="background" args={[darkMode ? '#020617' : '#e0f7ff']} />
          <fog attach="fog" args={[darkMode ? '#020617' : '#d9f7ff', 5, 12]} />
          <ambientLight intensity={darkMode ? 0.6 : 0.76} />
          <hemisphereLight intensity={0.42} skyColor={darkMode ? '#7dd3fc' : '#38bdf8'} groundColor={darkMode ? '#0b2538' : '#bae6fd'} />
          <directionalLight intensity={1.2} position={[4, 6, 3]} color={darkMode ? '#7dd3fc' : '#38bdf8'} />
          <pointLight intensity={0.48} position={[-3, 2, -2]} color="#ffffff" />
          <pointLight intensity={0.28} position={[2, 1.2, -3]} color={darkMode ? '#22d3ee' : '#0284c7'} />

          <WaterEnvironment darkMode={darkMode} />
          <SwimmerRig
            darkMode={darkMode}
            speed={speed}
            viewMode={viewMode}
            deepDiveFocus={deepDiveFocus}
            cameraPreset={cameraPreset}
            selectedArmPhase={selectedArmPhase}
            selectedKickMode={selectedKickMode}
            selectedBreathingMode={selectedBreathingMode}
          />

          <OrbitControls
            enablePan={false}
            minDistance={3.3}
            maxDistance={8}
            minPolarAngle={0.02}
            maxPolarAngle={Math.PI / 2 - 0.02}
            target={CAMERA_PRESETS[cameraPreset]?.target || [0.0, 0.25, 0]}
          />
        </Canvas>
      </div>

      {viewMode === 'deep' && (
        <div className={`rounded-xl border p-3 ${darkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="grid xl:grid-cols-3 gap-3">
            <div>
              <h3 className={`text-xs font-bold mb-2 ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>
                Armzugphasen (vollstaendig)
              </h3>
              <div className="grid sm:grid-cols-2 gap-1.5">
                {ARM_PHASES.map((phase, index) => {
                  const isActive = selectedArmPhase === phase.id;
                  return (
                    <div
                      key={phase.id}
                      className={`text-[11px] rounded px-2 py-1.5 border ${
                        isActive
                          ? (darkMode ? 'bg-cyan-900/40 border-cyan-500 text-cyan-100' : 'bg-cyan-50 border-cyan-400 text-cyan-800')
                          : (darkMode ? 'bg-slate-800/70 border-slate-700 text-slate-300' : 'bg-gray-50 border-gray-200 text-gray-600')
                      }`}
                    >
                      {index + 1}. {phase.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className={`text-xs font-bold mb-2 ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
                Beinschlagphasen (aktiv + passiv)
              </h3>
              <div className="grid sm:grid-cols-2 gap-1.5">
                {KICK_PHASES.map((phase) => {
                  const isModePhase = activeKickPhaseIds.includes(phase.id);
                  return (
                    <div
                      key={phase.id}
                      className={`text-[11px] rounded px-2 py-1.5 border ${
                        isModePhase
                          ? (darkMode ? 'bg-orange-900/35 border-orange-500 text-orange-100' : 'bg-orange-50 border-orange-400 text-orange-800')
                          : (darkMode ? 'bg-slate-800/70 border-slate-700 text-slate-300' : 'bg-gray-50 border-gray-200 text-gray-600')
                      }`}
                    >
                      {phase.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className={`text-xs font-bold mb-2 ${darkMode ? 'text-violet-200' : 'text-violet-700'}`}>
                Referenzphasen (Vorlagebild)
              </h3>
              <div className="grid gap-1.5">
                {REFERENCE_PHASES.map((phase) => {
                  const isActive = phase.id === activeReferencePhase.id;
                  return (
                    <div
                      key={phase.id}
                      className={`text-[11px] rounded px-2 py-1.5 border ${
                        isActive
                          ? (darkMode ? 'bg-violet-900/35 border-violet-500 text-violet-100' : 'bg-violet-50 border-violet-400 text-violet-800')
                          : (darkMode ? 'bg-slate-800/70 border-slate-700 text-slate-300' : 'bg-gray-50 border-gray-200 text-gray-600')
                      }`}
                    >
                      <div className="font-semibold">{phase.label}</div>
                      <div className="opacity-80">{phase.summary}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-3 gap-3">
        <div className={`rounded-xl border p-3 ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-bold mb-2 ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>Armzugphasen</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {ARM_PHASES.map((phase) => (
              <SelectionButton
                key={phase.id}
                active={selectedArmPhase === phase.id}
                onClick={() => {
                  setSelectedArmPhase(phase.id);
                  if (viewMode === 'deep') setDeepDiveFocus('armzug');
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{phase.label}</span>
                  <span className="text-[10px] opacity-75">#{phase.short}</span>
                </div>
              </SelectionButton>
            ))}
          </div>
        </div>

        <div className={`rounded-xl border p-3 ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-bold mb-2 ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>Beinschlag</h3>
          <div className="grid gap-2">
            {KICK_MODES.map((mode) => (
              <SelectionButton
                key={mode.id}
                active={selectedKickMode === mode.id}
                onClick={() => {
                  setSelectedKickMode(mode.id);
                  if (viewMode === 'deep') setDeepDiveFocus('beinschlag');
                }}
              >
                {mode.label}
              </SelectionButton>
            ))}
          </div>
        </div>

        <div className={`rounded-xl border p-3 ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-bold mb-2 ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>Atemtechnik</h3>
          <div className="grid gap-2">
            {BREATH_MODES.map((mode) => (
              <SelectionButton
                key={mode.id}
                active={selectedBreathingMode === mode.id}
                onClick={() => {
                  setSelectedBreathingMode(mode.id);
                  if (viewMode === 'deep') setDeepDiveFocus('atmung');
                }}
              >
                {mode.label}
              </SelectionButton>
            ))}
          </div>
        </div>
      </div>

      {viewMode === 'deep' && (
        <div className={`rounded-xl border p-3 ${darkMode ? 'bg-slate-900/55 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Deep-Dive Fokus</h3>
          <div className="flex flex-wrap gap-2">
            {DEEP_DIVE_FOCUS.map((focus) => (
              <button
                key={focus.id}
                type="button"
                onClick={() => setDeepDiveFocus(focus.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  deepDiveFocus === focus.id
                    ? 'bg-cyan-500 text-white'
                    : (darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }`}
              >
                {focus.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-3 gap-3">
        <div className={`rounded-xl border p-3 ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h4 className={`text-xs font-bold tracking-wide mb-2 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>Aktive Armzugphase</h4>
          <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{activeArmPhase.label}</div>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{activeArmPhase.hint}</p>
          <p className={`text-xs mt-2 ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>
            Fokus: {activeArmPhase.focus}
          </p>
          <p className={`text-[11px] mt-2 ${darkMode ? 'text-violet-200' : 'text-violet-700'}`}>
            Referenzbild: {activeReferencePhase.label}
          </p>
        </div>

        <div className={`rounded-xl border p-3 ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h4 className={`text-xs font-bold tracking-wide mb-2 ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>Aktueller Kick-Modus</h4>
          <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{activeKickMode.label}</div>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{activeKickMode.hint}</p>
          <p className={`text-xs mt-2 ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>{activeKickMode.details}</p>
          <div className="mt-2 space-y-1">
            {KICK_PHASES.filter((phase) => activeKickPhaseIds.includes(phase.id)).map((phase) => (
              <div key={phase.id} className={`text-[11px] ${darkMode ? 'text-orange-100' : 'text-orange-800'}`}>
                - {phase.label}: {phase.details}
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl border p-3 ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h4 className={`text-xs font-bold tracking-wide mb-2 ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Aktive Atmung</h4>
          <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{activeBreathMode.label}</div>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{activeBreathMode.hint}</p>
          <p className={`text-xs mt-2 ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>{activeBreathMode.details}</p>
        </div>
      </div>
    </div>
  );
}
