import { DuelsController } from './duels.controller';
import { DuelsService } from './duels.service';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AppRole, AccountStatus } from '@prisma/client';

const mockActor = (): AuthenticatedUser => ({
  id: 'user-1',
  email: 'test@example.com',
  displayName: 'Tester',
  role: AppRole.AZUBI,
  status: AccountStatus.APPROVED,
  organizationId: 'org-1',
  canSignReports: false
});

const mockRequest = () => ({ headers: {}, ip: '127.0.0.1' } as any);

describe('DuelsController', () => {
  let controller: DuelsController;
  let service: jest.Mocked<DuelsService>;

  beforeEach(() => {
    service = {
      listMine: jest.fn(),
      leaderboard: jest.fn(),
      getOne: jest.fn(),
      create: jest.fn(),
      accept: jest.fn(),
      updateGameState: jest.fn(),
      forfeit: jest.fn(),
      submitAnswer: jest.fn(),
      reconcileDueDuelsAndReminders: jest.fn()
    } as unknown as jest.Mocked<DuelsService>;

    controller = new DuelsController(service);
  });

  describe('listMine', () => {
    it('delegates to duelsService.listMine with actor', () => {
      const actor = mockActor();
      service.listMine.mockResolvedValue([] as any);
      controller.listMine(actor);
      expect(service.listMine).toHaveBeenCalledWith(actor);
    });
  });

  describe('leaderboard', () => {
    it('delegates to duelsService.leaderboard with actor', () => {
      const actor = mockActor();
      service.leaderboard.mockResolvedValue([] as any);
      controller.leaderboard(actor);
      expect(service.leaderboard).toHaveBeenCalledWith(actor);
    });
  });

  describe('getOne', () => {
    it('delegates to duelsService.getOne with actor and duelId', () => {
      const actor = mockActor();
      service.getOne.mockResolvedValue({} as any);
      controller.getOne(actor, 'duel-123');
      expect(service.getOne).toHaveBeenCalledWith(actor, 'duel-123');
    });
  });

  describe('create', () => {
    it('delegates to duelsService.create with actor, dto and request', () => {
      const actor = mockActor();
      const dto = { opponentId: 'user-2' };
      const req = mockRequest();
      service.create.mockResolvedValue({} as any);
      controller.create(actor, dto as any, req);
      expect(service.create).toHaveBeenCalledWith(actor, dto, req);
    });
  });

  describe('accept', () => {
    it('delegates to duelsService.accept with actor, duelId and request', () => {
      const actor = mockActor();
      const req = mockRequest();
      service.accept.mockResolvedValue({} as any);
      controller.accept(actor, 'duel-456', req);
      expect(service.accept).toHaveBeenCalledWith(actor, 'duel-456', req);
    });
  });

  describe('updateGameState', () => {
    it('passes body.gameState (not the full body) to the service', () => {
      const actor = mockActor();
      const gameState = { currentTurn: 'Alice', categoryRound: 0, status: 'active' } as any;
      service.updateGameState.mockResolvedValue({} as any);
      controller.updateGameState(actor, 'duel-789', { gameState });
      expect(service.updateGameState).toHaveBeenCalledWith(actor, 'duel-789', gameState);
    });

    it('does NOT pass the full body wrapper to the service', () => {
      const actor = mockActor();
      const gameState = { status: 'finished' } as any;
      controller.updateGameState(actor, 'duel-789', { gameState });
      // The service must receive gameState directly, not { gameState }
      expect(service.updateGameState).not.toHaveBeenCalledWith(actor, 'duel-789', { gameState });
    });
  });

  describe('forfeit', () => {
    it('delegates to duelsService.forfeit with actor, duelId and request', () => {
      const actor = mockActor();
      const req = mockRequest();
      service.forfeit.mockResolvedValue({} as any);
      controller.forfeit(actor, 'duel-111', req);
      expect(service.forfeit).toHaveBeenCalledWith(actor, 'duel-111', req);
    });
  });

  describe('submitAnswer', () => {
    it('delegates to duelsService.submitAnswer with all parameters', () => {
      const actor = mockActor();
      const dto = { duelQuestionId: 'q-1', selectedOptionIndex: 2, durationMs: 3000 } as any;
      const req = mockRequest();
      service.submitAnswer.mockResolvedValue({} as any);
      controller.submitAnswer(actor, 'duel-222', dto, req);
      expect(service.submitAnswer).toHaveBeenCalledWith(actor, 'duel-222', dto, req);
    });
  });
});
