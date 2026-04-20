import toast from 'react-hot-toast';
import { PlusCircle, Plus, Info } from 'lucide-react';
import { CATEGORIES } from '../../../data/constants';
import { createFlashcardEntry as dsCreateFlashcardEntry } from '../../../lib/dataService';
import { glassCard, sectionAccent, inputClass, selectClass } from './flashcardUi';

const FlashcardCreateForm = ({
  darkMode,
  user,
  playSound,
  newFlashcardCategory,
  setNewFlashcardCategory,
  newFlashcardFront,
  setNewFlashcardFront,
  newFlashcardBack,
  setNewFlashcardBack,
  setUserFlashcards,
  setPendingFlashcards,
  moderateContent,
  queueXpAward,
  XP_REWARDS,
}) => {
  const handleCreate = async () => {
    if (!newFlashcardFront.trim() || !newFlashcardBack.trim()) {
      toast.error('Bitte Vorder- und Rueckseite ausfuellen!');
      return;
    }

    if (!moderateContent(newFlashcardFront, 'Vorderseite')) return;
    if (!moderateContent(newFlashcardBack, 'Rueckseite')) return;

    try {
      const flashcard = await dsCreateFlashcardEntry({
        userId: user.id,
        createdBy: user.name,
        category: newFlashcardCategory,
        question: newFlashcardFront.trim(),
        answer: newFlashcardBack.trim(),
        approved: user.permissions.canApproveQuestions,
      });

      if (flashcard.approved) {
        setUserFlashcards((current) => [...current, flashcard]);
        toast.success('Karteikarte hinzugefuegt!');
      } else {
        setPendingFlashcards((current) => [...current, flashcard]);
        toast.success('Karteikarte eingereicht! Wird nach Pruefung freigeschaltet.');
      }

      void queueXpAward('flashcardCreation', XP_REWARDS.FLASHCARD_CREATE, {
        eventKey: `flashcard_create_${flashcard.id}`,
        reason: 'Karteikarte erstellt',
        showXpToast: true,
      });

      setNewFlashcardFront('');
      setNewFlashcardBack('');
      playSound('splash');
    } catch (error) {
      console.error('Flashcard error:', error);
      toast.error('Fehler beim Erstellen der Karteikarte');
    }
  };

  return (
    <div className={glassCard}>
      <div className={sectionAccent('from-purple-500 via-pink-500 to-rose-500')} />
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <PlusCircle size={20} className={darkMode ? 'text-pink-300' : 'text-pink-600'} />
        Neue Karteikarte erstellen
      </h3>
      <div className="space-y-3">
        <select
          value={newFlashcardCategory}
          onChange={(e) => setNewFlashcardCategory(e.target.value)}
          className={selectClass(darkMode)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Vorderseite (Frage):
          </label>
          <textarea
            value={newFlashcardFront}
            onChange={(e) => setNewFlashcardFront(e.target.value)}
            placeholder="z.B. Was ist der optimale pH-Wert?"
            rows="2"
            className={inputClass(darkMode)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Rueckseite (Antwort):
          </label>
          <textarea
            value={newFlashcardBack}
            onChange={(e) => setNewFlashcardBack(e.target.value)}
            placeholder="z.B. 7,0 - 7,4 (neutral bis leicht basisch)"
            rows="3"
            className={inputClass(darkMode)}
          />
        </div>

        <button
          onClick={handleCreate}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={18} />
          Karteikarte erstellen
        </button>

        {!user.permissions.canApproveQuestions && (
          <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
            <Info size={12} />
            Deine Karteikarte wird nach Pruefung durch einen Trainer freigeschaltet
          </p>
        )}
      </div>
    </div>
  );
};

export default FlashcardCreateForm;
