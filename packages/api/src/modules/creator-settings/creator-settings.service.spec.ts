import { Test, TestingModule } from '@nestjs/testing'

import { mockDatabaseService } from '../../database/test-helpers'
import { CreatorSettingsService } from './creator-settings.service'

describe('CreatorSettingsService', () => {
  let service: CreatorSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatorSettingsService, ...mockDatabaseService],
    }).compile()

    service = module.get<CreatorSettingsService>(CreatorSettingsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
