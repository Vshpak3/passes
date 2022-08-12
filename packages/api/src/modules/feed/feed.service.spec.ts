import { Test, TestingModule } from '@nestjs/testing'

import { mockDatabaseService } from '../../database/test-helpers'
import { FeedService } from './feed.service'

describe('FeedService', () => {
  let service: FeedService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedService, ...mockDatabaseService],
    }).compile()

    service = module.get<FeedService>(FeedService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
