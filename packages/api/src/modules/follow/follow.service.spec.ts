import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { UserEntity } from '../user/entities/user.entity'
import { FollowEntity } from './entities/follow.entity'
import { FollowService } from './follow.service'

describe('FollowService', () => {
  let service: FollowService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        {
          provide: getRepositoryToken(FollowEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<FollowService>(FollowService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
