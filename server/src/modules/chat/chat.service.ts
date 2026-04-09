import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AccountStatus, AppRole, ChatScope, NotificationType, Prisma } from '@prisma/client';
import { Request } from 'express';
import sanitizeHtml from 'sanitize-html';
import { AuditLogService } from '../../common/services/audit-log.service';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ListChatMessagesQueryDto } from './dto/list-chat-messages-query.dto';

const SELF_DELETE_WINDOW_MS = 10 * 60 * 1000;
const DELETED_MESSAGE_PLACEHOLDER = 'Nachricht wurde gelöscht.';
const MODERATED_MESSAGE_PLACEHOLDER = 'Nachricht wurde von einem Admin entfernt.';

const messageSelect = {
  id: true,
  organizationId: true,
  scope: true,
  content: true,
  senderId: true,
  recipientId: true,
  createdAt: true,
  deletedAt: true,
  deletedByUserId: true,
  sender: {
    select: {
      id: true,
      displayName: true,
      role: true,
      avatar: true
    }
  },
  recipient: {
    select: {
      id: true,
      displayName: true,
      role: true,
      avatar: true
    }
  }
} satisfies Prisma.ChatMessageSelect;

type ChatMessageRecord = Prisma.ChatMessageGetPayload<{ select: typeof messageSelect }>;

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly auditLogService: AuditLogService
  ) {}

  async listMessages(actor: AuthenticatedUser, query: ListChatMessagesQueryDto) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }

    const scope = query.scope ?? ChatScope.STAFF_ROOM;
    const recipientId = scope === ChatScope.DIRECT_STAFF ? query.recipientId ?? null : null;

    await this.assertScopeAccess(actor, scope, recipientId);

    const where: Prisma.ChatMessageWhereInput = {
      organizationId: actor.organizationId,
      scope
    };

    if (scope === ChatScope.DIRECT_STAFF && recipientId) {
      where.OR = [
        {
          senderId: actor.id,
          recipientId
        },
        {
          senderId: recipientId,
          recipientId: actor.id
        }
      ];
    }

    const messages = await this.prisma.chatMessage.findMany({
      where,
      take: query.limit ?? 50,
      orderBy: {
        createdAt: 'asc'
      },
      select: messageSelect
    });

    return messages.map((message) => this.serializeMessage(message));
  }

  async createMessage(actor: AuthenticatedUser, dto: CreateChatMessageDto) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }

    const recipientId = dto.scope === ChatScope.DIRECT_STAFF ? dto.recipientId ?? null : null;
    await this.assertScopeAccess(actor, dto.scope, recipientId);

    const sanitizedContent = sanitizeHtml(dto.content, {
      allowedTags: [],
      allowedAttributes: {}
    })
      .replace(/\r\n/g, '\n')
      .trim();

    if (!sanitizedContent) {
      throw new BadRequestException('Message content is empty after sanitization.');
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        organizationId: actor.organizationId,
        scope: dto.scope,
        senderId: actor.id,
        recipientId,
        content: sanitizedContent
      },
      select: messageSelect
    });

    if (dto.scope === ChatScope.DIRECT_STAFF && recipientId) {
      const preview = sanitizedContent.slice(0, 80);
      await this.notificationsService.createForUser(recipientId, {
        title: 'Neue Chatnachricht',
        message: `${actor.displayName}: ${preview}${sanitizedContent.length > 80 ? '...' : ''}`,
        type: NotificationType.INFO,
        metadata: {
          scope: dto.scope,
          senderId: actor.id,
          recipientId
        }
      });
    }

    return this.serializeMessage(message);
  }

  async deleteMessage(actor: AuthenticatedUser, messageId: string, request: Request) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }

    const message = await this.prisma.chatMessage.findFirst({
      where: {
        id: messageId,
        organizationId: actor.organizationId
      },
      select: messageSelect
    });

    if (!message) {
      throw new NotFoundException('Chat message not found.');
    }

    if (message.deletedAt) {
      return this.serializeMessage(message);
    }

    const now = Date.now();
    const messageCreatedAt = new Date(message.createdAt).getTime();
    const isOwner = message.senderId === actor.id;
    const isAdmin = actor.role === AppRole.ADMIN;
    const canDeleteOwnMessage = isOwner && now - messageCreatedAt <= SELF_DELETE_WINDOW_MS;

    if (!isAdmin && !canDeleteOwnMessage) {
      throw new ForbiddenException('You may only delete your own messages shortly after sending them.');
    }

    const updatedMessage = await this.prisma.chatMessage.update({
      where: {
        id: message.id
      },
      data: {
        deletedAt: new Date(),
        deletedByUserId: actor.id
      },
      select: messageSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      isAdmin && !isOwner ? 'chat_message.moderated' : 'chat_message.deleted',
      'ChatMessage',
      updatedMessage.id,
      {
        scope: updatedMessage.scope,
        senderId: updatedMessage.senderId,
        recipientId: updatedMessage.recipientId,
        deleteMode: isAdmin && !isOwner ? 'admin_moderation' : 'self_delete'
      },
      request
    );

    return this.serializeMessage(updatedMessage);
  }

  private async assertScopeAccess(
    actor: AuthenticatedUser,
    scope: ChatScope,
    recipientId: string | null
  ) {
    if (scope === ChatScope.AZUBI_ROOM && !this.isApprentice(actor.role)) {
      throw new ForbiddenException('Only apprentices may access the apprentice room.');
    }

    if (scope !== ChatScope.DIRECT_STAFF && recipientId) {
      throw new BadRequestException('recipientId is only allowed for direct staff chat.');
    }

    if (scope === ChatScope.DIRECT_STAFF) {
      if (!recipientId) {
        throw new BadRequestException('recipientId is required for direct chat.');
      }

      const recipient = await this.prisma.user.findFirst({
        where: {
          id: recipientId,
          organizationId: actor.organizationId,
          status: AccountStatus.APPROVED,
          isDeleted: false
        },
        select: {
          id: true,
          role: true
        }
      });

      if (!recipient) {
        throw new NotFoundException('Recipient was not found in your organization.');
      }

      const isValidPair =
        (this.isApprentice(actor.role) && this.isStaff(recipient.role)) ||
        (this.isStaff(actor.role) && this.isApprentice(recipient.role));

      if (!isValidPair) {
        throw new ForbiddenException(
          'Direct chat is only allowed between apprentices and staff in the same organization.'
        );
      }
    }
  }

  private isApprentice(role: AppRole): boolean {
    return role === AppRole.AZUBI || role === AppRole.RETTUNGSSCHWIMMER_AZUBI;
  }

  private isStaff(role: AppRole): boolean {
    return role === AppRole.ADMIN || role === AppRole.AUSBILDER;
  }

  private serializeMessage(message: ChatMessageRecord) {
    return {
      ...message,
      content: message.deletedAt
        ? (message.deletedByUserId === message.senderId ? DELETED_MESSAGE_PLACEHOLDER : MODERATED_MESSAGE_PLACEHOLDER)
        : message.content
    };
  }
}
