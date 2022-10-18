import { Test, TestingModule } from '@nestjs/testing'
import { getRedisConnectionToken } from '@nestjs-modules/ioredis'

import { getBaseProviders } from '../../util/providers.test'
import { EthService } from '../eth/eth.service'
import { LambdaService } from '../lambda/lambda.service'
import { RedisLockService } from '../redis-lock/redis-lock.service'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'

describe('WalletController', () => {
  let controller: WalletController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        WalletService,
        ...getBaseProviders(),
        EthService,
        {
          provide: RedisLockService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: getRedisConnectionToken('publisher'),
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: LambdaService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: EthService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    controller = module.get<WalletController>(WalletController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
