import { BatchTask } from '../../batch/batch.interface'
import { CreatorStatsService } from '../../modules/creator-stats/creator-stats.service'

export class CreateEarningHistoryTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(CreatorStatsService).createEarningHistory()
  }
}
