import { useState } from 'react';

const TABS = {
  bestandteile: { label: 'Bestandteile', icon: '🩸' },
  blutgruppen:  { label: 'Blutgruppen', icon: '🔬' },
  gerinnung:    { label: 'Gerinnung', icon: '🩹' },
  transport:    { label: 'Sauerstofftransport', icon: '💨' },
  bad:          { label: 'Im Badebetrieb', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{title}</h3>}
    {children}
  </div>
);

// SVG Blutbestandteile Kreisdiagramm
const BlutSVG = ({ darkMode }) => (
  <svg viewBox="0 0 280 130" className="w-full mb-3">
    <rect width="280" height="130" fill={darkMode ? '#0f172a' : '#f8fafc'} rx="12"/>
    {/* Großer Kreis = Gesamtblut */}
    <circle cx="90" cy="65" r="55" fill={darkMode ? '#7f1d1d' : '#fecaca'} stroke={darkMode ? '#f87171' : '#dc2626'} strokeWidth="1.5"/>
    {/* Plasma Segment (55%) */}
    <path d="M90,65 L90,10 A55,55 0 0,1 90,120 Z" fill={darkMode ? '#fbbf24' : '#fef3c7'} opacity="0.85"/>
    {/* Erythrozyten Segment (44%) */}
    <path d="M90,65 L90,120 A55,55 0 1,1 90,10 Z" fill={darkMode ? '#dc2626' : '#fca5a5'} opacity="0.85"/>
    {/* Labels */}
    <text x="65" y="60" textAnchor="middle" fontSize="9" fill={darkMode ? '#fbbf24' : '#92400e'} fontWeight="bold">Plasma</text>
    <text x="65" y="71" textAnchor="middle" fontSize="8" fill={darkMode ? '#fbbf24' : '#92400e'}>~55%</text>
    <text x="115" y="88" textAnchor="middle" fontSize="9" fill={darkMode ? '#fee2e2' : '#7f1d1d'} fontWeight="bold">Erythro-</text>
    <text x="115" y="99" textAnchor="middle" fontSize="9" fill={darkMode ? '#fee2e2' : '#7f1d1d'} fontWeight="bold">zyten</text>
    <text x="115" y="110" textAnchor="middle" fontSize="8" fill={darkMode ? '#fee2e2' : '#7f1d1d'}>~44%</text>
    {/* Legende */}
    <rect x="165" y="20" width="10" height="10" rx="2" fill={darkMode ? '#fbbf24' : '#fef3c7'} stroke={darkMode ? '#f59e0b' : '#d97706'} strokeWidth="1"/>
    <text x="180" y="30" fontSize="8" fill={darkMode ? '#fbbf24' : '#92400e'}>Plasma (Wasser, Proteine, Salze)</text>
    <rect x="165" y="38" width="10" height="10" rx="2" fill={darkMode ? '#dc2626' : '#fca5a5'}/>
    <text x="180" y="48" fontSize="8" fill={darkMode ? '#fca5a5' : '#7f1d1d'}>Erythrozyten (rote Blutkörperchen)</text>
    <rect x="165" y="56" width="10" height="10" rx="2" fill={darkMode ? '#3b82f6' : '#bfdbfe'}/>
    <text x="180" y="66" fontSize="8" fill={darkMode ? '#93c5fd' : '#1d4ed8'}>Leukozyten (~1% weiße)</text>
    <rect x="165" y="74" width="10" height="10" rx="2" fill={darkMode ? '#a78bfa' : '#ede9fe'}/>
    <text x="180" y="84" fontSize="8" fill={darkMode ? '#c4b5fd' : '#7c3aed'}>Thrombozyten (~1% Blutplättchen)</text>
    <text x="140" y="118" textAnchor="middle" fontSize="7" fill={darkMode ? '#64748b' : '#94a3b8'}>Gesamtblutvolumen Erwachsener: ~5–6 Liter</text>
  </svg>
);

export default function BlutDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('bestandteile');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-red-900/60 to-rose-900/40 border border-red-800' : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🩸</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Blut & Kreislauf</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Bestandteile · Blutgruppen · Gerinnung · Sauerstofftransport</p>
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

      {tab === 'bestandteile' && (
        <div>
          <S title="Zusammensetzung des Blutes" darkMode={darkMode}><BlutSVG darkMode={darkMode} /></S>
          <S title="Die 4 Bestandteile im Detail" darkMode={darkMode}>
            {[
              { name: 'Plasma', anteil: '~55 %', farbe: 'amber', inhalt: 'Wasser (90%), Proteine (Albumin, Globuline, Fibrinogen), Salze, Hormone, Nährstoffe, Abfallstoffe', funktion: 'Transport aller gelösten Stoffe, Pufferung des pH-Werts, Immunfunktion (Antikörper)' },
              { name: 'Erythrozyten', anteil: '~44 %', farbe: 'red', inhalt: 'Kernlos, bikonkav, voller Hämoglobin. Lebenszeit: ~120 Tage. Produktion im Knochenmark.', funktion: 'O₂-Transport (gebunden an Hb), CO₂-Transport (als HCO₃⁻)' },
              { name: 'Leukozyten', anteil: '< 1 %', farbe: 'blue', inhalt: 'Kernhaltig, verschiedene Typen (Neutrophile, Lymphozyten, Monozyten). 4.000–10.000/µL', funktion: 'Immunabwehr: Bakterien fressen (Phagozytose), Antikörper bilden, Viren bekämpfen' },
              { name: 'Thrombozyten', anteil: '< 1 %', farbe: 'purple', inhalt: 'Kernlos, kleinste Blutzellen. 150.000–400.000/µL. Lebenszeit: ~10 Tage.', funktion: 'Blutgerinnung: verklumpen an Wundstellen, aktivieren Gerinnungskaskade' },
            ].map(({ name, anteil, farbe, inhalt, funktion }) => {
              const cols = {
                amber: darkMode ? 'border-amber-600 bg-amber-900/20' : 'border-amber-400 bg-amber-50',
                red: darkMode ? 'border-red-600 bg-red-900/20' : 'border-red-400 bg-red-50',
                blue: darkMode ? 'border-blue-600 bg-blue-900/20' : 'border-blue-400 bg-blue-50',
                purple: darkMode ? 'border-purple-600 bg-purple-900/20' : 'border-purple-400 bg-purple-50',
              };
              const tc = { amber: darkMode ? 'text-amber-400' : 'text-amber-700', red: darkMode ? 'text-red-400' : 'text-red-700', blue: darkMode ? 'text-blue-400' : 'text-blue-700', purple: darkMode ? 'text-purple-400' : 'text-purple-700' };
              return (
                <div key={name} className={`rounded-xl border-l-4 p-3 mb-3 ${cols[farbe]}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${tc[farbe]}`}>{name}</span>
                    <span className={`text-xs font-mono ${tc[farbe]}`}>{anteil}</span>
                  </div>
                  <div className={`text-xs mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}><strong>Inhalt:</strong> {inhalt}</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}><strong>Funktion:</strong> {funktion}</div>
                </div>
              );
            })}
          </S>
        </div>
      )}

      {tab === 'blutgruppen' && (
        <div>
          <S title="ABO-System" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Blutgruppen werden durch Antigene (Merkmale) auf der Oberfläche der Erythrozyten und Antikörper im Plasma bestimmt.
            </div>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Blutgruppe</th><th className="text-left p-2">Antigen</th><th className="text-left p-2">Antikörper</th><th className="text-left p-2">Häufigkeit (D)</th></tr>
                </thead>
                <tbody>
                  {[
                    ['A', 'A', 'Anti-B', '43 %'],
                    ['B', 'B', 'Anti-A', '11 %'],
                    ['AB', 'A + B', 'Keine', '5 % — Universalempfänger'],
                    ['0', 'Keine', 'Anti-A + Anti-B', '41 % — Universalspender'],
                  ].map(([bg, ag, ak, h], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className={`p-2 font-black text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{bg}</td>
                      <td className="p-2">{ag}</td>
                      <td className="p-2">{ak}</td>
                      <td className={`p-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{h}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
          <S title="Rhesusfaktor" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Rh+ (positiv):</strong> Rhesus-Antigen D auf Erythrozyten vorhanden. ~85% der Deutschen.</div>
              <div><strong>Rh− (negativ):</strong> Kein D-Antigen. ~15% der Deutschen.</div>
              <div className={`rounded p-2 border-l-4 border-red-500 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                <strong>Rhesusunverträglichkeit:</strong> Rh−-Mutter + Rh+-Kind → Mutter bildet Antikörper → gefährlich bei Folgeschwangerschaft (Morbus haemolyticus neonatorum). Prophylaxe: Anti-D-Injektion.
              </div>
              <div><strong>Vollständige Blutgruppe:</strong> z. B. A Rh+ = „A positiv" | 0 Rh− = „0 negativ" (seltenster Universalspender)</div>
            </div>
          </S>
        </div>
      )}

      {tab === 'gerinnung' && (
        <div>
          <S title="Blutstillung in 3 Phasen" darkMode={darkMode}>
            {[
              { nr: '1', name: 'Gefäßkontraktion', dauer: 'Sekunden', text: 'Verletzte Arterie/Vene zieht sich sofort zusammen → Blutfluss wird vermindert. Nervös-reflektorisch und durch Botenstoffe (Serotonin, Thromboxan).' },
              { nr: '2', name: 'Primäre Hämostase (Thrombozytenaggregation)', dauer: '1–5 Min', text: 'Thrombozyten haften an verletztem Gefäß (Adhäsion) → aktivieren sich → kleben aneinander (Aggregation) → weißer Thrombus entsteht. Hält kleine Wunden dicht.' },
              { nr: '3', name: 'Sekundäre Hämostase (Koagulation)', dauer: '5–15 Min', text: 'Gerinnungskaskade: Viele Gerinnungsfaktoren (I–XIII) aktivieren sich nacheinander → Fibrinogen wird zu Fibrin → stabiles Fibrinnetz verstärkt Thrombus → roter Thrombus (Blutpfropf).' },
            ].map(({ nr, name, dauer, text }) => (
              <div key={nr} className={`rounded-lg p-3 mb-3 flex gap-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{nr}</span>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-bold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{name}</span>
                    <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>(~{dauer})</span>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
                </div>
              </div>
            ))}
          </S>
          <S title="Wundheilung & Fibrinolyse" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div>Nach Wundverschluss: Fibrinolyse löst den Thrombus langsam auf, Narbengewebe (Kollagen) ersetzt ihn.</div>
              <div><strong>Normwerte Gerinnung:</strong> Quick/INR 0,85–1,15 | PTT 25–40 Sek | Thrombozyten 150.000–400.000/µL</div>
              <div className={`rounded p-2 border-l-4 border-amber-500 ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                <strong>Gerinnungshemmer (Antikoagulanzien):</strong> Marcumar/Warfarin, ASS, DOAKs — Badegäste mit Blutverdünnern bluten stärker! Bei Schnittwunden länger Druck halten, Arzt ggf. informieren.
              </div>
            </div>
          </S>
          <S title="Blutstillung im Notfall" darkMode={darkMode}>
            {[
              ['Starke Blutung', 'Direkter Druck auf die Wunde mit sauberem Tuch. Druckverband anlegen. Hochlagerung der Extremität.'],
              ['Arteriell (spritzend)', 'Starker Druck. Bei Extremität: Abbindemanschette als letztes Mittel. 112 rufen.'],
              ['Nasenbluten', 'Nach vorn beugen, Nasenflügel zusammendrücken (10 Min), Kühlpack im Nacken.'],
              ['Innere Blutung', 'Nicht sichtbar! Schockzeichen (Blässe, Tachykardie) beachten. Stabile Seitenlage, 112.'],
            ].map(([situation, massnahme]) => (
              <div key={situation} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{situation}</span>
                <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>{massnahme}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'transport' && (
        <div>
          <S title="Hämoglobin — Sauerstoffträger" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Hämoglobin (Hb) = eisenhaltiger Proteinkomplex in Erythrozyten. Je Molekül: 4 Untereinheiten, jede mit 1 Hämgruppe → bindet je 1 O₂.
            </div>
            {[
              ['Normwerte Hb', 'Männer: 14–18 g/dl | Frauen: 12–16 g/dl'],
              ['Hämoglobin + O₂', 'Oxyhämoglobin (HbO₂) — hellrot (arterielles Blut)'],
              ['Hämoglobin ohne O₂', 'Deoxyhämoglobin — dunkelrot (venöses Blut) — Zyanose = blaue Lippen!'],
              ['Hämoglobin + CO', 'Carboxyhämoglobin (HbCO) — kirschrot — blockiert O₂-Transport → Vergiftung'],
              ['Sauerstoffsättigung (SpO₂)', 'Normal: 95–100%. < 90%: klinisch relevant. < 85%: Lebensgefahr.'],
            ].map(([l, v]) => (
              <div key={l} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{l}: </span>
                <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>{v}</span>
              </div>
            ))}
          </S>
          <S title="Anämie (Blutarmut)" darkMode={darkMode}>
            <div className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Zu wenig Erythrozyten oder Hämoglobin → zu wenig O₂-Transport → Leistungsabfall, Schwindel, Blässe.
            </div>
            {[
              { typ: 'Eisenmangelanämie', ursache: 'Häufigste Form. Zu wenig Eisen → kein Hb-Aufbau.' },
              { typ: 'Perniziöse Anämie', ursache: 'Vitamin-B₁₂-Mangel → Erythrozyten reifen nicht aus.' },
              { typ: 'Blutungsanämie', ursache: 'Starke/chronische Blutung → Blutverlust.' },
            ].map(({ typ, ursache }) => (
              <div key={typ} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{typ}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{ursache}</div>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'bad' && (
        <div>
          <S title="Blut & Kreislauf im Badebetrieb" darkMode={darkMode}>
            {[
              { titel: '🩸 Blutungsversorgung im Bad', text: 'Druckverband aus dem Erste-Hilfe-Koffer. Hansaplast für kleine Wunden. Kein Betreten des Beckens mit offenen Wunden (Infektionsschutz, Poolhygiene §37 IfSG).' },
              { titel: '💉 Blutverdünner-Patienten', text: 'Marcumar, Eliquis, Xarelto → stärkere Blutung. Länger Druck halten. Bei Sturz mit Kopfverletzung immer 112 — innere Blutung möglich.' },
              { titel: '😵 Schock erkennen', text: 'Hypovolämischer Schock (Blutverlust): Blässe, Kaltschweiss, Tachykardie, Blutdruckabfall, Bewusstseinseintrübung. Beine hoch, warm halten, 112.' },
              { titel: '🌡️ Hitzeschlag & Blutverteilung', text: 'Bei starker Hitze: Blut wird zur Haut umverteilt (Kühlung) → Gehirn und Herz werden schlechter versorgt → Kollaps/Hitzschlag. Sofort kühlen + 112.' },
              { titel: '🦠 Blut im Wasser', text: 'Geringe Mengen: kein sofortiges Schließen nötig (Chlor desinfiziert). Größere Blutmengen: Badebetrieb unterbrechen, Wasser hygieniisch aufbereiten. Protokollpflicht!' },
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
