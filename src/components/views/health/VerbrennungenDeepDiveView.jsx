import { useState } from 'react';

const TABS = {
  grade:      { label: 'Verbrennungsgrade', icon: '🔥' },
  ausdehnung: { label: 'Ausdehnung (9er-Regel)', icon: '📏' },
  massnahmen: { label: 'Erstmaßnahmen', icon: '🚑' },
  sonne:      { label: 'Sonnenbrand & UV', icon: '☀️' },
  bad:        { label: 'Im Freibad', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{title}</h3>}
    {children}
  </div>
);

export default function VerbrennungenDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('grade');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-orange-900/60 to-red-900/40 border border-orange-800' : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>Verbrennungen & Sonnenbrand</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Grade, 9er-Regel, Erstmaßnahmen, UV-Schutz im Freibad</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-orange-600 text-white shadow'
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'grade' && (
        <div>
          <S title="Verbrennungsgrade" darkMode={darkMode}>
            {[
              { grad: 'I', name: 'Oberflächlich (Epidermis)', signs: ['Rötung', 'Schmerz', 'Keine Blasen', 'Heilung 5–7 Tage', 'Keine Narben'], color: 'yellow', bsp: 'Sonnenbrand, kurze Berührung Heizkörper' },
              { grad: 'IIa', name: 'Oberflächlich dermal', signs: ['Blasen, gefüllt mit Flüssigkeit', 'Sehr schmerzhaft', 'Wundgrund rosig', 'Heilung 1–2 Wochen', 'Selten Narben'], color: 'orange', bsp: 'Heißes Wasser, Sauna-Bank, kurze Flamme' },
              { grad: 'IIb', name: 'Tief dermal', signs: ['Blasen vorhanden, Wundgrund weißlich', 'Schmerz vermindert (Nerven geschädigt)', 'Heilung > 3 Wochen', 'Narben wahrscheinlich'], color: 'red', bsp: 'Längerer Kontakt mit heißer Oberfläche' },
              { grad: 'III', name: 'Volle Hautdicke', signs: ['Lederartig, weißlich/braun/schwarz', 'KEIN Schmerz an verbrannter Stelle (Nerven zerstört)', 'Heilung nur durch Hauttransplantation', 'Narben + Funktionsverlust'], color: 'rose', bsp: 'Lange Flamme, Stromunfall' },
              { grad: 'IV', name: 'Verkohlung', signs: ['Bis Muskel/Knochen zerstört', 'Schwarz, trocken', 'Lebensgefahr', 'Aufwendige Chirurgie'], color: 'slate', bsp: 'Strom-Hochspannung, lange Flammeinwirkung' },
            ].map(({ grad, name, signs, color, bsp }) => {
              const cols = {
                yellow: darkMode ? 'border-yellow-500 bg-yellow-900/20' : 'border-yellow-400 bg-yellow-50',
                orange: darkMode ? 'border-orange-500 bg-orange-900/20' : 'border-orange-400 bg-orange-50',
                red:    darkMode ? 'border-red-500 bg-red-900/20'       : 'border-red-400 bg-red-50',
                rose:   darkMode ? 'border-rose-500 bg-rose-900/30'     : 'border-rose-400 bg-rose-50',
                slate:  darkMode ? 'border-slate-500 bg-slate-700/40'   : 'border-slate-400 bg-slate-100',
              };
              return (
                <div key={grad} className={`rounded-xl border-l-4 p-3 mb-2 ${cols[color]}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-white text-gray-700'}`}>Grad {grad}</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{name}</span>
                  </div>
                  <ul className={`text-xs space-y-0.5 mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {signs.map((s, i) => <li key={i}>→ {s}</li>)}
                  </ul>
                  <div className={`text-xs italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Beispiel: {bsp}</div>
                </div>
              );
            })}
          </S>
        </div>
      )}

      {tab === 'ausdehnung' && (
        <div>
          <S title="9er-Regel nach Wallace (Erwachsene)" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Schnelle Abschätzung der verbrannten Körperoberfläche (KOF) in Prozent — wichtig für Notruf und Schweregradbeurteilung.
            </p>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Körperregion</th><th className="text-right p-2">KOF Erwachsen</th><th className="text-right p-2">KOF Kind</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Kopf + Hals', '9 %', '18 %'],
                    ['Arm (je)', '9 %', '9 %'],
                    ['Bein (je)', '18 %', '14 %'],
                    ['Rumpf vorne', '18 %', '18 %'],
                    ['Rumpf hinten', '18 %', '18 %'],
                    ['Genital', '1 %', '1 %'],
                  ].map(([region, e, k], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{region}</td>
                      <td className="p-2 text-right font-mono text-orange-400">{e}</td>
                      <td className="p-2 text-right font-mono text-amber-400">{k}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs mt-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>Handflächen-Regel:</strong> Die Handfläche des Patienten (mit Fingern) entspricht ca. 1 % seiner Körperoberfläche. Praktisch für kleine Flächen.
            </div>
          </S>

          <S title="Wann ist es ein schwerer Fall?" darkMode={darkMode}>
            {[
              ['> 10 % KOF', 'Erwachsene mit Verbrennung Grad II oder III'],
              ['> 5 % KOF', 'Kinder, Senioren, Vorerkrankte'],
              ['Gesicht / Hände / Genital', 'Funktionelle Bedeutung — immer ärztliche Versorgung'],
              ['Atemwegs-Beteiligung', 'Inhalations­trauma — sofortiger Notruf, Lebensgefahr'],
              ['Stromunfall', 'Auch wenn Hautläsion klein wirkt — Herzschäden möglich'],
              ['Chemische Verbrennung', 'Säuren/Laugen — sofort spülen, Notruf'],
            ].map(([k, v]) => (
              <div key={k} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'massnahmen' && (
        <div>
          <S title="Erstmaßnahmen Schritt für Schritt" darkMode={darkMode}>
            {[
              { nr: '1', name: 'Eigenschutz', text: 'Bei Brand/Strom: erst Stromkreis trennen, eigene Sicherheit gewährleisten. Brennende Person: Wasser, Decke, am Boden rollen.' },
              { nr: '2', name: 'Brand löschen / Kontakt unterbrechen', text: 'Kleidung schnell ausziehen — aber NICHT wenn fest mit Haut verbacken (sonst Hautablösung).' },
              { nr: '3', name: 'Kühlen — gezielt!', text: 'Kleinflächige Verbrennung (< 10 % KOF, Grad I/II): mit lauwarmem Wasser (15–20 °C) 10–20 Min. kühlen. KEIN Eis! KEIN eiskaltes Wasser!' },
              { nr: '4', name: 'Großflächig NICHT kühlen', text: 'Bei > 15 % KOF und schweren Verbrennungen: Auskühlung (Hypothermie) verhindert Heilung. Stattdessen warm halten.' },
              { nr: '5', name: 'Wunde abdecken', text: 'Steriles Brand­tuch / Metalline-Kompresse locker auflegen. Keine Salben, kein Mehl, kein Hausmittel!' },
              { nr: '6', name: 'Notruf 112', text: 'Bei Grad II ab 5 %, Grad III ab kleinster Fläche, Gesicht, Hände, Genital, Atemweg, Strom-, Chemikalienunfall.' },
              { nr: '7', name: 'Schockprophylaxe', text: 'Schocklage wenn keine Kontraindikation, beruhigen, warm halten (Rettungsdecke). Vital­zeichen kontrollieren.' },
            ].map(({ nr, name, text }) => (
              <div key={nr} className={`rounded-lg p-3 mb-2 flex gap-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="w-7 h-7 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{nr}</span>
                <div>
                  <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{name}</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
                </div>
              </div>
            ))}
          </S>

          <S title="Was NICHT tun" darkMode={darkMode}>
            {[
              'Brandblasen NICHT öffnen — natürlicher Schutz',
              'KEIN Mehl, Öl, Butter, Zahnpasta — Infektionsgefahr',
              'KEIN Eis oder Eiswasser — Erfrierungsschaden zusätzlich',
              'KEIN Verbinden mit Watte oder fasrigen Tüchern',
              'Verbackene Kleidung NICHT abreißen',
              'NICHT die Person alleine lassen',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-red-500 font-bold">✗</span><span>{it}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'sonne' && (
        <div>
          <S title="Sonnenbrand — Was passiert?" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Sonnenbrand ist eine echte <strong>Verbrennung Grad I (manchmal IIa)</strong> durch UV-B-Strahlung.
              Im Freibad wird oft unterschätzt: Reflexion durch Wasser (~5 %) und helle Beläge erhöht die UV-Belastung.
            </p>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Hauttyp</th><th className="text-left p-2">Eigenschutzzeit</th><th className="text-left p-2">SPF empfohlen</th></tr>
                </thead>
                <tbody>
                  {[
                    ['I — sehr hell, rot/blond', '5–10 Min', 'SPF 50+'],
                    ['II — hell, blond', '10–20 Min', 'SPF 30–50'],
                    ['III — mittel, dunkelblond', '20–30 Min', 'SPF 20–30'],
                    ['IV — bräunlich', '40 Min', 'SPF 15–20'],
                    ['V/VI — dunkel/schwarz', '60+ Min', 'SPF 15+'],
                  ].map(([typ, ez, spf], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{typ}</td>
                      <td className="p-2">{ez}</td>
                      <td className="p-2 font-mono text-orange-400">{spf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Schutzzeit ergibt sich aus Eigenschutzzeit × LSF. Beispiel: Hauttyp II mit LSF 30 = ca. 10–20 × 30 = 300–600 Min — aber nicht ausreizen!
            </div>
          </S>

          <S title="Erstmaßnahmen Sonnenbrand" darkMode={darkMode}>
            {[
              ['Aus der Sonne', 'In den Schatten / drinnen — UV-Belastung sofort beenden'],
              ['Kühlen', 'Lauwarmes Wasser, feuchte Tücher, kühles Duschen — KEIN Eis'],
              ['Trinken', 'Wasser, Saftschorle — Sonnenbrand entzieht Flüssigkeit'],
              ['Lotion', 'After-Sun, Aloe Vera, kühlende Gels'],
              ['Schmerzmittel', 'Bei Bedarf Ibuprofen / Paracetamol — wirkt entzündungshemmend'],
              ['Arzt aufsuchen', 'Bei großflächigem Sonnenbrand mit Blasen, Fieber, Schüttelfrost, Kindern, Bewusstseinsstörung'],
            ].map(([k, v]) => (
              <div key={k} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>

          <S title="UV-Index & Sonnenstich" darkMode={darkMode}>
            <div className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Der <strong>UV-Index</strong> beschreibt die Intensität der UV-Strahlung von 0 (gering) bis 11+ (extrem).
              Im Sommer in Deutschland erreicht er regelmäßig 7–9.
            </div>
            <div className={`rounded p-3 border-l-4 border-red-500 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>⚠️ Sonnenstich (Insolation)</div>
              <div className={`text-xs ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
                Direkte Sonneneinstrahlung auf den Kopf reizt die Hirnhäute. Symptome: heißer roter Kopf, Übelkeit,
                Kopfschmerzen, Benommenheit, Nackensteifigkeit. → In den Schatten, Kopf hochlagern, kühlen, viel trinken,
                bei Bewusstseinstrübung 112.
              </div>
            </div>
          </S>
        </div>
      )}

      {tab === 'bad' && (
        <div>
          <S title="Verbrennungen im Bäderbetrieb" darkMode={darkMode}>
            {[
              { titel: '☀️ Sonnenbrand — am häufigsten', text: 'Über 80 % der Hautschäden im Freibad. Aufgabe: Gäste freundlich auf UV-Schutz aufmerksam machen, Schattenplätze ausweisen, Sonnencreme im Kiosk anbieten.' },
              { titel: '🥵 Heißer Belag / heiße Sprungbretter', text: 'Schwarze Beckenrand­fliesen können in der Sonne 60+ °C erreichen — Verbrennungsrisiko an Füßen, besonders bei Kindern. Schatten bzw. Wässern empfehlen.' },
              { titel: '🔥 Sauna & Heißwasser', text: 'In Saunaanlagen: Verbrennungsrisiko an Saunaöfen, Aufgüssen mit zu viel Wasser, heißen Sitzbänken (besonders die obere Reihe).' },
              { titel: '⚡ Stromunfall', text: 'Selten, aber im Bad besonders gefährlich (Wasser leitet). Nach Stromunfall: auch ohne sichtbare Verbrennung 112 — Herzrhythmusstörungen können verzögert auftreten.' },
              { titel: '🧒 Kinder besonders gefährdet', text: 'Dünnere Haut, größere KOF im Verhältnis, schnellere Auskühlung. Bei kleinen Kindern: bei jeder Brandblase Arzt aufsuchen.' },
              { titel: '🧴 Chlor­verätzung', text: 'Bei Hautkontakt mit konzentrierter Chemie (Calcium­hypochlorit, Schwefelsäure für pH-Senkung): sofort 15–20 Min spülen, Kleidung entfernen, Notruf bei großflächigem Kontakt.' },
            ].map(({ titel, text }) => (
              <div key={titel} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>
        </div>
      )}
    </div>
  );
}
