import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { UserStatsService } from './user-stats.service';

@Controller('user-stats')
export class UserStatsController {
  constructor(private readonly userStatsService: UserStatsService) {}

  @Get('me')
  getMine(@CurrentUser() actor: AuthenticatedUser) {
    return this.userStatsService.getMine(actor);
  }

  @Get('summary')
  listSummary(@CurrentUser() actor: AuthenticatedUser) {
    return this.userStatsService.listSummary(actor);
  }

  @Roles(AppRole.ADMIN)
  @Post('repair-quiz-stats')
  repairQuizStats(@CurrentUser() actor: AuthenticatedUser, @Req() request: Request) {
    return this.userStatsService.repairQuizStats(actor, request);
  }
}
