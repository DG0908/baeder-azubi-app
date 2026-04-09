import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ListChatMessagesQueryDto } from './dto/list-chat-messages-query.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  listMessages(
    @CurrentUser() actor: AuthenticatedUser,
    @Query() query: ListChatMessagesQueryDto
  ) {
    return this.chatService.listMessages(actor, query);
  }

  @Post('messages')
  createMessage(@CurrentUser() actor: AuthenticatedUser, @Body() dto: CreateChatMessageDto) {
    return this.chatService.createMessage(actor, dto);
  }

  @Roles(AppRole.ADMIN)
  @Delete('messages/:id')
  deleteMessage(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') messageId: string,
    @Req() request: Request
  ) {
    return this.chatService.deleteMessage(actor, messageId, request);
  }
}
