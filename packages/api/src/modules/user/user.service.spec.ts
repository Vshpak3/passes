import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { UserService } from './user.service'
import { UserEntity } from './entities/user.entity'
import { EntityRepository } from '@mikro-orm/core'
import { repositoryMockFactory } from '../../database/test-helpers'

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
