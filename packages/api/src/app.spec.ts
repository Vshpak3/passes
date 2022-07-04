/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "request.**.expect"] }] */

import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from './../src/app.module'

// This test unfortunately results in the following warning message:
// A worker process has failed to exit gracefully and has been force exited.
// This is likely caused by tests leaking due to improper teardown. Try running
// with --detectOpenHandles to find leaks. Active timers can also cause this,
// ensure that .unref() was called on them.

describe('App e2e', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

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
      .expect('')
  })
})
