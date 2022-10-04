import { Module } from '@nestjs/common'

import { EmailModule } from '../email/email.module'
import { PassModule } from '../pass/pass.module'
import { RedisLockModule } from '../redis-lock/redis-lock.module'
import { WalletModule } from '../wallet/wallet.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [EmailModule, RedisLockModule, WalletModule, PassModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
