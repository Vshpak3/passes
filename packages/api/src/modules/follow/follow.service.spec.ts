import { Test, TestingModule } from '@nestjs/testing'
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry'

import { getBaseProviders } from '../../util/providers.test'
import { MessagesService } from '../messages/messages.service'
import { PostService } from '../post/post.service'
import { FollowService } from './follow.service'

describe('FollowService', () => {
  let service: FollowService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        ...getBaseProviders(),
        {
          provide: MessagesService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: PostService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: SENTRY_TOKEN,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    service = module.get<FollowService>(FollowService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
