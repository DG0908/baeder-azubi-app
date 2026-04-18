import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateSwimTrainingPlanDto } from './dto/create-swim-training-plan.dto';
import { SwimTrainingPlansService } from './swim-training-plans.service';

@ApiTags('swim-training-plans')
@Controller('swim-training-plans')
export class SwimTrainingPlansController {
  constructor(private readonly swimTrainingPlansService: SwimTrainingPlansService) {}

  @Allow()
  @Get()
  list(@CurrentUser() actor: AuthenticatedUser) {
    return this.swimTrainingPlansService.list(actor);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 15 } })
  @Post()
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateSwimTrainingPlanDto,
    @Req() request: Request
  ) {
    return this.swimTrainingPlansService.create(actor, dto, request);
  }
}
