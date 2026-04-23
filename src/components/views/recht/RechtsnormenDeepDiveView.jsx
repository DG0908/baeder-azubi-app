import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const TABS = {
  normarten: { label: 'Arten von Rechtsnormen', icon: '📜' },
  hierarchie: { label: 'Normenhierarchie', icon: '🏛️' },
  eu: { label: 'EU-Recht', icon: '🇪🇺' },
  gerichte: { label: 'Gerichtssystem', icon: '⚖️' },
  öffentlich: { label: 'Öff. Recht vs. Zivilrecht', icon: '🔀' },
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

export default function RechtsnormenDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('normarten');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 p-5 text-white">
        <div className="text-3xl mb-2">📜</div>
        <h2 className="text-xl font-bold">Rechtsnormen & Rechtsaufbau</h2>
        <p className="text-emerald-100 text-sm mt-1">
          Normenhierarchie, EU-Recht, Gerichtssystem — Grundlagen für den Bäderbetrieb
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'normarten' && (
        <div className="space-y-4">
          <Section title="Was sind Rechtsnormen?">
            <p className="text-sm text-gray-700 mb-3">
              Rechtsnormen sind verbindliche Regeln, die vom Staat gesetzt werden und für alle gelten.
              Im Bäderbetrieb begegnen dir täglich verschiedene Normenarten:
            </p>
            <div className="space-y-3">
              {[
                {
                  art: 'Verfassung / Grundgesetz (GG)',
                  beschr: 'Höchste Rechtsebene — alle anderen Gesetze müssen damit vereinbar sein. Art. 2 GG (Körperliche Unversehrtheit) ist z.B. Grundlage der Schutzpflichten im Bad.',
                  icon: '🏛️', color: 'purple',
                },
                {
                  art: 'Formelle Gesetze',
                  beschr: 'Vom Parlament beschlossen (Bundestag/Landtag). Beispiele: BGB, StGB, JArbSchG, ArbSchG. Bindend für alle.',
                  icon: '📋', color: 'blue',
                },
                {
                  art: 'Rechtsverordnungen (RVO)',
                  beschr: 'Von Regierung oder Ministerium erlassen — ohne Parlamentsabstimmung, aber auf Grundlage eines Gesetzes. Beispiel: Bäderhygieneverordnung, DIN-Normen (technisch).',
                  icon: '📄', color: 'teal',
                },
                {
                  art: 'Satzungen',
                  beschr: 'Von Körperschaften des öffentlichen Rechts (Kommunen, Berufsgenossenschaften). Beispiel: Gebührensatzung für das Stadtbad, DGUV-Vorschriften.',
                  icon: '🏢', color: 'emerald',
                },
                {
                  art: 'Verwaltungsvorschriften',
                  beschr: 'Interne Regelungen für Behörden. Nicht direkt für Bürger bindend, aber Behörden müssen sich daran halten. Beispiel: Erlass zur Badeaufsicht.',
                  icon: '📁', color: 'gray',
                },
                {
                  art: 'Dienstanweisungen',
                  beschr: 'Interne Regelungen des Arbeitgebers. Bindend für Mitarbeiter. Beispiel: Aufsichtsanweisung im Schwimmbad — wer, wo, wann Aufsicht führt.',
                  icon: '📝', color: 'orange',
                },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-xl bg-${item.color}-50 border border-${item.color}-200`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{item.icon}</span>
                    <p className={`font-bold text-${item.color}-800 text-sm`}>{item.art}</p>
                  </div>
                  <p className="text-xs text-gray-600">{item.beschr}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'hierarchie' && (
        <div className="space-y-4">
          <Section title="Normenhierarchie — der Stufenbau der Rechtsordnung">
            <p className="text-sm text-gray-700 mb-3">
              Niedrigere Normen dürfen höheren nicht widersprechen. Bei Widerspruch gilt immer die höhere Norm.
            </p>
            <div className="space-y-2">
              {[
                { stufe: '1', norm: 'EU-Recht (Primärrecht)', beispiel: 'EU-Verträge, EU-Grundrechtecharta', width: 'w-full', color: 'bg-purple-600' },
                { stufe: '2', norm: 'Grundgesetz (GG)', beispiel: 'Art. 1–20 GG — Grundrechte', width: 'w-11/12', color: 'bg-blue-600' },
                { stufe: '3', norm: 'Bundesgesetze', beispiel: 'BGB, StGB, ArbSchG, SGB...', width: 'w-10/12', color: 'bg-teal-600' },
                { stufe: '4', norm: 'Bundesrechtsverordnungen', beispiel: 'Arbeitsstättenverordnung, TRBA...', width: 'w-9/12', color: 'bg-emerald-600' },
                { stufe: '5', norm: 'Landesgesetze', beispiel: 'Landesbauordnung, GO NRW...', width: 'w-8/12', color: 'bg-green-600' },
                { stufe: '6', norm: 'Landesrechtsverordnungen', beispiel: 'Bäderhygieneverordnung NRW', width: 'w-7/12', color: 'bg-yellow-600' },
                { stufe: '7', norm: 'Satzungen (Kommune/BG)', beispiel: 'DGUV-Vorschriften, Gebührensatzung', width: 'w-6/12', color: 'bg-orange-600' },
                { stufe: '8', norm: 'Dienstanweisungen', beispiel: 'Aufsichtsplan, Betriebsanweisungen', width: 'w-5/12', color: 'bg-red-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-gray-300 text-gray-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{item.stufe}</span>
                  <div className="flex-1">
                    <div className={`${item.color} text-white px-3 py-1.5 rounded-lg text-xs font-bold ${item.width}`}>
                      {item.norm}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 ml-1">{item.beispiel}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Für den Bäderbetrieb relevante Normen" color="blue">
            <div className="space-y-1">
              {[
                { norm: 'DIN 19643', beschr: 'Aufbereitung von Schwimm- und Badebeckenwasser' },
                { norm: 'DIN EN ISO 7010', beschr: 'Sicherheitszeichen und Beschilderung' },
                { norm: 'DGUV Vorschrift 1', beschr: 'Grundsätze der Prävention (Unfallverhütung)' },
                { norm: 'DGUV Regel 107-004', beschr: 'Bäder (früher BGR/GUV-R 1/461)' },
                { norm: 'ASR A1.3', beschr: 'Arbeitsstättenregel: Sicherheits- und Gesundheitsschutzkennzeichnung' },
                { norm: 'GefStoffV', beschr: 'Gefahrstoffverordnung — für Chlor, Reinigungsmittel' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <span className="font-mono font-bold text-blue-800 text-xs w-28 flex-shrink-0">{item.norm}</span>
                  <p className="text-xs text-gray-600">{item.beschr}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'eu' && (
        <div className="space-y-4">
          <Section title="EU-Recht und seine Wirkung">
            <p className="text-sm text-gray-700 mb-3">
              EU-Recht hat Vorrang vor nationalem Recht. Es gibt verschiedene Arten:
            </p>
            <div className="space-y-3">
              {[
                {
                  typ: 'EU-Verordnung',
                  wirkung: 'Gilt direkt in allen Mitgliedsstaaten — kein nationales Gesetz nötig',
                  beispiel: 'CLP-Verordnung (GHS-Kennzeichnung von Chemikalien), DSGVO',
                  icon: '⚡',
                  color: 'purple',
                },
                {
                  typ: 'EU-Richtlinie',
                  wirkung: 'Muss von jedem Mitgliedsstaat in nationales Recht umgesetzt werden (Frist: meist 2 Jahre)',
                  beispiel: 'Arbeitsschutzrahmenrichtlinie → deutsches ArbSchG',
                  icon: '📋',
                  color: 'blue',
                },
                {
                  typ: 'EU-Beschluss',
                  wirkung: 'Bindend für bestimmte Adressaten (Staaten, Unternehmen, Personen)',
                  beispiel: 'Staatshilfen, Wettbewerbsrecht',
                  icon: '📌',
                  color: 'teal',
                },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl bg-${item.color}-50 border border-${item.color}-200`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{item.icon}</span>
                    <p className={`font-bold text-${item.color}-800 text-sm`}>{item.typ}</p>
                  </div>
                  <p className="text-xs text-gray-700 mb-1"><strong>Wirkung:</strong> {item.wirkung}</p>
                  <p className="text-xs text-gray-500"><strong>Beispiel:</strong> {item.beispiel}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="EU-Recht im Bäderbetrieb" color="blue">
            <div className="space-y-2">
              {[
                { eu: 'CLP-Verordnung (EG) 1272/2008', dt: 'GHS-Kennzeichnung aller Chemikalien — direkt anwendbar' },
                { eu: 'Arbeitsschutz-Rahmenrichtlinie 89/391/EWG', dt: '→ Deutsches Arbeitsschutzgesetz (ArbSchG)' },
                { eu: 'Biozidprodukte-Verordnung (EU) 528/2012', dt: 'Desinfektionsmittel-Zulassung — direkt anwendbar' },
                { eu: 'DSGVO (EU) 2016/679', dt: 'Datenschutz — Videoüberwachung im Bad!' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-white border border-blue-200">
                  <p className="font-semibold text-blue-800 text-xs">🇪🇺 {item.eu}</p>
                  <p className="text-xs text-gray-600 mt-0.5">→ {item.dt}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'gerichte' && (
        <div className="space-y-4">
          <Section title="Das Gerichtssystem in Deutschland">
            <p className="text-sm text-gray-700 mb-3">Deutschland hat fünf Gerichtsbarkeiten:</p>
            <div className="space-y-3">
              {[
                {
                  zweig: 'Ordentliche Gerichtsbarkeit',
                  instanzen: 'Amtsgericht → Landgericht → Oberlandesgericht → Bundesgerichtshof (BGH)',
                  zuständig: 'Zivilrecht (Schadensersatz, Verträge) + Strafrecht',
                  bad: 'Schadenersatzklage nach Badeunfall, Strafverfolgung bei §323c',
                  color: 'blue', icon: '⚖️',
                },
                {
                  zweig: 'Arbeitsgerichtsbarkeit',
                  instanzen: 'Arbeitsgericht → Landesarbeitsgericht → Bundesarbeitsgericht (BAG)',
                  zuständig: 'Arbeitsstreitigkeiten (Kündigung, Lohn, Urlaub)',
                  bad: 'Kündigungsschutzklage, Lohnstreit im Bäderbetrieb',
                  color: 'orange', icon: '🏢',
                },
                {
                  zweig: 'Verwaltungsgerichtsbarkeit',
                  instanzen: 'Verwaltungsgericht → OVG/VGH → Bundesverwaltungsgericht (BVerwG)',
                  zuständig: 'Streit mit Behörden (öffentliches Recht)',
                  bad: 'Klage gegen Bäderschließung, Gewerbeaufsicht-Bescheide',
                  color: 'teal', icon: '🏛️',
                },
                {
                  zweig: 'Sozialgerichtsbarkeit',
                  instanzen: 'Sozialgericht → LSG → Bundessozialgericht (BSG)',
                  zuständig: 'Sozialversicherungsrecht',
                  bad: 'Streit mit BG über Arbeitsunfall-Anerkennung',
                  color: 'purple', icon: '🏥',
                },
                {
                  zweig: 'Finanzgerichtsbarkeit',
                  instanzen: 'Finanzgericht → Bundesfinanzhof (BFH)',
                  zuständig: 'Steuerrecht',
                  bad: 'Gewerbesteuerstreit kommunaler Bäderbetriebe',
                  color: 'yellow', icon: '💶',
                },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-xl bg-${item.color}-50 border border-${item.color}-200`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span>{item.icon}</span>
                    <p className={`font-bold text-${item.color}-800 text-sm`}>{item.zweig}</p>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">📍 {item.instanzen}</p>
                  <p className="text-xs text-gray-600 mb-1">Zuständig für: {item.zuständig}</p>
                  <p className={`text-xs font-medium text-${item.color}-700`}>Im Bad: {item.bad}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Verfassungsgerichte" color="purple">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                <p className="font-bold text-purple-800 text-sm">Bundesverfassungsgericht</p>
                <p className="text-xs text-gray-600 mt-1">Karlsruhe — prüft Bundesgesetze auf Vereinbarkeit mit dem GG. Höchstes deutsches Gericht.</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-bold text-blue-800 text-sm">Europäischer Gerichtshof (EuGH)</p>
                <p className="text-xs text-gray-600 mt-1">Luxemburg — legt EU-Recht aus. Entscheidungen bindend für alle Mitgliedsstaaten.</p>
              </div>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'öffentlich' && (
        <div className="space-y-4">
          <Section title="Öffentliches Recht vs. Zivilrecht">
            <p className="text-sm text-gray-700 mb-3">
              Eine der wichtigsten Grundunterscheidungen im Recht:
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-300">
                <p className="font-bold text-blue-800 text-sm mb-2">⚖️ Öffentliches Recht</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Staat ↔ Bürger</li>
                  <li>• Über-/Unterordnung</li>
                  <li>• Zwang möglich</li>
                  <li>• Verwaltungsgericht</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2 font-medium">Strafrecht, Ordnungsrecht, Baurecht, Verwaltungsrecht</p>
              </div>
              <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-300">
                <p className="font-bold text-orange-800 text-sm mb-2">🤝 Zivilrecht (Privatrecht)</p>
                <ul className="text-xs text-orange-700 space-y-1">
                  <li>• Bürger ↔ Bürger</li>
                  <li>• Gleichordnung</li>
                  <li>• Vertragsfreiheit</li>
                  <li>• Ordentliches Gericht</li>
                </ul>
                <p className="text-xs text-orange-600 mt-2 font-medium">BGB, Vertragsrecht, Schadensersatz, Arbeitsrecht</p>
              </div>
            </div>
          </Section>

          <Section title="Beispiele aus dem Bäderbetrieb" color="teal">
            <div className="space-y-2">
              {[
                { situation: 'Badegast verletzt sich durch defekten Beckenrand', recht: 'Zivilrecht', details: '§823 BGB — Schadensersatzklage gegen Betreiber', icon: '🩹' },
                { situation: 'Badegast verletzt anderen Gast absichtlich', recht: 'Öffentl. Recht', details: '§223 StGB — Staatsanwaltschaft ermittelt', icon: '👊' },
                { situation: 'Gesundheitsamt schließt das Bad', recht: 'Öffentl. Recht', details: 'Verwaltungsakt — Klage beim Verwaltungsgericht', icon: '🏥' },
                { situation: 'Badegast zahlt Eintritt nicht', recht: 'Zivilrecht', details: 'Badevertrag — Mahnverfahren, Amtsgericht', icon: '💶' },
                { situation: 'FAB wird ungerechtfertigt entlassen', recht: 'Zivilrecht (Arbeitsrecht)', details: 'Kündigungsschutzklage — Arbeitsgericht', icon: '📋' },
                { situation: 'FAB leistet keine Hilfe bei Notfall', recht: 'Öffentl. Recht', details: '§323c StGB — Strafverfolgung', icon: '🚨' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-white border border-teal-200">
                  <div className="flex items-start gap-2 mb-1">
                    <span>{item.icon}</span>
                    <p className="font-semibold text-gray-800 text-sm">{item.situation}</p>
                  </div>
                  <div className="flex gap-2 ml-6">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.recht.includes('Zivilrecht') ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.recht}
                    </span>
                    <p className="text-xs text-gray-600">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
