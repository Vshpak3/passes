import { Test, TestingModule } from '@nestjs/testing'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { CommentEntity } from './entities/comment.entity'
import { EntityRepository } from '@mikro-orm/core'
import { repositoryMockFactory } from '../../database/test-helpers'
import { getRepositoryToken } from '@mikro-orm/nestjs'

describe('CommentController', () => {
  let controller: CommentController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CommentEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<CommentController>(CommentController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
