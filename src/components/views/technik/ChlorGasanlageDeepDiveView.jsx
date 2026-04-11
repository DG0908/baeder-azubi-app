import { useState } from 'react';

const HOTSPOTS = [
  { id: 'chlorgasflasche', label: 'Chlorgasflasche', short: 'CL2', color: '#ff7a7a', x: 135, y: 240 },
  { id: 'druckminderer', label: 'Druckminderer', short: 'DRM', color: '#ffd166', x: 255, y: 200 },
  { id: 'vakuumregler', label: 'Vakuumregler', short: 'VAK', color: '#a070ff', x: 380, y: 200 },
  { id: 'injector', label: 'Injektor / Dosierung', short: 'INJ', color: '#34c090', x: 510, y: 200 },
  { id: 'gasdetektor', label: 'Gasdetektor', short: 'DET', color: '#5ad0ff', x: 650, y: 150 },
  { id: 'raum', label: 'Chlorgasraum', short: 'RUM', color: '#ff9a30', x: 650, y: 320 },
];

const HOTSPOT_DATA = {
  chlorgasflasche: { title: 'Chlorgasflasche', color: '#ff7a7a', items: ['Inhalt: 70 kg Cl₂ (Druckgas, verflüssigt)', 'Betriebsdruck: ca. 6–8 bar (Außentemperatur abhängig)', 'Farbe: grün (RAL 6017) nach EN 1089-3', 'Aufbewahrung: stehend, gesichert gegen Umfallen', 'Max. Entnahme: 15 % des Flascheninhalts/Stunde', 'Lagerung: max. 3 Flaschen im Chlorgasraum (Richtwert)'] },
  druckminderer: { title: 'Druckminderer / Absperrventil', color: '#ffd166', items: ['Reduziert Flaschendruck auf Arbeitsdruck', 'Arbeitsdruck: ca. 0,5–1,0 bar', 'Absperrventil: handbetätigt, vor Druckminderer', 'Sicherheitsventil: öffnet bei Überdruck', 'Werkzeug: nur Spezialschlüssel — kein Rohrschlüssel!', 'Leckagetest: Ammoniak-Flasche (weißer Rauch bei Cl₂)'] },
  vakuumregler: { title: 'Vakuumregler (Sicherheitsventil)', color: '#a070ff', items: ['Schlüsselkomponente der Sicherheit', 'Arbeitet im Unterdruck (Vakuum) — kein Überdruck möglich', 'Prinzip: Injektor erzeugt Vakuum → saugt Cl₂ an', 'Bei Schlauchbruch: Vakuumregler schließt sofort', 'Verhindert unkontrolliertes Cl₂-Ausströmen', 'Membran-Typ: regelt Cl₂-Strom proportional zur Dosierung'] },
  injector: { title: 'Injektor / Dosierstelle', color: '#34c090', items: ['Erzeugt Vakuum (Wasserstrahl-Pumpe-Prinzip)', 'Mischt Cl₂-Gas in Betriebswasser (Chlorwasserlösung)', 'Chlorwasserlösung wird in Rohrnetz eingespeist', 'Dosiermenge: über Dosieregler (g Cl₂/h) einstellbar', 'Proportionalsteuerung: Dosis nach Durchfluss oder Redox', 'Verbindungsleitung: Kunststoff (Cl₂-beständig, PTFE oder PVC)'] },
  gasdetektor: { title: 'Chlorgasdetektor', color: '#5ad0ff', items: ['Elektrochemischer Sensor: reagiert auf Cl₂ in Raumluft', 'MAK-Wert Cl₂: 0,5 ppm (Grenzwert Arbeitsplatz)', 'Alarm 1 (Warnung): 0,5 ppm — Warnung optisch/akustisch', 'Alarm 2 (Räumung): 1,0 ppm — Lüftung einschalten, Zugang sperren', 'Positionierung: bodennah (Cl₂ ist schwerer als Luft)', 'Kalibrierung: alle 6 Monate mit Prüfgas'] },
  raum: { title: 'Chlorgasraum — Anforderungen', color: '#ff9a30', items: ['Eigener Raum: nur für Chlorgas, keine Fremdnutzung', 'Wände und Boden: säurefest / gasdicht beschichtet', 'Lüftung: zwangsbelüftet, mind. 4-facher Luftwechsel/h', 'Lüftungsauslass: bodennah (Cl₂ sinkt nach unten)', 'Zugang: nur für eingewiesenes Personal (Schlüssel)', 'Notfallausrüstung: Vollschutzmaske, Atemschutzgerät vor Tür', 'Abluft: ins Freie, nicht in Kellerräume oder Abluftschächte', 'Sicherheitsschild: Warnung Chlorgas, kein Zutritt'] },
};

const MODES = [
  { id: 'anlage', label: 'Anlagenaufbau', color: '#4a9eff', focus: ['chlorgasflasche', 'druckminderer', 'vakuumregler', 'injector'] },
  { id: 'sicherheit', label: 'Sicherheit', color: '#ff7a7a', focus: ['gasdetektor', 'raum', 'vakuumregler'] },
  { id: 'notfall', label: 'Notfall', color: '#ff9a30', focus: ['gasdetektor', 'raum'] },
];

function Diagram({ activeSpot, setActiveSpot, activeMode }) {
  const mode = MODES.find(m => m.id === activeMode) || MODES[0];
  return (
    <div style={{ width: '100%', height: 'clamp(300px, 52vh, 460px)' }}>
      <svg viewBox="0 0 820 400" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="cg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="cg-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#2a5a8a" />
          </marker>
        </defs>
        <rect x="10" y="8" width="800" height="384" rx="18" fill="#04111f" stroke="#163651" />

        {/* Chlorgasraum Umrandung */}
        <rect x="30" y="90" width="560" height="280" rx="8" fill="#0a0505" stroke="#ff9a3040" strokeWidth="2" strokeDasharray="6,4" />
        <text x="300" y="112" textAnchor="middle" fill="#ff9a30" fontSize="11" fontWeight="700">CHLORGASRAUM (gesicherter Bereich)</text>

        {/* Flasche */}
        <ellipse cx="135" cy="195" rx="30" ry="12" fill="#1a0808" stroke="#ff7a7a" strokeWidth="1.5" />
        <rect x="105" y="195" width="60" height="100" rx="5" fill="#1a0808" stroke="#ff7a7a" strokeWidth="2" />
        <ellipse cx="135" cy="295" rx="30" ry="12" fill="#1a0808" stroke="#ff7a7a" strokeWidth="1.5" />
        <rect x="120" y="185" width="30" height="15" rx="3" fill="#2a1010" stroke="#ff7a7a" strokeWidth="1.5" />
        <text x="135" y="250" textAnchor="middle" fill="#ff7a7a" fontSize="9" fontWeight="700">Cl₂</text>
        <text x="135" y="263" textAnchor="middle" fill="#802020" fontSize="8">70 kg</text>

        {/* Leitung Flasche → Druckminderer */}
        <line x1="165" y1="230" x2="220" y2="210" stroke="#ffd166" strokeWidth="2" markerEnd="url(#cg-arr)" />

        {/* Druckminderer */}
        <rect x="220" y="190" width="70" height="40" rx="5" fill="#1a1500" stroke="#ffd166" strokeWidth="1.5" />
        <text x="255" y="208" textAnchor="middle" fill="#ffd166" fontSize="8" fontWeight="700">Druck-</text>
        <text x="255" y="220" textAnchor="middle" fill="#ffd166" fontSize="8">minderer</text>
        <circle cx="295" cy="175" r="15" fill="#0a0a00" stroke="#ffd166" strokeWidth="1.5" />
        <text x="295" y="180" textAnchor="middle" fill="#ffd166" fontSize="8">8→1</text>
        <text x="295" y="168" textAnchor="middle" fill="#a09030" fontSize="7">bar</text>

        {/* Leitung → Vakuumregler */}
        <line x1="290" y1="210" x2="345" y2="210" stroke="#a070ff" strokeWidth="2" markerEnd="url(#cg-arr)" />

        {/* Vakuumregler */}
        <rect x="345" y="190" width="70" height="40" rx="5" fill="#100a1a" stroke="#a070ff" strokeWidth="1.5" />
        <text x="380" y="208" textAnchor="middle" fill="#a070ff" fontSize="8" fontWeight="700">Vakuum-</text>
        <text x="380" y="220" textAnchor="middle" fill="#a070ff" fontSize="8">regler</text>
        <text x="380" y="245" textAnchor="middle" fill="#7050b0" fontSize="8">Sicherheit!</text>

        {/* Leitung → Injektor */}
        <line x1="415" y1="210" x2="475" y2="210" stroke="#34c090" strokeWidth="2" markerEnd="url(#cg-arr)" />

        {/* Injektor */}
        <rect x="475" y="190" width="70" height="40" rx="5" fill="#0a1a10" stroke="#34c090" strokeWidth="1.5" />
        <text x="510" y="208" textAnchor="middle" fill="#34c090" fontSize="8" fontWeight="700">Injektor</text>
        <text x="510" y="220" textAnchor="middle" fill="#1a7050" fontSize="8">Dosierung</text>

        {/* Lüftungspfeile */}
        {[80, 160, 240, 320, 400, 480].map((x, i) => (
          <line key={i} x1={40 + x} y1="350" x2={40 + x} y2="370" stroke="#ff9a30" strokeWidth="1.5" markerEnd="url(#cg-arr)" opacity="0.5" />
        ))}
        <text x="300" y="388" textAnchor="middle" fill="#a05010" fontSize="9">Zwangslüftung bodennah (Cl₂ sinkt) → ins Freie</text>

        {/* Gasdetektor Bereich */}
        <rect x="600" y="100" width="190" height="100" rx="7" fill="#001520" stroke="#5ad0ff50" strokeWidth="1.5" />
        <text x="695" y="122" textAnchor="middle" fill="#5ad0ff" fontSize="10" fontWeight="700">Gasdetektor</text>
        <rect x="625" y="130" width="60" height="30" rx="4" fill="#0a2030" stroke="#5ad0ff" strokeWidth="1.5" />
        <text x="655" y="149" textAnchor="middle" fill="#5ad0ff" fontSize="11" fontWeight="700">0,0</text>
        <text x="700" y="142" fill="#1a7a9a" fontSize="8">Alarm 1: 0,5 ppm</text>
        <text x="700" y="154" fill="#1a7a9a" fontSize="8">Alarm 2: 1,0 ppm</text>
        <text x="700" y="166" fill="#1a7a9a" fontSize="8">Pos: bodennah</text>
        <text x="695" y="190" textAnchor="middle" fill="#1a5a7a" fontSize="8">MAK-Wert: 0,5 ppm</text>

        {/* Notfallausrüstung */}
        <rect x="600" y="220" width="190" height="130" rx="7" fill="#100a00" stroke="#ff9a3050" strokeWidth="1.5" />
        <text x="695" y="242" textAnchor="middle" fill="#ff9a30" fontSize="10" fontWeight="700">Notfallausrüstung</text>
        <text x="695" y="257" textAnchor="middle" fill="#a06010" fontSize="8">(vor der Tür!)</text>
        {['Vollschutzmaske (Cl₂-Filter)', 'Pressluftatmer (PA)', 'Schutzanzug', 'Notdusche außerhalb', 'Notfallplan sichtbar'].map((item, i) => (
          <text key={i} x="615" y={275 + i * 14} fill="#a06010" fontSize="8">• {item}</text>
        ))}

        {/* Hotspot Markers */}
        {HOTSPOTS.map(hs => {
          const active = activeSpot === hs.id;
          const focused = mode.focus.includes(hs.id);
          const op = focused ? 1 : 0.35;
          return (
            <g key={hs.id} onClick={() => setActiveSpot(active ? null : hs.id)} style={{ cursor: 'pointer' }} opacity={op} filter={active ? 'url(#cg-glow)' : undefined}>
              <circle cx={hs.x} cy={hs.y} r={active ? 14 : 11} fill={hs.color + '22'} stroke={hs.color} strokeWidth={active ? 2.5 : 1.5} />
              <text x={hs.x} y={hs.y + 4} textAnchor="middle" fill={hs.color} fontSize="7" fontWeight="800">{hs.short}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function ChlorGasanlageDeepDiveView({ darkMode }) {
  const [activeSpot, setActiveSpot] = useState(null);
  const [activeMode, setActiveMode] = useState('anlage');
  const spot = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#ff7a7a', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik — Gefahrstoff</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>Chlorgasanlage & Chlorgasraum</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>Aufbau, Vakuumsystem, Sicherheitsanforderungen und Notfallmaßnahmen bei Chlorgasanlagen</p>

        {/* Warnung */}
        <div style={{ background: '#1a0505', border: '1px solid #ff7a7a50', borderRadius: 10, padding: 10, marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ color: '#ff7a7a', fontSize: 20, flexShrink: 0 }}>⚠️</span>
          <div style={{ fontSize: 12, color: '#ff9a9a' }}>
            <strong>Chlorgas ist lebensgefährlich.</strong> Cl₂ ist schwerer als Luft, gelbgrün, stechend riechend. MAK-Wert: 0,5 ppm. Betreten des Chlorgasraums nur mit Atemschutz und nach Einweisung. Notfallplan immer aktuell halten.
          </div>
        </div>

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
          <div style={{ fontWeight: 700, color: '#ff9a30', marginBottom: 10, fontSize: 13 }}>Notfallprotokoll Chlorgasaustritt</div>
          {[
            ['1.', 'Ruhe bewahren — Chlorgasraum sofort verlassen'],
            ['2.', 'Tür schließen (Gasdichtigkeit)'],
            ['3.', 'Alarm auslösen — andere Personen warnen'],
            ['4.', 'Notruf: 112 → Feuerwehr mit Gefahrguthinweis Cl₂'],
            ['5.', 'Betroffene Personen ins Freie bringen (Frischluft)'],
            ['6.', 'Kein Betreten ohne PA-Gerät (Pressluftatmer)'],
            ['7.', 'Betriebsleitung informieren'],
          ].map(([nr, text], i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 5, fontSize: 13 }}>
              <span style={{ color: '#ff9a30', fontWeight: 700, flexShrink: 0 }}>{nr}</span>
              <span style={{ color: '#a0c8e0' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
