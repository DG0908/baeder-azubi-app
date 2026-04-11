import { IsPasswordComplex, PasswordComplexityConstraint } from './password-complexity.validator';

describe('PasswordComplexityConstraint', () => {
  const validator = new PasswordComplexityConstraint();
  const mockArgs = {} as any;

  describe('valid passwords', () => {
    const validPasswords = [
      'MyStr0ng!Pass',
      'Secure123#Password',
      'Test@12345678',
      'Abcdefgh1!AB',
      'Z9$mKp2qRxYz'
    ];

    validPasswords.forEach(password => {
      it(`should accept "${password}"`, () => {
        expect(validator.validate(password, mockArgs)).toBe(true);
      });
    });
  });

  describe('invalid passwords', () => {
    const invalidPasswords = [
      { value: 'short1!', reason: 'too short' },
      { value: 'nouppercase1!', reason: 'no uppercase' },
      { value: 'NOLOWERCASE1!', reason: 'no lowercase' },
      { value: 'NoDigitsHere!', reason: 'no digit' },
      { value: 'NoSpecial123', reason: 'no special char' },
      { value: '', reason: 'empty string' },
      { value: 'AllCaps123!', reason: 'all caps no lowercase' }
    ];

    invalidPasswords.forEach(({ value, reason }) => {
      it(`should reject "${value}" (${reason})`, () => {
        expect(validator.validate(value, mockArgs)).toBe(false);
      });
    });
  });
});
