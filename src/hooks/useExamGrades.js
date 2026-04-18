import { useState } from 'react';
import {
  loadExamGradesAzubis as dsLoadExamGradesAzubis,
  loadExamGradeEntries as dsLoadExamGrades,
  addExamGradeEntry as dsAddExamGrade,
  deleteExamGradeEntry as dsDeleteExamGrade,
  getAuthorizedReviewers as dsGetAuthorizedReviewers,
} from '../lib/dataService';
import { friendlyError } from '../lib/friendlyError';

export function useExamGrades({ user, showToast, sendNotification }) {
  const [examGrades, setExamGrades] = useState([]);
  const [selectedExamGradesUser, setSelectedExamGradesUser] = useState(null);
  const [allAzubisForExamGrades, setAllAzubisForExamGrades] = useState([]);

  const canViewAllExamGrades = () => {
    return user?.role === 'admin' || user?.canViewExamGrades;
  };

  const loadAzubisForExamGrades = async () => {
    if (!canViewAllExamGrades()) return;
    try {
      const data = await dsLoadExamGradesAzubis();
      setAllAzubisForExamGrades(data);
    } catch (err) {
      console.error('Fehler beim Laden der Azubis für Klasuren:', err);
    }
  };

  const loadExamGrades = async (targetUserId = null) => {
    if (!user) return;
    try {
      const userIdToLoad = targetUserId || selectedExamGradesUser?.id || user.id;
      const data = await dsLoadExamGrades(userIdToLoad);
      setExamGrades(data);
    } catch (err) {
      console.error('Fehler beim Laden der Klasuren:', err);
    }
  };

  const addExamGrade = async ({ date, subject, topic, grade, notes }) => {
    try {
      await dsAddExamGrade({
        userId: user.id, userName: user.name, date, subject, topic, grade, notes,
        user_id: user.id, user_name: user.name,
      });

      const authorizedUsers = await dsGetAuthorizedReviewers('can_view_exam_grades');
      for (const authUser of authorizedUsers) {
        if (authUser.id !== user.id && authUser.name) {
          await sendNotification(
            authUser.name,
            '📝 Neue Klasur eingetragen',
            `${user.name} hat eine ${subject}-Klasur vom ${new Date(date).toLocaleDateString('de-DE')} eingetragen: Note ${grade.toFixed(1).replace('.', ',')}`,
            'exam_grade'
          );
        }
      }

      showToast('Klasur gespeichert!', 'success');
      loadExamGrades();
    } catch (err) {
      console.error('Fehler beim Speichern der Klasur:', err);
      showToast(friendlyError(err), 'error');
    }
  };

  const deleteExamGrade = async (id) => {
    if (!confirm('Klasur wirklich löschen?')) return;
    try {
      await dsDeleteExamGrade(id);
      showToast('Klasur gelöscht', 'success');
      loadExamGrades();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
      showToast(friendlyError(err), 'error');
    }
  };

  return {
    examGrades, setExamGrades,
    selectedExamGradesUser, setSelectedExamGradesUser,
    allAzubisForExamGrades,
    canViewAllExamGrades,
    loadAzubisForExamGrades,
    loadExamGrades,
    addExamGrade,
    deleteExamGrade,
  };
}
