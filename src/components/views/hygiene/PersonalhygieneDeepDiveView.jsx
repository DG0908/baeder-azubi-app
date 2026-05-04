import { useState } from 'react';

const TABS = {
  haende:     { label: 'Händehygiene', icon: '🤲' },
  kleidung:   { label: 'Berufskleidung', icon: '👕' },
  haut:       { label: 'Hautschutz', icon: '🧴' },
  impfungen:  { label: 'Impfungen & G35', icon: '💉' },
  alltag:     { label: 'Alltag im Bad', icon: '🏊' },
};

const S = ({ title, children, darkMode }) => (
  <div className={`rounded-xl border p-4 mb-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
    {title && <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{title}</h3>}
    {children}
  </div>
);

export default function PersonalhygieneDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('haende');

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-2xl p-5 mb-5 ${darkMode ? 'bg-gradient-to-br from-cyan-900/60 to-teal-900/40 border border-cyan-800' : 'bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧤</span>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>Personalhygiene</h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Hände, Hautschutz, Berufskleidung, Impfungen</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-cyan-600 text-white shadow'
              : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'haende' && (
        <div>
          <S title="Hände-Hygiene — die wichtigste Maßnahme" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Über 80 % aller infektiösen Krankheiten werden über die Hände übertragen. Im Bad ist Händehygiene
              die einfachste und wirksamste Maßnahme zum Schutz von Personal und Gästen.
            </p>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr><th className="text-left p-2">Methode</th><th className="text-left p-2">Wann?</th></tr>
                </thead>
                <tbody>
                  {[
                    ['Händewaschen', 'Sichtbar verschmutzt, vor Pause, nach Toilette, vor Essen'],
                    ['Hygienische Händedesinfektion', 'Vor Tätigkeit am Patienten/Gast, nach Kontakt mit Körperflüssigkeit, nach Handschuhen'],
                    ['Chirurgische Händedesinfektion', 'Im Bad nicht relevant — nur OP-Bereich'],
                    ['Handschuhe + Desinfektion', 'Bei Blutkontakt, Erbrechen-Aufwischen, Erste Hilfe'],
                  ].map(([m, w], i) => (
                    <tr key={i} className={`border-t ${darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
                      <td className="p-2 font-medium">{m}</td>
                      <td className="p-2">{w}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>

          <S title="6-Schritte-Methode (RKI/WHO)" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Bei Händedesinfektion 30 Sek. einreiben, alle Stellen erreichen:
            </p>
            {[
              ['1. Handflächen', 'Mit Handflächen aneinander reiben'],
              ['2. Handrücken', 'Rechte Handfläche über linken Handrücken (und umgekehrt) — mit gespreizten Fingern'],
              ['3. Finger­zwischenräume', 'Handflächen ineinander, Finger gespreizt — gegenseitig durchziehen'],
              ['4. Außenseite Finger', 'Außenseiten der Finger gegen die Innenflächen reiben — Finger ineinandergreifen'],
              ['5. Daumen', 'Daumen kreisend in der jeweils anderen Handfläche'],
              ['6. Fingerkuppen', 'Fingerkuppen kreisend in der jeweils anderen Handfläche'],
            ].map(([k, v], i) => (
              <div key={i} className={`flex gap-3 p-2 mb-1 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <span className={`text-xs font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-700'} min-w-[110px]`}>{k}</span>
                <span className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{v}</span>
              </div>
            ))}
          </S>

          <S title="5 Indikationen (WHO)" darkMode={darkMode}>
            {[
              '1. Vor Patienten-/Gastkontakt',
              '2. Vor aseptischen Tätigkeiten (z. B. Wundversorgung)',
              '3. Nach Kontakt mit potenziell infektiösem Material',
              '4. Nach Patienten-/Gastkontakt',
              '5. Nach Kontakt mit Patienten-Umgebung',
            ].map((it, i) => (
              <div key={i} className={`text-xs mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{it}</div>
            ))}
          </S>
        </div>
      )}

      {tab === 'kleidung' && (
        <div>
          <S title="Berufskleidung im Bäderbetrieb" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Berufskleidung schützt vor Kontamination, signalisiert Funktion (Aufsicht erkennbar) und erfüllt
              Hygiene­vorgaben. Privatkleidung im Dienst ist im Beckenbereich unzulässig.
            </p>
            {[
              { teil: 'Aufsicht-T-Shirt / Polo', funktion: 'Signal­farbe (rot/orange), kennzeichnet Aufsichtsperson für Gäste. Atmungsaktiv, schnelltrocknend.' },
              { teil: 'Badehose / Badeanzug', funktion: 'Sportlich, funktional. Bei Notrettung: Sofort wasser-einsatzbereit. Eigene Hygiene beachten.' },
              { teil: 'Berufsschuhe', funktion: 'Rutschsicher (Klasse SRC nach DIN EN ISO 13287), wasserabweisend, leicht zu reinigen. Im Beckenbereich Barfuß-Schuhe oder Antirutsch-Sandalen.' },
              { teil: 'Schutzkleidung Technikraum', funktion: 'Bei Chemikalienarbeiten: Schürze, Schutzbrille, Handschuhe (Material je Stoff). Spezielle Arbeitskleidung — getrennt von Aufsichtskleidung.' },
              { teil: 'Reinigungskleidung', funktion: 'Eigene Kleidung beim Putzen — getrennt vom Aufsichts­dienst tragen.' },
            ].map(({ teil, funktion }, i) => (
              <div key={i} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{teil}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{funktion}</div>
              </div>
            ))}
          </S>

          <S title="Wechsel & Reinigung" darkMode={darkMode}>
            {[
              'Berufskleidung mindestens täglich wechseln — bei Verschmutzung sofort',
              'Trennung Berufs- und Privatkleidung in eigenem Spind',
              'Reinigung durch Arbeitgeber gestellt oder bezahlt (Bekleidungsordnung)',
              'Schuhe nach Wassersport / Reinigung trocknen lassen — Pilzprävention',
              'Bei Bissverletzung / Blutkontamination: sofort wechseln, kontaminierte Kleidung gesondert',
            ].map((it, i) => (
              <div key={i} className={`flex gap-2 items-start mb-1 text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className="text-cyan-500">→</span><span>{it}</span>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'haut' && (
        <div>
          <S title="Hautschutz im Schwimmbad" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Bademeister haben einen der hautbelastendsten Berufe: ständig Chlor, feuchte Luft, häufiges
              Händewaschen, Desinfektionsmittel. Die <strong>Berufskrankheit BK 5101</strong> (Hauterkrankungen)
              ist im Bäderwesen häufig — Prävention ist Pflicht des Arbeitgebers.
            </p>
            <div className={`rounded-lg p-3 mb-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>3-Schritt-Hautschutzplan (TRGS 401 / DGUV)</div>
              <ul className={`text-xs space-y-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <li><strong>1. Hautschutz</strong> (vor der Arbeit): Schutzcreme — bildet Barriere gegen Wasser/Chemie</li>
                <li><strong>2. Hautreinigung</strong> (nach der Arbeit): Mildes Reinigungsmittel, kein scharfes Lösungsmittel</li>
                <li><strong>3. Hautpflege</strong> (Pause / Feierabend): Pflegecreme — regeneriert die Hautbarriere</li>
              </ul>
            </div>
          </S>

          <S title="Häufige Probleme" darkMode={darkMode}>
            {[
              { typ: 'Trockene/rissige Haut', ursache: 'Häufiges Händewaschen, Chlor, Desinfektion → Talg-/Lipidverlust', massnahme: 'Pflegecreme, Handschuhe wenn möglich, Hautschutzplan' },
              { typ: 'Kontaktekzem', ursache: 'Allergische Reaktion auf Chemikalien (Chlor, Konservierungsstoffe)', massnahme: 'Hautarzt aufsuchen, Allergie-Test, ggf. Berufskrankheit melden' },
              { typ: 'Fußpilz', ursache: 'Warme Feuchtigkeit, barfuß auf Gemeinschaftsflächen', massnahme: 'Eigene Schuhe/Sandalen, Trocknen, Antimykotikum' },
              { typ: 'Augenreizung', ursache: 'Chloraminbelastung in der Hallenluft', massnahme: 'Frischluft, Lüftung verbessern, Augenarzt bei länger anhaltenden Beschwerden' },
              { typ: 'Atemwegsreizung', ursache: 'Chloramine, hohe Luftfeuchtigkeit', massnahme: 'Lüftung, Duschpflicht der Gäste durchsetzen, ggf. arbeitsmedizinische Untersuchung' },
            ].map(({ typ, ursache, massnahme }, i) => (
              <div key={i} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{typ}</div>
                <div className={`text-xs mb-0.5 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}><strong>Ursache:</strong> {ursache}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}><strong>Maßnahme:</strong> {massnahme}</div>
              </div>
            ))}
          </S>
        </div>
      )}

      {tab === 'impfungen' && (
        <div>
          <S title="Impfungen für Bäder-Personal" darkMode={darkMode}>
            <p className={`text-xs mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Im Schwimmbad besteht erhöhtes Infektionsrisiko durch Aerosole, Wasser, Erste-Hilfe-Kontakt.
              Die Ständige Impfkommission (STIKO) empfiehlt für Beschäftigte im Gesundheits- und Bäderwesen:
            </p>
            {[
              ['Tetanus / Diphtherie', 'Auffrischung alle 10 Jahre — Pflicht'],
              ['Hepatitis B', 'Empfohlen — 3-Dosen-Schema, Auffrischung nach Antikörper­titer'],
              ['Hepatitis A', 'Empfohlen für Schwimmbad-Personal — wenig Kosten, hoher Nutzen'],
              ['Pertussis (Keuchhusten)', 'Bei Kombi-Impfung Td-IPV-Pertussis empfohlen'],
              ['MMR (Masern, Mumps, Röteln)', 'Pflicht nach Masernschutzgesetz — wer nach 1970 geboren ist und im öffentlichen Bereich arbeitet'],
              ['Influenza (Grippe)', 'Jährlich empfohlen für Beschäftigte im Publikumsverkehr'],
              ['COVID-19', 'Nach STIKO-Empfehlung'],
            ].map(([imp, info], i) => (
              <div key={i} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{imp}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{info}</span>
              </div>
            ))}
          </S>

          <S title="Arbeitsmedizinische Vorsorge" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Nach ArbMedVV (Verordnung zur arbeitsmedizinischen Vorsorge) sind verschiedene Untersuchungen
              vorgesehen:
            </p>
            {[
              ['G 24', 'Hauterkrankungen — Pflicht bei Tätigkeit mit Feuchtarbeit > 4 h/Tag oder Chemikalien­kontakt'],
              ['G 26.1 / G 26.3', 'Atemschutzgeräte — bei Trägern von Atemschutz (z. B. Chlorraum)'],
              ['G 35', 'Auslandstätigkeit (Tropen) — selten relevant'],
              ['G 41', 'Arbeit auf Absturzgefahrstellen (Schwimmbecken-Reinigung mit Höhenrisiko)'],
              ['Allgemein', 'Erstuntersuchung vor Beschäftigungsbeginn, regelmäßige Nachuntersuchungen'],
            ].map(([k, v], i) => (
              <div key={i} className={`py-1.5 border-b last:border-0 text-xs ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`font-semibold ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{k}: </span>
                <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{v}</span>
              </div>
            ))}
          </S>

          <S title="Belehrung nach Infektionsschutzgesetz (§ 43 IfSG)" darkMode={darkMode}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Wer im Bistro/Imbiss eines Schwimmbads Lebensmittel verarbeitet, braucht eine Erstbelehrung durch
              das Gesundheitsamt (oder einen vom Gesundheitsamt beauftragten Arzt) nach <strong>§ 43 IfSG</strong>.
              Auffrischung jährlich durch den Arbeitgeber. Ohne diese Bescheinigung kein Lebensmittelkontakt.
            </p>
          </S>
        </div>
      )}

      {tab === 'alltag' && (
        <div>
          <S title="Personal­hygiene im täglichen Bäderbetrieb" darkMode={darkMode}>
            {[
              { titel: '🚿 Vor dem Dienst', text: 'Duschen vor Dienstbeginn — Pflicht für alle, die ins Wasser gehen. Saubere Berufskleidung anziehen. Hände waschen + desinfizieren.' },
              { titel: '🧤 Beim Einsatz', text: 'Bei Erste Hilfe immer Einmalhandschuhe. Bei Blutkontakt zusätzlich Schutzbrille. Nach Einsatz Handschuhe entsorgen, Hände desinfizieren.' },
              { titel: '🤧 Krank zur Arbeit?', text: 'Bei Magen-Darm-Beschwerden, Erkältung mit Fieber, Hautausschlag: AU-Pflicht und Tätigkeitsverbot bei Lebensmittel- und engem Gästekontakt (§ 42 IfSG).' },
              { titel: '🍽️ Essen & Trinken', text: 'Im Beckenbereich verboten — auch fürs Personal. In der Pause separater Aufenthaltsraum, Hände vorher waschen.' },
              { titel: '💅 Schmuck & Nägel', text: 'Bei Erste Hilfe / Wundversorgung Schmuck ablegen (Verletzungs- und Hygienerisiko). Künstliche Fingernägel sind in der Hygiene kritisch.' },
              { titel: '🧠 Vorbild­funktion', text: 'Personal ist Vorbild. Wer selbst nicht duscht oder Regeln bricht, setzt sie auch nicht durch.' },
            ].map(({ titel, text }, i) => (
              <div key={i} className={`rounded-lg p-3 mb-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{titel}</div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{text}</div>
              </div>
            ))}
          </S>

          <div className={`rounded-xl p-4 ${darkMode ? 'bg-cyan-900/40 border border-cyan-700' : 'bg-cyan-50 border border-cyan-300'}`}>
            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>📋 Tätigkeitsverbot nach § 42 IfSG</div>
            <div className={`text-xs ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
              Bei Verdacht auf Cholera, Typhus, Shigellen-Ruhr, Hepatitis A/E, infektiöse Gastroenteritis,
              Salmonellen, EHEC u. a. besteht <strong>sofortiges Tätigkeitsverbot</strong> für Mitarbeiter
              mit Lebensmittelkontakt. Meldung an Gesundheitsamt durch Arbeitgeber.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
