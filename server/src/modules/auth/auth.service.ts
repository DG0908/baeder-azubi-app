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
import { PrismaService } from '../../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { RegisterDto } from './dto/register.dto';

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

// ─── Account Lockout ──────────────────────────────────────────────────
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // cleanup every 10 min

interface LoginAttemptRecord {
  failedCount: number;
  lockedUntil: number | null;
}

const loginAttempts = new Map<string, LoginAttemptRecord>();

// Periodic cleanup of stale entries
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttempts) {
    if (record.lockedUntil && record.lockedUntil < now && record.failedCount === 0) {
      loginAttempts.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService,
    private readonly mailerService: MailerService
  ) {}

  private checkLockout(email: string): void {
    const record = loginAttempts.get(email);
    if (!record) return;

    if (record.lockedUntil && record.lockedUntil > Date.now()) {
      const minutesLeft = Math.ceil((record.lockedUntil - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Account is temporarily locked. Try again in ${minutesLeft} minute(s).`
      );
    }

    // Lock expired — reset
    if (record.lockedUntil && record.lockedUntil <= Date.now()) {
      record.failedCount = 0;
      record.lockedUntil = null;
    }
  }

  private recordFailedLogin(email: string, request?: Request): void {
    const record = loginAttempts.get(email) || { failedCount: 0, lockedUntil: null };
    record.failedCount += 1;

    if (record.failedCount >= MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;

      // Log the lockout event
      this.auditLogService.write({
        action: 'auth.account_locked',
        entityType: 'user',
        entityId: null,
        metadata: {
          email,
          failedAttempts: record.failedCount,
          lockoutMinutes: LOCKOUT_DURATION_MS / 60000
        },
        request: request ?? ({} as Request)
      }).catch(() => { /* best-effort logging */ });
    }

    loginAttempts.set(email, record);
  }

  private clearFailedLogins(email: string): void {
    loginAttempts.delete(email);
  }

  async register(dto: RegisterDto, request: Request) {
    const email = this.normalizeEmail(dto.email);
    const invitationHash = this.hashInvitationCode(dto.invitationCode);
    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email }
      });

      if (existingUser && !existingUser.isDeleted) {
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
    this.checkLockout(email);

    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.isDeleted) {
      this.recordFailedLogin(email, request);
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
      this.recordFailedLogin(email, request);
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Successful login — clear lockout
    this.clearFailedLogins(email);

    if (user.status !== AccountStatus.APPROVED) {
      throw new ForbiddenException('Account has not been approved for access.');
    }

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
      path: '/api/auth',
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
      path: '/api/auth',
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
