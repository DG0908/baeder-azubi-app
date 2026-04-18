export function NotificationsDropdown({
  show, darkMode, notifications,
  onClose, onClear, onMarkRead,
}) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999]" onClick={onClose}>
      <div
        className={`fixed right-4 top-16 w-96 max-w-[calc(100vw-2rem)] ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl max-h-96 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-cyan-50'}`}>
          <h3 className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>Benachrichtigungen</h3>
          {notifications.length > 0 && (
            <button
              onClick={onClear}
              className={`text-sm ${darkMode ? 'text-cyan-300 hover:text-cyan-100' : 'text-cyan-600 hover:text-cyan-800'}`}
            >
              Alle löschen
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Keine Benachrichtigungen</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkRead(notif.id)}
                className={`p-4 border-b cursor-pointer ${
                  darkMode
                    ? `hover:bg-slate-700 ${!notif.read ? 'bg-slate-700' : ''} border-slate-700`
                    : `hover:bg-cyan-50 ${!notif.read ? 'bg-cyan-50' : ''}`
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{notif.title}</p>
                  {!notif.read && (
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                  )}
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notif.message}</p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(notif.time).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
