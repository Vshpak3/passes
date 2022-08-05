import { Test, TestingModule } from '@nestjs/testing'

import { getDatabaseProviderToken } from '../../database/database.provider'
import { contextNames } from '../../database/mikro-orm.options'
import { databaseServiceMockFactory } from '../../database/test-helpers'
import { CreatorSettingsService } from './creator-settings.service'

describe('CreatorSettingsService', () => {
  let service: CreatorSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatorSettingsService,
        ...contextNames.map((contextName) => ({
          provide: getDatabaseProviderToken(contextName),
          useFactory: databaseServiceMockFactory,
        })),
      ],
    }).compile()

    service = module.get<CreatorSettingsService>(CreatorSettingsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
