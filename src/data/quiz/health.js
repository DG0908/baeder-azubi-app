export const HEALTH_QUESTIONS = [
    { q: 'Wie viele Knochen hat der erwachsene Mensch?', a: ['206', '150', '300', '100'], correct: 0 },
    { q: 'Was ist das größte Organ des Menschen?', a: ['Die Haut', 'Die Leber', 'Das Herz', 'Die Lunge'], correct: 0 },
    { q: 'Wie viele Liter Blut pumpt das Herz pro Tag?', a: ['Ca. 7.000 Liter', 'Ca. 1.000 Liter', 'Ca. 500 Liter', 'Ca. 10.000 Liter'], correct: 0 },
    { q: 'Was transportiert das Blut im Körper?', a: ['Sauerstoff und Nährstoffe', 'Nur Wasser – Nährstoffe gehen andere Wege', 'Nur Hormone und sonst nichts', 'Nur CO2 als Abfallprodukt'], correct: 0 },
    { q: 'Welches Organ filtert das Blut?', a: ['Die Nieren', 'Die Leber', 'Die Milz', 'Das Herz'], correct: 0 },
    { q: 'Wie viele Herzkammern hat das menschliche Herz?', a: ['4', '2', '3', '6'], correct: 0 },
    { q: 'Was ist die Funktion der Lunge?', a: ['Gasaustausch (O2/CO2)', 'Blutreinigung', 'Hormonproduktion', 'Verdauung'], correct: 0 },
    { q: 'Wo findet die Verdauung hauptsächlich statt?', a: ['Im Dünndarm', 'Im Magen', 'Im Dickdarm', 'In der Speiseröhre'], correct: 0 },
    // Verdauungssystem
    { q: 'Wo werden Eiweiße bei der Verdauung gespalten?', a: ['Im Magen und Dünndarm', 'Nur im Mund', 'Nur im Dickdarm', 'In der Lunge'], correct: 0 },
    { q: 'Wo werden Kohlenhydrate gespalten?', a: ['Im Mund (Speichel) und Dünndarm', 'Nur im Magen durch Magensäure', 'Nur im Dickdarm durch Bakterien', 'In der Leber durch Leberenzyme'], correct: 0 },
    { q: 'Wo werden Verdauungssäfte hinzugefügt?', a: ['Magen, Bauchspeicheldrüse, Gallenblase', 'Nur im Mund durch Speichel', 'Nur im Dickdarm durch Darmflora', 'Nur in der Lunge durch Bronchialschleim'], correct: 0 },
    { q: 'Wo wird bei der Verdauung Wasser entzogen?', a: ['Im Dickdarm', 'Im Magen', 'Im Mund', 'In der Speiseröhre'], correct: 0 },
    { q: 'Was gehört zum Verdauungssystem? (Mehrere richtig)', a: ['Speiseröhre', 'Magen', 'Dünndarm', 'Bauchspeicheldrüse'], correct: [0, 1, 2, 3], multi: true },
    // Blutkreislauf
    { q: 'Was folgt im Blutkreislauf auf den rechten Vorhof?', a: ['Rechte Herzkammer', 'Linke Herzkammer', 'Aorta', 'Lunge'], correct: 0 },
    { q: 'Wohin pumpt die rechte Herzkammer das Blut?', a: ['In die Lungenarterie zur Lunge', 'In den Körperkreislauf über die Aorta', 'Ins Gehirn direkt über die Halsschlagader', 'In den Magen zur Verdauungsunterstützung'], correct: 0 },
    { q: 'Welche Reihenfolge ist im Blutkreislauf korrekt?', a: ['Rechter Vorhof → Rechte Kammer → Lunge → Linker Vorhof', 'Linker Vorhof → Lunge → Rechter Vorhof', 'Aorta → Lunge → Herz', 'Lunge → Magen → Herz → Niere'], correct: 0 },
    // Herz-Reiz-Leitungssystem
    { q: 'Was ist die Funktion des Herz-Reiz-Leitungssystems?', a: ['Koordinierte elektrische Erregung für rhythmischen Herzschlag', 'Blut durch die Herzklappen transportieren', 'Sauerstoff in der Herzmuskulatur speichern', 'Hormone für die Herzfrequenz produzieren'], correct: 0 },
    { q: 'Wo beginnt die Erregung im Herz-Reiz-Leitungssystem?', a: ['Sinusknoten', 'AV-Knoten', 'His-Bündel', 'Purkinje-Fasern'], correct: 0 },
    { q: 'Wie ist die Reihenfolge im Herz-Reiz-Leitungssystem?', a: ['Sinusknoten → AV-Knoten → His-Bündel → Purkinje-Fasern', 'AV-Knoten → Sinusknoten → Purkinje-Fasern', 'His-Bündel → Sinusknoten → AV-Knoten', 'Purkinje-Fasern → His-Bündel → Sinusknoten'], correct: 0 },

    // ===== PRÜFUNGSFACH 1: GESUNDHEITSLEHRE (Fragen 158-272) =====

    // --- UNTERKÜHLUNG UND KÄLTESCHÄDEN (Fragen 158-160) ---
    // Frage 158: Unterkühlung erkennen und Maßnahmen
    { q: 'Woran erkennt man eine Unterkühlung?', a: ['Kältezittern, blaue Lippen, Apathie, verlangsamte Reaktionen', 'Rotes Gesicht und starkes Schwitzen', 'Schwitzen und erhöhte Körpertemperatur', 'Hyperaktivität und gesteigerte Reflexe'], correct: 0 },
    { q: 'Welche Maßnahmen sind bei Unterkühlung zu treffen?', a: ['Langsam aufwärmen, nasse Kleidung entfernen, warme Getränke (bei Bewusstsein)', 'Schnell in heißes Wasser – so erwärmt man sich am schnellsten', 'Alkohol geben – wärmt von innen', 'Kräftig massieren – regt die Durchblutung an'], correct: 0 },
    // Frage 159: Warum unnötige Bewegung vermeiden bei Unterkühlung
    { q: 'Warum soll bei Unterkühlung jede unnötige Bewegung vermieden werden?', a: ['Kaltes Blut aus Extremitäten kann zum Herzstillstand führen (Bergungstod)', 'Um Energie zu sparen', 'Weil Bewegung Schmerzen verursacht', 'Um nicht zu schwitzen und weiter abzukühlen'], correct: 0 },
    // Frage 160: Unterschied Unterkühlung und Erfrierung
    { q: 'Was ist der Unterschied zwischen Unterkühlung und Erfrierung?', a: ['Unterkühlung = Körperkerntemperatur sinkt; Erfrierung = lokale Gewebeschädigung', 'Kein Unterschied – beide Begriffe meinen dasselbe', 'Erfrierung ist weniger schlimm und heilt schneller', 'Unterkühlung betrifft nur die Hände, Erfrierung den ganzen Körper'], correct: 0 },
    { q: 'Welche Sofortmaßnahmen führt man bei Erfrierung durch?', a: ['Langsam erwärmen, nicht reiben, steril abdecken', 'Mit Schnee abreiben – das kühlt kontrolliert', 'In heißes Wasser tauchen – Wärme hilft schnell', 'Stark massieren für bessere Durchblutung'], correct: 0 },

    // --- ZELLBIOLOGIE (Fragen 161-163) ---
    // Frage 161: Aufbau einer Zelle
    { q: 'Was ist der Grundbaustein des menschlichen Körpers?', a: ['Die Zelle', 'Das Atom', 'Das Molekül', 'Das Organ'], correct: 0 },
    { q: 'Welche Bestandteile hat eine Zelle?', a: ['Zellmembran, Zytoplasma, Zellkern, Mitochondrien', 'Nur der Zellkern – der Rest ist nicht wesentlich', 'Nur die Zellmembran als Hülle', 'Nur Wasser und Salze'], correct: 0 },
    // Frage 162: Zellatmung
    { q: 'Was ist die Zellatmung?', a: ['Energiegewinnung aus Nährstoffen unter Sauerstoffverbrauch', 'Atmen durch die Nase und den Mund', 'Gasaustausch in den Lungenbläschen', 'Bluttransport durch den Körperkreislauf'], correct: 0 },
    // Frage 163: Zellflüssigkeit und Aufgaben
    { q: 'Was ist Zellflüssigkeit (Zytoplasma)?', a: ['Gallertartige Substanz im Zellinneren, in der Zellorganellen schwimmen', 'Blut in der Zelle', 'Nur Wasser ohne weiteren Inhalt', 'Der Zellkern selbst'], correct: 0 },

    // --- WUNDEN UND INFEKTIONEN (Fragen 164-172) ---
    // Frage 164: Gefahren durch Wunden
    { q: 'Welche Gefahren entstehen durch eine Wunde?', a: ['Infektion, Blutverlust, Schmerzen, Funktionsverlust', 'Keine Gefahren – Wunden heilen immer von selbst', 'Nur Schmerzen, sonst nichts', 'Nur optische Probleme'], correct: 0 },
    // Frage 165: Begriffe Krankheitserreger, Infektion, Infektionskrankheit
    { q: 'Was sind Krankheitserreger?', a: ['Mikroorganismen, die Krankheiten verursachen (Bakterien, Viren, Pilze)', 'Nur Viren, alle anderen sind harmlos', 'Nur Bakterien, Viren sind keine Krankheitserreger', 'Nur Pilze, die äußerlich sichtbar sind'], correct: 0 },
    { q: 'Was ist eine Infektion?', a: ['Eindringen und Vermehrung von Krankheitserregern im Körper', 'Jede Erkrankung unabhängig von der Ursache', 'Nur Fieber mit mehr als 38°C', 'Nur Husten und Schnupfen'], correct: 0 },
    // Frage 166: Mikroorganismen beschreiben
    { q: 'Was sind Bakterien?', a: ['Einzellige Mikroorganismen, einige krankheitserregend', 'Viren ohne eigene Zellstruktur', 'Pilze mit Zellkern und Zellwand', 'Große mehrzellige Parasiten'], correct: 0 },
    { q: 'Was sind Viren?', a: ['Infektiöse Partikel, die Wirtszellen zur Vermehrung brauchen', 'Bakterien mit besonderer Zellwand', 'Pilze ohne Zellkern', 'Einzellige Lebewesen mit eigenem Stoffwechsel'], correct: 0 },
    // Frage 167: Erkrankungen durch Mikroorganismen
    { q: 'Welche Erkrankungen werden durch Bakterien verursacht?', a: ['Angina, Salmonellose, Tuberkulose', 'Grippe, Masern – diese Erkrankungen werden durch Bakterien übertragen', 'Fußpilz – Fußpilz ist eine bakterielle Hautinfektion', 'Malaria – der Malaria-Erreger ist ein Bakterium namens Plasmodium'], correct: 0 },
    // Frage 168: Bädertypische Krankheitserreger
    { q: 'Welche Krankheitserreger sind bädertypisch?', a: ['Pseudomonas, Legionellen, Fußpilze, Warzen (HPV)', 'Nur Erkältungsviren – das Baden kühlt den Körper aus und macht anfällig', 'Keine besonderen – ein gepflegtes Schwimmbad hat keine spezifischen Erreger', 'Nur allgemeine Bakterien – spezifische Baderreger existieren nicht'], correct: 0 },
    // Frage 169: Definition Berufskrankheit
    { q: 'Was ist eine Berufskrankheit?', a: ['Krankheit, die durch die berufliche Tätigkeit verursacht wird', 'Jede Krankheit, die während der Arbeitszeit auftritt', 'Nur Arbeitsunfälle – Krankheiten zählen nicht zu Berufskrankheiten', 'Nur psychische Erkrankungen durch Stress am Arbeitsplatz'], correct: 0 },
    // Frage 170: Was ist eine Infektion
    { q: 'Was passiert bei einer Infektion?', a: ['Erreger dringen ein, vermehren sich und lösen Reaktionen aus', 'Nur Fieber – eine Infektion äußert sich ausschließlich durch erhöhte Körpertemperatur', 'Nur lokale Schmerzen – systemische Reaktionen entstehen erst bei schwerer Sepsis', 'Nichts Besonderes – der Körper baut Erreger immer ohne Symptome ab'], correct: 0 },
    // Frage 171: Häufige Infektionsquellen
    { q: 'Was sind häufige Infektionsquellen?', a: ['Tröpfchen, Schmierinfektion, kontaminierte Flächen, Wasser', 'Nur Luft – alle Infektionskrankheiten werden ausschließlich über die Atemluft übertragen', 'Nur Wasser – Erreger können ausschließlich über flüssige Medien übertragen werden', 'Nur Essen – Krankheitserreger gelangen ausschließlich über kontaminierte Lebensmittel in den Körper'], correct: 0 },
    // Frage 172: Gesundheitsspezifische Begriffe Bäderbereich
    { q: 'Was versteht man unter Desinfektion?', a: ['Abtötung/Inaktivierung von Krankheitserregern', 'Reinigung mit Wasser und Reinigungsmittel – sichtbarer Schmutz wird entfernt', 'Nur mechanisches Reinigen – Wischen und Schrubben zur Entfernung von Keimen', 'Lüften – Frischluft verdünnt und entfernt Krankheitserreger in der Luft'], correct: 0 },
    { q: 'Was ist Hygiene?', a: ['Maßnahmen zur Verhütung von Krankheiten und Erhaltung der Gesundheit', 'Nur Händewaschen – alle anderen Maßnahmen fallen nicht unter Hygiene', 'Nur Duschen vor dem Schwimmen – persönliche Körperpflege allein', 'Nur Putzen und Reinigen von Flächen – Personalhygiene gehört nicht dazu'], correct: 0 },
    // Frage 173: Begriffe bakterizid, fungizid, viruzid, sporizid
    { q: 'Was bedeutet bakterizid?', a: ['Bakterien abtötend', 'Pilze abtötend', 'Viren abtötend', 'Sporen abtötend'], correct: 0 },
    { q: 'Was bedeutet fungizid?', a: ['Pilze abtötend', 'Bakterien abtötend', 'Viren abtötend', 'Sporen abtötend'], correct: 0 },
    { q: 'Was bedeutet viruzid?', a: ['Viren abtötend/inaktivierend', 'Bakterien abtötend – das Präfix "viru-" bezieht sich auf virulente Bakterien', 'Pilze abtötend – Viren und Pilze werden unter diesem Begriff zusammengefasst', 'Sporen abtötend – virale Sporen werden durch viruzide Mittel vernichtet'], correct: 0 },
    { q: 'Was bedeutet sporizid?', a: ['Sporen abtötend', 'Viren abtötend', 'Bakterien abtötend', 'Pilze abtötend'], correct: 0 },
    // Frage 174: Gemeinsamkeiten Bakterien und Viren
    { q: 'Was haben Bakterien und Viren gemeinsam?', a: ['Beide können Infektionskrankheiten verursachen', 'Beide haben Zellkern durch den Betreiber', 'Beide vermehren sich gleich bei vorschriftsmäßigem Betrieb', 'Beide sind gleich groß in regelmäßigen Abständen'], correct: 0 },
    // Frage 175: Unterschiede Viren von anderen Mikroorganismen
    { q: 'Worin unterscheiden sich Viren von Bakterien?', a: ['Viren können sich nicht selbstständig vermehren, brauchen Wirtszelle', 'Viren sind größer – sie sind mit bloßem Auge erkennbar, Bakterien nicht', 'Viren haben eine Zellwand – Bakterien fehlt diese Schutzschicht', 'Kein Unterschied – Viren und Bakterien sind identische Krankheitserreger'], correct: 0 },
    // Frage 176: Was sind Legionellen
    { q: 'Was sind Legionellen?', a: ['Bakterien, die Legionärskrankheit (schwere Lungenentzündung) verursachen', 'Viren, die sich bevorzugt in warmem Wasser vermehren', 'Pilze, die sich in Wasserinstallationen ansiedeln und Atemwegsbeschwerden auslösen', 'Parasiten, die über kontaminiertes Trinkwasser aufgenommen werden'], correct: 0 },
    // Frage 177: Wie werden Legionellen übertragen
    { q: 'Wie werden Legionellen übertragen?', a: ['Einatmen von kontaminierten Wassertröpfchen (Aerosolen)', 'Durch Trinken von kontaminiertem Wasser – der Magen-Darm-Trakt ist die Eintrittspforte', 'Von Mensch zu Mensch – direkte Ansteckung durch Kontakt mit Erkrankten', 'Durch Essen – Legionellen können sich in kontaminierten Lebensmitteln vermehren'], correct: 0 },
    // Frage 178: Was ist Legionellenprophylaxe
    { q: 'Was versteht man unter Legionellenprophylaxe?', a: ['Maßnahmen zur Vermeidung von Legionellenvermehrung (Temperatur, Spülung)', 'Impfung aller Beschäftigten gegen Legionellen – es gibt einen zugelassenen Impfstoff', 'Antibiotika-Behandlung des Wassers – Antibiotika werden dem Wasser zugegeben', 'Nichts tun – Legionellen sind harmlos und keine Prophylaxe ist nötig'], correct: 0 },
    // Frage 179: Vorbeugende Maßnahmen Fußpilz
    { q: 'Welche vorbeugenden Maßnahmen gibt es gegen Fußpilz?', a: ['Füße trocknen, Badeschuhe tragen, Desinfektionsmatten nutzen', 'Barfuß laufen stärkt die natürliche Fußflora', 'Füße feucht lassen – Pilze brauchen Trockenheit', 'Keine Maßnahmen nötig – Fußpilz heilt von selbst'], correct: 0 },
    // Frage 180: Häufigste Ursachen Fußpilz
    { q: 'Was sind die häufigsten Ursachen für Fußpilz?', a: ['Feuchtigkeit, Barfußlaufen auf kontaminierten Flächen, enges Schuhwerk', 'Kalte Füße und Frostbeulen', 'Zu viel Laufen und Überbeanspruchung', 'Zu wenig Schwimmen und Sport'], correct: 0 },
    // Frage 181: Fußpilz (Fußmykosen) im Schwimmbad
    { q: 'Warum ist Fußpilz im Schwimmbad häufig?', a: ['Feucht-warmes Klima, Barfußlaufen, viele Menschen auf engem Raum', 'Chlor im Wasser tötet die Schutzflora der Haut ab', 'Zu kaltes Wasser schwächt das Immunsystem', 'Zu viele Badegäste erzeugen schädliche Gase'], correct: 0 },
    { q: 'Welche Anzeichen deuten auf Fußpilz hin?', a: ['Jucken, Rötung, Schuppen, Bläschen zwischen den Zehen', 'Kalte Füße und blaue Zehennägel', 'Schwellungen des gesamten Fußes', 'Keine Symptome – Fußpilz ist immer symptomfrei'], correct: 0 },
    // Frage 182: Immunsystem - Was ist das
    { q: 'Was ist das Immunsystem?', a: ['Körpereigene Abwehr gegen Krankheitserreger', 'Nur die weißen Blutkörperchen – der Rest zählt nicht', 'Nur die Haut als äußere Schutzbarriere', 'Nur Antikörper im Blutplasma'], correct: 0 },
    // Frage 183: Möglichkeiten zur Stärkung des Immunsystems
    { q: 'Wie kann man das Immunsystem stärken?', a: ['Gesunde Ernährung, ausreichend Schlaf, Bewegung, wenig Stress', 'Nur Medikamente und Nahrungsergänzungsmittel helfen wirklich', 'Viel Alkohol – er desinfiziert auch von innen', 'Wenig Schlaf – der Körper wird so abgehärtet'], correct: 0 },
    // Frage 184: Wodurch wird das Immunsystem geschwächt
    { q: 'Wodurch wird das Immunsystem geschwächt?', a: ['Stress, Schlafmangel, ungesunde Ernährung, Rauchen, Alkohol', 'Regelmäßiger Ausdauersport und Bewegung', 'Gesundes Essen und viel Obst und Gemüse', 'Ausreichend Schlaf und Erholung'], correct: 0 },
    // Frage 185: Chlorgasunfall - Rettungskette
    { q: 'Wie ist die Rettungskette bei einem Chlorgasunfall?', a: ['Selbstschutz, Bereich absperren, Notruf, Personen retten (mit Schutz), Erste Hilfe', 'Sofort in den Bereich laufen und Betroffene herausziehen', 'Nur Notruf absetzen und Bereich beobachten', 'Abwarten bis das Gas sich verflüchtigt hat'], correct: 0 },
    // Frage 186: Anzeichen nach Chlorgas-Einatmung
    { q: 'Welche Anzeichen treten nach Chlorgas-Einatmung auf?', a: ['Reizhusten, Atemnot, Augenreizung, Übelkeit, Lungenödem möglich', 'Keine Symptome – Chlorgas ist geruchlos und harmlos', 'Nur leichte Müdigkeit, die schnell vergeht', 'Nur Hunger und Schwindel nach kurzer Zeit'], correct: 0 },
    // Frage 187: Erste Hilfe bei Chlorgasvergiftung
    { q: 'Was ist bei einer Chlorgasvergiftung zu tun?', a: ['Frischluft, Oberkörper hoch lagern, Notruf, Ruhe, ggf. Sauerstoff', 'Viel trinken lassen – Flüssigkeit neutralisiert das Gas', 'Flach lagern und Beine hochhalten wie bei Schock', 'Betroffene massieren um die Durchblutung anzuregen'], correct: 0 },

    // --- HAUT UND SINNESORGANE (Fragen 188-191) ---
    // Frage 188: Aufbau und Funktionen der Haut
    { q: 'Welche Funktionen hat die Haut?', a: ['Schutz, Temperaturregulation, Sinnesorgan, Ausscheidung', 'Nur Schutzfunktion gegen mechanische Einwirkungen', 'Atmung, Verdauung und Blutbildung', 'Nur Wärmeregulation – alles andere macht die Leber'], correct: 0 },
    // Frage 189: Begriff Hautanhangsgebilde
    { q: 'Was sind Hautanhangsgebilde?', a: ['Haare, Nägel, Schweiß- und Talgdrüsen', 'Nur Haare und Nägel', 'Blutgefäße und Nerven', 'Muskeln – die gehören natürlich dazu'], correct: 0 },
    // Frage 190: Hautschichten und ihre Funktion
    { q: 'Welche Schicht der Haut enthält Blutgefäße und Nerven?', a: ['Die Lederhaut (Dermis)', 'Die Oberhaut (Epidermis)', 'Die Unterhaut', 'Keine Schicht'], correct: 0 },
    { q: 'Welche Funktion hat die Oberhaut (Epidermis)?', a: ['Schutzbarriere gegen Umwelteinflüsse', 'Wärmespeicherung durch Fettschichten', 'Blutversorgung der Haut sicherstellen', 'Fetteinlagerung und Energiespeicherung'], correct: 0 },
    // Frage 191: Sinnesrezeptoren in der Haut
    { q: 'Welche Sinnesrezeptoren gibt es in der Haut?', a: ['Druck-, Berührungs-, Temperatur- und Schmerzrezeptoren', 'Nur Schmerzrezeptoren – der Rest fehlt schlicht', 'Gar keine – Haut ist ja nur Verkleidung', 'Nur Temperaturrezeptoren in der Unterhaut'], correct: 0 },

    // --- SKELETT UND BEWEGUNGSAPPARAT (Fragen 192-206) ---
    // Frage 192: Funktionen des Skeletts
    { q: 'Welche Funktionen hat das Skelett?', a: ['Stütze, Schutz, Bewegung, Blutbildung, Mineralstoffspeicher', 'Nur Stütze und Schutz der inneren Organe', 'Nur Bewegungsermöglichung durch Gelenke', 'Nur Stütze – Blutbildung macht das Herz'], correct: 0 },
    // Frage 193: Aufbau des Skeletts
    { q: 'Aus welchen Hauptteilen besteht das Skelett?', a: ['Schädel, Wirbelsäule, Brustkorb, Becken, Gliedmaßen', 'Nur Knochen und Knorpel ohne weitere Gliederung', 'Wirbelsäule und Schädel – der Rest ist Muskel', 'Nur Schädel und Becken'], correct: 0 },
    // Frage 194: Aufbau und Funktion des Thorax
    { q: 'Was ist der Thorax (Brustkorb)?', a: ['Knöcherner Schutzraum für Herz und Lunge aus Rippen, Brustbein, Wirbelsäule', 'Nur die Rippen, das Brustbein gehört nicht dazu', 'Das Becken mit den Hüftknochen', 'Nur die Lendenwirbelsäule'], correct: 0 },
    // Frage 195: Aufbau und Funktionen des Schädels
    { q: 'Welche Funktion hat der Schädel?', a: ['Schutz des Gehirns und der Sinnesorgane', 'Nur Schutz der Sinnesorgane, nicht des Gehirns', 'Nur das Kauen durch den Unterkiefer', 'Nur Verankerung der Nackenmuskulatur'], correct: 0 },
    // Frage 196: Was sind Bandscheiben und ihre Funktion
    { q: 'Was sind Bandscheiben?', a: ['Knorpelige Puffer zwischen den Wirbeln, die Stöße abfedern', 'Kleine Knochen zwischen den Wirbeln', 'Bänder, die Wirbel miteinander verbinden', 'Muskeln entlang der Wirbelsäule'], correct: 0 },
    // Frage 197: Was ist ein Bandscheibenvorfall
    { q: 'Was ist ein Bandscheibenvorfall?', a: ['Austritt des Bandscheibenkerns, der auf Nerven drücken kann', 'Ein Knochenbruch an der Wirbelsäule', 'Entzündung des Rückenmarks', 'Verschleiß der Wirbelknochen selbst'], correct: 0 },
    // Frage 198: Bewegungsmöglichkeiten der Wirbelsäule
    { q: 'Welche Bewegungen kann die Wirbelsäule ausführen?', a: ['Beugung, Streckung, Seitneigung, Rotation', 'Nur Beugung und Streckung, keine Rotation', 'Keine Bewegung – sie ist ein starres Achsenskelett', 'Nur Rotation, alle anderen Bewegungen sind blockiert'], correct: 0 },
    { q: 'Welche Muskeln sind an der Bewegung der Wirbelsäule beteiligt?', a: ['Rückenstrecker, Bauchmuskeln, seitliche Rumpfmuskeln', 'Nur die tiefen Rückenmuskeln', 'Nur die Bauchmuskeln', 'Armmuskeln – die heben ja den Rücken an'], correct: 0 },
    // Frage 199: Skelett federt Stöße beim Laufen ab
    { q: 'Wie federt das Skelett Stöße beim Laufen ab?', a: ['Durch Gewölbe des Fußes, Gelenke und Krümmungen der Wirbelsäule', 'Gar nicht – Knochen sind starr', 'Nur durch den Knorpel der Kniegelenke', 'Nur durch Muskeln, Knochen selbst federn nicht'], correct: 0 },
    // Frage 200: Gelenktypen
    { q: 'Welche Gelenktypen gibt es?', a: ['Kugelgelenk, Scharniergelenk, Sattelgelenk, Drehgelenk', 'Nur Kugelgelenk und Scharniergelenk', 'Nur ein Gelenktyp – alle Gelenke funktionieren gleich', 'Nur starre Verbindungen ohne Beweglichkeit'], correct: 0 },
    { q: 'Was ist ein Beispiel für ein Kugelgelenk?', a: ['Schultergelenk, Hüftgelenk', 'Kniegelenk (Scharniergelenk)', 'Ellbogengelenk (Scharniergelenk)', 'Sprunggelenk'], correct: 0 },
    // Frage 201: Gelenke beim Brustschwimmen
    { q: 'Welche Gelenke werden beim Brustschwimmen extrem belastet?', a: ['Kniegelenk und Hüftgelenk (durch Grätschbewegung)', 'Nur das Schultergelenk durch den Armzug', 'Nur Fingergelenke und Handgelenke', 'Keine Gelenke – Schwimmen ist ja gelenkschonend'], correct: 0 },
    // Frage 202: Antagonisten bei Muskeln
    { q: 'Was versteht man unter Antagonisten bei Muskeln?', a: ['Gegenspieler, die entgegengesetzte Bewegungen ausführen (z.B. Bizeps-Trizeps)', 'Muskeln, die dieselbe Bewegung gemeinsam ausführen (Synergisten)', 'Helfer, die Gleichgewicht und Stabilität sichern', 'Ruhende Muskeln – Antagonisten schlafen einfach'], correct: 0 },
    // Frage 203: Unterschied Bänder und Sehnen
    { q: 'Was ist der Unterschied zwischen Bändern und Sehnen?', a: ['Bänder verbinden Knochen; Sehnen verbinden Muskeln mit Knochen', 'Kein Unterschied – beides sind Bindegewebsstrukturen', 'Sehnen verbinden Knochen miteinander', 'Bänder verbinden Muskeln mit der Haut'], correct: 0 },
    // Frage 204: Belastung der Menisken
    { q: 'Bei welcher Schwimmtechnik ist die Belastung der Menisken besonders groß?', a: ['Brustschwimmen (durch Drehbewegung im Knie)', 'Kraulschwimmen durch den Beinschlag', 'Rückenschwimmen durch die Armrotation', 'Delphinschwimmen durch die Wellenbewegung'], correct: 0 },
    // Frage 205: Knochen beweglich verbunden
    { q: 'Wie sind Knochen beweglich miteinander verbunden?', a: ['Durch Gelenke', 'Durch Muskeln', 'Durch Haut', 'Gar nicht'], correct: 0 },
    // Frage 206: Gefahren einseitiges Muskelgruppentraining
    { q: 'Welche Gefahren bestehen durch einseitiges Muskelgruppentraining?', a: ['Muskuläre Dysbalancen, Fehlhaltungen, erhöhte Verletzungsgefahr', 'Keine Gefahren – einseitiges Training ist optimal', 'Nur ästhetische Unausgewogenheit, medizinisch unbedenklich', 'Zu viel Kraft auf einer Seite – alles andere passt sich an'], correct: 0 },

    // --- MUSKULATUR (Fragen 207-210) ---
    // Frage 207: Unterschied glatte und quer gestreifte Muskulatur
    { q: 'Was ist der Unterschied zwischen glatter und quer gestreifter Muskulatur?', a: ['Glatt = unwillkürlich (Organe); Quer gestreift = willkürlich (Skelettmuskeln)', 'Kein Unterschied – beide reagieren gleich auf Nervensignale', 'Glatte Muskulatur ist stärker als quer gestreifte', 'Quer gestreifte Muskulatur steuert nur die Augen'], correct: 0 },
    // Frage 208: Funktion des Herzens im Blutkreislauf
    { q: 'Wozu dient das Herz im Blutkreislauf?', a: ['Als Pumpe, die Blut durch den Körper transportiert', 'Zur Blutreinigung und Entgiftung', 'Zur Sauerstoffproduktion aus der Einatemluft', 'Zur Verdauung von Fetten'], correct: 0 },
    // Frage 209: Arbeitsweise des Herzens
    { q: 'Wie arbeitet das Herz?', a: ['Rhythmisches Zusammenziehen (Systole) und Entspannen (Diastole)', 'Dauerhaft angespannt ohne Pause', 'Nur bei körperlicher Belastung aktiv, sonst pausiert es', 'Unregelmäßig – Rhythmus ist von Hormonen unabhängig'], correct: 0 },
    // Frage 210: Diastolischer und systolischer Blutdruck
    { q: 'Was ist der diastolische Blutdruck?', a: ['Der untere Wert - Druck in den Gefäßen bei Herzentspannung', 'Der obere Wert bei der Herzkontraktion', 'Der Durchschnittswert aus Systole und Diastole', 'Der Puls in Schlägen pro Minute'], correct: 0 },
    { q: 'Was ist der systolische Blutdruck?', a: ['Der obere Wert - Druck bei Herzkontraktion', 'Der untere Wert bei Herzentspannung', 'Der Durchschnitt aus Herzfrequenz und Atemfrequenz', 'Der Puls in Schlägen pro Minute'], correct: 0 },

    // --- HERZ-KREISLAUF-SYSTEM (Fragen 211-232) ---
    // Frage 211: Herz schlägt schneller bei psychischer Erregung
    { q: 'Warum schlägt das Herz bei psychischer Erregung schneller?', a: ['Adrenalin wird ausgeschüttet und erhöht Herzfrequenz und Blutdruck', 'Weil das Herz müde wird und Erholung sucht', 'Durch Kälte – Erregung kühlt den Körper ab', 'Ohne besonderen Grund, es ist purer Zufall'], correct: 0 },
    // Frage 212-216: Blutkreislauf
    { q: 'Welche Funktionen hat der Blutkreislauf?', a: ['Transport von O2, CO2, Nährstoffen, Hormonen, Wärme', 'Nur Sauerstofftransport zu den Muskeln', 'Nur Wärmetransport zur Regulation der Körpertemperatur', 'Nur Transport von Hormonen – der Rest macht die Lymphe'], correct: 0 },
    // Frage 217: Kleiner und großer Blutkreislauf
    { q: 'Was beschreibt der kleine Blutkreislauf?', a: ['Lungenkreislauf: Herz → Lunge → Herz (Gasaustausch)', 'Den Kreislauf in den kleinen Kapillaren der Beine', 'Den Kreislauf nur im Kopf und Gehirn', 'Den gesamten Körperkreislauf – "klein" ist irreführend'], correct: 0 },
    { q: 'Was beschreibt der große Blutkreislauf?', a: ['Körperkreislauf: Herz → Körper → Herz (Versorgung der Organe)', 'Nur die Lungenversorgung über Lungenarterien', 'Nur die Versorgung des Gehirns', 'Nur den Blutfluss in den großen Schlagadern'], correct: 0 },
    // Frage 218: Körperkreislauf und Lungenkreislauf
    { q: 'Was versteht man unter dem Körperkreislauf?', a: ['Transport von sauerstoffreichem Blut vom Herzen zu den Organen und zurück', 'Nur der Lungenkreislauf zum Gasaustausch', 'Nur die Versorgung des Gehirns über Halsschlagadern', 'Nur der Blutfluss in den Beinen'], correct: 0 },
    // Frage 219: Drei Blutgefäße des Menschen
    { q: 'Welche drei Arten von Blutgefäßen gibt es?', a: ['Arterien, Venen, Kapillaren', 'Nur Arterien und Venen, Kapillaren sind keine Blutgefäße', 'Arterien, Lymphgefäße, Kapillaren', 'Nur Venen – alle anderen sind Lymphgefäße'], correct: 0 },
    // Frage 220: Kleiner Blutkreislauf
    { q: 'Aus welchen Bauteilen besteht der kleine Blutkreislauf?', a: ['Rechte Herzhälfte, Lungenarterien, Lungenkapillaren, Lungenvenen, linker Vorhof', 'Nur Herz und Aorta', 'Nur die Lunge und deren Kapillaren', 'Nur Arterien – Venen gehören nicht dazu'], correct: 0 },
    // Frage 221: Großer Blutkreislauf
    { q: 'Aus welchen Bauteilen besteht der große Blutkreislauf?', a: ['Linke Herzhälfte, Aorta, Arterien, Kapillaren, Venen, rechter Vorhof', 'Nur Venen und rechtes Herz', 'Nur Arterien und linkes Herz', 'Nur Kapillaren in den Organen'], correct: 0 },
    // Frage 222: Was ist eine Arterie
    { q: 'Was ist eine Arterie?', a: ['Blutgefäß, das Blut vom Herzen wegführt', 'Blutgefäß, das Blut zum Herzen transportiert (das ist die Vene)', 'Kleinstes Blutgefäß für den Stoffaustausch (das ist die Kapillare)', 'Nur sauerstoffreiches Blut – Lungenarterie führt auch sauerstoffarmes'], correct: 0 },
    // Frage 223: Was ist eine Vene
    { q: 'Was ist eine Vene?', a: ['Blutgefäß, das Blut zum Herzen transportiert', 'Blutgefäß, das Blut vom Herzen wegführt (das ist die Arterie)', 'Kleinstes Blutgefäß für den Gewebeaustausch (das ist die Kapillare)', 'Nur in den Armen und Beinen vorhanden'], correct: 0 },
    // Frage 224: Erkennen einer Arterienverletzung
    { q: 'Woran erkennt man eine Arterienverletzung?', a: ['Hellrotes, pulsierend spritzendes Blut', 'Dunkelrotes, gleichmäßig sickerndes Blut (das ist eine Venenverletzung)', 'Farbloses Blut ohne Geruch', 'Blaues Blut – Arterien führen doch sauerstoffarmes Blut'], correct: 0 },
    // Frage 225: Maßnahmen bei Schlagaderverletzung am Arm
    { q: 'Welche Maßnahmen ergreift man bei einer Schlagaderverletzung am Arm?', a: ['Druckverband, Arm hoch, ggf. Abdrücken der Arterie, Notruf', 'Nichts tun – arterielle Blutungen stillen sich von selbst', 'Wunde kühlen mit Eis und abwarten', 'Wärmen – Wärme fördert die Blutgerinnung'], correct: 0 },
    // Frage 226: Was ist eine Kapillare
    { q: 'Was ist eine Kapillare?', a: ['Kleinstes Blutgefäß für Stoffaustausch zwischen Blut und Gewebe', 'Eine große Schlagader wie die Aorta', 'Eine große Vene wie die Hohlvene', 'Ein Lymphgefäß im Unterhautfettgewebe'], correct: 0 },
    // Frage 227: Einrichtung Venen - Blutfließrichtung
    { q: 'Welche Einrichtung haben Venen, um die Blutfließrichtung festzulegen?', a: ['Venenklappen, die Rückfluss verhindern', 'Keine besondere Einrichtung, das Herz saugt alles rein', 'Muskeln in der Venenwand, die aktiv pumpen', 'Nerven, die den Blutfluss elektronisch steuern'], correct: 0 },
    // Frage 228: Taschenklappen im Kreislaufsystem
    { q: 'Wo existieren im Kreislaufsystem Taschenklappen?', a: ['Am Herz (Aorten- und Pulmonalklappe) und in den Venen', 'Nur in Arterien, um Rückfluss zu verhindern', 'Nirgends – Herzklappen sind alle Segelklappen', 'Nur im Gehirn zur Druckregulation'], correct: 0 },
    // Frage 229: Segelklappen im Kreislaufsystem
    { q: 'Wo sind im Herz Segelklappen zu finden?', a: ['Zwischen Vorhöfen und Kammern (Mitral- und Trikuspidalklappe)', 'Am Herzausgang zur Aorta (das sind Taschenklappen)', 'In den großen Venen vor dem Herzeingang', 'In den Herzkranzgefäßen'], correct: 0 },
    // Frage 230: Blutkörperchen und Funktionen
    { q: 'Welche Funktion haben rote Blutkörperchen (Erythrozyten)?', a: ['Sauerstofftransport durch Hämoglobin', 'Immunabwehr gegen Krankheitserreger (das machen Leukozyten)', 'Blutgerinnung bei Verletzungen (das machen Thrombozyten)', 'Nährstofftransport im Blutplasma'], correct: 0 },
    { q: 'Welche Funktion haben weiße Blutkörperchen (Leukozyten)?', a: ['Immunabwehr gegen Krankheitserreger', 'Sauerstofftransport durch Hämoglobin (das machen Erythrozyten)', 'Blutgerinnung bei Verletzungen (das machen Thrombozyten)', 'Nährstofftransport im Blutplasma'], correct: 0 },
    { q: 'Welche Funktion haben Blutplättchen (Thrombozyten)?', a: ['Blutgerinnung bei Verletzungen', 'Sauerstofftransport durch Hämoglobin (das machen Erythrozyten)', 'Immunabwehr gegen Bakterien und Viren (das machen Leukozyten)', 'Hormontransport im Blutplasma'], correct: 0 },
    // Frage 231: Funktion der Herzkranzgefäße
    { q: 'Wozu dienen die Herzkranzgefäße?', a: ['Versorgung des Herzmuskels selbst mit Sauerstoff und Nährstoffen', 'Versorgung der Lungenalveolen mit sauerstoffarmem Blut', 'Versorgung des Gehirns über den Hals', 'Bluttransport in die Beine über die Aorta'], correct: 0 },
    // Frage 232: Sauerstoffversorgung des Herzmuskels
    { q: 'Wodurch erfolgt die Sauerstoffversorgung des Herzmuskels?', a: ['Durch die Koronararterien (Herzkranzgefäße)', 'Durch das sauerstoffreiche Blut direkt in den Herzkammern', 'Durch direkte Diffusion aus der Lungenarterie', 'Durch die Luft, die beim Atmen das Herz umspült'], correct: 0 },

    // --- ATMUNGSSYSTEM (Fragen 233-260) ---
    // Frage 233: Was passiert wenn der Sinusknoten ausfällt
    { q: 'Was passiert, wenn der Sinusknoten ausfällt?', a: ['AV-Knoten übernimmt als Ersatz-Schrittmacher mit niedrigerer Frequenz', 'Sofortiger Herzstillstand ohne jede Alternative', 'Nichts – das Herz funktioniert auch ohne Sinusknoten normal', 'Das Herz schlägt schneller, weil der Bremseffekt fehlt'], correct: 0 },
    // Frage 234: Behandlung Schlagaderverletzungen
    { q: 'Wie behandelt man Verletzungen von Schlagadern an Gliedmaßen?', a: ['Druckverband, Hochlagern, Abdrücken proximal der Wunde, Notruf', 'Nur kühlen und abwarten bis die Blutung stoppt', 'Nichts tun – arterielle Blutungen stillen sich von selbst', 'Nur Pflaster – das reicht bei jeder Verletzung'], correct: 0 },
    // Frage 235: Wichtigste Anzeichen Schock
    { q: 'Was sind die wichtigsten Anzeichen eines Schocks?', a: ['Blässe, kalter Schweiß, schneller flacher Puls, Unruhe, Bewusstseinstrübung', 'Rotes Gesicht und erhöhte Körpertemperatur', 'Langsamer Puls und tiefer ruhiger Atem', 'Warme Haut und rosige Wangen'], correct: 0 },
    // Frage 236: Was ist ein Schlaganfall
    { q: 'Was ist ein Schlaganfall?', a: ['Durchblutungsstörung oder Blutung im Gehirn mit neurologischen Ausfällen', 'Ein Herzinfarkt – beides ist letztlich dasselbe', 'Eine kurze Ohnmacht ohne bleibende Schäden', 'Starke Kopfschmerzen durch Muskelverspannungen'], correct: 0 },
    { q: 'Was sind mögliche Ursachen eines Schlaganfalls?', a: ['Hirninfarkt (Gefäßverschluss) oder Hirnblutung', 'Nur chronischer Stress und Schlafmangel', 'Nur akute Erschöpfung nach körperlicher Arbeit', 'Nur Kopfschmerzen durch Migräne'], correct: 0 },
    { q: 'Was sind Symptome eines Schlaganfalls?', a: ['Halbseitenlähmung, Sprachstörungen, Gesichtslähmung, Sehstörungen', 'Nur Kopfschmerzen und Fieber', 'Nur Müdigkeit und allgemeines Unwohlsein', 'Keine sichtbaren Symptome – Schlaganfall ist immer stumm'], correct: 0 },
    { q: 'Welche Sofortmaßnahmen ergreift man bei Schlaganfall?', a: ['Notruf 112, Oberkörper erhöht lagern, beruhigen, Vitalzeichen überwachen', 'Schlafen lassen – Ruhe ist die beste Medizin', 'Viel trinken geben – Flüssigkeit hilft immer', 'Intensiv massieren um die Durchblutung anzuregen'], correct: 0 },
    // Frage 237: Drei Organe des Lymphsystems
    { q: 'Welche Organe gehören zum Lymphsystem?', a: ['Lymphknoten, Milz, Thymus', 'Nur Milz und Leber', 'Nur Lunge und Bronchien', 'Nur Nieren und Nebennieren'], correct: 0 },
    // Frage 238: Aufgaben von Lymphknoten
    { q: 'Welche Aufgaben haben Lymphknoten?', a: ['Filtern der Lymphe, Immunabwehr, Bildung von Lymphozyten', 'Blut pumpen wie eine Art Hilfspumpe', 'Verdauungsenzyme produzieren', 'Sauerstoff aus der Atemluft aufnehmen'], correct: 0 },
    // Frage 239: Wodurch kann Atemfunktion gestört sein
    { q: 'Wodurch kann die Atemfunktion gestört sein?', a: ['Verlegung der Atemwege, Lungenerkrankungen, Thoraxverletzungen, Vergiftung', 'Nur durch Erkältung – mehr Optionen gibt es nicht', 'Gar nicht, die Atmung funktioniert immer problemlos', 'Nur durch schlechtes Wetter'], correct: 0 },
    // Frage 240: Innere und äußere Atmung
    { q: 'Was unterscheidet innere von äußerer Atmung?', a: ['Äußere = Gasaustausch Lunge; Innere = Zellatmung', 'Kein Unterschied – beides bezeichnet dasselbe', 'Innere = Einatmen, äußere = Ausatmen', 'Äußere findet im Darm statt'], correct: 0 },
    // Frage 241: Obere und untere Atemwege
    { q: 'Was gehört zu den oberen Atemwegen?', a: ['Nase, Nasennebenhöhlen, Rachen, Kehlkopf', 'Nur Lunge und Bronchien', 'Nur Luftröhre und Bronchiolen', 'Nur Zunge und Speiseröhre'], correct: 0 },
    { q: 'Was gehört zu den unteren Atemwegen?', a: ['Luftröhre, Bronchien, Bronchiolen, Lungenbläschen', 'Nase, Rachen und Kehlkopf', 'Nur Nasennebenhöhlen und Rachen', 'Speiseröhre und Magen'], correct: 0 },
    // Frage 242: Was versteht man unter Brustatmung
    { q: 'Was versteht man unter Brustatmung?', a: ['Erweiterung des Brustkorbs durch Zwischenrippenmuskeln', 'Einatmen ausschließlich durch den Mund', 'Nur Ausatmen ohne Einatmung', 'Zwerchfellatmung mit gesenktem Bauch'], correct: 0 },
    // Frage 243: Was ist ein Stimmritzenkrampf
    { q: 'Was ist ein Stimmritzenkrampf?', a: ['Krampfhafter Verschluss der Stimmritze, der Atmen verhindert', 'Heiserkeit durch Überanstrengung der Stimmbänder', 'Husten durch gereizte Bronchialschleimhaut', 'Unwillkürliche Bewegung der Atemhilfsmuskulatur'], correct: 0 },
    // Frage 244: Vorgang der Zwerchfellatmung
    { q: 'Wie funktioniert die Zwerchfellatmung (Bauchatmung)?', a: ['Zwerchfell kontrahiert und senkt sich → Lunge dehnt sich → Einatmung', 'Zwerchfell hebt sich → Lunge weitet sich → Einatmung', 'Rippen spreizen sich nach außen, Zwerchfell bleibt passiv', 'Zwerchfell und Rippen bewegen sich gleichzeitig nach oben'], correct: 0 },
    // Frage 245: Inspiration und Exspiration
    { q: 'Was versteht man unter Inspiration?', a: ['Einatmung', 'Ausatmung', 'Atemanhalten', 'Husten'], correct: 0 },
    { q: 'Was versteht man unter Exspiration?', a: ['Ausatmung', 'Einatmung', 'Atemanhalten', 'Niesen'], correct: 0 },
    // Frage 246: Atemfrequenz und Vitalkapazität
    { q: 'Was ist die normale Atemfrequenz beim Erwachsenen?', a: ['12-20 Atemzüge pro Minute', '5-8 pro Minute', '30-40 pro Minute', '50-60 pro Minute'], correct: 0 },
    { q: 'Was ist die Vitalkapazität?', a: ['Maximales Luftvolumen, das nach maximaler Einatmung ausgeatmet werden kann', 'Normales Atemvolumen bei ruhiger Atmung (ca. 500 ml)', 'Luftvolumen, das nach normaler Ausatmung noch in der Lunge verbleibt', 'Gesamtlungenkapazität einschließlich Residualvolumen'], correct: 0 },
    // Frage 247: Atemzugvolumen und Vitalkapazität
    { q: 'Was ist das normale Atemzugvolumen beim Erwachsenen?', a: ['Ca. 500 ml', 'Ca. 100 ml', 'Ca. 2000 ml', 'Ca. 5000 ml'], correct: 0 },
    // Frage 248: Totraum bei der Atmung
    { q: 'Was versteht man unter dem Totraum bei der Atmung?', a: ['Luftvolumen in den Atemwegen ohne Gasaustausch (ca. 150 ml)', 'Die Restluft in den Alveolen nach maximaler Ausatmung', 'Das Lungenvolumen bei ruhiger Einatmung', 'Die Gesamtkapazität beider Lungenflügel'], correct: 0 },
    // Frage 249: Auswirkungen der Pressatmung
    { q: 'Welche Auswirkungen hat die Pressatmung?', a: ['Blutdruckanstieg, Rückstau in Venen, mögliche Ohnmacht', 'Keine Auswirkungen – Pressatmung ist völlig harmlos', 'Blutdruckabfall und verbesserte Sauerstoffversorgung', 'Erhöhte Lungenkapazität und bessere Ausdauer'], correct: 0 },
    // Frage 250: Ursachen und Auswirkungen Hyperventilation
    { q: 'Was ist Hyperventilation?', a: ['Übermäßig schnelle und tiefe Atmung mit CO2-Abfall', 'Zu langsame und flache Atmung (Hypoventilation)', 'Normales, gleichmäßiges Ruheatmen', 'Bewusstes Atemanhalten über längere Zeit'], correct: 0 },
    { q: 'Was sind Auswirkungen der Hyperventilation?', a: ['Kribbeln, Schwindel, Muskelkrämpfe, Ohnmacht möglich', 'Mehr Energie und Leistungssteigerung', 'Bessere Konzentration und Reaktionsfähigkeit', 'Erhöhter CO2-Gehalt im Blut'], correct: 0 },
    // Frage 251: Warum ist Hyperventilation vor Tauchgang gefährlich
    { q: 'Warum ist Hyperventilation vor einem Tauchgang gefährlich?', a: ['CO2-Mangel verzögert Atemreflex → Bewusstlosigkeit unter Wasser möglich', 'Mehr Luft bedeutet längere Tauchzeit – also ein Vorteil', 'Der CO2-Anstieg beim Tauchen wird schneller bemerkt', 'Keine Gefahr, Hyperventilation ist vor dem Tauchen sogar empfohlen'], correct: 0 },
    // Frage 252: Warum sind überlange Schnorchel verboten
    { q: 'Warum sind überlange Schnorchel (>35 cm) verboten?', a: ['Zu viel Totraum → Rückatmung von CO2 → Vergiftungsgefahr', 'Sehen schlecht aus – ästhetische Badegastregel', 'Zu schwer und daher schlechter zu handhaben', 'Kein Grund – lange Schnorchel erlauben tieferes Tauchen'], correct: 0 },
    // Frage 253: Welches Gewebe kleidet Luftröhre und Bronchien aus
    { q: 'Welches Gewebe kleidet Luftröhre und Bronchien aus?', a: ['Flimmerepithel mit Schleimschicht', 'Plattenepithel wie in der Mundhöhle', 'Glatte Muskelgewebe ohne Schleimschicht', 'Bindegewebe mit Knorpeleinlagerungen'], correct: 0 },
    // Frage 254: Funktion des Flimmerepithels in Bronchien
    { q: 'Welche Funktion hat das Flimmerepithel in den Bronchien?', a: ['Transport von Schleim und Fremdpartikeln nach oben', 'Gasaustausch zwischen Luft und Blut', 'Produktion von Surfactant zur Lungenöffnung', 'Steuerung der Bronchialweite durch Kontraktion'], correct: 0 },
    // Frage 255: Was passiert wenn Flimmerepithel beschädigt
    { q: 'Was passiert, wenn das Flimmerepithel in den Bronchien oder der Luftröhre beschädigt ist?', a: ['Selbstreinigung gestört → erhöhte Infektanfälligkeit', 'Bessere Durchblutung der Bronchialschleimhaut', 'Gar nichts – Flimmerepithel hat keine wichtige Funktion', 'Mehr Sauerstoff gelangt in die Alveolen'], correct: 0 },
    // Frage 256: Wo sitzt das Atemzentrum
    { q: 'Wo sitzt das Atemzentrum und welche Aufgaben hat es?', a: ['Im Hirnstamm (verlängertes Mark) - steuert Atemrhythmus automatisch', 'Im Kleinhirn – steuert Gleichgewicht und Koordination', 'In der Großhirnrinde – bewusste Steuerung aller Körperfunktionen', 'Im Hypothalamus – reguliert Körpertemperatur und Hunger'], correct: 0 },
    // Frage 257: Blutgase beeinflussen Atemzentrum
    { q: 'Welche Blutgase beeinflussen die Tätigkeit des Atemzentrums?', a: ['CO2 (Kohlendioxid) und O2 (Sauerstoff)', 'Nur Stickstoff (N2) als Hauptbestandteil der Luft', 'Nur Helium – wegen der Stimme beim Tauchen', 'Kein Gas – das Atemzentrum reagiert nur auf Nervenimpulse'], correct: 0 },
    // Frage 258: Maßnahmen Kind Luftwege durch Fremdkörper blockiert
    { q: 'Welche Maßnahmen ergreifen Sie, wenn bei einem Kind die Luftwege durch Fremdkörper blockiert sind (Kind bei Bewusstsein)?', a: ['Rückenschläge, Heimlich-Handgriff (bei älteren Kindern), Notruf', 'Kind hinlegen und auf Besserung warten', 'Kind kräftig schütteln und zum Husten animieren', 'Wasser trinken lassen, um den Fremdkörper hinunterzuspülen'], correct: 0 },
    // Frage 259: Anteil CO2 in normaler Umgebungsluft
    { q: 'Wie hoch ist der Anteil an Kohlendioxid in der normalen Umgebungsluft?', a: ['Ca. 0,04%', 'Ca. 21%', 'Ca. 78%', 'Ca. 10%'], correct: 0 },
    // Frage 260: Prozentuale Anteile der Atemgase
    { q: 'Wie hoch sind die prozentualen Anteile der Atemgase in der normalen Umgebungsluft?', a: ['Ca. 78% Stickstoff, 21% Sauerstoff, 0,04% CO2', '50% Sauerstoff, 50% Stickstoff, kein CO2', '100% Sauerstoff – alles andere wäre gefährlich', '21% Stickstoff, 78% Sauerstoff, 1% CO2'], correct: 0 },
    { q: 'Wie verändert sich die Zusammensetzung in der Ausatemluft?', a: ['O2 sinkt auf ca. 16%, CO2 steigt auf ca. 4%', 'Bleibt identisch mit der Einatemluft', 'O2 steigt auf 30%, CO2 verschwindet', 'Nur Stickstoff bleibt übrig'], correct: 0 },

    // --- NERVENSYSTEM (Fragen 261-262) ---
    // Frage 261: Zentrales und peripheres Nervensystem
    { q: 'Was unterscheidet das zentrale vom peripheren Nervensystem?', a: ['ZNS = Gehirn + Rückenmark; PNS = Nerven im restlichen Körper', 'Kein Unterschied – beide Begriffe bezeichnen dasselbe', 'PNS = Gehirn + Rückenmark; ZNS = Nerven im Körper', 'ZNS ist zuständig für Bewegung, PNS für Denken'], correct: 0 },
    // Frage 262: Willkürliches und unwillkürliches Nervensystem
    { q: 'Was unterscheidet das willkürliche vom unwillkürlichen Nervensystem?', a: ['Willkürlich = bewusst steuerbar (Bewegung); Unwillkürlich = automatisch (Herzschlag, Verdauung)', 'Kein Unterschied – beide Systeme steuern bewusste Bewegungen', 'Beide sind vollständig automatisch und nicht beeinflussbar', 'Willkürlich steuert Organe, unwillkürlich steuert Muskeln'], correct: 0 },

    // --- GEHÖR UND GLEICHGEWICHT (Fragen 263-267) ---
    // Frage 263: Abschnitte des Gehörgangs
    { q: 'Welche Abschnitte hat das Gehör?', a: ['Außenohr, Mittelohr, Innenohr', 'Nur Ohrmuschel und Gehörgang', 'Trommelfell, Gehörknöchelchen und Eustachische Röhre', 'Nur Schnecke und Gleichgewichtsorgan'], correct: 0 },
    // Frage 264: Aufgaben des Trommelfells
    { q: 'Welche Aufgaben hat das Trommelfell?', a: ['Schallübertragung auf die Gehörknöchelchen', 'Druckausgleich zwischen Mittelohr und Außenwelt', 'Gleichgewichtsempfindungen an das Gehirn weiterleiten', 'Schutz des Innenohrs vor zu lauten Geräuschen'], correct: 0 },
    // Frage 265: Warum Schläge auf wassergefüllte Ohren gefährlich
    { q: 'Warum sind Schläge auf das wassergefüllte Ohr gefährlich?', a: ['Druckwelle kann Trommelfell zum Platzen bringen', 'Wasser läuft ins Innenohr und beschädigt die Schnecke', 'Keine Gefahr – Wasser schützt das Trommelfell', 'Besser Hören durch den Wasserdruck'], correct: 0 },
    // Frage 266: Druckausgleich im Mittelohr
    { q: 'Welches Organ dient dem Druckausgleich des Mittelohrs?', a: ['Eustachische Röhre (Ohrtrompete)', 'Trommelfell durch seine Elastizität', 'Gehörknöchelchen durch Dämpfungsreaktion', 'Innenohr über die Lymphflüssigkeit'], correct: 0 },
    { q: 'Wie kann man einen Druckausgleich durchführen?', a: ['Nase zuhalten und gegen geschlossene Nase ausatmen (Valsalva)', 'Laut schreien, um den Druck abzubauen', 'Kopf schütteln und seitlich neigen', 'Gar nicht – Druckausgleich passiert immer automatisch'], correct: 0 },
    // Frage 267: Warum nicht bei Erkältung tauchen
    { q: 'Warum darf man bei einer Erkältungskrankheit nicht tauchen?', a: ['Druckausgleich gestört durch geschwollene Schleimhäute → Barotrauma-Gefahr', 'Kaltes Wasser verschlimmert die Erkältung durch Unterkühlung', 'Zu anstrengend und erhöhte Herzbelastung beim Tauchen', 'Keine Gefahr – Tauchen kann sogar die Nasennebenhöhlen reinigen'], correct: 0 },

    // --- HORMONE UND STOFFWECHSEL (Fragen 268-272) ---
    // Frage 268: Hormone Insulin und Adrenalin
    { q: 'Welche Rolle spielt Insulin im Stoffhaushalt?', a: ['Senkt Blutzuckerspiegel, ermöglicht Glukoseaufnahme in Zellen', 'Erhöht Blutzucker durch Freisetzung von Glykogen', 'Reguliert den Kalziumspiegel im Blut', 'Steuert die Herzfrequenz bei körperlicher Belastung'], correct: 0 },
    { q: 'Welche Rolle spielt Adrenalin im Stoffhaushalt?', a: ['Stresshormon: erhöht Herzfrequenz, Blutdruck, Blutzucker', 'Senkt Herzfrequenz und Blutdruck in Ruhephasen', 'Regt die Verdauung an und entspannt die Muskulatur', 'Fördert Wachstum und Zellneubildung im Schlaf'], correct: 0 },
    // Frage 269: Funktion des Hormonsystems
    { q: 'Was ist die Funktion des Hormonsystems?', a: ['Steuerung von Stoffwechsel, Wachstum, Fortpflanzung durch chemische Botenstoffe', 'Nur Verdauung durch Enzyme im Magen-Darm-Trakt', 'Nur Bewegungssteuerung über motorische Nerven', 'Nur Atemregulation durch das verlängerte Mark'], correct: 0 },
    // Frage 270: Enzyme bei der Verdauung
    { q: 'Welche Enzyme spielen im Mund bei der Verdauung eine Rolle?', a: ['Amylase (Speichel) - spaltet Stärke', 'Pepsin – spaltet Eiweiße im sauren Milieu', 'Lipase – spaltet Fette in Fettsäuren', 'Trypsin – Bauchspeicheldrüsenenzym für Proteine'], correct: 0 },
    { q: 'Welche Enzyme spielen im Magen bei der Verdauung eine Rolle?', a: ['Pepsin - spaltet Eiweiße', 'Amylase – spaltet Stärke zu Maltose', 'Maltase – spaltet Maltose zu Glukose', 'Laktase – spaltet Milchzucker'], correct: 0 },
    { q: 'Welche Enzyme sind im Darmsaft?', a: ['Maltase, Laktase, Peptidase - Endspaltung von Nährstoffen', 'Nur Amylase für die Stärkeverdauung', 'Nur Pepsin für die Eiweißverdauung', 'Keine Enzyme – der Darmsaft hat nur Gleitfunktion'], correct: 0 },
    // Frage 271: Lebenswichtige Aufgaben des Harnapparats
    { q: 'Welche lebenswichtigen Aufgaben erfüllt der Harnapparat?', a: ['Ausscheidung von Stoffwechselendprodukten, Wasserhaushalt, Blutdruckregulation', 'Nur Wasserausscheidung – mehr macht der Harnapparat nicht', 'Verdauung und Nährstoffaufnahme aus dem Darm', 'Blutbildung und Sauerstoffversorgung der Organe'], correct: 0 },
    // Frage 272: Aufgaben der Niere
    { q: 'Welche Aufgaben erfüllt die Niere?', a: ['Blutfilterung, Urinbildung, Elektrolythaushalt, Blutdruckregulation, Hormonproduktion', 'Nur Urinbildung – alles andere übernimmt die Leber', 'Nur Blutfilterung ohne Rückresorption von Nährstoffen', 'Verdauung von Proteinen und Ausscheidung von Fetten'], correct: 0 }
];
