import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  loadBerichtsheftEntriesFromDb as dsLoadBerichtsheftEntries,
  saveBerichtsheftEntry as dsSaveBerichtsheft,
  deleteBerichtsheftEntry as dsDeleteBerichtsheft,
  loadBerichtsheftPending as dsLoadBerichtsheftPending,
  assignBerichtsheftTrainerEntry as dsAssignBerichtsheftTrainer,
  upsertBerichtsheftDraft as dsUpsertBerichtsheftDraft,
  deleteBerichtsheftDraftByWeek as dsDeleteBerichtsheftDraft,
  updateBerichtsheftProfile as dsUpdateBerichtsheftProfile,
  loadBerichtsheftProfile as dsLoadBerichtsheftProfile,
  getAuthorizedReviewers as dsGetAuthorizedReviewers,
} from '../lib/dataService';
import { friendlyError } from '../lib/friendlyError';
import { AUSBILDUNGSRAHMENPLAN } from '../data/ausbildungsrahmenplan';

// ── Constants ────────────────────────────────────────────────
const BERICHTSHEFT_DRAFT_STORAGE_KEY = 'berichtsheft_drafts_v1';
const BERICHTSHEFT_DAY_KEYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

// ── Pure helpers ─────────────────────────────────────────────
const parseJsonSafe = (value, fallback) => {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const toTimestampMs = (value) => {
  const timestamp = Date.parse(String(value || ''));
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const getWeekStartStamp = (input = Date.now()) => {
  const base = new Date(input);
  if (Number.isNaN(base.getTime())) return '';
  const date = new Date(base);
  const day = date.getDay();
  const offsetToMonday = (day + 6) % 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - offsetToMonday);
  return date.toISOString().slice(0, 10);
};

const getWeekEndDate = (startDate) => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end.toISOString().split('T')[0];
};

const createEmptyBerichtsheftEntries = () =>
  BERICHTSHEFT_DAY_KEYS.reduce((acc, day) => {
    acc[day] = [{ taetigkeit: '', stunden: '', bereich: '' }];
    return acc;
  }, {});

const normalizeBerichtsheftEntries = (value) => {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const normalized = {};
  BERICHTSHEFT_DAY_KEYS.forEach((day) => {
    const rows = Array.isArray(source[day]) ? source[day] : [];
    const mapped = rows
      .filter((row) => row && typeof row === 'object')
      .map((row) => ({
        taetigkeit: String(row.taetigkeit || ''),
        stunden: String(row.stunden || ''),
        bereich: String(row.bereich || ''),
      }));
    normalized[day] = mapped.length > 0 ? mapped : [{ taetigkeit: '', stunden: '', bereich: '' }];
  });
  return normalized;
};

const getBerichtsheftStatus = (entry) =>
  String(entry?.status || 'submitted').trim().toLowerCase();

const isBerichtsheftDraft = (entry) => getBerichtsheftStatus(entry) === 'draft';

const isSignedByAzubi = (entry) => Boolean(String(entry?.signatur_azubi || '').trim());
const isSignedByAusbilder = (entry) => Boolean(String(entry?.signatur_ausbilder || '').trim());

const hasEntryContent = (entry) => {
  if (!entry || !entry.entries || typeof entry.entries !== 'object') return false;
  return Object.values(entry.entries).some(
    (dayRows) =>
      Array.isArray(dayRows) &&
      dayRows.some((row) => String(row?.taetigkeit || '').trim() !== '')
  );
};

const isBerichtsheftReadyForReview = (entry) =>
  hasEntryContent(entry) && isSignedByAzubi(entry) && !isSignedByAusbilder(entry);

const calculateTotalHoursFromEntries = (entries) =>
  BERICHTSHEFT_DAY_KEYS.reduce((sum, day) => {
    const rows = Array.isArray(entries?.[day]) ? entries[day] : [];
    const daySum = rows.reduce((innerSum, row) => innerSum + (parseFloat(row?.stunden) || 0), 0);
    return sum + daySum;
  }, 0);

const normalizeBerichtsheftText = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toBerichtsheftTokens = (value) =>
  normalizeBerichtsheftText(value)
    .split(' ')
    .filter((token) => token.length >= 3);

// ── Hook ─────────────────────────────────────────────────────
/**
 * Extracts all Berichtsheft (Ausbildungsnachweis) logic from App.jsx.
 *
 * @param {object}   deps
 * @param {object}   deps.user            – current user from AuthContext
 * @param {string}   deps.currentView     – active view id
 * @param {Array}    deps.allUsers        – full user list
 * @param {Function} deps.showToast       – toast helper
 * @param {Function} deps.sendNotification – push notification helper
 */
export function useBerichtsheft({ user, currentView, allUsers, showToast, sendNotification }) {
  // ── State ────────────────────────────────────────────────
  const [berichtsheftEntries, setBerichtsheftEntries] = useState([]);
  const [berichtsheftWeek, setBerichtsheftWeek] = useState(() => getWeekStartStamp());
  const [berichtsheftYear, setBerichtsheftYear] = useState(1);
  const [berichtsheftNr, setBerichtsheftNr] = useState(1);
  const [currentWeekEntries, setCurrentWeekEntries] = useState(() =>
    createEmptyBerichtsheftEntries()
  );
  const [berichtsheftBemerkungAzubi, setBerichtsheftBemerkungAzubi] = useState('');
  const [berichtsheftBemerkungAusbilder, setBerichtsheftBemerkungAusbilder] = useState('');
  const [berichtsheftSignaturAzubi, setBerichtsheftSignaturAzubi] = useState('');
  const [berichtsheftSignaturAusbilder, setBerichtsheftSignaturAusbilder] = useState('');
  const [berichtsheftDatumAzubi, setBerichtsheftDatumAzubi] = useState('');
  const [berichtsheftDatumAusbilder, setBerichtsheftDatumAusbilder] = useState('');
  const [selectedBerichtsheft, setSelectedBerichtsheft] = useState(null);
  const [berichtsheftViewMode, setBerichtsheftViewMode] = useState('edit');
  const [berichtsheftPendingSignatures, setBerichtsheftPendingSignatures] = useState([]);
  const [berichtsheftPendingLoading, setBerichtsheftPendingLoading] = useState(false);
  const [berichtsheftServerDraftsByWeek, setBerichtsheftServerDraftsByWeek] = useState({});
  const [berichtsheftRemoteDraftsEnabled, setBerichtsheftRemoteDraftsEnabled] = useState(true);

  // Azubi-Profildaten für Berichtsheft
  const [azubiProfile, setAzubiProfile] = useState(() => {
    const saved = localStorage.getItem('azubi_profile');
    return saved
      ? JSON.parse(saved)
      : {
          vorname: '',
          nachname: '',
          ausbildungsbetrieb: '',
          ausbildungsberuf: 'Fachangestellte/r für Bäderbetriebe',
          ausbilder: '',
          ausbildungsbeginn: '',
          ausbildungsende: '',
        };
  });

  // ── Refs ─────────────────────────────────────────────────
  const azubiProfileSaveTimerRef = useRef(null);
  const berichtsheftDraftSaveTimerRef = useRef(null);
  const berichtsheftRemoteDraftSaveTimerRef = useRef(null);
  const berichtsheftRemoteDraftWarningShownRef = useRef(false);

  // ── Derived ──────────────────────────────────────────────
  const canManageBerichtsheftSignatures = Boolean(
    user && (user.role === 'admin' || user.role === 'trainer' || user.canSignReports)
  );

  // ── Internal helpers ─────────────────────────────────────

  const getBerichtsheftDraftOwnerKey = useCallback(() => {
    if (!user) return '';
    if (user.id) return `id:${user.id}`;
    const normalizedName = String(user.name || '').trim().toLowerCase();
    return normalizedName ? `name:${normalizedName}` : '';
  }, [user]);

  const buildBerichtsheftDraftKey = useCallback(
    (weekStart) => {
      const owner = getBerichtsheftDraftOwnerKey();
      const week = String(weekStart || '').trim();
      if (!owner || !week) return '';
      return `${owner}|${week}`;
    },
    [getBerichtsheftDraftOwnerKey]
  );

  const readBerichtsheftDraftStore = () => {
    const parsed = parseJsonSafe(localStorage.getItem(BERICHTSHEFT_DRAFT_STORAGE_KEY), {});
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed;
  };

  const writeBerichtsheftDraftStore = (store) => {
    localStorage.setItem(BERICHTSHEFT_DRAFT_STORAGE_KEY, JSON.stringify(store));
  };

  const getBerichtsheftServerDraft = useCallback(
    (weekStart) => {
      const week = String(weekStart || '').trim();
      if (!week) return null;
      return berichtsheftServerDraftsByWeek[week] || null;
    },
    [berichtsheftServerDraftsByWeek]
  );

  const upsertBerichtsheftServerDraft = useCallback((draftRow) => {
    const week = String(draftRow?.week_start || '').trim();
    if (!week) return;
    setBerichtsheftServerDraftsByWeek((prev) => {
      const current = prev[week];
      if (!current || toTimestampMs(draftRow.updated_at) >= toTimestampMs(current.updated_at)) {
        return { ...prev, [week]: draftRow };
      }
      return prev;
    });
  }, []);

  const removeBerichtsheftServerDraft = useCallback((weekStart) => {
    const week = String(weekStart || '').trim();
    if (!week) return;
    setBerichtsheftServerDraftsByWeek((prev) => {
      if (!prev[week]) return prev;
      const next = { ...prev };
      delete next[week];
      return next;
    });
  }, []);

  const isBerichtsheftStatusColumnMissingError = (error) => {
    if (!error) return false;
    const code = String(error.code || '').trim();
    if (code === '42703') return true;
    const message = String(error.message || '').toLowerCase();
    const details = String(error.details || '').toLowerCase();
    return (
      (message.includes('status') && message.includes('column')) || details.includes('status')
    );
  };

  const disableBerichtsheftRemoteDrafts = useCallback(
    (error) => {
      if (!isBerichtsheftStatusColumnMissingError(error)) return;
      setBerichtsheftRemoteDraftsEnabled(false);
      setBerichtsheftServerDraftsByWeek({});
      if (!berichtsheftRemoteDraftWarningShownRef.current) {
        showToast('Server-Entwurfs-Sync ist vorübergehend nicht verfügbar.', 'warning');
        berichtsheftRemoteDraftWarningShownRef.current = true;
      }
      console.warn('Berichtsheft Remote-Drafts deaktiviert (status-Spalte fehlt).', error);
    },
    [showToast]
  );

  // ── CRUD / Load ──────────────────────────────────────────

  const loadBerichtsheftEntries = useCallback(async () => {
    if (!user) return;
    try {
      const data = await dsLoadBerichtsheftEntries(user.name);
      const allEntries = Array.isArray(data) ? data : [];
      const submittedEntries = allEntries.filter((entry) => !isBerichtsheftDraft(entry));
      setBerichtsheftEntries(submittedEntries);

      if (submittedEntries.length > 0) {
        const maxNr = Math.max(...submittedEntries.map((e) => e.nachweis_nr || 0));
        setBerichtsheftNr(maxNr + 1);
      } else {
        setBerichtsheftNr(1);
      }
    } catch (err) {
      console.error('Fehler beim Laden des Berichtshefts:', err);
    }
  }, [user]);

  const loadBerichtsheftPendingSignatures = useCallback(async () => {
    if (!user || !canManageBerichtsheftSignatures) {
      setBerichtsheftPendingSignatures([]);
      return;
    }

    setBerichtsheftPendingLoading(true);
    try {
      const data = await dsLoadBerichtsheftPending();
      const allEntries = Array.isArray(data) ? data : [];
      let pending = allEntries.filter(
        (entry) =>
          !isBerichtsheftDraft(entry) &&
          hasEntryContent(entry) &&
          isSignedByAzubi(entry) &&
          !isSignedByAusbilder(entry)
      );

      const isAdmin = user.role === 'admin';
      if (!isAdmin) {
        pending = pending.filter(
          (entry) =>
            !entry.assigned_trainer_id ||
            entry.assigned_trainer_id === user.id ||
            String(entry.assigned_trainer_name || '').trim() ===
              String(user.name || '').trim()
        );
      }

      setBerichtsheftPendingSignatures(pending);
    } catch (err) {
      console.error('Fehler beim Laden offener Berichtshefte:', err);
      setBerichtsheftPendingSignatures([]);
    } finally {
      setBerichtsheftPendingLoading(false);
    }
  }, [user, canManageBerichtsheftSignatures]);

  const notifyBerichtsheftReadyForReview = useCallback(
    async ({ azubiName, weekStart }) => {
      const normalizedAzubiName = String(azubiName || '').trim();
      if (!normalizedAzubiName) return;

      try {
        const reviewers = await dsGetAuthorizedReviewers('can_sign_reports');
        const reviewerNames = [
          ...new Set(reviewers.map((r) => String(r?.name || '').trim()).filter(Boolean)),
        ].filter((name) => name !== normalizedAzubiName);

        if (reviewerNames.length === 0) return;

        let weekLabel = String(weekStart || '').trim();
        if (weekLabel) {
          const weekDate = new Date(weekLabel);
          if (!Number.isNaN(weekDate.getTime())) {
            weekLabel = weekDate.toLocaleDateString('de-DE');
          }
        } else {
          weekLabel = 'unbekannt';
        }

        for (const reviewerName of reviewerNames) {
          await sendNotification(
            reviewerName,
            '📘 Berichtsheft wartet auf Freigabe',
            `${normalizedAzubiName} hat das Berichtsheft für die Woche ab ${weekLabel} abgeschlossen und zur Freigabe eingereicht.`,
            'berichtsheft_pending'
          );
        }
      } catch (error) {
        console.warn('Berichtsheft ready notification failed:', error);
      }
    },
    [sendNotification]
  );

  const assignBerichtsheftTrainer = useCallback(
    async (entryId, trainerId) => {
      if (!entryId || !trainerId) return;

      const trainer = allUsers.find((account) => account.id === trainerId);
      if (!trainer) {
        showToast('Ausbilder nicht gefunden.', 'error');
        return;
      }

      try {
        const payload = {
          assigned_trainer_id: trainerId,
          assigned_trainer_name: trainer.name || null,
          assigned_by_id: user?.id || null,
          assigned_at: new Date().toISOString(),
          trainerId,
          trainerName: trainer.name || null,
        };

        await dsAssignBerichtsheftTrainer(entryId, payload);

        setBerichtsheftPendingSignatures((prev) =>
          prev.map((entry) => (entry.id === entryId ? { ...entry, ...payload } : entry))
        );
        showToast(`Berichtsheft wurde ${trainer.name} zugewiesen.`, 'success');
      } catch (err) {
        console.error('Fehler beim Zuweisen des Berichtshefts:', err);
        showToast('Zuweisung fehlgeschlagen.', 'error');
      }
    },
    [allUsers, user?.id, showToast]
  );

  // ── Draft helpers ────────────────────────────────────────

  const buildBerichtsheftDraftSnapshot = useCallback(
    (weekStart = berichtsheftWeek) => ({
      week_start: String(weekStart || '').trim(),
      ausbildungsjahr: berichtsheftYear,
      nachweis_nr: berichtsheftNr,
      entries: normalizeBerichtsheftEntries(currentWeekEntries),
      bemerkung_azubi: berichtsheftBemerkungAzubi,
      bemerkung_ausbilder: berichtsheftBemerkungAusbilder,
      signatur_azubi: berichtsheftSignaturAzubi,
      signatur_ausbilder: berichtsheftSignaturAusbilder,
      datum_azubi: berichtsheftDatumAzubi,
      datum_ausbilder: berichtsheftDatumAusbilder,
      updated_at: new Date().toISOString(),
    }),
    [
      berichtsheftWeek,
      berichtsheftYear,
      berichtsheftNr,
      currentWeekEntries,
      berichtsheftBemerkungAzubi,
      berichtsheftBemerkungAusbilder,
      berichtsheftSignaturAzubi,
      berichtsheftSignaturAusbilder,
      berichtsheftDatumAzubi,
      berichtsheftDatumAusbilder,
    ]
  );

  const hasBerichtsheftDraftContent = (snapshot) => {
    if (!snapshot) return false;
    const hasDayContent = Object.values(snapshot.entries || {}).some(
      (rows) =>
        Array.isArray(rows) &&
        rows.some(
          (row) =>
            String(row?.taetigkeit || '').trim() !== '' ||
            String(row?.stunden || '').trim() !== '' ||
            String(row?.bereich || '').trim() !== ''
        )
    );
    if (hasDayContent) return true;
    return (
      String(snapshot.bemerkung_azubi || '').trim() !== '' ||
      String(snapshot.bemerkung_ausbilder || '').trim() !== '' ||
      String(snapshot.signatur_azubi || '').trim() !== '' ||
      String(snapshot.signatur_ausbilder || '').trim() !== '' ||
      String(snapshot.datum_azubi || '').trim() !== '' ||
      String(snapshot.datum_ausbilder || '').trim() !== ''
    );
  };

  // ── Server-draft operations ──────────────────────────────

  const findBerichtsheftServerDraftByWeek = useCallback(
    async (weekStart) => {
      const week = String(weekStart || '').trim();
      if (!week || !user || !berichtsheftRemoteDraftsEnabled) return null;

      const cached = getBerichtsheftServerDraft(week);
      if (cached?.id) return cached;

      try {
        const entries = await dsLoadBerichtsheftEntries(user.name);
        const row = entries
          .filter(
            (entry) =>
              entry.status === 'draft' && String(entry.week_start || '').trim() === week
          )
          .reduce((latest, entry) => {
            if (!latest) return entry;
            return toTimestampMs(entry.updated_at) >= toTimestampMs(latest.updated_at)
              ? entry
              : latest;
          }, null);
        if (row) upsertBerichtsheftServerDraft(row);
        return row;
      } catch (error) {
        disableBerichtsheftRemoteDrafts(error);
        if (!isBerichtsheftStatusColumnMissingError(error)) {
          console.warn('Berichtsheft-Serverentwurf konnte nicht abgefragt werden:', error);
        }
        return null;
      }
    },
    [
      user,
      berichtsheftRemoteDraftsEnabled,
      getBerichtsheftServerDraft,
      upsertBerichtsheftServerDraft,
      disableBerichtsheftRemoteDrafts,
    ]
  );

  const loadBerichtsheftServerDrafts = useCallback(async () => {
    if (!user || !berichtsheftRemoteDraftsEnabled) {
      setBerichtsheftServerDraftsByWeek({});
      return;
    }

    try {
      const entries = await dsLoadBerichtsheftEntries(user.name);
      const data = entries.filter((entry) => entry.status === 'draft');

      const map = {};
      (Array.isArray(data) ? data : []).forEach((row) => {
        const week = String(row?.week_start || '').trim();
        if (!week) return;
        const prev = map[week];
        if (!prev || toTimestampMs(row.updated_at) >= toTimestampMs(prev.updated_at)) {
          map[week] = row;
        }
      });
      setBerichtsheftServerDraftsByWeek(map);
      return map;
    } catch (error) {
      disableBerichtsheftRemoteDrafts(error);
      if (!isBerichtsheftStatusColumnMissingError(error)) {
        console.warn('Berichtsheft-Serverentwuerfe konnten nicht geladen werden:', error);
      }
      return null;
    }
  }, [user, berichtsheftRemoteDraftsEnabled, disableBerichtsheftRemoteDrafts]);

  // ── Local draft persist ──────────────────────────────────

  const persistBerichtsheftDraft = useCallback(
    (weekStart = berichtsheftWeek) => {
      if (!user || selectedBerichtsheft) return;
      const draftKey = buildBerichtsheftDraftKey(weekStart);
      if (!draftKey) return;

      const snapshot = buildBerichtsheftDraftSnapshot(weekStart);

      const store = readBerichtsheftDraftStore();
      if (!hasBerichtsheftDraftContent(snapshot)) {
        if (store[draftKey]) {
          delete store[draftKey];
          writeBerichtsheftDraftStore(store);
        }
        return;
      }

      store[draftKey] = snapshot;
      writeBerichtsheftDraftStore(store);
    },
    [user, selectedBerichtsheft, berichtsheftWeek, buildBerichtsheftDraftKey, buildBerichtsheftDraftSnapshot]
  );

  const persistBerichtsheftDraftRemote = useCallback(
    async (weekStart = berichtsheftWeek) => {
      if (!user || selectedBerichtsheft || !berichtsheftRemoteDraftsEnabled) return;

      const snapshot = buildBerichtsheftDraftSnapshot(weekStart);
      const targetWeek = String(snapshot.week_start || '').trim();
      if (!targetWeek) return;

      const existingDraft = await findBerichtsheftServerDraftByWeek(targetWeek);
      const hasContent = hasBerichtsheftDraftContent(snapshot);

      if (!hasContent) {
        if (existingDraft?.id) {
          try {
            await dsDeleteBerichtsheftDraft(targetWeek, { draftId: existingDraft.id });
            removeBerichtsheftServerDraft(targetWeek);
          } catch (error) {
            disableBerichtsheftRemoteDrafts(error);
            if (!isBerichtsheftStatusColumnMissingError(error)) {
              console.warn(
                'Leerer Berichtsheft-Serverentwurf konnte nicht entfernt werden:',
                error
              );
            }
          }
        }
        return;
      }

      const payload = {
        user_name: user.name,
        userName: user.name,
        week_start: targetWeek,
        weekStart: targetWeek,
        week_end: getWeekEndDate(targetWeek),
        weekEnd: getWeekEndDate(targetWeek),
        ausbildungsjahr: snapshot.ausbildungsjahr,
        trainingYear: snapshot.ausbildungsjahr,
        nachweis_nr: snapshot.nachweis_nr,
        reportNumber: snapshot.nachweis_nr,
        entries: snapshot.entries,
        bemerkung_azubi: snapshot.bemerkung_azubi,
        azubiRemarks: snapshot.bemerkung_azubi,
        bemerkung_ausbilder: snapshot.bemerkung_ausbilder,
        trainerRemarks: snapshot.bemerkung_ausbilder,
        signatur_azubi: snapshot.signatur_azubi,
        azubiSignature: snapshot.signatur_azubi,
        signatur_ausbilder: snapshot.signatur_ausbilder,
        trainerSignature: snapshot.signatur_ausbilder,
        datum_azubi: snapshot.datum_azubi || null,
        azubiDate: snapshot.datum_azubi || null,
        datum_ausbilder: snapshot.datum_ausbilder || null,
        trainerDate: snapshot.datum_ausbilder || null,
        total_hours: calculateTotalHoursFromEntries(snapshot.entries),
        totalHours: calculateTotalHoursFromEntries(snapshot.entries),
        status: 'draft',
      };

      try {
        const savedRow = await dsUpsertBerichtsheftDraft({
          ...payload,
          existingDraftId: existingDraft?.id || undefined,
        });
        if (savedRow) upsertBerichtsheftServerDraft(savedRow);
      } catch (error) {
        disableBerichtsheftRemoteDrafts(error);
        if (!isBerichtsheftStatusColumnMissingError(error)) {
          console.warn('Berichtsheft-Serverentwurf konnte nicht gespeichert werden:', error);
        }
      }
    },
    [
      user,
      selectedBerichtsheft,
      berichtsheftWeek,
      berichtsheftRemoteDraftsEnabled,
      buildBerichtsheftDraftSnapshot,
      findBerichtsheftServerDraftByWeek,
      removeBerichtsheftServerDraft,
      upsertBerichtsheftServerDraft,
      disableBerichtsheftRemoteDrafts,
    ]
  );

  const clearBerichtsheftDraft = useCallback(
    (weekStart = berichtsheftWeek) => {
      const draftKey = buildBerichtsheftDraftKey(weekStart);
      if (!draftKey) return;
      const store = readBerichtsheftDraftStore();
      if (!store[draftKey]) return;
      delete store[draftKey];
      writeBerichtsheftDraftStore(store);
    },
    [berichtsheftWeek, buildBerichtsheftDraftKey]
  );

  const clearBerichtsheftDraftRemote = useCallback(
    async (weekStart = berichtsheftWeek) => {
      if (!user || !berichtsheftRemoteDraftsEnabled) return;
      const week = String(weekStart || '').trim();
      if (!week) return;

      const existingDraft = await findBerichtsheftServerDraftByWeek(week);
      if (!existingDraft?.id) {
        removeBerichtsheftServerDraft(week);
        return;
      }

      try {
        await dsDeleteBerichtsheftDraft(week, { draftId: existingDraft.id });
        removeBerichtsheftServerDraft(week);
      } catch (error) {
        disableBerichtsheftRemoteDrafts(error);
        if (!isBerichtsheftStatusColumnMissingError(error)) {
          console.warn('Berichtsheft-Serverentwurf konnte nicht geloescht werden:', error);
        }
      }
    },
    [
      user,
      berichtsheftWeek,
      berichtsheftRemoteDraftsEnabled,
      findBerichtsheftServerDraftByWeek,
      removeBerichtsheftServerDraft,
      disableBerichtsheftRemoteDrafts,
    ]
  );

  // ── Load draft for a given week ──────────────────────────

  const loadBerichtsheftDraftForWeek = useCallback(
    (weekStart, options = {}) => {
      if (!user) return false;
      const targetWeek = String(weekStart || '').trim();
      if (!targetWeek) return false;

      const { resetIfMissing = false, serverDraftMap = null } = options;
      const draftKey = buildBerichtsheftDraftKey(targetWeek);
      const store = readBerichtsheftDraftStore();
      const localDraft = draftKey ? store[draftKey] : null;
      const remoteMap =
        serverDraftMap && typeof serverDraftMap === 'object'
          ? serverDraftMap
          : berichtsheftServerDraftsByWeek;
      const remoteDraft = remoteMap[targetWeek] || null;

      let draft = null;
      if (localDraft && remoteDraft) {
        draft =
          toTimestampMs(localDraft.updated_at) >= toTimestampMs(remoteDraft.updated_at)
            ? localDraft
            : remoteDraft;
      } else {
        draft = localDraft || remoteDraft;
      }

      if (draft && typeof draft === 'object') {
        const parsedYear = Number(draft.ausbildungsjahr);
        const parsedNr = Number(draft.nachweis_nr);
        setSelectedBerichtsheft(null);
        setBerichtsheftWeek(targetWeek);
        setBerichtsheftYear(parsedYear >= 1 && parsedYear <= 3 ? parsedYear : 1);
        setBerichtsheftNr(Number.isFinite(parsedNr) ? Math.max(1, Math.round(parsedNr)) : 1);
        setCurrentWeekEntries(normalizeBerichtsheftEntries(draft.entries));
        setBerichtsheftBemerkungAzubi(String(draft.bemerkung_azubi || ''));
        setBerichtsheftBemerkungAusbilder(String(draft.bemerkung_ausbilder || ''));
        setBerichtsheftSignaturAzubi(String(draft.signatur_azubi || ''));
        setBerichtsheftSignaturAusbilder(String(draft.signatur_ausbilder || ''));
        setBerichtsheftDatumAzubi(String(draft.datum_azubi || ''));
        setBerichtsheftDatumAusbilder(String(draft.datum_ausbilder || ''));
        return true;
      }

      if (resetIfMissing) {
        setSelectedBerichtsheft(null);
        setBerichtsheftWeek(targetWeek);
        setCurrentWeekEntries(createEmptyBerichtsheftEntries());
        setBerichtsheftBemerkungAzubi('');
        setBerichtsheftBemerkungAusbilder('');
        setBerichtsheftSignaturAzubi('');
        setBerichtsheftSignaturAusbilder('');
        setBerichtsheftDatumAzubi('');
        setBerichtsheftDatumAusbilder('');
      }
      return false;
    },
    [user, buildBerichtsheftDraftKey, berichtsheftServerDraftsByWeek]
  );

  // ── Week change handler ──────────────────────────────────

  const handleBerichtsheftWeekChange = useCallback(
    (nextWeek) => {
      const targetWeek = String(nextWeek || '').trim();
      if (!targetWeek) return;

      if (!selectedBerichtsheft) {
        if (berichtsheftDraftSaveTimerRef.current) {
          clearTimeout(berichtsheftDraftSaveTimerRef.current);
          berichtsheftDraftSaveTimerRef.current = null;
        }
        if (berichtsheftRemoteDraftSaveTimerRef.current) {
          clearTimeout(berichtsheftRemoteDraftSaveTimerRef.current);
          berichtsheftRemoteDraftSaveTimerRef.current = null;
        }
        persistBerichtsheftDraft(berichtsheftWeek);
        void persistBerichtsheftDraftRemote(berichtsheftWeek);
        loadBerichtsheftDraftForWeek(targetWeek, { resetIfMissing: true });
        return;
      }

      setBerichtsheftWeek(targetWeek);
    },
    [
      selectedBerichtsheft,
      berichtsheftWeek,
      persistBerichtsheftDraft,
      persistBerichtsheftDraftRemote,
      loadBerichtsheftDraftForWeek,
    ]
  );

  // ── Form actions ─────────────────────────────────────────

  const resetBerichtsheftForm = useCallback(() => {
    setCurrentWeekEntries(createEmptyBerichtsheftEntries());
    setBerichtsheftBemerkungAzubi('');
    setBerichtsheftBemerkungAusbilder('');
    setBerichtsheftSignaturAzubi('');
    setBerichtsheftSignaturAusbilder('');
    setBerichtsheftDatumAzubi('');
    setBerichtsheftDatumAusbilder('');
    setSelectedBerichtsheft(null);
  }, []);

  const openBerichtsheftDraftForCurrentWeek = useCallback(() => {
    if (berichtsheftDraftSaveTimerRef.current) {
      clearTimeout(berichtsheftDraftSaveTimerRef.current);
      berichtsheftDraftSaveTimerRef.current = null;
    }
    if (berichtsheftRemoteDraftSaveTimerRef.current) {
      clearTimeout(berichtsheftRemoteDraftSaveTimerRef.current);
      berichtsheftRemoteDraftSaveTimerRef.current = null;
    }
    const currentWeek = getWeekStartStamp();
    loadBerichtsheftDraftForWeek(currentWeek, { resetIfMissing: true });
    setBerichtsheftViewMode('edit');
  }, [loadBerichtsheftDraftForWeek]);

  const addWeekEntry = useCallback((day) => {
    setCurrentWeekEntries((prev) => ({
      ...prev,
      [day]: [...prev[day], { taetigkeit: '', stunden: '', bereich: '' }],
    }));
  }, []);

  const updateWeekEntry = useCallback((day, index, field, value) => {
    setCurrentWeekEntries((prev) => ({
      ...prev,
      [day]: prev[day].map((entry, i) => (i === index ? { ...entry, [field]: value } : entry)),
    }));
  }, []);

  const removeWeekEntry = useCallback(
    (day, index) => {
      if (currentWeekEntries[day].length <= 1) return;
      setCurrentWeekEntries((prev) => ({
        ...prev,
        [day]: prev[day].filter((_, i) => i !== index),
      }));
    },
    [currentWeekEntries]
  );

  const calculateDayHours = useCallback(
    (day) =>
      currentWeekEntries[day].reduce((sum, entry) => {
        const hours = parseFloat(entry.stunden) || 0;
        return sum + hours;
      }, 0),
    [currentWeekEntries]
  );

  const calculateTotalHours = useCallback(
    () =>
      Object.keys(currentWeekEntries).reduce(
        (sum, day) => sum + calculateDayHours(day),
        0
      ),
    [currentWeekEntries, calculateDayHours]
  );

  // ── Bereich suggestions ──────────────────────────────────

  const getBerichtsheftYearWeeks = useCallback((bereich, year) => {
    const key = `jahr${year}`;
    const value = Number(bereich?.wochen?.[key]);
    return Number.isFinite(value) ? value : 0;
  }, []);

  const getBerichtsheftBereichSuggestions = useCallback(
    (taetigkeit, year) => {
      const taetigkeitTokens = toBerichtsheftTokens(taetigkeit);
      if (taetigkeitTokens.length === 0) return [];

      const scored = AUSBILDUNGSRAHMENPLAN.map((bereich) => {
        const keywordSet = new Set();
        [bereich.bereich, ...(bereich.inhalte || [])].forEach((text) => {
          toBerichtsheftTokens(text).forEach((token) => keywordSet.add(token));
        });

        let matchCount = 0;
        taetigkeitTokens.forEach((token) => {
          if (keywordSet.has(token)) matchCount += 1;
        });

        const yearWeeks = getBerichtsheftYearWeeks(bereich, year);
        const score = matchCount * 3 + (yearWeeks > 0 ? 1 : 0);

        return { bereich, score, matchCount, yearWeeks };
      }).sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
        if (b.yearWeeks !== a.yearWeeks) return b.yearWeeks - a.yearWeeks;
        return a.bereich.nr - b.bereich.nr;
      });

      return scored.filter((item) => item.matchCount > 0).slice(0, 3);
    },
    [getBerichtsheftYearWeeks]
  );

  // ── Save / Edit / Delete ─────────────────────────────────

  const saveBerichtsheft = useCallback(async () => {
    if (berichtsheftDraftSaveTimerRef.current) {
      clearTimeout(berichtsheftDraftSaveTimerRef.current);
      berichtsheftDraftSaveTimerRef.current = null;
    }
    if (berichtsheftRemoteDraftSaveTimerRef.current) {
      clearTimeout(berichtsheftRemoteDraftSaveTimerRef.current);
      berichtsheftRemoteDraftSaveTimerRef.current = null;
    }

    const hasContent = Object.values(currentWeekEntries).some((day) =>
      day.some((entry) => entry.taetigkeit.trim() !== '')
    );

    if (!hasContent) {
      toast.error('Bitte mindestens eine Taetigkeit eintragen');
      return;
    }

    try {
      const existingServerDraft =
        !selectedBerichtsheft && berichtsheftRemoteDraftsEnabled
          ? await findBerichtsheftServerDraftByWeek(berichtsheftWeek)
          : null;
      const persistedEntry = selectedBerichtsheft || existingServerDraft;
      const targetUserName = persistedEntry?.user_name || user.name;
      const wasReadyForReview = Boolean(
        persistedEntry && isBerichtsheftReadyForReview(persistedEntry)
      );
      const berichtsheftData = {
        user_name: targetUserName,
        week_start: berichtsheftWeek,
        week_end: getWeekEndDate(berichtsheftWeek),
        ausbildungsjahr: berichtsheftYear,
        nachweis_nr: berichtsheftNr,
        entries: currentWeekEntries,
        bemerkung_azubi: berichtsheftBemerkungAzubi,
        bemerkung_ausbilder: berichtsheftBemerkungAusbilder,
        signatur_azubi: berichtsheftSignaturAzubi,
        signatur_ausbilder: berichtsheftSignaturAusbilder,
        datum_azubi: berichtsheftDatumAzubi || null,
        datum_ausbilder: berichtsheftDatumAusbilder || null,
        total_hours: calculateTotalHours(),
      };
      if (berichtsheftRemoteDraftsEnabled) {
        berichtsheftData.status = 'submitted';
      }
      const isReadyForReviewNow = isBerichtsheftReadyForReview(berichtsheftData);

      if (persistedEntry) {
        berichtsheftData.assigned_trainer_id = persistedEntry.assigned_trainer_id || null;
        berichtsheftData.assigned_trainer_name = persistedEntry.assigned_trainer_name || null;
        berichtsheftData.assigned_by_id = persistedEntry.assigned_by_id || null;
        berichtsheftData.assigned_at = persistedEntry.assigned_at || null;

        await dsSaveBerichtsheft(berichtsheftData, persistedEntry.id);
        removeBerichtsheftServerDraft(berichtsheftWeek);
        showToast(
          selectedBerichtsheft ? 'Berichtsheft aktualisiert!' : 'Berichtsheft gespeichert!',
          'success'
        );
      } else {
        await dsSaveBerichtsheft(berichtsheftData);
        showToast('Berichtsheft gespeichert!', 'success');
        setBerichtsheftNr((prev) => prev + 1);
      }

      if (isReadyForReviewNow && !wasReadyForReview) {
        await notifyBerichtsheftReadyForReview({
          azubiName: targetUserName,
          weekStart: berichtsheftWeek,
        });
      }

      clearBerichtsheftDraft(berichtsheftWeek);
      await clearBerichtsheftDraftRemote(berichtsheftWeek);
      resetBerichtsheftForm();
      loadBerichtsheftEntries();
      loadBerichtsheftPendingSignatures();
      setBerichtsheftViewMode('list');
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      showToast(friendlyError(err), 'error');
    }
  }, [
    currentWeekEntries,
    selectedBerichtsheft,
    berichtsheftRemoteDraftsEnabled,
    berichtsheftWeek,
    berichtsheftYear,
    berichtsheftNr,
    berichtsheftBemerkungAzubi,
    berichtsheftBemerkungAusbilder,
    berichtsheftSignaturAzubi,
    berichtsheftSignaturAusbilder,
    berichtsheftDatumAzubi,
    berichtsheftDatumAusbilder,
    user,
    showToast,
    calculateTotalHours,
    findBerichtsheftServerDraftByWeek,
    removeBerichtsheftServerDraft,
    notifyBerichtsheftReadyForReview,
    clearBerichtsheftDraft,
    clearBerichtsheftDraftRemote,
    resetBerichtsheftForm,
    loadBerichtsheftEntries,
    loadBerichtsheftPendingSignatures,
  ]);

  const loadBerichtsheftForEdit = useCallback((entry) => {
    setSelectedBerichtsheft(entry);
    setBerichtsheftWeek(entry.week_start);
    setBerichtsheftYear(entry.ausbildungsjahr);
    setBerichtsheftNr(entry.nachweis_nr);
    setCurrentWeekEntries(normalizeBerichtsheftEntries(entry.entries));
    setBerichtsheftBemerkungAzubi(entry.bemerkung_azubi || '');
    setBerichtsheftBemerkungAusbilder(entry.bemerkung_ausbilder || '');
    setBerichtsheftSignaturAzubi(entry.signatur_azubi || '');
    setBerichtsheftSignaturAusbilder(entry.signatur_ausbilder || '');
    setBerichtsheftDatumAzubi(entry.datum_azubi || '');
    setBerichtsheftDatumAusbilder(entry.datum_ausbilder || '');
    setBerichtsheftViewMode('edit');
  }, []);

  const deleteBerichtsheft = useCallback(
    async (id) => {
      if (!confirm('Berichtsheft wirklich löschen?')) return;
      try {
        await dsDeleteBerichtsheft(id);
        loadBerichtsheftEntries();
        loadBerichtsheftPendingSignatures();
      } catch (err) {
        console.error('Fehler beim Löschen:', err);
      }
    },
    [loadBerichtsheftEntries, loadBerichtsheftPendingSignatures]
  );

  // ── Progress / PDF ───────────────────────────────────────

  const calculateBereichProgress = useCallback(() => {
    const progress = {};
    AUSBILDUNGSRAHMENPLAN.forEach((bereich) => {
      progress[bereich.nr] = {
        name: bereich.bereich,
        icon: bereich.icon,
        color: bereich.color,
        sollWochen: bereich.gesamtWochen,
        istStunden: 0,
      };
    });

    berichtsheftEntries.forEach((entry) => {
      if (entry.entries) {
        Object.values(entry.entries).forEach((day) => {
          day.forEach((item) => {
            if (item.bereich && item.stunden) {
              const bereichNr = parseInt(item.bereich);
              if (progress[bereichNr]) {
                progress[bereichNr].istStunden += parseFloat(item.stunden) || 0;
              }
            }
          });
        });
      }
    });

    return progress;
  }, [berichtsheftEntries]);

  const generateBerichtsheftPDF = useCallback(
    (entry) => {
      const weekStart = new Date(entry.week_start);
      const weekEnd = new Date(entry.week_end);

      const formatDate = (date) =>
        new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long' });

      const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

      let tableRows = '';
      let runningTotal = 0;

      days.forEach((day) => {
        const dayEntries = entry.entries?.[day] || [];
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + days.indexOf(day));

        let dayHours = 0;
        let dayContent = '';

        dayEntries.forEach((e) => {
          if (e.taetigkeit) {
            const bereich = AUSBILDUNGSRAHMENPLAN.find((b) => b.nr === parseInt(e.bereich));
            dayContent += `<div style="margin-bottom: 3px;">${e.taetigkeit}${bereich ? ` <small style="color: #555;">(${bereich.bereich})</small>` : ''}</div>`;
            dayHours += parseFloat(e.stunden) || 0;
          }
        });

        runningTotal += dayHours;

        tableRows += `
        <tr>
          <td style="font-weight: bold; width: 35px; text-align: center;">${day}</td>
          <td style="min-height: 40px;">${dayContent || '-'}</td>
          <td style="text-align: center; width: 65px;">${dayHours > 0 ? dayHours : '-'}</td>
          <td style="text-align: center; width: 65px;">${dayHours > 0 ? runningTotal : ''}</td>
          <td style="width: 120px;"></td>
        </tr>
      `;
      });

      const profileName =
        azubiProfile.vorname && azubiProfile.nachname
          ? `${azubiProfile.vorname} ${azubiProfile.nachname}`
          : user?.name || '';

      const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ausbildungsnachweis Nr. ${entry.nachweis_nr}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #000;
            max-width: 210mm;
            margin: 0 auto;
            padding: 15mm;
          }
          h1 {
            text-align: center;
            font-size: 16px;
            margin: 0 0 12px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #333;
          }
          .header-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3px 20px;
            margin-bottom: 12px;
            padding: 8px 10px;
            border: 1px solid #999;
            background: #fafafa;
            font-size: 11px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
          }
          th {
            background: #e8e8e8;
            border: 1px solid #333;
            padding: 5px;
            text-align: left;
            font-size: 10px;
          }
          td {
            border: 1px solid #333;
            padding: 5px;
            font-size: 11px;
            vertical-align: top;
          }
        </style>
      </head>
      <body>
        <h1>Ausbildungsnachweis</h1>

        <div class="header-grid">
          <div><strong>Name:</strong> ${profileName}</div>
          <div><strong>Nachweis Nr.:</strong> ${entry.nachweis_nr}</div>
          <div><strong>Ausbildungsbetrieb:</strong> ${azubiProfile.ausbildungsbetrieb || ''}</div>
          <div><strong>Ausbildungsberuf:</strong> ${azubiProfile.ausbildungsberuf || 'Fachangestellte/r für Bäderbetriebe'}</div>
          <div><strong>Ausbilder/in:</strong> ${azubiProfile.ausbilder || ''}</div>
          <div><strong>Ausbildungsbeginn:</strong> ${azubiProfile.ausbildungsbeginn ? new Date(azubiProfile.ausbildungsbeginn).toLocaleDateString('de-DE') : ''}</div>
          <div><strong>Woche vom:</strong> ${formatDate(entry.week_start)} bis ${formatDate(entry.week_end)} ${weekEnd.getFullYear()}</div>
          <div><strong>Ausbildungsjahr:</strong> ${entry.ausbildungsjahr}. Ausbildungsjahr</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Ausgeführte Arbeiten, Unterricht usw.</th>
              <th>Einzel-std.</th>
              <th>Gesamt-std.</th>
              <th>Abteilung</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            <tr>
              <td colspan="2" style="text-align: right; font-weight: bold;">Wochenstunden gesamt:</td>
              <td style="text-align: center; font-weight: bold;">${entry.total_hours || 0}</td>
              <td style="text-align: center; font-weight: bold;">${runningTotal}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div style="margin-bottom: 15px; page-break-inside: avoid;">
          <strong>Besondere Bemerkungen</strong>
          <div style="display: flex; gap: 15px; margin-top: 8px;">
            <div style="flex: 1; border: 1px solid #333; padding: 8px; min-height: 50px;">
              <small style="color: #555;">Auszubildende/r:</small><br>
              ${entry.bemerkung_azubi || ''}
            </div>
            <div style="flex: 1; border: 1px solid #333; padding: 8px; min-height: 50px;">
              <small style="color: #555;">Ausbilder/in:</small><br>
              ${entry.bemerkung_ausbilder || ''}
            </div>
          </div>
        </div>

        <div style="margin-top: 20px; page-break-inside: avoid;">
          <strong>Für die Richtigkeit</strong>
          <div style="display: flex; gap: 40px; margin-top: 10px;">
            <div style="flex: 1;">
              <div style="margin-bottom: 5px;">Datum: ${entry.datum_azubi ? new Date(entry.datum_azubi).toLocaleDateString('de-DE') : '________________'}</div>
              ${
                entry.signatur_azubi
                  ? `<img src="${entry.signatur_azubi}" style="max-height: 70px; max-width: 220px; display: block; margin: 8px 0;" />`
                  : '<div style="height: 55px;"></div>'
              }
              <div style="border-top: 1px solid #333; padding-top: 4px; font-size: 10px; color: #333;">
                Unterschrift Auszubildende/r
              </div>
            </div>
            <div style="flex: 1;">
              <div style="margin-bottom: 5px;">Datum: ${entry.datum_ausbilder ? new Date(entry.datum_ausbilder).toLocaleDateString('de-DE') : '________________'}</div>
              ${
                entry.signatur_ausbilder
                  ? `<img src="${entry.signatur_ausbilder}" style="max-height: 70px; max-width: 220px; display: block; margin: 8px 0;" />`
                  : '<div style="height: 55px;"></div>'
              }
              <div style="border-top: 1px solid #333; padding-top: 4px; font-size: 10px; color: #333;">
                Unterschrift Ausbilder/in
              </div>
            </div>
          </div>
        </div>

        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 30px; font-size: 16px; cursor: pointer; background: #0ea5e9; color: white; border: none; border-radius: 8px;">
            Drucken / Als PDF speichern
          </button>
        </div>
      </body>
      </html>
    `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
    },
    [azubiProfile, user?.name]
  );

  // ── Azubi profile ────────────────────────────────────────

  const saveAzubiProfile = useCallback(
    (newProfile) => {
      setAzubiProfile(newProfile);
      localStorage.setItem('azubi_profile', JSON.stringify(newProfile));

      if (azubiProfileSaveTimerRef.current) {
        clearTimeout(azubiProfileSaveTimerRef.current);
      }
      azubiProfileSaveTimerRef.current = setTimeout(async () => {
        if (user?.id) {
          try {
            await dsUpdateBerichtsheftProfile(user.id, newProfile);
          } catch (err) {
            console.warn('Berichtsheft-Profil Sync fehlgeschlagen:', err);
          }
        }
      }, 1000);
    },
    [user?.id]
  );

  // ── Effects ──────────────────────────────────────────────

  // Load berichtsheft data when view changes to 'berichtsheft'
  useEffect(() => {
    if (currentView !== 'berichtsheft' || !user) return;

    loadBerichtsheftEntries();
    void loadBerichtsheftServerDrafts().then((map) => {
      if (map && !selectedBerichtsheft) {
        loadBerichtsheftDraftForWeek(berichtsheftWeek, { serverDraftMap: map });
      }
    });

    if (canManageBerichtsheftSignatures) {
      loadBerichtsheftPendingSignatures();
    } else {
      setBerichtsheftPendingSignatures([]);
    }

    // Azubi-Profil aus Backend nachladen falls localStorage leer
    if (user.id && (!azubiProfile.vorname || !azubiProfile.nachname)) {
      (async () => {
        try {
          const profile = await dsLoadBerichtsheftProfile(user.id);
          if (profile) {
            setAzubiProfile(profile);
            localStorage.setItem('azubi_profile', JSON.stringify(profile));
          }
        } catch (err) {
          console.warn('Azubi-Profil nachladen fehlgeschlagen:', err);
        }
      })();
    }
  }, [currentView, user, canManageBerichtsheftSignatures]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset remote draft state on logout
  useEffect(() => {
    if (user) return;
    setBerichtsheftServerDraftsByWeek({});
    setBerichtsheftRemoteDraftsEnabled(true);
    berichtsheftRemoteDraftWarningShownRef.current = false;
  }, [user]);

  // Load draft when week changes
  useEffect(() => {
    if (!user || currentView !== 'berichtsheft' || selectedBerichtsheft) return;
    loadBerichtsheftDraftForWeek(berichtsheftWeek);
  }, [currentView, user?.id, user?.name, selectedBerichtsheft, berichtsheftWeek]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save drafts (local + remote debounced)
  useEffect(() => {
    if (
      !user ||
      currentView !== 'berichtsheft' ||
      berichtsheftViewMode !== 'edit' ||
      selectedBerichtsheft
    )
      return;

    if (berichtsheftDraftSaveTimerRef.current) {
      clearTimeout(berichtsheftDraftSaveTimerRef.current);
    }
    if (berichtsheftRemoteDraftSaveTimerRef.current) {
      clearTimeout(berichtsheftRemoteDraftSaveTimerRef.current);
    }

    berichtsheftDraftSaveTimerRef.current = setTimeout(() => {
      persistBerichtsheftDraft(berichtsheftWeek);
      berichtsheftDraftSaveTimerRef.current = null;
    }, 280);
    berichtsheftRemoteDraftSaveTimerRef.current = setTimeout(() => {
      void persistBerichtsheftDraftRemote(berichtsheftWeek);
      berichtsheftRemoteDraftSaveTimerRef.current = null;
    }, 1500);

    return () => {
      if (berichtsheftDraftSaveTimerRef.current) {
        clearTimeout(berichtsheftDraftSaveTimerRef.current);
        berichtsheftDraftSaveTimerRef.current = null;
      }
      if (berichtsheftRemoteDraftSaveTimerRef.current) {
        clearTimeout(berichtsheftRemoteDraftSaveTimerRef.current);
        berichtsheftRemoteDraftSaveTimerRef.current = null;
      }
    };
  }, [
    user?.id,
    user?.name,
    currentView,
    berichtsheftViewMode,
    selectedBerichtsheft,
    berichtsheftWeek,
    berichtsheftYear,
    berichtsheftNr,
    currentWeekEntries,
    berichtsheftBemerkungAzubi,
    berichtsheftBemerkungAusbilder,
    berichtsheftSignaturAzubi,
    berichtsheftSignaturAusbilder,
    berichtsheftDatumAzubi,
    berichtsheftDatumAusbilder,
  ]);

  // ── Return ───────────────────────────────────────────────
  return {
    // State
    berichtsheftEntries,
    berichtsheftWeek,
    berichtsheftYear,
    berichtsheftNr,
    currentWeekEntries,
    berichtsheftBemerkungAzubi,
    berichtsheftBemerkungAusbilder,
    berichtsheftSignaturAzubi,
    berichtsheftSignaturAusbilder,
    berichtsheftDatumAzubi,
    berichtsheftDatumAusbilder,
    selectedBerichtsheft,
    berichtsheftViewMode,
    berichtsheftPendingSignatures,
    berichtsheftPendingLoading,
    azubiProfile,
    canManageBerichtsheftSignatures,

    // Setters
    setBerichtsheftYear,
    setBerichtsheftNr,
    setBerichtsheftBemerkungAzubi,
    setBerichtsheftBemerkungAusbilder,
    setBerichtsheftSignaturAzubi,
    setBerichtsheftSignaturAusbilder,
    setBerichtsheftDatumAzubi,
    setBerichtsheftDatumAusbilder,
    setBerichtsheftViewMode,
    setBerichtsheftWeek: handleBerichtsheftWeekChange,

    // Actions
    loadBerichtsheftEntries,
    loadBerichtsheftForEdit,
    saveBerichtsheft,
    deleteBerichtsheft,
    resetBerichtsheftForm,
    openBerichtsheftDraftForCurrentWeek,
    assignBerichtsheftTrainer,
    saveAzubiProfile,
    generateBerichtsheftPDF,

    // Entry helpers
    addWeekEntry,
    updateWeekEntry,
    removeWeekEntry,
    calculateDayHours,
    calculateTotalHours,
    calculateBereichProgress,
    getBerichtsheftYearWeeks,
    getBerichtsheftBereichSuggestions,
    getWeekEndDate,
  };
}
