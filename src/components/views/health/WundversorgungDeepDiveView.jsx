import { useState } from 'react';

const TABS = {
  wunden:     { label: 'Wundarten', icon: '🩹' },
  blutung:    { label: 'Blutungstypen', icon: '🩸' },
  druckverband:{ label: 'Druckverband', icon: '🎗️' },
  spezial:    { label: 'Spezialfälle', icon: '⚠️' },
  bad:        { label: 'Im Bad', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-rose-400' : 'text-rose-700'}`}>{title}</h3>}
    {children}
  </div>
);

export default function WundversorgungDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('wunden');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-rose-900/60 to-red-900/40 border border-rose-800' : 'bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🩹</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-rose-300' : 'text-rose-800'}`}>Wundversorgung & Druckverband</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Wundarten, Blutung stillen, Druckverband korrekt anlegen</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-rose-600 text-white shadow'
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'wunden' && (
        <div>
          <S title="Die wichtigsten Wundarten" darkMode={darkMode}>
            {[
              { name: 'Schürfwunde', desc: 'Oberflächlich, Hautabrieb. Schmerzhaft, blutet wenig, infektionsgefährdet.', versorgung: 'Reinigen, abdecken. Lockerer Verband.' },
              { name: 'Schnittwunde', desc: 'Glattrandig durch scharfe Klinge/Glas. Blutet stark, je nach Tiefe.', versorgung: 'Druckverband, ggf. Naht beim Arzt.' },
              { name: 'Platzwunde', desc: 'Stumpfe Gewalt, Haut platzt — Wundränder unregelmäßig. Häufig am Kopf.', versorgung: 'Druck mit sauberem Tuch, kühlen, Arzt für Naht.' },
              { name: 'Stichwunde', desc: 'Tief, kleine Eintrittsstelle. Innere Verletzungen oft unsichtbar.', versorgung: 'Fremdkörper drin lassen! Steril abdecken, 112.' },
              { name: 'Bisswunde', desc: 'Tier oder Mensch. Hohes Infektionsrisiko (Bakterien).', versorgung: 'Spülen, abdecken, Arzt — Tetanus-Schutz prüfen.' },
              { name: 'Quetschwunde', desc: 'Stumpfe Gewalt, Gewebe gequetscht. Heilt schlecht.', versorgung: 'Kühlen, ruhigstellen, Arzt.' },
              { name: 'Verbrennung', desc: 'Hitzeschaden. Siehe eigenes Modul „Verbrennungen".', versorgung: 'Kühlen mit lauwarmem Wasser, steril abdecken.' },
              { name: 'Amputation', desc: 'Körperteil abgetrennt — Druckverband, Notruf 112.', versorgung: 'Abgetrenntes Teil trocken einwickeln, in 2. Beutel mit kaltem Wasser. KEIN direkter Eiskontakt!' },
            ].map(({ name, desc, versorgung }) => (
              <div key={name} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-rose-400' : 'text-rose-700'}`}>{name}</div>
                <div className={`text-xs mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{desc}</div>
                <div className={`text-xs italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Versorgung: {versorgung}</div>
              </div>
            ))}
          </S>

          <S title="Allgemeine Wundversorgung — Schritte" darkMode={darkMode}>
            {[
              { nr: '1', text: 'Eigenschutz: Einmalhandschuhe anziehen' },
              { nr: '2', text: 'Wunde nicht berühren — keine Manipulation, keine Hausmittel' },
              { nr: '3', text: 'Bei starker Blutung: Druckverband (siehe Tab)' },
              { nr: '4', text: 'Wunde mit sterilem Verbandmaterial abdecken' },
              { nr: '5', text: 'Kein Pflaster auf große Wunden — atmungsaktive Kompresse' },
              { nr: '6', text: 'Vital­zeichen kontrollieren, Schock­zeichen beachten' },
              { nr: '7', text: 'Bei Bedarf 112 oder ärztliche Versorgung' },
              { nr: '8', text: 'Tetanus-Schutz erfragen — Auffrischung alle 10 Jahre' },
            ].map(({ nr, text }) => (
              <div key={nr} className={`flex gap-3 p-2 mb-1 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{nr}</span>
                <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{text}</p>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'blutung' && (
        <div>
          <S title="Drei Blutungstypen" darkMode={darkMode}>
            {[
              { typ: 'Arterielle Blutung', icon: '🔴', color: 'red',
                merkmal: 'Hellrot, spritzend (pulsierend, im Herzrhythmus)',
                gefahr: 'Schnell hoher Blutverlust — Schock binnen Minuten',
                massnahme: 'Sofort Druckverband, Notruf 112. Abbinden nur als letztes Mittel.' },
              { typ: 'Venöse Blutung', icon: '🟣', color: 'purple',
                merkmal: 'Dunkelrot, gleichmäßig fließend',
                gefahr: 'Bei großer Vene auch lebensbedrohlich — z. B. Halsvene',
                massnahme: 'Druckverband, Wunde hochlagern. Bei Halsvene: NICHT abbinden, Druck mit Hand.' },
              { typ: 'Kapilläre Blutung', icon: '🟠', color: 'orange',
                merkmal: 'Hellrot, sickernd aus der Wundfläche',
                gefahr: 'Selten lebensbedrohlich, aber Infektionsrisiko',
                massnahme: 'Reinigen, Pflaster, ggf. Verband.' },
            ].map(({ typ, icon, color, merkmal, gefahr, massnahme }) => {
              const cols = {
                red:    darkMode ? 'border-red-500 bg-red-900/20'       : 'border-red-400 bg-red-50',
                purple: darkMode ? 'border-purple-500 bg-purple-900/20' : 'border-purple-400 bg-purple-50',
                orange: darkMode ? 'border-orange-500 bg-orange-900/20' : 'border-orange-400 bg-orange-50',
              };
              return (
                <div key={typ} className={`rounded-xl border-l-4 p-3 mb-2 ${cols[color]}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{icon}</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{typ}</span>
                  </div>
                  <div className={`text-xs mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}><strong>Merkmal:</strong> {merkmal}</div>
                  <div className={`text-xs mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}><strong>Gefahr:</strong> {gefahr}</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}><strong>Maßnahme:</strong> {massnahme}</div>
                </div>
              );
            })}
          </S>

          <S title="Blutverlust — Faustwerte" darkMode={darkMode}>
            <div className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Erwachsene haben ~5–6 Liter Blut. Kritisch wird's ab:
            </div>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Blutverlust</th><th className="text-left p-2">% des Volumens</th><th className="text-left p-2">Wirkung</th></tr>
                </thead>
                <tbody>
                  {[
                    ['~500 ml', '< 10 %', 'Spende-Niveau, gut kompensierbar'],
                    ['~1.000 ml', '15–20 %', 'Schockzeichen beginnen — Blässe, Pulsanstieg'],
                    ['~1.500 ml', '25–30 %', 'Manifester Schock — Blutdruckabfall'],
                    ['> 2.000 ml', '> 40 %', 'Lebensgefahr — sofortige Transfusion nötig'],
                  ].map(([m, p, w], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-mono">{m}</td>
                      <td className="p-2 font-mono">{p}</td>
                      <td className="p-2">{w}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
        </div>
      )}

      {tab === 'druckverband' && (
        <div>
          <S title="Druckverband — Schritt für Schritt" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Der Druckverband stillt arterielle und schwere venöse Blutungen. Vorteil gegenüber Abbinden:
              kein Gewebeschaden — sollte als <strong>erste Wahl</strong> bei Extremitätenblutungen angewandt werden.
            </p>
            {[
              { nr: '1', name: 'Vorbereitung', text: 'Einmalhandschuhe, sterile Wundauflage, Verbandpäckchen, ggf. Druckpolster (zweites Verbandpäckchen, Kompresse, kleines Buch o. ä.)' },
              { nr: '2', name: 'Hochlagern', text: 'Verletzte Extremität (Arm/Bein) hochhalten — reduziert Blutfluss durch Schwerkraft' },
              { nr: '3', name: 'Wundauflage', text: 'Sterile Wundauflage direkt auf die Wunde — nicht erst „spülen" oder „reinigen"' },
              { nr: '4', name: 'Verbandpäckchen', text: 'Mit zwei Touren um die Wundauflage wickeln (zur Fixierung)' },
              { nr: '5', name: 'Druckpolster auflegen', text: 'Druckpolster (zweites unausgewickeltes Verbandpäckchen) GENAU auf die Wunde, FEST drücken' },
              { nr: '6', name: 'Festwickeln', text: 'Mit dem restlichen Verband fest, aber nicht abschnürend, weiter umwickeln. Druck muss spürbar sein.' },
              { nr: '7', name: 'Kontrollieren', text: 'Blutung steht? Wenn nicht: zweiten Druckverband ÜBER den ersten — nicht entfernen!' },
              { nr: '8', name: 'Schock­prophylaxe', text: 'Schocklage (Beine hoch), warm halten, Notruf 112, Vital­zeichen kontrollieren' },
            ].map(({ nr, name, text }) => (
              <div key={nr} className={`rounded-lg p-3 mb-2 flex gap-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="w-7 h-7 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{nr}</span>
                <div>
                  <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-rose-400' : 'text-rose-700'}`}>{name}</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
                </div>
              </div>
            ))}
          </S>

          <S title="Wenn der Druckverband nicht reicht" darkMode={darkMode}>
            {[
              ['Zweiter Druckverband', 'ÜBER den ersten — niemals den ersten entfernen (Blutgerinnsel würden mit gerissen)'],
              ['Manuelle Kompression', 'Mit der Hand direkt auf die Wundstelle drücken — bis Helfer kommen'],
              ['Abdrücken zentraler Arterie', 'Nur als Übergangslösung: bei Armblutung Oberarm, bei Beinblutung Leiste'],
              ['Tourniquet / Abbindemanschette', 'Letztes Mittel bei lebensbedrohlicher Extremitätenblutung. 5 cm proberhalb der Wunde, fest. Uhrzeit dokumentieren!'],
            ].map(([k, v]) => (
              <div key={k} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-rose-400' : 'text-rose-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-amber-900/40 border border-amber-700' : 'bg-amber-50 border border-amber-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>⚠️ Was NICHT tun</div>
            <ul className={`text-xs space-y-0.5 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
              <li>• KEIN Abdrücken am Hals (ersetzt Schlaganfall durch Schlaganfall)</li>
              <li>• KEIN Verband auf Augen oder offene Brustwunden ohne Spezialprotokoll</li>
              <li>• KEIN Tourniquet zu kurz (immer mind. 4 cm breit, schmale Schnüre verletzen)</li>
              <li>• Druck NICHT lösen, um „mal nachzusehen" — Gerinnsel würde reißen</li>
            </ul>
          </div>
        </div>
      )}

      {tab === 'spezial' && (
        <div>
          <S title="Spezielle Wundsituationen" darkMode={darkMode}>
            {[
              { titel: '🔪 Fremdkörper in der Wunde', text: 'NICHT entfernen! (Würde Blutung freisetzen.) Fremdkörper polstern, Verband drumherum legen. 112.' },
              { titel: '🧠 Kopfplatzwunde', text: 'Stark blutend, sieht dramatisch aus, ist aber meist harmlos. Druck mit sauberem Tuch, ggf. Kühlung, Arzt für Naht. Bewusstseinslage prüfen!' },
              { titel: '👃 Nasenbluten', text: 'Patient nach VORN beugen lassen (NICHT in den Nacken!), Nasenflügel zusammendrücken, kühlen Lappen in den Nacken. > 20 Min: Arzt.' },
              { titel: '👂 Ohrblutung', text: 'Bei Sturz/Schädelbruchverdacht: NICHT zustopfen! Sterile Auflage locker, Patient auf BLUTENDE Seite legen — Liquor/Blut soll abfließen. 112.' },
              { titel: '👁️ Augenwunde', text: 'NICHT spülen wenn Fremdkörper drin. Beide Augen abdecken (sonst Mitbewegung). Sofort Augenarzt / 112.' },
              { titel: '🫁 Brustwunde („saugende Wunde")', text: 'Pneumothorax-Gefahr (Lunge fällt zusammen). Wunde abdecken (sterile Auflage), Patient halbsitzend mit Rückenstütze, 112.' },
              { titel: '🩻 Bauchwunde mit Eingeweide-Vorfall', text: 'NICHT zurückschieben. Steril feucht abdecken (z. B. mit feuchtem Tuch), Patient mit angezogenen Beinen lagern, 112.' },
              { titel: '✂️ Amputation', text: 'Druckverband am Stumpf, abgetrenntes Teil trocken in Plastikbeutel, in zweiten Beutel mit kaltem Wasser/Eis (KEIN direkter Eiskontakt!), 112.' },
              { titel: '💉 Stichverletzung mit fremdem Blut', text: 'Wunde 1–2 Min ausbluten lassen, mit Wasser/Seife reinigen, desinfizieren. Hepatitis/HIV-Beratung beim Arzt — Postexpositionsprophylaxe binnen 2 Stunden möglich.' },
            ].map(({ titel, text }) => (
              <div key={titel} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-rose-400' : 'text-rose-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'bad' && (
        <div>
          <S title="Wundversorgung im Bäderbetrieb" darkMode={darkMode}>
            {[
              { titel: '🥼 Verbandskasten DIN 13157', text: 'Pflicht in jedem Betrieb (>10 MA). Mindestinhalt: Wundauflagen, Verbandpäckchen, Pflaster, Schere, Einmalhandschuhe, Rettungsdecke. Im Bad zentral und in jedem Bereich erreichbar.' },
              { titel: '🧤 Eigenschutz immer', text: 'Einmalhandschuhe vor jedem Patientenkontakt. Bei Spritzgefahr: Schutzbrille. Hepatitis B-Impfung empfohlen.' },
              { titel: '🪟 Glasscherben am Beckenrand', text: 'Häufig — barfuß-Verletzung. Sofort Beckenbereich räumen, Glas entfernen, Wunde versorgen, Kontamination des Wassers prüfen.' },
              { titel: '🦠 Blutkontakt im Wasser', text: 'Bei großer Blutmenge: Bereich räumen, Wasserwerte und Trübung prüfen, ggf. Desinfektion erhöhen, Protokoll führen.' },
              { titel: '🩹 Pflaster auf offene Wunde', text: 'Personen mit offenen Wunden dürfen nach IfSG nicht ins Becken. Wasserfeste Pflaster nur für kleine, geschlossene Wunden zulassen.' },
              { titel: '💉 HIV/Hepatitis-Risiko', text: 'Bei stärkerer Blutung: Personalkenntnisse, Erste-Hilfe-Tasche, Hepatitis-B-Schutz. Nach Kontakt: Wunde ausbluten lassen, desinfizieren, Betriebsarzt.' },
              { titel: '📋 Dokumentation', text: 'Verbandbuch nach DGUV — jede Erste-Hilfe-Maßnahme dokumentieren (Datum, Person, Verletzung, Maßnahme, Ersthelfer). Wichtig für BG-Anerkennung.' },
            ].map(({ titel, text }) => (
              <div key={titel} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-rose-400' : 'text-rose-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>
        </div>
      )}
    </div>
  );
}
