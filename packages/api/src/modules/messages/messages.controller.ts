import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { CreateBatchMessageRequestDto } from './dto/create-batch-message.dto'
import {
  GetChannelRequestDto,
  GetChannelResponseDto,
  GetChannelsRequestDto,
  GetChannelsResponseDto,
} from './dto/get-channel.dto'
import { GetFreeMesssagesResponseDto } from './dto/get-free-message.dto'
import {
  GetMessageResponseDto,
  GetMessagesRequestDto,
  GetMessagesResponseDto,
} from './dto/get-message.dto'
import {
  GetPaidMessagesRequestDto,
  GetPaidMessagesResponseDto,
} from './dto/get-paid-message.dto'
import {
  GetPaidMessageHistoryRequestDto,
  GetPaidMessageHistoryResponseDto,
} from './dto/get-paid-message-history.dto'
import { PurchaseMessageRequestDto } from './dto/purchase-message.dto'
import { SendMessageRequestDto } from './dto/send-message.dto'
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
    role: RoleEnum.GENERAL,
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
    role: RoleEnum.GENERAL,
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
    summary: 'Batch message',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'Batch Message was enqueued',
    role: RoleEnum.GENERAL,
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
    summary: 'Gets or creates a channel',
    responseStatus: HttpStatus.OK,
    responseType: GetChannelResponseDto,
    responseDesc: 'Channel was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post('channel/create')
  async getOrCreateChannel(
    @Req() req: RequestWithUser,
    @Body() getChannelRequestDto: GetChannelRequestDto,
  ): Promise<GetChannelResponseDto> {
    return await this.messagesService.createChannel(
      req.user.id,
      getChannelRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Gets a channel',
    responseStatus: HttpStatus.OK,
    responseType: GetChannelResponseDto,
    responseDesc: 'Channel was retrieved',
    role: RoleEnum.GENERAL,
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
    summary: 'Update channels settings',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Channel settings was updated ',
    role: RoleEnum.GENERAL,
  })
  @Patch('channel/settings')
  async updateChannelSettings(
    @Req() req: RequestWithUser,
    @Body() updateChannelSettingsDto: UpdateChannelSettingsRequestDto,
  ): Promise<void> {
    return await this.messagesService.updateChannelSettings(
      req.user.id,
      updateChannelSettingsDto,
    )
  }

  @ApiEndpoint({
    summary: 'Get free chat messages',
    responseStatus: HttpStatus.OK,
    responseType: GetFreeMesssagesResponseDto,
    responseDesc: 'Channel settings was updated ',
    role: RoleEnum.GENERAL,
  })
  @Get('free-messages/:channelId')
  async getFreeMessages(
    @Req() req: RequestWithUser,
    @Param('channelId') channelId: string,
  ): Promise<GetFreeMesssagesResponseDto> {
    return new GetFreeMesssagesResponseDto(
      await this.messagesService.checkFreeMessages(req.user.id, channelId),
    )
  }

  @ApiEndpoint({
    summary: 'Set status as read',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Status was set as read',
    role: RoleEnum.GENERAL,
  })
  @Get('read/:channelId')
  async readMessages(
    @Req() req: RequestWithUser,
    @Param('channelId') channelId: string,
  ): Promise<void> {
    await this.messagesService.read(req.user.id, channelId)
  }

  @ApiEndpoint({
    summary: 'Subscribe to receive new messages',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Subscription to messages was made',
    role: RoleEnum.GENERAL,
  })
  @Post('subscribe-messages')
  async subscribeMessages(): Promise<void> {
    return
  }

  @ApiEndpoint({
    summary: 'Subscribe to receive new messages',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Subscription to messages was made',
    role: RoleEnum.GENERAL,
  })
  @Post('subscribe-channel')
  async subscribeChannelUpdates(): Promise<void> {
    return
  }

  @ApiEndpoint({
    summary: 'Get channels',
    responseStatus: HttpStatus.OK,
    responseType: GetChannelsResponseDto,
    responseDesc: 'Channels were retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post('channels')
  async getChannels(
    @Req() req: RequestWithUser,
    @Body() getChannelsRequestDto: GetChannelsRequestDto,
  ): Promise<GetChannelsResponseDto> {
    return new GetChannelsResponseDto(
      await this.messagesService.getChannels(
        req.user.id,
        getChannelsRequestDto,
      ),
      getChannelsRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Register purchase message payin',
    responseStatus: HttpStatus.CREATED,
    responseType: RegisterPayinResponseDto,
    responseDesc: 'Purcuase post payin was registered',
    role: RoleEnum.GENERAL,
  })
  @Post('pay/purchase')
  async registerPurchaseMessage(
    @Req() req: RequestWithUser,
    @Body() purchaseMessageRequestDto: PurchaseMessageRequestDto,
  ): Promise<RegisterPayinResponseDto> {
    return await this.messagesService.registerPurchaseMessage(
      req.user.id,
      purchaseMessageRequestDto.messageId,
      purchaseMessageRequestDto.payinMethod,
    )
  }

  @ApiEndpoint({
    summary: 'Get register purchase message data',
    responseStatus: HttpStatus.OK,
    responseType: PayinDataDto,
    responseDesc: 'Data for register purchase message was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post('pay/data/purchase')
  async registerPurchaseMessageData(
    @Req() req: RequestWithUser,
    @Body() purchaseMessageRequestDto: PurchaseMessageRequestDto,
  ): Promise<PayinDataDto> {
    return await this.messagesService.registerPurchaseMessageData(
      req.user.id,
      purchaseMessageRequestDto.messageId,
    )
  }

  @ApiEndpoint({
    summary: 'Get messages',
    responseStatus: HttpStatus.OK,
    responseType: GetMessagesResponseDto,
    responseDesc: 'Messages were retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post('messages')
  async getMessages(
    @Req() req: RequestWithUser,
    @Body() getMessagesRequestDto: GetMessagesRequestDto,
  ): Promise<GetMessagesResponseDto> {
    return new GetMessagesResponseDto(
      await this.messagesService.getMessages(
        req.user.id,
        getMessagesRequestDto,
      ),
      getMessagesRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Get message',
    responseStatus: HttpStatus.OK,
    responseType: GetMessageResponseDto,
    responseDesc: 'Gallery view was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Get('message/retreive/:messageId')
  async getMessage(
    @Req() req: RequestWithUser,
    @Param('messageId') messageId: string,
  ): Promise<GetMessageResponseDto> {
    return await this.messagesService.getMessage(req.user.id, messageId)
  }

  @ApiEndpoint({
    summary: 'Get paid message history',
    responseStatus: HttpStatus.OK,
    responseType: GetPaidMessageHistoryResponseDto,
    responseDesc: 'Paid message history was retrieved',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('paid-message/history')
  async getPaidMessages(
    @Req() req: RequestWithUser,
    @Body() getPaidMessageHistoryRequestDto: GetPaidMessageHistoryRequestDto,
  ): Promise<GetPaidMessageHistoryResponseDto> {
    return new GetPaidMessageHistoryResponseDto(
      await this.messagesService.getPaidMessageHistory(
        req.user.id,
        getPaidMessageHistoryRequestDto,
      ),
    )
  }

  @ApiEndpoint({
    summary: 'Get paid messages',
    responseStatus: HttpStatus.OK,
    responseType: GetPaidMessagesResponseDto,
    responseDesc: 'Paid messages was retrieved',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('paid-message')
  async getPaidMessage(
    @Req() req: RequestWithUser,
    @Body() getPaidMessagesRequestDto: GetPaidMessagesRequestDto,
  ): Promise<GetPaidMessagesResponseDto> {
    return new GetPaidMessagesResponseDto(
      await this.messagesService.getPaidMessages(
        req.user.id,
        getPaidMessagesRequestDto,
      ),
      getPaidMessagesRequestDto,
    )
  }
}
