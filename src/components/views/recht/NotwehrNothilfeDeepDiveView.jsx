import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const TABS = {
  notwehr: { label: 'Notwehr', icon: '🛡️' },
  notstand: { label: 'Notstand', icon: '⚠️' },
  nothilfe: { label: 'Nothilfe', icon: '🤝' },
  festnahme: { label: 'Jedermanns-Festnahme', icon: '✋' },
  pflichtenkollision: { label: 'Pflichtenkollision', icon: '🔀' },
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

export default function NotwehrNothilfeDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('notwehr');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 p-5 text-white">
        <div className="text-3xl mb-2">🛡️</div>
        <h2 className="text-xl font-bold">Notwehr, Nothilfe & Notstand</h2>
        <p className="text-emerald-100 text-sm mt-1">
          Schutz- und Hilfemaßnahmen in Notsituationen — §32, §34, §35 StGB, §127 StPO
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'notwehr' && (
        <div className="space-y-4">
          <Section title="Notwehr — § 32 StGB">
            <p className="text-sm text-gray-700 mb-3">
              Notwehr ist die Verteidigung, die erforderlich ist, um einen gegenwärtigen rechtswidrigen
              Angriff von sich oder einem anderen abzuwenden. Wer in Notwehr handelt, begeht keine
              Straftat — die Tat ist <strong>gerechtfertigt</strong>.
            </p>
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-400 mb-3">
              <p className="font-mono font-bold text-emerald-800 text-sm">§ 32 StGB</p>
              <p className="text-xs text-emerald-700 mt-1">
                „Wer eine Tat begeht, die durch Notwehr geboten ist, handelt nicht rechtswidrig."
              </p>
            </div>
          </Section>

          <Section title="Voraussetzungen der Notwehr" color="blue">
            <div className="space-y-3">
              {[
                {
                  voraus: '1. Notwehrlage',
                  punkte: [
                    'Gegenwärtiger Angriff — er läuft gerade oder steht unmittelbar bevor',
                    'Rechtswidriger Angriff — nicht z.B. Polizei bei rechtmäßiger Festnahme',
                    'Angriff auf einen Rechtswert (Körper, Eigentum, Freiheit)',
                  ],
                  color: 'blue',
                },
                {
                  voraus: '2. Notwehrhandlung',
                  punkte: [
                    'Erforderlich — das mildeste Mittel das den Angriff sicher abwehrt',
                    'Geboten — muss verhältnismäßig sein (kein extremes Missverhältnis)',
                    'Verteidigend — nicht angreifend über das Notwendige hinaus',
                  ],
                  color: 'teal',
                },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-xl bg-${item.color}-50 border border-${item.color}-200`}>
                  <p className={`font-bold text-${item.color}-800 text-sm mb-2`}>{item.voraus}</p>
                  {item.punkte.map((p, j) => (
                    <div key={j} className="flex gap-2 items-start mb-1">
                      <CheckCircle size={13} className={`text-${item.color}-600 flex-shrink-0 mt-0.5`} />
                      <p className="text-xs text-gray-700">{p}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Notwehrüberschreitung — § 33 StGB" color="orange">
            <p className="text-sm text-gray-700 mb-2">
              Wer die Grenzen der Notwehr überschreitet (Übermaß), handelt zwar rechtswidrig,
              kann aber straffrei bleiben wenn er aus <strong>Verwirrung, Furcht oder Schrecken</strong> handelte.
            </p>
            <div className="space-y-2">
              {[
                { fall: 'Erforderlich: Arm wegschlagen', tat: 'Tatsächlich: Schlägt mit Flasche — unverhältnismäßig → Überschreitung', icon: '⚠️' },
                { fall: 'Angreifer liegt am Boden', tat: 'Weiterschlagen obwohl Gefahr vorbei → Rache, kein Notwehr mehr!', icon: '❌' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex gap-2 mb-1">
                    <span>{item.icon}</span>
                    <p className="text-xs font-semibold text-orange-800">Notwehrsituation: {item.fall}</p>
                  </div>
                  <p className="text-xs text-gray-600">{item.tat}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Putativnotwehr" color="yellow">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Putativnotwehr</strong> = Irrtum über das Vorliegen einer Notwehrlage.
              Person glaubt irrtümlich angegriffen zu werden und wehrt sich.
            </p>
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-300">
              <p className="text-xs text-yellow-800">
                Beispiel: Im Bad glaubt jemand, ein anderer greift an — tatsächlich war es ein Spielzeug.
                Putativnotwehr: Irrtum schließt Vorsatz aus, aber fahrlässige Körperverletzung bleibt möglich.
              </p>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'notstand' && (
        <div className="space-y-4">
          <Section title="Rechtfertigender Notstand — § 34 StGB">
            <p className="text-sm text-gray-700 mb-3">
              Beim Notstand besteht eine Gefahr, die nicht durch Notwehr abgewehrt werden kann
              (kein menschlicher Angriff). Man verletzt Rechtsgüter Dritter um eigene oder fremde
              Rechtsgüter zu schützen.
            </p>
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-400 mb-3">
              <p className="font-mono font-bold text-emerald-800 text-sm">§ 34 StGB — Rechtfertigender Notstand</p>
              <p className="text-xs text-emerald-700 mt-1">
                Rechtfertigt die Tat — kein Unrecht wenn das geschützte Interesse das verletzte
                <strong> wesentlich überwiegt</strong>.
              </p>
            </div>
            <div className="space-y-2">
              {[
                { merkmal: 'Gegenwärtige Gefahr', detail: 'Gefahr läuft gerade oder droht unmittelbar' },
                { merkmal: 'Nicht anders abwendbar', detail: 'Es gibt keine gefahrlose Alternative (Subsidiarität)' },
                { merkmal: 'Interessenabwägung', detail: 'Das gerettete Gut muss das verletzte wesentlich überwiegen' },
                { merkmal: 'Angemessenheit', detail: 'Das Mittel muss angemessen sein' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-white border border-emerald-200">
                  <p className="font-semibold text-emerald-800 text-sm w-40 flex-shrink-0">{item.merkmal}</p>
                  <p className="text-xs text-gray-600">{item.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-300">
              <p className="font-semibold text-blue-800 text-sm mb-1">Beispiel im Bad:</p>
              <p className="text-xs text-blue-700">
                FAB bricht eine verschlossene Kabinentür auf (Sachbeschädigung §303), weil
                eine Person darin bewusstlos ist (Lebensgefahr). → Rechtfertigender Notstand!
                Leben &gt;&gt; Tür.
              </p>
            </div>
          </Section>

          <Section title="Entschuldigender Notstand — § 35 StGB" color="orange">
            <p className="text-sm text-gray-700 mb-2">
              Wenn jemand in einer Notstandssituation handelt, aber die Güter <em>nicht</em> wesentlich
              überwiegen — die Tat bleibt rechtswidrig, der Täter ist aber entschuldigt (keine Strafe).
            </p>
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-300">
              <p className="text-xs text-orange-700">
                Voraussetzung: Leibes- oder Lebensgefahr für sich, Angehörige oder nahestehende Personen —
                keine zumutbare andere Möglichkeit. Gilt <strong>nicht</strong> für Personen mit
                Sonderpflichten (Feuerwehr, Polizei, FAB — sie müssen Gefahren in Kauf nehmen!).
              </p>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'nothilfe' && (
        <div className="space-y-4">
          <Section title="Nothilfe — Notwehr für andere">
            <p className="text-sm text-gray-700 mb-3">
              <strong>Nothilfe</strong> ist Notwehr zugunsten eines anderen. Alle Voraussetzungen der
              Notwehr (§32 StGB) gelten auch hier — nur dass man nicht sich selbst, sondern eine
              andere Person verteidigt.
            </p>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-300 mb-3">
              <p className="font-bold text-blue-800 text-sm mb-1">Jeder darf Nothilfe leisten!</p>
              <p className="text-xs text-blue-700">
                Es muss kein besonderes Verhältnis zum Angegriffenen bestehen.
                FAB, Badegast, jeder der Zeuge eines Angriffs wird, darf eingreifen.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300">
              <p className="font-bold text-emerald-800 text-sm mb-1">Beispiel im Bad:</p>
              <p className="text-xs text-emerald-700">
                Ein Gast schlägt einen anderen. FAB schreitet ein und schlägt den Angreifer weg.
                → Nothilfe! Gerechtfertigt solange erforderlich und nicht übermäßig.
              </p>
            </div>
          </Section>

          <Section title="Grenzen der Nothilfe" color="orange">
            <div className="space-y-2">
              {[
                { grenze: 'Verzicht des Angegriffenen', detail: 'Wenn das Opfer selbst nicht möchte dass eingegriffen wird, darf keine Nothilfe geleistet werden (Selbstbestimmungsrecht)' },
                { grenze: 'Überschreitung', detail: 'Gleich wie bei Notwehr: unverhältnismäßige Gegenwehr ist rechtswidrig' },
                { grenze: 'Provokation', detail: 'Wer den Angriff selbst provoziert hat, darf eingeschränkte Nothilfe leisten' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <p className="font-bold text-orange-800 text-sm">{item.grenze}</p>
                  <p className="text-xs text-gray-700 mt-0.5">{item.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="§ 323c StGB — Unterlassene Hilfeleistung" color="red">
            <p className="text-sm text-gray-700 mb-2">
              Nicht nur FAB — <strong>jeder</strong> ist verpflichtet, bei einem Unglücksfall Hilfe zu leisten,
              wenn dies zumutbar ist:
            </p>
            {[
              'Zumutbarkeit: eigene erhebliche Gefahr oder Verletzung anderer Pflichten rechtfertigt Untätigkeit',
              'FAB: erhöhte Pflicht durch Garantenstellung (§13 StGB) — höhere Anforderungen',
              'Strafe: Freiheitsstrafe bis 1 Jahr oder Geldstrafe',
              'Auch Passanten am Beckenrand die einen Ertrinkenden sehen sind zur Hilfe verpflichtet',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1">
                <AlertTriangle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700">{item}</p>
              </div>
            ))}
          </Section>
        </div>
      )}

      {activeTab === 'festnahme' && (
        <div className="space-y-4">
          <Section title="Jedermanns-Festnahme — § 127 StPO">
            <p className="text-sm text-gray-700 mb-3">
              Jeder Bürger — also auch FAB und andere Badegäste — darf unter bestimmten
              Voraussetzungen einen Straftäter vorläufig festhalten, ohne Polizist zu sein.
            </p>
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-400 mb-3">
              <p className="font-mono font-bold text-emerald-800 text-sm">§ 127 Abs. 1 StPO</p>
              <p className="text-xs text-emerald-700 mt-1">
                „Wird jemand auf frischer Tat betroffen oder verfolgt und ist er der Flucht verdächtig
                oder wird seine Identität nicht sogleich festgestellt, so ist jedermann befugt, ihn
                auch ohne richterliche Anordnung vorläufig festzunehmen."
              </p>
            </div>
          </Section>

          <Section title="Voraussetzungen" color="blue">
            <div className="space-y-2">
              {[
                { voraus: '1. Auf frischer Tat betroffen', detail: 'Der Täter wird gerade bei der Tat oder unmittelbar danach beobachtet — nicht Stunden später' },
                { voraus: '2. Fluchtgefahr ODER unbekannte Identität', detail: 'Person will fliehen oder gibt sich nicht zu erkennen — nicht grundlos festhalten!' },
                { voraus: '3. Straftat (nicht Ordnungswidrigkeit)', detail: 'Nur bei echten Straftaten. Ordnungswidrigkeiten (z.B. Falschparken) — kein Festnahmerecht!' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div>
                    <p className="font-bold text-blue-800 text-sm">{item.voraus}</p>
                    <p className="text-xs text-gray-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Was darf man bei der Festnahme?" color="orange">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-300">
                <p className="font-bold text-green-800 text-sm mb-2">✅ Erlaubt</p>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Person festhalten</li>
                  <li>• Flucht verhindern</li>
                  <li>• Erforderliche Gewalt bei Gegenwehr</li>
                  <li>• Person bis Polizei übergeben</li>
                  <li>• Gefahrengut wegnehmen</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-300">
                <p className="font-bold text-red-800 text-sm mb-2">❌ Verboten</p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Verhören / Befragen zwingen</li>
                  <li>• Durchsuchen (nur Polizei!)</li>
                  <li>• Handy / Ausweis wegnehmen</li>
                  <li>• Länger als nötig festhalten</li>
                  <li>• Strafen / Schlagen</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-300">
              <p className="font-bold text-amber-800 text-sm">⚠️ Sofort Polizei rufen!</p>
              <p className="text-xs text-amber-700 mt-1">
                Die Jedermanns-Festnahme ist nur eine <strong>Übergangslösung bis die Polizei eintrifft</strong>.
                Festnahme ohne Polizei-Übergabe ist Freiheitsberaubung (§239 StGB)!
              </p>
            </div>
          </Section>

          <Section title="Praxis im Bad" color="teal">
            <div className="space-y-2">
              {[
                { situation: 'Dieb aus Umkleiden auf frischer Tat ertappt', massnahme: '✅ Festhalten erlaubt — Polizei rufen, Person bis dahin nicht gehen lassen' },
                { situation: 'Verdächtiger der Diebstahl begangen haben könnte', massnahme: '❌ Nur Verdacht reicht NICHT — keine Festnahme, Personalienfeststellung bitten, Polizei rufen' },
                { situation: 'Person mit Hausverbot betritt Bad', massnahme: '⚠️ Zum Verlassen auffordern — bei Weigerung Polizei wegen Hausfriedensbruch (§123 StGB)' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-teal-50 border border-teal-200">
                  <p className="font-semibold text-teal-800 text-sm">{item.situation}</p>
                  <p className="text-xs text-gray-700 mt-0.5">{item.massnahme}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'pflichtenkollision' && (
        <div className="space-y-4">
          <Section title="Rechtfertigende Pflichtenkollision">
            <p className="text-sm text-gray-700 mb-3">
              Eine Pflichtenkollision liegt vor, wenn jemand gleichzeitig zwei Pflichten hat, die
              sich gegenseitig ausschließen — er kann nur eine erfüllen.
            </p>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-300 mb-3">
              <p className="font-bold text-blue-800 text-sm mb-1">Grundsatz</p>
              <p className="text-xs text-blue-700">
                Wenn jemand die <strong>höherwertige Pflicht</strong> erfüllt, handelt er gerechtfertigt —
                auch wenn er die andere Pflicht verletzt. Kein Unrecht, wenn er die wichtigere wählt.
              </p>
            </div>
          </Section>

          <Section title="Klassische Beispiele" color="teal">
            <div className="space-y-3">
              {[
                {
                  titel: 'Zwei Ertrinkende gleichzeitig',
                  beschr: 'FAB kann physisch nur eine Person retten. Rettet er Person A, verletzt er die Pflicht gegenüber Person B — gerechtfertigt, weil er das Mögliche tut.',
                  ergebnis: '✅ Gerechtfertigt — Unmögliches kann nicht verlangt werden',
                  icon: '🏊',
                },
                {
                  titel: 'Aufsicht verlassen für Notruf',
                  beschr: 'FAB muss kurz Becken verlassen um Notruf abzusetzen, weil kein Telefon am Aufsichtsposten ist.',
                  ergebnis: '✅ Höherwertige Pflicht: Leben retten überwiegt Aufsichtspositionspflicht',
                  icon: '📞',
                },
                {
                  titel: 'Schweigepflicht vs. Anzeigepflicht',
                  beschr: 'Mitarbeiter erfährt von geplanter Straftat — Schweigepflicht über Betriebsinterna vs. Pflicht zur Verhinderung.',
                  ergebnis: '✅ Schwere Straftaten verhindern überwiegt Schweigepflicht',
                  icon: '🤫',
                },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white border border-teal-200">
                  <div className="flex gap-2 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="font-bold text-teal-800 text-sm">{item.titel}</p>
                  </div>
                  <p className="text-xs text-gray-700 mb-2">{item.beschr}</p>
                  <p className="text-xs font-semibold text-teal-700">{item.ergebnis}</p>
                </div>
              ))}
            </div>
          </Section>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300">
            <p className="font-bold text-amber-800 text-sm mb-1">Abgrenzung zum Notstand</p>
            <p className="text-xs text-amber-700">
              Bei der Pflichtenkollision erfüllt der Täter <strong>eine Pflicht</strong> — beim Notstand
              verletzt er das Rechtsgut eines unbeteiligten Dritten. Pflichtenkollision ist deshalb
              nur gerechtfertigt wenn er die richtige (höherwertige) Pflicht wählt.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
