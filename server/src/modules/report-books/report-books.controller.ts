import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AssignReportBookTrainerDto } from './dto/assign-report-book-trainer.dto';
import { ListReportBooksQueryDto } from './dto/list-report-books.query.dto';
import { SaveReportBookDto } from './dto/save-report-book.dto';
import { UpdateReportBookProfileDto } from './dto/update-report-book-profile.dto';
import { ReportBooksService } from './report-books.service';

@Controller('report-books')
export class ReportBooksController {
  constructor(private readonly reportBooksService: ReportBooksService) {}

  @Allow()
  @Get('profile')
  getProfile(@CurrentUser() actor: AuthenticatedUser) {
    return this.reportBooksService.getProfile(actor);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Patch('profile')
  updateProfile(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: UpdateReportBookProfileDto,
    @Req() request: Request
  ) {
    return this.reportBooksService.updateProfile(actor, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Get('pending-review')
  listPendingReview(@CurrentUser() actor: AuthenticatedUser) {
    return this.reportBooksService.listPendingReview(actor);
  }

  @Allow()
  @Get()
  list(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListReportBooksQueryDto) {
    return this.reportBooksService.list(actor, query);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 20 } })
  @Put('draft')
  upsertDraft(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: SaveReportBookDto,
    @Req() request: Request
  ) {
    return this.reportBooksService.upsertDraft(actor, dto, request);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Delete('drafts/:weekStart')
  deleteDraftByWeek(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('weekStart') weekStart: string,
    @Req() request: Request
  ) {
    return this.reportBooksService.deleteDraftByWeek(actor, weekStart, request);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Post('submit')
  submit(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: SaveReportBookDto,
    @Req() request: Request
  ) {
    return this.reportBooksService.submit(actor, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Patch(':id/assignment')
  assignTrainer(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') entryId: string,
    @Body() dto: AssignReportBookTrainerDto,
    @Req() request: Request
  ) {
    return this.reportBooksService.assignTrainer(actor, entryId, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Delete(':id')
  remove(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') entryId: string,
    @Req() request: Request
  ) {
    return this.reportBooksService.remove(actor, entryId, request);
  }
}
