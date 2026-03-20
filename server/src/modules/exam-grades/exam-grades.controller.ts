import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateExamGradeDto } from './dto/create-exam-grade.dto';
import { ListExamGradesQueryDto } from './dto/list-exam-grades-query.dto';
import { ExamGradesService } from './exam-grades.service';

@Controller('exam-grades')
export class ExamGradesController {
  constructor(private readonly examGradesService: ExamGradesService) {}

  @Get()
  list(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListExamGradesQueryDto) {
    return this.examGradesService.list(actor, query);
  }

  @Post()
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateExamGradeDto,
    @Req() request: Request
  ) {
    return this.examGradesService.create(actor, dto, request);
  }

  @Delete(':id')
  remove(@CurrentUser() actor: AuthenticatedUser, @Param('id') gradeId: string, @Req() request: Request) {
    return this.examGradesService.remove(actor, gradeId, request);
  }
}
