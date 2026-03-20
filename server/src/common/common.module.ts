import { Module } from '@nestjs/common';
import { AuditLogService } from './services/audit-log.service';
import { MailerService } from './services/mailer.service';

@Module({
  providers: [AuditLogService, MailerService],
  exports: [AuditLogService, MailerService]
})
export class CommonModule {}
