import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SchoolAttendanceController } from './school-attendance.controller';
import { SchoolAttendanceService } from './school-attendance.service';

@Module({
  imports: [CommonModule, NotificationsModule],
  controllers: [SchoolAttendanceController],
  providers: [SchoolAttendanceService]
})
export class SchoolAttendanceModule {}
