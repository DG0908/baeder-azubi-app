import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

/**
 * SSRF protection: Reject URLs pointing to internal/private IP ranges.
 *
 * Blocks:
 * - 127.0.0.0/8 (loopback)
 * - 10.0.0.0/8 (private)
 * - 172.16.0.0/12 (private)
 * - 192.168.0.0/16 (private)
 * - 169.254.0.0/16 (link-local)
 * - ::1 (IPv6 loopback)
 * - fc00::/7 (IPv6 unique-local)
 * - fe80::/10 (IPv6 link-local)
 * - localhost (hostname)
 */
const PRIVATE_IP_PATTERNS = [
  /^127\./, // Loopback
  /^10\./, // Private
  /^172\.(1[6-9]|2\d|3[01])\./, // Private
  /^192\.168\./, // Private
  /^169\.254\./, // Link-local
  /^::1$/, // IPv6 loopback
  /^fc00::/i, // IPv6 unique-local
  /^fe80::/i // IPv6 link-local
];

const LOCALHOST_HOSTNAMES = ['localhost', 'metadata.google.internal', '169.254.169.254'];

@ValidatorConstraint({ async: false })
export class NoInternalIpConstraint implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments): boolean {
    if (typeof value !== 'string' || value.trim().length === 0) {
      return false;
    }

    try {
      const url = new URL(value);

      // Only allow http/https schemes
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return false;
      }

      const hostname = url.hostname.toLowerCase();

      // Block known internal hostnames
      if (LOCALHOST_HOSTNAMES.some((blocked) => hostname === blocked)) {
        return false;
      }

      // Block private IP ranges
      if (PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(hostname))) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'URL must be public and not point to internal or private addresses.';
  }
}

export function IsNoInternalIp(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: NoInternalIpConstraint
    });
  };
}
