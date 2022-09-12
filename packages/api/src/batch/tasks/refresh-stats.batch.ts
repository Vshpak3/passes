import { CreatorStatsService } from '../../modules/creator-stats/creator-stats.service'
import { PostService } from '../../modules/post/post.service'
import { BatchTask } from '../batch.interface'

/*
 * Executes refreshNftsForWallet for chunks of ETH wallets
 */
export class RefreshStatsTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(PostService).refreshPostsCounts()
    await this.app.get(CreatorStatsService).refreshCreatorsStats()
  }
}
