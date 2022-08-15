import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
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
        {
          provide: UserService,
          useFactory: jest.fn(() => ({})),
        },
        ...getBaseProviders(),
      ],
    }).compile()

    controller = module.get<PaymentController>(PaymentController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
