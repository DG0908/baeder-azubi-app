import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

/**
 * Password complexity rules for account security:
 * - Minimum 12 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 digit
 * - At least 1 special character
 */
@ValidatorConstraint({ async: false })
export class PasswordComplexityConstraint implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments): boolean {
    if (typeof value !== 'string' || value.length < 12 || value.length > 128) {
      return false;
    }

    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    return hasUppercase && hasLowercase && hasDigit && hasSpecial;
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Password must be at least 12 characters and contain uppercase, lowercase, digit, and special character.';
  }
}

export function IsPasswordComplex(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: PasswordComplexityConstraint
    });
  };
}
