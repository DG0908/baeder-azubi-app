import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreatePracticalExamAttemptDto } from './dto/create-practical-exam-attempt.dto';
import { ListPracticalExamAttemptsQueryDto } from './dto/list-practical-exam-attempts-query.dto';
import { ListTheoryExamAttemptsQueryDto } from './dto/list-theory-exam-attempts-query.dto';
import { StartTheoryExamSessionDto } from './dto/start-theory-exam-session.dto';
import { SubmitTheoryExamSessionDto } from './dto/submit-theory-exam-session.dto';
import { ExamSimulatorService } from './exam-simulator.service';

@ApiTags('exam-simulator')
@Controller('exam-simulator')
export class ExamSimulatorController {
  constructor(private readonly examSimulatorService: ExamSimulatorService) {}

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Post('theory/sessions')
  startTheorySession(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: StartTheoryExamSessionDto,
    @Req() request: Request
  ) {
    return this.examSimulatorService.startTheorySession(actor, dto, request);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Post('theory/sessions/:id/submit')
  submitTheorySession(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') sessionId: string,
    @Body() dto: SubmitTheoryExamSessionDto,
    @Req() request: Request
  ) {
    return this.examSimulatorService.submitTheorySession(actor, sessionId, dto, request);
  }

  @Allow()
  @Get('theory/attempts')
  listTheoryAttempts(
    @CurrentUser() actor: AuthenticatedUser,
    @Query() query: ListTheoryExamAttemptsQueryDto
  ) {
    return this.examSimulatorService.listTheoryAttempts(actor, query);
  }

  @Allow()
  @Get('practical/attempts')
  listPracticalAttempts(
    @CurrentUser() actor: AuthenticatedUser,
    @Query() query: ListPracticalExamAttemptsQueryDto
  ) {
    return this.examSimulatorService.listPracticalAttempts(actor, query);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Post('practical/attempts')
  createPracticalAttempt(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreatePracticalExamAttemptDto,
    @Req() request: Request
  ) {
    return this.examSimulatorService.createPracticalAttempt(actor, dto, request);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Delete('practical/attempts/:id')
  deletePracticalAttempt(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') attemptId: string,
    @Req() request: Request
  ) {
    return this.examSimulatorService.deletePracticalAttempt(actor, attemptId, request);
  }
}
