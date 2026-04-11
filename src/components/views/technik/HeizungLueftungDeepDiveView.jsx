import { useState } from 'react';

const HOTSPOTS = [
  { id: 'waermetauscher', label: 'Wärmetauscher', short: 'WT', color: '#ff7a7a', x: 175, y: 290 },
  { id: 'lufterhitzer', label: 'Lufterhitzer / Heizregister', short: 'LH', color: '#ffd166', x: 340, y: 175 },
  { id: 'zuluft', label: 'Zuluft (Hallenversorgung)', short: 'ZUL', color: '#34c090', x: 500, y: 120 },
  { id: 'abluft', label: 'Abluft / Wärmerückgewinnung', short: 'ABL', color: '#4a9eff', x: 500, y: 310 },
  { id: 'entfeuchtung', label: 'Entfeuchtung', short: 'ENT', color: '#a070ff', x: 660, y: 200 },
  { id: 'beckenwasser', label: 'Beckenwasserheizung', short: 'BWH', color: '#5ad0ff', x: 175, y: 175 },
];

const HOTSPOT_DATA = {
  waermetauscher: { title: 'Wärmetauscher (Becken & Halle)', color: '#ff7a7a', items: ['Überträgt Wärme vom Heizmedium auf Beckenwasser oder Luft', 'Typen: Plattenwärmetauscher, Rohrbündelwärmetauscher', 'Heizmedium: Warmwasser (Fernwärme, Erdgas, Wärmepumpe)', 'Wirkungsgrad: > 90 % bei modernen Plattentypen', 'Legionellenschutz: Vorlauftemperatur mind. 60 °C (bei Trinkwasser!)', 'Wartung: jährlich entkalken / inspizieren'] },
  lufterhitzer: { title: 'Lufterhitzer / Heizregister', color: '#ffd166', items: ['Erwärmt die Zuluft auf Solltemperatur (ca. 30–35 °C)', 'Position: im Lüftungsgerät (nach Frischluftfilter)', 'Typen: Warmwasserregister, elektrisch (Notbetrieb)', 'Regelung: Raumtemperatur-Thermostat steuert Ventil', 'Hallenbad: Lufttemperatur ca. 2 °C über Wassertemperatur', 'Vorwärmung Frischluft: verhindert Kondensationsprobleme'] },
  zuluft: { title: 'Zuluft (Frischluftversorgung)', color: '#34c090', items: ['Frischluft von außen → gefiltert → erwärmt → entfeuchtet', 'Zuluft-Menge: mind. 20 m³/h je m² Wasserfläche (VDI 2089)', 'Einblas-Richtung: schräg nach unten, über Wasserfläche', 'Zugerscheinungen vermeiden: Zuluft bodennah oder wandseitig', 'Zuluft-Temperatur: ca. 30–35 °C (im Heizbetrieb)', 'Sommer: Kühlung durch Kältemaschine oder adiabate Kühlung'] },
  abluft: { title: 'Abluft & Wärmerückgewinnung', color: '#4a9eff', items: ['Abluft aus Halle: feuchte, gechlorte Luft', 'Abluftführung: Dachkanäle oder Wandöffnungen (oberer Bereich)', 'Wärmerückgewinnung (WRG): Kreuzströmtauscher oder Rotationswärmer', 'WRG-Effizienz: 60–80 % der Abwärme zurückgewonnen', 'Korrosionsschutz WRG: chlorbeständige Materialien (Edelstahl, PP)', 'Abluft ins Freie: nicht in Räume — Chloramingehalt beachten'] },
  entfeuchtung: { title: 'Entfeuchtung (Klimatisierung)', color: '#a070ff', items: ['Hallenbad-Luft: extrem feucht durch Wasserverdunstung', 'Relative Luftfeuchte Soll: 50–65 % rF (VDI 2089)', 'Entfeuchtung: Kondensation an Kühlfläche (Kältemaschine)', 'Sorptionsentfeuchtung: Silicagel-Rotor (bei sehr hohen Anforderungen)', 'Taupunkt Fensterflächen: Scheibentemperatur > Taupunkt halten', 'Kondensatschäden: feuchte Wände, Decken → Schimmel, Korrosion'] },
  beckenwasser: { title: 'Beckenwasserheizung', color: '#5ad0ff', items: ['Beckenwasser-Solltemperatur: 26–28 °C (Schwimm-/Sportbecken)', 'Therapiebecken: 32–34 °C, Whirlpool: bis 40 °C', 'Wärme über Wärmetauscher im Aufbereitungskreislauf', 'Nachheizung: kontinuierlich (Verdunstungsverluste)', 'Wärmepumpe: nutzt Abwärme aus Hallenlüftung (effizient)', 'Solaranlage: Ergänzung im Freibad (Kostensenkung)'] },
};

const MODES = [
  { id: 'heizung', label: 'Heizung', color: '#ff7a7a', focus: ['waermetauscher', 'lufterhitzer', 'beckenwasser'] },
  { id: 'lueftung', label: 'Lüftung', color: '#34c090', focus: ['zuluft', 'abluft', 'entfeuchtung'] },
  { id: 'klima', label: 'Hallenklima', color: '#a070ff', focus: ['entfeuchtung', 'zuluft', 'lufterhitzer'] },
];

function Diagram({ activeSpot, setActiveSpot, activeMode }) {
  const mode = MODES.find(m => m.id === activeMode) || MODES[0];
  return (
    <div style={{ width: '100%', height: 'clamp(320px, 55vh, 500px)' }}>
      <svg viewBox="0 0 820 420" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="hl-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="hl-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#2a5a8a" />
          </marker>
          <marker id="hl-arr-r" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#ff7a7a" />
          </marker>
        </defs>
        <rect x="10" y="8" width="800" height="404" rx="18" fill="#04111f" stroke="#163651" />

        {/* Halle */}
        <rect x="250" y="60" width="380" height="300" rx="6" fill="#060e1a" stroke="#1a3a5a" strokeWidth="2" />
        <text x="440" y="85" textAnchor="middle" fill="#1a4a7a" fontSize="13" fontWeight="700">SCHWIMMHALLE</text>

        {/* Becken */}
        <rect x="280" y="200" width="320" height="140" rx="4" fill="#0a1a30" stroke="#1a4a7a" strokeWidth="2" />
        <rect x="283" y="203" width="314" height="90" rx="3" fill="#081828" />
        <text x="440" y="255" textAnchor="middle" fill="#1a4a8a" fontSize="11">BECKEN 26–28 °C</text>

        {/* Dampfpfeile über Becken */}
        {[310, 360, 410, 460, 510, 560].map((x, i) => (
          <path key={i} d={`M ${x} 200 Q ${x + 8} 185 ${x} 165`} fill="none" stroke="#5ad0ff" strokeWidth="1" opacity="0.4" />
        ))}
        <text x="440" y="155" textAnchor="middle" fill="#5ad0ff" fontSize="9" opacity="0.7">Verdunstung (Feuchtigkeitseintrag)</text>

        {/* Zuluft Pfeil oben */}
        <line x1="450" y1="60" x2="450" y2="25" stroke="#34c090" strokeWidth="2" markerEnd="url(#hl-arr)" />
        <rect x="350" y="15" width="200" height="20" rx="4" fill="#001510" stroke="#34c09050" />
        <text x="450" y="29" textAnchor="middle" fill="#34c090" fontSize="9" fontWeight="700">Zuluft 30–35 °C von Lüftungsgerät</text>
        {[320,380,440,500,560].map((x, i) => (
          <line key={i} x1={x} y1="60" x2={x} y2="80" stroke="#34c090" strokeWidth="1.5" opacity="0.5" markerEnd="url(#hl-arr)" />
        ))}

        {/* Abluft Pfeil unten */}
        <line x1="440" y1="360" x2="440" y2="395" stroke="#4a9eff" strokeWidth="2" markerEnd="url(#hl-arr)" />
        <text x="440" y="408" textAnchor="middle" fill="#4a9eff" fontSize="9" fontWeight="700">Abluft → WRG → ins Freie</text>

        {/* Lüftungsgerät links */}
        <rect x="40" y="120" width="180" height="200" rx="8" fill="#0a1020" stroke="#2a5080" strokeWidth="2" />
        <text x="130" y="143" textAnchor="middle" fill="#5ad0ff" fontSize="10" fontWeight="700">LÜFTUNGSGERÄT</text>
        {[
          { label: 'Frischluft-Filter', color: '#34c090', y: 155 },
          { label: 'Wärmerückgewinnung', color: '#4a9eff', y: 180 },
          { label: 'Lufterhitzer', color: '#ffd166', y: 205 },
          { label: 'Entfeuchtung', color: '#a070ff', y: 230 },
          { label: 'Zuluftventilator', color: '#5ad0ff', y: 255 },
        ].map((c, i) => (
          <g key={i}>
            <rect x="55" y={c.y - 8} width="150" height="18" rx="3" fill={c.color + '18'} stroke={c.color + '40'} strokeWidth="1" />
            <text x="130" y={c.y + 5} textAnchor="middle" fill={c.color} fontSize="9">{c.label}</text>
          </g>
        ))}

        {/* Leitungen Lüftungsgerät → Halle */}
        <line x1="220" y1="175" x2="250" y2="175" stroke="#ffd166" strokeWidth="2" markerEnd="url(#hl-arr)" />
        <line x1="220" y1="290" x2="250" y2="290" stroke="#4a9eff" strokeWidth="2" />

        {/* Wärmetauscher / Heizung unten */}
        <rect x="40" y="345" width="180" height="50" rx="6" fill="#1a0808" stroke="#ff7a7a60" strokeWidth="1.5" />
        <text x="130" y="365" textAnchor="middle" fill="#ff7a7a" fontSize="9" fontWeight="700">Wärmetauscher</text>
        <text x="130" y="380" textAnchor="middle" fill="#802020" fontSize="8">Fernwärme / Wärmepumpe</text>
        <line x1="130" y1="345" x2="130" y2="320" stroke="#ff7a7a" strokeWidth="2" markerEnd="url(#hl-arr)" />
        <text x="80" y="335" fill="#802020" fontSize="8">Beckenwasser</text>

        {/* Entfeuchtung rechts */}
        <rect x="650" y="150" width="145" height="130" rx="6" fill="#0a0820" stroke="#a070ff50" strokeWidth="1.5" />
        <text x="722" y="173" textAnchor="middle" fill="#a070ff" fontSize="10" fontWeight="700">Hallenklima</text>
        {[
          ['Temperatur', '30–32 °C'],
          ['rel. Feuchte', '50–65 % rF'],
          ['CO₂', '< 1500 ppm'],
          ['Chloramine', 'max. 0,2 mg/m³'],
        ].map(([k, v], i) => (
          <g key={i}>
            <text x="660" y={195 + i * 20} fill="#7050b0" fontSize="8" fontWeight="700">{k}:</text>
            <text x="720" y={195 + i * 20} fill="#a070ff" fontSize="9">{v}</text>
          </g>
        ))}
        <line x1="630" y1="215" x2="650" y2="215" stroke="#a070ff" strokeWidth="1.5" />

        {/* Hotspot Markers */}
        {HOTSPOTS.map(hs => {
          const active = activeSpot === hs.id;
          const focused = mode.focus.includes(hs.id);
          const op = focused ? 1 : 0.35;
          return (
            <g key={hs.id} onClick={() => setActiveSpot(active ? null : hs.id)} style={{ cursor: 'pointer' }} opacity={op} filter={active ? 'url(#hl-glow)' : undefined}>
              <circle cx={hs.x} cy={hs.y} r={active ? 14 : 11} fill={hs.color + '22'} stroke={hs.color} strokeWidth={active ? 2.5 : 1.5} />
              <text x={hs.x} y={hs.y + 4} textAnchor="middle" fill={hs.color} fontSize="7" fontWeight="800">{hs.short}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function HeizungLueftungDeepDiveView({ darkMode }) {
  const [activeSpot, setActiveSpot] = useState(null);
  const [activeMode, setActiveMode] = useState('heizung');
  const spot = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#4a9eff', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>Heizung & Lüftung</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>Beckenwasserheizung, Hallenbelüftung, Wärmerückgewinnung und Entfeuchtung nach VDI 2089</p>

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
          <div style={{ fontWeight: 700, color: '#4a9eff', marginBottom: 10, fontSize: 13 }}>Kenndaten Hallenbad-Klima (VDI 2089)</div>
          {[
            ['Hallenluftemperatur', 'ca. 2 °C über Wassertemperatur'],
            ['Beckenwassertemperatur', '26–28 °C (Schwimmbad)'],
            ['Relative Luftfeuchtigkeit', '50–65 % rF'],
            ['Zuluftmenge', 'mind. 20 m³/(h · m²) Wasserfläche'],
            ['Wärmerückgewinnung', '60–80 % Wirkungsgrad'],
            ['Normen', 'VDI 2089, DIN EN 15780, DIN 1946-2'],
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
