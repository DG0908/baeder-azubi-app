import { useState } from 'react';

const HOTSPOTS = [
  { id: 'sensor', label: 'Messsonde', short: 'SND', color: '#4a9eff', x: 160, y: 190 },
  { id: 'transmitter', label: 'Messumformer', short: 'TRM', color: '#5ad0ff', x: 280, y: 190 },
  { id: 'regler', label: 'Regler (SPS/MSR)', short: 'REG', color: '#a070ff', x: 400, y: 190 },
  { id: 'dosierpumpe', label: 'Dosierpumpe', short: 'DOP', color: '#34c090', x: 530, y: 190 },
  { id: 'sollwerte', label: 'Sollwerte DIN', short: 'SOL', color: '#ffd166', x: 400, y: 340 },
  { id: 'alarm', label: 'Alarm & Notabschaltung', short: 'ALM', color: '#ff7a7a', x: 650, y: 280 },
];

const HOTSPOT_DATA = {
  sensor: { title: 'Messsonden (Sensoren)', color: '#4a9eff', items: ['pH-Elektrode: Glaselektrode (potentiometrisch)', 'Redox-Elektrode: Platin-Elektrode + Ag/AgCl-Referenz', 'Chlor-Sensor: amperometrisch (Membranelektrode)', 'Temperaturfühler: Pt100 oder NTC', 'Leitfähigkeits-Sensor: induktiv oder 4-Pol', 'Einbau: Durchflussmesszelle (bypass aus Rohrnetz)'] },
  transmitter: { title: 'Messumformer / Transmitter', color: '#5ad0ff', items: ['Wandelt Messgröße in Einheitssignal um (4–20 mA / 0–10 V)', 'Verstärkt schwaches Sensorsignal', 'Digitale Ausgabe: Modbus, Profibus möglich', 'Display: zeigt Istwert, Alarmstatus, Fehlercodes', 'Kalibrierung: direkt am Gerät oder per Software', 'Temperaturkompensation: korrigiert pH/Redox automatisch'] },
  regler: { title: 'Regler (SPS / MSR-Technik)', color: '#a070ff', items: ['Vergleicht Istwert mit Sollwert → Regelabweichung', 'PI- oder PID-Regler: schnelle, präzise Reaktion', 'Ausgang: Steuersignal an Dosierpumpe (Hub/Frequenz)', 'Speicherprogrammierbare Steuerung (SPS): mehrere Kanäle', 'Grenzwert-Überwachung: Alarm bei Über-/Unterschreitung', 'Datenspeicherung: Trend, Protokoll, Störmeldungen'] },
  dosierpumpe: { title: 'Stellglied: Dosierpumpe', color: '#34c090', items: ['Empfängt Stellsignal vom Regler', 'Membrandosierpumpe: präzise Hubvolumen-Dosierung', 'Peristaltikpumpe: für aggressive Chemikalien', 'Dosierrate: 0–100 % einstellbar (Hub × Frequenz)', 'Saugventil + Druckventil: verhindern Rückfluss', 'Durchflussmessung nach Pumpe: Sicherheitscheck'] },
  sollwerte: { title: 'Sollwerte nach DIN 19643', color: '#ffd166', items: ['pH: 6,5–7,8 nach DIN 19643-1 (optimal 6,8–7,2)', 'Freies Chlor: 0,3–0,6 mg/L (Halle) / bis 1,0 mg/L (Freibad)', 'Gebundenes Chlor: ≤ 0,2 mg/L', 'Redox-Spannung: ≥ 750 mV', 'Wassertemperatur Hallen: 26–28 °C', 'KS4,3 (Säurekapazität): 0,7–2,0 mol/m³'] },
  alarm: { title: 'Alarm & Notabschaltung', color: '#ff7a7a', items: ['Grenzwertalarm: optisch + akustisch (Hupton)', 'Untergrenze Redox < 700 mV: automatische Sperrung (Badebetrieb)', 'Überchlorung: > 1,5 mg/L freies Chlor → Alarm', 'Leckage-Detektion: Chemikalien-Raum', 'Notabschaltung Chlorgasanlage: bei Gasdetektion sofort', 'Fernüberwachung: Alarm per Mobilfunk / Netzwerk möglich'] },
};

const MODES = [
  { id: 'regelkreis', label: 'Regelkreis', color: '#4a9eff', focus: ['sensor', 'transmitter', 'regler', 'dosierpumpe'] },
  { id: 'sollwerte', label: 'Sollwerte', color: '#ffd166', focus: ['sollwerte', 'regler'] },
  { id: 'sicherheit', label: 'Alarm & Sicherheit', color: '#ff7a7a', focus: ['alarm', 'regler'] },
];

function Diagram({ activeSpot, setActiveSpot, activeMode }) {
  const mode = MODES.find(m => m.id === activeMode) || MODES[0];
  return (
    <div style={{ width: '100%', height: 'clamp(300px, 50vh, 460px)' }}>
      <svg viewBox="0 0 820 400" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="mr-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="mr-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#2a5a8a" />
          </marker>
          <marker id="mr-arr-r" markerWidth="7" markerHeight="7" refX="1" refY="3.5" orient="auto">
            <polygon points="7 0, 0 3.5, 7 7" fill="#a070ff" />
          </marker>
        </defs>
        <rect x="10" y="8" width="800" height="384" rx="18" fill="#04111f" stroke="#163651" />

        {/* Becken links */}
        <rect x="30" y="140" width="100" height="100" rx="5" fill="#081828" stroke="#1a4a7a" strokeWidth="2" />
        <rect x="33" y="143" width="94" height="60" rx="3" fill="#0a2040" />
        <text x="80" y="173" textAnchor="middle" fill="#4a9eff" fontSize="10" fontWeight="700">BECKEN</text>
        <text x="80" y="186" textAnchor="middle" fill="#1a4a7a" fontSize="8">Messstelle</text>

        {/* Messzelle bypass */}
        <rect x="130" y="158" width="60" height="60" rx="4" fill="#0a1830" stroke="#4a9eff" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="160" y="183" textAnchor="middle" fill="#4a9eff" fontSize="8">Mess-</text>
        <text x="160" y="195" textAnchor="middle" fill="#4a9eff" fontSize="8">zelle</text>
        <line x1="100" y1="185" x2="130" y2="185" stroke="#4a9eff" strokeWidth="1.5" markerEnd="url(#mr-arr)" />

        {/* Regelkreis Boxen */}
        {[
          { x: 130, y: 140, label: 'Sensor', sub: 'pH / Cl / Redox', color: '#4a9eff' },
          { x: 255, y: 140, label: 'Transmitter', sub: '4–20 mA', color: '#5ad0ff' },
          { x: 375, y: 140, label: 'Regler SPS', sub: 'Soll ↔ Ist', color: '#a070ff' },
          { x: 505, y: 140, label: 'Dosierpumpe', sub: 'Stellglied', color: '#34c090' },
        ].map((box, i) => (
          <g key={i}>
            <rect x={box.x + 5} y={box.y + 30} width={110} height={50} rx="6" fill={box.color + '18'} stroke={box.color + '60'} strokeWidth="1.5" />
            <text x={box.x + 60} y={box.y + 60} textAnchor="middle" fill={box.color} fontSize="10" fontWeight="700">{box.label}</text>
            <text x={box.x + 60} y={box.y + 73} textAnchor="middle" fill={box.color} fontSize="8">{box.sub}</text>
          </g>
        ))}

        {/* Vorwärtspfeile */}
        <line x1="245" y1="165" x2="260" y2="165" stroke="#2a5a8a" strokeWidth="2" markerEnd="url(#mr-arr)" />
        <line x1="370" y1="165" x2="380" y2="165" stroke="#2a5a8a" strokeWidth="2" markerEnd="url(#mr-arr)" />
        <line x1="490" y1="165" x2="510" y2="165" stroke="#2a5a8a" strokeWidth="2" markerEnd="url(#mr-arr)" />

        {/* Rückkopplungsschleife */}
        <path d="M 620 165 Q 620 100 400 100 Q 180 100 160 160" fill="none" stroke="#a070ff" strokeWidth="1.5" strokeDasharray="5,4" markerEnd="url(#mr-arr-r)" />
        <text x="400" y="94" textAnchor="middle" fill="#a070ff" fontSize="9">Rückkopplung (Istwert)</text>

        {/* Chemikalien → Becken */}
        <rect x="630" y="140" width="80" height="50" rx="5" fill="#0a1a0a" stroke="#34c09060" strokeWidth="1.5" />
        <text x="670" y="162" textAnchor="middle" fill="#34c090" fontSize="9">Chemi-</text>
        <text x="670" y="174" textAnchor="middle" fill="#34c090" fontSize="9">kalie</text>
        <line x1="615" y1="165" x2="630" y2="165" stroke="#34c090" strokeWidth="1.5" markerEnd="url(#mr-arr)" />
        <path d="M 670 190 Q 670 220 400 230 Q 150 230 80 230" fill="none" stroke="#34c090" strokeWidth="1.5" strokeDasharray="4,4" markerEnd="url(#mr-arr)" />
        <text x="390" y="248" textAnchor="middle" fill="#1a7050" fontSize="9">Chemikalie → Becken</text>

        {/* Alarm Box */}
        <rect x="630" y="260" width="140" height="80" rx="6" fill="#1a0a0a" stroke="#ff7a7a50" strokeWidth="1.5" />
        <text x="700" y="285" textAnchor="middle" fill="#ff7a7a" fontSize="10" fontWeight="700">Alarm / Notabschaltung</text>
        <text x="700" y="300" textAnchor="middle" fill="#802020" fontSize="9">Grenzwert → optisch</text>
        <text x="700" y="313" textAnchor="middle" fill="#802020" fontSize="9">+ akustisch + Abschaltung</text>
        <line x1="430" y1="190" x2="700" y2="260" stroke="#ff7a7a" strokeWidth="1" strokeDasharray="3,4" opacity="0.5" />

        {/* Sollwerte Box */}
        <rect x="310" y="295" width="180" height="70" rx="6" fill="#1a1500" stroke="#ffd16650" strokeWidth="1.5" />
        <text x="400" y="315" textAnchor="middle" fill="#ffd166" fontSize="10" fontWeight="700">Sollwerte (DIN 19643)</text>
        <text x="400" y="330" textAnchor="middle" fill="#a09030" fontSize="9">pH 6,5–7,8 | Cl 0,3–0,6 mg/L</text>
        <text x="400" y="343" textAnchor="middle" fill="#a09030" fontSize="9">Redox ≥ 750 mV | T 26–28 °C</text>
        <line x1="400" y1="295" x2="400" y2="193" stroke="#ffd166" strokeWidth="1" strokeDasharray="3,4" opacity="0.5" />

        {/* Hotspot Markers */}
        {HOTSPOTS.map(hs => {
          const active = activeSpot === hs.id;
          const focused = mode.focus.includes(hs.id);
          const op = focused ? 1 : 0.35;
          return (
            <g key={hs.id} onClick={() => setActiveSpot(active ? null : hs.id)} style={{ cursor: 'pointer' }} opacity={op} filter={active ? 'url(#mr-glow)' : undefined}>
              <circle cx={hs.x} cy={hs.y} r={active ? 14 : 11} fill={hs.color + '22'} stroke={hs.color} strokeWidth={active ? 2.5 : 1.5} />
              <text x={hs.x} y={hs.y + 4} textAnchor="middle" fill={hs.color} fontSize="7" fontWeight="800">{hs.short}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function MessRegeltechnikDeepDiveView({ darkMode }) {
  const [activeSpot, setActiveSpot] = useState(null);
  const [activeMode, setActiveMode] = useState('regelkreis');
  const spot = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#4a9eff', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>Mess- und Regeltechnik</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>Geschlossener Regelkreis: Sensor → Transmitter → Regler → Dosierpumpe → Beckenwasser</p>

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
        {!spot && <div style={{ color: '#2a5a7a', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>Hotspot anklicken für Details zur Messgröße oder Komponente</div>}

        <div style={{ background: '#071828', border: '1px solid #163651', borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 700, color: '#4a9eff', marginBottom: 10, fontSize: 13 }}>Regelgrößen im Überblick</div>
          {[
            ['Regelgröße', 'Sensor', 'Sollwert', 'Stellglied'],
            ['pH-Wert', 'Glaselektrode', '6,5–7,8', 'HCl- oder CO₂-Pumpe'],
            ['Freies Chlor', 'Membran-Elektrode', '0,3–0,6 mg/L', 'Chlor-Dosierpumpe'],
            ['Redox-Spannung', 'Pt-Elektrode', '≥ 750 mV', 'Chlor-Dosierpumpe'],
            ['Temperatur', 'Pt100 / NTC', '26–28 °C', 'Wärmetauscher'],
          ].map(([a, b, c, d], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr 1.5fr', gap: 6, marginBottom: 5, fontSize: i === 0 ? 11 : 12, color: i === 0 ? '#4a9eff' : '#a0c8e0', fontWeight: i === 0 ? 700 : 400, borderBottom: i === 0 ? '1px solid #163651' : 'none', paddingBottom: i === 0 ? 6 : 0 }}>
              <span>{a}</span><span>{b}</span><span>{c}</span><span>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
