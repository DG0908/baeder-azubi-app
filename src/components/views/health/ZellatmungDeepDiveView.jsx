import { useState } from 'react';

const TABS = {
  ueberblick: { label: 'Überblick', icon: '⚡' },
  aerob:      { label: 'Aerobe Atmung', icon: '🌬️' },
  anaerob:    { label: 'Anaerobe Atmung', icon: '🔥' },
  sport:      { label: 'Sport & Leistung', icon: '🏃' },
  bad:        { label: 'Im Badebetrieb', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{title}</h3>}
    {children}
  </div>
);

const FormelBox = ({ formel, darkMode }) => (
  <div className={`rounded-lg p-3 mb-3 font-mono text-sm text-center border-l-4 border-red-500 ${darkMode ? 'bg-slate-900 text-red-300' : 'bg-red-50 text-red-800'}`}>
    {formel}
  </div>
);

const Schritt = ({ nr, name, ort, atp, text, darkMode, color }) => {
  const colors = {
    blue: darkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-400 bg-blue-50',
    green: darkMode ? 'border-green-500 bg-green-900/20' : 'border-green-400 bg-green-50',
    purple: darkMode ? 'border-purple-500 bg-purple-900/20' : 'border-purple-400 bg-purple-50',
  };
  const titleCol = { blue: darkMode ? 'text-blue-400' : 'text-blue-700', green: darkMode ? 'text-green-400' : 'text-green-700', purple: darkMode ? 'text-purple-400' : 'text-purple-700' };
  return (
    <div className={`rounded-xl border-l-4 p-3 mb-3 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${color === 'blue' ? 'bg-blue-500' : color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}>{nr}</span>
          <span className={`text-xs font-bold ${titleCol[color]}`}>{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>{ort}</span>
          <span className={`text-xs font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{atp} ATP</span>
        </div>
      </div>
      <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{text}</div>
    </div>
  );
};

export default function ZellatmungDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('ueberblick');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-red-900/60 to-orange-900/40 border border-red-800' : 'bg-gradient-to-br from-red-50 to-orange-50 border border-red-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Zellatmung & Energiestoffwechsel</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Aerob · Anaerob · ATP · Laktat · Sport</p>
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

      {tab === 'ueberblick' && (
        <div>
          <S title="Was ist Zellatmung?" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Zellatmung = biochemischer Prozess, bei dem Zellen aus <strong>Glucose + Sauerstoff</strong> Energie in Form von <strong>ATP</strong> gewinnen. Findet in allen Körperzellen statt — besonders intensiv in Muskelzellen.
            </div>
            <FormelBox formel="C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + 36–38 ATP" darkMode={darkMode} />
            <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              → Glucose wird vollständig zu CO₂ und Wasser abgebaut. Die frei werdende Energie wird in ATP (Adenosintriphosphat) gespeichert.
            </div>
          </S>
          <S title="ATP — Die Energiewährung der Zelle" darkMode={darkMode}>
            <div className={`rounded-lg p-3 mb-3 text-center ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className="text-3xl mb-1">⚡</div>
              <div className={`text-sm font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>ATP (Adenosintriphosphat)</div>
              <div className={`text-xs mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Universelle Energiewährung aller Lebewesen</div>
            </div>
            {[
              ['Aufbau', 'Adenosin + 3 Phosphatgruppen. Bei Abspaltung der letzten Phosphatgruppe wird Energie frei.'],
              ['ATP → ADP + Pᵢ + Energie', 'Diese Energie treibt Muskeln, Nervenimpulse, Proteinsynthese an'],
              ['Vorrat in Muskelzelle', 'Nur für ~2 Sekunden Maximalleistung! Muss ständig nachproduziert werden.'],
              ['Regeneration', 'Durch Zellatmung (aerob), Glykolyse (anaerob) oder Kreatinphosphat (sofort)'],
            ].map(([l, v]) => (
              <div key={l} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{l}: </span>
                <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>{v}</span>
              </div>
            ))}
          </S>
          <S title="Aerob vs. Anaerob — Übersicht" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Merkmal</th><th className="text-left p-2 text-blue-400">Aerob</th><th className="text-left p-2 text-orange-400">Anaerob</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Sauerstoff', 'Notwendig', 'Nicht nötig'],
                    ['ATP-Ausbeute', '36–38 ATP', '2 ATP'],
                    ['Endprodukte', 'CO₂ + H₂O', 'Laktat + H⁺'],
                    ['Dauer', 'Dauerhaft möglich', 'Kurze Zeit (< 2 Min)'],
                    ['Geschwindigkeit', 'Langsam', 'Sehr schnell'],
                    ['Beispiel Sport', 'Ausdauerschwimmen', 'Sprint, Tauchen'],
                  ].map(([merkmal, aerob, anaerob], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{merkmal}</td>
                      <td className="p-2 text-blue-400">{aerob}</td>
                      <td className="p-2 text-orange-400">{anaerob}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
        </div>
      )}

      {tab === 'aerob' && (
        <div>
          <S title="Aerobe Zellatmung — 3 Schritte" darkMode={darkMode}>
            <Schritt nr="1" name="Glykolyse" ort="Zytoplasma" atp="2 netto" color="blue" darkMode={darkMode}
              text="Glucose (6C) wird in 2× Pyruvat (3C) gespalten. Netto: 2 ATP + 2 NADH. Kein O₂ nötig — Startschritt auch bei anaerober Atmung." />
            <Schritt nr="2" name="Citratzyklus (Krebszyklus)" ort="Mitochondrien" atp="2" color="green" darkMode={darkMode}
              text="Pyruvat → Acetyl-CoA → läuft 2× durch. Erzeugt viele Elektronen-Träger (NADH, FADH₂) — eigentliche ATP-Ausbeute minimal, aber Vorbereitung für Schritt 3." />
            <Schritt nr="3" name="Atmungskette (oxidative Phosphorylierung)" ort="Mitochondrien-Membran" atp="32–34" color="purple" darkMode={darkMode}
              text="NADH und FADH₂ geben Elektronen ab → Protonengradient → ATP-Synthase produziert massenhaft ATP. O₂ ist der finale Elektronen-Akzeptor → wird zu H₂O." />
          </S>
          <S title="Energiebilanz" darkMode={darkMode}>
            <div className={`text-center rounded-xl p-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`text-4xl font-black mb-1 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>36–38</div>
              <div className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>ATP pro Glucose-Molekül</div>
              <div className={`text-xs mt-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Wirkungsgrad: ~40% (Rest wird als Wärme abgegeben — deshalb wird man beim Sport warm!)
              </div>
            </div>
          </S>
        </div>
      )}

      {tab === 'anaerob' && (
        <div>
          <S title="Anaerobe Glykolyse (Milchsäuregärung)" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Wenn O₂ nicht schnell genug geliefert werden kann (Hochleistung, Tauchen), läuft nur die Glykolyse — ohne Citratzyklus und Atmungskette.
            </div>
            <FormelBox formel="Glucose → 2 Laktat + 2 H⁺ + 2 ATP" darkMode={darkMode} />
            {[
              { name: 'Laktat', text: 'Endprodukt der anaeroben Glykolyse. Wird im Blut gemessen. Normwert Ruhe: < 2 mmol/L. Bei anaerober Schwelle: 4 mmol/L.' },
              { name: 'H⁺ (Wasserstoffionen)', text: 'Senken den pH-Wert in der Muskelzelle → pH-bedingte Muskelermüdung (brennendes Gefühl in den Muskeln).' },
              { name: 'Laktat-Abbau', text: 'Laktat ist KEIN Abfallprodukt! Wird in der Leber, dem Herzen und weniger belasteten Muskeln wieder zu Glucose aufgebaut (Gluconeogenese).' },
            ].map(({ name, text }) => (
              <div key={name} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{name}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>
          <S title="Kreatinphosphat — Sofortenergie" darkMode={darkMode}>
            <div className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Noch vor der Glykolyse: Kreatinphosphat regeneriert ATP blitzschnell — für die ersten ~10 Sekunden Maximalleistung.
            </div>
            <FormelBox formel="Kreatinphosphat + ADP → Kreatin + ATP" darkMode={darkMode} />
            <div className={`text-xs ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
              → Sprint, Sprungkraft, explosive Bewegungen. Vorrat erschöpft sich in ~10 Sek. Regeneration: ~3–5 Min aktive Pause.
            </div>
          </S>
          <S title="Übersicht: 3 Energiesysteme" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">System</th><th className="text-right p-2">Dauer</th><th className="text-right p-2">Beispiel</th></tr>
                </thead>
                <tbody>
                  {[
                    ['ATP-Kreatinphosphat', '0–10 Sek', '10m Sprint'],
                    ['Anaerobe Glykolyse', '10 Sek – 2 Min', '100m, 200m Schwimmen'],
                    ['Aerobe Zellatmung', '> 2 Min', '1500m, Ausdauer'],
                  ].map(([s, d, b], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2">{s}</td>
                      <td className="p-2 text-right">{d}</td>
                      <td className={`p-2 text-right ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
        </div>
      )}

      {tab === 'sport' && (
        <div>
          <S title="Aerobe & Anaerobe Schwelle" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Bei steigender Belastung schalten Muskeln zunehmend auf anaerobe Energiegewinnung um.
            </div>
            {[
              { grenze: 'Aerobe Schwelle', laktat: '~2 mmol/L', hz: '~130/min', text: 'Unterhalb: rein aerob — unbegrenzt haltbar. Fettstoffwechsel dominant.' },
              { grenze: 'Anaerobe Schwelle', laktat: '~4 mmol/L', hz: '~170/min', text: 'Hier: Laktat-Produktion = Abbau. Länger haltbar (30–60 Min). Trainingsziel bei Ausdauersport.' },
              { grenze: 'Maximale Laktat-Produktion', laktat: '> 10 mmol/L', hz: 'Max.', text: 'Nur kurz möglich — Muskeln "übersäuern", Leistung bricht ein.' },
            ].map(({ grenze, laktat, hz, text }) => (
              <div key={grenze} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className="flex flex-wrap gap-2 mb-1 items-center">
                  <span className={`text-xs font-bold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{grenze}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-600'}`}>Laktat {laktat}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-600'}`}>HF ~{hz}</span>
                </div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>
          <S title="Sauerstoffschuld & Regeneration" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Sauerstoffschuld</strong>: Während intensiver Belastung wird mehr O₂ benötigt als geliefert → Defizit entsteht. Nach dem Sport: erhöhter O₂-Verbrauch zum Abbau von Laktat und Wiederauffüllung der Energiespeicher (EPOC).</div>
              <div><strong>Laktat-Abbau</strong>: 30–90 Min. Aktive Erholung (lockeres Schwimmen!) beschleunigt den Abbau durch verbesserte Durchblutung.</div>
              <div><strong>Muskelkater</strong>: Nicht Laktat! Entsteht durch Mikrorisse in Muskelfasern bei exzentrischer Belastung. Entzündungsreaktion repariert und verstärkt die Muskelfasern.</div>
            </div>
          </S>
        </div>
      )}

      {tab === 'bad' && (
        <div>
          <S title="Relevanz für den Badebetrieb" darkMode={darkMode}>
            {[
              { titel: '🤿 Tauchen & Sauerstoffschuld', text: 'Beim Tauchen: anaerober Stoffwechsel aktiv. CO₂-Anstieg ist der Atemreiz — nicht O₂-Mangel! Hyperventilation senkt CO₂ → kein Atemreiz → Blackout unter Wasser.' },
              { titel: '🏊 Ausdauerschwimmen', text: 'Langstreckenschwimmen = überwiegend aerob. Schulen der FaBB: Schüler sollten in der aeroben Zone trainieren. Laktat-Ansammlungen erzeugen Muskelkrämpfe im Wasser.' },
              { titel: '⚡ Muskelkrämpfe im Wasser', text: 'Ursache: Laktat-Übersäuerung, Elektrolytmangel (Na, K, Mg), Dehydration. Behandlung: Muskel dehnen, Aktivität reduzieren, bei starken Krämpfen bergen.' },
              { titel: '🌡️ Wärmeproduktion', text: '~60% der Energie bei der Zellatmung wird als Wärme freigesetzt. Im Wasser kühlt der Körper schneller ab → Schüler/Badegäste frieren → Hypothermie-Risiko bei langen Aufenthalten.' },
              { titel: '📋 FaBB-Wissen', text: 'Sauerstoffmangel im Wasser = Ertrinken. Anzeichen: blaue Lippen (Zyanose) = O₂ im Blut reicht nicht aus → HLW-Kette sofort einleiten.' },
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
