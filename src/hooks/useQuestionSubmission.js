import { useState } from 'react';
import {
  createQuestionSubmission as dsCreateQuestionSubmission,
  approveQuestionSubmission as dsApproveQuestionSubmission,
} from '../lib/dataService';
import { friendlyError } from '../lib/friendlyError';

const EMPTY_CLUES = ['', '', '', '', ''];

export function useQuestionSubmission({ user, moderateContent, showToast }) {
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('org');
  const [newQuestionAnswers, setNewQuestionAnswers] = useState(['', '', '', '']);
  const [newQuestionCorrect, setNewQuestionCorrect] = useState(0);
  const [newQuestionMulti, setNewQuestionMulti] = useState(false);
  const [newQuestionCorrectIndices, setNewQuestionCorrectIndices] = useState([]);
  const [newQuestionType, setNewQuestionType] = useState('multiple');
  const [newWhoAmIAnswer, setNewWhoAmIAnswer] = useState('');
  const [newWhoAmIClues, setNewWhoAmIClues] = useState(EMPTY_CLUES);

  const resetMultipleChoiceForm = () => {
    setNewQuestionText('');
    setNewQuestionAnswers(['', '', '', '']);
    setNewQuestionCorrectIndices([]);
  };

  const resetWhoAmIForm = () => {
    setNewQuestionText('');
    setNewWhoAmIAnswer('');
    setNewWhoAmIClues(EMPTY_CLUES);
  };

  const submitQuestion = async () => {
    if (!user) return;

    if (newQuestionType === 'whoami') {
      const questionText = newQuestionText.trim() || 'Was bin ich?';
      const answer = newWhoAmIAnswer.trim();
      if (!answer) {
        showToast('Bitte gib die Lösung an.', 'warning');
        return;
      }
      const clues = (newWhoAmIClues || []).map((c) => (c || '').trim());
      if (clues.length !== 5 || clues.some((c) => !c)) {
        showToast('Bitte fülle alle 5 Hinweise aus.', 'warning');
        return;
      }
      if (!moderateContent(answer, 'Lösung')) return;
      for (let i = 0; i < clues.length; i += 1) {
        if (!moderateContent(clues[i], `Hinweis ${i + 1}`)) return;
      }

      try {
        const q = await dsCreateQuestionSubmission({
          category: newQuestionCategory,
          question: questionText,
          type: 'whoami',
          answer,
          clues,
          createdBy: user.name,
        });

        setSubmittedQuestions((prev) => [...prev, q]);
        resetWhoAmIForm();
        showToast('Was-bin-ich-Frage eingereicht!', 'success');
      } catch (error) {
        console.error('Question error:', error);
        showToast(friendlyError(error), 'error');
      }
      return;
    }

    if (!newQuestionText.trim()) return;

    if (!moderateContent(newQuestionText, 'Frage')) return;

    for (let i = 0; i < newQuestionAnswers.length; i += 1) {
      if (newQuestionAnswers[i] && !moderateContent(newQuestionAnswers[i], `Antwort ${i + 1}`)) {
        return;
      }
    }

    if (newQuestionMulti) {
      const indices = (newQuestionCorrectIndices || [])
        .map((i) => Number(i))
        .filter((i) => Number.isInteger(i) && i >= 0 && i < newQuestionAnswers.length);
      if (indices.length < 1) {
        showToast('Bitte mindestens eine richtige Antwort markieren.', 'warning');
        return;
      }

      try {
        const q = await dsCreateQuestionSubmission({
          category: newQuestionCategory,
          question: newQuestionText,
          answers: newQuestionAnswers,
          correct: indices,
          multi: true,
          type: 'multiple',
          createdBy: user.name,
        });

        setSubmittedQuestions((prev) => [...prev, q]);
        resetMultipleChoiceForm();
        showToast('Frage eingereicht!', 'success');
      } catch (error) {
        console.error('Question error:', error);
        showToast(friendlyError(error), 'error');
      }
      return;
    }

    try {
      const q = await dsCreateQuestionSubmission({
        category: newQuestionCategory,
        question: newQuestionText,
        answers: newQuestionAnswers,
        correct: newQuestionCorrect,
        multi: false,
        type: 'multiple',
        createdBy: user.name,
      });

      setSubmittedQuestions((prev) => [...prev, q]);
      setNewQuestionText('');
      setNewQuestionAnswers(['', '', '', '']);
      showToast('Frage eingereicht!', 'success');
    } catch (error) {
      console.error('Question error:', error);
      showToast(friendlyError(error), 'error');
    }
  };

  const approveQuestion = async (qId) => {
    try {
      await dsApproveQuestionSubmission(qId);
      setSubmittedQuestions((prev) => prev.map((sq) => (sq.id === qId ? { ...sq, approved: true } : sq)));
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  return {
    submittedQuestions, setSubmittedQuestions,
    newQuestionText, setNewQuestionText,
    newQuestionCategory, setNewQuestionCategory,
    newQuestionAnswers, setNewQuestionAnswers,
    newQuestionCorrect, setNewQuestionCorrect,
    newQuestionMulti, setNewQuestionMulti,
    newQuestionCorrectIndices, setNewQuestionCorrectIndices,
    newQuestionType, setNewQuestionType,
    newWhoAmIAnswer, setNewWhoAmIAnswer,
    newWhoAmIClues, setNewWhoAmIClues,
    submitQuestion, approveQuestion,
  };
}
