import { useState } from 'react';

const TABS = {
  anschwimmen: 'Anschwimmen',
  befreiung: 'Befreiungsgriffe',
  transport: 'Transportschwimmen',
  bergung: 'Bergung',
  eigenschutz: 'Eigenschutz',
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

const Phase = ({ nr, name, desc, dark }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
    <div style={{ background: '#0891b2', color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 13 }}>{nr}</div>
    <div>
      <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', fontSize: 14 }}>{name}</div>
      <div style={{ color: dark ? '#cbd5e1' : '#475569', fontSize: 13 }}>{desc}</div>
    </div>
  </div>
);

const GriffCard = ({ name, desc, wann, dark }) => (
  <div style={{ background: dark ? '#1e293b' : '#f8fafc', border: '1px solid #0891b240', borderRadius: 10, padding: 14, marginBottom: 10 }}>
    <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 4 }}>{name}</div>
    <div style={{ color: dark ? '#e2e8f0' : '#1e293b', fontSize: 13, marginBottom: 4 }}>{desc}</div>
    <div style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>Einsatz: {wann}</div>
  </div>
);

export default function RettungsriffeDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('anschwimmen');
  const dark = darkMode;
  const bg = dark ? '#0f172a' : '#ffffff';
  const cardBg = dark ? '#1e293b' : '#f8fafc';
  const text = dark ? '#e2e8f0' : '#1e293b';
  const sub = dark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>Schwimmen & Rettung</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 4 }}>Rettungsgriffe</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Anschwimmen, Befreiungsgriffe, Transportschwimmen und Bergung aus dem Wasser</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? '#0891b2' : cardBg,
              color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {/* ANSCHWIMMEN */}
        {tab === 'anschwimmen' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Anschwimmen zur verunglückten Person</h2>

            <div style={{ background: dark ? '#2d1515' : '#fef2f2', border: '1px solid #dc262640', borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>Grundregel: Eigensicherung geht vor!</div>
              <p style={{ color: text, fontSize: 13, margin: 0 }}>Eine panische, kämpfende Person kann den Retter unter Wasser drücken und beide in Lebensgefahr bringen. Immer von hinten anschwimmen.</p>
            </div>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 12 }}>Anschwimmtechnik</div>
              <Phase nr={1} name="Einschätzen" desc='Person beobachten: aktives Ertrinken (schlägt um sich) oder stilles Ertrinken (treibt)? Hilfsmittel verfügbar?' dark={dark} />
              <Phase nr={2} name="Hilfsmittel wählen" desc='Immer erst Rettungsgeräte einsetzen: Stange, Ring, Leine. Nur ohne Hilfsmittel ins Wasser springen.' dark={dark} />
              <Phase nr={3} name="Von hinten anschwimmen" desc='Nie von vorne nähern — Ertrinkender greift reflexartig nach dem Retter. Von hinten oder seitlich annähern.' dark={dark} />
              <Phase nr={4} name="Kontakt aufnehmen" desc='Schulter der Person greifen, Person nach hinten drehen, Kinn aus dem Wasser halten.' dark={dark} />
              <Phase nr={5} name="Transport einleiten" desc='Geeigneten Transportgriff wählen (→ Tab Transportschwimmen) und ans Ufer/Beckenrand schwimmen.' dark={dark} />
            </div>

            <InfoBox title="Stilles vs. aktives Ertrinken" dark={dark} color="#7c3aed" items={[
              'Aktiv: Person ruft, wedelt, sichtbare Panik — leichter zu erkennen',
              'Still: Person treibt aufrecht, Kopf knapp über Wasser, keine Rufe — oft übersehen',
              'Stilles Ertrinken ist der häufigere Notfall im Bäderbetrieb',
              'Merkmale: glasiger Blick, Arme seitlich im Wasser, Mund an der Oberfläche',
            ]} />
          </div>
        )}

        {/* BEFREIUNGSGRIFFE */}
        {tab === 'befreiung' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Befreiungsgriffe</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Wenn eine panische Person den Retter umklammert, muss er sich befreien — schnell und ohne die Person zu verletzen.</p>

            <GriffCard
              name="Handgelenkbefreiung"
              desc="Person greift Handgelenk des Retters: Arm mit der freien Hand zum Daumen der Person drehen und herausziehen. Geht in Richtung des Daumens — schwächster Punkt des Griffs."
              wann="Person greift das Handgelenk von vorne"
              dark={dark}
            />
            <GriffCard
              name="Nackendruckbefreiung"
              desc="Person drückt den Retter von vorne unter: Beide Hände auf die Schultern der Person legen, kraftvoll abdrücken und gleichzeitig untertauchen — unter der Person hindurch nach hinten auftauchen."
              wann="Frontaler Umklammerungsgriff"
              dark={dark}
            />
            <GriffCard
              name="Halsbefreiung (Würgegriff)"
              desc="Kinn zur Brust ziehen (schützt Luftröhre), beide Hände an die Unterarme der Person, Unterarme auseinander hebeln. Dann sofort nach hinten wegschwimmen."
              wann="Person greift um den Hals"
              dark={dark}
            />
            <GriffCard
              name="Rückenbefreiung (Umklammerung)"
              desc="Person klammert sich von hinten: Einen Arm der Person fassen, nach unten und vorne hebeln, gleichzeitig wegtauchen und drehen."
              wann="Person klammert sich von hinten"
              dark={dark}
            />

            <InfoBox title="Grundprinzip aller Befreiungsgriffe" dark={dark} color="#059669" items={[
              'Schnell und entschlossen handeln — zögern kostet Kraft',
              'Immer in Richtung des schwächsten Punktes (Daumen) befreien',
              'Nach Befreiung sofort Abstand gewinnen, dann neu positionieren',
              'Im Zweifel: abtauchen — Person kann nicht tauchen',
            ]} />
          </div>
        )}

        {/* TRANSPORT */}
        {tab === 'transport' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Transportschwimmen</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Ziel: Person sicher und atemwegsfrei ans Ufer/Beckenrand bringen. Griff je nach Zustand der Person wählen.</p>

            <GriffCard
              name="Kinngriff (Standard)"
              desc="Retter von hinten, eine Hand unter das Kinn, Kinn nach oben halten — Atemwege frei. Andere Hand/Beine treiben voran. Person liegt auf dem Rücken. Am stabilsten und häufigsten eingesetzt."
              wann="Bewusstlose oder bewusstseinsgetrübte Person"
              dark={dark}
            />
            <GriffCard
              name="Achselgriff"
              desc="Retter fasst von hinten beide Achseln, Unterarme auf der Brust der Person gekreuzt. Person liegt auf dem Rücken, Kopf auf der Schulter des Retters. Beide Arme frei zum Schwimmen."
              wann="Kooperative Person, kurze Strecken"
              dark={dark}
            />
            <GriffCard
              name="Schultergriff"
              desc="Retter von der Seite, eine Hand auf der nahen Schulter, andere Hand unter den Arm. Person bleibt aufrecht. Nur für kurze Strecken bei kooperativer Person."
              wann="Ansprechbare Person, flaches Wasser"
              dark={dark}
            />
            <GriffCard
              name="Rücken-Schlepp"
              desc="Person liegt auf dem Rücken, Retter fasst an den Haaren oder hinter dem Kopf (nur im Notfall), zieht Person durch das Wasser. Nur wenn andere Griffe nicht möglich."
              wann="Notlösung, sehr unkooperative Person"
              dark={dark}
            />

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 8 }}>Schwimmtechnik beim Transport</div>
              {[
                ['Rückenantrieb', 'Rückenschwimmen mit Beinschlag (Rücken-Kraul) — hält Kopf oben'],
                ['Seitenantrieb', 'Seitenschwimmen — Scherenschlag, eine Hand zum Griff, eine zum Treiben'],
                ['Tempo', 'Ruhig und gleichmäßig — Panik überträgt sich auf die Person'],
                ['Kurs', 'Immer den kürzesten Weg zum Rand — vorher orientieren'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#0891b2', fontWeight: 700, minWidth: 120 }}>{k}</span>
                  <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BERGUNG */}
        {tab === 'bergung' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Bergung aus dem Wasser</h2>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Bergung über den Beckenrand</div>
              <Phase nr={1} name="An den Rand bringen" desc='Person mit Kinngriff sicher an den Beckenrand führen, Kopf aus dem Wasser halten.' dark={dark} />
              <Phase nr={2} name="Positionieren" desc='Person Rücken an die Wand drehen, Arme über den Rand legen (Stützposition).' dark={dark} />
              <Phase nr={3} name="Helfer holen" desc='Allein ist die Bergung über den Beckenrand kaum möglich — Hilfe rufen! Person sichern.' dark={dark} />
              <Phase nr={4} name="Herausheben (mit Hilfe)" desc='1. Helfer greift Handgelenke und zieht, 2. Helfer schiebt von unten. Person auf den Rücken legen.' dark={dark} />
            </div>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Bergung über die Treppe / Leiter</div>
              <Phase nr={1} name="Zur Treppe schwimmen" desc='Person an die Treppe führen — ansprechbare Person kann selbst steigen, Retter sichert.' dark={dark} />
              <Phase nr={2} name="Bewusstlose Person" desc='Person in Rückenlage an die Treppe schieben, Kopf stützen. Helfer zieht an den Armen heraus.' dark={dark} />
            </div>

            <InfoBox title="HWS-Verdacht (Tauchunfall / Sprung)" dark={dark} color="#dc2626" items={[
              'Bei Verdacht auf Halswirbelsäulen-Verletzung: Person NICHT beugen!',
              'Kopf in Neutralstellung fixieren — eine Hand unter Hinterkopf, eine unter Kinn',
              'Person möglichst horizontal halten beim Herausnehmen',
              'Spineboard (Rettungsbrett) einsetzen wenn vorhanden',
              'Notruf 112 — auf HWS-Verdacht hinweisen',
            ]} />

            <InfoBox title="Nach der Bergung" dark={dark} color="#059669" items={[
              'Sofort Bewusstsein & Atmung prüfen',
              'Bei Atemstillstand: Notruf + HLW beginnen',
              'Stabile Seitenlage wenn Person atmet aber bewusstlos',
              'Nasse Kleidung entfernen, warm halten (Schock-Prophylaxe)',
              'Notruf 112 — auch wenn Person sich erholt hat',
            ]} />
          </div>
        )}

        {/* EIGENSCHUTZ */}
        {tab === 'eigenschutz' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Eigenschutz im Rettungseinsatz</h2>

            <div style={{ background: dark ? '#2d1515' : '#fef2f2', border: '1px solid #dc262640', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 8, fontSize: 15 }}>Grundsatz: Retter schützen zuerst sich selbst</div>
              <p style={{ color: text, fontSize: 13, margin: 0 }}>Ein verunglückter Retter kann nicht mehr helfen. Zweifacher Tod ist keine Option. Eigenschutz ist keine Feigheit — er ist Pflicht.</p>
            </div>

            <InfoBox title="Vor dem Einsatz" dark={dark} color="#0891b2" items={[
              'Situation einschätzen: Wie ist der Zustand der Person? Aktiv oder still?',
              'Hilfsmittel nutzen: Stange, Ring, Leine reichen — ist ein Sprung nötig?',
              'Hilfe holen / Notruf absetzen — nicht alleine handeln',
              'Auf Hindernisse im Wasser achten',
            ]} />

            <InfoBox title="Beim Anschwimmen" dark={dark} color="#0891b2" items={[
              'Immer von hinten annähern',
              'Augenkontakt halten — Person beobachten',
              'Befreiungsgriffe kennen und bereit sein sie anzuwenden',
              'Bei starker Gegenwehr: kurz abtauchen, Abstand gewinnen, neu positionieren',
            ]} />

            <InfoBox title="Rechtliche Grundlage" dark={dark} color="#7c3aed" items={[
              '§ 323c StGB: Unterlassene Hilfeleistung — Pflicht zur Hilfe wenn zumutbar',
              'Garantenstellung des Bademeisters: erhöhte Pflicht durch Berufsausübung',
              '"Zumutbar" bedeutet: ohne erhebliche eigene Gefährdung',
              'Kein Rechtsbruch wenn Eigenschutz Rettung verhindert hat',
            ]} />

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 8 }}>Entscheidungsbaum: Springe ich?</div>
              {[
                ['Person außerhalb Reichweite?', 'Nein → Stange/Leine einsetzen'],
                ['Geeignetes Rettungsgerät verfügbar?', 'Ja → immer zuerst benutzen'],
                ['Bin ich allein?', 'Ja → erst Notruf, dann einspringen'],
                ['Kann ich die Person sicher transportieren?', 'Ggf. nein → im Wasser sichern, Hilfe abwarten'],
              ].map(([q, a], i) => (
                <div key={i} style={{ marginBottom: 8, fontSize: 13 }}>
                  <div style={{ color: dark ? '#7dd3fc' : '#0369a1', fontWeight: 600 }}>? {q}</div>
                  <div style={{ color: dark ? '#cbd5e1' : '#475569', marginLeft: 12 }}>→ {a}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
