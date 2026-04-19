import {
  BadRequestException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';
import { AccountStatus, AppRole, ChatScope } from '@prisma/client';
import { ChatService } from './chat.service';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../common/services/audit-log.service';
import { NotificationsService } from '../notifications/notifications.service';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockActor = (overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser => ({
  id: 'user-1',
  email: 'test@example.com',
  displayName: 'Alice',
  role: AppRole.AZUBI,
  status: AccountStatus.APPROVED,
  organizationId: 'org-1',
  canSignReports: false,
  ...overrides
});

const mockRequest = () => ({ headers: {}, ip: '127.0.0.1' }) as any;

const makeMessage = (overrides: Record<string, unknown> = {}) => ({
  id: 'msg-1',
  organizationId: 'org-1',
  scope: ChatScope.STAFF_ROOM,
  content: 'Hallo!',
  senderId: 'user-1',
  recipientId: null,
  createdAt: new Date(),
  deletedAt: null,
  deletedByUserId: null,
  sender: { id: 'user-1', displayName: 'Alice', role: AppRole.AZUBI, avatar: null },
  recipient: null,
  ...overrides
});

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const createMockPrisma = () => ({
  chatMessage: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  user: {
    findFirst: jest.fn(),
    findMany: jest.fn().mockResolvedValue([])
  }
});

const createMockAuditLog = () => ({
  writeForUser: jest.fn().mockResolvedValue(undefined)
});

const createMockNotifications = () => ({
  createForUser: jest.fn().mockResolvedValue(undefined),
  createForUsers: jest.fn().mockResolvedValue([])
});

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('ChatService', () => {
  let service: ChatService;
  let prisma: ReturnType<typeof createMockPrisma>;
  let auditLog: ReturnType<typeof createMockAuditLog>;
  let notifications: ReturnType<typeof createMockNotifications>;

  const priv = () => service as any;

  beforeEach(() => {
    prisma = createMockPrisma();
    auditLog = createMockAuditLog();
    notifications = createMockNotifications();
    service = new ChatService(
      prisma as unknown as PrismaService,
      notifications as unknown as NotificationsService,
      auditLog as unknown as AuditLogService
    );
  });

  // =========================================================================
  // Private helpers
  // =========================================================================

  describe('isApprentice', () => {
    it('returns true for AZUBI', () => {
      expect(priv().isApprentice(AppRole.AZUBI)).toBe(true);
    });
    it('returns true for RETTUNGSSCHWIMMER_AZUBI', () => {
      expect(priv().isApprentice(AppRole.RETTUNGSSCHWIMMER_AZUBI)).toBe(true);
    });
    it('returns false for ADMIN', () => {
      expect(priv().isApprentice(AppRole.ADMIN)).toBe(false);
    });
    it('returns false for AUSBILDER', () => {
      expect(priv().isApprentice(AppRole.AUSBILDER)).toBe(false);
    });
  });

  describe('isStaff', () => {
    it('returns true for ADMIN', () => {
      expect(priv().isStaff(AppRole.ADMIN)).toBe(true);
    });
    it('returns true for AUSBILDER', () => {
      expect(priv().isStaff(AppRole.AUSBILDER)).toBe(true);
    });
    it('returns false for AZUBI', () => {
      expect(priv().isStaff(AppRole.AZUBI)).toBe(false);
    });
  });

  describe('serializeMessage', () => {
    it('passes through message data', () => {
      const msg = makeMessage();
      const result = priv().serializeMessage(msg);
      expect(result.id).toBe('msg-1');
      expect(result.content).toBe('Hallo!');
    });
  });

  // =========================================================================
  // assertScopeAccess
  // =========================================================================

  describe('assertScopeAccess', () => {
    it('throws ForbiddenException for non-apprentice in AZUBI_ROOM', async () => {
      await expect(priv().assertScopeAccess(
        mockActor({ role: AppRole.ADMIN }),
        ChatScope.AZUBI_ROOM,
        null
      )).rejects.toThrow(ForbiddenException);
    });

    it('allows apprentice in AZUBI_ROOM', async () => {
      await expect(priv().assertScopeAccess(
        mockActor({ role: AppRole.AZUBI }),
        ChatScope.AZUBI_ROOM,
        null
      )).resolves.toBeUndefined();
    });

    it('throws BadRequestException for recipientId in non-direct scope', async () => {
      await expect(priv().assertScopeAccess(
        mockActor(),
        ChatScope.STAFF_ROOM,
        'user-2'
      )).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when DIRECT_STAFF without recipientId', async () => {
      await expect(priv().assertScopeAccess(
        mockActor(),
        ChatScope.DIRECT_STAFF,
        null
      )).rejects.toThrow('recipientId is required for direct chat.');
    });

    it('throws NotFoundException when recipient not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(priv().assertScopeAccess(
        mockActor(),
        ChatScope.DIRECT_STAFF,
        'nonexistent'
      )).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for same-role direct chat (azubi-to-azubi)', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'user-2', role: AppRole.AZUBI });
      await expect(priv().assertScopeAccess(
        mockActor({ role: AppRole.AZUBI }),
        ChatScope.DIRECT_STAFF,
        'user-2'
      )).rejects.toThrow(ForbiddenException);
    });

    it('allows azubi-to-staff direct chat', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'user-2', role: AppRole.AUSBILDER });
      await expect(priv().assertScopeAccess(
        mockActor({ role: AppRole.AZUBI }),
        ChatScope.DIRECT_STAFF,
        'user-2'
      )).resolves.toBeUndefined();
    });

    it('allows staff-to-azubi direct chat', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'user-2', role: AppRole.AZUBI });
      await expect(priv().assertScopeAccess(
        mockActor({ role: AppRole.AUSBILDER }),
        ChatScope.DIRECT_STAFF,
        'user-2'
      )).resolves.toBeUndefined();
    });
  });

  // =========================================================================
  // listMessages
  // =========================================================================

  describe('listMessages', () => {
    it('throws when user has no org', async () => {
      await expect(service.listMessages(mockActor({ organizationId: null }), {} as any))
        .rejects.toThrow(BadRequestException);
    });

    it('returns serialized messages for STAFF_ROOM', async () => {
      prisma.chatMessage.findMany.mockResolvedValue([makeMessage()]);
      const result = (await service.listMessages(mockActor(), { scope: ChatScope.STAFF_ROOM } as any)) as any[];
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('msg-1');
    });

    it('returns wrapped { items, nextCursor } when cursor is provided', async () => {
      prisma.chatMessage.findMany.mockResolvedValue([makeMessage()]);
      const result = (await service.listMessages(
        mockActor(),
        { scope: ChatScope.STAFF_ROOM, cursor: 'msg-0', limit: 10 } as any
      )) as { items: any[]; nextCursor: string | null };
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items).toHaveLength(1);
      expect(result.nextCursor).toBeNull();
    });

    it('sets nextCursor when more results exist', async () => {
      prisma.chatMessage.findMany.mockResolvedValue([
        makeMessage({ id: 'msg-1' }),
        makeMessage({ id: 'msg-2' }),
        makeMessage({ id: 'msg-3' })
      ]);
      const result = (await service.listMessages(
        mockActor(),
        { scope: ChatScope.STAFF_ROOM, cursor: 'msg-0', limit: 2 } as any
      )) as { items: any[]; nextCursor: string | null };
      expect(result.items).toHaveLength(2);
      expect(result.nextCursor).toBe('msg-2');
    });

    it('defaults scope to STAFF_ROOM', async () => {
      prisma.chatMessage.findMany.mockResolvedValue([]);
      await service.listMessages(mockActor(), {} as any);
      expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ scope: ChatScope.STAFF_ROOM })
      }));
    });

    it('builds OR clause for DIRECT_STAFF', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'user-2', role: AppRole.AUSBILDER });
      prisma.chatMessage.findMany.mockResolvedValue([]);
      await service.listMessages(mockActor(), { scope: ChatScope.DIRECT_STAFF, recipientId: 'user-2' } as any);
      expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ senderId: 'user-1', recipientId: 'user-2' })
          ])
        })
      }));
    });
  });

  // =========================================================================
  // createMessage
  // =========================================================================

  describe('createMessage', () => {
    it('throws when user has no org', async () => {
      await expect(service.createMessage(mockActor({ organizationId: null }), { scope: ChatScope.STAFF_ROOM, content: 'hi' } as any))
        .rejects.toThrow(BadRequestException);
    });

    it('throws for empty content after sanitization', async () => {
      await expect(service.createMessage(mockActor(), { scope: ChatScope.STAFF_ROOM, content: '<script></script>' } as any))
        .rejects.toThrow('Message content is empty after sanitization.');
    });

    it('creates staff room message', async () => {
      prisma.chatMessage.create.mockResolvedValue(makeMessage());
      const result = await service.createMessage(
        mockActor({ role: AppRole.ADMIN }),
        { scope: ChatScope.STAFF_ROOM, content: 'Hallo!' } as any
      );
      expect(result.id).toBe('msg-1');
      expect(notifications.createForUser).not.toHaveBeenCalled();
    });

    it('notifies other staff on staff room message', async () => {
      prisma.chatMessage.create.mockResolvedValue(makeMessage());
      prisma.user.findMany.mockResolvedValue([{ id: 'user-2' }, { id: 'user-3' }]);
      await service.createMessage(
        mockActor({ role: AppRole.ADMIN }),
        { scope: ChatScope.STAFF_ROOM, content: 'Moin Team' } as any
      );
      expect(notifications.createForUsers).toHaveBeenCalledWith(
        ['user-2', 'user-3'],
        expect.objectContaining({ title: 'Neue Nachricht im Staff-Chat' })
      );
    });

    it('notifies other apprentices on azubi room message', async () => {
      prisma.chatMessage.create.mockResolvedValue(makeMessage({ scope: ChatScope.AZUBI_ROOM }));
      prisma.user.findMany.mockResolvedValue([{ id: 'user-2' }]);
      await service.createMessage(
        mockActor(),
        { scope: ChatScope.AZUBI_ROOM, content: 'Frage zum Lehrplan' } as any
      );
      expect(notifications.createForUsers).toHaveBeenCalledWith(
        ['user-2'],
        expect.objectContaining({ title: 'Neue Nachricht im Azubi-Chat' })
      );
    });

    it('skips room notification when no recipients exist', async () => {
      prisma.chatMessage.create.mockResolvedValue(makeMessage());
      prisma.user.findMany.mockResolvedValue([]);
      await service.createMessage(
        mockActor({ role: AppRole.ADMIN }),
        { scope: ChatScope.STAFF_ROOM, content: 'Test' } as any
      );
      expect(notifications.createForUsers).not.toHaveBeenCalled();
    });

    it('sends notification for direct message', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'user-2', role: AppRole.AUSBILDER });
      prisma.chatMessage.create.mockResolvedValue(makeMessage({ scope: ChatScope.DIRECT_STAFF, recipientId: 'user-2' }));
      await service.createMessage(mockActor(), { scope: ChatScope.DIRECT_STAFF, recipientId: 'user-2', content: 'Direkte Nachricht' } as any);
      expect(notifications.createForUser).toHaveBeenCalledWith('user-2', expect.objectContaining({
        title: 'Neue Chatnachricht'
      }));
    });

    it('truncates long messages in notification preview', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'user-2', role: AppRole.AUSBILDER });
      const longContent = 'A'.repeat(100);
      prisma.chatMessage.create.mockResolvedValue(makeMessage({ scope: ChatScope.DIRECT_STAFF, recipientId: 'user-2' }));
      await service.createMessage(mockActor(), { scope: ChatScope.DIRECT_STAFF, recipientId: 'user-2', content: longContent } as any);
      const notifyCall = notifications.createForUser.mock.calls[0]!;
      expect(notifyCall[1].message).toContain('...');
    });
  });

  // =========================================================================
  // deleteMessage
  // =========================================================================

  describe('deleteMessage', () => {
    it('throws when user has no org', async () => {
      await expect(service.deleteMessage(mockActor({ organizationId: null }), 'msg-1', mockRequest()))
        .rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when message not found', async () => {
      prisma.chatMessage.findFirst.mockResolvedValue(null);
      await expect(service.deleteMessage(mockActor(), 'nonexistent', mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('returns already-deleted message without re-deleting', async () => {
      const msg = makeMessage({ deletedAt: new Date() });
      prisma.chatMessage.findFirst.mockResolvedValue(msg);
      const result = await service.deleteMessage(mockActor(), 'msg-1', mockRequest());
      expect(result.id).toBe('msg-1');
      expect(prisma.chatMessage.update).not.toHaveBeenCalled();
    });

    it('allows admin to delete any message', async () => {
      const msg = makeMessage({ senderId: 'user-2' });
      prisma.chatMessage.findFirst.mockResolvedValue(msg);
      prisma.chatMessage.update.mockResolvedValue({ ...msg, deletedAt: new Date(), deletedByUserId: 'user-1' });
      const actor = mockActor({ role: AppRole.ADMIN });
      await service.deleteMessage(actor, 'msg-1', mockRequest());
      expect(auditLog.writeForUser).toHaveBeenCalledWith(
        actor,
        'chat_message.moderated',
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ deleteMode: 'admin_moderation' }),
        expect.anything()
      );
    });

    it('allows owner to delete own recent message', async () => {
      const msg = makeMessage({ senderId: 'user-1', createdAt: new Date() });
      prisma.chatMessage.findFirst.mockResolvedValue(msg);
      prisma.chatMessage.update.mockResolvedValue({ ...msg, deletedAt: new Date() });
      await service.deleteMessage(mockActor(), 'msg-1', mockRequest());
      expect(auditLog.writeForUser).toHaveBeenCalledWith(
        expect.anything(),
        'chat_message.deleted',
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ deleteMode: 'self_delete' }),
        expect.anything()
      );
    });

    it('throws ForbiddenException when non-admin deletes old message', async () => {
      const oldDate = new Date(Date.now() - 20 * 60 * 1000); // 20 min ago
      const msg = makeMessage({ senderId: 'user-1', createdAt: oldDate });
      prisma.chatMessage.findFirst.mockResolvedValue(msg);
      await expect(service.deleteMessage(mockActor(), 'msg-1', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('throws ForbiddenException when non-admin deletes other message', async () => {
      const msg = makeMessage({ senderId: 'user-2', createdAt: new Date() });
      prisma.chatMessage.findFirst.mockResolvedValue(msg);
      await expect(service.deleteMessage(mockActor(), 'msg-1', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });
  });
});
