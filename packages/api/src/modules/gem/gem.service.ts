import { EntityRepository } from '@mikro-orm/core'
import { EntityManager, Knex } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { floor } from 'lodash'
import { v4 } from 'uuid'

import { PaymentEntity } from '../payment/entities/payment.entity'
import { RedisLockService } from '../redisLock/redisLock.service'
import { UserEntity } from '../user/entities/user.entity'
import { GemBalanceEntity } from './entities/gem.balance.entity'
import { GemPackageEntity } from './entities/gem.package.entity'
import { GemTransactionEntity } from './entities/gem.transaction.entity'
import { RepeatTransferError } from './error/gem.error'

export class GemTransaction {
  user: UserEntity

  amount: number

  // human-readable source of transaction (i.e. circle payment with id, chat payment)
  source?: string

  constructor(user: UserEntity, amount: number, source?: string) {
    this.user = user
    this.amount = amount
    this.source = source
  }
}
@Injectable()
export class GemService {
  constructor(
    private readonly em: EntityManager,
    protected readonly lockService: RedisLockService,
    @InjectRepository(GemTransactionEntity)
    private readonly gemTransactionRepository: EntityRepository<GemTransactionEntity>,
    @InjectRepository(GemBalanceEntity)
    private readonly gemBalanceRepository: EntityRepository<GemBalanceEntity>,
    @InjectRepository(GemPackageEntity)
    private readonly gemPackageRepository: EntityRepository<GemPackageEntity>,
  ) {}

  /**
   * execute several gem transactions atomically
   * ensure that no balances go below 0
   *
   * @param gemTransactions array of GemTransactions to be committed to db
   * @param callbackFn callback returns true if successful. if callbackFn returns false, the Knex.Transaction including gemTransactions gets reverted
   * @returns
   */
  async executeGemTransactions(
    gemTransactions: GemTransaction[],
    callbackFn?: (
      trx: Knex.Transaction,
      gemTransactions: GemTransaction[],
    ) => boolean,
  ): Promise<void> {
    const userids: string[] = []
    for (const gemTx of gemTransactions) {
      // create balances for users if they do not exist (default 0)
      await this.getBalance(gemTx.user)
      if (!(gemTx.user.id in userids)) userids.push(gemTx.user.id)
    }

    const knex = this.em.getKnex()
    await knex.transaction(async (trx) => {
      const balancesList = await knex('gem_balance')
        .transacting(trx)
        .forUpdate()
        .whereIn('user_id', userids)
        .select('id', 'user_id', 'amount') //lock rows to update
      const balances = {}
      balancesList.forEach((balance) => {
        balances[balance['user_id']] = balance
      })

      for (const i in gemTransactions) {
        await knex('gem_transaction').transacting(trx).insert({
          id: v4(),
          amount: gemTransactions[i].amount,
          user_id: gemTransactions[i].user.id,
          source: gemTransactions[i].amount,
          created_at: new Date(),
          updated_at: new Date(),
        })
        balances[gemTransactions[i].user.id].amount += gemTransactions[i].amount
      }

      for (const userid in balances) {
        if (balances[userid]['amount'] < 0) {
          throw Error('not enough gems')
        }
        await knex('gem_balance')
          .transacting(trx)
          .where('user_id', userid)
          .update('amount', balances[userid]['amount'])
      }

      if (callbackFn != undefined && !callbackFn(trx, gemTransactions)) {
        throw new Error('gem transactions reverted due to callbackFn failure')
      }
    })
  }

  /**
   * atomically transfer gems to user (or away) while updating balance
   * @param user
   * @param amount
   * @param source
   * @returns new transaction
   */
  async transactGem(
    user: UserEntity,
    amount: number,
    source?: string,
  ): Promise<void> {
    return this.executeGemTransactions([
      new GemTransaction(user, amount, source),
    ])
  }

  /**
   * get gem balance of a user
   * @param user
   * @returns
   */
  async getBalance(user: UserEntity): Promise<GemBalanceEntity> {
    try {
      return await this.gemBalanceRepository.findOneOrFail({ user: user })
    } catch {
      const newBalance = new GemBalanceEntity()
      newBalance.user = user
      newBalance.amount = 0
      this.gemBalanceRepository.persistAndFlush(newBalance)
      return newBalance
    }
  }

  /**
   * get gem package deals available to public users
   * @returns
   */
  async getPublicPackages(): Promise<Array<GemPackageEntity>> {
    return await this.gemPackageRepository.find({ isPublic: true })
  }

  /**
   * get specific package inforamtion
   */
  async getPackage(packageid: string): Promise<GemPackageEntity> {
    return await this.gemPackageRepository.findOneOrFail({ id: packageid })
  }

  /**
   * get the correct gem package for a given cost
   * order by BONUS gems
   *
   * TODO: update to take in user for exclusive packages
   * @param cost
   */
  async getPackageFromCost(cost: number): Promise<GemPackageEntity> {
    return await this.gemPackageRepository.findOneOrFail(
      { cost: cost, isActive: true },
      { orderBy: { bonusGems: 'desc' } },
    )
  }

  /**
   * SOURCE GENERATION FUNCTIONS
   * the "source" of a gem transaction can be set to anything
   * for the sake of consistency and simplicity, design a format for a type of source
   * e.g. payment, chat message, NFT purchase
   *
   * make sure they are unique, as they are identifiers for how to group transactions
   * give these some thought, changing them later makes legacy data corrupt
   */
  paymentSource(payment: PaymentEntity): string {
    return `circle-${payment.circlePaymentId}-payment-${payment.id}`
  }

  /**
   * ADDITIONAL GET AND SET FUNCTIONS FOR TYPES OF SOURCES
   * provide extra functionality to your use case of gems
   */
  async getPaymentTransaction(
    payment: PaymentEntity,
  ): Promise<Array<GemTransactionEntity>> {
    return this.gemTransactionRepository.find({
      source: this.paymentSource(payment),
    })
  }

  async makePaymentTransaction(
    payment: PaymentEntity,
  ): Promise<Array<GemTransactionEntity>> {
    if ((await this.getPaymentTransaction(payment)).length > 0) {
      throw new RepeatTransferError('payment ' + payment.id)
    }
    //convert human readible decimal amount into number of cents
    const amount = floor(parseFloat(payment.amount) * 100)
    const gemPackage = await this.getPackageFromCost(amount)
    const gemAmount = gemPackage.baseGems + gemPackage.bonusGems

    this.executeGemTransactions([
      new GemTransaction(
        await payment.getUser(),
        gemAmount,
        this.paymentSource(payment),
      ),
    ])
    return this.getPaymentTransaction(payment)
  }
}
