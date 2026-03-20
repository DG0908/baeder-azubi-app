import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SwimTrainingPlansController } from './swim-training-plans.controller';
import { SwimTrainingPlansService } from './swim-training-plans.service';

@Module({
  imports: [CommonModule, NotificationsModule],
  controllers: [SwimTrainingPlansController],
  providers: [SwimTrainingPlansService],
  exports: [SwimTrainingPlansService]
})
export class SwimTrainingPlansModule {}
