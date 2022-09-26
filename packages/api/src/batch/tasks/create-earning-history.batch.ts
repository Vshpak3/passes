import { BatchTask } from '../../batch/batch.interface'
import { CreatorStatsService } from '../../modules/creator-stats/creator-stats.service'
import { MessagesService } from '../../modules/messages/messages.service'
import { PostService } from '../../modules/post/post.service'

export class CreateEarningHistoryTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(CreatorStatsService).createEarningHistory()
    await this.app.get(PostService).createPostHistory()
    await this.app.get(MessagesService).createMessageHistory()
  }
}
