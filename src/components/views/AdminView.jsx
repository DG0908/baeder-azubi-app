import React from 'react';
import { Users, AlertTriangle, Trophy, Brain, BookOpen, MessageCircle, Trash2, Shield, Check, X, Download, KeyRound, Building2, Ticket, Copy, Plus, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';
import { isSecureBackendApiEnabled } from '../../lib/secureApiClient';
import { secureOrganizationsApi, secureInvitationsApi, secureUsersApi, mapFrontendRoleToBackendRole } from '../../lib/secureApi';

const USE_SECURE_API = isSecureBackendApiEnabled();

// ─── Betriebe & Einladungscodes Verwaltung (nur Owner) ───
const OrganizationManager = () => {
  const { showToast } = useApp();
  const [orgs, setOrgs] = React.useState([]);
  const [codes, setCodes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showNewOrg, setShowNewOrg] = React.useState(false);
  const [showNewCode, setShowNewCode] = React.useState(false);
  const [newOrg, setNewOrg] = React.useState({ name: '', slug: '', contact_name: '', contact_email: '', max_azubis: 50 });
  const [newCode, setNewCode] = React.useState({ organization_id: '', code: '', role: 'azubi', max_uses: 30 });

  const loadOrgs = async () => {
    setLoading(true);
    try {
      if (USE_SECURE_API) {
        const orgsData = await secureOrganizationsApi.list();
        setOrgs((orgsData || []).map(o => ({
          id: o.id, name: o.name, slug: o.slug,
          contact_name: o.contactName, contact_email: o.contactEmail,
          max_azubis: o.maxAzubis || 50, created_at: o.createdAt
        })));
        const codesData = await secureInvitationsApi.list();
        setCodes((codesData || []).map(c => ({
          id: c.id, code: c.code,
          organization_id: c.organizationId,
          organizations: c.organization ? { name: c.organization.name } : null,
          role: (c.role || '').toLowerCase(),
          max_uses: c.maxUses, current_uses: c.currentUses || 0,
          is_active: c.isActive ?? true,
          created_at: c.createdAt, expires_at: c.expiresAt
        })));
      } else {
        const { data: orgsData } = await supabase
          .from('organizations')
          .select('*')
          .order('created_at', { ascending: true });
        setOrgs(orgsData || []);

        const { data: codesData } = await supabase
          .from('invitation_codes')
          .select('*, organizations(name)')
          .order('created_at', { ascending: false });
        setCodes(codesData || []);
      }
    } catch (error) {
      showToast('Fehler beim Laden: ' + error.message, 'error');
    }
    setLoading(false);
  };

  React.useEffect(() => { loadOrgs(); }, []);

  const createOrg = async () => {
    if (!newOrg.name.trim() || !newOrg.slug.trim()) {
      showToast('Name und Kürzel sind Pflichtfelder!', 'error');
      return;
    }
    const slug = newOrg.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    try {
      if (USE_SECURE_API) {
        await secureOrganizationsApi.create({
          name: newOrg.name.trim(),
          slug,
          contactName: newOrg.contact_name || undefined,
          contactEmail: newOrg.contact_email || undefined
        });
      } else {
        const { error } = await supabase.from('organizations').insert({
          ...newOrg,
          slug,
          name: newOrg.name.trim()
        });
        if (error) throw error;
      }
      showToast(`Betrieb "${newOrg.name}" angelegt!`, 'success');
      setNewOrg({ name: '', slug: '', contact_name: '', contact_email: '', max_azubis: 50 });
      setShowNewOrg(false);
      loadOrgs();
    } catch (error) {
      showToast('Fehler: ' + error.message, 'error');
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  const createCode = async () => {
    if (!newCode.organization_id) {
      showToast('Bitte einen Betrieb auswählen!', 'error');
      return;
    }
    try {
      if (USE_SECURE_API) {
        const result = await secureInvitationsApi.create({
          role: mapFrontendRoleToBackendRole(newCode.role),
          organizationId: newCode.organization_id,
          maxUses: newCode.max_uses || 30
        });
        const createdCode = result?.code || 'Erstellt';
        showToast(`Code "${createdCode}" erstellt!`, 'success');
      } else {
        const code = newCode.code.trim().toUpperCase() || generateCode();
        const { error } = await supabase.from('invitation_codes').insert({
          organization_id: newCode.organization_id,
          code,
          role: newCode.role,
          max_uses: newCode.max_uses,
          created_by: null
        });
        if (error) {
          if (error.message.includes('duplicate')) {
            showToast('Dieser Code existiert bereits!', 'error');
          } else {
            throw error;
          }
          return;
        }
        showToast(`Code "${code}" erstellt!`, 'success');
      }
      setNewCode({ organization_id: '', code: '', role: 'azubi', max_uses: 30 });
      setShowNewCode(false);
      loadOrgs();
    } catch (error) {
      showToast('Fehler: ' + error.message, 'error');
    }
  };

  const toggleCodeActive = async (codeId, currentActive) => {
    try {
      if (USE_SECURE_API) {
        // Secure API only supports revoke (delete), not toggle
        if (currentActive) {
          await secureInvitationsApi.revoke(codeId);
        }
      } else {
        await supabase.from('invitation_codes').update({ is_active: !currentActive }).eq('id', codeId);
      }
      loadOrgs();
    } catch (error) {
      showToast('Fehler: ' + error.message, 'error');
    }
  };

  const deleteCode = async (codeId, codeText) => {
    if (!confirm(`Code "${codeText}" wirklich löschen?`)) return;
    try {
      if (USE_SECURE_API) {
        await secureInvitationsApi.revoke(codeId);
      } else {
        await supabase.from('invitation_codes').delete().eq('id', codeId);
      }
      showToast('Code gelöscht', 'success');
      loadOrgs();
    } catch (error) {
      showToast('Fehler: ' + error.message, 'error');
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Code "${code}" kopiert!`, 'success');
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Lade Betriebe...</div>;

  return (
    <div className="space-y-6">
      {/* Betriebe */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <Building2 className="mr-2 text-indigo-500" />
            Betriebe ({orgs.length})
          </h3>
          <div className="flex gap-2">
            <button onClick={loadOrgs} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
              <RefreshCw size={18} />
            </button>
            <button
              onClick={() => setShowNewOrg(!showNewOrg)}
              className="flex items-center gap-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium"
            >
              <Plus size={16} /> Neuer Betrieb
            </button>
          </div>
        </div>

        {showNewOrg && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4 space-y-3">
            <h4 className="font-bold text-indigo-800">Neuen Betrieb anlegen</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Betriebsname *"
                value={newOrg.name}
                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                className="px-3 py-2 border border-indigo-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Kürzel (z.B. oktopus) *"
                value={newOrg.slug}
                onChange={(e) => setNewOrg({ ...newOrg, slug: e.target.value })}
                className="px-3 py-2 border border-indigo-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Ansprechpartner"
                value={newOrg.contact_name}
                onChange={(e) => setNewOrg({ ...newOrg, contact_name: e.target.value })}
                className="px-3 py-2 border border-indigo-300 rounded-lg"
              />
              <input
                type="email"
                placeholder="Kontakt-E-Mail"
                value={newOrg.contact_email}
                onChange={(e) => setNewOrg({ ...newOrg, contact_email: e.target.value })}
                className="px-3 py-2 border border-indigo-300 rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={createOrg} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium">
                Anlegen
              </button>
              <button onClick={() => setShowNewOrg(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                Abbrechen
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {orgs.map(org => (
            <div key={org.id} className={`border rounded-xl p-4 ${org.is_active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-lg">{org.name}</div>
                  <div className="text-sm text-gray-600">
                    Kürzel: <span className="font-mono bg-gray-200 px-1 rounded">{org.slug}</span>
                    {org.contact_name && <> · Kontakt: {org.contact_name}</>}
                    {org.contact_email && <> · {org.contact_email}</>}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${org.is_active ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                  {org.is_active ? 'Aktiv' : 'Inaktiv'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Einladungscodes */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <Ticket className="mr-2 text-emerald-500" />
            Einladungscodes ({codes.length})
          </h3>
          <button
            onClick={() => setShowNewCode(!showNewCode)}
            className="flex items-center gap-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium"
          >
            <Plus size={16} /> Neuer Code
          </button>
        </div>

        {showNewCode && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 space-y-3">
            <h4 className="font-bold text-emerald-800">Neuen Einladungscode erstellen</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={newCode.organization_id}
                onChange={(e) => setNewCode({ ...newCode, organization_id: e.target.value })}
                className="px-3 py-2 border border-emerald-300 rounded-lg"
              >
                <option value="">Betrieb auswählen *</option>
                {orgs.filter(o => o.is_active).map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
              <select
                value={newCode.role}
                onChange={(e) => setNewCode({ ...newCode, role: e.target.value })}
                className="px-3 py-2 border border-emerald-300 rounded-lg"
              >
                <option value="azubi">Azubi-Code</option>
                <option value="trainer">Ausbilder-Code</option>
              </select>
              <input
                type="text"
                placeholder="Code (leer = automatisch)"
                value={newCode.code}
                onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                className="px-3 py-2 border border-emerald-300 rounded-lg font-mono"
              />
              <input
                type="number"
                placeholder="Max. Nutzungen"
                value={newCode.max_uses}
                onChange={(e) => setNewCode({ ...newCode, max_uses: parseInt(e.target.value) || 0 })}
                className="px-3 py-2 border border-emerald-300 rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={createCode} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">
                Code erstellen
              </button>
              <button onClick={() => setShowNewCode(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                Abbrechen
              </button>
            </div>
          </div>
        )}

        {codes.length === 0 ? (
          <p className="text-gray-500 text-sm">Noch keine Einladungscodes vorhanden.</p>
        ) : (
          <div className="space-y-2">
            {codes.map(c => (
              <div key={c.id} className={`flex items-center justify-between border rounded-lg p-3 ${c.is_active ? 'border-emerald-200' : 'border-gray-200 opacity-60'}`}>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-lg bg-gray-100 px-3 py-1 rounded-lg">{c.code}</span>
                  <div className="text-sm">
                    <div className="font-medium">{c.organizations?.name || '?'}</div>
                    <div className="text-gray-500">
                      {c.role === 'azubi' ? 'Azubi' : 'Ausbilder'} · {c.used_count}/{c.max_uses || '\u221e'} genutzt
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyCode(c.code)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    title="Code kopieren"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => toggleCodeActive(c.id, c.is_active)}
                    className={`p-2 rounded-lg ${c.is_active ? 'bg-green-100 hover:bg-green-200 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}`}
                    title={c.is_active ? 'Deaktivieren' : 'Aktivieren'}
                  >
                    {c.is_active ? <Check size={16} /> : <X size={16} />}
                  </button>
                  <button
                    onClick={() => deleteCode(c.id, c.code)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
                    title="Code löschen"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminPasswordReset = ({ userId, userEmail, userName }) => {
  const { showToast } = useApp();
  const [loading, setLoading] = React.useState(false);

  const generatePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let pw = '';
    for (let i = 0; i < 12; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    return pw;
  };

  const handleReset = async () => {
    const tempPassword = generatePassword();
    if (!confirm(`Neues Passwort für ${userName || userEmail} setzen?\n\nDas generierte Passwort wird: ${tempPassword}\n\nBitte notiere es und teile es dem User mit.`)) return;
    setLoading(true);
    try {
      if (USE_SECURE_API) {
        await secureUsersApi.adminResetPassword(userId, tempPassword);
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
          redirectTo: window.location.origin
        });
        if (error) throw error;
      }
      alert(`Neues Passwort für ${userName || userEmail}:\n\n${tempPassword}\n\nBitte dem User mitteilen!`);
      showToast(`Passwort für ${userName || userEmail} zurückgesetzt!`, 'success');
    } catch (err) {
      showToast('Fehler: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleReset}
      disabled={loading}
      className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white p-2 rounded-lg"
      title="Passwort zurücksetzen"
    >
      <KeyRound size={18} />
    </button>
  );
};
import { CATEGORIES, PERMISSIONS, MENU_GROUP_LABELS } from '../../data/constants';

// ─── Org-Zuordnung Dropdown für einzelne User ───
const UserOrgAssign = ({ userId, currentOrgId, onChanged }) => {
  const { showToast } = useApp();
  const [orgs, setOrgs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (USE_SECURE_API) {
      secureOrganizationsApi.list()
        .then(data => setOrgs((data || []).map(o => ({ id: o.id, name: o.name }))))
        .catch(() => {});
    } else {
      supabase.from('organizations').select('id, name').eq('is_active', true).order('name')
        .then(({ data }) => setOrgs(data || []));
    }
  }, []);

  const handleChange = async (newOrgId) => {
    setLoading(true);
    try {
      if (USE_SECURE_API) {
        const { secureUsersApi } = await import('../../lib/secureApi');
        await secureUsersApi.updateRole(userId, { organizationId: newOrgId || null });
      } else {
        const { error } = await supabase
          .from('profiles')
          .update({ organization_id: newOrgId || null })
          .eq('id', userId);
        if (error) throw error;
      }
      showToast('Betrieb zugewiesen!', 'success');
      if (onChanged) onChanged();
    } catch (error) {
      showToast('Fehler: ' + error.message, 'error');
    }
    setLoading(false);
  };

  return (
    <select
      value={currentOrgId || ''}
      onChange={(e) => handleChange(e.target.value || null)}
      disabled={loading}
      className="px-2 py-1.5 border border-indigo-300 rounded text-sm bg-indigo-50"
      title="Betrieb zuweisen"
    >
      <option value="">Kein Betrieb</option>
      {orgs.map(o => (
        <option key={o.id} value={o.id}>{o.name}</option>
      ))}
    </select>
  );
};

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
  toggleExamGradesPermission,
  repairQuizStats,
  sendTestPush,
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
  companies = [],
  saveCompanies,
}) => {
  const { darkMode, showToast } = useApp();
  const { user } = useAuth();
  const [repairingQuizStats, setRepairingQuizStats] = React.useState(false);
  const [lastQuizRepairResult, setLastQuizRepairResult] = React.useState(null);
  const [newCompanyName, setNewCompanyName] = React.useState('');
  const [sendingTestPush, setSendingTestPush] = React.useState(false);
  const [lastTestPushResult, setLastTestPushResult] = React.useState(null);
  const [testPushTargetScope, setTestPushTargetScope] = React.useState('self');

  const handleRepairQuizStats = async () => {
    if (typeof repairQuizStats !== 'function' || repairingQuizStats) return;
    if (!confirm('Quiz-Statistiken jetzt für alle Nutzer reparieren? Vorhandene höhere Werte bleiben erhalten.')) {
      return;
    }

    setRepairingQuizStats(true);
    try {
      const result = await repairQuizStats();
      setLastQuizRepairResult(result);
      showToast(
        `Quiz-Stats geprüft: ${result.updatedUsers || 0} Nutzer aktualisiert.`,
        'success',
        3500
      );
    } catch (error) {
      console.error('Quiz stats repair failed:', error);
      showToast(error?.message || 'Quiz-Statistiken konnten nicht repariert werden.', 'error');
    } finally {
      setRepairingQuizStats(false);
    }
  };

  const handleSendTestPush = async () => {
    if (typeof sendTestPush !== 'function' || sendingTestPush) return;

    setSendingTestPush(true);
    try {
      const result = await sendTestPush(testPushTargetScope);
      setLastTestPushResult(result);
      showToast(
        result?.scheduled
          ? `${result?.targetScope === 'organization' ? 'Org-' : ''}Test-Push geplant. App jetzt fuer ${result.delaySeconds || 15}s schliessen.`
          : `Test-Push gesendet: ${result?.sent || 0} Endgeraete erreicht.`,
        'success',
        4500
      );
    } catch (error) {
      console.error('Test push failed:', error);
      showToast(error?.message || 'Test-Push konnte nicht geplant werden.', 'error');
    } finally {
      setSendingTestPush(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-8 text-center relative">
        <h2 className="text-3xl font-bold mb-2">👑 Admin-Bereich</h2>
        <p className="opacity-90">Nutzerverwaltung & Datenschutz</p>
        <div className="absolute bottom-2 right-3 text-xs opacity-60">v1.1.0</div>
      </div>

      {/* Betriebe & Einladungscodes — nur für Owner */}
      {user?.isOwner && <OrganizationManager />}

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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-xl font-bold flex items-center">
              <RefreshCw className="mr-2 text-cyan-500" />
              Quiz-Statistiken reparieren
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Stellt Siege, Niederlagen und Unentschieden aus beendeten Quizduellen wieder her, ohne vorhandene höhere Werte zu senken.
            </p>
          </div>
          <button
            onClick={handleRepairQuizStats}
            disabled={repairingQuizStats}
            className={`px-4 py-2 rounded-lg font-bold text-white ${
              repairingQuizStats
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-600'
            }`}
          >
            {repairingQuizStats ? 'Repair läuft...' : 'Quiz-Stats reparieren'}
          </button>
        </div>

        {lastQuizRepairResult && (
          <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
            <div className="font-bold mb-2">Letzter Repair-Lauf</div>
            <div>{lastQuizRepairResult.updatedUsers || 0} Nutzer aktualisiert</div>
            <div>{lastQuizRepairResult.scannedFinishedGames || 0} beendete Spiele geprüft</div>
            <div>{lastQuizRepairResult.scannedProfiles || 0} Profile geprüft</div>
            <div>{lastQuizRepairResult.skippedGamesMissingProfiles || 0} Spiele ohne passendes Profil übersprungen</div>
            <div>{lastQuizRepairResult.ambiguousNames || 0} doppelte Nutzernamen übersprungen</div>
            {Array.isArray(lastQuizRepairResult.updatedPreview) && lastQuizRepairResult.updatedPreview.length > 0 && (
              <div className="mt-3 text-xs text-cyan-800">
                Beispiele: {lastQuizRepairResult.updatedPreview.map((entry) => `${entry.name} (${entry.wins}/${entry.losses}/${entry.draws})`).join(', ')}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-xl font-bold flex items-center">
              <MessageCircle className="mr-2 text-indigo-500" />
              Hintergrund-Push testen
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Plant einen Test-Push in 15 Sekunden an dich selbst oder an alle Nutzer deiner Organisation. Danach die App direkt schliessen.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={testPushTargetScope}
              onChange={(event) => setTestPushTargetScope(event.target.value)}
              className="px-3 py-2 border border-indigo-200 rounded-lg text-sm bg-indigo-50"
            >
              <option value="self">An mich</option>
              <option value="organization">An meine Organisation</option>
            </select>
            <button
              onClick={handleSendTestPush}
              disabled={sendingTestPush}
              className={`px-4 py-2 rounded-lg font-bold text-white ${
                sendingTestPush
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              {sendingTestPush ? 'Plane Test-Push...' : 'Test-Push in 15s'}
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          News nutzen denselben Push-Kanal. Wenn dieser Test bei geschlossener App ankommt, kommen auch News-Pushs im Hintergrund an.
        </div>

        {lastTestPushResult && (
          <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
            <div className="font-bold mb-2">Letzter Test</div>
            <div>Nutzer: {lastTestPushResult.userName || 'Unbekannt'}</div>
            <div>Ziel: {lastTestPushResult.targetScope === 'organization' ? 'Organisation' : 'Ich selbst'}</div>
            <div>{lastTestPushResult.targetCount || 0} Zielnutzer</div>
            <div>{lastTestPushResult.subscriptionCount || 0} aktive Push-Abos gefunden</div>
            <div>
              {lastTestPushResult.scheduled
                ? `Versand geplant in ${lastTestPushResult.delaySeconds || 15} Sekunden`
                : `Sofort versendet: ${lastTestPushResult.sent || 0} erfolgreich, ${lastTestPushResult.failed || 0} fehlgeschlagen`}
            </div>
          </div>
        )}
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
          <p className="text-gray-500 text-sm">Noch keine Rückmeldungen zu Fragen vorhanden.</p>
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
              <div key={acc.email} className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-start">
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
                          try {
                            if (USE_SECURE_API && acc.id) {
                              const { secureUsersApi } = await import('../../lib/secureApi');
                              await secureUsersApi.deleteUser(acc.id);
                            } else {
                              await supabase.from('profiles').delete().eq('email', acc.email);
                            }
                            loadData();
                            alert('Account abgelehnt und gelöscht.');
                          } catch (error) {
                            alert('Fehler: ' + error.message);
                          }
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Building2 size={14} className="text-indigo-500" />
                  <span className="text-xs text-gray-500">Betrieb:</span>
                  <UserOrgAssign userId={acc.id} currentOrgId={acc.organization_id} onChanged={loadData} />
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
                <div className="flex gap-2 mt-3 flex-wrap items-center">
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
                  {user?.isOwner && (
                    <UserOrgAssign userId={acc.id} currentOrgId={acc.organization_id} onChanged={loadData} />
                  )}
                  <button
                    onClick={() => exportUserData(acc.email, acc.name)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                    title="Daten exportieren"
                  >
                    <Download size={18} />
                  </button>
                  <AdminPasswordReset userId={acc.id} userEmail={acc.email} userName={acc.name} />
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
                      <button
                        onClick={() => toggleExamGradesPermission(acc.id, acc.can_view_exam_grades)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                          acc.can_view_exam_grades
                            ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={acc.can_view_exam_grades ? 'Klasuren-Zugriff entziehen' : 'Klasuren-Zugriff erteilen'}
                      >
                        Klasuren {acc.can_view_exam_grades ? '✓' : '○'}
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

        {/* Betriebe verwalten */}
        {canEditAppConfig && (
          <div className={`mb-6 p-4 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} shadow-sm`}>
            <h3 className={`font-bold text-base mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🏢 Betriebe verwalten</h3>
            <div className="space-y-2 mb-3">
              {companies.map((c, idx) => (
                <div key={idx} className={`flex items-center justify-between px-3 py-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{c}</span>
                  <button
                    onClick={() => {
                      const updated = companies.filter((_, i) => i !== idx);
                      saveCompanies(updated);
                    }}
                    className="text-red-400 hover:text-red-600 text-xs font-bold px-2 py-1 rounded"
                  >
                    Entfernen
                  </button>
                </div>
              ))}
              {companies.length === 0 && (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Noch keine Betriebe angelegt.</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCompanyName.trim()) {
                    saveCompanies([...companies, newCompanyName.trim()]);
                    setNewCompanyName('');
                  }
                }}
                placeholder="Neuer Betrieb..."
                className={`flex-1 px-3 py-2 rounded-lg text-sm border ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'}`}
              />
              <button
                onClick={() => {
                  if (newCompanyName.trim()) {
                    saveCompanies([...companies, newCompanyName.trim()]);
                    setNewCompanyName('');
                  }
                }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold rounded-lg"
              >
                Hinzufügen
              </button>
            </div>
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
