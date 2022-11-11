import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { EmailService } from '../email/email.service'
import { FanWallService } from './fan-wall.service'

describe('FanWallService', () => {
  let service: FanWallService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FanWallService,
        ...getBaseProviders(),
        {
          provide: EmailService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    service = module.get<FanWallService>(FanWallService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
