import { ContentService } from '../../modules/content/content.service'
import { MessagesService } from '../../modules/messages/messages.service'
import { PostService } from '../../modules/post/post.service'
import { BatchTask } from '../batch.interface'

export class RefreshContentTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(ContentService).checkProcessed()
    const postService = this.app.get(PostService)
    const messagesService = this.app.get(MessagesService)
    await postService.checkRecentPostsContentProcessed()
    // await postService.checkRecentPaidMessagesContentProcessed()
    await messagesService.checkRecentMessagesContentProcessed()
  }
}
