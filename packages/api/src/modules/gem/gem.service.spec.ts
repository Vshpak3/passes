import { EntityManager } from '@mikro-orm/core'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { RedisLockService } from '../redisLock/redisLock.service'
import { GemBalanceEntity } from './entities/gem.balance.entity'
import { GemTransactionEntity } from './entities/gem.transaction.entity'
import { GemService } from './gem.service'

describe('GemService', () => {
  let service: GemService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GemService,
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: RedisLockService,
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
