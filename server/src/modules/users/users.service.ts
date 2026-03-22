import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AccountStatus, AppRole, Prisma } from '@prisma/client';
import { Request } from 'express';
import sanitizeHtml from 'sanitize-html';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ApproveUserDto } from './dto/approve-user.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

const currentUserSelect = {
  id: true,
  email: true,
  displayName: true,
  avatar: true,
  company: true,
  birthDate: true,
  role: true,
  status: true,
  canSignReports: true,
  canViewSchoolCards: true,
  canViewExamGrades: true,
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
  lastLoginAt: true,
  reportBookProfile: true
} satisfies Prisma.UserSelect;

const adminUserSelect = {
  id: true,
  email: true,
  displayName: true,
  avatar: true,
  company: true,
  birthDate: true,
  role: true,
  status: true,
  canSignReports: true,
  canViewSchoolCards: true,
  canViewExamGrades: true,
  organizationId: true,
  organization: {
    select: {
      id: true,
      name: true,
      slug: true
    }
  },
  trainingEnd: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  approvedAt: true
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService
  ) {}

  async getCurrentUser(actor: AuthenticatedUser) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: actor.id },
      select: currentUserSelect
    });
  }

  async updateCurrentUser(actor: AuthenticatedUser, dto: UpdateMyProfileDto, request: Request) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: actor.id }
    });

    if (!existingUser || existingUser.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    const data: Prisma.UserUpdateInput = {};
    const metadata: Record<string, unknown> = {};

    if (dto.displayName !== undefined) {
      const displayName = this.sanitizeText(dto.displayName, 120);
      if (displayName.length < 2) {
        throw new BadRequestException('Display name must be at least 2 characters long.');
      }

      data.displayName = displayName;
      metadata.previousDisplayName = existingUser.displayName;
      metadata.nextDisplayName = displayName;
    }

    if (dto.avatar !== undefined) {
      const avatar = dto.avatar === null ? null : this.normalizeAvatar(dto.avatar);
      data.avatar = avatar;
      metadata.previousAvatar = existingUser.avatar;
      metadata.nextAvatar = avatar;
    }

    if (dto.company !== undefined) {
      const company = dto.company === null ? null : this.sanitizeNullableText(dto.company, 160);
      data.company = company;
      metadata.previousCompany = existingUser.company;
      metadata.nextCompany = company;
    }

    if (dto.birthDate !== undefined) {
      const birthDate = dto.birthDate === null ? null : this.normalizeBirthDate(dto.birthDate);
      data.birthDate = birthDate;
      metadata.previousBirthDate = existingUser.birthDate?.toISOString() ?? null;
      metadata.nextBirthDate = birthDate?.toISOString() ?? null;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No valid profile updates were provided.');
    }

    const updated = await this.prisma.user.update({
      where: { id: actor.id },
      data,
      select: currentUserSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.profile_updated',
      'user',
      actor.id,
      metadata as Prisma.InputJsonValue,
      request
    );

    return updated;
  }

  async listPendingUsers() {
    return this.prisma.user.findMany({
      where: {
        status: AccountStatus.PENDING,
        isDeleted: false
      },
      select: adminUserSelect,
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  async listAllUsers() {
    return this.prisma.user.findMany({
      where: {
        isDeleted: false
      },
      select: adminUserSelect,
      orderBy: [
        {
          status: 'asc'
        },
        {
          createdAt: 'desc'
        }
      ]
    });
  }

  async listOrganizationContacts(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      return [];
    }

    return this.prisma.user.findMany({
      where: {
        organizationId: actor.organizationId,
        status: AccountStatus.APPROVED,
        isDeleted: false,
        NOT: {
          id: actor.id
        }
      },
      select: {
        id: true,
        displayName: true,
        role: true,
        canSignReports: true,
        organizationId: true
      },
      orderBy: {
        displayName: 'asc'
      }
    });
  }

  async updateApproval(actor: AuthenticatedUser, userId: string, dto: ApproveUserDto, request: Request) {
    if (actor.id === userId && dto.status !== AccountStatus.APPROVED) {
      throw new BadRequestException('You cannot disable or reject your own account from this endpoint.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    if (user.role === AppRole.ADMIN && dto.status !== AccountStatus.APPROVED) {
      throw new ForbiddenException(
        'Disabling or rejecting administrator accounts requires a dedicated break-glass workflow.'
      );
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: dto.status,
        approvedAt: dto.status === AccountStatus.APPROVED ? new Date() : null,
        approvedById: dto.status === AccountStatus.APPROVED ? actor.id : null,
        ...(dto.status === AccountStatus.APPROVED ? {} : { refreshTokenHash: null })
      },
      select: adminUserSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.approval_updated',
      'user',
      userId,
      {
        previousStatus: user.status,
        nextStatus: dto.status,
        reason: dto.reason ?? null
      },
      request
    );

    return updated;
  }

  async updateRole(actor: AuthenticatedUser, userId: string, dto: UpdateUserRoleDto, request: Request) {
    if (actor.id === userId) {
      throw new ForbiddenException('Use a separate break-glass workflow for self role changes.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    if (user.role === AppRole.ADMIN && dto.role !== AppRole.ADMIN) {
      throw new ForbiddenException('Downgrading administrator accounts requires a dedicated approval workflow.');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: dto.role
      },
      select: adminUserSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.role_updated',
      'user',
      userId,
      {
        previousRole: user.role,
        nextRole: dto.role
      },
      request
    );

    return updated;
  }

  async updateOrganization(
    actor: AuthenticatedUser,
    userId: string,
    organizationId: string | null,
    request: Request
  ) {
    if (actor.id === userId) {
      throw new ForbiddenException('Use a separate workflow for reassigning your own organization.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    if (organizationId) {
      const organization = await this.prisma.organization.findUnique({
        where: { id: organizationId }
      });

      if (!organization || !organization.isActive) {
        throw new BadRequestException('Organization is not active or does not exist.');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        organizationId
      },
      select: adminUserSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.organization_updated',
      'user',
      userId,
      {
        previousOrganizationId: user.organizationId,
        nextOrganizationId: organizationId
      },
      request
    );

    return updated;
  }

  async updatePermissions(
    actor: AuthenticatedUser,
    userId: string,
    dto: UpdateUserPermissionsDto,
    request: Request
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    const data: Prisma.UserUpdateInput = {};
    const metadata: Record<string, unknown> = {};

    if (dto.canSignReports !== undefined) {
      data.canSignReports = dto.canSignReports;
      metadata.canSignReports = dto.canSignReports;
    }
    if (dto.canViewSchoolCards !== undefined) {
      data.canViewSchoolCards = dto.canViewSchoolCards;
      metadata.canViewSchoolCards = dto.canViewSchoolCards;
    }
    if (dto.canViewExamGrades !== undefined) {
      data.canViewExamGrades = dto.canViewExamGrades;
      metadata.canViewExamGrades = dto.canViewExamGrades;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No permission updates were provided.');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: adminUserSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.permissions_updated',
      'user',
      userId,
      metadata as Prisma.InputJsonValue,
      request
    );

    return updated;
  }

  async softDeleteUser(actor: AuthenticatedUser, userId: string, request: Request) {
    if (actor.id === userId) {
      throw new ForbiddenException('You cannot delete your own account from this endpoint.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    if (user.role === AppRole.ADMIN) {
      throw new ForbiddenException('Deleting administrator accounts requires a dedicated break-glass workflow.');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        refreshTokenHash: null,
        status: AccountStatus.DISABLED
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.deleted',
      'user',
      userId,
      {
        email: user.email,
        displayName: user.displayName,
        role: user.role
      },
      request
    );

    return { deleted: true };
  }

  private sanitizeText(value: string, maxLength: number): string {
    const sanitized = sanitizeHtml(String(value || ''), {
      allowedTags: [],
      allowedAttributes: {}
    }).trim();

    return sanitized.slice(0, maxLength);
  }

  private sanitizeNullableText(value: string, maxLength: number): string | null {
    const sanitized = this.sanitizeText(value, maxLength);
    return sanitized || null;
  }

  private normalizeAvatar(value: string): string {
    const trimmed = String(value || '').trim();
    if (!trimmed) {
      throw new BadRequestException('Avatar id must not be empty.');
    }

    if (!/^[a-z0-9_-]+$/i.test(trimmed)) {
      throw new BadRequestException('Avatar id contains unsupported characters.');
    }

    return trimmed.slice(0, 120);
  }

  private normalizeBirthDate(value: string): Date {
    const date = new Date(String(value || '').trim());
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Birth date is invalid.');
    }

    const now = new Date();
    if (date > now) {
      throw new BadRequestException('Birth date cannot be in the future.');
    }

    if (date.getUTCFullYear() < 1900) {
      throw new BadRequestException('Birth date is outside the allowed range.');
    }

    return date;
  }
}
