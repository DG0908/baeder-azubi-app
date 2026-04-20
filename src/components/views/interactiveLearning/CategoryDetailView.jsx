import { ArrowLeft, ChevronRight, Clock, Lock } from 'lucide-react';
import { LEARNING_CATEGORIES } from './learningCategories';
import { backButtonClass, glassCard, sectionAccent, moduleButtonClass } from './interactiveLearningUi';

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

const CategoryDetailView = ({ categoryId, darkMode, onBack, onSelectModule }) => {
  const cat = LEARNING_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return null;

  const LIcon = cat.lucideIcon;
  const gradient = CATEGORY_GRADIENT[cat.id] || 'from-cyan-500 via-sky-500 to-blue-500';

  return (
    <div className="space-y-4">
      <button onClick={onBack} className={backButtonClass(darkMode)}>
        <ArrowLeft size={16} />
        Alle Bereiche
      </button>

      <div className={glassCard}>
        <div className={sectionAccent(gradient)} />
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: cat.colorLight }}
          >
            <LIcon size={26} style={{ color: cat.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {cat.name}
            </h2>
            <p className={`text-xs font-mono mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              {cat.paragraphs}
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {cat.longDescription}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-xs font-mono tracking-wider mb-3 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
          LERNMODULE
        </h3>

        {cat.modules.length > 0 ? (
          <div className="space-y-3">
            {cat.modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => mod.available && onSelectModule(mod.id)}
                disabled={!mod.available}
                className={moduleButtonClass(mod.available, darkMode)}
              >
                <div className={sectionAccent(gradient)} />
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                    style={{ background: cat.colorLight }}
                  >
                    {mod.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
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
                    <p className={`text-xs mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                      {mod.description}
                    </p>
                  </div>
                  {mod.available && (
                    <ChevronRight size={18} className={darkMode ? 'text-cyan-300' : 'text-cyan-600'} />
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className={`${glassCard} text-center`}>
            <div className={sectionAccent('from-slate-400 via-slate-500 to-slate-600')} />
            <Lock size={32} className={`mx-auto mb-3 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
            <p className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
              Module werden gerade entwickelt
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Interaktive Lernmodule für diesen Bereich kommen bald.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailView;
