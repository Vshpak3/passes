import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { CreatorStatsService } from '../creator-stats/creator-stats.service'
import { EmailService } from '../email/email.service'
import { RedisLockService } from '../redis-lock/redis-lock.service'
import { PaymentService } from './payment.service'

describe('PaymentService', () => {
  let service: PaymentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        {
          provide: EmailService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    service = module.get<PaymentService>(PaymentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
