import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
export class FollowDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty()
  followerId: string

  @IsUUID()
  @DtoProperty()
  creatorId: string

  @DtoProperty()
  isActive: boolean

  constructor(follow) {
    this.id = follow.id
    this.followerId = follow.follower_id
    this.creatorId = follow.creator_id
    this.isActive = follow.is_active
  }
}
