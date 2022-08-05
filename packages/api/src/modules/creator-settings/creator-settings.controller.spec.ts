import { Test, TestingModule } from '@nestjs/testing'

import { getDatabaseProviderToken } from '../../database/database.provider'
import { contextNames } from '../../database/mikro-orm.options'
import { databaseServiceMockFactory } from '../../database/test-helpers'
import { CreatorSettingsController } from './creator-settings.controller'
import { CreatorSettingsService } from './creator-settings.service'

describe('CreatorSettingsController', () => {
  let controller: CreatorSettingsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatorSettingsController],
      providers: [
        CreatorSettingsService,
        ...contextNames.map((contextName) => ({
          provide: getDatabaseProviderToken(contextName),
          useFactory: databaseServiceMockFactory,
        })),
      ],
    }).compile()

    controller = module.get<CreatorSettingsController>(
      CreatorSettingsController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
