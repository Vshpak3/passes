import ms from 'ms'

import { ContentService } from '../../modules/content/content.service'
import { MessagesService } from '../../modules/messages/messages.service'
import { PostService } from '../../modules/post/post.service'
import { sleep } from '../../util/sleep.util'
import { BatchTask } from '../batch.interface'

const CHECK_PROCESSED_UNTIL = ms('12 hours') // Temporary
const RUNTIME = ms('3 minutes')
const REFERSH_TIME = ms('10 second')
const REFRESH_RETRIES = RUNTIME / REFERSH_TIME

export class RefreshContentTask extends BatchTask {
  async run(): Promise<void> {
    for (let i = 0; i < REFRESH_RETRIES; ++i) {
      await this.app.get(ContentService).checkProcessed()

      const postService = this.app.get(PostService)
      await postService.checkRecentPostsContentProcessed(CHECK_PROCESSED_UNTIL)
      // await postService.checkRecentPaidMessagesContentProcessed()

      const messagesService = this.app.get(MessagesService)
      await messagesService.checkRecentMessagesContentProcessed(
        CHECK_PROCESSED_UNTIL,
      )
      await sleep(REFERSH_TIME)
    }
  }
}
