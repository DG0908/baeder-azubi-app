import { Home, FileCheck, Gamepad2, BookOpen, Menu, X, LogOut, HelpCircle } from 'lucide-react';
import { MENU_GROUP_LABELS } from '../../data/constants';
import { useFeatureContext } from '../../context/FeatureContext';

const NAV_TABS = [
  { id: 'home', Icon: Home, label: 'Start', gradient: 'from-cyan-400 to-sky-500' },
  { id: 'exam-simulator', Icon: FileCheck, label: 'Prüfung', gradient: 'from-indigo-400 to-purple-500' },
  { id: 'quiz', Icon: Gamepad2, label: 'Quiz', gradient: 'from-fuchsia-400 to-pink-500' },
  { id: 'berichtsheft', Icon: BookOpen, label: 'Bericht', gradient: 'from-emerald-400 to-teal-500' },
  { id: '__mehr', Icon: Menu, label: 'Mehr', gradient: 'from-amber-400 to-orange-500' },
];

export function MobileNav({
  darkMode, currentView, setCurrentView, playSound,
  showMehrDrawer, setShowMehrDrawer,
  appConfig, user, loadFlashcards, handleLogout,
}) {
  const { hasFeature } = useFeatureContext();
  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden border-t backdrop-blur-xl flex ${
          darkMode
            ? 'bg-slate-900/80 border-white/10'
            : 'bg-white/80 border-gray-200/80'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV_TABS.filter((tab) => tab.id === '__mehr' || hasFeature(tab.id)).map((tab) => {
          const isActive = currentView === tab.id;
          const { Icon } = tab;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === '__mehr') {
                  setShowMehrDrawer(true);
                } else {
                  setCurrentView(tab.id);
                  playSound('splash');
                }
              }}
              className="flex-1 relative flex flex-col items-center justify-center py-2 text-xs transition-all"
            >
              {isActive && tab.id !== '__mehr' && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-gradient-to-r ${tab.gradient}`} />
              )}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-0.5 transition-all ${
                  isActive
                    ? `bg-gradient-to-br ${tab.gradient} shadow-md shadow-cyan-500/20`
                    : darkMode
                      ? 'bg-transparent'
                      : 'bg-transparent'
                }`}
              >
                <Icon
                  size={18}
                  className={
                    isActive
                      ? 'text-white'
                      : darkMode
                        ? 'text-slate-300'
                        : 'text-gray-500'
                  }
                />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive
                    ? darkMode ? 'text-cyan-300' : 'text-cyan-700'
                    : darkMode ? 'text-slate-400' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {showMehrDrawer && (
        <div
          className="fixed inset-0 z-[100]"
          onClick={() => setShowMehrDrawer(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className={`absolute bottom-0 left-0 right-0 rounded-t-3xl max-h-[75vh] overflow-y-auto backdrop-blur-xl border-t ${
              darkMode
                ? 'bg-slate-900/95 border-white/10'
                : 'bg-white/95 border-gray-200/80'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 rounded-t-3xl" />
            <div className="flex justify-center pt-2 pb-1">
              <div className={`w-10 h-1 rounded-full ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
            </div>
            <div className={`flex justify-between items-center px-4 pb-3 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Alle Menüpunkte</h3>
              <button
                onClick={() => setShowMehrDrawer(false)}
                className={`p-2 rounded-xl transition-colors ${
                  darkMode ? 'text-slate-300 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="Schließen"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {Object.entries(MENU_GROUP_LABELS)
                .filter(([groupId]) => groupId !== 'home')
                .map(([groupId, groupLabel]) => {
                  const groupItems = [...appConfig.menuItems]
                    .filter((item) => {
                      if (!item.visible) return false;
                      if ((item.group || 'lernen') !== groupId) return false;
                      if (item.requiresPermission && !user.permissions[item.requiresPermission]) return false;
                      if (!hasFeature(item.id)) return false;
                      return true;
                    })
                    .sort((a, b) => a.order - b.order);
                  if (groupItems.length === 0) return null;
                  return (
                    <div key={groupId}>
                      <p className={`text-[11px] font-mono tracking-wider uppercase mb-2 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                        {groupLabel}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {groupItems.map((item) => {
                          const active = currentView === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setCurrentView(item.id);
                                playSound('splash');
                                setShowMehrDrawer(false);
                                if (item.id === 'flashcards') loadFlashcards();
                              }}
                              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                                active
                                  ? darkMode
                                    ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200'
                                    : 'bg-cyan-50 border-cyan-300 text-cyan-700'
                                  : darkMode
                                    ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                    : 'bg-white/70 border-gray-200 text-gray-700 hover:bg-white'
                              }`}
                            >
                              <span className="text-2xl">{item.icon}</span>
                              <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              <div className={`pt-3 border-t space-y-2 ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                <button
                  onClick={() => {
                    setCurrentView('help');
                    playSound('splash');
                    setShowMehrDrawer(false);
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-colors ${
                    darkMode
                      ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-200 hover:bg-cyan-500/20'
                      : 'bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100'
                  }`}
                >
                  <HelpCircle size={18} />
                  <span className="font-semibold">Hilfe & Anleitung</span>
                </button>
                <button
                  onClick={() => {
                    setShowMehrDrawer(false);
                    handleLogout();
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-colors ${
                    darkMode
                      ? 'bg-red-500/10 border-red-400/30 text-red-200 hover:bg-red-500/20'
                      : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <LogOut size={18} />
                  <span className="font-semibold">Abmelden</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
