import { lazy } from 'react';

const LazyWaterCycleView = lazy(() => import('../WaterCycleView'));
const LazyHeartDeepDiveThree = lazy(() => import('../health/HeartDeepDiveThree'));
const LazySchwimmtechnikenDeepDiveView = lazy(() => import('../swim/SchwimmtechnikenDeepDiveView'));
const LazyStartsWendenDeepDiveView = lazy(() => import('../swim/StartsWendenDeepDiveView'));
const LazyRettungsriffeDeepDiveView = lazy(() => import('../swim/RettungsriffeDeepDiveView'));
const LazyRettungsgeraeteDeepDiveView = lazy(() => import('../swim/RettungsgeraeteDeepDiveView'));
const LazyRettungsketteDeepDiveView = lazy(() => import('../swim/RettungsketteDeepDiveView'));
const LazyWettkampfDeepDiveView = lazy(() => import('../swim/WettkampfDeepDiveView'));
const LazyRettungspruefungFabDeepDiveView = lazy(() => import('../swim/RettungspruefungFabDeepDiveView'));
const LazyAufsichtGrundrissDeepDiveView = lazy(() => import('../betrieb/AufsichtGrundrissDeepDiveView'));
const LazyVerkehrssicherungDeepDiveView = lazy(() => import('../betrieb/VerkehrssicherungDeepDiveView'));
const LazyBetriebChecklistenDeepDiveView = lazy(() => import('../betrieb/BetriebChecklistenDeepDiveView'));
const LazyGaestekommunikationDeepDiveView = lazy(() => import('../betrieb/GaestekommunikationDeepDiveView'));
const LazyBerufsrechtBasisDeepDiveView = lazy(() => import('../recht/BerufsrechtBasisDeepDiveView'));
const LazyPflichtenAGANAusbilderDeepDiveView = lazy(() => import('../recht/PflichtenAGANAusbilderDeepDiveView'));
const LazyDienstplanungArbeitszeitDeepDiveView = lazy(() => import('../recht/DienstplanungArbeitszeitDeepDiveView'));
const LazyKasseAbrechnungDeepDiveView = lazy(() => import('../recht/KasseAbrechnungDeepDiveView'));
const LazyDatenschutzOeaDeepDiveView = lazy(() => import('../recht/DatenschutzOeaDeepDiveView'));
const LazyCalciumHypochloriteDeepDiveView = lazy(() => import('../chlorine/CalciumHypochloriteDeepDiveView'));
const LazyStartblockDeepDiveView = lazy(() => import('../bauliches/StartblockDeepDiveView'));
const LazyUmwaelzpumpeDeepDiveView = lazy(() => import('../pumpen/UmwaelzpumpeDeepDiveView'));
const LazyMembrandosierpumpeDeepDiveView = lazy(() => import('../pumpen/MembrandosierpumpeDeepDiveView'));
const LazyClosedFilterDeepDiveView = lazy(() => import('../filter/ClosedFilterDeepDiveView'));
const LazyFilterSpuelungDeepDiveView = lazy(() => import('../filter/FilterSpuelungDeepDiveView'));
const LazyMathBasicsDeepDiveView = lazy(() => import('../mathematik/MathBasicsDeepDiveView'));
const LazyDreisatzDeepDiveView = lazy(() => import('../mathematik/DreisatzDeepDiveView'));
const LazyGrundrechenartenDeepDiveView = lazy(() => import('../mathematik/GrundrechenartenDeepDiveView'));
const LazyBruecheDeepDiveView = lazy(() => import('../mathematik/BruecheDeepDiveView'));
const LazyProzentDeepDiveView = lazy(() => import('../mathematik/ProzentDeepDiveView'));
const LazyFormelnDeepDiveView = lazy(() => import('../mathematik/FormelnDeepDiveView'));
const LazyPythagorasDeepDiveView = lazy(() => import('../mathematik/PythagorasDeepDiveView'));
const LazyFlaechenDeepDiveView = lazy(() => import('../mathematik/FlaechenDeepDiveView'));
const LazyVolumenDeepDiveView = lazy(() => import('../mathematik/VolumenDeepDiveView'));
const LazyZeitDeepDiveView = lazy(() => import('../mathematik/ZeitDeepDiveView'));
const LazyAuftriebDeepDiveView = lazy(() => import('../mathematik/AuftriebDeepDiveView'));
const LazyDruckDeepDiveView = lazy(() => import('../mathematik/DruckDeepDiveView'));
const LazyBewegungDeepDiveView = lazy(() => import('../mathematik/BewegungDeepDiveView'));
const LazyWaermeDeepDiveView = lazy(() => import('../mathematik/WaermeDeepDiveView'));
const LazyMechanikDeepDiveView = lazy(() => import('../mathematik/MechanikDeepDiveView'));
const LazyPumpenDeepDiveView = lazy(() => import('../mathematik/PumpenDeepDiveView'));
const LazyFiltrationDeepDiveView = lazy(() => import('../mathematik/FiltrationDeepDiveView'));
const LazyChlorDeepDiveView = lazy(() => import('../mathematik/ChlorDeepDiveView'));
const LazyFormelsammlungDeepDiveView = lazy(() => import('../mathematik/FormelsammlungDeepDiveView'));
const LazyMischrechnungDeepDiveView = lazy(() => import('../mathematik/MischrechnungDeepDiveView'));
const LazyVerdunstungDeepDiveView = lazy(() => import('../mathematik/VerdunstungDeepDiveView'));
const LazySchwallwasserDeepDiveView = lazy(() => import('../mathematik/SchwallwasserDeepDiveView'));
const LazyChemicalFormulasDeepDiveView = lazy(() => import('../chemie/ChemicalFormulasDeepDiveView'));
const LazyStoffnamenFormelnDeepDiveView = lazy(() => import('../chemie/StoffnamenFormelnDeepDiveView'));
const LazySaeurenBasenDeepDiveView = lazy(() => import('../chemie/SaeurenBasenDeepDiveView'));
const LazyRedoxDeepDiveView = lazy(() => import('../chemie/RedoxDeepDiveView'));
const LazySaeurekapazitaetDeepDiveView = lazy(() => import('../chemie/SaeurekapazitaetDeepDiveView'));
const LazyBeckenwasserdesinfektionDeepDiveView = lazy(() => import('../chemie/BeckenwasserdesinfektionDeepDiveView'));
const LazyElektrolyseDeepDiveView = lazy(() => import('../chemie/ElektrolyseDeepDiveView'));
const LazyKorrosionDeepDiveView = lazy(() => import('../chemie/KorrosionDeepDiveView'));
const LazyElektrolyseAnlageDeepDiveView = lazy(() => import('../chemie/ElektrolyseAnlageDeepDiveView'));
const LazyLungeAtmungDeepDiveView = lazy(() => import('../health/LungeAtmungDeepDiveView'));
const LazyZellatmungDeepDiveView = lazy(() => import('../health/ZellatmungDeepDiveView'));
const LazyMuskulaturDeepDiveView = lazy(() => import('../health/MuskulaturDeepDiveView'));
const LazyNervensystemDeepDiveView = lazy(() => import('../health/NervensystemDeepDiveView'));
const LazyBlutDeepDiveView = lazy(() => import('../health/BlutDeepDiveView'));
const LazyHlwAedDeepDiveView = lazy(() => import('../health/HlwAedDeepDiveView'));
const LazyBewusstseinAtmungDeepDiveView = lazy(() => import('../health/BewusstseinAtmungDeepDiveView'));
const LazyStabileSeitenlageDeepDiveView = lazy(() => import('../health/StabileSeitenlageDeepDiveView'));
const LazyBadeunfallDeepDiveView = lazy(() => import('../health/BadeunfallDeepDiveView'));
const LazyAnaphylaxieDeepDiveView = lazy(() => import('../health/AnaphylaxieDeepDiveView'));
const LazyHypoglykaemieDeepDiveView = lazy(() => import('../health/HypoglykaemieDeepDiveView'));
const LazySchockDeepDiveView = lazy(() => import('../health/SchockDeepDiveView'));
const LazyVerbrennungenDeepDiveView = lazy(() => import('../health/VerbrennungenDeepDiveView'));
const LazyVergiftungenDeepDiveView = lazy(() => import('../health/VergiftungenDeepDiveView'));
const LazyWundversorgungDeepDiveView = lazy(() => import('../health/WundversorgungDeepDiveView'));
const LazyHyperventilationDeepDiveView = lazy(() => import('../health/HyperventilationDeepDiveView'));
const LazyHautDeepDiveView = lazy(() => import('../health/HautDeepDiveView'));
const LazySinnesorganeDeepDiveView = lazy(() => import('../health/SinnesorganeDeepDiveView'));
const LazyBeschilderungDeepDiveView = lazy(() => import('../hygiene/BeschilderungDeepDiveView'));
const LazyReinigungDesinfektionDeepDiveView = lazy(() => import('../hygiene/ReinigungDesinfektionDeepDiveView'));
const LazyGefahrstoffeDeepDiveView = lazy(() => import('../hygiene/GefahrstoffeDeepDiveView'));
const LazyLegionellenDeepDiveView = lazy(() => import('../hygiene/LegionellenDeepDiveView'));
const LazyPersonalhygieneDeepDiveView = lazy(() => import('../hygiene/PersonalhygieneDeepDiveView'));
const LazyLebensmittelhygieneDeepDiveView = lazy(() => import('../hygiene/LebensmittelhygieneDeepDiveView'));
const LazyStosschlorungDeepDiveView = lazy(() => import('../hygiene/StosschlorungDeepDiveView'));
const LazyStrafrechtBadVertieftDeepDiveView = lazy(() => import('../recht/StrafrechtBadVertieftDeepDiveView'));
const LazyNotwehrNothilfeDeepDiveView = lazy(() => import('../recht/NotwehrNothilfeDeepDiveView'));
const LazyPersonalfuehrungDeepDiveView = lazy(() => import('../recht/PersonalfuehrungDeepDiveView'));
const LazyRechtsnormenDeepDiveView = lazy(() => import('../recht/RechtsnormenDeepDiveView'));
const LazyBadevertagHausordnungDeepDiveView = lazy(() => import('../recht/BadevertagHausordnungDeepDiveView'));
const LazyAufsichtspflichtDeepDiveView = lazy(() => import('../recht/AufsichtspflichtDeepDiveView'));
const LazyGewaltenteilungDeepDiveView = lazy(() => import('../recht/GewaltenteilungDeepDiveView'));
const LazyStrafRechtBadDeepDiveView = lazy(() => import('../recht/StrafRechtBadDeepDiveView'));
const LazyJugendarbeitsschutzDeepDiveView = lazy(() => import('../recht/JugendarbeitsschutzDeepDiveView'));
const LazyMutterschutzDeepDiveView = lazy(() => import('../recht/MutterschutzDeepDiveView'));
const LazyKuendigungDeepDiveView = lazy(() => import('../recht/KuendigungDeepDiveView'));
const LazyKommunalpolitikDeepDiveView = lazy(() => import('../recht/KommunalpolitikDeepDiveView'));
const LazyGesellschaftsformenDeepDiveView = lazy(() => import('../recht/GesellschaftsformenDeepDiveView'));
const LazySozialversicherungDeepDiveView = lazy(() => import('../recht/SozialversicherungDeepDiveView'));
const LazyKostenmanagementDeepDiveView = lazy(() => import('../recht/KostenmanagementDeepDiveView'));
const LazyMarketingDeepDiveView = lazy(() => import('../recht/MarketingDeepDiveView'));
const LazyEnglishLessonView = lazy(() => import('../english/EnglishLessonView'));

const BACK = {
  baedertechnik: 'Bädertechnik',
  schwimmen: 'Schwimmen & Rettung',
  verwaltung: 'Verwaltung & Recht',
  bäderbetrieb: 'Bäderbetrieb',
  mathematik: 'Mathematik',
  chemie: 'Chemie-Grundlagen',
  hygiene: 'Hygiene & Sicherheit',
  gesundheit: 'Erste Hilfe & Gesundheitslehre',
  english: 'Englisch im Bäderalltag',
};

const englishLessonProps = (moduleId) => ({ lessonId: moduleId });

const heartProps = (moduleId) => ({
  initialTab: moduleId === 'blutkreislauf-gross-klein' ? 'kreislauf' : 'anatomie',
  initialScene: moduleId === 'blutkreislauf-gross-klein' ? 'circulation' : 'heart',
});

export const MODULE_REGISTRY = {
  'water-cycle': { Component: LazyWaterCycleView, backLabel: BACK.baedertechnik, loadingLabel: 'Wasserkreislauf-Simulation' },
  'feststoff-chloranlage-calciumhypochlorid': { Component: LazyCalciumHypochloriteDeepDiveView, backLabel: BACK.baedertechnik, loadingLabel: 'Feststoff-Chloranlage' },
  'startblock-startwand-bauliches': { Component: LazyStartblockDeepDiveView, backLabel: BACK.baedertechnik, loadingLabel: 'Startblock Deep Dive' },
  'pumpen': { Component: LazyUmwaelzpumpeDeepDiveView, backLabel: BACK.baedertechnik, loadingLabel: 'Umwälzpumpe Deep Dive' },
  'membrandosierpumpe': { Component: LazyMembrandosierpumpeDeepDiveView, backLabel: BACK.baedertechnik, loadingLabel: 'Membrandosierpumpe Deep Dive' },
  'geschlossener-filter': { Component: LazyClosedFilterDeepDiveView, backLabel: BACK.baedertechnik, loadingLabel: 'Geschlossener Filter Deep Dive' },
  'filterspuelung': { Component: LazyFilterSpuelungDeepDiveView, backLabel: BACK.baedertechnik, loadingLabel: 'Filterspuelung Deep Dive' },
  'beckenarten-einrichtungen': { Component: lazy(() => import('../technik/BeckenartenDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'Beckenarten' },
  'sprunganlagen': { Component: lazy(() => import('../technik/SprunganlagenDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'Sprunganlagen' },
  'hubboden': { Component: lazy(() => import('../technik/HubbodenDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'Hubboden' },
  'ein-auswinterung': { Component: lazy(() => import('../technik/EinAuswinterungDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'Ein- & Auswinterung' },
  'chemie-badewasser': { Component: lazy(() => import('../technik/ChemieBadewasserDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'Chemie Badewasser' },
  'anlagen-badewasseraufbereitung': { Component: lazy(() => import('../technik/AnlagenBadewasserDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'Anlagen Badewasseraufbereitung' },
  'mess-und-regeltechnik': { Component: lazy(() => import('../technik/MessRegeltechnikDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'Mess- und Regeltechnik' },
  'flockungsmittel': { Component: lazy(() => import('../technik/FlockungsmittelDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'Flockungsmittel' },
  'filtration-filtertechnik': { Component: lazy(() => import('../technik/FiltrationFiltertechnikDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'Filtration & Filtertechnik' },
  'desinfektionsverfahren': { Component: lazy(() => import('../technik/DesinfektionsverfahrenDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'Desinfektionsverfahren' },
  'chlorgasanlage-raum': { Component: lazy(() => import('../technik/ChlorGasanlageDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'Chlorgasanlage' },
  'uv-anlage': { Component: lazy(() => import('../technik/UvAnlageDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'UV-Anlage' },
  'heizung-lueftung': { Component: lazy(() => import('../technik/HeizungLueftungDeepDiveView')), backLabel: BACK.baedertechnik, loadingLabel: 'Heizung & Lüftung' },

  'schwimmtechniken': { Component: LazySchwimmtechnikenDeepDiveView, backLabel: BACK.schwimmen, loadingLabel: 'Schwimmtechniken' },
  'starts-wenden': { Component: LazyStartsWendenDeepDiveView, backLabel: BACK.schwimmen, loadingLabel: 'Starts & Wenden' },
  'rettungsgriffe': { Component: LazyRettungsriffeDeepDiveView, backLabel: BACK.schwimmen, loadingLabel: 'Rettungsgriffe' },
  'rettungsgeraete': { Component: LazyRettungsgeraeteDeepDiveView, backLabel: BACK.schwimmen, loadingLabel: 'Rettungsgeräte' },
  'rettungskette': { Component: LazyRettungsketteDeepDiveView, backLabel: BACK.schwimmen, loadingLabel: 'Rettungskette' },
  'wettkampf': { Component: LazyWettkampfDeepDiveView, backLabel: BACK.schwimmen, loadingLabel: 'Wettkampfschwimmen' },
  'rettungspruefung-fab': { Component: LazyRettungspruefungFabDeepDiveView, backLabel: BACK.schwimmen, loadingLabel: 'Rettungsschwimmer-Prüfung (FAB)', passDarkMode: true },

  'berufsrecht-basis': { Component: LazyBerufsrechtBasisDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Berufsrecht-Basis' },
  'pflichten-ag-an-ausbilder': { Component: LazyPflichtenAGANAusbilderDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'AG/AN/Ausbilder-Pflichten', passDarkMode: true },
  'dienstplanung-arbeitszeit': { Component: LazyDienstplanungArbeitszeitDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Dienstplanung & Arbeitszeit' },
  'kasse-abrechnung': { Component: LazyKasseAbrechnungDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Kasse & Abrechnung' },
  'datenschutz-oea': { Component: LazyDatenschutzOeaDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Datenschutz & Öffentlichkeitsarbeit' },
  'strafrecht-bad-vertieft': { Component: LazyStrafrechtBadVertieftDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Strafrecht', passDarkMode: true },
  'notwehr-nothilfe': { Component: LazyNotwehrNothilfeDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Notwehr & Nothilfe', passDarkMode: true },
  'personalfuehrung': { Component: LazyPersonalfuehrungDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Personalführung', passDarkMode: true },
  'rechtsnormen': { Component: LazyRechtsnormenDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Rechtsnormen', passDarkMode: true },
  'badevertrag-hausordnung': { Component: LazyBadevertagHausordnungDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Badevertrag', passDarkMode: true },
  'aufsichtspflicht': { Component: LazyAufsichtspflichtDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Aufsichtspflicht', passDarkMode: true },
  'gewaltenteilung': { Component: LazyGewaltenteilungDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Gewaltenteilung', passDarkMode: true },
  'strafrecht-bad': { Component: LazyStrafRechtBadDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Strafrecht', passDarkMode: true },
  'jugendarbeitsschutz': { Component: LazyJugendarbeitsschutzDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Jugendarbeitsschutz', passDarkMode: true },
  'mutterschutz': { Component: LazyMutterschutzDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Mutterschutz', passDarkMode: true },
  'kuendigung': { Component: LazyKuendigungDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Kündigung', passDarkMode: true },
  'kommunalpolitik': { Component: LazyKommunalpolitikDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Kommunalpolitik', passDarkMode: true },
  'gesellschaftsformen': { Component: LazyGesellschaftsformenDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Gesellschaftsformen', passDarkMode: true },
  'sozialversicherung': { Component: LazySozialversicherungDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Sozialversicherung', passDarkMode: true },
  'kostenmanagement': { Component: LazyKostenmanagementDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Kostenmanagement', passDarkMode: true },
  'marketing': { Component: LazyMarketingDeepDiveView, backLabel: BACK.verwaltung, loadingLabel: 'Marketing', passDarkMode: true },

  'aufsicht-grundriss': { Component: LazyAufsichtGrundrissDeepDiveView, backLabel: BACK.bäderbetrieb, loadingLabel: 'Aufsicht im Grundriss' },
  'verkehrssicherung': { Component: LazyVerkehrssicherungDeepDiveView, backLabel: BACK.bäderbetrieb, loadingLabel: 'Verkehrssicherungspflicht' },
  'betrieb-checklisten': { Component: LazyBetriebChecklistenDeepDiveView, backLabel: BACK.bäderbetrieb, loadingLabel: 'Betriebs-Checklisten' },
  'gaestekommunikation': { Component: LazyGaestekommunikationDeepDiveView, backLabel: BACK.bäderbetrieb, loadingLabel: 'Gästekommunikation' },

  'mathe-dreisatz': { Component: LazyDreisatzDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Dreisatz-Modul' },
  'mathe-grundrechenarten': { Component: LazyGrundrechenartenDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-brueche': { Component: LazyBruecheDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-prozent': { Component: LazyProzentDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-formeln': { Component: LazyFormelnDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-pythagoras': { Component: LazyPythagorasDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-flaechen': { Component: LazyFlaechenDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-volumen': { Component: LazyVolumenDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-zeit': { Component: LazyZeitDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-auftrieb': { Component: LazyAuftriebDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-druck': { Component: LazyDruckDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-bewegung': { Component: LazyBewegungDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-waerme': { Component: LazyWaermeDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-mechanik': { Component: LazyMechanikDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-pumpen': { Component: LazyPumpenDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-filtration': { Component: LazyFiltrationDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-chlor': { Component: LazyChlorDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-formelsammlung': { Component: LazyFormelsammlungDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mathematik-Modul' },
  'mathe-mischrechnung': { Component: LazyMischrechnungDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Mischrechnung & Frischwasser', passDarkMode: true },
  'mathe-verdunstung': { Component: LazyVerdunstungDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Verdunstung', passDarkMode: true },
  'mathe-schwallwasser': { Component: LazySchwallwasserDeepDiveView, backLabel: BACK.mathematik, loadingLabel: 'Schwallwasser & Zirkulation', passDarkMode: true },

  'chemische-formeln': { Component: LazyChemicalFormulasDeepDiveView, backLabel: BACK.chemie, loadingLabel: 'Chemie-Modul' },
  'stoffnamen-formeln': { Component: LazyStoffnamenFormelnDeepDiveView, backLabel: BACK.chemie, loadingLabel: 'Chemie-Modul' },
  'saeuren-basen-grundlagen': { Component: LazySaeurenBasenDeepDiveView, backLabel: BACK.chemie, loadingLabel: 'Chemie-Modul' },
  'redox-grundlagen': { Component: LazyRedoxDeepDiveView, backLabel: BACK.chemie, loadingLabel: 'Chemie-Modul' },
  'saeurekapazitaet': { Component: LazySaeurekapazitaetDeepDiveView, backLabel: BACK.chemie, loadingLabel: 'Chemie-Modul' },
  'beckenwasserdesinfektion': { Component: LazyBeckenwasserdesinfektionDeepDiveView, backLabel: BACK.chemie, loadingLabel: 'Chemie-Modul' },
  'elektrolyse': { Component: LazyElektrolyseDeepDiveView, backLabel: BACK.chemie, loadingLabel: 'Chemie-Modul' },
  'korrosion': { Component: LazyKorrosionDeepDiveView, backLabel: BACK.chemie, loadingLabel: 'Chemie-Modul' },
  'elektrolyse-3d': { Component: LazyElektrolyseAnlageDeepDiveView, backLabel: BACK.chemie, loadingLabel: 'Chemie-Modul' },

  'herz': { Component: LazyHeartDeepDiveThree, backLabel: BACK.gesundheit, loadingLabel: '3D-Herzmodell', buildProps: heartProps },
  'blutkreislauf-gross-klein': { Component: LazyHeartDeepDiveThree, backLabel: BACK.gesundheit, loadingLabel: '3D-Herzmodell', buildProps: heartProps },
  'lunge-atmung': { Component: LazyLungeAtmungDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Lunge & Atmung', passDarkMode: true },
  'zellatmung': { Component: LazyZellatmungDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Zellatmung', passDarkMode: true },
  'muskulatur': { Component: LazyMuskulaturDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Muskulatur', passDarkMode: true },
  'nervensystem': { Component: LazyNervensystemDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Nervensystem', passDarkMode: true },
  'blut': { Component: LazyBlutDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Blut', passDarkMode: true },
  'hlw-aed': { Component: LazyHlwAedDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'HLW & AED', passDarkMode: true },
  'bewusstsein-atmung': { Component: LazyBewusstseinAtmungDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Bewusstsein & Atmung', passDarkMode: true },
  'stabile-seitenlage': { Component: LazyStabileSeitenlageDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Stabile Seitenlage', passDarkMode: true },
  'badeunfall-erstversorgung': { Component: LazyBadeunfallDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Badeunfall-Erstversorgung', passDarkMode: true },
  'anaphylaxie': { Component: LazyAnaphylaxieDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Anaphylaxie', passDarkMode: true },
  'hypoglykaemie': { Component: LazyHypoglykaemieDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Hypoglykämie', passDarkMode: true },
  'schock': { Component: LazySchockDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Schock-Lagerung', passDarkMode: true },
  'verbrennungen': { Component: LazyVerbrennungenDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Verbrennungen', passDarkMode: true },
  'vergiftungen': { Component: LazyVergiftungenDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Vergiftungen', passDarkMode: true },
  'wundversorgung': { Component: LazyWundversorgungDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Wundversorgung & Druckverband', passDarkMode: true },
  'hyperventilation': { Component: LazyHyperventilationDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Hyperventilation', passDarkMode: true },
  'haut': { Component: LazyHautDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Die Haut', passDarkMode: true },
  'sinnesorgane': { Component: LazySinnesorganeDeepDiveView, backLabel: BACK.gesundheit, loadingLabel: 'Sinnesorgane', passDarkMode: true },

  'beschilderung-kennzeichnungen': { Component: LazyBeschilderungDeepDiveView, backLabel: BACK.hygiene, loadingLabel: 'Beschilderung & Kennzeichnungen' },
  'reinigung-desinfektion': { Component: LazyReinigungDesinfektionDeepDiveView, backLabel: BACK.hygiene, loadingLabel: 'Reinigung & Desinfektion' },
  'gefahrstoffe': { Component: LazyGefahrstoffeDeepDiveView, backLabel: BACK.hygiene, loadingLabel: 'Gefahrstoffe' },
  'legionellen-trinkwv': { Component: LazyLegionellenDeepDiveView, backLabel: BACK.hygiene, loadingLabel: 'Legionellen & TrinkwV', passDarkMode: true },
  'personalhygiene': { Component: LazyPersonalhygieneDeepDiveView, backLabel: BACK.hygiene, loadingLabel: 'Personalhygiene', passDarkMode: true },
  'lebensmittelhygiene': { Component: LazyLebensmittelhygieneDeepDiveView, backLabel: BACK.hygiene, loadingLabel: 'Lebensmittelhygiene', passDarkMode: true },
  'stosschlorung': { Component: LazyStosschlorungDeepDiveView, backLabel: BACK.hygiene, loadingLabel: 'Stoßchlorung', passDarkMode: true },

  'english-a1-alphabet': { Component: LazyEnglishLessonView, backLabel: BACK.english, loadingLabel: 'English Lesson', passDarkMode: true, buildProps: englishLessonProps },
  'english-a1-numbers-time': { Component: LazyEnglishLessonView, backLabel: BACK.english, loadingLabel: 'English Lesson', passDarkMode: true, buildProps: englishLessonProps },
  'english-a1-greetings': { Component: LazyEnglishLessonView, backLabel: BACK.english, loadingLabel: 'English Lesson', passDarkMode: true, buildProps: englishLessonProps },
  'english-a1-pool-basics': { Component: LazyEnglishLessonView, backLabel: BACK.english, loadingLabel: 'English Lesson', passDarkMode: true, buildProps: englishLessonProps },
  'english-a2-guests': { Component: LazyEnglishLessonView, backLabel: BACK.english, loadingLabel: 'English Lesson', passDarkMode: true, buildProps: englishLessonProps },
  'english-a2-directions': { Component: LazyEnglishLessonView, backLabel: BACK.english, loadingLabel: 'English Lesson', passDarkMode: true, buildProps: englishLessonProps },
  'english-a2-rules': { Component: LazyEnglishLessonView, backLabel: BACK.english, loadingLabel: 'English Lesson', passDarkMode: true, buildProps: englishLessonProps },
  'english-b1-first-aid': { Component: LazyEnglishLessonView, backLabel: BACK.english, loadingLabel: 'English Lesson', passDarkMode: true, buildProps: englishLessonProps },
  'english-b1-complaints': { Component: LazyEnglishLessonView, backLabel: BACK.english, loadingLabel: 'English Lesson', passDarkMode: true, buildProps: englishLessonProps },
  'english-b1-tech-chemistry': { Component: LazyEnglishLessonView, backLabel: BACK.english, loadingLabel: 'English Lesson', passDarkMode: true, buildProps: englishLessonProps },
};

// Math basics module is referenced from the "mathe-grundrechenarten" fallback; keep for future use
export { LazyMathBasicsDeepDiveView };
