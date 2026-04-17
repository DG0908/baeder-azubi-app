import {
  BadRequestException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';
import { AccountStatus, AppRole } from '@prisma/client';
import { UsersService } from './users.service';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../common/services/audit-log.service';

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

const makeUser = (overrides: Record<string, unknown> = {}) => ({
  id: 'user-1',
  email: 'test@example.com',
  displayName: 'Alice',
  avatar: 'avatar_01',
  company: 'Stadtwerke',
  birthDate: new Date('2000-01-15'),
  role: AppRole.AZUBI,
  status: AccountStatus.APPROVED,
  canSignReports: false,
  canViewSchoolCards: false,
  canViewExamGrades: false,
  organizationId: 'org-1',
  organization: { id: 'org-1', name: 'Test Org', slug: 'test-org' },
  trainingEnd: null,
  approvedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date(),
  reportBookProfile: null,
  unlockedAvatarIds: [],
  isDeleted: false,
  passwordHash: 'hash',
  refreshTokenHash: null,
  totpEnabled: false,
  ...overrides
});

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const createMockPrisma = () => ({
  user: {
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn()
  },
  organization: {
    findUnique: jest.fn()
  },
  $transaction: jest.fn((callback: (tx: any) => any) => callback({
    user: { update: jest.fn() },
    loginAttempt: { deleteMany: jest.fn() },
    passwordResetToken: { deleteMany: jest.fn() },
    trustedDevice: { deleteMany: jest.fn() }
  }))
});

const createMockAuditLog = () => ({
  writeForUser: jest.fn().mockResolvedValue(undefined)
});

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('UsersService', () => {
  let service: UsersService;
  let prisma: ReturnType<typeof createMockPrisma>;
  let auditLog: ReturnType<typeof createMockAuditLog>;

  const priv = () => service as any;

  beforeEach(() => {
    prisma = createMockPrisma();
    auditLog = createMockAuditLog();
    service = new UsersService(
      prisma as unknown as PrismaService,
      auditLog as unknown as AuditLogService
    );
  });

  // =========================================================================
  // Private helpers
  // =========================================================================

  describe('sanitizeText', () => {
    it('strips HTML tags', () => {
      expect(priv().sanitizeText('<b>hello</b>', 120)).toBe('hello');
    });
    it('trims and truncates', () => {
      expect(priv().sanitizeText('  abcdef  ', 3)).toBe('abc');
    });
    it('returns empty for null-ish', () => {
      expect(priv().sanitizeText('', 10)).toBe('');
    });
  });

  describe('sanitizeNullableText', () => {
    it('returns null for empty after sanitize', () => {
      expect(priv().sanitizeNullableText('', 10)).toBeNull();
    });
    it('returns sanitized text for valid input', () => {
      expect(priv().sanitizeNullableText('hello', 10)).toBe('hello');
    });
  });

  describe('normalizeAvatar', () => {
    it('accepts valid avatar id', () => {
      expect(priv().normalizeAvatar('avatar_01')).toBe('avatar_01');
    });
    it('throws for empty avatar', () => {
      expect(() => priv().normalizeAvatar('')).toThrow(BadRequestException);
    });
    it('throws for invalid characters', () => {
      expect(() => priv().normalizeAvatar('avatar<script>')).toThrow(BadRequestException);
    });
    it('truncates to 120 chars', () => {
      const long = 'a'.repeat(200);
      expect(priv().normalizeAvatar(long)).toHaveLength(120);
    });
  });

  describe('normalizeBirthDate', () => {
    it('parses valid date', () => {
      const result = priv().normalizeBirthDate('2000-01-15');
      expect(result).toBeInstanceOf(Date);
    });
    it('throws for invalid date string', () => {
      expect(() => priv().normalizeBirthDate('not-a-date')).toThrow('Birth date is invalid.');
    });
    it('throws for future date', () => {
      const future = new Date(Date.now() + 86400000).toISOString();
      expect(() => priv().normalizeBirthDate(future)).toThrow('Birth date cannot be in the future.');
    });
    it('throws for date before 1900', () => {
      expect(() => priv().normalizeBirthDate('1899-12-31')).toThrow('Birth date is outside the allowed range.');
    });
  });

  // =========================================================================
  // getCurrentUser
  // =========================================================================

  describe('getCurrentUser', () => {
    it('returns user from prisma', async () => {
      const user = makeUser();
      prisma.user.findUniqueOrThrow.mockResolvedValue(user);
      const result = await service.getCurrentUser(mockActor());
      expect(result).toBe(user);
      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'user-1' }
      }));
    });
  });

  // =========================================================================
  // updateCurrentUser
  // =========================================================================

  describe('updateCurrentUser', () => {
    it('throws NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.updateCurrentUser(mockActor(), { displayName: 'New' } as any, mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for deleted user', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ isDeleted: true }));
      await expect(service.updateCurrentUser(mockActor(), { displayName: 'New' } as any, mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('throws when display name too short', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      await expect(service.updateCurrentUser(mockActor(), { displayName: 'A' } as any, mockRequest()))
        .rejects.toThrow('Display name must be at least 2 characters long.');
    });

    it('throws when no updates provided', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      await expect(service.updateCurrentUser(mockActor(), {} as any, mockRequest()))
        .rejects.toThrow('No valid profile updates were provided.');
    });

    it('updates display name successfully', async () => {
      const user = makeUser();
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue({ ...user, displayName: 'NewName' });
      const result = await service.updateCurrentUser(mockActor(), { displayName: 'NewName' } as any, mockRequest());
      expect(result.displayName).toBe('NewName');
      expect(auditLog.writeForUser).toHaveBeenCalled();
    });

    it('updates avatar to null', async () => {
      const user = makeUser();
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue({ ...user, avatar: null });
      await service.updateCurrentUser(mockActor(), { avatar: null } as any, mockRequest());
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ avatar: null })
      }));
    });

    it('updates company', async () => {
      const user = makeUser();
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue({ ...user, company: 'NewCo' });
      await service.updateCurrentUser(mockActor(), { company: 'NewCo' } as any, mockRequest());
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ company: 'NewCo' })
      }));
    });

    it('updates birthDate', async () => {
      const user = makeUser();
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue({ ...user, birthDate: new Date('2000-06-15') });
      await service.updateCurrentUser(mockActor(), { birthDate: '2000-06-15' } as any, mockRequest());
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // listPendingUsers / listAllUsers
  // =========================================================================

  describe('listPendingUsers', () => {
    it('calls findMany with PENDING status', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      await service.listPendingUsers();
      expect(prisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ status: AccountStatus.PENDING })
      }));
    });
  });

  describe('listAllUsers', () => {
    it('calls findMany with isDeleted false', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      await service.listAllUsers();
      expect(prisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { isDeleted: false }
      }));
    });
  });

  // =========================================================================
  // listOrganizationContacts
  // =========================================================================

  describe('listOrganizationContacts', () => {
    it('returns empty for user without organization', async () => {
      const result = await service.listOrganizationContacts(mockActor({ organizationId: null }));
      expect(result).toEqual([]);
    });

    it('queries approved users in org excluding self', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      await service.listOrganizationContacts(mockActor());
      expect(prisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          organizationId: 'org-1',
          status: AccountStatus.APPROVED,
          NOT: { id: 'user-1' }
        })
      }));
    });
  });

  // =========================================================================
  // updateApproval
  // =========================================================================

  describe('updateApproval', () => {
    it('throws when admin tries to disable self', async () => {
      const actor = mockActor();
      await expect(service.updateApproval(actor, actor.id, { status: AccountStatus.DISABLED } as any, mockRequest()))
        .rejects.toThrow('You cannot disable or reject your own account');
    });

    it('throws NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.updateApproval(mockActor(), 'user-2', { status: AccountStatus.APPROVED } as any, mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when disabling admin', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ id: 'user-2', role: AppRole.ADMIN }));
      await expect(service.updateApproval(mockActor(), 'user-2', { status: AccountStatus.DISABLED } as any, mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('allows approving admin', async () => {
      const admin = makeUser({ id: 'user-2', role: AppRole.ADMIN });
      prisma.user.findUnique.mockResolvedValue(admin);
      prisma.user.update.mockResolvedValue({ ...admin, status: AccountStatus.APPROVED });
      await service.updateApproval(mockActor(), 'user-2', { status: AccountStatus.APPROVED } as any, mockRequest());
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('sets approvedAt when approving', async () => {
      const user = makeUser({ id: 'user-2' });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);
      await service.updateApproval(mockActor(), 'user-2', { status: AccountStatus.APPROVED } as any, mockRequest());
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          approvedAt: expect.any(Date),
          approvedById: 'user-1'
        })
      }));
    });

    it('clears refreshTokenHash when disabling', async () => {
      const user = makeUser({ id: 'user-2', role: AppRole.AZUBI });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);
      await service.updateApproval(mockActor(), 'user-2', { status: AccountStatus.DISABLED } as any, mockRequest());
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          refreshTokenHash: null
        })
      }));
    });
  });

  // =========================================================================
  // updateRole
  // =========================================================================

  describe('updateRole', () => {
    it('throws ForbiddenException for self role change', async () => {
      await expect(service.updateRole(mockActor(), 'user-1', { role: AppRole.ADMIN } as any, mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.updateRole(mockActor(), 'user-2', { role: AppRole.AUSBILDER } as any, mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when downgrading admin', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ id: 'user-2', role: AppRole.ADMIN }));
      await expect(service.updateRole(mockActor(), 'user-2', { role: AppRole.AZUBI } as any, mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('updates role successfully', async () => {
      const user = makeUser({ id: 'user-2', role: AppRole.AZUBI });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue({ ...user, role: AppRole.AUSBILDER });
      const result = await service.updateRole(mockActor(), 'user-2', { role: AppRole.AUSBILDER } as any, mockRequest());
      expect(result.role).toBe(AppRole.AUSBILDER);
    });
  });

  // =========================================================================
  // updateOrganization
  // =========================================================================

  describe('updateOrganization', () => {
    it('throws ForbiddenException for self org change', async () => {
      await expect(service.updateOrganization(mockActor(), 'user-1', 'org-2', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.updateOrganization(mockActor(), 'user-2', 'org-2', mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException for inactive org', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ id: 'user-2' }));
      prisma.organization.findUnique.mockResolvedValue({ id: 'org-2', isActive: false });
      await expect(service.updateOrganization(mockActor(), 'user-2', 'org-2', mockRequest()))
        .rejects.toThrow(BadRequestException);
    });

    it('allows setting org to null', async () => {
      const user = makeUser({ id: 'user-2' });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue({ ...user, organizationId: null });
      await service.updateOrganization(mockActor(), 'user-2', null, mockRequest());
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        data: { organizationId: null }
      }));
    });

    it('updates org successfully', async () => {
      const user = makeUser({ id: 'user-2' });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.organization.findUnique.mockResolvedValue({ id: 'org-2', isActive: true });
      prisma.user.update.mockResolvedValue({ ...user, organizationId: 'org-2' });
      await service.updateOrganization(mockActor(), 'user-2', 'org-2', mockRequest());
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // updatePermissions
  // =========================================================================

  describe('updatePermissions', () => {
    it('throws NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.updatePermissions(mockActor(), 'user-2', { canSignReports: true } as any, mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when no permissions provided', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ id: 'user-2' }));
      await expect(service.updatePermissions(mockActor(), 'user-2', {} as any, mockRequest()))
        .rejects.toThrow('No permission updates were provided.');
    });

    it('updates canSignReports', async () => {
      const user = makeUser({ id: 'user-2' });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue({ ...user, canSignReports: true });
      await service.updatePermissions(mockActor(), 'user-2', { canSignReports: true } as any, mockRequest());
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ canSignReports: true })
      }));
    });

    it('updates multiple permissions', async () => {
      const user = makeUser({ id: 'user-2' });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);
      await service.updatePermissions(mockActor(), 'user-2', {
        canSignReports: true,
        canViewSchoolCards: true,
        canViewExamGrades: false
      } as any, mockRequest());
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          canSignReports: true,
          canViewSchoolCards: true,
          canViewExamGrades: false
        })
      }));
    });
  });

  // =========================================================================
  // adminResetPassword
  // =========================================================================

  describe('adminResetPassword', () => {
    it('throws ForbiddenException for self-reset', async () => {
      await expect(service.adminResetPassword(mockActor(), 'user-1', 'newpass', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.adminResetPassword(mockActor(), 'user-2', 'newpass', mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('resets password and clears sessions', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ id: 'user-2' }));
      const result = await service.adminResetPassword(mockActor(), 'user-2', 'newpass123', mockRequest());
      expect(result.reset).toBe(true);
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('reports totpEnabled status', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ id: 'user-2', totpEnabled: true }));
      const result = await service.adminResetPassword(mockActor(), 'user-2', 'newpass123', mockRequest());
      expect(result.requiresTotp).toBe(true);
    });
  });

  // =========================================================================
  // deleteSelf
  // =========================================================================

  describe('deleteSelf', () => {
    it('throws NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.deleteSelf(mockActor(), mockRequest())).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for admin accounts', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ role: AppRole.ADMIN }));
      const actor = mockActor({ role: AppRole.ADMIN });
      await expect(service.deleteSelf(actor, mockRequest())).rejects.toThrow(ForbiddenException);
    });

    it('soft-deletes and disables account', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.user.update.mockResolvedValue({});
      const result = await service.deleteSelf(mockActor(), mockRequest());
      expect(result.deleted).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          isDeleted: true,
          status: AccountStatus.DISABLED
        })
      }));
    });
  });

  // =========================================================================
  // softDeleteUser
  // =========================================================================

  describe('softDeleteUser', () => {
    it('throws ForbiddenException for self-delete', async () => {
      await expect(service.softDeleteUser(mockActor(), 'user-1', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.softDeleteUser(mockActor(), 'user-2', mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for admin target', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ id: 'user-2', role: AppRole.ADMIN }));
      await expect(service.softDeleteUser(mockActor(), 'user-2', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('soft-deletes user successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ id: 'user-2' }));
      prisma.user.update.mockResolvedValue({});
      const result = await service.softDeleteUser(mockActor(), 'user-2', mockRequest());
      expect(result.deleted).toBe(true);
    });
  });

  // =========================================================================
  // updateAvatarUnlocks
  // =========================================================================

  describe('updateAvatarUnlocks', () => {
    it('throws NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.updateAvatarUnlocks(mockActor(), 'user-2', { avatarIds: [] } as any, mockRequest()))
        .rejects.toThrow(NotFoundException);
    });

    it('updates avatar unlocks', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ id: 'user-2' }));
      prisma.user.update.mockResolvedValue({});
      const result = await service.updateAvatarUnlocks(
        mockActor(),
        'user-2',
        { avatarIds: ['avatar_01', 'avatar_02'] } as any,
        mockRequest()
      );
      expect(result.success).toBe(true);
      expect(result.unlockedAvatarIds).toEqual(['avatar_01', 'avatar_02']);
    });
  });

  // =========================================================================
  // exportUserData
  // =========================================================================

  describe('exportUserData', () => {
    it('throws ForbiddenException for non-admin exporting other user', async () => {
      await expect(service.exportUserData(mockActor(), 'user-2', mockRequest()))
        .rejects.toThrow(ForbiddenException);
    });

    it('allows admin to export other user', async () => {
      const actor = mockActor({ role: AppRole.ADMIN });
      const user = makeUser({ id: 'user-2' });
      prisma.user.findUnique.mockResolvedValue(user);
      // Mock all the parallel queries
      const emptyArray = [] as any[];
      jest.spyOn(prisma as any, '$transaction').mockResolvedValue(undefined);
      // exportUserData uses Promise.all with many prisma calls — we mock them all
      const mockFindMany = jest.fn().mockResolvedValue(emptyArray);
      const mockFindUnique = jest.fn().mockResolvedValue(null);
      for (const model of Object.keys(prisma)) {
        if (model === '$transaction') continue;
        const m = (prisma as any)[model];
        if (m && typeof m === 'object') {
          m.findMany = m.findMany || mockFindMany;
          m.findUnique = m.findUnique || mockFindUnique;
        }
      }
      // Add missing prisma models
      const models = [
        'userStats', 'duel', 'duelAnswer', 'scheduledExam', 'examGrade',
        'theoryExamSession', 'theoryExamAttempt', 'practicalExamAttempt',
        'submittedQuestion', 'questionReport', 'flashcard', 'reportBookEntry',
        'schoolAttendanceEntry', 'swimSession', 'swimTrainingPlan', 'forumPost',
        'forumReply', 'chatMessage', 'appNotification', 'pushSubscription',
        'userXpEvent', 'auditLog', 'learningMaterial', 'resource', 'newsPost'
      ];
      for (const model of models) {
        if (!(prisma as any)[model]) {
          (prisma as any)[model] = { findMany: mockFindMany, findUnique: mockFindUnique };
        }
      }
      const result = await service.exportUserData(actor, 'user-2', mockRequest());
      expect(result.email).toBe('test@example.com');
      expect(result.meta.exportScope).toBe('admin');
    });

    it('allows self-export', async () => {
      const actor = mockActor();
      prisma.user.findUnique.mockResolvedValue(makeUser());
      const mockFindMany = jest.fn().mockResolvedValue([]);
      const mockFindUnique = jest.fn().mockResolvedValue(null);
      const models = [
        'userStats', 'duel', 'duelAnswer', 'scheduledExam', 'examGrade',
        'theoryExamSession', 'theoryExamAttempt', 'practicalExamAttempt',
        'submittedQuestion', 'questionReport', 'flashcard', 'reportBookEntry',
        'schoolAttendanceEntry', 'swimSession', 'swimTrainingPlan', 'forumPost',
        'forumReply', 'chatMessage', 'appNotification', 'pushSubscription',
        'userXpEvent', 'auditLog', 'learningMaterial', 'resource', 'newsPost'
      ];
      for (const model of models) {
        if (!(prisma as any)[model]) {
          (prisma as any)[model] = { findMany: mockFindMany, findUnique: mockFindUnique };
        }
      }
      const result = await service.exportUserData(actor, 'user-1', mockRequest());
      expect(result.meta.exportScope).toBe('self');
    });

    it('throws NotFoundException for deleted user', async () => {
      const actor = mockActor({ role: AppRole.ADMIN });
      prisma.user.findUnique.mockResolvedValue(makeUser({ id: 'user-2', isDeleted: true }));
      await expect(service.exportUserData(actor, 'user-2', mockRequest()))
        .rejects.toThrow(NotFoundException);
    });
  });
});
