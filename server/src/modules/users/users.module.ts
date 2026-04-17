import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { RetentionSchedulerService } from './retention-scheduler.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [CommonModule],
  controllers: [UsersController],
  providers: [UsersService, RetentionSchedulerService],
  exports: [UsersService]
})
export class UsersModule {}
