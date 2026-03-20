import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SwimTrainingPlansModule } from '../swim-training-plans/swim-training-plans.module';
import { UserStatsModule } from '../user-stats/user-stats.module';
import { SwimSessionsController } from './swim-sessions.controller';
import { SwimSessionsService } from './swim-sessions.service';

@Module({
  imports: [CommonModule, NotificationsModule, SwimTrainingPlansModule, UserStatsModule],
  controllers: [SwimSessionsController],
  providers: [SwimSessionsService]
})
export class SwimSessionsModule {}
