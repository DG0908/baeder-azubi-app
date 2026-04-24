import { useState } from 'react';
import { BookOpen, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/constants';
import { WORKSHEETS } from '../../data/worksheets';
import WorksheetPlayer from '../worksheets/WorksheetPlayer';

const groupByCategory = (worksheets) => {
  const map = new Map();
  worksheets.forEach((worksheet) => {
    const bucket = map.get(worksheet.category) || [];
    bucket.push(worksheet);
    map.set(worksheet.category, bucket);
  });
  return map;
};

const WorksheetCard = ({ worksheet, category, onSelect, darkMode }) => (
  <button
    onClick={() => onSelect(worksheet.id)}
    className="glass-card glass-card-hover rounded-2xl p-4 text-left group w-full"
  >
    <div className="flex items-start gap-3">
      <div className={`${category.color} text-white w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
        <span aria-hidden>{worksheet.icon || category.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {worksheet.title}
        </h4>
        {worksheet.subtitle && (
          <p className={`text-sm mt-0.5 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {worksheet.subtitle}
          </p>
        )}
        <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {worksheet.estimatedMinutes ? `~${worksheet.estimatedMinutes} Min · ` : ''}
          {worksheet.exercise.tasks.length} Aufgaben
        </div>
      </div>
      <ChevronRight className={`flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
    </div>
  </button>
);

const CategoryCard = ({ category, count, onSelect, darkMode }) => (
  <button
    onClick={() => onSelect(category.id)}
    className="glass-card glass-card-hover rounded-2xl p-5 text-left group w-full"
  >
    <div className="flex items-center gap-4">
      <div className={`${category.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0`}>
        <span aria-hidden>{category.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold text-lg truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {category.name}
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {count} {count === 1 ? 'Arbeitsblatt' : 'Arbeitsblätter'}
        </p>
      </div>
      <ChevronRight className={`flex-shrink-0 transition-transform group-hover:translate-x-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={22} />
    </div>
  </button>
);

const Hub = ({ sections, onSelectCategory, darkMode }) => (
  <div className="space-y-6">
    <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900' : 'bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500'} text-white rounded-2xl p-8 shadow-lg`}>
      <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <BookOpen size={32} />
        Interaktives Lexikon
      </h2>
      <p className="text-white/80">
        Lernblatt anschauen, Arbeitsblatt ausfüllen — sortiert nach Fach.
      </p>
    </div>

    {sections.length === 0 ? (
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-white/5' : 'bg-blue-50'}`}>
          <Sparkles size={36} className={darkMode ? 'text-blue-300' : 'text-blue-500'} />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Noch keine Arbeitsblätter
        </h3>
        <p className={`text-sm max-w-md mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Hier erscheinen bald interaktive Arbeitsblätter, sortiert nach Fach.
        </p>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 gap-3">
        {sections.map(({ category, worksheets }) => (
          <CategoryCard
            key={category.id}
            category={category}
            count={worksheets.length}
            onSelect={onSelectCategory}
            darkMode={darkMode}
          />
        ))}
      </div>
    )}
  </div>
);

const CategoryDetail = ({ category, worksheets, onSelectWorksheet, onBack, darkMode }) => (
  <div className="space-y-6">
    <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900' : 'bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500'} text-white rounded-2xl p-6 shadow-lg`}>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-white/80 hover:text-white text-sm mb-3"
      >
        <ArrowLeft size={16} />
        Zurück zur Fachübersicht
      </button>
      <div className="flex items-center gap-4">
        <div className={`${category.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
          <span aria-hidden>{category.icon}</span>
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl md:text-3xl font-bold truncate">{category.name}</h2>
          <p className="text-white/80 text-sm">
            {worksheets.length} {worksheets.length === 1 ? 'Arbeitsblatt' : 'Arbeitsblätter'}
          </p>
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-3">
      {worksheets.map((worksheet) => (
        <WorksheetCard
          key={worksheet.id}
          worksheet={worksheet}
          category={category}
          onSelect={onSelectWorksheet}
          darkMode={darkMode}
        />
      ))}
    </div>
  </div>
);

const MaterialsView = () => {
  const { darkMode } = useApp();
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeWorksheetId, setActiveWorksheetId] = useState(null);

  const activeWorksheet = activeWorksheetId ? WORKSHEETS.find((w) => w.id === activeWorksheetId) : null;
  if (activeWorksheet) {
    return (
      <WorksheetPlayer
        worksheet={activeWorksheet}
        onBack={() => setActiveWorksheetId(null)}
      />
    );
  }

  const grouped = groupByCategory(WORKSHEETS);
  const sections = CATEGORIES
    .map((category) => ({ category, worksheets: grouped.get(category.id) || [] }))
    .filter((section) => section.worksheets.length > 0);

  const activeCategory = activeCategoryId ? sections.find((s) => s.category.id === activeCategoryId) : null;
  if (activeCategory) {
    return (
      <CategoryDetail
        category={activeCategory.category}
        worksheets={activeCategory.worksheets}
        onSelectWorksheet={setActiveWorksheetId}
        onBack={() => setActiveCategoryId(null)}
        darkMode={darkMode}
      />
    );
  }

  return (
    <Hub
      sections={sections}
      onSelectCategory={setActiveCategoryId}
      darkMode={darkMode}
    />
  );
};

export default MaterialsView;
