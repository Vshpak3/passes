import { EntityRepository } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'

import { RedisLockService } from '../redisLock/redisLock.service'
import { UserEntity } from '../user/entities/user.entity'
import { GemBalanceEntity } from './entities/gem.balance.entity'
import { GemTransactionEntity } from './entities/gem.transaction.entity'
@Injectable()
export class GemService {
  constructor(
    private readonly em: EntityManager,
    protected readonly lockService: RedisLockService,
    @InjectRepository(GemTransactionEntity)
    private readonly gemTransactionRepository: EntityRepository<GemTransactionEntity>,
    @InjectRepository(GemBalanceEntity)
    private readonly gemBalanceRepository: EntityRepository<GemBalanceEntity>,
  ) {}

  /**
   * execute several gem transactions atomically
   * ensure that no balances go below 0
   *
   * @param users
   * @param amounts
   * @param sources humans-readible source of transaction (i.e. circle payment with id, chat payment)
   * @returns
   */
  async executeGemTransactions(
    users: UserEntity[],
    amounts: number[],
    sources: (string | undefined)[],
  ): Promise<void> {
    if (users.length !== amounts.length || users.length !== sources.length) {
      throw Error('improper input')
    }
    const userids: string[] = []
    for (const user of users) {
      // create balances for users if they do not exist (default 0)
      await this.getBalance(user)
      if (!(user.id in userids)) userids.push(user.id)
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

      for (const i in users) {
        await knex('gem_transaction').transacting(trx).insert({
          id: v4(),
          amount: amounts[i],
          user_id: userids[i],
          source: sources[i],
          created_at: new Date(),
          updated_at: new Date(),
        })
        balances[userids[i]].amount += amounts[i]
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
    })
  }

  /**
   * atomically transfer gems to uesr (or away) while updating balance
   * @param user
   * @param amount
   * @param source
   * @returns new transaction
   */
  async transactGem(
    user: UserEntity,
    amount: number,
    source?: string,
  ): Promise<GemTransactionEntity> {
    return this.executeGemTransactions([user], [amount], [source])[0]
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
}
