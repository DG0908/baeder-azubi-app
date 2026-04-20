import { ShieldCheck, Check, X, Inbox } from 'lucide-react';
import { CATEGORIES } from '../../../data/constants';
import { glassCard, sectionAccent, subtleBoxClass } from './flashcardUi';

const FlashcardPendingApprovals = ({
  darkMode,
  pendingFlashcards,
  approveFlashcard,
  deleteFlashcard,
}) => (
  <div className={glassCard}>
    <div className={sectionAccent('from-amber-500 via-orange-500 to-rose-500')} />
    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
      <ShieldCheck size={20} className={darkMode ? 'text-amber-300' : 'text-amber-600'} />
      Wartende Karteikarten genehmigen
    </h3>
    {pendingFlashcards.length > 0 ? (
      <div className="space-y-3">
        {pendingFlashcards.map((fc) => {
          const cat = CATEGORIES.find((c) => c.id === fc.category);
          return (
            <div key={fc.id} className={subtleBoxClass(darkMode)}>
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <span
                  className={`${cat?.color || 'bg-gray-400'} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                >
                  {cat?.icon} {cat?.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveFlashcard(fc.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 transition-all"
                  >
                    <Check size={14} />
                    Genehmigen
                  </button>
                  <button
                    onClick={() => deleteFlashcard(fc.id)}
                    className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 transition-all"
                  >
                    <X size={14} />
                    Ablehnen
                  </button>
                </div>
              </div>
              <div
                className={`rounded-lg p-3 mb-2 ${
                  darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-gray-200'
                }`}
              >
                <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                  Vorderseite:
                </p>
                <p className="text-sm text-gray-800">{fc.front}</p>
              </div>
              <div
                className={`rounded-lg p-3 ${
                  darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-gray-200'
                }`}
              >
                <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Rueckseite:
                </p>
                <p className="text-sm text-gray-800">{fc.back}</p>
              </div>
              <p className="text-xs mt-2 text-gray-500">
                Von {fc.createdBy} - {new Date(fc.time).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-6 text-gray-500">
        <Inbox size={32} className="mb-2 opacity-60" />
        <p className="text-sm">Keine wartenden Karteikarten</p>
      </div>
    )}
  </div>
);

export default FlashcardPendingApprovals;
