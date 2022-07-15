import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'
import { getRedisConnectionToken } from '@nestjs-modules/ioredis'

import { repositoryMockFactory } from '../../database/test-helpers'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from './entities/wallet.entity'
import { WalletService } from './wallet.service'

describe('WalletService', () => {
  let service: WalletService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(WalletEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRedisConnectionToken(),
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
