import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { UserEntity } from '../user/entities/user.entity'
import { ProfileEntity } from './entities/profile.entity'
import { ProfileService } from './profile.service'

describe('ProfileService', () => {
  let service: ProfileService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(ProfileEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<ProfileService>(ProfileService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
