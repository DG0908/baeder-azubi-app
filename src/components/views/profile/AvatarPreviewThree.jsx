import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';

const RARITY_COLOR_MAP = {
  common: '#38bdf8',
  bronze: '#d97706',
  silver: '#94a3b8',
  gold: '#f59e0b',
  legendary: '#a855f7'
};

const normalizeDisciplineKey = (value) => {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\u00e4/g, 'ae')
    .replace(/\u00f6/g, 'oe')
    .replace(/\u00fc/g, 'ue')
    .replace(/\u00df/g, 'ss');
};

const getDisciplineColor = (discipline) => {
  const key = normalizeDisciplineKey(discipline);
  if (key.includes('technik')) return '#6366f1';
  if (key.includes('rettung') || key.includes('schwimmen')) return '#06b6d4';
  if (key.includes('hygiene')) return '#22c55e';
  if (key.includes('erste-hilfe')) return '#ef4444';
  if (key.includes('allround')) return '#f59e0b';
  return '#0ea5e9';
};

const AvatarTotem = ({ avatar }) => {
  const rootRef = useRef(null);
  const rarity = String(avatar?.rarity || 'common').toLowerCase();
  const rarityColor = RARITY_COLOR_MAP[rarity] || RARITY_COLOR_MAP.common;
  const disciplineColor = useMemo(() => getDisciplineColor(avatar?.discipline), [avatar?.discipline]);

  useFrame((_, delta) => {
    if (!rootRef.current) return;
    rootRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={rootRef} position={[0, -0.1, 0]}>
      <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.25, 1.35, 0.34, 48]} />
        <meshStandardMaterial color={rarityColor} metalness={0.6} roughness={0.35} />
      </mesh>

      <mesh position={[0, -0.55, 0]}>
        <sphereGeometry args={[0.95, 40, 40]} />
        <meshStandardMaterial color={disciplineColor} metalness={0.25} roughness={0.42} />
      </mesh>

      <Float speed={1.8} rotationIntensity={0.75} floatIntensity={0.9}>
        <mesh position={[0, 0.75, 0]}>
          <torusGeometry args={[0.72, 0.13, 24, 64]} />
          <meshStandardMaterial color={rarityColor} emissive={rarityColor} emissiveIntensity={0.16} metalness={0.8} roughness={0.28} />
        </mesh>
      </Float>

      <Float speed={2.1} rotationIntensity={0.5} floatIntensity={1.2}>
        <mesh position={[0, 1.2, 0]} rotation={[0.2, 0.4, 0.1]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#ffffff" metalness={0.35} roughness={0.2} emissive="#ffffff" emissiveIntensity={0.08} />
        </mesh>
      </Float>

      {(rarity === 'gold' || rarity === 'legendary') && (
        <Float speed={2.4} rotationIntensity={0.8} floatIntensity={1.1}>
          <mesh position={[0, 1.55, 0]}>
            <coneGeometry args={[0.48, 0.35, 8]} />
            <meshStandardMaterial color={rarityColor} metalness={0.72} roughness={0.25} />
          </mesh>
        </Float>
      )}
    </group>
  );
};

const AvatarPreviewThree = ({ avatar, darkMode }) => {
  if (!avatar) return null;

  return (
    <div className="h-56 w-full rounded-xl overflow-hidden">
      <Canvas dpr={[1, 1.7]} camera={{ position: [0, 0.8, 4.2], fov: 48 }}>
        <color attach="background" args={[darkMode ? '#0b1220' : '#e0f2fe']} />
        <ambientLight intensity={0.8} />
        <hemisphereLight intensity={0.45} groundColor={darkMode ? '#020617' : '#bae6fd'} />
        <directionalLight position={[2.4, 3.2, 2.2]} intensity={1.35} />
        <pointLight position={[-2, 1.6, 2.6]} intensity={0.65} color="#67e8f9" />
        <AvatarTotem avatar={avatar} />
        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={2.1} minPolarAngle={1.05} autoRotate autoRotateSpeed={0.65} />
      </Canvas>
    </div>
  );
};

export default AvatarPreviewThree;
