import React from 'react';
import { Building2, Lock, MessageCircle, Send, Shield, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getAvatarById, PERMISSIONS } from '../../data/constants';
import AvatarBadge from '../ui/AvatarBadge';

const CHAT_SCOPE_META = {
  azubi_room: {
    label: 'Azubi-Chat',
    description: 'Nur Azubis aus deinem Betrieb',
    icon: Users
  },
  staff_room: {
    label: 'Azubi & Ausbilder',
    description: 'Gemeinsamer Chat fuer den Betrieb',
    icon: Shield
  },
  direct_staff: {
    label: 'Direktchat',
    description: '1:1 zwischen Azubi und Ausbilder',
    icon: MessageCircle
  }
};

const STAFF_ROLES = new Set(['trainer', 'ausbilder', 'admin']);

const getRoleKey = (value) => String(value || '').trim().toLowerCase();

const getFirstName = (fullName) => String(fullName || '').trim().split(/\s+/)[0] || '?';

const formatChatTime = (timeInput) => {
  const date = new Date(timeInput);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
};

const ChatView = ({
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  chatScope,
  setChatScope,
  selectedChatRecipientId,
  setSelectedChatRecipientId,
  directChatCandidates,
  hasChatOrganization
}) => {
  const { user } = useAuth();
  const { darkMode } = useApp();
  const messagesEndRef = React.useRef(null);

  const allowedScopes = getRoleKey(user?.role) === 'azubi'
    ? ['azubi_room', 'staff_room', 'direct_staff']
    : ['staff_room', 'direct_staff'];

  const selectedScopeMeta = CHAT_SCOPE_META[chatScope] || CHAT_SCOPE_META.staff_room;
  const selectedPartner = directChatCandidates.find((account) => account.id === selectedChatRecipientId) || null;

  const filteredMessages = (Array.isArray(messages) ? messages : [])
    .filter((message) => {
      if (hasChatOrganization && user?.organizationId && message.organizationId && message.organizationId !== user.organizationId) {
        return false;
      }

      if (chatScope === 'direct_staff') {
        if (!selectedPartner) return false;
        return message.scope === 'direct_staff'
          && (
            (message.senderId === user?.id && message.recipientId === selectedPartner.id)
            || (message.senderId === selectedPartner.id && message.recipientId === user?.id)
          );
      }

      return message.scope === chatScope;
    })
    .sort((a, b) => a.time - b.time);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages.length, chatScope, selectedChatRecipientId]);

  const selectedScopeDescription = chatScope === 'direct_staff'
    ? (selectedPartner
      ? `Privater Chat mit ${getFirstName(selectedPartner.name)}`
      : 'Waehle zuerst einen Chatpartner aus deinem Betrieb')
    : selectedScopeMeta.description;

  const inputPlaceholder = !hasChatOrganization
    ? 'Chat erst nach Betriebszuordnung verfuegbar'
    : chatScope === 'direct_staff'
      ? (selectedPartner ? `Nachricht an ${getFirstName(selectedPartner.name)}...` : 'Zuerst Chatpartner auswaehlen...')
      : `Nachricht in ${selectedScopeMeta.label} schreiben...`;

  const directChatEmptyText = getRoleKey(user?.role) === 'azubi'
    ? 'Aktuell ist kein Ausbilder in deinem Betrieb verfuegbar.'
    : 'Aktuell ist kein Azubi in deinem Betrieb verfuegbar.';

  const canSend = hasChatOrganization && (chatScope !== 'direct_staff' || Boolean(selectedPartner));

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-2xl shadow-lg overflow-hidden`}>
        <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 via-slate-900 to-indigo-900' : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500'} text-white p-5`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageCircle size={24} />
                Chat
              </h2>
              <p className="text-sm text-white/80 mt-2">
                Saubere Trennung zwischen Azubi-Raum, Betriebschat und direktem Ausbilderkontakt.
              </p>
            </div>
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${darkMode ? 'bg-white/10 border-white/15' : 'bg-white/20 border-white/25'} border`}>
              <Building2 size={18} />
              <div className="text-sm">
                <div className="font-semibold">{user?.organizationName || 'Kein Betrieb zugewiesen'}</div>
                <div className="text-white/80">{(PERMISSIONS[user?.role] || PERMISSIONS.azubi).label}</div>
              </div>
            </div>
          </div>
        </div>

        {!hasChatOrganization && (
          <div className={`${darkMode ? 'bg-amber-900/30 border-amber-700 text-amber-100' : 'bg-amber-50 border-amber-200 text-amber-800'} border-t p-4 text-sm flex items-start gap-3`}>
            <Lock size={18} className="mt-0.5 flex-shrink-0" />
            <div>
              Der Chat wird pro Betrieb getrennt. Deinem Profil ist aktuell noch kein Betrieb zugeordnet.
            </div>
          </div>
        )}

        <div className={`${darkMode ? 'border-slate-700 bg-slate-800/70' : 'border-gray-200 bg-gray-50/80'} border-t p-3`}>
          <div className="flex flex-wrap gap-2">
            {allowedScopes.map((scopeKey) => {
              const scope = CHAT_SCOPE_META[scopeKey];
              const ScopeIcon = scope.icon;
              const isActive = scopeKey === chatScope;

              return (
                <button
                  key={scopeKey}
                  type="button"
                  onClick={() => setChatScope(scopeKey)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-cyan-500 text-white border-cyan-400 shadow-md'
                      : darkMode
                        ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-500'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-cyan-400'
                  }`}
                >
                  <ScopeIcon size={16} />
                  {scope.label}
                </button>
              );
            })}
          </div>
          <p className={`text-sm mt-3 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            {selectedScopeDescription}
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] min-h-[620px]">
          <aside className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-gray-200'} border-r p-4 space-y-4`}>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Chatbereich</h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {selectedScopeMeta.label}
              </p>
            </div>

            {chatScope === 'direct_staff' ? (
              <div className="space-y-2">
                <h4 className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Verfuegbare Kontakte
                </h4>
                {directChatCandidates.length > 0 ? (
                  directChatCandidates.map((account) => {
                    const isActive = account.id === selectedChatRecipientId;
                    const roleLabel = (PERMISSIONS[account.role] || PERMISSIONS.azubi).label;

                    return (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => setSelectedChatRecipientId(account.id)}
                        className={`w-full text-left rounded-xl border p-3 transition-all ${
                          isActive
                            ? 'border-cyan-400 bg-cyan-500/10'
                            : darkMode
                              ? 'border-slate-700 bg-slate-800 hover:border-cyan-500'
                              : 'border-gray-200 bg-white hover:border-cyan-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <AvatarBadge
                            avatar={account.avatar ? getAvatarById(account.avatar) : null}
                            fallback={String(account.name || '?').charAt(0).toUpperCase()}
                            size="sm"
                            className="border border-white/40 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {getFirstName(account.name)}
                            </p>
                            <p className={`text-xs truncate ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                              {roleLabel}{account.company ? ` · ${account.company}` : ''}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className={`${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-gray-200 text-gray-600'} border rounded-xl p-3 text-sm`}>
                    {directChatEmptyText}
                  </div>
                )}
              </div>
            ) : (
              <div className={`${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-gray-200 text-gray-600'} border rounded-xl p-4 text-sm`}>
                <p className="font-semibold mb-2">{selectedScopeMeta.label}</p>
                <p>{selectedScopeMeta.description}.</p>
                {chatScope === 'azubi_room' && (
                  <p className="mt-3 text-xs opacity-80">
                    Ausbilder sehen diesen Bereich nicht.
                  </p>
                )}
              </div>
            )}
          </aside>

          <section className="flex flex-col min-h-0">
            <div className={`${darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-gray-200 bg-white'} border-b px-5 py-4 flex items-center justify-between gap-3`}>
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {chatScope === 'direct_staff'
                    ? (selectedPartner ? getFirstName(selectedPartner.name) : 'Direktchat')
                    : selectedScopeMeta.label}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  {selectedScopeDescription}
                </p>
              </div>
              <div className={`text-xs px-3 py-1 rounded-full border ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-slate-50 border-gray-200 text-gray-600'
              }`}>
                {filteredMessages.length} Nachrichten
              </div>
            </div>

            <div className={`${darkMode ? 'bg-slate-950' : 'bg-slate-50/70'} flex-1 overflow-y-auto px-4 py-5 space-y-4`}>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => {
                  const isMine = message.senderId === user?.id || message.user === user?.name;
                  const senderIsStaff = STAFF_ROLES.has(getRoleKey(message.senderRole));
                  const senderLabel = (PERMISSIONS[message.senderRole] || PERMISSIONS.azubi).label;

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMine && (
                        <AvatarBadge
                          avatar={message.avatar ? getAvatarById(message.avatar) : null}
                          fallback={String(message.user || '?').charAt(0).toUpperCase()}
                          size="sm"
                          className="border border-white/40 flex-shrink-0 mt-1"
                        />
                      )}

                      <div
                        className={`max-w-xl rounded-2xl px-4 py-3 shadow-sm ${
                          isMine
                            ? 'bg-cyan-500 text-white'
                            : senderIsStaff
                              ? (darkMode ? 'bg-violet-900/55 text-violet-50' : 'bg-violet-100 text-violet-900')
                              : (darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-gray-900')
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-sm font-semibold">{getFirstName(message.user)}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                            isMine
                              ? 'bg-white/20 text-white'
                              : senderIsStaff
                                ? (darkMode ? 'bg-violet-800 text-violet-100' : 'bg-white/70 text-violet-800')
                                : (darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600')
                          }`}>
                            {senderLabel}
                          </span>
                          <span className={`text-[11px] ${isMine ? 'text-white/80' : darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            {formatChatTime(message.time)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                      </div>

                      {isMine && (
                        <AvatarBadge
                          avatar={user?.avatar ? getAvatarById(user.avatar) : null}
                          fallback={String(user?.name || '?').charAt(0).toUpperCase()}
                          size="sm"
                          className="border border-white/40 flex-shrink-0 mt-1"
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className={`${darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-gray-200 text-gray-600'} border rounded-2xl p-6 text-center max-w-xl mx-auto`}>
                  <p className="font-semibold mb-2">Noch keine Nachrichten vorhanden</p>
                  <p className="text-sm">
                    {chatScope === 'direct_staff'
                      ? (selectedPartner
                        ? `Starte den ersten Chat mit ${getFirstName(selectedPartner.name)}.`
                        : 'Waehle links einen Kontakt aus, um den Direktchat zu starten.')
                      : `Starte den ersten Beitrag im Bereich ${selectedScopeMeta.label}.`}
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border-t p-4`}>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey && canSend) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={!canSend}
                  placeholder={inputPlaceholder}
                  className={`flex-1 px-4 py-3 rounded-xl border outline-none transition-all ${
                    darkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500'
                      : 'bg-slate-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-cyan-400'
                  } ${!canSend ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!canSend || !newMessage.trim()}
                  className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-400 text-white font-semibold transition-all flex items-center gap-2"
                >
                  <Send size={18} />
                  Senden
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
