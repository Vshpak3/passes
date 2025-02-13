import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import CryptoJS from 'crypto-js'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { OrderEnum } from '../../util/dto/page.dto'
import { createPaginatedQuery } from '../../util/page.util'
import { rejectIfAny } from '../../util/promise.util'
import { ContentService } from '../content/content.service'
import { ContentDto } from '../content/dto/content.dto'
import { ContentBareDto } from '../content/dto/content-bare'
import { ContentEntity } from '../content/entities/content.entity'
import { MINIMUM_MESSAGE_TIP_AMOUNT } from '../creator-settings/creator-settings.service'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { UserSpendingEntity } from '../creator-stats/entities/user-spending.entity'
import { FollowEntity } from '../follow/entities/follow.entity'
import { FollowBlockEntity } from '../follow/entities/follow-block.entity'
import { ListService } from '../list/list.service'
import { PassEntity } from '../pass/entities/pass.entity'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { PassService } from '../pass/pass.service'
import {
  MessagePayinCallbackInput,
  PurchaseMessageCallbackInput,
} from '../payment/callback.types'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { PayinMethodDto } from '../payment/dto/payin-method.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { BlockedReasonEnum } from '../payment/enum/blocked-reason.enum'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { InvalidPayinRequestError } from '../payment/error/payin.error'
import { PaymentService } from '../payment/payment.service'
import { ScheduledEventEntity } from '../scheduled/entities/scheduled-event.entity'
import { ScheduledEventTypeEnum } from '../scheduled/enum/scheduled-event.type.enum'
import { checkScheduledAt } from '../scheduled/scheduled.util'
import { UserEntity } from '../user/entities/user.entity'
import { ChannelMemberDto } from './dto/channel-member.dto'
import { CreateBatchMessageRequestDto } from './dto/create-batch-message.dto'
import { CreateWelcomeMessageRequestDto } from './dto/create-welcome-message.dto'
import {
  GetChannelRequestDto,
  GetChannelsRequestDto,
} from './dto/get-channel.dto'
import { GetChannelMesssageInfoResponseDto } from './dto/get-channel-message-info.dto'
import { GetMessagesRequestDto } from './dto/get-message.dto'
import {
  GetMessageBuyersRequestDto,
  MessageBuyerDto,
} from './dto/get-message-buyers.dto'
import { GetPaidMessagesRequestDto } from './dto/get-paid-message.dto'
import { GetPaidMessageHistoryRequestDto } from './dto/get-paid-message-history.dto'
import { MessageDto } from './dto/message.dto'
import { MessageNotificationDto } from './dto/message-notification.dto'
import { PaidMessageDto } from './dto/paid-message.dto'
import { PaidMessageHistoryDto } from './dto/paid-message-history.dto'
import { SendMessageRequestDto } from './dto/send-message.dto'
import { UpdateChannelSettingsRequestDto } from './dto/update-channel-settings.dto'
import { ChannelEntity } from './entities/channel.entity'
import { ChannelMemberEntity } from './entities/channel-members.entity'
import { MessageEntity } from './entities/message.entity'
import { PaidMessageEntity } from './entities/paid-message.entity'
import { PaidMessageHistoryEntity } from './entities/paid-message-history.entity'
import { UserMessageContentEntity } from './entities/user-message-content.entity'
import { ChannelOrderTypeEnum } from './enum/channel.order.enum'
import { MessageNotificationEnum } from './enum/message.notification.enum'
import { ChannelNotFoundException } from './error/channel.error'
import {
  MessageNotFoundException,
  MessageSendError,
  PaidMessageNotFoundException,
} from './error/message.error'

const MAX_CHANNELS_PER_REQUEST = 20
const MAX_MESSAGES_PER_REQUEST = 20
const MAX_PENDING_MESSAGES = 10
const MAX_PAID_MESSAGES_PER_REQUEST = 20
const MAX_MESSAGE_BUYERS_PER_REQUEST = 20

@Injectable()
export class MessagesService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    @Inject(forwardRef(() => PaymentService))
    private readonly payService: PaymentService,
    private readonly passService: PassService,
    private readonly listService: ListService,
    private readonly contentService: ContentService,
    @InjectRedis('message_publisher') private readonly redisService: Redis,
  ) {}

  async createChannel(
    userId: string,
    getChannelRequestDto: GetChannelRequestDto,
  ): Promise<ChannelMemberDto> {
    if (userId === getChannelRequestDto.userId) {
      throw new BadRequestException('cant send message to yourselft')
    }
    const otherUser = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id: getChannelRequestDto.userId })
      .select('id', 'is_creator')
      .first()

    if (!otherUser) {
      throw new BadRequestException('userId could not be found')
    }

    const lookup = await this.dbReader<ChannelMemberEntity>(
      ChannelMemberEntity.table,
    )
      .where({
        user_id: userId,
        other_user_id: otherUser.id,
      })
      .select('channel_id')
      .first()

    if (!lookup) {
      const channelData = {
        id: v4(),
      }
      const user = await this.dbReader<UserEntity>(UserEntity.table)
        .where({ id: userId })
        .select('is_creator')
        .first()
      if (!otherUser.is_creator && !user?.is_creator) {
        throw new ChannelNotFoundException('can not create channel to user')
      }
      await this.dbWriter.transaction(async (trx) => {
        await trx<ChannelEntity>(ChannelEntity.table).insert(channelData)
        await trx<ChannelMemberEntity>(ChannelMemberEntity.table).insert({
          channel_id: channelData.id,
          user_id: userId,
          other_user_id: otherUser.id,
        })
        await trx<ChannelMemberEntity>(ChannelMemberEntity.table).insert({
          channel_id: channelData.id,
          other_user_id: userId,
          user_id: otherUser.id,
        })
      })
    }

    const channelMember = await this.dbWriter<ChannelMemberEntity>(
      ChannelMemberEntity.table,
    )
      .innerJoin(
        ChannelEntity.table,
        `${ChannelMemberEntity.table}.channel_id`,
        `${ChannelEntity.table}.id`,
      )
      .innerJoin(
        UserEntity.table,
        `${ChannelMemberEntity.table}.other_user_id`,
        `${UserEntity.table}.id`,
      )
      .where({
        user_id: userId,
        other_user_id: otherUser.id,
      })
      .select([
        `${ChannelMemberEntity.table}.*`,
        `${ChannelEntity.table}.id as channel_id`,
        `${UserEntity.table}.username as other_user_username`,
        `${UserEntity.table}.display_name as other_user_display_name`,
        `${UserEntity.table}.is_creator as other_user_is_creator`,
      ])
      .first()

    return new ChannelMemberDto(channelMember)
  }

  async getChannel(userId: string, getChannelRequestDto: GetChannelRequestDto) {
    const channelMember = await this.dbReader<ChannelMemberEntity>(
      ChannelMemberEntity.table,
    )
      .innerJoin(
        ChannelEntity.table,
        `${ChannelMemberEntity.table}.channel_id`,
        `${ChannelEntity.table}.id`,
      )
      .innerJoin(
        UserEntity.table,
        `${ChannelMemberEntity.table}.other_user_id`,
        `${UserEntity.table}.id`,
      )
      .where({
        user_id: userId,
        other_user_id: getChannelRequestDto.userId,
      })
      .select([
        `${ChannelMemberEntity.table}.*`,
        `${ChannelEntity.table}.id as channel_id`,
        `${UserEntity.table}.username as other_user_username`,
        `${UserEntity.table}.display_name as other_user_display_name`,
        `${UserEntity.table}.is_creator as other_user_is_creator`,
      ])
      .first()

    return new ChannelMemberDto(channelMember)
  }

  async getChannels(
    userId: string,
    getChannelsRequestDto: GetChannelsRequestDto,
  ) {
    const { lastId, search, order, recent, tip, orderType, unreadOnly, spent } =
      getChannelsRequestDto
    let query = this.dbWriter<ChannelMemberEntity>(ChannelMemberEntity.table)
      .innerJoin(
        ChannelEntity.table,
        `${ChannelMemberEntity.table}.channel_id`,
        `${ChannelEntity.table}.id`,
      )
      .innerJoin(
        UserEntity.table,
        `${ChannelMemberEntity.table}.other_user_id`,
        `${UserEntity.table}.id`,
      )
      .whereNotNull(`${ChannelEntity.table}.recent`)
      .andWhere(`${ChannelMemberEntity.table}.user_id`, userId)
      .select([
        `${ChannelMemberEntity.table}.*`,
        `${ChannelEntity.table}.id as channel_id`,
        `${ChannelEntity.table}.recent`,
        `${ChannelEntity.table}.preview_text`,
        `${UserEntity.table}.username as other_user_username`,
        `${UserEntity.table}.display_name as other_user_display_name`,
        `${UserEntity.table}.is_creator as other_user_is_creator`,
      ])

    switch (orderType) {
      case ChannelOrderTypeEnum.RECENT:
        query = createPaginatedQuery(
          query,
          ChannelEntity.table,
          ChannelMemberEntity.table,
          'recent',
          order,
          recent,
          lastId,
        )
        break
      case ChannelOrderTypeEnum.TIP:
        query = createPaginatedQuery(
          query,
          ChannelMemberEntity.table,
          ChannelMemberEntity.table,
          'unread_tip',
          order,
          tip,
          lastId,
        )
        break
      case ChannelOrderTypeEnum.SPENT:
        query = query
          .leftJoin(
            UserSpendingEntity.table,
            `${UserSpendingEntity.table}.user_id`,
            `${ChannelMemberEntity.table}.other_user_id`,
          )
          .where(function () {
            return this.where(
              `${UserSpendingEntity.table}.creator_id`,
              userId,
            ).orWhereNull(`${UserSpendingEntity.table}.creator_id`)
          })
          .select(`${UserSpendingEntity.table}.amount as spent`)
        query = createPaginatedQuery(
          query,
          UserSpendingEntity.table,
          ChannelMemberEntity.table,
          'amount',
          order,
          spent,
          lastId,
        )
        break
    }
    if (unreadOnly) {
      query = query.andWhere(`${ChannelMemberEntity.table}.unread`, true)
    }

    if (search && search.length) {
      // const strippedSearch = search.replace(/\W/g, '')
      const likeClause = `%${search}%`
      query = query.andWhere(function () {
        return this.whereILike(
          `${UserEntity.table}.username`,
          likeClause,
        ).orWhereILike(`${UserEntity.table}.display_name`, likeClause)
      })
    }

    const channelMembers = await query.limit(MAX_CHANNELS_PER_REQUEST)
    return channelMembers.map(
      (channelMember) => new ChannelMemberDto(channelMember),
    )
  }

  async createPaidMessage(
    userId: string,
    text: string,
    contentIds: string[],
    price: number,
    sentTo: number,
    previewIndex: number,
    isWelcomeMessage?: boolean,
    override = false,
  ): Promise<{ paidMessageId?: string; contents: string }> {
    const { contentsBare } = await this.contentService.validateContentIds(
      userId,
      contentIds,
    )
    const data = {
      id: v4(),
      creator_id: userId,
      text,
      price,
      contents: JSON.stringify(contentsBare),
      sent_to: sentTo,
      preview_index: previewIndex,
      is_welcome_message: isWelcomeMessage,
    }
    if (price || override) {
      await this.dbWriter.transaction(async (trx) => {
        await trx<PaidMessageEntity>(PaidMessageEntity.table).insert(data)
        await trx<ContentEntity>(ContentEntity.table)
          .update({ in_message: true })
          .whereIn('id', contentIds)
      })
    }
    return {
      paidMessageId: price ? data.id : undefined,
      contents: data.contents,
    }
  }

  async getRemovedUserIds(userIds: string[], contentIds: string[]) {
    if (!userIds.length || !contentIds.length) {
      return []
    }
    return (
      await this.dbReader<UserMessageContentEntity>(
        UserMessageContentEntity.table,
      )
        .whereIn('user_id', userIds)
        .whereIn('content_id', contentIds)
        .distinct('user_id')
    ).map((messageContent) => messageContent.user_id)
  }

  async publishBatchMessage(
    userId: string,
    createBatchMessageDto: CreateBatchMessageRequestDto,
  ): Promise<void> {
    const {
      includeListIds,
      excludeListIds,
      includePassIds,
      excludePassIds,
      contentIds,
      price,
      text,
      previewIndex,
    } = createBatchMessageDto
    if (contentIds.length === 0 && price) {
      throw new MessageSendError('cant give price to messages with no content')
    }

    await this.passService.validatePassIds(userId, [
      ...includePassIds,
      ...excludePassIds,
    ])

    const include = new Set([
      ...(await this.listService.getAllListMembers(userId, includeListIds)),
      ...(await this.passService.getAllPassHolders(includePassIds)),
    ])

    const userIds = Array.from(include)

    const exclude = new Set([
      ...(await this.listService.getAllListMembers(userId, excludeListIds)),
      ...(await this.passService.getAllPassHolders(excludePassIds)),
      ...(await this.getRemovedUserIds(userIds, contentIds)),
      userId,
    ])

    const finalUserIds = userIds.filter((userId) => !exclude.has(userId))

    const { paidMessageId, contents } = await this.createPaidMessage(
      userId,
      text,
      contentIds,
      price ?? 0,
      finalUserIds.length,
      previewIndex,
    )

    rejectIfAny(
      await Promise.allSettled(
        finalUserIds.map(async (otherUserId) => {
          const channelId = (
            await this.createChannel(userId, {
              userId: otherUserId,
            })
          ).channelId
          try {
            await this.createMessage(
              false,
              userId,
              text,
              channelId,
              otherUserId,
              0,
              false,
              contents,
              previewIndex,
              price,
              paidMessageId,
            )
          } catch (err) {
            this.logger.error(
              `failed to send batch message ${paidMessageId} to ${userId}`,
              err,
            )
          }
        }),
      ),
    )
  }

  async createBatchMessage(
    userId: string,
    createBatchMessageDto: CreateBatchMessageRequestDto,
  ): Promise<void> {
    if (
      createBatchMessageDto.includeListIds.length +
        createBatchMessageDto.includePassIds.length ===
      0
    ) {
      throw new BadRequestException('Must select a list or pass')
    }
    if (
      createBatchMessageDto.text.length === 0 &&
      createBatchMessageDto.contentIds.length === 0
    ) {
      throw new BadRequestException(
        'Must provide either text or content in a batch message',
      )
    }
    if (createBatchMessageDto.scheduledAt) {
      const scheduledAt = createBatchMessageDto.scheduledAt
      checkScheduledAt(scheduledAt)
      createBatchMessageDto.scheduledAt = undefined
      await this.dbWriter<ScheduledEventEntity>(
        ScheduledEventEntity.table,
      ).insert({
        user_id: userId,
        type: ScheduledEventTypeEnum.BATCH_MESSAGE,
        body: JSON.stringify(createBatchMessageDto),
        scheduled_at: scheduledAt,
      })
    } else {
      await this.publishBatchMessage(userId, createBatchMessageDto)
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async registerSendMessage(
    userId: string,
    sendMessageDto: SendMessageRequestDto,
  ) {
    const {
      text,
      contentIds,
      channelId,
      tipAmount,
      price,
      previewIndex,
      scheduledAt,
    } = sendMessageDto

    if (scheduledAt) {
      throw new MessageSendError(
        "We currently don't support scheduled normal direct messages",
      )
    }
    if (tipAmount && price) {
      throw new MessageSendError("Can't send message with tip and price")
    }
    if (text.length === 0 && contentIds.length === 0) {
      throw new BadRequestException(
        'Must provide either text or content in a message',
      )
    }
    if (contentIds.length === 0 && price) {
      throw new MessageSendError("can't give price to messages with no content")
    }

    const channelMember = await this.dbReader<ChannelMemberEntity>(
      ChannelMemberEntity.table,
    )
      .where({ user_id: userId, channel_id: sendMessageDto.channelId })
      .select(['unlimited_messages', 'other_user_id'])
      .first()
    if (!channelMember) {
      throw new ChannelNotFoundException(
        `channel ${sendMessageDto.channelId} not found for user ${userId}`,
      )
    }
    const removed = await this.getRemovedUserIds(
      [channelMember.other_user_id],
      contentIds,
    )
    if (removed.length > 0) {
      throw new MessageSendError("Can't send purchased content")
    }

    const { blocked, amount } = await this.registerSendMessageData(
      userId,
      sendMessageDto,
      channelMember.other_user_id,
    )
    if (blocked) {
      throw new MessageSendError(blocked)
    }
    if (amount !== 0) {
      if (price) {
        throw new MessageSendError('can not send priced message with tip')
      }
      const callbackInput: MessagePayinCallbackInput = {
        userId,
        text: text,
        channelId: channelId,
        contents: JSON.stringify(
          (await this.contentService.validateContentIds(userId, contentIds))
            .contentsBare,
        ),
        receiverId: channelMember.other_user_id,
        previewIndex,
      }
      return await this.payService.registerPayin({
        userId,
        amount: sendMessageDto.tipAmount,
        callback: PayinCallbackEnum.TIPPED_MESSAGE,
        callbackInputJSON: callbackInput,
        creatorId: channelMember.other_user_id,
        payinMethod:
          sendMessageDto.payinMethod ??
          (await this.payService.getDefaultPayinMethod(userId)),
      })
    } else {
      const { paidMessageId, contents } = await this.createPaidMessage(
        userId,
        text,
        contentIds,
        price ?? 0,
        1,
        previewIndex,
      )
      await this.createMessage(
        true,
        userId,
        text,
        channelId,
        channelMember.other_user_id,
        tipAmount,
        false,
        contents,
        previewIndex,
        price,
        paidMessageId,
      )
      await this.checkFreeMessages(userId, channelMember.other_user_id, true)
      return new RegisterPayinResponseDto()
    }
  }

  async registerSendMessageData(
    userId: string,
    sendMessageDto: SendMessageRequestDto,
    otherUserId?: string,
  ): Promise<PayinDataDto> {
    const { channelId, tipAmount, payinMethod } = sendMessageDto
    if (!otherUserId) {
      const channelMember = await this.dbReader<ChannelMemberEntity>(
        ChannelMemberEntity.table,
      )
        .where({ user_id: userId, channel_id: channelId })
        .select(['unlimited_messages', 'other_user_id'])
        .first()
      otherUserId = channelMember ? channelMember.other_user_id : ''
    }

    let blocked = await this.checkMessageBlocked(
      userId,
      otherUserId as string,
      tipAmount,
    )
    const count = await this.dbReader<MessageEntity>(MessageEntity.table)
      .where({
        sender_id: userId,
        channel_id: channelId,
        pending: true,
      })
      .count()
    if (tipAmount > 0) {
      if (count[0]['count(*)'] >= MAX_PENDING_MESSAGES) {
        blocked = BlockedReasonEnum.TOO_MANY
      } else if (await this.payService.checkPayinBlocked(userId)) {
        blocked = BlockedReasonEnum.PAYMENTS_DEACTIVATED
      }
    }
    if (
      tipAmount !== 0 &&
      !this.payService.validatePayinData(userId, payinMethod)
    ) {
      blocked = BlockedReasonEnum.NO_PAYIN_METHOD
    }
    if (tipAmount > 0 && tipAmount < MINIMUM_MESSAGE_TIP_AMOUNT) {
      blocked = BlockedReasonEnum.INSUFFICIENT_TIP
    }
    return { blocked, amount: sendMessageDto.tipAmount }
  }

  async getMinimumTip(creatorId: string) {
    const creatorSettings = await this.dbReader<CreatorSettingsEntity>(
      CreatorSettingsEntity.table,
    )
      .where({ user_id: creatorId })
      .select('minimum_tip_amount')
      .first()
    return creatorSettings?.minimum_tip_amount
  }

  async getChannelMessageInfo(userId: string, channelId: string) {
    const channelMember = await this.dbReader<ChannelMemberEntity>(
      ChannelMemberEntity.table,
    )
      .where({ user_id: userId, channel_id: channelId })
      .select(['unlimited_messages', 'other_user_id'])
      .first()
    if (!channelMember) {
      throw new BadRequestException('channel not found')
    }
    const minimumTip = await this.getMinimumTip(channelMember.other_user_id)
    return new GetChannelMesssageInfoResponseDto(
      await this.checkFreeMessages(
        userId,
        channelMember.other_user_id,
        false,
        minimumTip,
      ),
      !!minimumTip,
      minimumTip ?? MINIMUM_MESSAGE_TIP_AMOUNT,
    )
  }

  async checkFreeMessages(
    userId: string,
    creatorId: string,
    remove = false,
    minimumTip?: number | null,
  ): Promise<number | null> {
    // TODO - per channel settings feature
    // if (!channelMember) {
    //   channelMember = await this.dbReader<ChannelMemberEntity>(
    //     ChannelMemberEntity.table,
    //   )
    //     .where({ user_id: userId, channel_id: channelId })
    //     .select(['unlimited_messages', 'other_user_id'])
    //     .first()
    //   if (!channelMember) {
    //     throw new ChannelNotFoundException(
    //       `channel ${channelId} not found for user ${userId}`,
    //     )
    //   }
    // }
    // const creatorId = channelMember.other_user_id
    // if (channelMember.unlimited_messages) {
    //   return null
    // }
    if (minimumTip === undefined) {
      minimumTip = await this.getMinimumTip(creatorId)
      if (!minimumTip) {
        return null
      }
    }
    const follow = await this.dbReader<FollowEntity>(FollowEntity.table)
      .where({
        follower_id: creatorId,
        creator_id: userId,
      })
      .select('follower_id', 'creator_id')

    if (follow.length === 1) {
      return null
    }

    const passHoldings = await this.dbReader<PassHolderEntity>(
      PassHolderEntity.table,
    )
      .innerJoin(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${PassHolderEntity.table}.pass_id`,
      )
      .where(`${PassEntity.table}.creator_id`, creatorId)
      .andWhere(`${PassHolderEntity.table}.holder_id`, userId)
      .andWhere(function () {
        return this.whereNull(`${PassHolderEntity.table}.expires_at`).orWhere(
          `${PassHolderEntity.table}.expires_at`,
          '>',
          new Date(),
        )
      })
      .select(
        `${PassHolderEntity.table}.messages`,
        `${PassHolderEntity.table}.id`,
      )
      .orderBy('messages', 'desc')
    if (passHoldings.length === 0) {
      return 0
    }
    if (passHoldings[passHoldings.length - 1].messages === null) {
      return null
    } else {
      if (remove) {
        await this.dbWriter<PassHolderEntity>(PassHolderEntity.table)
          .where({ id: passHoldings[0].id })
          .andWhere('messages', '>', 0)
          .decrement('messages', 1)
      }
      return passHoldings.reduce((sum, passHolding) => {
        return sum + passHolding.messages ?? 0
      }, 0)
    }
  }

  async checkMessageBlocked(
    userId: string,
    otherUserId: string,
    tipAmount: number,
  ): Promise<BlockedReasonEnum | undefined> {
    if (tipAmount > 0 && tipAmount < MINIMUM_MESSAGE_TIP_AMOUNT) {
      return BlockedReasonEnum.INSUFFICIENT_TIP
    }

    const follow = await this.dbReader<FollowEntity>(FollowEntity.table)
      .where({
        follower_id: userId,
        creator_id: otherUserId,
      })
      .orWhere({
        follower_id: otherUserId,
        creator_id: userId,
      })
      .select('follower_id', 'creator_id')

    // neither user can be blocked
    if (await this.checkBlocked(userId, otherUserId)) {
      return BlockedReasonEnum.USER_BLOCKED
    }

    const passHolder = await this.dbReader<PassHolderEntity>(
      PassHolderEntity.table,
    )
      .innerJoin(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${PassHolderEntity.table}.pass_id`,
      )
      .where(`${PassEntity.table}.creator_id`, otherUserId)
      .andWhere(`${PassHolderEntity.table}.holder_id`, userId)
      .select(`${PassHolderEntity.table}.id`)
      .first()
    if (follow.length === 0 && !passHolder) {
      return BlockedReasonEnum.DOES_NOT_FOLLOW
    }
    if (
      follow.length === 2 ||
      (follow.length === 1 && follow[0].follower_id === otherUserId)
    ) {
      return undefined
    }

    const minimum = await this.getMinimumTip(otherUserId)
    const freeMessages = await this.checkFreeMessages(
      userId,
      otherUserId,
      false,
      minimum,
    )
    if (
      !minimum ||
      tipAmount >= minimum ||
      freeMessages === null ||
      (freeMessages > 0 && tipAmount === 0)
    ) {
      return undefined
    }
    return BlockedReasonEnum.INSUFFICIENT_TIP
  }

  async sendAutomaticMessage(
    senderId: string,
    receiverId: string,
    message: string,
  ) {
    const channel = await this.createChannel(senderId, {
      userId: receiverId,
    })
    await this.createMessage(
      false,
      senderId,
      message,
      channel.channelId,
      receiverId,
      0,
      false,
      '[]',
      0,
      0,
      undefined,
      true,
    )
  }

  async createMessage(
    read: boolean,
    userId: string,
    text: string,
    channelId: string,
    receiverId: string,
    tipAmount: number,
    pending: boolean,
    contents: string,
    previewIndex: number,
    price?: number,
    paidMessageId?: string,
    automatic?: boolean,
  ): Promise<string> {
    // eslint-disable-next-line no-magic-numbers
    const hasContent = contents.length > 8
    const data = {
      id: v4(),
      sender_id: userId,
      text,
      channel_id: channelId,
      tip_amount: tipAmount,
      pending,
      price: price ?? 0,
      paid_message_id: paidMessageId ?? null,
      contents,
      paid_at: null,
      preview_index: previewIndex,
      has_content: hasContent,
      content_processed: !hasContent,
      sent_at: new Date(),
      automatic,
    } as MessageEntity
    await this.dbWriter<MessageEntity>(MessageEntity.table).insert(data)
    if (!pending) {
      await this.updateStatus(userId, channelId, text)
    }
    if (read) {
      await this.read(userId, channelId, receiverId)
    }
    await this.redisService.publish(
      'message',
      JSON.stringify(
        new MessageNotificationDto(
          data,
          this.getContents(data),
          receiverId,
          pending
            ? MessageNotificationEnum.PENDING
            : MessageNotificationEnum.MESSAGE,
        ),
      ),
    )
    return data.id
  }

  async sendPendingMessage(
    userId: string,
    messageId: string,
    channelId: string,
    receiverId: string,
    tipAmount: number,
  ) {
    const date = new Date()
    const updated = await this.dbWriter<MessageEntity>(MessageEntity.table)
      .where({
        id: messageId,
        pending: true,
      })
      .update({
        sent_at: date,
        pending: false,
      })
    if (updated) {
      const message = await this.dbWriter<MessageEntity>(MessageEntity.table)
        .where({
          id: messageId,
        })
        .select('*')
        .first()
      if (!message) {
        throw new InternalServerErrorException('no message found')
      }
      await this.updateStatus(userId, channelId, message.text)
      await this.updateChannelTipStats(userId, channelId, tipAmount)
      message.pending = false
      message.sent_at = date
      await this.redisService.publish(
        'message',
        JSON.stringify(
          new MessageNotificationDto(
            message,
            this.getContents(message),
            receiverId,
            MessageNotificationEnum.MESSAGE,
          ),
        ),
      )
    }
  }

  async updateStatus(userId: string, channelId: string, previewText: string) {
    await this.dbWriter<ChannelMemberEntity>(ChannelMemberEntity.table)
      .where({ channel_id: channelId })
      .andWhereNot({ user_id: userId })
      .update({ unread: true })
      .increment('unread_count', 1)
    await this.dbWriter<ChannelEntity>(ChannelEntity.table)
      .where({ id: channelId })
      .update({ recent: new Date(), preview_text: previewText })
  }

  async getTotalUnread(userId: string) {
    return (
      await this.dbReader<ChannelMemberEntity>(ChannelMemberEntity.table)
        .where({ user_id: userId })
        .sum('unread_count')
    )[0]['sum(`unread_count`)']
  }

  async deletePendingMessage(messageId: string): Promise<boolean> {
    const result =
      (await this.dbWriter<MessageEntity>(MessageEntity.table)
        .where({ id: messageId, pending: true })
        .update({ deleted_at: new Date() })) === 1
    if (result) {
      const message = await this.dbReader<MessageEntity>(MessageEntity.table)
        .where({ id: messageId })
        .select('*')
        .first()
      if (!message) {
        throw new InternalServerErrorException('message not found')
      }
      await this.redisService.publish(
        'message',
        JSON.stringify(
          new MessageNotificationDto(
            message,
            [],
            '',
            MessageNotificationEnum.DELETED,
          ),
        ),
      )
    }
    return result
  }

  async updateChannelTipStats(
    userId: string,
    channelId: string,
    amount: number,
  ) {
    await this.dbWriter<ChannelMemberEntity>(ChannelMemberEntity.table)
      .where({
        user_id: userId,
        channel_id: channelId,
      })
      .increment('tip_sent', amount)
    await this.dbWriter<ChannelMemberEntity>(ChannelMemberEntity.table)
      .where({ channel_id: channelId })
      .andWhereNot({ user_id: userId })
      .increment('tip_received', amount)
    if (amount > 0) {
      await this.dbWriter<ChannelMemberEntity>(ChannelMemberEntity.table)
        .where({ channel_id: channelId })
        .andWhereNot({ user_id: userId })
        .increment('unread_tip', amount)
    }
    // TODO: add channel subscribe
  }

  async revertMessage(messageId: string): Promise<void> {
    const tippedMessage = await this.dbReader<MessageEntity>(
      MessageEntity.table,
    )
      .where({ id: messageId })
      .select('*')
      .first()
    if (!tippedMessage) {
      throw new MessageNotFoundException(`message ${messageId} not found`)
    }
    await this.updateChannelTipStats(
      tippedMessage.sender_id,
      tippedMessage.channel_id,
      tippedMessage.tip_amount,
    )
    await this.dbWriter<MessageEntity>(MessageEntity.table)
      .where({ id: messageId })
      .update({ reverted: true })
  }

  async updateChannelSettings(
    userId: string,
    updateChannelSettingsDto: UpdateChannelSettingsRequestDto,
  ) {
    const data = {
      unlimited_messages: updateChannelSettingsDto.unlimitedMessages,
      channel_id: updateChannelSettingsDto.channelId,
    }
    Object.keys(data).forEach((key) =>
      data[key] === undefined ? delete data[key] : {},
    )
    if (Object.keys(data).length === 0) {
      return
    }
    await this.dbWriter<ChannelMemberEntity>(ChannelMemberEntity.table)
      .update(data)
      .where({
        user_id: userId,
        channel_id: updateChannelSettingsDto.channelId,
      })
  }

  async checkBlocked(userId: string, otherUserId: string): Promise<boolean> {
    const blockedResult = await this.dbReader<FollowBlockEntity>(
      FollowBlockEntity.table,
    )
      .where({ follower_id: userId, creator_id: otherUserId })
      .orWhere({ follower_id: otherUserId, creator_id: userId })
      .select(`${FollowBlockEntity.table}.id`)
      .first()
    return !!blockedResult
  }

  async read(userId: string, channelId: string, otherUserId: string) {
    const date = new Date()
    await this.dbWriter<ChannelMemberEntity>(ChannelMemberEntity.table)
      .where({ channel_id: channelId, user_id: userId })
      .update({ unread: false, unread_tip: 0, read_at: date, unread_count: 0 })

    // near impossible for exact date to milliseconds to be the same
    // TODO randomize to avoid hitting too often
    await this.dbWriter<MessageEntity>(MessageEntity.table)
      .where({ read_at: null, channel_id: channelId, sender_id: otherUserId })
      .update({ read_at: date })
    const paidMessageIds = (
      await this.dbWriter<MessageEntity>(MessageEntity.table)
        .whereNotNull('paid_message_id')
        .andWhere({
          read_at: date,
          channel_id: channelId,
          sender_id: otherUserId,
        })
        .select('paid_message_id')
    ).map((message) => message.paid_message_id)
    await this.dbWriter<PaidMessageEntity>(PaidMessageEntity.table)
      .whereIn('id', paidMessageIds)
      .increment('viewed', 1)
  }

  async purchaseMessage(
    userId: string,
    messageId: string,
    paidMessageId: string,
    earnings: number,
  ) {
    const message = await this.dbReader<MessageEntity>(MessageEntity.table)
      .where({ id: messageId })
      .select('*')
      .first()
    if (!message) {
      throw new MessageNotFoundException(`message ${messageId} not found`)
    }
    const date = new Date()
    await this.dbWriter.transaction(async (trx) => {
      await trx<MessageEntity>(MessageEntity.table)
        .update({ paid_at: date, paying: false, payer_id: userId })
        .where({ id: messageId })
      await trx<PaidMessageEntity>(PaidMessageEntity.table)
        .where({ id: paidMessageId })
        .increment('num_purchases', 1)
        .increment('earnings_purchases', earnings)
      if (!message) {
        throw new MessageNotFoundException(`message ${messageId} not found`)
      }

      const contents = JSON.parse(message.contents)

      rejectIfAny(
        await Promise.allSettled(
          contents.map(async (content: ContentBareDto) => {
            await trx<UserMessageContentEntity>(UserMessageContentEntity.table)
              .insert({ user_id: userId, content_id: content.contentId })
              .onConflict(['user_id', 'content_id'])
              .ignore()
          }),
        ),
      )
    })

    message.paid_at = date
    message.paying = false
    await this.redisService.publish(
      'message',
      JSON.stringify(
        new MessageNotificationDto(
          message,
          this.getContents(message),
          userId,
          MessageNotificationEnum.PAID,
        ),
      ),
    )
  }

  async payingMessage(userId: string, messageId: string) {
    await this.dbWriter<MessageEntity>(MessageEntity.table)
      .update({ paying: true })
      .where({ id: messageId })
    const message = await this.dbReader<MessageEntity>(MessageEntity.table)
      .where({ id: messageId })
      .select('*')
      .first()
    if (!message) {
      throw new MessageNotFoundException(`message ${messageId} not found`)
    }
    message.paying = true
    await this.redisService.publish(
      'message',
      JSON.stringify(
        new MessageNotificationDto(
          message,
          this.getContents(message),
          userId,
          MessageNotificationEnum.PAYING,
        ),
      ),
    )
  }

  async failMessagePayment(userId: string, messageId: string) {
    await this.dbWriter<MessageEntity>(MessageEntity.table)
      .update({ paying: false })
      .where({ id: messageId })
    const message = await this.dbReader<MessageEntity>(MessageEntity.table)
      .where({ id: messageId })
      .select('*')
      .first()
    if (!message) {
      throw new MessageNotFoundException(`message ${messageId} not found`)
    }
    message.paying = true
    await this.redisService.publish(
      'message',
      JSON.stringify(
        new MessageNotificationDto(
          message,
          this.getContents(message),
          userId,
          MessageNotificationEnum.FAILED_PAYMENT,
        ),
      ),
    )
  }

  async revertMessagePurchase(
    messageId: string,
    paidMessageId: string,
    amount: number,
  ) {
    await this.dbWriter.transaction(async (trx) => {
      await trx<MessageEntity>(MessageEntity.table)
        .update({ paid_at: null, payer_id: null })
        .where({ id: messageId })
      await trx<PaidMessageEntity>(PaidMessageEntity.table)
        .where({ id: paidMessageId })
        .decrement('num_purchases', 1)
        .decrement('earnings_purchases', amount)
    })
  }

  async registerPurchaseMessage(
    userId: string,
    messageId: string,
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const { amount, target, blocked } = await this.registerPurchaseMessageData(
      userId,
      messageId,
    )
    if (blocked) {
      throw new InvalidPayinRequestError(blocked)
    }
    const message = await this.dbReader<MessageEntity>(MessageEntity.table)
      .where({ id: messageId })
      .select(['sender_id', 'paid_message_id'])
      .first()
    if (!message || !message.paid_message_id) {
      throw new MessageNotFoundException(`message ${messageId} not found`)
    }
    const callbackInput: PurchaseMessageCallbackInput = {
      messageId,
      paidMessageId: message.paid_message_id,
    }
    if (!payinMethod) {
      payinMethod = await this.payService.getDefaultPayinMethod(userId)
    }

    return await this.payService.registerPayin({
      userId,
      target,
      amount,
      payinMethod,
      callback: PayinCallbackEnum.PURCHASE_DM,
      callbackInputJSON: callbackInput,
      creatorId: message.sender_id,
    })
  }

  async registerPurchaseMessageData(
    userId: string,
    messageId: string,
    payinMethod?: PayinMethodDto,
  ): Promise<PayinDataDto> {
    const target = CryptoJS.SHA256(`message-${userId}-${messageId}`).toString(
      CryptoJS.enc.Hex,
    )

    const message = await this.dbReader<MessageEntity>(MessageEntity.table)
      .where({ id: messageId })
      .select('paid_at', 'price')
      .first()
    if (!message || !message.price) {
      throw new MessageNotFoundException(`message ${messageId} not found`)
    }
    let blocked: BlockedReasonEnum | undefined = undefined
    if (await this.payService.checkPayinBlocked(userId)) {
      blocked = BlockedReasonEnum.PAYMENTS_DEACTIVATED
    } else if (message.price === undefined || message.price === 0) {
      blocked = BlockedReasonEnum.NO_PRICE
    } else if (await this.payService.checkPayinTargetBlocked(target)) {
      blocked = BlockedReasonEnum.PURCHASE_IN_PROGRESS
    } else if (message.paid_at) {
      blocked = BlockedReasonEnum.ALREADY_HAS_ACCESS
    }

    if (!this.payService.validatePayinData(userId, payinMethod)) {
      blocked = BlockedReasonEnum.NO_PAYIN_METHOD
    }

    return { amount: message.price, target, blocked }
  }

  async getMessages(
    userId: string,
    getMessagesRequestDto: GetMessagesRequestDto,
  ) {
    const { sentAt, lastId, dateLimit, channelId, contentOnly, pending, paid } =
      getMessagesRequestDto
    const channel = await this.dbReader<ChannelMemberEntity>(
      ChannelMemberEntity.table,
    )
      .where({ channel_id: channelId, user_id: userId })
      .select('id')
      .first()
    if (!channel) {
      throw new ChannelNotFoundException(
        `cant find channel ${channelId} for user ${userId}`,
      )
    }

    let query = this.dbReader<MessageEntity>(MessageEntity.table)
      .where({ channel_id: channelId, pending, deleted_at: null })
      .select(`${MessageEntity.table}.*`)
      .limit(MAX_MESSAGES_PER_REQUEST)

    query = createPaginatedQuery(
      query,
      MessageEntity.table,
      MessageEntity.table,
      'sent_at',
      OrderEnum.DESC,
      sentAt,
      lastId,
    )
    if (contentOnly) {
      query = query.where('has_content', true).andWhereNot('sender_id', userId)
    }

    if (paid !== undefined) {
      query = query.where('paid', paid)
    }

    if (pending) {
      query = query.andWhere({ sender_id: userId })
    }

    if (dateLimit) {
      query = query.andWhere(`${MessageEntity.table}.sent_at`, '>=', dateLimit)
    }

    const messages = await query
    return messages.map((message) => {
      return new MessageDto(message, this.getContents(message))
    })
  }

  async getMessage(userId: string, messageId: string) {
    const message = await this.dbReader<MessageEntity>(MessageEntity.table)
      .innerJoin(
        ChannelMemberEntity.table,
        `${ChannelMemberEntity.table}.channel_id`,
        `${MessageEntity.table}.channel_id`,
      )
      .where(`${MessageEntity.table}.id`, messageId)
      .andWhere(`${ChannelMemberEntity.table}.user_id`, userId)
      .select(`${MessageEntity.table}.*`)
      .first()
    return new MessageDto(message, this.getContents(message))
  }

  getContents(message: MessageEntity): ContentDto[] {
    return this.contentService.getContentDtosFromBare(
      JSON.parse(message.contents),
      !!message.paid_at || !message.price,
      message.sender_id,
      message.preview_index,
    )
  }

  async createMessageHistory() {
    await this.dbWriter
      .from(
        this.dbWriter.raw('?? (??, ??, ??, ??)', [
          PaidMessageHistoryEntity.table,
          'paid_message_id',
          'num_purchases',
          'earnings_purchases',
          'sent_to',
        ]),
      )
      .insert(
        this.dbWriter<PaidMessageEntity>(PaidMessageEntity.table).select([
          'id as paid_message_id',
          'num_purchases',
          'earnings_purchases',
          'sent_to',
        ]),
      )
  }

  async getPaidMessageHistory(
    userId: string,
    getPaidMessageHistoryRequestDto: GetPaidMessageHistoryRequestDto,
  ) {
    const { paidMessageId, start, end } = getPaidMessageHistoryRequestDto
    const paidMessage = await this.dbReader<PaidMessageEntity>(
      PaidMessageEntity.table,
    ).where({
      id: paidMessageId,
      creator_id: userId,
    })
    if (!paidMessage) {
      throw new PaidMessageNotFoundException(
        `paid message ${paidMessageId} not found for user ${userId}`,
      )
    }
    const paidMessageHistories = await this.dbReader(
      PaidMessageHistoryEntity.table,
    )
      .where('paid_message_id', paidMessageId)
      .andWhere('created_at', '>=', start)
      .andWhere('created_at', '<=', end)
    return paidMessageHistories.map(
      (paidMessageHistory) => new PaidMessageHistoryDto(paidMessageHistory),
    )
  }

  async getPaidMessages(
    userId: string,
    getPaidMessagesRequestDto: GetPaidMessagesRequestDto,
  ) {
    const { lastId, createdAt } = getPaidMessagesRequestDto
    let query = this.dbReader<PaidMessageEntity>(PaidMessageEntity.table)
      .where('creator_id', userId)
      .select('*')
      .whereNull(`${PaidMessageEntity.table}.hidden_at`)
      .limit(MAX_MESSAGES_PER_REQUEST)
    query = createPaginatedQuery(
      query,
      PaidMessageEntity.table,
      PaidMessageEntity.table,
      'created_at',
      OrderEnum.DESC,
      createdAt,
      lastId,
    ).limit(MAX_PAID_MESSAGES_PER_REQUEST)
    const paidMessages = await query
    return paidMessages.map((paidMessage) => new PaidMessageDto(paidMessage))
  }

  async getWelcomeMessage(userId: string) {
    const welcomeMessage = await this.dbReader<PaidMessageEntity>(
      PaidMessageEntity.table,
    )
      .where({
        is_welcome_message: true,
        creator_id: userId,
      })
      .orderBy('created_at', 'desc')
      .limit(1)
      .first()
    return new PaidMessageDto(welcomeMessage)
  }

  async createWelcomeMessage(
    userId: string,
    createWelcomeMessageRequestDto: CreateWelcomeMessageRequestDto,
  ) {
    const { text, contentIds, price, previewIndex } =
      createWelcomeMessageRequestDto
    if (text.length === 0 && contentIds.length === 0) {
      throw new BadRequestException(
        'Must provide either text or content in a welcome message',
      )
    }
    await this.createPaidMessage(
      userId,
      text,
      contentIds,
      price ?? 0,
      0,
      previewIndex,
      true,
      true,
    )
    return true
  }

  async unsendPaidMessage(userId: string, paidMessageId: string) {
    let updated = 0
    await this.dbWriter.transaction(async (trx) => {
      updated = await trx<PaidMessageEntity>(PaidMessageEntity.table)
        .where({ id: paidMessageId, creator_id: userId, unsent_at: null })
        .update({ unsent_at: new Date() })
      if (updated) {
        await trx<MessageEntity>(MessageEntity.table)
          .where({
            paid_message_id: paidMessageId,
            paid_at: null,
            paying: false,
          })
          .update({ deleted_at: new Date() })
      }
    })
    const channels = await this.dbWriter<MessageEntity>(MessageEntity.table)
      .whereNotNull('deleted_at')
      .andWhere({
        paid_message_id: paidMessageId,
      })
      .select('channel_id')
    rejectIfAny(
      await Promise.allSettled(
        channels.map(
          async (channel) => await this.updateChannel(channel.channel_id),
        ),
      ),
    )
    return !!updated
  }

  async updateChannel(channelId: string) {
    const message = await this.dbWriter<MessageEntity>(MessageEntity.table)
      .where({ channel_id: channelId, pending: false })
      .whereNull('deleted_at')
      .select('sent_at', 'text')
      .orderBy('sent_at', 'desc')
      .first()

    await this.dbWriter<ChannelEntity>(ChannelEntity.table)
      .update({
        preview_text: message?.text ?? null,
        recent: message?.sent_at ?? null,
      })
      .where({ id: channelId })
  }

  async hidePaidMessage(userId: string, paidMessageId: string) {
    const updated = await this.dbWriter<PaidMessageEntity>(
      PaidMessageEntity.table,
    )
      .where(function () {
        return this.whereNotNull('unsent_at').orWhere(
          'is_welcome_message',
          true,
        )
      })
      .andWhere({ id: paidMessageId, creator_id: userId })
      .update({ hidden_at: new Date() })
    return updated === 1
  }

  async checkRecentMessagesContentProcessed(checkProcessedUntil: number) {
    const messageIds = (
      await this.dbWriter<MessageEntity>(MessageEntity.table)
        .where({ content_processed: false })
        .andWhere('created_at', '>', new Date(Date.now() - checkProcessedUntil))
        .select('id')
    ).map((message) => message.id)
    rejectIfAny(
      await Promise.allSettled(
        messageIds.map(async (messageId) => {
          await this.checkMessageContentProcessed(messageId)
        }),
      ),
    )
  }

  async checkMessageContentProcessed(messageId: string): Promise<void> {
    const message = await this.dbWriter<MessageEntity>(MessageEntity.table)
      .leftJoin(ChannelMemberEntity.table, function () {
        this.on(
          `${MessageEntity.table}.channel_id`,
          `${ChannelMemberEntity.table}.channel_id`,
        ).andOn(
          `${MessageEntity.table}.sender_id`,
          `${ChannelMemberEntity.table}.other_user_id`,
        )
      })
      .where(`${MessageEntity.table}.id`, messageId)
      .select(
        `${MessageEntity.table}.*`,
        `${ChannelMemberEntity.table}.user_id`,
      )
      .first()

    if (!message) {
      throw new BadRequestException(`No message with id ${messageId}`)
    }

    if (message.content_processed) {
      return
    }

    const contentsBare = JSON.parse(message.contents) as ContentBareDto[]
    const isProcessed = await this.contentService.isAllProcessed(contentsBare)
    if (isProcessed) {
      const sentAt = new Date()
      await this.dbWriter<MessageEntity>(MessageEntity.table)
        .where({ id: messageId })
        .update({ content_processed: true, sent_at: sentAt })
      const contents = this.getContents(message)
      message.content_processed = true
      await this.redisService.publish(
        'message',
        JSON.stringify(
          new MessageNotificationDto(
            message,
            contents,
            message.user_id,
            MessageNotificationEnum.PROCESSED,
          ),
        ),
      )
    }
  }

  async getMessageBuyers(
    userId: string,
    getMessageBuyersRequestDto: GetMessageBuyersRequestDto,
  ): Promise<MessageBuyerDto[]> {
    const { paidMessageId, lastId, paidAt } = getMessageBuyersRequestDto
    const paidMessage = await this.dbReader<PaidMessageEntity>(
      PaidMessageEntity.table,
    )
      .where({ id: paidMessageId, creator_id: userId })
      .select('id')
      .first()
    if (!paidMessage) {
      throw new BadRequestException(`No post with id ${paidMessage}`)
    }

    let query = this.dbReader<MessageEntity>(MessageEntity.table)
      .innerJoin(
        UserEntity.table,
        `${UserEntity.table}.id`,
        `${MessageEntity.table}.payer_id`,
      )
      .whereNotNull(`${MessageEntity.table}.payer_id`)
      .where(`${MessageEntity.table}.paid_message_id`, paidMessageId)
      .select(
        `${MessageEntity.table}.id`,
        `${MessageEntity.table}.payer_id as receiver_id`,
        `${MessageEntity.table}.paid_at`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
      )

    query = createPaginatedQuery(
      query,
      MessageEntity.table,
      MessageEntity.table,
      'paid_at',
      OrderEnum.DESC,
      paidAt,
      lastId,
    ).limit(MAX_MESSAGE_BUYERS_PER_REQUEST)

    const messageBuyers = await query
    return messageBuyers.map(
      (messageBuyer) => new MessageBuyerDto(messageBuyer),
    )
  }
}
