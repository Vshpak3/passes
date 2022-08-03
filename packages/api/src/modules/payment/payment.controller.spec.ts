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
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

describe('PaymentController', () => {
  let controller: PaymentController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
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
          provide: getRepositoryToken(DepositAddressEntity),
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
          provide: getRepositoryToken(DefaultPayinMethodEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<PaymentController>(PaymentController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
