import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Sse,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EventEmitter } from 'events'

import { RequestWithUser } from '../../types/request'
import { BooleanResponseDto } from '../../util/dto/boolean.dto'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
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
    role: RoleEnum.GENERAL,
  })
  @Post('get')
  async getNotifications(
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
    role: RoleEnum.GENERAL,
  })
  @Sse('subscribe')
  async subscribeNotifications(@Req() req: RequestWithUser) {
    return await this.notificationsService.subscribe(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Set status as read',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Status was set as read',
    role: RoleEnum.GENERAL,
  })
  @Patch('read/:notificationId')
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
    role: RoleEnum.GENERAL,
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
    responseType: BooleanResponseDto,
    responseDesc: 'Notification settings was updated',
    role: RoleEnum.GENERAL,
  })
  @Patch('settings')
  async updateNotificationSettings(
    @Req() req: RequestWithUser,
    @Body() updateNotificationSettingsDto: UpdateNotificationSettingsRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.notificationsService.updateNotificationSettings(
        req.user.id,
        updateNotificationSettingsDto,
      ),
    )
  }
}
