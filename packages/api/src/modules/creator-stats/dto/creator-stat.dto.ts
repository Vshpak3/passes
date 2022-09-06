import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CreatorStatDto {
  @IsUUID()
  @ApiProperty()
  userId: string

  @ApiProperty()
  numFollowers: number

  @ApiProperty()
  numLikes: number

  constructor(creatorStat) {
    if (creatorStat) {
      this.userId = creatorStat.user_id
      this.numFollowers = creatorStat.num_followers
      this.numLikes = creatorStat.num_likes
    }
  }
}
