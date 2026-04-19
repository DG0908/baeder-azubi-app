import { useState } from 'react';
import {
  createQuestionSubmission as dsCreateQuestionSubmission,
  approveQuestionSubmission as dsApproveQuestionSubmission,
} from '../lib/dataService';
import { friendlyError } from '../lib/friendlyError';

export function useQuestionSubmission({ user, moderateContent, showToast }) {
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('org');
  const [newQuestionAnswers, setNewQuestionAnswers] = useState(['', '', '', '']);
  const [newQuestionCorrect, setNewQuestionCorrect] = useState(0);
  const [newQuestionMulti, setNewQuestionMulti] = useState(false);
  const [newQuestionCorrectIndices, setNewQuestionCorrectIndices] = useState([]);

  const submitQuestion = async () => {
    if (!newQuestionText.trim() || !user) return;

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
          createdBy: user.name,
        });

        setSubmittedQuestions((prev) => [...prev, q]);
        setNewQuestionText('');
        setNewQuestionAnswers(['', '', '', '']);
        setNewQuestionCorrectIndices([]);
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
    submitQuestion, approveQuestion,
  };
}
