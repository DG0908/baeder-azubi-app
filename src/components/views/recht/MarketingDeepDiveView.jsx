import { useState } from 'react';

const TABS = {
  grundlagen: { label: 'Grundlagen', icon: '🎯' },
  analyse: { label: 'Analyse (SWOT)', icon: '🔍' },
  marketing4p: { label: '4P-Mix', icon: '🧩' },
  zielgruppen: { label: 'Zielgruppen', icon: '👥' },
  öffentlichkeit: { label: 'Öffentlichkeit', icon: '📣' },
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

const PCard = ({ p, titel, farbe, inhalt, beispiele, darkMode }) => {
  const colors = {
    blue: darkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-400 bg-blue-50',
    green: darkMode ? 'border-green-500 bg-green-900/20' : 'border-green-400 bg-green-50',
    orange: darkMode ? 'border-orange-500 bg-orange-900/20' : 'border-orange-400 bg-orange-50',
    purple: darkMode ? 'border-purple-500 bg-purple-900/20' : 'border-purple-400 bg-purple-50',
  };
  const titleColors = {
    blue: darkMode ? 'text-blue-400' : 'text-blue-700',
    green: darkMode ? 'text-green-400' : 'text-green-700',
    orange: darkMode ? 'text-orange-400' : 'text-orange-700',
    purple: darkMode ? 'text-purple-400' : 'text-purple-700',
  };
  return (
    <div className={`rounded-xl border-2 p-4 mb-3 ${colors[farbe]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-2xl font-black ${titleColors[farbe]}`}>{p}</span>
        <span className={`text-sm font-bold ${titleColors[farbe]}`}>{titel}</span>
      </div>
      <div className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{inhalt}</div>
      <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Im Bäderbetrieb:</div>
      <ul className={`text-xs space-y-0.5 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
        {beispiele.map((b, i) => <li key={i}>→ {b}</li>)}
      </ul>
    </div>
  );
};

const SwotCell = ({ typ, items, darkMode }) => {
  const config = {
    S: { label: 'Stärken (Strengths)', color: darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-300', title: darkMode ? 'text-green-400' : 'text-green-700' },
    W: { label: 'Schwächen (Weaknesses)', color: darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-300', title: darkMode ? 'text-red-400' : 'text-red-700' },
    O: { label: 'Chancen (Opportunities)', color: darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-300', title: darkMode ? 'text-blue-400' : 'text-blue-700' },
    T: { label: 'Risiken (Threats)', color: darkMode ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 border-orange-300', title: darkMode ? 'text-orange-400' : 'text-orange-700' },
  };
  const c = config[typ];
  return (
    <div className={`rounded-lg border p-3 ${c.color}`}>
      <div className={`text-xs font-bold mb-2 ${c.title}`}>{typ} — {c.label}</div>
      <ul className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
        {items.map((item, i) => <li key={i}>• {item}</li>)}
      </ul>
    </div>
  );
};

export default function MarketingDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('grundlagen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-emerald-900/60 to-teal-900/40 border border-emerald-800' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📣</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>Marketing im Bäderbetrieb</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>SWOT-Analyse · 4P-Mix · Zielgruppen · Öffentlichkeitsarbeit</p>
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
          <Section title="Was ist Marketing?" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Marketing ist die <strong>marktorientierte Unternehmensführung</strong>: alle Maßnahmen zur Erfüllung von Kundenbedürfnissen und zur Erreichung der eigenen Ziele.
            </div>
            <div className={`rounded-lg p-3 mb-3 border-l-4 border-emerald-500 ${darkMode ? 'bg-slate-900' : 'bg-emerald-50'}`}>
              <div className={`text-xs font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>Marketing-Regelkreis (Ablauf):</div>
              <div className={`text-xs mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Analyse → Planung → Durchführung → Kontrolle → erneute Analyse
              </div>
            </div>
            <div className={`text-xs ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
              ⚠️ Öffentliche Bäder haben besondere Marketing-Ziele: Kein Gewinnstreben, sondern <strong>Daseinsvorsorge</strong> — möglichst viele Bürger (auch einkommensschwache) sollen das Angebot nutzen.
            </div>
          </Section>
          <Section title="Marketing-Ziele im Bäderbetrieb" darkMode={darkMode}>
            {[
              { typ: 'Quantitativ', ziele: 'Besucherzahlen steigern, Auslastung erhöhen, Deckungsgrad verbessern, Kursbuchungen erhöhen' },
              { typ: 'Qualitativ', ziele: 'Kundenzufriedenheit steigern, Image verbessern, Bekanntheit erhöhen, Kundenbindung stärken' },
              { typ: 'Sozial', ziele: 'Schwimmlernquote erhöhen, soziale Teilhabe sichern, Gesundheitsförderung, Schulschwimmen sichern' },
            ].map(({ typ, ziele }) => (
              <div key={typ} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{typ}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{ziele}</div>
              </div>
            ))}
          </Section>
          <Section title="Besonderheiten: Dienstleistungsmarketing" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div><strong>Immaterialität:</strong> Der Badebesuch kann nicht vorher gesehen/angefasst werden → Vertrauen und Empfehlungen wichtig</div>
              <div><strong>Vergänglichkeit:</strong> Nicht besuchte Öffnungsstunden = verlorene Kapazität (keine Lagerhaltung)</div>
              <div><strong>Uno-actu-Prinzip:</strong> Produktion und Konsum gleichzeitig → Qualität hängt vom Personal ab</div>
              <div><strong>Heterogenität:</strong> Jeder Besuch ist anders — Wetterabhängigkeit, Auslastung, Personal</div>
            </div>
          </Section>
        </div>
      )}

      {/* SWOT */}
      {activeTab === 'analyse' && (
        <div>
          <Section title="SWOT-Analyse — Überblick" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die SWOT-Analyse kombiniert interne Faktoren (<strong>S</strong>tärken/<strong>W</strong>eaknesses) mit externen Faktoren (<strong>O</strong>pportunities/<strong>T</strong>hreats).
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className={`text-center text-xs p-2 rounded ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                <div className="font-semibold">Intern</div>
                <div>Stärken & Schwächen</div>
                <div className="text-xs opacity-70">(selbst beeinflussbar)</div>
              </div>
              <div className={`text-center text-xs p-2 rounded ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                <div className="font-semibold">Extern</div>
                <div>Chancen & Risiken</div>
                <div className="text-xs opacity-70">(nicht beeinflussbar)</div>
              </div>
            </div>
          </Section>
          <Section title="SWOT eines Hallenbades — Beispiel" darkMode={darkMode}>
            <div className="grid grid-cols-1 gap-2">
              <SwotCell typ="S" darkMode={darkMode} items={[
                'Zentrale Lage, gut erreichbar',
                'Erfahrenes, motiviertes Personal',
                'Breites Kursangebot (Aqua, Schwimmen)',
                'Warmes Wasser ganzjährig verfügbar',
              ]} />
              <SwotCell typ="W" darkMode={darkMode} items={[
                'Veraltete Gebäudetechnik (hohe Energiekosten)',
                'Wenig Parkplätze, kein ÖPNV-Anschluss',
                'Geringe Social-Media-Präsenz',
                'Keine barrierefreie Einrichtung',
              ]} />
              <SwotCell typ="O" darkMode={darkMode} items={[
                'Gesundheitstrend: Aquafitness boomt',
                'Förderprogramme für Energiesanierung (KfW)',
                'Kooperation mit Schulen (Schulschwimmen sichern)',
                'Digitale Buchungssysteme → neue Zielgruppen',
              ]} />
              <SwotCell typ="T" darkMode={darkMode} items={[
                'Konkurrenz durch private Fitnessstudios',
                'Steigende Energiepreise',
                'Sinkende Schwimmfähigkeit bei Kindern → weniger Stammkunden',
                'Politischer Druck auf Haushaltskürzungen',
              ]} />
            </div>
          </Section>
          <Section title="Von der SWOT zur Strategie" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div className={`rounded p-2 ${darkMode ? 'bg-green-900/30' : 'bg-green-50'}`}><strong>SO-Strategie (Stärke + Chance):</strong> Starkes Kursangebot + Gesundheitstrend → Aquafitness-Programm ausbauen</div>
              <div className={`rounded p-2 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}><strong>ST-Strategie (Stärke + Risiko):</strong> Gutes Personal + Konkurrenz → Beratungsqualität als Alleinstellungsmerkmal</div>
              <div className={`rounded p-2 ${darkMode ? 'bg-orange-900/30' : 'bg-orange-50'}`}><strong>WO-Strategie (Schwäche + Chance):</strong> Alte Technik + KfW-Förderung → Energiesanierung beantragen</div>
              <div className={`rounded p-2 ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}><strong>WT-Strategie (Schwäche + Risiko):</strong> Wenig Online-Präsenz + Digitalisierung → Website und Social Media aufbauen</div>
            </div>
          </Section>
        </div>
      )}

      {/* 4P */}
      {activeTab === 'marketing4p' && (
        <div>
          <Section title="Der Marketing-Mix: 4P" darkMode={darkMode}>
            <div className={`text-xs mb-4 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Die 4P sind die Stellschrauben des Marketings. Alle vier müssen aufeinander abgestimmt sein.
            </div>
            <PCard p="P1" titel="Product (Produkt)" farbe="blue" darkMode={darkMode}
              inhalt="Was bieten wir an? Das Leistungsangebot des Bades."
              beispiele={[
                'Schwimmbecken: Sport-, Lehr-, Erlebnisbecken',
                'Kurse: Babyschwimmen, Aqua-Fitness, Rettungsschwimmen',
                'Zusatzangebote: Sauna, Gastronomie, Physio-Kooperation',
                'Events: Längstschwimmen, Kinderfeste, Vereinsturniere',
              ]} />
            <PCard p="P2" titel="Price (Preis)" farbe="green" darkMode={darkMode}
              inhalt="Was kostet das Angebot? Preise müssen sozial verträglich und kostenorientiert sein."
              beispiele={[
                'Differenzierte Preise: Erwachsene, Kinder, Rentner, Familien',
                'Abonnements, Jahreskarten mit Rabatt',
                'Sozialtarife (Sozialpass, Bildungs- und Teilhabepaket)',
                'Frühschwimmer-Rabatt für Auslastungssteuerung',
              ]} />
            <PCard p="P3" titel="Place (Distribution)" farbe="orange" darkMode={darkMode}
              inhalt="Wo und wie wird das Angebot zugänglich gemacht?"
              beispiele={[
                'Öffnungszeiten bedarfsgerecht gestalten',
                'Online-Ticketverkauf, App-Buchung',
                'Barrierefreier Zugang (Rollstuhl, Hublift)',
                'ÖPNV-Kooperationen, Fahrradstellplätze',
              ]} />
            <PCard p="P4" titel="Promotion (Kommunikation)" farbe="purple" darkMode={darkMode}
              inhalt="Wie werden Angebote bekannt gemacht?"
              beispiele={[
                'Social Media: Instagram, Facebook (Aktionen, Fotos)',
                'Lokalpresse: Saisonstart, besondere Kurse',
                'Schulenanschreiben für Schulschwimmen',
                'Aushänge, Flyer, Newsletter, Stadtwebseite',
              ]} />
          </Section>
        </div>
      )}

      {/* ZIELGRUPPEN */}
      {activeTab === 'zielgruppen' && (
        <div>
          <Section title="Zielgruppen-Segmentierung" darkMode={darkMode}>
            <div className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Verschiedene Besuchergruppen haben unterschiedliche Bedürfnisse. Gezieltes Marketing spricht jede Gruppe individuell an.
            </div>
          </Section>
          {[
            {
              gruppe: '👶 Kleinkinder & Eltern',
              bedarf: 'Sicherheit, flaches Wasser, Krabbelgruppe, Babyschwimmen',
              ansprache: 'Kita-Kooperationen, Elternzeitschriften, Hebammen-Kontakte, Facebook-Gruppen',
              angebot: 'Eltern-Kind-Kurse, Wickelraum, Kinderbecken, Cafeteria',
            },
            {
              gruppe: '🏫 Schulkinder & Schulen',
              bedarf: 'Schwimmunterricht, Lernpools, Nichtschwimmer-Kurse, Lehrbecken',
              ansprache: 'Direkte Anschreiben an Schulen, Kultusministerium-Programme',
              angebot: 'Schulbahnen zu Randzeiten, Lehrer-Briefings, Jahresschwimmscheine',
            },
            {
              gruppe: '🏃 Sportlich Aktive',
              bedarf: 'Lange Bahnen, frühe/späte Öffnungszeiten, Wassertemperatur < 28°C',
              ansprache: 'Sportvereine, Triathlon-Gruppen, Fitness-Influencer',
              angebot: 'Vereins-Kooperationen, Frühschwimmen ab 6 Uhr, Zeitmessung',
            },
            {
              gruppe: '🧓 Senioren',
              bedarf: 'Barrierefreiheit, warmes Wasser, Aqua-Fitness, soziale Komponente',
              ansprache: 'Seniorenzeitungen, Kirchengemeinden, Rentnertreffs, VHS',
              angebot: 'Seniorentarif, Aqua-Jogging, Rettungsring für psychische Gesundheit',
            },
            {
              gruppe: '♿ Menschen mit Behinderung',
              bedarf: 'Hublift, Rollstuhlzugang, spezielle Badebekleidung ok, Assistenz möglich',
              ansprache: 'Behindertenverbände, Inklusionsbeauftragte, SBB',
              angebot: 'Begleitpersonen frei, Sonderkurse, Inklusionsschwimmen',
            },
          ].map(({ gruppe, bedarf, ansprache, angebot }) => (
            <Section key={gruppe} title={gruppe} darkMode={darkMode}>
              <div className={`text-xs space-y-1.5 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <div><strong className={darkMode ? 'text-slate-200' : 'text-gray-800'}>Bedarf:</strong> {bedarf}</div>
                <div><strong className={darkMode ? 'text-slate-200' : 'text-gray-800'}>Ansprache:</strong> {ansprache}</div>
                <div><strong className={darkMode ? 'text-slate-200' : 'text-gray-800'}>Passendes Angebot:</strong> {angebot}</div>
              </div>
            </Section>
          ))}
        </div>
      )}

      {/* ÖFFENTLICHKEITSARBEIT */}
      {activeTab === 'öffentlichkeit' && (
        <div>
          <Section title="Öffentlichkeitsarbeit (PR) vs. Werbung" darkMode={darkMode}>
            <div className={`rounded-lg overflow-hidden border mb-3 ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr>
                    <th className="text-left p-2">Merkmal</th>
                    <th className="text-left p-2">PR</th>
                    <th className="text-left p-2">Werbung</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Ziel', 'Vertrauen, Image, Bekanntheit', 'Kauf/Besuch auslösen'],
                    ['Zielgruppe', 'Gesamte Öffentlichkeit', 'Spezifische Zielgruppe'],
                    ['Kosten', 'Gering (Redaktionell)', 'Hoch (Anzeigen, Spots)'],
                    ['Glaubwürdigkeit', 'Hoch (unabhängig)', 'Mittel (bezahlt)'],
                    ['Beispiele Bad', 'Pressemitteilung, Sponsoring', 'Anzeige, Plakat, Social-Ad'],
                  ].map(([merkmal, pr, werbung], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{merkmal}</td>
                      <td className="p-2">{pr}</td>
                      <td className="p-2">{werbung}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section title="Maßnahmen der Öffentlichkeitsarbeit im Bad" darkMode={darkMode}>
            {[
              { icon: '📰', titel: 'Lokalpresse & Medien', text: 'Pressemitteilungen zu Saisonstarts, Jubiläen, besonderen Kursen, Rettungsaktionen. Fotos immer mitschicken.' },
              { icon: '📱', titel: 'Social Media', text: 'Instagram: Stimmungsbilder, Reels vom Kursalltag, Stories zu Events. Facebook: Zielgruppe Eltern & Senioren. Kein Datenschutzverstoß bei Fotos!' },
              { icon: '🤝', titel: 'Sponsoring & Kooperationen', text: 'Sportvereine sponsern → Gegenwert: Bahnenzeiten. Schule kooperieren → Besucherbindung. Lokale Unternehmen als Werbepartner.' },
              { icon: '📅', titel: 'Events & Aktionen', text: '„Tag der offenen Tür", Kinderfeste, Benefiz-Schwimmen, Vereinsturniere, Themenwochen (Aqua-Oktober). Presseinteresse erzeugen!' },
              { icon: '⭐', titel: 'Kundenbewertungen', text: 'Google-Bewertungen aktiv managen. Auf Beschwerden öffentlich und sachlich antworten. Positive Bewertungen = kostenlose Werbung.' },
              { icon: '📊', titel: 'Kundenbefragungen', text: 'Jährliche Gästebefragung: Zufriedenheit, Wünsche, Verbesserungsvorschläge. Ergebnisse kommunizieren: „Sie haben gewünscht — wir haben umgesetzt."' },
            ].map(({ icon, titel, text }) => (
              <div key={titel} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{icon} {titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </Section>
          <Section title="Datenschutz bei Marketing (DSGVO)" darkMode={darkMode}>
            <div className={`text-xs space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div className={`rounded p-2 border-l-4 border-red-500 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                <strong>Fotos von Badegästen:</strong> Immer Einwilligung einholen! Besonders bei Kindern: Einwilligung der Erziehungsberechtigten erforderlich.
              </div>
              <div className={`rounded p-2 border-l-4 border-red-500 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                <strong>Newsletter:</strong> Double-Opt-In Pflicht. Abmeldung jederzeit möglich. Keine Weitergabe an Dritte.
              </div>
              <div className={`rounded p-2 border-l-4 border-emerald-500 ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                <strong>Tipp:</strong> Mitarbeiter auf Fotos sind Einwilligung oft im Arbeitsvertrag — trotzdem im Zweifel fragen.
              </div>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
