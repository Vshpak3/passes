import { Test, TestingModule } from '@nestjs/testing'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { PostEntity } from './entities/post.entity'
import { repositoryMockFactory } from '../../database/test-helpers'

describe('PostController', () => {
  let controller: PostController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: getRepositoryToken(PostEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<PostController>(PostController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
