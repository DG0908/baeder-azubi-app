import { NoInternalIpConstraint } from './no-internal-ip.validator';

describe('NoInternalIpConstraint', () => {
  const validator = new NoInternalIpConstraint();
  const mockArgs = {} as any;

  describe('valid public URLs', () => {
    const validUrls = [
      'https://example.com/file.pdf',
      'https://www.google.com/search',
      'http://cdn.example.org/image.png',
      'https://docs.microsoft.com/en-us/',
      'https://smartbaden.de/resource'
    ];

    validUrls.forEach(url => {
      it(`should accept "${url}"`, () => {
        expect(validator.validate(url, mockArgs)).toBe(true);
      });
    });
  });

  describe('invalid internal URLs', () => {
    const invalidUrls = [
      { url: 'http://127.0.0.1:8080/api', reason: 'loopback IPv4' },
      { url: 'http://10.0.0.1/internal', reason: 'private 10.x' },
      { url: 'http://172.16.0.1/admin', reason: 'private 172.16.x' },
      { url: 'http://172.31.255.255/test', reason: 'private 172.31.x' },
      { url: 'http://192.168.1.1/config', reason: 'private 192.168.x' },
      { url: 'http://169.254.169.254/latest', reason: 'AWS metadata' },
      { url: 'http://localhost:3000/api', reason: 'localhost' },
      { url: 'http://metadata.google.internal/', reason: 'GCP metadata' },
      { url: 'ftp://internal.server/file', reason: 'non-http scheme' },
      { url: '', reason: 'empty string' },
      { url: 'not-a-url', reason: 'invalid URL' }
    ];

    invalidUrls.forEach(({ url, reason }) => {
      it(`should reject "${url}" (${reason})`, () => {
        expect(validator.validate(url, mockArgs)).toBe(false);
      });
    });
  });
});
