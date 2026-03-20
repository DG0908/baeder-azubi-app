import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ReportBooksController } from './report-books.controller';
import { ReportBooksService } from './report-books.service';

@Module({
  imports: [CommonModule, NotificationsModule],
  controllers: [ReportBooksController],
  providers: [ReportBooksService]
})
export class ReportBooksModule {}
