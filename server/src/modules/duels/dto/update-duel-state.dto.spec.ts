import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GameStateDto, UpdateDuelStateDto } from './update-duel-state.dto';

const toInstance = (plain: Record<string, unknown>) =>
  plainToInstance(UpdateDuelStateDto, plain);

const firstErrors = async (plain: Record<string, unknown>) => {
  const errors = await validate(toInstance(plain));
  return errors.map((e) => e.property);
};

describe('UpdateDuelStateDto', () => {
  describe('valid payloads', () => {
    it('accepts a full valid game state', async () => {
      const errors = await firstErrors({
        gameState: {
          currentTurn: 'Alice',
          categoryRound: 1,
          status: 'active',
          difficulty: 'normal',
          categoryRounds: [],
          challengeTimeoutMinutes: 60
        }
      });
      expect(errors).toHaveLength(0);
    });

    it('accepts an empty gameState object', async () => {
      const errors = await firstErrors({ gameState: {} });
      expect(errors).toHaveLength(0);
    });

    it('accepts status "finished" (was the bug: mapDuelStatus returns this)', async () => {
      const errors = await firstErrors({ gameState: { status: 'finished' } });
      expect(errors).toHaveLength(0);
    });

    it('accepts status "waiting"', async () => {
      const errors = await firstErrors({ gameState: { status: 'waiting' } });
      expect(errors).toHaveLength(0);
    });

    it('accepts status "unknown"', async () => {
      const errors = await firstErrors({ gameState: { status: 'unknown' } });
      expect(errors).toHaveLength(0);
    });

    it('accepts all allowed difficulties', async () => {
      const difficulties = ['anfaenger', 'profi', 'experte', 'extra', 'normal'];
      for (const difficulty of difficulties) {
        const errors = await firstErrors({ gameState: { difficulty } });
        expect(errors).toHaveLength(0);
      }
    });

    it('accepts categoryRound 0', async () => {
      const errors = await firstErrors({ gameState: { categoryRound: 0 } });
      expect(errors).toHaveLength(0);
    });

    it('accepts categoryRound 10 (max)', async () => {
      const errors = await firstErrors({ gameState: { categoryRound: 10 } });
      expect(errors).toHaveLength(0);
    });

    it('accepts challengeTimeoutMinutes at boundary values', async () => {
      for (const val of [1, 60, 10080]) {
        const errors = await firstErrors({ gameState: { challengeTimeoutMinutes: val } });
        expect(errors).toHaveLength(0);
      }
    });

    it('accepts categoryRounds as an array', async () => {
      const errors = await firstErrors({
        gameState: { categoryRounds: [{ category: 'tech', questions: [] }] }
      });
      expect(errors).toHaveLength(0);
    });
  });

  describe('invalid payloads', () => {
    it('rejects missing gameState', async () => {
      const errors = await firstErrors({});
      expect(errors).toContain('gameState');
    });

    it('rejects gameState as a string', async () => {
      const errors = await firstErrors({ gameState: 'not-an-object' });
      expect(errors).toContain('gameState');
    });

    it('rejects categoryRound below 0', async () => {
      const instance = plainToInstance(GameStateDto, { categoryRound: -1 });
      const errors = await validate(instance);
      const props = errors.map((e) => e.property);
      expect(props).toContain('categoryRound');
    });

    it('rejects categoryRound above 10', async () => {
      const instance = plainToInstance(GameStateDto, { categoryRound: 11 });
      const errors = await validate(instance);
      expect(errors.map((e) => e.property)).toContain('categoryRound');
    });

    it('rejects unknown difficulty', async () => {
      const instance = plainToInstance(GameStateDto, { difficulty: 'god-mode' });
      const errors = await validate(instance);
      expect(errors.map((e) => e.property)).toContain('difficulty');
    });

    it('rejects challengeTimeoutMinutes of 0', async () => {
      const instance = plainToInstance(GameStateDto, { challengeTimeoutMinutes: 0 });
      const errors = await validate(instance);
      expect(errors.map((e) => e.property)).toContain('challengeTimeoutMinutes');
    });

    it('rejects challengeTimeoutMinutes above 10080', async () => {
      const instance = plainToInstance(GameStateDto, { challengeTimeoutMinutes: 10081 });
      const errors = await validate(instance);
      expect(errors.map((e) => e.property)).toContain('challengeTimeoutMinutes');
    });

    it('rejects categoryRounds as a non-array', async () => {
      const instance = plainToInstance(GameStateDto, { categoryRounds: 'not-an-array' });
      const errors = await validate(instance);
      expect(errors.map((e) => e.property)).toContain('categoryRounds');
    });

    it('rejects currentTurn as a number', async () => {
      const instance = plainToInstance(GameStateDto, { currentTurn: 42 });
      const errors = await validate(instance);
      expect(errors.map((e) => e.property)).toContain('currentTurn');
    });
  });
});
