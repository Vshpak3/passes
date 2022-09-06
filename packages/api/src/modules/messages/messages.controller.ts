import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
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
import { GetMessagesResponseDto } from './dto/get-messages.dto'
import { SendMessageRequestDto } from './dto/send-message.dto'
import { TokenResponseDto } from './dto/token.dto'
import { UpdateChannelSettingsRequestDto } from './dto/update-channel-settings.dto'
import { MessagesService } from './messages.service'

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Register sending message' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RegisterPayinResponseDto,
    description: 'Sending message was registered',
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

  @ApiOperation({ summary: 'Register sending message data' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayinDataDto,
    description: 'Sending message data was retrieved',
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

  @ApiOperation({ summary: 'Get pending messages' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetMessagesResponseDto,
    description: 'Pending messages was retrieved',
  })
  @Get('pending')
  async getPending(
    @Req() req: RequestWithUser,
  ): Promise<GetMessagesResponseDto> {
    return new GetMessagesResponseDto(
      await this.messagesService.getPendingTippedMessages(req.user.id),
    )
  }

  @ApiOperation({ summary: 'Get completed tipped messages' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetMessagesResponseDto,
    description: 'Completed tipped messages retrieved',
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

  @ApiOperation({ summary: 'Batch message' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: undefined,
    description: 'Batch Message was enqueued',
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

  @ApiOperation({ summary: 'Gets token' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TokenResponseDto,
    description: 'Token was retrieved',
  })
  @Get('token')
  async getToken(@Req() req: RequestWithUser): Promise<TokenResponseDto> {
    return await this.messagesService.getToken(req.user.id)
  }

  @ApiOperation({ summary: 'Creates a channel' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetChannelResponseDto,
    description: 'Channel was created',
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

  @ApiOperation({ summary: 'Get channels stats' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetChannelStatsResponseDto,
    description: 'Channel stats was retrieved ',
  })
  @Post('channel/stats')
  async getChannelsStats(
    @Body() getChannelStatsRequestDto: GetChannelStatsRequestDto,
  ): Promise<GetChannelStatsResponseDto> {
    return new GetChannelStatsResponseDto(
      await this.messagesService.getChannelsStats(getChannelStatsRequestDto),
    )
  }

  @ApiOperation({ summary: 'Get channels settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetChannelSettingsResponseDto,
    description: 'Channel settings was retrieved ',
  })
  @Get('channel/settings/:channelId')
  async getChannelSettings(
    @Req() req: RequestWithUser,
    @Param('channelId') channelId: string,
  ): Promise<GetChannelSettingsResponseDto> {
    return await this.messagesService.getChannelSettings(req.user.id, channelId)
  }

  @ApiOperation({ summary: 'Update channels settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Channel settings was updated ',
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
}
