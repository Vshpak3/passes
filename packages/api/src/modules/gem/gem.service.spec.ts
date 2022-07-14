import { EntityManager } from '@mikro-orm/core'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'
import { RedisModule } from '@nestjs-modules/ioredis'

import { redisOptions } from '../../database/redis.options'
import { repositoryMockFactory } from '../../database/test-helpers'
import { RedisLockModule } from '../redisLock/redisLock.module'
import { GemBalanceEntity } from './entities/gem.balance.entity'
import { GemTransactionEntity } from './entities/gem.transaction.entity'
import { GemService } from './gem.service'

describe('GemService', () => {
  let service: GemService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisLockModule, RedisModule.forRootAsync(redisOptions)],
      providers: [
        GemService,
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: getRepositoryToken(GemTransactionEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(GemBalanceEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<GemService>(GemService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
