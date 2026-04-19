import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { FeatureRolloutService } from './feature-rollout.service';

@ApiTags('features')
@Controller()
export class FeatureRolloutController {
  constructor(private readonly featureRolloutService: FeatureRolloutService) {}

  @Allow()
  @Get('users/me/features')
  async myFeatures(@CurrentUser() user: AuthenticatedUser) {
    return this.featureRolloutService.getAccessMapForUser(user);
  }
}
