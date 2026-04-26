const knochenbrueche = {
  id: 'knochenbrueche',
  title: 'Knochenbrüche',
  subtitle: 'Offene und geschlossene Brüche erkennen, richtig handeln und Notfälle einschätzen',
  category: 'first',
  icon: '🦴',
  estimatedMinutes: 22,
  reference: {
    image: '/worksheets/knochenbrueche-referenz.png',
    alt: 'Lernblatt Knochenbrüche — geschlossener und offener Bruch, Warnzeichen, Erste-Hilfe-Maßnahmen und Notfallkriterien',
    intro:
      'Ein Knochenbruch (Fraktur) ist eine Unterbrechung der Knochenstruktur. Man unterscheidet GESCHLOSSENE Brüche (Haut bleibt heil) und OFFENE Brüche (Haut ist verletzt, Knochen ggf. sichtbar) — offene Brüche haben ein hohes Infektions- und Blutungsrisiko und sind IMMER ein Notfall. Wichtigste Erste-Hilfe-Regeln: Ruhigstellen, kühlen (NICHT direkt auf die Haut), offene Wunden steril abdecken — NICHT einrenken, NICHT belasten lassen, keine Fremdkörper entfernen. Bei offenen Brüchen, starker Fehlstellung, starker Blutung oder Verdacht auf Wirbelsäulenverletzung sofort 112. Merksatz: Ruhigstellen, kühlen, schützen — bei offenen oder schweren Brüchen sofort 112.',
    sections: [
      {
        heading: 'Was ist ein Knochenbruch?',
        items: [
          { label: 'Definition (Fraktur)', body: 'Ein Knochenbruch ist eine Unterbrechung der normalen Knochenstruktur — meist durch Sturz, Stoß oder direkten Schlag.' },
          { label: 'Geschlossen oder offen', body: 'Geschlossener Bruch: Haut über dem Bruch ist heil. Offener Bruch: Haut ist verletzt, Knochen kann sichtbar sein — Lebensgefahr durch Infektion und Blutverlust.' },
          { label: 'Lokalisation', body: 'Häufige Stellen im Bäderbetrieb: Handgelenk (Sturz auf ausgestreckte Hand), Sprunggelenk (Umknicken auf Fliesen), Unterschenkel, Hüfte (Sturz älterer Gäste), Wirbelsäule (Kopfsprung in flaches Wasser).' },
          { label: 'Begleitverletzungen', body: 'Bei jedem Bruch können auch Gefäße, Nerven, Muskeln und innere Organe (z. B. Lunge bei Rippenbruch, Rückenmark bei Wirbelbruch) verletzt sein.' },
        ],
      },
      {
        heading: 'Geschlossener oder offener Bruch?',
        items: [
          { label: 'GESCHLOSSENER BRUCH', body: 'Knochen ist gebrochen, aber die Haut bleibt unverletzt. Typisch: Schmerzen, Schwellung, Fehlstellung, Bewegungseinschränkung — meist ohne sichtbare Wunde.' },
          { label: 'OFFENER BRUCH', body: 'Knochenbruch mit offener Wunde — Knochen kann sichtbar sein. Höheres Risiko für starke Blutung und Infektion. IMMER ein Notfall, sofort 112.' },
          { label: 'Erkennen', body: 'Sichtbare Wunde über der Bruchstelle, Knochen-Splitter durch die Haut, starke äußere Blutung — Hinweise auf offenen Bruch.' },
          { label: 'Wichtig', body: 'Auch wenn ein Bruch zunächst "geschlossen" wirkt: bei Schwellung, Fehlstellung oder Schmerz IMMER ärztlich abklären lassen.' },
        ],
      },
      {
        heading: 'Typische Warnzeichen',
        items: [
          { label: 'Starke Schmerzen', body: 'Bewegungs- und Druckschmerz an der Bruchstelle — auch in Ruhe deutliche Schmerzen.' },
          { label: 'Schwellung', body: 'Sichtbare, oft rasche Schwellung der betroffenen Region — durch Blutung und Gewebereaktion.' },
          { label: 'Fehlstellung', body: 'Sichtbare abnorme Stellung der Extremität — Achse stimmt nicht mehr, Glied steht "schief". Sicherer Bruchhinweis.' },
          { label: 'Schonhaltung', body: 'Person hält das verletzte Körperteil schützend ruhig oder dreht sich von ihm weg — versucht jede Bewegung zu vermeiden.' },
          { label: 'Eingeschränkte Beweglichkeit', body: 'Die normale Bewegung des Gliedmaßes ist nicht oder nur unter starken Schmerzen möglich — kein "Belasten" möglich.' },
          { label: 'Knirschen / abnorme Beweglichkeit', body: 'Knirschende Geräusche (Krepitation) oder Beweglichkeit an einer Stelle, an der sonst keine ist — sicherer Bruchhinweis. NICHT bewusst auslösen!' },
          { label: 'Blutung / offene Wunde', body: 'Bei offenem Bruch: sichtbare Wunde, möglicherweise Knochenfragmente, starke Blutung — Notfall.' },
          { label: 'Taubheit oder Kribbeln', body: 'Hinweis auf Nerven- oder Durchblutungsschaden distal (unterhalb) der Bruchstelle — sofort 112.' },
        ],
      },
      {
        heading: 'Erste Hilfe — richtig handeln',
        items: [
          { label: '1. Ruhe bewahren', body: 'Selbst ruhig bleiben — Hektik überträgt sich auf die Person und kann zu unbedachten Bewegungen führen.' },
          { label: '2. Verletzten Körperteil ruhigstellen', body: 'Die Bruchstelle in der gefundenen Position fixieren — bei Bedarf provisorisch schienen (Decke, Kissen, Karton). Person nicht zur Bewegung drängen.' },
          { label: '3. Nicht unnötig bewegen', body: 'Person möglichst NICHT bewegen — bei Verdacht auf Wirbelsäulenverletzung oder Hüftbruch ggf. liegen lassen, bis Rettungsdienst übernimmt.' },
          { label: '4. Kühlen — nicht direkt auf die Haut', body: 'Kühlpack oder kalte Kompresse mit Tuch zwischen Haut und Kühlmittel — Erfrierungen vermeiden. Kühlpausen alle 20 Minuten.' },
          { label: '5. Offene Wunden steril abdecken', body: 'Bei offenem Bruch: Wunde mit steriler Kompresse oder sauberem Tuch locker abdecken — NICHT auf den herausstehenden Knochen drücken, NICHT in die Wunde fassen.' },
          { label: '6. Notruf 112 bei schweren Zeichen', body: 'Bei offenem Bruch, starker Fehlstellung, starker Blutung oder Verdacht auf Wirbelsäulenverletzung sofort 112. Bei Bedarf parallel Schock-Vorbeugung (warm halten, ansprechen, Atmung beobachten).' },
        ],
      },
      {
        heading: 'Wann wird es zum Notfall? — Sofort 112',
        items: [
          { label: 'Offener Bruch', body: 'Knochen sichtbar oder durch die Haut gebrochen — Lebensgefahr durch Infektion und Blutverlust. Sofort 112.' },
          { label: 'Starke Fehlstellung', body: 'Deutlich sichtbare Achsenabweichung — meist mit Begleitverletzung von Gefäßen oder Nerven. Sofort 112.' },
          { label: 'Starke Blutung', body: 'Anhaltende oder pulsierende Blutung — Druck auf Wunde, ABER nicht direkt auf Knochenfragment. Sofort 112.' },
          { label: 'Verdacht auf Wirbelsäulenverletzung', body: 'Sturz aus Höhe, Kopfsprung in flaches Wasser, Gefühlsstörung in den Beinen, Lähmung — Person NICHT bewegen, achsengerecht lagern, sofort 112.' },
          { label: 'Gefühls- oder Durchblutungsstörung', body: 'Taubheit, Kribbeln, blasses oder bläuliches Glied unterhalb der Bruchstelle, kein Puls tastbar — kritisch, sofort 112.' },
          { label: 'Sehr starke Schmerzen', body: 'Unerträgliche Schmerzen, die auf Schock oder Mehrfachverletzungen hindeuten — sofort 112.' },
          { label: 'Bewusstseinsstörung', body: 'Person ist verwirrt, benommen, bewusstlos — Hinweis auf Schock oder zusätzliche Kopfverletzung. Sofort 112.' },
        ],
      },
      {
        heading: 'Was man vermeiden sollte',
        items: [
          { label: 'Nicht einrenken', body: 'Bruch NIEMALS selbst einrenken oder geraderücken — Verletzung von Gefäßen, Nerven oder Muskeln möglich. Nur Rettungsdienst oder Klinik.' },
          { label: 'Nicht belasten lassen', body: 'Person darf den verletzten Körperteil NICHT belasten — Verschiebung der Bruchenden und Sekundärschaden möglich.' },
          { label: 'Keine unnötigen Bewegungen', body: 'Person nicht aufrichten, nicht herumdrehen — alles, was nicht zwingend nötig ist, weglassen.' },
          { label: 'Fremdkörper nicht entfernen', body: 'Glas, Metall, Holz in der Wunde NIE selbst entfernen — können wie ein Stöpsel wirken und stärkere Blutung verhindern.' },
          { label: 'Offene Fraktur nicht berühren', body: 'Knochen und Wundgebiet NICHT berühren — Infektionsrisiko. Nur steril abdecken.' },
          { label: 'Keine Schmerzmittel ohne ärztliche Anweisung', body: 'Selbst keine Schmerz- oder Beruhigungsmittel geben — können OP-Vorbereitung erschweren oder Symptome verschleiern.' },
        ],
      },
      {
        heading: 'Wichtige Begriffe',
        items: [
          { label: 'Fraktur', body: 'Medizinischer Begriff für Knochenbruch — Unterbrechung der Knochenstruktur durch Krafteinwirkung.' },
          { label: 'Geschlossene Fraktur', body: 'Bruch ohne Verletzung der darüber liegenden Haut — geringeres Infektionsrisiko, aber trotzdem ärztlich behandeln.' },
          { label: 'Offene Fraktur', body: 'Bruch mit Hautverletzung — Knochen kann sichtbar sein. IMMER Notfall, hohe Infektionsgefahr.' },
          { label: 'Krepitation', body: 'Knirschende Geräusche oder Knochenreiben bei Bewegung — sicherer Bruchhinweis. NICHT bewusst auslösen.' },
          { label: 'Schienung', body: 'Provisorische Fixierung des verletzten Körperteils — verhindert weitere Bewegung und Schmerz. Im Notfall mit Decke, Karton, Brett, Kleidung improvisieren.' },
          { label: 'Schonhaltung', body: 'Reflexartiges Festhalten oder Stützen des verletzten Körperteils — Hinweis auf Verletzung, auch ohne sichtbare Fehlstellung.' },
          { label: 'Distorsion (Verstauchung)', body: 'Überdehnung der Bänder/Gelenkkapsel — kein Knochenbruch. Bei Unsicherheit wie einen Bruch behandeln.' },
          { label: 'Luxation (Verrenkung)', body: 'Gelenkkopf aus seiner Pfanne ausgerenkt — sieht ähnlich wie Fehlstellung aus, ist aber kein Bruch. NIEMALS selbst einrenken.' },
        ],
      },
      {
        heading: 'Praxisbezug — im Bäderbetrieb',
        items: [
          { label: 'Stürze auf nassen Fliesen', body: 'Klassisches Risiko — Sturz auf Handgelenk (Radiusfraktur), Hüfte (älterer Gäste), Kopf. Sofort hinsetzen, Bruchstelle nicht belasten lassen, ggf. 112.' },
          { label: 'Verletzungen am Sprungturm', body: 'Aufprall auf Brett, Kopfsprung in flaches Wasser, Sturz beim Hochklettern — hohes Risiko für Wirbelsäulen- und Kopfverletzungen. Person NICHT bewegen, sofort 112.' },
          { label: 'Sportverletzungen im Schwimmkurs', body: 'Umknicken am Beckenrand, Aufprall auf Beckenwand, Stoß durch andere Schwimmer — typische Sprunggelenks- oder Schulterverletzungen.' },
          { label: 'Provisorische Schienung', body: 'Nutze, was vorhanden ist: Saunahandtücher, Pappe vom Erste-Hilfe-Koffer, Brettchen, Kissen. Ziel: Bewegung verhindern.' },
          { label: 'Im Wasser besondere Vorsicht', body: 'Bei Verdacht auf Wirbelsäulenverletzung im Wasser: achsengerecht bergen (Halsschiene aus Decke), Person nicht aufrichten, Kopf in Lage halten — auf Spineboard übergeben.' },
        ],
      },
      {
        heading: 'Praxis — Wichtiges auf einen Blick',
        items: [
          { label: 'RUHIGSTELLEN', body: 'Verletzten Körperteil in gefundener Position fixieren — provisorisch schienen mit Decke, Kissen, Karton.' },
          { label: 'KÜHLEN', body: 'Kühlpack mit Tuch zwischen Haut und Kühlmittel — Kühlpausen alle 20 Minuten, niemals direkt auf die Haut.' },
          { label: 'STERIL ABDECKEN', body: 'Offene Wunden mit steriler Kompresse oder sauberem Tuch locker abdecken — nichts in die Wunde drücken.' },
          { label: 'BEOBACHTEN', body: 'Atmung, Bewusstsein, Hautfarbe und Durchblutung des verletzten Glieds regelmäßig kontrollieren.' },
          { label: '112 BEI SCHWEREN ZEICHEN', body: 'Offener Bruch, starke Fehlstellung, starke Blutung, Wirbelsäulenverdacht, Gefühlsstörung — sofort 112.' },
        ],
      },
      {
        heading: 'Merksatz',
        items: [
          { label: 'Ruhigstellen, kühlen, schützen — bei offenen oder schweren Brüchen sofort 112', body: 'Knochenbrüche ernst nehmen — richtig helfen — Leben schützen. Drei Grundregeln: ruhigstellen, kühlen, schützen. Bei Warnzeichen: 112.' },
        ],
      },
    ],
  },
  exercise: {
    image: '/worksheets/knochenbrueche-arbeitsblatt.png',
    alt: 'Arbeitsblatt Knochenbrüche zum Ausfüllen',
    tasks: [
      {
        id: 'warnzeichen',
        type: 'numbered-labels',
        title: 'Aufgabe 1: Typische Warnzeichen erkennen',
        prompt: 'Beschrifte die acht typischen Warnzeichen eines Knochenbruchs.',
        items: [
          { number: 1, accept: ['Starke Schmerzen', 'Schmerz', 'Schmerzen', 'Starke Schmerzen an der Bruchstelle', 'Heftige Schmerzen', 'Bruchschmerz', 'Bewegungsschmerz'] },
          { number: 2, accept: ['Schwellung', 'Bluterguss', 'Hämatom', 'Haematom', 'Schwellung / Bluterguss', 'Geschwollen', 'Schwellung und Bluterguss', 'Bluterguss / Schwellung', 'Anschwellung'] },
          { number: 3, accept: ['Bewegungseinschränkung', 'Bewegungseinschraenkung', 'Schonhaltung', 'Eingeschränkte Beweglichkeit', 'Eingeschraenkte Beweglichkeit', 'Bewegungseinschränkung / Schonhaltung', 'Bewegungseinschraenkung / Schonhaltung', 'Eingeschränkte Bewegung', 'Eingeschraenkte Bewegung', 'Bewegung eingeschränkt', 'Bewegung eingeschraenkt'] },
          { number: 4, accept: ['Fehlstellung', 'Verformung', 'Abnorme Stellung', 'Achsenabweichung', 'Schiefstellung', 'Sichtbare Fehlstellung', 'Knochenfehlstellung'] },
          { number: 5, accept: ['Taubheit', 'Kribbeln', 'Gefühlsstörung', 'Gefuehlsstoerung', 'Sensibilitätsstörung', 'Sensibilitaetsstoerung', 'Taubheit / Kribbeln', 'Taubheit / Kribbeln / Gefühlsstörung', 'Taubheit / Kribbeln / Gefuehlsstoerung', 'Taubheitsgefühl', 'Taubheitsgefuehl', 'Pelzigkeit'] },
          { number: 6, accept: ['Offene Wunde', 'Offener Bruch', 'Offene Fraktur', 'Blutung', 'Offene Wunde / offener Bruch', 'Sichtbarer Knochen', 'Offene Wunde mit Knochen', 'Hautwunde mit Bruch', 'Wunde am Bruch'] },
          { number: 7, accept: ['Druckschmerz', 'Schmerzstelle', 'Lokaler Schmerz', 'Schmerz', 'Punktueller Schmerz', 'Schmerz an der Bruchstelle', 'Druckempfindlichkeit', 'Druckschmerz / Schmerzstelle'] },
          { number: 8, accept: ['Abnorme Beweglichkeit', 'Instabilität', 'Instabilitaet', 'Knirschen', 'Krepitation', 'Abnorme Beweglichkeit / Instabilität', 'Abnorme Beweglichkeit / Instabilitaet', 'Wackeln', 'Unkontrollierte Beweglichkeit', 'Beweglichkeit an falscher Stelle'] },
        ],
      },
      {
        id: 'verhalten',
        type: 'numbered-labels',
        title: 'Aufgabe 2: Richtiges Verhalten',
        prompt: 'Beschrifte die sechs Erste-Hilfe-Schritte bei einem Knochenbruch.',
        items: [
          { number: 1, accept: ['Ruhe bewahren', 'Beruhigen', 'Person beruhigen', 'Ruhe bewahren / Person beruhigen', 'Selbst Ruhe bewahren', 'Ruhig bleiben', 'Ruhe bewahren und Person beruhigen'] },
          { number: 2, accept: ['Verletzten Körperteil ruhigstellen', 'Verletzten Koerperteil ruhigstellen', 'Ruhigstellen', 'Ruhigstellung', 'Schienen', 'Schienung', 'Körperteil ruhigstellen', 'Koerperteil ruhigstellen', 'Bruchstelle ruhigstellen', 'Bruchstelle fixieren', 'Verletzten Bereich ruhigstellen'] },
          { number: 3, accept: ['Nicht unnötig bewegen', 'Nicht unnoetig bewegen', 'Nicht belasten', 'Nicht bewegen', 'Unnötige Bewegung vermeiden', 'Unnoetige Bewegung vermeiden', 'Nicht unnötig bewegen / nicht belasten', 'Nicht unnoetig bewegen / nicht belasten', 'Bewegung vermeiden', 'Nicht belasten lassen'] },
          { number: 4, accept: ['Kühlen', 'Kuehlen', 'Kühlung', 'Kuehlung', 'Kühlpack', 'Kuehlpack', 'Kalte Kompresse', 'Kühlpack auflegen', 'Kuehlpack auflegen', 'Kühlen mit Tuch', 'Kuehlen mit Tuch', 'Kühlen nicht direkt auf die Haut', 'Kuehlen nicht direkt auf die Haut'] },
          { number: 5, accept: ['Steril abdecken', 'Offene Wunde abdecken', 'Wundauflage', 'Offene Wunde steril abdecken', 'Steril abdecken bei offener Wunde', 'Sterile Wundauflage', 'Wunde abdecken', 'Sauberes Tuch auflegen', 'Wunde steril versorgen'] },
          { number: 6, accept: ['Notruf 112', '112', '112 rufen', 'Notruf', 'Notruf 112 wählen', 'Notruf 112 waehlen', 'Rettungsdienst rufen', 'Notruf absetzen', '112 anrufen', 'Notruf 112 bei schweren Zeichen'] },
        ],
      },
      {
        id: 'begriffe',
        type: 'numbered-labels',
        title: 'Aufgabe 3: Wichtige Begriffe',
        prompt: 'Benenne die vier wichtigen Begriffe und Situationen.',
        items: [
          { number: 1, accept: ['Geschlossener Bruch', 'Geschlossene Fraktur', 'Geschlossener Knochenbruch', 'Bruch geschlossen', 'Knochenbruch ohne offene Wunde', 'Geschlossen'] },
          { number: 2, accept: ['Offener Bruch', 'Offene Fraktur', 'Offener Knochenbruch', 'Bruch offen', 'Knochenbruch mit offener Wunde', 'Offen', 'Bruch mit Wunde'] },
          { number: 3, accept: ['Ruhigstellung', 'Schienung', 'Ruhigstellung / Schienung', 'Schiene', 'Geschient', 'Ruhigstellen', 'Schienen', 'Schiene anlegen', 'Bein in Schiene', 'Fixierung'] },
          { number: 4, accept: ['Notruf 112', '112', 'Notruf', '112 wählen', '112 waehlen', 'Notruf 112 wählen', 'Notruf 112 waehlen', 'Rettungsdienst rufen', 'Notruf absetzen'] },
        ],
      },
      {
        id: 'zusatz',
        type: 'keyword-text',
        title: 'Aufgabe 4: Zusatzfragen',
        items: [
          {
            prompt: '1. Was ist der Unterschied zwischen einem geschlossenen und einem offenen Bruch?',
            keywords: ['geschlossen', 'offen', 'haut', 'wunde', 'sichtbar', 'knochen', 'infektion', 'blutung', 'risiko', 'fraktur', 'unverletzt', 'notfall'],
            minMatches: 4,
            sampleAnswer:
              'Bei einem geschlossenen Bruch ist der Knochen gebrochen, aber die Haut über der Bruchstelle bleibt unverletzt. Bei einem offenen Bruch ist die Haut zusätzlich verletzt — eine offene Wunde besteht, in der Knochen oder tieferes Gewebe sichtbar sein können. Der offene Bruch ist deutlich gefährlicher: Das Risiko für eine starke Blutung und für eine Wundinfektion ist viel höher. Deshalb gilt der offene Bruch IMMER als Notfall — sofort 112, Wunde steril abdecken, NICHT in die Wunde fassen oder den Knochen berühren.',
          },
          {
            prompt: '2. Wann sollte bei einem Knochenbruch sofort der Notruf 112 gewählt werden?',
            keywords: ['offen', 'fehlstellung', 'blutung', 'wirbelsäule', 'wirbelsaeule', 'gefühl', 'gefuehl', 'durchblutung', 'taub', 'kribbeln', 'schmerz', 'bewusstsein', 'unsicher', 'schwer', '112', 'notruf'],
            minMatches: 3,
            sampleAnswer:
              'Sofort 112 rufen bei einem offenen Bruch (Knochen sichtbar oder durch die Haut), bei starker Fehlstellung der Extremität, bei starker oder anhaltender Blutung, bei Verdacht auf Wirbelsäulenverletzung (z. B. nach Sturz aus der Höhe oder Kopfsprung), bei Gefühlsstörung oder Durchblutungsstörung im verletzten Glied (Taubheit, Kribbeln, blass-bläuliche Verfärbung), bei sehr starken Schmerzen, bei Bewusstseinsstörung der Person — und generell bei Unsicherheit. Im Zweifel lieber einmal zu viel als zu wenig anrufen.',
          },
        ],
      },
    ],
  },
};

export default knochenbrueche;
