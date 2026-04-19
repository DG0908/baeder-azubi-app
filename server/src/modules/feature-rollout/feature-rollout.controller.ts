import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { UpdateBetaTesterDto } from './dto/update-beta-tester.dto';
import { UpdateFeatureOverridesDto } from './dto/update-feature-overrides.dto';
import { UpdateFeatureStageDto } from './dto/update-feature-stage.dto';
import { FeatureRolloutService } from './feature-rollout.service';

@ApiTags('features')
@Controller()
export class FeatureRolloutController {
  constructor(private readonly featureRolloutService: FeatureRolloutService) {}

  @Allow()
  @Get('users/me/features')
  myFeatures(@CurrentUser() user: AuthenticatedUser) {
    return this.featureRolloutService.getAccessMapForUser(user);
  }

  @Roles(AppRole.ADMIN)
  @Get('admin/feature-rollout')
  snapshot(@CurrentUser() actor: AuthenticatedUser) {
    return this.featureRolloutService.getRolloutSnapshot(actor);
  }

  @Roles(AppRole.ADMIN)
  @Patch('admin/feature-rollout/features/:key/stage')
  updateStage(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('key') featureKey: string,
    @Body() dto: UpdateFeatureStageDto,
    @Req() request: Request
  ) {
    return this.featureRolloutService.setFeatureStage(actor, featureKey, dto.stage, request);
  }

  @Roles(AppRole.ADMIN)
  @Patch('admin/feature-rollout/users/:id/beta-tester')
  updateBetaTester(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') targetUserId: string,
    @Body() dto: UpdateBetaTesterDto,
    @Req() request: Request
  ) {
    return this.featureRolloutService.setBetaTester(actor, targetUserId, dto.isBetaTester, request);
  }

  @Roles(AppRole.ADMIN)
  @Patch('admin/feature-rollout/users/:id/overrides')
  updateOverrides(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') targetUserId: string,
    @Body() dto: UpdateFeatureOverridesDto,
    @Req() request: Request
  ) {
    return this.featureRolloutService.setFeatureOverrides(
      actor,
      targetUserId,
      dto.featureOverrides,
      request
    );
  }
}
