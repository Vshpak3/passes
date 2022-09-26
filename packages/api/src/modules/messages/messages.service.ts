import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { orderToSymbol } from '../../util/dto/page.dto'
import { ContentService } from '../content/content.service'
import { ContentDto } from '../content/dto/content.dto'
import { ContentEntity } from '../content/entities/content.entity'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
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
import { PayinEntity } from '../payment/entities/payin.entity'
import { BlockedReasonEnum } from '../payment/enum/blocked-reason.enum'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { PayinStatusEnum } from '../payment/enum/payin.status.enum'
import { InvalidPayinRequestError } from '../payment/error/payin.error'
import { PaymentService } from '../payment/payment.service'
import { S3ContentService } from '../s3content/s3content.service'
import { UserEntity } from '../user/entities/user.entity'
import { ChannelMemberDto } from './dto/channel-member.dto'
import { CreateBatchMessageRequestDto } from './dto/create-batch-message.dto'
import {
  GetChannelRequestDto,
  GetChannelsRequestDto,
} from './dto/get-channel.dto'
import { GetMessagesRequestDto } from './dto/get-message.dto'
import { MessageDto } from './dto/message.dto'
import { SendMessageRequestDto } from './dto/send-message.dto'
import { UpdateChannelSettingsRequestDto } from './dto/update-channel-settings.dto'
import { ChannelEntity } from './entities/channel.entity'
import { ChannelMemberEntity } from './entities/channel-members.entity'
import { MessageEntity } from './entities/message.entity'
import { PaidMessageEntity } from './entities/paid-message.entity'
import { PaidMessageHistoryEntity } from './entities/paid-message-history.entity'
import { UserMessageContentEntity } from './entities/user-message-content.entity'
import { ChannelOrderTypeEnum } from './enum/channel.order.enum'
import { ChannelMissingError } from './error/channel.error'
import { MessageSendError } from './error/message.error'

const MAX_CHANNELS_PER_REQUEST = 10

@Injectable()
export class MessagesService {
  cloudfrontUrl: string
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    @Inject(forwardRef(() => PaymentService))
    private readonly payService: PaymentService,
    private readonly passService: PassService,
    private readonly listService: ListService,
    private readonly contentService: ContentService,
    private readonly s3ContentService: S3ContentService,
  ) {
    this.cloudfrontUrl = configService.get('cloudfront.baseUrl') as string
  }

  async createChannel(
    userId: string,
    getChannelRequestDto: GetChannelRequestDto,
  ): Promise<ChannelMemberDto> {
    const otherUser = await this.dbReader(UserEntity.table)
      .where('id', getChannelRequestDto.userId)
      .select('id')
      .first()

    if (!otherUser) {
      throw new BadRequestException('userId could not be found')
    }

    const lookup = await this.dbReader(ChannelMemberEntity.table)
      .where(
        ChannelMemberEntity.toDict<ChannelMemberEntity>({
          user: userId,
          otherUser: otherUser.id,
        }),
      )
      .select('channel_id')
      .first()

    if (!lookup) {
      const channelData = ChannelEntity.toDict<ChannelEntity>({
        id: v4(),
      })
      await this.dbWriter.transaction(async (trx) => {
        await trx(ChannelEntity.table).insert(channelData)
        await trx(ChannelMemberEntity.table).insert(
          ChannelMemberEntity.toDict<ChannelMemberEntity>({
            channel: channelData.id,
            user: userId,
            otherUser: otherUser.id,
          }),
        )
        await trx(ChannelMemberEntity.table).insert(
          ChannelMemberEntity.toDict<ChannelMemberEntity>({
            channel: channelData.id,
            otherUser: userId,
            user: otherUser.id,
          }),
        )
      })
    }

    const channelMember = await this.dbWriter(ChannelMemberEntity.table)
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
      .where(
        ChannelMemberEntity.toDict<ChannelMemberEntity>({
          user: userId,
          otherUser: otherUser.id,
        }),
      )
      .select([
        `${ChannelMemberEntity.table}.*`,
        `${ChannelEntity.table}.id as channel_id`,
        `${ChannelEntity.table}.stream_channel_id`,
        `${UserEntity.table}.username as other_user_username`,
        `${UserEntity.table}.display_name as other_user_display_name`,
      ])
      .first()

    return new ChannelMemberDto(channelMember)
  }

  async getChannel(userId: string, getChannelRequestDto: GetChannelRequestDto) {
    const channelMember = await this.dbReader(ChannelMemberEntity.table)
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
      .where(
        ChannelMemberEntity.toDict<ChannelMemberEntity>({
          user: userId,
          otherUser: getChannelRequestDto.userId,
        }),
      )
      .select([
        `${ChannelMemberEntity.table}.*`,
        `${ChannelEntity.table}.id as channel_id`,
        `${ChannelEntity.table}.stream_channel_id`,
        `${UserEntity.table}.username as other_user_username`,
        `${UserEntity.table}.display_name as other_user_display_name`,
      ])
      .first()

    return new ChannelMemberDto(channelMember)
  }

  async getChannels(
    userId: string,
    getChannelsRequestDto: GetChannelsRequestDto,
  ) {
    const { lastId, search, order, recent, tip, orderType, unreadOnly } =
      getChannelsRequestDto
    let query = this.dbWriter(ChannelMemberEntity.table)
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
      .select([
        `${ChannelMemberEntity.table}.*`,
        `${ChannelEntity.table}.id as channel_id`,
        `${ChannelEntity.table}.stream_channel_id`,
        `${UserEntity.table}.username as other_user_username`,
        `${UserEntity.table}.display_name as other_user_display_name`,
      ])
      .where(`${ChannelMemberEntity.table}.user`, userId)
      .first()

    switch (orderType) {
      case ChannelOrderTypeEnum.RECENT:
        query = query.orderBy([
          { column: `${ChannelEntity.table}.recent`, order },
          { column: `${ChannelMemberEntity.table}.id`, order },
        ])
        if (recent) {
          query = query.andWhere(
            `${ChannelEntity.table}.recent`,
            orderToSymbol[order],
            recent,
          )
        }
        break
      case ChannelOrderTypeEnum.TIP:
        query = query.orderBy([
          { column: `${ChannelMemberEntity.table}.unread_tip`, order },
          { column: `${ChannelMemberEntity.table}.id`, order },
        ])
        if (tip) {
          query = query.andWhere(
            `${ChannelMemberEntity.table}.unread_tip`,
            orderToSymbol[order],
            tip,
          )
        }
        break
    }
    if (unreadOnly) {
      query = query.andWhere(`${ChannelMemberEntity}.unread`, true)
    }

    if (search) {
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

    const index = channelMembers.findIndex(
      (channelMember) => channelMember.id === lastId,
    )

    return channelMembers
      .slice(index + 1)
      .map((channelMember) => new ChannelMemberDto(channelMember))
  }

  async createPaidMessage(
    userId: string,
    text: string,
    contentIds: string[],
    price: number,
  ): Promise<string> {
    await this.contentService.validateContentIds(userId, contentIds)
    const data = PaidMessageEntity.toDict<PaidMessageEntity>({
      id: v4(),
      creator: userId,
      text,
      price,
      contentIds: JSON.stringify(contentIds),
    })
    await this.dbWriter.transaction(async (trx) => {
      await trx(PaidMessageEntity.table).insert(data)
      await trx(ContentEntity.table)
        .update('in_message', true)
        .whereIn('id', contentIds)
    })
    return data.id
  }

  async createBatchMessage(
    userId: string,
    createBatchMessageDto: CreateBatchMessageRequestDto,
  ): Promise<void> {
    const { includeListIds, exlcudeListIds, passIds, contentIds, price, text } =
      createBatchMessageDto
    if (contentIds.length == 0 && price) {
      throw new MessageSendError('cant give price to messages with no content')
    }
    const paidMessageId = await this.createPaidMessage(
      userId,
      text,
      contentIds,
      price ? 0 : (price as number),
    )

    await this.passService.validatePassIds(userId, passIds)

    const include = await this.listService.getAllListMembers(
      userId,
      includeListIds,
    )
    ;(
      await this.dbReader(PassHolderEntity.table)
        .whereIn('pass_id', passIds)
        .andWhere(function () {
          return this.whereNull(`${PassHolderEntity.table}.expires_at`).orWhere(
            `${PassHolderEntity.table}.expires_at`,
            '>',
            Date.now(),
          )
        })
        .distinct('holder_id')
    ).forEach((passHolder) => include.add(passHolder.holder_id))

    const exclude = await this.listService.getAllListMembers(
      userId,
      exlcudeListIds,
    )

    const userIds = Array.from(include)

    const removeUserIds = new Set(
      (
        await this.dbReader(UserMessageContentEntity.table)
          .whereIn('user_id', userIds)
          .whereIn('content', contentIds)
          .distinct('user_id')
      ).map((messageContent) => messageContent.user_id),
    )
    removeUserIds.add(userId)

    const finalUserIds = userIds.filter(
      (userId) => !removeUserIds.has(userId) && !exclude.has(userId),
    )
    await this.batchSendMessage(
      finalUserIds,
      paidMessageId,
      userId,
      text,
      price,
      contentIds,
    )
  }

  async batchSendMessage(
    userIds: string[],
    paidMessageId: string,
    creatorId: string,
    text: string,
    price?: number,
    contentIds?: string[],
  ): Promise<void> {
    await Promise.all(
      userIds.map(async (userId) => {
        const channelId = (
          await this.createChannel(userId, {
            userId: creatorId as string,
          })
        ).channelId
        try {
          await this.createMessage(
            creatorId,
            text,
            channelId,
            0,
            false,
            price,
            paidMessageId,
            contentIds,
          )
        } catch (err) {
          this.logger.error(
            `failed to send batch message ${paidMessageId} to ${userId}`,
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
    const { text, contentIds, channelId, tipAmount, price } = sendMessageDto
    if (contentIds.length == 0 && price) {
      throw new MessageSendError('cant give price to messages with no content')
    }
    const channelMember = await this.dbReader(ChannelMemberEntity.table)
      .where({ user: userId, channel: sendMessageDto.channelId })
      .select(['unlimited_messages', 'other_user_id'])
      .first()
    const { blocked, amount } = await this.registerSendMessageData(
      userId,
      sendMessageDto,
      channelMember.other_user_id,
    )
    if (blocked) {
      throw new MessageSendError(blocked)
    }
    if (amount !== 0) {
      const callbackInput: MessagePayinCallbackInput = {
        userId,
        text: text,
        channelId: channelId,
        contentIds: contentIds,
        price: price,
      }
      return await this.payService.registerPayin({
        userId,
        amount: sendMessageDto.tipAmount,
        callback: PayinCallbackEnum.TIPPED_MESSAGE,
        callbackInputJSON: callbackInput,
        creatorId: channelMember.other_user_id,
      })
    } else {
      let paidMessageId: string | undefined = undefined
      if (price && price > 0) {
        paidMessageId = await this.createPaidMessage(
          userId,
          text,
          contentIds,
          price ? 0 : (price as number),
        )
      }
      await this.createMessage(
        userId,
        text,
        channelId,
        tipAmount,
        false,
        price,
        paidMessageId,
        contentIds,
      )
      await this.removeFreeMessage(userId, sendMessageDto.channelId)
      return new RegisterPayinResponseDto()
    }
  }

  async registerSendMessageData(
    userId: string,
    sendMessageDto: SendMessageRequestDto,
    otherUserId?: string,
  ): Promise<PayinDataDto> {
    if (!otherUserId) {
      const channelMember = await this.dbReader(ChannelMemberEntity.table)
        .where({ user: userId, channel: sendMessageDto.channelId })
        .select(['unlimited_messages', 'other_user_id'])
        .first()
      otherUserId = channelMember.other_user_id
    }
    let blocked = await this.checkMessageBlocked(
      userId,
      otherUserId as string,
      sendMessageDto.channelId,
      sendMessageDto.tipAmount,
    )
    if (await this.payService.checkPayinBlocked(userId)) {
      blocked = BlockedReasonEnum.PAYMENTS_DEACTIVATED
    }

    return { blocked, amount: sendMessageDto.tipAmount }
  }

  async removeFreeMessage(userId: string, channelId: string) {
    const channelMember = await this.dbReader(ChannelMemberEntity.table)
      .where({ user: userId, channel: channelId })
      .select(['unlimited_messages', 'other_user_id'])
      .first()
    const creatorId = channelMember.other_user_id
    if (channelMember.unlimited_messages) {
      return
    }
    const creatorSettings = await this.dbReader(CreatorSettingsEntity.table)
      .where('user_id', creatorId)
      .select('minimum_tip_amount')
      .first()
    if (!creatorSettings || !creatorSettings.minimum_tip_amount) {
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
    ) {
      return
    }
    await this.dbWriter(PassHolderEntity.table)
      .where('id', passHoldings[0].id)
      .andWhere('messages', '>', 0)
      .decrement('messages', 1)
  }

  async checkFreeMessages(
    userId: string,
    channelId: string,
  ): Promise<number | null> {
    const channelMember = await this.dbReader(ChannelMemberEntity.table)
      .where({ user: userId, channel: channelId })
      .select(['unlimited_messages', 'other_user_id'])
      .first()
    const creatorId = channelMember.other_user_id
    if (channelMember.unlimited_messages) {
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
    if (passHoldings.length === 0) {
      return 0
    }
    if (passHoldings[passHoldings.length - 1].messages === null) {
      return null
    } else {
      return passHoldings.reduce((sum, passHolding) => {
        if (passHolding.messages) {
          return sum + passHolding.messages
        }
      }, 0)
    }
  }

  async checkMessageBlocked(
    userId: string,
    otherUserId: string,
    channelId: string,
    tipAmount: number,
  ): Promise<BlockedReasonEnum | undefined> {
    // userId must be a creator or follow otherUserId
    const user = await this.dbReader(UserEntity.table)
      .where('id', userId)
      .select('is_creator')
      .first()
    const follow = await this.dbReader(FollowEntity.table)
      .where(
        FollowEntity.toDict<FollowEntity>({
          follower: userId,
          creator: otherUserId,
        }),
      )
      .select('id')
      .first()
    if (!user.is_creator && !follow) {
      return BlockedReasonEnum.USER_BLOCKED
    }

    // neither user can be blocked
    if (await this.checkBlocked(userId, otherUserId)) {
      return BlockedReasonEnum.USER_BLOCKED
    }

    const creatorSettings = await this.dbReader(CreatorSettingsEntity.table)
      .where(
        CreatorSettingsEntity.toDict<CreatorSettingsEntity>({
          user: otherUserId,
        }),
      )
      .select('minimum_tip_amount')
      .first()
    if (!creatorSettings || !creatorSettings.minimum_tip_amount) {
      return undefined
    }
    if (tipAmount >= creatorSettings.minimum_tip_amount) {
      return BlockedReasonEnum.INSUFFICIENT_TIP
    }
    const freeMessages = await this.checkFreeMessages(userId, channelId)
    if (!(freeMessages === null || (freeMessages > 0 && tipAmount === 0))) {
      return BlockedReasonEnum.INSUFFICIENT_TIP
    }
    return undefined
  }

  async createMessage(
    userId: string,
    text: string,
    channelId: string,
    tipAmount: number,
    pending: boolean,
    price?: number,
    paidMessageId?: string,
    contentIds?: string[],
  ): Promise<string> {
    const data = MessageEntity.toDict<MessageEntity>({
      id: v4(),
      sender: userId,
      text,
      channel: channelId,
      tipAmount,
      pending,
      price,
      paidMessage: paidMessageId,
      contentIds: JSON.stringify(contentIds ? contentIds : []),
    })
    await this.dbWriter(MessageEntity.table).insert(data)
    if (!pending) {
      await this.updateStatus(userId, channelId)
    }
    return data.id
  }

  async sendPendingMessage(
    userId: string,
    messageId: string,
    channelId: string,
    tipAmount: number,
  ) {
    const updated = await this.dbWriter(MessageEntity.table)
      .where(
        MessageEntity.toDict<MessageEntity>({
          id: messageId,
          pending: true,
        }),
      )
      .update(
        MessageEntity.toDict<MessageEntity>({
          sentAt: new Date(),
          pending: false,
        }),
      )
    if (updated) {
      await this.updateStatus(userId, channelId)
      await this.updateChannelTipStats(userId, channelId, tipAmount)
    }
  }

  async updateStatus(userId: string, channelId: string) {
    await this.dbWriter(ChannelMemberEntity.table)
      .where(
        ChannelMemberEntity.toDict<ChannelMemberEntity>({
          channel: channelId,
        }),
      )
      .andWhereNot(
        ChannelMemberEntity.toDict<ChannelMemberEntity>({
          user: userId,
        }),
      )
      .update('unread', true)
    await this.dbWriter(ChannelEntity.table)
      .where('id', channelId)
      .update('recent', new Date())
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    return (
      (await this.dbWriter(MessageEntity.table)
        .where('id', messageId)
        .delete()) === 1
    )
  }

  async updateChannelTipStats(
    userId: string,
    channelId: string,
    amount: number,
  ) {
    await this.dbWriter(ChannelMemberEntity.table)
      .where(
        ChannelMemberEntity.toDict<ChannelMemberEntity>({
          user: userId,
          channel: channelId,
        }),
      )
      .increment('tip_sent', amount)
    await this.dbWriter(ChannelMemberEntity.table)
      .where(
        ChannelMemberEntity.toDict<ChannelMemberEntity>({
          channel: channelId,
        }),
      )
      .andWhereNot(
        ChannelMemberEntity.toDict<ChannelMemberEntity>({
          user: userId,
        }),
      )
      .increment('tip_received', amount)
    if (amount > 0) {
      await this.dbWriter(ChannelMemberEntity.table)
        .where(
          ChannelMemberEntity.toDict<ChannelMemberEntity>({
            channel: channelId,
          }),
        )
        .andWhereNot(
          ChannelMemberEntity.toDict<ChannelMemberEntity>({
            user: userId,
          }),
        )
        .decrement('unread_tip', amount)
    }
    // TODO: add channel subscribe
  }

  async revertMessage(messageId: string): Promise<void> {
    const tippedMessage = await this.dbReader(MessageEntity.table)
      .where('id', messageId)
      .select('*')
      .first()
    await this.updateChannelTipStats(
      tippedMessage.sender_id,
      tippedMessage.channel_id,
      tippedMessage.tip_amount,
    )
    await this.dbWriter(MessageEntity.table)
      .where('id', messageId)
      .update(MessageEntity.toDict<MessageEntity>({ reverted: true }))
  }

  async updateChannelSettings(
    userId: string,
    updateChannelSettingsDto: UpdateChannelSettingsRequestDto,
  ) {
    const data = ChannelMemberEntity.toDict<ChannelMemberEntity>(
      updateChannelSettingsDto,
    )
    if (Object.keys(data).length === 0) {
      return
    }
    await this.dbWriter(ChannelMemberEntity.table)
      .update(data)
      .where(
        ChannelMemberEntity.toDict<ChannelMemberEntity>({
          user: userId,
          channel: updateChannelSettingsDto.channelId,
        }),
      )
  }

  async checkBlocked(userId: string, otherUserId: string): Promise<boolean> {
    const blockedResult = await this.dbReader(FollowBlockEntity.table)
      .where(
        FollowBlockEntity.toDict<FollowBlockEntity>({
          follower: userId,
          creator: otherUserId,
        }),
      )
      .orWhere(
        FollowBlockEntity.toDict<FollowBlockEntity>({
          follower: otherUserId,
          creator: userId,
        }),
      )
      .select(`${FollowBlockEntity.table}.id`)
      .first()
    return !!blockedResult
  }

  async read(userId: string, channelId: string) {
    await this.dbWriter(ChannelMemberEntity.table)
      .where(
        ChannelMemberEntity.toDict<ChannelMemberEntity>({
          channel: channelId,
          user: userId,
        }),
      )
      .update(
        ChannelMemberEntity.toDict<ChannelMemberEntity>({
          unread: false,
          unreadTip: 0,
        }),
      )
  }

  async purchaseMessage(
    userId: string,
    messageId: string,
    paidMessageId: string,
    earnings: number,
  ) {
    await this.dbWriter.transaction(async (trx) => {
      await trx(MessageEntity.table).update('paid', true).where('id', messageId)
      await trx(PaidMessageEntity.table)
        .where('id', paidMessageId)
        .increment('num_purchases', 1)
      await trx(PaidMessageEntity.table)
        .where('id', paidMessageId)
        .increment('earnings_purchases', earnings)

      const contentIds = JSON.parse(
        (
          await trx(MessageEntity.table)
            .where('id', messageId)
            .select('content_ids')
            .first()
        ).content_ids,
      )

      await Promise.all(
        contentIds.map(async (contentId) => {
          await trx(UserMessageContentEntity.table).insert(
            UserMessageContentEntity.toDict<UserMessageContentEntity>({
              user: userId,
              content: contentId as string,
            })
              .onConflict()
              .ignore(),
          )
        }),
      )
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
      throw new InvalidPayinRequestError('invalid post purchase')
    }
    const message = await this.dbReader(MessageEntity.table)
      .where('id', messageId)
      .select(['sender_id', 'paid_message_id'])
      .first()

    const callbackInput: PurchaseMessageCallbackInput = {
      messageId,
      paidMessageId: message.paid_message_id,
    }
    if (payinMethod === undefined) {
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
  ): Promise<PayinDataDto> {
    const target = CryptoJS.SHA256(`message-${userId}-${messageId}`).toString(
      CryptoJS.enc.Hex,
    )

    const message = await this.dbReader(MessageEntity.table)
      .where('id', messageId)
      .select(['paid', 'price'])
      .first()

    const checkPayin = await this.dbReader(PayinEntity.table)
      .whereIn('payin_status', [
        PayinStatusEnum.CREATED,
        PayinStatusEnum.PENDING,
      ])
      .where('target', target)
      .select('id')
      .first()

    let blocked: BlockedReasonEnum | undefined = undefined
    if (await this.payService.checkPayinBlocked(userId)) {
      blocked = BlockedReasonEnum.PAYMENTS_DEACTIVATED
    } else if (message.price === undefined || message.price === 0) {
      blocked = BlockedReasonEnum.NO_PRICE
    } else if (checkPayin !== undefined) {
      blocked = BlockedReasonEnum.PURCHASE_IN_PROGRESS
    } else if (message.paid) {
      blocked = BlockedReasonEnum.ALREADY_HAS_ACCESS
    }

    return { amount: message.price, target, blocked }
  }

  async getMessages(
    userId: string,
    getMessagesRequestDto: GetMessagesRequestDto,
  ) {
    const { sentAt, lastId, dateLimit, channelId, contentOnly, pending } =
      getMessagesRequestDto
    const channel = await this.dbReader(ChannelMemberEntity.table)
      .where(
        ChannelMemberEntity.toDict<ChannelMemberEntity>({
          channel: channelId,
          user: userId,
        }),
      )
      .select('id')
      .first()
    if (!channel) {
      throw new ChannelMissingError(
        `cant find channel ${channelId} for user ${userId}`,
      )
    }

    let query = this.dbReader(MessageEntity.table)
      .where(`${MessageEntity.table}.channel_id`, channelId)
      .select(`${MessageEntity.table}.*`)
      .orderBy([
        { column: `${MessageEntity.table}.sent_at`, order: 'desc' },
        { column: `${MessageEntity.table}.id`, order: 'desc' },
      ])

    if (contentOnly) {
      query = query
        .whereNotNull('paid_message_id')
        .andWhereNot('sender_id', userId)
    } else if (pending) {
      query = query.andWhere('pending', true).andWhere('sender_id', userId)
    }

    if (sentAt) {
      query = query.andWhere(`${MessageEntity.table}.sent_at`, '<=', sentAt)
    }

    if (dateLimit) {
      query = query.andWhere(`${MessageEntity.table}.sent_at`, '>=', dateLimit)
    }

    const messages = await query
    const index = messages.findIndex((message) => message.id === lastId)
    const filteredMessages = messages.slice(index + 1)
    const contents = await this.getContentLookupForMessages(
      filteredMessages.map((message) => message.sender_id),
      filteredMessages.map((message) => JSON.parse(message.contentIds)),
      filteredMessages.map(
        (message) => message.paid || message.sender_id == userId,
      ),
    )
    return filteredMessages.map((message, ind) => {
      return new MessageDto(message, contents[ind])
    })
  }

  async getMessage(userId: string, messageId: string) {
    const message = await this.dbReader(MessageEntity.table)
      .innerJoin(
        ChannelMemberEntity.table,
        `${ChannelMemberEntity.table}.channel_id`,
        `${MessageEntity.table}.channel_id`,
      )
      .where(`${MessageEntity.table}.id`, messageId)
      .andWhere(`${ChannelMemberEntity.table}.user_id`, userId)
      .select(`${MessageEntity.table}.*`)
      .first()
    return new MessageDto(
      message,
      await this.getContentLookupForMessages(
        [message.sender_id],
        [JSON.parse(message.contentIds)],
        [message.paid || message.sender_id == userId],
      )[0],
    )
  }

  private async getContentLookupForMessages(
    senderIds: string[],
    contentIds: string[][],
    paid: boolean[],
  ): Promise<ContentDto[][]> {
    const contents = await this.dbReader(ContentEntity.table)
      .whereIn(
        'id',
        contentIds.reduce((acc, ids) => acc.concat(ids), []),
      )
      .select([`${ContentEntity.table}.*`])
    const contentMap = {}
    contents.forEach((content) => (contentMap[content.id] = content))

    return await Promise.all(
      contentIds.map(async (contentIdsInner, ind) => {
        return await Promise.all(
          contentIdsInner.map(async (contentId) => {
            return new ContentDto(
              contentMap[contentId],
              paid[ind]
                ? await this.s3ContentService.signUrl(
                    `${this.cloudfrontUrl}/media/${contentMap[contentId].user_id}/${contentMap[contentId].id}`,
                  )
                : undefined,
            )
          }),
        )
      }),
    )
  }

  async createMessageHistory() {
    await this.dbWriter
      .from(
        this.dbWriter.raw('?? (??, ??, ??)', [
          PaidMessageHistoryEntity.table,
          'paid_message_id',
          'num_purchases',
          'earnings_purchases',
        ]),
      )
      .insert(
        this.dbWriter(PaidMessageEntity.table).select([
          'id as paid_message_id',
          'num_purchases',
          'earnings_purchases',
        ]),
      )
  }
}
