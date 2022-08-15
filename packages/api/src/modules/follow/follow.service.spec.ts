import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { FollowService } from './follow.service'

describe('FollowService', () => {
  let service: FollowService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowService, ...getBaseProviders()],
    }).compile()

    service = module.get<FollowService>(FollowService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
