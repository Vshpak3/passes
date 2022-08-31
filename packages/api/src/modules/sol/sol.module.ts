import { Module } from '@nestjs/common'

import { LambdaModule } from '../lambda/lambda.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { WalletModule } from '../wallet/wallet.module'
import { SolController } from './sol.controller'
import { SolService } from './sol.service'

@Module({
  imports: [LambdaModule, S3ContentModule, WalletModule],
  controllers: [SolController],
  providers: [SolService],
  exports: [SolService],
})
export class SolModule {}
