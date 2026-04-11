import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { CreateForumReplyDto } from './dto/create-forum-reply.dto';
import { ListForumPostsQueryDto } from './dto/list-forum-posts-query.dto';
import { ForumService } from './forum.service';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Allow()
  @Get('categories')
  listCategoryCounts(@CurrentUser() actor: AuthenticatedUser) {
    return this.forumService.listCategoryCounts(actor);
  }

  @Allow()
  @Get('posts')
  listPosts(
    @CurrentUser() actor: AuthenticatedUser,
    @Query() query: ListForumPostsQueryDto
  ) {
    return this.forumService.listPosts(actor, query);
  }

  @Allow()
  @Get('posts/:id/replies')
  getThread(@CurrentUser() actor: AuthenticatedUser, @Param('id') postId: string) {
    return this.forumService.getThread(actor, postId);
  }

  // 5 posts per 10 minutes per user
  @Throttle({ default: { ttl: 600000, limit: 5 } })
  @Allow()
  @Post('posts')
  createPost(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateForumPostDto,
    @Req() request: Request
  ) {
    return this.forumService.createPost(actor, dto, request);
  }

  // 15 replies per 10 minutes per user
  @Throttle({ default: { ttl: 600000, limit: 15 } })
  @Allow()
  @Post('posts/:id/replies')
  createReply(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') postId: string,
    @Body() dto: CreateForumReplyDto,
    @Req() request: Request
  ) {
    return this.forumService.createReply(actor, postId, dto, request);
  }

  @Allow()
  @Delete('posts/:id')
  deletePost(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') postId: string,
    @Req() request: Request
  ) {
    return this.forumService.deletePost(actor, postId, request);
  }

  @Allow()
  @Delete('replies/:id')
  deleteReply(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') replyId: string,
    @Req() request: Request
  ) {
    return this.forumService.deleteReply(actor, replyId, request);
  }

  @Roles(AppRole.ADMIN)
  @Patch('posts/:id/pin')
  togglePin(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') postId: string,
    @Req() request: Request
  ) {
    return this.forumService.togglePin(actor, postId, request);
  }

  @Roles(AppRole.ADMIN)
  @Patch('posts/:id/lock')
  toggleLock(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') postId: string,
    @Req() request: Request
  ) {
    return this.forumService.toggleLock(actor, postId, request);
  }
}
