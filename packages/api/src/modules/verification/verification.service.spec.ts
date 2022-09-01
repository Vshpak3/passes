import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { VerificationService } from './verification.service'

describe('VerificationService', () => {
  let service: VerificationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerificationService, ...getBaseProviders()],
    }).compile()

    service = module.get<VerificationService>(VerificationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
