import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AccountStatus, AppRole, NotificationType, Prisma } from '@prisma/client';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSchoolAttendanceDto } from './dto/create-school-attendance.dto';
import { ListSchoolAttendanceQueryDto } from './dto/list-school-attendance-query.dto';
import {
  SchoolAttendanceSignatureField,
  UpdateSchoolAttendanceSignatureDto
} from './dto/update-school-attendance-signature.dto';

const schoolAttendanceSelect = {
  id: true,
  userId: true,
  date: true,
  startTime: true,
  endTime: true,
  teacherSignature: true,
  trainerSignature: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.SchoolAttendanceEntrySelect;

@Injectable()
export class SchoolAttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService
  ) {}

  async list(actor: AuthenticatedUser, query: ListSchoolAttendanceQueryDto) {
    const targetUser = await this.resolveAccessibleTargetUser(actor, query.userId ?? actor.id);

    return this.prisma.schoolAttendanceEntry.findMany({
      where: {
        organizationId: actor.organizationId!,
        userId: targetUser.id
      },
      orderBy: {
        date: 'desc'
      },
      select: schoolAttendanceSelect
    });
  }

  async create(actor: AuthenticatedUser, dto: CreateSchoolAttendanceDto, request: Request) {
    this.assertOrganization(actor);

    const created = await this.prisma.schoolAttendanceEntry.create({
      data: {
        organizationId: actor.organizationId!,
        userId: actor.id,
        date: new Date(dto.date),
        startTime: dto.startTime,
        endTime: dto.endTime
      },
      select: schoolAttendanceSelect
    });

    await this.notifyStaffAboutNewEntry(actor, created.date);
    await this.auditLogService.writeForUser(
      actor,
      'school_attendance.created',
      'SchoolAttendanceEntry',
      created.id,
      {
        userId: actor.id,
        date: created.date.toISOString()
      },
      request
    );

    return created;
  }

  async updateSignature(
    actor: AuthenticatedUser,
    entryId: string,
    dto: UpdateSchoolAttendanceSignatureDto,
    request: Request
  ) {
    this.assertOrganization(actor);

    const existing = await this.prisma.schoolAttendanceEntry.findFirst({
      where: {
        id: entryId,
        organizationId: actor.organizationId!
      },
      select: {
        ...schoolAttendanceSelect,
        user: {
          select: {
            id: true,
            organizationId: true
          }
        }
      }
    });

    if (!existing) {
      throw new NotFoundException('School attendance entry not found.');
    }

    if (dto.field === SchoolAttendanceSignatureField.TRAINER_SIGNATURE) {
      if (!this.isStaff(actor.role)) {
        throw new ForbiddenException('Only staff may sign as trainer.');
      }
    } else if (actor.id !== existing.userId && !this.isStaff(actor.role)) {
      throw new ForbiddenException('Only the owner or staff may update the teacher signature.');
    }

    const updated = await this.prisma.schoolAttendanceEntry.update({
      where: { id: existing.id },
      data: {
        [dto.field]: dto.value ?? null
      },
      select: schoolAttendanceSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'school_attendance.signature_updated',
      'SchoolAttendanceEntry',
      updated.id,
      {
        field: dto.field,
        cleared: dto.value == null
      },
      request
    );

    return updated;
  }

  async remove(actor: AuthenticatedUser, entryId: string, request: Request) {
    this.assertOrganization(actor);

    const existing = await this.prisma.schoolAttendanceEntry.findFirst({
      where: {
        id: entryId,
        organizationId: actor.organizationId!
      },
      select: {
        id: true,
        userId: true
      }
    });

    if (!existing) {
      throw new NotFoundException('School attendance entry not found.');
    }

    if (actor.id !== existing.userId && !this.isStaff(actor.role)) {
      throw new ForbiddenException('You may only delete your own school attendance entries.');
    }

    await this.prisma.schoolAttendanceEntry.delete({
      where: { id: existing.id }
    });

    await this.auditLogService.writeForUser(
      actor,
      'school_attendance.deleted',
      'SchoolAttendanceEntry',
      existing.id,
      {
        userId: existing.userId
      },
      request
    );

    return {
      deleted: true
    };
  }

  private async notifyStaffAboutNewEntry(actor: AuthenticatedUser, date: Date) {
    const staffRecipients = await this.prisma.user.findMany({
      where: {
        organizationId: actor.organizationId!,
        status: AccountStatus.APPROVED,
        isDeleted: false,
        role: {
          in: [AppRole.ADMIN, AppRole.AUSBILDER]
        },
        NOT: {
          id: actor.id
        }
      },
      select: {
        id: true
      }
    });

    await this.notificationsService.createForUsers(
      staffRecipients.map((recipient) => recipient.id),
      {
        title: 'Neuer Kontrollkarten-Eintrag',
        message: `${actor.displayName} hat einen neuen Berufsschul-Eintrag vom ${this.formatDateLabel(date)} hinzugefuegt.`,
        type: NotificationType.INFO,
        metadata: {
          eventType: 'SCHOOL_ATTENDANCE_CREATED'
        }
      }
    );
  }

  private async resolveAccessibleTargetUser(actor: AuthenticatedUser, requestedUserId: string) {
    this.assertOrganization(actor);

    if (!requestedUserId || requestedUserId === actor.id) {
      return {
        id: actor.id
      };
    }

    if (!this.isStaff(actor.role)) {
      throw new ForbiddenException('You may only view your own school attendance.');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: requestedUserId,
        organizationId: actor.organizationId!,
        status: AccountStatus.APPROVED,
        isDeleted: false
      },
      select: {
        id: true
      }
    });

    if (!user) {
      throw new NotFoundException('Requested user not found in your organization.');
    }

    return user;
  }

  private assertOrganization(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }
  }

  private isStaff(role: AppRole) {
    return role === AppRole.ADMIN || role === AppRole.AUSBILDER;
  }

  private formatDateLabel(value: Date) {
    return new Intl.DateTimeFormat('de-DE').format(value);
  }
}
