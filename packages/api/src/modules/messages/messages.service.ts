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
import { Channel, StreamChat } from 'stream-chat'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { ContentEntity } from '../content/entities/content.entity'
import { ContentBatchMessageEntity } from '../content/entities/content-batch-message.entity'
import { ContentMessageEntity } from '../content/entities/content-message.entity'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { FollowBlockEntity } from '../follow/entities/follow-block.entity'
import { ListEntity } from '../list/entities/list.entity'
import { PassEntity } from '../pass/entities/pass.entity'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { MessagePayinCallbackInput } from '../payment/callback.types'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { PaymentService } from '../payment/payment.service'
import { UserEntity } from '../user/entities/user.entity'
import { ChannelSettingsDto } from './dto/channel-settings.dto'
import { ChannelStatDto } from './dto/channel-stat.dto'
import { CreateBatchMessageRequestDto } from './dto/create-batch-message.dto'
import { CreateChannelRequestDto } from './dto/create-channel.dto'
import { GetChannelResponseDto } from './dto/get-channel.dto'
import { MessageDto } from './dto/message.dto'
import { SendMessageRequestDto } from './dto/send-message.dto'
import { TokenResponseDto } from './dto/token.dto'
import { UpdateChannelSettingsRequestDto } from './dto/update-channel-settings.dto'
import { BatchMessageEntity } from './entities/batch-message.entity'
import { ChannelSettingsEntity } from './entities/channel-settings.entity'
import { ChannelStatEntity } from './entities/channel-stat.entity'
import { TippedMessageEntity } from './entities/tipped-message.entity'
import { ChannelMissingMembersError } from './error/channel.error'
import { MessageTipError } from './error/message.error'

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
  ): Promise<GetChannelResponseDto> {
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

    await this.dbWriter(ChannelSettingsEntity.table)
      .insert([
        ChannelSettingsEntity.toDict<ChannelSettingsEntity>({
          channelId: createResponse.channel.id,
          user: userId,
        }),
        ChannelSettingsEntity.toDict<ChannelSettingsEntity>({
          channelId: createResponse.channel.id,
          user: otherUser.id,
        }),
      ])
      .onConflict(['channel_id', 'user_id'])
      .ignore()

    return {
      channelId: createResponse.channel.id,
      blocked: await this.checkBlocked(userId, otherUser.id),
    }
  }

  async createBatchMessage(
    userId: string,
    createBatchMessageDto: CreateBatchMessageRequestDto,
  ): Promise<void> {
    const listResult = await this.dbReader(ListEntity.table)
      .select('id')
      .where('user_id', userId)
      .where('id', createBatchMessageDto.listId)
      .first()

    if (listResult == undefined) {
      throw new NotFoundException('list not found')
    }

    if (createBatchMessageDto.content !== undefined) {
      const contentListResult = await this.dbReader('content_list')
        .select('content_list.content_entity_id')
        .where('content_list.list_entity_id', createBatchMessageDto.listId)
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
    await this.dbWriter
      .transaction(async (trx) => {
        await trx(BatchMessageEntity.table).insert(
          BatchMessageEntity.toDict<BatchMessageEntity>({
            id: batchMessageId,
            user: userId,
            list: createBatchMessageDto.listId,
            text: createBatchMessageDto.text,
          }),
        )

        if (createBatchMessageDto.content != undefined) {
          const contentBatchMessageIds: string[] = []
          for (let i = 0; i < createBatchMessageDto.content.length; i++) {
            contentBatchMessageIds.push(v4())
            await trx(ContentBatchMessageEntity.table).insert(
              ContentBatchMessageEntity.toDict<ContentBatchMessageEntity>({
                id: contentBatchMessageIds[i],
                content: createBatchMessageDto.content[i],
                batchMessage: batchMessageId,
              }),
            )
            await trx('contentList').insert({
              contentEntity: createBatchMessageDto.content[i],
              listEntity: createBatchMessageDto.listId,
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
      await batchMessageListMembersQuery.where(
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
    const channel = this.streamClient.channel(
      MESSAGING_CHAT_TYPE,
      sendMessageDto.channelId,
    )
    const otherUserId = await this.getOtherUserId(userId, channel)
    const { blocked, amount } = await this.registerSendMessageData(
      userId,
      sendMessageDto,
      otherUserId,
    )
    if (blocked) throw new MessageTipError('insufficient tip for message')
    if (amount !== 0) {
      const callbackInput: MessagePayinCallbackInput = {
        userId,
        sendMessageDto,
      }
      return await this.payService.registerPayin({
        userId,
        amount: sendMessageDto.tipAmount,
        callback: PayinCallbackEnum.TIPPED_MESSAGE,
        callbackInputJSON: callbackInput,
        creatorId: otherUserId,
      })
    } else {
      await this.sendMessage(userId, sendMessageDto)
      await this.removeFreeMessage(
        userId,
        otherUserId,
        sendMessageDto.channelId,
      )
      return new RegisterPayinResponseDto()
    }
  }

  async registerSendMessageData(
    userId: string,
    sendMessageDto: SendMessageRequestDto,
    otherUserId?: string,
  ): Promise<PayinDataDto> {
    if (!otherUserId) {
      const channel = this.streamClient.channel(
        MESSAGING_CHAT_TYPE,
        sendMessageDto.channelId,
      )

      otherUserId = await this.getOtherUserId(userId, channel)
    }
    const blocked = await this.checkMessageBlocked(
      userId,
      otherUserId,
      sendMessageDto.channelId,
      sendMessageDto.tipAmount,
    )

    return { blocked, amount: sendMessageDto.tipAmount }
  }

  async removeFreeMessage(
    userId: string,
    creatorId: string,
    channelId: string,
  ) {
    if (
      (await this.getChannelSettings(creatorId, channelId)).unlimitedMessages
    ) {
      return
    }
    const passHoldings = await this.dbReader(PassHolderEntity.table)
      .innerJoin(
        PassHolderEntity.table,
        `${PassEntity.table}.id`,
        `${PassHolderEntity.table}.pass_id`,
      )
      .where(`${PassEntity.table}.creator_id`, creatorId)
      .andWhere(`${PassHolderEntity.table}.holder_id`, userId)
      .andWhere(function () {
        return this.whereNull(`${PassHolderEntity.table}.expires_at`).orWhere(
          `${PassHolderEntity.table}.expires_at`,
          '<=',
          Date.now(),
        )
      })
      .select([
        `${PassHolderEntity.table}.id`,
        `${PassHolderEntity.table}.messages`,
      ])
      .orderBy('messages', 'desc')
    if (
      passHoldings.length === 0 ||
      passHoldings[passHoldings.length - 1].messages === null
    )
      return
    await this.dbWriter(PassHolderEntity.table)
      .where('id', passHoldings[0].id)
      .andWhere('messages', '>', 0)
      .decrement('messages', 1)
  }

  async checkFreeMessages(
    userId: string,
    creatorId: string,
    channelId: string,
  ): Promise<number | null> {
    if (
      (await this.getChannelSettings(creatorId, channelId)).unlimitedMessages
    ) {
      return null
    }

    const passHoldings = await this.dbReader(PassHolderEntity.table)
      .innerJoin(
        PassHolderEntity.table,
        `${PassEntity.table}.id`,
        `${PassHolderEntity.table}.pass_id`,
      )
      .where(`${PassEntity.table}.creator_id`, creatorId)
      .andWhere(`${PassHolderEntity.table}.holder_id`, userId)
      .andWhere(function () {
        return this.whereNull(`${PassHolderEntity.table}.expires_at`).orWhere(
          `${PassHolderEntity.table}.expires_at`,
          '<=',
          Date.now(),
        )
      })
      .select(`${PassHolderEntity.table}.messages`)
      .orderBy('messages', 'desc')
    if (passHoldings.length === 0) return 0
    if (passHoldings[passHoldings.length - 1].messages === null) return null
    else
      return passHoldings.reduce((sum, passHolding) => {
        if (passHolding.messages) sum += passHolding.messages
      }, 0)
  }

  async checkMessageBlocked(
    userId: string,
    otherUserId: string,
    channelId: string,
    tipAmount: number,
  ): Promise<boolean> {
    if (await this.checkBlocked(userId, otherUserId)) return true
    const creatorSettings = await this.dbReader(CreatorSettingsEntity.table)
      .where(
        CreatorSettingsEntity.toDict<CreatorSettingsEntity>({
          user: otherUserId,
        }),
      )
      .select('minimum_tip_amount')
      .first()
    if (!creatorSettings) return true
    const freeMessages = await this.checkFreeMessages(
      userId,
      otherUserId,
      channelId,
    )
    if (freeMessages === null || (freeMessages > 0 && tipAmount === 0))
      return true
    return tipAmount >= creatorSettings?.minimum_tip_amount
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

    const otherUserId = await this.getOtherUserId(userId, channel)
    if (await this.checkBlocked(userId, otherUserId)) {
      throw new BadRequestException(`user is blocked`)
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

  async deleteTippedMessage(tippedMessageId: string): Promise<boolean> {
    return (
      (await this.dbWriter(TippedMessageEntity.table)
        .where('id', tippedMessageId)
        .delete()) === 1
    )
  }

  async getPendingTippedMessages(userId: string): Promise<Array<MessageDto>> {
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

  async getCompletedTippedMessages(userId: string): Promise<Array<MessageDto>> {
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

  async getChannelsStats(userId: string): Promise<Array<ChannelStatDto>> {
    return (
      await this.dbReader(ChannelStatEntity.table)
        .where('user_id', userId)
        .orWhere('other_user_id', userId)
        .select('*')
    ).map((channelStat) => new ChannelStatDto(channelStat))
  }

  async getChannelSettings(userId: string, channelId: string) {
    return new ChannelSettingsDto(
      await this.dbReader(ChannelSettingsEntity.table)
        .where(
          ChannelSettingsEntity.toDict<ChannelSettingsEntity>({
            user: userId,
            channelId: channelId,
          }),
        )
        .orWhere('other_user', userId),
    )
  }

  async updateChannelSettings(
    userId: string,
    channelId: string,
    updateChannelSettingsDto: UpdateChannelSettingsRequestDto,
  ) {
    if (Object.keys(updateChannelSettingsDto).length === 0) return
    await this.dbWriter(ChannelSettingsEntity.table)
      .update(
        ChannelSettingsEntity.toDict<ChannelSettingsEntity>(
          updateChannelSettingsDto,
        ),
      )
      .where(
        ChannelSettingsEntity.toDict<ChannelSettingsEntity>({
          user: userId,
          channelId: channelId,
        }),
      )
  }

  async checkBlocked(userId: string, otherUserId: string): Promise<boolean> {
    const followReportResult = await this.dbReader(FollowBlockEntity.table)
      .whereIn(`${FollowBlockEntity.table}.follower_id`, [userId, otherUserId])
      .whereIn(`${FollowBlockEntity.table}.creator_id`, [userId, otherUserId])
      .select(`${FollowBlockEntity.table}.id`)
      .first()
    return !!followReportResult
  }

  async getOtherUserId(userId: string, channel: Channel): Promise<string> {
    const userIds = (await channel.queryMembers({})).members.map(
      (member) => member.user_id,
    )
    if (userIds.indexOf(userId) < 0)
      throw new ChannelMissingMembersError(`${userId} is not in this channel`)
    for (const id in userIds) {
      if (id && id != userId) {
        return id as string
      }
    }
    throw new ChannelMissingMembersError(
      `channel with ${userId} is missing another member`,
    )
  }
}
