import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { CreatorStatsService } from '../creator-stats/creator-stats.service'
import { RedisLockService } from '../redisLock/redisLock.service'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

describe('PaymentController', () => {
  let controller: PaymentController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        PaymentService,
        ...getBaseProviders(),
        {
          provide: CreatorStatsService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: RedisLockService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    controller = module.get<PaymentController>(PaymentController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
