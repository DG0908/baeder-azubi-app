import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_HEIGHT = 'clamp(420px, 66vh, 920px)';
const PART_MODEL_HEIGHT = 'clamp(220px, 30vh, 340px)';

const DETAIL_MODES = [
  {
    id: 'schnittbild',
    label: 'Schnittbild',
    accent: '#4a9eff',
    focus: ['gehäuse', 'anode', 'kathode', 'membran', 'gleichrichter', 'solezulauf', 'chlorablauf', 'h2_entlüftung', 'steuerung', 'soletank'],
    detail: [
      'Das Schnittbild zeigt die komplette Elektrolysezelle mit Anoden- und Kathodenkammer.',
      'Membran, Elektroden und Anschlüsse sind in ihrer Einbaulage sichtbar.',
      'Soletank, Gleichrichter und Steuereinheit bilden die äußere Peripherie.',
    ],
    caution: 'Elektrolysezelle nie öffnen, solange Spannung anliegt oder Gasdruck im System ist.',
  },
  {
    id: 'prozess',
    label: 'Prozess',
    accent: '#34c090',
    focus: ['anode', 'kathode', 'membran', 'solezulauf', 'chlorablauf'],
    detail: [
      'Sole (NaCl-Lösung) strömt in die Zelle und wird elektrochemisch zerlegt.',
      'An der Anode entsteht Chlor (Cl₂), an der Kathode Wasserstoff (H₂) und Natronlauge (NaOH).',
      'Die Membran lässt nur Na⁺-Ionen durch und trennt die Reaktionsprodukte sauber.',
    ],
    caution: 'Bei zu niedriger Sole-Konzentration sinkt die Chlorproduktion und die Elektrodenbelastung steigt.',
  },
  {
    id: 'membran',
    label: 'Membrantechnik',
    accent: '#a070ff',
    focus: ['membran', 'anode', 'kathode', 'gehäuse'],
    detail: [
      'Die Ionentauschermembran (z.B. Nafion) ist das Herzstück der Membranzellenelektrolyse.',
      'Sie lässt Na⁺-Ionen passieren, blockiert aber Cl⁻ und OH⁻ zuverlässig.',
      'Beschädigung oder Verschmutzung der Membran führt zu unreinem Produkt und Leistungsverlust.',
    ],
    caution: 'Membran nie mechanisch berühren oder mit sauren/basischen Lösungen unkontrolliert spülen.',
  },
  {
    id: 'wartung',
    label: 'Wartung',
    accent: '#ffaa40',
    focus: ['anode', 'kathode', 'soletank', 'steuerung', 'gehäuse'],
    detail: [
      'Regelmäßige Entkalkung der Elektroden sichert gleichmäßige Chlorproduktion.',
      'Salzstand im Soletank täglich kontrollieren und rechtzeitig auffüllen.',
      'Zellenspannung und Stromaufnahme am Display der Steuereinheit ablesen.',
    ],
    caution: 'Wartung nur bei abgeschalteter Stromversorgung und entlüftetem System durchführen.',
  },
  {
    id: 'sicherheit',
    label: 'Sicherheit',
    accent: '#ff7a7a',
    focus: ['h2_entlüftung', 'gleichrichter', 'steuerung', 'gehäuse'],
    detail: [
      'Wasserstoff (H₂) ist hochentzündlich und muss zuverlässig abgeführt werden.',
      'Die H₂-Entlüftung darf niemals blockiert oder verschlossen sein.',
      'Gasdetektion und Ueberdrucksicherung schützen vor Knallgasbildung.',
    ],
    caution: 'Bei H₂-Alarm sofort Anlage abschalten, Raum lüften, keine ZüZündquellen!',
  },
];

const SPOTS = [
  {
    id: 'gehäuse',
    number: '1',
    short: 'Geh',
    label: 'Zellengehäuse',
    color: '#4a9eff',
    position: [0.0, 0.0, 1.4],
    items: [
      'Das Gehäuse umschliesst Anoden- und Kathodenkammer druckdicht.',
      'Material muss chemikalienbeständig und elektrisch isolierend sein.',
      'Risse oder Undichtigkeiten führen zu Chloraustritt und Kurzschluss.',
    ],
  },
  {
    id: 'anode',
    number: '2',
    short: 'An+',
    label: 'Anode (+)',
    color: '#ff6b6b',
    position: [-0.55, 0.0, 0.6],
    items: [
      'Titanelektrode mit Edelmetalloxid-Beschichtung (z.B. RuO₂/IrO₂).',
      'Hier werden Chlorid-Ionen zu Chlorgas oxidiert: 2 Cl⁻ → Cl₂ + 2 e⁻.',
      'Kalkablagerungen reduzieren die aktive Oberfläche und erhöhen den Energieverbrauch.',
    ],
  },
  {
    id: 'kathode',
    number: '3',
    short: 'Ka−',
    label: 'Kathode (−)',
    color: '#5eb7ff',
    position: [0.55, 0.0, 0.6],
    items: [
      'Stahl- oder Nickelelektrode für die Reduktionsreaktion.',
      'Hier entsteht Wasserstoff und Natronlauge: 2 H₂O + 2 e⁻ → H₂ + 2 OH⁻.',
      'Korrosion an der Kathode erhöht den Widerstand und senkt die Effizienz.',
    ],
  },
  {
    id: 'membran',
    number: '4',
    short: 'Mem',
    label: 'Membran',
    color: '#a070ff',
    position: [0.0, 0.0, 0.6],
    items: [
      'Ionentauschermembran (z.B. Nafion) trennt Anoden- und Kathodenraum.',
      'Lässt selektiv Na⁺-Ionen passieren, blockiert Cl⁻ und OH⁻.',
      'Lebensdauer hängt stark von Wasserqualität und Betriebsbedingungen ab.',
    ],
  },
  {
    id: 'gleichrichter',
    number: '5',
    short: 'GR',
    label: 'Gleichrichter',
    color: '#ffd166',
    position: [0.0, 2.2, -0.5],
    items: [
      'Wandelt Wechselstrom (AC) in Gleichstrom (DC) für die Elektrolyse.',
      'Typische Zellenspannung: 3-4 V bei hoher Stromstärke.',
      'Ueberhitzung oder Spannungsspitzen können die Elektroden beschädigen.',
    ],
  },
  {
    id: 'solezulauf',
    number: '6',
    short: 'Sole',
    label: 'Sole-Zulauf',
    color: '#34c090',
    position: [-1.6, -0.8, 0.0],
    items: [
      'Führt gesättigte Salzlösung (ca. 26% NaCl) in die Anodenkammer.',
      'Durchflussrate bestimmt die Chlorproduktionsmenge.',
      'Verstopfung oder Lufteintrag stört den Elektrolyseprozess sofort.',
    ],
  },
  {
    id: 'chlorablauf',
    number: '7',
    short: 'ClO',
    label: 'Chlor-Ablauf',
    color: '#ff7a7a',
    position: [1.6, -0.8, 0.0],
    items: [
      'Natriumhypochlorit-Lösung (NaClO) wird ins Schwimmbecken dosiert.',
      'Konzentration und pH-Wert müssen ständig ueberwacht werden.',
      'Undichte Verbindungen führen zu unkontrolliertem Chloraustritt.',
    ],
  },
  {
    id: 'h2_entlüftung',
    number: '8',
    short: 'H₂',
    label: 'H₂-Entlüftung',
    color: '#ffaa40',
    position: [0.8, 1.8, 0.6],
    items: [
      'Wasserstoff ist leichter als Luft und hochentzündlich (Knallgas!).',
      'Die Entlüftung muss ständig frei und nach außen geführt sein.',
      'Blockierte H₂-Abfuhr kann zu gefährlichem Ueberdruck führen.',
    ],
  },
  {
    id: 'steuerung',
    number: '9',
    short: 'Ctrl',
    label: 'Steuereinheit',
    color: '#f38cff',
    position: [2.2, 1.2, 0.0],
    items: [
      'Regelt Stromstärke, ueberwacht Zellenspannung und Sole-Durchfluss.',
      'Display zeigt Betriebsparameter und Fehlermeldungen an.',
      'Automatische Abschaltung bei Grenzwertüberschreitung.',
    ],
  },
  {
    id: 'soletank',
    number: '10',
    short: 'Tank',
    label: 'Soletank',
    color: '#47d0a4',
    position: [-2.2, -1.0, 0.0],
    items: [
      'Löst Salztabletten oder Steinsalz in Wasser zu gesättigter Sole.',
      'Füllstand täglich prüfen, Nachfüllung rechtzeitig sicherstellen.',
      'Verunreinigtes Salz führt zu Ablagerungen und verkürzt die Zellenlebensdauer.',
    ],
  },
];

const CALLOUTS = {
  gehäuse: [0.0, 2.4, 2.2],
  anode: [-2.4, 1.6, 0.8],
  kathode: [2.4, 1.6, 0.8],
  membran: [0.0, -2.0, 1.2],
  gleichrichter: [0.0, 3.4, -1.2],
  solezulauf: [-3.2, -1.2, 0.0],
  chlorablauf: [3.2, -1.2, 0.0],
  h2_entlüftung: [1.8, 3.2, 0.8],
  steuerung: [3.6, 2.0, 0.0],
  soletank: [-3.6, -1.6, 0.0],
};

const KENNDATEN = [
  { label: 'Zellentyp', value: 'Membranzellenelektrolyse' },
  { label: 'Elektrodenmaterial', value: 'Titan mit Edelmetalloxid-Beschichtung (Anode)' },
  { label: 'Membran', value: 'Ionentauschermembran (z.B. Nafion)' },
  { label: 'Spannung', value: '3-4 V pro Zelle' },
  { label: 'Salzverbrauch', value: 'ca. 3-4 kg NaCl pro kg Chlor' },
  { label: 'Lebensdauer Zelle', value: '8.000-12.000 Betriebsstunden' },
];

const BETRIEBSCHECKS = [
  { label: 'Salzgehalt Sole', value: 'ausreichend, Nachfüllung prüfen', ok: true },
  { label: 'Elektrodenoberfläche', value: 'kalkfrei, keine Ablagerungen', ok: true },
  { label: 'H₂-Entlüftung', value: 'frei, kein Rückstau', ok: true },
  { label: 'Chlorproduktion', value: 'stabil, Sollwert erreicht', ok: true },
  { label: 'Zellenspannung', value: 'im Normalbereich 3-4 V', ok: true },
];

const ABBILDUNGSLESART = [
  { label: 'Zelle mittig', value: 'Die Elektrolysezelle steht zentral mit sichtbarer Membran.' },
  { label: 'Anode links', value: 'Die Titanelektrode (+) liegt in der linken Kammer.' },
  { label: 'Kathode rechts', value: 'Die Stahlelektrode (−) liegt in der rechten Kammer.' },
  { label: 'Sole von unten', value: 'Der Salzzulauf kommt von unten/links in die Zelle.' },
];

const PROZESSPFAD = [
  '1 Sole aus dem Soletank in die Zelle',
  '2 Strom fliesst: Na⁺ wandert durch Membran, Cl⁻ zur Anode',
  '3 An der Anode: 2 Cl⁻ → Cl₂ (Chlorgas)',
  '4 An der Kathode: 2 H₂O → H₂ + 2 OH⁻',
  '5 NaClO-Lösung wird ins Becken dosiert',
];

function focusMatch(mode, ids) {
  return ids.some((id) => mode.focus.includes(id));
}

function FlowParticles({ running, color, start, end, speed, count, size = 0.05 }) {
  const refs = useRef([]);
  const startVec = useRef(new THREE.Vector3(...start));
  const endVec = useRef(new THREE.Vector3(...end));

  useFrame((state) => {
    if (!running) return;
    const base = state.clock.elapsedTime * speed;
    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const t = (base + index / count) % 1;
      mesh.position.lerpVectors(startVec.current, endVec.current, t);
    });
  });

  if (!running) return null;

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <mesh key={`${color}-${index}`} ref={(node) => { refs.current[index] = node; }}>
          <sphereGeometry args={[size, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} />
        </mesh>
      ))}
    </>
  );
}

function BubbleParticles({ running, color, basePosition, count }) {
  const refs = useRef([]);
  const offsets = useRef(Array.from({ length: count }, () => Math.random()));

  useFrame((state) => {
    if (!running) return;
    const time = state.clock.elapsedTime;
    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const offset = offsets.current[index];
      const t = (time * 0.4 + offset) % 1;
      mesh.position.set(
        basePosition[0] + Math.sin(time * 2 + offset * 6) * 0.08,
        basePosition[1] + t * 1.8,
        basePosition[2] + Math.cos(time * 1.5 + offset * 4) * 0.06,
      );
      const scale = 0.6 + Math.sin(t * Math.PI) * 0.4;
      mesh.scale.setScalar(scale);
    });
  });

  if (!running) return null;

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <mesh key={`bubble-${index}`} ref={(node) => { refs.current[index] = node; }}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.7} />
        </mesh>
      ))}
    </>
  );
}

function PulsingElectrode({ running, position, color, emissiveColor, width, height, depth, xrayMode, emphasized }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current || !running) return;
    const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
    ref.current.material.emissiveIntensity = emphasized ? pulse + 0.3 : pulse;
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={color}
        metalness={0.62}
        roughness={0.22}
        wireframe={xrayMode}
        emissive={emissiveColor}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function CellHotspots({ activeSpot, setActiveSpot, showLabels }) {
  return (
    <>
      {SPOTS.map((spot) => {
        const isActive = activeSpot === spot.id;
        return (
          <group key={spot.id} position={spot.position}>
            <mesh onClick={(event) => { event.stopPropagation(); setActiveSpot(isActive ? null : spot.id); }}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial
                color={spot.color}
                emissive={spot.color}
                emissiveIntensity={isActive ? 1.9 : 0.9}
                transparent
                opacity={0.96}
              />
            </mesh>
            {showLabels && isActive && (
              <Html distanceFactor={10} position={[0, 0.46, 0]} center>
                <div
                  style={{
                    color: '#d7efff',
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    background: 'rgba(8, 26, 46, 0.9)',
                    padding: '3px 7px',
                    borderRadius: '999px',
                    border: `1px solid ${spot.color}`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {spot.number} {spot.short}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

function CalloutLine({ start, end, active }) {
  const { midpoint, quaternion, length } = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const direction = endVec.clone().sub(startVec);
    const safeDirection = direction.lengthSq() > 0 ? direction.clone().normalize() : new THREE.Vector3(0, 1, 0);
    const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), safeDirection);

    return {
      midpoint: startVec.clone().lerp(endVec, 0.5),
      quaternion: rotation,
      length: Math.max(direction.length(), 0.001),
    };
  }, [start, end]);

  return (
    <group position={[midpoint.x, midpoint.y, midpoint.z]} quaternion={quaternion}>
      <mesh>
        <cylinderGeometry args={[active ? 0.028 : 0.018, active ? 0.028 : 0.018, length, 10]} />
        <meshStandardMaterial
          color={active ? '#ffb0b0' : '#d84b4b'}
          emissive={active ? '#ff9d9d' : '#4c1616'}
          emissiveIntensity={active ? 0.42 : 0.16}
          metalness={0.1}
          roughness={0.28}
        />
      </mesh>
    </group>
  );
}

function CellLeaderCallouts({ activeSpot, setActiveSpot, showLabels }) {
  if (!showLabels) return null;

  return (
    <>
      {SPOTS.map((spot) => {
        const end = CALLOUTS[spot.id];
        if (!end) return null;
        const isActive = activeSpot === spot.id;

        return (
          <group key={`callout-${spot.id}`}>
            <CalloutLine start={spot.position} end={end} active={isActive} />
            <mesh position={end}>
              <sphereGeometry args={[0.08, 14, 14]} />
              <meshStandardMaterial
                color={isActive ? '#ffb0b0' : '#d84b4b'}
                emissive={isActive ? '#ff9d9d' : '#531818'}
                emissiveIntensity={isActive ? 0.42 : 0.14}
              />
            </mesh>
            <Html distanceFactor={10} position={end} center>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveSpot(isActive ? null : spot.id);
                }}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '999px',
                  border: `1px solid ${isActive ? spot.color : '#f9d1d1'}`,
                  background: '#d84b4b',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  boxShadow: isActive ? `0 0 0 2px ${spot.color}55` : '0 0 0 1px rgba(0,0,0,0.15)',
                }}
              >
                {spot.number}
              </button>
            </Html>
          </group>
        );
      })}
    </>
  );
}

function CellPartFocusModel({ spot, xrayMode }) {
  if (!spot) return null;

  const shell = {
    metalness: 0.42,
    roughness: 0.28,
    wireframe: xrayMode,
  };

  switch (spot.id) {
    case 'gehäuse':
      return (
        <group rotation={[0.2, -0.35, 0]}>
          <mesh>
            <boxGeometry args={[2.4, 1.6, 1.2]} />
            <meshStandardMaterial color="#1a3a5a" transparent opacity={0.35} {...shell} />
          </mesh>
          <mesh scale={[0.92, 0.92, 0.92]}>
            <boxGeometry args={[2.4, 1.6, 1.2]} />
            <meshStandardMaterial color={spot.color} transparent opacity={0.18} emissive={spot.color} emissiveIntensity={0.15} {...shell} />
          </mesh>
          {/* Internal divider showing membrane slot */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 1.3, 0.9]} />
            <meshStandardMaterial color="#a070ff" transparent opacity={0.4} emissive="#a070ff" emissiveIntensity={0.2} />
          </mesh>
        </group>
      );
    case 'anode':
      return (
        <group rotation={[0.15, -0.3, 0]}>
          <mesh>
            <boxGeometry args={[0.12, 1.8, 1.4]} />
            <meshStandardMaterial color="#c04030" metalness={0.7} roughness={0.18} wireframe={xrayMode} emissive="#ff6b6b" emissiveIntensity={0.35} />
          </mesh>
          {/* Surface ridges */}
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={`ridge-${i}`} position={[-0.07, -0.7 + i * 0.2, 0]}>
              <boxGeometry args={[0.03, 0.04, 1.3]} />
              <meshStandardMaterial color="#e08060" metalness={0.6} roughness={0.2} />
            </mesh>
          ))}
        </group>
      );
    case 'kathode':
      return (
        <group rotation={[0.15, 0.3, 0]}>
          <mesh>
            <boxGeometry args={[0.12, 1.8, 1.4]} />
            <meshStandardMaterial color="#3a7aaa" metalness={0.72} roughness={0.16} wireframe={xrayMode} emissive="#5eb7ff" emissiveIntensity={0.25} />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={`ridge-k-${i}`} position={[0.07, -0.7 + i * 0.2, 0]}>
              <boxGeometry args={[0.03, 0.04, 1.3]} />
              <meshStandardMaterial color="#6ab0e0" metalness={0.65} roughness={0.18} />
            </mesh>
          ))}
        </group>
      );
    case 'membran':
      return (
        <group rotation={[0.1, -0.2, 0]}>
          <mesh>
            <boxGeometry args={[0.06, 1.8, 1.4]} />
            <meshStandardMaterial
              color="#b090e0"
              transparent
              opacity={0.55}
              emissive="#a070ff"
              emissiveIntensity={0.3}
              side={THREE.DoubleSide}
              wireframe={xrayMode}
            />
          </mesh>
          {/* Texture dots representing ion channels */}
          {Array.from({ length: 20 }, (_, i) => (
            <mesh key={`ion-${i}`} position={[0, -0.8 + (i % 5) * 0.4, -0.5 + Math.floor(i / 5) * 0.3]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#d0b8ff" emissive="#c0a0ff" emissiveIntensity={0.4} />
            </mesh>
          ))}
        </group>
      );
    case 'gleichrichter':
      return (
        <group rotation={[0.1, -0.25, 0]}>
          <mesh>
            <boxGeometry args={[1.6, 0.9, 0.8]} />
            <meshStandardMaterial color="#3a3520" metalness={0.5} roughness={0.3} wireframe={xrayMode} emissive="#ffd166" emissiveIntensity={0.15} />
          </mesh>
          <Html position={[-0.45, 0, 0.42]} center distanceFactor={6}>
            <span style={{ color: '#ff6b6b', fontWeight: 900, fontSize: '14px', fontFamily: 'monospace' }}>+</span>
          </Html>
          <Html position={[0.45, 0, 0.42]} center distanceFactor={6}>
            <span style={{ color: '#5eb7ff', fontWeight: 900, fontSize: '14px', fontFamily: 'monospace' }}>−</span>
          </Html>
        </group>
      );
    case 'solezulauf':
      return (
        <group rotation={[0.3, -0.2, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 2.4, 20]} />
            <meshStandardMaterial color="#286650" metalness={0.45} roughness={0.3} wireframe={xrayMode} />
          </mesh>
          <mesh position={[0, -1.0, 0]}>
            <cylinderGeometry args={[0.28, 0.18, 0.3, 16]} />
            <meshStandardMaterial color="#34c090" metalness={0.4} roughness={0.35} wireframe={xrayMode} />
          </mesh>
          {/* Flow direction arrow */}
          <mesh position={[0, 0.5, 0]}>
            <coneGeometry args={[0.12, 0.3, 12]} />
            <meshStandardMaterial color="#34c090" emissive="#34c090" emissiveIntensity={0.3} />
          </mesh>
        </group>
      );
    case 'chlorablauf':
      return (
        <group rotation={[0.3, 0.2, -Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 2.4, 20]} />
            <meshStandardMaterial color="#5a2828" metalness={0.45} roughness={0.3} wireframe={xrayMode} />
          </mesh>
          <mesh position={[0, 1.0, 0]}>
            <coneGeometry args={[0.12, 0.3, 12]} />
            <meshStandardMaterial color="#ff7a7a" emissive="#ff7a7a" emissiveIntensity={0.3} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.16, 0.16, 2.4, 20, 1, true]} />
            <meshStandardMaterial color="#80ff80" transparent opacity={0.15} emissive="#40ff60" emissiveIntensity={0.1} />
          </mesh>
        </group>
      );
    case 'h2_entlüftung':
      return (
        <group rotation={[0, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.15, 2.6, 18]} />
            <meshStandardMaterial color="#6a5020" metalness={0.4} roughness={0.35} wireframe={xrayMode} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.25, 0.15, 0.3, 16]} />
            <meshStandardMaterial color="#ffaa40" metalness={0.35} roughness={0.4} wireframe={xrayMode} />
          </mesh>
          <BubbleParticles running color="#b8e8ff" basePosition={[0, -0.5, 0]} count={6} />
        </group>
      );
    case 'steuerung':
      return (
        <group rotation={[0.1, -0.3, 0]}>
          <mesh>
            <boxGeometry args={[1.2, 0.9, 0.5]} />
            <meshStandardMaterial color="#2a2040" metalness={0.35} roughness={0.4} wireframe={xrayMode} />
          </mesh>
          {/* Display panel */}
          <mesh position={[0, 0, 0.26]}>
            <boxGeometry args={[0.9, 0.6, 0.02]} />
            <meshStandardMaterial color="#103030" emissive="#30ff90" emissiveIntensity={0.5} />
          </mesh>
          <Html position={[0, 0, 0.3]} center distanceFactor={5}>
            <div style={{ color: '#30ff90', fontFamily: 'monospace', fontSize: '8px', textAlign: 'center' }}>
              <div>3.6V</div>
              <div>OK</div>
            </div>
          </Html>
        </group>
      );
    case 'soletank':
      return (
        <group rotation={[0.1, -0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.8, 0.8, 2.0, 24]} />
            <meshStandardMaterial color="#1a4a40" transparent opacity={0.65} metalness={0.3} roughness={0.4} wireframe={xrayMode} />
          </mesh>
          {/* Salt crystals inside */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const r = 0.3 + Math.random() * 0.3;
            return (
              <mesh key={`salt-${i}`} position={[Math.cos(angle) * r, -0.5 + Math.random() * 0.4, Math.sin(angle) * r]}>
                <boxGeometry args={[0.1, 0.08, 0.1]} />
                <meshStandardMaterial color="#f0f0f0" emissive="#e0e0e0" emissiveIntensity={0.15} />
              </mesh>
            );
          })}
          {/* Water level */}
          <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.75, 24]} />
            <meshStandardMaterial color="#40a080" transparent opacity={0.35} emissive="#34c090" emissiveIntensity={0.1} />
          </mesh>
        </group>
      );
    default:
      return (
        <mesh>
          <boxGeometry args={[1.8, 1.1, 0.8]} />
          <meshStandardMaterial color={spot.color} {...shell} />
        </mesh>
      );
  }
}

function CellPartDeepDive({ spot, xrayMode }) {
  if (!spot) return null;

  const role = spot.items[0] || 'Bauteilfunktion';
  const inspection = spot.items[1] || 'Bauteilzustand gezielt prüfen.';
  const risk = spot.items[2] || 'Abweichungen frueh dokumentieren.';

  return (
    <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid #2a5578', background: '#0b1c2e' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: '1px solid #2a5578' }}>
        <div>
          <p className="text-[11px] font-mono tracking-widest" style={{ color: spot.color }}>
            EINZELTEIL-DEEP-DIVE
          </p>
          <h4 className="text-sm font-black text-white mt-0.5">
            {spot.number} {spot.label}
          </h4>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[11px] font-mono"
          style={{ color: '#d7efff', border: `1px solid ${spot.color}`, background: '#13304a' }}
        >
          isoliert betrachtet
        </span>
      </div>

      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="p-4" style={{ borderRight: '1px solid #234b6b' }}>
          <div style={{ width: '100%', height: PART_MODEL_HEIGHT, borderRadius: '0.8rem', overflow: 'hidden' }}>
            <Canvas camera={{ position: [0, 0.1, 4.6], fov: 34 }}>
              <color attach="background" args={['#0b1c2e']} />
              <ambientLight intensity={0.58} />
              <hemisphereLight intensity={0.68} color="#b8e1ff" groundColor="#173149" />
              <directionalLight position={[4, 5, 5]} intensity={1.28} color="#f7fcff" />
              <pointLight position={[-3, 1.4, 2]} intensity={0.95} color={spot.color} />
              <pointLight position={[2.6, 1.8, 2.8]} intensity={0.55} color="#8fd6ff" />

              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
                <circleGeometry args={[3.2, 48]} />
                <meshStandardMaterial color="#12314a" />
              </mesh>

              <CellPartFocusModel spot={spot} xrayMode={xrayMode} />

              <OrbitControls enablePan={false} minDistance={3.4} maxDistance={6.2} autoRotate autoRotateSpeed={0.65} />
            </Canvas>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="rounded-lg p-3" style={{ background: '#0c2135', border: `1px solid ${spot.color}` }}>
            <p className="text-[11px] font-mono tracking-widest mb-1" style={{ color: spot.color }}>
              BAUTEILROLLE
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#a4c6de' }}>
              {role}
            </p>
          </div>
          <div className="rounded-lg p-3" style={{ background: '#0c2135', border: '1px solid #234b6b' }}>
            <p className="text-[11px] font-mono tracking-widest mb-1" style={{ color: '#4a9eff' }}>
              PRUEFBLICK
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#a4c6de' }}>
              {inspection}
            </p>
          </div>
          <div className="rounded-lg p-3" style={{ background: '#132430', border: '1px solid #6a3434' }}>
            <p className="text-[11px] font-mono tracking-widest mb-1" style={{ color: '#ff9d9d' }}>
              STOERUNGSFOLGE
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#d7b0b0' }}>
              {risk}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getExplodedPosition(anchor) {
  const direction = anchor[0] < 0 ? -1 : 1;
  return [anchor[0] + (direction * 1.75), anchor[1] + 0.18, anchor[2] + 0.46];
}

function CellExplodedPart({ spot, xrayMode, explodedMode }) {
  if (!explodedMode || !spot) return null;

  const anchor = CALLOUTS[spot.id] || spot.position;
  const target = getExplodedPosition(anchor);

  return (
    <group>
      <CalloutLine start={spot.position} end={target} active />
      <group position={target} scale={[0.4, 0.4, 0.4]}>
        <CellPartFocusModel spot={spot} xrayMode={xrayMode} />
      </group>
    </group>
  );
}

function ElektrolyseAssembly({ running, xrayMode, activeSpot, setActiveSpot, mode, showLabels, explodedMode }) {
  const emphasized = (ids) => focusMatch(mode, ids);
  const activeSpotData = SPOTS.find((item) => item.id === activeSpot) || null;

  const shellMaterial = (baseColor, ids, opacity = 0.6) => ({
    color: baseColor,
    metalness: 0.45,
    roughness: 0.32,
    transparent: true,
    opacity: xrayMode ? 0.18 : emphasized(ids) ? opacity : opacity * 0.72,
    wireframe: xrayMode,
    emissive: emphasized(ids) ? mode.accent : '#13253a',
    emissiveIntensity: emphasized(ids) ? 0.28 : 0.08,
  });

  return (
    <group position={[0, -0.2, 0]} rotation={[0, -0.12, 0]}>
      {/* Background plane */}
      <mesh position={[0, 0.5, -1.5]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#081523" emissive="#07111d" emissiveIntensity={0.12} transparent opacity={0.95} />
      </mesh>

      {/* ===== MAIN CELL BODY (Gehäuse) ===== */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 1.8, 1.2]} />
        <meshStandardMaterial {...shellMaterial('#1a3a5a', ['gehäuse'], 0.55)} />
      </mesh>

      {/* Anode chamber (left, reddish tint) */}
      <mesh position={[-0.55, 0, 0]}>
        <boxGeometry args={[1.1, 1.6, 1.0]} />
        <meshStandardMaterial
          color="#3a1818"
          transparent
          opacity={xrayMode ? 0.1 : emphasized(['anode']) ? 0.35 : 0.2}
          emissive={emphasized(['anode']) ? '#ff6b6b' : '#2a1010'}
          emissiveIntensity={emphasized(['anode']) ? 0.2 : 0.05}
          wireframe={xrayMode}
        />
      </mesh>

      {/* Cathode chamber (right, bluish tint) */}
      <mesh position={[0.55, 0, 0]}>
        <boxGeometry args={[1.1, 1.6, 1.0]} />
        <meshStandardMaterial
          color="#141838"
          transparent
          opacity={xrayMode ? 0.1 : emphasized(['kathode']) ? 0.35 : 0.2}
          emissive={emphasized(['kathode']) ? '#5eb7ff' : '#0a1020'}
          emissiveIntensity={emphasized(['kathode']) ? 0.2 : 0.05}
          wireframe={xrayMode}
        />
      </mesh>

      {/* ===== MEMBRANE (center divider) ===== */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, 1.7, 1.05]} />
        <meshStandardMaterial
          color="#b090e0"
          transparent
          opacity={xrayMode ? 0.25 : emphasized(['membran']) ? 0.7 : 0.45}
          emissive={emphasized(['membran']) ? '#a070ff' : '#3a2060'}
          emissiveIntensity={emphasized(['membran']) ? 0.4 : 0.1}
          wireframe={xrayMode}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ===== ANODE plate (left) ===== */}
      <PulsingElectrode
        running={running}
        position={[-0.85, 0, 0]}
        color="#c04030"
        emissiveColor="#ff6b6b"
        width={0.08}
        height={1.5}
        depth={0.85}
        xrayMode={xrayMode}
        emphasized={emphasized(['anode'])}
      />

      {/* ===== CATHODE plate (right) ===== */}
      <PulsingElectrode
        running={running}
        position={[0.85, 0, 0]}
        color="#3060a0"
        emissiveColor="#5eb7ff"
        width={0.08}
        height={1.5}
        depth={0.85}
        xrayMode={xrayMode}
        emphasized={emphasized(['kathode'])}
      />

      {/* ===== GLEICHRICHTER (power supply above) ===== */}
      <mesh position={[0, 2.0, -0.5]}>
        <boxGeometry args={[1.4, 0.8, 0.6]} />
        <meshStandardMaterial {...shellMaterial('#3a3520', ['gleichrichter'], 0.88)} />
      </mesh>
      {/* + and - labels */}
      <Html position={[-0.35, 2.0, -0.18]} center distanceFactor={10}>
        <span style={{ color: '#ff6b6b', fontWeight: 900, fontSize: '11px', fontFamily: 'monospace' }}>+</span>
      </Html>
      <Html position={[0.35, 2.0, -0.18]} center distanceFactor={10}>
        <span style={{ color: '#5eb7ff', fontWeight: 900, fontSize: '11px', fontFamily: 'monospace' }}>−</span>
      </Html>
      {/* Power cables from Gleichrichter to electrodes */}
      <mesh position={[-0.45, 1.35, -0.2]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 1.6, 10]} />
        <meshStandardMaterial color="#aa3030" metalness={0.3} roughness={0.5} emissive="#ff4040" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0.45, 1.35, -0.2]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 1.6, 10]} />
        <meshStandardMaterial color="#3050aa" metalness={0.3} roughness={0.5} emissive="#4080ff" emissiveIntensity={0.1} />
      </mesh>

      {/* ===== SOLE-ZULAUF pipe (from left/below) ===== */}
      <mesh position={[-1.5, -0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.12, 0.12, 1.4, 16]} />
        <meshStandardMaterial {...shellMaterial('#286650', ['solezulauf'], 0.9)} />
      </mesh>
      <mesh position={[-1.2, -0.1, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.12, 0.5, 16]} />
        <meshStandardMaterial {...shellMaterial('#34c090', ['solezulauf'], 0.92)} />
      </mesh>

      {/* ===== CHLOR-ABLAUF pipe (to right) ===== */}
      <mesh position={[1.5, -0.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.12, 0.12, 1.4, 16]} />
        <meshStandardMaterial {...shellMaterial('#5a2828', ['chlorablauf'], 0.9)} />
      </mesh>
      <mesh position={[1.2, -0.1, 0]}>
        <cylinderGeometry args={[0.14, 0.12, 0.5, 16]} />
        <meshStandardMaterial {...shellMaterial('#ff7a7a', ['chlorablauf'], 0.92)} />
      </mesh>

      {/* ===== H2-ENTLUEFTUNG (vertical pipe, top right) ===== */}
      <mesh position={[0.7, 1.4, 0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 1.6, 14]} />
        <meshStandardMaterial {...shellMaterial('#6a5020', ['h2_entlüftung'], 0.88)} />
      </mesh>
      <mesh position={[0.7, 2.1, 0.5]}>
        <cylinderGeometry args={[0.18, 0.1, 0.25, 14]} />
        <meshStandardMaterial {...shellMaterial('#ffaa40', ['h2_entlüftung'], 0.9)} />
      </mesh>

      {/* ===== STEUEREINHEIT (control box, right side) ===== */}
      <mesh position={[2.1, 1.0, 0]}>
        <boxGeometry args={[0.8, 0.65, 0.4]} />
        <meshStandardMaterial {...shellMaterial('#2a2040', ['steuerung'], 0.9)} />
      </mesh>
      {/* Display face */}
      <mesh position={[2.1, 1.0, 0.22]}>
        <boxGeometry args={[0.55, 0.4, 0.02]} />
        <meshStandardMaterial
          color="#103030"
          emissive={running ? '#30ff90' : '#404040'}
          emissiveIntensity={running ? 0.5 : 0.1}
        />
      </mesh>
      {/* Cable from steuerung to gleichrichter */}
      <mesh position={[1.2, 1.5, -0.15]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 1.4, 10]} />
        <meshStandardMaterial color="#404060" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* ===== SOLETANK (cylinder, left side below) ===== */}
      <mesh position={[-2.2, -0.6, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 1.5, 22]} />
        <meshStandardMaterial {...shellMaterial('#1a4a40', ['soletank'], 0.65)} />
      </mesh>
      {/* Water level in tank */}
      <mesh position={[-2.2, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 22]} />
        <meshStandardMaterial color="#40a080" transparent opacity={0.3} emissive="#34c090" emissiveIntensity={0.1} />
      </mesh>
      {/* Salt crystals */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={`salt-main-${i}`} position={[-2.2 + Math.cos(angle) * 0.25, -1.0 + Math.random() * 0.3, Math.sin(angle) * 0.25]}>
            <boxGeometry args={[0.08, 0.06, 0.08]} />
            <meshStandardMaterial color="#e8e8e8" emissive="#d0d0d0" emissiveIntensity={0.1} />
          </mesh>
        );
      })}
      {/* Pipe from soletank to cell */}
      <mesh position={[-1.85, -0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
        <meshStandardMaterial color="#286650" metalness={0.4} roughness={0.35} />
      </mesh>

      {/* ===== FLOW PARTICLES ===== */}
      {/* Sole: tank → cell (yellow-green) */}
      <FlowParticles running={running} color="#7ae060" start={[-2.2, -0.6, 0]} end={[-1.2, -0.1, 0]} speed={0.3} count={6} />
      {/* Sole entering cell */}
      <FlowParticles running={running} color="#90e870" start={[-1.2, -0.1, 0]} end={[-0.6, 0, 0]} speed={0.35} count={5} />
      {/* Chlorine/NaClO exiting */}
      <FlowParticles running={running} color="#60ff80" start={[0.6, 0, 0]} end={[1.8, -0.8, 0]} speed={0.32} count={6} />
      {/* H2 bubbles rising */}
      <BubbleParticles running={running} color="#b8e8ff" basePosition={[0.7, 0.6, 0.5]} count={8} />

      {/* Leader callouts and hotspots */}
      <CellLeaderCallouts activeSpot={activeSpot} setActiveSpot={setActiveSpot} showLabels={showLabels} />
      <CellExplodedPart spot={activeSpotData} xrayMode={xrayMode} explodedMode={explodedMode} />
      <CellHotspots activeSpot={activeSpot} setActiveSpot={setActiveSpot} showLabels={showLabels} />
    </group>
  );
}

export default function ElektrolyseAnlageDeepDiveView() {
  const [xrayMode, setXrayMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [running, setRunning] = useState(true);
  const [explodedMode, setExplodedMode] = useState(false);
  const [activeMode, setActiveMode] = useState('schnittbild');
  const [activeSpot, setActiveSpot] = useState('anode');
  const [viewVersion, setViewVersion] = useState(0);

  const mode = DETAIL_MODES.find((item) => item.id === activeMode) || DETAIL_MODES[0];
  const activeSpotData = SPOTS.find((item) => item.id === activeSpot) || null;

  const innerCardStyle = {
    background: '#10273d',
    border: '1px solid #2a5578',
    borderRadius: '0.9rem',
    padding: '0.9rem',
  };

  const selectMode = (modeId) => {
    const target = DETAIL_MODES.find((item) => item.id === modeId);
    if (!target) return;
    setActiveMode(modeId);
    if (!target.focus.includes(activeSpot)) {
      setActiveSpot(target.focus[0]);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#081727', border: '1px solid #2a5578' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: '1px solid #2a5578' }}>
        <div>
          <p className="text-xs font-mono tracking-widest" style={{ color: '#4a9eff' }}>
            DEEP DIVE PLUS - ELEKTROLYSEANLAGE IM SCHNITTBILD
          </p>
          <h3 className="text-lg font-black text-white mt-0.5">Membranzellenelektrolyse mit 10 Detailpunkten</h3>
          <p className="text-xs font-mono mt-1" style={{ color: '#58789c' }}>
            Prozess - Membrantechnik - Wartung - Sicherheit
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            type="button"
            onClick={() => setRunning((prev) => !prev)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{
              background: running ? '#113b54' : '#0a1a2e',
              color: running ? '#7be6b9' : '#7ab0d0',
              border: '1px solid #1a3a5a',
            }}
          >
            {running ? 'Elektrolyse an' : 'Elektrolyse aus'}
          </button>
          <button
            type="button"
            onClick={() => setXrayMode((prev) => !prev)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{
              background: xrayMode ? '#3b185f' : '#0a1a2e',
              color: xrayMode ? '#d2adff' : '#7ab0d0',
              border: '1px solid #1a3a5a',
            }}
          >
            {xrayMode ? 'Röntgen an' : 'Röntgen aus'}
          </button>
          <button
            type="button"
            onClick={() => setShowLabels((prev) => !prev)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{ background: '#0a1a2e', color: '#7ab0d0', border: '1px solid #1a3a5a' }}
          >
            {showLabels ? 'Leitlinien an' : 'Leitlinien aus'}
          </button>
          <button
            type="button"
            onClick={() => setExplodedMode((prev) => !prev)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{
              background: explodedMode ? '#2a1d12' : '#0a1a2e',
              color: explodedMode ? '#ffcf96' : '#7ab0d0',
              border: '1px solid #1a3a5a',
            }}
          >
            {explodedMode ? 'Explosion an' : 'Explosion aus'}
          </button>
          <button
            type="button"
            onClick={() => setViewVersion((prev) => prev + 1)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{ background: '#10243a', color: '#d5ebff', border: '1px solid #2a5a90' }}
          >
            Buchansicht
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.6fr_1fr]" style={{ minHeight: 0 }}>
        <div className="p-4 lg:p-5" style={{ borderRight: '1px solid #2a5578', background: '#0a1c2d' }}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
              DETAILMODUS
            </span>
            {DETAIL_MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectMode(item.id)}
                className="rounded-md px-2.5 py-1 text-xs font-semibold"
                style={{
                  background: activeMode === item.id ? '#1e4f76' : '#0c2238',
                  color: activeMode === item.id ? '#d7efff' : '#7aa7c8',
                  border: `1px solid ${activeMode === item.id ? '#4a89bf' : '#2a5a90'}`,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid gap-2 mb-3 sm:grid-cols-4">
            {ABBILDUNGSLESART.map((item) => (
              <div
                key={item.label}
                className="rounded-lg px-3 py-2"
                style={{ background: '#11273c', border: '1px solid #234b6b' }}
              >
                <p className="text-[10px] font-mono tracking-widest" style={{ color: '#4a9eff' }}>
                  {item.label}
                </p>
                <p className="text-[11px] leading-relaxed mt-1" style={{ color: '#84a8c6' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div style={{ width: '100%', height: MODEL_HEIGHT, borderRadius: '0.85rem', overflow: 'hidden', position: 'relative' }}>
            <div
              className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg px-3 py-2"
              style={{ background: 'rgba(16, 39, 61, 0.88)', border: '1px solid #2a5578' }}
            >
              <p className="text-[10px] font-mono tracking-[0.25em]" style={{ color: '#4a9eff' }}>
                BUCHANSICHT
              </p>
              <p className="text-[11px] mt-1" style={{ color: '#8ab0c0' }}>
                Anode links, Membran mittig, Kathode rechts
              </p>
            </div>

            <Canvas
              key={viewVersion}
              dpr={[1, 1.8]}
              onPointerMissed={() => setActiveSpot(null)}
              camera={{ position: [0.2, 1.0, 10.5], fov: 43 }}
            >
              <color attach="background" args={['#081727']} />
              <ambientLight intensity={0.54} />
              <hemisphereLight intensity={0.7} color="#b4deff" groundColor="#16344d" />
              <directionalLight position={[5, 7, 5]} intensity={1.32} color="#e4f3ff" />
              <pointLight position={[-4, 2, 2]} intensity={0.95} color="#4a9eff" />
              <pointLight position={[2, 1, -3]} intensity={0.76} color="#ffaa40" />
              <pointLight position={[0, 3.2, 4]} intensity={0.5} color="#96e0ff" />

              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.25, 0]} receiveShadow>
                <planeGeometry args={[18, 18]} />
                <meshStandardMaterial color="#12314a" roughness={0.92} metalness={0.05} />
              </mesh>
              <gridHelper args={[18, 34, '#12314f', '#0a1e32']} position={[0, -2.24, 0]} />

              <ElektrolyseAssembly
                running={running}
                xrayMode={xrayMode}
                activeSpot={activeSpot}
                setActiveSpot={setActiveSpot}
                mode={mode}
                showLabels={showLabels}
                explodedMode={explodedMode}
              />

              <OrbitControls
                enablePan={false}
                minDistance={5.8}
                maxDistance={14.2}
                minPolarAngle={Math.PI * 0.14}
                maxPolarAngle={Math.PI * 0.76}
                minAzimuthAngle={-0.55}
                maxAzimuthAngle={0.45}
                target={[0, 0.4, 0]}
                autoRotate={!activeSpot}
                autoRotateSpeed={0.12}
              />
            </Canvas>
          </div>

          <div className="mt-3 text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
            ZELLENSTATUS: {running ? 'LAEUFT' : 'STEHT'} - MODUS: {mode.label.toUpperCase()} - {explodedMode ? 'EXPLOSION AKTIV' : 'STANDARDANSICHT'} - ZIEHEN ZUM DREHEN
          </div>

          <CellPartDeepDive spot={activeSpotData} xrayMode={xrayMode} />
        </div>

        <div className="p-5 space-y-3 overflow-y-auto">
          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>
              KENNDATEN
            </p>
            {KENNDATEN.map((entry) => (
              <div key={entry.label} className="flex justify-between text-sm py-1.5" style={{ borderBottom: '1px solid #0e2540' }}>
                <span style={{ color: '#456080' }}>{entry.label}</span>
                <span className="font-mono text-right ml-2" style={{ color: '#c0d8f0' }}>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: mode.accent }}>
              MODUSDETAIL: {mode.label.toUpperCase()}
            </p>
            <div className="space-y-1.5">
              {mode.detail.map((line) => (
                <p key={line} className="text-xs leading-relaxed" style={{ color: '#9ec4de' }}>
                  - {line}
                </p>
              ))}
              <p className="text-xs mt-2" style={{ color: '#f0b26d' }}>
                Achtung: {mode.caution}
              </p>
            </div>
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#34c090' }}>
              PROZESSPFAD WIE IM BILD
            </p>
            <div className="space-y-2">
              {PROZESSPFAD.map((step) => (
                <div key={step} className="rounded-lg px-3 py-2" style={{ background: '#0c2135', border: '1px solid #234b6b' }}>
                  <p className="text-xs leading-relaxed" style={{ color: '#9ec4de' }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>
              ERLAEUTERUNG NACH ABBILDUNG
            </p>
            <div className="space-y-1.5">
              {SPOTS.map((spot) => (
                <button
                  key={`legend-${spot.id}`}
                  type="button"
                  onClick={() => setActiveSpot(spot.id)}
                  className="w-full rounded-lg px-3 py-2 text-left"
                  style={{
                    background: activeSpot === spot.id ? '#163652' : '#0c2135',
                    border: `1px solid ${activeSpot === spot.id ? spot.color : '#14324f'}`,
                  }}
                >
                  <span className="text-xs font-mono" style={{ color: spot.color }}>
                    {spot.number}
                  </span>
                  <span className="text-xs ml-2" style={{ color: '#c0d8f0' }}>
                    {spot.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>
              HOTSPOT-FUNKTION
            </p>
            {activeSpotData ? (
              <div className="rounded-lg p-3 mb-2" style={{ background: '#0c2135', border: `1px solid ${activeSpotData.color}` }}>
                <p className="text-xs font-mono font-bold mb-2" style={{ color: activeSpotData.color }}>
                  {activeSpotData.number} {activeSpotData.label}
                </p>
                {activeSpotData.items.map((item) => (
                  <p key={item} className="text-xs leading-relaxed" style={{ color: '#8ab0c0' }}>
                    - {item}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-xs mb-2" style={{ color: '#8ab0c0' }}>
                Tippe einen Hotspot im Modell an.
              </p>
            )}
            <div className="grid grid-cols-2 gap-1.5">
              {SPOTS.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveSpot(spot.id)}
                  className="text-left rounded-md px-2.5 py-1.5 text-xs font-semibold"
                  style={{
                    background: activeSpot === spot.id ? '#163652' : '#11273c',
                    color: activeSpot === spot.id ? '#d3ebff' : '#86a7c1',
                    border: `1px solid ${activeSpot === spot.id ? spot.color : '#1a3a5a'}`,
                  }}
                >
                  {spot.number} {spot.label}
                </button>
              ))}
            </div>
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#34c090' }}>
              BETRIEBSCHECK
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {BETRIEBSCHECKS.map((check) => (
                <div key={check.label} className="rounded-lg p-2" style={{ background: '#0c2135', border: `1px solid ${check.ok ? '#2b6a52' : '#6a3434'}` }}>
                  <div style={{ color: '#456080' }}>{check.label}</div>
                  <div className="font-mono font-bold" style={{ color: check.ok ? '#34c090' : '#d04040' }}>
                    {check.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
