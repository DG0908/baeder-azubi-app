import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreatePracticalExamAttemptDto } from './dto/create-practical-exam-attempt.dto';
import { ListPracticalExamAttemptsQueryDto } from './dto/list-practical-exam-attempts-query.dto';
import { ListTheoryExamAttemptsQueryDto } from './dto/list-theory-exam-attempts-query.dto';
import { StartTheoryExamSessionDto } from './dto/start-theory-exam-session.dto';
import { SubmitTheoryExamSessionDto } from './dto/submit-theory-exam-session.dto';
import { ExamSimulatorService } from './exam-simulator.service';

@Controller('exam-simulator')
export class ExamSimulatorController {
  constructor(private readonly examSimulatorService: ExamSimulatorService) {}

  @Post('theory/sessions')
  startTheorySession(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: StartTheoryExamSessionDto,
    @Req() request: Request
  ) {
    return this.examSimulatorService.startTheorySession(actor, dto, request);
  }

  @Post('theory/sessions/:id/submit')
  submitTheorySession(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') sessionId: string,
    @Body() dto: SubmitTheoryExamSessionDto,
    @Req() request: Request
  ) {
    return this.examSimulatorService.submitTheorySession(actor, sessionId, dto, request);
  }

  @Get('theory/attempts')
  listTheoryAttempts(
    @CurrentUser() actor: AuthenticatedUser,
    @Query() query: ListTheoryExamAttemptsQueryDto
  ) {
    return this.examSimulatorService.listTheoryAttempts(actor, query);
  }

  @Get('practical/attempts')
  listPracticalAttempts(
    @CurrentUser() actor: AuthenticatedUser,
    @Query() query: ListPracticalExamAttemptsQueryDto
  ) {
    return this.examSimulatorService.listPracticalAttempts(actor, query);
  }

  @Post('practical/attempts')
  createPracticalAttempt(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreatePracticalExamAttemptDto,
    @Req() request: Request
  ) {
    return this.examSimulatorService.createPracticalAttempt(actor, dto, request);
  }

  @Delete('practical/attempts/:id')
  deletePracticalAttempt(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') attemptId: string,
    @Req() request: Request
  ) {
    return this.examSimulatorService.deletePracticalAttempt(actor, attemptId, request);
  }
}
