import { EntityManager } from '@mikro-orm/mysql'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { CollectionEntity } from '../collection/entities/collection.entity'
import { UserEntity } from '../user/entities/user.entity'
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
