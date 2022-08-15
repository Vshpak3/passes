import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'
import { getRedisConnectionToken } from '@nestjs-modules/ioredis'

import { repositoryMockFactory } from '../../database/test-helpers'
import { getBaseProviders } from '../../util/providers.test'
import { LambdaService } from '../lambda/lambda.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from './entities/wallet.entity'
import { WalletService } from './wallet.service'

describe('WalletService', () => {
  let service: WalletService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        ...getBaseProviders(),
        {
          provide: getRepositoryToken(UserEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(WalletEntity, 'ReadWrite'),
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
      ],
    }).compile()

    service = module.get<WalletService>(WalletService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
