import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccountStatus, Prisma, User } from '@prisma/client';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { MailerService } from '../../common/services/mailer.service';
import { PwnedPasswordService } from '../../common/services/pwned-password.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { RegisterDto } from './dto/register.dto';
import { TotpAuthenticateDto } from './dto/totp-authenticate.dto';
import { TotpService } from './totp.service';

const authUserSelect = {
  id: true,
  email: true,
  displayName: true,
  avatar: true,
  company: true,
  birthDate: true,
  role: true,
  status: true,
  canSignReports: true,
  reportBookProfile: true,
  organizationId: true,
  organization: {
    select: {
      id: true,
      name: true,
      slug: true
    }
  },
  trainingEnd: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true
} satisfies Prisma.UserSelect;

type RefreshJwtPayload = {
  sub: string;
  tokenType: 'refresh';
};

type TotpPendingJwtPayload = {
  sub: string;
  tokenType: 'totp_pending';
};

type TotpSetupJwtPayload = {
  sub: string;
  secret: string;
  tokenType: 'totp_setup';
};

type TotpRecoveryCodeRecord = {
  hash: string;
  usedAt: string | null;
};

// ─── Account Lockout ──────────────────────────────────────────────────
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const RECOVERY_CODE_COUNT = 8;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService,
    private readonly mailerService: MailerService,
    private readonly totpService: TotpService,
    private readonly pwnedPasswordService: PwnedPasswordService
  ) {}

  private async assertPasswordNotPwned(password: string): Promise<void> {
    const result = await this.pwnedPasswordService.isPwned(password);
    if (result.pwned) {
      throw new BadRequestException(
        'This password appears in known data breaches. Please choose a different one.'
      );
    }
  }

  private async checkLockout(email: string): Promise<void> {
    const record = await this.prisma.loginAttempt.findUnique({ where: { email } });
    if (!record) return;

    if (record.lockedUntil && record.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((record.lockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Account is temporarily locked. Try again in ${minutesLeft} minute(s).`
      );
    }

    // Lock expired — reset
    if (record.lockedUntil && record.lockedUntil <= new Date()) {
      await this.prisma.loginAttempt.update({
        where: { email },
        data: { failedCount: 0, lockedUntil: null }
      });
    }
  }

  private async recordFailedLogin(email: string, request?: Request): Promise<void> {
    const record = await this.prisma.loginAttempt.upsert({
      where: { email },
      create: { email, failedCount: 1, lockedUntil: null },
      update: { failedCount: { increment: 1 } }
    });

    if (record.failedCount >= MAX_FAILED_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
      await this.prisma.loginAttempt.update({
        where: { email },
        data: { lockedUntil }
      });

      this.auditLogService.write({
        action: 'auth.account_locked',
        entityType: 'user',
        entityId: null,
        metadata: { email, failedAttempts: record.failedCount, lockoutMinutes: LOCKOUT_DURATION_MS / 60000 },
        request: request ?? ({} as Request)
      }).catch(() => { /* best-effort logging */ });
    }
  }

  private async clearFailedLogins(email: string): Promise<void> {
    await this.prisma.loginAttempt.deleteMany({ where: { email } });
  }

  private assertAdminRole(actor: AuthenticatedUser): void {
    if (actor.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can manage two-factor authentication.');
    }
  }

  private parseTotpRecoveryCodes(value: Prisma.JsonValue | null | undefined): TotpRecoveryCodeRecord[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((entry) => {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
          return null;
        }

        const hash = 'hash' in entry && typeof entry.hash === 'string' ? entry.hash : '';
        const usedAt = 'usedAt' in entry && typeof entry.usedAt === 'string' ? entry.usedAt : null;

        return {
          hash,
          usedAt
        };
      })
      .filter((entry): entry is TotpRecoveryCodeRecord => Boolean(entry?.hash));
  }

  private countUnusedRecoveryCodes(value: Prisma.JsonValue | null | undefined): number {
    return this.parseTotpRecoveryCodes(value).filter((entry) => !entry.usedAt).length;
  }

  private buildRecoveryCodes() {
    const recoveryCodes = this.totpService.generateRecoveryCodes(RECOVERY_CODE_COUNT);
    const storedRecoveryCodes = recoveryCodes.map((code) => ({
      hash: this.totpService.hashRecoveryCode(code),
      usedAt: null
    }));

    return {
      recoveryCodes,
      storedRecoveryCodes
    };
  }

  private async verifyPassword(user: Pick<User, 'passwordHash'>, password: string): Promise<boolean> {
    const isBcryptHash = user.passwordHash.startsWith('$2');

    try {
      return isBcryptHash
        ? await bcrypt.compare(password, user.passwordHash)
        : await argon2.verify(user.passwordHash, password);
    } catch {
      return false;
    }
  }

  async register(dto: RegisterDto, request: Request) {
    const email = this.normalizeEmail(dto.email);
    const invitationHash = this.hashInvitationCode(dto.invitationCode);
    await this.assertPasswordNotPwned(dto.password);
    const passwordHash = await argon2.hash(dto.password);
    let user;
    try {
      user = await this.prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
          where: { email }
        });

        if (existingUser) {
          throw new ConflictException('Email is already registered.');
        }

        const invitation = await tx.invitationCode.findUnique({
          where: { codeHash: invitationHash }
        });

        if (!invitation || invitation.revokedAt) {
          throw new BadRequestException('Invitation code is invalid.');
        }

        if (invitation.expiresAt && invitation.expiresAt < new Date()) {
          throw new BadRequestException('Invitation code has expired.');
        }

        if (invitation.maxUses > 0 && invitation.usedCount >= invitation.maxUses) {
          throw new BadRequestException('Invitation code has been exhausted.');
        }

        const createdUser = await tx.user.create({
          data: {
            email,
            displayName: dto.displayName.trim(),
            passwordHash,
            role: invitation.role,
            status: AccountStatus.PENDING,
            organizationId: invitation.organizationId,
            trainingEnd: dto.trainingEnd ? new Date(dto.trainingEnd) : null
          },
          select: authUserSelect
        });

        await tx.invitationCode.update({
          where: { id: invitation.id },
          data: {
            usedCount: {
              increment: 1
            }
          }
        });

        return createdUser;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError
        && error.code === 'P2002'
        && Array.isArray(error.meta?.target)
        && error.meta.target.includes('email')
      ) {
        throw new ConflictException('Email is already registered.');
      }

      throw error;
    }

    await this.auditLogService.write({
      action: 'auth.register',
      entityType: 'user',
      entityId: user.id,
      metadata: {
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      },
      request
    });

    return {
      message: 'Registration submitted. An administrator must approve the account.',
      user
    };
  }

  async login(dto: LoginDto, response: Response, request: Request) {
    const email = this.normalizeEmail(dto.email);

    // Check if account is locked out
    await this.checkLockout(email);

    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.isDeleted) {
      await this.recordFailedLogin(email, request);
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Try Argon2 first, then bcrypt fallback (for migrated Supabase users)
    let passwordMatches = false;
    const isBcryptHash = user.passwordHash.startsWith('$2');
    if (isBcryptHash) {
      passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
      if (passwordMatches) {
        // Re-hash with Argon2 for future logins
        const argon2Hash = await argon2.hash(dto.password);
        await this.prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: argon2Hash }
        });
      }
    } else {
      try {
        passwordMatches = await argon2.verify(user.passwordHash, dto.password);
      } catch {
        passwordMatches = false;
      }
    }
    if (!passwordMatches) {
      await this.recordFailedLogin(email, request);
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Successful login — clear lockout
    if (user.status !== AccountStatus.APPROVED) {
      await this.clearFailedLogins(email);
      throw new ForbiddenException('Account has not been approved for access.');
    }

    // If TOTP is enabled, check if the device is already trusted
    if (user.totpEnabled) {
      // Check if there are 3+ recent failed attempts — if so, require TOTP even on trusted device
      const recentAttempts = await this.prisma.loginAttempt.findUnique({ where: { email } });
      const hasRecentFailures = recentAttempts && recentAttempts.failedCount >= 3;

      const deviceTrusted = !hasRecentFailures && await this.isDeviceTrusted(user.id, request);

      if (!deviceTrusted) {
        const totpToken = await this.jwtService.signAsync(
          { sub: user.id, tokenType: 'totp_pending' },
          {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET')!,
            expiresIn: '5m' as any
          }
        );
        return { requiresTotp: true, totpToken };
      }
      // Device is trusted — fall through to normal token issuance
    }

    await this.clearFailedLogins(email);

    const tokens = await this.issueTokens(user);
    await this.persistRefreshToken(user.id, tokens.refreshToken);

    const safeUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date()
      },
      select: authUserSelect
    });

    this.setRefreshCookie(response, tokens.refreshToken);

    await this.auditLogService.writeForUser(
      user,
      'auth.login',
      'user',
      user.id,
      { email: safeUser.email },
      request
    );

    return {
      accessToken: tokens.accessToken,
      user: safeUser
    };
  }

  async refreshSession(refreshToken: string | undefined, response: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    let payload: RefreshJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<RefreshJwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')
      });
    } catch {
      throw new UnauthorizedException('Refresh token is invalid.');
    }

    if (!payload?.sub || payload.tokenType !== 'refresh') {
      throw new UnauthorizedException('Refresh token is invalid.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }
    });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Account is not available.');
    }

    if (user.status !== AccountStatus.APPROVED) {
      throw new ForbiddenException('Account has not been approved for access.');
    }

    if (!user.refreshTokenHash || !(await argon2.verify(user.refreshTokenHash, refreshToken))) {
      throw new UnauthorizedException('Refresh token is invalid.');
    }

    const tokens = await this.issueTokens(user);
    await this.persistRefreshToken(user.id, tokens.refreshToken);
    this.setRefreshCookie(response, tokens.refreshToken);

    const safeUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: authUserSelect
    });

    return {
      accessToken: tokens.accessToken,
      user: safeUser
    };
  }

  async logout(user: AuthenticatedUser, response: Response) {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: null
      }
    });

    this.clearRefreshCookie(response);
    return { message: 'Logged out.' };
  }

  async me(user: AuthenticatedUser) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: authUserSelect
    });
  }

  async getTotpStatus(actor: AuthenticatedUser) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: actor.id },
      select: {
        totpEnabled: true,
        totpRecoveryCodes: true
      }
    });
    return {
      totpEnabled: user.totpEnabled,
      recoveryCodesRemaining: this.countUnusedRecoveryCodes(user.totpRecoveryCodes)
    };
  }

  async generateTotpSetup(actor: AuthenticatedUser, request: Request) {
    if (!this.totpService.isConfigured()) {
      throw new ServiceUnavailableException('Two-factor authentication is not configured on this server.');
    }

    this.assertAdminRole(actor);

    const currentUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: actor.id },
      select: {
        email: true,
        totpEnabled: true
      }
    });

    if (currentUser.totpEnabled) {
      throw new ConflictException('Two-factor authentication is already enabled.');
    }

    const secret = this.totpService.generateSecret();
    const qrCode = await this.totpService.generateQrCodeUrl(currentUser.email, secret);

    const setupToken = await this.jwtService.signAsync(
      { sub: actor.id, secret, tokenType: 'totp_setup' },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET')!,
        expiresIn: '10m' as any
      }
    );

    await this.auditLogService.writeForUser(
      actor,
      'auth.2fa.setup_requested',
      'user',
      actor.id,
      {},
      request
    );

    return { qrCode, setupToken };
  }

  async enableTotp(actor: AuthenticatedUser, setupToken: string, code: string, request: Request) {
    this.assertAdminRole(actor);

    let payload: TotpSetupJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<TotpSetupJwtPayload>(setupToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET')
      });
    } catch {
      throw new UnauthorizedException('Setup token is invalid or expired.');
    }

    if (payload.tokenType !== 'totp_setup' || payload.sub !== actor.id) {
      throw new UnauthorizedException('Setup token is invalid.');
    }

    const isValid = await this.totpService.verifyToken(code, payload.secret);
    if (!isValid) {
      throw new UnauthorizedException('Invalid TOTP code.');
    }

    const encryptedSecret = this.totpService.encrypt(payload.secret);
    const { recoveryCodes, storedRecoveryCodes } = this.buildRecoveryCodes();

    await this.prisma.user.update({
      where: { id: actor.id },
      data: {
        totpSecret: encryptedSecret,
        totpEnabled: true,
        totpRecoveryCodes: storedRecoveryCodes
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'auth.2fa.enabled',
      'user',
      actor.id,
      { recoveryCodeCount: recoveryCodes.length },
      request
    );

    return {
      message: 'Two-factor authentication enabled.',
      recoveryCodes
    };
  }

  async disableTotp(actor: AuthenticatedUser, password: string, request: Request) {
    this.assertAdminRole(actor);

    const user = await this.prisma.user.findUnique({ where: { id: actor.id } });
    if (!user) throw new UnauthorizedException('Account not found.');

    if (!(await this.verifyPassword(user, password))) {
      throw new UnauthorizedException('Password is incorrect.');
    }

    await this.prisma.user.update({
      where: { id: actor.id },
      data: {
        totpSecret: null,
        totpEnabled: false,
        totpRecoveryCodes: Prisma.JsonNull
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'auth.2fa.disabled',
      'user',
      actor.id,
      {},
      request
    );

    return { message: 'Two-factor authentication disabled.' };
  }

  async regenerateTotpRecoveryCodes(actor: AuthenticatedUser, password: string, request: Request) {
    this.assertAdminRole(actor);

    const user = await this.prisma.user.findUnique({
      where: { id: actor.id },
      select: {
        id: true,
        passwordHash: true,
        totpEnabled: true,
        totpSecret: true
      }
    });

    if (!user) {
      throw new UnauthorizedException('Account not found.');
    }

    if (!user.totpEnabled || !user.totpSecret) {
      throw new BadRequestException('Two-factor authentication is not enabled.');
    }

    if (!(await this.verifyPassword(user, password))) {
      throw new UnauthorizedException('Password is incorrect.');
    }

    const { recoveryCodes, storedRecoveryCodes } = this.buildRecoveryCodes();

    await this.prisma.user.update({
      where: { id: actor.id },
      data: {
        totpRecoveryCodes: storedRecoveryCodes
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'auth.2fa.recovery_codes_regenerated',
      'user',
      actor.id,
      { recoveryCodeCount: recoveryCodes.length },
      request
    );

    return {
      recoveryCodes,
      recoveryCodesRemaining: recoveryCodes.length
    };
  }

  async authenticateWithTotp(dto: TotpAuthenticateDto, response: Response, request: Request) {
    let payload: TotpPendingJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<TotpPendingJwtPayload>(dto.totpToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET')
      });
    } catch {
      throw new UnauthorizedException('TOTP session token is invalid or expired.');
    }

    if (payload.tokenType !== 'totp_pending') {
      throw new UnauthorizedException('TOTP session token is invalid.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Account is not available.');
    }

    await this.checkLockout(user.email);

    if (user.status !== AccountStatus.APPROVED) {
      throw new ForbiddenException('Account has not been approved for access.');
    }

    if (!user.totpEnabled || !user.totpSecret) {
      throw new UnauthorizedException('Two-factor authentication is not enabled for this account.');
    }

    const trimmedCode = String(dto.code || '').trim();
    const trimmedRecoveryCode = String(dto.recoveryCode || '').trim();
    const usesRecoveryCode = trimmedRecoveryCode.length > 0;

    if (!trimmedCode && !trimmedRecoveryCode) {
      throw new BadRequestException('Authentication code is required.');
    }

    let nextRecoveryCodes: TotpRecoveryCodeRecord[] | null = null;
    let isValid = false;
    let auditAction = 'auth.login.totp';

    if (usesRecoveryCode) {
      const recoveryCodes = this.parseTotpRecoveryCodes(user.totpRecoveryCodes);
      const recoveryCodeHash = this.totpService.hashRecoveryCode(trimmedRecoveryCode);
      const recoveryCodeIndex = recoveryCodes.findIndex(
        (entry) => !entry.usedAt && entry.hash === recoveryCodeHash
      );

      if (recoveryCodeIndex >= 0) {
        recoveryCodes[recoveryCodeIndex] = {
          ...recoveryCodes[recoveryCodeIndex],
          usedAt: new Date().toISOString()
        };
        nextRecoveryCodes = recoveryCodes;
        isValid = true;
        auditAction = 'auth.login.recovery_code';
      }
    } else {
      const plainSecret = this.totpService.decrypt(user.totpSecret);
      isValid = await this.totpService.verifyToken(trimmedCode, plainSecret);
    }

    if (!isValid) {
      await this.recordFailedLogin(user.email, request);
      throw new UnauthorizedException('Invalid authentication code.');
    }

    await this.clearFailedLogins(user.email);

    const tokens = await this.issueTokens(user);
    await this.persistRefreshToken(user.id, tokens.refreshToken);

    const safeUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        ...(usesRecoveryCode && nextRecoveryCodes ? { totpRecoveryCodes: nextRecoveryCodes } : {})
      },
      select: authUserSelect
    });

    this.setRefreshCookie(response, tokens.refreshToken);
    await this.setDeviceTrusted(user.id, request, response);

    await this.auditLogService.writeForUser(
      user,
      auditAction,
      'user',
      user.id,
      usesRecoveryCode
        ? {
            email: safeUser.email,
            recoveryCodesRemaining: this.countUnusedRecoveryCodes(nextRecoveryCodes ?? [])
          }
        : { email: safeUser.email },
      request
    );

    return { accessToken: tokens.accessToken, user: safeUser };
  }

  async changePassword(
    user: AuthenticatedUser,
    dto: ChangePasswordDto,
    response: Response,
    request: Request
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!existingUser) {
      throw new UnauthorizedException('Account not found.');
    }

    const isBcryptHash = existingUser.passwordHash.startsWith('$2');
    let passwordMatches = false;
    try {
      passwordMatches = isBcryptHash
        ? await bcrypt.compare(dto.currentPassword, existingUser.passwordHash)
        : await argon2.verify(existingUser.passwordHash, dto.currentPassword);
    } catch {
      passwordMatches = false;
    }
    if (!passwordMatches) {
      throw new UnauthorizedException('Current password is invalid.');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password must differ from the current password.');
    }

    await this.assertPasswordNotPwned(dto.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await argon2.hash(dto.newPassword),
        refreshTokenHash: null
      }
    });

    this.clearRefreshCookie(response);

    await this.auditLogService.writeForUser(
      existingUser,
      'auth.password_changed',
      'user',
      user.id,
      {},
      request
    );

    return {
      message: 'Password updated. Please sign in again.'
    };
  }

  async requestPasswordReset(dto: RequestPasswordResetDto, request: Request) {
    const email = this.normalizeEmail(dto.email);
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.isDeleted || user.status === AccountStatus.DISABLED) {
      await this.auditLogService.write({
        action: 'auth.password_reset.request_ignored',
        entityType: 'user',
        entityId: null,
        metadata: {
          email
        },
        request
      });

      return {
        message:
          'If the account exists and is eligible, a password reset link has been sent.'
      };
    }

    const plainToken = this.generatePasswordResetToken();
    const expiresAt = new Date(Date.now() + this.ttlToMilliseconds(
      this.configService.get<string>('PASSWORD_RESET_TTL', '30m')
    ));

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.passwordResetToken.deleteMany({
          where: { userId: user.id }
        });

        await tx.passwordResetToken.create({
          data: {
            userId: user.id,
            tokenHash: this.hashPasswordResetToken(plainToken),
            expiresAt
          }
        });
      });

      await this.mailerService.sendPasswordResetEmail({
        email: user.email,
        displayName: user.displayName,
        resetUrl: this.buildPasswordResetUrl(plainToken),
        expiresInMinutes: Math.max(1, Math.round((expiresAt.getTime() - Date.now()) / 60000))
      });
    } catch (error) {
      await this.prisma.passwordResetToken.deleteMany({
        where: { userId: user.id }
      });

      await this.auditLogService.writeForUser(
        user,
        'auth.password_reset.request_failed',
        'user',
        user.id,
        {
          message: error instanceof Error ? error.message : 'unknown error'
        },
        request
      );

      if (error instanceof ServiceUnavailableException) {
        throw error;
      }

      throw new ServiceUnavailableException('Password reset request could not be processed.');
    }

    await this.auditLogService.writeForUser(
      user,
      'auth.password_reset.requested',
      'user',
      user.id,
      {},
      request
    );

    return {
      message:
        'If the account exists and is eligible, a password reset link has been sent.'
    };
  }

  async confirmPasswordReset(
    dto: ConfirmPasswordResetDto,
    response: Response,
    request: Request
  ) {
    const tokenHash = this.hashPasswordResetToken(dto.token);
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: {
        user: true
      }
    });

    if (
      !resetToken
      || resetToken.consumedAt
      || resetToken.expiresAt < new Date()
      || resetToken.user.isDeleted
      || resetToken.user.status === AccountStatus.DISABLED
    ) {
      throw new BadRequestException('Password reset token is invalid or expired.');
    }

    await this.assertPasswordNotPwned(dto.newPassword);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetToken.userId },
        data: {
          passwordHash: await argon2.hash(dto.newPassword),
          refreshTokenHash: null
        }
      });

      await tx.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          consumedAt: null
        },
        data: {
          consumedAt: new Date()
        }
      });
    });

    this.clearRefreshCookie(response);

    await this.auditLogService.writeForUser(
      resetToken.user,
      'auth.password_reset.completed',
      'user',
      resetToken.userId,
      {},
      request
    );

    return {
      message: 'Password updated. Please sign in with the new password.'
    };
  }

  private async isDeviceTrusted(userId: string, request: Request): Promise<boolean> {
    const rawToken = request.cookies?.trusted_device;
    if (!rawToken) return false;

    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const device = await this.prisma.trustedDevice.findUnique({
      where: { tokenHash }
    });

    if (!device) return false;
    if (device.userId !== userId) return false;
    if (device.expiresAt < new Date()) {
      // Clean up expired token
      await this.prisma.trustedDevice.delete({ where: { tokenHash } }).catch(() => {});
      return false;
    }

    // Update lastUsedAt
    await this.prisma.trustedDevice.update({
      where: { tokenHash },
      data: { lastUsedAt: new Date() }
    }).catch(() => {});

    return true;
  }

  private async setDeviceTrusted(userId: string, request: Request, response: Response): Promise<void> {
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const userAgent = String(request.headers?.['user-agent'] || '').slice(0, 500);
    const cookieDomain = String(this.configService.get<string>('APP_COOKIE_DOMAIN', '')).trim();

    // Clean up expired devices for this user (housekeeping)
    await this.prisma.trustedDevice.deleteMany({
      where: { userId, expiresAt: { lt: new Date() } }
    }).catch(() => {});

    await this.prisma.trustedDevice.create({
      data: { userId, tokenHash, userAgent, expiresAt }
    });

    response.cookie('trusted_device', rawToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/api',
      domain: cookieDomain || undefined,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }

  private normalizeEmail(value: string): string {
    return value.trim().toLowerCase();
  }

  private hashInvitationCode(code: string): string {
    const pepper = this.configService.get<string>('INVITATION_CODE_PEPPER');
    return createHash('sha256').update(`${code.trim().toUpperCase()}:${pepper}`).digest('hex');
  }

  private generatePasswordResetToken(): string {
    return randomBytes(32).toString('base64url');
  }

  private hashPasswordResetToken(token: string): string {
    const pepper = this.configService.get<string>('PASSWORD_RESET_TOKEN_PEPPER');
    return createHash('sha256').update(`${token.trim()}:${pepper}`).digest('hex');
  }

  private buildPasswordResetUrl(token: string): string {
    const appPublicUrl = String(this.configService.get<string>('APP_PUBLIC_URL', '')).trim();
    const url = new URL(appPublicUrl);
    url.searchParams.set('password_reset_token', token);
    return url.toString();
  }

  private async issueTokens(user: Pick<User, 'id'>) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        tokenType: 'access'
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET')!,
        expiresIn: this.configService.get<string>('JWT_ACCESS_TTL')! as any
      }
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        tokenType: 'refresh'
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
        expiresIn: this.configService.get<string>('JWT_REFRESH_TTL')! as any
      }
    );

    return { accessToken, refreshToken };
  }

  private async persistRefreshToken(userId: string, refreshToken: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash: await argon2.hash(refreshToken)
      }
    });
  }

  private setRefreshCookie(response: Response, refreshToken: string) {
    const cookieDomain = String(this.configService.get<string>('APP_COOKIE_DOMAIN', '')).trim();

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/api',
      domain: cookieDomain || undefined,
      maxAge: this.ttlToMilliseconds(this.configService.get<string>('JWT_REFRESH_TTL', '7d'))
    });
  }

  private clearRefreshCookie(response: Response) {
    const cookieDomain = String(this.configService.get<string>('APP_COOKIE_DOMAIN', '')).trim();
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/api',
      domain: cookieDomain || undefined
    });
  }

  private ttlToMilliseconds(ttl: string): number {
    const match = /^(\d+)(ms|s|m|h|d)$/.exec(ttl.trim());
    if (!match) {
      return 7 * 24 * 60 * 60 * 1000;
    }

    const value = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      ms: 1,
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000
    };

    return value * multipliers[unit];
  }
}
