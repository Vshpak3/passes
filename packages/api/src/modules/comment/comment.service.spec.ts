import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { CommentService } from './comment.service'
import { CommentEntity } from './entities/comment.entity'

describe('CommentService', () => {
  let service: CommentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CommentEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<CommentService>(CommentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
