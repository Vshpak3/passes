import { Test, TestingModule } from '@nestjs/testing'

import { getDatabaseProviderToken } from '../../database/database.provider'
import { contextNames } from '../../database/mikro-orm.options'
import { databaseServiceMockFactory } from '../../database/test-helpers'
import { ContentService } from './content.service'

describe('ContentService', () => {
  let service: ContentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        ...contextNames.map((contextName) => ({
          provide: getDatabaseProviderToken(contextName),
          useFactory: databaseServiceMockFactory,
        })),
      ],
    }).compile()

    service = module.get<ContentService>(ContentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
