import { FollowService } from '../../modules/follow/follow.service'
import { BatchTask } from '../batch.interface'

export class ProcessBlocksTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(FollowService).processBlocks()
  }
}
