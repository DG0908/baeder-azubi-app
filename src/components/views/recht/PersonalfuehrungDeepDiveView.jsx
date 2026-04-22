import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const TABS = {
  organisation: { label: 'Aufbauorganisation', icon: '🏗️' },
  fuehrungsstile: { label: 'Führungsstile', icon: '👔' },
  klima: { label: 'Betriebsklima', icon: '🌤️' },
  mobbing: { label: 'Mobbing', icon: '⚠️' },
  dienstplan: { label: 'Dienstplanung', icon: '📅' },
};

const TabChip = ({ id, tab, active, onClick }) => (
  <button onClick={() => onClick(id)}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${active ? 'bg-emerald-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
    {tab.icon} {tab.label}
  </button>
);

const Section = ({ title, children, color = 'emerald' }) => (
  <div className={`rounded-xl border border-${color}-200 bg-${color}-50 p-4 mb-4`}>
    {title && <h3 className={`font-bold text-${color}-800 mb-3 text-base`}>{title}</h3>}
    {children}
  </div>
);

export default function PersonalfuehrungDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('organisation');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 p-5 text-white">
        <div className="text-3xl mb-2">👔</div>
        <h2 className="text-xl font-bold">Personalführung im Bäderbetrieb</h2>
        <p className="text-emerald-100 text-sm mt-1">
          Organigramm, Führungsstile, Betriebsklima, Mobbing, Dienstplanung
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'organisation' && (
        <div className="space-y-4">
          <Section title="Aufbauorganisation — das Organigramm">
            <p className="text-sm text-gray-700 mb-3">
              Die Aufbauorganisation zeigt die <strong>Hierarchie und Zuständigkeiten</strong> im Betrieb.
              Im Schwimmbad sieht sie typischerweise so aus:
            </p>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-purple-100 border-2 border-purple-400 text-center">
                <p className="font-bold text-purple-800 text-sm">🏛️ Träger / Betreiber</p>
                <p className="text-xs text-purple-600">Stadt, GmbH, Verein — Gesamtverantwortung</p>
              </div>
              <div className="flex justify-center"><div className="w-0.5 h-4 bg-gray-400" /></div>
              <div className="p-3 rounded-xl bg-blue-100 border-2 border-blue-400 text-center">
                <p className="font-bold text-blue-800 text-sm">👤 Bäderleiter / Betriebsleiter</p>
                <p className="text-xs text-blue-600">Gesamtleitung, Personalverantwortung, Aufsichtsplan</p>
              </div>
              <div className="flex justify-center gap-8">
                <div className="w-0.5 h-4 bg-gray-400" />
                <div className="w-0.5 h-4 bg-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-teal-100 border-2 border-teal-400 text-center">
                  <p className="font-bold text-teal-800 text-sm">👥 Schichtleiter</p>
                  <p className="text-xs text-teal-600">Leitung während Schicht, Aufsichtskoordination</p>
                </div>
                <div className="p-3 rounded-xl bg-teal-100 border-2 border-teal-400 text-center">
                  <p className="font-bold text-teal-800 text-sm">🔧 Techn. Leiter</p>
                  <p className="text-xs text-teal-600">Wasseraufbereitung, Anlagentechnik</p>
                </div>
              </div>
              <div className="flex justify-center"><div className="w-0.5 h-4 bg-gray-400" /></div>
              <div className="grid grid-cols-3 gap-2">
                {['🏊 FAB (Aufsicht)', '💧 FAB (Technik)', '🎫 Kasse / Service'].map((item, i) => (
                  <div key={i} className="p-2 rounded-xl bg-emerald-100 border border-emerald-400 text-center">
                    <p className="text-xs font-semibold text-emerald-800">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="Stellenbeschreibung / Arbeitsplatzbeschreibung" color="blue">
            <p className="text-sm text-gray-700 mb-2">
              Jede Stelle sollte eine schriftliche Beschreibung haben. Sie enthält:
            </p>
            {[
              'Bezeichnung der Stelle und Einordnung im Organigramm',
              'Vorgesetzte und unterstellte Mitarbeiter',
              'Aufgaben und Verantwortungsbereiche',
              'Erforderliche Qualifikationen',
              'Befugnisse (Entscheidungskompetenz)',
              'Vertretungsregelung',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1">
                <CheckCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-300">
              <p className="text-xs text-blue-700">
                <strong>Wichtig:</strong> Die Stellenbeschreibung schützt auch den Mitarbeiter —
                er weiß genau was von ihm erwartet wird und kann nicht für Aufgaben außerhalb
                seiner Zuständigkeit haftbar gemacht werden.
              </p>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'fuehrungsstile' && (
        <div className="space-y-4">
          <Section title="Die klassischen Führungsstile">
            <p className="text-sm text-gray-700 mb-3">
              Führungsstile beschreiben, wie Vorgesetzte mit ihren Mitarbeitern umgehen und
              Entscheidungen treffen. Kein Stil ist pauschal "richtig" — die Situation entscheidet.
            </p>
            <div className="space-y-3">
              {[
                {
                  stil: 'Autoritärer Führungsstil',
                  merkmale: ['Vorgesetzter entscheidet allein', 'Klare Anweisungen, keine Diskussion', 'Kontrolle und Überwachung', 'Schnelle Entscheidungen'],
                  vorteile: 'Klare Strukturen, schnell bei Krisen (z.B. Notfall im Bad)',
                  nachteile: 'Demotivation, wenig Eigeninitiative, Kreativität geht verloren',
                  color: 'red', icon: '👊',
                },
                {
                  stil: 'Kooperativer (demokratischer) Führungsstil',
                  merkmale: ['Mitarbeiter werden einbezogen', 'Gemeinsame Entscheidungsfindung', 'Delegierung von Aufgaben', 'Offene Kommunikation'],
                  vorteile: 'Hohe Motivation, Kreativität, Mitarbeiterzufriedenheit',
                  nachteile: 'Langsame Entscheidungen, kann bei Krisen zu langsam sein',
                  color: 'green', icon: '🤝',
                },
                {
                  stil: 'Laissez-faire Führungsstil',
                  merkmale: ['Mitarbeiter handeln eigenverantwortlich', 'Kaum Vorgaben vom Vorgesetzten', 'Sehr viel Freiheit', 'Wenig Kontrolle'],
                  vorteile: 'Maximale Autonomie, gut für selbstständige Experten',
                  nachteile: 'Fehlende Orientierung, Chaos möglich, ungeeignet für Routinebetrieb',
                  color: 'blue', icon: '🕊️',
                },
                {
                  stil: 'Situativer Führungsstil',
                  merkmale: ['Passt Stil an Situation und Person an', 'Neue MA: eher direktiv', 'Erfahrene MA: kooperativ bis delegierend', 'Flexibilität als Kern'],
                  vorteile: 'Optimal an Situation angepasst, hohe Effektivität',
                  nachteile: 'Erfordert viel Führungskompetenz und Menschenkenntnis',
                  color: 'purple', icon: '🎯',
                },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl bg-${item.color}-50 border border-${item.color}-200`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <p className={`font-bold text-${item.color}-800`}>{item.stil}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Merkmale:</p>
                      {item.merkmale.map((m, j) => (
                        <p key={j} className="text-xs text-gray-700">• {m}</p>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-700 mb-1">✅ Vorteile:</p>
                      <p className="text-xs text-gray-600 mb-2">{item.vorteile}</p>
                      <p className="text-xs font-semibold text-red-700 mb-1">❌ Nachteile:</p>
                      <p className="text-xs text-gray-600">{item.nachteile}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300">
            <p className="font-bold text-amber-800 text-sm mb-1">Im Schwimmbad-Kontext:</p>
            <p className="text-xs text-amber-700">
              Im Notfall (Ertrinken, Unfall): <strong>autoritär</strong> — klare Ansagen, keine Diskussion.
              Im Normalbetrieb: <strong>kooperativ</strong> — Mitarbeiter einbeziehen, Schichtplanung besprechen.
              Mit Azubis: <strong>situativ</strong> — je nach Ausbildungsstand direktiver oder freier.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'klima' && (
        <div className="space-y-4">
          <Section title="Betriebsklima — was ist das?">
            <p className="text-sm text-gray-700 mb-3">
              Das Betriebsklima beschreibt die <strong>Atmosphäre und Stimmung</strong> unter den
              Mitarbeitern eines Betriebs. Es beeinflusst Motivation, Produktivität, Krankenstand
              und Fluktuation erheblich.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-green-50 border border-green-300">
                <p className="font-bold text-green-800 text-sm mb-2">☀️ Gutes Betriebsklima</p>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Wertschätzung & Respekt</li>
                  <li>• Offene Kommunikation</li>
                  <li>• Fairness bei Dienstplanung</li>
                  <li>• Lob und konstruktive Kritik</li>
                  <li>• Teamgeist, gemeinsame Ziele</li>
                </ul>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-300">
                <p className="font-bold text-red-800 text-sm mb-2">⛈️ Schlechtes Betriebsklima</p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Intrigen und Gerüchte</li>
                  <li>• Ungerechtigkeit, Willkür</li>
                  <li>• Überforderung / Druck</li>
                  <li>• Fehlende Kommunikation</li>
                  <li>• Hoher Krankenstand</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Einflussfaktoren auf das Betriebsklima" color="blue">
            <div className="space-y-2">
              {[
                { faktor: 'Führungsverhalten', einfluss: 'Größter Faktor — Vorgesetzte prägen das Klima maßgeblich durch ihren Stil', icon: '👔' },
                { faktor: 'Arbeitsbelastung', einfluss: 'Dauerhafter Stress, Unterbesetzung (im Bad häufig) → Burnout-Risiko steigt', icon: '😓' },
                { faktor: 'Kommunikation', einfluss: 'Klare Infos, regelmäßige Teambesprechungen stärken das Klima', icon: '💬' },
                { faktor: 'Vergütung & Gerechtigkeit', einfluss: 'Unfaire Bezahlung oder Beförderung → Demotivation und Abwanderung', icon: '💶' },
                { faktor: 'Arbeitsumgebung', einfluss: 'Feuchte, Chlor, Lärm im Bad sind körperliche Belastungen — beeinflussen Stimmung', icon: '🏊' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-blue-800 text-sm">{item.faktor}</p>
                    <p className="text-xs text-gray-600">{item.einfluss}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'mobbing' && (
        <div className="space-y-4">
          <Section title="Was ist Mobbing?">
            <p className="text-sm text-gray-700 mb-3">
              Mobbing bezeichnet systematisches, wiederholtes Schikanieren, Ausgrenzen oder
              Anfeinden einer Person am Arbeitsplatz über einen längeren Zeitraum.
            </p>
            <div className="p-3 rounded-xl bg-red-100 border border-red-400 mb-3">
              <p className="font-bold text-red-800 text-sm mb-1">Definition (nach Leymann)</p>
              <p className="text-xs text-red-700">
                Mindestens <strong>1× pro Woche</strong>, über mindestens <strong>6 Monate</strong>,
                gegen eine Person gerichtete feindselige Handlungen — mit dem Ziel der Ausgrenzung.
              </p>
            </div>
          </Section>

          <Section title="Mobbinghandlungen erkennen" color="orange">
            <div className="grid grid-cols-2 gap-2">
              {[
                { kategorie: 'Soziale Isolation', beispiel: 'Ausschließen aus Gesprächen, ignorieren, Gruppenbildung gegen eine Person' },
                { kategorie: 'Angriff auf Ansehen', beispiel: 'Gerüchte streuen, lächerlich machen, Fehler übertrieben kritisieren' },
                { kategorie: 'Arbeitsbehinderung', beispiel: 'Informationen vorenthalten, Aufgaben entziehen, zu schwere oder sinnlose Aufgaben geben' },
                { kategorie: 'Persönliche Angriffe', beispiel: 'Beleidigungen, Drohungen, körperliche Einschüchterung' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <p className="font-bold text-orange-800 text-xs mb-1">{item.kategorie}</p>
                  <p className="text-xs text-gray-600">{item.beispiel}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Abgrenzung: Mobbing vs. Konflikt" color="yellow">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-bold text-blue-800 text-sm mb-1">⚡ Arbeitskonflikt</p>
                <ul className="text-xs text-blue-700 space-y-0.5">
                  <li>• Einmalig oder selten</li>
                  <li>• Sachbezogen</li>
                  <li>• Offene Auseinandersetzung</li>
                  <li>• Lösbar durch Gespräch</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="font-bold text-red-800 text-sm mb-1">🎯 Mobbing</p>
                <ul className="text-xs text-red-700 space-y-0.5">
                  <li>• Systematisch, wiederholt</li>
                  <li>• Gegen eine Person gerichtet</li>
                  <li>• Ziel: Schaden / Ausgrenzung</li>
                  <li>• &gt; 6 Monate, &gt;1× / Woche</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Was tun bei Mobbing?" color="red">
            <p className="text-sm text-gray-700 mb-2">Betroffene Person:</p>
            <div className="space-y-1 mb-3">
              {[
                'Dokumentieren: Datum, Ort, was geschah, Zeugen — Mobbingtagebuch führen',
                'Ansprechen: Falls möglich direktes Gespräch mit dem/den Tätern',
                'Vorgesetzten oder Betriebsrat einschalten',
                'Betriebliche Beschwerdestelle (§13 AGG) nutzen',
                'Im Extremfall: Arbeitsgericht, Klage auf Unterlassung und Schadensersatz',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="font-bold text-red-600 flex-shrink-0 text-sm">{i + 1}.</span>
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-700 mb-2">Arbeitgeber-Pflichten (§§ 12, 13 AGG):</p>
            {[
              'Mobbing verhindern und unterbinden — aktive Schutzpflicht',
              'Täter abmahnen oder versetzen',
              'Schadensersatz und Entschädigung bei nachgewiesenem Mobbing',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1">
                <CheckCircle size={13} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700">{item}</p>
              </div>
            ))}
          </Section>
        </div>
      )}

      {activeTab === 'dienstplan' && (
        <div className="space-y-4">
          <Section title="Dienstplan & Schichtplanung">
            <p className="text-sm text-gray-700 mb-3">
              Der Dienstplan regelt wer wann arbeitet. Im Schwimmbad ist er besonders komplex:
              Öffnungszeiten, Aufsichtsanforderungen, Feiertage, Krankheit.
            </p>
            <div className="space-y-2">
              {[
                { punkt: 'Mitbestimmungsrecht', detail: 'Betriebsrat hat Mitbestimmungsrecht bei Dienstplänen (§87 BetrVG) — Vorankündigungsfrist beachten' },
                { punkt: 'Mindestbesetzung', detail: 'Aufsichtsplan definiert Mindestbesetzung je Becken — Dienstplan muss dies abdecken' },
                { punkt: 'Ankündigungsfrist', detail: 'In der Regel mind. 2–4 Wochen vorher bekanntgeben — Tarifvertrag/Betriebsvereinbarung beachten' },
                { punkt: 'Ruhezeiten', detail: 'ArbZG: mind. 11h zwischen Schichten, max. 10h/Tag, 48h/Woche' },
                { punkt: 'Nacht- und Wochenendarbeit', detail: 'Zuschlagspflicht laut Tarifvertrag (TVöD o.ä.) — Ausgleichstage' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-white border border-emerald-200">
                  <p className="font-semibold text-emerald-800 text-sm w-36 flex-shrink-0">{item.punkt}</p>
                  <p className="text-xs text-gray-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Sparmaßnahmen beim Personalbedarf" color="orange">
            <p className="text-sm text-gray-700 mb-2">
              Kommunale Bäder unter Kostendruck versuchen Personal einzusparen — dabei gibt es klare Grenzen:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-300">
                <p className="font-bold text-green-800 text-sm mb-2">✅ Erlaubte Maßnahmen</p>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Schichtzeiten optimieren</li>
                  <li>• Ehrenamtliche DLRG-Hilfe</li>
                  <li>• Öffnungszeiten reduzieren</li>
                  <li>• Teilzeitmodelle</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-300">
                <p className="font-bold text-red-800 text-sm mb-2">❌ Nicht erlaubt</p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Unter DGUV-Mindestbesetzung</li>
                  <li>• Unqualifiziertes Personal</li>
                  <li>• Aufsichtsposten unbesetzt</li>
                  <li>• Zwingen zu Überstunden (ohne Tarifgrundlage)</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-300">
              <p className="font-bold text-red-800 text-sm">⚠️ Haftungsrisiko!</p>
              <p className="text-xs text-red-700 mt-1">
                Wenn ein Unfall passiert während die Mindestbesetzung unterschritten war,
                haftet der Betreiber persönlich — Kostenersparnis und Haftungsrisiko stehen
                in keinem Verhältnis.
              </p>
            </div>
          </Section>

          <Section title="Schichtmodelle im Bad" color="blue">
            <div className="space-y-2">
              {[
                { modell: 'Frühschicht', zeit: 'ca. 06:00–14:00 Uhr', einsatz: 'Morgenöffnung, Schulschwimmen, technische Kontrollen' },
                { modell: 'Spätschicht', zeit: 'ca. 14:00–22:00 Uhr', einsatz: 'Publikumsstarke Zeit, Vereinsschwimmen, Abendschließung' },
                { modell: 'Mittelschicht', zeit: 'ca. 10:00–18:00 Uhr', einsatz: 'Hauptbetriebszeit, Familienzeiten' },
                { modell: 'Nachtschicht (selten)', zeit: 'ca. 22:00–06:00 Uhr', einsatz: 'Nur in großen Anlagen mit Nachtbetrieb oder technischem Wartungsdienst' },
              ].map((item, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="font-semibold text-blue-800 text-xs">{item.modell}</p>
                  <p className="font-mono text-blue-700 text-xs">{item.zeit}</p>
                  <p className="text-xs text-gray-600">{item.einsatz}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
