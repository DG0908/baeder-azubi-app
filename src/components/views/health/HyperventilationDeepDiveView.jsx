import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const TABS = {
  grundlagen: { label: 'Grundlagen', icon: '🧬' },
  symptome: { label: 'Symptome', icon: '🌬️' },
  maßnahmen: { label: 'Erstmaßnahmen', icon: '🤝' },
  bad: { label: 'Im Schwimmbad', icon: '🏊' },
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

export default function HyperventilationDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('grundlagen');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-red-700 to-rose-600 p-5 text-white">
        <div className="text-3xl mb-2">🌬️</div>
        <h2 className="text-xl font-bold">Hyperventilation</h2>
        <p className="text-red-100 text-sm mt-1">Ursachen, Symptome und Erstmaßnahmen im Badebetrieb</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'grundlagen' && (
        <div className="space-y-4">
          <Section title="Was ist Hyperventilation?">
            <p className="text-sm text-gray-700 mb-3">
              Hyperventilation bedeutet: <strong>zu schnelles und/oder zu tiefes Atmen</strong> im Verhältnis
              zum Bedarf des Körpers. Dabei wird zu viel CO₂ abgeatmet.
            </p>
            <div className="p-4 rounded-xl bg-white border-2 border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⬆️</span>
                <div>
                  <p className="font-bold text-red-800">Atemfrequenz steigt</p>
                  <p className="text-xs text-gray-600">Normal: 12–20 /Min. → Hyperventilation: &gt; 25 /Min.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⬇️</span>
                <div>
                  <p className="font-bold text-orange-800">CO₂ im Blut sinkt (Hypokapnie)</p>
                  <p className="text-xs text-gray-600">Blut-pH steigt → Alkalose</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-bold text-yellow-800">Körperreaktion</p>
                  <p className="text-xs text-gray-600">Gefäße verengen sich, Blutfluss ins Gehirn sinkt, Nerven werden übererregbar</p>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Ursachen" color="orange">
            <div className="space-y-2">
              {[
                { ursache: 'Panik / Angst', detail: 'Häufigste Ursache — Angst vor Wasser, Erschrecken', icon: '😰' },
                { ursache: 'Stress / Aufregung', detail: 'Wettkampfsituation, Erschöpfung, intensive Übung', icon: '😤' },
                { ursache: 'Schmerz', detail: 'Krampf, Verletzung — Schmerzreaktion mit Atemveränderung', icon: '🤕' },
                { ursache: 'Bewusste Überatmung', detail: 'Gefährlich! "Tauchen nach Hyperventilieren" → Shallow-Water Blackout', icon: '⚠️' },
                { ursache: 'Medizinische Ursachen', detail: 'Ketoazidose, Lungenembolie, Herzerkrankungen', icon: '🏥' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-white border border-orange-200">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-orange-800 text-sm">{item.ursache}</p>
                    <p className="text-xs text-gray-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'symptome' && (
        <div className="space-y-4">
          <Section title="Typische Symptome">
            <div className="grid grid-cols-2 gap-2">
              {[
                { symptom: 'Kribbeln', wo: 'Hände, Füße, Lippen', icon: '⚡' },
                { symptom: 'Taubheitsgefühl', wo: 'Finger, Zehen', icon: '🫦' },
                { symptom: 'Muskelzuckungen', wo: 'Tetanie — Pfötchenstellung der Hände', icon: '✋' },
                { symptom: 'Schwindel', wo: 'Durch CO₂-Mangel', icon: '💫' },
                { symptom: 'Herzrasen', wo: 'Palpitationen', icon: '💓' },
                { symptom: 'Engegefühl Brust', wo: 'Trotz freier Atemwege', icon: '🫁' },
                { symptom: 'Sehstörungen', wo: 'Flimmern, Unschärfe', icon: '👁️' },
                { symptom: 'Ohnmacht', wo: 'Im schweren Fall', icon: '😵' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-white border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{item.icon}</span>
                    <p className="font-semibold text-red-800 text-sm">{item.symptom}</p>
                  </div>
                  <p className="text-xs text-gray-600">{item.wo}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Verlauf" color="orange">
            <div className="space-y-2">
              {[
                { phase: 'Phase 1', text: 'Schnelle Atmung, Kribbeln beginnt, Herzrasen', farbe: 'yellow' },
                { phase: 'Phase 2', text: 'Kribbeln stärker, Taubheit, Muskelzuckungen, Schwindel', farbe: 'orange' },
                { phase: 'Phase 3', text: 'Pfötchenstellung der Hände (Karpopedal-Spasmus), starke Angst', farbe: 'red' },
                { phase: 'Phase 4', text: 'Ohnmacht → dann normalisiert sich Atmung automatisch', farbe: 'red' },
              ].map((item, i) => (
                <div key={i} className={`flex gap-3 p-2 rounded-lg bg-${item.farbe}-50 border border-${item.farbe}-300`}>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${item.farbe}-600 text-white self-start`}>{item.phase}</span>
                  <p className="text-xs text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-300">
              <p className="text-xs text-blue-700">
                <strong>Wichtig:</strong> Hyperventilation ist selten lebensbedrohlich — sie fühlt sich jedoch
                für die Betroffenen wie Sterben an. Ruhe und Beruhigung sind die wichtigste Erstmaßnahme.
              </p>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'maßnahmen' && (
        <div className="space-y-4">
          <Section title="Erstmaßnahmen">
            <div className="space-y-2">
              {[
                { nr: '1', maßnahme: 'Ruhe bewahren und beruhigen', detail: '"Ich bin bei Ihnen, das geht vorbei." — eigene Ruhe überträgt sich!', prio: true },
                { nr: '2', maßnahme: 'Aus der Situation nehmen', detail: 'Ruhige Umgebung, weg vom Lärm und Publikum', prio: false },
                { nr: '3', maßnahme: 'Atemführung', detail: 'Gemeinsam tief und langsam atmen — vorzumachen hilft: "Wie ich — ein... aus..."', prio: true },
                { nr: '4', maßnahme: 'Hohle Hand vorhalten', detail: 'Person in eigene hohle Hände atmen lassen → CO₂ wieder einatmen', prio: false },
                { nr: '5', maßnahme: 'Ablenkung', detail: 'Fragen stellen, zählen lassen — Fokus weg von der Atmung', prio: false },
                { nr: '6', maßnahme: 'Überwachen', detail: 'Besserung? Oder medizinische Ursache? → Notruf wenn keine Besserung', prio: false },
              ].map((item, i) => (
                <div key={i} className={`flex gap-3 p-3 rounded-xl border ${item.prio ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'}`}>
                  <span className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center flex-shrink-0 ${item.prio ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{item.nr}</span>
                  <div>
                    <p className={`font-semibold text-sm ${item.prio ? 'text-red-800' : 'text-gray-800'}`}>{item.maßnahme}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Plastiktüte — ja oder nein?" color="blue">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-300">
              <p className="font-semibold text-blue-800 text-sm mb-1">⚠️ Kontrovers — eher NEIN</p>
              <p className="text-xs text-blue-700">
                Das Atmen in eine Plastiktüte war früher Standard. Heute wird es nicht mehr empfohlen,
                da es bei einer Ohnmacht zur Erstickung führen kann und da bei manchen Ursachen
                (z.B. Herzerkrankung) der Sauerstoffmangel schaden kann. Hohle Hand ist sicherer.
              </p>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'bad' && (
        <div className="space-y-4">
          <Section title="Hyperventilation im Bäderbetrieb">
            <p className="text-sm text-gray-700 mb-3">Typische Auslöser im Schwimmbad:</p>
            <div className="space-y-2">
              {[
                { situation: 'Schwimmanfänger / Wasserscheu', detail: 'Angst löst Panik-Hyperventilation aus — ruhig ansprechen, ans Wasser führen', icon: '😨' },
                { situation: 'Nach Schreck (Platschen, Stoß)', detail: 'Kurzreaktion — meist schnell vorbei, beruhigen', icon: '😱' },
                { situation: 'Nach Krampf im Wasser', detail: 'Schmerz + Angst → doppelter Auslöser', icon: '⚡' },
                { situation: 'Sportler nach extremer Belastung', detail: 'Erschöpfungs-bedingte Atemveränderung — Pause, Beruhigung', icon: '🏃' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-white border border-red-200">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-red-800 text-sm">{item.situation}</p>
                    <p className="text-xs text-gray-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Shallow-Water Blackout — GEFÄHRLICH" color="orange">
            <div className="p-3 rounded-xl bg-red-100 border border-red-400">
              <p className="font-bold text-red-800 text-sm mb-2">⚠️ Lebensgefahr durch willentliche Hyperventilation!</p>
              <p className="text-xs text-red-700 mb-2">
                Manche Schwimmer hyperventilieren bewusst vor dem Tauchen, um den Atemreiz zu unterdrücken
                und länger unter Wasser bleiben zu können.
              </p>
              <p className="text-xs text-red-700">
                Folge: CO₂ sinkt → Atemreiz wird ausgeschaltet → Sauerstoff im Blut sinkt unter
                Bewusstseinsschwelle → plötzliche Ohnmacht unter Wasser → Ertrinken.
                Der O₂-Abfall passiert ohne Vorwarnung!
              </p>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-300">
              <p className="font-semibold text-amber-800 text-sm">Im Bad strikt verbieten!</p>
              <p className="text-xs text-amber-700 mt-1">Hyperventilieren vor dem Tauchen ist in Schwimmbädern zu untersagen und in der Hausordnung/Aufsicht zu thematisieren.</p>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
