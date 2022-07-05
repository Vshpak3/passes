import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { UserEntity } from '../user/entities/user.entity'
import { SubscriptionEntity } from './entities/subscription.entity'
import { SubscriptionController } from './subscription.controller'
import { SubscriptionService } from './subscription.service'

describe('SubscriptionController', () => {
  let controller: SubscriptionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        SubscriptionService,
        {
          provide: getRepositoryToken(SubscriptionEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<SubscriptionController>(SubscriptionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
