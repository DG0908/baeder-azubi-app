import { useState } from 'react';

const TABS = {
  arbeitgeber:  { label: 'Arbeitgeber', icon: '🏢' },
  arbeitnehmer: { label: 'Arbeitnehmer', icon: '👤' },
  ausbilder:    { label: 'Ausbilder (Person)', icon: '👨‍🏫' },
  azubi:        { label: 'Azubi', icon: '🎓' },
  haftung:      { label: 'Haftung & Direktion', icon: '⚖️' },
};

const accent = '#059669';

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{title}</h3>}
    {children}
  </div>
);

const Row = ({ k, v, darkMode }) => (
  <div className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
    <span className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{k}: </span>
    <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
  </div>
);

export default function PflichtenAGANAusbilderDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('arbeitgeber');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-emerald-900/60 to-teal-900/40 border border-emerald-800' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚖️</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>Pflichten im Detail: AG · AN · Ausbilder · Azubi</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Wer hat welche Rechte und Pflichten? — BGB, BBiG, AEVO, GewO im Überblick</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-emerald-600 text-white shadow'
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'arbeitgeber' && (
        <div>
          <S title="Pflichten des Arbeitgebers" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Der Arbeitgeber (AG) hat aus dem Arbeitsvertrag eine Reihe gesetzlich verankerter Pflichten. Sie ergeben sich aus
              <strong> § 611a BGB</strong>, dem Nachweisgesetz, dem ArbSchG und vielen weiteren Spezialgesetzen.
            </p>
            {[
              ['Lohnzahlungspflicht', 'Pünktliche Zahlung der vereinbarten Vergütung (§ 611a BGB)'],
              ['Beschäftigungspflicht', 'AG muss AN tatsächlich beschäftigen — sonst „suspendiert" mit vollem Lohn'],
              ['Fürsorgepflicht', 'Schutz von Leben, Gesundheit, Eigentum und Persönlichkeit (§ 618 BGB, ArbSchG)'],
              ['Schutz vor Diskriminierung', 'AGG (Allgemeines Gleichbehandlungsgesetz) — kein Nachteil wegen Geschlecht, Alter, Religion, Behinderung etc.'],
              ['Mobbingschutz', 'AG muss Belästigung und Mobbing aktiv unterbinden'],
              ['Ausstellung Arbeitszeugnis', 'Bei Ende des Arbeitsverhältnisses (einfaches/qualifiziertes Zeugnis, § 109 GewO)'],
              ['Urlaubsgewährung', 'Mind. 24 Werktage nach BUrlG, oft mehr per Tarif'],
              ['Lohnfortzahlung im Krankheitsfall', '6 Wochen, dann Krankengeld der Krankenkasse (§ 3 EFZG)'],
              ['Datenschutz', 'Persönliche Daten der AN nach DSGVO schützen'],
              ['Steuern und Sozialabgaben', 'Korrekte Abführung an Finanzamt + Sozialversicherung'],
              ['Arbeitsmittel', 'Bereitstellung der nötigen Werkzeuge, Schutzkleidung, Software'],
              ['Unterweisung', 'Regelmäßig in Arbeitsschutz, Brandschutz, Erste Hilfe einweisen'],
            ].map(([k, v], i) => (
              <Row key={i} k={k} v={v} darkMode={darkMode} />
            ))}
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-emerald-900/40 border border-emerald-700' : 'bg-emerald-50 border border-emerald-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>Verletzung der Fürsorgepflicht</div>
            <div className={`text-xs ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              Bei Verletzung der Fürsorgepflicht (z. B. unsichere Arbeitsbedingungen, Mobbing zulassen, fehlende PSA): Schadensersatz, ggf. außerordentliches Kündigungsrecht des AN, Strafanzeige bei Personenschäden.
            </div>
          </div>
        </div>
      )}

      {tab === 'arbeitnehmer' && (
        <div>
          <S title="Pflichten des Arbeitnehmers" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Der Arbeitnehmer (AN) hat als Hauptpflicht die Arbeitsleistung — daneben aber auch eine Reihe von Nebenpflichten,
              die das Arbeitsverhältnis prägen.
            </p>
            {[
              ['Arbeitspflicht (Hauptpflicht)', 'Persönliche Erbringung der vereinbarten Arbeitsleistung'],
              ['Treuepflicht', 'Schutz der berechtigten Interessen des AG'],
              ['Verschwiegenheitspflicht', 'Keine Weitergabe von Betriebs- und Geschäftsgeheimnissen'],
              ['Wettbewerbsverbot', 'Während Arbeitsverhältnis: kein Konkurrenzhandeln. Nachvertraglich nur mit Karenzentschädigung'],
              ['Anzeigepflicht', 'Bei Krankheit, Schäden, Sicherheitsrisiken — unverzüglich melden (AU bei Krankheit i. d. R. ab Tag 4 / je nach Vertrag früher)'],
              ['Sorgfaltspflicht', 'Mit Arbeitsmitteln und Eigentum des AG sorgsam umgehen'],
              ['Weisungsbefolgung', 'Fachliche Weisungen befolgen — soweit zumutbar und legal'],
              ['Annahmepflicht der zugewiesenen Arbeit', 'Im Rahmen des Direktionsrechts (§ 106 GewO)'],
              ['Schadensvermeidung', 'Schäden am AG-Vermögen verhindern oder mindestens melden'],
              ['Datenschutz', 'Schutz der Daten von Kollegen, Kunden, Patienten'],
              ['Urlaubsantrag stellen', 'Urlaub nach BUrlG/Tarifvertrag rechtzeitig beantragen'],
              ['Pünktlichkeit', 'Erscheinen zum vereinbarten Arbeitsbeginn — sonst Abmahnung'],
            ].map(([k, v], i) => (
              <Row key={i} k={k} v={v} darkMode={darkMode} />
            ))}
          </S>

          <S title="Folge bei Pflichtverletzung" darkMode={darkMode}>
            {[
              ['Leichte Verstöße', 'Ermahnung — informeller Hinweis'],
              ['Wiederholte Verstöße', 'Abmahnung (schriftlich, mit Konsequenz-Hinweis)'],
              ['Schwere Pflichtverletzung', 'Außerordentliche Kündigung (§ 626 BGB) möglich'],
              ['Strafrechtsrelevant', 'Diebstahl, Betrug, Urkundenfälschung → Strafanzeige + Kündigung'],
              ['Schaden verursacht', 'Mitschuld nach innerbetrieblichem Schadensausgleich (siehe Tab Haftung)'],
            ].map(([k, v], i) => (
              <Row key={i} k={k} v={v} darkMode={darkMode} />
            ))}
          </S>
        </div>
      )}

      {tab === 'ausbilder' && (
        <div>
          <S title="Wer ist „Ausbilder"? — Person ≠ Betrieb" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <strong>BBiG unterscheidet zwei Rollen:</strong>
            </p>
            {[
              ['Ausbildender (§ 14 BBiG)', 'Der Ausbildungsbetrieb / Arbeitgeber. Vertragspartner des Auszubildenden.'],
              ['Ausbilder (§ 28 BBiG)', 'Die Person, die im Betrieb tatsächlich anleitet. Muss persönlich + fachlich geeignet sein.'],
            ].map(([k, v], i) => (
              <Row key={i} k={k} v={v} darkMode={darkMode} />
            ))}
            <div className={`text-xs mt-3 italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              In kleinen Betrieben kann der Ausbildende auch selbst Ausbilder sein. In größeren Betrieben übernehmen ausgebildete Mitarbeiter die Rolle.
            </div>
          </S>

          <S title="Eignung des Ausbilders" darkMode={darkMode}>
            {[
              ['§ 29 BBiG — Persönliche Eignung', 'Keine Vorstrafen, keine schwere Verfehlung, keine Verletzung der Schutzpflichten gegenüber Jugendlichen'],
              ['§ 30 BBiG — Fachliche Eignung', 'Berufliche Fertigkeiten + berufs- und arbeitspädagogische Kenntnisse (AEVO!)'],
              ['AEVO (Ausbildereignungsverordnung)', '4 Handlungsfelder: Ausbildungsvoraussetzungen prüfen, Ausbildung vorbereiten, durchführen, abschließen'],
              ['AEVO-Prüfung', 'IHK-/HWK-Prüfung, schriftlich + praktisch (ca. 4 Stunden)'],
              ['Meister / höhere Berufsabschlüsse', 'Enthalten i. d. R. den AEVO-Teil — Ausbildereignung damit nachgewiesen'],
              ['Pflicht', 'Wer ohne AEVO ausbildet, riskiert Bußgeld und Untersagung der Ausbildung'],
            ].map(([k, v], i) => (
              <Row key={i} k={k} v={v} darkMode={darkMode} />
            ))}
          </S>

          <S title="Pflichten des Ausbilders (Person)" darkMode={darkMode}>
            {[
              ['Ausbildung planmäßig durchführen', 'Nach betrieblichem Ausbildungsplan und Rahmenlehrplan'],
              ['Fachliche Anleitung', 'Tätigkeiten erklären, vormachen, üben lassen, kontrollieren'],
              ['Ausbildungsmittel', 'Werkzeuge, Materialien, Schutzkleidung kostenlos bereitstellen'],
              ['Berichtsheft kontrollieren', 'Regelmäßig prüfen, gegenzeichnen, zur Prüfung beibringen'],
              ['Beurteilung', 'Halbjährliche Beurteilung des Lernstandes — schriftlich dokumentieren'],
              ['Schutzpflicht', 'Insbesondere bei Jugendlichen: keine gefährlichen Arbeiten zumuten (JArbSchG)'],
              ['Berufsschule', 'Freistellung sicherstellen — Berufsschulzeiten gehören zur Arbeitszeit'],
              ['Prüfungsvorbereitung', 'Inhalte der Zwischen- und Abschlussprüfung vermitteln'],
              ['Probezeit-Beurteilung', 'Während der Probezeit (1–4 Monate) Eignung des Azubis prüfen'],
              ['Ausbildungsmängel beheben', 'Bei Schwierigkeiten: zusätzliche Übung, Stütz­unterricht, ggf. Verlängerung anregen'],
            ].map(([k, v], i) => (
              <Row key={i} k={k} v={v} darkMode={darkMode} />
            ))}
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-amber-900/40 border border-amber-700' : 'bg-amber-50 border border-amber-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>Konsequenzen bei Pflichtverletzung</div>
            <div className={`text-xs ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
              Vernachlässigt der Ausbilder seine Pflichten (z. B. Azubi nur als billige Arbeitskraft genutzt, keine planmäßige Ausbildung): Beschwerde bei der zuständigen Stelle (IHK/HWK), Schlichtungsausschuss, ggf. außerordentliche Kündigung durch Azubi mit Schadensersatzanspruch. Im Wiederholungsfall kann der zuständigen Stelle die Eignung des Ausbilders entziehen.
            </div>
          </div>
        </div>
      )}

      {tab === 'azubi' && (
        <div>
          <S title="Rechte des Azubis (BBiG)" darkMode={darkMode}>
            {[
              ['Angemessene Vergütung', '§ 17 BBiG — Mindest-MAV, höher per Tarifvertrag'],
              ['Urlaub', 'Mind. nach BUrlG; bei Jugendlichen erhöhter Anspruch nach JArbSchG'],
              ['Freistellung Berufsschule', 'Inkl. Wegezeit, gilt als Arbeitszeit'],
              ['Freistellung für Prüfungen', 'Zwischen- und Abschlussprüfung, plus 1 Tag vor schriftlicher Prüfung (Tarif)'],
              ['Ausbildungsmittel kostenlos', 'Werkzeuge, Schutzkleidung, Lehrbücher (soweit vorgeschrieben)'],
              ['Zeugnis', 'Einfaches (Pflicht) oder qualifiziertes (auf Verlangen)'],
              ['Prüfungswiederholung', 'Kostenlos einmalig, mit Verlängerung bis 1 Jahr (auf Antrag)'],
              ['Schutz vor Überforderung', 'Nur ausbildungsrelevante Tätigkeiten, kein „Hilfsarbeiter"'],
              ['Schutz vor Diskriminierung / Mobbing', 'AGG gilt auch für Azubis'],
              ['Mitbestimmung', 'JAV (Jugend- und Auszubildendenvertretung) ab 5 wahlberechtigten Azubis im Betrieb'],
            ].map(([k, v], i) => (
              <Row key={i} k={k} v={v} darkMode={darkMode} />
            ))}
          </S>

          <S title="Pflichten des Azubis (BBiG)" darkMode={darkMode}>
            {[
              ['Lernpflicht', 'Sich um Erwerb der Ausbildungsinhalte bemühen'],
              ['Sorgfältig arbeiten', 'Aufgetragene Tätigkeiten gewissenhaft ausführen'],
              ['Berufsschulpflicht', 'Pflichtbesuch — Fehlen ist nicht akzeptabel'],
              ['Weisungen befolgen', 'Anordnungen des Ausbilders im Rahmen der Ausbildung'],
              ['Berichtsheft führen', 'Täglich oder wöchentlich, ehrlich, vollständig — Voraussetzung zur Prüfung'],
              ['Verschwiegenheit', 'Über Betriebs- und Geschäftsgeheimnisse'],
              ['Sorgsam mit Eigentum', 'Maschinen, Werkzeuge, Material'],
              ['Krankmeldung', 'Unverzüglich, AU spätestens am 4. Tag (oder früher laut Vertrag/JArbSchG)'],
              ['An Prüfungen teilnehmen', 'Zwischen- und Abschlussprüfung'],
              ['Bei Konflikten', 'Erst Gespräch suchen, dann Schlichtungsausschuss / IHK'],
            ].map(([k, v], i) => (
              <Row key={i} k={k} v={v} darkMode={darkMode} />
            ))}
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-emerald-900/40 border border-emerald-700' : 'bg-emerald-50 border border-emerald-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>Wichtig bei Konflikten</div>
            <div className={`text-xs ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              Bei Streit zwischen Azubi und Ausbildungsbetrieb ist NICHT das Arbeitsgericht direkt zuständig — sondern erst der Schlichtungsausschuss bei der zuständigen Stelle (IHK/HWK). Erst nach erfolgloser Schlichtung Klage möglich. Beide Seiten haben Recht auf kostenlose Beratung durch IHK/HWK.
            </div>
          </div>
        </div>
      )}

      {tab === 'haftung' && (
        <div>
          <S title="Direktionsrecht des Arbeitgebers (§ 106 GewO)" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Der Arbeitgeber kann Inhalt, Ort und Zeit der Arbeitsleistung nach billigem Ermessen näher bestimmen — solange
              Vertrag, Tarif, Gesetze und Mitbestimmung das nicht einschränken.
            </p>
            {[
              ['Inhalt der Arbeit', 'Konkrete Aufgaben innerhalb des vertraglich vereinbarten Tätigkeitsbereichs'],
              ['Arbeitsort', 'Versetzung im Betrieb / zwischen Standorten — wenn vertraglich möglich'],
              ['Arbeitszeit', 'Schichteinteilung, Pausen, Mehrarbeit (im Rahmen ArbZG)'],
              ['Verhalten', 'Ordnung im Betrieb, Hausordnung, Kleiderordnung'],
              ['Grenzen', 'Persönlichkeitsrecht, Mitbestimmung des Betriebsrats, Tarifvertrag, Gesetze'],
              ['Konflikt', 'AN kann Weisung verweigern wenn unbillig — sollte aber „unter Vorbehalt" arbeiten und Klage erheben'],
            ].map(([k, v], i) => (
              <Row key={i} k={k} v={v} darkMode={darkMode} />
            ))}
          </S>

          <S title="Innerbetrieblicher Schadensausgleich" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Was passiert, wenn ein AN bei der Arbeit etwas kaputt macht? — Die volle Haftung wäre meist ruinös. Daher hat das BAG ein gestaffeltes Haftungssystem entwickelt:
            </p>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Verschuldensgrad</th><th className="text-left p-2">Haftung des AN</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Leichteste Fahrlässigkeit', 'KEINE Haftung des AN'],
                    ['Leichte/mittlere Fahrlässigkeit', 'Anteilige Haftung — AG trägt Hauptanteil'],
                    ['Grobe Fahrlässigkeit', 'In der Regel volle Haftung — kann begrenzt werden auf zumutbares Maß'],
                    ['Vorsatz', 'Volle Haftung des AN, kein Schutz'],
                  ].map(([s, h], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{s}</td>
                      <td className="p-2 text-emerald-400">{h}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Bei der Bemessung der Haftung werden Schadenshöhe, Lohn des AN, Versicherungsschutz, Risiko der Tätigkeit und Verschuldensgrad gegeneinander abgewogen.
            </div>
          </S>

          <S title="Praxisbeispiele Bäderbetrieb" darkMode={darkMode}>
            {[
              { fall: 'AG verlangt Mitarbeit am Sonntag, Vertrag erlaubt nur Mo–Fr', recht: 'Direktionsrecht überschritten — AN kann verweigern, Lohn nicht verlieren' },
              { fall: 'AN beschädigt versehentlich Filteranlage durch Unachtsamkeit', recht: 'Mittlere Fahrlässigkeit — anteilige Haftung, AG trägt Hauptanteil' },
              { fall: 'AN dosiert vorsätzlich falsch, um Probleme zu provozieren', recht: 'Vorsatz — volle Haftung + außerordentliche Kündigung + ggf. Strafanzeige' },
              { fall: 'AN vergisst Stoßchlorung, Wasser wird unbenutzbar', recht: 'Grobe Fahrlässigkeit (je nach Umständen) — anteilige Haftung möglich' },
              { fall: 'Azubi wird von Ausbilder geschickt, ohne Anleitung den Chlorraum zu betreten', recht: 'Verletzung der Fürsorge-/Schutzpflicht des AG/Ausbilders — Azubi hat Anspruch auf Schadensersatz' },
            ].map(({ fall, recht }, i) => (
              <div key={i} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{fall}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>→ {recht}</div>
              </div>
            ))}
          </S>
        </div>
      )}
    </div>
  );
}
