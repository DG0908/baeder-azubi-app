import { useState } from 'react';

const TABS = {
  grundlagen: { label: 'Grundlagen', icon: '💨' },
  formeln:    { label: 'Berechnungs­formeln', icon: '🧮' },
  energie:    { label: 'Energieverlust', icon: '🔥' },
  reduktion:  { label: 'Reduktion', icon: '🛡️' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-sky-400' : 'text-sky-700'}`}>{title}</h3>}
    {children}
  </div>
);

export default function VerdunstungDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('grundlagen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-sky-900/60 to-blue-900/40 border border-sky-800' : 'bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">💨</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-sky-300' : 'text-sky-800'}`}>Verdunstung im Schwimmbad</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Wie viel Wasser geht verloren — und wie viel Energie kostet das?</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-sky-600 text-white shadow'
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'grundlagen' && (
        <div>
          <S title="Was passiert bei der Verdunstung?" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Wenn Wasser verdunstet, wandelt es sich vom flüssigen in den gasförmigen Zustand. Dabei nimmt es viel Energie auf
              — aus dem zurückbleibenden Wasser (deshalb wird es kälter). Im Schwimmbad ist Verdunstung der größte Wärmeverlust
              und verursacht den Hauptanteil der Heizkosten und der hohen Luftfeuchtigkeit in der Halle.
            </p>
            <div className={`rounded-lg p-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-sky-400' : 'text-sky-700'}`}>Faktoren, die die Verdunstung erhöhen</div>
              <ul className={`text-xs space-y-0.5 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <li>→ Höhere Wassertemperatur — mehr Energie zum Verdunsten</li>
                <li>→ Niedrige Luftfeuchtigkeit — Luft kann mehr Wasserdampf aufnehmen</li>
                <li>→ Bewegung der Wasseroberfläche (Wellen, Attraktionen)</li>
                <li>→ Bewegung der Luft (Lüftung, Wind im Freibad)</li>
                <li>→ Größere Wasseroberfläche</li>
                <li>→ Niedrige Lufttemperatur (relativ zum Wasser)</li>
              </ul>
            </div>
          </S>

          <S title="Typische Verdunstungsmengen" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Beckenart</th><th className="text-left p-2">Verdunstung pro m² · Stunde</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Hallenbad — ruhige Oberfläche', '0,1 – 0,2 L/(m²·h) (Nacht)'],
                    ['Hallenbad — Tagbetrieb', '0,2 – 0,4 L/(m²·h)'],
                    ['Hallenbad — Wellenbecken / Attraktion', '0,4 – 0,6 L/(m²·h)'],
                    ['Whirlpool (35 °C)', 'bis 1,0 L/(m²·h)'],
                    ['Freibad Sommer (mittlerer Tag)', '0,3 – 0,5 L/(m²·h)'],
                    ['Freibad Hochsommer + Wind', 'bis 0,8 L/(m²·h)'],
                  ].map(([b, v], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{b}</td>
                      <td className="p-2 text-sky-400 font-mono">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Werte als Anhalt — exakte Berechnung über VDI 2089 / Mörl-Formel.
            </div>
          </S>
        </div>
      )}

      {tab === 'formeln' && (
        <div>
          <S title="Verdunstungsmenge — Praxisformel" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die genaue Berechnung läuft über die <strong>Verdunstungsrate</strong> (in L pro m² und Stunde) und die Wasseroberfläche:
            </p>
            <div className={`rounded-lg p-3 mb-3 font-mono text-xs ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`font-bold mb-1 ${darkMode ? 'text-sky-400' : 'text-sky-700'}`}>V_verd [L/h] = ε [L/(m²·h)] × A [m²]</div>
              <div className={`text-[11px] italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                ε = Verdunstungsrate · A = Wasseroberfläche
              </div>
            </div>
            <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die Verdunstungsrate ε hängt von Temperatur, Luftfeuchte, Aktivität ab. Für Auslegungs­berechnungen dient die
              Mörl-Formel (VDI 2089).
            </p>
          </S>

          <S title="Mörl-Formel (VDI 2089)" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Vereinfachte Form für Hallenbäder:
            </p>
            <div className={`rounded-lg p-3 mb-3 font-mono text-xs ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`font-bold mb-1 ${darkMode ? 'text-sky-400' : 'text-sky-700'}`}>m_verd = β × A × (x_s − x_L)</div>
              <div className={`text-[11px] italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                β = Stoffübergangskoeffizient · x_s = Sättigungs­feuchte am Wasser · x_L = Luftfeuchte
              </div>
            </div>
            <div className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aktivitätsfaktoren</strong> (ergänzen β):</div>
              <ul className="space-y-0.5 ml-3">
                <li>→ Ruhe (Nacht, mit Beckenabdeckung): Faktor 0,1</li>
                <li>→ Ruhe (ohne Abdeckung): Faktor 0,5</li>
                <li>→ Normalbetrieb (Hallenbad): Faktor 1,0</li>
                <li>→ Wellenbetrieb / Attraktion: Faktor 1,5–2,0</li>
                <li>→ Ausflug / Heißbecken / starke Bewegung: Faktor &gt; 2,0</li>
              </ul>
            </div>
          </S>

          <S title="Berechnungsbeispiel" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aufgabe:</strong> Hallenbad, Beckenoberfläche 200 m². Tagbetrieb, Verdunstungsrate 0,3 L/(m²·h). Betrieb 12 h/Tag.</div>
              <div className={`rounded p-3 font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div>V_verd_h = 0,3 × 200 = 60 L/h</div>
                <div>V_verd_Tag = 60 × 12 = 720 L/Tag</div>
                <div>V_verd_Nacht = 0,1 × 200 × 12 = 240 L (Ruhe)</div>
                <div>Gesamt pro Tag: 720 + 240 = 960 L ≈ 1 m³ Wasser/Tag</div>
              </div>
              <div className={`rounded p-2 border-l-4 border-sky-500 ${darkMode ? 'bg-sky-900/20' : 'bg-sky-50'}`}>
                <strong>Bedeutung:</strong> Etwa 1 m³ Wasser verschwindet pro Tag durch Verdunstung — wird als Frischwasser nachgespeist.
              </div>
            </div>
          </S>
        </div>
      )}

      {tab === 'energie' && (
        <div>
          <S title="Verdunstung kostet Energie" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Damit 1 kg Wasser verdunsten kann, muss eine bestimmte Energiemenge zugeführt werden — die <strong>Verdampfungswärme</strong>.
              Bei 25 °C beträgt sie etwa <strong>2.443 kJ/kg ≈ 0,68 kWh/kg</strong>. Diese Energie kommt aus dem Beckenwasser
              (deshalb kühlt es ab) — und muss durch die Heizung wieder nachgeliefert werden.
            </p>
            <div className={`rounded-lg p-3 mb-3 font-mono text-xs ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`font-bold mb-1 ${darkMode ? 'text-sky-400' : 'text-sky-700'}`}>Q_verd [kWh] = m_verd [kg] × 0,68 kWh/kg</div>
              <div className={`text-[11px] italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Faustwert: 1 L verdunstetes Wasser = ca. 0,68 kWh Energieverlust
              </div>
            </div>
          </S>

          <S title="Energieberechnung — Beispiel" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aufgabe:</strong> Hallenbad verdunstet 1.000 L = 1.000 kg pro Tag. Wieviel Energie geht dadurch verloren?</div>
              <div className={`rounded p-3 font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div>Q_verd = 1.000 × 0,68 = 680 kWh/Tag</div>
                <div>       = 680 × 365 = 248.200 kWh/Jahr</div>
                <div>       ≈ 248 MWh/Jahr nur durch Verdunstung</div>
              </div>
              <div className={`rounded p-2 border-l-4 border-sky-500 ${darkMode ? 'bg-sky-900/20' : 'bg-sky-50'}`}>
                <strong>Bedeutung:</strong> Bei 0,10 €/kWh Wärmekosten = ca. 25.000 €/Jahr allein für Verdunstungs­wärme — größter
                Posten in der Energiebilanz eines Hallenbads.
              </div>
            </div>
          </S>

          <S title="Energieanteile im Hallenbad" darkMode={darkMode}>
            <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Typische Wärmeverluste im Hallenbad-Betrieb (Anhaltswerte):
            </div>
            <ul className={`text-xs space-y-1 mt-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <li>→ <strong>Verdunstung</strong>: ca. 50–70 % aller Wärmeverluste</li>
              <li>→ <strong>Frischwassererwärmung</strong>: 10–20 %</li>
              <li>→ <strong>Wandverluste / Beckenwände</strong>: 10–15 %</li>
              <li>→ <strong>Strahlung</strong>: 5–10 %</li>
            </ul>
            <div className={`rounded p-2 mt-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'} text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>Konsequenz:</strong> Wer Energie sparen will, fokussiert sich zuerst auf Verdunstungs­reduktion (Beckenabdeckung,
              Luftfeuchte­regelung) — nicht auf bessere Beckenwand-Dämmung.
            </div>
          </S>
        </div>
      )}

      {tab === 'reduktion' && (
        <div>
          <S title="Maßnahmen zur Verdunstungs­reduktion" darkMode={darkMode}>
            {[
              { titel: '🛏️ Beckenabdeckung (Folie/Plane) bei Nacht', text: 'Wirksamste Einzelmaßnahme: 70–85 % Reduktion in Ruhe­zeiten. Amortisation oft unter 5 Jahren. Manuell oder vollautomatisch.' },
              { titel: '🌡️ Wassertemperatur richtig wählen', text: 'Jedes Grad mehr = ca. 5–7 % mehr Verdunstung. Sportbecken 26 °C statt 28 °C spart deutlich Energie und Wasser.' },
              { titel: '💨 Luftfeuchte hochhalten', text: 'Bei höherer relativer Luftfeuchte verdunstet weniger. DIN 1946-4 nennt Sollwerte (z. B. 50–64 % rel. Feuchte). Lüftungsanlage entsprechend regeln.' },
              { titel: '🧊 Lufttemperatur knapp über Wassertemperatur', text: 'Faustregel: Lufttemperatur 2–4 K über Wassertemperatur. Bei kälterer Luft verdunstet das Becken stärker.' },
              { titel: '🌊 Attraktionen nur im Bedarf laufen', text: 'Wellenanlage, Strömungskanal, Massagedüsen — nicht 24/7 laufen lassen. Außerhalb der Stoßzeiten abschalten.' },
              { titel: '🌫️ Beckenrand­absaugung optimieren', text: 'Gut dimensionierte Rinnen führen die feuchte Luft direkt ab — verhindern Schwadenbildung und Bauschäden.' },
              { titel: '☀️ Wärmerückgewinnung Lüftung', text: 'Aus der feuchten Abluft Wärme zurückgewinnen (Plattenwärmetauscher, Wärmepumpe). Reduziert Heizkosten um 30–50 %.' },
            ].map(({ titel, text }, i) => (
              <div key={i} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-sky-400' : 'text-sky-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>

          <S title="Berechnung Einsparpotenzial Beckenabdeckung" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Aufgabe:</strong> 200 m² Becken, Nachtzeit 12 h, ohne Abdeckung 0,3 L/(m²·h), mit Abdeckung 0,05 L/(m²·h). Einsparung pro Nacht?</div>
              <div className={`rounded p-3 font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div>Ohne Abdeckung:  0,3 × 200 × 12 = 720 L/Nacht</div>
                <div>Mit Abdeckung:   0,05 × 200 × 12 = 120 L/Nacht</div>
                <div>Einsparung:      600 L/Nacht</div>
                <div className="mt-2">Energie: 600 × 0,68 = 408 kWh/Nacht</div>
                <div>Im Jahr: 408 × 200 Nächte ≈ 81.600 kWh</div>
                <div>Bei 0,10 €/kWh: ≈ 8.160 €/Jahr Einsparung</div>
              </div>
            </div>
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-sky-900/40 border border-sky-700' : 'bg-sky-50 border border-sky-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-sky-200' : 'text-sky-800'}`}>📋 Verdunstungs­bilanz im Betriebsalltag</div>
            <div className={`text-xs ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}>
              Tägliche Frischwasserergänzung im Betriebstagebuch erfassen → Trends erkennen. Plötzlich steigender Verbrauch
              kann auch auf Leckagen hinweisen — nicht nur Verdunstung.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
