import { Controller, Get, Param, Patch, Post, Body, Req } from '@nestjs/common';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateSwimSessionDto } from './dto/create-swim-session.dto';
import { SwimSessionsService } from './swim-sessions.service';

@Controller('swim-sessions')
export class SwimSessionsController {
  constructor(private readonly swimSessionsService: SwimSessionsService) {}

  @Get()
  list(@CurrentUser() actor: AuthenticatedUser) {
    return this.swimSessionsService.list(actor);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Get('pending')
  listPending(@CurrentUser() actor: AuthenticatedUser) {
    return this.swimSessionsService.listPending(actor);
  }

  @Post()
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateSwimSessionDto,
    @Req() request: Request
  ) {
    return this.swimSessionsService.create(actor, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Patch(':id/confirm')
  confirm(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') sessionId: string,
    @Req() request: Request
  ) {
    return this.swimSessionsService.confirm(actor, sessionId, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Patch(':id/reject')
  reject(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') sessionId: string,
    @Req() request: Request
  ) {
    return this.swimSessionsService.reject(actor, sessionId, request);
  }
}
