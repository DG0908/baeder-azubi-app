import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  BarChart3,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Clock,
  Download,
  FileText,
  Info,
  ListChecks,
  PenTool,
  Plus,
  Sparkles,
  Trash2,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AUSBILDUNGSRAHMENPLAN } from '../../data/ausbildungsrahmenplan';
import SignatureCanvas from '../ui/SignatureCanvas';

const BerichtsheftView = (props) => {
  const {
    addWeekEntry,
    assignBerichtsheftTrainer,
    azubiProfile,
    berichtsheftBemerkungAusbilder,
    berichtsheftBemerkungAzubi,
    berichtsheftDatumAusbilder,
    berichtsheftDatumAzubi,
    berichtsheftEntries,
    berichtsheftNr,
    berichtsheftPendingLoading,
    berichtsheftPendingSignatures,
    berichtsheftSignaturAusbilder,
    berichtsheftSignaturAzubi,
    berichtsheftViewMode,
    berichtsheftWeek,
    berichtsheftYear,
    canManageBerichtsheftSignatures,
    calculateBereichProgress,
    calculateDayHours,
    calculateTotalHours,
    currentWeekEntries,
    deleteBerichtsheft,
    generateBerichtsheftPDF,
    getBerichtsheftBereichSuggestions,
    getBerichtsheftYearWeeks,
    getWeekEndDate,
    loadBerichtsheftForEdit,
    openBerichtsheftDraftForCurrentWeek,
    removeWeekEntry,
    resetBerichtsheftForm,
    saveAzubiProfile,
    saveBerichtsheft,
    selectedBerichtsheft,
    setBerichtsheftBemerkungAusbilder,
    setBerichtsheftBemerkungAzubi,
    setBerichtsheftDatumAusbilder,
    setBerichtsheftDatumAzubi,
    setBerichtsheftNr,
    setBerichtsheftSignaturAusbilder,
    setBerichtsheftSignaturAzubi,
    setBerichtsheftViewMode,
    setBerichtsheftWeek,
    setBerichtsheftYear,
    signAssignableUsers,
    updateWeekEntry,
  } = props;
  const { user } = useAuth();
  const { darkMode } = useApp();
  const [assignmentSelectionById, setAssignmentSelectionById] = useState({});
  const [expandedBereiche, setExpandedBereiche] = useState(new Set());
  const [expandedEntryHints, setExpandedEntryHints] = useState(new Set());
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const toggleBereich = (nr) => {
    setExpandedBereiche((prev) => {
      const next = new Set(prev);
      next.has(nr) ? next.delete(nr) : next.add(nr);
      return next;
    });
  };

  const toggleEntryHint = (entryKey) => {
    setExpandedEntryHints((prev) => {
      const next = new Set(prev);
      next.has(entryKey) ? next.delete(entryKey) : next.add(entryKey);
      return next;
    });
  };

  const signerOptions = useMemo(() => {
    if (!Array.isArray(signAssignableUsers)) return [];
    return signAssignableUsers
      .filter((account) => account && account.id)
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'de'));
  }, [signAssignableUsers]);

  const formatWeekRange = (entry) => {
    if (!entry?.week_start || !entry?.week_end) return '-';
    const start = new Date(entry.week_start);
    const end = new Date(entry.week_end);
    return `${start.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} - ${end.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  };

  const totalEntries = berichtsheftEntries?.length || 0;
  const signedCount = (berichtsheftEntries || []).filter((e) => e.signatur_azubi && e.signatur_ausbilder).length;
  const openCount = totalEntries - signedCount;
  const totalHoursAll = (berichtsheftEntries || []).reduce((sum, e) => sum + (e.total_hours || 0), 0);

  const inputClass = `w-full px-4 py-2 border rounded-lg transition-colors ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-cyan-400'
      : 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-cyan-500'
  }`;

  const smallInputClass = `w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-cyan-400'
      : 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-cyan-500'
  }`;

  const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
        active
          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
          : darkMode
            ? 'bg-white/5 text-gray-300 hover:bg-white/10'
            : 'bg-white/70 text-gray-700 hover:bg-white'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  const profileIncomplete = !azubiProfile?.vorname || !azubiProfile?.nachname || !azubiProfile?.ausbildungsbetrieb;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <div
        className={`relative overflow-hidden rounded-2xl p-8 text-white shadow-lg ${
          darkMode
            ? 'bg-gradient-to-r from-cyan-900 via-slate-900 to-blue-900'
            : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600'
        }`}
      >
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <BookOpen size={26} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Digitales Berichtsheft</h2>
            </div>
            <p className="text-white/80 text-sm md:text-base">
              Wochenberichte erfassen, unterschreiben und deinen Fortschritt im Blick behalten.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm min-w-[110px]">
              <div className="text-2xl font-bold">{totalEntries}</div>
              <div className="text-xs text-white/80">Wochen</div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm min-w-[110px]">
              <div className="text-2xl font-bold">{signedCount}</div>
              <div className="text-xs text-white/80">Unterschrieben</div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm min-w-[110px]">
              <div className="text-2xl font-bold">{openCount}</div>
              <div className="text-xs text-white/80">Offen</div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm min-w-[110px]">
              <div className="text-2xl font-bold">{totalHoursAll}</div>
              <div className="text-xs text-white/80">Stunden</div>
            </div>
          </div>
        </div>
      </div>

      {/* TAB BAR */}
      <div className="glass-card rounded-2xl p-3">
        <div className="flex flex-wrap gap-2">
          <TabButton
            active={berichtsheftViewMode === 'edit'}
            onClick={openBerichtsheftDraftForCurrentWeek}
            icon={Plus}
            label="Neu"
          />
          <TabButton
            active={berichtsheftViewMode === 'list'}
            onClick={() => setBerichtsheftViewMode('list')}
            icon={ClipboardList}
            label="Übersicht"
          />
          <TabButton
            active={berichtsheftViewMode === 'progress'}
            onClick={() => setBerichtsheftViewMode('progress')}
            icon={BarChart3}
            label="Fortschritt"
          />
          <TabButton
            active={berichtsheftViewMode === 'profile'}
            onClick={() => setBerichtsheftViewMode('profile')}
            icon={UserIcon}
            label="Profil"
          />
          <TabButton
            active={berichtsheftViewMode === 'kalender'}
            onClick={() => setBerichtsheftViewMode('kalender')}
            icon={CalendarDays}
            label="Kalender"
          />
          {canManageBerichtsheftSignatures && (
            <TabButton
              active={berichtsheftViewMode === 'sign'}
              onClick={() => setBerichtsheftViewMode('sign')}
              icon={PenTool}
              label="Zum Unterschreiben"
            />
          )}
        </div>
      </div>

      {/* Profil-Hinweis */}
      {berichtsheftViewMode !== 'profile' && profileIncomplete && (
        <div
          className={`glass-card rounded-2xl p-4 border-l-4 ${
            darkMode ? 'border-yellow-500' : 'border-yellow-400'
          }`}
        >
          <div className="flex items-start gap-3">
            <Info className={`${darkMode ? 'text-yellow-400' : 'text-yellow-500'} flex-shrink-0 mt-0.5`} size={20} />
            <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
              Bitte fülle zuerst dein{' '}
              <button
                onClick={() => setBerichtsheftViewMode('profile')}
                className="underline font-bold hover:text-cyan-500 transition-colors"
              >
                Azubi-Profil
              </button>{' '}
              aus, damit deine Daten automatisch in den Berichten erscheinen.
            </p>
          </div>
        </div>
      )}

      {/* PROFILE VIEW */}
      {berichtsheftViewMode === 'profile' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${
                  darkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
                }`}
              >
                <UserIcon size={20} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Azubi-Profil für Berichtsheft
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Diese Daten werden automatisch in deine Berichtshefte übernommen.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Vorname *
                </label>
                <input
                  type="text"
                  value={azubiProfile.vorname}
                  onChange={(e) => saveAzubiProfile({ ...azubiProfile, vorname: e.target.value })}
                  placeholder="Max"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nachname *
                </label>
                <input
                  type="text"
                  value={azubiProfile.nachname}
                  onChange={(e) => saveAzubiProfile({ ...azubiProfile, nachname: e.target.value })}
                  placeholder="Mustermann"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Ausbildungsbetrieb *
                </label>
                <input
                  type="text"
                  value={azubiProfile.ausbildungsbetrieb}
                  onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsbetrieb: e.target.value })}
                  placeholder="Stadtwerke Musterstadt GmbH"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Ausbildungsberuf
                </label>
                <input
                  type="text"
                  value={azubiProfile.ausbildungsberuf}
                  onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsberuf: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Name Ausbilder/in
                </label>
                <input
                  type="text"
                  value={azubiProfile.ausbilder}
                  onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbilder: e.target.value })}
                  placeholder="Frau/Herr Ausbilder"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Ausbildungsbeginn
                </label>
                <input
                  type="date"
                  value={azubiProfile.ausbildungsbeginn}
                  onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsbeginn: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Vorschau */}
          {azubiProfile.vorname && azubiProfile.nachname && (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} size={18} />
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Vorschau Kopfzeile</h4>
              </div>
              <div
                className={`p-4 rounded-xl border ${
                  darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Name: </span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {azubiProfile.vorname} {azubiProfile.nachname}
                    </span>
                  </div>
                  <div>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Betrieb: </span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {azubiProfile.ausbildungsbetrieb || '-'}
                    </span>
                  </div>
                  <div>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Beruf: </span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {azubiProfile.ausbildungsberuf}
                    </span>
                  </div>
                  <div>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Ausbilder: </span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {azubiProfile.ausbilder || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={openBerichtsheftDraftForCurrentWeek}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Profil gespeichert - Zum Berichtsheft
          </button>
        </div>
      )}

      {/* EDIT VIEW */}
      {berichtsheftViewMode === 'edit' && (
        <div className="space-y-6">
          {/* Azubi-Kopfzeile */}
          {(azubiProfile.vorname || azubiProfile.nachname || azubiProfile.ausbildungsbetrieb) && (
            <div className="glass-card rounded-2xl p-4">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <div>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Azubi: </span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {azubiProfile.vorname} {azubiProfile.nachname}
                  </span>
                </div>
                {azubiProfile.ausbildungsbetrieb && (
                  <div>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Betrieb: </span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {azubiProfile.ausbildungsbetrieb}
                    </span>
                  </div>
                )}
                {azubiProfile.ausbilder && (
                  <div>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Ausbilder: </span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {azubiProfile.ausbilder}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Header-Infos */}
          <div className="glass-card rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nachweis Nr.
                </label>
                <input
                  type="number"
                  value={berichtsheftNr}
                  onChange={(e) => setBerichtsheftNr(parseInt(e.target.value) || 1)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Woche vom (Montag)
                </label>
                <input
                  type="date"
                  value={berichtsheftWeek}
                  onChange={(e) => setBerichtsheftWeek(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  bis (Sonntag)
                </label>
                <input
                  type="text"
                  value={getWeekEndDate(berichtsheftWeek)}
                  readOnly
                  className={`w-full px-4 py-2 border rounded-lg ${
                    darkMode
                      ? 'bg-white/5 border-white/10 text-gray-400'
                      : 'bg-gray-100/70 border-gray-300 text-gray-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Ausbildungsjahr
                </label>
                <select
                  value={berichtsheftYear}
                  onChange={(e) => setBerichtsheftYear(parseInt(e.target.value))}
                  className={inputClass}
                >
                  <option value={1}>1. Ausbildungsjahr</option>
                  <option value={2}>2. Ausbildungsjahr</option>
                  <option value={3}>3. Ausbildungsjahr</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tageseinträge */}
          <div className="space-y-4">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, dayIndex) => {
              const dayNames = {
                Mo: 'Montag',
                Di: 'Dienstag',
                Mi: 'Mittwoch',
                Do: 'Donnerstag',
                Fr: 'Freitag',
                Sa: 'Samstag',
                So: 'Sonntag',
              };
              const dayDate = new Date(berichtsheftWeek);
              dayDate.setDate(dayDate.getDate() + dayIndex);
              const dayHours = calculateDayHours(day);
              const isWeekend = day === 'Sa' || day === 'So';

              return (
                <div
                  key={day}
                  className={`glass-card rounded-2xl p-4 border-l-4 ${
                    isWeekend
                      ? darkMode
                        ? 'border-gray-600'
                        : 'border-gray-300'
                      : darkMode
                        ? 'border-cyan-500'
                        : 'border-cyan-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        {day}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {dayNames[day]} - {dayDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
                        darkMode ? 'bg-white/5 text-gray-300' : 'bg-white/70 text-gray-700'
                      }`}
                    >
                      <Clock size={12} />
                      {dayHours} Std.
                    </div>
                  </div>

                  {currentWeekEntries[day].map((entry, entryIndex) => {
                    const selectedBereich = AUSBILDUNGSRAHMENPLAN.find(
                      (bereich) => bereich.nr === parseInt(entry.bereich, 10),
                    );
                    const entryKey = `${day}-${entryIndex}`;
                    const bereichSuggestions = getBerichtsheftBereichSuggestions(entry.taetigkeit, berichtsheftYear);
                    const showBereichSuggestions = !entry.bereich && bereichSuggestions.length > 0;
                    const inhaltePreview = (selectedBereich?.inhalte || []).slice(0, 6);
                    const isEntryHintExpanded = expandedEntryHints.has(entryKey);
                    const visibleInhaltePreview = isEntryHintExpanded
                      ? inhaltePreview
                      : inhaltePreview.slice(0, 3);
                    const suggestedBereichExamples = showBereichSuggestions
                      ? bereichSuggestions
                          .slice(0, 2)
                          .map(({ bereich }) => ({
                            bereich,
                            inhalte: (bereich?.inhalte || []).slice(0, 3),
                          }))
                          .filter((item) => item.inhalte.length > 0)
                      : [];

                    return (
                      <div key={entryIndex} className="mb-3">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start">
                          <div className="min-w-0 flex-1">
                            <input
                              type="text"
                              value={entry.taetigkeit}
                              onChange={(e) => updateWeekEntry(day, entryIndex, 'taetigkeit', e.target.value)}
                              placeholder="Ausgeführte Tätigkeit..."
                              className={smallInputClass}
                            />
                          </div>
                          <div className="w-full md:w-20 md:flex-shrink-0">
                            <input
                              type="number"
                              value={entry.stunden}
                              onChange={(e) => updateWeekEntry(day, entryIndex, 'stunden', e.target.value)}
                              placeholder="Std."
                              step="0.5"
                              min="0"
                              max="12"
                              className={`w-full px-2 py-2 border rounded-lg text-sm text-center transition-colors ${
                                darkMode
                                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-cyan-400'
                                  : 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-cyan-500'
                              }`}
                            />
                          </div>
                          <div className="w-full min-w-0 md:flex-1">
                            <select
                              value={entry.bereich}
                              onChange={(e) => updateWeekEntry(day, entryIndex, 'bereich', e.target.value)}
                              className={smallInputClass}
                            >
                              <option value="">-- Bereich --</option>
                              {AUSBILDUNGSRAHMENPLAN.map((b) => {
                                const yearWeeks = getBerichtsheftYearWeeks(b, berichtsheftYear);
                                const yearHint = yearWeeks > 0 ? `${yearWeeks}W/J${berichtsheftYear}` : 'laufend';
                                return (
                                  <option key={b.nr} value={b.nr}>
                                    {b.icon} {b.nr}. {b.bereich} ({yearHint})
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <button
                            onClick={() => removeWeekEntry(day, entryIndex)}
                            disabled={currentWeekEntries[day].length <= 1}
                            className={`self-end px-2 py-2 rounded-lg transition-all md:self-auto ${
                              currentWeekEntries[day].length <= 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : darkMode
                                  ? 'text-red-400 hover:bg-red-500/10'
                                  : 'text-red-500 hover:bg-red-100'
                            }`}
                          >
                            <X size={18} />
                          </button>
                        </div>

                        {showBereichSuggestions && (
                          <div
                            className={`mt-2 rounded-lg px-3 py-2 text-xs border ${
                              darkMode
                                ? 'bg-white/5 border-white/10 text-gray-300'
                                : 'bg-white/70 border-gray-200 text-gray-700'
                            }`}
                          >
                            <div className="font-semibold mb-1 flex items-center gap-1">
                              <Sparkles size={12} className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} />
                              Vorschläge für passenden Bereich:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {bereichSuggestions.map(({ bereich }) => (
                                <button
                                  key={`${day}-${entryIndex}-suggest-${bereich.nr}`}
                                  onClick={() => updateWeekEntry(day, entryIndex, 'bereich', String(bereich.nr))}
                                  className={`px-2 py-1 rounded-md transition-all ${
                                    darkMode
                                      ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20'
                                      : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200'
                                  }`}
                                >
                                  {bereich.icon} {bereich.nr}. {bereich.bereich}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedBereich && inhaltePreview.length > 0 && (
                          <div
                            className={`mt-2 rounded-lg px-3 py-3 text-sm border ${
                              darkMode
                                ? 'bg-white/5 border-white/10 text-gray-300'
                                : 'bg-white/70 border-gray-200 text-gray-700'
                            }`}
                          >
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <div className="font-semibold flex items-center gap-1">
                                <ListChecks size={14} className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} />
                                Zu vermittelnde Tätigkeiten (Hilfe):
                              </div>
                              {inhaltePreview.length > 3 && (
                                <button
                                  type="button"
                                  onClick={() => toggleEntryHint(entryKey)}
                                  className={`text-xs font-medium underline underline-offset-2 ${
                                    darkMode ? 'text-cyan-300 hover:text-cyan-200' : 'text-cyan-700 hover:text-cyan-800'
                                  }`}
                                >
                                  {isEntryHintExpanded ? 'Weniger' : 'Mehr anzeigen'}
                                </button>
                              )}
                            </div>
                            <div
                              className={`space-y-1.5 ${isEntryHintExpanded ? 'max-h-64 overflow-y-auto pr-1' : ''}`}
                            >
                              {visibleInhaltePreview.map((inhalt, idx) => (
                                <div
                                  key={`${day}-${entryIndex}-inhalt-${idx}`}
                                  className="flex items-start gap-2"
                                >
                                  <span className={darkMode ? 'text-cyan-300' : 'text-cyan-600'}>-</span>
                                  <span className="leading-5">{inhalt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {!selectedBereich && suggestedBereichExamples.length > 0 && (
                          <div
                            className={`mt-2 rounded-lg px-3 py-2 text-xs border ${
                              darkMode
                                ? 'bg-white/5 border-white/10 text-gray-300'
                                : 'bg-white/70 border-gray-200 text-gray-700'
                            }`}
                          >
                            <div className="font-semibold mb-2 flex items-center gap-1">
                              <Sparkles size={12} className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} />
                              Beispiele aus passenden Bereichen:
                            </div>
                            <div className="space-y-2">
                              {suggestedBereichExamples.map(({ bereich, inhalte }) => (
                                <div
                                  key={`${day}-${entryIndex}-example-${bereich.nr}`}
                                  className={`rounded-md px-2 py-2 ${
                                    darkMode ? 'bg-white/5' : 'bg-cyan-50/70'
                                  }`}
                                >
                                  <div
                                    className={`font-medium mb-1 ${
                                      darkMode ? 'text-cyan-300' : 'text-cyan-700'
                                    }`}
                                  >
                                    {bereich.icon} {bereich.nr}. {bereich.bereich}
                                  </div>
                                  <div className="space-y-1">
                                    {inhalte.map((inhalt, idx) => (
                                      <div
                                        key={`${day}-${entryIndex}-example-${bereich.nr}-${idx}`}
                                        className="flex items-start gap-2"
                                      >
                                        <span className={darkMode ? 'text-cyan-300' : 'text-cyan-600'}>-</span>
                                        <span className="leading-5">{inhalt}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button
                    onClick={() => addWeekEntry(day)}
                    className={`mt-2 text-sm flex items-center gap-1 font-medium ${
                      darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
                    }`}
                  >
                    <Plus size={16} /> Weitere Tätigkeit
                  </button>
                </div>
              );
            })}
          </div>

          {/* Gesamtstunden */}
          <div
            className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${
              darkMode
                ? 'bg-gradient-to-r from-cyan-900 via-slate-900 to-blue-900'
                : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600'
            }`}
          >
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Clock size={20} />
                </div>
                <span className="text-lg font-bold">Gesamtstunden diese Woche</span>
              </div>
              <span className="text-3xl font-bold">{calculateTotalHours()} Std.</span>
            </div>
          </div>

          {/* Bemerkungen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Bemerkungen Auszubildender
              </label>
              <textarea
                value={berichtsheftBemerkungAzubi}
                onChange={(e) => setBerichtsheftBemerkungAzubi(e.target.value)}
                rows={3}
                placeholder="Besondere Vorkommnisse, Lernerfolge..."
                className={inputClass}
              />
            </div>
            <div className="glass-card rounded-2xl p-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Bemerkungen Ausbilder
              </label>
              <textarea
                value={berichtsheftBemerkungAusbilder}
                onChange={(e) => setBerichtsheftBemerkungAusbilder(e.target.value)}
                rows={3}
                placeholder="Feedback, Anmerkungen..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Unterschriften */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <PenTool className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} size={20} />
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Für die Richtigkeit</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Datum Azubi
                  </label>
                  <input
                    type="date"
                    value={berichtsheftDatumAzubi}
                    onChange={(e) => setBerichtsheftDatumAzubi(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <SignatureCanvas
                  value={berichtsheftSignaturAzubi}
                  onChange={setBerichtsheftSignaturAzubi}
                  darkMode={darkMode}
                  label="Unterschrift Auszubildender"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Datum Ausbilder
                  </label>
                  <input
                    type="date"
                    value={berichtsheftDatumAusbilder}
                    onChange={(e) => setBerichtsheftDatumAusbilder(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <SignatureCanvas
                  value={berichtsheftSignaturAusbilder}
                  onChange={setBerichtsheftSignaturAusbilder}
                  darkMode={darkMode}
                  label="Unterschrift Ausbilder"
                />
              </div>
            </div>
          </div>

          {/* Speichern & PDF Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={saveBerichtsheft}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
            >
              <Check size={20} />
              {selectedBerichtsheft ? 'Aktualisieren' : 'Speichern'}
            </button>
            {selectedBerichtsheft && (
              <button
                onClick={() => generateBerichtsheftPDF(selectedBerichtsheft)}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2"
              >
                <Download size={20} />
                PDF / Drucken
              </button>
            )}
            {selectedBerichtsheft && (
              <button
                onClick={resetBerichtsheftForm}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  darkMode
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                    : 'bg-white/70 text-gray-700 hover:bg-white border border-gray-200'
                }`}
              >
                Abbrechen
              </button>
            )}
            {!selectedBerichtsheft && (
              <p className={`w-full text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Entwurf wird automatisch lokal und auf dem Server gespeichert, bis du den Wochenbericht abschickst.
              </p>
            )}
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {berichtsheftViewMode === 'list' && (
        <div className="space-y-4">
          {berichtsheftEntries.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div
                className={`inline-flex p-4 rounded-full mb-4 ${
                  darkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-600'
                }`}
              >
                <BookOpen size={32} />
              </div>
              <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Noch keine Berichtshefte vorhanden
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Erstelle deinen ersten Wochenbericht!
              </p>
              <button
                onClick={openBerichtsheftDraftForCurrentWeek}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-cyan-500/30 inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Neuer Bericht
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {berichtsheftEntries.map((entry) => {
                  const isSigned = entry.signatur_azubi && entry.signatur_ausbilder;
                  return (
                    <div
                      key={entry.id}
                      className={`glass-card rounded-2xl p-4 border-l-4 ${
                        isSigned
                          ? darkMode
                            ? 'border-emerald-500'
                            : 'border-emerald-400'
                          : darkMode
                            ? 'border-amber-500'
                            : 'border-amber-400'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <div
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold ${
                                darkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
                              }`}
                            >
                              <FileText size={14} />
                              Nr. {entry.nachweis_nr}
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                                isSigned
                                  ? darkMode
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-emerald-100 text-emerald-700'
                                  : darkMode
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {isSigned ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                              {isSigned ? 'Unterschrieben' : 'Offen'}
                            </span>
                          </div>
                          <div
                            className={`text-sm flex flex-wrap gap-x-3 gap-y-1 ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(entry.week_start).toLocaleDateString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                              })}{' '}
                              -{' '}
                              {new Date(entry.week_end).toLocaleDateString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </span>
                            <span>·</span>
                            <span>{entry.ausbildungsjahr}. Ausbildungsjahr</span>
                            <span>·</span>
                            <span className="font-medium inline-flex items-center gap-1">
                              <Clock size={12} />
                              {entry.total_hours || 0} Std.
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => generateBerichtsheftPDF(entry)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
                          >
                            <Download size={16} /> PDF
                          </button>
                          <button
                            onClick={() => loadBerichtsheftForEdit(entry)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              darkMode
                                ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                : 'bg-white/70 hover:bg-white text-gray-700 border border-gray-200'
                            }`}
                          >
                            Bearbeiten
                          </button>
                          <button
                            onClick={() => deleteBerichtsheft(entry.id)}
                            className="px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-lg font-medium transition-all shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Statistik */}
              <div className="glass-card rounded-2xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      {totalEntries}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wochen erfasst</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {signedCount}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unterschrieben</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                      {openCount}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Offen</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {totalHoursAll}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stunden gesamt</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* SIGN VIEW */}
      {berichtsheftViewMode === 'sign' && canManageBerichtsheftSignatures && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Info className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} size={20} />
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Hier siehst du alle Wochenberichte, die vom Azubi unterschrieben wurden und noch auf
                Ausbilder-Unterschrift warten.
              </p>
            </div>
          </div>

          {berichtsheftPendingLoading ? (
            <div
              className={`glass-card rounded-2xl p-6 text-center ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Lade offene Berichtshefte...
            </div>
          ) : berichtsheftPendingSignatures.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div
                className={`inline-flex p-4 rounded-full mb-4 ${
                  darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                <CheckCircle2 size={32} />
              </div>
              <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Aktuell keine offenen Berichtshefte zur Unterschrift.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {berichtsheftPendingSignatures.map((entry) => {
                const selectedTrainerId =
                  assignmentSelectionById[entry.id] ?? entry.assigned_trainer_id ?? '';
                const azubiName = String(entry.user_name || '').trim() || 'Unbekannt';
                const assignedTrainer = String(entry.assigned_trainer_name || '').trim();

                return (
                  <div
                    key={entry.id}
                    className={`glass-card rounded-2xl p-4 border-l-4 ${
                      darkMode ? 'border-amber-500' : 'border-amber-400'
                    }`}
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          Nr. {entry.nachweis_nr} - {azubiName}
                        </div>
                        <div
                          className={`text-sm flex flex-wrap gap-x-3 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={12} />
                            {formatWeekRange(entry)}
                          </span>
                          <span>·</span>
                          <span>{entry.ausbildungsjahr}. Ausbildungsjahr</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={12} />
                            {entry.total_hours || 0} Std.
                          </span>
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Zugewiesen an: {assignedTrainer || 'Noch nicht zugewiesen'}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 lg:items-end">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => loadBerichtsheftForEdit(entry)}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-sm"
                          >
                            Bericht öffnen
                          </button>
                          <button
                            onClick={() => generateBerichtsheftPDF(entry)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
                          >
                            <Download size={16} /> PDF
                          </button>
                        </div>

                        <div className="flex gap-2 flex-wrap lg:justify-end">
                          <select
                            value={selectedTrainerId}
                            onChange={(event) =>
                              setAssignmentSelectionById((prev) => ({
                                ...prev,
                                [entry.id]: event.target.value,
                              }))
                            }
                            className={`px-3 py-2 border rounded-lg text-sm min-w-[220px] transition-colors ${
                              darkMode
                                ? 'bg-white/5 border-white/10 text-white focus:border-cyan-400'
                                : 'bg-white/70 border-gray-300 text-gray-700 focus:border-cyan-500'
                            }`}
                          >
                            <option value="">Ausbilder auswählen...</option>
                            {signerOptions.map((account) => (
                              <option key={account.id} value={account.id}>
                                {account.name || 'Unbenannt'}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => assignBerichtsheftTrainer(entry.id, selectedTrainerId)}
                            disabled={!selectedTrainerId}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              selectedTrainerId
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm'
                                : darkMode
                                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Zuweisen
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PROGRESS VIEW */}
      {berichtsheftViewMode === 'progress' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Info className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} size={20} />
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Hier siehst du deinen Fortschritt in den verschiedenen Ausbildungsbereichen gemäß Ausbildungsrahmenplan
                (§4). Die Soll-Wochen basieren auf den zeitlichen Richtwerten der Verordnung.
              </p>
            </div>
          </div>

          {(() => {
            const progress = calculateBereichProgress();
            const stundenProWoche = 40;

            return (
              <div className="space-y-3">
                {Object.entries(progress).map(([nr, data]) => {
                  const istWochen = data.istStunden / stundenProWoche;
                  const prozent =
                    data.sollWochen > 0
                      ? Math.min(100, (istWochen / data.sollWochen) * 100)
                      : data.istStunden > 0
                        ? 100
                        : 0;
                  const isDone = prozent >= 100;

                  return (
                    <div
                      key={nr}
                      className={`glass-card rounded-2xl p-4 border-l-4 ${
                        isDone
                          ? darkMode
                            ? 'border-emerald-500'
                            : 'border-emerald-400'
                          : darkMode
                            ? 'border-cyan-500'
                            : 'border-cyan-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl flex-shrink-0">{data.icon}</span>
                          <span className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {nr}. {data.name}
                          </span>
                        </div>
                        <div
                          className={`text-sm flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                        >
                          {istWochen.toFixed(1)} / {data.sollWochen > 0 ? data.sollWochen : '∞'} Wochen
                          <span className="ml-2 font-bold">({data.istStunden.toFixed(0)} Std.)</span>
                        </div>
                      </div>
                      <div
                        className={`h-3 rounded-full overflow-hidden ${
                          darkMode ? 'bg-white/10' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${data.color}`}
                          style={{ width: `${prozent}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {prozent.toFixed(0)}% erreicht
                        </span>
                        {isDone && (
                          <span
                            className={`text-xs font-medium inline-flex items-center gap-1 ${
                              darkMode ? 'text-emerald-400' : 'text-emerald-600'
                            }`}
                          >
                            <CheckCircle2 size={12} /> Abgeschlossen
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Gesamt-Übersicht */}
          <div
            className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${
              darkMode
                ? 'bg-gradient-to-r from-cyan-900 via-slate-900 to-blue-900'
                : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600'
            }`}
          >
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={20} />
                <h3 className="font-bold text-lg">Gesamtfortschritt</h3>
              </div>
              {(() => {
                const progress = calculateBereichProgress();
                const totalIstStunden = Object.values(progress).reduce((sum, d) => sum + d.istStunden, 0);
                const totalSollWochen = AUSBILDUNGSRAHMENPLAN.reduce((sum, b) => sum + b.gesamtWochen, 0);
                const totalSollStunden = totalSollWochen * 40;
                const gesamtProzent = totalSollStunden > 0 ? (totalIstStunden / totalSollStunden) * 100 : 0;

                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="px-3 py-3 rounded-xl bg-white/15 backdrop-blur-sm">
                      <div className="text-3xl font-bold">{totalIstStunden.toFixed(0)}</div>
                      <div className="text-sm opacity-80">Stunden erfasst</div>
                    </div>
                    <div className="px-3 py-3 rounded-xl bg-white/15 backdrop-blur-sm">
                      <div className="text-3xl font-bold">{(totalIstStunden / 40).toFixed(1)}</div>
                      <div className="text-sm opacity-80">Wochen erfasst</div>
                    </div>
                    <div className="px-3 py-3 rounded-xl bg-white/15 backdrop-blur-sm">
                      <div className="text-3xl font-bold">{totalSollWochen}</div>
                      <div className="text-sm opacity-80">Soll-Wochen</div>
                    </div>
                    <div className="px-3 py-3 rounded-xl bg-white/15 backdrop-blur-sm">
                      <div className="text-3xl font-bold">{gesamtProzent.toFixed(0)}%</div>
                      <div className="text-sm opacity-80">Gesamt</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Ausbildungsrahmenplan Übersicht */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className={darkMode ? 'text-cyan-400' : 'text-cyan-600'} size={20} />
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Ausbildungsrahmenplan - Übersicht
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={darkMode ? 'bg-white/5' : 'bg-gray-100/70'}>
                    <th className={`px-3 py-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nr.</th>
                    <th className={`px-3 py-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bereich
                    </th>
                    <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      1. Jahr
                    </th>
                    <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      2. Jahr
                    </th>
                    <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      3. Jahr
                    </th>
                    <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Gesamt
                    </th>
                  </tr>
                </thead>
                <tbody className={darkMode ? 'divide-y divide-white/10' : 'divide-y divide-gray-200'}>
                  {AUSBILDUNGSRAHMENPLAN.map((bereich) => {
                    const isOpen = expandedBereiche.has(bereich.nr);
                    return (
                      <React.Fragment key={bereich.nr}>
                        <tr
                          onClick={() => toggleBereich(bereich.nr)}
                          className={`cursor-pointer transition-colors ${
                            darkMode ? 'hover:bg-white/5' : 'hover:bg-cyan-50/50'
                          }`}
                        >
                          <td className={`px-3 py-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            <span className="mr-1">{bereich.icon}</span> {bereich.nr}
                          </td>
                          <td className={`px-3 py-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {bereich.bereich}
                            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {bereich.paragraph}
                            </div>
                          </td>
                          <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {bereich.wochen.jahr1 || '-'}
                          </td>
                          <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {bereich.wochen.jahr2 || '-'}
                          </td>
                          <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {bereich.wochen.jahr3 || '-'}
                          </td>
                          <td
                            className={`px-3 py-2 text-center font-bold ${
                              darkMode ? 'text-cyan-400' : 'text-cyan-600'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              {bereich.gesamtWochen || 'lfd.'}
                              {isOpen ? (
                                <ChevronUp size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                              ) : (
                                <ChevronDown size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                              )}
                            </div>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className={darkMode ? 'bg-white/5' : 'bg-cyan-50/50'}>
                            <td />
                            <td colSpan={5} className="px-4 py-3">
                              <p
                                className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                                  darkMode ? 'text-cyan-400' : 'text-cyan-700'
                                }`}
                              >
                                Zu vermittelnde Fertigkeiten und Kenntnisse
                              </p>
                              <ul className="space-y-1">
                                {bereich.inhalte.map((inhalt, i) => (
                                  <li
                                    key={i}
                                    className={`flex items-start gap-2 text-sm ${
                                      darkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                                  >
                                    <span
                                      className={`mt-0.5 shrink-0 text-xs font-bold ${
                                        darkMode ? 'text-cyan-400' : 'text-cyan-600'
                                      }`}
                                    >
                                      {i + 1}.
                                    </span>
                                    {inhalt}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={`mt-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              * "lfd." = wird während der gesamten Ausbildung laufend vermittelt
            </p>
          </div>
        </div>
      )}

      {/* KALENDER VIEW */}
      {berichtsheftViewMode === 'kalender' &&
        (() => {
          const getWeekStartForDate = (date) => {
            const d = new Date(date);
            const day = d.getDay();
            const diff = day === 0 ? -6 : 1 - day;
            d.setDate(d.getDate() + diff);
            return d.toISOString().split('T')[0];
          };

          const isSignedByAzubi = (entry) => Boolean(String(entry?.signatur_azubi || '').trim());
          const isSignedByAusbilder = (entry) => Boolean(String(entry?.signatur_ausbilder || '').trim());

          const firstDay = new Date(calYear, calMonth, 1);
          const lastDay = new Date(calYear, calMonth + 1, 0);
          const startDow = firstDay.getDay();
          const gridStart = new Date(firstDay);
          gridStart.setDate(firstDay.getDate() - (startDow === 0 ? 6 : startDow - 1));

          const calDays = [];
          const cur = new Date(gridStart);
          while (cur <= lastDay || calDays.length % 7 !== 0) {
            calDays.push(new Date(cur));
            cur.setDate(cur.getDate() + 1);
            if (calDays.length > 42) break;
          }

          const monthNames = [
            'Januar',
            'Februar',
            'März',
            'April',
            'Mai',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'Dezember',
          ];

          return (
            <div className="glass-card rounded-2xl p-6">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    if (calMonth === 0) {
                      setCalMonth(11);
                      setCalYear((y) => y - 1);
                    } else {
                      setCalMonth((m) => m - 1);
                    }
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    darkMode
                      ? 'hover:bg-white/10 text-gray-300 border border-white/10'
                      : 'hover:bg-white text-gray-600 border border-gray-200 bg-white/70'
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {monthNames[calMonth]} {calYear}
                </h3>
                <button
                  onClick={() => {
                    if (calMonth === 11) {
                      setCalMonth(0);
                      setCalYear((y) => y + 1);
                    } else {
                      setCalMonth((m) => m + 1);
                    }
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    darkMode
                      ? 'hover:bg-white/10 text-gray-300 border border-white/10'
                      : 'hover:bg-white text-gray-600 border border-gray-200 bg-white/70'
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Unterschrieben</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Azubi unterschrieben</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Eingetragen</span>
                </div>
              </div>
              {/* Day header */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => (
                  <div
                    key={d}
                    className={`text-center text-xs font-bold py-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calDays.map((day, i) => {
                  const isCurrentMonth = day.getMonth() === calMonth;
                  const isToday = day.toDateString() === today.toDateString();
                  const weekStartStr = getWeekStartForDate(day);
                  const entry = (berichtsheftEntries || []).find((e) => e.week_start === weekStartStr);
                  const dotColor = !entry
                    ? null
                    : isSignedByAusbilder(entry)
                      ? 'bg-emerald-400'
                      : isSignedByAzubi(entry)
                        ? 'bg-yellow-400'
                        : 'bg-orange-400';

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (entry) {
                          loadBerichtsheftForEdit(entry);
                          setBerichtsheftViewMode('edit');
                        }
                      }}
                      disabled={!entry}
                      className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all text-xs ${
                        isToday
                          ? darkMode
                            ? 'ring-2 ring-cyan-400 bg-cyan-500/20'
                            : 'ring-2 ring-cyan-500 bg-cyan-50'
                          : entry
                            ? darkMode
                              ? 'hover:bg-white/10 cursor-pointer'
                              : 'hover:bg-white cursor-pointer'
                            : 'cursor-default'
                      } ${!isCurrentMonth ? 'opacity-30' : ''}`}
                    >
                      <span
                        className={`font-medium ${
                          darkMode
                            ? isCurrentMonth
                              ? 'text-white'
                              : 'text-gray-600'
                            : isCurrentMonth
                              ? 'text-gray-800'
                              : 'text-gray-300'
                        }`}
                      >
                        {day.getDate()}
                      </span>
                      {dotColor && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${dotColor}`} />}
                    </button>
                  );
                })}
              </div>
              {/* Summary */}
              <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {(berichtsheftEntries || []).length} Berichte gesamt{' · '}
                  {(berichtsheftEntries || []).filter((e) => isSignedByAusbilder(e)).length} vollständig unterschrieben
                </p>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default BerichtsheftView;
