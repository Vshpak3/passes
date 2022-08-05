import { getRepositoryToken } from '@mikro-orm/nestjs'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { UserService } from '../user/user.service'
import { CircleBankEntity } from './entities/circle-bank.entity'
import { CircleCardEntity } from './entities/circle-card.entity'
import { CircleNotificationEntity } from './entities/circle-notification.entity'
import { CirclePaymentEntity } from './entities/circle-payment.entity'
import { DefaultPayinMethodEntity } from './entities/default-payin-method.entity'
import { DepositAddressEntity } from './entities/deposit-address.entity'
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
          provide: getRepositoryToken(CircleCardEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(CirclePaymentEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(DepositAddressEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(CircleBankEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(CircleNotificationEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PaymentEntity, 'ReadWrite'),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(DefaultPayinMethodEntity, 'ReadWrite'),
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
