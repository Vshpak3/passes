import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { BooleanResponseDto } from '../../util/dto/boolean.dto'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
import { DeleteScheduledEventRequestDto } from './dto/delete-scheduled-event.dto'
import {
  GetScheduledEventsRequestDto,
  GetScheduledEventsResponseDto,
} from './dto/get-scheduled-events.dto'
import { UpdateScheduledEventRequestDto } from './dto/update-scheduled-event.dto'
import { UpdateScheduledTimeRequestDto } from './dto/update-scheduled-time.dto'
import { ScheduledService } from './scheduled.service'

@ApiTags('scheduled')
@Controller('scheduled')
export class ScheduledController {
  constructor(private readonly scheduledService: ScheduledService) {}

  @ApiEndpoint({
    summary: 'Update scheduled event time',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'Scheduled event time updated',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('update/time')
  async updateScheduledEventTime(
    @Req() req: RequestWithUser,
    @Body() updateScheduledTimeRequestDto: UpdateScheduledTimeRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.scheduledService.updateScheduledTime(
        req.user.id,
        updateScheduledTimeRequestDto,
      ),
    )
  }

  @ApiEndpoint({
    summary: 'Update scheduled event body',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'Scheduled event body updated',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('update/body')
  async updateScheduledEventBody(
    @Req() req: RequestWithUser,
    @Body() updateScheduledEventRequestDto: UpdateScheduledEventRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.scheduledService.updateScheduledEvent(
        req.user.id,
        updateScheduledEventRequestDto,
      ),
    )
  }

  @ApiEndpoint({
    summary: 'Delete scheduled event',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'Scheduled event deleted',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('delete')
  async deleteScheduledEvent(
    @Req() req: RequestWithUser,
    @Body() deleteScheduledEventRequestDto: DeleteScheduledEventRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.scheduledService.deleteScheduledEvent(
        req.user.id,
        deleteScheduledEventRequestDto.scheduledEventId,
      ),
    )
  }

  @ApiEndpoint({
    summary: 'Get scheduled event',
    responseStatus: HttpStatus.OK,
    responseType: GetScheduledEventsResponseDto,
    responseDesc: 'Scheduled event retrieved',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('get-range')
  async getScheduledEvents(
    @Req() req: RequestWithUser,
    @Body() getScheduledEventsRequestDto: GetScheduledEventsRequestDto,
  ): Promise<GetScheduledEventsResponseDto> {
    return new GetScheduledEventsResponseDto(
      await this.scheduledService.getScheduledEvents(
        req.user.id,
        getScheduledEventsRequestDto,
      ),
    )
  }
}
