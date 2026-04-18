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
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { CreateForumReplyDto } from './dto/create-forum-reply.dto';
import { ListForumPostsQueryDto } from './dto/list-forum-posts-query.dto';
import {
  FORUM_CATEGORY_IDS,
  FORUM_CATEGORY_RULES,
  ForumCategoryId
} from './forum-categories';

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

    const readableCategories = FORUM_CATEGORY_RULES
      .filter((rule) => this.canReadCategory(actor.role, rule.id))
      .map((rule) => rule.id);

    const grouped = readableCategories.length > 0
      ? await this.prisma.forumPost.groupBy({
          by: ['category'],
          where: {
            organizationId: actor.organizationId!,
            category: {
              in: readableCategories
            }
          },
          _count: {
            _all: true
          }
        })
      : [];

    return readableCategories.map((category) => ({
      category,
      count: grouped.find((entry) => entry.category === category)?._count._all ?? 0
    }));
  }

  async listPosts(actor: AuthenticatedUser, query: ListForumPostsQueryDto) {
    this.assertOrganization(actor);
    const category = this.normalizeCategory(query.category);
    this.assertCanReadCategory(actor.role, category);

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

    this.assertCanReadCategory(actor.role, this.normalizeCategory(post.category));

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

    const category = this.normalizeCategory(dto.category);
    this.assertCanPostCategory(actor.role, category);

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

    const category = this.normalizeCategory(post.category);
    this.assertCanReadCategory(actor.role, category);
    this.assertCanPostCategory(actor.role, category);

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
