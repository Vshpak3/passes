import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { PassEntity } from '../pass/entities/pass.entity'
import { UserEntity } from '../user/entities/user.entity'
import { CollectionController } from './collection.controller'
import { CollectionService } from './collection.service'
import { CollectionEntity } from './entities/collection.entity'

describe('CollectionController', () => {
  let controller: CollectionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionController],
      providers: [
        CollectionService,
        {
          provide: getRepositoryToken(CollectionEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PassEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<CollectionController>(CollectionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
