import { Test, TestingModule } from '@nestjs/testing'

import { mockDatabaseService } from '../../database/test-helpers'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'

describe('CommentController', () => {
  let controller: CommentController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [CommentService, ...mockDatabaseService],
    }).compile()

    controller = module.get<CommentController>(CommentController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
