import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const TABS = {
  ertrinken: { label: 'Ertrinken', icon: '🌊' },
  kopfsprung: { label: 'Kopfsprung-Unfall', icon: '🤿' },
  krampf: { label: 'Krampf & Anfall', icon: '⚡' },
  temperatur: { label: 'Temperatur', icon: '🌡️' },
  chlor: { label: 'Chlorunfall', icon: '🧪' },
};

const TabChip = ({ id, tab, active, onClick }) => (
  <button onClick={() => onClick(id)}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${active ? 'bg-red-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
    {tab.icon} {tab.label}
  </button>
);

const Section = ({ title, children, color = 'red' }) => (
  <div className={`rounded-xl border border-${color}-200 bg-${color}-50 p-4 mb-4`}>
    {title && <h3 className={`font-bold text-${color}-800 mb-3 text-base`}>{title}</h3>}
    {children}
  </div>
);

export default function BadeunfallDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('ertrinken');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-red-700 to-rose-600 p-5 text-white">
        <div className="text-3xl mb-2">🚑</div>
        <h2 className="text-xl font-bold">Badeunfall-Erstversorgung</h2>
        <p className="text-red-100 text-sm mt-1">Typische Notfallbilder im Schwimmbad und Erstmaßnahmen</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'ertrinken' && (
        <div className="space-y-4">
          <Section title="Ertrinken & Beinahe-Ertrinken">
            <p className="text-sm text-gray-700 mb-3">
              Ertrinken ist meist <strong>still</strong> — kein Schreien, kein Winken. Die Person kämpft ums Überleben
              und hat keine Kapazität für Hilferufe. Erkennungszeichen:
            </p>
            <div className="space-y-1">
              {[
                'Kopf tief im Wasser, Mund an der Wasseroberfläche',
                'Aufrechte Körperposition, keine Beinbewegung',
                'Glasige Augen, kein Blickkontakt',
                'Haar im Gesicht — wird nicht weggeschüttelt',
                'Hyperventilieren oder Luftholen ohne zu rufen',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-blue-600 font-bold">→</span>
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Bergung aus dem Wasser" color="orange">
            <p className="text-xs text-orange-700 font-semibold mb-2">⚠️ Eigenschutz zuerst — Rettung ohne Schwimmkenntnisse nur mit Hilfsmitteln!</p>
            <div className="space-y-2">
              {[
                { methode: 'Retten ohne ins Wasser', detail: 'Stange, Seil, Gürtel, Handtuch hinhalten — Person zieht sich raus', icon: '🪢' },
                { methode: 'Retten mit Hilfsmittel', detail: 'Rettungsring / Gurtretter werfen — Person hält sich fest', icon: '🛟' },
                { methode: 'Retten im Wasser', detail: 'Nur ausgebildete Rettungsschwimmer! Mit Hilfsmittel anschwimmen', icon: '🏊' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-white border border-orange-200">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-orange-800 text-sm">{item.methode}</p>
                    <p className="text-xs text-gray-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Nach der Bergung — Erstversorgung" color="red">
            {[
              { nr: '1', text: 'Auf fester Unterlage ablegen — Beckenrand, Boden' },
              { nr: '2', text: 'Notruf 112 — falls noch nicht geschehen' },
              { nr: '3', text: 'Bewusstsein prüfen: Ansprechen, Anfassen' },
              { nr: '4', text: 'Atmung prüfen (max. 10 Sek.)' },
              { nr: '5', text: 'Keine Atmung → CPR 30:2 sofort starten (auch nass!)' },
              { nr: '6', text: 'Normale Atmung → Stabile Seitenlage, Wärme, überwachen' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start mb-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{item.nr}</span>
                <p className="text-sm text-gray-700 pt-0.5">{item.text}</p>
              </div>
            ))}
            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-300">
              <p className="font-semibold text-blue-800 text-sm">Wasser aus der Lunge schütteln?</p>
              <p className="text-xs text-blue-700 mt-1">NEIN! Das ist ein Mythos und kostet wertvolle CPR-Zeit. Sofort mit der Reanimation beginnen!</p>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'kopfsprung' && (
        <div className="space-y-4">
          <Section title="Kopfsprung-Unfall — Wirbelsäulenverletzung">
            <p className="text-sm text-gray-700 mb-3">
              Sprung in zu flaches Wasser, Aufprall auf Beckenrand oder anderen Badegast —
              immer <strong>HWS-Verletzung</strong> in Betracht ziehen!
            </p>
            <div className="p-3 rounded-xl bg-red-100 border border-red-400 mb-3">
              <p className="font-bold text-red-800 text-sm">Alarmsignale:</p>
              <ul className="text-xs text-red-700 mt-1 space-y-0.5">
                <li>• Person bewegt sich nach Sprung nicht / bleibt im Wasser liegen</li>
                <li>• Klagt über Taubheitsgefühl / Kribbeln in Armen oder Beinen</li>
                <li>• Nacken-/Rückenschmerzen</li>
                <li>• Motorische Ausfälle</li>
              </ul>
            </div>
          </Section>

          <Section title="Erstmaßnahmen im Wasser" color="blue">
            <p className="text-sm text-gray-700 mb-2">Wenn Person noch im Wasser:</p>
            {[
              'Kopf in neutraler Position halten — NICHT beugen oder drehen',
              'Person waagerecht an die Wasseroberfläche bringen',
              'An Beckenrand / Ausstieg führen, zu zweit heben (Log-Roll)',
              'Notruf 112 — "Wirbelsäulenverdacht" melden',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1">
                <AlertTriangle size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </Section>

          <Section title="An Land" color="orange">
            {[
              'Person NICHT bewegen lassen — liegend lassen wo sie liegt',
              'Beruhigen und still halten — weitere Schäden vermeiden',
              'Wärme (Decke) — oft Kältereiz nach Wasseraustritt',
              'Bewusstsein und Atmung überwachen',
              'Bei Bewusstlosigkeit: Atemweg hat Vorrang — SSL trotz WS-Verdacht',
              'Rettungsdienst übernimmt WS-Immobilisation (Stifneck, Vakuummatratze)',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1">
                <CheckCircle size={14} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </Section>
        </div>
      )}

      {activeTab === 'krampf' && (
        <div className="space-y-4">
          <Section title="Muskelkrampf im Wasser">
            <p className="text-sm text-gray-700 mb-3">
              Meist Wade oder Oberschenkel. Häufige Ursache: Überlastung, Kälte, Dehydration.
            </p>
            <div className="space-y-2">
              {[
                { maßnahme: 'Ruhig bleiben', detail: 'Panik ist die Hauptgefahr — auf den Rücken legen, tretwasser' },
                { maßnahme: 'Zehe hochziehen', detail: 'Bei Wadenkrampf: Fuß mit der Hand Richtung Schienbein ziehen' },
                { maßnahme: 'Massage', detail: 'Krampfmuskel kneten — verbessert Durchblutung' },
                { maßnahme: 'Wärme an Land', detail: 'Nach Bergung: Muskel wärmen und dehnen' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <CheckCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-800 text-sm">{item.maßnahme}</p>
                    <p className="text-xs text-gray-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Epileptischer Anfall im Bad" color="orange">
            <p className="text-sm text-gray-700 mb-3">
              Im Wasser: <strong>sofort bergen</strong> — Ertrinkungsgefahr! An Land: schützen, nicht fixieren.
            </p>
            <div className="space-y-2">
              {[
                { phase: 'Im Wasser', text: 'Kopf über Wasser halten, sofort an Rand bringen, Notruf', urgent: true },
                { phase: 'Während Anfall', text: 'Verletzungen verhindern (Kopf polstern), NICHT festhalten, Gegenstände wegräumen', urgent: false },
                { phase: 'Nach Anfall', text: 'Stabile Seitenlage — Erschöpfung (postiktale Phase) → Person schläft ggf. ein', urgent: false },
                { phase: 'Immer Notruf', text: 'Erstanfall, länger als 5 Min., keine schnelle Erholung, im Wasser', urgent: true },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg border ${item.urgent ? 'bg-red-50 border-red-300' : 'bg-orange-50 border-orange-200'}`}>
                  <p className={`font-semibold text-sm ${item.urgent ? 'text-red-800' : 'text-orange-800'}`}>{item.phase}</p>
                  <p className="text-xs text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'temperatur' && (
        <div className="space-y-4">
          <Section title="Hyperthermie / Hitzschlag (Freibad)">
            <p className="text-sm text-gray-700 mb-2">Besonders bei Kindern, Senioren, langer Sonneneinstrahlung:</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-lg bg-orange-50 border border-orange-300">
                <p className="font-bold text-orange-800 text-sm mb-1">Hitzeerschöpfung</p>
                <ul className="text-xs text-orange-700 space-y-0.5">
                  <li>• Blass, schweißnass</li>
                  <li>• Schwindel, Übelkeit</li>
                  <li>• Schwäche, Kopfschmerz</li>
                  <li>• Noch bei Bewusstsein</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-300">
                <p className="font-bold text-red-800 text-sm mb-1">Hitzschlag</p>
                <ul className="text-xs text-red-700 space-y-0.5">
                  <li>• Heiße, trockene Haut</li>
                  <li>• Hohe Körpertemp. (&gt;40°C)</li>
                  <li>• Verwirrtheit, Kollaps</li>
                  <li>• Bewusstlosigkeit möglich</li>
                </ul>
              </div>
            </div>
            <div className="space-y-1">
              {[
                'In den Schatten / kühlen Raum bringen',
                'Kleidung lockern — Kühlung durch nasse Tücher',
                'Bei Bewusstsein: viel Trinken (Wasser, kein Alkohol)',
                'Hitzschlag → Notruf 112!',
                'Bewusstlos → SSL, Notruf, überwachen',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <CheckCircle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Hypothermie / Unterkühlung" color="blue">
            <p className="text-sm text-gray-700 mb-2">
              Besonders nach längerer Zeit im Wasser (Kinder kühlen schneller aus als Erwachsene):
            </p>
            <div className="space-y-2">
              {[
                { grad: 'Leicht (35–32°C)', zeichen: 'Zittern, Gänsehaut, Blässe', maßnahme: 'Aus dem Wasser, trocknen, Wärme', farbe: 'yellow' },
                { grad: 'Mittel (32–28°C)', zeichen: 'Koordinationsstörung, Verwirrtheit, Muskelsteife', maßnahme: 'Sanft wärmen, horizontal halten, Notruf', farbe: 'orange' },
                { grad: 'Schwer (< 28°C)', zeichen: 'Bewusstlosigkeit, kaum messbare Vitalzeichen', maßnahme: 'CPR, Notruf, schonend wärmen', farbe: 'red' },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg bg-${item.farbe}-50 border border-${item.farbe}-300 mb-2`}>
                  <p className={`font-bold text-${item.farbe}-800 text-sm`}>{item.grad}</p>
                  <p className="text-xs text-gray-600">Zeichen: {item.zeichen}</p>
                  <p className="text-xs font-medium text-gray-700 mt-0.5">→ {item.maßnahme}</p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-300">
              <p className="font-semibold text-blue-800 text-sm">⚠️ Vorsicht beim Wärmen</p>
              <p className="text-xs text-blue-700 mt-1">Nicht reiben — Kälteschock durch Rückstrom kalten Blutes. Sanft wärmen, horizontal transportieren (Rewarming-Kollaps vermeiden).</p>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'chlor' && (
        <div className="space-y-4">
          <Section title="Chlorgas-/Chemikalienunfall im Bad">
            <p className="text-sm text-gray-700 mb-3">
              Bei Fehldosierung oder Leckage kann es zu Chlorgasfreisetzung kommen.
              Chlorgas ist gelblich-grün, riecht stechend und ist schwerer als Luft (sammelt sich am Boden).
            </p>
            <div className="p-3 rounded-xl bg-red-100 border border-red-400 mb-3">
              <p className="font-bold text-red-800 text-sm">⚠️ Eigenschutz zuerst!</p>
              <p className="text-xs text-red-700 mt-1">Chlorgasraum NIEMALS ohne Atemschutz betreten. Auf frische Luft gehen, andere warnen.</p>
            </div>
            <div className="space-y-2">
              {[
                { symptom: 'Augenbrennen', maßnahme: 'Augen mit viel fließendem Wasser spülen (10–15 Min.)' },
                { symptom: 'Husten / Atemnot', maßnahme: 'Frische Luft, aufrecht setzen, Notruf 112' },
                { symptom: 'Bewusstlosigkeit', maßnahme: 'Nur mit Atemschutz Bergen → SSL → Notruf' },
                { symptom: 'Hautkontakt mit Konzentrat', maßnahme: 'Kleidung entfernen, Haut mit viel Wasser spülen (15–20 Min.)' },
              ].map((item, i) => (
                <div key={i} className="p-2 rounded-lg bg-white border border-yellow-300 mb-1">
                  <p className="font-semibold text-yellow-800 text-sm">🧪 {item.symptom}</p>
                  <p className="text-xs text-gray-700 mt-0.5">→ {item.maßnahme}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Alarmkette Chlorunfall" color="orange">
            {[
              '1. Bereich sofort räumen — alle raus',
              '2. Notruf 112 (Feuerwehr mit Atemschutz)',
              '3. Technische Abteilung / Chlorraum abschalten',
              '4. Betroffene an der frischen Luft erstversorgen',
              '5. Chlorneutralisation — nur durch Feuerwehr/Fachkräfte',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1">
                <span className="font-bold text-orange-700 text-sm flex-shrink-0">{item.split('.')[0]}.</span>
                <p className="text-sm text-gray-700">{item.split('.').slice(1).join('.').trim()}</p>
              </div>
            ))}
          </Section>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-300">
            <p className="font-semibold text-gray-800 text-sm mb-1">📋 Notruf-Information vorbereiten</p>
            <p className="text-xs text-gray-600">Chemikalienname, Konzentration (aus SDB), Menge, Anzahl Betroffener, Ort — Sicherheitsdatenblätter müssen im Bad griffbereit sein!</p>
          </div>
        </div>
      )}
    </div>
  );
}
