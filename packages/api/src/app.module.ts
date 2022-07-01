import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { RedisModule } from '@nestjs-modules/ioredis'
// import { AuthModule } from './modules/auth/auth.module'
import { databaseOptions } from './database/mikro-orm.options'
import { redisOptions } from './database/redis.options'
import { CommentModule } from './modules/comment/comment.module'
import { HealthModule } from './modules/health/health.module'
import { PassModule } from './modules/pass/pass.module'
import { PostModule } from './modules/post/post.module'
import { configOptions } from './config/config.options'
import { ProfileModule } from './modules/profile/profile.module'
import { SettingsModule } from './modules/settings/settings.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    MikroOrmModule.forRootAsync(databaseOptions),
    RedisModule.forRootAsync(redisOptions),
    ConfigModule.forRoot(configOptions),
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
