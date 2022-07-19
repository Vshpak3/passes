/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "request.**.expect"] }] */

import { MikroORM } from '@mikro-orm/core'
import type { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRedisConnectionToken, Redis } from '@nestjs-modules/ioredis'
import request from 'supertest'

import { AppModule } from './../src/app.module'

describe('App e2e', () => {
  let app: INestApplication
  let moduleFixture: TestingModule

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api', { exclude: [''] })

    await app.init()
  })

  afterAll(async () => {
    // must close database connection
    moduleFixture.get<MikroORM>(MikroORM).close()
    // must close redis connection
    moduleFixture.get<Redis>(getRedisConnectionToken()).disconnect()
    await app.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect('')
  })
})
