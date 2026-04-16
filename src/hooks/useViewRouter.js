import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Maps view IDs (used throughout the app) to URL paths.
 * This is the single source of truth for the view↔URL mapping.
 */
const VIEW_TO_PATH = {
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

const PATH_TO_VIEW = Object.fromEntries(
  Object.entries(VIEW_TO_PATH).map(([view, path]) => [path, view])
);

/**
 * Bridge hook: provides currentView / setCurrentView backed by React Router.
 *
 * Drop-in replacement — all existing code that reads `currentView` or
 * calls `setCurrentView('quiz')` keeps working unchanged, but now the
 * browser URL updates, back-button works, and deep-links are possible.
 */
export const useViewRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const setCurrentView = useCallback((viewId) => {
    const path = VIEW_TO_PATH[viewId] || '/';
    navigate(path);
  }, [navigate]);

  return { currentView, setCurrentView };
};

export { VIEW_TO_PATH, PATH_TO_VIEW };
