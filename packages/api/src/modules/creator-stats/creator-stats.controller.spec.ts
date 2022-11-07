import { Test, TestingModule } from '@nestjs/testing'
import { SENTRY_TOKEN } from '@ntegral/nestjs-sentry'

import { getBaseProviders } from '../../util/providers.test'
import { CreatorStatsController } from './creator-stats.controller'
import { CreatorStatsService } from './creator-stats.service'

describe('CreatorStatsController', () => {
  let controller: CreatorStatsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatorStatsController],
      providers: [
        CreatorStatsService,
        ...getBaseProviders(),

        {
          provide: SENTRY_TOKEN,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    controller = module.get<CreatorStatsController>(CreatorStatsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
