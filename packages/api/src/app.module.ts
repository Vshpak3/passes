import { Module } from '@nestjs/common'
// import { ConfigModule } from '@nestjs/config';

import { MikroOrmModule } from '@mikro-orm/nestjs'
// import { AuthModule } from './modules/auth/auth.module'
import options from './database/mikro-orm.config'
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
    MikroOrmModule.forRoot(options),
    // ConfigModule.forRoot({
    //   envFilePath: `${process.env.NODE_ENV}.env`
    // }),
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
