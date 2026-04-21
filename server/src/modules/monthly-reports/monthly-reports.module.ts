import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MonthlyReportsController } from './monthly-reports.controller';
import { MonthlyReportsService } from './monthly-reports.service';

@Module({
  imports: [CommonModule, NotificationsModule],
  controllers: [MonthlyReportsController],
  providers: [MonthlyReportsService]
})
export class MonthlyReportsModule {}
