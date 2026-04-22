import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const TABS = {
  grundlagen: { label: 'Grundlagen', icon: '📚' },
  arten: { label: 'Aufsichtsarten', icon: '👁️' },
  becken: { label: 'Beckenaufsicht', icon: '🏊' },
  dokumentation: { label: 'Dokumentation', icon: '📋' },
  dienstkleidung: { label: 'Dienstkleidung', icon: '👕' },
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

export default function AufsichtspflichtDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('grundlagen');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 p-5 text-white">
        <div className="text-3xl mb-2">👁️</div>
        <h2 className="text-xl font-bold">Verkehrssicherungs- & Aufsichtspflicht</h2>
        <p className="text-emerald-100 text-sm mt-1">
          Betriebsaufsicht, Beckenaufsicht, Dokumentation und Dienstkleidung im Bäderbetrieb
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'grundlagen' && (
        <div className="space-y-4">
          <Section title="Was ist die Verkehrssicherungspflicht?">
            <p className="text-sm text-gray-700 mb-3">
              Wer eine Gefahrenquelle schafft oder unterhält (z.B. ein Schwimmbad), muss alle
              zumutbaren Maßnahmen ergreifen, um andere vor daraus entstehenden Schäden zu schützen.
              Rechtsgrundlage: <strong>§ 823 BGB</strong>.
            </p>
            <div className="p-3 rounded-xl bg-red-50 border border-red-300 mb-3">
              <p className="font-bold text-red-800 text-sm mb-1">⚠️ Schwimmbad = besondere Gefahrenquelle!</p>
              <p className="text-xs text-red-700">
                Gerichte stufen Schwimmbäder als <strong>besonders gefährliche Einrichtungen</strong> ein.
                Das bedeutet: höhere Anforderungen an Sicherheit und Aufsicht als bei normalen öffentlichen Anlagen.
              </p>
            </div>
            <div className="space-y-2">
              {[
                { wer: 'Betreiber (Träger)', pflicht: 'Gesamtverantwortung — Anlage sicher halten, Personal stellen, Aufsichtsplan erstellen' },
                { wer: 'Bäderleiter', pflicht: 'Organisation der Aufsicht, Dienstplanung, Kontrolle der Aufsichtspersonen' },
                { wer: 'FAB / Rettungsschwimmer', pflicht: 'Wasser- und Beckenaufsicht vor Ort — direkte Schutzpflicht gegenüber Badegästen' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-white border border-emerald-200">
                  <div className="w-32 flex-shrink-0">
                    <p className="font-bold text-emerald-800 text-sm">{item.wer}</p>
                  </div>
                  <p className="text-xs text-gray-600">{item.pflicht}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Garantenstellung des FAB" color="red">
            <p className="text-sm text-gray-700 mb-2">
              Als FAB hast du eine besondere rechtliche Stellung: die <strong>Garantenstellung</strong>.
              Du bist durch deinen Beruf verpflichtet, Badegäste aktiv zu schützen.
            </p>
            <div className="p-3 rounded-xl bg-red-100 border border-red-400">
              <p className="font-bold text-red-800 text-sm mb-1">§ 13 StGB — Begehen durch Unterlassen</p>
              <p className="text-xs text-red-700">
                Wenn du als Aufsichtsperson eine Gefahr erkennst und NICHT eingreifst, kannst du genauso
                strafbar sein wie jemand der aktiv handelt. Passivität ist keine Option!
              </p>
            </div>
            <div className="mt-3 space-y-1">
              {[
                'Ertrinken beobachten und nicht eingreifen → §323c StGB (Unterlassene Hilfeleistung)',
                'Gefährliche Situation erkennen und ignorieren → §229 StGB (Fahrlässige Körperverletzung)',
                'Defekte Einrichtung nicht melden → §823 BGB (Schadensersatzpflicht)',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="DGUV Regel 107-004" color="blue">
            <p className="text-sm text-gray-700 mb-2">
              Die wichtigste Regelung für Bäder kommt von der DGUV:
            </p>
            <div className="space-y-1">
              {[
                'Mindestbesetzung der Aufsicht je nach Beckentyp und -größe',
                'Qualifikationsanforderungen (FAB, Rettungsschwimmer DLRG/DRSA Silber)',
                'Aufsichtsposition und -sichtfeld',
                'Ablenkungsverbot während der Beckenaufsicht',
                'Regelungen für Schul- und Vereinsbetrieb',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start mb-1">
                  <CheckCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'arten' && (
        <div className="space-y-4">
          <Section title="Die 3 Aufsichtsebenen im Bäderbetrieb">
            <div className="space-y-4">
              {[
                {
                  nr: '1',
                  name: 'Betriebsaufsicht',
                  verantwortlich: 'Bäderleiter / Schichtleiter',
                  aufgaben: [
                    'Übergeordnete Kontrolle über den gesamten Betrieb',
                    'Aufsichtsplan erstellen und sicherstellen',
                    'Personal einteilen und überwachen',
                    'Technische Kontrollen (Wasserqualität, Anlagen)',
                    'Hausordnung durchsetzen',
                  ],
                  ablenkung: 'Darf kurz von der direkten Beckenaufsicht abweichen für administrative Aufgaben',
                  color: 'purple',
                },
                {
                  nr: '2',
                  name: 'Beaufsichtigung des Badebetriebs',
                  verantwortlich: 'FAB / erfahrenes Personal',
                  aufgaben: [
                    'Allgemeine Aufsicht über Publikumsbereich',
                    'Einhaltung der Badeordnung kontrollieren',
                    'Gefahren erkennen und beseitigen',
                    'Gästekontakt und Beratung',
                    'Rundgänge in Umkleiden, Sanitärbereich',
                  ],
                  ablenkung: 'Kann kurzzeitig für Aufgaben abgelenkt werden — Beckenaufsicht muss sichergestellt sein',
                  color: 'blue',
                },
                {
                  nr: '3',
                  name: 'Wasser- und Beckenaufsicht',
                  verantwortlich: 'FAB / qualifiziertes Personal',
                  aufgaben: [
                    'Ausschließlich Beobachtung des Beckens',
                    'Volle Aufmerksamkeit auf das Wasser',
                    'Erkennen von Ertrinkenden (auch stille Ertrinker)',
                    'Sofortiger Eingriff bei Gefahr',
                    'Keine anderen Aufgaben während der Beckenaufsicht!',
                  ],
                  ablenkung: '⛔ KEINE Ablenkung erlaubt — kein Handy, kein Gespräch, keine anderen Tätigkeiten',
                  color: 'red',
                },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl bg-${item.color}-50 border-2 border-${item.color}-300`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-8 h-8 rounded-full bg-${item.color}-600 text-white font-bold text-sm flex items-center justify-center`}>{item.nr}</span>
                    <div>
                      <p className={`font-bold text-${item.color}-800`}>{item.name}</p>
                      <p className={`text-xs text-${item.color}-600`}>Verantwortlich: {item.verantwortlich}</p>
                    </div>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {item.aufgaben.map((a, j) => (
                      <li key={j} className="flex gap-2 items-start">
                        <span className="text-gray-400 text-xs mt-0.5">•</span>
                        <p className="text-xs text-gray-700">{a}</p>
                      </li>
                    ))}
                  </ul>
                  <div className={`p-2 rounded-lg ${item.nr === '3' ? 'bg-red-100 border border-red-400' : 'bg-white border border-gray-200'}`}>
                    <p className={`text-xs font-medium ${item.nr === '3' ? 'text-red-800' : 'text-gray-600'}`}>{item.ablenkung}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'becken' && (
        <div className="space-y-4">
          <Section title="Anforderungen an die Beckenaufsicht">
            <div className="space-y-2">
              {[
                { anf: 'Sichtfeld', detail: 'Der gesamte Beckenbereich muss eingesehen werden können. Bei großen Becken: mehrere Aufsichtsposten!' },
                { anf: 'Position', detail: 'Erhöhter Standort (Aufsichtsturm, Podest) oder Poolside — klar definiert im Aufsichtsplan' },
                { anf: 'Qualifikation', detail: 'Mindestens: DRSA Silber oder gleichwertig. Für FAB: Teil der Ausbildung' },
                { anf: 'Ablösung', detail: 'Regelmäßige Ablösung nötig — nach spätestens 45–60 Min. nachlässt Konzentration' },
                { anf: 'Kommunikation', detail: 'Pfiff-Signale definiert, Notruf erreichbar, Kollegen informiert' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-white border border-emerald-200">
                  <p className="font-semibold text-emerald-800 text-sm w-28 flex-shrink-0">{item.anf}</p>
                  <p className="text-xs text-gray-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Mindestbesetzung nach DGUV" color="blue">
            <p className="text-sm text-gray-700 mb-3">Die Besetzung richtet sich nach Beckenart und Badegastzahl:</p>
            <div className="overflow-x-auto rounded-lg border border-blue-200">
              <table className="w-full text-xs">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Beckenart</th>
                    <th className="px-3 py-2 text-left">Mindestbesetzung</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { becken: 'Nichtschwimmerbecken (flach)', besetzung: '1 Aufsichtsperson je 200 m² Wasserfläche' },
                    { becken: 'Schwimmerbecken (25m / 50m)', besetzung: '1 Aufsichtsperson je 400 m² Wasserfläche' },
                    { becken: 'Sprungbecken', besetzung: 'Eigene Aufsicht, ständig besetzt' },
                    { becken: 'Rutschenauslauf', besetzung: 'Eigene Aufsichtsperson am Auslaufbecken' },
                    { becken: 'Wellenbad (Betrieb)', besetzung: 'Erhöhte Besetzung wegen erhöhter Gefahr' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                      <td className="px-3 py-2 font-medium text-gray-800">{row.becken}</td>
                      <td className="px-3 py-2 text-gray-600">{row.besetzung}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">* Genaue Werte aus DGUV Regel 107-004 und betrieblichem Aufsichtsplan entnehmen</p>
          </Section>

          <Section title="Spezielle Regelungen" color="orange">
            <div className="space-y-2">
              {[
                { gruppe: 'Schulklassen', regel: 'Lehrkraft übernimmt Aufsichtspflicht für ihre Schüler — FAB unterstützt, ist aber nicht allein verantwortlich' },
                { gruppe: 'Vereine / Sportgruppen', regel: 'Vereinsverantwortliche (Trainer, Betreuer) tragen Mitverantwortung — schriftlich festhalten' },
                { gruppe: 'Kurse (Schwimmkurs)', regel: 'Kursleiter ist für Kursteilnehmer verantwortlich während des Kurses' },
                { gruppe: 'Frühschwimmen / Leihezeiten', regel: 'Auch bei geschlossenem Betrieb muss qualifizierte Aufsicht vorhanden sein' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <p className="font-bold text-orange-800 text-sm">{item.gruppe}</p>
                  <p className="text-xs text-gray-700 mt-0.5">{item.regel}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'dokumentation' && (
        <div className="space-y-4">
          <Section title="Dokumentationspflichten im Bäderbetrieb">
            <p className="text-sm text-gray-700 mb-3">
              Eine lückenlose Dokumentation schützt Betreiber und Personal bei Haftungsfragen.
              Was nicht dokumentiert ist, gilt als nicht gemacht!
            </p>
            <div className="space-y-3">
              {[
                {
                  dok: 'Betriebstagebuch / Betriebsbuch',
                  inhalt: 'Tägliche Wassermesswerte (pH, freies Chlor, Trübung, Temperatur), Besonderheiten des Tages, Aufsichtsbesetzung',
                  pflicht: 'Täglich, mind. 3× täglich Messung',
                  icon: '📒',
                },
                {
                  dok: 'Unfallbuch / Vorkommnisbuch',
                  inhalt: 'Jeder Unfall, Erste-Hilfe-Maßnahme, Sicherheitsvorfall — auch Beinahe-Unfälle dokumentieren',
                  pflicht: 'Sofort nach Vorkommnis',
                  icon: '🩹',
                },
                {
                  dok: 'Rettungsgeräte-Kontrolle',
                  inhalt: 'Zustand von Rettungsring, Stange, Gurtretter, AED, Erste-Hilfe-Kasten — vollständig und einsatzbereit?',
                  pflicht: 'Täglich vor Betriebsbeginn',
                  icon: '🛟',
                },
                {
                  dok: 'Aufsichtsplan',
                  inhalt: 'Wer ist wann wo für welches Becken zuständig. Qualifikationsnachweis der eingesetzten Personen.',
                  pflicht: 'Schichtweise aktuell halten',
                  icon: '📋',
                },
                {
                  dok: 'Wartungs- und Prüfbuch (Technik)',
                  inhalt: 'Filterspülung, Chemikalienverbrauch, Revisionen, Reperaturen an Pumpen und Anlagen',
                  pflicht: 'Bei jedem Eingriff',
                  icon: '🔧',
                },
                {
                  dok: 'Unterweisungsnachweise',
                  inhalt: 'Schriftlicher Nachweis dass Mitarbeiter über Sicherheit, Gefahrstoffe und Erste Hilfe unterwiesen wurden',
                  pflicht: 'Jährlich + bei neuem Personal',
                  icon: '📝',
                },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{item.icon}</span>
                    <p className="font-bold text-emerald-800 text-sm">{item.dok}</p>
                    <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{item.pflicht}</span>
                  </div>
                  <p className="text-xs text-gray-600">{item.inhalt}</p>
                </div>
              ))}
            </div>
          </Section>

          <div className="p-3 rounded-xl bg-red-50 border border-red-300">
            <p className="font-bold text-red-800 text-sm mb-1">⚠️ Aufbewahrungspflicht</p>
            <p className="text-xs text-red-700">
              Betriebsbücher und Unfallberichte müssen <strong>mindestens 5 Jahre</strong> aufbewahrt werden.
              Bei Gerichtsverfahren können sie als Beweismittel angefordert werden — fehlende Dokumentation
              wird als Fahrlässigkeit gewertet!
            </p>
          </div>
        </div>
      )}

      {activeTab === 'dienstkleidung' && (
        <div className="space-y-4">
          <Section title="Dienstkleidung im Bäderbetrieb">
            <p className="text-sm text-gray-700 mb-3">
              Die Dienstkleidung hat im Schwimmbad mehrere Funktionen — sie ist nicht nur Uniform,
              sondern ein Sicherheitselement.
            </p>
            <div className="space-y-3">
              {[
                {
                  funktion: 'Erkennbarkeit',
                  detail: 'Personal muss für Badegäste sofort identifizierbar sein. Farblich deutlich von Badegästen unterscheiden (z.B. rotes Poloshirt).',
                  icon: '👁️',
                },
                {
                  funktion: 'Autorität & Respekt',
                  detail: 'Einheitliche Dienstkleidung signalisiert professionelle Aufsicht — Badegäste folgen Anweisungen eher.',
                  icon: '👮',
                },
                {
                  funktion: 'Funktionalität',
                  detail: 'Bewegungsfreiheit für Rettungseinsätze, schnell ablegbar (Schuhe!), witterungsgerecht (Freibad).',
                  icon: '🏃',
                },
                {
                  funktion: 'Hygiene & Schutz',
                  detail: 'Schutz vor Chemikalien, Schutzkleidung beim Umgang mit Chlor (Handschuhe, Schutzbrille, Kittel).',
                  icon: '🛡️',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-white border border-emerald-200">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-emerald-800 text-sm">{item.funktion}</p>
                    <p className="text-xs text-gray-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Schutzkleidung nach GefStoffV" color="orange">
            <p className="text-sm text-gray-700 mb-2">Beim Umgang mit Gefahrstoffen (Chlor, Reinigungsmittel) gilt:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { psa: 'Schutzhandschuhe', wann: 'Immer bei Chemikalien-Handling', icon: '🧤' },
                { psa: 'Schutzbrille', wann: 'Bei Spritzgefahr (Chlorgranulat, Säure)', icon: '🥽' },
                { psa: 'Schutzkittel/-schürze', wann: 'Bei Abfüllung und Dosierung', icon: '🥼' },
                { psa: 'Atemschutz', wann: 'Bei Chlorgas-Verdacht (PSA vorhanden?)', icon: '😷' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-semibold text-orange-800 text-sm">{item.psa}</p>
                  <p className="text-xs text-gray-600">{item.wann}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-300">
              <p className="text-xs text-blue-700">
                <strong>Kostenübernahme:</strong> Schutzkleidung die der Arbeitgeber vorschreibt, muss er
                auch stellen und reinigen lassen (§ 3 ArbSchG). Eigene Kosten trägt der AN nicht.
              </p>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
