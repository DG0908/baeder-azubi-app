import { Html } from '@react-three/drei';
import type { TechniqueHotspot } from '../types';

interface TechniqueHotspotProps {
  hotspot: TechniqueHotspot;
  active: boolean;
  visible: boolean;
  onSelect: (id: string) => void;
}

export default function TechniqueHotspotMarker({
  hotspot,
  active,
  visible,
  onSelect
}: TechniqueHotspotProps) {
  if (!visible) return null;

  return (
    <group position={hotspot.anchor}>
      <Html center transform>
        <button
          type="button"
          onClick={() => onSelect(hotspot.id)}
          className={`px-2 py-1 rounded-full text-[10px] font-bold border shadow-sm transition-all ${
            active
              ? 'bg-cyan-500 text-white border-cyan-200 scale-105'
              : 'bg-slate-900/85 text-cyan-100 border-cyan-700/80 hover:bg-slate-800'
          }`}
          style={{ whiteSpace: 'nowrap' }}
        >
          {hotspot.label}
        </button>
      </Html>
      <mesh>
        <sphereGeometry args={[0.028, 14, 14]} />
        <meshStandardMaterial
          color={active ? '#06b6d4' : hotspot.color}
          emissive={active ? '#0ea5e9' : hotspot.color}
          emissiveIntensity={active ? 1.15 : 0.45}
          roughness={0.35}
          metalness={0.08}
        />
      </mesh>
    </group>
  );
}

