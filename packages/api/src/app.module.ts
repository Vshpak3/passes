import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/user.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [UsersModule]
})
export class AppModule {}
