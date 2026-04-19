import { IsIn, IsNotEmpty } from 'class-validator';
import { FEATURE_STAGES, FeatureStage } from '../feature-registry';

export class UpdateFeatureStageDto {
  @IsNotEmpty()
  @IsIn(FEATURE_STAGES as readonly string[])
  stage!: FeatureStage;
}
