import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { getDatabaseProviderToken } from '../../database/database.provider'
import { contextNames } from '../../database/mikro-orm.options'
import { databaseServiceMockFactory } from '../../database/test-helpers'
import { UserService } from '../user/user.service'
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
        ...contextNames.map((contextName) => ({
          provide: getDatabaseProviderToken(contextName),
          useFactory: databaseServiceMockFactory,
        })),
      ],
    }).compile()

    controller = module.get<PaymentController>(PaymentController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
