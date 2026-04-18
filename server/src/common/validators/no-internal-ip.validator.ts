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
 * Blocks (after canonicalizing hex/octal/decimal IPv4 notations):
 * - 0.0.0.0/8 (unspecified / "this host")
 * - 127.0.0.0/8 (loopback)
 * - 10.0.0.0/8 (private)
 * - 172.16.0.0/12 (private)
 * - 192.168.0.0/16 (private)
 * - 169.254.0.0/16 (link-local incl. AWS/GCP metadata)
 * - ::, ::1, ::ffff:x.x.x.x (IPv6 unspecified/loopback/IPv4-mapped)
 * - fc00::/7, fe80::/10, fd00::/8 (IPv6 private/link-local)
 * - localhost / known metadata hostnames
 */
const PRIVATE_IPV4_PATTERNS: RegExp[] = [
  /^0\./, // 0.0.0.0/8 (unspecified — many OS route to loopback)
  /^127\./, // Loopback
  /^10\./, // Private
  /^172\.(1[6-9]|2\d|3[01])\./, // Private 172.16/12
  /^192\.168\./, // Private
  /^169\.254\./, // Link-local
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./ // Carrier-grade NAT 100.64/10
];

const PRIVATE_IPV6_PATTERNS: RegExp[] = [
  /^::$/, // Unspecified
  /^::1$/, // Loopback
  /^::ffff:/i, // IPv4-mapped (z. B. ::ffff:127.0.0.1)
  /^::ffff:0:/i, // IPv4-translated
  /^64:ff9b::/i, // NAT64 well-known
  /^fc[0-9a-f]{2}:/i, // fc00::/7 (unique-local)
  /^fd[0-9a-f]{2}:/i, // fd00::/8 (unique-local)
  /^fe[89ab][0-9a-f]:/i // fe80::/10 (link-local)
];

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'ip6-localhost',
  'ip6-loopback',
  'metadata.google.internal',
  'metadata',
  'metadata.goog'
]);

/**
 * Canonicalize an IPv4-looking hostname. Handles:
 * - Hex octets: 0x7f.0x0.0x0.0x1
 * - Octal octets: 0177.0.0.1
 * - Decimal 32-bit integer: 2130706433
 * Returns the dotted-decimal form, or null if the input is not an IPv4.
 */
function canonicalizeIpv4(hostname: string): string | null {
  const raw = hostname.replace(/^\[|\]$/g, '');

  // Dotted notation with possibly hex/octal/decimal octets
  const parts = raw.split('.');
  if (parts.length === 4 && parts.every((p) => /^(0x[0-9a-f]+|\d+)$/i.test(p))) {
    const nums = parts.map((p) => {
      if (/^0x/i.test(p)) return parseInt(p, 16);
      if (/^0\d+$/.test(p)) return parseInt(p, 8);
      return parseInt(p, 10);
    });
    if (nums.every((n) => Number.isInteger(n) && n >= 0 && n <= 255)) {
      return nums.join('.');
    }
    return null;
  }

  // Single 32-bit integer (decimal or hex)
  if (/^(0x[0-9a-f]+|\d+)$/i.test(raw)) {
    const n = /^0x/i.test(raw) ? parseInt(raw, 16) : parseInt(raw, 10);
    if (Number.isInteger(n) && n >= 0 && n <= 0xffffffff) {
      return [
        (n >>> 24) & 0xff,
        (n >>> 16) & 0xff,
        (n >>> 8) & 0xff,
        n & 0xff
      ].join('.');
    }
  }

  return null;
}

export function isInternalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().trim();
  if (host.length === 0) return true;

  if (BLOCKED_HOSTNAMES.has(host)) return true;
  if (host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    return true;
  }

  // Strip brackets from IPv6 literals
  const stripped = host.replace(/^\[|\]$/g, '');

  // Try IPv4 canonicalization (covers hex/octal/decimal integers)
  const v4 = canonicalizeIpv4(stripped);
  if (v4 !== null) {
    return PRIVATE_IPV4_PATTERNS.some((p) => p.test(v4));
  }

  // IPv6 — match on normalized lowercase
  if (stripped.includes(':')) {
    return PRIVATE_IPV6_PATTERNS.some((p) => p.test(stripped));
  }

  return false;
}

@ValidatorConstraint({ async: false })
export class NoInternalIpConstraint implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments): boolean {
    if (typeof value !== 'string' || value.trim().length === 0) {
      return false;
    }

    let url: URL;
    try {
      url = new URL(value);
    } catch {
      return false;
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    return !isInternalHostname(url.hostname);
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
