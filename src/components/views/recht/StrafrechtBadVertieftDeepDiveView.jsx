import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const TABS = {
  koerperverletzung: { label: 'Körperverletzung', icon: '🤕' },
  diebstahl: { label: 'Diebstahl & Unterschlagung', icon: '💰' },
  sittlichkeit: { label: 'Sittlichkeit & Voyeurismus', icon: '📷' },
  hausfrieden: { label: 'Hausfrieden & Sonstiges', icon: '🚪' },
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

const ParagraphCard = ({ para, titel, tatbestand, strafe, bad, color = 'red' }) => (
  <div className={`p-4 rounded-xl bg-${color}-50 border border-${color}-200 mb-3`}>
    <div className="flex items-center gap-2 mb-2">
      <span className={`font-mono font-bold text-white bg-${color}-600 px-2 py-0.5 rounded text-xs`}>{para}</span>
      <p className={`font-bold text-${color}-800 text-sm`}>{titel}</p>
    </div>
    <p className="text-xs text-gray-700 mb-1"><strong>Tatbestand:</strong> {tatbestand}</p>
    <p className="text-xs text-gray-700 mb-1"><strong>Strafe:</strong> {strafe}</p>
    {bad && <p className={`text-xs font-medium text-${color}-700`}>🏊 Im Bad: {bad}</p>}
  </div>
);

export default function StrafrechtBadVertieftDeepDiveView({ darkMode }) {
  const [activeTab, setActiveTab] = useState('koerperverletzung');

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 p-5 text-white">
        <div className="text-3xl mb-2">⚖️</div>
        <h2 className="text-xl font-bold">Strafrecht im Bad — Vertiefung</h2>
        <p className="text-emerald-100 text-sm mt-1">
          Körperverletzung, Diebstahl, Voyeurismus, Hausfriedensbruch — Tatbestände & Praxis
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(TABS).map(([id, tab]) => (
          <TabChip key={id} id={id} tab={tab} active={activeTab === id} onClick={setActiveTab} />
        ))}
      </div>

      {activeTab === 'koerperverletzung' && (
        <div className="space-y-4">
          <Section title="Körperverletzungsdelikte im Überblick">
            <p className="text-sm text-gray-700 mb-3">
              Im Schwimmbad können Körperverletzungen durch Badegäste untereinander, aber auch
              durch mangelnde Aufsicht entstehen. Als FAB musst du die Stufen kennen:
            </p>
            <ParagraphCard
              para="§ 223 StGB" titel="Einfache Körperverletzung" color="orange"
              tatbestand="Körperliche Misshandlung oder Gesundheitsschädigung einer anderen Person"
              strafe="Freiheitsstrafe bis 5 Jahre oder Geldstrafe"
              bad="Schlag/Stoß unter Gästen, Rempelei die zur Verletzung führt"
            />
            <ParagraphCard
              para="§ 224 StGB" titel="Gefährliche Körperverletzung" color="red"
              tatbestand="KV mittels Waffe, gefährlichem Werkzeug, hinterlistigem Überfall, gemeinschaftlich oder lebensgefährdend"
              strafe="Freiheitsstrafe 6 Monate bis 10 Jahre"
              bad="Glasflasche als Waffe, Kopf unter Wasser drücken (lebensgefährdend!)"
            />
            <ParagraphCard
              para="§ 226 StGB" titel="Schwere Körperverletzung" color="red"
              tatbestand="Dauerhafter Verlust eines Sinnesorgans, Gliedmaße, dauernde Entstelstellung oder lebensbedrohliche Krankheit"
              strafe="Freiheitsstrafe 1–10 Jahre (minderschwer: 6 Mo.–5 J.)"
              bad="Erblindung nach Chemikalienunfall durch grobe Fahrlässigkeit"
            />
            <ParagraphCard
              para="§ 229 StGB" titel="Fahrlässige Körperverletzung" color="amber"
              tatbestand="Unbeabsichtigte Verletzung durch Sorgfaltspflichtverletzung"
              strafe="Freiheitsstrafe bis 3 Jahre oder Geldstrafe"
              bad="Rutschiger Boden nicht gesichert → Gast stürzt. FAB Gefahr nicht beseitigt."
            />
            <ParagraphCard
              para="§ 225 StGB" titel="Misshandlung von Schutzbefohlenen" color="red"
              tatbestand="Quälen oder rohes Misshandeln von Personen unter Fürsorge/Obhut des Täters — besonders Kinder"
              strafe="Freiheitsstrafe 6 Monate bis 10 Jahre"
              bad="FAB in Kursen mit Kindern — Schutzbefohlenen-Verhältnis besteht!"
            />
          </Section>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-300">
            <p className="font-bold text-blue-800 text-sm mb-1">ℹ️ Strafantrag vs. Offizialdelikt</p>
            <p className="text-xs text-blue-700">
              §223 (einfache KV) ist ein <strong>Antragsdelikt</strong> — Strafverfolgung nur auf Antrag des Opfers.
              §224, §226, §225 sind <strong>Offizialdelikte</strong> — Staatsanwaltschaft ermittelt automatisch, auch ohne Antrag.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'diebstahl' && (
        <div className="space-y-4">
          <ParagraphCard
            para="§ 242 StGB" titel="Diebstahl" color="orange"
            tatbestand="Wegnahme einer fremden beweglichen Sache in der Absicht, sie sich rechtswidrig zuzueignen"
            strafe="Freiheitsstrafe bis 5 Jahre oder Geldstrafe"
            bad="Taschendiebstahl in Umkleiden, Wertsachen aus unverschlossenen Schränken"
          />

          <Section title="Qualifizierter Diebstahl" color="red">
            <div className="space-y-2">
              {[
                { para: '§ 243 StGB', titel: 'Schwerer Diebstahl', detail: 'Aus verschlossenem Behältnis, gewerbsmäßig, als Bandenmitglied — bis 10 Jahre' },
                { para: '§ 244 StGB', titel: 'Diebstahl mit Waffe / Bandendiebstahl', detail: 'Waffe bei sich tragen — bis 10 Jahre Mindeststrafe 6 Monate' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-red-50 border border-red-200">
                  <span className="font-mono font-bold text-red-700 text-xs w-20 flex-shrink-0">{item.para}</span>
                  <div>
                    <p className="font-semibold text-red-800 text-sm">{item.titel}</p>
                    <p className="text-xs text-gray-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <ParagraphCard
            para="§ 246 StGB" titel="Unterschlagung" color="amber"
            tatbestand="Zueignung einer fremden Sache, die der Täter bereits in Besitz hat (kein Wegnehmen nötig)"
            strafe="Freiheitsstrafe bis 3 Jahre oder Geldstrafe"
            bad="Fundsachen nicht abgeben (Fundbüro-Pflicht!), gefundene Wertsachen behalten"
          />

          <ParagraphCard
            para="§ 265a StGB" titel="Erschleichen von Leistungen" color="yellow"
            tatbestand="Benutzen von Verkehrsmitteln, Einrichtungen oder Automaten ohne zu zahlen (Schwarzfahren)"
            strafe="Freiheitsstrafe bis 1 Jahr oder Geldstrafe"
            bad="Unberechtigt ins Bad gelangen (Zaun überklettern, Drehkreuz manipulieren) — auch bei kostenlosem Bad wenn gesperrt"
          />

          <Section title="Maßnahmen für FAB" color="blue">
            <p className="text-sm text-gray-700 mb-2">Bei Diebstahl im Bad:</p>
            {[
              'Täter ansprechen — aber NICHT körperlich festhalten (außer Jedermanns-Festnahme §127 StPO)',
              'Polizei rufen — Strafverfolgung ist Aufgabe der Polizei, nicht des Personals',
              'Zeugen sichern, Situation dokumentieren',
              'Schließfächer auf Beschädigung prüfen, Protokoll führen',
              'Hausverbot aussprechen bei überführten Tätern',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1">
                <CheckCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </Section>
        </div>
      )}

      {activeTab === 'sittlichkeit' && (
        <div className="space-y-4">
          <ParagraphCard
            para="§ 183 StGB" titel="Erregung öffentlichen Ärgernisses" color="orange"
            tatbestand="Exhibitionistische Handlungen die andere belästigen (gilt nur für Männer)"
            strafe="Freiheitsstrafe bis 1 Jahr oder Geldstrafe"
            bad="Entblößen in Umkleiden, auf Liegewiese im Sichtbereich anderer"
          />

          <ParagraphCard
            para="§ 201a StGB" titel="Verletzung des höchstpersönlichen Lebensbereichs durch Bildaufnahmen" color="red"
            tatbestand="Unbefugtes Aufnehmen von Personen in Wohnungen oder gegen Schamgefühl — Verbreiten solcher Aufnahmen"
            strafe="Freiheitsstrafe bis 2 Jahre oder Geldstrafe"
            bad="Heimliche Aufnahmen in Umkleiden, Duschen, unter Badeanzug — auch mit Handy!"
          />

          <Section title="Videoaufnahmen im Schwimmbad" color="orange">
            <p className="text-sm text-gray-700 mb-3">
              Im Bad gelten besondere Regeln für Bild- und Videoaufnahmen:
            </p>
            <div className="space-y-2">
              {[
                {
                  situation: 'Aufnahmen in Umkleiden / Duschen',
                  recht: '§ 201a StGB',
                  bewertung: '❌ Immer strafbar — keine Ausnahme',
                  farbe: 'red',
                },
                {
                  situation: 'Heimliche Aufnahmen von Badegästen ohne Einwilligung',
                  recht: '§ 201a / § 22 KUG',
                  bewertung: '❌ Strafbar + zivilrechtliche Haftung',
                  farbe: 'red',
                },
                {
                  situation: 'Eltern fotografieren eigene Kinder',
                  recht: 'Einwilligung durch Sorgeberechtigte',
                  bewertung: '✅ Erlaubt wenn keine Dritten erkennbar abgebildet',
                  farbe: 'green',
                },
                {
                  situation: 'Videoüberwachung durch Betreiber (Eingangsbereich)',
                  recht: 'DSGVO + § 4 BDSG',
                  bewertung: '✅ Mit Hinweisschild und Rechtsgrundlage erlaubt',
                  farbe: 'green',
                },
                {
                  situation: 'Videoüberwachung von Becken/Umkleiden durch Betreiber',
                  recht: 'DSGVO, Verhältnismäßigkeit',
                  bewertung: '⚠️ Umkleiden nie! Becken nur mit strenger Rechtsprüfung',
                  farbe: 'yellow',
                },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg bg-${item.farbe}-50 border border-${item.farbe}-200`}>
                  <p className="font-semibold text-gray-800 text-sm">{item.situation}</p>
                  <p className="text-xs text-gray-500">Rechtsgrundlage: {item.recht}</p>
                  <p className={`text-xs font-medium text-${item.farbe}-700 mt-0.5`}>{item.bewertung}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Maßnahmen bei Verdacht auf Voyeurismus" color="red">
            {[
              'Person sofort ansprechen und auffordern das Gerät zu zeigen (freiwillig!)',
              'Polizei rufen — Durchsuchung des Handys nur durch Polizei erlaubt',
              'Tatort sichern, Zeugen benennen',
              'Betroffene Personen informieren (DSGVO-Meldepflicht)',
              'Hausverbot aussprechen, Anzeige erstatten',
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start mb-1">
                <span className="font-bold text-red-600 flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </Section>
        </div>
      )}

      {activeTab === 'hausfrieden' && (
        <div className="space-y-4">
          <ParagraphCard
            para="§ 123 StGB" titel="Hausfriedensbruch" color="orange"
            tatbestand="Unbefugtes Eindringen in Wohnung, Geschäftsraum, befriedetes Besitztum ODER Weigerung zu gehen auf Verlangen"
            strafe="Freiheitsstrafe bis 1 Jahr oder Geldstrafe"
            bad="Überklettern des Zauns, Betreten nach Hausverbot, Weigerung zu gehen nach Platzverweis — auch Mitarbeiter die nach Kündigung weiter betreten!"
          />

          <ParagraphCard
            para="§ 303 StGB" titel="Sachbeschädigung" color="red"
            tatbestand="Beschädigen oder Zerstören einer fremden Sache"
            strafe="Freiheitsstrafe bis 2 Jahre oder Geldstrafe"
            bad="Zerstörung von Schließfächern, Einrichtungsgegenständen, Vandalismus auf Liegewiese, Graffiti"
          />

          <ParagraphCard
            para="§ 303a/b StGB" titel="Datenveränderung / Computersabotage" color="red"
            tatbestand="Löschen, Unterdrücken oder Verändern von Daten — auch Betriebscomputer im Bad"
            strafe="Freiheitsstrafe bis 2 / 5 Jahre"
            bad="Manipulation der Messdaten-EDV, Kassen-Hacking"
          />

          <ParagraphCard
            para="§ 13 StGB" titel="Begehen durch Unterlassen" color="amber"
            tatbestand="Wer rechtlich verpflichtet ist, einen Erfolg abzuwenden (Garantenstellung), und es nicht tut, haftet wie ein aktiv Handelnder"
            strafe="Je nach verwirklichtem Delikt"
            bad="FAB sieht Ertrinkenden und greift nicht ein — haftet wie jemand der aktiv handelt"
          />

          <Section title="Zusammenfassung: Typische Delikte im Bad" color="blue">
            <div className="overflow-x-auto rounded-lg border border-blue-200">
              <table className="w-full text-xs">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">§</th>
                    <th className="px-3 py-2 text-left">Delikt</th>
                    <th className="px-3 py-2 text-left">Wer tut es?</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { para: '§ 223', delikt: 'Körperverletzung', wer: 'Gast gegenüber Gast / FAB' },
                    { para: '§ 242', delikt: 'Diebstahl', wer: 'Gast in Umkleiden' },
                    { para: '§ 201a', delikt: 'Bildaufnahmen', wer: 'Voyeure, Handy-Nutzer' },
                    { para: '§ 123', delikt: 'Hausfriedensbruch', wer: 'Personen mit Hausverbot' },
                    { para: '§ 265a', delikt: 'Erschleichen', wer: 'Schwarzfahrer ins Bad' },
                    { para: '§ 303', delikt: 'Sachbeschädigung', wer: 'Vandalen' },
                    { para: '§ 323c', delikt: 'Unterlassene Hilfe', wer: 'FAB / jeder!' },
                    { para: '§ 13', delikt: 'Unterlassen (Garantenst.)', wer: 'FAB als Aufsichtsperson' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                      <td className="px-3 py-2 font-mono font-bold text-blue-800">{row.para}</td>
                      <td className="px-3 py-2 text-gray-800">{row.delikt}</td>
                      <td className="px-3 py-2 text-gray-600">{row.wer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
