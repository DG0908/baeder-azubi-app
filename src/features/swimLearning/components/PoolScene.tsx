import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import SwimmerModel from './SwimmerModel';
import type { SpeedPreset, SwimStyleData, ViewPreset } from '../types';

interface PoolSceneProps {
  styleData: SwimStyleData;
  isPlaying: boolean;
  speedPreset: SpeedPreset;
  phaseMode: boolean;
  phaseIndex: number;
  viewPreset: ViewPreset;
  showTechniqueAreas: boolean;
  showHotspots: boolean;
  activeHotspotId: string | null;
  onSelectHotspot: (id: string) => void;
  onPhaseChange: (phaseIndex: number) => void;
}

const CAMERA_PRESETS: Record<Exclude<ViewPreset, 'free'>, { position: [number, number, number]; target: [number, number, number] }> = {
  front: { position: [4.8, 1.1, 1.4], target: [0.1, 0.18, 0] },
  side: { position: [0.1, 1.0, 5.9], target: [0.0, 0.16, 0] },
  top: { position: [0.2, 6.0, 0.8], target: [0.0, 0.16, 0] }
};

const SPEED_TO_MULTIPLIER: Record<SpeedPreset, number> = {
  slow: 0.65,
  normal: 1,
  fast: 1.35
};

function CameraRig({ viewPreset }: { viewPreset: ViewPreset }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0.16, 0));

  useFrame((_, delta) => {
    // Preset camera views can be switched at runtime for didactic analysis angles.
    if (viewPreset === 'free') return;
    const preset = CAMERA_PRESETS[viewPreset];

    camera.position.x = THREE.MathUtils.damp(camera.position.x, preset.position[0], 5.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, preset.position[1], 5.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, preset.position[2], 5.5, delta);

    targetRef.current.set(preset.target[0], preset.target[1], preset.target[2]);
    camera.lookAt(targetRef.current);
    camera.updateProjectionMatrix();
  });

  return null;
}

function PoolEnvironment({ isPlaying }: { isPlaying: boolean }) {
  const rippleRef = useRef<THREE.Mesh | null>(null);

  useFrame((_, delta) => {
    if (!rippleRef.current || !isPlaying) return;
    rippleRef.current.rotation.z += delta * 0.06;
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial color="#10314a" transparent opacity={0.86} roughness={0.28} metalness={0.05} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.18, 0]}>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial color="#d7f3ff" transparent opacity={0.22} roughness={0.16} metalness={0.03} />
      </mesh>

      <mesh ref={rippleRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <ringGeometry args={[2.5, 5.6, 64]} />
        <meshBasicMaterial color="#22b6ff" transparent opacity={0.14} />
      </mesh>

      {[-2.4, 0, 2.4].map((zOffset) => (
        <mesh key={zOffset} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.08, zOffset]}>
          <cylinderGeometry args={[0.04, 0.04, 15.5, 20]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function PoolScene({
  styleData,
  isPlaying,
  speedPreset,
  phaseMode,
  phaseIndex,
  viewPreset,
  showTechniqueAreas,
  showHotspots,
  activeHotspotId,
  onSelectHotspot,
  onPhaseChange
}: PoolSceneProps) {
  const speedMultiplier = useMemo(() => SPEED_TO_MULTIPLIER[speedPreset], [speedPreset]);

  return (
    <div className="relative h-[clamp(420px,64vh,840px)] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
      <Canvas dpr={[1, 1.8]} camera={{ position: [0.2, 1.05, 5.9], fov: 44 }}>
        <CameraRig viewPreset={viewPreset} />
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#041224', 4.8, 12]} />
        <ambientLight intensity={0.65} />
        <hemisphereLight intensity={0.42} skyColor="#7dd3fc" groundColor="#0b2538" />
        <directionalLight intensity={1.2} position={[4, 6, 3]} color="#38bdf8" />
        <pointLight intensity={0.52} position={[-3, 2, -2]} color="#ffffff" />
        <pointLight intensity={0.28} position={[2, 1.2, -3]} color="#0ea5e9" />

        <PoolEnvironment isPlaying={isPlaying} />

        <SwimmerModel
          styleData={styleData}
          isPlaying={isPlaying}
          speedMultiplier={speedMultiplier}
          phaseMode={phaseMode}
          phaseIndex={phaseIndex}
          showHotspots={showHotspots}
          showTechniqueAreas={showTechniqueAreas}
          activeHotspotId={activeHotspotId}
          onSelectHotspot={onSelectHotspot}
          onPhaseChange={onPhaseChange}
        />

        <OrbitControls
          enablePan={false}
          minDistance={3.2}
          maxDistance={8}
          minPolarAngle={0.02}
          maxPolarAngle={Math.PI / 2 - 0.02}
          target={[0, 0.16, 0]}
          enabled={viewPreset === 'free'}
        />
      </Canvas>
    </div>
  );
}
