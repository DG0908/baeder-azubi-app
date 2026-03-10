import { useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ArmKeyframe, BodyKeyframe, SwimStyleData } from '../types';
import { lerpArmKeyframe, lerpBodyKeyframe, sampleLoopedKeyframes, wrap01 } from '../lib/animation';
import TechniqueHotspotMarker from './TechniqueHotspot';

interface SwimmerModelProps {
  styleData: SwimStyleData;
  isPlaying: boolean;
  speedMultiplier: number;
  phaseMode: boolean;
  phaseIndex: number;
  showHotspots: boolean;
  showTechniqueAreas: boolean;
  activeHotspotId: string | null;
  onSelectHotspot: (id: string) => void;
  onPhaseChange: (phaseIndex: number) => void;
}

const dampEuler = (
  ref: MutableRefObject<THREE.Group | null>,
  target: [number, number, number],
  delta: number,
  lambda = 11
) => {
  if (!ref.current) return;
  ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, target[0], lambda, delta);
  ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, target[1], lambda, delta);
  ref.current.rotation.z = THREE.MathUtils.damp(ref.current.rotation.z, target[2], lambda, delta);
};

export default function SwimmerModel({
  styleData,
  isPlaying,
  speedMultiplier,
  phaseMode,
  phaseIndex,
  showHotspots,
  showTechniqueAreas,
  activeHotspotId,
  onSelectHotspot,
  onPhaseChange
}: SwimmerModelProps) {
  const rootRef = useRef<THREE.Group | null>(null);
  const torsoRef = useRef<THREE.Group | null>(null);
  const upperTorsoRef = useRef<THREE.Group | null>(null);
  const pelvisRef = useRef<THREE.Group | null>(null);
  const headRef = useRef<THREE.Group | null>(null);

  const leftShoulderRef = useRef<THREE.Group | null>(null);
  const leftElbowRef = useRef<THREE.Group | null>(null);
  const rightShoulderRef = useRef<THREE.Group | null>(null);
  const rightElbowRef = useRef<THREE.Group | null>(null);

  const leftHipRef = useRef<THREE.Group | null>(null);
  const leftKneeRef = useRef<THREE.Group | null>(null);
  const leftAnkleRef = useRef<THREE.Group | null>(null);
  const rightHipRef = useRef<THREE.Group | null>(null);
  const rightKneeRef = useRef<THREE.Group | null>(null);
  const rightAnkleRef = useRef<THREE.Group | null>(null);

  const progressRef = useRef(0);
  const phaseRef = useRef(0);

  const activeArea = useMemo(() => {
    const hotspot = styleData.hotspots.find((item) => item.id === activeHotspotId);
    return hotspot?.area ?? null;
  }, [activeHotspotId, styleData.hotspots]);

  const palette = useMemo(() => {
    const shouldHighlight = (areas: string[]) => showTechniqueAreas && (activeArea ? areas.includes(activeArea) || activeArea === 'timing' : true);
    return {
      skin: shouldHighlight(['head', 'breathing']) ? '#ffd5b7' : '#eec19c',
      skinShade: '#d4a37f',
      suitMain: shouldHighlight(['timing', 'bodyline', 'rotation']) ? '#f97316' : '#dc5d2f',
      suitAccent: '#b94824',
      armLeft: shouldHighlight(['left-arm']) ? '#67e8f9' : '#e9b894',
      armRight: shouldHighlight(['right-arm']) ? '#22d3ee' : '#e9b894',
      leg: shouldHighlight(['kick']) ? '#fdba74' : '#e4b28d',
      cap: '#111827',
      goggle: '#1f2937',
      marker: '#0ea5e9'
    };
  }, [activeArea, showTechniqueAreas]);

  useFrame((_, delta) => {
    // Loop progress is driven by style config and can be reused for other swim styles.
    if (isPlaying) {
      const phaseSpeed = speedMultiplier / styleData.animation.loopDuration;
      progressRef.current = wrap01(progressRef.current + (delta * phaseSpeed));
    }

    const safePhaseIndex = ((phaseIndex % styleData.phases.length) + styleData.phases.length) % styleData.phases.length;
    const phaseProgress = phaseMode && !isPlaying ? styleData.phases[safePhaseIndex].t : progressRef.current;
    const phaseCursor = Math.floor(phaseProgress * styleData.phases.length) % styleData.phases.length;
    if (phaseCursor !== phaseRef.current) {
      phaseRef.current = phaseCursor;
      onPhaseChange(phaseCursor);
    }

    const body = sampleLoopedKeyframes<BodyKeyframe>(
      styleData.animation.bodyFrames,
      phaseProgress,
      (frame) => frame.t,
      lerpBodyKeyframe
    );
    const leftArm = sampleLoopedKeyframes<ArmKeyframe>(
      styleData.animation.leftArmFrames,
      phaseProgress,
      (frame) => frame.t,
      lerpArmKeyframe
    );
    const rightArm = sampleLoopedKeyframes<ArmKeyframe>(
      styleData.animation.rightArmFrames,
      phaseProgress,
      (frame) => frame.t,
      lerpArmKeyframe
    );

    const kickWave = Math.sin((phaseProgress * Math.PI * 2) * styleData.animation.kickFrequency);
    const kickBlend = styleData.animation.kickAmplitude;

    if (rootRef.current) {
      rootRef.current.position.x = body.surge * 0.5;
      rootRef.current.position.y = 0.22 + body.heave;
      rootRef.current.rotation.z = THREE.MathUtils.damp(rootRef.current.rotation.z, body.roll, 8, delta);
      rootRef.current.rotation.x = THREE.MathUtils.damp(rootRef.current.rotation.x, body.pitch, 8, delta);
      rootRef.current.rotation.y = THREE.MathUtils.damp(rootRef.current.rotation.y, body.yaw, 8, delta);
    }

    if (torsoRef.current) {
      torsoRef.current.rotation.x = THREE.MathUtils.damp(torsoRef.current.rotation.x, body.pitch * 0.95, 8, delta);
    }
    if (upperTorsoRef.current) {
      upperTorsoRef.current.rotation.z = THREE.MathUtils.damp(upperTorsoRef.current.rotation.z, body.roll * 0.96, 8, delta);
    }
    if (pelvisRef.current) {
      pelvisRef.current.rotation.z = THREE.MathUtils.damp(pelvisRef.current.rotation.z, -body.roll * 0.58, 8, delta);
    }

    dampEuler(leftShoulderRef, leftArm.shoulder, delta, 10);
    dampEuler(leftElbowRef, leftArm.elbow, delta, 10);
    dampEuler(rightShoulderRef, rightArm.shoulder, delta, 10);
    dampEuler(rightElbowRef, rightArm.elbow, delta, 10);

    const leftHip = body.leftHip + kickWave * kickBlend;
    const rightHip = body.rightHip - kickWave * kickBlend;
    const leftKnee = body.leftKnee + Math.max(0, -kickWave) * (kickBlend * 0.68);
    const rightKnee = body.rightKnee + Math.max(0, kickWave) * (kickBlend * 0.68);
    const leftAnkle = body.leftAnkle + kickWave * (kickBlend * 0.5);
    const rightAnkle = body.rightAnkle - kickWave * (kickBlend * 0.5);

    dampEuler(leftHipRef, [leftHip, 0, 0], delta, 10);
    dampEuler(rightHipRef, [rightHip, 0, 0], delta, 10);
    dampEuler(leftKneeRef, [leftKnee, 0, 0], delta, 10);
    dampEuler(rightKneeRef, [rightKnee, 0, 0], delta, 10);
    dampEuler(leftAnkleRef, [leftAnkle, 0, 0], delta, 10);
    dampEuler(rightAnkleRef, [rightAnkle, 0, 0], delta, 10);

    if (headRef.current) {
      // Head pose combines base frame posture + breathing timing from the data profile.
      headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, body.headYaw, 8, delta);
      headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, body.headPitch, 8, delta);
    }
  });

  return (
    <group ref={rootRef} position={[0, 0.22, 0]}>
      <group ref={torsoRef}>
        <group ref={upperTorsoRef}>
          <mesh position={[0.22, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.25, 0.52, 14, 24]} />
            <meshStandardMaterial color={palette.skin} roughness={0.72} metalness={0.01} />
          </mesh>
          <mesh position={[-0.1, 0.11, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.24, 0.62, 14, 24]} />
            <meshStandardMaterial color={palette.skin} roughness={0.72} metalness={0.01} />
          </mesh>
          <mesh position={[-0.44, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.2, 0.42, 12, 20]} />
            <meshStandardMaterial color={palette.skinShade} roughness={0.76} metalness={0.01} />
          </mesh>
        </group>

        <group ref={pelvisRef}>
          <mesh position={[-0.62, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.22, 0.38, 12, 20]} />
            <meshStandardMaterial color={palette.suitMain} roughness={0.62} metalness={0.02} />
          </mesh>
          <mesh position={[-0.62, -0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.17, 0.16, 10, 16]} />
            <meshStandardMaterial color={palette.suitAccent} roughness={0.64} metalness={0.02} />
          </mesh>
        </group>
      </group>

      <group ref={headRef} position={[0.98, 0.2, 0]}>
        <mesh scale={[1.08, 0.98, 0.9]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color={palette.skin} roughness={0.74} metalness={0.01} />
        </mesh>
        <mesh position={[0.09, 0.07, 0]} scale={[1.15, 0.62, 0.94]}>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial color={palette.cap} roughness={0.46} metalness={0.04} />
        </mesh>
        <mesh position={[0.18, 0.01, 0]}>
          <boxGeometry args={[0.16, 0.07, 0.24]} />
          <meshStandardMaterial color={palette.goggle} roughness={0.28} metalness={0.22} />
        </mesh>
      </group>

      <group ref={leftShoulderRef} position={[0.43, 0.24, 0.36]}>
        <mesh>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={palette.skinShade} roughness={0.72} metalness={0.01} />
        </mesh>
        <mesh position={[0.36, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.086, 0.56, 10, 18]} />
          <meshStandardMaterial color={palette.armLeft} roughness={0.7} metalness={0.01} />
        </mesh>
        <group ref={leftElbowRef} position={[0.71, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.073, 12, 12]} />
            <meshStandardMaterial color={palette.skinShade} roughness={0.72} metalness={0.01} />
          </mesh>
          <mesh position={[0.31, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.073, 0.5, 10, 18]} />
            <meshStandardMaterial color={palette.armLeft} roughness={0.7} metalness={0.01} />
          </mesh>
          <mesh position={[0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.045, 0.16, 8, 12]} />
            <meshStandardMaterial color={palette.skin} roughness={0.76} metalness={0.01} />
          </mesh>
        </group>
      </group>

      <group ref={rightShoulderRef} position={[0.43, 0.24, -0.36]}>
        <mesh>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={palette.skinShade} roughness={0.72} metalness={0.01} />
        </mesh>
        <mesh position={[0.36, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.086, 0.56, 10, 18]} />
          <meshStandardMaterial color={palette.armRight} roughness={0.7} metalness={0.01} />
        </mesh>
        <group ref={rightElbowRef} position={[0.71, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.073, 12, 12]} />
            <meshStandardMaterial color={palette.skinShade} roughness={0.72} metalness={0.01} />
          </mesh>
          <mesh position={[0.31, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.073, 0.5, 10, 18]} />
            <meshStandardMaterial color={palette.armRight} roughness={0.7} metalness={0.01} />
          </mesh>
          <mesh position={[0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.045, 0.16, 8, 12]} />
            <meshStandardMaterial color={palette.skin} roughness={0.76} metalness={0.01} />
          </mesh>
        </group>
      </group>

      <group ref={leftHipRef} position={[-0.66, -0.06, 0.24]}>
        <mesh>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={palette.suitMain} roughness={0.62} metalness={0.02} />
        </mesh>
        <mesh position={[-0.36, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.106, 0.62, 10, 18]} />
          <meshStandardMaterial color={palette.leg} roughness={0.7} metalness={0.01} />
        </mesh>
        <group ref={leftKneeRef} position={[-0.74, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.078, 12, 12]} />
            <meshStandardMaterial color={palette.skinShade} roughness={0.72} metalness={0.01} />
          </mesh>
          <mesh position={[-0.33, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.084, 0.56, 10, 18]} />
            <meshStandardMaterial color={palette.leg} roughness={0.7} metalness={0.01} />
          </mesh>
          <group ref={leftAnkleRef} position={[-0.67, 0, 0]}>
            <mesh position={[-0.27, -0.02, 0]} rotation={[0, 0, -0.11]}>
              <boxGeometry args={[0.39, 0.055, 0.19]} />
              <meshStandardMaterial color={palette.skin} roughness={0.78} metalness={0.01} />
            </mesh>
          </group>
        </group>
      </group>

      <group ref={rightHipRef} position={[-0.66, -0.06, -0.24]}>
        <mesh>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={palette.suitMain} roughness={0.62} metalness={0.02} />
        </mesh>
        <mesh position={[-0.36, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.106, 0.62, 10, 18]} />
          <meshStandardMaterial color={palette.leg} roughness={0.7} metalness={0.01} />
        </mesh>
        <group ref={rightKneeRef} position={[-0.74, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.078, 12, 12]} />
            <meshStandardMaterial color={palette.skinShade} roughness={0.72} metalness={0.01} />
          </mesh>
          <mesh position={[-0.33, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.084, 0.56, 10, 18]} />
            <meshStandardMaterial color={palette.leg} roughness={0.7} metalness={0.01} />
          </mesh>
          <group ref={rightAnkleRef} position={[-0.67, 0, 0]}>
            <mesh position={[-0.27, -0.02, 0]} rotation={[0, 0, -0.11]}>
              <boxGeometry args={[0.39, 0.055, 0.19]} />
              <meshStandardMaterial color={palette.skin} roughness={0.78} metalness={0.01} />
            </mesh>
          </group>
        </group>
      </group>

      {styleData.hotspots.map((hotspot) => (
        <TechniqueHotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          visible={showHotspots}
          active={activeHotspotId === hotspot.id}
          onSelect={onSelectHotspot}
        />
      ))}

      {showTechniqueAreas && (
        <group>
          <mesh position={[0.1, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.34, 1.1, 8, 16]} />
            <meshStandardMaterial color={palette.marker} transparent opacity={0.07} />
          </mesh>
        </group>
      )}
    </group>
  );
}
