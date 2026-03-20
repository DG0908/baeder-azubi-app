import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationsService } from './invitations.service';

@Roles(AppRole.ADMIN, AppRole.AUSBILDER)
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get()
  list(@CurrentUser() actor: AuthenticatedUser) {
    return this.invitationsService.list(actor);
  }

  @Post()
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateInvitationDto,
    @Req() request: Request
  ) {
    return this.invitationsService.create(actor, dto, request);
  }

  @Delete(':id')
  revoke(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') invitationId: string,
    @Req() request: Request
  ) {
    return this.invitationsService.revoke(actor, invitationId, request);
  }
}
