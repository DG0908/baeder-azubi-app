import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const TABS = {
  überblick: { label: 'Die 5 Säulen', icon: '🏛️' },
  kranken: { label: 'Kranken & Pflege', icon: '🏥' },
  rente: { label: 'Rente & Unfall', icon: '🦺' },
  arbeit: { label: 'Arbeitslosigkeit', icon: '💼' },
  beiträge: { label: 'Beiträge & Pflicht', icon: '💶' },
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

const SäuleCard = ({ nr, name, träger, leistung, beitrag, icon, color }) => (
  <div className={`p-4 rounded-xl border-2 border-${color}-300 bg-${color}-50 mb-3`}>
    <div className="flex items-center gap-3 mb-2">
      <span className={`w-8 h-8 rounded-full bg-${color}-600 text-white font-bold flex items-center justify-center text-sm`}>{nr}</span>
      <div>
        <span className="text-lg">{icon}</span>
        <span className={`font-bold text-${color}-800 ml-1`}>{name}</span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <p className="font-semibold text-gray-600 mb-0.5">Träger</p>
        <p className="text-gray-800">{träger}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-600 mb-0.5">Beitrag (ca.)</p>
        <p className="font-bold text-gray-800">{beitrag}</p>
      </div>
      <div className="col-span-2">
        <p className="font-semibold text-gray-600 mb-0.5">Wichtigste Leistungen</p>
        <p className="text-gray-700">{leistung}</p>
      </div>
    </div>
  </div>
);

export default function SozialversicherungDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('überblick');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 p-5 text-white">
        <div className="text-3xl mb-2">🛡️</div>
        <h2 className="text-xl font-bold">Sozialversicherung</h2>
        <p className="text-emerald-100 text-sm mt-1">
          Die 5 Säulen des deutschen Sozialversicherungssystems
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'überblick' && (
        <div className="space-y-4">
          <Section title="Das Sozialversicherungssystem">
            <p className="text-sm text-gray-700 mb-3">
              Deutschland hat ein <strong>Bismarck'sches Sozialversicherungssystem</strong> — aufgebaut
              Ende des 19. Jahrhunderts. Es beruht auf dem <strong>Solidarprinzip</strong>:
              Alle zahlen ein, jeder bekommt im Bedarfsfall Leistungen — unabhängig vom persönlichen
              Risiko. Die Beiträge werden zwischen Arbeitgeber und Arbeitnehmer <strong>je zur Hälfte</strong> geteilt.
            </p>
            <InfoBox icon={Info} color="emerald" title="Solidar- vs. Äquivalenzprinzip">
              <strong>Solidarprinzip:</strong> Gleiche Leistung für alle, egal wie viel man einzahlt (z.B. GKV).<br />
              <strong>Äquivalenzprinzip:</strong> Leistung entspricht den Einzahlungen (z.B. Rentenversicherung).
            </InfoBox>
          </Section>

          <SäuleCard nr="1" icon="🏥" name="Krankenversicherung" color="blue"
            träger="Gesetzliche Krankenkassen (AOK, TK, DAK...)"
            leistung="Arztbesuche, Krankenhausbehandlung, Medikamente, Krankengeld ab 7. Woche"
            beitrag="14,6 % + Zusatzbeitrag (ca. 1–2 %)" />

          <SäuleCard nr="2" icon="👴" name="Rentenversicherung" color="purple"
            träger="Deutsche Rentenversicherung (DRV)"
            leistung="Altersrente, Erwerbsminderungsrente, Rehabilitation, Hinterbliebenenrente"
            beitrag="18,6 % (je 9,3 % AG/AN)" />

          <SäuleCard nr="3" icon="🤕" name="Unfallversicherung" color="orange"
            träger="Berufsgenossenschaften (BG) / Unfallkassen"
            leistung="Arbeitsunfall, Berufskrankheit, Reha, Verletztenrente"
            beitrag="Nur AG zahlt! (ca. 1,3 % je nach BG)" />

          <SäuleCard nr="4" icon="💼" name="Arbeitslosenversicherung" color="yellow"
            träger="Bundesagentur für Arbeit (BA)"
            leistung="Arbeitslosengeld I (60/67 % des Nettolohns), Weiterbildung, Kurzarbeitergeld"
            beitrag="2,6 % (je 1,3 % AG/AN)" />

          <SäuleCard nr="5" icon="🧓" name="Pflegeversicherung" color="teal"
            träger="Pflegekassen (bei den Krankenkassen)"
            leistung="Pflegegeld, Pflegesachleistungen, Heimunterbringung (Pflegegrade 1–5)"
            beitrag="3,4 % (+ 0,6 % für Kinderlose)" />
        </div>
      )}

      {activeTab === 'kranken' && (
        <div className="space-y-4">
          <Section title="Gesetzliche Krankenversicherung (GKV)" color="blue">
            <p className="text-sm text-gray-700 mb-3">
              Die GKV ist für Arbeitnehmer bis zur <strong>Jahresarbeitsentgeltgrenze (JAEG)</strong>
              Pflicht. 2024 lag diese bei 69.300 € brutto/Jahr. Wer mehr verdient, kann in die
              private Krankenversicherung (PKV) wechseln.
            </p>
            <div className="space-y-2">
              {[
                { icon: '👩‍⚕️', text: 'Kassenärztliche Behandlung — ohne Zuzahlung zur ärztlichen Grundversorgung' },
                { icon: '🏥', text: 'Krankenhausbehandlung (10 € Zuzahlung/Tag, max. 28 Tage/Jahr)' },
                { icon: '💊', text: 'Medikamente (i.d.R. 10 € Zuzahlung, max. 2 % des Bruttoeinkommens/Jahr)' },
                { icon: '💸', text: 'Krankengeld: ab 7. Krankheitswoche 70 % des Bruttogehalts (max. 90 % Netto)' },
                { icon: '👶', text: 'Mutterschaftsgeld & Familienmitversicherung (kostenlos für Ehepartner/Kinder)' },
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start p-2 rounded-lg bg-blue-50">
                  <span>{item.icon}</span>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Lohnfortzahlung im Krankheitsfall" color="blue">
            <p className="text-sm text-gray-700 mb-2">
              Bei Krankheit gilt die <strong>Entgeltfortzahlungspflicht (EFZG)</strong>:
            </p>
            <div className="space-y-2">
              {[
                { zeitraum: 'Woche 1–6', zahler: 'Arbeitgeber', betrag: '100 % des Gehalts', icon: '👔' },
                { zeitraum: 'Ab Woche 7', zahler: 'Krankenkasse', betrag: 'Krankengeld (70 % brutto)', icon: '🏥' },
                { zeitraum: 'Max. 78 Wochen', zahler: 'Krankenkasse', betrag: 'Innerhalb von 3 Jahren je Krankheit', icon: '📅' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-center p-3 rounded-lg bg-white border border-blue-200">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-blue-800 text-sm">{item.zeitraum}: {item.zahler}</p>
                    <p className="text-xs text-gray-600">{item.betrag}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Pflegeversicherung (PV)" color="teal">
            <p className="text-sm text-gray-700 mb-3">
              Die Pflegeversicherung ist an die Krankenversicherung geknüpft. Wer GKV ist,
              ist automatisch in der sozialen Pflegeversicherung. Es gibt <strong>5 Pflegegrade</strong>:
            </p>
            <div className="space-y-1">
              {[
                { grad: 'Pflegegrad 1', beschr: 'Geringe Beeinträchtigung der Selbstständigkeit' },
                { grad: 'Pflegegrad 2', beschr: 'Erhebliche Beeinträchtigung' },
                { grad: 'Pflegegrad 3', beschr: 'Schwere Beeinträchtigung' },
                { grad: 'Pflegegrad 4', beschr: 'Schwerste Beeinträchtigung' },
                { grad: 'Pflegegrad 5', beschr: 'Schwerste Beeinträchtigung + besondere Anforderungen' },
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-center p-2 rounded-lg bg-teal-50 border border-teal-100">
                  <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${
                    i < 2 ? 'bg-green-500' : i < 4 ? 'bg-orange-500' : 'bg-red-600'
                  }`}>{item.grad}</span>
                  <p className="text-xs text-gray-700">{item.beschr}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'rente' && (
        <div className="space-y-4">
          <Section title="Gesetzliche Rentenversicherung (GRV)" color="purple">
            <p className="text-sm text-gray-700 mb-3">
              Die Rentenversicherung funktioniert nach dem <strong>Umlageverfahren</strong>:
              Die heutigen Beitragszahler finanzieren die heutigen Rentner — kein Kapitalstock.
            </p>
            <div className="space-y-2">
              {[
                { typ: 'Altersrente', text: 'Regelaltersgrenze: 67 Jahre (Jahrgang ab 1964)', icon: '👴' },
                { typ: 'Frühzeitige Rente', text: 'Ab 63 mit 45 Beitragsjahren (Abschläge möglich)', icon: '⏰' },
                { typ: 'Erwerbsminderungsrente', text: 'Bei dauerhafter Arbeitsunfähigkeit (< 3h/Tag)', icon: '🤕' },
                { typ: 'Hinterbliebenenrente', text: 'Witwen-/Witwerrente: 55 % der Rente des Verstorbenen', icon: '🙏' },
                { typ: 'Rehabilitation', text: '"Reha vor Rente" — Wiedereingliederung in den Arbeitsmarkt', icon: '🏃' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-purple-50">
                  <span>{item.icon}</span>
                  <div>
                    <p className="font-semibold text-purple-800 text-sm">{item.typ}</p>
                    <p className="text-xs text-gray-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Unfallversicherung — Berufsgenossenschaft" color="orange">
            <p className="text-sm text-gray-700 mb-3">
              Die Unfallversicherung ist die einzige Säule, die <strong>nur der Arbeitgeber</strong> bezahlt.
              Träger sind die <strong>Berufsgenossenschaften (BG)</strong> — für Bäder zuständig ist die
              <strong> BG ETEM</strong> (Energie Textil Elektro Medienerzeugnisse) oder regional die
              <strong> VBG</strong> bzw. kommunale <strong>Unfallkassen</strong>.
            </p>
            <div className="space-y-2">
              {[
                { titel: 'Arbeitsunfall', text: 'Unfall auf dem Betriebsgelände oder auf dem Weg zur/von der Arbeit', icon: '🤕' },
                { titel: 'Berufskrankheit', text: 'Krankheit durch typische Berufsbelastung (z.B. Chlorschäden bei FaBB)', icon: '🧪' },
                { titel: 'Wegeunfall', text: 'Auch Unfall auf direktem Arbeitsweg ist versichert', icon: '🚗' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-orange-800 text-sm">{item.titel}</p>
                    <p className="text-xs text-gray-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <InfoBox icon={CheckCircle} color="emerald" title="Meldepflicht des Arbeitgebers">
              Jeder Arbeitsunfall mit mehr als 3 Tagen Arbeitsunfähigkeit muss der BG gemeldet werden.
              Als FaBB musst du Unfälle im Bad sofort dem Vorgesetzten melden — der meldet an die BG.
            </InfoBox>
          </Section>
        </div>
      )}

      {activeTab === 'arbeit' && (
        <div className="space-y-4">
          <Section title="Arbeitslosenversicherung (ALV)" color="yellow">
            <p className="text-sm text-gray-700 mb-3">
              Träger ist die <strong>Bundesagentur für Arbeit (BA)</strong> mit Sitz in Nürnberg.
              Beiträge: 2,6 % des Bruttogehalts (je 1,3 % AG/AN).
            </p>
            <div className="space-y-2">
              {[
                {
                  leistung: 'Arbeitslosengeld I (ALG I)',
                  text: '60 % des letzten Nettogehalts (67 % mit Kind). Voraussetzung: mind. 12 Monate sozialversicherungspflichtig in den letzten 30 Monaten (Anwartschaftszeit).',
                  duration: 'Dauer: 6–24 Monate je nach Alter und Versicherungszeit',
                },
                {
                  leistung: 'Kurzarbeitergeld (KUG)',
                  text: '60 % (67 % mit Kind) für ausgefallene Arbeitsstunden. AG beantragt es — verhindert Entlassungen bei Auftragsrückgang.',
                  duration: 'Max. 24 Monate',
                },
                {
                  leistung: 'Weiterbildungsförderung',
                  text: 'Bildungsgutscheine, Umschulungsmaßnahmen, AVGS (Aktivierungs- und Vermittlungsgutschein)',
                  duration: 'Während der Arbeitslosigkeit',
                },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <p className="font-bold text-yellow-800 text-sm mb-1">{item.leistung}</p>
                  <p className="text-xs text-gray-700 mb-1">{item.text}</p>
                  <p className="text-xs font-medium text-yellow-700">⏱ {item.duration}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Arbeitslosengeld II → Bürgergeld" color="yellow">
            <p className="text-sm text-gray-700 mb-2">
              Das frühere <strong>ALG II ("Hartz IV")</strong> wurde 2023 durch das
              <strong> Bürgergeld</strong> ersetzt. Es ist <strong>keine Versicherungsleistung</strong>,
              sondern eine steuerfinanzierte <strong>Grundsicherung</strong> für Bedürftige.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                <p className="font-semibold text-orange-800 text-sm mb-1">ALG I</p>
                <p className="text-xs text-orange-700">Versicherungsleistung, einkommensabhängig, zeitlich begrenzt</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="font-semibold text-red-800 text-sm mb-1">Bürgergeld</p>
                <p className="text-xs text-red-700">Grundsicherung (Steuer), Bedürftigkeitsprüfung, unbegrenzt</p>
              </div>
            </div>
          </Section>

          <InfoBox icon={AlertTriangle} color="red" title="Sperrzeit bei selbst verursachter Arbeitslosigkeit">
            Wer selbst kündigt oder eine Kündigung durch eigenes Fehlverhalten provoziert, erhält
            eine <strong>Sperrzeit von 12 Wochen</strong> — in dieser Zeit kein ALG I.
            Auch bei Ablehnung einer zumutbaren Stelle droht Sperrzeit.
          </InfoBox>
        </div>
      )}

      {activeTab === 'beiträge' && (
        <div className="space-y-4">
          <Section title="Beitragsübersicht 2024 (ca.-Werte)">
            <div className="overflow-x-auto rounded-lg border border-emerald-200">
              <table className="w-full text-xs">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Versicherungszweig</th>
                    <th className="px-3 py-2 text-center">Gesamt</th>
                    <th className="px-3 py-2 text-center">Arbeitnehmer</th>
                    <th className="px-3 py-2 text-center">Arbeitgeber</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { zweig: '🏥 Krankenversicherung', gesamt: '~16,3 %', an: '~8,15 %', ag: '~8,15 %' },
                    { zweig: '👴 Rentenversicherung', gesamt: '18,6 %', an: '9,3 %', ag: '9,3 %' },
                    { zweig: '💼 Arbeitslosenversicherung', gesamt: '2,6 %', an: '1,3 %', ag: '1,3 %' },
                    { zweig: '🧓 Pflegeversicherung', gesamt: '3,4 %', an: '1,7 % (+0,6 % kinderlos)', ag: '1,7 %' },
                    { zweig: '🤕 Unfallversicherung', gesamt: '~1,3 %', an: '—', ag: '~1,3 % (allein)' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-emerald-50'}>
                      <td className="px-3 py-2 text-gray-800">{row.zweig}</td>
                      <td className="px-3 py-2 text-center font-bold text-emerald-700">{row.gesamt}</td>
                      <td className="px-3 py-2 text-center text-blue-700">{row.an}</td>
                      <td className="px-3 py-2 text-center text-orange-700">{row.ag}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-3 py-2 text-gray-800">📊 Gesamt (ca.)</td>
                    <td className="px-3 py-2 text-center text-emerald-800">~42 %</td>
                    <td className="px-3 py-2 text-center text-blue-800">~20–21 %</td>
                    <td className="px-3 py-2 text-center text-orange-800">~21 %</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">* Genaue Sätze variieren je nach Krankenkasse (Zusatzbeitrag) und BG (Unfallversicherung). Stets aktuelle Sätze beim Arbeitgeber erfragen.</p>
          </Section>

          <Section title="Versicherungspflicht & Ausnahmen">
            <p className="text-sm text-gray-700 mb-2">Grundsätzlich sind alle Arbeitnehmer versicherungspflichtig — außer:</p>
            <div className="space-y-2">
              {[
                { ausnahme: 'Minijob (bis 538 €/Monat)', detail: 'AG zahlt Pauschalbeiträge, AN kann freiwillig beitreten' },
                { ausnahme: 'Beamte', detail: 'Eigenes System: Beihilfe + PKV statt GKV/GRV' },
                { ausnahme: 'Selbstständige', detail: 'Keine Pflicht-SV (außer bestimmte Berufe), aber freiwillig möglich' },
                { ausnahme: 'PKV-Wechsel (> JAEG)', detail: 'Über 69.300 €/Jahr: Wahlrecht GKV oder PKV' },
              ].map((item, i) => (
                <div key={i} className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                  <p className="font-semibold text-gray-800 text-sm">{item.ausnahme}</p>
                  <p className="text-xs text-gray-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Gehaltszettel verstehen">
            <p className="text-sm text-gray-700 mb-3">
              Auf dem Lohnzettel erscheinen alle Abzüge einzeln:
            </p>
            <div className="p-3 rounded-xl bg-gray-900 text-green-400 font-mono text-xs space-y-1">
              <p>Bruttogehalt:              2.500,00 €</p>
              <p>- Lohnsteuer:               -318,00 €</p>
              <p>- Solidaritätszuschlag:       -0,00 €</p>
              <p>- Kirchensteuer:             -28,00 €</p>
              <p>- KV-Beitrag AN:            -203,75 €</p>
              <p>- RV-Beitrag AN:            -232,50 €</p>
              <p>- AV-Beitrag AN:             -32,50 €</p>
              <p>- PV-Beitrag AN:             -42,50 €</p>
              <p className="border-t border-green-700 pt-1 font-bold">= Nettogehalt:           1.642,75 €</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">Beispielrechnung — individuelle Werte hängen von Steuerklasse, Kindern, Kirchenmitgliedschaft ab.</p>
          </Section>
        </div>
      )}
    </div>
  );
}
