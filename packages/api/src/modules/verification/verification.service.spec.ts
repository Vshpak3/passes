import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { UserService } from '../user/user.service'
import { VerificationService } from './verification.service'

describe('VerificationService', () => {
  let service: VerificationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        ...getBaseProviders(),
        {
          provide: UserService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    service = module.get<VerificationService>(VerificationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
