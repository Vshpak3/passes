import { getRepositoryToken } from '@mikro-orm/nestjs'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { GemBalanceEntity } from '../gem/entities/gem.balance.entity'
import { GemTransactionEntity } from '../gem/entities/gem.transaction.entity'
import { GemService } from '../gem/gem.service'
import { UserEntity } from '../user/entities/user.entity'
import { BankEntity } from './entities/bank.entity'
import { CardEntity } from './entities/card.entity'
import { CircleAddressEntity } from './entities/circle.address.entity'
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
          provide: GemService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: getRepositoryToken(GemTransactionEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(GemBalanceEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(CardEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PaymentEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(CircleAddressEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(BankEntity),
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
