import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { ListService } from '../list/list.service'
import { MessagesService } from '../messages/messages.service'
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
          provide: ListService,
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
