import { BatchTask } from '../batch/batch.interface'
import { VerificationService } from '../modules/verification/verification.service'

export class UpdateVerificationsTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(VerificationService).updateVerifications()
  }
}
