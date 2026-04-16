import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  loadMessages as dsLoadMessages,
  loadDirectMessages as dsLoadDirectMessages,
  createChatMessage as dsCreateChatMessage,
  deleteChatMessage as dsDeleteChatMessage,
} from '../lib/dataService';
import { friendlyError } from '../lib/friendlyError';

// ── Constants ────────────────────────────────────────────────
const STAFF_CHAT_ROLES = new Set(['trainer', 'ausbilder', 'admin']);

const CHAT_SCOPE_META = {
  azubi_room: {
    label: 'Azubi-Chat',
    description: 'Nur Azubis aus deinem Betrieb',
  },
  staff_room: {
    label: 'Azubi & Ausbilder',
    description: 'Gemeinsamer Betriebschat',
  },
  direct_staff: {
    label: 'Direktchat',
    description: '1:1 zwischen Azubi und Ausbilder',
  },
};

const getRoleKey = (value) => String(value || '').trim().toLowerCase();
const isStaffRole = (value) => STAFF_CHAT_ROLES.has(getRoleKey(value));
const getAccountOrganizationId = (account) =>
  account?.organizationId || account?.organization_id || null;
const getChatScopeKey = (value, fallback = 'staff_room') => {
  const normalized = String(value || '').trim().toLowerCase();
  return CHAT_SCOPE_META[normalized] ? normalized : fallback;
};

// ── Hook ─────────────────────────────────────────────────────
/**
 * Extracts all chat-related state & logic from App.jsx.
 *
 * @param {object}   deps
 * @param {object}   deps.user            – current user from AuthContext
 * @param {Array}    deps.allUsers        – full user list from App state
 * @param {Function} deps.showToast       – toast helper
 * @param {Function} deps.moderateContent – content filter (returns false if blocked)
 * @param {Function} deps.sendNotification – push notification helper (currently no-op)
 */
export function useChatState({ user, allUsers, showToast, moderateContent, sendNotification }) {
  // ── State ────────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatScope, setChatScope] = useState('staff_room');
  const [selectedChatRecipientId, setSelectedChatRecipientId] = useState('');

  // ── Derived values ───────────────────────────────────────
  const hasChatOrganization = Boolean(user?.organizationId);

  const chatUsersInOrganization = useMemo(
    () =>
      hasChatOrganization
        ? allUsers.filter(
            (account) =>
              account?.id &&
              account.approved !== false &&
              getAccountOrganizationId(account) === user.organizationId
          )
        : [],
    [hasChatOrganization, allUsers, user?.organizationId]
  );

  const directChatCandidates = useMemo(() => {
    return chatUsersInOrganization.filter((account) => {
      if (!user?.id || account.id === user.id) return false;
      const accountRole = getRoleKey(account.role);
      if (!accountRole) return false;
      if (getRoleKey(user?.role) === 'azubi') return isStaffRole(accountRole);
      if (isStaffRole(user?.role)) return accountRole === 'azubi';
      return false;
    });
  }, [chatUsersInOrganization, user?.id, user?.role]);

  // ── Effects ──────────────────────────────────────────────

  // Ensure chatScope is valid for the user's role
  useEffect(() => {
    if (!user?.id) return;
    const allowedScopes =
      getRoleKey(user.role) === 'azubi'
        ? ['azubi_room', 'staff_room', 'direct_staff']
        : ['staff_room', 'direct_staff'];
    if (!allowedScopes.includes(chatScope)) {
      setChatScope(allowedScopes[0]);
    }
  }, [user?.id, user?.role, chatScope]);

  // Sync selected recipient when scope changes
  useEffect(() => {
    if (chatScope !== 'direct_staff') {
      if (selectedChatRecipientId) {
        setSelectedChatRecipientId('');
      }
      return;
    }
    if (!directChatCandidates.some((account) => account.id === selectedChatRecipientId)) {
      setSelectedChatRecipientId(directChatCandidates[0]?.id || '');
    }
  }, [chatScope, selectedChatRecipientId, directChatCandidates]);

  // Load direct messages on-demand
  useEffect(() => {
    if (chatScope !== 'direct_staff' || !selectedChatRecipientId) return;
    const load = async () => {
      try {
        const mapped = await dsLoadDirectMessages({
          recipientId: selectedChatRecipientId,
          currentUserId: user?.id,
        });
        setMessages((prev) => {
          const withoutOldDirect = prev.filter(
            (msg) =>
              msg.scope !== 'direct_staff' ||
              !(
                (msg.senderId === user?.id && msg.recipientId === selectedChatRecipientId) ||
                (msg.senderId === selectedChatRecipientId && msg.recipientId === user?.id)
              )
          );
          return [...withoutOldDirect, ...mapped];
        });
      } catch (error) {
        console.warn('Direct messages load error:', error.message);
      }
    };
    load();
  }, [chatScope, selectedChatRecipientId, user?.id]);

  // ── Normalizer (used by loadData / loadLightData) ────────
  const normalizeChatMessageRow = useCallback(
    (row, userDirectory = {}) => {
      const senderProfile = row?.sender_id ? userDirectory[row.sender_id] : null;
      const senderRole =
        getRoleKey(row?.user_role || senderProfile?.role || 'azubi') || 'azubi';
      const fallbackScope = senderRole === 'azubi' ? 'azubi_room' : 'staff_room';
      return {
        id: row?.id || `${row?.created_at || Date.now()}-${row?.user_name || 'chat'}`,
        user: String(row?.user_name || senderProfile?.name || 'Unbekannt'),
        text: String(row?.content || ''),
        time: new Date(row?.created_at || Date.now()).getTime(),
        avatar: row?.user_avatar || senderProfile?.avatar || null,
        senderId: row?.sender_id || senderProfile?.id || null,
        senderRole,
        scope: getChatScopeKey(row?.chat_scope, fallbackScope),
        organizationId:
          row?.organization_id || getAccountOrganizationId(senderProfile) || null,
        recipientId: row?.recipient_id || null,
      };
    },
    []
  );

  // ── Public helpers for App.jsx loadData / loadLightData ──
  const loadChatMessages = useCallback(
    async (userDirectory, role) => {
      const msgs = await dsLoadMessages(normalizeChatMessageRow, userDirectory, role);
      setMessages(msgs);
    },
    [normalizeChatMessageRow]
  );

  // ── Actions ──────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !user) return;

    if (!hasChatOrganization) {
      showToast('Chat ist erst verfuegbar, wenn dein Betrieb zugewiesen ist.', 'warning');
      return;
    }

    if (!moderateContent(newMessage, 'Nachricht')) {
      setNewMessage('');
      return;
    }

    const activeScope = getChatScopeKey(
      chatScope,
      getRoleKey(user.role) === 'azubi' ? 'azubi_room' : 'staff_room'
    );

    if (activeScope === 'azubi_room' && getRoleKey(user.role) !== 'azubi') {
      showToast('Der Azubi-Chat ist nur fuer Azubis gedacht.', 'warning');
      return;
    }

    let recipient = null;
    if (activeScope === 'direct_staff') {
      recipient =
        directChatCandidates.find(
          (account) => account.id === selectedChatRecipientId
        ) || null;
      if (!recipient) {
        showToast('Bitte zuerst einen passenden Chatpartner auswaehlen.', 'warning');
        return;
      }
    }

    try {
      const msg = await dsCreateChatMessage({
        content: newMessage.trim(),
        scope: activeScope,
        userName: user.name,
        avatar: user.avatar || null,
        senderRole: user.role,
        senderId: user.id,
        organizationId: user.organizationId,
        recipientId: recipient?.id || null,
      });

      setMessages((prev) => [...prev, msg]);
      setNewMessage('');

      if (recipient?.name) {
        const preview = newMessage.trim().slice(0, 80);
        await sendNotification(
          recipient.name,
          'Neue Chatnachricht',
          `${user.name}: ${preview}${newMessage.trim().length > 80 ? '...' : ''}`,
          'info'
        );
      }
    } catch (error) {
      console.error('Message error:', error);
      showToast(
        'Nachricht konnte nicht gesendet werden. Bitte erneut versuchen.',
        'error'
      );
    }
  }, [
    newMessage,
    user,
    hasChatOrganization,
    chatScope,
    selectedChatRecipientId,
    directChatCandidates,
    showToast,
    moderateContent,
    sendNotification,
  ]);

  const deleteChatMessage = useCallback(
    async (message) => {
      if (!message?.id || message?.isDeleted) return;

      const isMine = message.senderId === user?.id;
      const isAdminModeration = user?.role === 'admin' && !isMine;
      const confirmText = isAdminModeration
        ? 'Nachricht für alle Chatteilnehmer als entfernt markieren?'
        : 'Eigene Nachricht wirklich löschen?';

      if (!confirm(confirmText)) return;

      try {
        const deletedMessage = await dsDeleteChatMessage(message.id);
        setMessages((prev) => prev.filter((entry) => entry.id !== deletedMessage.id));
        showToast(
          isAdminModeration ? 'Nachricht wurde moderiert.' : 'Nachricht wurde gelöscht.',
          'success'
        );
      } catch (error) {
        console.error('Chat moderation error:', error);
        showToast(friendlyError(error), 'error');
      }
    },
    [user?.id, user?.role, showToast]
  );

  // ── Return ───────────────────────────────────────────────
  return {
    // State
    messages,
    newMessage,
    setNewMessage,
    chatScope,
    setChatScope,
    selectedChatRecipientId,
    setSelectedChatRecipientId,

    // Derived
    hasChatOrganization,
    directChatCandidates,
    messageCount: messages.length,

    // Actions
    sendMessage,
    deleteChatMessage,
    loadChatMessages,
    normalizeChatMessageRow,
  };
}

// Re-export helpers that other parts of App.jsx still use
export { getRoleKey, isStaffRole, getAccountOrganizationId, getChatScopeKey };
