// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Channel, StreamChat } from 'stream-chat'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { FollowBlockEntity } from '../follow/entities/follow-block.entity'
import { ListMemberEntity } from '../list/entities/list-member.entity'
import { PassEntity } from '../pass/entities/pass.entity'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { MessagePayinCallbackInput } from '../payment/callback.types'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { PaymentService } from '../payment/payment.service'
import { PostEntity } from '../post/entities/post.entity'
import { PostContentEntity } from '../post/entities/post-content.entity'
import { UserEntity } from '../user/entities/user.entity'
import { ChannelSettingsDto } from './dto/channel-settings.dto'
import { ChannelStatDto } from './dto/channel-stat.dto'
import { CreateBatchMessageRequestDto } from './dto/create-batch-message.dto'
import {
  GetChannelRequestDto,
  GetChannelResponseDto,
} from './dto/get-channel.dto'
import { GetChannelStatsRequestDto } from './dto/get-channel-stat.dto'
import { MessageDto } from './dto/message.dto'
import { SendMessageRequestDto } from './dto/send-message.dto'
import { TokenResponseDto } from './dto/token.dto'
import { UpdateChannelSettingsRequestDto } from './dto/update-channel-settings.dto'
import { ChannelSettingsEntity } from './entities/channel-settings.entity'
import { ChannelStatEntity } from './entities/channel-stat.entity'
import { MessageContentEntity } from './entities/message-content.entity'
import { MessagePostEntity } from './entities/message-post.entity'
import { TippedMessageEntity } from './entities/tipped-message.entity'
import { ChannelMissingMembersError } from './error/channel.error'
import { MessageSendError, MessageTipError } from './error/message.error'

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

  async getToken(userId: string): Promise<TokenResponseDto> {
    await this.streamClient.upsertUser({ id: userId })

    return { token: this.streamClient.createToken(userId) }
  }

  async getChannel(
    userId: string,
    getChannelRequestDto: GetChannelRequestDto,
  ): Promise<GetChannelResponseDto> {
    const otherUser = await this.dbReader(UserEntity.table)
      .where(
        getChannelRequestDto.userId
          ? UserEntity.toDict<UserEntity>({
              id: getChannelRequestDto.userId,
            })
          : UserEntity.toDict<UserEntity>({
              username: getChannelRequestDto.username,
            }),
      )
      .first()

    if (otherUser == null) {
      throw new BadRequestException(
        `${getChannelRequestDto.username} could not be found`,
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
    const post = this.dbReader(PostEntity.table)
      .where(
        PostEntity.toDict<PostEntity>({
          user: userId,
          id: createBatchMessageDto.postId,
        }),
      )
      .select('id')
      .first()
    if (!post) {
      throw new MessageSendError(
        "can't send a post that doesn't exist or that you don't own",
      )
    }

    const listUserIds = (
      await this.dbReader(ListMemberEntity.table)
        .whereIn('list_id', createBatchMessageDto.listIds)
        .distinct(`user_id`)
    ).map((listMember) => listMember.user_id)
    const passUserIds = (
      await this.dbReader(PassHolderEntity.table)
        .whereIn('pass_id', createBatchMessageDto.passIds)
        .andWhere(function () {
          return this.whereNull(`${PassHolderEntity.table}.expires_at`).orWhere(
            `${PassHolderEntity.table}.expires_at`,
            '>',
            Date.now(),
          )
        })
        .distinct(`holder_id`)
    ).map((passHolder) => passHolder.holder_id)
    const userIds = Array.from(new Set(listUserIds.concat(passUserIds)))

    const contentIds = (
      await this.dbReader(PostContentEntity.table)
        .where('post_id', createBatchMessageDto.postId)
        .select('content_id')
    ).map((content) => content.id)

    const removeUserIds = new Set(
      (
        await this.dbReader(MessageContentEntity.table)
          .whereIn('user_id', userIds)
          .whereIn('content', contentIds)
          .distinct('user_id')
      ).map((messageContent) => messageContent.user_id),
    )

    const finalUserIds = userIds.filter((userId) => !removeUserIds.has(userId))
    await this.batchSendMessage(finalUserIds, createBatchMessageDto.postId)
  }

  async batchSendMessage(userIds: string[], postId: string): Promise<void> {
    await Promise.all(
      userIds.map(async (userId) => {
        const channelId = (
          await this.getChannel(userId, { username: '', userId: userId })
        ).channelId
        try {
          await this.registerSendMessage(userId, {
            text: '',
            attachments: [postId],
            channelId,
            tipAmount: 0,
          })
        } catch (err) {
          this.logger.error(
            `failed to send batch message ${postId} to ${userId}`,
            err,
          )
        }
      }),
    )
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
          '>',
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
          '>',
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
    const messageId = v4()
    const response = await channel.sendMessage({
      id: messageId,
      text: sendMessageDto.text,
      user_id: userId,
      attachments: sendMessageDto.attachments,
      tipAmount:
        sendMessageDto.tipAmount === 0 ? undefined : sendMessageDto.tipAmount,
    })
    // TODO: have better check for UUID
    if (
      sendMessageDto.attachments.length === 1 &&
      sendMessageDto.attachments[0].length === 36
    ) {
      try {
        await this.dbWriter.transaction(async (trx) => {
          await trx(MessagePostEntity.table)
            .insert(
              MessagePostEntity.toDict<MessagePostEntity>({
                user: otherUserId,
                channelId: sendMessageDto.channelId,
                post: sendMessageDto.attachments[0],
              }),
            )
            .onConflict(['user_id', 'post_id'])
            .ignore()
          await trx
            .from(
              trx.raw('?? (??, ??)', [
                MessageContentEntity.table,
                'user_id',
                'channel_id',
                'content_id',
              ]),
            )
            .insert(function () {
              this.from(`${PostContentEntity.table}`)
                .where('post_id', sendMessageDto.attachments[0].length)
                .select(
                  this.dbWriter.raw('? AS ??', [otherUserId, 'user_id']),
                  this.dbWriter.raw('? AS ??', [
                    sendMessageDto.channelId,
                    'channel_id',
                  ]),
                  'content_id',
                )
            })
        })
      } catch (err) {
        this.logger.info('resent post / content')
      }
    }
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

  async getPendingTippedMessages(userId: string): Promise<MessageDto[]> {
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
          message.tip_amount,
        ),
    )
  }

  async getCompletedTippedMessages(userId: string): Promise<MessageDto[]> {
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
          message.tip_amount,
        ),
    )
  }

  async getChannelsStats(
    getChannelStatsRequestDto: GetChannelStatsRequestDto,
  ): Promise<ChannelStatDto[]> {
    return (
      await this.dbReader(ChannelStatEntity.table)
        .whereIn('channel_id', getChannelStatsRequestDto.channelIds)
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
