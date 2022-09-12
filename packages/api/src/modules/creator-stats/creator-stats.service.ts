import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { ContentEntity } from '../content/entities/content.entity'
import { FollowEntity } from '../follow/entities/follow.entity'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { PostEntity } from '../post/entities/post.entity'
import { CreatorEarningDto } from './dto/creator-earning.dto'
import { CreatorStatDto } from './dto/creator-stat.dto'
import { CreatorEarningEntity } from './entities/creator-earning.entity'
import { CreatorEarningHistoryEntity } from './entities/creator-earning-history.entity'
import { CreatorStatEntity } from './entities/creator-stat.entity'
import { EarningTypeEnum } from './enum/earning.type.enum'
import { EarningsTypeError } from './error/earnings.error'

@Injectable()
export class CreatorStatsService {
  payinToEarnings = (payinCallbackEnum: PayinCallbackEnum) => {
    switch (payinCallbackEnum) {
      case PayinCallbackEnum.CREATE_NFT_SUBSCRIPTION_PASS:
      case PayinCallbackEnum.RENEW_NFT_PASS:
        return EarningTypeEnum.SUBSCRIPTION
      case PayinCallbackEnum.PURCHASE_FEED_POST:
        return EarningTypeEnum.POSTS
      case PayinCallbackEnum.PURCHASE_DM_POST:
        return EarningTypeEnum.MESSAGES
      case PayinCallbackEnum.TIP_POST:
      case PayinCallbackEnum.TIPPED_MESSAGE:
        return EarningTypeEnum.TIPS
      case PayinCallbackEnum.CREATE_NFT_LIFETIME_PASS:
        return EarningTypeEnum.LIFETIME
      case PayinCallbackEnum.EXAMPLE:
      default:
        return EarningTypeEnum.OTHER
    }
  }

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async getBalance(userId: string) {
    return new CreatorEarningDto(
      await this.dbReader(CreatorEarningEntity.table)
        .where(
          CreatorEarningEntity.toDict<CreatorEarningEntity>({
            user: userId,
            type: EarningTypeEnum.BALANCE,
          }),
        )
        .select('*')
        .first(),
    )
  }

  async getHistoricEarnings(
    userId: string,
    start: Date,
    end: Date,
    type?: EarningTypeEnum,
  ) {
    let query = this.dbReader(CreatorEarningHistoryEntity.table)
      .where('user_id', userId)
      .andWhere('created_at', '>=', start)
      .andWhere('created_at', '<=', end)
      .select('*')
    if (type) {
      query = query.andWhere('type', type)
    }
    return (await query).map((earning) => new CreatorEarningDto(earning))
  }

  async updateEarning(
    userId: string,
    earningType: EarningTypeEnum,
    amount: number,
  ) {
    if (amount < 0 && earningType !== EarningTypeEnum.BALANCE) {
      throw new EarningsTypeError('can not decrement non-balance type earning')
    }
    await this.dbWriter.transaction(async (trx) => {
      const earning = await trx(CreatorEarningEntity.table)
        .where(
          CreatorEarningEntity.toDict<CreatorEarningEntity>({
            user: userId,
            type: earningType,
          }),
        )
        .select('*')
        .first()
      if (!earning) {
        await trx(CreatorEarningEntity.table).insert(
          CreatorEarningEntity.toDict<CreatorEarningEntity>({
            amount,
            user: userId,
            type: earningType,
          }),
        )
      } else {
        await trx(CreatorEarningEntity.table)
          .increment('amount', amount)
          .where('id', earning.id)
      }
    })
  }

  async handlePayin(
    userId: string,
    payinCallbackEnum: PayinCallbackEnum,
    amount: number,
  ) {
    await this.updateEarning(userId, EarningTypeEnum.BALANCE, amount)
    await this.updateEarning(userId, EarningTypeEnum.TOTAL, amount)
    await this.updateEarning(
      userId,
      this.payinToEarnings(payinCallbackEnum),
      amount,
    )
  }

  async handlePayout(userId: string, amount: number) {
    await this.updateEarning(userId, EarningTypeEnum.BALANCE, -amount)
  }

  async createEarningHistory() {
    await this.dbWriter
      .from(
        this.dbWriter.raw('?? (?? ?? ??)', [
          CreatorEarningHistoryEntity.table,
          ...CreatorEarningHistoryEntity.populate<CreatorEarningHistoryEntity>([
            'user',
            'amount',
            'type',
          ]),
        ]),
      )
      .insert(this.dbWriter(CreatorEarningEntity.table).select('*'))
  }

  async getCreatorStats(creatorId: string, userId?: string) {
    return new CreatorStatDto(
      await this.dbReader
        .where(CreatorStatEntity.toDict<CreatorStatEntity>({ user: creatorId }))
        .select('*'),
      userId === creatorId,
    )
  }

  async refreshCreatorsStats() {
    const creators = await this.dbReader(CreatorStatEntity.table).select(
      'user_id',
    )
    await Promise.all(
      creators.map(async (creator) => {
        try {
          await this.refreshCreatorStats(creator.user_id)
        } catch (err) {
          this.logger.error(
            `Error updating stats for creator ${creator.id}`,
            err,
          )
        }
      }),
    )
  }

  async refreshCreatorStats(creatorId: string) {
    await this.dbWriter
      .table(CreatorStatEntity.table)
      .where('user_id', creatorId)
      .update({
        num_likes: this.dbWriter(PostEntity.table)
          .where(
            PostEntity.toDict<PostEntity>({
              user: creatorId,
            }),
          )
          .sum('num_likes'),
        num_followers: this.dbWriter(FollowEntity.table)
          .where(
            FollowEntity.toDict<FollowEntity>({
              creator: creatorId,
            }),
          )
          .count(),
        num_media: this.dbWriter(ContentEntity.table)
          .where(
            ContentEntity.toDict<ContentEntity>({
              user: creatorId,
              inPost: true,
            }),
          )
          .count(),
      })
  }
}
