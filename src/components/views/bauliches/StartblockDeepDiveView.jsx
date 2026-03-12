import { useMemo, useState } from 'react';

const MODEL_HEIGHT = 'clamp(380px, 64vh, 840px)';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const avgZ = (pts) => pts.reduce((sum, p) => sum + p[2], 0) / pts.length;
const toPolyPoints = (pts) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

const HOTSPOTS = [
  { id: 'plattform', shortLabel: 'TOP', label: 'Startblock-Plattform', color: '#4a9eff', pos: [0, 18, -12] },
  { id: 'neigung', shortLabel: 'WINKEL', label: 'Neigung < 10 Grad', color: '#8dc1ff', pos: [16, 8, -18] },
  { id: 'rueckenstartbuegel', shortLabel: 'BUEGEL', label: 'Haltebuegel Rueckenstart', color: '#34c090', pos: [-54, 42, 4] },
  { id: 'standfuesse', shortLabel: 'STUETZE', label: 'Standfuesse / Tragwerk', color: '#ff7a7a', pos: [20, 56, 10] },
  { id: 'anschlagplatte', shortLabel: 'PLATTE', label: 'Anschlagplatte', color: '#a070ff', pos: [0, 74, 66] },
  { id: 'startwand', shortLabel: 'WAND', label: 'Startwand', color: '#f2b15b', pos: [0, 96, 84] },
  { id: 'finnischeRinne', shortLabel: 'RINNE', label: 'Finnische Rinne / Rinnenkante', color: '#4ad097', pos: [90, 64, 52] },
  { id: 'tMarkierung', shortLabel: 'T-MARK', label: 'T-Markierung', color: '#d8a240', pos: [0, 130, 106] },
  { id: 'bahnlinie', shortLabel: 'BAHN', label: 'Bahnlinie 0,25 m', color: '#34b9ff', pos: [0, 146, 120] },
];

const HOTSPOT_DATA = {
  plattform: {
    title: 'Startblock-Plattform',
    short: 'TOP',
    color: '#4a9eff',
    items: [
      'Auftrittsflaeche mindestens 50 x 50 cm.',
      'Trittsichere Oberflaeche fuer nassen Betrieb.',
      'Blockkante muss klar und rutscharm anlaufbar sein.',
    ],
  },
  neigung: {
    title: 'Neigung der Plattform',
    short: 'WINKEL',
    color: '#8dc1ff',
    items: [
      'Neigung der Oberflaeche kleiner als 10 Grad.',
      'Leichte Vorneigung unterstuetzt den Startimpuls.',
      'Zu steile Neigung erhoeht Rutsch- und Fehlstart-Risiko.',
    ],
  },
  rueckenstartbuegel: {
    title: 'Haltebuegel fuer Rueckenstart',
    short: 'BUEGEL',
    color: '#34c090',
    items: [
      'Buegel bieten Handgriff und Position fuer Rueckenstart.',
      'Lage typischerweise etwa 30 bis 60 cm ueber Wasserspiegel.',
      'Kanten und Radien muessen verletzungsarm ausgefuehrt sein.',
    ],
  },
  standfuesse: {
    title: 'Standfuesse und Tragwerk',
    short: 'STUETZE',
    color: '#ff7a7a',
    items: [
      'Lastabtrag von Plattform in Beckenumgang/Tragkonstruktion.',
      'Steifigkeit wichtig gegen Schwingung beim Startsprung.',
      'Korrosionsbestaendige Werkstoffe im Chlor-Umfeld nutzen.',
    ],
  },
  anschlagplatte: {
    title: 'Anschlagplatte',
    short: 'PLATTE',
    color: '#a070ff',
    items: [
      'Sichtbarer Kontrast fuer Wende und Anschlag am Bahnende.',
      'Definierte Flaeche als Orientierung fuer Schwimmer.',
      'Bei Wettkampfbetrieb regelmaessig auf Beschaedigung pruefen.',
    ],
  },
  startwand: {
    title: 'Startwand',
    short: 'WAND',
    color: '#f2b15b',
    items: [
      'Tragende Geometrie fuer Startblock und Anschlagbereich.',
      'Gleichmaessige Fliesenflaeche fuer visuelle Orientierung.',
      'Anschluss an Rinne und Beckenkante muss dicht und formstabil sein.',
    ],
  },
  finnischeRinne: {
    title: 'Finnische Rinne',
    short: 'RINNE',
    color: '#4ad097',
    items: [
      'Rinnenkante nimmt Oberflaechenwasser am Beckenrand auf.',
      'Startwand und Rinnenbereich bilden baulich ein gemeinsames System.',
      'Rost/Spalt und Abdeckung rutsch- sowie trittsicher ausfuehren.',
    ],
  },
  tMarkierung: {
    title: 'T-Markierung',
    short: 'T-MARK',
    color: '#d8a240',
    items: [
      'T-Markierung signalisiert Schwimmern die Wandnaehe.',
      'In der Regel 2,0 m vor der Wand, gut kontrastiert.',
      'Querbalken unterstuetzt Orientierung bei Anfahrt zur Wende.',
    ],
  },
  bahnlinie: {
    title: 'Bahnlinie',
    short: 'BAHN',
    color: '#34b9ff',
    items: [
      'Linienbreite typischerweise 0,25 m.',
      'Mittelachse fuehrt den Schwimmer in die Wandzone.',
      'Farbe und Kontrast muessen unter Wasser klar erkennbar bleiben.',
    ],
  },
};

const KENNDATEN = [
  { label: 'Plattformflaeche', value: 'mindestens 50 x 50 cm' },
  { label: 'Neigung', value: '< 10 Grad' },
  { label: 'Hoehe ueber Wsp', value: 'ca. 60 - 70 cm' },
  { label: 'Rueckenstartbuegel', value: 'ca. 30 - 60 cm ueber Wsp' },
  { label: 'Bahnlinie', value: '0,25 m Breite' },
  { label: 'T-Markierung', value: 'ca. 2,0 m vor Wand' },
];

const DETAIL_MODES = [
  {
    id: 'geometrie',
    label: 'Geometrie',
    accent: '#4a9eff',
    focus: ['plattform', 'neigung', 'standfuesse'],
    detail: [
      'Plattformflaeche muss ausreichend gross und trittsicher sein.',
      'Neigungswinkel bleibt unter 10 Grad fuer kontrollierten Abdruck.',
      'Tragwerk muss dynamische Startlasten sicher aufnehmen.',
    ],
    caution: 'Lose oder schwingende Befestigungen sind sofort zu sperren.',
  },
  {
    id: 'rueckenstart',
    label: 'Rueckenstart',
    accent: '#34c090',
    focus: ['rueckenstartbuegel', 'anschlagplatte', 'startwand'],
    detail: [
      'Buegelposition muss fuer verschiedene Koerpergroessen erreichbar sein.',
      'Anschlagplatte bildet visuelle und taktile Orientierung.',
      'Startwandflaeche muss rutscharm und kontrastreich bleiben.',
    ],
    caution: 'Scharfe Kanten oder lose Buegel erzeugen Verletzungsrisiko.',
  },
  {
    id: 'startwand',
    label: 'Startwand',
    accent: '#a070ff',
    focus: ['startwand', 'anschlagplatte', 'finnischeRinne'],
    detail: [
      'Startwand und Rinnenkante muessen geometrisch sauber anschliessen.',
      'Anschlagzone darf keine ausstehenden Kanten besitzen.',
      'Rinnenbereich muss Wasser sicher erfassen ohne Stolperkanten.',
    ],
    caution: 'Rissbildungen und Fliesenhohllagen fruehzeitig instandsetzen.',
  },
  {
    id: 'bahnorientierung',
    label: 'Bahnorientierung',
    accent: '#d8a240',
    focus: ['bahnlinie', 'tMarkierung', 'anschlagplatte'],
    detail: [
      'Bahnlinie fuehrt Richtung Startwand entlang der Beckenachse.',
      'T-Markierung warnt rechtzeitig vor Wandkontakt bei Wende.',
      'Kontrast und Masshaltigkeit sind fuer Wettkampforientierung zentral.',
    ],
    caution: 'Abgenutzte Markierungen sofort nachziehen bzw. erneuern.',
  },
];

const MODE_HIGHLIGHT_SEGMENTS = {
  geometrie: [
    [[-28, 2, -20], [28, 2, -20]],
    [[-38, 18, -12], [-38, 70, 40]],
    [[28, 14, -16], [28, 6, -26]],
  ],
  rueckenstart: [
    [[-60, 42, 4], [-40, 42, 4]],
    [[-50, 42, 4], [-50, 74, 66]],
    [[-24, 74, 66], [24, 74, 66]],
  ],
  startwand: [
    [[-66, 96, 84], [66, 96, 84]],
    [[80, 64, 52], [96, 64, 52]],
    [[68, 78, 66], [92, 64, 52]],
  ],
  bahnorientierung: [
    [[0, 108, 80], [0, 156, 128]],
    [[-18, 130, 106], [18, 130, 106]],
    [[0, 126, 102], [0, 146, 120]],
  ],
};

const BAULICHE_CHECKS = [
  { label: 'Plattform', value: '>= 50 x 50 cm, trittsicher', ok: true },
  { label: 'Neigung', value: '< 10 Grad', ok: true },
  { label: 'Blockhoehe', value: 'ca. 60 - 70 cm ueber Wsp', ok: true },
  { label: 'Rueckenstartbuegel', value: 'fest, sauber, griffsicher', ok: true },
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
    fillOpacity: xrayMode ? 0.14 : 0.74,
  }));

  return faces;
}

function StartblockCube3D({ activeSpot, setActiveSpot, xrayMode, showLabels, activeMode }) {
  const [rx, setRx] = useState(-20);
  const [ry, setRy] = useState(24);
  const [drag, setDrag] = useState(null);

  const detailMode = DETAIL_MODES.find((item) => item.id === activeMode) || DETAIL_MODES[0];

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
    setRy((current) => current + dx * 0.44);
    setRx((current) => clamp(current - dy * 0.34, -66, 22));
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
    const d = 440 / (440 + z2);

    return [190 + (x1 * d), 166 + (y1 * d), z2];
  };

  const modelFaces = useMemo(() => {
    const base = [
      {
        id: 'deck',
        center: [0, 72, 42],
        size: [258, 96, 22],
        colors: {
          front: '#0e3558',
          back: '#0a2945',
          left: '#0d2f4f',
          right: '#103a61',
          top: '#2b5f95',
          bottom: '#0a243c',
        },
        stroke: '#2f6aa5',
        strokeWidth: 1.1,
      },
      {
        id: 'water',
        center: [0, 136, 114],
        size: [220, 100, 72],
        colors: {
          front: '#164b84',
          back: '#113868',
          left: '#154374',
          right: '#1b5898',
          top: '#2a73bf',
          bottom: '#0f3156',
        },
      },
      {
        id: 'startwall',
        center: [0, 96, 84],
        size: [152, 74, 12],
        colors: {
          front: '#2f445c',
          back: '#263748',
          left: '#2d3f52',
          right: '#34495f',
          top: '#5a738f',
          bottom: '#253342',
        },
      },
      {
        id: 'anschlagplatte',
        center: [0, 74, 66],
        size: [146, 28, 6],
        colors: {
          front: '#56657c',
          back: '#465367',
          left: '#4f5d72',
          right: '#617088',
          top: '#7d8fa7',
          bottom: '#404b5c',
        },
      },
      {
        id: 'startblock-top',
        center: [0, 18, -12],
        size: [92, 40, 40],
        colors: {
          front: '#33465f',
          back: '#2a3a50',
          left: '#304259',
          right: '#3b4f69',
          top: '#5b7392',
          bottom: '#28384a',
        },
      },
      {
        id: 'stand-left',
        center: [-22, 56, 8],
        size: [12, 78, 12],
        colors: {
          front: '#8090a5',
          back: '#6b788a',
          left: '#768497',
          right: '#92a3b8',
          top: '#b4c0cf',
          bottom: '#697687',
        },
      },
      {
        id: 'stand-right',
        center: [22, 56, 10],
        size: [12, 78, 12],
        colors: {
          front: '#8090a5',
          back: '#6b788a',
          left: '#768497',
          right: '#92a3b8',
          top: '#b4c0cf',
          bottom: '#697687',
        },
      },
      {
        id: 'rear-support',
        center: [36, 58, 18],
        size: [10, 72, 10],
        colors: {
          front: '#8a98ac',
          back: '#738094',
          left: '#7c8a9f',
          right: '#99a8bc',
          top: '#b8c4d2',
          bottom: '#6e7c8e',
        },
      },
      {
        id: 'rinnenkante',
        center: [86, 64, 52],
        size: [44, 10, 16],
        colors: {
          front: '#2b7f63',
          back: '#246a53',
          left: '#287359',
          right: '#32906f',
          top: '#47b08c',
          bottom: '#225d49',
        },
      },
      {
        id: 'rueckenstart-left',
        center: [-52, 42, 4],
        size: [24, 8, 8],
        colors: {
          front: '#2d9f80',
          back: '#25846b',
          left: '#299274',
          right: '#33af8d',
          top: '#49c39f',
          bottom: '#23765f',
        },
      },
      {
        id: 'rueckenstart-right',
        center: [-20, 42, 6],
        size: [24, 8, 8],
        colors: {
          front: '#2d9f80',
          back: '#25846b',
          left: '#299274',
          right: '#33af8d',
          top: '#49c39f',
          bottom: '#23765f',
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

  const laneStripe = useMemo(() => {
    const a = project(-10, 96, 86);
    const b = project(10, 96, 86);
    const c = project(10, 160, 124);
    const d = project(-10, 160, 124);
    return [a, b, c, d];
  }, [rx, ry]);

  const tMark = useMemo(() => {
    const stem = [
      project(-6, 124, 100),
      project(6, 124, 100),
      project(6, 146, 120),
      project(-6, 146, 120),
    ];
    const cross = [
      project(-24, 130, 106),
      project(24, 130, 106),
      project(24, 136, 112),
      project(-24, 136, 112),
    ];
    return { stem, cross };
  }, [rx, ry]);

  const drawSegment = (segment, index, active = false) => {
    const projected = segment.map(([x, y, z]) => project(x, y, z));
    return (
      <polyline
        key={`segment-${index}`}
        points={toPolyPoints(projected)}
        fill="none"
        stroke={active ? detailMode.accent : '#2c5a82'}
        strokeWidth={active ? 2.2 : 1.1}
        opacity={active ? 0.96 : 0.4}
        strokeDasharray={active ? '7 5' : undefined}
      >
        {active && <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="1.8s" repeatCount="indefinite" />}
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
        aria-label="Bewegbares 3D-Modell von Startblock, Startwand und Finnischer Rinne"
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
          <pattern id="startblock-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0a2136" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width="380" height="320" fill="#040d1a" />
        <rect width="380" height="320" fill="url(#startblock-grid)" />

        {modelFaces.map((face) => (
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

        <polygon points={toPolyPoints(laneStripe)} fill="#0a0f18" opacity="0.84" />
        <polygon points={toPolyPoints(tMark.stem)} fill="#0a0f18" opacity="0.84" />
        <polygon points={toPolyPoints(tMark.cross)} fill="#0a0f18" opacity="0.84" />

        {Object.values(MODE_HIGHLIGHT_SEGMENTS).flat().map((segment, index) => drawSegment(segment, index, false))}
        {(MODE_HIGHLIGHT_SEGMENTS[detailMode.id] || []).map((segment, index) => drawSegment(segment, 100 + index, true))}

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
          3D MODELL: ZIEHEN ZUM DREHEN - HOTSPOT ANTIPPEN - DETAILMODUS WECHSELN
        </text>
      </svg>
    </div>
  );
}

export default function StartblockDeepDiveView() {
  const [xrayMode, setXrayMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [activeSpot, setActiveSpot] = useState('plattform');
  const [activeMode, setActiveMode] = useState('geometrie');

  const detailMode = DETAIL_MODES.find((item) => item.id === activeMode) || DETAIL_MODES[0];
  const activeSpotData = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  const innerCardStyle = {
    background: '#0a1a2e',
    border: '1px solid #1a3a5a',
    borderRadius: '0.9rem',
    padding: '0.9rem',
  };

  const setModeWithFocus = (modeId) => {
    const target = DETAIL_MODES.find((item) => item.id === modeId);
    if (!target) return;
    setActiveMode(modeId);
    if (!activeSpot || !target.focus.includes(activeSpot)) {
      setActiveSpot(target.focus[0]);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#040d1a', border: '1px solid #1a3a5a' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: '1px solid #1a3a5a' }}>
        <div>
          <p className="text-xs font-mono tracking-widest" style={{ color: '#4a9eff' }}>
            DEEP DIVE PLUS - BAULICHES DETAILMODELL
          </p>
          <h3 className="text-lg font-black text-white mt-0.5">Startblock und Startwand (Finnische Rinne)</h3>
          <p className="text-xs font-mono mt-1" style={{ color: '#58789c' }}>
            Geometrie - Rueckenstart - Startwand - Bahnorientierung
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
                onClick={() => setModeWithFocus(item.id)}
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

          <StartblockCube3D
            activeSpot={activeSpot}
            setActiveSpot={setActiveSpot}
            xrayMode={xrayMode}
            showLabels={showLabels}
            activeMode={activeMode}
          />
          <div className="mt-3 text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
            AKTIVER MODUS: {detailMode.label.toUpperCase()} - FOKUS: {detailMode.focus.join(', ').toUpperCase()}
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
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: detailMode.accent }}>
              MODUSDETAIL: {detailMode.label.toUpperCase()}
            </p>
            <div className="space-y-1.5">
              {detailMode.detail.map((line) => (
                <p key={line} className="text-xs leading-relaxed" style={{ color: '#9ec4de' }}>
                  - {line}
                </p>
              ))}
              <p className="text-xs mt-2" style={{ color: '#f0b26d' }}>
                Achtung: {detailMode.caution}
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
                Tippe einen Hotspot im Modell an.
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
              BAULICHE CHECKS
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {BAULICHE_CHECKS.map((check) => (
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
              Warum sind T-Markierung und Bahnlinie fuer die Sicherheit am Start- und Wendeende so wichtig?
            </p>
            <details>
              <summary className="text-xs cursor-pointer font-mono" style={{ color: '#4a9eff' }}>
                Antwort einblenden
              </summary>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#90b0d0' }}>
                Sie geben bei hoher Schwimmgeschwindigkeit eine fruehe visuelle Orientierung zur Wandlage.
                Dadurch sinkt das Risiko von Fehlabstand, Kopfkontakt und unsauberem Anschlag deutlich.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
