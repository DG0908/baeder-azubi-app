import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { QuestionWorkflowsController } from './question-workflows.controller';
import { QuestionWorkflowsService } from './question-workflows.service';

@Module({
  imports: [CommonModule, NotificationsModule],
  controllers: [QuestionWorkflowsController],
  providers: [QuestionWorkflowsService]
})
export class QuestionWorkflowsModule {}
