import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';

@Module({
  imports: [CommonModule, NotificationsModule],
  controllers: [ForumController],
  providers: [ForumService]
})
export class ForumModule {}
