import { useMemo, useState } from 'react';

const MODEL_HEIGHT = 'clamp(380px, 64vh, 840px)';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const avgZ = (pts) => pts.reduce((sum, p) => sum + p[2], 0) / pts.length;
const toPolyPoints = (pts) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

const HOTSPOTS = [
  { id: 'steuerung', shortLabel: 'CTRL', label: 'Mikroprozessor-Steuerung', color: '#4a9eff', pos: [-115, -72, -8] },
  { id: 'vorratsbehälter', shortLabel: 'VORRAT', label: 'Vorratsbehälter', color: '#8cbeff', pos: [8, -58, 8] },
  { id: 'düsensystem', shortLabel: 'DUESE', label: 'Düsensystem', color: '#34c090', pos: [54, -34, 2] },
  { id: 'loesetank', shortLabel: 'LOESE', label: 'Loese-/Sedimentationstank', color: '#a070ff', pos: [8, 20, 42] },
  { id: 'sorptionseinheit', shortLabel: 'SORP', label: 'Sorptionseinheit', color: '#d8a240', pos: [100, 16, 5] },
  { id: 'schwenkantrieb', shortLabel: 'SWENK', label: 'Schwenkantrieb', color: '#ff7a7a', pos: [18, 78, 10] },
  { id: 'tauchdruckpumpe', shortLabel: 'PUMP', label: 'Tauchdruckpumpe', color: '#34b9ff', pos: [-88, 90, 30] },
  { id: 'produktbehälter', shortLabel: 'PROD', label: 'Produktbehälter', color: '#4ad097', pos: [100, 80, 44] },
  { id: 'schwimmerschalter', shortLabel: 'LEVEL', label: 'Schwimmerschalter', color: '#f2b15b', pos: [-116, 36, 38] },
];

const HOTSPOT_DATA = {
  steuerung: {
    title: 'Mikroprozessor-Steuerung',
    short: 'CTRL',
    color: '#4a9eff',
    items: [
      'Steuert Schwenkzyklen, Überlaufzeit und Umschaltung der Ventile.',
      'Verknuepft Anwasserungsdauer, Loesezeit und Dosierfreigabe in Sequenzen.',
      'Verriegelt die Produktabgabe bei Störungen oder Fehlfuellstand.',
    ],
  },
  vorratsbehälter: {
    title: 'Vorratsbehälter',
    short: 'VORRAT',
    color: '#8cbeff',
    items: [
      'Behälter für Calciumhypochlorit-Feststoff im trockenen Bereich.',
      'Anwaesserung erfolgt nur getaktet über Düsensystem und nie im Dauerstrahl.',
      'Schützt vor Klumpenbildung und unkontrollierten Konzentrationsspitzen.',
    ],
  },
  düsensystem: {
    title: 'Düsensystem',
    short: 'DUESE',
    color: '#34c090',
    items: [
      'Bespraeht den Feststoff gleichmäßig für kontrollierte Anwasserung.',
      'Definierte Tropfen-/Spruehcharakteristik verhindert Aufhaertungen.',
      'Bei unruhigem Düsenbild: Druck und Vorfilter sofort prüfen.',
    ],
  },
  loesetank: {
    title: 'Loese-/Sedimentationstank',
    short: 'LOESE',
    color: '#a070ff',
    items: [
      'Hier entsteht die Produktlösung aus angewassertem Feststoff.',
      'Unlösliche Nebenbestandteile setzen sich im Sedimentbereich ab.',
      'Abgabe erfolgt erst nach Beruhigungs-/Überlaufphase.',
    ],
  },
  sorptionseinheit: {
    title: 'Sorptionseinheit',
    short: 'SORP',
    color: '#d8a240',
    items: [
      'Optionale Feinbehandlung in der Produktstrecke.',
      'Reduziert Schwebstoffe und stabilisiert die Dosierstrecke.',
      'Druckverlust als Wartungsindikator verwenden.',
    ],
  },
  schwenkantrieb: {
    title: 'Schwenkantrieb',
    short: 'SWENK',
    color: '#ff7a7a',
    items: [
      'Löst Feststoffbruecken durch mechanische Bewegung.',
      'Verbessert Benetzung aller Feststoffzonen während der Anwasserung.',
      'Wird zyklisch von der Steuerung gestartet und gestoppt.',
    ],
  },
  tauchdruckpumpe: {
    title: 'Tauchdruckpumpe',
    short: 'PUMP',
    color: '#34b9ff',
    items: [
      'Entnimmt Wasser für Düsensystem und Loeseprozess.',
      'Stellt den benötigten Betriebsdruck für gleichmäßige Anwasserung.',
      'Trockenlaufschutz über Schwimmerschalter zwingend.',
    ],
  },
  produktbehälter: {
    title: 'Produktbehälter',
    short: 'PROD',
    color: '#4ad097',
    items: [
      'Puffer für rückstandsarme Calciumhypochlorit-Produktlösung.',
      'Membrandosierpumpe entnimmt von hier in Richtung Impfstelle.',
      'Füllstand und Konzentration regelmäßig dokumentieren.',
    ],
  },
  schwimmerschalter: {
    title: 'Schwimmerschalter',
    short: 'LEVEL',
    color: '#f2b15b',
    items: [
      'Meldet Mindest- und Maximalfuellstand im Wassertank.',
      'Sichert gegen Trockenlauf und Überfuellung.',
      'Ist Freigabebedingung für Pumpe und Anwasserung.',
    ],
  },
};

const KENNDATEN = [
  { label: 'Wirkstoff', value: 'Calciumhypochlorit Ca(ClO)2 (fest)' },
  { label: 'Aktivchlor im Produkt', value: 'typisch 65 - 70 %' },
  { label: 'Anwasserung', value: 'getaktet über Düsensystem' },
  { label: 'Lösungsbildung', value: '2-Kammer-/Sedimentationsprinzip' },
  { label: 'Dosierung', value: 'über Membrandosierpumpe' },
];

const PROCESS_PHASES = [
  {
    id: 'anwaessern',
    label: '1 Anwaessern',
    accent: '#34b9ff',
    focus: ['tauchdruckpumpe', 'düsensystem', 'vorratsbehälter'],
    detail: [
      'Pumpe entnimmt Wasser und baut gleichmäßigen Druck auf.',
      'Düsen benetzen den Feststoff in kurzen, definierten Pulsen.',
      'Ziel: vollständige Benetzung ohne Überflutung des Vorrats.',
    ],
    caution: 'Zu lange Anwasserung kann Verkrustungen und unruhige Konzentrationen verursachen.',
  },
  {
    id: 'lösen',
    label: '2 Lösen',
    accent: '#7a8fff',
    focus: ['vorratsbehälter', 'schwenkantrieb', 'loesetank'],
    detail: [
      'Angewasserter Feststoff wird durch Schwenkimpulse gelockert.',
      'Loesliche Anteile gehen in den Loesetank über.',
      'Zielkonzentration wird über Zeitfenster reproduzierbar gehalten.',
    ],
    caution: 'Bei Brückenbildung sinkt Lösungsleistung, deshalb Schwenkzyklen prüfen.',
  },
  {
    id: 'sedimentieren',
    label: '3 Sedimentieren',
    accent: '#b779ff',
    focus: ['loesetank', 'sorptionseinheit', 'produktbehälter'],
    detail: [
      'Im Loesetank setzen sich unlösliche Bestandteile ab.',
      'Klare Phase wird über Überlauf/Abgang weitergeführt.',
      'Optionale Sorption stabilisiert die Produktqualität.',
    ],
    caution: 'Bei zu kurzer Beruhigungszeit gelangen Rückstände in die Produktstrecke.',
  },
  {
    id: 'dosieren',
    label: '4 Dosieren',
    accent: '#34c090',
    focus: ['produktbehälter', 'steuerung', 'schwimmerschalter'],
    detail: [
      'Produktlösung wird aus dem Produktbehälter bedarfsgerecht entnommen.',
      'Steuerung koppelt Dosierung an Messwerte und Betriebsvorgaben.',
      'Füllstandssignale sichern Nachspeisung und Störabschaltung.',
    ],
    caution: 'Dosierung nur bei stabilem pH-Fenster und freigegebenem Anlagenstatus.',
  },
];

const PHASE_FLOW_SEGMENTS = {
  anwaessern: [
    [[-88, 90, 30], [-88, 32, 26], [-42, 20, 16], [14, -20, 8], [56, -34, 2]],
    [[56, -34, 2], [26, -40, 8], [8, -58, 8]],
  ],
  lösen: [
    [[8, -58, 8], [12, -20, 18], [10, 6, 30], [8, 20, 42]],
    [[18, 78, 10], [16, 44, 18], [12, 22, 30]],
  ],
  sedimentieren: [
    [[8, 20, 42], [38, 22, 32], [70, 18, 22], [100, 16, 5]],
    [[100, 16, 5], [104, 42, 18], [102, 62, 30], [100, 80, 44]],
  ],
  dosieren: [
    [[100, 80, 44], [112, 78, 24], [126, 76, 6]],
    [[-116, 36, 38], [-116, -20, 18], [-116, -72, -8]],
  ],
};

const STATIC_PIPE_SEGMENTS = [
  [[-88, 90, 30], [-88, 32, 26], [-42, 20, 16], [14, -20, 8], [56, -34, 2]],
  [[56, -34, 2], [26, -40, 8], [8, -58, 8]],
  [[8, -58, 8], [10, 6, 30], [8, 20, 42], [70, 18, 22], [100, 16, 5]],
  [[100, 16, 5], [102, 62, 30], [100, 80, 44]],
];

const BETRIEBSCHECKS = [
  { label: 'Freies Chlor (Becken)', value: '0,3 - 0,6 mg/L', ok: true },
  { label: 'pH-Fenster', value: '7,0 - 7,4', ok: true },
  { label: 'Anwasserung', value: 'pulsierend, nicht kontinuierlich', ok: true },
  { label: 'Produktstrecke', value: 'klar, ohne sichtbare Rückstände', ok: true },
];

function renderCuboidFaces(project, config, xrayMode) {
  const { id, center, size, colors, stroke = '#2a5a90', strokeWidth = 1 } = config;
  const [cx, cy, cz] = center;
  const [sx, sy, sz] = size;
  const hx = sx / 2;
  const hy = sy / 2;
  const hz = sz / 2;

  const c = {
    p000: project(cx - hx, cy - hy, cz - hz),
    p100: project(cx + hx, cy - hy, cz - hz),
    p110: project(cx + hx, cy + hy, cz - hz),
    p010: project(cx - hx, cy + hy, cz - hz),
    p001: project(cx - hx, cy - hy, cz + hz),
    p101: project(cx + hx, cy - hy, cz + hz),
    p111: project(cx + hx, cy + hy, cz + hz),
    p011: project(cx - hx, cy + hy, cz + hz),
  };

  const faces = [
    { name: 'front', pts: [c.p000, c.p100, c.p110, c.p010], fill: colors.front },
    { name: 'back', pts: [c.p001, c.p101, c.p111, c.p011], fill: colors.back },
    { name: 'left', pts: [c.p000, c.p001, c.p011, c.p010], fill: colors.left },
    { name: 'right', pts: [c.p100, c.p101, c.p111, c.p110], fill: colors.right },
    { name: 'top', pts: [c.p000, c.p100, c.p101, c.p001], fill: colors.top },
    { name: 'bottom', pts: [c.p010, c.p110, c.p111, c.p011], fill: colors.bottom },
  ].map((face) => ({
    ...face,
    id: `${id}-${face.name}`,
    zVal: avgZ(face.pts),
    stroke,
    strokeWidth,
    fillOpacity: xrayMode ? 0.13 : 0.72,
  }));

  return faces;
}

function CalciumPlantCube3D({
  activeSpot,
  setActiveSpot,
  xrayMode,
  showLabels,
  activePhase,
}) {
  const [rx, setRx] = useState(-22);
  const [ry, setRy] = useState(26);
  const [drag, setDrag] = useState(null);

  const phase = PROCESS_PHASES.find((item) => item.id === activePhase) || PROCESS_PHASES[0];

  const pointFromEvent = (event) => (event.touches ? event.touches[0] : event);

  const onPointerDown = (event) => {
    if (event.target.closest('[data-hotspot="1"]')) return;
    const p = pointFromEvent(event);
    setDrag({ x: p.clientX, y: p.clientY });
    event.preventDefault();
  };

  const onPointerMove = (event) => {
    if (!drag) return;
    const p = pointFromEvent(event);
    const dx = p.clientX - drag.x;
    const dy = p.clientY - drag.y;
    setRy((current) => current + dx * 0.45);
    setRx((current) => clamp(current - dy * 0.35, -68, 24));
    setDrag({ x: p.clientX, y: p.clientY });
    event.preventDefault();
  };

  const onPointerUp = () => setDrag(null);

  const project = (x, y, z) => {
    const cY = Math.cos((ry * Math.PI) / 180);
    const sY = Math.sin((ry * Math.PI) / 180);
    const cX = Math.cos((rx * Math.PI) / 180);
    const sX = Math.sin((rx * Math.PI) / 180);

    const x1 = (x * cY) - (z * sY);
    const z1 = (x * sY) + (z * cY);
    const y1 = (y * cX) - (z1 * sX);
    const z2 = (y * sX) + (z1 * cX);
    const d = 430 / (430 + z2);

    return [190 + (x1 * d), 166 + (y1 * d), z2];
  };

  const componentFaces = useMemo(() => {
    const base = [
      {
        id: 'housing',
        center: [0, 26, 28],
        size: [272, 188, 138],
        colors: {
          front: '#0a2544',
          back: '#091c34',
          left: '#0a213d',
          right: '#0a213d',
          top: '#10365f',
          bottom: '#081a30',
        },
        stroke: '#2f6aa5',
        strokeWidth: 1.2,
      },
      {
        id: 'water-tank',
        center: [-92, 68, 48],
        size: [70, 98, 72],
        colors: {
          front: '#13395f',
          back: '#0e2e4f',
          left: '#113452',
          right: '#123a5f',
          top: '#1b4f7a',
          bottom: '#0e253f',
        },
      },
      {
        id: 'vorrat',
        center: [8, -54, 14],
        size: [86, 34, 60],
        colors: {
          front: '#2b4f7f',
          back: '#243f64',
          left: '#2a466e',
          right: '#305783',
          top: '#4678ac',
          bottom: '#213955',
        },
      },
      {
        id: 'loesetank',
        center: [8, 26, 42],
        size: [102, 84, 86],
        colors: {
          front: '#2f3d7a',
          back: '#27325f',
          left: '#2b3568',
          right: '#35458e',
          top: '#4f5cae',
          bottom: '#272f58',
        },
      },
      {
        id: 'produkt',
        center: [100, 82, 46],
        size: [64, 102, 74],
        colors: {
          front: '#1b4c4f',
          back: '#153c3d',
          left: '#184344',
          right: '#1f5758',
          top: '#2e7273',
          bottom: '#153435',
        },
      },
      {
        id: 'sorption',
        center: [100, 20, 6],
        size: [26, 72, 24],
        colors: {
          front: '#5c4f21',
          back: '#4a401a',
          left: '#56491e',
          right: '#6e5f27',
          top: '#8b7a35',
          bottom: '#473d19',
        },
      },
      {
        id: 'steuerung',
        center: [-114, -72, -8],
        size: [58, 32, 10],
        colors: {
          front: '#12345d',
          back: '#0e2a4b',
          left: '#102f51',
          right: '#16406e',
          top: '#27588e',
          bottom: '#0f2845',
        },
      },
      {
        id: 'pumpe',
        center: [-88, 90, 30],
        size: [32, 34, 34],
        colors: {
          front: '#104066',
          back: '#0d3556',
          left: '#103b5f',
          right: '#14507f',
          top: '#2a77b5',
          bottom: '#0c2b45',
        },
      },
      {
        id: 'schwenkantrieb',
        center: [18, 78, 10],
        size: [38, 30, 24],
        colors: {
          front: '#6a2f3d',
          back: '#552633',
          left: '#5f2b39',
          right: '#7f384a',
          top: '#a34a61',
          bottom: '#4f212b',
        },
      },
      {
        id: 'düsensystem',
        center: [56, -34, 2],
        size: [76, 11, 10],
        colors: {
          front: '#145d55',
          back: '#124c45',
          left: '#14564f',
          right: '#1a7169',
          top: '#2d9f94',
          bottom: '#113f39',
        },
      },
    ];

    return base
      .flatMap((item) => renderCuboidFaces(project, item, xrayMode))
      .sort((a, b) => b.zVal - a.zVal);
  }, [rx, ry, xrayMode]);

  const hotspotProjections = useMemo(() => (
    HOTSPOTS.map((spot) => ({ ...spot, proj: project(...spot.pos) }))
  ), [rx, ry]);

  const drawPhaseLine = (segment, index, active = false) => {
    const projected = segment.map(([x, y, z]) => project(x, y, z));
    return (
      <polyline
        key={`flow-${index}`}
        points={toPolyPoints(projected)}
        fill="none"
        stroke={active ? phase.accent : '#2c5a82'}
        strokeWidth={active ? 2.4 : 1.2}
        opacity={active ? 0.95 : 0.42}
        strokeDasharray={active ? '7 5' : undefined}
      >
        {active && <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.7s" repeatCount="indefinite" />}
      </polyline>
    );
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a3a5a', background: '#040d1a' }}>
      <svg
        viewBox="0 0 380 320"
        width="100%"
        height={MODEL_HEIGHT}
        role="img"
        aria-label="Bewegbares 3D-Würfelmodell der Calciumhypochlorid-Feststoff-Chloranlage"
        style={{ display: 'block', cursor: drag ? 'grabbing' : 'grab', touchAction: 'none' }}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      >
        <defs>
          <pattern id="cal-cube-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0a2136" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width="380" height="320" fill="#040d1a" />
        <rect width="380" height="320" fill="url(#cal-cube-grid)" />

        {componentFaces.map((face) => (
          <g key={face.id}>
            <polygon
              points={toPolyPoints(face.pts)}
              fill={face.fill}
              fillOpacity={face.fillOpacity}
              stroke={face.stroke}
              strokeWidth={face.strokeWidth}
            />
            {xrayMode && (
              <polygon
                points={toPolyPoints(face.pts)}
                fill="none"
                stroke="#78c7ff"
                strokeWidth={Math.max(0.7, face.strokeWidth * 0.8)}
                strokeDasharray="3 2"
                opacity="0.75"
              />
            )}
          </g>
        ))}

        {STATIC_PIPE_SEGMENTS.map((segment, index) => drawPhaseLine(segment, index, false))}
        {(PHASE_FLOW_SEGMENTS[phase.id] || []).map((segment, index) => drawPhaseLine(segment, index, true))}

        {hotspotProjections.map((spot) => {
          const isActive = activeSpot === spot.id;
          return (
            <g
              key={spot.id}
              data-hotspot="1"
              style={{ cursor: 'pointer' }}
              onClick={(event) => {
                event.stopPropagation();
                setActiveSpot(isActive ? null : spot.id);
              }}
            >
              <circle
                cx={spot.proj[0].toFixed(1)}
                cy={spot.proj[1].toFixed(1)}
                r={isActive ? 13 : 10.5}
                fill={spot.color}
                fillOpacity={isActive ? 0.42 : 0.18}
                stroke={spot.color}
                strokeWidth={isActive ? 2.4 : 1.4}
              >
                {!isActive && <animate attributeName="r" values="10.5;13;10.5" dur="2.4s" repeatCount="indefinite" />}
              </circle>
              <circle
                cx={spot.proj[0].toFixed(1)}
                cy={spot.proj[1].toFixed(1)}
                r="2.4"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="0.8"
              />
              <text
                x={spot.proj[0].toFixed(1)}
                y={(spot.proj[1] + 3.6).toFixed(1)}
                fill="white"
                fontSize="9.5"
                fontWeight="700"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
              >
                +
              </text>
              {showLabels && (
                <text
                  x={spot.proj[0].toFixed(1)}
                  y={(spot.proj[1] - 13).toFixed(1)}
                  fill={spot.color}
                  fontSize="6.2"
                  fontFamily="monospace"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none' }}
                >
                  {spot.shortLabel}
                </text>
              )}
            </g>
          );
        })}

        <text x="14" y="306" fill="#6f96b8" fontFamily="monospace" fontSize="8">
          3D-WUERFEL: ZIEHEN ZUM DREHEN - HOTSPOT ANTIPPEN - PROZESSPHASE WECHSELN
        </text>
      </svg>
    </div>
  );
}

export default function CalciumHypochloriteDeepDiveView() {
  const [xrayMode, setXrayMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [activeSpot, setActiveSpot] = useState('düsensystem');
  const [activePhase, setActivePhase] = useState('anwaessern');

  const phase = PROCESS_PHASES.find((item) => item.id === activePhase) || PROCESS_PHASES[0];
  const activeSpotData = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  const innerCardStyle = {
    background: '#0a1a2e',
    border: '1px solid #1a3a5a',
    borderRadius: '0.9rem',
    padding: '0.9rem',
  };

  const setPhaseWithFocus = (phaseId) => {
    const target = PROCESS_PHASES.find((item) => item.id === phaseId);
    if (!target) return;
    setActivePhase(phaseId);
    if (!activeSpot || !target.focus.includes(activeSpot)) {
      setActiveSpot(target.focus[0]);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#040d1a', border: '1px solid #1a3a5a' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: '1px solid #1a3a5a' }}>
        <div>
          <p className="text-xs font-mono tracking-widest" style={{ color: '#4a9eff' }}>
            DEEP DIVE PLUS - KOMPONENTEN + PROZESSLOGIK
          </p>
          <h3 className="text-lg font-black text-white mt-0.5">Feststoff-Chloranlage: Calciumhypochlorid (3D Würfel)</h3>
          <p className="text-xs font-mono mt-1" style={{ color: '#58789c' }}>
            Anwassern - Lösen - Sedimentieren - Dosieren
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
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
            {showLabels ? 'Hotspots an' : 'Hotspots aus'}
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.6fr_1fr]" style={{ minHeight: 0 }}>
        <div className="p-4 lg:p-5" style={{ borderRight: '1px solid #1a3a5a', background: '#030c18' }}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
              PROZESSPHASE
            </span>
            {PROCESS_PHASES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPhaseWithFocus(item.id)}
                className="rounded-md px-2.5 py-1 text-xs font-semibold"
                style={{
                  background: activePhase === item.id ? '#1e4f76' : '#0c2238',
                  color: activePhase === item.id ? '#d7efff' : '#7aa7c8',
                  border: `1px solid ${activePhase === item.id ? '#4a89bf' : '#2a5a90'}`,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <CalciumPlantCube3D
            activeSpot={activeSpot}
            setActiveSpot={setActiveSpot}
            xrayMode={xrayMode}
            showLabels={showLabels}
            activePhase={activePhase}
          />
          <div className="mt-3 text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
            AKTIVE PHASE: {phase.label.toUpperCase()} - FOKUS: {phase.focus.join(', ').toUpperCase()}
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
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: phase.accent }}>
              PHASENDETAIL: {phase.label.toUpperCase()}
            </p>
            <div className="space-y-1.5">
              {phase.detail.map((line) => (
                <p key={line} className="text-xs leading-relaxed" style={{ color: '#9ec4de' }}>
                  - {line}
                </p>
              ))}
              <p className="text-xs mt-2" style={{ color: '#f0b26d' }}>
                Achtung: {phase.caution}
              </p>
            </div>
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>
              HOTSPOT-FUNKTION
            </p>
            {activeSpotData ? (
              <div className="rounded-lg p-3 mb-2" style={{ background: '#040d1a', border: `1px solid ${activeSpotData.color}` }}>
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
              <p className="text-xs mb-2" style={{ color: '#8ab0c0' }}>
                Tippe einen Hotspot im 3D-Würfel an.
              </p>
            )}
            <div className="grid grid-cols-2 gap-1.5">
              {HOTSPOTS.map((spot) => (
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
              Warum ist die getrennte Phase "Anwaessern + Lösen + Sedimentieren" in Feststoff-Chloranlagen wichtig?
            </p>
            <details>
              <summary className="text-xs cursor-pointer font-mono" style={{ color: '#4a9eff' }}>
                Antwort einblenden
              </summary>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#90b0d0' }}>
                Die Trennung der Phasen sorgt für reproduzierbare Konzentration, kontrollierte Lösungsbildung und
                Rückstandsabtrennung vor der Dosierung. Dadurch bleibt die Dosierstrecke stabil und verstopfungsarm.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
