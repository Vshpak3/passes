import { Module } from '@nestjs/common'

import { EmailModule } from '../email/email.module'
import { RedisLockModule } from '../redis-lock/redis-lock.module'
import { WalletModule } from '../wallet/wallet.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [EmailModule, RedisLockModule, WalletModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
