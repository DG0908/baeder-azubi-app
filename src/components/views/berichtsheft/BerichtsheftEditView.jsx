import React from 'react';
import { Check, Clock, Download, PenTool } from 'lucide-react';
import SignatureCanvas from '../../ui/SignatureCanvas';
import BerichtsheftWeekDayEntry from './BerichtsheftWeekDayEntry';

const DAY_KEYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAY_LABELS = {
  Mo: 'Montag',
  Di: 'Dienstag',
  Mi: 'Mittwoch',
  Do: 'Donnerstag',
  Fr: 'Freitag',
  Sa: 'Samstag',
  So: 'Sonntag',
};

const BerichtsheftEditView = ({
  darkMode,
  azubiProfile,
  berichtsheftNr,
  setBerichtsheftNr,
  berichtsheftWeek,
  setBerichtsheftWeek,
  berichtsheftYear,
  setBerichtsheftYear,
  getWeekEndDate,
  currentWeekEntries,
  addWeekEntry,
  updateWeekEntry,
  removeWeekEntry,
  calculateDayHours,
  calculateTotalHours,
  getBerichtsheftBereichSuggestions,
  getBerichtsheftYearWeeks,
  expandedEntryHints,
  toggleEntryHint,
  berichtsheftBemerkungAzubi,
  setBerichtsheftBemerkungAzubi,
  berichtsheftBemerkungAusbilder,
  setBerichtsheftBemerkungAusbilder,
  berichtsheftDatumAzubi,
  setBerichtsheftDatumAzubi,
  berichtsheftDatumAusbilder,
  setBerichtsheftDatumAusbilder,
  berichtsheftSignaturAzubi,
  setBerichtsheftSignaturAzubi,
  berichtsheftSignaturAusbilder,
  setBerichtsheftSignaturAusbilder,
  saveBerichtsheft,
  selectedBerichtsheft,
  generateBerichtsheftPDF,
  resetBerichtsheftForm,
}) => {
  const inputClass = `w-full px-4 py-2 border rounded-lg transition-colors ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-cyan-400'
      : 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-cyan-500'
  }`;

  return (
    <div className="space-y-6">
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
                darkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-100/70 border-gray-300 text-gray-500'
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

      <div className="space-y-4">
        {DAY_KEYS.map((day, dayIndex) => {
          const dayDate = new Date(berichtsheftWeek);
          dayDate.setDate(dayDate.getDate() + dayIndex);
          return (
            <BerichtsheftWeekDayEntry
              key={day}
              darkMode={darkMode}
              day={day}
              dayLabel={DAY_LABELS[day]}
              dayDate={dayDate}
              dayHours={calculateDayHours(day)}
              isWeekend={day === 'Sa' || day === 'So'}
              entries={currentWeekEntries[day]}
              expandedEntryHints={expandedEntryHints}
              toggleEntryHint={toggleEntryHint}
              addWeekEntry={addWeekEntry}
              updateWeekEntry={updateWeekEntry}
              removeWeekEntry={removeWeekEntry}
              getBerichtsheftBereichSuggestions={getBerichtsheftBereichSuggestions}
              getBerichtsheftYearWeeks={getBerichtsheftYearWeeks}
              berichtsheftYear={berichtsheftYear}
            />
          );
        })}
      </div>

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
  );
};

export default BerichtsheftEditView;
