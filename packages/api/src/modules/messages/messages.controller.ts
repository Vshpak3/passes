import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { CreateBatchMessageRequestDto } from './dto/create-batch-message.dto'
import {
  GetChannelRequestDto,
  GetChannelResponseDto,
} from './dto/get-channel.dto'
import { GetChannelSettingsResponseDto } from './dto/get-channel-settings.dto'
import {
  GetChannelStatsRequestDto,
  GetChannelStatsResponseDto,
} from './dto/get-channel-stat.dto'
import { GetFreeMesssagesResponseDto } from './dto/get-free-message.dto'
import { GetMessagesResponseDto } from './dto/get-messages.dto'
import { SendMessageRequestDto } from './dto/send-message.dto'
import { TokenResponseDto } from './dto/token.dto'
import { UpdateChannelSettingsRequestDto } from './dto/update-channel-settings.dto'
import { MessagesService } from './messages.service'

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiEndpoint({
    summary: 'Register sending message',
    responseStatus: HttpStatus.CREATED,
    responseType: RegisterPayinResponseDto,
    responseDesc: 'Sending message was registered',
  })
  @Post()
  async sendMessage(
    @Req() req: RequestWithUser,
    @Body() sendMessageDto: SendMessageRequestDto,
  ): Promise<RegisterPayinResponseDto> {
    return await this.messagesService.registerSendMessage(
      req.user.id,
      sendMessageDto,
    )
  }

  @ApiEndpoint({
    summary: 'Register sending message data',
    responseStatus: HttpStatus.OK,
    responseType: PayinDataDto,
    responseDesc: 'Sending message data was retrieved',
  })
  @Post('data')
  async sendMessageData(
    @Req() req: RequestWithUser,
    @Body() sendMessageDto: SendMessageRequestDto,
  ): Promise<PayinDataDto> {
    return await this.messagesService.registerSendMessageData(
      req.user.id,
      sendMessageDto,
    )
  }

  @ApiEndpoint({
    summary: 'Get pending messages',
    responseStatus: HttpStatus.OK,
    responseType: GetMessagesResponseDto,
    responseDesc: 'Pending messages was retrieved',
  })
  @Get('pending')
  async getPending(
    @Req() req: RequestWithUser,
  ): Promise<GetMessagesResponseDto> {
    return new GetMessagesResponseDto(
      await this.messagesService.getPendingTippedMessages(req.user.id),
    )
  }

  @ApiEndpoint({
    summary: 'Get completed tipped messages',
    responseStatus: HttpStatus.OK,
    responseType: GetMessagesResponseDto,
    responseDesc: 'Completed tipped messages retrieved',
  })
  @Post('completed-tipped')
  async getCompletedTippedMessages(
    @Req() req: RequestWithUser,
  ): Promise<GetMessagesResponseDto> {
    const messages = await this.messagesService.getCompletedTippedMessages(
      req.user.id,
    )
    return new GetMessagesResponseDto(messages)
  }

  @ApiEndpoint({
    summary: 'Batch message',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'Batch Message was enqueued',
  })
  @Post('batch')
  async massSend(
    @Req() req: RequestWithUser,
    @Body() createBatchMessageDto: CreateBatchMessageRequestDto,
  ): Promise<void> {
    await this.messagesService.createBatchMessage(
      req.user.id,
      createBatchMessageDto,
    )
  }

  @ApiEndpoint({
    summary: 'Gets token',
    responseStatus: HttpStatus.OK,
    responseType: TokenResponseDto,
    responseDesc: 'Token was retrieved',
  })
  @Get('token')
  async getToken(@Req() req: RequestWithUser): Promise<TokenResponseDto> {
    return await this.messagesService.getToken(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Creates a channel',
    responseStatus: HttpStatus.CREATED,
    responseType: GetChannelResponseDto,
    responseDesc: 'Channel was created',
  })
  @Post('channel')
  async getChannel(
    @Req() req: RequestWithUser,
    @Body() getChannelRequestDto: GetChannelRequestDto,
  ): Promise<GetChannelResponseDto> {
    return await this.messagesService.getChannel(
      req.user.id,
      getChannelRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Get channels stats',
    responseStatus: HttpStatus.OK,
    responseType: GetChannelStatsResponseDto,
    responseDesc: 'Channel stats was retrieved ',
  })
  @Post('channel/stats')
  async getChannelsStats(
    @Body() getChannelStatsRequestDto: GetChannelStatsRequestDto,
  ): Promise<GetChannelStatsResponseDto> {
    return new GetChannelStatsResponseDto(
      await this.messagesService.getChannelsStats(getChannelStatsRequestDto),
    )
  }

  @ApiEndpoint({
    summary: 'Get channels settings',
    responseStatus: HttpStatus.OK,
    responseType: GetChannelSettingsResponseDto,
    responseDesc: 'Channel settings was retrieved ',
  })
  @Get('channel/settings/:channelId')
  async getChannelSettings(
    @Req() req: RequestWithUser,
    @Param('channelId') channelId: string,
  ): Promise<GetChannelSettingsResponseDto> {
    return await this.messagesService.getChannelSettings(req.user.id, channelId)
  }

  @ApiEndpoint({
    summary: 'Update channels settings',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Channel settings was updated ',
  })
  @Post('channel/settings/:channelId')
  async updateChannelSettings(
    @Req() req: RequestWithUser,
    @Param('channelId') channelId: string,
    @Body() updateChannelSettingsDto: UpdateChannelSettingsRequestDto,
  ): Promise<void> {
    return await this.messagesService.updateChannelSettings(
      req.user.id,
      channelId,
      updateChannelSettingsDto,
    )
  }

  @ApiEndpoint({
    summary: 'Get free chat messages',
    responseStatus: HttpStatus.OK,
    responseType: GetFreeMesssagesResponseDto,
    responseDesc: 'Channel settings was updated ',
  })
  @Post('free-messages/:creatorId/:channelId')
  async getFreeMessages(
    @Req() req: RequestWithUser,
    @Param('creatorId') creatorId: string,
    @Param('channelId') channelId: string,
  ): Promise<GetFreeMesssagesResponseDto> {
    return new GetFreeMesssagesResponseDto(
      await this.messagesService.checkFreeMessages(
        req.user.id,
        creatorId,
        channelId,
      ),
    )
  }
}
