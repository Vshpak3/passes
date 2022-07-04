import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RedisModule } from '@nestjs-modules/ioredis'

import { configOptions } from './config/config.options'
import { databaseOptions } from './database/mikro-orm.options'
import { redisOptions } from './database/redis.options'
import { AuthModule } from './modules/auth/auth.module'
import { CommentModule } from './modules/comment/comment.module'
import { HealthModule } from './modules/health/health.module'
import { PassModule } from './modules/pass/pass.module'
import { PostModule } from './modules/post/post.module'
import { ProfileModule } from './modules/profile/profile.module'
import { SettingsModule } from './modules/settings/settings.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    MikroOrmModule.forRootAsync(databaseOptions),
    RedisModule.forRootAsync(redisOptions),
    ConfigModule.forRoot(configOptions),
    AuthModule,
    CommentModule,
    HealthModule,
    PassModule,
    PostModule,
    ProfileModule,
    SettingsModule,
    SubscriptionModule,
    UserModule,
  ],
})
export class AppModule {}
