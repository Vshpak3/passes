import { EntityManager } from '@mikro-orm/mysql'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { PostEntity } from './entities/post.entity'
import { PostRequiredPassEntity } from './entities/postrequiredpass.entity'
import { PostController } from './post.controller'
import { PostService } from './post.service'

describe('PostController', () => {
  let controller: PostController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: getRepositoryToken(PostEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PostRequiredPassEntity),
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
