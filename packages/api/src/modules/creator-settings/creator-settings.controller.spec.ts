import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { CreatorSettingsController } from './creator-settings.controller'
import { CreatorSettingsService } from './creator-settings.service'

describe('CreatorSettingsController', () => {
  let controller: CreatorSettingsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatorSettingsController],
      providers: [CreatorSettingsService, ...getBaseProviders()],
    }).compile()

    controller = module.get<CreatorSettingsController>(
      CreatorSettingsController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
