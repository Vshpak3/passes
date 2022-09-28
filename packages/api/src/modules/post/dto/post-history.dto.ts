import { PickType } from '@nestjs/swagger'

import { PostHistoryEntity } from '../entities/post-history.entity'
import { PostDto } from './post.dto'

export class PostHistoryDto extends PickType(PostDto, [
  'postId',
  'numLikes',
  'numComments',
  'numPurchases',
  'earningsPurchases',
  'totalTipAmount',
]) {
  constructor(postHistory: PostHistoryEntity | undefined) {
    super()
    if (postHistory) {
      this.postId = postHistory.post_id
      this.numLikes = postHistory.num_likes
      this.numComments = postHistory.num_comments
      this.totalTipAmount = postHistory.total_tip_amount
      this.earningsPurchases = postHistory.earnings_purchases
      this.numPurchases = postHistory.num_purchases
    }
  }
}
