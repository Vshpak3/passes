// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
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
import { ContentMessageEntity } from '../content/entities/content-message.entity'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { ListEntity } from '../list/entities/list.entity'
import { MessagePayinCallbackInput } from '../payment/callback.types'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { PaymentService } from '../payment/payment.service'
import { UserEntity } from '../user/entities/user.entity'
import { ChannelStatDto } from './dto/channel-stat.dto'
import { CreateBatchMessageRequestDto } from './dto/create-batch-message.dto'
import { CreateChannelRequestDto } from './dto/create-channel.dto'
import { MessageDto } from './dto/message.dto'
import { SendMessageRequestDto } from './dto/send-message.dto'
import { TokenResponseDto } from './dto/token.dto'
import { BatchMessageEntity } from './entities/batch-message.entity'
import { ChannelStatEntity } from './entities/channel-stat.entity'
import { TippedMessageEntity } from './entities/tipped-message.entity'

const MESSAGING_CHAT_TYPE = 'messaging'
const BATCH_MESSAGE_CHUNK_SIZE = 500

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

  async getToken(userId: string): Promise<TokenResponseDto> {
    await this.streamClient.upsertUser({ id: userId })

    return { token: this.streamClient.createToken(userId) }
  }

  async createChannel(
    userId: string,
    createChannelDto: CreateChannelRequestDto,
  ): Promise<ChannelStatDto> {
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

    await this.dbWriter(ChannelStatEntity.table)
      .insert(
        ChannelStatEntity.toDict<ChannelStatEntity>({
          channelId: createResponse.channel.id,
          totalTipAmount: 0,
          user: userId,
          otherUser: otherUser.id,
        }),
      )
      .onConflict('channel_id')
      .ignore()

    return {
      id: createResponse.channel.id,
      totalTipAmount: 0,
    }
  }

  async createBatchMessage(
    userId: string,
    createBatchMessageDto: CreateBatchMessageRequestDto,
  ): Promise<void> {
    const listResult = await this.dbReader(ListEntity.table)
      .select('list.id')
      .where('list.user_id', userId)
      .where('list.id', createBatchMessageDto.list)

    if (listResult[0] == undefined) {
      throw new NotFoundException('list not found')
    }

    if (createBatchMessageDto.content != undefined) {
      const contentListResult = await this.dbReader('content_list')
        .select('content_list.content_entity_id')
        .where('content_list.list_entity_id', createBatchMessageDto.list)
        .whereIn(
          'content_list.content_entity_id',
          createBatchMessageDto.content,
        )
        .limit(1)
      if (contentListResult.length > 0) {
        throw new BadRequestException(
          'content has already been sent to this list',
        )
      }
      const contentResult = await this.dbReader(ContentEntity.table)
        .select('content.id')
        .where('content.user_id', userId)
        .whereIn('content.id', createBatchMessageDto.content)

      if (contentResult.length != createBatchMessageDto.content.length) {
        throw new NotFoundException('content not found')
      }
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
            await trx('content_list').insert({
              content_entity_id: createBatchMessageDto.content[i],
              list_entity_id: createBatchMessageDto.list,
            })
          }
        }
      })
      .catch((err) => {
        this.logger.error(err)
        throw new InternalServerErrorException()
      })
  }

  async getBatchMessagesToBeProcessed(): Promise<any[]> {
    return await this.dbReader(BatchMessageEntity.table)
      .select('batch_message.id', 'batch_message.last_processed_id')
      .where('batch_message.last_processed_id', null)
      .orWhereNot(
        'batch_message.last_processed_id',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
      )
  }

  async processBatchMessageChunk(
    batchMessageId: string,
    lastProcessed: string | null,
  ): Promise<void> {
    const batchMessageListMembersQuery = this.dbReader(BatchMessageEntity.table)
      .innerJoin('list', 'list.id', 'batch_message.list_id')
      .innerJoin('list_member', 'list_member.list_id', 'list.id')
      .select(
        'batch_message.id',
        'batch_message.text',
        'batch_message.last_processed_id',
        this.dbReader.raw('batch_message.user_id as sender'),
        this.dbReader.raw('list_member.id as list_member_id'),
        this.dbReader.raw('list_member.user_id as recipient'),
      )
      .where('batch_message.id', batchMessageId)

    if (lastProcessed != null) {
      batchMessageListMembersQuery.where(
        this.dbReader.raw('list_member.id > batch_message.last_processed_id'),
      )
    }

    const batchMessageListMembers = await batchMessageListMembersQuery
      .orderBy('list_member.id', 'asc')
      .limit(BATCH_MESSAGE_CHUNK_SIZE)

    if (batchMessageListMembers.length == 0) {
      await this.dbWriter(BatchMessageEntity.table)
        .update(
          'batch_message.last_processed_id',
          'ffffffff-ffff-ffff-ffff-ffffffffffff',
        )
        .where('batch_message.id', batchMessageId)
      return
    }

    const batchMessageContentResult = await this.dbReader(
      BatchMessageEntity.table,
    )
      .innerJoin(
        'content_batch_message',
        'content_batch_message.batch_message_id',
        'batch_message.id',
      )
      .select('content_batch_message.content_id')
      .where('batch_message.id', batchMessageId)
    const content = batchMessageContentResult.map((batchMessageContent) => {
      return batchMessageContent.content_id
    })

    for (let i = 0; i < batchMessageListMembers.length; i++) {
      await this.streamClient.upsertUser({
        id: batchMessageListMembers[i].recipient,
      })
      const channel = this.streamClient.channel('messaging', {
        members: [
          batchMessageListMembers[i].sender,
          batchMessageListMembers[i].recipient,
        ],
        created_by_id: batchMessageListMembers[i].sender,
      })
      // create channel
      const createResponse = await channel.create()
      try {
        await this.sendMessage(
          batchMessageListMembers[i].sender,
          new MessageDto(
            batchMessageListMembers[i].text,
            [],
            createResponse.channel.id,
            content,
          ),
        )
      } catch (err) {
        this.logger.info(
          `error sending message to recipient ${batchMessageListMembers[i].recipient} as part of batch message ${batchMessageId}`,
          err,
        )
      }
      await this.dbWriter(BatchMessageEntity.table)
        .update(
          'batch_message.last_processed_id',
          batchMessageListMembers[i].list_member_id,
        )
        .where('batch_message.id', batchMessageId)
    }
  }

  async registerSendMessage(
    userId: string,
    sendMessageDto: SendMessageRequestDto,
  ) {
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
        `must tip at least ${creatorSettings.minimumTipAmount} to chat with ${otherUser.id}}`,
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
        callback: PayinCallbackEnum.TIPPED_MESSAGE,
        callbackInputJSON: callbackInput,
        creatorId: otherUser.id,
      })
    } else {
      await this.sendMessage(userId, sendMessageDto)
      return new RegisterPayinResponseDto()
    }
  }

  async sendMessage(
    userId: string,
    sendMessageDto: MessageDto,
    tippedMessageId?: string,
  ) {
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
    if (sendMessageDto.content.length > 0) {
      const contentMessageResult = await this.dbReader(
        ContentMessageEntity.table,
      )
        .select('content_message.id')
        .whereIn('content_message.content_id', sendMessageDto.content)
        .where('content_message.recipient_id', otherUserId)
      if (contentMessageResult[0] != undefined) {
        throw new BadRequestException(
          'content has already been sent to recipient',
        )
      }

      const messageId = v4()
      const contentMessageRecords: Array<any> = []
      for (let i = 0; i < sendMessageDto.content.length; i++) {
        contentMessageRecords.push({
          id: v4(),
          content_id: sendMessageDto.content[i],
          message_id: messageId,
          recipient_id: otherUserId,
          sender_id: userId,
        })
      }
      await this.dbWriter(ContentMessageEntity.table).insert(
        contentMessageRecords,
      )
    }

    const messageId = v4()
    const response = await channel.sendMessage({
      id: messageId,
      text: sendMessageDto.text,
      user_id: userId,
      tipAmount:
        sendMessageDto.tipAmount === 0 ? undefined : sendMessageDto.tipAmount,
      creatorContent: sendMessageDto.content.join(','),
    })
    if (tippedMessageId) {
      await this.dbWriter(TippedMessageEntity.table)
        .update(
          TippedMessageEntity.toDict<TippedMessageEntity>({
            pending: false,
            messageId: messageId,
          }),
        )
        .where('id', tippedMessageId)
      await this.dbWriter(ChannelStatEntity.table)
        .join(
          TippedMessageEntity.table,
          `${TippedMessageEntity.table}.channel_id`,
          `${ChannelStatEntity.table}.channel_id`,
        )
        .increment('total_tip_amount', sendMessageDto.tipAmount)
        .where(`${TippedMessageEntity.table}.id`, tippedMessageId)
    }
    return response
  }

  async createTippedMessage(userId: string, sendMessageDto: MessageDto) {
    const id = v4()
    await this.dbWriter(TippedMessageEntity.table).insert(
      TippedMessageEntity.toDict<TippedMessageEntity>({
        id,
        sender: userId,
        text: sendMessageDto.text,
        attachmentsJSON: JSON.stringify(sendMessageDto.attachments),
        channelId: sendMessageDto.channelId,
        tipAmount: sendMessageDto.tipAmount,
        pending: true,
      }),
    )
    return id
  }

  async deleteTippedMessage(tippedMessageId: string) {
    return await this.dbWriter(TippedMessageEntity.table)
      .where('id', tippedMessageId)
      .delete()
  }

  async getPendingTippedMessages(userId: string) {
    return (
      await this.dbReader(TippedMessageEntity.table).where(
        TippedMessageEntity.toDict<TippedMessageEntity>({
          sender: userId,
          pending: true,
        }),
      )
    ).map(
      (message) =>
        new MessageDto(
          message.text,
          JSON.parse(message.attachments),
          message.channel_id,
          [],
          message.tip_amount,
        ),
    )
  }

  async getCompletedTippedMessages(userId: string) {
    return (
      await this.dbReader(TippedMessageEntity.table).where(
        TippedMessageEntity.toDict<TippedMessageEntity>({
          sender: userId,
          pending: false,
        }),
      )
    ).map(
      (message) =>
        new MessageDto(
          message.text,
          JSON.parse(message.attachments),
          message.channel_id,
          [],
          message.tip_amount,
        ),
    )
  }

  async getChannelsStats(userId: string) {
    return (
      await this.dbReader(ChannelStatEntity.table)
        .where('user', userId)
        .orWhere('other_user', userId)
        .select('*')
    ).map((channelStat) => new ChannelStatDto(channelStat))
  }
}
