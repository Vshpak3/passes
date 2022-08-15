import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { FollowController } from './follow.controller'
import { FollowService } from './follow.service'

describe('FollowController', () => {
  let controller: FollowController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowController],
      providers: [FollowService, ...getBaseProviders()],
    }).compile()

    controller = module.get<FollowController>(FollowController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
