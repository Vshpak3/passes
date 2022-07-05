import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { UserEntity } from '../user/entities/user.entity'
import { SubscriptionEntity } from './entities/subscription.entity'
import { SubscriptionService } from './subscription.service'

describe('SubscriptionService', () => {
  let service: SubscriptionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<SubscriptionService>(SubscriptionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
