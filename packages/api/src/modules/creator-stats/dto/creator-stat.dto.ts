import { IsInt, IsUUID, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class CreatorStatDto {
  @IsUUID()
  @DtoProperty()
  userId: string

  @IsInt()
  @Min(0)
  @DtoProperty()
  numFollowers: number

  @IsInt()
  @Min(0)
  @DtoProperty()
  numLikes: number

  @IsInt()
  @Min(0)
  @DtoProperty()
  numMedia: number

  constructor(creatorStat, isCreator) {
    if (creatorStat) {
      this.userId = creatorStat.user_id
      if (isCreator || creatorStat.show_follower_count)
        this.numFollowers = creatorStat.num_followers
      this.numLikes = creatorStat.num_likes
      if (isCreator || creatorStat.show_media_count)
        this.numMedia = creatorStat.num_media
    }
  }
}
