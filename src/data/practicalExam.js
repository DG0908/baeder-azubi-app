export const PRACTICAL_EXAM_TYPES = [
  { id: 'zwischen', label: 'Zwischenprüfung', icon: 'ZP' },
  { id: 'abschluss', label: 'Abschlussprüfung', icon: 'AP' }
];

const GRADE_LABELS = {
  1: 'sehr gut',
  2: 'gut',
  3: 'befriedigend',
  4: 'ausreichend',
  5: 'mangelhaft',
  6: 'ungenuegend'
};

export const PRACTICAL_SWIM_EXAMS = {
  zwischen: [
    {
      id: 'zp_400m',
      name: '400m ZP',
      inputType: 'time',
      inputPlaceholder: 'z. B. 07:45',
      gradingTable: [
        { maxSeconds: 468.0, grade: 1, noteLabel: 'sehr gut' },       // bis 07:48,0
        { maxSeconds: 534.0, grade: 2, noteLabel: 'gut' },            // bis 08:54,0
        { maxSeconds: 618.0, grade: 3, noteLabel: 'befriedigend' },   // bis 10:18,0
        { maxSeconds: 720.0, grade: 4, noteLabel: 'ausreichend' },    // bis 12:00,0
        { maxSeconds: 840.0, grade: 5, noteLabel: 'mangelhaft' },     // bis 14:00,0
        { maxSeconds: null, grade: 6, noteLabel: 'ungenuegend' }
      ]
    },
    {
      id: 'zp_100m',
      name: '100m ZP',
      inputType: 'time',
      inputPlaceholder: 'z. B. 01:52',
      gradingTable: [
        { maxSeconds: 79.8, grade: 1, noteLabel: 'sehr gut' },        // bis 01:19,8
        { maxSeconds: 83.5, grade: 2, noteLabel: 'gut' },             // bis 01:23,5
        { maxSeconds: 88.7, grade: 3, noteLabel: 'befriedigend' },    // bis 01:28,7
        { maxSeconds: 95.0, grade: 4, noteLabel: 'ausreichend' },     // bis 01:35,0
        { maxSeconds: 102.4, grade: 5, noteLabel: 'mangelhaft' },     // bis 01:42,4
        { maxSeconds: null, grade: 6, noteLabel: 'ungenuegend' }
      ]
    },
    {
      id: 'zp_50m_transport',
      name: '50m Transport ZP',
      inputType: 'time',
      inputPlaceholder: 'z. B. 01:20',
      gradingTable: [
        { maxSeconds: 64.8, grade: 1, noteLabel: 'sehr gut' },        // bis 01:04,8
        { maxSeconds: 71.4, grade: 2, noteLabel: 'gut' },             // bis 01:11,4
        { maxSeconds: 79.8, grade: 3, noteLabel: 'befriedigend' },    // bis 01:19,8
        { maxSeconds: 90.0, grade: 4, noteLabel: 'ausreichend' },     // bis 01:30,0
        { maxSeconds: 102.0, grade: 5, noteLabel: 'mangelhaft' },     // bis 01:42,0
        { maxSeconds: null, grade: 6, noteLabel: 'ungenuegend' }
      ]
    },
    {
      id: 'zp_30m_tauch',
      name: '30m Streckentauchen ZP',
      inputType: 'time_distance',
      inputPlaceholder: 'z. B. 00:33,6',
      distancePlaceholder: 'Strecke in m (z. B. 30)',
      gradingTable: [
        { maxSeconds: 26.7, grade: 1, noteLabel: 'sehr gut' },
        { maxSeconds: 30.0, grade: 2, noteLabel: 'gut' },
        { maxSeconds: 34.2, grade: 3, noteLabel: 'befriedigend' },
        { maxSeconds: null, grade: 4, noteLabel: 'ausreichend' }
      ]
    },
    {
      id: 'zp_hlw',
      name: 'HLW-Prüfbogen',
      inputType: 'grade',
      inputPlaceholder: 'z. B. 2',
      required: false,
      gradingTable: []
    }
  ],
  abschluss: [
    {
      id: 'ap_300m_kleiderschwimmen',
      name: '300m Kleiderschwimmen AP',
      inputType: 'time',
      inputPlaceholder: 'z. B. 06:20,1',
      gradingTable: [
        { maxSeconds: 366.6, grade: 1, noteLabel: 'sehr gut' },
        { maxSeconds: 399.0, grade: 2, noteLabel: 'gut' },
        { maxSeconds: 434.1, grade: 3, noteLabel: 'befriedigend' },
        { maxSeconds: 480.0, grade: 4, noteLabel: 'ausreichend' },
        { maxSeconds: null, grade: 5, noteLabel: 'mangelhaft' }
      ]
    },
    {
      id: 'ap_100m',
      name: '100m AP',
      inputType: 'time',
      inputPlaceholder: 'z. B. 01:25,2',
      gradingTable: [
        { maxSeconds: 75.7, grade: 1, noteLabel: 'sehr gut' },
        { maxSeconds: 79.5, grade: 2, noteLabel: 'gut' },
        { maxSeconds: 84.2, grade: 3, noteLabel: 'befriedigend' },
        { maxSeconds: 90.0, grade: 4, noteLabel: 'ausreichend' },
        { maxSeconds: 98.0, grade: 5, noteLabel: 'mangelhaft' },
        { maxSeconds: null, grade: 6, noteLabel: 'ungenuegend' }
      ]
    },
    {
      id: 'ap_50m_abschleppen',
      name: '50m Abschleppen AP',
      inputType: 'time',
      inputPlaceholder: 'z. B. 01:43,2',
      gradingTable: [
        { maxSeconds: 90.6, grade: 1, noteLabel: 'sehr gut' },
        { maxSeconds: 98.3, grade: 2, noteLabel: 'gut' },
        { maxSeconds: 108.8, grade: 3, noteLabel: 'befriedigend' },
        { maxSeconds: 120.0, grade: 4, noteLabel: 'ausreichend' },
        { maxSeconds: null, grade: 5, noteLabel: 'mangelhaft' }
      ]
    },
    {
      id: 'ap_35m_tauch',
      name: '35m Streckentauchen AP',
      inputType: 'time_distance',
      inputPlaceholder: 'z. B. 00:33,6',
      distancePlaceholder: 'Strecke in m (z. B. 35)',
      gradingTable: [
        { maxSeconds: 26.7, grade: 1, noteLabel: 'sehr gut' },
        { maxSeconds: 30.0, grade: 2, noteLabel: 'gut' },
        { maxSeconds: 34.2, grade: 3, noteLabel: 'befriedigend' },
        { maxSeconds: null, grade: 4, noteLabel: 'ausreichend' }
      ]
    }
  ]
};

const padTime = (value) => {
  const normalized = Number(value);
  if (!Number.isFinite(normalized)) return '00';
  return String(normalized).padStart(2, '0');
};

export const parseExamTimeToSeconds = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  const normalizedRaw = raw.replace(',', '.');
  if (/^\d+:\d{1,2}([.]\d+)?$/.test(normalizedRaw)) {
    const [minutesRaw, secondsRaw] = normalizedRaw.split(':');
    const minutes = Number(minutesRaw);
    const seconds = Number(secondsRaw);
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return null;
    if (minutes < 0 || seconds < 0 || seconds >= 60) return null;
    return (minutes * 60) + seconds;
  }

  const parsed = Number(normalizedRaw);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
};

export const formatSecondsAsTime = (value) => {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return '-';
  const rounded = Math.round(seconds * 10) / 10;
  const minutesPart = Math.floor(rounded / 60);
  const secondsPart = rounded - (minutesPart * 60);
  const formattedSeconds = secondsPart
    .toFixed(1)
    .replace('.', ',');
  const [secInt, secDec] = formattedSeconds.split(',');
  return `${padTime(minutesPart)}:${padTime(secInt)},${secDec}`;
};

const normalizeNoteText = (value) => String(value ?? '')
  .trim()
  .toLowerCase()
  .replace('ä', 'ae')
  .replace('ö', 'oe')
  .replace('ü', 'ue')
  .replace('ß', 'ss')
  .replace(/\./g, '');

const normalizeGradeRow = (row) => {
  const grade = toNumericGrade(row.grade ?? row.noteLabel);
  if (!grade) return null;
  return {
    ...row,
    grade,
    noteLabel: row.noteLabel || GRADE_LABELS[grade] || `Note ${grade}`
  };
};

export const resolveGradeFromTable = (seconds, gradingTable = []) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  if (!Array.isArray(gradingTable) || gradingTable.length === 0) return null;

  const normalizedRows = gradingTable
    .map(normalizeGradeRow)
    .filter(Boolean);
  if (normalizedRows.length === 0) return null;

  const finiteRows = normalizedRows
    .filter(row => Number.isFinite(Number(row.maxSeconds)))
    .map(row => ({ ...row, maxSeconds: Number(row.maxSeconds) }))
    .sort((a, b) => a.maxSeconds - b.maxSeconds);

  for (const row of finiteRows) {
    if (seconds <= row.maxSeconds) {
      return row;
    }
  }

  const openEnd = normalizedRows.find(row => row.maxSeconds == null);
  return openEnd || finiteRows[finiteRows.length - 1] || null;
};

export const toNumericGrade = (value) => {
  const normalized = String(value ?? '').trim().replace(',', '.');
  if (!normalized) return null;

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
};

export const formatGradeLabel = (gradeInput, noteLabelInput = null) => {
  const grade = toNumericGrade(gradeInput);
  if (!grade) return null;
  const noteLabel = noteLabelInput || GRADE_LABELS[grade];
  return `Note ${grade} (${noteLabel})`;
};

const parseDistanceMeters = (value) => {
  const raw = String(value ?? '').trim().replace(',', '.');
  if (!raw) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.floor(parsed);
};

const resolveDistanceDiveDiscipline = (discipline, inputValues, targetDistanceMeters, minDistanceForGrade5) => {
  const rawTime = String(inputValues[discipline.id] ?? '').trim();
  const rawDistance = String(inputValues[`${discipline.id}_distance`] ?? '').trim();
  const seconds = parseExamTimeToSeconds(rawTime);
  const distanceMeters = parseDistanceMeters(rawDistance);

  if (!distanceMeters) {
    return {
      missingRequired: true,
      displayValue: '-',
      grade: null,
      noteLabel: null,
      gradingMissing: false,
      points: null
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
        points: null
      };
    }

    const tableHit = resolveGradeFromTable(seconds, discipline.gradingTable);
    return {
      missingRequired: false,
      displayValue: `${formatSecondsAsTime(seconds)} bei ${distanceMeters}m`,
      grade: tableHit?.grade ?? null,
      noteLabel: tableHit?.noteLabel ?? null,
      gradingMissing: !tableHit,
      points: null,
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
};

export const resolvePracticalDisciplineResult = (discipline, inputValues = {}) => {
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
      points: null
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
    seconds: seconds || null
  };
};
