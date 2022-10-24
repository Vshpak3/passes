import { DtoProperty } from '../../../web/dto.web'

export class IsFollowingDto {
  @DtoProperty({ type: 'boolean' })
  isFollowing: boolean

  constructor(isFollowing: boolean) {
    this.isFollowing = isFollowing
  }
}
