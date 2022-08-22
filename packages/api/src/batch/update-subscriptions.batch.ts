import { BatchTask } from '../batch/batch.interface'
import { PaymentService } from '../modules/payment/payment.service'

export class UpdateSubscriptionsTask extends BatchTask {
  async run(): Promise<void> {
    try {
      await this.app.get(PaymentService).updateSubscriptions()
    } catch (err) {
      this.logger.info('Error paying out creators:', err)
    }
  }
}
