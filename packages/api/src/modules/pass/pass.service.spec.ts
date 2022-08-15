import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from 'aws-sdk'

import { getBaseProviders } from '../../util/providers.test'
import { SolService } from '../sol/sol.service'
import { WalletService } from '../wallet/wallet.service'
import { PassService } from './pass.service'

describe('PassService', () => {
  let service: PassService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassService,
        ...getBaseProviders(),
        {
          provide: WalletService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: SolService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: ConfigService,
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile()

    service = module.get<PassService>(PassService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
