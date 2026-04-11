import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SubmitAnswerDto } from './submit-answer.dto';

const toInstance = (plain: Record<string, unknown>) =>
  plainToInstance(SubmitAnswerDto, plain);

describe('SubmitAnswerDto', () => {
  describe('valid payloads', () => {
    it('accepts a minimal valid payload', async () => {
      const errors = await validate(toInstance({ duelQuestionId: 'abc123', selectedOptionIndex: 0 }));
      expect(errors).toHaveLength(0);
    });

    it('accepts selectedOptionIndex at upper boundary (20)', async () => {
      const errors = await validate(toInstance({ duelQuestionId: 'abc', selectedOptionIndex: 20 }));
      expect(errors).toHaveLength(0);
    });

    it('accepts optional durationMs', async () => {
      const errors = await validate(toInstance({
        duelQuestionId: 'abc',
        selectedOptionIndex: 2,
        durationMs: 5000
      }));
      expect(errors).toHaveLength(0);
    });

    it('accepts durationMs at boundary (300000)', async () => {
      const errors = await validate(toInstance({
        duelQuestionId: 'abc',
        selectedOptionIndex: 0,
        durationMs: 300000
      }));
      expect(errors).toHaveLength(0);
    });
  });

  describe('invalid payloads', () => {
    it('rejects missing duelQuestionId', async () => {
      const errors = await validate(toInstance({ selectedOptionIndex: 0 }));
      expect(errors.map((e) => e.property)).toContain('duelQuestionId');
    });

    it('rejects non-string duelQuestionId', async () => {
      const errors = await validate(toInstance({ duelQuestionId: 123, selectedOptionIndex: 0 }));
      expect(errors.map((e) => e.property)).toContain('duelQuestionId');
    });

    it('rejects negative selectedOptionIndex', async () => {
      const errors = await validate(toInstance({ duelQuestionId: 'abc', selectedOptionIndex: -1 }));
      expect(errors.map((e) => e.property)).toContain('selectedOptionIndex');
    });

    it('rejects selectedOptionIndex above 20', async () => {
      const errors = await validate(toInstance({ duelQuestionId: 'abc', selectedOptionIndex: 21 }));
      expect(errors.map((e) => e.property)).toContain('selectedOptionIndex');
    });

    it('rejects negative durationMs', async () => {
      const errors = await validate(toInstance({
        duelQuestionId: 'abc',
        selectedOptionIndex: 0,
        durationMs: -1
      }));
      expect(errors.map((e) => e.property)).toContain('durationMs');
    });

    it('rejects durationMs above 300000', async () => {
      const errors = await validate(toInstance({
        duelQuestionId: 'abc',
        selectedOptionIndex: 0,
        durationMs: 300001
      }));
      expect(errors.map((e) => e.property)).toContain('durationMs');
    });

    it('rejects non-integer selectedOptionIndex', async () => {
      const errors = await validate(toInstance({ duelQuestionId: 'abc', selectedOptionIndex: 1.5 }));
      expect(errors.map((e) => e.property)).toContain('selectedOptionIndex');
    });
  });
});
