const lungeAtmung = {
  id: 'lunge-atmung',
  title: 'Die Atmung des Menschen',
  subtitle: 'Atemmechanik, Atemvolumen, Gasaustausch und Luftzusammensetzung',
  category: 'health',
  icon: '🫁',
  estimatedMinutes: 18,
  reference: {
    image: '/worksheets/lunge-atmung-referenz.png',
    alt: 'Lernblatt Die Atmung des Menschen mit allen Beschriftungen',
    intro:
      'Die Atmung versorgt den Körper mit Sauerstoff und entfernt Kohlendioxid. Die Luft wandert von Nase/Mund über Rachen, Kehlkopf, Luftröhre und Bronchien bis in die Alveolen, wo der Gasaustausch mit dem Blut stattfindet. Angetrieben wird die Atmung vom Zwerchfell, dem wichtigsten Atemmuskel.',
    sections: [
      {
        heading: 'Was passiert bei der Atmung?',
        items: [
          { label: 'Einatmung (Inspiration)', body: 'Zwerchfell senkt sich, Brustkorb erweitert sich, Luft strömt ein.' },
          { label: 'Ausatmung (Exspiration)', body: 'Zwerchfell entspannt sich, Brustkorb verkleinert sich, Luft strömt aus.' },
        ],
      },
      {
        heading: 'Der Luftweg',
        items: [
          { label: 'Reihenfolge', body: 'Nase / Mund → Rachen → Kehlkopf → Luftröhre → Bronchien → Bronchiolen → Alveolen.' },
        ],
      },
      {
        heading: 'Funktionen',
        items: [
          { label: 'Sauerstoffaufnahme', body: 'Versorgt den Körper mit lebenswichtigem Sauerstoff (O₂).' },
          { label: 'Kohlendioxidabgabe', body: 'Entfernt das Abfallprodukt CO₂ aus dem Körper.' },
          { label: 'Gasaustausch in den Alveolen', body: 'Sauerstoff gelangt ins Blut, Kohlendioxid in die Alveolen.' },
          { label: 'pH-Regulation / Säure-Basen-Haushalt', body: 'CO₂ beeinflusst den pH-Wert des Blutes und wird über die Atmung geregelt.' },
          { label: 'Stimmbildung', body: 'Luft lässt die Stimmbänder im Kehlkopf schwingen — so entsteht unsere Stimme.' },
          { label: 'Befeuchtung, Erwärmung, Reinigung der Atemluft', body: 'Die Atemwege bereiten die Luft optimal für die Lungen vor.' },
        ],
      },
      {
        heading: 'Gasaustausch in den Alveolen',
        items: [
          { label: 'Alveole', body: 'Winziges Lungenbläschen — Millionen davon bilden eine riesige Austauschfläche.' },
          { label: 'Alveolarwand', body: 'Extrem dünn — Sauerstoff und CO₂ diffundieren direkt hindurch.' },
          { label: 'Kapillarnetz', body: 'Feinste Blutgefäße umgeben jede Alveole.' },
          { label: 'O₂-Diffusion', body: 'Sauerstoff diffundiert von der Alveole ins Blut und wird vom Hämoglobin transportiert.' },
          { label: 'CO₂-Diffusion', body: 'Kohlendioxid diffundiert aus dem Blut in die Alveole und wird ausgeatmet.' },
        ],
      },
      {
        heading: 'Atemvolumen (Näherungswerte)',
        items: [
          { label: 'Atemzugvolumen (TV)', body: 'Ca. 0,5 l — normales Ein- und Ausatmen.' },
          { label: 'Inspiratorisches Reservevolumen (IRV)', body: 'Ca. 2,5–3,0 l — was man zusätzlich einatmen kann.' },
          { label: 'Exspiratorisches Reservevolumen (ERV)', body: 'Ca. 1,0–1,5 l — was man zusätzlich ausatmen kann.' },
          { label: 'Residualvolumen (RV)', body: 'Ca. 1,0–1,5 l — bleibt nach dem Ausatmen in der Lunge zurück.' },
          { label: 'Vitalkapazität (VC)', body: 'Ca. 4–5 l — maximal mobilisierbare Luftmenge (TV + IRV + ERV).' },
        ],
      },
      {
        heading: 'Luftzusammensetzung',
        items: [
          { label: 'Eingeatmete Luft', body: 'Stickstoff (N₂) ca. 78 %, Sauerstoff (O₂) ca. 21 %, Argon/Edelgase ca. 0,9 %, CO₂ ca. 0,04 %, Wasserdampf variabel.' },
          { label: 'Ausgeatmete Luft', body: 'Weniger O₂ (ca. 16 %), mehr CO₂ (ca. 4 %), N₂ fast unverändert (ca. 78 %), deutlich mehr Wasserdampf.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Zwerchfell', body: 'Wichtigster Atemmuskel — senkt sich bei der Einatmung.' },
          { label: 'Bronchien', body: 'Hauptäste, die die Luft in beide Lungen leiten.' },
          { label: 'Bronchiolen', body: 'Feine Verzweigungen, die die Luft zu den Alveolen transportieren.' },
          { label: 'Alveolen', body: 'Luftbläschen — Ort des Gasaustauschs mit dem Blut.' },
          { label: 'Kapillaren', body: 'Feinste Blutgefäße um die Alveolen herum.' },
        ],
      },
      {
        heading: 'Wusstest du?',
        items: [
          { label: 'Atemfrequenz', body: 'Ein Erwachsener atmet in Ruhe etwa 12–16 Mal pro Minute.' },
          { label: 'Austauschfläche', body: 'Die Lunge besitzt Millionen Alveolen mit riesiger Austauschfläche (ca. 80–100 m²).' },
          { label: 'Hauptmuskel', body: 'Das Zwerchfell ist der wichtigste Atemmuskel.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/lunge-atmung-arbeitsblatt.png',
    alt: 'Arbeitsblatt Die Atmung des Menschen zum Ausfüllen',
    tasks: [
      {
        id: 'aufbau',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Aufbau der Atmung',
        prompt: 'Beschrifte die 12 nummerierten Strukturen.',
        items: [
          { number: 1, accept: ['Nase', 'Nasenhöhle', 'Nasenhoehle', 'Nase / Nasenhöhle'] },
          { number: 2, accept: ['Mund', 'Mundhöhle', 'Mundhoehle', 'Mund / Mundhöhle'] },
          { number: 3, accept: ['Rachen', 'Pharynx', 'Rachen (Pharynx)'] },
          { number: 4, accept: ['Kehlkopf', 'Larynx', 'Kehlkopf (Larynx)'] },
          { number: 5, accept: ['Luftröhre', 'Luftroehre', 'Trachea', 'Luftröhre (Trachea)'] },
          { number: 6, accept: ['Linker Lungenflügel', 'Linker Lungenfluegel', 'Lunge links', 'Linke Lunge'] },
          { number: 7, accept: ['Bronchien', 'Hauptbronchien', 'Bronchus'] },
          { number: 8, accept: ['Bronchiolen', 'Bronchiole'] },
          { number: 9, accept: ['Alveole', 'Alveolen', 'Lungenbläschen', 'Lungenblaeschen'] },
          { number: 10, accept: ['Kapillarnetz', 'Kapillaren', 'Blutkapillaren'] },
          { number: 11, accept: ['Rechter Lungenflügel', 'Rechter Lungenfluegel', 'Lunge rechts', 'Rechte Lunge'] },
          { number: 12, accept: ['Zwerchfell', 'Diaphragma', 'Zwerchfell (Diaphragma)'] },
        ],
      },
      {
        id: 'funktionen',
        type: 'open-list',
        title: 'Aufgabe 2: Funktionen der Atmung',
        prompt: 'Nenne sechs wichtige Funktionen oder Aufgaben.',
        expectedCount: 6,
        pool: [
          { accept: ['Sauerstoffaufnahme', 'O2-Aufnahme', 'Sauerstoff', 'Sauerstoffversorgung'] },
          { accept: ['Kohlendioxidabgabe', 'CO2-Abgabe', 'CO2 abgeben', 'Kohlendioxid abgeben'] },
          { accept: ['Gasaustausch', 'Gasaustausch in den Alveolen'] },
          { accept: ['pH-Regulation', 'Säure-Basen-Haushalt', 'Saeure-Basen-Haushalt', 'pH-Wert regulieren'] },
          { accept: ['Stimmbildung', 'Stimme', 'Stimmerzeugung', 'Sprechen'] },
          { accept: ['Luftaufbereitung', 'Befeuchtung', 'Erwärmung', 'Erwaermung', 'Reinigung', 'Befeuchten Erwärmen Reinigen'] },
        ],
      },
      {
        id: 'strukturen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Strukturen',
        prompt: 'Beschrifte die vier Abbildungen.',
        items: [
          { hint: 'Kuppelförmiger Muskel', accept: ['Zwerchfell', 'Diaphragma', 'Zwerchfell (Diaphragma)'] },
          { hint: 'Y-förmige Hauptäste', accept: ['Bronchien', 'Hauptbronchien'] },
          { hint: 'Feine Verzweigungen', accept: ['Bronchiolen'] },
          { hint: 'Traubenförmige Bläschen mit Gefäßen', accept: ['Alveolen', 'Alveole', 'Lungenbläschen', 'Lungenblaeschen', 'Alveolen mit Kapillaren'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Zusatzfrage',
        items: [
          {
            prompt: '1. Wie gelangt die Luft beim Einatmen bis in die Alveolen?',
            keywords: ['nase', 'mund', 'rachen', 'kehlkopf', 'luftröhre', 'luftroehre', 'trachea', 'bronchien', 'bronchiolen', 'alveolen', 'zwerchfell'],
            minMatches: 4,
            sampleAnswer:
              'Nase/Mund → Rachen → Kehlkopf → Luftröhre → Bronchien → Bronchiolen → Alveolen. Dabei senkt sich das Zwerchfell, der Brustkorb erweitert sich und die Luft strömt durch den Unterdruck ein.',
          },
          {
            prompt: '2. Warum sind die Alveolen für den Gasaustausch so wichtig?',
            keywords: ['dünn', 'duenn', 'oberfläche', 'oberflaeche', 'austauschfläche', 'austauschflaeche', 'kapillaren', 'diffusion', 'blut', 'sauerstoff', 'kohlendioxid', 'millionen'],
            minMatches: 3,
            sampleAnswer:
              'Die Alveolen haben eine extrem dünne Wand und bilden zusammen eine riesige Austauschfläche von ca. 80–100 m². Sie sind von einem dichten Kapillarnetz umgeben. Durch die dünne Membran diffundiert Sauerstoff ins Blut und Kohlendioxid aus dem Blut in die Alveole.',
          },
        ],
      },
    ],
  },
};

export default lungeAtmung;
