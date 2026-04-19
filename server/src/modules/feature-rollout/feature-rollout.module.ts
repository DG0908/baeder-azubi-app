import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { FeatureRolloutController } from './feature-rollout.controller';
import { FeatureRolloutService } from './feature-rollout.service';

@Module({
  imports: [CommonModule],
  controllers: [FeatureRolloutController],
  providers: [FeatureRolloutService],
  exports: [FeatureRolloutService]
})
export class FeatureRolloutModule {}
