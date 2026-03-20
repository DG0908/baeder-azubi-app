import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { UserStatsController } from './user-stats.controller';
import { UserStatsService } from './user-stats.service';

@Module({
  imports: [CommonModule],
  controllers: [UserStatsController],
  providers: [UserStatsService],
  exports: [UserStatsService]
})
export class UserStatsModule {}
