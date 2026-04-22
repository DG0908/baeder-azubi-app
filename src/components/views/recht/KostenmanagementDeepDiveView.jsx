import { useState } from 'react';

const TABS = {
  grundlagen: { label: 'Kostengrundlagen', icon: '📊' },
  kalkulation: { label: 'Kalkulation', icon: '🧮' },
  bäderkasse: { label: 'Bäderkasse', icon: '💳' },
  controlling: { label: 'Controlling', icon: '📈' },
  deckungsgrad: { label: 'Kostendeckung', icon: '⚖️' },
};

const TabChip = ({ id, tab, active, onClick, darkMode }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
      active
        ? 'bg-emerald-600 text-white shadow'
        : darkMode
        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    <span>{tab.icon}</span>
    {tab.label}
  </button>
);

const Section = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{title}</h3>}
    {children}
  </div>
);

const InfoRow = ({ label, value, darkMode, highlight }) => (
  <div className={`flex justify-between items-start py-1.5 border-b last:border-0 ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{label}</span>
    <span className={`text-xs font-medium text-right max-w-[60%] ${highlight ? (darkMode ? 'text-emerald-400' : 'text-emerald-700') : (darkMode ? 'text-slate-200' : 'text-gray-800')}`}>{value}</span>
  </div>
);

const FormelBox = ({ formel, erklaerung, darkMode }) => (
  <div className={`rounded-lg p-3 mb-3 border-l-4 border-emerald-500 ${darkMode ? 'bg-slate-900' : 'bg-emerald-50'}`}>
    <div className={`font-mono text-sm font-bold mb-1 ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>{formel}</div>
    {erklaerung && <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{erklaerung}</div>}
  </div>
);

const KostenArt = ({ name, beispiele, art, darkMode }) => (
  <div className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
    <div className="flex items-center gap-2 mb-1">
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        art === 'fix' ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700') :
        art === 'var' ? (darkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700') :
        (darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700')
      }`}>{art === 'fix' ? 'Fixkosten' : art === 'var' ? 'Variable Kosten' : 'Gemischte Kosten'}</span>
      <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{name}</span>
    </div>
    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{beispiele}</div>
  </div>
);

export default function KostenmanagementDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('grundlagen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-emerald-900/60 to-teal-900/40 border border-emerald-800' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">💰</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>Kostenmanagement im Bäderbetrieb</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Kalkulation · Bäderkasse · Controlling · Kostendeckungsgrad</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} darkMode={darkMode} />
        ))}
      </div>

      {/* GRUNDLAGEN */}
      {activeTab === 'grundlagen' && (
        <div>
          <Section title="Kostenarten-Überblick" darkMode={darkMode}>
            <KostenArt name="Personalkosten" art="fix" beispiele="Gehälter, Sozialabgaben, Fortbildung — meist 60–70 % der Gesamtkosten" darkMode={darkMode} />
            <KostenArt name="Energiekosten" art="var" beispiele="Strom (Pumpen, Beleuchtung, Technik), Gas/Fernwärme für Heizung & Warmwasser" darkMode={darkMode} />
            <KostenArt name="Wasserkosten" art="var" beispiele="Frischwasser, Abwasser — abhängig von Besucherzahlen und Verlust" darkMode={darkMode} />
            <KostenArt name="Chemikalienkosten" art="var" beispiele="Chlor, Flockungsmittel, pH-Korrekturmittel — steigt mit Badbelastung" darkMode={darkMode} />
            <KostenArt name="Gebäude / Abschreibungen" art="fix" beispiele="AfA auf Anlagen, Geräte, Fahrzeuge — gleichbleibend über Nutzungsdauer" darkMode={darkMode} />
            <KostenArt name="Instandhaltung" art="gemischt" beispiele="Pflicht- und Notfallreparaturen, Wartungsverträge (Pumpen, AED, Lüftung)" darkMode={darkMode} />
          </Section>
          <Section title="Kostenarten vs. Kostenstellen" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>Kostenarten</strong> = <em>Was</em> kostet Geld? (z. B. Personal, Energie)<br />
              <strong>Kostenstellen</strong> = <em>Wo</em> fallen Kosten an? (z. B. Hallenbad, Freibad, Sauna, Verwaltung)<br />
              <strong>Kostenträger</strong> = <em>Wofür</em> fallen Kosten an? (z. B. pro Badegast, pro Veranstaltung)
            </div>
            <div className={`rounded-lg p-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Typische Kostenstellen im Bad:</div>
              <div className={`text-xs grid grid-cols-2 gap-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                {['🏊 Schwimmbecken', '🧖 Sauna', '🍽️ Gastronomie', '🅿️ Parkplatz', '🔧 Technik', '🖥️ Verwaltung'].map(s => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          </Section>
          <Section title="Fix- vs. Variable Kosten im Bad" darkMode={darkMode}>
            <FormelBox formel="Gesamtkosten = Fixkosten + (variable Kosten × Menge)" erklaerung="Menge = Badegäste, Betriebsstunden, Liter Wasser etc." darkMode={darkMode} />
            <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>Wichtig für Bäder:</strong> Hoher Fixkostenanteil (≈ 70–80 %) bedeutet: Ob 100 oder 1.000 Gäste kommen — die Grundkosten bleiben. Deshalb ist die <span className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Auslastung</span> der entscheidende Wirtschaftlichkeitsfaktor.
            </div>
          </Section>
        </div>
      )}

      {/* KALKULATION */}
      {activeTab === 'kalkulation' && (
        <div>
          <Section title="Eintrittspreis-Kalkulation" darkMode={darkMode}>
            <FormelBox formel="Eintrittspreis = Gesamtkosten ÷ Besucherzahl + Gewinnzuschlag" erklaerung="Kommunale Bäder: oft kein Gewinnzuschlag, Ziel: möglichst hohe Kostendeckung" darkMode={darkMode} />
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'} mb-3`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr>
                    <th className="text-left p-2">Position</th>
                    <th className="text-right p-2">Betrag</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Gesamtkosten/Jahr', '2.400.000 €'],
                    ['Erwartete Besucherzahl', '240.000'],
                    ['Kosten je Besuch', '10,00 €'],
                    ['Eintrittspreis (Erwachsene)', '5,50 €'],
                    ['→ Deckungsgrad', '55 %'],
                    ['→ Defizit/Besuch', '4,50 €'],
                  ].map(([pos, val], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700' : 'border-gray-100'} ${i >= 3 ? (darkMode ? 'bg-slate-900/50' : 'bg-emerald-50') : ''}`}>
                      <td className={`p-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{pos}</td>
                      <td className={`p-2 text-right font-mono font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
              ⚠️ Kommunale Bäder decken im Durchschnitt nur 30–60 % ihrer Kosten durch Eintrittsgelder. Den Rest trägt die Gemeinde als Defizitausgleich (Querfinanzierung).
            </div>
          </Section>
          <Section title="Deckungsbeitragsrechnung" darkMode={darkMode}>
            <FormelBox formel="Deckungsbeitrag = Erlöse − Variable Kosten" erklaerung="Der Beitrag zur Deckung der Fixkosten" darkMode={darkMode} />
            <FormelBox formel="Betriebsergebnis = Deckungsbeitrag − Fixkosten" erklaerung="Positiv = Gewinn, Negativ = Defizit (bei Bädern häufig)" darkMode={darkMode} />
            <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>Beispiel Badekurs:</strong> 10 Teilnehmer × 15 € = 150 € Erlös. Variable Kosten (Chlor, Wasser, Kursleiter-Anteil) = 60 €. → DB = 90 €. Kurs lohnt sich, solange DB &gt; 0.
            </div>
          </Section>
          <Section title="Abschreibungen (AfA)" darkMode={darkMode}>
            <FormelBox formel="Jährliche AfA = Anschaffungswert ÷ Nutzungsdauer (Jahre)" erklaerung="Lineare Abschreibung (üblich bei Kommunen)" darkMode={darkMode} />
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr>
                    <th className="text-left p-2">Anlagegut</th>
                    <th className="text-right p-2">Nutzungsdauer</th>
                    <th className="text-right p-2">AfA/Jahr (50.000 €)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Umwälzpumpe', '10 Jahre', '5.000 €'],
                    ['AED-Gerät', '8 Jahre', '6.250 €'],
                    ['Gebäude', '50 Jahre', '1.000 €'],
                    ['Fahrzeug', '6 Jahre', '8.333 €'],
                  ].map(([gut, nd, afa], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2">{gut}</td>
                      <td className="p-2 text-right">{nd}</td>
                      <td className={`p-2 text-right font-mono ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{afa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* BÄDERKASSE */}
      {activeTab === 'bäderkasse' && (
        <div>
          <Section title="Kassenorganisation im Bad" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die Bäderkasse ist die Haupteinnahmequelle. Ordentliche Kassenführung ist rechtlich und buchhalterisch Pflicht.
            </div>
            {[
              { titel: 'Kassenbuch', text: 'Alle Einnahmen und Ausgaben chronologisch erfassen. Tagesabschluss = Soll-Ist-Vergleich.' },
              { titel: 'Kassensturz', text: 'Tatsächlicher Kassenbestand (Zählung) wird mit Buchbestand verglichen. Differenzen sofort melden.' },
              { titel: 'Kassenfehlbeträge', text: 'Kleine Differenzen (< 1 €): oft Abzählfehler. Größere: interne Prüfung. Diebstahl: Strafanzeige.' },
              { titel: 'Kassensicherheit', text: 'Tresor, Vier-Augen-Prinzip bei Wechselgeld, Tageseinnahmen täglich zur Bank oder in Nachttresor.' },
            ].map(({ titel, text }) => (
              <div key={titel} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </Section>
          <Section title="Einnahmearten im Bäderbetrieb" darkMode={darkMode}>
            {[
              ['Kasseneintritt', 'Bar & Karte', '35–55 %'],
              ['Abonnements / Jahreskarten', 'Überweisung', '15–25 %'],
              ['Kurse & Schwimmunterricht', 'Überweisung', '10–20 %'],
              ['Gastronomie', 'Bar & Karte', '5–10 %'],
              ['Vermietungen (Bahnen, Hallen)', 'Rechnung', '5–15 %'],
              ['Fördergelder / Zuschüsse', 'Überweisung', 'variabel'],
            ].map(([art, zahlung, anteil]) => (
              <InfoRow key={art} label={art} value={`${zahlung} | ca. ${anteil}`} darkMode={darkMode} />
            ))}
          </Section>
          <Section title="Ticketsysteme & Digitalisierung" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Barcode-/QR-Tickets:</strong> Druck zu Hause oder Online-Kauf, Zugang via Scanner-Drehkreuz</div>
              <div><strong>Chiparmband:</strong> Öffnet Schließfach, Kassiersystem an Bar, Abrechnung beim Ausgang</div>
              <div><strong>RFID-Karte:</strong> Abo-Kunden, kontaktloser Einlass, automatische Verlängerung</div>
              <div><strong>Online-Buchung:</strong> Timeslot-Steuerung (Corona-Erfahrung), Kapazitätskontrolle, Wartelisten</div>
              <div className={`rounded p-2 mt-2 ${darkMode ? 'bg-emerald-900/40' : 'bg-emerald-50'}`}>
                <strong>Vorteil für FAB:</strong> Weniger Kassenschlangen, bessere Auslastungsplanung, digitale Belegaufbewahrung (GoBD)
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* CONTROLLING */}
      {activeTab === 'controlling' && (
        <div>
          <Section title="Betriebsvergleich & Kennzahlen" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Kennzahlen ermöglichen den Vergleich mit anderen Bädern (externer Betriebsvergleich) und dem Vorjahr (interner Vergleich).
            </div>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr>
                    <th className="text-left p-2">Kennzahl</th>
                    <th className="text-right p-2">Formel</th>
                    <th className="text-right p-2">Richtwert</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Kosten/Besuch', 'Gesamtkosten ÷ Besucher', '8–15 €'],
                    ['Erlös/Besuch', 'Erlöse ÷ Besucher', '3–7 €'],
                    ['Kostendeckungsgrad', 'Erlöse ÷ Kosten × 100', '30–60 %'],
                    ['Auslastungsgrad', 'Ist-Besucher ÷ Kapazität × 100', '40–80 %'],
                    ['Personalkosten-Quote', 'Personalkosten ÷ Gesamtkosten × 100', '55–70 %'],
                    ['Energiekosten/m³', 'Energiekosten ÷ Wasservolumen', '< 5 €/m³'],
                  ].map(([kz, formel, richtwert], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{kz}</td>
                      <td className={`p-2 text-right font-mono text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{formel}</td>
                      <td className={`p-2 text-right ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{richtwert}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section title="Soll-Ist-Vergleich (Budget-Kontrolle)" darkMode={darkMode}>
            <FormelBox formel="Abweichung = Ist-Kosten − Plan-Kosten" erklaerung="Positiv = Mehrkosten (ungünstig), Negativ = Einsparung (günstig)" darkMode={darkMode} />
            <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>Monatliches Controlling:</strong> Energiekosten, Personalstunden, Besucherzahlen, Chemikalienverbrauch — je früher Abweichungen erkannt werden, desto eher kann gegengesteuert werden.
            </div>
          </Section>
          <Section title="Einsparmöglichkeiten im Bad" darkMode={darkMode}>
            {[
              { bereich: '⚡ Energie', massnahme: 'Wärmerückgewinnung, LED-Beleuchtung, bedarfsgesteuerte Pumpen, Überdachung Außenbecken' },
              { bereich: '💧 Wasser', massnahme: 'Wasserverlust-Monitoring, Rückspülwasser aufbereiten, Duschen zeitgesteuert' },
              { bereich: '🧪 Chemikalien', massnahme: 'Dosieroptimierung, UV-Anlage reduziert Chlorbedarf, regelmäßige Kalibrierung' },
              { bereich: '👤 Personal', massnahme: 'Dienstplanoptimierung, Auslastungsabhängige Besetzung, Kombination Kasse/Aufsicht' },
            ].map(({ bereich, massnahme }) => (
              <div key={bereich} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{bereich}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{massnahme}</div>
              </div>
            ))}
          </Section>
        </div>
      )}

      {/* KOSTENDECKUNGSGRAD */}
      {activeTab === 'deckungsgrad' && (
        <div>
          <Section title="Kostendeckungsgrad berechnen" darkMode={darkMode}>
            <FormelBox formel="Kostendeckungsgrad = (Erlöse ÷ Gesamtkosten) × 100" erklaerung="Gibt an, wie viel Prozent der Kosten durch eigene Einnahmen gedeckt werden" darkMode={darkMode} />
            <div className={`rounded-lg overflow-hidden border mb-3 ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr>
                    <th className="text-left p-2">Deckungsgrad</th>
                    <th className="text-left p-2">Bewertung</th>
                    <th className="text-left p-2">Typisches Bad</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['< 30 %', '🔴 Sehr hoch subventioniert', 'Thermalbad, kleines Freibad'],
                    ['30–50 %', '🟡 Branchendurchschnitt', 'Hallenbad, Stadtbad'],
                    ['50–75 %', '🟢 Wirtschaftlich gut', 'Erlebnisbad, Freizeitbad'],
                    ['> 75 %', '🟢 Sehr gut / selten', 'Private Betreiber, Kombibad'],
                  ].map(([grad, bewertung, typ], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-mono font-medium">{grad}</td>
                      <td className="p-2">{bewertung}</td>
                      <td className={`p-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{typ}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
              ⚠️ Deutsche Hallenbäder: Durchschnitt ca. 40–50 % Kostendeckung. Öffentliche Bäder sind bewusst subventioniert — sie erfüllen Daseinsvorsorge (Schwimmunterricht, Gesundheit, soziale Teilhabe).
            </div>
          </Section>
          <Section title="Wege zur Verbesserung des Deckungsgrads" darkMode={darkMode}>
            <div className={`text-xs space-y-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div className={`rounded-lg p-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <strong className={darkMode ? 'text-emerald-400' : 'text-emerald-700'}>📈 Einnahmen steigern:</strong><br />
                Eintrittspreiserhöhung (politisch schwierig), neue Angebote (Aqua-Kurse, Sauna, Kindergeburtstage), Vermietung, Werbepartner, Sponsoring, Gastronomie ausbauen
              </div>
              <div className={`rounded-lg p-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <strong className={darkMode ? 'text-emerald-400' : 'text-emerald-700'}>📉 Kosten senken:</strong><br />
                Energiesanierung (Haupthebel), Dienstplanoptimierung, Schließzeiten bei geringer Auslastung, Förderprogramme nutzen (KfW, BAFA, Landesförderung)
              </div>
              <div className={`rounded-lg p-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <strong className={darkMode ? 'text-emerald-400' : 'text-emerald-700'}>🏢 Betriebsform ändern:</strong><br />
                Wechsel von Regiebetrieb zu Eigenbetrieb/GmbH kann Flexibilität erhöhen. Private Betreiber (PPP = Public-Private-Partnership) übernehmen teils das Defizitrisiko.
              </div>
            </div>
          </Section>
          <Section title="Prüfungsaufgabe: Beispielrechnung" darkMode={darkMode}>
            <div className={`rounded-lg p-3 ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-gray-50 border border-gray-200'}`}>
              <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Aufgabe:</div>
              <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Ein Hallenbad hat Jahreskosten von 1.800.000 €. Einnahmen: Eintrittsgelder 650.000 €, Kurse 120.000 €, Vermietungen 80.000 €. Berechne den Kostendeckungsgrad und das Defizit.
              </div>
              <div className={`text-xs font-mono ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                Erlöse = 650.000 + 120.000 + 80.000 = 850.000 €<br />
                KDG = 850.000 ÷ 1.800.000 × 100 = <strong>47,2 %</strong><br />
                Defizit = 1.800.000 − 850.000 = <strong>950.000 €</strong>
              </div>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
