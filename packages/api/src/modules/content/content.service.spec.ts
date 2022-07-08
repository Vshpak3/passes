import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { PostEntity } from '../post/entities/post.entity'
import { ContentService } from './content.service'
import { ContentEntity } from './entities/content.entity'

describe('ContentService', () => {
  let service: ContentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: getRepositoryToken(ContentEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PostEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<ContentService>(ContentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
