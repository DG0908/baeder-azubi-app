import { PRACTICAL_SWIM_EXAMS } from './practical-exam-data.generated';

export type PracticalResultRow = {
  id: string;
  name: string;
  inputType: string;
  displayValue: string;
  grade: number | null;
  noteLabel: string | null;
  gradingMissing: boolean;
  points: number | null;
  seconds: number | null;
  distanceMeters: number | null;
};

export type PracticalEvaluationResult = {
  rows: PracticalResultRow[];
  averageGrade: number | null;
  gradedCount: number;
  passed: boolean | null;
  missingTables: number;
  missingRequiredInputs: string[];
};

const GRADE_LABELS: Record<number, string> = {
  1: 'sehr gut',
  2: 'gut',
  3: 'befriedigend',
  4: 'ausreichend',
  5: 'mangelhaft',
  6: 'ungenuegend'
};

const PRACTICAL_PASS_XP_BY_GRADE: Record<number, number> = {
  1: 40,
  2: 30,
  3: 20,
  4: 10,
  5: 0,
  6: 0
};

type PracticalDiscipline = {
  id: string;
  name: string;
  inputType: string;
  required?: boolean;
  gradingTable?: Array<{
    maxSeconds: number | null;
    grade: number | string;
    noteLabel?: string | null;
    points?: number | null;
  }>;
};

function padTime(value: number): string {
  return String(value).padStart(2, '0');
}

export function parseExamTimeToSeconds(value: unknown): number | null {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return null;
  }

  const normalizedRaw = raw.replace(',', '.');
  if (/^\d+:\d{1,2}([.]\d+)?$/.test(normalizedRaw)) {
    const [minutesRaw, secondsRaw] = normalizedRaw.split(':');
    const minutes = Number(minutesRaw);
    const seconds = Number(secondsRaw);
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds) || minutes < 0 || seconds < 0 || seconds >= 60) {
      return null;
    }
    return (minutes * 60) + seconds;
  }

  const parsed = Number(normalizedRaw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function formatSecondsAsTime(value: number | null): string {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '-';
  }

  const rounded = Math.round(seconds * 10) / 10;
  const minutesPart = Math.floor(rounded / 60);
  const secondsPart = rounded - (minutesPart * 60);
  const formattedSeconds = secondsPart.toFixed(1).replace('.', ',');
  const [secInt, secDec] = formattedSeconds.split(',');
  return `${padTime(minutesPart)}:${padTime(Number(secInt))},${secDec}`;
}

function normalizeNoteText(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace('ä', 'ae')
    .replace('ö', 'oe')
    .replace('ü', 'ue')
    .replace('ß', 'ss')
    .replace(/\./g, '');
}

function toNumericGrade(value: unknown): number | null {
  const normalized = String(value ?? '').trim().replace(',', '.');
  if (!normalized) {
    return null;
  }

  const numeric = Number(normalized);
  if (Number.isFinite(numeric)) {
    return Math.max(1, Math.min(6, numeric));
  }

  const note = normalizeNoteText(normalized);
  if (note.includes('sehr gut')) return 1;
  if (note === 'gut') return 2;
  if (note.includes('befriedigend') || note.includes('befried')) return 3;
  if (note.includes('ausreichend') || note.includes('ausreich')) return 4;
  if (note.includes('mangelhaft')) return 5;
  if (note.includes('ungenuegend') || note.includes('ungenugend')) return 6;
  return null;
}

function resolveGradeFromTable(seconds: number, gradingTable: PracticalDiscipline['gradingTable']) {
  if (!Number.isFinite(seconds) || seconds <= 0 || !Array.isArray(gradingTable) || gradingTable.length === 0) {
    return null;
  }

  const normalizedRows = gradingTable
    .map((row) => {
      const grade = toNumericGrade(row.grade ?? row.noteLabel);
      if (!grade) {
        return null;
      }
      return {
        ...row,
        grade,
        noteLabel: row.noteLabel || GRADE_LABELS[grade] || `Note ${grade}`
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const finiteRows = normalizedRows
    .filter((row) => Number.isFinite(Number(row.maxSeconds)))
    .map((row) => ({
      ...row,
      maxSeconds: Number(row.maxSeconds)
    }))
    .sort((left, right) => left.maxSeconds - right.maxSeconds);

  for (const row of finiteRows) {
    if (seconds <= row.maxSeconds) {
      return row;
    }
  }

  return normalizedRows.find((row) => row.maxSeconds == null)
    || finiteRows[finiteRows.length - 1]
    || null;
}

function parseDistanceMeters(value: unknown): number | null {
  const raw = String(value ?? '').trim().replace(',', '.');
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.floor(parsed);
}

function resolveDistanceDiveDiscipline(
  discipline: PracticalDiscipline,
  inputValues: Record<string, string>,
  targetDistanceMeters: number,
  minDistanceForGrade5: number
): Omit<PracticalResultRow, 'id' | 'name' | 'inputType'> & { missingRequired: boolean } {
  const rawTime = String(inputValues[discipline.id] ?? '').trim();
  const seconds = parseExamTimeToSeconds(rawTime);
  const distanceMeters = parseDistanceMeters(inputValues[`${discipline.id}_distance`]);

  if (!distanceMeters) {
    return {
      missingRequired: true,
      displayValue: '-',
      grade: null,
      noteLabel: null,
      gradingMissing: false,
      points: null,
      seconds: null,
      distanceMeters: null
    };
  }

  if (distanceMeters >= targetDistanceMeters) {
    if (!seconds) {
      return {
        missingRequired: true,
        displayValue: '-',
        grade: null,
        noteLabel: null,
        gradingMissing: false,
        points: null,
        seconds: null,
        distanceMeters
      };
    }

    const tableHit = resolveGradeFromTable(seconds, discipline.gradingTable);
    return {
      missingRequired: false,
      displayValue: `${formatSecondsAsTime(seconds)} bei ${distanceMeters}m`,
      grade: tableHit?.grade ?? null,
      noteLabel: tableHit?.noteLabel ?? null,
      gradingMissing: !tableHit,
      points: tableHit?.points ?? null,
      seconds,
      distanceMeters
    };
  }

  if (distanceMeters >= minDistanceForGrade5) {
    return {
      missingRequired: false,
      displayValue: `${seconds ? formatSecondsAsTime(seconds) : (rawTime || '-')} bei ${distanceMeters}m`,
      grade: 5,
      noteLabel: GRADE_LABELS[5],
      gradingMissing: false,
      points: null,
      seconds: seconds || null,
      distanceMeters
    };
  }

  return {
    missingRequired: false,
    displayValue: `${seconds ? formatSecondsAsTime(seconds) : (rawTime || '-')} bei ${distanceMeters}m`,
    grade: 6,
    noteLabel: GRADE_LABELS[6],
    gradingMissing: false,
    points: null,
    seconds: seconds || null,
    distanceMeters
  };
}

function resolvePracticalDisciplineResult(
  discipline: PracticalDiscipline,
  inputValues: Record<string, string>
): Omit<PracticalResultRow, 'id' | 'name' | 'inputType'> & { missingRequired: boolean } {
  const isRequired = discipline.required !== false;

  if (discipline.id === 'ap_35m_tauch') {
    return resolveDistanceDiveDiscipline(discipline, inputValues, 35, 29);
  }

  if (discipline.id === 'zp_30m_tauch') {
    return resolveDistanceDiveDiscipline(discipline, inputValues, 30, 24);
  }

  if (discipline.inputType === 'grade') {
    const rawValue = String(inputValues[discipline.id] ?? '').trim();
    const grade = toNumericGrade(rawValue);
    return {
      missingRequired: isRequired && !grade,
      displayValue: rawValue || '-',
      grade: grade || null,
      noteLabel: grade ? GRADE_LABELS[grade] : null,
      gradingMissing: false,
      points: null,
      seconds: null,
      distanceMeters: null
    };
  }

  const rawValue = String(inputValues[discipline.id] ?? '').trim();
  const seconds = parseExamTimeToSeconds(rawValue);
  const tableHit = seconds ? resolveGradeFromTable(seconds, discipline.gradingTable) : null;

  return {
    missingRequired: isRequired && !seconds,
    displayValue: seconds ? formatSecondsAsTime(seconds) : '-',
    grade: tableHit?.grade ?? null,
    noteLabel: tableHit?.noteLabel ?? null,
    gradingMissing: (!Array.isArray(discipline.gradingTable) || discipline.gradingTable.length === 0) || !tableHit,
    points: tableHit?.points ?? null,
    seconds: seconds || null,
    distanceMeters: null
  };
}

export function evaluatePracticalAttempt(
  examType: 'zwischen' | 'abschluss',
  inputValues: Record<string, string>
): PracticalEvaluationResult {
  const disciplines = Array.isArray(PRACTICAL_SWIM_EXAMS[examType])
    ? (Array.from(PRACTICAL_SWIM_EXAMS[examType] as readonly unknown[]) as PracticalDiscipline[])
    : [];

  const missingRequiredInputs: string[] = [];
  const rows: PracticalResultRow[] = disciplines.map((discipline: PracticalDiscipline) => {
    const resolved = resolvePracticalDisciplineResult(discipline, inputValues);
    if (resolved.missingRequired) {
      missingRequiredInputs.push(String(discipline.name));
    }
    return {
      id: String(discipline.id),
      name: String(discipline.name),
      inputType: String(discipline.inputType),
      displayValue: resolved.displayValue,
      grade: resolved.grade,
      noteLabel: resolved.noteLabel,
      gradingMissing: resolved.gradingMissing,
      points: resolved.points,
      seconds: resolved.seconds,
      distanceMeters: resolved.distanceMeters
    };
  });

  const numericGrades = rows
    .map((row: PracticalResultRow) => toNumericGrade(row.grade))
    .filter((grade): grade is number => grade !== null);

  const averageGrade = numericGrades.length > 0
    ? numericGrades.reduce((sum: number, value: number) => sum + value, 0) / numericGrades.length
    : null;

  return {
    rows,
    averageGrade,
    gradedCount: numericGrades.length,
    passed: averageGrade !== null ? averageGrade <= 4 : null,
    missingTables: rows.filter((row: PracticalResultRow) => row.gradingMissing).length,
    missingRequiredInputs
  };
}

export function getPracticalPassXpReward(averageGrade: number | null) {
  const value = Number(averageGrade);
  if (!Number.isFinite(value)) {
    return {
      gradeBucket: null,
      xp: 0
    };
  }

  let gradeBucket: number;
  if (value <= 1.5) gradeBucket = 1;
  else if (value <= 2.5) gradeBucket = 2;
  else if (value <= 3.5) gradeBucket = 3;
  else if (value <= 4.0) gradeBucket = 4;
  else if (value <= 5.5) gradeBucket = 5;
  else gradeBucket = 6;

  return {
    gradeBucket,
    xp: PRACTICAL_PASS_XP_BY_GRADE[gradeBucket] || 0
  };
}
