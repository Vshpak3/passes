import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from 'aws-sdk'

import { repositoryMockFactory } from '../../database/test-helpers'
import { getBaseProviders } from '../../util/providers.test'
import { SolService } from '../sol/sol.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletService } from '../wallet/wallet.service'
import { PassController } from './pass.controller'
import { PassService } from './pass.service'

describe('PassController', () => {
  let controller: PassController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassController],
      providers: [
        PassService,
        ...getBaseProviders(),
        ConfigService,
        {
          provide: WalletService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: SolService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: getRepositoryToken(UserEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<PassController>(PassController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
