import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateDuelDto } from './dto/create-duel.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { UpdateDuelStateDto } from './dto/update-duel-state.dto';
import { DuelsService } from './duels.service';

@Controller('duels')
export class DuelsController {
  constructor(private readonly duelsService: DuelsService) {}

  @Allow()
  @Get()
  listMine(@CurrentUser() actor: AuthenticatedUser) {
    return this.duelsService.listMine(actor);
  }

  @Allow()
  @Get('leaderboard')
  leaderboard(@CurrentUser() actor: AuthenticatedUser) {
    return this.duelsService.leaderboard(actor);
  }

  @Allow()
  @Get(':id')
  getOne(@CurrentUser() actor: AuthenticatedUser, @Param('id') duelId: string) {
    return this.duelsService.getOne(actor, duelId);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Post()
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateDuelDto,
    @Req() request: Request
  ) {
    return this.duelsService.create(actor, dto, request);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Post(':id/accept')
  accept(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') duelId: string,
    @Req() request: Request
  ) {
    return this.duelsService.accept(actor, duelId, request);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 60 } })
  @Patch(':id/state')
  updateGameState(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') duelId: string,
    @Body() body: UpdateDuelStateDto
  ) {
    return this.duelsService.updateGameState(actor, duelId, body.gameState);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 5 } })
  @Post(':id/forfeit')
  forfeit(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') duelId: string,
    @Req() request: Request
  ) {
    return this.duelsService.forfeit(actor, duelId, request);
  }

  @Allow()
  @Throttle({ default: { ttl: 60000, limit: 30 } })
  @Post(':id/answers')
  submitAnswer(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') duelId: string,
    @Body() dto: SubmitAnswerDto,
    @Req() request: Request
  ) {
    return this.duelsService.submitAnswer(actor, duelId, dto, request);
  }
}
