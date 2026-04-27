const dasNervensystem = {
  id: 'das-nervensystem',
  title: 'Das menschliche Nervensystem',
  subtitle: 'Aufbau, Funktionen und wichtige Bestandteile von ZNS und PNS',
  category: 'health',
  icon: '🧠',
  estimatedMinutes: 18,
  reference: {
    image: '/worksheets/das-nervensystem-referenz.png',
    alt: 'Lernblatt Das menschliche Nervensystem mit allen Beschriftungen',
    intro:
      'Das Nervensystem ist die Steuerzentrale des Körpers. Es nimmt Reize aus Umwelt und Körperinneren auf, verarbeitet sie und leitet Befehle an Muskeln, Organe und Drüsen weiter. Man unterscheidet das zentrale Nervensystem (ZNS) aus Gehirn und Rückenmark, das periphere Nervensystem (PNS) mit allen Nerven außerhalb davon, und das vegetative Nervensystem, das unbewusste Körperfunktionen wie Herzschlag, Atmung und Verdauung steuert.',
    sections: [
      {
        heading: 'Aufbau',
        items: [
          { label: 'Zentrales Nervensystem (ZNS)', body: 'Besteht aus Gehirn und Rückenmark. Steuerzentrale des Körpers — verarbeitet alle Informationen.' },
          { label: 'Peripheres Nervensystem (PNS)', body: 'Umfasst alle Nerven außerhalb von Gehirn und Rückenmark. Verbindet den Körper mit dem ZNS und leitet Informationen weiter.' },
          { label: 'Vegetatives / Autonomes Nervensystem', body: 'Steuert unbewusste Körperfunktionen wie Herzschlag, Atmung, Verdauung und Drüsentätigkeit.' },
        ],
      },
      {
        heading: 'Funktionen',
        items: [
          { label: 'Reize aufnehmen', body: 'Sinnesorgane und Rezeptoren nehmen Reize aus der Umwelt und dem Körperinneren auf.' },
          { label: 'Informationen weiterleiten', body: 'Nervensignale werden im Körper weitergeleitet und im ZNS verarbeitet.' },
          { label: 'Bewegungen steuern', body: 'Muskeln werden aktiviert und Bewegungen gezielt koordiniert.' },
          { label: 'Organe regulieren', body: 'Innere Organe und Drüsen werden kontrolliert und auf ihre Aufgaben eingestellt.' },
          { label: 'Reflexe ermöglichen', body: 'Schnelle, automatische Reaktionen schützen den Körper vor Verletzungen.' },
          { label: 'Denken, Lernen, Erinnern', body: 'Das Gehirn ermöglicht Bewusstsein, Lernen, Gedächtnis und Emotionen.' },
        ],
      },
      {
        heading: 'Gliederung des Nervensystems',
        items: [
          { label: 'Gehirn (ZNS)', body: 'Steuerzentrale, verarbeitet Informationen, Sitz von Bewusstsein, Denken und Gedächtnis.' },
          { label: 'Rückenmark (ZNS)', body: 'Verbindet Gehirn mit dem Körper, leitet Signale weiter, Zentrum vieler Reflexe.' },
          { label: 'Sensorische Nerven (afferent, PNS)', body: 'Leiten Reize von Sinnesorganen und Geweben zum ZNS.' },
          { label: 'Motorische Nerven (efferent, PNS)', body: 'Leiten Befehle des ZNS zu Muskeln und Drüsen.' },
          { label: 'Sympathikus (aktivierend)', body: 'Bereitet den Körper auf Leistung vor — z. B. Herzfrequenz steigern, Pupillen erweitern, Energie freisetzen ("Kampf oder Flucht").' },
          { label: 'Parasympathikus (beruhigend)', body: 'Fördert Ruhe und Regeneration — z. B. Verdauung anregen, Puls senken, Energie sparen.' },
        ],
      },
      {
        heading: 'Aufbau einer Nervenzelle (Neuron)',
        items: [
          { label: 'Dendriten', body: 'Empfangen Signale von anderen Nervenzellen.' },
          { label: 'Zellkörper', body: 'Stoffwechselzentrum der Nervenzelle, enthält den Zellkern.' },
          { label: 'Axon', body: 'Leitet die elektrische Erregung von der Zelle weiter.' },
          { label: 'Myelinscheide', body: 'Isoliert das Axon und beschleunigt die Signalübertragung erheblich.' },
          { label: 'Ranvier-Schnürring', body: 'Unterbrechung der Myelinscheide — ermöglicht das schnelle "Springen" des Signals.' },
          { label: 'Synapse', body: 'Übergabestelle zur nächsten Zelle — die elektrische Erregung wird hier chemisch weitergegeben.' },
        ],
      },
      {
        heading: 'Reflexbogen (am Beispiel Nadelreiz)',
        items: [
          { label: '1. Reiz', body: 'z. B. ein Nadelstich in die Haut.' },
          { label: '2. Rezeptor', body: 'Schmerz- oder Druckrezeptor in der Haut nimmt den Reiz auf.' },
          { label: '3. Sensorischer Nerv', body: 'Leitet die Information zum Rückenmark.' },
          { label: '4. Rückenmark', body: 'Verarbeitet die Information — schickt sofort einen Befehl zurück.' },
          { label: '5. Motorischer Nerv', body: 'Leitet den Befehl vom Rückenmark zum Muskel.' },
          { label: '6. Muskel / Reaktion', body: 'Der Muskel reagiert — z. B. Hand zurückziehen. Der Reflex läuft ohne bewusste Steuerung ab.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Nerv', body: 'Ein Bündel von Nervenfasern, das Signale zwischen Körper und ZNS überträgt.' },
          { label: 'Neuron', body: 'Nervenzelle, die Informationen empfängt, verarbeitet und weiterleitet.' },
          { label: 'Synapse', body: 'Kontaktstelle zwischen zwei Nervenzellen — Signale werden hier chemisch übertragen.' },
          { label: 'ZNS', body: 'Zentrales Nervensystem — besteht aus Gehirn und Rückenmark.' },
          { label: 'PNS', body: 'Peripheres Nervensystem — alle Nerven außerhalb von Gehirn und Rückenmark.' },
          { label: 'Reflex', body: 'Schnelle, automatische Reaktion auf einen Reiz, ohne bewusste Steuerung.' },
        ],
      },
      {
        heading: 'Wusstest du?',
        items: [
          { label: 'Milliarden Zellen', body: 'Das Gehirn besteht aus Milliarden Nervenzellen und noch viel mehr Verbindungen (Synapsen).' },
          { label: 'Blitzschnell', body: 'Nerven leiten Signale sehr schnell weiter — je nach Nerventyp bis zu 120 Meter pro Sekunde.' },
          { label: 'Gegenspieler', body: 'Sympathikus aktiviert (Kampf oder Flucht), Parasympathikus beruhigt (Ruhe und Regeneration) — beide arbeiten als Gegenspieler.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/das-nervensystem-arbeitsblatt.png',
    alt: 'Arbeitsblatt Das menschliche Nervensystem zum Ausfüllen',
    tasks: [
      {
        id: 'aufbau',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Aufbau des Nervensystems',
        prompt: 'Beschrifte die 12 nummerierten Bestandteile.',
        items: [
          { number: 1, accept: ['Gehirn', 'Cerebrum', 'Hirn'] },
          { number: 2, accept: ['Hirnstamm', 'Stammhirn', 'Übergang zum Rückenmark', 'Uebergang zum Rueckenmark'] },
          { number: 3, accept: ['Armnerven', 'Armnerv', 'Plexus brachialis', 'Armnervengeflecht', 'Schultergeflecht'] },
          { number: 4, accept: ['Rückenmark', 'Rueckenmark', 'Medulla spinalis'] },
          { number: 5, accept: ['Rumpfnerven', 'Brustnerven', 'Bauchnerven', 'Brust- und Bauchnerven', 'Interkostalnerven', 'Thorakalnerven'] },
          { number: 6, accept: ['Beinnerven', 'Beinnerv', 'Ischiasnerv', 'Periphere Beinnerven', 'Nervus ischiadicus', 'Beinnervengeflecht', 'Plexus lumbosacralis'] },
          { number: 7, accept: ['ZNS', 'Zentrales Nervensystem', 'Zentralnervensystem'] },
          { number: 8, accept: ['PNS', 'Peripheres Nervensystem', 'Peripheres Nervennetz'] },
          { number: 9, accept: ['Periphere Nerven', 'Periphere Nerv', 'Hautnerven', 'Periphere Nervenfasern'] },
          { number: 10, accept: ['Bauchnerven', 'Bauchnerv', 'Lendennerven', 'Lumbalnerven'] },
          { number: 11, accept: ['Sakralnerven', 'Beckennerven', 'Hüftnerven', 'Hueftnerven', 'Hüftnerv', 'Hueftnerv', 'Plexus sacralis'] },
          { number: 12, accept: ['Beinnerv', 'Beinnerven', 'Periphere Beinnerven', 'Ischiasnerv', 'Schenkelnerv', 'Nervus ischiadicus', 'Nervus femoralis'] },
        ],
      },
      {
        id: 'funktionen',
        type: 'open-list',
        title: 'Aufgabe 2: Funktionen des Nervensystems',
        prompt: 'Nenne sechs wichtige Funktionen oder Aufgaben des Nervensystems.',
        expectedCount: 6,
        pool: [
          { accept: ['Reize aufnehmen', 'Reize wahrnehmen', 'Wahrnehmung', 'Reizaufnahme', 'Sinneswahrnehmung'] },
          { accept: ['Informationen weiterleiten', 'Reize weiterleiten', 'Signale weiterleiten', 'Signalübertragung', 'Signaluebertragung', 'Reizweiterleitung', 'Reizleitung'] },
          { accept: ['Bewegung steuern', 'Bewegungen steuern', 'Bewegung', 'Muskeln steuern', 'Bewegungssteuerung', 'Motorik'] },
          { accept: ['Organe regulieren', 'Organe steuern', 'Organfunktion', 'Organtätigkeit', 'Organtaetigkeit', 'innere Organe steuern'] },
          { accept: ['Reflexe', 'Reflexe ermöglichen', 'Reflexe ermoeglichen', 'Reflexreaktionen', 'Schutzreflexe'] },
          { accept: ['Denken', 'Lernen', 'Erinnern', 'Gedächtnis', 'Gedaechtnis', 'Bewusstsein', 'Denken Lernen Erinnern', 'Emotionen'] },
        ],
      },
      {
        id: 'strukturen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Strukturen',
        prompt: 'Benenne die abgebildeten Strukturen.',
        items: [
          { hint: 'Nervenzelle mit Dendriten und Axon', accept: ['Nervenzelle', 'Neuron'] },
          { hint: 'Übergabestelle zwischen zwei Nervenzellen', accept: ['Synapse', 'Synapsenspalt', 'Kontaktstelle'] },
          { hint: 'Gehirn und beginnendes Rückenmark — Steuerzentrale', accept: ['ZNS', 'Zentrales Nervensystem', 'Gehirn und Rückenmark', 'Gehirn und Rueckenmark', 'Gehirn'] },
          { hint: 'Alle Nerven, die den Körper durchziehen', accept: ['PNS', 'Peripheres Nervensystem', 'Nervensystem', 'Nervennetz', 'Periphere Nerven'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Zusatzfrage',
        items: [
          {
            prompt: '1. Was ist der Unterschied zwischen zentralem und peripherem Nervensystem?',
            keywords: ['zns', 'pns', 'gehirn', 'rückenmark', 'rueckenmark', 'zentral', 'peripher', 'außerhalb', 'ausserhalb', 'nerven', 'steuerzentrale', 'verarbeit', 'leiten', 'verbinden', 'körper', 'koerper'],
            minMatches: 4,
            sampleAnswer:
              'Das zentrale Nervensystem (ZNS) besteht aus Gehirn und Rückenmark — es ist die Steuerzentrale des Körpers und verarbeitet alle eingehenden Informationen. Das periphere Nervensystem (PNS) umfasst alle Nerven außerhalb von Gehirn und Rückenmark. Es verbindet den Körper mit dem ZNS, leitet Reize von Sinnesorganen und Geweben zum ZNS (sensorisch) und Befehle vom ZNS zu Muskeln und Drüsen (motorisch).',
          },
          {
            prompt: '2. Welche Aufgaben haben Sympathikus und Parasympathikus?',
            keywords: ['sympathikus', 'parasympathikus', 'aktivier', 'beruhig', 'leistung', 'kampf', 'flucht', 'stress', 'ruhe', 'regeneration', 'verdauung', 'herzfrequenz', 'puls', 'pupille', 'energie', 'gegenspieler'],
            minMatches: 4,
            sampleAnswer:
              'Sympathikus und Parasympathikus sind die beiden Gegenspieler des vegetativen (autonomen) Nervensystems und steuern unbewusste Körperfunktionen. Der Sympathikus aktiviert den Körper bei Belastung oder Stress ("Kampf oder Flucht"): Er steigert Herzfrequenz und Atmung, erweitert die Pupillen und stellt Energie bereit. Der Parasympathikus sorgt für Ruhe und Regeneration: Er senkt den Puls, fördert die Verdauung und spart Energie. Beide halten den Körper im Gleichgewicht.',
          },
        ],
      },
    ],
  },
};

export default dasNervensystem;
