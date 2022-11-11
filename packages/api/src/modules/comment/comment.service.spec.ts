import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { EmailService } from '../email/email.service'
import { CommentService } from './comment.service'

describe('CommentService', () => {
  let service: CommentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        ...getBaseProviders(),
        {
          provide: EmailService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    service = module.get<CommentService>(CommentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
