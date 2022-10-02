import { PostService } from '../../modules/post/post.service'
import { BatchTask } from '../batch.interface'

export class RefreshNumPostsTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(PostService).refreshNumPosts()
  }
}
