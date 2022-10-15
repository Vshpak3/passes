import { BatchTask } from '../../batch/batch.interface'
import { ScheduledService } from '../../modules/scheduled/scheduled.service'

export class ScheduledEventsTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(ScheduledService).processScheduledEvents()
  }
}
