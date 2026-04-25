const dieGelenke = {
  id: 'die-gelenke',
  title: 'Die Gelenkarten des Menschen',
  subtitle: 'Aufbau, Funktionen und wichtige Gelenkformen im Überblick',
  category: 'health',
  icon: '🦵',
  estimatedMinutes: 18,
  reference: {
    image: '/worksheets/die-gelenke-referenz.png',
    alt: 'Lernblatt Die Gelenkarten des Menschen mit allen Beschriftungen',
    intro:
      'Gelenke verbinden Knochen miteinander und machen den Körper beweglich. Sie ermöglichen stabile Verbindungen und gleichzeitig kontrollierte Bewegungen. Der Mensch besitzt über 100 echte (synoviale) Gelenke, dazu kommen viele unechte Gelenke wie die Schädelnähte. Gelenkknorpel und Synovia (Gelenkschmiere) sorgen dafür, dass die Knochen reibungsarm aufeinander gleiten.',
    sections: [
      {
        heading: 'Unterscheidung der Gelenktypen',
        items: [
          { label: 'Unechte Gelenke (Synarthrosen)', body: 'Kaum oder gar nicht beweglich. Zwei Knochen sind durch Bindegewebe, Knorpel oder Knochengewebe fest miteinander verbunden — z. B. Schädelnähte oder Bandscheiben.' },
          { label: 'Echte Gelenke (Diarthrosen)', body: 'Frei beweglich. Zwei Knochen werden durch einen flüssigkeitsgefüllten Gelenkspalt getrennt und von einer Gelenkkapsel umschlossen — z. B. Knie-, Hüft- oder Schultergelenk.' },
        ],
      },
      {
        heading: 'Aufbau eines echten (synovialen) Gelenks',
        items: [
          { label: 'Gelenkkopf', body: 'Das obere, runde Knochenende, das in die Pfanne hineinragt.' },
          { label: 'Gelenkpfanne', body: 'Die untere Knochenmulde, die den Gelenkkopf aufnimmt.' },
          { label: 'Gelenkknorpel', body: 'Glatter, elastischer hyaliner Knorpel an den Knochenenden — sorgt für reibungsarmes Gleiten und dämpft Stöße.' },
          { label: 'Gelenkspalt', body: 'Schmaler Raum zwischen den Knochen, mit Synovia gefüllt.' },
          { label: 'Synovia (Gelenkschmiere)', body: 'Zähflüssige Flüssigkeit im Gelenkspalt. Schmiert, ernährt den Knorpel und transportiert Abfallstoffe ab.' },
          { label: 'Gelenkkapsel', body: 'Umgibt das Gelenk vollständig und bildet mit der Synovialmembran eine schützende Hülle.' },
          { label: 'Bänder', body: 'Strapazierfähige Bindegewebsfasern, die Knochen mit Knochen verbinden und das Gelenk stabilisieren und führen.' },
          { label: 'Meniskus / Discus', body: 'Faserknorpel-Polster zwischen Knochen — vergrößert die Kontaktfläche und verteilt den Druck. Nicht in jedem Gelenk vorhanden (z. B. im Knie).' },
        ],
      },
      {
        heading: 'Funktionen / Aufgaben der Gelenke',
        items: [
          { label: 'Bewegung ermöglichen', body: 'Gelenke erlauben dem Körper alle Formen kontrollierter Bewegung.' },
          { label: 'Stabilität sichern', body: 'Bänder und Kapsel halten die Knochen in der richtigen Position zueinander.' },
          { label: 'Bewegungsrichtung führen', body: 'Die Gelenkform legt fest, in welche Richtungen die Bewegung möglich ist.' },
          { label: 'Stoßbelastung abfedern', body: 'Knorpel, Synovia und Menisken wirken wie Stoßdämpfer.' },
          { label: 'Kraftübertragung ermöglichen', body: 'Über das Gelenk werden Muskelkräfte vom einen Knochen auf den anderen übertragen.' },
          { label: 'Schutz vor Reibung', body: 'Gelenkknorpel und Synovia sorgen für reibungsarme, geschmeidige Bewegungen.' },
          { label: 'Zusammenarbeit mit Muskeln und Sehnen', body: 'Gemeinsam mit Muskulatur und Sehnen bilden Gelenke den aktiven Bewegungsapparat.' },
        ],
      },
      {
        heading: 'Welche Gelenkarten unterscheidet man?',
        items: [
          { label: 'Kugelgelenk', body: 'Bewegungen in viele Richtungen — Beugung/Streckung, Ab-/Adduktion und Rotation. Beispiel: Schultergelenk, Hüftgelenk.' },
          { label: 'Scharniergelenk', body: 'Beugung und Streckung in nur einer Ebene. Beispiel: Ellenbogengelenk, Fingergelenke.' },
          { label: 'Drehgelenk (Zapfen-/Radgelenk)', body: 'Drehbewegung um eine Längsachse. Beispiel: Kopfdrehung zwischen Atlas und Axis oder Unterarm (Speiche/Elle).' },
          { label: 'Eigelenk (Ellipsoidgelenk)', body: 'Bewegung in zwei Ebenen (Beugung/Streckung und Ab-/Adduktion). Beispiel: Proximales Handgelenk (Radiokarpalgelenk).' },
          { label: 'Sattelgelenk', body: 'Bewegung in zwei Ebenen, besonders beweglich. Beispiel: Daumensattelgelenk.' },
          { label: 'Planes / Gleitgelenk', body: 'Kleine Gleitbewegungen in verschiedenen Richtungen. Beispiel: Handwurzel- und Fußwurzelgelenke.' },
        ],
      },
      {
        heading: 'Bewegungsrichtungen',
        items: [
          { label: 'Beugung (Flexion)', body: 'Verkleinerung des Winkels zwischen zwei Knochen.' },
          { label: 'Streckung (Extension)', body: 'Vergrößerung des Winkels zwischen zwei Knochen.' },
          { label: 'Abduktion (Abspreizung)', body: 'Bewegung von der Körpermitte weg.' },
          { label: 'Adduktion (Anspreizung)', body: 'Bewegung zur Körpermitte hin.' },
          { label: 'Rotation (Drehung)', body: 'Drehung um die Längsachse.' },
          { label: 'Kreisbewegung (Zirkumduktion)', body: 'Kombination aus Beugung, Streckung und Rotation.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Gelenkknorpel', body: 'Glatter, elastischer Knorpelüberzug an den Knochenenden. Sorgt für glatte Oberflächen und dämpft Stöße. Nicht durchblutet — wird über die Synovia ernährt.' },
          { label: 'Synovia (Gelenkschmiere)', body: 'Zähflüssige Flüssigkeit im Gelenkspalt. Schmiert, ernährt den Knorpel und transportiert Abfallstoffe ab.' },
          { label: 'Bänder', body: 'Strapazierfähige Bindegewebsfasern. Verbinden Knochen mit Knochen und stabilisieren das Gelenk.' },
          { label: 'Gelenkkapsel', body: 'Faserkapsel umgibt das Gelenk und bildet mit der Synovialmembran eine schützende Hülle.' },
          { label: 'Meniskus / Discus', body: 'Faserknorpel-Polster zwischen Knochen — vergrößert die Kontaktfläche und verteilt den Druck.' },
          { label: 'Arthrose', body: 'Verschleißerkrankung des Gelenks: Knorpelabbau, Knorpelglattheit-Verlust, Knochenveränderungen, Schmerzen und Bewegungseinschränkung.' },
        ],
      },
      {
        heading: 'Wusstest du?',
        items: [
          { label: 'Anzahl', body: 'Der Mensch hat über 100 echte (synoviale) Gelenke.' },
          { label: 'Knorpel ohne Nerven', body: 'Gelenkknorpel ist nicht durchblutet und hat keine Nerven — daher merken wir Schäden oft erst spät.' },
          { label: 'Synovia ernährt', body: 'Die Synovia ernährt den Gelenkknorpel und hält ihn geschmeidig.' },
          { label: 'Verschleiß', body: 'Bei Fehlbelastung oder Überlastung können sich Gelenke abnutzen — das führt zu Arthrose.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/die-gelenke-arbeitsblatt.png',
    alt: 'Arbeitsblatt Die Gelenkarten des Menschen zum Ausfüllen',
    tasks: [
      {
        id: 'aufbau',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Aufbau eines synovialen Gelenks',
        prompt: 'Beschrifte die 8 nummerierten Bestandteile des Gelenks.',
        items: [
          { number: 1, accept: ['Gelenkkopf', 'Caput articulare'] },
          { number: 2, accept: ['Gelenkpfanne', 'Pfanne', 'Cavitas glenoidalis'] },
          { number: 3, accept: ['Gelenkkapsel', 'Kapsel', 'Capsula articularis'] },
          { number: 4, accept: ['Gelenkknorpel', 'Knorpel', 'Hyaliner Knorpel', 'Cartilago'] },
          { number: 5, accept: ['Synovia', 'Gelenkschmiere', 'Gelenkflüssigkeit', 'Gelenkfluessigkeit', 'Synovialflüssigkeit', 'Synovialfluessigkeit'] },
          { number: 6, accept: ['Bänder', 'Baender', 'Band', 'Ligament', 'Ligamente'] },
          { number: 7, accept: ['Gelenkspalt', 'Gelenkhöhle', 'Gelenkhoehle', 'Spalt', 'Cavitas articularis'] },
          { number: 8, accept: ['Meniskus', 'Discus', 'Meniskus / Discus', 'Faserknorpel', 'Knorpelpolster', 'Diskus'] },
        ],
      },
      {
        id: 'funktionen',
        type: 'open-list',
        title: 'Aufgabe 2: Aufgaben der Gelenke',
        prompt: 'Nenne sechs wichtige Funktionen oder Aufgaben der Gelenke.',
        expectedCount: 6,
        pool: [
          { accept: ['Bewegung', 'Bewegung ermöglichen', 'Bewegung ermoeglichen', 'Beweglichkeit'] },
          { accept: ['Kraftübertragung', 'Kraftuebertragung', 'Kräfte übertragen', 'Kraefte uebertragen', 'Kraft übertragen', 'Kraft uebertragen'] },
          { accept: ['Stabilität', 'Stabilitaet', 'Stabilität sichern', 'Stabilitaet sichern', 'Halt', 'Stabilisierung'] },
          { accept: ['Stoßbelastung', 'Stossbelastung', 'Stoßdämpfung', 'Stossdaempfung', 'Stöße abfedern', 'Stoesse abfedern', 'Stoßbelastung abfedern', 'Stossbelastung abfedern', 'Dämpfung', 'Daempfung'] },
          { accept: ['Bewegungsrichtung', 'Bewegungsrichtung führen', 'Bewegungsrichtung fuehren', 'Führung', 'Fuehrung', 'Bewegungsführung', 'Bewegungsfuehrung'] },
          { accept: ['Zusammenarbeit mit Muskeln und Sehnen', 'Zusammenarbeit mit Muskeln', 'Mitwirkung Muskulatur', 'Bewegungsapparat', 'mit Muskeln', 'mit Sehnen'] },
          { accept: ['Schutz vor Reibung', 'Reibungsschutz', 'Schutz', 'reibungsarm', 'Schmierung', 'Schmierfunktion'] },
        ],
      },
      {
        id: 'strukturen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Gelenkarten',
        prompt: 'Benenne die abgebildeten Gelenkarten.',
        items: [
          { hint: 'Bewegungen in viele Richtungen — z. B. Schulter, Hüfte', accept: ['Kugelgelenk', 'Kugel', 'Articulatio spheroidea'] },
          { hint: 'Beugung und Streckung in einer Ebene — z. B. Ellenbogen', accept: ['Scharniergelenk', 'Scharnier', 'Ginglymus'] },
          { hint: 'Drehbewegung um eine Längsachse — z. B. Atlas/Axis oder Speiche/Elle', accept: ['Drehgelenk', 'Zapfengelenk', 'Radgelenk', 'Articulatio trochoidea'] },
          { hint: 'Kleine Gleitbewegungen — z. B. Handwurzel- oder Fußwurzelgelenke', accept: ['Planes', 'Gleitgelenk', 'Planes Gelenk', 'Planes/Gleitgelenk', 'Articulatio plana', 'Plangelenk'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Zusatzfrage',
        items: [
          {
            prompt: '1. Was ist der Unterschied zwischen echten und unechten Gelenken?',
            keywords: ['echt', 'unecht', 'synarthros', 'diarthros', 'beweglich', 'frei beweglich', 'kaum beweglich', 'nicht beweglich', 'spalt', 'gelenkspalt', 'kapsel', 'synovia', 'schädel', 'schaedel', 'knorpel', 'bandscheibe', 'bindegewebe'],
            minMatches: 3,
            sampleAnswer:
              'Echte Gelenke (Diarthrosen) sind frei beweglich: Zwischen den Knochen liegt ein flüssigkeitsgefüllter Gelenkspalt, das Gelenk wird von einer Gelenkkapsel umschlossen, und die Knochenenden sind mit Knorpel überzogen (z. B. Knie, Hüfte, Schulter). Unechte Gelenke (Synarthrosen) sind kaum oder gar nicht beweglich: Die Knochen sind durch Bindegewebe, Knorpel oder Knochengewebe fest verbunden (z. B. Schädelnähte, Bandscheiben).',
          },
          {
            prompt: '2. Warum sind Gelenkknorpel und Synovia wichtig?',
            keywords: ['knorpel', 'synovia', 'schmier', 'gleit', 'reibung', 'reibungsarm', 'puffer', 'dämpf', 'daempf', 'stoß', 'stoss', 'ernährt', 'ernaehrt', 'ernährung', 'ernaehrung', 'glatt', 'durchblutet', 'nerv'],
            minMatches: 3,
            sampleAnswer:
              'Der Gelenkknorpel sorgt für glatte, reibungsarme Oberflächen an den Knochenenden und dämpft Stöße. Da er nicht durchblutet ist, wird er von der Synovia (Gelenkschmiere) ernährt. Die Synovia schmiert das Gelenk, transportiert Abfallstoffe ab und hält den Knorpel geschmeidig. Zusammen sorgen beide dafür, dass das Gelenk reibungsarm, schmerzfrei und langlebig funktioniert — ohne sie würde es schnell zu Verschleiß und Arthrose kommen.',
          },
        ],
      },
    ],
  },
};

export default dieGelenke;
