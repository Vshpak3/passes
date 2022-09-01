import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Req,
  Sse,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { EventEmitter } from 'events'

import { RequestWithUser } from '../../types/request'
import {
  GetNotificationsRequestDto,
  GetNotificationsResponseDto,
} from './dto/get-notification.dto'
import { NotificationsService } from './notifications.service'

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  private readonly emitter: EventEmitter
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Gets notifications' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetNotificationsResponseDto,
    description: 'Notifications were retrieved',
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

  @ApiOperation({ summary: 'Subscribe to notification events' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Notification events were subscribed',
  })
  @Sse('subscribe')
  async subscribe(@Req() req: RequestWithUser) {
    return await this.notificationsService.subscribe(req.user.id)
  }

  @ApiOperation({ summary: 'Set status as read' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Status was set as read',
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
}
