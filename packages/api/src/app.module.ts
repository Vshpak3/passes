import { MikroOrmModule } from '@mikro-orm/nestjs'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RedisModule } from '@nestjs-modules/ioredis'

import { configOptions } from './config/config.options'
import { databaseOptions } from './database/mikro-orm.options'
import { redisOptions } from './database/redis.options'
import { AuthModule } from './modules/auth/auth.module'
import { CommentModule } from './modules/comment/comment.module'
import { ContentModule } from './modules/content/content.module'
import { CreatorSettingsModule } from './modules/creator-settings/creator-settings.module'
import { EthModule } from './modules/eth/eth.module'
import { GemModule } from './modules/gem/gem.module'
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
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { UserModule } from './modules/user/user.module'
import { WalletModule } from './modules/wallet/wallet.module'

@Module({
  imports: [
    MikroOrmModule.forRootAsync(databaseOptions),
    RedisModule.forRootAsync(redisOptions),
    ConfigModule.forRoot(configOptions),
    RedisLockModule,
    AuthModule,
    ContentModule,
    CommentModule,
    HealthModule,
    PassModule,
    PaymentModule,
    PostModule,
    ProfileModule,
    SettingsModule,
    SubscriptionModule,
    UserModule,
    WalletModule,
    GemModule,
    EthModule,
    MessagesModule,
    CreatorSettingsModule,
    LambdaModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLogger).forRoutes('*')
  }
}
