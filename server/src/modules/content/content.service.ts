import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AccountStatus, AppRole, NotificationType, Prisma } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateLearningMaterialDto } from './dto/create-learning-material.dto';
import { CreateNewsPostDto } from './dto/create-news-post.dto';
import { CreateResourceDto } from './dto/create-resource.dto';
import { CreateScheduledExamDto } from './dto/create-scheduled-exam.dto';

type LearningMaterialRecord = {
  id: string;
  title: string;
  content: string | null;
  category: string;
  type: string;
  url: string | null;
  createdAt: Date;
  createdById: string;
  createdBy: {
    id: string;
    displayName: string;
  };
};

type NewsPostRecord = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  createdById: string;
  createdBy: {
    id: string;
    displayName: string;
  };
};

type ResourceRecord = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string;
  createdAt: Date;
  createdById: string;
  createdBy: {
    id: string;
    displayName: string;
  };
};

type ScheduledExamRecord = {
  id: string;
  title: string;
  description: string | null;
  examDate: Date | null;
  location: string | null;
  createdAt: Date;
  createdById: string;
  createdBy: {
    id: string;
    displayName: string;
  };
};

const learningMaterialSelect = {
  id: true,
  title: true,
  content: true,
  category: true,
  type: true,
  url: true,
  createdAt: true,
  createdById: true,
  createdBy: {
    select: {
      id: true,
      displayName: true
    }
  }
};

const newsPostSelect = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  createdById: true,
  createdBy: {
    select: {
      id: true,
      displayName: true
    }
  }
};

const resourceSelect = {
  id: true,
  title: true,
  description: true,
  url: true,
  category: true,
  createdAt: true,
  createdById: true,
  createdBy: {
    select: {
      id: true,
      displayName: true
    }
  }
};

const scheduledExamSelect = {
  id: true,
  title: true,
  description: true,
  examDate: true,
  location: true,
  createdAt: true,
  createdById: true,
  createdBy: {
    select: {
      id: true,
      displayName: true
    }
  }
};

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService
  ) {}

  async listMaterials(actor: AuthenticatedUser) {
    this.assertOrganization(actor);

    const materials = await this.prisma.learningMaterial.findMany({
      where: {
        organizationId: actor.organizationId!
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 200,
      select: learningMaterialSelect
    });

    return materials.map((entry: LearningMaterialRecord) => this.toLearningMaterialPayload(entry));
  }

  async listResources(actor: AuthenticatedUser) {
    this.assertOrganization(actor);

    const resources = await this.prisma.resource.findMany({
      where: {
        organizationId: actor.organizationId!
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 200,
      select: resourceSelect
    });

    return resources.map((entry: ResourceRecord) => this.toResourcePayload(entry));
  }

  async createMaterial(actor: AuthenticatedUser, dto: CreateLearningMaterialDto, request: Request) {
    this.assertOrganization(actor);
    this.assertStaff(actor);

    const title = this.sanitizeText(dto.title, 'title', 200);
    const category = this.sanitizeIdentifier(dto.category, 'category');
    const content = dto.content ? this.sanitizeText(dto.content, 'content', 4000) : null;
    const type = dto.type ? this.sanitizeIdentifier(dto.type, 'type') : 'text';
    const url = dto.url ? String(dto.url).trim() : null;

    const created = await this.prisma.learningMaterial.create({
      data: {
        organizationId: actor.organizationId!,
        createdById: actor.id,
        title,
        category,
        content,
        type,
        url
      },
      select: learningMaterialSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'learning_material.created',
      'LearningMaterial',
      created.id,
      {
        category,
        type
      },
      request
    );

    return this.toLearningMaterialPayload(created);
  }

  async createResource(actor: AuthenticatedUser, dto: CreateResourceDto, request: Request) {
    this.assertOrganization(actor);
    this.assertAdmin(actor);

    const title = this.sanitizeText(dto.title, 'title', 200);
    const description = dto.description ? this.sanitizeText(dto.description, 'description', 4000) : null;
    const category = this.normalizeResourceCategory(dto.category);
    const url = this.sanitizeUrl(dto.url);

    const created = await this.prisma.resource.create({
      data: {
        organizationId: actor.organizationId!,
        createdById: actor.id,
        title,
        description,
        url,
        category
      },
      select: resourceSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'resource.created',
      'Resource',
      created.id,
      {
        category,
        url
      },
      request
    );

    return this.toResourcePayload(created);
  }

  async removeResource(actor: AuthenticatedUser, resourceId: string, request: Request) {
    this.assertOrganization(actor);
    this.assertAdmin(actor);

    const existing = await this.prisma.resource.findFirst({
      where: {
        id: resourceId,
        organizationId: actor.organizationId!
      },
      select: {
        id: true,
        title: true,
        createdById: true
      }
    });

    if (!existing) {
      throw new NotFoundException('Resource not found.');
    }

    await this.prisma.resource.delete({
      where: {
        id: existing.id
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'resource.deleted',
      'Resource',
      existing.id,
      {
        title: existing.title,
        ownerUserId: existing.createdById
      },
      request
    );

    return { id: existing.id };
  }

  async listNews(actor: AuthenticatedUser) {
    this.assertOrganization(actor);

    const items = await this.prisma.newsPost.findMany({
      where: {
        organizationId: actor.organizationId!
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100,
      select: newsPostSelect
    });

    return items.map((entry: NewsPostRecord) => this.toNewsPostPayload(entry));
  }

  async createNews(actor: AuthenticatedUser, dto: CreateNewsPostDto, request: Request) {
    this.assertOrganization(actor);
    this.assertStaff(actor);

    const title = this.sanitizeText(dto.title, 'title', 200);
    const content = this.sanitizeText(dto.content, 'content', 4000);

    const created = await this.prisma.newsPost.create({
      data: {
        organizationId: actor.organizationId!,
        createdById: actor.id,
        title,
        content
      },
      select: newsPostSelect
    });

    await this.notifyOrganization(actor, {
      title: 'Neue News',
      message: `${actor.displayName} hat eine neue News veroeffentlicht: "${created.title}"`,
      type: NotificationType.INFO,
      metadata: {
        eventType: 'NEWS_PUBLISHED',
        newsId: created.id
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'news_post.created',
      'NewsPost',
      created.id,
      {
        title: created.title
      },
      request
    );

    return this.toNewsPostPayload(created);
  }

  async removeNews(actor: AuthenticatedUser, newsId: string, request: Request) {
    this.assertOrganization(actor);
    this.assertStaff(actor);

    const existing = await this.prisma.newsPost.findFirst({
      where: {
        id: newsId,
        organizationId: actor.organizationId!
      },
      select: {
        id: true,
        title: true,
        createdById: true
      }
    });

    if (!existing) {
      throw new NotFoundException('News post not found.');
    }

    await this.prisma.newsPost.delete({
      where: {
        id: existing.id
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'news_post.deleted',
      'NewsPost',
      existing.id,
      {
        title: existing.title,
        ownerUserId: existing.createdById
      },
      request
    );

    return { id: existing.id };
  }

  async listScheduledExams(actor: AuthenticatedUser) {
    this.assertOrganization(actor);

    const exams = await this.prisma.scheduledExam.findMany({
      where: {
        organizationId: actor.organizationId!
      },
      select: scheduledExamSelect
    });

    return exams
      .sort((left: ScheduledExamRecord, right: ScheduledExamRecord) => {
        const leftTime = left.examDate ? left.examDate.getTime() : Number.MAX_SAFE_INTEGER;
        const rightTime = right.examDate ? right.examDate.getTime() : Number.MAX_SAFE_INTEGER;
        if (leftTime !== rightTime) {
          return leftTime - rightTime;
        }
        return right.createdAt.getTime() - left.createdAt.getTime();
      })
      .map((entry: ScheduledExamRecord) => this.toScheduledExamPayload(entry));
  }

  async createScheduledExam(actor: AuthenticatedUser, dto: CreateScheduledExamDto, request: Request) {
    this.assertOrganization(actor);
    this.assertStaff(actor);

    const title = this.sanitizeText(dto.title, 'title', 200);
    const description = dto.description ? this.sanitizeText(dto.description, 'description', 4000) : null;
    const location = dto.location ? this.sanitizeText(dto.location, 'location', 200) : null;
    const examDate = dto.examDate ? new Date(dto.examDate) : null;

    if (examDate && Number.isNaN(examDate.getTime())) {
      throw new BadRequestException('examDate is invalid.');
    }

    const created = await this.prisma.scheduledExam.create({
      data: {
        organizationId: actor.organizationId!,
        createdById: actor.id,
        title,
        description,
        examDate,
        location
      },
      select: scheduledExamSelect
    });

    const examDateLabel = created.examDate
      ? new Intl.DateTimeFormat('de-DE').format(created.examDate)
      : 'ohne Termin';

    await this.notifyOrganization(actor, {
      title: 'Neue Klausur',
      message: `${actor.displayName} hat eine neue Klausur eingetragen: "${created.title}" (${examDateLabel}).`,
      type: NotificationType.INFO,
      metadata: {
        eventType: 'EXAM_CREATED',
        scheduledExamId: created.id
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'scheduled_exam.created',
      'ScheduledExam',
      created.id,
      {
        title: created.title,
        examDate: created.examDate?.toISOString() ?? null
      },
      request
    );

    return this.toScheduledExamPayload(created);
  }

  async removeScheduledExam(actor: AuthenticatedUser, examId: string, request: Request) {
    this.assertOrganization(actor);
    this.assertStaff(actor);

    const existing = await this.prisma.scheduledExam.findFirst({
      where: {
        id: examId,
        organizationId: actor.organizationId!
      },
      select: {
        id: true,
        title: true,
        createdById: true
      }
    });

    if (!existing) {
      throw new NotFoundException('Scheduled exam not found.');
    }

    await this.prisma.scheduledExam.delete({
      where: {
        id: existing.id
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'scheduled_exam.deleted',
      'ScheduledExam',
      existing.id,
      {
        title: existing.title,
        ownerUserId: existing.createdById
      },
      request
    );

    return { id: existing.id };
  }

  private async notifyOrganization(
    actor: AuthenticatedUser,
    input: {
      title: string;
      message: string;
      type: NotificationType;
      metadata: Record<string, unknown>;
    }
  ) {
    const recipients = await this.prisma.user.findMany({
      where: {
        organizationId: actor.organizationId!,
        status: AccountStatus.APPROVED,
        isDeleted: false,
        NOT: {
          id: actor.id
        }
      },
      select: {
        id: true
      }
    });

    if (!recipients.length) {
      return;
    }

    await this.notificationsService.createForUsers(
      recipients.map((recipient) => recipient.id),
      input
    );
  }

  private toLearningMaterialPayload(entry: LearningMaterialRecord) {
    return {
      id: entry.id,
      title: entry.title,
      content: entry.content ?? '',
      category: entry.category,
      type: entry.type,
      url: entry.url,
      created_by: entry.createdBy.displayName,
      created_by_id: entry.createdById,
      created_at: entry.createdAt.toISOString()
    };
  }

  private toNewsPostPayload(entry: NewsPostRecord) {
    return {
      id: entry.id,
      title: entry.title,
      content: entry.content,
      author: entry.createdBy.displayName,
      author_id: entry.createdById,
      created_at: entry.createdAt.toISOString()
    };
  }

  private toResourcePayload(entry: ResourceRecord) {
    return {
      id: entry.id,
      title: entry.title,
      description: entry.description ?? '',
      url: entry.url,
      category: entry.category,
      created_by: entry.createdBy.displayName,
      created_by_id: entry.createdById,
      created_at: entry.createdAt.toISOString()
    };
  }

  private toScheduledExamPayload(entry: ScheduledExamRecord) {
    return {
      id: entry.id,
      title: entry.title,
      description: entry.description ?? '',
      exam_date: entry.examDate?.toISOString() ?? null,
      location: entry.location ?? null,
      created_by: entry.createdBy.displayName,
      created_by_id: entry.createdById,
      created_at: entry.createdAt.toISOString()
    };
  }

  private sanitizeText(value: string, fieldName: string, maxLength: number) {
    const sanitized = sanitizeHtml(String(value || ''), {
      allowedTags: [],
      allowedAttributes: {}
    })
      .replace(/\r\n/g, '\n')
      .trim();

    if (!sanitized) {
      throw new BadRequestException(`${fieldName} is empty after sanitization.`);
    }

    if (sanitized.length > maxLength) {
      throw new BadRequestException(`${fieldName} is too long.`);
    }

    return sanitized;
  }

  private sanitizeUrl(value: string) {
    const candidate = String(value || '').trim();
    if (!candidate) {
      throw new BadRequestException('url is required.');
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(candidate);
    } catch {
      throw new BadRequestException('url is invalid.');
    }

    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      throw new BadRequestException('url must use http or https.');
    }

    return parsedUrl.toString();
  }

  private normalizeResourceCategory(value: string) {
    const normalized = String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[ä]/g, 'ae')
      .replace(/[ö]/g, 'oe')
      .replace(/[ü]/g, 'ue')
      .replace(/[ß]/g, 'ss')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]/g, '');

    const canonical = normalized === 'behorde' ? 'behoerde' : normalized;

    const allowedCategories = new Set(['youtube', 'website', 'document', 'behoerde', 'tool']);
    if (!allowedCategories.has(canonical)) {
      throw new BadRequestException('category is invalid.');
    }

    return canonical;
  }

  private assertAdmin(actor: AuthenticatedUser) {
    if (actor.role !== AppRole.ADMIN) {
      throw new ForbiddenException('Only admins may manage resources.');
    }
  }

  private sanitizeIdentifier(value: string, fieldName: string) {
    const sanitized = String(value || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!sanitized) {
      throw new BadRequestException(`${fieldName} is invalid.`);
    }
    return sanitized;
  }

  private assertOrganization(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }
  }

  private assertStaff(actor: AuthenticatedUser) {
    if (!this.isStaff(actor.role)) {
      throw new ForbiddenException('Only staff may manage this content.');
    }
  }

  private isStaff(role: AppRole) {
    return role === AppRole.ADMIN || role === AppRole.AUSBILDER;
  }
}
