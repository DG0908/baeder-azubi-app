import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [CommonModule, NotificationsModule],
  controllers: [ContentController],
  providers: [ContentService]
})
export class ContentModule {}
