import { AccountStatus, AppRole } from '@prisma/client';
import { BadgesService } from './badges.service';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';

const actor = (overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser => ({
  id: 'user-1',
  email: 'azubi@example.com',
  displayName: 'Azubi',
  role: AppRole.AZUBI,
  status: AccountStatus.APPROVED,
  organizationId: 'org-1',
  canSignReports: false,
  ...overrides
});

const makeRow = (badgeId: string, earnedAt = new Date('2026-04-18T10:00:00Z'), id = `row-${badgeId}`) => ({
  id,
  userId: 'user-1',
  badgeId,
  earnedAt
});

const createMockPrisma = () => ({
  userBadge: {
    findMany: jest.fn(),
    createMany: jest.fn()
  }
});

describe('BadgesService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: BadgesService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new BadgesService(prisma as any);
  });

  describe('getMine', () => {
    it('liefert Badges des aktuellen Nutzers chronologisch als ISO-String', async () => {
      prisma.userBadge.findMany.mockResolvedValue([
        makeRow('early_bird', new Date('2026-04-10T08:00:00Z')),
        makeRow('quiz_winner_10', new Date('2026-04-15T12:00:00Z'))
      ]);

      const result = await service.getMine(actor());

      expect(prisma.userBadge.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { earnedAt: 'asc' }
      });
      expect(result).toEqual([
        { id: 'row-early_bird', badgeId: 'early_bird', earnedAt: '2026-04-10T08:00:00.000Z' },
        { id: 'row-quiz_winner_10', badgeId: 'quiz_winner_10', earnedAt: '2026-04-15T12:00:00.000Z' }
      ]);
    });

    it('gibt leeres Array zurück, wenn der User keine Badges hat', async () => {
      prisma.userBadge.findMany.mockResolvedValue([]);
      const result = await service.getMine(actor());
      expect(result).toEqual([]);
    });
  });

  describe('grantMany', () => {
    it('legt neue Badges an und dedupliziert Eingaben', async () => {
      prisma.userBadge.createMany.mockResolvedValue({ count: 2 });
      prisma.userBadge.findMany.mockResolvedValue([
        makeRow('quiz_winner_10'),
        makeRow('night_owl')
      ]);

      const result = await service.grantMany(actor(), ['quiz_winner_10', 'night_owl', 'quiz_winner_10']);

      expect(prisma.userBadge.createMany).toHaveBeenCalledWith({
        data: [
          { userId: 'user-1', badgeId: 'quiz_winner_10' },
          { userId: 'user-1', badgeId: 'night_owl' }
        ],
        skipDuplicates: true
      });
      expect(result).toHaveLength(2);
    });

    it('überspringt Prisma-createMany bei leerer Liste, liefert vorhandene zurück', async () => {
      prisma.userBadge.findMany.mockResolvedValue([makeRow('questions_50')]);

      const result = await service.grantMany(actor(), []);

      expect(prisma.userBadge.createMany).not.toHaveBeenCalled();
      expect(result).toEqual([
        { id: 'row-questions_50', badgeId: 'questions_50', earnedAt: '2026-04-18T10:00:00.000Z' }
      ]);
    });

    it('nutzt skipDuplicates — bereits vergebene Badges werden ignoriert', async () => {
      prisma.userBadge.createMany.mockResolvedValue({ count: 0 });
      prisma.userBadge.findMany.mockResolvedValue([makeRow('early_bird')]);

      await service.grantMany(actor(), ['early_bird']);

      expect(prisma.userBadge.createMany).toHaveBeenCalledWith(
        expect.objectContaining({ skipDuplicates: true })
      );
    });
  });
});
