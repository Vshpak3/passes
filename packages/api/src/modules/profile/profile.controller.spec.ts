import { Test, TestingModule } from '@nestjs/testing'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { ProfileEntity } from './entities/profile.entity'
import { EntityRepository } from '@mikro-orm/core'
import { repositoryMockFactory } from '../../database/test-helpers'

describe('ProfileController', () => {
  let controller: ProfileController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(ProfileEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<ProfileController>(ProfileController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
