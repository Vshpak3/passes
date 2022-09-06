import { VerificationService } from '../modules/verification/verification.service'
import { BatchTask } from './batch.interface'

export class RefreshPersonasVerificationsTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(VerificationService).refreshPersonaVerifications()
  }
}
