import { Module } from '@nestjs/common';
import { UsersModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, ProfileModule, AuthModule]
})
export class AppModule {}
