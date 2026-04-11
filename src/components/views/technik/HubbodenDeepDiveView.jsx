import { useState } from 'react';

const HOTSPOTS = [
  { id: 'bodenplatte', label: 'Bodenplatte', short: 'BPL', color: '#4a9eff', x: 400, y: 280 },
  { id: 'antrieb', label: 'Antriebssystem', short: 'ANT', color: '#a070ff', x: 250, y: 330 },
  { id: 'steuerung', label: 'Steuereinheit', short: 'STG', color: '#34c090', x: 660, y: 160 },
  { id: 'sicherung', label: 'Sicherheitseinr.', short: 'SIC', color: '#ffd166', x: 160, y: 200 },
  { id: 'abdichtung', label: 'Wandabdichtung', short: 'ABD', color: '#ff7a7a', x: 570, y: 290 },
  { id: 'wartung', label: 'Wartung & Prüfung', short: 'WAR', color: '#5ad0ff', x: 660, y: 320 },
];

const HOTSPOT_DATA = {
  bodenplatte: { title: 'Hubboden-Platte', color: '#4a9eff', items: ['Stahlbetonplatte oder Stahlrahmenkonstruktion', 'Gesamtgewicht: mehrere Tonnen (je nach Becken)', 'Hubhöhe: 0 – max. Beckentiefe (z.B. 2,00 m)', 'Bodenstruktur: rutschfest, mit Bodenabläufen', 'Einbau: in bestehende Becken nachrüstbar', 'Tragfähigkeit: Personenlast + Wasserdruck'] },
  antrieb: { title: 'Antriebssystem — hydraulisch oder mechanisch', color: '#a070ff', items: [
    '— HYDRAULISCH —',
    'Hydraulikzylinder: 4–8 Stück, Öl-Druckanlage',
    'Hubgeschwindigkeit: ca. 0,3 m/min (sicherheitsbedingt)',
    'Synchronsteuerung: alle Zylinder gleichzeitig',
    'Notabsenkung: bei Stromausfall automatisch (Schwerkraft)',
    '— MECHANISCH (Spindel/Kette) —',
    'Gewindespindeln oder Zahnstangen: elektromotorisch angetrieben',
    'Kettensysteme: umlaufende Rollenkette + Elektromotor',
    'Vorteile mechanisch: kein Hydrauliköl → kein Ölverlust ins Wasser',
    'Synchronsteuerung: mehrere Motoren über SPS gleichlaufgeregelt',
    'Hubgeschwindigkeit: vergleichbar hydraulisch, ca. 0,2–0,4 m/min',
  ]},
  steuerung: { title: 'Steuereinheit (SPS)', color: '#34c090', items: ['Speicherprogrammierbare Steuerung (SPS)', 'Bedienpanel: Schlüsselschalter (Zutritt nur Personal)', 'Positions-Anzeige: aktuelle Tiefe in Echtzeit', 'Fahrmodus: Hoch / Halt / Runter', 'Verriegelung: Betrieb nur bei gesperrtem Becken', 'Protokollierung: alle Fahrbefehle mit Zeitstempel'] },
  sicherung: { title: 'Sicherheitseinrichtungen', color: '#ffd166', items: ['Lichtschranken oder Ultraschall: erkennen Personen im Becken', 'NOT-HALT-Taster: am Beckenrand + am Bedienpanel', 'Einklemm-Schutz: Boden stoppt sofort bei Widerstand', 'Mechanische Endanschläge: verhindert Überfahren', 'Optisch-akustische Warnung: vor jeder Bewegung', 'UVV: Becken muss bei Betrieb gesperrt sein (kein Badebetrieb)'] },
  abdichtung: { title: 'Wandabdichtung / Gleitführung', color: '#ff7a7a', items: ['Umlaufende Dichtlippe zwischen Boden und Wand', 'Material: EPDM-Gummi oder Polyurethan', 'Führungsschienen: seitlich in Beckenwand', 'Reinigung: regelmäßig — verhindert Verkeimung', 'Verschleiß: Inspektion alle 2 Jahre', 'Undichtigkeit → sofortige Außerbetriebnahme'] },
  wartung: { title: 'Wartung & Prüfung', color: '#5ad0ff', items: ['Tägliche Funktionsprüfung vor Öffnung (Protokoll)', 'Hydraulisch: Hydraulikflüssigkeit jährlich wechseln', 'Mechanisch: Ketten/Spindeln schmieren, Verschleiß prüfen', 'Dichtungen und Führungsschienen: Inspektion alle 2 Jahre', 'Prüfung nach DGUV V70 + Herstellervorgaben', 'Einweisung des Bedienpersonals: dokumentiert'] },
};

const MODES = [
  { id: 'aufbau', label: 'Aufbau & Technik', color: '#4a9eff', focus: ['bodenplatte', 'antrieb', 'abdichtung'] },
  { id: 'sicherheit', label: 'Sicherheit', color: '#ffd166', focus: ['sicherung', 'steuerung'] },
  { id: 'betrieb', label: 'Betrieb & Wartung', color: '#34c090', focus: ['steuerung', 'wartung'] },
];

const KENNDATEN = [
  { label: 'Hubhöhe', value: 'Stufenlos: 0 m bis max. Beckentiefe' },
  { label: 'Antrieb hydraulisch', value: 'Hydraulikzylinder (4–8 Stück), Öl-Druckanlage' },
  { label: 'Antrieb mechanisch', value: 'Gewindespindeln, Zahnstangen oder Kettensysteme (Elektromotor)' },
  { label: 'Hubgeschwindigkeit', value: 'ca. 0,2–0,4 m/min (Sicherheitsvorschrift)' },
  { label: 'Steuerung', value: 'SPS mit Schlüsselschalter, NOT-HALT, Synchronlauf' },
  { label: 'Normen', value: 'DGUV V70, EN 13451, Herstellervorgaben' },
  { label: 'Betrieb nur', value: 'Bei gesperrtem Becken — keine Personen im Wasser' },
];

function Diagram({ activeSpot, setActiveSpot, activeMode }) {
  const mode = MODES.find(m => m.id === activeMode) || MODES[0];
  return (
    <div style={{ width: '100%', height: 'clamp(320px, 55vh, 520px)' }}>
      <svg viewBox="0 0 820 420" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="hb-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="hb-water" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill="#081a30" />
            <path d="M2 8 C6 5 18 5 22 8" fill="none" stroke="#1a4a7a" strokeWidth="0.8" opacity="0.5" />
          </pattern>
        </defs>
        <rect x="10" y="8" width="800" height="404" rx="18" fill="#04111f" stroke="#163651" />

        {/* Beckenwände */}
        <rect x="80" y="90" width="480" height="310" rx="3" fill="#061520" stroke="#1a3a5a" strokeWidth="3" />
        {/* Wasser */}
        <rect x="83" y="93" width="474" height="197" rx="2" fill="url(#hb-water)" />
        <text x="320" y="190" textAnchor="middle" fill="#1a5a8a" fontSize="13" fontWeight="700">WASSER</text>
        <text x="320" y="206" textAnchor="middle" fill="#0e3a5a" fontSize="10">variabel je nach Hubposition</text>

        {/* Hubboden Platte */}
        <rect x="83" y="288" width="474" height="22" rx="2" fill="#0d2040" stroke="#4a9eff" strokeWidth="2.5" />
        <text x="320" y="303" textAnchor="middle" fill="#4a9eff" fontSize="10" fontWeight="700">HUBBODEN-PLATTE</text>

        {/* HYDRAULISCH: linke Seite — Zylinder */}
        <text x="148" y="325" textAnchor="middle" fill="#a070ff" fontSize="8" fontWeight="700">HYDRAULISCH</text>
        {[120, 175].map((x, i) => (
          <g key={i}>
            <rect x={x - 8} y={310} width="16" height="68" rx="3" fill="#1a0a3a" stroke="#a070ff" strokeWidth="1.5" />
            <rect x={x - 4} y={305} width="8" height="8" rx="2" fill="#a070ff" opacity="0.7" />
            <line x1={x} y1="378" x2={x} y2="393" stroke="#a070ff" strokeWidth="2" />
          </g>
        ))}
        <text x="148" y="405" textAnchor="middle" fill="#7040c0" fontSize="8">Hydraulikzylinder</text>

        {/* Trennlinie Mitte */}
        <line x1="240" y1="310" x2="240" y2="400" stroke="#1a3a5a" strokeWidth="1" strokeDasharray="4,4" />

        {/* MECHANISCH: rechte Seite — Spindeln + Kette */}
        <text x="360" y="325" textAnchor="middle" fill="#34c090" fontSize="8" fontWeight="700">MECHANISCH</text>
        {/* Spindeln */}
        {[275, 330].map((x, i) => (
          <g key={i}>
            {/* Spindel-Profil (Schraubengewinde angedeutet) */}
            {[0,1,2,3,4,5,6,7].map(j => (
              <rect key={j} x={x - 6} y={310 + j * 9} width="12" height="5" rx="1" fill="#0a2030" stroke="#34c090" strokeWidth="1" opacity="0.8" />
            ))}
            <rect x={x - 3} y={303} width="6" height="10" rx="2" fill="#34c090" opacity="0.9" />
          </g>
        ))}
        <text x="302" y="405" textAnchor="middle" fill="#1a7050" fontSize="8">Spindeln (elektr.)</text>

        {/* Kettensystem rechts */}
        {[400, 455].map((x, i) => (
          <g key={i}>
            {[310, 325, 340, 355, 370, 385].map((y, j) => (
              <rect key={j} x={x - 5} y={y} width="10" height="8" rx="1" fill="#0a1a30" stroke="#ffd166" strokeWidth="1" opacity="0.8" />
            ))}
            <circle cx={x} cy={308} r="8" fill="#0a1510" stroke="#ffd166" strokeWidth="1.5" />
            <circle cx={x} cy={308} r="4" fill="#ffd166" opacity="0.5" />
          </g>
        ))}
        <text x="428" y="405" textAnchor="middle" fill="#a09030" fontSize="8">Kettensystem (elektr.)</text>

        {/* Dichtlippe Wand */}
        <rect x="77" y="280" width="10" height="30" rx="2" fill="#2a0a0a" stroke="#ff7a7a" strokeWidth="1.5" />
        <rect x="553" y="280" width="10" height="30" rx="2" fill="#2a0a0a" stroke="#ff7a7a" strokeWidth="1.5" />
        <text x="70" y="278" textAnchor="end" fill="#ff7a7a" fontSize="8">Dichtlippe</text>

        {/* Wasserstand Marker */}
        <line x1="580" y1="93" x2="580" y2="290" stroke="#4a9eff" strokeWidth="1" strokeDasharray="3,4" opacity="0.4" />
        <text x="592" y="98" fill="#4a9eff" fontSize="9">WO</text>
        <text x="592" y="294" fill="#4a9eff" fontSize="9">HB</text>
        <line x1="578" y1="93" x2="590" y2="93" stroke="#4a9eff" strokeWidth="1.5" />
        <line x1="578" y1="290" x2="590" y2="290" stroke="#4a9eff" strokeWidth="1.5" />
        <text x="635" y="195" textAnchor="middle" fill="#4a9eff" fontSize="11" fontWeight="700">Hubhöhe</text>
        <text x="635" y="210" textAnchor="middle" fill="#4a9eff" fontSize="11">≈ 2,00 m</text>

        {/* Steuereinheit */}
        <rect x="620" y="90" width="160" height="95" rx="6" fill="#001a10" stroke="#34c09050" strokeWidth="1.5" />
        <text x="700" y="110" textAnchor="middle" fill="#34c090" fontSize="10" fontWeight="700">Steuereinheit SPS</text>
        <rect x="635" y="118" width="30" height="18" rx="3" fill="#0a3020" stroke="#34c090" strokeWidth="1" />
        <text x="650" y="131" textAnchor="middle" fill="#34c090" fontSize="8">KEY</text>
        <rect x="675" y="118" width="18" height="18" rx="9" fill="#ff3030" stroke="#ff6060" strokeWidth="1.5" />
        <text x="684" y="131" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">!</text>
        <text x="700" y="154" textAnchor="middle" fill="#1a7050" fontSize="8">Schlüsselschalter</text>
        <text x="700" y="166" textAnchor="middle" fill="#1a7050" fontSize="8">NOT-HALT</text>
        <text x="700" y="178" textAnchor="middle" fill="#1a7050" fontSize="8">Synchronlauf-Regelung</text>

        {/* Hotspot Markers */}
        {HOTSPOTS.map(hs => {
          const active = activeSpot === hs.id;
          const focused = mode.focus.includes(hs.id);
          const op = focused ? 1 : 0.35;
          return (
            <g key={hs.id} onClick={() => setActiveSpot(active ? null : hs.id)} style={{ cursor: 'pointer' }} opacity={op} filter={active ? 'url(#hb-glow)' : undefined}>
              <circle cx={hs.x} cy={hs.y} r={active ? 14 : 11} fill={hs.color + '22'} stroke={hs.color} strokeWidth={active ? 2.5 : 1.5} />
              <text x={hs.x} y={hs.y + 4} textAnchor="middle" fill={hs.color} fontSize="7" fontWeight="800">{hs.short}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function HubbodenDeepDiveView({ darkMode }) {
  const [activeSpot, setActiveSpot] = useState(null);
  const [activeMode, setActiveMode] = useState('aufbau');
  const spot = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#4a9eff', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>Hubboden</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>Verstellbarer Beckenboden — hydraulischer und mechanischer Antrieb, Steuerung, Sicherheit</p>

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
              <div key={i} style={{
                display: 'flex', gap: 8, marginBottom: 4, fontSize: 13,
                color: it.startsWith('— ') ? spot.color : '#c8e8ff',
                fontWeight: it.startsWith('— ') ? 700 : 400,
              }}>
                {!it.startsWith('— ') && <span style={{ color: spot.color }}>→</span>}
                <span>{it}</span>
              </div>
            ))}
          </div>
        )}
        {!spot && <div style={{ color: '#2a5a7a', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>Hotspot im Diagramm anklicken für Details</div>}

        {/* Antriebsvergleich */}
        <div style={{ background: '#071828', border: '1px solid #163651', borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <div style={{ fontWeight: 700, color: '#a070ff', marginBottom: 10, fontSize: 13 }}>Antriebsarten im Vergleich</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 6, fontSize: 11, color: '#4a9eff', fontWeight: 700, borderBottom: '1px solid #163651', paddingBottom: 6 }}>
            <span>Merkmal</span><span style={{ color: '#a070ff' }}>Hydraulisch</span><span style={{ color: '#34c090' }}>Mechanisch</span>
          </div>
          {[
            ['Antrieb', 'Hydraulikzylinder + Drucköl', 'Spindeln / Ketten + Elektromotor'],
            ['Ölgefahr', 'Ja — Leckage ins Becken möglich', 'Nein — kein Hydrauliköl'],
            ['Wartung', 'Öl wechseln, Zylinderdichtungen', 'Kette/Spindel schmieren, Verschleiß'],
            ['Notabsenkung', 'Automatisch (Schwerkraft)', 'Elektromotor-Rückfahrt oder manuell'],
            ['Geräusch', 'Leiser', 'Etwas lauter (Motorgeräusch)'],
            ['Verbreitung', 'Langjährig bewährt', 'Zunehmend modern (ökofreundlich)'],
          ].map(([a, b, c], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 5, fontSize: 12 }}>
              <span style={{ color: '#4a9eff', fontWeight: 700 }}>{a}</span>
              <span style={{ color: '#a0c8e0' }}>{b}</span>
              <span style={{ color: '#a0c8e0' }}>{c}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#071828', border: '1px solid #163651', borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 700, color: '#4a9eff', marginBottom: 10, fontSize: 13 }}>Kenndaten</div>
          {KENNDATEN.map(({ label, value }, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
              <span style={{ color: '#4a9eff', fontWeight: 700, minWidth: 210 }}>{label}</span>
              <span style={{ color: '#a0c8e0' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
