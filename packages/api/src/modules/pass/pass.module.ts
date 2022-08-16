import { Module } from '@nestjs/common'

import { PaymentModule } from '../payment/payment.module'
import { SolModule } from '../sol/sol.module'
import { WalletModule } from '../wallet/wallet.module'
import { PassController } from './pass.controller'
import { PassService } from './pass.service'

@Module({
  imports: [PaymentModule, SolModule, WalletModule],
  controllers: [PassController],
  providers: [PassService],
  exports: [PassService],
})
export class PassModule {}
