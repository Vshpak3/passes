import { Injectable } from '@nestjs/common'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import ms from 'ms'
import * as uuid from 'uuid'

const DEFAULT_LOCK_EXPIRE = ms('1 hour')
const DEFAULT_LOCK_RETRY_INTERVAL = 100 // ms
const DEFAULT_LOCK_MAX_RETRY_TIMES = 100

@Injectable()
export class RedisLockService {
  private readonly uuid: string = uuid.v4()

  constructor(@InjectRedis('publisher') private readonly redisService: Redis) {}

  private prefix(name: string): string {
    return `lock:${name}`
  }

  private getClient(): Redis {
    return this.redisService
  }
  /**
   * Try to lock once
   * @param {string} name lock name
   * @param {number} [expire] milliseconds, TTL for the redis key
   * @returns {boolean} true: success, false: failed
   */
  async lockOnce(name, expire) {
    const client = this.getClient()
    const result = await client.set(
      this.prefix(name),
      this.uuid,
      'PX',
      expire,
      'NX',
    )
    return result !== null
  }

  /**
   * Get a lock, automatically retrying if failed
   * @param {string} name lock name
   * @param {number} [expire] milliseconds, TTL for the redis key
   * @param {number} [retryInterval] milliseconds, the interval to retry if failed
   * @param {number} [maxRetryTimes] max times to retry
   */
  async lock(
    name: string,
    expire = DEFAULT_LOCK_EXPIRE,
    retryInterval = DEFAULT_LOCK_RETRY_INTERVAL,
    maxRetryTimes = DEFAULT_LOCK_MAX_RETRY_TIMES,
  ): Promise<void> {
    let retryTimes = 0
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (await this.lockOnce(name, expire)) {
        break
      } else {
        await this.sleep(retryInterval)
        if (retryTimes >= maxRetryTimes) {
          throw new Error(`RedisLockService: locking ${name} timed out`)
        }
        retryTimes++
      }
    }
  }

  /**
   * Unlock a lock by name
   * @param {string} name lock name
   */
  async unlock(name) {
    const client = this.getClient()
    await client.eval(
      "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
      1,
      this.prefix(name),
      this.uuid,
    )
  }

  /**
   * Set TTL for a lock
   * @param {string} name lock name
   * @param {number} milliseconds TTL
   */
  async setTTL(name, milliseconds) {
    const client = this.getClient()
    await client.pexpire(this.prefix(name), milliseconds)
  }

  /**
   * Get TTL for a lock
   * @param {string} name lock name
   * @returns {number} true: success, false: failed
   */
  async getTTL(name) {
    const client = this.getClient()
    return await client.ttl(this.prefix(name))
  }

  /**
   * @param {number} ms milliseconds, the sleep interval
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  async sleep(ms: number): Promise<Function> {
    return new Promise((resolve) => setTimeout(resolve, Number(ms)))
  }
}
