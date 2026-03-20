import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Get()
  list(@CurrentUser() actor: AuthenticatedUser) {
    return this.organizationsService.list(actor);
  }

  @Roles(AppRole.ADMIN)
  @Post()
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateOrganizationDto,
    @Req() request: Request
  ) {
    return this.organizationsService.create(actor, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.organizationsService.getById(id);
  }
}
