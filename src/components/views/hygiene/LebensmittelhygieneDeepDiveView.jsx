import { useState } from 'react';

const TABS = {
  rechtsrahmen: { label: 'Rechtsrahmen', icon: '⚖️' },
  haccp:        { label: 'HACCP-Konzept', icon: '📊' },
  praxis:       { label: 'Praxis Imbiss/Kiosk', icon: '🍔' },
  kontrolle:    { label: 'Kontrolle & Doku', icon: '📋' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{title}</h3>}
    {children}
  </div>
);

export default function LebensmittelhygieneDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('rechtsrahmen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-emerald-900/60 to-teal-900/40 border border-emerald-800' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍔</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>Lebensmittelhygiene</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Imbiss, Kiosk, Bistro im Bäderbetrieb — LMHV, HACCP, IfSG</p>
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

      {tab === 'rechtsrahmen' && (
        <div>
          <S title="Rechtsgrundlagen — Übersicht" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Wer im Bäderbetrieb Lebensmittel verkauft (Imbiss, Kiosk, Bistro, Eis-Theke), unterliegt einer
              Vielzahl von Vorschriften. Die wichtigsten:
            </p>
            {[
              ['LMHV', 'Lebensmittelhygiene-Verordnung — nationale Umsetzung der EU-Verordnung'],
              ['VO (EG) 852/2004', 'EU-Verordnung über Lebensmittelhygiene — gilt direkt'],
              ['VO (EU) 1169/2011', 'Lebensmittelinformationsverordnung (LMIV) — Kennzeichnung, Allergene'],
              ['IfSG § 42, 43', 'Infektionsschutzgesetz — Tätigkeitsverbot, Belehrung'],
              ['LFGB', 'Lebensmittel- und Futtermittelgesetzbuch — übergeordnetes Gesetz'],
              ['Tabakerzeugnisgesetz', 'Bei Verkauf von Tabak/E-Zigaretten am Kiosk'],
            ].map(([gesetz, info], i) => (
              <div key={i} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{gesetz}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{info}</span>
              </div>
            ))}
          </S>

          <S title="Belehrung nach § 43 IfSG" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Jede Person, die mit leicht verderblichen Lebensmitteln umgeht (zubereiten, in Verkehr bringen),
              braucht vor erstmaliger Tätigkeit eine <strong>Erstbelehrung durch das Gesundheitsamt</strong>.
            </p>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <li>→ Erstbelehrung nicht älter als 3 Monate vor Tätigkeitsbeginn</li>
              <li>→ Bescheinigung dauerhaft im Betrieb hinterlegen</li>
              <li>→ Folgebelehrung jährlich durch den Arbeitgeber, schriftlich dokumentiert</li>
              <li>→ Inhalt: Hygieneregeln, Tätigkeitsverbote, Meldepflichten</li>
            </ul>
          </S>

          <S title="Tätigkeits- und Beschäftigungsverbote (§ 42 IfSG)" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Folgende Erkrankungen führen zu <strong>sofortigem Tätigkeitsverbot</strong> bei Lebensmittelumgang:
            </p>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <li>• Cholera, Typhus, Paratyphus, Shigellen-Ruhr</li>
              <li>• Salmonellen-Infektion</li>
              <li>• Hepatitis A oder E</li>
              <li>• Akute infektiöse Gastroenteritis (Erbrechen + Durchfall)</li>
              <li>• EHEC-Infektion</li>
              <li>• Eitrige, infizierte Wunden an Händen oder Armen</li>
              <li>• Tuberkulose der Atemwege im ansteckungsfähigen Stadium</li>
            </ul>
            <div className={`text-xs mt-2 italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Mitarbeiter müssen Erkrankungen unverzüglich dem Arbeitgeber melden — diese muss das Gesundheitsamt informieren.
            </div>
          </S>
        </div>
      )}

      {tab === 'haccp' && (
        <div>
          <S title="HACCP — Eigenkontrollsystem" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>HACCP</strong> = Hazard Analysis and Critical Control Points (Gefahrenanalyse und kritische
              Lenkungspunkte). Pflicht für jeden Lebensmittelbetrieb (auch kleiner Imbiss am Schwimmbad)
              nach VO (EG) 852/2004 Art. 5.
            </p>
          </S>

          <S title="Die 7 HACCP-Grundsätze" darkMode={darkMode}>
            {[
              ['1. Gefahrenanalyse', 'Welche Gefahren (mikrobiologisch, chemisch, physikalisch) gibt es im Prozess?'],
              ['2. Kritische Lenkungspunkte (CCPs) bestimmen', 'An welchen Punkten kann eine Gefahr beherrscht werden?'],
              ['3. Grenzwerte festlegen', 'Welcher Wert ist sicher? (z. B. Frittiertemp. 175 °C, Kühltemp. ≤ 7 °C)'],
              ['4. Überwachung', 'Wie und wie oft wird gemessen? (z. B. Thermometer, Zeitkontrolle)'],
              ['5. Korrekturmaßnahmen', 'Was tun wenn Grenzwert verletzt? (Speise wegwerfen, Kühlung erhöhen)'],
              ['6. Verifizierung', 'Funktioniert das System? Externe Audits, Hygienekontrolle'],
              ['7. Dokumentation', 'Alles schriftlich festhalten — Beweis im Streitfall'],
            ].map(([titel, text], i) => (
              <div key={i} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>

          <S title="Typische CCPs am Bad-Imbiss" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Prozess</th><th className="text-left p-2">Grenzwert</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Wareneingang', 'Kühlware ≤ 7 °C, TK ≤ −18 °C, Verpackung intakt'],
                    ['Lagerung Kühlware', '≤ 7 °C (Hackfleisch ≤ 4 °C, Geflügel ≤ 4 °C)'],
                    ['Lagerung TK', '≤ −18 °C'],
                    ['Erhitzen', 'Kerntemperatur ≥ 72 °C für 2 Min'],
                    ['Frittieröl', 'Sauberkeit, Wechsel bei Verdunkelung, Frittiertemp. 170–180 °C'],
                    ['Warmhaltung', '≥ 65 °C für max. 3 Stunden'],
                    ['Abkühlen', 'Von 65 °C auf ≤ 7 °C in unter 2 Stunden'],
                  ].map(([p, g], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{p}</td>
                      <td className="p-2 font-mono text-emerald-400">{g}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
        </div>
      )}

      {tab === 'praxis' && (
        <div>
          <S title="Imbiss am Schwimmbad — Praxis" darkMode={darkMode}>
            {[
              { titel: '🌭 Pommes & Frittiertes', text: 'Frittiertemp. 170–180 °C. Öl regelmäßig wechseln (Polare Anteile > 24 % = Wechselpflicht). Frittierkorb sauber halten, Krümel täglich entfernen.' },
              { titel: '🍦 Eis aus der Tiefkühlung', text: 'TK-Truhe ≤ −18 °C, mit Thermometer. Soft-Eis-Maschinen täglich reinigen + desinfizieren (Listerien-Risiko). Portionierer im fließenden Wasser stehen lassen, Wasser regelmäßig wechseln.' },
              { titel: '🥤 Getränke', text: 'Zapfanlagen wöchentlich reinigen + desinfizieren. Schläuche jährlich tauschen. Eiswürfel aus Trinkwasser, Eismaschine wöchentlich reinigen.' },
              { titel: '🥪 Belegte Brötchen', text: 'Kühlpflichtige Belage (Wurst, Käse) ≤ 7 °C lagern. Bei Auslage in Kühlvitrine. Verkaufstag = Herstellungstag, Reste am Ende verwerfen.' },
              { titel: '🌭 Bockwurst / Würstchen', text: 'Im Wasserbad ≥ 65 °C halten. Eintauchthermometer. Ungenutzte Würste am Tagesende verwerfen.' },
              { titel: '🍩 Süßwaren / Donuts', text: 'Trockenwaren weniger kritisch — auf Schädlinge achten (Mäuse, Insekten). Verpackt halten, Wechsel bei Mängeln.' },
            ].map(({ titel, text }, i) => (
              <div key={i} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>

          <S title="Allergene-Kennzeichnung (LMIV)" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Bei loser Ware (Imbiss, Theke) müssen die <strong>14 Hauptallergene</strong> auf Schild oder Karte
              gekennzeichnet sein (LMIV Art. 9, Anhang II). Auch mündlich abrufbar.
            </p>
            <div className={`grid grid-cols-2 gap-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {[
                'Glutenhaltiges Getreide', 'Krebstiere', 'Eier', 'Fisch', 'Erdnüsse',
                'Soja', 'Milch (Laktose)', 'Schalenfrüchte (Nüsse)', 'Sellerie', 'Senf',
                'Sesam', 'Schwefeldioxid/Sulfite', 'Lupinen', 'Weichtiere',
              ].map((al, i) => (
                <div key={i}>• {al}</div>
              ))}
            </div>
          </S>

          <S title="Kühlkette" darkMode={darkMode}>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <li>→ <strong>Wareneingang:</strong> Temperatur prüfen + dokumentieren (Liefer­schein)</li>
              <li>→ <strong>Transport im Bad:</strong> Schnell vom LKW zum Kühler</li>
              <li>→ <strong>Lagerung:</strong> Kühltemperatur dokumentieren, Thermometer kalibriert</li>
              <li>→ <strong>Verarbeitung:</strong> Kühlware nur für Bedarf entnehmen</li>
              <li>→ <strong>Bei Stromausfall:</strong> Türen geschlossen halten, Temperatur prüfen, Notfall­plan</li>
            </ul>
          </S>
        </div>
      )}

      {tab === 'kontrolle' && (
        <div>
          <S title="Lebensmittelkontrolle durch Behörde" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die <strong>Lebensmittelüberwachung</strong> (Veterinär- und Lebensmittel­aufsicht) prüft unangekündigt:
            </p>
            {[
              'Hygienezustand der Räume und Geräte',
              'Personalhygiene (Belehrung, Kleidung, Erkrankungsmeldungen)',
              'Temperaturen (Kühlung, Frittierfett, Warmhaltung)',
              'Allergene-Kennzeichnung',
              'Schädlingsbekämpfung (DDD-Plan)',
              'HACCP-Dokumentation',
              'Mindesthaltbarkeitsdaten',
              'Reinigungsplan',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-emerald-500">→</span><span>{it}</span>
              </div>
            ))}
          </S>

          <S title="Risiko-Score (AVV RÜb)" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Betriebe werden in Risikoklassen eingestuft. Häufigkeit der Kontrollen abhängig vom Risiko-Score:
            </p>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Klasse</th><th className="text-left p-2">Risiko</th><th className="text-left p-2">Häufigkeit</th></tr>
                </thead>
                <tbody>
                  {[
                    ['1', 'Sehr niedrig', 'alle 3 Jahre'],
                    ['2', 'Niedrig', 'alle 2 Jahre'],
                    ['3', 'Mittel', 'jährlich'],
                    ['4', 'Hoch (typisch Bad-Imbiss)', '2× jährlich'],
                    ['5', 'Sehr hoch (mit Beanstandungen)', '4× jährlich oder häufiger'],
                  ].map(([k, r, h], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-mono font-bold">{k}</td>
                      <td className="p-2">{r}</td>
                      <td className="p-2 text-emerald-400">{h}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>

          <S title="Dokumentation — Mindestpflicht" darkMode={darkMode}>
            {[
              'Temperaturlisten Kühlung & TK (täglich)',
              'Reinigungsplan + Quittierung',
              'Schädlingskontrolle (Köderpläne, Sichtkontrollen)',
              'Wareneingangskontrolle (Datum, Temperatur, Auffälligkeiten)',
              'Belehrungsbescheinigungen (§ 43 IfSG)',
              'Schulungsnachweise Personal (Hygiene, Allergene)',
              'Beanstandungen aus Kontrollen + Maßnahmen',
              'Aufbewahrung: mindestens 1 Jahr (Ware/Hygiene), Belehrung dauerhaft',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-emerald-500">→</span><span>{it}</span>
              </div>
            ))}
          </S>
        </div>
      )}
    </div>
  );
}
