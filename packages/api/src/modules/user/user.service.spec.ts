import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { RedisLockService } from '../redis-lock/redis-lock.service'
import { WalletService } from '../wallet/wallet.service'
import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ...getBaseProviders(),
        {
          provide: RedisLockService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: WalletService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: PassService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
