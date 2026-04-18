import { PwnedPasswordService } from './pwned-password.service';

describe('PwnedPasswordService', () => {
  let service: PwnedPasswordService;
  const originalFetch = global.fetch;

  beforeEach(() => {
    service = new PwnedPasswordService();
    jest.spyOn(service['logger'], 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns checked=false for empty input without calling fetch', async () => {
    const fetchSpy = jest.fn();
    global.fetch = fetchSpy as any;

    const result = await service.isPwned('');
    expect(result).toEqual({ pwned: false, count: 0, checked: false });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('flags known-breached passwords via SHA-1 suffix match', async () => {
    // SHA-1 of "password" = 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8
    // prefix 5BAA6, suffix 1E4C9B93F3F0682250B6CF8331B7EE68FD8
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => '1E4C9B93F3F0682250B6CF8331B7EE68FD8:12345\nOTHERHASH:2',
    }) as any;

    const result = await service.isPwned('password');
    expect(result.pwned).toBe(true);
    expect(result.count).toBe(12345);
    expect(result.checked).toBe(true);
  });

  it('returns pwned=false when suffix is not in the response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => 'DEADBEEFDEADBEEFDEADBEEFDEADBEEFDEAD:1',
    }) as any;

    const result = await service.isPwned('some-unique-password-xyz-42');
    expect(result.pwned).toBe(false);
    expect(result.checked).toBe(true);
  });

  it('fails open when HIBP returns non-ok status', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      text: async () => '',
    }) as any;

    const result = await service.isPwned('anything');
    expect(result).toEqual({ pwned: false, count: 0, checked: false });
  });

  it('fails open when fetch throws (network error)', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down')) as any;

    const result = await service.isPwned('anything');
    expect(result).toEqual({ pwned: false, count: 0, checked: false });
  });

  it('sends only the first 5 SHA-1 hex chars (k-anonymity)', async () => {
    const fetchSpy = jest.fn().mockResolvedValue({ ok: true, text: async () => '' });
    global.fetch = fetchSpy as any;

    await service.isPwned('password');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const url = fetchSpy.mock.calls[0][0];
    expect(url).toBe('https://api.pwnedpasswords.com/range/5BAA6');
  });
});
