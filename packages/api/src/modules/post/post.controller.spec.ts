import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { PaymentService } from '../payment/payment.service'
import { PostController } from './post.controller'
import { PostService } from './post.service'

describe('PostController', () => {
  let controller: PostController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        ...getBaseProviders(),
        {
          provide: PaymentService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    controller = module.get<PostController>(PostController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
