import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { ListService } from '../list/list.service'
import { MessagesService } from '../messages/messages.service'
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
          provide: ListService,
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
