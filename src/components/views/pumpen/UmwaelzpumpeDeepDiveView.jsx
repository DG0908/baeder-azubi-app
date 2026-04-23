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
    focus: ['beschichtung', 'filtergehaeuse', 'filterdeckel', 'filterkorb', 'laufrad', 'umfuehrungskanal'],
    detail: [
      'Das Schnittbild trennt Nass- und Trockenteil der Pumpe sichtbar auf.',
      'Filtergehaeuse, Filterdeckel und Filterkorb bilden die erste Schutzstrecke vor dem Laufrad.',
      'Umfuehrungskanal und Pumpenkammer leiten das Wasser gezielt zur Druckseite.',
    ],
    caution: 'Bei zugesetztem Vorfilter sinkt der Zulauf, Kavitation und Wirkungsgradverlust folgen.',
  },
  {
    id: 'hydraulik',
    label: 'Hydraulik',
    accent: '#34c090',
    focus: ['filterkorb', 'laufradprotektor', 'laufrad', 'motorwelle', 'umfuehrungskanal'],
    detail: [
      'Das Wasser stroemt über Filterkorb und Saugseite in die Laufradzone.',
      'Das Laufrad beschleunigt das Wasser radial und erzeugt Förderhöhe und Volumenstrom.',
      'Der Umfuehrungskanal sammelt die Energie und führt zur Druckseite weiter.',
    ],
    caution: 'Luft, Verstopfungen oder verschlissene Laufradspalte veraendern die Pumpenkennlinie sofort.',
  },
  {
    id: 'abdichtung',
    label: 'Abdichtung',
    accent: '#a070ff',
    focus: ['gleitringdichtungsprotektor', 'sealguard', 'wellenabdichtung', 'motorwelle', 'lagerung'],
    detail: [
      'Motorwelle und Wellenabdichtung trennen den wassergeführten Bereich vom Motorraum.',
      'Der Gleitringdichtungsprotektor schützt die sensible Dichtungszone gegen Störstoffe.',
      'Seal-Guard überwacht Leckage im Dichtungsbereich und meldet frühe Schäden.',
    ],
    caution: 'Schon kleine Leckagen an der Gleitringdichtung können Lager und Motorraum nachfolgend beschaedigen.',
  },
  {
    id: 'service',
    label: 'Service',
    accent: '#ffaa40',
    focus: ['service', 'filterdeckel', 'filterkorb', 'beschichtung', 'lagerung'],
    detail: [
      'Filterdeckel und Wartungspunkt müssen schnell und sicher erreichbar bleiben.',
      'Filterkorb ist ein regelmäßiger Reinigungs- und Kontrollpunkt.',
      'Beschichtung und Lagerzustand zeigen frühzeitig chemische oder mechanische Belastung.',
    ],
    caution: 'Wartung nur drucklos, abgesperrt und nach Freigabe der Anlage durchführen.',
  },
  {
    id: 'effizienz',
    label: 'Effizienz',
    accent: '#ff7a7a',
    focus: ['beschichtung', 'laufrad', 'motorwelle', 'lagerung'],
    detail: [
      'Motor, Welle, Lager und Laufrad müssen verlustarm zusammenspielen.',
      'Energieeffiziente Motoren profitieren besonders bei Teillast und sauberem Hydraulikpfad.',
      'Verschleiss am Laufrad, rauhe Beschichtung oder schwergangige Lager senken den Wirkungsgrad.',
    ],
    caution: 'Energieverbrauch nie isoliert betrachten: Volumenstrom, Druck, Temperatur und Laufzeit zusammen bewerten.',
  },
];

const PUMP_SPOTS = [
  {
    id: 'beschichtung',
    number: '1',
    short: 'Besch',
    label: 'Beschichtung',
    color: '#4a9eff',
    position: [-1.1, 0.15, 1.1],
    items: [
      'Schützt das Gehaeuse gegen Korrosion und chemische Belastung.',
      'Glatte Oberflächen reduzieren Anhaftung und hydraulische Verluste.',
      'Abplatzungen oder Unterrostung frühzeitig dokumentieren.',
    ],
  },
  {
    id: 'laufradprotektor',
    number: '2',
    short: 'LRP',
    label: 'Laufradprotektor',
    color: '#5eb7ff',
    position: [-0.45, 0.18, 0.75],
    items: [
      'Schützt den Bereich vor dem Laufrad gegen grobe Fremdkörper.',
      'Begrenzt direkte Störstoffeinwirkung auf Schaufeln und Spalt.',
      'Besonders wichtig bei Vorfilterproblemen oder Montagearbeiten.',
    ],
  },
  {
    id: 'gleitringdichtungsprotektor',
    number: '3',
    short: 'GRP',
    label: 'Gleitringdichtungsprotektor',
    color: '#8cbeff',
    position: [0.28, 1.05, 0.62],
    items: [
      'Schützt die Gleitringdichtungszone gegen Partikel und Spritzwasser.',
      'Reduziert Schmutzeintrag in die empfindliche Dichtfläche.',
      'Bei Undichtigkeiten auf Sekundaerschaeden an Welle und Lager achten.',
    ],
  },
  {
    id: 'service',
    number: '4',
    short: 'Srv',
    label: 'Service und Wartung',
    color: '#ffaa40',
    position: [-2.55, -0.05, 1.15],
    items: [
      'Wartungspunkt für schnellen Zugang zu Vorfilter und Gehaeuse.',
      'Nur im drucklosen Zustand und nach Absperrung oeffnen.',
      'Dichtungssitz, Schrauben und Deckelaufnahmen regelmäßig prüfen.',
    ],
  },
  {
    id: 'filtergehaeuse',
    number: '5',
    short: 'FG',
    label: 'Filtergehaeuse',
    color: '#34c090',
    position: [-1.95, 0.05, 0.95],
    items: [
      'Nimmt den Vorfilterkorb auf und beruhigt den Zulauf zur Pumpenkammer.',
      'Muss formstabil, dicht und mechanisch belastbar bleiben.',
      'Risse oder Spannungsmarken können auf Druckprobleme hinweisen.',
    ],
  },
  {
    id: 'filterdeckel',
    number: '6',
    short: 'FD',
    label: 'Filterdeckel',
    color: '#47d0a4',
    position: [-2.72, 0.06, 1.18],
    items: [
      'Verschliesst das Filtergehaeuse und haelt den Vorfilter dicht.',
      'Deckeldichtung muss sauber, elastisch und plan aufliegen.',
      'Unsachgemaesses Oeffnen führt oft zu Undichtigkeiten am Vorfilter.',
    ],
  },
  {
    id: 'filterkorb',
    number: '7',
    short: 'FK',
    label: 'Filterkorb',
    color: '#7ce0be',
    position: [-1.78, 0.08, 0.1],
    items: [
      'Haelt Haare, Fasern und grobe Störstoffe vor dem Laufrad zurück.',
      'Druckverlust steigt mit Verschmutzung deutlich an.',
      'Regelmäßige Reinigung schützt Hydraulik und spart Energie.',
    ],
  },
  {
    id: 'sealguard',
    number: '8',
    short: 'SG',
    label: 'Seal-Guard-System',
    color: '#a070ff',
    position: [1.7, 1.4, 1.0],
    items: [
      'Optionale Leckageueberwachung im Dichtungsbereich.',
      'Erkennt frühzeitig ansteigende Flüssigkeit im Überwachungsraum.',
      'Hilft, Dichtungsschaeden vor Motorfolgeschaeden zu erkennen.',
    ],
  },
  {
    id: 'laufrad',
    number: '9',
    short: 'LR',
    label: 'Laufrad',
    color: '#d04040',
    position: [0.02, 0.22, 0.02],
    items: [
      'Das Laufrad wandelt mechanische Antriebsleistung in Stroemungsenergie um.',
      'Schaufelform und Spaltmass bestimmen Wirkungsgrad und Kennlinie.',
      'Abrasion, Biofilm oder Störstoffe reduzieren die Förderleistung.',
    ],
  },
  {
    id: 'motorwelle',
    number: '10',
    short: 'Welle',
    label: 'Motorwelle',
    color: '#ff7a7a',
    position: [0.0, 1.18, 0.0],
    items: [
      'Überträgt das Motordrehmoment auf das Laufrad.',
      'Fluchtung und Rundlauf sind für ruhigen Betrieb kritisch.',
      'Korrosion oder Schlag führen zu Dichtungs- und Lagerschaeden.',
    ],
  },
  {
    id: 'wellenabdichtung',
    number: '11',
    short: 'WA',
    label: 'Wellenabdichtung',
    color: '#f38cff',
    position: [0.02, 0.82, 0.58],
    items: [
      'Dichtet die rotierende Welle gegen austretendes Wasser ab.',
      'Typisch als Gleitringdichtung im Bäderbereich ausgeführt.',
      'Trockenlauf und Schmutzeintrag gehören zu den häufigsten Schadensursachen.',
    ],
  },
  {
    id: 'umfuehrungskanal',
    number: '12',
    short: 'UK',
    label: 'Umfuehrungskanal',
    color: '#d8a240',
    position: [0.92, 0.56, 0.74],
    items: [
      'Führt das vom Laufrad beschleunigte Wasser im Gehaeuse weiter.',
      'Wandelt Geschwindigkeit in Druck um und reduziert Turbulenzverluste.',
      'Ablagerungen oder Beschichtungsfehler verschlechtern die Hydraulik.',
    ],
  },
  {
    id: 'lagerung',
    number: '13',
    short: 'Lager',
    label: 'Verstärkte Lagerung',
    color: '#ffd166',
    position: [0.0, 1.58, 0.25],
    items: [
      'Nimmt radiale und axiale Kraefte von Motor und Welle auf.',
      'Sauberer Lauf und Temperaturkontrolle sind zentrale Zustandsindikatoren.',
      'Lagergeraeusche oder Vibrationen deuten frueh auf Verschleiss hin.',
    ],
  },
];

const PUMP_CALLOUTS = {
  beschichtung: [-2.75, 0.92, 0.98],
  laufradprotektor: [-2.1, -0.42, 0.82],
  gleitringdichtungsprotektor: [2.15, 1.15, 0.92],
  service: [-3.5, -0.92, 1.18],
  filtergehaeuse: [-3.05, 0.18, 0.95],
  filterdeckel: [-3.88, 0.36, 1.18],
  filterkorb: [-2.45, -1.25, 0.22],
  sealguard: [2.82, 1.98, 1.04],
  laufrad: [0.95, -1.02, 0.06],
  motorwelle: [1.55, 2.15, 0.16],
  wellenabdichtung: [2.08, 0.52, 0.88],
  umfuehrungskanal: [2.95, 0.28, 0.94],
  lagerung: [1.68, 2.92, 0.34],
};

const KENNDATEN = [
  { label: 'Pumpentyp', value: 'Umwälzpumpe als Kreiselpumpe' },
  { label: 'Einbauart', value: 'Inline / Nass-Trockenteil getrennt' },
  { label: 'Vorfilter', value: 'Filterkorb vor Laufrad' },
  { label: 'Abdichtung', value: 'Wellenabdichtung / Gleitring' },
  { label: 'Leckageoption', value: 'Seal-Guard-System' },
  { label: 'Energie', value: 'Effizienter Motor + saubere Hydraulik' },
];

const BETRIEBSCHECKS = [
  { label: 'Vorfilterkorb', value: 'sauber, kein Fasereintrag', ok: true },
  { label: 'Saugseite', value: 'luftfrei, dicht, keine Kavitation', ok: true },
  { label: 'Dichtungsraum', value: 'trocken / kontrolliert', ok: true },
  { label: 'Lagerlauf', value: 'ruhig, ohne Heisslauf', ok: true },
];

const ABBILDUNGSLESART = [
  { label: 'Motor oben', value: 'Der Rippenmotor steht senkrecht über der Hydraulik, wie in deiner Vorlage.' },
  { label: 'Saugseite links', value: 'Der Vorfilter und das Filtergehaeuse liegen links vor dem Laufrad.' },
  { label: 'Druckseite rechts', value: 'Der Druckaustritt sitzt rechts am roten Gehaeusestutzen.' },
  { label: 'Dichtungszone mittig', value: 'Welle, Dichtung und Lager liegen zwischen Motor und Nassraum.' },
];

const HYDRAULIKPFAD = [
  '1 Zulauf links durch Vorfilter und Filterkorb',
  '2 Eintritt in die Laufradzone',
  '3 Energieuebergabe im Laufrad',
  '4 Druckaufbau im Umfuehrungskanal nach rechts',
];

function focusMatch(mode, ids) {
  return ids.some((id) => mode.focus.includes(id));
}

function FlowParticles({ running, color, start, end, speed, count }) {
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
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} />
        </mesh>
      ))}
    </>
  );
}

function RotatingImpeller({ running, xrayMode, emphasized }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current || !running) return;
    ref.current.rotation.x += delta * 4.4;
  });

  return (
    <group ref={ref} position={[0.02, 0.2, 0.02]}>
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 0.34, 28]} />
        <meshStandardMaterial
          color="#8fc8ff"
          metalness={0.58}
          roughness={0.24}
          wireframe={xrayMode}
          emissive={emphasized ? '#5a99e8' : '#2b4d72'}
          emissiveIntensity={emphasized ? 0.8 : 0.22}
        />
      </mesh>
      {Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2;
        return (
          <mesh key={`blade-${index}`} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.14, 0.66, 0.05]} />
            <meshStandardMaterial
              color="#67aef6"
              metalness={0.48}
              roughness={0.28}
              wireframe={xrayMode}
              emissive={emphasized ? '#4a9eff' : '#234666'}
              emissiveIntensity={emphasized ? 0.72 : 0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function PumpHotspots({ activeSpot, setActiveSpot, showLabels }) {
  return (
    <>
      {PUMP_SPOTS.map((spot) => {
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

function PumpLeaderCallouts({ activeSpot, setActiveSpot, showLabels }) {
  if (!showLabels) return null;

  return (
    <>
      {PUMP_SPOTS.map((spot) => {
        const end = PUMP_CALLOUTS[spot.id];
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

function PreviewImpeller({ xrayMode, color = '#67aef6' }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 1.8;
  });

  return (
    <group ref={ref} rotation={[0.4, 0.2, 0]}>
      <mesh>
        <cylinderGeometry args={[0.32, 0.32, 0.5, 28]} />
        <meshStandardMaterial color="#8fc8ff" metalness={0.6} roughness={0.22} wireframe={xrayMode} />
      </mesh>
      {Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2;
        return (
          <mesh key={`preview-blade-${index}`} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.18, 1.05, 0.07]} />
            <meshStandardMaterial color={color} metalness={0.44} roughness={0.24} wireframe={xrayMode} />
          </mesh>
        );
      })}
    </group>
  );
}

function PumpPartFocusModel({ spot, xrayMode }) {
  if (!spot) return null;

  const shell = {
    metalness: 0.42,
    roughness: 0.28,
    wireframe: xrayMode,
  };

  switch (spot.id) {
    case 'beschichtung':
      return (
        <group rotation={[0.2, -0.45, 0]}>
          <mesh>
            <cylinderGeometry args={[0.95, 0.95, 2.4, 40, 1, true]} />
            <meshStandardMaterial color="#123250" transparent opacity={0.42} {...shell} />
          </mesh>
          <mesh scale={[0.92, 0.92, 0.92]}>
            <cylinderGeometry args={[0.95, 0.95, 2.4, 40, 1, true]} />
            <meshStandardMaterial color={spot.color} transparent opacity={0.26} emissive={spot.color} emissiveIntensity={0.2} {...shell} />
          </mesh>
        </group>
      );
    case 'laufradprotektor':
      return (
        <group rotation={[Math.PI / 2, 0.3, 0]}>
          <mesh>
            <torusGeometry args={[0.78, 0.12, 18, 40]} />
            <meshStandardMaterial color={spot.color} {...shell} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.5, 0.06, 18, 34]} />
            <meshStandardMaterial color="#d5ecff" metalness={0.62} roughness={0.18} wireframe={xrayMode} />
          </mesh>
        </group>
      );
    case 'gleitringdichtungsprotektor':
      return (
        <group rotation={[Math.PI / 2, 0, 0.2]}>
          <mesh>
            <torusGeometry args={[0.9, 0.11, 18, 44]} />
            <meshStandardMaterial color={spot.color} {...shell} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.56, 0.06, 18, 34]} />
            <meshStandardMaterial color="#fafcff" metalness={0.64} roughness={0.16} wireframe={xrayMode} />
          </mesh>
        </group>
      );
    case 'service':
      return (
        <group rotation={[0.18, -0.35, 0]}>
          <mesh position={[0, 0, 0.2]}>
            <cylinderGeometry args={[1.1, 1.1, 0.28, 30]} />
            <meshStandardMaterial color="#376c80" {...shell} />
          </mesh>
          {Array.from({ length: 6 }, (_, index) => {
            const angle = (index / 6) * Math.PI * 2;
            return (
              <mesh key={`service-bolt-${index}`} position={[Math.cos(angle) * 0.82, Math.sin(angle) * 0.82, 0.32]}>
                <cylinderGeometry args={[0.08, 0.08, 0.18, 12]} />
                <meshStandardMaterial color="#bfcfe0" metalness={0.68} roughness={0.18} />
              </mesh>
            );
          })}
        </group>
      );
    case 'filtergehaeuse':
      return (
        <group rotation={[0.16, -0.52, 0]}>
          <mesh>
            <boxGeometry args={[2.1, 2.2, 1.25]} />
            <meshStandardMaterial color="#1d4a5d" transparent opacity={0.78} {...shell} />
          </mesh>
          <mesh scale={[0.72, 0.72, 0.82]}>
            <boxGeometry args={[2.1, 2.2, 1.25]} />
            <meshStandardMaterial color="#0a1728" transparent opacity={0.42} />
          </mesh>
        </group>
      );
    case 'filterdeckel':
      return (
        <group rotation={[0.2, -0.35, 0]}>
          <mesh>
            <cylinderGeometry args={[1.12, 1.12, 0.24, 30]} />
            <meshStandardMaterial color="#376c80" {...shell} />
          </mesh>
          {Array.from({ length: 6 }, (_, index) => {
            const angle = (index / 6) * Math.PI * 2;
            return (
              <mesh key={`deckel-bolt-${index}`} position={[Math.cos(angle) * 0.84, Math.sin(angle) * 0.84, 0.18]}>
                <cylinderGeometry args={[0.09, 0.09, 0.16, 12]} />
                <meshStandardMaterial color="#d4e1f0" metalness={0.62} roughness={0.18} />
              </mesh>
            );
          })}
        </group>
      );
    case 'filterkorb':
      return (
        <group rotation={[0.15, -0.2, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.72, 0.72, 2.6, 26, 1, true]} />
            <meshStandardMaterial color={spot.color} transparent opacity={0.86} wireframe />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <torusGeometry args={[0.72, 0.05, 16, 34]} />
            <meshStandardMaterial color="#cbe7d7" metalness={0.3} roughness={0.38} wireframe={xrayMode} />
          </mesh>
          <mesh position={[0, -0.95, 0]}>
            <torusGeometry args={[0.72, 0.05, 16, 34]} />
            <meshStandardMaterial color="#cbe7d7" metalness={0.3} roughness={0.38} wireframe={xrayMode} />
          </mesh>
        </group>
      );
    case 'sealguard':
      return (
        <group rotation={[0.1, -0.3, 0]}>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 1.3, 22]} />
            <meshStandardMaterial color="#d0edff" transparent opacity={0.58} />
          </mesh>
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.78, 14]} />
            <meshStandardMaterial color="#8fb5cc" metalness={0.44} roughness={0.28} />
          </mesh>
          <mesh position={[-0.5, -0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.9, 14]} />
            <meshStandardMaterial color="#8fb5cc" metalness={0.44} roughness={0.28} />
          </mesh>
        </group>
      );
    case 'laufrad':
      return <PreviewImpeller xrayMode={xrayMode} color={spot.color} />;
    case 'motorwelle':
      return (
        <group rotation={[0.3, 0.15, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.14, 0.14, 3.4, 24]} />
            <meshStandardMaterial color="#c7dff7" metalness={0.72} roughness={0.18} wireframe={xrayMode} />
          </mesh>
          <mesh position={[0, 0, 1.3]}>
            <cylinderGeometry args={[0.22, 0.22, 0.48, 18]} />
            <meshStandardMaterial color="#9bbde0" metalness={0.62} roughness={0.2} />
          </mesh>
        </group>
      );
    case 'wellenabdichtung':
      return (
        <group rotation={[Math.PI / 2, 0, 0.25]}>
          <mesh>
            <torusGeometry args={[0.58, 0.08, 18, 36]} />
            <meshStandardMaterial color={spot.color} {...shell} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 1.6, 18]} />
            <meshStandardMaterial color="#dce9f6" metalness={0.68} roughness={0.18} wireframe={xrayMode} />
          </mesh>
        </group>
      );
    case 'umfuehrungskanal':
      return (
        <group rotation={[0.5, -0.3, 0.5]}>
          <mesh>
            <torusGeometry args={[0.96, 0.34, 20, 40, Math.PI * 1.1]} />
            <meshStandardMaterial color={spot.color} transparent opacity={0.9} {...shell} />
          </mesh>
          <mesh scale={[0.68, 0.68, 0.68]}>
            <torusGeometry args={[0.96, 0.34, 20, 40, Math.PI * 1.1]} />
            <meshStandardMaterial color="#081523" transparent opacity={0.72} />
          </mesh>
        </group>
      );
    case 'lagerung':
      return (
        <group rotation={[Math.PI / 2, 0.2, 0]}>
          <mesh>
            <torusGeometry args={[0.96, 0.18, 18, 42]} />
            <meshStandardMaterial color="#f0cf78" metalness={0.52} roughness={0.2} wireframe={xrayMode} />
          </mesh>
          {Array.from({ length: 8 }, (_, index) => {
            const angle = (index / 8) * Math.PI * 2;
            return (
              <mesh key={`bearing-ball-${index}`} position={[Math.cos(angle) * 0.96, Math.sin(angle) * 0.96, 0]}>
                <sphereGeometry args={[0.12, 12, 12]} />
                <meshStandardMaterial color="#edf5ff" metalness={0.7} roughness={0.16} />
              </mesh>
            );
          })}
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

function PumpPartDeepDive({ spot, xrayMode }) {
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

              <PumpPartFocusModel spot={spot} xrayMode={xrayMode} />

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

function PumpExplodedPart({ spot, xrayMode, explodedMode }) {
  if (!explodedMode || !spot) return null;

  const anchor = PUMP_CALLOUTS[spot.id] || spot.position;
  const target = getExplodedPosition(anchor);

  return (
    <group>
      <CalloutLine start={spot.position} end={target} active />
      <group position={target} scale={[0.4, 0.4, 0.4]}>
        <PumpPartFocusModel spot={spot} xrayMode={xrayMode} />
      </group>
    </group>
  );
}

function PumpAssembly({ running, xrayMode, activeSpot, setActiveSpot, mode, showLabels, explodedMode }) {
  const emphasized = (ids) => focusMatch(mode, ids);
  const activeSpotData = PUMP_SPOTS.find((item) => item.id === activeSpot) || null;

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
    <group position={[0, -0.15, 0]} rotation={[0, -0.16, 0]} scale={[1, 1, 0.74]}>
      <mesh position={[0, 1.2, -1.15]}>
        <planeGeometry args={[8.4, 8.8]} />
        <meshStandardMaterial color="#081523" emissive="#07111d" emissiveIntensity={0.12} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, 2.95, 0]}>
        <cylinderGeometry args={[0.98, 0.98, 2.45, 48]} />
        <meshStandardMaterial {...shellMaterial('#193455', ['lagerung', 'motorwelle'], 0.92)} />
      </mesh>
      <mesh position={[0, 4.35, 0]}>
        <cylinderGeometry args={[1.08, 1.08, 0.55, 42]} />
        <meshStandardMaterial {...shellMaterial('#22486f', ['lagerung'], 0.94)} />
      </mesh>
      {Array.from({ length: 10 }, (_, index) => {
        const angle = (index / 10) * Math.PI * 2;
        const x = Math.cos(angle) * 0.88;
        const z = Math.sin(angle) * 0.88;
        return (
          <mesh key={`motor-fin-${index}`} position={[x, 2.95, z]} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.08, 2.3, 0.18]} />
            <meshStandardMaterial color="#29486b" metalness={0.22} roughness={0.54} />
          </mesh>
        );
      })}
      <mesh position={[1.15, 2.55, 0.42]}>
        <boxGeometry args={[0.72, 0.9, 0.9]} />
        <meshStandardMaterial {...shellMaterial('#17314d', ['service'], 0.9)} />
      </mesh>

      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[1.12, 1.12, 0.42, 40]} />
        <meshStandardMaterial {...shellMaterial('#183553', ['lagerung', 'gleitringdichtungsprotektor'], 0.88)} />
      </mesh>
      <mesh position={[0, 1.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.2, 24]} />
        <meshStandardMaterial color="#b9d7f6" metalness={0.68} roughness={0.24} emissive="#26405e" emissiveIntensity={0.18} />
      </mesh>

      <mesh position={[0.02, 0.82, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.05, 18, 36]} />
        <meshStandardMaterial {...shellMaterial('#e493ea', ['wellenabdichtung'], 0.96)} />
      </mesh>
      <mesh position={[0.28, 1.02, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.05, 18, 36]} />
        <meshStandardMaterial {...shellMaterial('#91c4ff', ['gleitringdichtungsprotektor'], 0.92)} />
      </mesh>
      <mesh position={[0.0, 1.58, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.08, 18, 36]} />
        <meshStandardMaterial {...shellMaterial('#f0cf78', ['lagerung'], 0.95)} />
      </mesh>

      <mesh position={[-0.2, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.38, 1.38, 2.7, 56, 1, true]} />
        <meshStandardMaterial {...shellMaterial('#123250', ['beschichtung', 'umfuehrungskanal', 'laufrad'], 0.58)} />
      </mesh>
      <mesh position={[-1.42, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.55, 0.55, 0.34, 40]} />
        <meshStandardMaterial {...shellMaterial('#22486f', ['filtergehaeuse'], 0.86)} />
      </mesh>
      <mesh position={[1.12, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 1.75, 36]} />
        <meshStandardMaterial {...shellMaterial('#b23c3c', ['umfuehrungskanal'], 0.94)} />
      </mesh>

      <mesh position={[-2.0, 0.2, 0.78]}>
        <boxGeometry args={[1.55, 2.0, 0.78]} />
        <meshStandardMaterial {...shellMaterial('#1d4a5d', ['filtergehaeuse', 'filterkorb'], 0.76)} />
      </mesh>
      <mesh position={[-2.78, 0.2, 0.82]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.98, 0.98, 0.2, 32]} />
        <meshStandardMaterial {...shellMaterial('#376c80', ['filterdeckel', 'service'], 0.95)} />
      </mesh>
      {Array.from({ length: 6 }, (_, index) => {
        const y = 0.8 - index * 0.32;
        return (
          <mesh key={`deck-bolt-${index}`} position={[-2.84, y, 0.86]}>
            <cylinderGeometry args={[0.08, 0.08, 0.16, 12]} />
            <meshStandardMaterial color="#8ca8c0" metalness={0.58} roughness={0.28} />
          </mesh>
        );
      })}

      <mesh position={[-1.78, 0.08, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.46, 0.46, 1.8, 24, 1, true]} />
        <meshStandardMaterial
          color="#8ed9bf"
          metalness={0.24}
          roughness={0.48}
          transparent
          opacity={xrayMode ? 0.3 : emphasized(['filterkorb']) ? 0.92 : 0.78}
          wireframe={xrayMode}
          emissive={emphasized(['filterkorb']) ? '#4fd3a0' : '#1d4a40'}
          emissiveIntensity={emphasized(['filterkorb']) ? 0.34 : 0.08}
        />
      </mesh>

      <mesh position={[-0.45, 0.18, 0.72]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.36, 0.06, 16, 30]} />
        <meshStandardMaterial {...shellMaterial('#77bfff', ['laufradprotektor'], 0.92)} />
      </mesh>

      <mesh position={[0.92, 0.56, 0.74]} rotation={[0.4, 0, 0.3]}>
        <torusGeometry args={[0.64, 0.24, 18, 36, Math.PI]} />
        <meshStandardMaterial {...shellMaterial('#b58438', ['umfuehrungskanal'], 0.8)} />
      </mesh>

      <mesh position={[1.72, 1.4, 1.0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.72, 20]} />
        <meshStandardMaterial
          color="#d0edff"
          metalness={0.12}
          roughness={0.18}
          transparent
          opacity={0.58}
          emissive={emphasized(['sealguard']) ? '#90c8ff' : '#203848'}
          emissiveIntensity={emphasized(['sealguard']) ? 0.24 : 0.06}
        />
      </mesh>
      <mesh position={[1.72, 1.07, 1.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
        <meshStandardMaterial color="#8fb5cc" metalness={0.42} roughness={0.34} />
      </mesh>
      <mesh position={[1.3, 1.06, 0.78]} rotation={[0.2, 0, -0.6]}>
        <cylinderGeometry args={[0.04, 0.04, 0.82, 16]} />
        <meshStandardMaterial color="#8fb5cc" metalness={0.42} roughness={0.34} />
      </mesh>

      <RotatingImpeller running={running} xrayMode={xrayMode} emphasized={emphasized(['laufrad'])} />

      <FlowParticles running={running} color="#34c090" start={[-3.95, 0.18, 0]} end={[-2.2, 0.18, 0]} speed={0.32} count={7} />
      <FlowParticles running={running} color="#4a9eff" start={[-1.42, 0.18, 0]} end={[0.02, 0.18, 0]} speed={0.36} count={8} />
      <FlowParticles running={running} color="#ffaa40" start={[0.38, 0.34, 0]} end={[1.9, 1.42, 0]} speed={0.38} count={8} />
      {mode.id === 'abdichtung' && (
        <FlowParticles running={running} color="#a070ff" start={[1.28, 1.05, 0.78]} end={[1.72, 1.4, 1.0]} speed={0.26} count={5} />
      )}

      <PumpLeaderCallouts activeSpot={activeSpot} setActiveSpot={setActiveSpot} showLabels={showLabels} />
      <PumpExplodedPart spot={activeSpotData} xrayMode={xrayMode} explodedMode={explodedMode} />
      <PumpHotspots activeSpot={activeSpot} setActiveSpot={setActiveSpot} showLabels={showLabels} />
    </group>
  );
}

export default function UmwälzpumpeDeepDiveView() {
  const [xrayMode, setXrayMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [running, setRunning] = useState(true);
  const [explodedMode, setExplodedMode] = useState(false);
  const [activeMode, setActiveMode] = useState('schnittbild');
  const [activeSpot, setActiveSpot] = useState('laufrad');
  const [viewVersion, setViewVersion] = useState(0);

  const mode = DETAIL_MODES.find((item) => item.id === activeMode) || DETAIL_MODES[0];
  const activeSpotData = PUMP_SPOTS.find((item) => item.id === activeSpot) || null;

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
            DEEP DIVE PLUS - UMWAELZPUMPE IM SCHNITTBILD
          </p>
          <h3 className="text-lg font-black text-white mt-0.5">Energieeffiziente Kreiselpumpe mit 13 Detailpunkten</h3>
          <p className="text-xs font-mono mt-1" style={{ color: '#58789c' }}>
            Hydraulik - Abdichtung - Service - Effizienz
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
            {running ? 'Pumpe an' : 'Pumpe aus'}
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
            {xrayMode ? 'Roentgen an' : 'Roentgen aus'}
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
                Motor oben, Vorfilter links, Druckseite rechts
              </p>
            </div>

            <Canvas
              key={viewVersion}
              dpr={[1, 1.8]}
              onPointerMissed={() => setActiveSpot(null)}
              camera={{ position: [0.2, 1.3, 11.8], fov: 43 }}
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

              <PumpAssembly
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
                target={[0, 0.75, 0]}
                autoRotate={!activeSpot}
                autoRotateSpeed={0.12}
              />
            </Canvas>
          </div>

          <div className="mt-3 text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
            PUMPENSTATUS: {running ? 'LAEUFT' : 'STEHT'} - MODUS: {mode.label.toUpperCase()} - {explodedMode ? 'EXPLOSION AKTIV' : 'STANDARDANSICHT'} - ZIEHEN ZUM DREHEN
          </div>

          <PumpPartDeepDive spot={activeSpotData} xrayMode={xrayMode} />
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
              HYDRAULIKPFAD WIE IM BILD
            </p>
            <div className="space-y-2">
              {HYDRAULIKPFAD.map((step) => (
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
              {PUMP_SPOTS.map((spot) => (
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
              {PUMP_SPOTS.map((spot) => (
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

          <div style={{ ...innerCardStyle, background: '#163652', border: '1px solid #2c6f84' }}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#34c090' }}>
              PRUEFUNGSFRAGE
            </p>
            <p className="text-sm font-semibold mb-2" style={{ color: '#c0d8f0' }}>
              Warum müssen Vorfilter, Wellenabdichtung und Lagerung bei einer Umwälzpumpe immer zusammen betrachtet werden?
            </p>
            <details>
              <summary className="text-xs cursor-pointer font-mono" style={{ color: '#4a9eff' }}>
                Antwort einblenden
              </summary>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#90b0d0' }}>
                Ein zugesetzter Vorfilter veraendert die Hydraulik, fördert Luft- und Kavitationsprobleme und belastet
                damit Dichtung und Lager indirekt mit. Die Bauteile bilden betrieblich ein zusammenhängendes System.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
