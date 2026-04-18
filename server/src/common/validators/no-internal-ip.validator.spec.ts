import { NoInternalIpConstraint, isInternalHostname } from './no-internal-ip.validator';

describe('NoInternalIpConstraint', () => {
  const validator = new NoInternalIpConstraint();
  const mockArgs = {} as any;

  describe('valid public URLs', () => {
    const validUrls = [
      'https://example.com/file.pdf',
      'https://www.google.com/search',
      'http://cdn.example.org/image.png',
      'https://docs.microsoft.com/en-us/',
      'https://smartbaden.de/resource',
      'https://fcm.googleapis.com/fcm/send/abc123',
      'https://8.8.8.8/dns'
    ];

    validUrls.forEach((url) => {
      it(`akzeptiert "${url}"`, () => {
        expect(validator.validate(url, mockArgs)).toBe(true);
      });
    });
  });

  describe('invalid internal URLs — plain notations', () => {
    const invalidUrls = [
      { url: 'http://127.0.0.1:8080/api', reason: 'loopback IPv4' },
      { url: 'http://0.0.0.0/foo', reason: '0.0.0.0 (unspecified)' },
      { url: 'http://10.0.0.1/internal', reason: 'private 10.x' },
      { url: 'http://172.16.0.1/admin', reason: 'private 172.16.x' },
      { url: 'http://172.31.255.255/test', reason: 'private 172.31.x' },
      { url: 'http://192.168.1.1/config', reason: 'private 192.168.x' },
      { url: 'http://169.254.169.254/latest', reason: 'AWS metadata' },
      { url: 'http://100.64.0.1/cgn', reason: 'CGNAT 100.64/10' },
      { url: 'http://localhost:3000/api', reason: 'localhost' },
      { url: 'http://metadata.google.internal/', reason: 'GCP metadata' },
      { url: 'http://metadata/token', reason: 'Azure metadata short name' },
      { url: 'http://api.local/x', reason: '.local TLD' },
      { url: 'http://svc.internal/x', reason: '.internal TLD' },
      { url: 'ftp://internal.server/file', reason: 'non-http scheme' },
      { url: 'file:///etc/passwd', reason: 'file scheme' },
      { url: '', reason: 'empty string' },
      { url: 'not-a-url', reason: 'invalid URL' }
    ];

    invalidUrls.forEach(({ url, reason }) => {
      it(`blockt "${url}" (${reason})`, () => {
        expect(validator.validate(url, mockArgs)).toBe(false);
      });
    });
  });

  describe('invalid internal URLs — obfuscated IPv4 notations', () => {
    const obfuscated = [
      { url: 'http://0x7f.0x0.0x0.0x1/', reason: 'hex per octet' },
      { url: 'http://0x7f000001/', reason: 'hex 32-bit integer' },
      { url: 'http://2130706433/', reason: 'decimal 32-bit integer (127.0.0.1)' },
      { url: 'http://0177.0.0.1/', reason: 'octal first octet' },
      { url: 'http://017700000001/', reason: 'octal 32-bit integer' }
    ];

    obfuscated.forEach(({ url, reason }) => {
      it(`blockt "${url}" (${reason})`, () => {
        expect(validator.validate(url, mockArgs)).toBe(false);
      });
    });
  });

  describe('invalid internal URLs — IPv6', () => {
    const ipv6 = [
      { url: 'http://[::1]/api', reason: 'IPv6 loopback' },
      { url: 'http://[::]/api', reason: 'IPv6 unspecified' },
      { url: 'http://[::ffff:127.0.0.1]/api', reason: 'IPv4-mapped IPv6' },
      { url: 'http://[fc00::1]/x', reason: 'IPv6 unique-local fc' },
      { url: 'http://[fd12:3456::1]/x', reason: 'IPv6 unique-local fd' },
      { url: 'http://[fe80::1]/x', reason: 'IPv6 link-local' }
    ];

    ipv6.forEach(({ url, reason }) => {
      it(`blockt "${url}" (${reason})`, () => {
        expect(validator.validate(url, mockArgs)).toBe(false);
      });
    });
  });

  describe('isInternalHostname (Unit)', () => {
    it('akzeptiert leere Strings als intern (defensive)', () => {
      expect(isInternalHostname('')).toBe(true);
      expect(isInternalHostname('   ')).toBe(true);
    });

    it('ist case-insensitive', () => {
      expect(isInternalHostname('LOCALHOST')).toBe(true);
      expect(isInternalHostname('Metadata.Google.Internal')).toBe(true);
    });
  });
});
