import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AccountStatus, AppRole, ChatScope, NotificationType, Prisma } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ListChatMessagesQueryDto } from './dto/list-chat-messages-query.dto';

const messageSelect = {
  id: true,
  scope: true,
  content: true,
  createdAt: true,
  sender: {
    select: {
      id: true,
      displayName: true,
      role: true
    }
  },
  recipient: {
    select: {
      id: true,
      displayName: true,
      role: true
    }
  }
} satisfies Prisma.ChatMessageSelect;

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService
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

    return this.prisma.chatMessage.findMany({
      where,
      take: query.limit ?? 50,
      orderBy: {
        createdAt: 'asc'
      },
      select: messageSelect
    });
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

    return message;
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
}
