import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { CreatorSettingsService } from './creator-settings.service'

describe('CreatorSettingsService', () => {
  let service: CreatorSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatorSettingsService, ...getBaseProviders()],
    }).compile()

    service = module.get<CreatorSettingsService>(CreatorSettingsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
