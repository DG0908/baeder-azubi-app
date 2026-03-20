import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ExamGradesController } from './exam-grades.controller';
import { ExamGradesService } from './exam-grades.service';

@Module({
  imports: [CommonModule, NotificationsModule],
  controllers: [ExamGradesController],
  providers: [ExamGradesService]
})
export class ExamGradesModule {}
