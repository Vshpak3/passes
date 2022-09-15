import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { PaymentService } from '../payment/payment.service'
import { S3ContentService } from '../s3content/s3content.service'
import { PostService } from './post.service'

describe('PostService', () => {
  let service: PostService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        ...getBaseProviders(),
        {
          provide: PaymentService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: S3ContentService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    service = module.get<PostService>(PostService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
