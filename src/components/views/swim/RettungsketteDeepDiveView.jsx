import { useState } from 'react';

const TABS = {
  glieder: 'Die 4 Glieder',
  erkennen: 'Erkennen',
  alarmieren: 'Alarmieren & Bergen',
  hlw: 'HLW bis Übergabe',
  rollen: 'Rollen im Bad',
};

const InfoBox = ({ title, items, dark, color = '#0891b2' }) => (
  <div style={{ background: dark ? '#0f172a' : '#f0f9ff', border: `1px solid ${color}40`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
    <div style={{ fontWeight: 700, color: color, marginBottom: 8 }}>{title}</div>
    {items.map((it, i) => (
      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, color: dark ? '#e2e8f0' : '#1e293b', fontSize: 14 }}>
        <span style={{ color: color, fontWeight: 700, minWidth: 14 }}>•</span>
        <span>{it}</span>
      </div>
    ))}
  </div>
);

const GliedCard = ({ nr, name, desc, details, color, dark }) => (
  <div style={{ display: 'flex', gap: 14, marginBottom: 18, alignItems: 'flex-start' }}>
    <div style={{ background: color, color: '#fff', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>{nr}</div>
    <div style={{ flex: 1, background: dark ? '#1e293b' : '#f8fafc', border: `1px solid ${color}40`, borderRadius: 10, padding: 12 }}>
      <div style={{ fontWeight: 700, color: color, fontSize: 15, marginBottom: 4 }}>{name}</div>
      <div style={{ color: dark ? '#e2e8f0' : '#1e293b', fontSize: 13, marginBottom: 6 }}>{desc}</div>
      {details && details.map((d, i) => (
        <div key={i} style={{ fontSize: 12, color: dark ? '#94a3b8' : '#64748b', display: 'flex', gap: 6 }}>
          <span style={{ color: color }}>→</span><span>{d}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function RettungsketteDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('glieder');
  const dark = darkMode;
  const bg = dark ? '#0f172a' : '#ffffff';
  const cardBg = dark ? '#1e293b' : '#f8fafc';
  const text = dark ? '#e2e8f0' : '#1e293b';
  const sub = dark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>Schwimmen & Rettung</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 4 }}>Rettungskette</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Die 4 Glieder der Rettungskette — von der Erkennung bis zur Übergabe an den Rettungsdienst</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? '#0891b2' : cardBg,
              color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {/* 4 GLIEDER */}
        {tab === 'glieder' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 6 }}>Die 4 Glieder der Rettungskette</h2>
            <p style={{ color: text, fontSize: 13, marginBottom: 20 }}>Die Rettungskette ist das Grundprinzip der Notfallversorgung. Jedes Glied muss greifen — ein fehlendes Glied kann Leben kosten.</p>

            <GliedCard nr="1" name="Erkennen" color="#ef4444"
              desc="Gefahr und Notfall erkennen — schnell und richtig einschätzen."
              details={['Stilles Ertrinken erkennen', 'Bewusstlosigkeit feststellen', 'Situation einschätzen: allein oder Hilfe vorhanden?']}
              dark={dark}
            />
            <GliedCard nr="2" name="Alarmieren" color="#f97316"
              desc="Notruf absetzen und Hilfe organisieren — parallel zur Rettungsmaßnahme."
              details={['Notruf 112 (Feuerwehr / RD)', 'W-Fragen beachten', 'Andere Besucher einweisen: „Sie rufen den Notruf!"']}
              dark={dark}
            />
            <GliedCard nr="3" name="Bergen" color="#eab308"
              desc="Person sicher aus dem Wasser holen — mit Hilfsmittel wenn möglich."
              details={['Stange / Ring / Leine zuerst', 'Direktrettung wenn nötig', 'HWS-Schutz beachten']}
              dark={dark}
            />
            <GliedCard nr="4" name="Ersthelfen" color="#22c55e"
              desc="Lebensrettende Sofortmaßnahmen bis Rettungsdienst eintrifft."
              details={['Bewusstsein & Atmung prüfen', 'HLW 30:2 wenn kein Puls', 'AED anwenden', 'Stabile Seitenlage wenn atmend']}
              dark={dark}
            />

            <div style={{ background: dark ? '#0c1a2e' : '#eff6ff', border: '1px solid #3b82f640', borderRadius: 12, padding: 14, marginTop: 4 }}>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginBottom: 6 }}>Wichtig: Kette darf nicht reißen</div>
              <p style={{ color: text, fontSize: 13, margin: 0 }}>Alle 4 Glieder müssen gleichzeitig anlaufen wo möglich. Beim Einzelretter: Notruf über Lautsprecher / Dritte, dann sofort Rettung + HLW.</p>
            </div>
          </div>
        )}

        {/* ERKENNEN */}
        {tab === 'erkennen' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Notfall erkennen</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: dark ? '#2d1515' : '#fef2f2', border: '1px solid #dc262640', borderRadius: 10, padding: 12 }}>
                <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>Aktives Ertrinken</div>
                {['Schreien, Rufen um Hilfe', 'Arme schlagen auf Wasser', 'Körper aufrecht, hektisch', 'Kopf weit im Nacken', 'Deutlich sichtbar'].map((it, i) => (
                  <div key={i} style={{ fontSize: 13, color: dark ? '#e2e8f0' : '#1e293b', display: 'flex', gap: 6, marginBottom: 3 }}>
                    <span style={{ color: '#dc2626' }}>!</span><span>{it}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: dark ? '#0c2d1a' : '#f0fdf4', border: '1px solid #22c55e40', borderRadius: 10, padding: 12 }}>
                <div style={{ fontWeight: 700, color: '#16a34a', marginBottom: 8 }}>Stilles Ertrinken</div>
                {['Kein Schreien möglich', 'Arme seitlich im Wasser', 'Aufrechte Position', 'Glasiger, leerer Blick', 'Mund an/unter Wasseroberfläche'].map((it, i) => (
                  <div key={i} style={{ fontSize: 13, color: dark ? '#e2e8f0' : '#1e293b', display: 'flex', gap: 6, marginBottom: 3 }}>
                    <span style={{ color: '#16a34a' }}>⚠</span><span>{it}</span>
                  </div>
                ))}
              </div>
            </div>

            <InfoBox title="Warum stilles Ertrinken so gefährlich ist" dark={dark} color="#7c3aed" items={[
              'Instinktive Ertrinkreaktion: Körper versucht reflexartig zu atmen — kein Ruf möglich',
              'Person sieht aus als würde sie spielen oder treiben',
              'Ohne aktive Aufsicht wird es oft zu spät erkannt',
              'Zeitfenster aktiv: ca. 20–60 Sekunden nach Eintauchen',
            ]} />

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Bewusstlosigkeit erkennen</div>
              {[
                ['Ansprechen', 'Laut und deutlich: „Alles in Ordnung?" — keine Reaktion?'],
                ['Anfassen', 'Schulter schütteln — keine Reaktion?'],
                ['Atmungskontrolle', '10 Sekunden: Brust bewegt sich? Atemgeräusche?'],
                ['Puls', 'Optional: Halsschlagader (A. carotis) — für Laien oft unzuverlässig'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#0891b2', fontWeight: 700, minWidth: 110 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALARMIEREN & BERGEN */}
        {tab === 'alarmieren' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Alarmieren & Bergen</h2>

            <div style={{ background: dark ? '#0c1a2e' : '#eff6ff', border: '1px solid #3b82f640', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginBottom: 10, fontSize: 15 }}>Notruf 112 — die 5 W-Fragen</div>
              {[
                ['WO?', 'Genaue Adresse: „Hallenbad XY, Musterstraße 1, Raum Becken 2"'],
                ['WAS?', 'Was ist passiert: „Person ertrunken, bewusstlos"'],
                ['WIE VIELE?', 'Anzahl der Betroffenen'],
                ['WELCHE?', 'Art der Verletzung / des Notfalls'],
                ['WARTEN', 'Nicht auflegen — Rückfragen des Disponenten abwarten!'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 7, fontSize: 13 }}>
                  <span style={{ color: '#3b82f6', fontWeight: 800, minWidth: 80, fontSize: 14 }}>{k}</span>
                  <span style={{ color: dark ? '#e2e8f0' : '#1e293b' }}>{v}</span>
                </div>
              ))}
            </div>

            <InfoBox title="Parallel alarmieren" dark={dark} color="#0891b2" items={[
              'Lautsprecheranlage: „Bitte alle Besucher verlassen sofort das Becken"',
              'Anderen Mitarbeiter alarmieren: einer ruft 112, anderer rettet',
              'Zeugen einweisen: „Sie! Rufen Sie den Notruf 112!"',
              'AED und Sauerstoffgerät von zweiter Person holen lassen',
            ]} />

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Bergen — Prioritäten</div>
              {[
                ['1. Hilfsmittel', 'Stange / Ring / Leine — kein Körperkontakt'],
                ['2. Körperkontakt', 'Wenn Hilfsmittel nicht reicht — von hinten'],
                ['3. HWS-Schutz', 'Bei Sturz/Tauchunfall: Spineboard einsetzen'],
                ['4. Bergung', 'Über Rand oder Treppe — mind. 2 Helfer'],
                ['5. Position', 'Flach auf den Rücken legen, Atemwege freimachen'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#0891b2', fontWeight: 700, minWidth: 130 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HLW BIS ÜBERGABE */}
        {tab === 'hlw' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>HLW bis Übergabe an den Rettungsdienst</h2>

            <div style={{ background: dark ? '#2d1515' : '#fef2f2', border: '1px solid #dc262640', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 4, fontSize: 15 }}>Algorithmus: Kein Bewusstsein, keine Atmung</div>
              <div style={{ fontSize: 11, color: dark ? '#94a3b8' : '#64748b', marginBottom: 10, fontStyle: 'italic' }}>Lernhilfe nach den ERC-Leitlinien (European Resuscitation Council 2021). Offizieller ERC-Algorithmus: <strong>Prüfen → Rufen → Drücken</strong>.</div>
              {[
                { step: 'A', label: 'Ansprechen & Anfassen', desc: 'Laut ansprechen, Schulter schütteln. Keine Reaktion?' },
                { step: 'B', label: 'Beatmung prüfen', desc: 'Atemwege freimachen (Kopf überstrecken, Kinn anheben), max. 10 Sek. auf Atmung achten' },
                { step: 'C', label: 'Call 112', desc: 'Notruf absetzen (lassen) — AED holen lassen' },
                { step: 'D', label: 'Drücken 30×', desc: 'Herzdruckmassage: 30× mit beiden Händen, 5–6 cm tief, 100–120/min' },
                { step: 'E', label: 'Einblasen 2×', desc: 'Beatmung: 2 Atemstöße, ca. 1 Sek. pro Stoß' },
                { step: 'F', label: 'Fortführen', desc: 'Rhythmus 30:2 weiterführen bis AED da oder RD übernimmt' },
              ].map(({ step, label, desc }, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ background: '#dc2626', color: '#fff', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: 12 }}>{step}</div>
                  <div>
                    <span style={{ fontWeight: 700, color: dark ? '#fca5a5' : '#991b1b', fontSize: 13 }}>{label}: </span>
                    <span style={{ color: dark ? '#e2e8f0' : '#1e293b', fontSize: 13 }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <InfoBox title="AED — Einsatz bei Ertrinken" dark={dark} color="#7c3aed" items={[
              'Person abtrocknen vor AED-Einsatz!',
              'AED anlegen — Elektroden auf trockener Haut',
              'AED entscheidet ob Schock nötig — Anweisung folgen',
              'HLW nicht unterbrechen während AED analysiert (kurze Pause bei Analyse)',
            ]} />

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Übergabe an den Rettungsdienst</div>
              {[
                ['Was passiert?', 'Kurze Schilderung: Ertrunken, wie lange bewusstlos, Maßnahmen'],
                ['HLW-Dauer', 'Wie lange wurde HLW durchgeführt?'],
                ['AED?', 'Wurde AED eingesetzt? Wie viele Schocks?'],
                ['Zustand', 'Hat Person wieder geatmet? Puls? Reaktion?'],
                ['Weiteres', 'Vorerkrankungen bekannt? Alkohol/Drogen?'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#0891b2', fontWeight: 700, minWidth: 110 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROLLEN IM BAD */}
        {tab === 'rollen' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Rollen & Zuständigkeiten im Notfall</h2>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Aufgabenverteilung (3-Personen-Betrieb)</div>
              {[
                ['Bademeister 1', 'Notruf 112 absetzen, Lautsprecher, Besucher einweisen, AED holen'],
                ['Bademeister 2', 'Bergung der Person, HLW einleiten'],
                ['Bademeister 3', 'Eingang sichern, RD einweisen, Besucher beruhigen, Dokumentation'],
              ].map(([k, v], i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', fontSize: 13 }}>{k}</div>
                  <div style={{ color: dark ? '#cbd5e1' : '#475569', fontSize: 13 }}>{v}</div>
                </div>
              ))}
            </div>

            <InfoBox title="Beim Einzelrettungseinsatz" dark={dark} color="#dc2626" items={[
              'Erst laut Alarm schlagen: Besucher auf Notruf aufmerksam machen',
              'Einen Besucher direkt ansprechen: „Sie! Rufen Sie 112!"',
              'Selbst Bergen + HLW einleiten',
              'AED erst wenn 2. Person verfügbar oder kurze Unterbrechung',
              'Dokumentation später — erst Leben retten',
            ]} />

            <InfoBox title="Dokumentationspflicht nach Notfall" dark={dark} color="#059669" items={[
              'Unfallprotokoll zeitnah ausfüllen (wann, wo, was, wer)',
              'Zeugen namentlich erfassen',
              'Maßnahmen dokumentieren: HLW, AED, Maßnahmenprotokoll',
              'Meldung an Träger / Betreiber',
              'Meldung an Berufsgenossenschaft wenn Mitarbeiter betroffen',
              'Unterlagen für eventuelle Rechtsverfahren sichern',
            ]} />
          </div>
        )}
      </div>
    </div>
  );
}
