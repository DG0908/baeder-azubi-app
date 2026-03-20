import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserStatsModule } from '../user-stats/user-stats.module';
import { ExamSimulatorController } from './exam-simulator.controller';
import { ExamSimulatorService } from './exam-simulator.service';

@Module({
  imports: [CommonModule, NotificationsModule, UserStatsModule],
  controllers: [ExamSimulatorController],
  providers: [ExamSimulatorService]
})
export class ExamSimulatorModule {}
