import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { CreatorStatsService } from './creator-stats.service'

describe('CreatorStatsService', () => {
  let service: CreatorStatsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatorStatsService, ...getBaseProviders()],
    }).compile()

    service = module.get<CreatorStatsService>(CreatorStatsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
