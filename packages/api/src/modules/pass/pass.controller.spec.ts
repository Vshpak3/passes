import { EntityManager } from '@mikro-orm/mysql'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { CollectionEntity } from '../collection/entities/collection.entity'
import { UserEntity } from '../user/entities/user.entity'
import { PassEntity } from './entities/pass.entity'
import { PassOwnershipEntity } from './entities/pass-ownership.entity'
import { PassController } from './pass.controller'
import { PassService } from './pass.service'

describe('PassController', () => {
  let controller: PassController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassController],
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

    controller = module.get<PassController>(PassController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
