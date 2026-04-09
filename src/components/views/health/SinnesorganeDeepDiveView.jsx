import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const TABS = {
  auge: { label: 'Auge', icon: '👁️' },
  ohr: { label: 'Ohr', icon: '👂' },
  gleichgewicht: { label: 'Gleichgewicht', icon: '⚖️' },
  nase: { label: 'Nase & Mund', icon: '👃' },
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

export default function SinnesorganeDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('auge');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-red-700 to-rose-600 p-5 text-white">
        <div className="text-3xl mb-2">👁️</div>
        <h2 className="text-xl font-bold">Sinnesorgane</h2>
        <p className="text-red-100 text-sm mt-1">Auge, Ohr, Gleichgewicht, Nase — Aufbau, Funktion & Relevanz im Bad</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'auge' && (
        <div className="space-y-4">
          <Section title="Aufbau des Auges">
            <div className="space-y-2">
              {[
                { teil: 'Hornhaut (Cornea)', fkt: 'Lichtbrechung, Schutz — sehr empfindlich, keine Blutgefäße' },
                { teil: 'Iris (Regenbogenhaut)', fkt: 'Reguliert Pupillengröße je nach Lichteinfall' },
                { teil: 'Linse', fkt: 'Scharfstellung (Akkommodation) durch Ziliarmuskel' },
                { teil: 'Netzhaut (Retina)', fkt: 'Lichtrezeptoren: Stäbchen (Dämmerung) und Zapfen (Farbe)' },
                { teil: 'Sehnerv (N. opticus)', fkt: 'Leitet Signale ans Gehirn — blinder Fleck an seiner Eintrittsstelle' },
                { teil: 'Glaskörper', fkt: 'Transparente Gallerte — hält Augapfelform' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-white border border-red-200">
                  <p className="font-semibold text-red-800 text-sm w-36 flex-shrink-0">{item.teil}</p>
                  <p className="text-xs text-gray-600">{item.fkt}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Augenverletzungen & -reizungen im Bad" color="orange">
            <div className="space-y-3">
              {[
                {
                  problem: 'Chlorreizung (Konjunktivitis)',
                  ursache: 'Chloramine (nicht freies Chlor!) reizen Bindehaut — häufig bei schlechter Wasserqualität',
                  massnahme: 'Auge mit klarem Wasser spülen, Schutzbrille tragen, Wasserqualität prüfen',
                  icon: '🧪',
                },
                {
                  problem: 'Fremdkörper im Auge',
                  ursache: 'Sand, Insekten, Schmutz',
                  massnahme: 'Spülen mit fließendem Wasser. NICHT reiben! Kein Fremdkörper entfernen wenn eingebettet → Notruf',
                  icon: '⚠️',
                },
                {
                  problem: 'Augenverletzung (Stoß/Schlag)',
                  ursache: 'Aufprall auf Beckenrand, Zusammenstoß',
                  massnahme: 'KEIN Druck auf das Auge! Sterile Abdeckung, liegend transportieren, Notruf',
                  icon: '🚨',
                },
                {
                  problem: 'Verätzung (Chlorkonzentrat)',
                  ursache: 'Spritzer beim Umgang mit Chemikalien',
                  massnahme: '15 Min. spülen mit viel Wasser — Augenlid aufhalten! Notruf 112, Notaufnahme',
                  icon: '☢️',
                },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-orange-200">
                  <div className="flex gap-2 mb-1">
                    <span>{item.icon}</span>
                    <p className="font-bold text-orange-800 text-sm">{item.problem}</p>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Ursache: {item.ursache}</p>
                  <p className="text-xs text-emerald-700 font-medium">→ {item.massnahme}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Pupillenkontrolle im Notfall" color="blue">
            <p className="text-sm text-gray-700 mb-2">Wichtiges diagnostisches Zeichen (kurz leuchten mit Taschenlampe):</p>
            {[
              { zustand: 'Gleich groß, reagieren auf Licht', bedeutung: '✅ Normal', farbe: 'green' },
              { zustand: 'Weit & starr', bedeutung: '🔴 Schock, Sauerstoffmangel, Herz-Kreislauf-Stillstand', farbe: 'red' },
              { zustand: 'Ungleich groß', bedeutung: '🔴 Hirnverletzung — sofort Notruf!', farbe: 'red' },
            ].map((item, i) => (
              <div key={i} className={`flex gap-2 p-2 rounded-lg bg-${item.farbe}-50 border border-${item.farbe}-200 mb-1`}>
                <p className="text-xs font-medium text-gray-700 flex-1">{item.zustand}</p>
                <p className="text-xs font-semibold text-gray-700">{item.bedeutung}</p>
              </div>
            ))}
          </Section>
        </div>
      )}

      {activeTab === 'ohr' && (
        <div className="space-y-4">
          <Section title="Aufbau des Ohres">
            <div className="space-y-3">
              {[
                { bereich: 'Außenohr', inhalt: 'Ohrmuschel + Gehörgang → leitet Schall zum Trommelfell', icon: '🔊' },
                { bereich: 'Mittelohr', inhalt: 'Trommelfell + Gehörknöchelchen (Hammer, Amboss, Steigbügel) → Schallverstärkung', icon: '🔔' },
                { bereich: 'Innenohr', inhalt: 'Cochlea (Hörschnecke) → Nervensignale. Vestibularsystem → Gleichgewicht', icon: '🐌' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-white border border-red-200">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-red-800 text-sm">{item.bereich}</p>
                    <p className="text-xs text-gray-600">{item.inhalt}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Badebezogene Ohrprobleme" color="orange">
            <div className="space-y-3">
              {[
                {
                  problem: 'Schwimmerohr (Otitis externa)',
                  ursache: 'Chronische Feuchtigkeit im Gehörgang → Bakterien/Pilze',
                  zeichen: 'Jucken, Schmerz, Druckempfindlichkeit, Ausfluss',
                  massnahme: 'Ohren nach dem Baden trocknen lassen, Ohrenstöpsel, Arzt',
                  icon: '🏊',
                },
                {
                  problem: 'Druckausgleichsstörung (Tauchen)',
                  ursache: 'Eustachische Röhre nicht geöffnet → Druckdifferenz Mittelohr/Wasser',
                  zeichen: 'Schmerz, Druck, Hörverlust, schlimmstenfalls Trommelfellriss',
                  massnahme: 'Valsalva-Manöver, aufsteigen — NICHT bei Schnupfen tauchen',
                  icon: '🤿',
                },
                {
                  problem: 'Fremdkörper im Ohr',
                  ursache: 'Insekten, Schmutzteilchen',
                  massnahme: 'NICHT mit Gegenständen stochern! Seitlich neigen, Wasser einlaufen lassen, HNO-Arzt',
                  zeichen: 'Druckgefühl, Knistern, Hörverlust',
                  icon: '⚠️',
                },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-orange-200 mb-2">
                  <div className="flex gap-2 mb-1">
                    <span>{item.icon}</span>
                    <p className="font-bold text-orange-800 text-sm">{item.problem}</p>
                  </div>
                  <p className="text-xs text-gray-500">Ursache: {item.ursache}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Zeichen: {item.zeichen}</p>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">→ {item.massnahme}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'gleichgewicht' && (
        <div className="space-y-4">
          <Section title="Das Gleichgewichtsorgan">
            <p className="text-sm text-gray-700 mb-3">
              Das Gleichgewichtsorgan sitzt im <strong>Innenohr</strong> (Vestibularapparat).
              Es besteht aus:
            </p>
            <div className="space-y-2">
              {[
                { organ: '3 Bogengänge', fkt: 'Dreh- und Winkelbeschleunigung erkennen (Rotation in allen 3 Ebenen)', icon: '🔄' },
                { organ: 'Utriculus & Sacculus', fkt: 'Lineare Beschleunigung und Schwerkraft (oben/unten, vor/zurück)', icon: '↕️' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-white border border-red-200">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-red-800 text-sm">{item.organ}</p>
                    <p className="text-xs text-gray-600">{item.fkt}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Orientierung unter Wasser" color="blue">
            <p className="text-sm text-gray-700 mb-3">
              Unter Wasser verliert das Gleichgewichtsorgan an Zuverlässigkeit:
            </p>
            <div className="space-y-2">
              {[
                { problem: 'Druckveränderung im Innenohr', folge: 'Schwindel, Orientierungslosigkeit — gefährlich beim Tauchen' },
                { problem: 'Wasser im Ohr', folge: 'Kurzer Reiz des Gleichgewichtsorgans → Drehschwindel' },
                { problem: 'Sehverlust (Brille, Dunkelheit)', folge: 'Gleichgewichtsorgan als einzige Orientierungshilfe unter Wasser' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-blue-50 border border-blue-200 mb-1">
                  <p className="font-semibold text-blue-800 text-sm">{item.problem}</p>
                  <p className="text-xs text-gray-600">→ {item.folge}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 p-3 rounded-lg bg-amber-50 border border-amber-300">
              <p className="text-xs text-amber-700"><strong>Praxistipp:</strong> "Oben" unter Wasser immer anhand der Lichtquelle oder der aufsteigenden Luftblasen orientieren — nicht nach dem Gleichgewichtsgefühl.</p>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'nase' && (
        <div className="space-y-4">
          <Section title="Nase — Funktion & Probleme im Bad">
            <p className="text-sm text-gray-700 mb-3">Die Nase filtert, wärmt und befeuchtet die Atemluft. Im Bad relevante Probleme:</p>
            <div className="space-y-3">
              {[
                {
                  problem: 'Wassereintritt beim Tauchen',
                  detail: 'Chlorhaltiges Wasser reizt Nasenschleimhaut. Viele Schwimmer atmen durch die Nase aus, um Wasser fernzuhalten.',
                  massnahme: 'Nasenklammer beim Tauchen, langsam durch Nase ausatmen',
                },
                {
                  problem: 'Nasenbluten (Epistaxis)',
                  detail: 'Häufig bei trockenem Hallenklima, Stoß, empfindliche Schleimhaut',
                  massnahme: 'Kopf NACH VORNE neigen (nicht zurück!), Nasenlöcher zudrücken, Kühlung, 10 Min. halten',
                },
                {
                  problem: 'Chloramin-Einatmen',
                  detail: 'Schlechte Belüftung + überchliertes Wasser → stechender Chloramingeruch, Hustenreiz, Augenreizung',
                  massnahme: 'Frische Luft, Belüftung verbessern, Wasserqualität prüfen',
                },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-red-200 mb-2">
                  <p className="font-bold text-red-800 text-sm mb-1">👃 {item.problem}</p>
                  <p className="text-xs text-gray-600 mb-1">{item.detail}</p>
                  <p className="text-xs text-emerald-700 font-medium">→ {item.massnahme}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Aspiration — Einatmen von Wasser" color="orange">
            <p className="text-sm text-gray-700 mb-3">
              Beim Beinahe-Ertrinken gelangt Wasser in die Lunge (Aspiration). Formen:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-300">
                <p className="font-bold text-blue-800 text-sm mb-1">Süßwasser-Aspiration</p>
                <p className="text-xs text-blue-700">Gelangt schnell ins Blut, verdünnt es — Lungenödem möglich</p>
              </div>
              <div className="p-3 rounded-lg bg-teal-50 border border-teal-300">
                <p className="font-bold text-teal-800 text-sm mb-1">Salzwasser-Aspiration</p>
                <p className="text-xs text-teal-700">Entzieht dem Gewebe Wasser → konzentrierteres Blut, Lungenödem</p>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-300">
              <p className="font-semibold text-red-800 text-sm">⚠️ Sekundäres Ertrinken!</p>
              <p className="text-xs text-red-700 mt-1">Auch nach scheinbar erfolgreich überstandenem Beinahe-Ertrinken kann es Stunden später zu lebensbedrohlichen Symptomen kommen. Jede Person die Wasser aspiriert hat → Arzt/Krankenhaus!</p>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
