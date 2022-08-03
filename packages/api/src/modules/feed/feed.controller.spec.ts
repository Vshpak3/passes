import { EntityManager } from '@mikro-orm/mysql'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { PostEntity } from '../post/entities/post.entity'
import { UserEntity } from '../user/entities/user.entity'
import { FeedController } from './feed.controller'
import { FeedService } from './feed.service'

describe('FeedController', () => {
  let controller: FeedController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        FeedService,
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: getRepositoryToken(PostEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<FeedController>(FeedController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
