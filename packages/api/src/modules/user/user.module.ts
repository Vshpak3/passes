import { Module } from '@nestjs/common'

import { JwtAuthModule } from '../auth/jwt/jwt-auth.module'
import { EmailModule } from '../email/email.module'
import { RedisLockModule } from '../redis-lock/redis-lock.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [JwtAuthModule, EmailModule, RedisLockModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
