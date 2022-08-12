import { Test, TestingModule } from '@nestjs/testing'

import { mockDatabaseService } from '../../database/test-helpers'
import { CreatorSettingsController } from './creator-settings.controller'
import { CreatorSettingsService } from './creator-settings.service'

describe('CreatorSettingsController', () => {
  let controller: CreatorSettingsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatorSettingsController],
      providers: [CreatorSettingsService, ...mockDatabaseService],
    }).compile()

    controller = module.get<CreatorSettingsController>(
      CreatorSettingsController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
