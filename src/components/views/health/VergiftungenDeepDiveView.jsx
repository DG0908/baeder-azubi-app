import { useState } from 'react';

const TABS = {
  grundlagen: { label: 'Grundlagen', icon: '☣️' },
  chlor:      { label: 'Chlor & Chemikalien', icon: '🧪' },
  alkohol:    { label: 'Alkohol & Drogen', icon: '🍺' },
  haushalt:   { label: 'Haushalt & Medikamente', icon: '💊' },
  giftnotruf: { label: 'Giftnotruf', icon: '📞' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{title}</h3>}
    {children}
  </div>
);

export default function VergiftungenDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('grundlagen');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-emerald-900/60 to-teal-900/40 border border-emerald-800' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">☣️</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>Vergiftungen im Bäderbetrieb</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Chlorgas, Chemikalien, Alkohol, Drogen — erkennen und richtig handeln</p>
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

      {tab === 'grundlagen' && (
        <div>
          <S title="Aufnahmewege" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Gifte können auf vier Wegen in den Körper gelangen — die Erstmaßnahmen unterscheiden sich entsprechend:
            </p>
            {[
              { weg: 'Inhalativ', icon: '🌬️', detail: 'Über die Lunge — Gase, Dämpfe, Aerosole. Im Bad: Chlorgas, Lösungsmitteldämpfe, Rauch.' },
              { weg: 'Oral', icon: '👄', detail: 'Geschluckt — Putzmittel, Säuren, Laugen, Alkohol, Medikamente, Pflanzenteile (Kinder!).' },
              { weg: 'Dermal', icon: '✋', detail: 'Über die Haut — konzentrierte Säuren/Laugen, Lösungsmittel, Pflanzenschutzmittel.' },
              { weg: 'Parenteral', icon: '💉', detail: 'Unter die Haut — Insektenstiche, Nadelstichverletzungen (selten im Bad).' },
            ].map(({ weg, icon, detail }) => (
              <div key={weg} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{icon} {weg}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{detail}</div>
              </div>
            ))}
          </S>

          <S title="Allgemeine Erstmaßnahmen" darkMode={darkMode}>
            {[
              { nr: '1', text: 'Eigenschutz! Gas/Chemikalie identifizieren — bei Gefahr nicht in den Bereich' },
              { nr: '2', text: 'Patient aus dem Gefahrenbereich bringen' },
              { nr: '3', text: 'Notruf 112 — Substanz, Menge, Zeitpunkt angeben' },
              { nr: '4', text: 'Giftnotruf parallel anrufen — fachliche Beratung (siehe Giftnotruf-Tab)' },
              { nr: '5', text: 'KEIN Erbrechen auslösen ohne Anweisung des Giftnotrufs (außer bei Tabletten und voll bei Bewusstsein)' },
              { nr: '6', text: 'Rest der Substanz / Verpackung sichern → RD übergeben' },
              { nr: '7', text: 'Bei Bewusstlosigkeit: Atmung prüfen, ggf. stabile Seitenlage / HLW' },
            ].map(({ nr, text }) => (
              <div key={nr} className={`flex gap-3 p-2 mb-1 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{nr}</span>
                <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{text}</p>
              </div>
            ))}
          </S>

          <S title="Was NIE tun" darkMode={darkMode}>
            {[
              'KEINE Milch geben (alter Mythos — kann manche Gifte sogar schneller resorbieren lassen)',
              'KEIN Salzwasser zum Erbrechen (Salzvergiftung möglich)',
              'KEIN Erbrechen bei Säuren/Laugen (Speiseröhre wird ein zweites Mal verätzt)',
              'KEIN Erbrechen bei Bewusstlosigkeit (Aspiration)',
              'KEIN Aktivkohle ohne Anweisung — bei manchen Stoffen kontraproduktiv',
              'NICHT „Hausmittel" probieren — Giftnotruf fragen',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-red-500 font-bold">✗</span><span>{it}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'chlor' && (
        <div>
          <S title="Chlorgas — Hochgefahr im Technikraum" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Chlorgas (Cl₂) entsteht z. B. bei Versehentlichem Mischen von <strong>Calcium­hypochlorit + Säure</strong>
              oder Leckagen an der Chlorgasanlage. Eigenschaften:
            </p>
            <div className={`rounded-lg p-3 mb-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <ul className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <li>• Gelblich-grün, stechender Geruch (wie Schwimmbad „extrem")</li>
                <li>• <strong>2,5× schwerer als Luft</strong> — sammelt sich am Boden</li>
                <li>• Stark wasserlöslich → reagiert mit Schleimhäuten zu Salz- und unter­chloriger Säure</li>
                <li>• Tödliche Konzentration bereits bei 1.000 ppm in wenigen Minuten</li>
              </ul>
            </div>
            <div className={`rounded p-3 border-l-4 border-red-500 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>⚠️ Eigenschutz absolut zwingend!</div>
              <div className={`text-xs ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
                Chlorgasraum NIE ohne umluftunabhängiges Atemschutzgerät betreten. Selbst bei Verdacht: Bereich räumen,
                Feuerwehr (112) alarmieren — nicht selbst Held spielen.
              </div>
            </div>
          </S>

          <S title="Symptome Chlorgas­vergiftung" darkMode={darkMode}>
            {[
              ['Augen', 'Brennen, Tränen, Lidkrämpfe — schwer zu öffnen'],
              ['Atemwege', 'Hustenreiz, Heiserkeit, Engegefühl, Atemnot'],
              ['Lunge', 'Lungenödem (verzögert nach 6–24 Std!) — auch wenn Patient nach Exposition zunächst unauffällig wirkt'],
              ['Haut', 'Reizung, Rötung, bei Kontakt mit Konzentrat: Verätzung'],
              ['Allgemein', 'Übelkeit, Kopfschmerz, Bewusstlosigkeit bei hoher Konzentration'],
            ].map(([k, v]) => (
              <div key={k} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>

          <S title="Erstmaßnahmen Chlorgas" darkMode={darkMode}>
            {[
              ['1. Bereich räumen', 'Alle aus dem Gefahrenbereich, niemand zurück, Türen schließen'],
              ['2. Notruf 112', 'Mit Hinweis „Chlorgas" — Feuerwehr braucht Atemschutz'],
              ['3. Frische Luft', 'Patient ins Freie, an erhöhte Stelle (Chlor sammelt sich unten)'],
              ['4. Ruhig halten', 'NICHT laufen lassen — verstärkt Atemnot. Halbsitzend lagern'],
              ['5. Augen spülen', '15–20 Min mit fließendem Wasser, Lider auseinanderhalten'],
              ['6. KEIN Mund-zu-Mund', 'Bei Atemstillstand: Beutelbeatmung (BVM) — Mund-zu-Mund würde Helfer gefährden'],
              ['7. Beobachten 24 h', 'Lungenödem kann verzögert auftreten — auch scheinbar unauffällige Patienten ärztlich überwachen'],
            ].map(([k, v]) => (
              <div key={k} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>

          <S title="Andere Bäder-Chemikalien" darkMode={darkMode}>
            {[
              { stoff: 'Calciumhypochlorit', formel: 'Ca(ClO)₂', gefahr: 'Reagiert mit Säure → Chlorgas. Hautkontakt → Verätzung. Augenkontakt → Erblindung möglich.' },
              { stoff: 'Schwefelsäure', formel: 'H₂SO₄', gefahr: 'pH-Senker — stark ätzend. Hautkontakt: 15–20 Min spülen. NICHT erbrechen lassen!' },
              { stoff: 'Natronlauge', formel: 'NaOH', gefahr: 'pH-Heber — stark ätzend, schädigt Schleimhäute, klebrig auf Haut.' },
              { stoff: 'Flockungsmittel', formel: 'Al-Salze', gefahr: 'Mäßig giftig. Augenreizung möglich, beim Schlucken: viel Wasser, Arzt.' },
            ].map(({ stoff, formel, gefahr }) => (
              <div key={stoff} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{stoff} ({formel})</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{gefahr}</div>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'alkohol' && (
        <div>
          <S title="Alkoholvergiftung" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Im Freibad und an heißen Tagen oft kombiniert mit Sonnenstich, Dehydration und Verletzungsgefahr. Schwer abzugrenzen von Schlaganfall, Hypoglykämie oder anderen Notfällen.
            </p>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Promille</th><th className="text-left p-2">Wirkung</th></tr>
                </thead>
                <tbody>
                  {[
                    ['0,3 ‰', 'Leichte Enthemmung'],
                    ['0,5 ‰', 'Konzentrations-/Reaktionsstörung — KFZ-Grenze'],
                    ['1,0 ‰', 'Sprachstörung, Gleichgewicht beeinträchtigt'],
                    ['1,5–2,0 ‰', 'Rauschstadium — Aggression, Doppelbilder'],
                    ['2,5–3,0 ‰', 'Betäubungsstadium — Erbrechen, Schlaf'],
                    ['> 3,0 ‰', 'Lähmungsstadium — Bewusstlosigkeit, Atemdepression, Lebensgefahr'],
                  ].map(([p, w], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-mono font-bold">{p}</td>
                      <td className="p-2">{w}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>

          <S title="Alkohol-Notfall — Maßnahmen" darkMode={darkMode}>
            {[
              'Bei Bewusstlosigkeit: Stabile Seitenlage (Erstickungsgefahr durch Erbrochenes!)',
              'Atemkontrolle — Atemstillstand: HLW + 112',
              'NICHT zum Erbrechen zwingen',
              'Auskühlung verhindern (Alkohol erweitert Gefäße → Wärmeverlust)',
              'Bei Kindern/Jugendlichen IMMER 112 — Hypoglykämie-Risiko (Leberblockade)',
              'Sturzgefahr: Person nicht alleine lassen, vor Wasser fernhalten',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-emerald-500">→</span><span>{it}</span>
              </div>
            ))}
          </S>

          <S title="Drogen-Notfälle" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Im Bäderbetrieb selten, aber möglich. Erkennungszeichen oft unspezifisch. <strong>Im Zweifel immer 112.</strong>
            </p>
            {[
              { stoff: 'Cannabis', signs: 'Rote Augen, Heißhunger, Lachanfälle, evtl. Panik' },
              { stoff: 'Stimulanzien (Speed, Koks, Crystal)', signs: 'Erweiterte Pupillen, Herzrasen, Aggressivität, Schwitzen' },
              { stoff: 'Opiate (Heroin, Tilidin)', signs: 'Stecknadelkopf-Pupillen, langsame Atmung, Bewusstlosigkeit' },
              { stoff: 'Halluzinogene (LSD, Pilze)', signs: 'Wahrnehmungsstörungen, Angst, Herzrasen, Kreislaufkollaps' },
              { stoff: 'GHB / K.O.-Tropfen', signs: 'Plötzlicher Bewusstseinsverlust nach Getränk — sicher in Erinnerung der Person fehlen Stunden' },
            ].map(({ stoff, signs }) => (
              <div key={stoff} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{stoff}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{signs}</div>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'haushalt' && (
        <div>
          <S title="Haushaltschemikalien" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Im Bad besonders bei Kindern (versehentliches Trinken), bei Reinigungspersonal (Hautkontakt) oder bei Mischen falscher Mittel.
            </p>
            {[
              { stoff: 'Reiniger sauer (z. B. WC-Reiniger)', detail: 'NICHT mit Chlorhaltigen mischen — sonst Chlorgas. Verschluckt: Mund spülen, viel Wasser, NICHT erbrechen.' },
              { stoff: 'Reiniger basisch (z. B. Rohrreiniger)', detail: 'Stark ätzend. Verschluckt: Wasser oder Tee in kleinen Schlucken, NICHT erbrechen, sofort 112.' },
              { stoff: 'Spülmittel', detail: 'Schäumt. Verschluckt: viel Wasser, NICHT erbrechen (Aspirations­gefahr durch Schaum).' },
              { stoff: 'Bleichmittel', detail: 'Mund spülen, Wasser, KEIN Erbrechen.' },
            ].map(({ stoff, detail }) => (
              <div key={stoff} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{stoff}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{detail}</div>
              </div>
            ))}
          </S>

          <S title="Medikamenten-Vergiftung" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Im Bad meist Kinder, die Tabletten geschluckt haben. Bei Erwachsenen: suizidale Absicht oder versehentliche Überdosierung.
            </p>
            {[
              ['Schmerzmittel (Paracetamol)', 'Lebertoxisch — auch ohne Symptome zunächst → 112, Tabletten-Verpackung sichern'],
              ['Schlaf-/Beruhigungsmittel', 'Bewusstseinsstörung, Atemdepression — stabile Seitenlage, 112'],
              ['Insulin (Diabetiker)', 'Hypoglykämie — Modul Hypoglykämie beachten'],
              ['Blutverdünner', 'Innere Blutungen möglich — 112'],
            ].map(([k, v]) => (
              <div key={k} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>

          <S title="Pflanzen & Pilze (Freibad-Garten)" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Im Freibad-Garten gibt es manchmal giftige Pflanzen oder herumliegende Pilze. Kinder probieren gern.
            </p>
            <div className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              <div>→ Hat Kind etwas gegessen? Mund ausspülen, Reste sicherstellen für Identifikation</div>
              <div>→ Sofort Giftnotruf anrufen — meist ist Beobachtung ausreichend, kein Erbrechen ohne Anweisung</div>
              <div>→ Bei Bewusstseinsstörung, Atemnot, Krampfanfall: 112</div>
            </div>
          </S>
        </div>
      )}

      {tab === 'giftnotruf' && (
        <div>
          <S title="Die deutschen Giftnotruf­zentralen" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Bei jeder Vergiftung — auch wenn 112 schon verständigt ist — kann der Giftnotruf wichtige Beratung
              geben. Die Zentralen kennen Antidote, Verläufe und Erstmaßnahmen für tausende Substanzen.
            </p>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Zentrale</th><th className="text-left p-2">Telefon</th><th className="text-left p-2">Zuständig für</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Giftnotruf Berlin', '030 / 19240', 'Berlin, Brandenburg'],
                    ['Giftnotruf Bonn', '0228 / 19240', 'NRW (auch FAB Bezirksregierung Düsseldorf)'],
                    ['Giftnotruf Erfurt', '0361 / 730 730', 'Thüringen, Sachsen, Sachsen-Anhalt'],
                    ['Giftnotruf Freiburg', '0761 / 19240', 'Baden-Württemberg'],
                    ['Giftnotruf Göttingen', '0551 / 19240', 'Niedersachsen, Bremen, Hamburg, Schleswig-Holstein'],
                    ['Giftnotruf Mainz', '06131 / 19240', 'Rheinland-Pfalz, Hessen'],
                    ['Giftnotruf München', '089 / 19240', 'Bayern'],
                    ['Giftnotruf Saar (Homburg)', '06841 / 19240', 'Saarland'],
                  ].map(([z, t, r], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{z}</td>
                      <td className="p-2 font-mono text-emerald-400">{t}</td>
                      <td className="p-2">{r}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Stand: 2025/2026 — Aktualität bitte intern prüfen, Nummern hängen üblicherweise im Erste-Hilfe-Kasten / Technikraum.
            </div>
          </S>

          <S title="Was sage ich beim Anruf?" darkMode={darkMode}>
            {[
              'Wer ist betroffen (Alter, Gewicht, Kind/Erwachsener, Vorerkrankungen)',
              'Welche Substanz (genau: Markenname, Verpackungstext, Wirkstoff)',
              'Wieviel (geschätzt: 1 Schluck, 1 Tablette, 5 Liter Chlor)',
              'Wann (Zeitpunkt der Aufnahme)',
              'Wie geht es jetzt (Bewusstsein, Atmung, Symptome)',
              'Was wurde schon getan (Erbrechen, Wasser gegeben, etc.)',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-emerald-500">→</span><span>{it}</span>
              </div>
            ))}
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-emerald-900/40 border border-emerald-700' : 'bg-emerald-50 border border-emerald-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>📋 Im Bäderbetrieb wichtig</div>
            <div className={`text-xs ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              Sicherheitsdatenblätter (SDB) aller verwendeten Chemikalien müssen griffbereit liegen — Pflicht nach Gefahrstoffverordnung.
              Beim Notfall sofort an die Hand nehmen — der Giftnotruf braucht die genauen Inhaltsstoffe.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
