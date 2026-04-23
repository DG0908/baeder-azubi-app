import { useState } from 'react';

const TABS = {
  auge:        { label: 'Auge', icon: '👁️' },
  ohr:         { label: 'Ohr', icon: '👂' },
  gleichgewicht:{ label: 'Gleichgewicht', icon: '⚖️' },
  nase:        { label: 'Nase & Geruch', icon: '👃' },
  haut_tast:   { label: 'Haut & Tastsinn', icon: '🖐️' },
  bad:         { label: 'Im Badebetrieb', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{title}</h3>}
    {children}
  </div>
);

const Row = ({ label, value, darkMode }) => (
  <div className={`flex justify-between items-start py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
    <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{label}</span>
    <span className={`text-right max-w-[60%] ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{value}</span>
  </div>
);

const Card = ({ titel, text, darkMode, color = 'red' }) => {
  const tc = { red: darkMode ? 'text-red-400' : 'text-red-700', amber: darkMode ? 'text-amber-400' : 'text-amber-700', blue: darkMode ? 'text-blue-400' : 'text-blue-700', green: darkMode ? 'text-green-400' : 'text-green-700' };
  return (
    <div className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
      <div className={`text-xs font-semibold mb-1 ${tc[color]}`}>{titel}</div>
      <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
    </div>
  );
};

const Warn = ({ children, darkMode }) => (
  <div className={`rounded-lg p-3 mb-3 border-l-4 border-red-500 text-xs ${darkMode ? 'bg-red-900/20 text-slate-300' : 'bg-red-50 text-gray-700'}`}>{children}</div>
);

const Tipp = ({ children, darkMode }) => (
  <div className={`rounded-lg p-3 mb-3 border-l-4 border-emerald-500 text-xs ${darkMode ? 'bg-emerald-900/20 text-slate-300' : 'bg-emerald-50 text-gray-700'}`}>{children}</div>
);

// ── SVG Auge ──────────────────────────────────────────────────────────────────
const AugeSVG = ({ darkMode }) => (
  <svg viewBox="0 0 280 150" className="w-full mb-3">
    <rect width="280" height="150" fill={darkMode ? '#0f172a' : '#f8fafc'} rx="12"/>
    {/* Augapfel */}
    <circle cx="120" cy="75" r="55" fill={darkMode ? '#e2e8f0' : '#f1f5f9'} stroke={darkMode ? '#94a3b8' : '#64748b'} strokeWidth="1.5"/>
    {/* Sklera Label */}
    <text x="120" y="20" textAnchor="middle" fontSize="8" fill={darkMode ? '#64748b' : '#94a3b8'}>Sklera (weiße Lederhaut)</text>
    <line x1="120" y1="22" x2="120" y2="29" stroke={darkMode ? '#64748b' : '#94a3b8'} strokeWidth="0.8"/>
    {/* Iris */}
    <circle cx="120" cy="75" r="28" fill={darkMode ? '#1e40af' : '#bfdbfe'} stroke={darkMode ? '#3b82f6' : '#2563eb'} strokeWidth="1.5"/>
    {/* Pupille */}
    <circle cx="120" cy="75" r="12" fill="#0f172a"/>
    <text x="120" y="79" textAnchor="middle" fontSize="7" fill="white">Pupille</text>
    {/* Hornhaut (Überwölbung) */}
    <path d="M92,75 Q92,47 120,47 Q148,47 148,75" fill={darkMode ? '#bfdbfe' : '#dbeafe'} opacity="0.5" stroke={darkMode ? '#60a5fa' : '#3b82f6'} strokeWidth="1.2"/>
    <text x="120" y="43" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#60a5fa' : '#2563eb'}>Hornhaut (Cornea)</text>
    {/* Netzhaut Markierung */}
    <path d="M65,75 Q65,130 120,130 Q175,130 175,75" fill="none" stroke={darkMode ? '#f87171' : '#dc2626'} strokeWidth="2" strokeDasharray="4,2"/>
    <text x="120" y="142" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#f87171' : '#dc2626'}>Netzhaut (Retina) — Stäbchen + Zapfen</text>
    {/* Linse */}
    <ellipse cx="120" cy="75" rx="8" ry="16" fill={darkMode ? '#fef3c7' : '#fef9c3'} stroke={darkMode ? '#f59e0b' : '#d97706'} strokeWidth="1.2"/>
    <text x="137" y="63" fontSize="7" fill={darkMode ? '#f59e0b' : '#92400e'}>Linse</text>
    {/* Sehnerv */}
    <line x1="175" y1="75" x2="230" y2="75" stroke={darkMode ? '#a78bfa' : '#7c3aed'} strokeWidth="3" strokeLinecap="round"/>
    <circle cx="175" cy="75" r="5" fill={darkMode ? '#7c3aed' : '#ede9fe'} stroke={darkMode ? '#a78bfa' : '#7c3aed'} strokeWidth="1.5"/>
    <text x="200" y="68" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#a78bfa' : '#7c3aed'}>Sehnerv</text>
    <text x="175" y="92" textAnchor="middle" fontSize="7" fill={darkMode ? '#64748b' : '#94a3b8'}>Bl. Fleck</text>
    {/* Glaskörper Label */}
    <text x="151" y="87" fontSize="7" fill={darkMode ? '#64748b' : '#94a3b8'}>Glaskörper</text>
    {/* Iris Label */}
    <text x="83" y="62" fontSize="7.5" fill={darkMode ? '#93c5fd' : '#1d4ed8'}>Iris</text>
  </svg>
);

// ── SVG Ohr ──────────────────────────────────────────────────────────────────
const OhrSVG = ({ darkMode }) => (
  <svg viewBox="0 0 280 160" className="w-full mb-3">
    <rect width="280" height="160" fill={darkMode ? '#0f172a' : '#f8fafc'} rx="12"/>
    {/* Außenohr */}
    <path d="M10,80 Q30,40 60,50 Q80,55 85,80 Q80,105 60,110 Q30,120 10,80Z" fill={darkMode ? '#fcd34d' : '#fef3c7'} stroke={darkMode ? '#f59e0b' : '#d97706'} strokeWidth="1.5"/>
    <text x="40" y="80" textAnchor="middle" fontSize="8" fill={darkMode ? '#92400e' : '#78350f'} fontWeight="bold">Ohr-</text>
    <text x="40" y="91" textAnchor="middle" fontSize="8" fill={darkMode ? '#92400e' : '#78350f'} fontWeight="bold">muschel</text>
    {/* Gehörgang */}
    <rect x="85" y="68" width="50" height="24" rx="4" fill={darkMode ? '#e2d8bc' : '#fef9c3'} stroke={darkMode ? '#b45309' : '#92400e'} strokeWidth="1.2"/>
    <text x="110" y="83" textAnchor="middle" fontSize="8" fill={darkMode ? '#92400e' : '#78350f'}>Gehörgang</text>
    {/* Trommelfell */}
    <ellipse cx="138" cy="80" rx="5" ry="14" fill={darkMode ? '#fca5a5' : '#fee2e2'} stroke={darkMode ? '#f87171' : '#dc2626'} strokeWidth="1.5"/>
    <text x="138" y="105" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#f87171' : '#dc2626'}>Trommel-</text>
    <text x="138" y="114" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#f87171' : '#dc2626'}>fell</text>
    {/* Mittelohr */}
    <rect x="143" y="62" width="50" height="36" rx="6" fill={darkMode ? '#ddd6fe' : '#ede9fe'} stroke={darkMode ? '#a78bfa' : '#7c3aed'} strokeWidth="1.2"/>
    {/* Gehörknöchelchen */}
    <text x="168" y="76" textAnchor="middle" fontSize="7" fill={darkMode ? '#7c3aed' : '#5b21b6'} fontWeight="bold">Hammer</text>
    <text x="168" y="86" textAnchor="middle" fontSize="7" fill={darkMode ? '#7c3aed' : '#5b21b6'}>Amboss</text>
    <text x="168" y="96" textAnchor="middle" fontSize="7" fill={darkMode ? '#7c3aed' : '#5b21b6'}>Steigbügel</text>
    <text x="168" y="107" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#a78bfa' : '#6d28d9'}>Mittelohr</text>
    {/* Innenohr */}
    <ellipse cx="230" cy="70" rx="30" ry="25" fill={darkMode ? '#bbf7d0' : '#d1fae5'} stroke={darkMode ? '#34d399' : '#059669'} strokeWidth="1.5"/>
    <text x="230" y="60" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#059669' : '#065f46'} fontWeight="bold">Cochlea</text>
    <text x="230" y="70" textAnchor="middle" fontSize="7" fill={darkMode ? '#34d399' : '#065f46'}>(Hörschnecke)</text>
    <ellipse cx="230" cy="92" rx="22" ry="14" fill={darkMode ? '#a5f3fc' : '#cffafe'} stroke={darkMode ? '#22d3ee' : '#0891b2'} strokeWidth="1.5"/>
    <text x="230" y="96" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#0891b2' : '#0e7490'}>Vestibular-</text>
    <text x="230" y="105" textAnchor="middle" fontSize="7" fill={darkMode ? '#0891b2' : '#0e7490'}>apparat</text>
    {/* Bereiche Label */}
    <text x="40" y="148" textAnchor="middle" fontSize="8" fill={darkMode ? '#f59e0b' : '#92400e'} fontWeight="bold">Außenohr</text>
    <text x="168" y="148" textAnchor="middle" fontSize="8" fill={darkMode ? '#a78bfa' : '#7c3aed'} fontWeight="bold">Mittelohr</text>
    <text x="230" y="148" textAnchor="middle" fontSize="8" fill={darkMode ? '#34d399' : '#059669'} fontWeight="bold">Innenohr</text>
  </svg>
);

// ── SVG Nase ─────────────────────────────────────────────────────────────────
const NaseSVG = ({ darkMode }) => (
  <svg viewBox="0 0 280 130" className="w-full mb-3">
    <rect width="280" height="130" fill={darkMode ? '#0f172a' : '#f8fafc'} rx="12"/>
    {/* Nasenquerschnitt */}
    <path d="M90,20 Q140,10 190,20 L195,90 Q140,110 85,90 Z" fill={darkMode ? '#fecdd3' : '#ffe4e6'} stroke={darkMode ? '#fb7185' : '#f43f5e'} strokeWidth="1.5"/>
    {/* Nasenscheidewand */}
    <line x1="140" y1="15" x2="140" y2="95" stroke={darkMode ? '#f43f5e' : '#e11d48'} strokeWidth="2" strokeDasharray="4,2"/>
    <text x="140" y="9" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#fb7185' : '#be123c'}>Septum</text>
    {/* Riechschleimhaut oben */}
    <rect x="95" y="22" width="40" height="12" rx="4" fill={darkMode ? '#fbbf24' : '#fef3c7'} stroke={darkMode ? '#f59e0b' : '#d97706'} strokeWidth="1.2"/>
    <rect x="145" y="22" width="40" height="12" rx="4" fill={darkMode ? '#fbbf24' : '#fef3c7'} stroke={darkMode ? '#f59e0b' : '#d97706'} strokeWidth="1.2"/>
    <text x="140" y="31" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#92400e' : '#78350f'}>Riechepithel (Olfaktorisch)</text>
    {/* Nasenmuschelschichten */}
    {[40, 55, 70].map((y, i) => (
      <g key={i}>
        <path d={`M95,${y} Q140,${y-5} 185,${y}`} fill="none" stroke={darkMode ? '#f9a8d4' : '#fbcfe8'} strokeWidth="5" strokeLinecap="round" opacity="0.7"/>
        <text x="220" y={y+3} fontSize="7" fill={darkMode ? '#f9a8d4' : '#9d174d'}>{['Obere', 'Mittlere', 'Untere'][i]} Muschel</text>
      </g>
    ))}
    {/* Riechnerv */}
    <line x1="115" y1="22" x2="100" y2="5" stroke={darkMode ? '#a78bfa' : '#7c3aed'} strokeWidth="2"/>
    <line x1="165" y1="22" x2="180" y2="5" stroke={darkMode ? '#a78bfa' : '#7c3aed'} strokeWidth="2"/>
    <text x="140" y="4" textAnchor="middle" fontSize="7.5" fill={darkMode ? '#a78bfa' : '#7c3aed'}>N. olfactorius → Gehirn</text>
    {/* Eustachische Röhre */}
    <path d="M140,95 Q155,115 180,120" fill="none" stroke={darkMode ? '#60a5fa' : '#2563eb'} strokeWidth="2" strokeDasharray="3,2"/>
    <text x="185" y="123" fontSize="7.5" fill={darkMode ? '#60a5fa' : '#2563eb'}>Eustachische Röhre → Ohr</text>
  </svg>
);

// ── Hauptkomponente ────────────────────────────────────────────────────────────
export default function SinnesorganeDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('auge');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`rounded-2xl p-5 mb-5 ${darkMode
        ? 'bg-gradient-to-br from-red-900/60 to-rose-900/40 border border-red-800'
        : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">👁️</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Sinnesorgane</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Auge · Ohr · Gleichgewicht · Nase · Tastsinn · Badebetrieb
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {/* ── AUGE ─────────────────────────────────────────────────────────── */}
      {tab === 'auge' && (
        <div>
          <S title="Aufbau des Auges" darkMode={darkMode}>
            <AugeSVG darkMode={darkMode} />
            {[
              ['Hornhaut (Cornea)', 'Vordere, gewölbte Schicht — bricht Licht, hat keine Blutgefäße (ernährt sich durch Kammerwasser). Extrem empfindlich.'],
              ['Iris (Regenbogenhaut)', 'Muskeln regulieren Pupillengröße je nach Lichteinfall (Miosis = eng, Mydriasis = weit).'],
              ['Linse', 'Elastisch, verformt sich durch Ziliarmuskel → Akkommodation (Scharfstellung nah/fern). Verliert mit Alter Elastizität → Alterssichtigkeit.'],
              ['Netzhaut (Retina)', '~120 Mio. Stäbchen (Dämmerungs-/Schwarzweiß-Sehen) + ~6 Mio. Zapfen (Farbsehen, nur in Fovea). Dort schärfstes Sehen.'],
              ['Sehnerv (N. opticus)', 'Leitet Signale ans Sehzentrum (Okzipitallappen Gehirn). Eintritt = blinder Fleck — keine Rezeptoren!'],
              ['Glaskörper', 'Transparente Gallerte — erhält Augapfelform. Im Alter Trübungen möglich (Mouches volantes).'],
              ['Sklera', 'Weiße Lederhaut — Schutz und Formgebung des Augapfels.'],
            ].map(([l, v]) => <Row key={l} label={l} value={v} darkMode={darkMode} />)}
          </S>
          <S title="Sehvorgang" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Licht → Hornhaut (Brechung) → Linse (Fokussierung) → Glaskörper → Netzhaut (Stäbchen/Zapfen wandeln Licht in Nervenimpulse um) → Sehnerv → Sehzentrum im Hinterhaupt (Okzipitallappen).
            </div>
            <Card titel="Photopisches Sehen (Tagessehen)" text="Zapfen aktiv — Farbsehen, hohe Auflösung. 3 Typen: L (rot), M (grün), S (blau). Rot-Grün-Schwäche = Zapfendefekt (häufigste Farbfehlsichtigkeit, X-chromosomal, 8% der Männer)." darkMode={darkMode} />
            <Card titel="Skotopisches Sehen (Dämmerungssehen)" text="Stäbchen aktiv — kein Farbunterschied, aber sehr lichtempfindlich. Rhodopsin (Sehpurpur) reagiert auf Lichtschwache. Bei Dunkelheit 20–30 Min Adaptation nötig." darkMode={darkMode} />
          </S>
          <S title="Häufige Sehfehler" darkMode={darkMode}>
            {[
              { name: 'Kurzsichtigkeit (Myopie)', ursache: 'Augapfel zu lang → Bild vor der Retina. Korretur: konkave Linse (−).' },
              { name: 'Weitsichtigkeit (Hyperopie)', ursache: 'Augapfel zu kurz → Bild hinter der Retina. Korrektur: konvexe Linse (+).' },
              { name: 'Astigmatismus', ursache: 'Unregelmäßige Hornhautkrümmung → verzerrtes Bild. Korrektur: Zylinderlinse.' },
              { name: 'Presbyopie (Alterssichtigkeit)', ursache: 'Linse verliert ab ~45 Jahren Elastizität → keine Nahakkommodation mehr. Lesebrille nötig.' },
            ].map(({ name, ursache }) => (
              <div key={name} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{name}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{ursache}</div>
              </div>
            ))}
          </S>
          <S title="Augenverletzungen im Bad — Erstversorgung" darkMode={darkMode}>
            {[
              { icon: '🧪', problem: 'Chlorreizung (Konjunktivitis)', maßnahme: 'Auge mit klarem Wasser spülen, kurz ausruhen. Schutzbrille trägt vor Chloraminen. Wasserqualität prüfen.' },
              { icon: '🪨', problem: 'Fremdkörper', maßnahme: 'Mit Wasser spülen — NICHT reiben! Eingebetteter FK: sterile Abdeckung, Augenarzt. Kein Herausziehen!' },
              { icon: '💥', problem: 'Stumpfes Trauma (Aufprall)', maßnahme: 'KEIN Druck auf Auge! Sterile Abdeckung, Kopf höher lagern, 112. Beide Augen abdecken (Mitbewegung).' },
              { icon: '☣️', problem: 'Verätzung (Chemikalien)', maßnahme: '15+ Min. Spülen mit viel Wasser, Augenlid aufhalten! 112 rufen. Immer Notaufnahme — Hornhaut kann dauerhaft geschädigt werden.' },
            ].map(({ icon, problem, maßnahme }) => (
              <div key={problem} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{icon} {problem}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>→ {maßnahme}</div>
              </div>
            ))}
            <Tipp darkMode={darkMode}>
              <strong>Pupillenkontrolle im Notfall:</strong> Gleichgroß + lichtreaktiv = normal ✅ | Weit + starr = Schock/Herzstillstand 🔴 | Ungleich = Hirnverletzung 🔴 → 112!
            </Tipp>
          </S>
        </div>
      )}

      {/* ── OHR ──────────────────────────────────────────────────────────── */}
      {tab === 'ohr' && (
        <div>
          <S title="Aufbau des Ohres" darkMode={darkMode}>
            <OhrSVG darkMode={darkMode} />
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Bereich</th><th className="text-left p-2">Strukturen</th><th className="text-left p-2">Funktion</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Außenohr', 'Ohrmuschel + Gehörgang (2,5 cm)', 'Schallfang, Schallleitung zum Trommelfell'],
                    ['Mittelohr', 'Trommelfell + Hammer + Amboss + Steigbügel + Eustachische Röhre', 'Schallverstärkung (ca. 20-fach), Druckausgleich zur Nase'],
                    ['Innenohr', 'Cochlea (Hörschnecke) + Vestibularapparat (Bogengänge, Sacculus, Utriculus)', 'Schall → Nervenimpuls (Hören) + Gleichgewicht'],
                  ].map(([b, s, f], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-semibold">{b}</td>
                      <td className="p-2">{s}</td>
                      <td className="p-2">{f}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
          <S title="Hörvorgang" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Schallwellen → Trommelfell vibriert → Gehörknöchelchen leiten und verstärken → ovales Fenster (Cochlea) → Perilymphe schwingt → Haarzellen (Corti-Organ) umwandeln in Nervenimpulse → Hörnerv (N. vestibulocochlearis) → Hörzentrum (Temporallappen).
            </div>
            <Card titel="Frequenzbereich Mensch" text="20 Hz – 20.000 Hz. Mit dem Alter sinkt die obere Grenze (Hochtonverlust). Sprache liegt bei 300–3.000 Hz. Schmerzschwelle: ~130 dB." darkMode={darkMode} />
            <Card titel="Haarzellen" text="Nur ca. 16.000 im Corti-Organ — nicht regenerierbar! Lärm, Medikamente (Aspirin, Chinin) und Alter können sie dauerhaft schädigen → Tinnitus, Schwerhörigkeit." darkMode={darkMode} color="amber" />
          </S>
          <S title="Badebezogene Ohrprobleme" darkMode={darkMode}>
            {[
              { p: 'Schwimmerohr (Otitis externa)', u: 'Chronische Feuchtigkeit im Gehörgang → pH-Veränderung → Bakterien/Pilze', z: 'Jucken, Schmerz, Druckschmerz am Ohr, Ausfluss', m: 'Ohren nach dem Baden trocknen (Kopf neigen, keine Wattestäbchen!), Ohrenstöpsel beim Schwimmen, Arzt bei Infektion.' },
              { p: 'Mittelohrentzündung (Otitis media)', u: 'Keime über Eustachische Röhre aus Nase-Rachen → besonders häufig bei Kindern', z: 'Ohrenschmerzen, Druckgefühl, Fieber, Hörverlust', m: 'Arzt, Antibiotika. Bei Trommelfellriss kein Schwimmen bis zur Heilung!' },
              { p: 'Barotrauma (Tauchen)', u: 'Druckdifferenz bei nicht offenem Druckausgleich → Trommelfell kann reißen', z: 'Stechender Schmerz, plötzlicher Hörverlust, Schwindel, ggf. Blutung', m: 'Aufsteigen, Valsalva-Manöver vorher. NICHT tauchen bei Schnupfen!' },
              { p: 'Fremdkörper im Ohr', u: 'Insekten, Schmutzteilchen, Sandkörner', z: 'Druckgefühl, Knistern, Taubheit', m: 'NICHT stochern! Seitlich neigen, Wasser einlaufen lassen. HNO-Arzt.' },
            ].map(({ p, u, z, m }) => (
              <div key={p} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{p}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}><strong>Ursache:</strong> {u}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}><strong>Zeichen:</strong> {z}</div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>→ {m}</div>
              </div>
            ))}
          </S>
        </div>
      )}

      {/* ── GLEICHGEWICHT ────────────────────────────────────────────────── */}
      {tab === 'gleichgewicht' && (
        <div>
          <S title="Der Vestibularapparat (Gleichgewichtsorgan)" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Sitzt im <strong>Innenohr</strong>, direkt neben der Cochlea. Besteht aus zwei Teilen:
            </div>
            {[
              { name: '3 Bogengänge', detail: 'Stehen senkrecht aufeinander (3 Raumebenen). Erfassen Drehbeschleunigungen (Rotation). Endolymphe verschiebt sich → Haarzellen werden gereizt → Nervenimpuls.' },
              { name: 'Utriculus & Sacculus (Makulaorgane)', detail: 'Erfassen lineare Beschleunigung und Schwerkraftrichtung. Otokonien (Kalziumkristalle, "Ohrsteine") lagern auf Gallertemembran — drücken je nach Neigung auf Haarzellen.' },
            ].map(({ name, detail }) => (
              <div key={name} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{name}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{detail}</div>
              </div>
            ))}
          </S>
          <S title="3 Sinneskanäle für Gleichgewicht" darkMode={darkMode}>
            <div className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Das Gehirn kombiniert 3 Informationsquellen:
            </div>
            {[
              { organ: '👁️ Visuell (Augen)', beitrag: 'Referenz: Horizont, vertikale Linien', ausfall: 'Im Dunkeln oder unter Wasser stark eingeschränkt' },
              { organ: '⚖️ Vestibulär (Innenohr)', beitrag: 'Beschleunigungen und Neigung', ausfall: 'Entzündung, Wasser, Druck → Schwindel' },
              { organ: '🦵 Propriozeptiv (Muskeln/Gelenke)', beitrag: 'Körperhaltung, Bewegung der Gliedmaßen', ausfall: 'Kälte, Taubheit, Alkohol → reduziert' },
            ].map(({ organ, beitrag, ausfall }) => (
              <div key={organ} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{organ}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}><strong>Beitrag:</strong> {beitrag}</div>
                <div className={`text-xs ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}><strong>Ausfall:</strong> {ausfall}</div>
              </div>
            ))}
          </S>
          <S title="Gleichgewichtsstörungen & Schwindel" darkMode={darkMode}>
            {[
              { name: 'Benigner paroxysmaler Lagerungsschwindel (BPLS)', text: 'Häufigste Ursache. Otokonien lösen sich und wandern in Bogengänge. Kurze Schwindelattacken bei Kopfbewegung. Therapie: Lagerungsmanöver (Epley).' },
              { name: 'Vestibuläre Neuritis', text: 'Entzündung des Gleichgewichtsnervs (oft viral). Starker Drehschwindel, Übelkeit, kein Hörverlust. Tage bis Wochen anhaltend.' },
              { name: 'Kalorischer Nystagmus', text: 'Kaltes/warmes Wasser im Ohr → Endolymphe strömt → Bogengänge aktiviert → Augenzittern (Nystagmus) + Schwindel. Bei Schwimmern nach Wasser im Ohr.' },
            ].map(({ name, text }) => (
              <div key={name} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{name}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
            <Warn darkMode={darkMode}>
              <strong>Unter Wasser:</strong> Ohne Sichtkontakt zur Wasseroberfläche kann das Gleichgewichtsorgan "oben" und "unten" verwechseln — besonders in trübem Wasser oder bei Bewusstlosigkeit. Luftblasen steigen immer nach OBEN.
            </Warn>
          </S>
        </div>
      )}

      {/* ── NASE & GERUCH ────────────────────────────────────────────────── */}
      {tab === 'nase' && (
        <div>
          <S title="Aufbau der Nase" darkMode={darkMode}>
            <NaseSVG darkMode={darkMode} />
            {[
              ['Nasenmuscheln (3 Paare)', 'Große Oberfläche für Erwärmung, Befeuchtung, Filterung der Atemluft. Schleimhaut fängt Staub und Keime.'],
              ['Riechepithel (Regio olfactoria)', 'Oben im Nasengewölbe — ~5 cm². ~10–20 Mio. Riechrezeptoren. Einziger direkter Kontakt des Nervensystems mit der Außenwelt.'],
              ['Riechnerv (N. olfactorius)', 'Führt durch Siebbein direkt in den Riechkolben (Bulbus olfactorius) im Gehirn. Kurzer Weg → Geruch löst starke emotionale Reaktionen aus (limbisches System).'],
              ['Eustachische Röhre', 'Verbindet Nasopharynx mit Mittelohr → Druckausgleich beim Schlucken/Gähnen.'],
              ['Nasennebenhöhlen', '4 Paare (Stirn-, Kiefer-, Siebbein-, Keilbeinhöhlen) — luftgefüllt, ressonieren Stimme, können sich entzünden (Sinusitis).'],
            ].map(([l, v]) => <Row key={l} label={l} value={v} darkMode={darkMode} />)}
          </S>
          <S title="Riechvorgang (Olfaktion)" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Duftstoffe (flüchtige Moleküle) → lösen sich in Nasenschleim → binden an Riechrezeptoren (G-Protein-gekoppelt) → elektrisches Signal → N. olfactorius → Bulbus olfactorius → Riechzentrum + limbisches System.
            </div>
            <Card titel="~10.000 Gerüche erkennbar" text="Trotz ~400 verschiedener Rezeptortypen. Kombinationen ergeben die Vielfalt — ähnlich wie Farben aus 3 Grundfarben." darkMode={darkMode} />
            <Card titel="Geruchsadaptation" text="Anhaltender Geruch wird nach ca. 1 Min. nicht mehr bewusst wahrgenommen — Rezeptoren adaptieren. Deshalb riecht man das eigene Parfüm nach kurzer Zeit nicht mehr." darkMode={darkMode} color="blue" />
            <Card titel="Anosmie (Geruchsverlust)" text="Durch Viren (COVID-19!), Trauma, Zinkmangel. Bedeutsam im Bad: Chloramingeruch und Gasaustritt werden nicht mehr wahrgenommen → Sicherheitsgefahr!" darkMode={darkMode} color="amber" />
          </S>
          <S title="Nase im Badebetrieb" darkMode={darkMode}>
            {[
              { titel: '🏊 Wassereintritt beim Tauchen', text: 'Chlorhaltiges Wasser reizt Nasenschleimhaut. Viele Schwimmer atmen durch Nase aus, um Wasser fernzuhalten. Nasenklammer beim Wettkampf-Tauchen.' },
              { titel: '🩸 Nasenbluten (Epistaxis)', text: 'Ursachen: trockene Hallenluft, Stoß, empfindliche Schleimhaut, Blutverdünner. Maßnahme: NACH VORNE beugen (nicht zurück!), Nasenlöcher 10 Min. zudrücken, Kühlpack im Nacken.' },
              { titel: '☣️ Chloramin-Einatmen', text: 'Schlechte Belüftung + überchliertes Wasser → stechender Geruch, Hustenreiz, Augenbrennen. Grenzwert Chloramin: 0,2 mg/m³ Luft. Belüftung prüfen!' },
              { titel: '🌡️ Aspirationsgefahr', text: 'Wasser in Atemwege → Hustenstoß, ggf. Aspiration. Sekundäres Ertrinken: Jede Person die Wasser aspiriert hat → Arzt, auch wenn es ihr gut geht!' },
            ].map(({ titel, text }) => <Card key={titel} titel={titel} text={text} darkMode={darkMode} />)}
          </S>
        </div>
      )}

      {/* ── HAUT & TASTSINN ──────────────────────────────────────────────── */}
      {tab === 'haut_tast' && (
        <div>
          <S title="Die Haut als Sinnesorgan" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die Haut ist das größte Sinnesorgan des Körpers (~1,7 m²) und enthält verschiedene Mechano-, Thermo- und Schmerzrezeptoren.
            </div>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Rezeptor</th><th className="text-left p-2">Reiz</th><th className="text-left p-2">Ort</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Meissner-Körperchen', 'Leichte Berührung, Vibration (niedrig)', 'Fingerbeere, Lippen — präzise Lokalisation'],
                    ['Merkel-Scheiben', 'Dauerdruck, Form', 'Hautleisten (Fingerabdruck)'],
                    ['Ruffini-Körperchen', 'Zug, Dehnung', 'Tiefe Dermis, Gelenke'],
                    ['Pacini-Körperchen', 'Tiefe Vibration, Erschütterung', 'Tiefe Haut, Periost, Gelenke'],
                    ['Freie Nervenendigungen', 'Schmerz, Temperatur', 'Überall — kein Schutzläufer'],
                    ['Kälterezeptoren', 'Kühlung (10–40°C)', 'Oberfläche — Kälte wird schnell wahrgenommen'],
                    ['Wärmerezeptoren', 'Wärme (30–45°C)', 'Tiefer — Wärme braucht länger'],
                  ].map(([r, reiz, ort], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{r}</td>
                      <td className="p-2">{reiz}</td>
                      <td className="p-2">{ort}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
          <S title="Propriozeption — der 6. Sinn" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Propriozeption = Körpereigensinn: Wahrnehmung von Körperposition, Bewegung und Kraft ohne Blickkontrolle.
            </div>
            {[
              { rez: 'Muskelspindeln', fkt: 'Messen Muskellänge und -veränderungsrate → steuern Reflexe (Dehnungsreflex)', bad: 'Schwimmtechnik: Armposition ohne Hinsehen korrigieren' },
              { rez: 'Golgi-Sehnenorgane', fkt: 'Messen Muskelspannung → schützen vor Überdehnung', bad: 'Schutz der Schultersehnen bei Rettungsgriffen' },
              { rez: 'Gelenkrezeptoren', fkt: 'Gelenkstellung und -bewegung', bad: 'Orientierung unter Wasser ohne Sicht' },
            ].map(({ rez, fkt, bad }) => (
              <div key={rez} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{rez}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}><strong>Funktion:</strong> {fkt}</div>
                <div className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}><strong>Im Bad:</strong> {bad}</div>
              </div>
            ))}
          </S>
          <S title="Temperaturwahrnehmung im Bad" darkMode={darkMode}>
            {[
              ['< 15°C', 'Sehr kalt', 'Schmerz, Kälteschock, Muskelkrämpfe, Herzrhythmusstörungen möglich'],
              ['15–24°C', 'Kühl', 'Schwimmtemperatur für Sportler, Freibäder'],
              ['24–28°C', 'Angenehm', 'Standard Hallenbad, Freizeitschwimmen'],
              ['28–32°C', 'Warm', 'Babyschwimmen, Aqua-Fitness, Therapiebecken'],
              ['> 36°C', 'Heiß', 'Whirlpool/Spa-Bereich — Herzbelastung, RR↓, Schwindel möglich'],
            ].map(([temp, einschätzung, effekt]) => (
              <div key={temp} className={`py-1.5 border-b last:border-0 text-xs flex items-start gap-2 ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-mono font-bold w-14 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{temp}</span>
                <span className={`w-16 flex-shrink-0 font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{einschätzung}</span>
                <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>{effekt}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {/* ── IM BADEBETRIEB ───────────────────────────────────────────────── */}
      {tab === 'bad' && (
        <div>
          <S title="Sinnesorgane & Erste Hilfe im Bad" darkMode={darkMode}>
            {[
              { titel: '👁️ Augenverletzungen', text: 'Häufig: Verätzung durch Chlorkonzentrat → 15+ Min. Spülen! Stumpfes Trauma → kein Druck, sterile Abdeckung, 112. Bindehautentzündung durch Chloramine → Wasserqualität prüfen.' },
              { titel: '👂 Schwimmerohr-Prävention', text: 'Ohren nach dem Schwimmen trocknen: Kopf neigen, kurz mit dem Handtuch abtupfen — kein Wattestäbchen! Bei Entzündung: Schwimmpause bis Heilung, Ohrenstöpsel präventiv.' },
              { titel: '⚖️ Schwindel im Wasser', text: 'Wasser im Ohr → kalorischer Nystagmus → Desorientierung. Sofort ans Ufer, ruhig hinsetzen. Bei anhaltendem Schwindel + Hörverlust → Arzt (Barotrauma?).' },
              { titel: '👃 Chloramin-Geruch', text: 'Stechender Geruch = Warnsignal: schlechte Wasserqualität oder Lüftung. Messung: Chloramin > 0,2 mg/m³ = Grenzwert überschritten → Lüftung verbessern, Wasserchemie korrigieren.' },
              { titel: '🖐️ Schmerzwahrnehmung Kälte', text: 'Unterkühlte Badegäste haben eingeschränkte Schmerzwahrnehmung → bemerken Verletzungen nicht. Nach Rettung aus kaltem Wasser: sorgfältige Inspektion auf Verletzungen!' },
              { titel: '🧠 Orientierung unter Wasser', text: 'Vestibular + Propriozeption reichen allein nicht. Zyanose (blaue Lippen) = Sauerstoffmangel → sofort bergen. Tauchen bei Gleichgewichtsstörungen: absolute Kontraindikation!' },
            ].map(({ titel, text }) => (
              <div key={titel} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>
          <S title="Schnellübersicht: Notfall-Reaktion je Sinnesorgan" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Problem</th><th className="text-left p-2">Sofortmaßnahme</th><th className="text-left p-2">Notruf?</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Augenverletzung (Trauma)', 'Sterile Abdeckung, kein Druck, liegend', 'Ja 112'],
                    ['Augenverätzung', '15 Min. Spülen mit viel Wasser', 'Ja 112'],
                    ['Schweres Barotrauma Ohr', 'Ruhig, nicht ausblasen, nicht mehr tauchen', 'Ja 112'],
                    ['Heftiges Nasenbluten > 15 Min', 'Vorwärts beugen, drücken, kühlen', 'Ja 112'],
                    ['Aspiration (Wasser), asymptomatisch', 'Arzt, auch ohne Symptome!', 'Bei Symptomen 112'],
                    ['Schwindel nach Tauchen', 'Ans Ufer, sitzen, beobachten', 'Bei Hörverlust ja'],
                  ].map(([prob, maß, notruf], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2">{prob}</td>
                      <td className="p-2">{maß}</td>
                      <td className={`p-2 font-semibold ${notruf.startsWith('Ja') ? (darkMode ? 'text-red-400' : 'text-red-600') : (darkMode ? 'text-amber-400' : 'text-amber-600')}`}>{notruf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
        </div>
      )}
    </div>
  );
}
