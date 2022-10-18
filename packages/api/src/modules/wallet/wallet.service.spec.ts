import { Test, TestingModule } from '@nestjs/testing'
import { getRedisConnectionToken } from '@nestjs-modules/ioredis'

import { getBaseProviders } from '../../util/providers.test'
import { EthService } from '../eth/eth.service'
import { LambdaService } from '../lambda/lambda.service'
import { WalletService } from './wallet.service'

describe('WalletService', () => {
  let service: WalletService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        ...getBaseProviders(),
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

    service = module.get<WalletService>(WalletService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
