import { useState } from 'react';

const MODEL_HEIGHT = 'clamp(360px, 62vh, 820px)';

const HOTSPOTS = [
  { id: 'steuerung', shortLabel: 'CTRL', label: 'Mikroprozessor-Steuerung', x: 146, y: 92, color: '#4a9eff' },
  { id: 'vorratsbehaelter', shortLabel: 'Vorrat', label: 'Vorratsbehaelter', x: 350, y: 126, color: '#8cbeff' },
  { id: 'duesensystem', shortLabel: 'Duesen', label: 'Duesensystem', x: 522, y: 108, color: '#34c090' },
  { id: 'loesetank', shortLabel: 'Loesetank', label: 'Loese-/Sedimentationstank', x: 358, y: 220, color: '#a070ff' },
  { id: 'sorptionseinheit', shortLabel: 'Sorption', label: 'Sorptionseinheit', x: 522, y: 246, color: '#d8a240' },
  { id: 'schwenkantrieb', shortLabel: 'Schwenk', label: 'Schwenkantrieb', x: 362, y: 292, color: '#ff7a7a' },
  { id: 'tauchdruckpumpe', shortLabel: 'Pumpe', label: 'Tauchdruckpumpe', x: 198, y: 350, color: '#34b9ff' },
  { id: 'produktbehaelter', shortLabel: 'Produkt', label: 'Produktbehaelter', x: 574, y: 350, color: '#4ad097' },
  { id: 'schwimmerschalter', shortLabel: 'Schwimmer', label: 'Schwimmerschalter', x: 132, y: 276, color: '#f2b15b' },
];

const HOTSPOT_DATA = {
  steuerung: {
    title: 'Mikroprozessor-Steuerung',
    short: 'CTRL',
    color: '#4a9eff',
    items: [
      'Steuert Schwenkzyklen, Ueberlaufzeit und Umschaltung der Ventile.',
      'Ueberwacht Signale von Schwimmerschaltern und Betriebsstoerungen.',
      'Verriegelt die Dosierung bei Fehlern im Loeseprozess.',
    ],
  },
  vorratsbehaelter: {
    title: 'Vorratsbehaelter',
    short: 'VORRAT',
    color: '#8cbeff',
    items: [
      'Enthaelt Calciumhypochlorit-Tabletten oder Granulat im trockenen Bereich.',
      'Nachfuellung nur trocken und staubarm, niemals mit Saeuren zusammen.',
      'Ziel ist eine gleichmaessige, bedarfsgerechte Aufgabe in den Loesekreislauf.',
    ],
  },
  duesensystem: {
    title: 'Duesensystem',
    short: 'DUESE',
    color: '#34c090',
    items: [
      'Bespraeht den Feststoff definiert mit Wasser fuer kontrolliertes Anloesen.',
      'Sorgt fuer homogene Benetzung statt lokaler Ueberkonzentration.',
      'Verhindert Verkrustungen durch zeitlich getaktete Spuelimpulse.',
    ],
  },
  loesetank: {
    title: 'Loese-/Sedimentationstank',
    short: 'LOESE',
    color: '#a070ff',
    items: [
      'Hier entsteht die rueckstandsarme Produktloesung.',
      'Unloesliche Nebenbestandteile koennen sedimentieren.',
      'Die Loesung wird erst nach Beruhigungszeit in den Produktbehaelter weitergegeben.',
    ],
  },
  sorptionseinheit: {
    title: 'Sorptionseinheit',
    short: 'SORP',
    color: '#d8a240',
    items: [
      'Optionale Feinabtrennung fuer Schwebstoffe in der Produktstrecke.',
      'Schuetzt nachfolgende Dosierkomponenten vor Ablagerungen.',
      'Bei steigender Druckdifferenz muss die Einheit gereinigt werden.',
    ],
  },
  schwenkantrieb: {
    title: 'Schwenkantrieb',
    short: 'SWENK',
    color: '#ff7a7a',
    items: [
      'Bewegt den Austragsbereich periodisch, damit Feststoff nicht aufbrueckt.',
      'Verbessert die Loesungsausbeute und reduziert Totzonen im Behaelter.',
      'Der Zyklus wird von der Steuerung zeit- oder bedarfsgesteuert gefahren.',
    ],
  },
  tauchdruckpumpe: {
    title: 'Tauchdruckpumpe',
    short: 'PUMP',
    color: '#34b9ff',
    items: [
      'Entnimmt Wasser fuer den Loeseprozess aus dem Wassertank.',
      'Stellt den benoetigten Druck fuer Duesen und Umwaelzung bereit.',
      'Trockenlaufschutz ueber Fuellstandssignale zwingend aktivieren.',
    ],
  },
  produktbehaelter: {
    title: 'Produktbehaelter',
    short: 'PROD',
    color: '#4ad097',
    items: [
      'Speichert die fertige Calciumhypochlorit-Loesung als Zwischenpuffer.',
      'Von hier dosiert die Membrandosierpumpe in die Impfstelle.',
      'Fuellstand und Konzentration regelmaessig pruefen und dokumentieren.',
    ],
  },
  schwimmerschalter: {
    title: 'Schwimmerschalter',
    short: 'LEVEL',
    color: '#f2b15b',
    items: [
      'Erfasst Mindest- und Maximalfuellstand im Wassertank.',
      'Verhindert Trockenlauf der Pumpe und Ueberfuellung.',
      'Signal wird direkt in der Steuerlogik als Freigabebedingung verwendet.',
    ],
  },
};

const KENNDATEN = [
  { label: 'Wirkstoff', value: 'Calciumhypochlorit Ca(ClO)2 (fest)' },
  { label: 'Aktivchlor im Produkt', value: 'typisch 65-70 %' },
  { label: 'Loesungsbildung', value: 'automatisch im 2-Kammer-System' },
  { label: 'Dosierung', value: 'ueber Membrandosierpumpe zur Impfstelle' },
  { label: 'Sicherheitsregel', value: 'trocken lagern, nie mit Saeure mischen' },
];

const PROCESS_STEPS = [
  '1) Wasser wird aus dem Wassertank per Tauchdruckpumpe entnommen.',
  '2) Das Duesensystem benetzt den Calciumhypochlorit-Feststoff kontrolliert.',
  '3) Die gebildete Loesung fliesst in den Loese-/Sedimentationstank.',
  '4) Rueckstaende bleiben zurueck; die klare Phase wandert in den Produktbehaelter.',
  '5) Die Dosierpumpe gibt Produkt loesungsproportional ins Kreislaufwasser.',
  '6) Steuerung + Schwimmerschalter ueberwachen Nachspeisung und Betriebssicherheit.',
];

const BETRIEBSCHECKS = [
  { label: 'Freies Chlor (Becken)', value: '0,3 - 0,6 mg/L', ok: true },
  { label: 'pH-Fenster', value: '7,0 - 7,4', ok: true },
  { label: 'Produktbehaelter Level', value: 'nicht unter Mindeststand', ok: true },
  { label: 'Duesenbild', value: 'gleichmaessig, ohne Verstopfung', ok: true },
];

function HotspotMarker({ spot, activeSpot, onToggle, showLabels }) {
  const active = activeSpot === spot.id;
  return (
    <g
      data-hotspot="1"
      style={{ cursor: 'pointer' }}
      onClick={(event) => {
        event.stopPropagation();
        onToggle(active ? null : spot.id);
      }}
    >
      <circle
        cx={spot.x}
        cy={spot.y}
        r={active ? 17 : 14}
        fill={spot.color}
        fillOpacity={active ? 0.36 : 0.16}
        stroke={spot.color}
        strokeWidth={active ? 2.7 : 1.6}
      >
        {!active && <animate attributeName="r" values="14;17;14" dur="2.6s" repeatCount="indefinite" />}
      </circle>
      <circle cx={spot.x} cy={spot.y} r="3.2" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.9" />
      <text x={spot.x} y={spot.y + 4} fill="white" fontSize="10" fontWeight="700" textAnchor="middle">+</text>
      {showLabels && (
        <text
          x={spot.x}
          y={spot.y - 18}
          fill={spot.color}
          fontSize="7"
          fontFamily="monospace"
          textAnchor="middle"
          style={{ pointerEvents: 'none' }}
        >
          {spot.shortLabel}
        </text>
      )}
    </g>
  );
}

function CalciumPlantSchematic({ activeSpot, setActiveSpot, xrayMode, showLabels }) {
  const shellFill = xrayMode ? 'rgba(32,72,114,0.16)' : 'rgba(26,64,112,0.36)';
  const wallFill = xrayMode ? 'rgba(20,52,88,0.14)' : 'rgba(16,40,70,0.48)';
  const tankFill = xrayMode ? 'rgba(72,130,205,0.12)' : 'rgba(54,111,192,0.35)';
  const stroke = '#2a5a90';

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a3a5a', background: '#040d1a' }}>
      <svg viewBox="0 0 760 500" width="100%" height={MODEL_HEIGHT} role="img" aria-label="Schematische Calciumhypochlorit-Feststoff-Chloranlage">
        <defs>
          <pattern id="cal-grid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M 22 0 L 0 0 0 22" fill="none" stroke="#0b2238" strokeWidth="0.55" />
          </pattern>
          <linearGradient id="surfaceGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3f8fe0" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#214c86" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <rect width="760" height="500" fill="#040d1a" />
        <rect width="760" height="500" fill="url(#cal-grid)" />

        <polygon points="64,182 684,182 640,122 120,122" fill={shellFill} stroke={stroke} strokeWidth="2" />
        <polygon points="64,182 120,122 120,382 64,442" fill={wallFill} stroke={stroke} strokeWidth="1.6" />
        <polygon points="684,182 640,122 640,382 684,442" fill={wallFill} stroke={stroke} strokeWidth="1.6" />
        <rect x="64" y="182" width="620" height="260" fill={shellFill} stroke={stroke} strokeWidth="2" />

        <line x1="260" y1="182" x2="260" y2="442" stroke="#2b5a8c" strokeWidth="1.4" />
        <line x1="470" y1="182" x2="470" y2="442" stroke="#2b5a8c" strokeWidth="1.4" />
        <line x1="260" y1="182" x2="300" y2="122" stroke="#2b5a8c" strokeWidth="1.3" />
        <line x1="470" y1="182" x2="506" y2="122" stroke="#2b5a8c" strokeWidth="1.3" />

        <rect x="96" y="68" width="104" height="66" rx="7" fill="#0a1e33" stroke="#2a5a90" strokeWidth="1.4" />
        <rect x="210" y="76" width="32" height="50" rx="5" fill="#0a1e33" stroke="#2a5a90" strokeWidth="1.2" />
        <rect x="142" y="88" width="42" height="26" rx="4" fill="#0f2f4f" stroke="#3b79ba" strokeWidth="1.1" />

        <rect x="286" y="108" width="154" height="78" rx="8" fill={tankFill} stroke="#69aef6" strokeWidth="1.6" />
        <line x1="335" y1="108" x2="335" y2="186" stroke="#6ea7de" strokeWidth="1.2" />
        <line x1="385" y1="108" x2="385" y2="186" stroke="#6ea7de" strokeWidth="1.2" />

        <rect x="278" y="168" width="186" height="124" rx="8" fill={tankFill} stroke="#6caef8" strokeWidth="1.8" />
        <path d="M296 226 C340 206, 402 208, 446 228" fill="none" stroke="#77beff" strokeWidth="2" opacity="0.72" />
        <path d="M300 242 C342 224, 401 226, 442 243" fill="none" stroke="#77beff" strokeWidth="1.5" opacity="0.56" />
        <rect x="496" y="264" width="132" height="148" rx="8" fill={tankFill} stroke="#58c9a8" strokeWidth="1.7" />
        <rect x="532" y="298" width="28" height="98" rx="6" fill="url(#surfaceGlow)" stroke="#3ea88a" strokeWidth="1.1" />

        <path d="M132 94 H286 V124 H520" fill="none" stroke="#8fbef0" strokeWidth="3.2" />
        <path d="M520 124 V170 H464" fill="none" stroke="#6ec89f" strokeWidth="2.4" />
        <path d="M462 232 H494 V310" fill="none" stroke="#60c39a" strokeWidth="2.4" />
        <path d="M198 350 V300 H286" fill="none" stroke="#63a9f0" strokeWidth="2.6" />
        <path d="M198 350 H118 V282" fill="none" stroke="#63a9f0" strokeWidth="2.1" />
        <circle cx="198" cy="350" r="20" fill="#0e2842" stroke="#39b9ff" strokeWidth="2" />
        <circle cx="198" cy="350" r="7" fill="#1c4f7a" stroke="#7ecfff" strokeWidth="1" />

        <path d="M520 124 H558" fill="none" stroke="#34c090" strokeWidth="2.4" strokeDasharray="5 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.8s" repeatCount="indefinite" />
        </path>
        <path d="M462 232 H532" fill="none" stroke="#55d8aa" strokeWidth="2.2" strokeDasharray="6 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="2.1s" repeatCount="indefinite" />
        </path>
        <path d="M544 338 H636" fill="none" stroke="#4ed4b2" strokeWidth="2.2" strokeDasharray="6 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.6s" repeatCount="indefinite" />
        </path>

        <text x="300" y="82" fill="#82acd2" fontFamily="monospace" fontSize="10">Mikroprozessor-Steuerung</text>
        <text x="503" y="100" fill="#82acd2" fontFamily="monospace" fontSize="10">Duesensystem</text>
        <text x="286" y="314" fill="#82acd2" fontFamily="monospace" fontSize="10">Loese-/Sedimentationstank</text>
        <text x="502" y="430" fill="#82acd2" fontFamily="monospace" fontSize="10">Produktbehaelter</text>
        <text x="98" y="456" fill="#5f86a8" fontFamily="monospace" fontSize="10">ZIEHEN ZUM LESEN - HOTSPOT ANTIPPEN</text>

        {HOTSPOTS.map((spot) => (
          <HotspotMarker
            key={spot.id}
            spot={spot}
            activeSpot={activeSpot}
            onToggle={setActiveSpot}
            showLabels={showLabels}
          />
        ))}
      </svg>
    </div>
  );
}

export default function CalciumHypochloriteDeepDiveView() {
  const [xrayMode, setXrayMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [activeSpot, setActiveSpot] = useState('loesetank');
  const activeSpotData = activeSpot ? HOTSPOT_DATA[activeSpot] : null;

  const innerCardStyle = {
    background: '#0a1a2e',
    border: '1px solid #1a3a5a',
    borderRadius: '0.9rem',
    padding: '0.9rem',
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#040d1a', border: '1px solid #1a3a5a' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: '1px solid #1a3a5a' }}>
        <div>
          <p className="text-xs font-mono tracking-widest" style={{ color: '#4a9eff' }}>
            DEEP DIVE - KOMPONENTENANALYSE
          </p>
          <h3 className="text-lg font-black text-white mt-0.5">Feststoff-Chloranlage: Calciumhypochlorid</h3>
          <p className="text-xs font-mono mt-1" style={{ color: '#58789c' }}>
            Loeseanlage - Sedimentation - Dosierstrecke
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            type="button"
            onClick={() => setXrayMode((prev) => !prev)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{
              background: xrayMode ? '#3b185f' : '#0a1a2e',
              color: xrayMode ? '#d2adff' : '#7ab0d0',
              border: '1px solid #1a3a5a',
            }}
          >
            {xrayMode ? 'Roentgen an' : 'Roentgen aus'}
          </button>
          <button
            type="button"
            onClick={() => setShowLabels((prev) => !prev)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{ background: '#0a1a2e', color: '#7ab0d0', border: '1px solid #1a3a5a' }}
          >
            {showLabels ? 'Hotspots an' : 'Hotspots aus'}
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.55fr_1fr]" style={{ minHeight: 0 }}>
        <div className="p-4 lg:p-5" style={{ borderRight: '1px solid #1a3a5a', background: '#030c18' }}>
          <CalciumPlantSchematic
            activeSpot={activeSpot}
            setActiveSpot={setActiveSpot}
            xrayMode={xrayMode}
            showLabels={showLabels}
          />
          <div className="mt-3 text-[11px] font-mono tracking-widest" style={{ color: '#5f86a8' }}>
            STEUERUNG PRUEFEN - FUELLSTAENDE UEBERWACHEN - DOSIERSTRECKE SICHERN
          </div>
        </div>

        <div className="p-5 space-y-3 overflow-y-auto">
          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>
              KENNDATEN
            </p>
            {KENNDATEN.map((entry) => (
              <div key={entry.label} className="flex justify-between text-sm py-1.5" style={{ borderBottom: '1px solid #0e2540' }}>
                <span style={{ color: '#456080' }}>{entry.label}</span>
                <span className="font-mono text-right ml-2" style={{ color: '#c0d8f0' }}>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>
              PROZESSABLAUF
            </p>
            <div className="space-y-1.5">
              {PROCESS_STEPS.map((step) => (
                <p key={step} className="text-xs leading-relaxed" style={{ color: '#9ec4de' }}>
                  - {step}
                </p>
              ))}
            </div>
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#4a9eff' }}>
              HOTSPOT-DETAIL
            </p>
            {activeSpotData ? (
              <div className="rounded-lg p-3 mb-2" style={{ background: '#040d1a', border: `1px solid ${activeSpotData.color}` }}>
                <p className="text-xs font-mono font-bold mb-2" style={{ color: activeSpotData.color }}>
                  {activeSpotData.short} {activeSpotData.title}
                </p>
                {activeSpotData.items.map((item) => (
                  <p key={item} className="text-xs leading-relaxed" style={{ color: '#8ab0c0' }}>
                    - {item}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-xs mb-2" style={{ color: '#8ab0c0' }}>
                Tippe auf einen Hotspot im Schema.
              </p>
            )}
            <div className="grid grid-cols-2 gap-1.5">
              {HOTSPOTS.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveSpot(spot.id)}
                  className="text-left rounded-md px-2.5 py-1.5 text-xs font-semibold"
                  style={{
                    background: activeSpot === spot.id ? '#10253e' : '#071426',
                    color: activeSpot === spot.id ? '#d3ebff' : '#86a7c1',
                    border: `1px solid ${activeSpot === spot.id ? spot.color : '#1a3a5a'}`,
                  }}
                >
                  {spot.label}
                </button>
              ))}
            </div>
          </div>

          <div style={innerCardStyle}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#34c090' }}>
              BETRIEBSCHECK
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {BETRIEBSCHECKS.map((check) => (
                <div key={check.label} className="rounded-lg p-2" style={{ background: '#040d1a', border: `1px solid ${check.ok ? '#1a4030' : '#4a1a1a'}` }}>
                  <div style={{ color: '#456080' }}>{check.label}</div>
                  <div className="font-mono font-bold" style={{ color: check.ok ? '#34c090' : '#d04040' }}>
                    {check.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...innerCardStyle, background: '#0a2038', border: '1px solid #1a5060' }}>
            <p className="text-xs font-mono tracking-widest mb-2" style={{ color: '#34c090' }}>
              PRUEFUNGSFRAGE
            </p>
            <p className="text-sm font-semibold mb-2" style={{ color: '#c0d8f0' }}>
              Warum wird bei Feststoff-Calciumhypochlorit zuerst eine Produktloesung erzeugt und nicht direkt ins Becken dosiert?
            </p>
            <details>
              <summary className="text-xs cursor-pointer font-mono" style={{ color: '#4a9eff' }}>
                Antwort einblenden
              </summary>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#90b0d0' }}>
                Die vorgeschaltete Loesung und Sedimentation trennt unloesliche Bestandteile, stabilisiert die Konzentration
                und schuetzt Dosierarmaturen vor Verstopfung. Dadurch wird die Chlordosierung reproduzierbar und sicher.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
