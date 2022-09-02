import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { CreateBatchMessageRequestDto } from './dto/create-batch-message.dto'
import { CreateChannelRequestDto } from './dto/create-channel.dto'
import {
  GetChannelStatResponseDto,
  GetChannelStatsResponseDto,
} from './dto/get-channel-stat.dto'
import { GetMessagesResponseDto } from './dto/get-messages.dto'
import { SendMessageRequestDto } from './dto/send-message.dto'
import { TokenResponseDto } from './dto/token.dto'
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
  async send(
    @Req() req: RequestWithUser,
    @Body() sendMessageDto: SendMessageRequestDto,
  ): Promise<RegisterPayinResponseDto> {
    return await this.messagesService.registerSendMessage(
      req.user.id,
      sendMessageDto,
    )
  }

  @ApiOperation({ summary: 'Get pending messages' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetMessagesResponseDto,
    description: 'Pending messages was returned',
  })
  @Get('/pending')
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
    description: 'Completed tipped messages returned',
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
    description: 'Token returned',
  })
  @Get('token')
  async getToken(@Req() req: RequestWithUser): Promise<TokenResponseDto> {
    return await this.messagesService.getToken(req.user.id)
  }

  @ApiOperation({ summary: 'Creates a channel' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetChannelStatResponseDto,
    description: 'Channel was created',
  })
  @Post('channel')
  async createChannel(
    @Req() req: RequestWithUser,
    @Body() createChannelDto: CreateChannelRequestDto,
  ): Promise<GetChannelStatResponseDto> {
    return await this.messagesService.createChannel(
      req.user.id,
      createChannelDto,
    )
  }

  @ApiOperation({ summary: 'Get channels stats' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetChannelStatsResponseDto,
    description: 'Get channels stats ',
  })
  @Get('channel/stats')
  async getChannelsStats(
    @Req() req: RequestWithUser,
  ): Promise<GetChannelStatsResponseDto> {
    return new GetChannelStatsResponseDto(
      await this.messagesService.getChannelsStats(req.user.id),
    )
  }
}
