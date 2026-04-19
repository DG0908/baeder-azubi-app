import { useFeatureContext } from '../context/FeatureContext';

/**
 * O(1)-Lookup-Hook fuer Feature-Gating im Frontend.
 * Unbekannte Keys liefern true (z.B. Legal-Pages wie 'impressum'),
 * damit View-Routes die nicht im Feature-System registriert sind
 * nicht versehentlich blockiert werden.
 */
export function useFeature(key: string): boolean {
  const { hasFeature } = useFeatureContext();
  return hasFeature(key);
}
