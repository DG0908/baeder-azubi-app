import { MENU_GROUP_LABELS } from '../../data/constants';

export function MobileNav({
  darkMode, currentView, setCurrentView, playSound,
  showMehrDrawer, setShowMehrDrawer,
  appConfig, user, loadFlashcards, handleLogout,
}) {
  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden ${darkMode ? 'bg-slate-900/97 border-slate-700' : 'bg-white/97 border-gray-200'} border-t backdrop-blur-sm flex`}
           style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {[
          { id: 'home', icon: '🏠', label: 'Start' },
          { id: 'exam-simulator', icon: '📝', label: 'Prüfung' },
          { id: 'quiz', icon: '🎮', label: 'Quiz' },
          { id: 'berichtsheft', icon: '📖', label: 'Bericht' },
          { id: '__mehr', icon: '☰', label: 'Mehr' },
        ].map(tab => (
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
            className={`flex-1 flex flex-col items-center justify-center py-2 text-xs transition-all ${
              currentView === tab.id
                ? darkMode ? 'text-cyan-400' : 'text-cyan-600'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-xl leading-none mb-0.5">{tab.icon}</span>
            <span className="text-[10px]">{tab.label}</span>
            {tab.id !== '__mehr' && currentView === tab.id && (
              <div className={`w-1 h-1 rounded-full mt-0.5 ${darkMode ? 'bg-cyan-400' : 'bg-cyan-600'}`} />
            )}
          </button>
        ))}
      </div>

      {showMehrDrawer && (
        <div
          className="fixed inset-0 z-[100]"
          onClick={() => setShowMehrDrawer(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className={`absolute bottom-0 left-0 right-0 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-t-2xl max-h-[75vh] overflow-y-auto`}
            onClick={e => e.stopPropagation()}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Alle Menüpunkte</h3>
              <button onClick={() => setShowMehrDrawer(false)} className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>✕</button>
            </div>
            <div className="p-4 space-y-4">
              {Object.entries(MENU_GROUP_LABELS)
                .filter(([groupId]) => groupId !== 'home')
                .map(([groupId, groupLabel]) => {
                  const groupItems = [...appConfig.menuItems]
                    .filter(item => {
                      if (!item.visible) return false;
                      if ((item.group || 'lernen') !== groupId) return false;
                      if (item.requiresPermission) return user.permissions[item.requiresPermission];
                      return true;
                    })
                    .sort((a, b) => a.order - b.order);
                  if (groupItems.length === 0) return null;
                  return (
                    <div key={groupId}>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{groupLabel}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {groupItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setCurrentView(item.id);
                              playSound('splash');
                              setShowMehrDrawer(false);
                              if (item.id === 'flashcards') loadFlashcards();
                            }}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                              currentView === item.id
                                ? darkMode ? 'bg-cyan-900/50 text-cyan-400' : 'bg-cyan-50 text-cyan-600'
                                : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              <div className={`pt-2 border-t ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <button
                  onClick={() => {
                    setShowMehrDrawer(false);
                    handleLogout();
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    darkMode
                      ? 'bg-red-500/10 text-red-300 hover:bg-red-500/20'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <span className="text-lg">🚪</span>
                  <span className="font-medium">Abmelden</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
