import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AUSBILDUNGSRAHMENPLAN } from '../../data/ausbildungsrahmenplan';

const BerichtsheftView = (props) => {
const {
  addWeekEntry,
  applyBerichtsheftInhaltToEntry,
  azubiProfile,
  berichtsheftBemerkungAusbilder,
  berichtsheftBemerkungAzubi,
  berichtsheftDatumAusbilder,
  berichtsheftDatumAzubi,
  berichtsheftEntries,
  berichtsheftNr,
  berichtsheftSignaturAusbilder,
  berichtsheftSignaturAzubi,
  berichtsheftViewMode,
  berichtsheftWeek,
  berichtsheftYear,
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
  updateWeekEntry,
} = props;
  const { user } = useAuth();
  const { darkMode } = useApp();

  return (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className={`text-2xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  📖 Digitales Berichtsheft
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => { resetBerichtsheftForm(); setBerichtsheftViewMode('edit'); }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${berichtsheftViewMode === 'edit' ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                  >
                    ✏️ Neu
                  </button>
                  <button
                    onClick={() => setBerichtsheftViewMode('list')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${berichtsheftViewMode === 'list' ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                  >
                    📋 Übersicht
                  </button>
                  <button
                    onClick={() => setBerichtsheftViewMode('progress')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${berichtsheftViewMode === 'progress' ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                  >
                    📊 Fortschritt
                  </button>
                  <button
                    onClick={() => setBerichtsheftViewMode('profile')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${berichtsheftViewMode === 'profile' ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                  >
                    👤 Profil
                  </button>
                </div>
              </div>

              {/* Profil-Hinweis wenn nicht ausgefüllt */}
              {berichtsheftViewMode !== 'profile' && (!azubiProfile.vorname || !azubiProfile.nachname || !azubiProfile.ausbildungsbetrieb) && (
                <div className={`mb-4 p-4 rounded-lg border-2 ${darkMode ? 'bg-yellow-900/30 border-yellow-600' : 'bg-yellow-50 border-yellow-400'}`}>
                  <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    ⚠️ Bitte fülle zuerst dein <button onClick={() => setBerichtsheftViewMode('profile')} className="underline font-bold">Azubi-Profil</button> aus, damit deine Daten automatisch in den Berichten erscheinen.
                  </p>
                </div>
              )}

              {/* PROFILE VIEW - Azubi-Profil bearbeiten */}
              {berichtsheftViewMode === 'profile' && (
                <div className="space-y-6">
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50'} rounded-xl p-6`}>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      👤 Azubi-Profil für Berichtsheft
                    </h3>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Diese Daten werden automatisch in deine Berichtshefte übernommen.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vorname *</label>
                        <input
                          type="text"
                          value={azubiProfile.vorname}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, vorname: e.target.value })}
                          placeholder="Max"
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nachname *</label>
                        <input
                          type="text"
                          value={azubiProfile.nachname}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, nachname: e.target.value })}
                          placeholder="Mustermann"
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbildungsbetrieb *</label>
                        <input
                          type="text"
                          value={azubiProfile.ausbildungsbetrieb}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsbetrieb: e.target.value })}
                          placeholder="Stadtwerke Musterstadt GmbH"
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbildungsberuf</label>
                        <input
                          type="text"
                          value={azubiProfile.ausbildungsberuf}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsberuf: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name Ausbilder/in</label>
                        <input
                          type="text"
                          value={azubiProfile.ausbilder}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbilder: e.target.value })}
                          placeholder="Frau/Herr Ausbilder"
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbildungsbeginn</label>
                        <input
                          type="date"
                          value={azubiProfile.ausbildungsbeginn}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsbeginn: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vorschau */}
                  {azubiProfile.vorname && azubiProfile.nachname && (
                    <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-6`}>
                      <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Vorschau Kopfzeile:</h4>
                      <div className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Name:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.vorname} {azubiProfile.nachname}</span></div>
                          <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Betrieb:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbildungsbetrieb || '-'}</span></div>
                          <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Beruf:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbildungsberuf}</span></div>
                          <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Ausbilder:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbilder || '-'}</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setBerichtsheftViewMode('edit')}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg"
                  >
                    <Check className="inline mr-2" size={20} />
                    Profil gespeichert - Zum Berichtsheft
                  </button>
                </div>
              )}

              {/* EDIT VIEW - Neuer Wochenbericht */}
              {berichtsheftViewMode === 'edit' && (
                <div className="space-y-6">
                  {/* Azubi-Kopfzeile */}
                  {(azubiProfile.vorname || azubiProfile.nachname || azubiProfile.ausbildungsbetrieb) && (
                    <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-3 border ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Azubi:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.vorname} {azubiProfile.nachname}</span></div>
                        {azubiProfile.ausbildungsbetrieb && <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Betrieb:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbildungsbetrieb}</span></div>}
                        {azubiProfile.ausbilder && <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Ausbilder:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbilder}</span></div>}
                      </div>
                    </div>
                  )}

                  {/* Header-Infos */}
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50'} rounded-xl p-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nachweis Nr.</label>
                        <input
                          type="number"
                          value={berichtsheftNr}
                          onChange={(e) => setBerichtsheftNr(parseInt(e.target.value) || 1)}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Woche vom (Montag)</label>
                        <input
                          type="date"
                          value={berichtsheftWeek}
                          onChange={(e) => setBerichtsheftWeek(e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>bis (Sonntag)</label>
                        <input
                          type="text"
                          value={getWeekEndDate(berichtsheftWeek)}
                          readOnly
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-500'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbildungsjahr</label>
                        <select
                          value={berichtsheftYear}
                          onChange={(e) => setBerichtsheftYear(parseInt(e.target.value))}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
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
                      const dayNames = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag', Sa: 'Samstag', So: 'Sonntag' };
                      const dayDate = new Date(berichtsheftWeek);
                      dayDate.setDate(dayDate.getDate() + dayIndex);

                      return (
                        <div key={day} className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-4`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{day}</span>
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {dayNames[day]} - {dayDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                              </span>
                            </div>
                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {calculateDayHours(day)} Std.
                            </div>
                          </div>

                          {currentWeekEntries[day].map((entry, entryIndex) => {
                            const selectedBereich = AUSBILDUNGSRAHMENPLAN.find(
                              bereich => bereich.nr === parseInt(entry.bereich, 10)
                            );
                            const bereichSuggestions = getBerichtsheftBereichSuggestions(entry.taetigkeit, berichtsheftYear);
                            const showBereichSuggestions = !entry.bereich && bereichSuggestions.length > 0;
                            const inhaltePreview = (selectedBereich?.inhalte || []).slice(0, 3);

                            return (
                              <div key={entryIndex} className="mb-3">
                                <div className="flex flex-wrap lg:flex-nowrap gap-2 items-start">
                                  <div className="flex-grow min-w-[200px]">
                                    <input
                                      type="text"
                                      value={entry.taetigkeit}
                                      onChange={(e) => updateWeekEntry(day, entryIndex, 'taetigkeit', e.target.value)}
                                      placeholder="Ausgeführte Tätigkeit..."
                                      className={`w-full px-3 py-2 border rounded-lg text-sm ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                                    />
                                  </div>
                                  <div className="w-20 flex-shrink-0">
                                    <input
                                      type="number"
                                      value={entry.stunden}
                                      onChange={(e) => updateWeekEntry(day, entryIndex, 'stunden', e.target.value)}
                                      placeholder="Std."
                                      step="0.5"
                                      min="0"
                                      max="12"
                                      className={`w-full px-2 py-2 border rounded-lg text-sm text-center ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                                    />
                                  </div>
                                  <div className="w-full sm:w-auto">
                                    <select
                                      value={entry.bereich}
                                      onChange={(e) => updateWeekEntry(day, entryIndex, 'bereich', e.target.value)}
                                      className={`w-full min-w-[500px] px-2 py-2 border rounded-lg text-sm ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                    >
                                      <option value="">-- Bereich --</option>
                                      {AUSBILDUNGSRAHMENPLAN.map((b) => {
                                        const yearWeeks = getBerichtsheftYearWeeks(b, berichtsheftYear);
                                        const yearHint = yearWeeks > 0 ? `• ${yearWeeks}W im Jahr ${berichtsheftYear}` : '• laufend/anderes Jahr';
                                        return (
                                          <option key={b.nr} value={b.nr}>
                                            {b.icon} {b.nr}. {b.bereich} {yearHint}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <button
                                    onClick={() => removeWeekEntry(day, entryIndex)}
                                    disabled={currentWeekEntries[day].length <= 1}
                                    className={`px-2 py-2 rounded-lg transition-all ${currentWeekEntries[day].length <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-100'}`}
                                  >
                                    <X size={18} />
                                  </button>
                                </div>

                                {showBereichSuggestions && (
                                  <div className={`mt-2 rounded-lg px-3 py-2 text-xs ${darkMode ? 'bg-slate-800 border border-slate-600 text-gray-300' : 'bg-white border border-gray-200 text-gray-700'}`}>
                                    <div className="font-semibold mb-1">Vorschläge für passenden Bereich:</div>
                                    <div className="flex flex-wrap gap-2">
                                      {bereichSuggestions.map(({ bereich }) => (
                                        <button
                                          key={`${day}-${entryIndex}-suggest-${bereich.nr}`}
                                          onClick={() => updateWeekEntry(day, entryIndex, 'bereich', String(bereich.nr))}
                                          className={`${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-cyan-300' : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700'} px-2 py-1 rounded-md transition-all`}
                                        >
                                          {bereich.icon} {bereich.nr}. {bereich.bereich}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {selectedBereich && inhaltePreview.length > 0 && (
                                  <div className={`mt-2 rounded-lg px-3 py-2 text-xs ${darkMode ? 'bg-slate-800 border border-slate-600 text-gray-300' : 'bg-white border border-gray-200 text-gray-700'}`}>
                                    <div className="font-semibold mb-1">Zu vermittelnde Tätigkeiten (Hilfe):</div>
                                    <div className="space-y-1">
                                      {inhaltePreview.map((inhalt, idx) => (
                                        <div key={`${day}-${entryIndex}-inhalt-${idx}`} className="flex items-start justify-between gap-2">
                                          <span className="leading-5">{inhalt}</span>
                                          <button
                                            onClick={() => applyBerichtsheftInhaltToEntry(day, entryIndex, inhalt)}
                                            className={`${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-cyan-300' : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700'} px-2 py-0.5 rounded-md whitespace-nowrap transition-all`}
                                          >
                                            Übernehmen
                                          </button>
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
                            className={`mt-2 text-sm flex items-center gap-1 ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}
                          >
                            <Plus size={16} /> Weitere Tätigkeit
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Gesamtstunden */}
                  <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-500'} rounded-xl p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">Gesamtstunden diese Woche:</span>
                      <span className="text-3xl font-bold">{calculateTotalHours()} Std.</span>
                    </div>
                  </div>

                  {/* Bemerkungen */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Bemerkungen Auszubildender
                      </label>
                      <textarea
                        value={berichtsheftBemerkungAzubi}
                        onChange={(e) => setBerichtsheftBemerkungAzubi(e.target.value)}
                        rows={3}
                        placeholder="Besondere Vorkommnisse, Lernerfolge..."
                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Bemerkungen Ausbilder
                      </label>
                      <textarea
                        value={berichtsheftBemerkungAusbilder}
                        onChange={(e) => setBerichtsheftBemerkungAusbilder(e.target.value)}
                        rows={3}
                        placeholder="Feedback, Anmerkungen..."
                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  </div>

                  {/* Unterschriften */}
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-6`}>
                    <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Für die Richtigkeit</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum Azubi</label>
                          <input
                            type="date"
                            value={berichtsheftDatumAzubi}
                            onChange={(e) => setBerichtsheftDatumAzubi(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
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
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum Ausbilder</label>
                          <input
                            type="date"
                            value={berichtsheftDatumAusbilder}
                            onChange={(e) => setBerichtsheftDatumAusbilder(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
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
                  <div className="flex gap-4 flex-wrap">
                    <button
                      onClick={saveBerichtsheft}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg"
                    >
                      <Check className="inline mr-2" size={20} />
                      {selectedBerichtsheft ? 'Aktualisieren' : 'Speichern'}
                    </button>
                    {selectedBerichtsheft && (
                      <button
                        onClick={() => generateBerichtsheftPDF(selectedBerichtsheft)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center gap-2"
                      >
                        <Download className="inline" size={20} />
                        PDF / Drucken
                      </button>
                    )}
                    {selectedBerichtsheft && (
                      <button
                        onClick={resetBerichtsheftForm}
                        className={`px-6 py-3 rounded-xl font-medium ${darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        Abbrechen
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* LIST VIEW - Übersicht aller Berichte */}
              {berichtsheftViewMode === 'list' && (
                <div className="space-y-4">
                  {berichtsheftEntries.length === 0 ? (
                    <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="text-6xl mb-4">📖</div>
                      <p className="text-lg">Noch keine Berichtshefte vorhanden</p>
                      <p className="text-sm mt-2">Erstelle deinen ersten Wochenbericht!</p>
                      <button
                        onClick={() => setBerichtsheftViewMode('edit')}
                        className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium"
                      >
                        <Plus className="inline mr-2" size={18} />
                        Neuer Bericht
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className={`grid gap-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {berichtsheftEntries.map(entry => (
                          <div key={entry.id} className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4`}>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                  Nr. {entry.nachweis_nr}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${entry.signatur_azubi && entry.signatur_ausbilder ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-600'}`}>
                                  {entry.signatur_azubi && entry.signatur_ausbilder ? '✓ Unterschrieben' : '⏳ Offen'}
                                </span>
                              </div>
                              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                KW {new Date(entry.week_start).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} - {new Date(entry.week_end).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                <span className="mx-2">|</span>
                                {entry.ausbildungsjahr}. Ausbildungsjahr
                                <span className="mx-2">|</span>
                                <span className="font-medium">{entry.total_hours || 0} Stunden</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => generateBerichtsheftPDF(entry)}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                              >
                                <Download size={16} /> PDF
                              </button>
                              <button
                                onClick={() => loadBerichtsheftForEdit(entry)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                              >
                                ✏️ Bearbeiten
                              </button>
                              <button
                                onClick={() => deleteBerichtsheft(entry.id)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Statistik */}
                      <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{berichtsheftEntries.length}</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wochen erfasst</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                              {berichtsheftEntries.filter(e => e.signatur_azubi && e.signatur_ausbilder).length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unterschrieben</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                              {berichtsheftEntries.filter(e => !e.signatur_azubi || !e.signatur_ausbilder).length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Offen</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              {berichtsheftEntries.reduce((sum, e) => sum + (e.total_hours || 0), 0)}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stunden gesamt</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* PROGRESS VIEW - Fortschritt nach Ausbildungsrahmenplan */}
              {berichtsheftViewMode === 'progress' && (
                <div className="space-y-6">
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50'} rounded-xl p-4`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Hier siehst du deinen Fortschritt in den verschiedenen Ausbildungsbereichen gemäß Ausbildungsrahmenplan (§4).
                      Die Soll-Wochen basieren auf den zeitlichen Richtwerten der Verordnung.
                    </p>
                  </div>

                  {(() => {
                    const progress = calculateBereichProgress();
                    const stundenProWoche = 40; // Annahme: 40 Stunden = 1 Woche

                    return (
                      <div className="space-y-4">
                        {Object.entries(progress).map(([nr, data]) => {
                          const istWochen = data.istStunden / stundenProWoche;
                          const prozent = data.sollWochen > 0 ? Math.min(100, (istWochen / data.sollWochen) * 100) : (data.istStunden > 0 ? 100 : 0);

                          return (
                            <div key={nr} className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-4`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{data.icon}</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {nr}. {data.name}
                                  </span>
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {istWochen.toFixed(1)} / {data.sollWochen > 0 ? data.sollWochen : '∞'} Wochen
                                  <span className="ml-2 font-bold">({data.istStunden.toFixed(0)} Std.)</span>
                                </div>
                              </div>
                              <div className={`h-4 rounded-full overflow-hidden ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${data.color}`}
                                  style={{ width: `${prozent}%` }}
                                />
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {prozent.toFixed(0)}% erreicht
                                </span>
                                {prozent >= 100 && (
                                  <span className="text-xs text-green-500 font-medium">✓ Abgeschlossen</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Gesamt-Übersicht */}
                  <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-500'} rounded-xl p-6 text-white`}>
                    <h3 className="font-bold text-lg mb-4">Gesamtfortschritt</h3>
                    {(() => {
                      const progress = calculateBereichProgress();
                      const totalIstStunden = Object.values(progress).reduce((sum, d) => sum + d.istStunden, 0);
                      const totalSollWochen = AUSBILDUNGSRAHMENPLAN.reduce((sum, b) => sum + b.gesamtWochen, 0);
                      const totalSollStunden = totalSollWochen * 40;
                      const gesamtProzent = totalSollStunden > 0 ? (totalIstStunden / totalSollStunden) * 100 : 0;

                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-3xl font-bold">{totalIstStunden.toFixed(0)}</div>
                            <div className="text-sm opacity-80">Stunden erfasst</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{(totalIstStunden / 40).toFixed(1)}</div>
                            <div className="text-sm opacity-80">Wochen erfasst</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{totalSollWochen}</div>
                            <div className="text-sm opacity-80">Soll-Wochen (gesamt)</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{gesamtProzent.toFixed(0)}%</div>
                            <div className="text-sm opacity-80">Gesamtfortschritt</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Ausbildungsrahmenplan Übersicht */}
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-6`}>
                    <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      📋 Ausbildungsrahmenplan - Übersicht
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className={`${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                            <th className={`px-3 py-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nr.</th>
                            <th className={`px-3 py-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bereich</th>
                            <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>1. Jahr</th>
                            <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>2. Jahr</th>
                            <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>3. Jahr</th>
                            <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gesamt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {AUSBILDUNGSRAHMENPLAN.map((bereich, idx) => (
                            <tr key={bereich.nr} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'} ${idx % 2 === 0 ? '' : (darkMode ? 'bg-slate-750' : 'bg-gray-100')}`}>
                              <td className={`px-3 py-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                <span className="mr-1">{bereich.icon}</span> {bereich.nr}
                              </td>
                              <td className={`px-3 py-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {bereich.bereich}
                                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{bereich.paragraph}</div>
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
                              <td className={`px-3 py-2 text-center font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                {bereich.gesamtWochen || 'lfd.'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className={`mt-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      * "lfd." = wird während der gesamten Ausbildung laufend vermittelt
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
  );
};

export default BerichtsheftView;
