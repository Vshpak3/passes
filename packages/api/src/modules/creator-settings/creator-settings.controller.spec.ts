import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { UserEntity } from '../user/entities/user.entity'
import { CreatorSettingsController } from './creator-settings.controller'
import { CreatorSettingsService } from './creator-settings.service'
import { CreatorSettingsEntity } from './entities/creator-settings.entity'

describe('CreatorSettingsController', () => {
  let controller: CreatorSettingsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatorSettingsController],
      providers: [
        CreatorSettingsService,
        {
          provide: getRepositoryToken(CreatorSettingsEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
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
