import { EntityManager, EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'

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
   * revert a single transaction
   * @param transfer
   */
  async revertTransaction(transfer: GemTransactionEntity): Promise<void> {
    if (!transfer.reverted) {
      transfer.reverted = true
      const balance = await this.getBalance(transfer.user)
      balance.amount -= transfer.amount
      this.gemTransactionRepository.persistAndFlush(transfer)
      this.gemBalanceRepository.persistAndFlush(balance)
    }
  }

  /**
   * execute several gem transactions atomically
   * ensure that no balances go below 0
   * @param users
   * @param amounts
   * @param sources
   * @returns
   */
  async executeGemTransactions(
    users: UserEntity[],
    amounts: number[],
    sources: (string | undefined)[],
  ): Promise<Array<GemTransactionEntity>> {
    const transactions: GemTransactionEntity[] = []
    await this.em.transactional(async (em) => {
      for (const i in users) {
        const user = users[i]
        const amount = amounts[i]
        const source = sources[i]
        try {
          this.lockService.lock(user.id)
          const balance = await this.getBalance(user)
          if (balance.amount + amount < 0) {
            throw Error('not enough gems')
          }
          const transaction = new GemTransactionEntity()
          transaction.amount = amount
          transaction.user = user
          transaction.source = source
          balance.amount += amount
          em.persist(transaction)
          transactions.push(transaction)
        } finally {
          this.lockService.unlock(user.id)
        }
      }
    })
    return transactions
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
      return this.gemBalanceRepository.findOneOrFail({ user: user })
    } catch {
      const newBalance = new GemBalanceEntity()
      newBalance.user = user
      newBalance.amount = 0
      this.gemBalanceRepository.persistAndFlush(newBalance)
      return newBalance
    }
  }
}
