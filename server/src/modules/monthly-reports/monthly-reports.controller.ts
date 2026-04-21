import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AssignMonthlyReportDto } from './dto/assign-monthly-report.dto';
import { ListMonthlyReportsQueryDto } from './dto/list-monthly-reports.query.dto';
import { SignMonthlyReportDto } from './dto/sign-monthly-report.dto';
import { SubmitMonthlyReportDto } from './dto/submit-monthly-report.dto';
import { MonthlyReportsService } from './monthly-reports.service';

@ApiTags('monthly-reports')
@Controller('monthly-reports')
export class MonthlyReportsController {
  constructor(private readonly service: MonthlyReportsService) {}

  @Allow()
  @Get()
  list(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListMonthlyReportsQueryDto) {
    return this.service.list(actor, query);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Post()
  assign(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: AssignMonthlyReportDto,
    @Req() request: Request
  ) {
    return this.service.assign(actor, dto, request);
  }

  @Allow()
  @Patch(':id/submit')
  submit(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') reportId: string,
    @Body() dto: SubmitMonthlyReportDto,
    @Req() request: Request
  ) {
    return this.service.submit(actor, reportId, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Patch(':id/sign')
  sign(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') reportId: string,
    @Body() dto: SignMonthlyReportDto,
    @Req() request: Request
  ) {
    return this.service.sign(actor, reportId, dto, request);
  }

  @Roles(AppRole.ADMIN)
  @Delete(':id')
  remove(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') reportId: string,
    @Req() request: Request
  ) {
    return this.service.remove(actor, reportId, request);
  }
}
