import { useState } from 'react';

const HOTSPOTS = [
  { id: 'sportbecken', label: 'Sportbecken', short: 'SPO', color: '#4a9eff', x: 200, y: 200 },
  { id: 'springergrube', label: 'Sprungbecken', short: 'SPR', color: '#a070ff', x: 490, y: 240 },
  { id: 'plansch', label: 'Planschbecken', short: 'PLN', color: '#34c090', x: 700, y: 330 },
  { id: 'skimmer', label: 'Skimmer / Überlauf', short: 'SKI', color: '#ffd166', x: 120, y: 160 },
  { id: 'bodenablauf', label: 'Bodenablauf', short: 'BOD', color: '#ff7a7a', x: 200, y: 310 },
  { id: 'einstieg', label: 'Treppen / Einstieg', short: 'EIN', color: '#5ad0ff', x: 370, y: 320 },
];

const HOTSPOT_DATA = {
  sportbecken: { title: 'Sportbecken (Wettkampfbecken)', color: '#4a9eff', items: ['Länge: 50 m (Langbahn) oder 25 m (Kurzbahn)', 'Breite: mind. 21 m (8 Bahnen à 2,5 m)', 'Tiefe: mind. 1,80 m (gleichmäßig) für Wettkampf', 'Wassertiefe Startbereich: mind. 1,35 m', 'Bahnmarkierung: blaue Linien am Beckenboden'] },
  springergrube: { title: 'Sprungbecken', color: '#a070ff', items: ['Tiefe: abhängig von Sprunghöhe — 5 m Turm: mind. 4,50 m', '10 m Turm: mind. 5,00 m Wassertiefe', 'Grundfläche: mind. 25 m × 21 m', 'Unterströmung / Beruhigung: verhindert Wellenstau', 'Separate Beckenaufbereitung empfohlen'] },
  plansch: { title: 'Planschbecken / Kinderbecken', color: '#34c090', items: ['Wassertiefe: max. 0,35 m für Kleinkinder', 'Max. 0,60 m für ältere Kinder', 'Bodenneigung: gleichmäßig flach ansteigend', 'Eigener Aufbereitungskreislauf (höherer Keimstress)', 'Erhöhte Chlorung wegen Körperpflegemittel'] },
  skimmer: { title: 'Skimmer / Überlauffrinne', color: '#ffd166', items: ['Skimmer: punktuelle Wasserabnahme an der Oberfläche', 'Überlauffrinne (Rinne): umlaufend — gleichmäßigere Abnahme', 'Nimmt Oberflächenfilm (Tenside, Öle) auf', 'Skimmer-Korb regelmäßig reinigen', 'Rinnenwasser geht in Ausgleichsbehälter'] },
  bodenablauf: { title: 'Bodenablauf', color: '#ff7a7a', items: ['Wasserabnahme vom Beckenboden', 'Verhindert Totzonen und Temperaturschichtung', 'Meist kombiniert mit Umwälzkreislauf', 'Rost/Gitter: Kindersicherheit beachten (DIN-Norm)', 'Saugöffnungen: mind. 2 separate (Sicherheit)'] },
  einstieg: { title: 'Treppen & Einstieg', color: '#5ad0ff', items: ['Treppen: min. 0,80 m breit, rutschfeste Stufen', 'Geländer: beidseitig, bis ins Wasser', 'Leitern: versenkt in Beckenwand, kein Überstand', 'Einstiegstiefe: erste Stufe max. 0,40 m unter WO', 'Barrierefreiheit: Lifter oder Rampe vorschreiben'] },
};

const MODES = [
  { id: 'typen', label: 'Beckentypen', color: '#4a9eff', focus: ['sportbecken', 'springergrube', 'plansch'] },
  { id: 'hydraulik', label: 'Wasserhygiene', color: '#34c090', focus: ['skimmer', 'bodenablauf'] },
  { id: 'sicherheit', label: 'Einstieg & Sicherheit', color: '#ff7a7a', focus: ['einstieg', 'bodenablauf'] },
];

const KENNDATEN = [
  { label: 'Normung', value: 'DIN 19643, FINA-Regeln, DIN 18032' },
  { label: 'Sportbecken 50 m', value: '50 × 21 m, 8 Bahnen, ≥ 1,80 m tief' },
  { label: 'Sportbecken 25 m', value: '25 × 12,5–21 m, ≥ 1,80 m tief' },
  { label: 'Sprungbecken', value: 'Nach Sprunghöhe: 5 m → 4,5 m Tiefe; 10 m → 5,0 m' },
  { label: 'Planschbecken', value: 'Max. 0,35–0,60 m, eigener Kreislauf' },
  { label: 'Überlauffrinne', value: 'Umlaufend, gleichmäßige Oberflächenabnahme' },
];

function Diagram({ activeSpot, setActiveSpot, activeMode }) {
  const mode = MODES.find(m => m.id === activeMode) || MODES[0];
  return (
    <div style={{ width: '100%', height: 'clamp(320px, 55vh, 520px)' }}>
      <svg viewBox="0 0 820 420" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="bk-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect x="10" y="8" width="800" height="404" rx="18" fill="#04111f" stroke="#163651" />

        {/* Sportbecken (50m dargestellt als 25m) */}
        <rect x="60" y="130" width="290" height="200" rx="4" fill="#0a2a4a" stroke="#1e5080" strokeWidth="2" />
        <rect x="60" y="130" width="290" height="180" rx="4" fill="url(#bk-water)" />
        <defs>
          <pattern id="bk-water" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="#0a2a4a" />
            <path d="M2 10 C8 7 22 7 28 10" fill="none" stroke="#1a5a8a" strokeWidth="1" opacity="0.6" />
            <path d="M2 20 C8 17 22 17 28 20" fill="none" stroke="#1a5a8a" strokeWidth="0.8" opacity="0.4" />
          </pattern>
        </defs>
        {/* Bahnenlinien */}
        {[90, 120, 150, 180, 210, 240, 270, 300].map((x, i) => (
          <line key={i} x1={x} y1="135" x2={x} y2="305" stroke="#1a6fa0" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.7" />
        ))}
        {/* Bodenmarkierung */}
        <line x1="205" y1="310" x2="205" y2="290" stroke="#4a9eff" strokeWidth="3" opacity="0.8" />
        <text x="205" y="325" textAnchor="middle" fill="#4a9eff" fontSize="10" fontWeight="700">T-Marke</text>
        <text x="205" y="145" textAnchor="middle" fill="#84aeca" fontSize="11" fontWeight="700">SPORTBECKEN (50/25 m)</text>
        <text x="205" y="160" textAnchor="middle" fill="#4a8fb0" fontSize="9">8 Bahnen · ≥ 1,80 m tief</text>
        {/* Tiefe Marker */}
        <text x="68" y="200" fill="#ffd166" fontSize="9" fontWeight="700">≥1,80m</text>
        <line x1="75" y1="135" x2="75" y2="305" stroke="#ffd166" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />

        {/* Sprungbecken */}
        <rect x="390" y="110" width="200" height="240" rx="4" fill="#0a2040" stroke="#2a1a6a" strokeWidth="2" />
        <rect x="390" y="110" width="200" height="220" rx="4" fill="#0a1a3a" />
        {/* Turm */}
        <rect x="480" y="30" width="20" height="80" fill="#1a2a4a" stroke="#3a4a7a" />
        <rect x="470" y="65" width="40" height="8" fill="#4a5a9a" rx="2" />
        <rect x="465" y="45" width="50" height="8" fill="#5a6aaa" rx="2" />
        <rect x="460" y="30" width="60" height="8" fill="#6a7aba" rx="2" />
        <text x="520" y="40" fill="#a070ff" fontSize="8" fontWeight="700">10m</text>
        <text x="520" y="54" fill="#a070ff" fontSize="8">7,5m</text>
        <text x="520" y="74" fill="#c090ff" fontSize="8">5m</text>
        <text x="490" y="125" textAnchor="middle" fill="#a070ff" fontSize="11" fontWeight="700">SPRUNGBECKEN</text>
        <text x="490" y="140" textAnchor="middle" fill="#7050b0" fontSize="9">≥ 4,50–5,00 m tief</text>
        <text x="400" y="195" fill="#ffd166" fontSize="9">Tiefe</text>
        <text x="400" y="207" fill="#ffd166" fontSize="9" fontWeight="700">5,0 m</text>

        {/* Planschbecken */}
        <path d="M 635 310 Q 635 290 740 285 Q 800 285 800 295 L 800 370 Q 800 380 740 380 Q 635 380 635 370 Z" fill="#0a2a1a" stroke="#1a5a3a" strokeWidth="2" />
        <text x="717" y="330" textAnchor="middle" fill="#34c090" fontSize="11" fontWeight="700">PLANSCHBECKEN</text>
        <text x="717" y="345" textAnchor="middle" fill="#1a7050" fontSize="9">max. 0,35–0,60 m</text>

        {/* Skimmer */}
        <rect x="58" y="118" width="50" height="14" rx="3" fill="#2a2a00" stroke="#ffd166" strokeWidth="1.5" />
        <text x="83" y="128" textAnchor="middle" fill="#ffd166" fontSize="8" fontWeight="700">SKIMMER</text>

        {/* Bodenablauf */}
        <circle cx="200" cy="310" r="8" fill="#2a0a0a" stroke="#ff7a7a" strokeWidth="1.5" />
        <text x="200" y="314" textAnchor="middle" fill="#ff7a7a" fontSize="7" fontWeight="700">AB</text>

        {/* Treppe */}
        {[0, 1, 2].map(i => (
          <rect key={i} x={355 + i * 8} y={265 - i * 12} width="8" height={i * 12 + 12} fill="#1a3a5a" stroke="#5ad0ff" strokeWidth="1" />
        ))}

        {/* Hotspot Markers */}
        {HOTSPOTS.map(hs => {
          const active = activeSpot === hs.id;
          const focused = mode.focus.includes(hs.id);
          const op = focused ? 1 : 0.4;
          return (
            <g key={hs.id} onClick={() => setActiveSpot(active ? null : hs.id)} style={{ cursor: 'pointer' }} opacity={op} filter={active ? 'url(#bk-glow)' : undefined}>
              <circle cx={hs.x} cy={hs.y} r={active ? 14 : 11} fill={hs.color + '22'} stroke={hs.color} strokeWidth={active ? 2.5 : 1.5} />
              <text x={hs.x} y={hs.y + 4} textAnchor="middle" fill={hs.color} fontSize="7" fontWeight="800">{hs.short}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function BeckenartenDeepDiveView({ darkMode }) {
  const [activeSpot, setActiveSpot] = useState(null);
  const [activeMode, setActiveMode] = useState('typen');
  const spot = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#4a9eff', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>Beckenarten & Einrichtungen</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>Beckentypen, Abmessungen, Wasserführung und Ausstattung nach DIN/FINA</p>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setActiveMode(m.id)} style={{
              padding: '5px 14px', borderRadius: 20, border: `1px solid ${m.color}60`, cursor: 'pointer', fontSize: 12, fontWeight: 700,
              background: activeMode === m.id ? m.color + '30' : '#0a1a2a', color: activeMode === m.id ? m.color : '#4a7a9a',
            }}>{m.label}</button>
          ))}
        </div>

        {/* Diagram */}
        <div style={{ background: '#04111f', border: '1px solid #163651', borderRadius: 16, marginBottom: 14, overflow: 'hidden' }}>
          <Diagram activeSpot={activeSpot} setActiveSpot={setActiveSpot} activeMode={activeMode} />
        </div>

        {/* Hotspot Detail */}
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
        {!spot && <div style={{ color: '#2a5a7a', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>Hotspot im Diagramm anklicken für Details</div>}

        {/* Kenndaten */}
        <div style={{ background: '#071828', border: '1px solid #163651', borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 700, color: '#4a9eff', marginBottom: 10, fontSize: 13 }}>Kenndaten & Normung</div>
          {KENNDATEN.map(({ label, value }, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
              <span style={{ color: '#4a9eff', fontWeight: 700, minWidth: 170 }}>{label}</span>
              <span style={{ color: '#a0c8e0' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
