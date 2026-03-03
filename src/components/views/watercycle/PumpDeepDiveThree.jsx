import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_HEIGHT = 'clamp(360px, 64vh, 820px)';

const PUMP_SPOT_DATA = {
  laufrad: {
    color: '#4a9eff',
    icon: 'LR',
    title: 'Laufrad (Impeller)',
    items: [
      'Das Laufrad wandelt Drehenergie in Druck und Volumenstrom um.',
      'Mehr Durchfluss bedeutet weniger Foerderhoehe auf der Pumpenkurve.',
      'Ablagerungen und Abrieb am Schaufelprofil reduzieren den Wirkungsgrad.',
    ],
  },
  saugseite: {
    color: '#34c090',
    icon: 'SU',
    title: 'Saugseite',
    items: [
      'Ansaugung aus dem Schwallwasserbehaelter in die Pumpenkammer.',
      'Saugleitung moeglichst kurz, dicht und strömungsguenstig auslegen.',
      'Luft in der Saugleitung foerdert Kavitation und Leistungseinbruch.',
    ],
  },
  druckseite: {
    color: '#ffaa40',
    icon: 'DR',
    title: 'Druckseite',
    items: [
      'Auslass zur weiteren Aufbereitung (Flockung, Filter, Desinfektion).',
      'Druckstossarme Fahrweise verhindert Belastung der Verrohrung.',
      'Manometer und Volumenstrom gemeinsam bewerten, nicht isoliert.',
    ],
  },
  motor: {
    color: '#d04040',
    icon: 'MO',
    title: 'Antriebsmotor',
    items: [
      'Drehstrommotor mit stabiler Drehzahl fuer gleichmaessige Foerderung.',
      'Lagerzustand und thermischer Schutz sind betriebsentscheidend.',
      'Frequenzumrichter ermoeglicht effiziente Lastanpassung.',
    ],
  },
};

const PUMP_SPOTS = [
  { id: 'laufrad', label: 'Laufrad', color: '#4a9eff', position: [0.1, 0.8, 0.05] },
  { id: 'saugseite', label: 'Saugseite', color: '#34c090', position: [-3.05, 0.8, 0] },
  { id: 'druckseite', label: 'Druckseite', color: '#ffaa40', position: [1.25, 2.2, 0] },
  { id: 'motor', label: 'Motor', color: '#d04040', position: [2.85, 0.2, 0] },
];

function FlowParticles({ running, color, start, end, speed = 0.32, count = 8 }) {
  const refs = useRef([]);
  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);

  useFrame((state) => {
    if (!running) return;
    const tBase = state.clock.elapsedTime * speed;
    refs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const t = (tBase + idx / count) % 1;
      mesh.position.lerpVectors(startVec, endVec, t);
    });
  });

  if (!running) return null;

  return (
    <>
      {Array.from({ length: count }, (_, idx) => (
        <mesh key={idx} ref={(node) => { refs.current[idx] = node; }}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} />
        </mesh>
      ))}
    </>
  );
}

function RotatingImpeller({ running, xrayMode }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current || !running) return;
    ref.current.rotation.x += delta * 3.8;
  });

  const bladeMaterial = (
    <meshStandardMaterial
      color="#6fb5ff"
      metalness={0.5}
      roughness={0.28}
      wireframe={xrayMode}
      emissive="#2e5a8f"
      emissiveIntensity={xrayMode ? 0.45 : 0.2}
    />
  );

  return (
    <group ref={ref} position={[0.1, 0.8, 0.05]}>
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 0.34, 28]} />
        <meshStandardMaterial color="#8fc8ff" metalness={0.55} roughness={0.25} wireframe={xrayMode} />
      </mesh>
      {Array.from({ length: 6 }, (_, idx) => {
        const angle = (idx / 6) * Math.PI * 2;
        return (
          <mesh key={idx} rotation={[0, 0, angle]} position={[0, 0, 0]}>
            <boxGeometry args={[0.14, 0.62, 0.05]} />
            {bladeMaterial}
          </mesh>
        );
      })}
    </group>
  );
}

function PumpAssembly({ running, xrayMode, activeSpot, setActiveSpot }) {
  const shellMaterial = {
    color: '#123250',
    metalness: 0.6,
    roughness: 0.25,
    transparent: true,
    opacity: xrayMode ? 0.18 : 0.58,
    wireframe: xrayMode,
  };

  return (
    <group position={[0, -0.2, 0]}>
      <mesh position={[-0.2, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.45, 1.45, 2.55, 56, 1, true]} />
        <meshStandardMaterial {...shellMaterial} />
      </mesh>
      <mesh position={[-1.45, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.52, 0.52, 0.26, 40]} />
        <meshStandardMaterial color="#1c4269" metalness={0.45} roughness={0.32} wireframe={xrayMode} />
      </mesh>
      <mesh position={[1.05, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.45, 0.45, 0.24, 40]} />
        <meshStandardMaterial color="#1c4269" metalness={0.45} roughness={0.32} wireframe={xrayMode} />
      </mesh>

      <mesh position={[-3.0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, 2.6, 28]} />
        <meshStandardMaterial color="#235d8f" metalness={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[1.25, 2.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 1.9, 28]} />
        <meshStandardMaterial color="#2b6a98" metalness={0.35} roughness={0.35} />
      </mesh>

      <mesh position={[2.85, 0.2, 0]}>
        <boxGeometry args={[2.15, 1.6, 1.6]} />
        <meshStandardMaterial
          color={xrayMode ? '#2f1f1f' : '#1a1f2b'}
          metalness={0.38}
          roughness={0.45}
          transparent
          opacity={xrayMode ? 0.35 : 0.92}
          wireframe={xrayMode}
        />
      </mesh>
      {Array.from({ length: 6 }, (_, idx) => (
        <mesh key={idx} position={[2.0 + idx * 0.33, 0.2, 0]}>
          <boxGeometry args={[0.08, 1.45, 1.45]} />
          <meshStandardMaterial color="#29364a" metalness={0.25} roughness={0.55} />
        </mesh>
      ))}

      <RotatingImpeller running={running} xrayMode={xrayMode} />

      <FlowParticles running={running} color="#4a9eff" start={[-4.1, 0.8, 0]} end={[-1.55, 0.8, 0]} />
      <FlowParticles running={running} color="#ffaa40" start={[1.1, 0.9, 0]} end={[1.1, 2.8, 0]} speed={0.38} />

      {PUMP_SPOTS.map((spot) => {
        const isActive = activeSpot === spot.id;
        return (
          <group key={spot.id} position={spot.position}>
            <mesh onClick={(e) => { e.stopPropagation(); setActiveSpot(isActive ? null : spot.id); }}>
              <sphereGeometry args={[0.14, 18, 18]} />
              <meshStandardMaterial
                color={spot.color}
                emissive={spot.color}
                emissiveIntensity={isActive ? 1.8 : 0.85}
                transparent
                opacity={0.95}
              />
            </mesh>
            <Html distanceFactor={10} position={[0, 0.23, 0]} center>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSpot(isActive ? null : spot.id);
                }}
                style={{
                  border: `1px solid ${spot.color}`,
                  color: spot.color,
                  background: isActive ? '#081a2e' : 'rgba(8, 26, 46, 0.55)',
                  borderRadius: '999px',
                  fontSize: '10px',
                  padding: '2px 6px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                + {spot.label}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function PumpDeepDiveThree({ metrics, xrayMode = false }) {
  const [spot, setSpot] = useState('laufrad');
  const running = metrics.flowRate > 0;
  const activeData = spot ? PUMP_SPOT_DATA[spot] : null;

  return (
    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#040d1a' }}>
      <div style={{ width: '100%', height: MODEL_HEIGHT }}>
        <Canvas dpr={[1, 1.8]} onPointerMissed={() => setSpot(null)}>
          <color attach="background" args={['#040d1a']} />
          <ambientLight intensity={0.35} />
          <hemisphereLight intensity={0.45} color="#8bc8ff" groundColor="#102030" />
          <directionalLight position={[5, 7, 5]} intensity={1.1} color="#d8ecff" />
          <pointLight position={[-4, 2, 2]} intensity={0.75} color="#4a9eff" />
          <pointLight position={[2, 1, -3]} intensity={0.55} color="#ffaa40" />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
            <planeGeometry args={[18, 18]} />
            <meshStandardMaterial color="#071426" roughness={0.9} metalness={0.05} />
          </mesh>
          <gridHelper args={[18, 32, '#12314f', '#0a1e32']} position={[0, -2.19, 0]} />

          <PumpAssembly running={running} xrayMode={xrayMode} activeSpot={spot} setActiveSpot={setSpot} />

          <OrbitControls
            enablePan={false}
            minDistance={4.8}
            maxDistance={10}
            minPolarAngle={Math.PI * 0.16}
            maxPolarAngle={Math.PI * 0.72}
            target={[0, 0.8, 0]}
            autoRotate={!running}
            autoRotateSpeed={0.28}
          />
        </Canvas>
      </div>

      <div style={{ position: 'absolute', top: 10, right: 10, background: '#0a1a2e', border: '1px solid #1a3a5a', borderRadius: 6, padding: '8px 10px' }}>
        <div style={{ color: '#5f86a8', fontFamily: 'monospace', fontSize: 10 }}>VOLUMENSTROM</div>
        <div style={{ color: running ? '#4a9eff' : '#5f86a8', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 18, lineHeight: 1.1 }}>{metrics.flowRate}</div>
        <div style={{ color: '#5f86a8', fontFamily: 'monospace', fontSize: 10 }}>m3/h</div>
      </div>

      <div style={{ position: 'absolute', left: 10, top: 10, color: '#5f86a8', fontFamily: 'monospace', fontSize: 10 }}>
        {running ? 'PUMPE LAEUFT | ZIEHEN ZUM DREHEN' : 'PUMPE AUS | ZIEHEN ZUM DREHEN'}
      </div>

      {activeData && (
        <div style={{ background: 'linear-gradient(to bottom,#0a1828,#040d1a)', borderTop: `2px solid ${activeData.color}`, padding: '10px 12px', maxHeight: '210px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ color: activeData.color, fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {activeData.icon} {activeData.title}
            </span>
            <button
              type="button"
              onClick={() => setSpot(null)}
              style={{ background: 'transparent', border: '1px solid #1a3a5a', borderRadius: '4px', color: '#5a8090', fontSize: '11px', padding: '2px 7px', cursor: 'pointer' }}
            >
              X
            </button>
          </div>
          {activeData.items.map((item) => (
            <p key={item} style={{ color: '#8ab0c0', fontSize: '10px', fontFamily: 'monospace', margin: '2px 0', lineHeight: '1.5' }}>
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
