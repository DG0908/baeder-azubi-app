import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ListChatMessagesQueryDto } from './dto/list-chat-messages-query.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Allow()
  @Get('messages')
  listMessages(
    @CurrentUser() actor: AuthenticatedUser,
    @Query() query: ListChatMessagesQueryDto
  ) {
    return this.chatService.listMessages(actor, query);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 20 } })
  @Post('messages')
  createMessage(@CurrentUser() actor: AuthenticatedUser, @Body() dto: CreateChatMessageDto) {
    return this.chatService.createMessage(actor, dto);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Delete('messages/:id')
  deleteMessage(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') messageId: string,
    @Req() request: Request
  ) {
    return this.chatService.deleteMessage(actor, messageId, request);
  }
}
