import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  loadSchoolAttendanceAzubis as dsLoadSchoolAttendanceAzubis,
  loadSchoolAttendance as dsLoadSchoolAttendance,
  addSchoolAttendanceEntry as dsAddSchoolAttendance,
  updateSchoolAttendanceSignature as dsUpdateAttendanceSignature,
  deleteSchoolAttendanceEntry as dsDeleteSchoolAttendance,
  getAuthorizedReviewers as dsGetAuthorizedReviewers,
} from '../lib/dataService';

export function useSchoolAttendance({ user, showToast, sendNotification }) {
  const [schoolAttendance, setSchoolAttendance] = useState([]);
  const [newAttendanceDate, setNewAttendanceDate] = useState('');
  const [newAttendanceStart, setNewAttendanceStart] = useState('');
  const [newAttendanceEnd, setNewAttendanceEnd] = useState('');
  const [newAttendanceTeacherSig, setNewAttendanceTeacherSig] = useState('');
  const [newAttendanceTrainerSig, setNewAttendanceTrainerSig] = useState('');
  const [signatureModal, setSignatureModal] = useState(null);
  const [tempSignature, setTempSignature] = useState(null);
  const [selectedSchoolCardUser, setSelectedSchoolCardUser] = useState(null);
  const [allAzubisForSchoolCard, setAllAzubisForSchoolCard] = useState([]);

  const canViewAllSchoolCards = () => {
    return user?.role === 'admin' || user?.canViewSchoolCards;
  };

  const loadAzubisForSchoolCard = async () => {
    if (!canViewAllSchoolCards()) return;
    try {
      const data = await dsLoadSchoolAttendanceAzubis();
      setAllAzubisForSchoolCard(data);
    } catch (err) {
      console.error('Fehler beim Laden der Azubis:', err);
    }
  };

  const loadSchoolAttendance = async (targetUserId = null) => {
    if (!user) return;
    try {
      const userIdToLoad = targetUserId || selectedSchoolCardUser?.id || user.id;
      const data = await dsLoadSchoolAttendance(userIdToLoad);
      setSchoolAttendance(data);
    } catch (err) {
      console.error('Fehler beim Laden der Kontrollkarte:', err);
    }
  };

  const addSchoolAttendance = async () => {
    if (!newAttendanceDate || !newAttendanceStart || !newAttendanceEnd) {
      toast.error('Bitte alle Felder ausfuellen');
      return;
    }

    try {
      await dsAddSchoolAttendance({
        userId: user.id, userName: user.name, date: newAttendanceDate,
        startTime: newAttendanceStart, endTime: newAttendanceEnd,
        teacherSignature: newAttendanceTeacherSig, trainerSignature: newAttendanceTrainerSig,
        user_id: user.id, user_name: user.name,
        start_time: newAttendanceStart, end_time: newAttendanceEnd,
        teacher_signature: newAttendanceTeacherSig, trainer_signature: newAttendanceTrainerSig,
      });

      const authorizedUsers = await dsGetAuthorizedReviewers('can_view_school_cards');
      for (const authUser of authorizedUsers) {
        if (authUser.id !== user.id && authUser.name) {
          await sendNotification(
            authUser.name,
            '📝 Neuer Kontrollkarten-Eintrag',
            `${user.name} hat einen neuen Berufsschul-Eintrag vom ${new Date(newAttendanceDate).toLocaleDateString('de-DE')} hinzugefuegt.`,
            'school_card'
          );
        }
      }

      setNewAttendanceDate('');
      setNewAttendanceStart('');
      setNewAttendanceEnd('');
      setNewAttendanceTeacherSig('');
      setNewAttendanceTrainerSig('');
      showToast('Eintrag gespeichert!', 'success');
      loadSchoolAttendance();
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      toast.error('Fehler beim Speichern');
    }
  };

  const updateAttendanceSignature = async (id, field, value) => {
    try {
      await dsUpdateAttendanceSignature(id, field, value);
      loadSchoolAttendance();
    } catch (err) {
      console.error('Fehler beim Aktualisieren:', err);
    }
  };

  const deleteSchoolAttendance = async (id) => {
    if (!confirm('Eintrag wirklich löschen?')) return;
    try {
      await dsDeleteSchoolAttendance(id);
      loadSchoolAttendance();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    }
  };

  return {
    schoolAttendance, setSchoolAttendance,
    newAttendanceDate, setNewAttendanceDate,
    newAttendanceStart, setNewAttendanceStart,
    newAttendanceEnd, setNewAttendanceEnd,
    newAttendanceTeacherSig, setNewAttendanceTeacherSig,
    newAttendanceTrainerSig, setNewAttendanceTrainerSig,
    signatureModal, setSignatureModal,
    tempSignature, setTempSignature,
    selectedSchoolCardUser, setSelectedSchoolCardUser,
    allAzubisForSchoolCard,
    canViewAllSchoolCards,
    loadAzubisForSchoolCard,
    loadSchoolAttendance,
    addSchoolAttendance,
    updateAttendanceSignature,
    deleteSchoolAttendance,
  };
}
