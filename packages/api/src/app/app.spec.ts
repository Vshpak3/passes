/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "request.**.expect"] }] */

import { getMikroORMToken } from '@mikro-orm/nestjs'
import { MikroOrmCoreModule } from '@mikro-orm/nestjs/mikro-orm-core.module'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRedisConnectionToken } from '@nestjs-modules/ioredis'
import request from 'supertest'

import { AppModule } from '../app.module'
import { DatabaseModule } from '../database/database.module'
import { getDatabaseProviderToken } from '../database/database.provider'
import { contextNames } from '../database/mikro-orm.options'

describe('App e2e', () => {
  let app: INestApplication

  const overrides = [
    // Mock database
    ...contextNames.map((n) => getMikroORMToken(n)),
    ...contextNames.map((n) => getDatabaseProviderToken(n)),
    // Mock redis
    getRedisConnectionToken(),
  ]

  beforeAll(async () => {
    const moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    })

    overrides.forEach((override) =>
      moduleBuilder.overrideProvider(override).useValue({}),
    )

    moduleBuilder
      // Mock database module onModuleInit function
      .overrideProvider(DatabaseModule)
      .useValue({ onModuleInit: () => undefined })
      // Mock mikroorm core module onApplicationShutdown function
      .overrideProvider(MikroOrmCoreModule)
      .useValue({ onApplicationShugtdown: () => undefined })

    const moduleFixture = await moduleBuilder.compile()
    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api', { exclude: [''] })

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(HttpStatus.OK)
      .expect('healthy')
  })
})
