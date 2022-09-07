import { Module } from '@nestjs/common'

import { LambdaModule } from '../lambda/lambda.module'
import { RedisLockModule } from '../redisLock/redisLock.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { WalletModule } from '../wallet/wallet.module'
import { SolService } from './sol.service'

@Module({
  imports: [RedisLockModule, LambdaModule, S3ContentModule, WalletModule],
  controllers: [],
  providers: [SolService],
  exports: [SolService],
})
export class SolModule {}
