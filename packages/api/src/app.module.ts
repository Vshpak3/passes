import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [UsersModule]
})
export class AppModule {}
