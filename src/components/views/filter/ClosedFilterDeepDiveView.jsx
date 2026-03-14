import { useMemo, useState } from 'react';

const MODEL_HEIGHT = 'clamp(380px, 64vh, 840px)';
const VESSEL_PATH = 'M 260 110 Q 260 78 410 78 Q 560 78 560 110 L 560 360 Q 560 392 410 392 Q 260 392 260 360 Z';

const HOTSPOTS = [
  { id: 'belueftung', shortLabel: 'ENTL', label: 'Belueftung / Entluefter', color: '#4a9eff', x: 410, y: 66, lx: 18, ly: -24 },
  { id: 'freierAblauf', shortLabel: 'KANAL', label: 'Freier Ablauf zum Kanal', color: '#7ac8ff', x: 188, y: 184, lx: -152, ly: -26 },
  { id: 'filterschicht', shortLabel: 'BETT', label: 'Filterschicht / Mehrschichtbett', color: '#34c090', x: 350, y: 250, lx: -140, ly: -18 },
  { id: 'ablaufrichter', shortLabel: 'TRICH', label: 'Ablaufrichter / Absenkung', color: '#a070ff', x: 452, y: 154, lx: 24, ly: -30 },
  { id: 'filterbettAufweitung', shortLabel: '10%', label: 'Filterbett-Aufweitung', color: '#f0b26d', x: 490, y: 236, lx: 28, ly: -18 },
  { id: 'wasserumkehr', shortLabel: 'QSP', label: 'Rueckspuelstrom 60 - 65 m/h', color: '#34b9ff', x: 494, y: 316, lx: 34, ly: -2 },
  { id: 'luftspuelung', shortLabel: 'LUFT', label: 'Auflockerung durch Luftspuelung', color: '#ff7a7a', x: 546, y: 352, lx: 40, ly: 16 },
  { id: 'erstfiltrat', shortLabel: 'EF', label: 'Erstfiltrat zum Kanal', color: '#ffd166', x: 268, y: 372, lx: -154, ly: 10 },
  { id: 'duesenboden', shortLabel: 'DUES', label: 'Stuetz- und Duesenboden', color: '#5ad0ff', x: 410, y: 338, lx: 22, ly: 28 },
];

const HOTSPOT_DATA = {
  belueftung: {
    title: 'Belueftung / Entluefter',
    short: 'ENTL',
    color: '#4a9eff',
    items: [
      'Luft aus dem oberen Kesselraum muss beim Fuellen und nach der Spuelung sicher entweichen.',
      'Ein Luftpolster verkleinert die wirksame Filterflaeche und stoert die Gleichverteilung.',
      'Vor Rueckkehr in den Filtrationsbetrieb muss das Filterbett entlueftet sein.',
    ],
  },
  freierAblauf: {
    title: 'Freier Ablauf zum Kanal',
    short: 'KANAL',
    color: '#7ac8ff',
    items: [
      'Rueckspuelwasser wird drucklos und sichtbar in den Kanal abgefuehrt.',
      'Freier Auslauf verhindert Rueckstau und unkontrollierten Ueberstau im Filterkessel.',
      'Gerade im Spuelbetrieb muss der Ablauf frei, sauber und hydraulisch sicher sein.',
    ],
  },
  filterschicht: {
    title: 'Filterschicht / Mehrschichtbett',
    short: 'BETT',
    color: '#34c090',
    items: [
      'Das Filterbett muss nach der Spuelung wieder mit ebener Oberflaeche liegen.',
      'Bei Mehrschichtfiltern wird vor bzw. nach dem Spuelvorgang bis zur Filterschicht abgesenkt.',
      'Nur ein sauber geschichtetes und entlueftetes Bett liefert stabile Filtratqualitaet.',
    ],
  },
  ablaufrichter: {
    title: 'Ablaufrichter / Absenkung',
    short: 'TRICH',
    color: '#a070ff',
    items: [
      'Waehrend des Spuelvorgangs wird der Wasserstand zum Ablaufrichter abgesenkt.',
      'Die Absenkung schafft freien Austrag fuer Schmutz, Luft und Spuelwasser.',
      'Kein Ueberstau: Oberwasserraum bleibt hydraulisch entlastet und beobachtbar.',
    ],
  },
  filterbettAufweitung: {
    title: 'Filterbett-Aufweitung',
    short: '10%',
    color: '#f0b26d',
    items: [
      'Beim Rueckspuelen soll sich das Filterbett kontrolliert aufweiten.',
      'In der Vorlage ist eine Bettaufweitung um etwa 10 % dargestellt.',
      'Zu geringe Aufweitung reinigt schlecht, zu hohe Aufweitung kann Filtermaterial austragen.',
    ],
  },
  wasserumkehr: {
    title: 'Rueckspuelstrom',
    short: 'QSP',
    color: '#34b9ff',
    items: [
      'Die Wasserfuehrung wird im Spuelbetrieb umgekehrt: von unten nach oben durch das Bett.',
      'Die dargestellte Spuelgeschwindigkeit liegt bei etwa 60 bis 65 m/h.',
      'Spuelgeschwindigkeit immer material-, temperatur- und anlagenspezifisch abgleichen.',
    ],
  },
  luftspuelung: {
    title: 'Luftspuelung',
    short: 'LUFT',
    color: '#ff7a7a',
    items: [
      'Luft lockert das Filterbett auf und loest anhaftende Schmutzflocken.',
      'Sie wirkt vor oder kombiniert mit Wasser, um Verblockungen im Bett zu brechen.',
      'Ungleichmaessige Luftverteilung deutet auf Probleme am Duesenboden oder Luftnetz hin.',
    ],
  },
  erstfiltrat: {
    title: 'Erstfiltrat zum Kanal',
    short: 'EF',
    color: '#ffd166',
    items: [
      'Nach der Spuelung wird das erste Filtrat nicht direkt ins Becken gegeben.',
      'Es geht zunaechst zum Kanal, bis das Wasser wieder klar und betriebssicher ist.',
      'Damit werden Resttruebung, Luft und aufgewirbelte Partikel sicher ausgespuelt.',
    ],
  },
  duesenboden: {
    title: 'Stuetz- und Duesenboden',
    short: 'DUES',
    color: '#5ad0ff',
    items: [
      'Stuetzt das Filtermaterial mechanisch und verteilt Wasser sowie Luft gleichmaessig.',
      'Verhindert Materialaustrag in die Unterbodenzone und in die Spuelleitungen.',
      'Beschaedigte oder verstopfte Duesen fuehren sofort zu Schiefspuelung und Totzonen.',
    ],
  },
};

const DETAIL_MODES = [
  {
    id: 'aufbau',
    label: 'Aufbau',
    accent: '#4a9eff',
    focus: ['belueftung', 'filterschicht', 'duesenboden'],
    detail: [
      'Geschlossener Filter arbeitet als druckfester Kessel mit Oberwasserraum, Bett und Unterbau.',
      'Belueftung, Filterschicht und Duesenboden muessen hydraulisch zusammenpassen.',
      'Die Kesselgeometrie schafft einen definierten Weg fuer Filtration und Spaeter fuer die Spuelung.',
    ],
    caution: 'Schon kleine Schaeden an Entlueftung oder Duesenboden wirken sich direkt auf die Filterwirkung aus.',
  },
  {
    id: 'mehrschichtbetrieb',
    label: 'Mehrschichtbetrieb',
    accent: '#34c090',
    focus: ['filterschicht', 'freierAblauf', 'erstfiltrat'],
    detail: [
      'Bei Mehrschichtfiltern wird vor bzw. nach dem Spuelen bis zur Filterschicht abgesenkt.',
      'Nach dem Spuelen muss die Bettoberflaeche wieder eben und sauber geordnet sein.',
      'Das erste Filtrat wird zum Kanal gefuehrt, bis die Wasserqualitaet wieder stabil ist.',
    ],
    caution: 'Ein verformtes oder verschobenes Mehrschichtbett verschlechtert die Filtration sofort.',
  },
  {
    id: 'luftspuelung',
    label: 'Luftspuelung',
    accent: '#ff7a7a',
    focus: ['luftspuelung', 'filterbettAufweitung', 'duesenboden'],
    detail: [
      'Luftspuelung lockert das Festbett und loest eingelagerten Schmutz aus den Kornzwischenraeumen.',
      'Der Duesenboden verteilt die Luft gleichmaessig, damit keine Totzonen entstehen.',
      'Die Spaeter folgende Bettaufweitung kann nur sauber arbeiten, wenn das Bett zuerst geloest wurde.',
    ],
    caution: 'Zu harte oder zu ungleichmaessige Luftspuelung kann das Bett aufreissen oder Duesen ueberlasten.',
  },
  {
    id: 'rueckspuelung',
    label: 'Rueckspuelung',
    accent: '#a070ff',
    focus: ['ablaufrichter', 'wasserumkehr', 'freierAblauf'],
    detail: [
      'Im Rueckspuelbetrieb wird die Wasserfuehrung von unten nach oben umgekehrt.',
      'Der Wasserstand wird zum Ablaufrichter abgesenkt, damit kein Ueberstau entsteht.',
      'Schmutz und Spuelwasser verlassen den Filter drucklos ueber den freien Ablauf zum Kanal.',
    ],
    caution: 'Rueckspuelung ohne freien Ablauf oder mit falscher Geschwindigkeit reinigt schlecht und belastet das Bett.',
  },
  {
    id: 'wiederanfahren',
    label: 'Wiederanfahren',
    accent: '#ffd166',
    focus: ['belueftung', 'erstfiltrat', 'filterschicht'],
    detail: [
      'Nach der Spuelung wird das Bett wieder gesetzt, entlueftet und hydraulisch beruhigt.',
      'Erstfiltrat geht zum Kanal, bis Trubstoffe und Restluft ausgetragen sind.',
      'Erst danach wird der Filter sauber auf den normalen Filtrationsbetrieb zurueckgestellt.',
    ],
    caution: 'Zu fruehes Umschalten ins Becken fuehrt zu Truebung, Luftaustrag und Hygieneproblemen.',
  },
];

const KENNDATEN = [
  { label: 'Bauart', value: 'Geschlossener Festbett-/Druckfilter' },
  { label: 'Filtertyp', value: 'Mehrschichtfilter moeglich' },
  { label: 'Normalbetrieb', value: 'Filtration unter Druck durch das Bett' },
  { label: 'Rueckspuelung', value: 'Wasserfuehrung umgekehrt, unten nach oben' },
  { label: 'Spuelgeschwindigkeit', value: 'ca. 60 - 65 m/h' },
  { label: 'Bettaufweitung', value: 'ca. 10 % dargestellt' },
];

const BETRIEBSCHECKS = [
  { label: 'Freier Ablauf', value: 'sichtbar, drucklos, ohne Rueckstau', ok: true },
  { label: 'Filterbett', value: 'nach Spuelung eben und sauber gesetzt', ok: true },
  { label: 'Entlueftung', value: 'Bett und Oberraum luftfrei', ok: true },
  { label: 'Erstfiltrat', value: 'zunaechst zum Kanal, nicht ins Becken', ok: true },
  { label: 'Spuelhydraulik', value: 'Luft + Wasser gleichmaessig verteilt', ok: true },
];

const STATIC_FLOW_SEGMENTS = [
  { points: [[410, 76], [410, 32]], color: '#295d8a', opacity: 0.45 },
  { points: [[260, 184], [120, 184]], color: '#295d8a', opacity: 0.45 },
  { points: [[300, 372], [182, 386]], color: '#295d8a', opacity: 0.45 },
  { points: [[520, 352], [650, 352]], color: '#295d8a', opacity: 0.45 },
  { points: [[494, 344], [494, 212]], color: '#295d8a', opacity: 0.35 },
];

const MODE_FLOW_SEGMENTS = {
  aufbau: [
    { points: [[410, 76], [410, 112], [410, 150]], color: '#4a9eff' },
    { points: [[320, 210], [410, 210], [500, 210]], color: '#4a9eff' },
    { points: [[330, 336], [410, 336], [490, 336]], color: '#4a9eff' },
  ],
  mehrschichtbetrieb: [
    { points: [[320, 210], [350, 210], [380, 210]], color: '#34c090' },
    { points: [[260, 184], [120, 184]], color: '#34c090' },
    { points: [[300, 372], [182, 386]], color: '#34c090' },
  ],
  luftspuelung: [
    { points: [[520, 352], [548, 352], [548, 322]], color: '#ff7a7a' },
    { points: [[548, 322], [548, 270], [548, 236]], color: '#ff7a7a' },
    { points: [[520, 352], [494, 352], [494, 334]], color: '#ff7a7a' },
  ],
  rueckspuelung: [
    { points: [[520, 352], [494, 352], [494, 216]], color: '#a070ff' },
    { points: [[494, 216], [452, 184], [452, 154]], color: '#a070ff' },
    { points: [[452, 154], [260, 184], [120, 184]], color: '#a070ff' },
  ],
  wiederanfahren: [
    { points: [[410, 76], [410, 32]], color: '#ffd166' },
    { points: [[320, 210], [350, 210], [380, 210]], color: '#ffd166' },
    { points: [[300, 372], [182, 386]], color: '#ffd166' },
  ],
};

function toPolylinePoints(points) {
  return points.map(([x, y]) => `${x},${y}`).join(' ');
}

function ClosedFilterDiagram({ activeSpot, setActiveSpot, xrayMode, showLabels, activeMode }) {
  const mode = DETAIL_MODES.find((item) => item.id === activeMode) || DETAIL_MODES[0];
  const shellOpacity = xrayMode ? 0.2 : 0.82;
  const shellStroke = xrayMode ? '#75c8ff' : '#2a5a90';

  return (
    <div className="w-full" style={{ height: MODEL_HEIGHT }}>
      <svg viewBox="0 0 820 520" className="w-full h-full" role="img" aria-label="Geschlossener Filter im Schnittbild mit Rueckspuelung">
        <defs>
          <clipPath id="closed-filter-shell-clip">
            <path d={VESSEL_PATH} />
          </clipPath>
          <pattern id="water-lines" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M2 6 C6 3, 12 3, 16 6" fill="none" stroke="#9ed8ff" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
            <path d="M2 13 C6 10, 12 10, 16 13" fill="none" stroke="#9ed8ff" strokeWidth="1.1" strokeLinecap="round" opacity="0.38" />
          </pattern>
          <pattern id="filter-bed-fine" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#b89258" />
            <circle cx="4" cy="4" r="1.9" fill="#dfc18f" />
            <circle cx="11" cy="5" r="1.8" fill="#c7a56c" />
            <circle cx="7" cy="11" r="2" fill="#e8d2a9" />
            <circle cx="13" cy="12.5" r="1.5" fill="#cda86f" />
          </pattern>
          <pattern id="filter-bed-expanded" width="18" height="18" patternUnits="userSpaceOnUse">
            <rect width="18" height="18" fill="#8fb2c8" />
            <circle cx="5" cy="5" r="2.3" fill="none" stroke="#e4f4ff" strokeWidth="1.1" />
            <circle cx="13" cy="6" r="2.6" fill="none" stroke="#d5efff" strokeWidth="1" />
            <circle cx="8" cy="13" r="2.2" fill="none" stroke="#f4fbff" strokeWidth="1" />
          </pattern>
          <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8fd8ff" />
          </marker>
          <filter id="hotspot-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="20" y="16" width="780" height="488" rx="24" fill="#04111f" stroke="#163651" />

        <text x="230" y="56" textAnchor="middle" fontSize="12" fontWeight="700" fill="#84aeca">
          VOR / NACH DEM SPUELVORGANG
        </text>
        <text x="592" y="56" textAnchor="middle" fontSize="12" fontWeight="700" fill="#84aeca">
          WAEHREND DES SPUELVORGANGS
        </text>

        <g clipPath="url(#closed-filter-shell-clip)">
          <rect x="260" y="80" width="150" height="312" fill="#0f2940" opacity="0.18" />
          <rect x="410" y="80" width="150" height="312" fill="#11314c" opacity="0.2" />

          <rect x="272" y="150" width="126" height="58" fill="url(#water-lines)" opacity="0.84" />
          <rect x="424" y="146" width="122" height="44" fill="url(#water-lines)" opacity="0.86" />

          <rect x="272" y="208" width="126" height="124" fill="url(#filter-bed-fine)" />
          <rect x="424" y="186" width="122" height="146" fill="url(#filter-bed-expanded)" />

          <rect x="272" y="332" width="126" height="38" fill="#6e8ea7" opacity="0.62" />
          <rect x="424" y="332" width="122" height="38" fill="#6e8ea7" opacity="0.62" />

          <path d="M 410 118 C 398 154, 424 188, 410 214 C 396 242, 424 276, 410 306 C 396 334, 422 358, 410 382" fill="none" stroke="#0d1824" strokeWidth="10" opacity="0.55" />
          <path d="M 410 118 C 398 154, 424 188, 410 214 C 396 242, 424 276, 410 306 C 396 334, 422 358, 410 382" fill="none" stroke="#8bc6ef" strokeWidth="2" opacity="0.42" />

          <line x1="272" y1="208" x2="398" y2="208" stroke="#d7b06e" strokeWidth="2" />
          <line x1="424" y1="186" x2="546" y2="186" stroke="#d9ecff" strokeWidth="2" strokeDasharray="7 5" />
          <line x1="272" y1="332" x2="398" y2="332" stroke="#8abbe0" strokeWidth="2" />
          <line x1="424" y1="332" x2="546" y2="332" stroke="#8abbe0" strokeWidth="2" />
        </g>

        <path d={VESSEL_PATH} fill="#153553" fillOpacity={shellOpacity} stroke={shellStroke} strokeWidth="3" />
        <ellipse cx="410" cy="92" rx="150" ry="16" fill="#77c8ff" opacity="0.08" />
        <ellipse cx="410" cy="378" rx="150" ry="16" fill="#77c8ff" opacity="0.04" />

        <path d="M 402 76 L 402 32 L 418 32 L 418 76" fill="#1e4f76" stroke="#7fc8ff" strokeWidth="2" />
        <path d="M 442 144 L 462 154 L 442 164 Z" fill="#7aa7c8" stroke="#b8dfff" strokeWidth="1.5" />
        <line x1="462" y1="154" x2="498" y2="154" stroke="#b8dfff" strokeWidth="1.4" />

        <path d="M 260 176 L 180 176 L 180 192 L 120 192 L 120 176 L 180 176" fill="#1e4f76" stroke="#7fc8ff" strokeWidth="2.5" />
        <path d="M 300 370 L 228 378 L 228 392 L 182 392 L 182 378 L 228 378" fill="#1e4f76" stroke="#7fc8ff" strokeWidth="2.5" />
        <path d="M 520 346 L 606 346 L 606 330 L 650 330 L 650 346 L 606 346" fill="#1e4f76" stroke="#7fc8ff" strokeWidth="2.5" />

        <path d="M 516 352 C 538 350, 548 342, 558 326" fill="none" stroke="#f7a3a3" strokeWidth="3" strokeLinecap="round" />
        <path d="M 524 362 C 540 358, 548 350, 556 338" fill="none" stroke="#ff8f8f" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />

        {[288, 312, 338, 364].map((x) => (
          <circle key={`left-wave-${x}`} cx={x} cy={176 + ((x / 6) % 2)} r="0" fill="none" />
        ))}

        {[462, 482, 500, 520].map((y) => (
          <path
            key={`up-arrow-${y}`}
            d={`M 494 ${y} L 494 ${y - 18}`}
            stroke="#9cd7ff"
            strokeWidth="2"
            markerEnd="url(#flow-arrow)"
            opacity="0.62"
          />
        ))}

        {[532, 548, 564].map((x, index) => (
          <g key={`bubble-${x}`}>
            <circle cx={x} cy={360 - index * 10} r={4 + index} fill="none" stroke="#ffd0d0" strokeWidth="1.2" opacity="0.8" />
            <circle cx={x + 8} cy={346 - index * 12} r={2.8 + index * 0.8} fill="none" stroke="#ffd0d0" strokeWidth="1.1" opacity="0.7" />
          </g>
        ))}

        {STATIC_FLOW_SEGMENTS.map((segment, index) => (
          <polyline
            key={`static-flow-${index}`}
            points={toPolylinePoints(segment.points)}
            fill="none"
            stroke={segment.color}
            strokeWidth="2"
            strokeOpacity={segment.opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {(MODE_FLOW_SEGMENTS[activeMode] || []).map((segment, index) => (
          <polyline
            key={`mode-flow-${index}`}
            points={toPolylinePoints(segment.points)}
            fill="none"
            stroke={segment.color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd="url(#flow-arrow)"
            opacity="0.95"
          />
        ))}

        <text x="120" y="168" textAnchor="start" fontSize="11" fontWeight="700" fill="#8eb3ce">
          freier Ablauf
        </text>
        <text x="120" y="182" textAnchor="start" fontSize="11" fill="#7597b2">
          zum Kanal
        </text>
        <text x="94" y="410" textAnchor="start" fontSize="11" fontWeight="700" fill="#8eb3ce">
          Erstfiltrat
        </text>
        <text x="94" y="424" textAnchor="start" fontSize="11" fill="#7597b2">
          zum Kanal
        </text>
        <text x="602" y="308" textAnchor="start" fontSize="11" fontWeight="700" fill="#8eb3ce">
          Umkehrung der
        </text>
        <text x="602" y="322" textAnchor="start" fontSize="11" fill="#7597b2">
          Wasserfuehrung
        </text>
        <text x="602" y="336" textAnchor="start" fontSize="11" fill="#7597b2">
          mit 60 - 65 m/h
        </text>
        <text x="598" y="390" textAnchor="start" fontSize="11" fontWeight="700" fill="#8eb3ce">
          Auflockerung durch
        </text>
        <text x="598" y="404" textAnchor="start" fontSize="11" fill="#7597b2">
          Luftspuelung
        </text>

        {mode.focus.map((spotId) => {
          const spot = HOTSPOTS.find((item) => item.id === spotId);
          if (!spot) return null;
          return (
            <circle
              key={`focus-${spot.id}`}
              cx={spot.x}
              cy={spot.y}
              r={activeSpot === spot.id ? 20 : 15}
              fill={spot.color}
              fillOpacity={0.1}
              stroke={spot.color}
              strokeOpacity={0.35}
              strokeWidth="1.6"
            />
          );
        })}

        {HOTSPOTS.map((spot) => {
          const isActive = activeSpot === spot.id;
          return (
            <g key={spot.id}>
              <circle
                cx={spot.x}
                cy={spot.y}
                r={isActive ? 11 : 8}
                fill={spot.color}
                stroke="#eaf7ff"
                strokeWidth={isActive ? 2.4 : 1.6}
                opacity={0.98}
                filter={isActive ? 'url(#hotspot-glow)' : undefined}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveSpot(spot.id)}
              />
              <circle
                cx={spot.x}
                cy={spot.y}
                r={isActive ? 19 : 15}
                fill="none"
                stroke={spot.color}
                strokeOpacity={isActive ? 0.5 : 0.25}
                strokeWidth="1.4"
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveSpot(spot.id)}
              />

              {showLabels && (
                <g transform={`translate(${spot.x + spot.lx}, ${spot.y + spot.ly})`} style={{ cursor: 'pointer' }} onClick={() => setActiveSpot(spot.id)}>
                  <rect
                    x="0"
                    y="0"
                    rx="8"
                    ry="8"
                    width={Math.max(74, spot.label.length * 5.8 + 18)}
                    height="34"
                    fill="#071426"
                    fillOpacity="0.92"
                    stroke={isActive ? spot.color : '#1a3a5a'}
                    strokeWidth="1.2"
                  />
                  <text x="10" y="14" fontSize="10" fontWeight="700" fill={spot.color}>
                    {spot.shortLabel}
                  </text>
                  <text x="10" y="27" fontSize="10" fill="#d8eeff">
                    {spot.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function ClosedFilterDeepDiveView() {
  const [xrayMode, setXrayMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [activeSpot, setActiveSpot] = useState('filterschicht');
  const [activeMode, setActiveMode] = useState('aufbau');

  const detailMode = useMemo(
    () => DETAIL_MODES.find((item) => item.id === activeMode) || DETAIL_MODES[0],
    [activeMode],
  );

  const activeSpotData = useMemo(
    () => (activeSpot ? HOTSPOT_DATA[activeSpot] : null),
    [activeSpot],
  );

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
            DEEP DIVE PLUS - FILTRATION & FILTERTECHNIK
          </p>
          <h3 className="text-lg font-black text-white mt-0.5">Geschlossener Filter / Festbettfilter</h3>
          <p className="text-xs font-mono mt-1" style={{ color: '#58789c' }}>
            Aufbau - Mehrschichtbetrieb - Luftspuelung - Rueckspuelung - Wiederanfahren
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
              BETRIEBSMODUS
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

          <ClosedFilterDiagram
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
                Tippe einen Hotspot im Filtermodell an.
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
              Warum darf waehrend der Rueckspuelung am geschlossenen Filter kein Ueberstau entstehen?
            </p>
            <details>
              <summary className="text-xs cursor-pointer font-mono" style={{ color: '#4a9eff' }}>
                Antwort einblenden
              </summary>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#90b0d0' }}>
                Weil Schmutz, Luft und Spuelwasser nur bei abgesenktem Wasserstand und freiem Ablauf sicher ausgetragen werden.
                Ueberstau erzeugt Rueckdruck, verschlechtert die Bettreinigung und kann zu unkontrolliertem Material- oder Schmutztransport fuehren.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
