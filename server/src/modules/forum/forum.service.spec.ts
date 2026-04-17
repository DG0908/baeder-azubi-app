import {
  BadRequestException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';
import { AppRole, AccountStatus } from '@prisma/client';
import { ForumService } from './forum.service';
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

const makePost = (overrides: Record<string, unknown> = {}) => ({
  id: 'post-1',
  category: 'fragen',
  title: 'Test Frage',
  content: 'Inhalt der Frage',
  pinned: false,
  locked: false,
  lastReplyAt: null as Date | null,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 'user-1',
  organizationId: 'org-1',
  user: { id: 'user-1', displayName: 'Alice', role: AppRole.AZUBI },
  _count: { replies: 0 },
  ...overrides
});

const makeReply = (overrides: Record<string, unknown> = {}) => ({
  id: 'reply-1',
  postId: 'post-1',
  content: 'Antwort',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 'user-2',
  organizationId: 'org-1',
  user: { id: 'user-2', displayName: 'Bob', role: AppRole.AZUBI },
  post: { id: 'post-1', category: 'fragen' },
  ...overrides
});

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const createMockPrisma = () => ({
  forumPost: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  forumReply: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn()
  },
  $transaction: jest.fn((callback: (tx: any) => any) => callback({
    forumReply: {
      create: jest.fn().mockResolvedValue(makeReply()),
      delete: jest.fn(),
      findFirst: jest.fn().mockResolvedValue(null)
    },
    forumPost: {
      update: jest.fn()
    }
  }))
});

const createMockAuditLog = () => ({
  writeForUser: jest.fn().mockResolvedValue(undefined)
});

const createMockNotifications = () => ({
  createForUser: jest.fn().mockResolvedValue(undefined)
});

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('ForumService', () => {
  let service: ForumService;
  let prisma: ReturnType<typeof createMockPrisma>;
  let auditLog: ReturnType<typeof createMockAuditLog>;
  let notifications: ReturnType<typeof createMockNotifications>;

  const priv = () => service as any;

  beforeEach(() => {
    prisma = createMockPrisma();
    auditLog = createMockAuditLog();
    notifications = createMockNotifications();
    service = new ForumService(
      prisma as unknown as PrismaService,
      auditLog as unknown as AuditLogService,
      notifications as unknown as NotificationsService
    );
  });

  // =========================================================================
  // Private helpers
  // =========================================================================

  describe('normalizeCategory', () => {
    it('accepts valid category', () => {
      expect(priv().normalizeCategory('fragen')).toBe('fragen');
      expect(priv().normalizeCategory('UPDATES')).toBe('updates');
    });
    it('throws for invalid category', () => {
      expect(() => priv().normalizeCategory('invalid')).toThrow(BadRequestException);
    });
  });

  describe('assertOrganization', () => {
    it('does not throw with organizationId', () => {
      expect(() => priv().assertOrganization(mockActor())).not.toThrow();
    });
    it('throws without organizationId', () => {
      expect(() => priv().assertOrganization(mockActor({ organizationId: null })))
        .toThrow(BadRequestException);
    });
  });

  describe('canReadCategory', () => {
    it('returns true for all-access categories', () => {
      expect(priv().canReadCategory(AppRole.AZUBI, 'fragen')).toBe(true);
    });
    it('returns false for restricted category with wrong role', () => {
      expect(priv().canReadCategory(AppRole.AZUBI, 'ausbilder')).toBe(false);
    });
    it('returns true for restricted category with correct role', () => {
      expect(priv().canReadCategory(AppRole.ADMIN, 'ausbilder')).toBe(true);
      expect(priv().canReadCategory(AppRole.AUSBILDER, 'ausbilder')).toBe(true);
    });
    it('returns false for unknown category', () => {
      expect(priv().canReadCategory(AppRole.ADMIN, 'nonexistent')).toBe(false);
    });
  });

  describe('canPostCategory', () => {
    it('returns true for all-post categories', () => {
      expect(priv().canPostCategory(AppRole.AZUBI, 'fragen')).toBe(true);
    });
    it('returns false for admin-only post category', () => {
      expect(priv().canPostCategory(AppRole.AZUBI, 'updates')).toBe(false);
    });
    it('returns true for admin in admin-only category', () => {
      expect(priv().canPostCategory(AppRole.ADMIN, 'updates')).toBe(true);
    });
  });

  describe('isAdmin', () => {
    it('returns true for ADMIN', () => {
      expect(priv().isAdmin(AppRole.ADMIN)).toBe(true);
    });
    it('returns false for non-admin', () => {
      expect(priv().isAdmin(AppRole.AZUBI)).toBe(false);
      expect(priv().isAdmin(AppRole.AUSBILDER)).toBe(false);
    });
  });

  describe('sanitizeText', () => {
    it('strips HTML tags', () => {
      expect(priv().sanitizeText('<b>Test</b>', 'title', 200)).toBe('Test');
    });
    it('throws for empty after sanitization', () => {
      expect(() => priv().sanitizeText('<script></script>', 'title', 200))
        .toThrow('title is empty after sanitization.');
    });
    it('throws for exceeding max length', () => {
      expect(() => priv().sanitizeText('a'.repeat(201), 'title', 200))
        .toThrow('title exceeds the maximum allowed length.');
    });
  });

  describe('toForumPostPayload', () => {
    it('serializes post correctly', () => {
      const post = makePost();
      const result = priv().toForumPostPayload(post);
      expect(result.id).toBe('post-1');
      expect(result.replyCount).toBe(0);
      expect(typeof result.createdAt).toBe('string');
      expect(result.lastReplyAt).toBeNull();
    });
    it('serializes lastReplyAt when present', () => {
      const post = makePost({ lastReplyAt: new Date('2026-01-01') });
      const result = priv().toForumPostPayload(post);
      expect(result.lastReplyAt).toBe(new Date('2026-01-01').toISOString());
    });
  });

  describe('toForumReplyPayload', () => {
    it('serializes reply correctly', () => {
      const reply = makeReply();
      const result = priv().toForumReplyPayload(reply);
      expect(result.id).toBe('reply-1');
      expect(typeof result.createdAt).toBe('string');
    });
  });

  // =========================================================================
  // listCategoryCounts
  // =========================================================================

  describe('listCategoryCounts', () => {
    it('throws for user without org', async () => {
      await expect(service.listCategoryCounts(mockActor({ organizationId: null })))
        .rejects.toThrow(BadRequestException);
    });

    it('returns category counts', async () => {
      prisma.forumPost.groupBy.mockResolvedValue([
        { category: 'fragen', _count: { _all: 5 } },
        { category: 'wuensche', _count: { _all: 2 } }
      ]);
      const result = await service.listCategoryCounts(mockActor());
      expect(result.find((c: any) => c.category === 'fragen')!.count).toBe(5);
      expect(result.find((c: any) => c.category === 'wuensche')!.count).toBe(2);
    });

    it('azubi cannot see ausbilder category counts', async () => {
      prisma.forumPost.groupBy.mockResolvedValue([]);
      const result = await service.listCategoryCounts(mockActor({ role: AppRole.AZUBI }));
      expect(result.find((c: any) => c.category === 'ausbilder')).toBeUndefined();
    });
  });

  // =========================================================================
  // listPosts
  // =========================================================================

  describe('listPosts', () => {
    it('throws for user without org', async () => {
      await expect(service.listPosts(mockActor({ organizationId: null }), { category: 'fragen' } as any))
        .rejects.toThrow(BadRequestException);
    });

    it('throws for invalid category', async () => {
      await expect(service.listPosts(mockActor(), { category: 'bad' } as any))
        .rejects.toThrow(BadRequestException);
    });

    it('throws for restricted category', async () => {
      await expect(service.listPosts(mockActor({ role: AppRole.AZUBI }), { category: 'ausbilder' } as any))
        .rejects.toThrow(ForbiddenException);
    });

    it('returns sorted posts', async () => {
      prisma.forumPost.findMany.mockResolvedValue([makePost()]);
      const result = await service.listPosts(mockActor(), { category: 'fragen' } as any);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('post-1');
    });

    it('sorts pinned first', async () => {
      const pinned = makePost({ id: 'p2', pinned: true, createdAt: new Date('2026-01-01') });
      const normal = makePost({ id: 'p1', pinned: false, createdAt: new Date('2026-04-01') });
      prisma.forumPost.findMany.mockResolvedValue([normal, pinned]);
      const result = await service.listPosts(mockActor(), { category: 'fragen' } as any);
      expect(result[0].id).toBe('p2');
    });
  });

  // =========================================================================
  // getThread
  // =========================================================================

  describe('getThread', () => {
    it('throws NotFoundException when post not found', async () => {
      prisma.forumPost.findFirst.mockResolvedValue(null);
      await expect(service.getThread(mockActor(), 'nonexistent'))
        .rejects.toThrow(NotFoundException);
    });

    it('returns post with replies', async () => {
      prisma.forumPost.findFirst.mockResolvedValue(makePost());
      prisma.forumReply.findMany.mockResolvedValue([makeReply()]);
      const result = await service.getThread(mockActor(), 'post-1');
      expect(result.post.id).toBe('post-1');
      expect(result.replies).toHaveLength(1);
    });
  });

  // =========================================================================
  // createPost
  // =========================================================================

  describe('createPost', () => {
    it('throws for user without org', async () => {
      await expect(service.createPost(mockActor({ organizationId: null }), { category: 'fragen', title: 'T', content: 'C' } as any, mockRequest()))
        .rejects.toThrow(BadRequestException);
    });

    it('throws for non-postable category', async () => {
      await expect(service.createPost(mockActor(), { category: 'updates', title: 'T', content: 'C' } as any, mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('creates post successfully', async () => {
      prisma.forumPost.create.mockResolvedValue(makePost());
      const result = await service.createPost(mockActor(), { category: 'fragen', title: 'Meine Frage', content: 'Details' } as any, mockRequest());
      expect(result.id).toBe('post-1');
      expect(auditLog.writeForUser).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // createReply
  // =========================================================================

  describe('createReply', () => {
    it('throws NotFoundException when post not found', async () => {
      prisma.forumPost.findFirst.mockResolvedValue(null);
      await expect(service.createReply(mockActor(), 'nonexistent', { content: 'test' } as any, mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('throws when thread is locked', async () => {
      prisma.forumPost.findFirst.mockResolvedValue(makePost({ locked: true }));
      await expect(service.createReply(mockActor(), 'post-1', { content: 'test' } as any, mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('notifies post author when someone else replies', async () => {
      prisma.forumPost.findFirst
        .mockResolvedValueOnce(makePost({ userId: 'user-2' }))  // for createReply
        .mockResolvedValueOnce(makePost({ userId: 'user-2' })); // for getThread
      prisma.forumReply.findMany.mockResolvedValue([]);
      const actor = mockActor();
      await service.createReply(actor, 'post-1', { content: 'Antwort' } as any, mockRequest());
      expect(notifications.createForUser).toHaveBeenCalledWith('user-2', expect.objectContaining({
        title: 'Neue Forum-Antwort'
      }));
    });

    it('does not notify when replying to own post', async () => {
      prisma.forumPost.findFirst
        .mockResolvedValueOnce(makePost())  // userId = user-1, actor.id = user-1
        .mockResolvedValueOnce(makePost());
      prisma.forumReply.findMany.mockResolvedValue([]);
      await service.createReply(mockActor(), 'post-1', { content: 'Antwort' } as any, mockRequest());
      expect(notifications.createForUser).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // deletePost
  // =========================================================================

  describe('deletePost', () => {
    it('throws NotFoundException when post not found', async () => {
      prisma.forumPost.findFirst.mockResolvedValue(null);
      await expect(service.deletePost(mockActor(), 'nonexistent', mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('allows owner to delete own post without replies', async () => {
      prisma.forumPost.findFirst.mockResolvedValue(makePost({ userId: 'user-1', _count: { replies: 0 } }));
      prisma.forumPost.delete.mockResolvedValue({});
      const result = await service.deletePost(mockActor(), 'post-1', mockRequest());
      expect(result.id).toBe('post-1');
    });

    it('throws when non-admin tries to delete post with replies', async () => {
      prisma.forumPost.findFirst.mockResolvedValue(makePost({ userId: 'user-1', _count: { replies: 3 } }));
      await expect(service.deletePost(mockActor(), 'post-1', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('allows admin to delete any post', async () => {
      prisma.forumPost.findFirst.mockResolvedValue(makePost({ userId: 'user-2', _count: { replies: 5 } }));
      prisma.forumPost.delete.mockResolvedValue({});
      const actor = mockActor({ role: AppRole.ADMIN });
      const result = await service.deletePost(actor, 'post-1', mockRequest());
      expect(result.id).toBe('post-1');
    });
  });

  // =========================================================================
  // deleteReply
  // =========================================================================

  describe('deleteReply', () => {
    it('throws NotFoundException when reply not found', async () => {
      prisma.forumReply.findFirst.mockResolvedValue(null);
      await expect(service.deleteReply(mockActor(), 'nonexistent', mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when non-admin tries to delete other reply', async () => {
      prisma.forumReply.findFirst.mockResolvedValue(makeReply({ userId: 'user-2' }));
      await expect(service.deleteReply(mockActor(), 'reply-1', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('allows admin to delete any reply', async () => {
      prisma.forumReply.findFirst.mockResolvedValue(makeReply({ userId: 'user-2' }));
      const actor = mockActor({ role: AppRole.ADMIN });
      const result = await service.deleteReply(actor, 'reply-1', mockRequest());
      expect(result.id).toBe('reply-1');
    });

    it('allows user to delete own reply', async () => {
      prisma.forumReply.findFirst.mockResolvedValue(makeReply({ userId: 'user-1' }));
      const result = await service.deleteReply(mockActor(), 'reply-1', mockRequest());
      expect(result.id).toBe('reply-1');
    });
  });

  // =========================================================================
  // togglePin
  // =========================================================================

  describe('togglePin', () => {
    it('throws for non-admin', async () => {
      await expect(service.togglePin(mockActor(), 'post-1', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when post not found', async () => {
      prisma.forumPost.findFirst.mockResolvedValue(null);
      await expect(service.togglePin(mockActor({ role: AppRole.ADMIN }), 'nonexistent', mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('toggles pin state', async () => {
      const post = makePost({ pinned: false });
      prisma.forumPost.findFirst.mockResolvedValue(post);
      prisma.forumPost.update.mockResolvedValue({ ...post, pinned: true });
      const result = await service.togglePin(mockActor({ role: AppRole.ADMIN }), 'post-1', mockRequest());
      expect(result.pinned).toBe(true);
    });
  });

  // =========================================================================
  // toggleLock
  // =========================================================================

  describe('toggleLock', () => {
    it('throws for non-admin', async () => {
      await expect(service.toggleLock(mockActor(), 'post-1', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when post not found', async () => {
      prisma.forumPost.findFirst.mockResolvedValue(null);
      await expect(service.toggleLock(mockActor({ role: AppRole.ADMIN }), 'nonexistent', mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('toggles lock state', async () => {
      const post = makePost({ locked: false });
      prisma.forumPost.findFirst.mockResolvedValue(post);
      prisma.forumPost.update.mockResolvedValue({ ...post, locked: true });
      const result = await service.toggleLock(mockActor({ role: AppRole.ADMIN }), 'post-1', mockRequest());
      expect(result.locked).toBe(true);
    });
  });
});
