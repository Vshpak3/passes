import { EntityManager } from '@mikro-orm/mysql'
import { Test, TestingModule } from '@nestjs/testing'

import { mockDatabaseService } from '../../database/test-helpers'
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
        ...mockDatabaseService,
      ],
    }).compile()

    controller = module.get<ProfileController>(ProfileController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
