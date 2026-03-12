import { Suspense, lazy, useState } from 'react';
import { ArrowLeft, BookOpen, ChevronRight, Clock, Droplets, FlaskConical, Heart, Lock, ShieldCheck, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const LazyWaterCycleView = lazy(() => import('./WaterCycleView'));
const LazyHeartDeepDiveThree = lazy(() => import('./health/HeartDeepDiveThree'));
const LazyCrawlTechniqueDeepDiveThree = lazy(() => import('./swim/CrawlTechniqueDeepDiveThree'));
const LazyCalciumHypochloriteDeepDiveView = lazy(() => import('./chlorine/CalciumHypochloriteDeepDiveView'));

// ─── Learning categories based on Ausbildungsrahmenplan §3 FaBB ─────────────
const LEARNING_CATEGORIES = [
  {
    id: 'baedertechnik',
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
        description: 'Uebersicht zu Beckenformen, Ausstattung und Betriebseinrichtungen',
        icon: '🏗️',
        available: false,
      },
      {
        id: 'sprunganlagen',
        name: 'Sprunganlagen',
        description: 'Sprungturm, Bretter, Sicherheitsbereiche und Pruefpunkte',
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
        description: 'Pumpenarten, Betriebspunkte und typische Stoerungen',
        icon: '⚙️',
        available: false,
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
        description: 'Rueckspuelablauf, Fahrweisen und Hygienesicherung',
        icon: '🔄',
        available: false,
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
        description: 'Waermeuebertragung, Hallenklima und Entfeuchtung',
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
        description: 'Brust, Kraul, Ruecken und Delphin mit Technikschritten',
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
        description: 'Erkennen, alarmieren, bergen, uebergeben',
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
        description: 'Weg des Blutes durch Koerper- und Lungenkreislauf',
        icon: '🩸',
        available: true,
      },
      {
        id: 'hyperventilation',
        name: 'Hyperventilation',
        description: 'Ursachen, Symptome und Erstmaßnahmen im Badebetrieb',
        icon: '🌬️',
        available: false,
      },
      {
        id: 'haut',
        name: 'Die Haut',
        description: 'Schutzfunktion, Aufbau und Relevanz in der Ersten Hilfe',
        icon: '🧍',
        available: false,
      },
      {
        id: 'sinnesorgane',
        name: 'Sinnesorgane',
        description: 'Auge, Ohr und weitere Sinne mit Bezug zu Badeunfaellen',
        icon: '👁️',
        available: false,
      },
      {
        id: 'hlw-aed',
        name: 'HLW & AED',
        description: 'Algorithmus 30:2, Defibrillator und Teamablauf',
        icon: '❤️',
        available: false,
      },
      {
        id: 'bewusstsein-atmung',
        name: 'Bewusstsein & Atmung',
        description: 'Ansprechen, Atemkontrolle und Entscheidungspfade',
        icon: '🫁',
        available: false,
      },
      {
        id: 'stabile-seitenlage',
        name: 'Stabile Seitenlage',
        description: 'Sichere Lagerung und kontinuierliche Ueberwachung',
        icon: '🧍',
        available: false,
      },
      {
        id: 'badeunfall-erstversorgung',
        name: 'Badeunfall-Erstversorgung',
        description: 'Typische Notfallbilder im Bad und Erstmassnahmen',
        icon: '🚑',
        available: false,
      },
    ],
  },
  {
    id: 'baederbetrieb',
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
        description: 'Oeffnungs-, Schicht- und Schliessroutinen',
        icon: '📋',
        available: false,
      },
      {
        id: 'gaestekommunikation',
        name: 'Gaestekommunikation',
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
        available: false,
      },
      {
        id: 'reinigung-desinfektion',
        name: 'Reinigung & Desinfektion',
        description: 'Reinigungsplaene, Verfahren, Kontaktzeiten und Kontrollen',
        icon: '🧼',
        available: false,
      },
      {
        id: 'gefahrstoffe',
        name: 'Gefahrstoffe',
        description: 'Lagerung, Handhabung, Schutzmassnahmen und Notfallablauf',
        icon: '☣️',
        available: false,
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
        name: 'Datenschutz & Oeffentlichkeitsarbeit',
        description: 'DSGVO-Basics, Kommunikation und Medienarbeit',
        icon: '📣',
        available: false,
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
          Zurueck zu Baedertechnik
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
          Zurueck zu Schwimmen & Rettung
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

