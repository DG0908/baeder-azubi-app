import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabase';
import { AVATARS, PERMISSIONS } from '../../data/constants';
import { getAgeHandicap } from '../../data/swimming';

const ProfileView = ({ userStats, swimSessions, userBadges, setCurrentView }) => {
  const { user, setUser, handleLogout } = useAuth();
  const { darkMode, showToast, playSound } = useApp();

  const [profileEditName, setProfileEditName] = useState('');
  const [profileEditPassword, setProfileEditPassword] = useState('');
  const [profileEditPasswordConfirm, setProfileEditPasswordConfirm] = useState('');
  const [profileEditCompany, setProfileEditCompany] = useState('');
  const [profileEditBirthDate, setProfileEditBirthDate] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const updateProfileName = async () => {
    if (!profileEditName.trim()) {
      showToast('Bitte gib einen Namen ein.', 'warning');
      return;
    }
    setProfileSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: profileEditName.trim() })
        .eq('id', user.id);
      if (error) throw error;
      const updatedUser = { ...user, name: profileEditName.trim() };
      setUser(updatedUser);
      localStorage.setItem('baeder_user', JSON.stringify(updatedUser));
      showToast('Name erfolgreich geändert!', 'success');
      setProfileEditName('');
    } catch (error) {
      console.error('Error updating name:', error);
      showToast('Fehler beim Ändern des Namens', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const updateProfilePassword = async () => {
    if (!profileEditPassword || !profileEditPasswordConfirm) {
      showToast('Bitte beide Passwort-Felder ausfüllen.', 'warning');
      return;
    }
    if (profileEditPassword !== profileEditPasswordConfirm) {
      showToast('Die Passwörter stimmen nicht überein!', 'error');
      return;
    }
    if (profileEditPassword.length < 6) {
      showToast('Das Passwort muss mindestens 6 Zeichen haben.', 'warning');
      return;
    }
    setProfileSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: profileEditPassword });
      if (error) throw error;
      showToast('Passwort erfolgreich geändert!', 'success');
      setProfileEditPassword('');
      setProfileEditPasswordConfirm('');
    } catch (error) {
      console.error('Error updating password:', error);
      showToast('Fehler beim Ändern des Passworts', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const updateProfileAvatar = async (avatarId) => {
    setProfileSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar: avatarId })
        .eq('id', user.id);
      if (error) throw error;
      const updatedUser = { ...user, avatar: avatarId };
      setUser(updatedUser);
      localStorage.setItem('baeder_user', JSON.stringify(updatedUser));
      showToast(avatarId ? 'Avatar geändert!' : 'Avatar entfernt', 'success');
    } catch (error) {
      console.error('Error updating avatar:', error);
      showToast('Fehler beim Ändern des Avatars', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const updateProfileCompany = async () => {
    setProfileSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ company: profileEditCompany.trim() || null })
        .eq('id', user.id);
      if (error) throw error;
      const updatedUser = { ...user, company: profileEditCompany.trim() || null };
      setUser(updatedUser);
      localStorage.setItem('baeder_user', JSON.stringify(updatedUser));
      showToast('Betrieb gespeichert!', 'success');
      setProfileEditCompany('');
    } catch (error) {
      console.error('Error updating company:', error);
      showToast('Fehler beim Speichern des Betriebs', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const updateProfileBirthDate = async () => {
    if (!profileEditBirthDate) {
      showToast('Bitte gib dein Geburtsdatum ein', 'warning');
      return;
    }
    setProfileSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ birth_date: profileEditBirthDate })
        .eq('id', user.id);
      if (error) throw error;
      const updatedUser = { ...user, birthDate: profileEditBirthDate };
      setUser(updatedUser);
      localStorage.setItem('baeder_user', JSON.stringify(updatedUser));
      showToast('Geburtsdatum gespeichert!', 'success');
      setProfileEditBirthDate('');
    } catch (error) {
      console.error('Error updating birth date:', error);
      showToast('Fehler beim Speichern des Geburtsdatums', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl p-8 text-center">
        <div className="text-6xl mb-3">
          {user.avatar ? AVATARS.find(a => a.id === user.avatar)?.emoji || '👤' : '👤'}
        </div>
        <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
        <p className="opacity-90">{PERMISSIONS[user.role]?.label || user.role}</p>
      </div>

      {/* Avatar auswählen */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Avatar auswählen
        </h3>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Wähle einen Avatar für dein Profil
        </p>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => updateProfileAvatar(avatar.id)}
              disabled={profileSaving}
              title={avatar.label}
              className={`text-3xl p-2 rounded-xl transition-all hover:scale-110 ${
                user.avatar === avatar.id
                  ? 'bg-cyan-500 ring-2 ring-cyan-400 ring-offset-2 ' + (darkMode ? 'ring-offset-slate-800' : 'ring-offset-white')
                  : darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {avatar.emoji}
            </button>
          ))}
        </div>
        {user.avatar && (
          <button
            onClick={() => updateProfileAvatar(null)}
            disabled={profileSaving}
            className={`mt-4 text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
          >
            Avatar entfernen
          </button>
        )}
      </div>

      {/* Aktivitäts-Statistik */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Meine Aktivitäten
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-green-900 to-emerald-900' : 'bg-gradient-to-br from-green-100 to-emerald-100'}`}>
            <div className="text-3xl mb-1">🏆</div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {userStats?.wins || 0}
            </div>
            <div className={`text-xs ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Quiz-Siege</div>
          </div>
          <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-blue-900 to-cyan-900' : 'bg-gradient-to-br from-blue-100 to-cyan-100'}`}>
            <div className="text-3xl mb-1">🏊</div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {swimSessions.filter(s => s.user_id === user.id || s.user_name === user.name).reduce((sum, s) => sum + (s.distance || 0), 0).toLocaleString()}m
            </div>
            <div className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Geschwommen</div>
          </div>
          <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-gradient-to-br from-purple-100 to-pink-100'}`}>
            <div className="text-3xl mb-1">🎖️</div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {userBadges.length}
            </div>
            <div className={`text-xs ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Badges</div>
          </div>
          <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-orange-900 to-amber-900' : 'bg-gradient-to-br from-orange-100 to-amber-100'}`}>
            <div className="text-3xl mb-1">✅</div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {Object.values(userStats?.categoryStats || {}).reduce((sum, cat) => sum + (cat.correct || 0), 0)}
            </div>
            <div className={`text-xs ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>Richtige Antworten</div>
          </div>
        </div>
        <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} grid grid-cols-3 gap-4 text-center`}>
          <div>
            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {userStats?.losses || 0}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Niederlagen</div>
          </div>
          <div>
            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {userStats?.draws || 0}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unentschieden</div>
          </div>
          <div>
            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {swimSessions.filter(s => s.user_id === user.id || s.user_name === user.name).length}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Schwimm-Einheiten</div>
          </div>
        </div>
      </div>

      {/* Aktuelle Daten */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Aktuelle Kontodaten
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>E-Mail</p>
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.email}</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rolle</p>
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {PERMISSIONS[user.role]?.label || user.role}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Betrieb</p>
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {user.company || <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Nicht angegeben</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Betrieb ändern */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Betrieb angeben
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={user.company || "z.B. Stadtbad München, Hallenbad Köln..."}
            value={profileEditCompany}
            onChange={(e) => setProfileEditCompany(e.target.value)}
            className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
          />
          <button
            onClick={updateProfileCompany}
            disabled={profileSaving}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
          >
            {profileSaving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          In welchem Schwimmbad / Betrieb arbeitest du?
        </p>
      </div>

      {/* Geburtsdatum für Handicap */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🎂 Geburtsdatum
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="date"
            value={profileEditBirthDate || user.birthDate || ''}
            onChange={(e) => setProfileEditBirthDate(e.target.value)}
            className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
          />
          <button
            onClick={updateProfileBirthDate}
            disabled={profileSaving || !profileEditBirthDate}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
          >
            {profileSaving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
        {user.birthDate && (
          <p className={`mt-2 text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            ✓ Gespeichert: {new Date(user.birthDate).toLocaleDateString('de-DE')}
            {getAgeHandicap(user.birthDate) > 0 && (
              <span className="ml-2 text-cyan-500">
                (Handicap: {Math.round(getAgeHandicap(user.birthDate) * 100)}% Zeitbonus)
              </span>
            )}
          </p>
        )}
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Wird für das Alters-Handicap bei der Schwimm-Challenge verwendet (ab 40 Jahren).
        </p>
      </div>

      {/* Name ändern */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Anzeigename ändern
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Neuer Name"
            value={profileEditName}
            onChange={(e) => setProfileEditName(e.target.value)}
            className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
          />
          <button
            onClick={updateProfileName}
            disabled={profileSaving || !profileEditName.trim()}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
          >
            {profileSaving ? 'Speichern...' : 'Name ändern'}
          </button>
        </div>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Dein Anzeigename wird in der App, im Chat und in der Bestenliste angezeigt.
        </p>
      </div>

      {/* Freunde einladen */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-pink-900/80 to-purple-900/80' : 'bg-gradient-to-r from-pink-100 to-purple-100'} rounded-xl p-6 shadow-lg border-2 ${darkMode ? 'border-pink-700' : 'border-pink-300'}`}>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🎉 Freunde einladen
        </h3>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Teile die App mit deinen Azubi-Kollegen und lernt gemeinsam!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={async () => {
              const shareData = {
                title: 'FAB COMPASS - Bäder-Azubi App',
                text: 'Hey! Schau dir diese Lern-App für Fachangestellte für Bäderbetriebe an. Quiz, Karteikarten, Schwimm-Challenge und mehr!',
                url: 'https://baeder-azubi-app.vercel.app'
              };
              if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                try {
                  await navigator.share(shareData);
                  showToast('Danke fürs Teilen!', 'success');
                } catch (err) {
                  if (err.name !== 'AbortError') console.error('Share error:', err);
                }
              } else {
                try {
                  await navigator.clipboard.writeText('https://baeder-azubi-app.vercel.app');
                  showToast('Link kopiert! Teile ihn mit deinen Freunden.', 'success');
                  playSound('splash');
                } catch (err) {
                  showToast('Link: https://baeder-azubi-app.vercel.app', 'info');
                }
              }
            }}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
          >
            <span className="text-xl">📤</span>
            <span>App teilen</span>
          </button>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText('https://baeder-azubi-app.vercel.app');
                showToast('Link kopiert!', 'success');
                playSound('splash');
              } catch (err) {
                showToast('Link: https://baeder-azubi-app.vercel.app', 'info');
              }
            }}
            className={`px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              darkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
            }`}
          >
            <span className="text-xl">📋</span>
            <span>Link kopieren</span>
          </button>
        </div>
      </div>

      {/* Passwort ändern */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Passwort ändern
        </h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Neues Passwort
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mindestens 6 Zeichen"
                value={profileEditPassword}
                onChange={(e) => setProfileEditPassword(e.target.value)}
                className={`w-full px-4 py-3 pr-12 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Passwort bestätigen
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="Passwort wiederholen"
                value={profileEditPasswordConfirm}
                onChange={(e) => setProfileEditPasswordConfirm(e.target.value)}
                className={`w-full px-4 py-3 pr-12 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            onClick={updateProfilePassword}
            disabled={profileSaving || !profileEditPassword || !profileEditPasswordConfirm}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
          >
            {profileSaving ? 'Speichern...' : 'Passwort ändern'}
          </button>
        </div>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Verwende ein sicheres Passwort mit mindestens 6 Zeichen.
        </p>
      </div>

      {/* Abmelden */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Sitzung beenden
        </h3>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
        >
          Abmelden
        </button>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Du wirst aus der App abgemeldet und musst dich erneut anmelden.
        </p>
      </div>

      {/* Rechtliches */}
      <div className={`${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'} rounded-xl p-6`}>
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          📜 Rechtliches
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setCurrentView('impressum')}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'} transition-all`}
          >
            Impressum
          </button>
          <button
            onClick={() => setCurrentView('datenschutz')}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'} transition-all`}
          >
            Datenschutzerklärung
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
