import { useState } from 'react';

const TABS = {
  grundlagen:    { label: 'Grundlagen', icon: '🌊' },
  ausgleich:     { label: 'Ausgleichsbehälter', icon: '🛢️' },
  zirkulation:   { label: 'Zirkulationsmenge', icon: '🔄' },
  praxis:        { label: 'Praxis-Beispiele', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-violet-400' : 'text-violet-700'}`}>{title}</h3>}
    {children}
  </div>
);

export default function SchwallwasserDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('grundlagen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-violet-900/60 to-purple-900/40 border border-violet-800' : 'bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌊</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-violet-300' : 'text-violet-800'}`}>Schwallwasser & Zirkulation</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Ausgleichsbehälter, Personenverdrängung, Zirkulationsmenge nach DIN 19643</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-violet-600 text-white shadow'
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'grundlagen' && (
        <div>
          <S title="Was ist Schwallwasser?" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Sobald Badegäste ins Becken steigen, verdrängen sie Wasser — der Wasserspiegel steigt. Das überlaufende Wasser
              heißt <strong>Schwallwasser</strong>. Es läuft über die Überlaufrinne in den <strong>Ausgleichsbehälter</strong> (auch:
              Schwallwasserbehälter). Beim Verlassen des Beckens fließt es zurück. Diese Schwankungen muss der Behälter abfangen.
            </p>
            <div className={`rounded-lg p-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-violet-400' : 'text-violet-700'}`}>Grundregel — Verdrängung pro Person</div>
              <div className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <div>→ Erwachsene Person verdrängt im Mittel ca. <strong>50–70 L</strong> Wasser</div>
                <div>→ DIN 19643-1 rechnet mit <strong>50 L pro Person</strong> als Auslegungsgröße</div>
                <div>→ Bei Wellenbecken/Attraktionen kann die Schwallmenge deutlich höher sein</div>
              </div>
            </div>
          </S>

          <S title="Wo entsteht Schwallwasser?" darkMode={darkMode}>
            {[
              ['Personen­verdrängung', 'Badegäste, die ins Becken steigen — typisch 50 L/Person'],
              ['Bewegungswellen', 'Schwimmer erzeugen Bugwellen, die über die Rinne schwappen'],
              ['Wellenbetrieb', 'Wellenbecken — gewollte hohe Schwallmenge, regelmäßige Schwankungen'],
              ['Filterspülung', 'Wasser aus dem Filter wird abgelassen — muss durch Frischwasser ersetzt werden'],
              ['Sprung- und Rutschen­betrieb', 'Erzeugt zusätzliche Wellen am Auslauf'],
            ].map(([k, v], i) => (
              <div key={i} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-violet-400' : 'text-violet-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>

          <S title="Funktion der Überlaufrinne" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die Überlaufrinne hat zwei wichtige Aufgaben:
            </p>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <li>→ <strong>Schmutzige Oberfläche abnehmen</strong>: Hautfette, Öle, Schmutz schwimmen oben — die Rinne nimmt sie ab und führt sie zur Aufbereitung</li>
              <li>→ <strong>Schwallwasser abfangen</strong>: Bei Personeneintritt schwappt Wasser über die Rinne in den Ausgleichsbehälter</li>
              <li>→ <strong>DIN 19643-1</strong>: mind. 50 % der Umwälzwassermenge muss über die Rinne entnommen werden</li>
            </ul>
          </S>
        </div>
      )}

      {tab === 'ausgleich' && (
        <div>
          <S title="Ausgleichsbehälter dimensionieren" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Der Ausgleichsbehälter muss groß genug sein, um drei Effekte gleichzeitig aufzufangen:
            </p>
            <ul className={`text-xs space-y-1 mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <li>1. <strong>Personen­verdrängung</strong> — bei Stoßbelegung</li>
              <li>2. <strong>Wellen­schwankungen</strong> — bei Wellenbetrieb</li>
              <li>3. <strong>Filterspül­wasser</strong> — Reservevolumen für Spülgänge</li>
            </ul>
            <div className={`rounded-lg p-3 mb-3 font-mono text-xs ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`font-bold mb-1 ${darkMode ? 'text-violet-400' : 'text-violet-700'}`}>V_aus [m³] = (n_max × V_pers) + V_welle + V_filter</div>
              <div className={`text-[11px] italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                n_max = max. Personenzahl · V_pers = 0,05 m³/Person · V_welle = Wellenpuffer · V_filter = Spülwasservorrat
              </div>
            </div>
          </S>

          <S title="Faustregel DIN 19643-1" darkMode={darkMode}>
            <div className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Für Hallenbäder ohne Wellenbetrieb gilt häufig als Mindest­dimensionierung:
            </div>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Beckentyp</th><th className="text-left p-2">Mindest-Volumen Ausgleichsbehälter</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Schwimmerbecken / Sportbecken', 'mind. 3 % des Beckenvolumens'],
                    ['Lehrschwimmbecken / Nichtschwimmer', 'mind. 5 % des Beckenvolumens'],
                    ['Wellenbecken', 'sehr individuell — oft > 10 % (je nach Wellenhöhe)'],
                    ['Whirlpool', 'mind. 10 % wegen hoher Belegungsdichte'],
                  ].map(([b, v], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{b}</td>
                      <td className="p-2 text-violet-400 font-mono">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Konkrete Vorgaben können je DIN-Teilausgabe abweichen — Auslegung durch Fachplaner.
            </div>
          </S>

          <S title="Berechnungsbeispiel" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aufgabe:</strong> Schwimmerbecken 500 m³, max. 80 Personen gleichzeitig. Filterspülung benötigt 8 m³ Reserve. Wellenbetrieb: nein. Mindest­volumen Ausgleichsbehälter?</div>
              <div className={`rounded p-3 font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div>Personen­verdrängung: 80 × 0,05 = 4 m³</div>
                <div>Wellen­puffer: 0 m³ (kein Wellenbetrieb)</div>
                <div>Filter­spülung: 8 m³</div>
                <div>Summe: 12 m³</div>
                <div className="mt-2">Mindest nach DIN: 3 % × 500 = 15 m³</div>
                <div className={darkMode ? 'text-violet-400' : 'text-violet-700'}>→ Maßgeblich ist 15 m³ (höherer Wert)</div>
              </div>
            </div>
          </S>
        </div>
      )}

      {tab === 'zirkulation' && (
        <div>
          <S title="Zirkulationsmenge nach DIN 19643" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die <strong>Zirkulationswassermenge</strong> Q ist die Wassermenge, die pro Stunde durch die Aufbereitungsanlage
              läuft. Sie ergibt sich aus der <strong>Mindestbelastungs­bezogenen Wassermenge</strong> (k × n) und der
              <strong>Nennumwälzzeit</strong>. Maßgebend ist der größere Wert.
            </p>
            <div className={`rounded-lg p-3 mb-3 font-mono text-xs ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`font-bold mb-1 ${darkMode ? 'text-violet-400' : 'text-violet-700'}`}>Q = MAX(Q_belast, Q_umwälz)</div>
              <div className="mt-1">Q_belast = k × n_max  (belastungs­bezogen)</div>
              <div>Q_umwälz = V_becken / t_n  (umwälzzeit­bezogen)</div>
              <div className={`text-[11px] italic mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                k = Belastungs­faktor pro Person (m³/h) · n_max = max. Personenzahl · t_n = Nennumwälzzeit
              </div>
            </div>
          </S>

          <S title="Belastungs­faktor k nach DIN 19643-1" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Beckentyp</th><th className="text-left p-2">k [m³/(h·Person)]</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Schwimmer-/Sportbecken', '2,0'],
                    ['Lehrschwimm- und Mehrzweckbecken', '2,0'],
                    ['Springer-/Wellenbecken', '2,5'],
                    ['Nichtschwimmer-Becken', '2,0'],
                    ['Kinderplanschbecken', '1,0'],
                    ['Erlebnisbecken / Warmsprudel', '4,0'],
                    ['Whirlpool', '4,0'],
                  ].map(([b, k], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{b}</td>
                      <td className="p-2 text-violet-400 font-mono">{k}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Werte nach DIN 19643-1 Anhang. Geringe Abweichungen je nach Norm-Edition möglich.
            </div>
          </S>

          <S title="Maximale Personenbelegung" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die DIN gibt auch eine maximale Personenzahl pro m² Wasserfläche vor:
            </p>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <li>→ Schwimmer-/Sportbecken: 1 Person pro 4,5 m² Wasserfläche</li>
              <li>→ Nichtschwimmer-Becken: 1 Person pro 2,7 m² Wasserfläche</li>
              <li>→ Kinderplansch: 1 Person pro 1 m² Wasserfläche</li>
              <li>→ Whirlpool: nach Herstellerangabe (typisch 1 Person pro 1 m²)</li>
            </ul>
          </S>
        </div>
      )}

      {tab === 'praxis' && (
        <div>
          <S title="Beispiel: Vollständige Berechnung Schwimmer­becken" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aufgabe:</strong> Schwimmerbecken 25 × 10 m, mittlere Tiefe 1,8 m. Berechne Volumen, max. Personenzahl, Zirkulationsmenge.</div>
              <div className={`rounded p-3 font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`font-bold ${darkMode ? 'text-violet-400' : 'text-violet-700'}`}>1. Volumen</div>
                <div>V = 25 × 10 × 1,8 = 450 m³</div>
                <div className="mt-2 font-bold text-violet-400">2. Wasserfläche</div>
                <div>A = 25 × 10 = 250 m²</div>
                <div className="mt-2 font-bold text-violet-400">3. Maximale Personenzahl</div>
                <div>n_max = 250 / 4,5 = 55,5 ≈ 55 Personen</div>
                <div className="mt-2 font-bold text-violet-400">4. Belastungs­bezogen</div>
                <div>Q_belast = 2,0 × 55 = 110 m³/h</div>
                <div className="mt-2 font-bold text-violet-400">5. Umwälzzeit­bezogen (t_n = 6 h)</div>
                <div>Q_umwälz = 450 / 6 = 75 m³/h</div>
                <div className="mt-2 font-bold text-violet-400">6. Maßgebend</div>
                <div>Q = MAX(110; 75) = 110 m³/h</div>
                <div className="mt-2 font-bold text-violet-400">7. Tatsächliche Umwälzzeit</div>
                <div>t_tatsächlich = 450 / 110 = 4,1 h</div>
              </div>
              <div className={`rounded p-2 border-l-4 border-violet-500 ${darkMode ? 'bg-violet-900/20' : 'bg-violet-50'}`}>
                <strong>Ergebnis:</strong> Pumpe muss 110 m³/h fördern. Die belastungs­bezogene Größe ist hier maßgebend, weil mehr
                Personen als die Nennumwälzzeit fordert.
              </div>
            </div>
          </S>

          <S title="Beispiel: Whirlpool" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aufgabe:</strong> Whirlpool 6 m³, 6 Plätze, k = 4 m³/(h·Person), Nennumwälzzeit 0,5 h.</div>
              <div className={`rounded p-3 font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div>Q_belast = 4 × 6 = 24 m³/h</div>
                <div>Q_umwälz = 6 / 0,5 = 12 m³/h</div>
                <div>Q = MAX(24; 12) = 24 m³/h</div>
                <div>t_tatsächlich = 6 / 24 = 0,25 h = 15 Min</div>
              </div>
              <div><strong>Bedeutung:</strong> Bei voller Belegung wird das Whirlpoolwasser alle 15 Minuten komplett aufbereitet — 4× pro Stunde. Hohe Anforderung wegen Aerosol- und Hygienerisiko.</div>
            </div>
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-violet-900/40 border border-violet-700' : 'bg-violet-50 border border-violet-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-violet-200' : 'text-violet-800'}`}>📋 Faustregeln zusammen­gefasst</div>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-violet-300' : 'text-violet-700'}`}>
              <li>→ <strong>Schwallwasser pro Person</strong>: 50 L</li>
              <li>→ <strong>Ausgleichsbehälter Schwimmerbecken</strong>: ≥ 3 % Beckenvolumen</li>
              <li>→ <strong>Belastungs­faktor Schwimmer/NS</strong>: k = 2 m³/(h·Person)</li>
              <li>→ <strong>Belastungs­faktor Whirlpool</strong>: k = 4 m³/(h·Person)</li>
              <li>→ <strong>Q maßgebend</strong>: immer der größere Wert aus belastungs­bezogen und umwälzzeit­bezogen</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
