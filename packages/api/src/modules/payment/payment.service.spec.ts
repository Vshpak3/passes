import { getRepositoryToken } from '@mikro-orm/nestjs'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { repositoryMockFactory } from '../../database/test-helpers'
import { GemService } from '../gem/gem.service'
import { UserEntity } from '../user/entities/user.entity'
import { BankEntity } from './entities/bank.entity'
import { CardEntity } from './entities/card.entity'
import { CircleAddressEntity } from './entities/circle.address.entity'
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
          provide: GemService,
          useFactory: jest.fn(() => ({})),
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

    service = module.get<PaymentService>(PaymentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
