import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountStatus, AppRole } from '@prisma/client';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeUser = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: 'user-1',
  email: 'test@example.com',
  displayName: 'Tester',
  passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$placeholder', // will be replaced in tests
  role: AppRole.AZUBI,
  status: AccountStatus.APPROVED,
  isDeleted: false,
  totpEnabled: false,
  totpSecret: null,
  totpRecoveryCodes: null,
  refreshTokenHash: null,
  organizationId: 'org-1',
  lastLoginAt: null,
  ...overrides,
});

const makeRequest = () =>
  ({ headers: {}, ip: '127.0.0.1', cookies: {} }) as any;

const makeResponse = () => {
  const cookies: Record<string, string> = {};
  return {
    cookie: jest.fn((name: string, value: string) => { cookies[name] = value; }),
    clearCookie: jest.fn((name: string) => { delete cookies[name]; }),
    _cookies: cookies,
  } as any;
};

// ─── Mock factories ───────────────────────────────────────────────────────────

const makePrisma = (userOverride?: Partial<Record<string, unknown>> | null) => {
  const user = userOverride !== undefined ? (userOverride as any) : makeUser();
  return {
    user: {
      findUnique: jest.fn().mockResolvedValue(user),
      update: jest.fn().mockImplementation(({ data }: any) =>
        Promise.resolve({ ...user, ...data })
      ),
      findUniqueOrThrow: jest.fn().mockResolvedValue(user),
    },
    loginAttempt: {
      findUnique: jest.fn().mockResolvedValue(null),
      upsert: jest.fn().mockResolvedValue({ email: user?.email ?? 'test@example.com', failedCount: 1, lockedUntil: null }),
      update: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    trustedDevice: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    refreshToken: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  };
};

const makeJwt = () => ({
  signAsync: jest.fn().mockResolvedValue('mock-token'),
  verifyAsync: jest.fn().mockResolvedValue({ sub: 'user-1', tokenType: 'refresh' }),
});

const makeConfig = () => ({
  get: jest.fn((key: string, fallback?: unknown) => {
    const values: Record<string, string> = {
      JWT_ACCESS_SECRET: 'access-secret',
      JWT_REFRESH_SECRET: 'refresh-secret',
      JWT_ACCESS_TTL: '15m',
      JWT_REFRESH_TTL: '7d',
      APP_COOKIE_DOMAIN: '',
      APP_PUBLIC_URL: 'https://example.com',
      INVITATION_CODE_PEPPER: 'pepper',
      PASSWORD_RESET_TOKEN_PEPPER: 'pepper',
      PASSWORD_RESET_TTL: '30m',
    };
    return values[key] ?? fallback;
  }),
});

const makeAuditLog = () => ({
  write: jest.fn().mockResolvedValue(undefined),
  writeForUser: jest.fn().mockResolvedValue(undefined),
});

const makeMailer = () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
});

const makePwned = () => ({
  isPwned: jest.fn().mockResolvedValue({ pwned: false, count: 0, checked: true }),
});

const makeTotp = () => ({
  isConfigured: jest.fn().mockReturnValue(true),
  generateSecret: jest.fn().mockReturnValue('TOTP_SECRET'),
  generateQrCodeUrl: jest.fn().mockResolvedValue('data:image/png;base64,qr'),
  verifyToken: jest.fn().mockResolvedValue(true),
  encrypt: jest.fn().mockReturnValue('encrypted'),
  decrypt: jest.fn().mockReturnValue('TOTP_SECRET'),
  generateRecoveryCodes: jest.fn().mockReturnValue(['CODE1', 'CODE2']),
  hashRecoveryCode: jest.fn().mockImplementation((c: string) => `hash:${c}`),
});

const buildService = (prisma: ReturnType<typeof makePrisma>, jwt = makeJwt()) =>
  new AuthService(
    prisma as any,
    jwt as unknown as JwtService,
    makeConfig() as any,
    makeAuditLog() as any,
    makeMailer() as any,
    makeTotp() as any,
    makePwned() as any,
  );

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AuthService', () => {

  // ── login ──────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('returns accessToken and sets refresh cookie on valid credentials', async () => {
      const hash = await argon2.hash('correct-password');
      const prisma = makePrisma({ ...makeUser(), passwordHash: hash });
      const service = buildService(prisma);
      const res = makeResponse();

      const result = await service.login(
        { email: 'test@example.com', password: 'correct-password' },
        res,
        makeRequest(),
      );

      expect(result).toHaveProperty('accessToken');
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.any(String),
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('throws UnauthorizedException on wrong password', async () => {
      const hash = await argon2.hash('correct-password');
      const prisma = makePrisma({ ...makeUser(), passwordHash: hash });
      const service = buildService(prisma);

      await expect(
        service.login(
          { email: 'test@example.com', password: 'wrong-password' },
          makeResponse(),
          makeRequest(),
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when user not found (no user enumeration)', async () => {
      const prisma = makePrisma(null);
      prisma.user.findUnique.mockResolvedValue(null);
      const service = buildService(prisma);

      await expect(
        service.login(
          { email: 'nobody@example.com', password: 'anything' },
          makeResponse(),
          makeRequest(),
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when user is deleted', async () => {
      const hash = await argon2.hash('correct-password');
      const prisma = makePrisma({ ...makeUser(), passwordHash: hash, isDeleted: true });
      const service = buildService(prisma);

      await expect(
        service.login(
          { email: 'test@example.com', password: 'correct-password' },
          makeResponse(),
          makeRequest(),
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws ForbiddenException when account is not approved', async () => {
      const hash = await argon2.hash('correct-password');
      const prisma = makePrisma({ ...makeUser(), passwordHash: hash, status: AccountStatus.PENDING });
      const service = buildService(prisma);

      await expect(
        service.login(
          { email: 'test@example.com', password: 'correct-password' },
          makeResponse(),
          makeRequest(),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws UnauthorizedException when account is locked', async () => {
      const hash = await argon2.hash('correct-password');
      const prisma = makePrisma({ ...makeUser(), passwordHash: hash });
      // Simulate active lockout
      const lockedUntil = new Date(Date.now() + 10 * 60 * 1000);
      prisma.loginAttempt.findUnique.mockResolvedValue({
        email: 'test@example.com',
        failedCount: 5,
        lockedUntil,
      });
      const service = buildService(prisma);

      await expect(
        service.login(
          { email: 'test@example.com', password: 'correct-password' },
          makeResponse(),
          makeRequest(),
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('records failed login attempt on wrong password', async () => {
      const hash = await argon2.hash('correct-password');
      const prisma = makePrisma({ ...makeUser(), passwordHash: hash });
      const service = buildService(prisma);

      await service.login(
        { email: 'test@example.com', password: 'wrong-password' },
        makeResponse(),
        makeRequest(),
      ).catch(() => {});

      expect(prisma.loginAttempt.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: 'test@example.com' },
        }),
      );
    });

    it('clears failed login attempts on successful login', async () => {
      const hash = await argon2.hash('correct-password');
      const prisma = makePrisma({ ...makeUser(), passwordHash: hash });
      const service = buildService(prisma);

      await service.login(
        { email: 'test@example.com', password: 'correct-password' },
        makeResponse(),
        makeRequest(),
      );

      expect(prisma.loginAttempt.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { email: 'test@example.com' } }),
      );
    });
  });

  // ── refreshSession ─────────────────────────────────────────────────────────

  describe('refreshSession', () => {
    it('throws UnauthorizedException when no refresh token provided', async () => {
      const prisma = makePrisma();
      const service = buildService(prisma);

      await expect(
        service.refreshSession(undefined, makeResponse()),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when refresh token is invalid JWT', async () => {
      const prisma = makePrisma();
      const jwt = makeJwt();
      jwt.verifyAsync.mockRejectedValue(new Error('jwt malformed'));
      const service = buildService(prisma, jwt);

      await expect(
        service.refreshSession('bad-token', makeResponse()),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when refresh token hash does not match stored hash', async () => {
      // refreshTokenHash in DB does not match the token (argon2 verify will fail)
      const prisma = makePrisma({
        ...makeUser(),
        refreshTokenHash: await argon2.hash('other-token'),
      });
      const jwt = makeJwt();
      jwt.verifyAsync.mockResolvedValue({ sub: 'user-1', tokenType: 'refresh' });
      const service = buildService(prisma, jwt);

      await expect(
        service.refreshSession('wrong-token', makeResponse()),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns new accessToken and sets cookie on valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const prisma = makePrisma({
        ...makeUser(),
        refreshTokenHash: await argon2.hash(refreshToken),
      });
      const jwt = makeJwt();
      jwt.verifyAsync.mockResolvedValue({ sub: 'user-1', tokenType: 'refresh' });
      const service = buildService(prisma, jwt);
      const res = makeResponse();

      const result = await service.refreshSession(refreshToken, res);

      expect(result).toHaveProperty('accessToken');
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.any(String),
        expect.objectContaining({ httpOnly: true }),
      );
    });
  });

  // ── logout ─────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('clears refresh token hash in DB and clears cookie', async () => {
      const prisma = makePrisma();
      const service = buildService(prisma);
      const res = makeResponse();
      const actor = {
        id: 'user-1',
        email: 'test@example.com',
        displayName: 'Tester',
        role: AppRole.AZUBI,
        status: AccountStatus.APPROVED,
        organizationId: 'org-1',
        canSignReports: false,
      };

      await service.logout(actor, res);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ refreshTokenHash: null }),
        }),
      );
      expect(res.clearCookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.any(Object),
      );
    });
  });

  // ── lockout escalation ─────────────────────────────────────────────────────

  describe('lockout escalation', () => {
    it('locks account after MAX_FAILED_ATTEMPTS wrong passwords', async () => {
      const hash = await argon2.hash('correct-password');
      const prisma = makePrisma({ ...makeUser(), passwordHash: hash });
      // Simulate the 5th failed attempt being recorded
      prisma.loginAttempt.upsert.mockResolvedValue({
        email: 'test@example.com',
        failedCount: 5,
        lockedUntil: null,
      });
      const service = buildService(prisma);

      await service.login(
        { email: 'test@example.com', password: 'wrong-password' },
        makeResponse(),
        makeRequest(),
      ).catch(() => {});

      // Should call update to set lockedUntil after reaching threshold
      expect(prisma.loginAttempt.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ lockedUntil: expect.any(Date) }),
        }),
      );
    });

    it('resets expired lockout on next checkLockout call', async () => {
      const hash = await argon2.hash('correct-password');
      const expiredLock = new Date(Date.now() - 1000); // already past
      const prisma = makePrisma({ ...makeUser(), passwordHash: hash });
      prisma.loginAttempt.findUnique.mockResolvedValue({
        email: 'test@example.com',
        failedCount: 5,
        lockedUntil: expiredLock,
      });
      const service = buildService(prisma);
      const res = makeResponse();

      // Should NOT throw — lock is expired
      const result = await service.login(
        { email: 'test@example.com', password: 'correct-password' },
        res,
        makeRequest(),
      );

      expect(result).toHaveProperty('accessToken');
      // Should reset the failed count
      expect(prisma.loginAttempt.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ failedCount: 0, lockedUntil: null }),
        }),
      );
    });
  });

  // ── normalizeEmail ─────────────────────────────────────────────────────────

  describe('email normalisation', () => {
    it('looks up email in lower-case regardless of input casing', async () => {
      const hash = await argon2.hash('pw');
      const prisma = makePrisma({ ...makeUser(), passwordHash: hash });
      const service = buildService(prisma);

      await service.login(
        { email: '  Test@Example.COM  ', password: 'pw' },
        makeResponse(),
        makeRequest(),
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { email: 'test@example.com' } }),
      );
    });
  });
});
