import { useState } from 'react';

const TABS = {
  aufbau:    { label: 'Aufbau', icon: '🧠' },
  neuron:    { label: 'Neuron & Signal', icon: '⚡' },
  reflex:    { label: 'Reflexe', icon: '🦵' },
  vegetativ: { label: 'Vegetatives NS', icon: '🔄' },
  bad:       { label: 'Im Badebetrieb', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{title}</h3>}
    {children}
  </div>
);

// Schematisches SVG Gehirn + Rückenmark
const NSSvg = ({ darkMode }) => (
  <svg viewBox="0 0 280 180" className="w-full mb-3">
    <rect width="280" height="180" fill={darkMode ? '#0f172a' : '#f8fafc'} rx="12"/>
    {/* Gehirn */}
    <ellipse cx="140" cy="65" rx="70" ry="55" fill={darkMode ? '#4c1d95' : '#ede9fe'} stroke={darkMode ? '#a78bfa' : '#7c3aed'} strokeWidth="1.5"/>
    <text x="140" y="45" textAnchor="middle" fontSize="9" fill={darkMode ? '#c4b5fd' : '#5b21b6'} fontWeight="bold">Großhirn</text>
    <text x="140" y="57" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#a78bfa' : '#7c3aed'}>(Cortex, Bewusstsein)</text>
    {/* Kleinhirn */}
    <ellipse cx="140" cy="105" rx="35" ry="22" fill={darkMode ? '#3b0764' : '#f3e8ff'} stroke={darkMode ? '#a78bfa' : '#9333ea'} strokeWidth="1.5"/>
    <text x="140" y="109" textAnchor="middle" fontSize="8" fill={darkMode ? '#c4b5fd' : '#7e22ce'}>Kleinhirn</text>
    {/* Hirnstamm */}
    <rect x="123" y="122" width="34" height="22" rx="6" fill={darkMode ? '#1e1b4b' : '#e0e7ff'} stroke={darkMode ? '#818cf8' : '#4f46e5'} strokeWidth="1.5"/>
    <text x="140" y="136" textAnchor="middle" fontSize="8" fill={darkMode ? '#a5b4fc' : '#3730a3'}>Hirnstamm</text>
    {/* Rückenmark */}
    <rect x="130" y="143" width="20" height="28" rx="4" fill={darkMode ? '#1e3a5f' : '#dbeafe'} stroke={darkMode ? '#60a5fa' : '#3b82f6'} strokeWidth="1.5"/>
    <text x="140" y="162" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#93c5fd' : '#1d4ed8'}>RM</text>
    {/* Nerven seitlich */}
    <line x1="130" y1="150" x2="60" y2="155" stroke={darkMode ? '#60a5fa' : '#93c5fd'} strokeWidth="1.5" strokeDasharray="3,2"/>
    <line x1="130" y1="158" x2="60" y2="165" stroke={darkMode ? '#60a5fa' : '#93c5fd'} strokeWidth="1.5" strokeDasharray="3,2"/>
    <line x1="150" y1="150" x2="220" y2="155" stroke={darkMode ? '#60a5fa' : '#93c5fd'} strokeWidth="1.5" strokeDasharray="3,2"/>
    <line x1="150" y1="158" x2="220" y2="165" stroke={darkMode ? '#60a5fa' : '#93c5fd'} strokeWidth="1.5" strokeDasharray="3,2"/>
    <text x="35" y="162" textAnchor="middle" fontSize="7" fill={darkMode ? '#64748b' : '#94a3b8'}>Spinalnerv</text>
    {/* Labels */}
    <text x="6" y="68" fontSize="7.5" fill={darkMode ? '#7c3aed' : '#7c3aed'} fontWeight="bold">ZNS</text>
    <text x="6" y="80" fontSize="7" fill={darkMode ? '#64748b' : '#94a3b8'}>(Gehirn +</text>
    <text x="6" y="89" fontSize="7" fill={darkMode ? '#64748b' : '#94a3b8'}>Rückenmark)</text>
    <text x="230" y="68" fontSize="7.5" fill={darkMode ? '#3b82f6' : '#2563eb'} fontWeight="bold">PNS</text>
    <text x="226" y="80" fontSize="7" fill={darkMode ? '#64748b' : '#94a3b8'}>(periphere</text>
    <text x="225" y="89" fontSize="7" fill={darkMode ? '#64748b' : '#94a3b8'}>Nerven)</text>
  </svg>
);

export default function NervensystemDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('aufbau');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-purple-900/60 to-violet-900/40 border border-purple-800' : 'bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>Nervensystem</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>ZNS · PNS · Neuron · Reflexe · Vegetatives NS</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-purple-600 text-white shadow'
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'aufbau' && (
        <div>
          <S title="Gliederung des Nervensystems" darkMode={darkMode}>
            <NSSvg darkMode={darkMode} />
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Teil</th><th className="text-left p-2">Bestandteile</th><th className="text-left p-2">Funktion</th></tr>
                </thead>
                <tbody>
                  {[
                    ['ZNS', 'Gehirn + Rückenmark', 'Schaltzentrale: Verarbeitung, Speicherung, Steuerung'],
                    ['PNS', 'Alle anderen Nerven', 'Informationsleitung ZNS ↔ Körper'],
                    ['Somatisch', 'Willkürliche Nerven', 'Steuerung Skelettmuskulatur (bewusst)'],
                    ['Vegetativ', 'Sympathikus/Parasympathikus', 'Unbewusste Körperfunktionen: Herz, Darm, Drüsen'],
                  ].map(([teil, best, funk], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-bold">{teil}</td>
                      <td className="p-2">{best}</td>
                      <td className="p-2">{funk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
          <S title="Gehirnbereiche" darkMode={darkMode}>
            {[
              { name: 'Großhirn (Cortex)', func: 'Bewusstsein, Denken, Sprache, Motorik, Sensorik, Gedächtnis' },
              { name: 'Kleinhirn', func: 'Koordination, Gleichgewicht, Feinmotorik — wichtig für Schwimmtechnik!' },
              { name: 'Hirnstamm', func: 'Vitalfunktionen: Atemzentrum, Herzfrequenz, Schlucken, Bewusstsein' },
              { name: 'Limbisches System', func: 'Emotionen, Stress-Reaktion, Angst, Motivation' },
            ].map(({ name, func }) => (
              <div key={name} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>{name}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{func}</div>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'neuron' && (
        <div>
          <S title="Aufbau einer Nervenzelle (Neuron)" darkMode={darkMode}>
            <div className={`text-xs space-y-2 mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {[
                ['Dendriten', 'Kurze Fortsätze: Empfangen Signale von anderen Neuronen'],
                ['Zellkörper (Soma)', 'Enthält Zellkern und Stoffwechsel — Verarbeitung'],
                ['Axon', 'Langer Ausläufer: Leitet Signal weiter (bis 1m lang!)'],
                ['Myelinscheide', 'Isolierschicht aus Schwann-Zellen → beschleunigt Reizleitung bis 120 m/s'],
                ['Synapse', 'Verbindung zum nächsten Neuron oder Muskel — Signalübertragung durch Neurotransmitter'],
              ].map(([name, text]) => (
                <div key={name} className={`py-1 border-b last:border-0 ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                  <span className={`font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>{name}: </span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </S>
          <S title="Aktionspotential & Signalleitung" darkMode={darkMode}>
            {[
              { nr: '1', name: 'Ruhepotential', text: 'Innenseite der Zellmembran: −70 mV (negativ geladen durch K⁺/Na⁺-Pumpen)' },
              { nr: '2', name: 'Depolarisation', text: 'Reiz öffnet Na⁺-Kanäle → Na⁺ strömt ein → Innenseite wird positiv (+30 mV)' },
              { nr: '3', name: 'Repolarisation', text: 'K⁺-Kanäle öffnen → K⁺ strömt aus → Potenzial kehrt zurück' },
              { nr: '4', name: 'Weiterleitung', text: 'Aktionspotential "springt" von Ranvier-Schnürring zu Schnürring (saltatorisch) → sehr schnell' },
              { nr: '5', name: 'Synapse', text: 'Am Axonende: Neurotransmitter (z. B. Acetylcholin, Dopamin) werden ausgeschüttet → binden an Rezeptoren → nächstes Neuron wird aktiviert' },
            ].map(({ nr, name, text }) => (
              <div key={nr} className={`rounded-lg p-3 mb-2 flex gap-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{nr}</span>
                <div>
                  <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>{name}</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
                </div>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'reflex' && (
        <div>
          <S title="Der Reflexbogen" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Ein Reflex ist eine unwillkürliche, schnelle Reaktion auf einen Reiz — ohne Beteiligung des Großhirns (läuft über Rückenmark).
            </div>
            <div className={`rounded-xl p-3 mb-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`text-xs font-mono text-center ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                Reiz → Rezeptor → afferente Nervenfaser → Rückenmark → efferente Nervenfaser → Muskel → Reaktion
              </div>
            </div>
            {[
              { typ: 'Monosynaptischer Reflex', beispiel: 'Patellarsehnenreflex (Knie-Reflex)', detail: 'Nur 1 Synapse im RM. Reaktionszeit: 20–40 ms. Arzt prüft Neurologie.' },
              { typ: 'Polysynaptischer Reflex', beispiel: 'Schutzreflex (Rückzug bei Schmerz)', detail: 'Mehrere Synapsen, Interneurone, komplexer. Reaktionszeit: 60–150 ms.' },
              { typ: 'Bedingter Reflex (gelernt)', beispiel: 'Speichelfluss bei Gedanke an Essen', detail: 'Erlernt (Großhirn beteiligt), kann verlernt werden. Grundlage vieler Konditionierungen.' },
            ].map(({ typ, beispiel, detail }) => (
              <div key={typ} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>{typ}</div>
                <div className={`text-xs font-medium mb-0.5 ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>Beispiel: {beispiel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{detail}</div>
              </div>
            ))}
          </S>
          <S title="Bewusstseinsstufen (vereinfacht)" darkMode={darkMode}>
            {[
              { stufe: 'Wach und orientiert', gcs: '15', zeichen: 'Spricht normal, erinnert sich, reagiert gezielt' },
              { stufe: 'Somnolenz', gcs: '12–14', zeichen: 'Schläfrig, weckbar, verlangsamt' },
              { stufe: 'Sopor', gcs: '8–11', zeichen: 'Tiefer Schlaf, nur durch starke Reize weckbar' },
              { stufe: 'Koma', gcs: '3–7', zeichen: 'Nicht weckbar, keine Reaktion auf Schmerzreize' },
            ].map(({ stufe, gcs, zeichen }) => (
              <div key={stufe} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{stufe}</span>
                  <span className={`font-mono text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>GCS {gcs}</span>
                </div>
                <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{zeichen}</div>
              </div>
            ))}
            <div className={`mt-2 text-xs ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
              ⚠️ GCS ≤ 8 = Atemweg gefährdet → stabile Seitenlage oder Intubation durch RD
            </div>
          </S>
        </div>
      )}

      {tab === 'vegetativ' && (
        <div>
          <S title="Sympathikus vs. Parasympathikus" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Das vegetative (autonome) Nervensystem regelt Körperfunktionen <strong>unbewusst</strong> — Gegenspieler für Balance.
            </div>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Organ</th><th className="text-left p-2 text-red-400">Sympathikus (Kampf/Flucht)</th><th className="text-left p-2 text-blue-400">Parasympathikus (Ruhe)</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Herz', 'Frequenz ↑, Kraft ↑', 'Frequenz ↓, Kraft ↓'],
                    ['Bronchien', 'Erweiterung (mehr O₂)', 'Verengung'],
                    ['Pupillen', 'Erweiterung', 'Verengung'],
                    ['Blutgefäße', 'Muskulatur: Erweiterung', 'Haut/Darm: Einengung'],
                    ['Verdauung', 'Hemmung', 'Aktivierung (Darmgeräusche!)'],
                    ['Speicheldrüsen', 'Wenig, dickflüssig', 'Viel, dünnflüssig'],
                    ['Schweißdrüsen', 'Aktivierung', 'Keine Wirkung'],
                    ['Neurotransmitter', 'Adrenalin / Noradrenalin', 'Acetylcholin'],
                  ].map(([organ, sym, para], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{organ}</td>
                      <td className="p-2 text-red-400">{sym}</td>
                      <td className="p-2 text-blue-400">{para}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
          <S title="Taucherreflex (Tauchreflex)" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div>Bei Eintauchen des Gesichts in kaltes Wasser: <strong>Bradykardie</strong> (Herzfrequenz ↓), Blutumverteilung zu lebenswichtigen Organen. Reflexartig, unwillkürlich.</div>
              <div>Bei Säuglingen stärker ausgeprägt → Reanimationschancen nach Kaltwater-Ertrinken länger als bei Erwachsenen.</div>
              <div className={`rounded p-2 border-l-4 border-blue-500 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <strong>FAB-Wissen:</strong> Ertrunkenes Kind aus kaltem Wasser → immer reanimieren! Das kalte Wasser kann das Gehirn schützen (Hypothermieprotekt). „Nicht tot bis warm und tot" gilt besonders für Kinder.
              </div>
            </div>
          </S>
        </div>
      )}

      {tab === 'bad' && (
        <div>
          <S title="Nervensystem im Badebetrieb" darkMode={darkMode}>
            {[
              { titel: '😵 Bewusstlosigkeit erkennen', text: 'Ansprechen → Schulterrütteln → Schmerzreiz. Keine Reaktion = bewusstlos. Pupillenkontrolle: Lichtreaktion fehlt bei tiefer Bewusstlosigkeit oder Hirnschaden.' },
              { titel: '🌀 Hyperventilation', text: 'Durch Angst → Sympathikus-Aktivierung → zu schnelles Atmen → CO₂ sinkt → pH steigt → Kribbeln, Tetanie, Ohnmacht. Behandlung: Beruhigen, Atemführung, langsam ausatmen.' },
              { titel: '🫀 Vasovagale Synkope (Ohnmacht)', text: 'Plötzliche Parasympathikus-Überaktivität → Herzfrequenz ↓, Blutdruck ↓ → kurze Bewusstlosigkeit. Ursachen: Hitze, Stress, Schmerz, langes Stehen. Im Wasser lebensgefährlich!' },
              { titel: '⚡ Elektrozwischenfälle', text: 'Stromschlag → Nerven werden unkontrolliert aktiviert → Muskelkrämpfe, Bewusstlosigkeit, Herzrhythmusstörungen. Eigenschutz! Person nicht berühren solange unter Strom.' },
              { titel: '🧠 Gehirnerschütterung', text: 'Kopfsprung in flaches Wasser / Sturz: Kurze Bewusstlosigkeit, Erinnerungslücke, Übelkeit. Immer Arzt! Person aus dem Wasser holen und 24h beobachten.' },
            ].map(({ titel, text }) => (
              <div key={titel} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>
        </div>
      )}
    </div>
  );
}
