import { EntityManager } from '@mikro-orm/mysql'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from 'aws-sdk'

import { repositoryMockFactory } from '../../database/test-helpers'
import { CollectionEntity } from '../collection/entities/collection.entity'
import { SolNftEntity } from '../sol/entities/sol-nft.entity'
import { SolNftCollectionEntity } from '../sol/entities/sol-nft-collection.entity'
import { SolService } from '../sol/sol.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletService } from '../wallet/wallet.service'
import { PassEntity } from './entities/pass.entity'
import { PassOwnershipEntity } from './entities/pass-ownership.entity'
import { PassService } from './pass.service'

describe('PassService', () => {
  let service: PassService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassService,
        {
          provide: WalletService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: SolService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: ConfigService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: getRepositoryToken(CollectionEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PassEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(SolNftCollectionEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(SolNftEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PassOwnershipEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<PassService>(PassService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
