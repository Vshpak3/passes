import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { UserEntity } from '../user/entities/user.entity'
import { CreatorSettingsService } from './creator-settings.service'
import { CreatorSettingsEntity } from './entities/creator-settings.entity'

describe('CreatorSettingsService', () => {
  let service: CreatorSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<CreatorSettingsService>(CreatorSettingsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
