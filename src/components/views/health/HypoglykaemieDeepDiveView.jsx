import { useState } from 'react';

const TABS = {
  grundlagen: { label: 'Grundlagen', icon: '🍬' },
  symptome:   { label: 'Symptome', icon: '⚠️' },
  unter_ueber:{ label: 'Unter- vs. Überzucker', icon: '🔀' },
  massnahmen: { label: 'Erstmaßnahmen', icon: '🚑' },
  bad:        { label: 'Im Bäderbetrieb', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{title}</h3>}
    {children}
  </div>
);

export default function HypoglykaemieDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('grundlagen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-amber-900/60 to-orange-900/40 border border-amber-800' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍬</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>Hypoglykämie & Diabetes-Notfälle</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Unterzucker erkennen, Verwechslung mit Bewusstlosigkeit vermeiden</p>
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
          <S title="Was ist Hypoglykämie?" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>Hypoglykämie = Unterzucker</strong>: Blutzuckerwert sinkt unter ca. 50–70 mg/dl (2,8–3,9 mmol/L).
              Das Gehirn kann Glucose nicht selbst herstellen und ist auf konstante Versorgung angewiesen — bei Mangel
              entstehen schnell neurologische Ausfälle.
            </p>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Bereich</th><th className="text-left p-2">mg/dl</th><th className="text-left p-2">mmol/L</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Normal nüchtern', '70–100', '3,9–5,6'],
                    ['Normal nach Essen', 'bis 140', 'bis 7,8'],
                    ['Hypoglykämie leicht', '50–70', '2,8–3,9'],
                    ['Hypoglykämie schwer', '< 50', '< 2,8'],
                    ['Hyperglykämie', '> 200', '> 11,1'],
                  ].map(([b, mg, mmol], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{b}</td>
                      <td className="p-2 font-mono">{mg}</td>
                      <td className="p-2 font-mono">{mmol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>

          <S title="Häufige Ursachen" darkMode={darkMode}>
            {[
              ['Insulin-Überdosierung', 'Diabetiker hat zu viel Insulin gespritzt'],
              ['Mahlzeit ausgelassen', 'Insulin gespritzt, aber nicht gegessen'],
              ['Sportliche Belastung', 'Schwimmen verbraucht viel Glucose — bei Insulin­therapie kritisch'],
              ['Alkohol', 'Leber kann Glucose nicht mehr nachliefern (Gluconeogenese gehemmt)'],
              ['Magen-Darm-Erkrankung', 'Erbrechen, Durchfall — Nahrung wird nicht aufgenommen'],
            ].map(([k, v]) => (
              <div key={k} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'symptome' && (
        <div>
          <S title="Symptome — von leicht bis schwer" darkMode={darkMode}>
            {[
              { phase: 'Frühphase', text: 'Hunger, Heißhunger, Schwitzen, Zittern, Herzrasen, Nervosität', color: 'yellow' },
              { phase: 'Neurologisch', text: 'Konzentrationsstörungen, Sprachstörungen, Verwirrtheit, Aggression, Sehstörungen', color: 'orange' },
              { phase: 'Schwer', text: 'Krampfanfall, Bewusstlosigkeit, Koma — sofortige Lebensgefahr', color: 'red' },
            ].map(({ phase, text, color }) => {
              const cols = {
                yellow: darkMode ? 'border-yellow-500 bg-yellow-900/20' : 'border-yellow-400 bg-yellow-50',
                orange: darkMode ? 'border-orange-500 bg-orange-900/20' : 'border-orange-400 bg-orange-50',
                red:    darkMode ? 'border-red-500 bg-red-900/20'       : 'border-red-400 bg-red-50',
              };
              const tc = {
                yellow: darkMode ? 'text-yellow-300' : 'text-yellow-800',
                orange: darkMode ? 'text-orange-300' : 'text-orange-800',
                red:    darkMode ? 'text-red-300'    : 'text-red-800',
              };
              return (
                <div key={phase} className={`rounded-xl border-l-4 p-3 mb-2 ${cols[color]}`}>
                  <div className={`text-xs font-bold mb-1 ${tc[color]}`}>{phase}</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{text}</div>
                </div>
              );
            })}
          </S>

          <S title="Häufige Verwechslungen" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Verwirrter Diabetiker — Alkohol oder Unterzucker?</strong> Symptome ähneln sich (Aggressivität, Koordinationsstörungen). Bei bekannten Diabetikern immer zuerst an Hypoglykämie denken.</div>
              <div><strong>Schlaganfall oder Hypoglykämie?</strong> Beide können Sprach- und Lähmungserscheinungen auslösen. Bei Diabetiker: Hypo zuerst behandeln, dann nochmal beurteilen.</div>
              <div><strong>Krampfanfall?</strong> Ein Krampfanfall bei Diabetiker kann Hypo-bedingt sein — die Behandlung ist dann Glucose, nicht (nur) Antikrampf.</div>
            </div>
          </S>
        </div>
      )}

      {tab === 'unter_ueber' && (
        <div>
          <S title="Unter- vs. Überzucker — Unterscheidung" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr>
                    <th className="text-left p-2">Merkmal</th>
                    <th className="text-left p-2 text-amber-400">Unterzucker (Hypo)</th>
                    <th className="text-left p-2 text-rose-400">Überzucker (Hyper)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Eintritt', 'Plötzlich (Minuten)', 'Langsam (Stunden bis Tage)'],
                    ['Haut', 'Blass, schweißnass, kühl', 'Trocken, gerötet, warm'],
                    ['Atmung', 'Normal bis schnell', 'Tief, schwer (Kussmaul-Atmung)'],
                    ['Atem-Geruch', 'Normal', 'Süßlich (Aceton — wie nach Nagellackentferner)'],
                    ['Bewusstsein', 'Verwirrt, aggressiv, evtl. bewusstlos', 'Schläfrig, Bewusstseinstrübung'],
                    ['Hunger/Durst', 'Heißhunger', 'Starker Durst, häufiges Wasserlassen'],
                    ['Behandlung', 'Zucker geben (Saft, Traubenzucker)', 'Insulin (durch Arzt) — Notruf']
                  ].map(([m, u, h], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{m}</td>
                      <td className="p-2">{u}</td>
                      <td className="p-2">{h}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-amber-900/40 border border-amber-700' : 'bg-amber-50 border border-amber-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>💡 Faustregel im Unklarheitsfall</div>
            <div className={`text-xs ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
              Wenn nicht sicher unterschieden werden kann <strong>und der Patient bei Bewusstsein ist</strong>:
              <strong> Zucker geben!</strong> Bei Hypo lebensrettend, bei Hyper nur kurzfristig kosmetisch — die zusätzliche Glucose schadet kaum, der fehlende Zucker bei Hypo schadet sehr.
            </div>
          </div>
        </div>
      )}

      {tab === 'massnahmen' && (
        <div>
          <S title="Erstmaßnahmen — bei Bewusstsein" darkMode={darkMode}>
            {[
              { nr: '1', text: 'Patient setzen, beruhigen, ansprechen' },
              { nr: '2', text: 'Schnellzucker geben: 1 Glas Saft, 1 Cola, 4–6 Stück Traubenzucker, Honig' },
              { nr: '3', text: 'Nach 10–15 Min: Besserung? Wenn nicht → Wiederholung' },
              { nr: '4', text: 'Wenn Besserung: Brot/Banane („langsamer Zucker") nachschieben' },
              { nr: '5', text: 'Patient nicht alleine lassen — Rückfall möglich' },
              { nr: '6', text: 'Bei Bewusstseinstrübung oder unklarer Lage → Notruf 112' },
            ].map(({ nr, text }) => (
              <div key={nr} className={`flex gap-3 p-2 mb-1 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{nr}</span>
                <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{text}</p>
              </div>
            ))}
          </S>

          <S title="Erstmaßnahmen — bei Bewusstlosigkeit" darkMode={darkMode}>
            <div className={`rounded p-3 mb-3 border-l-4 border-red-500 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>⚠️ NICHTS in den Mund geben!</div>
              <div className={`text-xs ${darkMode ? 'text-red-200' : 'text-red-700'}`}>Bei Bewusstlosen Aspirationsgefahr — Zucker/Saft kann in die Lunge laufen.</div>
            </div>
            {[
              { nr: '1', text: 'Notruf 112 — „Bewusstlos, vermutlich Hypoglykämie"' },
              { nr: '2', text: 'Bewusstsein und Atmung prüfen' },
              { nr: '3', text: 'Atmet normal → Stabile Seitenlage' },
              { nr: '4', text: 'Atemstillstand → HLW 30:2 + AED' },
              { nr: '5', text: 'Diabetiker-Ausweis suchen (Geldbörse, Smartphone-Fall) — RD informieren' },
              { nr: '6', text: 'Glucagon-Notfall-Set (z. B. Baqsimi-Nasenspray, GlucaGen-Spritze) — wenn vom Patienten mitgeführt und Personal geschult: nach Anweisung des RD-Disponenten anwenden lassen' },
            ].map(({ nr, text }) => (
              <div key={nr} className={`flex gap-3 p-2 mb-1 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{nr}</span>
                <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{text}</p>
              </div>
            ))}
          </S>

          <S title="Was sollte jeder Bademeister wissen?" darkMode={darkMode}>
            {[
              'Diabetiker-Ausweis kennen — meist im Portemonnaie oder als Notfall-Sticker am Handy',
              'Bekannte Diabetiker im Schwimmkurs / Stamm­gast — informieren, wo Notfall-Set liegt',
              'Insulinpumpen sind wasserdicht — meist können Diabetiker damit schwimmen, müssen sie aber regelmäßig kontrollieren',
              'Schwimmen senkt den Blutzucker — Hypogefahr während und bis 8 Std. nach intensivem Sport',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-amber-500">→</span><span>{it}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'bad' && (
        <div>
          <S title="Hypoglykämie im Bäderbetrieb" darkMode={darkMode}>
            {[
              { titel: '🏊 Schwimmen senkt Blutzucker stark', text: 'Hohe Glucose-Verbrennung — bei Insulintherapie schon nach 30–60 Min Hypogefahr. Diabetiker sollten vor dem Schwimmen messen, ggf. weniger Insulin oder Snack vorab.' },
              { titel: '🤿 Verwirrter Schwimmer', text: 'Verhalten wirkt wie Alkohol oder Aggression: torkelt, spricht undeutlich. Erst denken: Hypoglykämie? — sofort aus dem Wasser holen, Zucker.' },
              { titel: '🍬 Schnellzucker am Beckenrand', text: 'Bei bekannten Diabetikern: Saft / Traubenzucker griffbereit halten. Bademeister sollten wissen wo.' },
              { titel: '👕 Diabetiker-Ausweis', text: 'Vor dem Anziehen / Beim Bewusstlos-Auffinden in Kleidung schauen — Diabetiker tragen oft einen Notfall-Pass mit.' },
              { titel: '📋 Aufsicht­spflicht', text: 'Bei bekannten Diabetiker-Schülern: Eltern fragen nach Insulin/Notfall-Set. Bei Schwimmkursen für Kinder mit Diabetes immer den Plan kennen.' },
            ].map(({ titel, text }) => (
              <div key={titel} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>
        </div>
      )}
    </div>
  );
}
