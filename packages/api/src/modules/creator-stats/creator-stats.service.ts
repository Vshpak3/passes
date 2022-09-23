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

  async getAvailableBalance(userId: string) {
    return new CreatorEarningDto(
      await this.dbReader(CreatorEarningEntity.table)
        .where(
          CreatorEarningEntity.toDict<CreatorEarningEntity>({
            user: userId,
            type: EarningTypeEnum.AVAILABLE_BALANCE,
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
    await this.dbWriter.transaction(async (trx) => {
      await trx(CreatorEarningEntity.table)
        .insert(
          CreatorEarningEntity.toDict<CreatorEarningEntity>({
            amount,
            user: userId,
            type: earningType,
          }),
        )
        .onConflict()
        .ignore()
      await trx(CreatorEarningEntity.table)
        .where(
          CreatorEarningEntity.toDict<CreatorEarningEntity>({
            amount,
            user: userId,
            type: earningType,
          }),
        )
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
      await this.dbReader(CreatorStatEntity.table)
        .leftJoin(
          CreatorSettingsEntity.table,
          `${CreatorSettingsEntity.table}.user_id`,
          `${CreatorStatEntity.table}.user_id`,
        )
        .where(CreatorStatEntity.toDict<CreatorStatEntity>({ user: creatorId }))
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
      await trx(ContentEntity.table).update(
        ContentEntity.toDict<ContentEntity>({
          inMessage: false,
          inPost: false,
        }),
      )
      await trx(ContentEntity.table)
        .innerJoin(
          PostContentEntity.table,
          `${PostContentEntity.table}.content_id`,
          `${ContentEntity.table}.id`,
        )
        .whereNull(`${PostEntity.table}.deleted_at`)
        .andWhere(`${PostEntity.table}.is_message`, false)
        .update(`${ContentEntity.table}.in_post`, true)
      await trx(ContentEntity.table)
        .innerJoin(
          PostContentEntity.table,
          `${PostContentEntity.table}.content_id`,
          `${ContentEntity.table}.id`,
        )
        .whereNull(`${PostEntity.table}.deleted_at`)
        .andWhere(`${PostEntity.table}.is_message`, true)
        .update(`${ContentEntity.table}.in_message`, true)
    })

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
    await this.dbWriter(CreatorStatEntity.table)
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
