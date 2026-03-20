import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { DuelLifecycleService } from './duel-lifecycle.service';
import { DuelsController } from './duels.controller';
import { DuelsService } from './duels.service';

@Module({
  imports: [CommonModule, NotificationsModule],
  controllers: [DuelsController],
  providers: [DuelsService, DuelLifecycleService]
})
export class DuelsModule {}
