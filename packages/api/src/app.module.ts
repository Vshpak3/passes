import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { ProfileModule } from './profile/profile.module'
import { UsersModule } from './user/user.module'

@Module({
  imports: [UsersModule, ProfileModule, AuthModule],
})
export class AppModule {}
