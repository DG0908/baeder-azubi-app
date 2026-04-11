import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AppConfigService } from './app-config.service';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';

@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get()
  getConfig(@CurrentUser() actor: AuthenticatedUser) {
    return this.appConfigService.getConfig(actor);
  }

  @Roles(AppRole.ADMIN)
  @Put()
  updateConfig(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: UpdateAppConfigDto,
    @Req() request: Request
  ) {
    return this.appConfigService.updateConfig(actor, dto, request);
  }
}
