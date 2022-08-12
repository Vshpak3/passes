import { Test, TestingModule } from '@nestjs/testing'

import { mockDatabaseService } from '../../database/test-helpers'
import { ContentService } from './content.service'

describe('ContentService', () => {
  let service: ContentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentService, ...mockDatabaseService],
    }).compile()

    service = module.get<ContentService>(ContentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
