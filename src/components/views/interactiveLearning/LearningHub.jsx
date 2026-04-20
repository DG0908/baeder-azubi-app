import { ChevronRight, GraduationCap } from 'lucide-react';
import { LEARNING_CATEGORIES } from './learningCategories';
import { glassCard, sectionAccent } from './interactiveLearningUi';

const CATEGORY_GRADIENT = {
  'bädertechnik': 'from-purple-500 via-violet-500 to-fuchsia-500',
  'schwimmen': 'from-cyan-500 via-sky-500 to-blue-500',
  'erste-hilfe': 'from-red-500 via-rose-500 to-pink-500',
  'bäderbetrieb': 'from-fuchsia-500 via-purple-500 to-indigo-500',
  'hygiene': 'from-amber-400 via-yellow-400 to-orange-400',
  'mathematik': 'from-teal-500 via-emerald-500 to-green-500',
  'chemie': 'from-blue-500 via-indigo-500 to-violet-500',
  'verwaltung': 'from-emerald-500 via-teal-500 to-cyan-500',
};

const LearningHub = ({ darkMode, onSelectCategory }) => (
  <div className="space-y-5">
    <div className={glassCard}>
      <div className={sectionAccent('from-cyan-500 via-sky-500 to-blue-500')} />
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          darkMode ? 'bg-cyan-500/15' : 'bg-cyan-500/10'
        }`}>
          <GraduationCap size={24} className={darkMode ? 'text-cyan-300' : 'text-cyan-600'} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-mono tracking-wider mb-1 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
            AUSBILDUNGSRAHMENPLAN · §3 FaBB
          </div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Interaktives Lernen
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            Wähle einen Ausbildungsbereich und lerne interaktiv mit Simulationen, 3D-Modellen und Szenarien.
          </p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {LEARNING_CATEGORIES.map((cat) => {
        const availableCount = cat.modules.filter((m) => m.available).length;
        const totalCount = cat.modules.length;
        const LIcon = cat.lucideIcon;
        const gradient = CATEGORY_GRADIENT[cat.id] || 'from-cyan-500 via-sky-500 to-blue-500';

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`${glassCard} text-left transition-all group hover:-translate-y-0.5 hover:shadow-lg cursor-pointer`}
          >
            <div className={sectionAccent(gradient)} />
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
                      darkMode ? 'text-cyan-300' : 'text-cyan-600'
                    }`}
                  />
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  {cat.description}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`text-[10px] font-mono ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    {cat.paragraphs}
                  </span>
                  {availableCount > 0 ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {availableCount} Modul{availableCount !== 1 ? 'e' : ''}
                    </span>
                  ) : totalCount > 0 ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-400">
                      in Arbeit
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-400">
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

export default LearningHub;
