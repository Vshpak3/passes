import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { StreamChat } from 'stream-chat'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { ContentEntity } from '../content/entities/content.entity'
import { ContentBatchMessageEntity } from '../content/entities/content-batch-message.entity'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { ListEntity } from '../list/entities/list.entity'
import { MessagePayinCallbackInput } from '../payment/callback.types'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { PaymentService } from '../payment/payment.service'
import { UserEntity } from '../user/entities/user.entity'
import { CreateBatchMessageDto } from './dto/create-batch-message.dto'
import { CreateChannelDto } from './dto/create-channel.dto'
import { GetChannelDto } from './dto/get-channel.dto'
import { MessageDto } from './dto/message.dto'
import { TokenDto } from './dto/token.dto'
import { BatchMessageEntity } from './entities/batch-message.entity'
import { PendingMessageEntity } from './entities/pending-message.entity'

const MESSAGING_CHAT_TYPE = 'messaging'

@Injectable()
export class MessagesService {
  streamClient: StreamChat
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],

    @Inject(forwardRef(() => PaymentService))
    private readonly payService: PaymentService,
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
    const otherUser = await this.dbReader(UserEntity.table)
      .where(
        UserEntity.toDict<UserEntity>({
          username: createChannelDto.username,
        }),
      )
      .first()

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

  async createBatchMessage(
    userId: string,
    createBatchMessageDto: CreateBatchMessageDto,
  ): Promise<void> {
    const listResult = this.dbReader(ListEntity.table)
      .select('list.id')
      .where('list.user_id', userId)
      .where('list.id', createBatchMessageDto.list)

    if (listResult[0] == undefined) {
      throw new NotFoundException('list not found')
    }

    const contentResult = this.dbReader(ContentEntity.table)
      .select('content.id')
      .where('content.user_id', userId)
      .where('content.id', createBatchMessageDto.content)

    if (contentResult[0] == undefined) {
      throw new NotFoundException('content not found')
    }

    const batchMessageId = v4()
    this.dbWriter
      .transaction(async (trx) => {
        await trx(BatchMessageEntity.table).insert({
          id: batchMessageId,
          user_id: userId,
          list_id: createBatchMessageDto.list,
          text: createBatchMessageDto.text,
        })

        if (createBatchMessageDto.content != undefined) {
          const contentBatchMessageIds: string[] = []
          for (let i = 0; i < createBatchMessageDto.content.length; i++) {
            contentBatchMessageIds.push(v4())
            await trx(ContentBatchMessageEntity.table).insert({
              id: contentBatchMessageIds[i],
              content_id: createBatchMessageDto.content[i],
              batch_message_id: batchMessageId,
            })
          }
        }
      })
      .catch((err) => {
        this.logger.error(err)
        throw new InternalServerErrorException()
      })
  }

  async registerSendMessage(userId: string, sendMessageDto: MessageDto) {
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
    // TODO: check if user query is needed
    const otherUser = await this.dbReader(UserEntity.table)
      .where({ id: otherUserId })
      .first()

    const creatorSettings = await this.dbReader(CreatorSettingsEntity.table)
      .where(
        CreatorSettingsEntity.toDict<CreatorSettingsEntity>({
          user: otherUser.id,
        }),
      )
      .first()

    if (
      creatorSettings != undefined &&
      creatorSettings.minimumTipAmount != undefined &&
      creatorSettings.minimumTipAmount > 0 &&
      (sendMessageDto.tipAmount == undefined ||
        sendMessageDto.tipAmount < creatorSettings.minimumTipAmount)
    ) {
      throw new BadRequestException(
        `must tip at least ${creatorSettings.minimumTipAmount} gems to chat with ${otherUser.id}}`,
      )
    }

    if (
      sendMessageDto.tipAmount != undefined &&
      sendMessageDto.tipAmount != 0
    ) {
      const callbackInput: MessagePayinCallbackInput = {
        userId,
        sendMessageDto,
      }
      const payinMethod = await this.payService.getDefaultPayinMethod(userId)
      return await this.payService.registerPayin({
        userId,
        amount: sendMessageDto.tipAmount,
        payinMethod,
        callback: PayinCallbackEnum.MESSAGE,
        callbackInputJSON: JSON.stringify(callbackInput),
        creatorShares: this.payService.generateDefaultCreatorShares(
          otherUser.id,
          sendMessageDto.tipAmount,
          payinMethod,
        ),
      })
    } else {
      await this.sendMessage(userId, sendMessageDto)
      return new RegisterPayinResponseDto()
    }
  }

  async sendMessage(userId: string, sendMessageDto: MessageDto) {
    const channel = this.streamClient.channel(
      MESSAGING_CHAT_TYPE,
      sendMessageDto.channelId,
    )

    const messageId = v4()
    return await channel.sendMessage({
      id: messageId,
      text: sendMessageDto.text,
      user_id: userId,
      tipAmount:
        sendMessageDto.tipAmount === 0 ? undefined : sendMessageDto.tipAmount,
    })
  }

  async createPendingMessage(userId: string, sendMessageDto: MessageDto) {
    const id = v4()
    await this.dbWriter(PendingMessageEntity.table).insert(
      PendingMessageEntity.toDict<PendingMessageEntity>({
        id,
        sender: userId,
        text: sendMessageDto.text,
        attachmentsJSON: JSON.stringify(sendMessageDto.attachments),
        channelId: sendMessageDto.channelId,
        tipAmount: sendMessageDto.tipAmount,
      }),
    )
    return id
  }

  async deletePendingMessage(pendingMessageId: string) {
    return await this.dbWriter(PendingMessageEntity.table)
      .where('id', pendingMessageId)
      .delete()
  }

  async getPendingMessages(userId: string) {
    return (
      await this.dbReader(PendingMessageEntity.table).where(
        PendingMessageEntity.toDict<PendingMessageEntity>({
          sender: userId,
        }),
      )
    ).map((message) => new MessageDto(message))
  }
}
