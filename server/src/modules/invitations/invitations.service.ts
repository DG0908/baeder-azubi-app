import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AppRole } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService
  ) {}

  async list(actor: AuthenticatedUser) {
    return this.prisma.invitationCode.findMany({
      where: actor.role === AppRole.ADMIN
        ? undefined
        : {
            organizationId: actor.organizationId ?? '__no_match__'
          },
      select: {
        id: true,
        role: true,
        maxUses: true,
        usedCount: true,
        expiresAt: true,
        revokedAt: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async create(actor: AuthenticatedUser, dto: CreateInvitationDto, request: Request) {
    const organizationId = this.resolveOrganizationId(actor, dto.organizationId);

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!organization || !organization.isActive) {
      throw new BadRequestException('Organization is not active or does not exist.');
    }

    if (
      actor.role === AppRole.AUSBILDER &&
      dto.role !== AppRole.AZUBI &&
      dto.role !== AppRole.RETTUNGSSCHWIMMER_AZUBI
    ) {
      throw new ForbiddenException('Ausbilder may only issue apprentice invitation codes.');
    }

    const plainCode = this.generateInvitationCode();
    const invitation = await this.prisma.invitationCode.create({
      data: {
        organizationId,
        codeHash: this.hashInvitationCode(plainCode),
        role: dto.role,
        maxUses: dto.maxUses ?? 1,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        createdById: actor.id
      },
      select: {
        id: true,
        role: true,
        maxUses: true,
        usedCount: true,
        expiresAt: true,
        createdAt: true,
        organizationId: true
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'invitation.created',
      'invitation',
      invitation.id,
      {
        organizationId,
        role: dto.role,
        maxUses: invitation.maxUses,
        expiresAt: invitation.expiresAt
      },
      request
    );

    return {
      ...invitation,
      code: plainCode
    };
  }

  async revoke(actor: AuthenticatedUser, invitationId: string, request: Request) {
    const invitation = await this.prisma.invitationCode.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found.');
    }

    if (actor.role !== AppRole.ADMIN && invitation.organizationId !== actor.organizationId) {
      throw new ForbiddenException('Invitation does not belong to your organization.');
    }

    const revoked = await this.prisma.invitationCode.update({
      where: { id: invitationId },
      data: {
        revokedAt: new Date()
      },
      select: {
        id: true,
        revokedAt: true
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'invitation.revoked',
      'invitation',
      invitationId,
      {},
      request
    );

    return revoked;
  }

  private resolveOrganizationId(actor: AuthenticatedUser, dtoOrganizationId?: string): string {
    if (actor.role === AppRole.ADMIN) {
      const organizationId = dtoOrganizationId ?? actor.organizationId;
      if (!organizationId) {
        throw new BadRequestException(
          'organizationId is required for administrators without a default organization.'
        );
      }
      return organizationId;
    }

    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }

    if (dtoOrganizationId && dtoOrganizationId !== actor.organizationId) {
      throw new ForbiddenException('You may only manage invitation codes for your own organization.');
    }

    return actor.organizationId;
  }

  private generateInvitationCode(): string {
    return `AZU-${randomBytes(5).toString('hex').toUpperCase()}`;
  }

  private hashInvitationCode(code: string): string {
    const pepper = this.configService.get<string>('INVITATION_CODE_PEPPER');
    return createHash('sha256').update(`${code.trim().toUpperCase()}:${pepper}`).digest('hex');
  }
}
