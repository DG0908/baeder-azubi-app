export function OfflineBanner({ isOnline }) {
  if (isOnline) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] bg-gray-800 text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
      <span>📡</span>
      <span>Keine Internetverbindung – Einige Funktionen sind nicht verfügbar</span>
    </div>
  );
}

export function InstallBanner({ show, onInstall, onDismiss }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-20 left-4 right-4 z-[9996] sm:left-auto sm:right-4 sm:w-80">
      <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-sky-100">
        <div className="text-3xl">📲</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">App installieren</p>
          <p className="text-xs text-gray-500">Schneller Zugriff ohne Browser</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={onInstall}
            className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Installieren
          </button>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 text-xs text-center transition-colors"
          >
            Nicht jetzt
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieNotice({ show, onAcknowledge, onShowPrivacy }) {
  if (!show) return null;
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9995] bg-gray-900/97 text-white px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <p className="text-xs text-gray-300 flex-1">
        🍪 Diese App verwendet ausschließlich technisch notwendige Cookies für die sichere Anmeldung.
        Kein Tracking, keine Werbung.{' '}
        <button
          onClick={onShowPrivacy}
          className="underline text-cyan-400 hover:text-cyan-300"
        >
          Mehr erfahren
        </button>
      </p>
      <button
        onClick={onAcknowledge}
        className="shrink-0 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
      >
        Verstanden
      </button>
    </div>
  );
}
