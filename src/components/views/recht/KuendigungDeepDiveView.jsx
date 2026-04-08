import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const TABS = {
  ordentlich: { label: 'Ordentliche Kündigung', icon: '📄' },
  ausserordentlich: { label: 'Außerordentliche Kündigung', icon: '⚠️' },
  abmahnung: { label: 'Abmahnung', icon: '📋' },
  kuendigungsschutz: { label: 'Kündigungsschutz', icon: '🛡️' },
};

const TabChip = ({ id, tab, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
      active
        ? 'bg-emerald-600 text-white shadow'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

const FristenTabelle = ({ darkMode }) => {
  const fristen = [
    { dauer: '< 2 Jahre', frist: '2 Wochen', hinweis: 'Probezeit: 2 Wochen' },
    { dauer: '2 Jahre', frist: '1 Monat', hinweis: 'Zum Monatsende' },
    { dauer: '5 Jahre', frist: '2 Monate', hinweis: 'Zum Monatsende' },
    { dauer: '8 Jahre', frist: '3 Monate', hinweis: 'Zum Monatsende' },
    { dauer: '10 Jahre', frist: '4 Monate', hinweis: 'Zum Monatsende' },
    { dauer: '12 Jahre', frist: '5 Monate', hinweis: 'Zum Monatsende' },
    { dauer: '15 Jahre', frist: '6 Monate', hinweis: 'Zum Monatsende' },
    { dauer: '20 Jahre', frist: '7 Monate', hinweis: 'Zum Monatsende' },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-emerald-200">
      <table className="w-full text-sm">
        <thead className="bg-emerald-700 text-white">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Betriebszugehörigkeit</th>
            <th className="px-3 py-2 text-left font-semibold">Kündigungsfrist</th>
            <th className="px-3 py-2 text-left font-semibold">Termin</th>
          </tr>
        </thead>
        <tbody>
          {fristen.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-emerald-50'}>
              <td className="px-3 py-2 font-medium text-gray-800">{row.dauer}</td>
              <td className="px-3 py-2 font-bold text-emerald-700">{row.frist}</td>
              <td className="px-3 py-2 text-gray-600">{row.hinweis}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 p-2">§ 622 BGB — Längere Tarifvertragsfristen gehen vor</p>
    </div>
  );
};

export default function KuendigungDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('ordentlich');

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 p-5 text-white">
        <div className="text-3xl mb-2">⚖️</div>
        <h2 className="text-xl font-bold">Kündigung im Arbeitsrecht</h2>
        <p className="text-emerald-100 text-sm mt-1">
          Ordentliche & außerordentliche Kündigung, Abmahnung, Kündigungsschutz
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {/* ── ORDENTLICHE KÜNDIGUNG ── */}
      {activeTab === 'ordentlich' && (
        <div className="space-y-4">
          <Section title="Was ist eine ordentliche Kündigung?">
            <p className="text-sm text-gray-700 mb-3">
              Die ordentliche Kündigung beendet das Arbeitsverhältnis fristgerecht zum nächstmöglichen Termin.
              Sie muss <strong>schriftlich</strong> erfolgen (§ 623 BGB) — eine mündliche oder SMS-Kündigung ist unwirksam.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-semibold text-blue-800 text-sm mb-1">📝 Formvorschrift</p>
                <p className="text-xs text-blue-700">Schriftform zwingend (§ 623 BGB). Eigenhändige Unterschrift — kein Fax, keine E-Mail!</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                <p className="font-semibold text-orange-800 text-sm mb-1">👤 Wer kündigt?</p>
                <p className="text-xs text-orange-700">Arbeitgeber ODER Arbeitnehmer — beide Seiten können ordentlich kündigen</p>
              </div>
            </div>
          </Section>

          <Section title="Kündigungsfristen nach § 622 BGB">
            <p className="text-sm text-gray-700 mb-3">
              Die gesetzliche Kündigungsfrist hängt von der Betriebszugehörigkeit ab:
            </p>
            <FristenTabelle darkMode={darkMode} />
          </Section>

          <Section title="Gründe für eine ordentliche Kündigung">
            <div className="space-y-2">
              {[
                { icon: '👤', title: 'Personenbedingt', text: 'Dauernde Krankheit, fehlende Eignung, Führerscheinentzug — kein Verschulden des AN erforderlich', color: 'yellow' },
                { icon: '🔧', title: 'Verhaltensbedingt', text: 'Wiederholt verspätet, Arbeitsverweigerung, Diebstahl — meist Abmahnung zuerst nötig', color: 'orange' },
                { icon: '🏢', title: 'Betriebsbedingt', text: 'Stellenabbau, Umstrukturierung, Auftragsmangel — Sozialauswahl muss beachtet werden', color: 'blue' },
              ].map((item, i) => (
                <div key={i} className={`flex gap-3 p-3 rounded-lg bg-${item.color}-50 border border-${item.color}-200`}>
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className={`font-semibold text-${item.color}-800 text-sm`}>{item.title}</p>
                    <p className={`text-xs text-${item.color}-700`}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <InfoBox icon={AlertTriangle} color="amber" title="Wichtig: Betriebsrat anhören!">
            Falls ein Betriebsrat existiert, muss dieser vor jeder Kündigung angehört werden (§ 102 BetrVG).
            Eine Kündigung ohne Anhörung ist unwirksam — auch wenn der Betriebsrat zustimmen würde.
          </InfoBox>
        </div>
      )}

      {/* ── AUSSERORDENTLICHE KÜNDIGUNG ── */}
      {activeTab === 'ausserordentlich' && (
        <div className="space-y-4">
          <Section title="Außerordentliche (fristlose) Kündigung — § 626 BGB">
            <p className="text-sm text-gray-700 mb-3">
              Die fristlose Kündigung beendet das Arbeitsverhältnis <strong>sofort</strong> ohne Einhaltung
              einer Kündigungsfrist. Voraussetzung ist ein <strong>wichtiger Grund</strong>, der es unzumutbar macht,
              das Arbeitsverhältnis auch nur bis zum Ende der Frist fortzuführen.
            </p>
            <InfoBox icon={AlertTriangle} color="red" title="2-Wochen-Frist beachten!">
              Die fristlose Kündigung muss innerhalb von <strong>2 Wochen</strong> nach Bekanntwerden des Kündigungsgrundes
              ausgesprochen werden (§ 626 Abs. 2 BGB). Danach ist der Grund "verbraucht".
            </InfoBox>
          </Section>

          <Section title="Was ist ein 'wichtiger Grund'?">
            <p className="text-sm text-gray-600 mb-3">Typische Beispiele aus der Rechtsprechung:</p>
            <div className="space-y-2">
              {[
                { icon: '🔴', text: 'Diebstahl / Unterschlagung (auch geringwertig, z.B. "Emmely"-Fall)', severe: true },
                { icon: '🔴', text: 'Körperliche Angriffe auf Kollegen oder Vorgesetzte', severe: true },
                { icon: '🔴', text: 'Sexuelle Belästigung am Arbeitsplatz', severe: true },
                { icon: '🔴', text: 'Schwere Beleidigung / üble Nachrede', severe: true },
                { icon: '🟡', text: 'Beharrliche Arbeitsverweigerung (nach Abmahnung)', severe: false },
                { icon: '🟡', text: 'Vortäuschen von Arbeitsunfähigkeit', severe: false },
                { icon: '🟡', text: 'Schwere Verstöße gegen Datenschutz', severe: false },
                { icon: '🟡', text: 'Konkurrenztätigkeit ohne Erlaubnis', severe: false },
              ].map((item, i) => (
                <div key={i} className={`flex gap-2 items-start p-2 rounded-lg ${item.severe ? 'bg-red-50' : 'bg-yellow-50'}`}>
                  <span>{item.icon}</span>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Prüfungsschema bei fristloser Kündigung">
            <div className="space-y-2">
              {[
                { nr: '1', text: 'Liegt ein wichtiger Grund vor? (§ 626 Abs. 1 BGB)' },
                { nr: '2', text: 'Interessenabwägung: Ist Weiterbeschäftigung bis Fristende wirklich unzumutbar?' },
                { nr: '3', text: 'Einhaltung der 2-Wochen-Frist (§ 626 Abs. 2 BGB)' },
                { nr: '4', text: 'Schriftform (§ 623 BGB)' },
                { nr: '5', text: 'Betriebsrat anhören (§ 102 BetrVG), falls vorhanden' },
              ].map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {step.nr}
                  </span>
                  <p className="text-sm text-gray-700 pt-0.5">{step.text}</p>
                </div>
              ))}
            </div>
          </Section>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="font-semibold text-gray-800 text-sm mb-2">Ordentlich vs. Außerordentlich im Vergleich</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-bold text-blue-700 mb-1">Ordentlich</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Mit Kündigungsfrist</li>
                  <li>• Kein besonderer Grund nötig (AG-Seite: soziale Rechtfertigung)</li>
                  <li>• Auch AN kann ordentlich kündigen</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-red-700 mb-1">Außerordentlich</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Sofort, ohne Frist</li>
                  <li>• Wichtiger Grund zwingend erforderlich</li>
                  <li>• 2-Wochen-Frist ab Kenntnis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ABMAHNUNG ── */}
      {activeTab === 'abmahnung' && (
        <div className="space-y-4">
          <Section title="Funktion der Abmahnung">
            <p className="text-sm text-gray-700 mb-3">
              Die Abmahnung ist eine formelle Rüge des Arbeitgebers bei Pflichtverletzungen des Arbeitnehmers.
              Sie hat drei Funktionen:
            </p>
            <div className="space-y-2">
              {[
                { icon: '👁️', title: 'Rügefunktion', text: 'Dokumentiert konkret, was der AN falsch gemacht hat' },
                { icon: '⚠️', title: 'Warnfunktion', text: 'Macht dem AN klar: beim nächsten Mal droht Kündigung' },
                { icon: '🛡️', title: 'Voraussetzungsfunktion', text: 'Bei verhaltensbedingter Kündigung meist zwingend nötig' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-emerald-800 text-sm">{item.title}</p>
                    <p className="text-xs text-emerald-700">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Pflichtinhalt einer wirksamen Abmahnung">
            <div className="space-y-2">
              {[
                'Genaue Beschreibung des Fehlverhaltens (Datum, Uhrzeit, Ort)',
                'Hinweis, dass dieses Verhalten eine Vertragsverletzung darstellt',
                'Aufforderung, das Verhalten sofort zu ändern',
                'Androhung der Kündigung bei Wiederholung',
              ].map((punkt, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{punkt}</p>
                </div>
              ))}
            </div>
            <InfoBox icon={Info} color="blue" title="Schriftform empfohlen">
              Die Abmahnung muss nicht zwingend schriftlich sein, aber aus Beweisgründen immer schriftlich ausstellen
              und Empfang quittieren lassen. Eine Kopie in die Personalakte!
            </InfoBox>
          </Section>

          <Section title="Wann ist keine Abmahnung nötig?">
            <p className="text-sm text-gray-600 mb-2">
              Bei schwerwiegenden Pflichtverletzungen kann direkt fristlos gekündigt werden:
            </p>
            <div className="space-y-1">
              {[
                'Diebstahl / Betrug zum Nachteil des Arbeitgebers',
                'Tätliche Angriffe auf Kollegen',
                'Wenn klar ist, dass eine Abmahnung nichts ändern würde',
                'Strafbare Handlungen im Betrieb',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Abmahnung aus der Personalakte entfernen">
            <p className="text-sm text-gray-700 mb-2">
              Nach einer angemessenen Zeit (in der Regel <strong>2–3 Jahre</strong> ohne Wiederholung) verliert
              die Abmahnung ihre Wirkung. Der AN kann dann verlangen, dass sie aus der Akte entfernt wird.
              Eine "verbrauchte" Abmahnung kann nicht mehr als Grundlage für eine Kündigung dienen.
            </p>
          </Section>
        </div>
      )}

      {/* ── KÜNDIGUNGSSCHUTZ ── */}
      {activeTab === 'kuendigungsschutz' && (
        <div className="space-y-4">
          <Section title="Kündigungsschutzgesetz (KSchG)">
            <p className="text-sm text-gray-700 mb-3">
              Das KSchG schützt Arbeitnehmer vor sozial ungerechtfertigten Kündigungen.
              Es gilt jedoch <strong>nur unter bestimmten Bedingungen</strong>:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="font-semibold text-green-800 text-sm mb-2">✅ KSchG gilt wenn:</p>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Betrieb hat &gt; 10 Mitarbeiter</li>
                  <li>• AN ist &gt; 6 Monate beschäftigt (Wartezeit)</li>
                  <li>• Kein befristeter Vertrag</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="font-semibold text-red-800 text-sm mb-2">❌ KSchG gilt NICHT wenn:</p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Betrieb hat ≤ 10 Mitarbeiter</li>
                  <li>• Noch in der Probezeit (&lt; 6 Monate)</li>
                  <li>• Befristetes Arbeitsverhältnis</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Kündigungsschutzklage — 3-Wochen-Frist!">
            <InfoBox icon={AlertTriangle} color="red" title="Achtung: Fristversäumnis = Kündigung wirksam!">
              Nach Erhalt der Kündigung hat der AN nur <strong>3 Wochen</strong> Zeit, Klage beim Arbeitsgericht einzureichen
              (§ 4 KSchG). Wer diese Frist versäumt, kann die Kündigung nicht mehr anfechten — egal wie unwirksam sie ist!
            </InfoBox>
            <div className="space-y-2">
              {[
                { step: '1', text: 'Kündigung erhalten → Frist läuft sofort ab!' },
                { step: '2', text: 'Innerhalb von 3 Wochen: Klage beim zuständigen Arbeitsgericht einreichen' },
                { step: '3', text: 'Gütetermin: Arbeitsgericht versucht eine Einigung (oft Abfindung)' },
                { step: '4', text: 'Kammertermin: Wenn keine Einigung → Urteil' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </span>
                  <p className="text-sm text-gray-700 pt-0.5">{item.text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Sozialauswahl bei betriebsbedingter Kündigung">
            <p className="text-sm text-gray-700 mb-3">
              Wenn mehrere vergleichbare AN infrage kommen, muss der AG die "Sozialauswahl" beachten
              (§ 1 Abs. 3 KSchG). Er muss die sozial schutzwürdigsten AN bevorzugen.
            </p>
            <p className="text-sm font-semibold text-gray-700 mb-2">Kriterien der Sozialauswahl:</p>
            <div className="space-y-2">
              {[
                { icon: '📅', text: 'Betriebszugehörigkeit (längere schützt stärker)' },
                { icon: '🎂', text: 'Lebensalter (ältere AN haben schlechtere Chancen am Markt)' },
                { icon: '👨‍👩‍👧', text: 'Unterhaltspflichten (Kinder, Ehepartner)' },
                { icon: '♿', text: 'Schwerbehinderung (besonderer Schutz)' },
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start p-2 rounded-lg bg-teal-50">
                  <span>{item.icon}</span>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Besonderer Kündigungsschutz">
            <p className="text-sm text-gray-600 mb-2">
              Einige Personengruppen haben zusätzlichen Schutz — Kündigung meist nur mit Zustimmung von Behörden:
            </p>
            <div className="space-y-1">
              {[
                { icon: '🤰', text: 'Schwangere & Mütter (MuSchG) — ab Bekanntgabe bis 4 Monate nach Geburt' },
                { icon: '🏥', text: 'Elternzeit (BEEG) — während der gesamten Elternzeit' },
                { icon: '♿', text: 'Schwerbehinderte (SGB IX) — Zustimmung Integrationsamt nötig' },
                { icon: '🤝', text: 'Betriebsratsmitglieder — nur außerordentlich möglich (§ 15 KSchG)' },
                { icon: '🎓', text: 'Auszubildende — nach Probezeit nur aus wichtigem Grund (§ 22 BBiG)' },
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="text-base">{item.icon}</span>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Abfindung — gibt es einen Anspruch?">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Nein!</strong> Es gibt grundsätzlich keinen gesetzlichen Anspruch auf eine Abfindung.
              Sie entsteht nur durch:
            </p>
            <div className="space-y-1">
              {[
                'Einvernehmlichen Aufhebungsvertrag',
                'Gerichtlichen Vergleich (Gütetermin beim Arbeitsgericht)',
                'Tarifvertrag oder Betriebsvereinbarung',
                '§ 1a KSchG: AG bietet Abfindung an, AN klagt nicht (½ Monatsgehalt × Beschäftigungsjahre)',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-emerald-600 font-bold">→</span>
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
