import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService
  ) {}

  async list(actor: AuthenticatedUser) {
    if (actor.role === AppRole.ADMIN) {
      return this.prisma.organization.findMany({
        orderBy: {
          createdAt: 'asc'
        }
      });
    }

    if (!actor.organizationId) {
      return [];
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: actor.organizationId }
    });

    return organization ? [organization] : [];
  }

  async create(actor: AuthenticatedUser, dto: CreateOrganizationDto, request: Request) {
    const existing = await this.prisma.organization.findUnique({
      where: { slug: dto.slug.trim().toLowerCase() }
    });

    if (existing) {
      throw new ConflictException('Organization slug is already in use.');
    }

    const organization = await this.prisma.organization.create({
      data: {
        name: dto.name.trim(),
        slug: dto.slug.trim().toLowerCase(),
        contactName: dto.contactName?.trim() || null,
        contactEmail: dto.contactEmail?.trim().toLowerCase() || null
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'organization.created',
      'organization',
      organization.id,
      {
        name: organization.name,
        slug: organization.slug
      },
      request
    );

    return organization;
  }

  async getById(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id }
    });

    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    return organization;
  }
}
