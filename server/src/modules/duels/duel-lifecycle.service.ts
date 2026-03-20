import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DuelsService } from './duels.service';

@Injectable()
export class DuelLifecycleService {
  private readonly logger = new Logger(DuelLifecycleService.name);

  constructor(private readonly duelsService: DuelsService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async reconcileLifecycle() {
    try {
      const result = await this.duelsService.reconcileDueDuelsAndReminders();
      if (result.expiredCount > 0 || result.remindedCount > 0) {
        this.logger.log(
          `Duel lifecycle reconciliation finished: ${result.expiredCount} expired, ${result.remindedCount} reminders.`
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown lifecycle reconciliation failure.';
      this.logger.error(message);
    }
  }
}
