import { ConfigService } from '@nestjs/config';
import { AccountStatus } from '@prisma/client';
import { AuditLogService } from '../../common/services/audit-log.service';
import { MailerService } from '../../common/services/mailer.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RetentionSchedulerService } from './retention-scheduler.service';

const mockPrisma = () => ({
  user: {
    findMany: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue({})
  }
});

const mockMailer = () => ({
  sendRetentionWarningEmail: jest.fn().mockResolvedValue(undefined)
});

const mockAudit = () => ({
  write: jest.fn().mockResolvedValue(undefined)
});

const mockConfig = () => ({
  get: jest.fn().mockImplementation((key: string, fallback?: string) => {
    if (key === 'APP_PUBLIC_URL') return 'https://azubi.smartbaden.de';
    return fallback ?? '';
  })
});

function monthsAgo(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

function createUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 'user-1',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'AZUBI',
    lastLoginAt: monthsAgo(23),
    ...overrides
  };
}

describe('RetentionSchedulerService', () => {
  let service: RetentionSchedulerService;
  let prisma: ReturnType<typeof mockPrisma>;
  let mailer: ReturnType<typeof mockMailer>;
  let audit: ReturnType<typeof mockAudit>;
  let config: ReturnType<typeof mockConfig>;

  beforeEach(() => {
    prisma = mockPrisma();
    mailer = mockMailer();
    audit = mockAudit();
    config = mockConfig();

    service = new RetentionSchedulerService(
      prisma as unknown as PrismaService,
      mailer as unknown as MailerService,
      audit as unknown as AuditLogService,
      config as unknown as ConfigService
    );
  });

  describe('warnInactiveUsers', () => {
    it('should return 0 when no candidates found', async () => {
      prisma.user.findMany.mockResolvedValueOnce([]);
      const result = await service.warnInactiveUsers();
      expect(result).toBe(0);
      expect(mailer.sendRetentionWarningEmail).not.toHaveBeenCalled();
    });

    it('should send warning email and mark user', async () => {
      const user = createUser();
      prisma.user.findMany.mockResolvedValueOnce([user]);

      const result = await service.warnInactiveUsers();

      expect(result).toBe(1);
      expect(mailer.sendRetentionWarningEmail).toHaveBeenCalledTimes(1);
      expect(mailer.sendRetentionWarningEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          displayName: 'Test User',
          loginUrl: 'https://azubi.smartbaden.de'
        })
      );

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { retentionWarnedAt: expect.any(Date) }
      });

      expect(audit.write).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'user.retention_warning_sent',
          entityType: 'user',
          entityId: 'user-1'
        })
      );
    });

    it('should process multiple users', async () => {
      const users = [
        createUser({ id: 'u1', email: 'a@test.com' }),
        createUser({ id: 'u2', email: 'b@test.com' }),
        createUser({ id: 'u3', email: 'c@test.com' })
      ];
      prisma.user.findMany.mockResolvedValueOnce(users);

      const result = await service.warnInactiveUsers();

      expect(result).toBe(3);
      expect(mailer.sendRetentionWarningEmail).toHaveBeenCalledTimes(3);
      expect(prisma.user.update).toHaveBeenCalledTimes(3);
      expect(audit.write).toHaveBeenCalledTimes(3);
    });

    it('should calculate correct daysUntilDeletion', async () => {
      const user = createUser({ lastLoginAt: monthsAgo(22) });
      prisma.user.findMany.mockResolvedValueOnce([user]);

      await service.warnInactiveUsers();

      const call = mailer.sendRetentionWarningEmail.mock.calls[0][0];
      // User last logged in 22 months ago, deletion at 24 months → ~60 days
      expect(call.daysUntilDeletion).toBeGreaterThanOrEqual(55);
      expect(call.daysUntilDeletion).toBeLessThanOrEqual(65);
    });

    it('should use APP_PUBLIC_URL for loginUrl', async () => {
      config.get.mockImplementation((key: string) => {
        if (key === 'APP_PUBLIC_URL') return 'https://custom.app.de';
        return '';
      });

      const user = createUser();
      prisma.user.findMany.mockResolvedValueOnce([user]);

      await service.warnInactiveUsers();

      expect(mailer.sendRetentionWarningEmail).toHaveBeenCalledWith(
        expect.objectContaining({ loginUrl: 'https://custom.app.de' })
      );
    });

    it('should fallback to default URL when APP_PUBLIC_URL not set', async () => {
      config.get.mockImplementation(() => '');

      const user = createUser();
      prisma.user.findMany.mockResolvedValueOnce([user]);

      await service.warnInactiveUsers();

      expect(mailer.sendRetentionWarningEmail).toHaveBeenCalledWith(
        expect.objectContaining({ loginUrl: 'https://azubi.smartbaden.de' })
      );
    });
  });

  describe('deleteExpiredUsers', () => {
    it('should return 0 when no expired users', async () => {
      prisma.user.findMany.mockResolvedValueOnce([]);
      const result = await service.deleteExpiredUsers();
      expect(result).toBe(0);
    });

    it('should soft-delete expired user', async () => {
      const user = createUser({ lastLoginAt: monthsAgo(25) });
      prisma.user.findMany.mockResolvedValueOnce([user]);

      const result = await service.deleteExpiredUsers();

      expect(result).toBe(1);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: {
          isDeleted: true,
          status: AccountStatus.DISABLED,
          refreshTokenHash: null
        }
      });
    });

    it('should write audit log for deletion', async () => {
      const user = createUser({ lastLoginAt: monthsAgo(25) });
      prisma.user.findMany.mockResolvedValueOnce([user]);

      await service.deleteExpiredUsers();

      expect(audit.write).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'user.retention_deleted',
          entityType: 'user',
          entityId: 'user-1',
          metadata: expect.objectContaining({
            email: 'test@example.com',
            displayName: 'Test User',
            role: 'AZUBI'
          })
        })
      );
    });

    it('should delete multiple expired users', async () => {
      const users = [
        createUser({ id: 'u1', lastLoginAt: monthsAgo(25) }),
        createUser({ id: 'u2', lastLoginAt: monthsAgo(30) })
      ];
      prisma.user.findMany.mockResolvedValueOnce(users);

      const result = await service.deleteExpiredUsers();

      expect(result).toBe(2);
      expect(prisma.user.update).toHaveBeenCalledTimes(2);
      expect(audit.write).toHaveBeenCalledTimes(2);
    });
  });

  describe('processRetention', () => {
    it('should call warn and delete', async () => {
      const warnSpy = jest.spyOn(service, 'warnInactiveUsers').mockResolvedValue(2);
      const deleteSpy = jest.spyOn(service, 'deleteExpiredUsers').mockResolvedValue(1);

      await service.processRetention();

      expect(warnSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalled();
    });

    it('should not throw on error', async () => {
      jest.spyOn(service, 'warnInactiveUsers').mockRejectedValue(new Error('DB down'));

      await expect(service.processRetention()).resolves.not.toThrow();
    });
  });

  describe('query filters', () => {
    it('warnInactiveUsers queries for approved, non-deleted, not-yet-warned users', async () => {
      await service.warnInactiveUsers();

      const where = prisma.user.findMany.mock.calls[0][0].where;
      expect(where.isDeleted).toBe(false);
      expect(where.status).toBe(AccountStatus.APPROVED);
      expect(where.retentionWarnedAt).toBeNull();
      expect(where.lastLoginAt.lt).toBeInstanceOf(Date);
      expect(where.lastLoginAt.gte).toBeInstanceOf(Date);
    });

    it('deleteExpiredUsers queries for approved, non-deleted users past cutoff', async () => {
      await service.deleteExpiredUsers();

      const where = prisma.user.findMany.mock.calls[0][0].where;
      expect(where.isDeleted).toBe(false);
      expect(where.status).toBe(AccountStatus.APPROVED);
      expect(where.lastLoginAt.lt).toBeInstanceOf(Date);
    });

    it('warn cutoff is 22 months ago, delete cutoff is 24 months ago', async () => {
      await service.warnInactiveUsers();

      const warnWhere = prisma.user.findMany.mock.calls[0][0].where;
      const warnCutoff = warnWhere.lastLoginAt.lt as Date;
      const deleteCutoff = warnWhere.lastLoginAt.gte as Date;

      const now = Date.now();
      const warnMonthsAgo = (now - warnCutoff.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
      const deleteMonthsAgo = (now - deleteCutoff.getTime()) / (1000 * 60 * 60 * 24 * 30.44);

      expect(warnMonthsAgo).toBeCloseTo(22, 0);
      expect(deleteMonthsAgo).toBeCloseTo(24, 0);
    });
  });
});
