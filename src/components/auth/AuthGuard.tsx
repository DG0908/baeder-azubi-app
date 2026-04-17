import React, { type ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInactivityTimeout } from '../../hooks/useInactivityTimeout';
import LoginScreen from './LoginScreen';

const SplashScreen: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center" style={{
    background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
  }}>
    <div className="text-8xl mb-6 animate-bounce">🏊‍♂️</div>
    <h1 className="text-white text-2xl font-bold mb-2">Bäder-Azubi App</h1>
    <p className="text-white/70 text-sm mb-8">Wird geladen...</p>
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 bg-white/80 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
);

const InactivityWarning: React.FC = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 text-center">
      <div className="text-5xl mb-3">⏱️</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Noch da?</h2>
      <p className="text-gray-600 mb-5 text-sm">
        Du wirst in <strong>2 Minuten</strong> automatisch abgemeldet.
      </p>
      <button
        onClick={() => window.dispatchEvent(new MouseEvent('mousemove'))}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Aktiv bleiben
      </button>
    </div>
  </div>
);

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const auth = useAuth();
  const { authReady, user, handleLogout } = auth!;
  const [showInactivityWarning, setShowInactivityWarning] = React.useState(false);

  useInactivityTimeout({
    enabled: !!user,
    onWarn: () => setShowInactivityWarning(true),
    onDismissWarn: () => setShowInactivityWarning(false),
    onLogout: handleLogout,
  });

  if (!authReady) return <SplashScreen />;
  if (!user) return <LoginScreen />;

  return (
    <>
      {showInactivityWarning && <InactivityWarning />}
      {children}
    </>
  );
};

export default AuthGuard;
