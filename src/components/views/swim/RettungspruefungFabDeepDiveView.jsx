import { useState } from 'react';

const TABS = {
  uebersicht: 'Übersicht',
  ausdauer: '300 m Ausdauer',
  kombi: 'Kombinierte Übung',
  schleppen: '50 m Schleppen',
  tieftauchen: 'Tieftauchen',
  streckentauchen: 'Streckentauchen',
  hinweise: 'Hinweise zur Prüfung',
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

const SpecRow = ({ k, v, dark, color = '#0891b2' }) => (
  <div style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
    <span style={{ color: color, fontWeight: 700, minWidth: 130 }}>{k}</span>
    <span style={{ color: dark ? '#cbd5e1' : '#475569' }}>{v}</span>
  </div>
);

const Phase = ({ nr, name, desc, dark, color = '#0891b2' }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
    <div style={{ background: color, color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 13 }}>{nr}</div>
    <div>
      <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', fontSize: 14 }}>{name}</div>
      <div style={{ color: dark ? '#cbd5e1' : '#475569', fontSize: 13 }}>{desc}</div>
    </div>
  </div>
);

export default function RettungspruefungFabDeepDiveView({ darkMode }) {
  const [tab, setTab] = useState('uebersicht');
  const dark = darkMode;
  const bg = dark ? '#0f172a' : '#ffffff';
  const cardBg = dark ? '#1e293b' : '#f8fafc';
  const text = dark ? '#e2e8f0' : '#1e293b';
  const sub = dark ? '#94a3b8' : '#64748b';

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '20px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>Schwimmen & Rettung</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 4 }}>Rettungsschwimmer-Prüfung (FAB)</h1>
        <p style={{ color: sub, fontSize: 14, marginBottom: 12 }}>Praktische Schwimm- und Rettungsprüfung für Fachangestellte für Bäderbetriebe — Anlehnung an die Prüfungsordnung der Bezirksregierung Düsseldorf</p>

        <div style={{ background: dark ? '#1e1040' : '#faf5ff', border: '1px solid #7c3aed40', borderRadius: 10, padding: 12, marginBottom: 20, fontSize: 12, color: dark ? '#c4b5fd' : '#5b21b6' }}>
          <strong>Hinweis:</strong> Die exakten Anforderungen, Zeitlimits und Bewertungsmaßstäbe regelt die Prüfungsordnung der zuständigen Stelle (in NRW häufig die Bezirksregierung Düsseldorf). Diese Übersicht ist eine Lernhilfe und ersetzt keine offizielle Prüfungsausschreibung. Die hier genannten Standardwerte entsprechen der gängigen Praxis und dem DLRG-Rettungsschwimmer Silber, der in der Regel als Mindestnachweis verlangt wird.
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(TABS).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: tab === k ? '#0891b2' : cardBg,
              color: tab === k ? '#fff' : sub,
            }}>{v}</button>
          ))}
        </div>

        {/* ÜBERSICHT */}
        {tab === 'uebersicht' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Prüfungsbestandteile im Überblick</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Die praktische Schwimmprüfung der FAB-Ausbildung umfasst Ausdauer, Tauchen, Schleppen und kombinierte Aufgaben — analog zum DLRG-Rettungsschwimmer Silber. Alle Disziplinen werden in der Regel an einem Prüfungstag abgenommen.</p>

            <div style={{ overflowX: 'auto', marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#0891b2' }}>
                    <th style={{ padding: '8px 12px', color: '#fff', textAlign: 'left' }}>Disziplin</th>
                    <th style={{ padding: '8px 12px', color: '#fff', textAlign: 'left' }}>Anforderung</th>
                    <th style={{ padding: '8px 12px', color: '#fff', textAlign: 'left' }}>Richtzeit / Maß</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['300 m Ausdauer', '100 m Kraul + 100 m Brust + 100 m Rücken (mit Beinschlag, ohne Armtätigkeit)', '≤ 12:00 min'],
                    ['Kombinierte Übung', 'Sprung in Bekleidung, 25 m anschwimmen, abtauchen, 5-kg-Ring aus 2 m Tiefe holen, 25 m schleppen, im Wasser entkleiden', 'durchgehend, ohne Pause'],
                    ['50 m Schleppen', '50 m Schwimmen mit „verunfallter" Person — Achselgriff oder Kopfgriff', '≤ 4:00 min'],
                    ['Tieftauchen', '3× hintereinander einen 5-kg-Tauchring aus mind. 2 m Tiefe heraufholen', 'aus der Bewegung'],
                    ['Streckentauchen', '25 m am Stück unter Wasser tauchen (Start aus Wasserlage)', '—'],
                    ['Sprung aus 3 m', 'Kopfsprung vom 3-m-Brett (auch in Bekleidung möglich)', '—'],
                    ['Theorie & Erste Hilfe', 'Selbstrettung, Befreiungsgriffe, HLW, Rettungskette', 'mündlich/schriftlich'],
                  ].map(([d, a, z], i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? (dark ? '#1e293b' : '#f0f9ff') : (dark ? '#0f172a' : '#fff') }}>
                      <td style={{ padding: '7px 12px', fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1' }}>{d}</td>
                      <td style={{ padding: '7px 12px', color: text }}>{a}</td>
                      <td style={{ padding: '7px 12px', color: '#059669', fontWeight: 600 }}>{z}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <InfoBox title="Bestehensgrundsatz" dark={dark} color="#7c3aed" items={[
              'Alle Pflichtteile müssen erfolgreich abgelegt werden — eine nicht bestandene Disziplin kann i. d. R. einmal wiederholt werden.',
              'Voraussetzung in NRW: gültige Erste-Hilfe-Bescheinigung (max. 2 Jahre alt) zur Prüfung mitbringen.',
              'Nachweis im Betrieb: Rettungsschwimmer-Abzeichen Silber (DLRG/DRK Wasserwacht) muss alle 2 Jahre aufgefrischt werden.',
            ]} />

            <InfoBox title="Vorbereitung" dark={dark} color="#059669" items={[
              'Ausdauer auf 300 m+ trainieren — Tempo wichtiger als Stilreinheit',
              'Kleiderschwimmen üben: T-Shirt, lange Hose, Schuhe oder Sportbekleidung — gemäß Prüfungsausschreibung',
              'Tauchring (5 kg) regelmäßig holen — Druckausgleich, ruhige Atmung',
              'Schlepptechnik mit Übungspartner trainieren — kein Hektik, gleichmäßig',
            ]} />
          </div>
        )}

        {/* 300 m AUSDAUER */}
        {tab === 'ausdauer' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>300 m Ausdauerschwimmen</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Drei Schwimmlagen ohne Pause — typische Aufteilung 100/100/100 m. Die Reihenfolge kann variieren, üblich ist <strong>Kraul → Brust → Rücken</strong>.</p>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 12 }}>Aufteilung & Anforderung</div>
              <SpecRow k="Gesamtstrecke" v="300 m ohne Pause, ohne Hilfsmittel" dark={dark} />
              <SpecRow k="Lage 1 (100 m)" v="Brust- oder Kraulschwimmen" dark={dark} />
              <SpecRow k="Lage 2 (100 m)" v="Andere der beiden Lagen aus 1" dark={dark} />
              <SpecRow k="Lage 3 (100 m)" v="Rückenschwimmen mit Beinschlag — Hände auf dem Bauch oder am Körper, KEIN Armzug" dark={dark} />
              <SpecRow k="Richtzeit" v="≤ 12 Minuten (DLRG Silber: 12 min, FAB-Praxis oft strenger)" dark={dark} />
              <SpecRow k="Bewertung" v="Stillrein, gleichmäßiges Tempo, korrekte Atmung" dark={dark} />
            </div>

            <InfoBox title="Tipps Ausdauer" dark={dark} color="#0891b2" items={[
              'Nicht zu schnell starten — Brust ist meist am ökonomischsten als Auftakt',
              'Beim Übergang Lage zu Lage durchschwimmen, kein Anschlagen',
              'Rückenschwimmen ohne Armtätigkeit: Wasserlage flach halten, Beinschlag aus der Hüfte',
              'Atmung gleichmäßig — Atemnot signalisieren würde Bewertung gefährden',
            ]} />

            <InfoBox title="Häufige Fehler" dark={dark} color="#dc2626" items={[
              'Beim Rückenteil mitziehen (Hände bewegen sich) → Disziplin gilt als nicht erfüllt',
              'Pause am Beckenrand → Abbruch / Wiederholung',
              'Unsaubere Brust-Beintechnik (Delfinkick) → Stilfehler',
              'Wasser schlucken durch falsche Atmung → Tempo bricht ein',
            ]} />
          </div>
        )}

        {/* KOMBINIERTE ÜBUNG */}
        {tab === 'kombi' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Kombinierte Übung mit Entkleiden</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Die Königsdisziplin — alles in einem Zug, ohne Pause. Simuliert eine reale Rettung in Bekleidung.</p>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 12 }}>Ablauf</div>
              <Phase nr={1} name="Sprung in Bekleidung" desc='Fußsprung oder Paketsprung vom Beckenrand in voller Bekleidung (z. B. T-Shirt, lange Hose).' dark={dark} />
              <Phase nr={2} name="25 m anschwimmen" desc='Beliebige Schwimmart, Kopf über Wasser — Sicht auf die "Notlage" behalten.' dark={dark} />
              <Phase nr={3} name="Abtauchen & Tauchring holen" desc='Aus mind. 2 m Tiefe einen 5-kg-Tauchring heraufholen — gilt als „verunglückte Person".' dark={dark} />
              <Phase nr={4} name="25 m schleppen" desc='Den Tauchring (ersatzweise eine Person) im Achselgriff oder Kopfgriff über 25 m schleppen.' dark={dark} />
              <Phase nr={5} name="Im Wasser entkleiden" desc='Während der letzten Strecke oder am Ende: T-Shirt UND lange Hose im Wasser ausziehen, am Beckenrand ablegen.' dark={dark} />
              <Phase nr={6} name="Bergung simulieren" desc='Ggf. Bergung der „Person" über den Beckenrand vorzeigen — je nach Prüfungsordnung.' dark={dark} />
            </div>

            <InfoBox title="Entkleidung im Wasser — Technik" dark={dark} color="#7c3aed" items={[
              'Auf den Rücken legen — Auftrieb nutzen, Hände frei',
              'Schuhe zuerst: nach hinten gegen die Ferse drücken, ausziehen',
              'Hose: Knöpfe/Reißverschluss öffnen, an den Knöcheln entlang über die Füße ziehen — Beinschlag im Rücken weiterführen',
              'T-Shirt: über den Kopf rollen, eine Hand nach der anderen herausziehen',
              'Kleidung am Beckenrand ablegen — nicht im Wasser treiben lassen',
            ]} />

            <InfoBox title="Häufige Fehler" dark={dark} color="#dc2626" items={[
              'Pause beim Ausziehen → Auftrieb verlieren, Wasser schlucken',
              'Aufstehen / Stehen im Becken → Disqualifikation',
              'Kleidung vergessen abzulegen oder dabei untergehen',
              'Tauchring nicht aus 2 m Tiefe geholt — unzureichende Tauchtiefe',
            ]} />
          </div>
        )}

        {/* 50 m SCHLEPPEN */}
        {tab === 'schleppen' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>50 m Schleppen</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Eine „verunfallte" Person über 50 m sicher transportieren — Atemwege immer frei, gleichmäßiges Tempo.</p>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 12 }}>Anforderungen</div>
              <SpecRow k="Strecke" v="50 m am Stück, ohne Pause" dark={dark} />
              <SpecRow k="Richtzeit" v="≤ 4 Minuten (DLRG Silber)" dark={dark} />
              <SpecRow k="Erlaubte Griffe" v="Achselgriff (häufigster), Kopfgriff (Kinngriff), kombinierte Griffe" dark={dark} />
              <SpecRow k="Lage Geretteter" v="Rückenlage, Gesicht über Wasser, Atemwege frei" dark={dark} />
              <SpecRow k="Antrieb Retter" v="Rückenschwimmen mit Beinschlag (Brust- oder Scherenschlag)" dark={dark} />
              <SpecRow k="Bewertung" v="Atemwege durchgehend frei, Tempo gleichmäßig, am Ziel sichere Bergung" dark={dark} />
            </div>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Achselgriff (Standard)</div>
              <Phase nr={1} name="Position einnehmen" desc='Retter unter dem Kopf der Person, beide greifen die Achseln von hinten.' dark={dark} />
              <Phase nr={2} name="Gerettete in Rückenlage" desc='Ohren bedeckt, Mund/Nase über Wasser, Kopf an der Brust des Retters.' dark={dark} />
              <Phase nr={3} name="Antrieb" desc='Beinschlag des Retters — Brustschlag oder Scherenschlag, gleichmäßig.' dark={dark} />
              <Phase nr={4} name="Anschlag" desc='Am Ziel mit den Füßen abstoppen, Person sichern, Bergung einleiten.' dark={dark} />
            </div>

            <InfoBox title="Häufige Fehler beim Schleppen" dark={dark} color="#dc2626" items={[
              'Person sinkt mit dem Gesicht ins Wasser — Atemwege blockiert',
              'Retter zu schnell — verliert Kraft, Person schlägt unter',
              'Falsche Hand-/Armposition → Person rutscht weg',
              'Am Ziel kein sauberer Anschlag → Person stößt mit Kopf gegen Wand',
            ]} />
          </div>
        )}

        {/* TIEFTAUCHEN */}
        {tab === 'tieftauchen' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Tieftauchen — 5-kg-Ring aus 2 m Tiefe</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>Drei Tauchgänge hintereinander, jeweils einen 5-kg-Tauchring aus mindestens 2 m Tiefe heraufholen — ohne längere Pause zwischen den Versuchen.</p>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 12 }}>Anforderungen</div>
              <SpecRow k="Tiefe" v="mindestens 2 m" dark={dark} />
              <SpecRow k="Ringgewicht" v="5 kg (Standard-Tauchring)" dark={dark} />
              <SpecRow k="Anzahl" v="3× hintereinander, Start aus dem Wasser" dark={dark} />
              <SpecRow k="Pause" v="Nur kurze Atempause am Beckenrand erlaubt" dark={dark} />
              <SpecRow k="Bewertung" v="Ring vollständig über Wasser zeigen, ruhige Auftauchphase" dark={dark} />
            </div>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Tauchablauf</div>
              <Phase nr={1} name="Anschwimmen" desc='Aus der Wasserlage zum Tauchpunkt, gleichmäßige Atmung, kurzes Hyperventilieren VERMEIDEN.' dark={dark} />
              <Phase nr={2} name="Abtauchen" desc='Kopfsprungtauchen aus der Wasserlage: Kopf nach unten, Beine kommen nach, Druckausgleich machen (Nase zuhalten, vorsichtig pressen).' dark={dark} />
              <Phase nr={3} name="Greifen" desc='Ring fest greifen, kurz orientieren — nicht hektisch.' dark={dark} />
              <Phase nr={4} name="Auftauchen" desc='Mit dem Ring kontrolliert auftauchen, am Beckenrand zeigen, kurze Atempause.' dark={dark} />
            </div>

            <InfoBox title="Sicherheit beim Tauchen" dark={dark} color="#dc2626" items={[
              'KEIN Hyperventilieren vor dem Tauchen — Risiko Schwimmbad-Blackout (Hypoxie)',
              'Druckausgleich rechtzeitig — Schmerzen im Ohr = sofort etwas auftauchen',
              'Bei Schwindel oder Kribbeln: sofort auftauchen',
              'Nie alleine tauchen — Prüfungsleitung + Bademeister beobachten',
            ]} />

            <InfoBox title="Häufige Fehler" dark={dark} color="#0891b2" items={[
              'Zu flacher Sprung → Ring nicht erreicht',
              'Ring nicht aus dem Wasser gezeigt → Versuch ungültig',
              'Zu lange Pausen zwischen den 3 Tauchgängen',
              'Druckausgleich vergessen → Ohrschmerzen, Tauchgang abgebrochen',
            ]} />
          </div>
        )}

        {/* STRECKENTAUCHEN */}
        {tab === 'streckentauchen' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Streckentauchen — 25 m unter Wasser</h2>
            <p style={{ color: text, fontSize: 14, marginBottom: 16 }}>25 Meter am Stück unter Wasser zurücklegen — Start aus der Wasserlage, kein Sprung erlaubt.</p>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 12 }}>Anforderungen</div>
              <SpecRow k="Strecke" v="25 m am Stück, ohne Auftauchen" dark={dark} />
              <SpecRow k="Start" v="Aus der Wasserlage (Wasserstart) — kein Kopfsprung" dark={dark} />
              <SpecRow k="Stilform" v="Brust-Tauchschlag (Unterwasserbrust): breite Armzüge bis zu den Hüften, lange Gleitphase" dark={dark} />
              <SpecRow k="Bewertung" v="25 m durchgehend, kein Atemzug, kein Auftauchen" dark={dark} />
            </div>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Technik Tauchschlag (Unterwasserbrust)</div>
              <Phase nr={1} name="Strecklage" desc='Beide Arme gestreckt nach vorn, Beine geschlossen — maximaler Gleitwiderstand minimieren.' dark={dark} />
              <Phase nr={2} name="Armzug breit" desc='Arme ziehen weit auseinander bis zu den Hüften (anders als Wettkampfbrust!) — viel Vortrieb pro Zug.' dark={dark} />
              <Phase nr={3} name="Beinschlag" desc='Frosch-Beinschlag: Fersen zum Gesäß, Beine spreizen, peitschend zusammenschlagen.' dark={dark} />
              <Phase nr={4} name="Lange Gleitphase" desc='Nach jedem Zug lange gleiten — der Tauchschlag lebt von der Pause.' dark={dark} />
            </div>

            <InfoBox title="Atmung & Vorbereitung" dark={dark} color="#7c3aed" items={[
              '2–3 normale Atemzüge vor dem Tauchen — KEIN Hyperventilieren',
              'Letzter Atemzug tief, aber nicht maximal — entspannt bleiben',
              'Während des Tauchens Luft langsam aus der Nase lassen (verhindert Druck im Ohr)',
              'Bei Atemnot: aufgeben — kein Risiko eingehen, Schwimmbad-Blackout vermeiden',
            ]} />

            <InfoBox title="Häufige Fehler" dark={dark} color="#dc2626" items={[
              'Hyperventilieren vor dem Start → Risiko Schwimmbad-Blackout',
              'Auftauchen vor 25 m → Versuch ungültig',
              'Falsche Stilform (z. B. Kraulbeinschlag) → DSV-Brust-Tauchschlag ist Pflicht',
              'Zu früh starten — schlechtes Timing der Gleitphase, viel Kraftverlust',
            ]} />
          </div>
        )}

        {/* HINWEISE */}
        {tab === 'hinweise' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 14 }}>Hinweise zur Prüfung</h2>

            <div style={{ background: cardBg, border: '1px solid #0891b240', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: dark ? '#7dd3fc' : '#0369a1', marginBottom: 10 }}>Mitzubringen / Voraussetzungen</div>
              {[
                ['Erste-Hilfe-Bescheinigung', 'max. 2 Jahre alt, 9 Unterrichtseinheiten'],
                ['Rettungsschwimmer Silber', 'Nachweis (DLRG/DRK), max. 2 Jahre alt — wird ggf. erst durch die Prüfung erworben'],
                ['Bekleidung', 'Sportbekleidung für Kleiderschwimmen (T-Shirt + lange Hose)'],
                ['Badekappe', 'falls vorgeschrieben'],
                ['Personalausweis', 'zur Identifikation'],
              ].map(([k, v], i) => (
                <SpecRow key={i} k={k} v={v} dark={dark} />
              ))}
            </div>

            <InfoBox title="Quelle & weiterführende Information" dark={dark} color="#7c3aed" items={[
              'Bezirksregierung Düsseldorf — zuständige Stelle für FAB-Prüfungen in NRW',
              'Verordnung über die Berufsausbildung zum Fachangestellten für Bäderbetriebe (FAB-AusbV)',
              'Rahmenlehrplan KMK 2007 für FAB',
              'DLRG Prüfungsordnung Rettungsschwimmer (Bronze, Silber, Gold) — als Grundlage',
              'DGUV Vorschrift 107 — Bäder, Aufsicht, Rettungsmittel',
            ]} />

            <InfoBox title="Auffrischung im Berufsleben" dark={dark} color="#059669" items={[
              'Rettungsschwimmer-Schein muss alle 2 Jahre aufgefrischt werden',
              'Erste-Hilfe-Auffrischung mindestens alle 2 Jahre (DGUV Vorschrift 1)',
              'AED-Schulung empfohlen',
              'Im Zweifel: Auffrischung VOR Ablauf — sonst Probleme bei Aufsicht-Übernahme',
            ]} />

            <div style={{ background: dark ? '#2d1515' : '#fef2f2', border: '1px solid #dc262640', borderRadius: 10, padding: 14, marginTop: 14 }}>
              <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>Wichtig</div>
              <p style={{ color: text, fontSize: 13, margin: 0 }}>Die hier gezeigten Werte (Strecken, Zeiten, Anzahl der Versuche) sind Richtwerte aus der gängigen FAB-Prüfungspraxis und dem DLRG-Silber-Standard. Die <strong>tatsächlich gültigen Anforderungen</strong> stehen in der aktuellen Prüfungsausschreibung deiner zuständigen Stelle (Bezirksregierung). Vor der Prüfung beim Ausbildungsbetrieb / der Bezirksregierung die offiziellen Vorgaben einholen.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
