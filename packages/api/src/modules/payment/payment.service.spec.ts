import { getRepositoryToken } from '@mikro-orm/nestjs'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { UserService } from '../user/user.service'
import { CircleAddressEntity } from './entities/circle-address.entity'
import { CircleBankEntity } from './entities/circle-bank.entity'
import { CircleCardEntity } from './entities/circle-card.entity'
import { CircleNotificationEntity } from './entities/circle-notification.entity'
import { CirclePaymentEntity } from './entities/circle-payment.entity'
import { DefaultPayinEntity } from './entities/default-payin.entity'
import { PaymentEntity } from './entities/payment.entity'
import { PaymentService } from './payment.service'

describe('PaymentService', () => {
  let service: PaymentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        ConfigService,
        {
          provide: UserService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: getRepositoryToken(CircleCardEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(CirclePaymentEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(CircleAddressEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(CircleBankEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(CircleNotificationEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PaymentEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(DefaultPayinEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    service = module.get<PaymentService>(PaymentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
