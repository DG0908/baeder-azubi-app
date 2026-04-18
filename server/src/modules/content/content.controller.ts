import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { ContentService } from './content.service';
import { CreateLearningMaterialDto } from './dto/create-learning-material.dto';
import { CreateNewsPostDto } from './dto/create-news-post.dto';
import { CreateResourceDto } from './dto/create-resource.dto';
import { CreateScheduledExamDto } from './dto/create-scheduled-exam.dto';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Allow()
  @Get('materials')
  listMaterials(@CurrentUser() actor: AuthenticatedUser) {
    return this.contentService.listMaterials(actor);
  }

  @Allow()
  @Get('resources')
  listResources(@CurrentUser() actor: AuthenticatedUser) {
    return this.contentService.listResources(actor);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Throttle({ default: { ttl: 600000, limit: 20 } })
  @Post('materials')
  createMaterial(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateLearningMaterialDto,
    @Req() request: Request
  ) {
    return this.contentService.createMaterial(actor, dto, request);
  }

  @Roles(AppRole.ADMIN)
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Post('resources')
  createResource(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateResourceDto,
    @Req() request: Request
  ) {
    return this.contentService.createResource(actor, dto, request);
  }

  @Roles(AppRole.ADMIN)
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Delete('resources/:id')
  removeResource(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') resourceId: string,
    @Req() request: Request
  ) {
    return this.contentService.removeResource(actor, resourceId, request);
  }

  @Allow()
  @Get('news')
  listNews(@CurrentUser() actor: AuthenticatedUser) {
    return this.contentService.listNews(actor);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Throttle({ default: { ttl: 600000, limit: 15 } })
  @Post('news')
  createNews(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateNewsPostDto,
    @Req() request: Request
  ) {
    return this.contentService.createNews(actor, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Delete('news/:id')
  removeNews(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') newsId: string,
    @Req() request: Request
  ) {
    return this.contentService.removeNews(actor, newsId, request);
  }

  @Allow()
  @Get('exams')
  listScheduledExams(@CurrentUser() actor: AuthenticatedUser) {
    return this.contentService.listScheduledExams(actor);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Post('exams')
  createScheduledExam(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateScheduledExamDto,
    @Req() request: Request
  ) {
    return this.contentService.createScheduledExam(actor, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Throttle({ default: { ttl: 600000, limit: 10 } })
  @Delete('exams/:id')
  removeScheduledExam(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') examId: string,
    @Req() request: Request
  ) {
    return this.contentService.removeScheduledExam(actor, examId, request);
  }
}
