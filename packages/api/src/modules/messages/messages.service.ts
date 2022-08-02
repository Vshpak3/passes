import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { StreamChat } from 'stream-chat'
import * as uuid from 'uuid'

import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
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
    @InjectRepository(CreatorSettingsEntity)
    private readonly creatorSettingsRepository: EntityRepository<CreatorSettingsEntity>,
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
    // remove channel_member permissions to mutate the chat (all mutation proxied via api)
    await channel.updatePartial({
      set: {
        config_overrides: {
          grants: {
            channel_member: [
              '!add-links',
              '!create-reaction',
              '!create-message',
              '!update-message-owner',
              '!delete-message-owner',
              '!send-custom-event',
            ],
          },
        },
      },
    })

    return {
      id: createResponse.channel.id,
    }
  }

  async sendMessage(userId: string, sendMessageDto: SendMessageDto) {
    if (sendMessageDto.tipAmount != undefined && sendMessageDto.tipAmount < 0) {
      throw new BadRequestException('invalid tip amount')
    }
    const channel = this.streamClient.channel(
      MESSAGING_CHAT_TYPE,
      sendMessageDto.channelId,
    )

    const membersResponse = await channel.queryMembers({})
    let otherUserId: string | undefined = undefined
    for (const i in membersResponse.members) {
      if (
        membersResponse.members[i].user_id != undefined &&
        membersResponse.members[i].user_id != userId
      ) {
        otherUserId = membersResponse.members[i].user_id
      }
    }
    const otherUser = await this.userRepository.findOne({ id: otherUserId })

    const creatorSettings = await this.creatorSettingsRepository.findOne({
      user: otherUser,
    })
    if (
      creatorSettings != undefined &&
      creatorSettings.minimumTipAmount != undefined &&
      creatorSettings.minimumTipAmount > 0 &&
      (sendMessageDto.tipAmount == undefined ||
        sendMessageDto.tipAmount < creatorSettings.minimumTipAmount)
    ) {
      throw new BadRequestException(
        `must tip at least ${creatorSettings.minimumTipAmount} gems to chat with ${otherUserId}}`,
      )
    }

    // const user = await this.userRepository.findOne(userId)
    // const messageResp: any = undefined

    const messageId = uuid.v4()
    if (
      sendMessageDto.tipAmount != undefined &&
      sendMessageDto.tipAmount != 0
    ) {
      // TODO: move over to callback.type.ts
      // const handleGems = async (): Promise<boolean> => {
      //   const messageSendResponse = await channel.sendMessage({
      //     id: messageId,
      //     text: sendMessageDto.text,
      //     user_id: userId,
      //     tipAmount: sendMessageDto.tipAmount,
      //   })
      //   messageResp = messageSendResponse
      //   return messageSendResponse.message != undefined
      // }
      // await this.gemService.executeGemTransactions(
      //   [
      //     new GemTransaction(
      //       user as UserEntity,
      //       sendMessageDto.tipAmount * -1,
      //       `senttip.message.${messageId}`,
      //     ),
      //     new GemTransaction(
      //       otherUser as UserEntity,
      //       sendMessageDto.tipAmount,
      //       `receivedtip.message.${messageId}`,
      //     ),
      //   ],
      //   handleGems,
      // )
      // return messageResp
    } else {
      return await channel.sendMessage({
        id: messageId,
        text: sendMessageDto.text,
        user_id: userId,
      })
    }
  }
}
