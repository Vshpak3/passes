import { Module } from '@nestjs/common'

// import { AuthModule } from './modules/auth/auth.module'
import { AccountSettingsModule } from './modules/account-settings/account-settings.module'
import { CommentModule } from './modules/comment/comment.module'
import { PassModule } from './modules/pass/pass.module'
import { PostModule } from './modules/post/post.module'
import { ProfileModule } from './modules/profile/profile.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    AccountSettingsModule,
    CommentModule,
    PassModule,
    PostModule,
    ProfileModule,
    SubscriptionModule,
    UserModule,
  ],
})
export class AppModule {}
