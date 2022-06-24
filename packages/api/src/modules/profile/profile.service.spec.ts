import { Test, TestingModule } from '@nestjs/testing'
import { ProfileService } from './profile.service'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { ProfileEntity } from './entities/profile.entity'
import { repositoryMockFactory } from '../../database/test-helpers'

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
      ],
    }).compile()

    service = module.get<ProfileService>(ProfileService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
