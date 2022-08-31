import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { PostService } from '../post/post.service'
import { FeedService } from './feed.service'

describe('FeedService', () => {
  let service: FeedService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        ...getBaseProviders(),
        {
          provide: PostService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    service = module.get<FeedService>(FeedService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
