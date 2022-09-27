import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class CreatorStatDto {
  @DtoProperty({ type: 'uuid' })
  userId: string

  @Min(0)
  @DtoProperty({ type: 'number' })
  numFollowers: number

  @Min(0)
  @DtoProperty({ type: 'number' })
  numLikes: number

  @Min(0)
  @DtoProperty({ type: 'number' })
  numMedia: number

  constructor(creatorStat, isCreator) {
    if (creatorStat) {
      this.userId = creatorStat.user_id
      if (isCreator || creatorStat.show_follower_count) {
        this.numFollowers = creatorStat.num_followers
      }
      this.numLikes = creatorStat.num_likes
      if (isCreator || creatorStat.show_media_count) {
        this.numMedia = creatorStat.num_media
      }
    }
  }
}
