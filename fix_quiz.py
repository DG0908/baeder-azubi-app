#!/usr/bin/env python3
"""Fix wrong answers in quiz questions that have generic pool-operation jargon filler."""
import re

with open('src/data/quizQuestions.js', 'r', encoding='utf-8') as f:
    content = f.read()

original = content

# We'll do targeted replacements of specific wrong answer texts.
# Each replacement is (old_string, new_string).
# We only change wrong answers, never correct answers or question text.

replacements = [
    # ===== ORG SECTION =====
    # Aufsichtsperson im Bad
    ("'Einhaltung der Hygienevorschriften', 'Dokumentation im Betriebstagebuch', 'Regelmäßige Wasserproben dokumentieren'",
     "'Nur am Wochenende und feiertags', 'Nur wenn mehr als 50 Gäste da sind', 'Nur bei Schulveranstaltungen'"),

    # Schulschwimmen
    ("'Kontrolle der vorgeschriebenen Grenzwerte', 'Regelmäßige Kontrolle der Desinfektionsanlage', 'Einhaltung der vorgeschriebenen Umwälzzeiten'",
     "'Bessere Noten im Sportunterricht', 'Mehr Freizeit für die Lehrkräfte', 'Weniger Verwaltungsaufwand für Schulen'"),

    # Schwimmzeiten Schulen
    ("'Prüfung der Beckenwasserdurchströmung auf Totzonen', 'Wer zuerst kommt', 'Anpassung der Betriebsparameter bei Abweichungen'",
     "'Alphabetisch nach Schulname', 'Wer zuerst kommt', 'Schulleiter mit dem besten Kuchen'"),

    # Standortwahl
    ("'Nähe zu Flughäfen', 'Aktivkohle-Filtermedium erneuern', 'Gute Verkehrsanbindung', 'Kontrolle des Redoxpotentials'",
     "'Nähe zu Flughäfen', 'Nähe zum nächsten Biergarten', 'Gute Verkehrsanbindung', 'Anzahl der Parkbänke in der Umgebung'"),

    # Angebote Senioren
    ("'Wassergymnastik', 'Überwachung der Beckenauslastung', 'Kontrolle der Zugangsbereiche', 'Schulung der Mitarbeiter'",
     "'Wassergymnastik', 'Wildwasserrutsche mit Looping', 'Turmspringen ab 5 Meter', 'Tauchkurs für Fortgeschrittene'"),

    # Animationsplanung
    ("'Veränderung der Oberflächenspannung', 'Anlagerung von Metallionen', 'Zielgruppe und Teilnehmerzahl', 'Freisetzung von Kohlendioxid'",
     "'Sternzeichen der Teilnehmer', 'Haarfarbe der Kursleitung', 'Zielgruppe und Teilnehmerzahl', 'Lieblingsfarbe des Betreibers'"),

    # Marketing-Regelkreis
    ("'Überwachung der Filterleistung und Spülintervalle', 'Abstimmung mit dem zuständigen Gesundheitsamt', 'Regelmäßige Wartung der technischen Anlagen sicherstellen', 'Analyse - Planung - Durchführung - Kontrolle'",
     "'Nur Werbeplakate aufhängen und abwarten', 'Einmalige Preissenkung ohne Auswertung', 'Eintrittspreise nach Bauchgefühl festlegen', 'Analyse - Planung - Durchführung - Kontrolle'"),

    # Kassentagesabrechnung
    ("'Prüfung der Brandschutzeinrichtungen', 'Einweisung neuer Mitarbeiter', 'Datum und Gesamtumsatz', 'Beachtung der Arbeitszeitregelungen'",
     "'Wassertemperatur des Sportbeckens', 'Anzahl der verkauften Pommes', 'Datum und Gesamtumsatz', 'Wetterbericht des Tages'"),

    # ===== TECH SECTION - Bäderbau, Reinigung, Geräte =====
    # Polypropylen
    ("'Weil es schön aussieht nach geltender Vorschrift', 'Weil es sehr schwer ist nach technischer Regel', 'Weil es elektrisch leitend ist gemäß Prüfprotokoll'",
     "'Weil es besonders dekorativ aussieht', 'Weil es sehr schwer ist und das Gebäude stabilisiert', 'Weil es elektrisch leitfähig ist und Strom spart'"),

    # Leitern Material
    ("'Holz laut Herstellerangaben', 'Normaler Stahl gemäß Gefährdungsbeurteilung', 'Aluminium unlackiert'",
     "'Holz (quillt auf und verrottet)', 'Normaler Baustahl (rostet im Chlorwasser)', 'Aluminium unlackiert (korrodiert)'"),

    # Schutzanzüge Gummi
    ("'Weil sie billig sind im Rahmen der Eigenkontrolle', 'Aus optischen Gründen gemäß Betriebsanweisung', 'Weil sie leicht sind unter Aufsicht'",
     "'Weil sie modisch aussehen', 'Aus Tradition – schon die Römer trugen Gummi', 'Weil sie besonders gut duften'"),

    # Hochdruckreiniger
    ("'Nur Fensterputzen im Regelbetrieb im Rahmen der Betriebsführung', 'Nur Rasen mähen bei ordnungsgemäßem Betrieb', 'Nur Wäsche waschen nach Hygieneplan nach technischer Regel'",
     "'Nur Fensterputzen an der Außenfassade', 'Nur Rasenmähen auf der Liegewiese', 'Nur Handtücher waschen in der Wäscherei'"),

    # Reinigungsgeräte Nassbereich
    ("'Nur Besen im Routinebetrieb unter Betriebsbedingungen', 'Nur Staubsauger nach Trinkwasserverordnung bei vorschriftsmäßigem Betrieb', 'Nur Lappen nach UVV laut RKI-Empfehlung im Rahmen der Eigenkontrolle'",
     "'Nur ein Besen und eine Kehrschaufel', 'Nur ein normaler Haushaltsstaubsauger', 'Nur ein feuchter Lappen und gute Laune'"),

    # Elektrische Reinigungsmaschinen
    ("'Auf nichts Besonderes nach Desinfektionsplan unter Betriebsbedingungen', 'Nur auf die Farbe nach Wartungsplan gemäß Gefährdungsbeurteilung', 'Nur auf die Größe nach geltender Vorschrift nach Herstellervorgabe'",
     "'Auf nichts Besonderes – Strom und Wasser vertragen sich', 'Nur auf die Farbe passend zum Fliesendesign', 'Nur auf die Größe, damit sie durch die Tür passt'"),

    # Keramische Bodenbeläge
    ("'Nur Farbe laut Betriebshandbuch im Routinebetrieb nach Sicherheitsvorschrift', 'Nur Preis gemäß Prüfprotokoll gemäß Betriebsanweisung', 'Keine besonderen Anforderungen und dokumentieren nach Betriebsvorschrift'",
     "'Nur eine ansprechende Farbe und Optik', 'Nur ein günstiger Einkaufspreis', 'Keine besonderen Anforderungen – jede Fliese ist geeignet'"),

    # Reinigungsarten
    ("'Nur nasse Reinigung durch den Betreiber', 'Nur trockene Reinigung nach aktueller Norm', 'Nur chemische Reinigung gemäß Prüfprotokoll'",
     "'Nur nasse Reinigung mit dem Schlauch', 'Nur trockene Reinigung mit dem Besen', 'Nur chemische Reinigung mit Lösungsmitteln'"),

    # Arbeitsregeln Reinigung
    ("'Von unten nach oben durch Fachpersonal nach Herstellervorgabe', 'Beliebige Reihenfolge gemäß Gefährdungsbeurteilung', 'Nur von links nach rechts gemäß Prüfprotokoll'",
     "'Von unten nach oben, von vorne nach hinten', 'Beliebige Reihenfolge – Hauptsache sauber', 'Nur von links nach rechts im Uhrzeigersinn'"),

    # Bürstenmaschinen
    ("'Nur in der Küche bei ordnungsgemäßem Betrieb', 'Nur in der Sauna nach Wartungsplan im Rahmen der Betriebsführung', 'Nur im Büro nach Sicherheitsvorschrift laut RKI-Empfehlung'",
     "'Nur in der Küche auf Kachelboden', 'Nur in der Sauna auf Holzbänken', 'Nur im Büro auf Teppichboden'"),

    # Wurfleine Rettungsball
    ("'Nur 2 Meter im Normalbetrieb', '100 Meter nach Dienstanweisung', '1 Meter nach Herstellervorgabe'",
     "'Nur 2 Meter – reicht für den Beckenrand', '100 Meter – wie ein Kletterseil', '1 Meter – kürzer als ein Handtuch'"),

    # Erste-Hilfe-Räume
    ("'Nur ein Stuhl nach Sicherheitsvorschrift bei Standardbedingungen', 'Nur Pflaster nach Betriebsvorschrift nach Hygieneplan', 'Keine besondere Ausstattung nach geltender Vorschrift'",
     "'Nur ein Stuhl und ein Glas Wasser', 'Nur Pflaster und eine Schere', 'Keine besondere Ausstattung nötig'"),

    # Sanitätsräume Anforderungen
    ("'Nur abschließbar gemäß Gefährdungsbeurteilung', 'Nur beheizt unter Aufsicht laut Betriebshandbuch', 'Keine besonderen Anforderungen im Rahmen der Betriebsführung'",
     "'Nur abschließbar – alles andere ist optional', 'Nur beheizt – Licht und Wasser sind unwichtig', 'Keine besonderen Anforderungen – jeder Abstellraum genügt'"),

    # Wiederbelebungsgeräte
    ("'Nur Pflaster laut Betriebshandbuch nach Herstellervorgabe', 'Keine Geräte durch Fachpersonal nach Trinkwasserverordnung', 'Nur Verbände durch geschultes Personal im laufenden Betrieb'",
     "'Nur Pflaster und Mullbinden', 'Keine Geräte – nur Mund-zu-Mund-Beatmung', 'Nur Verbände und Wundauflagen'"),

    # Rettungsgeräte Naturbäder
    ("'Nur ein Seil nach Betriebsvorschrift durch geschultes Personal', 'Keine speziellen Geräte gemäß Gefährdungsbeurteilung', 'Nur Schwimmflügel durch Fachpersonal bei Standardbedingungen'",
     "'Nur ein Seil und ein Rettungsring', 'Keine speziellen Geräte nötig', 'Nur Schwimmflügel für Kinder'"),

    # ===== TECH: Gefahrstoffe section =====
    # Gefahrstoffe
    ("'Nur Wasser im laufenden Betrieb gemäß Betriebsanweisung', 'Nur Handtücher durch geschultes Personal durch den Betreiber', 'Es gibt keine Gefahrstoffe gemäß Prüfprotokoll'",
     "'Nur Wasser – das ist ja kein Gefahrstoff', 'Nur Handtücher und Badebekleidung', 'Es gibt keine Gefahrstoffe in Schwimmbädern'"),

    # Gefahrenbereiche
    ("'Nur am Beckenrand bei vorschriftsmäßigem Betrieb', 'Nur in der Umkleide nach Desinfektionsplan', 'Es gibt keine Gefahrenbereiche bei ordnungsgemäßem Betrieb'",
     "'Nur am Beckenrand wegen Rutschgefahr', 'Nur in der Umkleide wegen nasser Böden', 'Es gibt keine Gefahrenbereiche – alles ist sicher'"),

    # Gefahrstoff Kennzeichnung
    ("'Gar nicht durch geschultes Personal', 'Nur mit der Farbe durch Fachpersonal', 'Nur mit dem Namen gemäß Prüfprotokoll'",
     "'Gar nicht – Gefahrstoffe erkennt man am Geruch', 'Nur mit der Farbe des Behälters', 'Nur mit dem Produktnamen auf dem Etikett'"),

    # Eigenschaften gefährlicher Arbeitsstoffe
    ("'Nur flüssig durch den Betreiber und dokumentieren', 'Nur fest unter Betriebsbedingungen', 'Keine besonderen Eigenschaften nach Herstellervorgabe'",
     "'Nur flüssig – feste Stoffe sind ungefährlich', 'Nur fest – Flüssigkeiten können nicht gefährlich sein', 'Keine besonderen Eigenschaften – alle Arbeitsstoffe sind sicher'"),

    # Körper Aufnahme Gefahrstoffe
    ("'Nur über die Haut bei vorschriftsmäßigem Betrieb', 'Nur über die Atemwege im Normalbetrieb', 'Gar nicht, der Körper schützt sich selbst'",
     "'Nur über die Haut – Einatmen ist unbedenklich', 'Nur über die Atemwege – Hautkontakt ist harmlos', 'Gar nicht – der Körper schützt sich selbst'"),

    # Aerosole vs Gase
    ("'Kein Unterschied unter Betriebsbedingungen nach Wartungsplan nach Betriebsvorschrift', 'Gase sind schwerer als Aerosole in regelmäßigen Abständen laut RKI-Empfehlung', 'Aerosole sind immer giftig, Gase nicht gemäß Betriebsanweisung im Rahmen der Betriebsführung'",
     "'Kein Unterschied – beides sind Gase in der Luft', 'Gase sind immer schwerer als Aerosole', 'Aerosole sind immer giftig, Gase hingegen nie'"),

    # Sicherheitsdatenblätter Zweck
    ("'Nur zur Dekoration laut RKI-Empfehlung nach UVV', 'Nur für die Buchhaltung gemäß Betriebsanweisung', 'Nur für den Hersteller laut Herstellerangaben'",
     "'Nur zur Dekoration der Chemikalienräume', 'Nur für die Buchhaltung und Kostenrechnung', 'Nur für den Hersteller zu Werbezwecken'"),

    # Sicherheitsdatenblätter Angaben
    ("'Nur den Preis nach UVV gemäß Betriebsanweisung', 'Nur den Herstellernamen und dokumentieren durch geschultes Personal', 'Nur die Farbe nach Betriebsvorschrift gemäß Prüfprotokoll'",
     "'Nur den Preis und die Bestellnummer', 'Nur den Herstellernamen und das Logo', 'Nur die Farbe und den Geruch des Produkts'"),

    # Produktinformationen
    ("'Nur den Preis nach DIN 19643 nach Hygieneplan', 'Nur das Gewicht nach aktueller Norm gemäß Gefährdungsbeurteilung', 'Keine Angaben nötig wie vorgeschrieben nach Betriebsvorschrift'",
     "'Nur den Preis und das Herstellungsland', 'Nur das Gewicht und die Füllmenge', 'Keine Angaben nötig – der Geruch verrät alles'"),

    # Kennzeichnungspflicht
    ("'Nur zur Werbung nach aktueller Norm nach geltender Vorschrift', 'Nur zur Preisgestaltung nach Desinfektionsplan', 'Hat keinen bestimmten Zweck im Routinebetrieb'",
     "'Nur zur Werbung und Vermarktung', 'Nur zur Preisgestaltung im Einzelhandel', 'Hat keinen bestimmten Zweck – reine Formalität'"),

    # Getrennte Lagerung
    ("'Aus Platzgründen nach Hygieneplan nach Sicherheitsvorschrift', 'Zur besseren Optik unter Betriebsbedingungen', 'Das ist nicht vorgeschrieben nach Wartungsplan'",
     "'Aus Platzgründen – jedes Regal ein Stoff', 'Zur besseren Optik und Ordnung', 'Das ist nicht vorgeschrieben – freie Lagerung genügt'"),

    # Orangefarbenes Schild
    ("'Explosiv nach geltender Vorschrift', 'Radioaktiv nach DIN 19643 nach aktueller Norm', 'Umweltgefährlich nach Vorschrift'",
     "'Explosiv (Bombe-Symbol)', 'Radioaktiv (Kleeblatt-Symbol)', 'Umweltgefährlich (toter Fisch und Baum)'"),

    # Chemikalienlagerung
    ("'Beliebig zusammen in einem Raum im Normalbetrieb', 'Im Freien ohne Schutz nach Betriebsvorschrift', 'In der Schwimmhalle laut Betriebshandbuch im laufenden Betrieb'",
     "'Beliebig zusammen in einem Raum – spart Platz', 'Im Freien ohne Schutz – Regen verdünnt alles', 'In der Schwimmhalle für schnellen Zugriff'"),

    # ===== TECH: Sicherheit & Arbeitsschutz =====
    # Werkstoffe mechanische Eigenschaften
    ("'Nur der Preis nach Dienstanweisung laut Herstellerangaben', 'Nur die Farbe durch den Betreiber durch geschultes Personal', 'Nur der Geschmack gemäß Infektionsschutzgesetz'",
     "'Nur der Preis bei der Beschaffung', 'Nur die Farbe für ein einheitliches Design', 'Nur der Geschmack – falls jemand dran leckt'"),

    # Werkstoffe chemische Eigenschaften
    ("'Nur die Brennbarkeit nach UVV bei vorschriftsmäßigem Betrieb', 'Nur die Löslichkeit nach technischer Regel unter Aufsicht', 'Keine besonderen nach Trinkwasserverordnung im Rahmen der Betriebsführung'",
     "'Nur die Brennbarkeit des Materials', 'Nur die Löslichkeit in Wasser', 'Keine besonderen chemischen Anforderungen'"),

    # Pumpen unterscheiden
    ("'Nur nach Größe und dokumentieren nach Vorschrift', 'Nur nach Farbe nach UVV nach Trinkwasserverordnung', 'Nur nach Hersteller nach Herstellervorgabe'",
     "'Nur nach Größe: kleine und große Pumpen', 'Nur nach Farbe: rote, blaue und grüne Pumpen', 'Nur nach Hersteller und Markenname'"),

    # Kolbenpumpen Einsatz
    ("'Als Hauptumwälzpumpe nach DIN 19643 im Normalbetrieb', 'Zur Beckenentleerung durch geschultes Personal', 'Zur Wellenanlage wie vorgeschrieben nach Sicherheitsvorschrift'",
     "'Als Hauptumwälzpumpe für große Wassermengen', 'Zur Beckenentleerung bei Revision', 'Zum Antrieb der Wellenanlage'"),

    # Membranpumpe Funktion
    ("'Durch Rotation eines Rades nach geltender Vorschrift', 'Durch Schwerkraft gemäß Infektionsschutzgesetz gemäß Betriebsanweisung', 'Durch Dampfdruck nach Betriebsvorschrift im Regelbetrieb'",
     "'Durch Rotation eines Laufrades (das ist eine Kreiselpumpe)', 'Durch Schwerkraft ohne bewegliche Teile', 'Durch Dampfdruck wie bei einer Dampfmaschine'"),

    # Membranpumpen Einsatz
    ("'Als Hauptumwälzpumpe nach geltender Vorschrift', 'Zur Schwallwasserentsorgung gemäß Infektionsschutzgesetz', 'Als Feuerlöschpumpe nach Betriebsvorschrift laut Herstellerangaben'",
     "'Als Hauptumwälzpumpe (zu geringe Fördermenge)', 'Zur Schwallwasserentsorgung (Kreiselpumpe besser)', 'Als Feuerlöschpumpe (zu geringe Förderleistung)'"),

    # Kolbenpumpen Vorteil
    ("'Sehr hoher Volumenstrom im Normalbetrieb', 'Keine Wartung nötig bei ordnungsgemäßem Betrieb', 'Sehr leise gemäß Infektionsschutzgesetz'",
     "'Sehr hoher Volumenstrom bei niedrigem Druck', 'Keine Wartung nötig – verschleißfrei', 'Sehr leise und vibrationsfrei'"),

    # Kolbenpumpen Nachteil
    ("'Zu hoher Volumenstrom nach technischer Regel', 'Zu leise nach Wartungsplan im Regelbetrieb', 'Keine Nachteile laut RKI-Empfehlung'",
     "'Zu hoher Volumenstrom für Dosierungen', 'Zu leise – man hört nicht ob sie läuft', 'Keine Nachteile – Kolbenpumpen sind perfekt'"),

    # Kreiselpumpe
    ("'Durch einen Kolben nach UVV bei vorschriftsmäßigem Betrieb', 'Durch eine Membran bei ordnungsgemäßem Betrieb', 'Durch Schwerkraft nach Vorschrift unter Aufsicht'",
     "'Durch einen Kolben mit Hin- und Herbewegung', 'Durch eine flexible Membran mit Hubbewegung', 'Durch Schwerkraft allein ohne bewegliche Teile'"),

    # Kreiselpumpen Abdichtung
    ("'Gar nicht gemäß Gefährdungsbeurteilung', 'Mit Klebeband nach Herstellervorgabe', 'Mit Silikon nach Trinkwasserverordnung'",
     "'Gar nicht – Kreiselpumpen sind immer dicht', 'Mit Klebeband und Kabelbindern', 'Mit Silikon aus der Kartusche'"),

    # Wasserstrahlpumpe
    ("'Elektromotor treibt Laufrad gemäß Prüfprotokoll bei ordnungsgemäßem Betrieb', 'Kolben erzeugt Druck nach Dienstanweisung gemäß Betriebsanweisung', 'Membran bewegt sich im Regelbetrieb nach Sicherheitsvorschrift'",
     "'Elektromotor treibt ein Laufrad an (das ist Kreiselpumpe)', 'Kolben erzeugt Druck (das ist Kolbenpumpe)', 'Membran bewegt sich hin und her (das ist Membranpumpe)'"),

    # Injektorpumpe
    ("'Nach dem Kolbenprinzip bei vorschriftsmäßigem Betrieb', 'Nach dem Membranprinzip durch geschultes Personal', 'Nach dem Kreiselprinzip bei ordnungsgemäßem Betrieb'",
     "'Nach dem Kolbenprinzip mit Hubbewegung', 'Nach dem Membranprinzip mit Schwingung', 'Nach dem Kreiselprinzip mit Rotation'"),

    # Injektorpumpen Einsatz
    ("'Als Hauptumwälzpumpe nach Wartungsplan', 'Zur Beckenentleerung durch Fachpersonal', 'Zur Wellenanlage durch den Betreiber'",
     "'Als Hauptumwälzpumpe (zu geringe Leistung)', 'Zur Beckenentleerung (zu langsam)', 'Zum Antrieb der Wellenanlage (ungeeignet)'"),

    # Stechheber
    ("'Eine Pumpe nach Herstellervorgabe nach technischer Regel', 'Ein Werkzeug für Rohre bei ordnungsgemäßem Betrieb', 'Ein Messgerät unter Betriebsbedingungen'",
     "'Eine Pumpe zur Wasserumwälzung', 'Ein Werkzeug zum Rohre biegen', 'Ein Messgerät für den pH-Wert'"),

    # Pumpen in Reihe
    ("'Volumenstrom verdoppelt sich nach Betriebsvorschrift', 'Beides verdoppelt sich laut RKI-Empfehlung', 'Nichts ändert sich gemäß Prüfprotokoll'",
     "'Volumenstrom verdoppelt sich, Förderhöhe bleibt gleich', 'Beides verdoppelt sich gleichzeitig', 'Nichts ändert sich – zwei Pumpen wie eine'"),

    # Pumpen parallel
    ("'Förderhöhe verdoppelt sich in regelmäßigen Abständen', 'Beides verdoppelt sich nach Betriebsvorschrift', 'Nichts ändert sich gemäß Gefährdungsbeurteilung'",
     "'Förderhöhe verdoppelt sich, Volumenstrom bleibt gleich', 'Beides verdoppelt sich gleichzeitig', 'Nichts ändert sich – zwei Pumpen wie eine'"),

    # Chemikaliendosierung Pumpen
    ("'Nur Kreiselpumpen nach Desinfektionsplan', 'Nur Zahnradpumpen bei ordnungsgemäßem Betrieb', 'Nur Wasserstrahlpumpen'",
     "'Nur Kreiselpumpen (zu ungenau)', 'Nur Zahnradpumpen (nicht chemikalienbeständig)', 'Nur Wasserstrahlpumpen (keine Dosierung möglich)'"),

    # Gegenstromapparat
    ("'Eine Schwimmhilfe nach aktueller Norm durch geschultes Personal', 'Ein Wasserrutschenteil nach Hygieneplan im Rahmen der Eigenkontrolle', 'Ein Filtergehäuse und dokumentieren nach Betriebsvorschrift'",
     "'Eine Schwimmhilfe für Gegenstromschwimmen', 'Ein Bauteil der Wasserrutsche', 'Ein Filtergehäuse mit Doppelwand'"),

    # ===== TECH: Wärme & Energie =====
    ("'Nur Sonnenlicht bei ordnungsgemäßem Betrieb', 'Nur Elektroheizstab im Regelbetrieb nach aktueller Norm', 'Gar nicht im laufenden Betrieb im Rahmen der Eigenkontrolle'",
     "'Nur Sonnenlicht durch die Glasfassade', 'Nur ein Elektroheizstab im Becken', 'Gar nicht – das Wasser wärmt sich von allein auf'"),

    # Duschwasser erwärmen
    ("'Nur durch Sonnenlicht im laufenden Betrieb', 'Nur durch Dampf nach Hygieneplan nach Herstellervorgabe', 'Gar nicht durch Fachpersonal gemäß Prüfprotokoll'",
     "'Nur durch Sonnenlicht auf dem Dach', 'Nur durch Dampf aus dem Heizkessel', 'Gar nicht – kaltes Duschen härtet ab'"),

    # Wärmeenergie verbessern
    ("'Fenster öffnen im Rahmen der Betriebsführung', 'Heizung abschalten durch geschultes Personal', 'Mehr Badegäste einladen in regelmäßigen Abständen'",
     "'Alle Fenster dauerhaft öffnen für frische Luft', 'Heizung komplett abschalten und sparen', 'Mehr Badegäste einladen – Körperwärme heizt mit'"),

    # Solarenergie
    ("'Nur für Beleuchtung laut RKI-Empfehlung', 'Nur für Kassensystem laut Herstellerangaben', 'Nicht nutzbar unter Aufsicht nach technischer Regel'",
     "'Nur für die Hallenbeleuchtung', 'Nur für das Kassensystem am Eingang', 'Nicht nutzbar in Hallenbädern wegen der Überdachung'"),

    # Klimaanlage Hallenbad
    ("'Nur Kühlung unter Aufsicht laut Betriebshandbuch', 'Nur Heizung nach Wartungsplan nach Sicherheitsvorschrift', 'Nur Geruchsbeseitigung nach Betriebsvorschrift'",
     "'Nur Kühlung der Hallenluft im Sommer', 'Nur Heizung der Hallenluft im Winter', 'Nur Geruchsbeseitigung bei Chlorgeruch'"),

    # Entfeuchtung
    ("'Nur für den Komfort durch den Betreiber', 'Ist nicht wichtig unter Betriebsbedingungen', 'Nur für den Geruch nach technischer Regel'",
     "'Nur für den Komfort der Badegäste', 'Ist nicht wichtig – feuchte Luft gehört ins Hallenbad', 'Nur gegen den Chlorgeruch in der Halle'"),

    # Taupunkt
    ("'Die maximale Lufttemperatur nach Desinfektionsplan bei Standardbedingungen', 'Die minimale Raumtemperatur durch Fachpersonal nach Herstellervorgabe', 'Der Siedepunkt von Wasser unter Aufsicht nach Betriebsvorschrift'",
     "'Die maximale erlaubte Lufttemperatur in der Halle', 'Die minimale Raumtemperatur im Winter', 'Der Siedepunkt von Wasser bei 100°C'"),

    # Klimaanlage Ausfall
    ("'Nichts Besonderes laut Herstellerangaben', 'Das Wasser kühlt ab nach Sicherheitsvorschrift', 'Die Beleuchtung fällt aus nach Herstellervorgabe'",
     "'Nichts Besonderes – die Halle lüftet sich selbst', 'Das Beckenwasser kühlt schnell aus', 'Die Beleuchtung fällt gleichzeitig aus'"),

    # Sauna 100°C
    ("'Der Körper ist hitzeresistent laut Betriebshandbuch', 'Die Temperatur wird falsch gemessen im laufenden Betrieb', 'Der Mensch spürt keine Hitze nach aktueller Norm'",
     "'Der menschliche Körper ist bis 120°C hitzeresistent', 'Die Temperatur wird an der Decke gemessen – am Boden ist es kühler', 'Der Mensch spürt trockene Hitze gar nicht richtig'"),

    # Legionellen Temperatur
    ("'Unter 10 °C nach Sicherheitsvorschrift', 'Nur über 80 °C gemäß Gefährdungsbeurteilung', 'Nur bei 0 °C gemäß Betriebsanweisung'",
     "'Unter 10 °C in kaltem Grundwasser', 'Nur über 80 °C in überhitztem Dampf', 'Nur bei 0 °C im gefrorenen Zustand'"),

    # Legionellenprophylaxe
    ("'Nur durch Chlorung im Routinebetrieb nach Desinfektionsplan nach geltender Vorschrift', 'Gar nicht nach UVV durch geschultes Personal bei vorschriftsmäßigem Betrieb', 'Durch Abkühlung des Wassers und dokumentieren nach Betriebsvorschrift'",
     "'Nur durch erhöhte Chlordosierung im Beckenwasser', 'Gar nicht möglich – Legionellen sind nicht zu verhindern', 'Durch Abkühlung des Wassers auf unter 20°C'"),

    # Wärmerückgewinnung
    ("'Gar nicht möglich nach Hygieneplan unter Betriebsbedingungen', 'Nur durch Solaranlagen nach Vorschrift laut Betriebshandbuch', 'Durch Fenster öffnen nach Sicherheitsvorschrift nach technischer Regel'",
     "'Gar nicht möglich – Wärme ist unwiederbringlich verloren', 'Nur durch Solaranlagen auf dem Dach', 'Durch Fenster öffnen und frische warme Luft einlassen'"),

    # Schwimmbadabdeckungen
    ("'Nur Dekoration nach aktueller Norm wie vorgeschrieben', 'Nur Schutz vor Regen im laufenden Betrieb', 'Kein besonderer Nutzen bei korrekter Anwendung'",
     "'Nur Dekoration und optischer Schutz', 'Nur Schutz vor Regen und Laub', 'Kein besonderer Nutzen – reine Kosmetik'"),

    # ===== TECH: Algen =====
    ("'Bakterien, vermehren sich durch Luft nach technischer Regel', 'Pilze, vermehren sich durch Wurzeln unter Aufsicht', 'Viren, vermehren sich durch Kontakt durch Fachpersonal'",
     "'Bakterien, die sich durch Luftübertragung vermehren', 'Pilze, die sich über Wurzelgeflecht ausbreiten', 'Viren, die durch direkten Kontakt übertragen werden'"),

    ("'Gar nicht nach aktueller Norm im Normalbetrieb', 'Nur optisch störend im Routinebetrieb nach Hygieneplan', 'Nur leichter Geruch laut Betriebshandbuch gemäß Infektionsschutzgesetz'",
     "'Gar nicht – Algen sind harmlos und dekorativ', 'Nur optisch störend durch grüne Färbung', 'Nur leichter muffiger Geruch'"),

    ("'Nur Dunkelheit gemäß Gefährdungsbeurteilung', 'Nur Kälte nach Betriebsvorschrift', 'Nur trockene Bedingungen laut Herstellerangaben'",
     "'Nur Dunkelheit und Sauerstoffmangel', 'Nur Kälte unter 5°C', 'Nur trockene Bedingungen ohne Feuchtigkeit'"),

    ("'Keine Auswirkungen gemäß Betriebsanweisung', 'Nur bessere Wasserqualität im Regelbetrieb', 'Nur optische Veränderung nach Wartungsplan'",
     "'Keine Auswirkungen – Algen sind harmlos', 'Bessere Wasserqualität durch natürliche Filtration', 'Nur optische Veränderung durch Grünfärbung'"),

    ("'Nur Chlor bei Standardbedingungen durch den Betreiber', 'Nur Essig gemäß Infektionsschutzgesetz im Routinebetrieb', 'Nur heißes Wasser im Rahmen der Betriebsführung nach DIN 19643'",
     "'Nur normales Chlor in höherer Dosierung', 'Nur Essig als natürliches Hausmittel', 'Nur heißes Wasser über 60°C'"),

    ("'Auf nichts Besonderes gemäß Prüfprotokoll unter Betriebsbedingungen', 'Nur mehr Wasser hinzufügen im Rahmen der Betriebsführung', 'Nur die Temperatur senken nach Dienstanweisung bei korrekter Anwendung'",
     "'Auf nichts Besonderes – Algen verschwinden von selbst', 'Nur mehr Frischwasser nachfüllen', 'Nur die Wassertemperatur unter 20°C senken'"),

    # ===== SWIM SECTION =====
    # Wettkampfgericht
    ("'Getränke verkaufen nach Wartungsplan', 'Becken reinigen nach Herstellervorgabe', 'Tickets kontrollieren im Regelbetrieb'",
     "'Getränke an die Schwimmer verkaufen', 'Das Becken zwischen den Rennen reinigen', 'Eintrittskarten am Eingang kontrollieren'"),

    # Rückenschwimmen als Erstschwimmart
    ("'Weil es am schnellsten ist', 'Weil es am einfachsten aussieht', 'Weil alle es können durch geschultes Personal'",
     "'Weil es die schnellste Schwimmart ist', 'Weil es am einfachsten aussieht', 'Weil es jeder intuitiv beherrscht'"),

    # Startkommando
    ("'Ready - Set - Go nach Wartungsplan', 'Achtung - Start laut RKI-Empfehlung'",
     "'Ready - Set - Go wie im Leichtathletik', 'Achtung - Fertig - Start wie beim Rennen'"),

    # Intervalltraining
    ("'Nur Techniktraining nach geltender Vorschrift', 'Nur Krafttraining nach Vorschrift'",
     "'Nur Techniktraining ohne Belastungssteuerung', 'Nur Krafttraining an Land'"),

    # ===== FIRST AID SECTION =====
    # Neuner-Regel
    ("'Anzahl der Rettungsschwimmer nach UVV', 'Chlor-Dosierung nach Vorschrift im Routinebetrieb', 'Anzahl der Bahnen nach Dienstanweisung'",
     "'Regel zur Berechnung des Blutvolumens', 'Anzahl der Ersthelfer pro Verletzen', 'Maximale Wartezeit bis zum Notruf in Minuten'"),

    # Hitzschlag Lagerung
    ("'In der Sonne lassen nach Betriebsvorschrift', 'Warm einpacken im Normalbetrieb', 'Heißen Tee geben laut RKI-Empfehlung'",
     "'In der Sonne liegen lassen – Schatten ist unnötig', 'Warm einpacken gegen den Schüttelfrost', 'Heißen Tee geben zur inneren Erwärmung'"),

    # Reanimation Säuglinge Drucktiefe
    ("'0,5 cm gemäß Infektionsschutzgesetz', 'So tief wie möglich'",
     "'0,5 cm – ganz sanft und vorsichtig', 'So tief wie möglich – viel hilft viel'"),

    # Beatmungsfrequenz Erwachsene
    ("'5 Beatmungen/min, 200 ml unter Aufsicht', '30 Beatmungen/min, 1000 ml nach Vorschrift', '2 Beatmungen/min, 100 ml im Rahmen der Eigenkontrolle'",
     "'5 Beatmungen/min, 200 ml pro Atemzug', '30 Beatmungen/min, 1000 ml pro Atemzug', '2 Beatmungen/min, 100 ml pro Atemzug'"),

    # ===== HYGIENE SECTION =====
    # Legionellenprüfung
    ("'Sicherheitscheck der Rutschen', 'Temperaturmessung laut Herstellerangaben', 'pH-Test gemäß Gefährdungsbeurteilung'",
     "'Sicherheitscheck der Rutschen und Sprunganlagen', 'Temperaturmessung in allen Becken', 'pH-Wert-Test des Beckenwassers'"),

    # Pseudomonas
    ("'Viren im Beckenwasser nach technischer Regel', 'Harmlose Algen gemäß Betriebsanweisung nach Dienstanweisung', 'Ein Reinigungsmittel nach Trinkwasserverordnung'",
     "'Viren, die nur durch Hautkontakt übertragen werden', 'Harmlose Algen ohne Krankheitswirkung', 'Ein Reinigungsmittel für den Nassbereich'"),

    # Chlor gebunden - hoher Wert
    ("'Zu wenig Badegäste bei ordnungsgemäßem Betrieb', 'Zu kaltes Wasser laut RKI-Empfehlung', 'Defekte Umkleiden unter Betriebsbedingungen'",
     "'Zu wenig Badegäste im Becken', 'Zu kaltes Beckenwasser unter 20°C', 'Defekte Umwälzpumpe im Technikraum'"),

    # Biofilm
    ("'Ein Wasserfilm ohne Keime gemäß Gefährdungsbeurteilung', 'Eine Art Reinigungsmittel bei vorschriftsmäßigem Betrieb', 'Eine besondere Fliesenart nach Dienstanweisung'",
     "'Ein dünner Wasserfilm ohne Keime auf glatten Flächen', 'Eine Art biologisches Reinigungsmittel', 'Eine besonders hygienische Fliesenart'"),

    # Biofilm Bildung
    ("'Nur auf trockenen Flächen nach technischer Regel', 'Nur im Außenbereich nach aktueller Norm in regelmäßigen Abständen', 'Ausschließlich im Beckenboden nach Wartungsplan'",
     "'Nur auf trockenen Flächen ohne Feuchtigkeit', 'Nur im Außenbereich bei Sonneneinstrahlung', 'Ausschließlich am Beckenboden unter Wasser'"),

    # Legionellen richtig
    ("'Sie entstehen nur durch Chlor gemäß Prüfprotokoll', 'Sie sind nur in Meerwasser zu finden im Regelbetrieb', 'Sie sind ausschließlich Hautpilze unter Betriebsbedingungen'",
     "'Sie entstehen durch zu viel Chlor im Wasser', 'Sie kommen nur in Meerwasser und Salzwasser vor', 'Sie sind eine Art Hautpilz wie Fußpilz'"),

    # Erbrochenem im Becken
    ("'Ignorieren und weiterschwimmen lassen nach Hygieneplan', 'Nur Wasser nachfüllen bei ordnungsgemäßem Betrieb', 'Nur den Boden trockenwischen wie vorgeschrieben'",
     "'Ignorieren – Chlor erledigt den Rest', 'Nur Frischwasser nachfüllen zur Verdünnung', 'Nur den Beckenrand trockenwischen'"),

    # Durchfallerkrankungen
    ("'Sie beeinflussen nur den Lärmpegel gemäß Gefährdungsbeurteilung', 'Sie betreffen nur die Umkleiden im Routinebetrieb', 'Sie machen das Wasser weicher im Normalbetrieb'",
     "'Sie beeinflussen nur den Besucherkomfort', 'Sie betreffen nur die Sanitäranlagen', 'Sie machen das Wasser weicher und angenehmer'"),

    # Schutzausrüstung Desinfektionsmittel
    ("'Keine Schutzausrüstung durch geschultes Personal', 'Nur Badeschuhe laut Betriebshandbuch', 'Nur Gehörschutz nach technischer Regel'",
     "'Keine Schutzausrüstung nötig bei verdünnten Lösungen', 'Nur Badeschuhe gegen nasse Böden', 'Nur Gehörschutz gegen laute Pumpen'"),

    # Kontaktflächen
    ("'Nur Deckenflächen gemäß Betriebsanweisung', 'Nur Außenwände im laufenden Betrieb nach Herstellervorgabe', 'Nur Büroarbeitsplätze nach Dienstanweisung'",
     "'Nur Deckenflächen und Oberlichter', 'Nur Außenwände und Fassaden', 'Nur Büroarbeitsplätze der Verwaltung'"),

    # Wickelraum
    ("'Nur tägliches Lüften im laufenden Betrieb', 'Keine Handschuhe nutzen und dokumentieren', 'Nur Boden fegen nach aktueller Norm nach Desinfektionsplan'",
     "'Nur tägliches Lüften des Raumes', 'Keine Handschuhe nötig – Hautkontakt ist unbedenklich', 'Nur den Boden fegen und wischen'"),

    # Schimmelbildung
    ("'Trockene Luft im laufenden Betrieb', 'Niedrige Luftfeuchte durch den Betreiber', 'Kurze Öffnungszeiten gemäß Infektionsschutzgesetz'",
     "'Trockene Luft und gute Belüftung', 'Niedrige Luftfeuchtigkeit unter 40%', 'Kurze Öffnungszeiten und wenig Betrieb'"),

    # Schimmel Maßnahme
    ("'Raum dauerhaft schließen und dokumentieren', 'Nur kalt nachwischen im Routinebetrieb', 'Reinigung komplett aussetzen im Rahmen der Eigenkontrolle'",
     "'Raum dauerhaft schließen und abdichten', 'Nur mit kaltem Wasser nachwischen', 'Reinigung komplett aussetzen – Schimmel trocknet aus'"),

    # ===== POLITIK SECTION =====
    # Arbeitsrecht
    ("'Nur Gehälter nach technischer Regel', 'Nur Urlaub nach Hygieneplan', 'Nur Kündigung durch den Betreiber'",
     "'Nur Gehälter und Lohnfortzahlung', 'Nur Urlaubsansprüche und Ferienregelung', 'Nur Kündigungen und Abfindungen'"),

    # Berufsgenossenschaft
    ("'Gewerkschaft nach Betriebsvorschrift', 'Arbeitgeberverband im Rahmen der Betriebsführung', 'Prüfungsamt bei vorschriftsmäßigem Betrieb'",
     "'Gewerkschaft für Arbeitnehmerrechte', 'Arbeitgeberverband für Tarifverhandlungen', 'Prüfungsamt für Berufsabschlüsse'"),

    # Tarifvertrag
    ("'Mietvertrag durch Fachpersonal im Rahmen der Betriebsführung', 'Kaufvertrag nach aktueller Norm laut Betriebshandbuch', 'Versicherungsvertrag nach UVV und dokumentieren im Rahmen der Eigenkontrolle'",
     "'Mietvertrag zwischen Vermieter und Mieter', 'Kaufvertrag zwischen Käufer und Verkäufer', 'Versicherungsvertrag zwischen Versicherer und Versichertem'"),

    # Grundgesetz
    ("'Jeder darf alles unter Betriebsbedingungen', 'Steuern müssen bezahlt werden', 'Autos haben Vorfahrt unter Aufsicht'",
     "'Jeder darf tun und lassen was er will', 'Steuern müssen sofort bezahlt werden', 'Autos haben immer Vorfahrt vor Fußgängern'"),

    # Bundesrat Aufgabe
    ("'Bundeskanzler wählen nach DIN 19643', 'Bundespräsident sein nach Betriebsvorschrift', 'Olympische Spiele organisieren'",
     "'Bundeskanzler wählen (das macht der Bundestag)', 'Den Bundespräsidenten vertreten', 'Olympische Spiele in Deutschland organisieren'"),

    # Bundespräsident Aufgabe
    ("'Gesetze beschließen in regelmäßigen Abständen', 'Steuern erheben im Rahmen der Betriebsführung', 'Polizei leiten nach technischer Regel'",
     "'Gesetze beschließen (das macht der Bundestag)', 'Steuern erheben (das macht das Finanzamt)', 'Die Bundespolizei leiten und kommandieren'"),

    # Tarifvertragsart
    ("'Mietvertrag laut Betriebshandbuch durch Fachpersonal', 'Kaufvertrag laut Herstellerangaben im Routinebetrieb', 'Handyvertrag nach geltender Vorschrift'",
     "'Mietvertrag (regelt Wohnungsverhältnisse)', 'Kaufvertrag (regelt Warenhandel)', 'Handyvertrag (regelt Mobilfunknutzung)'"),

    # Tarifautonomie
    ("'Automatische Lohnerhöhung laut Herstellerangaben', 'Staatliche Lohnfestsetzung nach Dienstanweisung', 'Verbot von Gewerkschaften bei korrekter Anwendung'",
     "'Automatische jährliche Lohnerhöhung per Gesetz', 'Staatliche Lohnfestsetzung durch das Arbeitsministerium', 'Verbot von Gewerkschaften in Betrieben'"),

    # Unabdingbarkeit
    ("'Kündigung ist unmöglich laut Herstellerangaben im Rahmen der Eigenkontrolle', 'Vertrag kann jederzeit geändert werden nach Trinkwasserverordnung', 'Vertrag hat kein Ende bei korrekter Anwendung nach Wartungsplan'",
     "'Kündigung des Tarifvertrags ist unmöglich', 'Einzelne Klauseln können jederzeit geändert werden', 'Tarifvertrag hat kein Ablaufdatum'"),

    # Allgemeinverbindlichkeit
    ("'Gilt nur für Gewerkschaftsmitglieder und dokumentieren im Rahmen der Betriebsführung', 'Gilt nur in Bayern nach Hygieneplan nach Trinkwasserverordnung', 'Gilt nur für Beamte im Routinebetrieb gemäß Prüfprotokoll nach Wartungsplan'",
     "'Gilt nur für Gewerkschaftsmitglieder', 'Gilt nur in Bayern und Baden-Württemberg', 'Gilt nur für Beamte im öffentlichen Dienst'"),

    # Friedenspflicht
    ("'Kein Krieg in Deutschland unter Aufsicht durch den Betreiber', 'Friedliche Verhandlungen bei korrekter Anwendung', 'Verbot von Demonstrationen im Routinebetrieb'",
     "'Kein Krieg in Deutschland während der Laufzeit', 'Friedliche Verhandlungen ohne Zeitdruck', 'Verbot von Demonstrationen vor dem Betrieb'"),

    # Demokratische Wahlen
    ("'Öffentlich (jeder sieht, was man wählt)', 'Nur für Männer im Normalbetrieb', 'Nur für Reiche unter Aufsicht'",
     "'Öffentlich (jeder sieht, was man wählt)', 'Nur für Männer ab 25 Jahren', 'Nur für Grundstückseigentümer'"),

    # Gesellschaftsform
    ("'Einzelunternehmen ohne Kaufmannseigenschaft', 'Verein nach Dienstanweisung nach DIN 19643', 'Stiftung nach Hygieneplan nach geltender Vorschrift'",
     "'Einzelunternehmen ohne Kaufmannseigenschaft', 'Eingetragener Verein (e.V.)', 'Gemeinnützige Stiftung'"),

    # ===== HEALTH SECTION =====
    # Erkrankungen durch Bakterien
    ("'Grippe, Masern im Rahmen der Eigenkontrolle', 'Fußpilz nach Herstellervorgabe', 'Malaria nach Trinkwasserverordnung'",
     "'Grippe, Masern (das sind Viruserkrankungen)', 'Fußpilz, Ringelflechte (das sind Pilzerkrankungen)', 'Malaria (das wird durch Parasiten verursacht)'"),

    # Bädertypische Erreger
    ("'Nur Erkältungsviren und dokumentieren', 'Keine besonderen unter Betriebsbedingungen', 'Nur Bakterien durch geschultes Personal'",
     "'Nur Erkältungsviren aus der Atemluft', 'Keine besonderen – Schwimmbäder sind keimfrei', 'Nur Bakterien – Pilze und Viren kommen nicht vor'"),

    # Berufskrankheit
    ("'Jede Krankheit bei der Arbeit bei korrekter Anwendung', 'Nur Unfälle nach aktueller Norm im Rahmen der Eigenkontrolle', 'Nur psychische Erkrankungen nach Vorschrift'",
     "'Jede Krankheit, die man während der Arbeit bekommt', 'Nur Arbeitsunfälle mit Verletzungen', 'Nur psychische Erkrankungen wie Burnout'"),

    # Infektion passiert
    ("'Nur Fieber durch den Betreiber und dokumentieren', 'Nur Schmerzen im Rahmen der Eigenkontrolle', 'Nichts Besonderes nach technischer Regel'",
     "'Nur Fieber als einziges Symptom', 'Nur Schmerzen an der Eintrittsstelle', 'Nichts Besonderes – der Körper heilt sich selbst'"),

    # Infektionsquellen
    ("'Nur Luft nach Wartungsplan durch Fachpersonal', 'Nur Wasser gemäß Prüfprotokoll im laufenden Betrieb', 'Nur Essen im Normalbetrieb gemäß Infektionsschutzgesetz'",
     "'Nur Luft durch Tröpfcheninfektion', 'Nur verunreinigtes Trinkwasser', 'Nur verdorbene Lebensmittel'"),

    # Desinfektion
    ("'Reinigung mit Wasser laut Herstellerangaben', 'Nur Staubwischen wie vorgeschrieben', 'Lüften gemäß Prüfprotokoll nach Desinfektionsplan'",
     "'Reinigung mit Wasser und Seife (das ist Reinigung)', 'Nur Staubwischen und Aufräumen', 'Lüften der Räume bei geöffneten Fenstern'"),

    # Hygiene
    ("'Nur Händewaschen nach DIN 19643 nach Vorschrift', 'Nur Duschen gemäß Betriebsanweisung in regelmäßigen Abständen', 'Nur Putzen nach Sicherheitsvorschrift durch den Betreiber'",
     "'Nur Händewaschen nach dem Toilettengang', 'Nur tägliches Duschen und Körperpflege', 'Nur Putzen und Aufräumen der Wohnung'"),

    # viruzid
    ("'Bakterien abtötend nach Wartungsplan', 'Pilze abtötend gemäß Infektionsschutzgesetz', 'Sporen abtötend laut RKI-Empfehlung'",
     "'Bakterien abtötend (das ist bakterizid)', 'Pilze abtötend (das ist fungizid)', 'Sporen abtötend (das ist sporizid)'"),

    # Gemeinsamkeiten Bakterien Viren
    ("'Beide haben Zellkern durch den Betreiber', 'Beide vermehren sich gleich bei vorschriftsmäßigem Betrieb', 'Beide sind gleich groß in regelmäßigen Abständen'",
     "'Beide besitzen einen Zellkern (Viren haben keinen)', 'Beide vermehren sich durch Zellteilung (Viren nicht)', 'Beide sind gleich groß (Viren sind viel kleiner)'"),

    # Unterschied Viren Bakterien
    ("'Viren sind größer bei Standardbedingungen bei vorschriftsmäßigem Betrieb', 'Viren haben Zellwand durch geschultes Personal', 'Kein Unterschied durch den Betreiber nach Desinfektionsplan'",
     "'Viren sind größer als Bakterien (stimmt nicht – umgekehrt)', 'Viren haben eine eigene Zellwand (haben sie nicht)', 'Kein Unterschied – beides sind Mikroorganismen'"),

    # Legionellen
    ("'Viren durch den Betreiber bei ordnungsgemäßem Betrieb', 'Pilze gemäß Betriebsanweisung durch Fachpersonal', 'Parasiten wie vorgeschrieben nach UVV nach Vorschrift'",
     "'Viren, die durch Tröpfchen übertragen werden', 'Pilze, die in feuchter Umgebung wachsen', 'Parasiten, die im Darm des Menschen leben'"),

    # Legionellen Übertragung
    ("'Durch Trinken nach Sicherheitsvorschrift', 'Von Mensch zu Mensch laut Betriebshandbuch', 'Durch Essen im Rahmen der Eigenkontrolle'",
     "'Durch Trinken von kontaminiertem Wasser', 'Von Mensch zu Mensch durch Körperkontakt', 'Durch verunreinigte Lebensmittel'"),

    # Legionellenprophylaxe
    ("'Impfung gegen Legionellen durch Fachpersonal nach Sicherheitsvorschrift', 'Antibiotika-Behandlung unter Betriebsbedingungen', 'Nichts tun nach Vorschrift im Routinebetrieb im Rahmen der Eigenkontrolle'",
     "'Impfung gegen Legionellen (gibt es nicht)', 'Antibiotika-Behandlung des Wassers', 'Nichts tun – Legionellen sind harmlos'"),

    # ===== TECH: Various sections with massive jargon =====
    # ppm Bedeutung
    ("'Durchführung der vorgeschriebenen Eigenkontrollen', 'Pumpenleistung pro Meter', 'Partikel pro Mikroliter'",
     "'Prozent pro Milliliter', 'Pumpenleistung pro Meter', 'Partikel pro Mikroliter'"),

    # Desinfektion sections
    ("'Nur wegen dem Geruch bei vorschriftsmäßigem Betrieb', 'Nur wegen der Farbe nach geltender Vorschrift', 'Nur zur Reinigung laut Betriebshandbuch'",
     "'Nur wegen dem unangenehmen Geruch', 'Nur wegen der Wasserfarbe', 'Nur zur optischen Reinigung und Klarheit'"),

    ("'Nur Bakterien im Rahmen der Eigenkontrolle', 'Keine Krankheitserreger gemäß Prüfprotokoll', 'Nur Viren gemäß Infektionsschutzgesetz'",
     "'Nur Bakterien – Viren und Pilze gibt es nicht', 'Keine Krankheitserreger – Bäder sind steril', 'Nur Viren – Bakterien und Pilze kommen nicht vor'"),

    # sporizid
    ("'Pilztötend im Rahmen der Eigenkontrolle', 'Bakterientötend in regelmäßigen Abständen', 'Algentötend laut Herstellerangaben'",
     "'Pilztötend (das ist fungizid)', 'Bakterientötend (das ist bakterizid)', 'Algentötend (das ist algizid)'"),

    # Algenarten
    ("'Nur Rotalgen und dokumentieren nach Herstellervorgabe', 'Keine Algen gemäß Infektionsschutzgesetz', 'Nur Kieselalgen unter Aufsicht nach DIN 19643'",
     "'Nur Rotalgen in tiefen Beckenbereichen', 'Keine Algen – Chlor verhindert jedes Wachstum', 'Nur Kieselalgen auf den Filtermaterialien'"),

    # Flächendesinfektion Wirkstofftypen
    ("'Nur Chlor bei Standardbedingungen unter Betriebsbedingungen', 'Nur Seife nach geltender Vorschrift durch geschultes Personal', 'Nur Wasser nach aktueller Norm durch Fachpersonal'",
     "'Nur Chlor und chlorhaltige Mittel', 'Nur Seife und Tensidlösungen', 'Nur heißes Wasser über 80°C'"),

    # Desinfektionsmittel Anforderungen
    ("'Nur billig gemäß Gefährdungsbeurteilung laut RKI-Empfehlung', 'Nur gut riechend nach Betriebsvorschrift nach geltender Vorschrift', 'Keine besonderen Anforderungen unter Betriebsbedingungen'",
     "'Nur billig und in großen Mengen verfügbar', 'Nur gut riechend und angenehm in der Anwendung', 'Keine besonderen Anforderungen – jedes Mittel reicht'"),

    # Various tech cleanup - virulent
    ("'Gegen Viren wirkend im Normalbetrieb im Routinebetrieb', 'Virentötend laut RKI-Empfehlung laut Herstellerangaben', 'Virenfreundlich bei ordnungsgemäßem Betrieb im laufenden Betrieb'",
     "'Gegen Viren wirkend (das wäre viruzid)', 'Virentötend (das wäre ebenfalls viruzid)', 'Virenfreundlich – also Viren fördernd'"),
]

# Apply all replacements
changed = 0
not_found = []
for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        changed += 1
    else:
        not_found.append(old[:80])

print(f"Applied {changed} of {len(replacements)} replacements")
if not_found:
    print(f"\nNot found ({len(not_found)}):")
    for nf in not_found[:10]:
        print(f"  - {nf}...")

# Verify we didn't break the file structure
assert content.startswith("// Fragen-Format:"), "File start corrupted"
assert "export const SAMPLE_QUESTIONS" in content, "Export missing"
assert content.rstrip().endswith("};"), "File end corrupted"

with open('src/data/quizQuestions.js', 'w', encoding='utf-8') as f:
    f.write(content)

# Count remaining jargon
import re
jargon = re.findall(r'nach Trinkwasserverordnung|nach DIN 19643|gemäß Infektionsschutzgesetz|laut RKI-Empfehlung|im Normalbetrieb|nach Herstellervorgabe|nach Wartungsplan|gemäß Prüfprotokoll|nach Desinfektionsplan|nach Hygieneplan|gemäß Betriebsanweisung|laut Betriebshandbuch|gemäß Gefährdungsbeurteilung|nach Sicherheitsvorschrift|nach Dienstanweisung|im Rahmen der Eigenkontrolle|im Rahmen der Betriebsführung|bei vorschriftsmäßigem Betrieb|bei ordnungsgemäßem Betrieb|bei Standardbedingungen|im Regelbetrieb|im Routinebetrieb|im laufenden Betrieb|durch geschultes Personal|durch Fachpersonal|durch den Betreiber|bei korrekter Anwendung|in regelmäßigen Abständen|nach geltender Vorschrift|nach aktueller Norm|nach UVV|nach technischer Regel|und dokumentieren|laut Herstellerangaben|wie vorgeschrieben', content)
print(f"\nRemaining jargon instances: {len(jargon)}")
print(f"Original had ~313 affected lines")
