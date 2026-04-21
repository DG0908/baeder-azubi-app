import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, FileText, Info, Loader2, PenTool, Plus, Send, Trash2 } from 'lucide-react';
import {
  assignMonthlyReport,
  deleteMonthlyReport,
  formatMonthlyReportPeriod,
  listMonthlyReports,
  monthLabels,
  signMonthlyReport,
  submitMonthlyReport,
} from '../../../lib/api/monthly-reports';
import { useApp } from '../../../context/AppContext';

const STATUS_META = {
  ASSIGNED: {
    label: 'Zugewiesen',
    colorLight: 'bg-amber-100 text-amber-700 border-amber-200',
    colorDark: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
    icon: ClipboardList,
  },
  SUBMITTED: {
    label: 'Eingereicht',
    colorLight: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    colorDark: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30',
    icon: Send,
  },
  SIGNED: {
    label: 'Gegengezeichnet',
    colorLight: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    colorDark: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
    icon: CheckCircle2,
  },
};

const StatusBadge = ({ status, darkMode }) => {
  const meta = STATUS_META[status] || STATUS_META.ASSIGNED;
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        darkMode ? meta.colorDark : meta.colorLight
      }`}
    >
      <Icon size={12} />
      {meta.label}
    </span>
  );
};

const today = () => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

const BerichtsheftMonthlyView = ({ darkMode, currentUser, allUsers }) => {
  const app = useApp();
  const isTrainer = currentUser?.role === 'admin' || currentUser?.role === 'trainer' || currentUser?.canSignReports;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [draftContentById, setDraftContentById] = useState({});
  const [trainerFeedbackById, setTrainerFeedbackById] = useState({});
  const [assignOpen, setAssignOpen] = useState(false);
  const initialDate = today();
  const [assignForm, setAssignForm] = useState({
    azubiId: '',
    year: initialDate.year,
    month: initialDate.month,
    activity: '',
    activityDescription: '',
  });

  const azubiOptions = useMemo(() => {
    if (!Array.isArray(allUsers)) return [];
    return allUsers
      .filter((account) => account && account.id && (account.role === 'azubi' || account.role === 'rettungsschwimmer_azubi'))
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'de'));
  }, [allUsers]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listMonthlyReports();
      setReports(data);
    } catch (err) {
      console.error(err);
      app?.showToast?.('Monatsberichte konnten nicht geladen werden.', 'error');
    } finally {
      setLoading(false);
    }
  }, [app]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAssign = async (event) => {
    event?.preventDefault?.();
    if (!assignForm.azubiId || !assignForm.activity.trim()) {
      app?.showToast?.('Azubi und Tätigkeit sind Pflichtfelder.', 'warning');
      return;
    }
    setBusyId('assign');
    try {
      await assignMonthlyReport({
        azubiId: assignForm.azubiId,
        year: Number(assignForm.year),
        month: Number(assignForm.month),
        activity: assignForm.activity.trim(),
        activityDescription: assignForm.activityDescription.trim() || undefined,
      });
      app?.showToast?.('Monatsbericht zugewiesen.', 'success');
      setAssignOpen(false);
      const reset = today();
      setAssignForm({ azubiId: '', year: reset.year, month: reset.month, activity: '', activityDescription: '' });
      await load();
    } catch (err) {
      console.error(err);
      app?.showToast?.(err?.message || 'Zuweisung fehlgeschlagen.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleSubmit = async (report) => {
    const content = (draftContentById[report.id] ?? report.content).trim();
    if (content.length < 20) {
      app?.showToast?.('Bitte mindestens 20 Zeichen schreiben.', 'warning');
      return;
    }
    setBusyId(report.id);
    try {
      await submitMonthlyReport(report.id, content);
      app?.showToast?.('Monatsbericht eingereicht.', 'success');
      setDraftContentById((prev) => {
        const next = { ...prev };
        delete next[report.id];
        return next;
      });
      await load();
    } catch (err) {
      console.error(err);
      app?.showToast?.(err?.message || 'Einreichen fehlgeschlagen.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleSign = async (report) => {
    setBusyId(report.id);
    try {
      await signMonthlyReport(report.id, trainerFeedbackById[report.id]?.trim() || undefined);
      app?.showToast?.('Monatsbericht gegengezeichnet.', 'success');
      setTrainerFeedbackById((prev) => {
        const next = { ...prev };
        delete next[report.id];
        return next;
      });
      await load();
    } catch (err) {
      console.error(err);
      app?.showToast?.(err?.message || 'Gegenzeichnung fehlgeschlagen.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (report) => {
    if (!window.confirm(`Monatsbericht ${formatMonthlyReportPeriod(report)} wirklich löschen?`)) return;
    setBusyId(report.id);
    try {
      await deleteMonthlyReport(report.id);
      app?.showToast?.('Monatsbericht gelöscht.', 'success');
      await load();
    } catch (err) {
      console.error(err);
      app?.showToast?.(err?.message || 'Löschen fehlgeschlagen.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const renderReportCard = (report) => {
    const isOwnAzubi = report.azubiId === currentUser?.id;
    const canSubmit = isOwnAzubi && report.status !== 'SIGNED';
    const canSign = isTrainer && report.status === 'SUBMITTED';
    const canDelete = currentUser?.role === 'admin';
    const busy = busyId === report.id;
    const draft = draftContentById[report.id] ?? report.content;

    return (
      <div key={report.id} className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatMonthlyReportPeriod(report)}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Azubi: <span className="font-medium">{report.azubiName}</span> · Tätigkeit: {' '}
              <span className="font-medium">{report.activity}</span>
            </div>
            <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Zugewiesen von {report.assignedByName || '—'}
            </div>
          </div>
          <StatusBadge status={report.status} darkMode={darkMode} />
        </div>

        {report.activityDescription && (
          <div
            className={`rounded-xl p-3 text-sm whitespace-pre-line ${
              darkMode ? 'bg-white/5 text-gray-200' : 'bg-slate-100 text-gray-700'
            }`}
          >
            <div className="text-xs font-semibold mb-1 uppercase tracking-wide opacity-70">Beschreibung</div>
            {report.activityDescription}
          </div>
        )}

        {canSubmit ? (
          <div className="space-y-2">
            <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Dein Monatsbericht
            </label>
            <textarea
              value={draft}
              onChange={(event) => setDraftContentById((prev) => ({ ...prev, [report.id]: event.target.value }))}
              rows={8}
              maxLength={8000}
              placeholder="Beschreibe deine Tätigkeit im Monat: Ablauf, Lernziele, Ergebnisse, Herausforderungen..."
              className={`w-full rounded-xl p-3 text-sm border ${
                darkMode
                  ? 'bg-white/5 text-white border-white/10 placeholder:text-gray-500'
                  : 'bg-white text-gray-900 border-slate-200 placeholder:text-gray-400'
              }`}
            />
            <div className="flex items-center justify-between">
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {draft.length} / 8000 Zeichen
              </span>
              <button
                onClick={() => handleSubmit(report)}
                disabled={busy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/30 disabled:opacity-50"
              >
                {busy ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                {report.status === 'SUBMITTED' ? 'Erneut einreichen' : 'Einreichen'}
              </button>
            </div>
          </div>
        ) : (
          report.content && (
            <div
              className={`rounded-xl p-3 text-sm whitespace-pre-line ${
                darkMode ? 'bg-white/5 text-gray-200' : 'bg-slate-100 text-gray-700'
              }`}
            >
              <div className="text-xs font-semibold mb-1 uppercase tracking-wide opacity-70">Monatsbericht</div>
              {report.content}
            </div>
          )
        )}

        {report.status === 'SIGNED' && report.trainerFeedback && (
          <div
            className={`rounded-xl p-3 text-sm whitespace-pre-line border ${
              darkMode ? 'bg-emerald-500/10 text-emerald-100 border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <div className="text-xs font-semibold mb-1 uppercase tracking-wide opacity-80">
              Feedback von {report.signedByName || 'Ausbilder'}
            </div>
            {report.trainerFeedback}
          </div>
        )}

        {canSign && (
          <div className="space-y-2">
            <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Feedback (optional)
            </label>
            <textarea
              value={trainerFeedbackById[report.id] ?? ''}
              onChange={(event) =>
                setTrainerFeedbackById((prev) => ({ ...prev, [report.id]: event.target.value }))
              }
              rows={3}
              maxLength={2000}
              placeholder="Kurzes Feedback an den Azubi..."
              className={`w-full rounded-xl p-3 text-sm border ${
                darkMode
                  ? 'bg-white/5 text-white border-white/10 placeholder:text-gray-500'
                  : 'bg-white text-gray-900 border-slate-200 placeholder:text-gray-400'
              }`}
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleSign(report)}
                disabled={busy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 disabled:opacity-50"
              >
                {busy ? <Loader2 className="animate-spin" size={16} /> : <PenTool size={16} />}
                Gegenzeichnen
              </button>
            </div>
          </div>
        )}

        {canDelete && (
          <div className="flex justify-end">
            <button
              onClick={() => handleDelete(report)}
              disabled={busy}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                darkMode
                  ? 'border-rose-500/40 text-rose-300 hover:bg-rose-500/10'
                  : 'border-rose-200 text-rose-600 hover:bg-rose-50'
              } disabled:opacity-50`}
            >
              <Trash2 size={14} />
              Löschen
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Info className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} size={20} />
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {isTrainer
              ? 'Weise Azubis einmal im Monat eine Tätigkeit zu. Der Azubi schreibt dann seinen Monatsbericht, den du anschließend gegenzeichnen kannst. Tages- und Wochenberichte bleiben davon unberührt.'
              : 'Hier findest du die dir zugewiesenen Monatsberichte. Du schreibst einen Bericht pro Monat über deine zugewiesene Tätigkeit.'}
          </p>
        </div>
      </div>

      {isTrainer && (
        <div className="flex justify-end">
          <button
            onClick={() => setAssignOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/30"
          >
            <Plus size={16} />
            Monatsbericht zuweisen
          </button>
        </div>
      )}

      {assignOpen && isTrainer && (
        <form onSubmit={handleAssign} className="glass-card rounded-2xl p-5 space-y-3">
          <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Neue Tätigkeit zuweisen</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Azubi</span>
              <select
                value={assignForm.azubiId}
                onChange={(event) => setAssignForm((prev) => ({ ...prev, azubiId: event.target.value }))}
                required
                className={`w-full rounded-xl p-2.5 text-sm border ${
                  darkMode ? 'bg-white/5 text-white border-white/10' : 'bg-white text-gray-900 border-slate-200'
                }`}
              >
                <option value="">-- bitte wählen --</option>
                {azubiOptions.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1 text-sm">
                <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Monat</span>
                <select
                  value={assignForm.month}
                  onChange={(event) => setAssignForm((prev) => ({ ...prev, month: Number(event.target.value) }))}
                  className={`w-full rounded-xl p-2.5 text-sm border ${
                    darkMode ? 'bg-white/5 text-white border-white/10' : 'bg-white text-gray-900 border-slate-200'
                  }`}
                >
                  {monthLabels.map((name, index) => (
                    <option key={name} value={index + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Jahr</span>
                <input
                  type="number"
                  min={2024}
                  max={2100}
                  value={assignForm.year}
                  onChange={(event) => setAssignForm((prev) => ({ ...prev, year: Number(event.target.value) }))}
                  className={`w-full rounded-xl p-2.5 text-sm border ${
                    darkMode ? 'bg-white/5 text-white border-white/10' : 'bg-white text-gray-900 border-slate-200'
                  }`}
                />
              </label>
            </div>
          </div>
          <label className="space-y-1 text-sm block">
            <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Tätigkeit</span>
            <input
              type="text"
              value={assignForm.activity}
              onChange={(event) => setAssignForm((prev) => ({ ...prev, activity: event.target.value }))}
              maxLength={200}
              placeholder="z. B. Wasseraufbereitung, Erste-Hilfe-Übungen..."
              required
              className={`w-full rounded-xl p-2.5 text-sm border ${
                darkMode ? 'bg-white/5 text-white border-white/10 placeholder:text-gray-500' : 'bg-white text-gray-900 border-slate-200 placeholder:text-gray-400'
              }`}
            />
          </label>
          <label className="space-y-1 text-sm block">
            <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Beschreibung (optional)</span>
            <textarea
              value={assignForm.activityDescription}
              onChange={(event) => setAssignForm((prev) => ({ ...prev, activityDescription: event.target.value }))}
              maxLength={2000}
              rows={3}
              placeholder="Was soll der Azubi beobachten / reflektieren?"
              className={`w-full rounded-xl p-2.5 text-sm border ${
                darkMode ? 'bg-white/5 text-white border-white/10 placeholder:text-gray-500' : 'bg-white text-gray-900 border-slate-200 placeholder:text-gray-400'
              }`}
            />
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAssignOpen(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                darkMode ? 'bg-white/5 text-gray-200 hover:bg-white/10' : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
              }`}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={busyId === 'assign'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/30 disabled:opacity-50"
            >
              {busyId === 'assign' ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              Zuweisen
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className={`glass-card rounded-2xl p-6 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Lade Monatsberichte...
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center space-y-2">
          <div className={`inline-flex p-3 rounded-full ${darkMode ? 'bg-cyan-500/20 text-cyan-200' : 'bg-cyan-100 text-cyan-600'}`}>
            <FileText size={24} />
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {isTrainer ? 'Noch keine Monatsberichte zugewiesen.' : 'Dir wurde noch kein Monatsbericht zugewiesen.'}
          </div>
        </div>
      ) : (
        <div className="space-y-3">{reports.map(renderReportCard)}</div>
      )}
    </div>
  );
};

export default BerichtsheftMonthlyView;
