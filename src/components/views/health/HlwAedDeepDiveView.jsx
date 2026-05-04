import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const TABS = {
  algorithmus: { label: 'Algorithmus', icon: '📋' },
  hdm: { label: 'Herzdruckmassage', icon: '🫀' },
  beatmung: { label: 'Beatmung', icon: '🫁' },
  aed: { label: 'AED', icon: '⚡' },
  team: { label: 'Teamablauf Bad', icon: '👥' },
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

const Step = ({ nr, title, detail, urgent }) => (
  <div className={`flex gap-3 p-3 rounded-xl mb-2 border ${urgent ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'}`}>
    <span className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0 ${urgent ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{nr}</span>
    <div>
      <p className={`font-semibold text-sm ${urgent ? 'text-red-800' : 'text-gray-800'}`}>{title}</p>
      {detail && <p className="text-xs text-gray-600 mt-0.5">{detail}</p>}
    </div>
  </div>
);

export default function HlwAedDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('algorithmus');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-red-700 to-rose-600 p-5 text-white">
        <div className="text-3xl mb-2">❤️</div>
        <h2 className="text-xl font-bold">HLW & AED</h2>
        <p className="text-red-100 text-sm mt-1">Herz-Lungen-Wiederbelebung und automatischer Defibrillator</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'algorithmus' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-red-600 text-white text-center">
            <p className="font-bold text-lg">ERC-Algorithmus Erwachsene</p>
            <p className="text-red-200 text-xs">European Resuscitation Council — Basisreanimation</p>
          </div>
          <Step nr="1" title="Sicherheit prüfen" detail="Eigensicherung zuerst — Strom? Chlorgas? Gefahr?" />
          <Step nr="2" title="Ansprechen & Anfassen" detail="Laut ansprechen: 'Alles ok?' Schulter anfassen — keine Reaktion?" />
          <Step nr="3" title="Hilfe rufen" detail="Laut rufen: 'Hilfe!' — weitere Personen alarmieren" urgent />
          <Step nr="4" title="Notruf 112" detail="ODER durch andere Person parallel alarmieren lassen — AED holen lassen" urgent />
          <Step nr="5" title="Atemkontrolle" detail="Kopf überstrecken, Kinn anheben — max. 10 Sek. sehen/hören/fühlen" />
          <Step nr="6" title="Keine normale Atmung?" detail="Schnappatmung = keine Atmung! → SOFORT mit CPR beginnen" urgent />
          <Step nr="7" title="CPR 30:2" detail="30 Druckmassagen : 2 Beatmungen — nicht unterbrechen bis AED da" urgent />
          <Step nr="8" title="AED einschalten & folgen" detail="Gerät einschalten → Elektroden anbringen → Anweisungen folgen" urgent />
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-300">
            <p className="font-bold text-orange-800 text-sm mb-1">⏱ Zeit ist Leben!</p>
            <p className="text-xs text-orange-700">Pro Minute ohne CPR sinkt die Überlebenschance um 10 %. Nach 4–5 Minuten beginnen irreversible Hirnschäden.</p>
          </div>
        </div>
      )}

      {activeTab === 'hdm' && (
        <div className="space-y-4">
          <Section title="Herzdruckmassage — korrekte Technik">
            <div className="space-y-3">
              {[
                { punkt: 'Position', detail: 'Harte Unterlage! Rücken des Betroffenen auf festem Boden', icon: '📍' },
                { punkt: 'Druckpunkt', detail: 'Mitte des Brustkorbs — untere Hälfte des Brustbeins', icon: '👆' },
                { punkt: 'Handhaltung', detail: 'Handballen aufeinander, Finger verschränkt, Arme gestreckt', icon: '🤲' },
                { punkt: 'Drucktiefe', detail: '5–6 cm eindrücken — kraftvoll und gleichmäßig', icon: '📏' },
                { punkt: 'Frequenz', detail: '100–120 Drücke pro Minute (Takt: "Stayin\' Alive" von Bee Gees)', icon: '🎵' },
                { punkt: 'Entlastung', detail: 'Vollständige Entlastung nach jedem Druck — Hände NICHT abheben', icon: '↕️' },
                { punkt: 'Verhältnis', detail: '30 Drücke : 2 Beatmungen = 1 Zyklus', icon: '🔄' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-white border border-red-200">
                  <span className="text-xl w-8 text-center">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-red-800 text-sm">{item.punkt}</p>
                    <p className="text-xs text-gray-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300">
            <p className="font-semibold text-amber-800 text-sm mb-1">💪 Kraftaufwand nicht scheuen</p>
            <p className="text-xs text-amber-700">Rippenbrüche sind möglich — aber kein Grund aufzuhören! Ein Rippenbruch ist heilbar, ohne CPR überlebt die Person nicht. Weiter drücken!</p>
          </div>
        </div>
      )}

      {activeTab === 'beatmung' && (
        <div className="space-y-4">
          <Section title="Mund-zu-Mund-Beatmung">
            <div className="space-y-2">
              {[
                { nr: '1', text: 'Kopf in den Nacken legen (Überstrecken) — Kinn anheben' },
                { nr: '2', text: 'Nase mit Daumen und Zeigefinger zuhalten' },
                { nr: '3', text: 'Mund fest auf Mund pressen — dicht abschließen' },
                { nr: '4', text: 'Gleichmäßig einblasen — ca. 1 Sekunde, bis Brustkorb sich hebt' },
                { nr: '5', text: 'Loslassen — passive Ausatmung abwarten' },
                { nr: '6', text: 'Zweite Beatmung — dann sofort 30 Drücke weiter' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{item.nr}</span>
                  <p className="text-sm text-gray-700 pt-0.5">{item.text}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Mund-zu-Nase (Alternative)" color="orange">
            <p className="text-sm text-gray-700">Wenn der Mund nicht zugänglich ist (z.B. Verletzung) → Mund schließen, über Nase beatmen.</p>
          </Section>
          <Section title="Beatmung verweigern?" color="gray">
            <p className="text-sm text-gray-700 mb-2">Wenn Beatmung nicht möglich oder verweigert wird:</p>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="font-semibold text-blue-800 text-sm">Nur-Druckmassage (Compression-only CPR)</p>
              <p className="text-xs text-blue-700 mt-1">Kontinuierliche Herzdruckmassage ohne Beatmung — besonders in den ersten Minuten nach Kreislaufstillstand fast gleich effektiv, da noch Sauerstoff im Blut vorhanden.</p>
            </div>
          </Section>
          <div className="p-3 rounded-xl bg-red-50 border border-red-300">
            <p className="font-semibold text-red-800 text-sm">⚠️ Unterbrechungen minimieren!</p>
            <p className="text-xs text-red-700 mt-1">Beatmungspausen max. 10 Sekunden. Jede Unterbrechung der HDM reduziert die Überlebenschance. Schnell und präzise beatmen.</p>
          </div>
        </div>
      )}

      {activeTab === 'aed' && (
        <div className="space-y-4">
          <Section title="AED — Automatischer Externer Defibrillator">
            <p className="text-sm text-gray-700 mb-3">
              Der AED analysiert den Herzrhythmus und gibt bei Bedarf einen Stromstoß ab, der
              das Herz "neu starten" kann. Er kann und soll von Laien bedient werden — das Gerät gibt Sprachanweisungen!
            </p>
          </Section>
          <Section title="Bedienung Schritt für Schritt">
            {[
              { nr: '1', text: 'AED einschalten (Deckel öffnen oder Taste drücken)', icon: '🔌' },
              { nr: '2', text: 'Elektroden anbringen: rechts oben (Schlüsselbein) und links unten (Rippe)', icon: '📌' },
              { nr: '3', text: 'Analyse starten — ALLE zurücktreten, nicht berühren!', icon: '🔍' },
              { nr: '4', text: 'Schock empfohlen → Knopf drücken (alle weg vom Patienten)', icon: '⚡' },
              { nr: '5', text: 'Sofort CPR fortsetzen — AED analysiert automatisch alle 2 Min. erneut', icon: '🔄' },
              { nr: '6', text: 'Kein Schock empfohlen → CPR weiter, Gerät folgt Protokoll', icon: '▶️' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start mb-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{item.nr}</span>
                <div className="flex gap-2 items-start">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              </div>
            ))}
          </Section>
          <Section title="AED-Standort im Bad" color="blue">
            <p className="text-sm text-gray-700 mb-2">
              Eine bundesweite gesetzliche AED-Pflicht für Schwimmbäder gibt es nicht — die DGUV V 107
              empfiehlt einen AED, manche Träger und einzelne Bundesländer machen ihn verbindlich.
              Wenn vorhanden, muss der AED:
            </p>
            {['Gut sichtbar und zugänglich angebracht sein', 'Regelmäßig geprüft werden (Elektroden, Akku)', 'Dem Personal bekannt sein — Standort schulen!'].map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <CheckCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </Section>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="space-y-4">
          <Section title="Teamablauf bei Reanimation im Schwimmbad">
            <p className="text-sm text-gray-700 mb-3">Im Bäderbetrieb sind meist mehrere Personen erreichbar. Klare Aufgabenverteilung rettet Leben:</p>
            <div className="space-y-2">
              {[
                { rolle: 'Person 1 (Ersthelfer)', aufgabe: 'Beginnt sofort mit CPR — nicht aufhören bis Ablösung kommt', color: 'red' },
                { rolle: 'Person 2', aufgabe: 'Notruf 112 absetzen, AED holen und bringen', color: 'orange' },
                { rolle: 'Person 3', aufgabe: 'AED bedienen, CPR-Ablösung, Eingang für Rettungsdienst aufhalten', color: 'yellow' },
                { rolle: 'Weitere', aufgabe: 'Badegäste abschirmen, Zugang freihalten, Protokoll führen', color: 'blue' },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg bg-${item.color}-50 border border-${item.color}-200`}>
                  <p className={`font-bold text-${item.color}-800 text-sm`}>{item.rolle}</p>
                  <p className={`text-xs text-${item.color}-700`}>{item.aufgabe}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Bergung aus dem Wasser" color="blue">
            <p className="text-sm text-gray-700 mb-2">CPR im Wasser ist nicht möglich — schnellstmögliche Bergung an Land:</p>
            {[
              'Bei Wirbelsäulenverdacht: Kopf/Hals stabilisieren beim Bergen',
              'Auf fester Unterlage ablegen — Boden, Beckenrand',
              'Nasse Kleidung stört CPR nicht — trotzdem weiter',
              'AED auch bei nasser Haut nutzbar — Haut kurz trocknen vor Elektrodenplatzierung',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1">
                <span className="text-blue-600 font-bold flex-shrink-0">→</span>
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </Section>
          <div className="p-4 rounded-xl bg-red-600 text-white text-center">
            <p className="font-bold">Merke: Reanimation zuerst — Dokumentation danach!</p>
            <p className="text-red-100 text-xs mt-1">Erst wenn der Rettungsdienst übernimmt, Protokoll führen.</p>
          </div>
        </div>
      )}
    </div>
  );
}
