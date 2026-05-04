import { useState } from 'react';

const TABS = {
  aufbau:      { label: 'Aufbau', icon: '🫁' },
  volumina:    { label: 'Atemvolumina', icon: '📊' },
  gasaustausch:{ label: 'Gasaustausch', icon: '⚗️' },
  regulation:  { label: 'Atemregulation', icon: '🧠' },
  bad:         { label: 'Im Badebetrieb', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{title}</h3>}
    {children}
  </div>
);

const Row = ({ label, value, darkMode, highlight }) => (
  <div className={`flex justify-between items-start py-1.5 border-b last:border-0 ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{label}</span>
    <span className={`text-xs font-medium text-right max-w-[60%] ${highlight ? (darkMode ? 'text-red-400' : 'text-red-700') : (darkMode ? 'text-slate-200' : 'text-gray-800')}`}>{value}</span>
  </div>
);

const Info = ({ label, value, sub, darkMode }) => (
  <div className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
    <div className="flex items-center justify-between mb-0.5">
      <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{label}</span>
      <span className={`text-xs font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{value}</span>
    </div>
    {sub && <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{sub}</div>}
  </div>
);

// SVG: Lunge Querschnitt schematisch
const LungeSVG = ({ darkMode }) => (
  <svg viewBox="0 0 280 160" className="w-full mb-3">
    <rect width="280" height="160" fill={darkMode ? '#0f172a' : '#f8fafc'} rx="12"/>
    {/* Trachea */}
    <rect x="128" y="10" width="24" height="40" rx="4" fill={darkMode ? '#7dd3fc' : '#bfdbfe'} stroke={darkMode ? '#38bdf8' : '#3b82f6'} strokeWidth="1.5"/>
    <text x="140" y="35" textAnchor="middle" fontSize="8" fill={darkMode ? '#38bdf8' : '#2563eb'} fontWeight="bold">Trachea</text>
    {/* Bronchien */}
    <path d="M128,50 Q100,65 80,75" fill="none" stroke={darkMode ? '#7dd3fc' : '#3b82f6'} strokeWidth="3" strokeLinecap="round"/>
    <path d="M152,50 Q180,65 200,75" fill="none" stroke={darkMode ? '#7dd3fc' : '#3b82f6'} strokeWidth="3" strokeLinecap="round"/>
    {/* Linke Lunge */}
    <ellipse cx="75" cy="105" rx="55" ry="45" fill={darkMode ? '#1e3a5f' : '#dbeafe'} stroke={darkMode ? '#60a5fa' : '#3b82f6'} strokeWidth="1.5"/>
    <text x="75" y="98" textAnchor="middle" fontSize="9" fill={darkMode ? '#93c5fd' : '#1e40af'} fontWeight="bold">Linke</text>
    <text x="75" y="110" textAnchor="middle" fontSize="9" fill={darkMode ? '#93c5fd' : '#1e40af'} fontWeight="bold">Lunge</text>
    <text x="75" y="122" textAnchor="middle" fontSize="7" fill={darkMode ? '#64748b' : '#94a3b8'}>2 Lappen</text>
    {/* Rechte Lunge */}
    <ellipse cx="205" cy="105" rx="55" ry="45" fill={darkMode ? '#1e3a5f' : '#dbeafe'} stroke={darkMode ? '#60a5fa' : '#3b82f6'} strokeWidth="1.5"/>
    <text x="205" y="98" textAnchor="middle" fontSize="9" fill={darkMode ? '#93c5fd' : '#1e40af'} fontWeight="bold">Rechte</text>
    <text x="205" y="110" textAnchor="middle" fontSize="9" fill={darkMode ? '#93c5fd' : '#1e40af'} fontWeight="bold">Lunge</text>
    <text x="205" y="122" textAnchor="middle" fontSize="7" fill={darkMode ? '#64748b' : '#94a3b8'}>3 Lappen</text>
    {/* Herz */}
    <ellipse cx="140" cy="115" rx="20" ry="25" fill={darkMode ? '#7f1d1d' : '#fee2e2'} stroke={darkMode ? '#f87171' : '#dc2626'} strokeWidth="1.5"/>
    <text x="140" y="118" textAnchor="middle" fontSize="8" fill={darkMode ? '#fca5a5' : '#991b1b'}>Herz</text>
    {/* Labels */}
    <text x="140" y="155" textAnchor="middle" fontSize="7" fill={darkMode ? '#64748b' : '#94a3b8'}>Schematische Übersicht (Frontalansicht)</text>
  </svg>
);

// SVG: Alveole
const AlveoleSVG = ({ darkMode }) => (
  <svg viewBox="0 0 280 120" className="w-full mb-3">
    <rect width="280" height="120" fill={darkMode ? '#0f172a' : '#f8fafc'} rx="12"/>
    {/* Bronchiole */}
    <rect x="110" y="5" width="60" height="25" rx="6" fill={darkMode ? '#7dd3fc' : '#bfdbfe'} stroke={darkMode ? '#38bdf8' : '#3b82f6'} strokeWidth="1.5"/>
    <text x="140" y="22" textAnchor="middle" fontSize="9" fill={darkMode ? '#1e40af' : '#1e40af'} fontWeight="bold">Bronchiole</text>
    {/* Alveolen */}
    {[55,110,165,220].map((cx,i) => (
      <g key={i}>
        <circle cx={cx} cy="75" r="28" fill={darkMode ? '#1e3a5f' : '#eff6ff'} stroke={darkMode ? '#60a5fa' : '#93c5fd'} strokeWidth="1.5"/>
        <text x={cx} y="72" textAnchor="middle" fontSize="8" fill={darkMode ? '#93c5fd' : '#3b82f6'}>Alveole</text>
        {/* Kapillaren */}
        <line x1={cx-28} y1="75" x2={cx+28} y2="75" stroke={darkMode ? '#f87171' : '#dc2626'} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
        <text x={cx} y="95" textAnchor="middle" fontSize="6.5" fill={darkMode ? '#64748b' : '#94a3b8'}>Kapillare</text>
      </g>
    ))}
    {/* O2 / CO2 Pfeile */}
    <text x="140" y="112" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#4ade80' : '#16a34a'}>↓ O₂ ins Blut   ↑ CO₂ aus Blut</text>
  </svg>
);

export default function LungeAtmungDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('aufbau');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-red-900/60 to-rose-900/40 border border-red-800' : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🫁</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Lunge & Atemphysiologie</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Aufbau · Atemvolumina · Gasaustausch · Regulation</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-red-600 text-white shadow'
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'aufbau' && (
        <div>
          <S title="Übersicht: Atemtrakt" darkMode={darkMode}><LungeSVG darkMode={darkMode} /></S>
          <S title="Weg der Luft" darkMode={darkMode}>
            {[
              ['Nase/Mund', 'Einatemöffnung — Luft wird angewärmt, befeuchtet, gefiltert'],
              ['Rachen (Pharynx)', 'Kreuzung von Atem- und Speiseweg'],
              ['Kehlkopf (Larynx)', 'Stimmbildung, Schutzfunktion (Epiglottis)'],
              ['Luftröhre (Trachea)', '10–12 cm lang, Knorpelspangen, flimmert Schleim heraus'],
              ['Hauptbronchien', 'Teilen sich in linken (2 Lappen) und rechten Bronchus (3 Lappen)'],
              ['Bronchiolen', 'Immer feinere Äste bis zu den Alveolen'],
              ['Alveolen', '~300 Mio. Lungenbläschen — Gesamtfläche ~70 m² (Tennisplatz!)'],
            ].map(([l, v]) => <Row key={l} label={l} value={v} darkMode={darkMode} />)}
          </S>
          <S title="Die Alveole — Ort des Gasaustauschs" darkMode={darkMode}>
            <AlveoleSVG darkMode={darkMode} />
            <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die Alveolenwand ist nur <strong>0,2 µm</strong> dünn — dünner als eine Zelle. Dadurch können O₂ und CO₂ per Diffusion extrem schnell ausgetauscht werden. Kapillarnetz umgibt jede Alveole vollständig.
            </div>
          </S>
          <S title="Atemmechanik" darkMode={darkMode}>
            {[
              { titel: 'Einatmung (Inspiration)', text: 'Zwerchfell zieht sich zusammen → Brustraum vergrößert sich → Druck sinkt → Luft strömt ein (passiv!)' },
              { titel: 'Ausatmung (Exspiration)', text: 'Zwerchfell entspannt sich → Brustraum verkleinert sich → Druck steigt → Luft strömt aus (bei Ruhe passiv)' },
              { titel: 'Forcierte Ausatmung', text: 'Bauch- und Zwischenrippenmuskeln aktiv → z. B. beim Sport oder Husten' },
            ].map(({ titel, text }) => (
              <div key={titel} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'volumina' && (
        <div>
          <S title="Atemvolumina im Überblick" darkMode={darkMode}>
            {/* Balkendiagramm schematisch */}
            <div className={`rounded-xl p-3 mb-4 font-mono text-xs overflow-x-auto ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
              <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Totalkapazität = 5.500–6.000 ml</div>
              {[
                { label: 'RV  Residualvolumen', ml: '1.200', width: 22, color: 'bg-slate-500', desc: 'Bleibt immer in der Lunge — nicht ausatembar' },
                { label: 'ERV Exspiratorisches Reservevolumen', ml: '1.500', width: 27, color: 'bg-amber-500', desc: 'Kann noch zusätzlich ausgeatmet werden' },
                { label: 'AZV Atemzugvolumen', ml: '500', width: 9, color: 'bg-emerald-500', desc: 'Normaler Atemzug in Ruhe' },
                { label: 'IRV Inspiratorisches Reservevolumen', ml: '2.500', width: 42, color: 'bg-blue-500', desc: 'Kann noch zusätzlich eingeatmet werden' },
              ].map(({ label, ml, width, color, desc }) => (
                <div key={label} className="mb-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className={`h-4 rounded ${color} opacity-80`} style={{ width: `${width}%`, minWidth: '6px' }} />
                    <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{ml} ml</span>
                  </div>
                  <div className={`text-xs pl-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{label}</div>
                  <div className={`text-xs pl-1 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>{desc}</div>
                </div>
              ))}
            </div>
          </S>
          <S title="Wichtige Kenngrößen" darkMode={darkMode}>
            <Info label="Vitalkapazität (VC)" value="3.500–5.000 ml" sub="VC = IRV + AZV + ERV — maximal ein- und ausatembar" darkMode={darkMode} />
            <Info label="Atemzugvolumen (AZV) Ruhe" value="~500 ml" sub="~12–20 Atemzüge/min → Atemminutenvolumen ~6–10 L/min" darkMode={darkMode} />
            <Info label="Atemminutenvolumen (AMV)" value="~6–8 L/min Ruhe" sub="Bis 120 L/min bei Maximalbelastung (Schwimmer!)" darkMode={darkMode} />
            <Info label="Atemfrequenz Ruhe" value="12–20/min" sub="Kinder: 20–30/min | Neugeborene: 40–60/min" darkMode={darkMode} />
            <Info label="Totraum" value="~150 ml" sub="Luft in Atemwegen die nicht am Gasaustausch teilnimmt (Trachea, Bronchien)" darkMode={darkMode} />
          </S>
          <S title="Messung: Spirometrie" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div>Spirometrie ist die Messung von Atemvolumina und Atemfluss über die Zeit.</div>
              <div><strong>FEV₁</strong> (Einsekundenkapazität): Wie viel Luft in 1 Sek. forciert ausgeatmet werden kann. Normal &gt; 70% der Vitalkapazität.</div>
              <div><strong>FEV₁/VC</strong> &lt; 70%: Hinweis auf Obstruktion (z. B. Asthma, COPD).</div>
              <div className={`rounded p-2 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}><strong>Prüfungsrelevant:</strong> Vitalkapazität sinkt mit Alter, bei Übergewicht, bei Lungenkrankheiten — steigt bei Ausdauersport (Schwimmen!).</div>
            </div>
          </S>
        </div>
      )}

      {tab === 'gasaustausch' && (
        <div>
          <S title="Prinzip: Diffusion" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Gasaustausch erfolgt durch <strong>Diffusion</strong> — Gase diffundieren vom Ort hoher Konzentration (hoher Partialdruck) zum Ort niedriger Konzentration (niedriger Partialdruck). Kein Energieverbrauch nötig.
            </div>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Ort</th><th className="text-right p-2">pO₂</th><th className="text-right p-2">pCO₂</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Alveolarluft', '100 mmHg', '40 mmHg'],
                    ['Venöses Blut (ankommend)', '40 mmHg', '46 mmHg'],
                    ['Arterielles Blut (abgehend)', '95 mmHg', '40 mmHg'],
                    ['Körpergewebe (verbrauchend)', '20–40 mmHg', '50–60 mmHg'],
                  ].map(([o, po2, pco2], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2">{o}</td>
                      <td className="p-2 text-right font-mono text-blue-400">{po2}</td>
                      <td className="p-2 text-right font-mono text-red-400">{pco2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
          <S title="Sauerstofftransport im Blut" darkMode={darkMode}>
            {[
              { name: 'An Hämoglobin gebunden', anteil: '98,5 %', detail: '1 Hb-Molekül trägt 4 O₂. Sättigungskurve S-förmig (kooperative Bindung).' },
              { name: 'Physikalisch gelöst im Plasma', anteil: '1,5 %', detail: 'Sehr wenig — wichtig bei Hyperoxie (Druckbeatmung).' },
            ].map(({ name, anteil, detail }) => (
              <div key={name} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{name}</span>
                  <span className={`text-xs font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{anteil}</span>
                </div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{detail}</div>
              </div>
            ))}
            <div className={`rounded-lg p-3 border-l-4 border-red-500 mt-2 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>⚠️ CO-Vergiftung (Kohlenmonoxid)</div>
              <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                CO bindet 250× stärker an Hämoglobin als O₂ → Hb blockiert → Sauerstoffnot trotz normaler Blutmenge. Symptom: Kirschrote Lippen, Bewusstlosigkeit. Gefahr z. B. bei schlecht belüfteter Heizung im Schwimmbad.
              </div>
            </div>
          </S>
          <S title="CO₂-Transport" darkMode={darkMode}>
            {[
              ['Als Bikarbonat (HCO₃⁻)', '70 %', 'CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻ (in Erythrozyten)'],
              ['An Hämoglobin gebunden', '23 %', 'Als Carbaminohämoglobin — anders als O₂-Bindungsstelle'],
              ['Physikalisch gelöst', '7 %', 'Im Plasma — direkt als CO₂'],
            ].map(([art, anteil, erklärung], i) => (
              <div key={i} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between mb-0.5">
                  <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{art}</span>
                  <span className={`text-xs font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{anteil}</span>
                </div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{erklärung}</div>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'regulation' && (
        <div>
          <S title="Atemzentrum im Hirnstamm" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Das <strong>Atemzentrum</strong> liegt in der Medulla oblongata (verlängertes Mark) und Pons. Es steuert Atemfrequenz und -tiefe automatisch — auch im Schlaf.
            </div>
            {[
              { stoff: 'CO₂ ↑ (Hyperkapnie)', effekt: 'Atemantrieb ↑↑', erkl: 'Stärkster Atemreiz! CO₂ senkt pH-Wert → Chemorezeptoren reagieren sofort' },
              { stoff: 'O₂ ↓ (Hypoxie)', effekt: 'Atemantrieb ↑', erkl: 'Schwächerer Reiz, wirkt erst bei pO₂ < 60 mmHg. Periphere Chemorezeptoren (Aorta, Karotis)' },
              { stoff: 'pH ↓ (Azidose)', effekt: 'Atemantrieb ↑', erkl: 'Kompensatorisch: schnelleres Atmen senkt CO₂ → pH steigt wieder' },
            ].map(({ stoff, effekt, erkl }) => (
              <div key={stoff} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{stoff}</span>
                  <span className={`text-xs font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{effekt}</span>
                </div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{erkl}</div>
              </div>
            ))}
          </S>
          <S title="Hyperventilation & Hypokapnie" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div>Zu schnelles/tiefes Atmen → CO₂ wird abgeatmet → <strong>pCO₂ sinkt</strong> → pH steigt (respiratorische Alkalose)</div>
              <div>Folge: Kribbeln, Taubheit, Krämpfe, Schwindel, Bewusstlosigkeit</div>
              <div className={`rounded p-2 border-l-4 border-red-500 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                <strong>Shallow Water Blackout:</strong> Willentliche Hyperventilation vor dem Tauchen senkt CO₂ → Atemreiz fehlt → Schwimmer verliert Bewusstsein unter Wasser ohne Vorwarnung. Häufige Todesursache!
              </div>
            </div>
          </S>
        </div>
      )}

      {tab === 'bad' && (
        <div>
          <S title="Atemphysiologie im Badebetrieb" darkMode={darkMode}>
            {[
              { titel: '🏊 Atemtechnik beim Schwimmen', text: 'Ausatmung ins Wasser (CO₂ raus), Einatmung seitlich beim Kraul. Regelmäßiger Rhythmus stabilisiert pH-Wert.' },
              { titel: '🤿 Tauchen: Druckausgleich', text: 'Mit Tiefe steigt Luftdruck in Lunge → Gasvolumen komprimiert. Beim Auftauchen: Luft ausdehnen → nicht die Luft anhalten! Gefahr: Lungenüberblähung.' },
              { titel: '⚠️ Shallow Water Blackout', text: 'Hyperventilation vor dem Tauchen → CO₂ zu niedrig → kein Atemreiz → Bewusstlosigkeit ohne Vorwarnung unter Wasser. Strengstes Verbot in Bädern!' },
              { titel: '🌡️ Asthma bronchiale', text: 'Bronchospasmus durch Chlor, Kälte oder Anstrengung möglich. Notfallinhaler des Gastes kennen. Im Notfall: aufrechte Lagerung, beruhigen, 112.' },
              { titel: '📋 FAB-Pflicht', text: 'Atemnotfälle erkennen: blaue Lippen (Zyanose), Einziehungen zwischen den Rippen, Nasenflügeln, Atembewegungen seitlich am Brustkorb tasten. Sofort 112 – Sauerstoff aus dem Bäder-Notfallset.' },
            ].map(({ titel, text }) => (
              <div key={titel} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>
        </div>
      )}
    </div>
  );
}
