import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { getDatabaseProviderToken } from '../../database/database.provider'
import { contextNames } from '../../database/mikro-orm.options'
import {
  databaseServiceMockFactory,
  repositoryMockFactory,
} from '../../database/test-helpers'
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
          provide: getRepositoryToken(CollectionEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PassEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        ...contextNames.map((contextName) => ({
          provide: getDatabaseProviderToken(contextName),
          useFactory: databaseServiceMockFactory,
        })),
      ],
    }).compile()

    controller = module.get<CollectionController>(CollectionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
