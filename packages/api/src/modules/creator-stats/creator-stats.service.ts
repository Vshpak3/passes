import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { ContentEntity } from '../content/entities/content.entity'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { FollowEntity } from '../follow/entities/follow.entity'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { PostEntity } from '../post/entities/post.entity'
import { PostContentEntity } from '../post/entities/post-content.entity'
import { NEGATIVE_AMOUNT } from './constants/error'
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
      case PayinCallbackEnum.PURCHASE_POST:
        return EarningTypeEnum.POSTS
      case PayinCallbackEnum.PURCHASE_DM:
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

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async getBalance(userId: string) {
    return new CreatorEarningDto(
      await this.dbReader<CreatorEarningEntity>(CreatorEarningEntity.table)
        .where({
          user_id: userId,
          type: EarningTypeEnum.BALANCE,
        })
        .select('*')
        .first(),
    )
  }

  async getAvailableBalance(userId: string) {
    return new CreatorEarningDto(
      await this.dbReader<CreatorEarningEntity>(CreatorEarningEntity.table)
        .where({
          user_id: userId,
          type: EarningTypeEnum.AVAILABLE_BALANCE,
        })
        .select('*')
        .first(),
    )
  }

  async getEarningsHistory(
    userId: string,
    start: Date,
    end: Date,
    type?: EarningTypeEnum,
  ) {
    let query = this.dbReader<CreatorEarningHistoryEntity>(
      CreatorEarningHistoryEntity.table,
    )
      .where({ user_id: userId })
      .andWhere('created_at', '>=', start)
      .andWhere('created_at', '<=', end)
      .select('*')
    if (type) {
      query = query.andWhere({ type: type })
    }
    return (await query).map((earning) => new CreatorEarningDto(earning))
  }

  async updateEarning(
    userId: string,
    earningType: EarningTypeEnum,
    amount: number,
  ) {
    await this.dbWriter.transaction(async (trx) => {
      await trx<CreatorEarningEntity>(CreatorEarningEntity.table)
        .insert({
          amount,
          user_id: userId,
          type: earningType,
        })
        .onConflict()
        .ignore()
      await trx<CreatorEarningEntity>(CreatorEarningEntity.table)
        .where({
          amount,
          user_id: userId,
          type: earningType,
        })
        .increment('amount', amount)
    })
  }

  async handlePayinSuccess(
    userId: string,
    payinCallbackEnum: PayinCallbackEnum,
    amount: number,
  ) {
    await this.updateEarning(userId, EarningTypeEnum.BALANCE, amount)
    await this.updateEarning(userId, EarningTypeEnum.AVAILABLE_BALANCE, amount)
    await this.updateEarning(userId, EarningTypeEnum.TOTAL, amount)
    await this.updateEarning(
      userId,
      this.payinToEarnings(payinCallbackEnum),
      amount,
    )
  }

  async handleChargebackSuccess(userId: string, amount: number) {
    if (amount < 0) {
      throw new EarningsTypeError(NEGATIVE_AMOUNT)
    }
    await this.updateEarning(userId, EarningTypeEnum.AVAILABLE_BALANCE, -amount)
    await this.updateEarning(userId, EarningTypeEnum.BALANCE, -amount)
    await this.updateEarning(userId, EarningTypeEnum.CHARGEBACKS, amount)
  }

  async handlePayout(userId: string, amount: number) {
    if (amount < 0) {
      throw new EarningsTypeError(NEGATIVE_AMOUNT)
    }
    await this.updateEarning(userId, EarningTypeEnum.AVAILABLE_BALANCE, -amount)
  }

  async handlePayoutSuccess(userId: string, amount: number) {
    if (amount < 0) {
      throw new EarningsTypeError(NEGATIVE_AMOUNT)
    }
    await this.updateEarning(userId, EarningTypeEnum.BALANCE, -amount)
  }

  async handlePayoutFail(userId: string, amount: number) {
    if (amount < 0) {
      throw new EarningsTypeError(NEGATIVE_AMOUNT)
    }
    await this.updateEarning(userId, EarningTypeEnum.AVAILABLE_BALANCE, amount)
  }

  async createEarningHistory() {
    await this.dbWriter
      .from(
        this.dbWriter.raw('?? (??, ??, ??)', [
          CreatorEarningHistoryEntity.table,
          'user_id',
          'amount',
          'type',
        ]),
      )
      .insert(
        this.dbWriter<CreatorEarningEntity>(CreatorEarningEntity.table).select([
          'user_id',
          'amount',
          'type',
        ]),
      )
  }

  async getCreatorStats(creatorId: string, userId?: string) {
    return new CreatorStatDto(
      await this.dbReader<CreatorStatEntity>(CreatorStatEntity.table)
        .leftJoin(
          CreatorSettingsEntity.table,
          `${CreatorSettingsEntity.table}.user_id`,
          `${CreatorStatEntity.table}.user_id`,
        )
        .where({ user_id: creatorId })
        .select([
          `${CreatorStatEntity.table}.user_id`,
          'show_follower_count',
          'show_media_count',
        ])
        .first(),
      userId === creatorId,
    )
  }

  async refreshCreatorsStats() {
    await this.dbWriter.transaction(async (trx) => {
      await trx<ContentEntity>(ContentEntity.table).update({
        in_message: false,
        in_post: false,
      })
      await trx<ContentEntity>(ContentEntity.table)
        .innerJoin(
          PostContentEntity.table,
          `${PostContentEntity.table}.content_id`,
          `${ContentEntity.table}.id`,
        )
        .innerJoin(
          PostEntity.table,
          `${PostContentEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        )
        .whereNull(`${PostEntity.table}.deleted_at`)
        .update(`${ContentEntity.table}.in_post`, true)
    })

    const creators = await this.dbReader<CreatorStatEntity>(
      CreatorStatEntity.table,
    ).select('user_id')
    await Promise.all(
      creators.map(async (creator) => {
        try {
          await this.refreshCreatorStats(creator.user_id)
        } catch (err) {
          this.logger.error(
            `Error updating stats for creator ${creator.user_id}`,
            err,
          )
        }
      }),
    )
  }

  async refreshCreatorStats(creatorId: string) {
    // TODO-test: test after refactor
    await this.dbWriter<CreatorStatEntity>(CreatorStatEntity.table)
      .where({ user_id: creatorId })
      .update(
        'num_likes',
        this.dbWriter<PostEntity>(PostEntity.table)
          .where({
            user_id: creatorId,
          })
          .sum('num_likes'),
      )
      .update(
        'num_followers',
        this.dbWriter<FollowEntity>(FollowEntity.table)
          .where({
            creator_id: creatorId,
          })
          .count(),
      )
      .update(
        'num_media',
        this.dbWriter<ContentEntity>(ContentEntity.table)
          .where({
            user_id: creatorId,
            in_post: true,
          })
          .count(),
      )
  }
}
