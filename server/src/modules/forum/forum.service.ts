import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AppRole, NotificationType } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateForumCategoryDto, FORUM_CUSTOM_COLOR_KEYS } from './dto/create-forum-category.dto';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { CreateForumReplyDto } from './dto/create-forum-reply.dto';
import { ListForumPostsQueryDto } from './dto/list-forum-posts-query.dto';
import {
  FORUM_CATEGORY_IDS,
  FORUM_CATEGORY_RULES,
  ForumCategoryId,
  isBuiltInForumCategory
} from './forum-categories';

type ForumCategoryMetadata = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  colorKey: string;
  description: string;
  order: number;
  custom: boolean;
  customId: string | null;
  canRead: boolean;
  canPost: boolean;
  canDelete: boolean;
  createdBy?: { id: string; displayName: string } | null;
  createdAt?: string | null;
};

type ForumPostRecord = {
  id: string;
  category: string;
  title: string;
  content: string;
  pinned: boolean;
  locked: boolean;
  lastReplyAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    displayName: string;
    role: AppRole;
  };
  _count: {
    replies: number;
  };
};

type ForumReplyRecord = {
  id: string;
  postId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    displayName: string;
    role: AppRole;
  };
};

const forumPostSelect = {
  id: true,
  category: true,
  title: true,
  content: true,
  pinned: true,
  locked: true,
  lastReplyAt: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  user: {
    select: {
      id: true,
      displayName: true,
      role: true
    }
  },
  _count: {
    select: {
      replies: true
    }
  }
};

const forumReplySelect = {
  id: true,
  postId: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  user: {
    select: {
      id: true,
      displayName: true,
      role: true
    }
  }
};

@Injectable()
export class ForumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService
  ) {}

  async listCategoryCounts(actor: AuthenticatedUser) {
    this.assertOrganization(actor);

    const customCategories = await this.prisma.forumCategorySetting.findMany({
      where: { organizationId: actor.organizationId! },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      include: {
        createdBy: {
          select: { id: true, displayName: true }
        }
      }
    });

    const readableBuiltIns = FORUM_CATEGORY_RULES
      .filter((rule) => this.canReadCategory(actor.role, rule.id))
      .map((rule) => rule.id as string);

    const readableCustomSlugs = customCategories.map((entry) => entry.slug);
    const readableSlugs = [...readableBuiltIns, ...readableCustomSlugs];

    const grouped = readableSlugs.length > 0
      ? await this.prisma.forumPost.groupBy({
          by: ['category'],
          where: {
            organizationId: actor.organizationId!,
            category: { in: readableSlugs }
          },
          _count: { _all: true }
        })
      : [];

    const countOf = (slug: string) =>
      grouped.find((entry) => entry.category === slug)?._count._all ?? 0;

    const isAdminActor = this.isAdmin(actor.role);

    const builtInMetadata: ForumCategoryMetadata[] = FORUM_CATEGORY_RULES
      .filter((rule) => this.canReadCategory(actor.role, rule.id))
      .map((rule) => ({
        id: rule.id,
        slug: rule.id,
        name: rule.name,
        icon: rule.icon,
        colorKey: rule.colorKey,
        description: rule.description,
        order: rule.order,
        custom: false,
        customId: null,
        canRead: true,
        canPost: this.canPostCategory(actor.role, rule.id),
        canDelete: false
      }));

    const customMetadata: ForumCategoryMetadata[] = customCategories.map((entry) => ({
      id: entry.slug,
      slug: entry.slug,
      name: entry.name,
      icon: entry.icon,
      colorKey: entry.colorKey,
      description: entry.description ?? '',
      order: entry.order,
      custom: true,
      customId: entry.id,
      canRead: true,
      canPost: true,
      canDelete: isAdminActor,
      createdBy: entry.createdBy
        ? { id: entry.createdBy.id, displayName: entry.createdBy.displayName }
        : null,
      createdAt: entry.createdAt.toISOString()
    }));

    return [...builtInMetadata, ...customMetadata]
      .sort((a, b) => a.order - b.order)
      .map((entry) => ({
        ...entry,
        category: entry.slug,
        count: countOf(entry.slug)
      }));
  }

  async createCustomCategory(
    actor: AuthenticatedUser,
    dto: CreateForumCategoryDto,
    request: Request
  ) {
    this.assertOrganization(actor);
    this.assertAdmin(actor.role);

    const slug = this.sanitizeSlug(dto.slug);
    if (isBuiltInForumCategory(slug)) {
      throw new BadRequestException('Der Slug ist für eine Standard-Kategorie reserviert.');
    }

    const name = this.sanitizeText(dto.name, 'name', 48);
    const icon = this.sanitizeIcon(dto.icon);
    const colorKey = this.sanitizeColorKey(dto.colorKey);
    const description = dto.description
      ? this.sanitizeText(dto.description, 'description', 160)
      : null;

    const existing = await this.prisma.forumCategorySetting.findFirst({
      where: { organizationId: actor.organizationId!, slug }
    });

    if (existing) {
      throw new BadRequestException('Slug ist bereits vergeben.');
    }

    const created = await this.prisma.forumCategorySetting.create({
      data: {
        organizationId: actor.organizationId!,
        createdById: actor.id,
        slug,
        name,
        icon,
        colorKey,
        description,
        order: 100
      },
      include: {
        createdBy: { select: { id: true, displayName: true } }
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'forum_category.created',
      'ForumCategorySetting',
      created.id,
      { slug, name },
      request
    );

    return this.toCustomCategoryPayload(created);
  }

  async deleteCustomCategory(actor: AuthenticatedUser, categoryId: string, request: Request) {
    this.assertOrganization(actor);
    this.assertAdmin(actor.role);

    const existing = await this.prisma.forumCategorySetting.findFirst({
      where: { id: categoryId, organizationId: actor.organizationId! }
    });

    if (!existing) {
      throw new NotFoundException('Forum-Kategorie nicht gefunden.');
    }

    const postCount = await this.prisma.forumPost.count({
      where: {
        organizationId: actor.organizationId!,
        category: existing.slug
      }
    });

    if (postCount > 0) {
      throw new BadRequestException(
        'Kategorie enthält noch Beiträge. Bitte zuerst alle Beiträge löschen.'
      );
    }

    await this.prisma.forumCategorySetting.delete({ where: { id: existing.id } });

    await this.auditLogService.writeForUser(
      actor,
      'forum_category.deleted',
      'ForumCategorySetting',
      existing.id,
      { slug: existing.slug, name: existing.name },
      request
    );

    return { id: existing.id, slug: existing.slug };
  }

  private toCustomCategoryPayload(entry: {
    id: string;
    slug: string;
    name: string;
    icon: string;
    colorKey: string;
    description: string | null;
    order: number;
    createdAt: Date;
    createdBy: { id: string; displayName: string } | null;
  }) {
    return {
      id: entry.slug,
      slug: entry.slug,
      customId: entry.id,
      name: entry.name,
      icon: entry.icon,
      colorKey: entry.colorKey,
      description: entry.description ?? '',
      order: entry.order,
      custom: true,
      canRead: true,
      canPost: true,
      canDelete: true,
      category: entry.slug,
      count: 0,
      createdAt: entry.createdAt.toISOString(),
      createdBy: entry.createdBy
        ? { id: entry.createdBy.id, displayName: entry.createdBy.displayName }
        : null
    };
  }

  async listPosts(actor: AuthenticatedUser, query: ListForumPostsQueryDto) {
    this.assertOrganization(actor);
    const category = await this.resolveCategorySlug(actor, query.category);
    await this.assertCanReadCategoryAsync(actor, category);

    const limit = query.limit ?? 50;
    const whereClause = {
      organizationId: actor.organizationId!,
      category
    };
    const orderBy = [
      { pinned: 'desc' as const },
      { lastReplyAt: 'desc' as const },
      { id: 'desc' as const }
    ];

    const sortForumPosts = (list: ForumPostRecord[]) =>
      list.sort((left, right) => {
        if (left.pinned !== right.pinned) {
          return left.pinned ? -1 : 1;
        }
        const leftActivity = left.lastReplyAt?.getTime() ?? left.createdAt.getTime();
        const rightActivity = right.lastReplyAt?.getTime() ?? right.createdAt.getTime();
        if (leftActivity !== rightActivity) {
          return rightActivity - leftActivity;
        }
        return right.createdAt.getTime() - left.createdAt.getTime();
      });

    if (query.cursor) {
      const posts = await this.prisma.forumPost.findMany({
        where: whereClause,
        select: forumPostSelect,
        take: limit + 1,
        cursor: { id: query.cursor },
        skip: 1,
        orderBy
      });
      const hasMore = posts.length > limit;
      const page = hasMore ? posts.slice(0, limit) : posts;
      return {
        items: sortForumPosts(page).map((entry) => this.toForumPostPayload(entry)),
        nextCursor: hasMore ? page[page.length - 1]?.id ?? null : null
      };
    }

    const posts = await this.prisma.forumPost.findMany({
      where: whereClause,
      select: forumPostSelect,
      take: limit,
      skip: query.offset ?? 0,
      orderBy
    });

    return sortForumPosts(posts).map((entry) => this.toForumPostPayload(entry));
  }

  async getThread(actor: AuthenticatedUser, postId: string) {
    this.assertOrganization(actor);

    const post = await this.prisma.forumPost.findFirst({
      where: {
        id: postId,
        organizationId: actor.organizationId!
      },
      select: forumPostSelect
    });

    if (!post) {
      throw new NotFoundException('Forum post not found.');
    }

    await this.assertCanReadCategoryAsync(actor, post.category);

    const replies = await this.prisma.forumReply.findMany({
      where: {
        organizationId: actor.organizationId!,
        postId: post.id
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: forumReplySelect
    });

    return {
      post: this.toForumPostPayload(post),
      replies: replies.map((entry: ForumReplyRecord) => this.toForumReplyPayload(entry))
    };
  }

  async createPost(actor: AuthenticatedUser, dto: CreateForumPostDto, request: Request) {
    this.assertOrganization(actor);

    const category = await this.resolveCategorySlug(actor, dto.category);
    await this.assertCanPostCategoryAsync(actor, category);

    const title = this.sanitizeText(dto.title, 'title', 200);
    const content = this.sanitizeText(dto.content, 'content', 6000);

    const created = await this.prisma.forumPost.create({
      data: {
        organizationId: actor.organizationId!,
        userId: actor.id,
        category,
        title,
        content
      },
      select: forumPostSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'forum_post.created',
      'ForumPost',
      created.id,
      {
        category
      },
      request
    );

    return this.toForumPostPayload(created);
  }

  async createReply(
    actor: AuthenticatedUser,
    postId: string,
    dto: CreateForumReplyDto,
    request: Request
  ) {
    this.assertOrganization(actor);

    const post = await this.prisma.forumPost.findFirst({
      where: {
        id: postId,
        organizationId: actor.organizationId!
      },
      select: forumPostSelect
    });

    if (!post) {
      throw new NotFoundException('Forum post not found.');
    }

    const category = post.category;
    await this.assertCanReadCategoryAsync(actor, category);
    await this.assertCanPostCategoryAsync(actor, category);

    if (post.locked) {
      throw new ForbiddenException('This forum thread is locked.');
    }

    const content = this.sanitizeText(dto.content, 'content', 4000);

    const createdReply = await this.prisma.$transaction(async (transaction) => {
      const reply = await transaction.forumReply.create({
        data: {
          organizationId: actor.organizationId!,
          postId: post.id,
          userId: actor.id,
          content
        },
        select: forumReplySelect
      });

      await transaction.forumPost.update({
        where: {
          id: post.id
        },
        data: {
          lastReplyAt: reply.createdAt
        }
      });

      return reply;
    });

    if (post.userId !== actor.id) {
      await this.notificationsService.createForUser(post.userId, {
        title: 'Neue Forum-Antwort',
        message: `${actor.displayName} hat auf dein Thema "${post.title}" geantwortet.`,
        type: NotificationType.INFO,
        metadata: {
          eventType: 'FORUM_REPLY_CREATED',
          postId: post.id
        }
      });
    }

    await this.auditLogService.writeForUser(
      actor,
      'forum_reply.created',
      'ForumReply',
      createdReply.id,
      {
        postId: post.id,
        category
      },
      request
    );

    return this.getThread(actor, post.id);
  }

  async deletePost(actor: AuthenticatedUser, postId: string, request: Request) {
    this.assertOrganization(actor);

    const post = await this.prisma.forumPost.findFirst({
      where: {
        id: postId,
        organizationId: actor.organizationId!
      },
      select: forumPostSelect
    });

    if (!post) {
      throw new NotFoundException('Forum post not found.');
    }

    const canDeleteAsAdmin = this.isAdmin(actor.role);
    const canDeleteOwnWithoutReplies = post.userId === actor.id && post._count.replies === 0;

    if (!canDeleteAsAdmin && !canDeleteOwnWithoutReplies) {
      throw new ForbiddenException(
        'Only admins may delete forum topics with existing replies.'
      );
    }

    await this.prisma.forumPost.delete({
      where: {
        id: post.id
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'forum_post.deleted',
      'ForumPost',
      post.id,
      {
        category: post.category,
        ownerUserId: post.userId,
        replyCount: post._count.replies
      },
      request
    );

    return { id: post.id };
  }

  async deleteReply(actor: AuthenticatedUser, replyId: string, request: Request) {
    this.assertOrganization(actor);

    const reply = await this.prisma.forumReply.findFirst({
      where: {
        id: replyId,
        organizationId: actor.organizationId!
      },
      select: {
        ...forumReplySelect,
        post: {
          select: {
            id: true,
            category: true
          }
        }
      }
    });

    if (!reply) {
      throw new NotFoundException('Forum reply not found.');
    }

    if (!this.isAdmin(actor.role) && reply.userId !== actor.id) {
      throw new ForbiddenException('You may only delete your own forum replies.');
    }

    await this.prisma.$transaction(async (transaction) => {
      await transaction.forumReply.delete({
        where: {
          id: reply.id
        }
      });

      const latestReply = await transaction.forumReply.findFirst({
        where: {
          postId: reply.postId
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          createdAt: true
        }
      });

      await transaction.forumPost.update({
        where: {
          id: reply.postId
        },
        data: {
          lastReplyAt: latestReply?.createdAt ?? null
        }
      });
    });

    await this.auditLogService.writeForUser(
      actor,
      'forum_reply.deleted',
      'ForumReply',
      reply.id,
      {
        postId: reply.postId,
        category: reply.post.category,
        ownerUserId: reply.userId
      },
      request
    );

    return { id: reply.id, postId: reply.postId };
  }

  async togglePin(actor: AuthenticatedUser, postId: string, request: Request) {
    this.assertOrganization(actor);
    this.assertAdmin(actor.role);

    const post = await this.prisma.forumPost.findFirst({
      where: {
        id: postId,
        organizationId: actor.organizationId!
      },
      select: forumPostSelect
    });

    if (!post) {
      throw new NotFoundException('Forum post not found.');
    }

    const updated = await this.prisma.forumPost.update({
      where: {
        id: post.id
      },
      data: {
        pinned: !post.pinned
      },
      select: forumPostSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'forum_post.pin_toggled',
      'ForumPost',
      updated.id,
      {
        pinned: updated.pinned,
        category: updated.category
      },
      request
    );

    return this.toForumPostPayload(updated);
  }

  async toggleLock(actor: AuthenticatedUser, postId: string, request: Request) {
    this.assertOrganization(actor);
    this.assertAdmin(actor.role);

    const post = await this.prisma.forumPost.findFirst({
      where: {
        id: postId,
        organizationId: actor.organizationId!
      },
      select: forumPostSelect
    });

    if (!post) {
      throw new NotFoundException('Forum post not found.');
    }

    const updated = await this.prisma.forumPost.update({
      where: {
        id: post.id
      },
      data: {
        locked: !post.locked
      },
      select: forumPostSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'forum_post.lock_toggled',
      'ForumPost',
      updated.id,
      {
        locked: updated.locked,
        category: updated.category
      },
      request
    );

    return this.toForumPostPayload(updated);
  }

  private toForumPostPayload(entry: ForumPostRecord) {
    return {
      id: entry.id,
      category: entry.category,
      title: entry.title,
      content: entry.content,
      pinned: entry.pinned,
      locked: entry.locked,
      lastReplyAt: entry.lastReplyAt?.toISOString() ?? null,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      replyCount: entry._count.replies,
      userId: entry.userId,
      user: {
        id: entry.user.id,
        displayName: entry.user.displayName,
        role: entry.user.role
      }
    };
  }

  private toForumReplyPayload(entry: ForumReplyRecord) {
    return {
      id: entry.id,
      postId: entry.postId,
      content: entry.content,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      userId: entry.userId,
      user: {
        id: entry.user.id,
        displayName: entry.user.displayName,
        role: entry.user.role
      }
    };
  }

  private normalizeCategory(value: string): ForumCategoryId {
    const normalized = String(value || '').trim().toLowerCase();
    if (!FORUM_CATEGORY_IDS.includes(normalized as ForumCategoryId)) {
      throw new BadRequestException('Forum category is invalid.');
    }

    return normalized as ForumCategoryId;
  }

  private async resolveCategorySlug(actor: AuthenticatedUser, value: string): Promise<string> {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized) {
      throw new BadRequestException('Forum category is invalid.');
    }
    if (isBuiltInForumCategory(normalized)) {
      return normalized;
    }
    const custom = await this.prisma.forumCategorySetting.findFirst({
      where: { organizationId: actor.organizationId!, slug: normalized }
    });
    if (!custom) {
      throw new BadRequestException('Forum category is invalid.');
    }
    return custom.slug;
  }

  private async assertCanReadCategoryAsync(actor: AuthenticatedUser, slug: string) {
    if (isBuiltInForumCategory(slug)) {
      this.assertCanReadCategory(actor.role, slug);
      return;
    }
    const custom = await this.prisma.forumCategorySetting.findFirst({
      where: { organizationId: actor.organizationId!, slug }
    });
    if (!custom) {
      throw new ForbiddenException('You may not access this forum category.');
    }
  }

  private async assertCanPostCategoryAsync(actor: AuthenticatedUser, slug: string) {
    if (isBuiltInForumCategory(slug)) {
      this.assertCanPostCategory(actor.role, slug);
      return;
    }
    const custom = await this.prisma.forumCategorySetting.findFirst({
      where: { organizationId: actor.organizationId!, slug }
    });
    if (!custom) {
      throw new ForbiddenException('You may not post in this forum category.');
    }
  }

  private sanitizeSlug(value: string) {
    const slug = String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (slug.length < 2 || slug.length > 32) {
      throw new BadRequestException('Slug must be 2-32 characters (a-z, 0-9, hyphen).');
    }
    return slug;
  }

  private sanitizeIcon(value: string) {
    const icon = String(value || '').trim();
    if (!icon) {
      throw new BadRequestException('Icon is required.');
    }
    if (icon.length > 8) {
      throw new BadRequestException('Icon may be at most 8 characters (emoji).');
    }
    return icon;
  }

  private sanitizeColorKey(value: string | undefined) {
    const colorKey = String(value || 'slate').trim().toLowerCase();
    if (!(FORUM_CUSTOM_COLOR_KEYS as readonly string[]).includes(colorKey)) {
      throw new BadRequestException('colorKey is invalid.');
    }
    return colorKey;
  }

  private assertOrganization(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }
  }

  private assertCanReadCategory(role: AppRole, category: ForumCategoryId) {
    if (!this.canReadCategory(role, category)) {
      throw new ForbiddenException('You may not access this forum category.');
    }
  }

  private assertCanPostCategory(role: AppRole, category: ForumCategoryId) {
    if (!this.canPostCategory(role, category)) {
      throw new ForbiddenException('You may not post in this forum category.');
    }
  }

  private assertAdmin(role: AppRole) {
    if (!this.isAdmin(role)) {
      throw new ForbiddenException('Only admins may moderate forum topics.');
    }
  }

  private canReadCategory(role: AppRole, category: ForumCategoryId) {
    const rule = FORUM_CATEGORY_RULES.find((entry) => entry.id === category);
    if (!rule) {
      return false;
    }

    return rule.readRoles === 'all' || rule.readRoles.includes(role);
  }

  private canPostCategory(role: AppRole, category: ForumCategoryId) {
    const rule = FORUM_CATEGORY_RULES.find((entry) => entry.id === category);
    if (!rule) {
      return false;
    }

    return rule.postRoles === 'all' || rule.postRoles.includes(role);
  }

  private isAdmin(role: AppRole) {
    return role === AppRole.ADMIN;
  }

  private sanitizeText(value: string, field: string, maxLength: number) {
    const sanitized = sanitizeHtml(String(value || ''), {
      allowedTags: [],
      allowedAttributes: {}
    })
      .replace(/\r\n/g, '\n')
      .trim();

    if (!sanitized) {
      throw new BadRequestException(`${field} is empty after sanitization.`);
    }

    if (sanitized.length > maxLength) {
      throw new BadRequestException(`${field} exceeds the maximum allowed length.`);
    }

    return sanitized;
  }
}
