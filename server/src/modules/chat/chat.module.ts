import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [CommonModule, NotificationsModule],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
