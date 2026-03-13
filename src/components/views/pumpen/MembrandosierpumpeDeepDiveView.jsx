import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_HEIGHT = 'clamp(420px, 66vh, 920px)';
const PART_MODEL_HEIGHT = 'clamp(220px, 30vh, 340px)';

const DETAIL_MODES = [
  {
    id: 'dosierhub',
    label: 'Dosierhub',
    accent: '#4a9eff',
    focus: ['dosierkopf', 'dosiermembran', 'kopfscheibe', 'druckstueck'],
    detail: [
      'Die Dosiermembran bewegt das Medium im Dosierkopf pulsierend.',
      'Beim Rückhub saugt die Pumpe Chemikalie an, beim Druckhub wird sie ausgetragen.',
      'Kopfscheibe und Druckstueck übertragen den Hub reproduzierbar auf die Membran.',
    ],
    caution: 'Luftblasen oder verklebte Ventile veraendern die Dosiermenge sofort.',
  },
  {
    id: 'magnetantrieb',
    label: 'Magnetantrieb',
    accent: '#34c090',
    focus: ['magnethub', 'magnetspule', 'magnetachse', 'druckstueck'],
    detail: [
      'Die Magnetspule zieht den Magnethub impulsweise an.',
      'Magnetachse und Druckstueck leiten diese Bewegung in Richtung Membran weiter.',
      'Aus Hubfrequenz und Hublaenge ergibt sich die resultierende Dosierleistung.',
    ],
    caution: 'Thermische Überlast, Schwergang oder Fehlspannung stören die Hubbewegung.',
  },
  {
    id: 'hubverstellung',
    label: 'Hubverstellung',
    accent: '#a070ff',
    focus: ['hubdeckel', 'hubverstellbolzen', 'hubeinstellachse', 'hubeinstellknopf', 'klarsichtabdeckung'],
    detail: [
      'Über Hubeinstellknopf und Hubeinstellachse wird die Hublaenge angepasst.',
      'Der Hubverstellbolzen begrenzt mechanisch den Membranhub.',
      'Die Klarsicht-Abdeckung schützt den Einstellbereich und laesst die Kontrolle zu.',
    ],
    caution: 'Verstellung nur entsprechend Betriebsanleitung und nie mit Gewalt am Anschlag durchführen.',
  },
  {
    id: 'steuerung',
    label: 'Steuerung',
    accent: '#ffaa40',
    focus: ['gehaeuse', 'magnetspule', 'hubeinstellknopf', 'klarsichtabdeckung'],
    detail: [
      'Die Pumpe kann intern takten oder extern über potentialfreie Kontakte angesteuert werden.',
      'Typische Anwendung ist die messwertabhaengige Chemikaliendosierung in der Badewasseraufbereitung.',
      'Ein zweistufiger Niveauschalter zur Vorratsueberwachung kann zugaenglich eingebunden werden.',
    ],
    caution: 'Falsche Signalzuordnung oder fehlende Niveauueberwachung führen schnell zu Unter- oder Überdosierung.',
  },
  {
    id: 'wartung',
    label: 'Wartung',
    accent: '#ff7a7a',
    focus: ['dosierkopf', 'dosiermembran', 'kopfscheibe', 'klarsichtabdeckung', 'gehaeuse'],
    detail: [
      'Dosiermembran ist Verschleissteil und muss regelmaessig kontrolliert werden.',
      'Dosierkopf, Ventilsitze und Dichtflaechen duerfen keine Kristall- oder Belagsbildung zeigen.',
      'Klarsicht-Abdeckung und Gehaeusebereiche sauber halten, damit Verstellungen und Leckagen erkennbar bleiben.',
    ],
    caution: 'Wartung nur drucklos, chemikalienfrei gespuelter Leitung und mit PSA.',
  },
];

const DOSING_PUMP_SPOTS = [
  {
    id: 'gehaeuse',
    number: '1',
    short: 'GH',
    label: 'Gehaeuse',
    color: '#4a9eff',
    position: [0.7, -0.7, 1.15],
    items: [
      'Traegt Antrieb, Elektronik und mechanische Einstellkomponenten.',
      'Schützt Innenbauteile gegen Spritzwasser und chemische Umgebung.',
      'Risse, lose Verschraubungen oder Verzug beeinflussen die Betriebssicherheit.',
    ],
  },
  {
    id: 'dosierkopf',
    number: '2',
    short: 'DK',
    label: 'Dosierkopf',
    color: '#6cb6ff',
    position: [-2.65, -0.1, 0.9],
    items: [
      'Hier befinden sich Dosierkammer sowie Saug- und Druckventile.',
      'Werkstoffauswahl richtet sich nach der eingesetzten Chemikalie.',
      'Kristallbildung oder Gasblasen im Kopf veraendern die Dosiergenauigkeit.',
    ],
  },
  {
    id: 'dosiermembran',
    number: '3',
    short: 'MEM',
    label: 'Dosiermembran',
    color: '#34c090',
    position: [-1.82, -0.12, 0.7],
    items: [
      'Trennt Antriebsseite und Medium hermetisch voneinander.',
      'Verformt sich bei jedem Hub und erzeugt den Dosierstrom.',
      'Materialermuedung oder chemische Schäden führen zu Leistungsverlust oder Leckage.',
    ],
  },
  {
    id: 'kopfscheibe',
    number: '4',
    short: 'KS',
    label: 'Kopfscheibe',
    color: '#8cd7ff',
    position: [-1.45, -0.12, 0.78],
    items: [
      'Stabile Übertragung der Hubbewegung auf die Membran.',
      'Sichert die Formgebung und Hubverteilung an der Stirnseite.',
      'Verschleiss oder lose Kopplung wirken sich direkt auf die Dosiermenge aus.',
    ],
  },
  {
    id: 'magnethub',
    number: '5',
    short: 'MH',
    label: 'Magnethub',
    color: '#ffaa40',
    position: [-0.4, -0.1, 0.18],
    items: [
      'Beweglicher Anker des Magnetantriebs.',
      'Wird von der Spule impulsweise angezogen und über Feder/Mechanik rückgestellt.',
      'Hubweg und Taktung bestimmen die Fördercharakteristik.',
    ],
  },
  {
    id: 'magnetspule',
    number: '6',
    short: 'MS',
    label: 'Magnetspule',
    color: '#ffd166',
    position: [0.35, 0.55, 0.18],
    items: [
      'Erzeugt das Magnetfeld für den Hub des Ankers.',
      'Elektrische Ansteuerung bestimmt die Hubfrequenz.',
      'Wärmeentwicklung und Wicklungszustand beeinflussen die Lebensdauer.',
    ],
  },
  {
    id: 'magnetachse',
    number: '7',
    short: 'MA',
    label: 'Magnetachse',
    color: '#ff9f6c',
    position: [0.18, -0.1, 0.02],
    items: [
      'Führt die lineare Bewegung im Antriebsteil.',
      'Sorgt für axialen Kraftfluss zwischen Magnethub und Druckstueck.',
      'Verkantung oder Korrosion stören den ruhigen Lauf.',
    ],
  },
  {
    id: 'druckstueck',
    number: '8',
    short: 'DS',
    label: 'Druckstueck',
    color: '#f38c8c',
    position: [1.05, -0.1, 0.14],
    items: [
      'Übertraegt die Hubbewegung auf die nachfolgende Mechanik.',
      'Ist zentral für reproduzierbare Kraftuebertragung.',
      'Spiel oder Materialverschleiss verursachen ungenauen Dosierhub.',
    ],
  },
  {
    id: 'hubdeckel',
    number: '9',
    short: 'HD',
    label: 'Hubdeckel',
    color: '#a070ff',
    position: [1.7, 0.18, 0.92],
    items: [
      'Deckelt den Hub- und Einstellbereich mechanisch ab.',
      'Stabilisiert den rechten Gehaeuseteil rund um die Verstellung.',
      'Muss dicht und spannungsfrei sitzen.',
    ],
  },
  {
    id: 'hubverstellbolzen',
    number: '10',
    short: 'HVB',
    label: 'Hubverstellbolzen',
    color: '#c79cff',
    position: [1.95, 0.9, 0.55],
    items: [
      'Begrenzt den maximalen Hub mechanisch.',
      'Verstellt den wirksamen Weg des Antriebs und damit die Dosiermenge.',
      'Gleichmaessige, definierte Verstellung ist wichtig für Reproduzierbarkeit.',
    ],
  },
  {
    id: 'hubeinstellachse',
    number: '11',
    short: 'HEA',
    label: 'Hubeinstellachse',
    color: '#d9b8ff',
    position: [2.3, -0.12, 0.22],
    items: [
      'Verbindet Einstellknopf und innere Verstellmechanik.',
      'Übertraegt die Drehbewegung in eine axiale Hubanpassung.',
      'Axialspiel oder Beschädigung führen zu ungenauer Einstellung.',
    ],
  },
  {
    id: 'hubeinstellknopf',
    number: '12',
    short: 'HEK',
    label: 'Hubeinstellknopf',
    color: '#f5b7ff',
    position: [2.9, -0.12, 0.22],
    items: [
      'Bedienelement für die Hublaengenverstellung.',
      'Wird je nach Pumpentyp in Prozent oder Skalenwerten eingestellt.',
      'Muss gut ablesbar und gegen versehentliche Verstellung geschuetzt sein.',
    ],
  },
  {
    id: 'klarsichtabdeckung',
    number: '13',
    short: 'KA',
    label: 'Klarsicht-Abdeckung',
    color: '#7de7ff',
    position: [2.25, 0.62, 1.15],
    items: [
      'Transparente Schutzabdeckung für den Einstellbereich.',
      'Erlaubt Sichtkontrolle bei gleichzeitigem Schutz der Mechanik.',
      'Aufgeklappt ist Wartung und Verstellung einfacher, im Betrieb bleibt sie geschlossen.',
    ],
  },
];

const DOSING_PUMP_CALLOUTS = {
  gehaeuse: [3.48, -1.48, 1.14],
  dosierkopf: [-4.18, 0.05, 0.96],
  dosiermembran: [-3.22, -0.78, 0.84],
  kopfscheibe: [-2.42, 0.52, 0.84],
  magnethub: [-1.02, -1.02, 0.24],
  magnetspule: [0.22, 1.48, 0.26],
  magnetachse: [0.82, -1.02, 0.04],
  druckstueck: [1.76, -0.82, 0.2],
  hubdeckel: [3.08, 0.62, 1.0],
  hubverstellbolzen: [3.18, 1.64, 0.62],
  hubeinstellachse: [3.58, -0.22, 0.28],
  hubeinstellknopf: [4.1, -0.86, 0.3],
  klarsichtabdeckung: [3.68, 1.26, 1.18],
};

const KENNDATEN = [
  { label: 'Pumpentyp', value: 'Magnet-Membrandosierpumpe' },
  { label: 'Förderprinzip', value: 'pulsierender Membranhub' },
  { label: 'Antrieb', value: 'Magnetspule + Magnethub' },
  { label: 'Hubverstellung', value: 'mechanisch über Knopf/Achse/Bolzen' },
  { label: 'Betriebsart', value: 'intern oder extern ansteuerbar' },
  { label: 'Option', value: 'Niveauueberwachung am Vorratsbehaelter' },
];

const BETRIEBSCHECKS = [
  { label: 'Dosierkopf', value: 'luftfrei, dicht, ohne Kristalle', ok: true },
  { label: 'Membran', value: 'elastisch, ohne Schäden', ok: true },
  { label: 'Hubeinstellung', value: 'passend zum Sollwert', ok: true },
  { label: 'Signal/Niveau', value: 'Freigabe und Meldung plausibel', ok: true },
];

const ABBILDUNGSLESART = [
  { label: 'Dosierkopf links', value: 'Die Chemikalienseite sitzt links, wie in deiner Schnittdarstellung.' },
  { label: 'Magnetantrieb mittig', value: 'Spule, Magnethub und Achse bilden das dunkle Mittelteil.' },
  { label: 'Verstellung rechts', value: 'Deckel, Bolzen, Achse und Knopf liegen gesammelt auf der rechten Seite.' },
  { label: 'Abdeckung oben rechts', value: 'Die Klarsichtabdeckung liegt über dem Verstellbereich.' },
];

const DOSIERPFAD = [
  '1 Rückhub: Medium wird links in den Dosierkopf eingesaugt',
  '2 Membranhub: Magnethub bewegt Druckstueck und Kopfscheibe',
  '3 Druckhub: Medium wird über das Druckventil ausgetragen',
  '4 Hublaenge rechts einstellen, Dosiermenge damit kalibrieren',
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
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.05} />
        </mesh>
      ))}
    </>
  );
}

function OscillatingDrive({ running, xrayMode, hubPercent, emphasized }) {
  const motionRef = useRef();
  const membraneRef = useRef();
  const rodRef = useRef();

  useFrame((state) => {
    const amplitude = 0.28 * (hubPercent / 100);
    const phase = running ? Math.sin(state.clock.elapsedTime * 5.4) : -0.15;
    const offset = amplitude * phase;

    if (motionRef.current) {
      motionRef.current.position.x = offset;
    }

    if (membraneRef.current) {
      const bulge = 1 + (phase * 0.08);
      membraneRef.current.scale.set(1, bulge, bulge);
    }

    if (rodRef.current) {
      rodRef.current.scale.x = 1 + (offset * 0.1);
    }
  });

  return (
    <group ref={motionRef} position={[0, 0, 0]}>
      <mesh position={[-0.42, -0.12, 0.18]}>
        <cylinderGeometry args={[0.42, 0.42, 0.72, 28]} />
        <meshStandardMaterial
          color="#d1d7e0"
          metalness={0.62}
          roughness={0.24}
          wireframe={xrayMode}
          emissive={emphasized ? '#ffaa40' : '#203040'}
          emissiveIntensity={emphasized ? 0.42 : 0.08}
        />
      </mesh>
      <mesh position={[0.22, -0.12, 0.02]}>
        <cylinderGeometry args={[0.08, 0.08, 2.0, 20]} />
        <meshStandardMaterial
          color="#d8dde6"
          metalness={0.72}
          roughness={0.18}
          emissive={emphasized ? '#ff9f6c' : '#203040'}
          emissiveIntensity={emphasized ? 0.36 : 0.08}
        />
      </mesh>
      <mesh ref={rodRef} position={[1.03, -0.12, 0.14]}>
        <cylinderGeometry args={[0.14, 0.14, 0.5, 18]} />
        <meshStandardMaterial
          color="#f2998d"
          metalness={0.4}
          roughness={0.28}
          emissive={emphasized ? '#f38c8c' : '#241a1a'}
          emissiveIntensity={emphasized ? 0.34 : 0.08}
        />
      </mesh>
      <mesh ref={membraneRef} position={[-1.82, -0.12, 0.7]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.08, 32]} />
        <meshStandardMaterial
          color="#41c29b"
          metalness={0.12}
          roughness={0.24}
          wireframe={xrayMode}
          emissive={emphasized ? '#34c090' : '#153227'}
          emissiveIntensity={emphasized ? 0.42 : 0.08}
        />
      </mesh>
      <mesh position={[-1.46, -0.12, 0.78]}>
        <cylinderGeometry args={[0.42, 0.42, 0.12, 28]} />
        <meshStandardMaterial
          color="#93d7ff"
          metalness={0.48}
          roughness={0.22}
          emissive={emphasized ? '#8cd7ff' : '#203242'}
          emissiveIntensity={emphasized ? 0.32 : 0.08}
        />
      </mesh>
    </group>
  );
}

function DosingPumpHotspots({ activeSpot, setActiveSpot, showLabels }) {
  return (
    <>
      {DOSING_PUMP_SPOTS.map((spot) => {
        const isActive = activeSpot === spot.id;
        return (
          <group key={spot.id} position={spot.position}>
            <mesh onClick={(event) => { event.stopPropagation(); setActiveSpot(isActive ? null : spot.id); }}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial
                color={spot.color}
                emissive={spot.color}
                emissiveIntensity={isActive ? 1.95 : 0.92}
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

function DosingPumpLeaderCallouts({ activeSpot, setActiveSpot, showLabels }) {
  if (!showLabels) return null;

  return (
    <>
      {DOSING_PUMP_SPOTS.map((spot) => {
        const end = DOSING_PUMP_CALLOUTS[spot.id];
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

function PreviewMembrane({ xrayMode, color }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const bulge = 1 + Math.sin(state.clock.elapsedTime * 2.8) * 0.08;
    ref.current.scale.set(1, bulge, bulge);
  });

  return (
    <mesh ref={ref} rotation={[0, Math.PI / 2, 0]}>
      <cylinderGeometry args={[0.78, 0.78, 0.1, 34]} />
      <meshStandardMaterial color={color} metalness={0.12} roughness={0.22} wireframe={xrayMode} emissive={color} emissiveIntensity={0.18} />
    </mesh>
  );
}

function DosingPumpPartFocusModel({ spot, xrayMode }) {
  if (!spot) return null;

  const shell = {
    metalness: 0.38,
    roughness: 0.28,
    wireframe: xrayMode,
  };

  switch (spot.id) {
    case 'gehaeuse':
      return (
        <group rotation={[0.18, -0.4, 0]}>
          <mesh>
            <boxGeometry args={[2.8, 1.5, 1.8]} />
            <meshStandardMaterial color="#162f4b" transparent opacity={0.88} {...shell} />
          </mesh>
          <mesh scale={[0.72, 0.72, 0.72]}>
            <boxGeometry args={[2.8, 1.5, 1.8]} />
            <meshStandardMaterial color="#081523" transparent opacity={0.46} />
          </mesh>
        </group>
      );
    case 'dosierkopf':
      return (
        <group rotation={[0.12, -0.46, 0]}>
          <mesh>
            <boxGeometry args={[2.1, 1.9, 1.35]} />
            <meshStandardMaterial color="#d7dbe2" {...shell} />
          </mesh>
          <mesh position={[-1.16, 0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.8, 20]} />
            <meshStandardMaterial color="#73839a" metalness={0.54} roughness={0.22} />
          </mesh>
          <mesh position={[-1.16, -0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.8, 20]} />
            <meshStandardMaterial color="#73839a" metalness={0.54} roughness={0.22} />
          </mesh>
        </group>
      );
    case 'dosiermembran':
      return <PreviewMembrane xrayMode={xrayMode} color={spot.color} />;
    case 'kopfscheibe':
      return (
        <group rotation={[0.18, -0.35, 0]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.68, 0.68, 0.12, 30]} />
            <meshStandardMaterial color={spot.color} metalness={0.42} roughness={0.24} wireframe={xrayMode} />
          </mesh>
          <mesh scale={[0.7, 0.7, 0.7]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.68, 0.68, 0.14, 30]} />
            <meshStandardMaterial color="#0a1728" transparent opacity={0.4} />
          </mesh>
        </group>
      );
    case 'magnethub':
      return (
        <group rotation={[0.16, -0.25, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.45, 0.45, 1.2, 24]} />
            <meshStandardMaterial color="#d1d7e0" metalness={0.62} roughness={0.22} wireframe={xrayMode} />
          </mesh>
        </group>
      );
    case 'magnetspule':
      return (
        <group rotation={[0.14, -0.32, 0]}>
          <mesh>
            <cylinderGeometry args={[0.92, 0.92, 1.36, 28]} />
            <meshStandardMaterial color="#d38a2f" metalness={0.32} roughness={0.26} wireframe={xrayMode} />
          </mesh>
          <mesh scale={[0.52, 1.12, 0.52]}>
            <cylinderGeometry args={[0.92, 0.92, 1.0, 24]} />
            <meshStandardMaterial color="#203b5c" metalness={0.28} roughness={0.32} wireframe={xrayMode} />
          </mesh>
        </group>
      );
    case 'magnetachse':
      return (
        <group rotation={[0.26, 0.1, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 2.5, 18]} />
            <meshStandardMaterial color="#d8dde6" metalness={0.72} roughness={0.16} wireframe={xrayMode} />
          </mesh>
        </group>
      );
    case 'druckstueck':
      return (
        <group rotation={[0.22, -0.18, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 1.18, 20]} />
            <meshStandardMaterial color="#f2998d" metalness={0.42} roughness={0.24} wireframe={xrayMode} />
          </mesh>
        </group>
      );
    case 'hubdeckel':
      return (
        <group rotation={[0.16, -0.35, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.92, 0.92, 1.18, 30]} />
            <meshStandardMaterial color="#28324a" metalness={0.36} roughness={0.3} wireframe={xrayMode} />
          </mesh>
        </group>
      );
    case 'hubverstellbolzen':
      return (
        <group rotation={[0.22, 0.18, 0]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 1.8, 18]} />
            <meshStandardMaterial color="#d799ff" metalness={0.46} roughness={0.2} wireframe={xrayMode} />
          </mesh>
        </group>
      );
    case 'hubeinstellachse':
      return (
        <group rotation={[0.26, 0.1, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.09, 0.09, 1.8, 18]} />
            <meshStandardMaterial color="#dfbeff" metalness={0.52} roughness={0.18} wireframe={xrayMode} />
          </mesh>
        </group>
      );
    case 'hubeinstellknopf':
      return (
        <group rotation={[0.18, -0.32, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.52, 0.52, 0.42, 26]} />
            <meshStandardMaterial color="#efbaf9" metalness={0.34} roughness={0.24} wireframe={xrayMode} />
          </mesh>
          <mesh position={[0, 0, 0.18]}>
            <cylinderGeometry args={[0.12, 0.12, 0.42, 14]} />
            <meshStandardMaterial color="#d2dbef" metalness={0.58} roughness={0.16} />
          </mesh>
        </group>
      );
    case 'klarsichtabdeckung':
      return (
        <group rotation={[-0.34, -0.28, -0.08]}>
          <mesh>
            <boxGeometry args={[2.2, 0.08, 1.5]} />
            <meshStandardMaterial color="#b8f3ff" transparent opacity={xrayMode ? 0.18 : 0.42} metalness={0.08} roughness={0.08} />
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

function DosingPumpPartDeepDive({ spot, xrayMode }) {
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
            <Canvas camera={{ position: [0, 0.1, 4.8], fov: 34 }}>
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

              <DosingPumpPartFocusModel spot={spot} xrayMode={xrayMode} />

              <OrbitControls enablePan={false} minDistance={3.4} maxDistance={6.4} autoRotate autoRotateSpeed={0.65} />
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
  return [anchor[0] + (direction * 1.65), anchor[1] + 0.16, anchor[2] + 0.42];
}

function DosingPumpExplodedPart({ spot, xrayMode, explodedMode }) {
  if (!explodedMode || !spot) return null;

  const anchor = DOSING_PUMP_CALLOUTS[spot.id] || spot.position;
  const target = getExplodedPosition(anchor);

  return (
    <group>
      <CalloutLine start={spot.position} end={target} active />
      <group position={target} scale={[0.4, 0.4, 0.4]}>
        <DosingPumpPartFocusModel spot={spot} xrayMode={xrayMode} />
      </group>
    </group>
  );
}

function MembrandosierpumpeAssembly({ running, xrayMode, activeSpot, setActiveSpot, mode, hubPercent, showLabels, explodedMode }) {
  const emphasized = (ids) => focusMatch(mode, ids);
  const activeSpotData = DOSING_PUMP_SPOTS.find((item) => item.id === activeSpot) || null;

  const shellMaterial = (baseColor, ids, opacity = 0.72) => ({
    color: baseColor,
    metalness: 0.42,
    roughness: 0.32,
    transparent: true,
    opacity: xrayMode ? 0.18 : emphasized(ids) ? opacity : opacity * 0.7,
    wireframe: xrayMode,
    emissive: emphasized(ids) ? mode.accent : '#13253a',
    emissiveIntensity: emphasized(ids) ? 0.26 : 0.08,
  });

  return (
    <group position={[0, -0.05, 0]} rotation={[0, -0.12, 0]} scale={[1, 1, 0.68]}>
      <mesh position={[0.25, -0.15, -1.1]}>
        <planeGeometry args={[8.8, 5.8]} />
        <meshStandardMaterial color="#081523" emissive="#07111d" emissiveIntensity={0.12} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0.68, -0.72, 0.2]}>
        <boxGeometry args={[5.0, 2.1, 2.2]} />
        <meshStandardMaterial {...shellMaterial('#162f4b', ['gehaeuse'], 0.92)} />
      </mesh>

      <mesh position={[0.12, -0.12, 0.16]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.92, 0.92, 2.2, 36]} />
        <meshStandardMaterial {...shellMaterial('#203b5c', ['magnethub', 'magnetspule', 'magnetachse'], 0.74)} />
      </mesh>

      <mesh position={[0.12, 0.52, 0.16]}>
        <boxGeometry args={[1.12, 0.42, 1.28]} />
        <meshStandardMaterial {...shellMaterial('#d38a2f', ['magnetspule'], 0.95)} />
      </mesh>
      <mesh position={[0.12, -0.78, 0.16]}>
        <boxGeometry args={[1.12, 0.42, 1.28]} />
        <meshStandardMaterial {...shellMaterial('#d38a2f', ['magnetspule'], 0.95)} />
      </mesh>

      <mesh position={[-2.62, -0.08, 0.76]}>
        <boxGeometry args={[1.2, 2.05, 1.55]} />
        <meshStandardMaterial {...shellMaterial('#d7dbe2', ['dosierkopf'], 0.88)} />
      </mesh>
      <mesh position={[-2.62, 0.82, 0.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.64, 22]} />
        <meshStandardMaterial color="#9ea8b7" metalness={0.62} roughness={0.2} />
      </mesh>
      <mesh position={[-2.62, -0.98, 0.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.64, 22]} />
        <meshStandardMaterial color="#9ea8b7" metalness={0.62} roughness={0.2} />
      </mesh>
      <mesh position={[-3.32, 0.82, 0.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, 0.84, 22]} />
        <meshStandardMaterial color="#69778a" metalness={0.58} roughness={0.24} />
      </mesh>
      <mesh position={[-3.32, -0.98, 0.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, 0.84, 22]} />
        <meshStandardMaterial color="#69778a" metalness={0.58} roughness={0.24} />
      </mesh>

      <mesh position={[1.72, 0.18, 0.92]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.88, 0.88, 1.15, 30]} />
        <meshStandardMaterial {...shellMaterial('#28324a', ['hubdeckel'], 0.92)} />
      </mesh>

      <mesh position={[1.95, 0.88, 0.55]}>
        <cylinderGeometry args={[0.12, 0.12, 1.14, 16]} />
        <meshStandardMaterial {...shellMaterial('#d799ff', ['hubverstellbolzen'], 0.92)} />
      </mesh>
      <mesh position={[2.32, -0.12, 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.76, 16]} />
        <meshStandardMaterial {...shellMaterial('#dfbeff', ['hubeinstellachse'], 0.92)} />
      </mesh>
      <mesh position={[2.92, -0.12, 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.24, 24]} />
        <meshStandardMaterial {...shellMaterial('#efbaf9', ['hubeinstellknopf'], 0.95)} />
      </mesh>

      <mesh position={[2.18, 0.62, 1.18]} rotation={[-0.58, 0, -0.12]}>
        <boxGeometry args={[1.62, 0.08, 1.08]} />
        <meshStandardMaterial
          color="#b8f3ff"
          transparent
          opacity={xrayMode ? 0.16 : emphasized(['klarsichtabdeckung']) ? 0.42 : 0.26}
          metalness={0.08}
          roughness={0.12}
          emissive={emphasized(['klarsichtabdeckung']) ? '#7de7ff' : '#1e3940'}
          emissiveIntensity={emphasized(['klarsichtabdeckung']) ? 0.24 : 0.05}
        />
      </mesh>

      <OscillatingDrive
        running={running}
        xrayMode={xrayMode}
        hubPercent={hubPercent}
        emphasized={emphasized(['magnethub', 'magnetachse', 'druckstueck', 'dosiermembran', 'kopfscheibe'])}
      />

      <FlowParticles running={running} color="#34c090" start={[-3.95, -0.98, 0]} end={[-2.55, -0.36, 0.12]} speed={0.28} count={6} />
      <FlowParticles running={running} color="#ffaa40" start={[-2.42, 0.12, 0.2]} end={[-3.92, 0.88, 0]} speed={0.34} count={6} />

      <DosingPumpLeaderCallouts activeSpot={activeSpot} setActiveSpot={setActiveSpot} showLabels={showLabels} />
      <DosingPumpExplodedPart spot={activeSpotData} xrayMode={xrayMode} explodedMode={explodedMode} />
      <DosingPumpHotspots activeSpot={activeSpot} setActiveSpot={setActiveSpot} showLabels={showLabels} />
    </group>
  );
}

export default function MembrandosierpumpeDeepDiveView() {
  const [xrayMode, setXrayMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [running, setRunning] = useState(true);
  const [explodedMode, setExplodedMode] = useState(false);
  const [hubPercent, setHubPercent] = useState(60);
  const [activeMode, setActiveMode] = useState('dosierhub');
  const [activeSpot, setActiveSpot] = useState('dosiermembran');
  const [viewVersion, setViewVersion] = useState(0);

  const mode = DETAIL_MODES.find((item) => item.id === activeMode) || DETAIL_MODES[0];
  const activeSpotData = DOSING_PUMP_SPOTS.find((item) => item.id === activeSpot) || null;

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
            DEEP DIVE PLUS - MEMBRANDOSIERPUMPE IM SCHNITTBILD
          </p>
          <h3 className="text-lg font-black text-white mt-0.5">Magnet-Membrandosierpumpe mit 13 Detailpunkten</h3>
          <p className="text-xs font-mono mt-1" style={{ color: '#58789c' }}>
            Dosierhub - Magnetantrieb - Hubverstellung - Steuerung - Wartung
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
                Dosierkopf links, Magnetteil mittig, Verstellung rechts
              </p>
            </div>

            <Canvas
              key={viewVersion}
              dpr={[1, 1.8]}
              onPointerMissed={() => setActiveSpot(null)}
              camera={{ position: [0.28, 0.02, 11.2], fov: 44 }}
            >
              <color attach="background" args={['#081727']} />
              <ambientLight intensity={0.54} />
              <hemisphereLight intensity={0.7} color="#b4deff" groundColor="#16344d" />
              <directionalLight position={[5, 7, 5]} intensity={1.3} color="#e4f3ff" />
              <pointLight position={[-4, 2, 2]} intensity={0.92} color="#4a9eff" />
              <pointLight position={[2, 1, -3]} intensity={0.74} color="#ffaa40" />
              <pointLight position={[0, 2.6, 4]} intensity={0.5} color="#96e0ff" />

              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.35, 0]} receiveShadow>
                <planeGeometry args={[18, 18]} />
                <meshStandardMaterial color="#12314a" roughness={0.92} metalness={0.05} />
              </mesh>
              <gridHelper args={[18, 34, '#12314f', '#0a1e32']} position={[0, -2.34, 0]} />

              <MembrandosierpumpeAssembly
                running={running}
                xrayMode={xrayMode}
                activeSpot={activeSpot}
                setActiveSpot={setActiveSpot}
                mode={mode}
                hubPercent={hubPercent}
                showLabels={showLabels}
                explodedMode={explodedMode}
              />

              <OrbitControls
                enablePan={false}
                minDistance={5.4}
                maxDistance={13.2}
                minPolarAngle={Math.PI * 0.16}
                maxPolarAngle={Math.PI * 0.76}
                minAzimuthAngle={-0.58}
                maxAzimuthAngle={0.42}
                target={[0, -0.18, 0]}
                autoRotate={!activeSpot}
                autoRotateSpeed={0.12}
              />
            </Canvas>
          </div>

          <div className="mt-3 text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
            STATUS: {running ? 'DOSIERUNG AKTIV' : 'DOSIERUNG AUS'} - HUBLAENGE: {hubPercent}% - {explodedMode ? 'EXPLOSION AKTIV' : 'STANDARDANSICHT'} - ZIEHEN ZUM DREHEN
          </div>

          <DosingPumpPartDeepDive spot={activeSpotData} xrayMode={xrayMode} />
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
              DOSIERPFAD WIE IM BILD
            </p>
            <div className="space-y-2">
              {DOSIERPFAD.map((step) => (
                <div key={step} className="rounded-lg px-3 py-2" style={{ background: '#0c2135', border: '1px solid #234b6b' }}>
                  <p className="text-xs leading-relaxed" style={{ color: '#9ec4de' }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#34c090' }}>
              HUBVERSTELLUNG
            </p>
            <label htmlFor="dosing-hub-slider" className="text-xs block mb-2" style={{ color: '#8ab0c0' }}>
              Hublaenge simulieren ({hubPercent}%)
            </label>
            <input
              id="dosing-hub-slider"
              type="range"
              min="10"
              max="100"
              step="1"
              value={hubPercent}
              onChange={(event) => setHubPercent(Number(event.target.value))}
              className="w-full accent-cyan-500"
            />
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: '#6d8ca9' }}>
              Der Slider simuliert die mechanische Hubverstellung. Größere Hublaenge bedeutet größeres Dosiervolumen pro Hub.
            </p>
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>
              ERLAEUTERUNG NACH ABBILDUNG
            </p>
            <div className="space-y-1.5">
              {DOSING_PUMP_SPOTS.map((spot) => (
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
              {DOSING_PUMP_SPOTS.map((spot) => (
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
              Warum muss bei einer Membrandosierpumpe die Hublaenge sauber zur Hubfrequenz und zum Messwertsignal passen?
            </p>
            <details>
              <summary className="text-xs cursor-pointer font-mono" style={{ color: '#4a9eff' }}>
                Antwort einblenden
              </summary>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#90b0d0' }}>
                Die Dosiermenge ergibt sich aus dem Volumen pro Hub und der Anzahl der Huebe. Wenn Hublaenge, Hubfrequenz
                und externe Ansteuerung nicht zusammenpassen, wird die Chemikalie systematisch zu hoch oder zu niedrig dosiert.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
