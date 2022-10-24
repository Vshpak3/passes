import { BatchTask } from '../../batch/batch.interface'
import { ListService } from '../../modules/list/list.service'

export class UpdateListsTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(ListService).updateAsyncLists()
  }
}
