import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { UserService } from '../user/user.service'
import { VerificationController } from './verification.controller'
import { VerificationService } from './verification.service'

describe('VerificationController', () => {
  let controller: VerificationController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationController],
      providers: [
        VerificationService,
        ...getBaseProviders(),
        {
          provide: UserService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    controller = module.get<VerificationController>(VerificationController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
