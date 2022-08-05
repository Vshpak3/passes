import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { getDatabaseProviderToken } from '../../database/database.provider'
import { contextNames } from '../../database/mikro-orm.options'
import {
  databaseServiceMockFactory,
  repositoryMockFactory,
} from '../../database/test-helpers'
import { UserEntity } from '../user/entities/user.entity'
import { CollectionService } from './collection.service'
import { CollectionEntity } from './entities/collection.entity'

describe('CollectionService', () => {
  let service: CollectionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionService,
        {
          provide: getRepositoryToken(UserEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(CollectionEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        ...contextNames.map((contextName) => ({
          provide: getDatabaseProviderToken(contextName),
          useFactory: databaseServiceMockFactory,
        })),
      ],
    }).compile()

    service = module.get<CollectionService>(CollectionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
