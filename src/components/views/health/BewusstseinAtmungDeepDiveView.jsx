import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const TABS = {
  bewusstsein: { label: 'Bewusstsein prüfen', icon: '🧠' },
  atmung: { label: 'Atmung prüfen', icon: '🫁' },
  entscheidung: { label: 'Entscheidungsbaum', icon: '🔀' },
  schnappatmung: { label: 'Schnappatmung', icon: '⚠️' },
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

export default function BewusstseinAtmungDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('bewusstsein');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-red-700 to-rose-600 p-5 text-white">
        <div className="text-3xl mb-2">🧠</div>
        <h2 className="text-xl font-bold">Bewusstsein & Atmung</h2>
        <p className="text-red-100 text-sm mt-1">Systematische Erstbeurteilung — Ansprechen, prüfen, entscheiden</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'bewusstsein' && (
        <div className="space-y-4">
          <Section title="Bewusstsein kontrollieren — 3 Schritte">
            <div className="space-y-3">
              {[
                { nr: '1', methode: 'Ansprechen', detail: 'Laut und deutlich: "Können Sie mich hören?" / "Alles in Ordnung?"', icon: '🗣️' },
                { nr: '2', methode: 'Berühren', detail: 'Beide Schultern fest anfassen und schütteln', icon: '🤲' },
                { nr: '3', methode: 'Schmerzreiz (wenn nötig)', detail: 'Knöchel über das Brustbein reiben — nur bei kompletter Reaktionslosigkeit', icon: '👊' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white border border-red-200">
                  <span className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">{item.nr}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <p className="font-semibold text-red-800 text-sm">{item.methode}</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Bewusstseinszustände" color="orange">
            <div className="space-y-2">
              {[
                { zustand: 'Klar', zeichen: 'Reagiert normal auf Ansprache, orientiert zu Ort/Zeit/Person', farbe: 'green' },
                { zustand: 'Getrübt', zeichen: 'Reagiert, aber langsam/verwirrt — öffnet Augen auf Ansprache', farbe: 'yellow' },
                { zustand: 'Somnolent', zeichen: 'Schläfrig, nur auf stärkere Reize erweckbar', farbe: 'orange' },
                { zustand: 'Soporös', zeichen: 'Nur noch auf Schmerzreize mit Abwehrbewegungen', farbe: 'red' },
                { zustand: 'Komatös', zeichen: 'Keine Reaktion auf Reize — bewusstlos', farbe: 'red' },
              ].map((item, i) => (
                <div key={i} className={`flex gap-3 p-2 rounded-lg bg-${item.farbe}-50 border border-${item.farbe}-200`}>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${item.farbe}-600 text-white self-start`}>{item.zustand}</span>
                  <p className="text-xs text-gray-700">{item.zeichen}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Pupillenkontrolle" color="blue">
            <p className="text-sm text-gray-700 mb-2">Pupillen geben Hinweise auf Hirnfunktion:</p>
            {[
              { zustand: 'Gleich groß & reagieren auf Licht', bedeutung: '✅ Normal', farbe: 'green' },
              { zustand: 'Weit & starr (Mydriasis)', bedeutung: '🔴 Sauerstoffmangel, Schock, Drogen', farbe: 'red' },
              { zustand: 'Eng (Miosis)', bedeutung: '🟡 Morphin/Opiate, Hirnstamm-Problem', farbe: 'yellow' },
              { zustand: 'Unterschiedlich groß (Anisokorie)', bedeutung: '🔴 Hirnverletzung, Notarzt!', farbe: 'red' },
            ].map((item, i) => (
              <div key={i} className={`flex gap-2 p-2 rounded-lg bg-${item.farbe}-50 border border-${item.farbe}-100 mb-1`}>
                <p className="text-xs font-medium text-gray-700 flex-1">{item.zustand}</p>
                <p className="text-xs text-gray-600">{item.bedeutung}</p>
              </div>
            ))}
          </Section>
        </div>
      )}

      {activeTab === 'atmung' && (
        <div className="space-y-4">
          <Section title="Atemkontrolle — Sehen · Hören · Fühlen">
            <p className="text-sm text-gray-700 mb-3">
              Kopf in den Nacken legen, Kinn anheben — Wange über den Mund halten:
            </p>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { sinn: 'SEHEN 👀', text: 'Hebt sich der Brustkorb?' },
                { sinn: 'HÖREN 👂', text: 'Atemgeräusche hörbar?' },
                { sinn: 'FÜHLEN 🤚', text: 'Luftstrom an der Wange?' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border-2 border-red-300 text-center">
                  <p className="font-bold text-red-700 text-sm">{item.sinn}</p>
                  <p className="text-xs text-gray-600 mt-1">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-red-100 border border-red-400">
              <p className="font-bold text-red-800 text-sm text-center">⏱ Maximal 10 Sekunden!</p>
              <p className="text-xs text-red-700 text-center mt-1">Länger warten = wertvolle Reanimationszeit verlieren</p>
            </div>
          </Section>

          <Section title="Normale vs. abnormale Atmung" color="orange">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-300">
                <p className="font-bold text-green-800 text-sm mb-2">✅ Normale Atmung</p>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Regelmäßig</li>
                  <li>• Tiefe Züge</li>
                  <li>• 12–20 /Minute</li>
                  <li>• Mühelos</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-300">
                <p className="font-bold text-red-800 text-sm mb-2">❌ Keine normale Atmung</p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Schnappatmung</li>
                  <li>• Gurgeln/Röcheln</li>
                  <li>• Keine Bewegung</li>
                  <li>• Atemstillstand</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Atemfrequenz einschätzen" color="blue">
            <div className="overflow-x-auto rounded-lg border border-blue-200">
              <table className="w-full text-xs">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Frequenz / Min.</th>
                    <th className="px-3 py-2 text-left">Bewertung</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { freq: '< 8', wert: '🔴 Bradypnoe — lebensbedrohlich, Beatmung!' },
                    { freq: '8–11', wert: '🟡 Zu langsam — engmaschig überwachen' },
                    { freq: '12–20', wert: '✅ Normal' },
                    { freq: '21–30', wert: '🟡 Tachypnoe — Stress, Schmerzen, Fieber' },
                    { freq: '> 30', wert: '🔴 Schwere Atemnot — Notarzt!' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                      <td className="px-3 py-2 font-mono font-bold text-gray-800">{row.freq}</td>
                      <td className="px-3 py-2 text-gray-700">{row.wert}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'entscheidung' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-gray-800 text-white text-center">
            <p className="font-bold">Entscheidungsbaum — was tun?</p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-400">
            <p className="font-bold text-blue-800 text-center mb-3">Person gefunden / Notfall erkannt</p>
            <p className="text-sm text-blue-700 text-center">↓ Sicherheit prüfen → Ansprechen & Anfassen</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-green-50 border-2 border-green-400">
              <p className="font-bold text-green-800 text-sm text-center mb-2">✅ REAGIERT</p>
              <p className="text-xs text-green-700 text-center">↓</p>
              <p className="text-xs text-green-700 text-center mt-1">Atmung normal?</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-green-800 font-semibold">Ja → Stabile Seitenlage, überwachen, Notruf</p>
                <p className="text-xs text-orange-800 font-semibold">Nein → Erste-Hilfe-Maßnahmen, Notruf</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-red-50 border-2 border-red-400">
              <p className="font-bold text-red-800 text-sm text-center mb-2">❌ REAGIERT NICHT</p>
              <p className="text-xs text-red-700 text-center">↓</p>
              <p className="text-xs text-red-700 text-center mt-1">Notruf 112 + AED holen</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-green-800 font-semibold">Atmet normal → Stabile Seitenlage</p>
                <p className="text-xs text-red-800 font-semibold font-bold">Atmet NICHT → SOFORT CPR!</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-600 text-white">
            <p className="font-bold text-center">Bewusstlos + keine normale Atmung</p>
            <p className="text-red-100 text-sm text-center mt-1">= Kreislaufstillstand → CPR 30:2 + AED</p>
          </div>
        </div>
      )}

      {activeTab === 'schnappatmung' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-600 text-white">
            <p className="font-bold text-lg text-center">⚠️ Schnappatmung = KEINE Atmung!</p>
            <p className="text-red-100 text-sm text-center mt-1">Trotz sichtbarer Atemzüge → sofort CPR beginnen</p>
          </div>

          <Section title="Was ist Schnappatmung?">
            <p className="text-sm text-gray-700 mb-3">
              Schnappatmung (<em>Agonale Atmung</em>) tritt in den ersten Minuten nach einem Herzstillstand auf.
              Das Gehirn sendet noch reflexartig Atemsignale, obwohl das Herz nicht mehr pumpt.
            </p>
            <div className="space-y-2">
              {[
                { merkmal: 'Aussehen', beschr: 'Unregelmäßige, krampfartige Atemzüge — wie "nach Luft schnappen"', icon: '👀' },
                { merkmal: 'Geräusch', beschr: 'Gurgeln, Röcheln, lautes Schnarchen', icon: '👂' },
                { merkmal: 'Häufigkeit', beschr: 'Selten — oft nur 2–6 Atemzüge pro Minute', icon: '📊' },
                { merkmal: 'Dauer', beschr: 'Hört innerhalb von Minuten auf', icon: '⏱️' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-white border border-red-200">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-red-800 text-sm">{item.merkmal}</p>
                    <p className="text-xs text-gray-600">{item.beschr}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Warum ist das so gefährlich?" color="orange">
            <p className="text-sm text-gray-700 mb-2">
              Laienhelfer warten oft ab, weil sie die Schnappatmung als "noch lebend" interpretieren.
              Diese Verzögerung kostet Leben.
            </p>
            <div className="p-3 rounded-lg bg-orange-100 border border-orange-400">
              <p className="font-bold text-orange-800 text-sm">Faustregel:</p>
              <p className="text-sm text-orange-700 mt-1">
                Wenn du dir bei der Atmung <strong>nicht sicher bist</strong>, ob sie normal ist → <strong>sofort CPR beginnen!</strong>
                CPR bei jemandem der noch atmet schadet nicht — keine CPR bei jemandem im Herzstillstand tötet.
              </p>
            </div>
          </Section>

          <Section title="Im Schwimmbad" color="blue">
            <p className="text-sm text-gray-700">
              Nach einem Ertrinkungs-/Beinahe-Ertrinkungsunfall kann Schnappatmung auftreten.
              Vertraut eurem Training — Zweifel im Notfall immer zugunsten sofortiger Reanimation entscheiden.
            </p>
          </Section>
        </div>
      )}
    </div>
  );
}
