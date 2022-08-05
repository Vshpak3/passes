import { Test, TestingModule } from '@nestjs/testing'

import { getDatabaseProviderToken } from '../../database/database.provider'
import { contextNames } from '../../database/mikro-orm.options'
import { databaseServiceMockFactory } from '../../database/test-helpers'
import { FollowController } from './follow.controller'
import { FollowService } from './follow.service'

describe('FollowController', () => {
  let controller: FollowController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowController],
      providers: [
        FollowService,
        ...contextNames.map((contextName) => ({
          provide: getDatabaseProviderToken(contextName),
          useFactory: databaseServiceMockFactory,
        })),
      ],
    }).compile()

    controller = module.get<FollowController>(FollowController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
