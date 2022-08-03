import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { UserEntity } from '../user/entities/user.entity'
import { FollowEntity } from './entities/follow.entity'
import { FollowController } from './follow.controller'
import { FollowService } from './follow.service'

describe('FollowController', () => {
  let controller: FollowController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowController],
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

    controller = module.get<FollowController>(FollowController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
