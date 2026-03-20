import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateQuestionReportDto } from './dto/create-question-report.dto';
import { CreateSubmittedQuestionDto } from './dto/create-submitted-question.dto';
import { UpdateQuestionReportStatusDto } from './dto/update-question-report-status.dto';
import { QuestionWorkflowsService } from './question-workflows.service';

@Controller('question-workflows')
export class QuestionWorkflowsController {
  constructor(private readonly questionWorkflowsService: QuestionWorkflowsService) {}

  @Get('submissions')
  listSubmittedQuestions(@CurrentUser() actor: AuthenticatedUser) {
    return this.questionWorkflowsService.listSubmittedQuestions(actor);
  }

  @Post('submissions')
  createSubmittedQuestion(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateSubmittedQuestionDto,
    @Req() request: Request
  ) {
    return this.questionWorkflowsService.createSubmittedQuestion(actor, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Patch('submissions/:id/approve')
  approveSubmittedQuestion(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') questionId: string,
    @Req() request: Request
  ) {
    return this.questionWorkflowsService.approveSubmittedQuestion(actor, questionId, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Get('reports')
  listQuestionReports(@CurrentUser() actor: AuthenticatedUser) {
    return this.questionWorkflowsService.listQuestionReports(actor);
  }

  @Post('reports')
  createQuestionReport(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateQuestionReportDto,
    @Req() request: Request
  ) {
    return this.questionWorkflowsService.createQuestionReport(actor, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Patch('reports/:id/status')
  updateQuestionReportStatus(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') reportId: string,
    @Body() dto: UpdateQuestionReportStatusDto,
    @Req() request: Request
  ) {
    return this.questionWorkflowsService.updateQuestionReportStatus(actor, reportId, dto, request);
  }
}
