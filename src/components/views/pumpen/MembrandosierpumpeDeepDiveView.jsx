import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_HEIGHT = 'clamp(420px, 66vh, 920px)';

const DETAIL_MODES = [
  {
    id: 'dosierhub',
    label: 'Dosierhub',
    accent: '#4a9eff',
    focus: ['dosierkopf', 'dosiermembran', 'kopfscheibe', 'druckstueck'],
    detail: [
      'Die Dosiermembran bewegt das Medium im Dosierkopf pulsierend.',
      'Beim Rueckhub saugt die Pumpe Chemikalie an, beim Druckhub wird sie ausgetragen.',
      'Kopfscheibe und Druckstueck uebertragen den Hub reproduzierbar auf die Membran.',
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
    caution: 'Thermische Ueberlast, Schwergang oder Fehlspannung stoeren die Hubbewegung.',
  },
  {
    id: 'hubverstellung',
    label: 'Hubverstellung',
    accent: '#a070ff',
    focus: ['hubdeckel', 'hubverstellbolzen', 'hubeinstellachse', 'hubeinstellknopf', 'klarsichtabdeckung'],
    detail: [
      'Ueber Hubeinstellknopf und Hubeinstellachse wird die Hublaenge angepasst.',
      'Der Hubverstellbolzen begrenzt mechanisch den Membranhub.',
      'Die Klarsicht-Abdeckung schuetzt den Einstellbereich und laesst die Kontrolle zu.',
    ],
    caution: 'Verstellung nur entsprechend Betriebsanleitung und nie mit Gewalt am Anschlag durchfuehren.',
  },
  {
    id: 'steuerung',
    label: 'Steuerung',
    accent: '#ffaa40',
    focus: ['gehaeuse', 'magnetspule', 'hubeinstellknopf', 'klarsichtabdeckung'],
    detail: [
      'Die Pumpe kann intern takten oder extern ueber potentialfreie Kontakte angesteuert werden.',
      'Typische Anwendung ist die messwertabhaengige Chemikaliendosierung in der Badewasseraufbereitung.',
      'Ein zweistufiger Niveauschalter zur Vorratsueberwachung kann zugaenglich eingebunden werden.',
    ],
    caution: 'Falsche Signalzuordnung oder fehlende Niveauueberwachung fuehren schnell zu Unter- oder Ueberdosierung.',
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
      'Schuetzt Innenbauteile gegen Spritzwasser und chemische Umgebung.',
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
      'Materialermuedung oder chemische Schaeden fuehren zu Leistungsverlust oder Leckage.',
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
      'Stabile Uebertragung der Hubbewegung auf die Membran.',
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
      'Wird von der Spule impulsweise angezogen und ueber Feder/Mechanik rueckgestellt.',
      'Hubweg und Taktung bestimmen die Foerdercharakteristik.',
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
      'Erzeugt das Magnetfeld fuer den Hub des Ankers.',
      'Elektrische Ansteuerung bestimmt die Hubfrequenz.',
      'Waermeentwicklung und Wicklungszustand beeinflussen die Lebensdauer.',
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
      'Fuehrt die lineare Bewegung im Antriebsteil.',
      'Sorgt fuer axialen Kraftfluss zwischen Magnethub und Druckstueck.',
      'Verkantung oder Korrosion stoeren den ruhigen Lauf.',
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
      'Uebertraegt die Hubbewegung auf die nachfolgende Mechanik.',
      'Ist zentral fuer reproduzierbare Kraftuebertragung.',
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
      'Gleichmaessige, definierte Verstellung ist wichtig fuer Reproduzierbarkeit.',
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
      'Uebertraegt die Drehbewegung in eine axiale Hubanpassung.',
      'Axialspiel oder Beschädigung fuehren zu ungenauer Einstellung.',
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
      'Bedienelement fuer die Hublaengenverstellung.',
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
      'Transparente Schutzabdeckung fuer den Einstellbereich.',
      'Erlaubt Sichtkontrolle bei gleichzeitigem Schutz der Mechanik.',
      'Aufgeklappt ist Wartung und Verstellung einfacher, im Betrieb bleibt sie geschlossen.',
    ],
  },
];

const KENNDATEN = [
  { label: 'Pumpentyp', value: 'Magnet-Membrandosierpumpe' },
  { label: 'Foerderprinzip', value: 'pulsierender Membranhub' },
  { label: 'Antrieb', value: 'Magnetspule + Magnethub' },
  { label: 'Hubverstellung', value: 'mechanisch ueber Knopf/Achse/Bolzen' },
  { label: 'Betriebsart', value: 'intern oder extern ansteuerbar' },
  { label: 'Option', value: 'Niveauueberwachung am Vorratsbehaelter' },
];

const BETRIEBSCHECKS = [
  { label: 'Dosierkopf', value: 'luftfrei, dicht, ohne Kristalle', ok: true },
  { label: 'Membran', value: 'elastisch, ohne Schaeden', ok: true },
  { label: 'Hubeinstellung', value: 'passend zum Sollwert', ok: true },
  { label: 'Signal/Niveau', value: 'Freigabe und Meldung plausibel', ok: true },
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
            <Html distanceFactor={10} position={[0, 0.22, 0]} center>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveSpot(isActive ? null : spot.id);
                }}
                style={{
                  border: `1px solid ${spot.color}`,
                  color: spot.color,
                  background: isActive ? '#081a2e' : 'rgba(8, 26, 46, 0.55)',
                  borderRadius: '999px',
                  fontSize: '10px',
                  padding: '2px 7px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {spot.number}
              </button>
            </Html>
            {showLabels && (
              <Html distanceFactor={10} position={[0, 0.46, 0]} center>
                <div
                  style={{
                    color: spot.color,
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    background: 'rgba(4, 13, 26, 0.82)',
                    padding: '2px 5px',
                    borderRadius: '999px',
                    border: `1px solid ${spot.color}`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {spot.short}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

function MembrandosierpumpeAssembly({ running, xrayMode, activeSpot, setActiveSpot, mode, hubPercent }) {
  const emphasized = (ids) => focusMatch(mode, ids);

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
    <group position={[0, -0.05, 0]}>
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

      <DosingPumpHotspots activeSpot={activeSpot} setActiveSpot={setActiveSpot} showLabels={showLabels} />
    </group>
  );
}

export default function MembrandosierpumpeDeepDiveView() {
  const [xrayMode, setXrayMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [running, setRunning] = useState(true);
  const [hubPercent, setHubPercent] = useState(60);
  const [activeMode, setActiveMode] = useState('dosierhub');
  const [activeSpot, setActiveSpot] = useState('dosiermembran');

  const mode = DETAIL_MODES.find((item) => item.id === activeMode) || DETAIL_MODES[0];
  const activeSpotData = DOSING_PUMP_SPOTS.find((item) => item.id === activeSpot) || null;

  const innerCardStyle = {
    background: '#0a1a2e',
    border: '1px solid #1a3a5a',
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
    <div className="rounded-2xl overflow-hidden" style={{ background: '#040d1a', border: '1px solid #1a3a5a' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: '1px solid #1a3a5a' }}>
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
            {showLabels ? 'Hotspots an' : 'Hotspots aus'}
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.6fr_1fr]" style={{ minHeight: 0 }}>
        <div className="p-4 lg:p-5" style={{ borderRight: '1px solid #1a3a5a', background: '#030c18' }}>
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

          <div style={{ width: '100%', height: MODEL_HEIGHT, borderRadius: '0.85rem', overflow: 'hidden' }}>
            <Canvas dpr={[1, 1.8]} onPointerMissed={() => setActiveSpot(null)} camera={{ position: [0, 0.15, 8.6], fov: 46 }}>
              <color attach="background" args={['#040d1a']} />
              <ambientLight intensity={0.34} />
              <hemisphereLight intensity={0.48} color="#9dd3ff" groundColor="#0c1f31" />
              <directionalLight position={[5, 7, 5]} intensity={1.1} color="#d8ecff" />
              <pointLight position={[-4, 2, 2]} intensity={0.7} color="#4a9eff" />
              <pointLight position={[2, 1, -3]} intensity={0.56} color="#ffaa40" />

              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.35, 0]} receiveShadow>
                <planeGeometry args={[18, 18]} />
                <meshStandardMaterial color="#071426" roughness={0.92} metalness={0.05} />
              </mesh>
              <gridHelper args={[18, 34, '#12314f', '#0a1e32']} position={[0, -2.34, 0]} />

              <MembrandosierpumpeAssembly
                running={running}
                xrayMode={xrayMode}
                activeSpot={activeSpot}
                setActiveSpot={setActiveSpot}
                mode={mode}
                hubPercent={hubPercent}
              />

              <OrbitControls
                enablePan={false}
                minDistance={4.8}
                maxDistance={10.5}
                minPolarAngle={Math.PI * 0.16}
                maxPolarAngle={Math.PI * 0.76}
                target={[0, -0.1, 0]}
                autoRotate={!activeSpot}
                autoRotateSpeed={0.22}
              />
            </Canvas>
          </div>

          <div className="mt-3 text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
            STATUS: {running ? 'DOSIERUNG AKTIV' : 'DOSIERUNG AUS'} - HUBLAENGE: {hubPercent}% - ZIEHEN ZUM DREHEN
          </div>
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
              Der Slider simuliert die mechanische Hubverstellung. Groessere Hublaenge bedeutet groesseres Dosiervolumen pro Hub.
            </p>
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>
              HOTSPOT-FUNKTION
            </p>
            {activeSpotData ? (
              <div className="rounded-lg p-3 mb-2" style={{ background: '#040d1a', border: `1px solid ${activeSpotData.color}` }}>
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
                    background: activeSpot === spot.id ? '#10253e' : '#071426',
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
                <div key={check.label} className="rounded-lg p-2" style={{ background: '#040d1a', border: `1px solid ${check.ok ? '#1a4030' : '#4a1a1a'}` }}>
                  <div style={{ color: '#456080' }}>{check.label}</div>
                  <div className="font-mono font-bold" style={{ color: check.ok ? '#34c090' : '#d04040' }}>
                    {check.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...innerCardStyle, background: '#0a2038', border: '1px solid #1a5060' }}>
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
