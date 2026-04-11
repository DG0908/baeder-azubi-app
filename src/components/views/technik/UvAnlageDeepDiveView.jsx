import { useState } from 'react';

const HOTSPOTS = [
  { id: 'einlauf', label: 'Rohwassereinlauf', short: 'EIN', color: '#4a9eff', x: 120, y: 200 },
  { id: 'lampe', label: 'UV-Lampe', short: 'LAM', color: '#ffd166', x: 280, y: 200 },
  { id: 'quarzglas', label: 'Quarzglasrohr', short: 'QGR', color: '#a070ff', x: 400, y: 200 },
  { id: 'dosimeter', label: 'UV-Dosimeter', short: 'DOS', color: '#34c090', x: 520, y: 150 },
  { id: 'reinigung', label: 'Lampenreinigung', short: 'REI', color: '#ff7a7a', x: 520, y: 260 },
  { id: 'ablauf', label: 'Filtrat-Ablauf', short: 'ABL', color: '#5ad0ff', x: 660, y: 200 },
];

const HOTSPOT_DATA = {
  einlauf: { title: 'Rohwassereinlauf', color: '#4a9eff', items: ['Wasser kommt vom Druckfilter (geklärt)', 'UV-Anlage steht nach dem Filter (im Reinwasserweg)', 'Trübung darf nicht zu hoch sein: UV-Transmittanz sinkt', 'UVT₂₅₄ (UV-Transmittanz): mind. 75 % (DIN 19643)', 'Zu trübes Wasser: abschirmt Lampe → Wirksamkeit sinkt', 'Durchfluss: geregelt durch Pumpe (m³/h)'] },
  lampe: { title: 'UV-Lampe (UV-C, 254 nm)', color: '#ffd166', items: ['Niederdrucklampe: emittiert monochrom bei 254 nm', 'Mitteldrucklampe: breitbandiger Spektrum (höhere Leistung)', 'UV-C bei 254 nm: maximale DNA-Schädigung bei Keimen', 'Lampenleistung: 80–1000 W je nach Anlage', 'Lebensdauer: ca. 10.000–16.000 Betriebsstunden', 'Austausch: nach Herstellervorgabe (Leistungsabfall)'] },
  quarzglas: { title: 'Quarzglasrohr (Lampenmantel)', color: '#a070ff', items: ['Schützt Lampe vor Wasserkontakt', 'Material: synthetisches Quarzglas — hohe UV-Durchlässigkeit', 'Normale Gläser: absorbieren UV-C (ungeeignet!)', 'Kalkablagerungen: reduzieren UV-Transmission → Reinigung nötig', 'Reinigung: wöchentlich mit Ethanol oder mechanischer Wischvorrichtung', 'Beschädigung Quarzglas: sofortige Außerbetriebnahme'] },
  dosimeter: { title: 'UV-Dosimeter (Sensor)', color: '#34c090', items: ['Misst UV-Bestrahlungsstärke in W/m² (Radiometer)', 'Berechnet UV-Dosis: E (J/m²) = Bestrahlungsstärke × Kontaktzeit', 'DIN 19643: Mindestdosis 400 J/m² (H₂O₂-Äquivalent)', 'Sensorposition: in Flussnähe zur Lampe', 'Alterungskorrektur: Sensor registriert Leistungsabfall der Lampe', 'Alarm: bei Unterschreitung der Mindestdosis → Betriebsstop'] },
  reinigung: { title: 'Lampenreinigung & Wartung', color: '#ff7a7a', items: ['Regelmäßigkeit: wöchentlich (Kalkbelag senkt Leistung)', 'Automatische Reinigung: mechanische Wischvorrichtung (manche Anlagen)', 'Manuelle Reinigung: Ethanol-Wischer am Quarzglasrohr', 'Inspektion: monatlich Transmittanzmessung', 'Lampenwechsel: nach Herstellerangabe (Betriebsstunden)', 'Entsorgung: UV-Lampen als Sondermüll (Hg-haltig bei ND-Lampen)'] },
  ablauf: { title: 'Behandeltes Wasser (Ablauf)', color: '#5ad0ff', items: ['Wasser ist desinfiziert — kein Residualschutz im Becken', 'Muss mit Chlor kombiniert werden (DIN 19643 Pflicht)', 'Chlor nach UV: Restschutz für Beckenverteilung', 'UV reduziert gebundenes Chlor (Chloramine werden photolysiert)', 'Erlaubt niedrigeren Chlor-Sollwert: 0,3 mg/L freies Chlor', 'Redox-Mindestanforderung mit UV: 700 mV (statt 750 mV)'] },
};

const MODES = [
  { id: 'aufbau', label: 'Aufbau', color: '#4a9eff', focus: ['einlauf', 'lampe', 'quarzglas', 'ablauf'] },
  { id: 'wirkung', label: 'Wirkung & Dosis', color: '#ffd166', focus: ['lampe', 'dosimeter'] },
  { id: 'wartung', label: 'Wartung', color: '#ff7a7a', focus: ['reinigung', 'quarzglas', 'dosimeter'] },
];

function Diagram({ activeSpot, setActiveSpot, activeMode }) {
  const mode = MODES.find(m => m.id === activeMode) || MODES[0];
  return (
    <div style={{ width: '100%', height: 'clamp(300px, 52vh, 460px)' }}>
      <svg viewBox="0 0 820 400" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="uv-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="uv-lamp-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="uv-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#2a5a8a" />
          </marker>
          <radialGradient id="uv-beam" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c0a000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="10" y="8" width="800" height="384" rx="18" fill="#04111f" stroke="#163651" />

        {/* UV-Reaktor Gehäuse */}
        <rect x="120" y="150" width="560" height="100" rx="8" fill="#0a1020" stroke="#2a5080" strokeWidth="2.5" />

        {/* UV-Strahlen (Glow-Effekt) */}
        <ellipse cx="400" cy="200" rx="230" ry="40" fill="url(#uv-beam)" filter="url(#uv-lamp-glow)" />

        {/* Lampe im Innern */}
        <rect x="160" y="188" width="480" height="24" rx="6" fill="#1a1400" stroke="#ffd166" strokeWidth="2" filter="url(#uv-lamp-glow)" />
        <rect x="162" y="190" width="476" height="20" rx="5" fill="#3a3000" opacity="0.8" />
        {/* UV Strahlen Linien */}
        {[180,220,260,300,340,380,420,460,500,540,580,620].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="190" x2={x - 15} y2="155" stroke="#ffd166" strokeWidth="0.8" opacity="0.4" />
            <line x1={x} y1="210" x2={x - 15} y2="245" stroke="#ffd166" strokeWidth="0.8" opacity="0.4" />
          </g>
        ))}
        <text x="400" y="204" textAnchor="middle" fill="#ffd166" fontSize="9" fontWeight="700">UV-C LAMPE — 254 nm</text>

        {/* Quarzglasrohr Anzeige */}
        <rect x="155" y="182" width="490" height="36" rx="8" fill="none" stroke="#a070ff" strokeWidth="1.5" strokeDasharray="5,4" />
        <text x="160" y="230" fill="#a070ff" fontSize="8">Quarzglasrohr</text>

        {/* Wasserfluss */}
        <line x1="50" y1="200" x2="120" y2="200" stroke="#4a9eff" strokeWidth="3" markerEnd="url(#uv-arr)" />
        <text x="85" y="190" textAnchor="middle" fill="#4a9eff" fontSize="9">Rohwasser</text>
        <line x1="680" y1="200" x2="760" y2="200" stroke="#5ad0ff" strokeWidth="3" markerEnd="url(#uv-arr)" />
        <text x="720" y="190" textAnchor="middle" fill="#5ad0ff" fontSize="9">Filtrat</text>

        {/* DNA-Schaden Visualisierung */}
        <rect x="50" y="280" width="320" height="95" rx="6" fill="#001020" stroke="#a070ff40" strokeWidth="1.5" />
        <text x="210" y="300" textAnchor="middle" fill="#a070ff" fontSize="10" fontWeight="700">UV-C Wirkprinzip — DNA-Schaden</text>
        {/* DNA-Doppelhelix vereinfacht */}
        {[0,1,2,3].map(i => (
          <g key={i}>
            <path d={`M ${80 + i * 30} 315 Q ${95 + i * 30} 325 ${80 + i * 30} 335`} fill="none" stroke="#5ad0ff" strokeWidth="1.5" />
            <path d={`M ${100 + i * 30} 315 Q ${85 + i * 30} 325 ${100 + i * 30} 335`} fill="none" stroke="#ff7a7a" strokeWidth="1.5" />
            <line x1={80 + i * 30} y1="325" x2={100 + i * 30} y2="325" stroke="#ffd166" strokeWidth="1" opacity="0.6" />
          </g>
        ))}
        <text x="250" y="322" fill="#a070ff" fontSize="8">Thymin-Dimer-</text>
        <text x="250" y="334" fill="#a070ff" fontSize="8">bildung</text>
        <text x="250" y="350" fill="#7050b0" fontSize="8">DNA-Replikation</text>
        <text x="250" y="362" fill="#7050b0" fontSize="8">blockiert → Keim inaktiv</text>

        {/* Dosis Box */}
        <rect x="400" y="280" width="370" height="95" rx="6" fill="#001510" stroke="#34c09040" strokeWidth="1.5" />
        <text x="585" y="300" textAnchor="middle" fill="#34c090" fontSize="10" fontWeight="700">UV-Dosis (DIN 19643)</text>
        {[
          ['Mindestdosis:', '400 J/m²'],
          ['Cryptosporidien:', '≥ 10 mJ/cm² (= 100 J/m²)'],
          ['Gemessen durch:', 'Dosimeter (Radiometer)'],
          ['Formel:', 'E = Bestrahlungsstärke × Zeit'],
          ['UVT₂₅₄ Mindest:', '≥ 75 % Transmission'],
        ].map(([a, b], i) => (
          <g key={i}>
            <text x="415" y={318 + i * 12} fill="#1a7050" fontSize="8" fontWeight="700">{a}</text>
            <text x="510" y={318 + i * 12} fill="#34c090" fontSize="8">{b}</text>
          </g>
        ))}

        {/* Hotspot Markers */}
        {HOTSPOTS.map(hs => {
          const active = activeSpot === hs.id;
          const focused = mode.focus.includes(hs.id);
          const op = focused ? 1 : 0.35;
          return (
            <g key={hs.id} onClick={() => setActiveSpot(active ? null : hs.id)} style={{ cursor: 'pointer' }} opacity={op} filter={active ? 'url(#uv-glow)' : undefined}>
              <circle cx={hs.x} cy={hs.y} r={active ? 14 : 11} fill={hs.color + '22'} stroke={hs.color} strokeWidth={active ? 2.5 : 1.5} />
              <text x={hs.x} y={hs.y + 4} textAnchor="middle" fill={hs.color} fontSize="7" fontWeight="800">{hs.short}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function UvAnlageDeepDiveView({ darkMode }) {
  const [activeSpot, setActiveSpot] = useState(null);
  const [activeMode, setActiveMode] = useState('aufbau');
  const spot = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#4a9eff', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>UV-Anlage</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>UV-C-Desinfektion bei 254 nm — Wirkprinzip, Dosimetrie, Kombination mit Chlor nach DIN 19643</p>

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
        {!spot && <div style={{ color: '#2a5a7a', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>Komponente anklicken für Details</div>}

        <div style={{ background: '#071828', border: '1px solid #163651', borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 700, color: '#4a9eff', marginBottom: 10, fontSize: 13 }}>UV-Anlage im Betrieb — Kenndaten</div>
          {[
            ['Wellenlänge', '254 nm (UV-C, Niederdrucklampe)'],
            ['Mindestdosis DIN 19643', '400 J/m²'],
            ['UVT₂₅₄ Mindesttransmittanz', '≥ 75 %'],
            ['Redox mit UV', '≥ 700 mV (statt 750 mV)'],
            ['Wirkung auf Cryptosporidien', 'wirksam (Chlor nicht!)'],
            ['Kombination', 'immer mit freiem Chlor (Pflicht)'],
            ['Wartungsintervall Lampe', 'laut Hersteller (typisch: 10.000–16.000 h)'],
          ].map(([label, value], i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
              <span style={{ color: '#4a9eff', fontWeight: 700, minWidth: 240 }}>{label}</span>
              <span style={{ color: '#a0c8e0' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
