import { Test, TestingModule } from '@nestjs/testing'
import { SubscriptionController } from './subscription.controller'
import { SubscriptionService } from './subscription.service'
import { SubscriptionEntity } from './entities/subscription.entity'
import { repositoryMockFactory } from '../../database/test-helpers'
import { getRepositoryToken } from '@mikro-orm/nestjs'

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
      ],
    }).compile()

    controller = module.get<SubscriptionController>(SubscriptionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
