import { Module } from '@nestjs/common'

import { EthService } from '../eth/eth.service'
import { LambdaService } from '../lambda/lambda.service'
import { RedisLockService } from '../redisLock/redisLock.service'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'

@Module({
  controllers: [WalletController],
  providers: [WalletService, EthService, RedisLockService, LambdaService],
})
export class WalletModule {}
