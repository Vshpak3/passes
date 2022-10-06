import { Module } from '@nestjs/common'

import { LambdaModule } from '../lambda/lambda.module'
import { RedisLockModule } from '../redis-lock/redis-lock.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { EthService } from './eth.service'

@Module({
  imports: [RedisLockModule, LambdaModule, S3ContentModule],
  controllers: [],
  providers: [EthService],
  exports: [EthService],
})
export class EthModule {}
