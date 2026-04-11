import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { FlashcardsService } from './flashcards.service';

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Allow()
  @Get()
  listApproved(@CurrentUser() actor: AuthenticatedUser) {
    return this.flashcardsService.listApproved(actor);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Get('pending')
  listPending(@CurrentUser() actor: AuthenticatedUser) {
    return this.flashcardsService.listPending(actor);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 20 } })
  @Post()
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateFlashcardDto,
    @Req() request: Request
  ) {
    return this.flashcardsService.create(actor, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Patch(':id/approve')
  approve(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') flashcardId: string,
    @Req() request: Request
  ) {
    return this.flashcardsService.approve(actor, flashcardId, request);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 15 } })
  @Delete(':id')
  remove(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') flashcardId: string,
    @Req() request: Request
  ) {
    return this.flashcardsService.remove(actor, flashcardId, request);
  }
}
