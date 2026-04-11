import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateSchoolAttendanceDto } from './dto/create-school-attendance.dto';
import { ListSchoolAttendanceQueryDto } from './dto/list-school-attendance-query.dto';
import { UpdateSchoolAttendanceSignatureDto } from './dto/update-school-attendance-signature.dto';
import { SchoolAttendanceService } from './school-attendance.service';

@Controller('school-attendance')
export class SchoolAttendanceController {
  constructor(private readonly schoolAttendanceService: SchoolAttendanceService) {}

  @Allow()
  @Get()
  list(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListSchoolAttendanceQueryDto) {
    return this.schoolAttendanceService.list(actor, query);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 15 } })
  @Post()
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateSchoolAttendanceDto,
    @Req() request: Request
  ) {
    return this.schoolAttendanceService.create(actor, dto, request);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Patch(':id/signature')
  updateSignature(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') entryId: string,
    @Body() dto: UpdateSchoolAttendanceSignatureDto,
    @Req() request: Request
  ) {
    return this.schoolAttendanceService.updateSignature(actor, entryId, dto, request);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Delete(':id')
  remove(@CurrentUser() actor: AuthenticatedUser, @Param('id') entryId: string, @Req() request: Request) {
    return this.schoolAttendanceService.remove(actor, entryId, request);
  }
}
