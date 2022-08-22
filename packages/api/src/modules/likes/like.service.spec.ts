import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { LikeService } from './like.service'

describe('LikeService', () => {
  let service: LikeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikeService, ...getBaseProviders()],
    }).compile()

    service = module.get<LikeService>(LikeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
