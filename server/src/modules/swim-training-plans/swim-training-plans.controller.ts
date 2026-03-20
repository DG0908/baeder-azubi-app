import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateSwimTrainingPlanDto } from './dto/create-swim-training-plan.dto';
import { SwimTrainingPlansService } from './swim-training-plans.service';

@Controller('swim-training-plans')
export class SwimTrainingPlansController {
  constructor(private readonly swimTrainingPlansService: SwimTrainingPlansService) {}

  @Get()
  list(@CurrentUser() actor: AuthenticatedUser) {
    return this.swimTrainingPlansService.list(actor);
  }

  @Post()
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateSwimTrainingPlanDto,
    @Req() request: Request
  ) {
    return this.swimTrainingPlansService.create(actor, dto, request);
  }
}
