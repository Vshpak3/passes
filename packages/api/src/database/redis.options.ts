import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisModuleOptions } from '@nestjs-modules/ioredis'

export const redisOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<RedisModuleOptions> => ({
    config: {
      host: configService.get('redis.host'),
      port: configService.get('redis.port'),
    },
  }),
  inject: [ConfigService],
}
