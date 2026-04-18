export function ToastStack({ toasts, setToasts }) {
  return (
    <>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm animate-slide-in ${
              toast.type === 'success' ? 'bg-green-500/90 text-white'
                : toast.type === 'error' ? 'bg-red-500/90 text-white'
                  : toast.type === 'warning' ? 'bg-yellow-500/90 text-white'
                    : 'bg-blue-500/90 text-white'
            }`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <span className="text-xl">{toast.icon}</span>
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-2 opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
