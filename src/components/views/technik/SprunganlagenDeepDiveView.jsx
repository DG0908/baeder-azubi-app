import { useState } from 'react';

const HOTSPOTS = [
  { id: 'brett1m', label: '1-m-Brett', short: '1m', color: '#4a9eff', x: 160, y: 290 },
  { id: 'brett3m', label: '3-m-Brett', short: '3m', color: '#5ad0ff', x: 160, y: 230 },
  { id: 'turm5m', label: '5-m-Plattform', short: '5m', color: '#a070ff', x: 340, y: 180 },
  { id: 'turm10m', label: '10-m-Plattform', short: '10m', color: '#ff7a7a', x: 340, y: 70 },
  { id: 'sicherheit', label: 'Sicherheitszone', short: 'SIZ', color: '#ffd166', x: 580, y: 340 },
  { id: 'pruefung', label: 'Prüfpflichten', short: 'PRÜ', color: '#34c090', x: 650, y: 200 },
];

const HOTSPOT_DATA = {
  brett1m: { title: '1-m-Sprungbrett', color: '#4a9eff', items: ['Bretthöhe: 1,00 m über Wasserspiegel', 'Länge: mind. 4,80 m, Breite: 0,50 m', 'Material: GFK oder Aluminium (federnd)', 'Rutschsicherung: aufgeraute Oberfläche', 'Abstand zur Beckenwand seitlich: mind. 2,75 m', 'FINA: Anzeige Beckenende mind. 5m vorher'] },
  brett3m: { title: '3-m-Sprungbrett', color: '#5ad0ff', items: ['Bretthöhe: 3,00 m über Wasserspiegel', 'Länge: mind. 4,80 m, Breite: 0,50 m', 'Federelastisch — erhöhter Impuls beim Absprung', 'Wasserspiegelfläche unter Brett: mind. 5 × 9 m', 'Wassertiefe direkt unterhalb: mind. 3,50 m', 'Freiraum über Brett: mind. 5 m nach oben'] },
  turm5m: { title: '5-m-Plattform', color: '#a070ff', items: ['Plattformhöhe: 5,00 m über Wasserspiegel', 'Breite: mind. 3,00 m, Tiefe: mind. 5,00 m', 'Nicht federnd — starrer Betonuntergrund', 'Wassertiefe: mind. 4,50 m (FINA)', 'Geländer: seitlich, nicht hinter Absprungkante', 'Beckenbreite min. 21 m bei Turm 5/10 m'] },
  turm10m: { title: '10-m-Plattform', color: '#ff7a7a', items: ['Plattformhöhe: 10,00 m über Wasserspiegel', 'Breite: mind. 3,00 m, Tiefe: mind. 6,00 m', 'Wassertiefe: mind. 5,00 m (FINA)', 'Aufprallgeschwindigkeit: ca. 50 km/h', 'Freiraum seitlich: mind. 3,5 m zur Beckenwand', 'Zugang nur für autorisierte Springer'] },
  sicherheit: { title: 'Sicherheitsbereiche', color: '#ffd166', items: ['Sperrzone während Sprung: alle anderen Springer warten', 'Kein gleichzeitiges Springen mehrerer Personen', 'Sichtlinie Aufsicht → Wasseroberfläche muss frei sein', 'Unterwasserbeobachtung empfohlen (Spiegel/Kamera)', 'Absturzsicherung Treppe: mind. DIN EN 13200', 'Nutzungsfreigabe nach Prüfung gemäß DGUV V70'] },
  prüfung: { title: 'Prüfpflichten & Wartung', color: '#34c090', items: ['Tägliche Sichtkontrolle vor Öffnung (Protokoll!)', 'Jährliche Hauptprüfung durch Sachverständigen', 'Prüfgrundlage: DIN EN 13451-10 (Sprunganlagen)', 'Prüfung nach Instandsetzung oder Umbau', 'Nachweis: Prüfbuch führen (Aufbewahrung 10 J)', 'Festgestellte Mängel: sofortige Sperrung bis Reparatur'] },
};

const MODES = [
  { id: 'aufbau', label: 'Aufbau & Maße', color: '#4a9eff', focus: ['brett1m', 'brett3m', 'turm5m', 'turm10m'] },
  { id: 'sicherheit', label: 'Sicherheit', color: '#ffd166', focus: ['sicherheit', 'pruefung'] },
  { id: 'normen', label: 'Normen & FINA', color: '#34c090', focus: ['turm5m', 'turm10m', 'brett1m', 'brett3m'] },
];

const KENNDATEN = [
  { label: 'Normen', value: 'DIN EN 13451-10, FINA-Regelbuch, DGUV V70' },
  { label: '1-m-Brett Wassertiefe', value: 'mind. 3,00 m direkt unterhalb' },
  { label: '3-m-Brett Wassertiefe', value: 'mind. 3,50 m' },
  { label: '5-m-Turm Wassertiefe', value: 'mind. 4,50 m (FINA)' },
  { label: '10-m-Turm Wassertiefe', value: 'mind. 5,00 m (FINA)' },
  { label: 'Prüfintervall', value: 'Täglich (Sichtkontrolle) + jährlich (Sachverständiger)' },
];

function Diagram({ activeSpot, setActiveSpot, activeMode }) {
  const mode = MODES.find(m => m.id === activeMode) || MODES[0];
  return (
    <div style={{ width: '100%', height: 'clamp(320px, 55vh, 520px)' }}>
      <svg viewBox="0 0 820 420" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="sp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="sp-water" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="#0a1a3a" />
            <path d="M2 10 C8 7 22 7 28 10" fill="none" stroke="#1a4a7a" strokeWidth="1" opacity="0.5" />
            <path d="M2 20 C8 17 22 17 28 20" fill="none" stroke="#1a4a7a" strokeWidth="0.8" opacity="0.3" />
          </pattern>
        </defs>
        <rect x="10" y="8" width="800" height="404" rx="18" fill="#04111f" stroke="#163651" />

        {/* Wasser */}
        <rect x="50" y="340" width="720" height="65" rx="4" fill="url(#sp-water)" />
        <line x1="50" y1="340" x2="770" y2="340" stroke="#1a6fa0" strokeWidth="1.5" strokeDasharray="8,4" opacity="0.6" />
        <text x="400" y="385" textAnchor="middle" fill="#1a5a8a" fontSize="11">BECKEN · min. 5,00 m Wassertiefe (10-m-Turm)</text>

        {/* Turm-Struktur */}
        <rect x="260" y="30" width="80" height="315" fill="#0d1e33" stroke="#1e3a60" strokeWidth="2" />
        {/* Leitern Turm */}
        {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300].map((y, i) => (
          <line key={i} x1="268" y1={y + 15} x2="268" y2={y + 25} stroke="#1a5080" strokeWidth="1.5" />
        ))}

        {/* 10m-Plattform */}
        <rect x="180" y="30" width="200" height="28" rx="3" fill="#1a0a3a" stroke="#ff7a7a" strokeWidth="1.5" />
        <text x="280" y="46" textAnchor="middle" fill="#ff7a7a" fontSize="10" fontWeight="700">10,0 m</text>
        <line x1="280" y1="60" x2="280" y2="340" stroke="#ff7a7a" strokeWidth="0.6" strokeDasharray="4,6" opacity="0.4" />

        {/* 7.5m-Plattform */}
        <rect x="185" y="130" width="190" height="22" rx="3" fill="#1a0a2a" stroke="#c060ff" strokeWidth="1.5" />
        <text x="280" y="145" textAnchor="middle" fill="#c060ff" fontSize="9" fontWeight="700">7,5 m</text>

        {/* 5m-Plattform */}
        <rect x="185" y="183" width="190" height="22" rx="3" fill="#120830" stroke="#a070ff" strokeWidth="1.5" />
        <text x="280" y="198" textAnchor="middle" fill="#a070ff" fontSize="10" fontWeight="700">5,0 m</text>

        {/* Brett-Träger links */}
        <rect x="80" y="274" width="180" height="12" rx="2" fill="#0a2040" stroke="#2a4a7a" strokeWidth="1.5" />
        <rect x="120" y="224" width="140" height="12" rx="2" fill="#0a2040" stroke="#2a4a7a" strokeWidth="1.5" />

        {/* 3m-Brett */}
        <rect x="50" y="210" width="180" height="18" rx="3" fill="#0a1a40" stroke="#5ad0ff" strokeWidth="2" />
        <text x="140" y="223" textAnchor="middle" fill="#5ad0ff" fontSize="10" fontWeight="700">3-m-Brett</text>
        <line x1="140" y1="228" x2="140" y2="340" stroke="#5ad0ff" strokeWidth="0.6" strokeDasharray="4,6" opacity="0.35" />

        {/* 1m-Brett */}
        <rect x="50" y="263" width="180" height="18" rx="3" fill="#0a1a30" stroke="#4a9eff" strokeWidth="2" />
        <text x="140" y="276" textAnchor="middle" fill="#4a9eff" fontSize="10" fontWeight="700">1-m-Brett</text>
        <line x1="140" y1="281" x2="140" y2="340" stroke="#4a9eff" strokeWidth="0.6" strokeDasharray="4,6" opacity="0.35" />

        {/* Höhenmarker links */}
        <line x1="450" y1="340" x2="450" y2="30" stroke="#2a4060" strokeWidth="1" />
        {[{h:1, y:282},{h:3, y:219},{h:5, y:198},{h:'7.5', y:141},{h:10, y:44}].map(({h,y},i) => (
          <g key={i}>
            <line x1="448" y1={y} x2="470" y2={y} stroke="#4a7090" strokeWidth="1" />
            <text x="475" y={y+4} fill="#4a7090" fontSize="9">{h} m</text>
          </g>
        ))}
        <text x="450" y="356" textAnchor="middle" fill="#1a5a8a" fontSize="9">WO</text>

        {/* Sicherheitszone Anzeige */}
        <rect x="500" y="270" width="250" height="75" rx="6" fill="#1a1500" stroke="#ffd16640" strokeWidth="1" strokeDasharray="4,3" />
        <text x="625" y="298" textAnchor="middle" fill="#ffd166" fontSize="10" fontWeight="700">Sicherheitszone</text>
        <text x="625" y="312" textAnchor="middle" fill="#a09040" fontSize="9">Freiraum seitlich ≥ 3,5 m</text>
        <text x="625" y="325" textAnchor="middle" fill="#a09040" fontSize="9">Freiraum oben ≥ 5 m</text>
        <text x="625" y="338" textAnchor="middle" fill="#a09040" fontSize="9">Sperrung bei Belegung</text>

        {/* Prüfsymbol */}
        <rect x="530" y="130" width="200" height="80" rx="6" fill="#001a10" stroke="#34c09040" strokeWidth="1" strokeDasharray="4,3" />
        <text x="630" y="155" textAnchor="middle" fill="#34c090" fontSize="10" fontWeight="700">Prüfpflichten</text>
        <text x="630" y="170" textAnchor="middle" fill="#1a7050" fontSize="9">täglich: Sichtkontrolle</text>
        <text x="630" y="183" textAnchor="middle" fill="#1a7050" fontSize="9">jährlich: Sachverständiger</text>
        <text x="630" y="196" textAnchor="middle" fill="#1a7050" fontSize="9">DIN EN 13451-10</text>

        {/* Hotspot Markers */}
        {HOTSPOTS.map(hs => {
          const active = activeSpot === hs.id;
          const focused = mode.focus.includes(hs.id);
          const op = focused ? 1 : 0.35;
          return (
            <g key={hs.id} onClick={() => setActiveSpot(active ? null : hs.id)} style={{ cursor: 'pointer' }} opacity={op} filter={active ? 'url(#sp-glow)' : undefined}>
              <circle cx={hs.x} cy={hs.y} r={active ? 14 : 11} fill={hs.color + '22'} stroke={hs.color} strokeWidth={active ? 2.5 : 1.5} />
              <text x={hs.x} y={hs.y + 4} textAnchor="middle" fill={hs.color} fontSize="7" fontWeight="800">{hs.short}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function SprunganlagenDeepDiveView({ darkMode }) {
  const [activeSpot, setActiveSpot] = useState(null);
  const [activeMode, setActiveMode] = useState('aufbau');
  const spot = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#4a9eff', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>Sprunganlagen</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>Sprungbretter, Turmplattformen, Sicherheitsbereiche und Prüfpflichten nach DIN EN 13451-10 / FINA</p>

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
        {!spot && <div style={{ color: '#2a5a7a', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>Hotspot im Diagramm anklicken für Details</div>}

        <div style={{ background: '#071828', border: '1px solid #163651', borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 700, color: '#4a9eff', marginBottom: 10, fontSize: 13 }}>Kenndaten & Normung</div>
          {KENNDATEN.map(({ label, value }, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
              <span style={{ color: '#4a9eff', fontWeight: 700, minWidth: 200 }}>{label}</span>
              <span style={{ color: '#a0c8e0' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
