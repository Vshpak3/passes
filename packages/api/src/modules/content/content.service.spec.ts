import { Test, TestingModule } from '@nestjs/testing'

import { getBaseProviders } from '../../util/providers.test'
import { PassService } from '../pass/pass.service'
import { S3ContentService } from '../s3content/s3content.service'
import { ContentService } from './content.service'

describe('ContentService', () => {
  let service: ContentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: S3ContentService,
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: PassService,
          useFactory: jest.fn(() => ({})),
        },
        ...getBaseProviders(),
      ],
    }).compile()

    service = module.get<ContentService>(ContentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
