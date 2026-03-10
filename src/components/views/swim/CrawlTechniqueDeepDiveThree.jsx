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

const ARM_POSES = {
  eintauchen: {
    shoulder: [-0.2, 0.35, -0.15],
    elbow: [0.55, 0.1, 0.0]
  },
  wasserfassen: {
    shoulder: [0.15, 0.1, -0.45],
    elbow: [1.0, 0.1, 0.05]
  },
  zugphase: {
    shoulder: [0.45, -0.15, -0.75],
    elbow: [1.2, -0.05, 0.08]
  },
  druckphase: {
    shoulder: [0.8, -0.3, -1.05],
    elbow: [0.75, 0.0, 0.02]
  },
  rueckholphase: {
    shoulder: [-0.55, 0.65, 0.35],
    elbow: [1.1, 0.0, -0.08]
  }
};

const NEUTRAL_ARM_POSE = {
  shoulder: [0.0, 0.0, -0.25],
  elbow: [0.7, 0.0, 0.0]
};

const phaseIndexById = ARM_PHASES.reduce((acc, phase, index) => {
  acc[phase.id] = index;
  return acc;
}, {});

const asArray3 = (value, fallback = [0, 0, 0]) => {
  if (!Array.isArray(value) || value.length < 3) return fallback;
  return [Number(value[0]) || 0, Number(value[1]) || 0, Number(value[2]) || 0];
};

const lerpArray3 = (from, to, t) => ([
  THREE.MathUtils.lerp(from[0], to[0], t),
  THREE.MathUtils.lerp(from[1], to[1], t),
  THREE.MathUtils.lerp(from[2], to[2], t)
]);

const mirrorPose = (pose) => ({
  shoulder: [pose.shoulder[0], -pose.shoulder[1], -pose.shoulder[2]],
  elbow: [pose.elbow[0], -pose.elbow[1], -pose.elbow[2]]
});

const getPoseByIndex = (index) => {
  const safeIndex = ((index % ARM_PHASES.length) + ARM_PHASES.length) % ARM_PHASES.length;
  const phase = ARM_PHASES[safeIndex];
  return {
    shoulder: asArray3(ARM_POSES[phase.id]?.shoulder),
    elbow: asArray3(ARM_POSES[phase.id]?.elbow)
  };
};

const sampleArmPose = (progress) => {
  const wrapped = ((progress % ARM_PHASES.length) + ARM_PHASES.length) % ARM_PHASES.length;
  const index = Math.floor(wrapped);
  const nextIndex = (index + 1) % ARM_PHASES.length;
  const t = wrapped - index;
  const a = getPoseByIndex(index);
  const b = getPoseByIndex(nextIndex);
  return {
    shoulder: lerpArray3(a.shoulder, b.shoulder, t),
    elbow: lerpArray3(a.elbow, b.elbow, t)
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

    return {
      skin: breathFocus ? '#ffd8b8' : '#f2c8a5',
      skinShade: '#e6b38d',
      suitMain: darkMode ? '#0ea5e9' : '#0284c7',
      suitAccent: darkMode ? '#155e75' : '#0369a1',
      joint: darkMode ? '#cbd5e1' : '#94a3b8',
      armUpper: armFocus ? '#22d3ee' : '#f1c39e',
      armLower: armFocus ? '#67e8f9' : '#eebd96',
      legUpper: kickFocus ? '#fb923c' : (darkMode ? '#60a5fa' : '#0ea5e9'),
      legLower: kickFocus ? '#fdba74' : (darkMode ? '#7dd3fc' : '#38bdf8'),
      cap: darkMode ? '#1d4ed8' : '#1e40af',
      goggle: breathFocus ? '#22d3ee' : '#334155',
      foot: '#f2c8a5',
      seam: darkMode ? '#082f49' : '#164e63'
    };
  }, [darkMode, viewMode, deepDiveFocus]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const baseSpeed = THREE.MathUtils.clamp(speed, 0.4, 1.8);
    const cycle = elapsed * baseSpeed * 0.92;
    const bodyRoll = Math.sin(elapsed * baseSpeed * 1.35) * 0.2;

    if (rootRef.current) {
      const travel = Math.sin(elapsed * baseSpeed * 0.95) * 0.14;
      const cameraYawOffset = cameraPreset === 'front' ? 0.2 : 0;
      rootRef.current.position.x = travel;
      rootRef.current.position.y = 0.34 + Math.sin(elapsed * baseSpeed * 1.8) * 0.02;
      rootRef.current.rotation.z = THREE.MathUtils.damp(rootRef.current.rotation.z, bodyRoll, 7, delta);
      rootRef.current.rotation.y = cameraYawOffset + Math.sin(elapsed * baseSpeed * 0.5) * 0.035;
      rootRef.current.rotation.x = -0.04 + Math.sin(elapsed * baseSpeed * 1.6) * 0.015;
    }

    if (torsoRef.current) {
      torsoRef.current.rotation.x = THREE.MathUtils.damp(
        torsoRef.current.rotation.x,
        Math.sin(elapsed * baseSpeed * 1.8) * 0.06,
        10,
        delta
      );
    }

    if (upperTorsoRef.current) {
      upperTorsoRef.current.rotation.z = THREE.MathUtils.damp(upperTorsoRef.current.rotation.z, bodyRoll * 0.85, 7, delta);
      upperTorsoRef.current.rotation.y = THREE.MathUtils.damp(upperTorsoRef.current.rotation.y, Math.sin(elapsed * baseSpeed * 0.9) * 0.08, 6, delta);
    }
    if (pelvisRef.current) {
      pelvisRef.current.rotation.z = THREE.MathUtils.damp(pelvisRef.current.rotation.z, -bodyRoll * 0.52, 7, delta);
      pelvisRef.current.rotation.y = THREE.MathUtils.damp(pelvisRef.current.rotation.y, -Math.sin(elapsed * baseSpeed * 0.9) * 0.05, 6, delta);
    }

    const isDeepArm = viewMode === 'deep' && deepDiveFocus === 'armzug';
    const isDeepKick = viewMode === 'deep' && deepDiveFocus === 'beinschlag';
    const isDeepBreath = viewMode === 'deep' && deepDiveFocus === 'atmung';

    let leftArmPose = sampleArmPose(cycle);
    let rightArmPose = mirrorPose(sampleArmPose(cycle + ARM_PHASES.length / 2));

    if (isDeepArm) {
      const pulse = Math.sin(elapsed * 2.4) * 0.08;
      const basePose = getPoseByIndex(selectedPhaseIndex);
      leftArmPose = {
        shoulder: [basePose.shoulder[0], basePose.shoulder[1] + pulse, basePose.shoulder[2]],
        elbow: [basePose.elbow[0] + pulse * 0.5, basePose.elbow[1], basePose.elbow[2]]
      };
      rightArmPose = mirrorPose(NEUTRAL_ARM_POSE);
    } else if (isDeepKick || isDeepBreath) {
      leftArmPose = sampleArmPose(cycle * 0.55);
      rightArmPose = mirrorPose(sampleArmPose(cycle * 0.55 + ARM_PHASES.length / 2));
    }

    dampEuler(leftShoulderRef, leftArmPose.shoulder, delta, 11);
    dampEuler(leftElbowRef, leftArmPose.elbow, delta, 11);
    dampEuler(rightShoulderRef, rightArmPose.shoulder, delta, 11);
    dampEuler(rightElbowRef, rightArmPose.elbow, delta, 11);

    const kickWave = Math.sin(elapsed * baseSpeed * (isDeepKick ? 5.9 : 4.8));
    const positive = Math.max(0, kickWave);
    const negative = Math.max(0, -kickWave);

    let activeWeight = selectedKickMode === 'aktiv' ? 1 : 0.62;
    let passiveWeight = selectedKickMode === 'passiv' ? 1 : 0.62;
    if (isDeepKick) {
      activeWeight *= 1.25;
      passiveWeight *= 1.25;
    }
    if (isDeepArm) {
      activeWeight *= 0.42;
      passiveWeight *= 0.42;
    }

    const leftHipTarget = -0.14 + (positive * 0.8 * activeWeight) - (negative * 0.55 * passiveWeight);
    const rightHipTarget = -0.14 + (negative * 0.8 * activeWeight) - (positive * 0.55 * passiveWeight);
    const leftKneeTarget = 0.24 + (negative * 0.62 * passiveWeight) + (positive * 0.18);
    const rightKneeTarget = 0.24 + (positive * 0.62 * passiveWeight) + (negative * 0.18);
    const leftAnkleTarget = -0.05 + (positive * 0.42) - (negative * 0.18);
    const rightAnkleTarget = -0.05 + (negative * 0.42) - (positive * 0.18);

    dampEuler(leftHipRef, [leftHipTarget, 0, 0], delta, 10);
    dampEuler(rightHipRef, [rightHipTarget, 0, 0], delta, 10);
    dampEuler(leftKneeRef, [leftKneeTarget, 0, 0], delta, 10);
    dampEuler(rightKneeRef, [rightKneeTarget, 0, 0], delta, 10);
    dampEuler(leftAnkleRef, [leftAnkleTarget, 0, 0], delta, 10);
    dampEuler(rightAnkleRef, [rightAnkleTarget, 0, 0], delta, 10);

    if (headRef.current) {
      let yawTarget = 0;
      let pitchTarget = 0.06;

      if (selectedBreathingMode === 'zwei_zug') {
        const cyclePhase = ((elapsed * baseSpeed * 0.64) % 1 + 1) % 1;
        yawTarget = cyclePhase > 0.72 && cyclePhase < 0.9 ? 0.58 : 0;
      } else if (selectedBreathingMode === 'drei_zug') {
        const cyclePhase = ((elapsed * baseSpeed * 0.5) % 1.5 + 1.5) % 1.5;
        if (cyclePhase > 0.2 && cyclePhase < 0.36) yawTarget = -0.5;
        if (cyclePhase > 1.02 && cyclePhase < 1.2) yawTarget = 0.5;
      } else {
        yawTarget = Math.sin(elapsed * baseSpeed * 2.1) * 0.08;
        pitchTarget = 0.07 + Math.sin(elapsed * baseSpeed * 2.1) * 0.03;
      }

      if (isDeepBreath) {
        yawTarget *= 1.35;
        pitchTarget += 0.02;
      }

      headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, yawTarget, 8, delta);
      headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, pitchTarget, 8, delta);
    }
  });

  return (
    <group ref={rootRef} position={[0, 0.34, 0]}>
      <group ref={torsoRef}>
        <group ref={upperTorsoRef}>
          <mesh position={[0.06, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.31, 1.16, 14, 28]} />
            <meshStandardMaterial color={colorPalette.suitMain} roughness={0.58} metalness={0.04} />
          </mesh>
          <mesh position={[0.26, 0.13, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.22, 0.45, 12, 20]} />
            <meshStandardMaterial color={colorPalette.suitAccent} roughness={0.62} metalness={0.03} />
          </mesh>
          <mesh position={[-0.14, 0.13, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.24, 0.64, 12, 20]} />
            <meshStandardMaterial color={colorPalette.suitAccent} roughness={0.62} metalness={0.03} />
          </mesh>
          <mesh position={[0.06, 0.12, 0]}>
            <torusGeometry args={[0.33, 0.018, 10, 48]} />
            <meshStandardMaterial color={colorPalette.seam} roughness={0.5} metalness={0.02} />
          </mesh>
        </group>

        <group ref={pelvisRef}>
          <mesh position={[-0.62, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.2, 0.46, 10, 18]} />
            <meshStandardMaterial color={colorPalette.suitMain} roughness={0.58} metalness={0.04} />
          </mesh>
        </group>
      </group>

      <group ref={headRef} position={[0.98, 0.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.235, 28, 28]} />
          <meshStandardMaterial color={colorPalette.skin} roughness={0.68} metalness={0.02} />
        </mesh>
        <mesh position={[0.11, 0.01, 0]}>
          <boxGeometry args={[0.21, 0.1, 0.27]} />
          <meshStandardMaterial color={colorPalette.goggle} roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[-0.05, 0.12, 0]}>
          <capsuleGeometry args={[0.1, 0.22, 8, 12]} />
          <meshStandardMaterial color={colorPalette.cap} roughness={0.5} metalness={0.03} />
        </mesh>
        <mesh position={[0.12, -0.17, 0]}>
          <capsuleGeometry args={[0.035, 0.08, 6, 10]} />
          <meshStandardMaterial color={colorPalette.skinShade} roughness={0.7} metalness={0.01} />
        </mesh>
      </group>

      <group ref={leftShoulderRef} position={[0.42, 0.25, 0.38]}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={colorPalette.joint} roughness={0.4} metalness={0.08} />
        </mesh>
        <mesh position={[0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.09, 0.6, 10, 18]} />
          <meshStandardMaterial color={colorPalette.armUpper} roughness={0.63} metalness={0.03} />
        </mesh>
        <mesh position={[0.76, 0, 0]}>
          <sphereGeometry args={[0.074, 14, 14]} />
          <meshStandardMaterial color={colorPalette.joint} roughness={0.4} metalness={0.08} />
        </mesh>
        <group ref={leftElbowRef} position={[0.76, 0, 0]}>
          <mesh position={[0.31, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.074, 0.52, 10, 18]} />
            <meshStandardMaterial color={colorPalette.armLower} roughness={0.63} metalness={0.03} />
          </mesh>
          <mesh position={[0.64, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.047, 0.18, 6, 12]} />
            <meshStandardMaterial color={colorPalette.skin} roughness={0.7} metalness={0.01} />
          </mesh>
        </group>
      </group>

      <group ref={rightShoulderRef} position={[0.42, 0.25, -0.38]}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={colorPalette.joint} roughness={0.4} metalness={0.08} />
        </mesh>
        <mesh position={[0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.09, 0.6, 10, 18]} />
          <meshStandardMaterial color={colorPalette.armUpper} roughness={0.63} metalness={0.03} />
        </mesh>
        <mesh position={[0.76, 0, 0]}>
          <sphereGeometry args={[0.074, 14, 14]} />
          <meshStandardMaterial color={colorPalette.joint} roughness={0.4} metalness={0.08} />
        </mesh>
        <group ref={rightElbowRef} position={[0.76, 0, 0]}>
          <mesh position={[0.31, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.074, 0.52, 10, 18]} />
            <meshStandardMaterial color={colorPalette.armLower} roughness={0.63} metalness={0.03} />
          </mesh>
          <mesh position={[0.64, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.047, 0.18, 6, 12]} />
            <meshStandardMaterial color={colorPalette.skin} roughness={0.7} metalness={0.01} />
          </mesh>
        </group>
      </group>

      <group ref={leftHipRef} position={[-0.62, -0.05, 0.24]}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={colorPalette.joint} roughness={0.4} metalness={0.08} />
        </mesh>
        <mesh position={[-0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.105, 0.62, 10, 18]} />
          <meshStandardMaterial color={colorPalette.legUpper} roughness={0.63} metalness={0.03} />
        </mesh>
        <mesh position={[-0.77, 0, 0]}>
          <sphereGeometry args={[0.082, 14, 14]} />
          <meshStandardMaterial color={colorPalette.joint} roughness={0.4} metalness={0.08} />
        </mesh>
        <group ref={leftKneeRef} position={[-0.77, 0, 0]}>
          <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.084, 0.58, 10, 18]} />
            <meshStandardMaterial color={colorPalette.legLower} roughness={0.63} metalness={0.03} />
          </mesh>
          <group ref={leftAnkleRef} position={[-0.7, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color={colorPalette.joint} roughness={0.4} metalness={0.08} />
            </mesh>
            <mesh position={[-0.26, -0.02, 0]} rotation={[0, 0, -0.08]}>
              <boxGeometry args={[0.38, 0.05, 0.2]} />
              <meshStandardMaterial color={colorPalette.foot} roughness={0.72} metalness={0.01} />
            </mesh>
          </group>
        </group>
      </group>

      <group ref={rightHipRef} position={[-0.62, -0.05, -0.24]}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={colorPalette.joint} roughness={0.4} metalness={0.08} />
        </mesh>
        <mesh position={[-0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.105, 0.62, 10, 18]} />
          <meshStandardMaterial color={colorPalette.legUpper} roughness={0.63} metalness={0.03} />
        </mesh>
        <mesh position={[-0.77, 0, 0]}>
          <sphereGeometry args={[0.082, 14, 14]} />
          <meshStandardMaterial color={colorPalette.joint} roughness={0.4} metalness={0.08} />
        </mesh>
        <group ref={rightKneeRef} position={[-0.77, 0, 0]}>
          <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.084, 0.58, 10, 18]} />
            <meshStandardMaterial color={colorPalette.legLower} roughness={0.63} metalness={0.03} />
          </mesh>
          <group ref={rightAnkleRef} position={[-0.7, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color={colorPalette.joint} roughness={0.4} metalness={0.08} />
            </mesh>
            <mesh position={[-0.26, -0.02, 0]} rotation={[0, 0, -0.08]}>
              <boxGeometry args={[0.38, 0.05, 0.2]} />
              <meshStandardMaterial color={colorPalette.foot} roughness={0.72} metalness={0.01} />
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
  const [cameraPreset, setCameraPreset] = useState('iso');
  const [selectedArmPhase, setSelectedArmPhase] = useState(ARM_PHASES[0].id);
  const [selectedKickMode, setSelectedKickMode] = useState(KICK_MODES[0].id);
  const [selectedBreathingMode, setSelectedBreathingMode] = useState(BREATH_MODES[1].id);
  const [speed, setSpeed] = useState(1);

  const activeArmPhase = ARM_PHASES.find((phase) => phase.id === selectedArmPhase) || ARM_PHASES[0];
  const activeKickMode = KICK_MODES.find((mode) => mode.id === selectedKickMode) || KICK_MODES[0];
  const activeBreathMode = BREATH_MODES.find((mode) => mode.id === selectedBreathingMode) || BREATH_MODES[0];
  const activeKickPhaseIds = KICK_MODE_TO_PHASES[selectedKickMode] || [];

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
            max="1.6"
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
            <div className="grid gap-1 sm:grid-cols-3">
              <div className={`text-[11px] rounded px-2 py-1 border ${darkMode ? 'bg-cyan-900/30 border-cyan-600 text-cyan-100' : 'bg-cyan-50 border-cyan-300 text-cyan-800'}`}>
                Armzug: <span className="font-semibold">{activeArmPhase.label}</span>
              </div>
              <div className={`text-[11px] rounded px-2 py-1 border ${darkMode ? 'bg-orange-900/30 border-orange-600 text-orange-100' : 'bg-orange-50 border-orange-300 text-orange-800'}`}>
                Beinschlag: <span className="font-semibold">{activeKickMode.label}</span>
              </div>
              <div className={`text-[11px] rounded px-2 py-1 border ${darkMode ? 'bg-emerald-900/30 border-emerald-600 text-emerald-100' : 'bg-emerald-50 border-emerald-300 text-emerald-800'}`}>
                Atmung: <span className="font-semibold">{activeBreathMode.label}</span>
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
          <div className="grid lg:grid-cols-2 gap-3">
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
