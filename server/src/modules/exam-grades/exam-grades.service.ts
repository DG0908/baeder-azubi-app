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
import { CreateExamGradeDto } from './dto/create-exam-grade.dto';
import { ListExamGradesQueryDto } from './dto/list-exam-grades-query.dto';

const examGradeSelect = {
  id: true,
  userId: true,
  date: true,
  subject: true,
  topic: true,
  grade: true,
  notes: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.ExamGradeSelect;

@Injectable()
export class ExamGradesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService
  ) {}

  async list(actor: AuthenticatedUser, query: ListExamGradesQueryDto) {
    const targetUser = await this.resolveAccessibleTargetUser(actor, query.userId ?? actor.id);

    return this.prisma.examGrade.findMany({
      where: {
        organizationId: actor.organizationId!,
        userId: targetUser.id
      },
      orderBy: {
        date: 'desc'
      },
      select: examGradeSelect
    });
  }

  async create(actor: AuthenticatedUser, dto: CreateExamGradeDto, request: Request) {
    this.assertOrganization(actor);

    const created = await this.prisma.examGrade.create({
      data: {
        organizationId: actor.organizationId!,
        userId: actor.id,
        date: new Date(dto.date),
        subject: dto.subject.trim(),
        topic: dto.topic.trim(),
        grade: dto.grade,
        notes: dto.notes?.trim() || null
      },
      select: examGradeSelect
    });

    await this.notifyStaffAboutNewExamGrade(actor, created);
    await this.auditLogService.writeForUser(
      actor,
      'exam_grade.created',
      'ExamGrade',
      created.id,
      {
        userId: actor.id,
        subject: created.subject,
        date: created.date.toISOString(),
        grade: created.grade
      },
      request
    );

    return created;
  }

  async remove(actor: AuthenticatedUser, gradeId: string, request: Request) {
    this.assertOrganization(actor);

    const existing = await this.prisma.examGrade.findFirst({
      where: {
        id: gradeId,
        organizationId: actor.organizationId!
      },
      select: {
        id: true,
        userId: true
      }
    });

    if (!existing) {
      throw new NotFoundException('Exam grade not found.');
    }

    if (actor.id !== existing.userId && !this.isStaff(actor.role)) {
      throw new ForbiddenException('You may only delete your own exam grades.');
    }

    await this.prisma.examGrade.delete({
      where: { id: existing.id }
    });

    await this.auditLogService.writeForUser(
      actor,
      'exam_grade.deleted',
      'ExamGrade',
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

  private async notifyStaffAboutNewExamGrade(
    actor: AuthenticatedUser,
    examGrade: {
      subject: string;
      date: Date;
      grade: number;
    }
  ) {
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
        title: 'Neue Klasur eingetragen',
        message: `${actor.displayName} hat eine ${examGrade.subject}-Klasur vom ${this.formatDateLabel(examGrade.date)} eingetragen: Note ${examGrade.grade.toFixed(1).replace('.', ',')}`,
        type: NotificationType.INFO,
        metadata: {
          eventType: 'EXAM_GRADE_CREATED'
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
      throw new ForbiddenException('You may only view your own exam grades.');
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
