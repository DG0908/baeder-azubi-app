import { useState } from 'react';

const HOTSPOTS = [
  { id: 'skimmer', label: 'Skimmer / Rinne', short: 'SKI', color: '#4a9eff', x: 100, y: 160 },
  { id: 'ausgleich', label: 'Ausgleichsbehälter', short: 'AGB', color: '#5ad0ff', x: 195, y: 270 },
  { id: 'pumpe', label: 'Umwälzpumpe', short: 'PMP', color: '#a070ff', x: 310, y: 310 },
  { id: 'flockung', label: 'Flockung / Vorfiltrat', short: 'FLO', color: '#ffd166', x: 420, y: 280 },
  { id: 'filter', label: 'Druckfilter', short: 'FIL', color: '#34c090', x: 530, y: 220 },
  { id: 'desinfektion', label: 'Desinfektion', short: 'DES', color: '#ff7a7a', x: 640, y: 165 },
  { id: 'einspeisung', label: 'Beckeneinspeisung', short: 'EIN', color: '#ff9a30', x: 710, y: 90 },
];

const HOTSPOT_DATA = {
  skimmer: { title: 'Skimmer / Überlauffrinne', color: '#4a9eff', items: ['Wasserabnahme an der Oberfläche (Oberflächenfilm)', 'Skimmer: punktuell (2–4 Stück je Becken)', 'Überlauffrinne: umlaufend — gleichmäßiger', 'Nimmt Tenside, Körperfette, Schwebstoffe auf', 'Volumenanteil Oberflächenwasser: mind. 30 % der Umwälzmenge', 'Skimmerkorb: täglich reinigen'] },
  ausgleich: { title: 'Ausgleichsbehälter', color: '#5ad0ff', items: ['Puffert Wasservolumen-Schwankungen (Badegäste)', 'Aufnahme: Rinnen-/Skimmerwasser + Frischwasser', 'Wasserstand gesteuert: Füllventil bei Unterschreitung', 'Mindestvolumen: mind. 3 % des Beckenwasservolumens', 'Reinigung: mind. 1× jährlich', 'Überlauffloater: verhindert Trocklaufen der Pumpen'] },
  pumpe: { title: 'Umwälzpumpe', color: '#a070ff', items: ['Kreiselpumpe mit Nassläufer oder Trockenläufer', 'Fördert Rohwasser Richtung Aufbereitung', 'Auslegung: Umwälzung des Beckenvolumens in Nennzeit (z.B. 4 h)', 'Umwälzzeit (DIN 19643): je nach Beckentyp 0,5–8 h', 'Energiesparpotenzial: Frequenzumrichter (drehzahlvariabel)', 'Redundanz: mind. 1 Reservepumpe empfohlen'] },
  flockung: { title: 'Flockung / Vorfiltration', color: '#ffd166', items: ['Flockungsmittel: Aluminiumsulfat Al₂(SO₄)₃ oder PAC (Poly-Aluminiumchlorid)', 'Dosierung: kurz vor dem Filter (Rohwasserleitung)', 'Prinzip: Kolloidale Partikel koagulieren → Flocken', 'Flocken: haften an Filtermedium (Anschwemmfiltrat)', 'Ohne Flockung: Filter weniger effizient (Feinstpartikel)', 'Flockungsmittelvorrat: ausreichend für min. 2 Wochen'] },
  filter: { title: 'Druckfilter (geschlossener Filter)', color: '#34c090', items: ['Druckbehälter aus Stahl oder GFK', 'Filtermedium: Quarzsand (0,4–0,8 mm) / Anthrazit / Aktivkohle', 'Filterschichten beim Mehrschichtfilter: oben Anthrazit (grob, leicht) — Mitte Quarzsand (fein, schwer) — unten Kies als Stützschicht', 'Filtration: mechanisch + biologisch (Biofilm)', 'Druckanstieg > 0,5 bar: Rückspülung erforderlich', 'Rückspülung: Luftspülung → Wasserspülung → Normalbetrieb'] },
  desinfektion: { title: 'Desinfektion', color: '#ff7a7a', items: ['Hauptverfahren: Chlorung (Cl₂, NaOCl, Ca(ClO)₂)', 'Ergänzend: UV-Anlage (photolytische Desinfektion)', 'Ozon: möglich, aber teuer und aufwendig', 'Dosierstation: Dosierpumpe + Mischstrecke', 'Residualchlor im Becken: 0,3–0,6 mg/L (Hallen)', 'Chloramin-Bildung: reduzieren durch UV + Teilwassertausch'] },
  einspeisung: { title: 'Beckeneinspeisung (Rücklauf)', color: '#ff9a30', items: ['Aufbereitetes Wasser wird bodennah eingespeist', 'Einspeisung: Bodendüsen oder Wandeinlässe (Ecken/Mitte)', 'Strömungsrichtung: von Boden nach Oberfläche → Rinne', 'Gleichmäßige Verteilung: verhindert Totzonen', 'Einspeisung mit Frischwasser: gesetzliche Mindestmenge', 'DIN 19643: Umwälzung vollständig ohne Kurzschlussströmung'] },
};

const MODES = [
  { id: 'kreislauf', label: 'Wasserkreislauf', color: '#4a9eff', focus: ['skimmer', 'ausgleich', 'pumpe', 'flockung', 'filter', 'desinfektion', 'einspeisung'] },
  { id: 'aufbereitung', label: 'Aufbereitung', color: '#34c090', focus: ['flockung', 'filter', 'desinfektion'] },
  { id: 'hydraulik', label: 'Hydraulik', color: '#a070ff', focus: ['ausgleich', 'pumpe', 'einspeisung'] },
];

function Diagram({ activeSpot, setActiveSpot, activeMode }) {
  const mode = MODES.find(m => m.id === activeMode) || MODES[0];
  const arrows = [
    { x1: 130, y1: 200, x2: 170, y2: 255 },
    { x1: 220, y1: 265, x2: 280, y2: 305 },
    { x1: 340, y1: 305, x2: 395, y2: 285 },
    { x1: 450, y1: 275, x2: 500, y2: 230 },
    { x1: 555, y1: 220, x2: 620, y2: 175 },
    { x1: 665, y1: 155, x2: 700, y2: 105 },
  ];
  return (
    <div style={{ width: '100%', height: 'clamp(320px, 55vh, 520px)' }}>
      <svg viewBox="0 0 820 420" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="an-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="an-arr" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#2a5a7a" />
          </marker>
        </defs>
        <rect x="10" y="8" width="800" height="404" rx="18" fill="#04111f" stroke="#163651" />

        {/* Becken */}
        <rect x="50" y="60" width="120" height="120" rx="6" fill="#081828" stroke="#1a4a7a" strokeWidth="2" />
        <rect x="53" y="63" width="114" height="80" rx="4" fill="#0a2040" />
        <text x="110" y="105" textAnchor="middle" fill="#4a9eff" fontSize="11" fontWeight="700">BECKEN</text>
        <text x="110" y="120" textAnchor="middle" fill="#1a4a8a" fontSize="9">Umwälzung</text>

        {/* Prozessboxen */}
        {[
          { x: 155, y: 245, w: 80, h: 40, label: 'Ausgleichs-\nbehälter', color: '#5ad0ff' },
          { x: 270, y: 285, w: 80, h: 40, label: 'Umwälz-\npumpe', color: '#a070ff' },
          { x: 380, y: 255, w: 80, h: 40, label: 'Flockung', color: '#ffd166' },
          { x: 490, y: 195, w: 80, h: 40, label: 'Druckfilter', color: '#34c090' },
          { x: 600, y: 140, w: 80, h: 40, label: 'Desin-\nfektion', color: '#ff7a7a' },
          { x: 690, y: 60, w: 80, h: 40, label: 'Einspeisung\n(Rücklauf)', color: '#ff9a30' },
        ].map((box, i) => (
          <g key={i}>
            <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="5" fill={box.color + '18'} stroke={box.color + '60'} strokeWidth="1.5" />
            <text x={box.x + box.w / 2} y={box.y + (box.label.includes('\n') ? 16 : 24)} textAnchor="middle" fill={box.color} fontSize="9" fontWeight="700">{box.label.split('\n')[0]}</text>
            {box.label.includes('\n') && <text x={box.x + box.w / 2} y={box.y + 28} textAnchor="middle" fill={box.color} fontSize="9" fontWeight="700">{box.label.split('\n')[1]}</text>}
          </g>
        ))}

        {/* Rücklauf-Pfeil vom Becken rechts zum Einlauf */}
        <path d="M 770 80 Q 790 80 790 50 Q 790 35 110 35 Q 50 35 50 80" fill="none" stroke="#ff9a3060" strokeWidth="2" strokeDasharray="5,4" />
        <text x="420" y="28" textAnchor="middle" fill="#ff9a30" fontSize="9" opacity="0.7">aufbereitetes Wasser zurück ins Becken</text>

        {/* Pfeile zwischen Boxen */}
        {arrows.map((a, i) => (
          <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke="#2a5a7a" strokeWidth="2" markerEnd="url(#an-arr)" />
        ))}
        {/* Skimmer → Ausgleich */}
        <line x1="110" y1="180" x2="175" y2="245" stroke="#2a5a7a" strokeWidth="2" markerEnd="url(#an-arr)" />

        {/* Hotspot Markers */}
        {HOTSPOTS.map(hs => {
          const active = activeSpot === hs.id;
          const focused = mode.focus.includes(hs.id);
          const op = focused ? 1 : 0.35;
          return (
            <g key={hs.id} onClick={() => setActiveSpot(active ? null : hs.id)} style={{ cursor: 'pointer' }} opacity={op} filter={active ? 'url(#an-glow)' : undefined}>
              <circle cx={hs.x} cy={hs.y} r={active ? 14 : 11} fill={hs.color + '22'} stroke={hs.color} strokeWidth={active ? 2.5 : 1.5} />
              <text x={hs.x} y={hs.y + 4} textAnchor="middle" fill={hs.color} fontSize="7" fontWeight="800">{hs.short}</text>
            </g>
          );
        })}

        {/* Legende */}
        <text x="420" y="400" textAnchor="middle" fill="#1a4a6a" fontSize="10">Rohwasser → Aufbereitung → Reinwasser → Becken</text>
      </svg>
    </div>
  );
}

export default function AnlagenBadewasserDeepDiveView({ darkMode }) {
  const [activeSpot, setActiveSpot] = useState(null);
  const [activeMode, setActiveMode] = useState('kreislauf');
  const spot = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  return (
    <div style={{ background: '#04111f', minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: '#4a9eff', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Bädertechnik</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7dd3fc', marginBottom: 4 }}>Anlagen Badewasseraufbereitung</h1>
        <p style={{ color: '#4a7a9a', fontSize: 13, marginBottom: 16 }}>Wasserkreislauf von der Skimmerrinne über Filter und Desinfektion bis zur Beckeneinspeisung</p>

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
        {!spot && <div style={{ color: '#2a5a7a', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>Hotspot im Diagramm anklicken für Details zur Aufbereitungsstufe</div>}

        <div style={{ background: '#071828', border: '1px solid #163651', borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 700, color: '#4a9eff', marginBottom: 10, fontSize: 13 }}>Reihenfolge der Aufbereitungsstufen</div>
          {[
            ['1. Skimmer / Rinne', 'Oberflächenwasser abschöpfen'],
            ['2. Ausgleichsbehälter', 'Volumen puffern, Frischwasser zugeben'],
            ['3. Umwälzpumpe', 'Rohwasser fördern (Antrieb des Kreislaufs)'],
            ['4. Flockung', 'Feinste Partikel koagulieren lassen'],
            ['5. Druckfilter', 'Flocken + Partikel mechanisch abscheiden'],
            ['6. Desinfektion', 'Keime abtöten (Chlor / UV / Ozon)'],
            ['7. Beckeneinspeisung', 'Aufbereitetes Reinwasser von unten einleiten'],
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
