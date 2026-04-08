import React, { useState } from 'react';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

const TABS = {
  grundlagen: { label: 'Grundlagen', icon: '🏛️' },
  organe: { label: 'Kommunalorgane', icon: '🗳️' },
  bäder: { label: 'Bäder & Kommune', icon: '🏊' },
  haushalt: { label: 'Haushalt', icon: '💰' },
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

export default function KommunalpolitikDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('grundlagen');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 p-5 text-white">
        <div className="text-3xl mb-2">🏛️</div>
        <h2 className="text-xl font-bold">Kommunalpolitik</h2>
        <p className="text-emerald-100 text-sm mt-1">
          Gemeinden, Stadträte, kommunale Unternehmen und die Rolle des Schwimmbads
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'grundlagen' && (
        <div className="space-y-4">
          <Section title="Was ist eine Kommune?">
            <p className="text-sm text-gray-700 mb-3">
              Kommunen (Gemeinden, Städte, Landkreise) sind die unterste Ebene des Staatsaufbaus in Deutschland.
              Sie sind <strong>Körperschaften des öffentlichen Rechts</strong> und haben das Recht auf
              <strong> kommunale Selbstverwaltung</strong> (Art. 28 Abs. 2 GG).
            </p>
            <div className="space-y-2">
              {[
                { ebene: 'Bund', aufgabe: 'Bundesgesetze, Außenpolitik, Bundeswehr', icon: '🇩🇪' },
                { ebene: 'Länder (z.B. NRW)', aufgabe: 'Landesgesetze, Polizei, Schulen', icon: '🗺️' },
                { ebene: 'Landkreis', aufgabe: 'Überörtliche Aufgaben, Kreisstraßen, Soziales', icon: '🏘️' },
                { ebene: 'Gemeinde / Stadt', aufgabe: 'Lokale Daseinsvorsorge: Wasser, Straßen, Bäder', icon: '🏙️' },
              ].map((row, i) => (
                <div key={i} className="flex gap-3 items-center p-2 rounded-lg bg-white border border-emerald-100">
                  <span className="text-xl w-8 text-center">{row.icon}</span>
                  <div>
                    <p className="font-semibold text-emerald-800 text-sm">{row.ebene}</p>
                    <p className="text-xs text-gray-600">{row.aufgabe}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Pflichtaufgaben vs. freiwillige Aufgaben">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="font-semibold text-red-800 text-sm mb-2">🔒 Pflichtaufgaben</p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Feuerwehr</li>
                  <li>• Abwasserbeseitigung</li>
                  <li>• Straßenbau</li>
                  <li>• Bauleitplanung</li>
                  <li>• Schulgebäude</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-semibold text-blue-800 text-sm mb-2">💡 Freiwillige Aufgaben</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Schwimmbäder</li>
                  <li>• Bibliotheken</li>
                  <li>• Museen</li>
                  <li>• Sportstätten</li>
                  <li>• Kulturveranstaltungen</li>
                </ul>
              </div>
            </div>
            <InfoBox icon={AlertTriangle} color="amber" title="Schwimmbäder sind freiwillig!">
              Schwimmbäder gehören zur freiwilligen <strong>Daseinsvorsorge</strong>. Bei Haushaltsproblemen
              sind sie deshalb oft als erstes von Schließung bedroht — obwohl sie gesellschaftlich wichtig sind
              (Schulschwimmen, Gesundheit, Vereinssport).
            </InfoBox>
          </Section>

          <Section title="Gemeindeordnung (GO)">
            <p className="text-sm text-gray-700 mb-2">
              Jedes Bundesland hat eine eigene <strong>Gemeindeordnung</strong>, die regelt wie Kommunen
              aufgebaut sind und arbeiten. In NRW z.B. die GO NRW.
            </p>
            <div className="space-y-1">
              {[
                'Aufbau der Gemeindeorgane (Rat, Bürgermeister)',
                'Haushaltsrecht und Finanzwirtschaft',
                'Zuständigkeiten und Aufgabenverteilung',
                'Beteiligungsrechte der Bürger',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'organe' && (
        <div className="space-y-4">
          <Section title="Gemeinderat / Stadtrat">
            <p className="text-sm text-gray-700 mb-3">
              Der <strong>Gemeinderat</strong> (in Städten: Stadtrat oder Stadtverordnetenversammlung) ist das
              <strong> gewählte Parlament der Kommune</strong>. Die Bürger wählen ihn alle 5–6 Jahre
              (je nach Bundesland).
            </p>
            <div className="space-y-2">
              {[
                { task: 'Beschließt den Haushalt', icon: '💰' },
                { task: 'Bestimmt die kommunale Politik', icon: '🗳️' },
                { task: 'Beschließt Satzungen (z.B. Gebührensatzung für Bäder)', icon: '📜' },
                { task: 'Kontrolliert die Verwaltung', icon: '🔍' },
                { task: 'Entscheidet über Bau oder Schließung von Einrichtungen', icon: '🏗️' },
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-center p-2 rounded-lg bg-emerald-50">
                  <span>{item.icon}</span>
                  <p className="text-sm text-gray-700">{item.task}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Bürgermeister / Oberbürgermeister">
            <p className="text-sm text-gray-700 mb-3">
              Der Bürgermeister (in Großstädten: Oberbürgermeister) wird direkt von den Bürgern gewählt
              und leitet die Gemeindeverwaltung.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-semibold text-blue-800 text-sm mb-2">Aufgaben</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Leitet die Verwaltung</li>
                  <li>• Vertritt die Gemeinde nach außen</li>
                  <li>• Führt Ratsbeschlüsse aus</li>
                  <li>• Leitet Rats-Sitzungen</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                <p className="font-semibold text-orange-800 text-sm mb-2">Amtszeit</p>
                <ul className="text-xs text-orange-700 space-y-1">
                  <li>• 5–8 Jahre (je nach Bundesland)</li>
                  <li>• Direkt gewählt</li>
                  <li>• Hauptamtlich</li>
                  <li>• Kann Dezernenten ernennen</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Verwaltung & Ämter">
            <p className="text-sm text-gray-600 mb-2">
              Die Kommunalverwaltung ist in Ämter oder Dezernate gegliedert:
            </p>
            <div className="space-y-1">
              {[
                { amt: 'Hauptamt', aufgabe: 'Organisation, Personal, Ratssitzungen' },
                { amt: 'Kämmerei / Finanzamt', aufgabe: 'Haushalt, Steuern, Gebühren' },
                { amt: 'Ordnungsamt', aufgabe: 'Gewerbe, Parkraumüberwachung, Sicherheit' },
                { amt: 'Bauamt', aufgabe: 'Baugenehmigungen, Stadtplanung' },
                { amt: 'Sport-/Bäderamt', aufgabe: 'Verwaltung städtischer Sportanlagen & Bäder' },
              ].map((item, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-teal-50 border border-teal-100">
                  <p className="font-semibold text-teal-800 text-sm">{item.amt}</p>
                  <p className="text-xs text-gray-600">{item.aufgabe}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Bürgerbeteiligung">
            <p className="text-sm text-gray-700 mb-2">
              Bürger haben verschiedene Möglichkeiten, die Kommunalpolitik mitzugestalten:
            </p>
            <div className="space-y-1">
              {[
                { mittel: 'Wahl', beschr: 'Alle 5–6 Jahre Rat und Bürgermeister wählen' },
                { mittel: 'Bürgerbegehren', beschr: 'Antrag von mind. 3–5 % der Bürger auf Abstimmung' },
                { mittel: 'Bürgerentscheid', beschr: 'Direkte Abstimmung über kommunale Fragen' },
                { mittel: 'Einwohnerfrage', beschr: 'Fragen an den Rat in öffentlichen Sitzungen stellen' },
                { mittel: 'Petition', beschr: 'Eingaben und Anliegen an die Verwaltung richten' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-white border border-gray-200">
                  <p className="font-semibold text-emerald-700 text-sm w-32 flex-shrink-0">{item.mittel}</p>
                  <p className="text-xs text-gray-600">{item.beschr}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'bäder' && (
        <div className="space-y-4">
          <Section title="Das Schwimmbad als kommunale Einrichtung">
            <p className="text-sm text-gray-700 mb-3">
              Schwimmbäder werden in Deutschland meist von Kommunen betrieben — als Teil der
              <strong> Daseinsvorsorge</strong>. Dabei gibt es verschiedene Betriebsformen:
            </p>
            <div className="space-y-2">
              {[
                {
                  form: 'Regiebetrieb',
                  beschr: 'Direkter Teil der Gemeindeverwaltung, kein eigenes Budget',
                  vor: 'Volle politische Kontrolle',
                  nach: 'Wenig unternehmerische Flexibilität',
                },
                {
                  form: 'Eigenbetrieb',
                  beschr: 'Rechtlich unselbstständig, aber eigene Buchführung und Budget',
                  vor: 'Mehr kaufmännische Freiheit',
                  nach: 'Verluste direkt im Gemeindehaushalt',
                },
                {
                  form: 'GmbH / Stadtwerke',
                  beschr: 'Eigenständige Gesellschaft, Gemeinde ist (Mit-)Gesellschafter',
                  vor: 'Flexibel, kann Querfinanzierung nutzen',
                  nach: 'Gemeinderat hat weniger direkten Einfluss',
                },
                {
                  form: 'Zweckverband',
                  beschr: 'Mehrere Gemeinden betreiben gemeinsam ein Bad',
                  vor: 'Kostenverteilung auf mehrere Kommunen',
                  nach: 'Komplexe Abstimmungsprozesse',
                },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-white border border-emerald-200">
                  <p className="font-bold text-emerald-800 text-sm mb-1">{item.form}</p>
                  <p className="text-xs text-gray-600 mb-2">{item.beschr}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-xs text-green-700">✅ {item.vor}</p>
                    <p className="text-xs text-red-700">❌ {item.nach}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Querfinanzierung bei Stadtwerken">
            <p className="text-sm text-gray-700 mb-3">
              Schwimmbäder sind fast immer <strong>defizitär</strong> — sie kosten mehr als sie einnehmen.
              Bei kommunalen GmbHs wird das Defizit oft durch Gewinne aus anderen Bereichen ausgeglichen:
            </p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-semibold text-green-800 text-sm">Strom- & Gasversorgung (Gewinn)</p>
                <p className="text-xs text-green-700">finanziert</p>
              </div>
              <span className="text-xl mx-2">→</span>
              <span className="text-2xl">🏊</span>
              <div>
                <p className="font-semibold text-blue-800 text-sm">Schwimmbad (Verlust)</p>
                <p className="text-xs text-blue-700">steuerlich absetzbar</p>
              </div>
            </div>
          </Section>

          <Section title="Gebührenordnung & Eintrittspreise">
            <p className="text-sm text-gray-700 mb-2">
              Eintrittspreise für kommunale Bäder werden durch eine <strong>Gebührensatzung</strong>
              vom Stadtrat beschlossen. Dabei gilt:
            </p>
            <div className="space-y-1">
              {[
                'Keine Gewinnerzielung — Kostendeckung ist das Ziel',
                'Soziale Staffelung möglich (Kinder, Sozialhilfeempfänger)',
                'Schulbäder/Vereinssport oft zu Sonderkonditionen',
                'Preisanpassungen müssen vom Rat beschlossen werden',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'haushalt' && (
        <div className="space-y-4">
          <Section title="Der kommunale Haushalt">
            <p className="text-sm text-gray-700 mb-3">
              Jede Gemeinde muss jährlich einen <strong>Haushaltsplan</strong> aufstellen und vom Rat
              beschließen lassen. Dieser ist das zentrale Steuerungsinstrument der Kommunalpolitik.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="font-semibold text-green-800 text-sm mb-2">💚 Einnahmen</p>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Gewerbesteuer</li>
                  <li>• Grundsteuer</li>
                  <li>• Einkommensteueranteil</li>
                  <li>• Schlüsselzuweisungen (Land)</li>
                  <li>• Gebühren & Entgelte</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="font-semibold text-red-800 text-sm mb-2">❤️ Ausgaben</p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Personalkosten</li>
                  <li>• Soziale Leistungen</li>
                  <li>• Infrastruktur & Gebäude</li>
                  <li>• Schulen & Kitas</li>
                  <li>• Freiwillige Leistungen (Bäder!)</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Doppik statt Kameralistik">
            <p className="text-sm text-gray-700 mb-2">
              Die meisten Kommunen sind auf <strong>doppische Buchführung</strong> (wie in der Privatwirtschaft)
              umgestellt — statt der alten Kameralistik (nur Ein-/Ausgaben).
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="font-semibold text-gray-700 text-sm mb-1">Kameralistik (alt)</p>
                <p className="text-xs text-gray-600">Nur Einnahmen & Ausgaben — Vermögen wird kaum erfasst</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="font-semibold text-emerald-700 text-sm mb-1">Doppik (neu)</p>
                <p className="text-xs text-emerald-700">Ergebnis-, Finanz- und Vermögensrechnung — transparenter</p>
              </div>
            </div>
          </Section>

          <Section title="Haushaltssicherung & Nothaushalt">
            <InfoBox icon={AlertTriangle} color="red" title="Wenn das Geld nicht reicht...">
              Wenn eine Gemeinde dauerhaft Defizite hat, greift die Kommunalaufsicht des Landes ein.
              Die Gemeinde muss dann ein <strong>Haushaltssicherungskonzept</strong> vorlegen — dabei
              sind freiwillige Leistungen wie Schwimmbäder oft die ersten Streichkandidaten.
            </InfoBox>
            <p className="text-sm text-gray-700 mb-2">Im Nothaushalt gilt:</p>
            <div className="space-y-1">
              {[
                'Nur Pflichtaufgaben dürfen erfüllt werden',
                'Neue freiwillige Leistungen sind gesperrt',
                'Investitionen nur mit Zustimmung der Aufsichtsbehörde',
                'Kommunalaufsicht kann Beschlüsse beanstanden',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
