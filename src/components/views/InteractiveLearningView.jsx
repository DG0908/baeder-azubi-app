import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ModuleRenderer from './interactiveLearning/ModuleRenderer';
import CategoryDetailView from './interactiveLearning/CategoryDetailView';
import LearningHub from './interactiveLearning/LearningHub';

const InteractiveLearningView = () => {
  const { darkMode } = useApp();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeModule, setActiveModule] = useState(null);

  if (activeModule) {
    return (
      <ModuleRenderer
        activeModule={activeModule}
        darkMode={darkMode}
        onBack={() => setActiveModule(null)}
      />
    );
  }

  if (activeCategory) {
    return (
      <CategoryDetailView
        categoryId={activeCategory}
        darkMode={darkMode}
        onBack={() => setActiveCategory(null)}
        onSelectModule={setActiveModule}
      />
    );
  }

  return <LearningHub darkMode={darkMode} onSelectCategory={setActiveCategory} />;
};

export default InteractiveLearningView;
