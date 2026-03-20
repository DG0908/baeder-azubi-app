import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
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
}
