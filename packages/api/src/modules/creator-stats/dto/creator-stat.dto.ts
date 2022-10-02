import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CreatorSettingsEntity } from '../../creator-settings/entities/creator-settings.entity'
import { CreatorStatEntity } from '../entities/creator-stat.entity'

export class CreatorStatDto {
  @DtoProperty({ type: 'uuid' })
  userId: string

  @Min(0)
  @DtoProperty({ type: 'number', optional: true })
  numFollowers?: number

  @Min(0)
  @DtoProperty({ type: 'number', optional: true })
  numLikes?: number

  @Min(0)
  @DtoProperty({ type: 'number', optional: true })
  numMedia?: number

  @Min(0)
  @DtoProperty({ type: 'number', optional: true })
  numPosts?: number

  constructor(
    creatorStat: CreatorStatEntity & Partial<CreatorSettingsEntity>,
    isCreator: boolean,
  ) {
    if (creatorStat) {
      this.userId = creatorStat.user_id
      if (isCreator || creatorStat.show_follower_count) {
        this.numFollowers = creatorStat.num_followers
      }
      if (isCreator || creatorStat.show_like_count) {
        this.numLikes = creatorStat.num_likes
      }
      if (isCreator || creatorStat.show_post_count) {
        this.numPosts = creatorStat.num_posts
      }
      if (isCreator || creatorStat.show_media_count) {
        this.numMedia = creatorStat.num_media
      }
    }
  }
}
