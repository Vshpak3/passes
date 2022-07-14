/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "request.**.expect"] }] */

import { MikroORM } from '@mikro-orm/core'
import type { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRedisConnectionToken, Redis } from '@nestjs-modules/ioredis'
import request from 'supertest'

import { AppModule } from './../src/app.module'

// This test unfortunately results in the following warning message:
// A worker process has failed to exit gracefully and has been force exited.
// This is likely caused by tests leaking due to improper teardown. Try running
// with --detectOpenHandles to find leaks. Active timers can also cause this,
// ensure that .unref() was called on them.

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
