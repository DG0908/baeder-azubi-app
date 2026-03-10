import { useApp } from '../../../context/AppContext';
import CrawlLearningModule from '../../../features/swimLearning/CrawlLearningModule';

export default function CrawlTechniqueDeepDiveThree() {
  const { darkMode } = useApp();
  return <CrawlLearningModule darkMode={darkMode} />;
}
