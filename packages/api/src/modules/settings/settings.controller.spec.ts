import { Test, TestingModule } from '@nestjs/testing'

import { mockDatabaseService } from '../../database/test-helpers'
import { SettingsController } from './settings.controller'
import { SettingsService } from './settings.service'

describe('SettingsController', () => {
  let controller: SettingsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [SettingsService, ...mockDatabaseService],
    }).compile()

    controller = module.get<SettingsController>(SettingsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
