import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const TABS = {
  wann: { label: 'Wann?', icon: '❓' },
  technik: { label: 'Technik', icon: '🔄' },
  überwachung: { label: 'Überwachung', icon: '👁️' },
  sonderfaelle: { label: 'Sonderfälle', icon: '⚠️' },
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

export default function StabileSeitenlageDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('wann');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-red-700 to-rose-600 p-5 text-white">
        <div className="text-3xl mb-2">🔄</div>
        <h2 className="text-xl font-bold">Stabile Seitenlage</h2>
        <p className="text-red-100 text-sm mt-1">Sichere Lagerung bewusstloser Personen mit normaler Atmung</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'wann' && (
        <div className="space-y-4">
          <Section title="Wann stabile Seitenlage?">
            <p className="text-sm text-gray-700 mb-3">Die stabile Seitenlage wird eingesetzt bei:</p>
            <div className="space-y-2">
              {[
                { situation: 'Bewusstlos + atmet normal', anweisung: '✅ Stabile Seitenlage — sofort', ok: true },
                { situation: 'Bewusstlos + atmet NICHT normal', anweisung: '❌ KEIN SSL — sofort CPR!', ok: false },
                { situation: 'Bewusst + atmet normal', anweisung: '🟡 In der Regel nicht nötig — komfortabel lagern', ok: null },
                { situation: 'Alkohol/Drogen, schläft tief', anweisung: '✅ Stabile Seitenlage — Erstickungsgefahr!', ok: true },
                { situation: 'Epileptischer Anfall — danach', anweisung: '✅ Nach dem Anfall SSL + Schutz vor Verletzung', ok: true },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg border ${item.ok === true ? 'bg-green-50 border-green-300' : item.ok === false ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'}`}>
                  <p className="font-semibold text-gray-800 text-sm">{item.situation}</p>
                  <p className="text-xs mt-0.5 font-medium text-gray-700">{item.anweisung}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Ziel der SSL" color="blue">
            <p className="text-sm text-gray-700 mb-2">Die SSL verhindert:</p>
            {[
              'Aspiration von Erbrochenem oder Speichel (Ersticken)',
              'Einsinken der Zunge → Atemwegsobstruktion',
              'Druckschäden durch einseitige Lage (bei Langzeitlagerung)',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1">
                <CheckCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </Section>
        </div>
      )}

      {activeTab === 'technik' && (
        <div className="space-y-4">
          <Section title="Schritt für Schritt — SSL anlegen">
            <p className="text-sm text-gray-700 mb-3">Person liegt auf dem Rücken, du kniest seitlich daneben:</p>
            <div className="space-y-2">
              {[
                { nr: '1', text: 'Den dir zugewandten Arm im rechten Winkel zum Körper ausstrecken — Handfläche nach oben', detail: 'Jetzt ist der Arm aus dem Weg' },
                { nr: '2', text: 'Den anderen Arm quer über den Brustkorb legen — Hand unter die nahe Wange schieben', detail: 'Die Hand stützt später den Kopf' },
                { nr: '3', text: 'Das dir entfernte Knie beugen — Fuß flach auf dem Boden', detail: 'Dient als "Hebel"' },
                { nr: '4', text: 'Person zu dir herüberrollen — am gebeugten Knie ziehen', detail: 'Gleichzeitig Kopf mit der Hand stützen' },
                { nr: '5', text: 'Oberes Bein im rechten Winkel anwinkeln — stabilisiert die Lage', detail: 'Person kippt jetzt nicht zurück' },
                { nr: '6', text: 'Kopf nach hinten kippen + Mund leicht öffnen', detail: 'Atemweg freihalten — Erbrochenes kann abfließen' },
                { nr: '7', text: 'Atmung kontrollieren!', detail: 'Hände überprüfen, ob Atemwege frei bleiben' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white border border-red-200">
                  <span className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">{item.nr}</span>
                  <div>
                    <p className="font-semibold text-red-800 text-sm">{item.text}</p>
                    <p className="text-xs text-gray-500 mt-0.5 italic">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300">
            <p className="font-semibold text-amber-800 text-sm mb-1">💡 Merkregel</p>
            <p className="text-sm text-amber-700">"Arm weg — Hand unter Wange — Knie beugen — rollen — stabil"</p>
          </div>
        </div>
      )}

      {activeTab === 'überwachung' && (
        <div className="space-y-4">
          <Section title="Kontinuierliche Überwachung">
            <p className="text-sm text-gray-700 mb-3">
              Nach dem Anlegen der SSL ist die Arbeit nicht getan — lückenlose Überwachung bis zum Eintreffen des Rettungsdienstes:
            </p>
            <div className="space-y-2">
              {[
                { was: 'Atmung', wie: 'Alle 1–2 Min. prüfen: sehen/hören/fühlen', icon: '🫁' },
                { was: 'Bewusstsein', wie: 'Regelmäßig ansprechen — reagiert die Person?', icon: '🧠' },
                { was: 'Hautfarbe', wie: 'Blass, blau (Zyanose), Schweißausbruch = Alarmsignal', icon: '🎨' },
                { was: 'Puls (falls möglich)', wie: 'Am Hals (A. carotis) tasten', icon: '💓' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-white border border-red-200">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-red-800 text-sm">{item.was}</p>
                    <p className="text-xs text-gray-600">{item.wie}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Wenn sich die Situation ändert" color="orange">
            <div className="space-y-2">
              {[
                { situation: 'Atmung hört auf', maßnahme: 'Sofort auf den Rücken drehen → CPR starten!', urgent: true },
                { situation: 'Person erbricht', maßnahme: 'Mund reinigen, Atemweg freimachen, SSL beibehalten', urgent: false },
                { situation: 'Person wacht auf', maßnahme: 'In bequeme Position, beruhigen, Notruf informieren', urgent: false },
                { situation: 'Seitenlage > 30 Min.', maßnahme: 'Auf andere Seite drehen (Druckschäden vermeiden)', urgent: false },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg border ${item.urgent ? 'bg-red-50 border-red-300' : 'bg-orange-50 border-orange-200'}`}>
                  <p className={`font-semibold text-sm ${item.urgent ? 'text-red-800' : 'text-orange-800'}`}>{item.situation}</p>
                  <p className="text-xs text-gray-700 mt-0.5">→ {item.maßnahme}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'sonderfaelle' && (
        <div className="space-y-4">
          <Section title="Schwangere">
            <p className="text-sm text-gray-700 mb-2">
              Schwangere ab dem <strong>4. Monat (ca. 16. SSW)</strong> immer auf die <strong>linke Seite</strong> lagern!
            </p>
            <div className="p-3 rounded-lg bg-pink-50 border border-pink-300">
              <p className="text-xs text-pink-700">
                In Rückenlage oder rechter Seitenlage drückt der Uterus auf die untere Hohlvene
                (Vena cava inferior) → Blutrückfluss zum Herz wird gedrosselt → Vena-cava-Kompressionssyndrom
                mit Blutdruckabfall und Schock. Linke Seite entlastet die Vene.
              </p>
            </div>
          </Section>

          <Section title="Wirbelsäulenverletzung (Verdacht)" color="orange">
            <p className="text-sm text-gray-700 mb-2">
              Bei Verdacht auf HWS-Verletzung (z.B. Kopfsprung-Unfall im Bad):
            </p>
            <div className="space-y-1">
              {[
                'SSL trotzdem wenn Bewusstlosigkeit → Atemweg hat Vorrang vor WS-Schutz',
                'Kopf so neutral wie möglich halten — nicht überstrecken',
                'Zu zweit rollen (Log-Roll) wenn möglich',
                'Notruf mit Hinweis auf WS-Verdacht',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <AlertTriangle size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Kinder" color="blue">
            <p className="text-sm text-gray-700 mb-2">
              Grundtechnik gleich wie beim Erwachsenen — aber:
            </p>
            {[
              'Kleine Kinder ggf. auf den Arm nehmen (Säuglinge)',
              'Kopf nur leicht überstrecken — Hals ist weicher',
              'Vorsichtig rollen — wenig Kraftaufwand nötig',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1">
                <CheckCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </Section>

          <div className="p-3 rounded-xl bg-red-50 border border-red-300">
            <p className="font-semibold text-red-800 text-sm">Priorität immer:</p>
            <p className="text-sm text-red-700 mt-1">
              <strong>Atemweg &gt; Wirbelsäule.</strong> Eine fehlerhaft gelagerte WS ist heilbar.
              Ersticken ist es nicht.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
