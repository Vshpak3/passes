import { EntityManager } from '@mikro-orm/mysql'
import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

describe('ProfileController', () => {
  let controller: ProfileController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        ProfileService,
        ...getBaseProviders(),
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    controller = module.get<ProfileController>(ProfileController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
