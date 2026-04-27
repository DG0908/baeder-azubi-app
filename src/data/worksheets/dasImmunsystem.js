const dasImmunsystem = {
  id: 'das-immunsystem',
  title: 'Das menschliche Immunsystem',
  subtitle: 'Aufbau, Abwehrmechanismen und wichtige Organe des Körpers',
  category: 'health',
  icon: '🛡️',
  estimatedMinutes: 18,
  reference: {
    image: '/worksheets/das-immunsystem-referenz.png',
    alt: 'Lernblatt Das menschliche Immunsystem mit allen Beschriftungen',
    intro:
      'Das Immunsystem schützt den Körper vor Krankheitserregern wie Bakterien, Viren, Pilzen und Parasiten. Es besteht aus Organen (z. B. Mandeln, Thymus, Milz, Lymphknoten, Knochenmark), Lymphgefäßen und vielen verschiedenen Abwehrzellen. Man unterscheidet die angeborene (unspezifische) Abwehr — schnell und gegen viele Erreger gleich — von der erworbenen (spezifischen) Abwehr, die gezielt Antikörper und Gedächtniszellen bildet und so langfristigen Schutz aufbaut.',
    sections: [
      {
        heading: 'Aufbau (zwei Abwehrarten)',
        items: [
          { label: 'Angeborene (unspezifische) Abwehr', body: 'Schnell und sofort wirksam. Reagiert auf viele Erreger gleich, hat aber keine dauerhafte Erinnerung. Dazu gehören Haut/Schleimhäute, Fresszellen, Entzündung und Fieber.' },
          { label: 'Erworbene (spezifische) Abwehr', body: 'Reagiert gezielt auf bestimmte Erreger. Bildet Antikörper und Gedächtniszellen — sorgt für langanhaltenden Schutz nach Infektion oder Impfung.' },
        ],
      },
      {
        heading: 'Drei Abwehrlinien',
        items: [
          { label: '1. Äußere Barrieren', body: 'Haut, Schleim und Magensäure verhindern, dass Erreger überhaupt in den Körper gelangen.' },
          { label: '2. Unspezifische Abwehr', body: 'Fresszellen, Entzündung und Fieber bekämpfen Eindringlinge schnell und unselektiv.' },
          { label: '3. Spezifische Abwehr', body: 'Lymphozyten, Antikörper und Gedächtniszellen reagieren gezielt — effektiv und mit Langzeitschutz.' },
        ],
      },
      {
        heading: 'Wichtige Immunorgane',
        items: [
          { label: 'Mandeln', body: 'Wehren Erreger im Rachen ab — erste Station für eingeatmete oder verschluckte Erreger.' },
          { label: 'Thymus', body: 'Ort der Reifung und Ausbildung von T-Lymphozyten.' },
          { label: 'Milz', body: 'Filtert das Blut, entfernt Erreger und alte Blutzellen, speichert Abwehrzellen.' },
          { label: 'Lymphknoten', body: 'Filtern die Lymphe, erkennen Erreger und aktivieren Abwehrzellen — schwellen bei Infektionen an.' },
          { label: 'Knochenmark', body: 'Bildet alle Blutzellen, darunter auch die meisten Immunzellen.' },
          { label: 'Lymphgefäße', body: 'Transportieren Lymphe und Immunzellen durch den ganzen Körper.' },
        ],
      },
      {
        heading: 'Wichtige Abwehrzellen',
        items: [
          { label: 'Fresszellen (Makrophagen)', body: 'Nehmen Erreger auf, verdauen sie und präsentieren Bruchstücke anderen Zellen — starten so die spezifische Abwehr.' },
          { label: 'Granulozyten', body: 'Bekämpfen Bakterien und Pilze mit Enzymen und Abwehrstoffen.' },
          { label: 'B-Lymphozyten', body: 'Reifen zu Plasmazellen und bilden Antikörper gegen spezifische Erreger.' },
          { label: 'T-Lymphozyten', body: 'Steuern die Immunantwort und zerstören infizierte Körperzellen.' },
          { label: 'Natürliche Killerzellen (NK)', body: 'Erkennen und zerstören virusinfizierte oder entartete (z. B. Tumor-)Körperzellen.' },
        ],
      },
      {
        heading: 'So reagiert der Körper (5 Schritte)',
        items: [
          { label: '1. Erreger dringt ein', body: 'Bakterien, Viren oder Pilze gelangen in den Körper — z. B. über Wunden, Atemwege oder Schleimhäute.' },
          { label: '2. Erkennung', body: 'Fresszellen erkennen die Erreger und lösen Alarm aus.' },
          { label: '3. Immunreaktion', body: 'Abwehrzellen werden aktiviert, Entzündung und Fieber können entstehen.' },
          { label: '4. Antikörper / Abwehrzellen', body: 'Antikörper binden Erreger, Fresszellen vernichten sie, T-Zellen zerstören infizierte Zellen.' },
          { label: '5. Gedächtnis', body: 'Gedächtniszellen bleiben im Körper und sorgen bei erneutem Kontakt für schnellen Schutz.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Antigen', body: 'Fremdstoff (z. B. Teil eines Erregers), der vom Körper als "feindlich" erkannt wird und eine Immunreaktion auslöst.' },
          { label: 'Antikörper', body: 'Eiweißstoffe, die von B-Lymphozyten/Plasmazellen gebildet werden und sich an Antigene binden, um sie unschädlich zu machen.' },
          { label: 'Entzündung', body: 'Abwehrreaktion bei Gewebeschädigung oder Infektion — Rötung, Schwellung, Wärme, Schmerz und Funktionsverlust.' },
          { label: 'Lymphe', body: 'Klare Gewebeflüssigkeit mit Immunzellen, wird in den Lymphgefäßen durch den Körper transportiert.' },
          { label: 'Gedächtniszelle', body: 'Langlebige Immunzelle, die sich an einen Erreger erinnert und bei erneutem Kontakt eine schnelle Abwehr ermöglicht.' },
          { label: 'Impfung', body: 'Trainiert das Immunsystem mit abgeschwächten oder abgetöteten Erregern (oder deren Bauplänen) — schützt langfristig, ohne dass man krank wird.' },
        ],
      },
      {
        heading: 'Wusstest du?',
        items: [
          { label: 'Fieber hilft', body: 'Erhöhte Körpertemperatur hemmt viele Erreger und aktiviert Immunzellen — Fieber ist eine sinnvolle Abwehrreaktion.' },
          { label: 'Impfungen trainieren', body: 'Impfungen zeigen dem Immunsystem den Erreger, ohne dass eine Krankheit entsteht — das schützt langfristig.' },
          { label: 'Geschwollene Lymphknoten', body: 'Bei Infektionen schwellen Lymphknoten an, weil sie auf Hochtouren arbeiten und viele Abwehrzellen und Erreger filtern.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/das-immunsystem-arbeitsblatt.png',
    alt: 'Arbeitsblatt Das menschliche Immunsystem zum Ausfüllen',
    tasks: [
      {
        id: 'aufbau',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Aufbau des Immunsystems',
        prompt: 'Beschrifte die 12 nummerierten Bestandteile.',
        items: [
          { number: 1, accept: ['Mandeln', 'Tonsillen', 'Rachenmandeln', 'Gaumenmandeln'] },
          { number: 2, accept: ['Lymphknoten', 'Lymphknotenstation', 'Halslymphknoten'] },
          { number: 3, accept: ['Thymus', 'Bries', 'Thymusdrüse', 'Thymusdruese'] },
          { number: 4, accept: ['Lymphgefäße', 'Lymphgefaesse', 'Lymphsystem', 'Lymphbahnen', 'Lymphkanäle', 'Lymphkanaele'] },
          { number: 5, accept: ['Milz', 'Lien', 'Splen'] },
          { number: 6, accept: ['Knochenmark', 'Rotes Knochenmark', 'Markhöhle', 'Markhoehle'] },
          { number: 7, accept: ['Weiße Blutkörperchen', 'Weisse Blutkoerperchen', 'Leukozyten', 'Immunzellen', 'Abwehrzellen', 'Blutzellen'] },
          { number: 8, accept: ['Haut', 'Hautbarriere', 'Schutzbarriere der Haut'] },
          { number: 9, accept: ['Fresszelle', 'Fresszellen', 'Makrophage', 'Makrophagen', 'Phagozyt', 'Phagozyten'] },
          { number: 10, accept: ['Antikörper', 'Antikoerper', 'B-Lymphozyt', 'B-Zelle', 'Plasmazelle', 'Immunglobuline'] },
          { number: 11, accept: ['Erreger', 'Krankheitserreger', 'Virus', 'Bakterium', 'Bakterien', 'Pathogen', 'Keime'] },
          { number: 12, accept: ['Lymphgefäße', 'Lymphgefaesse', 'Lymphatisches Gefäßsystem', 'Lymphatisches Gefaesssystem', 'Lymphgefäße der Beine', 'Lymphgefaesse der Beine', 'Lymphbahn', 'Lymphbahnen'] },
        ],
      },
      {
        id: 'funktionen',
        type: 'open-list',
        title: 'Aufgabe 2: Funktionen des Immunsystems',
        prompt: 'Nenne sechs wichtige Aufgaben oder Funktionen des Immunsystems.',
        expectedCount: 6,
        pool: [
          { accept: ['Schutz vor Krankheitserregern', 'Schutz vor Erregern', 'Abwehr von Krankheitserregern', 'Schutz', 'Schutzfunktion'] },
          { accept: ['Erkennung von Erregern', 'Erreger erkennen', 'Erkennen', 'Antigenerkennung', 'Erkennung von Antigenen'] },
          { accept: ['Bekämpfung von Erregern', 'Bekaempfung von Erregern', 'Abwehr', 'Erreger bekämpfen', 'Erreger bekaempfen', 'Abwehr von Bakterien Viren Pilzen', 'Vernichtung von Erregern'] },
          { accept: ['Entfernung kranker Zellen', 'Entfernung infizierter Zellen', 'Zerstörung infizierter Zellen', 'Zerstoerung infizierter Zellen', 'Beseitigung infizierter Zellen', 'Tumorabwehr'] },
          { accept: ['Bildung von Antikörpern', 'Bildung von Antikoerpern', 'Antikörperbildung', 'Antikoerperbildung', 'Antikörper produzieren', 'Antikoerper produzieren'] },
          { accept: ['Immungedächtnis', 'Immungedaechtnis', 'Gedächtnis', 'Gedaechtnis', 'Gedächtniszellen bilden', 'Gedaechtniszellen bilden', 'Langzeitschutz', 'Immunität', 'Immunitaet'] },
          { accept: ['Entzündungsreaktion', 'Entzuendungsreaktion', 'Entzündung auslösen', 'Entzuendung ausloesen', 'Fieber', 'Fieber auslösen', 'Fieber ausloesen'] },
          { accept: ['Selbst-Fremd-Erkennung', 'Unterscheidung zwischen eigen und fremd', 'Eigen-Fremd-Erkennung', 'Selbsttoleranz'] },
          { accept: ['Schutzbarriere', 'Schutz durch Haut und Schleimhäute', 'Schutz durch Haut und Schleimhaeute', 'Mechanische Abwehr', 'Erste Abwehrlinie'] },
        ],
      },
      {
        id: 'strukturen',
        type: 'labels',
        title: 'Aufgabe 3: Wichtige Strukturen / Abwehrformen',
        prompt: 'Benenne die abgebildeten Strukturen und Abwehrformen.',
        items: [
          { hint: 'Hautquerschnitt mit Haaren — äußere Schutzbarriere', accept: ['Haut', 'Hautbarriere', 'Schutzbarriere', 'Haut und Schleimhäute', 'Haut und Schleimhaeute', 'Erste Abwehrlinie', 'Mechanische Barriere'] },
          { hint: 'Zelle, die einen Erreger aufnimmt und verdaut', accept: ['Fresszelle', 'Makrophage', 'Phagozyt', 'Phagozytose', 'Fresszellen', 'Makrophagen'] },
          { hint: 'Y-förmige Eiweißstoffe, die an einen Erreger binden', accept: ['Antikörper', 'Antikoerper', 'Antigen-Antikörper-Reaktion', 'Antigen-Antikoerper-Reaktion', 'Immunglobuline', 'Antikörperreaktion', 'Antikoerperreaktion'] },
          { hint: 'Querschnitt durch ein Lymphorgan mit Gefäßen', accept: ['Lymphknoten', 'Lymphgewebe', 'Lymphfollikel', 'Lymphsystem'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Zusatzfrage',
        items: [
          {
            prompt: '1. Was ist der Unterschied zwischen angeborener (unspezifischer) und erworbener (spezifischer) Abwehr?',
            keywords: ['angeboren', 'erworben', 'unspezifisch', 'spezifisch', 'schnell', 'sofort', 'gezielt', 'gleich', 'antikörper', 'antikoerper', 'gedächtnis', 'gedaechtnis', 'gedächtniszellen', 'gedaechtniszellen', 'lymphozyten', 'erinnerung', 'langzeit', 'fresszellen', 'haut', 'fieber'],
            minMatches: 4,
            sampleAnswer:
              'Die angeborene (unspezifische) Abwehr ist von Geburt an vorhanden, reagiert schnell und sofort auf viele verschiedene Erreger gleich. Dazu gehören Haut und Schleimhäute, Fresszellen, Entzündung und Fieber. Sie hat aber keine dauerhafte Erinnerung. Die erworbene (spezifische) Abwehr entwickelt sich erst durch den Kontakt mit Erregern. Sie reagiert gezielt auf bestimmte Erreger, bildet Antikörper und Gedächtniszellen und sorgt so für einen langanhaltenden Schutz — beim nächsten Kontakt erkennt der Körper den Erreger sofort und bekämpft ihn schneller.',
          },
          {
            prompt: '2. Warum sind Impfungen für das Immunsystem wichtig?',
            keywords: ['impfung', 'training', 'trainier', 'erreger', 'kennen', 'erkennen', 'gedächtnis', 'gedaechtnis', 'gedächtniszellen', 'gedaechtniszellen', 'antikörper', 'antikoerper', 'schutz', 'krankheit', 'verhindern', 'immunität', 'immunitaet', 'abgeschwächt', 'abgeschwaecht', 'spezifisch', 'langzeit'],
            minMatches: 4,
            sampleAnswer:
              'Impfungen trainieren das Immunsystem, ohne dass man richtig krank wird. Dabei werden abgeschwächte oder abgetötete Erreger (oder deren Bestandteile) in den Körper gebracht. Das Immunsystem reagiert wie bei einer echten Infektion: Es bildet Antikörper und Gedächtniszellen gegen den Erreger. Kommt der Körper später mit dem echten Erreger in Kontakt, wird dieser sofort erkannt und schnell bekämpft — die Krankheit bricht meist gar nicht erst aus oder verläuft viel milder. So schützen Impfungen langfristig vor gefährlichen Krankheiten und können auch Ausbrüche in der Bevölkerung verhindern.',
          },
        ],
      },
    ],
  },
};

export default dasImmunsystem;
