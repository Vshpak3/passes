import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { RedisModule } from '@nestjs-modules/ioredis'
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry'
import { WinstonModule } from 'nest-winston'

import { configOptions } from './config/config.options'
import { DatabaseModule } from './database/database.module'
import { redisOptions } from './database/redis.options'
import { AdminModule } from './modules/admin/admin.module'
import { AgencyModule } from './modules/agency/agency.module'
import { AuthModule } from './modules/auth/auth.module'
import { CommentModule } from './modules/comment/comment.module'
import { ContentModule } from './modules/content/content.module'
import { CreatorSettingsModule } from './modules/creator-settings/creator-settings.module'
import { CreatorStatsModule } from './modules/creator-stats/creator-stats.module'
import { EthModule } from './modules/eth/eth.module'
import { FanWallModule } from './modules/fan-wall/fan-wall.module'
import { FeedModule } from './modules/feed/feed.module'
import { FollowModule } from './modules/follow/follow.module'
import { HealthModule } from './modules/health/health.module'
import { LambdaModule } from './modules/lambda/lambda.module'
import { LikeModule } from './modules/likes/like.module'
import { ListModule } from './modules/list/list.module'
import { MessagesModule } from './modules/messages/messages.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { PassModule } from './modules/pass/pass.module'
import { PaymentModule } from './modules/payment/payment.module'
import { PostModule } from './modules/post/post.module'
import { ProfileModule } from './modules/profile/profile.module'
import { RedisLockModule } from './modules/redis-lock/redis-lock.module'
import { S3ContentModule } from './modules/s3content/s3content.module'
import { ScheduledModule } from './modules/scheduled/scheduled.module'
import { SolModule } from './modules/sol/sol.module'
import { UserModule } from './modules/user/user.module'
import { VerificationModule } from './modules/verification/verification.module'
import { WalletModule } from './modules/wallet/wallet.module'
import { loggingOptions } from './monitoring/logging/logging.options'
import { RequestLogger } from './monitoring/logging/logging.request'
import { MetricsModule } from './monitoring/metrics/metric.module'
import { metricOptions } from './monitoring/metrics/metric.options'
import {
  sentryInterceptorOptions,
  sentryOptions,
} from './monitoring/sentry/sentry.options'
import { isEnv } from './util/env'

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    MetricsModule.forRootAsync(metricOptions),
    RedisModule.forRootAsync(redisOptions, 'subscriber'),
    RedisModule.forRootAsync(redisOptions, 'publisher'),
    RedisModule.forRootAsync(redisOptions, 'message_subscriber'),
    RedisModule.forRootAsync(redisOptions, 'message_publisher'),
    RedisModule.forRootAsync(redisOptions, 'post_subscriber'),
    RedisModule.forRootAsync(redisOptions, 'post_publisher'),
    RedisModule.forRootAsync(redisOptions, 'pass_subscriber'),
    RedisModule.forRootAsync(redisOptions, 'pass_publisher'),
    RedisModule.forRootAsync(redisOptions, 'payment_subscriber'),
    RedisModule.forRootAsync(redisOptions, 'payment_publisher'),
    SentryModule.forRootAsync(sentryOptions),
    WinstonModule.forRootAsync(loggingOptions),
    AdminModule,
    AgencyModule,
    AuthModule,
    CommentModule,
    ContentModule,
    CreatorSettingsModule,
    CreatorStatsModule,
    DatabaseModule,
    EthModule,
    FanWallModule,
    FeedModule,
    FollowModule,
    HealthModule,
    LambdaModule,
    LikeModule,
    ListModule,
    MessagesModule,
    NotificationsModule,
    PassModule,
    PaymentModule,
    PostModule,
    ProfileModule,
    RedisLockModule,
    S3ContentModule,
    ScheduledModule,
    SolModule,
    UserModule,
    VerificationModule,
    WalletModule,
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
    if (isEnv('dev')) {
      consumer.apply(RequestLogger).forRoutes('*')
    }
  }
}
