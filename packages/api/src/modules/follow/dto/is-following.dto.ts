import { DtoProperty } from '../../../web/dto.web'
export class IsFollowingDto {
  @DtoProperty()
  isFollowing: boolean

  constructor(isFollowing: boolean) {
    this.isFollowing = isFollowing
  }
}
