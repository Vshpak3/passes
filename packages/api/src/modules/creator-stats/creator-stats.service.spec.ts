import { Test, TestingModule } from '@nestjs/testing'
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry'

import { getBaseProviders } from '../../util/providers.test'
import { CreatorStatsService } from './creator-stats.service'

describe('CreatorStatsService', () => {
  let service: CreatorStatsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatorStatsService,
        ...getBaseProviders(),
        {
          provide: SENTRY_TOKEN,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    service = module.get<CreatorStatsService>(CreatorStatsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
