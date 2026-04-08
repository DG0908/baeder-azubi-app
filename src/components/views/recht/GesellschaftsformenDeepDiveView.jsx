import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const TABS = {
  überblick: { label: 'Überblick', icon: '📊' },
  personen: { label: 'Personengesellschaften', icon: '🤝' },
  kapital: { label: 'Kapitalgesellschaften', icon: '🏦' },
  öffentlich: { label: 'Öffentl. Unternehmen', icon: '🏛️' },
};

const TabChip = ({ id, tab, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
      active ? 'bg-emerald-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {tab.icon} {tab.label}
  </button>
);

const Section = ({ title, children, color = 'emerald' }) => (
  <div className={`rounded-xl border border-${color}-200 bg-${color}-50 p-4 mb-4`}>
    {title && <h3 className={`font-bold text-${color}-800 mb-3 text-base`}>{title}</h3>}
    {children}
  </div>
);

const InfoBox = ({ icon: Icon = Info, title, children, color = 'blue' }) => (
  <div className={`flex gap-3 p-3 rounded-lg bg-${color}-50 border border-${color}-200 mb-3`}>
    <Icon size={18} className={`text-${color}-600 flex-shrink-0 mt-0.5`} />
    <div>
      {title && <p className={`font-semibold text-${color}-800 text-sm mb-1`}>{title}</p>}
      <div className={`text-${color}-700 text-sm`}>{children}</div>
    </div>
  </div>
);

const GesellschaftCard = ({ name, kurz, kapital, haftung, gründer, leitung, highlight, color = 'emerald' }) => (
  <div className={`rounded-xl border-2 border-${color}-300 bg-${color}-50 p-4 mb-3`}>
    <div className="flex items-start justify-between mb-2">
      <div>
        <span className={`text-xs font-bold text-white bg-${color}-600 px-2 py-0.5 rounded-full`}>{kurz}</span>
        <h4 className={`font-bold text-${color}-800 text-base mt-1`}>{name}</h4>
      </div>
    </div>
    {highlight && (
      <div className={`p-2 rounded-lg bg-${color}-100 border border-${color}-300 mb-3`}>
        <p className={`text-xs font-semibold text-${color}-800`}>{highlight}</p>
      </div>
    )}
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <p className="font-semibold text-gray-600 mb-0.5">Mindestkapital</p>
        <p className="text-gray-800">{kapital}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-600 mb-0.5">Haftung</p>
        <p className="text-gray-800">{haftung}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-600 mb-0.5">Mindest-Gründer</p>
        <p className="text-gray-800">{gründer}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-600 mb-0.5">Leitung</p>
        <p className="text-gray-800">{leitung}</p>
      </div>
    </div>
  </div>
);

export default function GesellschaftsformenDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('überblick');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 p-5 text-white">
        <div className="text-3xl mb-2">🏦</div>
        <h2 className="text-xl font-bold">Gesellschaftsformen</h2>
        <p className="text-emerald-100 text-sm mt-1">
          Rechtsformen von Unternehmen — von der GbR bis zur AG
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'überblick' && (
        <div className="space-y-4">
          <Section title="Warum verschiedene Rechtsformen?">
            <p className="text-sm text-gray-700 mb-3">
              Die Wahl der Rechtsform beeinflusst: Haftung, Steuern, Kapitalbeschaffung, Leitungsstruktur
              und Außenwirkung. Es gibt zwei Hauptgruppen:
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-300">
                <p className="font-bold text-blue-800 text-sm mb-2">🤝 Personengesellschaften</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Gesellschafter stehen im Vordergrund</li>
                  <li>• Meist unbeschränkte Haftung</li>
                  <li>• Kein Mindestkapital nötig</li>
                  <li>• GbR, OHG, KG</li>
                </ul>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-300">
                <p className="font-bold text-purple-800 text-sm mb-2">🏦 Kapitalgesellschaften</p>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>• Kapital steht im Vordergrund</li>
                  <li>• Haftung auf Gesellschaftsvermögen begrenzt</li>
                  <li>• Mindestkapital erforderlich</li>
                  <li>• GmbH, AG, UG</li>
                </ul>
              </div>
            </div>
            <InfoBox icon={Info} color="emerald" title="Relevanz für Schwimmbäder">
              Kommunale Schwimmbäder werden oft als <strong>GmbH</strong> (z.B. Stadtwerke GmbH) oder als
              <strong> Eigenbetrieb</strong> (kommunalrechtliche Sonderform) geführt. Das beeinflusst
              Haftung, Tarifbindung und Entscheidungswege.
            </InfoBox>
          </Section>

          <Section title="Schnellübersicht aller Rechtsformen">
            <div className="overflow-x-auto rounded-lg border border-emerald-200">
              <table className="w-full text-xs">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Rechtsform</th>
                    <th className="px-3 py-2 text-left">Kapital</th>
                    <th className="px-3 py-2 text-left">Haftung</th>
                    <th className="px-3 py-2 text-left">Eintrag HR</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { form: 'GbR', kapital: 'Keins', haftung: 'Unbegrenzt persönlich', hr: 'Nein' },
                    { form: 'OHG', kapital: 'Keins', haftung: 'Unbegrenzt persönlich', hr: 'Ja (A)' },
                    { form: 'KG', kapital: 'Keins', haftung: 'Kompl.: unbegrenzt / Komm.: Einlage', hr: 'Ja (A)' },
                    { form: 'UG (haftungsbeschränkt)', kapital: '1 €', haftung: 'Nur Gesellschaftsvermögen', hr: 'Ja (B)' },
                    { form: 'GmbH', kapital: '25.000 €', haftung: 'Nur Gesellschaftsvermögen', hr: 'Ja (B)' },
                    { form: 'AG', kapital: '50.000 €', haftung: 'Nur Gesellschaftsvermögen', hr: 'Ja (B)' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-emerald-50'}>
                      <td className="px-3 py-2 font-semibold text-gray-800">{row.form}</td>
                      <td className="px-3 py-2 text-gray-600">{row.kapital}</td>
                      <td className="px-3 py-2 text-gray-600">{row.haftung}</td>
                      <td className="px-3 py-2 text-gray-600">{row.hr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-500 p-2">HR A = Handelsregister Abteilung A, HR B = Abteilung B</p>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'personen' && (
        <div className="space-y-4">
          <GesellschaftCard
            name="Gesellschaft bürgerlichen Rechts"
            kurz="GbR"
            kapital="Kein Mindestkapital"
            haftung="Alle Gesellschafter unbeschränkt & gesamtschuldnerisch"
            gründer="2 Personen"
            leitung="Alle Gesellschafter gemeinsam"
            highlight="⚠️ Jeder Gesellschafter haftet mit seinem GESAMTEN Privatvermögen!"
            color="orange"
          />
          <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-800">
            <p className="font-semibold mb-1">Beispiele für GbR:</p>
            <p className="text-xs">Freiberufler (Ärzte, Anwälte, Architekten), kleine Gewerbebetriebe, WGs als Mieter-GbR</p>
          </div>

          <GesellschaftCard
            name="Offene Handelsgesellschaft"
            kurz="OHG"
            kapital="Kein Mindestkapital"
            haftung="Alle Gesellschafter unbeschränkt & gesamtschuldnerisch"
            gründer="2 Personen"
            leitung="Alle Gesellschafter (Geschäftsführungsbefugnis)"
            highlight="Wie GbR, aber für kaufmännische Betriebe — Eintrag ins Handelsregister A pflicht"
            color="amber"
          />

          <GesellschaftCard
            name="Kommanditgesellschaft"
            kurz="KG"
            kapital="Kein Mindestkapital"
            haftung="Komplementär: unbegrenzt / Kommanditist: nur Einlage"
            gründer="2 Personen (1 Kompl. + 1 Komm.)"
            leitung="Komplementär(e)"
            highlight="Zwei Klassen: Komplementär = aktiv, haftet voll / Kommanditist = passiv, haftet nur mit Einlage"
            color="yellow"
          />
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm">
            <p className="font-semibold text-yellow-800 mb-1">GmbH & Co. KG</p>
            <p className="text-xs text-yellow-700">
              Beliebte Kombination: Komplementär ist eine GmbH (haftungsbeschränkt) → so haftet faktisch
              niemand unbegrenzt persönlich. Weit verbreitet im Mittelstand.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'kapital' && (
        <div className="space-y-4">
          <GesellschaftCard
            name="Gesellschaft mit beschränkter Haftung"
            kurz="GmbH"
            kapital="25.000 € Stammkapital (mind. 12.500 € bei Gründung einzuzahlen)"
            haftung="Nur Gesellschaftsvermögen — Gesellschafter privat geschützt"
            gründer="1 Person"
            leitung="Geschäftsführer (vom Gesellschafter bestellt)"
            highlight="Die häufigste Rechtsform in Deutschland. Oft für kommunale Stadtwerke & Bäder-GmbH genutzt."
            color="blue"
          />

          <Section title="Aufbau einer GmbH" color="blue">
            <div className="space-y-2">
              {[
                { organ: 'Gesellschafterversammlung', rolle: 'Oberstes Organ — bestellt/entlässt Geschäftsführer, beschließt Gewinnverteilung', icon: '👥' },
                { organ: 'Geschäftsführer', rolle: 'Leitet das operative Geschäft, vertritt GmbH nach außen, ist persönlich haftbar bei Pflichtverletzung', icon: '👤' },
                { organ: 'Aufsichtsrat (ab 500 MA)', rolle: 'Kontrolliert Geschäftsführung — bei mitbestimmungspflichtigen Unternehmen', icon: '🔍' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-blue-800 text-sm">{item.organ}</p>
                    <p className="text-xs text-blue-700">{item.rolle}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <GesellschaftCard
            name="Aktiengesellschaft"
            kurz="AG"
            kapital="50.000 € Grundkapital"
            haftung="Nur Gesellschaftsvermögen — Aktionäre haften nur mit Aktienwert"
            gründer="1 Person"
            leitung="Vorstand (operativ) + Aufsichtsrat (Kontrolle)"
            highlight="Für börsennotierte Unternehmen oder große Kapitalgesellschaften. In kommunalem Bereich selten."
            color="purple"
          />

          <Section title="Aufbau einer AG" color="purple">
            <div className="space-y-2">
              {[
                { organ: 'Hauptversammlung', rolle: 'Alle Aktionäre — wählt Aufsichtsrat, beschließt Dividende', icon: '🗳️' },
                { organ: 'Aufsichtsrat', rolle: 'Bestellt und kontrolliert den Vorstand', icon: '🔍' },
                { organ: 'Vorstand', rolle: 'Leitet die AG, vergleichbar mit Geschäftsführer der GmbH', icon: '👤' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-purple-800 text-sm">{item.organ}</p>
                    <p className="text-xs text-purple-700">{item.rolle}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="UG — die 'Mini-GmbH'" color="teal">
            <p className="text-sm text-gray-700 mb-2">
              Die <strong>Unternehmergesellschaft (haftungsbeschränkt)</strong> ist eine Einstiegsvariante
              der GmbH. Gründung ab <strong>1 € Stammkapital</strong> möglich. Pflicht: 25 % des Jahresgewinns
              einbehalten bis 25.000 € erreicht sind — dann kann Umwandlung in GmbH beantragt werden.
            </p>
          </Section>
        </div>
      )}

      {activeTab === 'öffentlich' && (
        <div className="space-y-4">
          <Section title="Besonderheiten öffentlicher Unternehmen">
            <p className="text-sm text-gray-700 mb-3">
              Wenn die öffentliche Hand (Bund, Land, Kommune) Unternehmen betreibt, gelten zusätzliche Regeln:
            </p>
            <div className="space-y-2">
              {[
                { icon: '🗳️', text: 'Demokratische Kontrolle: Stadtrat/Gemeinderat hat Mitspracherecht' },
                { icon: '📊', text: 'Transparenzpflicht: Jahresabschlüsse meist öffentlich' },
                { icon: '🏷️', text: 'Öffentliches Haushaltsrecht gilt zusätzlich' },
                { icon: '⚖️', text: 'Vergaberecht: Aufträge müssen ausgeschrieben werden (VOL/A, VgV)' },
                { icon: '🤝', text: 'Tarifbindung: Oft TVöD oder Spartentarifvertrag' },
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start p-2 rounded-lg bg-emerald-50">
                  <span>{item.icon}</span>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Typische Rechtsformen kommunaler Bäder">
            <div className="space-y-3">
              {[
                {
                  form: 'Regiebetrieb',
                  beschr: 'Kein eigenes Rechtssubjekt — Teil der Stadtverwaltung',
                  typisch: 'Kleine Freibäder, Hallenbäder kleiner Gemeinden',
                  icon: '🏢',
                },
                {
                  form: 'Eigenbetrieb',
                  beschr: 'Rechtl. unselbstständig, kaufmännisch geführt mit eigener Satzung',
                  typisch: 'Mittelgroße Bäderbetriebe',
                  icon: '📋',
                },
                {
                  form: 'GmbH (z.B. Stadtbäder GmbH)',
                  beschr: 'Eigenständige Gesellschaft, Stadt als Allein- oder Mehrheitsgesellschafter',
                  typisch: 'Große Bäderbetriebe, Stadtwerke-Töchter',
                  icon: '🏦',
                },
                {
                  form: 'Zweckverband',
                  beschr: 'Mehrere Kommunen gründen gemeinsam einen Verband',
                  typisch: 'Regionale Bäder, Erlebnisbäder mit Einzugsgebiet mehrerer Gemeinden',
                  icon: '🤝',
                },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-emerald-200">
                  <div className="flex gap-2 items-center mb-2">
                    <span className="text-xl">{item.icon}</span>
                    <p className="font-bold text-emerald-800 text-sm">{item.form}</p>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{item.beschr}</p>
                  <p className="text-xs text-teal-700 font-medium">Typisch: {item.typisch}</p>
                </div>
              ))}
            </div>
          </Section>

          <InfoBox icon={CheckCircle} color="emerald" title="Für die Ausbildung relevant">
            Als FaBB-Azubi arbeitest du wahrscheinlich entweder in einem kommunalen Eigenbetrieb oder einer
            kommunalen GmbH. Das beeinflusst deinen Tarifvertrag (TVöD vs. TV-V), deine Ansprechpartner
            und die Entscheidungswege im Betrieb.
          </InfoBox>
        </div>
      )}
    </div>
  );
}
