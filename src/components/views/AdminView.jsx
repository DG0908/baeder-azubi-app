import React from 'react';
import { Users, AlertTriangle, Trophy, Brain, BookOpen, MessageCircle, Trash2, Shield, Check, X, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabase';
import { CATEGORIES, PERMISSIONS, MENU_GROUP_LABELS } from '../../data/constants';

const AdminView = ({
  currentUserEmail,
  canManageRoles = false,
  canEditAppConfig = false,
  getAdminStats,
  questionReports,
  toggleQuestionReportStatus,
  pendingUsers,
  approveUser,
  loadData,
  allUsers,
  getDaysUntilDeletion,
  changeUserRole,
  exportUserData,
  deleteUser,
  toggleSchoolCardPermission,
  toggleSignReportsPermission,
  editingMenuItems,
  setEditingMenuItems,
  appConfig,
  editingThemeColors,
  setEditingThemeColors,
  moveMenuItem,
  updateMenuItemIcon,
  updateMenuItemLabel,
  updateMenuItemGroup,
  toggleMenuItemVisibility,
  updateThemeColor,
  saveAppConfig,
  resetAppConfig,
}) => {
  const { darkMode } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-8 text-center relative">
        <h2 className="text-3xl font-bold mb-2">👑 Admin-Bereich</h2>
        <p className="opacity-90">Nutzerverwaltung & Datenschutz</p>
        <div className="absolute bottom-2 right-3 text-xs opacity-60">v1.1.0</div>
      </div>

      {/* Admin Statistics Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        {(() => {
          const stats = getAdminStats();
          return (
            <>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-blue-500" size={32} />
                  <span className="text-3xl font-bold text-blue-600">{stats.totalUsers}</span>
                </div>
                <p className="text-sm text-gray-600">Aktive Nutzer</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.azubis} Azubis • {stats.trainers} Ausbilder
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="text-yellow-500" size={32} />
                  <span className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals}</span>
                </div>
                <p className="text-sm text-gray-600">Ausstehende Freischaltungen</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="text-green-500" size={32} />
                  <span className="text-3xl font-bold text-green-600">{stats.totalGames}</span>
                </div>
                <p className="text-sm text-gray-600">Laufende Spiele</p>
                <p className="text-xs text-gray-500 mt-1">{stats.activeGamesCount} aktiv</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <Brain className="text-purple-500" size={32} />
                  <span className="text-3xl font-bold text-purple-600">{stats.totalQuestions}</span>
                </div>
                <p className="text-sm text-gray-600">Eingereichte Fragen</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.approvedQuestions} genehmigt • {stats.pendingQuestions} offen
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="text-blue-500" size={32} />
                  <span className="text-3xl font-bold text-blue-600">{stats.totalMaterials}</span>
                </div>
                <p className="text-sm text-gray-600">Lernmaterialien</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <MessageCircle className="text-green-500" size={32} />
                  <span className="text-3xl font-bold text-green-600">{stats.totalMessages}</span>
                </div>
                <p className="text-sm text-gray-600">Chat-Nachrichten</p>
              </div>

              <div className={`bg-white rounded-xl p-6 shadow-md ${
                stats.usersToDeleteSoon > 0 ? 'border-2 border-red-400' : ''
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <Trash2 className={stats.usersToDeleteSoon > 0 ? 'text-red-500' : 'text-gray-400'} size={32} />
                  <span className={`text-3xl font-bold ${
                    stats.usersToDeleteSoon > 0 ? 'text-red-600' : 'text-gray-400'
                  }`}>{stats.usersToDeleteSoon}</span>
                </div>
                <p className="text-sm text-gray-600">Löschung bald fällig</p>
                <p className="text-xs text-gray-500 mt-1">Innerhalb 30 Tage</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="text-indigo-500" size={32} />
                  <span className="text-3xl font-bold text-indigo-600">{stats.admins}</span>
                </div>
                <p className="text-sm text-gray-600">Administratoren</p>
              </div>
            </>
          );
        })()}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <AlertTriangle className="mr-2 text-amber-500" />
            Fragen-Feedback
          </h3>
          <div className="text-sm text-gray-600">
            {questionReports.filter((entry) => entry.status !== 'resolved').length} offen · {questionReports.length} gesamt
          </div>
        </div>

        {questionReports.length === 0 ? (
          <p className="text-gray-500 text-sm">Noch keine Rueckmeldungen zu Fragen vorhanden.</p>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto">
            {questionReports
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((report) => {
                const category = CATEGORIES.find((entry) => entry.id === report.category);
                const isResolved = report.status === 'resolved';
                return (
                  <div key={report.id} className={`border rounded-lg p-4 ${isResolved ? 'bg-gray-50 border-gray-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isResolved ? 'bg-green-100 text-green-700' : 'bg-amber-200 text-amber-800'}`}>
                          {isResolved ? 'Erledigt' : 'Offen'}
                        </span>
                        <span className="text-xs text-gray-600">
                          {category ? `${category.icon} ${category.name}` : report.category}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleString('de-DE')}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800 mb-1">{report.questionText}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Quelle: {report.source} · Von: {report.reportedBy || 'Unbekannt'}
                    </p>
                    {report.note && (
                      <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-md p-2 mb-2">
                        Hinweis: {report.note}
                      </p>
                    )}
                    <button
                      onClick={() => {
                        void toggleQuestionReportStatus(report.id);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-bold ${
                        isResolved
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isResolved ? 'Wieder oeffnen' : 'Als erledigt markieren'}
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {pendingUsers.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center text-yellow-800">
            <AlertTriangle className="mr-2" />
            Ausstehende Freischaltungen ({pendingUsers.length})
          </h3>
          <div className="space-y-3">
            {pendingUsers.map(acc => (
              <div key={acc.email} className="bg-white rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">{acc.name}</p>
                  <p className="text-sm text-gray-600">{acc.email} • {(PERMISSIONS[acc.role] || PERMISSIONS.azubi).label}</p>
                  {acc.role === 'azubi' && acc.trainingEnd && (
                    <p className="text-xs text-gray-500">Ausbildungsende: {new Date(acc.trainingEnd).toLocaleDateString()}</p>
                  )}
                </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveUser(acc.email)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Account von ${acc.name} wirklich ablehnen und löschen?`)) {
                          await supabase.from('profiles').delete().eq('email', acc.email);
                          loadData();
                          alert('Account abgelehnt und gelöscht.');
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      <X size={20} />
                    </button>
                  </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Users className="mr-2 text-blue-500" />
          Aktive Nutzer ({allUsers.length})
        </h3>
        <div className="space-y-3">
          {allUsers.map(acc => {
            const daysLeft = getDaysUntilDeletion(acc);
            const isOwnAccount =
              String(acc?.email || '').trim().toLowerCase() === String(currentUserEmail || '').trim().toLowerCase();
            const roleSelectDisabled = isOwnAccount || !canManageRoles;
            return (
              <div key={acc.email} className="border rounded-lg p-4">
                <div className="flex items-start gap-2 mb-1 flex-wrap">
                  <p className="font-bold">{acc.name}</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
                    acc.role === 'admin' ? 'bg-purple-500' :
                    acc.role === 'trainer' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {(PERMISSIONS[acc.role] || PERMISSIONS.azubi).label}
                  </span>
                  {acc.is_owner && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500 text-white">
                      Hauptadmin
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{acc.email}</p>
                {acc.trainingEnd && (
                  <p className="text-xs text-gray-500">
                    Ausbildungsende: {new Date(acc.trainingEnd).toLocaleDateString()}
                  </p>
                )}
                {acc.lastLogin && (
                  <p className="text-xs text-gray-500">
                    Letzter Login: {new Date(acc.lastLogin).toLocaleDateString()}
                  </p>
                )}
                {daysLeft !== null && (
                  <div className={`mt-1 flex items-center text-xs ${
                    daysLeft < 30 ? 'text-red-600' : daysLeft < 90 ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    <AlertTriangle size={14} className="mr-1" />
                    {daysLeft > 0
                      ? `Automatische Löschung in ${daysLeft} Tagen`
                      : 'Löschung steht bevor'}
                  </div>
                )}
                <div className="flex gap-2 mt-3 flex-wrap">
                  <select
                    value={acc.role}
                    onChange={(e) => changeUserRole(acc.email, e.target.value)}
                    className="px-3 py-1.5 border rounded text-sm"
                    disabled={roleSelectDisabled}
                    title={
                      isOwnAccount
                        ? 'Dein eigener Account kann hier nicht umgestellt werden.'
                        : !canManageRoles
                          ? 'Nur der Hauptadmin darf Rollen ändern.'
                          : undefined
                    }
                  >
                    <option value="azubi">Azubi</option>
                    <option value="trainer">Ausbilder</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => exportUserData(acc.email, acc.name)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                    title="Daten exportieren"
                  >
                    <Download size={18} />
                  </button>
                  {acc.role !== 'admin' && (
                    <button
                      onClick={() => deleteUser(acc.email)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                      title="Nutzer löschen"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  {acc.role === 'trainer' && (
                    <>
                      <button
                        onClick={() => toggleSchoolCardPermission(acc.id, acc.can_view_school_cards)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                          acc.can_view_school_cards
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={acc.can_view_school_cards ? 'Kontrollkarten-Zugriff entziehen' : 'Kontrollkarten-Zugriff erteilen'}
                      >
                        Kontrollkarten {acc.can_view_school_cards ? '✓' : '○'}
                      </button>
                      <button
                        onClick={() => toggleSignReportsPermission(acc.id, acc.can_sign_reports)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                          acc.can_sign_reports
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={acc.can_sign_reports ? 'Berichtsheft-Unterschrift entziehen' : 'Berichtsheft-Unterschrift erteilen'}
                      >
                        Berichte {acc.can_sign_reports ? '✓' : '○'}
                      </button>
                    </>
                  )}
                  {acc.role === 'admin' && (
                    <div className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold flex items-center">
                      <Shield size={14} className="mr-1" />
                      Geschützt
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UI Editor Section */}
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <span className="text-2xl mr-2">🎨</span>
          UI-Editor (App-Konfiguration)
        </h3>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Hier kannst du die Navigation und Farben der App für alle Nutzer anpassen.
        </p>

        {!canEditAppConfig && (
          <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${darkMode ? 'border-amber-600 bg-amber-900/30 text-amber-200' : 'border-amber-300 bg-amber-50 text-amber-800'}`}>
            Nur der Hauptadmin darf Navigation/Farben bearbeiten und speichern.
          </div>
        )}

        {/* Initialize editing state button */}
        {canEditAppConfig && editingMenuItems.length === 0 && (
          <button
            onClick={() => {
              setEditingMenuItems([...appConfig.menuItems]);
              setEditingThemeColors({...appConfig.themeColors});
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-bold mb-4"
          >
            🎨 Editor öffnen
          </button>
        )}

        {canEditAppConfig && editingMenuItems.length > 0 && (
          <>
            {/* Menu Items Editor */}
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4 mb-4`}>
              <h4 className={`font-bold mb-3 ${darkMode ? 'text-cyan-400' : 'text-gray-800'}`}>
                📋 Menü-Reihenfolge & Sichtbarkeit
              </h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {[...editingMenuItems]
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        darkMode ? 'bg-slate-600' : 'bg-white'
                      } ${!item.visible ? 'opacity-50' : ''}`}
                    >
                      {/* Order number */}
                      <span className={`text-sm font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {index + 1}.
                      </span>

                      {/* Move buttons */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveMenuItem(item.id, 'up')}
                          disabled={index === 0}
                          className={`p-1 rounded ${index === 0 ? 'opacity-30' : 'hover:bg-gray-200 dark:hover:bg-slate-500'}`}
                        >
                          ⬆️
                        </button>
                        <button
                          onClick={() => moveMenuItem(item.id, 'down')}
                          disabled={index === editingMenuItems.length - 1}
                          className={`p-1 rounded ${index === editingMenuItems.length - 1 ? 'opacity-30' : 'hover:bg-gray-200 dark:hover:bg-slate-500'}`}
                        >
                          ⬇️
                        </button>
                      </div>

                      {/* Icon */}
                      <input
                        type="text"
                        value={item.icon}
                        onChange={(e) => updateMenuItemIcon(item.id, e.target.value)}
                        className={`w-12 text-center text-xl p-1 rounded border ${darkMode ? 'bg-slate-700 border-slate-500' : 'border-gray-300'}`}
                        maxLength={2}
                      />

                      {/* Label */}
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateMenuItemLabel(item.id, e.target.value)}
                        className={`flex-1 px-3 py-1 rounded border ${darkMode ? 'bg-slate-700 border-slate-500 text-white' : 'border-gray-300'}`}
                      />

                      {/* Group dropdown */}
                      <select
                        value={item.group || 'lernen'}
                        onChange={(e) => updateMenuItemGroup(item.id, e.target.value)}
                        className={`text-xs rounded px-2 py-1.5 border ${darkMode ? 'bg-slate-700 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                      >
                        {Object.entries(MENU_GROUP_LABELS).map(([gId, gLabel]) => (
                          <option key={gId} value={gId}>{gLabel || 'Start'}</option>
                        ))}
                      </select>

                      {/* Visibility toggle */}
                      <button
                        onClick={() => toggleMenuItemVisibility(item.id)}
                        className={`px-3 py-1 rounded-lg text-sm font-bold ${
                          item.visible
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {item.visible ? '👁️ Sichtbar' : '🚫 Versteckt'}
                      </button>

                      {/* Permission indicator */}
                      {item.requiresPermission && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          🔒 {item.requiresPermission}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Theme Colors Editor */}
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4 mb-4`}>
              <h4 className={`font-bold mb-3 ${darkMode ? 'text-cyan-400' : 'text-gray-800'}`}>
                🎨 Theme-Farben
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(editingThemeColors).map(([key, value]) => (
                  <div key={key} className="flex flex-col items-center gap-2">
                    <label className={`text-sm font-medium capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {key === 'primary' ? '🔵 Primär' :
                       key === 'secondary' ? '⚪ Sekundär' :
                       key === 'success' ? '🟢 Erfolg' :
                       key === 'danger' ? '🔴 Gefahr' :
                       key === 'warning' ? '🟡 Warnung' : key}
                    </label>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => updateThemeColor(key, e.target.value)}
                      className="w-16 h-10 rounded cursor-pointer border-2 border-gray-300"
                    />
                    <span className="text-xs font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={saveAppConfig}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-bold"
              >
                💾 Speichern (für alle Nutzer)
              </button>
              <button
                onClick={resetAppConfig}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold"
              >
                🔄 Zurücksetzen
              </button>
              <button
                onClick={() => {
                  setEditingMenuItems([]);
                  setEditingThemeColors({});
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold"
              >
                ❌ Abbrechen
              </button>
            </div>

            {/* Info Box */}
            <div className={`mt-4 ${darkMode ? 'bg-blue-900/50 border-blue-600' : 'bg-blue-50 border-blue-300'} border-2 rounded-lg p-4`}>
              <h4 className={`font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                💡 Hinweise
              </h4>
              <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Änderungen gelten für <strong>alle Nutzer</strong> nach dem Speichern</li>
                <li>• Menüpunkte mit 🔒 sind nur für bestimmte Rollen sichtbar</li>
                <li>• Versteckte Menüpunkte erscheinen nicht in der Navigation</li>
                <li>• Farben werden aktuell nur in der Vorschau angezeigt</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminView;
