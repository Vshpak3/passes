import { ContentService } from '../../modules/content/content.service'
import { PostService } from '../../modules/post/post.service'
import { BatchTask } from '../batch.interface'

export class RefreshContentTask extends BatchTask {
  async run(): Promise<void> {
    const postIds = await this.app.get(ContentService).checkProcessed()
    const postService = this.app.get(PostService)
    await Promise.all(
      postIds.map(async (postId) => {
        await postService.checkPostContentProcessed(postId)
      }),
    )
  }
}
