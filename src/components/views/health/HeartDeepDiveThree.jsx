import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_HEIGHT = 'clamp(460px, 72vh, 920px)';
const STROKE_VOLUME_ML = 72;

const HEART_SPOT_DATA = {
  rechterVorhof: {
    color: '#5da7ff',
    short: 'RVH',
    title: 'Rechter Vorhof',
    items: [
      'Nimmt sauerstoffarmes Blut aus oberer und unterer Hohlvene auf.',
      'Leitet das Blut über die Trikuspidalklappe in die rechte Kammer weiter.',
      'Volumen- und Druckschwankungen sind klinisch relevante Belastungsmarker.',
    ],
  },
  rechteKammer: {
    color: '#4690ff',
    short: 'RKM',
    title: 'Rechte Kammer',
    items: [
      'Pumpt venoeses Blut in den kleinen (pulmonalen) Kreislauf.',
      'Die Pulmonalklappe verhindert den Rückfluss aus der Pulmonalarterie.',
      'Belastet vor allem bei pulmonaler Hypertonie und Lungenproblemen.',
    ],
  },
  linkerVorhof: {
    color: '#f38c8c',
    short: 'LVH',
    title: 'Linker Vorhof',
    items: [
      'Erhaelt oxygeniertes Blut aus den Lungenvenen.',
      'Gibt das Blut über die Mitralklappe an die linke Kammer ab.',
      'Druckanstiege können sich direkt auf den Lungenkreislauf auswirken.',
    ],
  },
  linkeKammer: {
    color: '#f65f6f',
    short: 'LKM',
    title: 'Linke Kammer',
    items: [
      'Starkste Herzkammer mit hohem Druckaufbau für den Körperkreislauf.',
      'Auswurf über die Aortenklappe in die Aorta.',
      'Entscheidend für Herzzeitvolumen und Organdurchblutung.',
    ],
  },
  trikuspidalklappe: {
    color: '#7ec8ff',
    short: 'TK',
    title: 'Trikuspidalklappe',
    items: [
      'Segelklappe zwischen rechtem Vorhof und rechter Kammer.',
      'Oeffnet in der Fuellungsphase, schliesst in der Auswurfphase.',
      'Insuffizienz führt zu Rückstrom in den rechten Vorhof.',
    ],
  },
  mitralklappe: {
    color: '#ff9aa3',
    short: 'MK',
    title: 'Mitralklappe',
    items: [
      'Segelklappe zwischen linkem Vorhof und linker Kammer.',
      'Stabilisiert den gerichteten Strom Richtung Aorta.',
      'Klappenstenosen und -insuffizienzen veraendern die Pumpenleistung.',
    ],
  },
  aorta: {
    color: '#ff784e',
    short: 'AO',
    title: 'Aorta',
    items: [
      'Größtes arterielles Gefaess für den grossen Kreislauf.',
      'Verteilt sauerstoffreiches Blut in den gesamten Körper.',
      'Der elastische Windkessel-Effekt glattet Druckschwankungen.',
    ],
  },
  pulmonalarterie: {
    color: '#4fa1ff',
    short: 'PA',
    title: 'Pulmonalarterie',
    items: [
      'Führt sauerstoffarmes Blut von der rechten Kammer zur Lunge.',
      'Einzige Arterie mit venoesem Blut.',
      'Im kleinen Kreislauf deutlich niedrigere Druckniveaus als systemisch.',
    ],
  },
};

const HEART_SPOTS = [
  { id: 'rechterVorhof', label: 'Rechter Vorhof', position: [-0.72, 1.72, 0.65], color: '#5da7ff' },
  { id: 'rechteKammer', label: 'Rechte Kammer', position: [-0.38, 0.45, 0.78], color: '#4690ff' },
  { id: 'linkerVorhof', label: 'Linker Vorhof', position: [0.72, 1.62, 0.56], color: '#f38c8c' },
  { id: 'linkeKammer', label: 'Linke Kammer', position: [0.48, 0.35, 0.72], color: '#f65f6f' },
  { id: 'trikuspidalklappe', label: 'Trikuspidalklappe', position: [-0.42, 1.02, 0.76], color: '#7ec8ff' },
  { id: 'mitralklappe', label: 'Mitralklappe', position: [0.42, 1.0, 0.73], color: '#ff9aa3' },
  { id: 'aorta', label: 'Aorta', position: [0.92, 2.34, -0.38], color: '#ff784e' },
  { id: 'pulmonalarterie', label: 'Pulmonalarterie', position: [-0.88, 2.02, 0.18], color: '#4fa1ff' },
];

const SYSTEMIC_SEGMENTS = [
  { id: 'sys-1', start: [0.48, 0.25, 0.45], end: [0.9, 2.28, -0.32], color: '#ff6b6b', speed: 0.24, count: 11 },
  { id: 'sys-2', start: [0.9, 2.28, -0.32], end: [3.8, 1.36, 0.0], color: '#ff8d57', speed: 0.25, count: 10 },
  { id: 'sys-3', start: [3.8, 1.36, 0.0], end: [-3.5, 1.36, 0.0], color: '#58a9ff', speed: 0.21, count: 13 },
  { id: 'sys-4', start: [-3.45, 1.36, 0.0], end: [-1.02, 1.98, 0.18], color: '#4f95ff', speed: 0.23, count: 9 },
  { id: 'sys-5', start: [-3.2, 0.12, 0.0], end: [-0.86, -0.34, 0.22], color: '#3f86f7', speed: 0.22, count: 8 },
];

const PULMONARY_SEGMENTS = [
  { id: 'pul-1', start: [-0.34, 0.14, 0.52], end: [-0.84, 1.98, 0.2], color: '#4c9bff', speed: 0.24, count: 10 },
  { id: 'pul-2', start: [-0.84, 1.98, 0.2], end: [-3.02, 1.52, 0.38], color: '#54adff', speed: 0.25, count: 9 },
  { id: 'pul-3', start: [-0.84, 1.98, 0.2], end: [2.88, 1.38, 0.34], color: '#54adff', speed: 0.24, count: 9 },
  { id: 'pul-4', start: [-2.75, 1.46, 0.39], end: [0.06, 1.3, 0.55], color: '#ff7b7b', speed: 0.22, count: 10 },
  { id: 'pul-5', start: [2.55, 1.34, 0.36], end: [0.08, 1.3, 0.55], color: '#ff7b7b', speed: 0.22, count: 10 },
];

const CYCLE_DETAILS = {
  gross: {
    title: 'Grosser Blutkreislauf (Körperkreislauf)',
    accent: '#ff846b',
    steps: [
      'Linke Kammer pumpt O2-reiches Blut über die Aorta in den Körper.',
      'Arteriolen und Kapillaren versorgen Gewebe mit Sauerstoff und Naehrstoffen.',
      'Rückfluss als O2-armes Blut über Venen/Hohlvenen in den rechten Vorhof.',
    ],
  },
  klein: {
    title: 'Kleiner Blutkreislauf (Lungenkreislauf)',
    accent: '#65abff',
    steps: [
      'Rechte Kammer presst O2-armes Blut in die Pulmonalarterie.',
      'In den Lungenkapillaren erfolgt Gasaustausch: CO2 raus, O2 rein.',
      'Rücktransport als O2-reiches Blut über Lungenvenen in den linken Vorhof.',
    ],
  },
};

const CIRCULATION_STEPS = [
  {
    id: 'small-out',
    focus: 'klein',
    title: '1) Rechtes Herz -> Lunge',
    description: 'O2-armes Blut fliesst vom rechten Herz über die Pulmonalarterie zur Lunge.',
    paths: ['p-small-out'],
    nodes: ['node-right', 'node-lungs'],
  },
  {
    id: 'small-back',
    focus: 'klein',
    title: '2) Lunge -> Linkes Herz',
    description: 'Nach dem Gasaustausch kommt O2-reiches Blut über die Lungenvenen zum linken Herz zurück.',
    paths: ['p-small-back'],
    nodes: ['node-lungs', 'node-left'],
  },
  {
    id: 'large-out',
    focus: 'gross',
    title: '3) Linkes Herz -> Körper',
    description: 'Das linke Herz pumpt O2-reiches Blut über Aorta und Arterien in den Körper.',
    paths: ['p-large-out'],
    nodes: ['node-left', 'node-body'],
  },
  {
    id: 'large-back',
    focus: 'gross',
    title: '4) Körper -> Rechtes Herz',
    description: 'O2-armes Blut fliesst über Venen und Hohlvenen zur rechten Herzseite zurück.',
    paths: ['p-large-back'],
    nodes: ['node-body', 'node-right'],
  },
];

function CirculationMap({ cycleMode, heartRate }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const visibleSteps = useMemo(() => {
    if (cycleMode === 'beide') return CIRCULATION_STEPS;
    return CIRCULATION_STEPS.filter((step) => step.focus === cycleMode);
  }, [cycleMode]);

  const activeStep = visibleSteps[Math.min(stepIndex, Math.max(visibleSteps.length - 1, 0))] || null;
  const flowDuration = Math.max(3, Math.min(7.2, (60 / Math.max(heartRate, 45)) * 4.8));
  const stepDurationMs = Math.max(1700, Math.min(3400, Math.round((60 / Math.max(heartRate, 45)) * 2100)));

  useEffect(() => {
    setStepIndex(0);
  }, [cycleMode]);

  useEffect(() => {
    if (!autoPlay || visibleSteps.length < 2) return undefined;
    const timer = setInterval(() => {
      setStepIndex((prev) => ((prev + 1) % visibleSteps.length));
    }, stepDurationMs);
    return () => clearInterval(timer);
  }, [autoPlay, visibleSteps, stepDurationMs]);

  const isPathVisible = (focus) => cycleMode === 'beide' || cycleMode === focus;
  const isPathActive = (pathId) => Boolean(activeStep && activeStep.paths.includes(pathId));
  const isNodeActive = (nodeId) => Boolean(activeStep && activeStep.nodes.includes(nodeId));

  const pathOpacity = (focus, pathId) => {
    if (!isPathVisible(focus)) return 0.08;
    if (!activeStep) return 0.64;
    return isPathActive(pathId) ? 0.98 : 0.24;
  };

  const renderFlowDots = (pathId, color, count, duration, visible, emphasized) => {
    if (!visible || !autoPlay) return null;
    const radius = emphasized ? 5.2 : 3.4;
    const fillOpacity = emphasized ? 1 : 0.4;
    return Array.from({ length: count }, (_, idx) => (
      <circle key={`${pathId}-${idx}`} r={radius} fill={color} opacity={fillOpacity}>
        <animateMotion dur={`${duration}s`} repeatCount="indefinite" begin={`${(idx / count) * duration}s`}>
          <mpath href={`#${pathId}`} />
        </animateMotion>
        <animate attributeName="opacity" values="0.25;1;0.25" dur="1.2s" repeatCount="indefinite" />
      </circle>
    ));
  };

  const drawStepBadge = (number, x, y, active) => (
    <g key={`badge-${number}`}>
      <circle cx={x} cy={y} r={active ? 17 : 14} fill={active ? '#1f5178' : '#10253b'} stroke="#5aa8ff" strokeWidth="2" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fill="#d7efff" fontFamily="monospace" fontWeight="700">
        {number}
      </text>
    </g>
  );

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a3a5a', background: 'radial-gradient(circle at 50% 20%, #103050, #05111f)' }}>
      <svg viewBox="0 0 1000 700" width="100%" role="img" aria-label="Schaubild mit Herz, Lunge und Körper für den Blutkreislauf">
        <defs>
          <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#ff7864" />
          </marker>
          <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#5aa8ff" />
          </marker>
          <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#183a59" />
            <stop offset="100%" stopColor="#0b2138" />
          </linearGradient>
          <linearGradient id="heartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cf4d63" />
            <stop offset="100%" stopColor="#7f2335" />
          </linearGradient>
          <linearGradient id="lungGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fc8ff" />
            <stop offset="100%" stopColor="#4d8dc8" />
          </linearGradient>
        </defs>

        <rect x="40" y="32" width="920" height="628" rx="28" fill="url(#panelGrad)" opacity="0.3" stroke="#2e638d" strokeWidth="2" />

        <g>
          <rect
            x="380"
            y="70"
            width="240"
            height="180"
            rx="16"
            fill="#0c2136"
            stroke={isNodeActive('node-lungs') ? '#8fc8ff' : '#2a5a90'}
            strokeWidth={isNodeActive('node-lungs') ? '3' : '1.8'}
          />
          <rect x="492" y="90" width="16" height="36" rx="7" fill="#c9e6ff" />
          <line x1="500" y1="126" x2="500" y2="214" stroke="#9dd2ff" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="452" cy="176" rx="52" ry="60" fill="url(#lungGrad)" opacity="0.85" />
          <ellipse cx="548" cy="176" rx="52" ry="60" fill="url(#lungGrad)" opacity="0.85" />
          <text x="500" y="236" textAnchor="middle" fontSize="18" fill="#d7efff" fontFamily="monospace" fontWeight="700">
            Lunge
          </text>
        </g>

        <g>
          <rect
            x="380"
            y="270"
            width="240"
            height="210"
            rx="16"
            fill="#0c2136"
            stroke={(isNodeActive('node-right') || isNodeActive('node-left')) ? '#f190a4' : '#2a5a90'}
            strokeWidth={(isNodeActive('node-right') || isNodeActive('node-left')) ? '3' : '1.8'}
          />
          <path
            d="M500 430 C476 410 435 383 435 338 C435 300 462 276 494 292 C507 298 515 308 521 320 C527 307 535 298 548 292 C580 276 607 300 607 338 C607 383 566 410 542 430 L521 448 Z"
            fill="url(#heartGrad)"
            stroke="#ffb2c1"
            strokeWidth="2.4"
          />
          <path d="M521 322 L521 444" stroke="#5a0d1d" strokeWidth="2.2" />
          <text x="470" y="462" textAnchor="middle" fontSize="12" fill="#b9d9f3" fontFamily="monospace">rechts</text>
          <text x="570" y="462" textAnchor="middle" fontSize="12" fill="#b9d9f3" fontFamily="monospace">links</text>
          <text x="500" y="298" textAnchor="middle" fontSize="18" fill="#ffd8df" fontFamily="monospace" fontWeight="700">
            Herz
          </text>
        </g>

        <g>
          <rect
            x="700"
            y="220"
            width="230"
            height="300"
            rx="16"
            fill="#0c2136"
            stroke={isNodeActive('node-body') ? '#ffb58f' : '#2a5a90'}
            strokeWidth={isNodeActive('node-body') ? '3' : '1.8'}
          />
          <circle cx="815" cy="274" r="30" fill="#b9dbf7" />
          <rect x="784" y="308" width="62" height="100" rx="28" fill="#9cc9ea" />
          <line x1="784" y1="336" x2="744" y2="380" stroke="#9cc9ea" strokeWidth="14" strokeLinecap="round" />
          <line x1="846" y1="336" x2="886" y2="380" stroke="#9cc9ea" strokeWidth="14" strokeLinecap="round" />
          <line x1="795" y1="408" x2="772" y2="466" stroke="#9cc9ea" strokeWidth="14" strokeLinecap="round" />
          <line x1="835" y1="408" x2="858" y2="466" stroke="#9cc9ea" strokeWidth="14" strokeLinecap="round" />
          <text x="815" y="486" textAnchor="middle" fontSize="18" fill="#d7efff" fontFamily="monospace" fontWeight="700">
            Körper
          </text>
        </g>

        <path
          id="p-small-out"
          d="M470 368 C425 330 430 246 488 210"
          fill="none"
          stroke="#5aa8ff"
          strokeWidth={isPathActive('p-small-out') ? 15 : 12}
          strokeLinecap="round"
          markerEnd="url(#arrow-blue)"
          opacity={pathOpacity('klein', 'p-small-out')}
          strokeDasharray={autoPlay && isPathActive('p-small-out') ? '14 10' : undefined}
        >
          {autoPlay && isPathActive('p-small-out') && (
            <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.9s" repeatCount="indefinite" />
          )}
        </path>
        <path
          id="p-small-back"
          d="M512 210 C575 246 580 332 532 368"
          fill="none"
          stroke="#ff7864"
          strokeWidth={isPathActive('p-small-back') ? 15 : 12}
          strokeLinecap="round"
          markerEnd="url(#arrow-red)"
          opacity={pathOpacity('klein', 'p-small-back')}
          strokeDasharray={autoPlay && isPathActive('p-small-back') ? '14 10' : undefined}
        >
          {autoPlay && isPathActive('p-small-back') && (
            <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.9s" repeatCount="indefinite" />
          )}
        </path>
        <path
          id="p-large-out"
          d="M540 368 C640 332 724 333 790 356"
          fill="none"
          stroke="#ff7864"
          strokeWidth={isPathActive('p-large-out') ? 16 : 13}
          strokeLinecap="round"
          markerEnd="url(#arrow-red)"
          opacity={pathOpacity('gross', 'p-large-out')}
          strokeDasharray={autoPlay && isPathActive('p-large-out') ? '16 10' : undefined}
        >
          {autoPlay && isPathActive('p-large-out') && (
            <animate attributeName="stroke-dashoffset" from="26" to="0" dur="0.9s" repeatCount="indefinite" />
          )}
        </path>
        <path
          id="p-large-back"
          d="M790 374 C704 472 602 510 470 370"
          fill="none"
          stroke="#5aa8ff"
          strokeWidth={isPathActive('p-large-back') ? 16 : 13}
          strokeLinecap="round"
          markerEnd="url(#arrow-blue)"
          opacity={pathOpacity('gross', 'p-large-back')}
          strokeDasharray={autoPlay && isPathActive('p-large-back') ? '16 10' : undefined}
        >
          {autoPlay && isPathActive('p-large-back') && (
            <animate attributeName="stroke-dashoffset" from="26" to="0" dur="0.9s" repeatCount="indefinite" />
          )}
        </path>

        {renderFlowDots('p-small-out', '#75beff', 7, flowDuration * 0.8, isPathVisible('klein'), isPathActive('p-small-out'))}
        {renderFlowDots('p-small-back', '#ff9b87', 7, flowDuration * 0.8, isPathVisible('klein'), isPathActive('p-small-back'))}
        {renderFlowDots('p-large-out', '#ff9a83', 12, flowDuration, isPathVisible('gross'), isPathActive('p-large-out'))}
        {renderFlowDots('p-large-back', '#79bcff', 12, flowDuration, isPathVisible('gross'), isPathActive('p-large-back'))}

        <circle cx="470" cy="368" r={isNodeActive('node-right') ? 15 : 10} fill="#5aa8ff" />
        <circle cx="532" cy="368" r={isNodeActive('node-left') ? 15 : 10} fill="#ff90a0" />
        <circle cx="500" cy="210" r={isNodeActive('node-lungs') ? 15 : 10} fill="#9ad0ff" />
        <circle cx="790" cy="365" r={isNodeActive('node-body') ? 15 : 10} fill="#ffc39b" />

        {drawStepBadge(1, 430, 283, isPathActive('p-small-out'))}
        {drawStepBadge(2, 572, 286, isPathActive('p-small-back'))}
        {drawStepBadge(3, 665, 330, isPathActive('p-large-out'))}
        {drawStepBadge(4, 657, 448, isPathActive('p-large-back'))}

        <text x="430" y="54" fontFamily="monospace" fontSize="14" fill="#9ac2de">KLEINER KREISLAUF</text>
        <text x="735" y="54" fontFamily="monospace" fontSize="14" fill="#9ac2de">GROSSER KREISLAUF</text>
      </svg>

      <div className="px-4 py-3" style={{ borderTop: '1px solid #1a3a5a', background: '#061325' }}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button
            type="button"
            onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
            className="rounded-md px-2.5 py-1 text-xs font-semibold"
            style={{ background: '#0c2238', color: '#9ac2de', border: '1px solid #2a5a90' }}
          >
            Schritt zurück
          </button>
          <button
            type="button"
            onClick={() => setStepIndex((prev) => Math.min(prev + 1, Math.max(visibleSteps.length - 1, 0)))}
            className="rounded-md px-2.5 py-1 text-xs font-semibold"
            style={{ background: '#0c2238', color: '#9ac2de', border: '1px solid #2a5a90' }}
          >
            Schritt vor
          </button>
          <button
            type="button"
            onClick={() => setAutoPlay((prev) => !prev)}
            className="rounded-md px-2.5 py-1 text-xs font-semibold"
            style={{
              background: autoPlay ? '#1e4f76' : '#0c2238',
              color: autoPlay ? '#d7efff' : '#9ac2de',
              border: '1px solid #2a5a90',
            }}
          >
            {autoPlay ? 'Auto-Durchlauf an' : 'Auto-Durchlauf aus'}
          </button>
        </div>

        {activeStep && (
          <div className="rounded-lg p-3 mb-3" style={{ border: '1px solid #2a5a90', background: '#081a2e' }}>
            <p className="text-xs font-mono font-bold mb-1" style={{ color: '#d7efff' }}>{activeStep.title}</p>
            <p className="text-xs leading-relaxed" style={{ color: '#8ab0c0' }}>{activeStep.description}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {visibleSteps.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setStepIndex(idx)}
              className="rounded-md px-2 py-1 text-[11px] font-semibold"
              style={{
                background: activeStep?.id === step.id ? '#1e4f76' : '#0c2238',
                color: activeStep?.id === step.id ? '#d7efff' : '#7aa7c8',
                border: '1px solid #2a5a90',
              }}
            >
              {step.title}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 text-xs font-mono">
          <span style={{ color: '#ff9a83' }}>ROT: O2-reich</span>
          <span style={{ color: '#79bcff' }}>BLAU: O2-arm</span>
          <span style={{ color: '#6d8ca9' }}>Arterie = vom Herzen weg, Vene = zum Herzen hin</span>
        </div>
      </div>
    </div>
  );
}

function FlowParticles({ running, color, start, end, speed = 0.24, count = 10, scale = 0.042 }) {
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
          <sphereGeometry args={[scale, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
        </mesh>
      ))}
    </>
  );
}

function VesselSegment({ start, end, color, radius = 0.058, opacity = 0.36 }) {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const direction = endVec.clone().sub(startVec);
  const length = direction.length();
  const midpoint = startVec.clone().add(endVec).multiplyScalar(0.5);
  const unit = direction.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), unit);

  return (
    <mesh position={midpoint.toArray()} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 14]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={color}
        emissiveIntensity={0.22}
        metalness={0.16}
        roughness={0.48}
      />
    </mesh>
  );
}

function HeartAssembly({
  xrayMode,
  activeSpot,
  setActiveSpot,
  cycleMode,
  showLabels,
  heartRate,
  animateHeart,
  showSystemicFlow,
  showPulmonaryFlow,
}) {
  const pulseRef = useRef();

  useFrame((state) => {
    if (!pulseRef.current) return;
    if (!animateHeart) {
      pulseRef.current.scale.setScalar(1);
      return;
    }
    const beatsPerSecond = Math.max(0.8, heartRate / 60);
    const wave = Math.max(0, Math.sin(state.clock.elapsedTime * beatsPerSecond * Math.PI * 2));
    const pulseScale = 1 + wave * 0.045;
    pulseRef.current.scale.setScalar(pulseScale);
  });

  const myocardiumMaterial = {
    color: '#7d2231',
    metalness: 0.14,
    roughness: 0.38,
    transparent: true,
    opacity: xrayMode ? 0.3 : 0.93,
    wireframe: xrayMode,
    emissive: '#310d16',
    emissiveIntensity: xrayMode ? 0.6 : 0.16,
  };

  const rightMaterial = {
    ...myocardiumMaterial,
    color: '#6c1f30',
    opacity: xrayMode ? 0.26 : 0.9,
  };

  const vesselWire = {
    metalness: 0.24,
    roughness: 0.36,
    transparent: true,
    opacity: xrayMode ? 0.38 : 0.92,
    wireframe: xrayMode,
  };

  return (
    <group position={[0, -0.05, 0]}>
      <mesh position={[-2.8, 1.45, 0.3]} scale={[1.1, 1.45, 0.7]}>
        <sphereGeometry args={[0.55, 28, 28]} />
        <meshStandardMaterial color="#164466" transparent opacity={0.18} />
      </mesh>
      <mesh position={[2.75, 1.3, 0.28]} scale={[1.1, 1.38, 0.72]}>
        <sphereGeometry args={[0.55, 28, 28]} />
        <meshStandardMaterial color="#164466" transparent opacity={0.18} />
      </mesh>
      <mesh position={[0, 1.36, -1.8]} scale={[2.15, 1.5, 0.42]}>
        <sphereGeometry args={[0.9, 28, 18]} />
        <meshStandardMaterial color="#11314f" transparent opacity={0.15} />
      </mesh>

      <group ref={pulseRef} position={[0, 0.32, 0.02]}>
        <group rotation={[0.06, -0.15, 0.04]}>
          <mesh position={[-0.38, 0.36, 0.05]} scale={[0.92, 1.27, 0.9]}>
            <sphereGeometry args={[0.9, 48, 42]} />
            <meshStandardMaterial {...rightMaterial} />
          </mesh>
          <mesh position={[0.44, 0.3, 0.0]} scale={[0.92, 1.36, 0.96]}>
            <sphereGeometry args={[0.95, 48, 42]} />
            <meshStandardMaterial {...myocardiumMaterial} />
          </mesh>
          <mesh position={[-0.67, 1.36, 0.1]} scale={[0.56, 0.5, 0.57]}>
            <sphereGeometry args={[0.65, 36, 32]} />
            <meshStandardMaterial color="#5f2b40" transparent opacity={xrayMode ? 0.35 : 0.9} wireframe={xrayMode} />
          </mesh>
          <mesh position={[0.67, 1.31, 0.08]} scale={[0.54, 0.46, 0.55]}>
            <sphereGeometry args={[0.66, 36, 32]} />
            <meshStandardMaterial color="#8d3446" transparent opacity={xrayMode ? 0.35 : 0.9} wireframe={xrayMode} />
          </mesh>
          <mesh position={[0.03, 0.66, -0.26]} scale={[0.14, 1.6, 0.2]}>
            <boxGeometry args={[1.0, 1.0, 1.0]} />
            <meshStandardMaterial color="#4a1622" transparent opacity={xrayMode ? 0.45 : 0.8} />
          </mesh>
          <mesh position={[0.37, 1.0, 0.76]} rotation={[Math.PI / 2, 0.12, 0.2]}>
            <torusGeometry args={[0.19, 0.042, 18, 46]} />
            <meshStandardMaterial color="#ffb1bc" emissive="#7d2834" emissiveIntensity={0.22} />
          </mesh>
          <mesh position={[-0.34, 1.0, 0.8]} rotation={[Math.PI / 2, -0.16, -0.22]}>
            <torusGeometry args={[0.19, 0.042, 18, 46]} />
            <meshStandardMaterial color="#92ccff" emissive="#225080" emissiveIntensity={0.22} />
          </mesh>
          <mesh position={[0.78, 2.02, -0.24]}>
            <cylinderGeometry args={[0.22, 0.26, 1.32, 36]} />
            <meshStandardMaterial color="#ff7547" {...vesselWire} />
          </mesh>
          <mesh position={[0.8, 2.66, -0.12]} rotation={[0, 0, -0.78]}>
            <torusGeometry args={[0.72, 0.17, 18, 42, Math.PI]} />
            <meshStandardMaterial color="#ff7242" {...vesselWire} />
          </mesh>
          <mesh position={[-0.74, 1.84, 0.19]} rotation={[0.2, 0, 0.44]}>
            <cylinderGeometry args={[0.2, 0.2, 1.78, 30]} />
            <meshStandardMaterial color="#4fa1ff" {...vesselWire} />
          </mesh>
          <mesh position={[-0.92, 2.24, 0.16]} rotation={[0, 0, 0.36]}>
            <cylinderGeometry args={[0.12, 0.16, 1.16, 24]} />
            <meshStandardMaterial color="#5aaeff" {...vesselWire} />
          </mesh>
          <mesh position={[-1.18, 2.46, 0.28]} rotation={[0, 0, 1.08]}>
            <cylinderGeometry args={[0.08, 0.09, 0.92, 18]} />
            <meshStandardMaterial color="#5caeff" {...vesselWire} />
          </mesh>
          <mesh position={[0.2, 2.05, 0.34]} rotation={[0, 0, -0.95]}>
            <cylinderGeometry args={[0.08, 0.08, 0.9, 18]} />
            <meshStandardMaterial color="#ff8a8a" {...vesselWire} />
          </mesh>
          <mesh position={[1.05, 1.9, 0.42]} rotation={[0, 0, 1.02]}>
            <cylinderGeometry args={[0.08, 0.08, 0.96, 18]} />
            <meshStandardMaterial color="#ff8a8a" {...vesselWire} />
          </mesh>
          <mesh position={[-1.0, 2.7, 0.12]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 1.22, 24]} />
            <meshStandardMaterial color="#3d86e5" {...vesselWire} />
          </mesh>
          <mesh position={[-0.8, -0.62, 0.1]} rotation={[0.12, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.2, 1.0, 24]} />
            <meshStandardMaterial color="#3d86e5" {...vesselWire} />
          </mesh>
        </group>
      </group>

      {SYSTEMIC_SEGMENTS.map((segment) => (
        <group key={segment.id}>
          <VesselSegment
            start={segment.start}
            end={segment.end}
            color={segment.color}
            opacity={cycleMode === 'klein' ? 0.08 : 0.34}
          />
          <FlowParticles
            running={showSystemicFlow}
            color={segment.color}
            start={segment.start}
            end={segment.end}
            speed={segment.speed}
            count={segment.count}
          />
        </group>
      ))}

      {PULMONARY_SEGMENTS.map((segment) => (
        <group key={segment.id}>
          <VesselSegment
            start={segment.start}
            end={segment.end}
            color={segment.color}
            opacity={cycleMode === 'gross' ? 0.09 : 0.33}
          />
          <FlowParticles
            running={showPulmonaryFlow}
            color={segment.color}
            start={segment.start}
            end={segment.end}
            speed={segment.speed}
            count={segment.count}
          />
        </group>
      ))}

      {showLabels && HEART_SPOTS.map((spot) => {
        const isActive = activeSpot === spot.id;
        return (
          <group key={spot.id} position={spot.position}>
            <mesh onClick={(event) => { event.stopPropagation(); setActiveSpot(isActive ? null : spot.id); }}>
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshStandardMaterial
                color={spot.color}
                emissive={spot.color}
                emissiveIntensity={isActive ? 1.9 : 0.9}
                transparent
                opacity={0.95}
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
                  background: isActive ? '#081a2e' : 'rgba(8, 26, 46, 0.52)',
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

export default function HeartDeepDiveThree({ initialTab = 'anatomie', initialScene = 'heart' }) {
  const startsInCirculation = initialScene === 'circulation' || initialTab === 'kreislauf';
  const [xrayMode, setXrayMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [heartRate, setHeartRate] = useState(74);
  const [activeSpot, setActiveSpot] = useState('linkeKammer');
  const [cycleMode, setCycleMode] = useState(startsInCirculation ? 'beide' : 'klein');
  const [flowAnimationRunning, setFlowAnimationRunning] = useState(false);
  const [infoTab, setInfoTab] = useState(initialTab === 'kreislauf' ? 'kreislauf' : 'anatomie');
  const [sceneView, setSceneView] = useState(startsInCirculation ? 'circulation' : 'heart');

  const activeSpotData = activeSpot ? HEART_SPOT_DATA[activeSpot] : null;
  const cardiacOutput = useMemo(() => ((heartRate * STROKE_VOLUME_ML) / 1000).toFixed(1), [heartRate]);
  const showSystemicFlow = flowAnimationRunning && (cycleMode === 'gross' || cycleMode === 'beide');
  const showPulmonaryFlow = flowAnimationRunning && (cycleMode === 'klein' || cycleMode === 'beide');

  const innerCardStyle = {
    background: '#0a1a2e',
    border: '1px solid #1a3a5a',
    borderRadius: '0.9rem',
    padding: '0.9rem',
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#040d1a', border: '1px solid #1a3a5a' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: '1px solid #1a3a5a' }}>
        <div>
          <p className="text-xs font-mono tracking-widest" style={{ color: '#4a9eff' }}>
            DEEP DIVE · HERZ-KOMPONENTENANALYSE
          </p>
          <h3 className="text-lg font-black text-white mt-0.5">Menschliches Herz in 3D</h3>
          <p className="text-xs font-mono mt-1" style={{ color: '#58789c' }}>
            Anatomie + grosser/kleiner Blutkreislauf
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            type="button"
            onClick={() => {
              setSceneView('heart');
              setInfoTab('anatomie');
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{
              background: sceneView === 'heart' ? '#1e4f76' : '#0a1a2e',
              color: sceneView === 'heart' ? '#d7efff' : '#7ab0d0',
              border: '1px solid #1a3a5a',
            }}
          >
            Herz 3D
          </button>
          <button
            type="button"
            onClick={() => {
              setSceneView('circulation');
              setInfoTab('kreislauf');
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{
              background: sceneView === 'circulation' ? '#1e4f76' : '#0a1a2e',
              color: sceneView === 'circulation' ? '#d7efff' : '#7ab0d0',
              border: '1px solid #1a3a5a',
            }}
          >
            Kreislaufkarte
          </button>
          {sceneView === 'heart' && (
            <>
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
            </>
          )}
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.7fr_1fr]" style={{ minHeight: 0 }}>
        <div className="p-4 lg:p-5" style={{ borderRight: '1px solid #1a3a5a', background: '#030c18' }}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
              KREISLAUF-MODUS
            </span>
            {[
              { id: 'klein', label: 'Kleiner Kreislauf' },
              { id: 'gross', label: 'Grosser Kreislauf' },
              { id: 'beide', label: 'Beide' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setCycleMode(option.id)}
                className="rounded-md px-2.5 py-1 text-xs font-semibold"
                style={{
                  background: cycleMode === option.id ? '#1e4f76' : '#0c2238',
                  color: cycleMode === option.id ? '#d7efff' : '#7aa7c8',
                  border: '1px solid #2a5a90',
                }}
              >
                {option.label}
              </button>
            ))}
            {sceneView === 'heart' && (
              <button
                type="button"
                onClick={() => setFlowAnimationRunning((prev) => !prev)}
                className="rounded-md px-2.5 py-1 text-xs font-semibold"
                style={{
                  background: flowAnimationRunning ? '#1e4f76' : '#0c2238',
                  color: flowAnimationRunning ? '#d7efff' : '#7aa7c8',
                  border: '1px solid #2a5a90',
                }}
              >
                {flowAnimationRunning ? 'Animation stoppen' : 'Animation starten'}
              </button>
            )}
          </div>

          {sceneView === 'heart' ? (
            <>
              <div style={{ width: '100%', height: MODEL_HEIGHT, borderRadius: '0.85rem', overflow: 'hidden' }}>
                <Canvas dpr={[1, 1.8]} camera={{ position: [0, 1.7, 7.4], fov: 48 }} onPointerMissed={() => setActiveSpot(null)}>
                  <color attach="background" args={['#030c18']} />
                  <ambientLight intensity={0.36} />
                  <hemisphereLight intensity={0.5} color="#a2ceff" groundColor="#0b1f35" />
                  <directionalLight position={[4, 8, 5]} intensity={1.16} color="#e2eeff" />
                  <pointLight position={[-3.8, 2.2, 2]} intensity={0.8} color="#5aa8ff" />
                  <pointLight position={[3.4, 2.1, 2.2]} intensity={0.78} color="#ff7462" />

                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.95, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="#071426" roughness={0.9} metalness={0.08} />
                  </mesh>
                  <gridHelper args={[20, 36, '#12314f', '#0a1e32']} position={[0, -1.94, 0]} />

                  <HeartAssembly
                    xrayMode={xrayMode}
                    activeSpot={activeSpot}
                    setActiveSpot={setActiveSpot}
                    cycleMode={cycleMode}
                    showLabels={showLabels}
                    heartRate={heartRate}
                    animateHeart={flowAnimationRunning}
                    showSystemicFlow={showSystemicFlow}
                    showPulmonaryFlow={showPulmonaryFlow}
                  />

                  <OrbitControls
                    enablePan={false}
                    minDistance={4.9}
                    maxDistance={10.6}
                    minPolarAngle={Math.PI * 0.14}
                    maxPolarAngle={Math.PI * 0.78}
                    target={[0, 0.9, 0]}
                    autoRotate={!activeSpot}
                    autoRotateSpeed={0.24}
                  />
                </Canvas>
              </div>
              <div className="mt-3 text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
                ZIEHEN ZUM DREHEN · HOTSPOT ANTIPPEN · KREISLAUF-MODUS WECHSELN
              </div>
            </>
          ) : (
            <>
              <div style={{ width: '100%', height: MODEL_HEIGHT }}>
                <CirculationMap cycleMode={cycleMode} heartRate={heartRate} />
              </div>
              <div className="mt-3 text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
                KLARE FLUSSRICHTUNG: ROT = O2-REICH, BLAU = O2-ARM
              </div>
            </>
          )}
        </div>

        <div className="p-5 space-y-3 overflow-y-auto">
          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>
              KENNDATEN
            </p>
            {[
              { label: 'Herzfrequenz', value: `${heartRate} bpm` },
              { label: 'Schlagvolumen', value: `${STROKE_VOLUME_ML} ml` },
              { label: 'Herzzeitvolumen', value: `${cardiacOutput} L/min` },
              { label: 'Aktiver Modus', value: cycleMode === 'gross' ? 'Grosser Kreislauf' : cycleMode === 'klein' ? 'Kleiner Kreislauf' : 'Beide Kreislaufe' },
            ].map((entry) => (
              <div key={entry.label} className="flex justify-between text-sm py-1.5" style={{ borderBottom: '1px solid #0e2540' }}>
                <span style={{ color: '#456080' }}>{entry.label}</span>
                <span className="font-mono text-right ml-2" style={{ color: '#c0d8f0' }}>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>

          <div style={innerCardStyle}>
            <div className="flex gap-1.5 mb-3">
              <button
                type="button"
                onClick={() => {
                  setInfoTab('anatomie');
                  setSceneView('heart');
                }}
                className="rounded-md px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  background: infoTab === 'anatomie' ? '#1e4f76' : '#0c2238',
                  color: infoTab === 'anatomie' ? '#d7efff' : '#7aa7c8',
                  border: '1px solid #2a5a90',
                }}
              >
                Anatomie
              </button>
              <button
                type="button"
                onClick={() => {
                  setInfoTab('kreislauf');
                  setSceneView('circulation');
                }}
                className="rounded-md px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  background: infoTab === 'kreislauf' ? '#1e4f76' : '#0c2238',
                  color: infoTab === 'kreislauf' ? '#d7efff' : '#7aa7c8',
                  border: '1px solid #2a5a90',
                }}
              >
                Blutkreislauf
              </button>
            </div>

            {infoTab === 'anatomie' ? (
              <div className="space-y-2">
                {activeSpotData ? (
                  <div className="rounded-lg p-3" style={{ background: '#040d1a', border: `1px solid ${activeSpotData.color}` }}>
                    <p className="text-xs font-mono font-bold mb-2" style={{ color: activeSpotData.color }}>
                      {activeSpotData.short} {activeSpotData.title}
                    </p>
                    {activeSpotData.items.map((item) => (
                      <p key={item} className="text-xs leading-relaxed" style={{ color: '#8ab0c0' }}>
                        - {item}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: '#8ab0c0' }}>
                    Tippe im Modell auf einen Hotspot, um die Struktur zu erklären.
                  </p>
                )}

                <div className="grid grid-cols-1 gap-1.5">
                  {HEART_SPOTS.map((spot) => (
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
                      {spot.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="rounded-lg p-3" style={{ background: '#081a2e', border: '1px solid #2a5a90' }}>
                  <p className="text-xs font-mono font-bold mb-1" style={{ color: '#d7efff' }}>
                    Laien-Merksatz
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#9ec4de' }}>
                    Arterie bedeutet immer: Blut fließt vom Herzen weg. Vene bedeutet immer: Blut fließt zum Herzen zurück.
                    Die Farbe (O2-reich oder O2-arm) kann je nach Kreislauf unterschiedlich sein.
                  </p>
                </div>
                {(['klein', 'gross']).map((key) => {
                  const detail = CYCLE_DETAILS[key];
                  const highlighted =
                    cycleMode === 'beide' ||
                    (cycleMode === 'klein' && key === 'klein') ||
                    (cycleMode === 'gross' && key === 'gross');

                  return (
                    <div key={key} className="rounded-lg p-3" style={{ background: '#040d1a', border: `1px solid ${detail.accent}` }}>
                      <p
                        className="text-xs font-mono font-bold mb-2"
                        style={{ color: highlighted ? detail.accent : '#6e8aa6', opacity: highlighted ? 1 : 0.6 }}
                      >
                        {detail.title}
                      </p>
                      {detail.steps.map((step) => (
                        <p key={step} className="text-xs leading-relaxed" style={{ color: highlighted ? '#9ec4de' : '#6f8ca3' }}>
                          - {step}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#34c090' }}>
              TRAINING
            </p>
            <label htmlFor="heart-rate-slider" className="text-xs block mb-2" style={{ color: '#8ab0c0' }}>
              Herzfrequenz simulieren ({heartRate} bpm)
            </label>
            <input
              id="heart-rate-slider"
              type="range"
              min="50"
              max="140"
              step="1"
              value={heartRate}
              onChange={(event) => setHeartRate(Number(event.target.value))}
              className="w-full accent-cyan-500"
            />
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: '#6d8ca9' }}>
              Nutze 60-90 bpm für Ruhebereich und mehr als 110 bpm für Belastung. Beobachte, wie das Herzzeitvolumen reagiert.
            </p>
          </div>

          <div style={{ ...innerCardStyle, background: '#0a2038', border: '1px solid #1a5060' }}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#34c090' }}>
              PRUEFUNGSFRAGE
            </p>
            <p className="text-sm font-semibold mb-2" style={{ color: '#c0d8f0' }}>
              Warum führt die Pulmonalarterie O2-armes Blut, obwohl sie eine Arterie ist?
            </p>
            <details>
              <summary className="text-xs cursor-pointer font-mono" style={{ color: '#4a9eff' }}>
                Antwort einblenden
              </summary>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#90b0d0' }}>
                Arterien und Venen werden nach Flussrichtung vom bzw. zum Herzen definiert. Die Pulmonalarterie führt
                Blut vom Herzen weg zur Lunge und ist deshalb eine Arterie, auch wenn das Blut dort noch O2-arm ist.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
