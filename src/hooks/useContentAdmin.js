import { useState } from 'react';
import {
  addMaterialEntry as dsAddMaterial,
  addResourceEntry as dsAddResource,
  deleteResourceEntry as dsDeleteResource,
  addNewsEntry as dsAddNews,
  deleteNewsEntry as dsDeleteNews,
  addExamEntry as dsAddExam,
  deleteExamEntry as dsDeleteExam,
} from '../lib/dataService';
import { friendlyError } from '../lib/friendlyError';
import { toast } from 'react-hot-toast';

export function useContentAdmin({ user, showToast, playSound, moderateContent, sendNotificationToApprovedUsers }) {
  const [materials, setMaterials] = useState([]);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialCategory, setMaterialCategory] = useState('org');

  const [resources, setResources] = useState([]);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceType, setResourceType] = useState('youtube');
  const [resourceDescription, setResourceDescription] = useState('');

  const [news, setNews] = useState([]);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');

  const [exams, setExams] = useState([]);
  const [examTitle, setExamTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTopics, setExamTopics] = useState('');

  const addMaterial = async () => {
    if (!materialTitle.trim() || !user?.permissions.canUploadMaterials) return;

    try {
      const mat = await dsAddMaterial({
        title: materialTitle,
        category: materialCategory,
        createdBy: user.name,
      });
      setMaterials((prev) => [...prev, mat]);
      setMaterialTitle('');
      showToast('Material hinzugefügt!', 'success');
    } catch (error) {
      console.error('Material error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const addResource = async () => {
    if (!resourceTitle.trim() || !resourceUrl.trim()) return;

    if (user.role !== 'admin') {
      showToast('Nur Administratoren können Ressourcen hinzufügen', 'warning');
      return;
    }

    if (!moderateContent(resourceTitle, 'Titel')) return;
    if (resourceDescription && !moderateContent(resourceDescription, 'Beschreibung')) return;
    if (!moderateContent(resourceUrl, 'URL')) return;

    try {
      new URL(resourceUrl);
    } catch {
      showToast('Bitte gib eine gültige URL ein (mit https://)', 'warning');
      return;
    }

    try {
      const resource = await dsAddResource({
        title: resourceTitle,
        url: resourceUrl,
        category: resourceType,
        description: resourceDescription,
        createdBy: user.name,
      });
      setResources((prev) => [resource, ...prev]);
      setResourceTitle('');
      setResourceUrl('');
      setResourceDescription('');
      playSound('splash');
      showToast('Ressource hinzugefügt!', 'success');
    } catch (error) {
      console.error('Resource error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const deleteResource = async (resourceId) => {
    if (user.role !== 'admin') {
      showToast('Nur Administratoren können Ressourcen löschen', 'warning');
      return;
    }
    if (!confirm('Ressource wirklich löschen?')) return;
    try {
      await dsDeleteResource(resourceId);
      setResources((prev) => prev.filter((r) => r.id !== resourceId));
    } catch (error) {
      console.error('Delete resource error:', error);
    }
  };

  const addNews = async () => {
    if (!newsTitle.trim() || !user?.permissions.canPostNews) return;

    if (!moderateContent(newsTitle, 'News-Titel')) return;
    if (newsContent && !moderateContent(newsContent, 'News-Inhalt')) return;

    try {
      const newsItem = await dsAddNews({
        title: newsTitle.trim(),
        content: newsContent.trim(),
        author: user.name,
      });

      await sendNotificationToApprovedUsers({
        title: '📰 Neue News',
        message: `${user.name} hat eine neue News veroeffentlicht: "${newsItem.title}"`,
        type: 'news',
        excludeUserNames: [user.name],
      });

      setNews((prev) => [newsItem, ...prev]);
      setNewsTitle('');
      setNewsContent('');
    } catch (error) {
      console.error('News error:', error);
    }
  };

  const deleteNews = async (newsId) => {
    if (!user?.permissions.canPostNews) return;
    if (!confirm('Diese Ankündigung wirklich löschen?')) return;
    try {
      await dsDeleteNews(newsId);
      setNews((prev) => prev.filter((n) => n.id !== newsId));
    } catch (error) {
      console.error('Delete news error:', error);
      toast.error('Fehler beim Loeschen der Ankuendigung');
    }
  };

  const addExam = async () => {
    if (!examTitle.trim() || !user) return;

    try {
      const exam = await dsAddExam({
        title: examTitle,
        description: examTopics,
        examDate: examDate || null,
        createdBy: user.name,
      });

      const examDateLabel = exam.date
        ? new Date(exam.date).toLocaleDateString('de-DE')
        : 'ohne Termin';

      await sendNotificationToApprovedUsers({
        title: '📝 Neue Klausur',
        message: `${user.name} hat eine neue Klausur eingetragen: "${exam.title}" (${examDateLabel}).`,
        type: 'exam',
        excludeUserNames: [user.name],
      });

      setExams((prev) => [...prev, exam].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setExamTitle('');
      setExamDate('');
      setExamTopics('');
    } catch (error) {
      console.error('Exam error:', error);
    }
  };

  const deleteExam = async (examId) => {
    if (!examId) return;
    if (!confirm('Klausur wirklich löschen?')) return;
    try {
      await dsDeleteExam(examId);
      setExams((prev) => prev.filter((exam) => exam.id !== examId));
      showToast('Klausur gelöscht.', 'success');
    } catch (error) {
      console.error('Delete exam error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  return {
    materials, setMaterials,
    materialTitle, setMaterialTitle,
    materialCategory, setMaterialCategory,
    addMaterial,

    resources, setResources,
    resourceTitle, setResourceTitle,
    resourceUrl, setResourceUrl,
    resourceType, setResourceType,
    resourceDescription, setResourceDescription,
    addResource, deleteResource,

    news, setNews,
    newsTitle, setNewsTitle,
    newsContent, setNewsContent,
    addNews, deleteNews,

    exams, setExams,
    examTitle, setExamTitle,
    examDate, setExamDate,
    examTopics, setExamTopics,
    addExam, deleteExam,
  };
}
