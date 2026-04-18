import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { BadgesService } from './badges.service';
import { GrantBadgesDto } from './dto/grant-badges.dto';

@ApiTags('badges')
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Allow()
  @Get('me')
  getMine(@CurrentUser() actor: AuthenticatedUser) {
    return this.badgesService.getMine(actor);
  }

  @Allow()
  @Post('grant')
  grant(@CurrentUser() actor: AuthenticatedUser, @Body() dto: GrantBadgesDto) {
    return this.badgesService.grantMany(actor, dto.badgeIds);
  }
}
