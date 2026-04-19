import { NotFoundException } from '@nestjs/common';
import { AccountStatus, AppRole } from '@prisma/client';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { FeatureRolloutService } from './feature-rollout.service';
import { APP_FEATURE_REGISTRY } from './feature-registry';

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

const createMockPrisma = () => ({
  user: {
    findUnique: jest.fn()
  },
  appConfig: {
    findUnique: jest.fn()
  }
});

describe('FeatureRolloutService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: FeatureRolloutService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new FeatureRolloutService(prisma as any);
  });

  describe('getAccessMapForUser', () => {
    it('liefert einen Access-Eintrag pro Registry-Feature', async () => {
      prisma.user.findUnique.mockResolvedValue({
        role: AppRole.AZUBI,
        isBetaTester: false,
        featureOverrides: null
      });
      prisma.appConfig.findUnique.mockResolvedValue({ featureStages: {} });

      const result = await service.getAccessMapForUser(actor());

      for (const feature of APP_FEATURE_REGISTRY) {
        expect(result).toHaveProperty(feature.key);
      }
    });

    it('gibt Admin Zugriff auf alle Features (auch alpha/beta) in der eigenen Organisation', async () => {
      prisma.user.findUnique.mockResolvedValue({
        role: AppRole.ADMIN,
        isBetaTester: false,
        featureOverrides: null
      });
      prisma.appConfig.findUnique.mockResolvedValue({
        featureStages: { quiz: 'alpha', forum: 'beta' }
      });

      const result = await service.getAccessMapForUser(actor({ role: AppRole.ADMIN }));

      for (const feature of APP_FEATURE_REGISTRY) {
        expect(result[feature.key]).toBe(true);
      }
    });

    it('blockt Azubi von Admin-only Feature (Rolle als harter Filter)', async () => {
      prisma.user.findUnique.mockResolvedValue({
        role: AppRole.AZUBI,
        isBetaTester: true,
        featureOverrides: { admin: true }
      });
      prisma.appConfig.findUnique.mockResolvedValue({ featureStages: {} });

      const result = await service.getAccessMapForUser(actor());

      expect(result['admin']).toBe(false);
      expect(result['trainer-dashboard']).toBe(false);
    });

    it('zeigt Beta-Tester ein beta-Feature', async () => {
      prisma.user.findUnique.mockResolvedValue({
        role: AppRole.AZUBI,
        isBetaTester: true,
        featureOverrides: null
      });
      prisma.appConfig.findUnique.mockResolvedValue({
        featureStages: { forum: 'beta' }
      });

      const result = await service.getAccessMapForUser(actor());

      expect(result['forum']).toBe(true);
    });

    it('behandelt featureOverrides als JSON robust (ignoriert Nicht-Boolean-Werte)', async () => {
      prisma.user.findUnique.mockResolvedValue({
        role: AppRole.AZUBI,
        isBetaTester: false,
        featureOverrides: { quiz: 'ja', forum: true, news: 123 }
      });
      prisma.appConfig.findUnique.mockResolvedValue({ featureStages: { forum: 'alpha' } });

      const result = await service.getAccessMapForUser(actor());

      expect(result['quiz']).toBe(true);
      expect(result['forum']).toBe(true);
      expect(result['news']).toBe(true);
    });

    it('behandelt ungueltige orgStages-Eintraege als nicht gesetzt (default greift)', async () => {
      prisma.user.findUnique.mockResolvedValue({
        role: AppRole.AZUBI,
        isBetaTester: false,
        featureOverrides: null
      });
      prisma.appConfig.findUnique.mockResolvedValue({
        featureStages: { quiz: 'garbage', forum: ['alpha'] }
      });

      const result = await service.getAccessMapForUser(actor());

      expect(result['quiz']).toBe(true);
      expect(result['forum']).toBe(true);
    });

    it('faellt auf leeren Stages-Map zurueck, wenn User keine organizationId hat', async () => {
      prisma.user.findUnique.mockResolvedValue({
        role: AppRole.AZUBI,
        isBetaTester: false,
        featureOverrides: null
      });

      const result = await service.getAccessMapForUser(actor({ organizationId: null }));

      expect(prisma.appConfig.findUnique).not.toHaveBeenCalled();
      expect(result['quiz']).toBe(true);
    });

    it('wirft NotFoundException, wenn der User nicht existiert', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.appConfig.findUnique.mockResolvedValue({ featureStages: {} });

      await expect(service.getAccessMapForUser(actor())).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('getRolloutSnapshot', () => {
    it('liefert Stage pro Feature aus orgStages bzw. default', async () => {
      prisma.user.findUnique.mockResolvedValue({
        role: AppRole.ADMIN,
        isBetaTester: false,
        featureOverrides: null
      });
      prisma.appConfig.findUnique.mockResolvedValue({
        featureStages: { quiz: 'beta' }
      });

      const snapshot = await service.getRolloutSnapshot(actor({ role: AppRole.ADMIN }));

      const quiz = snapshot.features.find((f) => f.key === 'quiz');
      const forum = snapshot.features.find((f) => f.key === 'forum');

      expect(quiz?.stage).toBe('beta');
      expect(quiz?.defaultStage).toBe('stable');
      expect(forum?.stage).toBe('stable');
    });

    it('snapshot enthaelt alwaysOn-Flag und requiredRoles', async () => {
      prisma.user.findUnique.mockResolvedValue({
        role: AppRole.ADMIN,
        isBetaTester: false,
        featureOverrides: null
      });
      prisma.appConfig.findUnique.mockResolvedValue({ featureStages: {} });

      const snapshot = await service.getRolloutSnapshot(actor({ role: AppRole.ADMIN }));
      const home = snapshot.features.find((f) => f.key === 'home');
      const admin = snapshot.features.find((f) => f.key === 'admin');

      expect(home?.alwaysOn).toBe(true);
      expect(admin?.requiredRoles).toEqual(['ADMIN']);
    });
  });
});
