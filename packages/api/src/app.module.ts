import { MikroOrmModule } from '@mikro-orm/nestjs'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { RedisModule } from '@nestjs-modules/ioredis'
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry'
import { WinstonModule } from 'nest-winston'

import { configOptions } from './config/config.options'
import { DatabaseModule } from './database/database.module'
import { MikroOrmConfigService } from './database/mikro-orm.config.service'
import { contextNames } from './database/mikro-orm.options'
import { redisOptions } from './database/redis.options'
import { AuthModule } from './modules/auth/auth.module'
import { CollectionModule } from './modules/collection/collection.module'
import { CommentModule } from './modules/comment/comment.module'
import { ContentModule } from './modules/content/content.module'
import { CreatorSettingsModule } from './modules/creator-settings/creator-settings.module'
import { CreatorStatsModule } from './modules/creator-stats/creator-stats.module'
import { EthModule } from './modules/eth/eth.module'
import { FeedModule } from './modules/feed/feed.module'
import { FollowModule } from './modules/follow/follow.module'
import { HealthModule } from './modules/health/health.module'
import { LambdaModule } from './modules/lambda/lambda.module'
import { LikeModule } from './modules/likes/like.module'
import { ListModule } from './modules/list/list.module'
import { RequestLogger } from './modules/logging/request'
import { MessagesModule } from './modules/messages/messages.module'
import { PassModule } from './modules/pass/pass.module'
import { PaymentModule } from './modules/payment/payment.module'
import { PostModule } from './modules/post/post.module'
import { ProfileModule } from './modules/profile/profile.module'
import { RedisLockModule } from './modules/redisLock/redisLock.module'
import { S3ContentModule } from './modules/s3content/s3content.module'
import { SettingsModule } from './modules/settings/settings.module'
import { SolModule } from './modules/sol/sol.module'
import { UserModule } from './modules/user/user.module'
import { WalletModule } from './modules/wallet/wallet.module'
import { loggingOptions } from './monitoring/logging/logging.options'
import { MetricsModule } from './monitoring/metrics/metric.module'
import { metricOptions } from './monitoring/metrics/metric.options'
import {
  sentryInterceptorOptions,
  sentryOptions,
} from './monitoring/sentry/sentry.options'

@Module({
  imports: [
    ...contextNames.map((contextName) =>
      MikroOrmModule.forRootAsync({
        contextName,
        useClass: MikroOrmConfigService,
      }),
    ),
    ConfigModule.forRoot(configOptions),
    MetricsModule.forRootAsync(metricOptions),
    RedisModule.forRootAsync(redisOptions),
    SentryModule.forRootAsync(sentryOptions),
    WinstonModule.forRootAsync(loggingOptions),
    AuthModule,
    CollectionModule,
    CommentModule,
    LikeModule,
    DatabaseModule,
    ContentModule,
    CreatorSettingsModule,
    CreatorStatsModule,
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
    S3ContentModule,
    SettingsModule,
    SolModule,
    UserModule,
    WalletModule,
    ListModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new SentryInterceptor(sentryInterceptorOptions),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    if (process.env.NODE_ENV === 'dev') {
      consumer.apply(RequestLogger).forRoutes('*')
    }
  }
}
