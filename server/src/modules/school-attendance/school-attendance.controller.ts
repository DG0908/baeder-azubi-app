import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateSchoolAttendanceDto } from './dto/create-school-attendance.dto';
import { ListSchoolAttendanceQueryDto } from './dto/list-school-attendance-query.dto';
import { UpdateSchoolAttendanceSignatureDto } from './dto/update-school-attendance-signature.dto';
import { SchoolAttendanceService } from './school-attendance.service';

@Controller('school-attendance')
export class SchoolAttendanceController {
  constructor(private readonly schoolAttendanceService: SchoolAttendanceService) {}

  @Get()
  list(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListSchoolAttendanceQueryDto) {
    return this.schoolAttendanceService.list(actor, query);
  }

  @Post()
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateSchoolAttendanceDto,
    @Req() request: Request
  ) {
    return this.schoolAttendanceService.create(actor, dto, request);
  }

  @Patch(':id/signature')
  updateSignature(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') entryId: string,
    @Body() dto: UpdateSchoolAttendanceSignatureDto,
    @Req() request: Request
  ) {
    return this.schoolAttendanceService.updateSignature(actor, entryId, dto, request);
  }

  @Delete(':id')
  remove(@CurrentUser() actor: AuthenticatedUser, @Param('id') entryId: string, @Req() request: Request) {
    return this.schoolAttendanceService.remove(actor, entryId, request);
  }
}
