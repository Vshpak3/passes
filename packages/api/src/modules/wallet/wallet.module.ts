import { Module } from '@nestjs/common'

import { EthModule } from '../eth/eth.module'
import { LambdaModule } from '../lambda/lambda.module'
import { RedisLockModule } from '../redisLock/redisLock.module'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'

@Module({
  imports: [EthModule, RedisLockModule, LambdaModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
