import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useFeatureContext } from '../context/FeatureContext';

const VIEW_TO_PATH: Record<string, string> = {
  home: '/',
  quiz: '/quiz',
  stats: '/statistiken',
  chat: '/chat',
  forum: '/forum',
  materials: '/lernmaterial',
  'interactive-learning': '/interaktiv',
  'notfall-trainer': '/notfall-trainer',
  resources: '/ressourcen',
  news: '/neuigkeiten',
  exams: '/pruefungen',
  'exam-simulator': '/pruefungssimulator',
  flashcards: '/karteikarten',
  calculator: '/rechner',
  'trainer-dashboard': '/trainer',
  questions: '/fragen',
  'school-card': '/berufsschule',
  'swim-challenge': '/schwimm-challenge',
  berichtsheft: '/berichtsheft',
  profile: '/profil',
  collection: '/sammlung',
  admin: '/admin',
  impressum: '/impressum',
  datenschutz: '/datenschutz',
  agb: '/agb',
  'exam-grades': '/noten',
};

const PATH_TO_VIEW: Record<string, string> = Object.fromEntries(
  Object.entries(VIEW_TO_PATH).map(([view, path]) => [path, view])
);

export const useViewRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasFeature, isLoading } = useFeatureContext();

  const knownPath = PATH_TO_VIEW[location.pathname] !== undefined;

  const currentView = useMemo(() => {
    return PATH_TO_VIEW[location.pathname] || 'home';
  }, [location.pathname]);

  // Redirect unknown paths to home
  useEffect(() => {
    if (!knownPath && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [knownPath, location.pathname, navigate]);

  // Redirect when current view is feature-gated and user has no access.
  // Warten bis Feature-Map geladen ist, sonst blitzt der Toast waehrend Cold-Start.
  useEffect(() => {
    if (isLoading) return;
    if (currentView === 'home') return;
    if (hasFeature(currentView)) return;
    toast('Bereich aktuell nicht verfuegbar.', { icon: 'ℹ️' });
    navigate('/', { replace: true });
  }, [currentView, hasFeature, isLoading, navigate]);

  const setCurrentView = useCallback((viewId: string) => {
    if (viewId !== 'home' && !hasFeature(viewId)) {
      toast('Bereich aktuell nicht verfuegbar.', { icon: 'ℹ️' });
      navigate('/');
      return;
    }
    const path = VIEW_TO_PATH[viewId] || '/';
    navigate(path);
  }, [navigate, hasFeature]);

  return { currentView, setCurrentView };
};

export { VIEW_TO_PATH, PATH_TO_VIEW };
