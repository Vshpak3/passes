import { Module } from '@nestjs/common'

import { EthModule } from '../eth/eth.module'
import { PaymentModule } from '../payment/payment.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { SolModule } from '../sol/sol.module'
import { WalletModule } from '../wallet/wallet.module'
import { PassController } from './pass.controller'
import { PassGateway } from './pass.gateway'
import { PassService } from './pass.service'

@Module({
  imports: [PaymentModule, SolModule, EthModule, WalletModule, S3ContentModule],
  controllers: [PassController],
  providers: [PassService, PassGateway],
  exports: [PassService, PassGateway],
})
export class PassModule {}
