import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

import { mockDatabaseService } from '../database/test-helpers'

export function getBaseProviders() {
  return [
    ...mockDatabaseService,
    ConfigService,
    {
      provide: WINSTON_MODULE_PROVIDER,
      useFactory: jest.fn(() => ({})),
    },
  ]
}
