import { BatchTask } from '../batch/batch.interface'
import { PaymentService } from '../modules/payment/payment.service'

export class PayoutCreatorsTask extends BatchTask {
  async run(): Promise<void> {
    try {
      await this.app.get(PaymentService).payoutAll()
    } catch (err) {
      this.logger.info(`Error paying out creators: ${err}`)
    }
  }
}
