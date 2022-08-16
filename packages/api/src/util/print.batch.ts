import { NestFactory } from '@nestjs/core'

import { AppModule } from '../app.module'
import { PaymentModule } from '../modules/payment/payment.module'
import { PaymentService } from '../modules/payment/payment.service'

// A simple example task for testing
export async function examplePrint() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const payService = await app
    .select(PaymentModule)
    .get(PaymentService, { strict: true })
  await payService.printTest()
}
