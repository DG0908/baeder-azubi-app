export function QuizMaintenanceView({ setCurrentView }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center"
         style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div className="text-7xl mb-6">🚧</div>
      <h1 className="text-2xl font-bold text-white mb-3">Am Quiz wird gearbeitet</h1>
      <p className="text-slate-400 max-w-sm mb-2">
        Wir verbessern das Quizduell gerade für euch.
      </p>
      <p className="text-slate-500 text-sm">Bitte bald wieder vorbeischauen!</p>
      <button
        onClick={() => setCurrentView('home')}
        className="mt-8 px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
      >
        Zurück zur Startseite
      </button>
    </div>
  );
}
