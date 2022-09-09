import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Sse,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EventEmitter } from 'events'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import {
  GetNotificationsRequestDto,
  GetNotificationsResponseDto,
} from './dto/get-notification.dto'
import { GetNotificationSettingsResponseDto } from './dto/get-notification-settings.dto'
import { UpdateNotificationSettingsRequestDto } from './dto/update-notification-settings.dto'
import { NotificationsService } from './notifications.service'

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  private readonly emitter: EventEmitter
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiEndpoint({
    summary: 'Gets notifications',
    responseStatus: HttpStatus.OK,
    responseType: GetNotificationsResponseDto,
    responseDesc: 'Notifications were retrieved',
  })
  @Post('get')
  async get(
    @Req() req: RequestWithUser,
    @Body() getNotificationsRequest: GetNotificationsRequestDto,
  ): Promise<GetNotificationsResponseDto> {
    return new GetNotificationsResponseDto(
      await this.notificationsService.get(req.user.id, getNotificationsRequest),
    )
  }

  @ApiEndpoint({
    summary: 'Subscribe to notification events',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Notification events were subscribed',
  })
  @Sse('subscribe')
  async subscribe(@Req() req: RequestWithUser) {
    return await this.notificationsService.subscribe(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Set status as read',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Status was set as read',
  })
  @Post('read/:notificationId')
  async readNotification(
    @Req() req: RequestWithUser,
    @Param('notificationId') notificationId: string,
  ): Promise<void> {
    await this.notificationsService.readNotification(
      req.user.id,
      notificationId,
    )
  }

  @ApiEndpoint({
    summary: 'Gets notification settings',
    responseStatus: HttpStatus.OK,
    responseType: GetNotificationSettingsResponseDto,
    responseDesc: 'Notification settings was retrieved',
  })
  @Get('settings')
  async getNotificationSettings(
    @Req() req: RequestWithUser,
  ): Promise<GetNotificationSettingsResponseDto> {
    return await this.notificationsService.getNotificationSettings(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Update notification settings',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'Notification settings was updated',
  })
  @Post('settings')
  async updateNotificationSettings(
    @Req() req: RequestWithUser,
    @Body() updateNotificationSettingsDto: UpdateNotificationSettingsRequestDto,
  ): Promise<boolean> {
    return await this.notificationsService.updateNotificationSettings(
      req.user.id,
      updateNotificationSettingsDto,
    )
  }
}
