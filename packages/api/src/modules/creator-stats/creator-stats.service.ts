import { Knex } from '@mikro-orm/mysql'
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { rejectIfAny } from '../../util/promise.util'
import { ContentEntity } from '../content/entities/content.entity'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { FollowEntity } from '../follow/entities/follow.entity'
import { CircleChargebackEntity } from '../payment/entities/circle-chargeback.entity'
import { CreatorShareEntity } from '../payment/entities/creator-share.entity'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { PostEntity } from '../post/entities/post.entity'
import { CreatorEarningDto } from './dto/creator-earning.dto'
import { CreatorStatDto } from './dto/creator-stat.dto'
import { CreatorEarningEntity } from './entities/creator-earning.entity'
import { CreatorEarningHistoryEntity } from './entities/creator-earning-history.entity'
import { CreatorStatEntity } from './entities/creator-stat.entity'
import { UserSpendingEntity } from './entities/user-spending.entity'
import { EarningCategoryEnum } from './enum/earning.category.enum'
import { EarningTypeEnum } from './enum/earning.type.enum'

const NUM_CATEGORIES = Object.keys(EarningCategoryEnum).length
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

  stepToCategory = (step: number) => {
    switch (step) {
      case 0:
        return EarningCategoryEnum.NET
      case 1:
        return EarningCategoryEnum.AGENCY
      case 2:
        return EarningCategoryEnum.GROSS
    }
  }

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    @InjectSentry() private readonly sentry: SentryService,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async getAvailableBalances(
    userId: string,
  ): Promise<Record<EarningCategoryEnum, CreatorEarningDto>> {
    const earnings = await this.dbReader<CreatorEarningEntity>(
      CreatorEarningEntity.table,
    )
      .where({
        user_id: userId,
        type: EarningTypeEnum.AVAILABLE_BALANCE,
      })
      .select('*')
    const ret = {} as Record<EarningCategoryEnum, CreatorEarningDto>
    earnings.forEach(
      (earning) => (ret[earning.category] = new CreatorEarningDto(earning)),
    )
    return ret
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
      .where({ user_id: userId, category: EarningCategoryEnum.GROSS })
      .andWhere('created_at', '>=', start)
      .andWhere('created_at', '<=', end)
      .orderBy('created_at', 'asc')
      .select('*')
    if (type) {
      query = query.andWhere({ type: type })
    }
    return (await query).map((earning) => new CreatorEarningDto(earning))
  }

  async updateEarning(
    trx: Knex.Transaction,
    userId: string,
    earningTypes: EarningTypeEnum[],
    earningCategory: EarningCategoryEnum,
    amount: number,
  ) {
    await trx<CreatorEarningEntity>(CreatorEarningEntity.table)
      .insert(
        earningTypes.map((earningType) => {
          return {
            category: earningCategory,
            amount: amount,
            user_id: userId,
            type: earningType,
          }
        }),
      )
      .onConflict()
      .merge({
        amount: trx.raw('amount + ?', [amount]),
      })
  }

  async getCreatorShareStatus(creatorShareId: string) {
    const processed = await this.dbWriter<CreatorShareEntity>(
      CreatorShareEntity.table,
    )
      .where({ id: creatorShareId })
      .select('processed')
      .first()
    return processed?.processed ?? 0
  }

  async getChargebackStatus(chargebackId: string) {
    const processed = await this.dbWriter<CircleChargebackEntity>(
      CircleChargebackEntity.table,
    )
      .where({ id: chargebackId })
      .select('processed')
      .first()
    return processed?.processed ?? 0
  }

  async handlePayinSuccess(
    userId: string,
    creatorShareId: string,
    creatorId: string,
    payinCallbackEnum: PayinCallbackEnum,
    amounts: Record<EarningCategoryEnum, number>,
  ) {
    const types = [
      EarningTypeEnum.AVAILABLE_BALANCE,
      this.payinToEarnings(payinCallbackEnum),
      EarningTypeEnum.TOTAL,
    ]
    for (let step = 0; step < NUM_CATEGORIES; ++step) {
      const category = this.stepToCategory(step)
      if (!category) {
        continue
      }
      if (amounts[category] < 0) {
        throw new InternalServerErrorException(
          `can't earn negative amount ${amounts[category]}: creatorShare - ${creatorShareId}`,
        )
      }
      const status = await this.getCreatorShareStatus(creatorShareId)
      if (status === step) {
        await this.dbWriter.transaction(async (trx) => {
          await this.updateEarning(
            trx,
            creatorId,
            types,
            category,
            amounts[category],
          )
          await trx<CreatorShareEntity>(CreatorShareEntity.table)
            .where({ id: creatorShareId })
            .update({ processed: step })
        })
      }
    }

    const status = await this.getCreatorShareStatus(creatorShareId)

    if (status === NUM_CATEGORIES) {
      await this.dbWriter.transaction(async (trx) => {
        await trx<UserSpendingEntity>(UserSpendingEntity.table)
          .insert({
            amount: amounts[EarningCategoryEnum.GROSS],
            user_id: userId,
            creator_id: creatorId,
          })
          .onConflict()
          .merge({
            amount: this.dbWriter.raw('amount + ?', [
              amounts[EarningCategoryEnum.GROSS],
            ]),
          })
        await trx<CreatorShareEntity>(CreatorShareEntity.table)
          .where({ id: creatorShareId })
          .update({ processed: NUM_CATEGORIES + 1 })
      })
    }
  }

  async handleChargebackSuccess(
    chargebackId: string,
    userId: string,
    creatorId: string,
    amounts: Record<EarningCategoryEnum, number>,
  ) {
    const types = [
      EarningTypeEnum.AVAILABLE_BALANCE,
      EarningTypeEnum.CHARGEBACKS,
    ]
    for (let step = 0; step < NUM_CATEGORIES; ++step) {
      const category = this.stepToCategory(step)
      if (!category) {
        continue
      }
      if (amounts[category] > 0) {
        throw new InternalServerErrorException(
          `can't chargeback positive amount ${amounts[category]}: chargebackId - ${chargebackId}`,
        )
      }
      const status = await this.getChargebackStatus(chargebackId)
      if (status === step) {
        await this.dbWriter.transaction(async (trx) => {
          await this.updateEarning(
            trx,
            creatorId,
            types,
            category,
            amounts[category],
          )
          await trx<CircleChargebackEntity>(CircleChargebackEntity.table)
            .where({ id: chargebackId })
            .update({ processed: step })
        })
      }
    }
    const status = await this.getChargebackStatus(chargebackId)

    if (status === NUM_CATEGORIES) {
      await this.dbWriter.transaction(async (trx) => {
        await trx<UserSpendingEntity>(UserSpendingEntity.table)
          .where({
            user_id: userId,
            creator_id: creatorId,
          })
          .decrement('amount', amounts[EarningCategoryEnum.GROSS])
        await trx<CircleChargebackEntity>(CircleChargebackEntity.table)
          .where({ id: chargebackId })
          .update({ processed: NUM_CATEGORIES + 1 })
      })
    }
  }

  async handlePayout(
    creatorId: string,
    amounts: Record<EarningCategoryEnum, number>,
  ) {
    await this.dbWriter.transaction(async (trx) => {
      for (let step = 0; step < NUM_CATEGORIES; ++step) {
        const category = this.stepToCategory(step)
        if (!category) {
          throw new InternalServerErrorException('no category')
        }
        if (amounts[category] > 0) {
          throw new InternalServerErrorException(
            `can't payout positive amount ${amounts[category]}`,
          )
        }
        await this.updateEarning(
          trx,
          creatorId,
          [EarningTypeEnum.AVAILABLE_BALANCE],
          category,
          amounts[category],
        )
      }
    })
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
    rejectIfAny(
      await Promise.allSettled(
        creators.map(async (creator) => {
          try {
            await this.refreshCreatorStats(creator.user_id)
          } catch (err) {
            this.logger.error(
              `Error updating stats for creator ${creator.user_id}`,
              err,
            )
            this.sentry.instance().captureException(err)
          }
        }),
      ),
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
            deleted_at: null,
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

  async getUserSpending(userId: string, creatorId: string) {
    const ret = await this.dbReader<UserSpendingEntity>(
      UserSpendingEntity.table,
    )
      .where({ user_id: userId, creator_id: creatorId })
      .select('*')
      .first()
    return { amount: ret?.amount ?? 0 }
  }
}
