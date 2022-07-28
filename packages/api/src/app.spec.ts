/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "request.**.expect"] }] */

import type { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRedisConnectionToken } from '@nestjs-modules/ioredis'
import request from 'supertest'

import { AppModule } from './../src/app.module'

// TODO: enable once we move to knex
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('App e2e', () => {
  let app: INestApplication
  let moduleFixture: TestingModule

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      // Mock database
      // .overrideProvider(['MikroORM'])
      // .useValue({})
      // Mock redis
      .overrideProvider(getRedisConnectionToken())
      .useValue({})
      .compile()

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
      .expect(200)
      .expect('healthy')
  })
})
