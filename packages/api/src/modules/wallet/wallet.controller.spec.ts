import { getRepositoryToken } from '@mikro-orm/nestjs'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { getRedisConnectionToken } from '@nestjs-modules/ioredis'

import {
  mockDatabaseService,
  repositoryMockFactory,
} from '../../database/test-helpers'
import { EthNftEntity } from '../eth/entities/eth-nft.entity'
import { EthNftCollectionEntity } from '../eth/entities/eth-nft-collection.entity'
import { EthService } from '../eth/eth.service'
import { LambdaService } from '../lambda/lambda.service'
import { RedisLockService } from '../redisLock/redisLock.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from './entities/wallet.entity'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'

describe('WalletController', () => {
  let controller: WalletController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        WalletService,
        EthService,
        ConfigService,
        {
          provide: RedisLockService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: getRepositoryToken(UserEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(WalletEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(EthNftEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(EthNftCollectionEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRedisConnectionToken(),
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: LambdaService,
          useFactory: jest.fn(() => ({})),
        },
        ...mockDatabaseService,
      ],
    }).compile()

    controller = module.get<WalletController>(WalletController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
