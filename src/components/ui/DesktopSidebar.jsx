import { MENU_GROUP_LABELS } from '../../data/constants';
import { useFeatureContext } from '../../context/FeatureContext';

export function DesktopSidebar({
  darkMode, sidebarCollapsed,
  appConfig, user, currentView,
  setCurrentView, playSound, loadFlashcards, handleLogout,
}) {
  const { hasFeature } = useFeatureContext();
  return (
    <aside className={`hidden md:flex flex-col fixed top-0 left-0 h-full z-30 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-60'} ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} border-r shadow-lg`}>
      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} h-11 shrink-0 ${darkMode ? 'border-slate-700' : 'border-gray-200'} border-b`}>
        {!sidebarCollapsed && <span className={`font-bold text-sm ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Navigation</span>}
        {sidebarCollapsed && <span className="text-lg">🏊</span>}
      </div>
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {Object.entries(MENU_GROUP_LABELS).map(([groupId, groupLabel]) => {
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
            <div key={groupId} className={sidebarCollapsed ? 'mb-1' : 'mb-2'}>
              {!sidebarCollapsed && groupId !== 'home' && (
                <p className={`text-[10px] font-bold uppercase tracking-wider px-4 pt-3 pb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {groupLabel}
                </p>
              )}
              {sidebarCollapsed && groupId !== 'home' && (
                <div className={`mx-3 my-1 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`} />
              )}
              {groupItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentView(item.id); playSound('splash'); if (item.id === 'flashcards') loadFlashcards(); }}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 transition-all ${sidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-4 py-2'} ${
                    currentView === item.id
                      ? darkMode ? 'text-cyan-400 bg-cyan-400/10 border-r-3 border-cyan-400' : 'text-cyan-600 bg-cyan-50 border-r-3 border-cyan-600'
                      : darkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={sidebarCollapsed ? 'text-xl' : 'text-lg'}>{item.icon}</span>
                  {!sidebarCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
                </button>
              ))}
            </div>
          );
        })}
      </nav>
      <div className={`shrink-0 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} ${sidebarCollapsed ? 'p-2 space-y-1' : 'p-3 space-y-1'}`}>
        <button
          onClick={() => { setCurrentView('help'); playSound('splash'); }}
          className={`w-full flex items-center gap-3 ${sidebarCollapsed ? 'justify-center py-2' : 'px-3 py-2'} rounded-lg transition-colors ${
            currentView === 'help'
              ? darkMode ? 'text-cyan-400 bg-cyan-400/10' : 'text-cyan-600 bg-cyan-50'
              : darkMode ? 'text-gray-400 hover:text-cyan-300 hover:bg-slate-800' : 'text-gray-500 hover:text-cyan-600 hover:bg-cyan-50'
          }`}
          title={sidebarCollapsed ? 'Hilfe & Anleitung' : undefined}
        >
          <span className="text-lg">❓</span>
          {!sidebarCollapsed && <span className="text-sm font-medium">Hilfe & Anleitung</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 ${sidebarCollapsed ? 'justify-center py-2' : 'px-3 py-2'} rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-slate-800' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'}`}
          title={sidebarCollapsed ? 'Abmelden' : undefined}
        >
          <span className="text-lg">🚪</span>
          {!sidebarCollapsed && <span className="text-sm font-medium">Abmelden</span>}
        </button>
      </div>
    </aside>
  );
}
