import { Test, TestingModule } from '@nestjs/testing'
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry'

import { getBaseProviders } from '../../util/providers.test'
import { MessagesService } from '../messages/messages.service'
import { PostService } from '../post/post.service'
import { FollowController } from './follow.controller'
import { FollowService } from './follow.service'

describe('FollowController', () => {
  let controller: FollowController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowController],
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

    controller = module.get<FollowController>(FollowController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
