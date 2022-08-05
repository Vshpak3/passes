import { EntityManager } from '@mikro-orm/mysql'
import { Test, TestingModule } from '@nestjs/testing'

import { getDatabaseProviderToken } from '../../database/database.provider'
import { contextNames } from '../../database/mikro-orm.options'
import { databaseServiceMockFactory } from '../../database/test-helpers'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

describe('ProfileController', () => {
  let controller: ProfileController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        ProfileService,
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({})),
        },
        ...contextNames.map((contextName) => ({
          provide: getDatabaseProviderToken(contextName),
          useFactory: databaseServiceMockFactory,
        })),
      ],
    }).compile()

    controller = module.get<ProfileController>(ProfileController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
