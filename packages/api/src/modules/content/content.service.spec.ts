import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { ContentService } from './content.service'

describe('ContentService', () => {
  let service: ContentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentService, ...getBaseProviders()],
    }).compile()

    service = module.get<ContentService>(ContentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
