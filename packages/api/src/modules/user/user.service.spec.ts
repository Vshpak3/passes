import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { UserService } from './user.service'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ...getBaseProviders(),
        {
          provide: JwtAuthService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
