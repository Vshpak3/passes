import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { EmailService } from '../email/email.service'
import { FanWallController } from './fan-wall.controller'
import { FanWallService } from './fan-wall.service'

describe('FanWallController', () => {
  let controller: FanWallController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FanWallController],
      providers: [
        FanWallService,
        ...getBaseProviders(),
        {
          provide: EmailService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    controller = module.get<FanWallController>(FanWallController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
