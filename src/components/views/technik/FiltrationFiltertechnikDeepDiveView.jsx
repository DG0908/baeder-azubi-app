import { useState } from 'react';

const HOTSPOTS = [
  { id: 'einlauf', label: 'Rohwassereinlauf', short: 'EIN', color: '#4a9eff', x: 155, y: 95 },
  { id: 'anthrazit', label: 'Anthrazit-Schicht', short: 'ANT', color: '#a070ff', x: 155, y: 175 },
  { id: 'quarzsand', label: 'Quarzsand-Schicht', short: 'QRZ', color: '#ffd166', x: 155, y: 245 },
  { id: 'kies', label: 'Kies-Trägerschicht', short: 'KIS', color: '#34c090', x: 155, y: 305 },
  { id: 'ablauf', label: 'Filtrat-Ablauf', short: 'ABL', color: '#5ad0ff', x: 155, y: 360 },
  { id: 'rueckspuelung', label: 'Rückspülung', short: 'RSP', color: '#ff7a7a', x: 520, y: 200 },
];

const HOTSPOT_DATA = {
  einlauf: { title: 'Rohwassereinlauf (oben)', color: '#4a9eff', items: ['Rohwasser kommt vom Ausgleichsbehälter via Pumpe', 'Einlauf von oben: Wasser strömt durch das Filterbett', 'Flockungsmittel wurde bereits zugegeben (Flocken im Wasser)', 'Druckmessung oben + unten: Δp zeigt Filterbeladung', 'Durchfluss: volumetrisch geregelt (m³/h)', 'Betriebsdruck: je nach Anlage 2–6 bar'] },
  anthrazit: { title: 'Anthrazit-Schicht (oben)', color: '#a070ff', items: ['Korngröße: 1,2–2,0 mm (gröber)', 'Dichte: 1,4–1,6 g/cm³ (leichter als Quarzsand)', 'Aufgabe: Vorabscheidung der Makroflocken', 'Porengröße: groß → nimmt Hauptteil der Flocken auf', 'Bei Zweischichtfilter: Anthrazit bleibt oben (trotz Rückspülung)', 'Vorteil: längerer Filterzyklus durch Vorfilter-Wirkung'] },
  quarzsand: { title: 'Quarzsand-Schicht (Mitte)', color: '#ffd166', items: ['Korngröße: 0,4–0,8 mm (feiner als Anthrazit)', 'Dichte: 2,6 g/cm³ (schwerer als Anthrazit)', 'Hauptfiltermedium: scheidet Mikropartikel ab', 'Tiefenfilter-Wirkung: Partikel setzen sich im Bett fest', 'Biofilm: Mikroorganismen bilden Filtermatrix (gewünscht!)', 'Schichtdicke: min. 800 mm bei Einschichtfilter'] },
  kies: { title: 'Kies-Trägerschicht (unten)', color: '#34c090', items: ['Korngröße: 2–8 mm (grob)', 'Funktion: trägt Quarzsandschicht, gleichmäßige Durchströmung', 'Verteilerung: Filtratsammelrohre eingebettet im Kiesbett', 'Verhindert: Sand-Eintrag in Ablaufleitung', 'Soll nicht aufgewirbelt werden bei Rückspülung', 'Schichtdicke: 100–200 mm'] },
  ablauf: { title: 'Filtrat-Ablauf (unten)', color: '#5ad0ff', items: ['Aufbereitetes, klares Filtrat verlässt den Filter unten', 'Sammelrohre oder Düsenboden: gleichmäßige Abnahme', 'Druckmessung nach Filter: Vergleich mit Eintritt → Δp', 'Wenn Δp > 0,5 bar: Rückspülung einleiten', 'Filtrat geht zur Desinfektionsstufe', 'Filtrattrübung erhöht: Filterdurchbruch! → sofort melden'] },
  rueckspuelung: { title: 'Rückspülung (Regeneration)', color: '#ff7a7a', items: ['Phase 1 — Luftspülung: Pressluft löst Flocken aus dem Bett', 'Phase 2 — Wasserspülung: Wasser spült Flocken nach oben ab', 'Phase 3 — Nachspülung: klares Wasser bis Trübung < Grenzwert', 'Rückspülwasser: getrübt → Entsorgung oder Kläranlage', 'Dauer: ca. 15–30 Minuten je Zyklus', 'Protokoll: Datum, Druckverlauf, Rückspülwassermenge'] },
};

const MODES = [
  { id: 'aufbau', label: 'Filteraufbau', color: '#4a9eff', focus: ['einlauf', 'anthrazit', 'quarzsand', 'kies', 'ablauf'] },
  { id: 'rueckspuelung', label: 'Rückspülung', color: '#ff7a7a', focus: ['rueckspuelung', 'einlauf', 'ablauf'] },
  { id: 'schichten', label: 'Schichtmaterialien', color: '#ffd166', focus: ['anthrazit', 'quarzsand', 'kies'] },
];

function Diagram({ activeSpot, setActiveSpot, activeMode }) {
  const mode = MODES.find(m => m.id === activeMode) || MODES[0];
  const layers = [
    { y: 110, h: 80, color: '#a070ff', label: 'Anthrazit', sub: '1,2–2,0 mm', id: 'anthrazit' },
    { y: 190, h: 100, color: '#ffd166', label: 'Quarzsand', sub: '0,4–0,8 mm', id: 'quarzsand' },
    { y: 290, h: 60, color: '#34c090', label: 'Kies', sub: '2–8 mm', id: 'kies' },
  ];
  return (
    <div style={{ width: '100%', height: 'clamp(320px, 55vh, 500px)' }}>
      <svg viewBox="0 0 820 420" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="ff-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="ant-pat" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#12063a" />
            <circle cx="4" cy="4" r="2" fill="#5030a0" opacity="0.6" />
          </pattern>
          <pattern id="sand-pat" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#1a1200" />
            <circle cx="3" cy="3" r="1.5" fill="#a08020" opacity="0.7" />
          </pattern>
          <pattern id="kies-pat" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#0a1a10" />
            <ellipse cx="5" cy="5" rx="3.5" ry="2.5" fill="#2a6040" opacity="0.6" />
          </pattern>
          <marker id="ff-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#2a5a8a" />
          </marker>
        </defs>
        <rect x="10" y="8" width="800" height="404" rx="18" fill="#04111f" stroke="#163651" />

        {/* Filterbehälter */}
        <rect x="80" y="60" width="180" height="310" rx="6" fill="#061520" stroke="#1a4060" strokeWidth="3" />

        {/* Rohwasser oben */}
        <rect x="83" y="63" width="174" height="48" rx="4" fill="#081830" />
        <text x="170" y="92" textAnchor="middle" fill="#4a9eff" fontSize="10" fontWeight="700">Rohwasser</text>
        {[100,120,140,160,180,200,220,240].map((x, i) => (
          <line key={i} x1={x} y1="75" x2={x} y2="108" stroke="#4a9eff" strokeWidth="1" opacity="0.4" markerEnd="url(#ff-arr)" />
        ))}

        {/* Filterschichten */}
        <rect x="83" y="110" width="174" height="80" fill="url(#ant-pat)" />
        <rect x="83" y="190" width="174" height="100" fill="url(#sand-pat)" />
        <rect x="83" y="290" width="174" height="60" fill="url(#kies-pat)" />

        {/* Schichtbeschriftungen rechts */}
        {layers.map((l, i) => (
          <g key={i}>
            <line x1="263" y1={l.y + l.h / 2} x2="285" y2={l.y + l.h / 2} stroke={l.color} strokeWidth="1.5" />
            <text x="288" y={l.y + l.h / 2 - 3} fill={l.color} fontSize="10" fontWeight="700">{l.label}</text>
            <text x="288" y={l.y + l.h / 2 + 10} fill={l.color} fontSize="9">{l.sub}</text>
          </g>
        ))}

        {/* Düsenboden */}
        <rect x="83" y="350" width="174" height="12" fill="#1a3040" stroke="#1a4060" strokeWidth="1" />
        {[90,105,120,135,150,165,180,195,210,225,240,255].map((x, i) => (
          <circle key={i} cx={x} cy="356" r="2" fill="#4a7090" />
        ))}

        {/* Filtrat unten */}
        <rect x="83" y="362" width="174" height="20" rx="4" fill="#081830" />
        {[100,130,160,190,220,250].map((x, i) => (
          <line key={i} x1={x} y1="372" x2={x} y2="378" stroke="#5ad0ff" strokeWidth="1.5" opacity="0.6" />
        ))}
        <text x="170" y="396" textAnchor="middle" fill="#5ad0ff" fontSize="9" fontWeight="700">Filtrat (klar)</text>

        {/* Druckanzeige */}
        <rect x="310" y="70" width="160" height="60" rx="6" fill="#0a1020" stroke="#4a9eff40" strokeWidth="1.5" />
        <text x="390" y="94" textAnchor="middle" fill="#4a9eff" fontSize="10" fontWeight="700">Δp-Überwachung</text>
        <text x="390" y="110" textAnchor="middle" fill="#1a4a8a" fontSize="9">Normal: &lt; 0,3 bar</text>
        <text x="390" y="122" textAnchor="middle" fill="#ff9a30" fontSize="9">Rückspülung: &gt; 0,5 bar</text>

        {/* Rückspüldiagramm */}
        <rect x="310" y="160" width="450" height="220" rx="8" fill="#0a0810" stroke="#ff7a7a40" strokeWidth="1.5" />
        <text x="535" y="185" textAnchor="middle" fill="#ff7a7a" fontSize="11" fontWeight="700">Rückspülung — 3 Phasen</text>

        {[
          { phase: '1', label: 'Luftspülung', desc: 'Pressluft lockert Bett auf', color: '#a070ff', x: 340, y: 210 },
          { phase: '2', label: 'Wasserspülung', desc: 'Wasser spült Flocken ab', color: '#4a9eff', x: 490, y: 210 },
          { phase: '3', label: 'Nachspülung', desc: 'bis Filtrat klar', color: '#34c090', x: 640, y: 210 },
        ].map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y + 20} r="18" fill={p.color + '20'} stroke={p.color} strokeWidth="1.5" />
            <text x={p.x} y={p.y + 25} textAnchor="middle" fill={p.color} fontSize="12" fontWeight="800">{p.phase}</text>
            <text x={p.x} y={p.y + 55} textAnchor="middle" fill={p.color} fontSize="10" fontWeight="700">{p.label}</text>
            <text x={p.x} y={p.y + 68} textAnchor="middle" fill={p.color} fontSize="9">{p.desc}</text>
            {i < 2 && <line x1={p.x + 20} y1={p.y + 20} x2={p.x + 118} y2={p.y + 20} stroke="#2a4060" strokeWidth="1.5" markerEnd="url(#ff-arr)" />}
          </g>
        ))}

        <text x="535" y="320" textAnchor="middle" fill="#802020" fontSize="9">Rückspülwasser trüb → Entsorgung (nicht zurück ins Becken!)</text>
        <text x="535" y="334" textAnchor="middle" fill="#802020" fontSize="9">Dauer: 15–30 min | Protokoll pflegen</text>
        <text x="535" y="360" textAnchor="middle" fill="#1a5a8a" fontSize="9">Δp-Grenzwert: 0,5 bar → automatische Rückspülauslösung</text>

        {/* Hotspot Markers */}
        {HOTSPOTS.map(hs => {
          const active = activeSpot === hs.id;
          const focused = mode.focus.includes(hs.id);
          const op = focused ? 1 : 0.35;
          return (
            <g key={hs.id} onClick={() => setActiveSpot(active ? null : hs.id)} style={{ cursor: 'pointer' }} opacity={op} filter={active ? 'url(#ff-glow)' : undefined}>
              <circle cx={hs.x} cy={hs.y} r={active ? 14 : 11} fill={hs.color + '22'} stroke={hs.color} strokeWidth={active ? 2.5 : 1.5} />
              <text x={hs.x} y={hs.y + 4} textAnchor="middle" fill={hs.color} fontSize="7" fontWeight="800">{hs.short}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function FiltrationFiltertechnikDeepDiveView({ darkMode }) {
  const [activeSpot, setActiveSpot] = useState(null);
  const [activeMode, setActiveMode] = useState('aufbau');
  const spot = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#4a9eff', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>Filtration & Filtertechnik</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>Filteraufbau im Schnittbild — Anthrazit, Quarzsand, Kies und Rückspülung nach DIN 19643</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setActiveMode(m.id)} style={{
              padding: '5px 14px', borderRadius: 20, border: `1px solid ${m.color}60`, cursor: 'pointer', fontSize: 12, fontWeight: 700,
              background: activeMode === m.id ? m.color + '30' : '#0a1a2a', color: activeMode === m.id ? m.color : '#4a7a9a',
            }}>{m.label}</button>
          ))}
        </div>

        <div style={{ background: '#04111f', border: '1px solid #163651', borderRadius: 16, marginBottom: 14, overflow: 'hidden' }}>
          <Diagram activeSpot={activeSpot} setActiveSpot={setActiveSpot} activeMode={activeMode} />
        </div>

        {spot && (
          <div style={{ background: spot.color + '15', border: `1px solid ${spot.color}50`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, color: spot.color, marginBottom: 8 }}>{spot.title}</div>
            {spot.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13, color: '#c8e8ff' }}>
                <span style={{ color: spot.color }}>→</span><span>{it}</span>
              </div>
            ))}
          </div>
        )}
        {!spot && <div style={{ color: '#2a5a7a', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>Filterschicht oder Funktion anklicken für Details</div>}

        <div style={{ background: '#071828', border: '1px solid #163651', borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 700, color: '#4a9eff', marginBottom: 10, fontSize: 13 }}>Kenndaten Druckfilter</div>
          {[
            ['Filtrationsgeschwindigkeit', '10–30 m/h (DIN 19643)'],
            ['Quarzsandschicht', 'mind. 800 mm, Korngröße 0,4–0,8 mm'],
            ['Anthrazit (Zweischicht)', 'oben, 300–500 mm, 1,2–2,0 mm'],
            ['Rückspülung auslösen', 'Δp > 0,5 bar oder mind. 1× täglich'],
            ['Rückspülgeschwindigkeit', '20–40 m/h (Wasser), 40–60 m/h (Luft)'],
            ['Norm', 'DIN 19643, DIN 19605, DVGW W213'],
          ].map(([label, value], i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
              <span style={{ color: '#4a9eff', fontWeight: 700, minWidth: 220 }}>{label}</span>
              <span style={{ color: '#a0c8e0' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
