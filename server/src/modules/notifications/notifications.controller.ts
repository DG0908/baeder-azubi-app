import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { EmitNotificationEventDto } from './dto/emit-notification-event.dto';
import { RemovePushSubscriptionDto } from './dto/remove-push-subscription.dto';
import { SendTestPushDto } from './dto/send-test-push.dto';
import { UpsertPushSubscriptionDto } from './dto/upsert-push-subscription.dto';
import { NotificationsService } from './notifications.service';
import { PushNotificationsService } from './push-notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly pushNotificationsService: PushNotificationsService
  ) {}

  @Get()
  listMine(@CurrentUser() actor: AuthenticatedUser) {
    return this.notificationsService.listMine(actor);
  }

  @Patch(':id/read')
  markRead(@CurrentUser() actor: AuthenticatedUser, @Param('id') notificationId: string) {
    return this.notificationsService.markRead(actor, notificationId);
  }

  @Delete()
  clearMine(@CurrentUser() actor: AuthenticatedUser) {
    return this.notificationsService.clearMine(actor);
  }

  @Post('events')
  emitEvent(@CurrentUser() actor: AuthenticatedUser, @Body() dto: EmitNotificationEventDto) {
    return this.notificationsService.emitEvent(actor, dto);
  }

  @Post('push/subscriptions')
  upsertPushSubscription(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: UpsertPushSubscriptionDto,
    @Req() request: Request
  ) {
    return this.pushNotificationsService.upsertSubscription(actor, dto, request);
  }

  @Delete('push/subscriptions')
  removePushSubscription(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: RemovePushSubscriptionDto,
    @Req() request: Request
  ) {
    return this.pushNotificationsService.removeSubscription(actor, dto, request);
  }

  @Post('push/test')
  sendTestPush(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: SendTestPushDto,
    @Req() request: Request
  ) {
    return this.pushNotificationsService.sendTestPush(actor, dto, request);
  }
}
