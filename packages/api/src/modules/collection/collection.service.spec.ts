import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
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
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(CollectionEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<CollectionService>(CollectionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
