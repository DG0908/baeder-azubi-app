import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { ContentService } from './content.service';
import { CreateLearningMaterialDto } from './dto/create-learning-material.dto';
import { CreateNewsPostDto } from './dto/create-news-post.dto';
import { CreateResourceDto } from './dto/create-resource.dto';
import { CreateScheduledExamDto } from './dto/create-scheduled-exam.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('materials')
  listMaterials(@CurrentUser() actor: AuthenticatedUser) {
    return this.contentService.listMaterials(actor);
  }

  @Get('resources')
  listResources(@CurrentUser() actor: AuthenticatedUser) {
    return this.contentService.listResources(actor);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Post('materials')
  createMaterial(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateLearningMaterialDto,
    @Req() request: Request
  ) {
    return this.contentService.createMaterial(actor, dto, request);
  }

  @Roles(AppRole.ADMIN)
  @Post('resources')
  createResource(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateResourceDto,
    @Req() request: Request
  ) {
    return this.contentService.createResource(actor, dto, request);
  }

  @Roles(AppRole.ADMIN)
  @Delete('resources/:id')
  removeResource(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') resourceId: string,
    @Req() request: Request
  ) {
    return this.contentService.removeResource(actor, resourceId, request);
  }

  @Get('news')
  listNews(@CurrentUser() actor: AuthenticatedUser) {
    return this.contentService.listNews(actor);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Post('news')
  createNews(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateNewsPostDto,
    @Req() request: Request
  ) {
    return this.contentService.createNews(actor, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Delete('news/:id')
  removeNews(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') newsId: string,
    @Req() request: Request
  ) {
    return this.contentService.removeNews(actor, newsId, request);
  }

  @Get('exams')
  listScheduledExams(@CurrentUser() actor: AuthenticatedUser) {
    return this.contentService.listScheduledExams(actor);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Post('exams')
  createScheduledExam(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateScheduledExamDto,
    @Req() request: Request
  ) {
    return this.contentService.createScheduledExam(actor, dto, request);
  }

  @Roles(AppRole.ADMIN, AppRole.AUSBILDER)
  @Delete('exams/:id')
  removeScheduledExam(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') examId: string,
    @Req() request: Request
  ) {
    return this.contentService.removeScheduledExam(actor, examId, request);
  }
}
