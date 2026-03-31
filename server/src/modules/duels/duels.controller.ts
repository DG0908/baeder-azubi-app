import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateDuelDto } from './dto/create-duel.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { UpdateDuelStateDto } from './dto/update-duel-state.dto';
import { DuelsService } from './duels.service';

@Controller('duels')
export class DuelsController {
  constructor(private readonly duelsService: DuelsService) {}

  @Get()
  listMine(@CurrentUser() actor: AuthenticatedUser) {
    return this.duelsService.listMine(actor);
  }

  @Get('leaderboard')
  leaderboard(@CurrentUser() actor: AuthenticatedUser) {
    return this.duelsService.leaderboard(actor);
  }

  @Get(':id')
  getOne(@CurrentUser() actor: AuthenticatedUser, @Param('id') duelId: string) {
    return this.duelsService.getOne(actor, duelId);
  }

  @Post()
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateDuelDto,
    @Req() request: Request
  ) {
    return this.duelsService.create(actor, dto, request);
  }

  @Post(':id/accept')
  accept(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') duelId: string,
    @Req() request: Request
  ) {
    return this.duelsService.accept(actor, duelId, request);
  }

  @Patch(':id/state')
  updateGameState(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') duelId: string,
    @Body() body: UpdateDuelStateDto
  ) {
    return this.duelsService.updateGameState(actor, duelId, body.gameState);
  }

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
