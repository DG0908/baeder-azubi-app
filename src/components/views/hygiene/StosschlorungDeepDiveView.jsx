import { useState } from 'react';

const TABS = {
  grundlagen: { label: 'Grundlagen', icon: '⚗️' },
  durchfuehrung: { label: 'Durchführung', icon: '🔧' },
  vorfaelle:  { label: 'Anlässe', icon: '🚨' },
  sicherheit: { label: 'Sicherheit', icon: '🛡️' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{title}</h3>}
    {children}
  </div>
);

export default function StosschlorungDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('grundlagen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-blue-900/60 to-indigo-900/40 border border-blue-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚗️</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>Stoßchlorung & Superchlorung</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Wann, wie und mit welchen Werten — sichere Anwendung in der Praxis</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-blue-600 text-white shadow'
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'grundlagen' && (
        <div>
          <S title="Was ist eine Stoßchlorung?" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Eine <strong>Stoßchlorung</strong> ist die kurzzeitige Anhebung des freien Chlorgehalts im Beckenwasser
              auf ein Vielfaches des Normalwerts, um Mikroorganismen, Chloramine oder organische Verunreinigungen
              schnell und vollständig zu eliminieren.
            </p>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Begriff</th><th className="text-left p-2">freies Chlor</th><th className="text-left p-2">Anwendung</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Normalbetrieb', '0,3 – 0,6 mg/L', 'Dauerhafter Betrieb, DIN 19643-1'],
                    ['Stoßchlorung', '1 – 5 mg/L', 'Bei Verschmutzung, am Saisonbeginn, präventiv'],
                    ['Superchlorung', '5 – 10 mg/L', 'Schwere Verschmutzung (Erbrochenes, Stuhl, Algen)'],
                    ['Schock-Chlorung', '> 10 mg/L', 'Sanierung, nach Befund, Stilllegung'],
                  ].map(([t, c, a], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{t}</td>
                      <td className="p-2 font-mono text-blue-400">{c}</td>
                      <td className="p-2">{a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Die Begriffe „Stoß-" und „Super­chlorung" werden in der Praxis oft synonym verwendet — was zählt, sind die tatsächlichen Werte.
            </div>
          </S>

          <S title="Warum Stoßchlorung nötig sein kann" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Bei normalen Chlorwerten (0,3–0,6 mg/L) reicht die Desinfektionskraft im Alltag aus. Bei besonderen
              Belastungen kann die Wirkung aber nicht mehr genügen:
            </p>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <li>→ <strong>Chloramine</strong> (gebundenes Chlor) blockieren die Wirkung — Stoßchlorung „verbrennt" sie</li>
              <li>→ <strong>Hohe Belegung</strong> nach Schwimmkurs, Schul­schwimmen → mehr Eintrag von Schweiß, Urin, Hautfett</li>
              <li>→ <strong>Algenwachstum</strong> bei warmem Wetter im Freibad</li>
              <li>→ <strong>Verunreinigungen</strong> (Erbrochenes, Stuhl) erfordern Sofort­behandlung</li>
              <li>→ <strong>Saisonbeginn</strong> — Inbetriebnahme nach Stillstand</li>
            </ul>
          </S>

          <S title="Break-Point-Chlorung — der wichtige Begriff" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Beim Anheben des Chlorgehalts entstehen zunächst <strong>Chloramine</strong> (gebundenes Chlor) — sie
              riechen nach „Schwimmbad" und reizen Augen/Atemwege. Erst wenn alle Chloramine zerstört sind, steigt das
              freie Chlor wirklich an. Dieser Punkt heißt <strong>Break-Point</strong> oder Knickpunkt.
            </p>
            <div className={`rounded-lg p-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <strong>Faustregel:</strong> Um den Break-Point zu überschreiten, braucht es etwa <strong>10× die Menge
                des gebundenen Chlors</strong>. Bei 0,3 mg/L gebundenem Chlor müssen also ~3 mg/L freies Chlor erzeugt werden.
              </div>
            </div>
            <div className={`text-xs mt-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Erst die Break-Point-Chlorung beseitigt nachhaltig die Chloramin-Belastung. Eine zu schwache Stoßchlorung produziert sogar mehr Chloramine.
            </div>
          </S>
        </div>
      )}

      {tab === 'durchfuehrung' && (
        <div>
          <S title="Vorbereitung" darkMode={darkMode}>
            {[
              { nr: '1', text: 'Beckenbenutzung einstellen — Wasser muss frei von Badegästen sein' },
              { nr: '2', text: 'Aktuelle Wasserwerte messen und dokumentieren (pH, freies/gebundenes Chlor)' },
              { nr: '3', text: 'pH auf 7,0–7,2 einstellen — saure Bereiche verstärken Chlorwirkung' },
              { nr: '4', text: 'Filteranlage normal weiterlaufen lassen — gleichmäßige Verteilung' },
              { nr: '5', text: 'PSA bereitlegen: Schutzbrille, Säurehandschuhe, ggf. Atemschutz' },
            ].map(({ nr, text }) => (
              <div key={nr} className={`flex gap-3 p-2 mb-1 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{nr}</span>
                <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{text}</p>
              </div>
            ))}
          </S>

          <S title="Mengenberechnung" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Grundformel: <strong>Wirkstoffmenge = Beckenvolumen × Soll­konzentration ÷ Wirkstoff­anteil</strong>
            </p>
            <div className={`rounded-lg p-3 mb-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Beispiel: 500 m³ Becken auf 5 mg/L Stoßchlorung mit 13 % NaOCl</div>
              <ul className={`text-xs space-y-0.5 font-mono ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <li>500 m³ × 5 g/m³ = 2.500 g Cl₂ benötigt</li>
                <li>2.500 g ÷ 0,13 (13 % Wirkstoff) = 19.230 g Lösung</li>
                <li>= ca. <strong>19,2 kg</strong> Natriumhypochlorit-Lösung 13 %</li>
                <li>(Bei Calciumhypochlorit-Granulat 65 %: 2.500 ÷ 0,65 = ~3,85 kg)</li>
              </ul>
            </div>
            <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>Wichtig:</strong> Hersteller­angabe des konkreten Produkts beachten — Wirkstoffanteil variiert. SDB als Quelle.
            </div>
          </S>

          <S title="Zugabe" darkMode={darkMode}>
            {[
              ['Granulat', 'In großem Eimer mit Wasser vorlösen — NIE direkt ins Becken streuen (Fleckenbildung, Granulat sinkt zu Boden)'],
              ['Flüssig­chlor (NaOCl)', 'In den Strömungspfad nach der Filteranlage dosieren — gleichmäßige Verteilung'],
              ['Verteilung', 'Mit Wasser nachspülen, lange Umwälzzeit (mind. 8–12 h) abwarten'],
              ['Während Stoßchlorung', 'Becken gesperrt halten — Hinweisschild „Wartung"'],
            ].map(([k, v], i) => (
              <div key={i} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>

          <S title="Nach der Stoßchlorung" darkMode={darkMode}>
            {[
              { nr: '1', text: 'Chlorwert engmaschig messen (alle 1–2 h)' },
              { nr: '2', text: 'Becken erst wieder freigeben, wenn freies Chlor < 1,2 mg/L (idealerweise zurück im Sollbereich 0,3–0,6 mg/L)' },
              { nr: '3', text: 'Bei zu langsamer Abnahme: kein neues Chlor mehr dosieren, ggf. mit Wasserstoffperoxid oder Aktivkohlefilter neutralisieren (nur bei Anlagenausstattung)' },
              { nr: '4', text: 'pH-Wert erneut prüfen und nachjustieren' },
              { nr: '5', text: 'Filterspülung empfohlen — Stoßchlorung erhöht Filterbelastung' },
              { nr: '6', text: 'Vorgang im Betriebs­tage­buch eintragen mit Anlass, Mengen, Zeiten, Werten' },
            ].map(({ nr, text }) => (
              <div key={nr} className={`flex gap-3 p-2 mb-1 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{nr}</span>
                <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{text}</p>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'vorfaelle' && (
        <div>
          <S title="Typische Anlässe & Empfehlungen" darkMode={darkMode}>
            {[
              { fall: '💩 Stuhl im Becken (formter)', mass: 'Becken sofort räumen, Stuhl entfernen, Stoßchlorung auf 2–3 mg/L für 30 Min, mind. 1 vollständige Umwälzung. DGfdB-Empfehlung beachten.', dauer: '~6–8 h Sperre' },
              { fall: '💩💩 Stuhl-Durchfall im Becken', mass: 'Höchste Stufe! Becken vollständig entleeren oder Schock-Chlorung auf 20 mg/L für 12,5 h (Cryptosporidien-resistent). Filterspülung mit Granulat nachher.', dauer: 'mind. 12–24 h Sperre' },
              { fall: '🤮 Erbrochenes', mass: 'Material entfernen, Stoßchlorung auf 2 mg/L für 30 Min, Filterspülung', dauer: '4–6 h Sperre' },
              { fall: '🩸 Blut (kleine Menge)', mass: 'Bei aufrecht erhaltener Desinfektion (≥ 0,3 mg/L freies Chlor + Filter) keine Stoßchlorung nötig. Becken kurz räumen, Sichtkontrolle.', dauer: 'Sichtkontrolle' },
              { fall: '🩸🩸 Blut (große Menge)', mass: 'Becken räumen, Stoßchlorung auf 1 mg/L, Filterspülung. Bei Verdacht auf infektiöse Erkrankung: ggf. Becken entleeren.', dauer: '2–4 h Sperre' },
              { fall: '🌿 Algenbildung (Freibad)', mass: 'Stoßchlorung auf 5–10 mg/L, mechanische Reinigung der Beckenwände, Filterspülung, ggf. Algizid (vorsichtig dosiert).', dauer: '6–24 h Sperre' },
              { fall: '🦠 Hoher gebundener Chlorgehalt', mass: 'Break-Point-Stoßchlorung: freies Chlor auf das ~10-fache des gebundenen Chlors, bis Knickpunkt überschritten ist.', dauer: '8–12 h Sperre' },
              { fall: '🌅 Saisoneröffnung Freibad', mass: 'Vor Inbetriebnahme prophylaktische Stoßchlorung 10 mg/L für 24 h, danach komplette Filterspülung + Wasserwechsel teilweise.', dauer: '24–48 h vor Eröffnung' },
            ].map(({ fall, mass, dauer }, i) => (
              <div key={i} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{fall}</div>
                <div className={`text-xs mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{mass}</div>
                <div className={`text-xs italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Sperrdauer: {dauer}</div>
              </div>
            ))}
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-blue-900/40 border border-blue-700' : 'bg-blue-50 border border-blue-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>📋 DGfdB R 65.04</div>
            <div className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              Die DGfdB-Richtlinie R 65.04 „Verfahrensanweisung bei einem Stuhleintrag" ist die Standard-Empfehlung
              in Deutschland. Sie unterscheidet feste und flüssige Stuhleinträge und gibt konkrete Werte für die
              Stoßchlorung. Sollte im Bad griffbereit liegen.
            </div>
          </div>
        </div>
      )}

      {tab === 'sicherheit' && (
        <div>
          <S title="Sicherheit beim Personal" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Stoßchlorung bedeutet Umgang mit konzentrierten Chlorprodukten — Säure­schutzklasse PSA ist Pflicht.
            </p>
            {[
              ['Hände', 'Säureschutzhandschuhe (Nitril/Neopren) — KEIN Latex'],
              ['Augen', 'Vollschutzbrille, dicht anliegend — Spritzer können Erblindung verursachen'],
              ['Atemwege', 'Bei Pulver/Granulat oder Konzentrat: Halbmaske mit B-Filter'],
              ['Schürze', 'Säurefeste Schürze über Berufskleidung'],
              ['Schuhe', 'Geschlossen, säurefest'],
              ['Zugabeort', 'Belüfteter Raum, in der Nähe Augenspülstation und Notdusche'],
            ].map(([k, v], i) => (
              <div key={i} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>

          <S title="Häufige Fehler" darkMode={darkMode}>
            {[
              'Granulat trocken ins Becken werfen → Fleckenbildung, lokale Übersättigung, Korrosion',
              'Flüssigchlor und Säure gleichzeitig dosieren → Chlorgas im Technikraum',
              'pH-Wert nicht vorab korrigiert → schwächere Wirkung, mehr Chlor­bedarf',
              'Becken zu früh wieder freigegeben (Chlor > 1,2 mg/L) → Augen-/Atemwegsreizung der Gäste',
              'Keine Dokumentation → Beweisproblem bei späteren Beschwerden / Krankheitsfall',
              'Unzureichend Stoßchlorung (zu niedriger Wert) → produziert MEHR Chloramine statt weniger',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-red-500 font-bold">✗</span><span>{it}</span>
              </div>
            ))}
          </S>

          <S title="Notfall: Spritzer abbekommen?" darkMode={darkMode}>
            {[
              'Augen: sofort 15–20 Min mit fließendem Wasser spülen, Augenarzt',
              'Haut: kontaminierte Kleidung entfernen, Haut mit viel Wasser spülen',
              'Verschluckt: KEIN Erbrechen herbeiführen, viel Wasser trinken, 112 + Giftnotruf',
              'Eingeatmet (Chlorgas): an die frische Luft, halbsitzend, 112 — Lungenödem-Risiko verzögert',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-blue-500">→</span><span>{it}</span>
              </div>
            ))}
          </S>
        </div>
      )}
    </div>
  );
}
