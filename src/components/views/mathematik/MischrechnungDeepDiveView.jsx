import { useState } from 'react';

const TABS = {
  grundlagen: { label: 'Grundlagen', icon: '🧪' },
  mischkreuz:   { label: 'Mischungskreuz', icon: '✚' },
  frischwasser:  { label: 'Frischwasser DIN 19643', icon: '💧' },
  praxis:       { label: 'Praxis-Beispiele', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{title}</h3>}
    {children}
  </div>
);

export default function MischrechnungDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('grundlagen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-emerald-900/60 to-teal-900/40 border border-emerald-800' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧪</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>Mischrechnung & Frischwasserzugabe</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Mischungskreuz, Konzentrations­ausgleich, Frischwasservorgabe nach DIN 19643</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-emerald-600 text-white shadow'
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'grundlagen' && (
        <div>
          <S title="Was ist Mischrechnung?" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Bei der Mischrechnung gibt man zwei Lösungen mit unterschiedlicher Konzentration zusammen — das Ergebnis
              ist eine Mischung mit einer mittleren Konzentration. Im Bäderbetrieb braucht man das ständig:
              Frischwasser ins Becken füllen (Verdünnung), Chlorlösung verdünnen, Heizungswasser mischen, pH-Korrektur.
            </p>
            <div className={`rounded-lg p-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Grundprinzip — Massenbilanz</div>
              <div className={`text-xs space-y-1 font-mono ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <div>(m₁ × c₁) + (m₂ × c₂) = (m₁ + m₂) × c_mix</div>
                <div className={`text-[11px] italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  m = Menge (m³ oder L) · c = Konzentration · _mix = Mischungswert
                </div>
              </div>
            </div>
          </S>

          <S title="Typische Aufgaben im Bad" darkMode={darkMode}>
            {[
              ['Verdünnung', 'Wieviel Frischwasser zugeben, damit ein Stoff (z. B. Harnstoff) unter Grenzwert sinkt?'],
              ['Auffüllung', 'Becken hat 0,2 mg/L Chlor — wieviel Chlorlösung dazu, damit 0,5 mg/L erreicht werden?'],
              ['Wassertemperatur', 'Kaltwasser mit 12 °C + Warmwasser mit 60 °C — Verhältnis für 28 °C Beckenwasser?'],
              ['pH-Korrektur', 'Becken pH 8,0 — wieviel Säure für pH 7,2?'],
              ['Beckenfüllung', 'Vorgewärmtes Wasser + Frischwasser kalt — Mischtemperatur?'],
            ].map(([k, v], i) => (
              <div key={i} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>

          <S title="Schnelle Faustformel" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Mischtemperatur</strong>: c_mix = (m₁ × c₁ + m₂ × c₂) / (m₁ + m₂)</div>
              <div><strong>Beispiel</strong>: 100 L bei 60 °C + 200 L bei 15 °C → c_mix = (100×60 + 200×15) / 300 = (6000 + 3000) / 300 = 30 °C</div>
              <div className={`rounded p-2 border-l-4 border-emerald-500 ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                Faustregel: Die größere Menge zieht das Ergebnis stärker zu sich. 200 L kaltes Wasser + 100 L heißes → die Mischtemperatur liegt näher am Kaltwasser.
              </div>
            </div>
          </S>
        </div>
      )}

      {tab === 'mischkreuz' && (
        <div>
          <S title="Das Mischungskreuz" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Das Mischungskreuz hilft schnell zu berechnen, in welchem Verhältnis zwei Lösungen gemischt werden müssen,
              um eine bestimmte Mittelkonzentration zu erreichen. Es funktioniert immer gleich: Diagonale Differenzen bilden,
              fertig ist das Verhältnis.
            </p>
            <div className={`rounded-lg p-4 mb-3 font-mono text-xs ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className={`${darkMode ? 'text-emerald-400' : 'text-emerald-700'} font-bold`}>c₁ (hoch)</div>
                <div></div>
                <div className={`${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Anteile von c₁</div>
                <div></div>
                <div className={`${darkMode ? 'text-amber-400' : 'text-amber-700'} font-bold`}>c_mix</div>
                <div></div>
                <div className={`${darkMode ? 'text-emerald-400' : 'text-emerald-700'} font-bold`}>c₂ (niedrig)</div>
                <div></div>
                <div className={`${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Anteile von c₂</div>
              </div>
              <div className={`mt-3 text-[11px] ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Anteile c₁ = c_mix − c₂  ·  Anteile c₂ = c₁ − c_mix
              </div>
            </div>
          </S>

          <S title="Beispiel: Heizungs-Mischtemperatur" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aufgabe:</strong> Heizwasser 60 °C, Kaltwasser 12 °C — Verhältnis für Mischtemperatur 28 °C?</div>
              <div className={`rounded p-3 font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div>60 °C ─────── (28 − 12) = 16 Anteile heiß</div>
                <div className={darkMode ? 'text-emerald-400' : 'text-emerald-700'}>     ╲ ╱</div>
                <div>      28 °C  (Mischung)</div>
                <div className={darkMode ? 'text-emerald-400' : 'text-emerald-700'}>     ╱ ╲</div>
                <div>12 °C ─────── (60 − 28) = 32 Anteile kalt</div>
              </div>
              <div><strong>Verhältnis:</strong> 16 : 32 = <strong>1 : 2</strong> — auf 1 L heißes Wasser kommen 2 L kaltes</div>
              <div><strong>Probe:</strong> (60 + 2×12) / 3 = 84/3 = 28 ✓</div>
            </div>
          </S>

          <S title="Beispiel: Chlorlösung verdünnen" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aufgabe:</strong> Aus 13 % NaOCl-Stammlösung soll eine 1 %-Gebrauchslösung gemischt werden. Verhältnis?</div>
              <div className={`rounded p-3 font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div>13 % ─────── (1 − 0) = 1 Anteil Stammlösung</div>
                <div>     ╲ ╱</div>
                <div>     1 %</div>
                <div>     ╱ ╲</div>
                <div> 0 % ─────── (13 − 1) = 12 Anteile Wasser</div>
              </div>
              <div><strong>Verhältnis:</strong> 1 : 12 — auf 1 L Stammlösung kommen 12 L Wasser</div>
              <div><strong>Für 13 L Gebrauchs­lösung:</strong> 1 L NaOCl 13 % + 12 L Wasser</div>
            </div>
          </S>
        </div>
      )}

      {tab === 'frischwasser' && (
        <div>
          <S title="Frischwasserzugabe nach DIN 19643" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die DIN 19643-1 schreibt vor, dass jedem Becken regelmäßig <strong>Frischwasser</strong> zugeführt werden muss.
              Damit verdünnt sich das Beckenwasser, organische Belastung sinkt, gebundenes Chlor wird abgebaut.
              Die Vorgabe ist die <strong>tägliche Mindest-Frischwassermenge pro Badegast</strong>.
            </p>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Vorgabe</th><th className="text-left p-2">Wert</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Mindest-Frischwasser pro Badegast', 'mind. 30 L (DIN 19643-1)'],
                    ['Minimum täglich', 'mind. 2 % des Beckenvolumens'],
                    ['Bei höherer Belastung (Algen, Chloramine)', 'höher dosieren — bis Verbesserung'],
                    ['Whirlpool / Warmsprudel', 'Höhere Frischwasservorgabe nach DIN 19643-3'],
                  ].map(([k, v], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{k}</td>
                      <td className="p-2 text-emerald-400">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Die exakten Werte können je nach Beckentyp und DIN 19643-Teilausgabe abweichen — Betriebs­anleitung und SDB beachten.
            </div>
          </S>

          <S title="Berechnungsbeispiel — Tagesfrischwasser" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aufgabe:</strong> Hallenbad, 250 Badegäste pro Tag. Wieviel Frischwasser muss zugeführt werden?</div>
              <div className={`rounded p-3 font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div>Frischwasser = 250 Gäste × 30 L</div>
                <div>             = 7.500 L</div>
                <div>             = 7,5 m³ pro Tag</div>
              </div>
              <div><strong>Probe:</strong> Bei 500 m³ Beckenvolumen = 7,5 / 500 = 1,5 % Frischwasseranteil. <strong>Achtung:</strong> Die DIN-Mindestmenge von 2 % wird nicht erreicht — auf mindestens 10 m³ erhöhen!</div>
            </div>
          </S>

          <S title="Wirkung der Frischwasserzugabe" darkMode={darkMode}>
            {[
              'Verdünnt anorganische Belastung (Chloride, Sulfate aus Chlorprodukten)',
              'Reduziert organische Belastung (Harnstoff, Kreatinin, Hautfett)',
              'Senkt gebundenes Chlor (Chloramine) → weniger Chlorgeruch',
              'Hält Wasser klar — verbessert Sichttiefe',
              'Senkt KS₄,₃-Wert wenn nötig (Säurekapazität)',
              'Bei Bedarf: hilft pH-Wert zu stabilisieren',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-emerald-500">→</span><span>{it}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'praxis' && (
        <div>
          <S title="Verdünnung — Beispiel Harnstoffabbau" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aufgabe:</strong> Becken 500 m³, Harnstoffwert 1,5 mg/L. Zielwert: 1,0 mg/L. Wieviel Frischwasser?</div>
              <div className={`rounded p-3 font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div>Mischformel: V_alt × c_alt = (V_alt + V_neu) × c_neu</div>
                <div>Neue Konzentration durch Frischwasser-Zugabe</div>
                <div className="mt-2">500 × 1,5 = (500 + V_neu) × 1,0</div>
                <div>750 = 500 + V_neu</div>
                <div>V_neu = 250 m³</div>
              </div>
              <div><strong>Aber:</strong> Beim Bad-Betrieb bleibt das Volumen konstant — d. h. man muss 250 m³ ablassen UND nachfüllen oder mit kontinuierlichem Frischwasserstrom + Überlauf arbeiten.</div>
            </div>
          </S>

          <S title="Mischtemperatur Hallenbad" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aufgabe:</strong> Becken 28 °C, 500 m³. Tag-Frischwasser 10 m³ kommt mit 12 °C. Welche Mischtemperatur stellt sich ein?</div>
              <div className={`rounded p-3 font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div>c_mix = (500×28 + 10×12) / 510</div>
                <div>      = (14000 + 120) / 510</div>
                <div>      = 14120 / 510</div>
                <div>      = 27,7 °C</div>
              </div>
              <div><strong>Bedeutung:</strong> Die 10 m³ Frischwasser kühlen das Becken um 0,3 K. Die Heizung muss diese Energie nachliefern — etwa Q = 1,16 × 510 × 0,3 ≈ 178 kWh.</div>
            </div>
          </S>

          <S title="Stoßchlorung anrechnen" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aufgabe:</strong> Becken 300 m³ hat aktuell 0,4 mg/L freies Chlor. Stoßchlorung auf 5 mg/L gewünscht. Wie viel reines Aktivchlor?</div>
              <div className={`rounded p-3 font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div>Anhebung = 5 − 0,4 = 4,6 mg/L</div>
                <div>Aktivchlor = 4,6 × 300 = 1.380 g</div>
                <div>            ≈ 1,38 kg Aktivchlor</div>
                <div className="mt-2">Bei NaOCl 13 %:  1.380 / 0,13 = 10.615 g ≈ 10,6 kg Lösung</div>
                <div>Bei Ca(ClO)₂ 65 %:  1.380 / 0,65 = 2.123 g ≈ 2,1 kg Granulat</div>
              </div>
            </div>
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-emerald-900/40 border border-emerald-700' : 'bg-emerald-50 border border-emerald-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>📋 Prüfungstipps</div>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              <li>→ Bei Aufgaben immer alle Werte auf gleiche Einheiten bringen (m³ und Liter nicht mischen)</li>
              <li>→ Mischtemperatur = gewichteter Durchschnitt — die größere Menge dominiert</li>
              <li>→ Bei Stoßchlorung: Aktivchlor zuerst, dann Produktmenge</li>
              <li>→ Frischwasser nach DIN: 30 L pro Gast UND mind. 2 % des Beckenvolumens — die größere Menge gilt</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
