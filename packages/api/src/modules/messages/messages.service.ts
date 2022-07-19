import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { StreamChat } from 'stream-chat'

import { UserEntity } from '../user/entities/user.entity'
import { CreateChannelDto } from './dto/create-channel.dto'
import { GetChannelDto } from './dto/get-channel.dto'
import { SendMessageDto } from './dto/send-message.dto'
import { TokenDto } from './dto/token.dto'

const MESSAGING_CHAT_TYPE = 'messaging'

export class MessagesService {
  streamClient: StreamChat
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {
    this.streamClient = StreamChat.getInstance(
      configService.get('stream.api_key') as string,
      configService.get('stream.api_secret'),
    )
  }

  async getToken(userId: string): Promise<TokenDto> {
    await this.streamClient.upsertUser({ id: userId })

    return { token: this.streamClient.createToken(userId) }
  }

  async createChannel(
    userId: string,
    createChannelDto: CreateChannelDto,
  ): Promise<GetChannelDto> {
    const otherUser = await this.userRepository.findOne({
      userName: createChannelDto.username,
    })
    if (otherUser == null) {
      throw new BadRequestException(
        `${createChannelDto.username} could not be found`,
      )
    }
    await this.streamClient.upsertUsers([{ id: userId }, { id: otherUser.id }])
    const channel = this.streamClient.channel('messaging', {
      members: [userId, otherUser.id],
      created_by_id: userId,
    })
    // create channel
    const createResponse = await channel.create()

    // TODO ensure that although channel_member can upload attachment it cannot be 'sent' without 'create-message'
    // remove channel_memeber permissions to mutate the chat (all mutation proxied via api)
    // await channel.updatePartial({
    //   set: {
    //     config_overrides: {
    //       grants: {
    //         channel_member: [
    //           '!add-links',
    //           '!create-reaction',
    //           '!create-message',
    //           '!update-message-owner',
    //           '!delete-message-owner',
    //           '!send-custom-event',
    //         ],
    //       },
    //     },
    //   },
    // })

    return {
      id: createResponse.channel.id,
    }
  }

  async sendMessage(userId: string, sendMessageDto: SendMessageDto) {
    const channel = this.streamClient.channel(
      MESSAGING_CHAT_TYPE,
      sendMessageDto.channelId,
    )
    return await channel.sendMessage({
      text: sendMessageDto.text,
      user_id: userId,
    })
  }
}
