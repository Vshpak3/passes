import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { LikeController } from './like.controller'
import { LikeService } from './like.service'

describe('LikeController', () => {
  let controller: LikeController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeController],
      providers: [LikeService, ...getBaseProviders()],
    }).compile()

    controller = module.get<LikeController>(LikeController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
