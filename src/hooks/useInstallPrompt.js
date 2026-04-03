import { useState, useEffect } from 'react';

const DISMISSED_KEY = 'pwa_install_dismissed';

export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(
    () => !!localStorage.getItem(DISMISSED_KEY)
  );

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Verstecke Banner sobald App installiert wird
  useEffect(() => {
    const handler = () => setInstallPrompt(null);
    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setIsDismissed(true);
  };

  const showBanner = !!installPrompt && !isDismissed;

  return { showBanner, triggerInstall, dismiss };
}
