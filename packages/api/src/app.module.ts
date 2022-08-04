import { MikroOrmModule } from '@mikro-orm/nestjs'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { RedisModule } from '@nestjs-modules/ioredis'
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry'

import { configOptions } from './config/config.options'
import { databaseOptions } from './database/mikro-orm.options'
import { redisOptions } from './database/redis.options'
import { AuthModule } from './modules/auth/auth.module'
import { CollectionModule } from './modules/collection/collection.module'
import { CommentModule } from './modules/comment/comment.module'
import { ContentModule } from './modules/content/content.module'
import { CreatorSettingsModule } from './modules/creator-settings/creator-settings.module'
import { EthModule } from './modules/eth/eth.module'
import { FeedModule } from './modules/feed/feed.module'
import { FollowModule } from './modules/follow/follow.module'
import { HealthModule } from './modules/health/health.module'
import { LambdaModule } from './modules/lambda/lambda.module'
import { RequestLogger } from './modules/logging/request'
import { MessagesModule } from './modules/messages/messages.module'
import { PassModule } from './modules/pass/pass.module'
import { PaymentModule } from './modules/payment/payment.module'
import { PostModule } from './modules/post/post.module'
import { ProfileModule } from './modules/profile/profile.module'
import { RedisLockModule } from './modules/redisLock/redisLock.module'
import { SettingsModule } from './modules/settings/settings.module'
import { SolModule } from './modules/sol/sol.module'
import { UserModule } from './modules/user/user.module'
import { WalletModule } from './modules/wallet/wallet.module'
import { sentryOptions } from './monitoring/sentry/sentry.options'

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    MikroOrmModule.forRootAsync(databaseOptions),
    RedisModule.forRootAsync(redisOptions),
    SentryModule.forRootAsync(sentryOptions),
    AuthModule,
    CollectionModule,
    CommentModule,
    ContentModule,
    CreatorSettingsModule,
    EthModule,
    FeedModule,
    FollowModule,
    HealthModule,
    LambdaModule,
    MessagesModule,
    PassModule,
    PaymentModule,
    PostModule,
    ProfileModule,
    RedisLockModule,
    SettingsModule,
    SolModule,
    UserModule,
    WalletModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new SentryInterceptor(),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLogger).forRoutes('*')
  }
}
