import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class CreatorStatDto {
  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  numFollowers: number

  @DtoProperty()
  numLikes: number

  constructor(creatorStat) {
    if (creatorStat) {
      this.userId = creatorStat.user_id
      this.numFollowers = creatorStat.num_followers
      this.numLikes = creatorStat.num_likes
    }
  }
}
