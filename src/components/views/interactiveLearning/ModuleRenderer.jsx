import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MODULE_REGISTRY } from './moduleRegistry';
import { backButtonClass, suspenseFallbackClass } from './interactiveLearningUi';

const ModuleRenderer = ({ activeModule, darkMode, onBack }) => {
  const config = MODULE_REGISTRY[activeModule];
  if (!config) return null;

  const { Component, backLabel, loadingLabel, passDarkMode, buildProps } = config;

  const props = {
    ...(passDarkMode ? { darkMode } : {}),
    ...(buildProps ? buildProps(activeModule) : {}),
  };

  return (
    <div className="space-y-3">
      <button onClick={onBack} className={backButtonClass(darkMode)}>
        <ArrowLeft size={16} />
        Zurück zu {backLabel}
      </button>
      <Suspense
        fallback={(
          <div className={suspenseFallbackClass(darkMode)}>
            Lade {loadingLabel}...
          </div>
        )}
      >
        <Component {...props} />
      </Suspense>
    </div>
  );
};

export default ModuleRenderer;
