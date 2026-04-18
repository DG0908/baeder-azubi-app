import { useState } from 'react';
import {
  PRACTICAL_EXAM_TYPES,
  PRACTICAL_SWIM_EXAMS,
  resolvePracticalDisciplineResult,
  toNumericGrade,
  formatGradeLabel,
  parseExamTimeToSeconds,
} from '../data/practicalExam';
import {
  loadPracticalExamAttempts as dsLoadPracticalExamAttempts,
  savePracticalExamAttemptEntry as dsSavePracticalExamAttempt,
  deletePracticalExamAttempt as dsDeletePracticalExamAttempt,
} from '../lib/dataService';

const PRACTICAL_ATTEMPTS_LOCAL_KEY = 'practical_exam_attempts_local_v1';
const PRACTICAL_PASS_XP_BY_GRADE = { 1: 40, 2: 30, 3: 20, 4: 10, 5: 0, 6: 0 };

const toIsoDateTime = (value) => {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
};

const toPracticalAttemptId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toPracticalGradeBucket = (averageGrade) => {
  const value = Number(averageGrade);
  if (!Number.isFinite(value)) return null;
  if (value <= 1.5) return 1;
  if (value <= 2.5) return 2;
  if (value <= 3.5) return 3;
  if (value <= 4.0) return 4;
  if (value <= 5.5) return 5;
  return 6;
};

const getPracticalPassXpReward = (averageGrade) => {
  const gradeBucket = toPracticalGradeBucket(averageGrade);
  const xp = gradeBucket ? (PRACTICAL_PASS_XP_BY_GRADE[gradeBucket] || 0) : 0;
  return { gradeBucket, xp };
};

const getPracticalDisciplineRequiredDistance = (disciplineId) => {
  if (disciplineId === 'ap_35m_tauch') return 35;
  if (disciplineId === 'zp_30m_tauch') return 30;
  return null;
};

export const getPracticalRowSeconds = (row) => {
  const directSeconds = Number(row?.seconds);
  if (Number.isFinite(directSeconds) && directSeconds > 0) {
    return directSeconds;
  }
  const displayValue = String(row?.displayValue || '').trim();
  if (!displayValue || displayValue === '-') return null;
  const match = displayValue.match(/(\d+:\d{1,2}(?:[,.]\d+)?)/);
  const valueToParse = match?.[1] || displayValue;
  const parsed = parseExamTimeToSeconds(valueToParse);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const canUseRowForSpeedRanking = (row, disciplineId) => {
  const requiredDistance = getPracticalDisciplineRequiredDistance(disciplineId);
  if (!requiredDistance) return true;
  const distanceMeters = Number(row?.distanceMeters);
  return Number.isFinite(distanceMeters) && distanceMeters >= requiredDistance;
};

const normalizePracticalAttempt = (rawAttempt) => {
  if (!rawAttempt || typeof rawAttempt !== 'object') return null;

  let rows = rawAttempt.result_rows ?? rawAttempt.rows ?? [];
  if (typeof rows === 'string') {
    try {
      rows = JSON.parse(rows);
    } catch {
      rows = [];
    }
  }
  if (!Array.isArray(rows)) rows = [];

  const id = rawAttempt.id || rawAttempt.attempt_id || toPracticalAttemptId();
  const examType = rawAttempt.exam_type || rawAttempt.type || 'zwischen';
  const averageGradeRaw = rawAttempt.average_grade ?? rawAttempt.averageGrade;
  const averageGrade = Number.isFinite(Number(averageGradeRaw))
    ? Number(averageGradeRaw)
    : null;
  const gradedCountRaw = rawAttempt.graded_count ?? rawAttempt.gradedCount;
  const gradedCount = Number.isFinite(Number(gradedCountRaw))
    ? Number(gradedCountRaw)
    : rows.filter(row => toNumericGrade(row?.grade) !== null).length;
  const passedRaw = rawAttempt.passed;
  const passed = typeof passedRaw === 'boolean'
    ? passedRaw
    : (averageGrade !== null ? averageGrade <= 4 : null);

  return {
    id,
    user_id: rawAttempt.user_id || '',
    user_name: rawAttempt.user_name || 'Unbekannt',
    exam_type: examType,
    average_grade: averageGrade,
    graded_count: gradedCount,
    passed,
    rows,
    created_at: toIsoDateTime(rawAttempt.created_at || rawAttempt.createdAt),
    created_by: rawAttempt.created_by || null,
    created_by_name: rawAttempt.created_by_name || null,
    source: rawAttempt.source || (String(id).startsWith('local-') ? 'local' : 'remote'),
  };
};

const loadLocalPracticalAttempts = () => {
  try {
    const raw = localStorage.getItem(PRACTICAL_ATTEMPTS_LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizePracticalAttempt).filter(Boolean);
  } catch {
    return [];
  }
};

const saveLocalPracticalAttempts = (attempts) => {
  const safeAttempts = Array.isArray(attempts) ? attempts.slice(0, 500) : [];
  localStorage.setItem(PRACTICAL_ATTEMPTS_LOCAL_KEY, JSON.stringify(safeAttempts));
};

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export function usePracticalExam({ user, allUsers, showToast, queueXpAwardForUser }) {
  const [practicalExamType, setPracticalExamType] = useState('zwischen');
  const [practicalExamInputs, setPracticalExamInputs] = useState({});
  const [practicalExamResult, setPracticalExamResult] = useState(null);
  const [practicalExamTargetUserId, setPracticalExamTargetUserId] = useState('');
  const [practicalExamHistory, setPracticalExamHistory] = useState([]);
  const [practicalExamHistoryLoading, setPracticalExamHistoryLoading] = useState(false);
  const [practicalExamHistoryTypeFilter, setPracticalExamHistoryTypeFilter] = useState('alle');
  const [practicalExamHistoryUserFilter, setPracticalExamHistoryUserFilter] = useState('all');
  const [practicalExamComparisonType, setPracticalExamComparisonType] = useState('alle');

  const getPracticalParticipantCandidates = () => allUsers
    .filter((account) => {
      if (!account?.id) return false;
      const role = String(account.role || '').toLowerCase();
      return role === 'azubi'
        || role === 'trainer'
        || role === 'ausbilder'
        || role === 'admin'
        || Boolean(account?.permissions?.canViewAllStats);
    })
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'de'));

  const getPracticalExamTargetUser = () => {
    if (!user?.id) return null;
    const canManageAll = Boolean(user?.permissions?.canViewAllStats);
    if (!canManageAll) {
      return { id: user.id, name: user.name || 'Unbekannt', role: user.role || 'azubi' };
    }
    const participants = getPracticalParticipantCandidates();
    const selectedParticipant = participants.find(account => account.id === practicalExamTargetUserId);
    if (selectedParticipant) {
      return {
        id: selectedParticipant.id,
        name: selectedParticipant.name || 'Unbekannt',
        role: selectedParticipant.role || 'azubi',
      };
    }
    if (participants.some(account => account.id === user.id)) {
      return { id: user.id, name: user.name || 'Unbekannt', role: user.role || 'trainer' };
    }
    return participants.length > 0
      ? { id: participants[0].id, name: participants[0].name || 'Unbekannt', role: participants[0].role || 'azubi' }
      : { id: user.id, name: user.name || 'Unbekannt', role: user.role || 'trainer' };
  };

  const loadPracticalExamHistory = async () => {
    if (!user?.id) return;
    setPracticalExamHistoryLoading(true);

    const localAttempts = loadLocalPracticalAttempts();
    const canManageAll = Boolean(user?.permissions?.canViewAllStats);

    try {
      const rawAttempts = await dsLoadPracticalExamAttempts(user.id, canManageAll);

      const remoteAttempts = (rawAttempts || [])
        .map(normalizePracticalAttempt)
        .filter(Boolean);

      const mergedById = {};
      remoteAttempts.forEach((entry) => {
        mergedById[entry.id] = entry;
      });
      localAttempts.forEach((entry) => {
        if (!mergedById[entry.id]) {
          mergedById[entry.id] = entry;
        }
      });

      const merged = Object.values(mergedById).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const filtered = canManageAll ? merged : merged.filter(entry => entry.user_id === user.id);
      setPracticalExamHistory(filtered);
    } catch {
      const fallback = canManageAll
        ? localAttempts
        : localAttempts.filter(entry => entry.user_id === user.id);
      setPracticalExamHistory(fallback.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } finally {
      setPracticalExamHistoryLoading(false);
    }
  };

  const savePracticalExamAttempt = async (resultPayload) => {
    const targetUser = getPracticalExamTargetUser();
    if (!targetUser?.id || !resultPayload) return;

    const normalizedResultRows = Array.isArray(resultPayload.rows)
      ? resultPayload.rows.map((row) => ({ ...row }))
      : [];

    const localAttempt = normalizePracticalAttempt({
      id: toPracticalAttemptId(),
      user_id: targetUser.id,
      user_name: targetUser.name,
      exam_type: resultPayload.type,
      average_grade: resultPayload.averageGrade,
      graded_count: resultPayload.gradedCount,
      passed: resultPayload.passed,
      result_rows: normalizedResultRows,
      created_at: toIsoDateTime(resultPayload.createdAt),
      created_by: user?.id || null,
      created_by_name: user?.name || null,
      source: 'local',
    });

    try {
      const insertPayload = {
        userId: targetUser.id,
        examType: resultPayload.type,
        inputValues: Object.fromEntries(
          Object.entries(practicalExamInputs || {}).map(([key, value]) => [key, String(value ?? '')])
        ),
      };

      const data = await dsSavePracticalExamAttempt(insertPayload);

      const savedAttempt = normalizePracticalAttempt({ ...data, source: 'remote' });
      if (savedAttempt) {
        setPracticalExamHistory(prev => [savedAttempt, ...prev.filter(entry => entry.id !== savedAttempt.id)]);
      }
    } catch (error) {
      const existingLocal = loadLocalPracticalAttempts();
      const nextLocal = [localAttempt, ...existingLocal.filter(entry => entry.id !== localAttempt.id)];
      saveLocalPracticalAttempts(nextLocal);

      const canManageAll = Boolean(user?.permissions?.canViewAllStats);
      if (canManageAll || localAttempt.user_id === user?.id) {
        setPracticalExamHistory(prev => [localAttempt, ...prev.filter(entry => entry.id !== localAttempt.id)]);
      }
      if (!(error.code === '42P01' || error.message?.includes('does not exist'))) {
        showToast('Versuch lokal gespeichert (Cloud-Speicherung nicht verfügbar).', 'info');
      }
    }
  };

  const deletePracticalExamAttempt = async (attemptId) => {
    if (!attemptId) return;
    setPracticalExamHistory(prev => prev.filter(entry => entry.id !== attemptId));
    const existingLocal = loadLocalPracticalAttempts();
    saveLocalPracticalAttempts(existingLocal.filter(entry => entry.id !== attemptId));
    try {
      await dsDeletePracticalExamAttempt(attemptId);
    } catch {
      // Local removal already done, ignore remote error
    }
  };

  const exportPracticalExamToPdf = (attemptInput = null) => {
    const targetUser = getPracticalExamTargetUser();
    const fallbackAttempt = practicalExamResult ? {
      id: 'current-preview',
      user_id: targetUser?.id || user?.id || '',
      user_name: targetUser?.name || user?.name || 'Unbekannt',
      exam_type: practicalExamResult.type,
      average_grade: practicalExamResult.averageGrade,
      graded_count: practicalExamResult.gradedCount,
      passed: practicalExamResult.passed,
      rows: practicalExamResult.rows || [],
      created_at: toIsoDateTime(practicalExamResult.createdAt),
      source: 'session',
    } : null;

    const attempt = attemptInput || fallbackAttempt;
    if (!attempt) {
      showToast('Kein Ergebnis zum Export vorhanden.', 'warning');
      return;
    }

    const attemptRows = Array.isArray(attempt.rows) ? attempt.rows : [];
    const examTypeLabel = PRACTICAL_EXAM_TYPES.find(type => type.id === attempt.exam_type)?.label || attempt.exam_type;
    const createdLabel = new Date(attempt.created_at).toLocaleString('de-DE');
    const averageGradeLabel = Number.isFinite(Number(attempt.average_grade))
      ? Number(attempt.average_grade).toFixed(2)
      : '-';
    const statusLabel = attempt.passed === null
      ? 'offen'
      : attempt.passed ? 'bestanden' : 'nicht bestanden';

    const rowsHtml = attemptRows.map((row) => {
      const gradeLabel = row?.grade ? formatGradeLabel(row.grade, row.noteLabel) : 'Keine Note';
      const pointsLabel = row?.points !== null && row?.points !== undefined ? `${row.points} Punkte` : '-';
      return `
        <tr>
          <td>${escapeHtml(row?.name || '-')}</td>
          <td>${escapeHtml(row?.displayValue || '-')}</td>
          <td>${escapeHtml(gradeLabel || '-')}</td>
          <td>${escapeHtml(pointsLabel)}</td>
        </tr>
      `;
    }).join('');

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Praktische Prüfung ${escapeHtml(examTypeLabel)} - ${escapeHtml(attempt.user_name)}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          @media print { .no-print { display: none !important; } }
          body { font-family: Arial, sans-serif; font-size: 12px; color: #111; margin: 0; padding: 0; }
          .wrap { max-width: 190mm; margin: 0 auto; }
          h1 { margin: 0 0 10px 0; font-size: 22px; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; margin-bottom: 14px; padding: 10px; border: 1px solid #bbb; background: #f8fafc; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #333; padding: 7px; vertical-align: top; }
          th { background: #efefef; text-align: left; }
          .summary { margin-top: 14px; padding: 10px; border: 1px solid #333; background: #f8fafc; }
          .print-button { margin-top: 18px; text-align: center; }
          .print-button button { padding: 10px 26px; font-size: 15px; background: #0ea5e9; color: white; border: none; border-radius: 8px; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Praktische Prüfung - ${escapeHtml(examTypeLabel)}</h1>
          <div class="meta">
            <div><strong>Teilnehmer:</strong> ${escapeHtml(attempt.user_name || '-')}</div>
            <div><strong>Datum:</strong> ${escapeHtml(createdLabel)}</div>
            <div><strong>Gewertete Disziplinen:</strong> ${escapeHtml(attempt.graded_count ?? '-')}</div>
            <div><strong>Status:</strong> ${escapeHtml(statusLabel)}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Disziplin</th>
                <th>Eingabe / Wert</th>
                <th>Ergebnis</th>
                <th>Punkte</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || '<tr><td colspan="4">Keine Disziplinen vorhanden.</td></tr>'}
            </tbody>
          </table>

          <div class="summary">
            <strong>Durchschnittsnote:</strong> ${escapeHtml(averageGradeLabel)}
          </div>

          <div class="print-button no-print">
            <button onclick="window.print()">Drucken / Als PDF speichern</button>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Popup blockiert. Bitte Popup erlauben.', 'warning');
      return;
    }
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const resetPracticalExam = () => {
    setPracticalExamInputs({});
    setPracticalExamResult(null);
  };

  const updatePracticalExamInput = (disciplineId, value) => {
    setPracticalExamInputs(prev => ({ ...prev, [disciplineId]: value }));
    setPracticalExamResult(null);
  };

  const evaluatePracticalExam = () => {
    const disciplines = PRACTICAL_SWIM_EXAMS[practicalExamType] || [];
    if (disciplines.length === 0) {
      showToast('Keine Disziplinen für diese Prüfung gefunden.', 'warning');
      return;
    }
    const targetUser = getPracticalExamTargetUser();
    if (!targetUser?.id) {
      showToast('Bitte zuerst einen Teilnehmer auswählen.', 'warning');
      return;
    }

    const missingRequiredInputs = [];
    const evaluatedRows = disciplines.map((discipline) => {
      const resolved = resolvePracticalDisciplineResult(discipline, practicalExamInputs);
      if (resolved.missingRequired) {
        missingRequiredInputs.push(discipline.name);
      }
      return {
        id: discipline.id,
        name: discipline.name,
        inputType: discipline.inputType,
        ...resolved,
      };
    });

    if (missingRequiredInputs.length > 0) {
      showToast(`Bitte gültige Eingaben ergänzen: ${missingRequiredInputs.join(', ')}`, 'warning');
      return;
    }

    const numericGrades = evaluatedRows
      .map(row => toNumericGrade(row.grade))
      .filter(value => value !== null);

    const averageGrade = numericGrades.length > 0
      ? numericGrades.reduce((sum, value) => sum + value, 0) / numericGrades.length
      : null;

    const missingTables = evaluatedRows.filter(row => row.gradingMissing).length;
    const resultPayload = {
      type: practicalExamType,
      userId: targetUser.id,
      userName: targetUser.name,
      rows: evaluatedRows,
      averageGrade,
      gradedCount: numericGrades.length,
      passed: averageGrade !== null ? averageGrade <= 4 : null,
      missingTables,
      createdAt: Date.now(),
    };
    setPracticalExamResult(resultPayload);
    void savePracticalExamAttempt(resultPayload);

    if (resultPayload.passed) {
      const { gradeBucket, xp } = getPracticalPassXpReward(resultPayload.averageGrade);
      if (xp > 0) {
        void queueXpAwardForUser(
          { id: targetUser.id, name: targetUser.name },
          'practicalExam',
          xp,
          {
            eventKey: `practical_pass_${targetUser.id}_${resultPayload.type}_${resultPayload.createdAt}`,
            reason: gradeBucket ? `Praxis bestanden • Note ${gradeBucket}` : 'Praxis bestanden',
            showXpToast: targetUser.id === user?.id,
          }
        );
      }
    }

    if (missingTables > 0) {
      showToast('Wertungstabellen fehlen noch teilweise. Bitte nachreichen.', 'info');
    } else {
      showToast('Praktische Prüfung ausgewertet.', 'success');
    }
  };

  return {
    practicalExamType, setPracticalExamType,
    practicalExamInputs, setPracticalExamInputs,
    practicalExamResult, setPracticalExamResult,
    practicalExamTargetUserId, setPracticalExamTargetUserId,
    practicalExamHistory, setPracticalExamHistory,
    practicalExamHistoryLoading,
    practicalExamHistoryTypeFilter, setPracticalExamHistoryTypeFilter,
    practicalExamHistoryUserFilter, setPracticalExamHistoryUserFilter,
    practicalExamComparisonType, setPracticalExamComparisonType,
    getPracticalParticipantCandidates,
    getPracticalExamTargetUser,
    loadPracticalExamHistory,
    savePracticalExamAttempt,
    deletePracticalExamAttempt,
    exportPracticalExamToPdf,
    resetPracticalExam,
    updatePracticalExamInput,
    evaluatePracticalExam,
  };
}
