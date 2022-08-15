import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { SettingsController } from './settings.controller'
import { SettingsService } from './settings.service'

describe('SettingsController', () => {
  let controller: SettingsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [SettingsService, ...getBaseProviders()],
    }).compile()

    controller = module.get<SettingsController>(SettingsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
