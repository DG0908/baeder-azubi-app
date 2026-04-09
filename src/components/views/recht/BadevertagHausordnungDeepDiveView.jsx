import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const TABS = {
  badevertrag: { label: 'Badevertrag', icon: '🤝' },
  hausordnung: { label: 'Haus- & Badeordnung', icon: '📋' },
  pflichten: { label: 'Rechte & Pflichten', icon: '⚖️' },
  hausverbot: { label: 'Hausverbot', icon: '🚫' },
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

export default function BadevertagHausordnungDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('badevertrag');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 p-5 text-white">
        <div className="text-3xl mb-2">🤝</div>
        <h2 className="text-xl font-bold">Badevertrag & Hausordnung</h2>
        <p className="text-emerald-100 text-sm mt-1">
          Rechtsgrundlagen des Badebetriebs — Vertragsschluss, Haus- & Badeordnung, Rechte & Pflichten
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'badevertrag' && (
        <div className="space-y-4">
          <Section title="Was ist der Badevertrag?">
            <p className="text-sm text-gray-700 mb-3">
              Wenn ein Badegast ein Schwimmbad betritt und Eintritt zahlt, schließt er einen
              <strong> Badevertrag</strong> ab. Dieser ist ein <strong>Dienstleistungsvertrag</strong> gemäß BGB
              — auch wenn niemand explizit darüber spricht.
            </p>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-300">
              <p className="font-bold text-blue-800 text-sm mb-2">📌 Konkludenter Vertragsschluss</p>
              <p className="text-xs text-blue-700">
                Der Vertrag kommt <strong>durch schlüssiges Handeln</strong> zustande — nicht durch eine
                Unterschrift. Sobald der Gast das Bad betritt und Eintritt bezahlt (oder durch eine Schranke geht),
                gilt der Vertrag als geschlossen. Kein schriftlicher Vertrag nötig!
              </p>
            </div>
          </Section>

          <Section title="Vertragsparteien">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                <p className="font-bold text-emerald-800 text-sm mb-2">🏊 Badbetreiber</p>
                <ul className="text-xs text-emerald-700 space-y-1">
                  <li>• Stadt/Gemeinde als Träger</li>
                  <li>• Oder: GmbH, Verein, Privat</li>
                  <li>• Vertritt durch Geschäftsführer oder Bäderleiter</li>
                </ul>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-300">
                <p className="font-bold text-blue-800 text-sm mb-2">🧑 Badegast</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Ab 7 Jahren beschränkt geschäftsfähig</li>
                  <li>• Eltern haften für Kinder</li>
                  <li>• Bei Schulklassen: Schule/Lehrer als Verantwortliche</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Vertragsinhalt">
            <p className="text-sm text-gray-700 mb-2">Der Badevertrag regelt gegenseitige Leistungen:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white border border-emerald-200">
                <p className="font-semibold text-emerald-800 text-sm mb-2">Betreiber leistet:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✅ Zugang zum Bad</li>
                  <li>✅ Sichere Badeanlage</li>
                  <li>✅ Qualitativ einwandfreies Wasser</li>
                  <li>✅ Aufsicht (Verkehrssicherung)</li>
                  <li>✅ Sanitäranlagen, Umkleiden</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-white border border-blue-200">
                <p className="font-semibold text-blue-800 text-sm mb-2">Gast leistet:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✅ Zahlung des Eintritts</li>
                  <li>✅ Einhaltung der Hausordnung</li>
                  <li>✅ Rücksicht auf andere Gäste</li>
                  <li>✅ Weisungen des Personals befolgen</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Rechtliche Einordnung" color="blue">
            <div className="space-y-2">
              {[
                { para: '§ 611 BGB', inhalt: 'Dienstvertrag — Grundlage des Badevertrags' },
                { para: '§ 241 BGB', inhalt: 'Nebenpflichten — Rücksichtnahmepflicht beider Seiten' },
                { para: '§ 823 BGB', inhalt: 'Schadensersatz bei Verletzung — Haftung des Betreibers bei Pflichtverletzung' },
                { para: '§ 254 BGB', inhalt: 'Mitverschulden des Gastes kann Schadensersatz mindern' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <span className="font-mono font-bold text-blue-800 text-xs w-20 flex-shrink-0">{item.para}</span>
                  <p className="text-xs text-gray-600">{item.inhalt}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'hausordnung' && (
        <div className="space-y-4">
          <Section title="Die Haus- und Badeordnung">
            <p className="text-sm text-gray-700 mb-3">
              Die Haus- und Badeordnung ist eine <strong>Allgemeine Geschäftsbedingung (AGB)</strong>
              des Badbetreibers. Sie wird <strong>Bestandteil des Badevertrags</strong>, wenn sie
              vor oder beim Vertragsschluss bekannt gemacht wird (Aushang am Eingang).
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300">
              <p className="font-bold text-amber-800 text-sm mb-1">⚠️ AGB-Recht beachten!</p>
              <p className="text-xs text-amber-700">
                Als AGB darf die Hausordnung Gäste nicht unangemessen benachteiligen (§307 BGB).
                Klauseln die gegen AGB-Recht verstoßen sind unwirksam — z.B. pauschaler Haftungsausschluss
                für grobe Fahrlässigkeit des Betreibers ist NICHT zulässig.
              </p>
            </div>
          </Section>

          <Section title="Pflichtinhalte der Badeordnung">
            <p className="text-sm text-gray-700 mb-2">Folgende Regelungen sollte jede Badeordnung enthalten:</p>
            <div className="space-y-1">
              {[
                'Zutrittsregelungen (Öffnungszeiten, Altersbeschränkungen)',
                'Pflicht zur Körperhygiene (Duschen vor dem Baden)',
                'Verhaltensregeln im Becken (kein Springen, kein Drängeln)',
                'Aufsichtspflichten bei Kindern (Eltern/Begleitpersonen)',
                'Verbot von Glasflaschen, Alkohol, gefährlichen Gegenständen',
                'Regelung für Hunde / Tiere',
                'Fotografier- und Videoaufnahmeverbote',
                'Folgen bei Regelverstoß (Hausverbot)',
                'Haftungsregelungen',
                'Notfall- und Rettungsanweisungen',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Aushangpflicht & Bekanntmachung" color="blue">
            <p className="text-sm text-gray-700 mb-2">
              Die Badeordnung muss <strong>vor Vertragsschluss</strong> bekannt sein:
            </p>
            {[
              'Aushang am Eingang / Kasse gut sichtbar',
              'An Beckenrand und in Umkleiden',
              'Auf der Website des Bades',
              'Bei Sonderveranstaltungen: gesondert aushändigen',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1">
                <CheckCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-300">
              <p className="text-xs text-red-700">
                <strong>Wichtig:</strong> Wenn die Badeordnung NICHT ausgehängt ist, wird sie kein Vertragsbestandteil.
                Der Betreiber kann sich dann nicht auf ihre Regelungen berufen!
              </p>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'pflichten' && (
        <div className="space-y-4">
          <Section title="Pflichten des Badbetreibers">
            <div className="space-y-2">
              {[
                {
                  pflicht: 'Verkehrssicherungspflicht',
                  detail: 'Das Bad muss sicher sein. Rutschige Böden, defekte Geräte, fehlende Beschilderung → Haftung! Regelmäßige Kontrollen dokumentieren.',
                  dringlichkeit: 'kritisch', icon: '🛡️',
                },
                {
                  pflicht: 'Wasserqualität gewährleisten',
                  detail: 'Beckenwasser nach DIN 19643, tägliche Messungen, Aufzeichnungspflicht. Bei Unterschreitung → Badebetrieb einstellen.',
                  dringlichkeit: 'kritisch', icon: '💧',
                },
                {
                  pflicht: 'Aufsichtspflicht',
                  detail: 'Qualifiziertes Personal (FaBB), ausreichende Besetzung nach DGUV Regel 107-004, kein Aufsichtsposten unbesetzt lassen.',
                  dringlichkeit: 'kritisch', icon: '👁️',
                },
                {
                  pflicht: 'Rettungsausrüstung bereithalten',
                  detail: 'Rettungsring, Stange, Gurtretter, AED, Erste-Hilfe-Kasten — regelmäßig prüfen und dokumentieren.',
                  dringlichkeit: 'hoch', icon: '🛟',
                },
                {
                  pflicht: 'Informations- und Hinweispflicht',
                  detail: 'Gefahren kennzeichnen, Badeordnung aushängen, Nichtschwimmerbereiche markieren.',
                  dringlichkeit: 'hoch', icon: '📋',
                },
                {
                  pflicht: 'Datenschutz (DSGVO)',
                  detail: 'Videoüberwachung nur mit Hinweisschild und Rechtsgrundlage. Keine unzulässige Datenerhebung.',
                  dringlichkeit: 'mittel', icon: '📷',
                },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-xl border ${item.dringlichkeit === 'kritisch' ? 'bg-red-50 border-red-300' : item.dringlichkeit === 'hoch' ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{item.icon}</span>
                    <p className="font-bold text-gray-800 text-sm">{item.pflicht}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${item.dringlichkeit === 'kritisch' ? 'bg-red-600 text-white' : item.dringlichkeit === 'hoch' ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-white'}`}>{item.dringlichkeit}</span>
                  </div>
                  <p className="text-xs text-gray-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Pflichten des Badegastes" color="blue">
            <div className="space-y-2">
              {[
                { pflicht: 'Entgeltzahlung', detail: 'Eintrittspreis zahlen — Schwarzfahren = Erschleichen von Leistungen (§265a StGB)' },
                { pflicht: 'Hausordnung einhalten', detail: 'Verbindlich durch Vertragsschluss — Verstöße können Hausverbot auslösen' },
                { pflicht: 'Weisungen befolgen', detail: 'Anordnungen des Aufsichtspersonals sofort und vollständig folgen' },
                { pflicht: 'Aufsicht über Kinder', detail: 'Eltern/Begleitpersonen haften für ihre Kinder — können nicht auf das Bad abwälzen' },
                { pflicht: 'Schadensmeldung', detail: 'Schäden an Einrichtungen sofort melden' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <CheckCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-800 text-sm">{item.pflicht}</p>
                    <p className="text-xs text-gray-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'hausverbot' && (
        <div className="space-y-4">
          <Section title="Das Hausverbot">
            <p className="text-sm text-gray-700 mb-3">
              Der Betreiber hat als <strong>Hausrechtsinhaber</strong> das Recht, Personen vom
              Gelände zu verweisen oder dauerhaft auszuschließen. Grundlage: <strong>§ 903 BGB</strong>
              (Eigentumsrecht) bzw. allgemeines Hausrecht.
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 mb-3">
              <p className="font-bold text-amber-800 text-sm mb-1">⚠️ Gleichbehandlungsgebot!</p>
              <p className="text-xs text-amber-700">
                Ein Hausverbot darf nicht diskriminierend sein (AGG — Allgemeines Gleichbehandlungsgesetz).
                Nicht erlaubt: Hausverbot wegen Herkunft, Religion, Geschlecht, Behinderung ohne sachlichen Grund.
                Erlaubt: Wegen konkretem Fehlverhalten.
              </p>
            </div>
          </Section>

          <Section title="Gründe für ein Hausverbot">
            <div className="space-y-2">
              {[
                { grund: 'Wiederholter Verstoß gegen Badeordnung', beispiel: 'Trotz Ermahnung weiter springen, andere gefährden' },
                { grund: 'Körperverletzung / Bedrohung', beispiel: 'Angriff auf andere Gäste oder Personal' },
                { grund: 'Diebstahl / Sachbeschädigung', beispiel: 'Im Bad oder in Umkleiden' },
                { grund: 'Sexuelle Belästigung / Voyeurismus', beispiel: 'Heimliche Aufnahmen in Umkleiden' },
                { grund: 'Schwarzfahren (Erschleichen)', beispiel: 'Mehrfaches Eintreten ohne zu zahlen' },
                { grund: 'Unter Alkohol- / Drogeneinfluss', beispiel: 'Gefährdung der eigenen Sicherheit und anderer' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-white border border-red-200">
                  <XCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.grund}</p>
                    <p className="text-xs text-gray-500">{item.beispiel}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Durchsetzung des Hausverbots" color="orange">
            <div className="space-y-2">
              {[
                { schritt: '1. Sofortiges Platzverweis', detail: 'Person auffordern das Bad zu verlassen — mündlich reicht' },
                { schritt: '2. Schriftliches Hausverbot', detail: 'Dokumentieren mit Name, Datum, Grund, Dauer — dem Betroffenen aushändigen' },
                { schritt: '3. Bei Weigerung', detail: 'Polizei rufen — Hausfriedensbruch (§123 StGB) liegt vor' },
                { schritt: '4. Dokumentation', detail: 'Im Vorkommnisbuch eintragen, ggf. Strafanzeige' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start mb-2">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-orange-800 text-sm">{item.schritt}</p>
                    <p className="text-xs text-gray-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-300">
              <p className="text-xs text-blue-700">
                <strong>Wichtig für FaBB:</strong> Körperliche Gewalt zur Durchsetzung des Hausverbots ist
                grundsätzlich nicht erlaubt (außer Notwehr). Polizei rufen ist immer die richtige Lösung.
              </p>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
