import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { PostService } from '../post/post.service'
import { FeedController } from './feed.controller'
import { FeedService } from './feed.service'

describe('FeedController', () => {
  let controller: FeedController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        FeedService,
        ...getBaseProviders(),
        {
          provide: PostService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    controller = module.get<FeedController>(FeedController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
