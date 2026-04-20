import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import BerichtsheftHero from './berichtsheft/BerichtsheftHero';
import BerichtsheftTabs from './berichtsheft/BerichtsheftTabs';
import BerichtsheftProfileView from './berichtsheft/BerichtsheftProfileView';
import BerichtsheftEditView from './berichtsheft/BerichtsheftEditView';
import BerichtsheftListView from './berichtsheft/BerichtsheftListView';
import BerichtsheftSignView from './berichtsheft/BerichtsheftSignView';
import BerichtsheftProgressView from './berichtsheft/BerichtsheftProgressView';
import BerichtsheftCalendarView from './berichtsheft/BerichtsheftCalendarView';

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
    progressAzubis,
    progressTargetUserId,
    progressTargetUserName,
    progressLoading,
    selectProgressTarget,
    clearProgressTarget,
  } = props;

  const { darkMode } = useApp();
  const [expandedBereiche, setExpandedBereiche] = useState(new Set());
  const [expandedEntryHints, setExpandedEntryHints] = useState(new Set());

  const toggleBereich = (nr) => {
    setExpandedBereiche((prev) => {
      const next = new Set(prev);
      if (next.has(nr)) next.delete(nr);
      else next.add(nr);
      return next;
    });
  };

  const toggleEntryHint = (entryKey) => {
    setExpandedEntryHints((prev) => {
      const next = new Set(prev);
      if (next.has(entryKey)) next.delete(entryKey);
      else next.add(entryKey);
      return next;
    });
  };

  const totalEntries = berichtsheftEntries?.length || 0;
  const signedCount = (berichtsheftEntries || []).filter((e) => e.signatur_azubi && e.signatur_ausbilder).length;
  const openCount = totalEntries - signedCount;
  const totalHoursAll = (berichtsheftEntries || []).reduce((sum, e) => sum + (e.total_hours || 0), 0);

  const profileIncomplete = !azubiProfile?.vorname || !azubiProfile?.nachname || !azubiProfile?.ausbildungsbetrieb;

  return (
    <div className="space-y-6">
      <BerichtsheftHero
        darkMode={darkMode}
        totalEntries={totalEntries}
        signedCount={signedCount}
        openCount={openCount}
        totalHoursAll={totalHoursAll}
      />

      <BerichtsheftTabs
        darkMode={darkMode}
        berichtsheftViewMode={berichtsheftViewMode}
        openBerichtsheftDraftForCurrentWeek={openBerichtsheftDraftForCurrentWeek}
        setBerichtsheftViewMode={setBerichtsheftViewMode}
        canManageBerichtsheftSignatures={canManageBerichtsheftSignatures}
      />

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

      {berichtsheftViewMode === 'profile' && (
        <BerichtsheftProfileView
          darkMode={darkMode}
          azubiProfile={azubiProfile}
          saveAzubiProfile={saveAzubiProfile}
          openBerichtsheftDraftForCurrentWeek={openBerichtsheftDraftForCurrentWeek}
        />
      )}

      {berichtsheftViewMode === 'edit' && (
        <BerichtsheftEditView
          darkMode={darkMode}
          azubiProfile={azubiProfile}
          berichtsheftNr={berichtsheftNr}
          setBerichtsheftNr={setBerichtsheftNr}
          berichtsheftWeek={berichtsheftWeek}
          setBerichtsheftWeek={setBerichtsheftWeek}
          berichtsheftYear={berichtsheftYear}
          setBerichtsheftYear={setBerichtsheftYear}
          getWeekEndDate={getWeekEndDate}
          currentWeekEntries={currentWeekEntries}
          addWeekEntry={addWeekEntry}
          updateWeekEntry={updateWeekEntry}
          removeWeekEntry={removeWeekEntry}
          calculateDayHours={calculateDayHours}
          calculateTotalHours={calculateTotalHours}
          getBerichtsheftBereichSuggestions={getBerichtsheftBereichSuggestions}
          getBerichtsheftYearWeeks={getBerichtsheftYearWeeks}
          expandedEntryHints={expandedEntryHints}
          toggleEntryHint={toggleEntryHint}
          berichtsheftBemerkungAzubi={berichtsheftBemerkungAzubi}
          setBerichtsheftBemerkungAzubi={setBerichtsheftBemerkungAzubi}
          berichtsheftBemerkungAusbilder={berichtsheftBemerkungAusbilder}
          setBerichtsheftBemerkungAusbilder={setBerichtsheftBemerkungAusbilder}
          berichtsheftDatumAzubi={berichtsheftDatumAzubi}
          setBerichtsheftDatumAzubi={setBerichtsheftDatumAzubi}
          berichtsheftDatumAusbilder={berichtsheftDatumAusbilder}
          setBerichtsheftDatumAusbilder={setBerichtsheftDatumAusbilder}
          berichtsheftSignaturAzubi={berichtsheftSignaturAzubi}
          setBerichtsheftSignaturAzubi={setBerichtsheftSignaturAzubi}
          berichtsheftSignaturAusbilder={berichtsheftSignaturAusbilder}
          setBerichtsheftSignaturAusbilder={setBerichtsheftSignaturAusbilder}
          saveBerichtsheft={saveBerichtsheft}
          selectedBerichtsheft={selectedBerichtsheft}
          generateBerichtsheftPDF={generateBerichtsheftPDF}
          resetBerichtsheftForm={resetBerichtsheftForm}
        />
      )}

      {berichtsheftViewMode === 'list' && (
        <BerichtsheftListView
          darkMode={darkMode}
          berichtsheftEntries={berichtsheftEntries}
          openBerichtsheftDraftForCurrentWeek={openBerichtsheftDraftForCurrentWeek}
          loadBerichtsheftForEdit={loadBerichtsheftForEdit}
          generateBerichtsheftPDF={generateBerichtsheftPDF}
          deleteBerichtsheft={deleteBerichtsheft}
          totalEntries={totalEntries}
          signedCount={signedCount}
          openCount={openCount}
          totalHoursAll={totalHoursAll}
        />
      )}

      {berichtsheftViewMode === 'sign' && canManageBerichtsheftSignatures && (
        <BerichtsheftSignView
          darkMode={darkMode}
          berichtsheftPendingLoading={berichtsheftPendingLoading}
          berichtsheftPendingSignatures={berichtsheftPendingSignatures}
          signAssignableUsers={signAssignableUsers}
          loadBerichtsheftForEdit={loadBerichtsheftForEdit}
          generateBerichtsheftPDF={generateBerichtsheftPDF}
          assignBerichtsheftTrainer={assignBerichtsheftTrainer}
          selectProgressTarget={selectProgressTarget}
          setBerichtsheftViewMode={setBerichtsheftViewMode}
        />
      )}

      {berichtsheftViewMode === 'progress' && (
        <BerichtsheftProgressView
          darkMode={darkMode}
          calculateBereichProgress={calculateBereichProgress}
          expandedBereiche={expandedBereiche}
          toggleBereich={toggleBereich}
          canManageBerichtsheftSignatures={canManageBerichtsheftSignatures}
          progressAzubis={progressAzubis}
          progressTargetUserId={progressTargetUserId}
          progressTargetUserName={progressTargetUserName}
          progressLoading={progressLoading}
          selectProgressTarget={selectProgressTarget}
          clearProgressTarget={clearProgressTarget}
        />
      )}

      {berichtsheftViewMode === 'kalender' && (
        <BerichtsheftCalendarView
          darkMode={darkMode}
          berichtsheftEntries={berichtsheftEntries}
          loadBerichtsheftForEdit={loadBerichtsheftForEdit}
          setBerichtsheftViewMode={setBerichtsheftViewMode}
        />
      )}
    </div>
  );
};

export default BerichtsheftView;
