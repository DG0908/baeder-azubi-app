import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserStatsModule } from '../user-stats/user-stats.module';
import { FlashcardsController } from './flashcards.controller';
import { FlashcardsService } from './flashcards.service';

@Module({
  imports: [CommonModule, NotificationsModule, UserStatsModule],
  controllers: [FlashcardsController],
  providers: [FlashcardsService]
})
export class FlashcardsModule {}
