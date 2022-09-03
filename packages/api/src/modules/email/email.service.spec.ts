import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { EmailService } from './email.service'

describe('EmailService', () => {
  let service: EmailService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService, ...getBaseProviders()],
    }).compile()

    service = module.get<EmailService>(EmailService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
