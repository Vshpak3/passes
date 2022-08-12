import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { CreateChannelDto } from './dto/create-channel.dto'
import { GetChannelDto } from './dto/get-channel.dto'
import { SendMessageDto } from './dto/send-message.dto'
import { TokenDto } from './dto/token.dto'
import { MessagesService } from './messages.service'

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Sends message' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SendMessageDto,
    description: 'Message was sent',
  })
  @Post()
  async send(
    @Req() req: RequestWithUser,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<any> {
    return await this.messagesService.sendMessage(req.user.id, sendMessageDto)
  }

  @ApiOperation({ summary: 'Gets token' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TokenDto,
    description: 'Token returned',
  })
  @Get('token')
  async getToken(@Req() req: RequestWithUser): Promise<TokenDto> {
    return await this.messagesService.getToken(req.user.id)
  }

  @ApiOperation({ summary: 'Creates a channel' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetChannelDto,
    description: 'Channel was created',
  })
  @Post('channel')
  async createChannel(
    @Req() req: RequestWithUser,
    @Body() createChannelDto: CreateChannelDto,
  ): Promise<GetChannelDto> {
    return await this.messagesService.createChannel(
      req.user.id,
      createChannelDto,
    )
  }
}
