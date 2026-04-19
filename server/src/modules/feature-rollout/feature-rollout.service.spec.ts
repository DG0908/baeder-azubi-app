import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AccountStatus, AppRole, Prisma } from '@prisma/client';
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
    findUnique: jest.fn(),
    update: jest.fn()
  },
  appConfig: {
    findUnique: jest.fn(),
    upsert: jest.fn()
  }
});

const createMockAudit = () => ({
  writeForUser: jest.fn().mockResolvedValue(undefined)
});

const fakeRequest = { headers: {} } as any;

describe('FeatureRolloutService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let audit: ReturnType<typeof createMockAudit>;
  let service: FeatureRolloutService;

  beforeEach(() => {
    prisma = createMockPrisma();
    audit = createMockAudit();
    service = new FeatureRolloutService(prisma as any, audit as any);
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

    it('gibt Admin Zugriff auf alle Features (auch alpha/beta)', async () => {
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
      prisma.appConfig.findUnique.mockResolvedValue({ featureStages: { forum: 'beta' } });

      const result = await service.getAccessMapForUser(actor());
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
      prisma.appConfig.findUnique.mockResolvedValue({ featureStages: { quiz: 'beta' } });

      const snapshot = await service.getRolloutSnapshot(actor({ role: AppRole.ADMIN }));

      const quiz = snapshot.features.find((f) => f.key === 'quiz');
      const forum = snapshot.features.find((f) => f.key === 'forum');

      expect(quiz?.stage).toBe('beta');
      expect(quiz?.defaultStage).toBe('stable');
      expect(forum?.stage).toBe('stable');
    });
  });

  describe('setFeatureStage', () => {
    const admin = actor({ role: AppRole.ADMIN });

    beforeEach(() => {
      prisma.appConfig.findUnique.mockResolvedValue({ featureStages: { quiz: 'stable' } });
      prisma.appConfig.upsert.mockResolvedValue({});
    });

    it('upserted AppConfig.featureStages mit neuem Stage-Wert', async () => {
      const result = await service.setFeatureStage(admin, 'quiz', 'beta', fakeRequest);

      expect(prisma.appConfig.upsert).toHaveBeenCalledTimes(1);
      const upsertArgs = prisma.appConfig.upsert.mock.calls[0][0];
      expect(upsertArgs.where).toEqual({ organizationId: 'org-1' });
      expect(upsertArgs.update.featureStages).toEqual({ quiz: 'beta' });
      expect(result).toEqual({ key: 'quiz', stage: 'beta' });
    });

    it('schreibt Audit-Eintrag mit from/to Stage', async () => {
      await service.setFeatureStage(admin, 'quiz', 'beta', fakeRequest);

      expect(audit.writeForUser).toHaveBeenCalledWith(
        admin,
        'feature_rollout.stage_changed',
        'AppConfig',
        'org-1',
        expect.objectContaining({
          featureKey: 'quiz',
          previousStage: 'stable',
          nextStage: 'beta'
        }),
        fakeRequest
      );
    });

    it('erlaubt Downgrade stable -> beta', async () => {
      prisma.appConfig.findUnique.mockResolvedValue({ featureStages: {} });

      await expect(service.setFeatureStage(admin, 'quiz', 'beta', fakeRequest)).resolves.toEqual({
        key: 'quiz',
        stage: 'beta'
      });
    });

    it('wirft NotFoundException bei unbekanntem Feature-Key', async () => {
      await expect(
        service.setFeatureStage(admin, 'nonexistent', 'beta', fakeRequest)
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('verweigert Stage-Wechsel fuer alwaysOn-Feature (home/profile)', async () => {
      await expect(service.setFeatureStage(admin, 'home', 'beta', fakeRequest)).rejects.toBeInstanceOf(
        BadRequestException
      );
      await expect(service.setFeatureStage(admin, 'profile', 'alpha', fakeRequest)).rejects.toBeInstanceOf(
        BadRequestException
      );
    });

    it('wirft BadRequestException wenn Admin keiner Organisation zugeordnet ist', async () => {
      const orgless = actor({ role: AppRole.ADMIN, organizationId: null });
      await expect(service.setFeatureStage(orgless, 'quiz', 'beta', fakeRequest)).rejects.toBeInstanceOf(
        BadRequestException
      );
    });
  });

  describe('setBetaTester', () => {
    const admin = actor({ role: AppRole.ADMIN });

    it('setzt isBetaTester=true und schreibt Audit-Eintrag', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'target-1',
        isDeleted: false,
        isBetaTester: false,
        organizationId: 'org-1'
      });
      prisma.user.update.mockResolvedValue({ id: 'target-1', isBetaTester: true });

      const result = await service.setBetaTester(admin, 'target-1', true, fakeRequest);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'target-1' },
        data: { isBetaTester: true },
        select: { id: true, isBetaTester: true }
      });
      expect(audit.writeForUser).toHaveBeenCalledWith(
        admin,
        'feature_rollout.beta_tester_changed',
        'User',
        'target-1',
        expect.objectContaining({ previous: false, next: true }),
        fakeRequest
      );
      expect(result.isBetaTester).toBe(true);
    });

    it('no-op wenn der Wert bereits gesetzt ist (kein Update, kein Audit)', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'target-1',
        isDeleted: false,
        isBetaTester: true,
        organizationId: 'org-1'
      });

      const result = await service.setBetaTester(admin, 'target-1', true, fakeRequest);

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(audit.writeForUser).not.toHaveBeenCalled();
      expect(result.isBetaTester).toBe(true);
    });

    it('wirft NotFoundException bei geloeschtem oder unbekanntem User', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.setBetaTester(admin, 'ghost', true, fakeRequest)).rejects.toBeInstanceOf(
        NotFoundException
      );

      prisma.user.findUnique.mockResolvedValue({
        id: 'target-1',
        isDeleted: true,
        isBetaTester: false,
        organizationId: 'org-1'
      });
      await expect(service.setBetaTester(admin, 'target-1', true, fakeRequest)).rejects.toBeInstanceOf(
        NotFoundException
      );
    });
  });

  describe('setFeatureOverrides', () => {
    const admin = actor({ role: AppRole.ADMIN });

    beforeEach(() => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'target-1',
        isDeleted: false,
        featureOverrides: { quiz: true },
        organizationId: 'org-1'
      });
      prisma.user.update.mockImplementation((args: any) => ({
        id: 'target-1',
        featureOverrides: args.data.featureOverrides === Prisma.JsonNull ? null : args.data.featureOverrides
      }));
    });

    it('merged neue Overrides mit bestehenden', async () => {
      await service.setFeatureOverrides(
        admin,
        'target-1',
        { forum: true, news: false },
        fakeRequest
      );

      const updateArgs = prisma.user.update.mock.calls[0][0];
      expect(updateArgs.data.featureOverrides).toEqual({
        quiz: true,
        forum: true,
        news: false
      });
    });

    it('entfernt einen Override bei null', async () => {
      await service.setFeatureOverrides(admin, 'target-1', { quiz: null }, fakeRequest);

      const updateArgs = prisma.user.update.mock.calls[0][0];
      expect(updateArgs.data.featureOverrides).toEqual(Prisma.JsonNull);
    });

    it('wirft BadRequestException bei unbekanntem Feature-Key', async () => {
      await expect(
        service.setFeatureOverrides(admin, 'target-1', { nonexistent: true }, fakeRequest)
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('wirft BadRequestException bei Nicht-Boolean-Nicht-Null-Wert', async () => {
      await expect(
        service.setFeatureOverrides(admin, 'target-1', { quiz: 'ja' as any }, fakeRequest)
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('no-op wenn keine Aenderung (kein Update, kein Audit)', async () => {
      await service.setFeatureOverrides(admin, 'target-1', { quiz: true }, fakeRequest);

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(audit.writeForUser).not.toHaveBeenCalled();
    });

    it('schreibt Audit-Eintrag mit changes-Map', async () => {
      await service.setFeatureOverrides(admin, 'target-1', { forum: true }, fakeRequest);

      expect(audit.writeForUser).toHaveBeenCalledWith(
        admin,
        'feature_rollout.user_overrides_changed',
        'User',
        'target-1',
        expect.objectContaining({
          changes: expect.objectContaining({ forum: { previous: undefined, next: true } })
        }),
        fakeRequest
      );
    });

    it('wirft NotFoundException bei geloeschtem User', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'target-1',
        isDeleted: true,
        featureOverrides: null,
        organizationId: 'org-1'
      });

      await expect(
        service.setFeatureOverrides(admin, 'target-1', { quiz: true }, fakeRequest)
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
