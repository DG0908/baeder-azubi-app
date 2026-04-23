import { useMemo, useState } from 'react';

const MODEL_HEIGHT = 'clamp(390px, 66vh, 860px)';
const FILTER_PATH = 'M 290 112 Q 290 82 430 82 Q 570 82 570 112 L 570 364 Q 570 396 430 396 Q 290 396 290 364 Z';

const VALVES = [
  {
    id: 'rohwasser',
    short: 'RW',
    label: 'Rohwasserklappe',
    color: '#4a9eff',
    x: 168,
    y: 154,
    lx: -120,
    ly: -34,
    items: [
      'Fuehrt Rohwasser bzw. Filterzulauf von der Pumpe in den oberen Kesselraum.',
      'Im Spuelbetrieb bleibt sie geschlossen, damit kein Schmutzwasser in den Normalstrom gelangt.',
      'Bei der Inbetriebnahme wird sie langsam geöffnet, damit der Filter kontrolliert fuellt.',
    ],
  },
  {
    id: 'filtrat',
    short: 'FB',
    label: 'Filtratklappe zum Becken',
    color: '#34c090',
    x: 168,
    y: 338,
    lx: -132,
    ly: -6,
    items: [
      'Fuehrt das filtrierte Wasser im Normalbetrieb in Richtung Reinwasserstrecke bzw. Becken.',
      'Bleibt bei Spülung und Anfahrphase zunächst geschlossen.',
      'Wird erst geöffnet, wenn der Filter entlueftet ist und das Filtrat wieder klar austritt.',
    ],
  },
  {
    id: 'erstfiltrat',
    short: 'EF',
    label: 'Erstfiltratklappe zum Kanal',
    color: '#ffd166',
    x: 232,
    y: 410,
    lx: -154,
    ly: 14,
    items: [
      'Leitet das erste Filtrat nach Spülung oder beim Anfahren zum Kanal.',
      'Verhindert, dass Trubstoffe und Restluft direkt ins Becken zurückkehren.',
      'Wird nach klarer, luftfreier Wasserabgabe wieder geschlossen.',
    ],
  },
  {
    id: 'spuelabwasser',
    short: 'SA',
    label: 'Spuelabwasserklappe',
    color: '#a070ff',
    x: 654,
    y: 154,
    lx: 26,
    ly: -34,
    items: [
      'Leitet Schmutz- und Spuelwasser aus dem oberen Kesselbereich drucklos zum Kanal ab.',
      'Muss für die Rückspülung geöffnet sein, damit kein Ueberstau entsteht.',
      'Im normalen Filterbetrieb und bei der Inbetriebnahme bleibt sie geschlossen.',
    ],
  },
  {
    id: 'spuelwasser',
    short: 'SW',
    label: 'Spuelwasserklappe',
    color: '#34b9ff',
    x: 654,
    y: 338,
    lx: 26,
    ly: -6,
    items: [
      'Fuehrt Spuelwasser in den Unterboden des Filters ein.',
      'Im Rueckspuelbetrieb wird über sie die Wasserfuehrung von unten nach oben aufgebaut.',
      'Im Normal- und Stillstandsmodus bleibt sie geschlossen.',
    ],
  },
  {
    id: 'luftspuelung',
    short: 'LS',
    label: 'Luftspuelklappe',
    color: '#ff7a7a',
    x: 654,
    y: 372,
    lx: 26,
    ly: 18,
    items: [
      'Gibt Spuelluft auf den Duesenboden und lockert das Filterbett auf.',
      'Ist vor allem in der Luft- oder Luft-Wasser-Spuelphase geöffnet.',
      'Nach der Luftspuelphase wird sie für das reine Wassernachspülen wieder geschlossen.',
    ],
  },
  {
    id: 'belueftung',
    short: 'BEL',
    label: 'Belueftung / Entlueftung',
    color: '#7ac8ff',
    x: 430,
    y: 56,
    lx: 22,
    ly: -26,
    items: [
      'Erlaubt Luftaustritt bzw. Belueftung des Kesselraums.',
      'Bei Außerbetriebnahme und Inbetriebnahme ist sie wichtig für druckloses Arbeiten und vollständige Entlueftung.',
      'Im Rueckspuelbetrieb bleibt sie geöffnet, damit kein Ueberstau entsteht.',
    ],
  },
  {
    id: 'entleerung',
    short: 'ENT',
    label: 'Entleerung / Bodenablass',
    color: '#f0b26d',
    x: 430,
    y: 454,
    lx: 22,
    ly: 12,
    items: [
      'Dient zum vollständigen Entleeren des Filters für Wartung, Frostschutz oder Stillstand.',
      'Bei Außerbetriebnahme wird sie mit geöffneter Belueftung geöffnet.',
      'Im Rueckspuel- und Anfahrbetrieb bleibt sie geschlossen.',
    ],
  },
];

const MODES = [
  {
    id: 'filterspuelung',
    label: 'Filterspülung',
    accent: '#a070ff',
    focus: ['spuelwasser', 'spuelabwasser', 'luftspülung', 'belueftung'],
    detail: [
      'Rohwasser und Filtrat zum Becken bleiben geschlossen.',
      'Spuelwasser stroemt von unten nach oben durch das Filterbett.',
      'Spuelabwasser verlässt den Filter oben drucklos zum Kanal.',
      'Die Luftspülung lockert das Bett und loest anhaftende Schmutzflocken.',
    ],
    caution: 'Freier Ablauf und offene Belueftung sind Pflicht, damit kein Ueberstau und kein unkontrollierter Druckaufbau entstehen.',
    steps: [
      '1. Rohwasserklappe und Filtratklappe zum Becken schliessen.',
      '2. Spuelabwasserklappe und Belueftung oeffnen.',
      '3. Spuelwasserklappe oeffnen und je nach Programm Luftspuelklappe zuschalten.',
      '4. Nachspülen, bis das Abwasser klar austritt.',
    ],
    checks: [
      { label: 'Spuelabwasser', value: 'offen, freier Ablauf zum Kanal', ok: true },
      { label: 'Belueftung', value: 'offen, kein Ueberstau', ok: true },
      { label: 'Bettverhalten', value: 'gleichmaessig aufgelockert', ok: true },
      { label: 'Beckenweg', value: 'gesperrt', ok: true },
    ],
    question: 'Warum müssen Rohwasserklappe und Filtratklappe zum Becken während der Filterspülung geschlossen bleiben?',
    answer:
      'Damit kein Schmutz- oder Spuelwasser in den normalen Aufbereitungsweg und ins Becken gelangt. Die Spuelhydraulik soll ausschließlich durch den Rueckspuelweg laufen.',
    states: {
      rohwasser: 'closed',
      filtrat: 'closed',
      erstfiltrat: 'closed',
      spuelabwasser: 'open',
      spuelwasser: 'open',
      luftspülung: 'open',
      belueftung: 'open',
      entleerung: 'closed',
    },
  },
  {
    id: 'ausserbetriebnahme',
    label: 'Außerbetriebnahme',
    accent: '#f0b26d',
    focus: ['rohwasser', 'filtrat', 'belueftung', 'entleerung'],
    detail: [
      'Der Filter wird vom Betriebsstrom getrennt und drucklos gemacht.',
      'Rohwasser, Filtrat, Spuelwasser und Spuelabwasser bleiben geschlossen.',
      'Belueftung und Entleerung werden geöffnet, damit der Kessel leer und sicher bearbeitbar wird.',
      'Das ist die dargestellte Wartungs- bzw. Frostschutzstellung.',
    ],
    caution: 'Vor Arbeiten am Filter immer hydraulisch absperren, drucklos schalten und gegen Wiedereinschalten sichern.',
    steps: [
      '1. Rohwasser-, Filtrat-, Spuelwasser- und Spuelabwasserklappe schliessen.',
      '2. Belueftung oeffnen und Druck abbauen.',
      '3. Entleerung oeffnen und den Kessel vollständig ablassen.',
      '4. Anlage für Wartung oder Frostschutz sichern.',
    ],
    checks: [
      { label: 'Druckzustand', value: 'drucklos', ok: true },
      { label: 'Belueftung', value: 'offen', ok: true },
      { label: 'Entleerung', value: 'offen', ok: true },
      { label: 'Alle Betriebswege', value: 'geschlossen', ok: true },
    ],
    question: 'Warum wird bei der Außerbetriebnahme die Belueftung zusammen mit der Entleerung geöffnet?',
    answer:
      'Weil der Filter nur dann sicher und vollständig entleert werden kann. Die geöffnete Belueftung verhindert Unterdruck und ermöglicht einen sauberen Ablauf über den Bodenablass.',
    states: {
      rohwasser: 'closed',
      filtrat: 'closed',
      erstfiltrat: 'closed',
      spuelabwasser: 'closed',
      spuelwasser: 'closed',
      luftspülung: 'closed',
      belueftung: 'open',
      entleerung: 'open',
    },
  },
  {
    id: 'inbetriebnahme',
    label: 'Inbetriebnahme',
    accent: '#34c090',
    focus: ['rohwasser', 'erstfiltrat', 'belueftung', 'filtrat'],
    detail: [
      'Der Filter wird langsam gefuellt und gleichzeitig entlueftet.',
      'Das erste Filtrat geht zunächst zum Kanal und nicht ins Becken.',
      'Die Filtratklappe zum Becken bleibt anfangs geschlossen.',
      'Erst nach klarem, luftfreiem Austrag wird auf normalen Filterbetrieb umgeschaltet.',
    ],
    caution: 'Filtrat nie sofort wieder zum Becken geben. Erstfiltrat und Restluft müssen zuvor sicher ausgeschleust werden.',
    steps: [
      '1. Entleerung geschlossen halten und Belueftung oeffnen.',
      '2. Rohwasserklappe langsam oeffnen und den Filter kontrolliert fuellen.',
      '3. Erstfiltratklappe zum Kanal oeffnen; Filtrat zum Becken bleibt zu.',
      '4. Wenn Wasser klar und luftfrei austritt: Belueftung und Erstfiltrat schliessen, danach Filtrat zum Becken oeffnen.',
    ],
    checks: [
      { label: 'Rohwasser', value: 'langsam geöffnet', ok: true },
      { label: 'Belueftung', value: 'offen bis luftfrei', ok: true },
      { label: 'Erstfiltrat', value: 'zum Kanal', ok: true },
      { label: 'Beckenweg', value: 'noch gesperrt', ok: true },
    ],
    question: 'Warum bleibt die Filtratklappe zum Becken bei der Inbetriebnahme zunächst geschlossen?',
    answer:
      'Weil beim Anfahren noch Restluft, Trubstoffe und unruhiges Erstfiltrat austreten können. Diese Phase wird über die Erstfiltratklappe sicher zum Kanal abgeführt.',
    states: {
      rohwasser: 'open',
      filtrat: 'closed',
      erstfiltrat: 'open',
      spuelabwasser: 'closed',
      spuelwasser: 'closed',
      luftspülung: 'closed',
      belueftung: 'open',
      entleerung: 'closed',
    },
  },
];

const KENNDATEN = [
  { label: 'Filtertyp', value: 'Geschlossener Druckfilter / Festbettfilter' },
  { label: 'Klappenbild', value: 'RW, FB, EF, SA, SW, LS, BEL, ENT' },
  { label: 'Rückspülung', value: 'unten nach oben, Kanal offen' },
  { label: 'Außerbetriebnahme', value: 'drucklos + entleert' },
  { label: 'Inbetriebnahme', value: 'langsam fuellen + Erstfiltrat zum Kanal' },
];

const STATIC_PIPE_SEGMENTS = [
  { points: [[56, 154], [290, 154]], color: '#214768' },
  { points: [[56, 338], [290, 338]], color: '#214768' },
  { points: [[232, 338], [232, 430], [112, 430]], color: '#214768' },
  { points: [[570, 154], [786, 154]], color: '#214768' },
  { points: [[570, 338], [786, 338]], color: '#214768' },
  { points: [[570, 372], [786, 372]], color: '#214768' },
  { points: [[430, 82], [430, 18]], color: '#214768' },
  { points: [[430, 396], [430, 510]], color: '#214768' },
];

const FLOW_SEGMENTS = {
  filterspülung: [
    { points: [[786, 338], [570, 338], [488, 338]], color: '#34b9ff' },
    { points: [[488, 338], [488, 180]], color: '#a070ff' },
    { points: [[488, 180], [570, 154], [786, 154]], color: '#a070ff' },
    { points: [[786, 372], [570, 372], [516, 372]], color: '#ff7a7a' },
    { points: [[430, 82], [430, 18]], color: '#7ac8ff' },
  ],
  außerbetriebnahme: [
    { points: [[430, 82], [430, 18]], color: '#7ac8ff' },
    { points: [[430, 396], [430, 510]], color: '#f0b26d' },
  ],
  inbetriebnahme: [
    { points: [[56, 154], [290, 154], [350, 154]], color: '#34c090' },
    { points: [[350, 154], [350, 338]], color: '#34c090' },
    { points: [[350, 338], [232, 338], [232, 430], [112, 430]], color: '#ffd166' },
    { points: [[430, 82], [430, 18]], color: '#7ac8ff' },
  ],
};

function toPolylinePoints(points) {
  return points.map(([x, y]) => `${x},${y}`).join(' ');
}

function getValveStatusText(status) {
  return status === 'open' ? 'OFFEN' : 'GESCHLOSSEN';
}

function getValveStatusColor(status) {
  return status === 'open'
    ? { fill: '#103627', stroke: '#34c090', text: '#7ff0bf' }
    : { fill: '#3b1416', stroke: '#ff7a7a', text: '#ffc0c0' };
}

function FilterValveSymbol({ valve, status, isActive, onClick }) {
  const palette = getValveStatusColor(status);

  return (
    <g style={{ cursor: 'pointer' }} onClick={onClick}>
      <circle
        cx={valve.x}
        cy={valve.y}
        r={isActive ? 17 : 13}
        fill={palette.fill}
        stroke={isActive ? valve.color : palette.stroke}
        strokeWidth={isActive ? 2.6 : 2}
      />
      <circle
        cx={valve.x}
        cy={valve.y}
        r={isActive ? 24 : 20}
        fill="none"
        stroke={isActive ? valve.color : palette.stroke}
        strokeOpacity={isActive ? 0.42 : 0.2}
        strokeWidth="1.4"
      />
      {status === 'open' ? (
        <>
          <line x1={valve.x - 5} y1={valve.y} x2={valve.x + 5} y2={valve.y} stroke="#f4fffb" strokeWidth="2.4" strokeLinecap="round" />
          <line x1={valve.x} y1={valve.y - 5} x2={valve.x} y2={valve.y + 5} stroke="#f4fffb" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1={valve.x - 5} y1={valve.y - 5} x2={valve.x + 5} y2={valve.y + 5} stroke="#fff0f0" strokeWidth="2.4" strokeLinecap="round" />
          <line x1={valve.x + 5} y1={valve.y - 5} x2={valve.x - 5} y2={valve.y + 5} stroke="#fff0f0" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
      <text x={valve.x} y={valve.y + 28} textAnchor="middle" fontSize="10" fontWeight="700" fill={palette.text}>
        {valve.short}
      </text>
    </g>
  );
}

function FilterSpülungSchematic({ activeValve, setActiveValve, activeMode, showLabels, showFlow }) {
  const mode = MODES.find((entry) => entry.id === activeMode) || MODES[0];
  const states = mode.states;

  return (
    <div className="w-full" style={{ height: MODEL_HEIGHT }}>
      <svg viewBox="0 0 860 540" className="w-full h-full" role="img" aria-label="Schaltbild für Filterspülung, Außerbetriebnahme und Inbetriebnahme">
        <defs>
          <clipPath id="filter-spülung-shell-clip">
            <path d={FILTER_PATH} />
          </clipPath>
          <pattern id="filter-water-lines" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M2 6 C6 3, 12 3, 16 6" fill="none" stroke="#9ed8ff" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
            <path d="M2 13 C6 10, 12 10, 16 13" fill="none" stroke="#9ed8ff" strokeWidth="1.1" strokeLinecap="round" opacity="0.34" />
          </pattern>
          <pattern id="filter-bed" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#b89258" />
            <circle cx="4" cy="4" r="1.9" fill="#dfc18f" />
            <circle cx="11" cy="5" r="1.8" fill="#c7a56c" />
            <circle cx="7" cy="11" r="2" fill="#e8d2a9" />
            <circle cx="13" cy="12.5" r="1.5" fill="#cda86f" />
          </pattern>
          <marker id="spuel-flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#bfe9ff" />
          </marker>
        </defs>

        <rect x="20" y="16" width="820" height="508" rx="24" fill="#04111f" stroke="#163651" />

        <g clipPath="url(#filter-spülung-shell-clip)">
          <rect x="302" y="136" width="256" height="70" fill="url(#filter-water-lines)" opacity="0.78" />
          <rect x="302" y="206" width="256" height="136" fill="url(#filter-bed)" />
          <rect x="302" y="342" width="256" height="36" fill="#7b95ad" opacity="0.56" />
        </g>

        <path d={FILTER_PATH} fill="#143451" fillOpacity="0.8" stroke="#2a5a90" strokeWidth="3" />
        <ellipse cx="430" cy="96" rx="140" ry="15" fill="#7ac8ff" opacity="0.08" />
        <ellipse cx="430" cy="382" rx="140" ry="15" fill="#7ac8ff" opacity="0.05" />

        <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8">
          {STATIC_PIPE_SEGMENTS.map((segment, index) => (
            <polyline key={`pipe-${index}`} points={toPolylinePoints(segment.points)} stroke={segment.color} />
          ))}
        </g>

        <line x1="350" y1="154" x2="350" y2="338" stroke="#0e1824" strokeWidth="10" opacity="0.42" />
        <line x1="350" y1="154" x2="350" y2="338" stroke="#7cd4ff" strokeWidth="2" opacity="0.35" />
        <line x1="302" y1="206" x2="558" y2="206" stroke="#d7b06e" strokeWidth="2" />
        <line x1="302" y1="342" x2="558" y2="342" stroke="#8abbe0" strokeWidth="2" />

        <text x="44" y="140" fontSize="11" fontWeight="700" fill="#8eb3ce">von Pumpe / Rohwasser</text>
        <text x="44" y="324" fontSize="11" fontWeight="700" fill="#8eb3ce">Filtrat / Reinwasser</text>
        <text x="44" y="338" fontSize="11" fill="#7597b2">zum Becken</text>
        <text x="84" y="446" fontSize="11" fontWeight="700" fill="#8eb3ce">Erstfiltrat</text>
        <text x="84" y="460" fontSize="11" fill="#7597b2">zum Kanal</text>
        <text x="688" y="140" fontSize="11" fontWeight="700" fill="#8eb3ce">Spuelabwasser</text>
        <text x="688" y="154" fontSize="11" fill="#7597b2">zum Kanal</text>
        <text x="688" y="324" fontSize="11" fontWeight="700" fill="#8eb3ce">Spuelwasser</text>
        <text x="688" y="338" fontSize="11" fill="#7597b2">von Reinwasserseite</text>
        <text x="688" y="372" fontSize="11" fontWeight="700" fill="#8eb3ce">Luftspülung</text>
        <text x="454" y="20" fontSize="11" fontWeight="700" fill="#8eb3ce">Belueftung / Entlueftung</text>
        <text x="454" y="502" fontSize="11" fontWeight="700" fill="#8eb3ce">Entleerung / Bodenablass</text>

        {showFlow && (FLOW_SEGMENTS[activeMode] || []).map((segment, index) => (
          <polyline
            key={`flow-${index}`}
            points={toPolylinePoints(segment.points)}
            fill="none"
            stroke={segment.color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd="url(#spuel-flow-arrow)"
            opacity="0.96"
          />
        ))}

        {activeMode === 'filterspülung' && showFlow && [520, 538, 556].map((x, index) => (
          <g key={`bubble-${x}`}>
            <circle cx={x} cy={356 - index * 12} r={4 + index} fill="none" stroke="#ffd0d0" strokeWidth="1.1" opacity="0.8" />
            <circle cx={x + 8} cy={344 - index * 12} r={2.8 + index * 0.7} fill="none" stroke="#ffd0d0" strokeWidth="1.1" opacity="0.72" />
          </g>
        ))}

        {activeMode === 'inbetriebnahme' && showFlow && [424, 430, 436].map((x, index) => (
          <path
            key={`vent-${x}`}
            d={`M ${x} 54 L ${x} ${34 - index * 2}`}
            stroke="#9cd7ff"
            strokeWidth="2"
            markerEnd="url(#spuel-flow-arrow)"
            opacity="0.62"
          />
        ))}

        {mode.focus.map((valveId) => {
          const valve = VALVES.find((entry) => entry.id === valveId);
          if (!valve) return null;
          return (
            <circle
              key={`focus-${valve.id}`}
              cx={valve.x}
              cy={valve.y}
              r={activeValve === valve.id ? 27 : 22}
              fill={valve.color}
              fillOpacity="0.08"
              stroke={valve.color}
              strokeOpacity="0.28"
              strokeWidth="1.3"
            />
          );
        })}

        {VALVES.map((valve) => (
          <g key={valve.id}>
            <FilterValveSymbol
              valve={valve}
              status={states[valve.id]}
              isActive={activeValve === valve.id}
              onClick={() => setActiveValve(valve.id)}
            />
            {showLabels && (
              <g transform={`translate(${valve.x + valve.lx}, ${valve.y + valve.ly})`} style={{ cursor: 'pointer' }} onClick={() => setActiveValve(valve.id)}>
                <rect
                  x="0"
                  y="0"
                  rx="8"
                  ry="8"
                  width={Math.max(88, valve.label.length * 5.7 + 18)}
                  height="34"
                  fill="#071426"
                  fillOpacity="0.93"
                  stroke={activeValve === valve.id ? valve.color : '#1a3a5a'}
                  strokeWidth="1.2"
                />
                <text x="10" y="14" fontSize="10" fontWeight="700" fill={valve.color}>
                  {valve.short}
                </text>
                <text x="10" y="27" fontSize="10" fill="#d8eeff">
                  {valve.label}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function FilterSpülungDeepDiveView() {
  const [activeMode, setActiveMode] = useState('filterspülung');
  const [activeValve, setActiveValve] = useState('spuelwasser');
  const [showLabels, setShowLabels] = useState(true);
  const [showFlow, setShowFlow] = useState(true);

  const mode = useMemo(
    () => MODES.find((entry) => entry.id === activeMode) || MODES[0],
    [activeMode],
  );

  const activeValveData = useMemo(
    () => VALVES.find((entry) => entry.id === activeValve) || null,
    [activeValve],
  );

  const activeValveStatus = activeValveData ? mode.states[activeValveData.id] : 'closed';

  const innerCardStyle = {
    background: '#0a1a2e',
    border: '1px solid #1a3a5a',
    borderRadius: '0.9rem',
    padding: '0.9rem',
  };

  const setModeWithFocus = (modeId) => {
    const target = MODES.find((entry) => entry.id === modeId);
    if (!target) return;
    setActiveMode(modeId);
    if (!activeValve || !target.focus.includes(activeValve)) {
      setActiveValve(target.focus[0]);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#040d1a', border: '1px solid #1a3a5a' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: '1px solid #1a3a5a' }}>
        <div>
          <p className="text-xs font-mono tracking-widest" style={{ color: '#4a9eff' }}>
            DEEP DIVE PLUS - SCHALTBILD & KLAPPENSTELLUNG
          </p>
          <h3 className="text-lg font-black text-white mt-0.5">Filterspülung und Klappenbild</h3>
          <p className="text-xs font-mono mt-1" style={{ color: '#58789c' }}>
            Filterspülung - Außerbetriebnahme - Inbetriebnahme
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            type="button"
            onClick={() => setShowFlow((prev) => !prev)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{
              background: showFlow ? '#153a57' : '#0a1a2e',
              color: showFlow ? '#b9e7ff' : '#7ab0d0',
              border: '1px solid #1a3a5a',
            }}
          >
            {showFlow ? 'Fluss an' : 'Fluss aus'}
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

      <div className="grid xl:grid-cols-[1.65fr_1fr]" style={{ minHeight: 0 }}>
        <div className="p-4 lg:p-5" style={{ borderRight: '1px solid #1a3a5a', background: '#030c18' }}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
              BETRIEBSZUSTAND
            </span>
            {MODES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setModeWithFocus(entry.id)}
                className="rounded-md px-2.5 py-1 text-xs font-semibold"
                style={{
                  background: activeMode === entry.id ? '#1e4f76' : '#0c2238',
                  color: activeMode === entry.id ? '#d7efff' : '#7aa7c8',
                  border: `1px solid ${activeMode === entry.id ? '#4a89bf' : '#2a5a90'}`,
                }}
              >
                {entry.label}
              </button>
            ))}
          </div>

          <FilterSpülungSchematic
            activeValve={activeValve}
            setActiveValve={setActiveValve}
            activeMode={activeMode}
            showLabels={showLabels}
            showFlow={showFlow}
          />

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
            <span>AKTIVER MODUS: {mode.label.toUpperCase()}</span>
            <span style={{ color: '#34c090' }}>GRUEN = OFFEN</span>
            <span style={{ color: '#ff7a7a' }}>ROT = GESCHLOSSEN</span>
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
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>
              SCHALTFOLGE
            </p>
            <div className="space-y-1.5">
              {mode.steps.map((step) => (
                <p key={step} className="text-xs leading-relaxed" style={{ color: '#8ab0c0' }}>
                  {step}
                </p>
              ))}
            </div>
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>
              KLAPPENSTATUS
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {VALVES.map((valve) => {
                const status = mode.states[valve.id];
                const palette = getValveStatusColor(status);
                return (
                  <button
                    key={valve.id}
                    type="button"
                    onClick={() => setActiveValve(valve.id)}
                    className="rounded-lg p-2 text-left"
                    style={{
                      background: activeValve === valve.id ? '#0d2238' : '#040d1a',
                      border: `1px solid ${activeValve === valve.id ? valve.color : '#163651'}`,
                    }}
                  >
                    <div style={{ color: '#456080' }}>{valve.short} {valve.label}</div>
                    <div className="font-mono font-bold mt-1" style={{ color: palette.text }}>
                      {getValveStatusText(status)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: activeValveData?.color || '#4a9eff' }}>
              BAUTEILFUNKTION
            </p>
            {activeValveData ? (
              <>
                <div className="rounded-lg p-3 mb-2" style={{ background: '#040d1a', border: `1px solid ${activeValveData.color}` }}>
                  <p className="text-xs font-mono font-bold mb-1" style={{ color: activeValveData.color }}>
                    {activeValveData.short} {activeValveData.label}
                  </p>
                  <p className="text-xs font-mono mb-2" style={{ color: getValveStatusColor(activeValveStatus).text }}>
                    STATUS IM MODUS {mode.label.toUpperCase()}: {getValveStatusText(activeValveStatus)}
                  </p>
                  {activeValveData.items.map((item) => (
                    <p key={item} className="text-xs leading-relaxed" style={{ color: '#8ab0c0' }}>
                      - {item}
                    </p>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs" style={{ color: '#8ab0c0' }}>
                Waehle eine Klappe im Schaltbild aus.
              </p>
            )}
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#34c090' }}>
              BETRIEBSCHECK
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {mode.checks.map((check) => (
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
              {mode.question}
            </p>
            <details>
              <summary className="text-xs cursor-pointer font-mono" style={{ color: '#4a9eff' }}>
                Antwort einblenden
              </summary>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#90b0d0' }}>
                {mode.answer}
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
