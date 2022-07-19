import { EntityManager } from '@mikro-orm/core'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { GemBalanceEntity } from '../gem/entities/gem.balance.entity'
import { GemTransactionEntity } from '../gem/entities/gem.transaction.entity'
import { GemService } from '../gem/gem.service'
import { RedisLockService } from '../redisLock/redisLock.service'
import { GemPackageEntity } from './entities/gem.package.entity'
import { GemController } from './gem.controller'

describe('GemController', () => {
  let controller: GemController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GemController],
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
        {
          provide: getRepositoryToken(GemPackageEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<GemController>(GemController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
