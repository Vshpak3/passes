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
import { CreatorEarningDto } from './dto/creator-earning.dto'
import { CreatorStatDto } from './dto/creator-stat.dto'
import { CreatorEarningEntity } from './entities/creator-earning.entity'
import { CreatorEarningHistoryEntity } from './entities/creator-earning-history.entity'
import { CreatorStatEntity } from './entities/creator-stat.entity'
import { EarningCategoryEnum } from './enum/earning.category.enum'
import { EarningTypeEnum } from './enum/earning.type.enum'

const NEGATE = -1
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
          category: EarningCategoryEnum.NET,
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
          category: EarningCategoryEnum.NET,
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
    amounts: Record<EarningCategoryEnum, number>,
    multipler = 1,
  ) {
    await this.dbWriter.transaction(async (trx) => {
      await Promise.all(
        Object.keys(amounts).map(async (category: EarningCategoryEnum) => {
          await trx<CreatorEarningEntity>(CreatorEarningEntity.table)
            .insert({
              category: category,
              amount: amounts[category] * multipler,
              user_id: userId,
              type: earningType,
            })
            .onConflict()
            .merge({
              amount: trx.raw('amount + ?', [amounts[category] * multipler]),
            })
        }),
      )
    })
  }

  async handlePayinSuccess(
    userId: string,
    payinCallbackEnum: PayinCallbackEnum,
    amounts: Record<EarningCategoryEnum, number>,
  ) {
    await this.updateEarning(userId, EarningTypeEnum.BALANCE, amounts)
    await this.updateEarning(userId, EarningTypeEnum.AVAILABLE_BALANCE, amounts)
    await this.updateEarning(userId, EarningTypeEnum.TOTAL, amounts)
    await this.updateEarning(
      userId,
      this.payinToEarnings(payinCallbackEnum),
      amounts,
    )
  }

  async handleChargebackSuccess(
    userId: string,
    amounts: Record<EarningCategoryEnum, number>,
  ) {
    await this.updateEarning(
      userId,
      EarningTypeEnum.AVAILABLE_BALANCE,
      amounts,
      NEGATE,
    )
    await this.updateEarning(userId, EarningTypeEnum.BALANCE, amounts, NEGATE)
    await this.updateEarning(
      userId,
      EarningTypeEnum.CHARGEBACKS,
      amounts,
      NEGATE,
    )
  }

  async handlePayout(
    userId: string,
    amounts: Record<EarningCategoryEnum, number>,
  ) {
    await this.updateEarning(
      userId,
      EarningTypeEnum.AVAILABLE_BALANCE,
      amounts,
      NEGATE,
    )
  }

  async handlePayoutSuccess(
    userId: string,
    amounts: Record<EarningCategoryEnum, number>,
  ) {
    await this.updateEarning(userId, EarningTypeEnum.BALANCE, amounts, NEGATE)
  }

  async handlePayoutFail(
    userId: string,
    amounts: Record<EarningCategoryEnum, number>,
  ) {
    await this.updateEarning(userId, EarningTypeEnum.AVAILABLE_BALANCE, amounts)
  }

  async createEarningHistory() {
    await this.dbWriter
      .from(
        this.dbWriter.raw('?? (??, ??, ??, ??)', [
          CreatorEarningHistoryEntity.table,
          'user_id',
          'amount',
          'type',
          'category',
        ]),
      )
      .insert(
        this.dbWriter<CreatorEarningEntity>(CreatorEarningEntity.table).select([
          'user_id',
          'amount',
          'type',
          'category',
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
        .where(`${CreatorStatEntity.table}.user_id`, creatorId)
        .select([
          `${CreatorStatEntity.table}.*`,
          'show_follower_count',
          'show_media_count',
          'show_like_count',
          'show_post_count',
        ])
        .first(),
      userId === creatorId,
    )
  }

  async refreshCreatorsStats() {
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
