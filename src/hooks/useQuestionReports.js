import { useEffect, useState } from 'react';
import { parseJsonSafe } from '../lib/jsonUtils';

const STORAGE_KEY = 'question_reports_v1';

export function useQuestionReports() {
  const [questionReports, setQuestionReports] = useState(() => {
    const parsed = parseJsonSafe(localStorage.getItem(STORAGE_KEY), []);
    return Array.isArray(parsed) ? parsed : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questionReports));
  }, [questionReports]);

  return { questionReports, setQuestionReports };
}
