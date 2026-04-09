import { Suspense, lazy, useState } from 'react';
import { ArrowLeft, BookOpen, Calculator, ChevronRight, Clock, Droplets, FlaskConical, Heart, Lock, ShieldCheck, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const LazyWaterCycleView = lazy(() => import('./WaterCycleView'));
const LazyHeartDeepDiveThree = lazy(() => import('./health/HeartDeepDiveThree'));
const LazyCrawlTechniqueDeepDiveThree = lazy(() => import('./swim/CrawlTechniqueDeepDiveThree'));
const LazyCalciumHypochloriteDeepDiveView = lazy(() => import('./chlorine/CalciumHypochloriteDeepDiveView'));
const LazyStartblockDeepDiveView = lazy(() => import('./bauliches/StartblockDeepDiveView'));
const LazyUmwaelzpumpeDeepDiveView = lazy(() => import('./pumpen/UmwaelzpumpeDeepDiveView'));
const LazyMembrandosierpumpeDeepDiveView = lazy(() => import('./pumpen/MembrandosierpumpeDeepDiveView'));
const LazyClosedFilterDeepDiveView = lazy(() => import('./filter/ClosedFilterDeepDiveView'));
const LazyFilterSpuelungDeepDiveView = lazy(() => import('./filter/FilterSpuelungDeepDiveView'));
const LazyMathBasicsDeepDiveView = lazy(() => import('./mathematik/MathBasicsDeepDiveView'));
const LazyDreisatzDeepDiveView = lazy(() => import('./mathematik/DreisatzDeepDiveView'));
const LazyGrundrechenartenDeepDiveView = lazy(() => import('./mathematik/GrundrechenartenDeepDiveView'));
const LazyBruecheDeepDiveView = lazy(() => import('./mathematik/BruecheDeepDiveView'));
const LazyProzentDeepDiveView = lazy(() => import('./mathematik/ProzentDeepDiveView'));
const LazyFormelnDeepDiveView = lazy(() => import('./mathematik/FormelnDeepDiveView'));
const LazyPythagorasDeepDiveView = lazy(() => import('./mathematik/PythagorasDeepDiveView'));
const LazyFlaechenDeepDiveView = lazy(() => import('./mathematik/FlaechenDeepDiveView'));
const LazyVolumenDeepDiveView = lazy(() => import('./mathematik/VolumenDeepDiveView'));
const LazyZeitDeepDiveView = lazy(() => import('./mathematik/ZeitDeepDiveView'));
const LazyAuftriebDeepDiveView = lazy(() => import('./mathematik/AuftriebDeepDiveView'));
const LazyDruckDeepDiveView = lazy(() => import('./mathematik/DruckDeepDiveView'));
const LazyBewegungDeepDiveView = lazy(() => import('./mathematik/BewegungDeepDiveView'));
const LazyWaermeDeepDiveView = lazy(() => import('./mathematik/WaermeDeepDiveView'));
const LazyMechanikDeepDiveView = lazy(() => import('./mathematik/MechanikDeepDiveView'));
const LazyPumpenDeepDiveView = lazy(() => import('./mathematik/PumpenDeepDiveView'));
const LazyFiltrationDeepDiveView = lazy(() => import('./mathematik/FiltrationDeepDiveView'));
const LazyChlorDeepDiveView = lazy(() => import('./mathematik/ChlorDeepDiveView'));
const LazyFormelsammlungDeepDiveView = lazy(() => import('./mathematik/FormelsammlungDeepDiveView'));
const LazyChemicalFormulasDeepDiveView = lazy(() => import('./chemie/ChemicalFormulasDeepDiveView'));
const LazyStoffnamenFormelnDeepDiveView = lazy(() => import('./chemie/StoffnamenFormelnDeepDiveView'));
const LazySaeurenBasenDeepDiveView = lazy(() => import('./chemie/SaeurenBasenDeepDiveView'));
const LazyRedoxDeepDiveView = lazy(() => import('./chemie/RedoxDeepDiveView'));
const LazySaeurekapazitaetDeepDiveView = lazy(() => import('./chemie/SaeurekapazitaetDeepDiveView'));
const LazyBeckenwasserdesinfektionDeepDiveView = lazy(() => import('./chemie/BeckenwasserdesinfektionDeepDiveView'));
const LazyElektrolyseDeepDiveView = lazy(() => import('./chemie/ElektrolyseDeepDiveView'));
const LazyKorrosionDeepDiveView = lazy(() => import('./chemie/KorrosionDeepDiveView'));
const LazyElektrolyseAnlageDeepDiveView = lazy(() => import('./chemie/ElektrolyseAnlageDeepDiveView'));
const LazyHlwAedDeepDiveView = lazy(() => import('./health/HlwAedDeepDiveView'));
const LazyBewusstseinAtmungDeepDiveView = lazy(() => import('./health/BewusstseinAtmungDeepDiveView'));
const LazyStabileSeitenlageDeepDiveView = lazy(() => import('./health/StabileSeitenlageDeepDiveView'));
const LazyBadeunfallDeepDiveView = lazy(() => import('./health/BadeunfallDeepDiveView'));
const LazyHyperventilationDeepDiveView = lazy(() => import('./health/HyperventilationDeepDiveView'));
const LazyHautDeepDiveView = lazy(() => import('./health/HautDeepDiveView'));
const LazySinnesorganeDeepDiveView = lazy(() => import('./health/SinnesorganeDeepDiveView'));
const LazyBeschilderungDeepDiveView = lazy(() => import('./hygiene/BeschilderungDeepDiveView'));
const LazyReinigungDesinfektionDeepDiveView = lazy(() => import('./hygiene/ReinigungDesinfektionDeepDiveView'));
const LazyGefahrstoffeDeepDiveView = lazy(() => import('./hygiene/GefahrstoffeDeepDiveView'));
const LazyStrafrechtBadVertieftDeepDiveView = lazy(() => import('./recht/StrafrechtBadVertieftDeepDiveView'));
const LazyNotwehrNothilfeDeepDiveView = lazy(() => import('./recht/NotwehrNothilfeDeepDiveView'));
const LazyPersonalfuehrungDeepDiveView = lazy(() => import('./recht/PersonalfuehrungDeepDiveView'));
const LazyRechtsnormenDeepDiveView = lazy(() => import('./recht/RechtsnormenDeepDiveView'));
const LazyBadevertagHausordnungDeepDiveView = lazy(() => import('./recht/BadevertagHausordnungDeepDiveView'));
const LazyAufsichtspflichtDeepDiveView = lazy(() => import('./recht/AufsichtspflichtDeepDiveView'));
const LazyGewaltenteilungDeepDiveView = lazy(() => import('./recht/GewaltenteilungDeepDiveView'));
const LazyStrafRechtBadDeepDiveView = lazy(() => import('./recht/StrafRechtBadDeepDiveView'));
const LazyJugendarbeitsschutzDeepDiveView = lazy(() => import('./recht/JugendarbeitsschutzDeepDiveView'));
const LazyMutterschutzDeepDiveView = lazy(() => import('./recht/MutterschutzDeepDiveView'));
const LazyKuendigungDeepDiveView = lazy(() => import('./recht/KuendigungDeepDiveView'));
const LazyKommunalpolitikDeepDiveView = lazy(() => import('./recht/KommunalpolitikDeepDiveView'));
const LazyGesellschaftsformenDeepDiveView = lazy(() => import('./recht/GesellschaftsformenDeepDiveView'));
const LazySozialversicherungDeepDiveView = lazy(() => import('./recht/SozialversicherungDeepDiveView'));
const LazyKostenmanagementDeepDiveView = lazy(() => import('./recht/KostenmanagementDeepDiveView'));
const LazyMarketingDeepDiveView = lazy(() => import('./recht/MarketingDeepDiveView'));

// ─── Learning categories based on Ausbildungsrahmenplan §3 FaBB ─────────────
const LEARNING_CATEGORIES = [
  {
    id: 'bädertechnik',
    name: 'Bädertechnik',
    icon: '⚗️',
    lucideIcon: FlaskConical,
    description: 'Wasseraufbereitung, Anlagentechnik, Messtechnik',
    longDescription: 'Lerne den kompletten Wasserkreislauf eines Schwimmbads kennen: von der Überlaufrinne über Flockung, Filtration und Desinfektion bis zur Rücklaufeinspeisung. Interaktive 3D-Modelle zeigen dir jede Station im Detail.',
    paragraphs: '§3 Nr. 11–13',
    color: '#7c3aed',
    colorLight: '#7c3aed20',
    modules: [
      {
        id: 'water-cycle',
        name: 'Wasserkreislauf-Simulation',
        description: 'Interaktive Schwimmbad-Wasseraufbereitung mit 9 Stationen, 3D Deep Dives und Missionen',
        icon: '💧',
        available: true,
      },
      {
        id: 'beckenarten-einrichtungen',
        name: 'Beckenarten & Einrichtungen',
        description: 'Übersicht zu Beckenformen, Ausstattung und Betriebseinrichtungen',
        icon: '🏗️',
        available: false,
      },
      {
        id: 'startblock-startwand-bauliches',
        name: 'Startblock & Startwand (Bauliches)',
        description: 'Deep Dive mit 3D-Modell, Massen, Startwand und Rückenstart-Funktionen',
        icon: 'SB',
        available: true,
      },
      {
        id: 'sprunganlagen',
        name: 'Sprunganlagen',
        description: 'Sprungturm, Bretter, Sicherheitsbereiche und Prüfpunkte',
        icon: '🏊‍♂️',
        available: false,
      },
      {
        id: 'hubboden',
        name: 'Hubboden',
        description: 'Funktion, Sicherheit und Bedienung von Hubbodensystemen',
        icon: '⬆️',
        available: false,
      },
      {
        id: 'ein-auswinterung',
        name: 'Ein- & Auswinterung',
        description: 'Saisonvorbereitung, Stilllegung und Wiederinbetriebnahme',
        icon: '❄️',
        available: false,
      },
      {
        id: 'chemie-badewasser',
        name: 'Chemie der Badewasseraufbereitung',
        description: 'Unterthemen: Das Wasser, pH-Wert, Redox-Spannung, Saeuren und Basen, Oxidierbarkeit, Wasserhaerte, Korrosion und Korrosionsschutz',
        icon: '⚗️',
        available: false,
      },
      {
        id: 'anlagen-badewasseraufbereitung',
        name: 'Anlagen Badewasseraufbereitung',
        description: 'Struktur und Zusammenspiel der zentralen Aufbereitungsstufen',
        icon: '🏭',
        available: false,
      },
      {
        id: 'mess-und-regeltechnik',
        name: 'Mess- und Regeltechnik',
        description: 'Sensorik, Regler, Sollwerte und sicherer Anlagenbetrieb',
        icon: '📟',
        available: false,
      },
      {
        id: 'pumpen',
        name: 'Pumpen',
        description: 'Umwälzpumpe im Schnittbild mit Hydraulik, Abdichtung, Service und Effizienz',
        icon: '⚙️',
        available: true,
      },
      {
        id: 'membrandosierpumpe',
        name: 'Membrandosierpumpe',
        description: 'Magnet-Membrandosierpumpe mit Dosierhub, Hubverstellung und Steuerung im Schnittbild',
        icon: 'MD',
        available: true,
      },
      {
        id: 'geschlossener-filter',
        name: 'Geschlossener Filter',
        description: 'Festbettfilter im Schnittbild mit Filterbett, Luftspuelung, Rueckspuelung und Wiederanfahren',
        icon: 'GF',
        available: true,
      },
      {
        id: 'flockungsmittel',
        name: 'Flockungsmittel',
        description: 'Dosierung, Wirkung und Einbindung in den Prozess',
        icon: '🧫',
        available: false,
      },
      {
        id: 'filtration-filtertechnik',
        name: 'Filtration & Filtertechnik',
        description: 'Filteraufbau, Schichtmaterialien und Filtrationsprinzipien',
        icon: '🗂️',
        available: false,
      },
      {
        id: 'filterspuelung',
        name: 'Filterspuelung',
        description: 'Rueckspuelablauf mit Klappenstellungen fuer Filterspuelung, Ausserbetriebnahme und Inbetriebnahme',
        icon: 'FS',
        available: true,
      },
      {
        id: 'desinfektionsverfahren',
        name: 'Desinfektionsverfahren',
        description: 'Verfahren und Betriebsgrenzen in der Badewasserdesinfektion',
        icon: '⚗️',
        available: false,
      },
      {
        id: 'feststoff-chloranlage-calciumhypochlorid',
        name: 'Feststoff-Chloranlage (Calciumhypochlorid)',
        description: 'Deep Dive zur Calciumhypochlorit-Anlage mit Komponenten, Prozess und Betriebscheck',
        icon: '🧪',
        available: true,
      },
      {
        id: 'chlorgasanlage-raum',
        name: 'Chlorgasanlage & Chlorgasraum',
        description: 'Sicherheitsanforderungen, Raumkonzept und Notfallmassnahmen',
        icon: '☢️',
        available: false,
      },
      {
        id: 'uv-anlage',
        name: 'UV-Anlage',
        description: 'UV-Desinfektion, Wirkprinzip und Kombination mit Chlor',
        icon: '💡',
        available: false,
      },
      {
        id: 'heizung-lueftung',
        name: 'Heizung & Lueftung',
        description: 'Wärmeuebertragung, Hallenklima und Entfeuchtung',
        icon: '🌬️',
        available: false,
      },
    ],
  },
  {
    id: 'schwimmen',
    name: 'Schwimmen & Rettung',
    icon: '🏊',
    lucideIcon: Droplets,
    description: 'Schwimmtechniken, Rettungsschwimmen, Wasserrettung',
    longDescription: 'Schwimmtechniken trainieren, Rettungsszenarien üben und Abzeichen-Anforderungen kennenlernen. Von Brustschwimmen bis zur Rettungskette.',
    paragraphs: '§3 Nr. 8–9',
    color: '#0891b2',
    colorLight: '#0891b220',
    modules: [
      {
        id: 'schwimmtechniken',
        name: 'Schwimmtechniken',
        description: 'Brust, Kraul, Rücken und Delphin mit Technikschritten',
        icon: '🏊',
        available: true,
      },
      {
        id: 'starts-wenden',
        name: 'Starts & Wenden',
        description: 'Startsprung, Rollwende, Anschlag und Zeitgewinn',
        icon: '🚀',
        available: false,
      },
      {
        id: 'rettungsgriffe',
        name: 'Rettungsgriffe',
        description: 'Anschwimmen, Befreiungsgriffe und Transportschwimmen',
        icon: '🆘',
        available: false,
      },
      {
        id: 'rettungsgeraete',
        name: 'Rettungsgeraete',
        description: 'Rettungsstange, Gurtretter, Wurfleine und Einsatzgrenzen',
        icon: '🛟',
        available: false,
      },
      {
        id: 'rettungskette',
        name: 'Rettungskette',
        description: 'Erkennen, alarmieren, bergen, übergeben',
        icon: '⛑️',
        available: false,
      },
    ],
  },
  {
    id: 'erste-hilfe',
    name: 'Erste Hilfe & Gesundheitslehre',
    icon: '🚑',
    lucideIcon: Heart,
    description: 'HLW, Ersthelfer-Pflichten, Gesundheitslehre, Notfallmanagement',
    longDescription: 'Herz-Lungen-Wiederbelebung, stabile Seitenlage, Grundlagen der Gesundheitslehre und Umgang mit Badeunfällen speziell für den Bäderbetrieb.',
    paragraphs: '§3 Nr. 10',
    color: '#dc2626',
    colorLight: '#dc262620',
    modules: [
      {
        id: 'herz',
        name: 'Herz',
        description: 'Aufbau, Funktion und Rolle des Herzens im Kreislaufsystem',
        icon: '🫀',
        available: true,
      },
      {
        id: 'blutkreislauf-gross-klein',
        name: 'Großer & kleiner Blutkreislauf',
        description: 'Weg des Blutes durch Körper- und Lungenkreislauf',
        icon: '🩸',
        available: true,
      },
      {
        id: 'hyperventilation',
        name: 'Hyperventilation',
        description: 'Ursachen, Symptome und Erstmaßnahmen im Badebetrieb',
        icon: '🌬️',
        available: true,
      },
      {
        id: 'haut',
        name: 'Die Haut',
        description: 'Schutzfunktion, Aufbau und Relevanz in der Ersten Hilfe',
        icon: '🧍',
        available: true,
      },
      {
        id: 'sinnesorgane',
        name: 'Sinnesorgane',
        description: 'Auge, Ohr und weitere Sinne mit Bezug zu Badeunfaellen',
        icon: '👁️',
        available: true,
      },
      {
        id: 'hlw-aed',
        name: 'HLW & AED',
        description: 'Algorithmus 30:2, Defibrillator und Teamablauf',
        icon: '❤️',
        available: true,
      },
      {
        id: 'bewusstsein-atmung',
        name: 'Bewusstsein & Atmung',
        description: 'Ansprechen, Atemkontrolle und Entscheidungspfade',
        icon: '🫁',
        available: true,
      },
      {
        id: 'stabile-seitenlage',
        name: 'Stabile Seitenlage',
        description: 'Sichere Lagerung und kontinuierliche Überwachung',
        icon: '🧍',
        available: true,
      },
      {
        id: 'badeunfall-erstversorgung',
        name: 'Badeunfall-Erstversorgung',
        description: 'Typische Notfallbilder im Bad und Erstmassnahmen',
        icon: '🚑',
        available: true,
      },
    ],
  },
  {
    id: 'bäderbetrieb',
    name: 'Bäderbetrieb',
    icon: '🔧',
    lucideIcon: Wrench,
    description: 'Betriebssicherheit, Aufsicht, Besucherbetreuung',
    longDescription: 'Verkehrssicherungspflicht, Aufsichtsplanung, Badeordnung, Besucherbetreuung und Konfliktlösung im täglichen Badebetrieb.',
    paragraphs: '§3 Nr. 5–7',
    color: '#9333ea',
    colorLight: '#9333ea20',
    modules: [
      {
        id: 'aufsicht-grundriss',
        name: 'Aufsicht im Grundriss',
        description: 'Aufsichtspositionen, Sichtlinien und Gefahrenzonen',
        icon: '🗺️',
        available: false,
      },
      {
        id: 'verkehrssicherung',
        name: 'Verkehrssicherungspflicht',
        description: 'Kontrollen, Dokumentation und Haftungsrisiken',
        icon: '⚠️',
        available: false,
      },
      {
        id: 'betrieb-checklisten',
        name: 'Betriebs-Checklisten',
        description: 'Öffnungs-, Schicht- und Schliessroutinen',
        icon: '📋',
        available: false,
      },
      {
        id: 'gästekommunikation',
        name: 'Gästekommunikation',
        description: 'Konfliktmanagement, Deeskalation und Service',
        icon: '🗣️',
        available: false,
      },
    ],
  },
  {
    id: 'hygiene',
    name: 'Hygiene & Sicherheit',
    icon: '🧼',
    lucideIcon: ShieldCheck,
    description: 'Desinfektion, Gefahrstoffe, Arbeitsschutz',
    longDescription: 'Hygieneplan, Reinigungsmittel, Gefahrstoffverordnung, PSA und Arbeitssicherheit im Schwimmbad.',
    paragraphs: '§3 Nr. 4',
    color: '#eab308',
    colorLight: '#eab30820',
    modules: [
      {
        id: 'beschilderung-kennzeichnungen',
        name: 'Beschilderung & Kennzeichnungen',
        description: 'Sicherheitszeichen, Pflichtschilder und Orientierung im Bad',
        icon: '🪧',
        available: true,
      },
      {
        id: 'reinigung-desinfektion',
        name: 'Reinigung & Desinfektion',
        description: 'Reinigungsplaene, Verfahren, Kontaktzeiten und Kontrollen',
        icon: '🧼',
        available: true,
      },
      {
        id: 'gefahrstoffe',
        name: 'Gefahrstoffe',
        description: 'Lagerung, Handhabung, Schutzmassnahmen und Notfallablauf',
        icon: '☣️',
        available: true,
      },
    ],
  },
  {
    id: 'mathematik',
    name: 'Mathematik',
    icon: '123',
    lucideIcon: Calculator,
    description: 'Mathe, Physik und Betriebsrechnen fuer den Baederalltag in einfachen Schritten',
    longDescription: 'Von Grundrechenarten und Bruchrechnen ueber Geometrie, Bewegung, Druck, Waerme und Pumpen bis zur Chlor-Dosierung: Jeder Rechenweg wird einfach, mit Einheiten und mit Beispielen aus dem Baederbetrieb erklaert.',
    paragraphs: 'Lernhilfe · Grundlagen',
    color: '#0f766e',
    colorLight: '#0f766e20',
    modules: [
      {
        id: 'mathe-grundrechenarten',
        name: 'Grundrechenarten',
        description: 'Plus, Minus, Mal, Geteilt und Punkt-vor-Strich sicher anwenden',
        icon: '+-',
        available: true,
      },
      {
        id: 'mathe-brueche',
        name: 'Bruchrechnen',
        description: 'Brueche addieren, erweitern, kuerzen und als Anteil lesen',
        icon: '1/2',
        available: true,
      },
      {
        id: 'mathe-dreisatz',
        name: 'Dreisatz',
        description: 'Proportional und antiproportional — mit Baeder-Beispielen ausfuehrlich erklaert',
        icon: '3S',
        available: true,
      },
      {
        id: 'mathe-prozent',
        name: 'Prozentrechnung',
        description: 'Anteile von 100 schnell und sauber berechnen',
        icon: '%',
        available: true,
      },
      {
        id: 'mathe-formeln',
        name: 'Formeln & Buchstaben',
        description: 'Unbekannte groessen freistellen und mit Variablen rechnen',
        icon: 'x=',
        available: true,
      },
      {
        id: 'mathe-pythagoras',
        name: 'Satz des Pythagoras',
        description: 'Rechtwinklige Dreiecke mit a2 + b2 = c2 berechnen',
        icon: 'a2',
        available: true,
      },
      {
        id: 'mathe-flaechen',
        name: 'Flaechenberechnung',
        description: 'Rechteck, Dreieck und Kreis sauber berechnen',
        icon: 'm2',
        available: true,
      },
      {
        id: 'mathe-volumen',
        name: 'Beckenvolumen',
        description: 'Laenge, Breite, Tiefe und Literumrechnung',
        icon: 'm3',
        available: true,
      },
      {
        id: 'mathe-zeit',
        name: 'Zeit & Industriestunden',
        description: 'Normale Zeit sicher in Industriestunden umrechnen',
        icon: 'T',
        available: true,
      },
      {
        id: 'mathe-auftrieb',
        name: 'Auftrieb',
        description: 'Warum Koerper schwimmen und wie Auftrieb grob berechnet wird',
        icon: 'FA',
        available: true,
      },
      {
        id: 'mathe-druck',
        name: 'Druck',
        description: 'Flaeche, Kraft und Wasserdruck im Betrieb verstehen',
        icon: 'bar',
        available: true,
      },
      {
        id: 'mathe-bewegung',
        name: 'Geschwindigkeit & Bewegung',
        description: 'Weg, Zeit und Geschwindigkeit sicher umrechnen',
        icon: 'v',
        available: true,
      },
      {
        id: 'mathe-waerme',
        name: 'Waermelehre',
        description: 'Temperatur, Temperaturdifferenz und Waermemenge einfach erklaert',
        icon: 'Q',
        available: true,
      },
      {
        id: 'mathe-mechanik',
        name: 'Mechanik',
        description: 'Kraft, Arbeit und Leistung fuer den technischen Alltag',
        icon: 'M',
        available: true,
      },
      {
        id: 'mathe-pumpen',
        name: 'Pumpenberechnung',
        description: 'Foerderstrom, Foerderhoehe und Leistung in Grundschritten',
        icon: 'P',
        available: true,
      },
      {
        id: 'mathe-filtration',
        name: 'Filtrationsberechnung',
        description: 'Filterflaeche, Filtrationsgeschwindigkeit und Auslegung',
        icon: 'VF',
        available: true,
      },
      {
        id: 'mathe-chlor',
        name: 'Chlor-Dosierung',
        description: 'mg/L, m3 und Produktmenge im Becken sauber berechnen',
        icon: 'Cl',
        available: true,
      },
      {
        id: 'mathe-formelsammlung',
        name: 'Formelsammelblatt',
        description: 'Wichtige Formeln aus Mathematik, Technik und Wasseraufbereitung',
        icon: 'FS',
        available: true,
      },
    ],
  },
  {
    id: 'chemie',
    name: 'Chemie-Grundlagen',
    icon: 'H2O',
    lucideIcon: FlaskConical,
    description: 'Formeln lesen, Elemente erkennen und Stoffe aus dem Baederbetrieb verstehen',
    longDescription: 'Hier lernst du chemische Formeln wirklich von Grund auf. Du erkennst Elementsymbole, liest Zahlen und Klammern richtig und zerlegst typische Stoffe aus der Badewasseraufbereitung Schritt fuer Schritt.',
    paragraphs: 'Lernhilfe · Chemie',
    color: '#2563eb',
    colorLight: '#2563eb20',
    modules: [
      {
        id: 'chemische-formeln',
        name: 'Chemische Formeln verstehen',
        description: 'Buchstaben, Zahlen und Klammern in Formeln ganz einfach lesen',
        icon: 'CF',
        available: true,
      },
      {
        id: 'stoffnamen-formeln',
        name: 'Stoffnamen & Formeln',
        description: 'Wie Stoffname, Formel und Einsatz zusammengehoeren',
        icon: 'SF',
        available: true,
      },
      {
        id: 'saeuren-basen-grundlagen',
        name: 'Saeuren & Basen',
        description: 'Einfache Grundlagen zu pH, Saeuren und Basen',
        icon: 'pH',
        available: true,
      },
      {
        id: 'redox-grundlagen',
        name: 'Redox-Grundlagen',
        description: 'Oxidation und Reduktion ohne Fachchinesisch',
        icon: 'Rx',
        available: true,
      },
      {
        id: 'saeurekapazitaet',
        name: 'Säurekapazität & Wasserhärte',
        description: 'KS4,3-Wert, Härtegrade und Pufferwirkung im Beckenwasser',
        icon: 'KS',
        available: true,
      },
      {
        id: 'beckenwasserdesinfektion',
        name: 'Beckenwasserdesinfektion',
        description: 'Chlor, UV, Ozon und Kombinationsverfahren nach DIN 19643',
        icon: 'Cl',
        available: true,
      },
      {
        id: 'elektrolyse',
        name: 'Elektrolyse',
        description: 'Chlor aus Salz erzeugen — Inline, Side-Stream und Membranzelle',
        icon: 'El',
        available: true,
      },
      {
        id: 'elektrolyse-3d',
        name: 'Elektrolysezelle (3D)',
        description: 'Interaktives 3D-Schnittbild einer Membranzellenelektrolyse mit Hotspots',
        icon: '⚡',
        available: true,
      },
      {
        id: 'korrosion',
        name: 'Korrosion & Korrosionsschutz',
        description: 'Korrosionsarten erkennen und Metalle im Schwimmbad schuetzen',
        icon: 'Fe',
        available: true,
      },
    ],
  },
  {
    id: 'verwaltung',
    name: 'Verwaltung & Recht',
    icon: '📝',
    lucideIcon: BookOpen,
    description: 'Berufsbildung, Arbeitsrecht, Kassenwesen',
    longDescription: 'Ausbildungsvertrag, Tarifrecht, Kassensysteme, Datenschutz und Öffentlichkeitsarbeit für den Bäderbetrieb.',
    paragraphs: '§3 Nr. 1–3, 14–15',
    color: '#059669',
    colorLight: '#05966920',
    modules: [
      {
        id: 'berufsrecht-basis',
        name: 'Berufsrecht-Basis',
        description: 'Ausbildungsvertrag, Rechte, Pflichten, Mitbestimmung',
        icon: '📘',
        available: false,
      },
      {
        id: 'dienstplanung-arbeitszeit',
        name: 'Dienstplanung & Arbeitszeit',
        description: 'Schichtmodelle, Zeitkonten, Einsatzplanung',
        icon: '🗓️',
        available: false,
      },
      {
        id: 'kasse-abrechnung',
        name: 'Kasse & Abrechnung',
        description: 'Buchungen, Tagesabschluss und Kassenkontrolle',
        icon: '💳',
        available: false,
      },
      {
        id: 'datenschutz-oea',
        name: 'Datenschutz & Öffentlichkeitsarbeit',
        description: 'DSGVO-Basics, Kommunikation und Medienarbeit',
        icon: '📣',
        available: false,
      },
      {
        id: 'strafrecht-bad-vertieft',
        name: 'Strafrecht im Bad — Vertiefung',
        description: 'Körperverletzung (§223–229), Diebstahl, Voyeurismus (§201a), Hausfriedensbruch, Sachbeschädigung',
        icon: '⚖️',
        available: true,
      },
      {
        id: 'notwehr-nothilfe',
        name: 'Notwehr, Nothilfe & Notstand',
        description: '§32 Notwehr, §34/35 Notstand, §323c Hilfeleistung, §127 StPO Jedermanns-Festnahme',
        icon: '🛡️',
        available: true,
      },
      {
        id: 'personalfuehrung',
        name: 'Personalführung im Bäderbetrieb',
        description: 'Organigramm, Führungsstile, Betriebsklima, Mobbing, Dienstplanung',
        icon: '👔',
        available: true,
      },
      {
        id: 'rechtsnormen',
        name: 'Rechtsnormen & Rechtsaufbau',
        description: 'Normenhierarchie, Gerichtssystem, EU-Recht, öffentliches Recht vs. Zivilrecht',
        icon: '📜',
        available: true,
      },
      {
        id: 'badevertrag-hausordnung',
        name: 'Badevertrag & Hausordnung',
        description: 'Konkludenter Vertragsschluss, Haus- & Badeordnung als AGB, Rechte & Pflichten, Hausverbot',
        icon: '🤝',
        available: true,
      },
      {
        id: 'aufsichtspflicht',
        name: 'Aufsichts- & Verkehrssicherungspflicht',
        description: 'Betriebsaufsicht, Beckenaufsicht, DGUV 107-004, Dokumentationspflichten, Dienstkleidung',
        icon: '👁️',
        available: true,
      },
      {
        id: 'gewaltenteilung',
        name: 'Gewaltenteilung & Staatsrecht',
        description: 'Legislative, Exekutive, Judikative — Behörden im Bäderbetrieb',
        icon: '🏛️',
        available: true,
      },
      {
        id: 'strafrecht-bad',
        name: 'Strafrecht im Schwimmbad',
        description: '§323c StGB, Garantenstellung, Fahrlässigkeit, Verkehrssicherungspflicht',
        icon: '⚖️',
        available: true,
      },
      {
        id: 'jugendarbeitsschutz',
        name: 'Jugendarbeitsschutzgesetz',
        description: 'Arbeitszeiten, Verbote und Ausnahmen für Jugendliche (JArbSchG)',
        icon: '👶',
        available: true,
      },
      {
        id: 'mutterschutz',
        name: 'Mutterschutz & Elternzeit',
        description: 'MuSchG, Beschäftigungsverbote, Elternzeit nach BEEG',
        icon: '🤰',
        available: true,
      },
      {
        id: 'kuendigung',
        name: 'Kündigung im Arbeitsrecht',
        description: 'Ordentliche & außerordentliche Kündigung, Abmahnung, KSchG',
        icon: '📄',
        available: true,
      },
      {
        id: 'kommunalpolitik',
        name: 'Kommunalpolitik',
        description: 'Gemeindeorgane, Haushalt, kommunale Bäder — Daseinsvorsorge & Querfinanzierung',
        icon: '🏛️',
        available: true,
      },
      {
        id: 'gesellschaftsformen',
        name: 'Gesellschaftsformen',
        description: 'GbR, OHG, KG, GmbH, AG — Rechtsformen und ihre Bedeutung für kommunale Bäder',
        icon: '🏦',
        available: true,
      },
      {
        id: 'sozialversicherung',
        name: 'Sozialversicherung',
        description: 'Die 5 Säulen: Kranken-, Renten-, Unfall-, Pflege-, Arbeitslosenversicherung',
        icon: '🛡️',
        available: true,
      },
      {
        id: 'kostenmanagement',
        name: 'Kostenmanagement & Bäderkasse',
        description: 'Kostenarten, Kalkulation, Bäderkasse, Controlling, Kostendeckungsgrad',
        icon: '💰',
        available: true,
      },
      {
        id: 'marketing',
        name: 'Marketing im Bäderbetrieb',
        description: 'SWOT-Analyse, 4P-Mix, Zielgruppen, Öffentlichkeitsarbeit, Datenschutz',
        icon: '📣',
        available: true,
      },
    ],
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────
const InteractiveLearningView = () => {
  const { darkMode } = useApp();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeModule, setActiveModule] = useState(null);

  // ─── Module Rendering ─────────────────────────────────────────────────
  if (activeModule === 'water-cycle') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Bädertechnik
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade Wasserkreislauf-Simulation...
            </div>
          )}
        >
          <LazyWaterCycleView />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'feststoff-chloranlage-calciumhypochlorid') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Bädertechnik
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade Feststoff-Chloranlage...
            </div>
          )}
        >
          <LazyCalciumHypochloriteDeepDiveView />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'startblock-startwand-bauliches') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Bädertechnik
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade Startblock Deep Dive...
            </div>
          )}
        >
          <LazyStartblockDeepDiveView />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'pumpen') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Bädertechnik
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade Umwälzpumpe Deep Dive...
            </div>
          )}
        >
          <LazyUmwaelzpumpeDeepDiveView />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'membrandosierpumpe') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Bädertechnik
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade Membrandosierpumpe Deep Dive...
            </div>
          )}
        >
          <LazyMembrandosierpumpeDeepDiveView />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'geschlossener-filter') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurueck zu Baedertechnik
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade geschlossenen Filter Deep Dive...
            </div>
          )}
        >
          <LazyClosedFilterDeepDiveView />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'filterspuelung') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurueck zu Baedertechnik
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade Filterspuelung Deep Dive...
            </div>
          )}
        >
          <LazyFilterSpuelungDeepDiveView />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'schwimmtechniken') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Schwimmen & Rettung
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade 3D-Kraultechnik...
            </div>
          )}
        >
          <LazyCrawlTechniqueDeepDiveThree />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'mathe-dreisatz') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurueck zu Mathematik
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade Dreisatz-Modul...
            </div>
          )}
        >
          <LazyDreisatzDeepDiveView />
        </Suspense>
      </div>
    );
  }

  // ─── Individual Math Deep Dive Modules ──────────────────────────────
  const MATH_MODULE_MAP = {
    'mathe-grundrechenarten': LazyGrundrechenartenDeepDiveView,
    'mathe-brueche': LazyBruecheDeepDiveView,
    'mathe-prozent': LazyProzentDeepDiveView,
    'mathe-formeln': LazyFormelnDeepDiveView,
    'mathe-pythagoras': LazyPythagorasDeepDiveView,
    'mathe-flaechen': LazyFlaechenDeepDiveView,
    'mathe-volumen': LazyVolumenDeepDiveView,
    'mathe-zeit': LazyZeitDeepDiveView,
    'mathe-auftrieb': LazyAuftriebDeepDiveView,
    'mathe-druck': LazyDruckDeepDiveView,
    'mathe-bewegung': LazyBewegungDeepDiveView,
    'mathe-waerme': LazyWaermeDeepDiveView,
    'mathe-mechanik': LazyMechanikDeepDiveView,
    'mathe-pumpen': LazyPumpenDeepDiveView,
    'mathe-filtration': LazyFiltrationDeepDiveView,
    'mathe-chlor': LazyChlorDeepDiveView,
    'mathe-formelsammlung': LazyFormelsammlungDeepDiveView,
  };

  if (MATH_MODULE_MAP[activeModule]) {
    const MathComponent = MATH_MODULE_MAP[activeModule];
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurueck zu Mathematik
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade Mathematik-Modul...
            </div>
          )}
        >
          <MathComponent />
        </Suspense>
      </div>
    );
  }

  // ─── Individual Chemistry Deep Dive Modules ────────────────────────
  const CHEMIE_MODULE_MAP = {
    'chemische-formeln': LazyChemicalFormulasDeepDiveView,
    'stoffnamen-formeln': LazyStoffnamenFormelnDeepDiveView,
    'saeuren-basen-grundlagen': LazySaeurenBasenDeepDiveView,
    'redox-grundlagen': LazyRedoxDeepDiveView,
    'saeurekapazitaet': LazySaeurekapazitaetDeepDiveView,
    'beckenwasserdesinfektion': LazyBeckenwasserdesinfektionDeepDiveView,
    'elektrolyse': LazyElektrolyseDeepDiveView,
    'korrosion': LazyKorrosionDeepDiveView,
    'elektrolyse-3d': LazyElektrolyseAnlageDeepDiveView,
  };

  if (CHEMIE_MODULE_MAP[activeModule]) {
    const ChemieComponent = CHEMIE_MODULE_MAP[activeModule];
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurueck zu Chemie-Grundlagen
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade Chemie-Modul...
            </div>
          )}
        >
          <ChemieComponent />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'herz' || activeModule === 'blutkreislauf-gross-klein') {
    const initialTab = activeModule === 'blutkreislauf-gross-klein' ? 'kreislauf' : 'anatomie';
    const initialScene = activeModule === 'blutkreislauf-gross-klein' ? 'circulation' : 'heart';
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Erste Hilfe & Gesundheitslehre
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade 3D-Herzmodell...
            </div>
          )}
        >
          <LazyHeartDeepDiveThree initialTab={initialTab} initialScene={initialScene} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'beschilderung-kennzeichnungen') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Hygiene & Sicherheit
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade Beschilderung & Kennzeichnungen...
            </div>
          )}
        >
          <LazyBeschilderungDeepDiveView />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'reinigung-desinfektion') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Hygiene & Sicherheit
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade Reinigung & Desinfektion...
            </div>
          )}
        >
          <LazyReinigungDesinfektionDeepDiveView />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'gefahrstoffe') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode
              ? 'text-cyan-400 hover:bg-slate-800'
              : 'text-cyan-700 hover:bg-cyan-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Hygiene & Sicherheit
        </button>
        <Suspense
          fallback={(
            <div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>
              Lade Gefahrstoffe...
            </div>
          )}
        >
          <LazyGefahrstoffeDeepDiveView />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'strafrecht-bad-vertieft') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Strafrecht...</div>}>
          <LazyStrafrechtBadVertieftDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'notwehr-nothilfe') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Notwehr & Nothilfe...</div>}>
          <LazyNotwehrNothilfeDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'personalfuehrung') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Personalführung...</div>}>
          <LazyPersonalfuehrungDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'rechtsnormen') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Rechtsnormen...</div>}>
          <LazyRechtsnormenDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'badevertrag-hausordnung') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Badevertrag...</div>}>
          <LazyBadevertagHausordnungDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'aufsichtspflicht') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Aufsichtspflicht...</div>}>
          <LazyAufsichtspflichtDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'gewaltenteilung') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Gewaltenteilung...</div>}>
          <LazyGewaltenteilungDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'strafrecht-bad') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Strafrecht...</div>}>
          <LazyStrafRechtBadDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'jugendarbeitsschutz') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Jugendarbeitsschutz...</div>}>
          <LazyJugendarbeitsschutzDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'mutterschutz') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Mutterschutz...</div>}>
          <LazyMutterschutzDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'kuendigung') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Kündigung...</div>}>
          <LazyKuendigungDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'kommunalpolitik') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Kommunalpolitik...</div>}>
          <LazyKommunalpolitikDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'gesellschaftsformen') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Gesellschaftsformen...</div>}>
          <LazyGesellschaftsformenDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'sozialversicherung') {
    return (
      <div>
        <button
          onClick={() => setActiveModule(null)}
          className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <ArrowLeft size={16} />
          Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Sozialversicherung...</div>}>
          <LazySozialversicherungDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'kostenmanagement') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Kostenmanagement...</div>}>
          <LazyKostenmanagementDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'marketing') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-emerald-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Verwaltung & Recht
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Marketing...</div>}>
          <LazyMarketingDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'hlw-aed') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-red-400 hover:bg-slate-800' : 'text-red-700 hover:bg-red-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Erste Hilfe & Gesundheitslehre
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade HLW & AED...</div>}>
          <LazyHlwAedDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'bewusstsein-atmung') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-red-400 hover:bg-slate-800' : 'text-red-700 hover:bg-red-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Erste Hilfe & Gesundheitslehre
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Bewusstsein & Atmung...</div>}>
          <LazyBewusstseinAtmungDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'stabile-seitenlage') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-red-400 hover:bg-slate-800' : 'text-red-700 hover:bg-red-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Erste Hilfe & Gesundheitslehre
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Stabile Seitenlage...</div>}>
          <LazyStabileSeitenlageDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'badeunfall-erstversorgung') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-red-400 hover:bg-slate-800' : 'text-red-700 hover:bg-red-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Erste Hilfe & Gesundheitslehre
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Badeunfall-Erstversorgung...</div>}>
          <LazyBadeunfallDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'hyperventilation') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-red-400 hover:bg-slate-800' : 'text-red-700 hover:bg-red-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Erste Hilfe & Gesundheitslehre
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Hyperventilation...</div>}>
          <LazyHyperventilationDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'haut') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-red-400 hover:bg-slate-800' : 'text-red-700 hover:bg-red-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Erste Hilfe & Gesundheitslehre
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Die Haut...</div>}>
          <LazyHautDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  if (activeModule === 'sinnesorgane') {
    return (
      <div>
        <button onClick={() => setActiveModule(null)} className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-red-400 hover:bg-slate-800' : 'text-red-700 hover:bg-red-50'}`}>
          <ArrowLeft size={16} /> Zurück zu Erste Hilfe & Gesundheitslehre
        </button>
        <Suspense fallback={<div className={`rounded-xl border p-6 text-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-200 text-gray-600'}`}>Lade Sinnesorgane...</div>}>
          <LazySinnesorganeDeepDiveView darkMode={darkMode} />
        </Suspense>
      </div>
    );
  }

  // ─── Category Detail View ─────────────────────────────────────────────
  if (activeCategory) {
    const cat = LEARNING_CATEGORIES.find(c => c.id === activeCategory);
    if (!cat) return null;

    return (
      <div className="space-y-4">
        {/* Back + Header */}
        <div>
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode
                ? 'text-cyan-400 hover:bg-slate-800'
                : 'text-cyan-700 hover:bg-cyan-50'
            }`}
          >
            <ArrowLeft size={16} />
            Alle Bereiche
          </button>

          <div className={`rounded-xl p-5 border ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: cat.colorLight }}
              >
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {cat.name}
                </h2>
                <p className={`text-xs font-mono mt-0.5 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                  {cat.paragraphs}
                </p>
                <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {cat.longDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Modules */}
        <div>
          <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            LERNMODULE
          </h3>

          {cat.modules.length > 0 ? (
            <div className="space-y-3">
              {cat.modules.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => mod.available && setActiveModule(mod.id)}
                  disabled={!mod.available}
                  className={`w-full text-left rounded-xl p-4 border transition-all ${
                    mod.available
                      ? darkMode
                        ? 'bg-slate-800/60 border-slate-700 hover:border-cyan-800 hover:bg-slate-800 cursor-pointer'
                        : 'bg-white border-gray-200 hover:border-cyan-300 hover:shadow-md cursor-pointer'
                      : darkMode
                        ? 'bg-slate-900/40 border-slate-800 opacity-60 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                      style={{ background: cat.colorLight }}
                    >
                      {mod.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {mod.name}
                        </span>
                        {mod.available ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            VERFÜGBAR
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-400 flex items-center gap-1">
                            <Clock size={10} /> KOMMT BALD
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        {mod.description}
                      </p>
                    </div>
                    {mod.available && (
                      <ChevronRight size={18} className={darkMode ? 'text-slate-600' : 'text-gray-300'} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={`rounded-xl p-8 border text-center ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-gray-50 border-gray-200'
            }`}>
              <Lock size={32} className={`mx-auto mb-3 ${darkMode ? 'text-slate-600' : 'text-gray-300'}`} />
              <p className={`text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                Module werden gerade entwickelt
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`}>
                Interaktive Lernmodule für diesen Bereich kommen bald.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Hub View (Default) ───────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono tracking-wider" style={{ color: '#0891b2' }}>
            AUSBILDUNGSRAHMENPLAN · §3 FaBB
          </span>
        </div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Interaktives Lernen
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          Wähle einen Ausbildungsbereich und lerne interaktiv mit Simulationen, 3D-Modellen und Szenarien.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {LEARNING_CATEGORIES.map(cat => {
          const availableCount = cat.modules.filter(m => m.available).length;
          const totalCount = cat.modules.length;
          const LIcon = cat.lucideIcon;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-left rounded-xl p-4 border transition-all group ${
                darkMode
                  ? 'bg-slate-800/60 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: cat.colorLight }}
                >
                  <LIcon size={22} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {cat.name}
                    </h3>
                    <ChevronRight
                      size={16}
                      className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${
                        darkMode ? 'text-slate-600' : 'text-gray-300'
                      }`}
                    />
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-mono ${darkMode ? 'text-slate-600' : 'text-gray-400'}`}>
                      {cat.paragraphs}
                    </span>
                    {availableCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {availableCount} Modul{availableCount !== 1 ? 'e' : ''}
                      </span>
                    ) : totalCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-500">
                        in Arbeit
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-500">
                        geplant
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveLearningView;
