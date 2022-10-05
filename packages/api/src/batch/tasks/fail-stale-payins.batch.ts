import { BatchTask } from '../../batch/batch.interface'
import { PaymentService } from '../../modules/payment/payment.service'

export class FailStalePayinsTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(PaymentService).failStalePayins()
  }
}
