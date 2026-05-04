import { useState } from 'react';

const TABS = {
  grundlagen: { label: 'Grundlagen', icon: '🦠' },
  trinkwv:    { label: 'TrinkwV & Pflichten', icon: '⚖️' },
  praevention: { label: 'Prävention im Bad', icon: '🛡️' },
  bei_befund: { label: 'Bei Befund', icon: '🚨' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{title}</h3>}
    {children}
  </div>
);

export default function LegionellenDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('grundlagen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-amber-900/60 to-yellow-900/40 border border-amber-800' : 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🦠</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>Legionellen & Trinkwasserverordnung</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Vermehrung, Übertragung, Pflichten nach TrinkwV</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-amber-600 text-white shadow'
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'grundlagen' && (
        <div>
          <S title="Was sind Legionellen?" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>Legionella pneumophila</strong> ist ein stäbchenförmiges Bakterium, das natürlich in Süßwasser vorkommt.
              In künstlichen Wasser­systemen (Warmwasserleitungen, Klimaanlagen, Whirlpools) kann es sich massiv vermehren.
              Die Übertragung erfolgt durch <strong>Aerosole</strong> beim Einatmen — nicht durch Trinken.
            </p>
            <div className={`rounded-lg p-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>Krankheitsbilder</div>
              <ul className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <li>→ <strong>Legionärskrankheit</strong>: schwere Lungenentzündung, Inkubation 2–10 Tage, Letalität 5–15 %</li>
                <li>→ <strong>Pontiac-Fieber</strong>: grippeähnlich, milder Verlauf, klingt nach 2–5 Tagen ab</li>
              </ul>
            </div>
          </S>

          <S title="Vermehrungsbedingungen" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Temperatur</th><th className="text-left p-2">Wirkung</th></tr>
                </thead>
                <tbody>
                  {[
                    ['< 20 °C', 'Wachstumsstopp — Bakterien überleben aber'],
                    ['25–45 °C', 'OPTIMALER Vermehrungsbereich — Gefahrenzone!'],
                    ['> 55 °C', 'Wachstumsstopp'],
                    ['> 60 °C (10 min)', 'Abtötung — thermische Desinfektion'],
                    ['> 70 °C (kurz)', 'Schnelle Abtötung'],
                  ].map(([t, w], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-mono">{t}</td>
                      <td className="p-2">{w}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs mt-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>Faustregel:</strong> Warmwasser muss am Austritt aus dem Speicher dauerhaft <strong>≥ 60 °C</strong>,
              an jeder Zapfstelle <strong>≥ 55 °C</strong> nach 3 Sekunden Ablauf erreichen (DVGW W 551).
            </div>
          </S>

          <S title="Risikofaktoren im Bäderbetrieb" darkMode={darkMode}>
            {[
              ['Stagnation', 'Wenig genutzte Zapfstellen — Wasser steht warm in Leitungen'],
              ['Lauwarme Bereiche', 'Mischwasser zwischen Kalt- und Warmleitung'],
              ['Biofilm', 'Ablagerungen in Leitungen → Schutzraum für Legionellen'],
              ['Aerosole', 'Duschen, Whirlpools, Wasserrutschen, Befeuchter — Übertragungsweg'],
              ['Lange Leitungen', 'Tot- und Stichleitungen, alte Hausanschlüsse'],
              ['Niedriger Durchfluss', 'Wasser kühlt ab und stagniert'],
            ].map(([k, v], i) => (
              <div key={i} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'trinkwv' && (
        <div>
          <S title="Trinkwasserverordnung (TrinkwV)" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die TrinkwV (zuletzt grundlegend novelliert 2023) regelt die Qualität von Trinkwasser in Deutschland.
              Schwimmbäder gelten als <strong>Gewerbliche/Öffentliche Tätigkeit</strong> (§3 Nr. 8 TrinkwV) und
              unterliegen besonderen Untersuchungspflichten.
            </p>
          </S>

          <S title="Untersuchungspflichten Legionellen" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Anlage</th><th className="text-left p-2">Häufigkeit</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Großanlage Warmwasser (Speicher > 400 L oder Leitung > 3 L)', 'Jährliche Beprobung Pflicht'],
                    ['Hausinstallation öffentlich (z. B. Schwimmbad)', 'Mindestens jährlich'],
                    ['Nach Befund-Sanierung', 'Erfolgskontrolle 4–6 Wochen nach Abschluss'],
                    ['Nach Bauarbeiten', 'Beprobung vor Wiederinbetriebnahme'],
                  ].map(([a, h], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{a}</td>
                      <td className="p-2 text-amber-400">{h}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>

          <S title="Maßnahmenwerte (TrinkwV Anlage 3)" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Befund (KBE/100 ml)</th><th className="text-left p-2">Bewertung</th><th className="text-left p-2">Maßnahme</th></tr>
                </thead>
                <tbody>
                  {[
                    ['< 100', 'Unauffällig', 'Routine-Überwachung'],
                    ['100–999', 'Mittlere Kontamination', 'Ortsbesichtigung, Ursachensuche, ggf. Sanierung'],
                    ['1.000–9.999', 'Hohe Kontamination', 'Sofortige Maßnahmen, Gefährdungsanalyse'],
                    ['≥ 10.000', 'Extrem hoch', 'Sofortige Nutzungseinschränkung, Gesundheitsamt informieren'],
                  ].map(([k, b, m], i) => {
                    const tone = i === 0 ? 'green' : i === 1 ? 'yellow' : i === 2 ? 'orange' : 'red';
                    const cell = darkMode ?
                      (tone === 'green' ? 'text-green-400' : tone === 'yellow' ? 'text-yellow-400' : tone === 'orange' ? 'text-orange-400' : 'text-red-400') :
                      (tone === 'green' ? 'text-green-700' : tone === 'yellow' ? 'text-yellow-700' : tone === 'orange' ? 'text-orange-700' : 'text-red-700');
                    return (
                      <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                        <td className={`p-2 font-mono font-bold ${cell}`}>{k}</td>
                        <td className={`p-2 font-semibold ${cell}`}>{b}</td>
                        <td className="p-2">{m}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              KBE = Koloniebildende Einheiten. Bezugswert: 100 ml Probe.
            </div>
          </S>

          <S title="Pflichten des Betreibers" darkMode={darkMode}>
            {[
              'Anzeigepflicht beim Gesundheitsamt vor Inbetriebnahme oder Änderung',
              'Beauftragung eines akkreditierten Untersuchungslabors (DAkkS)',
              'Probenentnahme an repräsentativen Stellen (TWE = Trinkwassererwärmer, fernste Zapfstelle u. a.)',
              'Untersuchungsergebnisse 10 Jahre aufbewahren',
              'Bei Maßnahmenwert: Gesundheitsamt unverzüglich informieren (§ 16 TrinkwV)',
              'Gefährdungsanalyse bei Befund > 100 KBE/100 ml',
              'Information der Nutzer bei Nutzungseinschränkung',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-amber-500">→</span><span>{it}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'praevention' && (
        <div>
          <S title="Prävention im Schwimmbad" darkMode={darkMode}>
            {[
              { titel: '🌡️ Temperaturmanagement', text: 'Warmwasser am Speicher ≥ 60 °C. An jeder Zapfstelle nach kurzem Spülen ≥ 55 °C. Kaltwasser ≤ 25 °C. Wenn nicht erreichbar: thermische Desinfektion (≥ 70 °C, 3 Min an jeder Stelle).' },
              { titel: '🚿 Stagnation vermeiden', text: 'Selten genutzte Duschen wöchentlich spülen (5 Min bei 60 °C). Tot- und Stichleitungen bauseits beseitigen lassen. Saisonalbäder vor Wiederinbetriebnahme komplett spülen + Probe.' },
              { titel: '🧽 Duschköpfe pflegen', text: 'Duschköpfe und Strahlregler vierteljährlich reinigen (Kalkentfernung) und desinfizieren. Kalk ist Biofilm-Substrat. Defekte Brauseschläuche austauschen.' },
              { titel: '🛁 Whirlpools / Warmwasser-Attraktionen', text: 'Höchstes Risiko! Tägliche Filterspülung, kontinuierliche Desinfektion, Wassertemp. dokumentieren. Nach Betrieb: Standzeit minimieren oder ablassen.' },
              { titel: '📊 Probenahme­plan', text: 'Repräsentative Stellen: Speicher-Austritt, Zirkulationsrücklauf, fernste Zapfstellen. Mindestens 3 Proben pro Anlage. Probenehmer geschult, sterile Gefäße, kühl transportiert.' },
              { titel: '🛠️ Bauliche Maßnahmen', text: 'Zirkulationspumpen prüfen (24/7 Betrieb). Dämmung Warmwasserleitungen, Trennung Kalt-/Warmleitung. Tot­leitungen ≤ 3-faches Rohrvolumen.' },
            ].map(({ titel, text }, i) => (
              <div key={i} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-amber-900/40 border border-amber-700' : 'bg-amber-50 border border-amber-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>📋 DVGW W 551 / W 553</div>
            <div className={`text-xs ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
              Die DVGW-Arbeitsblätter W 551 (Trinkwassererwärmungsanlagen) und W 553 (Bemessung von Zirkulationssystemen)
              sind die fachlichen Grundlagen — auch wenn nicht direkt bindend, gelten sie als Stand der Technik
              und werden im Streitfall vom Gericht herangezogen.
            </div>
          </div>
        </div>
      )}

      {tab === 'bei_befund' && (
        <div>
          <S title="Sofortmaßnahmen bei Legionellen-Befund" darkMode={darkMode}>
            <div className={`rounded-lg p-3 mb-3 border-l-4 border-red-500 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>⚠️ Bei extremer Kontamination (≥ 10.000 KBE/100 ml)</div>
              <div className={`text-xs ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
                Sofortige Nutzungseinschränkung der Duschen, Whirlpools, Aerosol-erzeugenden Anlagen.
                Gesundheitsamt unverzüglich informieren. Schriftlicher Aushang für Gäste. Sanierung umgehend einleiten.
              </div>
            </div>
            {[
              { nr: '1', name: 'Gefährdungsanalyse', text: 'Durch sachkundigen Hygieniker: Wo kommt das Bakterium her? Stagnation? Toleitung? Defekte Zirkulation? Falsche Temperatur?' },
              { nr: '2', name: 'Sofortmaßnahmen', text: 'Thermische Desinfektion: 70 °C über 3 Min an jeder Zapfstelle. Oder chemische Desinfektion (Chlordioxid, Wasserstoffperoxid).' },
              { nr: '3', name: 'Bauliche Sanierung', text: 'Tot­leitungen entfernen, Zirkulation optimieren, Speichertemperatur dauerhaft erhöhen, Filtertausch.' },
              { nr: '4', name: 'Erfolgskontrolle', text: '4–6 Wochen nach Sanierung Nachprobe. Erst nach negativem Ergebnis Freigabe der Anlage.' },
              { nr: '5', name: 'Dokumentation', text: 'Alle Maßnahmen, Befunde, Sanierungsarbeiten lückenlos dokumentieren — Pflicht nach TrinkwV §13.' },
            ].map(({ nr, name, text }) => (
              <div key={nr} className={`rounded-lg p-3 mb-2 flex gap-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="w-7 h-7 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{nr}</span>
                <div>
                  <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{name}</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
                </div>
              </div>
            ))}
          </S>

          <S title="Verdachtsfall: Erkrankung durch Bad-Wasser?" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Wenn ein Gesundheitsamt einen Verdachtsfall meldet (z. B. Legionärskrankheit nach Schwimmbadbesuch):
            </p>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <li>→ Volle Kooperation mit dem Gesundheitsamt</li>
              <li>→ Sonderbeprobung aller verdächtigen Stellen</li>
              <li>→ Übergabe der Wartungsprotokolle, Temperaturlogs, Hygieneplan</li>
              <li>→ Bis zur Klärung: kritische Bereiche (Whirlpool!) sperren</li>
              <li>→ Versicherung (Haftpflicht) frühzeitig informieren</li>
            </ul>
          </S>
        </div>
      )}
    </div>
  );
}
