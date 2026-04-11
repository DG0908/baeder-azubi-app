import { useState } from 'react';

const HOTSPOTS = [
  { id: 'partikel', label: 'Kolloidale Partikel', short: 'KOL', color: '#4a9eff', x: 130, y: 180 },
  { id: 'koagulation', label: 'Koagulation', short: 'KOA', color: '#ffd166', x: 290, y: 180 },
  { id: 'flockenbildung', label: 'Flockenbildung', short: 'FLO', color: '#a070ff', x: 450, y: 180 },
  { id: 'filtration', label: 'Filtration', short: 'FIL', color: '#34c090', x: 620, y: 180 },
  { id: 'mittel', label: 'Flockungsmittel', short: 'MIT', color: '#ff7a7a', x: 290, y: 340 },
  { id: 'dosierung', label: 'Dosierung', short: 'DOS', color: '#5ad0ff', x: 620, y: 340 },
];

const HOTSPOT_DATA = {
  partikel: { title: 'Kolloidale Partikel im Beckenwasser', color: '#4a9eff', items: ['Größe: 0,001–1 µm — nicht sichtbar, nicht absetzbar', 'Quellen: Körperfette, Kosmetik, Harnstoffabbauprodukte', 'Elektrische Ladung: negativ geladen → stoßen sich ab', 'Folge: Partikel bleiben dauerhaft in Schwebe (stabile Kolloid-Suspension)', 'Trübung: erst bei höherer Konzentration sichtbar', 'Ohne Flockung: kein effektiver Filterabtrag möglich'] },
  koagulation: { title: 'Koagulation (1. Schritt)', color: '#ffd166', items: ['Flockungsmittel neutralisiert negative Oberflächenladung', 'Partikel können sich jetzt annähern (keine Abstoßung mehr)', 'Aluminiumionen Al³⁺ reagieren: Al³⁺ + 3 OH⁻ → Al(OH)₃', 'Al(OH)₃-Gel: klebt an Partikeln, bindet sie zusammen', 'Sofortreaktion: innerhalb von Sekunden nach Dosierung', 'pH-Abhängig: optimale Wirkung bei pH 6,8–7,2'] },
  flockenbildung: { title: 'Flockenbildung / Flockulation (2. Schritt)', color: '#a070ff', items: ['Mikroflocken wachsen zu sichtbaren Makroflocken (> 0,1 mm)', 'Mechanismus: Brückenbildung zwischen Partikeln', 'Flocken sind voluminös → haften an Filtermedium', 'Anschwemmfiltrat: Flocken bilden Filterschicht (Filterhilfe)', 'Schnelle Strömung: zerstört Flocken → Mischzone kurz halten', 'Flockenqualität: sichtbar als milchige Trübung vor Filter'] },
  filtration: { title: 'Filtration der Flocken', color: '#34c090', items: ['Flocken werden im Druckfilter mechanisch abgeschieden', 'Tiefenfilter: Flocken setzen sich im Filterbett fest', 'Filtermedium: Quarzsand (0,4–0,8 mm) + ggf. Anthrazit', 'Druckanstieg (Δp): zeigt Beladung → Rückspülung nötig', 'Filtrat: klar, partikelfrei, bereit zur Desinfektion', 'Rückspülwasser: enthält alle abgefilterten Flocken (Entsorgung!)'] },
  mittel: { title: 'Flockungsmittel im Vergleich', color: '#ff7a7a', items: ['Aluminiumsulfat Al₂(SO₄)₃: klassisch, günstig, pH-senkend', 'PAC (Polyaluminiumchlorid): schneller, breiter pH-Bereich', 'Eisen(III)chlorid FeCl₃: hochwirksam, stark pH-senkend (selten)', 'Polymerflockungshilfsmittel: verstärkt Flockenbildung (Zusatzmittel)', 'Zulassung: alle Mittel müssen Trinkwasserverordnung entsprechen', 'DVGW-Zulassung: Pflicht für den Einsatz in Bädern'] },
  dosierung: { title: 'Dosierung & Kontrolle', color: '#5ad0ff', items: ['Dosierstelle: kurz vor dem Filter (Rohwasserleitung)', 'Dosierrate: ca. 0,1–0,5 mg Al/L (je nach Trübung)', 'Automatische Dosierung: trübungsgesteuert oder volumetrisch', 'Manuelle Kontrolle: tägliche Sichtkontrolle des Filtrats', 'Überdosierung: führt zu Al-Restgehalt im Beckenwasser', 'Rückspülintervall: verkürzt sich bei hoher Flockenmenge'] },
};

const MODES = [
  { id: 'prozess', label: 'Prozessablauf', color: '#4a9eff', focus: ['partikel', 'koagulation', 'flockenbildung', 'filtration'] },
  { id: 'mittel', label: 'Flockungsmittel', color: '#ff7a7a', focus: ['mittel', 'koagulation'] },
  { id: 'dosierung', label: 'Dosierung', color: '#5ad0ff', focus: ['dosierung', 'filtration'] },
];

function Diagram({ activeSpot, setActiveSpot, activeMode }) {
  const mode = MODES.find(m => m.id === activeMode) || MODES[0];
  return (
    <div style={{ width: '100%', height: 'clamp(300px, 50vh, 440px)' }}>
      <svg viewBox="0 0 820 390" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="fl-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="fl-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#2a5a8a" />
          </marker>
        </defs>
        <rect x="10" y="8" width="800" height="374" rx="18" fill="#04111f" stroke="#163651" />

        {/* Phasen-Hintergrund */}
        {[
          { x: 60, color: '#4a9eff', label: 'Rohwasser' },
          { x: 220, color: '#ffd166', label: 'Koagulation' },
          { x: 380, color: '#a070ff', label: 'Flockulation' },
          { x: 540, color: '#34c090', label: 'Filtration' },
        ].map((p, i) => (
          <g key={i}>
            <rect x={p.x} y="100" width="140" height="160" rx="6" fill={p.color + '08'} stroke={p.color + '30'} strokeWidth="1" />
            <text x={p.x + 70} y="120" textAnchor="middle" fill={p.color} fontSize="10" fontWeight="700">{p.label}</text>
          </g>
        ))}

        {/* Partikel Visualisierung */}
        {/* Phase 1: viele kleine dots */}
        {[75,90,105,120,135,80,95,110,125,85,100,115].map((x, i) => (
          <circle key={i} cx={x} cy={150 + (i % 3) * 20} r="5" fill="#4a9eff" opacity="0.5" />
        ))}
        <text x="130" y="230" textAnchor="middle" fill="#1a4a8a" fontSize="8">kolloidale</text>
        <text x="130" y="241" textAnchor="middle" fill="#1a4a8a" fontSize="8">Partikel</text>

        {/* Phase 2: Partikel + Al neutralisiert */}
        {[245,270,255,280,260,275].map((x, i) => (
          <circle key={i} cx={x} cy={145 + (i % 2) * 25} r="7" fill="#ffd166" opacity="0.4" stroke="#ffd166" strokeWidth="0.5" />
        ))}
        <text x="265" y="218" textAnchor="middle" fill="#a09030" fontSize="8">Al(OH)₃-Gel</text>
        <text x="265" y="229" textAnchor="middle" fill="#a09030" fontSize="8">neutralisiert</text>

        {/* Phase 3: Makroflocken */}
        {[[405,150,20],[440,168,16],[415,178,12],[450,150,14]].map(([x,y,r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} fill="#a070ff" opacity="0.35" stroke="#a070ff" strokeWidth="0.8" />
        ))}
        <text x="430" y="220" textAnchor="middle" fill="#7050b0" fontSize="8">Makroflocken</text>
        <text x="430" y="231" textAnchor="middle" fill="#7050b0" fontSize="8">voluminös</text>

        {/* Phase 4: Filter */}
        {[560,570,580,590,600,610,620,630].map((x, i) => (
          <rect key={i} x={x} y={i % 2 === 0 ? 135 : 150} width="6" height="30" rx="2" fill="#34c090" opacity="0.5" />
        ))}
        <text x="595" y="218" textAnchor="middle" fill="#1a7050" fontSize="8">Flocken</text>
        <text x="595" y="229" textAnchor="middle" fill="#1a7050" fontSize="8">abgeschieden</text>

        {/* Pfeile */}
        <line x1="200" y1="165" x2="220" y2="165" stroke="#2a5a8a" strokeWidth="2" markerEnd="url(#fl-arr)" />
        <line x1="360" y1="165" x2="380" y2="165" stroke="#2a5a8a" strokeWidth="2" markerEnd="url(#fl-arr)" />
        <line x1="520" y1="165" x2="540" y2="165" stroke="#2a5a8a" strokeWidth="2" markerEnd="url(#fl-arr)" />
        <line x1="700" y1="165" x2="730" y2="165" stroke="#34c090" strokeWidth="2" markerEnd="url(#fl-arr)" />
        <text x="745" y="169" fill="#34c090" fontSize="9">klar</text>

        {/* Dosierpfeil von unten */}
        <rect x="220" y="300" width="140" height="55" rx="6" fill="#1a0a0a" stroke="#ff7a7a40" strokeWidth="1.5" />
        <text x="290" y="322" textAnchor="middle" fill="#ff7a7a" fontSize="9" fontWeight="700">Flockungsmittel</text>
        <text x="290" y="336" textAnchor="middle" fill="#802020" fontSize="8">Al₂(SO₄)₃ oder PAC</text>
        <text x="290" y="348" textAnchor="middle" fill="#802020" fontSize="8">0,1–0,5 mg Al/L</text>
        <line x1="290" y1="300" x2="290" y2="265" stroke="#ff7a7a" strokeWidth="1.5" markerEnd="url(#fl-arr)" />

        <rect x="510" y="300" width="140" height="55" rx="6" fill="#001020" stroke="#5ad0ff40" strokeWidth="1.5" />
        <text x="580" y="322" textAnchor="middle" fill="#5ad0ff" fontSize="9" fontWeight="700">Dosiersteuerung</text>
        <text x="580" y="336" textAnchor="middle" fill="#1a5a8a" fontSize="8">trübungsgesteuert</text>
        <text x="580" y="348" textAnchor="middle" fill="#1a5a8a" fontSize="8">oder volumetrisch</text>
        <line x1="580" y1="300" x2="580" y2="265" stroke="#5ad0ff" strokeWidth="1.5" markerEnd="url(#fl-arr)" />

        {/* Hotspot Markers */}
        {HOTSPOTS.map(hs => {
          const active = activeSpot === hs.id;
          const focused = mode.focus.includes(hs.id);
          const op = focused ? 1 : 0.35;
          return (
            <g key={hs.id} onClick={() => setActiveSpot(active ? null : hs.id)} style={{ cursor: 'pointer' }} opacity={op} filter={active ? 'url(#fl-glow)' : undefined}>
              <circle cx={hs.x} cy={hs.y} r={active ? 14 : 11} fill={hs.color + '22'} stroke={hs.color} strokeWidth={active ? 2.5 : 1.5} />
              <text x={hs.x} y={hs.y + 4} textAnchor="middle" fill={hs.color} fontSize="7" fontWeight="800">{hs.short}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function FlockungsmittelDeepDiveView({ darkMode }) {
  const [activeSpot, setActiveSpot] = useState(null);
  const [activeMode, setActiveMode] = useState('prozess');
  const spot = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#4a9eff', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>Flockungsmittel</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>Koagulation, Flockenbildung und Filtration — kolloidale Partikel sichtbar und abfiltrierbar machen</p>

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
        {!spot && <div style={{ color: '#2a5a7a', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>Hotspot anklicken für Details zur Flockungsphase</div>}

        <div style={{ background: '#071828', border: '1px solid #163651', borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 700, color: '#4a9eff', marginBottom: 10, fontSize: 13 }}>Flockungsmittel Vergleich</div>
          {[
            ['Mittel', 'Formel', 'Vorteil', 'Nachteil'],
            ['Aluminiumsulfat', 'Al₂(SO₄)₃', 'günstig, bewährt', 'pH-senkend, enger pH-Bereich'],
            ['PAC', 'AlₙClₘ(OH)ₓ', 'breiter pH-Bereich, schnell', 'teurer als Al-Sulfat'],
            ['Eisen(III)chlorid', 'FeCl₃', 'hocheffektiv', 'stark sauer, Verfärbung'],
          ].map(([a, b, c, d], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr 1.4fr', gap: 6, marginBottom: 5, fontSize: i === 0 ? 11 : 12, color: i === 0 ? '#4a9eff' : '#a0c8e0', fontWeight: i === 0 ? 700 : 400, borderBottom: i === 0 ? '1px solid #163651' : 'none', paddingBottom: i === 0 ? 6 : 0 }}>
              <span>{a}</span><span>{b}</span><span>{c}</span><span>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
