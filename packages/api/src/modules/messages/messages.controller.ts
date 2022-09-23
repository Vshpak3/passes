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
import { GetMessageResponseDto } from './dto/get-message.dto'
import { PurchaseMessageRequestDto } from './dto/purchase-message.dto'
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
    summary: 'Gets or creates a channel',
    responseStatus: HttpStatus.OK,
    responseType: GetChannelResponseDto,
    responseDesc: 'Channel was retrieved',
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
  })
  @Get('read/:channelId')
  async readMessages(
    @Req() req: RequestWithUser,
    @Param('channelId') channelId: string,
  ): Promise<void> {
    await this.messagesService.read(req.user.id, channelId)
  }

  @ApiEndpoint({
    summary: 'Get messages',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Messages were retrieved',
  })
  @Post('messages')
  async getMessages(): Promise<void> {
    return
  }

  @ApiEndpoint({
    summary: 'Subscribe to receive new messages',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Subscription to messages was made',
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
      getChannelsRequestDto.orderType,
    )
  }

  @ApiEndpoint({
    summary: 'Register purchase message payin',
    responseStatus: HttpStatus.CREATED,
    responseType: RegisterPayinResponseDto,
    responseDesc: 'Purcuase post payin was registered',
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

  // @ApiEndpoint({
  //   summary: 'Get gallery view',
  //   responseStatus: HttpStatus.OK,
  //   responseType: GetGalleryViewDto,
  //   responseDesc: 'Gallery view was retrieved',
  // })
  // @Get('gallery/:channelId')
  // async getGalleryView(
  //   @Req() req: RequestWithUser,
  //   @Param('channelId') channelId: string,
  // ): Promise<GetGalleryViewDto> {
  //   return new GetGalleryViewDto(
  //     await this.postService.getGalleryMessages(req.user.id, channelId),
  //   )
  // }

  @ApiEndpoint({
    summary: 'Get message',
    responseStatus: HttpStatus.OK,
    responseType: GetMessageResponseDto,
    responseDesc: 'Gallery view was retrieved',
  })
  @Get('message/retreive/:messageId')
  async getMessage(
    @Req() req: RequestWithUser,
    @Param('messageId') messageId: string,
  ): Promise<GetMessageResponseDto> {
    return await this.messagesService.getMessage(req.user.id, messageId)
  }
}
