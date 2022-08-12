import { Test, TestingModule } from '@nestjs/testing'

import { mockDatabaseService } from '../../database/test-helpers'
import { FollowService } from './follow.service'

describe('FollowService', () => {
  let service: FollowService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowService, ...mockDatabaseService],
    }).compile()

    service = module.get<FollowService>(FollowService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
