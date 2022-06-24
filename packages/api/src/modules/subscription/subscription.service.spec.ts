import { Test, TestingModule } from '@nestjs/testing'
import { SubscriptionService } from './subscription.service'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { SubscriptionEntity } from './entities/subscription.entity'
import { repositoryMockFactory } from '../../database/test-helpers'

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
      ],
    }).compile()

    service = module.get<SubscriptionService>(SubscriptionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
