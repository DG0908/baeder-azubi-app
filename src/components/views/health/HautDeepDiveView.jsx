import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const TABS = {
  aufbau: { label: 'Aufbau', icon: '🔬' },
  funktionen: { label: 'Funktionen', icon: '🛡️' },
  bad: { label: 'Haut im Bad', icon: '🏊' },
  diagnostik: { label: 'Diagnostische Zeichen', icon: '🎨' },
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

export default function HautDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('aufbau');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-red-700 to-rose-600 p-5 text-white">
        <div className="text-3xl mb-2">🧍</div>
        <h2 className="text-xl font-bold">Die Haut</h2>
        <p className="text-red-100 text-sm mt-1">Aufbau, Funktionen und Bedeutung in der Ersten Hilfe</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'aufbau' && (
        <div className="space-y-4">
          <Section title="Die 3 Hautschichten">
            <div className="space-y-3">
              {[
                {
                  schicht: 'Epidermis (Oberhaut)',
                  dicke: '0,05–4 mm',
                  detail: 'Äußerste Schicht — keine Blutgefäße, ernährt sich durch Diffusion. Bildet Hornschicht (Keratin) als Schutzbarriere. Enthält Melanozyten (Pigmentierung) und Immunzellen.',
                  color: 'amber',
                  icon: '1️⃣',
                },
                {
                  schicht: 'Dermis (Lederhaut)',
                  dicke: '0,5–4 mm',
                  detail: 'Hauptmasse der Haut. Enthält Kollagen- und Elastinfasern, Blutgefäße, Nervenendigungen, Haarfollikel, Schweiß- und Talgdrüsen.',
                  color: 'orange',
                  icon: '2️⃣',
                },
                {
                  schicht: 'Subcutis (Unterhaut)',
                  dicke: 'variabel',
                  detail: 'Fettgewebe als Polster und Wärmeisolierung. Enthält größere Blutgefäße und Nerven. Verbindet Haut mit Muskeln.',
                  color: 'red',
                  icon: '3️⃣',
                },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl bg-${item.color}-50 border border-${item.color}-300`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className={`font-bold text-${item.color}-800 text-sm`}>{item.schicht}</p>
                      <p className={`text-xs text-${item.color}-600`}>Dicke: {item.dicke}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700">{item.detail}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Fakten zur Haut" color="blue">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Größtes Organ', wert: 'ca. 1,5–2 m²' },
                { label: 'Gewicht', wert: 'ca. 10–11 kg' },
                { label: 'Dicke', wert: '0,5–4 mm (Ort abhängig)' },
                { label: 'Zellen erneuern sich', wert: 'alle 4–6 Wochen' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center">
                  <p className="text-xs text-blue-600">{item.label}</p>
                  <p className="font-bold text-blue-800 text-sm">{item.wert}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'funktionen' && (
        <div className="space-y-4">
          <Section title="Die 7 Hauptfunktionen der Haut">
            <div className="space-y-2">
              {[
                { nr: '1', fkt: 'Schutzfunktion', detail: 'Mechanisch (Stöße), chemisch (Säureschutzmantel pH 5,5), biologisch (Immunzellen)', icon: '🛡️' },
                { nr: '2', fkt: 'Thermoregulation', detail: 'Schwitzen (Verdunstungskälte), Durchblutung regulieren, Gänsehaut (Haare aufstellen)', icon: '🌡️' },
                { nr: '3', fkt: 'Sinnesorgan', detail: 'Tastsinn, Druck, Temperatur, Schmerz — über Nervenendigungen in der Dermis', icon: '🤚' },
                { nr: '4', fkt: 'Vitamin-D-Synthese', detail: 'UV-Strahlung → Vitamin D₃ (Knochen, Immunsystem)', icon: '☀️' },
                { nr: '5', fkt: 'Immunabwehr', detail: 'Langerhans-Zellen in der Epidermis als erste Immunbarriere', icon: '🦠' },
                { nr: '6', fkt: 'Ausscheidung', detail: 'Schweiß enthält Harnstoff, Salze — unterstützt Nierenarbeit', icon: '💧' },
                { nr: '7', fkt: 'Wasserspeicher / -schutz', detail: 'Verhindert Wasserverlust nach innen und Wassereintritt von außen', icon: '🔒' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-white border border-red-200">
                  <span className="text-xl w-8 text-center">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-red-800 text-sm">{item.nr}. {item.fkt}</p>
                    <p className="text-xs text-gray-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'bad' && (
        <div className="space-y-4">
          <Section title="Haut und Chlor">
            <p className="text-sm text-gray-700 mb-3">Chlor im Badewasser greift den natürlichen Säureschutzmantel der Haut an:</p>
            <div className="space-y-2">
              {[
                { problem: 'Chlorreizung', zeichen: 'Rötung, Juckreiz, trockene Haut nach dem Baden', massnahme: 'Duschen vor/nach dem Baden, pH-neutrale Pflege' },
                { problem: 'Chlordermatitis', zeichen: 'Anhaltende Hautreizung, Ekzem bei chronischer Chlorexposition', massnahme: 'FAB-Berufskrankheit — Hautschutz, BG-Meldung' },
                { problem: 'Augenreizung', zeichen: 'Bindehautentzündung durch Chloramine', massnahme: 'Schutzbrille, Wasser spülen' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-red-200 mb-2">
                  <p className="font-bold text-red-800 text-sm mb-1">🧪 {item.problem}</p>
                  <p className="text-xs text-gray-600 mb-0.5">Zeichen: {item.zeichen}</p>
                  <p className="text-xs text-emerald-700 font-medium">→ {item.massnahme}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Wunden im Badebetrieb" color="orange">
            <p className="text-sm text-gray-700 mb-2">Typische Verletzungen und Versorgung:</p>
            <div className="space-y-2">
              {[
                { wunde: 'Schürfwunde (Beckenrand)', versorgung: 'Abspülen, desinfizieren, Wundpflaster — Person aus dem Wasser bis Wunde versorgt' },
                { wunde: 'Schnittwunde (Glasscherbe)', versorgung: 'Fremdkörper nicht entfernen, Druck, sterile Abdeckung, Notruf wenn tief' },
                { wunde: 'Blutung im Wasser', versorgung: 'Sofort aus dem Wasser — Verkeimungsgefahr für alle Badegäste!' },
                { wunde: 'Verbrennungsähnlich (Rutschbahn)', versorgung: 'Kühlen (fließendes Wasser 10–15 Min.), abdecken, Notruf ab 2. Grad' },
              ].map((item, i) => (
                <div key={i} className="p-2 rounded-lg bg-orange-50 border border-orange-200 mb-1">
                  <p className="font-semibold text-orange-800 text-sm">🩹 {item.wunde}</p>
                  <p className="text-xs text-gray-700 mt-0.5">→ {item.versorgung}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'diagnostik' && (
        <div className="space-y-4">
          <Section title="Hautfarbe als diagnostisches Zeichen">
            <p className="text-sm text-gray-700 mb-3">
              Die Hautfarbe gibt dem Ersthelfer wichtige Hinweise auf den Zustand des Betroffenen:
            </p>
            <div className="space-y-2">
              {[
                { farbe: 'Blass / weiß', bedeutung: 'Schock, Anämie, Kälte, starke Angst', dringlichkeit: 'hoch', icon: '⚪' },
                { farbe: 'Blass & kaltschweißig', bedeutung: 'Kreislaufschock — sofort handeln!', dringlichkeit: 'kritisch', icon: '💦' },
                { farbe: 'Blau / Zyanose', bedeutung: 'Sauerstoffmangel (Lippen, Fingernägel) — Atemwegsproblem!', dringlichkeit: 'kritisch', icon: '🔵' },
                { farbe: 'Rot / gerötet', bedeutung: 'Überhitzung, Sonnenbrand, Fieber, Alkohol', dringlichkeit: 'mittel', icon: '🔴' },
                { farbe: 'Gelblich', bedeutung: 'Ikterus (Gelbsucht) — Leber-/Galleproblem, keine Notfallindikation', dringlichkeit: 'niedrig', icon: '🟡' },
                { farbe: 'Fleckig / marmoriert', bedeutung: 'Schock, Unterkühlung, Kreislaufversagen', dringlichkeit: 'kritisch', icon: '🌀' },
              ].map((item, i) => (
                <div key={i} className={`flex gap-3 p-3 rounded-lg border ${
                  item.dringlichkeit === 'kritisch' ? 'bg-red-50 border-red-400' :
                  item.dringlichkeit === 'hoch' ? 'bg-orange-50 border-orange-300' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.farbe}</p>
                    <p className="text-xs text-gray-600">{item.bedeutung}</p>
                    <span className={`text-xs font-bold ${
                      item.dringlichkeit === 'kritisch' ? 'text-red-700' :
                      item.dringlichkeit === 'hoch' ? 'text-orange-700' : 'text-yellow-700'
                    }`}>Dringlichkeit: {item.dringlichkeit}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Hauttemperatur & -feuchtigkeit" color="blue">
            <div className="grid grid-cols-2 gap-3">
              {[
                { zustand: 'Warm & trocken', bedeutung: 'Normal — oder Fieber', icon: '🌡️' },
                { zustand: 'Heiß & trocken', bedeutung: 'Hitzschlag!', icon: '🔥' },
                { zustand: 'Kalt & trocken', bedeutung: 'Unterkühlung', icon: '❄️' },
                { zustand: 'Kalt & klebrig', bedeutung: 'Schock — Notfall!', icon: '💧' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-xl">{item.icon}</span>
                  <p className="font-semibold text-blue-800 text-sm">{item.zustand}</p>
                  <p className="text-xs text-gray-600">{item.bedeutung}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
